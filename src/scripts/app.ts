import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { globe } from './gl';

gsap.registerPlugin(ScrollTrigger);
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const $$ = <T extends Element = HTMLElement>(s: string, root: ParentNode = document) => Array.from(root.querySelectorAll<T>(s) as NodeListOf<T>);

// Smooth scroll lives for the whole session (the router keeps this module alive).
const lenis = new Lenis({ lerp: 0.1 });
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((t) => lenis.raf(t * 1000));
gsap.ticker.lagSmoothing(0);

// Nav hides while scrolling down.
const nav = document.querySelector('nav.top')!;
lenis.on('scroll', (l: Lenis) => nav.classList.toggle('hide', l.direction === 1 && l.scroll > 120));

let ctx: gsap.Context | undefined;
let introDone = false;

function splitWords(el: HTMLElement) {
  if (el.dataset.split) return;
  el.dataset.split = '1';
  el.innerHTML = el.textContent!.trim().split(/\s+/).map((w) => `<span class="w"><span>${w}</span></span>`).join(' ');
}

function heroIn() {
  if (!document.querySelector('.hero')) return;
  gsap.timeline()
    .from('.globe', { y: () => innerHeight * 0.6, duration: 1.6, ease: 'expo.out' })
    .from('.globe-text', { y: () => innerHeight * 0.5, rotation: 8, duration: 1.6, ease: 'expo.out' }, '<.1')
    .from('.cloud', { scale: 0, transformOrigin: '50% 50%', duration: 1, ease: 'back.out(2)', stagger: .12 }, '<.3')
    .from('.hero-in', { y: -60, autoAlpha: 0, rotation: -10, duration: 1, ease: 'back.out(2)' }, '<');
}

function initPage() {
  // The nav persists across pages, so its active link is updated here.
  const path = location.pathname.replace(/\/$/, '') || '/';
  $$<HTMLAnchorElement>('nav.top a').forEach((a) =>
    a.getAttribute('href') === path ? a.setAttribute('aria-current', 'page') : a.removeAttribute('aria-current'));
  ctx?.revert();
  ctx = gsap.context(() => {
    $$('.split').forEach(splitWords);
    if (reduced) return;

    // Headline words pop up from their masks.
    $$('.split').forEach((el) => {
      if (el.closest('.hero')) return;
      gsap.from(el.querySelectorAll('.w > span'), { yPercent: 110, rotation: 6, duration: 1, ease: 'expo.out', stagger: .06, scrollTrigger: { trigger: el, start: 'top 90%' } });
    });
    $$('.reveal').forEach((el) =>
      gsap.from(el, { y: 50, autoAlpha: 0, duration: 1, ease: 'expo.out', scrollTrigger: { trigger: el, start: 'top 92%' } }));
    ScrollTrigger.batch('.pop', {
      start: 'top 92%', once: true,
      onEnter: (els) => gsap.from(els, { scale: .4, rotation: -12, autoAlpha: 0, duration: 1, ease: 'back.out(1.8)', stagger: .1 }),
    });

    // Clouds bob and drift with scroll.
    $$<SVGElement>('.cloud').forEach((c, i) => {
      gsap.to(c, { y: 14, x: 10, duration: 2.4 + i * .5, ease: 'sine.inOut', yoyo: true, repeat: -1 });
      gsap.to(c, { yPercent: -120 * +(c.dataset.speed || 1), ease: 'none', scrollTrigger: { trigger: c.closest('section'), start: 'top top', end: 'bottom top', scrub: true } });
    });

    // Globe sinks and the arc text spins as you leave the hero.
    if (document.querySelector('.hero')) {
      gsap.to('.globe-text', { rotation: -12, yPercent: 30, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
      gsap.to('.globe', { scale: 1.15, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
      if (introDone || !document.documentElement.classList.contains('intro-on')) heroIn();
    }

    // "midec26" gets crossed out.
    $$('[data-strike]').forEach((el) =>
      gsap.to(el, { '--s': 1, duration: .8, ease: 'expo.inOut', scrollTrigger: { trigger: el, start: 'top 75%' } }));

    // Marquee: constant drift, faster with scroll velocity.
    const track = document.querySelector<HTMLElement>('.marquee .track');
    if (track) {
      let x = 0;
      const tick = () => {
        x -= 1.2 + Math.abs(lenis.velocity) * .5;
        const half = track.scrollWidth / 2;
        if (-x >= half) x += half;
        track.style.transform = `translate3d(${x}px,0,0)`;
      };
      gsap.ticker.add(tick);
      return () => gsap.ticker.remove(tick);
    }
  });

  const g = document.getElementById('globe-gl') as HTMLCanvasElement | null;
  if (g) {
    let spin = 0;
    globe(g, () => spin);
    ScrollTrigger.create({ trigger: g, start: 'top bottom', end: 'bottom top', onUpdate: (s) => (spin = s.progress * Math.PI * 2) });
  }

  const form = document.querySelector<HTMLFormElement>('form.news');
  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    const b = form.querySelector('button')!;
    b.textContent = '¡Listo!';
    gsap.fromTo(b, { rotation: -10, scale: .8 }, { rotation: 0, scale: 1, duration: 1, ease: 'elastic.out(1, .4)' });
  });
}

// Mask intro, once per browser session.
function playIntro() {
  const intro = document.querySelector<HTMLElement>('.intro')!;
  const finish = () => { introDone = true; intro.style.display = 'none'; lenis.start(); heroIn(); };
  if (!document.documentElement.classList.contains('intro-on') || reduced) { intro.style.display = 'none'; introDone = true; return; }
  try { sessionStorage.setItem('intro', '1'); } catch {}
  lenis.stop();
  const web = $$<SVGPathElement>('.web path', intro);
  gsap.set(web, { strokeDasharray: 1, strokeDashoffset: 1 });
  const tl = gsap.timeline({ onComplete: finish })
    .to(web, { strokeDashoffset: 0, duration: 1, ease: 'power2.inOut', stagger: .025 })
    .from('.eyes-frame, .eyes-lens', { scale: 0, svgOrigin: '50 46', duration: .7, ease: 'back.out(2)' }, '-=.6')
    .to('.eyes-lens', { scaleY: .08, svgOrigin: '50 47', duration: .12, repeat: 3, yoyo: true, ease: 'power2.in' }, '+=.3')
    .to('.eyes-lens', { opacity: 0, duration: .35 }, '+=.2')
    .to('.eyes-hole, .eyes-frame', { scale: 45, svgOrigin: '33 46', duration: 1.3, ease: 'expo.in' }, '+=.35');
  intro.querySelector('.skip')!.addEventListener('click', () => tl.progress(1));
}

document.addEventListener('astro:before-swap', () => { ctx?.revert(); ScrollTrigger.getAll().forEach((t) => t.kill()); });
document.addEventListener('astro:after-swap', () => lenis.scrollTo(0, { immediate: true }));
document.addEventListener('astro:page-load', initPage);
playIntro();
