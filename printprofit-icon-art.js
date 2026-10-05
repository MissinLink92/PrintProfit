(()=>{'use strict';
if(window.__printProfitReferenceIconArt)return;
window.__printProfitReferenceIconArt=true;

const style=document.createElement('style');
style.id='ppReferenceIconArtStyles';
style.textContent=[
  '#ppVisualMaster .pvm-journey{display:grid!important;grid-template-columns:repeat(4,minmax(0,1fr))!important;width:min(1280px,calc(100% - 36px))!important;gap:14px!important;align-items:stretch!important;margin:10px auto 24px!important}',
  '#ppVisualMaster .pvm-journey>em{display:none!important}',
  '#ppVisualMaster .pvm-journey>button{display:flex!important;flex-direction:column!important;align-items:stretch!important;justify-content:flex-start!important;width:auto!important;min-width:0!important;min-height:220px!important;gap:8px!important;padding:10px!important;border-radius:18px!important;overflow:hidden!important;text-align:center!important}',
  '#ppVisualMaster .pvm-journey .jicon{display:grid!important;place-items:center!important;width:100%!important;min-width:0!important;height:auto!important;aspect-ratio:360/246!important;flex:0 0 auto!important;border:0!important;border-radius:13px!important;overflow:hidden!important;background:linear-gradient(145deg,#102532,#071018)!important;box-shadow:0 8px 24px rgba(0,0,0,.28)!important}',
  '#ppVisualMaster .pvm-journey .jicon svg{display:block!important;width:min(78px,48%)!important;height:auto!important;max-height:100%!important}',
  '#ppVisualMaster .pvm-journey .n{display:none!important}',
  '#ppVisualMaster .pvm-journey button>span:last-child{display:flex!important;flex-direction:column!important;align-items:center!important;width:100%!important;min-width:0!important;gap:4px!important}',
  '#ppVisualMaster .pvm-journey button>span:last-child strong{font-size:14px!important;line-height:1.15!important}',
  '#ppVisualMaster .pvm-journey button>span:last-child small{font-size:10.5px!important;line-height:1.28!important}',
  '#ppVisualMaster .pvm-nav button{gap:7px!important}',
  '#ppVisualMaster .pvm-nav .pvm-icon{display:grid!important;place-items:center!important;width:34px!important;height:34px!important;min-width:34px!important;flex:0 0 34px!important;border-radius:10px!important;overflow:hidden!important}',
  '#ppVisualMaster .pvm-nav .pvm-icon svg{display:block!important;width:24px!important;height:24px!important}',
  '#resultTabs .pp-reference-tab-icon{display:inline-block!important;width:22px!important;height:22px!important;min-width:22px!important;margin-right:7px!important;vertical-align:middle!important;overflow:hidden!important}',
  '#resultTabs .pp-reference-tab-icon svg{display:block!important;width:100%!important;height:100%!important;fill:none!important;stroke:currentColor!important;stroke-width:2.4!important;stroke-linecap:round!important;stroke-linejoin:round!important}',
  '#calc>.pp-reference-calc-button-icon{display:inline-grid!important;place-items:center!important;width:22px!important;height:22px!important;min-width:22px!important;margin-right:8px!important;vertical-align:middle!important}',
  '#calc>.pp-reference-calc-button-icon svg{display:block!important;width:22px!important;height:22px!important;fill:none!important;stroke:currentColor!important;stroke-width:2.4!important;stroke-linecap:round!important;stroke-linejoin:round!important}',
  '@media(max-width:900px){#ppVisualMaster .pvm-journey{grid-template-columns:repeat(2,minmax(0,1fr))!important;width:min(720px,calc(100% - 28px))!important;gap:12px!important}#ppVisualMaster .pvm-journey>button{min-height:0!important}}',
  '@media(max-width:520px){#ppVisualMaster .pvm-journey{grid-template-columns:1fr!important;width:min(360px,calc(100% - 24px))!important;gap:10px!important}#ppVisualMaster .pvm-journey>button{padding:9px!important}}'
].join('\n');
(document.head||document.documentElement).appendChild(style);

function setMasterButtonIcon(button,symbol,className){
  if(!button)return;
  let slot=button.querySelector(':scope > .'+className);
  if(!slot){
    slot=document.createElement('span');
    slot.className=className;
    button.querySelectorAll(':scope > svg').forEach(svg=>svg.remove());
    button.insertBefore(slot,button.firstChild);
  }
  if(slot.dataset.ppSymbol===symbol)return;
  slot.innerHTML='<svg viewBox="0 0 48 48" aria-hidden="true" focusable="false"><use href="./assets/printprofit-icon-master.svg#pp-'+symbol+'"></use></svg>';
  slot.dataset.ppSymbol=symbol;
}

function apply(){
  [['single','printer'],['batch','coins']].forEach(([mode,symbol])=>{
    setMasterButtonIcon(document.querySelector('#resultTabs .tab[data-result-tab="'+mode+'"]'),symbol,'pp-reference-tab-icon');
  });
  setMasterButtonIcon(document.getElementById('calc'),'calculator','pp-reference-calc-button-icon');
}

apply();
if(!window.__ppReferenceIconObserver){
  window.__ppReferenceIconObserver=true;
  const observer=new MutationObserver(apply);
  observer.observe(document.body,{childList:true,subtree:true});
  setTimeout(()=>observer.disconnect(),15000);
}
})();

