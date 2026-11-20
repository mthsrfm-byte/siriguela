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
- `assets/js/movimento.js`: rolagem com inércia (Lenis) e animações ligadas à rolagem (GSAP ScrollTrigger), carregados por CDN. Com movimento reduzido no sistema, nada disso roda.
- `assets/video/`: vídeos do topo da home (540×960); os originais em 2K ficam fora do repositório
- `assets/js/produtos.js`: catálogo (nomes, textos, preço, tamanhos). Edite aqui.
- `assets/js/app.js`: cabeçalho, rodapé, sacola (localStorage) e renderização
- `assets/css/tokens.css`: cores, fontes, grade e espaços da marca (layout Galeria com o branding R01 Ponto: linho, tinta e o ponto siriguela). Para mudar a marca, mexa só aqui.
- `assets/img/logo.svg` e `logo-mono.svg`: logo oficial em curvas (não redigitar com a fonte); `favicon.svg` é o ponto
- `assets/tokens.json`: os mesmos tokens em formato Design Tokens, para levar ao Figma
- `assets/css/style.css`: todo o visual, usando os tokens
- `assets/produtos/<slug>/`: fotos de cada sunga (frente, modelo, costas, detalhe, estampa, inspiracao)
- `assets/produtos/grades/`: as grades originais de onde as fotos foram recortadas

## Encomenda

A loja funciona sob encomenda: a safra abre todo mês do dia 1 ao 10, a produção começa quando a janela fecha e a entrega chega em até 15 dias. Preço, frete grátis, cupom e janela ficam no topo de `assets/js/produtos.js`. O site calcula sozinho se a janela está aberta ou fechada e escreve as datas.

Para ver a loja com a janela aberta fora do período, abra `?janela=aberta` (ou `?janela=fechada`). A escolha vale até fechar a aba.

## Ainda não conectado

- Checkout (o botão "Finalizar compra" só mostra um aviso)
- Formulário da lista de e-mail e o aviso de abertura da safra
- Cupom: o site aceita SIRIGUELA10 em qualquer compra; a regra de primeira compra precisa ser conferida no pagamento
- Links de Instagram, TikTok, contato, trocas e envio no rodapé
