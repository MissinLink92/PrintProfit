(()=>{
'use strict';
if(window.__printProfitSignatureTheme)return;window.__printProfitSignatureTheme=true;
function ready(){return !!document.querySelector('.header')&&!!document.querySelector('.hero')&&!!document.querySelector('.pp-chosen-stage');}
function install(){
 if(!ready())return false;
 document.getElementById('ppSignatureThemeStyles')?.remove();
 const hero=document.querySelector('.hero');
 const brandCard=document.querySelector('.pp-hero-brand-card');
 const stage=document.querySelector('.pp-chosen-stage');
 if(!hero||!brandCard||!stage)return false;
 hero.classList.add('pp-signature-hero');
 brandCard.classList.add('pp-contained-brand-card');
 let ambient=hero.querySelector('.pp-ambient-orb');
 if(!ambient){ambient=document.createElement('div');ambient.className='pp-ambient-orb';hero.appendChild(ambient);}
 let sweep=brandCard.querySelector('.pp-card-sweep');
 if(!sweep){sweep=document.createElement('div');sweep.className='pp-card-sweep';brandCard.appendChild(sweep);}
 const style=document.createElement('style');style.id='ppSignatureThemeStyles';style.textContent=`
:root{
 --pp-orange:#ff7800;
 --pp-orange-soft:#ff9b45;
 --pp-black:#020508;
 --pp-deep:#060c11;
 --pp-panel:#0a1117;
 --pp-panel2:#0d161d;
 --pp-line:#263740;
 --pp-line-soft:#1a2931;
 --pp-text:#f7f9fb;
 --pp-muted:#93a4ad;
}
html,body{background:var(--pp-black)!important;color:var(--pp-text)!important}
body.pp-pretty-body{background:radial-gradient(900px 420px at 50% -10%,#141b20 0,transparent 65%),linear-gradient(180deg,#070d12 0%,#020508 58%,#010204 100%)!important}
.shell.pp-pretty-shell{max-width:none!important;margin:0!important;border:0!important;border-radius:0!important;background:transparent!important}
.header.pp-pretty-header,.header{background:rgba(3,7,10,.94)!important;border-bottom-color:#1a272e!important;box-shadow:0 12px 34px #000c!important}
.header.pp-pretty-header:after,.header:after{background:linear-gradient(90deg,transparent,var(--pp-orange),transparent)!important;box-shadow:0 0 16px #ff78003a!important}
.header .nav a,.header.pp-pretty-header .nav a{color:#ccd4d8!important;background:transparent!important}
.header .nav a:hover,.header .nav a.active{color:#fff!important;background:#ff78000b!important}
.header .nav a:after{background:var(--pp-orange)!important;box-shadow:0 0 12px #ff780064!important}
.header .mode,.header.pp-pretty-header .mode{color:#d7dee2!important}
.header .mode input,.pp-mode-toggle input{background:#11191f!important;border-color:#39474e!important}
.header .mode input:checked,.pp-mode-toggle input:checked{background:var(--pp-orange)!important;border-color:var(--pp-orange)!important;box-shadow:0 0 16px #ff78002f!important}

.hero.pp-signature-hero,.hero{height:390px!important;min-height:390px!important;background:
 radial-gradient(600px 300px at 75% 45%,#ff78000d 0,transparent 62%),
 radial-gradient(700px 300px at 15% 45%,#ffffff05 0,transparent 68%),
 linear-gradient(135deg,#060b10 0%,#091117 52%,#020609 100%)!important;isolation:isolate!important}
.hero.pp-signature-hero:before{opacity:.08!important;background-image:linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)!important;background-size:36px 36px!important;mask-image:radial-gradient(ellipse at center,#000 0%,transparent 76%)!important}
.hero.pp-signature-hero:after{background:linear-gradient(90deg,transparent,var(--pp-orange),transparent)!important;box-shadow:0 0 18px #ff78004d!important}
.pp-chosen-stage{grid-template-columns:minmax(0,1fr) minmax(360px,.85fr)!important;gap:44px!important;padding:42px clamp(28px,7vw,120px) 76px!important;overflow:hidden!important}
.pp-hero-copy2{max-width:760px!important}
.pp-kicker{color:var(--pp-orange)!important}
.pp-kicker span{background:linear-gradient(90deg,var(--pp-orange),transparent)!important}
.pp-hero-copy2 h1 strong{color:var(--pp-orange)!important;text-shadow:none!important}
.pp-hero-copy2 p{color:#aab6bc!important}
.pp-main-cta{background:var(--pp-orange)!important;box-shadow:0 10px 24px #ff78002b!important}
.pp-main-cta:hover{filter:brightness(1.08)!important}
.pp-ghost-cta{background:#0a1117aa!important;border-color:#334149!important;color:#d9e1e5!important}
.pp-ghost-cta:hover{border-color:#ff780077!important;background:#ff78000b!important}

.pp-hero-brand-card.pp-contained-brand-card{
 position:relative!important;overflow:hidden!important;isolation:isolate!important;
 width:min(500px,100%)!important;aspect-ratio:1.32!important;
 border:1px solid #39464c!important;border-radius:22px!important;
 background:linear-gradient(145deg,#10171d,#070c10)!important;
 box-shadow:0 28px 70px #000b,inset 0 1px 0 #ffffff0c!important;
 transform:perspective(1100px) rotateY(-4deg) rotateX(1deg)!important;
 transition:transform .45s ease,box-shadow .45s ease,border-color .45s ease!important;
}
.pp-hero-brand-card.pp-contained-brand-card:hover{transform:perspective(1100px) rotateY(-1deg) rotateX(0deg) translateY(-5px)!important;border-color:#566168!important;box-shadow:0 34px 82px #000d,inset 0 1px 0 #ffffff12!important}
.pp-hero-brand-card:before{background:radial-gradient(circle at 50% 42%,#ffffff08,transparent 58%)!important}
.pp-card-glow{background:#ffffff08!important;filter:blur(44px)!important;animation:ppFloatGlow 7s ease-in-out infinite!important}
.pp-hero-brand-card img{width:78%!important;max-width:440px!important;position:relative!important;z-index:3!important;animation:ppLogoFloat 6s ease-in-out infinite!important;filter:drop-shadow(0 10px 22px #000d)!important}
.pp-card-sweep{position:absolute!important;inset:-30%!important;z-index:2!important;pointer-events:none!important;background:linear-gradient(115deg,transparent 42%,#ffffff08 48%,#ffffff16 50%,#ffffff08 52%,transparent 58%)!important;transform:translateX(-55%) rotate(7deg)!important;animation:ppSweep 8s ease-in-out infinite!important}
.pp-card-caption{color:#87959d!important;z-index:4!important}
.pp-card-caption i{background:var(--pp-orange)!important;box-shadow:0 0 8px #ff780088!important}
.pp-ambient-orb{position:absolute!important;right:22%!important;top:18%!important;width:280px!important;height:280px!important;border-radius:50%!important;background:radial-gradient(circle,#ff78000e 0,transparent 68%)!important;filter:blur(20px)!important;pointer-events:none!important;z-index:1!important;animation:ppAmbient 10s ease-in-out infinite!important}
.pp-chosen-ticker{border-top-color:#27363e!important}
.pp-chosen-ticker span{color:#87979f!important}
.pp-chosen-ticker span+span{border-left-color:#1d2a31!important}

.main{background:transparent!important}
.panel{background:linear-gradient(180deg,#0a1117,#080e13)!important;border-color:#24343c!important;box-shadow:0 14px 38px #0008,inset 0 1px 0 #ffffff07!important}
.panel:hover{border-color:#3b4b54!important;transform:translateY(-1px)!important}
.head .icon,.panel .head .icon{background:var(--pp-orange)!important;box-shadow:0 7px 16px #ff78002b!important}
input,select{background:#0d161d!important;border-color:#2a3b43!important}
input:focus,select:focus{border-color:var(--pp-orange)!important;box-shadow:0 0 0 2px #ff780014!important}
.btn.accent,.tab.active,.quick .btn.active{background:var(--pp-orange)!important;border-color:var(--pp-orange)!important;box-shadow:0 8px 20px #ff780022!important}
.drop{border-color:var(--pp-orange)!important;background:#ff780005!important}
.drop:hover{background:#ff78000b!important}
#deliveryRateOut{color:var(--pp-orange)!important}

@keyframes ppLogoFloat{0%,100%{transform:translate3d(0,0,0) rotate(0deg)}50%{transform:translate3d(0,-7px,0) rotate(-.35deg)}}
@keyframes ppFloatGlow{0%,100%{transform:translate3d(-8px,0,0) scale(1)}50%{transform:translate3d(10px,-4px,0) scale(1.06)}}
@keyframes ppSweep{0%,12%{transform:translateX(-60%) rotate(7deg);opacity:0}28%{opacity:.85}50%{transform:translateX(60%) rotate(7deg);opacity:.1}100%{transform:translateX(95%) rotate(7deg);opacity:0}}
@keyframes ppAmbient{0%,100%{transform:translate3d(-12px,0,0) scale(1)}50%{transform:translate3d(18px,-10px,0) scale(1.08)}}
@media(prefers-reduced-motion:reduce){.pp-hero-brand-card img,.pp-card-glow,.pp-card-sweep,.pp-ambient-orb{animation:none!important}}
@media(max-width:1050px){.pp-chosen-stage{grid-template-columns:1fr 340px!important;gap:24px!important;padding-left:34px!important;padding-right:34px!important}.pp-hero-brand-card.pp-contained-brand-card{width:340px!important}.pp-hero-copy2 h1{font-size:54px!important}}
@media(max-width:820px){.hero.pp-signature-hero,.hero{height:560px!important;min-height:560px!important}.pp-chosen-stage{grid-template-columns:1fr!important;gap:22px!important;padding:34px 24px 112px!important;overflow:hidden!important}.pp-hero-brand-card.pp-contained-brand-card{justify-self:center!important;width:min(430px,84vw)!important;transform:none!important}.pp-chosen-ticker{grid-template-columns:repeat(3,1fr)!important;left:18px!important;right:18px!important}.pp-chosen-ticker span:nth-child(n+4){display:none!important}}
@media(max-width:560px){.hero.pp-signature-hero,.hero{height:500px!important;min-height:500px!important}.pp-hero-copy2 h1{font-size:39px!important}.pp-hero-copy2 p{font-size:13px!important}.pp-hero-brand-card.pp-contained-brand-card{width:88vw!important;max-width:360px!important}.pp-chosen-ticker{left:9px!important;right:9px!important}.pp-chosen-ticker span{font-size:7.5px!important}}
`;
 document.head.appendChild(style);
 return true;
}
function wait(){if(install())return;const t=setInterval(()=>{if(install()||Date.now()-performance.timeOrigin>15000)clearInterval(t)},50)}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',wait,{once:true});else wait();
})();