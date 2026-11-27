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
- `camisetas/` (coleção, com os cards) e `camisetas/<nome>/` (`azulejo`, `catavento`, `jardim` e o drop geométrico: `meia-lua`, `encaixe`, `blocos`, `degraus`, `ciranda`, `bandeirinhas`): páginas editoriais das camisetas, escritas à mão (não passam pelo `gerar-paginas.py` nem pelo catálogo). O visual delas fica em `assets/css/camiseta.css`. Estão à venda o mês todo (sem janela de safra): preço, tamanhos, prazo (7 a 15 dias corridos) e as fotos dos cards (`takes` e `estatica`) ficam em `camisetas` no fim de `assets/js/produtos.js`. O fim de cada página de produto (camiseta ou sunga) mostra as outras peças num slider com uma foto fixa por peça (`outra` no `produtos.js`, com a pose e quem está na foto), em ordem sorteada a cada visita sem deixar pose nem modelo repetidos lado a lado. A compra (tamanho + botão, na capa e numa barra fixa no pé da tela) e o bloco "Sob encomenda" são montados pelo `app.js`. O endereço antigo `/camiseta/<nome>/` redireciona para o novo. O checkout aceita camiseta a qualquer dia e sunga só na safra; mudou o catálogo, publique `npx wrangler deploy --config checkout/wrangler.jsonc`. As fotos ficam em `assets/camisetas/<nome>/` nas larguras `.w640/.w1080/.w1600.webp` (todas têm também a largura cheia do original, `.w2496` nas deitadas e `.w1776` nas em pé, para telas de alta densidade). As fotos de todas as camisetas levam o look Portra 400 em dose leve (efeito 0,2: cor a 20% e textura a 40% do laboratório de película), com WebP em qualidade 90 a 95, aplicado por código antes de gerar os WebP; a camiseta recortada da capa não leva; `estampa.svg` é o vetor da estampa (nas camisetas escuras, com o fundo da cor do tecido) e `email-1x1.jpg` é a foto do e-mail. A capa de todas as camisetas usa a camiseta recortada, centrada acima do nome (`solta.w640/.w1080/.w1188.webp`, WebP com transparência em qualidade 85, gerado com Pillow; original em `_originais-fotos/camiseta-<nome>/solta.png`), com a classe `capa--solta`. Nome comprido leva `--nome` na `section` da capa para caber numa linha.
- `assets/js/movimento.js`: rolagem com inércia (Lenis) e animações ligadas à rolagem (GSAP ScrollTrigger). As bibliotecas ficam em `assets/vendor/` e só são carregadas pelo `app.js` depois que a página aparece, para não atrasar a primeira pintura. Com movimento reduzido no sistema, nem são baixadas.
- `assets/video/camisetas-21x9.mp4`, `camisetas-3x2.mp4` e `camisetas.webp`: filme das camisetas no hero da home (H.264, sem áudio, 15 s em laço), em 21:9 para telas a partir de 1025 px e em 3:2 abaixo disso, mais o pôster. O grão extra por cima do filme é uma camada de ruído em CSS (`.filme::after`, dose em `--grao`), sem mexer no vídeo. Se o iPhone bloquear o autoplay (Modo de Pouca Energia), o `app.js` tenta de novo no primeiro toque ou rolagem e o botão de play do Safari fica escondido. O `<video>` escolhe o arquivo pelo `media` de cada `<source>`.
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

## Produção

`producao/`: arquivos de impressão das 9 camisetas (SVG e PNG 300 DPI transparentes, prévia na cor da malha, foto de referência) e as diretrizes de impressão em `producao/README.md`. Gere de novo com `node producao/gerar-arquivos.js` sempre que mudar uma `estampa.svg`.

## Lançamento: o que fica no catálogo

- `empresa` em `assets/js/produtos.js`: razão social, CNPJ, endereço, e-mail e WhatsApp. Aparecem no rodapé e nas páginas `/trocas/`, `/privacidade/` e `/contato/` (campo vazio não aparece).
- `marketing`: ID do Pixel da Meta e do GA4. Com algum preenchido, o site mostra o aviso de cookies e só carrega o rastreio depois do "Aceitar". Eventos: PageView, ViewContent (página da camiseta), AddToCart, InitiateCheckout e Lead (e-mail na lista). O Purchase sai do checkout da Nextout.
- `camisetas.ficha`: tecido, estampa, cuidados e tabela de medidas do fornecedor. Vazio, a seção não aparece em "Detalhes".
- UTMs e `fbclid`/`gclid` seguem do anúncio até a URL do pagamento.
- `sitemap.xml`, `robots.txt` e `404.html` na raiz.
- Black Friday (`boasVindas` em `assets/js/produtos.js`): faixa no topo e pop-up na primeira visita, até as 23h59 de `fim`. O e-mail entra na lista `boas-vindas` do worker `avisos/`, que manda na hora o e-mail do cupom (`cupom()` em `avisos/email.mjs`, foto `assets/camisetas/ciranda/email-luz.jpg`). O código precisa existir no painel da Nextout.

## Segurança

- `_headers`: cabeçalhos do Cloudflare Pages (CSP, nosniff, sem iframe de fora, HSTS). A CSP libera os `<script>` em linha pelo hash: página nova com script em linha precisa do hash lá. `node scripts/conferir-csp.mjs` confere (roda também na Action Conferir).
- Checkout: o worker recalcula o preço pelo catálogo, aceita até 20 peças iguais por linha e só atende o próprio site (Origin). A sacola descarta item com tamanho ou quantidade fora do catálogo.
- Lista de aviso: a confirmação sai no máximo uma vez a cada 24 h por e-mail, mesmo com várias peças cadastradas.

## Deploy dos workers

O site sai sozinho pelo GitHub Pages. Os workers da Cloudflare (`checkout/` e `avisos/`) são publicados pela própria Cloudflare, ligada ao repositório, a cada push na `main`. O worker leva junto uma cópia de `assets/js/produtos.js`: preço e tamanhos que a Nextout cobra vêm dessa cópia. Para publicar à mão: `npx wrangler deploy --config checkout/wrangler.jsonc`.

## Encomenda

A loja funciona sob encomenda: a safra abre todo mês do dia 1 ao 7, a produção começa quando a janela fecha e a entrega chega em até 10 dias úteis. Preço, frete fixo, cupom e janela ficam no topo de `assets/js/produtos.js`. O site calcula sozinho se a janela está aberta ou fechada e escreve as datas.

Para ver a loja com a janela aberta fora do período, abra `?janela=aberta` (ou `?janela=fechada`). A escolha vale até fechar a aba.

## Checkout Nextout

A sacola envia os itens para `POST /api/checkout`. O worker `siriguela-checkout` usa o catálogo do repositório para conferir tamanho, preço e disponibilidade, e só cria links entre os dias 1 e 7 no horário de Brasília. Uma lista opcional `esgotados: ["M", "GG"]` em cada produto bloqueia novas encomendas desses tamanhos. Mudanças no catálogo ou nas regras de venda precisam ser publicadas também no worker: `npx wrangler deploy --config checkout/wrangler.jsonc`.

Para ativar a loja:

1. No painel Nextout, conecte o gateway que recebe as vendas e cadastre `checkout.siriguela.site` em Domínio. Depois de o painel associar o domínio à loja, publique o registro DNS indicado por ele no Cloudflare.
2. Configure a origem dos envios, o peso e as dimensões reais da embalagem. Confira o frete fixo de R$ 19,90 em todo pedido, cartão em até 3× sem juros e o cupom `SIRIGUELA10` de 10% exclusivo para primeira compra. A API pública só recebe itens e campanha. O cliente informa o cupom no checkout e o painel precisa verificar a elegibilidade.
3. Em Produtos → Integração via API, gere a chave e salve-a como secret `NEXTOUT_KEY` nas configurações do worker `siriguela-checkout`. O valor fica só no Cloudflare. A rota passa a usá-lo sem alterar o código.

Na homologação, confira uma sacola com duas estampas, o desconto de primeira compra, o CEP, o parcelamento e o pedido no painel. O modo de prévia da vitrine não libera pagamentos fora da safra. A Nextout documenta que links da API não expiram. O bloqueio local se aplica à criação de novos links, e o encerramento de um link já emitido depende da Nextout. As confirmações dos pedidos dessa integração são acompanhadas no painel.

## Ainda não conectado

- Formulário da lista de e-mail e o aviso de abertura da safra
- Links de Instagram, TikTok, contato, trocas e envio no rodapé
