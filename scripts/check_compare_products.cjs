/* Exercise the public page's actual filters/renderers as well as its shared rules. */
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const M=require('../compare-catalogue.js');
const today=new Date().toISOString().slice(0,10);
const base={id:'plain',name:'SUNLU PLA Filament 1kg — Black',brand:'SUNLU',type:'PLA',category:'filament',colour:'Black',retailer:'Shop',pack:'1 kg',weightGrams:1000,price:12,unit:12,availability:'In stock',updated:today,lastCheckStatus:'ok'};
const material={material:true,group:'filament',label:'Standard & other PLA filament'};
for(const query of ['sunlu black pla','PLA, SUNLU, BLACK','black  SUNLU pla','sunlu pla 1 kg'])assert.ok(M.matchesSearch(base,query,material),query);
for(const query of ['white sunlu pla','sunlu pla+','sunlu pet g','sunlu black 500g'])assert.ok(!M.matchesSearch(base,query,material),query);
const plus={...base,name:'SUNLU PLA+ Filament — Black',type:'PLA+'};
assert.ok(M.matchesSearch(plus,'black sunlu pla plus',material));
assert.ok(!M.matchesSearch(plus,'sunlu black pla',material));
assert.ok(!M.matchesSearch({...plus,name:'SUNLU PLA+2.0 Filament — PLA+2.0 / Black'},'sunlu black pla',material));
assert.ok(M.matchesSearch({...plus,name:'SUNLU PLA+2.0 Filament — PLA+2.0 / Black'},'sunlu black pla+ 2.0',material));
assert.ok(!M.matchesSearch({...plus,name:'SUNLU High Speed Collection PLA, PETG — HSPLA+2.0 / Black'},'sunlu black pla',material));
assert.ok(M.matchesSearch({...plus,name:'SUNLU High Speed Collection PLA, PETG — HSPLA+2.0 / Black'},'sunlu black pla+ 2.0',material));
const collection={...base,name:'SUNLU Collection PLA, PLA+, PETG Filament 1KG — PETG / Black',type:'PLA'};
assert.ok(!M.matchesSearch(collection,'sunlu black pla',material));
assert.ok(M.matchesSearch(collection,'sunlu black petg',material));
const edited={...base};assert.ok(M.matchesSearch(edited,'sunlu black pla',material));edited.name='Other PETG';edited.brand='Other';edited.type='PETG';assert.ok(!M.matchesSearch(edited,'sunlu black pla',material),'Search cache must follow edited product metadata');
assert.ok(M.matchesSearch({...base,name:'Bambu Lab A1 Mini FDM 3D Printer',brand:'Bambu Lab'},'bambu mini fff',{group:'printer',label:'Filament / FDM printers'}));
assert.ok(M.matchesSearch({...base,name:'SUNLU PLA Filament 1kg',colour:'White',retailer:'Black Shop'},'SUNLU black PLA',material)); // Retailer names remain searchable.
for(const [value,family] of [['#Black','Black'],['Black (10101)','Black'],['PLA Black','Black'],['Black*5','Black'],['Black + White','Multicolour'],['Blue Grey','Grey'],['Gray','Grey'],['Transparent Black','Clear'],['1.75mm','Other / unspecified'],['Default Title','Other / unspecified']])assert.equal(M.colourFamily(value),family,value);
for(const value of ['Shipping in 3 days','Coming soon','Pre-order','Unknown','Check retailer'])assert.equal(M.stockState(value),'unknown',value);
assert.equal(M.stockState('https://schema.org/InStock'),'in');
assert.equal(M.stockState('Out of stock'),'out');
for(const value of [null,undefined,'',false,NaN,Infinity,-1,0])assert.equal(M.amount(value),Infinity);
for(const change of [{availability:'Out of stock'},{availability:'Coming soon'},{lastCheckStatus:'retained-unverified'},{updated:'bad'},{updated:'2099-01-01'},{updated:'2020-01-01'},{sourceUnavailable:true},{price:null}])assert.ok(!M.currentOffer({...base,...change}));
assert.ok(M.currentOffer(base));
assert.equal([{...base,id:'missing',price:null},base,{...base,id:'low',price:9}].sort((a,b)=>M.compareProducts(a,b,'price'))[0].id,'low');
assert.equal([{...base,id:'invalid',updated:'invalid'},{...base,id:'old',updated:'2020-01-01'},base].sort((a,b)=>M.compareProducts(a,b,'updated'))[0].id,'plain');
assert.equal([{...base,id:'missing',unit:''},base,{...base,id:'bulk',price:40,unit:8}].sort((a,b)=>M.compareProducts(a,b,'unit'))[0].id,'bulk');

class Element{
 constructor(value=''){this.value=value;this.options=[];this.textContent='';this.dataset={};this.style={};this.classList={toggle(){},contains(){return false;}};}
 set innerHTML(html){this.html=html;this.options=[...html.matchAll(/<option[^>]*value="([^"]*)"[^>]*>([^<]*)/g)].map(m=>({value:m[1],textContent:m[2]}));if(this.options.length)this.value=this.options[0].value;}
 get innerHTML(){return this.html||'';}
 setAttribute(){}
}
const html=fs.readFileSync(process.env.PP_COMPARE_HTML||'price-finder.html','utf8');
const controls=Object.fromEntries([...html.matchAll(/id="([^"]+)"/g)].map(m=>[m[1],new Element()]));
for(const id of ['category','brand','type','colour','retailer','availability','view'])controls[id].value='all';
controls.sort.value='price';
const context={window:{PRINTPROFIT_COMPARE:M},document:{getElementById:id=>controls[id],querySelectorAll:()=>[]},URL,Date,console,localStorage:{getItem:()=>null}};
vm.createContext(context);
vm.runInContext(fs.readFileSync('product-categories.js','utf8'),context);
const script=html.match(/<script>\s*window.addEventListener\('DOMContentLoaded',[\s\S]*?<\/script>/)[0];
const code=script.slice(script.indexOf("'use strict';"),script.indexOf("document.addEventListener('click',e=>{"));
vm.runInContext(code+`\nglobalThis.audit={filtered,refreshFilters,render,renderInsights,loadData,stockLabel,setProducts:p=>db.products=p};`,context);
const A=context.audit;
const rows=[base,{...plus,id:'plus',price:10},{...collection,id:'petg',price:7},
 {...base,id:'shade',colour:'Black (10101)',price:10},
 {...base,id:'white',colour:'White',name:'SUNLU PLA White',price:9},
 {...base,id:'out',price:1,unit:1,availability:'Out of stock'},
 {...base,id:'retained',price:2,unit:2,lastCheckStatus:'retained-unverified'},
 {...base,id:'undated',price:3,unit:3,updated:'invalid'},
 {...base,id:'missing',price:null,unit:null},
 {...base,id:'refill',name:'SUNLU PLA Refill 1kg — Black',price:11},
 {...base,id:'bundle',name:'SUNLU PLA Black 5 x 1kg bundle',price:40,unit:8,pack:'5 kg',weightGrams:5000}];
A.setProducts(rows);A.refreshFilters();
controls.search.value='black SUNLU pla';
assert.ok(A.filtered().some(p=>p.id==='plain'),'Word order should not suppress a valid listing');
assert.ok(!A.filtered().some(p=>['plus','petg','white'].includes(p.id)),'Sibling materials/colours must not leak from collection/category labels');
controls.search.value='sunlu pla';controls.colour.value='Black';A.render();
assert.ok(controls.colour.options.length<=18);
assert.ok(A.filtered().some(p=>p.id==='shade'));
assert.ok(!A.filtered().some(p=>p.id==='white'));
assert.equal(controls.insightPrice.textContent,'£10.00');
assert.equal(controls.insightUnit.textContent,'£8.00/kg');
assert.ok(controls.rows.innerHTML.includes('£40.00'),'Bundles keep their actual total price');
assert.ok(controls.rows.innerHTML.includes('Refill'),'Refills remain separate listings');
controls.availability.value='out';A.render();
assert.equal(A.filtered().length,1);
assert.equal(controls.insightPrice.textContent,'—','Out-of-stock products cannot be the current bargain');
controls.availability.value='all';controls.minPrice.value='0';
assert.ok(!A.filtered().some(p=>p.id==='missing'));
controls.minPrice.value='';controls.sort.value='updated';
assert.notEqual(A.filtered()[0].id,'undated');
controls.colour.value='all';controls.brand.value='Other brand';A.render();
assert.equal(A.filtered().length,0);
assert.ok(controls.empty.hidden===false);
// Verify alias merging through the actual payload load, not just a normaliser fixture.
controls.brand.value='all';
context.window.PRINTPROFIT_PRICE_DATA={products:['SUNLU','Sunlu','SUNLU.UK','SUNLU UK Store'].map((brand,i)=>({...base,brand,id:'brand'+i,name:'PLA '+i})),sources:[],brandDirectory:['SUNLU','SUNLU.UK','Sunlu','SUNLU UK Store']};
A.loadData();
assert.equal(controls.brand.options.filter(o=>o.value==='SUNLU').length,1);
assert.equal(controls.brand.options.length,2);
assert.equal((controls.brandCloud.innerHTML.match(/>SUNLU<\//g)||[]).length,1,'Coverage brands must merge aliases too');
for(const brand of ['Creality','creality','Creality3D','Creality 3D'])assert.equal(M.canonicalBrand(brand),'Creality');
for(const brand of ['BEDROCK3D','Bedrock3D'])assert.equal(M.canonicalBrand(brand),'Bedrock3D');
const compactContext={window:{}};vm.createContext(compactContext);vm.runInContext(fs.readFileSync('data/price-finder-lite.js','utf8'),compactContext);
const products=compactContext.window.PRINTPROFIT_PRICE_DATA.products;
assert.ok(products.length>0);
const matches=products.filter(p=>M.matchesSearch(p,'sunlu black pla',context.window.PRINTPROFIT_CATEGORIES.classify(p)));
assert.ok(matches.length>0,'Current catalogue should contain SUNLU black PLA results');
context.window.PRINTPROFIT_PRICE_DATA=compactContext.window.PRINTPROFIT_PRICE_DATA;
controls.search.value='';controls.sort.value='price';controls.minPrice.value='';controls.maxPrice.value='';
A.loadData();
const real=vm.runInContext('db.products',context),samples=new Map(),facets=new Set();
for(const product of real){
 const category=context.window.PRINTPROFIT_CATEGORIES.classify(product);
 const keys=['brand:'+product.brand,'retailer:'+product.retailer,'type:'+category.id,'colour:'+M.colourFamily(product.colour),'stock:'+M.stockState(product.availability)];
 if(keys.some(key=>!facets.has(key))){samples.set(product.id,product);keys.forEach(key=>facets.add(key));}
}
let combinations=0;
for(const product of samples.values()){
 const category=context.window.PRINTPROFIT_CATEGORIES.classify(product);
 Object.assign(controls.category,{value:category.group});controls.type.value=category.id;controls.brand.value=product.brand;controls.retailer.value=product.retailer;controls.colour.value=M.colourFamily(product.colour);controls.availability.value='all';controls.minPrice.value=String(product.price);controls.maxPrice.value=String(product.price);
 assert.ok(A.filtered().some(p=>p.id===product.id),'Exact combined facets/price must retain '+product.id);combinations++;
 controls.maxPrice.value=String(product.price-.01);assert.ok(!A.filtered().some(p=>p.id===product.id));combinations++;
 controls.maxPrice.value=String(product.price);controls.availability.value=M.stockState(product.availability)==='in'?'out':'in';assert.ok(!A.filtered().some(p=>p.id===product.id));combinations++;
}
console.log(`PASS: search, colour families, all sorts, ranges, stock, summaries, distinct packs and brand aliases; ${products.length} real listings, ${matches.length} SUNLU black PLA matches; ${combinations} combined facet/price/stock checks covering every listed brand, retailer, category, colour family and stock state.`);
