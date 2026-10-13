const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
// Minimal DOM fixture enforces the browser's direct-child insertBefore rule.
class Node{
 constructor(tag){this.tag=tag;this.children=[];this.parentElement=null;this.dataset={};}
 appendChild(node){node.parentElement=this;this.children.push(node);return node;}
 insertBefore(node,anchor){if(anchor&&!this.children.includes(anchor))throw Error('NotFoundError');node.parentElement=this;this.children.splice(anchor?this.children.indexOf(anchor):this.children.length,0,node);}
 remove(){if(this.parentElement)this.parentElement.children=this.parentElement.children.filter(child=>child!==this);this.parentElement=null;}
 closest(tag){for(let node=this;node;node=node.parentElement)if(node.tag===tag)return node;return null;}
 setAttribute(){}
 querySelector(selector){for(const node of this.children){if(selector==='#'+node.id||(selector==='option[value="custom"]'&&node.value==='custom'))return node;const nested=node.querySelector(selector);if(nested)return nested;}return null;}
 dispatchEvent(event){this.events.push(event.type);}
}
class Option extends Node{constructor(label,value){super('option');this.text=label;this.value=value;}}
const printer=new Node('select');printer.value='custom';printer.events=[];
const customGroup=printer.appendChild(new Node('optgroup'));customGroup.appendChild(new Option('Custom printer','custom'));
const profile={id:'test-neptune',name:'Neptune 4',watts:150,price:169,lifetime:3000,materialType:'Filament',updated:1};
const storage=new Map();
const context={document:{getElementById:()=>printer,createElement:tag=>new Node(tag)},Option,
 readPrinters:()=>[profile],SELECTED_PRINTER_KEY:'selected',localStorage:{getItem:key=>storage.get(key)||'',setItem:(key,value)=>storage.set(key,value),removeItem:key=>storage.delete(key)},Event:class{constructor(type){this.type=type}}};
const source=fs.readFileSync(path.join(__dirname,'..','my-materials.js'),'utf8');
vm.runInNewContext(source.slice(source.indexOf('function syncPrinterProfileOptions('),source.indexOf('function renderPrinters(')),context);
context.syncPrinterProfileOptions(profile.id,true);
assert.equal(printer.children[0].id,'ppWorkshopPrinterOptions');assert.equal(printer.children[1],customGroup);
assert.equal(printer.value,'workshop:test-neptune');
let option=printer.children[0].children[0];
assert.equal(option.dataset.watts,'150');assert.equal(option.dataset.price,'169');assert.equal(option.dataset.lifetime,'3000');
context.syncPrinterProfileOptions();assert.equal(printer.value,'workshop:test-neptune');assert.equal(printer.children.length,2);
profile.materialType='Resin';context.syncPrinterProfileOptions(undefined,true);
assert.equal(printer.children[0].children[0].dataset.materialType,'resin');
assert.ok(printer.events.includes('change'));
console.log('PASS: Workshop profiles insert beside grouped presets and retain power, price, lifetime, and selection.');
