const fs=require('node:fs'),assert=require('node:assert/strict'),vm=require('node:vm');
const {plan}=require('../print-farm-math.js');
const near=(a,b)=>assert.ok(Math.abs(a-b)<1e-8,`${a} != ${b}`);
const group={machines:5,perBuild:10,hours:2,watts:150,price:300,lifetime:3000};
let p=plan(1000,[group]);assert.equal(p.builds,100);near(p.printerHours,200);near(p.elapsedHours,40);near(p.kWh,30);near(p.depreciation,20);
assert.equal(p.allocations[0].products,1000);near(p.powerPerItem,.03);
p=plan(11,[{...group,machines:2,perBuild:5}]);assert.equal(p.builds,3);near(p.printerHours,6);near(p.elapsedHours,4);near(p.kWh,.9);
p=plan(8,[{...group,machines:2,perBuild:2,hours:1,watts:100},{...group,machines:1,perBuild:3,hours:3,watts:200}]);
assert.deepEqual(p.allocations.map(g=>g.products),[5,3]);assert.equal(p.builds,4);near(p.kWh,.9);near(p.elapsedHours,3);
p=plan(1,[group]);assert.equal(p.builds,1);near(p.kWh,.3);near(p.elapsedHours,2);
for(const [q,g] of [[0,[group]],[1.5,[group]],[10,[]],[10,[{...group,machines:1.5}]],[10,[{...group,hours:0}]],[10,[{...group,watts:0}]],[10,[{...group,price:100,lifetime:0}]],[10,[{...group,price:Infinity}]]])assert.throws(()=>plan(q,g));
// Exercise the actual legacy calculator and Batch renderer, with farm costing enabled.
const html=fs.readFileSync('legacy-index.html','utf8');
const calc=html.match(/  function calc\(\)\{[^\r\n]+/)[0],batch=html.match(/  function renderBatch\([^]*?\n  \}/)[0];
const values={qty:11,discount:0,printHours:2,materialPack:1000,materialPackCost:20,materialUsed:100,electricityRate:.3,labourRate:10,labourHours:.5,pack:1,other:.5,delivery:3,sell:20,platform:8,pay:2,fixedFee:.5,deliveryCharge:2};
const output={},farm=plan(11,[{...group,machines:2,perBuild:5}]);
const ctx={Math,Number,state:{},window:{__ppFarmCosts:()=>({powerUsed:farm.powerPerItem,depreciation:farm.depreciationPerItem})},n:id=>values[id]||0,printerData:()=>({watts:100,price:300,lifetime:3000}),document:{getElementById:()=>null},$:()=>null,setValue:()=>{},setText:(id,v)=>output[id]=v,setProfitClass:()=>{},money:n=>Number(n),renderSingle:(...args)=>ctx.single=args,current:{}};
vm.createContext(ctx);vm.runInContext(batch+'\n'+calc+'\ncalc();',ctx);
// 11 products * (material 2 + labour 5 + packaging 1 + other .5), plus .27 power, .6 wear and one delivery 3.
near(output.batchCost,97.37);near(output.batchProfit,220+2-97.37-22.5);
near(ctx.current.elec,.27/11);near(ctx.current.depreciation,.6/11);
// Disabling farm returns the existing single-printer behaviour unchanged.
ctx.window.__ppFarmCosts=()=>null;vm.runInContext('calc()',ctx);near(ctx.current.elec,.06);near(ctx.current.depreciation,.2);
// All price paths must consume the same farm override; saved-state restoration runs before normal fields.
for(const f of ['profit-advisor.js','profit-tools.js','quick-price-guard.js','reset-fix.js'])assert.match(fs.readFileSync(f,'utf8'),/__ppFarmCosts/);
for(const f of ['my-projects.js','calculator-state.js'])assert.match(fs.readFileSync(f,'utf8'),/__ppRestoreFarm/);
console.log('PASS: farm allocation, full/partial builds, mixed printers, energy, wear, elapsed time, invalid inputs, calculator totals and disabled-mode regression.');
// Run the real UI module against a small DOM fixture: mount, edit, save/load, disable, reset.
class Element{
 constructor(tag,text=''){this.tagName=tag.toUpperCase();this.children=[];this.dataset={};this.listeners={};this.textContent=text;this.value='';this.hidden=false;this.checked=false;}
 append(...nodes){this.children.push(...nodes);}
 prepend(...nodes){this.children.unshift(...nodes);}
 replaceChildren(...nodes){this.children=[...nodes];}
 setAttribute(k,v){this[k]=v;}
 addEventListener(k,f){(this.listeners[k]??=[]).push(f);}
 dispatchEvent(e){for(const f of this.listeners[e.type]||[])f(e);}
 click(){this.dispatchEvent({type:'click'});}
 get options(){return this.children.filter(c=>c.tagName==='OPTION');}
}
class Opt extends Element{constructor(label,value){super('option',label);this.value=value;}}
const head=new Element('head'),body=new Element('body'),setup=new Element('section'),result=new Element('section');body.append(setup,result);
const controls={printer:new Element('select'),materialType:new Element('select'),qty:new Element('input'),printHours:new Element('input'),electricityRate:new Element('input'),calc:new Element('button')};
controls.printer.append(new Opt('Test printer','100|300|3000'),new Opt('Custom','custom'));controls.printer.value='100|300|3000';controls.materialType.value='filament';controls.qty.value='11';controls.printHours.value='2';controls.electricityRate.value='.3';
const walk=(node,predicate)=>{if(predicate(node))return node;for(const child of node.children||[]){const found=walk(child,predicate);if(found)return found;}return null;};
const doc={head,body,activeElement:null,createElement:t=>new Element(t),createTextNode:t=>new Element('#text',t),getElementById:id=>controls[id]||walk(body,n=>n.id===id),querySelector:s=>s==='.print-setup-panel'?setup:s==='.result'?result:null};
const ui={window:{PrintProfitFarmMath:{plan}},document:doc,Option:Opt,Event:class{constructor(type){this.type=type}},Intl};vm.createContext(ui);vm.runInContext(fs.readFileSync('print-farm.js','utf8'),ui);
const enabled=doc.getElementById('ppFarmEnabled');assert.equal(enabled.checked,false);enabled.checked=true;enabled.dispatchEvent({type:'change'});
let machine=walk(body,n=>n.dataset?.farmField==='machines'),perBuild=walk(body,n=>n.dataset?.farmField==='perBuild');
machine.value='2';machine.dispatchEvent({type:'input'});perBuild.value='5';perBuild.dispatchEvent({type:'input'});
near(ui.window.__ppFarmCosts(11).plan.kWh,.6);
const saved=doc.getElementById('ppFarmConfiguration').value;
const power=walk(body,n=>n.dataset?.farmField==='watts');power.value='0';power.dispatchEvent({type:'input'});assert.equal(ui.window.__ppFarmCosts(11),null);assert.equal(body.dataset.ppFarmInvalid,'true');
ui.window.__ppRestoreFarm({ppFarmEnabled:{checked:true},ppFarmConfiguration:{value:saved}});near(ui.window.__ppFarmCosts(11).plan.kWh,.6);
assert.equal(doc.getElementById('ppFarmDetails').hidden,false);doc.getElementById('ppFarmAdd').click();assert.equal(JSON.parse(doc.getElementById('ppFarmConfiguration').value).groups.length,2);
ui.window.__ppRestoreFarm({});assert.equal(enabled.checked,false);assert.equal(doc.getElementById('ppFarmDetails').hidden,true);assert.equal(ui.window.__ppFarmCosts(11),null);
console.log('PASS: real farm UI mounts, edits groups, serialises, restores saved setup and resets to single-printer mode.');
controls.qty.value='500';
ui.window.__ppRestoreFarm({ppFarmEnabled:{checked:true},ppFarmConfiguration:{value:JSON.stringify({version:1,groups:[{...group,printer:'100|300|3000',materialType:'filament',machines:3,perBuild:30,hours:1.5,watts:150}]})}});
const example=ui.window.__ppFarmCosts(500);assert.equal(example.plan.builds,17);assert.equal(example.plan.elapsedHours,9);
const texts=[];(function collect(n){if(n.textContent)texts.push(n.textContent);for(const c of n.children||[])collect(c);})(doc.getElementById('ppFarmSummary'));
assert.ok(texts.some(t=>t.includes('17 print cycles')));assert.ok(texts.includes('5–6'));assert.ok(texts.includes('20 of 30 products'));assert.ok(texts.includes('9 h 0 min'));
console.log('PASS: 500-product summary shows 17 cycles, 5–6 per printer, a 20-product partial cycle and nine-hour finish.');
