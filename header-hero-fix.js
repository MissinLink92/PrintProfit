(()=>{
  'use strict';
  if(window.__printProfitHeaderHeroFixInstalled)return;
  window.__printProfitHeaderHeroFixInstalled=true;

  function install(){
    const header=document.querySelector('.header.pp-pretty-header,.header');
    const brand=document.querySelector('.brand');
    const nav=document.querySelector('.nav');
    const mode=document.querySelector('.mode');
    const hero=document.querySelector('.hero.pp-pretty-hero,.hero');
    const art=hero?.querySelector('.pp-hero-art');
    if(!header||!brand||!nav||!mode||!hero||!art)return false;

    // Rebuild only the brand image node so the header cannot inherit the broken
    // legacy inline image/flex sizing.
    const href=brand.getAttribute('href')||'#home';
    brand.innerHTML='';
    brand.setAttribute('href',href);
    const logo=document.createElement('img');
    logo.className='pp-header-logo';
    logo.src='./assets/logo-orange.webp';
    logo.alt='PrintProfit 3D printing cost and pricing calculator';
    brand.appendChild(logo);

    const style=document.createElement('style');
    style.id='ppHeaderHeroFixStyles';
    style.textContent=`
      /* Header: fixed three-zone layout — logo / centred navigation / mode toggle. */
      .header.pp-pretty-header,.header{
        display:grid!important;
        grid-template-columns:minmax(250px,300px) minmax(0,1fr) max-content!important;
        align-items:center!important;
        gap:12px!important;
        width:100%!important;
        min-width:0!important;
        box-sizing:border-box!important;
      }
      .header .brand,.header.pp-pretty-header .brand{
        grid-column:1!important;
        min-width:0!important;
        width:100%!important;
        height:54px!important;
        display:flex!important;
        align-items:center!important;
        justify-content:flex-start!important;
        flex:none!important;
        overflow:visible!important;
      }
      .header .brand .pp-header-logo{
        display:block!important;
        width:260px!important;
        height:auto!important;
        max-width:100%!important;
        max-height:54px!important;
        object-fit:contain!important;
      }
      .header .nav,.header.pp-pretty-header .nav{
        grid-column:2!important;
        width:100%!important;
        min-width:0!important;
        display:flex!important;
        justify-content:center!important;
        align-items:center!important;
        overflow:visible!important;
      }
      .header .mode,.header.pp-pretty-header .mode{
        grid-column:3!important;
        justify-self:end!important;
        margin:0!important;
        white-space:nowrap!important;
      }

      /* Hero: let the artwork act like a layered brand lock-up rather than a
         separate right-hand image box. */
      .hero.pp-pretty-hero{overflow:hidden!important;position:relative!important}
      .hero.pp-pretty-hero .pp-hero-content{width:100%!important;max-width:none!important;margin:0!important;min-height:235px!important}
      .hero.pp-pretty-hero .pp-hero-copy{
        position:relative!important;
        z-index:4!important;
        width:100%!important;
        box-sizing:border-box!important;
        padding:26px 390px 84px 70px!important;
        text-align:center!important;
      }
      .hero.pp-pretty-hero .pp-hero-art{
        position:absolute!important;
        right:-18px!important;
        top:-4px!important;
        width:405px!important;
        height:235px!important;
        display:flex!important;
        justify-content:flex-end!important;
        align-items:flex-end!important;
        z-index:7!important;
        pointer-events:none!important;
        overflow:visible!important;
      }
      .hero.pp-pretty-hero .pp-hero-art img{
        display:block!important;
        width:330px!important;
        height:auto!important;
        max-width:none!important;
        object-fit:contain!important;
        object-position:right bottom!important;
        transform:translateY(3px)!important;
        filter:drop-shadow(0 15px 28px #000b)!important;
      }
      .hero.pp-pretty-hero .pp-hero-features{
        left:28px!important;
        right:330px!important;
        bottom:10px!important;
        z-index:5!important;
      }

      @media(max-width:1100px){
        .header.pp-pretty-header,.header{grid-template-columns:220px minmax(0,1fr) max-content!important}
        .header .brand .pp-header-logo{width:210px!important}
        .hero.pp-pretty-hero .pp-hero-content{min-height:225px!important}
        .hero.pp-pretty-hero .pp-hero-copy{padding:25px 315px 82px 32px!important}
        .hero.pp-pretty-hero .pp-hero-art{right:-14px!important;width:335px!important;height:225px!important}
        .hero.pp-pretty-hero .pp-hero-art img{width:285px!important}
        .hero.pp-pretty-hero .pp-hero-features{left:16px!important;right:280px!important}
      }
      @media(max-width:850px){
        .header.pp-pretty-header,.header{grid-template-columns:minmax(0,1fr) max-content!important}
        .header .brand{grid-column:1!important}
        .header .nav{grid-column:1 / -1!important;grid-row:2!important;justify-content:flex-start!important;overflow-x:auto!important}
        .header .mode{grid-column:2!important}
        .hero.pp-pretty-hero .pp-hero-content{min-height:240px!important}
        .hero.pp-pretty-hero .pp-hero-copy{padding:25px 18px 92px!important;text-align:left!important}
        .hero.pp-pretty-hero .pp-hero-copy p:after{margin-left:0!important}
        .hero.pp-pretty-hero .pp-hero-art{right:-55px!important;opacity:.42!important;width:300px!important;height:235px!important}
        .hero.pp-pretty-hero .pp-hero-art img{width:285px!important}
        .hero.pp-pretty-hero .pp-hero-features{left:12px!important;right:12px!important;grid-template-columns:repeat(3,minmax(0,1fr))!important}
        .hero.pp-pretty-hero .pp-hero-features>div:nth-child(n+4){display:none!important}
      }
      @media(max-width:560px){
        .header .brand .pp-header-logo{width:180px!important}
        .hero.pp-pretty-hero .pp-hero-copy{padding:22px 12px 76px!important}
        .hero.pp-pretty-hero .pp-hero-art{right:-90px!important;opacity:.25!important}
        .hero.pp-pretty-hero .pp-hero-features{right:8px!important;left:8px!important}
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
