'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const core=require('./billing-core');
function harness(options={}){
 const calls=[],client={customers:{retrieve:async()=>{calls.push('customer-read');return{livemode:false,metadata:{printprofitUid:'owner'}};}},subscriptions:{list:()=>{calls.push('subscriptions');return(async function*(){yield*(options.subscriptions||[]);})();}},billingPortal:{sessions:{create:async value=>{calls.push(value);return{url:'https://billing.stripe.com/session'};}}},webhooks:{constructEvent:()=>{if(options.event)return options.event;throw Error('bad signature');}}};
 const db={collection:name=>({doc:uid=>({name,uid,get:async()=>{calls.push({collection:name,uid});return{exists:name==='billingCustomers',data:()=>name==='billingCustomers'?{customerId:'cus_authenticated_owner'}:{}};}})}),runTransaction:async fn=>fn({get:ref=>ref.get(),create:(ref,data)=>calls.push({operation:'create',collection:ref.name,data}),set:(ref,data)=>calls.push({operation:'set',collection:ref.name,data})})};
 class HttpsError extends Error{constructor(code,message){super(message);this.code=code;}}
 const exported={},sandbox={process:{env:{GCLOUD_PROJECT:options.project||'printprofit-test'}},exports:exported,require:name=>{
  if(name==='firebase-functions/v2/https')return{onCall:(options,handler)=>handler,onRequest:(options,handler)=>handler,HttpsError};
  if(name==='firebase-functions/params')return{defineSecret:()=>({value:()=>options.key||'sk_test_fixture_only'}),defineString:(name,value)=>({value:()=>options.params?.[name]??value.default}),defineBoolean:(name,value)=>({value:()=>value.default})};
  if(name==='firebase-admin/app')return{initializeApp:()=>{}};
  if(name==='firebase-admin/firestore')return{getFirestore:()=>db,FieldValue:{serverTimestamp:()=>0}};
  if(name==='stripe')return function(){return client;};
  if(name==='./billing-core')return core;
  if(name==='./billing-environment')return require('./billing-environment');
  throw Error(name);
 }};
 vm.runInNewContext(fs.readFileSync(__dirname+'/index.js','utf8'),sandbox);
 return{handlers:exported,calls,client};
}
test('signed-out and unverified callers cannot use billing endpoints',async()=>{
 for(const name of ['createProCheckout','createBillingPortal','getProAccess']){
  const h=harness();await assert.rejects(h.handlers[name]({data:{customer:'cus_other'}}),e=>e.code==='unauthenticated');
  await assert.rejects(h.handlers[name]({auth:{uid:'owner',token:{email_verified:false}}}),e=>e.code==='failed-precondition');assert.equal(h.calls.length,0);
 }
});
test('checkout stays disabled without explicitly enabled server configuration',async()=>{
 const h=harness();await assert.rejects(h.handlers.createProCheckout({auth:{uid:'owner',token:{email_verified:true}},data:{plan:'monthly'}}),e=>e.code==='failed-precondition');assert.equal(h.calls.length,0);
});
test('portal ignores client customer and return URL and uses the authenticated mapping',async()=>{
 const h=harness();await h.handlers.createBillingPortal({auth:{uid:'owner',token:{email_verified:true}},data:{customer:'cus_victim',return_url:'https://evil.example/'}});
 assert.equal(h.calls[0].uid,'owner');assert.equal(h.calls[1].customer,'cus_authenticated_owner');assert.equal(h.calls[1].return_url,'https://printprofit-test.web.app/');
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

for(const eventType of ['invoice.paid','invoice.payment_failed','checkout.session.completed','checkout.session.async_payment_succeeded']){
 test(eventType+' refreshes the mapped customer from current Stripe subscription state',async()=>{
  const subscription={livemode:false,status:eventType==='invoice.payment_failed'?'past_due':'active',items:{data:[{quantity:1,current_period_end:Math.floor(Date.now()/1000)+86400,price:{id:'price_month',livemode:false,active:true,currency:'gbp',unit_amount:250,type:'recurring',tax_behavior:'inclusive',recurring:{interval:'month',interval_count:1,usage_type:'licensed'}}}]}};
  const h=harness({params:{STRIPE_PRO_MONTHLY_PRICE:'price_month'},subscriptions:[subscription],event:{id:'evt_fixture',created:10,livemode:false,type:eventType,data:{object:{livemode:false,customer:'cus_authenticated_owner',mode:'subscription',payment_status:'paid'}}}});
  const res={status(code){this.code=code;return this;},send(){}};
  await h.handlers.stripeBillingWebhook({method:'POST',rawBody:Buffer.from('{}'),headers:{}},res);
  assert.equal(res.code,200);const write=h.calls.find(x=>x.operation==='set'&&x.collection==='billingEntitlements');assert.ok(write);assert.equal(write.data.tier,eventType==='invoice.payment_failed'?'basic':'pro');
 });
}
