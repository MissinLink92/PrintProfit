(()=>{
'use strict';
const allowed=new Set(['book','calculator','chart','coins','compare','cube','download','file','filament','folder','home','package','power','printer','printer-settings','profit','save','search','settings','tag','time','truck','undo','wrench']);
document.querySelectorAll('[data-pp-icon]').forEach(host=>{
 const name=host.getAttribute('data-pp-icon');
 if(!allowed.has(name)||host.querySelector(':scope > .pp-page-icon'))return;
 const icon=document.createElement('span');icon.className='pp-page-icon';icon.setAttribute('aria-hidden','true');
 const svg=document.createElementNS('http://www.w3.org/2000/svg','svg');svg.setAttribute('viewBox','0 0 48 48');
 const use=document.createElementNS('http://www.w3.org/2000/svg','use');use.setAttribute('href','./assets/printprofit-icon-master.svg#pp-'+name);
 svg.append(use);icon.append(svg);host.prepend(icon);
});
})();
