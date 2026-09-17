(()=>{
'use strict';
if(window.__printProfitFileTypeSupport)return;window.__printProfitFileTypeSupport=true;
const $=id=>document.getElementById(id);
const names={
 gcode:'G-code',gco:'G-code',bgcode:'Binary G-code',nc:'NC G-code',ngc:'NGC G-code',gc:'G-code',g:'G-code',
 '3mf':'3MF slicer project',lys:'Lychee project',chitubox:'CHITUBOX project',ctb:'CTB resin slice',photon:'Photon slice',pwma:'Photon Mono slice',pwmo:'Photon Mono project',pws:'Photon Workshop slice',goo:'Goo slice',sl1:'SL1 resin slice',sl1s:'SL1S resin slice',
 stl:'STL model',obj:'OBJ model',amf:'AMF model',ply:'PLY model',step:'STEP model',stp:'STEP model'
};
const supported=Object.keys(names);
function ext(name){const m=String(name||'').toLowerCase().match(/\.([a-z0-9]+)$/);return m?m[1]:'';}
function status(text){const el=$('status');if(el){el.textContent=text;el.dataset.fileType='recognised';}}
function install(){
 const input=$('file');if(!input)return false;
 input.accept='.'+supported.join(',.');
 if(input.dataset.ppTypeBound)return true;input.dataset.ppTypeBound='1';
 input.addEventListener('change',()=>inspect(input.files?.[0]));
 const drop=input.closest('.drop')||document.querySelector('.drop');
 if(drop){
  ['dragenter','dragover'].forEach(t=>drop.addEventListener(t,e=>{e.preventDefault();drop.classList.add('pp-drop-active');}));
  ['dragleave','drop'].forEach(t=>drop.addEventListener(t,e=>{e.preventDefault();drop.classList.remove('pp-drop-active');}));
  drop.addEventListener('drop',e=>{const f=e.dataTransfer?.files?.[0];if(f)inspect(f);});
 }
 return true;
}
function inspect(file){
 if(!file)return;const e=ext(file.name);
 if(e==='3mf')status('✓ 3MF slicer project recognised — this can be from OrcaSlicer, Bambu Studio, PrusaSlicer, SuperSlicer or other 3MF-compatible slicers. If it has not been sliced, export G-code for exact time/material usage.');
 else if(e==='bgcode')status('✓ Binary G-code recognised — sliced file detected.');
 else if(['gcode','gco','nc','ngc','gc','g'].includes(e))status('✓ '+names[e]+' recognised — reading print metadata…');
 else if(['stl','obj','amf','ply','step','stp'].includes(e))status('✓ '+names[e]+' recognised — this is a model file, not sliced output.');
 else if(names[e])status('✓ '+names[e]+' recognised — exact time/material extraction may require the slicer\'s G-code output.');
 else status('⚠ File type not recognised.');
}
const start=Date.now(),timer=setInterval(()=>{if(install()||Date.now()-start>15000)clearInterval(timer)},50);
})();