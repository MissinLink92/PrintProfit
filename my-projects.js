(()=>{ 
'use strict';
if(window.__printProfitProjects)return; window.__printProfitProjects=true;
const KEY='printprofit.projects.v1';
const read=()=>{try{return JSON.parse(localStorage.getItem(KEY)||'[]')}catch(e){return[]}};
const write=v=>localStorage.setItem(KEY,JSON.stringify(v));
const esc=s=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
const val=id=>{const e=document.getElementById(id);return e?.value??''};
const snapshot=()=>{
 const data={};
 document.querySelectorAll('input[id],select[id],textarea[id]').forEach(el=>{
   if(el.type==='file')return;
   data[el.id]={type:el.type,value:el.type==='checkbox'||el.type==='radio'?el.checked:el.value};
 });
 return data;
};
const restore=data=>{
 const entries=Object.entries(data||{});
 const setValue=(id,x)=>{
   const el=document.getElementById(id);if(!el)return;
   if(x.type==='checkbox'||x.type==='radio')el.checked=!!x.value; else el.value=x.value??'';
 };
 const fire=id=>{
   const el=document.getElementById(id);if(!el)return;
   el.dispatchEvent(new Event('input',{bubbles:true}));
   el.dispatchEvent(new Event('change',{bubbles:true}));
 };
 const saved=new Map(entries);
 // Restore the printer first because its selection controls whether the calculator is in FDM or resin mode.
 const printer=saved.get('printer');
 if(printer){setValue('printer',printer);fire('printer');}
 // Printer changes can rebuild the material controls, so restore material-dependent values afterwards.
 setTimeout(()=>{
   ['materialType','material','materialPack','materialPackCost','materialUsed'].forEach(id=>{const x=saved.get(id);if(x)setValue(id,x);});
   ['materialType','material','materialPack','materialPackCost','materialUsed'].forEach(fire);
   // Restore everything else after the dependent controls exist.
   setTimeout(()=>{
     entries.forEach(([id,x])=>{
       if(['printer','materialType','material','materialPack','materialPackCost','materialUsed'].includes(id))return;
       setValue(id,x);
     });
     ['printHours','qty','discount','sell','labourHours','labourRate','pack','other','electricityProvider','electricityRate','platform','pay','fixedFee','delivery','deliveryCharge'].forEach(fire);
     setTimeout(()=>document.getElementById('calc')?.click(),80);
   },60);
 },60);
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
}
function saveNew(){
 const current=projectInfo();const suggested=(val('file')||'').split('\\').pop().replace(/\.[^.]+$/,'')||'My 3D Print';
 const name=prompt('Name this project:',suggested);if(!name||!name.trim())return;
 const projects=read();const now=Date.now();
 projects.push({id:crypto.randomUUID?crypto.randomUUID():String(now)+Math.random(),name:name.trim(),updated:now,material:current.material,hours:current.hours,used:current.used,data:snapshot()});
 write(projects);open();
}
function loadProject(id){
 const p=read().find(x=>x.id===id);if(!p)return;
 restore(p.data);
 close();
 // Make the restored setup immediately visible after loading.
 setTimeout(()=>{
   const machineTab=document.querySelector('.pp-step[data-tab="machine"]');
   if(machineTab)machineTab.click();
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