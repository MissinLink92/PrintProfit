(()=>{
'use strict';

const $ = id => document.getElementById(id);
const n = id => Number.parseFloat($(id)?.value || '0') || 0;

function prefs(){
  try{return JSON.parse(localStorage.getItem('printprofit.preferences.v3')||'{}');}
  catch(e){return {};}
}

function money(v){
  const value=Number(v)||0;
  const p=prefs();
  const rates={GBP:1,EUR:1.1663,USD:1.3370,PLN:5.0892,CAD:1.84,AUD:2,CHF:.96,SEK:14.75,NOK:14.70,DKK:8.69,CZK:28.30,JPY:179,CNY:9.65,INR:123.50,NZD:2.16,SGD:1.71,BRL:7.18,MXN:23.0696,ZAR:21.80};
  const code=p.currency||'GBP';
  const rate=Number(p.rate)>0?Number(p.rate):(rates[code]||1);
  if(code!=='GBP'){
    const locales={EUR:'de-DE',USD:'en-US',PLN:'pl-PL',CAD:'en-CA',AUD:'en-AU',CHF:'de-CH',SEK:'sv-SE',NOK:'nb-NO',DKK:'da-DK',CZK:'cs-CZ',JPY:'ja-JP',CNY:'zh-CN',INR:'en-IN',NZD:'en-NZ',SGD:'en-SG',BRL:'pt-BR',MXN:'es-MX',ZAR:'en-ZA'};
    try{return new Intl.NumberFormat(locales[code]||'en-GB',{style:'currency',currency:code,minimumFractionDigits:2,maximumFractionDigits:2}).format(value*rate);}
    catch(e){}
  }
  return '£'+value.toFixed(2);
}

function printerData(){
  const el=$('printer'),v=el?.value||'';
  if(!v||v==='custom')return{watts:0,price:0,lifetime:0};
  const p=v.split(/[|,]/);
  return{watts:Number(p[0])||0,price:Number(p[1])||0,lifetime:Number(p[2])||0};
}

function readState(){
  const p=printerData();
  const qty=Math.max(1,Math.floor(n('qty')));
  const disc=Math.min(100,n('discount'))/100;
  const h=$('ppPrintTimeHours'),m=$('ppPrintTimeMinutes');
  const hours=(h&&m)
    ?Math.max(0,Math.floor(Number(h.value)||0)+Math.max(0,Math.min(59,Math.floor(Number(m.value)||0)))/60)
    :n('printHours');
  const pack=n('materialPack');
  const packPrice=n('materialPackCost');
  const used=n('materialUsed');
  const materialCost=pack>0&&used>0?packPrice*(used/pack):0;
  const powerUsed=p.watts>0&&hours>0?p.watts/1000*hours:0;
  const elec=powerUsed*n('electricityRate');
  const depreciation=p.lifetime&&hours?p.price/p.lifetime*hours:0;
  const labour=n('labourRate')*n('labourHours');
  const packaging=n('pack');
  const other=n('other');
  const packagingOther=packaging+other;
  const delivery=n('delivery');
  const deliveryCharge=n('deliveryCharge');
  const base=materialCost+elec+depreciation+labour+packagingOther+delivery;
  const sell=n('sell');
  const feeRate=(n('platform')+n('pay'))/100;
  const fixedFee=n('fixedFee');
  const fees=sell*feeRate+fixedFee;
  const profit=sell+deliveryCharge-base-fees;
  const margin=sell?profit/sell:0;
  const batchSales=sell*qty*(1-disc);
  const batchProductionBase=Math.max(0,base-delivery);
  const batchCost=batchProductionBase*qty+delivery;
  const batchFees=batchSales*feeRate+fixedFee;
  const batchProfit=batchSales+deliveryCharge-batchCost-batchFees;
  const batchMargin=batchSales?batchProfit/batchSales:0;
  return {p,hours,qty,disc,pack,packPrice,used,materialCost,elec,depreciation,labour,packaging,other,packagingOther,delivery,deliveryCharge,base,sell,feeRate,fixedFee,fees,profit,margin,batchSales,batchCost,batchFees,batchProfit,batchMargin};
}

function profileData(){
  try{return window.__ppProfitAdvisorData?.()||{};}catch(e){return {};}
}

function profileLabel(key){
  const select=$('platformSelect');
  const option=select?.querySelector('option[value="'+String(key).replace(/"/g,'&quot;')+'"]');
  return option?.textContent?.trim()||key;
}

function scenarioPlatform(){
  const select=$('ppWhatIfPlatform');
  const key=select?.value||$('platformSelect')?.value||'custom';
  const profiles=profileData().platformProfiles||{};
  if(key==='custom' || !profiles[key]){
    return {key:'custom',name:profileLabel('custom')||'Custom',platform:n('platform'),pay:n('pay'),fixed:n('fixedFee')};
  }
  const p=profiles[key];
  return {key,name:profileLabel(key),platform:Number(p.platform)||0,pay:Number(p.pay)||0,fixed:Number(p.fixed)||0};
}

function addStyles(){
  if($('ppProfitToolsStyles'))return;
  const s=document.createElement('style');
  s.id='ppProfitToolsStyles';
  s.textContent=[
    '#ppResultStatus{display:inline-flex;align-items:center;gap:6px;margin-left:auto;padding:5px 8px;border:1px solid var(--line,#24404e);border-radius:999px;font:900 9px/1 Inter,Segoe UI,system-ui,sans-serif;letter-spacing:.08em;text-transform:uppercase;white-space:nowrap}',
    '#ppResultStatus.good{border-color:rgba(54,229,139,.45);color:var(--good,#36e58b)}',
    '#ppResultStatus.bad{border-color:rgba(255,107,107,.45);color:var(--bad,#ff6b6b)}',
    '#ppResultStatus.neutral{color:var(--muted,#aebdca)}',
    '#ppProfitToolkitLauncher{display:flex;align-items:center;justify-content:space-between;gap:12px;width:100%;margin-top:12px;padding:10px 12px;border:1px solid var(--line,#24404e);border-radius:11px;background:linear-gradient(180deg,var(--panel2,#0e202b),var(--panel,#0b1821));color:var(--text,#f5f8fb);cursor:pointer;text-align:left;font:700 11px Inter,Segoe UI,system-ui,sans-serif}',
    '#ppProfitToolkitLauncher:hover{border-color:var(--accent,#ff7800);transform:translateY(-1px)}',
    '#ppProfitToolkitLauncher .pp-launch-main{display:flex;align-items:center;gap:9px;min-width:0}',
    '#ppProfitToolkitLauncher .pp-launch-icon{width:28px;height:28px;display:grid;place-items:center;border-radius:8px;background:var(--accent,#ff7800);color:#fff;font-size:14px;flex:0 0 28px}',
    '#ppProfitToolkitLauncher .pp-launch-copy strong{display:block;font-size:11px}',
    '#ppProfitToolkitLauncher .pp-launch-copy span{display:block;margin-top:2px;color:var(--muted,#aebdca);font-size:8.5px;font-weight:600}',
    '#ppProfitToolkitLauncher .pp-launch-arrow{color:var(--accent,#ff7800);font-size:18px;line-height:1}',
    '#ppProfitTools{position:fixed;inset:0;z-index:12050;display:none;background:rgba(0,0,0,.70);backdrop-filter:blur(6px);padding:16px;overflow:auto}',
    '#ppProfitTools.pp-open{display:flex;align-items:center;justify-content:center}',
    '#ppProfitTools .pp-tools-shell{width:min(920px,100%);max-height:min(860px,calc(100vh - 32px));border:1px solid #315261;border-radius:18px;background:linear-gradient(180deg,var(--panel2,#0e202b),var(--panel,#0b1821));box-shadow:0 28px 90px #000b;overflow:auto}',
    '#ppProfitTools .pp-tools-head{display:flex;align-items:flex-start;justify-content:space-between;gap:14px;padding:14px 16px;border-bottom:1px solid var(--line,#24404e);position:sticky;top:0;background:rgba(9,24,33,.97);z-index:2}',
    '#ppProfitTools .pp-tools-close{width:34px;height:34px;flex:0 0 34px;border:1px solid var(--line,#24404e);border-radius:9px;background:var(--panel,#0b1821);color:var(--text,#f5f8fb);font-size:22px;line-height:1;cursor:pointer}',
    '#ppProfitTools .pp-tools-close:hover{border-color:var(--accent,#ff7800);color:var(--accent,#ff7800)}',
    '#ppProfitTools .pp-tools-head{padding:10px 12px;border-bottom:1px solid var(--line,#24404e)}',
    '#ppProfitTools .pp-tools-head h3{margin:0;font-size:13px}',
    '#ppProfitTools .pp-tools-head p{margin:3px 0 0;color:var(--muted,#aebdca);font-size:9.5px;line-height:1.4}',
    '#ppProfitTools details{border-bottom:1px solid rgba(127,160,175,.12)}',
    '#ppProfitTools details:last-child{border-bottom:0}',
    '#ppProfitTools summary{padding:9px 12px;cursor:pointer;font-weight:800;font-size:10.5px;list-style:none;display:flex;align-items:center;justify-content:space-between;gap:10px}',
    '#ppProfitTools summary::-webkit-details-marker{display:none}',
    '#ppProfitTools summary:after{content:"+";font-size:14px;color:var(--accent,#ff7800);font-weight:900}',
    '#ppProfitTools details[open] summary:after{content:"−"}',
    '.pp-tool-body{padding:0 12px 11px}',
    '.pp-tool-grid{display:grid;grid-template-columns:1fr 1fr;gap:7px}',
    '.pp-tool-field label{display:block;color:var(--muted,#aebdca);font-size:9px;margin-bottom:4px}',
    '.pp-tool-field input,.pp-tool-field select{width:100%;background:var(--panel,#0b1821);color:var(--text,#f5f8fb);border:1px solid var(--line,#24404e);border-radius:7px;padding:7px 8px;font:600 11px Inter,Segoe UI,system-ui,sans-serif;outline:0}',
    '.pp-tool-field input:focus,.pp-tool-field select:focus{border-color:var(--accent,#ff7800)}',
    '.pp-tool-note{margin-top:7px;color:var(--muted,#aebdca);font-size:8.5px;line-height:1.45}',
    '.pp-whatif-result{display:grid;grid-template-columns:1fr 1fr;gap:7px;margin-top:9px}',
    '.pp-whatif-stat,.pp-tool-result-card{border:1px solid var(--line,#24404e);border-radius:8px;padding:8px;background:rgba(255,255,255,.02)}',
    '.pp-whatif-stat span,.pp-tool-result-card span{display:block;color:var(--muted,#aebdca);font-size:8.5px}',
    '.pp-whatif-stat strong,.pp-tool-result-card strong{display:block;margin-top:3px;font-size:13px}',
    '.pp-whatif-delta{font-weight:900}',
    '.pp-whatif-delta.up{color:var(--good,#36e58b)}',
    '.pp-whatif-delta.down{color:var(--bad,#ff6b6b)}',
    '.pp-bars{margin-top:7px}',
    '.pp-bar-row{margin:7px 0}',
    '.pp-bar-top{display:flex;justify-content:space-between;gap:8px;font-size:9px}',
    '.pp-bar-track{height:7px;border-radius:99px;background:rgba(127,160,175,.14);overflow:hidden;margin-top:4px}',
    '.pp-bar-fill{height:100%;border-radius:99px;background:var(--accent,#ff7800);min-width:2px}',
    '.pp-ladder{border:1px solid var(--line,#24404e);border-radius:8px;overflow:hidden;margin-top:7px}',
    '.pp-ladder-row{display:grid;grid-template-columns:1fr auto;gap:8px;padding:7px 8px;border-bottom:1px solid rgba(127,160,175,.12);font-size:9.5px}',
    '.pp-ladder-row:last-child{border-bottom:0}',
    '.pp-ladder-row strong{font-size:10px}',
    '.pp-bulk-card{border:1px solid var(--line,#24404e);border-radius:8px;padding:8px;margin-top:7px}',
    '.pp-bulk-card h4{margin:0 0 7px;font-size:10px}',
    '.pp-bulk-output{display:grid;grid-template-columns:1fr 1fr;gap:7px;margin-top:7px}',
    '.pp-bulk-output div{border-top:1px solid rgba(127,160,175,.12);padding-top:6px}',
    '.pp-bulk-output span{display:block;color:var(--muted,#aebdca);font-size:8px}',
    '.pp-bulk-output b{display:block;margin-top:2px;font-size:10px}',
    'body[data-pp-theme="light"] #ppProfitTools{background:linear-gradient(180deg,#fff,#edf3f6)!important;border-color:#b8c9d1!important;color:#17232b!important}',
    'body[data-pp-theme="light"] #ppProfitTools .pp-tools-head p,body[data-pp-theme="light"] #ppProfitTools .pp-tool-field label,body[data-pp-theme="light"] #ppProfitTools .pp-tool-note,body[data-pp-theme="light"] .pp-whatif-stat span,body[data-pp-theme="light"] .pp-tool-result-card span,body[data-pp-theme="light"] .pp-bulk-output span{color:#5d707b!important}',
    'body[data-pp-theme="light"] .pp-tool-field input,body[data-pp-theme="light"] .pp-tool-field select{background:#fff!important;color:#17232b!important;border-color:#c5d2d8!important}',
    'body[data-pp-theme="light"] .pp-whatif-stat,body[data-pp-theme="light"] .pp-tool-result-card,body[data-pp-theme="light"] .pp-ladder,body[data-pp-theme="light"] .pp-bulk-card{border-color:#c5d2d8!important;background:#f6f9fa!important}',
    '@media(max-width:650px){#ppResultStatus{font-size:8px;padding:4px 6px}.pp-tool-grid,.pp-whatif-result,.pp-bulk-output{grid-template-columns:1fr}.pp-tool-body{padding:0 10px 10px}}'
  ].join('');
  document.head.appendChild(s);
}

function buildTools(){
  const result=$('.result')||document.querySelector('.result');
  if(!result||$('ppProfitTools'))return false;
  addStyles();

  const head=result.querySelector('.head');
  if(head&&!$('ppResultStatus')){
    const badge=document.createElement('span');
    badge.id='ppResultStatus';
    head.appendChild(badge);
  }

  const box=document.createElement('section');
  box.id='ppProfitTools';
  const contentWrap=document.createElement('div');
  contentWrap.className='pp-tools-shell';
  box.appendChild(contentWrap);
  contentWrap.innerHTML=[
    '<div class="pp-tools-head"><div><h3>Profit Toolkit</h3><p>See where your money goes, test changes safely and price your print with the current fee assumptions.</p></div><button type="button" class="pp-tools-close" aria-label="Close Profit Toolkit">×</button></div>',
    '<details><summary>What If? — test changes before you make them</summary><div class="pp-tool-body">',
      '<div class="pp-tool-grid">',
        '<div class="pp-tool-field"><label>Material usage reduction (%) — e.g. lower infill</label><input id="ppWhatIfMaterial" type="number" min="0" max="80" step="1" value="0"></div>',
        '<div class="pp-tool-field"><label>Print-time reduction (%) — e.g. faster settings</label><input id="ppWhatIfTime" type="number" min="0" max="80" step="1" value="0"></div>',
        '<div class="pp-tool-field"><label>Labour minutes saved per print</label><input id="ppWhatIfLabour" type="number" min="0" max="240" step="1" value="0"></div>',
        '<div class="pp-tool-field"><label>Packaging saving per print</label><input id="ppWhatIfPack" type="number" min="0" step=".01" value="0"></div>',
        '<div class="pp-tool-field"><label>Delivery saving per print</label><input id="ppWhatIfDelivery" type="number" min="0" step=".01" value="0"></div>',
        '<div class="pp-tool-field"><label>Sell via</label><select id="ppWhatIfPlatform"></select></div>',
      '</div>',
      '<div class="pp-whatif-result"><div class="pp-whatif-stat"><span>Current profit</span><strong id="ppWIBaseProfit">—</strong></div><div class="pp-whatif-stat"><span>What-if profit</span><strong id="ppWIProfit">—</strong></div><div class="pp-whatif-stat"><span>Potential profit change</span><strong class="pp-whatif-delta" id="ppWIDelta">—</strong></div><div class="pp-whatif-stat"><span>Adjusted cost to make</span><strong id="ppWICost">—</strong></div></div>',
      '<div class="pp-tool-note" id="ppWINote">Scenario values are estimates. Material and time reductions are treated proportionally; real savings depend on the model and settings.</div>',
    '</div></details>',
    '<details><summary>Cost Breakdown — see what is eating the margin</summary><div class="pp-tool-body"><div class="pp-bars" id="ppCostBars"></div><div class="pp-tool-note">Bars show each current cost as a share of the total cost to make this print.</div></div></details>',
    '<details><summary>Price Ladder — see the price needed for different margins</summary><div class="pp-tool-body"><div class="pp-tool-note">Per-print pricing using the current selling channel, fixed fee and delivery charge.</div><div class="pp-ladder" id="ppPriceLadder"></div></div></details>',
    '<details><summary>Bulk Buy — check savings on material and packaging</summary><div class="pp-tool-body">',
      '<div class="pp-bulk-card"><h4>Material</h4><div class="pp-tool-grid"><div class="pp-tool-field"><label>Bulk cost per pack</label><input id="ppBulkMaterialCost" type="number" min="0" step=".01" placeholder="e.g. 17.50"></div><div class="pp-tool-field"><label>Number of packs</label><input id="ppBulkMaterialPacks" type="number" min="1" step="1" value="5"></div></div><div class="pp-bulk-output"><div><span>Saving per pack</span><b id="ppBulkMaterialPer">—</b></div><div><span>Total buy saving</span><b id="ppBulkMaterialTotal">—</b></div><div><span>Saving per print</span><b id="ppBulkMaterialPrint">—</b></div><div><span>Current pack cost</span><b id="ppBulkMaterialCurrent">—</b></div></div></div>',
      '<div class="pp-bulk-card"><h4>Packaging</h4><div class="pp-tool-grid"><div class="pp-tool-field"><label>Bulk cost per package</label><input id="ppBulkPackCost" type="number" min="0" step=".01" placeholder="e.g. 0.35"></div><div class="pp-tool-field"><label>Number of packages</label><input id="ppBulkPackQty" type="number" min="1" step="1" value="100"></div></div><div class="pp-bulk-output"><div><span>Saving per package</span><b id="ppBulkPackPer">—</b></div><div><span>Total buy saving</span><b id="ppBulkPackTotal">—</b></div><div><span>Saving per print</span><b id="ppBulkPackPrint">—</b></div><div><span>Current package cost</span><b id="ppBulkPackCurrent">—</b></div></div></div>',
    '</div></details>',
    '<details><summary>Sell Where? — test a different selling channel</summary><div class="pp-tool-body"><div class="pp-tool-grid"><div class="pp-tool-field"><label>Compare at your current selling price</label><select id="ppSellWherePlatform"></select></div><div class="pp-tool-result-card"><span>Scenario fee at current price</span><strong id="ppSellWhereFee">—</strong></div></div><div class="pp-ladder" id="ppSellWhereTable"></div><div class="pp-tool-note">Fee assumptions come from the configured platform profiles. Monthly plans, promotions and optional charges may not be included.</div></div></details>'
  ].join('');

  result.appendChild(box);

  const currentPlatform=$('platformSelect')?.value||'custom';
  const selects=['ppWhatIfPlatform','ppSellWherePlatform'];
  selects.forEach(id=>{
    const sel=$(id);
    if(!sel)return;
    const source=$('platformSelect');
    if(source){
      [...source.options].forEach(o=>{
        const option=document.createElement('option');
        option.value=o.value;
        option.textContent=o.textContent;
        sel.appendChild(option);
      });
    }
    sel.value=currentPlatform;
  });

  const controls=box.querySelectorAll('input,select');
  controls.forEach(control=>{
    control.addEventListener('input',update);
    control.addEventListener('change',update);
  });

  update();
  return true;
}

function platformRows(state){
  const profiles=profileData().platformProfiles||{};
  const rows=[];
  Object.entries(profiles).forEach(([key,p])=>{
    const platform=Number(p?.platform)||0;
    const pay=Number(p?.pay)||0;
    const fixed=Number(p?.fixed)||0;
    const fee=state.sell*(platform+pay)/100+fixed;
    const profit=state.sell+state.deliveryCharge-state.base-fee;
    rows.push({key,name:profileLabel(key),fee,profit});
  });
  return rows;
}

function updateStatus(state){
  const badge=$('ppResultStatus');
  if(!badge)return;
  const batch=$('batchResultView')&&!$('batchResultView').hidden;
  const profit=batch?state.batchProfit:state.profit;
  const margin=batch?state.batchMargin:state.margin;
  if(profit<0){
    badge.className='bad';
    badge.textContent='LOSS • '+(margin*100).toFixed(1)+'% MARGIN';
  }else if(profit===0){
    badge.className='neutral';
    badge.textContent='BREAK-EVEN • 0.0% MARGIN';
  }else{
    badge.className='good';
    badge.textContent='PROFIT • '+(margin*100).toFixed(1)+'% MARGIN';
  }
}

function updateWhatIf(state){
  const materialReduction=Math.min(80,Math.max(0,n('ppWhatIfMaterial')))/100;
  const timeReduction=Math.min(80,Math.max(0,n('ppWhatIfTime')))/100;
  const labourMinutes=Math.max(0,n('ppWhatIfLabour'));
  const packSaving=Math.min(Math.max(0,n('ppWhatIfPack')),state.packaging);
  const deliverySaving=Math.min(Math.max(0,n('ppWhatIfDelivery')),state.delivery);
  const sp=scenarioPlatform();

  const material=state.materialCost*(1-materialReduction);
  const elec=state.elec*(1-timeReduction);
  const depreciation=state.depreciation*(1-timeReduction);
  const labour=Math.max(0,state.labour-state.labourRateForScenario*0);
  const labourRate=n('labourRate');
  const labourAdjusted=Math.max(0,state.labour-labourRate*(labourMinutes/60));
  const packagingOther=Math.max(0,state.packagingOther-packSaving);
  const delivery=Math.max(0,state.delivery-deliverySaving);
  const adjustedBase=material+elec+depreciation+labourAdjusted+packagingOther+delivery;
  const feeRate=(sp.platform+sp.pay)/100;
  const fees=state.sell*feeRate+sp.fixed;
  const profit=state.sell+state.deliveryCharge-adjustedBase-fees;
  const delta=profit-state.profit;

  const batchSales=state.sell*state.qty*(1-state.disc);
  const batchProductionBase=Math.max(0,adjustedBase-delivery);
  const batchCost=batchProductionBase*state.qty+delivery;
  const batchFees=batchSales*feeRate+sp.fixed;
  const batchProfit=batchSales+state.deliveryCharge-batchCost-batchFees;

  const current=$('ppWIBaseProfit'),out=$('ppWIProfit'),deltaOut=$('ppWIDelta'),costOut=$('ppWICost');
  if(current)current.textContent=money(state.profit);
  if(out)out.textContent=money(profit);
  if(deltaOut){
    deltaOut.textContent=(delta>=0?'+':'')+money(delta);
    deltaOut.className='pp-whatif-delta '+(delta>0?'up':delta<0?'down':'');
  }
  if(costOut)costOut.textContent=money(adjustedBase);

  const note=$('ppWINote');
  if(note){
    note.textContent='Scenario: '+sp.name+'. Material and print-time reductions are treated proportionally; labour, packaging and delivery savings are capped at the current costs. Batch estimate at current quantity/discount: '+money(batchProfit)+'.';
  }
}

function updateCostBars(state){
  const box=$('ppCostBars');
  if(!box)return;
  const parts=[
    ['Material',state.materialCost],
    ['Electricity',state.elec],
    ['Printer depreciation',state.depreciation],
    ['Labour',state.labour],
    ['Packaging + other',state.packagingOther],
    ['Delivery',state.delivery],
    ['Platform/payment fees',state.fees]
  ].filter(x=>x[1]>0);
  const total=parts.reduce((a,x)=>a+x[1],0);
  if(!parts.length){box.innerHTML='<div class="pp-tool-note">Add some costs to see the breakdown.</div>';return;}
  box.innerHTML=parts.map(([name,value])=>{
    const pct=total?value/total*100:0;
    return '<div class="pp-bar-row"><div class="pp-bar-top"><span>'+name+'</span><b>'+money(value)+'</b></div><div class="pp-bar-track"><div class="pp-bar-fill" style="width:'+Math.max(2,pct).toFixed(1)+'%"></div></div></div>';
  }).join('');
}

function targetPriceForMargin(state,margin){
  const den=1-state.feeRate-margin;
  if(den<=0)return null;
  const price=(state.base+state.fixedFee-state.deliveryCharge)/den;
  return Math.max(0,price);
}

function updatePriceLadder(state){
  const box=$('ppPriceLadder');
  if(!box)return;
  const levels=[0,10,20,30,40,50];
  box.innerHTML=levels.map(level=>{
    const price=targetPriceForMargin(state,level/100);
    return '<div class="pp-ladder-row"><span>'+level+'% margin'+(level===0?' · break-even':'')+'</span><strong>'+(price===null?'—':money(price))+'</strong></div>';
  }).join('');
}

function updateBulk(state){
  const materialCost=Math.max(0,n('ppBulkMaterialCost'));
  const materialPacks=Math.max(1,Math.floor(n('ppBulkMaterialPacks')));
  const materialSaving=state.packPrice>0&&materialCost>0?state.packPrice-materialCost:0;
  const materialTotal=materialSaving>0?materialSaving*materialPacks:0;
  const materialPrint=materialSaving>0&&state.pack>0&&state.used>0?materialSaving*(state.used/state.pack):0;
  const set=(id,v)=>{const el=$(id);if(el)el.textContent=v;};
  set('ppBulkMaterialPer',materialSaving>0?money(materialSaving):'—');
  set('ppBulkMaterialTotal',materialTotal>0?money(materialTotal):'—');
  set('ppBulkMaterialPrint',materialPrint>0?money(materialPrint):'—');
  set('ppBulkMaterialCurrent',state.packPrice>0?money(state.packPrice):'—');

  const packCost=Math.max(0,n('ppBulkPackCost'));
  const packQty=Math.max(1,Math.floor(n('ppBulkPackQty')));
  const packSaving=state.pack>0&&packCost>0?state.pack-packCost:0;
  const packTotal=packSaving>0?packSaving*packQty:0;
  set('ppBulkPackPer',packSaving>0?money(packSaving):'—');
  set('ppBulkPackTotal',packTotal>0?money(packTotal):'—');
  set('ppBulkPackPrint',packSaving>0?money(packSaving):'—');
  set('ppBulkPackCurrent',state.pack>0?money(state.pack):'—');
}

function updateSellWhere(state){
  const selected=$('ppSellWherePlatform');
  const spKey=selected?.value||'custom';
  const profiles=profileData().platformProfiles||{};
  let sp;
  if(spKey==='custom'||!profiles[spKey])sp={platform:n('platform'),pay:n('pay'),fixed:n('fixedFee')};
  else sp=profiles[spKey];
  const feeRate=((Number(sp.platform)||0)+(Number(sp.pay)||0))/100;
  const fee=state.sell*feeRate+(Number(sp.fixed)||0);
  const out=$('ppSellWhereFee');
  if(out)out.textContent=money(fee)+' • '+money(state.sell+state.deliveryCharge-state.base-fee)+' profit';

  const table=$('ppSellWhereTable');
  if(!table)return;
  const rows=platformRows(state).sort((a,b)=>a.fee-b.fee);
  table.innerHTML=rows.slice(0,6).map(r=>{
    const current=r.key===($('platformSelect')?.value||'custom');
    return '<div class="pp-ladder-row"><span>'+r.name+(current?' · current':'')+'</span><strong>'+money(r.fee)+'</strong></div>';
  }).join('');
}

function update(){
  if(!$('ppProfitTools'))return;
  const state=readState();
  state.labourRateForScenario=n('labourRate');
  updateStatus(state);
  updateWhatIf(state);
  updateCostBars(state);
  updatePriceLadder(state);
  updateBulk(state);
  updateSellWhere(state);
}

function boot(){
  const start=Date.now();
  const timer=setInterval(()=>{
    if(buildTools()||Date.now()-start>10000)clearInterval(timer);
  },120);
  if(document.readyState!=='loading')buildTools();
  else document.addEventListener('DOMContentLoaded',buildTools,{once:true});

  const recalc=()=>setTimeout(update,40);
  document.addEventListener('input',e=>{
    if(e.target?.id==='ppProfitTools'||e.target?.closest?.('#ppProfitTools'))return;
    if(e.target?.matches?.('input,select,textarea'))recalc();
  });
  document.addEventListener('change',e=>{
    if(e.target?.id==='ppProfitTools'||e.target?.closest?.('#ppProfitTools'))return;
    if(e.target?.matches?.('input,select,textarea'))recalc();
  });
  document.querySelectorAll('#resultTabs .tab').forEach(b=>b.addEventListener('click',()=>setTimeout(update,40)));
  document.addEventListener('printprofit-settings-changed',()=>setTimeout(update,60));
  window.addEventListener('storage',()=>setTimeout(update,60));
}

boot();
})();