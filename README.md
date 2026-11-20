# Siriguela

Loja de sungas estampadas. Só estampa, nenhuma lisa.

Site estático (HTML, CSS e JS puros, sem build), pronto para GitHub Pages.

## Rodar localmente

```bash
python3 -m http.server 5190
```

Abra http://localhost:5190

## Estrutura

- `index.html`: home (hero, coleção, índice das estampas, sobre, medidas, lista)
- `colecao1/sunga/<slug>/`: página de cada sunga (ex.: `/colecao1/sunga/pipa/`). São geradas a partir do `produto.html` por `python3 scripts/gerar-paginas.py`; rode de novo sempre que mudar o `produto.html` ou o catálogo. O endereço antigo `produto.html?s=<slug>` redireciona para o novo.
- `assets/js/movimento.js`: rolagem com inércia (Lenis) e animações ligadas à rolagem (GSAP ScrollTrigger). As bibliotecas ficam em `assets/vendor/` e só são carregadas pelo `app.js` depois que a página aparece, para não atrasar a primeira pintura. Com movimento reduzido no sistema, nem são baixadas.
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
- `assets/produtos/grades/`: as grades originais de onde as fotos foram recortadas

## Encomenda

A loja funciona sob encomenda: a safra abre todo mês do dia 1 ao 7, a produção começa quando a janela fecha e a entrega chega em até 10 dias úteis. Preço, frete grátis, cupom e janela ficam no topo de `assets/js/produtos.js`. O site calcula sozinho se a janela está aberta ou fechada e escreve as datas.

Para ver a loja com a janela aberta fora do período, abra `?janela=aberta` (ou `?janela=fechada`). A escolha vale até fechar a aba.

## Ainda não conectado

- Checkout (o botão "Finalizar compra" só mostra um aviso)
- Formulário da lista de e-mail e o aviso de abertura da safra
- Cupom: o site aceita SIRIGUELA10 em qualquer compra; a regra de primeira compra precisa ser conferida no pagamento
- Links de Instagram, TikTok, contato, trocas e envio no rodapé
