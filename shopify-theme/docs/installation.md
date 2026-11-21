# Installation

## Requirements
- A Shopify store (any plan) or a development store from the Partner Dashboard.
- Shopify CLI 5.x for development: `npm install -g @shopify/cli`.

## Install from the Theme Store
1. Online Store → Themes → Visit Theme Store → Vereda → Try theme.
2. Choose a style: **Vereda** (fashion, accessories, lifestyle) or **Murta** (beauty, wellness, home).
3. Customize, then Publish.

## Install for development
```bash
cd shopify-theme/theme
shopify theme dev --store your-store.myshopify.com
```
Push an unpublished copy:
```bash
shopify theme push --unpublished --store your-store.myshopify.com
```
Package for submission:
```bash
shopify theme package
```

## First setup checklist
1. Theme settings → Logo and favicon.
2. Theme settings → Colors: review the five schemes (1 base, 2 inverse, 3 footer, 4 image overlay, 5 accent).
3. Navigation: create `main-menu` (up to three levels) and `footer` menus.
4. Search and Discovery app: add filters (availability, price, product type, vendor, options) and complementary products.
5. Product media: set focal points on wide images; add colour swatches to option values.
6. Home page: replace the hero image (desktop 2400 × 1350 or wider, mobile 1080 × 1920).
