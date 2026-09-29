(()=>{'use strict';if(window.__ppJourneyFinalFix)return;window.__ppJourneyFinalFix=true;
function install(){const wrap=document.getElementById('pp-master-quickcards');if(!wrap)return false;
 const s=document.getElementById('ppJourneyFinalFixStyles')||document.createElement('style');s.id='ppJourneyFinalFixStyles';s.textContent=`
#pp-master-quickcards::before{display:none!important;content:none!important}
#pp-master-quickcards .pp-flow-number{width:24px!important;height:24px!important;min-width:24px!important;min-height:24px!important;border-radius:50%!important;display:grid!important;place-items:center!important;color:#fff!important;background:#ff7800!important;border:2px solid #ff7800!important;box-sizing:border-box!important;line-height:20px!important;font-family:Inter,Segoe UI,Arial,sans-serif!important;font-size:11px!important;font-weight:900!important;box-shadow:0 0 0 3px #071018,0 0 12px #ff780055!important}
#pp-master-quickcards .pp-flow-number:nth-of-type(4){background:#ff7800!important;border-color:#ff7800!important}
`;if(!s.parentNode)document.head.appendChild(s);
 [...wrap.querySelectorAll('*')].forEach(el=>{if((el.textContent||'').trim().toUpperCase()==='YOUR PRINTING COST JOURNEY'){el.remove()}});return true}
function boot(){if(install())return;const t=setInterval(()=>{if(install())clearInterval(t)},50);setTimeout(()=>clearInterval(t),15000)}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();})();