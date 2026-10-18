import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { shaderCanvas, globe, HERO_FRAG, FLOW_FRAG } from './gl';

gsap.registerPlugin(ScrollTrigger);
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const $$ = <T extends Element = HTMLElement>(s: string) => Array.from(document.querySelectorAll<T>(s) as NodeListOf<T>);

// Smooth scroll
const lenis = new Lenis({ lerp: 0.09 });
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((t) => lenis.raf(t * 1000));
gsap.ticker.lagSmoothing(0);
$$<HTMLAnchorElement>('a[href^="#"]').forEach((a) =>
  a.addEventListener('click', (e) => { e.preventDefault(); lenis.scrollTo(a.getAttribute('href')!, { offset: 0, duration: 1.6 }); }));

// Split headings into masked words
$$('.split').forEach((el) => {
  el.innerHTML = el.textContent!.trim().split(/\s+/).map((w) => `<span class="line" style="display:inline-block"><span>${w}</span></span>`).join(' ');
});

// --- WebGL ---
const mouse = [0.5, 0.5], smooth = [0.5, 0.5];
let heroScroll = 0;
addEventListener('pointermove', (e) => { mouse[0] = e.clientX / innerWidth; mouse[1] = 1 - e.clientY / innerHeight; });
shaderCanvas(document.getElementById('hero-gl') as HTMLCanvasElement, HERO_FRAG, {
  uMouse: () => { smooth[0] += (mouse[0] - smooth[0]) * .05; smooth[1] += (mouse[1] - smooth[1]) * .05; return smooth; },
  uScroll: () => heroScroll,
});
ScrollTrigger.create({ trigger: '.hero', start: 'top top', end: 'bottom top', onUpdate: (s) => (heroScroll = s.progress) });

const hex = (v: string) => { const n = parseInt(getComputedStyle(document.documentElement).getPropertyValue(v).trim().slice(1), 16); return [(n >> 16) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255]; };
$$<HTMLCanvasElement>('.card .art').forEach((c) => {
  const card = c.parentElement!;
  const color = hex('--' + [...card.classList].find((k) => ['sand', 'forest', 'iris', 'slate'].includes(k)));
  const h = { v: 0 };
  card.addEventListener('pointerenter', () => gsap.to(h, { v: 1, duration: .8 }));
  card.addEventListener('pointerleave', () => gsap.to(h, { v: 0, duration: .8 }));
  shaderCanvas(c, FLOW_FRAG, { uColor: () => color, uSeed: () => +c.dataset.seed!, uHover: () => h.v });
});
shaderCanvas(document.getElementById('panel-gl') as HTMLCanvasElement, FLOW_FRAG, { uColor: () => hex('--forest'), uSeed: () => 9, uHover: () => .3 });

let spin = 0;
globe(document.getElementById('globe-gl') as HTMLCanvasElement, () => spin);
ScrollTrigger.create({ trigger: '.void', start: 'top bottom', end: 'bottom top', onUpdate: (s) => (spin = s.progress * Math.PI * 1.5) });

// --- Loader + hero intro ---
const intro = gsap.timeline({ paused: reduced });
const count = { v: 0 };
intro
  .to(count, { v: 100, duration: 1.4, ease: 'power2.inOut', onUpdate: () => { document.querySelector('.loader .count')!.textContent = String(Math.round(count.v)); } })
  .to('.loader', { yPercent: -100, duration: 1, ease: 'expo.inOut' })
  .from('.hero canvas', { scale: 1.3, duration: 2, ease: 'expo.out' }, '<')
  .from('.hero .split .line > span', { yPercent: 110, duration: 1.4, ease: 'expo.out', stagger: .08 }, '<.3')
  .from('.hero-in', { y: 24, autoAlpha: 0, duration: 1.2, ease: 'expo.out', stagger: .1 }, '<.2')
  .set('.loader', { display: 'none' });
if (reduced) gsap.set('.loader', { display: 'none' }); else intro.play();

// Hero parallax out
gsap.to('.hero .content', { yPercent: 30, autoAlpha: 0, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });

// Nav: solid after hero, hide on scroll down
const nav = document.querySelector('nav.top')!;
ScrollTrigger.create({
  start: () => innerHeight - 72, end: 'max',
  onToggle: (s) => nav.classList.toggle('solid', s.isActive),
  onUpdate: (s) => nav.classList.toggle('hide', s.direction === 1 && s.scroll() > innerHeight),
});

// Marquee driven by time + scroll velocity
const track = document.querySelector<HTMLElement>('.marquee .track')!;
let x = 0, vel = 0;
lenis.on('scroll', (l: Lenis) => (vel = l.velocity));
gsap.ticker.add(() => {
  x -= 1 + Math.abs(vel) * .4;
  const half = track.scrollWidth / 2;
  if (-x >= half) x += half;
  track.style.transform = `translate3d(${x}px,0,0)`;
});

// Section headings + reveals
$$('.split').forEach((el) => {
  if (el.closest('.hero')) return;
  gsap.from(el.querySelectorAll('.line > span'), { yPercent: 110, duration: 1.2, ease: 'expo.out', stagger: .06, scrollTrigger: { trigger: el, start: 'top 85%' } });
});
$$('.reveal').forEach((el) =>
  gsap.from(el, { y: 40, autoAlpha: 0, duration: 1.2, ease: 'expo.out', scrollTrigger: { trigger: el, start: 'top 90%' } }));
gsap.from('.card', { y: 80, autoAlpha: 0, duration: 1.4, ease: 'expo.out', stagger: .1, scrollTrigger: { trigger: '.grid', start: 'top 85%' } });

// Counters
$$('[data-count]').forEach((el) => {
  const o = { v: 0 };
  gsap.to(o, { v: +el.dataset.count!, duration: 2, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 90%' }, onUpdate: () => (el.textContent = Math.round(o.v) + (el.dataset.count === '4' ? '' : '+')) });
});

// Quote words light up while scrolling
gsap.to('.big-quote .w', { opacity: 1, stagger: .1, ease: 'none', scrollTrigger: { trigger: '.big-quote', start: 'top 80%', end: 'bottom 40%', scrub: true } });

// Giant footer word
gsap.from('footer .giant', { yPercent: 60, ease: 'none', scrollTrigger: { trigger: 'footer', start: 'top bottom', end: 'bottom bottom', scrub: true } });

// 3D tilt cards
$$('.tilt').forEach((card) => {
  const rx = gsap.quickTo(card, 'rotationX', { duration: .6, ease: 'power3' });
  const ry = gsap.quickTo(card, 'rotationY', { duration: .6, ease: 'power3' });
  gsap.set(card, { transformPerspective: 900 });
  card.addEventListener('pointermove', (e) => {
    const r = card.getBoundingClientRect();
    ry(((e.clientX - r.left) / r.width - .5) * 12);
    rx(-((e.clientY - r.top) / r.height - .5) * 12);
  });
  card.addEventListener('pointerleave', () => { rx(0); ry(0); });
});

// Magnetic buttons
$$('.magnetic').forEach((el) => {
  const mx = gsap.quickTo(el, 'x', { duration: .6, ease: 'power3' }), my = gsap.quickTo(el, 'y', { duration: .6, ease: 'power3' });
  el.addEventListener('pointermove', (e) => { const r = el.getBoundingClientRect(); mx((e.clientX - r.left - r.width / 2) * .3); my((e.clientY - r.top - r.height / 2) * .3); });
  el.addEventListener('pointerleave', () => { mx(0); my(0); });
});

// Cursor
const cursor = document.querySelector<HTMLElement>('.cursor')!;
const cx = gsap.quickTo(cursor, 'left', { duration: .3, ease: 'power3' }), cy = gsap.quickTo(cursor, 'top', { duration: .3, ease: 'power3' });
addEventListener('pointermove', (e) => { cx(e.clientX); cy(e.clientY); });
$$('a, button, .card').forEach((el) => {
  el.addEventListener('pointerenter', () => cursor.classList.add('big'));
  el.addEventListener('pointerleave', () => cursor.classList.remove('big'));
});

// Newsletter
document.getElementById('news')!.addEventListener('submit', (e) => {
  e.preventDefault();
  const b = (e.target as HTMLFormElement).querySelector('button')!;
  b.innerHTML = 'Listo ✓';
  gsap.fromTo(b, { scale: .94 }, { scale: 1, duration: .8, ease: 'elastic.out(1, .4)' });
});
