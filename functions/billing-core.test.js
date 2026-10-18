'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),c=require('./billing-core');
const ids={monthly:'price_month',annual:'price_year'};
const price={id:'price_month',active:true,currency:'gbp',unit_amount:250,type:'recurring',tax_behavior:'inclusive',recurring:{interval:'month',interval_count:1,usage_type:'licensed'}};
const subscription={status:'active',cancel_at_period_end:false,items:{data:[{price,quantity:1,current_period_end:2000}]}};
test('only the configured GBP recurring price is accepted',()=>{assert.equal(c.planPrice('monthly',ids),'price_month');for(const plan of ['lifetime','__proto__'])assert.throws(()=>c.planPrice(plan,ids));for(const change of [{currency:'usd'},{unit_amount:25},{tax_behavior:'exclusive'},{recurring:{interval:'year'}}])assert.throws(()=>c.validatePrice({...price,...change},'monthly'));});
test('active paid period retains access during scheduled cancellation',()=>{assert.equal(c.accessFromSubscriptions([{...subscription,cancel_at_period_end:true}],ids,1000).tier,'pro');});
test('expired, unpaid, trial, paused and unconfigured prices never grant Pro',()=>{for(const status of ['canceled','past_due','incomplete','unpaid','trialing','paused'])assert.equal(c.accessFromSubscriptions([{...subscription,status}],ids,1000).tier,'basic');assert.equal(c.accessFromSubscriptions([subscription],ids,2000).tier,'basic');assert.equal(c.accessFromSubscriptions([{...subscription,pause_collection:{behavior:'void'}}],ids,1000).tier,'basic');assert.equal(c.accessFromSubscriptions([subscription],{monthly:'price_other'},1000).tier,'basic');});
test('checkout fixes customer identity, quantity and return destinations on the server',()=>{const value=c.checkoutParameters('cus_owner','uid-owner','price_month');assert.equal(value.customer,'cus_owner');assert.equal(value.line_items[0].quantity,1);assert.equal(value.success_url,'https://printprofit.co.uk/?billing=returned');assert.equal(value.subscription_data.metadata.printprofitUid,'uid-owner');assert.equal(value.allow_promotion_codes,false);});

test('archiving a price stops new checkouts but preserves an existing paid subscription',()=>{const archived={...price,active:false};assert.throws(()=>c.validatePrice(archived,'monthly'));const current={...subscription,items:{data:[{price:archived,quantity:1,current_period_end:2000}]}};assert.equal(c.accessFromSubscriptions([current],ids,1000).tier,'pro');});

const env=require('./billing-environment');
test('unknown projects fail closed and test checkout stays on its test host',()=>{
 assert.throws(()=>env.environmentForProject('another-project'));
 const settings=env.environmentForProject('printprofit-test'),value=c.checkoutParameters('cus_owner','owner','price_month',settings.site);
 assert.equal(value.success_url,'https://printprofit-test.web.app/?billing=returned');assert.equal(value.cancel_url,'https://printprofit-test.web.app/?billing=cancelled');assert.match(value.integration_identifier,/^printprofit_pro_[a-z]{8}$/);
});
test('mixed Stripe modes cannot grant access even when a price ID matches',()=>{
 const current={...subscription,livemode:false,items:{data:[{...subscription.items.data[0],price:{...price,livemode:false}}]}};
 assert.equal(c.accessFromSubscriptions([current],ids,1000,false).tier,'pro');
 assert.equal(c.accessFromSubscriptions([{...current,livemode:true}],ids,1000,false).tier,'basic');
 const livePrice={...current,items:{data:[{...current.items.data[0],price:{...price,livemode:true}}]}};
 assert.equal(c.accessFromSubscriptions([livePrice],ids,1000,false).tier,'basic');
});
