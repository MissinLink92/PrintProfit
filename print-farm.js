(()=>{
'use strict';
if(window.__ppPrintFarm)return;window.__ppPrintFarm=true;
const $=id=>document.getElementById(id),MAX=10;
let groups=[],nextId=1,restoring=false,lastSummary='',configured=false,quantityInput;
const el=(tag,text,cls)=>{const n=document.createElement(tag);if(text!==undefined)n.textContent=text;if(cls)n.className=cls;return n;};
const number=id=>Number($(id)?.value)||0;
const materialType=()=>$('materialType')?.value||'filament';
const money=value=>window.__ppMoney?window.__ppMoney(value):new Intl.NumberFormat('en-GB',{style:'currency',currency:'GBP'}).format(value);
function profile(value){
 const option=[...($('printer')?.options||[])].find(o=>o.value===value);
 if(value==='custom')return{watts:number('customPrinterPower'),price:number('customPrinterPrice'),lifetime:number('customPrinterLife'),materialType:materialType()};
 if(value.startsWith('workshop:'))return{watts:Number(option?.dataset.watts)||0,price:Number(option?.dataset.price)||0,lifetime:Number(option?.dataset.lifetime)||0,materialType:option?.dataset.materialType||'filament'};
 const p=value.split(/[|,]/);return{watts:Number(p[0])||0,price:Number(p[1])||0,lifetime:Number(p[2])||0,materialType:option?.dataset.materialType||'filament'};
}
function fresh(){const printer=$('printer')?.value||'';return{id:nextId++,printer,machines:1,perBuild:1,hours:number('printHours'),...profile(printer)};}
function saved(){return JSON.stringify({version:1,groups});}
function persist(){const field=$('ppFarmConfiguration');if(field)field.value=saved();}
function changed(){persist();if(restoring)return;$('ppFarmConfiguration')?.dispatchEvent(new Event('input',{bubbles:true}));$('calc')?.click();}
function field(row,g,name,label,step,min,max){
 const wrap=el('label',label),input=el('input');input.type='number';input.value=g[name];input.step=step;input.min=min;if(max!==undefined)input.max=max;input.dataset.farmField=name;
 input.addEventListener('input',()=>{g[name]=input.value===''?'':Number(input.value);changed();});wrap.append(input);row.append(wrap);
}
function render(){
 const list=$('ppFarmGroups');if(!list)return;list.replaceChildren();
 groups.forEach((g,index)=>{
  const card=el('fieldset',undefined,'pp-farm-group');card.append(el('legend','Printer group '+(index+1)));
  const grid=el('div',undefined,'pp-farm-grid'),label=el('label','Printer model'),select=el('select');select.dataset.farmField='printer';
  select.append(new Option('Choose a printer…',''));
  [...($('printer')?.options||[])].filter(o=>o.value&&((o.dataset.materialType||'filament')===materialType()||o.value==='custom')).forEach(o=>select.append(new Option(o.textContent,o.value)));
  if(g.printer&&![...select.options].some(o=>o.value===g.printer)){const opt=new Option('Saved printer (review profile)',g.printer);select.append(opt);}
  select.value=g.printer;
  select.addEventListener('change',()=>{g.printer=select.value;Object.assign(g,profile(select.value));render();changed();});label.append(select);grid.append(label);
  field(grid,g,'machines','How many printers?','1',1,10000);
  field(grid,g,'perBuild','Products per printer per build','1',1,10000);
  field(grid,g,'hours','Time per build (hours)','0.01',0.01,10000);
  field(grid,g,'watts','Average power per printer (W)','1',1,100000);
  field(grid,g,'price','Purchase cost per printer (£)','0.01',0);
  field(grid,g,'lifetime','Lifetime per printer (hours)','1',0);
  card.append(grid);
  if(groups.length>1){const remove=el('button','Remove group','pp-farm-remove');remove.type='button';remove.addEventListener('click',()=>{groups=groups.filter(r=>r!==g);render();changed();});card.append(remove);}
  list.append(card);
 });
 $('ppFarmAdd').disabled=groups.length>=MAX;persist();
}
function updateVisibility(){const enabled=!!$('ppFarmEnabled')?.checked;$('ppFarmDetails').hidden=!enabled;if(!enabled)delete document.body.dataset.ppFarmInvalid;}
function showSummary(result,error){
 const key=JSON.stringify([result,error,number('electricityRate')]);if(key===lastSummary)return;lastSummary=key;
 const status=$('ppFarmSummary'),resultStatus=$('ppFarmResultStatus');if(!status)return;
 if(error){status.textContent=error;if(resultStatus){resultStatus.hidden=false;resultStatus.textContent='Production run incomplete: '+error;}document.body.dataset.ppFarmInvalid='true';return;}
 delete document.body.dataset.ppFarmInvalid;if(resultStatus)resultStatus.hidden=!result;
 if(!result){status.textContent='';return;}
 const rate=number('electricityRate');const summary=result.quantity+' products • '+result.builds+' builds • '+result.printerHours.toFixed(2)+' printer-hours • approximately '+result.elapsedHours.toFixed(2)+' hours elapsed • '+result.kWh.toFixed(3)+' kWh';
 status.replaceChildren(el('p',summary));
 const table=el('table');const head=el('tr');['Group','Products','Builds','Energy (kWh)'].forEach(t=>head.append(el('th',t)));const thead=el('thead');thead.append(head);table.append(thead);const body=el('tbody');
 result.allocations.forEach((g,i)=>{const tr=el('tr');[i+1,g.products,g.builds,g.kWh.toFixed(3)].forEach(t=>tr.append(el('td',String(t))));body.append(tr);});table.append(body);status.append(table,el('p','Electricity for the run: '+money(result.kWh*rate)+'. Depreciation for the run: '+money(result.depreciation)+'.'));
 if(resultStatus)resultStatus.textContent=summary+'. Costs below use the run’s average cost per product.';
}
window.__ppFarmCosts=quantity=>{
 if(!$('ppFarmEnabled')?.checked){showSummary(null);return null;}
 updateVisibility();
 if(quantityInput&&document.activeElement!==quantityInput)quantityInput.value=String(quantity);
 try{
  if(groups.some(g=>g.materialType!==materialType()))throw new Error('All groups must use the selected material workflow. Calculate filament and resin runs separately.');
  const result=window.PrintProfitFarmMath.plan(Number($('qty')?.value),groups);showSummary(result);return{valid:true,powerUsed:result.powerPerItem,depreciation:result.depreciationPerItem,plan:result};
 }catch(e){showSummary(null,e.message);return{valid:false,powerUsed:0,depreciation:0};}
};
window.__ppRestoreFarm=fields=>{
 if(!$('ppFarmConfiguration'))return;
 restoring=true;
 try{
  const raw=fields?.ppFarmConfiguration?.value;const data=raw?JSON.parse(raw):null;
  groups=data?.version===1&&Array.isArray(data.groups)&&data.groups.length?data.groups.slice(0,MAX).map(g=>({...g,id:nextId++})): [fresh()];
  configured=!!data; $('ppFarmEnabled').checked=fields?.ppFarmEnabled?.checked===true;render();updateVisibility();
 }catch(e){groups=[fresh()];$('ppFarmEnabled').checked=false;render();updateVisibility();}finally{restoring=false;}
};
function mount(){
 const setup=document.querySelector('.print-setup-panel');if(!setup||!$('printer')||!window.PrintProfitFarmMath)return;
 const css=el('style');css.textContent=`.pp-farm{margin:12px 0;padding:14px;border:1px solid var(--line);border-radius:12px;background:var(--panel2);color:var(--text)}.pp-farm-toggle{display:flex!important;align-items:center;gap:10px;font-size:15px!important;font-weight:700}.pp-farm-toggle input{width:20px!important;height:20px!important;flex:0 0 20px}.pp-farm p{font-size:13px;line-height:1.5;white-space:normal}.pp-farm [hidden]{display:none!important}.pp-farm-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}.pp-farm-grid label{display:block!important;font-size:13px!important;min-width:0}.pp-farm-grid input,.pp-farm-grid select{display:block;width:100%;box-sizing:border-box;margin-top:5px}.pp-farm-group{min-width:0;border:1px solid var(--line);border-radius:9px;margin:12px 0;padding:12px}.pp-farm-group legend{font-weight:700;padding:0 5px}.pp-farm button{margin-top:10px;padding:9px 12px;cursor:pointer;border:1px solid var(--line);border-radius:7px;background:var(--panel);color:var(--text)}.pp-farm-summary{overflow-x:auto}.pp-farm table{width:100%;border-collapse:collapse;font-size:13px}.pp-farm th,.pp-farm td{padding:7px;text-align:left;border-bottom:1px solid var(--line)}.pp-farm-result-status{padding:12px;margin:10px 0;border:1px solid var(--line);border-radius:8px;font-size:13px;line-height:1.5}body[data-pp-farm-invalid] #singleResultView,body[data-pp-farm-invalid] #batchResultView,body[data-pp-farm-invalid] #ppProfitAdvisor,body[data-pp-farm-invalid] #ppProfitTools{display:none!important}@media(max-width:600px){.pp-farm-grid{grid-template-columns:1fr}}`;
 document.head.append(css);
 const panel=el('section',undefined,'pp-farm');panel.id='ppPrintFarm';const toggle=el('label',undefined,'pp-farm-toggle'),check=el('input');check.id='ppFarmEnabled';check.type='checkbox';toggle.append(check,document.createTextNode('Print farm / production run'));panel.append(toggle,el('p','Optional: use several printers or print multiple products on each build plate. Your normal single-printer settings stay available.'));
 const config=el('input');config.type='hidden';config.id='ppFarmConfiguration';panel.append(config);
 const details=el('div');details.id='ppFarmDetails';details.hidden=true;
 details.append(el('p','Use Quantity in Costs & Fees for the total number of products. Material usage, hands-on labour, packaging and other costs remain per product. Enter actual slicer time for a full build plate in each group. All groups use your existing electricity rate.'));
 const quantityLabel=el('label','Total products in run');quantityInput=el('input');quantityInput.type='number';quantityInput.min='1';quantityInput.max='10000000';quantityInput.step='1';quantityInput.value=String(number('qty')||1);quantityInput.addEventListener('input',()=>{const qty=$('qty');if(qty){qty.value=quantityInput.value;qty.dispatchEvent(new Event('input',{bubbles:true}));}changed();});quantityLabel.append(quantityInput);details.append(quantityLabel);
 const list=el('div');list.id='ppFarmGroups';details.append(list);
 const add=el('button','Add another printer group');add.id='ppFarmAdd';add.type='button';add.addEventListener('click',()=>{if(groups.length<MAX){groups.push(fresh());render();changed();}});details.append(add);
 details.append(el('p','Allocation follows group order and plate capacity, not fastest-printer optimisation. Groups start together; elapsed time excludes cooling, unloading, changeovers and downtime. A partly filled final build uses the full entered build time. Use the same material and units throughout; calculate resin and filament separately.'));
 const summary=el('div',undefined,'pp-farm-summary');summary.id='ppFarmSummary';summary.setAttribute('aria-live','polite');details.append(summary);panel.append(details);setup.append(panel);
 const result=el('div',undefined,'pp-farm-result-status');result.id='ppFarmResultStatus';result.hidden=true;result.setAttribute('role','status');document.querySelector('.result')?.prepend(result);
 groups=[fresh()];render();check.addEventListener('change',()=>{if(check.checked&&!configured){groups=[fresh()];configured=true;render();}updateVisibility();changed();});
 $('materialType')?.addEventListener('change',()=>{render();changed();});
}
mount();
})();
