(()=>{
  'use strict';

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
    recalculate();
  }

  function install(){
    if(window.__printProfitResetFixInstalled)return;
    window.__printProfitResetFixInstalled=true;

    // The legacy page still contains example pricing values (15 and 20).
    // Override those only for the initial live state; all other original defaults stay intact.
    setInitialPricing();

    // Quick-price behavior:
    // - First click: keep the normal calculator behavior, including the user's current selling price.
    // - Second click on the SAME active percentage: undo it and return selling price to £0.00.
    window.addEventListener('click',event=>{
      const button=event.target&&event.target.closest?event.target.closest('[data-m][data-target-view]'):null;
      if(!button)return;

      const wasActive=button.classList.contains('active');
      if(!wasActive)return;

      // Do not interfere with the legacy click handler. Wait until it has toggled the
      // button off and restored its old manual price, then replace that old £15 example
      // value with the new £0.00 default.
      window.setTimeout(()=>{
        if(button.classList.contains('active'))return;
        setValue('sell','0');
        const sell=document.getElementById('sell');
        if(sell){
          sell.dispatchEvent(new Event('input',{bubbles:true}));
          sell.dispatchEvent(new Event('change',{bubbles:true}));
        }
        recalculate();
      },0);
    },true);

    // Capture the Reset click before app-enhancements.js can intercept it.
    window.addEventListener('click',event=>{
      const reset=event.target&&event.target.closest?event.target.closest('#reset'):null;
      if(!reset)return;
      event.preventDefault();
      event.stopImmediatePropagation();

      // A real page reload restores every control and internal calculator state,
      // including courier, selected delivery rate, uploaded file metadata and quick pricing.
      // Saved Setup Profiles remain in localStorage because Reset must not delete them.
      window.location.reload();
    },true);
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install,{once:true});
  else install();
})();
