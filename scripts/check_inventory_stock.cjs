const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const source=fs.readFileSync('my-materials.js','utf8');
const save=source.slice(source.indexOf('function saveForm(){'),source.indexOf('\nfunction useMaterial('));
assert.ok(save.startsWith('function saveForm'));
const controls=Object.fromEntries(['ppMatName','ppMatType','ppMatAmount','ppMatCost','ppMatRemaining','ppMatLowStock','ppMatBrand','ppMatBrandCustom','ppMatColour'].map(id=>[id,{value:''}]));
controls.ppMaterialForm={dataset:{}};
let saved=[],alerts=[];
const ctx={document:{getElementById:id=>controls[id]},alert:text=>alerts.push(text),Number,Date,crypto:{randomUUID:()=> 'test'},read:()=>[],write:list=>{saved=list;return true;},toGBP:x=>x,moneyFromGBP:x=>String(x),closeForm(){},render(){},window:{PrintProfitBusinessMath:require('../business-tools-math.js')}};
vm.createContext(ctx);vm.runInContext(save,ctx);
function reset(){for(const [id,value] of Object.entries({ppMatName:'Test PLA',ppMatType:'Filament',ppMatAmount:'1000',ppMatCost:'20',ppMatRemaining:'800',ppMatLowStock:'200'}))controls[id].value=value;saved=[];alerts=[];}
for(const change of [{ppMatCost:'-1'},{ppMatCost:'Infinity'},{ppMatAmount:'0'},{ppMatAmount:'Infinity'},{ppMatRemaining:'-1'},{ppMatLowStock:'-1'},{ppMatLowStock:'Infinity'},{ppMatName:''}]){reset();for(const [id,value] of Object.entries(change))controls[id].value=value;vm.runInContext('saveForm()',ctx);assert.equal(saved.length,0,JSON.stringify(change));assert.ok(alerts.length);}
reset();controls.ppMatCost.value='0';vm.runInContext('saveForm()',ctx);assert.equal(saved.length,1);assert.equal(saved[0].cost,0);assert.equal(saved[0].remaining,800);
const mark=source.slice(source.indexOf('function markPrinted(){'),source.indexOf('\nfunction populatePrinterPresets('));
let inventory=[{id:'spool',name:'Test',type:'Filament',amount:1000,remaining:500}],confirmation=false,signatures=new Set();
const values={materialUsed:100,qty:3};
const stock={selectedMaterialId:'spool',read:()=>structuredClone(inventory),write:list=>{inventory=list;return true;},stockAlertsAvailable:()=>true,materialRemaining:m=>m.remaining,materialUnit:m=>m.type==='Resin'?'ml':'g',amountText:String,val:id=>values[id],lastDeductedSignatures:signatures,window:{confirm:()=>confirmation},document:{getElementById:()=>null},render(){},syncWorkshopUsage(){},Date,Number,Math};
vm.createContext(stock);vm.runInContext(mark+'\nmarkPrinted();',stock);assert.equal(inventory[0].remaining,200);
vm.runInContext('markPrinted()',stock);assert.equal(inventory[0].remaining,200,'Insufficient stock cannot be deducted');
values.materialUsed=10;vm.runInContext('markPrinted()',stock);assert.equal(inventory[0].remaining,170);
vm.runInContext('markPrinted()',stock);assert.equal(inventory[0].remaining,170,'Repeated setup requires confirmation');
confirmation=true;vm.runInContext('markPrinted()',stock);assert.equal(inventory[0].remaining,140);
console.log('PASS: material value validation, free material, stock deduction, insufficient stock and repeated-print confirmation.');
