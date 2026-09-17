(()=>{
  'use strict';
  if(window.__printProfitFinalThemeInstalled)return;
  window.__printProfitFinalThemeInstalled=true;

  function install(){
    if(document.getElementById('ppFinalThemeStyles'))return;
    const style=document.createElement('style');
    style.id='ppFinalThemeStyles';
    style.textContent=`
      /* PrintProfit master visual theme — blue reference design */
      :root{
        --accent:#0798ff!important;
        --pp-orange:#0798ff!important;
        --pp-orange2:#42bcff!important;
      }
      .header.pp-pretty-header:after,
      .hero.pp-pretty-hero:after{background:linear-gradient(90deg,transparent,#0798ff,#42bcff,#0798ff,transparent)!important}
      .nav a:after{background:#0798ff!important}
      .nav a:hover,.nav a.active{color:#fff!important;background:#0798ff12!important}
      .pp-hero-eyebrow,.pp-hero-copy h1 span,
      .pp-hero-features span,#deliveryRateOut{color:#0798ff!important}
      .pp-hero-copy p:after{background:#0798ff!important;box-shadow:0 0 14px #0798ff66!important}
      .icon{background:#0798ff!important}
      .btn.accent{background:#0798ff!important;border-color:#0798ff!important}
      .tab.active,.quick .btn.active{background:#0798ff!important;border-color:#0798ff!important}
      .drop{border-color:#0798ff!important}
      .pp-hero-features span{border-color:#0798ff4d!important;background:#0798ff10!important}
      .pp-mode-toggle input:checked{background:#0798ff!important;border-color:#0798ff!important}
      .pp-header-logo,.pp-hero-art img{filter:hue-rotate(180deg) drop-shadow(0 12px 24px #0009)!important}
      .pp-hero-art img{filter:hue-rotate(180deg) drop-shadow(0 15px 28px #000b)!important}
      .pp-hero-slogan{
        position:absolute;right:52px;top:8px;z-index:8;width:250px;text-align:center;
        color:#eef7ff;font-family:"Segoe Script","Bradley Hand",cursive;font-style:italic;
        font-weight:700;font-size:21px;line-height:1.05;transform:rotate(-3deg);
        text-shadow:0 3px 14px #000c;pointer-events:none;
      }
      .pp-hero-slogan span{display:block;color:#eef7ff}
      .pp-hero-slogan:after{content:"";display:block;width:110px;height:3px;margin:7px 0 0 auto;background:#0798ff;border-radius:50%;transform:rotate(-7deg);box-shadow:0 0 12px #0798ff88}
      @media(max-width:1100px){.pp-hero-slogan{right:28px;font-size:18px;width:210px}}
      @media(max-width:850px){.pp-hero-slogan{right:16px;top:8px;font-size:15px;width:175px;opacity:.85}.pp-hero-slogan:after{width:80px}}
      @media(max-width:560px){.pp-hero-slogan{right:6px;top:6px;font-size:12px;width:135px}.pp-hero-slogan:after{width:60px;height:2px}}
    `;
    document.head.appendChild(style);

    const hero=document.querySelector('.hero.pp-pretty-hero,.hero');
    if(hero&&!hero.querySelector('.pp-hero-slogan')){
      const slogan=document.createElement('div');
      slogan.className='pp-hero-slogan';
      slogan.innerHTML='<span>Print Smarter.</span><span>Price Better.</span><span>Profit More.</span>';
      hero.appendChild(slogan);
    }
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install,{once:true});
  else install();
})();
