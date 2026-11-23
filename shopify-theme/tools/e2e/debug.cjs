const { chromium } = require('playwright');
const STORE = `https://${process.env.STORE}`;
(async () => {
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 } });
  const page = await ctx.newPage();
  await page.goto(`${STORE}/password`);
  if (await page.$('input[type="password"]')) {
    if (await page.$('details.password__login')) await page.click('details.password__login summary');
    await page.fill('input[type="password"]', process.env.STORE_PASSWORD);
    await page.press('input[type="password"]', 'Enter');
    await page.waitForLoadState('load');
  }
  await page.goto(`${STORE}/?preview_theme_id=${process.env.THEME_ID}`);
  await page.waitForLoadState('networkidle').catch(() => {});
  const info = await page.evaluate(() => {
    const panel = document.querySelector('#CartDrawer .drawer__panel');
    const cs = getComputedStyle(panel);
    const body = getComputedStyle(document.body);
    const reveal = [...document.querySelectorAll('[data-reveal]')];
    return {
      panelClass: panel.className, panelBg: cs.backgroundColor, panelBgImg: cs.backgroundImage,
      panelVarBg: cs.getPropertyValue('--color-bg'), gradient: cs.getPropertyValue('--gradient-bg'),
      bodyClass: document.body.className, bodyBg: body.backgroundColor,
      reveal: reveal.length, revealIn: reveal.filter((e) => e.classList.contains('is-in')).length,
      styleSnippet: [...document.querySelectorAll('style')].map((s) => s.textContent).find((t) => t.includes('--color-bg'))?.slice(0, 700),
    };
  });
  console.log(JSON.stringify(info, null, 1));
  await page.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 500) { scrollTo(0, y); await new Promise((r) => setTimeout(r, 150)); } });
  await page.waitForTimeout(1000);
  console.log('after scroll', await page.evaluate(() => [...document.querySelectorAll('[data-reveal]')].filter((e) => !e.classList.contains('is-in')).map((e) => e.className).slice(0, 8)));
  await b.close();
})();
