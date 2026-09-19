(()=>{
'use strict';
if(window.__printProfitCleanTop)return;window.__printProfitCleanTop=true;

function install(){
  const body=document.body;
  if(!body)return false;
  if(document.getElementById('ppCleanTop'))return true;

  // Remove the legacy top layers only. The calculator itself is left untouched.
  body.querySelectorAll('.header,.hero').forEach(el=>el.remove());

  const top=document.createElement('section');
  top.id='ppCleanTop';
  top.setAttribute('aria-label','PrintProfit introduction');
  top.innerHTML=`
    <div class="pp-top-grid"></div>
    <div class="pp-top-nav">
      <a class="pp-top-brand" href="#home" aria-label="PrintProfit home">
        <img src="./assets/user-selected-printprofit-logo.webp?v=1" alt="PrintProfit">
      </a>
      <nav class="pp-top-links" aria-label="Main navigation">
        <button type="button" data-target="details"><span class="pp-nav-icon calculator"></span><span>Calculate</span></button>
        <button type="button" data-target="machine"><span class="pp-nav-icon cube"></span><span>Price</span></button>
        <button type="button" data-target="costs"><span class="pp-nav-icon chart"></span><span>Profit</span></button>
        <button type="button" data-target="settings"><span class="pp-nav-icon gear"></span><span>Settings</span></button>
      </nav>
    </div>
    <div class="pp-top-body">
      <div class="pp-top-copy">
        <div class="pp-eyebrow">3D PRINTING PRICING, MADE SIMPLE</div>
        <h1>Know what it costs.<br><strong>Know what to charge.</strong></h1>
        <p>Accurate 3D printing cost and pricing calculations to help you<br class="pp-desktop"> price with confidence and maximise your profit.</p>
        <div class="pp-top-actions">
          <button class="pp-primary" type="button" data-target="details"><span class="pp-mini-icon calculator"></span>Start Calculating <b>›</b></button>
          <button class="pp-secondary" type="button" data-target="details">Learn More <b>›</b></button>
        </div>
        <div class="pp-feature-strip">
          <div><span class="pp-feature-icon calculator"></span><span>Calculate<small>Costs</small></span></div>
          <i></i>
          <div><span class="pp-feature-icon cube"></span><span>Price<small>Your Prints</small></span></div>
          <i></i>
          <div><span class="pp-feature-icon chart"></span><span>Maximise<small>Profit</small></span></div>
          <i></i>
          <div><span class="pp-feature-icon gear"></span><span>Built<small>For Makers</small></span></div>
        </div>
      </div>
      <div class="pp-top-card">
        <img src="./assets/user-selected-printprofit-logo.webp?v=1" alt="PrintProfit 3D Printing Cost & Pricing Calculator">
        <div class="pp-card-tagline">Print Smarter.<br>Price Better.<br>Profit More.</div>
      </div>
    </div>
    <div class="pp-top-line"></div>
  `;

  const shell=body.querySelector('.shell');
  body.insertBefore(top,shell||body.firstChild);

  const style=document.createElement('style');
  style.id='ppCleanTopStyles';
  style.textContent=`
    #ppCleanTop{position:relative;width:100%;min-height:367px;overflow:hidden;background:#07141d;color:#f5f8fb;border-bottom:1px solid #294653;font-family:Inter,Segoe UI,system-ui,sans-serif}
    #ppCleanTop .pp-top-grid{position:absolute;inset:0;opacity:.45;background-image:linear-gradient(rgba(62,105,122,.16) 1px,transparent 1px),linear-gradient(90deg,rgba(62,105,122,.16) 1px,transparent 1px);background-size:62px 62px;background-position:28px 0;pointer-events:none}
    #ppCleanTop .pp-top-grid:after{content:"";position:absolute;inset:0;background:radial-gradient(circle at 76% 48%,rgba(0,129,184,.12),transparent 32%),linear-gradient(90deg,rgba(7,20,29,.12),rgba(7,20,29,.72) 63%,rgba(7,20,29,.16))}
    #ppCleanTop .pp-top-nav{position:relative;z-index:3;height:60px;display:flex;align-items:center;padding:0 3.1%;border-bottom:1px solid #294653;background:rgba(5,15,22,.58);box-sizing:border-box}
    #ppCleanTop .pp-top-brand{display:flex;align-items:center;justify-content:flex-start;width:170px;height:60px;overflow:visible;text-decoration:none}
    #ppCleanTop .pp-top-brand img{width:102px;height:58px;object-fit:contain;object-position:center;display:block;transform:none;border-radius:7px}
    #ppCleanTop .pp-top-links{margin-left:auto;display:flex;align-items:center;gap:10px}
    #ppCleanTop .pp-top-links button{border:0;background:transparent;color:#dce5eb;font:600 13px/1 Inter,Segoe UI,system-ui,sans-serif;padding:7px 10px;display:flex;align-items:center;gap:9px;cursor:pointer;border-radius:9px;transition:.18s ease}
    #ppCleanTop .pp-top-links button:hover{color:#fff;background:#ff780012}
    #ppCleanTop .pp-nav-icon,#ppCleanTop .pp-feature-icon,#ppCleanTop .pp-mini-icon{position:relative;display:inline-block;flex:0 0 auto;color:#ff7800}
    #ppCleanTop .pp-nav-icon{width:25px;height:25px}
    #ppCleanTop .pp-feature-icon{width:24px;height:24px}
    #ppCleanTop .pp-mini-icon{width:17px;height:19px}
    #ppCleanTop .calculator:before{content:"";position:absolute;inset:1px 3px 0;border:2px solid currentColor;border-radius:3px}
    #ppCleanTop .calculator:after{content:"";position:absolute;width:3px;height:3px;left:8px;top:7px;background:currentColor;box-shadow:6px 0 currentColor,0 6px currentColor,6px 6px currentColor,0 12px currentColor,6px 12px currentColor}
    #ppCleanTop .cube:before{content:"";position:absolute;width:16px;height:16px;left:4px;top:4px;border:2px solid currentColor;transform:rotate(30deg) skewY(-3deg);border-radius:1px}
    #ppCleanTop .cube:after{content:"";position:absolute;left:8px;top:2px;width:9px;height:20px;border-left:2px solid currentColor;border-right:2px solid transparent;transform:rotate(30deg);opacity:.9}
    #ppCleanTop .chart:before{content:"";position:absolute;inset:3px 2px 2px;border-left:2px solid currentColor;border-bottom:2px solid currentColor}
    #ppCleanTop .chart:after{content:"";position:absolute;left:7px;bottom:5px;width:3px;height:8px;background:currentColor;box-shadow:6px -5px currentColor,12px -11px currentColor}
    #ppCleanTop .gear:before{content:"⚙";position:absolute;inset:-3px 0 0;font:30px/1 Arial,sans-serif;color:currentColor}
    #ppCleanTop .pp-top-body{position:relative;z-index:2;display:grid;grid-template-columns:minmax(0,1fr) 425px;gap:42px;align-items:stretch;padding:10px 3.1% 9px;box-sizing:border-box;min-height:306px}
    #ppCleanTop .pp-top-copy{padding-top:15px;min-width:0}
    #ppCleanTop .pp-eyebrow{font-size:12px;font-weight:900;letter-spacing:.19em;color:#ff7800;margin-bottom:8px}
    #ppCleanTop h1{font-size:48px;line-height:.94;letter-spacing:-.035em;margin:0 0 12px;font-weight:900;color:#f6f8fa;text-shadow:0 2px 18px #0008}
    #ppCleanTop h1 strong{color:#ff7800;font-weight:900}
    #ppCleanTop .pp-top-copy>p{margin:0;color:#b8c7d0;font-size:16px;line-height:1.35;font-weight:500}
    #ppCleanTop .pp-top-actions{display:flex;gap:13px;margin-top:17px}
    #ppCleanTop .pp-top-actions button{font:800 13px/1 Inter,Segoe UI,system-ui,sans-serif;cursor:pointer;border-radius:7px;height:40px;padding:0 15px;display:flex;align-items:center;gap:8px;transition:.18s ease}
    #ppCleanTop .pp-primary{border:1px solid #ff7800;background:#ff7800;color:#fff;box-shadow:0 8px 20px #ff780033}
    #ppCleanTop .pp-primary:hover{filter:brightness(1.08);transform:translateY(-1px)}
    #ppCleanTop .pp-primary b,#ppCleanTop .pp-secondary b{font-size:20px;line-height:0;font-weight:500}
    #ppCleanTop .pp-secondary{border:1px solid #355363;background:#091923;color:#e3ebef}
    #ppCleanTop .pp-secondary:hover{border-color:#ff7800;color:#fff}
    #ppCleanTop .pp-feature-strip{display:flex;align-items:center;gap:15px;margin-top:12px;min-height:42px}
    #ppCleanTop .pp-feature-strip>div{display:flex;align-items:center;gap:8px;color:#eef3f5;font-size:10px;font-weight:800;line-height:1.05;min-width:74px}
    #ppCleanTop .pp-feature-strip small{display:block;color:#c0ccd3;font-size:9px;font-weight:500;margin-top:3px}
    #ppCleanTop .pp-feature-strip i{height:32px;width:1px;background:#34505d;display:block}
    #ppCleanTop .pp-top-card{width:425px;height:285px;align-self:start;margin-top:0;border:1px solid #294957;border-radius:24px;background:linear-gradient(145deg,#0b202b,#07141d);box-shadow:inset 0 1px 0 #ffffff0c,0 18px 40px #0008;display:flex;flex-direction:column;align-items:center;justify-content:flex-start;overflow:hidden;position:relative}
    #ppCleanTop .pp-top-card:after{content:"";position:absolute;inset:0;background:radial-gradient(circle at 50% 20%,#ff780012,transparent 45%);pointer-events:none}
    #ppCleanTop .pp-top-card img{position:relative;z-index:1;width:325px;height:190px;object-fit:contain;object-position:center;display:block;margin-top:9px}
    #ppCleanTop .pp-card-tagline{position:relative;z-index:2;margin-top:-2px;color:#ff7800;text-align:right;width:305px;font-size:21px;line-height:.9;font-family:"Brush Script MT","Segoe Script",cursive;font-style:italic;transform:rotate(-2deg);text-shadow:0 2px 12px #000}
    #ppCleanTop .pp-top-line{position:absolute;left:0;right:0;bottom:0;height:2px;background:#ff7800;box-shadow:0 0 14px #ff780055}
    @media(max-width:1050px){#ppCleanTop .pp-top-body{grid-template-columns:minmax(0,1fr) 350px;gap:22px}#ppCleanTop .pp-top-card{width:350px}#ppCleanTop .pp-top-card img{width:285px}#ppCleanTop h1{font-size:42px}}
    @media(max-width:800px){#ppCleanTop{min-height:0}#ppCleanTop .pp-top-nav{height:auto;min-height:62px;padding:5px 14px;flex-wrap:wrap}#ppCleanTop .pp-top-brand{width:150px}#ppCleanTop .pp-top-brand img{width:92px}#ppCleanTop .pp-top-links{width:100%;margin:0;justify-content:space-between;overflow:auto}#ppCleanTop .pp-top-links button{padding:6px 8px;font-size:11px}#ppCleanTop .pp-top-body{grid-template-columns:1fr;padding:16px 18px 20px}#ppCleanTop .pp-top-card{width:100%;max-width:425px;justify-self:center}#ppCleanTop h1{font-size:38px}.pp-desktop{display:none}}
    @media(max-width:520px){#ppCleanTop h1{font-size:32px}.pp-eyebrow{font-size:9px!important}.pp-top-copy>p{font-size:14px!important}.pp-feature-strip{gap:8px!important}.pp-feature-strip>div{min-width:0!important}.pp-feature-strip i{display:none!important}#ppCleanTop .pp-top-card{height:255px}#ppCleanTop .pp-top-card img{width:270px;height:170px}.pp-card-tagline{font-size:18px!important;width:250px!important}
#ppCleanTop .pp-top-brand img{width:84px;height:54px}}
  `;
  document.head.appendChild(style);

  function openSettings(){
    if(document.getElementById('ppSettingsPanel')){
      document.getElementById('ppSettingsPanel').classList.add('open');
      return;
    }
    const panel=document.createElement('div');
    panel.id='ppSettingsPanel';
    panel.innerHTML=`
      <div class="pp-settings-backdrop" data-close-settings></div>
      <section class="pp-settings-dialog" role="dialog" aria-modal="true" aria-labelledby="ppSettingsTitle">
        <div class="pp-settings-head">
          <div class="pp-settings-brand">
            <img src="./assets/user-selected-printprofit-logo.webp?v=2" alt="PrintProfit">
            <div><div class="pp-settings-kicker">PRINTPROFIT</div><h2 id="ppSettingsTitle">Settings</h2><p>Manage the calculator display and preferences.</p></div>
          </div>
          <button type="button" class="pp-settings-close" aria-label="Close settings" data-close-settings>×</button>
        </div>
        <div class="pp-settings-body">
          <div class="pp-settings-section-title">Appearance</div>
          <div class="pp-settings-card">
            <div><strong>Dark mode</strong><span>Use the dark PrintProfit interface.</span></div>
            <label class="pp-settings-switch"><input id="ppSettingsDark" type="checkbox" role="switch" checked><span></span></label>
          </div>

          <div class="pp-settings-section-title">Language &amp; region</div>
          <div class="pp-settings-card">
            <div><strong>Language</strong><span>Choose the language used across the page.</span></div>
            <select id="ppSettingsLanguage" class="pp-settings-select" aria-label="Language">
              <option value="en">English</option>
              <option value="pl">Polski</option>
            </select>
          </div>
          <div class="pp-settings-card">
            <div><strong>Units</strong><span>Choose metric or imperial measurements.</span></div>
            <select id="ppSettingsUnits" class="pp-settings-select" aria-label="Units">
              <option value="metric">Metric (g / ml)</option>
              <option value="imperial">Imperial (oz / fl oz)</option>
            </select>
          </div>
          <div class="pp-settings-card">
            <div><strong>Currency</strong><span>Choose the currency used for costs and prices.</span></div>
            <select id="ppSettingsCurrency" class="pp-settings-select" aria-label="Currency">
              <option value="GBP">GBP (£)</option>
              <option value="EUR">EUR (€)</option>
              <option value="USD">USD ($)</option>
              <option value="PLN">PLN (zł)</option>
            </select>
          </div>
          <div class="pp-settings-card">
            <div><strong>Exchange rate</strong><span>Update the conversion used when displaying non-GBP currencies.</span></div>
            <div class="pp-settings-rate"><span>1 GBP =</span><input id="ppSettingsRate" type="number" min="0.000001" step="0.0001" value="1"></div>
          </div>

          <div class="pp-settings-section-title">Calculator</div>
          <div class="pp-settings-card">
            <div><strong>Calculator reset</strong><span>Clear the current calculator inputs and return pricing to £0.</span></div>
            <button type="button" class="pp-settings-action" id="ppSettingsReset">Reset Calculator</button>
          </div>
          <div class="pp-settings-note">Preferences are saved automatically on this device.</div>
        </div>
      </section>`;
    document.body.appendChild(panel);
    document.getElementById('ppSettingsReset')?.addEventListener('click',()=>{
      document.getElementById('reset')?.click();
      panel.classList.remove('open');
    });
    panel.querySelectorAll('[data-close-settings]').forEach(el=>el.addEventListener('click',()=>panel.classList.remove('open')));
    document.addEventListener('keydown',event=>{
      if(event.key==='Escape')panel.classList.remove('open');
    });
    const style=document.createElement('style');
    style.id='ppSettingsStyles';
    style.textContent=`
      #ppSettingsPanel{position:fixed;inset:0;z-index:12000;display:none}
      #ppSettingsPanel.open{display:block}
      .pp-settings-backdrop{position:absolute;inset:0;background:rgba(0,0,0,.68);backdrop-filter:blur(5px)}
      .pp-settings-dialog{position:absolute;right:28px;top:78px;width:min(440px,calc(100vw     const style=document.createElement('style');
    style.id='ppSettingsStyles';
    style.textContent=`
      #ppSettingsPanel{position:fixed;inset:0;z-index:12000;display:none}
      #ppSettingsPanel.open{display:block}
      .pp-settings-backdrop{position:absolute;inset:0;background:rgba(0,0,0,.70);backdrop-filter:blur(6px)}
      .pp-settings-dialog{position:absolute;right:28px;top:74px;width:min(500px,calc(100vw - 32px));max-height:calc(100vh - 96px);border:1px solid #315261;border-radius:18px;background:linear-gradient(180deg,#0c202b,#07131b);box-shadow:0 28px 80px #000b,0 0 34px #ff780014;color:#f5f8fb;overflow:auto}
      .pp-settings-head{display:flex;align-items:center;justify-content:space-between;gap:16px;padding:14px 16px;border-bottom:1px solid #284553;position:sticky;top:0;background:rgba(9,24,33,.97);z-index:2}
      .pp-settings-brand{display:flex;align-items:center;gap:12px;min-width:0}
      .pp-settings-brand img{width:78px;height:56px;object-fit:contain;object-position:center;flex:0 0 78px;border-radius:9px}
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
      .pp-settings-switch input:checked+span{background:#ff780022!important;border-color:#ff7800}
      .pp-settings-switch input:checked+span:after{left:25px;background:#ff7800}
      .pp-settings-rate{display:flex;align-items:center;gap:7px}.pp-settings-rate span{color:#8fa6b2!important;font-size:10px!important;white-space:nowrap}.pp-settings-rate input{width:105px!important;background:#0d202b!important;color:#f5f8fb!important;border:1px solid #355464!important;border-radius:9px!important;padding:9px 10px!important}
      .pp-settings-action{border:1px solid #ff7800;background:#ff7800;color:#fff;border-radius:9px;padding:9px 12px;font:800 11px Inter,Segoe UI,system-ui,sans-serif;cursor:pointer;white-space:nowrap}
      .pp-settings-action:hover{filter:brightness(1.08)}
      .pp-settings-note{padding:4px;color:#718a98;font-size:9px;line-height:1.4}
      @media(max-width:650px){.pp-settings-dialog{left:10px;right:10px;top:10px;width:auto;max-height:calc(100vh - 20px)}.pp-settings-head{padding:12px}.pp-settings-brand img{width:68px;height:50px;flex-basis:68px}.pp-settings-card{align-items:flex-start;flex-direction:column}.pp-settings-select,.pp-settings-action{width:100%!important}.pp-settings-rate{width:100%}.pp-settings-rate input{flex:1;width:auto!important}}
    `;
    document.head.appendChild(style);
    panel.classList.add('open');
  }

  const go=(target)=>{
    if(target==='settings'){openSettings();return;}
    const tab=document.querySelector('.pp-step[data-tab="'+target+'"]');
    if(tab){tab.click();return;}
    const el=document.getElementById(target);
    if(el)el.scrollIntoView({behavior:'smooth',block:'start'});
  };
  // Settings must behave as a true modal trigger. Stop any legacy tab/anchor handlers
  // from treating it like a section link and moving the calculator viewport.
  top.querySelectorAll('[data-target="settings"]').forEach(el=>{
    el.addEventListener('click',(event)=>{
      event.preventDefault();
      event.stopPropagation();
      if(event.stopImmediatePropagation)event.stopImmediatePropagation();
      openSettings();
    },true);
  });
  top.querySelectorAll('[data-target]:not([data-target="settings"])').forEach(el=>el.addEventListener('click',()=>go(el.dataset.target)));
  return true;
}

function boot(){
  if(install())return;
  const started=Date.now();
  const timer=setInterval(()=>{if(install()||Date.now()-started>15000)clearInterval(timer)},50);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
