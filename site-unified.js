(()=>{
'use strict';
const allowed=new Set(['book','calculator','chart','coins','compare','cube','download','file','filament','folder','home','package','power','printer','printer-settings','profit','save','search','settings','tag','time','truck','undo','wrench']);
document.querySelectorAll('[data-pp-icon]').forEach(host=>{
 const name=host.getAttribute('data-pp-icon');
 if(!allowed.has(name)||host.querySelector(':scope > .pp-page-icon'))return;
 const icon=document.createElement('span');icon.className='pp-page-icon';icon.setAttribute('aria-hidden','true');
 const svg=document.createElementNS('http://www.w3.org/2000/svg','svg');svg.setAttribute('viewBox','0 0 48 48');
 const use=document.createElementNS('http://www.w3.org/2000/svg','use');use.setAttribute('href','./assets/printprofit-icon-master.svg#pp-'+name);
 svg.append(use);icon.append(svg);
 const calculatorArt={calculator:12,chart:12,coins:6,cube:2,filament:2,package:8,power:3,printer:0,'printer-settings':1,profit:12,time:4,truck:7,wrench:5,tag:11,file:9,save:10};
 const actionArt={download:1,undo:3};
 const navigationArt={home:0,folder:1,compare:2,search:2,book:3,settings:4};
 if(Object.prototype.hasOwnProperty.call(calculatorArt,name)){
  const position=(calculatorArt[name]/13*100).toFixed(3)+'% center';
  icon.style.backgroundImage="url('./assets/printprofit-calculator-icons.webp?v=1')";
  icon.style.backgroundSize='1400% 100%';icon.style.backgroundPosition=position;icon.classList.add('pp-art-icon');
 }else if(Object.prototype.hasOwnProperty.call(navigationArt,name)){
  const position=(navigationArt[name]/4*100).toFixed(3)+'% center';
  icon.style.backgroundImage="url('./assets/printprofit-nav-icons.webp?v=1')";
  icon.style.backgroundSize='500% 100%';icon.style.backgroundPosition=position;icon.classList.add('pp-art-icon');
 }else if(Object.prototype.hasOwnProperty.call(actionArt,name)){
  icon.style.backgroundImage="url('./assets/printprofit-action-icons.webp?v=1')";
  icon.style.backgroundSize='600% 100%';icon.style.backgroundPosition=(actionArt[name]/5*100).toFixed(3)+'% center';icon.classList.add('pp-art-icon');
 }else icon.append(svg);
 host.prepend(icon);
});
})();
