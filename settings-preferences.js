(()=>{
'use strict';
if(window.__printProfitPreferences)return;
window.__printProfitPreferences=true;

const STORAGE='printprofit.preferences.v1';
const defaults={language:'en',units:'metric',currency:'GBP',rate:1};

const languages={
  en:{
    'Settings':'Settings','Manage the calculator display and quick actions.':'Manage the calculator display and quick actions.',
    'Appearance':'Appearance','Dark mode':'Dark mode','Use the dark PrintProfit interface.':'Use the dark PrintProfit interface.',
    'Language':'Language','Choose the language used across the page.':'Choose the language used across the page.',
    'Units':'Units','Choose metric or imperial measurements.':'Choose metric or imperial measurements.',
    'Currency':'Currency','Choose the currency used for costs and prices.':'Choose the currency used for costs and prices.',
    'Exchange rate':'Exchange rate','1 GBP =':'1 GBP =','Update this rate when your currency conversion changes.':'Update this rate when your currency conversion changes.',
    'Calculator reset':'Calculator reset','Clear the current calculator inputs and return pricing to £0.':'Clear the current calculator inputs and return pricing to £0.',
    'Reset Calculator':'Reset Calculator','Your calculator data is not changed just by opening Settings.':'Your calculator data is not changed just by opening Settings.',
    'Metric (g / ml)':'Metric (g / ml)','Imperial (oz / fl oz)':'Imperial (oz / fl oz)',
    'English':'English','Polski':'Polski'
  },
  pl:{
    'Settings':'Ustawienia','Manage the calculator display and quick actions.':'Zarządzaj wyglądem kalkulatora i szybkimi akcjami.',
    'Appearance':'Wygląd','Dark mode':'Tryb ciemny','Use the dark PrintProfit interface.':'Użyj ciemnego interfejsu PrintProfit.',
    'Language':'Język','Choose the language used across the page.':'Wybierz język używany na całej stronie.',
    'Units':'Jednostki','Choose metric or imperial measurements.':'Wybierz jednostki metryczne lub imperialne.',
    'Currency':'Waluta','Choose the currency used for costs and prices.':'Wybierz walutę używaną dla kosztów i cen.',
    'Exchange rate':'Kurs wymiany','1 GBP =':'1 GBP =','Update this rate when your currency conversion changes.':'Aktualizuj kurs, gdy zmienia się przelicznik walut.',
    'Calculator reset':'Reset kalkulatora','Clear the current calculator inputs and return pricing to £0.':'Wyczyść dane kalkulatora i ustaw ceny z powrotem na 0.',
    'Reset Calculator':'Resetuj kalkulator','Your calculator data is not changed just by opening Settings.':'Samo otwarcie ustawień nie zmienia danych kalkulatora.',
    'Metric (g / ml)':'Metryczne (g / ml)','Imperial (oz / fl oz)':'Imperialne (oz / fl oz)',
    'English':'Angielski','Polski':'Polski'
  }
};

const currencyMeta={
  GBP:{symbol:'£',locale:'en-GB',rate:1},
  EUR:{symbol:'€',locale:'de-DE',rate:1.17},
  USD:{symbol:'$',locale:'en-US',rate:1.35},
  PLN:{symbol:'zł',locale:'pl-PL',rate:4.98}
};

function load(){
  try{return {...defaults,...JSON.parse(localStorage.getItem(STORAGE)||'{}')};}catch(e){return {...defaults};}
}
let prefs=load();
function save(){try{localStorage.setItem(STORAGE,JSON.stringify(prefs));}catch(e){}}

function moneyFormatGBP(value){
  const n=Number(value);
  if(!Number.isFinite(n))return '';
  const meta=currencyMeta[prefs.currency]||currencyMeta.GBP;
  const converted=n*(Number(prefs.rate)>0?Number(prefs.rate):1);
  return new Intl.NumberFormat(meta.locale,{style:'currency',currency:prefs.currency,minimumFractionDigits:2,maximumFractionDigits:2}).format(converted);
}
function baseFromCurrency(value){const n=Number(value)||0;return n/(Number(prefs.rate)>0?Number(prefs.rate):1);}

const weightIds={materialPack:'Spool weight',materialUsed:'Used per print'};
const moneyIds=['materialPackCost','labourRate','pack','other','electricityRate','fixedFee','delivery','deliveryCharge','sell'];
const moneyOutputIds=['materialCostOut','electricityCostOut','deliveryRateOut','singleCost','singleSellOut','singleProfit','batchCost','batchSales','batchProfit'];

function baseUnit(type){
  return type==='resin'?'ml':'g';
}
function displayUnit(type){
  if(prefs.units==='imperial')return type==='resin'?'fl oz':'oz';
  return baseUnit(type);
}
function toDisplay(value,type){
  const n=Number(value)||0;
  if(prefs.units!=='imperial')return n;
  return type==='resin'?n/29.5735295625:n/28.349523125;
}
function toBase(value,type){
  const n=Number(value)||0;
  if(prefs.units!=='imperial')return n;
  return type==='resin'?n*29.5735295625:n*28.349523125;
}

function fieldLabelFor(id){
  const el=document.getElementById(id);return el?.closest('div')?.querySelector('label')||document.querySelector('label[for="'+id+'"]');
}
function materialType(){return document.getElementById('materialType')?.value==='resin'?'resin':'filament';}

function setupProxies(){
  const type=materialType();
  Object.keys(weightIds).forEach(id=>{
    const original=document.getElementById(id);
    if(!original||document.getElementById('ppDisplay_'+id))return;
    const wrapper=original.parentElement;
    if(!wrapper)return;
    const proxy=document.createElement('input');
    proxy.type='number';proxy.id='ppDisplay_'+id;proxy.step=id==='materialPack'?'1':'0.01';proxy.min='0';proxy.className='pp-preference-proxy';
    proxy.dataset.source=id;
    original.type='hidden';original.dataset.ppBase='1';
    wrapper.appendChild(proxy);
    proxy.addEventListener('input',()=>{
      original.value=String(toBase(proxy.value,materialType()));
      original.dispatchEvent(new Event('input',{bubbles:true}));
    });
    proxy.addEventListener('change',()=>{
      original.value=String(toBase(proxy.value,materialType()));
      original.dispatchEvent(new Event('change',{bubbles:true}));
    });
  });
  syncWeightProxies();
}

function syncWeightProxies(){
  const type=materialType();
  Object.keys(weightIds).forEach(id=>{
    const original=document.getElementById(id),proxy=document.getElementById('ppDisplay_'+id);
    if(!original||!proxy)return;
    if(document.activeElement!==proxy)proxy.value=String(Number(toDisplay(original.value,type).toFixed(id==='materialPack'?0:2)));
  });
  const labels={
    materialPack:prefs.units==='imperial'?'Spool weight (oz)':materialType()==='resin'?'Bottle volume (ml)':'Spool weight (g)',
    materialUsed:prefs.units==='imperial'?(materialType()==='resin'?'Used per print (fl oz)':'Used per print (oz)'):materialType()==='resin'?'Used per print (ml)':'Used per print (g)'
  };
  Object.entries(labels).forEach(([id,text])=>{const lab=fieldLabelFor('ppDisplay_'+id)||fieldLabelFor(id);if(lab)lab.textContent=text;});
  document.getElementById('usageLabel')&&(document.getElementById('usageLabel').textContent=labels.materialUsed);
  document.getElementById('packAmountLabel')&&(document.getElementById('packAmountLabel').textContent=labels.materialPack);
}

function formatInputCurrencies(){
  moneyIds.forEach(id=>{
    const original=document.getElementById(id);
    if(!original)return;
    let proxy=document.getElementById('ppMoney_'+id);
    if(!proxy){
      const wrap=original.parentElement;if(!wrap)return;
      proxy=document.createElement('input');proxy.type='number';proxy.step=original.step||'0.01';proxy.min='0';proxy.id='ppMoney_'+id;proxy.className='pp-preference-proxy';
      original.type='hidden';original.dataset.ppBaseCurrency='1';wrap.appendChild(proxy);
      proxy.addEventListener('input',()=>{
        original.value=String(baseFromCurrency(proxy.value));
        original.dispatchEvent(new Event('input',{bubbles:true}));
      });
      proxy.addEventListener('change',()=>{
        original.value=String(baseFromCurrency(proxy.value));
        original.dispatchEvent(new Event('change',{bubbles:true}));
      });
    }
    if(document.activeElement!==proxy)proxy.value=(Number(original.value||0)*(Number(prefs.rate)||1)).toFixed(2);
    const lab=fieldLabelFor(id);
    if(lab){
      const t=lab.textContent.replace(/£/g,prefs.currency);
      lab.textContent=t;
    }
  });
}

function syncMoneyOutputs(){
  moneyOutputIds.forEach(id=>{
    const el=document.getElementById(id);
    if(!el)return;
    const raw=el.getAttribute('data-ppBaseMoney');
    if(raw!==null){
      el.textContent=moneyFormatGBP(raw);
      return;
    }
    const text=String(el.textContent||el.value||'');
    const m=text.match(/£\s*([0-9][0-9,]*(?:\.[0-9]+)?)/);
    if(m){
      const base=Number(m[1].replace(/,/g,''))||0;
      el.setAttribute('data-ppBaseMoney',String(base));
      if('value' in el && el.tagName==='INPUT')el.value=moneyFormatGBP(base);
      else el.textContent=moneyFormatGBP(base);
    }
  });
  document.querySelectorAll('body *').forEach(el=>{
    if(el.children.length) return;
    const text=String(el.textContent||'');
    if(!text.includes('£'))return;
    const replaced=text.replace(/£\s*([0-9][0-9,]*(?:\.[0-9]+)?)/g,(_,num)=>moneyFormatGBP(Number(num.replace(/,/g,''))));
    if(replaced!==text)el.textContent=replaced;
  });
}

const phrases={
  'pl':[
   ['PrintProfit — 3D Printing Cost & Pricing Calculator','PrintProfit — kalkulator kosztów i cen druku 3D'],
   ['⌂ Home','⌂ Strona główna'],['▣ Guides','▣ Poradniki'],['ⓘ About','ⓘ O nas'],['◉ Support','◉ Pomoc'],
   ['3D PRINTING PRICING, MADE SIMPLE','CENY DRUKU 3D, PROSTO I PRZEJRZYŚCIE'],
   ['Know what it costs.','Wiesz, ile to kosztuje.'],['Know what to charge.','Wiesz, ile naliczyć.'],
   ['Accurate 3D printing cost and pricing calculations to help you','Dokładne obliczenia kosztów i cen druku 3D, które pomogą Ci'],
   ['price with confidence and maximise your profit.','ustalać ceny z pewnością i zwiększać zysk.'],
   ['Start Calculating','Rozpocznij kalkulację'],['Learn More','Dowiedz się więcej'],
   ['Calculate','Kalkuluj'],['Price','Cena'],['Profit','Zysk'],['Settings','Ustawienia'],
   ['1. G-code File','1. Plik G-code'],['Upload your sliced file to auto-fill print time and filament usage.','Wgraj pocięty plik, aby automatycznie uzupełnić czas druku i zużycie materiału.'],
   ['Drag & drop your G-code file here','Przeciągnij tutaj plik G-code'],['Choose File','Wybierz plik'],['Clear','Wyczyść'],
   ['No G-code selected','Nie wybrano pliku G-code'],['Not sure about a field?','Nie wiesz, co wpisać?'],['Leave it blank.','Pozostaw puste.'],
   ['Blank fields are treated as £0 for a basic estimate.','Puste pola są traktowane jako 0 dla podstawowego szacunku.'],
   ['Tip:','Wskazówka:'],['Upload a G-code file for the most accurate results.','Wgraj plik G-code, aby uzyskać najdokładniejszy wynik.'],
   ['2. Printer Profile','2. Profil drukarki'],['Select your printer or use a custom profile.','Wybierz drukarkę lub użyj własnego profilu.'],
   ['Select a printer...','Wybierz drukarkę...'],['Custom printer','Własna drukarka'],
   ['3. Filament / Resin Profile','3. Profil filamentu / żywicy'],['Material type','Rodzaj materiału'],
   ['Filament (FDM)','Filament (FDM)'],['Resin (SLA / MSLA / DLP)','Żywica (SLA / MSLA / DLP)'],['Material','Materiał'],
   ['Other / Custom Filament','Inny / własny filament'],['Standard Resin','Żywica standardowa'],['Other / Custom Resin','Inna / własna żywica'],
   ['Calculated material cost (£)','Obliczony koszt materiału'],['Print time (hours)','Czas druku'],['Waiting for a print file, or enter usage manually.','Oczekiwanie na plik druku lub ręczne wprowadzenie zużycia.'],
   ['4. Operating Costs','4. Koszty operacyjne'],['Additional Costs','Dodatkowe koszty'],['Labour hours (per print)','Godziny pracy (na wydruk)'],
   ['Labour cost (£/hour)','Koszt pracy (£/godz.)'],['Packaging (£)','Pakowanie'],['Other (£)','Inne'],
   ['Electricity','Prąd'],['Electricity provider / tariff','Dostawca prądu / taryfa'],['Unit rate (£/kWh)','Stawka (£/kWh)'],
   ['Estimated printer power','Szacowana moc drukarki'],['Estimated power used (kWh)','Szacowane zużycie prądu (kWh)'],['Estimated electricity cost','Szacowany koszt prądu'],
   ['5. Selling & Fulfilment','5. Sprzedaż i realizacja'],['Marketplace fees','Opłaty marketplace'],['Platform','Platforma'],
   ['Platform fee (%)','Opłata platformy (%)'],['Payment fee (%)','Opłata płatnicza (%)'],['Fixed fee (£)','Opłata stała'],
   ['Delivery','Dostawa'],['Courier / delivery firm','Kurier / firma dostawcza'],['Service / rate','Usługa / stawka'],
   ['Cost to you (£)','Koszt dla Ciebie'],['Charged to customer (£)','Koszt dla klienta'],
   ['6. Quantity / Batch Pricing','6. Ilość / wycena zbiorcza'],['Quantity','Ilość'],['Batch discount (%)','Rabat ilościowy (%)'],
   ['Selling price per item (£)','Cena sprzedaży za sztukę'],['Calculate Costs & Price','Oblicz koszty i cenę'],['Reset','Resetuj'],
   ['Results','Wyniki'],['Single Print','Pojedynczy wydruk'],['Batch Pricing','Wycena zbiorcza'],
   ['Total Cost to Make','Łączny koszt wykonania'],['Selling Price','Cena sprzedaży'],['Profit','Zysk'],
   ['Quick Price Buttons (target margin)','Szybkie przyciski ceny (docelowa marża)'],['Custom target margin (%)','Własna docelowa marża (%)'],
   ['Breakdown (per print)','Rozbicie kosztów (na wydruk)'],['Batch Cost to Make','Koszt partii'],
   ['Batch Sales','Sprzedaż partii'],['Batch Profit','Zysk z partii']
  ]
};

function translateNode(node,lang){
  const source=phrases.pl||[];
  const list=lang==='pl'?source:source.map(([a,b])=>[b,a]);
  if(node.nodeType===3){
    const v=node.nodeValue.trim();if(!v)return;
    for(const [a,b] of list){if(v===a){node.nodeValue=node.nodeValue.replace(v,b);break;}}
  }else if(node.nodeType===1){
    for(const attr of ['placeholder','title','aria-label']){
      const v=node.getAttribute(attr);if(!v)continue;
      for(const [a,b] of list){if(v===a){node.setAttribute(attr,b);break;}}
    }
  }
}
function applyLanguage(){
  document.documentElement.lang=prefs.language==='pl'?'pl':'en';
  const walker=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT|NodeFilter.SHOW_ELEMENT);
  const nodes=[];let n;while(n=walker.nextNode())nodes.push(n);
  nodes.forEach(node=>translateNode(node,prefs.language));
  document.title=prefs.language==='pl'?'PrintProfit — kalkulator kosztów i cen druku 3D':'PrintProfit — 3D Printing Cost & Pricing Calculator';
}

function injectSettings(){
  const panel=document.getElementById('ppSettingsPanel');
  if(!panel||panel.dataset.preferencesReady==='1')return false;
  panel.dataset.preferencesReady='1';
  const body=panel.querySelector('.pp-settings-body');
  if(!body)return false;
  const resetCard=body.querySelector('#ppSettingsReset')?.closest('.pp-settings-card');
  const makeCard=(title,desc,control)=>{
    const card=document.createElement('div');card.className='pp-settings-card';
    const copy=document.createElement('div');copy.innerHTML='<strong>'+title+'</strong><span>'+desc+'</span>';
    card.append(copy,control);return card;
  };
  const lang=document.createElement('select');lang.id='ppSettingsLanguage';lang.innerHTML='<option value="en">English</option><option value="pl">Polski</option>';
  const units=document.createElement('select');units.id='ppSettingsUnits';units.innerHTML='<option value="metric">Metric (g / ml)</option><option value="imperial">Imperial (oz / fl oz)</option>';
  const currency=document.createElement('select');currency.id='ppSettingsCurrency';currency.innerHTML='<option value="GBP">GBP (£)</option><option value="EUR">EUR (€)</option><option value="USD">USD ($)</option><option value="PLN">PLN (zł)</option>';
  [lang,units,currency].forEach(s=>s.className='pp-settings-select');
  const rateWrap=document.createElement('div');rateWrap.className='pp-settings-rate';
  rateWrap.innerHTML='<span id="ppSettingsRateLabel">1 GBP =</span><input id="ppSettingsRate" type="number" min="0.000001" step="0.0001">';
  const blockLang=makeCard('Language','Choose the language used across the page.',lang);
  const blockUnits=makeCard('Units','Choose metric or imperial measurements.',units);
  const blockCurrency=makeCard('Currency','Choose the currency used for costs and prices.',currency);
  const blockRate=makeCard('Exchange rate','1 GBP =',rateWrap);

  const appearance=body.querySelector('.pp-settings-card');
  if(appearance)body.insertBefore(blockLang,appearance.nextSibling);
  if(blockLang)body.insertBefore(blockUnits,blockLang.nextSibling);
  if(blockUnits)body.insertBefore(blockCurrency,blockUnits.nextSibling);
  if(blockCurrency)body.insertBefore(blockRate,blockCurrency.nextSibling);

  lang.value=prefs.language;units.value=prefs.units;currency.value=prefs.currency;
  if(!(Number(prefs.rate)>0))prefs.rate=(currencyMeta[prefs.currency]||currencyMeta.GBP).rate;
  document.getElementById('ppSettingsRate').value=Number(prefs.rate).toFixed(4);

  lang.addEventListener('change',()=>{prefs.language=lang.value;save();applyLanguage();});
  units.addEventListener('change',()=>{prefs.units=units.value;save();syncWeightProxies();});
  currency.addEventListener('change',()=>{prefs.currency=currency.value;prefs.rate=currencyMeta[prefs.currency].rate;document.getElementById('ppSettingsRate').value=Number(prefs.rate).toFixed(4);save();formatInputCurrencies();syncMoneyOutputs();updateLabelsCurrency();});
  document.getElementById('ppSettingsRate').addEventListener('input',e=>{const r=Number(e.target.value);if(r>0){prefs.rate=r;save();formatInputCurrencies();syncMoneyOutputs();}});

  const style=document.createElement('style');style.id='ppPreferencesStyles';style.textContent=`
    .pp-settings-select{width:150px!important;min-width:150px!important;background:#0d202b!important;color:#f5f8fb!important;border:1px solid #355464!important;border-radius:9px!important;padding:9px 10px!important;font:700 11px Inter,Segoe UI,system-ui,sans-serif!important}
    .pp-settings-select:focus{border-color:#ff7800!important;outline:none}
    .pp-settings-rate{display:flex;align-items:center;gap:7px}.pp-settings-rate span{color:#8fa6b2!important;font-size:10px!important;white-space:nowrap}.pp-settings-rate input{width:105px!important}
    .pp-preference-proxy{width:100%!important;box-sizing:border-box!important;background:var(--panel2)!important;color:var(--text)!important;border:1px solid var(--line)!important;border-radius:7px!important;padding:7px 8px!important;font-size:13px!important;outline:0}
    .pp-preference-proxy:focus{border-color:var(--accent)!important}
  `;document.head.appendChild(style);
  return true;
}

function updateLabelsCurrency(){
  const symbol=(currencyMeta[prefs.currency]||currencyMeta.GBP).symbol;
  document.querySelectorAll('label').forEach(label=>{
    if(/[£$€]|zł/.test(label.textContent) && !label.dataset.ppCurrencyTemplate)label.dataset.ppCurrencyTemplate=label.textContent;
    if(label.dataset.ppCurrencyTemplate)label.textContent=label.dataset.ppCurrencyTemplate.replace(/£/g,symbol);
  });
}

function observe(){
  const observer=new MutationObserver(mutations=>{
    if(document.getElementById('ppSettingsPanel'))injectSettings();
    for(const m of mutations){
      if(prefs.language==='pl' && m.type==='childList'){
        m.addedNodes.forEach(node=>{
          if(node.nodeType===1||node.nodeType===3)translateNode(node,prefs.language);
        });
      }
    }
    formatInputCurrencies();syncMoneyOutputs();updateLabelsCurrency();
  });
  observer.observe(document.body,{subtree:true,childList:true,characterData:true});
}

function boot(){
  setupProxies();
  formatInputCurrencies();
  updateLabelsCurrency();
  applyLanguage();
  observe();
  setInterval(()=>{syncWeightProxies();formatInputCurrencies();syncMoneyOutputs();},500);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();