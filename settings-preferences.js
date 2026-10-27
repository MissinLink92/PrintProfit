(()=>{ 
'use strict';
if(window.__printProfitPreferencesV3)return;
window.__printProfitPreferencesV3=true;

const KEY='printprofit.preferences.v3';
const defaults={dark:true,language:'en',units:'metric',currency:'GBP',rate:1};

const currencies={
 GBP:{symbol:'£',locale:'en-GB',rate:1},
 EUR:{symbol:'€',locale:'de-DE',rate:1.1663},
 USD:{symbol:'$',locale:'en-US',rate:1.3370},
 PLN:{symbol:'zł',locale:'pl-PL',rate:5.0892},
 CAD:{symbol:'CA$',locale:'en-CA',rate:1.84},
 AUD:{symbol:'A$',locale:'en-AU',rate:2.00},
 CHF:{symbol:'CHF',locale:'de-CH',rate:0.96},
 SEK:{symbol:'kr',locale:'sv-SE',rate:14.75},
 NOK:{symbol:'kr',locale:'nb-NO',rate:14.70},
 DKK:{symbol:'kr',locale:'da-DK',rate:8.69},
 CZK:{symbol:'Kč',locale:'cs-CZ',rate:28.30},
 JPY:{symbol:'¥',locale:'ja-JP',rate:179.00},
 CNY:{symbol:'¥',locale:'zh-CN',rate:9.65},
 INR:{symbol:'₹',locale:'en-IN',rate:123.50},
 NZD:{symbol:'NZ$',locale:'en-NZ',rate:2.16},
 SGD:{symbol:'S$',locale:'en-SG',rate:1.71},
 BRL:{symbol:'R$',locale:'pt-BR',rate:7.18},
 MXN:{symbol:'MX$',locale:'es-MX',rate:23.0696},
 ZAR:{symbol:'ZAR',locale:'en-ZA',rate:21.8000}
};

// Use dated central-bank reference data for newly selected currencies.
// Preserve an existing saved/manual exchange rate until the user changes it.
const fx=window.PRINTPROFIT_REFERENCE_DATA?.exchangeRates;
const fxAge=fx?.date?(Date.now()-Date.parse(fx.date+'T00:00:00Z'))/86400000:Infinity;
const fxUsable=fx?.base==='GBP'&&fxAge>=-1&&fxAge<=7;
if(fxUsable)for(const [code,meta] of Object.entries(currencies)){
 const rate=Number(fx.rates?.[code]);if(Number.isFinite(rate)&&rate>0)meta.rate=rate;
}
function exchangeRateNote(){
 const input=document.getElementById('ppSettingsRate');if(!input)return;
 let note=document.getElementById('ppExchangeRateNote');
 if(!note){
  note=document.createElement('p');note.id='ppExchangeRateNote';
  note.style.cssText='font-size:12px;line-height:1.5;margin:0 12px 16px;color:#aebdc6';
  input.closest('.pp-settings-card')?.insertAdjacentElement('afterend',note);
 }
 note.textContent=fxUsable?'Default rates: ECB reference dated '+fx.date+'. Saved/manual rates are kept; reselect a currency to use its updated default. Your bank may charge a different rate.':'Daily rate unavailable or older than seven days. Preset/saved rates are estimates; enter a current rate manually.';
}

const moneyFields=['materialPackCost','labourRate','pack','other','electricityRate','fixedFee','delivery','deliveryCharge','sell'];
const unitFields=['materialPack','materialUsed'];

// The calculator and standalone pages share one translation catalogue.

function load(){
 try{const stored=Object.assign({},defaults,JSON.parse(localStorage.getItem(KEY)||'{}'));
 if(!['en','pl','de','fr','es','it'].includes(stored.language))stored.language='en';
 return stored;}
 catch(e){return Object.assign({},defaults);}
}
let pref=load();
let draft=Object.assign({},pref);

function save(){try{localStorage.setItem(KEY,JSON.stringify(pref));}catch(e){}}
function setDarkMode(enabled){
 pref.dark=!!enabled;
 draft.dark=pref.dark;
 save();
 setTheme();
 document.dispatchEvent(new CustomEvent('printprofit-settings-changed'));
}
window.__setPrintProfitDarkMode=setDarkMode;
window.__setPrintProfitLanguage=language=>{
 pref.language=['en','pl','de','fr','es','it'].includes(language)?language:'en';
 draft.language=pref.language;save();translatePage();
 document.dispatchEvent(new CustomEvent('printprofit-settings-changed'));
};
function translatePage(){
 window.__ppApplyI18n?.(pref.language);
 try{if(window.parent!==window)window.parent.__ppApplyI18n?.(pref.language);}catch(e){}
}
function watchTranslations(){window.__ppWatchI18n?.(()=>pref.language);}

function setTheme(){
 document.body.dataset.ppTheme=pref.dark?'dark':'light';
 if(document.getElementById('ppSiteHeader'))document.body.classList.toggle('pp-light',!pref.dark);
 document.querySelectorAll('#ppSettingsDark,#pvmDarkMode,#dark,#darkModeToggle').forEach(toggle=>{toggle.checked=pref.dark;});
 try{if(window.parent!==window){window.parent.document.body.dataset.ppTheme=pref.dark?'dark':'light';window.parent.document.body.style.background=pref.dark?'#071018':'#eef2f5';window.parent.document.documentElement.style.background=pref.dark?'#071018':'#eef2f5';}}catch(e){}
 let s=document.getElementById('ppPreferenceTheme');
 if(!s){s=document.createElement('style');s.id='ppPreferenceTheme';document.head.appendChild(s);}
 s.textContent=`
/* PrintProfit Light Mode — deliberately scoped so Dark Mode is untouched. */
body[data-pp-theme="light"]{
 background:#eef2f5!important;
 color:#17232b!important;
}
body[data-pp-theme="light"] #ppCleanTop{
 background:#eef3f6!important;
 color:#17232b!important;
 border-bottom-color:#b8c8d0!important;
}
body[data-pp-theme="light"] #ppCleanTop .pp-top-grid{
 opacity:.28!important;
}
body[data-pp-theme="light"] #ppCleanTop .pp-top-nav{
 background:#ffffff!important;
 border-color:#c8d4da!important;
 box-shadow:0 2px 14px rgba(20,45,58,.08)!important;
}
body[data-pp-theme="light"] #ppCleanTop .pp-top-links button{
 color:#172b35!important;
}
body[data-pp-theme="light"] #ppCleanTop .pp-top-links button:hover{
 background:#ff780012!important;
 color:#0d1d25!important;
}
body[data-pp-theme="light"] #ppCleanTop .pp-eyebrow,
body[data-pp-theme="light"] #ppCleanTop h1 strong{
 color:#e76500!important;
}
body[data-pp-theme="light"] #ppCleanTop h1{
 color:#17232b!important;
 text-shadow:none!important;
}
body[data-pp-theme="light"] #ppCleanTop .pp-top-copy>p{
 color:#4d616c!important;
}
body[data-pp-theme="light"] #ppCleanTop .pp-top-card{
 background:linear-gradient(145deg,#ffffff,#e7eef2)!important;
 border-color:#b8c9d1!important;
 box-shadow:0 12px 30px rgba(23,48,61,.14)!important;
}
body[data-pp-theme="light"] #ppCleanTop .pp-top-card img{
 filter:drop-shadow(0 5px 12px rgba(0,0,0,.16))!important;
}
body[data-pp-theme="light"] #ppCleanTop .pp-card-tagline{
 color:#d85f00!important;
 text-shadow:none!important;
}
body[data-pp-theme="light"] #ppCleanTop .pp-feature-strip>div{
 color:#263943!important;
}
body[data-pp-theme="light"] #ppCleanTop .pp-feature-strip small{
 color:#637781!important;
}
body[data-pp-theme="light"] #ppCleanTop .pp-feature-strip i{
 background:#b8c9d1!important;
}
body[data-pp-theme="light"] #ppCleanTop .pp-nav-icon,
body[data-pp-theme="light"] #ppCleanTop .pp-feature-icon,
body[data-pp-theme="light"] #ppCleanTop .pp-mini-icon{
 color:#e76500!important;
}
body[data-pp-theme="light"] #ppCleanTop .pp-primary{
 background:#e96800!important;
 border-color:#d95f00!important;
 color:#fff!important;
 box-shadow:0 6px 16px rgba(220,96,0,.18)!important;
}
body[data-pp-theme="light"] #ppCleanTop .pp-projects-button{
 background:#ffffff!important;
 border-color:#aebfc8!important;
 color:#243943!important;
}
body[data-pp-theme="light"] #ppCleanTop .pp-projects-button:hover{
 border-color:#e96800!important;
}
body[data-pp-theme="light"] #ppCleanTop .pp-top-line{
 background:#e96800!important;
 box-shadow:none!important;
}

/* Journey / tabs */
body[data-pp-theme="light"] .pp-setup-guide,
body[data-pp-theme="light"] .pp-setup-progress,
body[data-pp-theme="light"] .pp-global-actions,
body[data-pp-theme="light"] .pp-results-enhanced{
 background:#ffffff!important;
 color:#17232b!important;
 border-color:#c4d1d7!important;
 box-shadow:0 5px 18px rgba(25,52,65,.08)!important;
}
body[data-pp-theme="light"] .pp-setup-guide .pp-guide-title,
body[data-pp-theme="light"] .pp-setup-guide span,
body[data-pp-theme="light"] .pp-global-actions-copy span,
body[data-pp-theme="light"] .pp-results-intro strong{
 color:#17232b!important;
}
body[data-pp-theme="light"] .pp-setup-guide i{
 color:#d96300!important;
}
body[data-pp-theme="light"] .pp-setup-guide b,
body[data-pp-theme="light"] .pp-progress-label,
body[data-pp-theme="light"] .pp-global-actions-copy small,
body[data-pp-theme="light"] .pp-results-intro>div>span:last-child{
 color:#5c707a!important;
}
body[data-pp-theme="light"] .pp-progress-track{
 background:#e4ebee!important;
 border-color:#c5d2d8!important;
}
body[data-pp-theme="light"] .pp-progress-fill{
 background:linear-gradient(90deg,#e96800,#ff9b3d)!important;
}
body[data-pp-theme="light"] .pp-global-actions-buttons .btn:not(.accent){
 background:#f4f7f8!important;
 color:#243943!important;
 border-color:#aebfc8!important;
}
body[data-pp-theme="light"] .pp-tabs{
 background:#ffffff!important;
 border-color:#c4d1d7!important;
}
body[data-pp-theme="light"] .pp-tabs .pp-tab{
 color:#405660!important;
}
body[data-pp-theme="light"] .pp-tabs .pp-tab.active{
 color:#fff!important;
 background:linear-gradient(135deg,#e96800,#d85f00)!important;
 border-color:#d85f00!important;
}
body[data-pp-theme="light"] #pp-master-quickcards button{
 background:#ffffff!important;
 color:#17232b!important;
 border-color:#b9c9d1!important;
 box-shadow:0 5px 16px rgba(20,47,60,.08)!important;
}
body[data-pp-theme="light"] #pp-master-quickcards button:hover{
 background:#f7fafb!important;
}
body[data-pp-theme="light"] #pp-master-quickcards button .pp-master-card-title{
 color:#17232b!important;
}
body[data-pp-theme="light"] #pp-master-quickcards button .pp-master-card-text,
body[data-pp-theme="light"] #pp-master-quickcards button .pp-master-card-subtitle{
 color:#536973!important;
}

/* Calculator panels */
body[data-pp-theme="light"] .panel,
body[data-pp-theme="light"] .pp-card,
body[data-pp-theme="light"] .pp-cost-block,
body[data-pp-theme="light"] .merge-block{
 background:#ffffff!important;
 color:#17232b!important;
 border-color:#c0cfd6!important;
 box-shadow:0 6px 20px rgba(23,50,63,.08)!important;
}
body[data-pp-theme="light"] .panel:hover,
body[data-pp-theme="light"] .pp-card:hover,
body[data-pp-theme="light"] .pp-cost-block:hover,
body[data-pp-theme="light"] .merge-block:hover{
 border-color:#9fb3bd!important;
}
body[data-pp-theme="light"] .panel .head h2,
body[data-pp-theme="light"] .pp-card .head h2,
body[data-pp-theme="light"] .pp-cost-block .head h2,
body[data-pp-theme="light"] .merge-block .head h2{
 color:#17232b!important;
}
body[data-pp-theme="light"] .panel .head p,
body[data-pp-theme="light"] .pp-card .head p,
body[data-pp-theme="light"] .pp-cost-block .head p,
body[data-pp-theme="light"] .merge-block .head p{
 color:#526873!important;
}
body[data-pp-theme="light"] label{
 color:#304852!important;
}
body[data-pp-theme="light"] .small,
body[data-pp-theme="light"] .muted{
 color:#5a707b!important;
}

/* Inputs — white fields with strong text and visible borders */
body[data-pp-theme="light"] input,
body[data-pp-theme="light"] select,
body[data-pp-theme="light"] textarea{
 background:#ffffff!important;
 color:#17232b!important;
 border-color:#aebfc8!important;
 box-shadow:inset 0 1px 2px rgba(20,45,58,.05)!important;
}
body[data-pp-theme="light"] input::placeholder,
body[data-pp-theme="light"] textarea::placeholder{
 color:#7a8d96!important;
 opacity:1!important;
}
body[data-pp-theme="light"] input:hover,
body[data-pp-theme="light"] select:hover,
body[data-pp-theme="light"] textarea:hover{
 border-color:#829aa5!important;
}
body[data-pp-theme="light"] input:focus,
body[data-pp-theme="light"] select:focus,
body[data-pp-theme="light"] textarea:focus{
 border-color:#e96800!important;
 box-shadow:0 0 0 3px rgba(233,104,0,.14)!important;
 outline:none!important;
}

/* Upload / helper areas */
body[data-pp-theme="light"] .drop{
 background:#f8fafb!important;
 border-color:#9fb4be!important;
 color:#253c46!important;
}
body[data-pp-theme="light"] .drop:hover{
 background:#fff8f2!important;
 border-color:#e96800!important;
}
body[data-pp-theme="light"] .drop *{
 color:inherit;
}

/* Section icons: keep the existing cyan / purple / green identity, but make
   the artwork and circles readable on white. */
body[data-pp-theme="light"] .pp-tab-panel .head>.pp-pretty-icon,
body[data-pp-theme="light"] .pp-tab-panel .head>.icon,
body[data-pp-theme="light"] .merge-block .head>.pp-pretty-icon,
body[data-pp-theme="light"] .merge-block .head>.icon{
 background:#f4f8fa!important;
 box-shadow:0 3px 12px rgba(20,45,58,.10)!important;
}
body[data-pp-theme="light"] .pp-tab-panel .head>.pp-pretty-icon svg,
body[data-pp-theme="light"] .pp-tab-panel .head>.icon svg{
 filter:none!important;
 stroke-width:2.7!important;
}

/* Light Mode — remove remaining dark stage surfaces and dark inherited text. */
body[data-pp-theme="light"] .pp-tab-panel[data-panel="costs"] .pp-cost-block,
body[data-pp-theme="light"] .pp-tab-panel[data-panel="costs"] .pp-cost-block>.panel,
body[data-pp-theme="light"] .pp-tab-panel[data-panel="costs"] .pp-cost-block .panel,
body[data-pp-theme="light"] .pp-tab-panel[data-panel="costs"] .merge-block{
 background:#ffffff!important;
 color:#17232b!important;
 border-color:#c0cfd6!important;
}
body[data-pp-theme="light"] .pp-tab-panel[data-panel="costs"] .pp-cost-block .head,
body[data-pp-theme="light"] .pp-tab-panel[data-panel="costs"] .pp-cost-block>.panel .head,
body[data-pp-theme="light"] .pp-tab-panel[data-panel="costs"] .merge-block .head{
 background:#ffffff!important;
 color:#17232b!important;
}
body[data-pp-theme="light"] .pp-tab-panel[data-panel="costs"] .pp-cost-block .head h2,
body[data-pp-theme="light"] .pp-tab-panel[data-panel="costs"] .pp-cost-block .head h3,
body[data-pp-theme="light"] .pp-tab-panel[data-panel="costs"] .pp-cost-block .head strong,
body[data-pp-theme="light"] .pp-tab-panel[data-panel="costs"] .merge-block .head h2,
body[data-pp-theme="light"] .pp-tab-panel[data-panel="costs"] .merge-block .head h3,
body[data-pp-theme="light"] .pp-tab-panel[data-panel="costs"] .merge-block .head strong{
 color:#17232b!important;
 text-shadow:none!important;
}
body[data-pp-theme="light"] .pp-tab-panel[data-panel="costs"] .pp-cost-block .head p,
body[data-pp-theme="light"] .pp-tab-panel[data-panel="costs"] .merge-block .head p{
 color:#526873!important;
}
body[data-pp-theme="light"] .pp-tab-panel[data-panel="costs"] .pp-cost-block label,
body[data-pp-theme="light"] .pp-tab-panel[data-panel="costs"] .merge-block label{
 color:#304852!important;
}
body[data-pp-theme="light"] .pp-tab-panel[data-panel="costs"] .pp-cost-block input,
body[data-pp-theme="light"] .pp-tab-panel[data-panel="costs"] .pp-cost-block select,
body[data-pp-theme="light"] .pp-tab-panel[data-panel="costs"] .merge-block input,
body[data-pp-theme="light"] .pp-tab-panel[data-panel="costs"] .merge-block select{
 background:#ffffff!important;
 color:#17232b!important;
 border-color:#aebfc8!important;
}
body[data-pp-theme="light"] .pp-tab-panel[data-panel="costs"] .pp-cost-block small,
body[data-pp-theme="light"] .pp-tab-panel[data-panel="costs"] .merge-block small,
body[data-pp-theme="light"] .pp-tab-panel[data-panel="costs"] .pp-cost-block .muted,
body[data-pp-theme="light"] .pp-tab-panel[data-panel="costs"] .merge-block .muted{
 color:#5c707a!important;
}
body[data-pp-theme="light"] .pp-tab-panel[data-panel="costs"] .pp-cost-block .icon,
body[data-pp-theme="light"] .pp-tab-panel[data-panel="costs"] .merge-block .icon{
 background:#f4f8fa!important;
 color:#35a96d!important;
}
body[data-pp-theme="light"] .pp-tab-panel[data-panel="costs"] .pp-cost-block [class*="result"],
body[data-pp-theme="light"] .pp-tab-panel[data-panel="costs"] .merge-block [class*="result"]{
 color:#17232b!important;
}
body[data-pp-theme="light"] .pp-tab-panel[data-panel="costs"] .pp-cost-block [class*="result"] strong,
body[data-pp-theme="light"] .pp-tab-panel[data-panel="costs"] .merge-block [class*="result"] strong{
 color:#148552!important;
}

/* Light Mode also needs the legacy selling/fulfilment block to lose its dark surface. */
body[data-pp-theme="light"] .pp-tab-panel .pp-cost-block,
body[data-pp-theme="light"] .pp-tab-panel .pp-cost-block>.panel,
body[data-pp-theme="light"] .pp-tab-panel .pp-cost-block .panel{
 background:#ffffff!important;
 color:#17232b!important;
}
body[data-pp-theme="light"] .pp-tab-panel .pp-cost-block h2,
body[data-pp-theme="light"] .pp-tab-panel .pp-cost-block h3,
body[data-pp-theme="light"] .pp-tab-panel .pp-cost-block p,
body[data-pp-theme="light"] .pp-tab-panel .pp-cost-block strong{
 text-shadow:none!important;
}
/* Light Mode — Print Setup / machine panels: remove inherited dark surfaces. */
body[data-pp-theme="light"] .pp-tab-panel[data-panel="machine"] .print-setup-panel,
body[data-pp-theme="light"] .pp-tab-panel[data-panel="machine"] .print-setup-panel>.panel,
body[data-pp-theme="light"] .pp-tab-panel[data-panel="machine"] .print-setup-panel>.merge-block,
body[data-pp-theme="light"] .pp-tab-panel[data-panel="machine"] .merge-block{
 background:#ffffff!important;
 color:#17232b!important;
 border-color:#c0cfd6!important;
 box-shadow:0 6px 20px rgba(23,50,63,.08)!important;
}
body[data-pp-theme="light"] .pp-tab-panel[data-panel="machine"] .print-setup-panel .head,
body[data-pp-theme="light"] .pp-tab-panel[data-panel="machine"] .merge-block .head{
 background:#ffffff!important;
 color:#17232b!important;
}
body[data-pp-theme="light"] .pp-tab-panel[data-panel="machine"] .print-setup-panel .head h2,
body[data-pp-theme="light"] .pp-tab-panel[data-panel="machine"] .print-setup-panel .head h3,
body[data-pp-theme="light"] .pp-tab-panel[data-panel="machine"] .print-setup-panel .head strong,
body[data-pp-theme="light"] .pp-tab-panel[data-panel="machine"] .merge-block .head h2,
body[data-pp-theme="light"] .pp-tab-panel[data-panel="machine"] .merge-block .head h3,
body[data-pp-theme="light"] .pp-tab-panel[data-panel="machine"] .merge-block .head strong{
 color:#17232b!important;
 text-shadow:none!important;
}
body[data-pp-theme="light"] .pp-tab-panel[data-panel="machine"] .print-setup-panel .head p,
body[data-pp-theme="light"] .pp-tab-panel[data-panel="machine"] .merge-block .head p{
 color:#526873!important;
}
body[data-pp-theme="light"] .pp-tab-panel[data-panel="machine"] .print-setup-panel label,
body[data-pp-theme="light"] .pp-tab-panel[data-panel="machine"] .merge-block label{
 color:#304852!important;
}
body[data-pp-theme="light"] .pp-tab-panel[data-panel="machine"] .print-setup-panel small,
body[data-pp-theme="light"] .pp-tab-panel[data-panel="machine"] .merge-block small,
body[data-pp-theme="light"] .pp-tab-panel[data-panel="machine"] .print-setup-panel .muted,
body[data-pp-theme="light"] .pp-tab-panel[data-panel="machine"] .merge-block .muted,
body[data-pp-theme="light"] .pp-tab-panel[data-panel="machine"] #materialStatus{
 color:#5c707a!important;
}
body[data-pp-theme="light"] .pp-tab-panel[data-panel="machine"] .print-setup-panel input,
body[data-pp-theme="light"] .pp-tab-panel[data-panel="machine"] .print-setup-panel select,
body[data-pp-theme="light"] .pp-tab-panel[data-panel="machine"] .print-setup-panel textarea,
body[data-pp-theme="light"] .pp-tab-panel[data-panel="machine"] .merge-block input,
body[data-pp-theme="light"] .pp-tab-panel[data-panel="machine"] .merge-block select,
body[data-pp-theme="light"] .pp-tab-panel[data-panel="machine"] .merge-block textarea{
 background:#ffffff!important;
 color:#17232b!important;
 border-color:#aebfc8!important;
}
body[data-pp-theme="light"] .pp-tab-panel[data-panel="machine"] .print-setup-panel input:focus,
body[data-pp-theme="light"] .pp-tab-panel[data-panel="machine"] .print-setup-panel select:focus,
body[data-pp-theme="light"] .pp-tab-panel[data-panel="machine"] .merge-block input:focus,
body[data-pp-theme="light"] .pp-tab-panel[data-panel="machine"] .merge-block select:focus{
 border-color:#a77cff!important;
 box-shadow:0 0 0 3px rgba(167,124,255,.14)!important;
}
body[data-pp-theme="light"] .pp-tab-panel[data-panel="machine"] .print-setup-panel .icon,
body[data-pp-theme="light"] .pp-tab-panel[data-panel="machine"] .merge-block .icon,
body[data-pp-theme="light"] .pp-tab-panel[data-panel="machine"] .print-setup-panel .pp-pretty-icon,
body[data-pp-theme="light"] .pp-tab-panel[data-panel="machine"] .merge-block .pp-pretty-icon{
 background:#f4f0ff!important;
 color:#7a4de8!important;
 border-color:#a77cff!important;
 box-shadow:0 3px 12px rgba(65,45,100,.10)!important;
}
body[data-pp-theme="light"] .pp-tab-panel[data-panel="machine"] #materialCostOut{
 color:#7446dc!important;
}
/* Light Mode compatibility for model file intelligence / metadata. */
body[data-pp-theme="light"] .pp-tab-panel .pp-model-extra{
 background:#ffffff!important;
 border-color:#d0dde2!important;
 color:#17232b!important;
}
body[data-pp-theme="light"] .pp-tab-panel .pp-model-extra-title{
 color:#d85f00!important;
}
body[data-pp-theme="light"] .pp-tab-panel .pp-model-extra-grid>div{
 background:#f8fafb!important;
 border-color:#c2d0d6!important;
 color:#17232b!important;
 box-shadow:none!important;
}
body[data-pp-theme="light"] .pp-tab-panel .pp-model-extra-grid span{
 color:#5a707b!important;
}
body[data-pp-theme="light"] .pp-tab-panel .pp-model-extra-grid strong{
 color:#17232b!important;
 text-shadow:none!important;
}
body[data-pp-theme="light"] .pp-tab-panel .pp-model-hint{
 color:#647983!important;
}
body[data-pp-theme="light"] .pp-file-metadata{
 background:#f8fafb!important;
 border-color:#c2d0d6!important;
 color:#17232b!important;
 box-shadow:none!important;
}
body[data-pp-theme="light"] .pp-file-metadata>b{
 color:#d85f00!important;
}
body[data-pp-theme="light"] .pp-file-metadata div{
 border-bottom-color:#dce5e9!important;
}
body[data-pp-theme="light"] .pp-file-metadata span{
 color:#5a707b!important;
}
body[data-pp-theme="light"] .pp-file-metadata strong{
 color:#17232b!important;
}
/* Light Mode compatibility layer for generated/newer calculator components. */
body[data-pp-theme="light"] .pp-tab-panel .pp-card,
body[data-pp-theme="light"] .pp-tab-panel .pp-cost-block,
body[data-pp-theme="light"] .pp-tab-panel .pp-card>.panel,
body[data-pp-theme="light"] .pp-tab-panel .pp-cost-block>.panel,
body[data-pp-theme="light"] .pp-tab-panel .merge-block,
body[data-pp-theme="light"] .pp-tab-panel .pp-profile-card,
body[data-pp-theme="light"] .pp-tab-panel .pp-model-hub{
 background:#ffffff!important;
 color:#17232b!important;
 border-color:#c0cfd6!important;
 box-shadow:0 6px 20px rgba(23,50,63,.08)!important;
}
body[data-pp-theme="light"] .pp-tab-panel .pp-model-status{
 background:#f7fafb!important;
 color:#425963!important;
 border-color:#b8c8d0!important;
}
body[data-pp-theme="light"] .pp-tab-panel .pp-model-grid>div,
body[data-pp-theme="light"] .pp-tab-panel .pp-profile-grid>div{
 background:#f8fafb!important;
 color:#17232b!important;
 border-color:#c2d0d6!important;
}
body[data-pp-theme="light"] .pp-tab-panel .pp-model-grid span,
body[data-pp-theme="light"] .pp-tab-panel .pp-profile-grid span,
body[data-pp-theme="light"] .pp-tab-panel .pp-material-rate span{
 color:#5a707b!important;
}
body[data-pp-theme="light"] .pp-tab-panel .pp-model-grid strong,
body[data-pp-theme="light"] .pp-tab-panel .pp-profile-grid b{
 color:#17232b!important;
 text-shadow:none!important;
}
body[data-pp-theme="light"] .pp-tab-panel .pp-material-rate{
 background:#fbfcfd!important;
 border-color:#c2d0d6!important;
}
body[data-pp-theme="light"] .pp-tab-panel .pp-material-rate strong{
 color:#7446dc!important;
}
body[data-pp-theme="light"] .pp-tab-panel .pp-profile-head strong{
 color:#17232b!important;
}
body[data-pp-theme="light"] .pp-tab-panel .pp-profile-head>div>span{
 color:#5a707b!important;
}
body[data-pp-theme="light"] .pp-tab-panel .pp-profile-icon{
 background:#f4f8fa!important;
 border-color:#b8c8d0!important;
 color:#657b85!important;
}
body[data-pp-theme="light"] .pp-tab-panel .pp-card .head,
body[data-pp-theme="light"] .pp-tab-panel .pp-cost-block .head,
body[data-pp-theme="light"] .pp-tab-panel .merge-block .head{
 background:#ffffff!important;
 color:#17232b!important;
}
body[data-pp-theme="light"] .pp-tab-panel .pp-card .head h2,
body[data-pp-theme="light"] .pp-tab-panel .pp-card .head h3,
body[data-pp-theme="light"] .pp-tab-panel .pp-card .head p,
body[data-pp-theme="light"] .pp-tab-panel .pp-cost-block .head h2,
body[data-pp-theme="light"] .pp-tab-panel .pp-cost-block .head h3,
body[data-pp-theme="light"] .pp-tab-panel .pp-cost-block .head p,
body[data-pp-theme="light"] .pp-tab-panel .merge-block .head h2,
body[data-pp-theme="light"] .pp-tab-panel .merge-block .head h3,
body[data-pp-theme="light"] .pp-tab-panel .merge-block .head p{
 text-shadow:none!important;
}
body[data-pp-theme="light"] .pp-tab-panel .pp-card .head h2,
body[data-pp-theme="light"] .pp-tab-panel .pp-card .head h3,
body[data-pp-theme="light"] .pp-tab-panel .pp-cost-block .head h2,
body[data-pp-theme="light"] .pp-tab-panel .pp-cost-block .head h3,
body[data-pp-theme="light"] .pp-tab-panel .merge-block .head h2,
body[data-pp-theme="light"] .pp-tab-panel .merge-block .head h3{
 color:#17232b!important;
}
body[data-pp-theme="light"] .pp-tab-panel .pp-card .head p,
body[data-pp-theme="light"] .pp-tab-panel .pp-cost-block .head p,
body[data-pp-theme="light"] .pp-tab-panel .merge-block .head p{
 color:#526873!important;
}

/* Results area: every economic result tile is white in Light Mode. */
body[data-pp-theme="light"] .layout>.result{
 background:#ffffff!important;
 color:#17232b!important;
 border-color:#c0cfd6!important;
 box-shadow:0 6px 20px rgba(23,50,63,.08)!important;
}
body[data-pp-theme="light"] .layout>.result .result,
body[data-pp-theme="light"] .layout>.result .quick,
body[data-pp-theme="light"] .layout>.result .break,
body[data-pp-theme="light"] .layout>.result .result-card,
body[data-pp-theme="light"] .layout>.result .result-box,
body[data-pp-theme="light"] .layout>.result [class*="result-tile"]{
 background:#ffffff!important;
 color:#17232b!important;
 border-color:#c0cfd6!important;
 box-shadow:0 3px 12px rgba(23,50,63,.06)!important;
}
body[data-pp-theme="light"] .layout>.result h2,
body[data-pp-theme="light"] .layout>.result h3,
body[data-pp-theme="light"] .layout>.result strong,
body[data-pp-theme="light"] .layout>.result label{
 color:#17232b!important;
 text-shadow:none!important;
}
body[data-pp-theme="light"] .layout>.result p,
body[data-pp-theme="light"] .layout>.result small,
body[data-pp-theme="light"] .layout>.result .muted{
 color:#526873!important;
}
body[data-pp-theme="light"] .layout>.result .value,
body[data-pp-theme="light"] .layout>.result .money,
body[data-pp-theme="light"] .layout>.result output{
 color:#17232b!important;
 text-shadow:none!important;
}
body[data-pp-theme="light"] .layout>.result input{
 background:#ffffff!important;
 color:#17232b!important;
 border-color:#aebfc8!important;
}
body[data-pp-theme="light"] .layout>.result .quick button,
body[data-pp-theme="light"] .layout>.result button{
 color:#17232b!important;
 border-color:#aebfc8!important;
}
body[data-pp-theme="light"] .layout>.result .quick button:not(.active),
body[data-pp-theme="light"] .layout>.result button:not(.accent):not(.active){
 background:#f6f9fa!important;
}
body[data-pp-theme="light"] .layout>.result .quick button.active,
body[data-pp-theme="light"] .layout>.result button.accent,
body[data-pp-theme="light"] .layout>.result .tab.active{
 background:linear-gradient(135deg,#ff9a42,#e96800)!important;
 color:#ffffff!important;
 border-color:#e96800!important;
}
body[data-pp-theme="light"] .layout>.result .tab:not(.active){
 background:#ffffff!important;
 color:#405660!important;
 border-color:#b8c8d0!important;
}
/* Light Mode — final legacy upload + result tile overrides. */
body[data-pp-theme="light"] .drop{
 background:#f8fafb!important;
 color:#304852!important;
 border-color:#8ea8b3!important;
 box-shadow:inset 0 0 0 1px rgba(255,255,255,.7)!important;
}
body[data-pp-theme="light"] .drop b{
 color:#304852!important;
 text-shadow:none!important;
}
body[data-pp-theme="light"] .drop .small,
body[data-pp-theme="light"] .drop small{
 color:#647983!important;
}
body[data-pp-theme="light"] .drop .btn:not(.accent){
 background:#f3f7f8!important;
 color:#304852!important;
 border-color:#a9bcc5!important;
}
body[data-pp-theme="light"] .drop .btn.accent{
 color:#ffffff!important;
}
body[data-pp-theme="light"] .layout>.result .cards{
 background:transparent!important;
}
body[data-pp-theme="light"] .layout>.result .cards>.card{
 background:#ffffff!important;
 color:#17232b!important;
 border-color:#b9cbd3!important;
 box-shadow:0 4px 14px rgba(23,50,63,.08)!important;
}
body[data-pp-theme="light"] .layout>.result .cards>.card .small{
 color:#526873!important;
}
body[data-pp-theme="light"] .layout>.result .cards>.card .value{
 color:#17232b!important;
 text-shadow:none!important;
}
body[data-pp-theme="light"] .layout>.result .cards>.card .value.good{
 color:#148552!important;
}
body[data-pp-theme="light"] .layout>.result .cards>.card .value.bad{
 color:#c43b3b!important;
}
/* Results / values */
body[data-pp-theme="light"] .result,
body[data-pp-theme="light"] .quick,
body[data-pp-theme="light"] .break{
 background:#ffffff!important;
 color:#17232b!important;
 border-color:#c0cfd6!important;
}
body[data-pp-theme="light"] .result .value,
body[data-pp-theme="light"] .result .money{
 color:#17232b!important;
}
body[data-pp-theme="light"] .result .small,
body[data-pp-theme="light"] .result label{
 color:#526873!important;
}

/* Footer / disclaimer */
body[data-pp-theme="light"] .footer{
 background:#ffffff!important;
 color:#536973!important;
 border-top-color:#c0cfd6!important;
}
body[data-pp-theme="light"] .footer>span:first-child{
 color:#314953!important;
}
body[data-pp-theme="light"] .footer .pp-disclaimer{
 color:#4d626d!important;
}

/* Floating reset remains a deliberately strong action in both themes. */
body[data-pp-theme="light"] #ppFloatingReset{
 filter:none!important;
 box-shadow:0 8px 22px rgba(40,50,55,.22)!important;
}

/* Existing older header/hero selectors are also covered, without touching
   them when the theme is dark. */
body[data-pp-theme="light"] .header{
 background:#ffffff!important;
 color:#17232b!important;
 border-bottom-color:#c3d0d6!important;
 box-shadow:0 4px 18px rgba(20,45,58,.08)!important;
}
body[data-pp-theme="light"] .header .nav a{
 color:#29404b!important;
}
body[data-pp-theme="light"] .header .nav a:hover,
body[data-pp-theme="light"] .header .nav a.active{
 color:#17232b!important;
 background:#eaf1f4!important;
}
body[data-pp-theme="light"] .hero{
 background:#edf3f5!important;
 color:#17232b!important;
 border-bottom-color:#c3d0d6!important;
}
body[data-pp-theme="light"] #ppVisualMaster .pvm-header{background:#fff!important;color:#17232b!important;border-color:#c3d0d6!important}
body[data-pp-theme="light"] #ppVisualMaster .pvm-nav button:not(.active){color:#29404b!important}
body[data-pp-theme="light"] #ppVisualMaster .pvm-dark,body[data-pp-theme="light"] #ppVisualMaster .pvm-language{background:#eef3f5!important;color:#29404b!important;border-color:#bccdd6!important}
body[data-pp-theme="light"] #ppVisualMaster .pvm-language select{color:#29404b!important}
body[data-pp-theme="light"] #ppVisualMaster .pvm-journey button{background:linear-gradient(180deg,#fff,#edf3f5)!important;color:#17232b!important;border-color:#bccdd6!important}
body[data-pp-theme="light"] #ppVisualMaster .pvm-journey small{color:#536771!important}
/* Workspace creates its panels after the theme stylesheet. Keep their
   foregrounds and surfaces paired in light mode, including account consent. */
html#ppReadableTypography body[data-pp-theme="light"] :is(.pp-materials-dialog,.pp-projects-dialog,.pp-material-form,.pp-workshop-printer-form){background:#fff!important;color:#19252d!important;border-color:#b9cbd3!important}
html#ppReadableTypography body[data-pp-theme="light"] :is(.pp-materials-head,.pp-projects-head,.pp-workspace-nav){background:#f5f8fa!important;border-color:#c5d3d9!important}
html#ppReadableTypography body[data-pp-theme="light"] :is(.pp-material-card,.pp-project-card,.pp-account-card,.pp-account-consents,.pp-workshop-usage){background:#f5f8fa!important;color:#19252d!important;border-color:#b9cbd3!important}
html#ppReadableTypography body[data-pp-theme="light"] :is(.pp-materials-dialog,.pp-projects-dialog,.pp-material-form) :is(h2,h3,strong,b,label){color:#19252d!important}
html#ppReadableTypography body[data-pp-theme="light"] :is(.pp-materials-dialog,.pp-projects-dialog,.pp-material-form) :is(p,small,.small,.pp-account-status,.pp-account-signup-help,.pp-account-footnote,.pp-account-consents,.pp-account-consents>span,.pp-account-consents label>span,.pp-account-badge,.pp-account-signed-in){color:#425963!important}
html#ppReadableTypography body[data-pp-theme="light"] :is(.pp-materials-dialog,.pp-projects-dialog,.pp-material-form) a,
html#ppReadableTypography body[data-pp-theme="light"] .pp-account-links button{color:#006d88!important}
html#ppReadableTypography body[data-pp-theme="light"] :is(.pp-material-actions,.pp-project-actions,.pp-workspace-nav,.pp-workshop-tabs) button,
html#ppReadableTypography body[data-pp-theme="light"] :is(.pp-account-secondary,.pp-materials-close,.pp-projects-close){background:#edf3f5!important;color:#243b46!important;border-color:#a8bec9!important}
html#ppReadableTypography body[data-pp-theme="light"] .pp-workspace-nav button[aria-current="page"],
html#ppReadableTypography body[data-pp-theme="light"] .pp-workshop-tabs button.active{background:#dcecf2!important;border-color:#1684a2!important}
html#ppReadableTypography body[data-pp-theme="light"] :is(.pp-account-legal-pending,.pp-account-not-configured){background:#fff7e8!important;color:#714611!important;border-color:#c49b58!important}
html#ppReadableTypography body[data-pp-theme="light"] :is(.pp-account-legal-pending,.pp-account-not-configured) :is(p,strong,label,label>span){color:#714611!important}
html#ppReadableTypography body[data-pp-theme="light"] .pp-account-delete-confirm{background:#fff4f4!important;border-color:#be8990!important}
html#ppReadableTypography body[data-pp-theme="light"] .pp-account-delete-confirm :is(p,label),
html#ppReadableTypography body[data-pp-theme="light"] :is(.pp-account-danger,.pp-account-message.is-error){color:#a42132!important}
html#ppReadableTypography body[data-pp-theme="light"] .pp-account-message{color:#176a50!important}
html#ppReadableTypography body[data-pp-theme="light"] :is(.pp-account-kicker,.pp-materials-kicker,.pp-projects-kicker){color:#865000!important}
`;
}

function labelFor(id){
 return document.getElementById(id)?.parentElement?.querySelector('label')||document.querySelector('label[for="'+id+'"]');
}

function applyUnits(){
 const type=document.getElementById('materialType')?.value==='resin'?'resin':'filament';
 const imp=pref.units==='imperial';
 unitFields.forEach(id=>{
  const src=document.getElementById(id);
  if(!src)return;
  let p=document.getElementById('ppUnit_'+id);
  if(imp){
   if(!p){
    p=document.createElement('input');
    p.id='ppUnit_'+id;p.type='number';p.min='0';
    p.step=id==='materialPack'?'1':'0.01';p.className='ppPreferenceInput';
    src.insertAdjacentElement('afterend',p);src.style.display='none';
    p.addEventListener('input',()=>{
     const v=Number(p.value)||0;
     src.value=String(type==='resin'?v*29.5735295625:v*28.349523125);
     src.dispatchEvent(new Event('input',{bubbles:true}));
    });
   }
   p.value=(type==='resin'?Number(src.value||0)/29.5735295625:Number(src.value||0)/28.349523125).toFixed(id==='materialPack'?0:2);
  }else{
   if(p){p.remove();src.style.display='';}
  }
 });
 const l1=labelFor('materialPack'),l2=labelFor('materialUsed');
 if(l1)l1.textContent=imp?'Spool weight (oz)':type==='resin'?'Bottle volume (ml)':'Spool weight (g)';
 if(l2)l2.textContent=imp?(type==='resin'?'Used per print (fl oz)':'Used per print (oz)'):(type==='resin'?'Used per print (ml)':'Used per print (g)');
}

function currency(){
 // Standalone retailer comparisons use native GBP prices, not calculator totals.
 if(document.getElementById('ppSiteHeader'))return;
 const meta=currencies[pref.currency]||currencies.GBP;
 const rate=Number(pref.rate)>0?Number(pref.rate):1;
 moneyFields.forEach(id=>{
  const src=document.getElementById(id);if(!src)return;
  let p=document.getElementById('ppCur_'+id);
  if(pref.currency==='GBP'){
   if(p){p.remove();src.style.display='';}
  }else{
   if(!p){
    p=document.createElement('input');p.id='ppCur_'+id;p.type='number';p.min='0';
    p.step=src.step||'0.01';p.className='ppPreferenceInput';
    src.insertAdjacentElement('afterend',p);src.style.display='none';
    p.addEventListener('input',()=>{
     src.value=String((Number(p.value)||0)/(Number(pref.rate)>0?Number(pref.rate):1));
     src.dispatchEvent(new Event('input',{bubbles:true}));
    });
   }
   p.value=(Number(src.value||0)*rate).toFixed(2);
  }
 });
 const w=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);
 let n;
 while(n=w.nextNode()){
  if(!n.parentElement||n.parentElement.closest('script,style,#ppSettingsPanel'))continue;
  // Core results already use the selected currency. Convert only GBP source
  // copy; cached values could otherwise overwrite a newly calculated result.
  if(pref.currency==='GBP'||!n.nodeValue.includes('£'))continue;
  const next=n.nodeValue.replace(/£\s*(-?[0-9][0-9,]*(?:\.[0-9]+)?)/g,(_,amount)=>
   new Intl.NumberFormat(meta.locale,{style:'currency',currency:pref.currency,minimumFractionDigits:2,maximumFractionDigits:2}).format(Number(amount.replace(/,/g,''))*rate));
  if(window.__ppSetI18nRenderedText)window.__ppSetI18nRenderedText(n,next);else n.nodeValue=next;
 }
 document.querySelectorAll('input[readonly]').forEach(el=>{
  const s=el.value||'',m=s.match(/£\s*(-?[0-9][0-9,]*(?:\.[0-9]+)?)/);
  if(m&&pref.currency!=='GBP')el.value=new Intl.NumberFormat(meta.locale,{style:'currency',currency:pref.currency,minimumFractionDigits:2,maximumFractionDigits:2}).format(Number(m[1].replace(/,/g,''))*rate);
 });
 // Change the currency unit in label text nodes, preserving nested inputs.
 // Treat zł as a whole symbol; z and ł are ordinary Polish letters.
 const symbols=[...new Set(Object.values(currencies).map(item=>item.symbol))]
  .sort((a,b)=>b.length-a.length).map(symbol=>symbol.replace(/[.*+?^${}()|[\]\\]/g,'\\$&'));
 const units=new RegExp('\\((?:'+symbols.join('|')+')(\\/[^)]+)?\\)','g');
 const labels=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);
 let label;
 while(label=labels.nextNode()){
  if(!label.parentElement?.closest('label')||label.parentElement.closest('#ppSettingsPanel'))continue;
  const next=label.nodeValue.replace(units,(_,suffix)=>'('+meta.symbol+(suffix||'')+')');
  if(window.__ppSetI18nRenderedText)window.__ppSetI18nRenderedText(label,next);else label.nodeValue=next;
 }
}
window.__ppAfterI18n=currency;

function ensureApplyButton(){
 const body=document.querySelector('#ppSettingsPanel .pp-settings-body');
 if(!body)return null;
 let btn=document.getElementById('ppSettingsApply');
 if(btn){
  // clean-top.js owns the actual click event. This helper only makes sure
  // a button exists; having two click handlers here caused settings to be
  // applied twice and made the modal behaviour unreliable.
  btn.textContent='Apply Changes';
  return btn;
 }
 const reset=document.getElementById('ppSettingsReset');
 btn=document.createElement('button');
 btn.type='button';btn.id='ppSettingsApply';btn.className='pp-settings-apply';
 btn.textContent='Apply Changes';
 btn.style.cssText='display:block;width:100%;margin:8px 0 4px;padding:12px 16px;border:1px solid #ff7800;border-radius:10px;background:#ff7800;color:#fff;font:800 12px Inter,Segoe UI,system-ui,sans-serif;cursor:pointer;box-shadow:0 8px 24px #ff780022;';
 if(reset&&reset.parentElement)reset.parentElement.insertAdjacentElement('afterend',btn);else body.appendChild(btn);
 btn.addEventListener('click',(event)=>{
  event.preventDefault();
  event.stopPropagation();
  window.__applyPrintProfitSettings?.();
 });
 return btn;
}

function refreshDraftControls(){
 exchangeRateNote();
 const dark=document.getElementById('ppSettingsDark'),lang=document.getElementById('ppSettingsLanguage'),units=document.getElementById('ppSettingsUnits'),cur=document.getElementById('ppSettingsCurrency'),rate=document.getElementById('ppSettingsRate');
 if(dark)dark.checked=!!draft.dark;
 if(lang)lang.value=draft.language;
 if(units)units.value=draft.units;
 if(cur)cur.value=draft.currency;
 if(rate)rate.value=String(draft.rate);
}

function applyDraft(){
 const dark=document.getElementById('ppSettingsDark');
 const lang=document.getElementById('ppSettingsLanguage');
 const units=document.getElementById('ppSettingsUnits');
 const cur=document.getElementById('ppSettingsCurrency');
 const rate=document.getElementById('ppSettingsRate');

 // Read ALL controls at the moment Apply is pressed. Nothing is committed
 // while the user is merely changing a dropdown/switch.
 draft={
  dark:!!dark?.checked,
  language:lang?.value||'en',
  units:units?.value||'metric',
  currency:cur?.value||'GBP',
  rate:1
 };
 const entered=Number(rate?.value);
 draft.rate=entered>0?entered:(currencies[draft.currency]?.rate||1);

 // Commit the complete settings object first so every other calculator
 // script sees the same preferences.
 pref=Object.assign({},defaults,draft);
 save();

 // Apply the four visible behaviours immediately.
 setTheme();
 translatePage();
 applyUnits();
 currency();

 // The calculator is the source of truth for result values. Trigger its
 // normal Calculate action after localStorage has been updated so currency,
 // exchange rate and all dependent totals are recalculated together.
 const calcButton=document.getElementById('calc');
 if(calcButton) calcButton.click();

 // Re-apply translations after Calculate writes fresh English status labels.
 setTheme();
 translatePage();
 applyUnits();
 currency();
 document.dispatchEvent(new CustomEvent('printprofit-settings-changed'));

 const b=document.getElementById('ppSettingsApply');
 if(b){b.textContent='Apply Changes';b.style.transform='scale(.98)';setTimeout(()=>b.style.transform='',120);}
}
window.__applyPrintProfitSettings=applyDraft;
document.addEventListener('printprofit-settings-apply',applyDraft);

function bind(){
 const dark=document.getElementById('ppSettingsDark'),lang=document.getElementById('ppSettingsLanguage'),units=document.getElementById('ppSettingsUnits'),cur=document.getElementById('ppSettingsCurrency'),rate=document.getElementById('ppSettingsRate');
 if(!dark||!lang||!units||!cur||!rate)return;
 ensureApplyButton();

 if(dark.dataset.ppBound!=='1'){dark.dataset.ppBound='1';dark.addEventListener('change',()=>{setDarkMode(dark.checked);});}
 if(lang.dataset.ppBound!=='1'){lang.dataset.ppBound='1';lang.addEventListener('change',()=>{draft.language=lang.value;});}
 if(units.dataset.ppBound!=='1'){units.dataset.ppBound='1';units.addEventListener('change',()=>{draft.units=units.value;});}
 if(cur.dataset.ppBound!=='1'){cur.dataset.ppBound='1';cur.addEventListener('change',()=>{draft.currency=cur.value;draft.rate=currencies[draft.currency]?.rate||1;if(rate)rate.value=String(draft.rate);});}
 if(rate.dataset.ppBound!=='1'){rate.dataset.ppBound='1';rate.addEventListener('input',()=>{const v=Number(rate.value);if(v>0)draft.rate=v;});}
}

function boot(){
  // Settings are deliberately event-driven. Older versions used a MutationObserver
  // plus a one-second rebinding loop, which created competing DOM/event work.
  bind();
  setTheme();
  translatePage();
  watchTranslations();
  applyUnits();
  currency();

  document.addEventListener('printprofit-settings-open',()=>{
    pref=load();
    draft=Object.assign({},pref);
    refreshDraftControls();
    bind();
  });
  window.addEventListener('storage',event=>{if(event.key===KEY){pref=load();draft=Object.assign({},pref);setTheme();translatePage();}});
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();})();

