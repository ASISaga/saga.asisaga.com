// Respect reduced motion preferences
const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Elements
const weave = document.querySelector('.weave');
const stars = document.querySelector('.stars');
const core = document.querySelector('.core');
const cta = document.getElementById('enterGenesis');

// Clamp helper
const clamp = (v, min, max) => Math.max(min, Math.min(max, v));

// Target and current positions for smooth easing
let target = { x: 0, y: 0 };
let current = { x: 0, y: 0 };
let rafId = null;

// Pointer movement handler
function onPointerMove(e) {
  const w = window.innerWidth;
  const h = window.innerHeight;
  const x = (e.clientX / w - 0.5) * 2; // -1 to 1
  const y = (e.clientY / h - 0.5) * 2;
  target.x = clamp(x, -1, 1);
  target.y = clamp(y, -1, 1);
  if (!rafId) rafId = requestAnimationFrame(update);
}

// Device tilt handler
function onDeviceTilt(e) {
  const gamma = e.gamma || 0; // left-right
  const beta = e.beta || 0;   // front-back
  target.x = clamp(gamma / 30, -1, 1);
  target.y = clamp(beta / 45, -1, 1);
  if (!rafId) rafId = requestAnimationFrame(update);
}

// Animation update loop
function update() {
  rafId = null;
  // Ease towards target
  current.x += (target.x - current.x) * 0.06;
  current.y += (target.y - current.y) * 0.06;

  // Apply transforms
  weave.style.transform = `translate3d(${current.x * 12}px, ${current.y * 8}px, 0) scale(1.02)`;
  stars.style.transform = `translate3d(${current.x * -6}px, ${current.y * -4}px, 0)`;
  core.style.transform = `translate3d(${current.x * -4}px, ${current.y * -3}px, 0)`;

  // Continue until close to target
  if (Math.abs(target.x - current.x) > 0.002 || Math.abs(target.y - current.y) > 0.002) {
    rafId = requestAnimationFrame(update);
  }
}

// Smooth scroll for CTA
cta?.addEventListener('click', e => {
  const targetEl = document.querySelector(cta.getAttribute('href'));
  if (targetEl) {
    e.preventDefault();
    targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
});

// Randomize thread line animation delays/durations
(function breatheLines() {
  const lines = document.querySelectorAll('.line-fade');
  lines.forEach(el => {
    el.style.animationDelay = `${(Math.random() * 4).toFixed(2)}s`;
    el.style.animationDuration = `${(6 + Math.random() * 4).toFixed(2)}s`;
  });
})();

// Attach motion listeners if allowed
if (!prefersReduced) {
  window.addEventListener('mousemove', onPointerMove, { passive: true });
  if ('DeviceOrientationEvent' in window) {
    window.addEventListener('deviceorientation', onDeviceTilt, { passive: true });
  }
}