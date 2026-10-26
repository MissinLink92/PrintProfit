(()=>{
'use strict';
if(window.__ppLabourTimeInput)return;window.__ppLabourTimeInput=true;
const source=document.getElementById('labourHours');if(!source)return;
const container=source.parentElement;
const title=container.querySelector('label');if(title)title.textContent='Labour time (per product)';
const rateContainer=document.getElementById('labourRate')?.parentElement;
if(rateContainer)rateContainer.classList.add('pp-labour-rate');
source.type='hidden';source.setAttribute('aria-hidden','true');
const group=document.createElement('div');group.className='pp-labour-time';group.setAttribute('role','group');group.setAttribute('aria-label','Labour time per product');
function field(text,aria,max){
 const label=document.createElement('label');label.textContent=text;
 const input=document.createElement('input');input.type='number';input.inputMode='numeric';input.min='0';input.step='1';input.value='0';if(max!==undefined)input.max=String(max);input.setAttribute('aria-label',aria);
 // Only labourHours is persisted. Saving display fields as well can overwrite
 // the restored decimal value when project change events run in sequence.
 label.appendChild(input);group.appendChild(label);return input;
}
const hours=field('Hours','Labour hours'),minutes=field('Minutes','Labour minutes',59);
container.appendChild(group);
let editing=false;
function sync(){
 if(editing)return;
 const value=Math.max(0,Number(source.value)||0),total=Math.round(value*60);
 hours.value=String(Math.floor(total/60));minutes.value=String(total%60);
}
function update(){
 const h=Math.max(0,Math.floor(Number(hours.value)||0)),m=Math.max(0,Math.min(59,Math.floor(Number(minutes.value)||0)));
 hours.value=String(h);minutes.value=String(m);
 source.value=String(h+m/60);editing=true;
 try{source.dispatchEvent(new Event('input',{bubbles:true}));}finally{editing=false;}
}
for(const input of [hours,minutes]){input.addEventListener('input',update);input.addEventListener('change',update);}
source.addEventListener('input',sync);source.addEventListener('change',sync);sync();
const style=document.createElement('style');style.textContent='.pp-labour-time{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:9px}.pp-labour-time label{min-width:0;display:block}.pp-labour-time input{display:block;width:100%;box-sizing:border-box;margin-top:8px}.pp-labour-rate{align-self:end}';document.head.appendChild(style);
})();
