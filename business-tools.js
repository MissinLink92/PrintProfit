(()=>{
'use strict';
if(window.__ppBusinessTools)return;window.__ppBusinessTools=true;
const M=window.PrintProfitBusinessMath,$=id=>document.getElementById(id);
const el=(tag,text,cls)=>{const n=document.createElement(tag);if(text!==undefined)n.textContent=text;if(cls)n.className=cls;return n;};
let scenarios=[];
const current=()=>{if(!window.__ppBusinessSnapshot)throw new Error('Calculator is still loading.');const s=window.__ppBusinessSnapshot();for(const k of ['qty','batchCost','batchSales','batchProfit'])if(!Number.isFinite(s[k]))throw new Error('Complete the calculator before exporting.');return s;};
const currency=()=>{let p={};try{p=JSON.parse(localStorage.getItem('printprofit.preferences.v3')||'{}')}catch(e){}return{code:p.currency||'GBP',rate:Number(p.rate)>0?Number(p.rate):1};};
const money=n=>{const p=currency();return new Intl.NumberFormat(undefined,{style:'currency',currency:p.code}).format(n*p.rate);};
const error=message=>{$('ppBusinessStatus').textContent=message;};
const button=(text,action)=>{const n=el('button',text);n.type='button';n.addEventListener('click',()=>{try{action();}catch(e){error(e.message);}});return n;};
const field=(parent,label,value='',type='text')=>{const wrap=el('label',label),input=el(type==='textarea'?'textarea':'input');if(type!=='textarea')input.type=type;input.value=value;wrap.append(input);parent.append(wrap);return input;};
function persist(){const n=$('ppScenarioConfiguration');if(n)n.value=JSON.stringify({version:1,scenarios});}
function renderScenarios(){
 const list=$('ppScenarioList');if(!list)return;list.replaceChildren();persist();
 scenarios.forEach((item,index)=>{
  const card=el('article',undefined,'pp-business-scenario');card.append(el('h4',item.name));
  const s=item.state;const rows=[['Products',s.qty],['Revenue including delivery',money(s.batchSales+s.deliveryCharge)],['Total cost',money(s.batchCost)],['Selling fees',money(s.batchFees)],['Estimated profit',money(s.batchProfit)],['Margin',(s.batchMargin*100).toFixed(1)+'%']];
  if(s.farm)rows.push(['Print cycles',s.farm.builds],['Elapsed hours',s.farm.elapsedHours.toFixed(2)],['Energy',s.farm.kWh.toFixed(3)+' kWh']);
  if(index>0)rows.push(['Profit difference vs '+scenarios[0].name,money(s.batchProfit-scenarios[0].state.batchProfit)]);
  const dl=el('dl');rows.forEach(([label,value])=>{dl.append(el('dt',label),el('dd',String(value)));});card.append(dl,el('p',new Date(item.createdAt).toLocaleString()),button('Remove scenario',()=>{scenarios.splice(index,1);renderScenarios();$('ppScenarioConfiguration').dispatchEvent(new Event('input',{bubbles:true}));}));list.append(card);
 });
 if(!scenarios.length)list.append(el('p','Save the current calculation, change your settings, then save another scenario to compare them.'));
}
window.__ppRestoreBusiness=fields=>{
 try{const raw=fields?.ppScenarioConfiguration?.value;const data=raw?JSON.parse(raw):null;
 scenarios=data?.version===1&&Array.isArray(data.scenarios)?data.scenarios.slice(0,3).filter(s=>typeof s.name==='string'&&s.state&&['qty','batchCost','batchSales','batchProfit','batchFees','deliveryCharge','batchMargin'].every(k=>Number.isFinite(s.state[k]))&&(!s.state.farm||['builds','elapsedHours','kWh'].every(k=>Number.isFinite(s.state.farm[k])))):[];
 }catch(e){scenarios=[];}renderScenarios();
};
function exportCSV(){
 const s=current(),p=currency(),convert=n=>Math.round(n*p.rate*10000)/10000;
 const rows=[['PrintProfit internal costing — not a customer quotation'],['Created',new Date().toISOString()],['Currency',p.code],['GBP conversion rate',p.rate],['Products',s.qty],['Material per product',convert(s.materialCost)],['Electricity per product',convert(s.elec)],['Depreciation per product',convert(s.depreciation)],['Labour per product',convert(s.labour)],['Packaging per product',convert(s.packaging)],['Other per product',convert(s.other)],['Delivery cost (order)',convert(s.delivery)],['Delivery charged (order)',convert(s.deliveryCharge)],['Selling discount (%)',s.disc*100],['Revenue (items)',convert(s.batchSales)],['Total cost',convert(s.batchCost)],['Selling fees',convert(s.batchFees)],['Profit',convert(s.batchProfit)],['Margin (%)',s.batchMargin*100]];
 if(s.farm){rows.push([],['Farm target good products',s.farm.quantity],['Planned product attempts',s.farm.plannedProducts],['Failure allowance (%)',s.farm.failurePercent],['Downtime (%)',s.farm.downtimePercent],['Changeover minutes',s.farm.changeoverMinutes],['Total cycles',s.farm.builds],['Printer hours',s.farm.printerHours],['Estimated elapsed hours',s.farm.elapsedHours],['Energy (kWh)',s.farm.kWh],[],['Group','Printers','Planned attempts','Cycles','Energy (kWh)']);s.farm.allocations.forEach((g,i)=>rows.push([i+1,g.machines,g.products,g.builds,g.kWh]));}
 const url=URL.createObjectURL(new Blob([M.csv(rows)],{type:'text/csv;charset=utf-8'})),a=el('a');a.href=url;a.download='printprofit-internal-costing.csv';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);error('Internal costing CSV downloaded. It includes your costs and profit.');
}
function mount(){
 const result=document.querySelector('.result');if(!result||!M)return;
 const panel=el('section',undefined,'pp-business-tools');panel.id='ppBusinessTools';panel.append(el('h3','Business tools — preview'),el('p','Compare production options and prepare a customer quotation. These tools are planned for Pro; subscription access is not enabled yet.'));
 const status=el('p');status.id='ppBusinessStatus';status.setAttribute('role','status');panel.append(status);
 const hidden=el('input');hidden.type='hidden';hidden.id='ppScenarioConfiguration';panel.append(hidden);
 const compare=el('details'),summary=el('summary','Compare production scenarios');compare.dataset.ppProTool='scenario';compare.append(summary);
 const name=field(compare,'Scenario name');name.maxLength=80;
 compare.append(button('Save current scenario',()=>{if(scenarios.length>=3)throw new Error('Compare up to three scenarios. Remove one to save another.');scenarios.push({name:name.value.trim()||'Scenario '+(scenarios.length+1),createdAt:new Date().toISOString(),state:current()});renderScenarios();hidden.dispatchEvent(new Event('input',{bubbles:true}));error('Scenario saved with this project. Comparisons use your current display currency.');}));
 const list=el('div');list.id='ppScenarioList';list.className='pp-business-scenarios';compare.append(list);panel.append(compare);
 const quote=el('details');quote.dataset.ppProTool='quote';quote.append(el('summary','Customer quotation / PDF'));
 const seller=field(quote,'Your business / seller name'),customer=field(quote,'Customer name (optional)'),description=field(quote,'Product description','3D printed products'),reference=field(quote,'Quotation reference','PP-'+new Date().toISOString().replace(/[-:T]/g,'').slice(0,12)),notes=field(quote,'Notes / delivery and tax treatment','Estimate only. Tax treatment not specified. Confirm before sending.','textarea');
 quote.append(el('p','Customer quotations show selling prices and delivery charges, without internal costs or profit. Customer details stay in this form and are not saved to projects.'));
 quote.append(button('Print / save draft quotation PDF',()=>{
  if(!seller.value.trim()||!description.value.trim())throw new Error('Enter your seller name and product description.');
  const s=current(),prefs=currency(),formatter=new Intl.NumberFormat(undefined,{style:'currency',currency:prefs.code}),q=M.quotation({...s,sell:s.sell*prefs.rate,deliveryCharge:s.deliveryCharge*prefs.rate},formatter.resolvedOptions().maximumFractionDigits),quoteMoney=n=>formatter.format(n),esc=v=>String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const popup=window.open('','_blank');if(!popup)throw new Error('Allow this site to open the quotation window, then try again.');popup.opener=null;
  popup.document.write('<!doctype html><html lang="en"><meta charset="utf-8"><title>Draft quotation</title><style>body{font:16px system-ui;color:#17232b;max-width:850px;margin:35px auto;padding:20px}h1{font-size:30px}table{width:100%;border-collapse:collapse;margin:25px 0}th,td{padding:10px;border-bottom:1px solid #ccd4da;text-align:left}p{white-space:pre-wrap;overflow-wrap:anywhere}.total{font-size:22px;font-weight:bold}@media print{button{display:none}body{margin:0}}</style><h1>Draft quotation</h1><h2>'+esc(seller.value)+'</h2><p>Reference: '+esc(reference.value)+'\nDate: '+esc(new Date().toLocaleDateString())+'\nCustomer: '+esc(customer.value||'Not specified')+'</p><table><thead><tr><th>Item</th><th>Quantity</th><th>List unit price</th><th>Discount</th><th>Line total</th></tr></thead><tbody><tr><td>'+esc(description.value)+'</td><td>'+q.quantity+'</td><td>'+esc(money(s.sell))+'</td><td>'+(s.disc*100).toFixed(1)+'%</td><td>'+esc(quoteMoney(q.subtotal))+'</td></tr></tbody></table><p>Delivery: '+esc(quoteMoney(q.delivery))+'</p><p class="total">Total ('+esc(prefs.code)+'): '+esc(quoteMoney(q.total))+'</p><p>'+esc(notes.value)+'</p><small>Prepared using PrintProfit. Discounts are applied to the line total.</small><p><button onclick="window.print()">Print / save PDF</button></p></html>');popup.document.close();popup.focus();popup.print();error('Draft quotation opened. Choose Save as PDF in your print options.');
 }));panel.append(quote);
 const exportButton=button('Download internal costing CSV',exportCSV);exportButton.dataset.ppProTool='export';panel.append(exportButton);result.append(panel);renderScenarios();
 const style=el('style');style.textContent='.pp-business-tools{margin-top:15px;padding:16px;border:1px solid var(--line);border-radius:12px;color:var(--text);background:var(--panel)}.pp-business-tools p{font-size:13px;line-height:1.5}.pp-business-tools details{padding:12px 0;border-top:1px solid var(--line)}.pp-business-tools summary{cursor:pointer;font-weight:700}.pp-business-tools label{display:block;margin:12px 0;font-size:13px}.pp-business-tools input:not([type=hidden]),.pp-business-tools textarea{display:block;width:100%;box-sizing:border-box;padding:10px;border:1px solid var(--line);border-radius:7px;background:var(--panel2);color:var(--text);margin-top:5px}.pp-business-tools button{padding:10px;margin:8px 8px 0 0;border:1px solid var(--line);border-radius:8px;background:var(--panel2);color:var(--text);cursor:pointer}.pp-business-scenarios{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,210px),1fr));gap:12px}.pp-business-scenario{padding:12px;border:1px solid var(--line);border-radius:8px;min-width:0;overflow-wrap:anywhere}.pp-business-scenario dt{font-size:12px;color:var(--muted)}.pp-business-scenario dd{margin:3px 0 10px}';document.head.append(style);
 document.addEventListener('printprofit-settings-changed',renderScenarios);
}
mount();
})();

