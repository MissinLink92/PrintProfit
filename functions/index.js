'use strict';
const {onCall,onRequest,HttpsError}=require('firebase-functions/v2/https');
const {onUserDeleted}=require('firebase-functions/v2/identity');
const {defineSecret,defineString,defineBoolean}=require('firebase-functions/params');
const {initializeApp}=require('firebase-admin/app');
const {getAuth}=require('firebase-admin/auth');
const {getFirestore,FieldValue,Timestamp}=require('firebase-admin/firestore');
const Stripe=require('stripe');
const core=require('./billing-core');
const billingEnvironment=require('./billing-environment');
const dashboard=require('./admin-dashboard-core');
const ownerAccess=dashboard.ownerAccess;
initializeApp();
const db=getFirestore();
const stripeKey=defineSecret('STRIPE_SECRET_KEY');
const webhookKey=defineSecret('STRIPE_WEBHOOK_SECRET');
const enabled=defineBoolean('PRINTPROFIT_BILLING_ENABLED',{default:false});
const month=defineString('STRIPE_PRO_MONTHLY_PRICE',{default:''});
const year=defineString('STRIPE_PRO_ANNUAL_PRICE',{default:''});
const ownerEmail=defineString('PRINTPROFIT_OWNER_EMAIL',{default:''});
const analyticsProperty=defineString('PRINTPROFIT_GA4_PROPERTY_ID',{default:''});
const callable={region:'europe-west2',secrets:[stripeKey],maxInstances:3,cors:['https://printprofit.co.uk','https://www.printprofit.co.uk','https://printprofit-test.web.app','https://printprofit-test.firebaseapp.com']};
const adminCors=['https://admin.printprofit.co.uk','https://printprofit-admin-fd30f.web.app','https://printprofit-admin-fd30f.firebaseapp.com'];
const ids=()=>({monthly:month.value(),annual:year.value()});
const environment=()=>billingEnvironment.environmentForProject(process.env.GCLOUD_PROJECT||process.env.GCP_PROJECT);
const stripe=()=>{const env=environment(),key=stripeKey.value();billingEnvironment.validateKey(key,env);return new Stripe(key,{apiVersion:billingEnvironment.API_VERSION});};
async function isOwner(auth){
 const configured=ownerEmail.value().trim().toLowerCase();
 if(!configured||String(auth.token.email||'').trim().toLowerCase()!==configured)return false;
 const current=await getAuth().getUser(auth.uid);
 return !current.disabled&&current.emailVerified===true&&String(current.email||'').trim().toLowerCase()===configured;
}
function user(request){
 if(!request.auth)throw new HttpsError('unauthenticated','Sign in before managing a subscription.');
 if(request.auth.token.email_verified!==true)throw new HttpsError('failed-precondition','Verify your email before managing a subscription.');
 return request.auth;
}
async function ownerGuard(request){
 if(!request.auth)throw new HttpsError('unauthenticated','Sign in to the owner dashboard.');
 if(!dashboard.requireOwnerMfa(request.auth,ownerEmail.value())||!await isOwner(request.auth))
  throw new HttpsError('permission-denied','Owner sign-in with an authenticator code is required.');
 return request.auth;
}
async function customerFor(auth,client,create=false){
 const ref=db.collection('billingCustomers').doc(auth.uid),saved=await ref.get();
 if(saved.exists)return saved.data().customerId;
 if(!create)return null;
 const customer=await client.customers.create({email:auth.token.email,metadata:{printprofitUid:auth.uid}},{idempotencyKey:'pp-customer-'+auth.uid});
 return db.runTransaction(async tx=>{const snapshot=await tx.get(ref);if(snapshot.exists)return snapshot.data().customerId;tx.set(ref,{customerId:customer.id,createdAt:FieldValue.serverTimestamp()});return customer.id;});
}
async function subscriptions(client,customer){
 const result=[];
 for await(const subscription of client.subscriptions.list({customer,status:'all',limit:100}))result.push(subscription);
 return result;
}
function entitlementRecord(access,ownerAccess=false,eventCreated=null){
 const validUntil=Number(access.until);
 const lifetimeComplimentary=access.tier==='pro'&&access.status==='complimentary'&&access.until===null;
 const checkedUntilMillis=Date.now()+15*60*1000;
 return {...access,ownerAccess:Boolean(ownerAccess),validUntil:!ownerAccess&&access.tier==='pro'?(lifetimeComplimentary?Timestamp.fromMillis(checkedUntilMillis):(Number.isFinite(validUntil)&&validUntil>0?Timestamp.fromMillis(validUntil*1000):null)):null,checkedAt:FieldValue.serverTimestamp(),checkedUntil:Timestamp.fromMillis(checkedUntilMillis),...(eventCreated===null?{}:{eventCreated})};
}
async function saveEntitlement(uid,access,ownerAccess=false){
 await db.collection('billingEntitlements').doc(uid).set(entitlementRecord(access,ownerAccess));
}
async function complimentaryGrant(uid){
 billingEnvironment.validateKey(stripeKey.value(),environment());
 const grant=(await db.collection('adminGrants').doc(uid).get()).data();
 return ownerAccess.grantActive(grant)?grant:null;
}
exports.getProAccess=onCall(callable,async request=>{
 const auth=user(request);
 if(await isOwner(auth)){
  const mapping=await db.collection('billingCustomers').doc(auth.uid).get();
  const access={tier:'pro',plan:null,until:null,trialEnd:null,status:'owner',cancelAtPeriodEnd:false};
  await saveEntitlement(auth.uid,access,true);
  return {...access,eligibleForTrial:false,hasBillingAccount:mapping.exists};
 }
 const grant=await complimentaryGrant(auth.uid);
 if(grant){
  const mapping=await db.collection('billingCustomers').doc(auth.uid).get();
  const access={tier:'pro',plan:null,until:grant.until??null,trialEnd:null,status:'complimentary',cancelAtPeriodEnd:false};
  await saveEntitlement(auth.uid,access,false);
  return {...access,eligibleForTrial:false,hasBillingAccount:mapping.exists};
 }
 const client=stripe(),customer=await customerFor(auth,client);
 if(!customer){
  const access=core.accessFromSubscriptions([],ids());
  await saveEntitlement(auth.uid,access,false);
  return {...access,eligibleForTrial:true};
 }
 const history=await subscriptions(client,customer);
 const access=core.accessFromSubscriptions(history,ids(),undefined,environment().livemode);
 await saveEntitlement(auth.uid,access,false);
 return {...access,eligibleForTrial:core.eligibleForTrial(history),hasOpenSubscription:history.some(subscription=>subscription.livemode===environment().livemode&&!['canceled','incomplete_expired'].includes(subscription.status))};
});
exports.createProCheckout=onCall(callable,async request=>{
 const auth=user(request);
 if(await isOwner(auth))throw new HttpsError('failed-precondition','Your owner account already has Pro. No subscription is needed.');
 if(!enabled.value())throw new HttpsError('failed-precondition','Subscriptions are not available yet.');
 if(await complimentaryGrant(auth.uid))throw new HttpsError('failed-precondition','Complimentary Pro is already active on this account.');
 const plan=request.data?.plan;
 let priceId;try{priceId=core.planPrice(plan,ids())}catch{throw new HttpsError('invalid-argument','Choose monthly or annual.');}
 const acceptance=await db.doc('users/'+auth.uid+'/legal/acceptance-2026-10-12-v2').get();
 if(!acceptance.exists)throw new HttpsError('failed-precondition','Accept the current account terms first.');
 if(request.data?.purchaseAccepted!==true)throw new HttpsError('failed-precondition','Confirm the trial, price and renewal terms before continuing.');
 const client=stripe();
 try{core.validatePrice(await client.prices.retrieve(priceId),plan,true,environment().livemode)}catch{throw new HttpsError('failed-precondition','This plan is not configured correctly. No payment was taken.');}
 const customer=await customerFor(auth,client,true);
 const current=await subscriptions(client,customer);
 if(current.some(s=>!['canceled','incomplete_expired'].includes(s.status)))throw new HttpsError('already-exists','Manage your existing subscription instead of starting another.');
 const ref=db.collection('billingCheckoutLocks').doc(auth.uid),now=Date.now();
 const existing=await db.runTransaction(async tx=>{
  const snapshot=await tx.get(ref),value=snapshot.data()||{};
  if(value.expiresAt>now&&value.url){if(value.priceId!==priceId)throw new HttpsError('failed-precondition','An existing checkout is still open for the other plan. Finish it or wait for it to expire.');return value.url;}
  if(value.lockedAt>now-120000)throw new HttpsError('aborted','Checkout is being prepared. Try again shortly.');
  tx.set(ref,{lockedAt:now,priceId});return null;
 });
 if(existing)return {url:existing};
 try{
  const trial=core.eligibleForTrial(current);
  const session=await client.checkout.sessions.create(core.checkoutParameters(customer,auth.uid,priceId,environment().site,trial),{idempotencyKey:'pp-checkout-'+auth.uid+'-'+now});
  await db.collection('billingPurchaseConsents').doc(session.id).set({uid:auth.uid,plan,priceId,trialDays:trial?core.TRIAL_DAYS:0,acceptedAt:FieldValue.serverTimestamp(),termsVersion:'2026-10-20-v1'});
  await ref.set({url:session.url,priceId,expiresAt:session.expires_at*1000,lockedAt:0});
  return {url:session.url};
 }catch(error){console.error('Checkout preparation failed',{type:error?.type,code:error?.code,param:error?.param,statusCode:error?.statusCode});await ref.delete();throw new HttpsError('unavailable','Checkout could not be prepared. Please try again.');}
});
exports.createBillingPortal=onCall(callable,async request=>{
 const auth=user(request),client=stripe(),customer=await customerFor(auth,client);
 if(!customer)throw new HttpsError('not-found','No billing account exists yet.');
 const params={customer,return_url:environment().site+'?open=account'};
 if(request.data?.flow==='cancel'){
  const history=await subscriptions(client,customer);
  const current=history.find(subscription=>subscription.id&&(()=>{
   const access=core.accessFromSubscriptions([subscription],ids(),undefined,environment().livemode);
   return access.tier==='pro'&&!access.cancelAtPeriodEnd;
  })());
  if(!current)throw new HttpsError('failed-precondition','There is no active subscription to cancel. Refresh your account status.');
  params.flow_data={type:'subscription_cancel',subscription_cancel:{subscription:current.id},after_completion:{type:'redirect',redirect:{return_url:environment().site+'?open=account&billing=returned'}}};
 }
 const session=await client.billingPortal.sessions.create(params);
 return {url:session.url};
});
exports.checkAccountDeletion=onCall(callable,async request=>{
 const auth=user(request),client=stripe(),customer=await customerFor(auth,client);
 if(!customer)return {allowed:true};
 const history=await subscriptions(client,customer);
 if(history.some(s=>!['canceled','incomplete_expired'].includes(s.status)))return {allowed:false,reason:'Cancel your subscription in the billing portal and wait until it ends before deleting your account.'};
 return {allowed:true};
});
exports.reconcileDeletedBillingUser=onUserDeleted({region:'europe-west2',secrets:[stripeKey],maxInstances:3,retry:true},async event=>{
 const uid=event.data?.uid;if(!uid)return;
 await db.collection('adminGrants').doc(uid).delete();
 await db.collection('billingEntitlements').doc(uid).delete();
 const ref=db.collection('billingCustomers').doc(uid),mapping=await ref.get();
 const customerId=mapping.data()?.customerId;if(!customerId)return;
 const client=stripe(),history=await subscriptions(client,customerId);
 for(const subscription of history){
  billingEnvironment.assertMode(subscription,environment());
  if(['canceled','incomplete_expired'].includes(subscription.status))continue;
  await client.subscriptions.cancel(subscription.id,{invoice_now:false,prorate:false},{idempotencyKey:'pp-deleted-'+uid+'-'+subscription.id});
 }
 await ref.delete();
});
exports.stripeBillingWebhook=onRequest({region:'europe-west2',secrets:[stripeKey,webhookKey],maxInstances:3},async(req,res)=>{
 if(req.method!=='POST'){res.status(405).send('POST required');return;}
 const client=stripe();let event;
 try{event=client.webhooks.constructEvent(req.rawBody,req.headers['stripe-signature'],webhookKey.value());}catch{res.status(400).send('Invalid signature');return;}
 try{billingEnvironment.assertMode(event,environment());}catch{res.status(400).send('Wrong Stripe mode');return;}
 if(!['checkout.session.completed','checkout.session.async_payment_succeeded','invoice.paid','invoice.payment_failed','customer.subscription.created','customer.subscription.updated','customer.subscription.deleted','customer.subscription.paused','customer.subscription.resumed','customer.subscription.trial_will_end'].includes(event.type)){res.status(200).send('Ignored');return;}
 try{
  const object=event.data.object;
  billingEnvironment.assertMode(object,environment());
  if(event.type.startsWith('checkout.session.')&&(object.mode!=='subscription'||!['paid','no_payment_required'].includes(object.payment_status))){res.status(200).send('Awaiting completed subscription');return;}
  const customerId=typeof object.customer==='string'?object.customer:object.customer?.id;
  if(!customerId){res.status(200).send('No customer');return;}
  const customer=await client.customers.retrieve(customerId);
  billingEnvironment.assertMode(customer,environment());
  const uid=customer.metadata?.printprofitUid;
  if(!uid){res.status(200).send('Unlinked customer');return;}
  const mapping=await db.collection('billingCustomers').doc(uid).get();
  if(mapping.data()?.customerId!==customerId){res.status(200).send('Unlinked customer');return;}
  const access=core.accessFromSubscriptions(await subscriptions(client,customerId),ids(),undefined,environment().livemode);
  const state=db.collection('billingEntitlements').doc(uid),seen=db.collection('billingWebhookEvents').doc(event.id);
  await db.runTransaction(async tx=>{
   const prior=await tx.get(seen),previous=await tx.get(state);
   if(prior.exists)return;
   tx.create(seen,{eventCreated:event.created,processedAt:FieldValue.serverTimestamp()});
   if((previous.data()?.eventCreated||0)>event.created)return;
   tx.set(state,entitlementRecord(access,false,event.created));
  });
  res.status(200).send('Received');
 }catch{res.status(500).send('Please retry');}
});

exports.getOwnerDashboard=onCall({...callable,cors:adminCors},async request=>{
 await ownerGuard(request);
 const client=stripe(),items=[];
 for await(const subscription of client.subscriptions.list({status:'all',limit:100,expand:['data.items.data.price','data.customer']})){
  if(items.length===9999)break;
  items.push(subscription);
 }
 const activeGrants=items.some(item=>item.status==='trialing')
  ? await db.collection('adminGrants').where('active','==',true).get() : {docs:[]};
 const grants=new Map(activeGrants.docs.map(doc=>[doc.id,doc.data()]));
 const billing={...dashboard.summarizeSubscriptions(items,ids(),environment().livemode,grants),trials:dashboard.listTrialAccounts(items,ids(),environment().livemode,grants),incomplete:items.length===9999};
 const days=[7,30,90].includes(Number(request.data?.days))?Number(request.data.days):7;
 const property=analyticsProperty.value().trim();
 let traffic={available:false,days,reason:property?'GA4 report is temporarily unavailable.':'Add a GA4 property ID and grant its service account Viewer access.'};
 if(/^\d+$/.test(property)){
  try{
   const {GoogleAuth}=require('google-auth-library');
   const access=await new GoogleAuth({scopes:['https://www.googleapis.com/auth/analytics.readonly']}).getAccessToken();
   const response=await fetch('https://analyticsdata.googleapis.com/v1beta/properties/'+property+':runReport',{
    method:'POST',signal:AbortSignal.timeout(7000),headers:{Authorization:'Bearer '+access,'Content-Type':'application/json'},
    body:JSON.stringify({dateRanges:[{startDate:days+'daysAgo',endDate:'yesterday'}],metrics:[{name:'activeUsers'},{name:'sessions'},{name:'screenPageViews'}]})
   });
   if(!response.ok)throw Error('GA4 API status '+response.status);
   const values=(await response.json()).rows?.[0]?.metricValues||[];
   traffic={available:true,days,period:'Last '+days+' complete days',visitors:Number(values[0]?.value||0),sessions:Number(values[1]?.value||0),pageViews:Number(values[2]?.value||0)};
  }catch(error){console.error('Owner dashboard GA4 report unavailable',{message:error?.message});}
 }
 return {asOf:new Date().toISOString(),billing,traffic,affiliate:{available:false,reason:'Affiliate partner reports are not connected yet.'}};
});

const accessHandlers=ownerAccess.createOwnerAccessHandlers({db,auth:getAuth(),HttpsError,ownerGuard,FieldValue});
for(const [name,handler] of Object.entries(accessHandlers))exports[name]=onCall({region:'europe-west2',secrets:[],maxInstances:2,cors:adminCors},handler);

exports.prepareOwnerEnrollment=onCall({region:'europe-west2',secrets:[],maxInstances:3,cors:adminCors},async request=>{
 if(!request.auth||!await isOwner(request.auth))throw new HttpsError('permission-denied','Verified owner sign-in required.');
 const account=await getAuth().getUser(request.auth.uid);
 if(account.multiFactor?.enrolledFactors?.length)throw new HttpsError('failed-precondition','An authenticator is already enrolled. Sign in with it.');
 return {ready:true};
});
