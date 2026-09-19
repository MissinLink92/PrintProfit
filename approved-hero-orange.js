(()=>{
'use strict';
if(window.__printProfitApprovedOrangeHero)return;
window.__printProfitApprovedOrangeHero=true;
function install(){
  const hero=document.querySelector('.hero');
  if(!hero)return false;
  hero.classList.add('pp-approved-orange-hero');
  hero.querySelector('.pp-chosen-stage')?.remove();
  hero.querySelector('.pp-chosen-ticker')?.remove();
  hero.querySelectorAll('.pp-hero-content,.pp-hero-features,.pp-hero-art').forEach(el=>el.style.display='none');
  let stage=hero.querySelector('.pp-approved-orange-stage');
  if(!stage){
    stage=document.createElement('div');
    stage.className='pp-approved-orange-stage';
    stage.innerHTML=`
      <div class="pp-approved-orange-art"></div>
      <div class="pp-approved-orange-overlay"></div>
      <div class="pp-approved-orange-copy">
        <div class="pp-approved-kicker"><span></span>3D PRINTING PRICING, MADE SIMPLE</div>
        <h1>Know what it costs.<br><strong>Know what to charge.</strong></h1>
        <p>Accurate 3D printing cost and pricing calculations to help you price with confidence and maximise your profit.</p>
        <div class="pp-approved-buttons"><a href="#calculator" class="pp-approved-main">Start Calculating <b>›</b></a><a href="#guides" class="pp-approved-ghost">Learn More <b>›</b></a></div>
      </div>
      <div class="pp-approved-top-features">
        <div><span>☼</span><b>IDEAS</b><small>into prints</small></div>
        <div><span>◇</span><b>PRINTS</b><small>into products</small></div>
        <div><span>▤</span><b>COSTS</b><small>into confidence</small></div>
        <div><span>▥</span><b>PROFITS</b><small>into growth</small></div>
      </div>
      <div class="pp-approved-bottom-features">
        <div><span>▦</span><b>Calculate</b></div><div><span>◇</span><b>Price</b></div><div><span>▥</span><b>Maximise</b></div><div><span>⚙</span><b>Built</b></div>
      </div>`;
    hero.appendChild(stage);
  }
  if(!document.getElementById('ppApprovedOrangeHeroStyles')){
    const style=document.createElement('style');
    style.id='ppApprovedOrangeHeroStyles';
    style.textContent=`
      .hero.pp-approved-orange-hero{height:330px!important;min-height:330px!important;position:relative!important;overflow:hidden!important;border-bottom:1px solid #263d49!important;background:#061019!important;isolation:isolate!important}
      .pp-approved-orange-stage{position:absolute!important;inset:0!important;overflow:hidden!important}
      .pp-approved-orange-art{position:absolute!important;inset:0!important;background-image:url('./assets/hero-art-orange.webp')!important;background-repeat:no-repeat!important;background-position:center right!important;background-size:cover!important;opacity:.96!important;z-index:0!important}
      .pp-approved-orange-overlay{position:absolute!important;inset:0!important;background:linear-gradient(90deg,#061019 0%,#061019e8 24%,#0610199c 49%,#06101920 78%,#06101908 100%)!important;z-index:1!important}
      .pp-approved-orange-overlay:after{content:""!important;position:absolute!important;inset:0!important;background:linear-gradient(180deg,#00000030 0%,transparent 55%,#00000072 100%)!important}
      .pp-approved-orange-copy{position:absolute!important;left:clamp(20px,3vw,44px)!important;top:38px!important;width:min(470px,42vw)!important;z-index:5!important}
      .pp-approved-kicker{display:flex!important;align-items:center!important;gap:7px!important;color:#ff7800!important;font-size:8px!important;font-weight:900!important;letter-spacing:.18em!important}
      .pp-approved-kicker span{width:22px!important;height:2px!important;background:#ff7800!important}
      .pp-approved-orange-copy h1{margin:8px 0 0!important;color:#fff!important;font-size:clamp(31px,3.1vw,48px)!important;line-height:.94!important;letter-spacing:-.045em!important;font-weight:950!important;text-shadow:0 4px 20px #000e!important}
      .pp-approved-orange-copy h1 strong{color:#ff7800!important;font-weight:950!important}
      .pp-approved-orange-copy p{margin:10px 0 0!important;max-width:430px!important;color:#cbd8de!important;font-size:10px!important;line-height:1.38!important;text-shadow:0 2px 8px #000c!important}
      .pp-approved-buttons{display:flex!important;gap:7px!important;margin-top:12px!important}
      .pp-approved-main,.pp-approved-ghost{display:inline-flex!important;align-items:center!important;gap:7px!important;text-decoration:none!important;border-radius:5px!important;padding:7px 11px!important;font-size:9px!important;font-weight:850!important}
      .pp-approved-main{color:#fff!important;background:#ff7800!important;border:1px solid #ff7800!important;box-shadow:0 6px 16px #0008!important}
      .pp-approved-ghost{color:#edf4f7!important;background:#07151ec9!important;border:1px solid #46606d!important}
      .pp-approved-top-features{position:absolute!important;right:18px!important;top:9px!important;width:min(390px,40vw)!important;z-index:7!important;display:grid!important;grid-template-columns:repeat(4,1fr)!important}
      .pp-approved-top-features>div{text-align:center!important;color:#fff!important;min-width:0!important;padding:0 5px!important}
      .pp-approved-top-features>div+div{border-left:1px solid #ffffff1c!important}
      .pp-approved-top-features span{display:block!important;color:#ff7800!important;font-size:22px!important;line-height:20px!important}
      .pp-approved-top-features b{display:block!important;font-size:8px!important;letter-spacing:.08em!important;line-height:1.1!important}
      .pp-approved-top-features small{display:block!important;color:#879ba5!important;font-size:6px!important;margin-top:2px!important}
      .pp-approved-bottom-features{position:absolute!important;left:18px!important;bottom:7px!important;z-index:7!important;display:grid!important;grid-template-columns:repeat(4,auto)!important;gap:22px!important}
      .pp-approved-bottom-features>div{display:flex!important;align-items:center!important;gap:5px!important;color:#dbe5e9!important;font-size:7px!important}
      .pp-approved-bottom-features span{color:#ff7800!important;font-size:14px!important}
      body[data-pp-theme="light"] .hero.pp-approved-orange-hero{background:#e8eef1!important;border-bottom-color:#c1d0d6!important}
      body[data-pp-theme="light"] .pp-approved-orange-art{opacity:.72!important}
      body[data-pp-theme="light"] .pp-approved-orange-overlay{background:linear-gradient(90deg,#edf3f5f5 0%,#edf3f5d4 27%,#edf3f57a 52%,#edf3f523 80%,#edf3f50a 100%)!important}
      body[data-pp-theme="light"] .pp-approved-orange-copy h1{color:#17232b!important;text-shadow:none!important}
      body[data-pp-theme="light"] .pp-approved-orange-copy p{color:#405761!important;text-shadow:none!important}
      body[data-pp-theme="light"] .pp-approved-ghost{color:#263e48!important;background:#ffffffd9!important;border-color:#aebfc7!important}
      body[data-pp-theme="light"] .pp-approved-top-features b,body[data-pp-theme="light"] .pp-approved-bottom-features b{color:#263e48!important}
      body[data-pp-theme="light"] .pp-approved-top-features small{color:#617680!important}
      @media(max-width:850px){.hero.pp-approved-orange-hero{height:370px!important;min-height:370px!important}.pp-approved-orange-copy{top:48px!important;width:55vw!important}.pp-approved-top-features{right:10px!important;width:42vw!important}.pp-approved-orange-copy h1{font-size:38px!important}}
      @media(max-width:650px){.hero.pp-approved-orange-hero{height:500px!important;min-height:500px!important}.pp-approved-orange-art{background-position:60% center!important;background-size:auto 100%!important;opacity:.55!important}.pp-approved-orange-overlay{background:linear-gradient(90deg,#061019f4 0%,#061019d8 46%,#06101955 100%)!important}.pp-approved-orange-copy{left:18px!important;top:30px!important;width:auto!important;right:18px!important}.pp-approved-orange-copy h1{font-size:36px!important}.pp-approved-top-features{top:240px!important;left:18px!important;right:18px!important;width:auto!important}.pp-approved-bottom-features{left:12px!important;right:12px!important;bottom:10px!important;grid-template-columns:repeat(2,1fr)!important;gap:5px!important}.pp-approved-bottom-features>div{background:#061019a8!important;border:1px solid #ffffff12!important;border-radius:7px!important;padding:5px 7px!important}}`;
    document.head.appendChild(style);
  }
  return true;
}
function boot(){if(install())return;const t=setInterval(()=>{if(install())clearInterval(t)},50);setTimeout(()=>clearInterval(t),15000)}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();