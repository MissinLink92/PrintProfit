(()=>{
  'use strict';
  if(window.__printProfitDragGcodeFixInstalled)return;
  window.__printProfitDragGcodeFixInstalled=true;

  const $=id=>document.getElementById(id);
  const setValue=(id,value)=>{
    const el=$(id);
    if(!el)return;
    el.value=String(value);
    el.dispatchEvent(new Event('input',{bubbles:true}));
    el.dispatchEvent(new Event('change',{bubbles:true}));
  };

  function timeToHours(text){
    if(!text)return null;
    let m=text.match(/(?:^|[;\s])(?:TIME|PRINT_TIME|PRINTING_TIME)\s*[:=]\s*(\d+(?:\.\d+)?)\s*$/im);
    if(m)return Number(m[1])/3600;
    m=text.match(/(?:estimated printing time|printing time|print time)[^\n]*?=\s*(?:(\d+)h\s*)?(?:(\d+)m\s*)?(?:(\d+)s)?/i);
    if(m){
      const h=Number(m[1]||0),min=Number(m[2]||0),s=Number(m[3]||0);
      if(h||min||s)return h+min/60+s/3600;
    }
    m=text.match(/(?:estimated printing time|printing time|print time)[^\n]*?(\d+)\s*h\s*(?:(\d+)\s*m)?\s*(?:(\d+)\s*s)?/i);
    if(m)return Number(m[1]||0)+Number(m[2]||0)/60+Number(m[3]||0)/3600;
    return null;
  }

  function filamentInfo(text){
    let grams=null,mm=null,meters=null;
    let m=text.match(/(?:filament used|filament_usage)[^\n]*?\[g\][^\n]*?=\s*([0-9.]+)/i);
    if(!m)m=text.match(/(?:filament used|filament_usage)[^\n]*?=\s*([0-9.]+)\s*g\b/i);
    if(m)grams=Number(m[1]);
    m=text.match(/(?:filament used|filament_usage)[^\n]*?\[mm\][^\n]*?=\s*([0-9.]+)/i);
    if(!m)m=text.match(/(?:filament used|filament_usage)[^\n]*?=\s*([0-9.]+)\s*mm\b/i);
    if(m)mm=Number(m[1]);
    m=text.match(/(?:filament used|filament_usage)[^\n]*?=\s*([0-9.]+)\s*m\b/i);
    if(m)meters=Number(m[1]);
    if(grams==null && mm==null && meters==null){
      m=text.match(/(?:filament used|filament_usage)[^\n]*?=\s*([0-9.]+)\s*m\b/i);
      if(m)meters=Number(m[1]);
    }
    return {grams,mm,meters};
  }

  function estimateGrams(info){
    if(info.grams!=null)return info.grams;
    const material=(($('material')?.value)||($('materialType')?.value)||'PLA').toUpperCase();
    const density=/PETG/.test(material)?1.27:/ABS|ASA/.test(material)?1.04:/TPU|TPE/.test(material)?1.21:/NYLON|PA/.test(material)?1.14:1.24;
    const diameter=1.75;
    const lengthMm=info.mm!=null?info.mm:(info.meters!=null?info.meters*1000:null);
    if(lengthMm==null)return null;
    const volumeCm3=Math.PI*Math.pow(diameter/2,2)*lengthMm/1000;
    return volumeCm3*density;
  }

  async function processFile(file){
    const status=$('status');
    if(!file)return;
    if(status)status.textContent='Reading '+file.name+'…';
    try{
      const text=await file.text();
      const hours=timeToHours(text);
      const filament=filamentInfo(text);
      const grams=estimateGrams(filament);
      if(hours!=null)setValue('printHours',Math.max(0,hours));
      if(grams!=null)setValue('materialUsed',Math.max(0,grams));
      if(status){
        const parts=[];
        if(hours!=null)parts.push((hours*60).toFixed(0)+' min');
        if(grams!=null)parts.push(grams.toFixed(2)+' g');
        status.textContent=parts.length?'✓ '+file.name+' — auto-filled '+parts.join(' • '):'✓ '+file.name+' loaded, but no printable time/material metadata was found.';
      }
      const calc=$('calc');
      if(calc)calc.click();
    }catch(err){
      console.error('PrintProfit G-code read error:',err);
      if(status)status.textContent='Could not read that file. Try a standard G-code file exported by your slicer.';
    }
  }

  function install(){
    const input=$('file');
    const drop=input?.closest('.drop')||document.querySelector('.drop');
    if(!input||!drop)return false;

    input.addEventListener('change',()=>processFile(input.files&&input.files[0]));
    ['dragenter','dragover'].forEach(type=>drop.addEventListener(type,event=>{
      event.preventDefault();event.stopPropagation();drop.classList.add('pp-drop-active');
    }));
    ['dragleave','drop'].forEach(type=>drop.addEventListener(type,event=>{
      event.preventDefault();event.stopPropagation();drop.classList.remove('pp-drop-active');
    }));
    drop.addEventListener('drop',event=>{
      const file=event.dataTransfer?.files?.[0];
      if(!file)return;
      try{
        const dt=new DataTransfer();dt.items.add(file);input.files=dt.files;
      }catch(_){/* Some browsers make input.files read-only; parsing still works. */}
      processFile(file);
    });

    const style=document.createElement('style');
    style.textContent='.drop.pp-drop-active{border-color:#0798ff!important;background:#0798ff0d!important;box-shadow:0 0 0 2px #0798ff22,0 0 24px #0798ff18!important}';
    document.head.appendChild(style);
    return true;
  }

  const start=Date.now();
  const timer=setInterval(()=>{if(install()||Date.now()-start>15000)clearInterval(timer)},50);
})();
