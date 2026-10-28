(()=>{
'use strict';
const FIREBASE_VERSION='12.19.0';
const standardOffer='Start with seven days free, then £2.50/month or £24/year (paid upfront). Cancel anytime from this account page. Your projects and inventory remain yours if Pro ends.';
let callable=null,owner='',generation=0;
const $=id=>document.getElementById(id);
const date=seconds=>new Date(seconds*1000).toLocaleDateString('en-GB',{day:'numeric',month:'long',year:'numeric'});
const text=(id,value)=>{const node=$(id);if(node)node.textContent=value;};
const accessChanged=tier=>{window.__ppProTier=tier;window.__ppProVerifiedAt=tier==='pro'?Date.now():0;document.dispatchEvent(new CustomEvent('pp-pro-access-changed',{detail:{tier}}));if(tier!=='pro')window.__ppCloseMaterialScanner?.();};
function panel(){
 const card=document.querySelector('#ppWorkshopAccount .pp-account-card');
 if(!card)return null;
 if($('ppProSubscription'))return $('ppProSubscription');
 const section=document.createElement('section');section.id='ppProSubscription';section.setAttribute('aria-labelledby','ppProTitle');
 section.innerHTML='<div class="pp-pro-heading"><h3 id="ppProTitle">PrintProfit Pro</h3><strong id="ppProBadge" class="pp-pro-badge" hidden></strong></div><p>Keep your prints, printers and materials organised. Cloud saving, scanning and stock tracking wherever you print. Local saves and backup files stay free.</p><p id="ppProDescription">'+standardOffer+'</p><p id="ppProStatus" role="status" aria-live="polite">Sign in with a verified account to see your plan.</p><div id="ppProEntry" class="pp-pro-entry" hidden><button type="button" data-pp-pro-entry="create">Create account to start Pro</button><button type="button" data-pp-pro-entry="sign-in">Already have an account? Sign in</button></div><div id="ppProPlans" hidden><h4>Choose your Pro plan</h4><p id="ppProConsentText"></p><p class="pp-pro-terms">Read the <a href="./terms.html" target="_top">subscription terms</a> before choosing a plan.</p><div class="pp-pro-options"><div class="pp-pro-option"><strong>Monthly · £2.50/month</strong><label><input type="checkbox" data-pp-consent="monthly"><span>I agree to the monthly plan and terms</span></label><button type="button" data-pp-billing="monthly">Start monthly Pro</button></div><div class="pp-pro-option"><strong>Annual · £24/year</strong><label><input type="checkbox" data-pp-consent="annual"><span>I agree to the annual plan and terms</span></label><button type="button" data-pp-billing="annual">Start annual Pro</button></div></div></div><div id="ppProActions" hidden><button type="button" id="ppProManage" data-pp-billing="portal">Cancel subscription</button><p id="ppProCancelHelp">Opens Stripe’s secure billing page, where you can confirm cancellation.</p></div>';
 const style=document.createElement('style');style.textContent=`
 #ppProSubscription{width:100%;margin-top:14px;padding:20px;border:1px solid #517180;border-radius:10px;background:#0c222d;color:#eaf4f7}
 #ppProSubscription .pp-pro-heading{display:flex;flex-wrap:wrap;align-items:center;gap:8px 14px}
 #ppProSubscription h3{margin:0;font-size:20px}#ppProSubscription h4{margin:0 0 10px;font-size:17px}
 #ppProSubscription p{font-size:14px;line-height:1.5}
 #ppProSubscription .pp-pro-badge{display:inline-block;padding:6px 11px;border-radius:999px;background:#b9f2dc;color:#073d2c;font-size:13px}
 #ppProSubscription .pp-pro-badge[data-state="offer"]{background:#ffddab;color:#522700}
 #ppProSubscription .pp-pro-badge[data-state="ending"]{background:#ffe0b6;color:#562b00}
 #ppProStatus{font-weight:600}
 #ppProPlans{margin-top:18px;padding:18px;border:1px solid #ff7800;border-radius:10px}
 #ppProPlans .pp-pro-terms{margin-top:0}
 #ppProPlans .pp-pro-options{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,220px),1fr));gap:12px;margin-top:14px}
 #ppProPlans .pp-pro-option{display:flex;flex-direction:column;align-items:flex-start;gap:12px;padding:16px;border:1px solid #517180;border-radius:8px}
 #ppProPlans .pp-pro-option>strong{font-size:16px}
 #ppProPlans .pp-pro-option label{display:inline-flex!important;width:auto!important;max-width:100%;align-items:flex-start;gap:8px;font-size:13px;line-height:1.5;cursor:pointer}
 #ppProPlans input[type="checkbox"]{appearance:auto!important;position:static!important;display:inline-block!important;flex:0 0 16px!important;width:16px!important;min-width:16px!important;max-width:16px!important;height:16px!important;min-height:16px!important;max-height:16px!important;margin:2px 0 0!important;padding:0!important;transform:none!important;box-shadow:none!important;accent-color:#ff7800}
 #ppProSubscription button{padding:11px 15px;border:1px solid #ff7800;border-radius:8px;background:#ff7800;color:white;font-weight:700;cursor:pointer}
 #ppProEntry{display:flex;flex-wrap:wrap;gap:10px;margin-top:16px}
 #ppProEntry [data-pp-pro-entry="sign-in"]{background:transparent;color:#ffd0a2}
 #ppProSubscription button:disabled{opacity:.5;cursor:wait}
 #ppProActions{margin-top:18px;padding-top:16px;border-top:1px solid #517180}
 #ppProActions p{margin:8px 0 0;font-size:12px}
 #ppProSubscription a{color:#75d8f2}
 #ppProBadge[hidden],#ppProEntry[hidden],#ppProPlans[hidden],#ppProActions[hidden]{display:none!important}
 body[data-pp-theme="light"] #ppProSubscription{background:#fff;color:#19252d}
 body[data-pp-theme="light"] #ppProEntry [data-pp-pro-entry="sign-in"]{color:#874200}
 body[data-pp-theme="light"] #ppProPlans .pp-pro-option{border-color:#b1c9d1}
 `;
 document.head.appendChild(style);card.append(section);return section;
}
async function functions(){
 if(callable)return callable;
 const {app}=await window.__ppBillingAccountContext();
 const sdk=await import('https://www.gstatic.com/firebasejs/'+FIREBASE_VERSION+'/firebase-functions.js');
 const service=sdk.getFunctions(app,'europe-west2');
 callable=name=>sdk.httpsCallable(service,name);
 return callable;
}
async function invoke(name,payload){const call=await functions();return (await call(name)(payload)).data;}
function badge(label,state){const node=$('ppProBadge');node.textContent=label;node.dataset.state=state;node.hidden=false;}
async function refresh(force=false){
 if(!panel())return;
 const token=++generation;
 let context;
 try{context=await window.__ppBillingAccountContext()}catch{context=null;}
 if(token!==generation)return;
 const user=context?.user,ready=Boolean(user?.emailVerified&&context.legalAccepted);
 $('ppProEntry').hidden=true;$('ppProPlans').hidden=true;$('ppProActions').hidden=true;$('ppProBadge').hidden=true;
 if(!ready){owner='';accessChanged('basic');text('ppProDescription',standardOffer);text('ppProStatus',user?'Verify your email and accept the current account terms to start Pro.':'Create an account or sign in to start Pro.');$('ppProEntry').hidden=Boolean(user);badge('7 days free','offer');return;}
 owner=user.uid;text('ppProStatus','Checking PrintProfit Pro access…');
 try{
  const access=await invoke('getProAccess');
  if(token!==generation||owner!==user.uid)return;
  accessChanged(access.tier);
  text('ppProDescription',access.status==='owner'?'All Pro tools are included with your verified owner account. No trial or subscription is needed.':access.status==='complimentary'?'Complimentary Pro access has been granted by PrintProfit. No payment is required for this access.':standardOffer);
  if(access.status==='owner'){
   badge('Owner Pro active','active');
   text('ppProStatus',access.hasBillingAccount?'Owner access is active without a payment requirement. Manage any existing Stripe subscription below to avoid future charges.':'Owner access is active. No subscription or payment is needed.');
   $('ppProActions').hidden=!access.hasBillingAccount;
   text('ppProManage','Manage paid billing');$('ppProManage').dataset.ppFlow='manage';
   text('ppProCancelHelp','Opens Stripe’s secure billing page for any separate paid subscription.');
  }else if(access.status==='complimentary'){
   badge('Complimentary Pro active','active');
   const expiry=access.until?' Complimentary Pro is active until '+date(access.until)+'.':' Complimentary Pro is active with no expiry date.';
   text('ppProStatus',expiry+(access.hasBillingAccount?' Any existing paid Stripe subscription continues separately until you cancel it in the billing portal.':''));
   $('ppProActions').hidden=!access.hasBillingAccount;
   text('ppProManage','Manage paid billing');$('ppProManage').dataset.ppFlow='manage';
   text('ppProCancelHelp','Opens Stripe’s secure billing page for any separate paid subscription.');
  }else if(access.tier==='pro'){
   badge(access.cancelAtPeriodEnd?'Pro active · ending soon':access.trialEnd?'Free trial active':'Pro subscription active',access.cancelAtPeriodEnd?'ending':'active');
   text('ppProDescription','Your PrintProfit Pro tools are ready. Your plan and next billing date are shown below.');
   const price=access.plan==='annual'?'£24/year':'£2.50/month';
   const message=access.trialEnd?'Free trial ends '+date(access.until)+(access.cancelAtPeriodEnd?' · cancellation scheduled.':' · '+price+' afterward.'):(access.cancelAtPeriodEnd?'Pro access ends '+date(access.until)+' · cancellation scheduled.':'Pro '+access.plan+' plan renews '+date(access.until)+' at '+price+'.');
   text('ppProStatus',message);
   $('ppProActions').hidden=false;
   text('ppProManage',access.cancelAtPeriodEnd?'View cancellation in Stripe':'Cancel subscription');
   $('ppProManage').dataset.ppFlow=access.cancelAtPeriodEnd?'manage':'cancel';
   text('ppProCancelHelp',access.cancelAtPeriodEnd?'Your cancellation is scheduled. Stripe shows the end date and billing details.':'Opens Stripe’s cancellation screen directly. You confirm the cancellation there.');
  }else if(access.hasOpenSubscription){
   badge('Billing needs attention','ending');
   text('ppProDescription','Your subscription is still open, but Pro access is unavailable.');
   text('ppProStatus','Open Stripe to update your payment details or cancel your subscription.');
   $('ppProActions').hidden=false;
   text('ppProManage','Manage or cancel subscription');$('ppProManage').dataset.ppFlow='manage';
   text('ppProCancelHelp','Opens Stripe’s secure billing page.');
  }else{
   badge(access.eligibleForTrial?'7 days free':'Subscribe to Pro','offer');
   text('ppProDescription',access.eligibleForTrial?standardOffer:'Choose a monthly or annual Pro subscription. Your trial has already been used, so billing starts at Checkout. Cancel anytime from this account page.');
   text('ppProStatus',access.eligibleForTrial?'Your first subscription includes a seven day free trial. Add payment details in Stripe Checkout; cancel before the trial ends to avoid the first charge.':'Your trial has been used. The selected plan starts charging when Checkout completes.');
   text('ppProConsentText',access.eligibleForTrial?'I understand I will be charged for my chosen plan after the seven day trial unless I cancel before it ends.':'I understand the chosen plan starts charging at Checkout and renews automatically until I cancel.');
   $('ppProPlans').hidden=false;
   $('ppProPlans').querySelector('[data-pp-billing="monthly"]').textContent=access.eligibleForTrial?'Start 7-day free trial · monthly':'Subscribe monthly';
   $('ppProPlans').querySelector('[data-pp-billing="annual"]').textContent=access.eligibleForTrial?'Start 7-day free trial · annual':'Subscribe annually';
   $('ppProPlans').querySelectorAll('[data-pp-consent]').forEach(consent=>{consent.checked=false;});
  }
 }catch{if(token===generation){accessChanged('basic');$('ppProBadge').hidden=true;text('ppProStatus','Subscription status is unavailable. Please try again when connected.');}}
}
async function requirePro(){
 if(!window.PRINTPROFIT_BILLING_CONFIG?.enabled)return true;
 try{
  const context=await window.__ppBillingAccountContext();
  if(!context?.user?.emailVerified||!context.legalAccepted){
   window.__ppOpenWorkspaceWorkshop?.('account');
   text('ppProStatus','Sign in, verify your email and accept the account terms to choose Pro.');
   return false;
  }
  const access=await invoke('getProAccess');
  const latest=await window.__ppBillingAccountContext();
  if(latest?.user?.uid!==context.user.uid||!latest.legalAccepted)return false;
  accessChanged(access.tier);
  if(access.tier==='pro')return true;
  window.__ppOpenWorkspaceWorkshop?.('account');
  refresh(true);
  return false;
 }catch{
  window.__ppOpenWorkspaceWorkshop?.('account');
  text('ppProStatus','Pro access could not be checked. Please try again when connected.');
  return false;
 }
}
window.__ppCheckCloudAccess=async()=>{
 const context=await window.__ppBillingAccountContext();
 if(!context?.user?.emailVerified||!context.legalAccepted)return false;
 const access=await invoke('getProAccess');
 const latest=await window.__ppBillingAccountContext();
 if(latest?.user?.uid!==context.user.uid||!latest.legalAccepted)return false;
 accessChanged(access.tier);
 return access.tier==='pro';
};
window.__ppCheckBillingDeletion=async()=>{
 const result=await invoke('checkAccountDeletion');
 if(!result.allowed)throw new Error(result.reason||'Cancel your subscription before deleting your account.');
};
if(!window.PRINTPROFIT_BILLING_CONFIG?.enabled)return;
window.__ppRequirePro=requirePro;
const approved=new WeakSet(),checking=new WeakSet();
document.addEventListener('click',async event=>{
 const target=event.target.closest('#ppWorkspacePro [data-pp-pro-tool]:not([data-pp-pro-tool="subscription"]),#ppFarmEnabled,[data-mark-printed],[data-pp-material-scanner-toggle],#ppBusinessTools [data-pp-pro-action],#ppMaterialScan [data-pp-pro-action]');
 if(!target||approved.has(target)||checking.has(target))return;
 if(target.dataset.ppProAction==='quote'&&window.__ppProTier==='pro'&&Date.now()-window.__ppProVerifiedAt<5000)return;
 event.preventDefault();event.stopImmediatePropagation();checking.add(target);
 try{
  if(await requirePro()){
   if(target.dataset.ppProAction==='quote'){text('ppBusinessStatus','Pro access confirmed. Click Print / save draft quotation PDF again.');return;}
   approved.add(target);
   try{target.click()}finally{approved.delete(target)}
  }
 }finally{checking.delete(target)}
},true);
document.addEventListener('pp-workshop-open',()=>refresh(true));
document.addEventListener('pp-account-state-changed',event=>{
 const uid=event.detail?.uid||'';
 if(uid!==owner||!event.detail?.legalAccepted)refresh(true);
});
document.addEventListener('click',event=>{
 const button=event.target.closest('#ppProEntry [data-pp-pro-entry]');if(!button)return;
 event.preventDefault();
 const email=$('ppAccountEmail');
 if(!email)return;
 email.scrollIntoView({behavior:'smooth',block:'center'});
 email.focus({preventScroll:true});
 text('ppProStatus',button.dataset.ppProEntry==='create'?'Enter your email and password above, accept both account boxes, then choose Create account. Verify your email before starting Pro.':'Enter your account email and password above, then choose Sign in.');
});
document.addEventListener('click',async event=>{
 const button=event.target.closest('#ppProSubscription [data-pp-billing]');if(!button)return;
 event.preventDefault();
 const action=button.dataset.ppBilling;
 if(action!=='portal'&&!$('ppProPlans').querySelector('[data-pp-consent="'+action+'"]')?.checked){text('ppProStatus','Tick the agreement beside your chosen plan before continuing.');return;}
 button.disabled=true;
 try{
  const result=await invoke(action==='portal'?'createBillingPortal':'createProCheckout',action==='portal'?{flow:button.dataset.ppFlow==='cancel'?'cancel':'manage'}:{plan:action,purchaseAccepted:true});
  const destination=new URL(result.url);
  if(destination.protocol!=='https:'||!['checkout.stripe.com','billing.stripe.com'].includes(destination.hostname))throw Error('Unexpected billing destination');
  window.top.location.assign(destination.href);
 }catch(error){text('ppProStatus',error?.message||'Billing is unavailable. Please try again later.');button.disabled=false;}
});
if(document.querySelector('#ppMaterialsPanel.open'))refresh(true);
})();

