const { chromium } = require('playwright');
const fs = require('node:fs'); const path = require('node:path'); const http = require('node:http');
(async () => {
  const dir = path.resolve('out');
  const server = http.createServer((req, res) => { const p = path.join(dir, decodeURIComponent(req.url.split('?')[0])); if (!fs.existsSync(p) || fs.statSync(p).isDirectory()) { res.writeHead(404); return res.end(); } res.writeHead(200, { 'Content-Type': { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.jpg': 'image/jpeg' }[path.extname(p)] || 'application/octet-stream' }); fs.createReadStream(p).pipe(res); }).listen(5198);
  const axe = fs.readFileSync(require.resolve('axe-core/axe.min.js'), 'utf8');
  const browser = await chromium.launch();
  for (const vp of [{ width: 1440, height: 900 }, { width: 390, height: 844 }]) {
    const page = await (await browser.newContext({ viewport: vp, reducedMotion: 'reduce' })).newPage();
    for (const f of fs.readdirSync(dir).filter((x) => x.endsWith('.html'))) {
      await page.goto(`http://localhost:5198/${f}`); await page.waitForTimeout(300);
      await page.addScriptTag({ content: axe });
      const r = await page.evaluate(async () => (await axe.run(document, { runOnly: ['wcag2a', 'wcag2aa', 'wcag21aa', 'best-practice'] })).violations.map((v) => ({ id: v.id, impact: v.impact, n: v.nodes.length, t: v.nodes.slice(0, 2).map((x) => x.target.join(' ') + ' :: ' + (x.failureSummary || '').split('\n').slice(1, 2).join('')) })));
      if (r.length) console.log(vp.width, f, JSON.stringify(r, null, 0));
    }
  }
  await browser.close(); server.close();
})();
