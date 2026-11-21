/* Shared, testable rules for Compare Products. Prices remain retailer snapshots. */
(()=>{
'use strict';
const normalise=value=>String(value??'').normalize('NFKC').toLowerCase()
 .replace(/\bhs(?=pla|petg)/g,'')
 .replace(/\bpla\s*(?:plus|pro)\b/g,'pla+').replace(/\bpla\s*\+\s*/g,'pla+ ').replace(/\bpet\s+g\b/g,'petg')
 .replace(/\bfff\b/g,'fdm').replace(/\bgray\b/g,'grey').replace(/\bsunlu(?:\.uk| uk store| uk)\b/g,'sunlu')
 .replace(/\bcreality\s*3d\b/g,'creality').replace(/\bbedrock\s+3d\b/g,'bedrock3d').replace(/\beasy\s+threed\b/g,'easythreed')
 .replace(/(\d)\s*(kg|mm|g)\b/g,'$1$2');
const tokens=value=>normalise(value).match(/[\p{L}\p{N}]+(?:\.[\p{L}\p{N}]+)*(?:\+)?/gu)||[];
function canonicalBrand(value){
 const name=String(value??'').trim().replace(/\s+/g,' '),key=normalise(name).replace(/[^a-z0-9]/g,'');
 return ({sunlu:'SUNLU',creality:'Creality',creality3d:'Creality',bedrock3d:'Bedrock3D',easythreed:'EasyThreed'})[key]||name;
}
const materialPattern=/\b(?:e?pla\+|e?pla|rpla|petg|pctg|pet|abs|asa|tpu|tpe|nylon|pa(?:6|12|66)?|pc|pva|hips|resin)(?=$|[^a-z0-9])/g;
function materialKinds(text){return [...new Set((normalise(text).match(materialPattern)||[]).map(v=>v.replace(/^[er](?=pla)/,'')))];}
function selectedMaterial(product){
 const [base,...variant]=String(product.name||'').split(' — ');
 const selected=materialKinds(variant.join(' — '));
 return selected.length?selected:materialKinds(base).length?materialKinds(base):materialKinds(product.type);
}
const searchCache=new WeakMap();
let previousQuery=null,queryTokens=[],normalisedQuery='';
function matchesSearch(product,query,category){
 const queryText=String(query??'');
 if(queryText!==previousQuery){previousQuery=queryText;queryTokens=tokens(queryText);normalisedQuery=normalise(queryText).trim();}
 const wanted=queryTokens;if(!wanted.length)return true;
 // Category labels may mention sibling materials. They are navigation, not product identity.
 const text=[product.name,product.brand,product.colour,product.retailer,product.pack,product.type,
  category?.group==='printer'?category.label:''].filter(Boolean).join(' ');
 const signature=String(!!category?.material)+'|'+text;
 let cached=searchCache.get(product);
 if(cached?.signature!==signature){cached={signature,name:normalise(product.name).trim(),haystack:new Set(tokens(text)),materials:category?.material?selectedMaterial(product):null};searchCache.set(product,cached);}
 // A copied complete listing title identifies the exact selected variant.
 if(normalisedQuery===cached.name)return true;
 const {haystack,materials}=cached;
 return wanted.every(token=>{
  if(materials&&materialKinds(token).includes(token))return materials.length===1&&materials[0]===token;
  return haystack.has(token);
 });
}
const colourLabels=['Black','White','Grey','Blue','Red','Green','Yellow','Orange','Purple','Pink','Brown','Beige','Gold','Silver','Clear','Multicolour','Other / unspecified'];
const colourCache=new Map();
function colourFamily(value){
 const key=String(value??'');
 if(colourCache.has(key))return colourCache.get(key);
 const result=classifyColour(key);colourCache.set(key,result);return result;
}
function classifyColour(value){
 let text=normalise(value).replace(/blue[ -]grey/g,'grey').replace(/rose[ -]gold/g,'gold');
 if(/\b(?:rainbow|multicolou?r|assorted|random|dual[ -]colou?r|tri[ -]colou?r)\b/.test(text))return 'Multicolour';
 if(/\b(?:clear|transparent|translucent)\b/.test(text))return 'Clear';
 const aliases={black:'black|charcoal|anthracite|ebony',white:'white|ivory',grey:'grey',blue:'blue|cyan|azure|navy|teal',red:'red|maroon|burgundy',green:'green|lime|olive',yellow:'yellow|lemon',orange:'orange',purple:'purple|violet|lavender|lilac',pink:'pink|magenta',brown:'brown|chocolate|coffee',beige:'beige|cream|sand|skin',gold:'gold|brass',silver:'silver'};
 const found=Object.entries(aliases).filter(([,words])=>new RegExp('\\b(?:'+words+')\\b').test(text)).map(([colour])=>colour);
 if(found.length>1)return 'Multicolour';
 return found.length?found[0][0].toUpperCase()+found[0].slice(1):'Other / unspecified';
}
function stockState(value){
 const text=String(value??'').trim().toLowerCase().replace(/^https?:\/\/(?:www\.)?schema\.org\//,'');
 if(['in stock','instock','available'].includes(text))return 'in';
 if(['out of stock','outofstock','sold out','soldout','unavailable from current catalogue'].includes(text))return 'out';
 return 'unknown';
}
function amount(value){
 if(value==null||typeof value==='boolean'||String(value).trim()==='')return Infinity;
 const number=Number(value);return Number.isFinite(number)&&number>0?number:Infinity;
}
function matchesFilters(product,state,category){
 const chosen=value=>value&&value!=='all';
 if(state.search&&!matchesSearch(product,state.search,category))return false;
 if(chosen(state.category)&&state.category!==category.id&&state.category!==category.group)return false;
 if(chosen(state.type)&&state.type!==category.id)return false;
 if(chosen(state.brand)&&state.brand!==product.brand)return false;
 if(chosen(state.retailer)&&state.retailer!==product.retailer)return false;
 if(chosen(state.colour)&&state.colour!==colourFamily(product.colour))return false;
 if(chosen(state.availability)&&state.availability!==stockState(product.availability))return false;
 if(state.minPrice!==''&&state.minPrice!=null||state.maxPrice!==''&&state.maxPrice!=null){
  const price=amount(product.price),min=state.minPrice===''||state.minPrice==null?0:Number(state.minPrice),max=state.maxPrice===''||state.maxPrice==null?Infinity:Number(state.maxPrice);
  if(!Number.isFinite(price)||!(price>=min&&price<=max))return false;
 }
 return true;
}
function currentOffer(product,now=Date.now()){
 const checked=Date.parse(product.updated);
 return !product.sourceUnavailable&&product.lastCheckStatus==='ok'&&stockState(product.availability)==='in'&&
  Number.isFinite(checked)&&checked<=now&&checked>=now-7*86400000&&Number.isFinite(amount(product.price));
}
function compareProducts(a,b,mode){
 const difference=(x,y)=>x===y?0:x<y?-1:1;
 const fallback=()=>difference(amount(a.price),amount(b.price))||String(a.name||'').localeCompare(String(b.name||''))||String(a.id).localeCompare(String(b.id));
 if(mode==='unit')return difference(amount(a.unit),amount(b.unit))||fallback();
 if(mode==='name')return String(a.name||'').localeCompare(String(b.name||''))||fallback();
 if(mode==='retailer')return String(a.retailer||'').localeCompare(String(b.retailer||''))||fallback();
 if(mode==='fresh'||mode==='updated'){
  const date=p=>Number.isFinite(Date.parse(p.updated))?Date.parse(p.updated):-Infinity;
  return difference(date(b),date(a))||fallback();
 }
 return fallback();
}
const api={normalise,tokens,canonicalBrand,selectedMaterial,matchesSearch,matchesFilters,colourLabels,colourFamily,stockState,amount,currentOffer,compareProducts};
if(typeof module==='object'&&module.exports)module.exports=api;
if(typeof window==='object')window.PRINTPROFIT_COMPARE=api;
})();
