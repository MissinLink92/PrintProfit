(()=>{
  'use strict';
  if(window.__printProfitQuickGuardInstalled)return;
  window.__printProfitQuickGuardInstalled=true;

  let manualSellingPrice=0;
  let quickMode=null;

  const get=id=>document.getElementById(id);
  const num=id=>{const value=Number.parseFloat(get(id)?.value||'0');return Number.isFinite(value)?value:0;};
  const set=(id,value)=>{const el=get(id);if(el)el.value=value;};
  const recalc=()=>get('calc')?.click();

  function baseCost(){
    const printer=get('printer')?.value||'';
    let watts=0,price=0,lifetime=0;
    if(printer&&printer!=='custom'){
      const parts=printer.split(/[|,]/);
      watts=Number(parts[0])||0;
      price=Number(parts[1])||0;
      lifetime=Number(parts[2])||0;
    }
    const hours=num('printHours');
    const pack=num('materialPack');
    const packPrice=num('materialPackCost');
    const used=num('materialUsed');
    const material=pack>0&&used>0?packPrice*(used/pack):0;
    const electricity=(watts>0&&hours>0?watts/1000*hours:0)*num('electricityRate');
    const depreciation=lifetime&&hours?price/lifetime*hours:0;
    const labour=num('labourRate')*num('labourHours');
    return material+electricity+depreciation+labour+num('pack')+num('other')+num('delivery');
  }

  // Quick prices are markup targets: profit after fees should equal
  // the chosen percentage of production cost.
  function markupPrice(markup,mode){
    const feeRate=(num('platform')+num('pay'))/100;
    const fixedFee=num('fixedFee');
    const deliveryCharge=num('deliveryCharge');
    const base=baseCost();
    const factor=1-feeRate;
    if(!(factor>0)||base<=0)return null;

    if(mode==='batch'){
      const qty=Math.max(1,Math.floor(num('qty')));
      const discount=Math.min(100,num('discount'))/100;
      const sellFactor=qty*(1-discount);
      if(!(sellFactor>0))return null;
      const requiredRevenue=base*qty*(1+markup)+fixedFee-deliveryCharge;
      return Math.max(0,requiredRevenue)/(factor*sellFactor);
    }

    const requiredRevenue=base*(1+markup)+fixedFee-deliveryCharge;
    return Math.max(0,requiredRevenue)/factor;
  }

  function buttonsFor(mode){
    return [...document.querySelectorAll('[data-target-view="'+mode+'"][data-m]')];
  }

  function clearQuick(mode){
    buttonsFor(mode).forEach(button=>button.classList.remove('active'));
    if(quickMode===mode)quickMode=null;
  }

  function showMode(mode){
    const tab=document.querySelector('#resultTabs .tab[data-result-tab="'+mode+'"]');
    if(tab)tab.click();
  }

  function rememberManualPrice(){
    const sell=get('sell');
    if(!sell)return;
    const value=Number.parseFloat(sell.value);
    manualSellingPrice=Number.isFinite(value)?value:0;
  }

  function handleQuickClick(button){
    const mode=button.dataset.targetView==='batch'?'batch':'single';
    const rawTarget=Number.parseFloat(button.dataset.m);
    if(!Number.isFinite(rawTarget))return;

    if(button.classList.contains('active')&&quickMode===mode){
      set('sell',manualSellingPrice.toFixed(2));
      clearQuick(mode);
      recalc();
      showMode(mode);
      return;
    }

    if(!quickMode)rememberManualPrice();
    else if(quickMode!==mode)clearQuick(quickMode);

    const price=markupPrice(rawTarget,mode);
    if(price===null){
      // There is no production cost yet, so don't manufacture a selling price.
      buttonsFor(mode).forEach(item=>item.classList.toggle('active',item===button));
      quickMode=mode;
      recalc();
      showMode(mode);
      return;
    }

    set('sell',price.toFixed(2));
    buttonsFor(mode).forEach(item=>item.classList.toggle('active',item===button));
    quickMode=mode;
    recalc();
    showMode(mode);
  }

  function install(){
    const sell=get('sell');
    if(sell)rememberManualPrice();

    window.addEventListener('input',event=>{
      if(event.target!==sell)return;
      rememberManualPrice();
      if(quickMode)clearQuick(quickMode);
    },true);
    window.addEventListener('change',event=>{
      if(event.target!==sell)return;
      rememberManualPrice();
      if(quickMode)clearQuick(quickMode);
    },true);

    // Own the quick-price click before the legacy calculator handlers.
    window.addEventListener('click',event=>{
      const button=event.target?.closest?.('[data-m][data-target-view]');
      if(!button)return;
      event.preventDefault();
      event.stopImmediatePropagation();
      handleQuickClick(button);
    },true);

    const ready=()=>{
      const currentSell=get('sell');
      const packCost=get('materialPackCost');
      if(currentSell&&currentSell.value==='15')currentSell.value='0';
      if(packCost&&packCost.value==='20')packCost.value='0';
      rememberManualPrice();
      recalc();
    };

    if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',ready,{once:true});
    else setTimeout(ready,0);
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install,{once:true});
  else install();
})();
