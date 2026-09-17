(()=>{
'use strict';
if(window.__printProfitElectricityProviders)return;window.__printProfitElectricityProviders=true;

const providers=[
  ['British Gas','British Gas Trading Ltd'],
  ['E.ON Next','E.ON Next Energy Ltd'],
  ['EDF Energy','EDF Energy Customers Ltd'],
  ['Octopus Energy','Octopus Energy Ltd'],
  ['OVO Energy','OVO Energy Ltd'],
  ['ScottishPower','Scottish Power Energy Retail Ltd'],
  ['SSE','SSE / Scottish & Southern Energy'],
  ['Utilita Energy','Utilita Energy Ltd'],
  ['Ecotricity','Ecotricity Ltd'],
  ['Good Energy','Good Energy Ltd'],
  ['So Energy','So Energy Trading Ltd'],
  ['Utility Warehouse','Electricity Plus Supply Ltd'],
  ['E (Gas & Electricity)','E (Gas and Electricity) Ltd'],
  ['Fuse Energy','Fuse Energy Supply Ltd'],
  ['Foxglove Energy','Foxglove Energy Supply Ltd'],
  ['Green Energy UK','Green Energy (UK) Ltd'],
  ['Drax','Drax Energy Solutions Ltd'],
  ['Valda Energy','Valda Energy Ltd'],
  ['Voltx Power','Voltx Power Ltd'],
  ['Tru Energy','Tru Energy Ltd'],
  ['Square1 Energy','Square1 Energy Ltd'],
  ['Arto.Energy','Arto.Energy Ltd'],
  ['Brook Green','Brook Green Trading Ltd'],
  ['Bryt Energy','Bryt Energy Ltd'],
  ['Co-op Energy','Co-operative Energy Ltd'],
  ['Evolve Energy','Evolve Energy Supply Ltd'],
  ['Home Energy Trading','Home Energy Trading Ltd'],
  ['Highland Electricity','Highland Electricity Ltd'],
  ['Jellyfish Energy','Jellyfish Energy Ltd'],
  ['Planet 9 Energy','Planet 9 Energy Ltd'],
  ['Pozitive Energy','Pozitive Energy Ltd'],
  ['Shell Energy','Shell Energy UK Ltd'],
  ['SINQ Power','SINQ Power Ltd'],
  ['Toucan Energy','Toucan Energy Ltd'],
  ['Unify Energy','Unify Energy Ltd'],
  ['YU Energy','YU Energy Retail Ltd'],
  ['D-ENERGI','D-Energi Trading Ltd'],
  ['DGP Energy','DGP Energy Ltd'],
  ['Digital Power','Digital Power Energy Supply UK Ltd'],
  ['Eneco','Eneco Energy Trade BV'],
  ['ENGIE','Engie Power Ltd'],
  ['Electroroute','Electroroute Energy Ltd'],
  ['AXPO UK','AXPO UK Ltd'],
  ['Corona Energy','Corona Energy Retail 4 Ltd'],
  ['Hartree Partners','Hartree Partners Supply (UK) Ltd'],
  ['Marble Power','Marble Power Ltd'],
  ['Maxen Power','Maxen Power Supply Ltd'],
  ['MVV Environment','MVV Environment Services Ltd'],
  ['NEAS Energy','NEAS Energy Ltd'],
  ['Opus Energy','Opus Energy Ltd'],
  ['SQE Energy','SQE Energy Ltd'],
  ['Tesla Energy','Tesla Energy Ventures Ltd'],
  ['United Gas & Power','United Gas & Power Trading Ltd'],
  ['Constellation Generation','Constellation Generation Ltd'],
  ['Alfred Electricity & Gas','Alfred Electricity & Gas Ltd'],
  ['Custom / Other','']
];

function addStyle(){
 const s=document.createElement('style');
 s.id='ppElectricityProviderStyles';
 s.textContent=`
 #electricityProvider{width:100%!important;background:#0d161d!important;color:var(--text)!important;border:1px solid var(--line)!important;border-radius:7px!important;padding:7px 8px!important;outline:0!important;font-size:13px!important}
 #electricityProvider:focus{border-color:var(--accent)!important;box-shadow:0 0 0 2px #ff780014!important}
 `;
 document.head.appendChild(s);
}
function install(){
 const input=document.getElementById('electricityProvider');
 if(!input)return false;
 if(input.tagName==='SELECT')return true;
 const select=document.createElement('select');
 select.id=input.id;
 select.name=input.name||'';
 select.className=input.className||'';
 select.setAttribute('aria-label',input.getAttribute('aria-label')||'Electricity provider');
 const first=document.createElement('option');
 first.value='';first.textContent='Select your electricity provider...';
 select.appendChild(first);
 const common=['British Gas','E.ON Next','EDF Energy','Octopus Energy','OVO Energy','ScottishPower','SSE','Utilita Energy','Ecotricity','Good Energy','So Energy','Utility Warehouse','E (Gas & Electricity)','Fuse Energy','Foxglove Energy','Green Energy UK'];
 const commonSet=new Set(common);
 const commonGroup=document.createElement('optgroup');commonGroup.label='Popular UK suppliers';
 const otherGroup=document.createElement('optgroup');otherGroup.label='Other licensed suppliers';
 providers.forEach(([name])=>{
   if(name==='Custom / Other')return;
   const o=document.createElement('option');o.value=name;o.textContent=name;
   (commonSet.has(name)?commonGroup:otherGroup).appendChild(o);
 });
 const custom=document.createElement('option');custom.value='Custom / Other';custom.textContent='Custom / Other';
 otherGroup.appendChild(custom);
 select.appendChild(commonGroup);select.appendChild(otherGroup);
 input.replaceWith(select);
 addStyle();
 select.addEventListener('change',()=>{
   const ev=new Event('input',{bubbles:true});select.dispatchEvent(ev);
   const ch=new Event('change',{bubbles:true});select.dispatchEvent(ch);
 });
 // Re-run the calculator so provider changes update the status line immediately.
 select.dispatchEvent(new Event('change',{bubbles:true}));
 return true;
}
function wait(){
 if(install())return;
 const started=Date.now();
 const timer=setInterval(()=>{if(install()||Date.now()-started>15000)clearInterval(timer)},50);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',wait,{once:true});else wait();
})();
