(()=>{
'use strict';
if(window.__printProfitCalculatorState)return;
window.__printProfitCalculatorState=true;

const KEY='printprofit.calculator-draft.v1';

function isPersistedField(el){
  if(!el || !el.id) return false;
  if(el.type==='file' || el.readOnly || el.disabled) return false;
  if(el.closest('#ppProfitTools,#ppProfitAdvisor,.pp-profit-advisor')) return false;
  if(/^pp(?:WhatIf|WI|Bulk|SellWhere|ResultStatus)/i.test(el.id)) return false;
  if(/^(reset|calc|clear)$/i.test(el.id)) return false;
  return true;
}

function snapshot(){
  const data={fields:{}};
  document.querySelectorAll('input,select,textarea').forEach(el=>{
    if(!isPersistedField(el))return;
    data.fields[el.id]={
      value:el.value,
      checked:(el.type==='checkbox'||el.type==='radio')?!!el.checked:undefined
    };
  });
  const resultTab=document.querySelector('#resultTabs .tab.active')?.dataset.resultTab;
  const stage=document.querySelector('.pp-step.active')?.dataset.tab;
  if(resultTab)data.resultTab=resultTab;
  if(stage)data.stage=stage;
  return data;
}

function save(){
  try{localStorage.setItem(KEY,JSON.stringify(snapshot()));}catch(e){console.warn('PrintProfit draft save failed:',e);}
}

function read(){
  try{
    const data=JSON.parse(localStorage.getItem(KEY)||'null');
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

  // Restore dependency-driving fields first, then recalculate the rest.
  ['printer','materialType','platformSelect','deliveryCourier','deliveryRate'].forEach(fireChange);
  ids.forEach(id=>{
    if(['printer','materialType','platformSelect','deliveryCourier','deliveryRate'].includes(id))return;
    const el=document.getElementById(id);
    if(el)el.dispatchEvent(new Event('input',{bubbles:true}));
  });
  ids.forEach(id=>{
    if(['printer','materialType','platformSelect','deliveryCourier','deliveryRate'].includes(id))return;
    const el=document.getElementById(id);
    if(el)el.dispatchEvent(new Event('change',{bubbles:true}));
  });

  setTimeout(()=>{
    try{document.getElementById('calc')?.click();}catch(e){}
    if(data.resultTab){
      const tab=document.querySelector('#resultTabs .tab[data-result-tab="'+data.resultTab+'"]');
      if(tab)tab.click();
    }
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
    const currentName=String(read()?.fields?.fileName?.value||'');
    if(currentName && currentName!==saved.name)return;
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
  try{localStorage.removeItem(KEY);}catch(e){}
};

function boot(){
  document.addEventListener('input',e=>{
    if(e.target?.matches?.('input,select,textarea') && isPersistedField(e.target))save();
  });
  document.addEventListener('change',e=>{
    if(e.target?.matches?.('input,select,textarea') && isPersistedField(e.target))save();
  });
  window.addEventListener('pagehide',save);
  window.addEventListener('beforeunload',save);

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