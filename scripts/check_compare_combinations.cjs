const assert=require('node:assert/strict'),fs=require('node:fs');
const {page,controls,window,M}=require('./compare_test_runtime.cjs')();
const products=page.products(),fields=['category','type','brand','retailer','colour','availability'];
assert.ok(products.every(product=>product.brand),'Missing brands must have a usable fallback');
const facts=products.map(product=>{const category=page.categoryInfo(product);return {product,category,values:[category.group,category.id,product.brand,product.retailer,M.colourFamily(product.colour),M.stockState(product.availability)]};});
const combinations=new Map(),domains=fields.map(()=>new Set(['all']));
let productChecks=0,priceChecks=0,searchChecks=0;
for(const {product,category,values}of facts){
 values.forEach((value,i)=>domains[i].add(value));
 for(let mask=0;mask<64;mask++){
  const choices=values.map((value,i)=>mask&(1<<i)?value:'all'),key=JSON.stringify(choices);
  let combination=combinations.get(key);if(!combination){combination={choices,ids:new Set()};combinations.set(key,combination);}combination.ids.add(product.id);
  const state=Object.fromEntries(fields.map((id,i)=>[id,choices[i]]));
  assert.ok(M.matchesFilters(product,state,category),key+' must retain '+product.id);productChecks++;
 }
 const state=Object.fromEntries(fields.map((id,i)=>[id,values[i]]));
 for(const [minPrice,maxPrice,expected]of [[product.price,product.price,true],[product.price+.01,'',false],['',product.price-.01,false],[product.price+1,product.price-1,false]]){
  assert.equal(M.matchesFilters(product,{...state,minPrice,maxPrice},category),expected,product.id+' price boundary');priceChecks++;
 }
 for(const name of [product.name,product.name.toUpperCase()]){assert.ok(M.matchesSearch(product,name,category),'Copied exact listing title: '+product.id);searchChecks++;}
 assert.ok(M.matchesSearch(product,product.brand,category),'Brand search must retain '+product.id);searchChecks++;
}
function setChoices(choices){fields.forEach((id,i)=>controls[id].value=choices[i]);}
function sameRows(rows,ids,label){assert.equal(rows.length,ids.size,label);for(const row of rows)assert.ok(ids.has(row.id),label+' unexpected '+row.id);}
let latticeChecks=0;
for(const {choices,ids}of combinations.values()){
 setChoices(choices);sameRows(page.filtered({sortResults:false}),ids,JSON.stringify(choices));latticeChecks++;
 if(latticeChecks%10000===0)console.log('Checked '+latticeChecks+' feasible combinations');
}
// Exhaust every pair, including incompatible category/type, brand/retailer and stock/colour choices.
page.resetComparisonFilters();let pairChecks=0;
for(let a=0;a<fields.length;a++)for(let b=a+1;b<fields.length;b++)for(const av of domains[a])for(const bv of domains[b]){
 const choices=fields.map(()=> 'all');choices[a]=av;choices[b]=bv;setChoices(choices);
 const expected=new Set(facts.filter(f=>(av==='all'||f.values[a]===av)&&(bv==='all'||f.values[b]===bv)).map(f=>f.product.id));
 sameRows(page.filtered({sortResults:false}),expected,fields[a]+':'+av+' / '+fields[b]+':'+bv);pairChecks++;
}
// Facet counts and disabled states come from independent tuple intersections.
let facetChecks=0;const sampleStates=[fields.map(()=> 'all')];
for(let i=0;i<fields.length;i++)for(const value of domains[i]){const choices=fields.map(()=> 'all');choices[i]=value;sampleStates.push(choices);}
for(const choices of sampleStates){
 setChoices(choices);page.refreshFacets();
 for(let dimension=0;dimension<fields.length;dimension++)for(const option of controls[fields[dimension]].options){
  const expected=facts.filter(f=>fields.every((id,j)=>j===dimension||dimension===0&&j===1||choices[j]==='all'||choices[j]===f.values[j])&&(option.value==='all'||f.values[dimension]===option.value)).length;
  assert.equal(Number(option.textContent.match(/\((\d+)\)$/)?.[1]),expected,fields[dimension]+':'+option.value+' count');
  assert.equal(option.disabled,expected===0&&option.value!==choices[dimension]&&option.value!=='all');facetChecks++;
 }
}
// Exercise every sort/view/stock/selected mode with price edge cases through the page.
page.resetComparisonFilters();page.setSelection(products.slice(0,17).map(p=>p.id));let orderingChecks=0;
for(const selectedOnly of [false,true])for(const availability of ['all','in','out','unknown'])for(const sort of ['price','unit','name','retailer','updated'])for(const view of ['all','price','unit','fresh'])for(const [min,max]of [['',''],['0','20'],['20','20'],['100','10'],['999999','']]){
 Object.assign(controls.availability,{value:availability});controls.sort.value=sort;controls.view.value=view;controls.minPrice.value=min;controls.maxPrice.value=max;window.__compareSelectedOnly=selectedOnly;
 const expected=new Set(facts.filter(f=>(availability==='all'||f.values[5]===availability)&&(!selectedOnly||products.slice(0,17).some(p=>p.id===f.product.id))&&(min===''||f.product.price>=Number(min))&&(max===''||f.product.price<=Number(max))).map(f=>f.product.id));
 const rows=page.filtered();sameRows(rows,expected,'sort/view/stock/price/selection');const mode=view==='all'?sort:view;
 for(let i=1;i<rows.length;i++)assert.ok(M.compareProducts(rows[i-1],rows[i],mode)<=0,mode+' order');orderingChecks++;
}
// Recovery must leave selections intact and clear every result restriction.
page.resetComparisonFilters();page.setSelection([]);window.__compareSelectedOnly=true;page.render();assert.equal(page.filtered().length,0);assert.ok(controls.empty.innerHTML.includes('Selected only is on'));
page.resetComparisonFilters();assert.equal(page.filtered().length,products.length);assert.equal(window.__compareSelectedOnly,false);
controls.search.value='SUNLU black PLA';controls.brand.value='Bambu Lab';page.render();assert.equal(page.filtered().length,0);assert.ok(controls.empty.innerHTML.includes('Clear filters and keep search'));
page.resetComparisonFilters(true);assert.ok(page.filtered().length>0);assert.equal(controls.search.value,'SUNLU black PLA');
controls.search.value='no-such-product-987';page.render();assert.equal(page.filtered().length,0);assert.ok(controls.empty.innerHTML.includes('No catalogue listings match this search'));
page.resetComparisonFilters();controls.minPrice.value='100';controls.maxPrice.value='10';page.render();assert.ok(controls.empty.innerHTML.includes('minimum price is higher'));page.removeFilter('price');assert.equal(page.filtered().length,products.length);
controls.colour.value='#Black';page.render();assert.equal(controls.colour.value,'Black');assert.ok(page.filtered().length>0);
const report={products:products.length,productSubsetChecks:productChecks,feasibleFilterCombinations:latticeChecks,pairwiseCombinations:pairChecks,facetOptionChecks:facetChecks,priceBoundaries:priceChecks,searchIdentityChecks:searchChecks,sortViewStockPriceSelectionCombinations:orderingChecks,recovery:'passed',limitations:'All feasible combinations of the six discrete catalogue facets and every pair (including impossible pairs). Search text and numeric prices use identity/boundary cases; arbitrary strings and continuous ranges are not finite.'};
if(process.env.PP_COMPARE_REPORT)fs.writeFileSync(process.env.PP_COMPARE_REPORT,JSON.stringify(report,null,2)+'\n');
console.log('PASS: '+JSON.stringify(report));
