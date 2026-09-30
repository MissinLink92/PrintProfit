(()=>{'use strict';
/* PrintProfit calculator visual layer — consolidated from the approved visual-only scripts. */
/* ===== visual-polish.js ===== */
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

/* ===== colour-palette.js ===== */
(()=>{'use strict';
if(window.__printProfitColourPalette)return;window.__printProfitColourPalette=true;
function install(){
 if(!document.body)return false;
 document.getElementById('ppColourPaletteStyles')?.remove();
 const s=document.createElement('style');s.id='ppColourPaletteStyles';
 s.textContent=`
:root{
 --pp-orange:#ff7800;
 --pp-orange-soft:#ff9a42;
 --pp-cyan:#27c7d9;
 --pp-cyan-soft:#74e4ee;
 --pp-purple:#a77cff;
 --pp-purple-soft:#c5a9ff;
 --pp-green:#35d07f;
 --pp-green-soft:#78e6a8;
 --pp-bg:#06121b;
 --pp-bg2:#0a1b25;
 --pp-panel:#0b1e29;
 --pp-panel2:#0d222e;
 --pp-line:#294957;
 --pp-line-soft:#203b49;
 --pp-text:#f2f6f8;
 --pp-muted:#91a7b3;
}

/* Overall palette: orange becomes an accent, not the whole UI. */
body{background:var(--pp-bg)!important;color:var(--pp-text)!important}
.panel,.pp-card,.pp-cost-block{
 background:linear-gradient(180deg,var(--pp-panel),var(--pp-bg2))!important;
 border-color:var(--pp-line)!important;
}
.panel:hover,.pp-card:hover,.pp-cost-block:hover{border-color:#355968!important}
.panel .head p,.pp-card .head p,.pp-cost-block .head p{color:var(--pp-muted)!important}
input,select,textarea{
 background:#091a24!important;
 border-color:#294957!important;
 color:var(--pp-text)!important;
}
input:hover,select:hover,textarea:hover{border-color:#3b6372!important}
input:focus,select:focus,textarea:focus{
 border-color:var(--pp-cyan)!important;
 box-shadow:0 0 0 2px #27c7d91c,0 0 16px #27c7d908!important;
}

/* Orange = primary action only. */
.btn.accent,.pp-main-cta,.pp-settings-apply,
.tab.active,.quick .btn.active{
 background:linear-gradient(135deg,var(--pp-orange-soft),var(--pp-orange))!important;
 border-color:var(--pp-orange)!important;
 box-shadow:0 8px 20px #ff780022!important;
}
.btn.accent:hover,.pp-main-cta:hover,.pp-settings-apply:hover{filter:brightness(1.07)!important}

/* Secondary buttons use cool blue-grey. */
.btn:not(.accent),button:not(.pp-main-cta):not(.pp-settings-apply){
 border-color:#355463!important;
}
.btn:not(.accent):hover{border-color:var(--pp-cyan)!important;color:#e9fdff!important}

/* Journey cards: each stage gets a restrained identity colour. */
#pp-master-quickcards button:nth-child(1){--stage:var(--pp-cyan)}
#pp-master-quickcards button:nth-child(2){--stage:var(--pp-purple)}
#pp-master-quickcards button:nth-child(3){--stage:var(--pp-green)}
#pp-master-quickcards button{border-color:#2a4b5a!important}
#pp-master-quickcards button:hover{border-color:color-mix(in srgb,var(--stage) 65%,#294957)!important}
#pp-master-quickcards button .pp-master-card-icon{
 border-color:color-mix(in srgb,var(--stage) 70%,#294957)!important;
 color:var(--stage)!important;
 background:radial-gradient(circle,color-mix(in srgb,var(--stage) 9%,transparent),#08151e)!important;
 box-shadow:0 0 20px color-mix(in srgb,var(--stage) 10%,transparent)!important;
}
#pp-master-quickcards button .pp-master-card-icon svg{stroke:currentColor!important}
#pp-master-quickcards button .pp-flow-number{
 background:var(--stage)!important;
 box-shadow:0 0 14px color-mix(in srgb,var(--stage) 25%,transparent)!important;
}

/* Stage headings/icons. */
.pp-tab-panel[data-panel="details"] .pp-card .head>.icon,
.pp-tab-panel[data-panel="details"] .pp-model-hub .head>.icon{color:var(--pp-cyan)!important}
.pp-tab-panel[data-panel="machine"]>.pp-card .head>.icon{color:var(--pp-purple)!important}
.pp-tab-panel[data-panel="costs"]>.pp-cost-block:nth-child(1) .head>.icon{color:var(--pp-cyan)!important}
.pp-tab-panel[data-panel="costs"]>.pp-cost-block:nth-child(2) .head>.icon{color:var(--pp-green)!important}

/* Don't let the generic orange icon background overpower the new palette. */
.pp-card .head .icon,.pp-cost-block .head .icon{
 background:linear-gradient(145deg,#122b36,#0b1b24)!important;
 border:1px solid #355463!important;
 box-shadow:0 6px 16px #0005!important;
}

/* Progress/stage controls. */
.pp-step.active{background:linear-gradient(180deg,#27c7d90b,#27c7d904)!important}
.pp-step.active::after{background:var(--pp-cyan)!important;box-shadow:0 0 10px #27c7d944!important}
.pp-step.active .pp-step-number{background:var(--pp-cyan)!important;border-color:var(--pp-cyan)!important;box-shadow:0 0 16px #27c7d933!important}
.pp-step.complete .pp-step-number{color:var(--pp-green)!important;border-color:#35d07f66!important;background:#35d07f0d!important}

/* Model information = cyan. */
.pp-model-status{border-color:#275361!important;background:#081c25!important}
.pp-model-grid>div{border-color:#284957!important;background:#091a23!important}
.pp-model-grid>div:hover{border-color:#27c7d955!important}
.pp-model-grid strong{color:#e9f7f9!important}

/* Material-related controls = violet. */
#materialType,#material,#materialPack,#materialPackCost,#materialUsed{
 border-color:#3a3554!important;
}
#materialType:focus,#material:focus,#materialPack:focus,#materialPackCost:focus,#materialUsed:focus{
 border-color:var(--pp-purple)!important;box-shadow:0 0 0 2px #a77cff18!important;
}

/* Money/profit highlights = green. */
#profit,#batchProfit,.profit,.result .profit,[data-role="profit"]{color:var(--pp-green)!important}
#profitValue,#batchProfitValue{color:var(--pp-green)!important}

/* Keep the logo/brand orange and make the orange divider thinner visually. */
.header:after,.hero.pp-chosen-hero:after,.hero:after{
 background:linear-gradient(90deg,transparent,var(--pp-orange),var(--pp-orange-soft),var(--pp-orange),transparent)!important;
 box-shadow:0 0 12px #ff780033!important;
}
.header .nav a.active{background:#ff78000d!important}
.header .nav a.active:after{background:var(--pp-orange)!important;box-shadow:0 0 8px #ff780044!important}

/* Cyan focus/interactive cues. */
.drop:hover{border-color:var(--pp-cyan)!important;background:#27c7d908!important}
#deliveryRateOut{color:var(--pp-green)!important}

/* Reduce the accumulated orange glow. */
.pp-hero-brand-card{box-shadow:inset 0 1px 0 #fff08,0 24px 55px #000a!important}
.pp-master-quickcards button{box-shadow:0 8px 22px #0006,inset 0 1px 0 #fff04!important}
.pp-master-quickcards button:hover{box-shadow:0 12px 28px #0008!important}
`;
 document.head.appendChild(s);return true;
}
function boot(){if(install())return;const t=setInterval(()=>{if(install())clearInterval(t)},50);setTimeout(()=>clearInterval(t),15000)}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();

/* ===== box-spacing-polish.js ===== */
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
/* Stage width: give the calculator content room to breathe instead of leaving a large empty column. */
.pp-tab-panel[data-panel="machine"]{
  grid-template-columns:1fr!important;
}
.pp-tab-panel[data-panel="machine"]>.pp-card{
  width:100%!important;
}
.pp-tab-panel[data-panel="machine"]>.pp-card>.panel{
  width:100%!important;
}
.pp-tab-panel[data-panel="machine"]>.pp-card>.panel .two{
  grid-template-columns:repeat(2,minmax(0,1fr))!important;
  gap:14px!important;
}
.pp-tab-panel[data-panel="details"]{
  grid-template-columns:1fr!important;
}
.pp-tab-panel[data-panel="details"]>.pp-card,
.pp-tab-panel[data-panel="details"]>.pp-model-hub{
  width:100%!important;
}
.pp-tab-panel[data-panel="costs"]{
  grid-template-columns:minmax(0,1fr) minmax(0,1fr)!important;
}

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

/* ===== stage-field-colours.js ===== */
(()=>{'use strict';
if(window.__printProfitStageFieldColours)return;window.__printProfitStageFieldColours=true;
function install(){
 if(!document.body)return false;
 document.getElementById('ppStageFieldColours')?.remove();
 const s=document.createElement('style');s.id='ppStageFieldColours';
 s.textContent=`
/* Stage colour system: carry each journey colour into its working fields. */
.pp-tab-panel{--stage:#27c7d9;--stage-soft:#74e4ee;--stage-rgb:39,199,217}
.pp-tab-panel[data-panel="machine"]{--stage:#a77cff;--stage-soft:#c5a9ff;--stage-rgb:167,124,255}
.pp-tab-panel[data-panel="costs"]{--stage:#35d07f;--stage-soft:#78e6a8;--stage-rgb:53,208,127}

/* Make the three journey tabs and their section icons use the exact same identity colour. */
#pp-master-quickcards button:nth-child(1){--journey:var(--pp-cyan)}
#pp-master-quickcards button:nth-child(2){--journey:var(--pp-purple)}
#pp-master-quickcards button:nth-child(3){--journey:var(--pp-green)}
#pp-master-quickcards button:nth-child(4){--journey:var(--pp-orange)}
#pp-master-quickcards button .pp-master-card-icon{
 border-color:color-mix(in srgb,var(--journey) 70%,#294957)!important;
 color:var(--journey)!important;
 background:radial-gradient(circle,color-mix(in srgb,var(--journey) 9%,transparent),#08151e)!important;
 box-shadow:0 0 20px color-mix(in srgb,var(--journey) 10%,transparent)!important;
}
#pp-master-quickcards button .pp-master-card-icon svg{
 stroke:currentColor!important;
}
#pp-master-quickcards button .pp-flow-number{
 background:var(--journey)!important;
 box-shadow:0 0 14px color-mix(in srgb,var(--journey) 25%,transparent)!important;
}
#pp-master-quickcards button:not(:last-child):after{
 color:#7f96a3!important;
 border-color:#355361!important;
 box-shadow:0 0 0 5px #071018,0 0 12px #0004!important;
}

/* The small feature icons in the hero remain orange as brand/feature indicators,
   rather than pretending to belong to one of the three calculator stages. */

/* Stage headings and section icons */
.pp-tab-panel .head .icon{
 color:var(--stage)!important;
 border-color:color-mix(in srgb,var(--stage) 58%,#355463)!important;
 box-shadow:0 0 0 1px color-mix(in srgb,var(--stage) 8%,transparent),0 7px 18px #0005!important;
}
.pp-tab-panel .head h2{color:var(--text)!important}
.pp-tab-panel .head p{color:var(--muted)!important}

/* Working fields inherit the stage identity without becoming brightly coloured. */
.pp-tab-panel input,
.pp-tab-panel select,
.pp-tab-panel textarea{
 border-color:color-mix(in srgb,var(--stage) 28%,#294957)!important;
 box-shadow:inset 0 1px 0 color-mix(in srgb,var(--stage) 5%,transparent)!important;
}
.pp-tab-panel input:hover,
.pp-tab-panel select:hover,
.pp-tab-panel textarea:hover{
 border-color:color-mix(in srgb,var(--stage) 52%,#294957)!important;
}
.pp-tab-panel input:focus,
.pp-tab-panel select:focus,
.pp-tab-panel textarea:focus{
 border-color:var(--stage)!important;
 box-shadow:0 0 0 2px color-mix(in srgb,var(--stage) 14%,transparent),0 0 18px color-mix(in srgb,var(--stage) 7%,transparent)!important;
}
.pp-tab-panel label{color:color-mix(in srgb,var(--text) 88%,var(--stage))!important}

/* Inner cards/field groups pick up a quiet stage-coloured edge. */
.pp-tab-panel .panel,
.pp-tab-panel .merge-block{
 border-color:color-mix(in srgb,var(--stage) 18%,#294957)!important;
}
.pp-tab-panel .merge-block>.head .icon{
 border-color:color-mix(in srgb,var(--stage) 65%,#355463)!important;
 color:var(--stage)!important;
 background:radial-gradient(circle,color-mix(in srgb,var(--stage) 10%,transparent),#0b1b24)!important;
}
.pp-tab-panel .merge-block:hover{
 border-color:color-mix(in srgb,var(--stage) 30%,#294957)!important;
}

/* Stage 1: model/source information = cyan. */
.pp-tab-panel[data-panel="details"] .drop{
 border-color:color-mix(in srgb,var(--stage) 32%,#294957)!important;
 background:color-mix(in srgb,var(--stage) 2%,#091a24)!important;
}
.pp-tab-panel[data-panel="details"] .drop:hover{
 border-color:var(--stage)!important;
 background:color-mix(in srgb,var(--stage) 6%,#091a24)!important;
}
.pp-tab-panel[data-panel="details"] .btn.accent{
 background:linear-gradient(135deg,var(--pp-orange-soft),var(--pp-orange))!important;
 border-color:var(--pp-orange)!important;
}
.pp-tab-panel[data-panel="details"] .pp-model-grid>div{
 border-color:color-mix(in srgb,var(--stage) 24%,#284957)!important;
}
.pp-tab-panel[data-panel="details"] .pp-model-grid>div:hover{
 border-color:color-mix(in srgb,var(--stage) 60%,#284957)!important;
}
.pp-tab-panel[data-panel="details"] .pp-model-grid strong{color:color-mix(in srgb,var(--text) 92%,var(--stage))!important}

/* Stage 2: printer + material = purple. */
.pp-tab-panel[data-panel="machine"] .print-setup-panel>.head .icon,
.pp-tab-panel[data-panel="machine"] .merge-block>.head .icon{
 color:var(--pp-purple)!important;
}
.pp-tab-panel[data-panel="machine"] .merge-block{
 background:linear-gradient(180deg,color-mix(in srgb,var(--pp-purple) 3%,var(--pp-panel)),var(--pp-bg2))!important;
}
.pp-tab-panel[data-panel="machine"] #materialCostOut{
 color:var(--pp-purple-soft)!important;
 font-weight:800;
}
.pp-tab-panel[data-panel="machine"] #materialStatus{color:color-mix(in srgb,var(--muted) 84%,var(--pp-purple))!important}
.pp-tab-panel[data-panel="machine"] #printer{
 border-color:color-mix(in srgb,var(--pp-purple) 42%,#294957)!important;
}
.pp-tab-panel[data-panel="machine"] #printer:focus{
 border-color:var(--pp-purple)!important;
 box-shadow:0 0 0 2px #a77cff22,0 0 18px #a77cff0d!important;
}
.pp-tab-panel[data-panel="machine"] #materialType,
.pp-tab-panel[data-panel="machine"] #material,
.pp-tab-panel[data-panel="machine"] #materialPack,
.pp-tab-panel[data-panel="machine"] #materialPackCost,
.pp-tab-panel[data-panel="machine"] #materialUsed,
.pp-tab-panel[data-panel="machine"] #printHours{
 border-color:#a77cff42!important;
}
.pp-tab-panel[data-panel="machine"] #materialType:hover,
.pp-tab-panel[data-panel="machine"] #material:hover,
.pp-tab-panel[data-panel="machine"] #materialPack:hover,
.pp-tab-panel[data-panel="machine"] #materialPackCost:hover,
.pp-tab-panel[data-panel="machine"] #materialUsed:hover,
.pp-tab-panel[data-panel="machine"] #printHours:hover{
 border-color:#a77cff80!important;
}

/* Stage 3: running costs + selling fees = green. */
.pp-tab-panel[data-panel="costs"] .pp-cost-block{
 background:linear-gradient(180deg,color-mix(in srgb,var(--pp-green) 2.5%,var(--pp-panel)),var(--pp-bg2))!important;
}
.pp-tab-panel[data-panel="costs"] .pp-cost-block>.panel{
 background:transparent!important;
 border-color:transparent!important;
}
.pp-tab-panel[data-panel="costs"] input,
.pp-tab-panel[data-panel="costs"] select{
 border-color:#35d07f38!important;
}
.pp-tab-panel[data-panel="costs"] input:focus,
.pp-tab-panel[data-panel="costs"] select:focus{
 border-color:var(--pp-green)!important;
 box-shadow:0 0 0 2px #35d07f1c,0 0 18px #35d07f0b!important;
}
.pp-tab-panel[data-panel="costs"] .head .icon{color:var(--pp-green)!important}
.pp-tab-panel[data-panel="costs"] .result-value,
.pp-tab-panel[data-panel="costs"] .money,
.pp-tab-panel[data-panel="costs"] [id*="Cost" i],
.pp-tab-panel[data-panel="costs"] [id*="Profit" i]{
 color:color-mix(in srgb,var(--pp-green) 82%,var(--text))!important;
}

/* Unify EVERY calculator section icon with its stage colour.
   Box 1/2/4/5/6 are legacy sections, so they must be overridden explicitly. */
.pp-tab-panel[data-panel="details"] .head>.pp-pretty-icon,
.pp-tab-panel[data-panel="details"] .head>.icon{
 color:var(--pp-cyan)!important;
 border-color:var(--pp-cyan)!important;
 background:radial-gradient(circle at 34% 28%,color-mix(in srgb,var(--pp-cyan) 8%,transparent),#08151e 72%)!important;
 box-shadow:inset 0 0 0 1px color-mix(in srgb,var(--pp-cyan) 16%,transparent),inset 0 1px 0 rgba(255,255,255,.08),0 7px 18px rgba(0,0,0,.34),0 0 20px color-mix(in srgb,var(--pp-cyan) 12%,transparent)!important;
}
.pp-tab-panel[data-panel="machine"] .head>.pp-pretty-icon,
.pp-tab-panel[data-panel="machine"] .head>.icon{
 color:var(--pp-purple)!important;
 border-color:var(--pp-purple)!important;
 background:radial-gradient(circle at 34% 28%,color-mix(in srgb,var(--pp-purple) 8%,transparent),#08151e 72%)!important;
 box-shadow:inset 0 0 0 1px color-mix(in srgb,var(--pp-purple) 16%,transparent),inset 0 1px 0 rgba(255,255,255,.08),0 7px 18px rgba(0,0,0,.34),0 0 20px color-mix(in srgb,var(--pp-purple) 12%,transparent)!important;
}
.pp-tab-panel[data-panel="costs"] .head>.pp-pretty-icon,
.pp-tab-panel[data-panel="costs"] .head>.icon{
 color:var(--pp-green)!important;
 border-color:var(--pp-green)!important;
 background:radial-gradient(circle at 34% 28%,color-mix(in srgb,var(--pp-green) 8%,transparent),#08151e 72%)!important;
 box-shadow:inset 0 0 0 1px color-mix(in srgb,var(--pp-green) 16%,transparent),inset 0 1px 0 rgba(255,255,255,.08),0 7px 18px rgba(0,0,0,.34),0 0 20px color-mix(in srgb,var(--pp-green) 12%,transparent)!important;
}
.pp-tab-panel[data-panel="details"] .head>.pp-pretty-icon svg,
.pp-tab-panel[data-panel="details"] .head>.icon svg{stroke:var(--pp-cyan)!important;color:var(--pp-cyan)!important;filter:drop-shadow(0 0 7px color-mix(in srgb,var(--pp-cyan) 30%,transparent))!important}
.pp-tab-panel[data-panel="machine"] .head>.pp-pretty-icon svg,
.pp-tab-panel[data-panel="machine"] .head>.icon svg{stroke:var(--pp-purple)!important;color:var(--pp-purple)!important;filter:drop-shadow(0 0 7px color-mix(in srgb,var(--pp-purple) 30%,transparent))!important}
.pp-tab-panel[data-panel="costs"] .head>.pp-pretty-icon svg,
.pp-tab-panel[data-panel="costs"] .head>.icon svg{stroke:var(--pp-green)!important;color:var(--pp-green)!important;filter:drop-shadow(0 0 7px color-mix(in srgb,var(--pp-green) 30%,transparent))!important}

/* Keep the actual primary action buttons orange — colour belongs to the workflow, not every button. */
.pp-tab-panel .btn.accent,
.pp-tab-panel button.accent,
.pp-tab-panel .pp-main-cta{
 background:linear-gradient(135deg,var(--pp-orange-soft),var(--pp-orange))!important;
 border-color:var(--pp-orange)!important;
}
`;
 document.head.appendChild(s);return true;
}
function boot(){if(install())return;const t=setInterval(()=>{if(install())clearInterval(t)},50);setTimeout(()=>clearInterval(t),15000)}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();

/* ===== icon-upgrade.js ===== */
(()=>{'use strict';if(window.__printProfitIconUpgrade)return;window.__printProfitIconUpgrade=true;
const icons={cube:'<svg viewBox="0 0 48 48"><path d="m24 5 17 9.5v19L24 43 7 33.5v-19L24 5Z"/><path d="m7 14.5 17 10 17-10M24 24.5V43"/></svg>',calculator:'<svg viewBox="0 0 48 48"><rect x="11" y="5" width="26" height="38" rx="4"/><rect x="16" y="10" width="16" height="8" rx="1"/><path d="M17 24h3m4 0h3m4 0h0M17 30h3m4 0h3m4 0h0M17 36h3m4 0h7"/></svg>',chart:'<svg viewBox="0 0 48 48"><path d="M8 40V8M8 40h33"/><path d="m13 32 8-9 6 5 11-15"/><path d="M32 13h6v6"/></svg>',gear:'<svg viewBox="0 0 48 48"><path d="m24 6 3 4.3 5.1-.2 1.7 4.8 4.7 2.1-1.3 4.9 3 4.1-3 4.1 1.3 4.9-4.7 2.1-1.7 4.8-5.1-.2-3 4.3-3-4.3-5.1.2-1.7-4.8-4.7-2.1 1.3-4.9-3-4.1 3-4.1-1.3-4.9 4.7-2.1 1.7-4.8 5.1.2L24 6Z"/><circle cx="24" cy="24" r="6"/></svg>',folder:'<svg viewBox="0 0 48 48"><path d="M6 13a4 4 0 0 1 4-4h10l4 5h14a4 4 0 0 1 4 4v17a4 4 0 0 1-4 4H10a4 4 0 0 1-4-4V13Z"/></svg>',book:'<svg viewBox="0 0 48 48"><path d="M8 8h12c5 0 7 2 7 6v27c-2-2-5-3-9-3H8V8Zm32 0H28c-5 0-7 2-7 6v27c2-2 5-3 9-3h10V8Z"/></svg>',info:'<svg viewBox="0 0 48 48"><path d="M10 7h22l6 6v28H10V7Z"/><path d="M32 7v8h6"/><circle cx="22" cy="25" r="7"/><path d="M22 23v5m0-9h.01"/></svg>',results:'<svg viewBox="0 0 48 48"><rect x="10" y="7" width="28" height="34" rx="4"/><path d="M17 15h14M17 22h14M17 29h5m6 0 3-3M17 35h5"/></svg>',save:'<svg viewBox="0 0 48 48"><path d="M8 7h27l5 5v29H8V7Z"/><path d="M14 7v12h20V7M14 41V27h20v14"/></svg>',reset:'<svg viewBox="0 0 48 48"><path d="M10 20a15 15 0 1 1 4 14"/><path d="M10 9v11h11"/></svg>'};
const svg=n=>icons[n]||icons.cube;
const replace=(sel,map)=>document.querySelectorAll(sel).forEach(el=>{const k=map(el);if(k){el.innerHTML=svg(k);el.classList.add('pp-svg-icon')}});
function install(){if(!document.body)return false;
replace('#ppCleanTop .pp-nav-icon',e=>e.classList.contains('calculator')?'calculator':e.classList.contains('cube')?'cube':e.classList.contains('book')?'book':e.classList.contains('gear')?'gear':null);
replace('#ppCleanTop .pp-mini-icon',e=>e.classList.contains('calculator')?'calculator':e.classList.contains('folder')?'folder':null);
replace('#ppCleanTop .pp-feature-icon',e=>e.classList.contains('calculator')?'calculator':e.classList.contains('cube')?'cube':e.classList.contains('chart')?'chart':e.classList.contains('gear')?'gear':null);\nconst navColorStyle=document.getElementById('ppNavIconColours')||document.createElement('style');navColorStyle.id='ppNavIconColours';navColorStyle.textContent='#ppCleanTop .pp-top-links button:nth-child(1) .pp-nav-icon{color:#ff7800!important}#ppCleanTop .pp-top-links button:nth-child(2) .pp-nav-icon{color:#19c8ff!important}#ppCleanTop .pp-top-links button:nth-child(3) .pp-nav-icon{color:#b36cff!important}#ppCleanTop .pp-top-links button:nth-child(4) .pp-nav-icon{color:#28e58b!important}';if(!navColorStyle.parentNode)document.head.appendChild(navColorStyle);
document.querySelectorAll('.pp-model-hub .head,.result .head').forEach(h=>{const t=(h.querySelector('h2')?.textContent||'').toLowerCase(),x=h.querySelector('.icon,.pp-pretty-icon');if(!x)return;const k=t.includes('print information')?'info':t==='results'?'results':null;if(k){x.innerHTML=svg(k);x.classList.add('pp-svg-icon')}});
document.querySelectorAll('section.panel .head').forEach(h=>{const t=(h.querySelector('h2')?.textContent||'').toLowerCase(),x=h.querySelector('.icon,.pp-pretty-icon');if(!x)return;const k=t.includes('your model')?'cube':t.includes('print setup')?'calculator':t.includes('costs')||t.includes('result')?'chart':null;if(k){x.innerHTML=svg(k);x.classList.add('pp-svg-icon')}});
const s=document.querySelector('#ppFloatingSave .pp-save-icon');if(s){s.innerHTML=svg('save');s.classList.add('pp-svg-icon')}const r=document.querySelector('#ppFloatingReset .pp-reset-icon');if(r){r.innerHTML=svg('reset');r.classList.add('pp-svg-icon')}
let st=document.getElementById('ppIconUpgradeStyles');if(!st){st=document.createElement('style');st.id='ppIconUpgradeStyles';document.head.appendChild(st)}
st.textContent='.pp-svg-icon{display:grid!important;place-items:center!important}.pp-svg-icon:before,.pp-svg-icon:after{content:none!important;display:none!important}.pp-svg-icon svg{width:100%;height:100%;display:block;fill:none;stroke:currentColor;stroke-width:2.35;stroke-linecap:round;stroke-linejoin:round}#ppCleanTop .pp-nav-icon svg{width:25px;height:25px}#ppCleanTop .pp-feature-icon svg{width:27px;height:27px}#ppCleanTop .pp-mini-icon svg{width:20px;height:20px}#ppCleanTop .pp-feature-strip>div:nth-of-type(1) .pp-feature-icon{color:#ff7800!important}#ppCleanTop .pp-feature-strip>div:nth-of-type(2) .pp-feature-icon{color:#19c8ff!important}#ppCleanTop .pp-feature-strip>div:nth-of-type(3) .pp-feature-icon{color:#28e58b!important}#ppCleanTop .pp-feature-strip>div:nth-of-type(4) .pp-feature-icon{color:#b36cff!important}#ppFloatingSave .pp-save-icon,#ppFloatingReset .pp-reset-icon{border:0!important;border-radius:0!important}#ppFloatingSave .pp-save-icon svg,#ppFloatingReset .pp-reset-icon svg{width:25px;height:25px;stroke:currentColor;stroke-width:2.5}section.panel .head>.pp-svg-icon svg{width:34px!important;height:34px!important}';return true}
function boot(){if(install())return;const t=setInterval(()=>{if(install())clearInterval(t)},100);setTimeout(()=>clearInterval(t),15000)}if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();})();

/* ===== results-icon-fix.js ===== */
(()=>{'use strict';if(window.__ppResultsIconFix)return;window.__ppResultsIconFix=true;
const icon='<svg viewBox="0 0 48 48" aria-hidden="true"><rect x="10" y="7" width="28" height="34" rx="4"/><path d="M17 15h14M17 22h14M17 29h5m6 0 3-3M17 35h5"/></svg>';
function fix(){const el=document.querySelector('#about.result .head .icon');if(!el)return false;el.innerHTML=icon;el.classList.add('pp-svg-icon');let s=document.getElementById('ppResultsIconFixStyles');if(!s){s=document.createElement('style');s.id='ppResultsIconFixStyles';document.head.appendChild(s)}s.textContent='#about.result .head>.pp-svg-icon{display:grid!important;place-items:center!important;color:#ff7800!important;border-color:#ff7800!important}#about.result .head>.pp-svg-icon:before,#about.result .head>.pp-svg-icon:after{display:none!important;content:none!important}#about.result .head>.pp-svg-icon svg{display:block!important;width:34px!important;height:34px!important;fill:none!important;stroke:currentColor!important;stroke-width:2.35!important;stroke-linecap:round!important;stroke-linejoin:round!important}';return true}
function boot(){if(fix())return;const t=setInterval(()=>{if(fix())clearInterval(t)},100);setTimeout(()=>clearInterval(t),15000)}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();})();

/* ===== gcode-tip-art.js ===== */
(()=>{const boot=()=>{const panel=[...document.querySelectorAll('.two > .panel')].find(p=>/Not sure about a field/i.test(p.textContent||''));if(!panel||panel.querySelector('.pp-gcode-tip-art'))return !!panel;const head=panel.querySelector('.head');const copy=panel.querySelector('.small');if(!head||!copy)return false;panel.style.position='relative';head.style.paddingRight='105px';const art=document.createElement('div');art.className='pp-gcode-tip-art';art.innerHTML="<svg viewBox=\"0 0 140 120\" aria-hidden=\"true\" xmlns=\"http://www.w3.org/2000/svg\">\n<defs><filter id=\"g\"><feDropShadow dx=\"0\" dy=\"0\" stdDeviation=\"2.5\" flood-color=\"#39d7ff\" flood-opacity=\".55\"/></filter></defs>\n<g filter=\"url(#g)\">\n<path d=\"M18 8h70l34 34v70H18Z\" fill=\"none\" stroke=\"#5e7ff4\" stroke-width=\"4\" stroke-linejoin=\"round\"/>\n<path d=\"M88 8v36h34\" fill=\"none\" stroke=\"#5e7ff4\" stroke-width=\"4\"/>\n<rect x=\"28\" y=\"68\" width=\"56\" height=\"25\" rx=\"2\" fill=\"#06314a\" stroke=\"#13cfff\" stroke-width=\"3\"/>\n<text x=\"56\" y=\"85\" text-anchor=\"middle\" font-family=\"Arial,Segoe UI,sans-serif\" font-size=\"14\" font-weight=\"800\" fill=\"#13cfff\">GCODE</text>\n<circle cx=\"109\" cy=\"88\" r=\"23\" fill=\"#0b1b27\" stroke=\"#5d7686\" stroke-width=\"3\"/>\n<path d=\"M109 101V75m0 0-9 9m9-9 9 9\" fill=\"none\" stroke=\"#d9e7ef\" stroke-width=\"5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>\n</g></svg>";panel.appendChild(art);const st=document.createElement('style');st.id='ppGcodeTipArtStyles';st.textContent='.pp-gcode-tip-art{position:absolute!important;right:12px!important;top:12px!important;width:100px!important;height:92px!important;pointer-events:none!important;z-index:3!important}.pp-gcode-tip-art svg{display:block!important;width:100%!important;height:100%!important}.pp-gcode-tip-art text{font-family:Inter,Segoe UI,Arial,sans-serif}@media(max-width:700px){.pp-gcode-tip-art{width:80px!important;height:74px!important;right:8px!important;top:10px!important}.two > .panel .head{padding-right:88px!important}}';document.head.appendChild(st);return true};if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>{if(!boot()){const t=setInterval(()=>{if(boot())clearInterval(t)},100);setTimeout(()=>clearInterval(t),15000)}},{once:true});else if(!boot()){const t=setInterval(()=>{if(boot())clearInterval(t)},100);setTimeout(()=>clearInterval(t),15000)}})();

/* ===== alignment-polish.js ===== */
(()=>{
  'use strict';
  if(window.__printProfitAlignmentPolishInstalled)return;
  window.__printProfitAlignmentPolishInstalled=true;

  const style=document.createElement('style');
  style.id='ppAlignmentPolishStyles';
  style.textContent=`
    @media(min-width:951px){
      /* Stretch the paired outer cards without changing their internal layouts. */
      .pp-tab-panel[data-panel="details"],
      .pp-tab-panel[data-panel="machine"],
      .pp-tab-panel[data-panel="costs"]{
        align-items:stretch!important;
      }

      .pp-tab-panel[data-panel="details"]>.pp-card,
      .pp-tab-panel[data-panel="machine"]>.pp-card,
      .pp-tab-panel[data-panel="costs"]>.pp-cost-block{
        align-self:stretch!important;
        display:block!important;
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
})();
})();
