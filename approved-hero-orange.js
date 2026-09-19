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
      <div class="pp-approved-object-art" aria-label="3D printed objects: vase, Benchy boat, gear and skull">
        <svg viewBox="0 0 720 300" role="img" aria-hidden="true">
          <defs>
            <linearGradient id="ppVase" x1="0" x2="1" y1="0" y2="1"><stop offset="0" stop-color="#d6d0c7"/><stop offset=".48" stop-color="#77736e"/><stop offset="1" stop-color="#282b2d"/></linearGradient>
            <linearGradient id="ppBoat" x1="0" x2="1"><stop offset="0" stop-color="#d7a66f"/><stop offset=".5" stop-color="#b96b2c"/><stop offset="1" stop-color="#603318"/></linearGradient>
            <linearGradient id="ppGear" x1="0" x2="1" y1="0" y2="1"><stop offset="0" stop-color="#aeb5b8"/><stop offset=".5" stop-color="#646a6d"/><stop offset="1" stop-color="#272b2d"/></linearGradient>
            <linearGradient id="ppSkull" x1="0" x2="1" y1="0" y2="1"><stop offset="0" stop-color="#e4e0d5"/><stop offset=".5" stop-color="#98958d"/><stop offset="1" stop-color="#383a3a"/></linearGradient>
            <filter id="ppShadow"><feGaussianBlur stdDeviation="5"/></filter>
          </defs>
          <g opacity=".45" filter="url(#ppShadow)" fill="#000">
            <ellipse cx="95" cy="272" rx="70" ry="12"/><ellipse cx="285" cy="272" rx="82" ry="12"/><ellipse cx="475" cy="272" rx="72" ry="12"/><ellipse cx="625" cy="272" rx="60" ry="12"/>
          </g>
          <g transform="translate(25 34)">
            <path d="M58 18 C59 38 61 51 51 68 C38 91 32 125 38 176 C42 211 58 229 70 237 C82 229 98 211 102 176 C108 125 102 91 89 68 C79 51 81 38 82 18Z" fill="url(#ppVase)" stroke="#16191b" stroke-width="4"/>
            <ellipse cx="70" cy="18" rx="17" ry="7" fill="#34383a" stroke="#d2cec4" stroke-width="2"/>
            <path d="M48 76 L92 215 M38 113 L102 189 M39 169 L101 134 M44 205 L96 94" fill="none" stroke="#ddd7cd" stroke-opacity=".25" stroke-width="2"/>
            <path d="M51 68 Q70 83 89 68 M40 106 Q70 126 100 106 M38 145 Q70 166 102 145 M39 184 Q70 205 101 184" fill="none" stroke="#1e2325" stroke-opacity=".55" stroke-width="2"/>
          </g>
          <g transform="translate(190 62)">
            <path d="M18 130 Q20 72 55 42 L105 42 Q132 64 153 105 L147 132 Q89 151 18 130Z" fill="url(#ppBoat)" stroke="#2b211b" stroke-width="4"/>
            <path d="M43 43 L43 11 L76 11 L76 73" fill="none" stroke="#a9642e" stroke-width="8"/>
            <path d="M54 20 L101 20 L118 45 L53 45Z" fill="#c28a54" stroke="#55351f" stroke-width="3"/>
            <path d="M32 94 Q84 111 141 91" fill="none" stroke="#e0b47f" stroke-opacity=".55" stroke-width="5"/>
            <circle cx="61" cy="76" r="5" fill="#33251c"/><circle cx="109" cy="76" r="5" fill="#33251c"/>
            <path d="M58 117 Q87 129 116 117" fill="none" stroke="#4a2c1a" stroke-width="4"/>
          </g>
          <g transform="translate(405 49)">
            <path d="M67 0 L84 14 L108 10 L116 32 L139 43 L132 65 L145 86 L126 101 L128 125 L104 127 L91 148 L69 136 L45 144 L36 121 L13 113 L18 89 L5 70 L22 52 L20 28 L44 27 L52 5Z" fill="url(#ppGear)" stroke="#25292b" stroke-width="5"/>
            <circle cx="75" cy="75" r="37" fill="#25292b" stroke="#9da3a5" stroke-width="8"/>
            <circle cx="75" cy="75" r="14" fill="#687075" stroke="#171a1b" stroke-width="5"/>
            <g fill="#c2c7c8" opacity=".28"><circle cx="75" cy="31" r="5"/><circle cx="114" cy="51" r="5"/><circle cx="111" cy="98" r="5"/><circle cx="75" cy="120" r="5"/><circle cx="36" cy="99" r="5"/><circle cx="36" cy="51" r="5"/></g>
          </g>
          <g transform="translate(550 34)">
            <path d="M58 17 Q91 4 116 25 Q139 45 134 83 Q131 107 113 123 L116 154 L129 166 L125 191 L104 201 L47 201 L26 191 L22 166 L35 154 L38 123 Q20 107 17 83 Q12 45 35 25 Q45 18 58 17Z" fill="url(#ppSkull)" stroke="#252729" stroke-width="5"/>
            <ellipse cx="52" cy="76" rx="16" ry="20" fill="#1b1e20"/><ellipse cx="103" cy="76" rx="16" ry="20" fill="#1b1e20"/>
            <path d="M72 82 L65 110 L77 113 L85 110 L78 82Z" fill="#242729"/>
            <path d="M47 132 Q77 148 107 132 L103 153 Q77 164 51 153Z" fill="#222526"/>
            <path d="M48 154 L48 190 M61 157 L61 198 M76 158 L76 201 M91 157 L91 198 M104 153 L104 190" stroke="#d0ccc2" stroke-width="4"/>
            <path d="M33 53 Q77 23 121 53" fill="none" stroke="#efebe0" stroke-opacity=".35" stroke-width="5"/>
          </g>
        </svg>
      </div>
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
      .hero.pp-approved-orange-hero{height:330px!important;min-height:330px!important;position:relative!important;overflow:hidden!important;border-bottom:1px solid #263d49!important;background:#071017!important;isolation:isolate!important}
      .pp-approved-orange-stage{position:absolute!important;inset:0!important;overflow:hidden!important}
      .pp-approved-object-art{position:absolute!important;inset:0 0 0 42%!important;z-index:0!important;display:flex!important;align-items:flex-end!important;justify-content:flex-end!important;overflow:hidden!important}
      .pp-approved-object-art svg{width:100%!important;height:100%!important;display:block!important;filter:drop-shadow(0 12px 12px #0009)!important}
      .pp-approved-orange-overlay{position:absolute!important;inset:0!important;background:linear-gradient(90deg,#071017 0%,#071017f2 30%,#071017b0 48%,#07101732 68%,#07101705 100%)!important;z-index:1!important;pointer-events:none!important}
      .pp-approved-orange-overlay:after{content:""!important;position:absolute!important;inset:0!important;background:linear-gradient(180deg,#00000020 0%,transparent 55%,#00000078 100%)!important}
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
      body[data-pp-theme="light"] .pp-approved-orange-overlay{background:linear-gradient(90deg,#edf3f5f5 0%,#edf3f5d4 27%,#edf3f57a 52%,#edf3f523 80%,#edf3f50a 100%)!important}
      body[data-pp-theme="light"] .pp-approved-orange-copy h1{color:#17232b!important;text-shadow:none!important}
      body[data-pp-theme="light"] .pp-approved-orange-copy p{color:#405761!important;text-shadow:none!important}
      body[data-pp-theme="light"] .pp-approved-ghost{color:#263e48!important;background:#ffffffd9!important;border-color:#aebfc7!important}
      body[data-pp-theme="light"] .pp-approved-top-features b,body[data-pp-theme="light"] .pp-approved-bottom-features b{color:#263e48!important}
      body[data-pp-theme="light"] .pp-approved-top-features small{color:#617680!important}
      @media(max-width:850px){.hero.pp-approved-orange-hero{height:370px!important;min-height:370px!important}.pp-approved-orange-copy{top:48px!important;width:55vw!important}.pp-approved-top-features{right:10px!important;width:42vw!important}.pp-approved-orange-copy h1{font-size:38px!important}.pp-approved-object-art{inset:8% 0 0 38%!important}}
      @media(max-width:650px){.hero.pp-approved-orange-hero{height:500px!important;min-height:500px!important}.pp-approved-object-art{inset:42% 0 0 0!important;opacity:.92!important}.pp-approved-orange-overlay{background:linear-gradient(180deg,#071017f4 0%,#071017b8 42%,#07101732 100%)!important}.pp-approved-orange-copy{left:18px!important;top:30px!important;width:auto!important;right:18px!important}.pp-approved-orange-copy h1{font-size:36px!important}.pp-approved-top-features{top:240px!important;left:18px!important;right:18px!important;width:auto!important}.pp-approved-bottom-features{left:12px!important;right:12px!important;bottom:10px!important;grid-template-columns:repeat(2,1fr)!important;gap:5px!important}.pp-approved-bottom-features>div{background:#061019a8!important;border:1px solid #ffffff12!important;border-radius:7px!important;padding:5px 7px!important}}`;
    document.head.appendChild(style);
  }
  return true;
}
function boot(){if(install())return;const t=setInterval(()=>{if(install())clearInterval(t)},50);setTimeout(()=>clearInterval(t),15000)}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();