/* SIRIGUELA — loja estática (sem build). */
(function () {
  "use strict";

  const S = window.SIRIGUELA;
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const brl = (v) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  const img = (p, f) => `assets/produtos/${p.slug}/${f}.${(p.jpg || []).includes(f) ? "jpg" : "webp"}`;
  /* foto responsiva: o navegador escolhe entre as versões WebP de 640/1080/1600px
     (geradas por scripts/variantes-webp.py) a menor que serve para a tela */
  const pic = (path, sizes) => {
    const b = path.replace(/\.(jpg|webp)$/, "");
    return `src="${b}.w1080.webp" srcset="${b}.w640.webp 640w, ${b}.w1080.webp 1080w, ${b}.w1600.webp 1600w" sizes="${sizes}"`;
  };
  const num = (i) => String(i + 1).padStart(2, "0");
  const total = S.produtos.length;
  const bySlug = (slug) => S.produtos.find((p) => p.slug === slug);
  /* endereço da página de cada sunga: /colecao1/sunga/<slug>/ (gerado por scripts/gerar-paginas.py) */
  const urlDe = (p) => `colecao1/sunga/${p.slug}/`;
  const parcela = (v) => brl(Math.floor((v / S.parcelas) * 100) / 100);
  /* sungas em breve (S.sungasEmBreve): sem venda, só lista de aviso; a janela da safra fica guardada para quando voltarem */
  const EMBREVE = !!S.sungasEmBreve;
  /* camisetas: venda contínua, endereço /camisetas/<slug>/ */
  const C = S.camisetas;
  const camBySlug = (slug) => C.itens.find((c) => c.slug === slug);
  const urlCam = (c) => `camisetas/${c.slug}/`;
  const camFoto = (c, f, sizes) => (c.solta && f === "solta")
    ? `src="assets/camisetas/${c.slug}/solta.w1080.webp" srcset="assets/camisetas/${c.slug}/solta.w640.webp 640w, assets/camisetas/${c.slug}/solta.w1080.webp 1080w, assets/camisetas/${c.slug}/solta.w1188.webp 1188w" sizes="${sizes}"`
    : pic(`assets/camisetas/${c.slug}/${f}.webp`, sizes);
  const prazoCam = `${C.entrega.min} a ${C.entrega.max} dias corridos`;
  const TROCA_TXT = "Troca e devolução em até 7 dias corridos, com a peça sem uso";
  /* item da sacola: { slug, size, qty, tipo? } — sem tipo é sunga (sacolas antigas) */
  const peca = (i) => {
    if (i.tipo === "camiseta") {
      const c = camBySlug(i.slug);
      return c && { tipo: "camiseta", nome: `Camiseta ${c.nome}`, preco: C.preco, url: urlCam(c), thumb: `src="assets/camisetas/${c.slug}/email-1x1.jpg"` };
    }
    const p = bySlug(i.slug);
    return p && { tipo: "sunga", nome: p.nome, preco: S.preco, url: urlDe(p), thumb: pic(img(p, "frente"), "120px") };
  };
  const store = {
    get(k, d) { try { const v = localStorage.getItem(k); return v === null ? d : JSON.parse(v); } catch { return d; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} }
  };

  /* Logo oficial em curvas. O nome usa currentColor para o menu poder inverter
     sobre as fotos; o ponto mora numa camada separada (.head-dot) e fica sempre vermelho. */
  const LOGO_PATH = "M257 10Q157 10 98.0 -34.0Q39 -78 31 -158H127Q134 -114 167.5 -90.5Q201 -67 259 -67Q310 -67 337.0 -85.0Q364 -103 364 -136Q364 -160 348.5 -176.5Q333 -193 288 -204L206 -223Q129 -242 91.5 -279.5Q54 -317 54 -372Q54 -441 105.5 -480.5Q157 -520 247 -520Q336 -520 390.5 -480.0Q445 -440 452 -368H356Q350 -404 321.5 -423.5Q293 -443 244 -443Q198 -443 173.5 -426.5Q149 -410 149 -381Q149 -357 167.5 -341.0Q186 -325 229 -314L313 -293Q386 -275 423.0 -234.5Q460 -194 460 -137Q460 -68 406.5 -29.0Q353 10 257 10ZM526.0 0V-510H630.0V0ZM521.0 -610V-727H636.0V-610ZM741.0 0V-510H840.0V-383H845.0V0ZM845.0 -266 832.0 -387Q850.0 -452 894.0 -486.0Q938.0 -520 999.0 -520Q1022.0 -520 1031.0 -516V-418Q1026.0 -420 1017.0 -420.5Q1008.0 -421 995.0 -421Q920.0 -421 882.5 -382.0Q845.0 -343 845.0 -266ZM1080.0 0V-510H1184.0V0ZM1075.0 -610V-727H1190.0V-610ZM1506.0 215Q1410.0 215 1347.5 171.5Q1285.0 128 1272.0 56H1370.0Q1380.0 89 1414.5 108.0Q1449.0 127 1507.0 127Q1582.0 127 1619.0 90.0Q1656.0 53 1656.0 -20V-130L1665.0 -128Q1650.0 -70 1600.0 -36.5Q1550.0 -3 1480.0 -3Q1413.0 -3 1362.0 -35.0Q1311.0 -67 1283.0 -124.5Q1255.0 -182 1255.0 -259Q1255.0 -337 1284.0 -396.0Q1313.0 -455 1365.5 -487.0Q1418.0 -519 1488.0 -519Q1560.0 -519 1607.5 -484.5Q1655.0 -450 1668.0 -387L1660.0 -386V-510H1759.0V-21Q1759.0 89 1691.5 152.0Q1624.0 215 1506.0 215ZM1511.0 -87Q1578.0 -87 1618.5 -134.0Q1659.0 -181 1659.0 -263Q1659.0 -343 1618.5 -389.0Q1578.0 -435 1510.0 -435Q1442.0 -435 1402.0 -388.5Q1362.0 -342 1362.0 -260Q1362.0 -180 1402.5 -133.5Q1443.0 -87 1511.0 -87ZM2036.0 10Q1985.0 10 1946.0 -11.5Q1907.0 -33 1885.5 -71.0Q1864.0 -109 1864.0 -158V-510H1968.0V-182Q1968.0 -129 1994.0 -103.0Q2020.0 -77 2068.0 -77Q2111.0 -77 2144.5 -97.0Q2178.0 -117 2197.5 -152.5Q2217.0 -188 2217.0 -235L2230.0 -113Q2205.0 -57 2153.5 -23.5Q2102.0 10 2036.0 10ZM2221.0 0V-120H2217.0V-510H2320.0V0ZM2649.0 10Q2572.0 10 2513.5 -24.0Q2455.0 -58 2422.0 -118.0Q2389.0 -178 2389.0 -256Q2389.0 -335 2421.5 -394.5Q2454.0 -454 2513.0 -487.0Q2572.0 -520 2648.0 -520Q2722.0 -520 2776.5 -488.5Q2831.0 -457 2860.5 -401.0Q2890.0 -345 2890.0 -268Q2890.0 -256 2889.5 -245.5Q2889.0 -235 2887.0 -224H2459.0V-302H2814.0L2788.0 -271Q2788.0 -353 2751.0 -396.0Q2714.0 -439 2648.0 -439Q2577.0 -439 2535.5 -390.5Q2494.0 -342 2494.0 -256Q2494.0 -169 2535.5 -120.0Q2577.0 -71 2651.0 -71Q2696.0 -71 2729.0 -89.5Q2762.0 -108 2778.0 -144H2876.0Q2851.0 -72 2791.5 -31.0Q2732.0 10 2649.0 10ZM2961.0 0V-720H3065.0V0ZM3492.0 0Q3487.0 -19 3485.5 -42.0Q3484.0 -65 3484.0 -98H3479.0V-341Q3479.0 -390 3454.5 -414.5Q3430.0 -439 3377.0 -439Q3326.0 -439 3295.5 -419.0Q3265.0 -399 3260.0 -362H3161.0Q3168.0 -434 3226.0 -477.0Q3284.0 -520 3381.0 -520Q3481.0 -520 3531.0 -473.5Q3581.0 -427 3581.0 -337V-98Q3581.0 -75 3584.0 -51.0Q3587.0 -27 3593.0 0ZM3316.0 10Q3238.0 10 3192.0 -28.5Q3146.0 -67 3146.0 -133Q3146.0 -201 3194.5 -240.5Q3243.0 -280 3334.0 -294L3502.0 -321V-248L3350.0 -224Q3299.0 -216 3273.5 -197.0Q3248.0 -178 3248.0 -142Q3248.0 -107 3271.5 -89.5Q3295.0 -72 3340.0 -72Q3400.0 -72 3439.5 -101.0Q3479.0 -130 3479.0 -174L3492.0 -100Q3474.0 -47 3428.0 -18.5Q3382.0 10 3316.0 10Z";
  const logo = () => `<svg class="logo__svg" viewBox="-29 -787 3922 1062" role="img" aria-label="Siriguela"><path fill="currentColor" d="${LOGO_PATH}"/><ellipse class="logo__dot" cx="3748" cy="-110" rx="85" ry="110" transform="rotate(-12 3748 -110)"/></svg>`;

  /* ---------- Janela de encomenda ----------
     Cada mês é uma safra: encomendas do dia 1 ao 7, produção depois que a
     janela fecha, entrega em até N dias úteis. Tudo que o site diz sobre prazo sai daqui. */
  const MESES = ["janeiro", "fevereiro", "março", "abril", "maio", "junho", "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"];
  const DIA = 86400000;
  const EXTENSO = ["", "um", "dois", "três", "quatro", "cinco", "seis", "sete", "oito", "nove", "dez", "onze", "doze", "treze", "catorze", "quinze"];
  const J = (() => {
    const cfg = S.janela;
    let sim = null;
    try {
      const q = new URLSearchParams(location.search).get("janela");
      if (q) sessionStorage.setItem("siriguela.janela", q);
      sim = q || sessionStorage.getItem("siriguela.janela");
    } catch {}
    const abre = (y, m) => new Date(y, m, cfg.diaInicio, 0, 0, 0);
    const fecha = (y, m) => new Date(y, m, cfg.diaFim, 23, 59, 59);
    const calc = (now) => {
      const y = now.getFullYear(), m = now.getMonth();
      if (now < abre(y, m)) return { aberta: false, ini: abre(y, m), fim: fecha(y, m) };
      if (now <= fecha(y, m)) return { aberta: true, ini: abre(y, m), fim: fecha(y, m) };
      return { aberta: false, ini: abre(y, m + 1), fim: fecha(y, m + 1) };
    };
    const horario = new Intl.DateTimeFormat("sv-SE", {
      timeZone: "America/Sao_Paulo", dateStyle: "short", timeStyle: "medium"
    }).format(new Date());
    let now = new Date(horario.replace(" ", "T"));
    let w = calc(now);
    if (sim === "aberta" && !w.aberta) { now = new Date(w.ini.getTime() + 3.5 * DIA); w = calc(now); }
    if (sim === "fechada" && w.aberta) { now = new Date(w.fim.getTime() + DIA); w = calc(now); }
    const producao = new Date(w.fim.getTime() + 1000);
    /* dias úteis: pula sábado, domingo e feriados nacionais de data fixa */
    const FERIADOS = ["1-1", "21-4", "1-5", "7-9", "12-10", "2-11", "15-11", "20-11", "25-12"];
    const util = (d) => d.getDay() !== 0 && d.getDay() !== 6 && !FERIADOS.includes(`${d.getDate()}-${d.getMonth() + 1}`);
    const entrega = new Date(w.fim);
    for (let n = 0; n < cfg.entregaDiasUteis;) { entrega.setDate(entrega.getDate() + 1); if (util(entrega)) n++; }
    const diasPara = (d) => Math.max(0, Math.ceil((d - now) / DIA));
    const dia = (d) => (d.getDate() === 1 ? "1º" : String(d.getDate()));
    const longa = (d) => `${dia(d)} de ${MESES[d.getMonth()]}`;
    const curta = (d) => `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}`;
    const safra = `Safra de ${MESES[w.ini.getMonth()]}`;
    const periodo = `${w.ini.getDate()} a ${w.fim.getDate()} de ${MESES[w.fim.getMonth()]}`;
    const nAbre = diasPara(w.ini), nFecha = diasPara(w.fim);
    const quando = w.aberta
      ? (nFecha <= 1 ? "Fecha hoje, às 23h59" : `Fecha em ${nFecha} dias`)
      : (nAbre <= 1 ? "Abre amanhã" : `Abre em ${nAbre} dias`);
    if (EMBREVE) w.aberta = false;
    return { ...w, producao, entrega, longa, curta, safra, periodo, quando, entregaDias: cfg.entregaDiasUteis, diasJanela: cfg.diaFim - cfg.diaInicio + 1 };
  })();

  /* ---------- Cupom e frete ---------- */
  const CUPOM_KEY = "siriguela.cupom";
  const cupomAtivo = () => store.get(CUPOM_KEY, null) === S.cupom.codigo;
  const contas = (items) => {
    const sub = items.reduce((v, i) => v + peca(i).preco * i.qty, 0);
    const desc = cupomAtivo() ? Math.round(sub * S.cupom.desconto * 100) / 100 : 0;
    const produtos = sub - desc;
    const gratis = produtos >= S.freteGratisAPartir;
    return { sub, desc, produtos, gratis, falta: Math.max(0, S.freteGratisAPartir - produtos) };
  };

  /* ---------- Cabeçalho, rodapé e sacola (comuns às páginas) ---------- */
  /* faixa da safra + cabeçalho: entram antes do conteúdo (app.js roda no início do <body>),
     assim nada empurra a página para baixo depois que ela aparece */
  function chromeTop() {
    /* nas páginas das camisetas o topo fica limpo: só o cabeçalho e o nome */
    const limpo = ["camiseta", "camisetas"].includes(document.body.dataset.page);
    const faixa = EMBREVE
      ? `<a href="camisetas/" class="janela-bar__main"><span>Camisetas sob encomenda</span><span class="janela-bar__sep" aria-hidden="true">·</span><span>Chegam em ${prazoCam}</span></a>`
      : `<a href="index.html#encomenda" class="janela-bar__main">
          <span>Safra ${MESES[J.ini.getMonth()].slice(0, 3).replace(/^./, (c) => c.toUpperCase())}/${J.ini.getFullYear()}</span>
          <span class="janela-bar__sep" aria-hidden="true">·</span>
          <span>Encomendas até ${J.curta(J.fim)}</span>
        </a>`;
    document.body.insertAdjacentHTML("afterbegin", `
      ${limpo ? "" : `<div class="janela-bar">
        ${faixa}
        <span class="janela-bar__aside">10% na primeira compra com ${S.cupom.codigo}</span>
      </div>`}
      <header class="head">
        <a class="logo" href="index.html" aria-label="Siriguela, página inicial">${logo()}</a>
        <nav class="head__nav" aria-label="Principal">
          <a href="camisetas/">Camisetas</a>
          <a href="sungas/">Sungas${EMBREVE ? ` <span class="head__tag">em breve</span>` : ""}</a>
          <a href="index.html#encomenda">Como funciona?</a>
          <a href="index.html#sobre">Sobre</a>
        </nav>
        <div class="head__right">
          <button class="head__menu" aria-expanded="false" data-menu>Menu</button>
          <button class="head__bag" data-open-bag aria-label="Abrir sacola">Sacola <b data-count>(0)</b></button>
        </div>
      </header>
      <div class="head-dot" aria-hidden="true"><span class="logo">${logo()}</span></div>`);
  }

  function chrome() {
    document.body.insertAdjacentHTML("beforeend", `
      <footer>
        <div class="foot">
          <div>
            <h3 class="foot__logo"><img src="assets/img/logo-mono.svg" alt="Siriguela" width="104" height="28"></h3>
            <p>Camisetas e sungas estampadas, feitas sob encomenda a partir de pedaços do Brasil.</p>
          </div>
          <div>
            <h3 class="mono">Loja</h3>
            <a href="camisetas/">Camisetas</a>
            <a href="sungas/">Sungas</a>
            <a href="#" data-open-bag>Sacola</a>
          </div>
          <div>
            <h3 class="mono">Ajuda</h3>
            <a href="index.html#encomenda">Como funciona a encomenda</a>
            <a href="#">Trocas</a>
            <a href="#">Contato</a>
          </div>
          <!-- coluna "Siga" (Instagram, TikTok) volta quando os perfis estiverem no ar -->
        </div>
        <div class="foot__base mono mute">
          <span>© ${new Date().getFullYear()} Siriguela</span>
          <span>Feito sob encomenda no Brasil</span>
        </div>
      </footer>
      <div class="scrim" data-close-bag></div>
      <aside class="bag" aria-label="Sacola" aria-hidden="true" inert data-lenis-prevent>
        <div class="bag__head mono">
          <span>Sacola</span>
          <button data-close-bag>Fechar ✕</button>
        </div>
        <div class="bag__list" data-bag-list></div>
        <div class="bag__foot" data-bag-foot></div>
      </aside>
      <div class="toast mono" role="status" aria-live="polite"></div>`);

    const menu = $("[data-menu]");
    menu.addEventListener("click", () => {
      const on = document.body.classList.toggle("is-menu");
      menu.setAttribute("aria-expanded", on);
      menu.textContent = on ? "Fechar" : "Menu";
    });
    $$(".head__nav a").forEach((a) => a.addEventListener("click", () => {
      document.body.classList.remove("is-menu");
      menu.textContent = "Menu";
    }));
  }

  /* ---------- Sacola ---------- */
  const KEY = "siriguela.sacola";
  const bag = {
    get() { return store.get(KEY, []) || []; },
    set(items) { store.set(KEY, items); render(); },
    add(slug, size, tipo) {
      const items = bag.get();
      const hit = items.find((i) => i.slug === slug && i.size === size && (i.tipo || "sunga") === (tipo || "sunga"));
      hit ? hit.qty++ : items.push(tipo === "camiseta" ? { slug, size, qty: 1, tipo } : { slug, size, qty: 1 });
      bag.set(items);
    },
    qty(idx, d) {
      const items = bag.get();
      items[idx].qty += d;
      if (items[idx].qty < 1) items.splice(idx, 1);
      bag.set(items);
    },
    rm(idx) { const items = bag.get(); items.splice(idx, 1); bag.set(items); }
  };

  const freteFrase = (c) => {
    if (c.gratis) return "Frete grátis para todo o Brasil.";
    return `Faltam ${brl(c.falta)} para o frete grátis.`;
  };

  function render() {
    const items = bag.get().filter((i) => peca(i));
    const count = items.reduce((n, i) => n + i.qty, 0);
    $$("[data-count]").forEach((b) => { b.textContent = `(${count})`; b.classList.toggle("has", !!count); });

    const list = $("[data-bag-list]");
    const foot = $("[data-bag-foot]");
    if (!items.length) {
      list.innerHTML = `<div class="bag__empty">
        <p>Sua sacola está vazia.</p>
        <p class="bag__hint">Camisetas: compra aberta todos os dias, entrega em ${prazoCam}. Na primeira compra, ${S.cupom.codigo} dá 10% de desconto.</p>
        <a class="btn btn--ghost btn--full" href="camisetas/" data-close-bag>Ver camisetas <span>→</span></a></div>`;
      foot.innerHTML = "";
      return;
    }
    const temSunga = items.some((i) => peca(i).tipo === "sunga");
    const temCam = items.some((i) => peca(i).tipo === "camiseta");
    list.innerHTML = `<p class="bag__safra idx">Sob encomenda${temSunga && !EMBREVE ? ` · ${J.safra}` : ""}</p>` + items.map((i) => {
      const x = peca(i), idx = bag.get().indexOf(bag.get().find((b) => b.slug === i.slug && b.size === i.size && (b.tipo || "sunga") === (i.tipo || "sunga")));
      return `<div class="line">
        <a href="${x.url}"><img ${x.thumb} alt="${x.tipo === "sunga" ? "Sunga " : ""}${x.nome}"></a>
        <div>
          <div class="line__name">${x.nome}</div>
          <div class="mono mute">Tam. ${i.size} · feita sob encomenda</div>
          <div class="qty">
            <button aria-label="Diminuir" data-q="${idx}" data-d="-1">−</button>
            <span>${i.qty}</span>
            <button aria-label="Aumentar" data-q="${idx}" data-d="1">+</button>
          </div>
        </div>
        <div class="line__right">
          <span>${brl(x.preco * i.qty)}</span>
          <button class="line__rm mono" data-rm="${idx}">Remover</button>
        </div>
      </div>`;
    }).join("");

    const c = contas(items);
    const pode = J.aberta || !temSunga;
    const prazo = [temCam ? `Camisetas chegam em ${prazoCam}.` : "", temSunga ? `Sungas: produção a partir de ${J.longa(J.producao)}, chegam até ${J.longa(J.entrega)}.` : ""].filter(Boolean).join("<br>");
    const cupom = cupomAtivo()
      ? `<div class="bag__row bag__row--cupom"><span>Cupom ${S.cupom.codigo} <button class="line__rm" data-cupom-rm>remover</button></span><span>− ${brl(c.desc)}</span></div>`
      : `<form class="coupon" data-coupon novalidate>
          <label class="sr" for="cupom">Cupom de desconto</label>
          <input id="cupom" name="cupom" placeholder="Cupom" autocomplete="off" autocapitalize="characters" spellcheck="false">
          <button type="submit">Aplicar</button>
        </form>
        <p class="coupon__msg" data-coupon-msg aria-live="polite"></p>`;

    foot.innerHTML = `
      <div class="bag__row"><span class="mute">Subtotal</span><span>${brl(c.sub)}</span></div>
      ${cupom}
      ${cupomAtivo() ? `<p class="bag__note">Use ${S.cupom.codigo} no pagamento para confirmar o desconto da primeira compra.</p>` : ""}
      <div class="bag__row"><span class="mute">Frete</span><span>${c.gratis ? "Grátis" : `<span class="mute">no pagamento</span>`}</span></div>
      <p class="bag__frete">${freteFrase(c)}</p>
      <div class="bag__row total"><span>${cupomAtivo() ? "Total com cupom" : "Total"}</span><span>${brl(c.produtos)}</span></div>
      ${pode
        ? `<button class="btn btn--full" data-checkout>Finalizar compra <span>→</span></button>
           <p class="bag__note">${prazo}<br><span class="mute">ou ${S.parcelas}x de ${parcela(c.produtos)} sem juros</span></p>`
        : `<button class="btn btn--ghost btn--full" type="button" disabled>${EMBREVE ? "Sungas em breve" : `Sungas abrem em ${J.longa(J.ini)}`}</button>
           <p class="bag__note">${temCam ? `As sungas ainda não estão à venda. Remova as sungas para comprar as camisetas agora.` : "Sua sacola fica guardada até lá."}</p>`}`;
  }

  const openBag = () => { document.body.classList.add("is-bag"); $(".bag").setAttribute("aria-hidden", "false"); $(".bag").inert = false; window.siriguelaLenis?.stop(); };
  const closeBag = () => { document.body.classList.remove("is-bag"); $(".bag").setAttribute("aria-hidden", "true"); $(".bag").inert = true; window.siriguelaLenis?.start(); };

  let toastT;
  function toast(msg) {
    const t = $(".toast");
    t.textContent = msg;
    t.classList.add("is-on");
    clearTimeout(toastT);
    toastT = setTimeout(() => t.classList.remove("is-on"), 3200);
  }

  const copiar = (txt) => {
    try {
      navigator.clipboard.writeText(txt).then(() => toast(`Cupom ${txt} copiado.`), () => toast(`Cupom: ${txt}`));
    } catch { toast(`Cupom: ${txt}`); }
  };

  const parametros = new URLSearchParams(location.search);
  const campanha = Object.fromEntries(["source", "medium", "campaign", "content", "term"]
    .filter(k => parametros.has("utm_" + k)).map(k => [k, parametros.get("utm_" + k)]));
  try {
    if (Object.keys(campanha).length) sessionStorage.setItem("siriguela.campanha", JSON.stringify(campanha));
  } catch {}

  let iniciandoPagamento = false;
  async function finalizar(botao) {
    if (iniciandoPagamento) return;
    iniciandoPagamento = true;
    botao.disabled = true;
    const rotulo = botao.innerHTML;
    botao.textContent = "Abrindo pagamento…";
    let utm = campanha;
    try { utm = JSON.parse(sessionStorage.getItem("siriguela.campanha")) || campanha; } catch {}
    try {
      const resposta = await fetch("/api/checkout", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: bag.get(), utm }), signal: AbortSignal.timeout(16000)
      });
      const dados = await resposta.json();
      if (resposta.ok && dados.url) location.assign(dados.url);
      else toast(dados.erro || "Não foi possível abrir o pagamento. Tente novamente.");
    } catch {
      toast("Não foi possível abrir o pagamento. Sua sacola está salva.");
    } finally {
      iniciandoPagamento = false;
      botao.disabled = false;
      botao.innerHTML = rotulo;
    }
  }

  document.addEventListener("click", (e) => {
    const t = e.target.closest("[data-open-bag],[data-close-bag],[data-q],[data-rm],[data-checkout],[data-cupom-rm],[data-copy]");
    if (!t) return;
    if (t.matches("[data-open-bag]")) { e.preventDefault(); openBag(); }
    else if (t.matches("[data-close-bag]")) closeBag();
    else if (t.matches("[data-q]")) bag.qty(+t.dataset.q, +t.dataset.d);
    else if (t.matches("[data-rm]")) bag.rm(+t.dataset.rm);
    else if (t.matches("[data-cupom-rm]")) { store.set(CUPOM_KEY, null); render(); }
    else if (t.matches("[data-copy]")) copiar(t.dataset.copy);
    else if (t.matches("[data-checkout]")) finalizar(t);
  });
  document.addEventListener("submit", (e) => {
    const f = e.target.closest("[data-coupon]");
    if (!f) return;
    e.preventDefault();
    const code = f.querySelector("input").value.trim().toUpperCase();
    const msg = $("[data-coupon-msg]");
    if (!code) { msg.textContent = "Digite o cupom."; return; }
    if (code !== S.cupom.codigo) { msg.textContent = "Esse cupom não existe. Confira as letras."; return; }
    store.set(CUPOM_KEY, S.cupom.codigo);
    render();
    toast(`${S.cupom.codigo} aplicado. ${S.cupom.regra}`);
  });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeBag(); });
  window.addEventListener("storage", (e) => { if (e.key === KEY || e.key === CUPOM_KEY) render(); });

  /* ---------- Componentes ---------- */
  /* Lookbook: na home cada sunga tem proporção e lugar próprios na grade.
     O card sempre mostra o modelo e gira sozinho entre frente e costas;
     com o mouse em cima, aparece só a sunga no piso, de frente. */
  const LOOK = [
    { r: "34", c: "l1" }, { r: "32", c: "l2" }, { r: "11", c: "l3", q: true }, { r: "34", c: "l4" },
    { r: "32", c: "l5" }, { r: "11", c: "l6", q: true }, { r: "45", c: "l7" }
  ];
  const card = (p, look = { r: "34", c: "" }) => {
    const i = S.produtos.indexOf(p);
    /* card deitado ou quadrado usa a foto horizontal (o recorte só tira fundo das laterais);
       card em pé usa a vertical. Assim rosto e sunga nunca saem do quadro. */
    const v = look.r === "32" || look.r === "11" ? "" : "-v";
    const foto = (f) => `assets/produtos/${p.slug}/${f}${v}.jpg`;
    const tam = look.q ? "(max-width: 600px) 72vw, 30vw" : look.c ? "(max-width: 600px) 100vw, 50vw" : "(max-width: 1000px) 50vw, 25vw";
    /* cards pequenos (q): quadrado de perto, centrado na sunga; frente do "no corpo, de perto", costas recortada */
    const frente = look.q ? `assets/produtos/${p.slug}/recorte-q.jpg` : foto("modelo");
    const costas = look.q ? `assets/produtos/${p.slug}/costas-q.jpg` : foto("costas-modelo");
    return `<a class="card ${look.c} r${look.r}" href="${urlDe(p)}" style="--piso:${p.piso || "var(--soft)"}">
      <div class="card__media">
        <div class="flip" data-flip>
          <img class="flip__f" ${pic(frente, tam)} alt="Sunga ${p.nome} no corpo, de frente" loading="lazy">
          <img class="flip__b" ${pic(costas, tam)} alt="Sunga ${p.nome} no corpo, de costas" loading="lazy">
        </div>
        <div class="card__piso" aria-hidden="true"><img ${pic(look.r === "32" ? img(p, "frente") : `assets/produtos/${p.slug}/piso-v.jpg`, tam)} alt="" loading="lazy"></div>
      </div>
      <div class="card__meta"><span class="idx">${num(i)}</span><span class="card__name">${p.nome}</span><span class="card__price">${brl(S.preco)}</span></div>
      <div class="card__sub"><span>${p.origem}</span><span class="idx">${EMBREVE ? "Em breve" : J.aberta ? `Encomenda até ${J.curta(J.fim)}` : `Abre ${J.curta(J.ini)}`}</span></div>
    </a>`;
  };

  /* Card de camiseta: mesmo lookbook das sungas. Alterna entre dois takes do ensaio;
     com o mouse em cima, aparece a camisa parada (de perto, ou recortada no Jardim). */
  const LOOK_CAM = ["34", "45", "11", "34", "45", "11", "45"];
  const cardCam = (c, k, comLook = true) => {
    const r = comLook ? LOOK_CAM[k % LOOK_CAM.length] : "34";
    const cls = comLook ? `l${(k % 7) + 1}` : "";
    const tam = comLook ? (r === "11" ? "(max-width: 600px) 72vw, 30vw" : "(max-width: 600px) 100vw, 50vw") : "(max-width: 1000px) 50vw, 25vw";
    /* card pequeno (quadrado) usa as fotos mais fechadas na camiseta; "foto:zoom:altura" recorta ampliando */
    const fotos = r === "11" && c.perto ? c.perto : c.takes;
    const img = (spec, cls, alt) => {
      const [f, z, y] = spec.split(":");
      const corte = z ? ` style="transform: scale(${z}); transform-origin: 50% ${y || "40%"}"` : "";
      return `<img class="${cls}" ${camFoto(c, f, tam)} alt="${alt}" loading="lazy"${corte}>`;
    };
    return `<a class="card card--cam ${cls} r${r}" href="${urlCam(c)}" style="--piso:${c.piso}">
      <div class="card__media">
        <div class="flip" data-flip>
          ${img(fotos[0], "flip__f", `Camiseta ${c.nome} no corpo`)}
          ${img(fotos[1], "flip__b", `Camiseta ${c.nome} no corpo, outro ângulo`)}
        </div>
        <div class="card__piso${c.solta ? " card__piso--solta" : ""}" aria-hidden="true"><img ${camFoto(c, c.estatica, tam)} alt="" loading="lazy"></div>
      </div>
      <div class="card__meta"><span class="idx">${num(C.itens.indexOf(c))}</span><span class="card__name">${c.nome}</span><span class="card__price">${brl(C.preco)}</span></div>
      <div class="card__sub"><span>${c.cor}</span><span class="idx">Chega em ${C.entrega.min} a ${C.entrega.max} dias</span></div>
    </a>`;
  };

  /* bloco "Sob encomenda" das camisetas: um texto só, usado na coleção e em cada camiseta */
  const encomendaCam = () => `
    <header class="block__head">
      <h2 class="block__title">Sob encomenda</h2>
      <span class="idx">${prazoCam}</span>
    </header>
    <p class="ed__frase">Feita depois do seu pedido.</p>
    <div class="encomenda-cam__texto">
      <p class="ed__texto">A gente estampa e costura cada camiseta só depois que alguém compra. Assim não sobra estoque parado nem peça encalhada no fim da estação.</p>
      <p class="ed__texto">Por isso a sua leva de ${C.entrega.min} a ${C.entrega.max} dias corridos para chegar em casa. Frete grátis a partir de ${brl(S.freteGratisAPartir)}. ${TROCA_TXT}.</p>
    </div>`;

  /* ---------- Sungas: coleção (/sungas/) ----------
     O mesmo lookbook que ficava na home. Enquanto estão em breve, cada sunga abre a página
     com o aviso por e-mail, e o fim da página recolhe o e-mail de quem quer saber da coleção toda. */
  function sungas() {
    const grid = $("[data-grid]");
    grid.classList.add("look");
    grid.innerHTML = S.produtos.map((p, i) => card(p, LOOK[i % LOOK.length])).join("");
    const aviso = $("[data-aviso-sungas]");
    if (aviso) aviso.innerHTML = avisoForm("aviso-sungas", "sungas");
  }

  /* ---------- Camisetas: coleção (/camisetas/) ---------- */
  function camisetas() {
    const grid = $("[data-grid-cam]");
    grid.classList.add("look");
    grid.innerHTML = C.itens.map((c, k) => cardCam(c, k)).join("");
    $$("[data-encomenda-cam]").forEach((el) => (el.innerHTML = encomendaCam()));
  }

  /* ---------- Camiseta: página de cada uma ----------
     A compra entra na capa (data-compra) e numa barra fixa no pé da tela, que aparece
     quando a compra da capa sai de vista: o botão de comprar fica sempre à mão. */
  function camiseta() {
    const c = camBySlug(document.body.dataset.slug);
    if (!c) return;
    $$("[data-encomenda-cam]").forEach((el) => (el.innerHTML = encomendaCam()));
    /* fim da página: todas as outras camisetas, a partir da próxima da ordem */
    const outras = $("[data-outras-cam]");
    if (outras) {
      const k = C.itens.indexOf(c);
      const lista = C.itens.slice(k + 1).concat(C.itens.slice(0, k));
      outras.innerHTML = `
        <header class="block__head">
          <h2 class="block__title">Outras camisetas</h2>
          <span class="idx">${lista.length} estampas · ${brl(C.preco)}</span>
        </header>
        <div class="grid grid--more">${lista.map((x) => cardCam(x, 0, false)).join("")}</div>`;
    }
    const tamanhos = () => `<div class="picker__opts" role="radiogroup" aria-label="Tamanho">
      ${C.tamanhos.map((t) => `<button class="size" role="radio" aria-checked="false" data-size="${t}" ${c.esgotados?.includes(t) ? "disabled" : ""}>${t}</button>`).join("")}
    </div>`;
    const box = $("[data-compra]");
    box.innerHTML = `
      <div class="info__price"><strong>${brl(C.preco)}</strong><span class="mono mute">ou ${S.parcelas}x de ${parcela(C.preco)} sem juros</span></div>
      <div class="picker" data-picker>
        <div class="picker__head mono"><span>Tamanho</span><span class="mute">Modelagem ampla</span></div>
        ${tamanhos()}
        <p class="picker__msg mono mute" data-msg>Escolha o tamanho.</p>
        <button class="btn btn--full" data-add>Comprar a minha <span>→</span></button>
        <p class="info__perks">Sob encomenda: chega em ${prazoCam}. Na primeira compra, <button class="perk-code" data-copy="${S.cupom.codigo}" title="Copiar cupom">${S.cupom.codigo}</button> dá 10% de desconto.</p>
      </div>`;
    document.body.insertAdjacentHTML("beforeend", `
      <div class="compra-fixa" data-compra-fixa>
        <div class="compra-fixa__nome"><span>${c.nome}</span><span class="mono mute">${brl(C.preco)}</span></div>
        ${tamanhos()}
        <button class="btn" data-add>Comprar <span>→</span></button>
      </div>`);
    document.body.classList.add("com-compra-fixa");

    let size = null;
    const avisa = (txt, erro) => {
      $$("[data-picker], [data-compra-fixa]").forEach((el) => el.classList.toggle("is-err", !!erro));
      const m = $("[data-msg]"); if (m) m.textContent = txt;
    };
    $$("[data-size]").forEach((b) => b.addEventListener("click", () => {
      size = b.dataset.size;
      $$("[data-size]").forEach((x) => x.setAttribute("aria-checked", x.dataset.size === size));
      avisa(`Tamanho ${size}.`);
    }));
    $$("[data-add]").forEach((b) => b.addEventListener("click", () => {
      if (!size) {
        avisa("Escolha um tamanho.", true);
        if (b.closest("[data-compra-fixa]")) toast("Escolha um tamanho.");
        return;
      }
      bag.add(c.slug, size, "camiseta");
      openBag();
    }));
    /* barra fixa só aparece quando a compra da capa não está na tela */
    const fixa = $("[data-compra-fixa]");
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(([e]) => fixa.classList.toggle("is-on", !e.isIntersecting)).observe(box);
    } else fixa.classList.add("is-on");
  }

  /* Troca dos cards: corte seco entre frente e costas, 1,5 s cada, todos no mesmo compasso.
     Pausa com o mouse em cima (mostra a sunga no piso) e fora da tela; com movimento reduzido, fica de frente. */
  function flips() {
    const els = $$("[data-flip]");
    if (!els.length || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const vis = new Set();
    const io = new IntersectionObserver((es) => es.forEach((e) => (e.isIntersecting ? vis.add(e.target) : vis.delete(e.target))), { threshold: 0.25 });
    els.forEach((el) => io.observe(el));
    setInterval(() => {
      if (document.hidden) return;
      els.forEach((el) => { if (vis.has(el) && !el.closest(".card").matches(":hover")) el.classList.toggle("is-back"); });
    }, 1500);
  }

  const sizeTable = () => `
    <table class="table">
      <thead><tr><th>Tamanho</th><th>Cintura</th><th>Quadril</th></tr></thead>
      <tbody>
        <tr><td>P</td><td>70–76 cm</td><td>86–92 cm</td></tr>
        <tr><td>M</td><td>77–83 cm</td><td>93–99 cm</td></tr>
        <tr><td>G</td><td>84–90 cm</td><td>100–106 cm</td></tr>
        <tr><td>GG</td><td>91–98 cm</td><td>107–114 cm</td></tr>
      </tbody>
    </table>`;

  /* aviso por e-mail quando a janela está fechada */
  const avisoForm = (id, produto = "") => `
    <form class="notify" data-notify="${produto}">
      <label class="sr" for="${id}">Seu e-mail</label>
      <input id="${id}" type="email" required placeholder="Seu e-mail" autocomplete="email">
      <button type="submit">Avisar</button>
    </form>
    <p class="notify__ok" data-notify-ok aria-live="polite"></p>`;
  document.addEventListener("submit", async (e) => {
    const f = e.target.closest("[data-notify]");
    if (!f) return;
    e.preventDefault();
    const button = f.querySelector("button");
    if (button.disabled) return;
    const status = f.parentElement.querySelector("[data-notify-ok]");
    button.disabled = true;
    status.textContent = "Anotando seu e-mail…";
    try {
      const response = await fetch("/api/avisos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: f.querySelector("input").value, produto: f.dataset.notify })
      });
      if (!response.ok || (await response.json()).ok !== true) throw new Error();
      status.textContent = EMBREVE ? "E-mail anotado. A gente avisa quando as sungas chegarem." : "E-mail anotado. A gente avisa quando as encomendas abrirem.";
      f.reset();
    } catch {
      status.textContent = "Não conseguimos anotar seu e-mail. Tente novamente em instantes.";
    } finally {
      button.disabled = false;
    }
  });

  /* Título do hero: as letras sobem uma a uma por trás de uma máscara e o ponto entra por último.
     O texto acessível continua inteiro; com movimento reduzido, o título aparece pronto. */
  function letras() {
    const h = $("[data-letras]");
    if (!h || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const texto = h.childNodes[0].textContent;
    let i = 0;
    const spans = [...texto].map((c) => c === " "
      ? `<span class="ch" aria-hidden="true">&nbsp;</span>`
      : `<span class="ch" style="--i:${i++}" aria-hidden="true">${c}</span>`).join("");
    h.innerHTML = `<span class="sr">${texto}.</span><span class="mask" aria-hidden="true">${spans}<span class="ch" style="--i:${i + 2}"><span class="ponto"></span></span></span>`;
    requestAnimationFrame(() => h.classList.add("is-in"));
  }

  /* ---------- Home ---------- */
  function home() {
    letras();
    if (EMBREVE) {
      /* sungas em breve: o topo e o "Como funciona?" falam das camisetas */
      $("[data-safra-nome]").textContent = "Camisetas sob encomenda";
      $("[data-safra-datas]").textContent = brl(C.preco);
      $("[data-janela-status]").textContent = `Camisetas · ${prazoCam}`;
      $("[data-steps]").innerHTML = [
        { t: "Pedido", d: "Qualquer dia", p: "Você escolhe a estampa e o tamanho. A compra das camisetas fica aberta o mês todo." },
        { t: "Produção", d: "Depois do pedido", p: "A gente estampa e costura a sua camiseta. Nenhuma fica pronta esperando dono." },
        { t: "Entrega", d: `Em ${prazoCam}`, p: `Enviamos para todo o Brasil, com frete grátis a partir de ${brl(S.freteGratisAPartir)}.` }
      ].map((s, k) => `
        <li class="step">
          <span class="idx">${num(k)} · ${s.t}</span>
          <b>${s.d}</b>
          <p>${s.p}</p>
        </li>`).join("");
      $("[data-order-cta]").innerHTML = `<a class="btn" href="camisetas/">Ver as camisetas <span>→</span></a>`;
    } else {
      $("[data-safra-nome]").textContent = `Sungas · ${J.safra}${J.aberta ? " · aberta" : ""}`;
      $("[data-safra-datas]").textContent = `${J.curta(J.ini)} – ${J.curta(J.fim)}`;
      $("[data-janela-status]").textContent = `${J.safra} · ${J.quando}`;
      const passos = [
        { t: "Encomenda", d: J.periodo, p: `A safra fica aberta por ${EXTENSO[J.diasJanela] || J.diasJanela} dias. Você escolhe a estampa e o tamanho e garante a sua.` },
        { t: "Produção", d: `a partir de ${J.longa(J.producao)}`, p: "Quando a janela fecha, a gente corta e costura só o que foi encomendado." },
        { t: "Entrega", d: `até ${J.longa(J.entrega)}`, p: `A sunga chega em casa em até ${J.entregaDias} dias úteis depois do fechamento. Frete grátis a partir de ${brl(S.freteGratisAPartir)}.` }
      ];
      $("[data-steps]").innerHTML = passos.map((s, k) => `
        <li class="step${J.aberta && k === 0 ? " is-now" : ""}">
          <span class="idx">${num(k)} · ${s.t}${J.aberta && k === 0 ? " · agora" : ""}</span>
          <b>${s.d}</b>
          <p>${s.p}</p>
        </li>`).join("");
      $("[data-order-cta]").innerHTML = J.aberta
        ? `<a class="btn" href="#colecao">Escolher a minha <span>→</span></a>`
        : `<p class="order__notice">As encomendas abrem em ${J.longa(J.ini)}. Deixe seu e-mail e a gente avisa no dia.</p>${avisoForm("aviso-home")}`;
    }

    /* seções das sungas (grade, índice e medidas) só existem na home quando elas estão à venda */
    if ($("[data-index]")) $("[data-index]").innerHTML = S.produtos.map((p, i) => `
      <li><a href="${urlDe(p)}">
        <span class="idx">${num(i)}</span>
        <span class="index__name">${p.nome}</span>
        <span class="index__from">${p.origem}</span>
        <span class="idx index__coord">${p.coord}</span>
        <span class="index__go" aria-hidden="true">→</span>
        <span class="index__thumb" aria-hidden="true"><img ${pic(img(p, "estampa"), "400px")} alt="" loading="lazy"></span>
      </a></li>`).join("");

    const gridCam = $("[data-grid-cam]");
    if (gridCam) {
      gridCam.classList.add("look");
      gridCam.innerHTML = C.itens.map((c, k) => cardCam(c, k)).join("");
    }

    const grid = $("[data-grid]");
    if (grid) {
      grid.classList.add("look");
      grid.innerHTML = S.produtos.map((p, i) => card(p, LOOK[i % LOOK.length])).join("");
    }
    if ($("[data-sizes]")) $("[data-sizes]").innerHTML = sizeTable();

    $("[data-join]").addEventListener("submit", (e) => {
      e.preventDefault();
      // TODO: ligar a um serviço de e-mail (Mailchimp, Brevo, Klaviyo…)
      $("[data-join-ok]").textContent = "Pronto, você está na lista.";
      e.target.reset();
    });
  }

  /* ---------- Produto ---------- */
  function product() {
    const antigo = new URLSearchParams(location.search).get("s");
    const p = bySlug(document.body.dataset.slug || antigo);
    if (!p) { location.replace("sungas/"); return; }
    /* endereço antigo (produto.html?s=pipa) vai para o novo (/colecao1/sunga/pipa/) */
    if (!document.body.dataset.slug) { location.replace(urlDe(p)); return; }
    const i = S.produtos.indexOf(p);
    document.title = `${p.nome} · Siriguela`;
    $('meta[name="description"]').setAttribute("content", EMBREVE ? `Sunga ${p.nome}. ${p.chamada} Em breve na Siriguela.` : `Sunga ${p.nome}. ${p.chamada} ${brl(S.preco)}, feita sob encomenda, do P ao GG.`);
    $("[data-crumb]").textContent = p.nome;
    /* sunga recortada (só quem tem `recorte: true`): WebP transparente de 640/1080/1448 px */
    const soltaAttrs = (q) => {
      const b = `assets/produtos/${q.slug}/solta`;
      return `src="${b}.w1080.webp" srcset="${b}.w640.webp 640w, ${b}.w1080.webp 1080w, ${b}.w1448.webp 1448w" sizes="(max-width: 700px) 88vw, 58vw"`;
    };

    $("[data-gallery]").innerHTML = `
      <div class="gallery" data-track>${p.fotos.map((f, k) => `
        <figure${(p.vertical || []).includes(f) ? ' class="is-v"' : ""}>
          <span class="gallery__ph"><img ${((a) => (k > 1 ? a.replace(/\b(srcset|src)=/g, "data-$1=") : a))(k === 0 && p.recorte ? soltaAttrs(p) : pic((p.vertical || []).includes(f) ? `assets/produtos/${p.slug}/${f}-v.jpg` : img(p, f), k === 0 ? "100vw" : "(max-width: 700px) 100vw, 50vw"))} alt="Sunga ${p.nome}: ${S.legendas[f].toLowerCase()}" ${k > 1 ? "data-adiada" : 'fetchpriority="high"'}></span>
          <figcaption class="mono">${S.legendas[f]}</figcaption>
        </figure>`).join("")}
      </div>
      <span class="gallery__count mono" data-counter>1 / ${p.fotos.length}</span>`;
    /* da 3ª foto em diante, só baixa quando chega perto da tela: no 4G a primeira foto não divide a banda */
    const adiadas = $$("[data-adiada]");
    const solta = (im) => { im.srcset = im.dataset.srcset; im.src = im.dataset.src; delete im.dataset.adiada; };
    if ("IntersectionObserver" in window) {
      const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { io.unobserve(e.target); solta(e.target); } }), { rootMargin: "400px 0px" });
      adiadas.forEach((im) => io.observe(im));
    } else adiadas.forEach(solta);
    const track = $("[data-track]");
    track.addEventListener("scroll", () => {
      $("[data-counter]").textContent = `${Math.round(track.scrollLeft / track.clientWidth) + 1} / ${p.fotos.length}`;
    }, { passive: true });

    $("[data-info]").innerHTML = `
      <div class="info__top mono"><span class="info__no">N°${num(i)}</span><span class="mute">${p.origem}</span></div>
      <h1>${p.nome}</h1>
      <p class="info__lede">${p.chamada}</p>
      <div class="info__price"><strong>${brl(S.preco)}</strong><span class="mono mute">ou ${S.parcelas}x de ${parcela(S.preco)}</span></div>
      <div class="info__janela${J.aberta ? " is-open" : ""}">
        ${EMBREVE
          ? `<span class="idx">Em breve</span><span>As sungas da Coleção 01 ainda não estão à venda. Deixe seu e-mail e a gente avisa quando chegarem.</span>`
          : `<span class="idx">${J.safra} · ${J.aberta ? "Encomendas abertas" : "Encomendas fechadas"}</span>
        <span>${J.aberta ? `${J.quando}. Feita para você e entregue até ${J.longa(J.entrega)}.` : `Abre em ${J.longa(J.ini)}. Encomendas até ${J.longa(J.fim)}, entrega até ${J.longa(J.entrega)}.`}</span>`}
      </div>
      <div class="picker" data-picker>
        <div class="picker__head mono"><span>Tamanho</span><a href="#medidas-pdp" data-open-sizes>Medidas</a></div>
        <div class="picker__opts" role="radiogroup" aria-label="Tamanho">
          ${S.tamanhos.map((t) => `<button class="size" role="radio" aria-checked="false" data-size="${t}" ${p.esgotados?.includes(t) ? "disabled" : ""}>${t}${p.esgotados?.includes(t) ? " · esgotado" : ""}</button>`).join("")}
        </div>
        ${p.modelo ? `<p class="picker__modelo">O modelo tem ${p.modelo.altura} m e veste ${p.modelo.veste}.</p>` : ""}
        <p class="picker__msg mono mute" data-msg>Corte justo. Na dúvida, vá no maior.</p>
        ${J.aberta
          ? `<button class="btn btn--full" data-add>Encomendar a minha <span>→</span></button>`
          : EMBREVE
            ? `<div class="info__notify">${avisoForm("aviso-pdp", p.slug)}</div>`
            : `<button class="btn btn--full" data-notify-open>Avise-me quando abrir <span>→</span></button><div class="info__notify" data-notify-box hidden>${avisoForm("aviso-pdp", p.slug)}</div>`}
        <p class="info__perks">Frete grátis a partir de ${brl(S.freteGratisAPartir)}. Na primeira compra, <button class="perk-code" data-copy="${S.cupom.codigo}" title="Copiar cupom">${S.cupom.codigo}</button> dá 10% de desconto.</p>
      </div>
      <div class="acc">
        <details open>
          <summary class="mono">A estampa</summary>
          <div class="acc__body">${[].concat(p.texto).map((t) => `<p>${t}</p>`).join("")}<p class="mono mute">${p.origem} · ${p.coord}</p></div>
        </details>
        <details>
          <summary class="mono">Encomenda e entrega</summary>
          <div class="acc__body">
            <p>${EMBREVE ? "Quando as sungas chegarem, cada uma será feita depois do pedido." : `Esta sunga é feita depois do seu pedido. As encomendas ficam abertas do dia ${S.janela.diaInicio} ao dia ${S.janela.diaFim} de cada mês; quando a janela fecha, a produção começa e a entrega chega em até ${J.entregaDias} dias úteis.`}</p>
            <p>A gente só produz o que foi pedido, então não sobra estoque.</p>
            <p>Enviamos para todo o Brasil, com frete grátis a partir de ${brl(S.freteGratisAPartir)}. ${TROCA_TXT} e com etiqueta.</p>
          </div>
        </details>
        <details>
          <summary class="mono">Tecido e corte</summary>
          <div class="acc__body"><p>Corte clássico de sunga, cintura média, com forro interno. Tecido 90% poliéster e 10% elastano, de secagem rápida. Estampa na peça inteira, frente e costas.</p></div>
        </details>
        <details id="medidas-pdp">
          <summary class="mono">Medidas</summary>
          <div class="acc__body">${sizeTable()}</div>
        </details>
        <details>
          <summary class="mono">Cuidados</summary>
          <div class="acc__body"><p>Enxágue em água doce depois do mar ou da piscina. Lave à mão, seque à sombra. Não torça.</p></div>
        </details>
      </div>`;

    let size = null;
    const picker = $("[data-picker]");
    $$("[data-size]").forEach((b) => b.addEventListener("click", () => {
      size = b.dataset.size;
      $$("[data-size]").forEach((x) => x.setAttribute("aria-checked", x === b));
      picker.classList.remove("is-err");
      $("[data-msg]").textContent = `Tamanho ${size}.`;
    }));
    const add = $("[data-add]");
    if (add) add.addEventListener("click", () => {
      if (!size) {
        picker.classList.add("is-err");
        $("[data-msg]").textContent = "Escolha um tamanho.";
        return;
      }
      bag.add(p.slug, size);
      openBag();
    });
    const notifyOpen = $("[data-notify-open]");
    if (notifyOpen) notifyOpen.addEventListener("click", () => {
      const box = $("[data-notify-box]");
      box.hidden = false;
      notifyOpen.hidden = true;
      box.querySelector("input").focus();
    });
    $("[data-open-sizes]").addEventListener("click", (e) => {
      e.preventDefault();
      const d = $("#medidas-pdp");
      d.open = true;
      d.scrollIntoView({ behavior: "smooth", block: "center" });
    });

    $("[data-more]").innerHTML = [1, 2, 3, 4].map((k) => S.produtos[(i + k) % total]).map((q) => card(q)).join("");

    /* "Capa" (celular e computador): a ficha entra logo depois da primeira foto, com o nome
       gigante encostado nela; as outras fotos seguem num mosaico (style.css). */
    const ficha = $("[data-info]");
    $(".gallery figure").after(ficha);
    /* nome gigante: se não couber na largura (Mandacaru no celular), encolhe só o quanto precisa */
    const nome = ficha.querySelector("h1");
    encaixaNome(nome);
    document.fonts.ready.then(() => encaixaNome(nome));
    if (p.recorte) capaRecortada(p, ficha);
    else addEventListener("resize", () => requestAnimationFrame(() => encaixaNome(nome)));
  }

  function encaixaNome(h1) {
    h1.style.fontSize = "";
    const caixa = h1.parentElement, cs = getComputedStyle(caixa);
    const livre = caixa.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
    const r = document.createRange();
    r.selectNodeContents(h1);
    const largura = r.getBoundingClientRect().width;
    if (largura > livre) h1.style.fontSize = `${(parseFloat(getComputedStyle(h1).fontSize) * livre / largura * 0.98).toFixed(1)}px`;
  }

  /* Capa com a sunga recortada (PNG transparente em WebP): a sunga fica solta no linho, desce
     mais devagar que a página (parallax leve, também no toque) e o nome passa ~12% da altura das
     maiúsculas por baixo do ponto mais baixo dela, medido na transparência da imagem. */
  function capaRecortada(p, ficha) {
    const POR_BAIXO = 0.12;
    const fig = $(".gallery figure"), img = fig.querySelector("img");
    document.body.classList.add("com-recorte");
    img.alt = `Sunga ${p.nome}, recortada, de frente`;
    Object.assign(fig.dataset, { scroll: "", scrollSpeed: "-0.1", scrollDelay: "0.09", scrollEnableTouchSpeed: "" });

    let fim = 1; // onde a sunga termina dentro da imagem (fração da altura), olhando o miolo de 30% da largura
    const mede = () => {
      try {
        const c = document.createElement("canvas");
        const w = (c.width = 300), h = (c.height = Math.round(300 * img.naturalHeight / img.naturalWidth));
        const g = c.getContext("2d");
        g.drawImage(img, 0, 0, w, h);
        const px = g.getImageData(0, 0, w, h).data;
        for (let y = h - 1; y >= 0; y--) {
          for (let x = Math.round(w * .35); x < w * .65; x++) if (px[(y * w + x) * 4 + 3] > 40) { fim = (y + 1) / h; return; }
        }
      } catch { fim = 0.97; }
    };
    const posiciona = () => {
      const h1 = ficha.querySelector("h1");
      encaixaNome(h1);
      ficha.style.top = ficha.style.marginBottom = "";
      ficha.style.top = "0px";
      const cs = getComputedStyle(h1);
      const c = document.createElement("canvas").getContext("2d");
      c.font = `${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
      const m = c.measureText(h1.textContent);
      const cap = c.measureText("H").actualBoundingBoxAscent;
      const r = h1.getBoundingClientRect();
      const base = r.top + (parseFloat(cs.lineHeight) - (m.fontBoundingBoxAscent + m.fontBoundingBoxDescent)) / 2 + m.fontBoundingBoxAscent;
      const ir = img.getBoundingClientRect();
      const desvio = parseFloat((fig.style.translate || "0 0").split(" ")[1]) || 0; // o parallax não entra na conta
      const d = ir.top - desvio + ir.height * fim - cap * POR_BAIXO - (base - cap);
      ficha.style.top = `${d}px`;
      ficha.style.marginBottom = `${40 + d}px`;
    };
    const pronto = () => { mede(); posiciona(); };
    document.fonts.ready.then(() => (img.complete && img.naturalWidth ? pronto() : img.addEventListener("load", pronto, { once: true })));
    addEventListener("resize", () => requestAnimationFrame(posiciona));
  }

  /* hero: faixa de vídeos. Duplica o conjunto (o CSS anda -50%, então o laço não pula),
     toca os vídeos visíveis em loop e pausa o que sai da tela. */
  function reel() {
    const track = document.querySelector("[data-reel-track]");
    if (!track) return;
    const set = track.querySelector(".reel__set");
    const clone = set.cloneNode(true);
    clone.setAttribute("aria-hidden", "true");
    clone.querySelectorAll("a").forEach((a) => a.setAttribute("tabindex", "-1"));
    track.appendChild(clone);
    const vids = [...track.querySelectorAll("video")];
    const visiveis = new Set();
    const carregando = new WeakSet();

    // WebKit também aceita MP4 como imagem animada. Só troca o elemento
    // quando a imagem carregar, para manter o pôster nos demais navegadores.
    function usaAnimacao(v) {
      if (carregando.has(v) || !v.isConnected) return;
      carregando.add(v);
      const imagem = new Image();
      imagem.className = "reel__loop";
      imagem.alt = v.getAttribute("aria-label") || "";
      imagem.onload = () => {
        io.unobserve(v);
        visiveis.delete(v);
        v.pause();
        v.replaceWith(imagem);
      };
      imagem.src = v.querySelector("source").src;
    }

    function ajusta(v) {
      if (!visiveis.has(v) || document.hidden) {
        v.pause();
        return;
      }
      v.play().catch(erro => {
        if (erro.name === "NotAllowedError") usaAnimacao(v);
      });
    }

    const io = new IntersectionObserver(entradas => {
      for (const e of entradas) {
        if (e.isIntersecting) visiveis.add(e.target);
        else visiveis.delete(e.target);
        ajusta(e.target);
      }
    });
    for (const v of vids) {
      v.defaultMuted = true;
      v.muted = true;
      v.playsInline = true;
      io.observe(v);
    }
    document.addEventListener("visibilitychange", () => visiveis.forEach(ajusta));
  }

  chromeTop();
  const init = () => {
    reel();
    chrome();
    if (document.body.dataset.page === "home") home();
    if (document.body.dataset.page === "produto") product();
    if (document.body.dataset.page === "camisetas") camisetas();
    if (document.body.dataset.page === "sungas") sungas();
    if (document.body.dataset.page === "camiseta") camiseta();
    render();
    flips();
    movimento();
  };

  /* Lenis + GSAP só entram depois que a página carregou: a primeira pintura não espera
     ~100 KB de animação (e quem pede movimento reduzido nem baixa) */
  function movimento() {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const carrega = () => ["assets/vendor/lenis.min.js", "assets/vendor/gsap.min.js", "assets/vendor/ScrollTrigger.min.js", "assets/js/movimento.js", "assets/js/locomotiva.js"]
      .forEach((src) => { const s = document.createElement("script"); s.src = src; s.async = false; document.body.appendChild(s); });
    // espera a página carregar e dois quadros já desenhados
    const depois = () => requestAnimationFrame(() => requestAnimationFrame(() => setTimeout(carrega, 120)));
    if (document.readyState === "complete") depois();
    else addEventListener("load", depois, { once: true });
  }
  /* a página chama siriguelaInit() logo depois do </main>, antes dos scripts de animação
     (que vêm de CDN com defer); assim a galeria não espera por eles */
  let foi = false;
  window.siriguelaInit = () => { if (!foi) { foi = true; init(); } };
  if (document.readyState !== "loading") window.siriguelaInit();
  else document.addEventListener("DOMContentLoaded", window.siriguelaInit);
})();
