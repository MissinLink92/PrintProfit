(()=>{
  'use strict';

  function titleOf(section){
    const h=section?.querySelector('h2');
    return h?h.textContent.trim():'';
  }

  function findBox(number){
    return [...document.querySelectorAll('section.panel')].find(section=>titleOf(section).startsWith(number+'.'))||null;
  }

  function install(){
    if(document.getElementById('ppTabbedLayout'))return;

    const layout=document.querySelector('.layout');
    const result=layout?.querySelector('.result');
    const box1=findBox('1'),box2=findBox('2'),box3=findBox('3'),box4=findBox('4'),box5=findBox('5'),box6=findBox('6');
    if(!layout||!result||!box1||!box2||!box3||!box4||!box5||!box6)return false;

    const style=document.createElement('style');
    style.id='ppTabbedLayoutRuntimeStyles';
    style.textContent=`
/* PrintProfit full-width tab workspace V4 */
.layout{display:block!important;width:100%!important}
.layout>.result{display:block!important;width:100%!important;grid-column:auto!important;grid-row:auto!important;position:static!important;top:auto!important;margin-top:14px!important;min-width:0!important}
.pp-workspace{display:block!important;width:100%!important;min-width:0}
.pp-tabs{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:0;background:rgba(14,32,43,.78);border:1px solid var(--line);border-radius:12px;overflow:hidden;margin:0 0 12px;box-shadow:0 8px 24px #0004}
.pp-tab{position:relative;border:0;border-right:1px solid var(--line);background:transparent;color:var(--muted);min-height:58px;padding:9px 12px;display:flex;align-items:center;justify-content:center;gap:9px;font:700 13px Inter,Segoe UI,system-ui,sans-serif;cursor:pointer;transition:background .16s ease,color .16s ease}
.pp-tab:last-child{border-right:0}
.pp-tab:hover{background:#ff78000b;color:var(--text)}
.pp-tab.active{color:var(--text);background:linear-gradient(180deg,#ff780018,#ff780008)}
.pp-tab.active::after{content:"";position:absolute;left:10px;right:10px;bottom:0;height:3px;background:var(--accent);border-radius:3px 3px 0 0}
.pp-tab-icon{width:28px;height:28px;border-radius:8px;background:#ff780019;border:1px solid #ff78003d;display:grid;place-items:center;color:var(--accent);font-size:13px;flex:0 0 auto}
.pp-tab-copy{text-align:left;line-height:1.15}
.pp-tab-copy strong{display:block;font-size:13px;color:inherit}
.pp-tab-copy span{display:block;margin-top:3px;font-size:10px;font-weight:500;color:var(--muted)}
.pp-tab-panel{display:none}
.pp-tab-panel.active{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px;align-items:start}
.pp-card{background:linear-gradient(180deg,var(--panel),var(--panel2));border:1px solid var(--line);border-radius:12px;padding:12px;min-width:0}
.pp-card+.pp-card{margin-top:0}
.pp-card>.panel{margin:0!important;width:100%!important}
.pp-cost-block{background:linear-gradient(180deg,var(--panel),var(--panel2));border:1px solid var(--line);border-radius:12px;padding:12px;min-width:0}
.pp-cost-block+.pp-cost-block{margin-top:0}
.pp-cost-block>.panel{margin:0!important;width:100%!important}

@media(max-width:950px){
  .pp-tabs{grid-template-columns:1fr}
  .pp-tab{justify-content:flex-start;border-right:0;border-bottom:1px solid var(--line);min-height:50px}
  .pp-tab:last-child{border-bottom:0}
  .pp-tab.active::after{left:0;right:auto;top:8px;bottom:8px;width:3px;height:auto}
  .pp-tab-panel.active{grid-template-columns:1fr}
}
@media(max-width:650px){
  .pp-tab-copy span{display:none}
  .pp-card,.pp-cost-block{padding:10px}
  .layout>.result{margin-top:10px!important}
}
`;
    document.head.appendChild(style);

    const workspace=document.createElement('div');
    workspace.id='ppTabbedLayout';
    workspace.className='pp-workspace';

    const tabs=document.createElement('div');
    tabs.className='pp-tabs';
    tabs.setAttribute('role','tablist');
    tabs.innerHTML=`
<button type="button" class="pp-tab active" data-tab="details" role="tab" aria-selected="true"><span class="pp-tab-icon">▣</span><span class="pp-tab-copy"><strong>Print Details</strong><span>Print setup & quantity</span></span></button>
<button type="button" class="pp-tab" data-tab="machine" role="tab" aria-selected="false"><span class="pp-tab-icon">▦</span><span class="pp-tab-copy"><strong>Printer & Filament</strong><span>Machine & material</span></span></button>
<button type="button" class="pp-tab" data-tab="costs" role="tab" aria-selected="false"><span class="pp-tab-icon">£</span><span class="pp-tab-copy"><strong>Costs & Fees</strong><span>Running & selling costs</span></span></button>`;

    const panels={};
    for(const id of ['details','machine','costs']){
      const panel=document.createElement('div');
      panel.className='pp-tab-panel'+(id==='details'?' active':'');
      panel.dataset.panel=id;
      panels[id]=panel;
    }

    const card=(node,parent)=>{
      const wrap=document.createElement('div');
      wrap.className='pp-card';
      wrap.appendChild(node);
      parent.appendChild(wrap);
    };

    card(box1,panels.details);
    card(box6,panels.details);
    card(box2,panels.machine);
    card(box3,panels.machine);

    const costs4=document.createElement('div');
    costs4.className='pp-cost-block';
    costs4.appendChild(box4);
    panels.costs.appendChild(costs4);

    const costs5=document.createElement('div');
    costs5.className='pp-cost-block';
    costs5.appendChild(box5);
    panels.costs.appendChild(costs5);

    workspace.appendChild(tabs);
    Object.values(panels).forEach(panel=>workspace.appendChild(panel));

    layout.innerHTML='';
    layout.appendChild(workspace);
    layout.appendChild(result);

    tabs.querySelectorAll('.pp-tab').forEach(tab=>tab.addEventListener('click',()=>{
      const id=tab.dataset.tab;
      tabs.querySelectorAll('.pp-tab').forEach(item=>{
        const active=item===tab;
        item.classList.toggle('active',active);
        item.setAttribute('aria-selected',String(active));
      });
      Object.values(panels).forEach(panel=>panel.classList.toggle('active',panel.dataset.panel===id));
    }));

    return true;
  }

  function wait(){
    if(install())return;
    const started=Date.now();
    const timer=setInterval(()=>{
      if(install()||(Date.now()-started)>=15000)clearInterval(timer);
    },50);
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',wait,{once:true});
  else wait();
})();
