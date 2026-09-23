(()=>{
'use strict';
if(window.__printProfitResultsPolish)return;window.__printProfitResultsPolish=true;

function install(){
  const result=document.getElementById('about')||document.querySelector('.result');
  if(!result)return false;

  if(!document.getElementById('ppResultsLayoutPolish')){
    const style=document.createElement('style');
    style.id='ppResultsLayoutPolish';
    style.textContent=`
      /* Results presentation only. Calculation markup and handlers are untouched. */
      .result#about{
        border-radius:12px!important;
        padding:12px!important;
        background:linear-gradient(180deg,#0b1821,#0e202b)!important;
      }
      @media(min-width:1101px){
        .layout>.result#about{grid-column:1 / -1!important;grid-row:auto!important;position:static!important;width:100%!important;}
      }
      .result#about>.head{
        display:flex!important;
        align-items:flex-start!important;
        justify-content:space-between!important;
        gap:12px!important;
        margin-bottom:8px!important;
      }
      .result#about>.head>div:nth-child(2){min-width:0}
      .result#about>.head h2{font-size:18px!important;line-height:1.05!important}
      .result#about>.head p{font-size:11px!important;line-height:1.35!important}
      .pp-results-status{
        margin-left:auto;
        flex:0 0 auto;
        border:1px solid #355464;
        border-radius:999px;
        padding:6px 10px;
        font:800 9px/1 Inter,Segoe UI,system-ui,sans-serif;
        letter-spacing:.05em;
        text-transform:uppercase;
        white-space:nowrap;
        color:#9fb1bb;
        background:#0a1a24;
      }
      .pp-results-status.good{color:#36e58b;border-color:#286f53;background:#09231c}
      .pp-results-status.bad{color:#ff6b6b;border-color:#7c4149;background:#24171c}
      .pp-results-status.neutral{color:#b8c8cf;border-color:#3b5663;background:#10212a}

      .result#about .tabs{margin:8px 0 9px!important;padding:3px!important;gap:3px!important}
      .result#about .tab{padding:9px!important;font-size:12px!important}
      .result#about .cards{gap:8px!important}
      .result#about .card{padding:10px!important;border-radius:9px!important;min-height:66px}
      .result#about .card .small{font-size:10.5px!important}
      .result#about .value{font-size:20px!important;margin-top:4px!important}
      .result#about .quick{margin-top:9px!important}
      .result#about .quick>.small:first-child{font-size:10.5px!important}
      .result#about .quick .grid{gap:7px!important;margin-top:5px!important}
      .result#about .quick .btn{padding:9px!important;font-size:12px!important}
      .result#about .custom-target{margin-top:7px!important}
      .result#about .custom-target label{font-size:10.5px!important}
      .result#about .custom-target-note{font-size:10px!important;line-height:1.35!important}
      .result#about .break{margin-top:9px!important;padding:10px!important;border-radius:10px!important}
      .result#about .break>b{font-size:14px!important}
      .result#about .line{padding:7px 0!important;font-size:11px!important}
      .result#about .total{font-size:13px!important}

      @media(max-width:650px){
        .result#about{padding:10px!important}
        .result#about>.head{align-items:flex-start!important;flex-wrap:wrap!important}
        .pp-results-status{margin-left:0}
        .result#about .cards{grid-template-columns:1fr!important}
      }
    `;
    document.head.appendChild(style);
  }

  let status=document.getElementById('ppResultsStatus');
  if(!status){
    status=document.createElement('span');
    status.id='ppResultsStatus';
    status.className='pp-results-status neutral';
    status.textContent='• Break-even · 0.0% margin';
    result.querySelector('.head')?.appendChild(status);
  }

  const updateStatus=()=>{
    const batchVisible=document.getElementById('batchResultView')&&!document.getElementById('batchResultView').hidden;
    const profitEl=document.getElementById(batchVisible?'batchProfit':'singleProfit');
    const marginEl=document.getElementById(batchVisible?'batchMargin':'singleMargin');
    const profit=Number.parseFloat((profitEl?.textContent||'').replace(/[^0-9.-]/g,''));
    const marginMatch=(marginEl?.textContent||'').match(/(-?\\d+(?:\\.\\d+)?)%/);
    const margin=marginMatch?Number(marginMatch[1]):0;
    let cls='neutral';
    let label='• Break-even';
    if(Number.isFinite(profit)&&profit< -0.00001){cls='bad';label='Loss';}
    else if(Number.isFinite(profit)&&profit>0.00001){cls='good';label='Profit';}
    if(status){
      status.className='pp-results-status '+cls;
      status.textContent=label+' · '+(Number.isFinite(margin)?margin.toFixed(1):'0.0')+'% margin';
    }
  };

  const observe=()=>{
    ['singleProfit','singleMargin','batchProfit','batchMargin'].forEach(id=>{
      const el=document.getElementById(id);
      if(el&&!el.dataset.ppResultsObserved){
        el.dataset.ppResultsObserved='1';
        const mo=new MutationObserver(updateStatus);
        mo.observe(el,{childList:true,subtree:true,characterData:true});
      }
    });
    document.querySelectorAll('#resultTabs .tab').forEach(tab=>{
      if(tab.dataset.ppStatusBound==='1')return;
      tab.dataset.ppStatusBound='1';
      tab.addEventListener('click',()=>setTimeout(updateStatus,25));
    });
    updateStatus();
  };

  observe();
  const timer=setInterval(()=>{observe();if(document.getElementById('singleProfit'))clearInterval(timer)},200);
  return true;
}

if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>install(),{once:true});else install();
})();
