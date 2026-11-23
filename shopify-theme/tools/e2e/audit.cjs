// axe-core + Lighthouse against the real development store (preview theme).
const { chromium } = require('playwright');
const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');

const STORE = `https://${process.env.STORE}`;
const THEME = process.env.THEME_ID;
const LH = path.resolve(__dirname, '../preview/node_modules/.bin/lighthouse');
const AXE = fs.readFileSync(require.resolve(path.resolve(__dirname, '../preview/node_modules/axe-core/axe.min.js')), 'utf8');
const PAGES = { home: '/', collection: '/collections/all', product: '/products/linen-overshirt', cart: '/cart', search: '/search?q=linen' };
const AXE_ONLY = process.env.AXE_ONLY === '1';

(async () => {
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  await page.goto(`${STORE}/password`);
  if (await page.$('input[type="password"]')) {
    if (await page.$('details.password__login')) await page.click('details.password__login summary');
    await page.fill('input[type="password"]', process.env.STORE_PASSWORD);
    await page.press('input[type="password"]', 'Enter');
    await page.waitForLoadState('load');
  }
  const cookies = await ctx.cookies();
  const cookieHeader = cookies.filter((c) => c.domain.includes(process.env.STORE)).map((c) => `${c.name}=${c.value}`).join('; ');
  for (const vp of [{ width: 1440, height: 900 }, { width: 390, height: 844 }]) {
    await page.setViewportSize(vp);
    for (const [name, p] of Object.entries(PAGES)) {
      const sep = p.includes('?') ? '&' : '?';
      await page.goto(`${STORE}${p}${sep}preview_theme_id=${THEME}`);
      await page.waitForLoadState('networkidle').catch(() => {});
      await page.evaluate(() => document.querySelectorAll('[data-reveal]').forEach((e) => e.classList.add('is-in')));
      await page.waitForTimeout(1200);
      await page.addScriptTag({ content: AXE });
      const v = await page.evaluate(async () => (await axe.run(document, { runOnly: ['wcag2a', 'wcag2aa', 'wcag21aa'], exclude: [['#preview-bar-iframe'], ['iframe']] })).violations
        .map((x) => ({ id: x.id, impact: x.impact, n: x.nodes.length, where: x.nodes.slice(0, 2).map((n) => n.target.join(' ')) })));
      console.log(`AXE ${vp.width} ${name}: ${v.length ? JSON.stringify(v) : 'OK'}`);
    }
  }
  await b.close();

  if (AXE_ONLY) return;
  const chrome = require('playwright').chromium.executablePath();
  const out = path.resolve(__dirname, 'lighthouse');
  fs.mkdirSync(out, { recursive: true });
  const scores = [];
  for (const name of ['home', 'collection', 'product']) {
    for (const ff of ['mobile', 'desktop']) {
      const file = path.join(out, `${name}-${ff}.json`);
      const args = [`${STORE}${PAGES[name]}?preview_theme_id=${THEME}`, '--only-categories=performance,accessibility,best-practices,seo',
        '--chrome-flags=--headless=new --no-sandbox', '--output=json', `--output-path=${file}`, '--quiet',
        `--extra-headers=${JSON.stringify({ Cookie: cookieHeader })}`];
      if (ff === 'desktop') args.push('--preset=desktop');
      try { execFileSync(LH, args, { env: { ...process.env, CHROME_PATH: chrome }, stdio: 'ignore', timeout: 180000 }); } catch (e) { /* report below */ }
      if (!fs.existsSync(file)) { console.log(`LH ${name} ${ff}: failed`); continue; }
      const d = JSON.parse(fs.readFileSync(file, 'utf8'));
      const c = Object.fromEntries(Object.entries(d.categories).map(([k, v]) => [k, Math.round(v.score * 100)]));
      scores.push(c);
      console.log(`LH ${name} ${ff}: ${JSON.stringify(c)} LCP ${d.audits['largest-contentful-paint'].displayValue} CLS ${d.audits['cumulative-layout-shift'].displayValue} TBT ${d.audits['total-blocking-time'].displayValue}`);
    }
  }
  const avg = (k) => Math.round(scores.reduce((a, s) => a + (s[k] || 0), 0) / scores.length);
  console.log(`LH AVERAGE performance ${avg('performance')} accessibility ${avg('accessibility')} (Theme Store minimum: 60 / 90)`);
})();
