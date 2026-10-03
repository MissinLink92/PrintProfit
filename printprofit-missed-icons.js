(()=>{'use strict';
if(window.__printProfitMissedIconArt)return;
window.__printProfitMissedIconArt=true;

const asset='./assets/printprofit-missed-icons.svg?v=2';
const iconMarkup=id=>'<svg class="pp-missed-icon pp-missed-icon-'+id+'" viewBox="0 0 48 48" aria-hidden="true" focusable="false"><use href="'+asset+'#pp-missed-'+id+'"></use></svg>';

function setIcon(holder,id){
  if(!holder)return false;
  holder.classList.remove('pp-reference-calc-icon');
  ['background','background-image','background-size','background-repeat','background-position'].forEach(name=>holder.style.removeProperty(name));
  const current=holder.querySelector(':scope > svg.pp-missed-icon use');
  if(current?.getAttribute('href')===asset+'#pp-missed-'+id){
    holder.dataset.ppMissedIcon=id;
    return true;
  }
  holder.innerHTML=iconMarkup(id);
  holder.dataset.ppMissedIcon=id;
  holder.setAttribute('aria-hidden','true');
  return true;
}

function installStyles(){
  if(document.getElementById('ppMissedIconStyles'))return;
  const style=document.createElement('style');
  style.id='ppMissedIconStyles';
  style.textContent=[
    '.pp-missed-icon{display:block!important;width:35px!important;height:35px!important;min-width:35px!important;min-height:35px!important;overflow:visible!important;fill:none!important;stroke:none!important}',
    '.pp-missed-inline-icon{display:inline-block!important;vertical-align:-4px!important;width:20px!important;height:20px!important;min-width:20px!important;min-height:20px!important;margin-right:6px!important}',
    '.pp-profit-icon{font-size:0!important;line-height:0!important}',
    '#ppProfitAdvisor .pp-profit-icon>.pp-missed-icon{width:27px!important;height:27px!important;min-width:27px!important;min-height:27px!important}',
    '#ppPrinterProfile .pp-profile-icon>.pp-missed-icon{width:34px!important;height:34px!important;min-width:34px!important;min-height:34px!important}',
    '@media(max-width:650px){.pp-missed-icon{width:29px!important;height:29px!important;min-width:29px!important;min-height:29px!important}#ppProfitAdvisor .pp-profit-icon>.pp-missed-icon{width:24px!important;height:24px!important;min-width:24px!important;min-height:24px!important}}'
  ].join('\n');
  (document.head||document.documentElement).appendChild(style);
}

function applyHelpInfoIcon(){
  const panel=[...document.querySelectorAll('.shell .two > .panel')].find(el=>/not sure about a field/i.test(el.textContent||''));
  const head=panel?.querySelector('.head');
  if(!head)return;
  const heading=[...head.querySelectorAll('h2,h3,h4,strong,b')].find(el=>/not sure about a field/i.test(el.textContent||''))||head;
  const walker=document.createTreeWalker(heading,NodeFilter.SHOW_TEXT);
  let textNode;
  while((textNode=walker.nextNode()))textNode.textContent=textNode.textContent.replace(/[ⓘℹ]\s*/,'');
  if(heading.querySelector(':scope > .pp-missed-inline-icon'))return;
  const ns='http://www.w3.org/2000/svg';
  const icon=document.createElementNS(ns,'svg');
  icon.setAttribute('class','pp-missed-icon pp-missed-inline-icon');
  icon.setAttribute('viewBox','0 0 48 48');
  icon.setAttribute('aria-hidden','true');
  icon.setAttribute('focusable','false');
  const use=document.createElementNS(ns,'use');
  use.setAttribute('href',asset+'#pp-missed-info');
  icon.appendChild(use);
  heading.insertBefore(icon,heading.firstChild);
}

function apply(){
  installStyles();
  applyHelpInfoIcon();
  const modelHeading=[...document.querySelectorAll('.shell .head h2,.shell .head h3')]
    .find(el=>el.textContent.trim().replace(/\s+/g,' ').toLowerCase()==='your model');
  setIcon(modelHeading?.closest('.head')?.querySelector(':scope > .icon'),'model-cube');
  const infoHeading=[...document.querySelectorAll('.shell .head h2,.shell .head h3')]
    .find(el=>el.textContent.trim().toLowerCase()==='print information');
  setIcon(infoHeading?.closest('.head')?.querySelector(':scope > .icon'),'results-document');
  setIcon(document.querySelector('#ppProfitAdvisor .pp-profit-icon'),'profit-bulb');
  setIcon(document.querySelector('#about > .head > .icon'),'results-document');
  setIcon(document.querySelector('#ppPrinterProfile .pp-profile-icon'),'printer-gear');
}

function watchAdvisor(){
  const host=document.getElementById('ppProfitAdvisor');
  if(!host)return false;
  const observer=new MutationObserver(()=>apply());
  observer.observe(host,{childList:true,subtree:true});
  return true;
}

apply();
if(!watchAdvisor()){
  const observer=new MutationObserver(()=>{
    apply();
    if(watchAdvisor())observer.disconnect();
  });
  observer.observe(document.body,{childList:true,subtree:true});
  setTimeout(()=>observer.disconnect(),15000);
}
setTimeout(apply,350);
})();