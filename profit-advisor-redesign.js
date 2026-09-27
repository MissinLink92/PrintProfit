(()=>{
'use strict';

const DRAFT_KEY='printprofit.calculator-draft.v3';
const HANDOFF_KEY='printprofit.calculator-navigation-handoff.v1';
const mountId='ppAdvisorLiveWorkspace';

const esc=v=>String(v??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
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
const num=(f,id)=>Number.parseFloat(f?.[id]?.value??0)||0;
const val=(f,id)=>String(f?.[id]?.value??'');
const parsePrinter=v=>{const p=String(v||'').split(/[|,]/);return{watts:Number(p[0])||0,price:Number(p[1])||0,lifetime:Number(p[2])||0}};
const formatHours=h=>{
  const x=Math.max(0,Number(h)||0);
  let whole=Math.floor(x),mins=Math.round((x-whole)*60);
  if(mins===60){whole++;mins=0}
  return whole+'h '+String(mins).padStart(2,'0')+'m';
};
const formatMinutes=m=>Math.round(Number(m)||0)+' min';

function readDraft(){
  try{
    const d=JSON.parse(sessionStorage.getItem(DRAFT_KEY)||'null');
    return d&&d.fields?d:null;
  }catch(e){return null}
}

function buildState(draft){
  const f=draft?.fields||{};
  const p=parsePrinter(val(f,'printer'));
  const qty=Math.max(1,Math.floor(num(f,'qty')));
  const disc=Math.min(100,num(f,'discount'))/100;
  const hField=f.ppPrintTimeHours;
  const mField=f.ppPrintTimeMinutes;
  const hours=hField
    ?Math.max(0,Math.floor(num(f,'ppPrintTimeHours'))+Math.max(0,Math.min(59,Math.floor(num(f,'ppPrintTimeMinutes'))))/60)
    :Math.max(0,num(f,'printHours'));
  const pack=num(f,'materialPack');
  const packPrice=num(f,'materialPackCost');
  const used=num(f,'materialUsed');
  const materialCost=pack>0&&used>0?packPrice*(used/pack):0;
  const elec=p.watts>0&&hours>0?p.watts/1000*hours*num(f,'electricityRate'):0;
  const depreciation=p.lifetime&&hours?p.price/p.lifetime*hours:0;
  const labourHours=num(f,'labourHours');
  const labour=num(f,'labourRate')*labourHours;
  const packagingOther=num(f,'pack')+num(f,'other');
  const delivery=num(f,'delivery');
  const deliveryCharge=num(f,'deliveryCharge');
  const base=materialCost+elec+depreciation+labour+packagingOther+delivery;
  const sell=num(f,'sell');
  const feeRate=(num(f,'platform')+num(f,'pay'))/100;
  const fixedFee=num(f,'fixedFee');
  const fees=sell*feeRate+fixedFee;
  const profit=sell+deliveryCharge-base-fees;
  const margin=sell?profit/sell:0;
  return {draft,f,p,qty,disc,hours,pack,packPrice,used,materialCost,elec,depreciation,labourHours,labour,packagingOther,delivery,deliveryCharge,base,sell,feeRate,fixedFee,fees,profit,margin};
}

function project(state,keys){
  const k=new Set(keys);
  const used=k.has('materialUsage')?state.used*.85:state.used;
  const hours=k.has('printTime')?state.hours*.90:state.hours;
  const packPrice=k.has('materialCost')?state.packPrice*.85:state.packPrice;
  const labourHours=k.has('labourMinutes')?Math.max(0,state.labourHours-5/60):state.labourHours;
  const delivery=k.has('deliveryCost')?Math.max(0,state.delivery-.95):state.delivery;
  const sell=k.has('sellingPrice')?Math.max(state.sell*1.15,state.sell+2.5):state.sell;
  const materialCost=state.pack>0&&used>0?packPrice*(used/state.pack):0;
  const elec=state.p.watts>0&&hours>0?state.p.watts/1000*hours*num(state.f,'electricityRate'):0;
  const depreciation=state.p.lifetime&&hours?state.p.price/state.p.lifetime*hours:0;
  const labour=num(state.f,'labourRate')*labourHours;
  const base=materialCost+elec+depreciation+labour+state.packagingOther+delivery;
  const fees=sell*state.feeRate+state.fixedFee;
  const profit=sell+state.deliveryCharge-base-fees;
  const margin=sell?profit/sell:0;
  return {used,hours,packPrice,labourHours,delivery,sell,materialCost,elec,depreciation,labour,base,fees,profit,margin};
}

function suggestedKeys(){
  return ['materialUsage','printTime','materialCost','deliveryCost','labourMinutes','sellingPrice'];
}

function changeRows(state,projection,keys){
  const rows=[];
  const k=new Set(keys);
  if(k.has('materialUsage')&&state.used>0)rows.push(['Material usage',state.used.toFixed(1)+' g',projection.used.toFixed(1)+' g']);
  if(k.has('printTime')&&state.hours>0)rows.push(['Print time',formatHours(state.hours),formatHours(projection.hours)]);
  if(k.has('materialCost')&&state.materialCost>0)rows.push(['Material cost',money(state.materialCost),money(projection.materialCost)]);
  if(k.has('deliveryCost'))rows.push(['Delivery cost',money(state.delivery),money(projection.delivery)]);
  if(k.has('labourMinutes')&&state.labourHours>0)rows.push(['Labour time',formatMinutes(state.labourHours*60),formatMinutes(projection.labourHours*60)]);
  if(k.has('sellingPrice')&&state.sell>0)rows.push(['Selling price',money(state.sell),money(projection.sell)]);
  return rows;
}

let state=null;
let activeKeys=new Set();

function writeField(fields,id,value){
  if(!fields[id])fields[id]={value:String(value)};
  else fields[id].value=String(value);
}

function applyKeysToDraft(draft,state,keys){
  const fields=draft.fields||{};
  const k=new Set(keys);
  if(k.has('materialUsage')&&state.used>0)writeField(fields,'materialUsed',(state.used*.85).toFixed(2));
  if(k.has('printTime')&&state.hours>0){
    const h=state.hours*.9;
    const whole=Math.floor(h);
    const mins=Math.round((h-whole)*60);
    writeField(fields,'ppPrintTimeHours',whole);
    writeField(fields,'ppPrintTimeMinutes',mins);
  }
  if(k.has('materialCost')&&state.packPrice>0)writeField(fields,'materialPackCost',(state.packPrice*.85).toFixed(2));
  if(k.has('deliveryCost'))writeField(fields,'delivery',Math.max(0,state.delivery-.95).toFixed(2));
  if(k.has('labourMinutes'))writeField(fields,'labourHours',Math.max(0,state.labourHours-5/60).toFixed(2));
  if(k.has('sellingPrice'))writeField(fields,'sell',Math.max(state.sell*1.15,state.sell+2.5).toFixed(2));
  draft.fields=fields;
  draft.stage='results';
}

function commitToCalculator(){
  if(!state||!activeKeys.size)return;
  const draft=readDraft();
  if(!draft?.fields)return;
  applyKeysToDraft(draft,state,[...activeKeys]);
  try{
    sessionStorage.setItem(DRAFT_KEY,JSON.stringify(draft));
    sessionStorage.setItem(HANDOFF_KEY,'1');
  }catch(e){}
  window.location.href='./index.html';
}

function renderLive(){
  const host=document.getElementById(mountId);
  if(!host||!state)return;
  const keys=[...activeKeys];
  const p=project(state,keys);
  const delta=p.profit-state.profit;
  const rows=changeRows(state,p,keys);
  const profitClass=v=>v>0?'good':v<0?'bad':'neutral';
  host.innerHTML=`
    <div class="pp-live-head">
      <div>
        <div class="pp-live-kicker">LIVE RESULT</div>
        <h3>See the effect as you make changes</h3>
        <p>Nothing is sent to the calculator until you choose <b>Apply changes to Calculator</b>.</p>
      </div>
      <span class="pp-live-count">${keys.length} change${keys.length===1?'':'s'}</span>
    </div>

    <div class="pp-live-cards">
      <div class="pp-live-card"><span>Current profit</span><strong class="${profitClass(state.profit)}">${esc(money(state.profit))}</strong></div>
      <div class="pp-live-card"><span>Proposed profit</span><strong class="${profitClass(p.profit)}">${esc(money(p.profit))}</strong></div>
      <div class="pp-live-card"><span>Profit change</span><strong class="${delta>0?'good':delta<0?'bad':'neutral'}">${esc((delta>=0?'+':'−')+money(Math.abs(delta)))}</strong></div>
      <div class="pp-live-card"><span>Margin</span><strong class="${profitClass(p.margin)}">${(p.margin*100).toFixed(1)}%</strong></div>
    </div>

    <div class="pp-live-results">
      <div class="pp-live-result-row"><span>Total cost</span><b>${esc(money(state.base))}</b><i>→</i><b class="after">${esc(money(p.base))}</b></div>
      <div class="pp-live-result-row"><span>Selling price</span><b>${esc(money(state.sell))}</b><i>→</i><b class="after">${esc(money(p.sell))}</b></div>
    </div>

    <div class="pp-live-changes">
      <div class="pp-live-section-title">CHANGES BEING TESTED</div>
      ${rows.length?rows.map(r=>`<div class="pp-live-change"><span>${esc(r[0])}</span><b>${esc(r[1])}</b><i>→</i><strong>${esc(r[2])}</strong></div>`).join(''):'<div class="pp-live-empty">Click <b>Apply to preview →</b> on any suggestion. You can stack several changes and see their combined effect here.</div>'}
    </div>

    <div class="pp-live-actions">
      <button type="button" id="ppLiveReset" class="pp-live-reset" ${keys.length?'':'disabled'}>↻ Reset preview</button>
      <button type="button" id="ppLiveCommit" class="pp-live-commit" ${keys.length?'':'disabled'}>✓ Apply changes to Calculator</button>
    </div>

    <div class="pp-live-note">Your original calculator values stay unchanged while you experiment here.</div>
  `;

  document.getElementById('ppLiveReset')?.addEventListener('click',()=>{activeKeys.clear();updateButtons();renderLive()});
  document.getElementById('ppLiveCommit')?.addEventListener('click',commitToCalculator);
}

function updateButtons(){
  document.querySelectorAll('[data-apply]').forEach(button=>{
    const key=button.getAttribute('data-apply');
    const active=activeKeys.has(key);
    button.classList.toggle('applied',active);
    button.textContent=active?'✓ Applied to preview':'Apply to preview →';
    button.setAttribute('aria-pressed',String(active));
  });
}

function installStyles(){
  if(document.getElementById('ppAdvisorRedesignStyles'))return;
  const style=document.createElement('style');
  style.id='ppAdvisorRedesignStyles';
  style.textContent=`
    .ppAdvisorRedesignHost{display:block}
    #ppAdvisorLiveWorkspace{border:1px solid #ff7800;border-radius:14px;background:linear-gradient(180deg,#0b202b,#07151d);padding:14px;position:sticky;top:88px;box-shadow:0 14px 32px #0006}
    .pp-live-head{display:flex;align-items:flex-start;justify-content:space-between;gap:10px;margin-bottom:10px}
    .pp-live-kicker{color:#ff9a42;font:900 8px/1 Inter,Segoe UI,system-ui,sans-serif;letter-spacing:.18em}
    .pp-live-head h3{margin:4px 0 0;font:900 17px/1.1 Inter,Segoe UI,system-ui,sans-serif;color:#f5f8fb}
    .pp-live-head p{margin:5px 0 0;color:#9db0ba;font:500 8.5px/1.45 Inter,Segoe UI,system-ui,sans-serif}
    .pp-live-count{border:1px solid #315666;border-radius:99px;color:#9fc0cd;background:#081821;padding:5px 7px;font:800 7px/1 Inter,Segoe UI,system-ui,sans-serif;white-space:nowrap}
    .pp-live-cards{display:grid;grid-template-columns:1fr 1fr;gap:7px}
    .pp-live-card{border:1px solid #294957;border-radius:9px;background:#081821;padding:9px}
    .pp-live-card span{display:block;color:#829aa7;font-size:7.5px;text-transform:uppercase;letter-spacing:.06em}
    .pp-live-card strong{display:block;margin-top:4px;font-size:15px;line-height:1.05}
    .pp-live-card strong.good{color:#36e58b}.pp-live-card strong.bad{color:#ff6b6b}.pp-live-card strong.neutral{color:#f5f8fb}
    .pp-live-results{margin-top:8px;border:1px solid #294957;border-radius:9px;background:#07161f;padding:8px}
    .pp-live-result-row{display:grid;grid-template-columns:minmax(0,1fr) auto 14px auto;gap:6px;align-items:center;padding:5px 0;border-bottom:1px solid #29495744;font-size:8.5px}
    .pp-live-result-row:last-child{border-bottom:0}
    .pp-live-result-row span{color:#90a6b1}.pp-live-result-row b{font-size:9px}.pp-live-result-row i{font-style:normal;color:#55bfff}.pp-live-result-row .after{color:#64efaa}
    .pp-live-changes{margin-top:9px;border-top:1px solid #294957;padding-top:8px}
    .pp-live-section-title{color:#718c99;font:900 7px/1 Inter,Segoe UI,system-ui,sans-serif;letter-spacing:.14em;margin-bottom:5px}
    .pp-live-change{display:grid;grid-template-columns:minmax(0,1fr) auto 15px auto;gap:5px;align-items:center;padding:6px 0;border-bottom:1px solid #29495735;font-size:8px}
    .pp-live-change:last-child{border-bottom:0}.pp-live-change span{color:#9db0ba}.pp-live-change b{color:#aebdc5;font-size:8px}.pp-live-change i{font-style:normal;color:#55bfff}.pp-live-change strong{color:#64efaa;font-size:8px}
    .pp-live-empty{border:1px dashed #315666;border-radius:8px;padding:10px;color:#859ca8;font-size:8px;line-height:1.45}.pp-live-empty b{color:#dce8ed}
    .pp-live-actions{display:grid;grid-template-columns:1fr 1.5fr;gap:7px;margin-top:10px}
    .pp-live-reset,.pp-live-commit{height:37px;border-radius:8px;font:900 9px/1 Inter,Segoe UI,system-ui,sans-serif;cursor:pointer}
    .pp-live-reset{border:1px solid #38525f;background:#0a1820;color:#d7e2e7}.pp-live-reset:hover{border-color:#ff7800;color:#ff9a42}
    .pp-live-commit{border:1px solid #36e58b;background:linear-gradient(135deg,#23ce7a,#36e58b);color:#062016;box-shadow:0 8px 20px #36e58b18}
    .pp-live-reset:disabled,.pp-live-commit:disabled{opacity:.45;cursor:not-allowed}
    .pp-live-note{margin-top:8px;color:#6f8895;font-size:7.5px;line-height:1.4;text-align:center}
    #ppAdvisorLiveWorkspace .pp-live-card strong.bad{color:#ff6b6b!important}
    #ppAdvisorLiveWorkspace .pp-live-card strong.good{color:#36e58b!important}
    body[data-pp-theme="light"] #ppAdvisorLiveWorkspace{background:linear-gradient(180deg,#fff,#edf3f6)!important;border-color:#c9a170!important}
    body[data-pp-theme="light"] .pp-live-head h3{color:#17232b!important}
    body[data-pp-theme="light"] .pp-live-card,body[data-pp-theme="light"] .pp-live-results{background:#f6f9fa!important;border-color:#c5d2d8!important}
    body[data-pp-theme="light"] .pp-live-card span,body[data-pp-theme="light"] .pp-live-head p,body[data-pp-theme="light"] .pp-live-change span,body[data-pp-theme="light"] .pp-live-empty{color:#5d707b!important}
    @media(min-width:981px){.profit-advisor-page-placeholder{display:block}}
    @media(max-width:980px){
      #ppAdvisorLiveWorkspace{position:static;margin-top:10px}
      .main{grid-template-columns:minmax(0,1fr)!important}
      .side{display:block!important}
    }
    @media(max-width:650px){
      #ppAdvisorLiveWorkspace{padding:10px}
      .pp-live-actions{grid-template-columns:1fr}
      .pp-live-change{grid-template-columns:minmax(0,1fr) auto 12px auto}
    }
  `;
  document.head.appendChild(style);
}

function mount(){
  if(document.getElementById(mountId))return true;
  const main=document.querySelector('.main');
  const left=main?.querySelector(':scope > .panel');
  const side=main?.querySelector(':scope > .side');
  if(!main||!left||!side||!document.querySelector('[data-apply]'))return false;
  const draft=readDraft();
  state=buildState(draft);
  if(!state)return false;

  installStyles();

  side.querySelectorAll('.panel,.tip').forEach(el=>el.style.display='none');
  side.style.display='block';

  const host=document.createElement('section');
  host.id=mountId;
  side.appendChild(host);

  const projected=document.querySelector('.projected');
  const applyAll=document.getElementById('applyAll');
  if(projected)projected.style.display='none';
  if(applyAll)applyAll.style.display='none';

  main.style.gridTemplateColumns='minmax(0,1.45fr) minmax(380px,.9fr)';

  updateButtons();
  renderLive();
  return true;
}

function installInterception(){
  document.addEventListener('click',event=>{
    const button=event.target?.closest?.('[data-apply]');
    if(!button)return;
    event.preventDefault();
    event.stopImmediatePropagation();
    const key=button.getAttribute('data-apply');
    if(!key)return;
    if(activeKeys.has(key))activeKeys.delete(key);else activeKeys.add(key);
    updateButtons();
    renderLive();
  },true);
}

function boot(){
  installInterception();
  const start=Date.now();
  const timer=setInterval(()=>{
    if(mount()||Date.now()-start>15000)clearInterval(timer);
  },100);
}

if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();

})();