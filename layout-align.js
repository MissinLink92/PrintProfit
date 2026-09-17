(()=>{
  'use strict';
  if(window.__printProfitLayoutAlignInstalled)return;
  window.__printProfitLayoutAlignInstalled=true;

  function install(){
    if(document.getElementById('ppLayoutAlignStyles'))return true;
    const style=document.createElement('style');
    style.id='ppLayoutAlignStyles';
    style.textContent=`
      /* Keep each two-card tab visually aligned on desktop. */
      @media(min-width:951px){
        .pp-tab-panel[data-panel="details"],
        .pp-tab-panel[data-panel="machine"],
        .pp-tab-panel[data-panel="costs"]{
          align-items:stretch;
        }
        .pp-tab-panel[data-panel="details"]>.pp-card,
        .pp-tab-panel[data-panel="machine"]>.pp-card,
        .pp-tab-panel[data-panel="costs"]>.pp-cost-block{
          height:100%;
          display:flex;
        }
        .pp-tab-panel[data-panel="details"]>.pp-card>.panel,
        .pp-tab-panel[data-panel="machine"]>.pp-card>.panel,
        .pp-tab-panel[data-panel="costs"]>.pp-cost-block>.panel{
          height:100%;
          width:100%;
        }
      }
    `;
    document.head.appendChild(style);
    return true;
  }

  function wait(){
    if(install())return;
    const started=Date.now();
    const timer=setInterval(()=>{
      if(install()||Date.now()-started>=15000)clearInterval(timer);
    },50);
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',wait,{once:true});
  else wait();
})();
