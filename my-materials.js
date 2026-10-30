(()=>{ 
'use strict';
if(window.__printProfitMaterials)return; window.__printProfitMaterials=true;
let workspaceParentOverflow;
function alignWorkspaceModal(){
 try{if(window.parent!==window){
  const height=window.parent.innerHeight;
  const top=Math.max(0,-window.frameElement.getBoundingClientRect().top);
  document.documentElement.style.setProperty('--pp-modal-viewport-height',height+'px');
  document.querySelectorAll('#ppMaterialsPanel.open,#ppProjectsPanel.open').forEach(panel=>{
   panel.style.top=top+'px';panel.style.bottom='auto';panel.style.height=height+'px';
   const dialog=panel.querySelector('[role="dialog"]');
   if(dialog)dialog.style.maxHeight=Math.max(160,height-32)+'px';
  });
 }}catch(e){}
}
function syncWorkspaceModalState(){
 const open=!!document.querySelector('#ppMaterialsPanel.open,#ppProjectsPanel.open');
 const bodies=[document.body];
 try{if(window.parent&&window.parent!==window)bodies.push(window.parent.document.body)}catch(e){}
 bodies.forEach(body=>{if(open)body.dataset.ppModalOpen='true';else delete body.dataset.ppModalOpen;});
 try{if(window.parent!==window){
  if(open){
   if(workspaceParentOverflow===undefined)workspaceParentOverflow=window.parent.document.body.style.overflow;
   window.parent.document.body.style.overflow='hidden';
   alignWorkspaceModal();
  }else if(workspaceParentOverflow!==undefined){
   window.parent.document.body.style.overflow=workspaceParentOverflow;workspaceParentOverflow=undefined;
  }
 }}catch(e){}
}
window.__ppSyncWorkspaceModalState=syncWorkspaceModalState;
try{if(window.parent!==window){window.parent.addEventListener('scroll',alignWorkspaceModal,{passive:true});window.parent.addEventListener('resize',alignWorkspaceModal,{passive:true});}}catch(e){}
const KEY='printprofit.materials.v1';
const PRINTER_KEY='printprofit.workshop-printers.v1';
const SELECTED_PRINTER_KEY='printprofit.workshop-printer-selected.v1';
let selectedMaterialId='';
let applyingMaterial=false;
let lastDeductedSignatures=new Set();
const readPrinters=()=>{try{const data=JSON.parse(localStorage.getItem(PRINTER_KEY)||'[]');return Array.isArray(data)?data:[]}catch(e){return[]}};
const writePrinters=v=>{try{const before=readPrinters();localStorage.setItem(PRINTER_KEY,JSON.stringify(v));document.dispatchEvent(new CustomEvent('pp-workshop-data-changed',{detail:{kind:'printers',before,after:v}}));return true}catch(e){console.warn('PrintProfit printer profile save failed:',e);return false}};
const materialRemaining=m=>{const value=m&&m.remaining!==undefined?Number(m.remaining):Number(m?.amount);return Math.max(0,Number.isFinite(value)?value:0)};
const materialThreshold=m=>{const value=m&&m.lowStock!==undefined?Number(m.lowStock):(m?.type==='Resin'?50:200);return Math.max(0,Number.isFinite(value)?value:0)};
const materialUnit=m=>m?.type==='Resin'?'ml':'g';
const amountText=value=>Number(value||0).toLocaleString(undefined,{maximumFractionDigits:2});
const CURRENCY_RATES={GBP:1,EUR:1.1663,USD:1.3370,PLN:5.0892,CAD:1.84,AUD:2.00,CHF:0.96,SEK:14.75,NOK:14.70,DKK:8.69,CZK:28.30,JPY:179.00,CNY:9.65,INR:123.50,NZD:2.16,SGD:1.71,BRL:7.18,MXN:23.0696,ZAR:21.8000};
function prefs(){
 try{return Object.assign({currency:'GBP',rate:1},JSON.parse(localStorage.getItem('printprofit.preferences.v3')||'{}'))}
 catch(e){return {currency:'GBP',rate:1}}
}
function currencyMeta(){
 const p=prefs(),code=CURRENCY_RATES[p.currency]?p.currency:'GBP',rate=Number(p.rate)>0?Number(p.rate):(CURRENCY_RATES[code]||1);
 return {code,rate};
}
function moneyFromGBP(value){
 const meta=currencyMeta();
 try{return new Intl.NumberFormat(undefined,{style:'currency',currency:meta.code,minimumFractionDigits:2,maximumFractionDigits:2}).format((Number(value)||0)*meta.rate)}
 catch(e){return '£'+(Number(value)||0).toFixed(2)}
}
function currentMoneyValue(value){
 const meta=currencyMeta();
 return (Number(value)||0)*meta.rate;
}
function toGBP(value){
 const meta=currencyMeta();
 return meta.rate>0?(Number(value)||0)/meta.rate:(Number(value)||0);
}
const read=()=>{try{const data=JSON.parse(localStorage.getItem(KEY)||'[]');return Array.isArray(data)?data:[]}catch(e){return[]}};
const write=v=>{try{const before=read();localStorage.setItem(KEY,JSON.stringify(v));document.dispatchEvent(new CustomEvent('pp-workshop-data-changed',{detail:{kind:'materials',before,after:v}}));return true}catch(e){console.warn('PrintProfit material save failed:',e);return false}};
window.__ppGetInventoryBackup=()=>({materials:read(),printers:readPrinters()});
window.__ppImportInventoryBackup=backup=>{
 let count=0;
 for(const [kind,current,save] of [['materials',read(),write],['printers',readPrinters(),writePrinters]]){
  const ids=new Set(current.map(item=>String(item.id))),added=backup[kind].filter(item=>!ids.has(String(item.id)));
  if(!save([...current,...added]))throw new Error('Inventory backup could not be saved. Free browser storage and try again.');
  count+=added.length;
 }
 render();return count;
};
const stockAlertsAvailable=()=>!window.PRINTPROFIT_BILLING_CONFIG?.enabled||window.__ppProTier==='pro';
document.addEventListener('pp-pro-access-changed',()=>render());
const esc=s=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
const val=id=>document.getElementById(id)?.value??'';
function render(){
 const list=document.getElementById('ppMaterialsList');
 if(list){
  const materials=read().sort((a,b)=>String(a.name||'').localeCompare(String(b.name||'')));
  if(!materials.length)list.innerHTML='<div class="pp-materials-empty"><div class="pp-materials-empty-icon"><svg viewBox="0 0 48 48" aria-hidden="true"><use href="./assets/printprofit-icon-master.svg#pp-filament"></use></svg></div><h3>No materials saved yet</h3><p>Add your regular filament and resin, then track how much remains after each print.</p><button type="button" class="pp-material-new" data-material-new>＋ Create material profile</button></div>';
  else list.innerHTML=materials.map(m=>{
   const remaining=materialRemaining(m),threshold=materialThreshold(m),unit=materialUnit(m),low=stockAlertsAvailable()&&threshold>0&&remaining<=threshold;
   return '<article class="pp-material-card" data-material-id="'+esc(m.id)+'"><div class="pp-material-main"><div class="pp-material-dot"><svg viewBox="0 0 48 48" aria-hidden="true"><use href="./assets/printprofit-icon-master.svg#pp-filament"></use></svg></div><div><h3><span translate="no">'+esc(m.name)+'</span> '+(low?'<span class="pp-stock-low">Low stock</span>':'')+'</h3><p>'+esc(m.type)+' · '+amountText(remaining)+' '+unit+' remaining · '+amountText(m.amount)+' '+unit+' package</p><small>'+esc(m.brand||'No brand')+(m.colour?' · '+esc(m.colour):'')+' · '+moneyFromGBP((Number(m.cost)||0)/(Number(m.amount)||1))+' / '+unit+' · alert at '+amountText(threshold)+' '+unit+'</small></div></div><div class="pp-material-actions"><button type="button" data-use-material="'+esc(m.id)+'">Use</button><button type="button" data-edit-material="'+esc(m.id)+'">Edit</button><button type="button" class="danger" data-delete-material="'+esc(m.id)+'">Delete</button></div></article>';
  }).join('');
 }
 renderStockOverview();renderPrinters();syncWorkshopUsage();
}
function syncPrinterProfileOptions(preferredId,refreshActive=false){
 const printer=document.getElementById('printer');if(!printer)return;
 const currentValue=printer.value||'';
 const currentId=currentValue.startsWith('workshop:')?currentValue.slice(9):'';
 const groupId='ppWorkshopPrinterOptions';
 printer.querySelector('#'+groupId)?.remove();
 const printers=readPrinters().filter(p=>p&&p.id).sort((a,b)=>String(a.name||'').localeCompare(String(b.name||'')));
 const group=document.createElement('optgroup');group.id=groupId;group.label='My Workshop';
 printers.forEach(p=>{
  const option=new Option(String(p.name||'Printer profile'),'workshop:'+String(p.id));
  option.setAttribute('translate','no');
  option.dataset.profileId=String(p.id);
  option.dataset.profileName=String(p.name||'Printer profile');
  option.dataset.watts=String(Number(p.watts)||0);
  option.dataset.price=String(Number(p.price)||0);
  option.dataset.lifetime=String(Number(p.lifetime)||0);
  option.dataset.materialType=String(p.materialType||'Filament').toLowerCase()==='resin'?'resin':'filament';
  group.appendChild(option);
 });
 if(printers.length){
  const custom=printer.querySelector('option[value="custom"]');
  // The printer catalogue groups its options by manufacturer. insertBefore
  // must target a direct child of the select, never an option inside a group.
  const anchor=custom?.parentElement===printer?custom:custom?.closest('optgroup');
  printer.insertBefore(group,anchor||null);
 }
 let storedId='';try{storedId=localStorage.getItem(SELECTED_PRINTER_KEY)||''}catch(e){}
 const valid=id=>printers.some(p=>String(p.id)===String(id));
 const autoId=currentValue===''?String([...printers].sort((a,b)=>(Number(b.updated)||0)-(Number(a.updated)||0))[0]?.id||''):'';
 const targetId=[preferredId,currentId,storedId,autoId].find(id=>id&&valid(id))||'';
 if(targetId){
  const nextValue='workshop:'+targetId;
  try{localStorage.setItem(SELECTED_PRINTER_KEY,targetId)}catch(e){}
  if(printer.value!==nextValue||refreshActive||preferredId!=null){
   printer.value=nextValue;printer.dispatchEvent(new Event('change',{bubbles:true}));
  }
 }else if(currentId){
  try{localStorage.removeItem(SELECTED_PRINTER_KEY)}catch(e){}
  printer.value='';printer.dispatchEvent(new Event('change',{bubbles:true}));
 }
}
function renderPrinters(){
 const list=document.getElementById('ppWorkshopPrintersList');syncPrinterProfileOptions();if(!list)return;
 const printers=readPrinters().sort((a,b)=>String(a.name||'').localeCompare(String(b.name||'')));
 const count=document.getElementById('ppPrinterCount');if(count)count.textContent=printers.length+' saved '+(printers.length===1?'printer':'printers');
 if(!printers.length){list.innerHTML='<div class="pp-materials-empty"><div class="pp-materials-empty-icon"><svg viewBox="0 0 48 48" aria-hidden="true"><use href="./assets/printprofit-icon-master.svg#pp-printer"></use></svg></div><h3>No printers saved yet</h3><p>Add the printers you own so their power and depreciation details are ready to use.</p><button type="button" class="pp-material-new" data-printer-new>＋ Create printer profile</button></div>';return;}
 list.innerHTML=printers.map(p=>'<article class="pp-material-card pp-printer-card" data-printer-id="'+esc(p.id)+'"><div class="pp-material-main"><div class="pp-printer-dot"><svg viewBox="0 0 48 48" aria-hidden="true"><use href="./assets/printprofit-icon-master.svg#pp-printer"></use></svg></div><div><h3 translate="no">'+esc(p.name)+'</h3><p>'+amountText(p.watts)+' W · '+moneyFromGBP(p.price)+' purchase price · '+amountText(p.lifetime)+' expected hours</p><small>'+esc(p.materialType||'Filament')+' printer profile</small></div></div><div class="pp-material-actions"><button type="button" data-printer-use="'+esc(p.id)+'">Use</button><button type="button" data-printer-edit="'+esc(p.id)+'">Edit</button><button type="button" class="danger" data-printer-delete="'+esc(p.id)+'">Delete</button></div></article>').join('');
}
function renderStockOverview(){
 const box=document.getElementById('ppStockOverview');if(!box)return;
 const items=read(),low=stockAlertsAvailable()?items.filter(m=>materialThreshold(m)>0&&materialRemaining(m)<=materialThreshold(m)):[],empty=items.filter(m=>materialRemaining(m)<=0);
 if(!stockAlertsAvailable()){
  box.innerHTML='<h3>Stock Overview</h3><p>'+items.length+' saved packages · '+empty.length+' empty packages</p><p>View and edit remaining stock for free. Pro adds low-stock warnings and automatic deduction when you confirm a print.</p><button type="button" class="pp-material-new" data-workshop-tab="materials">View and manage materials</button>';return;
 }
 box.innerHTML='<h3>Stock Overview</h3><p>'+items.length+' saved packages · '+low.length+' low-stock alerts · '+empty.length+' empty packages</p><p>Set a low-stock alert on each material. Stock changes when you save a material or choose Mark as printed; calculations alone do not deduct stock.</p>'+(low.length?'<ul>'+low.map(m=>'<li><span translate="no">'+esc(m.name)+'</span>: '+amountText(materialRemaining(m))+' '+materialUnit(m)+' remaining</li>').join('')+'</ul>':'<p>No low-stock alerts. Check that your materials have an alert threshold set.</p>')+'<button type="button" class="pp-material-new" data-workshop-tab="materials">View and manage materials</button>';
}
function setWorkshopTab(name){
 const selected=['materials','printers','stock'].includes(name)?name:'materials';
 for(const [tab,id] of [['materials','ppWorkshopMaterialsView'],['printers','ppWorkshopPrintersView'],['stock','ppStockOverview']]){const view=document.getElementById(id);if(view)view.hidden=tab!==selected;}
 document.querySelectorAll('[data-workshop-tab]').forEach(button=>{const active=button.dataset.workshopTab===selected;button.setAttribute('aria-selected',String(active));button.classList.toggle('active',active)});

}
function setWorkspaceSection(section){
 const active=['workshop','pro','account'].includes(section)?section:'workshop';
 document.querySelectorAll('[data-workspace-section]').forEach(button=>{const selected=button.dataset.workspaceSection===active;if(selected)button.setAttribute('aria-current','page');else button.removeAttribute('aria-current')});
 const account=active==='account',pro=active==='pro',accountPanel=document.getElementById('ppWorkshopAccount'),proPanel=document.getElementById('ppWorkspacePro'),tabs=document.querySelector('#ppMaterialsPanel .pp-workshop-tabs'),materials=document.getElementById('ppWorkshopMaterialsView'),printers=document.getElementById('ppWorkshopPrintersView');
 if(accountPanel)accountPanel.hidden=!account;
 if(proPanel)proPanel.hidden=!pro;
 if(account)window.__ppRefreshWorkshopAccountUI?.();
 if(tabs)tabs.hidden=account||pro;
 if(account||pro){if(materials)materials.hidden=true;if(printers)printers.hidden=true;const stock=document.getElementById("ppStockOverview");if(stock)stock.hidden=true;}
 else{const selectedTab=document.querySelector('#ppMaterialsPanel [data-workshop-tab].active')?.dataset.workshopTab||'materials';setWorkshopTab(selectedTab);}
 const title=document.getElementById('ppMaterialsTitle'),description=document.getElementById('ppWorkspaceDescription');
 if(title)title.textContent='My Workspace';
 if(description)description.textContent=account?'Local saving and backup files stay free. Pro adds account cloud saving across devices. Uploaded 3D model files stay on this device.':pro?'Your projects and workspace, wherever you print. Cloud access, scanning and stock tracking, with extra tools for selling your prints.':'Your printers, materials and stock—all in one place. Add your machines, track filament and resin, and check what is left before your next job.';
}
function openProTool(tool){
 if(tool==='stock'){setWorkspaceSection('workshop');setWorkshopTab('stock');return;}
 if(tool==='subscription'||tool==='cloud'){setWorkspaceSection('account');document.getElementById('ppProSubscription')?.scrollIntoView({block:'nearest'});return;}
 if(tool==='scan'){setWorkspaceSection('workshop');setWorkshopTab('materials');const scan=document.getElementById('ppMaterialScan'),toggle=document.querySelector('[data-pp-material-scanner-toggle]');if(scan?.hidden)toggle?.click();scan?.scrollIntoView({block:'nearest'});return;}
 closeWorkspaceWorkshop();
 const stage=tool==='production'?'machine':'results';
 document.querySelector('#ppSetupProgress [data-tab="'+stage+'"]')?.click();
 const target=tool==='production'?document.getElementById('ppPrintFarm'):document.getElementById('ppBusinessTools');
 if(tool==='scenario'||tool==='quote'){
  const details=target?.querySelector('[data-pp-pro-tool="'+tool+'"]');if(details)details.open=true;
 }
 if(tool==='export'){target?.querySelector('[data-pp-pro-tool="export"]')?.click();return;}
 target?.scrollIntoView({block:'start',behavior:'smooth'});
 (tool==='production'?document.getElementById('ppFarmEnabled'):target?.querySelector('[data-pp-pro-tool="'+tool+'"]'))?.focus({preventScroll:true});
}
function syncWorkshopUsage(){
 const tabs=document.getElementById('resultTabs');if(!tabs)return;
 let card=document.getElementById('ppWorkshopUsage');
 if(!card){card=document.createElement('section');card.id='ppWorkshopUsage';card.className='pp-workshop-usage';card.innerHTML='<div class="pp-workshop-usage-copy"><span>MY WORKSPACE · MATERIAL STOCK</span><strong id="ppWorkshopUsageTitle">Material inventory</strong><p id="ppWorkshopUsageText">Choose a saved spool or resin bottle to see remaining stock. Calculating does not deduct stock; use Mark as printed after the job.</p></div><div class="pp-workshop-usage-actions"><button type="button" class="pp-workshop-open" data-material-open>Use material from My Workspace</button><button type="button" class="pp-workshop-mark" data-mark-printed disabled>Mark as printed</button></div>';tabs.insertAdjacentElement('afterend',card)}
 const title=document.getElementById('ppWorkshopUsageTitle'),text=document.getElementById('ppWorkshopUsageText'),mark=card.querySelector('[data-mark-printed]'),openButton=card.querySelector('[data-material-open]');
 const material=selectedMaterialId?read().find(item=>String(item.id)===String(selectedMaterialId)):null;
 if(!material){if(title)title.textContent='Material inventory';if(text)text.textContent='Choose a saved spool or resin bottle to see remaining stock. Calculating does not deduct stock; use Mark as printed after the job.';if(mark){mark.disabled=true;mark.hidden=true}if(openButton)openButton.hidden=false;return}
 if(openButton){openButton.hidden=false;openButton.textContent='Change workspace material';}
 if(title)title.textContent=material.name+' · '+amountText(materialRemaining(material))+' '+materialUnit(material)+' remaining';
 const used=Number(val('materialUsed'))||0,quantity=Math.max(1,Math.floor(Number(val('qty'))||1)),required=used*quantity,remaining=materialRemaining(material),after=remaining-required,unit=materialUnit(material);
 if(text){
  if(used<=0)text.textContent='Enter the material used per print to track stock. Batch quantity is included automatically.';
  else if(required>remaining)text.textContent='This job needs '+amountText(required)+' '+unit+'; only '+amountText(remaining)+' '+unit+' remains. Add stock or choose another material.';
  else text.textContent='This job uses '+amountText(required)+' '+unit+' ('+amountText(used)+' × '+quantity+'). After printing: '+amountText(after)+' '+unit+' remains.';
  const signature=String(material.id)+'|'+String(used)+'|'+String(quantity);
  if(lastDeductedSignatures.has(signature))text.textContent+=' This exact setup was already logged; another deduction will ask you to confirm.';
 }
 if(mark){mark.disabled=used<=0||required>remaining;mark.hidden=false;mark.textContent='Mark as printed · deduct '+amountText(required)+' '+unit}
}
function markPrinted(){
 const material=selectedMaterialId?read().find(item=>String(item.id)===String(selectedMaterialId)):null;
 if(!material){syncWorkshopUsage();return}
 const used=Number(val('materialUsed'))||0,quantity=Math.max(1,Math.floor(Number(val('qty'))||1)),required=used*quantity,remaining=materialRemaining(material),unit=materialUnit(material);
 if(used<=0||required>remaining){syncWorkshopUsage();return}
 const signature=String(material.id)+'|'+String(used)+'|'+String(quantity);
 if(lastDeductedSignatures.has(signature)&&!window.confirm('This exact setup was already deducted. Deduct '+amountText(required)+' '+unit+' from '+material.name+' again?'))return;
 const list=read(),index=list.findIndex(item=>String(item.id)===String(material.id));if(index<0)return;
 list[index]={...list[index],remaining:Math.max(0,remaining-required),updated:Date.now()};
 if(!write(list)){const text=document.getElementById('ppWorkshopUsageText');if(text)text.textContent='Could not save the stock update in this browser. Please check browser storage and try again.';return}
 lastDeductedSignatures.add(signature);render();syncWorkshopUsage();
 const text=document.getElementById('ppWorkshopUsageText');if(text)text.textContent='Print logged. '+amountText(required)+' '+unit+' deducted from '+material.name+'.';
}
function populatePrinterPresets(preferred){
 const target=document.getElementById('ppWorkshopPrinterPreset'),source=document.getElementById('printer');if(!target)return;
 const options=source?[...source.options].filter(option=>option.value&&option.value!=='custom'&&!option.value.startsWith('custom|')):[];
 target.innerHTML='<option value="">Custom printer details</option>'+options.map(option=>{const group=option.parentElement?.tagName==='OPTGROUP'?option.parentElement.label:'';return '<option value="'+esc(option.value)+'">'+esc(group?group+' · '+option.textContent.trim():option.textContent.trim())+'</option>'}).join('');
 if(preferred&&options.some(option=>option.value===preferred))target.value=preferred;
}
function fillPrinterFromPreset(){
 const preset=document.getElementById('ppWorkshopPrinterPreset'),source=document.getElementById('printer'),value=preset?.value;if(!value||!source)return;
 const option=[...source.options].find(item=>item.value===value);if(!option)return;
 const parts=value.split(/[|,]/),name=document.getElementById('ppWorkshopPrinterName');
 if(name&&!name.value)name.value=option.textContent.trim();
 const power=document.getElementById('ppWorkshopPrinterWatts'),price=document.getElementById('ppWorkshopPrinterPrice'),life=document.getElementById('ppWorkshopPrinterLife'),type=document.getElementById('ppWorkshopPrinterType');
 if(power)power.value=Number(parts[0])||0;if(price)price.value=currentMoneyValue(Number(parts[1])||0).toFixed(2);if(life)life.value=Number(parts[2])||0;
 if(type)type.value=option.dataset.materialType==='resin'?'Resin':'Filament';
}
function openPrinterForm(existing){
 const wrap=document.getElementById('ppWorkshopPrinterForm'),form=wrap;if(!wrap||!form)return;
 const source=document.getElementById('printer'),current=source?.value||'',preset=current&&current!=='custom'&&!current.startsWith('custom|')?current:'';
 form.dataset.editId=existing?.id||'';
 populatePrinterPresets(existing?.presetValue||preset);
 document.getElementById('ppWorkshopPrinterName').value=existing?.name||'';
 document.getElementById('ppWorkshopPrinterWatts').value=existing?.watts??0;
 document.getElementById('ppWorkshopPrinterPrice').value=existing?currentMoneyValue(existing.price??0).toFixed(2):0;
 document.getElementById('ppWorkshopPrinterLife').value=existing?.lifetime??0;
 document.getElementById('ppWorkshopPrinterType').value=existing?.materialType||(document.getElementById('materialType')?.value==='resin'?'Resin':'Filament');
 if(!existing&&preset)fillPrinterFromPreset();
 else if(!existing&&(current==='custom'||current.startsWith('custom|'))){
  document.getElementById('ppWorkshopPrinterWatts').value=Number(val('customPrinterPower'))||0;
  document.getElementById('ppWorkshopPrinterPrice').value=Number(val('customPrinterPrice'))||0;
  document.getElementById('ppWorkshopPrinterLife').value=Number(val('customPrinterLife'))||0;
 }
 document.getElementById('ppWorkshopPrinterFormTitle').textContent=existing?'Edit printer profile':'Create printer profile';
 wrap.hidden=false;document.getElementById('ppWorkshopPrinterName').focus();
}
function closePrinterForm(){const wrap=document.getElementById('ppWorkshopPrinterForm');if(wrap)wrap.hidden=true}
function savePrinterForm(){
 const form=document.getElementById('ppWorkshopPrinterForm'),name=document.getElementById('ppWorkshopPrinterName').value.trim();
 if(!name){alert('Please enter a printer name.');return}
 const editId=form.dataset.editId,presetValue=document.getElementById('ppWorkshopPrinterPreset').value;
 const watts=Number(document.getElementById('ppWorkshopPrinterWatts').value),priceInput=Number(document.getElementById('ppWorkshopPrinterPrice').value),lifetime=Number(document.getElementById('ppWorkshopPrinterLife').value);
 if([watts,priceInput,lifetime].some(value=>!Number.isFinite(value)||value<0)){alert('Printer values cannot be negative.');return}
 const profile={id:editId||((crypto.randomUUID&&crypto.randomUUID())||String(Date.now())),name,watts,price:toGBP(priceInput),lifetime,materialType:document.getElementById('ppWorkshopPrinterType').value,presetValue,updated:Date.now()};
 const list=readPrinters();const next=editId?list.map(item=>String(item.id)===String(editId)?profile:item):[...list,profile];
 if(!writePrinters(next)){alert('Could not save this printer profile in this browser.');return}
 closePrinterForm();syncPrinterProfileOptions(profile.id,true);renderPrinters();
}
function usePrinter(id){
 const profile=readPrinters().find(item=>String(item.id)===String(id)),printer=document.getElementById('printer');if(!profile||!printer)return;
 applyingMaterial=true;syncPrinterProfileOptions(profile.id,true);
 const values=[['customPrinterPrice',currentMoneyValue(profile.price)],['customPrinterPower',profile.watts],['customPrinterLife',profile.lifetime]];
 values.forEach(([field,value])=>{const input=document.getElementById(field);if(input){input.value=value;input.dispatchEvent(new Event('input',{bubbles:true}))}});
 const type=document.getElementById('materialType');if(type){type.value=profile.materialType==='Resin'?'resin':'filament';type.dispatchEvent(new Event('change',{bubbles:true}))}
 applyingMaterial=false;selectedMaterialId='';syncWorkshopUsage();
 const hint=document.getElementById('ppPrinterDetailsHint');if(hint)hint.textContent='Using My Workshop profile: '+profile.name+'.';
 document.getElementById('calc')?.click();closeWorkspaceWorkshop();
 document.querySelector('.pp-step[data-tab="machine"]')?.click();
 document.querySelector('[data-panel="machine"]')?.scrollIntoView({block:'start',behavior:'smooth'});
}
function deletePrinter(id){
 const profile=readPrinters().find(item=>String(item.id)===String(id));if(!profile||!confirm('Delete “'+profile.name+'”?'))return;
 if(writePrinters(readPrinters().filter(item=>String(item.id)!==String(id))))renderPrinters();
}
function updateMaterialFormLabels(){
 const resin=document.getElementById('ppMatType')?.value==='Resin',unit=resin?'ml':'g';
 const amount=document.getElementById('ppMatAmountLabel'),remaining=document.getElementById('ppMatRemainingLabel'),low=document.getElementById('ppMatLowStockLabel');
 if(amount)amount.textContent=resin?'Bottle size (ml)':'Spool size (g)';
 if(remaining)remaining.textContent='Remaining stock ('+unit+')';
 if(low)low.textContent='Low-stock alert · Pro ('+unit+')';
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
function openFormFromCalculator(){
 const typeEl=document.getElementById('materialType'), materialEl=document.getElementById('material');
 const type=typeEl?.value==='resin'?'Resin':'Filament';
 const selected=materialEl?.selectedOptions?.[0]?.text?.trim()||'';
 const pack=Number(document.getElementById('materialPack')?.value)||0;
 const cost=Number(document.getElementById('materialPackCost')?.value)||0;
 const form=document.getElementById('ppMaterialForm');if(!form)return;
 form.dataset.editId='';form.dataset.barcode='';
 document.getElementById('ppMatName').value=selected&&selected!=='Other / Custom Filament'&&selected!=='Other / Custom Resin'?selected:'';
 document.getElementById('ppMatType').value=type;
 syncBrandOptions('');
 document.getElementById('ppMatColour').value='';
 document.getElementById('ppMatAmount').value=pack||1000;
 document.getElementById('ppMatRemaining').value=pack||1000;
 document.getElementById('ppMatLowStock').value=type==='Resin'?50:200;
 document.getElementById('ppMatCost').value=currentMoneyValue(cost||0).toFixed(2);
 updateMaterialFormLabels();
 document.getElementById('ppMaterialFormTitle').textContent='Save Current Material';
 document.getElementById('ppMaterialFormPanel').classList.add('open');syncWorkspaceModalState();
}
function openForm(existing){
 const form=document.getElementById('ppMaterialForm');if(!form)return;
 form.dataset.editId=existing?.id||'';form.dataset.barcode=existing?.barcode||'';
 document.getElementById('ppMatName').value=existing?.name||'';
 document.getElementById('ppMatType').value=existing?.type||'Filament';
 syncBrandOptions(existing?.brand||'');
 document.getElementById('ppMatColour').value=existing?.colour||'';
 document.getElementById('ppMatAmount').value=existing?.amount??1000;
 document.getElementById('ppMatRemaining').value=existing?.remaining??existing?.amount??1000;
 document.getElementById('ppMatLowStock').value=existing?.lowStock??(existing?.type==='Resin'?50:200);
 document.getElementById('ppMatCost').value=currentMoneyValue(existing?.cost??20).toFixed(2);
 updateMaterialFormLabels();
 document.getElementById('ppMaterialFormTitle').textContent=existing?'Edit material profile':'Create material profile';
 document.getElementById('ppMaterialFormPanel').classList.add('open');syncWorkspaceModalState();
}function closeForm(){document.getElementById('ppMaterialFormPanel')?.classList.remove('open');syncWorkspaceModalState()}
function saveForm(){
 const name=document.getElementById('ppMatName').value.trim(),type=document.getElementById('ppMatType').value;
 const amount=Number(document.getElementById('ppMatAmount').value)||0,cost=Number(document.getElementById('ppMatCost').value)||0;
 const remaining=Number(document.getElementById('ppMatRemaining').value),lowStock=Number(document.getElementById('ppMatLowStock').value)||0;
 if(document.getElementById('ppMaterialForm').dataset.barcode&&document.getElementById('ppMatCost').value.trim()===''){alert('Enter the purchase cost, including 0 if it was free.');return}
 if(!name){alert('Please enter a material name.');return}
 if(amount<=0){alert('Please enter a package amount greater than 0.');return}
 if(!Number.isFinite(remaining)||remaining<0){alert('Remaining stock cannot be negative.');return}
 if(lowStock<0){alert('The low-stock alert cannot be negative.');return}
 const brandSelect=document.getElementById('ppMatBrand'),brandCustom=document.getElementById('ppMatBrandCustom'),brand=(brandSelect?.value==='__other__'?(brandCustom?.value||''):brandSelect?.value||'').trim(),colour=document.getElementById('ppMatColour').value.trim();
 const costGBP=toGBP(cost),unitCost=moneyFromGBP(costGBP/amount)+' / '+(type==='Resin'?'ml':'g'),items=read(),id=document.getElementById('ppMaterialForm').dataset.editId;
 const barcode=window.PrintProfitBusinessMath?.barcode(document.getElementById('ppMaterialForm').dataset.barcode);
 const obj={...(barcode?{barcode}:{}),id:id||((crypto.randomUUID&&crypto.randomUUID())||String(Date.now())),name,type,brand,colour,amount,remaining,lowStock,cost:costGBP,unitCost,updated:Date.now()};
 if(!write(id?items.map(x=>String(x.id)===String(id)?obj:x):[...items,obj])){alert('Could not save this material in this browser.');return}
 closeForm();render();
}
function useMaterial(id){
 const m=read().find(x=>String(x.id)===String(id));if(!m)return;
 applyingMaterial=true;
 const type=document.getElementById('materialType'),material=document.getElementById('material');
 if(type){type.value=m.type==='Resin'?'resin':'filament';type.dispatchEvent(new Event('change',{bubbles:true}))}
 if(material){let option=[...material.options].find(o=>o.text.trim().toLowerCase()===m.name.trim().toLowerCase());if(!option&&m.name)option=[...material.options].find(o=>o.text.toLowerCase().includes(m.name.toLowerCase()));if(option)material.value=option.value;}
 const pack=document.getElementById('materialPack'),cost=document.getElementById('materialPackCost');
 if(pack)pack.value=m.amount;if(cost)cost.value=m.cost;
 [pack,cost,material].filter(Boolean).forEach(e=>e.dispatchEvent(new Event('input',{bubbles:true})));
 applyingMaterial=false;selectedMaterialId=String(m.id);
 closeWorkspaceWorkshop();
 document.getElementById('calc')?.click();syncWorkshopUsage();
}
function deleteMaterial(id){const m=read().find(x=>String(x.id)===String(id));if(!m)return;if(!confirm('Delete “'+m.name+'”?'))return;if(write(read().filter(x=>String(x.id)!==String(id)))){if(String(selectedMaterialId)===String(id))selectedMaterialId='';render()}}
function refreshCurrencyUI(){
 const label=document.getElementById('ppMatCostLabel');
 if(label){
   const meta=currencyMeta();
   try{
   const parts=new Intl.NumberFormat(undefined,{style:'currency',currency:meta.code,minimumFractionDigits:0,maximumFractionDigits:2}).formatToParts(0);
   const symbol=parts.find(p=>p.type==='currency')?.value||meta.code;
   label.textContent='Package cost ('+symbol+')';
 }catch(e){label.textContent='Package cost ('+meta.code+')';}
 }
}
document.addEventListener('printprofit-settings-changed',()=>{
 refreshCurrencyUI();
 if(document.getElementById('ppMaterialsPanel')?.classList.contains('open'))render();
});
function open(workspaceSection='workshop'){
 window.__ppCloseWorkspaceProjects?.();
 let panel=document.getElementById('ppMaterialsPanel');
 if(!panel){
  panel=document.createElement('div');panel.id='ppMaterialsPanel';
  panel.innerHTML=`<div class="pp-materials-backdrop" data-material-close></div><section class="pp-materials-dialog" role="dialog" aria-modal="true" aria-labelledby="ppMaterialsTitle">
  <header class="pp-materials-head"><div><div class="pp-materials-kicker">PRINTPROFIT</div><h2 id="ppMaterialsTitle">My Workspace</h2><p id="ppWorkspaceDescription">Your printers, materials and stock—all in one place. Add your machines, track filament and resin, and check what is left before your next job.</p></div><button type="button" class="pp-materials-close" data-material-close>×</button></header>
  <nav class="pp-workspace-nav" aria-label="My Workspace sections"><button type="button" data-workspace-section="projects"><svg viewBox="0 0 48 48" aria-hidden="true"><use href="./assets/printprofit-icon-master.svg#pp-folder"></use></svg>Projects</button><button type="button" data-workspace-section="workshop" aria-current="page"><svg viewBox="0 0 48 48" aria-hidden="true"><use href="./assets/printprofit-icon-master.svg#pp-printer"></use></svg>Workshop</button><button type="button" data-workspace-section="pro"><svg viewBox="0 0 48 48" aria-hidden="true"><use href="./assets/printprofit-icon-master.svg#pp-profit"></use></svg>Pro tools</button><button type="button" data-workspace-section="account"><svg viewBox="0 0 48 48" aria-hidden="true"><use href="./assets/printprofit-icon-master.svg#pp-settings"></use></svg>Profile &amp; Account</button></nav>
  <div class="pp-workspace-intro"><button type="button" class="pp-material-new" data-pp-backup="export">Download backup · Free</button> <button type="button" class="pp-material-new" data-pp-backup="import">Import backup · Free</button> <button type="button" class="pp-material-new" data-pp-backup="cloud">Download existing cloud data</button><p>Backups include project settings and inventory, not uploaded model files. Keep your original files. Clearing browser data can remove local saves.</p></div><div id="ppWorkshopAccount"><p class="pp-account-loading" role="status">Loading account controls…</p><button type="button" data-pp-account-retry>Try again</button></div>
  <section id="ppWorkspacePro" class="pp-workspace-pro" aria-label="Pro tools" hidden>
   <section class="pp-workspace-intro"><h4>Basic stays useful. Pro saves you time.</h4><p><strong>Basic · Free:</strong> the full core calculator, file analysis, single/batch costs, manual printer and material inventory, local project saving and backup export/import.</p><p><strong>Pro · £2.50/month or £24/year:</strong> cloud saving, barcode-assisted entry, confirmed-print stock deductions, low-stock alerts, multi-printer run planning, scenario comparisons and quotation tools.</p><p>${window.PRINTPROFIT_BILLING_CONFIG?.enabled?'':'Subscriptions are still being tested. Existing previews remain available until launch. '}Saved data stays readable and exportable when Pro ends; local saving continues.</p></section>
   <div class="pp-pro-intro"><div class="pp-pro-intro-copy"><span class="pp-materials-kicker">PRINTPROFIT PRO · ${window.PRINTPROFIT_BILLING_CONFIG?.enabled?'MEMBERSHIP':'PREVIEW'}</span><h3>Keep your prints, printers and materials <em>organised.</em></h3><p>For hobbyists, makers and sellers: take your workspace between devices, scan your materials and spend less time updating stock. Local project saves, manual inventory and downloadable backups stay free. ${window.PRINTPROFIT_BILLING_CONFIG?.enabled?'A seven day trial is available on your first subscription. Your saved projects and inventory remain available if you cancel.':'Pro subscriptions are being tested; the previews are available without a subscription for now.'}</p><button type="button" data-pp-pro-tool="subscription">${window.PRINTPROFIT_BILLING_CONFIG?.enabled?'View plan and account':'Profile & Account'} <span aria-hidden="true">›</span></button></div><div class="pp-pro-hero-icon" aria-hidden="true"><svg viewBox="0 0 48 48"><use href="./assets/printprofit-icon-master.svg#pp-profit"></use></svg></div></div>
   <div class="pp-pro-grid">
    <article class="pp-pro-card"><span class="pp-pro-card-kicker">WHEREVER YOU PRINT</span><h4>Your workspace across devices</h4><p>Cloud-save project settings, printers and material inventory to your account. Choose whether to copy existing local data when upgrading. Uploaded model files stay on their original device.</p><button type="button" data-pp-pro-tool="cloud">Cloud saving and account <span aria-hidden="true">›</span></button></article>
    <article class="pp-pro-card"><span class="pp-pro-card-kicker">LESS ADMIN</span><h4>Stay on top of your materials</h4><p>Confirm a completed print to deduct its material use, and see low-stock warnings. Calculating never deducts stock. Manual stock edits stay free.</p><button type="button" data-pp-pro-tool="stock">View material stock <span aria-hidden="true">›</span></button></article>
    <article class="pp-pro-card pp-pro-production"><div class="pp-pro-card-head"><span class="pp-pro-card-icon"><svg viewBox="0 0 48 48" aria-hidden="true"><use href="./assets/printprofit-icon-master.svg#pp-printer-settings"></use></svg></span><span class="pp-pro-card-number">01</span></div><span class="pp-pro-card-kicker">PRODUCTION</span><h4>Multi-printer runs</h4><p>Split a quantity across printer groups and plate cycles. Add failed-print, downtime and changeover allowances to estimate time, energy and wear.</p><button type="button" data-pp-pro-tool="production">Open production planner <span aria-hidden="true">›</span></button></article>
    <article class="pp-pro-card pp-pro-scenarios"><div class="pp-pro-card-head"><span class="pp-pro-card-icon"><svg viewBox="0 0 48 48" aria-hidden="true"><use href="./assets/printprofit-icon-master.svg#pp-compare"></use></svg></span><span class="pp-pro-card-number">02</span></div><span class="pp-pro-card-kicker">DECISIONS</span><h4>Compare scenarios</h4><p>Save up to three versions of a calculation with your project and compare costs, margins and profit.</p><button type="button" data-pp-pro-tool="scenario">Compare scenarios <span aria-hidden="true">›</span></button></article>
    <article class="pp-pro-card pp-pro-quote"><div class="pp-pro-card-head"><span class="pp-pro-card-icon"><svg viewBox="0 0 48 48" aria-hidden="true"><use href="./assets/printprofit-icon-master.svg#pp-file"></use></svg></span><span class="pp-pro-card-number">03</span></div><span class="pp-pro-card-kicker">CUSTOMERS</span><h4>Draft quotation</h4><p>Prepare a customer-facing quote with selling price and delivery. Review the draft before printing or saving it as a PDF.</p><button type="button" data-pp-pro-tool="quote">Create a quotation <span aria-hidden="true">›</span></button></article>
    <article class="pp-pro-card pp-pro-export"><div class="pp-pro-card-head"><span class="pp-pro-card-icon"><svg viewBox="0 0 48 48" aria-hidden="true"><use href="./assets/printprofit-icon-master.svg#pp-download"></use></svg></span><span class="pp-pro-card-number">04</span></div><span class="pp-pro-card-kicker">RECORDS</span><h4>Costing CSV</h4><p>Download the current calculation with its internal costs, profit and production figures for your own records.</p><button type="button" data-pp-pro-tool="export">Download costing CSV <span aria-hidden="true">›</span></button></article>
    <article class="pp-pro-card pp-pro-materials"><div class="pp-pro-card-head"><span class="pp-pro-card-icon"><svg viewBox="0 0 48 48" aria-hidden="true"><use href="./assets/printprofit-icon-master.svg#pp-filament"></use></svg></span><span class="pp-pro-card-number">05</span></div><span class="pp-pro-card-kicker">MATERIALS</span><h4>Barcode-assisted entry</h4><p>Scan or type a package barcode, check its details and save it to your material inventory. Manual entry stays free.</p><button type="button" data-pp-pro-tool="scan">Open material scanner <span aria-hidden="true">›</span></button></article>
   </div>
   <div class="pp-pro-later"><h4>Ideas for later</h4><p>Planned Pro additions, not included yet: print history with spending and profit summaries, reusable print presets, shopping reminders and custom quote branding. Photo and label reading also needs further development. We will only advertise these as available once built and tested.</p></div>
  </section>
  <div class="pp-workshop-tabs" role="tablist" aria-label="Workshop library"><button type="button" class="active" data-workshop-tab="materials" aria-selected="true">My Materials</button><button type="button" data-workshop-tab="printers" aria-selected="false">My Printers</button><button type="button" data-workshop-tab="stock" aria-selected="false">Stock Overview</button></div><section id="ppStockOverview" class="pp-workspace-intro" hidden></section>
  <div id="ppWorkshopMaterialsView"><section class="pp-workspace-intro"><h3>Track every spool and bottle</h3><p>Basic: add materials manually and monitor remaining stock. ${window.PRINTPROFIT_BILLING_CONFIG?.enabled?'Pro: scan a barcode, confirm the details, then save.':'Pro preview: scan a barcode, confirm the details, then save.'} Known barcodes reuse your saved details; new ones need material details and price.</p><p>Select Use on a material to connect it to your calculation. Pro can update stock when you choose Mark as printed after printing. Basic users can edit remaining stock manually.</p></section><div class="pp-materials-toolbar"><button type="button" class="pp-material-new" data-material-new>＋ Create material profile</button><span id="ppMaterialCount"></span></div><div id="ppMaterialsList"></div></div>
  <div id="ppWorkshopPrintersView" hidden><div class="pp-materials-toolbar"><button type="button" class="pp-material-new" data-printer-new>＋ Create printer profile</button><span id="ppPrinterCount"></span></div>
   <form id="ppWorkshopPrinterForm" class="pp-workshop-printer-form" onsubmit="return false" hidden><div class="pp-workshop-printer-form-head"><strong id="ppWorkshopPrinterFormTitle">Create printer profile</strong><button type="button" class="pp-materials-close" data-printer-form-close aria-label="Close printer form">×</button></div><div class="pp-workshop-printer-form-grid">
    <label>Printer name<input id="ppWorkshopPrinterName" placeholder="e.g. Elegoo Neptune 4"></label><label>Start from a printer preset<select id="ppWorkshopPrinterPreset"><option value="">Custom printer details</option></select></label>
    <label>Power draw (W)<input id="ppWorkshopPrinterWatts" type="number" min="0" step="1" value="0"></label><label>Purchase price (£)<input id="ppWorkshopPrinterPrice" type="number" min="0" step=".01" value="0"></label>
    <label>Expected life (hours)<input id="ppWorkshopPrinterLife" type="number" min="0" step="1" value="4000"></label><label>Material type<select id="ppWorkshopPrinterType"><option>Filament</option><option>Resin</option></select></label>
   </div><div class="pp-workshop-printer-form-actions"><button type="button" class="pp-material-cancel" data-printer-form-close>Cancel</button><button type="button" class="pp-material-save" data-printer-save>Save printer profile</button></div></form><div id="ppWorkshopPrintersList"></div>
  </div></section>
  <div id="ppMaterialFormPanel"><div class="pp-material-form-backdrop" data-material-form-close></div><form id="ppMaterialForm" class="pp-material-form" onsubmit="return false"><div class="pp-material-form-head"><div><div class="pp-materials-kicker">MATERIAL LIBRARY</div><h2 id="ppMaterialFormTitle">Create material profile</h2></div><button type="button" class="pp-materials-close" data-material-form-close>×</button></div>
  <div class="pp-material-form-grid"><label>Material name<input id="ppMatName" placeholder="e.g. eSUN PLA+ Black"></label><label>Type<select id="ppMatType"><option>Filament</option><option>Resin</option></select></label><label>Brand<select id="ppMatBrand"><option value="">Select a brand...</option><option value="__other__">Other / Custom</option></select><input id="ppMatBrandCustom" class="pp-brand-custom" placeholder="Enter brand name" style="display:none" aria-label="Custom brand name"></label><label>Colour<input id="ppMatColour" placeholder="Optional"></label><label><span id="ppMatAmountLabel">Spool weight (g)</span><input id="ppMatAmount" type="number" min="0" step=".01" value="1000"></label><label><span id="ppMatRemainingLabel">Remaining stock (g)</span><input id="ppMatRemaining" type="number" min="0" step=".01" value="1000"></label><label><span id="ppMatLowStockLabel">Low-stock alert · Pro (g)</span><input id="ppMatLowStock" type="number" min="0" step=".01" value="200"></label><label><span id="ppMatCostLabel">Package cost (£)</span><input id="ppMatCost" type="number" min="0" step=".01" value="20"></label></div>
  <div class="pp-material-form-actions"><button type="button" class="pp-material-cancel" data-material-form-close>Cancel</button><button type="button" class="pp-material-save" data-material-save>Save material profile</button></div></form></div>`;
  document.body.appendChild(panel);
  const style=document.createElement('style');style.textContent=`
#ppMaterialsPanel{display:none;position:fixed;inset:0;z-index:100001}#ppWorkshopAccount[hidden]{display:none!important}#ppMaterialsPanel.open{display:block}.pp-materials-backdrop{position:absolute;inset:0;background:#000b;backdrop-filter:blur(5px)}
.pp-materials-dialog{position:relative;width:min(1120px,calc(100vw - 32px));max-width:calc(100vw - 16px);max-height:calc(100vh - 32px);max-height:calc(100dvh - 32px);margin:16px auto;background:#081720;color:#edf3f6;border:1px solid #294957;border-radius:20px;box-shadow:0 25px 80px #000d;overflow:auto;overscroll-behavior:contain;font-family:Inter,Segoe UI,system-ui,sans-serif}
.pp-materials-head{display:flex;justify-content:space-between;gap:20px;padding:25px 28px 20px;border-bottom:1px solid #294957;background:linear-gradient(145deg,#0b202b,#07141d)}.pp-materials-kicker{font-size:10px;font-weight:900;letter-spacing:.18em;color:#ff7800}.pp-materials-head h2{margin:5px 0;font-size:30px}.pp-materials-head p{margin:0;color:#9fb0b9}.pp-materials-close{width:38px;height:38px;border:1px solid #355363;border-radius:10px;background:#091923;color:#fff;font-size:26px;cursor:pointer}
.pp-workspace-nav{display:flex;gap:8px;padding:14px 28px 0;background:#081720}.pp-workspace-nav button{border:1px solid #355363;border-radius:9px;background:#0a1b25;color:#aebdc6;padding:9px 13px;font-weight:800;cursor:pointer}.pp-workspace-nav button[aria-current="page"]{background:#143140;color:#f5f9fb;border-color:#35d6e5}.pp-workspace-nav button:focus-visible{outline:2px solid #35d6e5;outline-offset:2px}
.pp-workspace-pro{padding:22px 28px 32px;color:#edf3f6}.pp-workspace-pro[hidden]{display:none!important}.pp-pro-intro{padding:24px;border:1px solid #41616b;border-radius:16px;background:linear-gradient(125deg,#14333e,#0b202b 72%)}.pp-pro-intro h3{font-size:clamp(22px,3vw,31px);margin:8px 0}.pp-pro-intro p,.pp-pro-grid p,.pp-pro-later p{color:#c2d3d9;line-height:1.55}.pp-pro-intro button,.pp-pro-grid button{border:1px solid #ff8a24;border-radius:9px;background:#ff8a24;color:#1c130b;font-weight:800;padding:10px 13px;cursor:pointer}.pp-pro-intro button:focus-visible,.pp-pro-grid button:focus-visible{outline:2px solid #35d6e5;outline-offset:3px}.pp-pro-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px;margin-top:15px}.pp-pro-grid article,.pp-pro-later{min-width:0;padding:19px;border:1px solid #355363;border-radius:13px;background:#0b202b}.pp-pro-grid article>span{color:#ffad6c;font-size:10px;letter-spacing:.13em;font-weight:900}.pp-pro-grid h4,.pp-pro-later h4{font-size:18px;margin:8px 0}.pp-pro-grid p{font-size:13px;min-height:62px}.pp-pro-later{margin-top:15px}.pp-pro-later p{font-size:13px;margin-bottom:0}
.pp-materials-toolbar{display:flex;justify-content:space-between;align-items:center;padding:18px 28px 8px;color:#9fb0b9;font-size:12px}.pp-material-new,.pp-material-save{border:1px solid #ff7800;background:#ff7800;color:#fff;border-radius:9px;padding:10px 15px;font-weight:800;cursor:pointer}.pp-materials-dialog>#ppWorkshopMaterialsView,#ppWorkshopPrintersView{padding-bottom:18px}#ppMaterialsList,#ppWorkshopPrintersList{padding:10px 28px 28px}
.pp-material-card{display:flex;justify-content:space-between;align-items:center;gap:18px;padding:17px;margin-top:10px;border:1px solid #294957;border-radius:14px;background:#0b202b}.pp-material-main{display:flex;align-items:center;gap:14px;min-width:0}.pp-material-dot,.pp-printer-dot{width:14px;height:14px;flex:0 0 14px;border-radius:50%;background:#ff7800;box-shadow:0 0 15px #ff780066}.pp-printer-dot{background:#35d6e5;box-shadow:0 0 15px #35d6e566}.pp-material-card h3{margin:0 0 4px;font-size:16px}.pp-material-card p{margin:0;color:#c5d1d7;font-size:12px}.pp-material-card small{display:block;color:#93a8b2;margin-top:5px}.pp-material-actions{display:flex;gap:7px;flex-wrap:wrap}.pp-material-actions button,.pp-material-cancel{border:1px solid #355363;background:#091923;color:#e6eef2;border-radius:8px;padding:8px 10px;cursor:pointer;font-weight:700}.pp-material-actions button:hover{border-color:#ff7800}.pp-material-actions .danger:hover{border-color:#d9534f;color:#ff9a96}.pp-stock-low{display:inline-block;margin-left:7px;padding:3px 7px;border:1px solid #e8a44377;border-radius:999px;color:#ffd094;font-size:10px;vertical-align:middle}.pp-materials-empty{text-align:center;padding:55px 20px;color:#9fb0b9}.pp-materials-empty-icon{font-size:38px;color:#ff7800}.pp-materials-empty h3{color:#edf3f6;margin:10px 0 5px}.pp-materials-empty p{margin:0 0 20px}
.pp-workspace-intro{margin:16px 28px;padding:16px;border:1px solid #355363;border-radius:12px;line-height:1.5}.pp-workspace-intro h3{margin:0 0 8px}.pp-workspace-intro p{margin:8px 0}.pp-workshop-tabs{flex-wrap:wrap}.pp-workshop-tabs[hidden]{display:none!important}.pp-workshop-tabs{display:flex;gap:8px;padding:16px 28px 0}.pp-workshop-tabs button{border:1px solid #355363;border-radius:10px 10px 0 0;background:#0a1b25;color:#aebdc6;padding:10px 14px;font-weight:800;cursor:pointer}.pp-workshop-tabs button.active{background:#143140;color:#f5f9fb;border-color:#35d6e5}
.pp-workshop-printer-form{margin:12px 28px;padding:16px;border:1px solid #355363;border-radius:14px;background:#0a1b25}.pp-workshop-printer-form-head{display:flex;justify-content:space-between;align-items:center;margin-bottom:12px}.pp-workshop-printer-form-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px}.pp-workshop-printer-form-grid label{font-size:12px;color:#aebdc6}.pp-workshop-printer-form-grid input,.pp-workshop-printer-form-grid select{display:block;width:100%;margin-top:6px;padding:10px;border:1px solid #355363;border-radius:8px;background:#081720;color:#f5f9fb}.pp-workshop-printer-form-actions{display:flex;justify-content:flex-end;gap:8px;margin-top:14px}
.pp-material-form-grid{grid-template-columns:1fr 1fr 1fr}.pp-material-form-grid input,.pp-material-form-grid select{font-size:14px}.pp-material-form{max-height:calc(100vh - 40px);overflow:auto}
.pp-workshop-usage{display:flex;align-items:center;justify-content:space-between;gap:14px;margin:14px 0;padding:15px;border:1px solid #315767;border-left:4px solid #ff8a24;border-radius:12px;background:linear-gradient(145deg,#0d2230,#102a39);color:#f5f9fb}.pp-workshop-usage-copy{min-width:0}.pp-workshop-usage-copy>span{display:block;color:#ffae62;font-size:9px;font-weight:900;letter-spacing:.15em}.pp-workshop-usage-copy strong{display:block;margin-top:4px;font-size:14px}.pp-workshop-usage-copy p{margin:4px 0 0;color:#bfd0d7;font-size:12px;line-height:1.4}.pp-workshop-usage-actions{display:flex;gap:8px;flex-wrap:wrap}.pp-workshop-usage-actions button{border:1px solid #486775;border-radius:9px;padding:9px 11px;background:#091923;color:#e6eef2;font-weight:800;cursor:pointer}.pp-workshop-usage-actions .pp-workshop-mark{background:#0d986b;border-color:#10b981;color:#fff}.pp-workshop-usage-actions button:disabled{opacity:.48;cursor:not-allowed}
@media(max-width:760px){.pp-materials-dialog{width:calc(100vw - 16px);max-width:calc(100vw - 16px);margin:8px auto;max-height:calc(100vh - 16px);max-height:calc(100dvh - 16px);border-radius:14px}.pp-materials-head,.pp-materials-toolbar,#ppMaterialsList,#ppWorkshopPrintersList{padding-left:16px;padding-right:16px}.pp-material-card{flex-direction:column;align-items:flex-start}.pp-material-actions{width:100%}.pp-material-form-grid,.pp-workshop-printer-form-grid{grid-template-columns:1fr}.pp-workshop-printer-form{margin-left:16px;margin-right:16px}.pp-workspace-nav{padding-left:16px;padding-right:16px;flex-wrap:wrap}.pp-workshop-tabs{padding-left:16px;padding-right:16px}.pp-workshop-usage{align-items:flex-start;flex-direction:column}.pp-workshop-usage-actions,.pp-workshop-usage-actions button{width:100%}.pp-workspace-pro{padding:16px}.pp-pro-grid{grid-template-columns:1fr}.pp-pro-grid p{min-height:0}}
`;style.textContent+='\n#ppMaterialFormPanel:not(.open){display:none!important}.pp-materials-dialog{max-height:calc(var(--pp-modal-viewport-height,100dvh) - 32px)!important}@media(max-width:760px){.pp-materials-dialog{max-height:calc(var(--pp-modal-viewport-height,100dvh) - 16px)!important}}';document.head.appendChild(style);
 }
 refreshCurrencyUI();panel.classList.add('open');syncWorkspaceModalState();document.body.style.overflow='hidden';setWorkshopTab('materials');setWorkspaceSection(workspaceSection);render();document.dispatchEvent(new Event('pp-workshop-open'));const c=document.getElementById('ppMaterialCount');if(c){const n=read().length;c.textContent=n+' saved '+(n===1?'material':'materials')}
}
function closeWorkspaceWorkshop(){document.getElementById('ppMaterialsPanel')?.classList.remove('open');document.body.style.overflow=document.querySelector('#ppProjectsPanel.open')?'hidden':'';syncWorkspaceModalState();}
window.__ppPrepareMaterialScan=raw=>{
 const code=window.PrintProfitBusinessMath?.barcode(raw);if(!code)throw new Error('Enter a valid EAN or UPC barcode.');
 const match=window.PrintProfitBusinessMath.matchMaterial(read(),code);
 open('workshop');setWorkshopTab('materials');openForm(match||undefined);
 const form=document.getElementById('ppMaterialForm');form.dataset.editId='';form.dataset.barcode=code;
 document.getElementById('ppMaterialFormTitle').textContent='Review scanned material — '+code;
 if(match)document.getElementById('ppMatRemaining').value=match.amount;
 else for(const id of ['ppMatName','ppMatAmount','ppMatRemaining','ppMatCost'])document.getElementById(id).value='';
 return !!match;
};
window.__ppOpenWorkspaceWorkshop=(section='workshop')=>open(section);
window.__ppCloseWorkspaceWorkshop=()=>closeWorkspaceWorkshop();
document.addEventListener('click',event=>{if(!event.target.closest('[data-pp-account-retry]'))return;
 const script=document.createElement('script');script.src='./workshop-account-sync.js?v=20261013-language1';
 script.onload=()=>{window.__ppRefreshWorkshopAccountUI?.();document.dispatchEvent(new Event('pp-workshop-open'));};
 script.onerror=()=>{const status=document.querySelector('#ppWorkshopAccount .pp-account-loading');if(status)status.textContent='Account controls could not load. Check your connection and try again.';};document.body.appendChild(script);
});
function ensureButton(){ /* Material controls are intentionally kept out of Box 3. */ }

document.addEventListener('click',e=>{
 const t=e.target.closest('[data-workspace-section],[data-pp-pro-tool],[data-material-open],[data-material-save-current],[data-material-close],[data-material-new],[data-material-save],[data-material-form-close],[data-use-material],[data-edit-material],[data-delete-material],[data-workshop-tab],[data-printer-new],[data-printer-form-close],[data-printer-save],[data-printer-use],[data-printer-edit],[data-printer-delete],[data-mark-printed]');
 if(!t)return;
 if(t.hasAttribute('data-workspace-section')){
  if(!t.closest('#ppMaterialsPanel'))return;
  e.preventDefault();e.stopImmediatePropagation();
  const section=t.dataset.workspaceSection;
  if(section==='projects'){closeWorkspaceWorkshop();window.__ppOpenWorkspaceProjects?.();}else setWorkspaceSection(section);
 }
 else if(t.hasAttribute('data-pp-pro-tool')){if(!t.closest('#ppWorkspacePro'))return;e.preventDefault();openProTool(t.dataset.ppProTool)}
 else if(t.hasAttribute('data-material-open')){e.preventDefault();open()}
 else if(t.hasAttribute('data-material-save-current')){e.preventDefault();open();openFormFromCalculator()}
 else if(t.hasAttribute('data-material-close'))closeWorkspaceWorkshop()
 else if(t.hasAttribute('data-material-new'))openForm()
 else if(t.hasAttribute('data-material-save'))saveForm()
 else if(t.hasAttribute('data-material-form-close'))closeForm()
 else if(t.hasAttribute('data-use-material'))useMaterial(t.dataset.useMaterial)
 else if(t.hasAttribute('data-edit-material')){const m=read().find(x=>String(x.id)===String(t.dataset.editMaterial));if(m)openForm(m)}
 else if(t.hasAttribute('data-delete-material'))deleteMaterial(t.dataset.deleteMaterial)
 else if(t.hasAttribute('data-workshop-tab'))setWorkshopTab(t.dataset.workshopTab)
 else if(t.hasAttribute('data-printer-new'))openPrinterForm()
 else if(t.hasAttribute('data-printer-form-close'))closePrinterForm()
 else if(t.hasAttribute('data-printer-save'))savePrinterForm()
 else if(t.hasAttribute('data-printer-use'))usePrinter(t.dataset.printerUse)
 else if(t.hasAttribute('data-printer-edit')){const p=readPrinters().find(item=>String(item.id)===String(t.dataset.printerEdit));if(p)openPrinterForm(p)}
 else if(t.hasAttribute('data-printer-delete'))deletePrinter(t.dataset.printerDelete)
 else if(t.hasAttribute('data-mark-printed'))markPrinted()
},true);
document.addEventListener('change',e=>{
 if(e.target?.id==='ppMatType'){updateMaterialFormLabels();const current=document.getElementById('ppMatBrand')?.value==='__other__'?document.getElementById('ppMatBrandCustom')?.value||'':document.getElementById('ppMatBrand')?.value||'';syncBrandOptions(current)}
 if(e.target?.id==='ppMatBrand'){const custom=document.getElementById('ppMatBrandCustom');if(custom)custom.style.display=e.target.value==='__other__'?'block':'none';if(e.target.value==='__other__')custom?.focus()}
 if(e.target?.id==='ppWorkshopPrinterPreset')fillPrinterFromPreset()
 if(!applyingMaterial&&['material','materialType'].includes(e.target?.id)){selectedMaterialId='';syncWorkshopUsage()}
});
document.addEventListener('input',e=>{if(['materialUsed','qty'].includes(e.target?.id))syncWorkshopUsage()});
document.addEventListener('pp-workshop-data-changed',event=>{if(event.detail?.kind==='printers'){syncPrinterProfileOptions();renderPrinters()}});
document.addEventListener('pp-workshop-profiles-updated',()=>{syncPrinterProfileOptions(undefined,true);renderPrinters()});
const printerSelect=document.getElementById('printer');if(printerSelect)printerSelect.addEventListener('change',()=>{try{if(printerSelect.value.startsWith('workshop:'))localStorage.setItem(SELECTED_PRINTER_KEY,printerSelect.value.slice(9));else localStorage.removeItem(SELECTED_PRINTER_KEY)}catch(e){}});
syncPrinterProfileOptions();
document.addEventListener('change',e=>{if(['materialUsed','qty'].includes(e.target?.id))syncWorkshopUsage()});
document.addEventListener('click',e=>{if(e.target.closest('#calc'))queueMicrotask(syncWorkshopUsage)});
document.addEventListener('keydown',e=>{if(e.key==='Escape'){document.getElementById('ppMaterialFormPanel')?.classList.remove('open');document.getElementById('ppMaterialsPanel')?.classList.remove('open');closePrinterForm();document.body.style.overflow=document.querySelector('#ppProjectsPanel.open')?'hidden':'';syncWorkspaceModalState()}});
// Box 3 remains clean; the Material Library can be surfaced elsewhere.
})();

