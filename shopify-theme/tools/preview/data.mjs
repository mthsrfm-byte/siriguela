// Mock storefront data for the local preview. Product names and copy are
// original placeholder content for the fictional demo brand.
import { Drop } from 'liquidjs';

class Val extends Drop {
  constructor(v, props = {}) { super(); this.v = v; Object.assign(this, props); }
  valueOf() { return this.v; }
  toString() { return String(this.v); }
}
class Color extends Val {
  constructor(hex) {
    super(hex);
    const n = parseInt(hex.slice(1), 16);
    this.red = (n >> 16) & 255; this.green = (n >> 8) & 255; this.blue = n & 255;
  }
}

const img = (name, w = 1000, h = 1250, alt = '') => ({ src: `img/${name}.jpg`, width: w, height: h, aspect_ratio: w / h, alt, presentation: { focal_point: '50% 50%' } });

const CATALOG = [
  { title: 'Linen overshirt', price: 16800, sizes: ['XS', 'S', 'M', 'L', 'XL'], sold: ['XS'] },
  { title: 'Cord trouser', price: 14500, sizes: ['28', '30', '32', '34', '36'] },
  { title: 'Field tote in waxed canvas', price: 9800, compare: 12800, sizes: null },
  { title: 'Merino crew', price: 13200, colors: [['Oat', '#D8CBB5'], ['Ink', '#1E2430'], ['Rust', '#A4573F']], sizes: ['S', 'M', 'L'] },
  { title: 'Stoneware carafe', price: 6400, sizes: null, available: false },
  { title: 'Wool scarf, herringbone', price: 8900, sizes: null },
  { title: 'Leather card sleeve', price: 5200, compare: 6500, sizes: null },
  { title: 'Heavy cotton tee with an unusually long product name to test wrapping', price: 4800, sizes: ['S', 'M', 'L', 'XL'] },
];

function buildProduct(def, i) {
  const n = i + 1;
  const media = [img(`p${n}`, 1000, 1250, def.title), img(`p${n}b`, 1000, 1250, `${def.title}, detail`), img(`l${(i % 6) + 1}`, 1200, 1500, `${def.title}, worn`)]
    .map((im, k) => ({ id: n * 10 + k, media_type: 'image', preview_image: im, aspect_ratio: im.aspect_ratio }));
  const available = def.available !== false;
  const options = [];
  if (def.colors) options.push({ name: 'Color', values: def.colors.map(([c]) => c), swatches: Object.fromEntries(def.colors) });
  if (def.sizes) options.push({ name: 'Size', values: def.sizes });
  const variants = [];
  if (!options.length) variants.push({ id: n * 100, title: 'Default Title', available, price: def.price, compare_at_price: def.compare || null });
  else {
    const [a, b] = options;
    const combos = b ? a.values.flatMap((x) => b.values.map((y) => [x, y])) : a.values.map((x) => [x]);
    combos.forEach((c, k) => variants.push({ id: n * 100 + k, title: c.join(' / '), options: c, available: available && !(def.sold || []).includes(c[c.length - 1]), price: def.price, compare_at_price: def.compare || null }));
  }
  variants.forEach((v) => { v.quantity_rule = { min: 1, max: null, increment: 1 }; v.featured_media = media[0]; });
  const selected = variants.find((v) => v.available) || variants[0];
  const options_with_values = options.map((o, oi) => ({
    name: o.name, position: oi + 1, selected_value: new Val(selected.options[oi]),
    values: o.values.map((v, vi) => new Val(v, {
      id: (n * 1000) + oi * 50 + vi,
      selected: selected.options[oi] === v,
      available: variants.some((x) => x.options[oi] === v && x.available),
      swatch: o.swatches ? { color: new Color(o.swatches[v]) } : null,
    })),
  }));
  return {
    id: n, title: def.title, handle: `p-${n}`, url: `#product-${n}`, vendor: 'Vereda Studio',
    price: def.price, price_min: def.price, price_varies: false, compare_at_price: def.compare || null,
    available, media, featured_media: media[0], featured_image: media[0].preview_image, images: media.map((m) => m.preview_image),
    options: options.map((o) => o.name), options_with_values, variants, selected_or_first_available_variant: selected,
    has_only_default_variant: !options.length,
    description: '<p>Cut generously from washed linen that softens with every wear. Garment-dyed in small batches, so each piece carries slight variations in tone.</p><p>Made in Portugal by a family workshop we have worked with since our first season.</p>',
    'gift_card?': false, tags: [],
  };
}

export function buildData(preset, extra = {}) {
  const products = CATALOG.map(buildProduct);
  const product = products[extra.productIndex || 0];
  const collection = {
    title: 'New arrivals', url: '#collection', handle: 'all', products, products_count: products.length, all_products_count: products.length,
    description: '<p>The current season, photographed in the studio and in the field.</p>', image: null,
    filters: [
      { label: 'Availability', type: 'boolean', param_name: 'filter.v.availability', presentation: 'text', active_values: [], values: [{ label: 'In stock', value: '1', param_name: 'filter.v.availability', count: 7, active: false }, { label: 'Out of stock', value: '0', param_name: 'filter.v.availability', count: 1, active: false }] },
      { label: 'Color', type: 'list', param_name: 'filter.v.option.color', presentation: 'swatch', active_values: [{ label: 'Oat', url_to_remove: '#' }], values: [{ label: 'Oat', value: 'Oat', param_name: 'filter.v.option.color', count: 3, active: true, swatch: { color: new Color('#D8CBB5') } }, { label: 'Ink', value: 'Ink', param_name: 'filter.v.option.color', count: 2, active: false, swatch: { color: new Color('#1E2430') } }] },
      { label: 'Price', type: 'price_range', param_name: 'filter.v.price', range_max: 16800, min_value: { param_name: 'filter.v.price.gte', value: null }, max_value: { param_name: 'filter.v.price.lte', value: null }, active_values: [], url_to_remove: '#' },
    ],
    sort_options: [{ value: 'manual', name: 'Featured' }, { value: 'price-ascending', name: 'Price, low to high' }, { value: 'created-descending', name: 'Date, new to old' }],
    sort_by: 'manual', default_sort_by: 'manual', url: '#collection',
  };
  const nItems = extra.cartItems ?? 0;
  const items = products.slice(0, nItems).map((p, i) => ({
    index: i, key: `k${i}`, url: p.url, title: p.title, product: p, variant: p.selected_or_first_available_variant, image: p.featured_image,
    quantity: i + 1, final_line_price: p.price * (i + 1), original_line_price: (p.compare_at_price || p.price) * (i + 1),
    options_with_values: p.has_only_default_variant ? [] : p.options_with_values.map((o) => ({ name: o.name, value: o.selected_value })),
    properties: {}, line_level_discount_allocations: [], url_to_remove: '#',
  }));
  const cart = {
    items, item_count: items.reduce((a, i) => a + i.quantity, 0), total_price: items.reduce((a, i) => a + i.final_line_price, 0),
    'empty?': items.length === 0, cart_level_discount_applications: [], taxes_included: false, currency: { iso_code: 'USD', symbol: '$' }, note: '',
  };
  const font = (family, fallback) => ({ family, fallback_families: fallback, weight: 400, style: 'normal', 'system?': false });
  const fontMap = { inter_n5: font('Inter', 'sans-serif'), inter_n4: font('Inter', 'sans-serif'), space_mono_n4: font('"Space Mono"', 'monospace'), lora_n4: font('Lora', 'serif') };
  const settings = { ...preset };
  settings.type_heading_font = { ...fontMap[preset.type_heading_font], weight: preset.type_heading_font.endsWith('5') ? 500 : 400 };
  settings.type_body_font = fontMap[preset.type_body_font];
  settings.type_meta_font = fontMap[preset.type_meta_font];
  const schemes = Object.entries(preset.color_schemes).map(([id, s]) => ({
    id, settings: Object.fromEntries(Object.entries(s.settings).map(([k, v]) => [k, k === 'background_gradient' ? v : new Color(v)])),
  }));
  settings.color_schemes = schemes;
  settings.logo = null; settings.favicon = null;

  const menu = { links: [
    { title: 'Shop', url: '#', links: [{ title: 'New arrivals', url: '#', links: [] }, { title: 'Clothing', url: '#', links: [{ title: 'Shirts', url: '#' }, { title: 'Knitwear', url: '#' }] }, { title: 'Objects', url: '#', links: [] }, { title: 'Gift cards', url: '#', links: [] }] },
    { title: 'Lookbook', url: '#', links: [] }, { title: 'Journal', url: '#', links: [] }, { title: 'About', url: '#', links: [] },
  ] };
  const footerMenu = { links: [{ title: 'Shipping', url: '#' }, { title: 'Returns', url: '#' }, { title: 'Care guide', url: '#' }, { title: 'Contact', url: '#' }] };
  const article = (i) => ({ title: ['Notes from the linen mill', 'How we choose a workshop', 'A field guide to waxed canvas', 'Packing for a slow weekend'][i], url: '#', image: img(`l${i + 1}`, 1200, 1500), published_at: '2026-10-0' + (i + 1), author: 'Studio', excerpt: '', content: 'A visit to the family mill in northern Portugal where our linen is woven, washed and finished before it reaches the cutting table.' });
  const vars = {
    settings, product, collection, cart, customer: null,
    products, recommendations: { performed: true, products: products.slice(1, 5), products_count: 4 },
    shop: { name: 'Vereda Studio', url: '', description: '', customer_accounts_enabled: true, enabled_payment_types: ['visa', 'master', 'amex', 'paypal'], policies: [{ title: 'Refund policy', url: '#' }, { title: 'Privacy policy', url: '#' }, { title: 'Terms of service', url: '#' }], shipping_policy: { body: 'x', url: '#' } },
    routes: { root_url: '/', cart_url: '/cart', cart_add_url: '/cart/add', cart_change_url: '/cart/change', predictive_search_url: '/search/suggest', search_url: '/search', account_url: '/account', account_login_url: '/account/login', all_products_collection_url: '/collections/all', product_recommendations_url: '/recommendations/products' },
    request: { locale: { iso_code: 'en' }, page_type: extra.page_type || 'index' },
    localization: { available_countries: [{ iso_code: 'US', name: 'United States', currency: { iso_code: 'USD', symbol: '$' } }, { iso_code: 'PT', name: 'Portugal', currency: { iso_code: 'EUR', symbol: '€' } }], available_languages: [{ iso_code: 'en', endonym_name: 'English' }, { iso_code: 'pt-BR', endonym_name: 'português' }], country: { iso_code: 'US' }, language: { iso_code: 'en' } },
    linklists: { 'main-menu': menu, footer: footerMenu },
    blog: { title: 'Journal', url: '#', articles: [0, 1, 2, 3].map(article), all_tags: ['Materials', 'Makers', 'Travel'], 'comments_enabled?': false },
    search: { performed: true, terms: 'linen', results: products.slice(0, 3), results_count: 3, filters: collection.filters, sort_options: collection.sort_options, sort_by: 'relevance', default_sort_by: 'relevance', products_count: 3 },
    canonical_url: '/', page_title: 'Vereda Studio', powered_by_link: '<a href="#" rel="nofollow">Powered by Shopify</a>', content_for_header: '',
    additional_checkout_buttons: false, current_page: 1, current_tags: null,
  };
  const helpers = {
    linklists: vars.linklists,
    image: (name) => img(name),
    resolve: () => collection,
    defaultCollection: collection,
    fill: (type, id) => {
      if (type === 'hero') return id === 'image_mobile' ? img('hero-m', 1080, 1920) : img('hero', 2400, 1200);
      if (type === 'facts') return null;
      helpers.k = ((helpers.k || 0) % 6) + 1;
      return img(`l${helpers.k}`, 1200, 1500, 'Lifestyle placeholder');
    },
  };
  return { vars, helpers };
}
