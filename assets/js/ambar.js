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

function paint() {
  frame = 0;
  if (!loaded || !visible || reduced.matches) {
    fruit.style.opacity = '0';
    return;
  }
  const bounds = stage.getBoundingClientRect();
  const horizon = innerHeight * 0.55;
  const distance = horizon - bounds.top;
  const progress = Math.min(1, Math.max(0, distance / bounds.height));
  const edge = Math.min(innerHeight * 0.55, bounds.height * 0.13);
  const fade = smooth(distance / edge) * smooth((bounds.height - distance) / edge);
  // A fruta cruza as margens duas vezes, seguindo os vazios do lookbook.
  const side = 0.50 - 0.40 * Math.cos(progress * Math.PI * 3);
  const x = bounds.width * side - fruit.offsetWidth / 2;
  const y = distance - fruit.offsetHeight / 2;
  const tilt = -21 + 14 * Math.sin(progress * Math.PI * 2);
  fruit.style.transform = `translate3d(${x}px,${y}px,0) rotate(${tilt}deg) scale(${0.78 + 0.22 * fade})`;
  fruit.style.opacity = String(fade);
  fruit.cameraOrbit = `${15 + 360 * progress}deg ${74 - 12 * Math.sin(Math.PI * progress)}deg auto`;
  fruit.jumpCameraToGoal();
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
  if (visible) { activate(); schedule(); }
}, { rootMargin: '450px 0px' }).observe(stage);
new ResizeObserver(schedule).observe(stage);
addEventListener('scroll', schedule, { passive: true });
addEventListener('resize', schedule);
reduced.addEventListener('change', () => { activate(); paint(); });
