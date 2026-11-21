const { chromium } = require('playwright');
const fs = require('node:fs'); const path = require('node:path'); const http = require('node:http');
(async () => {
  const dir = path.resolve('out');
  const server = http.createServer((req, res) => { const p = path.join(dir, decodeURIComponent(req.url.split('?')[0])); if (!fs.existsSync(p) || fs.statSync(p).isDirectory()) { res.writeHead(404); return res.end(); } res.writeHead(200, { 'Content-Type': { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.jpg': 'image/jpeg' }[path.extname(p)] || 'application/octet-stream' }); fs.createReadStream(p).pipe(res); }).listen(5197);
  const b = await chromium.launch(); const r = [];
  const ok = (name, cond) => r.push(`${cond ? 'PASS' : 'FAIL'} ${name}`);
  // mobile menu
  let page = await (await b.newContext({ viewport: { width: 390, height: 844 } })).newPage();
  const errs = []; page.on('pageerror', (e) => errs.push(e.message));
  await page.goto('http://localhost:5197/vereda-home.html');
  await page.click('[data-menu-open]'); await page.waitForTimeout(500);
  ok('menu drawer opens', await page.isVisible('#MenuDrawer .drawer__panel'));
  ok('menu toggle aria-expanded=true', (await page.getAttribute('[data-menu-open]', 'aria-expanded')) === 'true');
  for (let i = 0; i < 30; i++) await page.keyboard.press('Tab');
  ok('focus trapped in drawer', await page.evaluate(() => document.getElementById('MenuDrawer').contains(document.activeElement)));
  await page.click('#MenuDrawer summary.mnav__link'); ok('submenu expands', await page.isVisible('.mnav__sub'));
  await page.keyboard.press('Escape'); await page.waitForTimeout(500);
  ok('Escape closes drawer', await page.evaluate(() => document.getElementById('MenuDrawer').hidden));
  ok('focus returns to toggle', await page.evaluate(() => document.activeElement.matches('[data-menu-open]')));
  await page.click('[data-search-open]'); ok('search overlay opens + focuses input', await page.evaluate(() => document.activeElement.id === 'HeaderSearch'));
  await page.keyboard.press('Escape'); ok('search closes', await page.evaluate(() => document.getElementById('SearchOverlay').hidden));
  // desktop dropdown
  page = await (await b.newContext({ viewport: { width: 1440, height: 900 } })).newPage();
  page.on('pageerror', (e) => errs.push(e.message));
  await page.goto('http://localhost:5197/vereda-home.html');
  await page.focus('.nav__disclosure summary'); await page.keyboard.press('Enter');
  ok('dropdown opens with keyboard', await page.isVisible('.nav__dropdown'));
  ok('summary aria-expanded', (await page.getAttribute('.nav__disclosure summary', 'aria-expanded')) === 'true');
  await page.keyboard.press('Escape'); ok('Escape closes dropdown', !(await page.isVisible('.nav__dropdown')));
  // product: option click changes checked state, gallery zoom
  await page.goto('http://localhost:5197/vereda-product.html');
  await page.click('.gallery__zoom'); ok('zoom dialog opens', await page.evaluate(() => document.querySelector('.zoom-dialog').open));
  await page.keyboard.press('Escape'); ok('zoom closes', await page.evaluate(() => !document.querySelector('.zoom-dialog').open));
  ok('quantity +', await (async () => { await page.click('.pdp__qty [name="plus"]'); return (await page.inputValue('.pdp__qty input')) === '2'; })());
  // reel duplicates
  ok('no JS errors', errs.length === 0); if (errs.length) console.log(errs);
  console.log(r.join('\n')); await b.close(); server.close();
})();
