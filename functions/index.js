'use strict';
const {onCall,onRequest,HttpsError}=require('firebase-functions/v2/https');
const {defineSecret,defineString,defineBoolean}=require('firebase-functions/params');
const {initializeApp}=require('firebase-admin/app');
const {getFirestore,FieldValue}=require('firebase-admin/firestore');
const Stripe=require('stripe');
const core=require('./billing-core');
initializeApp();
const db=getFirestore();
const stripeKey=defineSecret('STRIPE_SECRET_KEY');
const webhookKey=defineSecret('STRIPE_WEBHOOK_SECRET');
const enabled=defineBoolean('PRINTPROFIT_BILLING_ENABLED',{default:false});
const month=defineString('STRIPE_PRO_MONTHLY_PRICE',{default:''});
const year=defineString('STRIPE_PRO_ANNUAL_PRICE',{default:''});
const callable={region:'europe-west2',secrets:[stripeKey],maxInstances:3,cors:['https://printprofit.co.uk','https://www.printprofit.co.uk']};
const ids=()=>({monthly:month.value(),annual:year.value()});
const stripe=()=>new Stripe(stripeKey.value());
function user(request){
 if(!request.auth)throw new HttpsError('unauthenticated','Sign in before managing a subscription.');
 if(request.auth.token.email_verified!==true)throw new HttpsError('failed-precondition','Verify your email before managing a subscription.');
 return request.auth;
}
async function customerFor(auth,client,create=false){
 const ref=db.collection('billingCustomers').doc(auth.uid),saved=await ref.get();
 if(saved.exists)return saved.data().customerId;
 if(!create)return null;
 // Stripe idempotency plus a Firestore transaction prevents parallel customer creation.
 const customer=await client.customers.create({email:auth.token.email,metadata:{printprofitUid:auth.uid}},{idempotencyKey:'pp-customer-'+auth.uid});
 return db.runTransaction(async tx=>{const snapshot=await tx.get(ref);if(snapshot.exists)return snapshot.data().customerId;tx.set(ref,{customerId:customer.id,createdAt:FieldValue.serverTimestamp()});return customer.id;});
}
async function subscriptions(client,customer){
 const result=[];
 for await(const subscription of client.subscriptions.list({customer,status:'all',limit:100}))result.push(subscription);
 return result;
}
exports.getProAccess=onCall(callable,async request=>{
 const auth=user(request),client=stripe(),customer=await customerFor(auth,client);
 if(!customer)return {tier:'basic',plan:null,until:null,cancelAtPeriodEnd:false};
 // Always check Stripe on the server. Neither localStorage nor a return URL grants Pro.
 return core.accessFromSubscriptions(await subscriptions(client,customer),ids());
});
exports.createProCheckout=onCall(callable,async request=>{
 const auth=user(request);
 if(!enabled.value())throw new HttpsError('failed-precondition','Subscriptions are not available yet.');
 const plan=request.data?.plan;
 let priceId;try{priceId=core.planPrice(plan,ids())}catch{throw new HttpsError('invalid-argument','Choose monthly or annual.');}
 const acceptance=await db.doc('users/'+auth.uid+'/legal/acceptance-2026-10-12-v2').get();
 if(!acceptance.exists)throw new HttpsError('failed-precondition','Accept the current account terms first.');
 const client=stripe();
 try{core.validatePrice(await client.prices.retrieve(priceId),plan)}catch{throw new HttpsError('failed-precondition','This plan is not configured correctly. No payment was taken.');}
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
  const session=await client.checkout.sessions.create(core.checkoutParameters(customer,auth.uid,priceId),{idempotencyKey:'pp-checkout-'+auth.uid+'-'+now});
  await ref.set({url:session.url,priceId,expiresAt:session.expires_at*1000,lockedAt:0});
  return {url:session.url};
 }catch(error){await ref.delete();throw new HttpsError('unavailable','Checkout could not be prepared. Please try again.');}
});
exports.createBillingPortal=onCall(callable,async request=>{
 const auth=user(request),client=stripe(),customer=await customerFor(auth,client);
 if(!customer)throw new HttpsError('not-found','No billing account exists yet.');
 const session=await client.billingPortal.sessions.create({customer,return_url:core.SITE});
 return {url:session.url};
});
exports.stripeBillingWebhook=onRequest({region:'europe-west2',secrets:[stripeKey,webhookKey],maxInstances:3},async(req,res)=>{
 if(req.method!=='POST'){res.status(405).send('POST required');return;}
 const client=stripe();let event;
 try{event=client.webhooks.constructEvent(req.rawBody,req.headers['stripe-signature'],webhookKey.value());}catch{res.status(400).send('Invalid signature');return;}
 if(!['customer.subscription.created','customer.subscription.updated','customer.subscription.deleted','customer.subscription.paused','customer.subscription.resumed'].includes(event.type)){res.status(200).send('Ignored');return;}
 try{
  const object=event.data.object,customerId=typeof object.customer==='string'?object.customer:object.customer.id;
  const customer=await client.customers.retrieve(customerId),uid=customer.metadata?.printprofitUid;
  if(!uid){res.status(200).send('Unlinked customer');return;}
  const mapping=await db.collection('billingCustomers').doc(uid).get();
  if(mapping.data()?.customerId!==customerId){res.status(200).send('Unlinked customer');return;}
  const access=core.accessFromSubscriptions(await subscriptions(client,customerId),ids());
  const state=db.collection('billingEntitlements').doc(uid),seen=db.collection('billingWebhookEvents').doc(event.id);
  await db.runTransaction(async tx=>{
   const prior=await tx.get(seen),previous=await tx.get(state);
   if(prior.exists)return;
   tx.create(seen,{eventCreated:event.created,processedAt:FieldValue.serverTimestamp()});
   if((previous.data()?.eventCreated||0)>event.created)return;
   tx.set(state,{...access,eventCreated:event.created,checkedAt:FieldValue.serverTimestamp()});
  });
  res.status(200).send('Received');
 }catch{res.status(500).send('Please retry');}
});
