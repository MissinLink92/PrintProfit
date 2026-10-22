'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const core=require('./billing-core');
function harness(options={}){
 const calls=[],client={customers:{retrieve:async()=>{calls.push('customer-read');return{livemode:false,metadata:{printprofitUid:'owner'}};}},prices:{retrieve:async()=>({id:'price_month',livemode:false,active:true,currency:'gbp',unit_amount:250,type:'recurring',tax_behavior:'inclusive',recurring:{interval:'month',interval_count:1,usage_type:'licensed'}})},checkout:{sessions:{create:async value=>{calls.push({checkout:value});return{id:'cs_fixture',url:'https://checkout.stripe.com/session',expires_at:Math.floor(Date.now()/1000)+1800};}}},subscriptions:{list:()=>{calls.push('subscriptions');return(async function*(){yield*(options.subscriptions||[]);})();},cancel:async(id,params)=>{calls.push({cancel:id,params});return{id,status:'canceled'};}},billingPortal:{sessions:{create:async value=>{calls.push(value);return{url:'https://billing.stripe.com/session'};}}},webhooks:{constructEvent:()=>{if(options.event)return options.event;throw Error('bad signature');}}};
 const db={doc:()=>({get:async()=>({exists:true})}),collection:name=>({doc:uid=>({name,uid,get:async()=>{calls.push({collection:name,uid});return{exists:name==='billingCustomers',data:()=>name==='billingCustomers'?{customerId:'cus_authenticated_owner'}:{}};},set:async data=>{calls.push({operation:'set',collection:name,data});},delete:async()=>{}})}),runTransaction:async fn=>fn({get:ref=>ref.get(),create:(ref,data)=>calls.push({operation:'create',collection:ref.name,data}),set:(ref,data)=>calls.push({operation:'set',collection:ref.name,data})})};
 class HttpsError extends Error{constructor(code,message){super(message);this.code=code;}}
 const exported={},sandbox={process:{env:{GCLOUD_PROJECT:options.project||'printprofit-test'}},exports:exported,require:name=>{
  if(name==='firebase-functions/v2/https')return{onCall:(options,handler)=>handler,onRequest:(options,handler)=>handler,HttpsError};
  if(name==='firebase-functions/v2/identity')return{onUserDeleted:(options,handler)=>handler};
  if(name==='firebase-functions/params')return{defineSecret:()=>({value:()=>options.key||'sk_test_fixture_only'}),defineString:(name,value)=>({value:()=>options.params?.[name]??value.default}),defineBoolean:(name,value)=>({value:()=>options.enabled??value.default})};
  if(name==='firebase-admin/app')return{initializeApp:()=>{}};
  if(name==='firebase-admin/auth')return{getAuth:()=>({getUser:async()=>{calls.push('auth-read');return options.authRecord??{email:'pro-owner@example.com',emailVerified:true,disabled:false};}})};
  if(name==='firebase-admin/firestore')return{getFirestore:()=>db,FieldValue:{serverTimestamp:()=>0},Timestamp:{fromMillis:millis=>({millis})}};
  if(name==='stripe')return function(){return client;};
  if(name==='./billing-core')return core;
  if(name==='./billing-environment')return require('./billing-environment');
  throw Error(name);
 }};
 vm.runInNewContext(fs.readFileSync(__dirname+'/index.js','utf8'),sandbox);
 return{handlers:exported,calls,client};
}
test('signed-out and unverified callers cannot use billing endpoints',async()=>{
 for(const name of ['createProCheckout','createBillingPortal','getProAccess','checkAccountDeletion']){
  const h=harness();await assert.rejects(h.handlers[name]({data:{customer:'cus_other'}}),e=>e.code==='unauthenticated');
  await assert.rejects(h.handlers[name]({auth:{uid:'owner',token:{email_verified:false}}}),e=>e.code==='failed-precondition');assert.equal(h.calls.length,0);
 }
});
test('verified configured owner receives Pro without Stripe and cannot buy a subscription',async()=>{
 const h=harness({key:'sk_live_wrong_mode',enabled:true,params:{PRINTPROFIT_OWNER_EMAIL:' Pro-Owner@Example.com '}});
 const auth={uid:'owner',token:{email_verified:true,email:'pro-owner@example.com'}};
 const access=await h.handlers.getProAccess({auth});
 assert.equal(access.tier,'pro');assert.equal(access.status,'owner');assert.equal(access.until,null);assert.equal(access.hasBillingAccount,true);
 assert.equal(h.calls.includes('auth-read'),true);
 const ownerGrant=h.calls.find(call=>call.operation==='set'&&call.collection==='billingEntitlements');
 assert.equal(ownerGrant.data.ownerAccess,true);assert.equal(ownerGrant.data.validUntil,null);assert.ok(ownerGrant.data.checkedUntil.millis>Date.now());
 assert.equal(h.calls.some(call=>call==='subscriptions'||call==='customer-read'),false);
 await assert.rejects(h.handlers.createProCheckout({auth,data:{plan:'monthly',purchaseAccepted:true}}),e=>e.code==='failed-precondition');
 assert.equal(h.calls.some(call=>call.checkout),false);
 await assert.rejects(h.handlers.getProAccess({auth:{uid:'owner',token:{email_verified:false,email:'pro-owner@example.com'}}}),e=>e.code==='failed-precondition');
 const stale=harness({key:'sk_live_wrong_mode',params:{PRINTPROFIT_OWNER_EMAIL:'pro-owner@example.com'},authRecord:{email:'different@example.com',emailVerified:true,disabled:false}});
 await assert.rejects(stale.handlers.getProAccess({auth}));
 const outsider=harness({key:'sk_live_wrong_mode',params:{PRINTPROFIT_OWNER_EMAIL:'pro-owner@example.com'}});
 await assert.rejects(outsider.handlers.getProAccess({auth:{uid:'other',token:{email_verified:true,email:'someone-else@example.com'}}}));
});
test('checkout stays disabled without explicitly enabled server configuration',async()=>{
 const h=harness();await assert.rejects(h.handlers.createProCheckout({auth:{uid:'owner',token:{email_verified:true}},data:{plan:'monthly'}}),e=>e.code==='failed-precondition');assert.equal(h.calls.length,0);
});
test('enabled first checkout requires purchase acknowledgement and includes the trial',async()=>{
 const h=harness({enabled:true,params:{STRIPE_PRO_MONTHLY_PRICE:'price_month'}}),auth={uid:'owner',token:{email_verified:true}};
 await assert.rejects(h.handlers.createProCheckout({auth,data:{plan:'monthly'}}),e=>e.code==='failed-precondition');
 const result=await h.handlers.createProCheckout({auth,data:{plan:'monthly',purchaseAccepted:true}});
 assert.equal(result.url,'https://checkout.stripe.com/session');
 assert.equal(h.calls.find(x=>x.checkout).checkout.subscription_data.trial_period_days,7);
 assert.equal(h.calls.find(x=>x.collection==='billingPurchaseConsents'&&x.operation==='set').data.plan,'monthly');
});
test('portal ignores client customer and return URL and uses the authenticated mapping',async()=>{
 const h=harness();await h.handlers.createBillingPortal({auth:{uid:'owner',token:{email_verified:true}},data:{customer:'cus_victim',return_url:'https://evil.example/'}});
 assert.equal(h.calls[0].uid,'owner');assert.equal(h.calls[1].customer,'cus_authenticated_owner');assert.equal(h.calls[1].return_url,'https://printprofit-test.web.app/?open=account');
});
test('invalid webhook signature cannot write or grant an entitlement',async()=>{
 const h=harness(),response={status(code){this.code=code;return this;},send(text){this.text=text;}};
 await h.handlers.stripeBillingWebhook({method:'POST',rawBody:Buffer.from('{}'),headers:{'stripe-signature':'invalid'}},response);
 assert.equal(response.code,400);assert.equal(h.calls.length,0);
});

test('test project rejects live credentials before Stripe or database calls',async()=>{
 const h=harness({key:'sk_live_fixture_only'});await assert.rejects(h.handlers.getProAccess({auth:{uid:'owner',token:{email_verified:true}}}));assert.equal(h.calls.length,0);
});
test('live project rejects sandbox credentials before Stripe or database calls',async()=>{
 const h=harness({project:'printprofit-fd30f'});await assert.rejects(h.handlers.getProAccess({auth:{uid:'owner',token:{email_verified:true}}}));assert.equal(h.calls.length,0);
});
test('wrong-mode signed webhook cannot touch customer data',async()=>{
 const h=harness();h.client.webhooks.constructEvent=()=>({livemode:true,type:'customer.subscription.updated'});
 const res={status(code){this.code=code;return this;},send(){}};
 await h.handlers.stripeBillingWebhook({method:'POST',rawBody:Buffer.from('{}'),headers:{}},res);assert.equal(res.code,400);assert.equal(h.calls.length,0);
});
test('unpaid checkout completion cannot update entitlements',async()=>{
 const h=harness();h.client.webhooks.constructEvent=()=>({livemode:false,type:'checkout.session.completed',data:{object:{livemode:false,mode:'subscription',payment_status:'unpaid'}}});
 const res={status(code){this.code=code;return this;},send(){}};
 await h.handlers.stripeBillingWebhook({method:'POST',rawBody:Buffer.from('{}'),headers:{}},res);assert.equal(res.code,200);assert.equal(h.calls.length,0);
});
test('trial Checkout without an immediate payment refreshes trial access',async()=>{
 const trial={livemode:false,status:'trialing',trial_end:Math.floor(Date.now()/1000)+7*86400,items:{data:[{quantity:1,price:{id:'price_month',livemode:false,active:true,currency:'gbp',unit_amount:250,type:'recurring',tax_behavior:'inclusive',recurring:{interval:'month',interval_count:1,usage_type:'licensed'}}}]}};
 const event={id:'evt_trial',created:11,livemode:false,type:'checkout.session.completed',data:{object:{livemode:false,customer:'cus_authenticated_owner',mode:'subscription',payment_status:'no_payment_required'}}};
 const h=harness({params:{STRIPE_PRO_MONTHLY_PRICE:'price_month'},subscriptions:[trial],event});
 const res={status(code){this.code=code;return this;},send(){}};
 await h.handlers.stripeBillingWebhook({method:'POST',rawBody:Buffer.from('{}'),headers:{}},res);
 assert.equal(res.code,200);assert.equal(h.calls.find(x=>x.operation==='set'&&x.collection==='billingEntitlements').data.status,'trialing');
});
test('getProAccess writes short-lived server entitlements and revokes non-Pro cloud writes',async()=>{
 const future=Math.floor(Date.now()/1000)+3600;
 const active={livemode:false,status:'active',items:{data:[{quantity:1,current_period_end:future,price:{id:'price_month',livemode:false,active:true,currency:'gbp',unit_amount:250,type:'recurring',tax_behavior:'inclusive',recurring:{interval:'month',interval_count:1,usage_type:'licensed'}}}]}};
 const auth={uid:'owner',token:{email_verified:true,email:'subscriber@example.com'}};
 const pro=harness({params:{STRIPE_PRO_MONTHLY_PRICE:'price_month'},subscriptions:[active]});
 const access=await pro.handlers.getProAccess({auth});
 const grant=pro.calls.find(call=>call.operation==='set'&&call.collection==='billingEntitlements');
 assert.equal(access.tier,'pro');assert.equal(grant.data.tier,'pro');assert.equal(grant.data.ownerAccess,false);
 assert.equal(grant.data.validUntil.millis,future*1000);assert.ok(grant.data.checkedUntil.millis>Date.now());
 const pastDue=harness({params:{STRIPE_PRO_MONTHLY_PRICE:'price_month'},subscriptions:[{...active,status:'past_due'}]});
 const denied=await pastDue.handlers.getProAccess({auth});
 const revoked=pastDue.calls.find(call=>call.operation==='set'&&call.collection==='billingEntitlements');
 assert.equal(denied.tier,'basic');assert.equal(revoked.data.tier,'basic');assert.equal(revoked.data.validUntil,null);
});
test('Firestore rules require fresh server Pro entitlements for profile and project writes',()=>{
 const rules=fs.readFileSync(__dirname+'/../firestore.rules','utf8');
 assert.equal(rules.split('&& hasFreshProEntitlement()').length-1,2);
 assert.ok(rules.includes('match /billingEntitlements/{userId}'));
 assert.ok(rules.includes('allow read, write: if false;'));
 assert.ok(rules.includes('allow get, list: if isVerifiedOwner();'));
 assert.ok(rules.includes('allow delete: if isOwner();'));
});
test('active or trialing subscriptions block account deletion',async()=>{
 const h=harness({subscriptions:[{status:'trialing'}]});
 const result=await h.handlers.checkAccountDeletion({auth:{uid:'owner',token:{email_verified:true}}});
 assert.equal(result.allowed,false);
});

for(const eventType of ['invoice.paid','invoice.payment_failed','checkout.session.completed','checkout.session.async_payment_succeeded']){
 test(eventType+' refreshes the mapped customer from current Stripe subscription state',async()=>{
  const subscription={livemode:false,status:eventType==='invoice.payment_failed'?'past_due':'active',items:{data:[{quantity:1,current_period_end:Math.floor(Date.now()/1000)+86400,price:{id:'price_month',livemode:false,active:true,currency:'gbp',unit_amount:250,type:'recurring',tax_behavior:'inclusive',recurring:{interval:'month',interval_count:1,usage_type:'licensed'}}}]}};
  const h=harness({params:{STRIPE_PRO_MONTHLY_PRICE:'price_month'},subscriptions:[subscription],event:{id:'evt_fixture',created:10,livemode:false,type:eventType,data:{object:{livemode:false,customer:'cus_authenticated_owner',mode:'subscription',payment_status:'paid'}}}});
  const res={status(code){this.code=code;return this;},send(){}};
  await h.handlers.stripeBillingWebhook({method:'POST',rawBody:Buffer.from('{}'),headers:{}},res);
  assert.equal(res.code,200);const write=h.calls.find(x=>x.operation==='set'&&x.collection==='billingEntitlements');assert.ok(write);assert.equal(write.data.tier,eventType==='invoice.payment_failed'?'basic':'pro');
 });
}

test('deleting an Auth user cancels an open trial even outside the account page',async()=>{
 const h=harness({subscriptions:[{id:'sub_trial',status:'trialing',livemode:false}]});
 await h.handlers.reconcileDeletedBillingUser({data:{uid:'owner'}});
 const cancel=h.calls.find(call=>call.cancel==='sub_trial');
 assert.equal(cancel.params.invoice_now,false);assert.equal(cancel.params.prorate,false);
});
test('deleted-user reconciliation rejects wrong Stripe mode before cancelling',async()=>{
 const h=harness({subscriptions:[{id:'sub_live',status:'active',livemode:true}]});
 await assert.rejects(h.handlers.reconcileDeletedBillingUser({data:{uid:'owner'}}));
 assert.equal(h.calls.some(call=>call.cancel),false);
});
