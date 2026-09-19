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

    const href=brand.getAttribute('href')||'#home';
    brand.innerHTML='';
    brand.setAttribute('href',href);

    const logo=document.createElement('img');
    logo.className='pp-header-logo';
    logo.src='./assets/printprofit-header-logo.webp';
    logo.alt='PrintProfit';
    logo.addEventListener('error',()=>brand.classList.add('pp-logo-missing'),{once:true});
    brand.appendChild(logo);

    const fallback=document.createElement('span');
    fallback.className='pp-brand-fallback';
    fallback.textContent='PRINTPROFIT';
    brand.appendChild(fallback);

    let style=document.getElementById('ppHeaderHeroFixStyles');
    if(!style){
      style=document.createElement('style');
      style.id='ppHeaderHeroFixStyles';
      style.textContent=`
        /* Header matched to the supplied reference: logo / centred nav / mode. */
        .header.pp-pretty-header,.header{
          display:grid!important;
          grid-template-columns:minmax(0,1fr) auto minmax(0,1fr)!important;
          align-items:center!important;
          gap:18px!important;
          width:100%!important;
          min-width:0!important;
          min-height:64px!important;
          padding:6px clamp(14px,3vw,42px)!important;
          box-sizing:border-box!important;
        }
        .header .brand,.header.pp-pretty-header .brand{
          grid-column:1!important;
          justify-self:start!important;
          min-width:0!important;
          width:auto!important;
          height:50px!important;
          display:flex!important;
          align-items:center!important;
          justify-content:flex-start!important;
          gap:0!important;
          overflow:visible!important;
          text-decoration:none!important;
        }
        .header .brand .pp-header-logo{
          display:block!important;
          width:min(230px,22vw)!important;
          height:auto!important;
          max-width:230px!important;
          max-height:48px!important;
          object-fit:contain!important;
          object-position:left center!important;
          filter:drop-shadow(0 6px 14px #0008)!important;
        }
        .pp-brand-fallback{display:none!important;font-weight:900;letter-spacing:.08em;font-size:20px;color:#0798ff;text-shadow:0 2px 12px #0008}
        .pp-logo-missing .pp-header-logo{display:none!important}
        .pp-logo-missing .pp-brand-fallback{display:block!important}

        .header .nav,.header.pp-pretty-header .nav{
          grid-column:2!important;
          width:auto!important;
          min-width:0!important;
          display:flex!important;
          justify-content:center!important;
          align-items:center!important;
          overflow:visible!important;
          gap:4px!important;
        }
        .header .mode,.header.pp-pretty-header .mode{
          grid-column:3!important;
          justify-self:end!important;
          margin:0!important;
          white-space:nowrap!important;
        }

        /* Hero: title centred, reference artwork locked to the right. */
        .hero.pp-pretty-hero{overflow:hidden!important;position:relative!important;min-height:235px!important}
        .hero.pp-pretty-hero .pp-hero-content{width:100%!important;max-width:none!important;margin:0!important;min-height:235px!important;position:relative!important}
        .hero.pp-pretty-hero .pp-hero-copy{
          position:relative!important;
          z-index:4!important;
          width:100%!important;
          box-sizing:border-box!important;
          padding:28px 360px 78px 60px!important;
          text-align:center!important;
        }
        .hero.pp-pretty-hero .pp-hero-art{
          position:absolute!important;
          right:-8px!important;
          top:0!important;
          width:390px!important;
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
          transform:translateY(2px)!important;
          filter:hue-rotate(180deg) saturate(1.08) drop-shadow(0 15px 28px #000b)!important;
        }
        .hero.pp-pretty-hero .pp-hero-features{
          left:28px!important;
          right:335px!important;
          bottom:9px!important;
          z-index:8!important;
        }

        @media(max-width:1100px){
          .header.pp-pretty-header,.header{grid-template-columns:minmax(0,1fr) auto minmax(0,1fr)!important}
          .header .brand .pp-header-logo{width:200px!important}
          .hero.pp-pretty-hero,.hero.pp-pretty-hero .pp-hero-content{min-height:225px!important}
          .hero.pp-pretty-hero .pp-hero-copy{padding:25px 300px 80px 30px!important}
          .hero.pp-pretty-hero .pp-hero-art{right:-12px!important;width:325px!important;height:225px!important}
          .hero.pp-pretty-hero .pp-hero-art img{width:280px!important}
          .hero.pp-pretty-hero .pp-hero-features{left:16px!important;right:275px!important}
        }
        @media(max-width:850px){
          .header.pp-pretty-header,.header{grid-template-columns:minmax(0,1fr) auto!important;grid-template-rows:auto auto!important}
          .header .brand{grid-column:1!important;grid-row:1!important}
          .header .mode{grid-column:2!important;grid-row:1!important}
          .header .nav{grid-column:1 / -1!important;grid-row:2!important;justify-content:flex-start!important;overflow-x:auto!important;width:100%!important}
          .hero.pp-pretty-hero,.hero.pp-pretty-hero .pp-hero-content{min-height:245px!important}
          .hero.pp-pretty-hero .pp-hero-copy{padding:25px 18px 92px!important;text-align:left!important}
          .hero.pp-pretty-hero .pp-hero-copy p:after{margin-left:0!important}
          .hero.pp-pretty-hero .pp-hero-art{right:-65px!important;opacity:.42!important;width:310px!important;height:240px!important}
          .hero.pp-pretty-hero .pp-hero-art img{width:290px!important}
          .hero.pp-pretty-hero .pp-hero-features{left:12px!important;right:12px!important;grid-template-columns:repeat(3,minmax(0,1fr))!important}
          .hero.pp-pretty-hero .pp-hero-features>div:nth-child(n+4){display:none!important}
        }
        @media(max-width:560px){
          .header .brand .pp-header-logo{width:175px!important}
          .hero.pp-pretty-hero,.hero.pp-pretty-hero .pp-hero-content{min-height:230px!important}
          .hero.pp-pretty-hero .pp-hero-copy{padding:22px 12px 82px!important}
          .hero.pp-pretty-hero .pp-hero-art{right:-105px!important;opacity:.24!important}
          .hero.pp-pretty-hero .pp-hero-features{right:8px!important;left:8px!important}
        }
      `;
      document.head.appendChild(style);
    }
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
