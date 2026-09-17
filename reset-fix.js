(()=>{
  'use strict';

  const EXCLUDED_IDS=new Set(['dark','file','profileName','savedProfileSelect']);

  function setFieldValue(el,value){
    if(!el)return;
    if(el.type==='checkbox'||el.type==='radio'){
      el.checked=Boolean(value);
    }else{
      el.value=value;
    }
    el.dispatchEvent(new Event('input',{bubbles:true}));
    el.dispatchEvent(new Event('change',{bubbles:true}));
  }

  function restoreInitialState(){
    const controls=[...document.querySelectorAll('input,select,textarea')];

    controls.forEach(el=>{
      if(!el.id||EXCLUDED_IDS.has(el.id))return;
      if(el.disabled)return;

      if(el.tagName==='SELECT'){
        const defaultOption=[...el.options].find(option=>option.defaultSelected);
        el.value=defaultOption?defaultOption.value:(el.options[0]?.value||'');
      }else if(el.type==='checkbox'||el.type==='radio'){
        el.checked=el.defaultChecked;
      }else if(el.type==='file'){
        el.value='';
      }else{
        el.value=el.defaultValue||'';
      }
    });

    // These two fields intentionally start at zero rather than their old example values.
    setFieldValue(document.getElementById('sell'),'0');
    setFieldValue(document.getElementById('materialPackCost'),'0');

    // Always clear uploaded-file state.
    const file=document.getElementById('file');
    if(file)file.value='';

    // Clear any active quick-price selection without touching the actual calculator logic.
    document.querySelectorAll('.quick .btn.active').forEach(button=>button.classList.remove('active'));

    // Clear the saved-profile form controls, but deliberately keep saved profiles in localStorage.
    setFieldValue(document.getElementById('profileName'),'');
    const savedProfileSelect=document.getElementById('savedProfileSelect');
    if(savedProfileSelect)savedProfileSelect.selectedIndex=0;

    // Recalculate using the clean state so displayed totals/results also reset.
    const calc=document.getElementById('calc');
    if(calc)calc.click();
  }

  function setInitialState(){
    // Only change the two requested initial pricing fields. All other original defaults remain intact.
    const sell=document.getElementById('sell');
    const spool=document.getElementById('materialPackCost');
    if(sell)setFieldValue(sell,'0');
    if(spool)setFieldValue(spool,'0');

    const calc=document.getElementById('calc');
    if(calc)calc.click();
  }

  function install(){
    if(window.__printProfitResetFixInstalled)return;
    window.__printProfitResetFixInstalled=true;

    setInitialState();

    document.addEventListener('click',event=>{
      const reset=event.target&&event.target.closest?event.target.closest('#reset'):null;
      if(!reset)return;
      event.preventDefault();
      event.stopImmediatePropagation();
      restoreInitialState();
    },true);
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install,{once:true});
  else install();
})();
