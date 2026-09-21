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
   if(!Number.isFinite(price)||!opt.value||opt.value==='custom')return;
   const parts=opt.value.split(/[|,]/);
   if(parts.length<3)return;
   const next=parts.map(String);
   next[1]=Number(price).toFixed(2).replace(/\.00$/,'');
   const value=next.join('|');
   if(opt.value!==value){opt.value=value;changed=true;}
 });
 return changed;
}
function boot(){
 if(!sync())setTimeout(sync,50);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
