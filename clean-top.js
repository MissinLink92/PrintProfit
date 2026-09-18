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
        <img src="./assets/printprofit-header-reference.webp?v=2" alt="PrintProfit">
      </a>
      <nav class="pp-top-links" aria-label="Main navigation">
        <button type="button" data-target="details"><span class="pp-nav-icon calculator"></span><span>Calculate</span></button>
        <button type="button" data-target="machine"><span class="pp-nav-icon cube"></span><span>Price</span></button>
        <button type="button" data-target="costs"><span class="pp-nav-icon chart"></span><span>Profit</span></button>
        <button type="button" data-target="settings"><span class="pp-nav-icon gear"></span><span>Settings</span></button>
      </nav>
    </div>
    <div class="pp-filament-motion" aria-hidden="true">
      <div class="pp-filament-glow"></div>
      <svg viewBox="0 0 900 300" preserveAspectRatio="none" role="presentation">
        <defs>
          <filter id="ppGlow"><feGaussianBlur stdDeviation="4"/></filter>
          <linearGradient id="ppFilamentGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stop-color="#ff7800" stop-opacity=".12"/>
            <stop offset="38%" stop-color="#ff7800" stop-opacity=".55"/>
            <stop offset="72%" stop-color="#ff9b42" stop-opacity=".9"/>
            <stop offset="100%" stop-color="#ff7800" stop-opacity=".18"/>
          </linearGradient>
        </defs>
        <g class="pp-filament-soft" filter="url(#ppGlow)">
          <path d="M40 196 C165 58, 280 40, 430 154 S690 266, 860 104"/>
          <path d="M28 228 C170 90, 290 74, 428 170 S692 292, 870 132"/>
          <path d="M42 166 C165 24, 300 24, 442 132 S685 236, 860 80"/>
        </g>
        <g class="pp-filament-main">
          <path d="M40 196 C165 58, 280 40, 430 154 S690 266, 860 104"/>
          <path d="M28 228 C170 90, 290 74, 428 170 S692 292, 870 132"/>
          <path d="M42 166 C165 24, 300 24, 442 132 S685 236, 860 80"/>
          <path d="M60 210 C190 102, 294 68, 452 148 S684 250, 820 112"/>
        </g>
      </svg>
      <div class="pp-spool">
        <div class="pp-spool-core"></div>
        <div class="pp-spool-ring pp-spool-ring-a"></div>
        <div class="pp-spool-ring pp-spool-ring-b"></div>
        <div class="pp-spool-label">FILAMENT</div>
      </div>
    </div>

    <div class="pp-top-body">
div>
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
        <img src="./assets/printprofit-header-reference.webp?v=2" alt="PrintProfit 3D Printing Cost & Pricing Calculator">
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
    #ppCleanTop .pp-top-brand{display:block;width:255px;height:52px;overflow:hidden;text-decoration:none}
    #ppCleanTop .pp-top-brand img{width:255px;height:89px;object-fit:contain;object-position:center;display:block;transform:translateY(-18px)}
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
    #ppCleanTop .pp-filament-motion{position:absolute;inset:58px 3.3% 3px 22%;z-index:1;pointer-events:none;overflow:hidden}
    #ppCleanTop .pp-filament-motion svg{position:absolute;inset:0;width:100%;height:100%;overflow:visible}
    #ppCleanTop .pp-filament-main path{fill:none;stroke:url(#ppFilamentGrad);stroke-width:2.5;stroke-linecap:round;opacity:.74}
    #ppCleanTop .pp-filament-soft path{fill:none;stroke:#ff7800;stroke-width:8;stroke-linecap:round;opacity:.14}
    #ppCleanTop .pp-filament-glow{position:absolute;right:18%;top:21%;width:300px;height:190px;border-radius:50%;background:radial-gradient(circle,rgba(255,120,0,.10),transparent 68%);filter:blur(10px)}
    #ppCleanTop .pp-spool{position:absolute;right:17%;top:17%;width:126px;height:164px;border-radius:50%/11%;background:linear-gradient(90deg,#3d2b1e 0%,#9a5a25 16%,#ff9b42 27%,#613518 52%,#ff9b42 74%,#6f3d1e 88%,#33251d 100%);box-shadow:inset 0 0 0 2px rgba(255,167,88,.18),0 12px 35px rgba(0,0,0,.42),0 0 28px rgba(255,120,0,.10);transform:rotate(4deg);opacity:.92}
    #ppCleanTop .pp-spool:before,#ppCleanTop .pp-spool:after{content:"";position:absolute;left:0;right:0;height:31px;border-radius:50%;border:2px solid rgba(255,159,77,.38);background:linear-gradient(180deg,#7a4621,#2a1d17);box-shadow:inset 0 0 0 6px rgba(0,0,0,.18)}
    #ppCleanTop .pp-spool:before{top:-4px}
    #ppCleanTop .pp-spool:after{bottom:-4px}
    #ppCleanTop .pp-spool-ring{position:absolute;left:19px;right:19px;border-radius:50%;border:2px solid rgba(255,176,94,.32);height:26px}
    #ppCleanTop .pp-spool-ring-a{top:22px}
    #ppCleanTop .pp-spool-ring-b{bottom:22px}
    #ppCleanTop .pp-spool-core{position:absolute;left:43px;top:51px;width:40px;height:62px;border-radius:50%/24%;border:3px solid rgba(255,174,89,.5);background:#161318;box-shadow:inset 0 0 0 7px rgba(255,120,0,.10),0 0 18px rgba(255,120,0,.10)}
    #ppCleanTop .pp-spool-label{position:absolute;left:16px;right:16px;top:67px;text-align:center;color:#ffd0a1;font-size:8px;font-weight:900;letter-spacing:.18em;opacity:.75}
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
    @media(max-width:800px){#ppCleanTop .pp-filament-motion{display:none}#ppCleanTop{min-height:0}#ppCleanTop .pp-top-nav{height:auto;min-height:62px;padding:5px 14px;flex-wrap:wrap}#ppCleanTop .pp-top-brand{width:210px}#ppCleanTop .pp-top-brand img{width:210px}#ppCleanTop .pp-top-links{width:100%;margin:0;justify-content:space-between;overflow:auto}#ppCleanTop .pp-top-links button{padding:6px 8px;font-size:11px}#ppCleanTop .pp-top-body{grid-template-columns:1fr;padding:16px 18px 20px}#ppCleanTop .pp-top-card{width:100%;max-width:425px;justify-self:center}#ppCleanTop h1{font-size:38px}.pp-desktop{display:none}}
    @media(max-width:520px){#ppCleanTop h1{font-size:32px}.pp-eyebrow{font-size:9px!important}.pp-top-copy>p{font-size:14px!important}.pp-feature-strip{gap:8px!important}.pp-feature-strip>div{min-width:0!important}.pp-feature-strip i{display:none!important}#ppCleanTop .pp-top-card{height:255px}#ppCleanTop .pp-top-card img{width:270px;height:170px}.pp-card-tagline{font-size:18px!important;width:250px!important}}
  `;
  document.head.appendChild(style);

  const go=(target)=>{
    const tab=document.querySelector('.pp-step[data-tab="'+target+'"]');
    if(tab){tab.click();return;}
    const el=document.getElementById(target);
    if(el)el.scrollIntoView({behavior:'smooth',block:'start'});
  };
  top.querySelectorAll('[data-target]').forEach(el=>el.addEventListener('click',()=>go(el.dataset.target)));
  return true;
}

function boot(){
  if(install())return;
  const started=Date.now();
  const timer=setInterval(()=>{if(install()||Date.now()-started>15000)clearInterval(timer)},50);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
