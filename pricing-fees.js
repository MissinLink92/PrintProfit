/* Percentage fees can use different delivery bases for marketplace and payments. */
(()=>{'use strict';
const shippingFee=(delivery,platform,pay,platformDelivery=true,payDelivery=true)=>Number(delivery)*((platformDelivery?Number(platform):0)+(payDelivery?Number(pay):0))/100;
const forChannel=(delivery,platform,pay,channel)=>shippingFee(delivery,platform,pay,channel!=='folksy',true);
function fromControls(document,read){
 const channel=document.getElementById('platformSelect')?.value;
 return shippingFee(read('deliveryCharge'),read('platform'),read('pay'),
  document.getElementById('platformDeliveryFee')?.checked??channel!=='folksy',
  document.getElementById('paymentDeliveryFee')?.checked??true);
}
function restoreControls(document,data){
 for(const id of ['platformDeliveryFee','paymentDeliveryFee']){
  const field=document.getElementById(id);
  if(field&&typeof data?.[id]?.checked==='boolean')field.checked=data[id].checked;
 }
}
const api={shippingFee,forChannel,fromControls,restoreControls};
if(typeof module==='object'&&module.exports){module.exports=api;return;}
window.PrintProfitPricing=api;
function mount(){
 const fixed=document.getElementById('fixedFee'),channel=document.getElementById('platformSelect');
 if(!fixed||!channel||document.getElementById('platformDeliveryFee'))return;
 const box=document.createElement('div');box.className='pp-fee-basis';
 box.innerHTML='<label><input id="platformDeliveryFee" type="checkbox" checked> Platform percentage fee applies to delivery charged</label><label><input id="paymentDeliveryFee" type="checkbox" checked> Payment percentage fee applies to delivery charged</label><small>Check your selling channel’s fee basis. Fixed fees are charged once per order.</small>';
 fixed.parentElement.insertAdjacentElement('afterend',box);
 const style=document.createElement('style');style.textContent='.pp-fee-basis{grid-column:1/-1;margin-top:8px}.pp-fee-basis label{display:flex;align-items:center;gap:9px;font-size:12px}.pp-fee-basis input{width:18px!important;min-height:18px!important;height:18px!important;flex:0 0 18px}.pp-fee-basis small{display:block;line-height:1.5;color:inherit;opacity:.85}';document.head.append(style);
 const recalculate=()=>document.getElementById('calc')?.click();
 box.addEventListener('change',recalculate);
 channel.addEventListener('change',()=>{document.getElementById('platformDeliveryFee').checked=channel.value!=='folksy';document.getElementById('paymentDeliveryFee').checked=true;recalculate();});
 document.getElementById('platformDeliveryFee').checked=channel.value!=='folksy';
 recalculate();
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mount,{once:true});else mount();
})();
