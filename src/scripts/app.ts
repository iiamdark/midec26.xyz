import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);
const motion=matchMedia('(prefers-reduced-motion: reduce)');
const $$=<T extends Element=HTMLElement>(s:string,root:ParentNode=document)=>Array.from(root.querySelectorAll<T>(s));
const lenis=new Lenis({lerp:.09,smoothWheel:!motion.matches,anchors:true});
lenis.on('scroll',ScrollTrigger.update);
gsap.ticker.add(t=>lenis.raf(t*1000));
gsap.ticker.lagSmoothing(0);
let pageCleanup=()=>{};
const menu=document.querySelector<HTMLDialogElement>('#mobile-menu')!;
const menuToggle=document.querySelector<HTMLButtonElement>('.menu-toggle')!;
let menuClosing=false;
function syncScrollLock(){
  if(menu.open||document.querySelector<HTMLDialogElement>('dialog.player')?.open)lenis.stop();else lenis.start();
}
function closeMenu(restore=true,immediate=false){
  if(!menu.open)return;
  if(menuClosing&&!immediate)return;
  menuClosing=true;gsap.killTweensOf(menu);
  const finish=()=>{menu.close();menuClosing=false;menuToggle.setAttribute('aria-expanded','false');menuToggle.ariaLabel='Abrir menú';syncScrollLock();gsap.set(menu,{clearProps:'all'});if(restore)menuToggle.focus({preventScroll:true});};
  if(immediate||motion.matches)finish();else gsap.to(menu,{opacity:0,y:-12,duration:.2,onComplete:finish});
}
function openMenu(){
  if(menu.open){closeMenu();return;}
  menuClosing=false;menu.showModal();menuToggle.setAttribute('aria-expanded','true');menuToggle.ariaLabel='Cerrar menú';syncScrollLock();
  if(!motion.matches){gsap.fromTo(menu,{opacity:0,y:-15},{opacity:1,y:0,duration:.35,ease:'power3.out'});gsap.fromTo(menu.querySelectorAll('nav li a'),{y:50,opacity:0},{y:0,opacity:1,duration:.55,stagger:.045,ease:'power3.out',clearProps:'all'});}
}
menuToggle.addEventListener('click',openMenu);
menu.querySelector('.menu-close')!.addEventListener('click',()=>closeMenu());
menu.addEventListener('cancel',event=>{event.preventDefault();closeMenu();});
matchMedia('(min-width:701px)').addEventListener('change',event=>{if(event.matches)closeMenu(false,true);});


function initPage(){
  pageCleanup();
  const reduced=motion.matches;
  const journey=document.querySelector<HTMLElement>('[data-journey]');
  journey?.classList.toggle('has-motion',!reduced);
  const path=location.pathname.replace(/\/$/,'')||'/';
  $$<HTMLAnchorElement>('nav.top li a, .mobile-menu nav a').forEach(a=>{
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
  let active=true;
  if(canvas)void import('./gl').then(({sculpture})=>{if(active)destroyGL=sculpture(canvas,reduced);}).catch(()=>{});
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
      if(journey){
        const mask=journey.querySelector('.journey-mask');
        const timeline=gsap.timeline({defaults:{ease:'none'},scrollTrigger:{
          trigger:journey,start:'top top',end:'bottom bottom',scrub:true,
        }});
        timeline.fromTo('.planet-world',{scale:1},{scale:2.5,duration:1},0)
          .fromTo('.planet-sky',{yPercent:0},{yPercent:-20,duration:1},0)
          .fromTo(mask,{clipPath:'circle(0% at 60% 55%)'},{clipPath:'circle(115% at 60% 55%)',duration:.64},.36)
          .fromTo('.journey-mask span',{scale:.85,opacity:0},{scale:1,opacity:1,duration:.27},.73);
      }
      $$('.split').forEach(el=>gsap.from(el.querySelectorAll('.w>span'),{yPercent:110,duration:1,ease:'power4.out',stagger:.05,scrollTrigger:{trigger:el,start:'top 92%',once:true}}));
      $$('.reveal').forEach(el=>gsap.from(el,{y:30,opacity:0,duration:.9,ease:'power3.out',clearProps:'transform,opacity',scrollTrigger:{trigger:el,start:'top 94%',once:true}}));
      ScrollTrigger.batch('.pop',{start:'top 95%',once:true,onEnter:els=>gsap.fromTo(els,{y:40,opacity:0},{y:0,opacity:1,duration:.9,stagger:.07,ease:'power3.out',clearProps:'transform,opacity'})});
      $$<HTMLImageElement>('[data-parallax]').forEach(img=>gsap.fromTo(img,{yPercent:-8},{yPercent:0,ease:'none',scrollTrigger:{trigger:img.parentElement,start:'top bottom',end:'bottom top',scrub:true}}));
      $$('.lyric').forEach(el=>ScrollTrigger.create({trigger:el,start:'top 78%',end:'bottom 20%',toggleClass:'on'}));
      ScrollTrigger.batch('.lyrics .stanza',{
        start:'top 90%',once:true,
        onEnter:stanzas=>stanzas.forEach(stanza=>stanza.classList.add('stanza-entered')),
      });
      $$('.lyric-orbit').forEach(orbit=>gsap.to(orbit,{rotation:135,transformOrigin:'50% 50%',ease:'none',
        scrollTrigger:{trigger:orbit.closest('.lyrics-block'),start:'top 85%',end:'bottom bottom',scrub:true},
      }));
      $$('[data-count]').forEach(el=>{
        const count={v:0};gsap.to(count,{v:Number(el.dataset.count)||0,duration:1.4,ease:'power2.out',scrollTrigger:{trigger:el,start:'top 95%',once:true},onUpdate:()=>{el.textContent=String(Math.round(count.v));}});
      });
    }else{$$('[data-count]').forEach(el=>{el.textContent=el.dataset.count||'0';});}
  });
  const refresh=()=>{if(document.contains(nav)){lenis.resize();ScrollTrigger.refresh();syncScroll();}};
  const images=$$<HTMLImageElement>('img').filter(img=>!img.complete);
  images.forEach(img=>img.addEventListener('load',refresh,{once:true}));
  document.fonts.ready.then(()=>{if(active)refresh();});
  refresh();
  pageCleanup=()=>{active=false;images.forEach(img=>img.removeEventListener('load',refresh));window.removeEventListener('scroll',syncScroll);ctx.revert();destroyGL();};
}

const player=document.querySelector<HTMLDialogElement>('dialog.player')!;
const frame=player.querySelector<HTMLElement>('.player-frame')!;
type CatalogItem={source:string;title:string;image:string;context:string};
let catalog:CatalogItem[]=[];
try{catalog=JSON.parse(document.querySelector('#player-catalog')?.textContent||'[]');}catch{}
let opener:HTMLElement|null=null,closing=false,frameTimer=0;
function clearFrame(){
  clearTimeout(frameTimer);frame.replaceChildren();frame.classList.remove('is-loading');frame.setAttribute('aria-busy','false');
}
function closePlayer(){
  if(!player.open||closing)return;closing=true;gsap.killTweensOf(player);
  const finish=()=>{player.close();clearFrame();syncScrollLock();closing=false;opener?.focus({preventScroll:true});gsap.set(player,{clearProps:'all'});};
  if(motion.matches)finish();else gsap.to(player,{y:20,opacity:0,duration:.2,onComplete:finish});
}
function play(btn:HTMLElement){
  const source=btn.dataset.play!;
  const [kind,id]=source.split(':');
  let src='',external='',provider='';
  if(kind==='youtube'&&/^[\w-]{11}$/.test(id)){src='https://www.youtube-nocookie.com/embed/'+id+'?autoplay=1&rel=0';external='https://www.youtube.com/watch?v='+id;provider='YouTube';}
  if(kind==='spotify'&&/^[a-zA-Z0-9]+$/.test(id)){src='https://open.spotify.com/embed/track/'+id+'?utm_source=generator&theme=0';external='https://open.spotify.com/track/'+id;provider='Spotify';}
  if(kind==='instagram'&&/^[\w-]+$/.test(id)){src='https://www.instagram.com/reel/'+id+'/embed/';external='https://www.instagram.com/reel/'+id+'/';provider='Instagram';}
  if(!src)return;
  const item=catalog.find(song=>song.source===source);
  const title=btn.dataset.title||item?.title||'MARKHO';
  opener=btn;closing=false;gsap.killTweensOf(player);clearFrame();
  player.querySelector('.player-title')!.textContent=title;
  player.querySelector('.player-platform')!.textContent=provider+' / MARKHO';
  player.querySelector('.player-context')!.textContent=item?.context||(kind==='instagram'?'En movimiento / Reel':'Visual oficial');
  const art=player.querySelector<HTMLImageElement>('.player-art')!;
  const image=item?.image||(kind==='youtube'?'https://i.ytimg.com/vi/'+id+'/hqdefault.jpg':'');
  art.hidden=!image;art.onerror=()=>{art.hidden=true;};if(image)art.src=image;
  const link=player.querySelector<HTMLAnchorElement>('.player-external')!;link.href=external;link.ariaLabel='Abrir '+title+' en '+provider;link.title='Abrir en '+provider;
  const state=player.querySelector<HTMLElement>('.player-state')!;
  state.textContent='Conectando con '+provider+'…';
  player.classList.toggle('is-spotify',kind==='spotify');player.classList.toggle('is-vertical',kind==='instagram');
  const iframe=document.createElement('iframe');iframe.title=title+' en '+provider;iframe.allow='autoplay; clipboard-write; encrypted-media; picture-in-picture; fullscreen';iframe.allowFullscreen=true;
  iframe.addEventListener('load',()=>{
    if(!frame.contains(iframe))return;
    clearTimeout(frameTimer);frame.classList.remove('is-loading');frame.setAttribute('aria-busy','false');state.textContent='Reproductor de '+provider+' listo';
  },{once:true});
  frame.classList.add('is-loading');frame.setAttribute('aria-busy','true');frame.append(iframe);
  iframe.src=src;
  frameTimer=window.setTimeout(()=>{frame.classList.remove('is-loading');frame.setAttribute('aria-busy','false');state.textContent='¿Tarda en cargar? Abre en '+provider+' ↗';},8000);
  if(!player.open)player.showModal();syncScrollLock();
  if(!motion.matches)gsap.fromTo(player,{y:28,scale:.98,opacity:0},{y:0,scale:1,opacity:1,duration:.4,ease:'power3.out'});
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
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content',light?'#f6e9eb':'#100d10');
};
themeBtn.addEventListener('click',()=>{
  if(document.documentElement.dataset.theme==='light')delete document.documentElement.dataset.theme;else document.documentElement.dataset.theme='light';
  try{localStorage.setItem('mk-theme-v2',document.documentElement.dataset.theme||'dark');}catch{}
  syncTheme();
});
motion.addEventListener('change',()=>{lenis.options.smoothWheel=!motion.matches;initPage();});
syncTheme();initPage();
document.querySelectorAll('ins.adsbygoogle:not([data-adsbygoogle-status])').forEach(()=>{try{(w.adsbygoogle=w.adsbygoogle||[]).push({});}catch{}});
