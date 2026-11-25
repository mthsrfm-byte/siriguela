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
  /* Quem vende: aparece no rodapé, em /contato/ e nas políticas (Decreto 7.962/2013 pede razão social, CNPJ,
     endereço e contato no site). Campo vazio não aparece. Preencha antes de rodar anúncio. */
  empresa: {
    nome: "Siriguela",
    razao: "",          // razão social, como está no CNPJ
    cnpj: "",           // 00.000.000/0000-00
    endereco: "",       // rua, número, bairro, cidade/UF, CEP
    email: "ola@siriguela.site",
    whatsapp: ""        // só números com DDD, ex.: 11999998888
  },
  /* Anúncios: com o ID preenchido, o site mostra o aviso de cookies e, depois do "Aceitar",
     carrega o Pixel da Meta e o Google Analytics 4. Vazio, nada é carregado. */
  marketing: {
    metaPixel: "",      // só números, em Gerenciador de Eventos → Fontes de dados
    ga4: ""             // G-XXXXXXXXXX
  },
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
      chamada: "Luz recortada nas fachadas de Brasília.",
      texto: [
        "O cobogó nasceu no Recife, nos anos 1920, para deixar o vento entrar e o sol do lado de fora. Em Brasília, ele cobriu fachadas inteiras. No fim da tarde, a luz atravessa os blocos vazados e deixa no chão um desenho que anda devagar. A gente levou esse recorte para a praia, em quartos de círculo de petróleo, laranja-tijolo e cru.",
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
      chamada: "Caju maduro na calçada de Fortaleza.",
      texto: [
        "Em Fortaleza, o caju aparece no suco, no doce em calda e na castanha torrada vendida na beira da estrada. A parte que se come é o pedúnculo; o fruto mesmo é a castanha, pendurada embaixo. A estampa junta os dois em formas grandes de laranja e lima, sobre o rosa de uma calçada ao meio-dia.",
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
      chamada: "Pitanga escura no pé, em Salvador.",
      texto: [
        "Em Salvador, pitangueira é árvore de quintal. A fruta boa é a mais escura, colhida direto do pé numa tarde quente. A estampa amplia os gomos até virarem forma pura: vermelho, vinho e um raio de sol amarelo cortando o meio.",
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
      chamada: "Sol a pino no Cariri paraibano.",
      texto: [
        "Cabaceiras, no Cariri paraibano, é a cidade onde menos chove no Brasil e já serviu de cenário para tanto filme que ganhou o apelido de Roliúde Nordestina. Ao meio-dia, a terra, o céu e o mandacaru ficam cada um com uma cor só. A Mandacaru é essa paisagem em papel recortado. Segundo o sertanejo, quando o cacto floresce, a chuva vem.",
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
      chamada: "Cheiro de bacuri no Ver-o-Peso, de manhã.",
      texto: [
        "Quem passa pelo Ver-o-Peso de manhã sente o cheiro do bacuri antes de ver a fruta. Dentro da casca grossa e amarela, a polpa branca se divide em gomos, e esse desenho virou a flor de quatro pétalas no centro da estampa. Em volta, um ladrilho azul, lima e verde-mata, como os azulejos das fachadas da Cidade Velha de Belém.",
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
      chamada: "Cupuaçu aberto numa tarde de Manaus.",
      texto: [
        "Numa tarde quente de Manaus, o cupuaçu aberto em cima da mesa perfuma a cozinha. Por fora, a casca é marrom e dura; por dentro, a polpa é clara e macia. Primo do cacau, ele virou um corte de paisagem em marrom, lilás e creme, com uma única semente laranja no meio.",
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
      chamada: "Vento de agosto na laje carioca.",
      texto: [
        "No Rio, agosto é mês de vento e de pipa no céu. Da laje quente dá para ver o Pão de Açúcar lá no fundo e uma pipa de papel de seda brigando com o vento. A gente recortou essa cena em quatro planos de cor (coral, céu, piscina e vinho), que se encontram no centro como as varetas.",
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
    /* Ficha técnica que aparece em "Detalhes" na página de cada camiseta. Vem do fornecedor que produz:
       preencha com os dados dele (não invente). Enquanto estiver vazio, a seção não aparece.
       tecido: frase curta, ex.: "100% algodão, fio 30.1 penteado, 180 g/m²"
       medidas: { cabecalho: ["Tamanho", "Largura", "Comprimento"], linhas: [["P", "52 cm", "70 cm"], ...] } */
    ficha: {
      tecido: "",
      estampa: "",
      cuidados: "",
      medidas: null
    },
    itens: [
      { slug: "azulejo", nome: "Azulejo", cor: "Branca", chamada: "Um painel azul no fim da tarde.", piso: "#1F4571", takes: ["ladrilho", "cubos"], perto: ["bolsos", "ladrilho:1.6:40%"], estatica: "gola", outra: { f: "de-cima", pose: "deitado", quem: "h" } },
      { slug: "encaixe", nome: "Encaixe", cor: "Branca", chamada: "Um quebra-cabeça de madeira no chão da sala.", piso: "#867B9F", takes: ["inteira", "cubo"], perto: ["recorte-caio", "recorte-taina"], estatica: "detalhe", outra: { f: "nuca", pose: "meio-corpo", quem: "m" } },
      { slug: "meia-lua", nome: "Meia-lua", cor: "Off-white", chamada: "Curvas azuis debaixo da abóbada.", piso: "#752D1A", takes: ["inteira", "cubo"], perto: ["recorte-caio", "inteira:1.9:30%"], estatica: "detalhe", outra: { f: "cubo", pose: "sentado-cubo", quem: "h" } },
      { slug: "blocos", nome: "Blocos", cor: "Preta", chamada: "Sol baixo batendo no concreto.", piso: "#A3711E", takes: ["bloco", "chao"], perto: ["bloco:1.25:62%", "vao:1.7:85%"], estatica: "detalhe", outra: { f: "vao", pose: "apoiado", quem: "m" } },
      { slug: "ciranda", nome: "Ciranda", cor: "Azul-marinho", chamada: "Roda de ciranda na beira do mar.", piso: "#D9CEBF", takes: ["inteira", "chao"], perto: ["recorte", "chao:1.6:42%"], estatica: "detalhe", outra: { f: "chao", pose: "sentado-chao", quem: "h" } },
      { slug: "bandeirinhas", nome: "Bandeirinhas", cor: "Preta", chamada: "Arraial de junho, depois que escurece.", piso: "#CF6454", takes: ["andando", "banco"], perto: ["recorte", "inteira:1.8:30%"], estatica: "detalhe", outra: { f: "banco", pose: "sentado-cubo", quem: "m" } },
      { slug: "degraus", nome: "Degraus", cor: "Azul-petróleo", chamada: "Escadaria pintada, vista lá de cima.", piso: "#C75A4B", takes: ["bloco", "inteira"], perto: ["recorte", "inteira:1.8:28%"], estatica: "detalhe", outra: { f: "bloco", pose: "pe-no-degrau", quem: "h" } },
      { slug: "jardim", nome: "Jardim", cor: "Terracota", chamada: "Sombra de folha num muro verde.", piso: "#1D322B", takes: ["cubo", "sombra-samir"], perto: ["bolsos", "nuca"], estatica: "solta", solta: true, outra: { f: "sombra-samir", pose: "perfil", quem: "h" } },
      { slug: "catavento", nome: "Catavento", cor: "Off-white", chamada: "Vento forte na duna, céu limpo.", piso: "#92651D", takes: ["capa", "caminhada"], perto: ["nuca", "thales:1.9:30%"], estatica: "gola", outra: { f: "giro", pose: "em-pe", quem: "m" } }
    ]
  }
};
