# Support

> Placeholder until the support channel exists. Shopify requires, before launch: public documentation with an FAQ, and a public contact form with name, email, store URL, description, file upload and an automatic reply. Replies within 2 business days.

## To set up (pending, needs a human decision)
- Support URL (goes in `config/settings_schema.json` → `theme_info.theme_support_url`; currently `https://example.com/support`). Use **either** a support URL **or** a support email, not both.
- Documentation URL (`theme_documentation_url`; currently `https://example.com/docs`).
- Help desk tool and auto-reply text.

## What support covers
Theme settings, sections and blocks, installation, compatibility with Shopify features and bug fixes in the theme code.

## What it does not cover
Custom code changes, third-party apps, store setup beyond the theme.

## FAQ (draft)
**Can I use my own fonts?** Vereda uses the Shopify font library so fonts load fast and stay licensed. Upload custom fonts only through custom code.
**How do I show filters?** Install Shopify Search and Discovery and add filters; the collection page shows them automatically.
**Why is my signal color not used for prices?** By design: the signal is decorative so any color stays accessible.
**How do I turn off animations?** Theme settings → Motion. Visitors with reduced motion never see them.
**How do I show complementary products?** Set them in Search and Discovery, then add a Product recommendations section with type "Complementary".
