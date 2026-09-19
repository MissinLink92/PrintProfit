(()=>{ 
'use strict';
if(window.__printProfitBoxPolish)return;
window.__printProfitBoxPolish=true;

function install(){
 const workspace=document.getElementById('ppTabbedLayout');
 if(!workspace)return false;
 document.getElementById('ppBoxPolishStyles')?.remove();
 const style=document.createElement('style');
 style.id='ppBoxPolishStyles';
 style.textContent=`
/* PrintProfit box & spacing polish */
#ppTabbedLayout{width:100%!important}
.pp-tab-panel.active{gap:14px!important;align-items:stretch!important}
.pp-card,.pp-cost-block{
  padding:14px!important;
  border-radius:14px!important;
  border:1px solid #2a4b5a!important;
  background:linear-gradient(180deg,#0b1d27,#081720)!important;
  box-shadow:0 8px 24px rgba(0,0,0,.16),inset 0 1px 0 rgba(255,255,255,.025)!important;
}
.pp-card>.panel,.pp-cost-block>.panel{
  border:0!important;
  background:transparent!important;
  box-shadow:none!important;
  padding:0!important;
}
.pp-card .head,.pp-cost-block .head{margin-bottom:11px!important}
.pp-card .head h2,.pp-cost-block .head h2{font-size:16px!important}
.pp-card .head p,.pp-cost-block .head p{font-size:10.5px!important}
.pp-card .two,.pp-card .three,.pp-cost-block .two,.pp-cost-block .three{gap:10px!important}
.pp-card input,.pp-card select,.pp-cost-block input,.pp-cost-block select{min-height:38px!important}
.pp-card label,.pp-cost-block label{font-size:10.5px!important;margin-bottom:5px!important}

/* Make the main stage cards feel like one consistent system. */
.pp-model-hub{
  padding:14px!important;
  min-width:0!important;
}
.pp-model-status{
  margin-bottom:10px!important;
  min-height:38px!important;
  display:flex!important;
  align-items:center!important;
  padding:9px 11px!important;
  border-radius:9px!important;
  background:#091a24!important;
}
.pp-model-grid{gap:9px!important}
.pp-model-grid>div{
  min-height:56px!important;
  display:flex!important;
  flex-direction:column!important;
  justify-content:center!important;
  padding:9px 10px!important;
  border-radius:9px!important;
  background:#0a1a23!important;
}
.pp-model-grid span{font-size:9px!important}
.pp-model-grid strong{font-size:12px!important}

/* Upload card: cleaner internal rhythm and less visual clutter. */
.pp-card .drop{
  min-height:132px!important;
  display:flex!important;
  flex-direction:column!important;
  justify-content:center!important;
  padding:14px!important;
  border-radius:10px!important;
}
.pp-card .drop .actions{margin-top:9px!important}
.pp-card .drop small{margin-top:6px!important}

/* Journey cards: slightly tighter, more premium, less bulky. */
#pp-master-quickcards{
  gap:34px!important;
  margin:18px auto 18px!important;
}
#pp-master-quickcards button{
  min-height:96px!important;
  padding:15px 18px!important;
  border-radius:14px!important;
  border-color:#2a4b5a!important;
  background:linear-gradient(180deg,#0b1d27,#081720)!important;
  box-shadow:0 8px 22px rgba(0,0,0,.20),inset 0 1px 0 rgba(255,255,255,.025)!important;
}
#pp-master-quickcards button:hover{
  border-color:#ff780066!important;
  box-shadow:0 12px 28px rgba(0,0,0,.28),0 0 18px #ff78000c!important;
}
#pp-master-quickcards .pp-master-card-icon{
  width:58px!important;height:58px!important;min-width:58px!important;
}

/* Keep the three-stage workspace visually separate from the journey. */
.pp-master-quickcards+.layout{padding-top:0!important}
.pp-progress-host{margin-bottom:14px!important}

/* Results should use the same card language. */
.layout>.result{
  border-radius:14px!important;
}
.layout>.result .panel,.layout>.result .card,.layout>.result .break{
  border-radius:10px!important;
}

/* Settings/other generated cards inherit the same rhythm. */
.pp-settings-card{border-radius:12px!important}
.pp-settings-body{padding:14px!important}
.pp-settings-section-title{margin-top:8px!important}

@media(max-width:950px){
  .pp-tab-panel.active{gap:12px!important}
  .pp-card,.pp-cost-block{padding:12px!important}
}
@media(max-width:650px){
  .pp-tab-panel.active{gap:10px!important}
  .pp-card,.pp-cost-block{padding:11px!important;border-radius:12px!important}
  #pp-master-quickcards{gap:28px!important;margin-top:15px!important}
  #pp-master-quickcards button{min-height:86px!important;padding:13px!important}
}
`;
 document.head.appendChild(style);
 return true;
}
function boot(){
 if(install())return;
 const t=setInterval(()=>{if(install())clearInterval(t)},50);
 setTimeout(()=>clearInterval(t),15000);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();