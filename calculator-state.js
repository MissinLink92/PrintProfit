(()=>{
'use strict';
if(window.__printProfitCalculatorState)return;
window.__printProfitCalculatorState=true;

const KEY='printprofit.calculator-draft.v2';
const LEGACY_KEY='printprofit.calculator-draft.v1';

function isPersistedField(el){
  if(!el || !el.id) return false;
  if(el.type==='file' || el.readOnly || el.disabled) return false;
  if(el.closest('#ppProfitTools,#ppProfitAdvisor,.pp-profit-advisor')) return false;
  if(/^pp(?:WhatIf|WI|Bulk|SellWhere|ResultStatus)/i.test(el.id)) return false;
  if(/^(reset|calc|clear)$/i.test(el.id)) return false;
  return true;
}

function snapshot(){
  const data={fields:{},fileName:''};
  document.querySelectorAll('input,select,textarea').forEach(el=>{
    if(!isPersistedField(el))return;
    data.fields[el.id]={
      value:el.value,
      checked:(el.type==='checkbox'||el.type==='radio')?!!el.checked:undefined
    };
  });
  const file=document.getElementById('file');
  if(file?.files?.[0])data.fileName=file.files[0].name;
  // Result mode is derived from quantity, so do not persist the active result tab.
  // Otherwise an old Batch tab can return even when quantity is back at 1.
  const stage=document.querySelector('.pp-step.active')?.dataset.tab;
  if(stage)data.stage=stage;
  return data;
}

function save(){
  const raw=JSON.stringify(snapshot());
  // Keep the draft only for this browser tab/session. This preserves data while
  // moving between PrintProfit pages and across refreshes, but starts clean when
  // the browser session ends.
  try{sessionStorage.setItem(KEY,raw);}catch(e){console.warn('PrintProfit session draft save failed:',e);}
  // Remove any pre-session-storage drafts created by older versions.
  try{localStorage.removeItem(KEY);localStorage.removeItem(LEGACY_KEY);}catch(e){}
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

  const ids=Object.keys(data.fields);
  ids.forEach(id=>{
    const el=document.getElementById(id),state=data.fields[id];
    if(!el||!isPersistedField(el))return;
    if((el.type==='checkbox'||el.type==='radio')&&typeof state?.checked==='boolean')el.checked=state.checked;
    else el.value=state?.value??'';
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
    if((el.type==='checkbox'||el.type==='radio')&&typeof state?.checked==='boolean')el.checked=state.checked;
    else el.value=state?.value??'';
  });

  ids.forEach(id=>{
    const el=document.getElementById(id);
    if(el)el.dispatchEvent(new Event('input',{bubbles:true}));
  });
  ids.forEach(id=>{
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
  },80);

  // Recreate the last uploaded file where the existing file-storage helper has it.
  setTimeout(restoreLastUploadedFile,140);
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
  try{localStorage.removeItem(KEY);localStorage.removeItem(LEGACY_KEY);}catch(e){}
  try{sessionStorage.removeItem(KEY);sessionStorage.removeItem(LEGACY_KEY);}catch(e){}
};

function boot(){
  document.addEventListener('click',e=>{
    const target=e.target?.closest?.('#reset,#clear');
    if(target?.id==='reset'){window.__printProfitClearDraft();return;}
    if(target?.id==='clear')setTimeout(save,30);
  },true);
  document.addEventListener('input',e=>{
    if(e.target?.matches?.('input,select,textarea') && isPersistedField(e.target))save();
  });
  document.addEventListener('change',e=>{
    if(e.target?.matches?.('input,select,textarea') && isPersistedField(e.target))save();
  });
  window.addEventListener('pagehide',save);
  window.addEventListener('beforeunload',save);
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