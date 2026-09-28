(()=>{
'use strict';
/* Load the presentation reset after the calculator's dynamically injected style layers. */
const href='./pp-presentation-reset.css?v=2';
function load(){
  if(document.querySelector('link[data-pp-presentation-reset]'))return;
  const link=document.createElement('link');
  link.rel='stylesheet';
  link.href=href;
  link.dataset.ppPresentationReset='1';
  document.head.appendChild(link);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',load,{once:true});
else load();
})();
