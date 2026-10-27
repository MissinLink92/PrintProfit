(()=>{'use strict';
if(window.__printProfitUIModals)return;window.__printProfitUIModals=true;
let parentOverflow,bodyOverflow;
const panelOpeners=new Map();
function positionPanel(panel){
  let height=window.innerHeight;
  let top=0;
  try{
    const host=window.parent;
    if(host!==window){
      height=host.innerHeight;
      top=Math.max(0,-(window.frameElement?.getBoundingClientRect().top||0));
    }
  }catch(e){}
  panel.style.top=top+'px';panel.style.bottom='auto';panel.style.height=height+'px';
  const dialog=panel.querySelector('[role="dialog"]');
  if(dialog){
    dialog.style.top='16px';dialog.style.maxHeight=Math.max(160,height-32)+'px';
    if(panel.id==='ppGuidePanel')dialog.style.transform='translateX(-50%)';
  }
}
function showPanel(panel){
  const opener=document.activeElement;
  closePanel(panel.id==='ppGuidePanel'?'ppSettingsPanel':'ppGuidePanel');
  panelOpeners.set(panel.id,opener);
  if(bodyOverflow===undefined)bodyOverflow=document.body.style.overflow;
  try{if(window.parent!==window){
    if(parentOverflow===undefined)parentOverflow=window.parent.document.body.style.overflow;
    window.parent.document.body.style.overflow='hidden';
    window.parent.document.body.dataset.ppModalOpen='true';
  }}catch(e){}
  positionPanel(panel);
  panel.classList.add('open');
  document.body.style.overflow='hidden';
  const dialog=panel.querySelector('[role="dialog"]');
  if(dialog)dialog.scrollTop=0;
  panel.querySelector('button')?.focus({preventScroll:true});
  requestAnimationFrame(()=>{positionPanel(panel);if(dialog)dialog.scrollTop=0;});
}
const positionOpenPanels=()=>document.querySelectorAll('#ppSettingsPanel.open,#ppGuidePanel.open').forEach(positionPanel);
window.addEventListener('resize',positionOpenPanels);
try{if(window.parent!==window){window.parent.addEventListener('resize',positionOpenPanels);window.parent.addEventListener('scroll',positionOpenPanels,{passive:true});}}catch(e){}
document.addEventListener('keydown',event=>{
  const panel=document.querySelector('#ppSettingsPanel.open,#ppGuidePanel.open');if(!panel)return;
  if(event.key==='Escape'){event.preventDefault();closePanel(panel.id);return;}
  if(event.key!=='Tab')return;
  const items=[...panel.querySelectorAll('a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),[tabindex="0"]')].filter(el=>el.getClientRects().length);
  const first=items[0],last=items[items.length-1];
  if(event.shiftKey&&(document.activeElement===first||!panel.contains(document.activeElement))){event.preventDefault();last?.focus({preventScroll:true});}
  else if(!event.shiftKey&&(document.activeElement===last||!panel.contains(document.activeElement))){event.preventDefault();first?.focus({preventScroll:true});}
});
function openSettings(){
  if(document.getElementById('ppSettingsPanel')){
    showPanel(document.getElementById('ppSettingsPanel'));
    document.dispatchEvent(new CustomEvent('printprofit-settings-open'));
    return;
  }
  const panel=document.createElement('div');
  panel.id='ppSettingsPanel';
  panel.innerHTML=`
    <div class="pp-settings-backdrop" data-close-settings></div>
    <section class="pp-settings-dialog" role="dialog" aria-modal="true" aria-labelledby="ppSettingsTitle">
      <div class="pp-settings-head">
        <div class="pp-settings-brand">
          <img src="./assets/printprofit-logo-orange.svg?v=5" alt="PrintProfit">
          <div><div class="pp-settings-kicker">PRINTPROFIT</div><h2 id="ppSettingsTitle">Settings</h2><p>Manage the calculator display and preferences.</p></div>
        </div>
        <button type="button" class="pp-settings-close" aria-label="Close settings" data-close-settings>×</button>
      </div>
      <div class="pp-settings-body">
        <div class="pp-settings-section-title">Appearance</div>
        <div class="pp-settings-card">
          <span class="pp-settings-icon" aria-hidden="true"><svg viewBox="0 0 48 48"><use href="./assets/printprofit-icon-master.svg#pp-settings"></use></svg></span>
          <div><strong>Dark mode</strong><span>Use the dark PrintProfit interface.</span></div>
          <label class="pp-settings-switch"><input id="ppSettingsDark" type="checkbox" role="switch" aria-label="Dark mode" checked><span></span></label>
        </div>

        <div class="pp-settings-section-title">Language &amp; region</div>
        <div class="pp-settings-card">
          <span class="pp-settings-icon" aria-hidden="true"><svg viewBox="0 0 48 48"><use href="./assets/printprofit-icon-master.svg#pp-book"></use></svg></span>
          <div><strong>Language</strong><span>Choose the language used across the page.</span></div>
          <select id="ppSettingsLanguage" class="pp-settings-select" aria-label="Language">
            <option value="en">English</option>
            <option value="pl">Polski</option>
            <option value="de">Deutsch</option>
            <option value="fr">Français</option>
            <option value="es">Español</option>
            <option value="it">Italiano</option>
          </select>
        </div>
        <div class="pp-settings-card">
          <span class="pp-settings-icon" aria-hidden="true"><svg viewBox="0 0 48 48"><use href="./assets/printprofit-icon-master.svg#pp-calculator"></use></svg></span>
          <div><strong>Units</strong><span>Choose metric or imperial measurements.</span></div>
          <select id="ppSettingsUnits" class="pp-settings-select" aria-label="Units">
            <option value="metric">Metric (g / ml)</option>
            <option value="imperial">Imperial (oz / fl oz)</option>
          </select>
        </div>
        <div class="pp-settings-card">
          <span class="pp-settings-icon" aria-hidden="true"><svg viewBox="0 0 48 48"><use href="./assets/printprofit-icon-master.svg#pp-coins"></use></svg></span>
          <div><strong>Currency</strong><span>Choose the currency used for costs and prices.</span></div>
          <select id="ppSettingsCurrency" class="pp-settings-select" aria-label="Currency">
            <option value="GBP">GBP (£) — British Pound</option>
            <option value="EUR">EUR (€) — Euro</option>
            <option value="USD">USD ($) — US Dollar</option>
            <option value="PLN">PLN (zł) — Polish Złoty</option>
            <option value="CAD">CAD ($) — Canadian Dollar</option>
            <option value="AUD">AUD ($) — Australian Dollar</option>
            <option value="CHF">CHF (Fr) — Swiss Franc</option>
            <option value="SEK">SEK (kr) — Swedish Krona</option>
            <option value="NOK">NOK (kr) — Norwegian Krone</option>
            <option value="DKK">DKK (kr) — Danish Krone</option>
            <option value="CZK">CZK (Kč) — Czech Koruna</option>
            <option value="JPY">JPY (¥) — Japanese Yen</option>
            <option value="CNY">CNY (¥) — Chinese Yuan</option>
            <option value="INR">INR (₹) — Indian Rupee</option>
            <option value="NZD">NZD ($) — New Zealand Dollar</option>
            <option value="SGD">SGD ($) — Singapore Dollar</option>
            <option value="BRL">BRL (R$) — Brazilian Real</option>
            <option value="MXN">MXN ($) — Mexican Peso</option>
            <option value="ZAR">ZAR (R) — South African Rand</option>
          </select>
        </div>
        <div class="pp-settings-card">
          <span class="pp-settings-icon" aria-hidden="true"><svg viewBox="0 0 48 48"><use href="./assets/printprofit-icon-master.svg#pp-chart"></use></svg></span>
          <div><strong>Exchange rate</strong><span>Update the conversion used when displaying non-GBP currencies.</span></div>
          <div class="pp-settings-rate"><span>1 GBP =</span><input id="ppSettingsRate" type="number" min="0.000001" step="0.0001" value="1"></div>
        </div>

        <div class="pp-settings-section-title">Calculator</div>
        <div class="pp-settings-card">
          <span class="pp-settings-icon" aria-hidden="true"><svg viewBox="0 0 48 48"><use href="./assets/printprofit-icon-master.svg#pp-undo"></use></svg></span>
          <div><strong>Calculator reset</strong><span>Clear the current calculator inputs and return pricing to £0.</span></div>
          <button type="button" class="pp-settings-action" id="ppSettingsReset">Reset Calculator</button>
        </div>
        <div class="pp-settings-note">Dark mode updates immediately. Press Apply Changes to save your other settings.</div>
        <button type="button" class="pp-settings-apply" id="ppSettingsApply">Apply Changes</button>
      </div>
    </section>`;
  document.body.appendChild(panel);
  if(!document.getElementById('reset')){
    const reset=panel.querySelector('#ppSettingsReset');reset.disabled=true;
    reset.closest('.pp-settings-card').querySelector('strong').nextElementSibling.textContent='Open Settings in the calculator to reset its inputs.';
    panel.querySelector('.pp-settings-head p').textContent='Manage your PrintProfit display and preferences.';
    panel.querySelector('.pp-settings-note').textContent='Dark mode updates immediately. Apply Changes saves your preferences across PrintProfit. Compare listings remain in GBP to match UK retailers.';
  }
  const applyBtn=document.getElementById('ppSettingsApply');
  if(applyBtn){
    applyBtn.addEventListener('click',(event)=>{
      event.preventDefault();
      event.stopPropagation();
      try{
        const apply=window.__applyPrintProfitSettings;
        if(typeof apply!=='function') throw new Error('Settings engine is not loaded');
        const ok=apply();
        if(ok!==false){
          applyBtn.textContent='Applied ✓';
          setTimeout(()=>closePanel('ppSettingsPanel'),250);
        }else{
          applyBtn.textContent='Apply Changes';
        }
      }catch(error){
        console.error('PrintProfit: settings apply failed',error);
        applyBtn.textContent='Apply Changes';
      }
    });
  }
  document.getElementById('ppSettingsReset')?.addEventListener('click',()=>{
    document.getElementById('reset')?.click();
    closePanel('ppSettingsPanel');
  });
  panel.querySelectorAll('[data-close-settings]').forEach(el=>el.addEventListener('click',()=>closePanel('ppSettingsPanel')));
  const style=document.createElement('style');
  style.id='ppSettingsStyles';
  style.textContent=`
    #ppSettingsPanel{position:fixed;inset:0;z-index:12000;display:none}
    #ppSettingsPanel.open{display:block}
    .pp-settings-backdrop{position:absolute;inset:0;background:rgba(0,0,0,.72);backdrop-filter:blur(6px)}
    .pp-settings-dialog{position:absolute;right:28px;top:74px;width:min(500px,calc(100vw - 32px));max-height:calc(100vh - 96px);border:1px solid #315261;border-radius:18px;background:linear-gradient(180deg,#0c202b,#07131b);box-shadow:0 28px 80px #000b,0 0 34px #ff780014;color:#f5f8fb;overflow:auto}
    .pp-settings-head{display:flex;align-items:center;justify-content:space-between;gap:16px;padding:14px 16px;border-bottom:1px solid #284553;position:sticky;top:0;background:rgba(9,24,33,.97);z-index:2}
    .pp-settings-brand{display:flex;align-items:center;gap:12px;min-width:0}
    .pp-settings-brand img{width:118px;height:56px;object-fit:contain;object-position:center;flex:0 0 118px;border-radius:9px;padding:0;box-sizing:border-box}
    .pp-settings-kicker{color:#ff7800;font-size:8px;font-weight:900;letter-spacing:.2em;margin-bottom:4px}
    .pp-settings-head h2{margin:0;font-size:21px}
    .pp-settings-head p{margin:4px 0 0;color:#8fa6b2;font-size:10px}
    .pp-settings-close{width:35px;height:35px;flex:0 0 35px;border:1px solid #355464;border-radius:9px;background:#091821;color:#dce7ec;font-size:22px;cursor:pointer}
    .pp-settings-close:hover{border-color:#ff7800;color:#fff}
    .pp-settings-body{padding:14px}
    .pp-settings-section-title{margin:4px 4px 8px;color:#ff7800;font-size:8px;font-weight:900;letter-spacing:.18em;text-transform:uppercase}
    .pp-settings-card{display:flex;align-items:center;justify-content:space-between;gap:14px;padding:13px;border:1px solid #284654;border-radius:12px;background:#081720;margin-bottom:9px}
    .pp-settings-card>div:first-child{min-width:0}
    .pp-settings-card strong{display:block;font-size:12px}
    .pp-settings-card span{display:block;margin-top:4px;color:#8fa6b2;font-size:10px;line-height:1.35}
    .pp-settings-select{width:150px!important;min-width:150px!important;background:#0d202b!important;color:#f5f8fb!important;border:1px solid #355464!important;border-radius:9px!important;padding:9px 10px!important;font:700 11px Inter,Segoe UI,system-ui,sans-serif!important}
    .pp-settings-select:focus{border-color:#ff7800!important;outline:none}
    .pp-settings-switch{display:block!important;position:relative;width:48px!important;height:26px!important;flex:0 0 48px}
    .pp-settings-switch input{position:absolute;opacity:0;width:1px!important;height:1px!important}
    .pp-settings-switch span{position:absolute!important;inset:0!important;border:1px solid #38515f;border-radius:999px;background:#12232d!important;display:block!important}
    .pp-settings-switch span:after{content:"";position:absolute;left:3px;top:3px;width:18px;height:18px;border-radius:50%;background:#8197a2;transition:.18s ease}
    .pp-settings-switch input:checked+span{background:linear-gradient(90deg,#19d8ff,#009FEF)!important;border-color:#19d8ff}
    .pp-settings-switch input:checked+span:after{left:25px;background:#f1f7fa}
    .pp-settings-rate{display:flex;align-items:center;gap:7px}
    .pp-settings-rate span{color:#8fa6b2!important;font-size:10px!important;white-space:nowrap}
    .pp-settings-rate input{width:105px!important;background:#0d202b!important;color:#f5f8fb!important;border:1px solid #355464!important;border-radius:9px!important;padding:9px 10px!important}
    .pp-settings-action{border:1px solid #ff7800;background:#ff7800;color:#fff;border-radius:9px;padding:9px 12px;font:800 11px Inter,Segoe UI,system-ui,sans-serif;cursor:pointer;white-space:nowrap}
    .pp-settings-action:hover{filter:brightness(1.08)}
    .pp-settings-apply{display:block;width:100%;margin:10px 0 2px;padding:12px 16px;border:1px solid #ff7800;border-radius:10px;background:linear-gradient(135deg,#ff9a42,#ff7800);color:#fff;font:800 12px Inter,Segoe UI,system-ui,sans-serif;cursor:pointer;box-shadow:0 8px 24px #ff780022}
    .pp-settings-apply:hover{filter:brightness(1.07);box-shadow:0 10px 28px #ff780033}
    .pp-settings-note{padding:4px;color:#718a98;font-size:9px;line-height:1.4}
    @media(max-width:650px){
      .pp-settings-dialog{left:10px;right:10px;top:10px;width:auto;max-height:calc(100vh - 20px)}
      .pp-settings-head{padding:12px}
      .pp-settings-brand img{width:68px;height:50px;flex-basis:68px}
      .pp-settings-card{align-items:flex-start;flex-direction:column}
      .pp-settings-select,.pp-settings-action{width:100%!important}
      .pp-settings-rate{width:100%}
      .pp-settings-rate input{flex:1;width:auto!important}
    }
  `;
  document.head.appendChild(style);
  showPanel(panel);
  document.dispatchEvent(new CustomEvent('printprofit-settings-open'));
}
window.__openPrintProfitSettings=openSettings;
window.__openPrintProfitGuide=openGuide;

const panelStyle=document.createElement('style');
panelStyle.id='ppSharedPanelPolish';
panelStyle.textContent=`
#ppSettingsPanel,#ppGuidePanel{font-family:Inter,Segoe UI,system-ui,sans-serif;line-height:1.5}
#ppSettingsPanel .pp-settings-dialog{left:50%;right:auto;transform:translateX(-50%);width:min(620px,calc(100vw - 24px));overscroll-behavior:contain}
#ppGuidePanel .pp-guide-dialog{width:min(960px,calc(100vw - 24px));overscroll-behavior:contain}
#ppSettingsPanel .pp-settings-head h2,#ppGuidePanel .pp-guide-head h2{font-size:24px}
#ppSettingsPanel .pp-settings-head p,#ppGuidePanel .pp-guide-head p{font-size:13px;color:#b6c7d1}
#ppSettingsPanel .pp-settings-card{display:grid;grid-template-columns:36px minmax(0,1fr) 180px;gap:12px;align-items:center}
#ppSettingsPanel .pp-settings-icon{display:block;width:36px;height:36px;margin:0}
#ppSettingsPanel .pp-settings-icon svg{width:36px;height:36px;fill:none;stroke:#53c9ed;stroke-width:2}
#ppSettingsPanel .pp-settings-card strong{font-size:14px}
#ppSettingsPanel .pp-settings-card span{font-size:12px;color:#b6c7d1}
#ppSettingsPanel .pp-settings-select{width:180px!important;min-width:0!important;font-size:13px!important;max-width:100%}
#ppSettingsPanel .pp-settings-switch{justify-self:end;margin:0}
#ppSettingsPanel .pp-settings-action:disabled{opacity:.5;cursor:not-allowed}
#ppSettingsPanel .pp-settings-note{font-size:12px;color:#b6c7d1}
#ppSettingsPanel .pp-settings-section-title,#ppGuidePanel .pp-guide-section-title{font-size:11px;letter-spacing:.06em}
#ppGuidePanel .pp-guide-intro{margin-top:14px}
#ppGuidePanel .pp-guide-intro strong,#ppGuidePanel .pp-guide-grid h3{font-size:15px}
#ppGuidePanel .pp-guide-intro span,#ppGuidePanel .pp-guide-grid p,#ppGuidePanel .pp-guide-section p,#ppGuidePanel .pp-guide-note{font-size:14px;line-height:1.65;color:#bdcdd6}
#ppGuidePanel .pp-guide-section p+p{margin-top:10px}
#ppSettingsPanel .pp-settings-close,#ppGuidePanel .pp-guide-close{min-width:40px;min-height:40px}
body:is(.pp-light,[data-pp-theme="light"]) :is(.pp-settings-dialog,.pp-guide-dialog){background:#f7fafc!important;color:#172b35!important}
body:is(.pp-light,[data-pp-theme="light"]) :is(.pp-settings-head,.pp-guide-head,.pp-settings-card,.pp-guide-grid article,.pp-guide-section,.pp-guide-intro,.pp-guide-note){background:#fff!important;border-color:#b8cbd4!important;color:#172b35!important}
body:is(.pp-light,[data-pp-theme="light"]) :is(#ppSettingsPanel,#ppGuidePanel) :is(p,span,.pp-settings-note,.pp-guide-note){color:#435e6d!important}
body:is(.pp-light,[data-pp-theme="light"]) :is(#ppSettingsPanel,#ppGuidePanel) :is(strong,h2,h3){color:#172b35!important}
body:is(.pp-light,[data-pp-theme="light"]) #ppSettingsPanel :is(select,input[type="number"]){background:#fff!important;color:#172b35!important;border-color:#9eb6c3!important}
@media(max-width:600px){
 #ppSettingsPanel .pp-settings-card{grid-template-columns:36px minmax(0,1fr);gap:8px 12px}
 #ppSettingsPanel .pp-settings-icon{grid-column:1;grid-row:1 / span 2}
 #ppSettingsPanel .pp-settings-card>div:not(.pp-settings-rate){grid-column:2}
 #ppSettingsPanel .pp-settings-card>:last-child{grid-column:2;justify-self:stretch;width:100%!important}
 #ppSettingsPanel .pp-settings-card>.pp-settings-switch{width:48px!important;justify-self:start}
 #ppSettingsPanel .pp-settings-select{width:100%!important}
 #ppSettingsPanel .pp-settings-rate input{min-width:0;max-width:100%}
}
`;
document.head.appendChild(panelStyle);

function closePanel(id){
  const panel=document.getElementById(id);
  if(!panel||!panel.classList.contains('open'))return;
  panel.classList.remove('open');
  if(!document.querySelector('#ppSettingsPanel.open,#ppGuidePanel.open')){
    document.body.style.overflow=bodyOverflow||'';bodyOverflow=undefined;
    try{if(window.parent!==window&&parentOverflow!==undefined){window.parent.document.body.style.overflow=parentOverflow;delete window.parent.document.body.dataset.ppModalOpen;parentOverflow=undefined;}}catch(e){}
  }
  panelOpeners.get(id)?.focus?.({preventScroll:true});
  panelOpeners.delete(id);
}

function openGuide(){
  let panel=document.getElementById('ppGuidePanel');
  if(!panel){
    panel=document.createElement('div');
    panel.id='ppGuidePanel';
    panel.innerHTML=`
      <div class="pp-guide-backdrop" data-close-guide></div>
      <section class="pp-guide-dialog" role="dialog" aria-modal="true" aria-labelledby="ppGuideTitle">
        <div class="pp-guide-head">
          <div class="pp-guide-brand">
            <img src="./assets/printprofit-logo-orange.svg?v=5" alt="PrintProfit">
            <div><div class="pp-guide-kicker">PRINTPROFIT</div><h2 id="ppGuideTitle">Guide &amp; Help</h2><p>Help with the calculator, your workspace and product comparisons.</p></div>
          </div>
          <button type="button" class="pp-guide-close" aria-label="Close guide" data-close-guide>×</button>
        </div>
        <div class="pp-guide-body">
          <div class="pp-guide-section" id="ppGuideCompare">
            <div class="pp-guide-section-title">Compare Products</div>
            <p>Search for a product, filter by category, brand or retailer, and sort the matching listings. Tick products to keep them selected while you change filters, then choose <strong>Compare selected</strong>. <strong>Save list</strong> stores your selection on this device. Narrow screens start in <strong>Cards</strong>; you can switch between Table and Cards at any time.</p>
            <p>Prices and stock are snapshots in GBP. Check the retailer for its final price, delivery and availability. Purchases, payments, returns and refunds are handled by that retailer. Some links earn PrintProfit an affiliate commission at no extra cost to you.</p>
          </div>
          <div class="pp-guide-intro">
            <strong>PrintProfit turns your real printing costs into a practical selling price.</strong>
            <span>Work through Your Model, Print Setup and Costs &amp; Fees from top to bottom. Optional fields can remain at zero when they do not apply.</span>
          </div>
          <div class="pp-guide-grid">
            <article><div class="pp-guide-num">1</div><div><h3>Your Model</h3><p>Upload a supported model or print file. Available metadata can fill in print time and material usage. You can also enter those values yourself.</p></div></article>
            <article><div class="pp-guide-num">2</div><div><h3>Print Setup</h3><p>Choose your printer and material together. Supported resin printers automatically switch the calculator to resin mode; custom printers keep the material-type choice available.</p></div></article>
            <article><div class="pp-guide-num">3</div><div><h3>Costs &amp; Fees</h3><p>Add operating costs, selling and fulfilment details, quantity and any batch discount. Quantity above one automatically switches the results view to Batch Pricing.</p></div></article>
            <article><div class="pp-guide-num">4</div><div><h3>Results</h3><p>Review cost to make, selling price, fees, profit and margin. Target-pricing options can calculate a selling price from the margin you want to achieve.</p></div></article>
          </div>
          <div class="pp-guide-section">
            <div class="pp-guide-section-title">My Projects &amp; My Materials</div>
            <p><strong>My Projects</strong> saves complete calculator setups so they can be loaded, duplicated or deleted. <strong>My Materials</strong> stores reusable filament and resin profiles and can populate the calculator when a saved material is used.</p>
          </div>
          <div class="pp-guide-section">
            <div class="pp-guide-section-title">Basic &amp; Pro</div>
            <p>The calculator, file analysis, comparison tools, manual inventory, local project saves and backup files are free. Pro adds cloud saving across devices, scanning, stock alerts, confirmed-print deductions, multi-printer runs and business tools. Pro is £2.50/month or £24/year, with a seven-day trial on your first subscription. Uploaded model files stay on their original device.</p>
          </div>
          <div class="pp-guide-section">
            <div class="pp-guide-section-title">Understanding the result</div>
            <p><strong>Total Cost to Make</strong> is the estimated production cost. <strong>Selling Price</strong> is the amount entered or generated from a target margin. <strong>Profit</strong> is what remains after included costs and fees. <strong>Margin</strong> expresses profit as a percentage of selling price.</p>
          </div>
          <div class="pp-guide-section">
            <div class="pp-guide-section-title">Profit Toolkit</div>
            <p><strong>What If?</strong> lets you test lower material usage, faster print settings, saved labour time, cheaper packaging or delivery, or a different selling platform without changing the live calculation. <strong>Cost Breakdown</strong> shows where the current cost is going. <strong>Price Ladder</strong> shows break-even and target margins. <strong>Bulk Buy</strong> estimates material and packaging savings. <strong>Sell Where?</strong> compares configured platform fees at your current price. The Results heading also shows a calculated Profit, Break-even or Loss status.</p>
          </div>
          <div class="pp-guide-section">
            <div class="pp-guide-section-title">Saved calculator setup</div>
            <p>Your current calculator fields are saved automatically on this device while you work, so moving to Guide &amp; Help and returning to the calculator can restore your setup. Reset intentionally clears the saved draft.</p>
          </div>
          <div class="pp-guide-section">
            <div class="pp-guide-section-title">Settings</div>
            <p>Settings controls dark mode, the available languages, metric or imperial units, currency, exchange rate and calculator reset.</p>
          </div>
          <div class="pp-guide-section">
            <div class="pp-guide-section-title">Information &amp; help</div>
            <p>Outputs are estimates and depend on the figures entered. Printer power, lifetime, material prices, platform fees and delivery charges can vary, so replace pre-filled assumptions with your own actual costs whenever possible.</p>
          </div>
          <div class="pp-guide-note">Tip: use your actual material cost, actual material usage, real electricity tariff, measured or published printer power where available, real labour time and the fees charged by the platform you sell through.</div>
        </div>
      </section>`;
    document.body.appendChild(panel);
    panel.querySelectorAll('[data-close-guide]').forEach(el=>el.addEventListener('click',()=>closePanel('ppGuidePanel')));
    panel.querySelector('.pp-guide-close')?.addEventListener('click',()=>closePanel('ppGuidePanel'));
    const style=document.createElement('style');
    style.id='ppGuideStyles';
    style.textContent=`
      #ppGuidePanel{position:fixed;inset:0;z-index:12100;display:none}
      #ppGuidePanel.open{display:block}
      .pp-guide-backdrop{position:absolute;inset:0;background:rgba(0,0,0,.72);backdrop-filter:blur(6px)}
      .pp-guide-dialog{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);width:min(900px,calc(100vw - 32px));max-height:calc(100vh - 40px);border:1px solid #315261;border-radius:18px;background:linear-gradient(180deg,#0c202b,#07131b);box-shadow:0 28px 90px #000b,0 0 34px #ff780014;color:#f5f8fb;overflow:auto}
      .pp-guide-head{display:flex;align-items:center;justify-content:space-between;gap:16px;padding:15px 18px;border-bottom:1px solid #284553;position:sticky;top:0;background:rgba(9,24,33,.97);z-index:2}
      .pp-guide-brand{display:flex;align-items:center;gap:13px;min-width:0}
      .pp-guide-brand img{width:132px;height:56px;object-fit:contain;flex:0 0 132px;border-radius:9px;background:transparent;padding:3px 6px;box-sizing:border-box}
      .pp-guide-kicker{color:#ff7800;font-size:8px;font-weight:900;letter-spacing:.2em;margin-bottom:4px}
      .pp-guide-head h2{margin:0;font-size:22px}.pp-guide-head p{margin:4px 0 0;color:#8fa6b2;font-size:10px}
      .pp-guide-close{width:36px;height:36px;flex:0 0 36px;border:1px solid #355464;border-radius:9px;background:#091821;color:#dce7ec;font-size:22px;cursor:pointer}
      .pp-guide-close:hover{border-color:#ff7800;color:#fff}
      .pp-guide-body{padding:18px}
      .pp-guide-intro{border:1px solid #365765;border-radius:12px;padding:13px;background:#091a24;margin-bottom:15px}
      .pp-guide-intro strong{display:block;font-size:13px}.pp-guide-intro span{display:block;margin-top:5px;color:#8fa6b2;font-size:10px;line-height:1.45}
      .pp-guide-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px}
      .pp-guide-grid article{display:flex;gap:11px;border:1px solid #284654;border-radius:12px;padding:12px;background:#081720}
      .pp-guide-num{width:28px;height:28px;flex:0 0 28px;border-radius:8px;background:#ff7800;color:#fff;display:grid;place-items:center;font-weight:900;font-size:12px}
      .pp-guide-grid h3{margin:1px 0 4px;font-size:12px}.pp-guide-grid p,.pp-guide-section p{margin:0;color:#9db0ba;font-size:10px;line-height:1.5}
      .pp-guide-section{border:1px solid #284654;border-radius:12px;padding:13px;background:#081720;margin-top:10px}
      .pp-guide-section-title{color:#ff7800;font-size:8px;font-weight:900;letter-spacing:.18em;text-transform:uppercase;margin-bottom:7px}
      .pp-guide-note{margin-top:12px;padding:11px 12px;border-left:3px solid #ff7800;background:#0a1d27;color:#9db0ba;font-size:9.5px;line-height:1.5}
      @media(max-width:700px){.pp-guide-dialog{width:calc(100vw - 18px);max-height:calc(100vh - 18px)}.pp-guide-grid{grid-template-columns:1fr}.pp-guide-head{padding:12px}.pp-guide-brand img{width:68px;height:50px;flex-basis:68px}.pp-guide-body{padding:12px}}
    `;
    document.head.appendChild(style);
  }
  showPanel(panel);
}



})();


