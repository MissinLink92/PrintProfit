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