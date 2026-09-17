(()=>{
  'use strict';
  if(window.__printProfitUIEnhancementsInstalled)return;
  window.__printProfitUIEnhancementsInstalled=true;

  const storageKey='printProfitProfilesV1';
  const profileFields=[
    'printer',
    'materialType','material','materialPack','materialPackCost','materialUsed','printHours',
    'labourHours','labourRate','pack','other','electricityProvider','electricityRate'
  ];

  const $=id=>document.getElementById(id);
  const findBox=number=>[...document.querySelectorAll('section.panel')].find(section=>{
    const h=section.querySelector('h2');
    return h&&h.textContent.trim().startsWith(number+'.');
  });

  function getProfiles(){
    try{
      const value=JSON.parse(localStorage.getItem(storageKey)||'{}');
      return value&&typeof value==='object'&&!Array.isArray(value)?value:{};
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
      return false;
    }
  }

  function collectProfile(){
    const values={};
    profileFields.forEach(id=>{
      const el=$(id);
      values[id]=el?el.value:'';
    });
    return {version:1,savedAt:new Date().toISOString(),values};
  }

  function setValue(id,value){
    const el=$(id);
    if(el)el.value=value==null?'':String(value);
  }

  function recalc(){
    const calc=$('calc');
    if(calc)calc.click();
  }

  function loadProfile(name){
    const profile=getProfiles()[name];
    if(!profile||!profile.values)return false;

    if(profile.values.materialType){
      setValue('materialType',profile.values.materialType);
      const type=$('materialType');
      if(type)type.dispatchEvent(new Event('change',{bubbles:true}));
    }

    profileFields.forEach(id=>{
      if(id==='materialType')return;
      setValue(id,profile.values[id]);
    });

    recalc();
    return true;
  }

  function refreshQuickSelect(select,selected){
    if(!select)return;
    const profiles=getProfiles();
    select.innerHTML='';
    const first=document.createElement('option');
    first.value='';
    first.textContent='Select a saved setup…';
    select.appendChild(first);
    Object.keys(profiles).sort((a,b)=>a.localeCompare(b)).forEach(name=>{
      const option=document.createElement('option');
      option.value=name;
      option.textContent=name;
      select.appendChild(option);
    });
    if(selected&&profiles[selected])select.value=selected;
  }

  function installQuickSetup(){
    if($('ppQuickSetup'))return;
    const box2=findBox('2');
    if(!box2)return false;
    const card=box2.closest('.pp-card');
    if(!card||!card.parentElement)return false;

    const wrap=document.createElement('div');
    wrap.className='pp-card pp-quick-setup-card';
    wrap.id='ppQuickSetup';
    wrap.innerHTML=`
      <div class="pp-mini-head"><span class="pp-mini-icon">⚡</span><div><strong>Quick Setup</strong><span>Load or save your usual printer, material and cost settings.</span></div></div>
      <div class="pp-quick-row">
        <select id="ppQuickProfile" aria-label="Saved setup"><option value="">Select a saved setup…</option></select>
        <button type="button" class="btn" id="ppQuickLoad">Load</button>
      </div>
      <div class="pp-quick-row pp-quick-save-row">
        <input id="ppQuickName" type="text" maxlength="60" placeholder="Setup name (for Save Current)">
        <button type="button" class="btn" id="ppQuickSave">Save Current</button>
      </div>
      <div class="small pp-quick-status" id="ppQuickStatus">Saved setups stay on this device and can also be managed in Quantity / Batch Pricing.</div>`;

    card.insertAdjacentElement('afterend',wrap);

    const select=$('ppQuickProfile');
    const name=$('ppQuickName');
    const status=$('ppQuickStatus');
    refreshQuickSelect(select);

    $('ppQuickLoad')?.addEventListener('click',()=>{
      const chosen=select.value;
      if(!chosen){status.textContent='Select a saved setup first.';return;}
      status.textContent=loadProfile(chosen)?'Loaded “'+chosen+'”. You can still edit any field manually.':'That saved setup could not be found.';
      if(loadProfile && chosen){}
    });

    $('ppQuickSave')?.addEventListener('click',()=>{
      const setupName=name.value.trim();
      if(!setupName){
        status.textContent='Enter a setup name first.';
        name.focus();
        return;
      }
      const profiles=getProfiles();
      const replacing=!!profiles[setupName];
      profiles[setupName]=collectProfile();
      if(putProfiles(profiles)){
        refreshQuickSelect(select,setupName);
        status.textContent=(replacing?'Updated “':'Saved “')+setupName+'”.';
      }else status.textContent='Could not save the setup in this browser.';
    });

    select.addEventListener('change',()=>{
      if(select.value)name.value=select.value;
    });
    return true;
  }

  function installGuidanceAndProgress(){
    const workspace=$('ppTabbedLayout');
    const tabs=workspace?.querySelector('.pp-tabs');
    if(!workspace||!tabs||$('ppSetupGuide'))return false;

    const guide=document.createElement('div');
    guide.id='ppSetupGuide';
    guide.className='pp-setup-guide';
    guide.innerHTML=`<span class="pp-guide-title">How it works</span><span>① Add your print</span><i>→</i><span>② Choose printer & material</span><i>→</i><span>③ Add costs & fees</span><b>Fields are optional — fill in what you know.</b>`;
    tabs.insertAdjacentElement('afterend',guide);

    const progress=document.createElement('div');
    progress.id='ppSetupProgress';
    progress.className='pp-setup-progress';
    progress.innerHTML=`<div class="pp-progress-track"><span class="pp-progress-fill"></span></div><div class="pp-progress-label">Step 1 of 3 · Print Details</div>`;
    guide.insertAdjacentElement('afterend',progress);

    const tabButtons=[...tabs.querySelectorAll('.pp-tab')];
    const fill=progress.querySelector('.pp-progress-fill');
    const label=progress.querySelector('.pp-progress-label');
    const names=['Print Details','Printer & Filament','Costs & Fees'];
    const sync=()=>{
      const index=Math.max(0,tabButtons.findIndex(tab=>tab.classList.contains('active')));
      if(fill)fill.style.width=((index+1)/3*100)+'%';
      if(label)label.textContent='Step '+(index+1)+' of 3 · '+names[index]+' · '+(index===2?'Results update below':'Next step is optional');
    };
    tabButtons.forEach(tab=>tab.addEventListener('click',sync));
    sync();
    return true;
  }

  function installResultsPolish(){
    const result=document.querySelector('.result');
    if(!result||$('ppResultsIntro'))return false;
    const intro=document.createElement('div');
    intro.id='ppResultsIntro';
    intro.className='pp-results-intro';
    intro.innerHTML=`<div><span class="pp-results-kicker">LIVE CALCULATION</span><strong>Results</strong><span>Costs, selling price and profit update from your current settings.</span></div><span class="pp-results-badge">No fields are mandatory</span>`;
    result.insertBefore(intro,result.firstChild);
    result.classList.add('pp-results-enhanced');
    return true;
  }

  function installBrokenImageFallbacks(){
    const brand=document.querySelector('.brand img');
    if(brand&&!brand.dataset.ppFallbackBound){
      brand.dataset.ppFallbackBound='1';
      const fallback=()=>{
        if(brand.dataset.ppFallbackShown)return;
        brand.dataset.ppFallbackShown='1';
        brand.style.display='none';
        const node=document.createElement('div');
        node.className='pp-brand-fallback';
        node.innerHTML='<strong>Print<span>Profit</span></strong><small>3D PRINTING COST & PRICING</small>';
        brand.parentElement.appendChild(node);
      };
      brand.addEventListener('error',fallback,{once:true});
      if(brand.complete&&brand.naturalWidth===0)fallback();
    }

    const hero=document.querySelector('.hero img');
    if(hero&&!hero.dataset.ppFallbackBound){
      hero.dataset.ppFallbackBound='1';
      const fallback=()=>{
        if(hero.dataset.ppFallbackShown)return;
        hero.dataset.ppFallbackShown='1';
        hero.style.display='none';
        const node=document.createElement('div');
        node.className='pp-hero-fallback';
        node.innerHTML='<div><span>PRINTPROFIT</span><strong>Know your cost. Price your print.</strong><small>Material · Machine time · Electricity · Labour · Fees</small></div>';
        hero.parentElement.appendChild(node);
      };
      hero.addEventListener('error',fallback,{once:true});
      if(hero.complete&&hero.naturalWidth===0)fallback();
    }
  }

  function installStyles(){
    if($('ppUIEnhancementStyles'))return;
    const style=document.createElement('style');
    style.id='ppUIEnhancementStyles';
    style.textContent=`
.pp-setup-guide{display:flex;align-items:center;gap:8px;flex-wrap:wrap;padding:8px 10px;margin:0 0 8px;border:1px solid var(--line);border-radius:10px;background:linear-gradient(90deg,#ff78000d,transparent);font-size:11px;color:var(--muted)}
.pp-setup-guide .pp-guide-title{color:var(--text);font-weight:800}.pp-setup-guide i{font-style:normal;color:var(--accent);font-weight:800}.pp-setup-guide b{margin-left:auto;color:var(--muted);font-weight:600}
.pp-setup-progress{margin:0 0 12px;padding:0 2px}.pp-progress-track{height:4px;background:var(--panel2);border:1px solid var(--line);border-radius:99px;overflow:hidden}.pp-progress-fill{display:block;height:100%;width:33.333%;background:linear-gradient(90deg,var(--accent),#ffb15c);border-radius:99px;transition:width .18s ease}.pp-progress-label{margin-top:5px;text-align:right;font-size:10px;color:var(--muted)}
.pp-quick-setup-card{margin:0!important}.pp-mini-head{display:flex;align-items:center;gap:8px;margin-bottom:9px}.pp-mini-icon{width:28px;height:28px;border-radius:8px;display:grid;place-items:center;background:#ff780014;border:1px solid #ff78003d;color:var(--accent);flex:0 0 auto}.pp-mini-head strong{display:block;font-size:14px;color:var(--text)}.pp-mini-head span{display:block;margin-top:2px;font-size:10.5px;color:var(--muted)}.pp-quick-row{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:7px;margin-top:7px}.pp-quick-row .btn{white-space:nowrap}.pp-quick-save-row{grid-template-columns:minmax(0,1fr) auto}.pp-quick-status{margin-top:7px;line-height:1.35}
.pp-results-enhanced{background:linear-gradient(180deg,#0d1d28,#0a1720);border-color:#355466;box-shadow:0 10px 30px #0004}.pp-results-intro{display:flex;justify-content:space-between;gap:12px;align-items:center;padding:4px 2px 10px}.pp-results-intro>div{min-width:0}.pp-results-kicker{display:block;font-size:9px;letter-spacing:.11em;font-weight:800;color:var(--accent);margin-bottom:2px}.pp-results-intro strong{display:block;font-size:24px;line-height:1.05}.pp-results-intro>div>span:last-child{display:block;margin-top:5px;font-size:11px;color:var(--muted)}.pp-results-badge{font-size:10px;color:var(--muted);border:1px solid var(--line);border-radius:999px;padding:5px 8px;white-space:nowrap}.pp-results-enhanced .cards{gap:8px}.pp-results-enhanced .card{padding:12px;border-radius:10px;background:#102430}.pp-results-enhanced .card .small{font-size:10px}.pp-results-enhanced .value{font-size:25px;margin-top:5px}.pp-results-enhanced .break{background:#09151d}.pp-results-enhanced .quick{background:#09151d;padding:9px;border:1px solid var(--line);border-radius:10px}.pp-results-enhanced .quick .grid{margin-top:6px}
.brand{display:flex;align-items:center}.pp-brand-fallback{display:flex;flex-direction:column;justify-content:center;line-height:.95;min-height:48px}.pp-brand-fallback strong{font-size:28px;letter-spacing:-.04em;color:#fff}.pp-brand-fallback strong span{color:var(--accent)}.pp-brand-fallback small{font-size:7px;letter-spacing:.2em;color:var(--muted);margin-top:6px}
.pp-hero-fallback{min-height:112px;display:flex;align-items:center;justify-content:center;text-align:center;background:radial-gradient(circle at 18% 50%,#ff780018,transparent 32%),radial-gradient(circle at 85% 20%,#ff78000e,transparent 28%),linear-gradient(135deg,#08131b 0%,#102431 48%,#071018 100%);position:relative;overflow:hidden}.pp-hero-fallback:after{content:"";position:absolute;inset:0;background-image:linear-gradient(#ffffff08 1px,transparent 1px),linear-gradient(90deg,#ffffff08 1px,transparent 1px);background-size:28px 28px;mask-image:linear-gradient(90deg,transparent,#000 18%,#000 82%,transparent);pointer-events:none}.pp-hero-fallback>div{position:relative;z-index:1;padding:22px 16px}.pp-hero-fallback span{display:block;color:var(--accent);font-size:10px;font-weight:900;letter-spacing:.25em;margin-bottom:7px}.pp-hero-fallback strong{display:block;font-size:24px;line-height:1.15}.pp-hero-fallback small{display:block;color:var(--muted);font-size:10px;margin-top:7px}
@media(max-width:950px){.pp-setup-guide b{width:100%;margin-left:0}.pp-results-intro{align-items:flex-start}.pp-results-badge{display:none}}
@media(max-width:650px){.pp-setup-guide{gap:6px}.pp-setup-guide i{display:none}.pp-setup-guide span:not(.pp-guide-title),.pp-setup-guide b{display:none}.pp-setup-guide .pp-guide-title:after{content:' · Add print → choose setup → add costs';font-weight:500;color:var(--muted)}.pp-results-intro strong{font-size:21px}.pp-results-enhanced .value{font-size:22px}.pp-quick-row{grid-template-columns:1fr}.pp-hero-fallback{min-height:92px}.pp-hero-fallback strong{font-size:19px}}
`;
    document.head.appendChild(style);
  }

  function boot(){
    installStyles();
    installGuidanceAndProgress();
    installQuickSetup();
    installResultsPolish();
    installBrokenImageFallbacks();
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});
  else boot();
})();
