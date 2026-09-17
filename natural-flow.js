(()=>{
'use strict';
if(window.__printProfitNaturalFlow)return;window.__printProfitNaturalFlow=true;

const steps=[
 ['01','Print file','Upload your sliced file'],
 ['02','Printer','Choose the machine'],
 ['03','Material','Set filament & material cost'],
 ['04','Running costs','Power, labour & overheads'],
 ['05','Selling','Fees, delivery & price'],
 ['06','Profit','See your final margin']
];

const icons={
 file:'<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M11 5h20l8 8v30H11z"/><path d="M31 5v10h8"/><path d="M18 25h12M18 32h12M18 39h8"/></svg>',
 printer:'<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M14 18V7h20v11"/><path d="M10 18h28v17H10z"/><path d="M15 30h18v11H15z"/><path d="M31 23h4"/></svg>',
 spool:'<svg viewBox="0 0 48 48" aria-hidden="true"><ellipse cx="24" cy="10" rx="13" ry="5"/><path d="M11 10v28c0 3 6 6 13 6s13-3 13-6V10"/><path d="M11 19c0 3 6 5 13 5s13-2 13-5M11 29c0 3 6 5 13 5s13-2 13-5"/></svg>',
 costs:'<svg viewBox="0 0 48 48" aria-hidden="true"><rect x="10" y="5" width="28" height="38" rx="4"/><path d="M16 12h16v7H16zM16 25h5m6 0h5M16 32h5m6 0h5M16 39h5m6 0h5"/></svg>',
 sell:'<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M8 24h32M12 16h24M12 32h24"/><circle cx="24" cy="24" r="17"/></svg>',
 profit:'<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M7 41V7M7 41h35"/><path d="m12 33 8-9 7 5 10-15"/></svg>'
};

function sectionIcon(i){return ['file','printer','spool','costs','sell','profit'][i]||'file'}
function make(){
 const main=document.querySelector('.main');
 const workspace=document.getElementById('ppTabbedLayout');
 if(!main||!workspace)return false;
 if(document.getElementById('ppNaturalFlow'))return true;
 const flow=document.createElement('section');
 flow.id='ppNaturalFlow';
 flow.className='pp-natural-flow';
 flow.innerHTML='<div class="pp-flow-heading"><span class="pp-flow-kicker">YOUR NATURAL PRINTING FLOW</span><h2>From sliced file to profitable price.</h2><p>Follow the calculator in the same order you already think about a print.</p></div><div class="pp-flow-track">'+steps.map((s,i)=>{
   const icon=icons[sectionIcon(i)];
   return '<button type="button" class="pp-flow-step" data-flow-index="'+i+'"><span class="pp-flow-node">'+icon+'</span><span class="pp-flow-copy"><b><em>'+s[0]+'</em>'+s[1]+'</b><small>'+s[2]+'</small></span><span class="pp-flow-arrow">→</span></button>';
 }).join('')+'</div>';
 main.insertBefore(flow,workspace);
 flow.querySelectorAll('.pp-flow-step').forEach(btn=>btn.addEventListener('click',()=>{
  const i=Number(btn.dataset.flowIndex);
  const map=['details','machine','machine','costs','costs','results'];
  if(i===5){document.querySelector('.layout>.result')?.scrollIntoView({behavior:'smooth',block:'start'});return;}
  const tab=document.querySelector('.pp-tab[data-tab="'+map[i]+'"]');
  if(tab)tab.click();
  workspace.scrollIntoView({behavior:'smooth',block:'start'});
 }));
 const style=document.createElement('style');
 style.id='ppNaturalFlowStyles';
 style.textContent=`
.pp-natural-flow{max-width:1480px;margin:0 auto 16px;padding:0 clamp(10px,2vw,28px)}
.pp-flow-heading{margin:2px 0 12px}.pp-flow-kicker{font-size:9px;font-weight:900;letter-spacing:.2em;color:#ff7800}.pp-flow-heading h2{margin:4px 0 0;font-size:22px;letter-spacing:-.025em;color:#f5f8fb}.pp-flow-heading p{margin:4px 0 0;color:#8ea5b1;font-size:11px}
.pp-flow-track{display:grid;grid-template-columns:repeat(6,minmax(0,1fr));gap:8px;padding:10px;background:linear-gradient(180deg,#0b1b25,#08151d);border:1px solid #254555;border-radius:14px;box-shadow:inset 0 1px 0 #fff06,0 12px 28px #0006}
.pp-flow-step{position:relative;display:flex;align-items:center;gap:9px;min-width:0;padding:11px 10px;border:1px solid transparent;border-radius:11px;background:transparent;color:#dce7ec;text-align:left;cursor:pointer;transition:transform .2s ease,border-color .2s ease,background .2s ease}
.pp-flow-step:hover{transform:translateY(-2px);border-color:#ff780055;background:#ff78000a}.pp-flow-step:last-child .pp-flow-arrow{display:none}
.pp-flow-node{display:grid;place-items:center;flex:0 0 34px;width:34px;height:34px;border-radius:50%;border:1px solid #ff780066;background:#ff780012;color:#ff7800;box-shadow:0 0 18px #ff780014,inset 0 1px 0 #fff08}
.pp-flow-node svg{width:19px;height:19px;fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}
.pp-flow-copy{min-width:0;display:flex;flex-direction:column;line-height:1.05}.pp-flow-copy b{font-size:11px;white-space:nowrap}.pp-flow-copy b em{font-style:normal;color:#ff7800;margin-right:5px;font-size:8px;letter-spacing:.06em}.pp-flow-copy small{margin-top:5px;font-size:8.5px;color:#8ea5b1;line-height:1.2}.pp-flow-arrow{position:absolute;right:-7px;top:50%;transform:translateY(-50%);color:#ff7800;font-size:15px;z-index:2}
@media(max-width:1050px){.pp-flow-track{grid-template-columns:repeat(3,minmax(0,1fr))}.pp-flow-step:nth-child(3) .pp-flow-arrow,.pp-flow-step:nth-child(6) .pp-flow-arrow{display:none}}
@media(max-width:650px){.pp-natural-flow{padding:0 8px}.pp-flow-heading h2{font-size:19px}.pp-flow-track{grid-template-columns:1fr 1fr;gap:6px;padding:7px}.pp-flow-step{padding:9px 8px}.pp-flow-arrow{display:none!important}.pp-flow-copy small{display:none}.pp-flow-node{flex-basis:30px;width:30px;height:30px}.pp-flow-node svg{width:17px;height:17px}}
@media(prefers-reduced-motion:reduce){.pp-flow-step{transition:none!important}}
`;
 document.head.appendChild(style);
 return true;
}
function wait(){if(make())return;const t=Date.now();const id=setInterval(()=>{if(make()||Date.now()-t>15000)clearInterval(id)},50)}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',wait,{once:true});else wait();
})();