# Siriguela

Site estático (HTML, CSS e JS puros). Estrutura, fotos e deploy estão no `README.md`.

## Tom de voz

Vale para todo texto do site: páginas, cards, botões, mensagens da sacola, e-mails e metas de compartilhamento.

### Quem fala

A Siriguela fala como uma pessoa que desenha estampa e conhece o lugar de onde ela veio. Usa "a gente", trata quem lê por "você", escreve em português do Brasil e sem gíria de internet. É segura sem levantar a voz: "Só estampa.", "Nenhuma lisa, nunca."

### O que faz o texto ser da Siriguela

- **Lugar real.** Cada estampa sai de um lugar ou objeto do Brasil, com nome: Ver-o-Peso, Cabaceiras, o cobogó de Brasília, os painéis de azulejo do modernismo. Prefira o nome próprio ao genérico ("o Ver-o-Peso de manhã", e não "uma feira").
- **Cor com nome.** Cobalto, terracota, petróleo, mostarda, cru. Nunca "cores vibrantes".
- **Números de verdade.** Quantas formas, quantas tintas, preço, prazo, tecido. Se não dá para conferir, não escreva.
- **Frase curta e na ordem direta.** Uma ideia por frase. Pontuação simples.
- **Fato antes de adjetivo.** "Tecido 90% poliéster e 10% elastano, com forro interno" vale mais que "leve, macio e incrível".

### O que não entra (texto com cara de IA)

- **Fórmulas repetidas.** Cada uma pode aparecer no máximo uma vez no site inteiro:
  - "X de Y, Z de W" ("Casca de terra, polpa de nuvem")
  - "X também é Y" ("Concreto também é desenho")
  - "Todo X é Y" ("Toda curva procura a outra")
  - "Não é X. É Y." ("Estampa não é enfeite. É assunto.")
- **Gancho de mistério ou revelação:** "O cupuaçu engana.", "E tem um segredo:", "Spoiler:", dois-pontos para fazer suspense.
- **Frase de efeito no fim do parágrafo:** "para você esquecer que está de sunga", "do mar à roda de samba sem trocar de roupa".
- **Promessa que não dá para provar:** "a que mais faz perguntarem", "impossível de passar despercebida", "todo mundo ama".
- **Lista de três com repetição:** "nada de estoque, nada de sobra, nada de liquidação". Escreva a frase uma vez.
- **Personificar a estampa:** "a estampa encontra", "a camiseta conversa com a arquitetura", "reconhece o lugar de onde veio".
- **Clichê de moda e marketing:** "peça-chave", "atemporal", "para todas as ocasiões", "eleve seu look", "exclusivo" sem dizer por quê, "Seja dos primeiros".
- **Travessão para aparte** e aspas em rótulo inventado.
- **Emoji.**

### Regras da loja (dizer sempre igual)

- **Camisetas:** R$ 159,90, tamanhos P a GG, sob encomenda, chegam em 7 a 15 dias corridos.
- **Sungas:** em breve (`sungasEmBreve` em `assets/js/produtos.js`). Enquanto estiverem em breve, não fale em safra, janela ou data de encomenda.
- **Troca e devolução:** em até 7 dias corridos, com a peça sem uso.
- **Frete:** grátis a partir de R$ 399,90.
- **Primeira compra:** 10% com SIRIGUELA10, conferido no pagamento.
- Para explicar o "sob encomenda", diga o que acontece: a gente só estampa e costura depois do pedido, então não sobra estoque. Não use "sustentável" sozinho como argumento.

### Formatos

- **Nome da estampa:** com maiúscula e artigo feminino ("a Meias-luas", "a Pipa").
- **Chamada (logo abaixo do nome):** até 8 palavras e ponto final, dizendo o que a estampa mostra.
- **Texto da estampa:** 2 parágrafos. O primeiro conta de onde vem e o segundo diz como é a peça (formas, tintas, tecido).
- **Botões:** verbo e objeto, sem ponto ("Comprar a minha", "Ver as camisetas").
- **Mensagens de erro:** dizem o que houve e o que fazer ("Escolha um tamanho.", "Remova as sungas para comprar as camisetas agora.").
- **Números:** "R$ 159,90", "7 a 15 dias corridos", "90% poliéster". Por extenso só no meio do texto corrido ("dezesseis módulos").

### Antes de publicar texto novo

1. Leia em voz alta. Se soa como anúncio, corte.
2. Procure as fórmulas da lista acima no site inteiro (`grep`). Se a frase nova repete uma que já existe, troque.
3. Confira se preço, prazo e troca batem com as regras da loja.
