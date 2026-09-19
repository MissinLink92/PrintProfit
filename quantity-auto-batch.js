(()=>{
'use strict';
if(window.__printProfitAutoBatch)return;
window.__printProfitAutoBatch=true;

function install(){
  const qty=document.getElementById('qty');
  const tabs=document.getElementById('resultTabs');
  if(!qty||!tabs)return false;

  const setMode=(mode)=>{
    const button=tabs.querySelector('.tab[data-result-tab="'+mode+'"]');
    if(button)button.click();
  };

  const sync=()=>{
    const value=Math.max(1,Math.floor(Number(qty.value)||1));
    if(value>1)setMode('batch');
    else setMode('single');
  };

  qty.addEventListener('input',sync);
  qty.addEventListener('change',sync);
  sync();
  return true;
}

function boot(){
  if(install())return;
  const started=Date.now();
  const timer=setInterval(()=>{
    if(install()||Date.now()-started>15000)clearInterval(timer);
  },50);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});
else boot();
})();