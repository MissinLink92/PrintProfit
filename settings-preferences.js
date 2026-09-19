(()=>{
'use strict';
if(window.__printProfitPreferences)return;
window.__printProfitPreferences=true;

const STORE='printprofit.preferences.v2';
const defaults={dark:true,language:'en',units:'metric',currency:'GBP',rate:1};
const meta={
  GBP:{symbol:'£',locale:'en-GB',defaultRate:1},
  EUR:{symbol:'€',locale:'de-DE',defaultRate:1.17},
  USD:{symbol:'$',locale:'en-US',defaultRate:1.35},
  PLN:{symbol:'zł',locale:'pl-PL',defaultRate:4.98}
};
const state=load();
const currencyFields=['materialPackCost','labourRate','pack','other','electricityRate','fixedFee','delivery','deliveryCharge','sell'];
const unitFields=['materialPack','materialUsed'];
const originalLabel= new WeakMap();
const originalCurrencyText=new WeakMap();

const translations=[
 ['Settings','Ustawienia'],['Manage the calculator display and preferences.','Zarządzaj wyglądem kalkulatora i preferencjami.'],
 ['Appearance','Wygląd'],['Dark mode','Tryb ciemny'],['Use the dark PrintProfit interface.','Użyj ciemnego interfejsu PrintProfit.'],
 ['Language','Język'],['Choose the language used across the page.','Wybierz język używany na całej stronie.'],
 ['Units','Jednostki'],['Choose metric or imperial measurements.','Wybierz jednostki metryczne lub imperialne.'],
 ['Currency','Waluta'],['Choose the currency used for costs and prices.','Wybierz walutę używaną dla kosztów i cen.'],
 ['Exchange rate','Kurs wymiany'],['Update the conversion used when displaying non-GBP currencies.','Aktualizuj przelicznik używany do wyświetlania walut innych niż GBP.'],
 ['Calculator reset','Reset kalkulatora'],['Clear the current calculator inputs and return pricing to £0.','Wyczyść dane kalkulatora i ustaw ceny z powrotem na 0.'],
 ['Reset Calculator','Resetuj kalkulator'],['Preferences are saved automatically on this device.','Preferencje są zapisywane automatycznie na tym urządzeniu.'],
 ['English','Angielski'],['Metric (g / ml)','Metryczne (g / ml)'],['Imperial (oz / fl oz)','Imperialne (oz / fl oz)'],
 ['Calculate','Kalkuluj'],['Price','Cena'],['Profit','Zysk'],['Settings','Ustawienia'],
 ['3D PRINTING PRICING, MADE SIMPLE','CENY DRUKU 3D, PROSTO I PRZEJRZYŚCIE'],
 ['Know what it costs.','Wiesz, ile to kosztuje.'],['Know what to charge.','Wiesz, ile naliczyć.'],
 ['Accurate 3D printing cost and pricing calculations to help you','Dokładne obliczenia kosztów i cen druku 3D, które pomogą Ci'],
 ['price with confidence and maximise your profit.','ustalać ceny z pewnością i zwiększać zysk.'],
 ['Start Calculating','Rozpocznij kalkulację'],['Learn More','Dowiedz się więcej'],
 ['1. G-code File','1. Plik G-code'],['Upload your sliced file to auto-fill print time and filament usage.','Wgraj pocięty plik, aby automatycznie uzupełnić czas druku i zużycie materiału.'],
 ['Drag & drop your G-code file here','Przeciągnij tutaj plik G-code'],['Choose File','Wybierz plik'],['Clear','Wyczyść'],
 ['No G-code selected','Nie wybrano pliku G-code'],['Not sure about a field?','Nie wiesz, co wpisać?'],['Leave it blank.','Pozostaw puste.'],
 ['Tip:','Wskazówka:'],['Upload a G-code file for the most accurate results.','Wgraj plik G-code, aby uzyskać najdokładniejszy wynik.'],
 ['2. Printer Profile','2. Profil drukarki'],['Select your printer or use a custom profile.','Wybierz drukarkę lub użyj własnego profilu.'],
 ['Select a printer...','Wybierz drukarkę...'],
 ['3. Filament / Resin Profile','3. Profil filamentu / żywicy'],['Material type','Rodzaj materiału'],['Material','Materiał'],
 ['Filament (FDM)','Filament (FDM)'],['Resin (SLA / MSLA / DLP)','Żywica (SLA / MSLA / DLP)'],
 ['Calculated material cost (£)','Obliczony koszt materiału'],['Print time (hours)','Czas druku'],
 ['Waiting for a print file, or enter usage manually.','Oczekiwanie na plik druku lub ręczne wprowadzenie zużycia.'],
 ['4. Operating Costs','4. Koszty operacyjne'],['Additional Costs','Dodatkowe koszty'],['Labour hours (per print)','Godziny pracy (na wydruk)'],
 ['Labour cost (£/hour)','Koszt pracy (£/godz.)'],['Packaging (£)','Pakowanie'],['Other (£)','Inne'],
 ['Electricity','Prąd'],['Electricity provider / tariff','Dostawca prądu / taryfa'],['Unit rate (£/kWh)','Stawka (£/kWh)'],
 ['Estimated printer power','Szacowana moc drukarki'],['Estimated power used (kWh)','Szacowane zużycie prądu (kWh)'],['Estimated electricity cost','Szacowany koszt prądu'],
 ['5. Selling & Fulfilment','5. Sprzedaż i realizacja'],['Platform','Platforma'],['Platform fee (%)','Opłata platformy (%)'],
 ['Payment fee (%)','Opłata płatnicza (%)'],['Fixed fee (£)','Opłata stała'],['Delivery','Dostawa'],
 ['Courier / delivery firm','Kurier / firma dostawcza'],['Service / rate','Usługa / stawka'],
 ['Cost to you (£)','Koszt dla Ciebie'],['Charged to customer (£)','Koszt dla klienta'],
 ['6. Quantity / Batch Pricing','6. Ilość / wycena zbiorcza'],['Quantity','Ilość'],['Batch discount (%)','Rabat ilościowy (%)'],
 ['Selling price per item (£)','Cena sprzedaży za sztukę'],['Calculate Costs & Price','Oblicz koszty i cenę'],
 ['Results','Wyniki'],['Single Print','Pojedynczy wydruk'],['Batch Pricing','Wycena zbiorcza'],
 ['Total Cost to Make','Łączny koszt wykonania'],['Selling Price','Cena sprzedaży'],['Quick Price Buttons (target margin)','Szybkie przyciski ceny (docelowa marża)'],
 ['Custom target margin (%)','Własna docelowa marża (%)'],['Breakdown (per print)','Rozbicie kosztów (na wydruk)'],
 ['Batch Cost to Make','Koszt partii'],['Batch Sales','Sprzedaż partii'],['Batch Profit','Zysk z partii']
];
const plToEn=new Map(translations.map(([a,b])=>[b,a]));
const enToPl=new Map(translations.map(([a,b])=>[a,b]));

function load(){
  try{return {...defaults,...JSON.parse(localStorage.getItem(STORE)||'{}')}}catch(e){return {...defaults}}
}
function save(){try{localStorage.setItem(STORE,JSON.stringify(state))}catch(e){}}
function setBodyTheme(){
  document.body.dataset.ppTheme=state.dark?'dark':'light';
  const style=document.getElementById('ppPreferencesLightStyles')||document.createElement('style');
  style.id='ppPreferencesLightStyles';
  style.textContent=`
    body[data-pp-theme="light"]{background:#eef3f5!important;color:#17242c!important}
    body[data-pp-theme="light"] #ppCleanTop{background:#e9f0f3!important;color:#17242c!important;border-color:#c5d3da!important}
    body[data-pp-theme="light"] #ppCleanTop .pp-top-nav{background:#f4f7f8!important;border-color:#c5d3da!important}
    body[data-pp-theme="light"] #ppCleanTop .pp-top-links button{color:#23333c!important}
    body[data-pp-theme="light"] .panel,body[data-pp-theme="light"] .pp-master-quickcards button{background:linear-gradient(180deg,#fff,#edf3f5)!important;color:#17242c!important}
    body[data-pp-theme="light"] input,body[data-pp-theme="light"] select,body[data-pp-theme="light"] textarea{background:#fff!important;color:#17242c!important;border-color:#c5d3da!important}
    body[data-pp-theme="light"] .pp-settings-dialog{background:#f7fafb!important;color:#17242c!important}
    body[data-pp-theme="light"] .pp-settings-head{background:#f7fafb!important;border-color:#c5d3da!important}
    body[data-pp-theme="light"] .pp-settings-card{background:#fff!important;border-color:#c5d3da!important}
    body[data-pp-theme="light"] .pp-settings-card span,body[data-pp-theme="light"] .pp-settings-note,body[data-pp-theme="light"] .pp-settings-head p{color:#5e727d!important}
  `;
  if(!style.parentNode)document.head.appendChild(style);
}
function translatePage(){
  document.documentElement.lang=state.language==='pl'?'pl':'en';
  const walker=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT|NodeFilter.SHOW_ELEMENT);
  let n;
  while(n=walker.nextNode()){
    if(n.nodeType===3){
      if(!n.parentElement||n.parentElement.closest('script,style'))continue;
      const raw=n.nodeValue;
      const trimmed=raw.trim();
      if(!trimmed)continue;
      if(!n.__ppOriginal)n.__ppOriginal=trimmed;
      const target=state.language==='pl'?(enToPl.get(n.__ppOriginal)||n.__ppOriginal):(plToEn.get(n.__ppOriginal)||n.__ppOriginal);
      if(n.nodeValue!==target)n.nodeValue=raw.replace(trimmed,target);
    }else if(n.nodeType===1){
      ['placeholder','title','aria-label'].forEach(attr=>{
        const raw=n.getAttribute(attr);if(!raw)return;
        const target=state.language==='pl'?(enToPl.get(raw)||raw):(plToEn.get(raw)||raw);
        if(raw!==target)n.setAttribute(attr,target);
      });
    }
  }
  document.title=state.language==='pl'?'PrintProfit — kalkulator kosztów i cen druku 3D':'PrintProfit — 3D Printing Cost & Pricing Calculator';
}
function fieldLabel(id){
  return document.querySelector('label[for="'+id+'"]')||document.getElementById(id)?.parentElement?.querySelector('label')||null;
}
function convertMetric(value,type,toImperial){
  const n=Number(value)||0;
  if(!toImperial)return n;
  return type==='resin'?n/29.5735295625:n/28.349523125;
}
function convertToMetric(value,type){
  const n=Number(value)||0;
  return type==='resin'?n*29.5735295625:n*28.349523125;
}
function materialType(){return document.getElementById('materialType')?.value==='resin'?'resin':'filament'}
function proxyField(id,type){
  const source=document.getElementById(id);
  if(!source)return;
  const imperial=state.units==='imperial';
  let proxy=document.getElementById('ppPref_'+id);
  if(imperial){
    if(!proxy){
      proxy=document.createElement('input');proxy.type='number';proxy.id='ppPref_'+id;proxy.className='pp-preference-proxy';proxy.step=id==='materialPack'?'1':'0.01';proxy.min='0';
      proxy.addEventListener('input',()=>{
        source.value=String(convertToMetric(proxy.value,type));
        source.dispatchEvent(new Event('input',{bubbles:true}));
      });
      source.insertAdjacentElement('afterend',proxy);source.style.display='none';
    }
    proxy.value=(convertMetric(source.value,type,true)).toFixed(id==='materialPack'?0:2);
  }else{
    if(proxy){proxy.remove();source.style.display='';}
  }
}
function applyUnits(){
  const type=materialType();
  unitFields.forEach(id=>proxyField(id,type));
  const labels={
    materialPack:state.units==='imperial'?'Spool weight (oz)':type==='resin'?'Bottle volume (ml)':'Spool weight (g)',
    materialUsed:state.units==='imperial'?(type==='resin'?'Used per print (fl oz)':'Used per print (oz)'):type==='resin'?'Used per print (ml)':'Used per print (g)'
  };
  Object.entries(labels).forEach(([id,label])=>{const el=fieldLabel(id);if(el){if(!originalLabel.has(el))originalLabel.set(el,el.textContent);el.textContent=state.language==='pl'?(enToPl.get(label)||label):label;}});
}
function baseCurrencyText(text){
  const m=text.match(/£\s*(-?[0-9][0-9,]*(?:\.[0-9]+)?)/);
  return m?Number(m[1].replace(/,/g,'')):null;
}
function formatLeafCurrencies(){
  const meta=metaFor();
  const rate=Number(state.rate)>0?Number(state.rate):1;
  const walker=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);
  let n;
  while(n=walker.nextNode()){
    if(!n.parentElement||n.parentElement.closest('script,style,#ppSettingsPanel'))continue;
    const raw=n.nodeValue;
    if(raw.includes('£')){
      const base=baseCurrencyText(raw);
      if(base!==null)originalCurrencyText.set(n,raw);
    }
    const original=originalCurrencyText.get(n);
    if(!original)continue;
    const replaced=original.replace(/£\s*(-?[0-9][0-9,]*(?:\.[0-9]+)?)/g,(_,num)=>{
      const value=Number(num.replace(/,/g,''))*rate;
      return new Intl.NumberFormat(meta.locale,{style:'currency',currency:state.currency,minimumFractionDigits:2,maximumFractionDigits:2}).format(value);
    });
    if(n.nodeValue!==replaced)n.nodeValue=replaced;
  }
  document.querySelectorAll('label').forEach(label=>{
    if(!originalLabel.has(label) && /£/.test(label.textContent))originalLabel.set(label,label.textContent);
    const o=originalLabel.get(label);
    if(o&&/£/.test(o))label.textContent=o.replace(/£/g,meta.symbol);
  });
}
function metaFor(){return meta[state.currency]||meta.GBP}
function createCurrencyProxies(){
  const rate=Number(state.rate)>0?Number(state.rate):1;
  currencyFields.forEach(id=>{
    const source=document.getElementById(id);if(!source)return;
    let proxy=document.getElementById('ppPrefMoney_'+id);
    if(state.currency==='GBP'){
      if(proxy){proxy.remove();source.style.display='';}
      return;
    }
    if(!proxy){
      proxy=document.createElement('input');proxy.type='number';proxy.id='ppPrefMoney_'+id;proxy.className='pp-preference-proxy';proxy.step=source.step||'0.01';proxy.min='0';
      proxy.addEventListener('input',()=>{
        source.value=String((Number(proxy.value)||0)/rate);
        source.dispatchEvent(new Event('input',{bubbles:true}));
      });
      source.insertAdjacentElement('afterend',proxy);source.style.display='none';
    }
    proxy.value=(Number(source.value||0)*rate).toFixed(2);
  });
}
function applyCurrency(){
  if(state.currency==='GBP'&&!(Number(state.rate)>0))state.rate=1;
  createCurrencyProxies();
  formatLeafCurrencies();
}
function bind(){
  const dark=document.getElementById('ppSettingsDark');
  const lang=document.getElementById('ppSettingsLanguage');
  const units=document.getElementById('ppSettingsUnits');
  const currency=document.getElementById('ppSettingsCurrency');
  const rate=document.getElementById('ppSettingsRate');
  if(dark){
    dark.checked=state.dark;
    dark.addEventListener('change',()=>{state.dark=dark.checked;save();setBodyTheme();});
  }
  if(lang){
    lang.value=state.language;
    lang.addEventListener('change',()=>{state.language=lang.value;save();translatePage();applyUnits();});
  }
  if(units){
    units.value=state.units;
    units.addEventListener('change',()=>{state.units=units.value;save();applyUnits();});
  }
  if(currency){
    currency.value=state.currency;
    currency.addEventListener('change',()=>{
      state.currency=currency.value;
      state.rate=metaFor().defaultRate;
      if(rate)rate.value=Number(state.rate).toFixed(4);
      save();applyCurrency();
    });
  }
  if(rate){
    state.rate=Number(state.rate)>0?Number(state.rate):metaFor().defaultRate;
    rate.value=Number(state.rate).toFixed(4);
    rate.addEventListener('input',()=>{const v=Number(rate.value);if(v>0){state.rate=v;save();applyCurrency();}});
  }
}
function refresh(){
  translatePage();
  setBodyTheme();
  applyUnits();
  applyCurrency();
}
function boot(){bind();refresh();setInterval(()=>{applyUnits();applyCurrency();},700);}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();