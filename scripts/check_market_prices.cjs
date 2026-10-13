const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const code=fs.readFileSync('market-price-sync.js','utf8');
const controls={material:{value:'PLA+'},materialType:{value:'filament'},materialPack:{value:'1000'}};
const context={Date,Number,Promise,setTimeout:()=>{},document:{readyState:'loading',addEventListener(){},getElementById:id=>controls[id]},window:{}};
vm.createContext(context);
vm.runInContext(code.replace('function boot(){','window.auditFindBest=findBest;function boot(){'),context);
const today=new Date().toISOString().slice(0,10);
const base={category:'filament',type:'PLA+',price:20,weightGrams:1000,lastCheckStatus:'ok',availability:'In stock',updated:today};
context.window.PRINTPROFIT_PRICE_DATA={products:[
 {...base,id:'unverified',price:1,lastCheckStatus:'retained-unverified'},
 {...base,id:'stock',price:2,availability:'Out of stock'},
 {...base,id:'old',price:3,updated:'2020-01-01'},
 {...base,id:'wrong-material',price:4,type:'PLA'},
 {...base,id:'archived',price:5,sourceUnavailable:true},
 {...base,id:'correct',price:15,type:'PLA Plus'}
]};
assert.equal(context.window.auditFindBest().id,'correct');
context.window.PRINTPROFIT_PRICE_DATA.products.pop();
assert.equal(context.window.auditFindBest(),null);
console.log('PASS: market references exclude stale, unverified, removed, out-of-stock and different material offers.');
