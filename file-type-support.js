/* One upload path for G-code, binary G-code and sliced projects. */
(() => {
  'use strict';
  if(window.__printProfitFileTypeSupport) return;
  window.__printProfitFileTypeSupport=true;
  const $=id=>document.getElementById(id),STORE='printprofit.uploaded-file.v1';
  const supported=['gcode','gco','bgcode','nc','ngc','gc','g','3mf','sl1','sl1s','lys','chitubox','ctb','photon','pwma','pwmo','pws','goo','stl','obj','amf','ply','step','stp'];
  let generation=0,result=null,images=[],renderedData=null,renderedImages=null;
  const text=(tag,value,className)=>{const el=document.createElement(tag);el.textContent=String(value??'');if(className) el.className=className;return el;};
  const available=v=>v!==null&&v!==undefined&&String(v)!=='';
  function status(value){if($('status')) $('status').textContent=value;}
  function setValue(id,value){const el=$(id);if(!el||value===null||value===undefined) return false;el.value=String(value);el.dispatchEvent(new Event('input',{bubbles:true}));el.dispatchEvent(new Event('change',{bubbles:true}));return true;}
  function selectMatch(id,desired){
    const el=$(id);if(!el||!desired) return false;
    const normal=v=>String(v).toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
    const wanted=normal(desired),options=[...el.options].filter(o=>o.value&&normal(o.textContent).length>1);
    const exact=options.find(o=>normal(o.textContent)===wanted||normal(o.value)===wanted);
    const match=exact||options.find(o=>normal(o.textContent).includes(wanted)&&wanted.length>=3);
    if(!match) return false;return setValue(id,match.value);
  }
  function apply(data,usageOnly=false){
    if(!data) return false;
    if(!usageOnly){
      selectMatch('printer',data.printer);
      if(data.technology==='SLA') setValue('materialType','resin');
      else if(data.format==='G-code'||data.format==='Binary G-code'||data.technology==='FFF'||data.technology==='FDM') setValue('materialType','filament');
      const types=[...new Set((data.materials||[]).map(m=>m.type).filter(Boolean))];
      if(types.length===1) selectMatch('material',types[0]);
      // The calculator has a single material price. Different materials need a weighted price entered by the user.
      const rho=(String(data.density||'').match(/^([\d.]+)\s*g\/cm³$/)||[])[1];
      if(rho) setValue('materialDensity',rho);
    }
    // Clear missing usage/time so a newly uploaded file never inherits the previous print's estimates.
    const isResin=$('materialType')?.value==='resin';
    const density=Number.parseFloat(data.density);
    const usage=isResin?(Number.isFinite(data.resinVolume)?data.resinVolume:Number.isFinite(data.grams)&&density>0?data.grams/density:null):data.grams;
    setValue('materialUsed',Number.isFinite(usage)?usage.toFixed(2):'');
    setValue('printHours',Number.isFinite(data.seconds)?data.seconds/3600:'');
    $('calc')?.click();return true;
  }
  function release(list){for(const i of list||[]) if(i.url?.startsWith('blob:')) URL.revokeObjectURL(i.url);}
  async function fileDb(){return new Promise((resolve,reject)=>{const r=indexedDB.open(STORE,1);r.onupgradeneeded=()=>{if(!r.result.objectStoreNames.contains('files')) r.result.createObjectStore('files');};r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error);});}
  // Serialise storage writes so rapid replacement/clear cannot resurrect an older file.
  let storage=Promise.resolve();
  function storeFile(file){
    storage=storage.catch(()=>{}).then(async()=>{const db=await fileDb();try{await new Promise((resolve,reject)=>{const tx=db.transaction('files','readwrite'),s=tx.objectStore('files');if(file) s.put({blob:file,name:file.name,type:file.type,lastModified:file.lastModified},'latest');else s.delete('latest');tx.oncomplete=resolve;tx.onerror=()=>reject(tx.error);});}finally{db.close();}});
    return storage.catch(error=>console.warn('PrintProfit could not save the uploaded file:',error));
  }
  window.__ppPersistUploadedFile=storeFile;
  function clearFile(clearInput=true){
    generation++;release(images);images=[];result=null;renderedData=null;
    window.__ppFileData={};window.__ppRestoredFileName='';
    if(clearInput&&$('file')) $('file').value='';
    storeFile(null);$('ppFileMetadata')?.remove();
    window.__ppRefreshModelHub?.();renderDetails(window.__ppFileData);
  }
  window.__ppClearSlicerFile=clearFile;
  function selectPlate(id,importValues=true){
    const plate=result?.plates.find(p=>String(p.id)===String(id));if(!plate) return;
    const data={...plate,fileName:result.fileName,fileSize:result.fileSize,format:result.format,
      selectedPlate:plate.id,plateCount:result.plates.length,plateOptions:result.plates.map(p=>({id:p.id,name:p.name})),warnings:result.warnings,
      packageObjectCount:result.packageObjectCount};
    window.__ppFileData=data;window.__ppRestoredFileName=result.fileName;
    if(importValues) apply(data);
    status('✓ '+result.fileName+' — '+(result.plates.length>1?plate.name+' selected. ':'')+'Available slicer information imported.');
    window.__ppRefreshModelHub?.();renderDetails(data);
    window.__printProfitPersistDraft?.();
  }
  async function inspect(file){
    if(!file) return;
    const restoring=!!window.__ppRestoringFile,savedPlate=window.__ppRestoringPlate;
    window.__ppRestoringFile=false;window.__ppRestoringPlate=null;
    clearFile(false);const ticket=generation;
    if(!restoring){setValue('materialUsed','');setValue('printHours','');}
    status('Reading '+file.name+' — collecting print information and preview images…');
    storeFile(file);
    try {
      if(!window.PrintProfitSlicerFile) throw Error('The file reader has not loaded. Refresh the page and try again.');
      const parsed=await window.PrintProfitSlicerFile.parse(file,{density:$('materialDensity')?.value});
      if(ticket!==generation){release(parsed.images);return;}
      result=parsed;images=parsed.images;
      const first=result.plates.find(p=>p.id===savedPlate)||result.plates.find(p=>p.seconds!==null&&p.seconds!==undefined)||result.plates[0];
      selectPlate(first.id,!restoring);
    }catch(error){
      if(ticket!==generation) return;
      status('Could not read '+file.name+'. '+(error.message||'Try exporting a sliced 3MF or standard G-code.'));
      window.__ppFileData={fileName:file.name,fileSize:file.size,readError:true,warnings:[error.message||'File could not be read.']};
      window.__ppRefreshModelHub?.();renderDetails(window.__ppFileData);
      window.__printProfitPersistDraft?.();
    }
  }
  window.__ppInspectSlicerFile=inspect;
  window.__ppApplyFileData=()=>apply(window.__ppFileData);
  function card(label,value){const el=document.createElement('div');el.append(text('span',label),text('strong',available(value)?value:'Not stored'));return el;}
  function time(seconds){if(!Number.isFinite(seconds)) return null;const h=Math.floor(seconds/3600),m=Math.floor(seconds%3600/60);return (h?h+'h ':'')+m+'m '+Math.round(seconds%60)+'s';}
  function style(){
    if($('ppSlicerDetailsStyle')) return;
    const el=document.createElement('style');el.id='ppSlicerDetailsStyle';el.textContent=`
      .pp-model-extra.pp-slicer-expanded>.pp-model-extra-grid,.pp-model-extra.pp-slicer-expanded>.pp-model-extra-title{display:none}
      .pp-slicer-details{color:var(--text);min-width:0}.pp-slicer-overview{display:grid;grid-template-columns:minmax(220px,.8fr) minmax(0,1.8fr);gap:14px;align-items:start;margin-bottom:16px}
      .pp-slicer-preview{margin:0;padding:14px;background:var(--panel2);border:1px solid var(--line);border-radius:12px;text-align:center;min-width:0}
      .pp-slicer-preview img{display:block;width:100%;height:230px;object-fit:contain;border-radius:8px;margin:0 auto 12px;background:linear-gradient(135deg,#ffffff08,#00000015)}
      .pp-slicer-preview figcaption{font-size:12px;color:var(--muted);line-height:1.6}.pp-slicer-preview a{display:inline-block;color:var(--accent);padding:7px 0;font-size:12px;font-weight:700}
      .pp-slicer-empty-preview{min-height:180px;display:grid;place-content:center;gap:8px;padding:12px;font-size:12px;line-height:1.6;color:var(--muted)}.pp-slicer-empty-preview b{font-size:16px;color:var(--text)}
      .pp-slicer-summary h3,.pp-slicer-group h3{font-size:13px;color:var(--accent);margin:0 0 10px}.pp-slicer-summary p{font-size:12px;color:var(--muted);line-height:1.6;margin:10px 0}
      .pp-slicer-summary label{display:block;font-size:12px;font-weight:700;margin:0 0 6px}.pp-slicer-summary select{width:100%;margin-bottom:12px;background:var(--panel2);color:var(--text);border:1px solid var(--line);border-radius:8px;padding:10px}
      .pp-slicer-cards{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px}.pp-slicer-cards>div{border:1px solid var(--line);background:var(--panel2);padding:11px;border-radius:9px;min-width:0}
      .pp-slicer-cards span{display:block;font-size:11px;color:var(--muted);margin-bottom:6px}.pp-slicer-cards strong{display:block;font-size:13px;line-height:1.5;overflow-wrap:anywhere;white-space:normal}
      .pp-slicer-group{margin:0 0 14px}.pp-slicer-note{font-size:12px;line-height:1.6;color:var(--muted);padding:10px;border-left:3px solid var(--accent);background:var(--panel2);border-radius:0 8px 8px 0;margin:10px 0}
      .pp-slicer-materials{display:grid;grid-template-columns:repeat(auto-fit,minmax(190px,1fr));gap:8px;margin-bottom:12px}.pp-slicer-material{padding:12px;border:1px solid var(--line);background:var(--panel2);border-radius:9px;font-size:12px;line-height:1.8}
      .pp-slicer-material .pp-material-swatch{display:inline-block;width:14px;height:14px;vertical-align:middle;border:1px solid var(--line);border-radius:50%;margin-right:8px}
      .pp-slicer-settings{border:1px solid var(--line);background:var(--panel2);border-radius:10px;padding:12px}.pp-slicer-settings summary{cursor:pointer;color:var(--accent);font-size:13px;font-weight:700}
      .pp-slicer-settings dl{max-height:380px;overflow:auto;margin:12px 0 0;font-size:12px}.pp-slicer-settings dl>div{display:grid;grid-template-columns:minmax(140px,1fr) minmax(0,2fr);gap:12px;padding:9px 0;border-bottom:1px solid var(--line)}
      .pp-slicer-settings dt{color:var(--muted);overflow-wrap:anywhere}.pp-slicer-settings dd{margin:0;white-space:pre-wrap;overflow-wrap:anywhere}
      @media(max-width:850px){.pp-slicer-overview{grid-template-columns:1fr}.pp-slicer-preview img{height:210px}.pp-slicer-cards{grid-template-columns:repeat(2,minmax(0,1fr))}}
      @media(max-width:480px){.pp-slicer-cards{grid-template-columns:1fr}.pp-slicer-settings dl>div{grid-template-columns:1fr;gap:4px}}
    `;document.head.appendChild(el);
  }
  function renderDetails(data={}){
    const host=document.querySelector('.pp-model-extra');if(!host) return;
    if(renderedData===data&&renderedImages===images&&host.querySelector('.pp-slicer-details')) return;
    renderedData=data;renderedImages=images;style();host.classList.add('pp-slicer-expanded');
    let root=host.querySelector('.pp-slicer-details');if(!root){root=document.createElement('div');root.className='pp-slicer-details';host.prepend(root);}root.replaceChildren();
    if(!data.fileName){root.append(text('p','Upload a sliced file to see its preview and available print details.','pp-slicer-note'));return;}
    const overview=document.createElement('div');overview.className='pp-slicer-overview';
    const figure=document.createElement('figure');figure.className='pp-slicer-preview';
    // Previews are not saved as URLs in drafts: the original file is kept locally and re-read on restoration.
    const related=result?.fileName===data.fileName?images.filter(i=>i.plate===null||i.plate===data.selectedPlate):[];
    const image=related.find(i=>i.plate===data.selectedPlate)||related[0];
    if(image){
      const img=document.createElement('img');img.src=image.url;img.alt=(image.generated?'Model preview for ':'Embedded slicer preview for ')+data.fileName;img.decoding='async';
      img.addEventListener('error',()=>{figure.replaceChildren(text('p','This embedded preview could not be displayed.','pp-slicer-empty-preview'));},{once:true});
      figure.append(img,text('figcaption',image.label+(image.generated?'':' · Image saved by your slicer')));
      const link=document.createElement('a');link.href=image.url;link.download=data.fileName.replace(/\.[^.]+$/,'')+'-preview.'+(image.extension||'png');link.textContent='Save preview image';figure.append(link);
    }else {
      const empty=document.createElement('div');empty.className='pp-slicer-empty-preview';empty.append(text('b','No preview available'),text('span','If your slicer includes a preview image, it will appear here. A missing preview does not prevent reading the print details.'));figure.append(empty);
    }
    const summary=document.createElement('div');summary.className='pp-slicer-summary';summary.append(text('h3',data.format==='STL model'?'Your model':'Your print file'));
    if(data.plateCount>1){
      const label=text('label','Choose the plate to calculate');label.htmlFor='ppSlicerPlate';
      const select=document.createElement('select');select.id='ppSlicerPlate';
      for(const p of data.plateOptions||[]){const o=text('option',p.name);o.value=String(p.id);select.append(o);}select.value=String(data.selectedPlate);
      select.disabled=!result||result.fileName!==data.fileName;
      select.addEventListener('change',()=>selectPlate(select.value));summary.append(label,select);
    }
    const cards=document.createElement('div');cards.className='pp-slicer-cards';
    cards.append(card('Estimated print time',time(data.seconds)),card('Material used',Number.isFinite(data.grams)?data.grams.toFixed(2)+' g':null),card('Slicer',data.slicer),card('Printer',data.printer),card('Layer count',data.layerCount),card('Objects on selected plate',data.objectCount),card('File type',data.format),card('File size',Number.isFinite(data.fileSize)?(data.fileSize/1024/1024).toFixed(2)+' MB':null));
    summary.append(cards);
    if(data.objectNames?.length) summary.append(text('p','Objects: '+data.objectNames.join(', ')));
    if(data.massSource) summary.append(text('p','Material weight: '+data.massSource));
    summary.append(text('p','Figures come from the selected plate’s saved slicer data. Actual print time and material usage can differ.'));
    overview.append(figure,summary);root.append(overview);
    if(data.materials?.length){
      root.append(text('h3','Saved material information'));const list=document.createElement('div');list.className='pp-slicer-materials';
      for(const m of data.materials){
        const el=document.createElement('div');el.className='pp-slicer-material';
        if(/^#?[a-f0-9]{6}(?:[a-f0-9]{2})?$/i.test(m.colour||'')){const swatch=document.createElement('span');swatch.className='pp-material-swatch';swatch.style.backgroundColor=(m.colour.startsWith('#')?'':'#')+m.colour;el.append(swatch);}
        el.append(text('b',[m.label,m.vendor,m.type].filter(Boolean).join(' · ')));
        if(m.colour) el.append(text('div','Colour: '+m.colour));
        if(Number.isFinite(m.grams)) el.append(text('div','Usage: '+m.grams.toFixed(2)+' g'));
        if(Number.isFinite(m.lengthMm)) el.append(text('div','Length: '+(m.lengthMm/1000).toFixed(2)+' m'));
        list.append(el);
      }
      root.append(list);
      if(data.materials.length>1) root.append(text('p','This file uses several materials. Enter a weighted average material price in Print Setup, including any purge waste recorded by your slicer.','pp-slicer-note'));
    }
    const groups=new Map();
    for(const detail of data.details||[]){if(!available(detail.value)) continue;if(!groups.has(detail.group)) groups.set(detail.group,[]);groups.get(detail.group).push(detail);}
    if(Number.isFinite(data.filamentLength)) {if(!groups.has('Material')) groups.set('Material',[]);groups.get('Material').push({label:'Filament length',value:(data.filamentLength/1000).toFixed(2)+' m'});}
    if(Number.isFinite(data.filamentVolume)) {if(!groups.has('Material')) groups.set('Material',[]);groups.get('Material').push({label:'Filament volume',value:data.filamentVolume.toFixed(2)+' cm³'});}
    for(const [name,details] of groups){const group=document.createElement('section');group.className='pp-slicer-group';group.append(text('h3',name));const grid=document.createElement('div');grid.className='pp-slicer-cards';for(const d of details) grid.append(card(d.label,d.value));group.append(grid);root.append(group);}
    for(const warning of data.warnings||[]) root.append(text('p',warning,'pp-slicer-note'));
    if(data.settings?.length){
      const details=document.createElement('details');details.className='pp-slicer-settings';details.append(text('summary','All saved slicer settings ('+data.settings.length+')'));
      const dl=document.createElement('dl');for(const s of data.settings){const row=document.createElement('div');row.append(text('dt',s.key.replace(/_/g,' ')),text('dd',s.value));dl.append(row);}details.append(dl);root.append(details);
    }
    const hint=$('ppModelHint');if(hint) hint.textContent='Only information stored in your file is shown. Electricity, purchase prices, labour, postage and selling fees use your calculator settings.';
  }
  window.__ppRenderFileDetails=renderDetails;
  function install(){
    const input=$('file');if(!input) return false;if(input.dataset.ppSmartBound) return true;input.dataset.ppSmartBound='1';input.accept='.'+supported.join(',.');
    const drop=input.closest('.drop')||document.querySelector('.drop');
    const label=drop?.querySelector('b');if(label) label.textContent='Upload your sliced print file';
    input.addEventListener('change',event=>{const file=input.files?.[0];if(!file) return;event.stopImmediatePropagation();inspect(file);},true);
    if(drop){
      drop.addEventListener('drop',event=>{event.preventDefault();event.stopImmediatePropagation();drop.classList.remove('pp-drop-active');const file=event.dataTransfer?.files?.[0];if(!file) return;try{const dt=new DataTransfer();dt.items.add(file);input.files=dt.files;}catch{}inspect(file);},true);
      for(const name of ['dragenter','dragover']) drop.addEventListener(name,event=>{event.preventDefault();drop.classList.add('pp-drop-active');});
      drop.addEventListener('dragleave',()=>drop.classList.remove('pp-drop-active'));
    }
    document.addEventListener('click',event=>{const button=event.target?.closest?.('#clear,#reset,#ppGlobalReset');if(!button) return;clearFile();if(button.id==='clear'){setValue('materialUsed','');setValue('printHours','');status('No sliced file selected.');$('calc')?.click();window.__printProfitPersistDraft?.();}},true);
    return true;
  }
  const started=Date.now(),timer=setInterval(()=>{if(install()||Date.now()-started>15000) clearInterval(timer);},50);
})();
