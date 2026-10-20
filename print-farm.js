(()=>{
'use strict';
if(window.__ppPrintFarm)return;window.__ppPrintFarm=true;
const $=id=>document.getElementById(id),MAX=10;
let allowances={failurePercent:0,downtimePercent:0,changeoverMinutes:0};
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
function saved(){return JSON.stringify({version:1,groups,allowances});}
function persist(){const field=$('ppFarmConfiguration');if(field)field.value=saved();}
function changed(){persist();if(restoring)return;$('ppFarmConfiguration')?.dispatchEvent(new Event('input',{bubbles:true}));$('calc')?.click();}
function field(row,g,name,label,step,min,max){
 const wrap=el('label',label),input=el('input');input.type='number';input.value=g[name];input.step=step;input.min=min;if(max!==undefined)input.max=max;input.dataset.farmField=name;
 input.addEventListener('input',()=>{g[name]=input.value===''?'':Number(input.value);changed();});wrap.append(input);row.append(wrap);
}
function syncPremiumInputs(){
 if(!window.PRINTPROFIT_BILLING_CONFIG?.enabled)return;
 const locked=window.__ppProTier!=='pro';
 document.querySelectorAll('#ppFarmDetails input,#ppFarmDetails select,#ppFarmDetails button').forEach(control=>{control.disabled=locked||(control.id==='ppFarmAdd'&&groups.length>=MAX);});
}
document.addEventListener?.('pp-pro-access-changed',syncPremiumInputs);
function render(){
 const list=$('ppFarmGroups');if(!list)return;list.replaceChildren();
 groups.forEach((g,index)=>{
  const card=el('fieldset',undefined,'pp-farm-group');card.append(el('legend','Printer group '+(index+1)));
  const grid=el('div',undefined,'pp-farm-grid'),label=el('label','Printer model'),select=el('select');select.dataset.farmField='printer';
  select.append(new Option('Choose a printer…',''));
  [...($('printer')?.options||[])].filter(o=>o.value&&((o.dataset.materialType||'filament')===materialType()||o.value==='custom')).forEach(o=>select.append(new Option(o.textContent,o.value)));
  if(g.printer&&![...select.options].some(o=>o.value===g.printer)){const opt=new Option('Saved printer (review profile)',g.printer);select.append(opt);}
  select.value=g.printer;
  select.addEventListener('change',()=>{g.printer=select.value;g.printerName=select.options[select.selectedIndex]?.textContent||'';Object.assign(g,profile(select.value));render();changed();});label.append(select);grid.append(label);
  field(grid,g,'machines','How many printers?','1',1,10000);
  field(grid,g,'perBuild','Products per printer per cycle','1',1,10000);
  field(grid,g,'hours','Time per cycle (hours)','0.01',0.01,10000);
  field(grid,g,'watts','Average power per printer (W)','1',1,100000);
  field(grid,g,'price','Purchase cost per printer (£)','0.01',0);
  field(grid,g,'lifetime','Lifetime per printer (hours)','1',0);
  card.append(grid);
  if(groups.length>1){const remove=el('button','Remove group','pp-farm-remove');remove.type='button';remove.addEventListener('click',()=>{groups=groups.filter(r=>r!==g);render();changed();});card.append(remove);}
  list.append(card);
 });
 $('ppFarmAdd').disabled=groups.length>=MAX;syncPremiumInputs();persist();
}
function updateVisibility(){const enabled=!!$('ppFarmEnabled')?.checked;$('ppFarmDetails').hidden=!enabled;if(!enabled)delete document.body.dataset.ppFarmInvalid;}
function showSummary(result,error){
 const key=JSON.stringify([result,error,number('electricityRate')]);if(key===lastSummary)return;lastSummary=key;
 const status=$('ppFarmSummary'),resultStatus=$('ppFarmResultStatus');if(!status)return;
 if(error){status.textContent=error;if(resultStatus){resultStatus.hidden=false;resultStatus.textContent='Production run incomplete: '+error;}document.body.dataset.ppFarmInvalid='true';return;}
 delete document.body.dataset.ppFarmInvalid;if(resultStatus)resultStatus.hidden=!result;
 if(!result){status.textContent='';return;}
 const duration=h=>{const m=Math.round(h*60);return Math.floor(m/60)+' h '+(m%60)+' min';};
 const printers=result.allocations.reduce((sum,g)=>sum+g.machines,0),active=result.allocations.reduce((sum,g)=>sum+Math.min(g.machines,g.builds),0);
 const rate=number('electricityRate');const summary=result.quantity+' products • '+printers+' printers • '+result.builds+' print cycles • approximately '+duration(result.elapsedHours)+' elapsed';
 status.replaceChildren(el('p',summary));
 status.append(el('p','One print cycle is one print job on one printer. Several printers can run cycles at the same time.'));
 const stats=(entries,parent)=>{const dl=el('dl',undefined,'pp-farm-stats');entries.forEach(([label,value])=>{const item=el('div');item.append(el('dt',label),el('dd',String(value)));dl.append(item);});parent.append(dl);};
 stats([['Planned attempts (including failures)',result.plannedProducts],['Failure allowance',result.failurePercent+'%'],['Changeover hands-on time',duration(result.changeoverHours)],['Downtime allowance',result.downtimePercent+'%'],['Printers used',active+' of '+printers],['Combined printer time',duration(result.printerHours)],['Total energy',result.kWh.toFixed(3)+' kWh'],['Electricity for the run',money(result.kWh*rate)],['Depreciation for the run',money(result.depreciation)]],status);
 result.allocations.forEach((g,i)=>{
  const card=el('section',undefined,'pp-farm-allocation');const name=g.printerName||[...($('printer')?.options||[])].find(o=>o.value===g.printer)?.textContent||'Custom printer';
  card.append(el('h3','Group '+(i+1)+' — '+name));
  const low=Math.floor(g.builds/g.machines),high=Math.ceil(g.builds/g.machines),partial=g.products%g.perBuild;
  stats([[result.failurePercent?'Planned product attempts':'Products to make',g.products],['Printers',g.machines],['Products per cycle',g.perBuild],['Time per cycle',duration(g.hours)],['Total print cycles',g.builds],['Cycles per printer',low===high?low:low+'–'+high],['Full cycles',Math.floor(g.products/g.perBuild)],['Final partial cycle',partial?partial+' of '+g.perBuild+' products':'None'],['Estimated finish',duration(g.elapsedHours)],['Energy',g.kWh.toFixed(3)+' kWh']],card);
  status.append(card);
 });
 if(resultStatus)resultStatus.textContent=summary+'. Costs below use the run’s average cost per product.';
}
window.__ppFarmCosts=quantity=>{
 if(!$('ppFarmEnabled')?.checked){showSummary(null);return null;}
 updateVisibility();
 if(quantityInput&&document.activeElement!==quantityInput)quantityInput.value=String(quantity);
 try{
  if(groups.some(g=>g.materialType!==materialType()))throw new Error('All groups must use the selected material workflow. Calculate filament and resin runs separately.');
  const result=window.PrintProfitFarmMath.plan(Number($('qty')?.value),groups,allowances);showSummary(result);return{valid:true,materialMultiplier:result.materialMultiplier,extraLabourHours:result.extraLabourHours,powerUsed:result.powerPerItem,depreciation:result.depreciationPerItem,plan:result};
 }catch(e){showSummary(null,e.message);return{valid:false,powerUsed:0,depreciation:0};}
};
window.__ppRestoreFarm=fields=>{
 if(!$('ppFarmConfiguration'))return;
 restoring=true;
 try{
  const raw=fields?.ppFarmConfiguration?.value;const data=raw?JSON.parse(raw):null;
  groups=data?.version===1&&Array.isArray(data.groups)&&data.groups.length?data.groups.slice(0,MAX).map(g=>({...g,id:nextId++})): [fresh()];
  allowances={failurePercent:0,downtimePercent:0,changeoverMinutes:0,...(data?.allowances||{})};
  document.querySelectorAll?.('[data-farm-allowance]').forEach(input=>input.value=String(allowances[input.dataset.farmAllowance]??0));
  configured=!!data; $('ppFarmEnabled').checked=fields?.ppFarmEnabled?.checked===true;render();updateVisibility();
 }catch(e){groups=[fresh()];$('ppFarmEnabled').checked=false;render();updateVisibility();}finally{restoring=false;}
};
function mount(){
 const setup=document.querySelector('.print-setup-panel');if(!setup||!$('printer')||!window.PrintProfitFarmMath)return;
 const css=el('style');css.textContent=`.pp-farm{margin:12px 0;padding:14px;border:1px solid var(--line);border-radius:12px;background:var(--panel2);color:var(--text)}.pp-farm-toggle{display:flex!important;align-items:center;gap:10px;font-size:15px!important;font-weight:700}.pp-farm-toggle input{width:20px!important;height:20px!important;flex:0 0 20px}.pp-farm p{font-size:13px;line-height:1.5;white-space:normal}.pp-farm [hidden]{display:none!important}.pp-farm-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}.pp-farm-grid label{display:block!important;font-size:13px!important;min-width:0}.pp-farm-grid input,.pp-farm-grid select{display:block;width:100%;box-sizing:border-box;margin-top:5px}.pp-farm-group{min-width:0;border:1px solid var(--line);border-radius:9px;margin:12px 0;padding:12px}.pp-farm-group legend{font-weight:700;padding:0 5px}.pp-farm button{margin-top:10px;padding:9px 12px;cursor:pointer;border:1px solid var(--line);border-radius:7px;background:var(--panel);color:var(--text)}.pp-farm-summary{overflow-wrap:anywhere}.pp-farm-stats{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:9px;margin:10px 0}.pp-farm-stats>div{min-width:0;padding:9px;border:1px solid var(--line);border-radius:7px}.pp-farm-stats dt{font-size:12px;color:var(--muted);margin-bottom:5px}.pp-farm-stats dd{margin:0;font-size:14px;font-weight:600}.pp-farm-allocation{padding-top:10px;margin-top:12px;border-top:1px solid var(--line)}.pp-farm-allocation h3{font-size:15px;line-height:1.4}.pp-farm table{width:100%;border-collapse:collapse;font-size:13px}.pp-farm th,.pp-farm td{padding:7px;text-align:left;border-bottom:1px solid var(--line)}.pp-farm-result-status{padding:12px;margin:10px 0;border:1px solid var(--line);border-radius:8px;font-size:13px;line-height:1.5}body[data-pp-farm-invalid] #singleResultView,body[data-pp-farm-invalid] #batchResultView,body[data-pp-farm-invalid] #ppProfitAdvisor,body[data-pp-farm-invalid] #ppProfitTools{display:none!important}@media(max-width:600px){.pp-farm-grid{grid-template-columns:1fr}}`;
 document.head.append(css);
 const panel=el('section',undefined,'pp-farm');panel.id='ppPrintFarm';const toggle=el('label',undefined,'pp-farm-toggle'),check=el('input');check.id='ppFarmEnabled';check.type='checkbox';toggle.append(check,document.createTextNode('Print farm / production run'));panel.append(toggle,el('p',window.PRINTPROFIT_BILLING_CONFIG?.enabled?'Pro: plan several printers or multiple products per plate. Existing saved runs remain readable if Pro ends.':'Optional: use several printers or print multiple products on each build plate. Your normal single-printer settings stay available.'));
 const config=el('input');config.type='hidden';config.id='ppFarmConfiguration';panel.append(config);
 const details=el('div');details.id='ppFarmDetails';details.hidden=true;
 details.append(el('p','Use Quantity in Costs & Fees for the total number of products. Material usage, hands-on labour, packaging and other costs remain per product. Enter actual slicer time for a full plate (one print cycle) in each group. All groups use your existing electricity rate.'));
 const quantityLabel=el('label','Total products in run');quantityInput=el('input');quantityInput.type='number';quantityInput.min='1';quantityInput.max='10000000';quantityInput.step='1';quantityInput.value=String(number('qty')||1);quantityInput.addEventListener('input',()=>{const qty=$('qty');if(qty){qty.value=quantityInput.value;qty.dispatchEvent(new Event('input',{bubbles:true}));}changed();});quantityLabel.append(quantityInput);details.append(quantityLabel);
 const allowanceGrid=el('div',undefined,'pp-farm-grid');
 for(const [key,label,max] of [['failurePercent','Expected failed prints (%)',50],['downtimePercent','Unavailable / downtime (%)',90],['changeoverMinutes','Hands-on changeover minutes between cycles',1440]]){
  const wrap=el('label',label),input=el('input');input.type='number';input.min='0';input.max=String(max);input.step='0.1';input.value='0';input.dataset.farmAllowance=key;input.addEventListener('input',()=>{allowances[key]=input.value===''?0:Number(input.value);changed();});wrap.append(input);allowanceGrid.append(wrap);
 }
 details.append(allowanceGrid,el('p','Failure allowance estimates extra full attempts, including material and per-product hands-on labour. Changeover adds labour at your existing hourly rate and extends completion time. Downtime extends elapsed time only; idle electricity and wear are excluded. Packaging and delivery apply to the requested good products.'));
 const list=el('div');list.id='ppFarmGroups';details.append(list);
 const add=el('button','Add another printer group');add.id='ppFarmAdd';add.type='button';add.addEventListener('click',()=>{if(groups.length<MAX){groups.push(fresh());render();changed();}});details.append(add);
 details.append(el('p','Allocation follows group order and plate capacity, not fastest-printer optimisation. Groups start together; elapsed time excludes cooling and other unentered delays. Changeovers and downtime use the allowances above. A partly filled final cycle uses the full entered cycle time. Use the same material and units throughout; calculate resin and filament separately.'));
 const summary=el('div',undefined,'pp-farm-summary');summary.id='ppFarmSummary';summary.setAttribute('aria-live','polite');details.append(summary);panel.append(details);setup.append(panel);
 const result=el('div',undefined,'pp-farm-result-status');result.id='ppFarmResultStatus';result.hidden=true;result.setAttribute('role','status');document.querySelector('.result')?.prepend(result);
 groups=[fresh()];render();check.addEventListener('change',()=>{if(check.checked&&!configured){groups=[fresh()];configured=true;render();}updateVisibility();changed();});
 $('materialType')?.addEventListener('change',()=>{render();changed();});
}
mount();
})();
