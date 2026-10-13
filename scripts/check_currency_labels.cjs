const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const {runtime,textNode}=require('./check_i18n.cjs');
(async()=>{
 const {window,document}=await runtime('pl');
 const chooser=textNode('Choose File'),cost=textNode('Purchase price (£)'),price=textNode('£169.00');
 const nestedInput={value:'169'};
 for(const node of [chooser,cost]){
  const label={input:nestedInput,get textContent(){return node.nodeValue},set textContent(value){this.input=null;node.nodeValue=value},closest:selector=>selector==='label'?label:null};
  node.parentElement=label;
 }
 const nodes=[chooser,cost,price];
 document.createTreeWalker=()=>{let i=0;return{nextNode:()=>nodes[i++]||null}};
 document.getElementById=()=>null;
 const readonly={value:'£2.00'};
 document.querySelectorAll=selector=>selector==='label'?[chooser.parentElement,cost.parentElement]:selector==='input[readonly]'?[readonly]:[];
 const pref={currency:'USD',rate:1.337};
 const source=fs.readFileSync(path.join(__dirname,'..','settings-preferences.js'),'utf8');
 const constants=source.slice(source.indexOf('const currencies='),source.indexOf('// The calculator'));
 const format=source.slice(source.indexOf('function currency(){'),source.indexOf('window.__ppAfterI18n=currency;'));
 const context={window,document,NodeFilter:{SHOW_TEXT:4},pref,baseMoneyText:new WeakMap(),baseMoneyInput:new WeakMap(),Intl};
 vm.runInNewContext(constants+format+'window.__ppAfterI18n=currency;',context);
 window.__ppApplyI18n('pl');
 assert.equal(chooser.nodeValue,'Wybierz plik','Polish letters must not be treated as currency symbols');
 assert.equal(cost.nodeValue,'Cena zakupu ($)');
 assert.equal(cost.parentElement.input,nestedInput,'Currency labels must preserve their nested controls');
 assert.equal(price.nodeValue,'$225.95');
 assert.equal(readonly.value,'$2.67');
 readonly.value='$110.00';
 window.__ppApplyI18n('en');
 assert.equal(readonly.value,'$110.00','Fresh core results must never be overwritten by stale cached amounts');
 assert.equal(chooser.nodeValue,'Choose File');assert.equal(cost.nodeValue,'Purchase price ($)');
 pref.currency='PLN';pref.rate=5.0892;window.__ppApplyI18n('pl');
 assert.equal(chooser.nodeValue,'Wybierz plik');assert.equal(cost.nodeValue,'Cena zakupu (zł)');
 assert.equal(cost.parentElement.input,nestedInput);
 console.log('PASS: currency formatting preserves Polish words, nested inputs, and language restoration.');
})().catch(error=>{console.error(error);process.exitCode=1});
