/* SIRIGUELA — "locomotiva": a API de atributos do Locomotive Scroll v5, em ~150 linhas,
   rodando em cima do Lenis que o movimento.js já liga (sem baixar outra biblioteca).

   Atributos (mesmos nomes do Locomotive):
     data-scroll                    liga a detecção; ganha .is-inview ao entrar na tela
     data-scroll-class="x"          troca o nome da classe
     data-scroll-repeat             tira a classe ao sair (e põe de novo ao voltar)
     data-scroll-speed="0.1"        parallax; negativo inverte. Desligado em tela de toque
     data-scroll-delay="0.1"        o parallax chega atrasado, com inércia própria (0 a 1)
     data-scroll-css-progress       escreve --progress (0 → 1) enquanto o elemento cruza a tela
     data-scroll-grow="3"           (extra) cresce de 1 até 1+N enquanto a primeira dobra sai da tela
     data-scroll-position="end"     o --progress chega a 1 quando o pé do elemento encosta no pé da tela
     data-scroll-call="nome"        dispara window "nome" quando o elemento cruza o meio da tela
   O parallax usa a propriedade `translate`, então não briga com `transform` de outras animações.
   Elementos que já começam na primeira dobra só se mexem a partir do topo (ignore-fold). */
(function () {
  "use strict";
  const lenis = window.siriguelaLenis;
  if (!lenis) return;
  const raiz = document.documentElement;
  raiz.classList.add("has-loco");
  const toque = matchMedia("(pointer: coarse)").matches;
  const els = [];
  let vh = innerHeight;

  const ioClasse = new IntersectionObserver((entradas) => entradas.forEach((e) => {
    const o = e.target.__loco;
    if (e.isIntersecting) {
      e.target.classList.add(o.cls);
      if (!o.repeat) ioClasse.unobserve(e.target);
    } else if (o.repeat) e.target.classList.remove(o.cls);
  }), { rootMargin: "0px 0px -8% 0px" });

  /* "data-scroll-position: middle": o evento sai quando o elemento cruza a linha do meio */
  const ioMeio = new IntersectionObserver((entradas) => entradas.forEach((e) => {
    const o = e.target.__loco;
    if (!e.isIntersecting && !o.meio) return; // só avisa a saída de quem chegou a entrar
    o.meio = e.isIntersecting;
    const de = e.boundingClientRect.top < vh / 2 ? "start" : "end";
    dispatchEvent(new CustomEvent(o.call, { detail: { target: e.target, way: e.isIntersecting ? "enter" : "leave", from: de } }));
  }), { rootMargin: "-50% 0px -50% 0px" });

  function mede(o) {
    const r = o.el.getBoundingClientRect();
    o.top = r.top + scrollY - o.cur;
    o.h = r.height;
  }

  function add(el) {
    if (el.__loco) return;
    const d = el.dataset;
    const o = {
      el, cur: 0, p: -1,
      cls: d.scrollClass || "is-inview",
      repeat: "scrollRepeat" in d,
      speed: toque && !("scrollEnableTouchSpeed" in d) ? 0 : parseFloat(d.scrollSpeed) || 0,
      delay: parseFloat(d.scrollDelay) || 0,
      css: "scrollCssProgress" in d,
      fim: d.scrollPosition === "end",
      cresce: parseFloat(d.scrollGrow) || 0,
      call: d.scrollCall
    };
    el.__loco = o;
    mede(o);
    o.dobra = o.top < vh;
    els.push(o);
    ioClasse.observe(el);
    if (o.call) ioMeio.observe(el);
  }

  const scan = (raizBusca = document) => raizBusca.querySelectorAll("[data-scroll]").forEach(add);

  function quadro() {
    const y = lenis.animatedScroll;
    for (const o of els) {
      /* pulou por cima (link, recarregar no meio da página): o que ficou para trás também conta como visto */
      if (!o.repeat && !o.visto && o.top < y) { o.visto = true; o.el.classList.add(o.cls); ioClasse.unobserve(o.el); }
      if (o.css || o.speed || o.cresce) {
        const p = Math.min(1, Math.max(0, (y + vh - o.top) / (o.fim ? o.h : vh + o.h)));
        if (o.css && Math.abs(p - o.p) > 0.0005) { o.p = p; o.el.style.setProperty("--progress", p.toFixed(4)); }
        if (o.speed) {
          const alvo = o.dobra ? -y * o.speed : (0.5 - p) * (vh + o.h) * o.speed;
          o.cur = o.delay ? o.cur + (alvo - o.cur) * o.delay : alvo;
          o.el.style.translate = `0 ${o.cur.toFixed(2)}px`;
        }
        if (o.cresce) o.el.style.scale = (1 + Math.min(1, y / vh) * o.cresce).toFixed(3);
      }
    }
    velocidade();
  }

  /* ---------- Velocidade: a faixa de vídeos acelera com a rolagem e volta quando a rolagem sobe ---------- */
  const faixa = document.querySelector("[data-reel-track]");
  let anim = null, ritmo = 1;
  function velocidade() {
    if (!faixa) return;
    anim = anim || faixa.getAnimations()[0];
    if (!anim) return;
    const v = lenis.velocity || 0;
    const alvo = Math.max(-6, Math.min(8, 1 + v * 0.35));
    ritmo += (alvo - ritmo) * 0.08;
    if (Math.abs(anim.playbackRate - ritmo) > 0.01) anim.playbackRate = ritmo;
  }

  function remede() {
    vh = innerHeight;
    els.forEach(mede);
  }

  window.siriguelaLoco = { scan, remede, scrollTo: (alvo, opc) => lenis.scrollTo(alvo, opc) };

  /* ---------- Onde a locomotiva entra no site ---------- */

  /* 1. Frases grandes: a tinta preenche palavra por palavra conforme a frase sobe na tela */
  document.querySelectorAll(".order__lead, .about__lead, .join__lead").forEach((p) => {
    const palavras = p.textContent.trim().split(/\s+/);
    p.setAttribute("aria-label", p.textContent.trim());
    p.innerHTML = palavras.map((w, i) => `<span class="w" aria-hidden="true" style="--wi:${i}">${w}</span>`).join(" ");
    p.style.setProperty("--wn", palavras.length);
    p.classList.add("ler");
    p.dataset.scroll = "";
    p.dataset.scrollCssProgress = "";
  });

  /* 3. Título do hero: cada letra escapa pela máscara da sua palavra numa velocidade, o ponto vem por último, com atraso */
  document.querySelectorAll(".hero__title .ch").forEach((ch, i, todos) => {
    const ultimo = i === todos.length - 1;
    ch.dataset.scroll = "";
    ch.dataset.scrollSpeed = ultimo ? "-0.22" : String([0.05, 0.11, 0.03, 0.14, 0.07, 0.12, 0.04, 0.1, 0.06, 0.13][i % 10]);
    if (ultimo) {
      ch.dataset.scrollDelay = "0.07";
      ch.dataset.scrollGrow = "3";
      ch.classList.add("ch--ponto");
      /* depois da entrada, a máscara solta o pé: o ponto pode cair inteiro, sem ser cortado */
      ch.addEventListener("animationend", () => ch.closest(".mask")?.classList.add("solta"), { once: true });
      if (!ch.getAnimations().length) ch.closest(".mask")?.classList.add("solta");
    }
  });

  /* 4. Títulos de seção sobem por trás de uma linha, de novo a cada vez que entram */
  document.querySelectorAll(".block__title").forEach((t) => {
    t.innerHTML = `<span class="linha"><span>${t.innerHTML}</span></span>`;
    t.dataset.scroll = "";
    t.dataset.scrollRepeat = "";
  });

  /* 5. Menu: a seção que cruza o meio da tela fica sublinhada */
  const links = [...document.querySelectorAll(".head__nav a")];
  document.querySelectorAll("main section[id]").forEach((s) => { s.dataset.scroll = ""; s.dataset.scrollCall = "secao"; });
  addEventListener("secao", (e) => {
    const { target, way, from } = e.detail;
    let id = target.id;
    if (way === "leave") {
      /* saiu pelo alto: vale a seção seguinte; saiu por baixo: a anterior */
      const lista = [...document.querySelectorAll("main section[id]")];
      const i = lista.indexOf(target) + (from === "start" ? 1 : -1);
      id = lista[i]?.id || "";
    }
    links.forEach((a) => a.classList.toggle("is-here", !!id && a.hash === "#" + id));
  });

  scan();
  window.gsap.ticker.add(quadro);
  addEventListener("resize", () => requestAnimationFrame(remede));
  if (window.ScrollTrigger) window.ScrollTrigger.addEventListener("refresh", remede);
  if (document.readyState !== "complete") addEventListener("load", remede, { once: true });
})();
