(()=>{
  'use strict';

  const profileFields=[
    'printer',
    'materialType','material','materialPack','materialPackCost','materialUsed','printHours',
    'labourHours','labourRate','pack','other','electricityProvider','electricityRate'
  ];
  const storageKey='printProfitProfilesV1';

  function valueOf(id){
    const el=document.getElementById(id);
    return el?el.value:'';
  }

  function setValue(id,value){
    const el=document.getElementById(id);
    if(el)el.value=value==null?'':String(value);
  }

  function setProfileStatus(text){
    const el=document.getElementById('profileSaveStatus');
    if(el)el.textContent=text;
  }

  function getProfiles(){
    try{
      const parsed=JSON.parse(localStorage.getItem(storageKey)||'{}');
      return parsed&&typeof parsed==='object'&&!Array.isArray(parsed)?parsed:{};
    }catch(err){
      console.warn('PrintProfit profile read error:',err);
      return {};
    }
  }

  function putProfiles(profiles){
    try{
      localStorage.setItem(storageKey,JSON.stringify(profiles));
      return true;
    }catch(err){
      console.error('PrintProfit profile save error:',err);
      setProfileStatus('Could not save profiles in this browser.');
      return false;
    }
  }

  function collectProfile(){
    const values={};
    profileFields.forEach(id=>{values[id]=valueOf(id);});
    return {version:1,savedAt:new Date().toISOString(),values};
  }

  function refreshProfiles(selectedName){
    const select=document.getElementById('savedProfileSelect');
    if(!select)return;
    const profiles=getProfiles();
    select.innerHTML='';
    const empty=document.createElement('option');
    empty.value='';
    empty.textContent='Select a saved profile…';
    select.appendChild(empty);
    Object.keys(profiles).sort((a,b)=>a.localeCompare(b)).forEach(name=>{
      const option=document.createElement('option');
      option.value=name;
      option.textContent=name;
      select.appendChild(option);
    });
    if(selectedName&&profiles[selectedName]){
      select.value=selectedName;
      setValue('profileName',selectedName);
    }
  }

  function loadProfile(name){
    const profiles=getProfiles(),profile=profiles[name];
    if(!profile||!profile.values){
      setProfileStatus('That saved profile could not be found.');
      refreshProfiles();
      return;
    }

    const type=profile.values.materialType;
    if(type){
      setValue('materialType',type);
      const materialType=document.getElementById('materialType');
      if(materialType)materialType.dispatchEvent(new Event('change',{bubbles:true}));
    }

    profileFields.forEach(id=>{
      if(id==='materialType')return;
      setValue(id,profile.values[id]);
    });

    setValue('profileName',name);
    refreshProfiles(name);
    const calc=document.getElementById('calc');
    if(calc)calc.click();
    setProfileStatus('Loaded “'+name+'”. Box 1 and Box 5/6 pricing were not changed.');
  }

  function installProfiles(){
    const box6=[...document.querySelectorAll('section.panel')].find(section=>{
      const h=section.querySelector('h2');
      return h&&h.textContent.includes('6. Quantity / Batch Pricing');
    });
    if(!box6||document.getElementById('profileSave'))return;

    const style=document.createElement('style');
    style.id='savedProfilesStyle';
    style.textContent=`
.profile-save{margin-top:9px;padding-top:9px;border-top:1px solid var(--line)}
.profile-save-grid{display:grid;grid-template-columns:1.25fr 1.25fr auto auto;gap:7px;align-items:end}
.profile-save-actions{display:flex;gap:7px;flex-wrap:wrap;margin-top:7px}
.profile-save-status{margin-top:6px;line-height:1.35}
@media(max-width:650px){.profile-save-grid{grid-template-columns:1fr 1fr}.profile-save-grid>div:first-child{grid-column:1 / -1}.profile-save-grid .wide-select{grid-column:1 / -1}}
`;
    document.head.appendChild(style);

    const three=box6.querySelector('.three');
    const actions=box6.querySelector('.actions');
    if(!three||!actions)return;

    const wrap=document.createElement('div');
    wrap.id='profileSave';
    wrap.className='profile-save';
    wrap.innerHTML=`
<div class="small"><b style="color:var(--text)">Saved Setup Profiles</b> — save your Box 2, 3 and 4 settings so you can reuse the same printer, material and operating costs.</div>
<div class="profile-save-grid" style="margin-top:7px">
  <div><label for="profileName">Profile name</label><input id="profileName" type="text" maxlength="60" placeholder="e.g. A1 + PLA + my costs"></div>
  <div class="wide-select"><label for="savedProfileSelect">Saved profiles</label><select id="savedProfileSelect"><option value="">Select a saved profile…</option></select></div>
  <div><button type="button" class="btn" id="saveProfile">Save</button></div>
  <div><button type="button" class="btn" id="loadProfile">Load</button></div>
</div>
<div class="profile-save-actions"><button type="button" class="btn" id="deleteProfile">Delete Selected</button></div>
<div class="small profile-save-status" id="profileSaveStatus">Profiles are saved only in this browser on this device.</div>`;
    box6.insertBefore(wrap,actions);

    const nameInput=document.getElementById('profileName');
    const profileSelect=document.getElementById('savedProfileSelect');
    const saveButton=document.getElementById('saveProfile');
    const loadButton=document.getElementById('loadProfile');
    const deleteButton=document.getElementById('deleteProfile');

    refreshProfiles();

    saveButton.addEventListener('click',()=>{
      const name=nameInput.value.trim();
      if(!name){
        setProfileStatus('Enter a profile name first.');
        nameInput.focus();
        return;
      }
      const profiles=getProfiles();
      const replacing=!!profiles[name];
      profiles[name]=collectProfile();
      if(putProfiles(profiles)){
        refreshProfiles(name);
        setProfileStatus((replacing?'Updated “':'Saved “')+name+'”.');
      }
    });

    loadButton.addEventListener('click',()=>{
      const name=profileSelect.value;
      if(!name){
        setProfileStatus('Select a saved profile to load.');
        return;
      }
      loadProfile(name);
    });

    deleteButton.addEventListener('click',()=>{
      const name=profileSelect.value;
      if(!name){
        setProfileStatus('Select a saved profile to delete.');
        return;
      }
      const profiles=getProfiles();
      if(!profiles[name]){
        refreshProfiles();
        setProfileStatus('That saved profile could not be found.');
        return;
      }
      delete profiles[name];
      if(putProfiles(profiles)){
        refreshProfiles();
        setValue('profileName','');
        setProfileStatus('Deleted “'+name+'”.');
      }
    });

    profileSelect.addEventListener('change',()=>{
      if(profileSelect.value)setValue('profileName',profileSelect.value);
    });
  }

  function installResetOverride(){
    document.addEventListener('click',event=>{
      const reset=event.target&&event.target.closest?event.target.closest('#reset'):null;
      if(!reset)return;
      event.preventDefault();
      event.stopPropagation();
      setValue('materialPackCost','0');
      setValue('sell','0');
      const calc=document.getElementById('calc');
      if(calc)calc.click();
      setProfileStatus('Reset: spool / bottle cost and selling price returned to £0.');
    },true);
  }

  function installNavigation(){
    const style=document.createElement('style');
    style.id='printProfitNavigationStyle';
    style.textContent=`
.pp-modal{position:fixed;inset:0;z-index:100;background:#0009;display:none;align-items:center;justify-content:center;padding:18px}
.pp-modal.open{display:flex}
.pp-modal-card{width:min(700px,100%);max-height:min(78vh,760px);overflow:auto;background:linear-gradient(180deg,var(--panel),var(--panel2));border:1px solid var(--line);border-radius:14px;box-shadow:0 18px 60px #000a;padding:20px;position:relative}
.pp-modal-card h2{margin:0 42px 6px 0;font-size:22px}
.pp-modal-card p{line-height:1.55}
.pp-modal-close{position:absolute;top:12px;right:12px;width:36px;height:36px;border:1px solid var(--line);border-radius:9px;background:var(--panel2);color:var(--text);font-size:20px;cursor:pointer}
.pp-modal-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:10px;margin-top:14px}
.pp-modal-box{border:1px solid var(--line);border-radius:10px;padding:12px}
.pp-modal-box b{display:block;margin-bottom:4px;color:var(--accent)}
.pp-modal-link{display:inline-block;margin-top:8px;color:var(--accent);text-decoration:none;font-weight:700}
.pp-modal-link:hover{text-decoration:underline}
@media(max-width:650px){.pp-modal{padding:9px}.pp-modal-card{padding:15px}.pp-modal-grid{grid-template-columns:1fr}}
`;
    document.head.appendChild(style);

    const modal=document.createElement('div');
    modal.className='pp-modal';
    modal.id='ppInfoModal';
    modal.innerHTML=`
<div class="pp-modal-card" role="dialog" aria-modal="true" aria-labelledby="ppModalTitle">
  <button class="pp-modal-close" type="button" aria-label="Close">×</button>
  <h2 id="ppModalTitle"></h2>
  <div id="ppModalBody"></div>
</div>`;
    document.body.appendChild(modal);

    const title=document.getElementById('ppModalTitle');
    const body=document.getElementById('ppModalBody');
    const close=()=>modal.classList.remove('open');

    const pages={
      '#guides':{
        title:'PrintProfit Guides',
        body:`
<p>Use PrintProfit to work out what a print actually costs, then price it for a sale with your chosen fees and delivery costs.</p>
<div class="pp-modal-grid">
  <div class="pp-modal-box"><b>1. Add your print</b>Upload a G-code or supported file so PrintProfit can use the print time and material usage when those values are available.</div>
  <div class="pp-modal-box"><b>2. Choose your setup</b>Select your printer and material profile, then check the spool or bottle size and cost.</div>
  <div class="pp-modal-box"><b>3. Add operating costs</b>Enter labour, packaging, other costs and your electricity tariff to build a more realistic per-print cost.</div>
  <div class="pp-modal-box"><b>4. Price the sale</b>Choose your selling platform, delivery rate, quantity and discount, then compare single-print and batch pricing.</div>
</div>
<p>Saved Setup Profiles let you save Boxes 2–4 on this device so the same printer, material and operating costs can be reused later.</p>`
      },
      '#about':{
        title:'About PrintProfit',
        body:`
<p>PrintProfit is a 3D-printing cost and pricing calculator designed to bring material, machine time, electricity, labour, packaging, marketplace fees and delivery into one place.</p>
<div class="pp-modal-box"><b>What it is for</b>Estimate the cost of making an item and explore selling prices and margins without having to work the figures out by hand.</div>
<p class="small">Prices, platform fees and delivery rates are reference figures and can vary. Check the current rate with the relevant provider before relying on a quote.</p>`
      },
      '#support':{
        title:'PrintProfit Support',
        body:`
<p>Found a bug, have an idea, or something on the calculator not behaving as expected?</p>
<div class="pp-modal-box"><b>GitHub support</b>Open an issue in the PrintProfit repository and include what you clicked, what you expected to happen, and what happened instead.</div>
<a class="pp-modal-link" href="https://github.com/MissinLink92/PrintProfit/issues" target="_blank" rel="noopener">Open PrintProfit issues ↗</a>`
      }
    };

    function openPage(hash){
      const page=pages[hash];
      if(!page)return;
      title.textContent=page.title;
      body.innerHTML=page.body;
      modal.classList.add('open');
    }

    const navLinks=[...document.querySelectorAll('.nav a')];
    navLinks.forEach(link=>{
      link.addEventListener('click',event=>{
        const hash=new URL(link.href,location.href).hash||'#home';
        event.preventDefault();
        navLinks.forEach(item=>item.classList.remove('active'));
        link.classList.add('active');
        if(hash==='#home'){
          close();
          window.scrollTo({top:0,behavior:'smooth'});
        }else{
          openPage(hash);
        }
      });
    });

    modal.addEventListener('click',event=>{
      if(event.target===modal)close();
      if(event.target.closest('.pp-modal-close'))close();
    });
    document.addEventListener('keydown',event=>{
      if(event.key==='Escape')close();
    });
  }

  function panelTitle(panel){
    const h=panel&&panel.querySelector('h2');
    return h?h.textContent.trim():'';
  }

  function installTabbedLayout(){
    if(document.getElementById('ppTabbedLayout'))return;
    const layout=document.querySelector('.layout');
    if(!layout)return;

    const result=layout.querySelector(':scope > .result')||layout.querySelector('.result');
    const source=[...layout.children].find(child=>child!==result);
    if(!source||!result)return;

    const box1=[...source.querySelectorAll(':scope > section.panel')].find(panel=>panelTitle(panel).startsWith('1.'))||source.querySelector(':scope > section.panel');
    const box6=[...source.querySelectorAll(':scope > section.panel')].find(panel=>panelTitle(panel).startsWith('6.'))||null;
    const two=source.querySelector(':scope > .two');
    const box2=two?[...two.children].find(panel=>panelTitle(panel).startsWith('2.'))||two.children[0]:null;
    const box3=two?[...two.children].find(panel=>panelTitle(panel).startsWith('3.'))||two.children[1]:null;
    const guides=source.querySelector(':scope > #guides');

    if(!box1||!box2||!box3||!box6||!guides)return;

    const style=document.createElement('style');
    style.id='ppTabbedLayoutStyles';
    style.textContent=`
/* PrintProfit tabbed workspace V1 */
.layout{display:grid;grid-template-columns:minmax(0,1fr) minmax(350px,390px);gap:14px;align-items:start}
.layout>.result{grid-column:auto;grid-row:auto;position:sticky;top:88px;min-width:0}
.pp-workspace{min-width:0}
.pp-tabs{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:0;background:rgba(14,32,43,.72);border:1px solid var(--line);border-radius:12px;overflow:hidden;margin:0 0 12px;box-shadow:0 8px 24px #0004}
.pp-tab{position:relative;border:0;border-right:1px solid var(--line);background:transparent;color:var(--muted);min-height:54px;padding:9px 12px;display:flex;align-items:center;justify-content:center;gap:9px;font:700 13px Inter,Segoe UI,system-ui,sans-serif;cursor:pointer;transition:background .16s ease,color .16s ease}
.pp-tab:last-child{border-right:0}
.pp-tab:hover{background:#ff78000b;color:var(--text)}
.pp-tab.active{color:var(--text);background:linear-gradient(180deg,#ff780017,#ff78000a)}
.pp-tab.active::after{content:"";position:absolute;left:12%;right:12%;bottom:0;height:3px;background:var(--accent);border-radius:3px 3px 0 0}
.pp-tab-icon{width:28px;height:28px;border-radius:8px;border:1px solid var(--line);display:grid;place-items:center;background:var(--panel2);font-size:14px;color:var(--text)}
.pp-tab.active .pp-tab-icon{background:var(--accent);border-color:var(--accent);color:#fff}
.pp-tab-copy{display:flex;flex-direction:column;align-items:flex-start;min-width:0}
.pp-tab-copy small{font-size:10px;font-weight:600;color:var(--muted);margin-top:2px;white-space:nowrap}
.pp-tab.active .pp-tab-copy small{color:#dfe7ed}
.pp-pane{display:none;min-width:0}
.pp-pane.active{display:block}
.pp-pane>.panel{margin-top:0!important;margin-bottom:12px}
.pp-pane>.panel:last-child{margin-bottom:0}
.pp-pane>.panel,.pp-pane>#guides{min-width:0}
.pp-pane[data-tab="printer"]>.panel-grid{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:12px;align-items:start}
.pp-pane[data-tab="printer"]>.panel-grid>.panel{margin:0}
.pp-pane[data-tab="costs"]>#guides{display:block!important;margin:0}
.pp-pane[data-tab="costs"]>#guides>.merged-group{margin-top:0}
.pp-pane[data-tab="costs"]>#guides>.merged-group+.merged-group{margin-top:12px}
.pp-pane[data-tab="costs"]>#guides>.merged-group:last-child{margin-bottom:0}
.pp-pane[data-tab="details"]>.detail-grid{display:grid;grid-template-columns:minmax(0,1fr);gap:12px}
.pp-pane[data-tab="details"]>.detail-grid>.panel{margin:0}
@media(max-width:1100px){
  .layout{grid-template-columns:minmax(0,1fr) minmax(320px,37%)}
  .pp-pane[data-tab="printer"]>.panel-grid{grid-template-columns:1fr}
}
@media(max-width:950px){
  .layout{grid-template-columns:1fr}
  .layout>.result{position:static}
}
@media(max-width:650px){
  .pp-tabs{grid-template-columns:1fr}
  .pp-tab{justify-content:flex-start;padding-left:14px;border-right:0;border-bottom:1px solid var(--line);min-height:50px}
  .pp-tab:last-child{border-bottom:0}
  .pp-tab.active::after{left:0;right:auto;top:0;bottom:0;width:3px;height:auto;border-radius:0 3px 3px 0}
}
`;
    document.head.appendChild(style);

    const workspace=document.createElement('div');
    workspace.id='ppTabbedLayout';
    workspace.className='pp-workspace';

    const tabs=document.createElement('div');
    tabs.className='pp-tabs';
    tabs.setAttribute('role','tablist');

    const panes={};
    const tabDefs=[
      {id:'details',label:'Print Details',sub:'Model, quantity & job',icon:'⌘'},
      {id:'printer',label:'Printer & Filament',sub:'Machine & material',icon:'▦'},
      {id:'costs',label:'Costs & Fees',sub:'Running & selling costs',icon:'£'}
    ];

    tabDefs.forEach((def,index)=>{
      const button=document.createElement('button');
      button.type='button';
      button.className='pp-tab'+(index===0?' active':'');
      button.dataset.tab=def.id;
      button.setAttribute('role','tab');
      button.setAttribute('aria-selected',index===0?'true':'false');
      button.innerHTML=`<span class="pp-tab-icon">${def.icon}</span><span class="pp-tab-copy"><span>${def.label}</span><small>${def.sub}</small></span>`;
      tabs.appendChild(button);
    });

    const detailsPane=document.createElement('div');
    detailsPane.className='pp-pane active';
    detailsPane.dataset.tab='details';
    detailsPane.setAttribute('role','tabpanel');
    const detailGrid=document.createElement('div');
    detailGrid.className='detail-grid';
    detailGrid.append(box1,box6);
    detailsPane.appendChild(detailGrid);

    const printerPane=document.createElement('div');
    printerPane.className='pp-pane';
    printerPane.dataset.tab='printer';
    printerPane.setAttribute('role','tabpanel');
    const panelGrid=document.createElement('div');
    panelGrid.className='panel-grid';
    panelGrid.append(box2,box3);
    printerPane.appendChild(panelGrid);

    const costsPane=document.createElement('div');
    costsPane.className='pp-pane';
    costsPane.dataset.tab='costs';
    costsPane.setAttribute('role','tabpanel');
    costsPane.appendChild(guides);

    panes.details=detailsPane;
    panes.printer=printerPane;
    panes.costs=costsPane;

    workspace.append(tabs,detailsPane,printerPane,costsPane);
    layout.insertBefore(workspace,result);
    source.remove();

    tabs.addEventListener('click',event=>{
      const button=event.target.closest('.pp-tab');
      if(!button)return;
      const id=button.dataset.tab;
      [...tabs.querySelectorAll('.pp-tab')].forEach(item=>{
        const active=item===button;
        item.classList.toggle('active',active);
        item.setAttribute('aria-selected',active?'true':'false');
      });
      Object.entries(panes).forEach(([key,pane])=>pane.classList.toggle('active',key===id));
    });

    result.scrollIntoView={};
  }

  function boot(){
    installProfiles();
    installResetOverride();
    installNavigation();
    installTabbedLayout();
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});
  else boot();
})();
