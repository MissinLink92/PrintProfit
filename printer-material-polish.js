(()=>{ 
'use strict';
if(window.__printProfitPrinterMaterialPolish)return;
window.__printProfitPrinterMaterialPolish=true;
function money(v){return '£'+(Number(v)||0).toFixed(2);}
function install(){
 const printer=document.getElementById('printer'), material=document.getElementById('material');
 if(!printer||!material)return false;
 const printerBlock=printer.closest('.merge-block');
 if(printerBlock&&!document.getElementById('ppPrinterProfile')){
  const card=document.createElement('div');card.id='ppPrinterProfile';card.className='pp-profile-card';
  card.innerHTML='<div class="pp-profile-head"><span class="pp-profile-icon">⚙</span><div><strong>Printer Profile</strong><span>Values used by PrintProfit for this machine.</span></div></div><div class="pp-profile-grid"><div><span>Purchase price</span><b id="ppPrinterPrice">—</b></div><div><span>Power draw</span><b id="ppPrinterPower">—</b></div><div><span>Expected life</span><b id="ppPrinterLife">—</b></div><div><span>Depreciation</span><b id="ppPrinterDep">—</b></div></div>';
  printer.closest('section.panel')?.insertAdjacentElement('afterend',card);
 }
 const materialBlock=material.closest('.merge-block');
 if(materialBlock&&!document.getElementById('ppMaterialRate')){
  const rate=document.createElement('div');rate.id='ppMaterialRate';rate.className='pp-material-rate';
  rate.innerHTML='<span>Material cost rate</span><strong id="ppMaterialRateValue">£0.00 / g</strong>';
  document.getElementById('materialCostOut')?.closest('.two')?.insertAdjacentElement('afterend',rate);
 }
 function update(){
  const parts=(printer.value||'').split('|'),power=Number(parts[0]),price=Number(parts[1]),life=Number(parts[2]);
  const set=(id,val)=>{const e=document.getElementById(id);if(e)e.textContent=val;};
  if(price>0){set('ppPrinterPrice',money(price));set('ppPrinterPower',power>0?power+' W':'—');set('ppPrinterLife',life>0?life.toLocaleString()+' h':'—');set('ppPrinterDep',life>0?money(price/life)+'/h':'—');}
  else{set('ppPrinterPrice','Custom');set('ppPrinterPower','Custom');set('ppPrinterLife','Custom');set('ppPrinterDep','From custom profile');}
  const pack=Number(document.getElementById('materialPack')?.value)||0,cost=Number(document.getElementById('materialPackCost')?.value)||0;
  const label=document.getElementById('packAmountLabel')?.textContent||'',unit=/ml/i.test(label)?'ml':'g';
  set('ppMaterialRateValue',pack>0?money(cost/pack)+' / '+unit:'—');
 }
 printer.addEventListener('change',update);material.addEventListener('change',update);
 ['materialPack','materialPackCost','materialType'].forEach(id=>document.getElementById(id)?.addEventListener('input',update));
 document.addEventListener('change',e=>{if(['materialPack','materialPackCost','materialType'].includes(e.target?.id))update();});
 update();
 const style=document.createElement('style');style.id='ppPrinterMaterialPolishStyles';style.textContent='.pp-profile-card{margin-top:9px;border:1px solid var(--line);border-radius:9px;background:rgba(7,16,24,.55);padding:9px 10px}.pp-profile-head{display:flex;align-items:center;gap:8px;margin-bottom:8px}.pp-profile-icon{width:27px;height:27px;border-radius:8px;background:#ff780012;border:1px solid #ff780044;color:var(--accent);display:grid;place-items:center;font-size:12px}.pp-profile-head strong{display:block;font-size:11px}.pp-profile-head span{display:block;color:var(--muted);font-size:9px;margin-top:2px}.pp-profile-grid{display:grid;grid-template-columns:1fr 1fr;gap:6px}.pp-profile-grid>div{border:1px solid var(--line);border-radius:7px;padding:7px 8px;background:var(--panel2)}.pp-profile-grid span{display:block;color:var(--muted);font-size:9px;margin-bottom:3px}.pp-profile-grid b{display:block;font-size:11px}.pp-material-rate{display:flex;align-items:center;justify-content:space-between;gap:8px;margin-top:7px;padding:7px 9px;border:1px solid var(--line);border-radius:7px;background:rgba(255,120,0,.025)}.pp-material-rate span{font-size:9px;color:var(--muted)}.pp-material-rate strong{font-size:11px;color:var(--accent)}';
 document.head.appendChild(style); return true;
}
function boot(){if(install())return;const t=Date.now(),x=setInterval(()=>{if(install()||Date.now()-t>15000)clearInterval(x)},50)}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();