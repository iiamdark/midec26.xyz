import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { sculpture } from './gl';

gsap.registerPlugin(ScrollTrigger);
const motion=matchMedia('(prefers-reduced-motion: reduce)');
const $$=<T extends Element=HTMLElement>(s:string,root:ParentNode=document)=>Array.from(root.querySelectorAll<T>(s));
const lenis=new Lenis({lerp:.09,smoothWheel:!motion.matches,anchors:true});
lenis.on('scroll',ScrollTrigger.update);
gsap.ticker.add(t=>lenis.raf(t*1000));
gsap.ticker.lagSmoothing(0);
let pageCleanup=()=>{};

function initPage(){
  pageCleanup();
  const reduced=motion.matches;
  const path=location.pathname.replace(/\/$/,'')||'/';
  $$<HTMLAnchorElement>('nav.top li a').forEach(a=>{
    const href=a.getAttribute('href')!;
    const active=href==='/'?path==='/':path.startsWith(href);
    if(active)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current');
  });
  const nav=document.querySelector<HTMLElement>('nav.top')!;
  const bar=document.querySelector<HTMLElement>('.scroll-progress');
  const syncScroll=()=>{nav.classList.toggle('solid',scrollY>35);if(bar)gsap.set(bar,{scaleX:scrollY/Math.max(1,document.documentElement.scrollHeight-innerHeight)});};
  syncScroll();window.addEventListener('scroll',syncScroll,{passive:true});
  let destroyGL=()=>{};
  const canvas=document.querySelector<HTMLCanvasElement>('[data-sculpture]');
  if(canvas)destroyGL=sculpture(canvas,reduced);
  const mm=gsap.matchMedia();
  const ctx=gsap.context(()=>{
    if(!reduced){
      $$('.split').forEach(el=>{
        if(el.dataset.split)return;
        el.dataset.split='1';
        // Work on text nodes to preserve emphasis and accessible labels.
        const walker=document.createTreeWalker(el,NodeFilter.SHOW_TEXT);
        const nodes:Text[]=[];while(walker.nextNode())nodes.push(walker.currentNode as Text);
        nodes.forEach(node=>{
          const fragment=document.createDocumentFragment();
          node.textContent!.split(/(\s+)/).forEach(word=>{
            if(!word.trim()){fragment.append(document.createTextNode(word));return;}
            const mask=document.createElement('span'),inner=document.createElement('span');
            mask.className='w';inner.textContent=word;mask.append(inner);fragment.append(mask);
          });node.replaceWith(fragment);
        });
      });
      gsap.from('.hero-enter',{y:30,opacity:0,duration:1.1,stagger:.1,ease:'power3.out',delay:.1,clearProps:'transform,opacity'});
      gsap.from('.hero-word',{yPercent:110,duration:1.3,ease:'power4.out',delay:.15});
      if(document.querySelector('.hero')){
        gsap.to('.hero-art',{yPercent:22,rotation:8,ease:'none',scrollTrigger:{trigger:'.hero',start:'top top',end:'bottom top',scrub:1}});
        gsap.to('.hero-copy',{y:-80,opacity:0,ease:'none',scrollTrigger:{trigger:'.hero',start:'top top',end:'65% top',scrub:1}});
        gsap.to('.hero-word',{yPercent:25,ease:'none',scrollTrigger:{trigger:'.hero',start:'top top',end:'bottom top',scrub:1}});
      }
      $$('.split').forEach(el=>gsap.from(el.querySelectorAll('.w>span'),{yPercent:110,duration:1,ease:'power4.out',stagger:.05,scrollTrigger:{trigger:el,start:'top 92%',once:true}}));
      $$('.reveal').forEach(el=>gsap.from(el,{y:30,opacity:0,duration:.9,ease:'power3.out',clearProps:'transform,opacity',scrollTrigger:{trigger:el,start:'top 94%',once:true}}));
      ScrollTrigger.batch('.pop',{start:'top 95%',once:true,onEnter:els=>gsap.fromTo(els,{y:40,opacity:0},{y:0,opacity:1,duration:.9,stagger:.07,ease:'power3.out',clearProps:'transform,opacity'})});
      $$<HTMLImageElement>('[data-parallax]').forEach(img=>gsap.fromTo(img,{yPercent:-8},{yPercent:0,ease:'none',scrollTrigger:{trigger:img.parentElement,start:'top bottom',end:'bottom top',scrub:true}}));
      $$('.lyric').forEach(el=>ScrollTrigger.create({trigger:el,start:'top 78%',end:'bottom 20%',toggleClass:'on'}));
      $$('[data-count]').forEach(el=>{
        const count={v:0};gsap.to(count,{v:Number(el.dataset.count)||0,duration:1.4,ease:'power2.out',scrollTrigger:{trigger:el,start:'top 95%',once:true},onUpdate:()=>{el.textContent=String(Math.round(count.v));}});
      });
    }else{$$('[data-count]').forEach(el=>{el.textContent=el.dataset.count||'0';});}
    mm.add('(min-width: 1000px) and (min-height: 720px) and (prefers-reduced-motion: no-preference)',()=>{
      const section=document.querySelector<HTMLElement>('.release-section');
      const rail=document.querySelector<HTMLElement>('.release-rail');
      const windowEl=document.querySelector<HTMLElement>('.release-window');
      if(!section||!rail||!windowEl)return;
      section.classList.add('is-pinned');
      const distance=()=>Math.max(0,rail.scrollWidth-windowEl.clientWidth);
      const tween=gsap.to(rail,{x:()=>-distance(),ease:'none',scrollTrigger:{trigger:section,start:'top top',end:()=>'+='+distance(),pin:true,scrub:.8,invalidateOnRefresh:true,anticipatePin:1}});
      const keyboard=(event:KeyboardEvent)=>{
        if(!['ArrowRight','ArrowLeft','Home','End'].includes(event.key))return;
        if(event.target!==windowEl)return;
        const st=tween.scrollTrigger!;
        const current=st.scroll();
        const next=event.key==='Home'?st.start:event.key==='End'?st.end:current+(event.key==='ArrowRight'?1:-1)*distance()/3;
        event.preventDefault();lenis.scrollTo(Math.max(st.start,Math.min(st.end,next)),{duration:.65});
      };
      windowEl.addEventListener('keydown',keyboard);
      return ()=>{windowEl.removeEventListener('keydown',keyboard);section.classList.remove('is-pinned');};
    });
  });
  const refresh=()=>{if(document.contains(nav)){lenis.resize();ScrollTrigger.refresh();syncScroll();}};
  const images=$$<HTMLImageElement>('img').filter(img=>!img.complete);
  images.forEach(img=>img.addEventListener('load',refresh,{once:true}));
  let active=true;document.fonts.ready.then(()=>{if(active)refresh();});
  refresh();
  pageCleanup=()=>{active=false;images.forEach(img=>img.removeEventListener('load',refresh));window.removeEventListener('scroll',syncScroll);mm.revert();ctx.revert();destroyGL();};
}

const player=document.querySelector<HTMLDialogElement>('dialog.player')!;
const frame=player.querySelector<HTMLElement>('.player-frame')!;
let opener:HTMLElement|null=null,closing=false;
function closePlayer(){
  if(!player.open||closing)return;closing=true;
  const finish=()=>{player.close();frame.replaceChildren();lenis.start();closing=false;opener?.focus({preventScroll:true});gsap.set(player,{clearProps:'all'});};
  if(motion.matches)finish();else gsap.to(player,{y:20,opacity:0,duration:.2,onComplete:finish});
}
function play(btn:HTMLElement){
  const [kind,id]=btn.dataset.play!.split(':');
  let src='';
  if(kind==='youtube'&&/^[\w-]{11}$/.test(id))src='https://www.youtube-nocookie.com/embed/'+id+'?autoplay=1&rel=0';
  if(kind==='spotify'&&/^[a-zA-Z0-9]+$/.test(id))src='https://open.spotify.com/embed/track/'+id+'?utm_source=generator&theme=0';
  if(kind==='instagram'&&/^[\w-]+$/.test(id))src='https://www.instagram.com/reel/'+id+'/embed/';
  if(!src)return;
  opener=btn;closing=false;gsap.killTweensOf(player);
  player.querySelector('.player-title')!.textContent=btn.dataset.title||'Reproductor';
  player.classList.toggle('is-spotify',kind==='spotify');player.classList.toggle('is-vertical',kind==='instagram');
  const iframe=document.createElement('iframe');iframe.src=src;iframe.title=btn.dataset.title||'Reproductor';
  iframe.allow='autoplay; clipboard-write; encrypted-media; picture-in-picture; fullscreen';iframe.allowFullscreen=true;
  frame.replaceChildren(iframe);lenis.stop();player.showModal();
  if(!motion.matches)gsap.fromTo(player,{y:35,opacity:0},{y:0,opacity:1,duration:.45,ease:'power3.out'});
}
player.querySelector('.player-close')!.addEventListener('click',closePlayer);
player.addEventListener('cancel',e=>{e.preventDefault();closePlayer();});
player.addEventListener('click',e=>{if(e.target!==player)return;const r=player.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)closePlayer();});

type AdsWindow=Window & {adsbygoogle?:unknown[];googlefc?:{callbackQueue?:unknown[];showRevocationMessage?:()=>void}};
const w=window as AdsWindow;
function toast(message:string){const el=document.createElement('div');el.className='toast';el.role='status';el.textContent=message;document.body.append(el);setTimeout(()=>el.remove(),6000);}
document.addEventListener('click',event=>{
  const target=event.target as Element;
  const btn=target.closest<HTMLElement>('[data-play]');if(btn)play(btn);
  if(!target.closest('.facade a')){
    const facade=target.closest<HTMLElement>('.facade');
    if(facade&&!facade.querySelector('iframe')){
      const iframe=document.createElement('iframe');iframe.src=facade.dataset.embedSrc||'';iframe.title=facade.dataset.embedTitle||'Reproductor';iframe.allow='autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture';iframe.allowFullscreen=true;
      facade.replaceChildren(iframe);facade.classList.remove('facade');ScrollTrigger.refresh();
    }
  }
  if(target.closest('[data-consent-open]')){
    let shown=false;w.googlefc=w.googlefc||{};w.googlefc.callbackQueue=w.googlefc.callbackQueue||[];
    w.googlefc.callbackQueue.push(()=>{shown=true;w.googlefc!.showRevocationMessage?.();});
    setTimeout(()=>{if(!shown)toast('El aviso de cookies aún se está activando. Mientras tanto no usamos cookies publicitarias personalizadas.');},1500);
  }
});
const themeBtn=document.querySelector<HTMLButtonElement>('.theme-toggle')!;
const syncTheme=()=>{
  const light=document.documentElement.dataset.theme==='light';
  themeBtn.ariaLabel=light?'Activar tema oscuro':'Activar tema claro';themeBtn.title=themeBtn.ariaLabel;themeBtn.setAttribute('aria-pressed',String(light));
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content',light?'#eaeae1':'#11120f');
};
themeBtn.addEventListener('click',()=>{
  if(document.documentElement.dataset.theme==='light')delete document.documentElement.dataset.theme;else document.documentElement.dataset.theme='light';
  try{localStorage.setItem('mk-theme-v2',document.documentElement.dataset.theme||'dark');}catch{}
  syncTheme();
});
document.addEventListener('astro:before-swap',event=>{
  pageCleanup();pageCleanup=()=>{};
  if(player.open){player.close();frame.replaceChildren();lenis.start();}
  const theme=document.documentElement.dataset.theme;
  if(theme)event.newDocument.documentElement.dataset.theme=theme;else delete event.newDocument.documentElement.dataset.theme;
});
document.addEventListener('astro:after-swap',syncTheme);
document.addEventListener('astro:page-load',()=>{
  initPage();syncTheme();
  $$('ins.adsbygoogle:not([data-adsbygoogle-status])').forEach(()=>{try{(w.adsbygoogle=w.adsbygoogle||[]).push({});}catch{}});
});
motion.addEventListener('change',()=>{lenis.options.smoothWheel=!motion.matches;initPage();});
syncTheme();initPage();
