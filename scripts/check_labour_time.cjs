const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
class Node{
 constructor(tag){this.tagName=tag;this.children=[];this.handlers={};this.value='';}
 appendChild(n){this.children.push(n);n.parentElement=this;}
 setAttribute(k,v){this[k]=v;}
 addEventListener(k,f){(this.handlers[k]??=[]).push(f);}
 dispatchEvent(e){for(const f of this.handlers[e.type]||[])f(e);}
 querySelector(s){return s==='label'?this.children.find(n=>n.tagName==='label'):null;}
}
const wrap=new Node('div'),source=new Node('input');source.id='labourHours';source.value='1.5';wrap.appendChild(new Node('label'));wrap.appendChild(source);
const document={getElementById:id=>id==='labourHours'?source:null,createElement:t=>new Node(t),head:new Node('head')};
const ctx={window:{},document,Event:class{constructor(type){this.type=type}}};vm.runInNewContext(fs.readFileSync('labour-time-input.js','utf8'),ctx);
const [hours,minutes]=wrap.children[2].children.map(label=>label.children[0]);
assert.equal(hours.value,'1');assert.equal(minutes.value,'30');
hours.value='2';minutes.value='15';minutes.dispatchEvent({type:'input'});assert.equal(Number(source.value),2.25);assert.equal(Number(source.value)*20,45);
source.value='.75';source.dispatchEvent({type:'change'});assert.equal(hours.value,'0');assert.equal(minutes.value,'45');
source.value='0';source.dispatchEvent({type:'input'});assert.equal(hours.value,'0');assert.equal(minutes.value,'0');
hours.value='-2';minutes.value='99';minutes.dispatchEvent({type:'input'});assert.equal(hours.value,'0');assert.equal(minutes.value,'59');
assert.ok(!hours.id&&!minutes.id,'Only canonical decimal hours should enter saved projects');
console.log('PASS: labour hours/minutes update the existing cost field, restore old decimal projects, reset and constrain minutes.');
