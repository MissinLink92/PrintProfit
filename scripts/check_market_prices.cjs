const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const code=fs.readFileSync('market-price-sync.js','utf8');
const controls={material:{value:'PLA+'},materialType:{value:'filament'},materialPack:{value:'1000'}};
const context={Date,Number,Promise,Event:class{constructor(type){this.type=type;}},setTimeout:()=>{},document:{readyState:'loading',addEventListener(){},getElementById:id=>controls[id]},window:{PRINTPROFIT_COMPARE:require('../compare-catalogue.js')}};
vm.createContext(context);
vm.runInContext(code.replace('function boot(){','window.auditFindBest=findBest;window.auditApply=applyLivePrice;function boot(){'),context);
const today=new Date().toISOString().slice(0,10);
const base={category:'filament',type:'PLA+',price:20,weightGrams:1000,lastCheckStatus:'ok',availability:'In stock',updated:today};
context.window.PRINTPROFIT_PRICE_DATA={products:[
 {...base,id:'unverified',price:1,lastCheckStatus:'retained-unverified'},
 {...base,id:'stock',price:2,availability:'Out of stock'},
 {...base,id:'old',price:3,updated:'2020-01-01'},
 {...base,id:'wrong-material',price:4,type:'PLA'},
 {...base,id:'wrong-variant',price:1,type:'PLA+',name:'PLA, PLA+, PETG Filament — PETG / Black'},
 {...base,id:'unknown-weight',price:1,weightGrams:null},
 {...base,id:'future',price:1,updated:'2099-01-01'},
 {...base,id:'archived',price:5,sourceUnavailable:true},
 {...base,id:'correct',price:15,type:'PLA Plus'}
]};
assert.equal(context.window.auditFindBest().id,'correct');
context.window.PRINTPROFIT_PRICE_DATA.products.pop();
assert.equal(context.window.auditFindBest(),null);
console.log('PASS: market references exclude stale, unverified, removed, out-of-stock and different material offers.');
(async()=>{
 controls.material.value='RESIN';controls.materialType.value='resin';controls.materialPack.value='500';
 const events=[];
 controls.materialPackCost={value:'',dataset:{},dispatchEvent:event=>events.push([event.type,controls.materialPack.value])};
 context.window.PRINTPROFIT_PRICE_DATA.products=[{...base,id:'resin',type:'RESIN',category:'filament',price:15,weightGrams:1000}];
 assert.equal(context.window.auditFindBest(),null,'A 1kg bottle must not be assumed to contain 1000ml');
 context.window.PRINTPROFIT_PRICE_DATA.products[0].volumeMl=1000;
 assert.ok(await context.window.auditApply());
 assert.equal(controls.materialPack.value,'1000');
 assert.equal(controls.materialPackCost.value,'15.00');
 assert.deepEqual(events,[['input','1000'],['change','1000']],'Recalculation must see the correct bottle weight');
 controls.materialPackCost.dataset.ppManual='1';controls.materialPackCost.value='27';
 assert.equal(await context.window.auditApply(),false);
 assert.equal(controls.materialPackCost.value,'27');
 console.log('PASS: resin requires a known ml volume, filament requires grams; updates recalculate with the matching pack and preserve manual costs.');
})().catch(error=>{console.error(error);process.exitCode=1;});
