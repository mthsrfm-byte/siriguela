# Theme Store submission checklist

Source: shopify.dev Theme Store requirements, test and submit pages, read 21 Nov 2026. ✅ done · ⚠️ done but must be verified in a real store · ❌ missing · 👤 needs a human.

## Code and architecture
- ✅ Original code; not derived from Dawn or Horizon. Skeleton consulted for conventions only.
- ✅ `layout/theme.liquid`, `layout/password.liquid`; JSON templates: index, product, collection, list-collections, cart, search, page, page.contact, blog, article, 404, password; `gift_card.liquid`.
- ✅ No `config/markets.json`, no `robots.txt.liquid`, no Sass, no minified code, no external scripts, no hard-coded store URLs (all links use `routes`).
- ✅ Header and footer are section groups; Custom Liquid section and blocks; `@app` blocks in main product, featured product, footer and Apps section.
- ✅ `lang="{{ request.locale.iso_code }}"`; `content_for_header` untouched; `powered_by_link` unchanged.
- ✅ `shopify theme check`: 82 files, 0 offenses (CLI 5.0.2).
- ✅ `product-recommendations` limited to the product template: allowed (only Custom Liquid must be available everywhere).
- ⚠️ `<shopify-account>` in the header (visible on desktop and mobile), menu setting `customer-account-main-menu`, theme tokens mapped to its CSS custom properties. Follows shopify.dev; confirm rendering in the dev store.

## Features
- ✅ Line and order discounts (cart items + summary).
- ✅ Accelerated checkout on product (on by default) and cart.
- ✅ Faceted filtering (availability, price, type, vendor, options via Search and Discovery) and sorting; works without JavaScript.
- ✅ Gift cards: recipient form on product page; gift card page with QR code (160px) and Apple Wallet link.
- ✅ Image focal points: `image_tag` applies `object-position` automatically (shopify.dev); images use `object-fit: cover`.
- ✅ `page_image` used for social sharing.
- ✅ Country and language selectors (header drawer, footer, optional announcement bar).
- ✅ Multi-level menus (3 levels desktop and mobile); newsletter forms.
- ✅ Pickup availability; related and complementary recommendations.
- ✅ Rich media in product template and featured product: images, Shopify video, YouTube/Vimeo, 3D (model-viewer UI loaded on demand).
- ✅ Predictive search (products, collections, pages, articles, queries) with keyboard navigation.
- ✅ Selling plans: shown in cart lines (the requirement). Optional purchase-options picker also added to the product page.
- ✅ Shop Pay Installments banner (`payment_terms`).
- ✅ Unit pricing on cards, product, cart.
- ✅ Variant images (gallery jumps to the variant's media).
- ✅ Follow on Shop (`login_button`) in footer.
- ✅ Swatches (`swatch.image` / `swatch.color`) on product, cards and filters.
- ✅ No fake urgency, countdowns, stock counters or Lorem Ipsum.

## Settings and presets
- ✅ `theme_info` with name, author, version, documentation URL and one support URL.
- 👤 Replace placeholder URLs (`https://example.com/docs`, `/support`) and author with your real ones.
- ✅ Favicon setting; every setting labelled; 5 color schemes with background/foreground pairs; `font_picker` only.
- ✅ Two presets: **Vereda** (matches theme name) and **Murta**; `/listings/vereda` and `/listings/murta` hold home templates.
- ⚠️ Default font handles `inter_n5`, `inter_n4`, `space_mono_n4`, `lora_n4` must exist in the Shopify font library.

## Accessibility and performance
- ✅ Local preview: axe-core (WCAG 2.1 AA + best practice) 0 violations, 9 pages × 2 viewports × 2 presets.
- ✅ Keyboard: drawers trap focus, Escape closes, focus returns; dropdowns, zoom dialog and quantity tested (15/15 passing).
- ✅ Reduced motion respected (reveal, reel, autoplay video, announcement rotation).
- ✅ Lighthouse on the dev store (home, collection, product × mobile/desktop, placeholder images): average performance 100, accessibility 93. Re-run on the final demo with real photos.
- ❌ Browser matrix not run (Safari, Firefox, Edge, Samsung Internet, Instagram/Facebook/Pinterest in-app).

## Demo, listing and business
- ❌ Demo store per preset (client-transfer development store, shared password, Bogus Gateway).
- ❌ Original, rights-cleared demo photography (Pika generation blocked: see `demo-assets/asset-manifest.md`).
- ❌ Screenshots at 1000×1248 desktop and 750×1334 mobile from the real demo; three key highlight images 1600×1200.
- ✅ Draft listing copy in `listing/listing-copy.md`.
- 👤 Public documentation site with FAQ; public support form with file upload and auto-reply.
- 👤 Final name decision and trademark check (see `docs/naming.md`).
- 👤 Partner account, theme submission in the Partner Dashboard.

## What would block approval today
1. No demo store or real photography.
2. Placeholder documentation and support URLs.

