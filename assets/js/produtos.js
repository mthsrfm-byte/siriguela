/* Catálogo Siriguela — Coleção 01
   Para mudar nome, texto ou preço de uma sunga, edite só este arquivo.
   As fotos ficam em assets/produtos/<slug>/ */

window.SIRIGUELA = {
  preco: 249.90,
  parcelas: 3,
  freteGratisAPartir: 399.90,
  cupom: { codigo: "SIRIGUELA10", desconto: 0.10, regra: "Válido na primeira compra. Conferido no pagamento." },
  /* Encomenda: a safra abre todo mês do dia 1 ao dia 7 (até 23h59, horário local).
     A produção começa quando a janela fecha e a entrega chega em até 10 dias úteis depois
     (sem sábado, domingo e feriados nacionais de data fixa).
     Para testar a loja fora da janela, abra o site com ?janela=aberta (ou ?janela=fechada). */
  janela: { diaInicio: 1, diaFim: 7, entregaDiasUteis: 10 },
  /* modelo: altura estimada pelas fotos (sem medida real) e tamanho que ele veste; corrija aqui quando tiver os dados */
  tamanhos: ["P", "M", "G", "GG"],
  produtos: [
    {
      slug: "pipa", modelo: { altura: "1,85", veste: "M" },
      nome: "Pipa",
      origem: "Rio de Janeiro, RJ",
      coord: "22°57′S 43°10′W",
      cor: "#F15A40",
      piso: "#A8876F",  /* cor do chão da foto de frente: completa o quadro no card vertical */
      chamada: "Papel de seda contra o sol do morro.",
      texto: [
        "Todo moleque carioca já perdeu uma tarde inteira olhando para cima. A Pipa nasceu dessas tardes: a laje quente, a linha esticada, o Pão de Açúcar lá no fundo e uma pipa de papel de seda brigando com o vento de agosto. A gente recortou a cena até sobrar o essencial, quatro planos de cor (coral, céu, piscina e vinho) que se encontram bem no centro, como as varetas.",
        "A estampa cobre frente e costas sem perder o desenho na costura. O tecido é 90% poliéster e 10% elastano: seca rápido, segura a cor no sol e acompanha o corpo do mergulho ao futevôlei."
      ],
      fotos: ["frente", "modelo", "costas-modelo", "sentado", "recorte", "costas", "detalhe", "estampa", "inspiracao"],
      vertical: ["modelo", "costas-modelo", "sentado", "recorte"],
      jpg: ["recorte", "sentado", "frente", "modelo", "costas-modelo", "costas", "detalhe", "estampa"]
    },
    {
      slug: "caju", modelo: { altura: "1,80", veste: "M" },
      nome: "Caju",
      origem: "Fortaleza, CE",
      coord: "3°43′S 38°31′W",
      cor: "#FF5A1F",
      piso: "#D3B7A2",  /* cor do chão da foto de frente: completa o quadro no card vertical */
      chamada: "O fruto e a castanha num gesto só.",
      texto: [
        "No Ceará, caju é fruta, é suco, é doce em calda e é castanha torrada na beira da estrada. E tem um segredo: a parte suculenta nem é o fruto. O fruto de verdade é a castanha, pendurada embaixo. A estampa junta os dois num gesto só, em formas grandes de laranja e lima sobre um rosa de calçada de Fortaleza ao meio-dia.",
        "Desenho orgânico, sem nenhuma linha reta, aplicado na sunga inteira. O tecido é 90% poliéster e 10% elastano, leve na pele e firme no caimento, com cor que continua viva depois de muito sol e água salgada."
      ],
      fotos: ["frente", "modelo", "costas-modelo", "sentado", "recorte", "costas", "detalhe", "estampa", "inspiracao"],
      vertical: ["modelo", "costas-modelo", "sentado", "recorte"],
      jpg: ["recorte", "sentado", "costas-modelo", "modelo", "frente", "costas", "detalhe", "estampa"]
    },
    {
      slug: "cobogo", modelo: { altura: "1,84", veste: "M" },
      nome: "Cobogó",
      origem: "Brasília, DF",
      coord: "15°47′S 47°52′W",
      cor: "#1F5A6B",
      piso: "#C7AB93",  /* cor do chão da foto de frente: completa o quadro no card vertical */
      chamada: "Modernismo que vai à praia.",
      texto: [
        "O cobogó foi inventado no Recife, nos anos 1920, para deixar o vento entrar e o sol do lado de fora. Brasília levou o bloco vazado para fachadas inteiras, e a luz recortada atravessando o concreto virou parte da paisagem da capital. Aqui ele vira quartos de círculo em petróleo, laranja-tijolo e cru: geometria rigorosa que fica mais solta quando sai do prédio e vai para a praia.",
        "A repetição dos módulos foi pensada para encaixar nas costuras da peça. Tecido 90% poliéster e 10% elastano, com estrutura para o desenho ficar no lugar e elasticidade para você esquecer que está de sunga."
      ],
      fotos: ["frente", "modelo", "costas-modelo", "sentado", "recorte", "costas", "detalhe", "estampa", "inspiracao"],
      vertical: ["modelo", "costas-modelo", "sentado", "recorte"],
      jpg: ["recorte", "sentado", "frente", "modelo", "costas-modelo", "costas", "detalhe", "estampa"]
    },
    {
      slug: "mandacaru", modelo: { altura: "1,78", veste: "M" },
      nome: "Mandacaru",
      origem: "Cabaceiras, PB",
      coord: "7°29′S 36°17′W",
      cor: "#C4542B",
      piso: "#CBB7A2",  /* cor do chão da foto de frente: completa o quadro no card vertical */
      chamada: "O sertão em quatro cores lisas.",
      texto: [
        "Cabaceiras, no Cariri paraibano, é a cidade onde menos chove no Brasil, e serviu de cenário para tanto filme que ganhou o apelido de Roliúde Nordestina. A Mandacaru é um pedaço desse cenário em papel recortado: a duna de terra, o céu limpo, o sol a pino e o cacto de pé, que segundo o sertanejo floresce para avisar que a chuva vem.",
        "Frente e costas mostram partes diferentes da paisagem, então cada ângulo conta uma cena. O tecido é 90% poliéster e 10% elastano, feito para sol forte: seca rápido e mantém as quatro cores chapadas."
      ],
      fotos: ["frente", "modelo", "costas-modelo", "sentado", "recorte", "costas", "detalhe", "estampa", "inspiracao"],
      vertical: ["modelo", "costas-modelo", "sentado", "recorte"],
      jpg: ["recorte", "sentado", "frente", "modelo", "costas-modelo", "costas", "detalhe", "estampa"]
    },
    {
      slug: "bacuri", modelo: { altura: "1,82", veste: "M" },
      nome: "Bacuri",
      origem: "Belém, PA",
      coord: "1°27′S 48°30′W",
      cor: "#4655E8",
      piso: "#CAB39E",  /* cor do chão da foto de frente: completa o quadro no card vertical */
      chamada: "Ladrilho de feira, polpa de flor.",
      texto: [
        "Quem passa pelo Ver-o-Peso de manhã sente o cheiro do bacuri antes de ver a fruta. Dentro da casca grossa e amarela, a polpa branca se divide em gomos, e foi esse desenho que virou a flor de quatro pétalas no centro da estampa. Em volta, um ladrilho azul, lima e verde-mata que lembra os azulejos das fachadas da Cidade Velha de Belém.",
        "O padrão se repete pela peça inteira, com o encaixe pensado para a flor cair bem na frente. Tecido 90% poliéster e 10% elastano, que veste justo sem apertar e seca antes de você chegar na barraca."
      ],
      fotos: ["frente", "modelo", "costas-modelo", "sentado", "recorte", "costas", "detalhe", "estampa", "inspiracao"],
      vertical: ["modelo", "costas-modelo", "sentado", "recorte"],
      jpg: ["recorte", "sentado", "frente", "modelo", "costas-modelo", "costas", "detalhe", "estampa"]
    },
    {
      slug: "cupuacu", modelo: { altura: "1,83", veste: "M" },
      nome: "Cupuaçu",
      origem: "Manaus, AM",
      coord: "3°07′S 60°01′W",
      cor: "#8E3FB0",
      piso: "#BA9DCD",  /* cor do chão da foto de frente: completa o quadro no card vertical */
      chamada: "Casca de terra, polpa de nuvem.",
      texto: [
        "O cupuaçu engana. Por fora, uma casca marrom e dura que parece terra seca; por dentro, uma polpa clara, perfumada e macia como nuvem. Primo do cacau, é um dos sabores mais fortes da Amazônia. A estampa conta essa surpresa num corte de paisagem em marrom, lilás e creme, com uma única semente laranja fazendo contraponto.",
        "É a mais silenciosa da coleção, e a que mais faz perguntarem de onde veio. Tecido 90% poliéster e 10% elastano: toque macio, secagem rápida e cor que atravessa o verão sem desbotar."
      ],
      fotos: ["frente", "modelo", "costas-modelo", "sentado", "recorte", "costas", "detalhe", "estampa", "inspiracao"],
      vertical: ["modelo", "costas-modelo", "sentado", "recorte"],
      jpg: ["recorte", "sentado", "frente", "modelo", "costas-modelo", "costas", "detalhe", "estampa"]
    },
    {
      slug: "pitanga", modelo: { altura: "1,80", veste: "M" },
      nome: "Pitanga",
      origem: "Salvador, BA",
      coord: "12°58′S 38°30′W",
      cor: "#E3141B",
      piso: "#EC9B98",  /* cor do chão da foto de frente: completa o quadro no card vertical */
      chamada: "Fruta de quintal em escala gigante.",
      texto: [
        "Em Salvador, pitangueira é árvore de quintal, e quase todo mundo lembra de comer pitanga direto do pé, escolhendo as mais escuras, que são as mais doces. A estampa amplia os gomos da fruta até eles virarem forma pura: vermelho, vinho e um raio de sol amarelo cortando o meio.",
        "Doce, ácida e impossível de passar despercebida, como a fruta. O tecido é 90% poliéster e 10% elastano, com elasticidade e secagem rápida para ir do mar à roda de samba sem trocar de roupa."
      ],
      fotos: ["frente", "modelo", "costas-modelo", "sentado", "recorte", "costas", "detalhe", "estampa", "inspiracao"],
      vertical: ["modelo", "costas-modelo", "sentado", "recorte"],
      jpg: ["recorte", "sentado", "frente", "modelo", "costas-modelo", "costas", "detalhe", "estampa"]
    }
  ],
  legendas: {
    frente: "Frente",
    costas: "Costas",
    "costas-modelo": "No corpo, de costas",
    sentado: "No corpo, sentado",
    recorte: "No corpo, de perto",
    modelo: "No corpo",
    detalhe: "Detalhe da costura",
    estampa: "A estampa",
    inspiracao: "A origem",
    ceu: "No céu"
  }
};
