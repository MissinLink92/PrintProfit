(()=>{ 
'use strict';
if(window.__printProfitMaterialBrands)return;
window.__printProfitMaterialBrands=true;
function install(){
 const material=document.getElementById('material');
 if(!material||document.getElementById('materialBrand'))return !!material;
 const wrap=material.parentElement;
 if(!wrap)return false;
 const brandBox=document.createElement('div');
 brandBox.id='ppMaterialBrandBox';
 brandBox.style.cssText='margin-top:9px';
 brandBox.innerHTML='<label for="materialBrand">Brand</label><select id="materialBrand"><option value="">Generic / Other</option><optgroup label="Popular Filament Brands"><option>Bambu Lab</option><option>eSUN</option><option>SUNLU</option><option>Polymaker</option><option>Overture</option><option>Creality</option><option>Prusament</option><option>ELEGOO</option><option>Anycubic</option><option>HATCHBOX</option><option>JAYO</option><option>ERYONE</option><option>Geeetech</option><option>Fiberlogy</option><option>MatterHackers</option></optgroup><optgroup label="Resin Brands"><option>ELEGOO</option><option>Anycubic</option><option>Phrozen</option><option>Siraya Tech</option><option>Elegoo</option><option>eSUN</option><option>SUNLU</option><option>Creality</option><option>Any other / Custom</option></optgroup></select>';
 wrap.parentElement.insertBefore(brandBox,wrap);
 const style=document.createElement('style');style.id='ppMaterialBrandStyles';style.textContent='#ppMaterialBrandBox label{display:block;color:var(--muted);font-size:10.5px;margin-bottom:4px}#ppMaterialBrandBox select{width:100%;background:var(--panel2);color:var(--text);border:1px solid var(--line);border-radius:7px;padding:7px 8px;font-size:13px;outline:0}#ppMaterialBrandBox select:focus{border-color:var(--accent)}';
 document.head.appendChild(style);
 return true;
}
function boot(){if(install())return;const started=Date.now(),timer=setInterval(()=>{if(install()||Date.now()-started>15000)clearInterval(timer)},50)}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();