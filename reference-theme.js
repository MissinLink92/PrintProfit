(()=>{
'use strict';
if(window.__printProfitReferenceTheme)return;window.__printProfitReferenceTheme=true;
function install(){
  const hero=document.querySelector('.hero.pp-pretty-hero,.hero');
  const header=document.querySelector('.header.pp-pretty-header,.header');
  if(!hero||!header)return false;
  let art=hero.querySelector('.pp-hero-art');
  if(!art)return false;
  document.getElementById('ppReferenceThemeStyles')?.remove();
  document.querySelectorAll('.pp-hero-eyebrow').forEach(el=>el.style.display='none');
  document.querySelectorAll('.pp-hero-copy p').forEach(el=>el.classList.add('pp-reference-subtitle'));
  let slogan=hero.querySelector('.pp-reference-slogan');
  if(!slogan){
    slogan=document.createElement('div');
    slogan.className='pp-reference-slogan';
    slogan.innerHTML='Print Smarter.<br>Price Better.<br><b>Profit More.</b>';
    hero.appendChild(slogan);
  }
  let style=document.createElement('style');
  style.id='ppReferenceThemeStyles';
  style.textContent=`
    :root{--pp-ref-blue:#0b9cff;--pp-ref-blue2:#2ab8ff}
    body.pp-pretty-body{background:#050d14!important}
    .header.pp-pretty-header,.header{
      min-height:110px!important;height:110px!important;
      padding:8px 26px!important;
      background:linear-gradient(180deg,#07131e 0%,#06111a 100%)!important;
      border-bottom:1px solid #17374a!important;
      box-shadow:0 7px 26px #0009!important;
      grid-template-columns:minmax(430px,1fr) auto minmax(280px,1fr)!important;
      gap:20px!important;
    }
    .header .brand,.header.pp-pretty-header .brand{
      width:430px!important;max-width:430px!important;height:88px!important;
      min-width:0!important;justify-self:start!important;
    }
    .header .brand .pp-header-logo,.header .brand img{
      width:430px!important;max-width:430px!important;max-height:82px!important;
      height:auto!important;filter:hue-rotate(180deg) saturate(1.08) drop-shadow(0 5px 13px #0009)!important;
    }
    .header .nav,.header.pp-pretty-header .nav{gap:10px!important;justify-content:center!important;}
    .header .nav a,.header.pp-pretty-header .nav a{
      padding:12px 15px!important;font-size:14px!important;color:#d9e5ed!important;
    }
    .header .nav a:after,.header.pp-pretty-header .nav a:after{
      left:10px!important;right:10px!important;bottom:2px!important;height:2px!important;background:var(--pp-ref-blue)!important;
    }
    .header .mode,.header.pp-pretty-header .mode{font-size:13px!important;color:#d8e5ed!important;justify-self:end!important}
    .pp-mode-toggle{gap:9px!important}
    .pp-mode-toggle input{width:48px!important;height:26px!important;background:#142734!important;border-color:#35566a!important}
    .pp-mode-toggle input:after{width:18px!important;height:18px!important;top:3px!important;left:3px!important}
    .pp-mode-toggle input:checked:after{left:25px!important}
    .pp-mode-toggle input:checked{background:var(--pp-ref-blue)!important;border-color:var(--pp-ref-blue)!important}

    .hero.pp-pretty-hero,.hero{
      min-height:177px!important;height:177px!important;
      border-bottom:1px solid #17384b!important;
      background:
        radial-gradient(circle at 14% 48%,#0798ff0d 0%,transparent 30%),
        radial-gradient(circle at 53% 0%,#16384a 0%,transparent 42%),
        linear-gradient(135deg,#07131c 0%,#091923 57%,#061019 100%)!important;
      overflow:hidden!important;
    }
    .hero.pp-pretty-hero:before{opacity:.22!important;background-size:30px 30px!important}
    .hero.pp-pretty-hero:after{background:linear-gradient(90deg,transparent,#0798ff,#42bcff,#0798ff,transparent)!important;height:2px!important;opacity:.8!important}
    .hero .pp-hero-content{min-height:177px!important;height:177px!important;max-width:none!important;margin:0!important;width:100%!important}
    .hero .pp-hero-copy{
      width:100%!important;box-sizing:border-box!important;
      padding:27px 390px 63px 85px!important;text-align:center!important;z-index:5!important;
    }
    .hero .pp-hero-copy h1{
      margin:0!important;font-size:clamp(34px,3.4vw,52px)!important;line-height:1.02!important;
      letter-spacing:-.038em!important;font-weight:900!important;text-shadow:0 6px 24px #000b!important;
      white-space:nowrap!important;
    }
    .hero .pp-hero-copy h1 span{color:var(--pp-ref-blue)!important}
    .hero .pp-reference-subtitle{margin:7px 0 0!important;color:#c0d5e2!important;font-size:16px!important}
    .hero .pp-reference-subtitle:after{display:none!important}
    .hero .pp-hero-art{
      right:-8px!important;top:0!important;width:410px!important;height:177px!important;
      display:flex!important;justify-content:flex-end!important;align-items:flex-end!important;
      z-index:7!important;overflow:visible!important;pointer-events:none!important;
    }
    .hero .pp-hero-art img{
      width:400px!important;height:248px!important;max-width:none!important;object-fit:fill!important;object-position:right bottom!important;
      transform:translateY(6px)!important;filter:hue-rotate(180deg) saturate(1.08) drop-shadow(0 16px 28px #000b)!important;
    }
    .pp-reference-slogan{
      position:absolute!important;right:125px!important;top:8px!important;width:220px!important;
      z-index:9!important;text-align:right!important;color:#e9f6ff!important;
      font-family:'Brush Script MT','Segoe Script','Segoe Print',cursive!important;
      font-size:26px!important;line-height:.88!important;letter-spacing:.01em!important;
      transform:rotate(-2deg)!important;text-shadow:0 4px 13px #000c!important;pointer-events:none!important;
    }
    .pp-reference-slogan b{font-weight:400!important;color:#f4fbff!important}
    .hero .pp-hero-features{
      left:48px!important;right:400px!important;bottom:9px!important;
      z-index:10!important;gap:11px!important;
      grid-template-columns:repeat(6,minmax(0,1fr))!important;
    }
    .hero .pp-hero-features>div{padding:2px 2px!important;grid-template-columns:32px minmax(0,1fr)!important;column-gap:8px!important}
    .hero .pp-hero-features span{
      width:28px!important;height:28px!important;border:0!important;border-radius:0!important;background:transparent!important;
      color:var(--pp-ref-blue)!important;font-size:22px!important;filter:drop-shadow(0 2px 5px #0008)!important;
    }
    .hero .pp-hero-features b{font-size:12px!important;line-height:1.05!important;color:#f0f6fa!important}
    .hero .pp-hero-features small{font-size:9px!important;line-height:1.05!important;color:#9db4c1!important;margin-top:3px!important}

    @media(max-width:1200px){
      .header.pp-pretty-header,.header{grid-template-columns:minmax(320px,1fr) auto minmax(220px,1fr)!important}
      .header .brand,.header.pp-pretty-header .brand{width:330px!important;max-width:330px!important}
      .header .brand .pp-header-logo,.header .brand img{width:330px!important;max-width:330px!important}
      .hero .pp-hero-copy{padding-left:35px!important;padding-right:350px!important}
      .hero .pp-hero-art{width:350px!important}
      .hero .pp-hero-art img{width:350px!important;height:220px!important}
      .pp-reference-slogan{right:105px!important;width:200px!important;font-size:23px!important}
      .hero .pp-hero-features{left:24px!important;right:340px!important;gap:7px!important}
      .hero .pp-hero-features b{font-size:11px!important}
      .hero .pp-hero-features small{font-size:8px!important}
    }
    @media(max-width:900px){
      .header.pp-pretty-header,.header{height:auto!important;min-height:92px!important;grid-template-columns:minmax(0,1fr) auto!important;grid-template-rows:auto auto!important;padding:7px 14px!important}
      .header .brand{grid-column:1!important;grid-row:1!important;width:250px!important;max-width:250px!important;height:55px!important}
      .header .brand .pp-header-logo,.header .brand img{width:250px!important;max-width:250px!important;max-height:52px!important}
      .header .mode{grid-column:2!important;grid-row:1!important}
      .header .nav{grid-column:1 / -1!important;grid-row:2!important;justify-content:flex-start!important;overflow:auto!important;width:100%!important;padding-bottom:2px}
      .hero.pp-pretty-hero,.hero{height:270px!important;min-height:270px!important}
      .hero .pp-hero-content{height:270px!important;min-height:270px!important}
      .hero .pp-hero-copy{padding:26px 20px 120px!important;text-align:left!important}
      .hero .pp-hero-copy h1{white-space:normal!important;font-size:40px!important;max-width:76%!important}
      .hero .pp-reference-subtitle{font-size:14px!important;max-width:70%!important}
      .hero .pp-hero-art{right:-70px!important;width:330px!important;height:230px!important;opacity:.6!important}
      .hero .pp-hero-art img{width:330px!important;height:215px!important}
      .pp-reference-slogan{right:50px!important;top:9px!important;font-size:22px!important;width:170px!important}
      .hero .pp-hero-features{left:14px!important;right:14px!important;bottom:9px!important;grid-template-columns:repeat(3,minmax(0,1fr))!important;gap:5px!important}
      .hero .pp-hero-features>div:nth-child(n+4){display:none!important}
    }
    @media(max-width:560px){
      .header .brand,.header.pp-pretty-header .brand{width:190px!important;max-width:190px!important}
      .header .brand .pp-header-logo,.header .brand img{width:190px!important;max-width:190px!important}
      .hero .pp-hero-copy{padding:20px 12px 122px!important}
      .hero .pp-hero-copy h1{font-size:31px!important;max-width:84%!important}
      .hero .pp-reference-subtitle{font-size:11px!important;max-width:74%!important}
      .hero .pp-hero-art{right:-108px!important;opacity:.36!important}
      .pp-reference-slogan{right:18px!important;font-size:18px!important;width:140px!important;opacity:.8}
      .hero .pp-hero-features>div{grid-template-columns:1fr!important;grid-template-rows:auto auto!important;text-align:center!important;justify-items:center!important}
      .hero .pp-hero-features span{grid-row:auto!important;margin-bottom:2px!important}
      .hero .pp-hero-features b{font-size:8.5px!important}
      .hero .pp-hero-features small{display:none!important}
    }
  `;
  document.head.appendChild(style);
  return true;
}
function wait(){if(install())return;const started=Date.now();const t=setInterval(()=>{if(install()||Date.now()-started>15000)clearInterval(t)},50)}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',wait,{once:true});else wait();
})();
