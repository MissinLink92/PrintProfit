(()=>{'use strict';
if(window.__printProfitVisualMaster)return;window.__printProfitVisualMaster=true;

const icons={
calculator:'<svg viewBox="0 0 48 48" aria-hidden="true"><rect x="11" y="5" width="26" height="38" rx="4"/><rect x="16" y="10" width="16" height="8" rx="1"/><path d="M17 24h3m4 0h3m4 0h0M17 30h3m4 0h3m4 0h0M17 36h3m4 0h3"/></svg>',
cube:'<svg viewBox="0 0 48 48" aria-hidden="true"><path d="m24 5 17 9.5v19L24 43 7 33.5v-19L24 5Z"/><path d="m7 14.5 17 10 17-10M24 24.5V43"/></svg>',
chart:'<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M8 40V8M8 40h33"/><path d="m13 32 8-9 6 5 11-15"/><path d="M32 13h6v6"/></svg>',
gear:'<svg viewBox="0 0 48 48" aria-hidden="true"><path d="m24 6 3 4.3 5.1-.2 1.7 4.8 4.7 2.1-1.3 4.9 3 4.1-3 4.1 1.3 4.9-4.7 2.1-1.7 4.8-5.1-.2-3 4.3-3-4.3-5.1.2-1.7-4.8-4.7-2.1 1.3-4.9-3-4.1 3-4.1-1.3-4.9 4.7-2.1 1.7-4.8 5.1.2L24 6Z"/><circle cx="24" cy="24" r="6"/></svg>',
folder:'<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M6 13a4 4 0 0 1 4-4h10l4 5h14a4 4 0 0 1 4 4v17a4 4 0 0 1-4 4H10a4 4 0 0 1-4-4V13Z"/></svg>'
};
const svg=n=>icons[n]||icons.cube;
const goStage=n=>document.querySelector('.pp-step[data-tab="'+n+'"]')?.click();

function build(){
document.getElementById('ppCleanTop')?.remove();
document.getElementById('pp-master-quickcards')?.remove();
document.querySelectorAll('#ppProgressHost,#ppSetupProgress,.pp-progress,.pp-progress-host').forEach(e=>e.style.setProperty('display','none','important'));
document.getElementById('ppVisualMaster')?.remove();

const top=document.createElement('section');
top.id='ppVisualMaster';
top.setAttribute('aria-label','PrintProfit introduction');

top.innerHTML='<header class="pvm-header"><a class="pvm-brand" href="#home"><img src="./assets/printprofit-header-logo.webp?v=5" alt="PrintProfit"><span class="pvm-brand-fallback">PrintProfit</span></a>'+
'<nav class="pvm-nav"><button type="button" data-a="calculate"><span class="pvm-icon">'+svg('calculator')+'</span>Calculate</button><button type="button" data-a="compare"><span class="pvm-icon">'+svg('cube')+'</span>Compare Products</button><button type="button" data-a="guide"><span class="pvm-icon">'+svg('calculator')+'</span>Guide &amp; Help</button><button type="button" data-a="settings"><span class="pvm-icon">'+svg('gear')+'</span>Settings</button></nav>'+
'<div class="pvm-prefs"><label class="pvm-dark"><span>◐</span><b>Dark Mode</b><input id="pvmDarkMode" type="checkbox"><i></i></label><label class="pvm-language"><span class="pvm-flag"></span><select id="pvmLanguage"><option value="en">EN</option><option value="pl">PL</option><option value="de">DE</option><option value="fr">FR</option><option value="es">ES</option><option value="it">IT</option><option value="nl">NL</option><option value="pt">PT</option><option value="cs">CS</option><option value="sv">SV</option><option value="da">DA</option></select><em>⌄</em></label></div></header>'+
'<div class="pvm-hero"><img class="pvm-bg" src="./assets/hero-approved.webp?v=3" alt="" aria-hidden="true"><div class="pvm-overlay"></div><div class="pvm-copy"><div class="pvm-kicker">3D PRINTING PRICING, MADE SIMPLE</div><h1>Know what it costs.<br><strong>Know what to charge.</strong></h1><p>Accurate 3D printing cost and pricing calculations to help you<br class="pvm-desktop"> price with confidence and maximise your profit.</p><div class="pvm-actions"><button type="button" class="pvm-primary" data-a="calculate"><span>'+svg('calculator')+'</span>Start Calculating <b>›</b></button><button type="button" class="pvm-projects" data-a="projects"><span>'+svg('folder')+'</span>My Projects</button></div></div>'+
'<aside class="pvm-card"><div class="pvm-tagline">Print Smarter.<br>Price Better.<br>Profit More.</div><div class="pvm-card-strip"><div><span>'+svg('calculator')+'</span><strong>Calculate<small>Costs</small></strong></div><i></i><div><span>'+svg('cube')+'</span><strong>Price<small>Your Prints</small></strong></div><i></i><div><span>'+svg('chart')+'</span><strong>Maximise<small>Profit</small></strong></div><i></i><div><span>'+svg('gear')+'</span><strong>Built<small>For Makers</small></strong></div></div></aside></div>'+
'<div class="pvm-journey"><button type="button" data-stage="details"><span class="n one">1</span><span class="jicon">'+svg('cube')+'</span><span><strong>Your Model</strong><small>Upload your print &amp; view its data</small></span></button><em>→</em><button type="button" data-stage="machine"><span class="n two">2</span><span class="jicon">'+svg('calculator')+'</span><span><strong>Print Setup</strong><small>Choose your printer &amp; material</small></span></button><em>→</em><button type="button" data-stage="costs"><span class="n three">3</span><span class="jicon">'+svg('chart')+'</span><span><strong>Costs &amp; Fees</strong><small>Add your business costs</small></span></button><em>→</em><button type="button" data-stage="results"><span class="n four">4</span><span class="jicon">'+svg('gear')+'</span><span><strong>Results</strong><small>Review cost, price &amp; profit</small></span></button></div>';

document.body.insertBefore(top,document.body.querySelector('.shell')||document.body.firstChild);

const style=document.createElement('style');
style.id='ppVisualMasterStyles';
style.textContent=
'#ppVisualMaster{width:100%;background:#071018;color:#f5f8fb;font-family:Inter,Segoe UI,system-ui,sans-serif}'+
'#ppVisualMaster *{box-sizing:border-box}#ppVisualMaster button,#ppVisualMaster select{font:inherit}'+
'#ppVisualMaster .pvm-header{height:58px;display:flex;align-items:center;gap:16px;padding:0 clamp(18px,3vw,48px);background:rgba(5,14,20,.98);border-bottom:1px solid #294653;position:relative;z-index:10}'+
'#ppVisualMaster .pvm-brand{width:205px;height:46px;display:flex;align-items:center;flex:0 0 205px;position:relative;text-decoration:none}.pvm-brand img{width:100%;height:46px;object-fit:contain;object-position:left center}.pvm-brand-fallback{display:none;position:absolute;left:0;color:#f5f8fb;font-size:20px;font-weight:900}'+
'#ppVisualMaster .pvm-nav{display:flex;align-items:center;justify-content:center;gap:5px;flex:1;min-width:0}.pvm-nav button{height:48px;padding:0 13px;border:1px solid transparent;border-radius:12px;background:transparent;color:#e1ebef;display:inline-flex;align-items:center;gap:8px;cursor:pointer;font-size:13px;font-weight:850;white-space:nowrap}.pvm-nav button:hover{background:#ff78000f;color:#fff}.pvm-nav button:first-child{border-color:#ff7800;background:#0c1820}'+
'#ppVisualMaster .pvm-icon{width:27px;height:27px;display:grid;place-items:center;color:#ff7800}.pvm-icon svg{width:24px;height:24px;fill:none;stroke:currentColor;stroke-width:2.25;stroke-linecap:round;stroke-linejoin:round}'+
'#ppVisualMaster .pvm-prefs{display:flex;align-items:center;gap:9px;flex:0 0 auto}.pvm-dark,.pvm-language{height:38px;display:flex;align-items:center;gap:7px;border:1px solid #24485a;border-radius:12px;background:#071b27;color:#dce8ee;cursor:pointer}.pvm-dark{padding:0 9px;font-size:11px}.pvm-dark input{position:absolute;opacity:0;pointer-events:none}.pvm-dark i{width:36px;height:20px;border-radius:999px;background:#385361;padding:2px;display:flex;align-items:center}.pvm-dark i:after{content:"";width:16px;height:16px;border-radius:50%;background:#f1f7fa;transform:translateX(0);transition:.18s}.pvm-dark input:checked+i{background:#18bde8}.pvm-dark input:checked+i:after{transform:translateX(16px)}'+
'#ppVisualMaster .pvm-language{padding:0 9px}.pvm-language select{appearance:none;background:transparent;border:0;outline:0;color:#e8f1f4;font-size:12px;font-weight:850;width:40px}.pvm-language em{font-style:normal;color:#849daa}'+
'#ppVisualMaster .pvm-flag{width:22px;height:16px;display:block;overflow:hidden;border-radius:2px;box-shadow:0 0 0 1px #fff2}.pvm-flag svg{width:22px;height:16px;display:block}'+
'#ppVisualMaster .pvm-hero{position:relative;height:410px;overflow:hidden;display:grid;grid-template-columns:minmax(0,1fr) 450px;gap:34px;align-items:stretch;padding:18px clamp(30px,4vw,52px) 16px}'+
'#ppVisualMaster .pvm-bg{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:center 57%;filter:contrast(1.08) saturate(1.12) brightness(.98);z-index:0}.pvm-overlay{position:absolute;inset:0;background:linear-gradient(90deg,rgba(4,11,16,.98) 0%,rgba(4,11,16,.86) 30%,rgba(4,11,16,.38) 58%,rgba(4,11,16,.12) 100%),linear-gradient(180deg,rgba(4,11,16,.12),rgba(4,11,16,.30));z-index:1}'+
'#ppVisualMaster .pvm-copy,#ppVisualMaster .pvm-card{position:relative;z-index:2}.pvm-copy{padding-top:56px;max-width:760px}.pvm-kicker{font-size:11px;font-weight:950;letter-spacing:.18em;color:#ff7800;margin-bottom:10px}'+
'#ppVisualMaster h1{margin:0 0 14px;font-size:clamp(48px,5.4vw,72px);line-height:.94;letter-spacing:-.05em;color:#f7f9fa;font-weight:950}.pvm-copy h1 strong{color:#ff7800}.pvm-copy>p{margin:0;color:#bfd0d8;font-size:16px;line-height:1.45}'+
'#ppVisualMaster .pvm-actions{display:flex;gap:12px;margin-top:20px}.pvm-actions button{height:48px;border-radius:12px;padding:0 17px;display:flex;align-items:center;gap:9px;cursor:pointer;font-size:13px;font-weight:900}.pvm-primary{border:1px solid #ff7800;background:linear-gradient(135deg,#ff9a3f,#ff7800);color:#fff;box-shadow:0 10px 22px #ff780028}.pvm-projects{border:1px solid #355564;background:#0a202cdd;color:#edf4f7}.pvm-primary svg,.pvm-projects svg{width:20px;height:20px;fill:none;stroke:#fff;stroke-width:2.2}'+
'#ppVisualMaster .pvm-card{width:450px;min-width:385px;height:260px;align-self:center;border:1px solid #2b5363;border-radius:24px;background:rgba(6,20,29,.60);backdrop-filter:blur(8px);box-shadow:inset 0 1px 0 #fff10,0 24px 60px #0009;overflow:hidden}'+
'#ppVisualMaster .pvm-tagline{position:absolute;left:22px;right:22px;top:22px;bottom:86px;display:flex;align-items:center;justify-content:center;text-align:center;color:#ff8f24;font-family:"Brush Script MT","Segoe Script",cursive;font-size:28px;line-height:1.02;font-style:italic;transform:rotate(-2deg);text-shadow:0 3px 16px #000c;z-index:3}'+
'#ppVisualMaster .pvm-card-strip{position:absolute;left:12px;right:12px;bottom:10px;height:76px;border-top:1px solid #294957;display:grid;grid-template-columns:repeat(7,1fr);align-items:stretch;padding-top:6px}.pvm-card-strip>div{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;text-align:center}.pvm-card-strip>i{width:1px;height:46px;background:#294957;align-self:center}.pvm-card-strip svg{width:25px;height:25px;fill:none;stroke:#ff7800;stroke-width:2.25;stroke-linecap:round;stroke-linejoin:round}.pvm-card-strip>div:nth-child(3) svg{stroke:#ff9a42}.pvm-card-strip>div:nth-child(5) svg{stroke:#35d07f}.pvm-card-strip>div:nth-child(7) svg{stroke:#a77cff}.pvm-card-strip strong{color:#f2f6f8;font-size:8px;line-height:1.03;white-space:nowrap}.pvm-card-strip small{display:block;color:#9cb0b9;font-size:7px;font-weight:520;margin-top:2px}'+
'#ppVisualMaster .pvm-journey{display:grid;grid-template-columns:minmax(0,1fr) 28px minmax(0,1fr) 28px minmax(0,1fr) 28px minmax(0,1fr);align-items:center;gap:10px;width:min(1140px,calc(100% - 32px));margin:-1px auto 20px;padding-top:12px;position:relative;z-index:4}.pvm-journey button{position:relative;min-width:0;min-height:96px;border:1px solid #2c5260;border-radius:15px;background:linear-gradient(180deg,#0d2330,#091821);color:#fff;padding:13px 16px;display:flex;align-items:center;gap:12px;text-align:left;cursor:pointer;box-shadow:0 10px 24px #0005}.pvm-journey button:hover{transform:translateY(-2px);border-color:#ff780077}.pvm-journey em{width:28px;height:28px;border:1px solid #355564;border-radius:50%;display:grid;place-items:center;background:#07131b;color:#ff7800;font-size:15px;font-style:normal;font-weight:900}.pvm-journey .n{position:absolute;left:-10px;top:-10px;width:25px;height:25px;padding:0!important;border-radius:50%;display:flex!important;align-items:center!important;justify-content:center!important;text-align:center!important;line-height:1!important;color:#fff;font-size:11px;font-weight:950;border:2px solid #071018;box-shadow:0 0 0 3px #071018;font-family:Inter,Segoe UI,system-ui,sans-serif}.pvm-journey .one{background:#16c5e9}.pvm-journey .two{background:#a174ff}.pvm-journey .three{background:#2fd177}.pvm-journey .four{background:#ff8618}.pvm-journey .jicon{width:46px;height:46px;min-width:46px;border:1px solid currentColor;border-radius:12px;display:grid;place-items:center;color:#19c8ff}.pvm-journey button:nth-of-type(2) .jicon{color:#a77cff}.pvm-journey button:nth-of-type(3) .jicon{color:#35d07f}.pvm-journey button:nth-of-type(4) .jicon{color:#ff8618}.pvm-journey .jicon svg{width:28px;height:28px;fill:none;stroke:currentColor;stroke-width:2.2;stroke-linecap:round;stroke-linejoin:round}.pvm-journey strong{display:block;font-size:14px}.pvm-journey small{display:block;margin-top:4px;color:#9db0ba;font-size:10px;line-height:1.25}'+
'@media(max-width:1180px){#ppVisualMaster .pvm-brand{width:165px;flex-basis:165px}#ppVisualMaster .pvm-hero{grid-template-columns:minmax(0,1fr) 405px;gap:24px;padding-inline:30px}#ppVisualMaster .pvm-card{width:405px;min-width:365px}.pvm-copy{padding-top:50px}.pvm-copy h1{font-size:54px}}'+
'@media(max-width:900px){#ppVisualMaster .pvm-header{height:auto;min-height:64px;flex-wrap:wrap;padding-block:6px}#ppVisualMaster .pvm-nav{order:3;width:100%;overflow:auto;justify-content:flex-start}#ppVisualMaster .pvm-prefs{margin-left:auto}#ppVisualMaster .pvm-hero{height:auto;min-height:670px;grid-template-columns:1fr;padding:24px 18px 120px}.pvm-copy{padding-top:28px}.pvm-copy h1{font-size:46px}#ppVisualMaster .pvm-card{justify-self:center;width:min(450px,92vw);min-width:0;height:250px}.pvm-journey{grid-template-columns:1fr;gap:12px;width:calc(100% - 20px)}.pvm-journey em{justify-self:center;transform:rotate(90deg)}}'+
'@media(max-width:560px){#ppVisualMaster .pvm-brand{width:140px;flex-basis:140px}#ppVisualMaster .pvm-nav button{font-size:10px;padding-inline:7px;height:42px}#ppVisualMaster .pvm-prefs .pvm-dark b{display:none}#ppVisualMaster .pvm-hero{min-height:650px;padding-bottom:118px}.pvm-copy h1{font-size:39px}.pvm-copy>p{font-size:14px}.pvm-tagline{font-size:22px}.pvm-card{height:230px}.pvm-card-strip{height:66px}.pvm-card-strip svg{width:21px;height:21px}.pvm-card-strip strong{font-size:7px}.pvm-card-strip small{font-size:6px}.pvm-actions{flex-wrap:wrap}}';
style.textContent += '#ppVisualMaster .pvm-tagline{font-family:"Segoe UI",Arial,sans-serif!important;font-size:34px!important;font-weight:800!important;line-height:1.06!important;font-style:italic!important;transform:rotate(-2deg)!important;letter-spacing:.01em!important;text-rendering:geometricPrecision!important;-webkit-font-smoothing:antialiased!important}'+
'#about.result .head>.icon,#about.result .head>.pp-pretty-icon{width:50px!important;height:50px!important;min-width:50px!important;display:grid!important;place-items:center!important;border-radius:12px!important;background:#ff780012!important;border:2px solid #ff7800!important;color:#fff!important;box-shadow:0 8px 18px rgba(0,0,0,.28),0 0 18px rgba(255,120,0,.12)!important;overflow:visible!important}'+
'#about.result .head>.icon svg,#about.result .head>.pp-pretty-icon svg{width:31px!important;height:31px!important;display:block!important;fill:none!important;stroke:#f7f9fa!important;stroke-width:2.45!important;stroke-linecap:round!important;stroke-linejoin:round!important}'+
'#about.result .head>.icon::before,#about.result .head>.icon::after,#about.result .head>.pp-pretty-icon::before,#about.result .head>.pp-pretty-icon::after{display:none!important;content:none!important}';
document.head.appendChild(style);

const img=top.querySelector('.pvm-brand img');if(img)img.addEventListener('error',()=>{img.style.display='none';top.querySelector('.pvm-brand-fallback').style.display='block'});

const flags={
en:'<svg viewBox="0 0 24 16"><rect width="24" height="16" fill="#123b78"/><path d="M0 0 24 16M24 0 0 16" stroke="#fff" stroke-width="5"/><path d="M0 0 24 16M24 0 0 16" stroke="#c8102e" stroke-width="2"/><path d="M12 0v16M0 8h24" stroke="#fff" stroke-width="6"/><path d="M12 0v16M0 8h24" stroke="#c8102e" stroke-width="3"/></svg>',
pl:'<svg viewBox="0 0 24 16"><path fill="#fff" d="M0 0h24v8H0z"/><path fill="#dc143c" d="M0 8h24v8H0z"/></svg>',
de:'<svg viewBox="0 0 24 16"><path fill="#111" d="M0 0h24v5.33H0z"/><path fill="#d00" d="M0 5.33h24v5.34H0z"/><path fill="#ffce00" d="M0 10.67h24V16H0z"/></svg>',
fr:'<svg viewBox="0 0 24 16"><path fill="#0055a4" d="M0 0h8v16H0z"/><path fill="#fff" d="M8 0h8v16H8z"/><path fill="#ef4135" d="M16 0h8v16h-8z"/></svg>',
es:'<svg viewBox="0 0 24 16"><path fill="#aa151b" d="M0 0h24v4H0z"/><path fill="#f1bf00" d="M0 4h24v8H0z"/><path fill="#aa151b" d="M0 12h24v4H0z"/></svg>',
it:'<svg viewBox="0 0 24 16"><path fill="#009246" d="M0 0h8v16H0z"/><path fill="#fff" d="M8 0h8v16H8z"/><path fill="#ce2b37" d="M16 0h8v16h-8z"/></svg>',
nl:'<svg viewBox="0 0 24 16"><path fill="#ae1c28" d="M0 0h24v5.33H0z"/><path fill="#fff" d="M0 5.33h24v5.34H0z"/><path fill="#21468b" d="M0 10.67h24V16H0z"/></svg>',
pt:'<svg viewBox="0 0 24 16"><path fill="#046a38" d="M0 0h10v16H0z"/><path fill="#da291c" d="M10 0h14v16H10z"/><circle cx="10" cy="8" r="3" fill="#f9e300"/></svg>',
cs:'<svg viewBox="0 0 24 16"><path fill="#fff" d="M0 0h24v8H0z"/><path fill="#d7141a" d="M0 8h24v8H0z"/><path fill="#11457e" d="M0 0l11 8L0 16z"/></svg>',
sv:'<svg viewBox="0 0 24 16"><rect width="24" height="16" fill="#006aa7"/><path stroke="#fecc00" stroke-width="3" d="M8 0v16M0 8h24"/></svg>',
da:'<svg viewBox="0 0 24 16"><rect width="24" height="16" fill="#c8102e"/><path stroke="#fff" stroke-width="3" d="M8 0v16M0 8h24"/></svg>'
};
const lang=top.querySelector('#pvmLanguage');
const flagEl=top.querySelector('.pvm-flag');
const setFlag=()=>{if(!flagEl)return;const code=String(lang?.value||'en').toLowerCase();flagEl.innerHTML=flags[code]||flags.en;flagEl.dataset.language=code;};

let prefs={};try{prefs=JSON.parse(localStorage.getItem('printprofit.preferences.v3')||'{}')||{}}catch(e){}
const dark=top.querySelector('#pvmDarkMode');if(dark)dark.checked=prefs.dark!==false;if(lang)lang.value=prefs.language||'en';setFlag();
dark?.addEventListener('change',()=>{let p={};try{p=JSON.parse(localStorage.getItem('printprofit.preferences.v3')||'{}')||{}}catch(e){}p.dark=dark.checked;localStorage.setItem('printprofit.preferences.v3',JSON.stringify(p));location.reload()});
lang?.addEventListener('input',setFlag);
lang?.addEventListener('change',()=>{setFlag();let p={};try{p=JSON.parse(localStorage.getItem('printprofit.preferences.v3')||'{}')||{}}catch(e){}p.language=String(lang.value||'en');localStorage.setItem('printprofit.preferences.v3',JSON.stringify(p));setTimeout(()=>location.reload(),120)});
window.addEventListener('pageshow',()=>{setFlag();setTimeout(setFlag,50);setTimeout(setFlag,250);});

top.querySelectorAll('[data-a]').forEach(b=>b.addEventListener('click',()=>{
const a=b.getAttribute('data-a');
if(a==='calculate')goStage('details');
else if(a==='compare')window.top.location.href='./price-finder.html';
else if(a==='guide'&&typeof window.__openPrintProfitGuide==='function')window.__openPrintProfitGuide();
else if(a==='settings'&&typeof window.__openPrintProfitSettings==='function')window.__openPrintProfitSettings();
else if(a==='projects'){b.setAttribute('data-target','projects');b.dispatchEvent(new Event('project-launch',{bubbles:true}))}
}));
top.querySelector('[data-a="projects"]')?.addEventListener('project-launch',()=>{const proxy=document.createElement('button');proxy.type='button';proxy.dataset.target='projects';proxy.hidden=true;document.body.appendChild(proxy);proxy.click();proxy.remove();});
top.querySelectorAll('[data-stage]').forEach(b=>b.addEventListener('click',e=>{e.preventDefault();goStage(b.getAttribute('data-stage'))}));
return true;
}
function boot(){if(build())return;const t=setInterval(()=>{if(build())clearInterval(t)},50);setTimeout(()=>clearInterval(t),12000)}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();})();