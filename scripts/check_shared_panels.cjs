const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const source=fs.readFileSync(path.join(__dirname,'..','ui-modals.js'),'utf8');
const helpers=source.slice(source.indexOf('let parentOverflow'),source.indexOf('function openSettings()'));
const close=source.slice(source.indexOf('function closePanel('),source.indexOf('function openGuide()'));
for(const embedded of [false,true]){
 const events={},hostEvents={},panels=new Map();
 let frameTop=-850,focused='',scrollCalls=0;
 const opener={focus:()=>{focused='opener';document.activeElement=opener}};
 const dialog={style:{},scrollTop:250};
 const button={getClientRects:()=>[{}],focus:()=>{focused='close';document.activeElement=button}};
 const active=new Set();
 const panel={id:'ppGuidePanel',style:{},classList:{add:x=>active.add(x),remove:x=>active.delete(x),contains:x=>active.has(x)},querySelector:s=>s==='button'?button:dialog,querySelectorAll:()=>[button],contains:x=>x===button};
 panels.set(panel.id,panel);
 const document={activeElement:opener,body:{style:{overflow:'auto'},dataset:{}},getElementById:id=>panels.get(id),querySelector:()=>active.has('open')?panel:null,querySelectorAll:()=>active.has('open')?[panel]:[],addEventListener:(name,fn)=>{events[name]=fn}};
 const host={innerHeight:720,document:{body:{style:{overflow:'auto'},dataset:{}}},scrollTo:()=>{scrollCalls++},addEventListener:(name,fn)=>{hostEvents[name]=fn}};
 const window={innerHeight:720,frameElement:{getBoundingClientRect:()=>({top:frameTop})},scrollTo:()=>{scrollCalls++},addEventListener:(name,fn)=>{events[name]=fn}};
 window.parent=embedded?host:window;
 const context={window,document,requestAnimationFrame:fn=>fn()};vm.createContext(context);
 vm.runInContext(helpers+close,context);context.showPanel(panel);
 assert.equal(scrollCalls,0,'Opening a guide must not scroll either page');
 assert.equal(panel.style.top,embedded?'850px':'0px');
 assert.equal(panel.style.height,'720px');assert.equal(dialog.scrollTop,0);
 assert.equal(document.body.style.overflow,'hidden');assert.equal(focused,'close');
 if(embedded){assert.equal(host.document.body.style.overflow,'hidden');frameTop=-640;hostEvents.scroll();assert.equal(panel.style.top,'640px');host.innerHeight=600;hostEvents.resize();assert.equal(panel.style.height,'600px');}
 events.keydown({key:'Escape',preventDefault(){}});
 assert.equal(active.has('open'),false,'Escape works when Guide is the first panel opened');
 assert.equal(document.body.style.overflow,'auto');assert.equal(focused,'opener');
 if(embedded)assert.equal(host.document.body.style.overflow,'auto');
 assert.equal(scrollCalls,0,'Closing the guide must preserve the page position');
}
console.log('PASS: shared Guide/Settings preserve standalone and iframe page positions, close on Escape, and restore focus and scrolling.');
