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