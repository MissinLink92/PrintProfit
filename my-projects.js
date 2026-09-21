(()=>{ 
'use strict';
if(window.__printProfitProjects)return; window.__printProfitProjects=true;
const KEY='printprofit.projects.v1';
const FILE_DB='printprofit.project-files.v1';
const PROJECT_DB='printprofit.project-records.v1';
const projectDb=()=>new Promise((resolve,reject)=>{const r=indexedDB.open(PROJECT_DB,1);r.onupgradeneeded=()=>r.result.createObjectStore('projects',{keyPath:'id'});r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error)});
const persistProjects=async projects=>{try{const db=await projectDb();await new Promise((res,rej)=>{const tx=db.transaction('projects','readwrite'),store=tx.objectStore('projects');store.clear();projects.forEach(p=>store.put(p));tx.oncomplete=res;tx.onerror=()=>rej(tx.error)});db.close();return true}catch(e){console.warn('PrintProfit project backup save failed:',e);return false}};
const readProjectsBackup=async()=>{try{const db=await projectDb();const values=await new Promise((res,rej)=>{const tx=db.transaction('projects','readonly'),q=tx.objectStore('projects').getAll();q.onsuccess=()=>res(q.result||[]);q.onerror=()=>rej(q.error)});db.close();return values}catch(e){console.warn('PrintProfit project backup read failed:',e);return[]}};
const hydrateProjects=async()=>{const current=read();if(current.length){persistProjects(current);return current;}const backup=await readProjectsBackup();if(backup.length){try{localStorage.setItem(KEY,JSON.stringify(backup));}catch(e){console.warn('PrintProfit project local restore failed:',e)}return backup;}return current};

const fileDb=()=>new Promise((resolve,reject)=>{const r=indexedDB.open(FILE_DB,1);r.onupgradeneeded=()=>r.result.createObjectStore('files');r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error)});
const putProjectFile=async(id,file)=>{if(!file)return;try{const db=await fileDb();await new Promise((res,rej)=>{const tx=db.transaction('files','readwrite');tx.objectStore('files').put({blob:file,name:file.name,type:file.type,lastModified:file.lastModified},id);tx.oncomplete=res;tx.onerror=()=>rej(tx.error)});db.close()}catch(e){console.warn('PrintProfit could not save project file:',e)}};
const getProjectFile=async id=>{try{const db=await fileDb();const v=await new Promise((res,rej)=>{const tx=db.transaction('files','readonly');const q=tx.objectStore('files').get(id);q.onsuccess=()=>res(q.result);q.onerror=()=>rej(q.error)});db.close();return v||null}catch(e){console.warn('PrintProfit could not restore project file:',e);return null}};
const restoreProjectFile=async id=>{let saved=await getProjectFile(id);if(!saved){try{const db=await fileDb();saved=await new Promise((res,rej)=>{const tx=db.transaction('files','readonly');const q=tx.objectStore('files').get('latest');q.onsuccess=()=>res(q.result);q.onerror=()=>rej(q.error)});db.close()}catch(e){}}if(!saved)return false;const input=document.getElementById('file');if(!input)return false;try{const file=new File([saved.blob],saved.name,{type:saved.type||'application/octet-stream',lastModified:saved.lastModified||Date.now()});const dt=new DataTransfer();dt.items.add(file);input.files=dt.files;input.dispatchEvent(new Event('change',{bubbles:true}));return true}catch(e){console.warn('PrintProfit could not put saved file back into upload control:',e);return false}};
const val=id=>document.getElementById(id)?.value??'';
const read=()=>{try{const data=JSON.parse(localStorage.getItem(KEY)||'[]');return Array.isArray(data)?data:[]}catch(e){console.warn('PrintProfit project read error:',e);return[]}};
const write=v=>{try{localStorage.setItem(KEY,JSON.stringify(v));persistProjects(v);return true}catch(e){console.warn('PrintProfit project save error:',e);persistProjects(v);return false}};
const esc=s=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
const snapshot=()=>{
 const data={};
 document.querySelectorAll('input,select,textarea').forEach(el=>{
  if(!el.id||el.type==='file')return;
  data[el.id]={
   value:el.value,
   selectedText:el.tagName==='SELECT' ? (el.selectedOptions?.[0]?.textContent||'').trim() : undefined,
   checked:el.type==='checkbox'||el.type==='radio'?!!el.checked:undefined
  };
 });
 return data;
};
const restore=data=>{
 if(!data||typeof data!=='object')return;
 const pending=[];
 const setSelectValue=(el,state)=>{
  const wanted=String(state?.value??'');
  if([...el.options].some(o=>o.value===wanted)){el.value=wanted;return;}
  const label=String(state?.selectedText||'').trim();
  const byLabel=[...el.options].find(o=>o.textContent.trim()===label);
  if(byLabel){el.value=byLabel.value;return;}
  if(el.id==='printer'){
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
 };
 // Set every field first, then fire events so dependent controls see the
 // complete restored state rather than rebuilding over values still to come.
 Object.entries(data).forEach(([id,state])=>{
  const el=document.getElementById(id);if(!el)return;
  if((el.type==='checkbox'||el.type==='radio')&&typeof state?.checked==='boolean')el.checked=state.checked;
  else if(el.tagName==='SELECT')setSelectValue(el,state);
  else el.value=state?.value??'';
  pending.push(el);
 });
 pending.forEach(el=>el.dispatchEvent(new Event('input',{bubbles:true})));
 pending.forEach(el=>el.dispatchEvent(new Event('change',{bubbles:true})));
 const calc=document.getElementById('calc');
 if(calc)setTimeout(()=>calc.click(),60);
};
const projectInfo=()=>{
 const material=val('material')||val('materialType')||'Material';
 const hours=val('printHours')||'0';
 const used=val('materialUsed')||'0';
 const currency=(document.getElementById('singleSellOut')?.textContent||'').trim();
 return {material,hours,used,currency};
};
function close(){const p=document.getElementById('ppProjectsPanel');if(p)p.classList.remove('open');document.body.style.overflow='';}
function render(){
 const list=document.getElementById('ppProjectsList');if(!list)return;
 const projects=read().sort((a,b)=>b.updated-a.updated);
 if(!projects.length){list.innerHTML='<div class="pp-projects-empty"><div class="pp-projects-empty-icon">＋</div><h3>No saved projects yet</h3><p>Save a calculator setup here and it will stay available on this device.</p><button type="button" class="pp-project-new" data-project-new>＋ New Project</button></div>';return;}
 list.innerHTML=projects.map(p=>`<article class="pp-project-card" data-project-id="${esc(p.id)}">
   <div class="pp-project-card-main">
    <div class="pp-project-icon">▣</div>
    <div><h3>${esc(p.name)}</h3><p>${esc(p.material)} · ${esc(p.hours)} h · ${esc(p.used)} used</p><small>Saved ${new Date(p.updated).toLocaleString([], {dateStyle:'medium',timeStyle:'short'})}</small></div>
   </div>
   <div class="pp-project-actions"><button type="button" data-load-project="${esc(p.id)}">Load</button><button type="button" data-duplicate-project="${esc(p.id)}">Duplicate</button><button type="button" class="danger" data-delete-project="${esc(p.id)}">Delete</button></div>
 </article>`).join('');
}
function open(){
 let panel=document.getElementById('ppProjectsPanel');
 if(!panel){
  panel=document.createElement('div');panel.id='ppProjectsPanel';
  panel.innerHTML=`<div class="pp-projects-backdrop" data-project-close></div>
  <section class="pp-projects-dialog" role="dialog" aria-modal="true" aria-labelledby="ppProjectsTitle">
   <header class="pp-projects-head"><div><div class="pp-projects-kicker">PRINTPROFIT</div><h2 id="ppProjectsTitle">My Projects</h2><p>Save and return to your calculations whenever you need them.</p></div><button type="button" class="pp-projects-close" data-project-close aria-label="Close">×</button></header>
   <div class="pp-projects-toolbar"><button type="button" class="pp-project-new" data-project-new>＋ New Project</button><span class="pp-project-count" id="ppProjectCount"></span></div>
   <div id="ppProjectsList"></div>
  </section>`;
  document.body.appendChild(panel);
  const style=document.createElement('style');style.textContent=`
#ppProjectsPanel{display:none;position:fixed;inset:0;z-index:100000}
#ppProjectsPanel.open{display:block}.pp-projects-backdrop{position:absolute;inset:0;background:#000b;backdrop-filter:blur(5px)}
.pp-projects-dialog{position:relative;width:min(900px,calc(100% - 28px));max-height:calc(100vh - 40px);margin:20px auto;background:#081720;color:#edf3f6;border:1px solid #294957;border-radius:20px;box-shadow:0 25px 80px #000d;overflow:auto;font-family:Inter,Segoe UI,system-ui,sans-serif}
.pp-projects-head{display:flex;justify-content:space-between;gap:20px;padding:25px 28px 20px;border-bottom:1px solid #294957;background:linear-gradient(145deg,#0b202b,#07141d)}
.pp-projects-kicker{font-size:10px;font-weight:900;letter-spacing:.18em;color:#ff7800}.pp-projects-head h2{margin:5px 0 5px;font-size:30px}.pp-projects-head p{margin:0;color:#9fb0b9}.pp-projects-close{width:38px;height:38px;border:1px solid #355363;border-radius:10px;background:#091923;color:#fff;font-size:26px;cursor:pointer}
.pp-projects-toolbar{display:flex;align-items:center;justify-content:space-between;padding:18px 28px 8px}.pp-project-new{border:1px solid #ff7800;background:#ff7800;color:#fff;border-radius:9px;padding:10px 15px;font-weight:800;cursor:pointer}.pp-project-count{color:#9fb0b9;font-size:12px}
#ppProjectsList{padding:10px 28px 28px}.pp-project-card{display:flex;justify-content:space-between;gap:18px;align-items:center;padding:17px;margin-top:10px;border:1px solid #294957;border-radius:14px;background:#0b202b}.pp-project-card-main{display:flex;gap:14px;align-items:center;min-width:0}.pp-project-icon{width:42px;height:42px;border-radius:11px;display:grid;place-items:center;background:#ff780015;border:1px solid #ff780055;color:#ff7800;font-size:20px}.pp-project-card h3{margin:0 0 4px;font-size:16px}.pp-project-card p{margin:0;color:#c5d1d7;font-size:12px}.pp-project-card small{display:block;color:#758a95;margin-top:5px}.pp-project-actions{display:flex;gap:7px;flex-wrap:wrap}.pp-project-actions button{border:1px solid #355363;background:#091923;color:#e6eef2;border-radius:8px;padding:8px 10px;cursor:pointer;font-weight:700}.pp-project-actions button:hover{border-color:#ff7800}.pp-project-actions .danger:hover{border-color:#d9534f;color:#ff9a96}.pp-projects-empty{text-align:center;padding:55px 20px;color:#9fb0b9}.pp-projects-empty-icon{font-size:38px;color:#ff7800}.pp-projects-empty h3{color:#edf3f6;margin:10px 0 5px}.pp-projects-empty p{margin:0 0 20px}
@media(max-width:650px){.pp-projects-dialog{margin:10px auto;max-height:calc(100vh - 20px)}.pp-projects-head{padding:20px}.pp-projects-toolbar,#ppProjectsList{padding-left:20px;padding-right:20px}.pp-project-card{align-items:flex-start;flex-direction:column}.pp-project-actions{width:100%}.pp-project-actions button{flex:1}.pp-projects-head h2{font-size:25px}}
`;document.head.appendChild(style);
 }
 panel.classList.add('open');document.body.style.overflow='hidden';render();
 const count=document.getElementById('ppProjectCount');if(count)count.textContent=read().length+' saved '+(read().length===1?'project':'projects');
 hydrateProjects().then(projects=>{
   render();
   const c=document.getElementById('ppProjectCount');
   if(c)c.textContent=projects.length+' saved '+(projects.length===1?'project':'projects');
 });
}
async function saveNew(){
 const current=projectInfo();const suggested=(val('file')||'').split('\\').pop().replace(/\.[^.]+$/,'')||'My 3D Print';
 const name=prompt('Name this project:',suggested);if(!name||!name.trim())return;
 const projects=read();const now=Date.now();
 const id=crypto.randomUUID?crypto.randomUUID():String(now)+Math.random();
 const file=document.getElementById('file')?.files?.[0]||null;
 let fileData={};try{fileData=JSON.parse(JSON.stringify(window.__ppFileData||{}));}catch(e){}
 const fileStatus=document.getElementById('status')?.textContent||'';
 projects.push({id,name:name.trim(),updated:now,material:current.material,hours:current.hours,used:current.used,data:snapshot(),file:file?{name:file.name,type:file.type,lastModified:file.lastModified}:null,fileData,fileStatus});
 if(!write(projects))return;
 await persistProjects(projects);
 if(file) await putProjectFile(id,file);
 open();
}
async function loadProject(id){
 const p=read().find(x=>x.id===id);if(!p)return;
 try{window.__ppFileData=(p.fileData&&typeof p.fileData==='object')?p.fileData:(p.data?.fileData&&typeof p.data.fileData==='object'?p.data.fileData:{});}catch(e){window.__ppFileData={};}
 if(p.fileStatus){const status=document.getElementById('status');if(status)status.textContent=p.fileStatus;}
 restore(p.data);
 await restoreProjectFile(id);
 window.__ppRefreshModelHub?.();
 setTimeout(()=>window.__ppRefreshModelHub?.(),180);
 close();
 // Make the restored setup immediately visible after loading.
 setTimeout(()=>{
   const machineTab=document.querySelector('.pp-step[data-tab="machine"]');
   if(machineTab)machineTab.click();
   // Result view is derived from quantity when a project is loaded.
   // A saved project with quantity 1 must never reopen on Batch Pricing.
   const qty=Math.max(1,Math.floor(Number(document.getElementById('qty')?.value)||1));
   const mode=qty>1?'batch':'single';
   const tab=document.querySelector('#resultTabs .tab[data-result-tab="'+mode+'"]');
   if(tab)tab.click();
   // Re-apply once more after the calculator/state restoration settles.
   setTimeout(()=>{
     const q=Math.max(1,Math.floor(Number(document.getElementById('qty')?.value)||1));
     const m=q>1?'batch':'single';
     document.querySelector('#resultTabs .tab[data-result-tab="'+m+'"]')?.click();
   },180);
 },120);
}
function duplicateProject(id){const p=read().find(x=>x.id===id);if(!p)return;const copy=structuredClone?structuredClone(p):JSON.parse(JSON.stringify(p));copy.id=crypto.randomUUID?crypto.randomUUID():String(Date.now())+Math.random();copy.name=p.name+' (Copy)';copy.updated=Date.now();write([...read(),copy]);render();document.getElementById('ppProjectCount').textContent=read().length+' saved projects';}
function deleteProject(id){const p=read().find(x=>x.id===id);if(!p)return;if(!confirm('Delete “'+p.name+'”?'))return;write(read().filter(x=>x.id!==id));render();const c=document.getElementById('ppProjectCount');if(c)c.textContent=read().length+' saved '+(read().length===1?'project':'projects');}
document.addEventListener('click',e=>{
 const target=e.target.closest('[data-target="projects"],[data-project-close],[data-project-new],[data-load-project],[data-duplicate-project],[data-delete-project]');
 if(!target)return;
 if(target.matches('[data-target="projects"]')){e.preventDefault();e.stopPropagation();open();}
 else if(target.hasAttribute('data-project-close'))close();
 else if(target.hasAttribute('data-project-new'))saveNew();
 else if(target.hasAttribute('data-load-project'))loadProject(target.dataset.loadProject);
 else if(target.hasAttribute('data-duplicate-project'))duplicateProject(target.dataset.duplicateProject);
 else if(target.hasAttribute('data-delete-project'))deleteProject(target.dataset.deleteProject);
},true);
document.addEventListener('keydown',e=>{if(e.key==='Escape')close()});
})();