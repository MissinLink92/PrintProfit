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
 const how=document.querySelector('.pp-ghost-cta');
 if(how&&!how.dataset.ppHowBound){
  how.dataset.ppHowBound='1';
  how.href='#how-it-works';
  how.addEventListener('click',openHowItWorks);
 }
 if(!document.getElementById('ppHowModal'))createHowModal();
 const style=document.createElement('style');style.textContent=`
.pp-hero-brand-card[role="button"]{cursor:pointer}
.pp-hero-brand-card[role="button"]:focus-visible{outline:2px solid #ff7800;outline-offset:4px}
.pp-hero-brand-card[role="button"]:after{content:"CLICK TO CALCULATE";position:absolute;left:50%;bottom:9px;transform:translateX(-50%);z-index:6;color:#c8d1d6;font-size:8px;font-weight:800;letter-spacing:.18em;opacity:0;transition:opacity .25s ease}
.pp-hero-brand-card[role="button"]:hover:after,.pp-hero-brand-card[role="button"]:focus-visible:after{opacity:.9}
#ppHowModal{position:fixed;inset:0;z-index:10000;display:none;align-items:center;justify-content:center;padding:22px;background:rgba(0,0,0,.72);backdrop-filter:blur(7px)}
#ppHowModal.open{display:flex}
.pp-how-dialog{width:min(680px,calc(100vw - 34px));max-height:min(80vh,720px);overflow:auto;border:1px solid #35505f;border-radius:18px;background:linear-gradient(180deg,#0b1b25 0%,#07131b 100%);box-shadow:0 30px 90px rgba(0,0,0,.65),0 0 45px #ff780015;color:#f7fbfe}
.pp-how-head{display:flex;align-items:center;justify-content:space-between;gap:16px;padding:20px 22px 14px;border-bottom:1px solid #1b3645}
.pp-how-head h2{margin:0;font-size:23px;letter-spacing:-.02em}
.pp-how-head p{margin:5px 0 0;color:#91a9b7;font-size:12px}
.pp-how-close{width:34px;height:34px;border:1px solid #35505f;border-radius:10px;background:#0b1c26;color:#dfe9ef;font-size:20px;line-height:1;cursor:pointer}
.pp-how-close:hover{border-color:#ff7800;color:#fff}
.pp-how-body{padding:18px 22px 22px}
.pp-how-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:12px}
.pp-how-step{border:1px solid #203d4c;border-radius:13px;background:#091821;padding:15px;min-height:130px}
.pp-how-step b{display:flex;align-items:center;gap:9px;font-size:13px}
.pp-how-step i{width:28px;height:28px;border-radius:9px;display:grid;place-items:center;background:linear-gradient(135deg,#ff7800,#ff9637);color:#fff;font-style:normal;font-weight:900;flex:0 0 auto}
.pp-how-step p{margin:9px 0 0;color:#9db2bd;font-size:11px;line-height:1.5}
.pp-how-tip{margin-top:14px;padding:12px 13px;border:1px dashed #ff78005c;border-radius:12px;background:#ff780008;color:#c5d4dc;font-size:11px;line-height:1.5}
.pp-how-tip strong{color:#ff9637}
@media(max-width:700px){.pp-how-grid{grid-template-columns:1fr}.pp-how-step{min-height:0}}
`;
 document.head.appendChild(style);
 return true;
}
function createHowModal(){
 const modal=document.createElement('div');
 modal.id='ppHowModal';
 modal.innerHTML=`<div class="pp-how-dialog" role="dialog" aria-modal="true" aria-labelledby="ppHowTitle"><div class="pp-how-head"><div><h2 id="ppHowTitle">How PrintProfit works</h2><p>From slicer file to a clear selling price.</p></div><button type="button" class="pp-how-close" aria-label="Close">×</button></div><div class="pp-how-body"><div class="pp-how-grid"><div class="pp-how-step"><b><i>1</i>Upload your print</b><p>Drop in a sliced G-code file or supported slicer project. PrintProfit reads the information your slicer has stored.</p></div><div class="pp-how-step"><b><i>2</i>Read the real usage</b><p>Where the file contains it, PrintProfit imports print time and material usage automatically. No guessing.</p></div><div class="pp-how-step"><b><i>3</i>Set your costs</b><p>Add filament cost, electricity, machine time, labour, delivery and platform fees in the calculator.</p></div><div class="pp-how-step"><b><i>4</i>Choose your price</b><p>Set a selling price or use the quick pricing tools to see the effect on profit and margin.</p></div><div class="pp-how-step"><b><i>5</i>Check the breakdown</b><p>See exactly where the money goes, including material, machine running cost and additional fees.</p></div><div class="pp-how-step"><b><i>6</i>Make the decision</b><p>Use the final figures to quote customers consistently and avoid pricing a print too low.</p></div></div><div class="pp-how-tip"><strong>Tip:</strong> A sliced G-code file gives PrintProfit the best chance of importing exact print time and filament usage. Unsliced 3MF files may only contain project settings.</div></div></div>`;
 document.body.appendChild(modal);
 modal.querySelector('.pp-how-close').addEventListener('click',closeHowItWorks);
 modal.addEventListener('click',e=>{if(e.target===modal)closeHowItWorks();});
 document.addEventListener('keydown',e=>{if(e.key==='Escape')closeHowItWorks();});
}
function openHowItWorks(event){
 event?.preventDefault();
 if(!document.getElementById('ppHowModal'))createHowModal();
 document.getElementById('ppHowModal').classList.add('open');
 document.body.style.overflow='hidden';
 document.querySelector('.pp-how-close')?.focus();
}
function closeHowItWorks(){
 document.getElementById('ppHowModal')?.classList.remove('open');
 document.body.style.overflow='';
}
function wait(){if(install())return;const t=setInterval(()=>{if(install()||Date.now()-performance.timeOrigin>15000)clearInterval(t)},50)}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',wait,{once:true});else wait();
})();