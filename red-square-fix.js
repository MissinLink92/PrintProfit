(()=>{
'use strict';
if(window.__printProfitRedSquareFix)return;window.__printProfitRedSquareFix=true;

function headerBrand(){
  const brand=document.querySelector('.header .brand');
  if(!brand)return false;
  if(brand.dataset.ppMasterHeader==='1')return true;
  brand.dataset.ppMasterHeader='1';
  brand.innerHTML='';
  brand.classList.add('pp-master-header-brand');

  const icon=document.createElement('img');
  icon.src='./assets/printprofit-clean-icon.svg?v=2';
  icon.alt='PrintProfit';
  icon.className='pp-master-header-icon';

  const copy=document.createElement('div');
  copy.className='pp-master-header-copy';
  copy.innerHTML='<div class="pp-master-wordmark"><span>Print</span><b>Profit</b></div><small>3D PRINTING COST &amp; PRICING CALCULATOR</small>';
  brand.append(icon,copy);
  return true;
}

function heroPolish(){
  const hero=document.querySelector('.hero');
  const copy=hero?.querySelector('.pp-hero-copy2');
  const buttons=hero?.querySelector('.pp-hero-buttons');
  if(!hero||!copy||!buttons)return false;
  hero.classList.add('pp-red-square-polish');
  return true;
}

function circularIcons(){
  const holders=[...document.querySelectorAll('section.panel .head>.icon, .merge-block .head>.icon')];
  if(!holders.length)return false;
  holders.forEach(holder=>{
    if(holder.classList.contains('pp-pretty-icon'))holder.classList.add('pp-circular-icon');
    else holder.classList.add('pp-circular-icon-fallback');
  });
  return true;
}

function injectStyles(){
  document.getElementById('ppRedSquareFixStyles')?.remove();
  const style=document.createElement('style');
  style.id='ppRedSquareFixStyles';
  style.textContent=`
/* Master visual cleanup: header, hero CTA and section icon treatment */
.header .brand.pp-master-header-brand{
  display:flex!important;align-items:center!important;gap:10px!important;
  width:min(360px,31vw)!important;height:60px!important;min-width:0!important;
}
.header .pp-master-header-icon{
  width:54px!important;height:54px!important;flex:0 0 54px!important;
  object-fit:contain!important;display:block!important;
  filter:drop-shadow(0 5px 14px rgba(255,120,0,.20))!important;
}
.header .pp-master-header-copy{min-width:0!important;line-height:1!important;text-align:left!important}
.header .pp-master-wordmark{white-space:nowrap!important;font-size:31px!important;font-weight:900!important;letter-spacing:-.055em!important;line-height:.95!important}
.header .pp-master-wordmark span{
  color:#f5f8fb!important;
  text-shadow:0 2px 10px rgba(0,0,0,.30)!important;
}
.header .pp-master-wordmark b{color:#ff7800!important;font-weight:900!important}
.header .pp-master-header-copy small{
  display:block!important;margin-top:5px!important;color:#c4cfd5!important;
  font-size:7px!important;font-weight:800!important;letter-spacing:.19em!important;
  white-space:nowrap!important;
}

.hero.pp-red-square-polish .pp-hero-copy2{position:relative!important;z-index:30!important}
.hero.pp-red-square-polish .pp-hero-buttons{position:relative!important;z-index:35!important;display:flex!important;align-items:center!important;margin-top:24px!important}
.hero.pp-red-square-polish .pp-main-cta,.hero.pp-red-square-polish .pp-ghost-cta{position:relative!important;z-index:36!important}
.hero.pp-red-square-polish .pp-chosen-ticker{z-index:12!important}

/* Match the cleaner reference: thin orange ring + line-art icon, not a solid orange disc */
section.panel .head>.pp-circular-icon,
.merge-block .head>.pp-circular-icon{
  width:48px!important;height:48px!important;min-width:48px!important;
  border-radius:50%!important;
  display:grid!important;place-items:center!important;
  background:rgba(255,120,0,.035)!important;
  border:2px solid rgba(255,120,0,.78)!important;
  box-shadow:0 0 0 1px rgba(255,120,0,.08),0 8px 22px rgba(0,0,0,.35),0 0 22px rgba(255,120,0,.10)!important;
  overflow:hidden!important;
}
section.panel .head>.pp-circular-icon svg,
.merge-block .head>.pp-circular-icon svg{
  width:27px!important;height:27px!important;
  fill:none!important;stroke:#ff7800!important;stroke-width:1.9!important;
  stroke-linecap:round!important;stroke-linejoin:round!important;
  filter:drop-shadow(0 0 6px rgba(255,120,0,.28))!important;
}
section.panel .head>.pp-circular-icon::before,
section.panel .head>.pp-circular-icon::after,
.merge-block .head>.pp-circular-icon::before,
.merge-block .head>.pp-circular-icon::after{display:none!important}
section.panel .head>.pp-circular-icon:hover,
.merge-block .head>.pp-circular-icon:hover{
  transform:translateY(-2px) scale(1.035)!important;
  border-color:#ff8a24!important;
  box-shadow:0 0 0 1px rgba(255,120,0,.12),0 12px 28px rgba(0,0,0,.42),0 0 30px rgba(255,120,0,.16)!important;
}
section.panel .head>.pp-circular-icon-fallback,
.merge-block .head>.pp-circular-icon-fallback{
  width:48px!important;height:48px!important;min-width:48px!important;border-radius:50%!important;
  background:transparent!important;border:2px solid rgba(255,120,0,.78)!important;color:#ff7800!important;
  display:grid!important;place-items:center!important;font-size:16px!important;font-weight:900!important;
  box-shadow:0 0 22px rgba(255,120,0,.10)!important;
}

@media(max-width:1050px){
  .header .brand.pp-master-header-brand{width:300px!important}
  .header .pp-master-wordmark{font-size:26px!important}
  .header .pp-master-header-icon{width:48px!important;height:48px!important;flex-basis:48px!important}
}
@media(max-width:820px){
  .header .brand.pp-master-header-brand{width:255px!important;height:52px!important;gap:8px!important}
  .header .pp-master-wordmark{font-size:23px!important}
  .header .pp-master-header-copy small{font-size:5.7px!important;letter-spacing:.14em!important}
  .header .pp-master-header-icon{width:44px!important;height:44px!important;flex-basis:44px!important}
}
@media(max-width:560px){
  .header .brand.pp-master-header-brand{width:215px!important}
  .header .pp-master-wordmark{font-size:20px!important}
  .header .pp-master-header-copy small{display:none!important}
  .header .pp-master-header-icon{width:40px!important;height:40px!important;flex-basis:40px!important}
  section.panel .head>.pp-circular-icon,
  .merge-block .head>.pp-circular-icon{width:42px!important;height:42px!important;min-width:42px!important}
  section.panel .head>.pp-circular-icon svg,
  .merge-block .head>.pp-circular-icon svg{width:24px!important;height:24px!important}
}
`;
  document.head.appendChild(style);
}

function install(){
  injectStyles();
  const a=headerBrand();
  const b=heroPolish();
  const c=circularIcons();
  return a&&b&&c;
}

function wait(){
  if(install())return;
  const started=Date.now();
  const timer=setInterval(()=>{if(install()||Date.now()-started>15000)clearInterval(timer)},50);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',wait,{once:true});else wait();
})();
