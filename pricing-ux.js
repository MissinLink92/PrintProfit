(()=>{
  'use strict';
  if(window.__printProfitPricingUXInstalled)return;
  window.__printProfitPricingUXInstalled=true;

  const $=id=>document.getElementById(id);
  const n=id=>{const v=Number.parseFloat($(id)?.value||'0');return Number.isFinite(v)?v:0;};
  let manualSellingPrice=0;

  function setValue(id,value){const el=$(id);if(el)el.value=value;}
  function recalc(){const calc=$('calc');if(calc)calc.click();}
  function showMode(mode){const tab=document.querySelector('#resultTabs .tab[data-result-tab="'+mode+'"]');if(tab)tab.click();}

  function baseCost(){
    const value=$('printer')?.value||'';
    let watts=0,price=0,lifetime=0;
    if(value&&value!=='custom'){
      const parts=value.split(/[|,]/);
      watts=Number(parts[0])||0;
      price=Number(parts[1])||0;
      lifetime=Number(parts[2])||0;
    }
    const hours=n('printHours');
    const pack=n('materialPack');
    const packPrice=n('materialPackCost');
    const used=n('materialUsed');
    const material=pack>0&&used>0?packPrice*(used/pack):0;
    const electricity=(watts>0&&hours>0?watts/1000*hours:0)*n('electricityRate');
    const depreciation=lifetime&&hours?price/lifetime*hours:0;
    const labour=n('labourRate')*n('labourHours');
    return material+electricity+depreciation+labour+n('pack')+n('other')+n('delivery');
  }

  function markupPrice(markup,mode){
    const feeRate=(n('platform')+n('pay'))/100;
    const fixedFee=n('fixedFee');
    const deliveryCharge=n('deliveryCharge');
    const base=baseCost();
    const factor=1-feeRate;
    if(!(factor>0)||base<=0)return null;

    if(mode==='batch'){
      const qty=Math.max(1,Math.floor(n('qty')));
      const discount=Math.min(100,n('discount'))/100;
      const sellFactor=qty*(1-discount);
      if(!(sellFactor>0))return null;
      const requiredRevenue=base*qty*(1+markup)+fixedFee-deliveryCharge;
      return Math.max(0,requiredRevenue)/(factor*sellFactor);
    }

    const requiredRevenue=base*(1+markup)+fixedFee-deliveryCharge;
    return Math.max(0,requiredRevenue)/factor;
  }

  function clearQuickButtons(mode){
    document.querySelectorAll('[data-target-view="'+mode+'"][data-m]').forEach(button=>button.classList.remove('active'));
  }

  function updateText(){
    document.querySelectorAll('.quick > .small').forEach(el=>{
      if(/Quick Price Buttons/i.test(el.textContent))el.textContent='Quick Price — Markup';
    });
    const single=$('singleCustomMargin'),batch=$('batchCustomMargin');
    const singleLabel=document.querySelector('label[for="singleCustomMargin"]');
    const batchLabel=document.querySelector('label[for="batchCustomMargin"]');
    if(singleLabel)singleLabel.textContent='Custom markup (%)';
    if(batchLabel)batchLabel.textContent='Custom markup (%)';
    if(single)single.placeholder='e.g. 42.5';
    if(batch)batch.placeholder='e.g. 42.5';
    document.querySelectorAll('#singleResultView .custom-target-note').forEach(el=>el.textContent='Adds this markup to your production cost, with current fees and delivery charge included in the price.');
    document.querySelectorAll('#batchResultView .custom-target-note').forEach(el=>el.textContent='Adds this markup to the batch production cost, using the current quantity, discount, fees and delivery charge.');
    document.querySelectorAll('[data-m][data-target-view]').forEach(button=>{
      const pct=parseFloat(button.dataset.m);
      if(Number.isFinite(pct))button.title='Set a '+pct+'% markup on your production cost, including current fees.';
    });
  }

  function install(){
    updateText();
    const sell=$('sell');
    if(sell)manualSellingPrice=n('sell');

    window.addEventListener('input',event=>{
      const target=event.target;
      if(target===sell){
        manualSellingPrice=n('sell');
        clearQuickButtons('single');
        clearQuickButtons('batch');
        return;
      }
      const id=target?.id;
      if(id!=='singleCustomMargin'&&id!=='batchCustomMargin')return;

      event.preventDefault();
      event.stopImmediatePropagation();
      const mode=id==='singleCustomMargin'?'single':'batch';
      clearQuickButtons(mode);
      const raw=target.value.trim();
      if(raw===''){
        setValue('sell',manualSellingPrice.toFixed(2));
        recalc();
        showMode(mode);
        return;
      }
      const percent=Number.parseFloat(raw);
      if(!(Number.isFinite(percent)&&percent>=0&&percent<100)){
        recalc();
        showMode(mode);
        return;
      }
      const price=markupPrice(percent/100,mode);
      if(price===null){
        recalc();
        showMode(mode);
        return;
      }
      setValue('sell',price.toFixed(2));
      recalc();
      showMode(mode);
    },true);

    window.addEventListener('change',event=>{
      if(event.target!==sell)return;
      manualSellingPrice=n('sell');
      clearQuickButtons('single');
      clearQuickButtons('batch');
    },true);
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install,{once:true});
  else install();
})();
