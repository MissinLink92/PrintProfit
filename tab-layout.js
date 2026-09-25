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
.layout{display:block!important;width:100%!important}.layout>.result{display:none!important}.pp-workspace>.result{display:none!important}.pp-tab-panel[data-panel="results"]>.result{display:block!important;width:100%!important;grid-column:auto!important;grid-row:auto!important;position:static!important;top:auto!important;margin:0!important;min-width:0}
.pp-workspace{display:block!important;width:100%!important;min-width:0}.pp-progress-host{display:block!important;width:100%!important;margin:0 0 12px!important;overflow:visible}
.pp-progress{display:grid;grid-template-columns:repeat(4,minmax(0,1fr))!important;align-items:stretch;width:100%;margin:0;padding:0;background:linear-gradient(180deg,rgba(11,28,38,.96),rgba(6,18,26,.96));border:1px solid var(--line);border-radius:12px;overflow:hidden;box-shadow:0 8px 24px #0004}
.pp-step{position:relative;min-height:70px;border:0;background:transparent;color:var(--muted);padding:10px 42px 10px 18px;display:flex;align-items:center;justify-content:center;gap:12px;font:700 13px Inter,Segoe UI,system-ui,sans-serif;cursor:pointer;transition:background .18s ease,color .18s ease;outline:none}
.pp-step:not(:last-child)::before{content:"→";position:absolute;right:-1px;top:50%;width:30px;height:30px;transform:translateY(-50%);display:grid;place-items:center;background:var(--panel2);border:1px solid var(--line);border-radius:50%;color:var(--accent);font-size:16px;font-weight:900;line-height:1;z-index:3;box-shadow:0 0 0 5px rgba(7,16,24,.98)}
.pp-step:hover{background:#ff78000b;color:var(--text)}.pp-step:focus-visible{box-shadow:inset 0 0 0 2px var(--accent)}.pp-step.active{color:var(--text);background:linear-gradient(180deg,#ff780018,#ff780008)}
.pp-step.active::after{content:"";position:absolute;left:12px;right:12px;bottom:0;height:3px;background:var(--accent);border-radius:3px 3px 0 0;box-shadow:0 0 10px #ff780044}.pp-step.complete .pp-step-number{background:#ff780019;border-color:#ff780055;color:var(--accent)}
.pp-step-number{width:38px;height:38px;border-radius:50%;display:grid;place-items:center;flex:0 0 38px;border:1px solid #36515f;background:#0b1b24;color:#8fa5b0;font-size:14px;font-weight:900}.pp-step.active .pp-step-number{background:var(--accent);border-color:var(--accent);color:#fff;box-shadow:0 0 18px #ff780033}
.pp-step-copy{text-align:left;line-height:1.15}.pp-step-copy strong{display:block;font-size:13px;color:inherit}.pp-step-copy span{display:block;margin-top:4px;font-size:10px;font-weight:500;color:var(--muted)}
.pp-tab-panel{display:none}.pp-tab-panel.active{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px;align-items:start}.pp-card{background:linear-gradient(180deg,var(--panel),var(--panel2));border:1px solid var(--line);border-radius:12px;padding:12px;min-width:0}.pp-card+.pp-card{margin-top:0}.pp-card>.panel{margin:0!important;width:100%!important}.pp-cost-block{background:linear-gradient(180deg,var(--panel),var(--panel2));border:1px solid var(--line);border-radius:12px;padding:12px;min-width:0}.pp-cost-block+.pp-cost-block{margin-top:0}.pp-cost-block>.panel{margin:0!important;width:100%!important}

.pp-model-hub{grid-column:1 / -1;align-self:start}.pp-model-hub .head{margin-bottom:8px}.pp-model-status{font-size:12px;color:var(--muted);padding:9px 10px;border:1px solid var(--line);border-radius:8px;background:#ff780008;margin-bottom:9px}.pp-file-health{display:flex;align-items:center;justify-content:space-between;gap:10px;margin:-2px 0 9px;font-size:10px}.pp-file-health b{font-size:10px;letter-spacing:.06em}.pp-file-health.good b{color:#27b879}.pp-file-health.basic b{color:#d98a00}.pp-file-health.limited b{color:#7b8c96}.pp-apply-detected{border:1px solid var(--accent);background:#ff78000d;color:var(--accent);border-radius:7px;padding:7px 10px;font:700 10px Inter,Segoe UI,system-ui,sans-serif;cursor:pointer}.pp-apply-detected:hover{background:#ff780018}.pp-apply-detected:disabled{opacity:.45;cursor:default}.pp-model-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:8px}.pp-model-grid>div,.pp-model-extra-grid>div{border:1px solid var(--line);border-radius:8px;padding:9px;background:var(--panel2);min-width:0}.pp-model-grid span,.pp-model-extra-grid span{display:block;font-size:10px;color:var(--muted);margin-bottom:4px}.pp-model-grid strong,.pp-model-extra-grid strong{display:block;font-size:13px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.pp-model-extra{margin-top:10px;padding-top:10px;border-top:1px solid var(--line)}.pp-model-extra-title{font-size:9px;font-weight:900;letter-spacing:.18em;color:var(--accent);margin-bottom:7px}.pp-model-extra-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:7px}.pp-model-extra-grid>div{padding:8px}.pp-model-extra-grid strong{font-size:11px}.pp-model-hint{margin-top:8px;font-size:10px;line-height:1.4;color:var(--muted)}@media(max-width:950px){.pp-model-grid{grid-template-columns:1fr 1fr}.pp-model-extra-grid{grid-template-columns:1fr 1fr}}@media(max-width:650px){.pp-model-grid,.pp-model-extra-grid{grid-template-columns:1fr}}
/* Readable section icons */.pp-card .head .icon,.pp-cost-block .head .icon{width:40px!important;height:40px!important;min-width:40px!important;flex:0 0 40px!important;border-radius:10px!important;font-size:17px!important;line-height:1!important}
/* Stable stage height: changing stages must not reflow the page. */
.pp-workspace{position:relative}
.pp-tab-panel{width:100%!important}
.pp-tab-panel[data-panel="details"],.pp-tab-panel[data-panel="machine"],.pp-tab-panel[data-panel="results"]{grid-template-columns:1fr!important}.pp-tab-panel[data-panel="results"]>.result{width:100%!important;margin:0!important;position:static!important;top:auto!important}
.pp-source-actions-placeholder{display:none!important}.pp-global-actions{display:block!important;width:100%!important;margin:16px 0 0!important;padding:10px!important;background:linear-gradient(180deg,#0e202b,#0b1821);border:1px solid var(--line);border-radius:12px;box-shadow:0 8px 24px #0004}.pp-global-actions-buttons{display:grid;grid-template-columns:minmax(0,1.8fr) minmax(0,1fr) minmax(0,.9fr);gap:9px}.pp-global-actions-buttons .btn{width:100%;min-height:46px;font-size:13px;font-weight:800}.pp-global-actions-buttons .btn.accent{box-shadow:0 5px 18px #ff780033}@media(max-width:650px){.pp-global-actions{margin-top:12px!important;padding:8px!important}.pp-global-actions-buttons{grid-template-columns:1fr}.pp-global-actions-buttons .btn{min-height:44px}}

@media(max-width:950px){.pp-progress{grid-template-columns:1fr}.pp-step{justify-content:flex-start;padding:10px 14px;min-height:56px;border-bottom:1px solid var(--line)}.pp-step:last-child{border-bottom:0}.pp-step:not(:last-child)::before{display:none}.pp-step.active::after{left:0;right:auto;top:8px;bottom:8px;width:3px;height:auto}.pp-tab-panel.active{grid-template-columns:1fr}}
@media(max-width:650px){.pp-step-copy span{display:none}.pp-step{padding:9px 10px;min-height:52px}.pp-step-number{width:36px;height:36px;min-width:36px;flex-basis:36px}.pp-card,.pp-cost-block{padding:10px}.pp-card .head .icon,.pp-cost-block .head .icon{width:38px!important;height:38px!important;min-width:38px!important;flex-basis:38px!important}.layout>.result{margin-top:10px!important}}
`;document.head.appendChild(style);
    const progressHost=document.createElement('div');progressHost.id='ppProgressHost';progressHost.className='pp-progress-host';
    const progress=document.createElement('div');progress.id='ppSetupProgress';progress.className='pp-progress';progress.setAttribute('role','tablist');progress.setAttribute('aria-label','Calculator progress');
    progress.innerHTML=`<button type="button" class="pp-step active" data-tab="details" role="tab" aria-selected="true" aria-label="Step 1: Your Model"><span class="pp-step-number">1</span><span class="pp-step-copy"><strong>Your Model</strong><span>Upload your print &amp; view its data</span></span></button><button type="button" class="pp-step" data-tab="machine" role="tab" aria-selected="false" aria-label="Step 2: Print Setup"><span class="pp-step-number">2</span><span class="pp-step-copy"><strong>Print Setup</strong><span>Choose your printer &amp; material</span></span></button><button type="button" class="pp-step" data-tab="costs" role="tab" aria-selected="false" aria-label="Step 3: Costs and Fees"><span class="pp-step-number">3</span><span class="pp-step-copy"><strong>Costs &amp; Fees</strong><span>Add running &amp; selling costs</span></span></button><button type="button" class="pp-step" data-tab="results" role="tab" aria-selected="false" aria-label="Step 4: Results"><span class="pp-step-number">4</span><span class="pp-step-copy"><strong>Results</strong><span>Review cost, price &amp; profit</span></span></button>`;
    const workspace=document.createElement('div');workspace.id='ppTabbedLayout';workspace.className='pp-workspace';
    const panels={};for(const id of ['details','machine','costs','results']){const panel=document.createElement('div');panel.className='pp-tab-panel'+(id==='details'?' active':'');panel.dataset.panel=id;panels[id]=panel;}
    const card=(node,parent)=>{const wrap=document.createElement('div');wrap.className='pp-card';wrap.appendChild(node);parent.appendChild(wrap);};
    card(box1,panels.details);
    const box1Title=box1.querySelector('h2'),box1Desc=box1.querySelector('.head p');if(box1Title)box1Title.textContent='1. Your Model';if(box1Desc)box1Desc.textContent='Upload your sliced file and see all available print information in one place.';
    card(box2,panels.machine);
    card(box6,panels.costs);
    // Turn Stage 1 into the model hub: the upload remains the source, while this live panel surfaces the print data currently known.
    const modelHub=document.createElement('div');modelHub.className='pp-model-hub pp-card';
    modelHub.innerHTML='<div class="head"><div class="icon">⌁</div><div><h2>Print Information</h2><p>Everything PrintProfit currently knows about this model.</p></div></div><div class="pp-model-status" id="ppModelStatus">Drop a print file in to analyse its available data.</div><div class="pp-file-health limited" id="ppFileHealth"><b id="ppFileHealthText">FILE ANALYSIS: WAITING</b><button type="button" class="pp-apply-detected" id="ppApplyDetected" disabled>Apply detected settings</button></div><div class="pp-model-grid"><div><span>File</span><strong id="ppModelFile">—</strong></div><div><span>Print time</span><strong id="ppModelTime">—</strong></div><div><span>Material used</span><strong id="ppModelUsed">—</strong></div><div><span>Material</span><strong id="ppModelMaterial">—</strong></div></div><div class="pp-model-extra"><div class="pp-model-extra-title">FILE INTELLIGENCE</div><div class="pp-model-extra-grid"><div><span>Slicer</span><strong id="ppModelSlicer">—</strong></div><div><span>Printer</span><strong id="ppModelPrinter">—</strong></div><div><span>Layer height</span><strong id="ppModelLayer">—</strong></div><div><span>Infill</span><strong id="ppModelInfill">—</strong></div><div><span>Supports</span><strong id="ppModelSupports">—</strong></div><div><span>Nozzle</span><strong id="ppModelNozzle">—</strong></div><div><span>Bed</span><strong id="ppModelBed">—</strong></div><div><span>Profile</span><strong id="ppModelProfile">—</strong></div></div><div class="pp-model-hint" id="ppModelHint">The more metadata your slicer stores, the more PrintProfit can automatically fill in for you.</div></div>';
    panels.details.appendChild(modelHub);
    const costs4=document.createElement('div');costs4.className='pp-cost-block';costs4.appendChild(box4);panels.costs.appendChild(costs4);
    const costs5=document.createElement('div');costs5.className='pp-cost-block';costs5.appendChild(box5);panels.costs.appendChild(costs5);
    panels.results.appendChild(result);
    const sourceActions=box6.querySelector('.actions');
    const actionBar=document.createElement('section');actionBar.id='ppGlobalActions';actionBar.className='pp-global-actions';actionBar.setAttribute('role','toolbar');actionBar.setAttribute('aria-label','Calculator actions');
    actionBar.innerHTML='<div class="pp-global-actions-buttons"></div>';
    const actionButtons=actionBar.querySelector('.pp-global-actions-buttons');
    if(sourceActions){sourceActions.classList.add('pp-source-actions-placeholder');sourceActions.querySelectorAll('button').forEach(button=>actionButtons.appendChild(button));}
    const resetButton=actionBar.querySelector('#reset');if(resetButton)resetButton.textContent='↺ Reset All';
    Object.values(panels).forEach(panel=>workspace.appendChild(panel));
    layout.innerHTML='';layout.appendChild(workspace);layout.appendChild(actionBar);progressHost.appendChild(progress);layout.parentNode.insertBefore(progressHost,layout);
    const steps=[...progress.querySelectorAll('.pp-step')],ids=['details','machine','costs','results'];
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
      // Keep restored metadata even when the browser cannot repopulate the
      // file input programmatically. The model hub can render from persisted
      // file data until the actual File object is recreated.
      const fileInput=document.getElementById('file');
      const extra=window.__ppFileData||{};
      const setExtra=(id,value)=>{const el=document.getElementById(id);if(el)el.textContent=value!=null&&String(value)!==''?String(value):'—';};
      setExtra('ppModelSlicer',extra.slicer);setExtra('ppModelPrinter',extra.printer);setExtra('ppModelLayer',extra.layer);setExtra('ppModelInfill',extra.infill);setExtra('ppModelSupports',extra.supports);setExtra('ppModelNozzle',extra.nozzle);setExtra('ppModelBed',extra.bed);setExtra('ppModelProfile',extra.profile);
      const detected=['slicer','printer','layer','infill','supports','nozzle','bed','profile','filament','grams','seconds'].filter(k=>extra[k]!=null&&String(extra[k])!=='').length;
      const health=document.getElementById('ppFileHealth'),healthText=document.getElementById('ppFileHealthText'),apply=document.getElementById('ppApplyDetected');
      if(health&&healthText){const level=detected>=5?'good':detected>=2?'basic':'limited';health.className='pp-file-health '+level;healthText.textContent=detected>=5?'FILE ANALYSIS: DETAILED':detected>=2?'FILE ANALYSIS: BASIC':detected?'FILE ANALYSIS: LIMITED':'FILE ANALYSIS: WAITING';}
      if(apply)apply.disabled=!detected||typeof window.__ppApplyFileData!=='function';
      const q=id=>document.getElementById(id);const file=q('file'),status=q('status'),mat=q('material'),used=q('materialUsed');const h=q('ppPrintTimeHours'),m=q('ppPrintTimeMinutes'),legacy=q('printHours');const restoredName=String(window.__ppRestoredFileName||extra.fileName||'').trim();const fileName=file?.files?.[0]?.name||restoredName||'—';q('ppModelFile').textContent=fileName;
      let time='—';const hv=parseInt(h?.value,10),mv=parseInt(m?.value,10);if(Number.isFinite(hv)||Number.isFinite(mv))time=(Number.isFinite(hv)?hv:0)+'h '+(Number.isFinite(mv)?mv:0)+'m';else if(legacy?.value&&Number(legacy.value)>0)time=Number(legacy.value).toFixed(2)+' h';q('ppModelTime').textContent=time;
      const uv=used?.value,unit=mat?.closest('.merge-block')?.querySelector('#materialType')?.value==='resin'?'ml':'g';q('ppModelUsed').textContent=uv&&Number(uv)>0?Number(uv).toFixed(2)+' '+unit:'—';q('ppModelMaterial').textContent=mat?.selectedOptions?.[0]?.text||'—';if(status?.textContent)q('ppModelStatus').textContent=status.textContent;
      const hint=q('ppModelHint');if(hint){if(extra.grams==null&&extra.seconds==null&&detected<2)hint.textContent='Limited metadata found. Upload sliced G-code where possible for a more accurate estimate.';else if(extra.grams==null)hint.textContent='Material usage was not found in this file. Upload sliced G-code for a more accurate estimate.';else if(extra.seconds==null)hint.textContent='Print time was not found in this file. You can enter it manually in Your Model.';else hint.textContent='Detected information can be applied to your Print Setup without guessing missing values.';}
    }
    // Expose a small refresh hook so state restoration can repaint the model hub
    // after an upload has been recreated from browser storage.
    window.__ppRefreshModelHub=updateModelHub;
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

    // The main Calculate button should calculate first, then take the user to
    // the Results stage. This changes only the navigation behaviour; the
    // existing calculator calculation handler remains the same.
    const calculateButton=document.getElementById('calc');
    if(calculateButton&&!calculateButton.dataset.ppResultsNavigationBound){
      calculateButton.dataset.ppResultsNavigationBound='1';
      calculateButton.addEventListener('click',()=>setStep('results'));
    }

    window.addEventListener('resize',()=>stabiliseWorkspace(),{passive:true});
    const applyButton=document.getElementById('ppApplyDetected');if(applyButton&&!applyButton.dataset.ppBound){applyButton.dataset.ppBound='1';applyButton.addEventListener('click',()=>{if(typeof window.__ppApplyFileData==='function'){window.__ppApplyFileData();updateModelHub();}});}watchModelData();
    return true;
  }
  function wait(){if(install())return;const started=Date.now();const timer=setInterval(()=>{if(install()||(Date.now()-started)>=15000)clearInterval(timer);},50);}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',wait,{once:true});else wait();
})();
