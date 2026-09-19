(()=>{
'use strict';
if(window.__printProfitUnifiedIcons)return;window.__printProfitUnifiedIcons=true;

function install(){
  if(!document.body)return false;
  document.getElementById('ppUnifiedIconSystem')?.remove();
  const style=document.createElement('style');
  style.id='ppUnifiedIconSystem';
  style.textContent=`
/* PrintProfit Unified Icon System V1
   One visual language: consistent optical size, stroke, spacing and clarity. */

/* Primary calculator/section icons */
section.panel .head>.icon,
section.panel .head>.pp-pretty-icon,
.merge-block .head>.icon,
.merge-block .head>.pp-pretty-icon{
  width:48px!important;height:48px!important;min-width:48px!important;min-height:48px!important;
  flex:0 0 48px!important;
  border-radius:12px!important;
  display:grid!important;place-items:center!important;
  box-sizing:border-box!important;
  overflow:hidden!important;
}
section.panel .head>.icon svg,
section.panel .head>.pp-pretty-icon svg,
.merge-block .head>.icon svg,
.merge-block .head>.pp-pretty-icon svg{
  width:29px!important;height:29px!important;
  min-width:29px!important;min-height:29px!important;
  fill:none!important;
  stroke-width:2.15!important;
  stroke-linecap:round!important;
  stroke-linejoin:round!important;
}

/* Journey cards — same icon footprint and artwork size */
#pp-master-quickcards .pp-master-card-icon{
  width:58px!important;height:58px!important;min-width:58px!important;min-height:58px!important;
  flex:0 0 58px!important;border-radius:14px!important;
  display:grid!important;place-items:center!important;box-sizing:border-box!important;
}
#pp-master-quickcards .pp-master-card-icon svg{
  width:31px!important;height:31px!important;min-width:31px!important;min-height:31px!important;
  stroke-width:2.15!important;stroke-linecap:round!important;stroke-linejoin:round!important;
}

/* Header / navigation icons */
#ppCleanTop .pp-nav-icon,
#ppCleanTop .pp-feature-icon,
#ppCleanTop .pp-mini-icon{
  width:28px!important;height:28px!important;min-width:28px!important;min-height:28px!important;
  flex:0 0 28px!important;box-sizing:border-box!important;
}
#ppCleanTop .pp-nav-icon:before,#ppCleanTop .pp-nav-icon:after,
#ppCleanTop .pp-feature-icon:before,#ppCleanTop .pp-feature-icon:after{
  box-sizing:border-box!important;
}
#ppCleanTop .pp-mini-icon{width:24px!important;height:24px!important;min-width:24px!important;min-height:24px!important;flex-basis:24px!important}

/* Hero feature icons */
.hero .pp-chosen-ticker .pp-feature-item svg{
  width:30px!important;height:30px!important;min-width:30px!important;min-height:30px!important;
  stroke-width:2.15!important;stroke-linecap:round!important;stroke-linejoin:round!important;
}

/* Small profile/settings icons */
.pp-profile-icon,
.pp-mini-head .pp-mini-icon,
.pp-settings-icon,
.pp-modal-icon{
  width:32px!important;height:32px!important;min-width:32px!important;min-height:32px!important;
  flex:0 0 32px!important;display:grid!important;place-items:center!important;
  box-sizing:border-box!important;border-radius:9px!important;
}

/* Keep artwork optically centred and legible even when its SVG viewBox differs. */
section.panel .head>.icon>*:not(svg),
section.panel .head>.pp-pretty-icon>*:not(svg),
.merge-block .head>.icon>*:not(svg),
.merge-block .head>.pp-pretty-icon>*:not(svg){
  max-width:29px!important;max-height:29px!important;
}

/* Accessibility: don't rely on glow/colour alone to make an icon readable. */
section.panel .head>.icon,
section.panel .head>.pp-pretty-icon,
.merge-block .head>.icon,
.merge-block .head>.pp-pretty-icon{
  text-shadow:none!important;
}

@media(max-width:650px){
  section.panel .head>.icon,
  section.panel .head>.pp-pretty-icon,
  .merge-block .head>.icon,
  .merge-block .head>.pp-pretty-icon{
    width:46px!important;height:46px!important;min-width:46px!important;min-height:46px!important;flex-basis:46px!important;
  }
  section.panel .head>.icon svg,
  section.panel .head>.pp-pretty-icon svg,
  .merge-block .head>.icon svg,
  .merge-block .head>.pp-pretty-icon svg{width:28px!important;height:28px!important;min-width:28px!important;min-height:28px!important}
  #pp-master-quickcards .pp-master-card-icon{width:54px!important;height:54px!important;min-width:54px!important;min-height:54px!important;flex-basis:54px!important}
  #pp-master-quickcards .pp-master-card-icon svg{width:29px!important;height:29px!important;min-width:29px!important;min-height:29px!important}
}
`;
  document.head.appendChild(style);
  return true;
}
function boot(){if(install())return;const t=setInterval(()=>{if(install())clearInterval(t)},50);setTimeout(()=>clearInterval(t),15000)}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
