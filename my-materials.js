(()=>{ 
'use strict';
if(window.__printProfitMaterials)return; window.__printProfitMaterials=true;
const KEY='printprofit.materials.v1';
const read=()=>{try{return JSON.parse(localStorage.getItem(KEY)||'[]')}catch(e){return[]}};
const write=v=>localStorage.setItem(KEY,JSON.stringify(v));
const esc=s=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
const val=id=>document.getElementById(id)?.value??'';
function render(){
 const list=document.getElementById('ppMaterialsList');if(!list)return;
 const materials=read().sort((a,b)=>a.name.localeCompare(b.name));
 if(!materials.length){list.innerHTML='<div class="pp-materials-empty"><div class="pp-materials-empty-icon">◉</div><h3>No materials saved yet</h3><p>Add your regular filament and resin so you can select them in the calculator.</p><button type="button" class="pp-material-new" data-material-new>＋ Add Material</button></div>';return;}
 list.innerHTML=materials.map(m=>`<article class="pp-material-card" data-material-id="${esc(m.id)}">
 <div class="pp-material-main"><div class="pp-material-dot"></div><div><h3>${esc(m.name)}</h3><p>${esc(m.type)} · ${esc(m.amount)} ${m.type==='Resin'?'ml':'g'} · ${esc(m.currency)}${Number(m.cost).toFixed(2)}</p><small>${esc(m.brand||'No brand')} ${m.colour?'· '+esc(m.colour):''} · ${esc(m.unitCost)}</small></div></div>
 <div class="pp-material-actions"><button type="button" data-use-material="${esc(m.id)}">Use</button><button type="button" data-edit-material="${esc(m.id)}">Edit</button><button type="button" class="danger" data-delete-material="${esc(m.id)}">Delete</button></div>
 </article>`).join('');
}
const brandLists={
 Filament:['SUNLU','eSUN','ELEGOO','OVERTURE','Polymaker','Bambu Lab','Creality','ERYONE','Prusament','HATCHBOX','Geeetech','Giantarm'],
 Resin:['ELEGOO','Anycubic','eSUN','SUNLU','Siraya Tech','Phrozen','Monocure 3D','Creality','Formlabs','LOCTITE']
};
function syncBrandOptions(preferred){
 const type=document.getElementById('ppMatType')?.value||'Filament';
 const select=document.getElementById('ppMatBrand');
 const custom=document.getElementById('ppMatBrandCustom');
 if(!select)return;
 const brands=brandLists[type]||brandLists.Filament;
 select.innerHTML='<option value="">Select a brand...</option>'+brands.map(b=>'<option value="'+esc(b)+'">'+esc(b)+'</option>').join('')+'<option value="__other__">Other / Custom</option>';
 const value=String(preferred??'').trim();
 const known=brands.find(b=>b.toLowerCase()===value.toLowerCase());
 select.value=known|| (value?'__other__':'');
 if(custom){
   custom.value=known?'':value;
   custom.style.display=select.value==='__other__'?'block':'none';
 }
}
function openForm(existing){
 const form=document.getElementById('ppMaterialForm');if(!form)return;
 form.dataset.editId=existing?.id||'';
 document.getElementById('ppMatName').value=existing?.name||'';
 document.getElementById('ppMatType').value=existing?.type||'Filament';
 syncBrandOptions(existing?.brand||'');
 document.getElementById('ppMatColour').value=existing?.colour||'';
 document.getElementById('ppMatAmount').value=existing?.amount??1000;
 document.getElementById('ppMatCost').value=existing?.cost??20;
 document.getElementById('ppMaterialFormTitle').textContent=existing?'Edit Material':'Add Material';
 document.getElementById('ppMaterialFormPanel').classList.add('open');
}
function closeForm(){document.getElementById('ppMaterialFormPanel')?.classList.remove('open')}
function saveForm(){
 const name=document.getElementById('ppMatName').value.trim();const type=document.getElementById('ppMatType').value;
 const amount=Number(document.getElementById('ppMatAmount').value)||0,cost=Number(document.getElementById('ppMatCost').value)||0;
 if(!name){alert('Please enter a material name.');return} if(amount<=0){alert('Please enter a package amount greater than 0.');return}
 const brandSelect=document.getElementById('ppMatBrand'),brandCustom=document.getElementById('ppMatBrandCustom');const brand=(brandSelect?.value==='__other__'?(brandCustom?.value||''):brandSelect?.value||'').trim(),colour=document.getElementById('ppMatColour').value.trim();
 const currency=(localStorage.getItem('printprofit.preferences.v2')||'').includes('"currency":"EUR"')?'€':'£';
 const unitCost=currency+(cost/amount).toFixed(4)+' / '+(type==='Resin'?'ml':'g');
 const items=read(),id=document.getElementById('ppMaterialForm').dataset.editId;
 const obj={id:id||((crypto.randomUUID&&crypto.randomUUID())||String(Date.now())),name,type,brand,colour,amount,cost,currency,unitCost,updated:Date.now()};
 write(id?items.map(x=>x.id===id?obj:x):[...items,obj]);closeForm();render();
}
function useMaterial(id){
 const m=read().find(x=>x.id===id);if(!m)return;
 const type=document.getElementById('materialType'),material=document.getElementById('material');
 if(type){type.value=m.type==='Resin'?'resin':'filament';type.dispatchEvent(new Event('change',{bubbles:true}))}
 if(material){let option=[...material.options].find(o=>o.text.trim().toLowerCase()===m.name.trim().toLowerCase());if(!option&&m.name)option=[...material.options].find(o=>o.text.toLowerCase().includes(m.name.toLowerCase()));if(option)material.value=option.value;}
 const pack=document.getElementById('materialPack'),cost=document.getElementById('materialPackCost');
 if(pack)pack.value=m.amount;if(cost)cost.value=m.cost;
 [pack,cost,material].filter(Boolean).forEach(e=>e.dispatchEvent(new Event('input',{bubbles:true})));
 document.getElementById('ppMaterialsPanel')?.classList.remove('open');document.body.style.overflow='';
 document.getElementById('calc')?.click();
}
function deleteMaterial(id){const m=read().find(x=>x.id===id);if(!m)return;if(!confirm('Delete “'+m.name+'”?'))return;write(read().filter(x=>x.id!==id));render()}
function open(){
 let panel=document.getElementById('ppMaterialsPanel');
 if(!panel){
  panel=document.createElement('div');panel.id='ppMaterialsPanel';
  panel.innerHTML=`<div class="pp-materials-backdrop" data-material-close></div><section class="pp-materials-dialog" role="dialog" aria-modal="true" aria-labelledby="ppMaterialsTitle">
  <header class="pp-materials-head"><div><div class="pp-materials-kicker">PRINTPROFIT</div><h2 id="ppMaterialsTitle">My Materials</h2><p>Keep your regular filament and resin in one place.</p></div><button type="button" class="pp-materials-close" data-material-close>×</button></header>
  <div class="pp-materials-toolbar"><button type="button" class="pp-material-new" data-material-new>＋ Add Material</button><span id="ppMaterialCount"></span></div><div id="ppMaterialsList"></div></section>
  <div id="ppMaterialFormPanel"><div class="pp-material-form-backdrop" data-material-form-close></div><form id="ppMaterialForm" class="pp-material-form" onsubmit="return false"><div class="pp-material-form-head"><div><div class="pp-materials-kicker">MATERIAL LIBRARY</div><h2 id="ppMaterialFormTitle">Add Material</h2></div><button type="button" class="pp-materials-close" data-material-form-close>×</button></div>
  <div class="pp-material-form-grid"><label>Material name<input id="ppMatName" placeholder="e.g. eSUN PLA+ Black"></label><label>Type<select id="ppMatType"><option>Filament</option><option>Resin</option></select></label><label>Brand<select id="ppMatBrand"><option value="">Select a brand...</option><option value="__other__">Other / Custom</option></select><input id="ppMatBrandCustom" class="pp-brand-custom" placeholder="Enter brand name" style="display:none" aria-label="Custom brand name"></label><label>Colour<input id="ppMatColour" placeholder="Optional"></label><label><span id="ppMatAmountLabel">Spool weight (g)</span><input id="ppMatAmount" type="number" min="0" step=".01" value="1000"></label><label>Package cost (£)<input id="ppMatCost" type="number" min="0" step=".01" value="20"></label></div>
  <div class="pp-material-form-actions"><button type="button" class="pp-material-cancel" data-material-form-close>Cancel</button><button type="button" class="pp-material-save" data-material-save>Save Material</button></div></form></div>`;
  document.body.appendChild(panel);
  const style=document.createElement('style');style.textContent=`
#ppMaterialsPanel{display:none;position:fixed;inset:0;z-index:100001}#ppMaterialsPanel.open{display:block}.pp-materials-backdrop{position:absolute;inset:0;background:#000b;backdrop-filter:blur(5px)}
.pp-materials-dialog{position:relative;width:min(900px,calc(100% - 28px));max-height:calc(100vh - 40px);margin:20px auto;background:#081720;color:#edf3f6;border:1px solid #294957;border-radius:20px;box-shadow:0 25px 80px #000d;overflow:auto;font-family:Inter,Segoe UI,system-ui,sans-serif}
.pp-materials-head{display:flex;justify-content:space-between;gap:20px;padding:25px 28px 20px;border-bottom:1px solid #294957;background:linear-gradient(145deg,#0b202b,#07141d)}.pp-materials-kicker{font-size:10px;font-weight:900;letter-spacing:.18em;color:#ff7800}.pp-materials-head h2{margin:5px 0;font-size:30px}.pp-materials-head p{margin:0;color:#9fb0b9}.pp-materials-close{width:38px;height:38px;border:1px solid #355363;border-radius:10px;background:#091923;color:#fff;font-size:26px;cursor:pointer}
.pp-materials-toolbar{display:flex;justify-content:space-between;align-items:center;padding:18px 28px 8px;color:#9fb0b9;font-size:12px}.pp-material-new,.pp-material-save{border:1px solid #ff7800;background:#ff7800;color:#fff;border-radius:9px;padding:10px 15px;font-weight:800;cursor:pointer}.pp-materials-dialog>#ppMaterialsList{padding:10px 28px 28px}.pp-material-card{display:flex;justify-content:space-between;align-items:center;gap:18px;padding:17px;margin-top:10px;border:1px solid #294957;border-radius:14px;background:#0b202b}.pp-material-main{display:flex;align-items:center;gap:14px;min-width:0}.pp-material-dot{width:14px;height:14px;border-radius:50%;background:#ff7800;box-shadow:0 0 15px #ff780066}.pp-material-card h3{margin:0 0 4px;font-size:16px}.pp-material-card p{margin:0;color:#c5d1d7;font-size:12px}.pp-material-card small{display:block;color:#758a95;margin-top:5px}.pp-material-actions{display:flex;gap:7px;flex-wrap:wrap}.pp-material-actions button,.pp-material-cancel{border:1px solid #355363;background:#091923;color:#e6eef2;border-radius:8px;padding:8px 10px;cursor:pointer;font-weight:700}.pp-material-actions button:hover{border-color:#ff7800}.pp-material-actions .danger:hover{border-color:#d9534f;color:#ff9a96}.pp-materials-empty{text-align:center;padding:55px 20px;color:#9fb0b9}.pp-materials-empty-icon{font-size:38px;color:#ff7800}.pp-materials-empty h3{color:#edf3f6;margin:10px 0 5px}.pp-materials-empty p{margin:0 0 20px}
#ppMaterialFormPanel{display:none;position:fixed;inset:0;z-index:100002}#ppMaterialFormPanel.open{display:block}.pp-material-form-backdrop{position:absolute;inset:0;background:#000b;backdrop-filter:blur(4px)}.pp-material-form{position:relative;width:min(680px,calc(100% - 28px));margin:60px auto;background:#081720;border:1px solid #294957;border-radius:18px;box-shadow:0 25px 80px #000d;color:#edf3f6;overflow:hidden;font-family:Inter,Segoe UI,system-ui,sans-serif}.pp-material-form-head{display:flex;justify-content:space-between;align-items:center;padding:20px 24px;border-bottom:1px solid #294957}.pp-material-form-head h2{margin:4px 0 0}.pp-material-form-grid{display:grid;grid-template-columns:1fr 1fr;gap:14px;padding:22px}.pp-material-form-grid label{color:#aebdca;font-size:12px}.pp-material-form-grid input,.pp-material-form-grid select{display:block;margin-top:6px;width:100%;background:#0e202b;color:#f5f8fb;border:1px solid #24404e;border-radius:8px;padding:10px;box-sizing:border-box}.pp-material-form-grid .pp-brand-custom{margin-top:6px}.pp-material-form-actions{display:flex;justify-content:flex-end;gap:8px;padding:0 22px 22px}.pp-material-save{padding:10px 18px}.pp-material-form-actions button{font-size:13px}@media(max-width:650px){.pp-materials-dialog{margin:10px auto;max-height:calc(100vh - 20px)}.pp-materials-head,.pp-materials-toolbar,.pp-materials-dialog>#ppMaterialsList{padding-left:20px;padding-right:20px}.pp-material-card{flex-direction:column;align-items:flex-start}.pp-material-actions{width:100%}.pp-material-actions button{flex:1}.pp-material-form-grid{grid-template-columns:1fr;padding:18px}}
`;document.head.appendChild(style);
 }
 panel.classList.add('open');document.body.style.overflow='hidden';render();const c=document.getElementById('ppMaterialCount');if(c){const n=read().length;c.textContent=n+' saved '+(n===1?'material':'materials')}
}
function ensureButton(){
 const section=document.getElementById('material');if(!section)return;
 const parent=section.closest('.panel');if(!parent||parent.querySelector('[data-material-open]'))return;
 const b=document.createElement('button');b.type='button';b.className='pp-material-open';b.setAttribute('data-material-open','1');b.innerHTML='◉ My Materials';
 b.style.cssText='margin-top:7px;border:1px solid #355363;background:#091923;color:#e6eef2;border-radius:8px;padding:7px 10px;cursor:pointer;font-weight:700;width:100%';
 section.parentElement.appendChild(b);
}
document.addEventListener('click',e=>{
 const t=e.target.closest('[data-material-open],[data-material-close],[data-material-new],[data-material-save],[data-material-form-close],[data-use-material],[data-edit-material],[data-delete-material]');
 if(!t)return;
 if(t.hasAttribute('data-material-open')){e.preventDefault();open()}
 else if(t.hasAttribute('data-material-close')){document.getElementById('ppMaterialsPanel')?.classList.remove('open');document.body.style.overflow=''}
 else if(t.hasAttribute('data-material-new')){openForm()}
 else if(t.hasAttribute('data-material-save'))saveForm()
 else if(t.hasAttribute('data-material-form-close'))closeForm()
 else if(t.hasAttribute('data-use-material'))useMaterial(t.dataset.useMaterial)
 else if(t.hasAttribute('data-edit-material')){const m=read().find(x=>x.id===t.dataset.editMaterial);if(m)openForm(m)}
 else if(t.hasAttribute('data-delete-material'))deleteMaterial(t.dataset.deleteMaterial)
},true);
document.addEventListener('change',e=>{if(e.target?.id==='ppMatType'){const l=document.getElementById('ppMatAmountLabel');if(l)l.textContent=e.target.value==='Resin'?'Bottle amount (ml)':'Spool weight (g)';const current=document.getElementById('ppMatBrand')?.value==='__other__'?document.getElementById('ppMatBrandCustom')?.value||'':document.getElementById('ppMatBrand')?.value||'';syncBrandOptions(current)}if(e.target?.id==='ppMatBrand'){const custom=document.getElementById('ppMatBrandCustom');if(custom)custom.style.display=e.target.value==='__other__'?'block':'none';if(e.target.value==='__other__')custom?.focus()}});
document.addEventListener('keydown',e=>{if(e.key==='Escape'){document.getElementById('ppMaterialFormPanel')?.classList.remove('open');document.getElementById('ppMaterialsPanel')?.classList.remove('open');document.body.style.overflow=''}});
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',ensureButton,{once:true});else ensureButton();
})();