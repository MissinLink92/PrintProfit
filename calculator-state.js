(()=>{
'use strict';
if(window.__printProfitCalculatorState)return;
window.__printProfitCalculatorState=true;

const KEY='printprofit.calculator-draft.v3';
const LEGACY_KEY='printprofit.calculator-draft.v1';
const OLD_KEY='printprofit.calculator-draft.v2';
const HANDOFF_KEY='printprofit.calculator-navigation-handoff.v1';

function markNavigationHandoff(){
  try{sessionStorage.setItem(HANDOFF_KEY,'1');}catch(e){}
}

function hasNavigationHandoff(){
  try{return sessionStorage.getItem(HANDOFF_KEY)==='1';}catch(e){return false;}
}

function clearNavigationHandoff(){
  try{sessionStorage.removeItem(HANDOFF_KEY);}catch(e){}
}

function isPreservedDestination(anchor){
  if(!anchor)return false;
  const href=String(anchor.href||'').toLowerCase();
  const label=String(anchor.textContent||'').trim().toLowerCase();
  return href.includes('price-finder.html') ||
         href.includes('profit-advisor') ||
         label.includes('price finder') ||
         label.includes('profit advisor');
}

function isPersistedField(el){
  if(!el || !el.id) return false;
  if(el.type==='file' || el.readOnly || el.disabled) return false;
  if(el.closest('#ppProfitTools,#ppProfitAdvisor,.pp-profit-advisor')) return false;
  if(/^pp(?:WhatIf|WI|Bulk|SellWhere|ResultStatus)/i.test(el.id)) return false;
  if(/^(reset|calc|clear)$/i.test(el.id)) return false;
  return true;
}

function snapshot(){
  const data={fields:{},fileName:'',fileStatus:'',fileData:{}};
  document.querySelectorAll('input,select,textarea').forEach(el=>{
    if(!isPersistedField(el))return;
    data.fields[el.id]={
      value:el.value,
      selectedText:el.tagName==='SELECT' ? (el.selectedOptions?.[0]?.textContent||'').trim() : undefined,
      checked:(el.type==='checkbox'||el.type==='radio')?!!el.checked:undefined
    };
  });
  const file=document.getElementById('file');
  if(file?.files?.[0])data.fileName=file.files[0].name;
  const status=document.getElementById('status');
  if(status)data.fileStatus=status.textContent||'';
  try{
    const fd=window.__ppFileData||{};
    data.fileData=JSON.parse(JSON.stringify(fd));
  }catch(e){data.fileData={}}
  // Result mode is derived from quantity, so do not persist the active result tab.
  // Otherwise an old Batch tab can return even when quantity is back at 1.
  const stage=document.querySelector('.pp-step.active')?.dataset.tab;
  if(stage)data.stage=stage;
  return data;
}

function save(){
  const raw=JSON.stringify(snapshot());
  // The draft lives in sessionStorage, but is only allowed to survive a page
  // unload when the user explicitly navigates to Price Finder or Profit Advisor.
  try{sessionStorage.setItem(KEY,raw);}catch(e){console.warn('PrintProfit session draft save failed:',e);}
  try{localStorage.removeItem(KEY);localStorage.removeItem(LEGACY_KEY);localStorage.removeItem(OLD_KEY);}catch(e){}
}

function read(){
  try{
    const raw=sessionStorage.getItem(KEY)||'null';
    const data=JSON.parse(raw);
    return data&&typeof data==='object'?data:null;
  }catch(e){return null;}
}

function restore(){
  const data=read();
  if(!data?.fields)return false;

  try{window.__ppFileData=(data.fileData&&typeof data.fileData==='object')?data.fileData:{};}catch(e){window.__ppFileData={};}
  try{window.__ppRestoredFileName=String(data.fileName||'');}catch(e){window.__ppRestoredFileName='';}
  if(data.fileStatus){
    const status=document.getElementById('status');
    if(status)status.textContent=data.fileStatus;
  }

  const ids=Object.keys(data.fields);
  ids.forEach(id=>{
    const el=document.getElementById(id),state=data.fields[id];
    if(!el||!isPersistedField(el))return;
    if((el.type==='checkbox'||el.type==='radio')&&typeof state?.checked==='boolean'){
      el.checked=state.checked;
    }else if(el.tagName==='SELECT'){
      const wanted=String(state?.value??'');
      if([...el.options].some(o=>o.value===wanted)){
        el.value=wanted;
      }else{
        const label=String(state?.selectedText||'').trim();
        const byLabel=[...el.options].find(o=>o.textContent.trim()===label);
        if(byLabel){
          el.value=byLabel.value;
        }else if(el.id==='printer'){
          const parts=wanted.split(/[|,]/);
          const power=Number(parts[0]),life=Number(parts[2]);
          if(Number.isFinite(power)&&Number.isFinite(life)){
            const legacy=[...el.options].find(o=>{
              const p=String(o.value||'').split(/[|,]/);
              return Number(p[0])===power&&Number(p[2])===life;
            });
            if(legacy)el.value=legacy.value;
          }
        }
      }
    }else{
      el.value=state?.value??'';
    }
  });

  const fireChange=id=>{
    const el=document.getElementById(id);
    if(el)el.dispatchEvent(new Event('change',{bubbles:true}));
  };

  // Let the existing calculator rebuild dependent controls first.
  ['printer','materialType','platformSelect','deliveryCourier','deliveryRate'].forEach(fireChange);

  // Re-apply the exact saved values afterwards so custom fees, manual delivery
  // overrides and other user-entered fields are not replaced by profile defaults.
  ids.forEach(id=>{
    const el=document.getElementById(id),state=data.fields[id];
    if(!el||!isPersistedField(el))return;
    if((el.type==='checkbox'||el.type==='radio')&&typeof state?.checked==='boolean'){
      el.checked=state.checked;
    }else if(el.tagName==='SELECT'){
      const wanted=String(state?.value??'');
      if([...el.options].some(o=>o.value===wanted)){
        el.value=wanted;
      }else{
        const label=String(state?.selectedText||'').trim();
        const byLabel=[...el.options].find(o=>o.textContent.trim()===label);
        if(byLabel){
          el.value=byLabel.value;
        }else if(el.id==='printer'){
          const parts=wanted.split(/[|,]/);
          const power=Number(parts[0]),life=Number(parts[2]);
          if(Number.isFinite(power)&&Number.isFinite(life)){
            const legacy=[...el.options].find(o=>{
              const p=String(o.value||'').split(/[|,]/);
              return Number(p[0])===power&&Number(p[2])===life;
            });
            if(legacy)el.value=legacy.value;
          }
        }
      }
    }else{
      el.value=state?.value??'';
    }
  });

  ids.forEach(id=>{
    const el=document.getElementById(id);
    if(el)el.dispatchEvent(new Event('input',{bubbles:true}));
  });

  // Delivery service is a dependent select: changing the courier rebuilds its
  // options and selects the first service. Restore the courier first, then put
  // the saved service back, fire its change handler, and finally restore any
  // saved manual delivery override. Do not fire the courier change again after
  // restoring the saved delivery service, or it will jump back to the first rate.
  const deliveryCourier=document.getElementById('deliveryCourier');
  const savedCourier=data.fields.deliveryCourier;
  const savedRate=data.fields.deliveryRate;
  const savedDelivery=data.fields.delivery;

  if(deliveryCourier && savedCourier){
    deliveryCourier.value=String(savedCourier.value??'');
    deliveryCourier.dispatchEvent(new Event('change',{bubbles:true}));

    const deliveryRate=document.getElementById('deliveryRate');
    if(deliveryRate && savedRate){
      const wantedRate=String(savedRate.value??'');
      if([...deliveryRate.options].some(o=>o.value===wantedRate)){
        deliveryRate.value=wantedRate;
      }
      deliveryRate.dispatchEvent(new Event('change',{bubbles:true}));
    }

    // Preserve a saved manual delivery override after the automatic rate handler.
    if(savedDelivery){
      const delivery=document.getElementById('delivery');
      if(delivery && Object.prototype.hasOwnProperty.call(savedDelivery,'value')){
        delivery.value=savedDelivery.value??'';
      }
    }
  }

  ids.forEach(id=>{
    if(id==='deliveryCourier'||id==='deliveryRate')return;
    const el=document.getElementById(id);
    if(el)el.dispatchEvent(new Event('change',{bubbles:true}));
  });

  setTimeout(()=>{
    try{document.getElementById('calc')?.click();}catch(e){}
    if(data.stage){
      const step=document.querySelector('.pp-step[data-tab="'+data.stage+'"]');
      if(step)step.click();
    }
    save();
    clearNavigationHandoff();
  },80);

  // Recreate the last uploaded file where the existing file-storage helper has it.
  setTimeout(async()=>{
    await restoreLastUploadedFile();
    window.__ppRefreshModelHub?.();
  },140);
  // Even if the browser refuses programmatic file assignment, restore the saved
  // metadata/field state into the model panel so navigation never blanks Your Model.
  setTimeout(()=>window.__ppRefreshModelHub?.(),260);
  setTimeout(()=>window.__ppRefreshModelHub?.(),520);
  return true;
}

async function restoreLastUploadedFile(){
  const input=document.getElementById('file');
  if(!input)return;
  try{
    const db=await new Promise((resolve,reject)=>{
      const r=indexedDB.open('printprofit.uploaded-file.v1',1);
      r.onsuccess=()=>resolve(r.result);
      r.onerror=()=>reject(r.error);
    });
    const saved=await new Promise((resolve,reject)=>{
      const tx=db.transaction('files','readonly');
      const q=tx.objectStore('files').get('latest');
      q.onsuccess=()=>resolve(q.result||null);
      q.onerror=()=>reject(q.error);
    });
    db.close();
    if(!saved?.blob)return;
    const draft=read();
    const currentName=String(draft?.fileName||'');
    if(!currentName || currentName!==saved.name)return;
    const file=new File([saved.blob],saved.name,{type:saved.type||'application/octet-stream',lastModified:saved.lastModified||Date.now()});
    const dt=new DataTransfer();
    dt.items.add(file);
    input.files=dt.files;
    input.dispatchEvent(new Event('change',{bubbles:true}));
  }catch(e){
    // Browsers can restrict programmatic file assignment; the saved values still restore.
  }
}

window.__printProfitPersistDraft=save;
window.__printProfitClearDraft=()=>{
  try{localStorage.removeItem(KEY);localStorage.removeItem(LEGACY_KEY);localStorage.removeItem(OLD_KEY);}catch(e){}
  try{sessionStorage.removeItem(KEY);sessionStorage.removeItem(LEGACY_KEY);sessionStorage.removeItem(OLD_KEY);}catch(e){}
  try{window.__ppRestoredFileName='';}catch(e){}
  clearNavigationHandoff();
};

function boot(){
  document.addEventListener('click',e=>{
    const target=e.target?.closest?.('#reset,#clear');
    if(target?.id==='reset'){window.__printProfitClearDraft();return;}
    if(target?.id==='clear')setTimeout(save,30);

    // The live calculator top navigation uses buttons rather than anchors.
    // Treat Price Finder / Profit Advisor buttons exactly like preserved links:
    // save the current draft before leaving the calculator.
    const navButton=e.target?.closest?.('#ppCleanTop [data-target="priceFinder"],#ppCleanTop [data-target="profitAdvisor"]');
    if(navButton){
      save();
      markNavigationHandoff();
      return;
    }

    const anchor=e.target?.closest?.('a[href]');
    if(anchor && isPreservedDestination(anchor)){
      save();
      markNavigationHandoff();
    }
  },true);
  document.addEventListener('input',e=>{
    if(e.target?.matches?.('input,select,textarea') && isPersistedField(e.target))save();
  });
  document.addEventListener('change',e=>{
    if(e.target?.matches?.('input,select,textarea') && isPersistedField(e.target))save();
  });
  const handleUnload=()=>{
    if(hasNavigationHandoff()){
      // Keep the draft for the destination page, then consume the handoff there.
      save();
      return;
    }
    // A normal refresh, tab close, browser close, or navigation elsewhere should
    // always leave the next calculator visit clean.
    window.__printProfitClearDraft();
  };
  window.addEventListener('pagehide',handleUnload);
  window.addEventListener('beforeunload',handleUnload);
  window.addEventListener('pageshow',()=>setTimeout(restore,0));

  const wait=()=>{
    if(window.__printProfitReady){
      restore();
      return;
    }
    if(Date.now()-start>12000)return;
    setTimeout(wait,100);
  };
  const start=Date.now();
  wait();
}

if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});
else boot();

})();