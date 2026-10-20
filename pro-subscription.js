(()=>{
'use strict';
if(!window.PRINTPROFIT_BILLING_CONFIG?.enabled)return;
const FIREBASE_VERSION='12.19.0';
let callable=null,owner='',generation=0,loading=false;
const $=id=>document.getElementById(id);
const date=seconds=>new Date(seconds*1000).toLocaleDateString('en-GB',{day:'numeric',month:'long',year:'numeric'});
const text=(id,value)=>{const node=$(id);if(node)node.textContent=value;};
function panel(){
 const card=document.querySelector('#ppWorkshopAccount .pp-account-card');
 if(!card)return null;
 if($('ppProSubscription'))return $('ppProSubscription');
 const section=document.createElement('section');section.id='ppProSubscription';section.setAttribute('aria-labelledby','ppProTitle');
 section.innerHTML='<h3 id="ppProTitle">PrintProfit Pro</h3><p>Seven days free for a new subscriber, then £2.50/month or £24/year (paid upfront). Cancel through Stripe’s billing portal. Your projects and inventory remain yours if Pro ends.</p><p id="ppProStatus" role="status" aria-live="polite">Sign in with a verified account to see your plan.</p><div id="ppProPlans" hidden><label><input id="ppProConsent" type="checkbox"><span><span id="ppProConsentText"></span> I have read the <a href="./terms.html" target="_top">subscription terms</a>.</span></label><div><button type="button" data-pp-billing="monthly">Choose monthly · £2.50/month</button><button type="button" data-pp-billing="annual">Choose annual · £24/year</button></div></div><button type="button" id="ppProManage" data-pp-billing="portal" hidden>Manage or cancel subscription</button>';
 const style=document.createElement('style');style.textContent='#ppProSubscription{width:100%;margin-top:14px;padding:15px;border:1px solid #517180;border-radius:10px;background:#0c222d;color:#eaf4f7}#ppProSubscription h3{margin:0 0 5px;font-size:16px}#ppProSubscription p{font-size:12px;line-height:1.5}#ppProPlans label{display:flex;gap:8px;align-items:flex-start;font-size:12px;line-height:1.5}#ppProPlans input{flex:none;margin-top:3px}#ppProPlans div{display:flex;flex-wrap:wrap;gap:8px;margin-top:10px}#ppProSubscription button{padding:9px 12px;border:1px solid #ff7800;border-radius:8px;background:#ff7800;color:white;font-weight:700;cursor:pointer}#ppProSubscription button:disabled{opacity:.5;cursor:wait}#ppProSubscription a{color:#75d8f2}#ppProPlans[hidden],#ppProManage[hidden]{display:none!important}body[data-pp-theme="light"] #ppProSubscription{background:#fff;color:#19252d}';
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
async function refresh(force=false){
 if(!panel())return;
 const token=++generation;
 let context;
 try{context=await window.__ppBillingAccountContext()}catch{context=null;}
 if(token!==generation)return;
 const user=context?.user,ready=Boolean(user?.emailVerified&&context.legalAccepted);
 $('ppProPlans').hidden=true;$('ppProManage').hidden=true;
 if(!ready){owner='';text('ppProStatus',user?'Accept the current account terms to manage Pro.':'Sign in with a verified account to see your plan.');return;}
 if(!force&&loading)return;
 owner=user.uid;loading=true;text('ppProStatus','Checking subscription with Stripe…');
 try{
  const access=await invoke('getProAccess');
  if(token!==generation||owner!==user.uid)return;
  if(access.tier==='pro'){
   const period=access.trialEnd?'Free trial ends':'Pro access continues until';
   text('ppProStatus',period+' '+date(access.until)+(access.cancelAtPeriodEnd?' · cancellation scheduled.':' · '+(access.plan==='annual'?'£24/year':'£2.50/month')+' afterward.'));
   $('ppProManage').hidden=false;
  }else{
   text('ppProStatus',access.eligibleForTrial?'Your first subscription includes a seven day free trial. Add payment details in Stripe Checkout; cancel before the trial ends to avoid the first charge.':'Your trial has been used. The selected plan starts charging when Checkout completes.');
   text('ppProConsentText',access.eligibleForTrial?'I understand I will be charged for my chosen plan after the seven day trial unless I cancel before it ends.':'I understand the chosen plan starts charging at Checkout and renews automatically until I cancel.');
   $('ppProPlans').hidden=false;
   const consent=$('ppProConsent');if(consent)consent.checked=false;
  }
 }catch{if(token===generation)text('ppProStatus','Subscription status is unavailable. Please try again when connected.');}
 finally{loading=false;}
}
window.__ppCheckBillingDeletion=async()=>{
 const result=await invoke('checkAccountDeletion');
 if(!result.allowed)throw new Error(result.reason||'Cancel your subscription before deleting your account.');
};
document.addEventListener('pp-workshop-open',()=>refresh(true));
document.addEventListener('pp-account-state-changed',event=>{
 const uid=event.detail?.uid||'';
 if(uid!==owner||!event.detail?.legalAccepted)refresh(true);
});
document.addEventListener('click',async event=>{
 const button=event.target.closest('#ppProSubscription [data-pp-billing]');if(!button)return;
 event.preventDefault();
 const action=button.dataset.ppBilling;
 if(action!=='portal'&&!$('ppProConsent')?.checked){text('ppProStatus','Confirm the trial and renewal terms before continuing.');return;}
 button.disabled=true;
 try{
  const result=await invoke(action==='portal'?'createBillingPortal':'createProCheckout',action==='portal'?{}:{plan:action,purchaseAccepted:true});
  const destination=new URL(result.url);
  if(destination.protocol!=='https:'||!['checkout.stripe.com','billing.stripe.com'].includes(destination.hostname))throw Error('Unexpected billing destination');
  window.top.location.assign(destination.href);
 }catch(error){text('ppProStatus',error?.message||'Billing is unavailable. Please try again later.');button.disabled=false;}
});
if(document.querySelector('#ppMaterialsPanel.open'))refresh(true);
})();
