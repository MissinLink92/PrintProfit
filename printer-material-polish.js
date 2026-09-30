(()=>{ 
'use strict';
if(window.__printProfitPrinterMaterialPolish)return;
window.__printProfitPrinterMaterialPolish=true;

function money(v){return '£'+(Number(v)||0).toFixed(2);}
const $=id=>document.getElementById(id);

function install(){
 const printer=$('printer'), material=$('material');
 if(!printer||!material)return false;

 const printerBlock=printer.closest('.merge-block');
 if(printerBlock&&!$('ppPrinterProfile')){
  const card=document.createElement('div');
  card.id='ppPrinterProfile';
  card.className='pp-profile-card';
  card.innerHTML=
   '<div class="pp-profile-head">'+
     '<span class="pp-profile-icon" aria-hidden="true"><svg viewBox="0 0 48 48"><path d="M18 10h12l2 5 5 2-2 5 4 4-4 4 2 5-5 2-2 5H18l-2-5-5-2 2-5-4-4 4-4-2-5 5-2 2-5Z"/><circle cx="24" cy="24" r="6"/></svg></span>'+
     '<div><strong>Printer Details</strong><span id="ppPrinterDetailsHint">Values used by PrintProfit for this printer.</span></div>'+
   '</div>'+
   '<div class="pp-profile-grid">'+
     '<div><span>Purchase price</span><b id="ppPrinterPrice">—</b></div>'+
     '<div><span>Power draw</span><b id="ppPrinterPower">—</b></div>'+
     '<div><span>Expected life</span><b id="ppPrinterLife">—</b></div>'+
     '<div><span>Depreciation</span><b id="ppPrinterDep">—</b></div>'+
   '</div>'+
   '<div id="ppCustomPrinterFields" class="pp-custom-printer-fields" hidden>'+
     '<div><label for="customPrinterPrice">Purchase price (£)</label><input id="customPrinterPrice" type="number" min="0" step="0.01" placeholder="e.g. 250"></div>'+
     '<div><label for="customPrinterPower">Power draw (W)</label><input id="customPrinterPower" type="number" min="0" step="1" placeholder="e.g. 150"></div>'+
     '<div><label for="customPrinterLife">Expected life (hours)</label><input id="customPrinterLife" type="number" min="0" step="1" placeholder="e.g. 4000"></div>'+
     '<div class="pp-custom-printer-note">Enter your printer details here. PrintProfit will use these values for electricity and depreciation.</div>'+
   '</div>';
  printer.closest('section.panel')?.insertAdjacentElement('afterend',card);
 }

 const materialBlock=material.closest('.merge-block');
 if(materialBlock&&!$('ppMaterialRate')){
  const rate=document.createElement('div');rate.id='ppMaterialRate';rate.className='pp-material-rate';
  rate.innerHTML='<span>Material cost rate</span><strong id="ppMaterialRateValue">£0.00 / g</strong>';
  $('materialCostOut')?.closest('.two')?.insertAdjacentElement('afterend',rate);
 }

 function update(){
  const custom=printer.value==='custom';
  const fields=$('ppCustomPrinterFields');
  if(fields)fields.hidden=!custom;

  if(custom){
   const price=Number($('customPrinterPrice')?.value)||0;
   const power=Number($('customPrinterPower')?.value)||0;
   const life=Number($('customPrinterLife')?.value)||0;
   const hint=$('ppPrinterDetailsHint');
   if(hint)hint.textContent='Enter the values for your own printer profile.';
   const set=(id,val)=>{const e=$(id);if(e)e.textContent=val;};
   set('ppPrinterPrice',price>0?money(price):'Not entered');
   set('ppPrinterPower',power>0?Math.round(power)+' W':'Not entered');
   set('ppPrinterLife',life>0?Math.round(life).toLocaleString()+' h':'Not entered');
   set('ppPrinterDep',price>0&&life>0?money(price/life)+'/h':'Enter price + life');
  }else{
   const parts=String(printer.value||'').split('|');
   const power=Number(parts[0])||0,price=Number(parts[1])||0,life=Number(parts[2])||0;
   const hint=$('ppPrinterDetailsHint');
   if(hint)hint.textContent='Values used by PrintProfit for this printer.';
   const set=(id,val)=>{const e=$(id);if(e)e.textContent=val;};
   if(price>0){
    set('ppPrinterPrice',money(price));
    set('ppPrinterPower',power>0?Math.round(power)+' W':'—');
    set('ppPrinterLife',life>0?life.toLocaleString()+' h':'—');
    set('ppPrinterDep',life>0?money(price/life)+'/h':'—');
   }else{
    set('ppPrinterPrice','—');set('ppPrinterPower','—');set('ppPrinterLife','—');set('ppPrinterDep','—');
   }
  }

  const pack=Number($('materialPack')?.value)||0;
  const cost=Number($('materialPackCost')?.value)||0;
  const label=$('packAmountLabel')?.textContent||'';
  const unit=/ml/i.test(label)?'ml':'g';
  const rate=$('ppMaterialRateValue');
  if(rate)rate.textContent=pack>0?money(cost/pack)+' / '+unit:'—';
 }

 const wire=id=>{
  const el=$(id);
  if(!el||el.dataset.ppPrinterProfileBound)return;
  el.dataset.ppPrinterProfileBound='1';
  el.addEventListener('input',update);
  el.addEventListener('change',update);
 };
 printer.addEventListener('change',()=>{update();setTimeout(()=>window.__printProfitReady&&document.getElementById('calc')?.click(),20);});
 material.addEventListener('change',update);
 ['materialPack','materialPackCost','materialType','customPrinterPrice','customPrinterPower','customPrinterLife'].forEach(wire);
 update();

 if(!$('ppPrinterMaterialPolishStyles')){
  const style=document.createElement('style');
  style.id='ppPrinterMaterialPolishStyles';
  style.textContent=
   '.pp-profile-card{margin-top:9px;border:1px solid var(--line);border-radius:9px;background:rgba(7,16,24,.55);padding:9px 10px}'+
   '.pp-profile-head{display:flex;align-items:center;gap:8px;margin-bottom:8px}'+
   '.pp-profile-icon{width:64px;height:64px;min-width:64px;flex:0 0 64px;border-radius:15px;background:linear-gradient(145deg,#132f3d,#0b202c);border:1px solid #a77cff;color:#a77cff;display:grid;place-items:center;box-shadow:0 8px 20px rgba(0,0,0,.28),inset 0 1px 0 rgba(255,255,255,.05)}'+
   '.pp-profile-icon svg{width:40px;height:40px;fill:none;stroke:currentColor;stroke-width:2.35;stroke-linecap:round;stroke-linejoin:round}'+
   '.pp-profile-head strong{display:block;font-size:11px}.pp-profile-head span{display:block;color:var(--muted);font-size:9px;margin-top:2px}'+
   '.pp-profile-grid{display:grid;grid-template-columns:1fr 1fr;gap:6px}.pp-profile-grid>div{border:1px solid var(--line);border-radius:7px;padding:7px 8px;background:var(--panel2)}'+
   '.pp-profile-grid span{display:block;color:var(--muted);font-size:9px;margin-bottom:3px}.pp-profile-grid b{display:block;font-size:11px}'+
   '.pp-custom-printer-fields{margin-top:8px;padding-top:8px;border-top:1px solid var(--line);display:grid;grid-template-columns:1fr 1fr;gap:7px}'+
   '.pp-custom-printer-fields[hidden]{display:none!important}.pp-custom-printer-fields label{display:block;color:var(--muted);font-size:8px;margin-bottom:4px}'+
   '.pp-custom-printer-fields input{width:100%;box-sizing:border-box;border:1px solid var(--line);border-radius:7px;background:var(--panel2);color:var(--text);padding:7px 8px;font:700 10px Inter,Segoe UI,system-ui,sans-serif}'+
   '.pp-custom-printer-fields input:focus{outline:2px solid var(--accent);outline-offset:1px}.pp-custom-printer-note{grid-column:1 / -1;color:var(--muted);font-size:8px;line-height:1.4}'+
   '.pp-material-rate{display:flex;align-items:center;justify-content:space-between;gap:8px;margin-top:7px;padding:7px 9px;border:1px solid var(--line);border-radius:7px;background:rgba(255,120,0,.025)}'+
   '.pp-material-rate span{font-size:9px;color:var(--muted)}.pp-material-rate strong{font-size:11px;color:var(--accent)}'+
   '@media(max-width:650px){.pp-profile-icon{width:54px;min-width:54px;height:54px;flex-basis:54px}.pp-profile-icon svg{width:33px;height:33px}.pp-custom-printer-fields{grid-template-columns:1fr}}';
  document.head.appendChild(style);
 }
 return true;
}

function boot(){
 if(install())return;
 const started=Date.now(),timer=setInterval(()=>{if(install()||Date.now()-started>15000)clearInterval(timer)},50);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();