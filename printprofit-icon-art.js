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
'#resultTabs .pp-reference-tab-icon{display:inline-block!important;width:22px!important;height:22px!important;min-width:22px!important;margin-right:7px!important;vertical-align:middle!important;overflow:hidden!important}',
'#resultTabs .pp-reference-tab-icon svg{display:block!important;width:100%!important;height:100%!important;fill:none!important;stroke:currentColor!important;stroke-width:2.4!important;stroke-linecap:round!important;stroke-linejoin:round!important}',
'#calc>.pp-reference-calc-button-icon{display:inline-grid!important;place-items:center!important;width:22px!important;height:22px!important;min-width:22px!important;margin-right:8px!important;vertical-align:middle!important}',
'#calc>.pp-reference-calc-button-icon svg{display:block!important;width:22px!important;height:22px!important;fill:none!important;stroke:currentColor!important;stroke-width:2.4!important;stroke-linecap:round!important;stroke-linejoin:round!important}',
'.shell .head>.icon.pp-reference-calc-icon,.shell .merge-block .head>.icon.pp-reference-calc-icon{overflow:hidden!important;border:0!important;border-radius:13px!important;box-shadow:none!important;padding:0!important}',
'#ppPrinterProfile .pp-profile-icon.pp-reference-calc-icon,#ppProfitAdvisor .pp-profit-icon.pp-reference-calc-icon{overflow:hidden!important;border:0!important;box-shadow:none!important;padding:0!important;background:none!important}',
'#ppPrinterProfile .pp-profile-icon.pp-reference-calc-icon{border-radius:13px!important}',
'#ppProfitAdvisor .pp-profit-icon.pp-reference-calc-icon{border-radius:9px!important}',
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
const calcIconByHeading={"print setup":1,"printer":0,"material":2,"quantity / batch pricing":12,"operating costs":10,"additional costs":6,"electricity":3,"selling & fulfilment":11,"platform fees":9,"delivery":7,"results":12};
document.querySelectorAll('.shell .head>.icon').forEach(el=>{
const heading=el.parentElement?.querySelector('h2,h3')?.textContent||'';
const title=heading.replace(/^\s*\d+\s*\.\s*/,'').replace(/\s+/g,' ').trim().toLowerCase();
const n=calcIconByHeading[title];
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
function setSpriteIcon(holder,index,key){
if(!holder)return false;
if(holder.dataset.ppReferenceIcon===key&&!holder.querySelector(':scope > svg'))return true;
holder.replaceChildren();
holder.classList.add('pp-reference-calc-icon');
setSprite(holder,'printprofit-calculator-icons.webp',14,index);
holder.dataset.ppReferenceIcon=key;
return true;
}
function setMasterButtonIcon(button,symbol,className){
if(!button)return;
let slot=button.querySelector(':scope > .'+className);
if(!slot){slot=document.createElement('span');slot.className=className;button.querySelectorAll(':scope > svg').forEach(svg=>svg.remove());button.insertBefore(slot,button.firstChild);}
if(slot.dataset.ppSymbol===symbol)return;
slot.innerHTML='<svg viewBox="0 0 48 48" aria-hidden="true" focusable="false"><use href="./assets/printprofit-icon-master.svg#pp-'+symbol+'"></use></svg>';
slot.dataset.ppSymbol=symbol;
}
function applySpecialIcons(){
setSpriteIcon(document.querySelector('#ppPrinterProfile .pp-profile-icon'),1,'printer-settings');
setSpriteIcon(document.querySelector('#ppProfitAdvisor .pp-profit-icon'),13,'profit-advisor');
[['single','printer'],['batch','coins']].forEach(([mode,symbol])=>{
const button=document.querySelector('#resultTabs .tab[data-result-tab="'+mode+'"]');
setMasterButtonIcon(button,symbol,'pp-reference-tab-icon');
});
setMasterButtonIcon(document.getElementById('calc'),'calculator','pp-reference-calc-button-icon');
}
function watchSpecialIcons(){
if(window.__ppReferenceIconSpriteObserver)return;
window.__ppReferenceIconSpriteObserver=true;
const observer=new MutationObserver(()=>applySpecialIcons());
observer.observe(document.body,{childList:true,subtree:true});
setTimeout(()=>observer.disconnect(),15000);
}
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
applySpecialIcons();
return true;
}
if(!apply()){
const observer=new MutationObserver(()=>{if(apply())observer.disconnect()});
observer.observe(document.body,{childList:true,subtree:true});
setTimeout(()=>observer.disconnect(),10000);
}
watchSpecialIcons();
setTimeout(()=>{apply();watchSpecialIcons()},350);
})();
