(()=>{
'use strict';
if(window.__printProfitSiteFinalPolish)return;window.__printProfitSiteFinalPolish=true;
function install(){
 const header=document.querySelector('.header');
 const hero=document.querySelector('.hero');
 if(!header||!hero)return false;
 const master='./assets/printprofit-reference-header-logo.png?v=4';
 const brand=header.querySelector('.brand');
 if(brand){
  const img=brand.querySelector('img');
  if(img){img.src=master;img.removeAttribute('data-src');img.alt='PrintProfit — 3D Printing Cost & Pricing Calculator';}
 }
 const card=hero.querySelector('.pp-hero-brand-card img');
 if(card){card.src=master;card.alt='PrintProfit — 3D Printing Cost & Pricing Calculator';}
 hero.querySelectorAll(':scope > img').forEach(img=>img.style.display='none');
 hero.querySelectorAll('.pp-hero-art').forEach(art=>{
  art.style.display='none';
  art.setAttribute('aria-hidden','true');
 });
 const style=document.getElementById('ppSiteFinalPolishStyles')||document.createElement('style');
 style.id='ppSiteFinalPolishStyles';
 style.textContent=`
:root{--ppb:#ff7800!important;--ppb2:#ff9b42!important;--accent:#ff7800!important}
.header,.header.pp-pretty-header{background:rgba(3,9,14,.96)!important;border-bottom-color:#27414e!important}
.header:after,.header.pp-pretty-header:after{background:linear-gradient(90deg,transparent,#ff7800,#ff9b42,#ff7800,transparent)!important;box-shadow:0 0 18px #ff780055!important}
.header .brand,.header.pp-pretty-header .brand{width:min(410px,34vw)!important;height:64px!important;overflow:visible!important}
.header .brand .pp-chosen-brand-logo{width:410px!important;height:82px!important;max-width:none!important;max-height:none!important;object-fit:contain!important;object-position:left center!important;display:block!important;filter:drop-shadow(0 4px 14px #000c)!important}
.header .nav a.active,.header .nav a:hover{background:#ff780014!important;color:#fff!important}
.header .nav a:after{background:linear-gradient(90deg,#ff7800,#ff9b42)!important;box-shadow:0 0 12px #ff780070!important}
.header .mode input:checked{background:linear-gradient(90deg,#ff7800,#ff9b42)!important;border-color:#ff7800!important;box-shadow:0 0 16px #ff780033!important}
.hero.pp-chosen-hero,.hero{height:390px!important;min-height:390px!important;background:radial-gradient(560px 300px at 76% 45%,#ff78000d 0,transparent 63%),radial-gradient(620px 260px at 14% 48%,#ff780008 0,transparent 65%),linear-gradient(135deg,#06111a 0%,#0a1b26 49%,#02080d 100%)!important}
.hero.pp-chosen-hero:after,.hero:after{background:linear-gradient(90deg,transparent,#ff7800,#ff9b42,#ff7800,transparent)!important;box-shadow:0 0 22px #ff780055!important}
.hero .pp-hero-art{display:none!important}
.pp-chosen-stage{grid-template-columns:minmax(0,1.08fr) minmax(430px,.92fr)!important;gap:34px!important;padding:30px clamp(28px,7vw,110px) 76px!important}
.pp-hero-copy2{max-width:760px!important}
.pp-hero-copy2 h1{font-size:clamp(45px,4.7vw,72px)!important}
.pp-hero-copy2 h1 strong{color:#ff7800!important;text-shadow:0 0 36px #ff780025!important}
.pp-kicker{color:#ff7800!important}
.pp-kicker span{background:linear-gradient(90deg,#ff7800,transparent)!important}
.pp-hero-buttons .pp-main-cta{background:linear-gradient(135deg,#ff7800,#ff8f1f)!important;box-shadow:0 12px 28px #ff78002b!important}
.pp-ghost-cta:hover{border-color:#ff780066!important;background:#ff78000d!important}
.pp-hero-brand-card{width:min(500px,100%)!important;aspect-ratio:1.35!important;transform:none!important;border-color:#2a4a5c!important}
.pp-hero-brand-card img{width:90%!important;max-height:86%!important;object-fit:contain!important}
.pp-card-caption i{background:#ff7800!important;box-shadow:0 0 8px #ff7800!important}
.pp-chosen-ticker{border-top-color:#294553!important}
.pp-chosen-ticker span+span{border-left-color:#294553!important}
.pp-chosen-ticker .pp-feature-item svg{stroke:#ff7800!important}
@media(max-width:1050px){.header .brand{width:330px!important}.pp-chosen-stage{grid-template-columns:1fr 360px!important;padding-left:35px!important;padding-right:35px!important}.pp-hero-brand-card{width:360px!important}}
@media(max-width:820px){.header .brand{width:285px!important}.pp-chosen-stage{grid-template-columns:1fr!important}.pp-hero-brand-card{width:min(430px,82vw)!important}}
@media(max-width:560px){.header .brand{width:220px!important;height:48px!important}.header .brand .pp-chosen-brand-logo{max-height:48px!important}.pp-hero-brand-card{width:94vw!important}}
`;
 document.head.appendChild(style);
 return true;
}
function boot(){if(install())return;const t=setInterval(()=>{if(install())clearInterval(t)},50);setTimeout(()=>clearInterval(t),15000)}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
