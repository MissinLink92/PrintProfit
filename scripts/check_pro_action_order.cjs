/* Reproduce the browser's listener order: inventory loads before the async Pro gate. */
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const inventory=fs.readFileSync('my-materials.js','utf8');
const handler=inventory.slice(inventory.indexOf("document.addEventListener('click',e=>{"),inventory.indexOf("document.addEventListener('change',e=>{"));
const source=fs.readFileSync('pro-subscription.js','utf8');
const gate=source.slice(source.indexOf('const approved=new WeakSet()'),source.indexOf("document.addEventListener('pp-workshop-open'"));
async function simulate(allowed){
 const listeners=[];let deductions=0,release;
 const pending=new Promise(resolve=>release=resolve),waits=[];
 const target={dataset:{},hasAttribute:name=>name==='data-mark-printed'};
 function click(){const event={target:{closest:()=>target},stopped:false,preventDefault(){},stopImmediatePropagation(){this.stopped=true;}};for(const fn of listeners){const result=fn(event);if(result?.then)waits.push(result);if(event.stopped)break;}return event;}
 target.click=click;
 const context={window:{},document:{addEventListener:(name,fn)=>{if(name==='click')listeners.push(fn);}},markPrinted:()=>deductions++,requirePro:()=>pending,text(){},WeakSet,Date};
 vm.createContext(context);vm.runInContext(handler,context);vm.runInContext(gate,context);
 click();assert.equal(deductions,0,'Original click must wait for approval');
 const repeat=click();assert.ok(repeat.stopped,'Repeated click must remain blocked while checking');assert.equal(deductions,0);
 release(allowed);await Promise.all(waits);
 assert.equal(deductions,allowed?1:0,'One approved user action must deduct exactly once');
}
(async()=>{await simulate(true);await simulate(false);console.log('PASS: Pro click ordering, pending double-click blocking, denied access and exactly one stock deduction.');})().catch(error=>{console.error(error);process.exitCode=1;});
