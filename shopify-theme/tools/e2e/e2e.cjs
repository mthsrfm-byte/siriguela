// End-to-end tests against a real development store.
// STORE=xxx.myshopify.com THEME_ID=123 STORE_PASSWORD=... node e2e.cjs
const { chromium } = require('playwright');
const fs = require('node:fs');
const path = require('node:path');

const STORE = `https://${process.env.STORE}`;
const THEME = process.env.THEME_ID;
const PW = process.env.STORE_PASSWORD;
const shots = path.resolve(__dirname, 'shots');
fs.mkdirSync(shots, { recursive: true });
const results = [];
const ok = (n, c, extra = '') => results.push(`${c ? 'PASS' : 'FAIL'} ${n}${extra ? ' — ' + extra : ''}`);

async function enter(ctx) {
  const page = await ctx.newPage();
  await page.goto(`${STORE}/password`);
  if (await page.$('input[type="password"]')) {
    const d = await page.$('details.password__login');
    if (d) await page.click('details.password__login summary');
    await page.fill('input[type="password"]', PW);
    await page.press('input[type="password"]', 'Enter');
    await page.waitForLoadState('load');
  }
  await page.goto(`${STORE}/?preview_theme_id=${THEME}`);
  await page.waitForLoadState('load');
  return page;
}

(async () => {
  const b = await chromium.launch();
  for (const [label, vp] of [['desktop', { width: 1440, height: 900 }], ['mobile', { width: 390, height: 844 }]]) {
    const ctx = await b.newContext({ viewport: vp });
    const page = await enter(ctx);
    const errors = [];
    page.on('pageerror', (e) => errors.push(e.message));
    const step = async (name, fn) => { try { await fn(); } catch (e) { ok(`${label}: ${name}`, false, e.message.split('\n')[0]); } };
    const visit = async (p, name) => {
      await page.goto(STORE + p);
      await page.waitForLoadState('networkidle').catch(() => {});
      await page.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 700) { scrollTo(0, y); await new Promise((r) => setTimeout(r, 80)); } scrollTo(0, 0); });
      await page.waitForTimeout(1500);
      await page.screenshot({ path: path.join(shots, `${name}-${label}.png`), fullPage: true });
    };

    ok(`${label}: Vereda theme served`, await page.evaluate(() => !!document.querySelector('sticky-header')));
    await step('home', async () => { await visit('/', 'home'); ok(`${label}: home has products`, (await page.$$('.card')).length >= 4); });
    await step('collection', async () => {
      await visit('/collections/all', 'collection');
      ok(`${label}: collection grid`, (await page.$$('.product-grid .card')).length >= 8);
      ok(`${label}: filters render`, !!(await page.$('facet-filters')));
    });
    await step('empty collection', async () => { await visit('/collections/empty-collection', 'collection-empty'); ok(`${label}: empty collection state`, !!(await page.$('.empty-state'))); });
    await step('product + cart', async () => {
      await visit('/products/linen-overshirt', 'product');
      const url0 = page.url();
      ok(`${label}: variant picker values`, (await page.$$('.picker__value')).length >= 7);
      await page.click('label.picker__value:has-text("Ink")'); await page.waitForTimeout(1800);
      await page.click('label.picker__value:has-text("XL")'); await page.waitForTimeout(1800);
      ok(`${label}: URL updates with variant`, page.url() !== url0 && page.url().includes('variant='));
      ok(`${label}: sold-out variant disables add`, await page.$eval('.product-form__submit', (el) => el.disabled));
      await page.click('label.picker__value:has-text("M")'); await page.waitForTimeout(1800);
      ok(`${label}: available variant enables add`, !(await page.$eval('.product-form__submit', (el) => el.disabled)));
      await page.click('.product-form__submit'); await page.waitForTimeout(3000);
      ok(`${label}: add to cart opens drawer`, await page.evaluate(() => { const d = document.querySelector('cart-drawer'); return !!d && !d.hidden && d.classList.contains('is-open'); }));
      ok(`${label}: drawer has line item`, (await page.$$('cart-drawer .cart-item')).length === 1);
      ok(`${label}: cart count badge`, (await page.$eval('[data-cart-count] [aria-hidden]', (e) => e.textContent.trim())) === '1');
      await page.screenshot({ path: path.join(shots, `drawer-${label}.png`) });
      await page.click('cart-drawer .qty__btn[name="plus"]'); await page.waitForTimeout(3000);
      ok(`${label}: quantity update in drawer`, (await page.$eval('cart-drawer .qty__input', (i) => i.value)) === '2');
      await page.keyboard.press('Escape'); await page.waitForTimeout(500);
    });
    await step('sale', async () => { await visit('/products/field-tote', 'product-sale'); ok(`${label}: sale price shown`, !!(await page.$('.price--sale'))); });
    await step('sold out', async () => { await visit('/products/stoneware-carafe', 'product-soldout'); ok(`${label}: sold-out product disabled`, await page.$eval('.product-form__submit', (el) => el.disabled)); });
    await step('no image', async () => { await visit('/products/linen-napkins', 'product-noimage'); ok(`${label}: product without image renders`, !!(await page.$('.pdp__title'))); });
    await step('cart page', async () => {
      await visit('/cart', 'cart');
      ok(`${label}: cart page lists items`, (await page.$$('cart-page .cart-item')).length >= 1);
      await page.click('cart-page [data-remove]'); await page.waitForTimeout(3000);
      ok(`${label}: remove line`, (await page.$$('cart-page .cart-item')).length === 0);
    });
    await step('search', async () => {
      await visit('/search?q=linen&options%5Bprefix%5D=last', 'search');
      ok(`${label}: search results`, (await page.$$('.product-grid .card')).length >= 1);
      await visit('/search?q=zzzzqqq', 'search-empty');
      ok(`${label}: empty search state`, !!(await page.$('.empty-state')));
    });
    await step('predictive', async () => {
      await page.goto(STORE + '/');
      await page.click('[data-search-open]');
      await page.fill('#HeaderSearch', 'lin'); await page.waitForTimeout(3000);
      ok(`${label}: predictive search`, (await page.$$('#PredictiveResults [role="option"]')).length >= 1);
    });
    await step('blog', async () => { await visit('/blogs/journal', 'blog'); ok(`${label}: blog articles`, (await page.$$('.journal__item')).length >= 3); });
    await step('contact', async () => { await visit('/pages/contact', 'contact'); ok(`${label}: contact form`, !!(await page.$('#ContactForm'))); });
    await step('404', async () => { await visit('/nope-404', '404'); ok(`${label}: 404`, !!(await page.$('.not-found'))); });
    ok(`${label}: no JS errors`, errors.length === 0, [...new Set(errors)].join(' | ').slice(0, 300));
    await ctx.close();
  }
  console.log(results.join('\n'));
  await b.close();
})();
