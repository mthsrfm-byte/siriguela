/* SIRIGUELA — rolagem e movimento.
   Lenis dá a inércia da rolagem; o GSAP ScrollTrigger sincroniza as animações com ela.
   Tudo aqui é opcional: sem as bibliotecas, ou com movimento reduzido no sistema,
   o site rola do jeito nativo e mostra tudo parado. */
(function () {
  "use strict";
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  if (!window.Lenis || !window.gsap || !window.ScrollTrigger) return;

  const { gsap, ScrollTrigger } = window;
  gsap.registerPlugin(ScrollTrigger);

  /* ---------- Rolagem com inércia ---------- */
  const lenis = new window.Lenis({
    lerp: 0.085,           // quanto menor, mais longa a inércia
    wheelMultiplier: 0.9,
    smoothWheel: true,
    syncTouch: false       // no celular a rolagem continua nativa
  });
  window.siriguelaLenis = lenis;
  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add((t) => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);

  /* links para âncoras da mesma página rolam com a mesma inércia, descontando o cabeçalho */
  const cabecalho = () => (document.querySelector(".head")?.offsetHeight || 64) + 24;
  document.addEventListener("click", (e) => {
    const a = e.target.closest("a[href*='#']");
    if (!a) return;
    const url = new URL(a.href, location.href);
    const pag = (p) => p.replace(/index\.html$/, "");
    if (pag(url.pathname) !== pag(location.pathname) || !url.hash || url.hash === "#") return;
    const alvo = document.querySelector(url.hash);
    if (!alvo) return;
    e.preventDefault();
    lenis.scrollTo(alvo, { offset: -cabecalho(), duration: 1.4 });
    history.replaceState(null, "", url.hash);
  });

  /* ---------- Animações ligadas à rolagem ---------- */
  const mm = gsap.matchMedia();

  /* Entrada dos blocos: opacidade e 8 px, como pede o branding. Só o que ainda está abaixo da tela. */
  const entra = ".block__head, .card, .index__list li, .step, .order__why > div, .order__facts, .about__lead, .about__cols, .join__lead, .join__form, .sizes__table";
  const abaixo = gsap.utils.toArray(entra).filter((el) => el.getBoundingClientRect().top > innerHeight * 0.92);
  gsap.set(abaixo, { opacity: 0, y: 8 });
  ScrollTrigger.batch(abaixo, {
    start: "top 90%",
    once: true,
    onEnter: (els) => gsap.to(els, { opacity: 1, y: 0, duration: 0.6, ease: "power2.out", stagger: 0.08, overwrite: true })
  });

  /* Hero: o título e a faixa de vídeos andam em velocidades diferentes ao sair da tela. */
  mm.add("(min-width: 861px)", () => {
    const hero = document.querySelector(".hero");
    if (!hero) return;
    gsap.to(".hero__foot", { yPercent: -18, ease: "none", scrollTrigger: { trigger: hero, start: "top top", end: "bottom top", scrub: true } });
    gsap.to(".reel", { yPercent: 6, ease: "none", scrollTrigger: { trigger: hero, start: "top top", end: "bottom top", scrub: true } });
  });

  /* Lookbook: cada card desliza um pouco no próprio ritmo, conforme a proporção, e a grade parece respirar. */
  mm.add("(min-width: 861px)", () => {
    gsap.utils.toArray(".look .card").forEach((card, i) => {
      const forca = [26, -18, 34, -22, 18, -30, 22][i % 7];
      gsap.fromTo(card, { y: forca }, { y: -forca, ease: "none", scrollTrigger: { trigger: card, start: "top bottom", end: "bottom top", scrub: true } });
    });
  });

  /* Galeria do produto: parallax leve. A foto fica um pouco maior que a janela
     e corre devagar dentro dela enquanto a página rola. */
  gsap.utils.toArray(".gallery__ph").forEach((ph) => {
    const img = ph.querySelector("img");
    if (!img) return;
    gsap.fromTo(img, { yPercent: -5, scale: 1.1 }, {
      yPercent: 5, scale: 1.1, ease: "none",
      scrollTrigger: { trigger: ph, start: "top bottom", end: "bottom top", scrub: true }
    });
  });

  /* Índice: o fio de cada linha se desenha da esquerda para a direita quando ela entra. */
  gsap.utils.toArray(".index__list li").forEach((li) => {
    li.style.setProperty("--fio", "0");
    ScrollTrigger.create({ trigger: li, start: "top 92%", once: true, onEnter: () => gsap.to(li, { "--fio": 1, duration: 0.9, ease: "power2.inOut" }) });
  });

  /* imagens e vídeos que carregam depois mudam a altura da página: recalcula as posições */
  if (document.readyState === "complete") ScrollTrigger.refresh();
  else addEventListener("load", () => ScrollTrigger.refresh());
  document.querySelectorAll("img").forEach((img) => img.complete || img.addEventListener("load", () => ScrollTrigger.refresh(), { once: true }));
})();
