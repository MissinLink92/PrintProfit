(()=>{ 
'use strict';
if(window.__printProfitMaterials)return; window.__printProfitMaterials=true;
const KEY='printprofit.materials.v1';
const PRINTER_KEY='printprofit.workshop-printers.v1';
let selectedMaterialId='';
let applyingMaterial=false;
let lastDeductedSignatures=new Set();
const readPrinters=()=>{try{const data=JSON.parse(localStorage.getItem(PRINTER_KEY)||'[]');return Array.isArray(data)?data:[]}catch(e){return[]}};
const writePrinters=v=>{try{localStorage.setItem(PRINTER_KEY,JSON.stringify(v));return true}catch(e){console.warn('PrintProfit printer profile save failed:',e);return false}};
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
const write=v=>{try{localStorage.setItem(KEY,JSON.stringify(v));return true}catch(e){console.warn('PrintProfit material save failed:',e);return false}};
const esc=s=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
const val=id=>document.getElementById(id)?.value??'';
function render(){
 const list=document.getElementById('ppMaterialsList');
 if(list){
  const materials=read().sort((a,b)=>String(a.name||'').localeCompare(String(b.name||'')));
  if(!materials.length)list.innerHTML='<div class="pp-materials-empty"><div class="pp-materials-empty-icon">◉</div><h3>No materials saved yet</h3><p>Add your regular filament and resin, then track how much remains after each print.</p><button type="button" class="pp-material-new" data-material-new>＋ Add Material</button></div>';
  else list.innerHTML=materials.map(m=>{
   const remaining=materialRemaining(m),threshold=materialThreshold(m),unit=materialUnit(m),low=threshold>0&&remaining<=threshold;
   return '<article class="pp-material-card" data-material-id="'+esc(m.id)+'"><div class="pp-material-main"><div class="pp-material-dot"></div><div><h3>'+esc(m.name)+' '+(low?'<span class="pp-stock-low">Low stock</span>':'')+'</h3><p>'+esc(m.type)+' · '+amountText(remaining)+' '+unit+' remaining · '+amountText(m.amount)+' '+unit+' package</p><small>'+esc(m.brand||'No brand')+(m.colour?' · '+esc(m.colour):'')+' · '+moneyFromGBP((Number(m.cost)||0)/(Number(m.amount)||1))+' / '+unit+' · alert at '+amountText(threshold)+' '+unit+'</small></div></div><div class="pp-material-actions"><button type="button" data-use-material="'+esc(m.id)+'">Use</button><button type="button" data-edit-material="'+esc(m.id)+'">Edit</button><button type="button" class="danger" data-delete-material="'+esc(m.id)+'">Delete</button></div></article>';
  }).join('');
 }
 renderPrinters();syncWorkshopUsage();
}
function renderPrinters(){
 const list=document.getElementById('ppWorkshopPrintersList');if(!list)return;
 const printers=readPrinters().sort((a,b)=>String(a.name||'').localeCompare(String(b.name||'')));
 const count=document.getElementById('ppPrinterCount');if(count)count.textContent=printers.length+' saved '+(printers.length===1?'printer':'printers');
 if(!printers.length){list.innerHTML='<div class="pp-materials-empty"><div class="pp-materials-empty-icon">▱</div><h3>No printers saved yet</h3><p>Add the printers you own so their power and depreciation details are ready to use.</p><button type="button" class="pp-material-new" data-printer-new>＋ Add Printer</button></div>';return;}
 list.innerHTML=printers.map(p=>'<article class="pp-material-card pp-printer-card" data-printer-id="'+esc(p.id)+'"><div class="pp-material-main"><div class="pp-printer-dot"></div><div><h3>'+esc(p.name)+'</h3><p>'+amountText(p.watts)+' W · '+moneyFromGBP(p.price)+' purchase price · '+amountText(p.lifetime)+' expected hours</p><small>'+esc(p.materialType||'Filament')+' printer profile</small></div></div><div class="pp-material-actions"><button type="button" data-printer-use="'+esc(p.id)+'">Use</button><button type="button" data-printer-edit="'+esc(p.id)+'">Edit</button><button type="button" class="danger" data-printer-delete="'+esc(p.id)+'">Delete</button></div></article>').join('');
}
function setWorkshopTab(name){
 const materials=name!=='printers',matView=document.getElementById('ppWorkshopMaterialsView'),printerView=document.getElementById('ppWorkshopPrintersView');
 if(matView)matView.hidden=!materials;if(printerView)printerView.hidden=materials;
 document.querySelectorAll('[data-workshop-tab]').forEach(button=>{const active=button.dataset.workshopTab===(materials?'materials':'printers');button.setAttribute('aria-selected',String(active));button.classList.toggle('active',active)});
}
function syncWorkshopUsage(){
 const tabs=document.getElementById('resultTabs');if(!tabs)return;
 let card=document.getElementById('ppWorkshopUsage');
 if(!card){card=document.createElement('section');card.id='ppWorkshopUsage';card.className='pp-workshop-usage';card.innerHTML='<div class="pp-workshop-usage-copy"><span>MY WORKSHOP</span><strong id="ppWorkshopUsageTitle">Material inventory</strong><p id="ppWorkshopUsageText">Choose a saved spool or resin bottle to track stock for this print.</p></div><div class="pp-workshop-usage-actions"><button type="button" class="pp-workshop-open" data-material-open>My Workshop</button><button type="button" class="pp-workshop-mark" data-mark-printed disabled>Mark as printed</button></div>';tabs.insertAdjacentElement('afterend',card)}
 const title=document.getElementById('ppWorkshopUsageTitle'),text=document.getElementById('ppWorkshopUsageText'),mark=card.querySelector('[data-mark-printed]'),openButton=card.querySelector('[data-material-open]');
 const material=selectedMaterialId?read().find(item=>String(item.id)===String(selectedMaterialId)):null;
 if(!material){if(title)title.textContent='Material inventory';if(text)text.textContent='Choose a saved spool or resin bottle to track stock for this print.';if(mark){mark.disabled=true;mark.hidden=true}if(openButton)openButton.hidden=false;return}
 if(openButton)openButton.hidden=true;
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
 const options=source?[...source.options].filter(option=>option.value&&option.value!=='custom'):[];
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
 const source=document.getElementById('printer'),current=source?.value||'',preset=current&&current!=='custom'?current:'';
 form.dataset.editId=existing?.id||'';
 populatePrinterPresets(existing?.presetValue||preset);
 document.getElementById('ppWorkshopPrinterName').value=existing?.name||'';
 document.getElementById('ppWorkshopPrinterWatts').value=existing?.watts??0;
 document.getElementById('ppWorkshopPrinterPrice').value=existing?currentMoneyValue(existing.price??0).toFixed(2):0;
 document.getElementById('ppWorkshopPrinterLife').value=existing?.lifetime??0;
 document.getElementById('ppWorkshopPrinterType').value=existing?.materialType||(document.getElementById('materialType')?.value==='resin'?'Resin':'Filament');
 if(!existing&&preset)fillPrinterFromPreset();
 else if(!existing&&current==='custom'){
  document.getElementById('ppWorkshopPrinterWatts').value=Number(val('customPrinterPower'))||0;
  document.getElementById('ppWorkshopPrinterPrice').value=Number(val('customPrinterPrice'))||0;
  document.getElementById('ppWorkshopPrinterLife').value=Number(val('customPrinterLife'))||0;
 }
 document.getElementById('ppWorkshopPrinterFormTitle').textContent=existing?'Edit printer profile':'Add a printer';
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
 closePrinterForm();renderPrinters();
}
function usePrinter(id){
 const profile=readPrinters().find(item=>String(item.id)===String(id)),printer=document.getElementById('printer');if(!profile||!printer)return;
 applyingMaterial=true;printer.value='custom';printer.dispatchEvent(new Event('change',{bubbles:true}));
 const values=[['customPrinterPrice',currentMoneyValue(profile.price)],['customPrinterPower',profile.watts],['customPrinterLife',profile.lifetime]];
 values.forEach(([field,value])=>{const input=document.getElementById(field);if(input){input.value=value;input.dispatchEvent(new Event('input',{bubbles:true}))}});
 const type=document.getElementById('materialType');if(type){type.value=profile.materialType==='Resin'?'resin':'filament';type.dispatchEvent(new Event('change',{bubbles:true}))}
 applyingMaterial=false;selectedMaterialId='';syncWorkshopUsage();
 const hint=document.getElementById('ppPrinterDetailsHint');if(hint)hint.textContent='Using My Workshop profile: '+profile.name+'.';
 document.getElementById('calc')?.click();document.getElementById('ppMaterialsPanel')?.classList.remove('open');document.body.style.overflow='';
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
 if(low)low.textContent='Low-stock alert ('+unit+')';
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
 form.dataset.editId='';
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
 document.getElementById('ppMaterialFormPanel').classList.add('open');
}
function openForm(existing){
 const form=document.getElementById('ppMaterialForm');if(!form)return;
 form.dataset.editId=existing?.id||'';
 document.getElementById('ppMatName').value=existing?.name||'';
 document.getElementById('ppMatType').value=existing?.type||'Filament';
 syncBrandOptions(existing?.brand||'');
 document.getElementById('ppMatColour').value=existing?.colour||'';
 document.getElementById('ppMatAmount').value=existing?.amount??1000;
 document.getElementById('ppMatRemaining').value=existing?.remaining??existing?.amount??1000;
 document.getElementById('ppMatLowStock').value=existing?.lowStock??(existing?.type==='Resin'?50:200);
 document.getElementById('ppMatCost').value=currentMoneyValue(existing?.cost??20).toFixed(2);
 updateMaterialFormLabels();
 document.getElementById('ppMaterialFormTitle').textContent=existing?'Edit Material':'Add Material';
 document.getElementById('ppMaterialFormPanel').classList.add('open');
}function closeForm(){document.getElementById('ppMaterialFormPanel')?.classList.remove('open')}
function saveForm(){
 const name=document.getElementById('ppMatName').value.trim(),type=document.getElementById('ppMatType').value;
 const amount=Number(document.getElementById('ppMatAmount').value)||0,cost=Number(document.getElementById('ppMatCost').value)||0;
 const remaining=Number(document.getElementById('ppMatRemaining').value),lowStock=Number(document.getElementById('ppMatLowStock').value)||0;
 if(!name){alert('Please enter a material name.');return}
 if(amount<=0){alert('Please enter a package amount greater than 0.');return}
 if(!Number.isFinite(remaining)||remaining<0){alert('Remaining stock cannot be negative.');return}
 if(lowStock<0){alert('The low-stock alert cannot be negative.');return}
 const brandSelect=document.getElementById('ppMatBrand'),brandCustom=document.getElementById('ppMatBrandCustom'),brand=(brandSelect?.value==='__other__'?(brandCustom?.value||''):brandSelect?.value||'').trim(),colour=document.getElementById('ppMatColour').value.trim();
 const costGBP=toGBP(cost),unitCost=moneyFromGBP(costGBP/amount)+' / '+(type==='Resin'?'ml':'g'),items=read(),id=document.getElementById('ppMaterialForm').dataset.editId;
 const obj={id:id||((crypto.randomUUID&&crypto.randomUUID())||String(Date.now())),name,type,brand,colour,amount,remaining,lowStock,cost:costGBP,unitCost,updated:Date.now()};
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
 document.getElementById('ppMaterialsPanel')?.classList.remove('open');document.body.style.overflow='';
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
function open(){
 let panel=document.getElementById('ppMaterialsPanel');
 if(!panel){
  panel=document.createElement('div');panel.id='ppMaterialsPanel';
  panel.innerHTML=`<div class="pp-materials-backdrop" data-material-close></div><section class="pp-materials-dialog" role="dialog" aria-modal="true" aria-labelledby="ppMaterialsTitle">
  <header class="pp-materials-head"><div><div class="pp-materials-kicker">PRINTPROFIT</div><h2 id="ppMaterialsTitle">My Workshop</h2><p>Keep printer profiles and material stock ready for your next print. Saved in this browser.</p></div><button type="button" class="pp-materials-close" data-material-close>×</button></header>
  <div class="pp-workshop-tabs" role="tablist" aria-label="Workshop library"><button type="button" class="active" data-workshop-tab="materials" aria-selected="true">Materials &amp; stock</button><button type="button" data-workshop-tab="printers" aria-selected="false">Printers</button></div>
  <div id="ppWorkshopMaterialsView"><div class="pp-materials-toolbar"><button type="button" class="pp-material-new" data-material-new>＋ Add Material</button><span id="ppMaterialCount"></span></div><div id="ppMaterialsList"></div></div>
  <div id="ppWorkshopPrintersView" hidden><div class="pp-materials-toolbar"><button type="button" class="pp-material-new" data-printer-new>＋ Add Printer</button><span id="ppPrinterCount"></span></div>
   <form id="ppWorkshopPrinterForm" class="pp-workshop-printer-form" onsubmit="return false" hidden><div class="pp-workshop-printer-form-head"><strong id="ppWorkshopPrinterFormTitle">Add a printer</strong><button type="button" class="pp-materials-close" data-printer-form-close aria-label="Close printer form">×</button></div><div class="pp-workshop-printer-form-grid">
    <label>Printer name<input id="ppWorkshopPrinterName" placeholder="e.g. Elegoo Neptune 4"></label><label>Start from a printer preset<select id="ppWorkshopPrinterPreset"><option value="">Custom printer details</option></select></label>
    <label>Power draw (W)<input id="ppWorkshopPrinterWatts" type="number" min="0" step="1" value="0"></label><label>Purchase price (£)<input id="ppWorkshopPrinterPrice" type="number" min="0" step=".01" value="0"></label>
    <label>Expected life (hours)<input id="ppWorkshopPrinterLife" type="number" min="0" step="1" value="4000"></label><label>Material type<select id="ppWorkshopPrinterType"><option>Filament</option><option>Resin</option></select></label>
   </div><div class="pp-workshop-printer-form-actions"><button type="button" class="pp-material-cancel" data-printer-form-close>Cancel</button><button type="button" class="pp-material-save" data-printer-save>Save Printer</button></div></form><div id="ppWorkshopPrintersList"></div>
  </div></section>
  <div id="ppMaterialFormPanel"><div class="pp-material-form-backdrop" data-material-form-close></div><form id="ppMaterialForm" class="pp-material-form" onsubmit="return false"><div class="pp-material-form-head"><div><div class="pp-materials-kicker">MATERIAL LIBRARY</div><h2 id="ppMaterialFormTitle">Add Material</h2></div><button type="button" class="pp-materials-close" data-material-form-close>×</button></div>
  <div class="pp-material-form-grid"><label>Material name<input id="ppMatName" placeholder="e.g. eSUN PLA+ Black"></label><label>Type<select id="ppMatType"><option>Filament</option><option>Resin</option></select></label><label>Brand<select id="ppMatBrand"><option value="">Select a brand...</option><option value="__other__">Other / Custom</option></select><input id="ppMatBrandCustom" class="pp-brand-custom" placeholder="Enter brand name" style="display:none" aria-label="Custom brand name"></label><label>Colour<input id="ppMatColour" placeholder="Optional"></label><label><span id="ppMatAmountLabel">Spool weight (g)</span><input id="ppMatAmount" type="number" min="0" step=".01" value="1000"></label><label><span id="ppMatRemainingLabel">Remaining stock (g)</span><input id="ppMatRemaining" type="number" min="0" step=".01" value="1000"></label><label><span id="ppMatLowStockLabel">Low-stock alert (g)</span><input id="ppMatLowStock" type="number" min="0" step=".01" value="200"></label><label><span id="ppMatCostLabel">Package cost (£)</span><input id="ppMatCost" type="number" min="0" step=".01" value="20"></label></div>
  <div class="pp-material-form-actions"><button type="button" class="pp-material-cancel" data-material-form-close>Cancel</button><button type="button" class="pp-material-save" data-material-save>Save Material</button></div></form></div>`;
  document.body.appendChild(panel);
  const style=document.createElement('style');style.textContent=`
#ppMaterialsPanel{display:none;position:fixed;inset:0;z-index:100001}#ppMaterialsPanel.open{display:block}.pp-materials-backdrop{position:absolute;inset:0;background:#000b;backdrop-filter:blur(5px)}
.pp-materials-dialog{position:relative;width:min(900px,calc(100% - 28px));max-height:calc(100vh - 40px);margin:20px auto;background:#081720;color:#edf3f6;border:1px solid #294957;border-radius:20px;box-shadow:0 25px 80px #000d;overflow:auto;font-family:Inter,Segoe UI,system-ui,sans-serif}
.pp-materials-head{display:flex;justify-content:space-between;gap:20px;padding:25px 28px 20px;border-bottom:1px solid #294957;background:linear-gradient(145deg,#0b202b,#07141d)}.pp-materials-kicker{font-size:10px;font-weight:900;letter-spacing:.18em;color:#ff7800}.pp-materials-head h2{margin:5px 0;font-size:30px}.pp-materials-head p{margin:0;color:#9fb0b9}.pp-materials-close{width:38px;height:38px;border:1px solid #355363;border-radius:10px;background:#091923;color:#fff;font-size:26px;cursor:pointer}
.pp-materials-toolbar{display:flex;justify-content:space-between;align-items:center;padding:18px 28px 8px;color:#9fb0b9;font-size:12px}.pp-material-new,.pp-material-save{border:1px solid #ff7800;background:#ff7800;color:#fff;border-radius:9px;padding:10px 15px;font-weight:800;cursor:pointer}.pp-materials-dialog>#ppWorkshopMaterialsView,#ppWorkshopPrintersView{padding-bottom:18px}#ppMaterialsList,#ppWorkshopPrintersList{padding:10px 28px 28px}
.pp-material-card{display:flex;justify-content:space-between;align-items:center;gap:18px;padding:17px;margin-top:10px;border:1px solid #294957;border-radius:14px;background:#0b202b}.pp-material-main{display:flex;align-items:center;gap:14px;min-width:0}.pp-material-dot,.pp-printer-dot{width:14px;height:14px;flex:0 0 14px;border-radius:50%;background:#ff7800;box-shadow:0 0 15px #ff780066}.pp-printer-dot{background:#35d6e5;box-shadow:0 0 15px #35d6e566}.pp-material-card h3{margin:0 0 4px;font-size:16px}.pp-material-card p{margin:0;color:#c5d1d7;font-size:12px}.pp-material-card small{display:block;color:#93a8b2;margin-top:5px}.pp-material-actions{display:flex;gap:7px;flex-wrap:wrap}.pp-material-actions button,.pp-material-cancel{border:1px solid #355363;background:#091923;color:#e6eef2;border-radius:8px;padding:8px 10px;cursor:pointer;font-weight:700}.pp-material-actions button:hover{border-color:#ff7800}.pp-material-actions .danger:hover{border-color:#d9534f;color:#ff9a96}.pp-stock-low{display:inline-block;margin-left:7px;padding:3px 7px;border:1px solid #e8a44377;border-radius:999px;color:#ffd094;font-size:10px;vertical-align:middle}.pp-materials-empty{text-align:center;padding:55px 20px;color:#9fb0b9}.pp-materials-empty-icon{font-size:38px;color:#ff7800}.pp-materials-empty h3{color:#edf3f6;margin:10px 0 5px}.pp-materials-empty p{margin:0 0 20px}
.pp-workshop-tabs{display:flex;gap:8px;padding:16px 28px 0}.pp-workshop-tabs button{border:1px solid #355363;border-radius:10px 10px 0 0;background:#0a1b25;color:#aebdc6;padding:10px 14px;font-weight:800;cursor:pointer}.pp-workshop-tabs button.active{background:#143140;color:#f5f9fb;border-color:#35d6e5}
.pp-workshop-printer-form{margin:12px 28px;padding:16px;border:1px solid #355363;border-radius:14px;background:#0a1b25}.pp-workshop-printer-form-head{display:flex;justify-content:space-between;align-items:center;margin-bottom:12px}.pp-workshop-printer-form-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px}.pp-workshop-printer-form-grid label{font-size:12px;color:#aebdc6}.pp-workshop-printer-form-grid input,.pp-workshop-printer-form-grid select{display:block;width:100%;margin-top:6px;padding:10px;border:1px solid #355363;border-radius:8px;background:#081720;color:#f5f9fb}.pp-workshop-printer-form-actions{display:flex;justify-content:flex-end;gap:8px;margin-top:14px}
.pp-material-form-grid{grid-template-columns:1fr 1fr 1fr}.pp-material-form-grid input,.pp-material-form-grid select{font-size:14px}.pp-material-form{max-height:calc(100vh - 40px);overflow:auto}
.pp-workshop-usage{display:flex;align-items:center;justify-content:space-between;gap:14px;margin:14px 0;padding:15px;border:1px solid #315767;border-left:4px solid #ff8a24;border-radius:12px;background:linear-gradient(145deg,#0d2230,#102a39);color:#f5f9fb}.pp-workshop-usage-copy{min-width:0}.pp-workshop-usage-copy>span{display:block;color:#ffae62;font-size:9px;font-weight:900;letter-spacing:.15em}.pp-workshop-usage-copy strong{display:block;margin-top:4px;font-size:14px}.pp-workshop-usage-copy p{margin:4px 0 0;color:#bfd0d7;font-size:12px;line-height:1.4}.pp-workshop-usage-actions{display:flex;gap:8px;flex-wrap:wrap}.pp-workshop-usage-actions button{border:1px solid #486775;border-radius:9px;padding:9px 11px;background:#091923;color:#e6eef2;font-weight:800;cursor:pointer}.pp-workshop-usage-actions .pp-workshop-mark{background:#0d986b;border-color:#10b981;color:#fff}.pp-workshop-usage-actions button:disabled{opacity:.48;cursor:not-allowed}
@media(max-width:650px){.pp-materials-dialog{margin:10px auto;max-height:calc(100vh - 20px)}.pp-materials-head,.pp-materials-toolbar,#ppMaterialsList,#ppWorkshopPrintersList{padding-left:20px;padding-right:20px}.pp-material-card{flex-direction:column;align-items:flex-start}.pp-material-actions{width:100%}.pp-material-actions button{flex:1}.pp-material-form-grid,.pp-workshop-printer-form-grid{grid-template-columns:1fr}.pp-workshop-printer-form{margin-left:20px;margin-right:20px}.pp-workshop-tabs{padding-left:20px;padding-right:20px}.pp-workshop-usage{align-items:flex-start;flex-direction:column}.pp-workshop-usage-actions,.pp-workshop-usage-actions button{width:100%}}
`;document.head.appendChild(style);
 }
 refreshCurrencyUI();panel.classList.add('open');document.body.style.overflow='hidden';setWorkshopTab('materials');render();const c=document.getElementById('ppMaterialCount');if(c){const n=read().length;c.textContent=n+' saved '+(n===1?'material':'materials')}
}function ensureButton(){ /* Material controls are intentionally kept out of Box 3. */ }

document.addEventListener('click',e=>{
 const t=e.target.closest('[data-material-open],[data-material-save-current],[data-material-close],[data-material-new],[data-material-save],[data-material-form-close],[data-use-material],[data-edit-material],[data-delete-material],[data-workshop-tab],[data-printer-new],[data-printer-form-close],[data-printer-save],[data-printer-use],[data-printer-edit],[data-printer-delete],[data-mark-printed]');
 if(!t)return;
 if(t.hasAttribute('data-material-open')){e.preventDefault();open()}
 else if(t.hasAttribute('data-material-save-current')){e.preventDefault();open();openFormFromCalculator()}
 else if(t.hasAttribute('data-material-close')){document.getElementById('ppMaterialsPanel')?.classList.remove('open');document.body.style.overflow=''}
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
document.addEventListener('change',e=>{if(['materialUsed','qty'].includes(e.target?.id))syncWorkshopUsage()});
document.addEventListener('keydown',e=>{if(e.key==='Escape'){document.getElementById('ppMaterialFormPanel')?.classList.remove('open');document.getElementById('ppMaterialsPanel')?.classList.remove('open');closePrinterForm();document.body.style.overflow=''}});
// Box 3 remains clean; the Material Library can be surfaced elsewhere.
})();