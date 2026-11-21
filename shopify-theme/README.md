# Vereda — Shopify theme (working name)

Original, native Shopify theme (Online Store 2.0) inspired by the editorial language of siriguela.site, rebuilt for any independent brand. The Siriguela site in the repository root is untouched.

```
shopify-theme/
├── theme/            the theme package (upload this folder)
├── docs/             audit, naming, installation, customization, support, submission checklist, screenshots
├── listing/          Theme Store listing copy
├── demo-assets/      Pika plan and asset manifest (generation pending)
├── tools/
│   ├── build_locales.py, schema_strings.py   source of truth for locales (en + pt-BR)
│   └── preview/      local Liquid simulator for screenshots, axe and Lighthouse (dev only)
├── CHANGELOG.md
└── PROGRESS.md
```

## Develop
```bash
npm install -g @shopify/cli
cd shopify-theme/theme
shopify theme check
shopify theme dev --store your-dev-store.myshopify.com
```

Edit translations in `tools/build_locales.py` / `tools/schema_strings.py`, then `python3 tools/build_locales.py`.

## Local preview (no store needed)
```bash
cd shopify-theme/tools/preview && npm install
node render.mjs && PRESET=Murta node render.mjs
NODE_PATH=$(npm root -g) node shoot.cjs out shots       # screenshots
NODE_PATH=$(npm root -g):$(pwd)/node_modules node axe.cjs   # accessibility
NODE_PATH=$(npm root -g) node interact.cjs              # keyboard and drawer tests
```
The simulator mocks Shopify objects and filters. It catches layout, accessibility and Liquid-chain bugs; it does not replace testing on a Shopify store.
