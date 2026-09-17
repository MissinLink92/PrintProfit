(()=>{
'use strict';
if(window.__printProfitTopScratch)return;
window.__printProfitTopScratch=true;

function install(){
  if(!document.body)return false;
  const oldHeader=document.querySelector('.header');
  const oldHero=document.querySelector('.hero');
  if(!oldHeader||!oldHero)return false;
  if(document.getElementById('ppScratchTop'))return true;

  oldHeader.style.display='none';
  oldHero.style.display='none';

  const top=document.createElement('div');
  top.id='ppScratchTop';
  top.innerHTML=`
    <header class="pp-scratch-header">
      <a class="pp-scratch-logo" href="#ppScratchTop" aria-label="PrintProfit home">
        <img src="./assets/printprofit-master-orange.svg?v=scratch1" alt="PrintProfit — 3D Printing Cost & Pricing Calculator">
      </a>
      <nav class="pp-scratch-nav" aria-label="Main navigation">
        <a href="#ppScratchTop" class="active">Calculate a print</a>
        <a href="#ppCalculator">Price your prints</a>
        <a href="#ppResults">Profit</a>
        <a href="#ppCalculator">Settings</a>
      </nav>
      <label class="pp-scratch-mode">☾ Dark mode <input id="ppScratchDark" type="checkbox" role="switch" checked></label>
    </header>

    <section class="pp-scratch-hero">
      <div class="pp-scratch-copy">
        <div class="pp-scratch-kicker"><i></i> 3D PRINTING COST &amp; PRICING</div>
        <h1>Know what it costs.<br><strong>Know what to charge.</strong></h1>
        <p>Upload your sliced print file and let PrintProfit turn real printer data into a clear cost, selling price and profit.</p>
        <div class="pp-scratch-actions">
          <button type="button" class="pp-scratch-primary" id="ppScratchStart">▣ &nbsp; Start Calculating <span>→</span></button>
          <button type="button" class="pp-scratch-secondary" id="ppScratchLearn">Learn More <span>›</span></button>
        </div>
      </div>
      <div class="pp-scratch-visual">
        <div class="pp-scratch-card">
          <div class="pp-scratch-card-glow"></div>
          <img src="./assets/printprofit-master-orange.svg?v=scratch1" alt="PrintProfit">
          <div class="pp-scratch-card-foot"><span>CALCULATE</span><b>•</b><span>PRICE</span><b>•</b><span>PROFIT</span></div>
        </div>
        <div class="pp-scratch-tagline">Print Smarter. Price Better.<br>Profit More.</div>
      </div>
    </section>

    <div class="pp-scratch-features">
      <div><span>▣</span><strong>Calculate</strong><small>Costs</small></div>
      <div><span>◇</span><strong>Price</strong><small>Your Prints</small></div>
      <div><span>⌁</span><strong>Maximise</strong><small>Profit</small></div>
      <div><span>⚙</span><strong>Built</strong><small>For Makers</small></div>
    </div>
  `;

  const main=document.querySelector('.main');
  document.body.insertBefore(top,main||document.body.firstChild);

  const style=document.createElement('style');
  style.id='ppScratchTopStyles';
  style.textContent=`
    #ppScratchTop{--orange:#ff7800;--orange2:#ff9b42;--ink:#061019;--muted:#aebdc5;position:relative;z-index:10;background:#061019;color:#fff;overflow:hidden;border-bottom:1px solid #27414e}
    #ppScratchTop *{box-sizing:border-box}
    .pp-scratch-header{height:78px;display:flex;align-items:center;gap:24px;padding:9px clamp(24px,5vw,82px);background:rgba(3,9,14,.98);border-bottom:1px solid #243d4a}
    .pp-scratch-logo{display:block;width:330px;height:58px;flex:0 0 330px;text-decoration:none}
    .pp-scratch-logo img{display:block;width:100%;height:100%;object-fit:contain;object-position:left center;filter:drop-shadow(0 5px 14px #000c)}
    .pp-scratch-nav{display:flex;align-items:center;justify-content:center;gap:5px;flex:1;height:100%}
    .pp-scratch-nav a{position:relative;color:#e9eef2;text-decoration:none;padding:13px 15px;border-radius:8px;font-size:13px;font-weight:700;white-space:nowrap;transition:.18s ease}
    .pp-scratch-nav a:hover,.pp-scratch-nav a.active{background:#ff780012;color:#fff}
    .pp-scratch-nav a.active:after{content:'';position:absolute;left:15px;right:15px;bottom:3px;height:2px;border-radius:2px;background:linear-gradient(90deg,var(--orange),var(--orange2));box-shadow:0 0 10px #ff780070}
    .pp-scratch-mode{font-size:12px;color:#b9c5ca;white-space:nowrap;display:flex;align-items:center;gap:7px}
    .pp-scratch-mode input{accent-color:var(--orange);width:auto}
    .pp-scratch-hero{min-height:330px;display:grid;grid-template-columns:minmax(0,1fr) minmax(390px,500px);gap:44px;align-items:center;padding:30px clamp(24px,5vw,82px) 34px;background:radial-gradient(650px 310px at 82% 48%,#ff78000c,transparent 68%),radial-gradient(520px 280px at 14% 35%,#ff780008,transparent 70%),linear-gradient(135deg,#07131b 0%,#0a1b25 52%,#03090e 100%);position:relative}
    .pp-scratch-hero:after{content:'';position:absolute;left:0;right:0;bottom:0;height:1px;background:linear-gradient(90deg,transparent,var(--orange),var(--orange2),var(--orange),transparent);box-shadow:0 0 18px #ff780055}
    .pp-scratch-copy{max-width:760px}
    .pp-scratch-kicker{display:flex;align-items:center;gap:11px;color:var(--orange);font-size:10px;letter-spacing:.25em;font-weight:900;margin-bottom:13px}
    .pp-scratch-kicker i{display:block;width:32px;height:2px;background:var(--orange)}
    .pp-scratch-copy h1{font-size:clamp(43px,5vw,70px);line-height:.98;letter-spacing:-.045em;margin:0;font-weight:900}
    .pp-scratch-copy h1 strong{color:var(--orange);font-weight:900}
    .pp-scratch-copy p{max-width:650px;color:#b7c3c9;font-size:15px;line-height:1.55;margin:18px 0 21px}
    .pp-scratch-actions{display:flex;gap:10px;flex-wrap:wrap}
    .pp-scratch-actions button{font:inherit;cursor:pointer;border-radius:10px;padding:12px 16px;font-weight:800;transition:.18s ease}
    .pp-scratch-primary{border:1px solid var(--orange);background:linear-gradient(135deg,var(--orange),#ff8e1d);color:#fff;box-shadow:0 12px 28px #ff78002b}
    .pp-scratch-primary:hover{transform:translateY(-1px);box-shadow:0 15px 32px #ff78003d}
    .pp-scratch-primary span,.pp-scratch-secondary span{margin-left:8px}
    .pp-scratch-secondary{border:1px solid #35505e;background:#0b1821;color:#e9eef2}
    .pp-scratch-secondary:hover{border-color:#ff780066;background:#ff78000d}
    .pp-scratch-visual{position:relative;display:flex;justify-content:center;align-items:center;min-height:255px}
    .pp-scratch-card{position:relative;width:min(100%,470px);height:245px;border:1px solid #345466;border-radius:22px;background:linear-gradient(145deg,#10222c,#08131a 65%,#061018);box-shadow:0 24px 60px #0008, inset 0 1px #ffffff0b;display:flex;align-items:center;justify-content:center;overflow:hidden}
    .pp-scratch-card-glow{position:absolute;width:280px;height:180px;background:#ff780014;filter:blur(30px);border-radius:50%}
    .pp-scratch-card img{position:relative;width:82%;max-height:185px;object-fit:contain;filter:drop-shadow(0 10px 18px #0009)}
    .pp-scratch-card-foot{position:absolute;bottom:14px;display:flex;gap:8px;align-items:center;color:#8999a2;font-size:7px;font-weight:900;letter-spacing:.22em}
    .pp-scratch-card-foot b{color:var(--orange);font-size:8px}
    .pp-scratch-tagline{position:absolute;right:-2px;top:-12px;color:var(--orange);font-size:18px;line-height:1.02;font-family:"Segoe Print","Bradley Hand",cursive;transform:rotate(-3deg);text-align:left;text-shadow:0 2px 8px #000}
    .pp-scratch-features{height:78px;display:grid;grid-template-columns:repeat(4,1fr);background:#061019;border-top:1px solid #213945;border-bottom:1px solid #294553;padding:0 clamp(24px,18vw,260px)}
    .pp-scratch-features>div{display:grid;grid-template-columns:34px auto;grid-template-rows:1fr 1fr;align-content:center;padding:0 22px;border-right:1px solid #294553}
    .pp-scratch-features>div:last-child{border-right:0}
    .pp-scratch-features span{grid-row:1 / span 2;align-self:center;color:var(--orange);font-size:24px}
    .pp-scratch-features strong{align-self:end;font-size:12px;letter-spacing:.02em}
    .pp-scratch-features small{align-self:start;color:#84969f;font-size:9px;margin-top:2px}
    #ppCalculator{scroll-margin-top:20px}
    #ppResults{scroll-margin-top:20px}
    @media(max-width:1050px){.pp-scratch-header{padding:9px 28px}.pp-scratch-logo{width:285px;flex-basis:285px}.pp-scratch-nav a{padding-left:9px;padding-right:9px}.pp-scratch-hero{grid-template-columns:minmax(0,1fr) 360px;gap:22px;padding-left:28px;padding-right:28px}.pp-scratch-card{height:220px}.pp-scratch-features{padding:0 25px}}
    @media(max-width:820px){.pp-scratch-header{height:auto;min-height:76px;flex-wrap:wrap}.pp-scratch-logo{width:280px;flex-basis:280px}.pp-scratch-nav{order:3;width:100%;overflow:auto;justify-content:flex-start;padding-bottom:5px}.pp-scratch-hero{grid-template-columns:1fr;padding-top:28px}.pp-scratch-visual{min-height:220px}.pp-scratch-features{height:auto;grid-template-columns:repeat(2,1fr);padding:5px 15px}.pp-scratch-features>div{min-height:62px}}
    @media(max-width:560px){.pp-scratch-header{padding:8px 15px}.pp-scratch-logo{width:225px;flex-basis:225px;height:50px}.pp-scratch-mode{margin-left:auto;font-size:10px}.pp-scratch-copy h1{font-size:42px}.pp-scratch-hero{padding:25px 17px 30px}.pp-scratch-visual{min-height:190px}.pp-scratch-card{height:185px;border-radius:16px}.pp-scratch-card img{max-height:140px}.pp-scratch-tagline{font-size:14px;top:-8px}.pp-scratch-features{padding:5px 8px}.pp-scratch-features>div{padding:0 10px}}
  `;
  document.head.appendChild(style);

  const calculator=document.querySelector('.main');
  if(calculator&&!calculator.id)calculator.id='ppCalculator';
  const result=document.querySelector('.result');
  if(result&&!result.id)result.id='ppResults';

  const start=document.getElementById('ppScratchStart');
  if(start)start.addEventListener('click',()=>{(document.querySelector('.main')||document.querySelector('.layout'))?.scrollIntoView({behavior:'smooth',block:'start'});});
  const learn=document.getElementById('ppScratchLearn');
  if(learn)learn.addEventListener('click',()=>{(document.querySelector('.main')||document.querySelector('.layout'))?.scrollIntoView({behavior:'smooth',block:'start'});});

  const dark=document.getElementById('dark');
  const scratchDark=document.getElementById('ppScratchDark');
  if(dark&&scratchDark){scratchDark.checked=dark.checked;scratchDark.addEventListener('change',()=>{dark.checked=scratchDark.checked;dark.dispatchEvent(new Event('change',{bubbles:true}));dark.dispatchEvent(new Event('input',{bubbles:true}));});}
  return true;
}
function boot(){if(install())return;const timer=setInterval(()=>{if(install())clearInterval(timer)},50);setTimeout(()=>clearInterval(timer),15000)}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
