const stage = document.querySelector('.ambar-palco');
const fruit = stage.querySelector('model-viewer');
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
let loaded = false;
let visible = false;
let frame = 0;

function smooth(value) {
  const t = Math.min(1, Math.max(0, value));
  return t * t * (3 - 2 * t);
}

let displayed = null;
let lastTime = 0;
let anchors = [];
const grid = document.querySelector('[data-grid-cam]');

function measure() {
  const top = stage.getBoundingClientRect().top;
  anchors = Array.from(grid.querySelectorAll('.card'), (card, i) => {
    const box = card.getBoundingClientRect();
    return { y: box.top - top + box.height / 2, side: i % 2 ? .17 : .83 };
  });
  schedule();
}

function mobileSide(distance) {
  if (!anchors.length) return .83;
  let previous = anchors[0];
  for (const next of anchors.slice(1)) {
    if (distance <= next.y) {
      const t = smooth(((distance - previous.y) / (next.y - previous.y) - .25) * 2);
      return previous.side + (next.side - previous.side) * t;
    }
    previous = next;
  }
  return previous.side;
}

function paint(now = performance.now()) {
  frame = 0;
  if (!loaded || !visible || reduced.matches) {
    displayed = null;
    fruit.style.opacity = '0';
    return;
  }
  const bounds = stage.getBoundingClientRect();
  const horizon = innerHeight * 0.55;
  const distance = horizon - bounds.top;
  if (displayed === null) displayed = distance;
  const dt = Math.min(50, Math.max(1, now - lastTime));
  lastTime = now;
  displayed += (distance - displayed) * (1 - Math.exp(-dt / 105));
  const progress = Math.min(1, Math.max(0, displayed / bounds.height));
  const edge = Math.min(innerHeight * 0.55, bounds.height * 0.13);
  const fade = smooth(distance / edge) * smooth((bounds.height - distance) / edge);
  // A fruta cruza as margens duas vezes, seguindo os vazios do lookbook.
  const side = innerWidth <= 600 ? mobileSide(displayed) : 0.50 - 0.40 * Math.cos(progress * Math.PI * 3);
  const x = bounds.width * side - fruit.offsetWidth / 2;
  const y = distance - fruit.offsetHeight / 2;
  const tilt = -21 + 14 * Math.sin(progress * Math.PI * 2);
  fruit.style.transform = `translate3d(${x}px,${y}px,0) rotate(${tilt}deg) scale(${0.78 + 0.22 * fade})`;
  fruit.style.opacity = String(fade);
  fruit.cameraOrbit = `${15 + 630 * progress}deg ${74 - 12 * Math.sin(Math.PI * progress)}deg auto`;
  fruit.jumpCameraToGoal();
  if (Math.abs(displayed - distance) > .45) schedule();
}

function schedule() {
  if (!frame && visible) frame = requestAnimationFrame(paint);
}

let loading;
async function activate() {
  if (reduced.matches || !visible || loading) return;
  loading = import('https://cdn.jsdelivr.net/npm/@google/model-viewer@4.1.0/dist/model-viewer.min.js');
  try {
    await loading;
    fruit.addEventListener('load', () => { loaded = true; schedule(); }, { once: true });
    fruit.src = new URL('../modelos/resina-ambar.glb', import.meta.url).href;
    fruit.loading = 'eager';
  } catch {
    loading = null;
  }
}

new IntersectionObserver(([entry]) => {
  visible = entry.isIntersecting;
  if (visible) { measure(); activate(); schedule(); } else { displayed = null; }
}, { rootMargin: '450px 0px' }).observe(stage);
new ResizeObserver(measure).observe(grid);
addEventListener('scroll', schedule, { passive: true });
addEventListener('resize', measure);
reduced.addEventListener('change', () => { activate(); paint(); });

