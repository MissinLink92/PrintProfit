(()=>{ 
'use strict';
if(window.__printProfitProjects)return; window.__printProfitProjects=true;
function syncWorkspaceModalState(){
 const open=!!document.querySelector('#ppMaterialsPanel.open,#ppProjectsPanel.open');
 const bodies=[document.body];
 try{if(window.parent&&window.parent!==window)bodies.push(window.parent.document.body)}catch(e){}
 bodies.forEach(body=>{if(open)body.dataset.ppModalOpen='true';else delete body.dataset.ppModalOpen;});
 window.__ppSyncWorkspaceModalState?.();
}
const KEY='printprofit.projects.v1';
const PROJECT_OWNER_KEY='printprofit.projects.owner.v1';
const PROJECT_CACHE_PREFIX='printprofit.projects.user-cache.v1.';
const FILE_DB='printprofit.project-files.v1';
let activeProjectId=null;
window.__ppClearActiveProject=()=>{
  activeProjectId=null;
  setSaveMode(false);
};
const setSaveMode=(loaded)=>{
 try{
  const parent=window.parent&&window.parent!==window?window.parent:window;
  const button=parent.document.getElementById('ppFloatingSave')||document.querySelector('#saveProject');
  if(button){
   const main=button.querySelector('.pp-save-main');
   const sub=button.querySelector('.pp-save-sub');
   if(main)main.textContent=loaded?'UPDATE':'SAVE';
   if(sub)sub.textContent='PROJECT';
   button.title=loaded?'Update loaded project':'Save project';
   button.setAttribute('aria-label',loaded?'Update loaded project':'Save project');
  }
  const inline=document.getElementById('saveProject');
  if(inline)inline.textContent=loaded?'💾 Update Project':'💾 Save Project';
 }catch(e){}
};
const flashUpdateConfirmation=()=>{
 try{
  const parent=window.parent&&window.parent!==window?window.parent:window;
  const button=parent.document.getElementById('ppFloatingSave')||document.getElementById('saveProject');
  if(button){
   const main=button.querySelector('.pp-save-main');
   const sub=button.querySelector('.pp-save-sub');
   button.classList.add('pp-save-updated');
   if(main)main.textContent='UPDATED!';
   if(sub)sub.textContent='SAVED';
   setTimeout(()=>{
    button.classList.remove('pp-save-updated');
    if(main)main.textContent=activeProjectId?'UPDATE':'SAVE';
    if(sub)sub.textContent='PROJECT';
   },1500);
  }
 }catch(e){}
};
const PROJECT_DB='printprofit.project-records.v1';
const projectDb=()=>new Promise((resolve,reject)=>{const r=indexedDB.open(PROJECT_DB,1);r.onupgradeneeded=()=>r.result.createObjectStore('projects',{keyPath:'id'});r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error)});
const projectOwner=()=>{try{return localStorage.getItem(PROJECT_OWNER_KEY)||'guest'}catch(e){return'guest'}};
const projectCacheKey=owner=>PROJECT_CACHE_PREFIX+(owner||'guest');
const readProjectCache=owner=>{try{const data=JSON.parse(localStorage.getItem(projectCacheKey(owner))||'null');return Array.isArray(data)?data:null}catch(e){return null}};
const writeProjectCache=(owner,projects)=>{try{localStorage.setItem(projectCacheKey(owner),JSON.stringify(Array.isArray(projects)?projects:[]));return true}catch(e){return false}};
const persistProjects=async projects=>{try{const db=await projectDb();await new Promise((res,rej)=>{const tx=db.transaction('projects','readwrite'),store=tx.objectStore('projects');store.clear();projects.forEach(p=>store.put(p));tx.oncomplete=res;tx.onerror=()=>rej(tx.error)});db.close();return true}catch(e){console.warn('PrintProfit project backup save failed:',e);return false}};
const readProjectsBackup=async()=>{try{const db=await projectDb();const values=await new Promise((res,rej)=>{const tx=db.transaction('projects','readonly'),q=tx.objectStore('projects').getAll();q.onsuccess=()=>res(q.result||[]);q.onerror=()=>rej(q.error)});db.close();return values}catch(e){console.warn('PrintProfit project backup read failed:',e);return[]}};
const read=()=>{try{const data=JSON.parse(localStorage.getItem(KEY)||'[]');return Array.isArray(data)?data:[]}catch(e){console.warn('PrintProfit project read error:',e);return[]}};
const storeProjects=(projects,{notify=true,cache=true}={})=>{
 const next=Array.isArray(projects)?projects:[],before=read();
 try{localStorage.setItem(KEY,JSON.stringify(next));if(cache)writeProjectCache(projectOwner(),next);persistProjects(next);}
 catch(e){console.warn('PrintProfit project save error:',e);persistProjects(next);return false}
 if(notify)document.dispatchEvent(new CustomEvent('pp-projects-data-changed',{detail:{kind:'projects',before,after:next,owner:projectOwner()}}));
 return true;
};
const write=v=>storeProjects(v);
const hydrateProjects=async()=>{const current=read();if(current.length){await persistProjects(current);writeProjectCache(projectOwner(),current);return current;}const backup=await readProjectsBackup();if(backup.length){storeProjects(backup,{notify:false});return backup;}return current;};
const mergeProjectRecords=(left,right)=>{
 const byId=new Map();
 [...(Array.isArray(left)?left:[]),...(Array.isArray(right)?right:[])].forEach(p=>{
  if(!p||!p.id)return;const old=byId.get(String(p.id));
  if(!old||Number(p.updated||0)>=Number(old.updated||0))byId.set(String(p.id),p);
 });
 return [...byId.values()];
};
window.__ppGetProjectWorkspace=()=>read();
window.__ppGetProjectWorkspaceForOwner=owner=>String(owner||'guest')===projectOwner()?read():(readProjectCache(owner)||[]);
window.__ppHasProjectWorkspaceForOwner=owner=>window.__ppGetProjectWorkspaceForOwner(owner).length>0;
window.__ppSetProjectsFromSync=async projects=>{
 const next=Array.isArray(projects)?projects:[];
 if(!storeProjects(next,{notify:false}))return false;
 await persistProjects(next);render();const count=document.getElementById('ppProjectCount');if(count)count.textContent=next.length+' saved '+(next.length===1?'project':'projects');return true;
};
window.__ppSetProjectWorkspaceOwner=async(nextOwner,options={})=>{
 const target=String(nextOwner||'guest'),currentOwner=projectOwner();
 if(target===currentOwner){try{localStorage.setItem(PROJECT_OWNER_KEY,target);return true}catch(e){return false}}
 const current=await hydrateProjects();
 if(!writeProjectCache(currentOwner,current))return false;
 const cached=readProjectCache(target)||[];
 const next=options.keepCurrentLocal?mergeProjectRecords(cached,current):cached;
 window.__ppClearActiveProject?.();
 try{
  localStorage.setItem(KEY,JSON.stringify(next));
  if(!writeProjectCache(target,next))throw new Error('Project workspace cache could not be saved.');
  localStorage.setItem(PROJECT_OWNER_KEY,target);
 }catch(e){
  try{localStorage.setItem(KEY,JSON.stringify(current));localStorage.setItem(PROJECT_OWNER_KEY,currentOwner)}catch(restoreError){}
  console.warn('PrintProfit project workspace could not be switched:',e);return false;
 }
 await persistProjects(next);render();const count=document.getElementById('ppProjectCount');if(count)count.textContent=next.length+' saved '+(next.length===1?'project':'projects');return true;
};

const fileDb=()=>new Promise((resolve,reject)=>{const r=indexedDB.open(FILE_DB,1);r.onupgradeneeded=()=>r.result.createObjectStore('files');r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error)});
const putProjectFile=async(id,file)=>{if(!file)return;try{const db=await fileDb();await new Promise((res,rej)=>{const tx=db.transaction('files','readwrite');tx.objectStore('files').put({blob:file,name:file.name,type:file.type,lastModified:file.lastModified},id);tx.oncomplete=res;tx.onerror=()=>rej(tx.error)});db.close()}catch(e){console.warn('PrintProfit could not save project file:',e)}};
const getProjectFile=async id=>{try{const db=await fileDb();const v=await new Promise((res,rej)=>{const tx=db.transaction('files','readonly');const q=tx.objectStore('files').get(id);q.onsuccess=()=>res(q.result);q.onerror=()=>rej(q.error)});db.close();return v||null}catch(e){console.warn('PrintProfit could not restore project file:',e);return null}};
const restoreProjectFile=async id=>{const saved=await getProjectFile(id);if(!saved)return false;const input=document.getElementById('file');if(!input)return false;try{const file=new File([saved.blob],saved.name,{type:saved.type||'application/octet-stream',lastModified:saved.lastModified||Date.now()});const dt=new DataTransfer();dt.items.add(file);input.files=dt.files;window.__ppRestoringPlate=window.__ppFileData?.selectedPlate;window.__ppRestoringFile=true;input.dispatchEvent(new Event('change',{bubbles:true}));return true}catch(e){console.warn('PrintProfit could not put saved file back into upload control:',e);return false}};
const val=id=>document.getElementById(id)?.value??'';
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
function close(){const p=document.getElementById('ppProjectsPanel');if(p)p.classList.remove('open');document.body.style.overflow=document.querySelector('#ppMaterialsPanel.open')?'hidden':'';syncWorkspaceModalState();}
function setWorkspaceNavigation(section){document.querySelectorAll('[data-workspace-section]').forEach(button=>{const active=button.dataset.workspaceSection===section;if(active)button.setAttribute('aria-current','page');else button.removeAttribute('aria-current')});}
window.__ppOpenWorkspaceProjects=()=>open();
window.__ppCloseWorkspaceProjects=()=>close();
function render(){
 const list=document.getElementById('ppProjectsList');if(!list)return;
 const projects=read().sort((a,b)=>b.updated-a.updated);
 if(!projects.length){list.innerHTML='<div class="pp-projects-empty"><div class="pp-projects-empty-icon">▣</div><h3>No saved projects yet</h3><p>Use <strong>Save Project</strong> on the calculator to store a setup here.</p></div>';return;}
 list.innerHTML=projects.map(p=>`<article class="pp-project-card" data-project-id="${esc(p.id)}">
   <div class="pp-project-card-main">
    <div class="pp-project-icon">▣</div>
    <div><h3 translate="no">${esc(p.name)}</h3><p>${esc(p.material)} · ${esc(p.hours)} h · ${esc(p.used)} used</p><small>Saved ${new Date(p.updated).toLocaleString([], {dateStyle:'medium',timeStyle:'short'})}</small></div>
   </div>
   <div class="pp-project-actions"><button type="button" data-load-project="${esc(p.id)}">Load</button><button type="button" data-rename-project="${esc(p.id)}">Rename</button><button type="button" data-duplicate-project="${esc(p.id)}">Duplicate</button><button type="button" class="danger" data-delete-project="${esc(p.id)}">Delete</button></div>
 </article>`).join('');
}
function open(){
 window.__ppCloseWorkspaceWorkshop?.();
 let panel=document.getElementById('ppProjectsPanel');
 if(!panel){
  panel=document.createElement('div');panel.id='ppProjectsPanel';
  panel.innerHTML=`<div class="pp-projects-backdrop" data-project-close></div>
  <section class="pp-projects-dialog" role="dialog" aria-modal="true" aria-labelledby="ppProjectsTitle">
   <header class="pp-projects-head"><div><div class="pp-projects-kicker">PRINTPROFIT</div><h2 id="ppProjectsTitle">My Workspace</h2><p>Your saved calculator projects, workshop profiles and account settings in one place.</p><small class="pp-projects-local-note">Sign in and enable sync to carry saved project settings between devices. Uploaded 3D model files stay on this device.</small></div><button type="button" class="pp-projects-close" data-project-close aria-label="Close">×</button></header>
   <nav class="pp-workspace-nav" aria-label="My Workspace sections"><button type="button" data-workspace-section="projects" aria-current="page">Projects</button><button type="button" data-workspace-section="workshop">Workshop</button><button type="button" data-workspace-section="account">Profile &amp; Account</button></nav>
   <div class="pp-projects-toolbar"><span class="pp-project-count" id="ppProjectCount"></span></div>
   <div id="ppProjectsList"></div>
  </section>`;
  document.body.appendChild(panel);
  const style=document.createElement('style');style.textContent=`
#ppProjectsPanel{display:none;position:fixed;inset:0;z-index:100000}
#ppProjectsPanel.open{display:block}.pp-projects-backdrop{position:absolute;inset:0;background:#000b;backdrop-filter:blur(5px)}
.pp-projects-dialog{position:relative;width:min(1120px,calc(100vw - 32px));max-width:calc(100vw - 16px);max-height:calc(100vh - 32px);max-height:calc(100dvh - 32px);margin:16px auto;background:#081720;color:#edf3f6;border:1px solid #294957;border-radius:20px;box-shadow:0 25px 80px #000d;overflow:auto;overscroll-behavior:contain;font-family:Inter,Segoe UI,system-ui,sans-serif}
.pp-projects-head{display:flex;justify-content:space-between;gap:20px;padding:25px 28px 20px;border-bottom:1px solid #294957;background:linear-gradient(145deg,#0b202b,#07141d)}
.pp-projects-kicker{font-size:10px;font-weight:900;letter-spacing:.18em;color:#ff7800}.pp-projects-head h2{margin:5px 0 5px;font-size:30px}.pp-projects-head p{margin:0;color:#9fb0b9}.pp-projects-local-note{display:block;margin-top:7px;color:#718792;font-size:10px;line-height:1.45}.pp-projects-close{width:38px;height:38px;border:1px solid #355363;border-radius:10px;background:#091923;color:#fff;font-size:26px;cursor:pointer}
.pp-workspace-nav{display:flex;gap:8px;padding:14px 28px 0;background:#081720}.pp-workspace-nav button{border:1px solid #355363;border-radius:9px;background:#0a1b25;color:#aebdc6;padding:9px 13px;font-weight:800;cursor:pointer}.pp-workspace-nav button[aria-current="page"]{background:#143140;color:#f5f9fb;border-color:#35d6e5}.pp-workspace-nav button:focus-visible{outline:2px solid #35d6e5;outline-offset:2px}
.pp-projects-toolbar{display:flex;align-items:center;justify-content:space-between;padding:18px 28px 8px}.pp-project-new{border:1px solid #ff7800;background:#ff7800;color:#fff;border-radius:9px;padding:10px 15px;font-weight:800;cursor:pointer}.pp-project-count{color:#9fb0b9;font-size:12px}
#ppProjectsList{padding:10px 28px 28px}.pp-project-card{display:flex;justify-content:space-between;gap:18px;align-items:center;padding:17px;margin-top:10px;border:1px solid #294957;border-radius:14px;background:#0b202b}.pp-project-card-main{display:flex;gap:14px;align-items:center;min-width:0}.pp-project-icon{width:42px;height:42px;border-radius:11px;display:grid;place-items:center;background:#ff780015;border:1px solid #ff780055;color:#ff7800;font-size:20px}.pp-project-card h3{margin:0 0 4px;font-size:16px}.pp-project-card p{margin:0;color:#c5d1d7;font-size:12px}.pp-project-card small{display:block;color:#758a95;margin-top:5px}.pp-project-actions{display:flex;gap:7px;flex-wrap:wrap}.pp-project-actions button{border:1px solid #355363;background:#091923;color:#e6eef2;border-radius:8px;padding:8px 10px;cursor:pointer;font-weight:700}.pp-project-actions button:hover{border-color:#ff7800}.pp-project-actions .danger:hover{border-color:#d9534f;color:#ff9a96}.pp-projects-empty{text-align:center;padding:55px 20px;color:#9fb0b9}.pp-projects-empty-icon{font-size:38px;color:#ff7800}.pp-projects-empty h3{color:#edf3f6;margin:10px 0 5px}.pp-projects-empty p{margin:0 0 20px}
@media(max-width:760px){.pp-projects-dialog{width:calc(100vw - 16px);max-width:calc(100vw - 16px);margin:8px auto;max-height:calc(100vh - 16px);max-height:calc(100dvh - 16px);border-radius:14px}.pp-projects-head{padding:20px}.pp-workspace-nav{padding-left:16px;padding-right:16px;flex-wrap:wrap}.pp-projects-toolbar,#ppProjectsList{padding-left:16px;padding-right:16px}.pp-project-card{align-items:flex-start;flex-direction:column}.pp-project-actions{width:100%}.pp-project-actions button{flex:1}.pp-projects-head h2{font-size:25px}}
.pp-project-card.pp-project-updated{border-color:#36e58b;box-shadow:0 0 0 1px #36e58b55,0 0 24px #36e58b18;animation:ppProjectUpdated .65s ease}
@keyframes ppProjectUpdated{0%{transform:scale(1)}45%{transform:scale(1.012)}100%{transform:scale(1)}}
`;document.head.appendChild(style);
 }
 panel.classList.add('open');syncWorkspaceModalState();document.body.style.overflow='hidden';setWorkspaceNavigation('projects');render();
 const count=document.getElementById('ppProjectCount');if(count)count.textContent=read().length+' saved '+(read().length===1?'project':'projects');
 hydrateProjects().then(projects=>{
   render();
   const c=document.getElementById('ppProjectCount');
   if(c)c.textContent=projects.length+' saved '+(projects.length===1?'project':'projects');
 });
}
async function saveNew(){
 const current=projectInfo();
 const file=document.getElementById('file')?.files?.[0]||null;
 let fileData={};try{fileData=JSON.parse(JSON.stringify(window.__ppFileData||{}));}catch(e){}
 const fileStatus=document.getElementById('status')?.textContent||'';

 if(activeProjectId){
   const projects=read();
   const index=projects.findIndex(x=>x.id===activeProjectId);
   if(index>=0){
     const existing=projects[index];
     projects[index]={
       ...existing,
       updated:Date.now(),
       material:current.material,
       hours:current.hours,
       used:current.used,
       data:snapshot(),
       file:file?{name:file.name,type:file.type,lastModified:file.lastModified}:(existing.file||null),
       fileData,
       fileStatus
     };
     if(!write(projects))return;
     await persistProjects(projects);
     if(file)await putProjectFile(activeProjectId,file);
     window.__ppJustUpdatedProject=activeProjectId;
     setSaveMode(true);
     flashUpdateConfirmation();
     render();
     setTimeout(()=>{window.__ppJustUpdatedProject=null;render();},1550);
     const count=document.getElementById('ppProjectCount');
     if(count)count.textContent=projects.length+' saved '+(projects.length===1?'project':'projects');
     return;
   }
   activeProjectId=null;
   setSaveMode(false);
 }

 const suggested=(val('file')||'').split('\\').pop().replace(/\.[^.]+$/,'')||'My 3D Print';
 const name=prompt('Name this project:',suggested);
 if(!name||!name.trim())return;
 const projects=read();const now=Date.now();
 const id=crypto.randomUUID?crypto.randomUUID():String(now)+Math.random();
 projects.push({id,name:name.trim(),updated:now,material:current.material,hours:current.hours,used:current.used,data:snapshot(),file:file?{name:file.name,type:file.type,lastModified:file.lastModified}:null,fileData,fileStatus});
 if(!write(projects))return;
 await persistProjects(projects);
 if(file)await putProjectFile(id,file);
 open();
}async function loadProject(id){
 const p=read().find(x=>x.id===id);if(!p)return;
 activeProjectId=id;
 setSaveMode(true);
 try{window.__ppFileData=(p.fileData&&typeof p.fileData==='object')?p.fileData:(p.data?.fileData&&typeof p.data.fileData==='object'?p.data.fileData:{});}catch(e){window.__ppFileData={};}
 if(p.fileStatus){const status=document.getElementById('status');if(status)status.textContent=p.fileStatus;}
 restore(p.data);
 const fileRestored=await restoreProjectFile(id);
 if(p.file&&!fileRestored){const status=document.getElementById('status');if(status)status.textContent='This project’s 3D model file stays on the device where it was uploaded. Upload the file here to restore the model preview.';}
 window.__ppRefreshModelHub?.();
 setTimeout(()=>window.__ppRefreshModelHub?.(),180);
 close();
 // After loading a project, always land on Step 1 so the user can
 // immediately see which model/file has been loaded. Do not jump to
 // Print Setup or Results automatically.
 setTimeout(()=>{
   const modelTab=document.querySelector('.pp-step[data-tab="details"]');
   if(modelTab)modelTab.click();
   window.__ppRefreshModelHub?.();
   setTimeout(()=>window.__ppRefreshModelHub?.(),180);
 },120);
}
async function renameProject(id){
 const p=read().find(x=>x.id===id);if(!p)return;
 const name=prompt('Rename project:',p.name);
 if(name===null||!name.trim()||name.trim()===p.name)return;
 p.name=name.trim();
 p.updated=Date.now();
 const projects=read().map(x=>x.id===p.id?p:x);
 if(!write(projects))return;
 await persistProjects(projects);
 render();
 const c=document.getElementById('ppProjectCount');
 if(c)c.textContent=read().length+' saved '+(read().length===1?'project':'projects');
}
function duplicateProject(id){const p=read().find(x=>x.id===id);if(!p)return;const copy=typeof structuredClone==='function'?structuredClone(p):JSON.parse(JSON.stringify(p));copy.id=crypto.randomUUID?crypto.randomUUID():String(Date.now())+Math.random();copy.name=p.name+' (Copy)';copy.updated=Date.now();write([...read(),copy]);render();document.getElementById('ppProjectCount').textContent=read().length+' saved projects';}
function deleteProject(id){
 const p=read().find(x=>x.id===id);if(!p)return;
 if(!confirm('Delete “'+p.name+'”?'))return;
 write(read().filter(x=>x.id!==id));
 if(activeProjectId===id)window.__ppClearActiveProject?.();
 render();
 const c=document.getElementById('ppProjectCount');
 if(c)c.textContent=read().length+' saved '+(read().length===1?'project':'projects');
}
document.getElementById('reset')?.addEventListener('click',()=>window.__ppClearActiveProject?.());
document.addEventListener('click',e=>{
 const target=e.target.closest('[data-workspace-section],[data-target="projects"],[data-project-close],[data-project-new],[data-save-project],[data-load-project],[data-rename-project],[data-duplicate-project],[data-delete-project]');
 if(!target)return;
 if(target.hasAttribute('data-workspace-section')){
  if(!target.closest('#ppProjectsPanel'))return;
  e.preventDefault();e.stopImmediatePropagation();
  const section=target.dataset.workspaceSection;
  if(section==='projects')open();else{close();window.__ppOpenWorkspaceWorkshop?.(section)}
 }
 else if(target.matches('[data-target="projects"]')){e.preventDefault();e.stopPropagation();open();}
 else if(target.hasAttribute('data-project-close'))close();
 else if(target.hasAttribute('data-project-new'))saveNew();
  else if(target.hasAttribute('data-save-project'))saveNew();
 else if(target.hasAttribute('data-load-project'))loadProject(target.dataset.loadProject);
 else if(target.hasAttribute('data-rename-project'))renameProject(target.dataset.renameProject);
 else if(target.hasAttribute('data-duplicate-project'))duplicateProject(target.dataset.duplicateProject);
 else if(target.hasAttribute('data-delete-project'))deleteProject(target.dataset.deleteProject);
},true);
document.addEventListener('keydown',e=>{if(e.key==='Escape')close()});
setSaveMode(false);
})();
