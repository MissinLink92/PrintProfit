(()=>{'use strict';
if(window.__printProfitMissedIconArt)return;
window.__printProfitMissedIconArt=true;

const asset='./assets/printprofit-missed-icons.svg';
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
    '.pp-profit-icon{font-size:0!important;line-height:0!important}',
    '#ppProfitAdvisor .pp-profit-icon>.pp-missed-icon{width:27px!important;height:27px!important;min-width:27px!important;min-height:27px!important}',
    '#ppPrinterProfile .pp-profile-icon>.pp-missed-icon{width:34px!important;height:34px!important;min-width:34px!important;min-height:34px!important}',
    '@media(max-width:650px){.pp-missed-icon{width:29px!important;height:29px!important;min-width:29px!important;min-height:29px!important}#ppProfitAdvisor .pp-profit-icon>.pp-missed-icon{width:24px!important;height:24px!important;min-width:24px!important;min-height:24px!important}}'
  ].join('\n');
  (document.head||document.documentElement).appendChild(style);
}

function apply(){
  installStyles();
  const modelHeading=[...document.querySelectorAll('.shell .head h2,.shell .head h3')]
    .find(el=>el.textContent.trim().replace(/\s+/g,' ').toLowerCase()==='your model');
  setIcon(modelHeading?.closest('.head')?.querySelector(':scope > .icon'),'model-cube');
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