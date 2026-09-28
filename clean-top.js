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
        <span class="pp-inline-logo" aria-label="PrintProfit"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 420" role="img" aria-labelledby="title desc">
<title id="title">PrintProfit master orange logo</title>
<desc id="desc">PrintProfit logo with a clean scales and monogram mark, silver white lettering, and orange accents.</desc>
<defs>
 <linearGradient id="silver" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="#c8d0d5"/></linearGradient>
 <linearGradient id="orange" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ff9b42"/><stop offset="1" stop-color="#ff7800"/></linearGradient>
 <filter id="shadow" x="-30%" y="-30%" width="160%" height="160%"><feDropShadow dx="0" dy="10" stdDeviation="10" flood-color="#000000" flood-opacity=".45"/></filter>
</defs>
<g filter="url(#shadow)">
  <g stroke-linecap="round" stroke-linejoin="round">
    <rect x="255" y="28" width="90" height="60" rx="9" fill="url(#orange)"/>
    <path d="M245 50H160q-12 0-12 10t12 10h85" fill="none" stroke="url(#orange)" stroke-width="14"/>
    <path d="M355 50h85q12 0 12 10t-12 10h-85" fill="none" stroke="url(#orange)" stroke-width="14"/>
    <path d="M275 88v26M325 88v26M300 112v142" fill="none" stroke="url(#orange)" stroke-width="14"/>
    <path d="M260 254h80q11 0 11 11t-11 11h-80q-11 0-11-11t11-11Z" fill="url(#orange)"/>
    <path d="M175 120h80q12 0 19 10l26 0M425 120h-80q-12 0-19 10l-26 0" fill="none" stroke="url(#orange)" stroke-width="10"/>
    <path d="M255 130l-46 76M345 130l46 76" fill="none" stroke="url(#orange)" stroke-width="10"/>
    <path d="M209 206h-62M391 206h62" fill="none" stroke="url(#orange)" stroke-width="10"/>
    <path d="M147 206c5 30 26 48 55 48s50-18 55-48Z" fill="url(#orange)"/>
    <path d="M337 206c5 30 26 48 55 48s50-18 55-48Z" fill="url(#orange)"/>
  </g>
  <path d="M275 126h50v24h-26v22h21v25h-21v45h-24Z" fill="url(#silver)"/>
  <path d="M325 126h29c25 0 42 13 42 35s-17 36-42 36h-5v45h-24Zm24 24v22h5c9 0 16-4 16-11s-7-11-16-11Z" fill="url(#silver)"/>
</g>
<g font-family="Inter,Segoe UI,Arial,sans-serif" font-weight="900" letter-spacing="-4">
 <text x="475" y="210" font-size="112" fill="url(#silver)">Print</text>
 <text x="705" y="210" font-size="112" fill="url(#orange)">Profit</text>
</g>
<text x="478" y="257" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="22" font-weight="800" letter-spacing="5" fill="#d7dfe3">3D PRINTING COST &amp; PRICING CALCULATOR</text>
<text x="478" y="316" font-family="cursive" font-size="36" fill="url(#orange)">Print Smarter. Price Better. Profit More.</text>
</svg></span>
      </a>
      <nav class="pp-top-links" aria-label="Main navigation">
        <button type="button" data-target="details"><span class="pp-nav-icon calculator"></span><span>Calculate</span></button>
        <button type="button" data-target="priceFinder"><span class="pp-nav-icon cube"></span><span>Compare Products</span></button>
        <button type="button" data-target="guide"><span class="pp-nav-icon book"></span><span>Guide &amp; Help</span></button>
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
          <button class="pp-projects-button" type="button" data-target="projects"><span class="pp-mini-icon folder"></span>My Projects</button>
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
      <div class="pp-top-card"><img class="pp-hero-art" src="./assets/hero-workshop.webp?v=20260928-hero4" alt="3D printer workshop" onerror="this.onerror=null;this.src='./assets/hero-art-orange.webp?v=20260928-hero-fallback2'"><div class="pp-card-tagline">Print Smarter.<br>Price Better.<br>Profit More.</div>
      </div>
    </div>
    <div class="pp-top-line"></div>
  `;

  const shell=body.querySelector('.shell');
  body.insertBefore(top,shell||body.firstChild);

  const style=document.createElement('style');
  style.id='ppCleanTopStyles';
  style.textContent=`
    /* Regression cleanup: keep only the two navigation controls requested for the live calculator.
       Guide & Help and Settings stay visible; the calculator/price/profit shortcuts stay hidden. */
    #ppCleanTop .pp-top-links{display:flex!important}
    #ppCleanTop .pp-feature-strip,
    .pp-master-feature-strip,
    .pp-master-subnav{display:none!important}
    #ppCleanTop{position:relative;width:100%;min-height:367px;overflow:hidden;background:#07141d;color:#f5f8fb;border-bottom:1px solid #294653;font-family:Inter,Segoe UI,system-ui,sans-serif}
    #ppCleanTop .pp-top-grid{position:absolute;inset:0;opacity:.45;background-image:linear-gradient(rgba(62,105,122,.16) 1px,transparent 1px),linear-gradient(90deg,rgba(62,105,122,.16) 1px,transparent 1px);background-size:62px 62px;background-position:28px 0;pointer-events:none}
    #ppCleanTop .pp-top-grid:after{content:"";position:absolute;inset:0;background:radial-gradient(circle at 76% 48%,rgba(0,129,184,.12),transparent 32%),linear-gradient(90deg,rgba(7,20,29,.12),rgba(7,20,29,.72) 63%,rgba(7,20,29,.16))}
    #ppCleanTop .pp-top-nav{position:relative;z-index:3;height:60px;display:flex;align-items:center;padding:0 3.1%;border-bottom:1px solid #294653;background:rgba(5,15,22,.58);box-sizing:border-box}
    #ppCleanTop .pp-top-brand{display:flex;align-items:center;justify-content:flex-start;width:245px;height:60px;overflow:visible;text-decoration:none;box-sizing:border-box}
    #ppCleanTop .pp-top-brand img{width:100%;height:60px;object-fit:contain;object-position:center;display:block}.pp-light #ppCleanTop .pp-top-brand img,body[data-pp-theme="light"] #ppCleanTop .pp-top-brand img{content:url("data:image/webp;base64,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")}
    #ppCleanTop .pp-top-links{margin-left:auto;display:flex;align-items:center;gap:10px}
    #ppCleanTop .pp-top-links button{border:0;background:transparent;color:#dce5eb;font:600 13px/1 Inter,Segoe UI,system-ui,sans-serif;padding:7px 10px;display:flex;align-items:center;gap:9px;cursor:pointer;border-radius:9px;transition:.18s ease}
    #ppCleanTop .pp-top-links button:hover,#ppCleanTop .pp-price-finder-link:hover{color:#fff;background:#ff780012}
    #ppCleanTop .pp-price-finder-link{border:0;background:transparent;color:#dce5eb;font:600 13px/1 Inter,Segoe UI,system-ui,sans-serif;padding:7px 10px;display:flex;align-items:center;gap:9px;cursor:pointer;border-radius:9px;transition:.18s ease;text-decoration:none}
    #ppCleanTop .search:before{content:"⌕";position:absolute;inset:-2px 0 0;font:27px/1 Arial,sans-serif;color:currentColor}

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
    #ppCleanTop .book:before{content:"▤";position:absolute;inset:-1px 0 0;font:26px/1 Arial,sans-serif;color:currentColor}
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
    #ppCleanTop .pp-projects-button{border:1px solid #355363;background:#091923;color:#e3ebef;box-shadow:0 8px 20px #0005}
    #ppCleanTop .pp-projects-button:hover{border-color:#ff7800;color:#fff;background:#0b202b;transform:translateY(-1px)}
    #ppCleanTop .pp-projects-button .folder:before{content:"▰";position:absolute;left:1px;top:1px;font:19px/1 Arial,sans-serif;color:currentColor}
    #ppCleanTop .pp-primary b,#ppCleanTop .pp-secondary b{font-size:20px;line-height:0;font-weight:500}
    #ppCleanTop .pp-secondary{border:1px solid #355363;background:#091923;color:#e3ebef}
    #ppCleanTop .pp-secondary:hover{border-color:#ff7800;color:#fff}
    #ppCleanTop .pp-feature-strip{display:flex;align-items:center;gap:15px;margin-top:12px;min-height:42px}
    #ppCleanTop .pp-feature-strip>div{display:flex;align-items:center;gap:8px;color:#eef3f5;font-size:10px;font-weight:800;line-height:1.05;min-width:74px}
    #ppCleanTop .pp-feature-strip small{display:block;color:#c0ccd3;font-size:9px;font-weight:500;margin-top:3px}
    #ppCleanTop .pp-feature-strip i{height:32px;width:1px;background:#34505d;display:block}
    #ppCleanTop .pp-top-card{width:425px;height:285px;align-self:start;margin-top:0;border:1px solid #294957;border-radius:24px;background:linear-gradient(145deg,#0b202b,#07141d);box-shadow:inset 0 1px 0 #ffffff0c,0 18px 40px #0008;display:flex;flex-direction:column;align-items:center;justify-content:flex-start;overflow:hidden;position:relative}
    #ppCleanTop .pp-top-card:after{content:"";position:absolute;inset:0;background:radial-gradient(circle at 50% 20%,#ff780012,transparent 45%);pointer-events:none}
    #ppCleanTop .pp-top-card img{position:relative;z-index:1;width:325px;height:205px;object-fit:contain;object-position:center;display:block;margin-top:9px}
    #ppCleanTop .pp-card-tagline{position:relative;z-index:2;margin-top:-2px;color:#ff7800;text-align:right;width:305px;font-size:21px;line-height:.9;font-family:"Brush Script MT","Segoe Script",cursive;font-style:italic;transform:rotate(-2deg);text-shadow:0 2px 12px #000}
    #ppCleanTop .pp-top-line{position:absolute;left:0;right:0;bottom:0;height:2px;background:#ff7800;box-shadow:0 0 14px #ff780055}
    @media(max-width:1050px){#ppCleanTop .pp-top-body{grid-template-columns:minmax(0,1fr) 350px;gap:22px}#ppCleanTop .pp-top-card{width:350px}#ppCleanTop .pp-top-card img{width:285px}#ppCleanTop h1{font-size:42px}}
    @media(max-width:800px){#ppCleanTop{min-height:0}#ppCleanTop .pp-top-nav{height:auto;min-height:62px;padding:5px 14px;flex-wrap:wrap}#ppCleanTop .pp-top-brand{width:220px}#ppCleanTop .pp-top-brand img{width:100%;height:60px;object-fit:contain;object-position:center;display:block}#ppCleanTop .pp-top-links{width:100%;margin:0;justify-content:space-between;overflow:auto}#ppCleanTop .pp-top-links button{padding:6px 8px;font-size:11px}#ppCleanTop .pp-top-body{grid-template-columns:1fr;padding:16px 18px 20px}#ppCleanTop .pp-top-card{width:100%;max-width:425px;justify-self:center}#ppCleanTop h1{font-size:38px}.pp-desktop{display:none}}
    @media(max-width:520px){#ppCleanTop h1{font-size:32px}.pp-eyebrow{font-size:9px!important}.pp-top-copy>p{font-size:14px!important}.pp-feature-strip{gap:8px!important}.pp-feature-strip>div{min-width:0!important}.pp-feature-strip i{display:none!important}#ppCleanTop .pp-top-card{height:255px}#ppCleanTop .pp-top-card img{width:270px;height:170px}.pp-card-tagline{font-size:18px!important;width:250px!important}
#ppCleanTop .pp-top-brand img{width:100%;height:60px;object-fit:contain;object-position:center;display:block}}
  `;
  document.head.appendChild(style);
  const heroStyle=document.createElement('style');heroStyle.id='ppHeroAssetStyle';heroStyle.textContent=`
    #ppCleanTop .pp-hero-art{position:relative!important;z-index:1!important;width:100%!important;height:100%!important;object-fit:cover!important;object-position:58% center!important;margin:0!important;opacity:.94!important}
    #ppCleanTop .pp-top-card:before{content:"";position:absolute;inset:0;z-index:1;background:linear-gradient(90deg,rgba(7,20,29,.03) 0%,rgba(7,20,29,.02) 38%,rgba(7,20,29,.28) 100%),linear-gradient(180deg,rgba(7,20,29,.08),rgba(7,20,29,.22));pointer-events:none}
    #ppCleanTop .pp-card-tagline{position:absolute!important;right:18px!important;bottom:16px!important;z-index:3!important;margin:0!important;width:auto!important;font-size:18px!important;text-shadow:0 2px 12px #000!important}
  `;document.head.appendChild(heroStyle);


  function openSettings(){
    if(document.getElementById('ppSettingsPanel')){
      document.getElementById('ppSettingsPanel').classList.add('open');
      document.body.style.overflow='hidden';
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
            <span class="pp-inline-logo" aria-label="PrintProfit"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 420" role="img" aria-labelledby="title desc">
<title id="title">PrintProfit master orange logo</title>
<desc id="desc">PrintProfit logo with a clean scales and monogram mark, silver white lettering, and orange accents.</desc>
<defs>
 <linearGradient id="silver" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="#c8d0d5"/></linearGradient>
 <linearGradient id="orange" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ff9b42"/><stop offset="1" stop-color="#ff7800"/></linearGradient>
 <filter id="shadow" x="-30%" y="-30%" width="160%" height="160%"><feDropShadow dx="0" dy="10" stdDeviation="10" flood-color="#000000" flood-opacity=".45"/></filter>
</defs>
<g filter="url(#shadow)">
  <g stroke-linecap="round" stroke-linejoin="round">
    <rect x="255" y="28" width="90" height="60" rx="9" fill="url(#orange)"/>
    <path d="M245 50H160q-12 0-12 10t12 10h85" fill="none" stroke="url(#orange)" stroke-width="14"/>
    <path d="M355 50h85q12 0 12 10t-12 10h-85" fill="none" stroke="url(#orange)" stroke-width="14"/>
    <path d="M275 88v26M325 88v26M300 112v142" fill="none" stroke="url(#orange)" stroke-width="14"/>
    <path d="M260 254h80q11 0 11 11t-11 11h-80q-11 0-11-11t11-11Z" fill="url(#orange)"/>
    <path d="M175 120h80q12 0 19 10l26 0M425 120h-80q-12 0-19 10l-26 0" fill="none" stroke="url(#orange)" stroke-width="10"/>
    <path d="M255 130l-46 76M345 130l46 76" fill="none" stroke="url(#orange)" stroke-width="10"/>
    <path d="M209 206h-62M391 206h62" fill="none" stroke="url(#orange)" stroke-width="10"/>
    <path d="M147 206c5 30 26 48 55 48s50-18 55-48Z" fill="url(#orange)"/>
    <path d="M337 206c5 30 26 48 55 48s50-18 55-48Z" fill="url(#orange)"/>
  </g>
  <path d="M275 126h50v24h-26v22h21v25h-21v45h-24Z" fill="url(#silver)"/>
  <path d="M325 126h29c25 0 42 13 42 35s-17 36-42 36h-5v45h-24Zm24 24v22h5c9 0 16-4 16-11s-7-11-16-11Z" fill="url(#silver)"/>
</g>
<g font-family="Inter,Segoe UI,Arial,sans-serif" font-weight="900" letter-spacing="-4">
 <text x="475" y="210" font-size="112" fill="url(#silver)">Print</text>
 <text x="705" y="210" font-size="112" fill="url(#orange)">Profit</text>
</g>
<text x="478" y="257" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="22" font-weight="800" letter-spacing="5" fill="#d7dfe3">3D PRINTING COST &amp; PRICING CALCULATOR</text>
<text x="478" y="316" font-family="cursive" font-size="36" fill="url(#orange)">Print Smarter. Price Better. Profit More.</text>
</svg></span>
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
              <option value="de">Deutsch</option>
              <option value="fr">Français</option>
              <option value="es">Español</option>
              <option value="it">Italiano</option>
              <option value="nl">Nederlands</option>
              <option value="pt">Português</option>
              <option value="cs">Čeština</option>
              <option value="sv">Svenska</option>
              <option value="da">Dansk</option>
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
            <div><strong>Exchange rate</strong><span>Update the conversion used when displaying non-GBP currencies.</span></div>
            <div class="pp-settings-rate"><span>1 GBP =</span><input id="ppSettingsRate" type="number" min="0.000001" step="0.0001" value="1"></div>
          </div>

          <div class="pp-settings-section-title">Calculator</div>
          <div class="pp-settings-card">
            <div><strong>Calculator reset</strong><span>Clear the current calculator inputs and return pricing to £0.</span></div>
            <button type="button" class="pp-settings-action" id="ppSettingsReset">Reset Calculator</button>
          </div>
          <div class="pp-settings-note">Choose your settings, then press Apply Changes to update the calculator.</div>
          <button type="button" class="pp-settings-apply" id="ppSettingsApply">Apply Changes</button>
        </div>
      </section>`;
    document.body.appendChild(panel);
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
            setTimeout(()=>document.getElementById('ppSettingsPanel')?.classList.remove('open'),250);
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
      panel.classList.remove('open');
    });
    panel.querySelectorAll('[data-close-settings]').forEach(el=>el.addEventListener('click',()=>panel.classList.remove('open')));
    document.addEventListener('keydown',event=>{
      if(event.key==='Escape'){closePanel('ppSettingsPanel');closePanel('ppGuidePanel');}
    });
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
      .pp-settings-switch input:checked+span{background:#ff780022!important;border-color:#ff7800}
      .pp-settings-switch input:checked+span:after{left:25px;background:#ff7800}
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
    panel.classList.add('open');
    document.body.style.overflow='hidden';
    document.dispatchEvent(new CustomEvent('printprofit-settings-open'));
  }
  window.__openPrintProfitSettings=openSettings;
  window.__openPrintProfitGuide=openGuide;

  function closePanel(id){
    const panel=document.getElementById(id);
    if(!panel)return;
    panel.classList.remove('open');
    if(!document.querySelector('#ppSettingsPanel.open,#ppGuidePanel.open'))document.body.style.overflow='';
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
              <span class="pp-inline-logo" aria-label="PrintProfit"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 420" role="img" aria-labelledby="title desc">
<title id="title">PrintProfit master orange logo</title>
<desc id="desc">PrintProfit logo with a clean scales and monogram mark, silver white lettering, and orange accents.</desc>
<defs>
 <linearGradient id="silver" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="#c8d0d5"/></linearGradient>
 <linearGradient id="orange" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ff9b42"/><stop offset="1" stop-color="#ff7800"/></linearGradient>
 <filter id="shadow" x="-30%" y="-30%" width="160%" height="160%"><feDropShadow dx="0" dy="10" stdDeviation="10" flood-color="#000000" flood-opacity=".45"/></filter>
</defs>
<g filter="url(#shadow)">
  <g stroke-linecap="round" stroke-linejoin="round">
    <rect x="255" y="28" width="90" height="60" rx="9" fill="url(#orange)"/>
    <path d="M245 50H160q-12 0-12 10t12 10h85" fill="none" stroke="url(#orange)" stroke-width="14"/>
    <path d="M355 50h85q12 0 12 10t-12 10h-85" fill="none" stroke="url(#orange)" stroke-width="14"/>
    <path d="M275 88v26M325 88v26M300 112v142" fill="none" stroke="url(#orange)" stroke-width="14"/>
    <path d="M260 254h80q11 0 11 11t-11 11h-80q-11 0-11-11t11-11Z" fill="url(#orange)"/>
    <path d="M175 120h80q12 0 19 10l26 0M425 120h-80q-12 0-19 10l-26 0" fill="none" stroke="url(#orange)" stroke-width="10"/>
    <path d="M255 130l-46 76M345 130l46 76" fill="none" stroke="url(#orange)" stroke-width="10"/>
    <path d="M209 206h-62M391 206h62" fill="none" stroke="url(#orange)" stroke-width="10"/>
    <path d="M147 206c5 30 26 48 55 48s50-18 55-48Z" fill="url(#orange)"/>
    <path d="M337 206c5 30 26 48 55 48s50-18 55-48Z" fill="url(#orange)"/>
  </g>
  <path d="M275 126h50v24h-26v22h21v25h-21v45h-24Z" fill="url(#silver)"/>
  <path d="M325 126h29c25 0 42 13 42 35s-17 36-42 36h-5v45h-24Zm24 24v22h5c9 0 16-4 16-11s-7-11-16-11Z" fill="url(#silver)"/>
</g>
<g font-family="Inter,Segoe UI,Arial,sans-serif" font-weight="900" letter-spacing="-4">
 <text x="475" y="210" font-size="112" fill="url(#silver)">Print</text>
 <text x="705" y="210" font-size="112" fill="url(#orange)">Profit</text>
</g>
<text x="478" y="257" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="22" font-weight="800" letter-spacing="5" fill="#d7dfe3">3D PRINTING COST &amp; PRICING CALCULATOR</text>
<text x="478" y="316" font-family="cursive" font-size="36" fill="url(#orange)">Print Smarter. Price Better. Profit More.</text>
</svg></span>
              <div><div class="pp-guide-kicker">PRINTPROFIT</div><h2 id="ppGuideTitle">Guide &amp; Help</h2><p>Everything you need to understand and use the current calculator.</p></div>
            </div>
            <button type="button" class="pp-guide-close" aria-label="Close guide" data-close-guide>×</button>
          </div>
          <div class="pp-guide-body">
            <div class="pp-guide-intro">
              <strong>PrintProfit turns your real printing costs into a practical selling price.</strong>
              <span>Work through Your Model, Print Setup and Costs &amp; Fees from top to bottom. Optional fields can remain at zero when they do not apply.</span>
            </div>
            <div class="pp-guide-grid">
              <article><div class="pp-guide-num">1</div><div><h3>Your Model</h3><p>Upload your sliced G-code file. Available metadata can fill in print time and material usage, while the live Print Information area shows the model details detected by PrintProfit.</p></div></article>
              <article><div class="pp-guide-num">2</div><div><h3>Print Setup</h3><p>Choose your printer and material together. Supported resin printers automatically switch the calculator to resin mode; custom printers keep the material-type choice available.</p></div></article>
              <article><div class="pp-guide-num">3</div><div><h3>Costs &amp; Fees</h3><p>Add operating costs, selling and fulfilment details, quantity and any batch discount. Quantity above one automatically switches the results view to Batch Pricing.</p></div></article>
              <article><div class="pp-guide-num">4</div><div><h3>Results</h3><p>Review cost to make, selling price, fees, profit and margin. Target-pricing options can calculate a selling price from the margin you want to achieve.</p></div></article>
            </div>
            <div class="pp-guide-section">
              <div class="pp-guide-section-title">My Projects &amp; My Materials</div>
              <p><strong>My Projects</strong> saves complete calculator setups so they can be loaded, duplicated or deleted. <strong>My Materials</strong> stores reusable filament and resin profiles and can populate the calculator when a saved material is used.</p>
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
        .pp-guide-brand img{width:132px;height:56px;object-fit:contain;flex:0 0 132px;border-radius:9px;background:#f7f9fa;padding:3px 6px;box-sizing:border-box}
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
    panel.classList.add('open');
    document.body.style.overflow='hidden';
  }


  const go=(target)=>{
    if(target==='settings'){openSettings();return;}
    if(target==='guide'){openGuide();return;}
    if(target==='priceFinder'){window.top.location.href='./price-finder.html';return;}
    const tab=document.querySelector('.pp-step[data-tab="'+target+'"]');
    if(tab){tab.click();return;}
    const el=document.getElementById(target);
    if(el)el.scrollIntoView({behavior:'smooth',block:'start'});
  };
  // Intercept Settings and Guide & Help at document capture level so no legacy
  // navigation handler can treat either control as a section jump.
  const modalTrigger=(event)=>{
    const trigger=event.target&&event.target.closest?event.target.closest('#ppCleanTop [data-target="settings"],#ppCleanTop [data-target="guide"]'):null;
    if(!trigger)return;
    event.preventDefault();
    event.stopPropagation();
    if(event.stopImmediatePropagation)event.stopImmediatePropagation();
    const target=trigger.dataset.target;
    if(target==='settings'){openSettings();return;}
    if(target==='guide'){window.top.location.href='./guide.html';return;}
  };
  document.addEventListener('click',modalTrigger,true);
  document.addEventListener('pointerup',modalTrigger,true);
  top.querySelectorAll('[data-target]:not([data-target="settings"]):not([data-target="guide"])').forEach(el=>el.addEventListener('click',()=>go(el.dataset.target)));
  return true;
}

function boot(){
  if(install())return;
  const started=Date.now();
  const timer=setInterval(()=>{if(install()||Date.now()-started>15000)clearInterval(timer)},50);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();

/* Final hero asset styling */
