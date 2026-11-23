# Progress — 21 Nov 2026

## Etapa 1 — Pika e demo assets: **bloqueada**
- Skill `ativar-a-pika` carregada; API atual (`api.dev.pika.art`) consultada sem chave: catálogo e cotação funcionam.
- Sem chave no ambiente; você escolheu seguir sem Pika. **Nenhuma imagem gerada, custo $0.**
- Modelo escolhido, cotação, direção de arte, shot list e prompts prontos: `demo-assets/asset-manifest.md`. Estimativa total: ≈ $4,80.

## Etapa 2 — Nome: **feita (provisória)**
- Recomendação: **Vereda**; alternativas e checagem de colisões em `docs/naming.md`. Oiti descartado (pronúncia em inglês).

## Etapa 3 — Auditoria: **feita**
- `docs/source-audit.md`.

## Etapa 4 — Tema nativo: **feito (v0.1.0)**
- `theme/`: 36 seções, 25 snippets, 13 templates, 2 presets, locales en + pt-BR (loja e editor), `base.css` e `theme.js` próprios sem dependências.
- Bugs achados e corrigidos pelo preview: filtros encadeados após `image_tag` (escapariam o `<img>` na Shopify), datas e valores no vale-presente, contraste do sinal no preset Murta, landmark duplicado no carrinho, ordem de títulos.

## Madrugada (sem loja conectada)
- `<shopify-account>` no cabeçalho (requisito obrigatório desde jul/2026).
- Seletor de assinatura (selling plans) no produto, padrão oficial.
- Catálogo demo pronto para importar: `demo-store/products.csv` (12 produtos, 47 variantes, todos os casos de teste) + textos de páginas, blog e menus em `demo-store/content.md`.
- Roteiro da loja dev: `docs/dev-store-runbook.md`.

## Etapa 5 — Testes
| Teste | Resultado |
|---|---|
| `shopify theme check` (CLI 5.0.2) | 83 arquivos, 0 ofensas |
| axe-core WCAG 2.1 AA (preview) | 0 violações, 9 páginas × 2 telas × 2 presets |
| Interação teclado/drawers (preview) | 15/15 |
| Lighthouse (preview, indicativo) | Perf 87–100 · A11y 100 · CLS ≈ 0 |
| Envio para a Shopify (`theme push`) | sucesso, 0 erros (após corrigir 2 problemas que só a Shopify detecta) |
| E2E na loja real (Playwright, desktop + celular) | **50/50** |
| axe-core na loja real (5 páginas × 2 telas) | 0 violações do tema (só o iframe da barra de prévia da Shopify) |
| Lighthouse na loja real | performance média **100**, acessibilidade **93** (mín. 60/90); pontos perdidos vêm da barra de prévia e da falta de descrição da loja |

## Loja de desenvolvimento
- `vereda-theme-dev.myshopify.com` (criada pela CLI), tema "Vereda 0.1.0" id 166970097923 (não publicado).
- Populada por `demo-store/seed.py`: 11 produtos, 6 coleções, 5 páginas, blog com 3 artigos, menus. Fotos são placeholders de layout.
- Bugs reais achados e corrigidos: `settings.color_schemes.first` não existe na Shopify (corpo e gaveta sem fundo); range com 2 passos recusado pelo editor; botão "Buy it now" sem contraste.
- Manual pendente: ativar cartões-presente no admin; amostras de cor exigem metafield de categoria.

## Etapa 6 — Submissão: **documentação pronta, submissão não**
- `docs/submission-checklist.md` lista o que bloqueia hoje.

## Pendências que dependem de você
1. Loja dev (domínio `.myshopify.com`) para `shopify theme dev` e testes reais.
2. Chave Pika + aprovar ≈ $4,80 para as fotos da demo.
3. Nome final (e checagem de marca), URLs de documentação e suporte.
4. Conta de parceiro e submissão.
