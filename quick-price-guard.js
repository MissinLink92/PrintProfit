(()=>{
  'use strict';
  if(window.__printProfitQuickGuardInstalled)return;
  window.__printProfitQuickGuardInstalled=true;

  let manualSellingPrice=0;
  let quickMode=null;

  const get=id=>document.getElementById(id);
  const num=id=>{const v=Number.parseFloat(get(id)?.value||'0');return Number.isFinite(v)?v:0;};
  const set=(id,v)=>{const el=get(id);if(el)el.value=v;};
  const recalc=()=>get('calc')?.click();
  const money=v=>'£'+(Number(v)||0).toFixed(2);

  function baseCost(){
    const printer=get('printer')?.value||'';
    let watts=0,price=0,lifetime=0;
    if(printer&&printer!=='custom'){
      const p=printer.split(/[|,]/);
      watts=Number(p[0])||0; price=Number(p[1])||0; lifetime=Number(p[2])||0;
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

  function targetPrice(target,mode){
    const feeRate=(num('platform')+num('pay'))/100;
    const fixedFee=num('fixedFee');
    const deliveryCharge=num('deliveryCharge');
    const base=baseCost();
    const den=1-feeRate-target;
    if(!(den>0)||base<=0)return null;
    if(mode==='batch'){
      const qty=Math.max(1,Math.floor(num('qty')));
      const discount=Math.min(100,num('discount'))/100;
      const factor=qty*(1-discount);
      if(!(factor>0))return null;
      return Math.max(0,(base*qty+fixedFee-deliveryCharge)/den)/factor;
    }
    return (base+fixedFee)/den;
  }

  function clearQuick(mode){
    document.querySelectorAll('[data-target-view="'+mode+'"][data-m]').forEach(b=>b.classList.remove('active'));
    if(quickMode===mode)quickMode=null;
  }

  function showMode(mode){
    const b=document.querySelector('#resultTabs .tab[data-result-tab="'+mode+'"]');
    if(b)b.click();
  }

  function install(){
    const sell=get('sell');
    if(sell)manualSellingPrice=Number.parseFloat(sell.value)||0;

    // Track only genuine user edits to the selling-price field.
    window.addEventListener('input',e=>{
      if(e.target!==sell)return;
      manualSellingPrice=Number.parseFloat(sell.value)||0;
      if(quickMode)clearQuick(quickMode);
    },true);
    window.addEventListener('change',e=>{
      if(e.target!==sell)return;
      manualSellingPrice=Number.parseFloat(sell.value)||0;
      if(quickMode)clearQuick(quickMode);
    },true);

    // This listener is installed before the calculator's own listener when this file
    // is loaded before legacy-index.html. It therefore owns quick-price clicks.
    window.addEventListener('click',e=>{
      const button=e.target?.closest?.('[data-m][data-target-view]');
      if(!button)return;
      e.preventDefault();
      e.stopImmediatePropagation();

      const mode=button.dataset.targetView==='batch'?'batch':'single';
      const target=Number.parseFloat(button.dataset.m);
      if(!Number.isFinite(target))return;

      if(button.classList.contains('active')&&quickMode===mode){
        set('sell',manualSellingPrice.toFixed(2));
        clearQuick(mode);
        recalc();
        showMode(mode);
        return;
      }

      if(!quickMode)manualSellingPrice=Number.parseFloat(get('sell')?.value||'0')||0;
      else if(quickMode!==mode)clearQuick(quickMode);

      const price=targetPrice(target,mode);
      if(price===null){
        // No production cost yet: keep the manually entered selling price and still
        // mark the requested quick button as active so a second click can undo it.
        document.querySelectorAll('[data-target-view="'+mode+'"][data-m]').forEach(b=>b.classList.toggle('active',b===button));
        quickMode=mode;
        recalc();
        showMode(mode);
        return;
      }

      set('sell',price.toFixed(2));
      document.querySelectorAll('[data-target-view="'+mode+'"][data-m]').forEach(b=>b.classList.toggle('active',b===button));
      quickMode=mode;
      recalc();
      showMode(mode);
    },true);

    const ready=()=>{
      const s=get('sell');
      if(s)manualSellingPrice=Number.parseFloat(s.value)||0;
      const pack=get('materialPackCost');
      if(pack&&pack.value==='20')pack.value='0';
      if(s&&s.value==='15')s.value='0';
      recalc();
    };

    if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',ready,{once:true});
    else setTimeout(ready,0);
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install,{once:true});
  else install();
})();
