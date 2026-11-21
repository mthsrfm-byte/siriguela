// Local preview renderer for visual QA only. It approximates Shopify's Liquid
// runtime with mocked shop data so layouts can be screenshotted and audited
// without a store. It is NOT part of the theme and never ships.
import { Liquid, Tag, Hash } from 'liquidjs';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildData } from './data.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const THEME = path.resolve(here, '../../theme');
const OUT = path.resolve(here, 'out');
fs.mkdirSync(OUT, { recursive: true });
fs.cpSync(path.join(THEME, 'assets'), path.join(OUT, 'assets'), { recursive: true });
fs.cpSync(path.join(here, 'img'), path.join(OUT, 'img'), { recursive: true });

const readJSON = (p) => JSON.parse(fs.readFileSync(p, 'utf8'));
const locale = readJSON(path.join(THEME, 'locales/en.default.json'));
const settingsData = readJSON(path.join(THEME, 'config/settings_data.json'));
const PRESET = process.env.PRESET || 'Vereda';

const engine = new Liquid({
  root: [path.join(THEME, 'snippets')],
  partials: path.join(THEME, 'snippets'),
  extname: '.liquid',
  strictFilters: false,
  strictVariables: false,
  jsTruthy: false,
  dynamicPartials: true,
  ownPropertyOnly: false,
});

/* ---------------- helpers ---------------- */
const lookup = (key) => key.split('.').reduce((o, k) => (o ? o[k] : undefined), locale);
const money = (cents) => `$${(Number(cents || 0) / 100).toFixed(2)}`;
const imgSrc = (img) => (img && typeof img === 'object' ? img.src : img);
const attrs = (o) => Object.entries(o).filter(([, v]) => v !== undefined && v !== null && v !== false && v !== '').map(([k, v]) => `${k}="${String(v).replace(/"/g, '&quot;')}"`).join(' ');

class ImgURL { constructor(img, width) { this.img = img; this.width = width; } toString() { return imgSrc(this.img); } }

/* ---------------- filters ---------------- */
engine.registerFilter('t', (key, ...args) => {
  const vars = Object.fromEntries(args.filter(Array.isArray));
  let v = lookup(key);
  if (v && typeof v === 'object') {
    const c = vars.count;
    v = (c === 0 && v.zero) || (c === 1 && v.one) || v.other;
  }
  if (v === undefined) return `[missing ${key}]`;
  return String(v).replace(/{{\s*(\w+)\s*}}/g, (_, k) => vars[k] ?? '');
});
engine.registerFilter('money', money);
engine.registerFilter('money_with_currency', (c) => `${money(c)} USD`);
engine.registerFilter('money_without_currency', (c) => (Number(c || 0) / 100).toFixed(2));
engine.registerFilter('image_url', (img, opts) => new ImgURL(img, opts && opts.width));
engine.registerFilter('image_tag', (u, ...args) => {
  const o = Object.fromEntries(args.filter(Array.isArray));
  const img = u instanceof ImgURL ? u.img : u;
  const w = img && img.width; const h = img && img.height;
  return `<img alt="${o.alt ?? (img && img.alt) ?? ''}" ${attrs({ src: u.toString(), width: o.width || w, height: o.height || h, loading: o.loading, fetchpriority: o.fetchpriority, sizes: o.sizes, class: o.class })}>`;
});
engine.registerFilter('placeholder_svg_tag', (name, cls) => `<svg class="${cls || ''}" viewBox="0 0 525 525" xmlns="http://www.w3.org/2000/svg"><rect width="525" height="525" fill="currentColor" opacity=".08"/><path d="M190 340h145l-30-60-35 40-25-25z" fill="currentColor" opacity=".3"/></svg>`);
engine.registerFilter('asset_url', (f) => `assets/${f}`);
engine.registerFilter('shopify_asset_url', (f) => `assets/${f}`);
engine.registerFilter('stylesheet_tag', (u) => `<link rel="stylesheet" href="${u}">`);
engine.registerFilter('font_face', () => '');
engine.registerFilter('font_modify', (f) => f);
engine.registerFilter('font_url', () => '');
engine.registerFilter('preload_tag', () => '');
engine.registerFilter('json', (v) => JSON.stringify(v ?? null));
engine.registerFilter('handleize', (s) => String(s).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''));
engine.registerFilter('handle', (s) => String(s).toLowerCase().replace(/[^a-z0-9]+/g, '-'));
engine.registerFilter('link_to', (text, url) => `<a href="${url}">${text}</a>`);
engine.registerFilter('link_to_tag', (text, tag) => `<a href="#${tag}">${text}</a>`);
engine.registerFilter('payment_type_svg_tag', (t) => `<svg class="payment-icon" viewBox="0 0 38 24"><rect width="38" height="24" rx="3" fill="#fff" stroke="#ccc"/><text x="19" y="15" font-size="7" text-anchor="middle">${t}</text></svg>`);
engine.registerFilter('payment_terms', () => '<span>Pay in 4 interest-free installments with Shop Pay</span>');
engine.registerFilter('payment_button', () => '<button type="button" class="button button--secondary button--full">Buy with Shop Pay</button>');
engine.registerFilter('structured_data', () => '{}');
engine.registerFilter('time_tag', (d) => `<time>${new Date(d).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</time>`);
engine.registerFilter('default_errors', () => 'Please check the form.');
engine.registerFilter('video_tag', () => '<video muted playsinline loop></video>');
engine.registerFilter('media_tag', () => '');
engine.registerFilter('external_video_url', () => '');
engine.registerFilter('external_video_tag', () => '');
engine.registerFilter('model_viewer_tag', () => '');
engine.registerFilter('login_button', () => '<button type="button" class="button button--secondary button--small">Follow on Shop</button>');
engine.registerFilter('format_address', (a) => String(a || ''));
engine.registerFilter('format_code', (c) => c);
engine.registerFilter('url_encode', (s) => encodeURIComponent(s));

/* ---------------- tags ---------------- */
const passthrough = (name) => engine.registerTag(name, class extends Tag {
  constructor(token, remain, liquid) {
    super(token, remain, liquid);
    this.tpls = [];
    const stream = this.liquid.parser.parseStream(remain)
      .on(`tag:end${name}`, () => stream.stop())
      .on('template', (t) => this.tpls.push(t))
      .on('end', () => { throw new Error(`${name} not closed`); });
    stream.start();
  }
  * render(ctx, emitter) { yield this.liquid.renderer.renderTemplates(this.tpls, ctx, emitter); }
});
const swallow = (name) => engine.registerTag(name, class extends Tag {
  constructor(token, remain, liquid) {
    super(token, remain, liquid);
    while (remain.length) { const t = remain.shift(); if (t.name === `end${name}`) return; }
  }
  render() { return ''; }
});
swallow('schema');
swallow('doc');
swallow('javascript');
swallow('stylesheet');

engine.registerTag('style', class extends Tag {
  constructor(token, remain, liquid) {
    super(token, remain, liquid);
    this.tpls = [];
    const stream = this.liquid.parser.parseStream(remain).on('tag:endstyle', () => stream.stop()).on('template', (t) => this.tpls.push(t));
    stream.start();
  }
  * render(ctx) { const html = yield this.liquid.renderer.renderTemplates(this.tpls, ctx); return `<style>${html}</style>`; }
});

engine.registerTag('form', class extends Tag {
  constructor(token, remain, liquid) {
    super(token, remain, liquid);
    this.args = token.args;
    this.tpls = [];
    const stream = this.liquid.parser.parseStream(remain).on('tag:endform', () => stream.stop()).on('template', (t) => this.tpls.push(t));
    stream.start();
  }
  * render(ctx) {
    const type = (this.args.match(/'([^']+)'/) || [])[1];
    const hash = yield new Hash(this.args.replace(/^\s*'[^']+'\s*,?\s*(\w+\s*,)?/, '')).render(ctx);
    ctx.push({ form: { errors: false, posted_successfully: false } });
    const inner = yield this.liquid.renderer.renderTemplates(this.tpls, ctx);
    ctx.pop();
    const extra = Object.entries(hash).filter(([k]) => !['id', 'class'].includes(k)).map(([k, v]) => `${k.replace(/_/g, '-')}="${v}"`).join(' ');
    const action = type === 'product' ? '/cart/add' : '/';
    return `<form method="post" action="${action}" ${attrs({ id: hash.id, class: hash.class })} ${extra}>${inner}</form>`;
  }
});

engine.registerTag('paginate', class extends Tag {
  constructor(token, remain, liquid) {
    super(token, remain, liquid);
    this.tpls = [];
    const stream = this.liquid.parser.parseStream(remain).on('tag:endpaginate', () => stream.stop()).on('template', (t) => this.tpls.push(t));
    stream.start();
  }
  * render(ctx) {
    ctx.push({ paginate: { pages: 1, current_page: 1, current_offset: 0, parts: [] } });
    const html = yield this.liquid.renderer.renderTemplates(this.tpls, ctx);
    ctx.pop();
    return html;
  }
});

/* ---------------- sections ---------------- */
const schemaOf = (file) => {
  const src = fs.readFileSync(file, 'utf8');
  const m = src.match(/{%\s*schema\s*%}([\s\S]*?){%\s*endschema\s*%}/);
  return m ? JSON.parse(m[1]) : { settings: [] };
};
const defaults = (list = []) => Object.fromEntries(list.filter((s) => s.id).map((s) => [s.id, s.default ?? null]));

const withSchemeRefs = (settings, globals) => settings;

async function renderSection(type, data, id, globals) {
  const file = path.join(THEME, 'sections', `${type}.liquid`);
  const schema = schemaOf(file);
  const settings = { ...defaults(schema.settings), ...(data.settings || {}) };
  for (const s of schema.settings || []) {
    if (['collection', 'product'].includes(s.type) && typeof settings[s.id] === 'string') settings[s.id] = globals.resolve(settings[s.id]);
    if (s.type === 'collection' && settings[s.id] == null && globals.defaultCollection) settings[s.id] = globals.defaultCollection;
    if (s.type === 'link_list' && typeof settings[s.id] === 'string') settings[s.id] = globals.linklists[settings[s.id]];
    if (s.type === 'image_picker' && typeof settings[s.id] === 'string') settings[s.id] = globals.image(settings[s.id]);
    if (s.type === 'image_picker' && settings[s.id] == null && s.id !== 'cover') settings[s.id] = globals.fill(type, s.id);
  }
  const order = data.block_order || Object.keys(data.blocks || {});
  const blocks = order.map((bid) => {
    const b = data.blocks[bid];
    const bs = (schema.blocks || []).find((x) => x.type === b.type) || {};
    const bset = { ...defaults(bs.settings), ...(b.settings || {}) };
    for (const s of bs.settings || []) {
      if (s.type === 'image_picker' && typeof bset[s.id] === 'string') bset[s.id] = globals.image(bset[s.id]);
      if (s.type === 'image_picker' && bset[s.id] == null) bset[s.id] = globals.fill(type, s.id);
      if (['collection', 'product'].includes(s.type) && typeof bset[s.id] === 'string') bset[s.id] = globals.resolve(bset[s.id]);
      if (s.type === 'link_list' && typeof bset[s.id] === 'string') bset[s.id] = globals.linklists[bset[s.id]];
    }
    return { id: bid, type: b.type, settings: bset, shopify_attributes: '' };
  });
  const section = { id, settings, blocks, index: globals.sectionIndex++ };
  const html = await engine.parseAndRender(fs.readFileSync(file, 'utf8'), { section }, { globals: globals.vars });
  return `<div id="shopify-section-${id}" class="shopify-section">${html}</div>`;
}

async function renderGroup(name, globals) {
  const group = readJSON(path.join(THEME, 'sections', `${name}.json`));
  let html = '';
  for (const id of group.order) html += await renderSection(group.sections[id].type, group.sections[id], id, globals);
  return html;
}

engine.registerTag('sections', class extends Tag {
  constructor(token, remain, liquid) { super(token, remain, liquid); this.name = token.args.replace(/['"\s]/g, ''); }
  * render(ctx) { return yield renderGroup(this.name, ctx.getAll().__globals); }
});
engine.registerTag('section', class extends Tag {
  constructor(token, remain, liquid) { super(token, remain, liquid); this.name = token.args.replace(/['"\s]/g, ''); }
  * render(ctx) { return yield renderSection(this.name, {}, this.name, ctx.getAll().__globals); }
});

/* ---------------- pages ---------------- */
export async function renderPage(page, templateName, extra = {}) {
  const preset = settingsData.presets[PRESET];
  const data = buildData(preset, extra);
  const globals = { ...data.helpers, sectionIndex: 1 };
  const vars = { ...data.vars, __globals: globals, template: { name: templateName.split('.')[0] } };
  globals.vars = vars;
  const tplPath = fs.existsSync(path.join(here, `../../theme/listings/${PRESET.toLowerCase()}/templates/${templateName}.json`)) && templateName === 'index'
    ? path.join(THEME, `listings/${PRESET.toLowerCase()}/templates/${templateName}.json`)
    : path.join(THEME, `templates/${templateName}.json`);
  const tpl = readJSON(tplPath);
  let content = '';
  for (const id of tpl.order) content += await renderSection(tpl.sections[id].type, tpl.sections[id], id, globals);
  vars.content_for_layout = content;
  const layout = fs.readFileSync(path.join(THEME, `layout/${tpl.layout || 'theme'}.liquid`), 'utf8');
  const html = await engine.parseAndRender(layout, {}, { globals: vars });
  const out = path.join(OUT, `${PRESET.toLowerCase()}-${page}.html`);
  const fontsLink = '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&family=Lora:wght@400;500&family=Space+Mono&display=swap">';
  fs.writeFileSync(out, html.replace('</head>', `${fontsLink}</head>`));
  return out;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const pages = [
    ['home', 'index', {}],
    ['collection', 'collection', { page_type: 'collection' }],
    ['product', 'product', { page_type: 'product' }],
    ['product-sale', 'product', { page_type: 'product', productIndex: 2 }],
    ['cart', 'cart', { page_type: 'cart', cartItems: 2 }],
    ['cart-empty', 'cart', { page_type: 'cart', cartItems: 0 }],
    ['search', 'search', { page_type: 'search' }],
    ['404', '404', { page_type: '404' }],
    ['blog', 'blog', { page_type: 'blog' }],
  ];
  for (const [name, tpl, extra] of pages) {
    try { console.log('ok', await renderPage(name, tpl, extra)); } catch (e) { console.error('FAIL', name, e.message); }
  }
}
