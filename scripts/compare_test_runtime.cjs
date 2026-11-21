/* Run the page's own filtering/rendering code against a small DOM test double. */
const fs=require('node:fs'),vm=require('node:vm'),M=require('../compare-catalogue.js');
module.exports=function runtime(){
 class Element{
  constructor(){this.value='';this.options=[];this.textContent='';this.dataset={};this.style={};this.classList={toggle(){},contains(){return false;}};}
  set innerHTML(html){this.html=html;this.options=[...html.matchAll(/<option[^>]*value="([^"]*)"([^>]*)>([^<]*)/g)].map(m=>({value:m[1],textContent:m[3],disabled:/\bdisabled\b/.test(m[2])}));if(this.options.length)this.value=this.options[0].value;}
  get innerHTML(){return this.html||'';}
  setAttribute(){}
 }
 const html=fs.readFileSync('price-finder.html','utf8'),controls=Object.fromEntries([...html.matchAll(/id="([^"]+)"/g)].map(m=>[m[1],new Element()]));
 const context={window:{PRINTPROFIT_COMPARE:M},document:{getElementById:id=>controls[id],querySelectorAll:()=>[]},URL,Date,console,localStorage:{getItem:()=>null}};
 vm.createContext(context);vm.runInContext(fs.readFileSync('product-categories.js','utf8'),context);
 const script=html.match(/<script>\s*window.addEventListener\('DOMContentLoaded',[\s\S]*?<\/script>/)[0];
 const code=script.slice(script.indexOf("'use strict';"),script.indexOf("document.addEventListener('click',e=>{"));
 vm.runInContext(code+`\nglobalThis.page={filtered,refreshFacets,render,renderFilterHelp,resetComparisonFilters,removeFilter,loadData,categoryInfo,products:()=>db.products,setSelection:ids=>selectedIds=new Set(ids),setModels:value=>elegooModelsOnly=value};`,context);
 context.page.resetComparisonFilters();
 vm.runInContext(fs.readFileSync('data/price-finder-lite.js','utf8'),context);context.page.loadData();
 return {page:context.page,controls,window:context.window,M};
};
