const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');

const source=fs.readFileSync('my-materials.js','utf8');
const routing=source.slice(source.indexOf('function setWorkspaceSection('),source.indexOf('function syncWorkshopUsage('));
assert.ok(routing.startsWith('function setWorkspaceSection('),'Workspace routing must be present');
const views=Object.fromEntries(['ppWorkshopAccount','ppWorkspacePro','ppWorkshopMaterialsView','ppWorkshopPrintersView','ppStockOverview','ppMaterialsTitle','ppWorkspaceDescription','ppMaterialScan','ppFarmEnabled','ppPrintFarm','ppBusinessTools'].map(id=>[id,{hidden:true,textContent:'',scrollIntoView(){actions.push('scroll '+id)},focus(){actions.push('focus '+id)},querySelector(selector){return {open:false,focus(){actions.push('focus '+selector)},click(){actions.push('click '+selector)}}}}]));
const actions=[];
const nav=['projects','workshop','pro','account'].map(workspaceSection=>({dataset:{workspaceSection},setAttribute(key,value){this[key]=value},removeAttribute(key){delete this[key]}}));
const tabs={hidden:false};
const context={
 document:{
  getElementById:id=>views[id]||null,
  querySelectorAll:()=>nav,
  querySelector:selector=>selector.includes('.pp-workshop-tabs')?tabs:selector.includes('[data-tab=')?{click(){actions.push('stage '+selector)}}:selector.includes('scanner-toggle')?{click(){actions.push('scanner')}}:null
 },
 window:{},
 setWorkshopTab:name=>{actions.push('tab '+name);views.ppWorkshopMaterialsView.hidden=name!=='materials';views.ppWorkshopPrintersView.hidden=name!=='printers';views.ppStockOverview.hidden=name!=='stock'},
 closeWorkspaceWorkshop:()=>actions.push('close')
};
vm.createContext(context);
vm.runInContext(routing,context);
vm.runInContext('setWorkspaceSection("pro")',context);
assert.equal(views.ppWorkspacePro.hidden,false);
assert.equal(views.ppWorkshopAccount.hidden,true);
assert.equal(views.ppWorkshopMaterialsView.hidden,true);
assert.equal(tabs.hidden,true);
assert.equal(nav[2]['aria-current'],'page');
vm.runInContext('openProTool("production")',context);
assert.ok(actions.some(x=>x.includes('data-tab="machine"')));
assert.ok(actions.includes('focus ppFarmEnabled'));
vm.runInContext('openProTool("scenario")',context);
assert.ok(actions.some(x=>x.includes('data-tab="results"')));
assert.ok(actions.includes('focus [data-pp-pro-tool="scenario"]'));
vm.runInContext('openProTool("scan")',context);
assert.ok(actions.includes('tab materials'));
assert.ok(actions.includes('scanner'));
assert.equal(views.ppWorkspacePro.hidden,true);
assert.equal(views.ppWorkshopMaterialsView.hidden,false);

for(const tool of ['production','scenario','quote','export','scan','subscription'])assert.ok(source.includes('data-pp-pro-tool="'+tool+'"'),'Missing Pro route '+tool);
const projects=fs.readFileSync('my-projects.js','utf8');
assert.ok(projects.includes('data-workspace-section="pro"'),'Projects must link to Pro');
console.log('PASS: Pro Workspace navigation opens the existing planner, business tools and material scanner.');
