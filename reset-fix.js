(()=>{
  'use strict';

  function setValue(id,value){
    const el=document.getElementById(id);
    if(el)el.value=value;
  }

  function setInitialPricing(){
    setValue('sell','0');
    setValue('materialPackCost','0');
    const calc=document.getElementById('calc');
    if(calc)calc.click();
  }

  function install(){
    if(window.__printProfitResetFixInstalled)return;
    window.__printProfitResetFixInstalled=true;

    // The legacy page still contains example pricing values (15 and 20).
    // Override those only for the initial live state; all other original defaults stay intact.
    setInitialPricing();

    // A quick-price button remembers the old selling price internally. The new calculator
    // starting point is £0, so when an active quick-price button is clicked again to undo it,
    // restore the selling price to £0 rather than the old example value of £15.
    window.addEventListener('click',event=>{
      const button=event.target&&event.target.closest?event.target.closest('[data-m][data-target-view]'):null;
      if(!button||!button.classList.contains('active'))return;

      // Let the calculator's existing handler finish first, then replace its old undo value.
      window.setTimeout(()=>{
        const sell=document.getElementById('sell');
        if(!sell)return;
        sell.value='0';
        sell.dispatchEvent(new Event('input',{bubbles:true}));
        sell.dispatchEvent(new Event('change',{bubbles:true}));
        const calc=document.getElementById('calc');
        if(calc)calc.click();
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
