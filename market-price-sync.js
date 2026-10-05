(()=>{'use strict';
if(window.__printProfitMarketPriceSync)return;
window.__printProfitMarketPriceSync=true;

function norm(v){return String(v||'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();}
function products(){return Array.isArray(window.PRINTPROFIT_PRICE_DATA?.products)?window.PRINTPROFIT_PRICE_DATA.products:[];}
function priceOf(p){const n=Number(p?.price);return Number.isFinite(n)&&n>0?n:null;}
function typeMatches(item, selectedType, materialType){
  const a=norm(selectedType), b=norm(item?.type);
  if(!a||!b)return false;
  if(a===b)return true;
  if(materialType==='filament'){
    if(a==='pla' && (b==='pla' || b==='pla basic'))return true;
    if(a==='pla+' && (b==='pla+' || b==='pla plus'))return true;
  }
  return a.includes(b)||b.includes(a);
}
function findBest(){
  const material=document.getElementById('material');
  const type=document.getElementById('materialType');
  const pack=document.getElementById('materialPack');
  if(!material||!type)return null;
  const selected=material.value;
  const materialType=type.value;
  const packWeight=Number(pack?.value)||1000;
  const category=materialType==='resin'?'resin':'filament';
  const candidates=products().filter(p=>p.category===category && typeMatches(p,selected,materialType) && priceOf(p));
  if(!candidates.length)return null;
  return candidates
    .map(p=>({...p,_price:priceOf(p),_distance:Math.abs((Number(p.weightGrams)||packWeight)-packWeight)}))
    .sort((a,b)=>{
      if(a._distance!==b._distance)return a._distance-b._distance;
      return a._price/a._distance===b._price/b._distance ? a._price-b._price : a._price-b._price;
    })[0];
}
function status(text){
  const el=document.getElementById('materialStatus');
  if(el)el.textContent=text;
}
function formatDateDMY(value){if(!value)return '';const join='\u2060/\u2060',raw=String(value),iso=raw.match(/^(\d{4})-(\d{2})-(\d{2})/);if(iso)return iso[3]+join+iso[2]+join+iso[1];const d=new Date(raw);return Number.isFinite(d.getTime())?String(d.getDate()).padStart(2,'0')+join+String(d.getMonth()+1).padStart(2,'0')+join+d.getFullYear():raw;}
function applyLivePrice(){
  const cost=document.getElementById('materialPackCost');
  const pack=document.getElementById('materialPack');
  if(!cost)return false;
  const best=findBest();
  if(!best){
    status('No verified live market match found. Enter your actual material cost manually.');
    return false;
  }
  const price=best._price;
  const weight=Number(best.weightGrams)||Number(pack?.value)||1000;
  cost.dataset.ppLiveWriting='1';
  cost.value=price.toFixed(2);
  cost.dataset.ppMarketSource=best.retailer||best.brand||'Market reference';
  cost.dataset.ppMarketDate=best.updated||window.PRINTPROFIT_PRICE_DATA?.updatedAt||'';
  cost.dispatchEvent(new Event('input',{bubbles:true}));
  cost.dispatchEvent(new Event('change',{bubbles:true}));
  delete cost.dataset.ppLiveWriting;
  if(pack && weight>0 && materialTypeIsFilament()) pack.value=String(weight);
  status('Live market reference: '+price.toFixed(2)+' — '+(best.retailer||'retailer')+(best.updated?' • checked '+formatDateDMY(best.updated):'')+'. Enter your actual cost to override.');
  return true;
}
function materialTypeIsFilament(){return document.getElementById('materialType')?.value!=='resin';}
function onMaterialChange(){
  const cost=document.getElementById('materialPackCost');
  if(cost){cost.dataset.ppManual='0';}
  setTimeout(applyLivePrice,0);
}
function bind(){
  const material=document.getElementById('material');
  const type=document.getElementById('materialType');
  const cost=document.getElementById('materialPackCost');
  if(!material||!type||!cost)return false;
  if(!material.dataset.ppMarketBound){
    material.dataset.ppMarketBound='1';
    material.addEventListener('change',onMaterialChange);
  }
  if(!type.dataset.ppMarketBound){
    type.dataset.ppMarketBound='1';
    type.addEventListener('change',onMaterialChange);
  }
  if(!cost.dataset.ppManualBound){
    cost.dataset.ppManualBound='1';
    cost.addEventListener('input',()=>{if(cost.dataset.ppLiveWriting!=='1')cost.dataset.ppManual='1';});
  }
  if(cost.dataset.ppMarketInitialised!=='1'){
    cost.dataset.ppMarketInitialised='1';
    if(Number(cost.value)||String(cost.value).trim()) cost.dataset.ppManual='1';
    else applyLivePrice();
  }

  return true;
}
function boot(){
  if(bind())return;
  const started=Date.now();
  const timer=setInterval(()=>{if(bind()||Date.now()-started>15000)clearInterval(timer)},100);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();