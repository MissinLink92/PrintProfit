(()=>{
  'use strict';
  if(window.__printProfitHeroCompositionInstalled)return;
  window.__printProfitHeroCompositionInstalled=true;

  function install(){
    const hero=document.querySelector('.hero.pp-pretty-hero');
    if(!hero||hero.dataset.ppHeroComposition)return false;
    hero.dataset.ppHeroComposition='1';

    const style=document.createElement('style');
    style.id='ppHeroCompositionStyles';
    style.textContent=`
      /* Layered hero artwork: logo + slogan + dragon as one branded lock-up. */
      .hero.pp-pretty-hero{isolation:isolate}
      .pp-hero-art{
        right:-4px!important;
        top:0!important;
        width:330px!important;
        height:205px!important;
        z-index:6!important;
        overflow:visible!important;
        pointer-events:none!important;
      }
      .pp-hero-art img{
        width:270px!important;
        height:205px!important;
        max-width:none!important;
        object-fit:fill!important;
        object-position:right bottom!important;
        transform:translateX(0)!important;
        filter:drop-shadow(0 14px 26px #000a)!important;
      }
      .pp-hero-copy{
        z-index:4!important;
      }
      .pp-hero-features{
        right:18px!important;
        z-index:5!important;
      }
      .pp-hero-art:before{
        content:"";
        position:absolute;
        right:0;
        bottom:0;
        width:270px;
        height:205px;
        background:linear-gradient(90deg,transparent 0%,transparent 54%,#07131d05 100%);
        pointer-events:none;
        z-index:-1;
      }
      @media(max-width:1100px){
        .pp-hero-art{right:-8px!important;width:300px!important}
        .pp-hero-art img{width:255px!important;height:194px!important}
      }
      @media(max-width:850px){
        .pp-hero-art{right:-18px!important;top:0!important;width:280px!important;height:220px!important;opacity:.5!important}
        .pp-hero-art img{width:270px!important;height:205px!important}
        .pp-hero-copy{position:relative;z-index:4!important}
      }
      @media(max-width:560px){
        .pp-hero-art{right:-68px!important;opacity:.24!important}
        .pp-hero-features{right:12px!important}
      }
    `;
    document.head.appendChild(style);
    return true;
  }

  function wait(){
    if(install())return;
    const started=Date.now();
    const timer=setInterval(()=>{
      if(install()||Date.now()-started>=15000)clearInterval(timer);
    },50);
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',wait,{once:true});
  else wait();
})();
