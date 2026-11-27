# Siriguela

Site estático (HTML, CSS e JS puros). Estrutura, fotos e deploy estão no `README.md`.

## Arquivos das camisetas (produção)

Ficam em `producao/`, com as diretrizes em `producao/README.md` e a ficha em `producao/camisetas.json`. Em cada `producao/camisetas/<slug>/` há o SVG de impressão, o PNG transparente em 300 DPI, a prévia sobre a cor da malha e a foto de referência.

Quando o Matheus pedir os arquivos das camisetas ("me manda os arquivos das camisetas", "manda as artes", "arquivos para impressão"):

1. Se ele citar uma camiseta, mande os arquivos dela com `SendUserFile` (`<slug>-estampa.svg`, `<slug>-estampa-300dpi.png` e `<slug>-referencia.webp`). Junte na mensagem a linha dela da tabela do `producao/README.md`: malha, cor, tamanho e o que fica vazado.
2. Se ele não citar, gere o zip de tudo (`cd producao && zip -r <scratchpad>/siriguela-arquivos-impressao.zip README.md camisetas.json camisetas`) e mande o zip. O zip não entra no repositório.
3. Se a arte do site mudou depois da última geração (compare as datas de `assets/camisetas/<slug>/estampa.svg` e da pasta), rode `node producao/gerar-arquivos.js` antes de mandar.

## Tom de voz: marketing inteligente, com um pouco de poesia só nas peças

Vale para todo texto do site: páginas, cards, botões, mensagens da sacola, e-mails e metas de compartilhamento.

### A ideia

A Siriguela vende moda com três diferenciais. Todo texto de venda puxa pelo menos um deles:

1. **Brasilidade.** As estampas vêm de lugares, frutas, arquitetura e cultura do Brasil, as joias que pouca gente põe numa roupa.
2. **Estampa autoral.** A gente desenha cada estampa aqui. Nada de estampa de banco de imagens, nada de peça lisa.
3. **Moda sustentável.** Tudo é sob encomenda: a gente só estampa e costura depois do pedido, então não sobra estoque parado.

### Dois registros

- **Venda (o padrão):** títulos e chamadas de página e de seção, hero, textos de coleção, faixas, pop-ups, botões, e-mails e metas. Marketing inteligente: diz o que é, por que é diferente e o que a pessoa ganha. Direto, confiante, com frase curta. Exemplo: "A gente se inspirou nas joias exóticas do Brasil para criar sungas para o verão de 2027 que fogem da mesmice."
- **Peça (só o texto de cada estampa, dentro da página da camiseta ou da sunga):** levemente poético, no mínimo. Uma imagem concreta do lugar de onde a estampa veio (o Ver-o-Peso de manhã, o cobogó de Brasília no fim da tarde) e pronto. O resto do texto da peça é informação: formas, tintas, tecido.

### Quem fala

A marca, em "a gente", falando com "você". Português do Brasil, sem gíria de internet. Segura do que faz, sem exagero.

### Como se escreve

- **Diferencial primeiro.** Abra com o que só a Siriguela tem (brasilidade, desenho próprio, sob encomenda), não com cenário.
- **Concreto vence genérico.** Nome de lugar, de fruta, de cor ("terracota", "cobalto"), número de verdade (preço, prazo, tecido). Nunca "cores vibrantes".
- **Números de verdade.** Se não dá para conferir, não escreva. Fato histórico também precisa ser verdadeiro.
- **Frase curta, ordem direta.** Uma ideia por frase.
- **Sustentável com prova.** Pode usar "moda sustentável", desde que a frase (ou a seguinte) diga o porquê: sob encomenda, sem estoque parado, sem sobra para liquidar.

### O que não entra

- **Fórmulas repetidas.** Cada uma pode aparecer no máximo uma vez no site inteiro: "X de Y, Z de W", "X também é Y", "Todo X é Y", "Não é X. É Y."
- **Gancho de mistério:** "O cupuaçu engana.", "E tem um segredo:", "Spoiler:".
- **Promessa que não dá para provar:** "a que mais faz perguntarem", "todo mundo ama", "a melhor sunga do Brasil".
- **Lista de três com repetição:** "nada de estoque, nada de sobra, nada de liquidação". Escreva a frase uma vez.
- **Clichê vazio de moda:** "peça-chave", "atemporal", "para todas as ocasiões", "eleve seu look", "exclusivo" sem dizer por quê.
- **Poesia fora da peça:** cenário longo, luz e cheiro em título, chamada ou texto de coleção. Isso fica no texto da estampa.
- **Lugar inventado:** se não sabe onde a foto foi feita, não dê nome.
- **Travessão para aparte** e **emoji.**

### Regras da loja (dizer sempre igual)

- **Camisetas:** R$ 199,00 (a Blocos sai por R$ 189,00 e a Ciranda por R$ 219,00; o preço de cada uma fica em `assets/js/produtos.js`), tamanhos P a XXG, corte boxy em algodão 210 g/m², sob encomenda, chegam em 7 a 15 dias corridos.
- **Sungas:** R$ 279,90, em breve (`sungasEmBreve` em `assets/js/produtos.js`). A coleção fica em `/sungas/` e cada sunga pede o e-mail para avisar quando chegar. Enquanto estiverem em breve, não fale em safra, janela ou data de encomenda.
- **Troca e devolução:** em até 7 dias corridos, com a peça sem uso.
- **Frete:** fixo de R$ 19,90 para todo o Brasil, em todo pedido. Não tem frete grátis.
- **Primeira compra:** 10% com SIRIGUELA10, conferido no pagamento.
- Para explicar o "sob encomenda", diga o que acontece: a gente só estampa e costura depois do pedido, então não sobra estoque. "Sustentável" sempre vem com esse porquê.

### Formatos

- **Nome da estampa:** com maiúscula e artigo feminino ("a Meia-lua", "a Pipa").
- **Chamada (logo abaixo do nome da estampa):** até 8 palavras e ponto final. Diz de onde a estampa veio ("Roda de ciranda na beira do mar.").
- **Texto da estampa:** 2 parágrafos. O primeiro, levemente poético, mostra o lugar de onde a estampa veio; o segundo diz como é a peça (formas, tintas, tecido).
- **Ensaio:** a chamada diz onde a foto foi feita; o texto descreve o que aparece nela e a luz daquela hora.
- **Botões:** verbo e objeto, sem ponto ("Comprar a minha", "Ver as camisetas").
- **Mensagens de erro:** dizem o que houve e o que fazer ("Escolha um tamanho.", "Remova as sungas para comprar as camisetas agora.").
- **Números:** "R$ 199,00", "7 a 15 dias corridos", "90% poliéster". Por extenso só no meio do texto corrido ("dezesseis módulos").

### Antes de publicar texto novo

1. Leia em voz alta. Texto de venda: ficou claro o diferencial em uma frase? Se soa como poema, corte. Texto de peça: se soa como relatório, falta a imagem do lugar.
2. Procure as fórmulas da lista acima no site inteiro (`grep`). Se a frase nova repete uma que já existe, troque.
3. Confira se preço, prazo e troca batem com as regras da loja.
