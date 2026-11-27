const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
let now=Date.parse('2026-11-19T12:00:00Z'),tick;
class Clock extends Date{static now(){return now;}}
class Element{constructor(tag){this.tagName=tag;this.children=[];this.textContent='';}append(...children){this.children.push(...children);}replaceChildren(...children){this.children=children;}addEventListener(){}}
const host=new Element('div'),base={approved:true,title:'Test deal',terms:'Verified test terms',retailer:'Shop',productIds:['one'],url:'https://retailer.example/product',lastChecked:'2026-11-19T11:00:00Z',expiresAt:'2026-11-19T12:01:00Z'};
const offers=[base,...[{approved:false},{terms:''},{url:'javascript:bad'},{productIds:[]},{lastChecked:'2026-10-01T12:00:00Z'},{lastChecked:'2099-01-01T00:00:00Z'},{expiresAt:'2026-11-18T00:00:00Z'},{startsAt:'2026-11-20T00:00:00Z'}].map(change=>({...base,...change}))];
const ctx={window:{PRINTPROFIT_OFFERS:offers},document:{getElementById:()=>host,createElement:tag=>new Element(tag),addEventListener(){}},Date:Clock,URL,setInterval:fn=>tick=fn};
vm.createContext(ctx);vm.runInContext(fs.readFileSync('deals.js','utf8'),ctx);
assert.equal(host.children.length,1);assert.equal(host.children[0].tagName,'article');
const first=host.children[0];tick();assert.equal(host.children[0],first,'An unchanged offer list must preserve focused controls');
now+=120000;tick();assert.equal(host.children.length,1);assert.equal(host.children[0].className,'empty-state','Offers must expire while the page stays open');
const productSource=fs.readFileSync('product-offers.js','utf8');
const matching=productSource.slice(productSource.indexOf('function matching('),productSource.indexOf('function start('));
const productContext={offers:()=>offers,safeUrl:value=>value?.startsWith('https://')?value:null,Date:Clock,Array,Number};vm.createContext(productContext);vm.runInContext(matching+'\nglobalThis.match=matching;',productContext);
now=Date.parse('2026-11-19T12:00:00Z');assert.equal(productContext.match({id:'one',retailer:'Shop'}).length,1);assert.equal(productContext.match({id:'wrong',retailer:'Shop'}).length,0);assert.equal(productContext.match({id:'one',retailer:'Other'}).length,0);
// An unconfirmed retailer expiry must use a recheck deadline, and a general
// campaign must never produce a coupon badge on an arbitrary catalogue item.
offers.splice(0,offers.length,{...base,expiresAt:undefined,reviewBy:'2026-11-19T12:01:00Z',scope:'retailer',productIds:[]});
tick();assert.equal(host.children[0].tagName,'article');
assert.equal(productContext.match({id:'one',retailer:'Shop'}).length,0);
assert.ok(host.children[0].children.some(e=>e.textContent.includes('Recheck by:')));
now+=60000;tick();assert.equal(host.children[0].className,'empty-state','A recheck deadline hides the offer while the page remains open');
offers.splice(0,offers.length,{...base,expiresAt:undefined});tick();assert.equal(host.children[0].className,'empty-state','No expiry or recheck deadline is invalid');
// Validate the published records against real catalogue ownership, without
// mistaking a retailer campaign for eligibility of every product it sells.
const actual={window:{}};vm.createContext(actual);vm.runInContext(fs.readFileSync('data/product-offers.js','utf8'),actual);
const products=new Map(JSON.parse(fs.readFileSync('data/price-finder.json','utf8')).products.map(p=>[String(p.id),p]));
for(const offer of actual.window.PRINTPROFIT_OFFERS){
 assert.ok(Array.isArray(offer.productIds));assert.ok(offer.productIds.length||offer.scope==='retailer');
 for(const id of offer.productIds)assert.equal(products.get(id)?.retailer,offer.retailer,'Coupon must match the exact retailer and product');
 for(const value of [offer.url,offer.sourceUrl])assert.equal(new URL(value).protocol,'https:');
 assert.ok(Number.isFinite(Date.parse(offer.expiresAt||offer.reviewBy)));
 assert.ok(/(?:Z|[+-]\d\d:\d\d)$/.test(offer.expiresAt||offer.reviewBy),'Deadlines need an explicit timezone');
}
console.log('PASS: approval, terms, HTTPS, product/retailer identity, freshness, future start/check dates and expiry while open; unchanged lists retain focus.');
