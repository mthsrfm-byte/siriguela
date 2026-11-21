/* Vereda theme script.
   Small, dependency-free custom elements. Everything degrades to plain
   links and forms when JavaScript is unavailable. */
(() => {
  'use strict';

  const theme = window.theme || { routes: {}, strings: {} };
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const designMode = !!(window.Shopify && window.Shopify.designMode);

  /* ---------- helpers ---------- */
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const debounce = (fn, wait = 300) => {
    let t;
    return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), wait); };
  };
  const parseHTML = (text) => new DOMParser().parseFromString(text, 'text/html');
  const define = (name, cls) => { if (!customElements.get(name)) customElements.define(name, cls); };

  const toast = (message) => {
    const el = $('[data-toast]');
    if (!el) return;
    el.textContent = message;
    el.classList.add('is-visible');
    clearTimeout(el._t);
    el._t = setTimeout(() => el.classList.remove('is-visible'), 2600);
  };

  const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"]), summary';

  /* ---------- drawers (menu + cart) ---------- */
  class ModalDrawer extends HTMLElement {
    connectedCallback() {
      this.panel = $('.drawer__panel', this);
      this.addEventListener('click', (e) => { if (e.target.closest('[data-close]')) this.close(); });
      this.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') this.close();
        if (e.key === 'Tab') this.trap(e);
      });
    }
    trap(e) {
      const items = $$(FOCUSABLE, this.panel).filter((el) => el.offsetParent !== null);
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
    open(opener) {
      this.opener = opener || document.activeElement;
      this.hidden = false;
      document.documentElement.style.overflow = 'hidden';
      requestAnimationFrame(() => requestAnimationFrame(() => this.classList.add('is-open')));
      if (this.opener && this.opener.hasAttribute('aria-expanded')) this.opener.setAttribute('aria-expanded', 'true');
      setTimeout(() => this.panel.focus(), 50);
    }
    close() {
      if (this.hidden) return;
      this.classList.remove('is-open');
      document.documentElement.style.overflow = '';
      if (this.opener && this.opener.hasAttribute('aria-expanded')) this.opener.setAttribute('aria-expanded', 'false');
      const done = () => { this.hidden = true; };
      reducedMotion.matches ? done() : setTimeout(done, 400);
      if (this.opener && this.opener.focus) this.opener.focus();
    }
  }
  define('menu-drawer', class extends ModalDrawer {});

  class CartDrawer extends ModalDrawer {
    connectedCallback() {
      super.connectedCallback();
      bindCartLines(this);
    }
    get sectionId() { return this.dataset.sectionId; }
    render(html) {
      const doc = parseHTML(html);
      const fresh = $('cart-drawer', doc);
      if (!fresh) return;
      ['.drawer__head', '[data-cart-body]', '.drawer__foot'].forEach((sel) => {
        const now = $(sel, this);
        const next = $(sel, fresh);
        if (now && next) now.replaceWith(next);
        else if (!now && next) this.panel.appendChild(next);
        else if (now && !next) now.remove();
      });
    }
  }
  define('cart-drawer', CartDrawer);

  /* ---------- header ---------- */
  define('sticky-header', class extends HTMLElement {
    connectedCallback() {
      this.overlay = this.classList.contains('header-wrap--overlay');
      this.onScroll = this.onScroll.bind(this);
      window.addEventListener('scroll', this.onScroll, { passive: true });
      this.onScroll();
      if (this.overlay) {
        this.addEventListener('mouseenter', () => this.classList.add('is-solid'));
        this.addEventListener('mouseleave', () => this.onScroll());
        this.addEventListener('focusin', () => this.classList.add('is-solid'));
      }
      const menuBtn = $('[data-menu-open]', this);
      if (menuBtn) menuBtn.addEventListener('click', () => $('menu-drawer', this).open(menuBtn));
      const searchBtn = $('[data-search-open]', this);
      if (searchBtn) searchBtn.addEventListener('click', (e) => { e.preventDefault(); $('search-overlay', this).open(searchBtn); });
      const cartBtn = $('[data-cart-open]', this);
      if (cartBtn) cartBtn.addEventListener('click', (e) => {
        const drawer = $('cart-drawer');
        if (theme.cartType === 'drawer' && drawer) { e.preventDefault(); drawer.open(cartBtn); }
      });
    }
    disconnectedCallback() { window.removeEventListener('scroll', this.onScroll); }
    onScroll() {
      if (this.overlay) this.classList.toggle('is-solid', window.scrollY > 40);
    }
  });

  define('details-disclosure', class extends HTMLElement {
    connectedCallback() {
      this.details = $('details', this);
      this.summary = $('summary', this);
      this.summary.setAttribute('aria-expanded', this.details.open);
      this.details.addEventListener('toggle', () => {
        this.summary.setAttribute('aria-expanded', this.details.open);
        if (this.details.open) {
          $$('details-disclosure details[open]').forEach((d) => { if (d !== this.details) d.open = false; });
        }
      });
      this.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && this.details.open) { this.details.open = false; this.summary.focus(); }
      });
      this.addEventListener('focusout', (e) => {
        if (!this.contains(e.relatedTarget)) this.details.open = false;
      });
      document.addEventListener('click', (e) => { if (!this.contains(e.target)) this.details.open = false; });
    }
  });

  /* ---------- search ---------- */
  define('search-overlay', class extends HTMLElement {
    connectedCallback() {
      this.input = $('input[type="search"]', this);
      this.results = $('[data-predictive-results]', this);
      this.addEventListener('click', (e) => { if (e.target.closest('[data-close]')) this.close(); });
      this.addEventListener('keydown', (e) => this.onKey(e));
      if (this.input && this.input.hasAttribute('data-predictive') && this.results) {
        this.input.addEventListener('input', debounce(() => this.query(), 250));
      }
      document.addEventListener('click', (e) => {
        if (!this.hidden && !this.contains(e.target) && !e.target.closest('[data-search-open]')) this.close();
      });
    }
    open(opener) {
      this.opener = opener;
      this.hidden = false;
      this.input.focus();
    }
    close() {
      this.hidden = true;
      if (this.opener) this.opener.focus();
    }
    async query() {
      const q = this.input.value.trim();
      if (!q) { this.results.innerHTML = ''; this.input.setAttribute('aria-expanded', 'false'); return; }
      this.controller && this.controller.abort();
      this.controller = new AbortController();
      const url = `${theme.routes.predictiveSearch}?q=${encodeURIComponent(q)}&section_id=predictive-search&resources[type]=product,collection,page,article,query&resources[limit]=6&resources[options][fields]=title,product_type,variants.title,vendor`;
      try {
        const res = await fetch(url, { signal: this.controller.signal });
        if (!res.ok) throw new Error(res.status);
        const doc = parseHTML(await res.text());
        const inner = $('.predictive__inner', doc);
        this.results.innerHTML = inner ? inner.outerHTML : '';
        this.input.setAttribute('aria-expanded', inner ? 'true' : 'false');
        this.active = -1;
      } catch (err) {
        if (err.name !== 'AbortError') this.results.innerHTML = '';
      }
    }
    onKey(e) {
      if (e.key === 'Escape') { this.close(); return; }
      if (!this.results || !['ArrowDown', 'ArrowUp', 'Enter'].includes(e.key)) return;
      const options = $$('[role="option"]', this.results);
      if (!options.length) return;
      if (e.key === 'Enter') {
        const current = options[this.active];
        if (current) { e.preventDefault(); $('a', current).click(); }
        return;
      }
      e.preventDefault();
      this.active = (this.active ?? -1) + (e.key === 'ArrowDown' ? 1 : -1);
      if (this.active < 0) this.active = options.length - 1;
      if (this.active >= options.length) this.active = 0;
      options.forEach((o, i) => o.setAttribute('aria-selected', i === this.active ? 'true' : 'false'));
      this.input.setAttribute('aria-activedescendant', options[this.active].id);
      options[this.active].scrollIntoView({ block: 'nearest' });
    }
  });

  /* ---------- announcement ---------- */
  define('announcement-rotator', class extends HTMLElement {
    connectedCallback() {
      this.items = $$('.announcement__item', this);
      if (this.items.length < 2 || reducedMotion.matches) {
        this.items.forEach((i) => { i.hidden = false; });
        if (reducedMotion.matches && this.items.length > 1) this.items.slice(1).forEach((i) => { i.hidden = true; });
        return;
      }
      this.index = 0;
      const ms = (parseInt(this.dataset.interval, 10) || 5) * 1000;
      const tick = () => {
        if (this.matches(':hover') || this.contains(document.activeElement)) return;
        this.items[this.index].hidden = true;
        this.index = (this.index + 1) % this.items.length;
        this.items[this.index].hidden = false;
      };
      this.timer = setInterval(tick, ms);
    }
    disconnectedCallback() { clearInterval(this.timer); }
  });

  /* ---------- video and motion ---------- */
  define('hero-video', class extends HTMLElement {
    connectedCallback() {
      this.video = $('video', this);
      if (!this.video) return;
      this.video.muted = true;
      this.video.setAttribute('aria-hidden', 'true');
      this.toggle = this.closest('section, .video-frame')?.querySelector('[data-video-toggle]')
        || this.parentElement.parentElement.querySelector('[data-video-toggle]');
      if (reducedMotion.matches) { this.video.removeAttribute('autoplay'); this.video.pause(); this.setPressed(true); }
      this.io = new IntersectionObserver(([entry]) => {
        if (this.userPaused || reducedMotion.matches) return;
        if (entry.isIntersecting) {
          if (this.video.preload === 'none') this.video.preload = 'auto';
          this.video.play().catch(() => {});
        } else this.video.pause();
      }, { threshold: 0.1 });
      this.io.observe(this);
      if (this.toggle && !this.toggle._bound) {
        this.toggle._bound = true;
        this.toggle.addEventListener('click', () => {
          const videos = $$('video', this.toggle.parentElement);
          const pause = this.toggle.getAttribute('aria-pressed') !== 'true';
          videos.forEach((v) => { pause ? v.pause() : v.play().catch(() => {}); v.closest('hero-video').userPaused = pause; });
          this.setPressed(pause);
        });
      }
    }
    setPressed(paused) { if (this.toggle) this.toggle.setAttribute('aria-pressed', paused ? 'true' : 'false'); }
    disconnectedCallback() { this.io && this.io.disconnect(); }
  });

  define('media-reel', class extends HTMLElement {
    connectedCallback() {
      const track = $('[data-reel-track]', this);
      const set = $('.reel__set', track);
      if (set && !track.dataset.cloned) {
        const clone = set.cloneNode(true);
        clone.setAttribute('aria-hidden', 'true');
        $$('a, button, video', clone).forEach((el) => { el.setAttribute('tabindex', '-1'); });
        track.appendChild(clone);
        track.dataset.cloned = 'true';
      }
      const toggle = $('[data-reel-toggle]', this);
      if (reducedMotion.matches) { this.classList.add('is-paused'); toggle && toggle.setAttribute('aria-pressed', 'true'); }
      toggle && toggle.addEventListener('click', () => {
        const paused = this.classList.toggle('is-paused');
        toggle.setAttribute('aria-pressed', paused ? 'true' : 'false');
        $$('video', this).forEach((v) => (paused ? v.pause() : v.play().catch(() => {})));
      });
      $$('video', this).forEach((v) => {
        v.muted = true;
        if (reducedMotion.matches) { v.pause(); return; }
        new IntersectionObserver(([e]) => {
          if (this.classList.contains('is-paused')) return;
          if (e.isIntersecting) { v.preload = 'auto'; v.play().catch(() => {}); } else v.pause();
        }).observe(v);
      });
    }
  });

  define('deferred-media', class extends HTMLElement {
    connectedCallback() {
      const poster = $('.deferred-media__poster', this);
      poster && poster.addEventListener('click', () => this.load());
    }
    load() {
      if (this.loaded) return;
      const tpl = $('template', this);
      if (!tpl) return;
      this.loaded = true;
      const content = tpl.content.firstElementChild.cloneNode(true);
      this.appendChild(content);
      $('.deferred-media__poster', this).hidden = true;
      if (content.tagName === 'VIDEO') content.play().catch(() => {});
      if (this.hasAttribute('data-model') && window.Shopify && Shopify.loadFeatures) {
        Shopify.loadFeatures([{ name: 'model-viewer-ui', version: '1.0', onLoad: (err) => {
          if (err) return;
          const viewer = $('model-viewer', this);
          if (viewer && window.Shopify.ModelViewerUI) new Shopify.ModelViewerUI(viewer);
        } }]);
      }
      content.focus && content.focus();
    }
  });

  /* ---------- quantity ---------- */
  define('quantity-input', class extends HTMLElement {
    connectedCallback() {
      this.input = $('input', this);
      this.addEventListener('click', (e) => {
        const btn = e.target.closest('button');
        if (!btn) return;
        const before = this.input.value;
        btn.name === 'plus' ? this.input.stepUp() : this.input.stepDown();
        if (before !== this.input.value) this.input.dispatchEvent(new Event('change', { bubbles: true }));
      });
    }
  });

  /* ---------- cart ---------- */
  const cartSections = () => {
    const ids = [];
    const drawer = $('cart-drawer');
    if (drawer) ids.push(drawer.dataset.sectionId);
    const page = $('cart-page');
    if (page) ids.push(page.dataset.sectionId);
    return ids;
  };

  const updateCount = (count) => {
    $$('[data-cart-count]').forEach((el) => {
      el.hidden = count === 0;
      const visible = el.querySelector('[aria-hidden]');
      if (visible) visible.textContent = count;
    });
  };

  const renderCartSections = (sections) => {
    if (!sections) return;
    const drawer = $('cart-drawer');
    if (drawer && sections[drawer.dataset.sectionId]) drawer.render(sections[drawer.dataset.sectionId]);
    const page = $('cart-page');
    if (page && sections[page.dataset.sectionId]) {
      const fresh = $('[data-cart-body]', parseHTML(sections[page.dataset.sectionId]));
      const now = $('[data-cart-body]', page);
      if (fresh && now) now.replaceWith(fresh);
    }
  };

  async function changeLine(line, quantity, root) {
    const row = $(`.cart-item[data-line="${line}"]`, root);
    row && row.setAttribute('aria-busy', 'true');
    try {
      const res = await fetch(`${theme.routes.cartChange}.js`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ line, quantity, sections: cartSections(), sections_url: window.location.pathname }),
      });
      const data = await res.json();
      if (!res.ok || data.status) {
        const err = row && $('[data-line-error]', row);
        if (err) err.textContent = data.description || data.message || theme.strings.cartError;
        row && row.removeAttribute('aria-busy');
        return;
      }
      updateCount(data.item_count);
      renderCartSections(data.sections);
      const focusTarget = $(`.cart-item[data-line="${line}"] .qty__input`) || $('cart-drawer .drawer__panel:not([hidden])') || $('[data-cart-body]');
      focusTarget && focusTarget.focus && focusTarget.focus({ preventScroll: true });
    } catch (e) {
      row && row.removeAttribute('aria-busy');
      toast(theme.strings.cartError);
    }
  }

  function bindCartLines(root) {
    root.addEventListener('change', debounce((e) => {
      const input = e.target.closest('.qty__input[data-line]');
      if (input) changeLine(parseInt(input.dataset.line, 10), parseInt(input.value, 10) || 0, root);
      if (e.target.matches('[data-cart-note]')) {
        fetch(`${theme.routes.cart}/update.js`, {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ note: e.target.value }),
        });
      }
    }, 350));
    root.addEventListener('click', (e) => {
      const remove = e.target.closest('[data-remove]');
      if (!remove) return;
      e.preventDefault();
      changeLine(parseInt(remove.dataset.remove, 10), 0, root);
    });
  }

  define('cart-page', class extends HTMLElement {
    connectedCallback() { bindCartLines(this); }
  });

  document.addEventListener('submit', async (e) => {
    const form = e.target.closest('form[data-cart-form]');
    if (!form) return;
    e.preventDefault();
    const submit = $('[type="submit"]', form);
    const errorEl = $('[data-form-error]', form) || $('[data-form-error]', form.parentElement);
    if (submit) { submit.setAttribute('aria-busy', 'true'); submit.disabled = true; }
    if (errorEl) { errorEl.hidden = true; errorEl.textContent = ''; }
    const body = new FormData(form);
    const sections = cartSections();
    if (sections.length) { body.append('sections', sections.join(',')); body.append('sections_url', window.location.pathname); }
    try {
      const res = await fetch(`${theme.routes.cartAdd}.js`, { method: 'POST', headers: { Accept: 'application/json' }, body });
      const data = await res.json();
      if (!res.ok || data.status) {
        const msg = data.description || data.message || theme.strings.cartError;
        if (errorEl) { errorEl.textContent = msg; errorEl.hidden = false; } else toast(msg);
        return;
      }
      const cart = await fetch(`${theme.routes.cart}.js`).then((r) => r.json());
      updateCount(cart.item_count);
      if (theme.cartType === 'page' || !$('cart-drawer')) {
        if (theme.cartType === 'page' && !$('cart-page')) { window.location.href = theme.routes.cart; return; }
        renderCartSections(data.sections);
        toast(theme.strings.added);
        return;
      }
      renderCartSections(data.sections);
      $('cart-drawer').open(submit);
    } catch (err) {
      toast(theme.strings.cartError);
    } finally {
      if (submit) {
        submit.removeAttribute('aria-busy');
        const idInput = form.querySelector('[name="id"]');
        submit.disabled = !!(idInput && idInput.disabled);
      }
    }
  });

  /* ---------- product page ---------- */
  define('product-page', class extends HTMLElement {
    connectedCallback() {
      this.sectionId = this.dataset.sectionId;
      this.gallery = $('[data-gallery-list]', this);
      this.bindGallery();
      this.addEventListener('change', (e) => {
        if (e.target.matches('[data-option-value], [data-option-select]')) this.onOptionChange();
      });
    }
    selectedValueIds() {
      return $$('variant-picker [data-option-value]:checked, variant-picker [data-option-select]', this).map((el) => el.value);
    }
    async onOptionChange() {
      const ids = this.selectedValueIds();
      const url = this.dataset.productUrl;
      this.abort && this.abort.abort();
      this.abort = new AbortController();
      const submit = $('.product-form__submit', this);
      submit && submit.setAttribute('aria-busy', 'true');
      try {
        const res = await fetch(`${url}?option_values=${ids.join(',')}&section_id=${this.sectionId}`, { signal: this.abort.signal });
        const doc = parseHTML(await res.text());
        const fresh = $('product-page', doc);
        if (!fresh) return;
        const focusedId = document.activeElement && document.activeElement.id;
        ['price', 'picker', 'buy'].forEach((key) => {
          const sel = `[data-update="${key}-${this.sectionId}"]`;
          const now = $(sel, this);
          const next = $(sel, fresh);
          if (now && next) now.innerHTML = next.innerHTML;
        });
        if (focusedId) { const el = document.getElementById(focusedId); el && el.focus(); }
        const variantId = fresh.dataset.variantId;
        this.dataset.variantId = variantId;
        if (!this.hasAttribute('data-featured') && variantId) {
          const u = new URL(window.location.href);
          u.searchParams.set('variant', variantId);
          window.history.replaceState({}, '', u.toString());
        }
        const current = $('.gallery__item.is-current', fresh);
        if (current) this.showMedia(current.dataset.mediaId);
        const pickup = $('pickup-availability', this);
        pickup && pickup.update(variantId, !!$('.product-form__submit:not([disabled])', this));
      } catch (err) {
        if (err.name !== 'AbortError') toast(theme.strings.cartError);
      } finally {
        const btn = $('.product-form__submit', this);
        btn && btn.removeAttribute('aria-busy');
      }
    }
    showMedia(mediaId) {
      if (!this.gallery || !mediaId) return;
      const item = $(`[data-media-id="${mediaId}"]`, this.gallery);
      if (!item) return;
      $$('.gallery__item', this.gallery).forEach((i) => i.classList.toggle('is-current', i === item));
      const horizontal = this.gallery.scrollWidth > this.gallery.clientWidth + 4;
      if (horizontal) this.gallery.scrollTo({ left: item.offsetLeft - this.gallery.offsetLeft - 16, behavior: reducedMotion.matches ? 'auto' : 'smooth' });
      else if (this.gallery.firstElementChild !== item) {
        this.gallery.prepend(item);
      }
    }
    bindGallery() {
      if (!this.gallery) return;
      const counter = $('[data-gallery-index]', this);
      if (counter) {
        this.gallery.addEventListener('scroll', debounce(() => {
          const items = $$('.gallery__item', this.gallery);
          const center = this.gallery.scrollLeft + this.gallery.clientWidth / 2;
          let idx = 0;
          items.forEach((it, i) => { if (it.offsetLeft - this.gallery.offsetLeft <= center) idx = i; });
          counter.textContent = idx + 1;
        }, 60), { passive: true });
      }
      const dialog = document.getElementById(`Zoom-${this.sectionId}`);
      if (!dialog || !dialog.showModal) return;
      const img = $('[data-zoom-img]', dialog);
      this.gallery.addEventListener('click', (e) => {
        const link = e.target.closest('[data-zoom]');
        if (!link) return;
        e.preventDefault();
        const src = $('img', link);
        img.src = link.href;
        img.alt = src ? src.alt : '';
        img.removeAttribute('width'); img.removeAttribute('height');
        this.zoomOpener = link;
        dialog.showModal();
      });
      dialog.addEventListener('click', (e) => { if (e.target.closest('[data-close]') || e.target === img) dialog.close(); });
      dialog.addEventListener('close', () => { this.zoomOpener && this.zoomOpener.focus(); });
    }
  });

  define('pickup-availability', class extends HTMLElement {
    connectedCallback() { if (!this.hidden) this.update(this.dataset.variantId, true); }
    async update(variantId, available) {
      if (!variantId || !available) { this.hidden = true; this.innerHTML = ''; return; }
      try {
        const res = await fetch(`${this.dataset.baseUrl.replace(/\/$/, '')}/variants/${variantId}/?section_id=pickup-availability`);
        if (!res.ok) throw new Error();
        const inner = $('.pickup__inner', parseHTML(await res.text()));
        this.innerHTML = inner ? inner.outerHTML : '';
        this.hidden = !inner;
      } catch (e) { this.hidden = true; }
    }
  });

  define('product-recommendations', class extends HTMLElement {
    connectedCallback() {
      if (this.children.length) return;
      new IntersectionObserver((entries, io) => {
        if (!entries[0].isIntersecting) return;
        io.disconnect();
        fetch(this.dataset.url).then((r) => r.text()).then((text) => {
          const fresh = $('product-recommendations', parseHTML(text));
          if (fresh && fresh.innerHTML.trim()) { this.innerHTML = fresh.innerHTML; reveal(this); }
        }).catch(() => {});
      }, { rootMargin: '0px 0px 400px 0px' }).observe(this);
    }
  });

  define('share-link', class extends HTMLElement {
    connectedCallback() {
      const btn = $('[data-share]', this);
      const status = $('[data-share-status]', this);
      btn && btn.addEventListener('click', async () => {
        const data = { title: this.dataset.title, url: this.dataset.url };
        try {
          if (navigator.share) await navigator.share(data);
          else { await navigator.clipboard.writeText(data.url); status.textContent = '✓'; setTimeout(() => { status.textContent = ''; }, 2000); }
        } catch (e) { /* dismissed */ }
      });
    }
  });

  define('recipient-form', class extends HTMLElement {
    connectedCallback() {
      const toggle = $('[data-recipient-toggle]', this);
      const fields = $('[data-recipient-fields]', this);
      const offset = $('[data-recipient-offset]', this);
      if (offset) offset.value = new Date().getTimezoneOffset().toString();
      toggle && toggle.addEventListener('change', () => {
        fields.hidden = !toggle.checked;
        $$('input, textarea', fields).forEach((el) => { el.disabled = !toggle.checked; });
      });
    }
  });

  /* ---------- filters ---------- */
  define('facet-filters', class extends HTMLElement {
    connectedCallback() {
      this.form = $('form', this);
      this.sectionId = this.dataset.sectionId;
      this.form.addEventListener('change', debounce(() => this.apply(), 400));
      this.form.addEventListener('submit', (e) => { e.preventDefault(); this.apply(); });
      this.addEventListener('click', (e) => {
        const link = e.target.closest('[data-facet-link]');
        if (!link) return;
        e.preventDefault();
        this.load(link.href);
      });
    }
    apply() {
      const params = new URLSearchParams();
      for (const [k, v] of new FormData(this.form)) if (v !== '') params.append(k, v);
      this.load(`${window.location.pathname}?${params.toString()}`);
    }
    async load(href) {
      const url = new URL(href, window.location.origin);
      const results = document.getElementById(`Results-${this.sectionId}`);
      const openFacets = $$('details[open]', this).map((d) => $('summary', d).textContent.trim());
      results.setAttribute('aria-busy', 'true');
      this.abort && this.abort.abort();
      this.abort = new AbortController();
      try {
        const fetchUrl = new URL(url);
        fetchUrl.searchParams.set('section_id', this.sectionId);
        const res = await fetch(fetchUrl, { signal: this.abort.signal });
        const doc = parseHTML(await res.text());
        const fresh = doc.getElementById(`Results-${this.sectionId}`);
        if (!fresh) { window.location.href = url; return; }
        results.innerHTML = fresh.innerHTML;
        const next = $('facet-filters', results);
        if (next) $$('details', next).forEach((d) => { if (openFacets.includes($('summary', d).textContent.trim())) d.open = true; });
        window.history.pushState({ facets: true }, '', url.toString());
        reveal(results);
        const count = $('[data-facets-count]', results);
        count && count.setAttribute('tabindex', '-1');
      } catch (err) {
        if (err.name !== 'AbortError') window.location.href = url;
      } finally {
        results.removeAttribute('aria-busy');
      }
    }
  });
  window.addEventListener('popstate', (e) => { if (e.state && e.state.facets) window.location.reload(); });

  /* ---------- localization ---------- */
  document.addEventListener('change', (e) => {
    if (e.target.matches('[data-autosubmit]')) e.target.form.submit();
  });

  /* ---------- reveal on scroll ---------- */
  let revealObserver;
  function reveal(root = document) {
    const targets = $$('[data-reveal]:not(.is-in)', root);
    if (!document.body.classList.contains('motion-reveal') || reducedMotion.matches || designMode || !('IntersectionObserver' in window)) {
      targets.forEach((el) => el.classList.add('is-in'));
      return;
    }
    revealObserver = revealObserver || new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-in');
        revealObserver.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -6% 0px' });
    targets.forEach((el, i) => {
      el.style.transitionDelay = `${Math.min(i % 4, 3) * 70}ms`;
      revealObserver.observe(el);
    });
  }
  reveal();

  /* ---------- theme editor ---------- */
  if (designMode) {
    document.addEventListener('shopify:section:load', (e) => reveal(e.target));
    document.addEventListener('shopify:block:select', (e) => {
      e.target.classList && e.target.classList.add('is-in');
      const drawer = e.target.closest('cart-drawer, menu-drawer');
      drawer && drawer.open();
    });
    document.addEventListener('shopify:section:select', (e) => {
      if (e.target.querySelector('cart-drawer')) $('cart-drawer').open();
    });
  }
})();
