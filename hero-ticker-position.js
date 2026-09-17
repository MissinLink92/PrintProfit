(()=>{
'use strict';
if(window.__printProfitHeroTickerPosition)return;window.__printProfitHeroTickerPosition=true;
function install(){
  const hero=document.querySelector('.hero');
  const ticker=hero?.querySelector('.pp-chosen-ticker');
  if(!hero||!ticker)return false;
  document.getElementById('ppHeroTickerPositionStyles')?.remove();
  const style=document.createElement('style');
  style.id='ppHeroTickerPositionStyles';
  style.textContent=`
/* PrintProfit hero ticker alignment V1 */
.hero .pp-chosen-ticker{
  bottom:46px!important;
}
@media(max-width:820px){
  .hero .pp-chosen-ticker{bottom:34px!important;}
}
@media(max-width:560px){
  .hero .pp-chosen-ticker{bottom:27px!important;}
}
`;
  document.head.appendChild(style);
  return true;
}
function wait(){if(install())return;const started=Date.now();const t=setInterval(()=>{if(install()||Date.now()-started>15000)clearInterval(t)},50);}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',wait,{once:true});else wait();
})();
