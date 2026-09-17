(()=>{
  'use strict';

  let manualSellingPrice=0;
  let suppressManualTracking=false;

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

  function setInitialPricing(){
    setValue('sell','0');
    setValue('materialPackCost','0');
    manualSellingPrice=0;
    recalculate();
  }

  function numericSellingPrice(){
    const value=parseFloat(getValue('sell'));
    return Number.isFinite(value)?value:0;
  }

  function install(){
    if(window.__printProfitResetFixInstalled)return;
    window.__printProfitResetFixInstalled=true;

    // The legacy page contains example pricing values (15 and 20). Replace those
    // for the live starting state and keep our own record of the user's real price.
    setInitialPricing();

    const sell=document.getElementById('sell');
    if(sell){
      const rememberManualPrice=()=>{
        if(suppressManualTracking)return;
        manualSellingPrice=numericSellingPrice();
      };
      sell.addEventListener('input',rememberManualPrice);
      sell.addEventListener('change',rememberManualPrice);
    }

    // Quick-price behavior:
    // - First click: allow the existing calculator to set the target-margin price.
    // - Second click on the same active button: restore the price the user entered
    //   immediately before using quick pricing. This starts at £0, but becomes e.g. £15
    //   when the user manually enters £15.
    window.addEventListener('click',event=>{
      const button=event.target&&event.target.closest?event.target.closest('[data-m][data-target-view]'):null;
      if(!button)return;
      if(!button.classList.contains('active'))return;

      window.setTimeout(()=>{
        if(button.classList.contains('active'))return;

        suppressManualTracking=true;
        setValue('sell',manualSellingPrice.toFixed(2));
        suppressManualTracking=false;

        const currentSell=document.getElementById('sell');
        if(currentSell){
          currentSell.dispatchEvent(new Event('input',{bubbles:true}));
          currentSell.dispatchEvent(new Event('change',{bubbles:true}));
        }
        recalculate();
      },0);
    },true);

    // Capture Reset before the legacy/app-enhancements reset handlers.
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
