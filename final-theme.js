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
        --accent:#0798ff!important;
        --pp-orange:#0798ff!important;
        --pp-orange2:#42bcff!important;
      }
      .header.pp-pretty-header:after,.hero.pp-pretty-hero:after{background:linear-gradient(90deg,transparent,#0798ff,#42bcff,#0798ff,transparent)!important}
      .nav a:after{background:#0798ff!important}
      .nav a:hover,.nav a.active{color:#fff!important;background:#0798ff12!important}
      .pp-hero-eyebrow,.pp-hero-copy h1 span,.pp-hero-features span,#deliveryRateOut{color:#0798ff!important}
      .pp-hero-copy p:after{background:#0798ff!important;box-shadow:0 0 14px #0798ff66!important}
      .icon{background:#0798ff!important}
      .btn.accent{background:#0798ff!important;border-color:#0798ff!important}
      .tab.active,.quick .btn.active{background:#0798ff!important;border-color:#0798ff!important}
      .drop{border-color:#0798ff!important}
      .pp-hero-features span{border-color:#0798ff4d!important;background:#0798ff10!important}
      .pp-mode-toggle input:checked{background:#0798ff!important;border-color:#0798ff!important}
      .pp-hero-art img,.pp-header-logo{filter:hue-rotate(180deg) saturate(1.08) drop-shadow(0 14px 28px #000a)!important}
      .hero.pp-pretty-hero{background:radial-gradient(circle at 18% 40%,#0798ff12 0%,transparent 34%),radial-gradient(circle at 58% 0%,#18384d 0%,transparent 44%),linear-gradient(135deg,#07131c 0%,#0a1b27 56%,#061019 100%)!important}
      .pp-hero-features>div{background:transparent!important}
      .pp-brand-fallback{color:#0798ff!important}
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
