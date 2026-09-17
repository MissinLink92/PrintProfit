(()=>{
'use strict';
if(window.__printProfitElectricityProviders)return;window.__printProfitElectricityProviders=true;

// Supplier brands/legal supply companies. Provider selection is informational;
// tariffs vary by plan, region, meter and payment method, so we never pretend
// that every customer of a supplier has one fixed electricity rate.
const providers=[
  ['British Gas','British Gas Trading Ltd'],['E.ON Next','E.ON Next Energy Ltd'],['EDF Energy','EDF Energy Customers Ltd'],['Octopus Energy','Octopus Energy Ltd'],['OVO Energy','OVO Energy Ltd'],['ScottishPower','Scottish Power Energy Retail Ltd'],['Utilita Energy','Utilita Energy Ltd'],['Ecotricity','Ecotricity Ltd'],['Good Energy','Good Energy Ltd'],['So Energy','So Energy Trading Ltd'],['Utility Warehouse','Electricity Plus Supply Ltd'],['E (Gas & Electricity)','E (Gas and Electricity) Ltd'],['Fuse Energy','Fuse Energy Supply Ltd'],['Foxglove Energy','Foxglove Energy Supply Ltd'],['Green Energy UK','Green Energy (UK) Ltd'],['Drax','Drax Energy Solutions Ltd'],['Valda Energy','Valda Energy Ltd'],['Voltx Power','Voltx Power Ltd'],['Tru Energy','Tru Energy Ltd'],['Square1 Energy','Square1 Energy Ltd'],['Arto.Energy','Arto.Energy Ltd'],['Brook Green','Brook Green Trading Ltd'],['Bryt Energy','Bryt Energy Ltd'],['Co-op Energy','Co-operative Energy Ltd'],['Evolve Energy','Evolve Energy Supply Ltd'],['Home Energy Trading','Home Energy Trading Ltd'],['Highland Electricity','Highland Electricity Ltd'],['Jellyfish Energy','Jellyfish Energy Ltd'],['Planet 9 Energy','Planet 9 Energy Ltd'],['Shell Energy','Shell Energy UK Ltd'],['SINQ Power','SINQ Power Ltd'],['Toucan Energy','Toucan Energy Ltd'],['Unify Energy','Unify Energy Ltd'],['YU Energy','YU Energy Retail Ltd'],['D-ENERGI','D-Energi Trading Ltd'],['DGP Energy','DGP Energy Ltd'],['Digital Power','Digital Power Energy Supply UK Ltd'],['Eneco','Eneco Energy Trade BV'],['ENGIE','Engie Power Ltd'],['Electroroute','Electroroute Energy Ltd'],['AXPO UK','AXPO UK Ltd'],['Corona Energy','Corona Energy Retail 4 Ltd'],['Hartree Partners','Hartree Partners Supply (UK) Ltd'],['Marble Power','Marble Power Ltd'],['Maxen Power','Maxen Power Supply Ltd'],['MVV Environment','MVV Environment Services Ltd'],['NEAS Energy','NEAS Energy Ltd'],['Opus Energy','Opus Energy Ltd'],['SQE Energy','SQE Energy Ltd'],['Tesla Energy','Tesla Energy Ventures Ltd'],['United Gas & Power','United Gas & Power Trading Ltd'],['Constellation Generation','Constellation Generation Ltd'],['Alfred Electricity & Gas','Alfred Electricity & Gas Ltd'],
  ['Barbican Power','Barbican Power Ltd'],['BGI','BGI Trading Ltd'],['BP Gas & Power','BP Gas Marketing Ltd'],['Capture Energy','Capture Energy Ltd'],['Conrad Energy','Conrad Energy (Trading) Ltd'],['Coulomb Energy','Coulomb Energy Supply Ltd'],['Crown Gas & Power','Crown Gas and Power 2 Ltd'],['Dyce Energy','Dyce Energy Ltd'],['E E Solutions','E E Solutions Ltd'],['Edgware Energy','Edgware Energy Ltd'],['Engelhart CTP Energy UK','Engelhart CTP Energy UK Ltd'],['EPG Energy','EPG Energy Ltd'],['Equinicity','Equinicity Ltd'],['F & S Energy','F & S Energy Ltd'],['Farringdon Energy','Farringdon Energy Ltd'],['Flexitricity','Flexitricity Ltd'],['Habitat Energy','Habitat Energy Ltd'],['Holborn Energy','Holborn Energy Ltd'],['Limejump Energy','Limejump Energy Ltd'],['Nadara Energy Trading','Nadara Energy Trading Srl, UK Branch'],['npower Business Solutions','Npower Commercial Gas Ltd'],['Pozitive Energy','Pozitive Energy Ltd'],['PX Supply','PX Supply Ltd'],['Radius Energy','Radius Energy Ltd'],['Regent Power','Regent Power Ltd'],['Ruby Energy','Ruby Electricity Ltd'],['SEFE Energy','Sefe Energy Ltd'],['Smart Pay Energy','Smart Pay Energy Ltd'],['SmartestEnergy','SmartestEnergy Ltd'],['SSE','SSE Energy Supply Ltd'],['Statkraft','Statkraft Markets GmbH'],['TotalEnergies Gas & Power','TotalEnergies Gas & Power Ltd'],['Tradelink Solutions','Tradelink Solutions Ltd'],['UC Energy','UC Energy Ltd'],['UK Power Reserve','UK Power Reserve Ltd'],['United Gas & Power','United Gas & Power Ltd'],['Vattenfall','Vattenfall Energy Trading GmbH'],['Verastar','Verastar Ltd'],['Versa Energy','Versa Energy Ltd'],['Wilton Energy','Wilton Energy Ltd'],['Custom / Other','']
];

const benchmarks={
  'ofgem-jul-sep-2026':{label:'Ofgem benchmark — 1 Jul to 30 Sep 2026',rate:'0.2611',standing:'0.5719'},
  'ofgem-oct-dec-2026':{label:'Ofgem benchmark — 1 Oct to 31 Dec 2026',rate:'0.2632',standing:'0.5483'}
};

function fieldLabel(text){const el=document.createElement('div');el.className='pp-electricity-label';el.textContent=text;return el;}
function addStyle(){
 const old=document.getElementById('ppElectricityProviderStyles');if(old)old.remove();
 const s=document.createElement('style');s.id='ppElectricityProviderStyles';
 s.textContent=`
 .pp-electricity-extra{margin-top:7px;display:grid;grid-template-columns:1.35fr .85fr;gap:7px;align-items:end}
 .pp-electricity-extra .pp-electricity-block{min-width:0}
 .pp-electricity-label{color:var(--muted);font-size:10.5px;margin:0 0 4px}
 #electricityProvider,#ppElectricityRateSource{width:100%!important;background:#0d161d!important;color:var(--text)!important;border:1px solid var(--line)!important;border-radius:7px!important;padding:7px 8px!important;outline:0!important;font-size:13px!important}
 #electricityProvider:focus,#ppElectricityRateSource:focus{border-color:var(--accent)!important;box-shadow:0 0 0 2px #ff780014!important}
 .pp-electricity-note{grid-column:1 / -1;color:var(--muted);font-size:10px;line-height:1.35;margin-top:-1px}
 .pp-electricity-note strong{color:var(--accent)}
 @media(max-width:650px){.pp-electricity-extra{grid-template-columns:1fr}.pp-electricity-note{grid-column:auto}}
 `;document.head.appendChild(s);
}
function setRate(value){
 const rate=document.getElementById('electricityRate');if(!rate)return;
 rate.value=value;
 rate.dispatchEvent(new Event('input',{bubbles:true}));
 rate.dispatchEvent(new Event('change',{bubbles:true}));
}
function addRateSource(input){
 if(document.getElementById('ppElectricityRateSource'))return;
 const wrap=document.createElement('div');wrap.className='pp-electricity-extra';
 const providerBlock=document.createElement('div');providerBlock.className='pp-electricity-block';
 providerBlock.appendChild(fieldLabel('Electricity provider / tariff'));
 const sourceBlock=document.createElement('div');sourceBlock.className='pp-electricity-block';
 sourceBlock.appendChild(fieldLabel('Rate source'));
 const source=document.createElement('select');source.id='ppElectricityRateSource';source.setAttribute('aria-label','Electricity rate source');
 [['manual','My actual tariff — enter below'],['ofgem-jul-sep-2026',benchmarks['ofgem-jul-sep-2026'].label],['ofgem-oct-dec-2026',benchmarks['ofgem-oct-dec-2026'].label]].forEach(([value,label])=>{const o=document.createElement('option');o.value=value;o.textContent=label;source.appendChild(o);});
 sourceBlock.appendChild(source);
 const note=document.createElement('div');note.className='pp-electricity-note';note.id='ppElectricityRateNote';
 note.innerHTML='<strong>Provider selected:</strong> supplier choice does not set a universal tariff. Use your actual bill/tariff rate, or choose an Ofgem benchmark.';
 wrap.append(providerBlock,sourceBlock,note);
 const parent=input.parentElement;
 if(parent){
   const label=parent.querySelector('label');
   if(label)label.style.display='none';
   wrap.querySelector('.pp-electricity-block').appendChild(input);
   parent.insertBefore(wrap,parent.firstChild);
 }
 source.addEventListener('change',()=>{
   const selected=benchmarks[source.value];
   if(selected){
     setRate(selected.rate);
     note.innerHTML='<strong>Ofgem benchmark:</strong> '+selected.rate*100+'p/kWh. Standing charge reference: '+selected.standing*100+'p/day. Your supplier tariff may differ by plan, region, meter and payment method.';
   }else{
     note.innerHTML='<strong>Manual tariff:</strong> enter the unit rate shown on your electricity bill. The provider name is not used to guess a tariff.';
   }
 });
 // If a default example rate is already present, make manual mode explicit so
 // choosing a supplier never silently changes the user's tariff.
 if(input.value && input.value!=='0')source.value='manual';
}
function buildProviderSelect(input){
 const select=document.createElement('select');
 select.id=input.id;select.name=input.name||'';select.className=input.className||'';select.setAttribute('aria-label','Electricity provider');
 const first=document.createElement('option');first.value='';first.textContent='Select your electricity provider...';select.appendChild(first);
 const common=['British Gas','E.ON Next','EDF Energy','Octopus Energy','OVO Energy','ScottishPower','Utilita Energy','Ecotricity','Good Energy','So Energy','Utility Warehouse','E (Gas & Electricity)','Fuse Energy','Foxglove Energy','Green Energy UK','Drax'];
 const commonSet=new Set(common);const commonGroup=document.createElement('optgroup');commonGroup.label='Popular UK suppliers';const otherGroup=document.createElement('optgroup');otherGroup.label='Other licensed suppliers';const seen=new Set();
 providers.forEach(([name])=>{if(seen.has(name)||name==='Custom / Other')return;seen.add(name);const o=document.createElement('option');o.value=name;o.textContent=name;(commonSet.has(name)?commonGroup:otherGroup).appendChild(o);});
 const custom=document.createElement('option');custom.value='Custom / Other';custom.textContent='Custom / Other';otherGroup.appendChild(custom);select.append(commonGroup,otherGroup);
 input.replaceWith(select);return select;
}
function install(){
 const input=document.getElementById('electricityProvider');if(!input)return false;
 if(input.tagName!=='SELECT')input=buildProviderSelect(input);
 addStyle();addRateSource(input);
 input.addEventListener('change',()=>input.dispatchEvent(new Event('input',{bubbles:true})));
 return true;
}
function wait(){if(install())return;const started=Date.now();const timer=setInterval(()=>{if(install()||Date.now()-started>15000)clearInterval(timer)},50);}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',wait,{once:true});else wait();
})();
