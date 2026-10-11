(()=>{
'use strict';

const config=window.PRINTPROFIT_ANALYTICS||{};
const measurementId=String(config.measurementId||'').trim();
if(!/^G-[A-Z0-9]+$/i.test(measurementId))return;

const CONSENT_KEY='pp_analytics_consent_v1';
const GA_SCRIPT_ID='ppGa4Script';
let enabled=false;
let innerBoundDoc=null;

function readConsent(){
 try{return localStorage.getItem(CONSENT_KEY);}catch(_){return null;}
}
function writeConsent(value){
 try{localStorage.setItem(CONSENT_KEY,value);}catch(_){}
}
function deleteAnalyticsCookies(){
 document.cookie.split(';').forEach(raw=>{
  const name=raw.split('=')[0].trim();
  if(/^_ga/i.test(name)){
   document.cookie=`${name}=; Max-Age=0; path=/; SameSite=Lax`;
   document.cookie=`${name}=; Max-Age=0; path=/; domain=${location.hostname}; SameSite=Lax`;
  }
 });
}
function gtag(){window.dataLayer=window.dataLayer||[];window.dataLayer.push(arguments);}
function track(name,params={}){
 if(!enabled)return;
 try{gtag('event',name,{...params,transport_type:'beacon'});}catch(_){}
}
function loadGa(){
 if(document.getElementById(GA_SCRIPT_ID))return;
 window.dataLayer=window.dataLayer||[];
 gtag('js',new Date());
 gtag('config',measurementId,{send_page_view:true,allow_google_signals:false,allow_ad_personalization_signals:false});
 const script=document.createElement('script');
 script.id=GA_SCRIPT_ID;
 script.async=true;
 script.src=`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`;
 document.head.appendChild(script);
}
function setEnabled(value){
 enabled=!!value;
 window[`ga-disable-${measurementId}`]=!enabled;
 if(enabled)loadGa();
 else deleteAnalyticsCookies();
 refreshConsentUi();
}

function ensureStyles(){
 if(document.getElementById('ppAnalyticsStyles'))return;
 const style=document.createElement('style');
 style.id='ppAnalyticsStyles';
 style.textContent=`
#ppAnalyticsBanner{position:fixed;left:18px;right:18px;bottom:18px;z-index:12000;max-width:760px;margin:auto;padding:16px 18px;border:1px solid #34515f;border-radius:14px;background:rgba(7,16,24,.98);color:#f5f8fb;box-shadow:0 18px 50px #0009;font:14px/1.45 Inter,Segoe UI,system-ui,sans-serif}
#ppAnalyticsBanner strong{display:block;margin-bottom:5px;font-size:15px}#ppAnalyticsBanner p{margin:0;color:#c5d5de}
#ppAnalyticsActions{display:flex;flex-wrap:wrap;gap:10px;margin-top:13px}#ppAnalyticsActions button,#ppAnalyticsSettings{border:1px solid #52707f;border-radius:9px;padding:9px 12px;background:#10232f;color:#fff;font:700 12px Inter,Segoe UI,system-ui,sans-serif;cursor:pointer}
#ppAnalyticsActions button[data-choice="accept"]{border-color:#009fef;background:#0b79b5}#ppAnalyticsActions button:hover,#ppAnalyticsSettings:hover{filter:brightness(1.1)}
#ppAnalyticsSettings{position:fixed;left:50%;bottom:5px;transform:translateX(-50%);z-index:11990;padding:5px 9px;border-radius:8px;font-size:10px;opacity:.72}
@media(max-width:650px){#ppAnalyticsBanner{left:10px;right:10px;bottom:68px;padding:14px}#ppAnalyticsActions{display:grid;grid-template-columns:1fr 1fr}#ppAnalyticsActions button{width:100%}#ppAnalyticsSettings{bottom:2px}}
`;
 document.head.appendChild(style);
}
function buildUi(){
 ensureStyles();
 if(!document.getElementById('ppAnalyticsBanner')){
  const banner=document.createElement('div');
  banner.id='ppAnalyticsBanner';
  banner.setAttribute('role','dialog');
  banner.setAttribute('aria-label','Analytics preferences');
  banner.innerHTML=`<strong>Help us improve PrintProfit</strong><p>We'd like to use optional analytics to understand visits and which calculator features are used. We do not send uploaded filenames, model names, entered prices or free-text content to analytics.</p><div id="ppAnalyticsActions"><button type="button" data-choice="reject">Reject analytics</button><button type="button" data-choice="accept">Accept analytics</button></div>`;
  banner.addEventListener('click',e=>{
   const button=e.target.closest('button[data-choice]');
   if(!button)return;
   const accepted=button.dataset.choice==='accept';
   writeConsent(accepted?'granted':'denied');
   setEnabled(accepted);
  });
  document.body.appendChild(banner);
 }
 if(!document.getElementById('ppAnalyticsSettings')){
  const settings=document.createElement('button');
  settings.id='ppAnalyticsSettings';
  settings.type='button';
  settings.textContent='Analytics settings';
  settings.addEventListener('click',()=>{
   const banner=document.getElementById('ppAnalyticsBanner');
   if(banner)banner.hidden=false;
  });
  document.body.appendChild(settings);
 }
 refreshConsentUi();
}
function refreshConsentUi(){
 const banner=document.getElementById('ppAnalyticsBanner');
 if(!banner)return;
 banner.hidden=readConsent()==='granted'||readConsent()==='denied';
}

function cleanLabel(value){return String(value||'').replace(/\s+/g,' ').trim().slice(0,80);}
function bindInnerDocument(){
 const frame=document.getElementById('app');
 const d=frame?.contentDocument;
 if(!d||d===innerBoundDoc)return;
 innerBoundDoc=d;
 d.addEventListener('click',e=>{
  const target=e.target.closest('button,a,[role="tab"]');
  if(!target)return;
  if(target.matches('.pp-step[data-tab]')){
   track('calculator_stage_view',{stage:target.dataset.tab||'unknown'});
   return;
  }
  if(target.id==='saveProject'){track('project_save');return;}
  const text=cleanLabel(target.textContent).toLowerCase();
  const dataTarget=cleanLabel(target.getAttribute('data-target')).toLowerCase();
  if(text.includes('calculate'))track('calculate_results');
  else if(dataTarget==='guide'||text==='guide'||text.includes('guide & help'))track('navigation_click',{destination:'guide'});
  else if(dataTarget.includes('compare')||text.includes('compare products'))track('navigation_click',{destination:'compare_products'});
 },true);
 d.addEventListener('change',e=>{
  const input=e.target;
  if(!(input instanceof frame.contentWindow.HTMLInputElement)||input.type!=='file'||!input.files?.length)return;
  const name=String(input.files[0].name||'');
  const ext=(name.split('.').pop()||'unknown').toLowerCase().replace(/[^a-z0-9]/g,'').slice(0,12)||'unknown';
  track('file_selected',{file_type:ext,file_count:input.files.length});
 },true);
}
function bindParentEvents(){
 document.getElementById('ppFloatingSave')?.addEventListener('click',()=>track('project_save',{surface:'floating'}),true);
 document.getElementById('ppFloatingReset')?.addEventListener('click',()=>track('calculator_reset',{surface:'floating'}),true);
 const frame=document.getElementById('app');
 if(frame){frame.addEventListener('load',()=>setTimeout(bindInnerDocument,0));setTimeout(bindInnerDocument,0);}
}

function init(){
 buildUi();
 const consent=readConsent();
 if(consent==='granted')setEnabled(true);
 else setEnabled(false);
 bindParentEvents();
 window.PrintProfitAnalytics=Object.freeze({
  track,
  get consent(){return readConsent();},
  openSettings(){const b=document.getElementById('ppAnalyticsBanner');if(b)b.hidden=false;}
 });
}

if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});
else init();
})();
