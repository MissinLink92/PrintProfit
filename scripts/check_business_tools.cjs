const assert=require('node:assert/strict'),fs=require('node:fs');
const M=require('../business-tools-math.js'),{plan}=require('../print-farm-math.js');
for(const code of ['4006381333931','036000291452','96385074'])assert.equal(M.barcode(code),code);
for(const code of ['4006381333932','00000000','https://example.com/','123','<script>'])assert.equal(M.barcode(code),null);
assert.equal(M.barcode(' 4006381-333931 '),'4006381333931');
const material={barcode:'4006381333931',name:'PLA',type:'Filament',brand:'Test',colour:'Black',amount:1000,cost:20,updated:1};
assert.equal(M.matchMaterial([material],material.barcode),material);assert.equal(M.matchMaterial([material,{...material,colour:'White'}],material.barcode),null);
assert.equal(M.matchMaterial([material,{...material,cost:25,updated:2}],material.barcode).cost,25);
assert.equal(M.matchMaterial([material],'036000291452'),null);
const csv=M.csv([['=HYPERLINK("bad")',' +CMD','@SUM(1)',-5,'A "quoted" name']]);assert.ok(csv.startsWith('\uFEFF'));assert.ok(csv.includes('"\'=HYPERLINK'));assert.ok(csv.includes('"\' +CMD'));assert.ok(csv.includes('"-5"'));assert.ok(csv.includes('A ""quoted"" name'));
assert.deepEqual(M.quotation({qty:3,sell:20,disc:.1,deliveryCharge:2}),{quantity:3,unitPrice:18,subtotal:54,delivery:2,total:56});
assert.equal(M.quotation({qty:3,sell:10.49,disc:.1,deliveryCharge:1.49},0).total,29);
assert.throws(()=>M.quotation({qty:1,sell:-1,disc:0,deliveryCharge:0}));
const group={machines:2,perBuild:5,hours:2,watts:100,price:300,lifetime:3000};
const p=plan(10,[group],{failurePercent:20,changeoverMinutes:10,downtimePercent:25});
assert.equal(p.plannedProducts,13);assert.equal(p.materialMultiplier,1.3);assert.equal(p.builds,3);assert.equal(p.changeoverHours,1/6);assert.ok(Math.abs(p.elapsedHours-(4+1/6)/.75)<1e-8);assert.ok(Math.abs(p.kWh-.6)<1e-8);
assert.throws(()=>plan(10,[group],{failurePercent:99}));assert.throws(()=>plan(10,[group],{downtimePercent:100}));
for(const f of ['legacy-index.html','profit-advisor.js','profit-tools.js','quick-price-guard.js','reset-fix.js']){const text=fs.readFileSync(f,'utf8');assert.ok(text.includes('materialMultiplier'),f);assert.ok(text.includes('extraLabourHours'),f);}
assert.ok(fs.readFileSync('my-materials.js','utf8').includes('__ppPrepareMaterialScan'));
console.log('PASS: checked barcodes, conflicting matches, CSV injection escaping, quotation totals and production allowances across pricing paths.');
// Exercise real comparison and quotation UI without opening a browser or transmitting data.
const vm=require('node:vm');
class Element{
 constructor(tag,text=''){this.tagName=tag;this.textContent=text;this.children=[];this.dataset={};this.listeners={};this.value='';}
 append(...nodes){this.children.push(...nodes);}
 replaceChildren(...nodes){this.children=[...nodes];}
 setAttribute(k,v){this[k]=v;}
 addEventListener(k,f){(this.listeners[k]??=[]).push(f);}
 dispatchEvent(e){for(const f of this.listeners[e.type]||[])f(e);}
 click(){this.dispatchEvent({type:'click'});}
}
const result=new Element('section'),head=new Element('head'),walk=(n,p)=>{if(p(n))return n;for(const c of n.children||[]){const found=walk(c,p);if(found)return found;}return null;};
const document={body:{dataset:{}},head,createElement:t=>new Element(t),getElementById:id=>walk(result,n=>n.id===id),querySelector:s=>s==='.result'?result:null,addEventListener(){}};
let state={qty:3,sell:20,disc:.1,deliveryCharge:2,batchCost:30,batchSales:54,batchProfit:22,batchFees:4,batchMargin:22/54};
let quoteHtml='',prints=0;
const context={window:{PrintProfitBusinessMath:M,__ppBusinessSnapshot:()=>structuredClone(state),open:()=>({document:{write:s=>quoteHtml=s,close(){}},focus(){},print(){prints++;}})},document,localStorage:{getItem:()=>JSON.stringify({currency:'USD',rate:1.3})},Intl,Event:class{constructor(type){this.type=type}},URL,Blob,setTimeout:()=>{}};
vm.runInNewContext(fs.readFileSync('business-tools.js','utf8'),context);
const findButton=t=>walk(result,n=>n.tagName==='button'&&n.textContent===t),input=t=>walk(result,n=>n.tagName==='label'&&n.textContent===t).children[0];
input('Scenario name').value='Baseline';findButton('Save current scenario').click();state.batchProfit=30;input('Scenario name').value='Faster';findButton('Save current scenario').click();
let saved=document.getElementById('ppScenarioConfiguration').value;assert.equal(JSON.parse(saved).scenarios.length,2);assert.equal(JSON.parse(saved).scenarios[0].state.batchProfit,22);
context.window.__ppRestoreBusiness({ppScenarioConfiguration:{value:saved}});assert.equal(JSON.parse(document.getElementById('ppScenarioConfiguration').value).scenarios.length,2);
input('Your business / seller name').value='<script>unsafe</script>';input('Customer name (optional)').value='Customer';findButton('Print / save draft quotation PDF').click();assert.equal(prints,1);assert.ok(quoteHtml.includes('&lt;script&gt;unsafe&lt;/script&gt;'));assert.ok(!quoteHtml.includes('Estimated profit'));assert.ok(!quoteHtml.includes('Total cost'));assert.ok(quoteHtml.includes('$72.80'));
context.window.__ppRestoreBusiness({});assert.equal(JSON.parse(document.getElementById('ppScenarioConfiguration').value).scenarios.length,0);
console.log('PASS: comparison snapshots restore independently; quotation escapes user text, converts currency and excludes internal costs/profit.');
// A scan opens a new-package review, never writes inventory or edits the matched package.
const form={dataset:{}},fields=Object.fromEntries(['ppMatName','ppMatAmount','ppMatRemaining','ppMatCost','ppMaterialFormTitle'].map(k=>[k,{value:'old'}]));
const bridgeContext={window:{PrintProfitBusinessMath:M},document:{getElementById:id=>id==='ppMaterialForm'?form:fields[id]},read:()=>[material],open(){},setWorkshopTab(){},openForm:m=>{fields.ppMatName.value=m?.name||'';form.dataset.editId=m?.id||'old';}};
const source=fs.readFileSync('my-materials.js','utf8'),bridge=source.slice(source.indexOf('window.__ppPrepareMaterialScan='),source.indexOf('window.__ppOpenWorkspaceWorkshop='));vm.runInNewContext(bridge,bridgeContext);
assert.equal(bridgeContext.window.__ppPrepareMaterialScan(material.barcode),true);assert.equal(form.dataset.editId,'');assert.equal(form.dataset.barcode,material.barcode);assert.equal(fields.ppMatRemaining.value,1000);
assert.equal(bridgeContext.window.__ppPrepareMaterialScan('036000291452'),false);assert.equal(fields.ppMatName.value,'');assert.equal(fields.ppMatAmount.value,'');assert.equal(fields.ppMatCost.value,'');assert.throws(()=>bridgeContext.window.__ppPrepareMaterialScan('bad'));
console.log('PASS: scanned matches create a reviewable new package; unknown barcodes leave identity, amount and price blank.');
const html=fs.readFileSync('legacy-index.html','utf8'),calc=html.match(/  function calc\(\)\{[^\r\n]+/)[0],batch=html.match(/  function renderBatch\([^]*?\n  \}/)[0];
const numbers={qty:10,discount:0,printHours:2,materialPack:1000,materialPackCost:20,materialUsed:100,electricityRate:.3,labourRate:10,labourHours:.5,pack:1,other:.5,delivery:3,sell:20,platform:8,pay:2,fixedFee:.5,deliveryCharge:2};
const totals={},calculation={Math,Number,state:{},window:{__ppFarmCosts:()=>({powerUsed:p.powerPerItem,depreciation:p.depreciationPerItem,materialMultiplier:p.materialMultiplier,extraLabourHours:p.extraLabourHours})},n:id=>numbers[id]||0,printerData:()=>({watts:100,price:300,lifetime:3000}),document:{getElementById:()=>null},$:()=>null,setValue(){},setText:(k,v)=>totals[k]=v,setProfitClass(){},money:n=>n,renderSingle(){},current:{}};
vm.createContext(calculation);vm.runInContext(batch+'\n'+calc+'\ncalc();',calculation);assert.ok(Math.abs(totals.batchCost-(26+65+10/6+15+3+.18+.6))<1e-8);
console.log('PASS: real calculator includes failure material/labour and changeover labour while leaving packaging and delivery on good products.');
