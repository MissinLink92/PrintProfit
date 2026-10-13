// Regression checks for locale startup, changing text, and stable option values.
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.resolve(__dirname,'..');
const languages=['pl','de','fr','es','it'];
async function runtime(language){
 const errors=[];
 const document={title:'PrintProfit',body:{dataset:{}},documentElement:{},querySelectorAll:()=>[],
  createTreeWalker:()=>({nextNode:()=>null}),dispatchEvent(){},addEventListener(){}};
 const window={addEventListener(){}};
 const context={window,document,NodeFilter:{SHOW_TEXT:4},CustomEvent:class {},setTimeout,clearTimeout,
  localStorage:{getItem:()=>JSON.stringify({language})},
  fetch:async url=>({ok:true,json:async()=>JSON.parse(fs.readFileSync(path.join(root,url.split('?')[0]),'utf8'))}),
  console:{warn:(...args)=>errors.push(args)}};
 vm.runInNewContext(fs.readFileSync(path.join(root,'i18n-extra.js'),'utf8'),context);
 await window.__ppI18nReady;
 assert.deepEqual(errors,[],'Every supported language must load without errors');
 assert.ok(window.__ppExtraI18n[language]);return {window,document};
}
function textNode(text){return {nodeValue:text,parentElement:{closest:()=>null}};}
module.exports={runtime,textNode};
if(require.main===module)(async()=>{
 for(const language of languages){
  const {window}=await runtime(language),tr=window.__ppTranslateText;
  for(const key of ['My Workspace','Sign in','Print Setup','Privacy Notice','Upload your sliced print file']){
   assert.notEqual(tr(key,language),key,language+': '+key);
  }
  assert.notEqual(tr('Page 2 of 116',language),'Page 2 of 116');
  assert.notEqual(tr('Showing 21–40 of 2314 matching listings',language),'Showing 21–40 of 2314 matching listings');
  const summary=tr('Last update attempt 13/10/2026 • 1995 prices verified • 2314 listings • 20 sources • 40 brands',language);
  assert.ok(!summary.includes('Last update attempt')&&!summary.includes('prices verified'),language+': full summary must translate');
  assert.equal(tr('Neptune 4',language),'Neptune 4','Product names must remain intact');
  assert.equal(tr('£169.00',language),'£169.00','Display translation must not change numeric costs');
  assert.equal(tr('Print Setup','en'),'Print Setup');
  const map=window.__ppExtraI18n[language];
  for(const [key,value] of Object.entries(map)){
   assert.equal(typeof value,'string');assert.ok(value.trim(),language+': empty translation for '+key);
   const parameters=s=>(s.match(/\{[a-z]+\}/g)||[]).sort();
   assert.deepEqual(parameters(value),parameters(key),language+': mismatched template parameters for '+key);
  }
 }
 const {window,document}=await runtime('pl');
 const type=textNode('Resin'),status=textNode('0 products selected');let submitted;
 const option={get value(){return submitted??type.nodeValue},setAttribute(k,v){if(k==='value')submitted=v}};
 document.querySelectorAll=selector=>selector==='option:not([value])'&&submitted===undefined?[option]:[];
 document.createTreeWalker=()=>{let i=0;return{nextNode:()=>[type,status][i++]||null}};
 window.__ppApplyI18n('pl');
 assert.notEqual(type.nodeValue,'Resin','The label must actually be translated');
 assert.equal(option.value,'Resin','Translating an option must not change its submitted value');
 assert.equal(status.nodeValue,'Wybrane produkty: 0');
 assert.ok(window.__ppIsI18nMutation({type:'characterData',target:status}));
 status.nodeValue='2 products selected';
 assert.ok(!window.__ppIsI18nMutation({type:'characterData',target:status}));
 window.__ppApplyI18n('pl');assert.equal(status.nodeValue,'Wybrane produkty: 2');
 window.__ppApplyI18n('en');assert.equal(status.nodeValue,'2 products selected');assert.equal(type.nodeValue,'Resin');
 console.log('PASS: all five locale files initialize; dynamic counts, English restoration, and option values are stable.');
})().catch(error=>{console.error(error);process.exitCode=1});
