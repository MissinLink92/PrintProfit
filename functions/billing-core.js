'use strict';
const SITE='https://printprofit.co.uk/';
const PLANS=Object.freeze({monthly:{amount:250,interval:'month'},annual:{amount:2400,interval:'year'}});
function planPrice(plan,ids){
 if(!Object.hasOwn(PLANS,plan)||!/^price_[A-Za-z0-9]+$/.test(ids[plan]||''))throw Error('Unsupported or unconfigured plan');
 return ids[plan];
}
function validatePrice(price,plan,forCheckout=true){
 const expected=PLANS[plan];
 if(!expected||(forCheckout&&!price.active)||price.currency!=='gbp'||price.unit_amount!==expected.amount||price.type!=='recurring'||price.recurring?.interval!==expected.interval||price.recurring?.interval_count!==1||price.recurring?.usage_type!=='licensed'||price.tax_behavior!=='inclusive')throw Error('Configured Stripe price does not match the published GBP plan');
 return price;
}
function accessFromSubscriptions(subscriptions,ids,now=Math.floor(Date.now()/1000)){
 const validIds=new Set(Object.values(ids).filter(x=>/^price_[A-Za-z0-9]+$/.test(x||'')));
 const matches=subscriptions.filter(s=>s.status==='active'&&!s.pause_collection&&s.items?.data?.length===1).map(s=>{
  const item=s.items.data[0],price=item.price;
  if(!validIds.has(price.id)||item.quantity!==1)return null;
  const plan=Object.keys(PLANS).find(k=>ids[k]===price.id);
  try{validatePrice(price,plan,false)}catch{return null}
  const until=Number(item.current_period_end||s.current_period_end);
  return Number.isFinite(until)&&until>now?{tier:'pro',plan,until,cancelAtPeriodEnd:Boolean(s.cancel_at_period_end)}:null;
 }).filter(Boolean).sort((a,b)=>b.until-a.until);
 return matches[0]||{tier:'basic',plan:null,until:null,cancelAtPeriodEnd:false};
}
function checkoutParameters(customer,uid,price){
 return {mode:'subscription',customer,client_reference_id:uid,line_items:[{price,quantity:1}],
  success_url:SITE+'?billing=returned',cancel_url:SITE+'?billing=cancelled',
  subscription_data:{metadata:{printprofitUid:uid}},metadata:{printprofitUid:uid},
  allow_promotion_codes:false,expires_at:Math.floor(Date.now()/1000)+1800};
}
module.exports={SITE,PLANS,planPrice,validatePrice,accessFromSubscriptions,checkoutParameters};
