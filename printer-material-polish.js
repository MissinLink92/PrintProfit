(()=>{ 
'use strict';
if(window.__printProfitPrinterMaterialPolish)return;
window.__printProfitPrinterMaterialPolish=true;

function money(v){return '£'+(Number(v)||0).toFixed(2);}
const $=id=>document.getElementById(id);

function install(){
 const printer=$('printer'), material=$('material');

 // Replace the small text/emoji Print Setup icons with clear, scalable artwork.
 const detailedIcons={
  setup:'<svg viewBox="0 0 64 64" aria-hidden="true"><defs><linearGradient id="ppgSetup" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#d9a7ff"/><stop offset="1" stop-color="#8f45ff"/></linearGradient></defs><path fill="url(#ppgSetup)" d="M32 8l4.2 5.6 7.1-1.2 2.3 6.9 6.9 2.3-1.2 7.1L57 32l-5.7 4.2 1.2 7.1-6.9 2.3-2.3 6.9-7.1-1.2L32 57l-4.2-5.7-7.1 1.2-2.3-6.9-6.9-2.3 1.2-7.1L7 32l5.7-4.2-1.2-7.1 6.9-2.3 2.3-6.9 7.1 1.2L32 8z"/><circle cx="32" cy="32" r="10" fill="#101a25" stroke="#fff" stroke-width="3"/><circle cx="32" cy="32" r="3" fill="#d9a7ff"/></svg>',
  printer:'<svg viewBox="0 0 64 64" aria-hidden="true"><rect x="14" y="18" width="36" height="34" rx="3" fill="#17232e" stroke="#c8d4df" stroke-width="3"/><rect x="20" y="9" width="24" height="18" rx="2" fill="#263745" stroke="#c8d4df" stroke-width="3"/><path d="M25 39h14v9H25z" fill="#ff8618" stroke="#fff" stroke-width="2"/><path d="M27 16h10v6H27z" fill="#ff8618"/><circle cx="47" cy="31" r="3" fill="#19c8ff"/></svg>',
  details:'<svg viewBox="0 0 64 64" aria-hidden="true"><g transform="rotate(-35 25 31)"><rect x="19" y="10" width="10" height="38" rx="4" fill="#dfe6ed"/><path d="M16 10h16l3 7H13z" fill="#b9c5cf"/><circle cx="24" cy="48" r="7" fill="#dfe6ed"/></g><path fill="#ff8618" d="M44 30l3.2 4.2 5.2-.8 1.6 5-4.5 2.8.9 5.2-5 1.6-2.8-4.5-5.2.9-1.6-5 4.5-2.8-.9-5.2 5-1.6z"/><circle cx="44" cy="40" r="4" fill="#15222d"/></svg>',
  material:'<svg viewBox="0 0 64 64" aria-hidden="true"><ellipse cx="32" cy="16" rx="18" ry="8" fill="#2c3740" stroke="#d9e0e6" stroke-width="2"/><path d="M14 16v29c0 8 36 8 36 0V16" fill="#151d24" stroke="#d9e0e6" stroke-width="2"/><ellipse cx="32" cy="16" rx="10" ry="4" fill="#0c1218" stroke="#ff8618" stroke-width="3"/><path d="M44 18v23c0 4-4 6-8 7 8-1 14-4 14-9V18z" fill="#ff8618"/><path d="M27 25c8 3 9 12 3 18" fill="none" stroke="#ff9f3d" stroke-width="3" stroke-linecap="round"/></svg>'
 };
 const replaceSetupIcons=()=>{
  const panel=document.querySelector('.print-setup-panel');
  if(!panel)return;
  panel.querySelectorAll('.merge-block > .head').forEach(head=>{
   const title=head.querySelector('h2')?.textContent?.trim();
   const key=title==='Printer'?'printer':title==='Material'?'material':title==='Print Setup'?'setup':title==='Printer Details'?'details':null;
   if(!key)return;
   const icon=head.querySelector('.icon');
   if(icon){icon.innerHTML=detailedIcons[key];icon.classList.add('pp-detailed-setup-icon');icon.setAttribute('aria-hidden','true');}
  });
 };
 replaceSetupIcons();
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

 if(!$('ppDetailedSetupIconStyles')){
 const s=document.createElement('style');s.id='ppDetailedSetupIconStyles';
 s.textContent='.print-setup-panel .head .pp-detailed-setup-icon{width:68px!important;height:68px!important;min-width:68px!important;flex:0 0 68px!important;border-radius:16px!important;display:grid!important;place-items:center!important;background:linear-gradient(145deg,#132f3d,#0b202c)!important;border:2px solid #a77cff!important;box-shadow:0 8px 22px rgba(0,0,0,.3),inset 0 1px 0 rgba(255,255,255,.06)!important;overflow:hidden!important}.print-setup-panel .head .pp-detailed-setup-icon svg{width:52px!important;height:52px!important;display:block!important}.print-setup-panel .merge-block:nth-child(1) .pp-detailed-setup-icon{border-color:#a77cff!important}.print-setup-panel .merge-block:nth-child(2) .pp-detailed-setup-icon{border-color:#19c8ff!important}.print-setup-panel .pp-profile-head .pp-profile-icon{width:68px!important;height:68px!important;min-width:68px!important;flex-basis:68px!important}.print-setup-panel .pp-profile-head .pp-profile-icon svg{width:48px!important;height:48px!important}@media(max-width:650px){.print-setup-panel .head .pp-detailed-setup-icon{width:58px!important;height:58px!important;min-width:58px!important;flex-basis:58px!important}.print-setup-panel .head .pp-detailed-setup-icon svg{width:45px!important;height:45px!important}}';
 document.head.appendChild(s);
}if(!$('ppPrinterMaterialPolishStyles')){
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