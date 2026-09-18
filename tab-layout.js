(()=>{
  'use strict';
  function titleOf(section){const h=section?.querySelector('h2');return h?h.textContent.trim():'';}
  function findBox(number){return [...document.querySelectorAll('section.panel')].find(section=>titleOf(section).startsWith(number+'.'))||null;}
  function install(){
    if(document.getElementById('ppTabbedLayout'))return;
    const layout=document.querySelector('.layout'),result=layout?.querySelector('.result');
    const box1=findBox('1'),box2=findBox('2'),box3=findBox('3'),box4=findBox('4'),box5=findBox('5'),box6=findBox('6');
    if(!layout||!result||!box1||!box2||!box3||!box4||!box5||!box6)return false;
    const style=document.createElement('style');style.id='ppTabbedLayoutRuntimeStyles';style.textContent=`
html{scroll-behavior:auto!important;overflow-anchor:none!important}body{overflow-anchor:none!important}#ppTabbedLayout,.pp-progress-host,.pp-tab-panel{overflow-anchor:none!important}
.layout{display:block!important;width:100%!important}.layout>.result{display:block!important;width:100%!important;grid-column:auto!important;grid-row:auto!important;position:static!important;top:auto!important;margin-top:14px!important;min-width:0}
.pp-workspace{display:block!important;width:100%!important;min-width:0}.pp-progress-host{display:block!important;width:100%!important;margin:0 0 12px!important;overflow:visible}
.pp-progress{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));align-items:stretch;width:100%;margin:0;padding:0;background:linear-gradient(180deg,rgba(11,28,38,.96),rgba(6,18,26,.96));border:1px solid var(--line);border-radius:12px;overflow:hidden;box-shadow:0 8px 24px #0004}
.pp-step{position:relative;min-height:70px;border:0;background:transparent;color:var(--muted);padding:10px 42px 10px 18px;display:flex;align-items:center;justify-content:center;gap:12px;font:700 13px Inter,Segoe UI,system-ui,sans-serif;cursor:pointer;transition:background .18s ease,color .18s ease;outline:none}
.pp-step:not(:last-child)::before{content:"→";position:absolute;right:-1px;top:50%;width:30px;height:30px;transform:translateY(-50%);display:grid;place-items:center;background:var(--panel2);border:1px solid var(--line);border-radius:50%;color:var(--accent);font-size:16px;font-weight:900;line-height:1;z-index:3;box-shadow:0 0 0 5px rgba(7,16,24,.98)}
.pp-step:hover{background:#ff78000b;color:var(--text)}.pp-step:focus-visible{box-shadow:inset 0 0 0 2px var(--accent)}.pp-step.active{color:var(--text);background:linear-gradient(180deg,#ff780018,#ff780008)}
.pp-step.active::after{content:"";position:absolute;left:12px;right:12px;bottom:0;height:3px;background:var(--accent);border-radius:3px 3px 0 0;box-shadow:0 0 10px #ff780044}.pp-step.complete .pp-step-number{background:#ff780019;border-color:#ff780055;color:var(--accent)}
.pp-step-number{width:38px;height:38px;border-radius:50%;display:grid;place-items:center;flex:0 0 38px;border:1px solid #36515f;background:#0b1b24;color:#8fa5b0;font-size:14px;font-weight:900}.pp-step.active .pp-step-number{background:var(--accent);border-color:var(--accent);color:#fff;box-shadow:0 0 18px #ff780033}
.pp-step-copy{text-align:left;line-height:1.15}.pp-step-copy strong{display:block;font-size:13px;color:inherit}.pp-step-copy span{display:block;margin-top:4px;font-size:10px;font-weight:500;color:var(--muted)}
.pp-tab-panel{display:none}.pp-tab-panel.active{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px;align-items:start}.pp-card{background:linear-gradient(180deg,var(--panel),var(--panel2));border:1px solid var(--line);border-radius:12px;padding:12px;min-width:0}.pp-card+.pp-card{margin-top:0}.pp-card>.panel{margin:0!important;width:100%!important}.pp-cost-block{background:linear-gradient(180deg,var(--panel),var(--panel2));border:1px solid var(--line);border-radius:12px;padding:12px;min-width:0}.pp-cost-block+.pp-cost-block{margin-top:0}.pp-cost-block>.panel{margin:0!important;width:100%!important}
/* Readable section icons */.pp-card .head .icon,.pp-cost-block .head .icon{width:40px!important;height:40px!important;min-width:40px!important;flex:0 0 40px!important;border-radius:10px!important;font-size:17px!important;line-height:1!important}
@media(max-width:950px){.pp-progress{grid-template-columns:1fr}.pp-step{justify-content:flex-start;padding:10px 14px;min-height:56px;border-bottom:1px solid var(--line)}.pp-step:last-child{border-bottom:0}.pp-step:not(:last-child)::before{display:none}.pp-step.active::after{left:0;right:auto;top:8px;bottom:8px;width:3px;height:auto}.pp-tab-panel.active{grid-template-columns:1fr}}
@media(max-width:650px){.pp-step-copy span{display:none}.pp-step{padding:9px 10px;min-height:52px}.pp-step-number{width:36px;height:36px;min-width:36px;flex-basis:36px}.pp-card,.pp-cost-block{padding:10px}.pp-card .head .icon,.pp-cost-block .head .icon{width:38px!important;height:38px!important;min-width:38px!important;flex-basis:38px!important}.layout>.result{margin-top:10px!important}}
`;document.head.appendChild(style);
    const progressHost=document.createElement('div');progressHost.id='ppProgressHost';progressHost.className='pp-progress-host';
    const progress=document.createElement('div');progress.id='ppSetupProgress';progress.className='pp-progress';progress.setAttribute('role','tablist');progress.setAttribute('aria-label','Calculator progress');
    progress.innerHTML=`<button type="button" class="pp-step active" data-tab="details" role="tab" aria-selected="true" aria-label="Step 1: Print Details"><span class="pp-step-number">1</span><span class="pp-step-copy"><strong>Print Details</strong><span>Tell us about your print</span></span></button><button type="button" class="pp-step" data-tab="machine" role="tab" aria-selected="false" aria-label="Step 2: Printer and Filament"><span class="pp-step-number">2</span><span class="pp-step-copy"><strong>Printer &amp; Filament</strong><span>Choose your machine &amp; material</span></span></button><button type="button" class="pp-step" data-tab="costs" role="tab" aria-selected="false" aria-label="Step 3: Costs and Fees"><span class="pp-step-number">3</span><span class="pp-step-copy"><strong>Costs &amp; Fees</strong><span>Add running &amp; selling costs</span></span></button>`;
    const workspace=document.createElement('div');workspace.id='ppTabbedLayout';workspace.className='pp-workspace';
    const panels={};for(const id of ['details','machine','costs']){const panel=document.createElement('div');panel.className='pp-tab-panel'+(id==='details'?' active':'');panel.dataset.panel=id;panels[id]=panel;}
    const card=(node,parent)=>{const wrap=document.createElement('div');wrap.className='pp-card';wrap.appendChild(node);parent.appendChild(wrap);};
    card(box1,panels.details);card(box6,panels.details);card(box2,panels.machine);card(box3,panels.machine);
    const costs4=document.createElement('div');costs4.className='pp-cost-block';costs4.appendChild(box4);panels.costs.appendChild(costs4);
    const costs5=document.createElement('div');costs5.className='pp-cost-block';costs5.appendChild(box5);panels.costs.appendChild(costs5);
    Object.values(panels).forEach(panel=>workspace.appendChild(panel));layout.innerHTML='';layout.appendChild(workspace);layout.appendChild(result);progressHost.appendChild(progress);layout.parentNode.insertBefore(progressHost,layout);
    const steps=[...progress.querySelectorAll('.pp-step')],ids=['details','machine','costs'];
    let viewportLockTimer=null;
    function lockViewport(y,x,duration=1200){
      if(viewportLockTimer)clearInterval(viewportLockTimer);
      const root=document.documentElement,body=document.body;
      root.style.overflowAnchor='none';body.style.overflowAnchor='none';
      const restore=()=>{window.scrollTo({left:x,top:y,behavior:'auto'});if(document.scrollingElement)document.scrollingElement.scrollTop=y;};
      restore();
      const started=performance.now();
      viewportLockTimer=setInterval(()=>{
        restore();
        if(performance.now()-started>=duration){
          clearInterval(viewportLockTimer);viewportLockTimer=null;restore();
        }
      },16);
      requestAnimationFrame(restore);
      setTimeout(restore,50);setTimeout(restore,150);setTimeout(restore,300);setTimeout(restore,600);setTimeout(restore,1000);
    }
    function setStep(id){
      const beforeY=window.scrollY,beforeX=window.scrollX,current=ids.indexOf(id);
      document.documentElement.style.scrollBehavior='auto';
      steps.forEach((step,index)=>{
        const active=index===current,complete=index<current;
        step.classList.toggle('active',active);step.classList.toggle('complete',complete);
        step.setAttribute('aria-selected',String(active));
        const number=step.querySelector('.pp-step-number');if(number)number.textContent=complete?'✓':String(index+1);
      });
      Object.values(panels).forEach(panel=>panel.classList.toggle('active',panel.dataset.panel===id));
      lockViewport(beforeY,beforeX,1200);
    }
    steps.forEach(step=>{
      step.addEventListener('mousedown',e=>e.preventDefault());
      step.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();const y=window.scrollY,x=window.scrollX;setStep(step.dataset.tab);try{step.focus({preventScroll:true});}catch(_){step.blur();}lockViewport(y,x,1200);});
      step.addEventListener('focus',()=>{try{step.blur();}catch(_){ }},true);
    });return true;
  }
  function wait(){if(install())return;const started=Date.now();const timer=setInterval(()=>{if(install()||(Date.now()-started)>=15000)clearInterval(timer);},50);}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',wait,{once:true});else wait();
})();
