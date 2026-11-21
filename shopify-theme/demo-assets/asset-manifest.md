# Demo assets: manifest and Pika plan

## Status: blocked (no images generated, no cost incurred)

- The `ativar-a-pika` skill was loaded and the **current** official API was used (`https://api.dev.pika.art`, catalogue + quote endpoints, both free and keyless).
- No Pika key exists in this environment (`PIKA_API_KEY` unset, no `~/.config/pika/api_key`). When asked, you chose **"Sem Pika agora"**. So: **no connection was made, no image was generated, $0.00 spent.**
- The preview screenshots in `docs/screenshots/` use flat, programmatically drawn **layout placeholders** (`tools/preview/img/`). They are not demo assets and must not go to the Theme Store listing.

## Model chosen (verified live in the catalogue, 21 Nov 2026)

| | |
|---|---|
| Operation | `openai/gpt-image-2.6-sunburst/text-to-image` (and `/image-to-image` for extra angles of the same product) |
| Why | Newest GPT Image version in the catalogue; "Sunburst" is tuned for detailed visual work (product texture, consistent lighting). Not a video model. |
| Aspect ratios available | 1:1, 2:3, 3:2, 3:4, 4:3, 4:5, 5:4, 9:16, 16:9, 21:9 |
| Live quotes (4:5, 1 image) | medium 1K $0.045 · medium 2K $0.081 · high 1K $0.055 · **high 2K $0.100** |
| Commercial terms | To confirm on https://dev.pika.art before use (Pika API terms + OpenAI image policy). Record the result here before publishing any image. |

## Cost plan (needs your approval before any spend)

| Batch | Images | Settings | Estimate |
|---|---|---|---|
| Test (quality check) | 6 | 2K, high | ≈ $0.60 |
| Brand one full set (fashion/accessories) | 24 | 2K, high | ≈ $2.40 |
| Brand two set (beauty/home, Murta preset) | 16 | 2K, high | ≈ $1.60 |
| Optional loop video (Pika H3 Flex image-to-video, 5 s, 768p) | 2 | $0.02/s | ≈ $0.20 |
| **Total** | | | **≈ $4.80** |

## Art direction

Two fictional brands (names to be trademark-checked before use):

1. **Ferra Studio** — fashion and accessories in natural fibres (Vereda preset). Palette: linen, ink, terracotta signal. Light: soft north window, 5600K, gentle falloff, matte paper sweep. Materials: washed linen, wool, waxed canvas, vegetable-tanned leather, stoneware.
2. **Moss & Salt** — skin, body and home care (Murta preset). Palette: oat, sage, deep green. Light: diffused overhead + bounce, glass and clay textures, water droplets only where physically plausible.

Rules for every prompt: no logos, no readable text on products, no celebrities, no hands unless essential (and then relaxed, anatomically checked), same seamless background colour per series, shadow direction always from upper left.

## Shot list and prompts (ready to run)

Prefix shared by every product shot:
> Studio product photograph for an independent fashion brand catalogue. Single object centred on a seamless warm-linen paper sweep (#E4DCCF), soft north-window light from the upper left, gentle contact shadow, true-to-life colour, 85mm lens, f/8, no props, no text, no logos, no people. Editorial, quiet, high detail of fabric weave.

| File | Purpose | Ratio | Prompt (after prefix) |
|---|---|---|---|
| `brand-one/campaign/hero-desktop.png` | Home hero, desktop | 21:9 | (campaign prefix) Wide editorial scene, a linen overshirt on a wooden chair by a tall window, morning light, large calm wall on the right two thirds for HTML text |
| `brand-one/mobile/hero-mobile.png` | Home hero, mobile | 9:16 | Same scene recomposed vertically: chair low in frame, window light from above, empty wall in upper half |
| `brand-one/products/overshirt-front.png` | Product, angle 1 | 4:5 | Oversized washed-linen overshirt in clay colour, laid flat, front view, two chest pockets, horn buttons |
| `brand-one/products/overshirt-back.png` | Product, angle 2 | 4:5 | image-to-image from front: same shirt, back view, identical colour and fabric |
| `brand-one/products/overshirt-detail.png` | Product, angle 3 | 1:1 | image-to-image: macro of the pocket and horn button |
| `brand-one/products/tote-front.png` | Product, angle 1 | 4:5 | Waxed canvas tote in olive, leather handles, standing upright |
| `brand-one/products/tote-side.png` | Product, angle 2 | 4:5 | image-to-image: same tote three-quarter view |
| `brand-one/products/*` (6 more) | Products | 4:5 | Cord trouser (ecru), merino crew (oat), herringbone scarf, stoneware carafe, card sleeve, heavy cotton tee |
| `brand-one/campaign/look-01..05.png` | Lookbook / storytelling | 4:5, 3:2 | Studio table with fabric swatches; field walk with tote (no face); folded knitwear on bench; carafe on linen tablecloth; workshop cutting table |

Quality gate after each batch: inspect at 100% for deformed hands, product changing between angles, unwanted text or logos, inconsistent shadows and stock-photo look; reject and regenerate with a fresh `Idempotency-Key`.

## Manifest (to be filled per file after generation)

| File | Purpose | Prompt id | Model | Resolution | Ratio | Origin (job id) | Rights | Cost |
|---|---|---|---|---|---|---|---|---|
| — | — | — | — | — | — | — | — | — |
