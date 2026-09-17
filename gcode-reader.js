(()=>{
'use strict';
if(window.__printProfitGcodeReaderInstalled)return;
window.__printProfitGcodeReaderInstalled=true;

const GCODE_EXT=new Set(['gcode','gco','nc','ngc','gc','g']);
const $=id=>document.getElementById(id);
const ext=name=>(String(name||'').toLowerCase().match(/\.([a-z0-9]+)$/)||[])[1]||'';
const num=v=>{const n=parseFloat(String(v??'').replace(/,/g,''));return Number.isFinite(n)?n:null;};
const clean=v=>String(v??'').replace(/\s+/g,' ').trim();

function fire(el,value){
  if(!el||value==null||!Number.isFinite(Number(value)))return false;
  el.value=String(value);
  el.dispatchEvent(new Event('input',{bubbles:true}));
  el.dispatchEvent(new Event('change',{bubbles:true}));
  return true;
}
function fieldBySemantic(words){
  const wanted=words.map(x=>x.toLowerCase());
  const els=[...document.querySelectorAll('input:not([type="file"]):not([type="checkbox"]):not([type="radio"]),textarea')];
  let best=null,bestScore=0;
  for(const el of els){
    let hay=(el.id+' '+el.name+' '+el.placeholder+' '+el.getAttribute('aria-label')).toLowerCase();
    const lab=el.id?document.querySelector('label[for="'+CSS.escape(el.id)+'"]'):null;
    if(lab)hay+=' '+lab.textContent.toLowerCase();
    const wrap=el.closest('label'); if(wrap)hay+=' '+wrap.textContent.toLowerCase();
    hay+=' '+(el.previousElementSibling?.textContent||'').toLowerCase();
    const score=wanted.reduce((s,w)=>s+(hay.includes(w)?1:0),0);
    if(score>bestScore){bestScore=score;best=el;}
  }
  return bestScore?best:null;
}
function setMetric(id,words,value,decimals=2){
  if(value==null||!Number.isFinite(Number(value)))return false;
  const exact=$(id);
  if(fire(exact,Number(value).toFixed(decimals)))return true;
  const fallback=fieldBySemantic(words);
  return fire(fallback,Number(value).toFixed(decimals));
}

function parseDuration(value){
  const s=clean(value).toLowerCase();
  if(!s)return null;
  if(/^\d+(?:\.\d+)?$/.test(s))return Number(s);
  let total=0,found=false,m;
  const parts=[
    {re:/(\d+(?:\.\d+)?)\s*(?:d|day|days)\b/g,mul:86400},
    {re:/(\d+(?:\.\d+)?)\s*(?:h|hr|hrs|hour|hours)\b/g,mul:3600},
    {re:/(\d+(?:\.\d+)?)\s*(?:m|min|mins|minute|minutes)\b/g,mul:60},
    {re:/(\d+(?:\.\d+)?)\s*(?:s|sec|secs|second|seconds)\b/g,mul:1}
  ];
  for(const p of parts){while((m=p.re.exec(s))){total+=Number(m[1])*p.mul;found=true;}}
  if(found)return total;
  if(/^\d+:\d{1,2}(?::\d{1,2}(?:\.\d+)?)?$/.test(s)){
    const a=s.split(':').map(Number);
    return a.length===3?a[0]*3600+a[1]*60+a[2]:a[0]*60+a[1];
  }
  return null;
}

function readTime(text){
  const patterns=[
    /(?:^|\n)\s*;?\s*(?:TIME|PRINT_TIME|PRINTING_TIME)\s*[:=]\s*([0-9.]+)\s*(?:s|sec|seconds)?\s*(?:\n|$)/im,
    /(?:total\s+)?estimated\s+(?:printing|print)\s+time(?:\s*\([^)]*\))?\s*[:=]\s*([^;\r\n]+)/i,
    /estimated\s+printing\s+time[^\r\n]*?[:=]\s*([^;\r\n]+)/i,
    /(?:^|\n)\s*;?\s*(?:print(?:ing)?\s*time)\s*[:=]\s*([^;\r\n]+)/im
  ];
  for(const re of patterns){const m=text.match(re);if(m){const v=parseDuration(m[1]);if(v!=null)return v;}}
  return null;
}

function readFilament(text){
  const out={grams:null,mm:null,cm3:null,meters:null};
  const grams=[
    /(?:total\s+)?filament\s+used\s*\[g\]\s*[:=]\s*([0-9.]+)/i,
    /filament[_ ](?:used|usage|weight)[^\r\n]*?[:=]\s*([0-9.]+)\s*g\b/i,
    /(?:filament\s+weight|filament\s+usage)\s*[:=]\s*([0-9.]+)\s*g\b/i
  ];
  for(const re of grams){const m=text.match(re);if(m){out.grams=num(m[1]);break;}}
  const mm=[
    /(?:total\s+)?filament\s+used\s*\[mm\]\s*[:=]\s*([0-9.]+)/i,
    /filament[_ ](?:used|usage|length)[^\r\n]*?[:=]\s*([0-9.]+)\s*mm\b/i
  ];
  for(const re of mm){const m=text.match(re);if(m){out.mm=num(m[1]);break;}}
  const cm3=[
    /(?:total\s+)?filament\s+used\s*\[cm3\]\s*[:=]\s*([0-9.]+)/i,
    /filament[_ ](?:used|usage|volume)[^\r\n]*?[:=]\s*([0-9.]+)\s*cm3\b/i
  ];
  for(const re of cm3){const m=text.match(re);if(m){out.cm3=num(m[1]);break;}}
  const meters=[
    /filament\s+used\s*[:=]\s*([0-9.]+)\s*m\b/i,
    /filament[_ ](?:used|usage|length)[^\r\n]*?[:=]\s*([0-9.]+)\s*m\b/i
  ];
  for(const re of meters){const m=text.match(re);if(m){out.meters=num(m[1]);break;}}
  return out;
}

function readPhysical(text){
  const densityPatterns=[/filament[_ ]density\s*[:=]\s*([0-9.]+)/i,/material[_ ]density\s*[:=]\s*([0-9.]+)/i,/density\s*[:=]\s*([0-9.]+)\s*g?\/cm3/i];
  const diameterPatterns=[/filament[_ ]diameter\s*[:=]\s*([0-9.]+)/i,/filament\s+diameter\s*[:=]\s*([0-9.]+)\s*mm/i];
  let density=1.24,diameter=1.75,m;
  for(const re of densityPatterns){m=text.match(re);if(m&&num(m[1])>0){density=num(m[1]);break;}}
  for(const re of diameterPatterns){m=text.match(re);if(m&&num(m[1])>0){diameter=num(m[1]);break;}}
  const existingDensity=num($('materialDensity')?.value)||null;
  const existingDiameter=num(fieldBySemantic(['filament diameter','diameter'])?.value)||null;
  return {density:existingDensity||density,diameter:existingDiameter||diameter};
}

function gramsFromLength(mm,phys){
  if(mm==null||!Number.isFinite(mm))return null;
  const area=Math.PI*Math.pow(phys.diameter/2,2);
  return (mm/1000)*area*phys.density;
}
function gramsFromVolume(cm3,phys){return cm3==null?null:cm3*phys.density;}

function importGcode(file){
  const status=$('status');
  if(status)status.textContent='Reading '+file.name+' for print time and filament usage…';
  file.text().then(text=>{
    const seconds=readTime(text);
    const raw=readFilament(text);
    const phys=readPhysical(text);
    let grams=raw.grams;
    let source='G-code metadata';
    if(grams==null&&raw.cm3!=null){grams=gramsFromVolume(raw.cm3,phys);source='G-code volume + material density';}
    if(grams==null&&raw.mm!=null){grams=gramsFromLength(raw.mm,phys);source='G-code length + filament diameter/density';}
    if(grams==null&&raw.meters!=null){grams=gramsFromLength(raw.meters*1000,phys);source='G-code length + filament diameter/density';}

    const gotTime=setMetric('printHours',['print time','printing time','print hours','estimated time'],seconds!=null?seconds/3600:null,2);
    const gotGrams=setMetric('materialUsed',['used per print','used filament','filament used','material used','filament usage','usage'],grams,2);

    if(status){
      const found=[];
      if(gotTime&&seconds!=null)found.push(formatDuration(seconds));
      if(gotGrams&&grams!=null)found.push(grams.toFixed(2)+' g');
      if(found.length){
        status.textContent='✓ '+file.name+' — auto-filled '+found.join(' • ')+(source!=='G-code metadata'?' • '+source:'');
      }else{
        const missing=[];if(!gotGrams)missing.push('filament usage');if(!gotTime)missing.push('print time');
        status.textContent='✓ '+file.name+' loaded — no readable '+missing.join(' or ')+' metadata found.';
      }
    }
    const calc=$('calc');if(calc)calc.click();
  }).catch(err=>{
    console.error('PrintProfit G-code reader error:',err);
    if(status)status.textContent='Could not read '+file.name+'. Please use a standard sliced G-code file.';
  });
}

function formatDuration(sec){
  sec=Math.max(0,Math.round(Number(sec)||0));
  const h=Math.floor(sec/3600),m=Math.floor((sec%3600)/60),s=sec%60;
  return h?`${h}h ${m}m`:m?`${m}m ${s}s`:`${s}s`;
}

function preventLegacy(event,file){
  if(!file||!GCODE_EXT.has(ext(file.name)))return false;
  event.preventDefault();event.stopImmediatePropagation();
  const input=$('file');
  try{const dt=new DataTransfer();dt.items.add(file);input.files=dt.files;}catch(_){ }
  importGcode(file);
  return true;
}

function install(){
  const input=$('file');
  const drop=input?.closest('.drop')||document.querySelector('.drop');
  if(!input||!drop)return false;
  if(input.dataset.ppUnifiedGcode)return true;
  input.dataset.ppUnifiedGcode='1';
  input.addEventListener('change',e=>{const f=input.files?.[0];if(f&&GCODE_EXT.has(ext(f.name))){e.stopImmediatePropagation();importGcode(f);}},true);
  drop.addEventListener('drop',e=>{const f=e.dataTransfer?.files?.[0];if(f)preventLegacy(e,f);},true);
  ['dragenter','dragover'].forEach(t=>drop.addEventListener(t,e=>{e.preventDefault();drop.classList.add('pp-drop-active');},true));
  ['dragleave','drop'].forEach(t=>drop.addEventListener(t,e=>{e.preventDefault();drop.classList.remove('pp-drop-active');},true));
  return true;
}

const start=Date.now(),timer=setInterval(()=>{if(install()||Date.now()-start>15000)clearInterval(timer)},50);
})();
