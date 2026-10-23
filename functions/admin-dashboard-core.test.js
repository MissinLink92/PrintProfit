'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const {requireOwnerMfa,summarizeSubscriptions}=require('./admin-dashboard-core');
const now=1770000000;
const good={uid:'owner',token:{email:'OWNER@example.com',email_verified:true,auth_time:now-60,firebase:{sign_in_second_factor:'totp'}}};
test('owner gate requires verified email, recent real TOTP sign-in and configured identity',()=>{
 assert.equal(requireOwnerMfa(good,'owner@example.com',now),true);
 for(const change of [{email:'other@example.com'},{email_verified:false},{auth_time:now-12*3600},{auth_time:now+1},{firebase:{sign_in_second_factor:'phone'}}]){
  assert.equal(requireOwnerMfa({...good,token:{...good.token,...change}},'owner@example.com',now),false);
 }
 assert.equal(requireOwnerMfa(good,'',now),false);
});
test('subscription summary includes only matching live GBP Pro prices and recurring active revenue',()=>{
 const sub=(status,id,amount,interval,other={})=>({livemode:true,status,items:{data:[{quantity:2,price:{id,currency:'gbp',unit_amount:amount,recurring:{interval,interval_count:1}}}]},...other});
 const totals=summarizeSubscriptions([sub('active','month',250,'month'),sub('active','year',2400,'year',{cancel_at_period_end:true}),sub('trialing','month',250,'month'),sub('past_due','month',250,'month'),sub('active','unrelated',900,'month'),{...sub('active','month',250,'month'),livemode:false}],{monthly:'month',annual:'year'},true);
 assert.deepEqual(totals,{active:2,trialing:1,cancelling:1,pastDue:1,projectedMrrPence:900});
});
