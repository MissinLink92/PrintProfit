(()=>{
'use strict';

const UI_KEY='ppButtonsAdvisorV1';
const $=id=>document.getElementById(id);
const num=id=>Number.parseFloat($(id)?.value||'0')||0;
const money=v=>{
  const n=Number(v)||0;
  try{
    const p=JSON.parse(localStorage.getItem('printprofit.preferences.v3')||'{}');
    const code=p.currency||'GBP';
    const rates={GBP:1,EUR:1.1663,USD:1.337,PLN:5.0892,CAD:1.84,AUD:2,CHF:.96,SEK:14.75,NOK:14.70,DKK:8.69,CZK:28.30,JPY:179,CNY:9.65,INR:123.50,NZD:2.16,SGD:1.71,BRL:7.18,MXN:23.0696,ZAR:21.80};
    const locales={EUR:'de-DE',USD:'en-US',PLN:'pl-PL',CAD:'en-CA',AUD:'en-AU',CHF:'de-CH',SEK:'sv-SE',NOK:'nb-NO',DKK:'da-DK',CZK:'cs-CZ',JPY:'ja-JP',CNY:'zh-CN',INR:'en-IN',NZD:'en-NZ',SGD:'en-SG',BRL:'pt-BR',MXN:'es-MX',ZAR:'en-ZA'};
    const rate=Number(p.rate)>0?Number(p.rate):(rates[code]||1);
    if(code!=='GBP')return new Intl.NumberFormat(locales[code]||'en-GB',{style:'currency',currency:code,minimumFractionDigits:2,maximumFractionDigits:2}).format(n*rate);
  }catch(e){}
  return '£'+n.toFixed(2);
};
const formatHours=h=>{
  const x=Math.max(0,Number(h)||0);
  let whole=Math.floor(x),m=Math.round((x-whole)*60);
  if(m===60){whole++;m=0}
  return whole+'h '+String(m).padStart(2,'0')+'m';
};
const formatMinutes=m=>Math.round(Number(m)||0)+' min';
const parsePrinter=v=>{const p=String(v||'').split(/[|,]/);return{watts:Number(p[0])||0,price:Number(p[1])||0,lifetime:Number(p[2])||0}};

function snapshot(){
  const p=parsePrinter($('printer')?.value||'');
  const qty=Math.max(1,Math.floor(num('qty')));
  const disc=Math.min(100,num('discount'))/100;
  const h=$('ppPrintTimeHours'),m=$('ppPrintTimeMinutes');
  const hours=(h&&m)?Math.max(0,Math.floor(Number(h.value)||0)+Math.max(0,Math.min(59,Math.floor(Number(m.value)||0)))/60):Math.max(0,num('printHours'));
  const pack=num('materialPack'),packPrice=num('materialPackCost'),used=num('materialUsed');
  const materialCost=pack>0&&used>0?packPrice*(used/pack):0;
  const elec=p.watts>0&&hours>0?p.watts/1000*hours*num('electricityRate'):0;
  const depreciation=p.lifetime&&hours?p.price/p.lifetime*hours:0;
  const labourHours=num('labourHours'),labour=num('labourRate')*labourHours;
  const packagingOther=num('pack')+num('other');
  const delivery=num('delivery'),deliveryCharge=num('deliveryCharge');
  const base=materialCost+elec+depreciation+labour+packagingOther+delivery;
  const sell=num('sell'),feeRate=(num('platform')+num('pay'))/100,fixedFee=num('fixedFee');
  const fees=sell*feeRate+fixedFee;
  const profit=sell+deliveryCharge-base-fees;
  const margin=sell?profit/sell:0;
  const batchSales=sell*qty*(1-disc);
  const batchProductionBase=Math.max(0,base-delivery);
  const batchCost=batchProductionBase*qty+delivery;
  const batchFees=batchSales*feeRate+fixedFee;
  const batchProfit=batchSales+deliveryCharge-batchCost-batchFees;
  const batchMargin=batchSales?batchProfit/batchSales:0;
  return {p,qty,disc,hours,pack,packPrice,used,materialCost,elec,depreciation,labourHours,labour,packagingOther,delivery,deliveryCharge,base,sell,feeRate,fixedFee,fees,profit,margin,batchCost,batchProfit,batchMargin};
}

function project(s,keys){
  const k=new Set(keys);
  const used=k.has('materialUsage')?s.used*.85:s.used;
  const hours=k.has('printTime')?s.hours*.90:s.hours;
  const packPrice=k.has('materialCost')?s.packPrice*.85:s.packPrice;
  const labourHours=k.has('labourMinutes')?Math.max(0,s.labourHours-5/60):s.labourHours;
  const delivery=k.has('deliveryCost')?Math.max(0,s.delivery-.95):s.delivery;
  const sell=k.has('sellingPrice')?Math.max(s.sell*1.15,s.sell+2.5):s.sell;
  const materialCost=s.pack>0&&used>0?packPrice*(used/s.pack):0;
  const elec=s.p.watts>0&&hours>0?s.p.watts/1000*hours*num('electricityRate'):0;
  const depreciation=s.p.lifetime&&hours?s.p.price/s.p.lifetime*hours:0;
  const labour=num('labourRate')*labourHours;
  const base=materialCost+elec+depreciation+labour+s.packagingOther+delivery;
  const fees=sell*s.feeRate+s.fixedFee;
  const profit=sell+s.deliveryCharge-base-fees;
  const margin=sell?profit/sell:0;
  const batchSales=sell*s.qty*(1-s.disc);
  const batchCost=Math.max(0,base-delivery)*s.qty+delivery;
  const batchFees=batchSales*s.feeRate+s.fixedFee;
  const batchProfit=batchSales+s.deliveryCharge-batchCost-batchFees;
  const batchMargin=batchSales?batchProfit/batchSales:0;
  const batchView=$('batchResultView')&&!$('batchResultView').hidden;
  return {used,hours,packPrice,labourHours,delivery,sell,materialCost,elec,depreciation,labour,base,fees,profit,margin,batchProfit,batchMargin,shownProfit:batchView?batchProfit:profit,shownMargin:batchView?batchMargin:margin};
}

const suggestions=[
  {key:'materialUsage',icon:'⬡',title:'Reduce material usage',desc:'Use less material where the model allows without compromising the strength or quality you need.',can:s=>s.used>0,value:s=>s.used*.85,text:s=>s.used>0?s.used.toFixed(0)+' g':'—',after:s=>project(s,['materialUsage']).used,afterText:s=>s.used>0?project(s,['materialUsage']).used.toFixed(0)+' g':'—',impact:'High impact'},
  {key:'printTime',icon:'◷',title:'Reduce print time',desc:'A shorter print can lower electricity and printer depreciation on longer jobs.',can:s=>s.hours>0,value:s=>s.hours*.9,text:s=>formatHours(s.hours),after:s=>project(s,['printTime']).hours,afterText:s=>formatHours(project(s,['printTime']).hours),impact:'Medium impact'},
  {key:'materialCost',icon:'◈',title:'Use cheaper material',desc:'Test a 15% lower suitable material cost while keeping the same print settings.',can:s=>s.materialCost>0,value:s=>s.packPrice*.85,text:s=>money(s.materialCost),after:s=>project(s,['materialCost']).materialCost,afterText:s=>money(project(s,['materialCost']).materialCost),impact:'Lower impact'},
  {key:'deliveryCost',icon:'▱',title:'Lower delivery cost',desc:'Compare courier rates or reduce the delivery cost you absorb on the order.',can:s=>s.delivery>0,value:s=>Math.max(0,s.delivery-.95),text:s=>money(s.delivery),after:s=>project(s,['deliveryCost']).delivery,afterText:s=>money(project(s,['deliveryCost']).delivery),impact:'Medium impact'},
  {key:'labourMinutes',icon:'◷',title:'Reduce labour time',desc:'Streamline setup, cleanup and other hands-on work where practical.',can:s=>s.labourHours>0,value:s=>Math.max(0,s.labourHours*60-5),text:s=>formatMinutes(s.labourHours*60),after:s=>project(s,['labourMinutes']).labourHours*60,afterText:s=>formatMinutes(project(s,['labourMinutes']).labourHours*60),impact:'Medium impact'},
  {key:'sellingPrice',icon:'◇',title:'Adjust selling price',desc:'Test a higher selling price to see how much it changes the profit after fees.',can:s=>s.sell>0,value:s=>Math.max(s.sell*1.15,s.sell+2.5),text:s=>money(s.sell),after:s=>project(s,['sellingPrice']).sell,afterText:s=>money(project(s,['sellingPrice']).sell),impact:'High impact'}
];

let selected=new Set();
let lastSignature='';

function css(){
  if($('ppButtonsAdvisorStyles'))return;
  const st=document.createElement('style');st.id='ppButtonsAdvisorStyles';st.textContent=`
    .result#about{width:100%!important;display:grid!important;grid-template-columns:minmax(0,1fr) minmax(400px,.98fr)!important;gap:12px!important;align-items:start!important}
    .result#about>.head,.result#about>.tabs{grid-column:1 / -1!important}
    .result#about>.resultView{grid-column:1!important;grid-row:3!important;min-width:0!important}
    .result#about>#ppProfitAdvisor{grid-column:2!important;grid-row:3!important;margin:0!important;min-width:0!important}
    .pp-button-advisor{border:1px solid #315261;border-radius:14px;padding:12px;background:linear-gradient(180deg,#091a24,#07131b);box-shadow:0 12px 28px #0005}
    .pp-ba-head{display:flex;justify-content:space-between;gap:10px;align-items:flex-start;margin-bottom:9px}
    .pp-ba-title{display:flex;gap:8px;align-items:flex-start}.pp-ba-icon{width:34px;height:34px;border-radius:9px;background:#ff7800;color:#fff;display:grid;place-items:center;font-size:17px;flex:0 0 34px}.pp-ba-head h3{margin:0;font-size:16px}.pp-ba-head p{margin:4px 0 0;color:#9db0ba;font-size:9px;line-height:1.4}.pp-ba-status{padding:6px 8px;border:1px solid #315261;border-radius:99px;color:#a9bbc4;font-size:7px;font-weight:900;white-space:nowrap}
    .pp-ba-live{border:1px solid #294957;border-radius:10px;background:linear-gradient(180deg,#0b1d28,#081620);padding:10px;margin-bottom:9px}
    .pp-ba-live-head{display:flex;justify-content:space-between;gap:8px;align-items:center}.pp-ba-live-head span{font-size:8px;color:#829aa7;text-transform:uppercase;letter-spacing:.08em}.pp-ba-live-head strong{font-size:24px}.pp-ba-live-head strong.good{color:#36e58b}.pp-ba-live-head strong.bad{color:#ff6b6b}.pp-ba-live-head strong.neutral{color:#f5f8fb}
    .pp-ba-live-sub{margin:4px 0 0;color:#91a6b1;font-size:8px}.pp-ba-change{margin-top:6px;font-size:9px;font-weight:900}.pp-ba-change.good{color:#36e58b}.pp-ba-change.bad{color:#ff6b6b}
    .pp-ba-beforeafter{margin-top:8px;border-top:1px solid #294957;padding-top:7px}.pp-ba-ba-row{display:grid;grid-template-columns:minmax(0,1fr) auto 16px auto;gap:5px;padding:5px 0;border-bottom:1px solid #29495744;align-items:center;font-size:8px}.pp-ba-ba-row:last-child{border-bottom:0}.pp-ba-ba-row span{color:#91a6b1}.pp-ba-ba-row b{font-size:8.5px}.pp-ba-ba-row i{font-style:normal;color:#55bfff}.pp-ba-ba-row .after{color:#64efaa}
    .pp-ba-section-title{font:900 8px/1 Inter,Segoe UI,system-ui,sans-serif;letter-spacing:.14em;color:#718c99;margin:8px 0 5px}
    .pp-ba-card{border:1px solid #294957;border-radius:10px;padding:9px;margin-top:7px;background:rgba(255,255,255,.018)}.pp-ba-card.applied{border-color:#36e58b55;background:#36e58b08}.pp-ba-card.disabled{opacity:.55}
    .pp-ba-card-head{display:flex;gap:8px;align-items:flex-start}.pp-ba-card-icon{width:28px;height:28px;border:1px solid #3a5562;border-radius:7px;display:grid;place-items:center;flex:0 0 28px}.pp-ba-card-main{min-width:0;flex:1}.pp-ba-card-main strong{display:block;font-size:10px}.pp-ba-card-main small{display:block;margin-top:2px;color:#8ea4af;font-size:8px;line-height:1.35}.pp-ba-pill{padding:3px 5px;border:1px solid #3a5562;border-radius:99px;color:#aebdc5;font-size:7px;font-weight:900;white-space:nowrap}.pp-ba-pill.good{border-color:#36e58b66;color:#64efaa}
    .pp-ba-values{display:grid;grid-template-columns:1fr 22px 1fr;gap:6px;margin-top:8px;align-items:center}.pp-ba-value{border:1px solid #294957;border-radius:7px;padding:6px;background:#091821}.pp-ba-value span{display:block;color:#748d99;font-size:7px}.pp-ba-value strong{display:block;margin-top:2px;font-size:10px}.pp-ba-arrow{text-align:center;color:#55bfff}
    .pp-ba-impact{display:flex;justify-content:space-between;gap:8px;align-items:center;margin-top:7px;color:#8ea4af;font-size:8px}.pp-ba-impact strong{color:#64efaa;font-size:8.5px}.pp-ba-impact strong.bad{color:#ff6b6b}
    .pp-ba-button{width:100%;margin-top:7px;border:1px solid #ff7800;border-radius:8px;background:#ff7800;color:#fff;padding:8px 10px;font:900 9px Inter,Segoe UI,system-ui,sans-serif;cursor:pointer}.pp-ba-button:hover{filter:brightness(1.06)}.pp-ba-button.applied{border-color:#36e58b;background:#123c2c;color:#64efaa}
    .pp-ba-actions{display:grid;grid-template-columns:1fr 1.4fr;gap:7px;margin-top:9px}.pp-ba-reset,.pp-ba-commit{height:37px;border-radius:8px;font:900 9px Inter,Segoe UI,system-ui,sans-serif;cursor:pointer}.pp-ba-reset{border:1px solid #38525f;background:#0a1820;color:#d7e2e7}.pp-ba-reset:disabled,.pp-ba-commit:disabled{opacity:.45;cursor:not-allowed}.pp-ba-commit{border:1px solid #36e58b;background:linear-gradient(135deg,#23ce7a,#36e58b);color:#062016}
    .pp-ba-note{margin-top:7px;text-align:center;color:#718993;font-size:7.5px;line-height:1.35}
    @media(max-width:1050px){.result#about{grid-template-columns:1fr!important}.result#about>.resultView,.result#about>#ppProfitAdvisor{grid-column:1!important;grid-row:auto!important}}
    @media(max-width:650px){.pp-ba-values{grid-template-columns:1fr}.pp-ba-arrow{display:none}.pp-ba-actions{grid-template-columns:1fr}}
    body[data-pp-theme="light"] .pp-button-advisor{background:linear-gradient(180deg,#fff,#edf3f6);border-color:#b8c9d1}.pp-button-advisor .pp-ba-live,.pp-button-advisor .pp-ba-value,.pp-button-advisor .pp-ba-card{background:#f6f9fa;border-color:#c5d2d8}body[data-pp-theme="light"] .pp-ba-card-main small,body[data-pp-theme="light"] .pp-ba-head p,body[data-pp-theme="light"] .pp-ba-live-sub{color:#5d707b}
  `;document.head.appendChild(st);
}

function render(){
  const host=$('ppProfitAdvisor'),result=$('about');
  if(!host||!result)return false;
  const s=snapshot();
  if(!s)return false;
  css();
  result.classList.add('pp-advisor-results-split');
  result.style.gridTemplateColumns='minmax(0,1fr) minmax(400px,.98fr)';
  const batch=$('batchResultView')&&!$('batchResultView').hidden;
  const currentProfit=batch?s.batchProfit:s.profit;
  const sig=JSON.stringify({qty:s.qty,used:s.used,hours:s.hours,packPrice:s.packPrice,labour:s.labourHours,delivery:s.delivery,sell:s.sell,material:s.materialCost,profit:currentProfit,batch,selected:[...selected].sort()});
  if(lastSignature===sig&&host.dataset.ui===UI_KEY)return true;
  lastSignature=sig;

  selected=new Set([...selected].filter(k=>suggestions.some(x=>x.key===k&&x.can(s))));
  const active=[...selected];
  const p=project(s,active);
  const delta=p.shownProfit-currentProfit;

  host.className='pp-button-advisor';
  host.dataset.ui=UI_KEY;
  host.innerHTML=`
    <div class="pp-ba-head">
      <div class="pp-ba-title"><div class="pp-ba-icon">💡</div><div><h3>Profit Advisor</h3><p>Practical suggestions to help improve this print's profit.</p></div></div>
      <div class="pp-ba-status">${active.length} selected</div>
    </div>
    <div class="pp-ba-live">
      <div class="pp-ba-live-head"><span>Proposed profit</span><strong class="${p.shownProfit>0?'good':p.shownProfit<0?'bad':'neutral'}">${money(p.shownProfit)}</strong></div>
      <div class="pp-ba-live-sub">Current profit: ${money(currentProfit)} ${batch?'· Batch view':''}</div>
      <div class="pp-ba-change ${delta>0?'good':delta<0?'bad':''}">${delta>0?'+':''}${money(delta)} ${delta===0?'change':'profit improvement'}</div>
      <div class="pp-ba-beforeafter">
        <div class="pp-ba-ba-row"><span>Total cost</span><b>${money(s.base)}</b><i>→</i><b class="after">${money(p.base)}</b></div>
        <div class="pp-ba-ba-row"><span>Selling price</span><b>${money(s.sell)}</b><i>→</i><b class="after">${money(p.sell)}</b></div>
        <div class="pp-ba-ba-row"><span>Margin</span><b>${((batch?s.batchMargin:s.margin)*100).toFixed(1)}%</b><i>→</i><b class="after">${(p.shownMargin*100).toFixed(1)}%</b></div>
      </div>
      <div class="pp-ba-section-title">CHANGES BEING TESTED</div>
      ${active.length?active.map(k=>{
        const x=suggestions.find(z=>z.key===k),q=project(s,[k]);
        return '<div class="pp-ba-ba-row"><span>'+esc(x.title)+'</span><b>'+esc(x.text(s))+'</b><i>→</i><b class="after">'+esc(x.afterText(s))+'</b></div>';
      }).join(''):'<div class="pp-ba-note">Apply a suggestion below to see its effect here. Your real calculator values stay unchanged while you test ideas.</div>'}
    </div>
    <div class="pp-ba-section-title">SUGGESTED IMPROVEMENTS</div>
    ${suggestions.map(x=>{
      const can=x.can(s), applied=selected.has(x.key), q=project(s,[x.key]), change=q.shownProfit-currentProfit;
      return '<article class="pp-ba-card '+(applied?'applied ':'')+(can?'':'disabled')+'">'+
        '<div class="pp-ba-card-head"><div class="pp-ba-card-icon">'+x.icon+'</div><div class="pp-ba-card-main"><strong>'+esc(x.title)+'</strong><small>'+esc(x.desc)+'</small></div><span class="pp-ba-pill '+(change>0?'good':'')+'">'+esc(x.impact)+'</span></div>'+
        '<div class="pp-ba-values"><div class="pp-ba-value"><span>Current</span><strong>'+esc(x.text(s))+'</strong></div><div class="pp-ba-arrow">→</div><div class="pp-ba-value"><span>Suggested</span><strong>'+esc(x.afterText(s))+'</strong></div></div>'+
        '<div class="pp-ba-impact"><span>Potential improvement</span><strong class="'+(change<0?'bad':'')+'">'+(change>=0?'+':'')+money(change)+' profit</strong></div>'+
        '<button type="button" class="pp-ba-button '+(applied?'applied':'')+'" data-ba-apply="'+x.key+'" '+(can?'':'disabled')+'>'+ (applied?'✓ Applied to preview':'Apply suggestion →') +'</button>'+
      '</article>';
    }).join('')}
    <div class="pp-ba-actions"><button type="button" class="pp-ba-reset" id="ppBaReset" ${active.length?'':'disabled'}>↻ Reset preview</button><button type="button" class="pp-ba-commit" id="ppBaCommit" ${active.length?'':'disabled'}>✓ Apply selected changes to calculator</button></div>
    <div class="pp-ba-note">Suggested changes are estimates. The calculator is only updated when you press <b>Apply selected changes to calculator</b>.</div>
  `;

  if(host.dataset.baBound!=='1'){
    host.dataset.baBound='1';
    host.addEventListener('click',event=>{
      const btn=event.target?.closest?.('[data-ba-apply]');
      if(btn){
        event.preventDefault();
        const key=btn.getAttribute('data-ba-apply');
        if(selected.has(key))selected.delete(key);else selected.add(key);
        lastSignature='';
        render();
        return;
      }
      if(event.target?.closest?.('#ppBaReset')){selected.clear();lastSignature='';render();return;}
      if(event.target?.closest?.('#ppBaCommit')){commit(s,[...selected]);return;}
    });
  }

  return true;
}

function esc(v){return String(v??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));}

function commit(s,keys){
  if(!keys.length)return;
  const map=new Set(keys);
  const apply=(id,v)=>{const el=$(id);if(el){el.value=String(v);el.dispatchEvent(new Event('input',{bubbles:true}));el.dispatchEvent(new Event('change',{bubbles:true));}};
  if(map.has('materialUsage')&&s.used>0)apply('materialUsed',(s.used*.85).toFixed(2));
  if(map.has('printTime')&&s.hours>0){const h=s.hours*.9,whole=Math.floor(h),m=Math.round((h-whole)*60);apply('ppPrintTimeHours',whole);apply('ppPrintTimeMinutes',m);}
  if(map.has('materialCost')&&s.packPrice>0)apply('materialPackCost',(s.packPrice*.85).toFixed(2));
  if(map.has('deliveryCost'))apply('delivery',Math.max(0,s.delivery-.95).toFixed(2));
  if(map.has('labourMinutes'))apply('labourHours',Math.max(0,s.labourHours-5/60).toFixed(2));
  if(map.has('sellingPrice'))apply('sell',Math.max(s.sell*1.15,s.sell+2.5).toFixed(2));
  setTimeout(()=>{selected.clear();$('calc')?.click();},30);
}

function boot(){
  const started=Date.now();
  const timer=setInterval(()=>{
    if(render()||Date.now()-started>15000)clearInterval(timer);
  },120);
  const observer=new MutationObserver(()=>render());
  observer.observe(document.body,{childList:true,subtree:true});
  setTimeout(()=>render(),50);
  setTimeout(()=>render(),400);
  setTimeout(()=>render(),900);
  window.addEventListener('resize',()=>render(),{passive:true});
  document.addEventListener('change',e=>{
    if(e.target?.matches?.('input,select,textarea')&&!e.target.closest('#ppProfitAdvisor'))setTimeout(()=>{lastSignature='';render();},30);
  });
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();

})();