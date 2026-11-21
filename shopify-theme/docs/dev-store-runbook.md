# Dev store runbook (what Claude runs once the store is connected)

Needs from you: the `xxxx.myshopify.com` domain and approval of one CLI login code (takes 30 s on your phone).

## 1. Connect and push
```bash
cd shopify-theme/theme
shopify theme push --unpublished --store xxxx.myshopify.com --theme "Vereda 0.1.0"
shopify theme dev --store xxxx.myshopify.com        # local proxy at http://127.0.0.1:9292
```

## 2. Demo data (in the admin, ~10 min, or by Claude through the admin if a connector is available)
1. Products → Import → `demo-store/products.csv` (12 products, 47 variants; sold-out, sale, long name, 8 colours, no image, gift card).
2. Collections by tag: see `demo-store/content.md`.
3. Pages, blog `journal`, menus `main-menu` and `footer`: copy from `demo-store/content.md`.
4. Search and Discovery app: filters for availability, price, type, vendor, Color, Size; complementary products for Linen Overshirt.
5. Settings → Payments: Bogus Gateway (test only). Add swatch colours to Color option values.
6. Settings → Languages: add Portuguese (Brazil) to test pt-BR.

## 3. Tests (Claude)
| Area | How |
|---|---|
| Add to cart, quick add, drawer, quantity, remove, discounts | Playwright on 127.0.0.1:9292 |
| Variant change (option_values), sold-out combination, URL `?variant=` | Playwright |
| Filters, sorting, pagination, empty collection | Playwright |
| Predictive search, empty results | Playwright |
| Gift card recipient form | Playwright |
| Accessibility | axe-core on home, collection, product, cart, search |
| Lighthouse | home, collection, product × mobile/desktop; target avg ≥ 60 perf, ≥ 90 a11y |
| Editor | open each section in the theme editor, change settings, check no JS errors |

## 4. Still manual (you)
- Real photos (Pika) before screenshots for the listing.
- Transfer the demo store as a client-transfer store when submitting.
