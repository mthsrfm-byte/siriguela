# Siriguela

Loja de camisetas e sungas estampadas. Só estampa, nenhuma lisa. As sungas estão em breve (`sungasEmBreve: true` em `assets/js/produtos.js`): aparecem no site, mas não vendem. O tom de voz dos textos está no `CLAUDE.md`.

Site estático (HTML, CSS e JS puros, sem build), pronto para GitHub Pages.

## Rodar localmente

```bash
python3 -m http.server 5190
```

Abra http://localhost:5190

## Estrutura

- `index.html`: home (hero, coleção, índice das estampas, sobre, medidas, lista)
- `colecao1/sunga/<slug>/`: página de cada sunga (ex.: `/colecao1/sunga/pipa/`). São geradas a partir do `produto.html` por `python3 scripts/gerar-paginas.py`; rode de novo sempre que mudar o `produto.html` ou o catálogo. O endereço antigo `produto.html?s=<slug>` redireciona para o novo.
- `camisetas/` (coleção, com os cards) e `camisetas/<nome>/` (`azulejo`, `catavento`, `jardim` e o drop geométrico: `meia-lua`, `encaixe`, `blocos`, `degraus`, `ciranda`, `bandeirinhas`): páginas editoriais das camisetas, escritas à mão (não passam pelo `gerar-paginas.py` nem pelo catálogo). O visual delas fica em `assets/css/camiseta.css`. Estão à venda o mês todo (sem janela de safra): preço, tamanhos, prazo (7 a 15 dias corridos) e as fotos dos cards (`takes` e `estatica`) ficam em `camisetas` no fim de `assets/js/produtos.js`. A compra (tamanho + botão, na capa e numa barra fixa no pé da tela) e o bloco "Sob encomenda" são montados pelo `app.js`. O endereço antigo `/camiseta/<nome>/` redireciona para o novo. O checkout aceita camiseta a qualquer dia e sunga só na safra; mudou o catálogo, publique `npx wrangler deploy --config checkout/wrangler.jsonc`. As fotos ficam em `assets/camisetas/<nome>/` nas larguras `.w640/.w1080/.w1600.webp` (todas têm também a largura cheia do original, `.w2496` nas deitadas e `.w1776` nas em pé, para telas de alta densidade). As fotos de todas as camisetas levam o look Portra 400 em dose leve (efeito 0,2: cor a 20% e textura a 40% do laboratório de película), com WebP em qualidade 90 a 95, aplicado por código antes de gerar os WebP; a camiseta recortada da capa não leva; `estampa.svg` é o vetor da estampa (nas camisetas escuras, com o fundo da cor do tecido) e `email-1x1.jpg` é a foto do e-mail. A capa do Jardim usa a camiseta recortada (`solta.w640/.w1080/.w1188.webp`, original em `_originais-fotos/camiseta-jardim/solta.png`), com a classe `capa--solta`.
- `assets/js/movimento.js`: rolagem com inércia (Lenis) e animações ligadas à rolagem (GSAP ScrollTrigger). As bibliotecas ficam em `assets/vendor/` e só são carregadas pelo `app.js` depois que a página aparece, para não atrasar a primeira pintura. Com movimento reduzido no sistema, nem são baixadas.
- `assets/video/camisetas-21x9.mp4`, `camisetas-3x2.mp4` e `camisetas.webp`: filme das camisetas no hero da home (H.264, sem áudio, 15 s em laço), em 21:9 para telas a partir de 1025 px e em 3:2 abaixo disso, mais o pôster. O `<video>` escolhe o arquivo pelo `media` de cada `<source>`.
- `assets/video/`: vídeos do topo da home em 720×1280, sem áudio, cada um em três versões que o navegador escolhe na ordem: `<nome>.av1.mp4` (SVT-AV1, CRF 29, 10 bits), `<nome>.hevc.mp4` (x265, CRF 25, para iPhones sem AV1) e `<nome>.mp4` (H.264, CRF 24, reserva). `<nome>.webp` é o quadro 0 do vídeo, usado como poster. O `app.js` só começa a baixar os vídeos depois que a página carrega, um de cada vez, na ordem em que entram na tela; com economia de dados ligada, ficam só os posters. Os originais em 2K ficam fora do repositório.
- `assets/js/produtos.js`: catálogo (nomes, textos, preço, tamanhos). Edite aqui.
- `assets/js/app.js`: cabeçalho, rodapé, sacola (localStorage) e renderização
- `assets/css/tokens.css`: cores, fontes, grade e espaços da marca (layout Galeria com o branding R01 Ponto: linho, tinta e o ponto siriguela). Para mudar a marca, mexa só aqui.
- `assets/img/logo.svg` e `logo-mono.svg`: logo oficial em curvas (não redigitar com a fonte); `favicon.svg` é o ponto
- `assets/tokens.json`: os mesmos tokens em formato Design Tokens, para levar ao Figma
- `assets/css/style.css`: todo o visual, usando os tokens
- `assets/produtos/<slug>/`: fotos de cada sunga (frente, modelo, costas, detalhe, estampa, inspiracao). O site usa as versões `.w640/.w1080/.w1600.webp` (o navegador escolhe pelo `srcset`); gere de novo com `python3 scripts/variantes-webp.py` sempre que trocar ou incluir uma foto. `piso-v.jpg` é a frente 9:16 que aparece no hover dos cards.
- `assets/fonts/` + `assets/css/fonts.css`: Instrument Sans e IBM Plex Mono hospedadas no próprio site (sem Google Fonts).
- Desempenho: Lighthouse acima de 90 em tudo (home e produto, celular e computador). Para manter: fotos novas sempre pelo `variantes-webp.py`, vídeos da faixa nas três versões acima (~1–2 MB cada) e nada de script novo no `<head>`.
- Página de produto ("Capa", celular e computador): a primeira foto é a sunga no chão em 3:2, com o nome gigante encostado nela e a compra logo abaixo; as outras fotos seguem num mosaico. Sunga com `recorte: true` no `produtos.js` usa a sunga recortada (PNG transparente) no lugar da foto: o original fica em `_originais-fotos/<slug>/solta.png` e o site usa `assets/produtos/<slug>/solta.w640/w1080/w1448.webp` (WebP com transparência, gerado com Pillow). Depois de marcar uma sunga nova, rode `python3 scripts/gerar-paginas.py`.
- `assets/produtos/grades/`: as grades originais de onde as fotos foram recortadas

## Deploy dos workers

O site sai sozinho pelo GitHub Pages. Os workers da Cloudflare (`checkout/` e `avisos/`) saem pela Action `.github/workflows/workers.yml`, que roda a cada push na `main` que mexa neles ou em `assets/js/produtos.js` (e à mão em Actions → Workers → Run workflow). Ela precisa do secret `CLOUDFLARE_API_TOKEN` no repositório, com permissão "Edit Cloudflare Workers"; se o token enxergar mais de uma conta, também de `CLOUDFLARE_ACCOUNT_ID`.

## Encomenda

A loja funciona sob encomenda: a safra abre todo mês do dia 1 ao 7, a produção começa quando a janela fecha e a entrega chega em até 10 dias úteis. Preço, frete grátis, cupom e janela ficam no topo de `assets/js/produtos.js`. O site calcula sozinho se a janela está aberta ou fechada e escreve as datas.

Para ver a loja com a janela aberta fora do período, abra `?janela=aberta` (ou `?janela=fechada`). A escolha vale até fechar a aba.

## Checkout Nextout

A sacola envia os itens para `POST /api/checkout`. O worker `siriguela-checkout` usa o catálogo do repositório para conferir tamanho, preço e disponibilidade, e só cria links entre os dias 1 e 7 no horário de Brasília. Uma lista opcional `esgotados: ["M", "GG"]` em cada produto bloqueia novas encomendas desses tamanhos. Mudanças no catálogo ou nas regras de venda precisam ser publicadas também no worker: `npx wrangler deploy --config checkout/wrangler.jsonc`.

Para ativar a loja:

1. No painel Nextout, conecte o gateway que recebe as vendas e cadastre `checkout.siriguela.site` em Domínio. Depois de o painel associar o domínio à loja, publique o registro DNS indicado por ele no Cloudflare.
2. Configure a origem dos envios, o peso e as dimensões reais da embalagem. Confira frete grátis a partir de R$ 399,90 após o desconto, cartão em até 3× sem juros e o cupom `SIRIGUELA10` de 10% exclusivo para primeira compra. A API pública só recebe itens e campanha. O cliente informa o cupom no checkout e o painel precisa verificar a elegibilidade.
3. Em Produtos → Integração via API, gere a chave e salve-a como secret `NEXTOUT_KEY` nas configurações do worker `siriguela-checkout`. O valor fica só no Cloudflare. A rota passa a usá-lo sem alterar o código.

Na homologação, confira uma sacola com duas estampas, o desconto de primeira compra, o CEP, o parcelamento e o pedido no painel. O modo de prévia da vitrine não libera pagamentos fora da safra. A Nextout documenta que links da API não expiram. O bloqueio local se aplica à criação de novos links, e o encerramento de um link já emitido depende da Nextout. As confirmações dos pedidos dessa integração são acompanhadas no painel.

## Ainda não conectado

- Formulário da lista de e-mail e o aviso de abertura da safra
- Links de Instagram, TikTok, contato, trocas e envio no rodapé
