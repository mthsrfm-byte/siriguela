(async () => {
const { chromium } = require('playwright');
const path = require('node:path');
const fs = require('node:fs');
const http = require('node:http');
const dir = path.resolve(process.argv[2] || 'out');
const shots = path.resolve(process.argv[3] || 'shots');
fs.mkdirSync(shots, { recursive: true });
const server = http.createServer((req, res) => {
  const p = path.join(dir, decodeURIComponent(req.url.split('?')[0]));
  if (!fs.existsSync(p) || fs.statSync(p).isDirectory()) { res.writeHead(404); return res.end(); }
  const ext = path.extname(p);
  res.writeHead(200, { 'Content-Type': { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.jpg': 'image/jpeg' }[ext] || 'application/octet-stream' });
  fs.createReadStream(p).pipe(res);
}).listen(5199);
const pages = (process.env.PAGES || fs.readdirSync(dir).filter((f) => f.endsWith('.html')).join(',')).split(',');
const browser = await chromium.launch();
for (const [label, vp] of [['desktop', { width: 1440, height: 900 }], ['mobile', { width: 390, height: 844 }]]) {
  const ctx = await browser.newContext({ viewport: vp, deviceScaleFactor: 1, reducedMotion: 'reduce' });
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  for (const f of pages) {
    await page.goto(`http://localhost:5199/${f}`, { waitUntil: 'load' });
    await page.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 600) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 60)); } window.scrollTo(0, 0); });
    await page.waitForTimeout(400);
    await page.screenshot({ path: path.join(shots, `${f.replace('.html', '')}-${label}.png`), fullPage: true });
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    if (overflow > 1) console.log(`OVERFLOW ${f} ${label}: ${overflow}px`);
  }
  if (errors.length) console.log('JS errors', label, [...new Set(errors)]);
  await ctx.close();
}
await browser.close();
server.close();
console.log('done');
})();
