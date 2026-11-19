const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const Pricing=require('../pricing-fees.js');
const html=fs.readFileSync('legacy-index.html','utf8');
const calc=html.match(/  function calc\(\)\{[^\r\n]+/)[0],batch=html.match(/  function renderBatch\([^]*?\n  \}/)[0];
const target=html.match(/  function targetPrice\(target,mode\)\{[^\r\n]+/)[0];
const values={qty:3,discount:10,printHours:2,materialPack:1000,materialPackCost:20,materialUsed:100,electricityRate:.3,labourRate:10,labourHours:.5,pack:1,other:.5,delivery:3,sell:20,platform:8,pay:2,fixedFee:.5,deliveryCharge:2};
const fields={platformSelect:{value:'custom'},platformDeliveryFee:{checked:true},paymentDeliveryFee:{checked:true}};
const output={},ctx={Math,Number,state:{},window:{PrintProfitPricing:Pricing},n:id=>values[id]||0,printerData:()=>({watts:100,price:300,lifetime:3000}),document:{getElementById:id=>fields[id]||null},$:id=>fields[id]||null,setValue:()=>{},setText:(id,v)=>output[id]=v,setProfitClass:()=>{},money:n=>Number(n),renderSingle:(...args)=>ctx.single=args,current:{}};
vm.createContext(ctx);vm.runInContext(batch+'\n'+calc+'\n'+target,ctx);
const near=(actual,expected)=>assert.ok(Math.abs(actual-expected)<1e-7*Math.max(1,Math.abs(expected)),`${actual} != ${expected}`);
let combinations=0;
for(const qty of [1,3,100])for(const discount of [0,10,50,99,100])for(const sell of [0,.01,20,1000])for(const delivery of [0,2,50])for(const platform of [0,6.98,12.25,99])for(const pay of [0,4])for(const platformDelivery of [false,true])for(const paymentDelivery of [false,true]){
 Object.assign(values,{qty,discount,sell,deliveryCharge:delivery,platform,pay});fields.platformDeliveryFee.checked=platformDelivery;fields.paymentDeliveryFee.checked=paymentDelivery;
 vm.runInContext('calc()',ctx);
 const base=2+.06+.2+5+1+.5+3,fee=sell*(platform+pay)/100+delivery*((platformDelivery?platform:0)+(paymentDelivery?pay:0))/100+.5;
 near(ctx.single[0],base);near(ctx.single[2],fee);near(ctx.single[3],sell+delivery-base-fee);
 const revenue=sell*qty*(1-discount/100),cost=(base-3)*qty+3,batchFee=revenue*(platform+pay)/100+delivery*((platformDelivery?platform:0)+(paymentDelivery?pay:0))/100+.5;
 near(output.batchSales,revenue);near(output.batchCost,cost);near(output.batchProfit,revenue+delivery-cost-batchFee);
 for(const mode of ['single','batch'])for(const margin of [0,.3,.6]){
  const price=vm.runInContext(`targetPrice(${margin},'${mode}')`,ctx),factor=mode==='batch'?qty*(1-discount/100):1;
  if(factor<=0||1-(platform+pay)/100-margin<=0){assert.equal(price,null);continue;}
  assert.ok(Number.isFinite(price)&&price>=0);
  if(price>0){const sale=price*factor,expenses=mode==='batch'?cost:base,fees=sale*(platform+pay)/100+delivery*((platformDelivery?platform:0)+(paymentDelivery?pay:0))/100+.5;near((sale+delivery-expenses-fees)/sale,margin);}
 }
 combinations++;
}
assert.equal(Pricing.forChannel(2.5,7.2,1.5,'folksy'),.0375);
near(Pricing.forChannel(2,6.98,4,'etsy'),.2196);
// Confirm the independently loaded quick-button implementations solve the same target equation.
for(const [file,start,end,baseName] of [['quick-price-guard.js','  function targetPrice(','  function buttonsFor(','baseCost'],['reset-fix.js','  function targetPrice(','  function setResultMode(','currentBaseCost']]){
 const source=fs.readFileSync(file,'utf8'),a=source.indexOf(start),b=source.indexOf(end,a);assert.ok(a>=0&&b>a,file);
 const scope={...ctx,num:ctx.n,number:ctx.n,normalizeTarget:x=>x,[baseName]:()=>ctx.current.base};vm.createContext(scope);vm.runInContext(source.slice(a,b),scope);
 Object.assign(values,{qty:5,discount:20,sell:20,deliveryCharge:2,platform:8,pay:2});fields.platformDeliveryFee.checked=true;fields.paymentDeliveryFee.checked=true;
 vm.runInContext('calc()',ctx);
 for(const mode of ['single','batch'])near(vm.runInContext(`targetPrice(.3,'${mode}')`,scope),vm.runInContext(`targetPrice(.3,'${mode}')`,ctx));
}
// Exercise project restoration with the channel change resetting defaults before overrides.
const projects=fs.readFileSync('my-projects.js','utf8');
const restoreSource=projects.slice(projects.indexOf('const restore=data=>{'),projects.indexOf('const projectInfo='));
for(const platformDelivery of [false,true])for(const paymentDelivery of [false,true]){
 const controls={platformDeliveryFee:{type:'checkbox',checked:true},paymentDeliveryFee:{type:'checkbox',checked:true},platformSelect:{id:'platformSelect',tagName:'SELECT',options:[{value:'custom'}],value:'custom'}};
 for(const field of Object.values(controls))field.dispatchEvent=event=>{if(field===controls.platformSelect&&event.type==='change'){controls.platformDeliveryFee.checked=true;controls.paymentDeliveryFee.checked=true;}};
 const scope={window:{PrintProfitPricing:Pricing},document:{getElementById:id=>controls[id]},Event,setTimeout};vm.createContext(scope);
 vm.runInContext(restoreSource+'\nglobalThis.restoreProject=restore;',scope);
 scope.restoreProject({platformSelect:{value:'custom'},platformDeliveryFee:{checked:platformDelivery},paymentDeliveryFee:{checked:paymentDelivery}});
 assert.equal(controls.platformDeliveryFee.checked,platformDelivery);assert.equal(controls.paymentDeliveryFee.checked,paymentDelivery);
}
console.log(`PASS: ${combinations} calculator combinations, single/batch fees, 6 target equations each, charged delivery, Folksy exception, three target-price implementations and project fee overrides.`);
