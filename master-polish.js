(()=>{
'use strict';
if(window.__printProfitMasterPolish)return;
window.__printProfitMasterPolish=true;

const orange='#ff7800';

const navIcons={
 calculate:'<svg viewBox="0 0 48 48" aria-hidden="true"><rect x="10" y="5" width="28" height="38" rx="4"/><path d="M16 12h16v7H16zM16 25h5m6 0h5M16 32h5m6 0h5M16 39h5m6 0h5"/></svg>',
 price:'<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M6 20 24 7l18 13-18 13L6 20Z"/><path d="M24 33v9"/><path d="M14 14v17l10 7 10-7V14"/></svg>',
 profit:'<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M7 41V7"/><path d="M7 41h35"/><rect x="13" y="27" width="6" height="10" rx="1"/><rect x="23" y="20" width="6" height="17" rx="1"/><rect x="33" y="12" width="6" height="25" rx="1"/></svg>',
 settings:'<svg viewBox="0 0 48 48" aria-hidden="true"><path d="m24 5 3 4 5 1 3-2 5 5-2 3 1 5 4 3v6l-4 3-1 5 2 3-5 5-3-2-5 1-3 4h-6l-3-4-5-1-3 2-5-5 2-3-1-5-4-3v-6l4-3 1-5-2-3 5-5 3 2 5-1 3-4Z"/><circle cx="24" cy="24" r="7"/></svg>'
};

const featureIcons={
 costs:'<svg viewBox="0 0 48 48" aria-hidden="true"><rect x="11" y="5" width="26" height="38" rx="4"/><path d="M16 12h16v7H16zM16 25h5m6 0h5M16 32h5m6 0h5M16 39h5m6 0h5"/></svg>',
 price:'<svg viewBox="0 0 48 48" aria-hidden="true"><path d="m24 6 16 10-16 10L8 16 24 6Z"/><path d="M8 16v16l16 10 16-10V16"/><path d="M24 26v16"/></svg>',
 profit:'<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M7 41V7"/><path d="M7 41h35"/><path d="m12 33 8-9 6 5 10-14"/><path d="M31 15h6v6"/></svg>',
 makers:'<svg viewBox="0 0 48 48" aria-hidden="true"><path d="m24 6 3 4 5 1 3 4 5-1v7l4 3-4 3v7l-5-1-3 4-5 1-3 4-3-4-5-1-3-4-5 1v-7l-4-3 4-3v-7l5 1 3-4 5-1Z"/><circle cx="24" cy="24" r="6"/></svg>'
};

function iconWrap(svg,small=false){
 return '<span class="pp-master-icon'+(small?' small':'')+'">'+svg+'</span>';
}

function makeNav(header){
 const nav=header?.querySelector('.nav');
 if(!nav)return;
 nav.innerHTML='';
 const items=[
  ['calculate','Calculate a print','details'],
  ['price','Price your prints','machine'],
  ['profit','Profit','results'],
  ['settings','Settings','costs']
 ];
 items.forEach(([key,label,target],idx)=>{
  const a=document.createElement('a');
  a.href='#ppTabbedLayout';
  a.className=idx===0?'active':'';
  a.dataset.masterNav=target;
  a.innerHTML=iconWrap(navIcons[key])+'<span>'+label+'</span>';
  a.addEventListener('click',e=>{
   e.preventDefault();
   const workspace=document.getElementById('ppTabbedLayout');
   if(target==='results'){
    document.querySelector('.layout>.result')?.scrollIntoView({behavior:'smooth',block:'start'});
    return;
   }
   const tab=document.querySelector('.pp-tab[data-tab="'+target+'"]');
   if(tab)tab.click();
   workspace?.scrollIntoView({behavior:'smooth',block:'start'});
  });
  nav.appendChild(a);
 });
}

function heroCard(){
 const card=document.querySelector('.pp-hero-brand-card');
 if(!card)return;
 const img=card.querySelector('img');
 if(!img)return;
 img.src='./assets/printprofit-master-orange.svg?v=1';
 img.alt='PrintProfit';
 img.className='pp-master-hero-logo';
}

function addFeatureStrip(hero){
 if(hero.querySelector('.pp-master-feature-strip'))return;
 const strip=document.createElement('div');
 strip.className='pp-master-feature-strip';
 strip.innerHTML=[
  ['costs','Calculate','Costs'],
  ['price','Price','Your Prints'],
  ['profit','Maximise','Profit'],
  ['makers','Built','For Makers']
 ].map(([k,a,b])=>'<div class="pp-master-feature">'+iconWrap(featureIcons[k],true)+'<span><b>'+a+'</b><small>'+b+'</small></span></div>').join('<i class="pp-master-divider"></i>');
 hero.appendChild(strip);
}

function moveTicker(hero){
 const ticker=hero.querySelector('.pp-chosen-ticker');
 if(!ticker)return;
 if(ticker.parentElement!==hero.parentElement || !ticker.classList.contains('pp-master-subnav')){
  const shell=hero.parentElement;
  shell.insertBefore(ticker,hero.nextSibling);
 }
 ticker.classList.add('pp-master-subnav');
 ticker.innerHTML='<span>PRINTER PROFILES</span><span>MATERIALS &amp; FILAMENTS</span><span>DELIVERY &amp; FEES</span><span>CALCULATE <b>•</b> PRICE <b>•</b> PROFIT</span>';
}

function addQuickCards(main){
 if(!main || document.getElementById('pp-master-quickcards'))return;
 const wrap=document.createElement('section');
 wrap.id='pp-master-quickcards';
 wrap.className='pp-master-quickcards';
 wrap.innerHTML=''
  +'<button type="button" data-master-open="machine"><span class="pp-master-card-icon">'+featureIcons.price+'</span><span><b>Printer Profile</b><small>Select your printer to get started</small></span></button>'
  +'<button type="button" data-master-open="machine"><span class="pp-master-card-icon spool">'+featureIcons.costs+'</span><span><b>Filament &amp; Material</b><small>Set your material costs</small></span></button>'
  +'<button type="button" data-master-open="costs"><span class="pp-master-card-icon">'+featureIcons.profit+'</span><span><b>Costs &amp; Fees</b><small>Add your business costs</small></span></button>';
 main.insertBefore(wrap,main.querySelector('.layout'));
 wrap.querySelectorAll('[data-master-open]').forEach(btn=>btn.addEventListener('click',()=>{
  const target=btn.dataset.masterOpen;
  const tab=document.querySelector('.pp-tab[data-tab="'+target+'"]');
  if(tab)tab.click();
  /* Deliberately do not scroll. Journey cards only switch the calculator stage. */
 }));
}

function install(){
 const header=document.querySelector('.header');
 const hero=document.querySelector('.hero');
 const main=document.querySelector('.main');
 if(!header||!hero||!main)return false;

 makeNav(header);
 heroCard();
 addFeatureStrip(hero);
 moveTicker(hero);
 addQuickCards(main);

 document.getElementById('ppMasterPolishStyles')?.remove();
 const style=document.createElement('style');
 style.id='ppMasterPolishStyles';
 style.textContent=`
:root{--master-orange:#ff7800;--master-orange-2:#ff9a42;--master-bg:#06121b;--master-bg2:#0b1e2a;--master-line:#254556;--master-text:#f5f8fb;--master-muted:#94a9b6}
.header{height:88px!important;min-height:88px!important;padding:8px clamp(18px,4vw,66px)!important;background:linear-gradient(180deg,#061019f5,#07131bf2)!important;border-bottom:1px solid #284553!important;box-shadow:0 14px 38px #0009!important}
.header:after{background:linear-gradient(90deg,transparent,var(--master-orange),var(--master-orange-2),var(--master-orange),transparent)!important;box-shadow:0 0 18px #ff780066!important}
.header .brand{width:min(410px,32vw)!important;min-width:0!important;height:70px!important}
.header .brand img{width:100%!important;max-height:68px!important;object-fit:contain!important;object-position:left center!important}
.header .nav{gap:8px!important;align-items:center!important}
.header .nav a{display:inline-flex!important;align-items:center!important;gap:8px!important;color:#dce7ec!important;padding:12px 14px!important;border-radius:10px!important;font-size:13px!important;font-weight:800!important;white-space:nowrap!important}
.header .nav a:hover,.header .nav a.active{background:#ff780014!important;color:#fff!important}
.header .nav a.active:after{background:var(--master-orange)!important;box-shadow:0 0 12px #ff780088!important}
.pp-master-icon{width:24px!important;height:24px!important;display:inline-grid!important;place-items:center!important;color:var(--master-orange)!important}
.pp-master-icon svg{width:100%!important;height:100%!important;fill:none!important;stroke:currentColor!important;stroke-width:2.1!important;stroke-linecap:round!important;stroke-linejoin:round!important;filter:drop-shadow(0 0 6px #ff780044)!important}
.header .mode{color:#dce7ec!important}.header .mode input:checked{background:var(--master-orange)!important;border-color:var(--master-orange)!important;box-shadow:0 0 18px #ff780044!important}.header .mode input:checked:after{left:24px!important}

.hero.pp-chosen-hero,.hero{height:450px!important;min-height:450px!important;background:radial-gradient(700px 380px at 70% 46%,#ff780012 0,transparent 65%),radial-gradient(700px 320px at 18% 50%,#1c4a6714 0,transparent 65%),linear-gradient(135deg,#06111a 0%,#0a1f2d 52%,#02070b 100%)!important;border-bottom:1px solid #294957!important}
.pp-chosen-stage{padding:35px clamp(28px,7vw,90px) 94px!important;grid-template-columns:minmax(0,1.05fr) minmax(390px,.95fr)!important;gap:38px!important}
.pp-kicker{color:var(--master-orange)!important}.pp-kicker span{background:linear-gradient(90deg,var(--master-orange),transparent)!important}
.pp-hero-copy2 h1{font-size:clamp(49px,5vw,76px)!important;letter-spacing:-.055em!important;line-height:.92!important}.pp-hero-copy2 h1 strong{color:var(--master-orange)!important;text-shadow:0 0 34px #ff780022!important}
.pp-hero-copy2 p{max-width:660px!important;color:#adbec7!important;font-size:16px!important}
.pp-main-cta{background:linear-gradient(135deg,var(--master-orange-2),var(--master-orange))!important;box-shadow:0 13px 30px #ff780033!important}.pp-ghost-cta{border-color:#405a67!important;background:#091721c9!important}.pp-ghost-cta:hover{border-color:#ff780066!important;background:#ff780010!important}
.pp-hero-brand-card{width:min(510px,100%)!important;aspect-ratio:1.23!important;border-color:#315261!important;background:linear-gradient(145deg,#0c1d27f0,#07131bef)!important;box-shadow:inset 0 1px 0 #fff08,0 28px 70px #000b,0 0 0 1px #ff78000c!important;transform:perspective(1000px) rotateY(-3deg) rotateX(1deg)!important}
.pp-hero-brand-card:before{background:linear-gradient(125deg,#ff780010,transparent 45%,#ff780008)!important}.pp-card-glow{background:#ff780012!important}
.pp-hero-brand-card img.pp-master-hero-logo{width:90%!important;max-width:455px!important;filter:drop-shadow(0 12px 26px #000e)!important}
.pp-card-caption i{background:var(--master-orange)!important;box-shadow:0 0 8px #ff7800!important}
.pp-chosen-ticker.pp-master-subnav{position:relative!important;left:auto!important;right:auto!important;bottom:auto!important;z-index:20!important;height:66px!important;margin:0!important;padding:0 clamp(22px,6vw,80px)!important;display:grid!important;grid-template-columns:repeat(4,1fr)!important;align-items:center!important;border-top:1px solid var(--master-orange)!important;border-bottom:1px solid var(--master-orange)!important;background:linear-gradient(180deg,#07131c,#061018)!important}
.pp-chosen-ticker.pp-master-subnav span{color:#d7e1e6!important;font-size:11px!important;font-weight:850!important;letter-spacing:.11em!important;text-align:center!important;white-space:nowrap!important}.pp-chosen-ticker.pp-master-subnav span+span{border-left:1px solid #284351!important}.pp-chosen-ticker.pp-master-subnav b{color:var(--master-orange)!important;margin:0 8px!important}
.pp-master-feature-strip{position:absolute!important;left:clamp(30px,7vw,90px)!important;right:clamp(30px,7vw,90px)!important;bottom:12px!important;height:66px!important;z-index:25!important;display:flex!important;align-items:center!important;justify-content:center!important;gap:26px!important;border-top:1px solid #38515d!important;padding-top:9px!important}
.pp-master-feature{display:flex!important;align-items:center!important;gap:10px!important;min-width:170px!important}.pp-master-feature>span:last-child{display:flex!important;flex-direction:column!important;line-height:1.1!important}.pp-master-feature b{font-size:13px!important;color:#f3f7f9!important}.pp-master-feature small{margin-top:4px!important;font-size:9px!important;color:#8fa5b2!important;letter-spacing:.02em!important}.pp-master-divider{width:1px!important;height:46px!important;background:#284451!important;display:block!important}
.pp-master-icon.small{width:36px!important;height:36px!important;border-radius:10px!important}.pp-master-icon.small svg{width:28px!important;height:28px!important;stroke-width:2!important}
.pp-master-quickcards{display:grid!important;grid-template-columns:repeat(3,1fr)!important;gap:16px!important;margin:20px auto 14px!important;max-width:1480px!important;padding:0 clamp(10px,2vw,28px)!important}
.pp-master-quickcards button{display:flex!important;align-items:center!important;gap:14px!important;text-align:left!important;padding:17px 18px!important;background:linear-gradient(180deg,#0b1c27,#081720)!important;border:1px solid #284654!important;border-radius:14px!important;color:#fff!important;cursor:pointer!important;box-shadow:inset 0 1px 0 #fff06,0 10px 28px #0006!important;transition:transform .2s ease,border-color .2s ease,box-shadow .2s ease!important}
.pp-master-quickcards button:hover{transform:translateY(-3px)!important;border-color:#ff780077!important;box-shadow:inset 0 1px 0 #fff08,0 16px 32px #0008,0 0 22px #ff780012!important}
.pp-master-card-icon{width:60px!important;height:60px!important;min-width:60px!important;border-radius:50%!important;border:2px solid #ff780088!important;display:grid!important;place-items:center!important;color:var(--master-orange)!important;background:radial-gradient(circle,#ff780012,#08151e)!important;box-shadow:0 0 24px #ff78000f!important}.pp-master-card-icon svg{width:31px!important;height:31px!important;fill:none!important;stroke:currentColor!important;stroke-width:2!important;stroke-linecap:round!important;stroke-linejoin:round!important}.pp-master-quickcards button b{display:block!important;font-size:16px!important}.pp-master-quickcards button small{display:block!important;margin-top:5px!important;color:#92a8b4!important;font-size:11px!important}
.pp-master-quickcards+.layout{padding-top:2px!important}
/* Keep the calculator's existing tab workspace, but make its chrome match the master design. */
.pp-tabs{border-color:#294855!important;background:linear-gradient(180deg,#0a1b25,#08151c)!important}.pp-tab.active{background:linear-gradient(180deg,#ff780018,#ff780008)!important;color:#fff!important}.pp-tab.active::after{background:var(--master-orange)!important}.pp-tab-icon{color:var(--master-orange)!important;background:#ff780012!important;border-color:#ff780044!important}
.panel{border-color:#294755!important;background:linear-gradient(180deg,#0b1c26,#081720)!important}.panel .head .icon{background:linear-gradient(145deg,#ff9a3d,#ff7800)!important;box-shadow:0 8px 20px #ff780022!important}
input:focus,select:focus{border-color:var(--master-orange)!important;box-shadow:0 0 0 2px #ff780014!important}.btn.accent,.tab.active,.quick .btn.active{background:linear-gradient(135deg,#ff9a3d,#ff7800)!important;border-color:var(--master-orange)!important;box-shadow:0 8px 20px #ff780022!important}.drop{border-color:var(--master-orange)!important}.drop:hover{background:#ff78000c!important}#deliveryRateOut{color:var(--master-orange)!important}
@media(max-width:1050px){.header .brand{width:350px!important}.pp-chosen-stage{grid-template-columns:1fr 370px!important;padding-left:40px!important;padding-right:40px!important}.pp-hero-brand-card{width:370px!important}.pp-master-feature{min-width:140px!important}.pp-master-feature-strip{gap:14px!important}.pp-master-quickcards{gap:10px!important}}
@media(max-width:820px){.header{height:auto!important;min-height:102px!important}.header .brand{width:290px!important;height:58px!important}.header .nav{overflow:auto!important;justify-content:flex-start!important}.hero.pp-chosen-hero,.hero{height:590px!important;min-height:590px!important}.pp-chosen-stage{grid-template-columns:1fr!important;align-items:start!important;padding:28px 24px 108px!important}.pp-hero-brand-card{justify-self:center!important;width:min(460px,88vw)!important;transform:none!important}.pp-master-feature-strip{left:20px!important;right:20px!important;height:74px!important;gap:10px!important}.pp-master-feature{min-width:0!important;flex:1!important;justify-content:center!important}.pp-master-feature b{font-size:11px!important}.pp-master-feature small{font-size:8px!important}.pp-master-divider{height:36px!important}.pp-master-icon.small{width:31px!important;height:31px!important}.pp-master-icon.small svg{width:23px!important;height:23px!important}.pp-chosen-ticker.pp-master-subnav{height:auto!important;min-height:64px!important;grid-template-columns:repeat(2,1fr)!important;padding:9px 15px!important;gap:9px!important}.pp-chosen-ticker.pp-master-subnav span+span{border-left:0!important}.pp-master-quickcards{grid-template-columns:1fr!important;padding:0 16px!important}.pp-master-quickcards button{padding:14px!important}.pp-master-card-icon{width:52px!important;height:52px!important;min-width:52px!important}}
@media(max-width:560px){.header .brand{width:240px!important}.header .brand img{max-height:52px!important}.header .nav a{padding:9px 10px!important;font-size:11px!important}.header .mode{font-size:10px!important}.hero.pp-chosen-hero,.hero{height:610px!important;min-height:610px!important}.pp-hero-copy2 h1{font-size:43px!important}.pp-hero-copy2 p{font-size:14px!important}.pp-hero-buttons{flex-wrap:wrap!important}.pp-hero-brand-card{width:92vw!important}.pp-master-feature-strip{height:82px!important}.pp-master-feature b{font-size:9px!important}.pp-master-feature small{display:none!important}.pp-master-divider{height:30px!important}.pp-chosen-ticker.pp-master-subnav{grid-template-columns:1fr!important}.pp-master-quickcards{margin-top:14px!important;padding:0 10px!important}.pp-master-quickcards button b{font-size:14px!important}}
@media(prefers-reduced-motion:reduce){.pp-hero-brand-card,.pp-master-quickcards button{transition:none!important}}
`;
 document.head.appendChild(style);
 return true;
}

function wait(){
 if(install())return;
 const started=Date.now();
 const timer=setInterval(()=>{if(install()||Date.now()-started>15000)clearInterval(timer)},50);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',wait,{once:true});else wait();
})();