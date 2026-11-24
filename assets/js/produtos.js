/* Catálogo Siriguela — Coleção 01
   Para mudar nome, texto ou preço de uma sunga, edite só este arquivo.
   As fotos ficam em assets/produtos/<slug>/ */

globalThis.SIRIGUELA = {
  /* true: as sungas aparecem no site, mas não estão à venda (cards "Em breve", página com aviso por e-mail
     e o checkout recusa sunga). Volte para false quando a Coleção 01 abrir. */
  sungasEmBreve: true,
  preco: 279.90,
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
      slug: "cobogo", recorte: true, outra: { f: "modelo-v", pose: "em-pe" }, modelo: { altura: "1,84", veste: "M" },
      nome: "Cobogó",
      origem: "Brasília, DF",
      coord: "15°47′S 47°52′W",
      cor: "#1F5A6B",
      piso: "#C7AB93",  /* cor do chão da foto de frente: completa o quadro no card vertical */
      chamada: "Modernismo que vai à praia.",
      texto: [
        "O cobogó foi inventado no Recife, nos anos 1920, para deixar o vento entrar e o sol do lado de fora. Brasília levou o bloco vazado para fachadas inteiras, e a luz recortada atravessando o concreto virou parte da paisagem da capital. Aqui ele vira quartos de círculo em petróleo, laranja-tijolo e cru: a mesma geometria do prédio, levada para a praia.",
        "A repetição dos módulos foi pensada para encaixar nas costuras da peça. Tecido 90% poliéster e 10% elastano, firme o bastante para o desenho não deformar no corpo."
      ],
      fotos: ["frente", "modelo", "costas-modelo", "sentado", "recorte", "costas", "detalhe", "estampa", "inspiracao"],
      vertical: ["modelo", "costas-modelo", "sentado", "recorte"],
      jpg: ["recorte", "sentado", "frente", "modelo", "costas-modelo", "costas", "detalhe", "estampa"]
    },
    {
      slug: "caju", recorte: true, outra: { f: "sentado-v", pose: "sentado-cubo" }, modelo: { altura: "1,80", veste: "M" },
      nome: "Caju",
      origem: "Fortaleza, CE",
      coord: "3°43′S 38°31′W",
      cor: "#FF5A1F",
      piso: "#D3B7A2",  /* cor do chão da foto de frente: completa o quadro no card vertical */
      chamada: "O caju e a castanha numa forma só.",
      texto: [
        "No Ceará, caju é fruta, é suco, é doce em calda e é castanha torrada na beira da estrada. A parte suculenta é o pedúnculo; o fruto mesmo é a castanha, pendurada embaixo. A estampa junta os dois numa forma só, em formas grandes de laranja e lima sobre um rosa de calçada de Fortaleza ao meio-dia.",
        "Desenho orgânico, sem nenhuma linha reta, aplicado na sunga inteira. Tecido 90% poliéster e 10% elastano, com forro interno e cor que aguenta sol e água salgada."
      ],
      fotos: ["frente", "modelo", "costas-modelo", "sentado", "recorte", "costas", "detalhe", "estampa", "inspiracao"],
      vertical: ["modelo", "costas-modelo", "sentado", "recorte"],
      jpg: ["recorte", "sentado", "costas-modelo", "modelo", "frente", "costas", "detalhe", "estampa"]
    },
    {
      slug: "pitanga", recorte: true, outra: { f: "costas-modelo-v", pose: "costas" }, modelo: { altura: "1,80", veste: "M" },
      nome: "Pitanga",
      origem: "Salvador, BA",
      coord: "12°58′S 38°30′W",
      cor: "#E3141B",
      piso: "#EC9B98",  /* cor do chão da foto de frente: completa o quadro no card vertical */
      chamada: "Fruta de quintal em escala gigante.",
      texto: [
        "Em Salvador, pitangueira é árvore de quintal, e quase todo mundo lembra de comer pitanga direto do pé, escolhendo as mais escuras, que são as mais doces. A estampa amplia os gomos da fruta até eles virarem forma pura: vermelho, vinho e um raio de sol amarelo cortando o meio.",
        "Tecido 90% poliéster e 10% elastano, com forro interno e secagem rápida."
      ],
      fotos: ["frente", "modelo", "costas-modelo", "sentado", "recorte", "costas", "detalhe", "estampa", "inspiracao"],
      vertical: ["modelo", "costas-modelo", "sentado", "recorte"],
      jpg: ["recorte", "sentado", "frente", "modelo", "costas-modelo", "costas", "detalhe", "estampa"]
    },
    {
      slug: "mandacaru", recorte: true, outra: { f: "recorte-v", pose: "perto" }, modelo: { altura: "1,78", veste: "M" },
      nome: "Mandacaru",
      origem: "Cabaceiras, PB",
      coord: "7°29′S 36°17′W",
      cor: "#C4542B",
      piso: "#CBB7A2",  /* cor do chão da foto de frente: completa o quadro no card vertical */
      chamada: "O sertão em quatro cores lisas.",
      texto: [
        "Cabaceiras, no Cariri paraibano, é a cidade onde menos chove no Brasil, e serviu de cenário para tanto filme que ganhou o apelido de Roliúde Nordestina. A Mandacaru é um pedaço desse cenário em papel recortado: a duna de terra, o céu limpo, o sol a pino e o cacto de pé, que segundo o sertanejo floresce para avisar que a chuva vem.",
        "Frente e costas mostram partes diferentes da paisagem. Tecido 90% poliéster e 10% elastano, de secagem rápida, com as quatro cores chapadas."
      ],
      fotos: ["frente", "modelo", "costas-modelo", "sentado", "recorte", "costas", "detalhe", "estampa", "inspiracao"],
      vertical: ["modelo", "costas-modelo", "sentado", "recorte"],
      jpg: ["recorte", "sentado", "frente", "modelo", "costas-modelo", "costas", "detalhe", "estampa"]
    },
    {
      slug: "bacuri", recorte: true, outra: { f: "sentado-v", pose: "sentado-chao" }, modelo: { altura: "1,82", veste: "M" },
      nome: "Bacuri",
      origem: "Belém, PA",
      coord: "1°27′S 48°30′W",
      cor: "#4655E8",
      piso: "#CAB39E",  /* cor do chão da foto de frente: completa o quadro no card vertical */
      chamada: "A flor de quatro gomos do Ver-o-Peso.",
      texto: [
        "Quem passa pelo Ver-o-Peso de manhã sente o cheiro do bacuri antes de ver a fruta. Dentro da casca grossa e amarela, a polpa branca se divide em gomos, e foi esse desenho que virou a flor de quatro pétalas no centro da estampa. Em volta, um ladrilho azul, lima e verde-mata que lembra os azulejos das fachadas da Cidade Velha de Belém.",
        "O padrão se repete pela peça inteira, com o encaixe pensado para a flor cair bem na frente. Tecido 90% poliéster e 10% elastano, de corte justo e secagem rápida."
      ],
      fotos: ["frente", "modelo", "costas-modelo", "sentado", "recorte", "costas", "detalhe", "estampa", "inspiracao"],
      vertical: ["modelo", "costas-modelo", "sentado", "recorte"],
      jpg: ["recorte", "sentado", "frente", "modelo", "costas-modelo", "costas", "detalhe", "estampa"]
    },
    {
      slug: "cupuacu", recorte: true, outra: { f: "modelo-v", pose: "em-pe" }, modelo: { altura: "1,83", veste: "M" },
      nome: "Cupuaçu",
      origem: "Manaus, AM",
      coord: "3°07′S 60°01′W",
      cor: "#8E3FB0",
      piso: "#BA9DCD",  /* cor do chão da foto de frente: completa o quadro no card vertical */
      chamada: "Uma semente laranja no meio do marrom.",
      texto: [
        "Por fora, o cupuaçu tem uma casca marrom e dura que parece terra seca; por dentro, uma polpa clara e perfumada. Primo do cacau, é um dos sabores mais fortes da Amazônia. A estampa conta essa surpresa num corte de paisagem em marrom, lilás e creme, com uma única semente laranja fazendo contraponto.",
        "É a estampa de cores mais baixas da coleção. Tecido 90% poliéster e 10% elastano, de toque macio e secagem rápida."
      ],
      fotos: ["frente", "modelo", "costas-modelo", "sentado", "recorte", "costas", "detalhe", "estampa", "inspiracao"],
      vertical: ["modelo", "costas-modelo", "sentado", "recorte"],
      jpg: ["recorte", "sentado", "frente", "modelo", "costas-modelo", "costas", "detalhe", "estampa"]
    },
    {
      slug: "pipa", recorte: true, outra: { f: "costas-modelo-v", pose: "costas" }, modelo: { altura: "1,85", veste: "M" },
      nome: "Pipa",
      origem: "Rio de Janeiro, RJ",
      coord: "22°57′S 43°10′W",
      cor: "#F15A40",
      piso: "#A8876F",  /* cor do chão da foto de frente: completa o quadro no card vertical */
      chamada: "Papel de seda contra o sol do morro.",
      texto: [
        "Todo moleque carioca já perdeu uma tarde inteira olhando para cima. A Pipa nasceu dessas tardes: a laje quente, a linha esticada, o Pão de Açúcar lá no fundo e uma pipa de papel de seda brigando com o vento de agosto. A gente recortou a cena até sobrar quatro planos de cor (coral, céu, piscina e vinho), que se encontram no centro como as varetas.",
        "A estampa cobre frente e costas sem quebrar o desenho na costura. Tecido 90% poliéster e 10% elastano, com forro interno e secagem rápida."
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
  },
  /* Camisetas: venda contínua (sem janela de safra), feitas depois do pedido e entregues em 7 a 15 dias corridos.
     As páginas ficam em /camisetas/<slug>/ (escritas à mão) e as fotos em assets/camisetas/<slug>/.
     takes: as duas fotos que se alternam no card, sempre uma do homem e uma da mulher do ensaio, em poses diferentes; estatica: a foto da camisa que aparece no hover;
     perto: as duas fotos do card pequeno (quadrado), mais fechadas na camiseta, também uma de cada modelo. "foto:zoom:altura" amplia a foto
     a partir daquela altura, para recortar o rosto e ficar só com a peça.
     outra: a foto única do slider "Outras camisetas" no fim de cada página; pose e quem (h/m) servem para o sorteio
     não deixar duas poses iguais nem o mesmo modelo lado a lado. As sungas têm o mesmo campo, só com a pose. */
  camisetas: {
    preco: 159.90,
    tamanhos: ["P", "M", "G", "GG"],
    entrega: { min: 7, max: 15 },
    itens: [
      { slug: "azulejo", nome: "Azulejo", cor: "Branca", chamada: "Arquitetura para vestir.", piso: "#1F4571", takes: ["ladrilho", "cubos"], perto: ["bolsos", "ladrilho:1.6:40%"], estatica: "gola", outra: { f: "de-cima", pose: "deitado", quem: "h" } },
      { slug: "encaixe", nome: "Encaixe", cor: "Branca", chamada: "Cada forma no lugar da outra.", piso: "#867B9F", takes: ["inteira", "cubo"], perto: ["recorte-caio", "recorte-taina"], estatica: "detalhe", outra: { f: "nuca", pose: "meio-corpo", quem: "m" } },
      { slug: "meia-lua", nome: "Meia-lua", cor: "Off-white", chamada: "Curva com curva, até fechar o quadrado.", piso: "#752D1A", takes: ["inteira", "cubo"], perto: ["recorte-caio", "inteira:1.9:30%"], estatica: "detalhe", outra: { f: "cubo", pose: "sentado-cubo", quem: "h" } },
      { slug: "blocos", nome: "Blocos", cor: "Preta", chamada: "Um prédio que cabe no peito.", piso: "#A3711E", takes: ["bloco", "chao"], perto: ["bloco:1.25:62%", "vao:1.7:85%"], estatica: "detalhe", outra: { f: "vao", pose: "apoiado", quem: "m" } },
      { slug: "ciranda", nome: "Ciranda", cor: "Azul-marinho", chamada: "Meio círculo, e o desenho roda.", piso: "#D9CEBF", takes: ["inteira", "chao"], perto: ["recorte", "chao:1.6:42%"], estatica: "detalhe", outra: { f: "chao", pose: "sentado-chao", quem: "h" } },
      { slug: "bandeirinhas", nome: "Bandeirinhas", cor: "Preta", chamada: "Triângulo por triângulo, a festa.", piso: "#CF6454", takes: ["andando", "banco"], perto: ["recorte", "inteira:1.8:30%"], estatica: "detalhe", outra: { f: "banco", pose: "sentado-cubo", quem: "m" } },
      { slug: "degraus", nome: "Degraus", cor: "Azul-petróleo", chamada: "Sobe, vira, desce, recomeça.", piso: "#C75A4B", takes: ["bloco", "inteira"], perto: ["recorte", "inteira:1.8:28%"], estatica: "detalhe", outra: { f: "bloco", pose: "pe-no-degrau", quem: "h" } },
      { slug: "jardim", nome: "Jardim", cor: "Terracota", chamada: "Um jardim para vestir.", piso: "#1D322B", takes: ["cubo", "sombra-samir"], perto: ["bolsos", "nuca"], estatica: "solta", solta: true, outra: { f: "sombra-samir", pose: "perfil", quem: "h" } },
      { slug: "catavento", nome: "Catavento", cor: "Off-white", chamada: "O vento tem desenho.", piso: "#92651D", takes: ["capa", "caminhada"], perto: ["nuca", "thales:1.9:30%"], estatica: "gola", outra: { f: "giro", pose: "em-pe", quem: "m" } }
    ]
  }
};
