(()=>{
'use strict';
if(window.__printProfitInteractionFix)return;window.__printProfitInteractionFix=true;
function install(){
 const hero=document.querySelector('.hero');
 const firstPanel=document.querySelector('.layout .panel');
 if(!hero||!firstPanel)return false;
 const scrollToCalc=(event)=>{
  event?.preventDefault();
  firstPanel.scrollIntoView({behavior:'smooth',block:'start'});
 };
 document.querySelectorAll('a[href="#calculator"]').forEach(a=>{
  if(a.dataset.ppCalcBound)return;a.dataset.ppCalcBound='1';a.addEventListener('click',scrollToCalc);
 });
 const card=document.querySelector('.pp-hero-brand-card');
 if(card&&!card.dataset.ppCardBound){
  card.dataset.ppCardBound='1';
  card.setAttribute('role','button');
  card.setAttribute('tabindex','0');
  card.setAttribute('aria-label','Open the PrintProfit calculator');
  card.addEventListener('click',scrollToCalc);
  card.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();scrollToCalc(e)}});
 }
 document.querySelectorAll('.header .brand').forEach(brand=>{
  if(brand.dataset.ppHomeBound)return;brand.dataset.ppHomeBound='1';
  brand.addEventListener('click',e=>{e.preventDefault();window.scrollTo({top:0,behavior:'smooth'});});
 });
 const style=document.createElement('style');style.textContent=`
.pp-hero-brand-card[role="button"]{cursor:pointer}
.pp-hero-brand-card[role="button"]:focus-visible{outline:2px solid #ff7800;outline-offset:4px}
.pp-hero-brand-card[role="button"]:after{content:"CLICK TO CALCULATE";position:absolute;left:50%;bottom:9px;transform:translateX(-50%);z-index:6;color:#c8d1d6;font-size:8px;font-weight:800;letter-spacing:.18em;opacity:0;transition:opacity .25s ease}
.pp-hero-brand-card[role="button"]:hover:after,.pp-hero-brand-card[role="button"]:focus-visible:after{opacity:.9}
`;
 document.head.appendChild(style);
 return true;
}
function wait(){if(install())return;const t=setInterval(()=>{if(install()||Date.now()-performance.timeOrigin>15000)clearInterval(t)},50)}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',wait,{once:true});else wait();
})();