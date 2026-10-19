import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { globe } from './gl';

gsap.registerPlugin(ScrollTrigger);
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const $$ = <T extends Element = HTMLElement>(s: string, root: ParentNode = document) => Array.from(root.querySelectorAll<T>(s) as NodeListOf<T>);

// Every full load starts at the top, under the intro.
history.scrollRestoration = 'manual';
scrollTo(0, 0);

// Smooth scroll lives for the whole session (the router keeps this module alive).
const lenis = new Lenis({ lerp: 0.1 });
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((t) => lenis.raf(t * 1000));
gsap.ticker.lagSmoothing(0);

// Nav hides while scrolling down.
const nav = document.querySelector('nav.top')!;
lenis.on('scroll', (l: Lenis) => {
  nav.classList.toggle('hide', l.direction === 1 && l.scroll > 120);
  nav.classList.toggle('solid', l.scroll > 40);
});

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
    .fromTo('.globe', { y: () => innerHeight * 0.6 }, { y: 0, duration: 1.6, ease: 'expo.out' })
    .fromTo('.globe-text', { y: () => innerHeight * 0.5, rotation: 8 }, { y: 0, rotation: 0, duration: 1.6, ease: 'expo.out' }, '<.1')
    .from('.cloud', { scale: 0, transformOrigin: '50% 50%', duration: 1, ease: 'back.out(2)', stagger: .12 }, '<.3')
    .fromTo('.hero-in', { y: -60, autoAlpha: 0, rotation: -10 }, { y: 0, autoAlpha: 1, rotation: 0, duration: 1, ease: 'back.out(2)', stagger: .08, clearProps: 'transform' }, '<');
}

function initPage() {
  // The nav persists across pages, so its active link is updated here.
  const path = location.pathname.replace(/\/$/, '') || '/';
  $$<HTMLAnchorElement>('nav.top a').forEach((a) => {
    const href = a.getAttribute('href')!;
    const on = href === '/' ? path === '/' : path.startsWith(href);
    on ? a.setAttribute('aria-current', 'page') : a.removeAttribute('aria-current');
  });
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
      onEnter: (els) => gsap.fromTo(els, { scale: .4, rotation: -12, autoAlpha: 0 }, { scale: 1, rotation: 0, autoAlpha: 1, duration: 1, ease: 'back.out(1.8)', stagger: .1, clearProps: 'transform' }),
    });

    // Clouds bob and drift with scroll.
    $$<SVGElement>('.cloud').forEach((c, i) => {
      gsap.to(c, { y: 14, x: 10, duration: 2.4 + i * .5, ease: 'sine.inOut', yoyo: true, repeat: -1 });
      gsap.to(c, { yPercent: -120 * +(c.dataset.speed || 1), ease: 'none', scrollTrigger: { trigger: c.closest('section'), start: 'top top', end: 'bottom top', scrub: true } });
    });

    // Globe sinks and the arc text spins as you leave the hero.
    if (document.querySelector('.hero')) {
      // Positioning lives in GSAP so tweens never fight the CSS transform.
      gsap.set('.globe', { x: 0, y: 0, xPercent: -50, yPercent: 72 });
      gsap.set('.globe-text', { x: 0, y: 0, xPercent: -50, yPercent: 26 });
      gsap.to('.globe-text', { rotation: -12, yPercent: 56, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
      gsap.to('.globe', { scale: 1.15, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
      if (introDone || !document.documentElement.classList.contains('intro-on')) heroIn();
    }

    // Lyrics light up line by line; highlighted lines punch in.
    $$('.lyric:not(.hl)').forEach((el) =>
      ScrollTrigger.create({ trigger: el, start: 'top 75%', end: 'bottom 25%', toggleClass: 'on' }));
    $$('.lyric.hl').forEach((el) =>
      gsap.fromTo(el, { scale: .6, rotation: -6, xPercent: -10, opacity: 0 }, { scale: 1, rotation: -2, xPercent: 0, opacity: 1, ease: 'back.out(2)', duration: 1, scrollTrigger: { trigger: el, start: 'top 80%' } }));

    // San Valentín decor: the heart cracks apart as you read, and Cupid's
    // arrow flies in, pierces it and wobbles.
    const decor = document.querySelector<HTMLElement>('.decor');
    const lyricsEl = decor?.parentElement!.querySelector('.lyrics');

    // como si nada: the days without her tick up, she blocks him, his photo
    // is still her wallpaper, and finally the phone rings.
    if (decor && lyricsEl && decor.querySelector('.phone')) {
      const days = decor.querySelector('.ph-days')!;
      const d = { v: 1 };
      gsap.timeline({ scrollTrigger: { trigger: lyricsEl, start: 'top 60%', end: 'bottom 70%', scrub: 1 } })
        .to(d, { v: 10, ease: 'none', duration: 4, onUpdate: () => (days.textContent = String(Math.round(d.v))) })
        .fromTo('.ph-blocked', { y: -30, opacity: 0 }, { y: 0, opacity: 1, duration: .5 }, 1)
        .fromTo('.ph-wall', { y: -30, opacity: 0 }, { y: 0, opacity: 1, duration: .5 }, 1.8)
        .to('.ph-call', { yPercent: -101, duration: .6, ease: 'back.out(1.6)' }, 3.2);
      gsap.to('.phone', { rotation: 1, x: 3, duration: .08, repeat: -1, yoyo: true, ease: 'none', repeatDelay: 1.2 });
    }

    // Entre Sombras y Luces: the club lights brighten and the fire grows.
    if (decor && lyricsEl && decor.querySelector('.disco')) {
      gsap.timeline({ scrollTrigger: { trigger: lyricsEl, start: 'top 60%', end: 'bottom 60%', scrub: 1 } })
        .fromTo('.disco', { y: -40, opacity: .4 }, { y: 0, opacity: 1, ease: 'none' })
        .fromTo('.flame', { scale: .5 }, { scale: 1.4, ease: 'none' }, 0);
    }

    if (decor && decor.querySelector('.heart')) {
      const lyrics = decor.parentElement!.querySelector('.lyrics')!;
      decor.style.setProperty('--h', `${lyrics.getBoundingClientRect().height + 100}px`);
      gsap.timeline({ scrollTrigger: { trigger: lyrics, start: 'top 60%', end: 'bottom 60%', scrub: 1 } })
        .fromTo('.heart', { scale: .7, rotation: -8 }, { scale: 1, rotation: 0, ease: 'none', duration: 1 })
        .to('.heart-l', { rotation: -14, x: -2.5, y: 1, ease: 'none', duration: 2 })
        .to('.heart-r', { rotation: 14, x: 2.5, y: 1, ease: 'none', duration: 2 }, '<')
        .to('.heart', { y: 30, ease: 'none', duration: 1 });
      gsap.timeline({ scrollTrigger: { trigger: lyrics, start: 'top 70%' } })
        .fromTo('.arrow', { x: -500, rotation: -20, opacity: 0 }, { x: 0, rotation: -12, opacity: 1, duration: .9, ease: 'expo.out' })
        .to('.arrow', { rotation: -8, duration: .08, repeat: 7, yoyo: true, ease: 'sine.inOut' })
        .to('.arrow', { rotation: -12, duration: .2 });
      // Heartbeat on the halves so it doesn't fight the scrubbed .heart tween.
      gsap.to('.heart-l, .heart-r', { scale: 1.06, duration: .45, repeat: -1, yoyo: true, ease: 'sine.inOut' });
    }

    $$('[data-count]').forEach((el) => {
      const o = { v: 0 };
      gsap.to(o, { v: +el.dataset.count!, duration: 1.6, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 90%' }, onUpdate: () => (el.textContent = String(Math.round(o.v))) });
    });

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

// Mask loader + intro on every full page load.
function playIntro() {
  const intro = document.querySelector<HTMLElement>('.intro')!;
  const finish = () => { introDone = true; intro.style.display = 'none'; lenis.start(); heroIn(); };
  if (!document.documentElement.classList.contains('intro-on') || reduced) { intro.style.display = 'none'; introDone = true; return; }
  lenis.stop();
  const fill = intro.querySelector('.head-fill')!;
  const top = 10, bottom = 86;
  // Glasses and their see-through lenses (in the mask) always move together.
  const specs = '.glasses, .lens-hole';
  gsap.set(specs, { y: -90 });
  gsap.set('.head-line', { strokeDasharray: 1, strokeDashoffset: 1, attr: { pathLength: 1 } });

  // Loading: liquid red rises inside the mask while fonts and assets arrive.
  // The wave spans far past the viewBox so ultra-wide screens stay covered.
  const state = { p: 0, amp: 1.6 };
  const wave = () => {
    const y = bottom - (bottom - top) * state.p, t = performance.now() / 260;
    let d = `M-400 ${y}`;
    for (let x = -60; x <= 160; x += 4) d += ` L${x} ${(y + Math.sin(x / 7 + t) * state.amp + Math.sin(x / 3 - t * 1.3) * state.amp * .35).toFixed(2)}`;
    fill.setAttribute('d', d + ` L500 ${y} L500 600 L-400 600 Z`);
  };
  gsap.ticker.add(wave);
  gsap.to('.head-line', { strokeDashoffset: 0, duration: 1.1, ease: 'power3.inOut' });
  gsap.from('.intro-name', { y: 6, opacity: 0, duration: .9, ease: 'back.out(2)', delay: .3 });
  const fake = gsap.to(state, { p: .82, duration: 2.4, ease: 'power2.out', delay: .4 });
  const loaded = Promise.all([
    document.fonts.ready,
    document.readyState === 'complete' ? null : new Promise((r) => addEventListener('load', r, { once: true })),
    new Promise((r) => setTimeout(r, 2000)),
  ]);

  const tl = gsap.timeline({ paused: true, onComplete: () => { gsap.ticker.remove(wave); finish(); } })
    .to(state, { p: 1.05, amp: 0, duration: .6, ease: 'power2.inOut' })
    .to('.intro-name', { y: 8, opacity: 0, duration: .4, ease: 'power2.in' }, '<')
    // The mask punches out to fill the screen.
    .to('.head-shape, .head-line, .head-shade', { scale: 8, svgOrigin: '50 49', duration: 1, ease: 'expo.inOut' }, '-=.1')
    .set(state, { p: 5 }, '<.3')
    .to('.head-line', { opacity: 0, duration: .3 }, '<.4')
    // "Deal with it": the pixel glasses drop onto the face.
    .to(specs, { y: 0, duration: .9, ease: 'bounce.out' }, '-=.2')
    .fromTo('.glint', { opacity: 0 }, { opacity: 1, duration: .08, repeat: 3, yoyo: true, ease: 'steps(1)' }, '+=.1')
    .to('.glint', { opacity: 1, duration: .01 })
    // Lenses turn see-through, then the left one dives toward the viewer.
    .to('.lens-hole', { opacity: 1, duration: .45, ease: 'power2.inOut' }, '+=.25')
    .to('.glint', { opacity: 0, duration: .2 }, '<')
    .to(specs, { scale: 70, svgOrigin: '34 44', duration: 1.15, ease: 'expo.in' }, '+=.2')
    .to('.skip', { opacity: 0, duration: .3 }, '<');
  loaded.then(() => { fake.kill(); tl.play(); });
  intro.querySelector('.skip')!.addEventListener('click', () => { fake.kill(); tl.progress(1); });
}

// Ads: fill every AdSense unit on the page that hasn't been filled yet.
// The router swaps pages without a reload, so this runs on each page load.
type AdsWindow = Window & { adsbygoogle?: unknown[]; googlefc?: { callbackQueue?: unknown[]; showRevocationMessage?: () => void } };
const w = window as AdsWindow;
document.addEventListener('astro:page-load', () => {
  $$('ins.adsbygoogle:not([data-adsbygoogle-status])').forEach(() => {
    try { (w.adsbygoogle = w.adsbygoogle || []).push({}); } catch {}
  });
});

function toast(text: string) {
  const el = Object.assign(document.createElement('div'), { className: 'toast', role: 'status', textContent: text });
  document.body.append(el);
  gsap.fromTo(el, { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: .4, ease: 'back.out(2)' });
  gsap.to(el, { y: 40, opacity: 0, delay: 5, duration: .3, onComplete: () => el.remove() });
}

// Click-to-load third-party players (no third-party cookies until asked).
document.addEventListener('click', (e) => {
  const target = e.target as Element;
  if (target.closest('.facade a')) return;
  const facade = target.closest<HTMLElement>('.facade');
  if (facade && !facade.querySelector('iframe')) {
    facade.innerHTML = `<iframe src="${facade.dataset.embedSrc}" title="${facade.dataset.embedTitle}" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"></iframe>`;
    facade.classList.remove('facade');
  }
  // "Configurar cookies": queue Google's consent message (it runs once
  // Google's CMP has loaded). If it never runs, the CMP isn't live yet.
  if (target.closest('[data-consent-open]')) {
    let shown = false;
    w.googlefc = w.googlefc || {};
    w.googlefc.callbackQueue = w.googlefc.callbackQueue || [];
    w.googlefc.callbackQueue.push(() => { shown = true; w.googlefc!.showRevocationMessage?.(); });
    setTimeout(() => { if (!shown) toast('El aviso de cookies aún se está activando. Mientras tanto no usamos cookies publicitarias personalizadas.'); }, 1500);
  }
});

// Night mode toggle: the new theme grows as a circle from the button.
const themeBtn = document.querySelector<HTMLButtonElement>('.theme-toggle')!;
const syncTheme = () => {
  const night = document.documentElement.dataset.theme === 'night';
  themeBtn.setAttribute('aria-pressed', String(night));
  themeBtn.title = themeBtn.ariaLabel = night ? 'Modo día' : 'Modo noche';
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', night ? '#1c0505' : '#ffe600');
};
syncTheme();
// Carry the theme onto the incoming page before it is swapped in (no flash).
document.addEventListener('astro:before-swap', (e) => {
  const theme = document.documentElement.dataset.theme;
  if (theme) e.newDocument.documentElement.dataset.theme = theme;
});
document.addEventListener('astro:after-swap', syncTheme);
themeBtn.addEventListener('click', () => {
  const html = document.documentElement;
  const apply = () => {
    if (html.dataset.theme === 'night') delete html.dataset.theme; else html.dataset.theme = 'night';
    try { localStorage.setItem('theme', html.dataset.theme ?? 'day'); } catch {}
    syncTheme();
  };
  if (!document.startViewTransition || reduced) return apply();
  const r = themeBtn.getBoundingClientRect(), x = r.left + r.width / 2, y = r.top + r.height / 2;
  const radius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
  html.classList.add('theme-switching');
  const vt = document.startViewTransition(apply);
  vt.ready.then(() => document.documentElement.animate(
    { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
    { duration: 700, easing: 'cubic-bezier(.7, 0, .2, 1)', pseudoElement: '::view-transition-new(root)' },
  ));
  vt.finished.finally(() => html.classList.remove('theme-switching'));
});

// YouTube player in a dialog; any [data-play] element opens it.
const player = document.querySelector<HTMLDialogElement>('dialog.player')!;
const frame = player.querySelector<HTMLElement>('.player-frame')!;
const closePlayer = () => {
  gsap.to(player, { scale: .85, rotation: 4, opacity: 0, duration: .3, ease: 'power2.in', onComplete: () => { player.close(); frame.innerHTML = ''; } });
};
document.addEventListener('click', (e) => {
  const btn = (e.target as Element).closest<HTMLElement>('[data-play]');
  if (!btn) return;
  player.querySelector('.player-title')!.textContent = btn.dataset.title || '';
  // data-play is "spotify:<trackId>", "youtube:<videoId>" or "instagram:<reelId>".
  const [kind, id] = btn.dataset.play!.split(':');
  player.classList.toggle('is-spotify', kind === 'spotify');
  player.classList.toggle('is-vertical', kind === 'instagram');
  const src = {
    spotify: `https://open.spotify.com/embed/track/${id}?utm_source=generator&theme=0`,
    instagram: `https://www.instagram.com/reel/${id}/embed/`,
    youtube: `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`,
  }[kind] ?? '';
  frame.innerHTML = `<iframe src="${src}" title="${btn.dataset.title || 'Reproductor'}" allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; fullscreen" allowfullscreen></iframe>`;
  player.showModal();
  gsap.fromTo(player, { scale: .6, rotation: -6, opacity: 0 }, { scale: 1, rotation: 0, opacity: 1, duration: .7, ease: 'back.out(1.7)' });
});
player.querySelector('.player-close')!.addEventListener('click', closePlayer);
player.addEventListener('cancel', (e) => { e.preventDefault(); closePlayer(); });
player.addEventListener('click', (e) => { if (e.target === player) closePlayer(); });

document.addEventListener('astro:before-swap', () => { ctx?.revert(); ScrollTrigger.getAll().forEach((t) => t.kill()); });
document.addEventListener('astro:after-swap', () => lenis.scrollTo(0, { immediate: true }));
document.addEventListener('astro:page-load', initPage);
playIntro();
