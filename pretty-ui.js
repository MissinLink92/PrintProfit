(()=>{
  'use strict';
  if(window.__printProfitPrettyUIInstalled)return;
  window.__printProfitPrettyUIInstalled=true;

  const $=id=>document.getElementById(id);
  const asset=(name)=>'./assets/'+name;

  function installHero(){
    const shell=document.querySelector('.shell');
    const header=document.querySelector('.header');
    const hero=document.querySelector('.hero');
    const brand=document.querySelector('.brand');
    if(!shell||!header||!hero||!brand)return false;

    shell.classList.add('pp-pretty-shell');
    header.classList.add('pp-pretty-header');
    hero.classList.add('pp-pretty-hero');

    const brandImg=brand.querySelector('img');
    if(brandImg){
      brand.querySelectorAll('.pp-brand-fallback').forEach(node=>node.remove());
      brandImg.src=asset('printprofit-header-logo.webp');
      brandImg.alt='PrintProfit';
      brandImg.removeAttribute('data-pp-fallback-shown');
      brandImg.style.display='block';
    }

    hero.querySelectorAll('.pp-hero-fallback').forEach(node=>node.remove());
    const oldHeroImg=hero.querySelector(':scope > img');
    if(oldHeroImg)oldHeroImg.style.display='none';

    let content=hero.querySelector('.pp-hero-content');
    if(!content){
      content=document.createElement('div');
      content.className='pp-hero-content';
      content.innerHTML=`
        <div class="pp-hero-copy">
          <div class="pp-hero-eyebrow">SMARTER 3D PRINTING</div>
          <h1>3D Printing Cost &amp; Pricing <span>Calculator</span></h1>
          <p>Calculate your costs, set your price and maximise your profit.</p>
        </div>
        <div class="pp-hero-art" aria-hidden="true"><img src="${asset('hero-art-orange.webp')}" alt=""></div>
        <div class="pp-hero-features">
          <div><span>▣</span><b>Accurate Costs</b><small>Filament, time &amp; more</small></div>
          <div><span>◇</span><b>Any G-code</b><small>Works with any slicer</small></div>
          <div><span>▥</span><b>Set Your Price</b><small>See profit &amp; margin</small></div>
          <div><span>⚙</span><b>Multiple Profiles</b><small>Printers &amp; materials</small></div>
          <div><span>▣</span><b>Include Fees</b><small>Platform &amp; delivery costs</small></div>
          <div><span>▤</span><b>Batch Pricing</b><small>Quantity discounts</small></div>
        </div>`;
      hero.appendChild(content);
    }
    return true;
  }

  function installGlobalPolish(){
    document.body.classList.add('pp-pretty-body');
    const nav=document.querySelector('.nav');
    if(nav)nav.setAttribute('aria-label','Primary navigation');
    const mode=document.querySelector('.mode');
    if(mode)mode.classList.add('pp-mode-toggle');
  }

  function installStyles(){
    if($('ppPrettyStyles'))return;
    const style=document.createElement('style');
    style.id='ppPrettyStyles';
    style.textContent=`
:root{--pp-black:#050b10;--pp-navy:#07131d;--pp-navy2:#0a1d2a;--pp-bluegray:#183344;--pp-orange:#ff7800;--pp-orange2:#ff9b3d}
body.pp-pretty-body{background:radial-gradient(circle at 50% -12%,#143246 0%,#071018 38%,#050b10 100%)}
.shell.pp-pretty-shell{max-width:none;margin:0;border:0;border-radius:0;overflow:visible;background:transparent}
.header.pp-pretty-header{min-height:70px;padding:8px clamp(12px,3vw,42px);gap:18px;border-bottom:1px solid #183344;background:linear-gradient(180deg,#07131d 0%,#061019 100%);box-shadow:0 8px 30px #0007;position:sticky;top:0;z-index:30}
.header.pp-pretty-header:after{content:"";position:absolute;left:0;right:0;bottom:-1px;height:1px;background:linear-gradient(90deg,transparent,var(--pp-orange),transparent);opacity:.65}
.brand{min-width:250px;height:54px;display:flex!important;align-items:center}.brand img{width:245px!important;height:auto!important;max-height:54px;object-fit:contain}
.nav{gap:3px;align-items:center}.nav a{position:relative;padding:10px 13px;border-radius:8px;font-size:12px;color:#d8e2e9;transition:color .18s ease,background .18s ease}.nav a:after{content:"";position:absolute;left:12px;right:12px;bottom:4px;height:2px;border-radius:2px;background:var(--pp-orange);transform:scaleX(0);transform-origin:center;transition:transform .18s ease}.nav a:hover,.nav a.active{color:#fff;background:#ff78000f}.nav a.active:after{transform:scaleX(1)}
.pp-mode-toggle{display:flex!important;align-items:center;gap:7px;color:#d8e2e9!important;font-size:11px!important;cursor:pointer}.pp-mode-toggle span{white-space:nowrap}.pp-mode-toggle input{appearance:none!important;width:38px!important;height:20px!important;border-radius:999px!important;border:1px solid #355466!important;background:#102734!important;position:relative!important;margin:0!important;cursor:pointer}.pp-mode-toggle input:after{content:"";position:absolute;width:14px;height:14px;top:2px;left:2px;border-radius:50%;background:#d8e2e9;transition:left .18s ease,background .18s ease}.pp-mode-toggle input:checked{background:var(--pp-orange)!important;border-color:var(--pp-orange)!important}.pp-mode-toggle input:checked:after{left:20px;background:#fff}
.hero.pp-pretty-hero{position:relative;min-height:205px;overflow:hidden;border-bottom:1px solid #1b3546;background:radial-gradient(circle at 18% 40%,#ff780016 0%,transparent 34%),radial-gradient(circle at 58% 0%,#18384d 0%,transparent 44%),linear-gradient(135deg,#07131c 0%,#0a1b27 56%,#061019 100%)}
.hero.pp-pretty-hero:before{content:"";position:absolute;inset:0;background-image:linear-gradient(#ffffff08 1px,transparent 1px),linear-gradient(90deg,#ffffff08 1px,transparent 1px);background-size:34px 34px;mask-image:linear-gradient(90deg,transparent,#000 12%,#000 88%,transparent);pointer-events:none;opacity:.55}
.hero.pp-pretty-hero:after{content:"";position:absolute;left:0;right:0;bottom:0;height:2px;background:linear-gradient(90deg,transparent 0%,#ff7800 30%,#ff9b3d 50%,#ff7800 70%,transparent 100%);opacity:.7}
.pp-hero-content{position:relative;min-height:205px;max-width:1600px;margin:0 auto}.pp-hero-copy{position:relative;z-index:4;text-align:center;padding:22px 300px 74px 170px}.pp-hero-eyebrow{font-size:9px;letter-spacing:.27em;font-weight:900;color:var(--pp-orange);margin-bottom:6px}.pp-hero-copy h1{margin:0;font-size:clamp(28px,4vw,49px);line-height:1.02;letter-spacing:-.035em;font-weight:900;text-shadow:0 5px 24px #0009}.pp-hero-copy h1 span{color:var(--pp-orange)}.pp-hero-copy p{margin:8px 0 0;color:#b8cbd7;font-size:14px}.pp-hero-copy p:after{content:"";display:block;width:88px;height:2px;margin:12px auto 0;background:var(--pp-orange);border-radius:2px;box-shadow:0 0 14px #ff780066}
.pp-hero-art{position:absolute;z-index:3;right:0;top:0;width:min(31vw,360px);height:205px;display:flex;justify-content:flex-end;align-items:flex-end;pointer-events:none}.pp-hero-art img{width:230px;height:175px;object-fit:contain;object-position:right bottom;display:block;filter:drop-shadow(0 12px 24px #0009)}
.pp-hero-features{position:absolute;z-index:5;left:28px;right:245px;bottom:9px;display:grid;grid-template-columns:repeat(6,minmax(0,1fr));gap:8px}.pp-hero-features>div{min-width:0;display:grid;grid-template-columns:26px minmax(0,1fr);grid-template-rows:auto auto;column-gap:7px;align-items:center;padding:5px 3px}.pp-hero-features span{grid-row:1 / span 2;display:grid;place-items:center;width:24px;height:24px;border:1px solid #ff78004d;border-radius:7px;color:var(--pp-orange);font-size:13px;background:#ff780010}.pp-hero-features b{font-size:9.5px;color:#eff5f8;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.pp-hero-features small{font-size:7.7px;color:#91aab8;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.main{max-width:1600px;margin:0 auto;padding:12px clamp(8px,1.8vw,18px)}
.result.pp-results-enhanced{border-color:#284657;box-shadow:0 14px 40px #0007}.pp-tabs{box-shadow:0 8px 28px #0005}.pp-global-actions{box-shadow:0 10px 26px #0005}.panel{box-shadow:0 4px 18px #0002}.footer{background:#050b10;border-top-color:#193342}
@media(max-width:1100px){.pp-hero-copy{padding-left:40px;padding-right:280px}.pp-hero-features{left:18px;right:220px}.brand{min-width:205px}.brand img{width:205px!important}}
@media(max-width:850px){.header.pp-pretty-header{flex-wrap:wrap}.nav{order:3;width:100%;overflow:auto;justify-content:flex-start}.pp-hero-copy{padding:26px 18px 88px;text-align:left}.pp-hero-copy p:after{margin-left:0}.pp-hero-art{opacity:.42;width:45vw}.pp-hero-features{left:12px;right:12px;grid-template-columns:repeat(3,minmax(0,1fr));bottom:8px}.pp-hero-features>div:nth-child(n+4){display:none}.pp-hero-content,.hero.pp-pretty-hero{min-height:220px}}
@media(max-width:560px){.brand{min-width:180px}.brand img{width:185px!important}.pp-mode-toggle span{display:none}.pp-hero-copy{padding:24px 14px 74px}.pp-hero-copy h1{font-size:30px;max-width:90%}.pp-hero-copy p{font-size:11px;max-width:65%}.pp-hero-art{opacity:.25;width:65vw}.pp-hero-features{grid-template-columns:repeat(3,minmax(0,1fr));gap:3px}.pp-hero-features>div{grid-template-columns:1fr;grid-template-rows:auto auto;text-align:center;justify-items:center}.pp-hero-features span{grid-row:auto;margin-bottom:3px}.pp-hero-features b{font-size:8.5px}.pp-hero-features small{display:none}}
`;
    document.head.appendChild(style);
  }

  function boot(){
    installStyles();
    installGlobalPolish();
    installHero();
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});
  else boot();
})();
