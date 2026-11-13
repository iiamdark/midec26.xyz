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
const entry=document.querySelector<HTMLDialogElement>('#entry-intro')!;
const menu=document.querySelector<HTMLDialogElement>('#mobile-menu')!;
const menuToggle=document.querySelector<HTMLButtonElement>('.menu-toggle')!;
const curtain=document.querySelector<HTMLElement>('.route-curtain')!;
let entryComplete=!document.documentElement.classList.contains('entry-pending');
let entryTimeline:gsap.core.Timeline|undefined;
let menuClosing=false;
function syncScrollLock(){
  if(entry.open||menu.open||document.querySelector<HTMLDialogElement>('dialog.player')?.open)lenis.stop();else lenis.start();
}
function finishEntry(){
  if(entryComplete)return;
  entryComplete=true;entryTimeline?.kill();
  try{sessionStorage.setItem('mk-entry-v1','1');}catch{}
  if(entry.open)entry.close();
  document.documentElement.classList.remove('entry-pending');
  gsap.set([entry,...entry.querySelectorAll('.entry-arrow,.entry-word,.entry-top,.entry-bottom')],{clearProps:'all'});
  syncScrollLock();
  document.dispatchEvent(new Event('mk:entry-complete'));
}
function runEntry(){
  if(entryComplete)return;
  if(motion.matches){finishEntry();return;}
  try{entry.showModal();}catch{finishEntry();return;}
  syncScrollLock();
  entryTimeline=gsap.timeline({onComplete:finishEntry})
    .from('.entry-top,.entry-bottom',{opacity:0,duration:.24},0)
    .fromTo('.entry-arrow',{x:-35,y:35,scale:.7,opacity:0},{x:0,y:0,scale:1,opacity:1,duration:.48,ease:'power3.out'},0)
    .from('.entry-word',{y:20,opacity:0,duration:.35,ease:'power3.out'},.18)
    .to('.entry-arrow',{x:-13,y:13,scale:.95,duration:.16,ease:'power2.in'},.57)
    .to('.entry-arrow',{x:()=>innerWidth*.28,y:()=>-innerHeight*.3,scale:15,duration:.6,ease:'power3.in'},.73)
    .to('.entry-word,.entry-top,.entry-bottom',{opacity:0,duration:.2},.82)
    .to(entry,{opacity:0,duration:.38,ease:'power2.inOut'},1);
}
entry.querySelector('.entry-skip')!.addEventListener('click',finishEntry);
entry.addEventListener('cancel',event=>{event.preventDefault();finishEntry();});
document.addEventListener('mk:intro-timeout',finishEntry);

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
let routeSafety=0;
function revealRoute(){
  clearTimeout(routeSafety);gsap.killTweensOf(curtain);
  const finish=()=>{gsap.set(curtain,{visibility:'hidden',pointerEvents:'none'});};
  if(motion.matches)finish();else gsap.to(curtain,{yPercent:-100,duration:.38,ease:'power3.inOut',onComplete:finish});
}
document.addEventListener('astro:before-preparation',event=>{
  closeMenu(false,true);
  if(motion.matches||entry.open)return;
  const originalLoader=event.loader;
  event.loader=async()=>{
    gsap.killTweensOf(curtain);gsap.set(curtain,{yPercent:100,visibility:'visible',pointerEvents:'auto'});
    const cover=new Promise<void>(resolve=>{gsap.to(curtain,{yPercent:0,duration:.24,ease:'power3.inOut',onComplete:resolve,onInterrupt:resolve});});
    clearTimeout(routeSafety);routeSafety=window.setTimeout(revealRoute,5000);
    try{await Promise.all([originalLoader(),cover]);}catch(error){revealRoute();throw error;}
  };
});
document.addEventListener('astro:page-load',revealRoute);


function initPage(){
  pageCleanup();
  const reduced=motion.matches;
  let heroReady=()=>{};
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
  if(canvas)destroyGL=sculpture(canvas,reduced);
  const galleryWindow=document.querySelector<HTMLElement>('.release-window');
  const galleryRail=document.querySelector<HTMLElement>('.release-rail');
  const galleryProgress=document.querySelector<HTMLElement>('.gallery-progress');
  const galleryFill=galleryProgress?.querySelector<HTMLElement>('span');
  const galleryCurrent=document.querySelector<HTMLElement>('[data-gallery-current]');
  const galleryButtons=$<HTMLButtonElement>('[data-release-index]');
  let pinnedGallery:ScrollTrigger|undefined;
  let galleryIndex=-1;
  const updateGallery=(progress:number)=>{
    const clamped=Math.max(0,Math.min(1,progress));
    if(galleryFill)galleryFill.style.transform='scaleX('+(.25+clamped*.75)+')';
    const index=Math.min(3,Math.round(clamped*3));
    if(index===galleryIndex)return;
    galleryIndex=index;
    if(galleryCurrent)galleryCurrent.textContent=String(index+1).padStart(2,'0');
    galleryProgress?.setAttribute('aria-valuenow',String(index+1));
    galleryButtons.forEach((button,i)=>{if(i===index)button.setAttribute('aria-current','true');else button.removeAttribute('aria-current');});
  };
  const galleryScroll=()=>{if(!pinnedGallery&&galleryWindow)updateGallery(galleryWindow.scrollLeft/Math.max(1,galleryWindow.scrollWidth-galleryWindow.clientWidth));};
  const galleryGo=(event:Event)=>{
    const button=event.currentTarget as HTMLButtonElement;
    const fraction=Number(button.dataset.releaseIndex)/3;
    if(pinnedGallery){lenis.scrollTo(pinnedGallery.start+(pinnedGallery.end-pinnedGallery.start)*fraction,{duration:reduced?0:.7,immediate:reduced});}
    else if(galleryWindow)galleryWindow.scrollTo({left:(galleryWindow.scrollWidth-galleryWindow.clientWidth)*fraction,behavior:reduced?'instant':'smooth'});
  };
  galleryButtons.forEach(button=>button.addEventListener('click',galleryGo));
  galleryWindow?.addEventListener('scroll',galleryScroll,{passive:true});
  updateGallery(0);
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
      if(document.querySelector('.hero')){
        const enter=gsap.timeline({paused:!entryComplete})
          .from('.hero-word',{yPercent:105,opacity:0,duration:1.05,ease:'power4.out',clearProps:'opacity'},0)
          .from('.hero-enter',{y:28,opacity:0,duration:.85,stagger:.08,ease:'power3.out',clearProps:'transform,opacity'},.16);
        heroReady=()=>{enter.play();};
        document.addEventListener('mk:entry-complete',heroReady,{once:true});
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
      const tween=gsap.to(rail,{x:()=>-distance(),ease:'none',scrollTrigger:{trigger:section,start:'top top',end:()=>'+='+distance(),pin:true,scrub:.8,invalidateOnRefresh:true,anticipatePin:1,onUpdate:self=>updateGallery(self.progress)}});
      pinnedGallery=tween.scrollTrigger;galleryScroll();
      const keyboard=(event:KeyboardEvent)=>{
        if(!['ArrowRight','ArrowLeft','Home','End'].includes(event.key))return;
        if(event.target!==windowEl)return;
        const st=tween.scrollTrigger!;
        const current=st.scroll();
        const next=event.key==='Home'?st.start:event.key==='End'?st.end:current+(event.key==='ArrowRight'?1:-1)*distance()/3;
        event.preventDefault();lenis.scrollTo(Math.max(st.start,Math.min(st.end,next)),{duration:.65});
      };
      windowEl.addEventListener('keydown',keyboard);
      return ()=>{pinnedGallery=undefined;windowEl.removeEventListener('keydown',keyboard);section.classList.remove('is-pinned');galleryScroll();};
    });
  });
  const refresh=()=>{if(document.contains(nav)){lenis.resize();ScrollTrigger.refresh();syncScroll();}};
  const images=$$<HTMLImageElement>('img').filter(img=>!img.complete);
  images.forEach(img=>img.addEventListener('load',refresh,{once:true}));
  let active=true;document.fonts.ready.then(()=>{if(active)refresh();});
  refresh();
  pageCleanup=()=>{active=false;document.removeEventListener('mk:entry-complete',heroReady);galleryButtons.forEach(button=>button.removeEventListener('click',galleryGo));galleryWindow?.removeEventListener('scroll',galleryScroll);images.forEach(img=>img.removeEventListener('load',refresh));window.removeEventListener('scroll',syncScroll);mm.revert();ctx.revert();destroyGL();};
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
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content',light?'#eaeae1':'#11120f');
};
themeBtn.addEventListener('click',()=>{
  if(document.documentElement.dataset.theme==='light')delete document.documentElement.dataset.theme;else document.documentElement.dataset.theme='light';
  try{localStorage.setItem('mk-theme-v2',document.documentElement.dataset.theme||'dark');}catch{}
  syncTheme();
});
document.addEventListener('astro:before-swap',event=>{
  pageCleanup();pageCleanup=()=>{};
  if(player.open){gsap.killTweensOf(player);player.close();clearFrame();closing=false;gsap.set(player,{clearProps:'all'});}closeMenu(false,true);syncScrollLock();
  const theme=document.documentElement.dataset.theme;
  if(theme)event.newDocument.documentElement.dataset.theme=theme;else delete event.newDocument.documentElement.dataset.theme;
});
document.addEventListener('astro:after-swap',()=>{syncTheme();syncScrollLock();});
document.addEventListener('astro:page-load',()=>{
  initPage();syncTheme();
  $$('ins.adsbygoogle:not([data-adsbygoogle-status])').forEach(()=>{try{(w.adsbygoogle=w.adsbygoogle||[]).push({});}catch{}});
});
motion.addEventListener('change',()=>{if(motion.matches){finishEntry();revealRoute();}lenis.options.smoothWheel=!motion.matches;initPage();});
runEntry();syncTheme();initPage();
