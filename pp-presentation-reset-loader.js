(()=>{
'use strict';
/* Load the presentation reset after the calculator's dynamically injected style layers,
   then load the final visual layer so the new design always wins the cascade. */
const resetHref='./pp-presentation-reset.css?v=20260928-clean4';
const designHref='./pp-final-design.css?v=20260928-final5';
function addStylesheet(href,marker){
  if(document.querySelector('link[data-'+marker+']'))return;
  const link=document.createElement('link');
  link.rel='stylesheet';
  link.href=href;
  link.dataset[marker]='1';
  document.head.appendChild(link);
}
function load(){
  addStylesheet(resetHref,'ppPresentationReset');
  addStylesheet(designHref,'ppFinalDesign');
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',load,{once:true});
else load();
})();