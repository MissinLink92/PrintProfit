(()=>{'use strict';
if(window.__printProfitReferenceIconArt)return;window.__printProfitReferenceIconArt=true;
const style=document.createElement('style');
style.id='ppReferenceIconArtStyles';
style.textContent=[
'#ppVisualMaster .pvm-journey{display:grid!important;grid-template-columns:repeat(4,minmax(0,1fr))!important;width:min(1280px,calc(100% - 36px))!important;gap:14px!important;align-items:stretch!important;margin:10px auto 24px!important}',
'#ppVisualMaster .pvm-journey>em{display:none!important}',
'#ppVisualMaster .pvm-journey>button{display:flex!important;flex-direction:column!important;align-items:stretch!important;justify-content:flex-start!important;width:auto!important;min-width:0!important;min-height:220px!important;gap:8px!important;padding:10px!important;border-radius:18px!important;overflow:hidden!important;text-align:center!important}',
'#ppVisualMaster .pvm-journey .jicon{display:block!important;width:100%!important;min-width:0!important;height:auto!important;aspect-ratio:360/246!important;flex:0 0 auto!important;border:0!important;border-radius:13px!important;overflow:hidden!important;box-shadow:0 8px 24px rgba(0,0,0,.28)!important}',
'#ppVisualMaster .pvm-journey .jicon svg,#ppVisualMaster .pvm-journey .n{display:none!important}',
'#ppVisualMaster .pvm-journey button>span:last-child{display:flex!important;flex-direction:column!important;align-items:center!important;width:100%!important;min-width:0!important;gap:4px!important}',
'#ppVisualMaster .pvm-journey button>span:last-child strong{font-size:14px!important;line-height:1.15!important}',
'#ppVisualMaster .pvm-journey button>span:last-child small{font-size:10.5px!important;line-height:1.28!important}',
'#ppVisualMaster .pvm-nav button{gap:7px!important}',
'#ppVisualMaster .pvm-nav .pvm-icon{display:block!important;width:34px!important;height:34px!important;min-width:34px!important;flex:0 0 34px!important;border-radius:10px!important;overflow:hidden!important}',
'#ppVisualMaster .pvm-nav .pvm-icon svg{display:none!important}',
'.shell .head>.icon.pp-reference-calc-icon,.shell .merge-block .head>.icon.pp-reference-calc-icon{overflow:hidden!important;border:0!important;border-radius:13px!important;box-shadow:none!important;padding:0!important}',
'.shell .pp-reference-action-icon{display:inline-block!important;width:34px!important;height:34px!important;min-width:34px!important;flex:0 0 34px!important;margin-inline-end:6px!important;border-radius:10px!important;vertical-align:middle!important}',
'@media(max-width:900px){#ppVisualMaster .pvm-journey{grid-template-columns:repeat(2,minmax(0,1fr))!important;width:min(720px,calc(100% - 28px))!important;gap:12px!important}#ppVisualMaster .pvm-journey>button{min-height:0!important}}',
'@media(max-width:520px){#ppVisualMaster .pvm-journey{grid-template-columns:1fr!important;width:min(360px,calc(100% - 24px))!important;gap:10px!important}#ppVisualMaster .pvm-journey>button{padding:9px!important}}'
].join('\n');
(document.head||document.documentElement).appendChild(style);
const pct=(i,count)=>((count<=1?0:(i/(count-1))*100).toFixed(3))+'% center';
function setSprite(el,file,count,i){
el.style.setProperty('background','none','important');
el.style.setProperty('background-image','url("./assets/'+file+'?v=1")','important');
el.style.setProperty('background-size',count+'00% 100%','important');
el.style.setProperty('background-repeat','no-repeat','important');
el.style.setProperty('background-position',pct(i,count),'important');
}
function apply(){
const root=document.getElementById('ppVisualMaster');
if(!root)return false;
root.querySelectorAll('.pvm-journey .jicon').forEach((el,i)=>{
el.setAttribute('aria-hidden','true');
setSprite(el,'printprofit-step-icons.webp',4,Math.min(i,3));
});
root.querySelectorAll('.pvm-nav .pvm-icon').forEach((el,i)=>{
setSprite(el,'printprofit-nav-icons.webp',5,Math.min(i,4));
});
const calcIndexes=[null,1,0,2,10,6,3,11,9,7,12,13];
document.querySelectorAll('.shell .head>.icon').forEach((el,i)=>{
const n=calcIndexes[i];
if(typeof n!=='number')return;
if(el.querySelector(':scope > svg.pp-missed-icon'))return;
el.replaceChildren();
el.classList.add('pp-reference-calc-icon');
el.style.setProperty('background','none','important');
el.style.setProperty('background-image','url("./assets/printprofit-calculator-icons.webp?v=1")','important');
el.style.setProperty('background-size','1400% 100%','important');
el.style.setProperty('background-repeat','no-repeat','important');
el.style.setProperty('background-position',pct(n,14),'important');
});
const actionRules=[
[/^(save|save project)$/,0],
[/^export( project)?$/,1],
[/^import( project)?$/,2],
[/^(undo|back|undo back|reset|reset calculator)$/,3],
[/^(options|settings|options settings)$/,4],
[/^delete( project)?$/,5]
];
document.querySelectorAll('.shell button,.shell [role="button"]').forEach(btn=>{
if(btn.closest('#ppVisualMaster'))return;
const raw=btn.getAttribute('aria-label')||btn.getAttribute('title')||btn.innerText||btn.textContent||'';
const label=raw.toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
const rule=actionRules.find(([re])=>re.test(label));
if(!rule)return;
let slot=btn.querySelector(':scope > .pp-reference-action-icon');
if(!slot){slot=document.createElement('span');slot.className='pp-reference-action-icon';slot.setAttribute('aria-hidden','true');btn.insertBefore(slot,btn.firstChild);btn.querySelector(':scope > svg')?.style.setProperty('display','none','important');}
setSprite(slot,'printprofit-action-icons.webp',6,rule[1]);
});
return true;
}
if(!apply()){
const observer=new MutationObserver(()=>{if(apply())observer.disconnect()});
observer.observe(document.body,{childList:true,subtree:true});
setTimeout(()=>observer.disconnect(),10000);
}
setTimeout(apply,350);
})();
