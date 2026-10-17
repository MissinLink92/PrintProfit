(()=>{'use strict';
if(window.__printProfitHeroSloganLayout)return;
window.__printProfitHeroSloganLayout=true;

function installAnalyticsLoader(){
  try{
    const host=window.parent&&window.parent!==window?window.parent:window;
    const doc=host.document;
    if(doc.getElementById('ppAnalyticsLoader'))return;
    const marker=doc.createElement('meta');
    marker.id='ppAnalyticsLoader';
    doc.head.appendChild(marker);

    const loadAnalytics=()=>{
      if(doc.getElementById('ppAnalyticsScript'))return;
      const analytics=doc.createElement('script');
      analytics.id='ppAnalyticsScript';
      analytics.src='./analytics.js?v=1';
      analytics.defer=true;
      doc.head.appendChild(analytics);
    };

    if(host.PRINTPROFIT_ANALYTICS){loadAnalytics();return;}
    const config=doc.createElement('script');
    config.id='ppAnalyticsConfigScript';
    config.src='./config/analytics-config.js?v=1';
    config.onload=loadAnalytics;
    doc.head.appendChild(config);
  }catch(error){
    console.warn('PrintProfit analytics loader unavailable',error);
  }
}

function installStyles(){
  if(document.getElementById('ppHeroSloganLayoutStyles'))return;
  const style=document.createElement('style');
  style.id='ppHeroSloganLayoutStyles';
  style.textContent=`
#ppVisualMaster .pvm-hero{height:auto!important;min-height:590px!important}
#ppVisualMaster .pvm-copy{max-width:680px!important;padding-top:36px!important;padding-bottom:32px!important;min-width:0}
#ppVisualMaster .pvm-copy h1{font-size:clamp(32px,4vw,56px)!important;font-family:"Trebuchet MS","Arial Rounded MT Bold",ui-rounded,system-ui,sans-serif!important;font-weight:800!important;line-height:1.12!important;letter-spacing:-.035em!important;margin-bottom:18px!important;color:#ffe1ab!important}
#ppVisualMaster .pvm-copy>p{max-width:520px;line-height:1.65!important;font-size:15px!important}
#ppVisualMaster .pvm-copy>p br{display:none}
#ppVisualMaster .pvm-copy h1 strong{color:#b0f4ff!important;font-weight:inherit}
#ppVisualMaster .pvm-copy h1 em{font-style:normal}
#ppVisualMaster .pvm-copy h1 .pvm-cost-accent{color:#ffb65c!important}
#ppVisualMaster .pvm-copy h1 .pvm-charge-accent{color:#54deef!important}
#ppVisualMaster .pvm-copy>.pvm-kicker{color:#79dfeb!important;letter-spacing:.16em;font-weight:800}
#ppVisualMaster .pvm-action-stack{display:flex!important;flex-direction:column!important;align-items:stretch!important;width:610px!important;max-width:100%!important;gap:26px!important;margin-top:20px!important}
#ppVisualMaster .pvm-action-stack>.pvm-actions{display:block!important;width:100%!important;max-width:100%!important;margin:0!important}
#ppVisualMaster .pvm-action-stack>.pvm-hero-tagline{position:static!important;inset:auto!important;display:flex!important;flex-wrap:wrap!important;justify-content:flex-start!important;align-items:baseline!important;gap:8px 16px!important;width:100%!important;max-width:100%!important;min-width:0!important;box-sizing:border-box!important;margin:0!important;text-align:left!important;transform:none!important;font-style:normal!important;font-size:clamp(16px,1.5vw,19px)!important;font-weight:650!important;line-height:1.4!important;letter-spacing:-.015em!important;color:#f3f8fb!important;text-shadow:0 2px 8px #0008!important}
#ppVisualMaster .pvm-hero-tagline>span{white-space:nowrap;border:0;padding:0;font-family:"Trebuchet MS","Arial Rounded MT Bold",ui-rounded,system-ui,sans-serif;font-weight:800}
#ppVisualMaster .pvm-hero-tagline>span:nth-child(1){color:#ffbd6b}
#ppVisualMaster .pvm-hero-tagline>span:nth-child(2){color:#6be4f4}
#ppVisualMaster .pvm-hero-tagline>span:nth-child(3){color:#8ee3ac}
#ppVisualMaster .pvm-hero-tagline>span+span::before{content:"";display:inline-block;width:4px;height:4px;border-radius:50%;background:#54deef;margin:0 14px 4px 0}
#ppVisualMaster .pvm-workspace-spotlight{display:grid;grid-template-columns:minmax(0,1fr) auto;align-items:center;gap:20px;padding:24px 0 0;border:0;border-top:1px solid #8ab4c340;border-radius:0;background:transparent;box-shadow:none;min-width:0}
#ppVisualMaster .pvm-workspace-kicker{display:block;font-size:10px;font-weight:800;letter-spacing:.15em;color:#79dfeb;margin-bottom:6px}
#ppVisualMaster .pvm-workspace-copy h2{margin:0 0 7px;font-size:30px;line-height:1.15;color:#f5f9fb;letter-spacing:-.025em}
#ppVisualMaster .pvm-workspace-copy p{margin:0;max-width:420px;font-size:14px;line-height:1.5;color:#cadce5}
#ppVisualMaster .pvm-workspace-spotlight .pvm-workspace-cta{height:auto!important;min-height:48px;padding:12px 22px!important;background:linear-gradient(120deg,#7ceaf6,#32c7e3)!important;color:#05212d!important;border:1px solid #a1efff!important;border-radius:10px!important;box-shadow:0 5px 20px #19d8ff20;font-size:14px!important;font-weight:800;white-space:normal;justify-content:center}
#ppVisualMaster .pvm-workspace-spotlight .pvm-workspace-cta svg{stroke:#05212d!important}
#ppVisualMaster .pvm-workspace-cta:hover{filter:brightness(1.08)}
#ppVisualMaster .pvm-workspace-cta:focus-visible{outline:3px solid #fff;outline-offset:4px}
body[data-pp-theme="light"] #ppVisualMaster .pvm-copy h1 .pvm-cost-accent{color:#945000!important}
body[data-pp-theme="light"] #ppVisualMaster .pvm-copy h1 .pvm-charge-accent{color:#006d87!important}
body[data-pp-theme="light"] #ppVisualMaster .pvm-copy h1{color:#704311!important}
body[data-pp-theme="light"] #ppVisualMaster .pvm-copy h1 strong{color:#14566a!important}
body[data-pp-theme="light"] #ppVisualMaster .pvm-hero-tagline>span:nth-child(1){color:#945000}
body[data-pp-theme="light"] #ppVisualMaster .pvm-hero-tagline>span:nth-child(2){color:#006d87}
body[data-pp-theme="light"] #ppVisualMaster .pvm-hero-tagline>span:nth-child(3){color:#237443}
body[data-pp-theme="light"] #ppVisualMaster .pvm-workspace-spotlight{background:transparent;border-color:#44667740;box-shadow:none}
body[data-pp-theme="light"] #ppVisualMaster .pvm-workspace-copy h2{color:#18323f}
body[data-pp-theme="light"] #ppVisualMaster .pvm-workspace-copy p{color:#385563}
body[data-pp-theme="light"] #ppVisualMaster .pvm-workspace-kicker,body[data-pp-theme="light"] #ppVisualMaster .pvm-copy>.pvm-kicker{color:#006c86!important}
body[data-pp-theme="light"] #ppVisualMaster .pvm-action-stack>.pvm-hero-tagline{color:#18323f!important;text-shadow:none!important}
body[data-pp-theme="light"] #ppVisualMaster .pvm-workspace-cta:focus-visible{outline-color:#006d87}
@media(max-width:650px){#ppVisualMaster .pvm-copy{padding-top:20px!important;padding-bottom:20px!important}#ppVisualMaster .pvm-workspace-spotlight{grid-template-columns:minmax(0,1fr);gap:16px;padding-top:20px}#ppVisualMaster .pvm-workspace-copy p{max-width:100%}#ppVisualMaster .pvm-hero-tagline>span+span::before{display:none}#ppVisualMaster .pvm-workspace-cta{width:100%}#ppVisualMaster .pvm-action-stack{gap:18px!important}#ppVisualMaster .pvm-action-stack>.pvm-hero-tagline{gap:7px 12px!important;font-size:17px!important}#ppVisualMaster .pvm-workspace-copy h2{font-size:25px}}
`;
  (document.head||document.documentElement).appendChild(style);
}

function placeSlogan(){
  const root=document.getElementById('ppVisualMaster');
  const copy=root?.querySelector('.pvm-copy');
  const actions=copy?.querySelector('.pvm-actions');
  const slogan=root?.querySelector('.pvm-hero-tagline');
  if(!copy||!actions||!slogan)return false;

  let stack=copy.querySelector(':scope > .pvm-action-stack');
  if(!stack){
    stack=document.createElement('div');
    stack.className='pvm-action-stack';
    copy.insertBefore(stack,actions);
  }
  if(slogan.parentElement!==stack)stack.appendChild(slogan);
  if(actions.parentElement!==stack)stack.appendChild(actions);
  return true;
}

installAnalyticsLoader();
installStyles();
if(!placeSlogan()){
  const observer=new MutationObserver(()=>{
    if(placeSlogan())observer.disconnect();
  });
  observer.observe(document.body,{childList:true,subtree:true});
  setTimeout(()=>observer.disconnect(),15000);
}
})();