(()=>{
  'use strict';

  let manualSellingPrice=0;
  let suppressManualTracking=false;
  let quickMode=null;

  function getValue(id){
    const el=document.getElementById(id);
    return el?el.value:'';
  }

  function setValue(id,value){
    const el=document.getElementById(id);
    if(el)el.value=value;
  }

  function recalculate(){
    const calc=document.getElementById('calc');
    if(calc)calc.click();
  }

  function money(value){return '£'+(Number(value)||0).toFixed(2);}

  function number(id){
    const value=Number.parseFloat(getValue(id)||'0');
    return Number.isFinite(value)?value:0;
  }

  function printer(){
    const value=getValue('printer');
    if(!value||value==='custom')return{watts:0,price:0,lifetime:0};
    const parts=value.split(/[|,]/);
    return{watts:Number(parts[0])||0,price:Number(parts[1])||0,lifetime:Number(parts[2])||0};
  }

  function currentBaseCost(){
    const p=printer();
    const hours=number('printHours');
    const pack=number('materialPack');
    const packPrice=number('materialPackCost');
    const used=number('materialUsed');
    const materialCost=pack>0&&used>0?packPrice*(used/pack):0;
    const powerUsed=p.watts>0&&hours>0?p.watts/1000*hours:0;
    const electricity=powerUsed*number('electricityRate');
    const depreciation=p.lifetime&&hours?p.price/p.lifetime*hours:0;
    const labour=number('labourRate')*number('labourHours');
    return materialCost+electricity+depreciation+labour+number('pack')+number('other')+number('delivery');
  }

  function targetPrice(target,mode){
    const feeRate=(number('platform')+number('pay'))/100;
    const base=currentBaseCost();
    const fixedFee=number('fixedFee');
    const deliveryCharge=number('deliveryCharge');
    const den=1-feeRate-target;
    if(!(den>0)||base<=0)return null;

    if(mode==='batch'){
      const qty=Math.max(1,Math.floor(number('qty')));
      const discount=Math.min(100,number('discount'))/100;
      const discountedSales=Math.max(0,(base*qty+fixedFee-deliveryCharge)/den);
      const factor=qty*(1-discount);
      return factor>0?discountedSales/factor:null;
    }

    return(base+fixedFee)/den;
  }

  function setResultMode(mode){
    const normalized=mode==='batch'?'batch':'single';
    document.querySelectorAll('#resultTabs .tab').forEach(button=>button.classList.toggle('active',button.dataset.resultTab===normalized));
    const single=document.getElementById('singleResultView');
    const batch=document.getElementById('batchResultView');
    if(single)single.hidden=normalized!=='single';
    if(batch)batch.hidden=normalized!=='batch';
  }

  function clearQuickState(mode){
    document.querySelectorAll('[data-target-view="'+mode+'"][data-m]').forEach(button=>button.classList.remove('active'));
    if(quickMode===mode)quickMode=null;
  }

  function setInitialPricing(){
    setValue('sell','0');
    setValue('materialPackCost','0');
    manualSellingPrice=0;
    quickMode=null;
    recalculate();
  }

  function numericSellingPrice(){
    const value=parseFloat(getValue('sell'));
    return Number.isFinite(value)?value:0;
  }

  function install(){
    if(window.__printProfitResetFixInstalled)return;
    window.__printProfitResetFixInstalled=true;

    setInitialPricing();

    const sell=document.getElementById('sell');
    if(sell){
      const rememberManualPrice=()=>{
        if(suppressManualTracking)return;
        manualSellingPrice=numericSellingPrice();
        if(quickMode){
          clearQuickState(quickMode);
        }
      };
      sell.addEventListener('input',rememberManualPrice);
      sell.addEventListener('change',rememberManualPrice);
    }

    window.addEventListener('click',event=>{
      const button=event.target&&event.target.closest?event.target.closest('[data-m][data-target-view]'):null;
      if(!button)return;

      event.preventDefault();
      event.stopImmediatePropagation();

      const mode=button.dataset.targetView==='batch'?'batch':'single';
      const target=Number.parseFloat(button.dataset.m);
      if(!Number.isFinite(target))return;

      if(button.classList.contains('active')&&quickMode===mode){
        suppressManualTracking=true;
        setValue('sell',manualSellingPrice.toFixed(2));
        suppressManualTracking=false;
        clearQuickState(mode);
        recalculate();
        setResultMode(mode);
        return;
      }

      if(!quickMode){
        manualSellingPrice=numericSellingPrice();
      }else if(quickMode!==mode){
        manualSellingPrice=numericSellingPrice();
        clearQuickState(quickMode);
      }

      // With no actual production cost there is no meaningful target-margin
      // price to calculate. Keep the user's manually entered selling price.
      const base=currentBaseCost();
      if(base<=0){
        setResultMode(mode);
        return;
      }

      const price=targetPrice(target,mode);
      if(price===null)return;

      suppressManualTracking=true;
      setValue('sell',price.toFixed(2));
      suppressManualTracking=false;
      quickMode=mode;
      document.querySelectorAll('[data-target-view="'+mode+'"][data-m]').forEach(b=>b.classList.toggle('active',b===button));
      recalculate();
      setResultMode(mode);
    },true);

    window.addEventListener('click',event=>{
      const reset=event.target&&event.target.closest?event.target.closest('#reset'):null;
      if(!reset)return;
      event.preventDefault();
      event.stopImmediatePropagation();
      window.location.reload();
    },true);
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install,{once:true});
  else install();
})();
