(()=>{
'use strict';
if(window.__printProfitVisualPolish)return;window.__printProfitVisualPolish=true;

function install(){
  if(!document.body)return false;
  document.getElementById('ppVisualPolish')?.remove();
  const s=document.createElement('style');
  s.id='ppVisualPolish';
  s.textContent=`
/* PrintProfit Premium Visual System
   Visual-only layer: no calculator logic, state, navigation or event handlers changed. */

:root{
  --ppv-bg:#07121b;
  --ppv-bg2:#0b1c27;
  --ppv-panel:#0d2230;
  --ppv-panel2:#102a39;
  --ppv-line:#294958;
  --ppv-line2:#355d6d;
  --ppv-text:#f5f9fb;
  --ppv-muted:#a8bbc5;
  --ppv-cyan:#35d6e5;
  --ppv-blue:#5da9ff;
  --ppv-violet:#a98bff;
  --ppv-green:#45df91;
  --ppv-orange:#ff8a24;
}

/* Global readability */
body{
  color:var(--ppv-text)!important;
  background:linear-gradient(180deg,var(--ppv-bg),#091923 55%,var(--ppv-bg))!important;
}
p,.small,.hint,.help,.muted{color:var(--ppv-muted)!important}
h1,h2,h3,h4,strong{color:var(--ppv-text)!important}
label,.label{color:#d7e4e9!important;font-size:12px!important;font-weight:800!important;letter-spacing:.01em!important}
input,select,textarea{
  font-size:14px!important;
  line-height:1.35!important;
  min-height:42px!important;
  color:var(--ppv-text)!important;
  background:#091b26!important;
  border:1px solid var(--ppv-line2)!important;
  border-radius:10px!important;
}
input::placeholder,textarea::placeholder{color:#78919d!important}
input:focus,select:focus,textarea:focus{
  border-color:var(--ppv-cyan)!important;
  box-shadow:0 0 0 2px rgba(53,214,229,.14)!important;
}

/* Panels: clean premium surfaces */
section.panel,.panel,.merge-block,.pp-card,.pp-cost-block{
  background:linear-gradient(180deg,var(--ppv-panel),var(--ppv-panel2))!important;
  border-color:var(--ppv-line)!important;
  border-radius:16px!important;
  box-shadow:0 12px 30px rgba(0,0,0,.20),inset 0 1px 0 rgba(255,255,255,.035)!important;
}
section.panel>.head,.panel>.head,.merge-block>.head{
  min-height:58px!important;
  gap:14px!important;
}
section.panel>.head h2,.panel>.head h2,.merge-block>.head h2{
  font-size:17px!important;
  line-height:1.2!important;
  letter-spacing:-.01em!important;
}
section.panel>.head p,.panel>.head p,.merge-block>.head p{
  font-size:11.5px!important;
  line-height:1.45!important;
  color:var(--ppv-muted)!important;
}

/* Icons: larger, crisp, restrained */
section.panel .head>.icon,
section.panel .head>.pp-pretty-icon,
.merge-block .head>.icon,
.merge-block .head>.pp-pretty-icon{
  width:52px!important;height:52px!important;min-width:52px!important;
  flex:0 0 52px!important;border-radius:14px!important;
  background:linear-gradient(145deg,#132f3d,#0b202c)!important;
  border:1px solid #3c6676!important;
  box-shadow:0 8px 20px rgba(0,0,0,.28),inset 0 1px 0 rgba(255,255,255,.05)!important;
  display:grid!important;place-items:center!important;
}
section.panel .head>.icon svg,
section.panel .head>.pp-pretty-icon svg,
.merge-block .head>.icon svg,
.merge-block .head>.pp-pretty-icon svg{
  width:31px!important;height:31px!important;
  stroke:var(--ppv-cyan)!important;
  stroke-width:2.2!important;
  filter:none!important;
}
section.panel:nth-of-type(2) .head>.icon svg{stroke:var(--ppv-blue)!important}
section.panel:nth-of-type(3) .head>.icon svg{stroke:var(--ppv-violet)!important}
section.panel:nth-of-type(4) .head>.icon svg{stroke:var(--ppv-green)!important}

/* Journey cards */
#pp-master-quickcards{gap:12px!important}
#pp-master-quickcards button{
  min-height:92px!important;
  padding:14px!important;
  border-radius:15px!important;
  background:linear-gradient(145deg,#102a38,#0b202c)!important;
  border:1px solid var(--ppv-line)!important;
  box-shadow:0 10px 24px rgba(0,0,0,.22)!important;
}
#pp-master-quickcards button:hover{
  border-color:#477485!important;
  transform:translateY(-1px);
}
#pp-master-quickcards .pp-master-card-icon{
  width:58px!important;height:58px!important;
  min-width:58px!important;
  border-radius:15px!important;
  background:#0a1d28!important;
  border:1px solid #3c6676!important;
  box-shadow:none!important;
}
#pp-master-quickcards .pp-master-card-icon svg{
  width:32px!important;height:32px!important;
  stroke-width:2.2!important;
}
#pp-master-quickcards button:nth-child(1) .pp-master-card-icon svg{stroke:var(--ppv-cyan)!important}
#pp-master-quickcards button:nth-child(2) .pp-master-card-icon svg{stroke:var(--ppv-violet)!important}
#pp-master-quickcards button:nth-child(3) .pp-master-card-icon svg{stroke:var(--ppv-green)!important}
#pp-master-quickcards .pp-flow-number{
  font-size:11px!important;
  font-weight:900!important;
}

/* Buttons: readable and obvious */
button,.btn{
  font-size:13px!important;
  font-weight:850!important;
  min-height:42px!important;
  border-radius:10px!important;
  letter-spacing:.01em!important;
}
.btn.accent,.pp-main-cta,.pp-settings-apply{
  background:linear-gradient(135deg,#ff9b48,var(--ppv-orange))!important;
  color:#17100a!important;
  border-color:var(--ppv-orange)!important;
  box-shadow:0 8px 22px rgba(255,138,36,.18)!important;
}
.btn:not(.accent){
  background:#102733!important;
  color:#e8f2f5!important;
  border-color:#3a6170!important;
}

/* Tabs/navigation */
.pp-step,.tab{
  font-size:12px!important;
  font-weight:850!important;
}
.pp-step-copy strong{font-size:13px!important}
.pp-step-copy span{font-size:10.5px!important;color:var(--ppv-muted)!important}
.pp-step.active{border-color:var(--ppv-cyan)!important}
.pp-step.active .pp-step-number{background:var(--ppv-cyan)!important;color:#062027!important}

/* Results / important figures */
.result,.results,.pp-result-card{
  border-radius:16px!important;
}
#profit,#batchProfit,.profit,[data-role="profit"]{
  color:var(--ppv-green)!important;
  font-weight:950!important;
}
.result strong,.pp-result-card strong{font-size:18px!important}

/* Accessibility */
:focus-visible{outline:2px solid var(--ppv-cyan)!important;outline-offset:2px!important}
@media(max-width:650px){
  section.panel .head>.icon,
  section.panel .head>.pp-pretty-icon,
  .merge-block .head>.icon,
  .merge-block .head>.pp-pretty-icon{
    width:48px!important;height:48px!important;min-width:48px!important;flex-basis:48px!important;
  }
  section.panel .head>.icon svg,
  section.panel .head>.pp-pretty-icon svg,
  .merge-block .head>.icon svg,
  .merge-block .head>.pp-pretty-icon svg{
    width:28px!important;height:28px!important;
  }
  section.panel>.head h2,.panel>.head h2,.merge-block>.head h2{font-size:16px!important}
  label,.label{font-size:12.5px!important}
}
`;
  document.head.appendChild(s);
  return true;
}
function boot(){if(install())return;const t=setInterval(()=>{if(install())clearInterval(t)},50);setTimeout(()=>clearInterval(t),15000)}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();