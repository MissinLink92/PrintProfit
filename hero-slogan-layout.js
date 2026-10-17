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
#ppVisualMaster .pvm-action-stack{display:flex!important;flex-direction:column!important;align-items:stretch!important;width:650px!important;max-width:100%!important;gap:16px!important;margin-top:22px!important}
#ppVisualMaster .pvm-action-stack>.pvm-actions{display:block!important;width:100%!important;max-width:100%!important;margin:0!important}
#ppVisualMaster .pvm-action-stack>.pvm-hero-tagline{position:static!important;inset:auto!important;display:flex!important;flex-wrap:wrap!important;gap:4px 14px!important;width:100%!important;max-width:100%!important;min-width:0!important;box-sizing:border-box!important;margin:0!important;text-align:left!important;transform:none!important;font-style:normal!important;font-size:clamp(19px,2vw,25px)!important;font-weight:850!important;line-height:1.3!important;letter-spacing:-.02em!important;color:#75e6ff!important;text-shadow:0 2px 8px #000b!important}
#ppVisualMaster .pvm-hero-tagline>span{white-space:nowrap}
#ppVisualMaster .pvm-workspace-spotlight{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:14px 18px;align-items:center;padding:20px;border:1px solid #29c2e1;border-radius:16px;background:#071e2bf5;box-shadow:0 10px 30px #0005,0 0 24px #19d8ff15;min-width:0}
#ppVisualMaster .pvm-workspace-kicker{display:block;font-size:10px;font-weight:850;letter-spacing:.14em;color:#75e6ff;margin-bottom:5px}
#ppVisualMaster .pvm-workspace-copy h2{margin:0 0 5px;font-size:25px;line-height:1.15;color:#f5f9fb;letter-spacing:-.02em}
#ppVisualMaster .pvm-workspace-copy p{margin:0;font-size:14px;line-height:1.5;color:#cadce5}
#ppVisualMaster .pvm-workspace-spotlight .pvm-workspace-cta{height:auto!important;min-height:50px;padding:12px 17px!important;background:linear-gradient(135deg,#75edff,#22c5ee)!important;color:#05212d!important;border:1px solid #a1efff!important;box-shadow:0 5px 18px #19d8ff25;font-size:14px!important;white-space:normal;justify-content:center}
#ppVisualMaster .pvm-workspace-spotlight .pvm-workspace-cta svg{stroke:#05212d!important}
#ppVisualMaster .pvm-workspace-cta:hover{filter:brightness(1.08);transform:translateY(-1px)}
#ppVisualMaster .pvm-workspace-cta:focus-visible{outline:3px solid #fff;outline-offset:4px}
#ppVisualMaster .pvm-workspace-spotlight>.pvm-workspace-hint{grid-column:1/-1;margin:0;padding-top:12px;border-top:1px solid #315363;font-size:12px;line-height:1.65;color:#bdd0da}
body[data-pp-theme="light"] #ppVisualMaster .pvm-workspace-spotlight{background:#f7fcff;border-color:#16839a;box-shadow:0 8px 25px #12384815}
body[data-pp-theme="light"] #ppVisualMaster .pvm-workspace-copy h2{color:#18323f}
body[data-pp-theme="light"] #ppVisualMaster .pvm-workspace-copy p,body[data-pp-theme="light"] #ppVisualMaster .pvm-workspace-spotlight>.pvm-workspace-hint{color:#385563}
body[data-pp-theme="light"] #ppVisualMaster .pvm-workspace-kicker{color:#006c86}
body[data-pp-theme="light"] #ppVisualMaster .pvm-action-stack>.pvm-hero-tagline{color:#006c86!important;text-shadow:none!important}
@media(max-width:650px){#ppVisualMaster .pvm-workspace-spotlight{grid-template-columns:minmax(0,1fr);padding:17px;gap:13px}#ppVisualMaster .pvm-workspace-cta{width:100%}#ppVisualMaster .pvm-action-stack>.pvm-hero-tagline{gap:3px 10px!important;font-size:20px!important}}
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