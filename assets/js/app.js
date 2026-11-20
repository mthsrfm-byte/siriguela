/* SIRIGUELA — loja estática (sem build). */
(function () {
  "use strict";

  const S = window.SIRIGUELA;
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const brl = (v) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  const img = (p, f) => `assets/produtos/${p.slug}/${f}.${(p.jpg || []).includes(f) ? "jpg" : "webp"}`;
  const num = (i) => String(i + 1).padStart(2, "0");
  const total = S.produtos.length;
  const bySlug = (slug) => S.produtos.find((p) => p.slug === slug);
  /* endereço da página de cada sunga: /colecao1/sunga/<slug>/ (gerado por scripts/gerar-paginas.py) */
  const urlDe = (p) => `colecao1/sunga/${p.slug}/`;
  const parcela = (v) => brl(Math.floor((v / S.parcelas) * 100) / 100);
  const store = {
    get(k, d) { try { const v = localStorage.getItem(k); return v === null ? d : JSON.parse(v); } catch { return d; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} }
  };

  /* Logo oficial em curvas. O nome usa currentColor para o menu poder inverter
     sobre as fotos; o ponto mora numa camada separada (.head-dot) e fica sempre vermelho. */
  const LOGO_PATH = "M257 10Q157 10 98.0 -34.0Q39 -78 31 -158H127Q134 -114 167.5 -90.5Q201 -67 259 -67Q310 -67 337.0 -85.0Q364 -103 364 -136Q364 -160 348.5 -176.5Q333 -193 288 -204L206 -223Q129 -242 91.5 -279.5Q54 -317 54 -372Q54 -441 105.5 -480.5Q157 -520 247 -520Q336 -520 390.5 -480.0Q445 -440 452 -368H356Q350 -404 321.5 -423.5Q293 -443 244 -443Q198 -443 173.5 -426.5Q149 -410 149 -381Q149 -357 167.5 -341.0Q186 -325 229 -314L313 -293Q386 -275 423.0 -234.5Q460 -194 460 -137Q460 -68 406.5 -29.0Q353 10 257 10ZM526.0 0V-510H630.0V0ZM521.0 -610V-727H636.0V-610ZM741.0 0V-510H840.0V-383H845.0V0ZM845.0 -266 832.0 -387Q850.0 -452 894.0 -486.0Q938.0 -520 999.0 -520Q1022.0 -520 1031.0 -516V-418Q1026.0 -420 1017.0 -420.5Q1008.0 -421 995.0 -421Q920.0 -421 882.5 -382.0Q845.0 -343 845.0 -266ZM1080.0 0V-510H1184.0V0ZM1075.0 -610V-727H1190.0V-610ZM1506.0 215Q1410.0 215 1347.5 171.5Q1285.0 128 1272.0 56H1370.0Q1380.0 89 1414.5 108.0Q1449.0 127 1507.0 127Q1582.0 127 1619.0 90.0Q1656.0 53 1656.0 -20V-130L1665.0 -128Q1650.0 -70 1600.0 -36.5Q1550.0 -3 1480.0 -3Q1413.0 -3 1362.0 -35.0Q1311.0 -67 1283.0 -124.5Q1255.0 -182 1255.0 -259Q1255.0 -337 1284.0 -396.0Q1313.0 -455 1365.5 -487.0Q1418.0 -519 1488.0 -519Q1560.0 -519 1607.5 -484.5Q1655.0 -450 1668.0 -387L1660.0 -386V-510H1759.0V-21Q1759.0 89 1691.5 152.0Q1624.0 215 1506.0 215ZM1511.0 -87Q1578.0 -87 1618.5 -134.0Q1659.0 -181 1659.0 -263Q1659.0 -343 1618.5 -389.0Q1578.0 -435 1510.0 -435Q1442.0 -435 1402.0 -388.5Q1362.0 -342 1362.0 -260Q1362.0 -180 1402.5 -133.5Q1443.0 -87 1511.0 -87ZM2036.0 10Q1985.0 10 1946.0 -11.5Q1907.0 -33 1885.5 -71.0Q1864.0 -109 1864.0 -158V-510H1968.0V-182Q1968.0 -129 1994.0 -103.0Q2020.0 -77 2068.0 -77Q2111.0 -77 2144.5 -97.0Q2178.0 -117 2197.5 -152.5Q2217.0 -188 2217.0 -235L2230.0 -113Q2205.0 -57 2153.5 -23.5Q2102.0 10 2036.0 10ZM2221.0 0V-120H2217.0V-510H2320.0V0ZM2649.0 10Q2572.0 10 2513.5 -24.0Q2455.0 -58 2422.0 -118.0Q2389.0 -178 2389.0 -256Q2389.0 -335 2421.5 -394.5Q2454.0 -454 2513.0 -487.0Q2572.0 -520 2648.0 -520Q2722.0 -520 2776.5 -488.5Q2831.0 -457 2860.5 -401.0Q2890.0 -345 2890.0 -268Q2890.0 -256 2889.5 -245.5Q2889.0 -235 2887.0 -224H2459.0V-302H2814.0L2788.0 -271Q2788.0 -353 2751.0 -396.0Q2714.0 -439 2648.0 -439Q2577.0 -439 2535.5 -390.5Q2494.0 -342 2494.0 -256Q2494.0 -169 2535.5 -120.0Q2577.0 -71 2651.0 -71Q2696.0 -71 2729.0 -89.5Q2762.0 -108 2778.0 -144H2876.0Q2851.0 -72 2791.5 -31.0Q2732.0 10 2649.0 10ZM2961.0 0V-720H3065.0V0ZM3492.0 0Q3487.0 -19 3485.5 -42.0Q3484.0 -65 3484.0 -98H3479.0V-341Q3479.0 -390 3454.5 -414.5Q3430.0 -439 3377.0 -439Q3326.0 -439 3295.5 -419.0Q3265.0 -399 3260.0 -362H3161.0Q3168.0 -434 3226.0 -477.0Q3284.0 -520 3381.0 -520Q3481.0 -520 3531.0 -473.5Q3581.0 -427 3581.0 -337V-98Q3581.0 -75 3584.0 -51.0Q3587.0 -27 3593.0 0ZM3316.0 10Q3238.0 10 3192.0 -28.5Q3146.0 -67 3146.0 -133Q3146.0 -201 3194.5 -240.5Q3243.0 -280 3334.0 -294L3502.0 -321V-248L3350.0 -224Q3299.0 -216 3273.5 -197.0Q3248.0 -178 3248.0 -142Q3248.0 -107 3271.5 -89.5Q3295.0 -72 3340.0 -72Q3400.0 -72 3439.5 -101.0Q3479.0 -130 3479.0 -174L3492.0 -100Q3474.0 -47 3428.0 -18.5Q3382.0 10 3316.0 10Z";
  const logo = () => `<svg class="logo__svg" viewBox="-29 -787 3922 1062" role="img" aria-label="Siriguela"><path fill="currentColor" d="${LOGO_PATH}"/><ellipse class="logo__dot" cx="3748" cy="-110" rx="85" ry="110" transform="rotate(-12 3748 -110)"/></svg>`;

  /* ---------- Janela de encomenda ----------
     Cada mês é uma safra: encomendas do dia 1 ao 10, produção depois que a
     janela fecha, entrega em até N dias. Tudo que o site diz sobre prazo sai daqui. */
  const MESES = ["janeiro", "fevereiro", "março", "abril", "maio", "junho", "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"];
  const DIA = 86400000;
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
    let now = new Date();
    let w = calc(now);
    if (sim === "aberta" && !w.aberta) { now = new Date(w.ini.getTime() + 3.5 * DIA); w = calc(now); }
    if (sim === "fechada" && w.aberta) { now = new Date(w.fim.getTime() + DIA); w = calc(now); }
    const producao = new Date(w.fim.getTime() + 1000);
    const entrega = new Date(w.fim.getTime() + cfg.entregaDias * DIA);
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
    return { ...w, producao, entrega, longa, curta, safra, periodo, quando, entregaDias: cfg.entregaDias };
  })();

  /* ---------- Cupom e frete ---------- */
  const CUPOM_KEY = "siriguela.cupom";
  const cupomAtivo = () => store.get(CUPOM_KEY, null) === S.cupom.codigo;
  const contas = (count) => {
    const sub = S.preco * count;
    const desc = cupomAtivo() ? Math.round(sub * S.cupom.desconto * 100) / 100 : 0;
    const produtos = sub - desc;
    const gratis = produtos >= S.freteGratisAPartir;
    return { sub, desc, produtos, gratis, falta: Math.max(0, S.freteGratisAPartir - produtos) };
  };

  /* ---------- Cabeçalho, rodapé e sacola (comuns às páginas) ---------- */
  function chrome() {
    document.body.insertAdjacentHTML("afterbegin", `
      <div class="janela-bar">
        <a href="index.html#encomenda" class="janela-bar__main">
          <span>Safra ${MESES[J.ini.getMonth()].slice(0, 3).replace(/^./, (c) => c.toUpperCase())}/${J.ini.getFullYear()}</span>
          <span class="janela-bar__sep" aria-hidden="true">·</span>
          <span>Encomendas até ${J.curta(J.fim)}</span>
        </a>
        <span class="janela-bar__aside">10% na primeira compra com ${S.cupom.codigo}</span>
      </div>
      <header class="head">
        <a class="logo" href="index.html" aria-label="Siriguela, página inicial">${logo()}</a>
        <nav class="head__nav" aria-label="Principal">
          <a href="index.html#colecao">Coleção</a>
          <a href="index.html#encomenda">Encomenda</a>
          <a href="index.html#indice">Índice</a>
          <a href="index.html#sobre">Sobre</a>
        </nav>
        <div class="head__right">
          <button class="head__menu" aria-expanded="false" data-menu>Menu</button>
          <button class="head__bag" data-open-bag aria-label="Abrir sacola">Sacola <b data-count>(0)</b></button>
        </div>
      </header>
      <div class="head-dot" aria-hidden="true"><span class="logo">${logo()}</span></div>`);

    document.body.insertAdjacentHTML("beforeend", `
      <footer>
        <div class="foot">
          <div>
            <h3 class="foot__logo"><img src="assets/img/logo-mono.svg" alt="Siriguela" width="104" height="28"></h3>
            <p>Sungas estampadas, feitas sob encomenda a partir de pedaços do Brasil.</p>
          </div>
          <div>
            <h3 class="mono">Loja</h3>
            <a href="index.html#colecao">Coleção</a>
            <a href="index.html#medidas">Medidas</a>
            <a href="#" data-open-bag>Sacola</a>
          </div>
          <div>
            <h3 class="mono">Ajuda</h3>
            <a href="index.html#encomenda">Como funciona a encomenda</a>
            <a href="#">Trocas</a>
            <a href="#">Contato</a>
          </div>
          <div>
            <h3 class="mono">Siga</h3>
            <a href="#">Instagram</a>
            <a href="#">TikTok</a>
          </div>
        </div>
        <div class="foot__base mono mute">
          <span>© ${new Date().getFullYear()} Siriguela · ${J.safra}</span>
          <span>Feito sob encomenda no Brasil</span>
        </div>
      </footer>
      <div class="scrim" data-close-bag></div>
      <aside class="bag" aria-label="Sacola" aria-hidden="true" data-lenis-prevent>
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
    add(slug, size) {
      const items = bag.get();
      const hit = items.find((i) => i.slug === slug && i.size === size);
      hit ? hit.qty++ : items.push({ slug, size, qty: 1 });
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
    const umaMais = c.produtos + S.preco * (1 - (cupomAtivo() ? S.cupom.desconto : 0));
    return umaMais >= S.freteGratisAPartir
      ? "Com mais uma sunga, o frete fica grátis."
      : `Faltam ${brl(c.falta)} para o frete grátis.`;
  };

  function render() {
    const items = bag.get().filter((i) => bySlug(i.slug));
    const count = items.reduce((n, i) => n + i.qty, 0);
    $$("[data-count]").forEach((b) => { b.textContent = `(${count})`; b.classList.toggle("has", !!count); });

    const list = $("[data-bag-list]");
    const foot = $("[data-bag-foot]");
    if (!items.length) {
      list.innerHTML = `<div class="bag__empty">
        <p>Sua sacola está vazia.</p>
        <p class="bag__hint">${J.safra}: ${J.aberta ? `encomendas abertas até ${J.longa(J.fim)}` : `encomendas de ${J.periodo}`}. Na primeira compra, ${S.cupom.codigo} dá 10% de desconto.</p>
        <a class="btn btn--ghost btn--full" href="index.html#colecao" data-close-bag>Ver coleção <span>→</span></a></div>`;
      foot.innerHTML = "";
      return;
    }
    list.innerHTML = `<p class="bag__safra idx">Encomenda · ${J.safra}</p>` + items.map((i, idx) => {
      const p = bySlug(i.slug);
      return `<div class="line">
        <a href="${urlDe(p)}"><img src="${img(p, "frente")}" alt="Sunga ${p.nome}"></a>
        <div>
          <div class="line__name">${p.nome}</div>
          <div class="mono mute">Tam. ${i.size} · feita sob encomenda</div>
          <div class="qty">
            <button aria-label="Diminuir" data-q="${idx}" data-d="-1">−</button>
            <span>${i.qty}</span>
            <button aria-label="Aumentar" data-q="${idx}" data-d="1">+</button>
          </div>
        </div>
        <div class="line__right">
          <span>${brl(S.preco * i.qty)}</span>
          <button class="line__rm mono" data-rm="${idx}">Remover</button>
        </div>
      </div>`;
    }).join("");

    const c = contas(count);
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
      <div class="bag__row"><span class="mute">Frete</span><span>${c.gratis ? "Grátis" : `<span class="mute">no pagamento</span>`}</span></div>
      <p class="bag__frete">${freteFrase(c)}</p>
      <div class="bag__row total"><span>Total</span><span>${brl(c.produtos)}</span></div>
      ${J.aberta
        ? `<button class="btn btn--full" data-checkout>Finalizar encomenda <span>→</span></button>
           <p class="bag__note">Produção a partir de ${J.longa(J.producao)}. Chega até ${J.longa(J.entrega)}.<br><span class="mute">ou ${S.parcelas}x de ${parcela(c.produtos)} sem juros</span></p>`
        : `<button class="btn btn--ghost btn--full" type="button" disabled>Encomendas abrem em ${J.longa(J.ini)}</button>
           <p class="bag__note">Sua sacola fica guardada até lá.</p>`}`;
  }

  const openBag = () => { document.body.classList.add("is-bag"); $(".bag").setAttribute("aria-hidden", "false"); window.siriguelaLenis?.stop(); };
  const closeBag = () => { document.body.classList.remove("is-bag"); $(".bag").setAttribute("aria-hidden", "true"); window.siriguelaLenis?.start(); };

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

  document.addEventListener("click", (e) => {
    const t = e.target.closest("[data-open-bag],[data-close-bag],[data-q],[data-rm],[data-checkout],[data-cupom-rm],[data-copy]");
    if (!t) return;
    if (t.matches("[data-open-bag]")) { e.preventDefault(); openBag(); }
    else if (t.matches("[data-close-bag]")) closeBag();
    else if (t.matches("[data-q]")) bag.qty(+t.dataset.q, +t.dataset.d);
    else if (t.matches("[data-rm]")) bag.rm(+t.dataset.rm);
    else if (t.matches("[data-cupom-rm]")) { store.set(CUPOM_KEY, null); render(); }
    else if (t.matches("[data-copy]")) copiar(t.dataset.copy);
    else if (t.matches("[data-checkout]")) toast("Pagamento ainda não conectado.");
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
    const pic = (f) => `assets/produtos/${p.slug}/${f}${v}.jpg`;
    /* cards pequenos (q): quadrado de perto, centrado na sunga; frente do "no corpo, de perto", costas recortada */
    const frente = look.q ? `assets/produtos/${p.slug}/recorte-q.jpg` : pic("modelo");
    const costas = look.q ? `assets/produtos/${p.slug}/costas-q.jpg` : pic("costas-modelo");
    return `<a class="card ${look.c} r${look.r}" href="${urlDe(p)}" style="--piso:${p.piso || "var(--soft)"}">
      <div class="card__media">
        <div class="flip" data-flip>
          <img class="flip__f" src="${frente}" alt="Sunga ${p.nome} no corpo, de frente" loading="lazy">
          <img class="flip__b" src="${costas}" alt="Sunga ${p.nome} no corpo, de costas" loading="lazy">
        </div>
        <div class="card__piso" aria-hidden="true"><img src="${img(p, "frente")}" alt="" loading="lazy"></div>
      </div>
      <div class="card__meta"><span class="idx">${num(i)}</span><span class="card__name">${p.nome}</span><span class="card__price">${brl(S.preco)}</span></div>
      <div class="card__sub"><span>${p.origem}</span><span class="idx">${J.aberta ? `Encomenda até ${J.curta(J.fim)}` : `Abre ${J.curta(J.ini)}`}</span></div>
    </a>`;
  };

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

  /* aviso por e-mail quando a janela está fechada (ainda não conectado a um serviço) */
  const avisoForm = (id) => `
    <form class="notify" data-notify>
      <label class="sr" for="${id}">Seu e-mail</label>
      <input id="${id}" type="email" required placeholder="Seu e-mail" autocomplete="email">
      <button type="submit">Avisar</button>
    </form>
    <p class="notify__ok" data-notify-ok aria-live="polite"></p>`;
  document.addEventListener("submit", (e) => {
    const f = e.target.closest("[data-notify]");
    if (!f) return;
    e.preventDefault();
    // TODO: ligar a um serviço de e-mail (Mailchimp, Brevo, Klaviyo…)
    f.parentElement.querySelector("[data-notify-ok]").textContent = `Pronto. A gente avisa em ${J.longa(J.ini)}, quando a ${J.safra.toLowerCase()} abrir.`;
    f.reset();
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
    $("[data-safra-nome]").textContent = J.aberta ? `${J.safra} · aberta` : J.safra;
    $("[data-safra-datas]").textContent = `${J.curta(J.ini)} – ${J.curta(J.fim)}`;
    letras();

    $("[data-janela-status]").textContent = `${J.safra} · ${J.quando}`;
    const passos = [
      { t: "Encomenda", d: J.periodo, p: "A safra fica aberta por dez dias. Você escolhe a estampa e o tamanho e garante a sua." },
      { t: "Produção", d: `a partir de ${J.longa(J.producao)}`, p: "Quando a janela fecha, a gente corta e costura só o que foi encomendado. Cada peça tem dono antes de existir." },
      { t: "Entrega", d: `até ${J.longa(J.entrega)}`, p: `A sunga chega em casa em até ${J.entregaDias} dias depois do fechamento. Frete grátis a partir de ${brl(S.freteGratisAPartir)}.` }
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

    $("[data-index]").innerHTML = S.produtos.map((p, i) => `
      <li><a href="${urlDe(p)}">
        <span class="idx">${num(i)}</span>
        <span class="index__name">${p.nome}</span>
        <span class="index__from">${p.origem}</span>
        <span class="idx index__coord">${p.coord}</span>
        <span class="index__go" aria-hidden="true">→</span>
        <span class="index__thumb" aria-hidden="true"><img src="${img(p, "estampa")}" alt="" loading="lazy"></span>
      </a></li>`).join("");

    const grid = $("[data-grid]");
    grid.classList.add("look");
    grid.innerHTML = S.produtos.map((p, i) => card(p, LOOK[i % LOOK.length])).join("");
    $("[data-sizes]").innerHTML = sizeTable();

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
    if (!p) { location.replace("index.html#colecao"); return; }
    /* endereço antigo (produto.html?s=pipa) vai para o novo (/colecao1/sunga/pipa/) */
    if (!document.body.dataset.slug) { location.replace(urlDe(p)); return; }
    const i = S.produtos.indexOf(p);
    document.title = `${p.nome} · Siriguela`;
    $('meta[name="description"]').setAttribute("content", `Sunga ${p.nome}. ${p.chamada} ${brl(S.preco)}, feita sob encomenda, do P ao GG.`);
    $("[data-crumb]").textContent = p.nome;

    $("[data-gallery]").innerHTML = `
      <div class="gallery" data-track>${p.fotos.map((f, k) => `
        <figure${(p.vertical || []).includes(f) ? ' class="is-v"' : ""}>
          <span class="gallery__ph"><img src="${(p.vertical || []).includes(f) ? `assets/produtos/${p.slug}/${f}-v.jpg` : img(p, f)}" alt="Sunga ${p.nome}: ${S.legendas[f].toLowerCase()}" ${k > 1 ? 'loading="lazy"' : ""}></span>
          <figcaption class="mono">${S.legendas[f]}</figcaption>
        </figure>`).join("")}
      </div>
      <span class="gallery__count mono" data-counter>1 / ${p.fotos.length}</span>`;
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
        <span class="idx">${J.safra} · ${J.aberta ? "Encomendas abertas" : "Encomendas fechadas"}</span>
        <span>${J.aberta ? `${J.quando}. Feita para você e entregue até ${J.longa(J.entrega)}.` : `Abre em ${J.longa(J.ini)}. Encomendas até ${J.longa(J.fim)}, entrega até ${J.longa(J.entrega)}.`}</span>
      </div>
      <div class="picker" data-picker>
        <div class="picker__head mono"><span>Tamanho</span><a href="#medidas-pdp" data-open-sizes>Medidas</a></div>
        <div class="picker__opts" role="radiogroup" aria-label="Tamanho">
          ${S.tamanhos.map((t) => `<button class="size" role="radio" aria-checked="false" data-size="${t}">${t}</button>`).join("")}
        </div>
        <p class="picker__msg mono mute" data-msg>Corte justo. Na dúvida, vá no maior.</p>
        ${J.aberta
          ? `<button class="btn btn--full" data-add>Encomendar a minha <span>→</span></button>`
          : `<button class="btn btn--full" data-notify-open>Avise-me quando abrir <span>→</span></button><div class="info__notify" data-notify-box hidden>${avisoForm("aviso-pdp")}</div>`}
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
            <p>Esta sunga é feita depois do seu pedido. As encomendas ficam abertas do dia ${S.janela.diaInicio} ao dia ${S.janela.diaFim} de cada mês; quando a janela fecha, a produção começa e a entrega chega em até ${J.entregaDias} dias.</p>
            <p>Nada de estoque parado nem de sobra de coleção: só existe a peça que alguém encomendou.</p>
            <p>Enviamos para todo o Brasil, com frete grátis a partir de ${brl(S.freteGratisAPartir)}. Troca em até 30 dias, com a peça sem uso e com etiqueta.</p>
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
  }

  /* hero: faixa de vídeos. Duplica o conjunto (o CSS anda -50%, então o laço não pula),
     pausa tudo fora da tela e, com movimento reduzido, deixa os vídeos parados no pôster. */
  function reel() {
    const track = document.querySelector("[data-reel-track]");
    if (!track) return;
    const set = track.querySelector(".reel__set");
    const clone = set.cloneNode(true);
    clone.setAttribute("aria-hidden", "true");
    clone.querySelectorAll("a").forEach((a) => a.setAttribute("tabindex", "-1"));
    track.appendChild(clone);
    const vids = [...track.querySelectorAll("video")];
    const calmo = matchMedia("(prefers-reduced-motion: reduce)");
    const tocar = (on) => vids.forEach((v) => {
      v.muted = true;
      if (on && !calmo.matches) { const p = v.play(); if (p) p.catch(() => {}); } else v.pause();
    });
    new IntersectionObserver(([e]) => tocar(e.isIntersecting)).observe(track);
    calmo.addEventListener("change", () => tocar(!calmo.matches));
    if (calmo.matches) vids.forEach((v) => { v.removeAttribute("autoplay"); v.pause(); });
  }

  reel();
  chrome();
  if (document.body.dataset.page === "home") home();
  if (document.body.dataset.page === "produto") product();
  render();
  flips();
})();
