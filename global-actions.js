(()=>{
  'use strict';
  if(window.__printProfitGlobalActionsInstalled)return;
  window.__printProfitGlobalActionsInstalled=true;

  const $=id=>document.getElementById(id);

  function install(){
    const workspace=$('ppTabbedLayout');
    // The current progress UI is created by tab-layout.js as .pp-progress.
    // Older versions used #ppSetupProgress, so support both.
    const progress=$('ppSetupProgress')||document.querySelector('.pp-progress');
    const calc=$('calc');
    const reset=$('reset');
    if(!workspace||!progress||!calc||!reset||$('ppGlobalActions'))return false;

    const bar=document.createElement('div');
    bar.id='ppGlobalActions';
    bar.className='pp-global-actions';
    bar.setAttribute('role','toolbar');
    bar.setAttribute('aria-label','Calculator actions');
    bar.innerHTML=`
      <div class="pp-global-actions-copy">
        <span>Calculator Actions</span>
        <small>Available from every tab</small>
      </div>
      <div class="pp-global-actions-buttons">
        <button type="button" class="btn accent" id="ppGlobalCalculate">Calculate Costs &amp; Price</button>
        <button type="button" class="btn" id="ppGlobalReset">↺ Reset</button>
      </div>`;

    progress.insertAdjacentElement('afterend',bar);

    const sourceActions=reset.closest('.actions');
    if(sourceActions)sourceActions.classList.add('pp-source-actions-hidden');

    $('ppGlobalCalculate').addEventListener('click',()=>calc.click());
    $('ppGlobalReset').addEventListener('click',()=>reset.click());

    const style=document.createElement('style');
    style.id='ppGlobalActionsStyles';
    style.textContent=`
.pp-global-actions{display:flex;align-items:center;justify-content:space-between;gap:12px;margin:0 0 12px;padding:8px 10px;background:linear-gradient(90deg,#0e202b,#0b1821);border:1px solid var(--line);border-radius:10px;box-shadow:0 7px 20px #0003;position:sticky;top:84px;z-index:4}
.pp-global-actions-copy{min-width:0}.pp-global-actions-copy span{display:block;color:var(--text);font-size:11px;font-weight:800}.pp-global-actions-copy small{display:block;margin-top:2px;color:var(--muted);font-size:9.5px}.pp-global-actions-buttons{display:flex;gap:7px;flex:0 0 auto}.pp-global-actions-buttons .btn{font-weight:700}.pp-source-actions-hidden{display:none!important}
@media(max-width:950px){.pp-global-actions{position:static}.pp-global-actions-copy small{display:none}}
@media(max-width:650px){.pp-global-actions{align-items:stretch;flex-direction:column;gap:7px;padding:8px}.pp-global-actions-buttons{display:grid;grid-template-columns:1fr 92px}.pp-global-actions-buttons .btn{width:100%}}
`;
    document.head.appendChild(style);
    return true;
  }

  function wait(){
    if(install())return;
    const started=Date.now();
    const timer=setInterval(()=>{
      if(install()||Date.now()-started>=15000)clearInterval(timer);
    },50);
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',wait,{once:true});
  else wait();
})();
