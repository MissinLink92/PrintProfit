(()=>{
'use strict';
if(window.__printProfitPrinterPriceSync)return;
window.__printProfitPrinterPriceSync=true;
function sync(){
 const map=window.PRINTPROFIT_PRINTER_PRICES||{};
 const select=document.getElementById('printer');
 if(!select)return false;
 let changed=false;
 [...select.options].forEach(opt=>{
   const name=String(opt.textContent||'').trim();
   const price=map[name];
   if(!Number.isFinite(price)||!opt.value||opt.value==='custom'||opt.value.startsWith('custom|'))return;
   // Retail snapshots are useful context, but depreciation must not silently
   // change when a shop changes its price. Keep the costing preset untouched.
   opt.dataset.retailPrice=String(price);
   changed=true;
 });
 if(changed)select.dispatchEvent(new Event('printer-retail-prices-ready'));
 return changed;
}
function boot(){
 if(!sync())setTimeout(sync,50);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
