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
  style.textContent=[
    '#ppVisualMaster .pvm-action-stack{display:inline-flex!important;flex-direction:column!important;align-items:stretch!important;width:max-content!important;max-width:100%!important;margin-top:20px!important;vertical-align:top!important}',
    '#ppVisualMaster .pvm-action-stack>.pvm-actions{display:flex!important;width:100%!important;max-width:100%!important;margin:0!important;gap:12px!important}',
    '#ppVisualMaster .pvm-action-stack>.pvm-hero-tagline{position:static!important;inset:auto!important;display:block!important;width:100%!important;max-width:100%!important;min-width:0!important;box-sizing:border-box!important;margin:14px 0 0!important;text-align:center!important;transform:none!important}'
  ].join('\n');
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
  if(actions.parentElement!==stack)stack.appendChild(actions);
  if(slogan.parentElement!==stack)stack.appendChild(slogan);
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