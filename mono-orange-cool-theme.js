(()=>{
'use strict';
if(window.__printProfitMonoOrangeTheme)return;window.__printProfitMonoOrangeTheme=true;
function install(){
 const hero=document.querySelector('.hero');
 const header=document.querySelector('.header');
 if(!hero||!header)return false;
 document.getElementById('ppMonoOrangeCoolStyles')?.remove();
 const style=document.createElement('style');style.id='ppMonoOrangeCoolStyles';style.textContent=`
:root{
 --pp-orange:#ff7a00;
 --pp-orange2:#ff9a3d;
 --pp-cool1:#0b1822;
 --pp-cool2:#10232e;
 --pp-cool3:#162f3c;
 --pp-line:#2d4652;
 --pp-text:#f5f8fa;
 --pp-muted:#9aabb4;
}
html,body{background:#07111a!important;color:var(--pp-text)!important}
body.pp-pretty-body{background:
 radial-gradient(900px 420px at 50% -12%,#24405055 0,transparent 66%),
 radial-gradient(650px 360px at 82% 42%,#18334255 0,transparent 70%),
 linear-gradient(180deg,#0a1620 0%,#07111a 58%,#050b11 100%)!important;
}

/* Header: clean cool background, orange brand accents */
.header.pp-pretty-header,.header{
 background:linear-gradient(180deg,#08141e 0%,#0a1721 100%)!important;
 border-bottom:1px solid #27424f!important;
 box-shadow:0 12px 34px #000b!important;
}
.header.pp-pretty-header:after,.header:after{
 background:linear-gradient(90deg,transparent,var(--pp-orange),var(--pp-orange2),var(--pp-orange),transparent)!important;
 box-shadow:0 0 16px #ff780044!important;
}
.header .brand .pp-chosen-brand-logo{
 filter:brightness(0) saturate(100%) invert(47%) sepia(98%) saturate(3299%) hue-rotate(2deg) brightness(104%) contrast(104%) drop-shadow(0 5px 14px #000c)!important;
}
.header .nav a:hover,.header .nav a.active{background:#ff78000c!important;color:#fff!important}
.header .nav a:after{background:var(--pp-orange)!important;box-shadow:0 0 12px #ff780064!important}
.pp-mode-toggle input:checked,.header .mode input:checked{background:var(--pp-orange)!important;border-color:var(--pp-orange)!important;box-shadow:0 0 16px #ff78002f!important}

/* Hero: cool steel/navy background. No orange wash. */
.hero.pp-signature-hero,.hero{
 background:
  radial-gradient(560px 300px at 74% 44%,#2a46540f 0,transparent 65%),
  radial-gradient(680px 300px at 14% 50%,#9fb6c10a 0,transparent 68%),
  linear-gradient(135deg,#091721 0%,#0c1d28 50%,#061019 100%)!important;
 border-bottom:1px solid #294552!important;
 box-shadow:inset 0 -60px 100px #02080d99!important;
}
.hero.pp-signature-hero:before{opacity:.10!important;background-image:linear-gradient(#d7e4ea 1px,transparent 1px),linear-gradient(90deg,#d7e4ea 1px,transparent 1px)!important;background-size:38px 38px!important}
.hero.pp-signature-hero:after{background:linear-gradient(90deg,transparent,var(--pp-orange),transparent)!important;box-shadow:0 0 18px #ff78004d!important}

/* Make the entire supplied logo monochrome orange */
.pp-hero-brand-card.pp-contained-brand-card{
 background:linear-gradient(145deg,#142530,#0b1720)!important;
 border-color:#35505d!important;
 box-shadow:0 28px 70px #000b,inset 0 1px 0 #ffffff10!important;
}
.pp-hero-brand-card.pp-contained-brand-card:before{background:radial-gradient(circle at 50% 42%,#c7d4db08,transparent 58%)!important}
.pp-hero-brand-card img{
 filter:brightness(0) saturate(100%) invert(47%) sepia(98%) saturate(3299%) hue-rotate(2deg) brightness(104%) contrast(104%) drop-shadow(0 10px 22px #000c)!important;
}
.pp-card-glow{background:#ff78000b!important}
.pp-card-sweep{background:linear-gradient(115deg,transparent 42%,#ffffff08 48%,#ffffff16 50%,#ffffff08 52%,transparent 58%)!important}
.pp-card-caption{color:#b5c2c9!important}
.pp-card-caption i{background:var(--pp-orange)!important;box-shadow:0 0 8px #ff780088!important}

/* Keep hero copy restrained: orange is an accent, not a rainbow */
.pp-kicker{color:var(--pp-orange)!important}
.pp-kicker span{background:linear-gradient(90deg,var(--pp-orange),transparent)!important}
.pp-hero-copy2 h1{color:#f7fafc!important}
.pp-hero-copy2 h1 strong{color:var(--pp-orange)!important;text-shadow:none!important}
.pp-hero-copy2 p{color:#b6c5cc!important}
.pp-main-cta{background:var(--pp-orange)!important;box-shadow:0 10px 24px #ff78002b!important}
.pp-ghost-cta{background:#0e1d26aa!important;border-color:#405661!important}
.pp-ghost-cta:hover{border-color:#ff780077!important;background:#ff78000b!important}
.pp-brand-slogan,.pp-reference-slogan{color:var(--pp-orange)!important;text-shadow:0 3px 14px #000d!important}
.pp-brand-slogan span,.pp-reference-slogan b{color:var(--pp-orange)!important}
.pp-brand-slogan span:nth-child(1),.pp-brand-slogan span:nth-child(2){color:var(--pp-orange)!important}
.pp-chosen-ticker{border-top-color:#31505d!important}
.pp-chosen-ticker span{color:#9eb0b9!important}

/* Calculator surfaces */
.panel{background:linear-gradient(180deg,#0d1c25,#0a171f)!important;border-color:#29434f!important;box-shadow:0 14px 38px #0007,inset 0 1px 0 #ffffff08!important}
.panel:hover{border-color:#3a5662!important}
.head .icon,.panel .head .icon{background:var(--pp-orange)!important;box-shadow:0 7px 16px #ff78002b!important}
input,select{background:#10212a!important;border-color:#304852!important;color:#eef4f6!important}
input:focus,select:focus{border-color:var(--pp-orange)!important;box-shadow:0 0 0 2px #ff780014!important}
.btn.accent,.tab.active,.quick .btn.active{background:var(--pp-orange)!important;border-color:var(--pp-orange)!important;box-shadow:0 8px 20px #ff780022!important}
.drop{border-color:var(--pp-orange)!important;background:#ff780005!important}
.drop:hover{background:#ff78000b!important}
#deliveryRateOut{color:var(--pp-orange)!important}

/* Gentle movement remains, but everything is clipped to the hero/card */
.hero,.pp-hero-content,.pp-chosen-stage,.pp-hero-brand-card{overflow:hidden!important}
@media(prefers-reduced-motion:reduce){.pp-hero-brand-card img,.pp-card-glow,.pp-card-sweep,.pp-ambient-orb{animation:none!important}}
`;
 document.head.appendChild(style);
 return true;
}
function wait(){if(install())return;const t=setInterval(()=>{if(install()||Date.now()-performance.timeOrigin>15000)clearInterval(t)},50)}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',wait,{once:true});else wait();
})();