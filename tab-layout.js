(()=>{
  'use strict';

  const panelTitle=panel=>{
    const h=panel&&panel.querySelector('h2');
    return h?h.textContent.trim():'';
  };

  function getStructure(){
    const layout=document.querySelector('.layout');
    if(!layout)return null;

    const result=Array.from(layout.children).find(el=>el.classList.contains('result')) || layout.querySelector('.result');
    const source=Array.from(layout.children).find(el=>el!==result);
    if(!source||!result)return null;

    const directPanels=Array.from(source.children).filter(el=>el.matches&&el.matches('section.panel'));
    const box1=directPanels.find(panel=>panelTitle(panel).startsWith('1.'));
    const box6=directPanels.find(panel=>panelTitle(panel).startsWith('6.'));
    const two=Array.from(source.children).find(el=>el.classList&&el.classList.contains('two'));
    const box2=two&&Array.from(two.children).find(panel=>panelTitle(panel).startsWith('2.'));
    const box3=two&&Array.from(two.children).find(panel=>panelTitle(panel).startsWith('3.'));
    const guides=Array.from(source.children).find(el=>el.id==='guides');
    const mergeBlocks=guides?Array.from(guides.querySelectorAll('.merge-block')):[];
    const box4=mergeBlocks.find(block=>panelTitle(block).startsWith('4.'));
    const box5=mergeBlocks.find(block=>panelTitle(block).startsWith('5.'));

    if(!box1||!box2||!box3||!box4||!box5||!box6)return null;
    return {layout,result,source,box1,box2,box3,box4,box5,box6,two,guides};
  }

  function waitForStructure(timeout=15000){
    return new Promise(resolve=>{
      const started=Date.now();
      const timer=setInterval(()=>{
        const structure=getStructure();
        if(structure||(Date.now()-started)>=timeout){
          clearInterval(timer);
          resolve(structure);
        }
      },50);
    });
  }

  function install(structure){
    if(!structure||document.getElementById('ppTabbedLayout'))return;
    const {layout,result,source,box1,box2,box3,box4,box5,box6,two,guides}=structure;

    const style=document.createElement('style');
    style.id='ppTabbedLayoutRuntimeStyles';
    style.textContent=`
.layout{display:grid!important;grid-template-columns:minmax(0,1fr) minmax(350px,390px)!important;gap:14px!important;align-items:start!important}
.layout>.result{grid-column:auto!important;grid-row:auto!important;position:sticky!important;top:88px!important;min-width:0!important}
.pp-workspace{min-width:0}
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
.pp-tab-panel.active{display:block}
.pp-card{background:linear-gradient(180deg,var(--panel),var(--panel2));border:1px solid var(--line);border-radius:12px;padding:12px}
.pp-card+.pp-card{margin-top:12px}
.pp-card>.panel{margin:0!important}
.pp-cost-block{background:linear-gradient(180deg,var(--panel),var(--panel2));border:1px solid var(--line);border-radius:12px;padding:12px}
.pp-cost-block+.pp-cost-block{margin-top:12px}
.pp-cost-block .merge-block{border:0!important;padding:0!important;margin:0!important}
.pp-cost-block .head{margin-bottom:8px}
.pp-cost-block .head .icon{width:30px;height:30px}
@media(max-width:950px){
  .layout{grid-template-columns:1fr!important}
  .layout>.result{position:static!important}
  .pp-tabs{grid-template-columns:1fr}
  .pp-tab{justify-content:flex-start;border-right:0;border-bottom:1px solid var(--line);min-height:50px}
  .pp-tab:last-child{border-bottom:0}
  .pp-tab.active::after{left:0;right:auto;top:8px;bottom:8px;width:3px;height:auto}
}
@media(max-width:650px){
  .pp-tab-copy span{display:none}
  .pp-card,.pp-cost-block{padding:10px}
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

    const details=document.createElement('div');
    details.className='pp-tab-panel active';
    details.dataset.panel='details';

    const machine=document.createElement('div');
    machine.className='pp-tab-panel';
    machine.dataset.panel='machine';

    const costs=document.createElement('div');
    costs.className='pp-tab-panel';
    costs.dataset.panel='costs';

    const moveIntoCard=(node,parent)=>{
      const card=document.createElement('div');
      card.className='pp-card';
      card.appendChild(node);
      parent.appendChild(card);
    };

    moveIntoCard(box1,details);
    moveIntoCard(box6,details);
    moveIntoCard(box2,machine);
    moveIntoCard(box3,machine);

    const costBlock4=document.createElement('div');
    costBlock4.className='pp-cost-block';
    costBlock4.appendChild(box4);
    costs.appendChild(costBlock4);

    const costBlock5=document.createElement('div');
    costBlock5.className='pp-cost-block';
    costBlock5.appendChild(box5);
    costs.appendChild(costBlock5);

    workspace.appendChild(tabs);
    workspace.appendChild(details);
    workspace.appendChild(machine);
    workspace.appendChild(costs);
    source.appendChild(workspace);

    if(two)two.remove();
    if(guides)guides.remove();

    layout.innerHTML='';
    layout.appendChild(workspace);
    layout.appendChild(result);

    tabs.querySelectorAll('.pp-tab').forEach(tab=>{
      tab.addEventListener('click',()=>{
        const id=tab.dataset.tab;
        tabs.querySelectorAll('.pp-tab').forEach(item=>{
          const active=item===tab;
          item.classList.toggle('active',active);
          item.setAttribute('aria-selected',String(active));
        });
        workspace.querySelectorAll('.pp-tab-panel').forEach(panel=>{
          panel.classList.toggle('active',panel.dataset.panel===id);
        });
      });
    });
  }

  waitForStructure().then(install);
})();
