(()=>{
'use strict';
if(window.__printProfitChosenTheme)return;window.__printProfitChosenTheme=true;
const ready=()=>!!document.querySelector('.header')&&!!document.querySelector('.hero');
function install(){
 if(!ready())return false;
 document.getElementById('ppChosenThemeStyles')?.remove();
 const brand=document.querySelector('.header .brand');
 if(brand){
  brand.innerHTML='';
  const img=document.createElement('img');
  img.src='./assets/printprofit-header-logo.webp?v=2';
  img.alt='PrintProfit — 3D Printing Cost & Pricing Calculator';
  img.className='pp-chosen-brand-logo';
  brand.appendChild(img);
 }
 const hero=document.querySelector('.hero');
 hero.classList.add('pp-chosen-hero');
 hero.querySelector('.pp-hero-art')?.setAttribute('aria-hidden','true');
 hero.querySelectorAll('.pp-hero-art').forEach(x=>x.style.display='none');
 let stage=hero.querySelector('.pp-chosen-stage');
 if(!stage){
  stage=document.createElement('div');
  stage.className='pp-chosen-stage';
  stage.innerHTML=`
   <div class="pp-hero-copy2">
    <div class="pp-kicker"><span></span>3D PRINTING COST &amp; PRICING</div>
    <h1>Know what it costs.<br><strong>Know what to charge.</strong></h1>
    <p>Upload your sliced print file and let PrintProfit turn real printer data into a clear cost, selling price and profit.</p>
    <div class="pp-hero-buttons"><a href="#calculator" class="pp-main-cta">Calculate a print <b>→</b></a><a href="#guides" class="pp-ghost-cta">How it works</a></div>
   </div>
   <div class="pp-hero-brand-card">
    <div class="pp-card-glow"></div>
    <img src="./assets/printprofit-header-logo.webp?v=2" alt="PrintProfit">
    <div class="pp-card-caption"><span>CALCULATE</span><i></i><span>PRICE</span><i></i><span>PROFIT</span></div>
   </div>`;
  hero.appendChild(stage);
 }
 let ticker=hero.querySelector('.pp-chosen-ticker');
 if(!ticker){
  ticker=document.createElement('div');ticker.className='pp-chosen-ticker';
  ticker.innerHTML='<span>ACCURATE COSTS</span><span>ANY SLICER</span><span>REAL MATERIAL USAGE</span><span>PRINTER PROFILES</span><span>DELIVERY &amp; FEES</span>';
  hero.appendChild(ticker);
 }
 const style=document.createElement('style');style.id='ppChosenThemeStyles';style.textContent=`
:root{--ppb:#0aa2ff;--ppb2:#43c9ff;--ppdeep:#02070b;--pppanel:#091823;--ppline:#1a3949;--pptext:#f7fbfe;--ppmuted:#91a9b8}
html,body{background:#02070b!important;color:var(--pptext)!important}
body.pp-pretty-body{background:radial-gradient(900px 420px at 50% -10%,#12344a 0,transparent 65%),linear-gradient(180deg,#06111a 0%,#02060a 58%,#010306 100%)!important}
.shell.pp-pretty-shell{max-width:none!important;margin:0!important;border:0!important;border-radius:0!important;background:transparent!important}
.header.pp-pretty-header,.header{position:sticky!important;top:0!important;z-index:99!important;display:grid!important;grid-template-columns:minmax(260px,1fr) auto minmax(240px,1fr)!important;align-items:center!important;gap:24px!important;height:82px!important;min-height:82px!important;padding:8px clamp(18px,3vw,44px)!important;background:rgba(3,9,14,.9)!important;backdrop-filter:blur(16px)!important;border-bottom:1px solid #173342!important;box-shadow:0 14px 36px #000b!important}
.header.pp-pretty-header:after,.header:after{content:""!important;position:absolute!important;left:0!important;right:0!important;bottom:-1px!important;height:2px!important;background:linear-gradient(90deg,transparent,#0aa2ff,#43c9ff,#0aa2ff,transparent)!important;box-shadow:0 0 18px #0aa2ff66!important}
.header .brand,.header.pp-pretty-header .brand{grid-column:1!important;justify-self:start!important;width:min(350px,31vw)!important;height:60px!important;min-width:0!important;display:flex!important;align-items:center!important}
.header .brand .pp-chosen-brand-logo{width:100%!important;height:auto!important;max-height:58px!important;object-fit:contain!important;object-position:left center!important;display:block!important;filter:drop-shadow(0 4px 14px #000c)!important}
.header .nav,.header.pp-pretty-header .nav{grid-column:2!important;display:flex!important;align-items:center!important;justify-content:center!important;gap:4px!important}
.header .nav a,.header.pp-pretty-header .nav a{color:#cddce4!important;font-size:13px!important;font-weight:650!important;padding:11px 14px 13px!important;border-radius:9px!important;position:relative!important;transition:.2s!important}
.header .nav a:hover{background:#0aa2ff0e!important;color:#fff!important;transform:translateY(-1px)!important}.header .nav a.active{background:#0aa2ff15!important;color:#fff!important}
.header .nav a:after{content:""!important;position:absolute!important;left:13px!important;right:13px!important;bottom:2px!important;height:2px!important;border-radius:99px!important;background:linear-gradient(90deg,var(--ppb),var(--ppb2))!important;box-shadow:0 0 12px #0aa2ff70!important;transform:scaleX(0)!important;transition:.2s!important}.header .nav a.active:after,.header .nav a:hover:after{transform:scaleX(1)!important}
.header .mode,.header.pp-pretty-header .mode{grid-column:3!important;justify-self:end!important;display:flex!important;align-items:center!important;gap:9px!important;font-size:12px!important;color:#d5e2e9!important}
.pp-mode-toggle input,.header .mode input{appearance:none!important;width:46px!important;height:26px!important;border-radius:99px!important;border:1px solid #355466!important;background:#10232e!important;position:relative!important}.pp-mode-toggle input:after,.header .mode input:after{content:""!important;position:absolute!important;width:18px!important;height:18px!important;left:3px!important;top:3px!important;border-radius:50%!important;background:#eef8fc!important;box-shadow:0 2px 7px #0009!important;transition:.2s!important}.pp-mode-toggle input:checked,.header .mode input:checked{background:linear-gradient(90deg,#078ff4,#0aa2ff)!important;border-color:#0aa2ff!important;box-shadow:0 0 16px #0aa2ff33!important}.pp-mode-toggle input:checked:after,.header .mode input:checked:after{left:24px!important}

.hero.pp-chosen-hero,.hero{height:390px!important;min-height:390px!important;position:relative!important;overflow:hidden!important;border-bottom:1px solid #183746!important;background:radial-gradient(560px 300px at 73% 44%,#0aa2ff17 0,transparent 63%),radial-gradient(620px 260px at 14% 48%,#0aa2ff10 0,transparent 65%),linear-gradient(135deg,#06111a 0%,#0a1b26 49%,#02080d 100%)!important;isolation:isolate!important}
.hero.pp-chosen-hero:before{content:""!important;position:absolute!important;inset:0!important;opacity:.14!important;background-image:linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)!important;background-size:38px 38px!important;mask-image:radial-gradient(ellipse at center,#000 0%,transparent 75%)!important;pointer-events:none!important}
.hero.pp-chosen-hero:after{content:""!important;position:absolute!important;left:0!important;right:0!important;bottom:0!important;height:2px!important;background:linear-gradient(90deg,transparent,#0aa2ff,#43c9ff,#0aa2ff,transparent)!important;box-shadow:0 0 22px #0aa2ff66!important}
.hero .pp-hero-content{display:none!important}.hero .pp-hero-features{display:none!important}
.pp-chosen-stage{position:absolute!important;inset:0!important;z-index:10!important;display:grid!important;grid-template-columns:minmax(0,1.08fr) minmax(380px,.92fr)!important;align-items:center!important;gap:30px!important;padding:34px clamp(24px,7vw,110px) 76px!important;box-sizing:border-box!important}
.pp-hero-copy2{max-width:740px!important;align-self:center!important}.pp-kicker{display:flex!important;align-items:center!important;gap:9px!important;color:var(--ppb)!important;font-size:10px!important;font-weight:900!important;letter-spacing:.22em!important}.pp-kicker span{width:34px!important;height:2px!important;background:linear-gradient(90deg,var(--ppb),transparent)!important}
.pp-hero-copy2 h1{margin:14px 0 0!important;font-size:clamp(45px,5vw,73px)!important;line-height:.92!important;letter-spacing:-.058em!important;font-weight:950!important;color:#f7fbfe!important;text-shadow:0 14px 40px #000d!important}.pp-hero-copy2 h1 strong{font-weight:950!important;color:var(--ppb)!important;text-shadow:0 0 36px #0aa2ff25!important}
.pp-hero-copy2 p{margin:20px 0 0!important;max-width:650px!important;color:#a9c0cc!important;font-size:16px!important;line-height:1.55!important}
.pp-hero-buttons{display:flex!important;gap:10px!important;margin-top:25px!important}.pp-main-cta,.pp-ghost-cta{display:inline-flex!important;align-items:center!important;gap:12px!important;text-decoration:none!important;border-radius:10px!important;padding:12px 16px!important;font-size:13px!important;font-weight:850!important;transition:.2s!important}.pp-main-cta{color:#fff!important;background:linear-gradient(135deg,#0aa2ff,#087df1)!important;box-shadow:0 12px 28px #0aa2ff2b!important}.pp-main-cta b{font-size:18px!important;font-weight:500!important}.pp-main-cta:hover{transform:translateY(-2px)!important;filter:brightness(1.08)!important}.pp-ghost-cta{color:#d7e6ee!important;border:1px solid #345162!important;background:#081722aa!important}.pp-ghost-cta:hover{border-color:#0aa2ff66!important;background:#0aa2ff0d!important;transform:translateY(-2px)!important}
.pp-hero-brand-card{position:relative!important;justify-self:end!important;width:min(470px,100%)!important;aspect-ratio:1.35!important;display:flex!important;align-items:center!important;justify-content:center!important;border:1px solid #2a4a5c!important;border-radius:20px!important;background:linear-gradient(145deg,#0b1b26e6,#06121be8)!important;box-shadow:inset 0 1px 0 #fff08,0 28px 70px #0009,0 0 0 1px #0aa2ff0b!important;overflow:hidden!important;transform:perspective(900px) rotateY(-7deg) rotateX(2deg)!important;transition:transform .35s ease,box-shadow .35s ease!important}.pp-hero-brand-card:hover{transform:perspective(900px) rotateY(-2deg) rotateX(0deg) translateY(-4px)!important;box-shadow:inset 0 1px 0 #fff0b,0 35px 80px #000b,0 0 45px #0aa2ff18!important}.pp-hero-brand-card:before{content:""!important;position:absolute!important;inset:0!important;background:linear-gradient(125deg,#0aa2ff13,transparent 42%,#43c9ff0a)!important}.pp-card-glow{position:absolute!important;width:260px!important;height:260px!important;border-radius:50%!important;background:#0aa2ff18!important;filter:blur(35px)!important}.pp-hero-brand-card img{position:relative!important;width:82%!important;height:auto!important;z-index:2!important;filter:drop-shadow(0 8px 20px #000d)!important}.pp-card-caption{position:absolute!important;left:12%!important;right:12%!important;bottom:18px!important;z-index:3!important;display:flex!important;align-items:center!important;justify-content:center!important;gap:11px!important;color:#8fa8b6!important;font-size:8px!important;font-weight:800!important;letter-spacing:.18em!important}.pp-card-caption i{width:3px!important;height:3px!important;border-radius:50%!important;background:var(--ppb)!important;box-shadow:0 0 8px #0aa2ff!important}
.pp-chosen-ticker{position:absolute!important;left:clamp(20px,7vw,110px)!important;right:clamp(20px,7vw,110px)!important;bottom:17px!important;z-index:20!important;display:grid!important;grid-template-columns:repeat(5,1fr)!important;gap:1px!important;border-top:1px solid #234655!important;padding-top:10px!important}.pp-chosen-ticker span{color:#91aab7!important;font-size:8.5px!important;font-weight:800!important;letter-spacing:.13em!important;text-align:center!important}.pp-chosen-ticker span+span{border-left:1px solid #1d3b4a!important}
.main{max-width:1480px!important;margin:0 auto!important;padding:20px clamp(10px,2vw,28px)!important}.panel{background:linear-gradient(180deg,#0b1a24,#081720)!important;border:1px solid #1d3a4b!important;border-radius:14px!important;box-shadow:0 14px 38px #0007,inset 0 1px 0 #fff06!important}.panel:hover{border-color:#2b4d61!important}.panel .head .icon{background:linear-gradient(135deg,#0aa2ff,#087ef0)!important;box-shadow:0 8px 20px #0aa2ff20!important}input:focus,select:focus{border-color:#0aa2ff!important;box-shadow:0 0 0 2px #0aa2ff14!important}.btn.accent,.tab.active,.quick .btn.active{background:linear-gradient(135deg,#0aa2ff,#087ef0)!important;border-color:#0aa2ff!important;box-shadow:0 8px 20px #0aa2ff20!important}.drop{border-color:#0aa2ff!important;background:linear-gradient(180deg,#0aa2ff08,#0aa2ff02)!important}.drop:hover{background:#0aa2ff0d!important}#deliveryRateOut{color:#0aa2ff!important}
@media(max-width:1050px){.header.pp-pretty-header,.header{grid-template-columns:minmax(220px,1fr) auto minmax(180px,1fr)!important}.header .brand{width:300px!important}.pp-chosen-stage{grid-template-columns:1fr 340px!important;padding-left:35px!important;padding-right:35px!important}.pp-hero-copy2 h1{font-size:54px!important}.pp-hero-brand-card{width:340px!important}.pp-chosen-ticker{left:35px!important;right:35px!important}}
@media(max-width:820px){.header.pp-pretty-header,.header{position:relative!important;height:auto!important;min-height:94px!important;grid-template-columns:minmax(0,1fr) auto!important;grid-template-rows:auto auto!important;padding:8px 14px!important}.header .brand{grid-column:1!important;grid-row:1!important;width:255px!important;height:52px!important}.header .nav{grid-column:1 / -1!important;grid-row:2!important;justify-content:flex-start!important;overflow:auto!important}.header .mode{grid-column:2!important;grid-row:1!important}.hero.pp-chosen-hero,.hero{height:540px!important;min-height:540px!important}.pp-chosen-stage{grid-template-columns:1fr!important;align-items:start!important;gap:20px!important;padding:34px 24px 112px!important}.pp-hero-copy2{max-width:690px!important}.pp-hero-copy2 h1{font-size:48px!important}.pp-hero-brand-card{justify-self:center!important;width:min(430px,82vw)!important;transform:none!important}.pp-chosen-ticker{grid-template-columns:repeat(3,1fr)!important;left:18px!important;right:18px!important;bottom:13px!important;gap:4px!important}.pp-chosen-ticker span:nth-child(n+4){display:none!important}.pp-chosen-ticker span:nth-child(4){display:none!important}.pp-chosen-ticker span:nth-child(3){border-left:1px solid #1d3b4a!important}.pp-chosen-ticker span+span{border-left:1px solid #1d3b4a!important}}
@media(max-width:560px){.header .brand{width:195px!important;height:46px!important}.header .brand .pp-chosen-brand-logo{max-height:44px!important}.header .mode{font-size:10px!important}.pp-mode-toggle input{width:42px!important;height:24px!important}.pp-mode-toggle input:after{width:18px!important;height:18px!important;top:2px!important;left:2px!important}.pp-mode-toggle input:checked:after{left:21px!important}.hero.pp-chosen-hero,.hero{height:520px!important;min-height:520px!important}.pp-chosen-stage{padding:27px 16px 104px!important;gap:18px!important}.pp-kicker{font-size:8px!important;letter-spacing:.14em!important}.pp-hero-copy2 h1{font-size:37px!important;line-height:.96!important}.pp-hero-copy2 p{font-size:12px!important;line-height:1.45!important}.pp-hero-buttons{margin-top:17px!important;flex-wrap:wrap!important}.pp-main-cta,.pp-ghost-cta{padding:10px 12px!important;font-size:11px!important}.pp-hero-brand-card{width:94vw!important;border-radius:16px!important}.pp-card-caption{font-size:6.5px!important;gap:7px!important}.pp-chosen-ticker span{font-size:6.5px!important;letter-spacing:.08em!important}}
`;
 document.head.appendChild(style);
 return true;
}
function boot(){if(install())return;const t=setInterval(()=>{if(install())clearInterval(t)},50);setTimeout(()=>clearInterval(t),15000)}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();