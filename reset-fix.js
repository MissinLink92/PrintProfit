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

  function installSellSetterFix(){
    if(window.__printProfitSellSetterFixInstalled)return;
    window.__printProfitSellSetterFixInstalled=true;

    const descriptor=Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value');
    if(!descriptor||typeof descriptor.get!=='function'||typeof descriptor.set!=='function')return;

    const originalGet=descriptor.get;
    const originalSet=descriptor.set;

    Object.defineProperty(HTMLInputElement.prototype,'value',{
      configurable:descriptor.configurable,
      enumerable:descriptor.enumerable,
      get:originalGet,
      set:function(value){
        if(this.id==='sell'&&window.__printProfitQuickUndoActive){
          originalSet.call(this,'0');
          return;
        }
        originalSet.call(this,value);
      }
    });
  }

  function install(){
    if(window.__printProfitResetFixInstalled)return;
    window.__printProfitResetFixInstalled=true;

    // The legacy page still contains example pricing values (15 and 20).
    // Override those only for the initial live state; all other original defaults stay intact.
    setInitialPricing();
    installSellSetterFix();

    // The legacy quick-price logic remembers the old example selling price internally.
    // When an active quick-price button is clicked again, suppress that old value at the
    // point it is written so the selling price remains £0.00.
    window.addEventListener('click',event=>{
      const button=event.target&&event.target.closest?event.target.closest('[data-m][data-target-view]'):null;
      if(!button||!button.classList.contains('active'))return;

      window.__printProfitQuickUndoActive=true;
      window.setTimeout(()=>{
        window.__printProfitQuickUndoActive=false;
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
