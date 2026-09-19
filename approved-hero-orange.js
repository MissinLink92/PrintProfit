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
      <div class="pp-approved-orange-art" aria-hidden="true"></div>
      <div class="pp-approved-orange-overlay" aria-hidden="true"></div>
      <div class="pp-approved-orange-copy">
        <div class="pp-approved-kicker"><span></span>3D PRINTING PRICING, MADE SIMPLE</div>
        <h1>Know what it costs.<br><strong>Know what to charge.</strong></h1>
        <p>Accurate 3D printing cost and pricing calculations to help you price with confidence and maximise your profit.</p>
        <div class="pp-approved-buttons"><a href="#calculator" class="pp-approved-main">Start Calculating <b>›</b></a><a href="#guides" class="pp-approved-ghost">Learn More <b>›</b></a></div>
      </div>
      <div class="pp-approved-brand-card">
        <div class="pp-approved-glow"></div>
        <img src="./assets/printprofit-header-logo.webp" alt="PrintProfit">
        <div class="pp-approved-tagline">Print Smarter.<br>Price Better.<br>Profit More.</div>
      </div>
      <div class="pp-approved-features" aria-label="PrintProfit features">
        <div><span class="pp-feature-icon">▦</span><span><b>Calculate</b><small>Costs</small></span></div>
        <div><span class="pp-feature-icon">◇</span><span><b>Price</b><small>Your Prints</small></span></div>
        <div><span class="pp-feature-icon">▥</span><span><b>Maximise</b><small>Profit</small></span></div>
        <div><span class="pp-feature-icon">⚙</span><span><b>Built</b><small>For Makers</small></span></div>
      </div>
    `;
    hero.appendChild(stage);
  }

  if(!document.getElementById('ppApprovedOrangeHeroStyles')){
    const style=document.createElement('style');
    style.id='ppApprovedOrangeHeroStyles';
    style.textContent=`
      .hero.pp-approved-orange-hero{height:330px!important;min-height:330px!important;position:relative!important;overflow:hidden!important;border-bottom:1px solid #263d49!important;background:#061019!important;isolation:isolate!important}
      .pp-approved-orange-stage{position:absolute!important;inset:0!important;overflow:hidden!important}
      .pp-approved-orange-art{position:absolute!important;inset:0!important;background-image:url('./assets/hero-art-orange.webp')!important;background-repeat:no-repeat!important;background-position:center right!important;background-size:cover!important;opacity:.96!important;z-index:0!important}
      .pp-approved-orange-overlay{position:absolute!important;inset:0!important;background:linear-gradient(90deg,#061019 0%,#061019e8 27%,#061019a8 50%,#06101935 75%,#06101918 100%)!important;z-index:1!important}
      .pp-approved-orange-overlay:after{content:""!important;position:absolute!important;inset:0!important;background:linear-gradient(180deg,#00000028 0%,transparent 55%,#00000066 100%)!important}
      .pp-approved-orange-copy{position:absolute!important;left:clamp(22px,3.2vw,52px)!important;top:43px!important;width:min(620px,48vw)!important;z-index:5!important}
      .pp-approved-kicker{display:flex!important;align-items:center!important;gap:8px!important;color:#ff7800!important;font-size:9px!important;font-weight:900!important;letter-spacing:.19em!important}
      .pp-approved-kicker span{width:28px!important;height:2px!important;background:#ff7800!important;box-shadow:0 0 10px #ff780088!important}
      .pp-approved-orange-copy h1{margin:10px 0 0!important;color:#fff!important;font-size:clamp(35px,3.6vw,58px)!important;line-height:.94!important;letter-spacing:-.045em!important;font-weight:950!important;text-shadow:0 5px 24px #000d!important}
      .pp-approved-orange-copy h1 strong{color:#ff7800!important;font-weight:950!important;text-shadow:0 0 28px #ff780033!important}
      .pp-approved-orange-copy p{margin:13px 0 0!important;max-width:560px!important;color:#d1dce2!important;font-size:12px!important;line-height:1.45!important;text-shadow:0 2px 10px #000b!important}
      .pp-approved-buttons{display:flex!important;gap:8px!important;margin-top:16px!important}
      .pp-approved-main,.pp-approved-ghost{display:inline-flex!important;align-items:center!important;gap:8px!important;text-decoration:none!important;border-radius:6px!important;padding:9px 13px!important;font-size:10px!important;font-weight:850!important;transition:.18s ease!important}
      .pp-approved-main{color:#fff!important;background:linear-gradient(135deg,#ff8a16,#f06b00)!important;border:1px solid #ff7800!important;box-shadow:0 8px 20px #0008,0 0 18px #ff780022!important}
      .pp-approved-ghost{color:#edf4f7!important;background:#07151ed9!important;border:1px solid #47606c!important}
      .pp-approved-main:hover,.pp-approved-ghost:hover{transform:translateY(-2px)!important}
      .pp-approved-main:hover{filter:brightness(1.08)!important}
      .pp-approved-brand-card{position:absolute!important;right:clamp(24px,4vw,62px)!important;top:32px!important;width:min(310px,25vw)!important;height:174px!important;z-index:5!important;display:flex!important;align-items:center!important;justify-content:center!important;border:1px solid #294552!important;border-radius:15px!important;background:linear-gradient(145deg,#071923e8,#06111ae8)!important;box-shadow:inset 0 1px 0 #ffffff0d,0 20px 48px #000b!important;overflow:hidden!important}
      .pp-approved-glow{position:absolute!important;width:170px!important;height:120px!important;border-radius:50%!important;background:#ff780018!important;filter:blur(28px)!important}
      .pp-approved-brand-card img{position:relative!important;width:82%!important;height:auto!important;max-height:80px!important;object-fit:contain!important;filter:drop-shadow(0 6px 16px #000d)!important}
      .pp-approved-tagline{position:absolute!important;right:18px!important;bottom:12px!important;color:#ff7800!important;font-size:11px!important;line-height:1.05!important;font-weight:800!important;font-style:italic!important;font-family:cursive!important;text-align:right!important;text-shadow:0 2px 9px #000!important}
      .pp-approved-features{position:absolute!important;left:clamp(22px,3.2vw,52px)!important;right:clamp(24px,4vw,62px)!important;bottom:11px!important;z-index:6!important;display:grid!important;grid-template-columns:repeat(4,1fr)!important;max-width:780px!important;border-top:1px solid #ffffff18!important;padding-top:8px!important}
      .pp-approved-features>div{display:flex!important;align-items:center!important;justify-content:center!important;gap:7px!important;color:#fff!important;min-width:0!important}
      .pp-approved-features>div+div{border-left:1px solid #ffffff18!important}
      .pp-feature-icon{color:#ff7800!important;font-size:21px!important;line-height:1!important;text-shadow:0 0 10px #ff780055!important}
      .pp-approved-features b,.pp-approved-features small{display:block!important;text-align:left!important}
      .pp-approved-features b{font-size:9px!important;line-height:1.05!important;font-weight:900!important}
      .pp-approved-features small{font-size:7px!important;color:#9cafb8!important;margin-top:2px!important}

      body[data-pp-theme="light"] .hero.pp-approved-orange-hero{background:#e8eef1!important;border-bottom-color:#c1d0d6!important}
      body[data-pp-theme="light"] .pp-approved-orange-art{opacity:.82!important}
      body[data-pp-theme="light"] .pp-approved-orange-overlay{background:linear-gradient(90deg,#edf3f5ee 0%,#edf3f5d8 28%,#edf3f59a 52%,#edf3f53b 78%,#edf3f510 100%)!important}
      body[data-pp-theme="light"] .pp-approved-orange-copy h1{color:#17232b!important;text-shadow:none!important}
      body[data-pp-theme="light"] .pp-approved-orange-copy p{color:#405761!important;text-shadow:none!important}
      body[data-pp-theme="light"] .pp-approved-brand-card{background:linear-gradient(145deg,#ffffffed,#f1f5f6ed)!important;border-color:#c1d0d6!important;box-shadow:0 15px 35px #17323f1c!important}
      body[data-pp-theme="light"] .pp-approved-brand-card img{filter:none!important}
      body[data-pp-theme="light"] .pp-approved-ghost{color:#263e48!important;background:#ffffffd9!important;border-color:#aebfc7!important}
      body[data-pp-theme="light"] .pp-approved-features{border-top-color:#17323f22!important}
      body[data-pp-theme="light"] .pp-approved-features>div+div{border-left-color:#17323f22!important}
      body[data-pp-theme="light"] .pp-approved-features b{color:#263e48!important}
      body[data-pp-theme="light"] .pp-approved-features small{color:#617680!important}

      @media(max-width:950px){
        .hero.pp-approved-orange-hero{height:360px!important;min-height:360px!important}
        .pp-approved-orange-copy{top:34px!important;width:58vw!important}
        .pp-approved-brand-card{right:24px!important;width:270px!important;height:150px!important}
        .pp-approved-orange-copy h1{font-size:43px!important}
      }
      @media(max-width:700px){
        .hero.pp-approved-orange-hero{height:500px!important;min-height:500px!important}
        .pp-approved-orange-art{background-position:62% center!important;background-size:auto 100%!important;opacity:.62!important}
        .pp-approved-orange-overlay{background:linear-gradient(90deg,#061019f2 0%,#061019d9 46%,#06101955 100%)!important}
        .pp-approved-orange-copy{left:18px!important;right:18px!important;top:27px!important;width:auto!important}
        .pp-approved-orange-copy h1{font-size:37px!important}
        .pp-approved-orange-copy p{font-size:11px!important;max-width:430px!important}
        .pp-approved-brand-card{left:18px!important;right:18px!important;top:238px!important;width:auto!important;height:150px!important}
        .pp-approved-features{left:12px!important;right:12px!important;bottom:12px!important;grid-template-columns:repeat(2,1fr)!important;gap:7px!important;border-top:0!important}
        .pp-approved-features>div{justify-content:flex-start!important;padding:5px 7px!important;background:#0610199c!important;border:1px solid #ffffff12!important;border-radius:8px!important}
        .pp-approved-features>div+div{border-left:1px solid #ffffff12!important}
      }
      @media(max-width:430px){
        .hero.pp-approved-orange-hero{height:520px!important;min-height:520px!important}
        .pp-approved-orange-copy h1{font-size:33px!important}
        .pp-approved-brand-card{top:230px!important;height:145px!important}
        .pp-approved-features{bottom:10px!important}
        .pp-feature-icon{font-size:18px!important}.pp-approved-features b{font-size:8px!important}.pp-approved-features small{font-size:6.5px!important}
      }
    `;
    document.head.appendChild(style);
  }
  return true;
}
function boot(){if(install())return;const t=setInterval(()=>{if(install())clearInterval(t)},50);setTimeout(()=>clearInterval(t),15000)}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
