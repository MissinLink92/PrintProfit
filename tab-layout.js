(()=>{
  'use strict';
  function titleOf(section){const h=section?.querySelector('h2');return h?h.textContent.trim():'';}
  function findBox(number){return [...document.querySelectorAll('section.panel')].find(section=>titleOf(section).startsWith(number+'.'))||null;}
  function install(){
    if(document.getElementById('ppTabbedLayout'))return;
    const layout=document.querySelector('.layout'),result=layout?.querySelector('.result');
    const box1=findBox('1'),box2=findBox('2'),box4=findBox('4'),box5=findBox('5'),box6=findBox('6');
    if(!layout||!result||!box1||!box2||!box4||!box5||!box6)return false;
    const style=document.createElement('style');style.id='ppTabbedLayoutRuntimeStyles';style.textContent=`
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

.pp-model-hub{grid-column:auto;align-self:start}.pp-model-hub .head{margin-bottom:8px}.pp-model-status{font-size:12px;color:var(--muted);padding:9px 10px;border:1px solid var(--line);border-radius:8px;background:#ff780008;margin-bottom:9px}.pp-model-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:8px}.pp-model-grid>div{border:1px solid var(--line);border-radius:8px;padding:9px;background:var(--panel2);min-width:0}.pp-model-grid span{display:block;font-size:10px;color:var(--muted);margin-bottom:4px}.pp-model-grid strong{display:block;font-size:13px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}@media(max-width:950px){.pp-model-grid{grid-template-columns:1fr 1fr}}@media(max-width:650px){.pp-model-grid{grid-template-columns:1fr}}
/* Readable section icons */.pp-card .head .icon,.pp-cost-block .head .icon{width:40px!important;height:40px!important;min-width:40px!important;flex:0 0 40px!important;border-radius:10px!important;font-size:17px!important;line-height:1!important}
/* Stable stage height: changing stages must not reflow the page. */
.pp-workspace{position:relative}
.pp-tab-panel{width:100%!important}

@media(max-width:950px){.pp-progress{grid-template-columns:1fr}.pp-step{justify-content:flex-start;padding:10px 14px;min-height:56px;border-bottom:1px solid var(--line)}.pp-step:last-child{border-bottom:0}.pp-step:not(:last-child)::before{display:none}.pp-step.active::after{left:0;right:auto;top:8px;bottom:8px;width:3px;height:auto}.pp-tab-panel.active{grid-template-columns:1fr}}
@media(max-width:650px){.pp-step-copy span{display:none}.pp-step{padding:9px 10px;min-height:52px}.pp-step-number{width:36px;height:36px;min-width:36px;flex-basis:36px}.pp-card,.pp-cost-block{padding:10px}.pp-card .head .icon,.pp-cost-block .head .icon{width:38px!important;height:38px!important;min-width:38px!important;flex-basis:38px!important}.layout>.result{margin-top:10px!important}}
`;document.head.appendChild(style);
    const progressHost=document.createElement('div');progressHost.id='ppProgressHost';progressHost.className='pp-progress-host';
    const progress=document.createElement('div');progress.id='ppSetupProgress';progress.className='pp-progress';progress.setAttribute('role','tablist');progress.setAttribute('aria-label','Calculator progress');
    progress.innerHTML=`<button type="button" class="pp-step active" data-tab="details" role="tab" aria-selected="true" aria-label="Step 1: Your Model"><span class="pp-step-number">1</span><span class="pp-step-copy"><strong>Your Model</strong><span>Upload your print &amp; view its data</span></span></button><button type="button" class="pp-step" data-tab="machine" role="tab" aria-selected="false" aria-label="Step 2: Printer and Filament"><span class="pp-step-number">2</span><span class="pp-step-copy"><strong>Printer &amp; Filament</strong><span>Choose your machine &amp; material</span></span></button><button type="button" class="pp-step" data-tab="costs" role="tab" aria-selected="false" aria-label="Step 3: Costs and Fees"><span class="pp-step-number">3</span><span class="pp-step-copy"><strong>Costs &amp; Fees</strong><span>Add running &amp; selling costs</span></span></button>`;
    const workspace=document.createElement('div');workspace.id='ppTabbedLayout';workspace.className='pp-workspace';
    const panels={};for(const id of ['details','machine','costs']){const panel=document.createElement('div');panel.className='pp-tab-panel'+(id==='details'?' active':'');panel.dataset.panel=id;panels[id]=panel;}
    const card=(node,parent)=>{const wrap=document.createElement('div');wrap.className='pp-card';wrap.appendChild(node);parent.appendChild(wrap);};
    card(box1,panels.details);
    const box1Title=box1.querySelector('h2'),box1Desc=box1.querySelector('.head p');if(box1Title)box1Title.textContent='1. Your Model';if(box1Desc)box1Desc.textContent='Upload your sliced file and see all available print information in one place.';
    card(box2,panels.machine);
    card(box6,panels.costs);
    // Turn Stage 1 into the model hub: the upload remains the source, while this live panel surfaces the print data currently known.
    const modelHub=document.createElement('div');modelHub.className='pp-model-hub pp-card';
    modelHub.innerHTML='<div class="head"><div class="icon">⌁</div><div><h2>Print Information</h2><p>Everything PrintProfit currently knows about this model.</p></div></div><div class="pp-model-status" id="ppModelStatus">Upload a G-code file to automatically fill in the available print information.</div><div class="pp-model-grid"><div><span>File</span><strong id="ppModelFile">—</strong></div><div><span>Print time</span><strong id="ppModelTime">—</strong></div><div><span>Material used</span><strong id="ppModelUsed">—</strong></div><div><span>Material</span><strong id="ppModelMaterial">—</strong></div></div>';
    panels.details.appendChild(modelHub);
    const costs4=document.createElement('div');costs4.className='pp-cost-block';costs4.appendChild(box4);panels.costs.appendChild(costs4);
    const costs5=document.createElement('div');costs5.className='pp-cost-block';costs5.appendChild(box5);panels.costs.appendChild(costs5);
    Object.values(panels).forEach(panel=>workspace.appendChild(panel));layout.innerHTML='';layout.appendChild(workspace);layout.appendChild(result);progressHost.appendChild(progress);layout.parentNode.insertBefore(progressHost,layout);
    const steps=[...progress.querySelectorAll('.pp-step')],ids=['details','machine','costs'];
    /* Measure every stage once and reserve enough workspace height for the tallest one. */
    function stabiliseWorkspace(){
      const current=Object.values(panels).find(panel=>panel.classList.contains('active'))||panels.details;
      const previous={};
      Object.values(panels).forEach(panel=>previous[panel.dataset.panel]=panel.classList.contains('active'));
      let max=0;
      Object.values(panels).forEach(panel=>{
        Object.values(panels).forEach(p=>p.classList.remove('active'));
        panel.classList.add('active');
        max=Math.max(max,panel.offsetHeight,panel.scrollHeight);
      });
      Object.values(panels).forEach(panel=>panel.classList.toggle('active',!!previous[panel.dataset.panel]));
      workspace.style.minHeight=Math.ceil(max)+'px';
    }
    stabiliseWorkspace();
    function updateModelHub(){
      const q=id=>document.getElementById(id);
      const file=q('file'),status=q('status'),mat=q('material'),used=q('materialUsed');
      const h=q('ppPrintTimeHours'),m=q('ppPrintTimeMinutes'),legacy=q('printHours');
      const fileName=file?.files?.[0]?.name||'—';
      q('ppModelFile').textContent=fileName;
      let time='—';const hv=parseInt(h?.value,10),mv=parseInt(m?.value,10);if(Number.isFinite(hv)||Number.isFinite(mv)){time=(Number.isFinite(hv)?hv:0)+'h '+(Number.isFinite(mv)?mv:0)+'m';}else if(legacy?.value&&Number(legacy.value)>0)time=Number(legacy.value).toFixed(2)+' h';
      q('ppModelTime').textContent=time;
      const uv=used?.value;q('ppModelUsed').textContent=uv&&Number(uv)>0?Number(uv).toFixed(2)+' g':'—';
      q('ppModelMaterial').textContent=mat?.selectedOptions?.[0]?.text||'—';
      if(status?.textContent)q('ppModelStatus').textContent=status.textContent;
    }
    function watchModelData(){
      updateModelHub();
      ['file','status','material','materialUsed','printHours','ppPrintTimeHours','ppPrintTimeMinutes'].forEach(id=>{const el=document.getElementById(id);if(!el||el.dataset.ppModelWatch)return;el.dataset.ppModelWatch='1';el.addEventListener('input',updateModelHub);el.addEventListener('change',updateModelHub);});
      const st=document.getElementById('status');if(st&&window.MutationObserver&&!st.dataset.ppModelObserver){st.dataset.ppModelObserver='1';new MutationObserver(updateModelHub).observe(st,{childList:true,subtree:true,characterData:true});}
    }
    function setStep(id){
      const current=ids.indexOf(id);
      steps.forEach((step,index)=>{const active=index===current,complete=index<current;step.classList.toggle('active',active);step.classList.toggle('complete',complete);step.setAttribute('aria-selected',String(active));const number=step.querySelector('.pp-step-number');if(number)number.textContent=complete?'✓':String(index+1);});
      Object.values(panels).forEach(panel=>panel.classList.toggle('active',panel.dataset.panel===id));
      /* Deliberately do not read or write window.scrollX/Y. The page owns its scroll position. */
    }
    /* Mouse/touch clicks should not move focus and trigger browser scroll-into-view. Keyboard focus remains available. */
    steps.forEach(step=>{
      step.addEventListener('mousedown',event=>event.preventDefault());
      step.addEventListener('click',()=>setStep(step.dataset.tab));
    });
    window.addEventListener('resize',()=>stabiliseWorkspace(),{passive:true});
    watchModelData();
    return true;
  }
  function wait(){if(install())return;const started=Date.now();const timer=setInterval(()=>{if(install()||(Date.now()-started)>=15000)clearInterval(timer);},50);}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',wait,{once:true});else wait();
})();
