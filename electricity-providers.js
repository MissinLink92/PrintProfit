(()=>{
'use strict';
if(window.__printProfitElectricityProviders)return;window.__printProfitElectricityProviders=true;

// Supplier brands/legal supply companies listed by Ofgem in its electricity
// licensee data. We keep supplier names user-friendly and collapse duplicate
// legal entities where they operate under the same consumer-facing brand.
const providers=[
  ['British Gas','British Gas Trading Ltd'],
  ['E.ON Next','E.ON Next Energy Ltd'],
  ['EDF Energy','EDF Energy Customers Ltd'],
  ['Octopus Energy','Octopus Energy Ltd'],
  ['OVO Energy','OVO Energy Ltd'],
  ['ScottishPower','Scottish Power Energy Retail Ltd'],
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

  // Electricity suppliers in Ofgem's non-domestic supply category.
  ['Barbican Power','Barbican Power Ltd'],
  ['BGI','BGI Trading Ltd'],
  ['BP Gas & Power','BP Gas Marketing Ltd'],
  ['Capture Energy','Capture Energy Ltd'],
  ['Conrad Energy','Conrad Energy (Trading) Ltd'],
  ['Coulomb Energy','Coulomb Energy Supply Ltd'],
  ['Crown Gas & Power','Crown Gas and Power 2 Ltd'],
  ['Dyce Energy','Dyce Energy Ltd'],
  ['E E Solutions','E E Solutions Ltd'],
  ['Edgware Energy','Edgware Energy Ltd'],
  ['Engelhart CTP Energy UK','Engelhart CTP Energy UK Ltd'],
  ['EPG Energy','EPG Energy Ltd'],
  ['Equinicity','Equinicity Ltd'],
  ['F & S Energy','F & S Energy Ltd'],
  ['Farringdon Energy','Farringdon Energy Ltd'],
  ['Flexitricity','Flexitricity Ltd'],
  ['Habitat Energy','Habitat Energy Ltd'],
  ['Holborn Energy','Holborn Energy Ltd'],
  ['Limejump Energy','Limejump Energy Ltd'],
  ['Nadara Energy Trading','Nadara Energy Trading Srl, UK Branch'],
  ['npower Business Solutions','Npower Commercial Gas Ltd'],
  ['Pozitive Energy','Pozitive Energy Ltd'],
  ['PX Supply','PX Supply Ltd'],
  ['Radius Energy','Radius Energy Ltd'],
  ['Regent Power','Regent Power Ltd'],
  ['Ruby Energy','Ruby Electricity Ltd'],
  ['SEFE Energy','Sefe Energy Ltd'],
  ['Smart Pay Energy','Smart Pay Energy Ltd'],
  ['SmartestEnergy','SmartestEnergy Ltd'],
  ['SSE','SSE Energy Supply Ltd'],
  ['Statkraft','Statkraft Markets GmbH'],
  ['TotalEnergies Gas & Power','TotalEnergies Gas & Power Ltd'],
  ['Tradelink Solutions','Tradelink Solutions Ltd'],
  ['UC Energy','UC Energy Ltd'],
  ['UK Power Reserve','UK Power Reserve Ltd'],
  ['United Gas & Power','United Gas & Power Ltd'],
  ['Vattenfall','Vattenfall Energy Trading GmbH'],
  ['Verastar','Verastar Ltd'],
  ['Versa Energy','Versa Energy Ltd'],
  ['Wilton Energy','Wilton Energy Ltd'],
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
 select.setAttribute('aria-label','Electricity provider');
 const first=document.createElement('option');
 first.value='';first.textContent='Select your electricity provider...';
 select.appendChild(first);
 const common=['British Gas','E.ON Next','EDF Energy','Octopus Energy','OVO Energy','ScottishPower','Utilita Energy','Ecotricity','Good Energy','So Energy','Utility Warehouse','E (Gas & Electricity)','Fuse Energy','Foxglove Energy','Green Energy UK','Drax'];
 const commonSet=new Set(common);
 const commonGroup=document.createElement('optgroup');commonGroup.label='Popular UK suppliers';
 const otherGroup=document.createElement('optgroup');otherGroup.label='Other licensed suppliers';
 const seen=new Set();
 providers.forEach(([name])=>{
   if(seen.has(name)||name==='Custom / Other')return;
   seen.add(name);
   const o=document.createElement('option');o.value=name;o.textContent=name;
   (commonSet.has(name)?commonGroup:otherGroup).appendChild(o);
 });
 const custom=document.createElement('option');custom.value='Custom / Other';custom.textContent='Custom / Other';
 otherGroup.appendChild(custom);
 select.appendChild(commonGroup);select.appendChild(otherGroup);
 input.replaceWith(select);
 addStyle();
 // Provider selection is informational only; the unit rate remains editable
 // because tariffs vary by plan, meter and customer.
 select.addEventListener('change',()=>{
   select.dispatchEvent(new Event('input',{bubbles:true}));
 });
 return true;
}
function wait(){
 if(install())return;
 const started=Date.now();
 const timer=setInterval(()=>{if(install()||Date.now()-started>15000)clearInterval(timer)},50);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',wait,{once:true});else wait();
})();
