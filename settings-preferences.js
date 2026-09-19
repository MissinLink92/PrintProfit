(()=>{ 
'use strict';
if(window.__printProfitPreferencesV3)return;
window.__printProfitPreferencesV3=true;

const KEY='printprofit.preferences.v3';
const defaults={dark:true,language:'en',units:'metric',currency:'GBP',rate:1};

const currencies={
 GBP:{symbol:'£',locale:'en-GB',rate:1},
 EUR:{symbol:'€',locale:'de-DE',rate:1.1663},
 USD:{symbol:'$',locale:'en-US',rate:1.3370},
 PLN:{symbol:'zł',locale:'pl-PL',rate:5.0892},
 CAD:{symbol:'CA$',locale:'en-CA',rate:1.84},
 AUD:{symbol:'A$',locale:'en-AU',rate:2.00},
 CHF:{symbol:'CHF',locale:'de-CH',rate:0.96},
 SEK:{symbol:'kr',locale:'sv-SE',rate:14.75},
 NOK:{symbol:'kr',locale:'nb-NO',rate:14.70},
 DKK:{symbol:'kr',locale:'da-DK',rate:8.69},
 CZK:{symbol:'Kč',locale:'cs-CZ',rate:28.30},
 JPY:{symbol:'¥',locale:'ja-JP',rate:179.00},
 CNY:{symbol:'¥',locale:'zh-CN',rate:9.65},
 INR:{symbol:'₹',locale:'en-IN',rate:123.50},
 NZD:{symbol:'NZ$',locale:'en-NZ',rate:2.16},
 SGD:{symbol:'S$',locale:'en-SG',rate:1.71},
 BRL:{symbol:'R$',locale:'pt-BR',rate:7.18},
 MXN:{symbol:'MX$',locale:'es-MX',rate:23.0696},
 ZAR:{symbol:'ZAR',locale:'en-ZA',rate:21.8000}
};

const moneyFields=['materialPackCost','labourRate','pack','other','electricityRate','fixedFee','delivery','deliveryCharge','sell'];
const unitFields=['materialPack','materialUsed'];

const tx={
 'Settings':'Ustawienia',
 'Manage the calculator display and preferences.':'Zarządzaj wyglądem kalkulatora i preferencjami.',
 'Appearance':'Wygląd',
 'Dark mode':'Tryb ciemny',
 'Use the dark PrintProfit interface.':'Użyj ciemnego interfejsu PrintProfit.',
 'Language':'Język',
 'Language & region':'Język i region',
 'Choose the language used across the page.':'Wybierz język używany na całej stronie.',
 'Units':'Jednostki',
 'Choose metric or imperial measurements.':'Wybierz jednostki metryczne lub imperialne.',
 'Currency':'Waluta',
 'Choose the currency used for costs and prices.':'Wybierz walutę używaną dla kosztów i cen.',
 'Exchange rate':'Kurs wymiany',
 'Update the conversion used when displaying non-GBP currencies.':'Aktualizuj przelicznik używany do wyświetlania walut innych niż GBP.',
 'Calculator reset':'Reset kalkulatora',
 'Clear the current calculator inputs and return pricing to £0.':'Wyczyść dane kalkulatora i ustaw ceny z powrotem na 0.',
 'Reset Calculator':'Resetuj kalkulator',
 'Apply Changes':'Zastosuj zmiany',
 'Preferences are saved automatically on this device.':'Preferencje są zapisywane automatycznie na tym urządzeniu.',
 'English':'English','Polski':'Polski','Metric (g / ml)':'Metryczne (g / ml)','Imperial (oz / fl oz)':'Imperialne (oz / fl oz)'
};
const extraTx={
 'Home':'Strona główna','Guides':'Przewodnik','About':'O nas','Support':'Wsparcie',
 'Dark Mode':'Tryb ciemny','Start Calculating':'Rozpocznij kalkulację','My Projects':'Moje projekty',
 'Calculate':'Kalkuluj','Costs':'Koszty','Price':'Cena','Prints':'Wydruki','Profit':'Zysk','Built':'Stworzone',
 'For Makers':'Dla twórców','Printer Profiles':'Profile drukarek','Materials & Filaments':'Materiały i filamenty',
 'Delivery & Fees':'Dostawa i opłaty','Calculate • Price • Profit':'Kalkuluj • Cena • Zysk',
 'Your Printing Cost Journey':'Twoja droga do kosztu wydruku',
 'Printer Profile':'Profil drukarki','Select your printer to get started':'Wybierz drukarkę, aby rozpocząć',
 'Filament & Material':'Filament i materiał','Set your material costs':'Ustaw koszty materiału',
 'Costs & Fees':'Koszty i opłaty','Add your business costs':'Dodaj koszty swojej działalności',
 'Your Model':'Twój model','Print Information':'Informacje o wydruku',
 'Everything PrintProfit currently knows about this model.':'Wszystko, co PrintProfit obecnie wie o tym modelu.',
 'Drag & drop your G-code file here':'Przeciągnij i upuść tutaj plik G-code','or':'lub','Choose File':'Wybierz plik','Clear':'Wyczyść','No G-code selected':'Nie wybrano pliku G-code',
 'Not sure about a field?':'Nie wiesz, co wpisać?','Leave it blank.':'Zostaw puste.',
 'Blank fields are treated as £0 for a basic estimate.':'Puste pola są traktowane jako £0 dla podstawowego oszacowania.',
 'Tip:':'Wskazówka:','Upload a G-code file for the most accurate results.':'Wgraj plik G-code, aby uzyskać najdokładniejsze wyniki.',
 'File':'Plik','Print time':'Czas druku','Material used':'Zużyty materiał',
 'Material':'Materiał','2. Print Setup':'2. Ustawienia druku',
 'Choose the printer and material used for this print.':'Wybierz drukarkę i materiał użyty do tego wydruku.',
 'Printer':'Drukarka','Select your printer or use a custom profile.':'Wybierz drukarkę lub użyj własnego profilu.',
 'Select a printer...':'Wybierz drukarkę...','Custom printer':'Własna drukarka',
 'Material type':'Rodzaj materiału','Filament (FDM)':'Filament (FDM)','Resin (SLA / MSLA / DLP)':'Żywica (SLA / MSLA / DLP)',
 'Choose your filament or resin, package size and cost.':'Wybierz filament lub żywicę, rozmiar opakowania i koszt.',
 'Spool weight (g)':'Waga szpuli (g)','Spool / bottle cost (£)':'Koszt szpuli / butelki (£)',
 'Used per print (g)':'Zużycie na wydruk (g)','Calculated material cost (£)':'Obliczony koszt materiału (£)',
 '4. Operating Costs':'4. Koszty operacyjne','Additional Costs':'Dodatkowe koszty','Electricity':'Prąd',
 'Electricity provider / tariff':'Dostawca prądu / taryfa','Estimated printer power':'Szacowana moc drukarki',
 'Estimated electricity cost':'Szacowany koszt prądu','5. Selling & Fulfilment':'5. Sprzedaż i realizacja',
 'Platform':'Platforma','Delivery':'Dostawa','6. Quantity / Batch Pricing':'6. Ilość / wycena zbiorcza',
 'Quantity':'Ilość','Batch discount (%)':'Rabat ilościowy (%)','Selling price per item (£)':'Cena sprzedaży za sztukę (£)',
 'Calculate Costs & Price':'Oblicz koszty i cenę','Results':'Wyniki','Single Print':'Pojedynczy wydruk','Batch Pricing':'Wycena zbiorcza',
 'Total Cost to Make':'Łączny koszt wykonania','Selling Price':'Cena sprzedaży',
 'Quick Price Buttons (target margin)':'Szybkie przyciski ceny (docelowa marża)',
 'Custom target margin (%)':'Własna docelowa marża (%)','Batch Cost to Make':'Koszt wykonania partii',
 'Batch Sales':'Sprzedaż partii','Batch Profit':'Zysk z partii',
 'Know what it costs.':'Wiesz, ile to kosztuje.','Know what to charge.':'Wiesz, ile naliczyć.',
 'Accurate 3D printing cost and pricing calculations to help you price with confidence and maximise your profit.':'Dokładne kalkulacje kosztów i cen druku 3D, które pomagają ustalać ceny i zwiększać zysk.',
 'Print Smarter.':'Drukuj mądrzej.','Price Better.':'Ustalaj lepsze ceny.','Profit More.':'Zarabiaj więcej.'
};
Object.assign(tx,extraTx);
const reverse={};
Object.keys(tx).forEach(k=>reverse[tx[k]]=k);

function load(){
 try{return Object.assign({},defaults,JSON.parse(localStorage.getItem(KEY)||'{}'));}
 catch(e){return Object.assign({},defaults);}
}
let pref=load();
let draft=Object.assign({},pref);

function save(){try{localStorage.setItem(KEY,JSON.stringify(pref));}catch(e){}}
function tr(v){return pref.language==='pl'?(tx[v]||v):(reverse[v]||v);}

const originalText=new WeakMap();
const baseMoneyText=new WeakMap();
const baseMoneyInput=new WeakMap();
const baseLabel=new WeakMap();

function translatePage(){
 document.documentElement.lang=pref.language==='pl'?'pl':'en';
 const w=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);
 let n;
 while(n=w.nextNode()){
  if(!n.parentElement||n.parentElement.closest('script,style'))continue;
  const raw=n.nodeValue.trim();
  if(!raw)continue;
  if(!originalText.has(n))originalText.set(n,raw);
  const target=tr(originalText.get(n));
  if(n.nodeValue!==target)n.nodeValue=n.nodeValue.replace(raw,target);
 }
}

function setTheme(){
 document.body.dataset.ppTheme=pref.dark?'dark':'light';
 let s=document.getElementById('ppPreferenceTheme');
 if(!s){s=document.createElement('style');s.id='ppPreferenceTheme';document.head.appendChild(s);}
 s.textContent=
 'body[data-pp-theme="light"]{background:#eef3f5!important;color:#17242c!important}'+
 'body[data-pp-theme="light"] #ppCleanTop{background:#e9f0f3!important;color:#17242c!important}'+
 'body[data-pp-theme="light"] #ppCleanTop .pp-top-nav{background:#f4f7f8!important;border-color:#c5d3da!important}'+
 'body[data-pp-theme="light"] #ppCleanTop .pp-top-links button{color:#23333c!important}'+
 'body[data-pp-theme="light"] .panel,body[data-pp-theme="light"] .pp-master-quickcards button{background:linear-gradient(180deg,#fff,#edf3f5)!important;color:#17242c!important}'+
 'body[data-pp-theme="light"] input,body[data-pp-theme="light"] select,body[data-pp-theme="light"] textarea{background:#fff!important;color:#17242c!important;border-color:#c5d3da!important}';
}

function labelFor(id){
 return document.getElementById(id)?.parentElement?.querySelector('label')||document.querySelector('label[for="'+id+'"]');
}

function applyUnits(){
 const type=document.getElementById('materialType')?.value==='resin'?'resin':'filament';
 const imp=pref.units==='imperial';
 unitFields.forEach(id=>{
  const src=document.getElementById(id);
  if(!src)return;
  let p=document.getElementById('ppUnit_'+id);
  if(imp){
   if(!p){
    p=document.createElement('input');
    p.id='ppUnit_'+id;p.type='number';p.min='0';
    p.step=id==='materialPack'?'1':'0.01';p.className='ppPreferenceInput';
    src.insertAdjacentElement('afterend',p);src.style.display='none';
    p.addEventListener('input',()=>{
     const v=Number(p.value)||0;
     src.value=String(type==='resin'?v*29.5735295625:v*28.349523125);
     src.dispatchEvent(new Event('input',{bubbles:true}));
    });
   }
   p.value=(type==='resin'?Number(src.value||0)/29.5735295625:Number(src.value||0)/28.349523125).toFixed(id==='materialPack'?0:2);
  }else{
   if(p){p.remove();src.style.display='';}
  }
 });
 const l1=labelFor('materialPack'),l2=labelFor('materialUsed');
 if(l1)l1.textContent=imp?'Spool weight (oz)':type==='resin'?'Bottle volume (ml)':'Spool weight (g)';
 if(l2)l2.textContent=imp?(type==='resin'?'Used per print (fl oz)':'Used per print (oz)'):(type==='resin'?'Used per print (ml)':'Used per print (g)');
}

function currency(){
 const meta=currencies[pref.currency]||currencies.GBP;
 const rate=Number(pref.rate)>0?Number(pref.rate):1;
 moneyFields.forEach(id=>{
  const src=document.getElementById(id);if(!src)return;
  let p=document.getElementById('ppCur_'+id);
  if(pref.currency==='GBP'){
   if(p){p.remove();src.style.display='';}
  }else{
   if(!p){
    p=document.createElement('input');p.id='ppCur_'+id;p.type='number';p.min='0';
    p.step=src.step||'0.01';p.className='ppPreferenceInput';
    src.insertAdjacentElement('afterend',p);src.style.display='none';
    p.addEventListener('input',()=>{
     src.value=String((Number(p.value)||0)/rate);
     src.dispatchEvent(new Event('input',{bubbles:true}));
    });
   }
   p.value=(Number(src.value||0)*rate).toFixed(2);
  }
 });
 const w=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);
 let n;
 while(n=w.nextNode()){
  if(!n.parentElement||n.parentElement.closest('script,style,#ppSettingsPanel'))continue;
  let s=n.nodeValue;
  const m=s.match(/[£€$zł]\s*(-?[0-9][0-9,]*(?:\.[0-9]+)?)/);
  if(m&&m[0].startsWith('£'))baseMoneyText.set(n,Number(m[1].replace(/,/g,'')));
  const base=baseMoneyText.get(n);
  if(base===undefined)continue;
  if(/[£€$zł]/.test(s)){
   n.nodeValue=s.replace(/[£€$zł]\s*-?[0-9][0-9,]*(?:\.[0-9]+)?/,
    new Intl.NumberFormat(meta.locale,{style:'currency',currency:pref.currency,minimumFractionDigits:2,maximumFractionDigits:2}).format(base*rate));
  }
 }
 document.querySelectorAll('input[readonly]').forEach(el=>{
  const s=el.value||'',m=s.match(/£\s*(-?[0-9][0-9,]*(?:\.[0-9]+)?)/);
  if(m)baseMoneyInput.set(el,Number(m[1].replace(/,/g,'')));
  const b=baseMoneyInput.get(el);
  if(b!==undefined)el.value=new Intl.NumberFormat(meta.locale,{style:'currency',currency:pref.currency,minimumFractionDigits:2,maximumFractionDigits:2}).format(b*rate);
 });
 document.querySelectorAll('label').forEach(el=>{
  if(!baseLabel.has(el))baseLabel.set(el,el.textContent);
  const b=baseLabel.get(el);
  if(/[£€$zł]/.test(b))el.textContent=tr(b.replace(/[£€$zł]/g,'£')).replace(/£/g,meta.symbol);
 });
}

function ensureApplyButton(){
 const body=document.querySelector('#ppSettingsPanel .pp-settings-body');
 if(!body)return null;
 let btn=document.getElementById('ppSettingsApply');
 if(btn){
  if(btn.dataset.ppBound!=='1'){
   btn.dataset.ppBound='1';
   btn.onclick=()=>window.__applyPrintProfitSettings?.();
  }
  return btn;
 }
 const reset=document.getElementById('ppSettingsReset');
 btn=document.createElement('button');
 btn.type='button';btn.id='ppSettingsApply';btn.className='pp-settings-apply';
 btn.textContent=tr('Apply Changes');
 btn.style.cssText='display:block;width:100%;margin:8px 0 4px;padding:12px 16px;border:1px solid #ff7800;border-radius:10px;background:#ff7800;color:#fff;font:800 12px Inter,Segoe UI,system-ui,sans-serif;cursor:pointer;box-shadow:0 8px 24px #ff780022;';
 if(reset&&reset.parentElement)reset.parentElement.insertAdjacentElement('afterend',btn);else body.appendChild(btn);
 btn.onclick=()=>window.__applyPrintProfitSettings?.();
 return btn;
}

function refreshDraftControls(){
 const dark=document.getElementById('ppSettingsDark'),lang=document.getElementById('ppSettingsLanguage'),units=document.getElementById('ppSettingsUnits'),cur=document.getElementById('ppSettingsCurrency'),rate=document.getElementById('ppSettingsRate');
 if(dark)dark.checked=!!draft.dark;
 if(lang)lang.value=draft.language;
 if(units)units.value=draft.units;
 if(cur)cur.value=draft.currency;
 if(rate)rate.value=String(draft.rate);
}

function applyDraft(){
 const dark=document.getElementById('ppSettingsDark'),lang=document.getElementById('ppSettingsLanguage'),units=document.getElementById('ppSettingsUnits'),cur=document.getElementById('ppSettingsCurrency'),rate=document.getElementById('ppSettingsRate');
 draft.dark=!!dark?.checked;
 draft.language=lang?.value||'en';
 draft.units=units?.value||'metric';
 draft.currency=cur?.value||'GBP';
 const entered=Number(rate?.value);
 draft.rate=entered>0?entered:(currencies[draft.currency]?.rate||1);
 pref=Object.assign({},draft);
 save();
 setTheme();
 translatePage();
 applyUnits();
 currency();
 const b=document.getElementById('ppSettingsApply');
 if(b){b.textContent=tr('Apply Changes');b.style.transform='scale(.98)';setTimeout(()=>b.style.transform='',120);}
}
window.__applyPrintProfitSettings=applyDraft;
document.addEventListener('printprofit-settings-apply',applyDraft);

function bind(){
 const dark=document.getElementById('ppSettingsDark'),lang=document.getElementById('ppSettingsLanguage'),units=document.getElementById('ppSettingsUnits'),cur=document.getElementById('ppSettingsCurrency'),rate=document.getElementById('ppSettingsRate');
 if(!dark||!lang||!units||!cur||!rate)return;
 ensureApplyButton();

 if(dark.dataset.ppBound!=='1'){dark.dataset.ppBound='1';dark.addEventListener('change',()=>{draft.dark=dark.checked;});}
 if(lang.dataset.ppBound!=='1'){lang.dataset.ppBound='1';lang.addEventListener('change',()=>{draft.language=lang.value;});}
 if(units.dataset.ppBound!=='1'){units.dataset.ppBound='1';units.addEventListener('change',()=>{draft.units=units.value;});}
 if(cur.dataset.ppBound!=='1'){cur.dataset.ppBound='1';cur.addEventListener('change',()=>{draft.currency=cur.value;draft.rate=currencies[draft.currency]?.rate||1;if(rate)rate.value=String(draft.rate);});}
 if(rate.dataset.ppBound!=='1'){rate.dataset.ppBound='1';rate.addEventListener('input',()=>{const v=Number(rate.value);if(v>0)draft.rate=v;});}
}

function boot(){
 bind();setTheme();translatePage();applyUnits();currency();
 document.addEventListener('printprofit-settings-open',()=>{
 draft=Object.assign({},pref);
 refreshDraftControls();
 bind();
 setTheme();
 translatePage();
 applyUnits();
 currency();
});
 let translateTimer=0;
function scheduleTranslate(){
 if(translateTimer)return;
 translateTimer=setTimeout(()=>{translateTimer=0;translatePage();},80);
}
/* Calculator results are formatted by the core calculator using the saved
   preference. Do not continuously rewrite them here: doing so causes a visible
   GBP -> selected-currency flicker every time the calculator recalculates. */
const observer=new MutationObserver(()=>{
 scheduleTranslate();
 // Settings UI can be rebuilt by the host; keep Apply Changes attached.
 if(document.getElementById('ppSettingsPanel')) ensureApplyButton();
});
observer.observe(document.body,{subtree:true,childList:true,characterData:true});
setInterval(()=>{bind();scheduleTranslate();ensureApplyButton();},1000);
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();