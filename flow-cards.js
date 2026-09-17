(()=>{
'use strict';
if(window.__printProfitFlowCards)return;
window.__printProfitFlowCards=true;

function install(){
  const cards=document.getElementById('pp-master-quickcards');
  if(!cards)return false;

  // The large cards are now the visual 3-stage journey. Hide the duplicate thin progress bar.
  const progress=document.getElementById('ppProgressHost');
  if(progress)progress.style.display='none';

  if(cards.dataset.flowReady==='1')return true;
  cards.dataset.flowReady='1';

  const buttons=[...cards.querySelectorAll('button')];
  const stages=[
    ['1','details'],
    ['2','machine'],
    ['3','costs']
  ];

  buttons.forEach((button,index)=>{
    const [number,target]=stages[index]||[];
    if(!number)return;
    button.dataset.flowTarget=target;

    const badge=document.createElement('span');
    badge.className='pp-flow-number';
    badge.textContent=number;
    button.insertBefore(badge,button.firstChild);

    button.addEventListener('click',()=>{
      const tab=document.querySelector('.pp-step[data-tab="'+target+'"]');
      if(tab)tab.click();
      document.getElementById('ppCalculator')?.scrollIntoView({behavior:'smooth',block:'start'});
    });
  });

  const style=document.createElement('style');
  style.id='ppFlowCardsStyles';
  style.textContent=`
    #ppProgressHost{display:none!important}
    #pp-master-quickcards{position:relative!important;grid-template-columns:repeat(3,minmax(0,1fr))!important;gap:42px!important;margin:20px auto 18px!important;padding:0 clamp(10px,2vw,28px)!important}
    #pp-master-quickcards:before{content:'YOUR PRINTING COST JOURNEY';position:absolute;left:clamp(10px,2vw,28px);top:-17px;color:#8297a3;font-size:8px;font-weight:900;letter-spacing:.2em}
    #pp-master-quickcards button{position:relative!important;min-height:105px!important;padding:17px 20px!important;border-radius:16px!important;overflow:visible!important}
    #pp-master-quickcards button:not(:last-child):after{content:'→';position:absolute;right:-34px;top:50%;transform:translateY(-50%);width:30px;height:30px;display:grid;place-items:center;border:1px solid #355361;border-radius:50%;background:#07131b;color:#ff7800;font-size:17px;font-weight:900;box-shadow:0 0 0 5px #071018,0 0 14px #ff780018;z-index:5}
    #pp-master-quickcards .pp-flow-number{position:absolute!important;top:-10px!important;left:-10px!important;width:28px!important;height:28px!important;border-radius:50%!important;display:grid!important;place-items:center!important;background:#ff7800!important;border:2px solid #071018!important;color:#fff!important;font-size:11px!important;font-weight:900!important;box-shadow:0 0 16px #ff780044!important;z-index:6!important}
    #pp-master-quickcards .pp-master-card-icon{width:64px!important;height:64px!important;min-width:64px!important;border:1px solid #ff7800!important;border-radius:50%!important;background:#07141c!important;display:grid!important;place-items:center!important;box-shadow:inset 0 0 20px #ff78000d,0 0 18px #ff78000d!important}
    #pp-master-quickcards .pp-master-card-icon svg{width:34px!important;height:34px!important;fill:none!important;stroke:#ff7800!important;stroke-width:2!important;stroke-linecap:round!important;stroke-linejoin:round!important}
    #pp-master-quickcards button:hover .pp-master-card-icon{box-shadow:0 0 22px #ff780022!important}
    #pp-master-quickcards button:nth-child(1) .pp-master-card-icon:before{content:'01';position:absolute;bottom:9px;font-size:7px;font-weight:900;letter-spacing:.12em;color:#8197a2}
    #pp-master-quickcards button:nth-child(2) .pp-master-card-icon:before{content:'02';position:absolute;bottom:9px;font-size:7px;font-weight:900;letter-spacing:.12em;color:#8197a2}
    #pp-master-quickcards button:nth-child(3) .pp-master-card-icon:before{content:'03';position:absolute;bottom:9px;font-size:7px;font-weight:900;letter-spacing:.12em;color:#8197a2}
    #pp-master-quickcards button b{font-size:15px!important}
    #pp-master-quickcards button small{font-size:10px!important;margin-top:4px!important}
    @media(max-width:900px){
      #pp-master-quickcards{grid-template-columns:1fr!important;gap:14px!important}
      #pp-master-quickcards button:not(:last-child):after{content:'↓';right:auto;left:50%;top:auto;bottom:-22px;transform:translateX(-50%)}
      #pp-master-quickcards button{min-height:90px!important}
    }
  `;
  document.head.appendChild(style);
  return true;
}

function boot(){
  if(install())return;
  const started=Date.now();
  const timer=setInterval(()=>{if(install()||Date.now()-started>15000)clearInterval(timer)},50);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
