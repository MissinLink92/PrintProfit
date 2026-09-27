(()=>{
'use strict';

const ADVISOR_CHANGE_KEY='printprofit.advisor-last-change.v1';
const HANDOFF_KEY='printprofit.calculator-navigation-handoff.v1';
const DRAFT_KEY='printprofit.calculator-draft.v3';

const esc=value=>String(value??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const moneyValue=value=>{
  try{
    if(typeof money==='function')return money(value);
    if(typeof window.money==='function')return window.money(value);
  }catch(e){}
  return '£'+(Number(value)||0).toFixed(2);
};
const formatTime=hours=>{
  const h=Math.max(0,Number(hours)||0);
  const whole=Math.floor(h);
  const mins=Math.round((h-whole)*60);
  if(mins===60)return (whole+1)+'h 00m';
  return whole+'h '+String(mins).padStart(2,'0')+'m';
};
const readChange=()=>{
  try{return JSON.parse(sessionStorage.getItem(ADVISOR_CHANGE_KEY)||'null');}catch(e){return null;}
};
const writeChange=data=>{
  try{sessionStorage.setItem(ADVISOR_CHANGE_KEY,JSON.stringify(data));}catch(e){}
};
const clearChange=()=>{
  try{sessionStorage.removeItem(ADVISOR_CHANGE_KEY);}catch(e){}
};

function currentFieldValues(s){
  return {
    materialUsage:s.used,
    printTime:s.hours,
    materialCost:s.packPrice,
    deliveryCost:s.delivery,
    labourMinutes:s.labourHours*60,
    sellingPrice:s.sell
  };
}

function changeDescriptor(key,before,after){
  const map={
    materialUsage:['Material usage',v=>Number(v).toFixed(1)+' g'],
    printTime:['Print time',formatTime],
    materialCost:['Material pack cost',moneyValue],
    deliveryCost:['Delivery cost',moneyValue],
    labourMinutes:['Labour time',v=>Math.round(Number(v))+' min'],
    sellingPrice:['Selling price',moneyValue]
  };
  const item=map[key]||[key,v=>String(v)];
  return {key,label:item[0],beforeRaw:Number(before)||0,afterRaw:Number(after)||0,before:item[1](before),after:item[1](after)};
}

function afterValueForKey(s,key){
  if(key==='materialUsage')return s.used*.85;
  if(key==='printTime')return s.hours*.90;
  if(key==='materialCost')return s.packPrice*.85;
  if(key==='deliveryCost')return Math.max(0,s.delivery-.95);
  if(key==='labourMinutes')return Math.max(0,s.labourHours*60-5);
  if(key==='sellingPrice')return Math.max(s.sell*1.15,s.sell+2.5);
  return 0;
}

function storeAdvisorHandoff(keys,s){
  const projection=projectionFor(keys);
  const beforeValues=currentFieldValues(s);
  const changes=keys.map(key=>changeDescriptor(key,beforeValues[key],afterValueForKey(s,key)));
  const beforeProfit=s.profit;
  const beforeCost=s.base;

  const data={
    version:1,
    appliedAt:new Date().toISOString(),
    source:'profit-advisor',
    mode:keys.length===1?'single':'combined',
    keys,
    changes,
    before:{
      totalCost:beforeCost,
      sellingPrice:s.sell,
      profit:beforeProfit,
      margin:s.margin
    },
    after:{
      totalCost:projection.base,
      sellingPrice:projection.sell,
      profit:projection.profit,
      margin:projection.margin
    },
    profitDelta:projection.profit-beforeProfit,
    costDelta:projection.base-beforeCost
  };
  writeChange(data);
  return data;
}

function saveAndGoToResults(){
  try{
    if(typeof draft==='object'&&draft){
      draft.stage='results';
      sessionStorage.setItem(DRAFT_KEY,JSON.stringify(draft));
    }
    sessionStorage.setItem(HANDOFF_KEY,'1');
  }catch(e){}
  window.location.href='./index.html';
}

function applySingle(key){
  if(!state)return;
  storeAdvisorHandoff([key],state);
  applyDraftKey(key);
  if(typeof saveDraft==='function')saveDraft();
  saveAndGoToResults();
}

function applyCombined(keys){
  if(!state||!keys.length)return;
  storeAdvisorHandoff(keys,state);
  keys.forEach(applyDraftKey);
  if(typeof saveDraft==='function')saveDraft();
  saveAndGoToResults();
}

function selectedKeys(){
  return [...document.querySelectorAll('[data-select]:checked')].map(el=>el.dataset.select);
}

function installAdvisorInterceptors(){
  document.addEventListener('click',event=>{
    const single=event.target?.closest?.('[data-apply]');
    if(single){
      event.preventDefault();
      event.stopImmediatePropagation();
      applySingle(single.dataset.apply);
      return;
    }

    const all=event.target?.closest?.('#applyAll');
    if(all){
      event.preventDefault();
      event.stopImmediatePropagation();
      const keys=selectedKeys();
      if(!keys.length)return;
      applyCombined(keys);
    }
  },true);
}

function advisorBack(){
  try{
    if(typeof window.__printProfitPersistDraft==='function')window.__printProfitPersistDraft();
    sessionStorage.setItem(HANDOFF_KEY,'1');
  }catch(e){}
  window.top.location.href='./profit-advisor.html';
}

function resultTarget(){
  try{return document.querySelector('.result');}catch(e){return null;}
}

function renderResultsBridge(){
  const result=resultTarget();
  if(!result)return false;

  let host=document.getElementById('ppAdvisorResultsBridge');
  if(!host){
    host=document.createElement('section');
    host.id='ppAdvisorResultsBridge';
    result.insertBefore(host,result.firstChild||null);

    const style=document.createElement('style');
    style.id='ppAdvisorResultsBridgeStyles';
    style.textContent=`
#ppAdvisorResultsBridge{margin:0 0 10px;border:1px solid #ff7800;border-radius:11px;background:linear-gradient(145deg,#101f29,#0a171f);padding:10px;box-shadow:0 8px 22px #0005}
#ppAdvisorResultsBridge .pp-arb-top{display:flex;align-items:center;justify-content:space-between;gap:10px}
#ppAdvisorResultsBridge .pp-arb-title{display:flex;align-items:center;gap:8px;min-width:0}
#ppAdvisorResultsBridge .pp-arb-icon{width:30px;height:30px;border-radius:8px;background:#ff7800;color:#fff;display:grid;place-items:center;font-size:15px;flex:0 0 30px}
#ppAdvisorResultsBridge h3{margin:0;color:#f5f8fb;font:900 13px/1.1 Inter,Segoe UI,system-ui,sans-serif}
#ppAdvisorResultsBridge p{margin:3px 0 0;color:#9db0bb;font:500 9px/1.35 Inter,Segoe UI,system-ui,sans-serif}
#ppAdvisorResultsBridge .pp-arb-back{border:1px solid #ff7800;border-radius:8px;background:#ff7800;color:#fff;padding:8px 10px;font:800 9px/1 Inter,Segoe UI,system-ui,sans-serif;cursor:pointer;white-space:nowrap}
#ppAdvisorResultsBridge .pp-arb-back:hover{filter:brightness(1.07)}
#ppAdvisorResultsBridge .pp-arb-empty{display:flex;align-items:center;justify-content:space-between;gap:10px}
#ppAdvisorResultsBridge .pp-arb-meta{margin-top:8px;display:grid;grid-template-columns:repeat(3,1fr);gap:6px}
#ppAdvisorResultsBridge .pp-arb-stat{border:1px solid #294957;border-radius:8px;background:#08151d;padding:7px}
#ppAdvisorResultsBridge .pp-arb-stat span{display:block;color:#8099a6;font-size:7px;text-transform:uppercase;letter-spacing:.06em}
#ppAdvisorResultsBridge .pp-arb-stat strong{display:block;margin-top:3px;font-size:13px}
#ppAdvisorResultsBridge .pp-arb-stat.good strong{color:#36e58b}
#ppAdvisorResultsBridge .pp-arb-stat.bad strong{color:#ff6b6b}
#ppAdvisorResultsBridge .pp-arb-changes{margin-top:8px;border-top:1px solid #294957;padding-top:7px}
#ppAdvisorResultsBridge .pp-arb-change{display:grid;grid-template-columns:minmax(0,1fr) auto 18px auto;gap:7px;padding:5px 0;border-bottom:1px solid #29495744;align-items:center;font-size:9px}
#ppAdvisorResultsBridge .pp-arb-change:last-child{border-bottom:0}
#ppAdvisorResultsBridge .pp-arb-change span:first-child{color:#9db0bb}
#ppAdvisorResultsBridge .pp-arb-change .before{color:#aab9c0}
#ppAdvisorResultsBridge .pp-arb-change .after{color:#64efaa;font-weight:800}
#ppAdvisorResultsBridge .pp-arb-arrow{color:#55bfff}
@media(max-width:650px){
  #ppAdvisorResultsBridge .pp-arb-top,#ppAdvisorResultsBridge .pp-arb-empty{align-items:stretch;flex-direction:column}
  #ppAdvisorResultsBridge .pp-arb-back{width:100%}
  #ppAdvisorResultsBridge .pp-arb-meta{grid-template-columns:1fr 1fr}
}
`;
    document.head.appendChild(style);

    host.addEventListener('click',event=>{
      const back=event.target?.closest?.('#ppAdvisorBackButton');
      if(back){event.preventDefault();advisorBack();}
    });
  }

  const change=readChange();
  const renderSignature=JSON.stringify(change);
  if(host.dataset.renderSignature===renderSignature)return true;
  host.dataset.renderSignature=renderSignature;
  if(!change){
    host.innerHTML=`
      <div class="pp-arb-empty">
        <div class="pp-arb-title"><div class="pp-arb-icon">💡</div><div><h3>Profit Advisor</h3><p>Test ways to reduce costs or improve your selling price without leaving the Results page.</p></div></div>
        <button type="button" class="pp-arb-back" id="ppAdvisorBackButton">Open Profit Advisor →</button>
      </div>`;
    return true;
  }

  const delta=Number(change.profitDelta)||0;
  const deltaClass=delta>0?'good':delta<0?'bad':'';
  const rows=(change.changes||[]).map(item=>`
    <div class="pp-arb-change">
      <span>${esc(item.label)}</span>
      <span class="before">${esc(item.before)}</span>
      <span class="pp-arb-arrow">→</span>
      <span class="after">${esc(item.after)}</span>
    </div>`).join('');

  host.innerHTML=`
    <div class="pp-arb-top">
      <div class="pp-arb-title"><div class="pp-arb-icon">💡</div><div><h3>Profit Advisor change applied</h3><p>${change.mode==='single'?'1 suggestion':' '+(change.keys?.length||0)+' suggestions'} applied to this calculation.</p></div></div>
      <button type="button" class="pp-arb-back" id="ppAdvisorBackButton">← Back to Profit Advisor</button>
    </div>
    <div class="pp-arb-meta">
      <div class="pp-arb-stat"><span>Profit before</span><strong>${esc(moneyValue(change.before?.profit))}</strong></div>
      <div class="pp-arb-stat ${deltaClass}"><span>Profit after</span><strong>${esc(moneyValue(change.after?.profit))}</strong></div>
      <div class="pp-arb-stat"><span>Change</span><strong>${esc((delta>=0?'+':'-')+moneyValue(Math.abs(delta)))}</strong></div>
    </div>
    <div class="pp-arb-changes">
      ${rows}
    </div>`;
  return true;
}

function clearOnNormalCalculate(){
  document.addEventListener('click',event=>{
    const button=event.target?.closest?.('#calc');
    if(button?.isConnected && event.isTrusted)clearChange();
  },true);
  document.addEventListener('click',event=>{
    const reset=event.target?.closest?.('#reset');
    if(reset?.isConnected)clearChange();
  },true);
}

function boot(){
  installAdvisorInterceptors();
  clearOnNormalCalculate();

  const start=Date.now();
  const timer=setInterval(()=>{
    if(renderResultsBridge()||Date.now()-start>15000)clearInterval(timer);
  },120);

  const observer=new MutationObserver(()=>renderResultsBridge());
  observer.observe(document.body,{childList:true,subtree:true});
  setTimeout(()=>renderResultsBridge(),250);
  setTimeout(()=>renderResultsBridge(),900);
}

if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});
else boot();

})();