(()=>{
  'use strict';
  if(window.__printProfitFinalThemeInstalled)return;
  window.__printProfitFinalThemeInstalled=true;

  function install(){
    const old=document.getElementById('ppFinalThemeStyles');
    if(old)old.remove();

    const style=document.createElement('style');
    style.id='ppFinalThemeStyles';
    style.textContent=`
      :root{
        --accent:#ff7800!important;
        --pp-orange:#ff7800!important;
        --pp-orange2:#ff9b3d!important;
      }
      .header.pp-pretty-header:after,.hero.pp-pretty-hero:after{background:linear-gradient(90deg,transparent,#ff7800,#ff9b3d,#ff7800,transparent)!important}
      .nav a:after{background:#ff7800!important}
      .nav a:hover,.nav a.active{color:#fff!important;background:#ff780012!important}
      .pp-hero-eyebrow,.pp-hero-copy h1 span,.pp-hero-features span,#deliveryRateOut{color:#ff7800!important}
      .pp-hero-copy p:after{background:#ff7800!important;box-shadow:0 0 14px #ff780066!important}
      .icon{background:#ff7800!important}
      .btn.accent{background:#ff7800!important;border-color:#ff7800!important}
      .tab.active,.quick .btn.active{background:#ff7800!important;border-color:#ff7800!important}
      .drop{border-color:#ff7800!important}
      .pp-hero-features span{border-color:#ff78004d!important;background:#ff780010!important}
      .pp-mode-toggle input:checked{background:#ff7800!important;border-color:#ff7800!important}
      .pp-hero-art img,.pp-header-logo{filter:drop-shadow(0 14px 28px #000a)!important}
      .hero.pp-pretty-hero{background:radial-gradient(circle at 18% 40%,#ff780012 0%,transparent 34%),radial-gradient(circle at 58% 0%,#18384d 0%,transparent 44%),linear-gradient(135deg,#07131c 0%,#0a1b27 56%,#061019 100%)!important}
      .pp-hero-features>div{background:transparent!important}
      .pp-brand-fallback{color:#ff7800!important}
    `;
    document.head.appendChild(style);
    document.querySelectorAll('.pp-hero-slogan').forEach(node=>node.remove());
  }

  function wait(){
    install();
    let count=0;
    const timer=setInterval(()=>{
      install();
      if(++count>=20)clearInterval(timer);
    },250);
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',wait,{once:true});
  else wait();
})();
