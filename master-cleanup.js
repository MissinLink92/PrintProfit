(()=>{
'use strict';
if(window.__printProfitMasterCleanup)return;window.__printProfitMasterCleanup=true;

function install(){
  const hero=document.querySelector('.hero');
  const buttons=hero?.querySelector('.pp-hero-buttons');
  const holders=[...document.querySelectorAll('section.panel .head>.icon, .merge-block .head>.icon')];
  if(!hero||!buttons||!holders.length)return false;

  // Hero CTA: use the wording from the master design and keep it clear of the ticker.
  const primary=buttons.querySelector('.pp-main-cta');
  const secondary=buttons.querySelector('.pp-ghost-cta');
  if(primary){
    primary.innerHTML='<span class="pp-clean-cta-icon">▦</span><span>Start Calculating</span><b>→</b>';
    primary.setAttribute('aria-label','Start Calculating');
  }
  if(secondary){
    secondary.innerHTML='<span>Learn More</span><b>›</b>';
    secondary.setAttribute('aria-label','Learn More');
  }

  // Section icons: match the supplied reference: orange line-art inside a thin orange circle.
  holders.forEach(h=>h.classList.add('pp-master-circular'));

  document.getElementById('ppMasterCleanupStyles')?.remove();
  const style=document.createElement('style');
  style.id='ppMasterCleanupStyles';
  style.textContent=`
    .hero .pp-hero-copy2{position:relative!important;z-index:30!important}
    .hero .pp-hero-buttons{position:relative!important;z-index:40!important;display:flex!important;align-items:center!important;gap:10px!important;margin-top:22px!important}
    .hero .pp-hero-buttons>*{position:relative!important;z-index:41!important}
    .hero .pp-clean-cta-icon{font-size:13px!important;line-height:1!important;border:1px solid rgba(255,255,255,.45)!important;border-radius:4px!important;padding:1px 2px!important}

    section.panel .head>.pp-master-circular,
    .merge-block .head>.pp-master-circular{
      width:48px!important;height:48px!important;min-width:48px!important;
      border-radius:50%!important;
      display:grid!important;place-items:center!important;
      background:rgba(255,120,0,.025)!important;
      border:2px solid rgba(255,120,0,.82)!important;
      color:#ff7800!important;
      box-shadow:0 0 0 1px rgba(255,120,0,.08),0 8px 22px rgba(0,0,0,.34),0 0 22px rgba(255,120,0,.10)!important;
      overflow:hidden!important;
    }
    section.panel .head>.pp-master-circular::before,
    section.panel .head>.pp-master-circular::after,
    .merge-block .head>.pp-master-circular::before,
    .merge-block .head>.pp-master-circular::after{display:none!important}
    section.panel .head>.pp-master-circular svg,
    .merge-block .head>.pp-master-circular svg{
      width:27px!important;height:27px!important;
      fill:none!important;stroke:#ff7800!important;stroke-width:1.9!important;
      stroke-linecap:round!important;stroke-linejoin:round!important;
      filter:drop-shadow(0 0 6px rgba(255,120,0,.28))!important;
    }
    section.panel .head>.pp-master-circular:hover,
    .merge-block .head>.pp-master-circular:hover{
      transform:translateY(-2px) scale(1.035)!important;
      border-color:#ff9a42!important;
      box-shadow:0 0 0 1px rgba(255,120,0,.12),0 12px 28px rgba(0,0,0,.42),0 0 30px rgba(255,120,0,.16)!important;
    }
    @media(max-width:560px){
      section.panel .head>.pp-master-circular,.merge-block .head>.pp-master-circular{width:42px!important;height:42px!important;min-width:42px!important}
      section.panel .head>.pp-master-circular svg,.merge-block .head>.pp-master-circular svg{width:24px!important;height:24px!important}
    }
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
