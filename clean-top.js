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
    <div class="pp-top-body">
      <div class="pp-hero-blueprint" aria-hidden="true">
        <svg viewBox="0 0 620 320" role="presentation">
          <g class="bp-lines">
            <path d="M88 246H520 M124 246V102 M496 246V102 M124 102H496"/>
            <path d="M158 222V128H462V222 M205 128V88H415V128"/>
            <path d="M188 222H432"/>
            <path d="M246 88V54H374V88"/>
            <path d="M280 54V30H340V54"/>
            <path d="M310 54V164"/>
            <path d="M278 164H342"/>
            <path d="M292 164L282 184H338L328 164"/>
            <path d="M188 205H432"/>
            <path d="M210 205L240 178H380L410 205"/>
            <path d="M240 178V166H380V178"/>
            <path d="M102 268H506"/>
            <path d="M102 263V273 M506 263V273"/>
          </g>
          <g class="bp-detail">
            <circle cx="178" cy="112" r="28"/>
            <circle cx="178" cy="112" r="11"/>
            <path d="M178 84V140 M150 112H206"/>
            <path d="M158 92L198 132 M198 92L158 132"/>
            <path d="M310 184C310 184 310 226 330 246"/>
            <circle cx="330" cy="246" r="4"/>
            <path d="M212 205V222 M240 205V222 M268 205V222 M296 205V222 M324 205V222 M352 205V222 M380 205V222 M408 205V222"/>
            <path d="M72 102H102 M72 246H102"/>
            <path d="M82 102V246 M77 102H87 M77 246H87"/>
          </g>
          <g class="bp-dash">
            <path d="M124 74H496"/>
            <path d="M132 66V82 M488 66V82"/>
            <path d="M458 270V296 M458 296H530"/>
            <path d="M520 290L530 296L520 302"/>
          </g>
          <g class="bp-labels">
            <text x="132" y="60">3D PRINTER / TECHNICAL VIEW</text>
            <text x="93" y="192" transform="rotate(-90 93 192)">BUILD HEIGHT</text>
            <text x="250" y="313">BUILD AREA</text>
            <text x="452" y="290">FILAMENT PATH</text>
            <text x="202" y="102">SPOOL</text>
            <text x="352" y="161">NOZZLE</text>
            <text x="376" y="224">PRINT BED</text>
            <text x="438" y="120">MATERIAL</text>
            <text x="438" y="139">COST</text>
            <text x="438" y="158">PRICE</text>
            <text x="438" y="177">PROFIT</text>
          </g>
        </svg>
      </div>
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
        <img src="./assets/hero-art-orange.webp?v=3" alt="PrintProfit 3D Printing Cost & Pricing Calculator">
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
    #ppCleanTop .pp-hero-blueprint{position:absolute;left:50%;top:60px;width:min(560px,46vw);height:285px;transform:translateX(-51%);z-index:1;opacity:.42;pointer-events:none;filter:drop-shadow(0 0 16px rgba(255,120,0,.05))}
    #ppCleanTop .pp-hero-blueprint svg{width:100%;height:100%;display:block}
    #ppCleanTop .pp-hero-blueprint .bp-lines{fill:none;stroke:#ff7800;stroke-width:1.4;vector-effect:non-scaling-stroke}
    #ppCleanTop .pp-hero-blueprint .bp-detail{fill:none;stroke:#ff9b42;stroke-width:1;vector-effect:non-scaling-stroke}
    #ppCleanTop .pp-hero-blueprint .bp-dash{fill:none;stroke:#7c9aaa;stroke-width:1;stroke-dasharray:5 6;opacity:.7;vector-effect:non-scaling-stroke}
    #ppCleanTop .pp-hero-blueprint .bp-labels{fill:#7f98a5;font:700 9px/1 Inter,Segoe UI,system-ui,sans-serif;letter-spacing:.14em}
    #ppCleanTop .pp-hero-blueprint .bp-labels text:nth-child(n+8){fill:#ff9b42;letter-spacing:.11em}
    #ppCleanTop .pp-hero-blueprint:after{content:"";position:absolute;inset:10% 5%;background:radial-gradient(circle at 52% 50%,rgba(255,120,0,.10),transparent 52%);filter:blur(10px)}
    #ppCleanTop .pp-top-card{width:425px;height:285px;align-self:start;margin-top:0;border:1px solid #294957;border-radius:24px;background:linear-gradient(145deg,#0b202b,#07141d);box-shadow:inset 0 1px 0 #ffffff0c,0 18px 40px #0008;display:flex;flex-direction:column;align-items:center;justify-content:flex-start;overflow:hidden;position:relative}
    #ppCleanTop .pp-top-card:after{content:"";position:absolute;inset:0;background:radial-gradient(circle at 50% 20%,#ff780012,transparent 45%);pointer-events:none}
    #ppCleanTop .pp-top-card img{position:relative;z-index:1;width:325px;height:190px;object-fit:contain;object-position:center;display:block;margin-top:9px}
    #ppCleanTop .pp-card-tagline{position:relative;z-index:2;margin-top:-2px;color:#ff7800;text-align:right;width:305px;font-size:21px;line-height:.9;font-family:"Brush Script MT","Segoe Script",cursive;font-style:italic;transform:rotate(-2deg);text-shadow:0 2px 12px #000}
    #ppCleanTop .pp-top-line{position:absolute;left:0;right:0;bottom:0;height:2px;background:#ff7800;box-shadow:0 0 14px #ff780055}
    @media(max-width:1050px){#ppCleanTop .pp-top-body{grid-template-columns:minmax(0,1fr) 350px;gap:22px}#ppCleanTop .pp-top-card{width:350px}#ppCleanTop .pp-top-card img{width:285px}#ppCleanTop h1{font-size:42px}}
    @media(max-width:800px){#ppCleanTop .pp-hero-blueprint{display:none}#ppCleanTop{min-height:0}#ppCleanTop .pp-top-nav{height:auto;min-height:62px;padding:5px 14px;flex-wrap:wrap}#ppCleanTop .pp-top-brand{width:210px}#ppCleanTop .pp-top-brand img{width:210px}#ppCleanTop .pp-top-links{width:100%;margin:0;justify-content:space-between;overflow:auto}#ppCleanTop .pp-top-links button{padding:6px 8px;font-size:11px}#ppCleanTop .pp-top-body{grid-template-columns:1fr;padding:16px 18px 20px}#ppCleanTop .pp-top-card{width:100%;max-width:425px;justify-self:center}#ppCleanTop h1{font-size:38px}.pp-desktop{display:none}}
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
