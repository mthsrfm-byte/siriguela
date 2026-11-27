# Siriguela

Site estático (HTML, CSS e JS puros). Estrutura, fotos e deploy estão no `README.md`.

## Arquivos das camisetas (produção)

Ficam em `producao/`, com as diretrizes em `producao/README.md` e a ficha em `producao/camisetas.json`. Em cada `producao/camisetas/<slug>/` há o SVG de impressão, o PNG transparente em 300 DPI, a prévia sobre a cor da malha e a foto de referência.

Quando o Matheus pedir os arquivos das camisetas ("me manda os arquivos das camisetas", "manda as artes", "arquivos para impressão"):

1. Se ele citar uma camiseta, mande os arquivos dela com `SendUserFile` (`<slug>-estampa.svg`, `<slug>-estampa-300dpi.png` e `<slug>-referencia.webp`). Junte na mensagem a linha dela da tabela do `producao/README.md`: malha, cor, tamanho e o que fica vazado.
2. Se ele não citar, gere o zip de tudo (`cd producao && zip -r <scratchpad>/siriguela-arquivos-impressao.zip README.md camisetas.json camisetas`) e mande o zip. O zip não entra no repositório.
3. Se a arte do site mudou depois da última geração (compare as datas de `assets/camisetas/<slug>/estampa.svg` e da pasta), rode `node producao/gerar-arquivos.js` antes de mandar.

## Tom de voz: cartão-postal

Vale para todo texto do site: páginas, cards, botões, mensagens da sacola, e-mails e metas de compartilhamento.

### A ideia

Cada texto é um cartão-postal. Põe quem lê num lugar do Brasil, numa hora do dia, com a luz e a temperatura daquela hora, e mostra o que se vê dali. A estampa sai dessa cena. A Siriguela não explica a estampa, ela leva você até o lugar de onde o desenho veio.

### Quem fala

Alguém que esteve lá e conta o que viu, sem pressa. Usa "a gente", trata quem lê por "você", escreve em português do Brasil e sem gíria de internet. É leve e tem um pouco de poesia, mas cada frase continua dizendo uma coisa concreta.

### Como se escreve

- **Lugar com nome.** Ver-o-Peso, Cabaceiras, Itamaracá, o cobogó de Brasília, as abóbadas de concreto. O nome próprio vale mais que o genérico ("o Ver-o-Peso de manhã", e não "uma feira").
- **Hora e luz.** De manhã cedo, ao meio-dia, no fim da tarde, depois que escurece. Sol a pino, sombra comprida, luz de claraboia. Uma imagem de luz por texto já basta.
- **Sentido.** O cheiro do bacuri, a laje quente, o degrau frio de manhã, o vento que não para. Uma sensação por parágrafo, no máximo.
- **Cor com nome.** Cobalto, terracota, petróleo, mostarda, cru, coral, lilás. Nunca "cores vibrantes".
- **Números de verdade.** Quantas formas, quantas tintas, preço, prazo, tecido. Se não dá para conferir, não escreva. Fato histórico também precisa ser verdadeiro (Volpi e as bandeirinhas, o cobogó no Recife dos anos 1920).
- **Frase curta, ordem direta.** Uma ideia por frase. Pode ter ritmo e pode fechar com uma imagem, desde que a imagem seja concreta ("O branco da camiseta faz o papel do rejunte").
- **A cena primeiro, a peça depois.** O primeiro parágrafo leva ao lugar. O segundo diz como é a peça: formas, tintas, tecido.

### O que não entra (texto com cara de IA)

- **Fórmulas repetidas.** Cada uma pode aparecer no máximo uma vez no site inteiro:
  - "X de Y, Z de W" ("Casca de terra, polpa de nuvem")
  - "X também é Y" ("Concreto também é desenho")
  - "Todo X é Y" ("Toda curva procura a outra")
  - "Não é X. É Y." ("Estampa não é enfeite. É assunto.")
- **Gancho de mistério ou revelação:** "O cupuaçu engana.", "E tem um segredo:", "Spoiler:", dois-pontos para fazer suspense.
- **Slogan no fim do parágrafo:** "para você esquecer que está de sunga", "do mar à roda de samba sem trocar de roupa". Imagem concreta pode; promessa de anúncio, não.
- **Promessa que não dá para provar:** "a que mais faz perguntarem", "impossível de passar despercebida", "todo mundo ama".
- **Lista de três com repetição:** "nada de estoque, nada de sobra, nada de liquidação". Escreva a frase uma vez.
- **Clichê de moda e marketing:** "peça-chave", "atemporal", "para todas as ocasiões", "eleve seu look", "exclusivo" sem dizer por quê, "Seja dos primeiros".
- **Lugar inventado ou vago demais:** se não sabe onde a foto foi feita, descreva o que aparece nela e não dê nome.
- **Travessão para aparte** e aspas em rótulo inventado.
- **Emoji.**

### Regras da loja (dizer sempre igual)

- **Camisetas:** R$ 199,00 (a Blocos sai por R$ 189,00; o preço de cada uma fica em `assets/js/produtos.js`), tamanhos P a GG, sob encomenda, chegam em 7 a 15 dias corridos.
- **Sungas:** R$ 279,90, em breve (`sungasEmBreve` em `assets/js/produtos.js`). A coleção fica em `/sungas/` e cada sunga pede o e-mail para avisar quando chegar. Enquanto estiverem em breve, não fale em safra, janela ou data de encomenda.
- **Troca e devolução:** em até 7 dias corridos, com a peça sem uso.
- **Frete:** fixo de R$ 19,90 para todo o Brasil, em todo pedido. Não tem frete grátis.
- **Primeira compra:** 10% com SIRIGUELA10, conferido no pagamento.
- Para explicar o "sob encomenda", diga o que acontece: a gente só estampa e costura depois do pedido, então não sobra estoque. Não use "sustentável" sozinho como argumento.

### Formatos

- **Nome da estampa:** com maiúscula e artigo feminino ("a Meia-lua", "a Pipa").
- **Chamada (logo abaixo do nome):** até 8 palavras e ponto final. É a legenda do cartão-postal: lugar, hora ou luz ("Roda de ciranda na beira do mar.").
- **Texto da estampa:** 2 parágrafos. O primeiro leva ao lugar e à hora; o segundo diz como é a peça (formas, tintas, tecido).
- **Ensaio:** a chamada diz onde a foto foi feita; o texto descreve o que aparece nela e a luz daquela hora.
- **Botões:** verbo e objeto, sem ponto ("Comprar a minha", "Ver as camisetas").
- **Mensagens de erro:** dizem o que houve e o que fazer ("Escolha um tamanho.", "Remova as sungas para comprar as camisetas agora.").
- **Números:** "R$ 199,00", "7 a 15 dias corridos", "90% poliéster". Por extenso só no meio do texto corrido ("dezesseis módulos").

### Antes de publicar texto novo

1. Leia em voz alta. Se soa como anúncio, corte. Se soa como relatório, falta lugar ou luz.
2. Procure as fórmulas da lista acima no site inteiro (`grep`). Se a frase nova repete uma que já existe, troque.
3. Confira se preço, prazo e troca batem com as regras da loja.
