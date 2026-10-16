'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const core=require('./billing-core');
function harness(){
 const calls=[],client={customers:{retrieve:async()=>{calls.push('customer-read');return{};}},subscriptions:{list:()=>{calls.push('subscriptions');return(async function*(){})();}},billingPortal:{sessions:{create:async value=>{calls.push(value);return{url:'https://billing.stripe.com/session'};}}},webhooks:{constructEvent:()=>{throw Error('bad signature');}}};
 const db={collection:name=>({doc:uid=>({get:async()=>{calls.push({collection:name,uid});return{exists:true,data:()=>({customerId:'cus_authenticated_owner'})};}})})};
 class HttpsError extends Error{constructor(code,message){super(message);this.code=code;}}
 const exported={},sandbox={exports:exported,require:name=>{
  if(name==='firebase-functions/v2/https')return{onCall:(options,handler)=>handler,onRequest:(options,handler)=>handler,HttpsError};
  if(name==='firebase-functions/params')return{defineSecret:()=>({value:()=> 'test-secret'}),defineString:(name,value)=>({value:()=>value.default}),defineBoolean:(name,value)=>({value:()=>value.default})};
  if(name==='firebase-admin/app')return{initializeApp:()=>{}};
  if(name==='firebase-admin/firestore')return{getFirestore:()=>db,FieldValue:{serverTimestamp:()=>0}};
  if(name==='stripe')return function(){return client;};
  if(name==='./billing-core')return core;
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
 assert.equal(h.calls[0].uid,'owner');assert.equal(h.calls[1].customer,'cus_authenticated_owner');assert.equal(h.calls[1].return_url,core.SITE);
});
test('invalid webhook signature cannot write or grant an entitlement',async()=>{
 const h=harness(),response={status(code){this.code=code;return this;},send(text){this.text=text;}};
 await h.handlers.stripeBillingWebhook({method:'POST',rawBody:Buffer.from('{}'),headers:{'stripe-signature':'invalid'}},response);
 assert.equal(response.code,400);assert.equal(h.calls.length,0);
});
