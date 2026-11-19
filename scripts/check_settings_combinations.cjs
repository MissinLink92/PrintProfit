/* Use the actual Settings implementation to test changing material/unit combinations. */
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const source=fs.readFileSync('settings-preferences.js','utf8');
const units=source.slice(source.indexOf('function applyUnits(){'),source.indexOf('\nfunction currency(){'));
const controls={materialType:{value:'filament'},materialPack:{value:'1000',style:{}},materialUsed:{value:'100',style:{}}},labels={materialPack:{},materialUsed:{}};
const document={getElementById:id=>controls[id],createElement:()=>({listeners:{},addEventListener(type,fn){this.listeners[type]=fn;},remove(){delete controls[this.id];}})};
for(const element of [controls.materialPack,controls.materialUsed]){
 element.insertAdjacentElement=(_,proxy)=>controls[proxy.id]=proxy;element.dispatchEvent=()=>{};
}
const ctx={document,pref:{units:'imperial'},unitFields:['materialPack','materialUsed'],labelFor:id=>labels[id],Event:class{},Number};
vm.createContext(ctx);vm.runInContext(units+'\nglobalThis.apply=applyUnits;',ctx);
ctx.apply();
assert.equal(controls.ppUnit_materialPack.value,'35.27');
assert.equal(controls.materialPack.value,'1000','Changing display units must preserve exact metric input');
controls.materialType.value='resin';ctx.apply();
assert.equal(labels.materialPack.textContent,'Bottle volume (fl oz)');
controls.ppUnit_materialUsed.value='1';controls.ppUnit_materialUsed.listeners.input();
assert.equal(Number(controls.materialUsed.value),29.5735295625,'Existing imperial input must use fluid ounces after switching to resin');
controls.materialType.value='filament';ctx.apply();
controls.ppUnit_materialUsed.value='1';controls.ppUnit_materialUsed.listeners.input();
assert.equal(Number(controls.materialUsed.value),28.349523125);
ctx.pref.units='metric';ctx.apply();
assert.ok(!controls.ppUnit_materialUsed);
assert.equal(controls.materialUsed.style.display,'');
const load=source.slice(source.indexOf('function load(){'),source.indexOf('\nlet pref=load();'));
const rates={GBP:{rate:1},EUR:{rate:1.2}},defaults={dark:true,language:'en',units:'metric',currency:'GBP',rate:1};
for(const raw of ['null','[]','{}','{"units":"bad","language":"bad","currency":"bad","dark":"no","rate":"Infinity"}','{"currency":"GBP","rate":99}']){
 const context={Object,Number,currencies:rates,defaults,KEY:'test',localStorage:{getItem:()=>raw}};vm.createContext(context);vm.runInContext(load+'\nglobalThis.saved=load();',context);
 assert.equal(context.saved.currency,'GBP');assert.equal(context.saved.rate,1);assert.equal(context.saved.language,'en');assert.equal(context.saved.units,'metric');assert.equal(context.saved.dark,true);
}
const context={Object,Number,currencies:rates,defaults,KEY:'test',localStorage:{getItem:()=>'{"currency":"EUR","rate":1.5,"units":"imperial","language":"fr","dark":false}'}};
vm.createContext(context);vm.runInContext(load+'\nglobalThis.saved=load();',context);
assert.equal(context.saved.rate,1.5);assert.equal(context.saved.units,'imperial');assert.equal(context.saved.language,'fr');assert.equal(context.saved.dark,false);
console.log('PASS: metric/imperial x filament/resin transitions, fractional pack ounces, exact source values, invalid saved preferences and manual exchange rates.');
const resetSource=fs.readFileSync('reset-fix.js','utf8'),reset=resetSource.slice(resetSource.indexOf('  function resetAllFields(){'),resetSource.indexOf('\n  function install(){'));
const resetControls=Object.fromEntries(['qty','materialPack','materialUsed','materialPackCost','sell','ppCur_materialPackCost'].map(id=>[id,{id,type:'number',value:'99',defaultValue:id==='materialPack'?'1000':'0',closest:()=>null,classList:{contains:className=>className==='ppPreferenceInput'&&id.startsWith('ppCur_')}}]));
resetControls.farmMirror={id:'farmMirror',type:'number',value:'99',defaultValue:'0',closest:selector=>selector.includes('#ppFarmDetails')?{}:null};
const changed=[],resetContext={Array,document:{querySelectorAll:selector=>selector==='input,select,textarea'?Object.values(resetControls):[]},setValue:(id,value)=>resetControls[id].value=value,dispatchFieldChange:el=>changed.push(el.id),window:{},resetModelDisplay(){},recalculate(){},forceSingleResultMode(){},manualSellingPrice:99,quickMode:'single'};
vm.createContext(resetContext);vm.runInContext(reset+'\nresetAllFields();',resetContext);
assert.equal(resetControls.qty.value,'1');assert.equal(resetControls.materialPack.value,'1000');assert.equal(resetControls.materialPackCost.value,'0');
assert.ok(!changed.includes('ppCur_materialPackCost'),'Display proxies must not overwrite the reset canonical values');
assert.ok(!changed.includes('farmMirror'),'Farm quantity mirror must not overwrite the reset print count');
console.log('PASS: reset restores one print, preserves package defaults and excludes currency/unit display proxies.');
