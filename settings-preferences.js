(()=>{
'use strict';
if(window.__printProfitPreferencesV2)return; window.__printProfitPreferencesV2=true;
const KEY='printprofit.preferences.v2';
const defaults={dark:true,language:'en',units:'metric',currency:'GBP',rate:1};
const currencies={
 GBP:{symbol:'£',locale:'en-GB',rate:1},
 EUR:{symbol:'€',locale:'de-DE',rate:1.1663},
 USD:{symbol:'
const moneyFields=['materialPackCost','labourRate','pack','other','electricityRate','fixedFee','delivery','deliveryCharge','sell'];
const unitFields=['materialPack','materialUsed'];
const tx={
'Settings':'Ustawienia','Manage the calculator display and preferences.':'Zarządzaj wyglądem kalkulatora i preferencjami.',
'Appearance':'Wygląd','Dark mode':'Tryb ciemny','Use the dark PrintProfit interface.':'Użyj ciemnego interfejsu PrintProfit.',
'Language':'Język','Choose the language used across the page.':'Wybierz język używany na całej stronie.',
'Units':'Jednostki','Choose metric or imperial measurements.':'Wybierz jednostki metryczne lub imperialne.',
'Currency':'Waluta','Choose the currency used for costs and prices.':'Wybierz walutę używaną dla kosztów i cen.',
'Exchange rate':'Kurs wymiany','Update the conversion used when displaying non-GBP currencies.':'Aktualizuj przelicznik używany do wyświetlania walut innych niż GBP.',
'Calculator reset':'Reset kalkulatora','Clear the current calculator inputs and return pricing to £0.':'Wyczyść dane kalkulatora i ustaw ceny z powrotem na 0.',
'Reset Calculator':'Resetuj kalkulator','Preferences are saved automatically on this device.':'Preferencje są zapisywane automatycznie na tym urządzeniu.',
'Calculate':'Kalkuluj','Price':'Cena','Profit':'Zysk','Settings':'Ustawienia',
'3D PRINTING PRICING, MADE SIMPLE':'CENY DRUKU 3D, PROSTO I PRZEJRZYŚCIE',
'Know what it costs.':'Wiesz, ile to kosztuje.','Know what to charge.':'Wiesz, ile naliczyć.',
'Start Calculating':'Rozpocznij kalkulację','Learn More':'Dowiedz się więcej',
'1. G-code File':'1. Plik G-code','Upload your sliced file to auto-fill print time and filament usage.':'Wgraj pocięty plik, aby automatycznie uzupełnić czas druku i zużycie materiału.',
'Choose File':'Wybierz plik','Clear':'Wyczyść','No G-code selected':'Nie wybrano pliku G-code',
'2. Printer Profile':'2. Profil drukarki','Select your printer or use a custom profile.':'Wybierz drukarkę lub użyj własnego profilu.',
'3. Filament / Resin Profile':'3. Profil filamentu / żywicy','Material type':'Rodzaj materiału','Material':'Materiał',
'Calculated material cost (£)':'Obliczony koszt materiału','Print time (hours)':'Czas druku',
'4. Operating Costs':'4. Koszty operacyjne','Additional Costs':'Dodatkowe koszty','Electricity':'Prąd',
'Electricity provider / tariff':'Dostawca prądu / taryfa','Estimated printer power':'Szacowana moc drukarki',
'Estimated electricity cost':'Szacowany koszt prądu','5. Selling & Fulfilment':'5. Sprzedaż i realizacja',
'Platform':'Platforma','Delivery':'Dostawa','6. Quantity / Batch Pricing':'6. Ilość / wycena zbiorcza',
'Quantity':'Ilość','Batch discount (%)':'Rabat ilościowy (%)','Selling price per item (£)':'Cena sprzedaży za sztukę (£)',
'Calculate Costs & Price':'Oblicz koszty i cenę','Results':'Wyniki','Single Print':'Pojedynczy wydruk','Batch Pricing':'Wycena zbiorcza',
'Total Cost to Make':'Łączny koszt wykonania','Selling Price':'Cena sprzedaży','Quick Price Buttons (target margin)':'Szybkie przyciski ceny (docelowa marża)',
'Custom target margin (%)':'Własna docelowa marża (%)','Batch Cost to Make':'Koszt partii','Batch Sales':'Sprzedaż partii','Batch Profit':'Zysk z partii'
};
const extraTx={
 de:{
  'Settings':'Einstellungen','Manage the calculator display and preferences.':'Verwalten Sie die Anzeige und Einstellungen des Rechners.',
  'Appearance':'Darstellung','Dark mode':'Dunkler Modus','Use the dark PrintProfit interface.':'Dunkle PrintProfit-Oberfläche verwenden.',
  'Language':'Sprache','Choose the language used across the page.':'Sprache der gesamten Seite auswählen.',
  'Units':'Einheiten','Choose metric or imperial measurements.':'Metrische oder imperiale Einheiten auswählen.',
  'Currency':'Währung','Choose the currency used for costs and prices.':'Währung für Kosten und Preise auswählen.',
  'Exchange rate':'Wechselkurs','Update the conversion used when displaying non-GBP currencies.':'Umrechnung für andere Währungen aktualisieren.',
  'Calculator reset':'Rechner zurücksetzen','Reset Calculator':'Rechner zurücksetzen','Calculate':'Berechnen','Price':'Preis','Profit':'Gewinn',
  'Guide & Help':'Anleitung & Hilfe','Start Calculating':'Berechnung starten','Know what it costs.':'Wissen, was es kostet.','Know what to charge.':'Wissen, was Sie berechnen sollten.'
 },
 fr:{
  'Settings':'Paramètres','Manage the calculator display and preferences.':"Gérez l'affichage et les préférences du calculateur.",
  'Appearance':'Apparence','Dark mode':'Mode sombre','Use the dark PrintProfit interface.':'Utiliser l’interface sombre de PrintProfit.',
  'Language':'Langue','Choose the language used across the page.':'Choisissez la langue utilisée sur la page.',
  'Units':'Unités','Choose metric or imperial measurements.':'Choisissez les unités métriques ou impériales.',
  'Currency':'Devise','Choose the currency used for costs and prices.':'Choisissez la devise utilisée pour les coûts et les prix.',
  'Exchange rate':'Taux de change','Update the conversion used when displaying non-GBP currencies.':'Mettez à jour le taux utilisé pour les devises hors GBP.',
  'Calculator reset':'Réinitialisation du calculateur','Reset Calculator':'Réinitialiser le calculateur','Calculate':'Calculer','Price':'Prix','Profit':'Bénéfice',
  'Guide & Help':'Guide et aide','Start Calculating':'Commencer le calcul','Know what it costs.':'Sachez ce que cela coûte.','Know what to charge.':'Sachez quel prix facturer.'
 },
 es:{
  'Settings':'Ajustes','Manage the calculator display and preferences.':'Gestiona la pantalla y las preferencias de la calculadora.',
  'Appearance':'Apariencia','Dark mode':'Modo oscuro','Use the dark PrintProfit interface.':'Usar la interfaz oscura de PrintProfit.',
  'Language':'Idioma','Choose the language used across the page.':'Elige el idioma utilizado en la página.',
  'Units':'Unidades','Choose metric or imperial measurements.':'Elige unidades métricas o imperiales.',
  'Currency':'Moneda','Choose the currency used for costs and prices.':'Elige la moneda utilizada para costes y precios.',
  'Exchange rate':'Tipo de cambio','Update the conversion used when displaying non-GBP currencies.':'Actualiza la conversión utilizada para monedas distintas de GBP.',
  'Calculator reset':'Restablecer calculadora','Reset Calculator':'Restablecer calculadora','Calculate':'Calcular','Price':'Precio','Profit':'Beneficio',
  'Guide & Help':'Guía y ayuda','Start Calculating':'Empezar a calcular','Know what it costs.':'Saber cuánto cuesta.','Know what to charge.':'Saber cuánto cobrar.'
 },
 it:{
  'Settings':'Impostazioni','Manage the calculator display and preferences.':'Gestisci la visualizzazione e le preferenze della calcolatrice.',
  'Appearance':'Aspetto','Dark mode':'Modalità scura','Use the dark PrintProfit interface.':'Usa l’interfaccia scura di PrintProfit.',
  'Language':'Lingua','Choose the language used across the page.':'Scegli la lingua utilizzata nella pagina.',
  'Units':'Unità','Choose metric or imperial measurements.':'Scegli unità metriche o imperiali.',
  'Currency':'Valuta','Choose the currency used for costs and prices.':'Scegli la valuta utilizzata per costi e prezzi.',
  'Exchange rate':'Tasso di cambio','Update the conversion used when displaying non-GBP currencies.':'Aggiorna il tasso usato per le valute diverse da GBP.',
  'Calculator reset':'Ripristino calcolatrice','Reset Calculator':'Ripristina calcolatrice','Calculate':'Calcola','Price':'Prezzo','Profit':'Profitto',
  'Guide & Help':'Guida e aiuto','Start Calculating':'Inizia a calcolare','Know what it costs.':'Sapere quanto costa.','Know what to charge.':'Sapere quanto addebitare.'
 },
 nl:{
  'Settings':'Instellingen','Manage the calculator display and preferences.':'Beheer de weergave en voorkeuren van de calculator.',
  'Appearance':'Weergave','Dark mode':'Donkere modus','Use the dark PrintProfit interface.':'Gebruik de donkere PrintProfit-interface.',
  'Language':'Taal','Choose the language used across the page.':'Kies de taal voor de hele pagina.',
  'Units':'Eenheden','Choose metric or imperial measurements.':'Kies metrische of imperiale eenheden.',
  'Currency':'Valuta','Choose the currency used for costs and prices.':'Kies de valuta voor kosten en prijzen.',
  'Exchange rate':'Wisselkoers','Update the conversion used when displaying non-GBP currencies.':'Werk de conversie voor andere valuta bij.',
  'Calculator reset':'Calculator resetten','Reset Calculator':'Calculator resetten','Calculate':'Berekenen','Price':'Prijs','Profit':'Winst',
  'Guide & Help':'Handleiding & hulp','Start Calculating':'Start met berekenen','Know what it costs.':'Weet wat het kost.','Know what to charge.':'Weet wat je moet rekenen.'
 },
 pt:{
  'Settings':'Definições','Manage the calculator display and preferences.':'Gerir a apresentação e as preferências da calculadora.',
  'Appearance':'Aparência','Dark mode':'Modo escuro','Use the dark PrintProfit interface.':'Usar a interface escura do PrintProfit.',
  'Language':'Idioma','Choose the language used across the page.':'Escolha o idioma utilizado na página.',
  'Units':'Unidades','Choose metric or imperial measurements.':'Escolha unidades métricas ou imperiais.',
  'Currency':'Moeda','Choose the currency used for costs and prices.':'Escolha a moeda usada para custos e preços.',
  'Exchange rate':'Taxa de câmbio','Update the conversion used when displaying non-GBP currencies.':'Atualize a conversão usada para moedas que não sejam GBP.',
  'Calculator reset':'Repor calculadora','Reset Calculator':'Repor calculadora','Calculate':'Calcular','Price':'Preço','Profit':'Lucro',
  'Guide & Help':'Guia e ajuda','Start Calculating':'Começar cálculo','Know what it costs.':'Saber quanto custa.','Know what to charge.':'Saber quanto cobrar.'
 },
 cs:{
  'Settings':'Nastavení','Manage the calculator display and preferences.':'Spravujte zobrazení a předvolby kalkulačky.',
  'Appearance':'Vzhled','Dark mode':'Tmavý režim','Use the dark PrintProfit interface.':'Použít tmavé rozhraní PrintProfit.',
  'Language':'Jazyk','Choose the language used across the page.':'Zvolte jazyk používaný na stránce.',
  'Units':'Jednotky','Choose metric or imperial measurements.':'Zvolte metrické nebo imperiální jednotky.',
  'Currency':'Měna','Choose the currency used for costs and prices.':'Zvolte měnu pro náklady a ceny.',
  'Exchange rate':'Směnný kurz','Update the conversion used when displaying non-GBP currencies.':'Aktualizujte převod pro jiné měny než GBP.',
  'Calculator reset':'Reset kalkulačky','Reset Calculator':'Resetovat kalkulačku','Calculate':'Spočítat','Price':'Cena','Profit':'Zisk',
  'Guide & Help':'Průvodce a nápověda','Start Calculating':'Začít počítat','Know what it costs.':'Zjistěte, kolik to stojí.','Know what to charge.':'Zjistěte, kolik účtovat.'
 },
 sv:{
  'Settings':'Inställningar','Manage the calculator display and preferences.':'Hantera kalkylatorns visning och inställningar.',
  'Appearance':'Utseende','Dark mode':'Mörkt läge','Use the dark PrintProfit interface.':'Använd PrintProfits mörka gränssnitt.',
  'Language':'Språk','Choose the language used across the page.':'Välj språk för sidan.',
  'Units':'Enheter','Choose metric or imperial measurements.':'Välj metriska eller imperiala enheter.',
  'Currency':'Valuta','Choose the currency used for costs and prices.':'Välj valuta för kostnader och priser.',
  'Exchange rate':'Växelkurs','Update the conversion used when displaying non-GBP currencies.':'Uppdatera omräkningen för andra valutor än GBP.',
  'Calculator reset':'Återställ kalkylator','Reset Calculator':'Återställ kalkylator','Calculate':'Beräkna','Price':'Pris','Profit':'Vinst',
  'Guide & Help':'Guide och hjälp','Start Calculating':'Börja beräkna','Know what it costs.':'Vet vad det kostar.','Know what to charge.':'Vet vad du ska ta betalt.'
 },
 da:{
  'Settings':'Indstillinger','Manage the calculator display and preferences.':'Administrer lommeregnerens visning og indstillinger.',
  'Appearance':'Udseende','Dark mode':'Mørk tilstand','Use the dark PrintProfit interface.':'Brug PrintProfits mørke grænseflade.',
  'Language':'Sprog','Choose the language used across the page.':'Vælg sproget på siden.',
  'Units':'Enheder','Choose metric or imperial measurements.':'Vælg metriske eller imperiale enheder.',
  'Currency':'Valuta','Choose the currency used for costs and prices.':'Vælg valuta for omkostninger og priser.',
  'Exchange rate':'Valutakurs','Update the conversion used when displaying non-GBP currencies.':'Opdater omregningen for andre valutaer end GBP.',
  'Calculator reset':'Nulstil lommeregner','Reset Calculator':'Nulstil lommeregner','Calculate':'Beregn','Price':'Pris','Profit':'Fortjeneste',
  'Guide & Help':'Guide og hjælp','Start Calculating':'Start beregning','Know what it costs.':'Vide hvad det koster.','Know what to charge.':'Vide hvad der skal opkræves.'
 }
};
const reverse={}; Object.keys(tx).forEach(k=>reverse[tx[k]]=k);
let pref=load();
const originalText=new WeakMap(), baseMoneyText=new WeakMap(), baseMoneyInput=new WeakMap(), baseLabel=new WeakMap();
function load(){try{return Object.assign({},defaults,JSON.parse(localStorage.getItem(KEY)||'{}'));}catch(e){return Object.assign({},defaults);}}
function save(){try{localStorage.setItem(KEY,JSON.stringify(pref));}catch(e){}}
function tr(v){
 if(pref.language==='pl')return tx[v]||v;
 const dict=extraTx[pref.language];
 return (dict&&dict[v])||reverse[v]||v;
}
function translatePage(){
 document.documentElement.lang=pref.language==='pl'?'pl':'en';
 const w=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT); let n;
 while(n=w.nextNode()){if(!n.parentElement||n.parentElement.closest('script,style'))continue; const raw=n.nodeValue.trim(); if(!raw)continue; if(!originalText.has(n))originalText.set(n,raw); const target=tr(originalText.get(n)); if(n.nodeValue!==target)n.nodeValue=n.nodeValue.replace(raw,target);}
}
function setTheme(){
 document.body.dataset.ppTheme=pref.dark?'dark':'light';
 let s=document.getElementById('ppPreferenceTheme'); if(!s){s=document.createElement('style');s.id='ppPreferenceTheme';document.head.appendChild(s);}
 s.textContent='body[data-pp-theme="light"]{background:#eef3f5!important;color:#17242c!important}'+
'body[data-pp-theme="light"] #ppCleanTop{background:#e9f0f3!important;color:#17242c!important}'+
'body[data-pp-theme="light"] #ppCleanTop .pp-top-nav{background:#f4f7f8!important;border-color:#c5d3da!important}'+
'body[data-pp-theme="light"] #ppCleanTop .pp-top-links button{color:#23333c!important}'+
'body[data-pp-theme="light"] .panel,body[data-pp-theme="light"] .pp-master-quickcards button{background:linear-gradient(180deg,#fff,#edf3f5)!important;color:#17242c!important}'+
'body[data-pp-theme="light"] input,body[data-pp-theme="light"] select,body[data-pp-theme="light"] textarea{background:#fff!important;color:#17242c!important;border-color:#c5d3da!important}';
}
function labelFor(id){return document.getElementById(id)?.parentElement?.querySelector('label')||document.querySelector('label[for="'+id+'"]');}
function applyUnits(){
 const type=document.getElementById('materialType')?.value==='resin'?'resin':'filament'; const imp=pref.units==='imperial';
 unitFields.forEach(id=>{const src=document.getElementById(id);if(!src)return; let p=document.getElementById('ppUnit_'+id);
  if(imp){if(!p){p=document.createElement('input');p.id='ppUnit_'+id;p.type='number';p.min='0';p.step=id==='materialPack'?'1':'0.01';p.className='ppPreferenceInput';src.insertAdjacentElement('afterend',p);src.style.display='none';p.addEventListener('input',()=>{const v=Number(p.value)||0;src.value=String(type==='resin'?v*29.5735295625:v*28.349523125);src.dispatchEvent(new Event('input',{bubbles:true}));});}
   p.value=(type==='resin'?Number(src.value||0)/29.5735295625:Number(src.value||0)/28.349523125).toFixed(id==='materialPack'?0:2);
  }else{if(p){p.remove();src.style.display='';}}
 });
 const l1=labelFor('materialPack'),l2=labelFor('materialUsed');
 if(l1)l1.textContent=imp?'Spool weight (oz)':type==='resin'?'Bottle volume (ml)':'Spool weight (g)';
 if(l2)l2.textContent=imp?(type==='resin'?'Used per print (fl oz)':'Used per print (oz)'):(type==='resin'?'Used per print (ml)':'Used per print (g)');
}
function currency(){
 const meta=currencies[pref.currency]||currencies.GBP,rate=Number(pref.rate)>0?Number(pref.rate):1;
 moneyFields.forEach(id=>{const src=document.getElementById(id);if(!src)return; let p=document.getElementById('ppCur_'+id);
  if(pref.currency==='GBP'){if(p){p.remove();src.style.display='';}}
  else{if(!p){p=document.createElement('input');p.id='ppCur_'+id;p.type='number';p.min='0';p.step=src.step||'0.01';p.className='ppPreferenceInput';src.insertAdjacentElement('afterend',p);src.style.display='none';p.addEventListener('input',()=>{src.value=String((Number(p.value)||0)/rate);src.dispatchEvent(new Event('input',{bubbles:true}));});} p.value=(Number(src.value||0)*rate).toFixed(2);}
 });
 const w=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT); let n;
 while(n=w.nextNode()){if(!n.parentElement||n.parentElement.closest('script,style,#ppSettingsPanel'))continue; let s=n.nodeValue; const m=s.match(/[£€$zł]\s*(-?[0-9][0-9,]*(?:\.[0-9]+)?)/); if(m&&m[0].startsWith('£'))baseMoneyText.set(n,Number(m[1].replace(/,/g,''))); const base=baseMoneyText.get(n); if(base===undefined)continue; if(/[£€$zł]/.test(s))n.nodeValue=s.replace(/[£€$zł]\s*-?[0-9][0-9,]*(?:\.[0-9]+)?/,new Intl.NumberFormat(meta.locale,{style:'currency',currency:pref.currency,minimumFractionDigits:2,maximumFractionDigits:2}).format(base*rate));}
 document.querySelectorAll('input[readonly]').forEach(el=>{const s=el.value||'',m=s.match(/£\s*(-?[0-9][0-9,]*(?:\.[0-9]+)?)/);if(m)baseMoneyInput.set(el,Number(m[1].replace(/,/g,'')));const b=baseMoneyInput.get(el);if(b!==undefined)el.value=new Intl.NumberFormat(meta.locale,{style:'currency',currency:pref.currency,minimumFractionDigits:2,maximumFractionDigits:2}).format(b*rate);});
 document.querySelectorAll('label').forEach(el=>{if(!baseLabel.has(el))baseLabel.set(el,el.textContent);const b=baseLabel.get(el);if(/[£€$zł]/.test(b))el.textContent=tr(b.replace(/[£€$zł]/g,'£')).replace(/£/g,meta.symbol);});
}
function bind(){
 const dark=document.getElementById('ppSettingsDark'),lang=document.getElementById('ppSettingsLanguage'),units=document.getElementById('ppSettingsUnits'),cur=document.getElementById('ppSettingsCurrency'),rate=document.getElementById('ppSettingsRate');
 if(dark){dark.checked=pref.dark;if(dark.dataset.ppBound!=='1'){dark.dataset.ppBound='1';dark.addEventListener('change',()=>{pref.dark=dark.checked;save();setTheme();});}}
 if(lang){lang.value=pref.language;if(lang.dataset.ppBound!=='1'){lang.dataset.ppBound='1';lang.addEventListener('change',()=>{pref.language=lang.value;save();translatePage();applyUnits();currency();});}}
 if(units){units.value=pref.units;if(units.dataset.ppBound!=='1'){units.dataset.ppBound='1';units.addEventListener('change',()=>{pref.units=units.value;save();applyUnits();});}}
 if(cur){cur.value=pref.currency;if(cur.dataset.ppBound!=='1'){cur.dataset.ppBound='1';cur.addEventListener('change',()=>{pref.currency=cur.value;pref.rate=currencies[pref.currency].rate;if(rate)rate.value=String(pref.rate);save();currency();});}}
 if(rate){rate.value=String(pref.rate);if(rate.dataset.ppBound!=='1'){rate.dataset.ppBound='1';rate.addEventListener('input',()=>{const v=Number(rate.value);if(v>0){pref.rate=v;save();currency();}});}}
}
function boot(){
 bind();
 setTheme();
 translatePage();
 applyUnits();
 currency();
 document.addEventListener('printprofit-settings-open',()=>{bind();translatePage();setTheme();applyUnits();currency();});
 document.addEventListener('click',event=>{
   const trigger=event.target&&event.target.closest?event.target.closest('#ppCleanTop [data-target="settings"]'):null;
   if(trigger)setTimeout(()=>{bind();translatePage();setTheme();},0);
 });
 setInterval(()=>{bind();applyUnits();currency();},1200);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();,locale:'en-US',rate:1.3370},
 PLN:{symbol:'zł',locale:'pl-PL',rate:5.0892},
 CAD:{symbol:'CA
const moneyFields=['materialPackCost','labourRate','pack','other','electricityRate','fixedFee','delivery','deliveryCharge','sell'];
const unitFields=['materialPack','materialUsed'];
const tx={
'Settings':'Ustawienia','Manage the calculator display and preferences.':'Zarządzaj wyglądem kalkulatora i preferencjami.',
'Appearance':'Wygląd','Dark mode':'Tryb ciemny','Use the dark PrintProfit interface.':'Użyj ciemnego interfejsu PrintProfit.',
'Language':'Język','Choose the language used across the page.':'Wybierz język używany na całej stronie.',
'Units':'Jednostki','Choose metric or imperial measurements.':'Wybierz jednostki metryczne lub imperialne.',
'Currency':'Waluta','Choose the currency used for costs and prices.':'Wybierz walutę używaną dla kosztów i cen.',
'Exchange rate':'Kurs wymiany','Update the conversion used when displaying non-GBP currencies.':'Aktualizuj przelicznik używany do wyświetlania walut innych niż GBP.',
'Calculator reset':'Reset kalkulatora','Clear the current calculator inputs and return pricing to £0.':'Wyczyść dane kalkulatora i ustaw ceny z powrotem na 0.',
'Reset Calculator':'Resetuj kalkulator','Preferences are saved automatically on this device.':'Preferencje są zapisywane automatycznie na tym urządzeniu.',
'Calculate':'Kalkuluj','Price':'Cena','Profit':'Zysk','Settings':'Ustawienia',
'3D PRINTING PRICING, MADE SIMPLE':'CENY DRUKU 3D, PROSTO I PRZEJRZYŚCIE',
'Know what it costs.':'Wiesz, ile to kosztuje.','Know what to charge.':'Wiesz, ile naliczyć.',
'Start Calculating':'Rozpocznij kalkulację','Learn More':'Dowiedz się więcej',
'1. G-code File':'1. Plik G-code','Upload your sliced file to auto-fill print time and filament usage.':'Wgraj pocięty plik, aby automatycznie uzupełnić czas druku i zużycie materiału.',
'Choose File':'Wybierz plik','Clear':'Wyczyść','No G-code selected':'Nie wybrano pliku G-code',
'2. Printer Profile':'2. Profil drukarki','Select your printer or use a custom profile.':'Wybierz drukarkę lub użyj własnego profilu.',
'3. Filament / Resin Profile':'3. Profil filamentu / żywicy','Material type':'Rodzaj materiału','Material':'Materiał',
'Calculated material cost (£)':'Obliczony koszt materiału','Print time (hours)':'Czas druku',
'4. Operating Costs':'4. Koszty operacyjne','Additional Costs':'Dodatkowe koszty','Electricity':'Prąd',
'Electricity provider / tariff':'Dostawca prądu / taryfa','Estimated printer power':'Szacowana moc drukarki',
'Estimated electricity cost':'Szacowany koszt prądu','5. Selling & Fulfilment':'5. Sprzedaż i realizacja',
'Platform':'Platforma','Delivery':'Dostawa','6. Quantity / Batch Pricing':'6. Ilość / wycena zbiorcza',
'Quantity':'Ilość','Batch discount (%)':'Rabat ilościowy (%)','Selling price per item (£)':'Cena sprzedaży za sztukę (£)',
'Calculate Costs & Price':'Oblicz koszty i cenę','Results':'Wyniki','Single Print':'Pojedynczy wydruk','Batch Pricing':'Wycena zbiorcza',
'Total Cost to Make':'Łączny koszt wykonania','Selling Price':'Cena sprzedaży','Quick Price Buttons (target margin)':'Szybkie przyciski ceny (docelowa marża)',
'Custom target margin (%)':'Własna docelowa marża (%)','Batch Cost to Make':'Koszt partii','Batch Sales':'Sprzedaż partii','Batch Profit':'Zysk z partii'
};
const reverse={}; Object.keys(tx).forEach(k=>reverse[tx[k]]=k);
let pref=load();
const originalText=new WeakMap(), baseMoneyText=new WeakMap(), baseMoneyInput=new WeakMap(), baseLabel=new WeakMap();
function load(){try{return Object.assign({},defaults,JSON.parse(localStorage.getItem(KEY)||'{}'));}catch(e){return Object.assign({},defaults);}}
function save(){try{localStorage.setItem(KEY,JSON.stringify(pref));}catch(e){}}
function tr(v){if(pref.language==='pl')return tx[v]||v; return reverse[v]||v;}
function translatePage(){
 document.documentElement.lang=pref.language==='pl'?'pl':'en';
 const w=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT); let n;
 while(n=w.nextNode()){if(!n.parentElement||n.parentElement.closest('script,style'))continue; const raw=n.nodeValue.trim(); if(!raw)continue; if(!originalText.has(n))originalText.set(n,raw); const target=tr(originalText.get(n)); if(n.nodeValue!==target)n.nodeValue=n.nodeValue.replace(raw,target);}
}
function setTheme(){
 document.body.dataset.ppTheme=pref.dark?'dark':'light';
 let s=document.getElementById('ppPreferenceTheme'); if(!s){s=document.createElement('style');s.id='ppPreferenceTheme';document.head.appendChild(s);}
 s.textContent='body[data-pp-theme="light"]{background:#eef3f5!important;color:#17242c!important}'+
'body[data-pp-theme="light"] #ppCleanTop{background:#e9f0f3!important;color:#17242c!important}'+
'body[data-pp-theme="light"] #ppCleanTop .pp-top-nav{background:#f4f7f8!important;border-color:#c5d3da!important}'+
'body[data-pp-theme="light"] #ppCleanTop .pp-top-links button{color:#23333c!important}'+
'body[data-pp-theme="light"] .panel,body[data-pp-theme="light"] .pp-master-quickcards button{background:linear-gradient(180deg,#fff,#edf3f5)!important;color:#17242c!important}'+
'body[data-pp-theme="light"] input,body[data-pp-theme="light"] select,body[data-pp-theme="light"] textarea{background:#fff!important;color:#17242c!important;border-color:#c5d3da!important}';
}
function labelFor(id){return document.getElementById(id)?.parentElement?.querySelector('label')||document.querySelector('label[for="'+id+'"]');}
function applyUnits(){
 const type=document.getElementById('materialType')?.value==='resin'?'resin':'filament'; const imp=pref.units==='imperial';
 unitFields.forEach(id=>{const src=document.getElementById(id);if(!src)return; let p=document.getElementById('ppUnit_'+id);
  if(imp){if(!p){p=document.createElement('input');p.id='ppUnit_'+id;p.type='number';p.min='0';p.step=id==='materialPack'?'1':'0.01';p.className='ppPreferenceInput';src.insertAdjacentElement('afterend',p);src.style.display='none';p.addEventListener('input',()=>{const v=Number(p.value)||0;src.value=String(type==='resin'?v*29.5735295625:v*28.349523125);src.dispatchEvent(new Event('input',{bubbles:true}));});}
   p.value=(type==='resin'?Number(src.value||0)/29.5735295625:Number(src.value||0)/28.349523125).toFixed(id==='materialPack'?0:2);
  }else{if(p){p.remove();src.style.display='';}}
 });
 const l1=labelFor('materialPack'),l2=labelFor('materialUsed');
 if(l1)l1.textContent=imp?'Spool weight (oz)':type==='resin'?'Bottle volume (ml)':'Spool weight (g)';
 if(l2)l2.textContent=imp?(type==='resin'?'Used per print (fl oz)':'Used per print (oz)'):(type==='resin'?'Used per print (ml)':'Used per print (g)');
}
function currency(){
 const meta=currencies[pref.currency]||currencies.GBP,rate=Number(pref.rate)>0?Number(pref.rate):1;
 moneyFields.forEach(id=>{const src=document.getElementById(id);if(!src)return; let p=document.getElementById('ppCur_'+id);
  if(pref.currency==='GBP'){if(p){p.remove();src.style.display='';}}
  else{if(!p){p=document.createElement('input');p.id='ppCur_'+id;p.type='number';p.min='0';p.step=src.step||'0.01';p.className='ppPreferenceInput';src.insertAdjacentElement('afterend',p);src.style.display='none';p.addEventListener('input',()=>{src.value=String((Number(p.value)||0)/rate);src.dispatchEvent(new Event('input',{bubbles:true}));});} p.value=(Number(src.value||0)*rate).toFixed(2);}
 });
 const w=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT); let n;
 while(n=w.nextNode()){if(!n.parentElement||n.parentElement.closest('script,style,#ppSettingsPanel'))continue; let s=n.nodeValue; const m=s.match(/[£€$zł]\s*(-?[0-9][0-9,]*(?:\.[0-9]+)?)/); if(m&&m[0].startsWith('£'))baseMoneyText.set(n,Number(m[1].replace(/,/g,''))); const base=baseMoneyText.get(n); if(base===undefined)continue; if(/[£€$zł]/.test(s))n.nodeValue=s.replace(/[£€$zł]\s*-?[0-9][0-9,]*(?:\.[0-9]+)?/,new Intl.NumberFormat(meta.locale,{style:'currency',currency:pref.currency,minimumFractionDigits:2,maximumFractionDigits:2}).format(base*rate));}
 document.querySelectorAll('input[readonly]').forEach(el=>{const s=el.value||'',m=s.match(/£\s*(-?[0-9][0-9,]*(?:\.[0-9]+)?)/);if(m)baseMoneyInput.set(el,Number(m[1].replace(/,/g,'')));const b=baseMoneyInput.get(el);if(b!==undefined)el.value=new Intl.NumberFormat(meta.locale,{style:'currency',currency:pref.currency,minimumFractionDigits:2,maximumFractionDigits:2}).format(b*rate);});
 document.querySelectorAll('label').forEach(el=>{if(!baseLabel.has(el))baseLabel.set(el,el.textContent);const b=baseLabel.get(el);if(/[£€$zł]/.test(b))el.textContent=tr(b.replace(/[£€$zł]/g,'£')).replace(/£/g,meta.symbol);});
}
function bind(){
 const dark=document.getElementById('ppSettingsDark'),lang=document.getElementById('ppSettingsLanguage'),units=document.getElementById('ppSettingsUnits'),cur=document.getElementById('ppSettingsCurrency'),rate=document.getElementById('ppSettingsRate');
 if(dark){dark.checked=pref.dark;if(dark.dataset.ppBound!=='1'){dark.dataset.ppBound='1';dark.addEventListener('change',()=>{pref.dark=dark.checked;save();setTheme();});}}
 if(lang){lang.value=pref.language;if(lang.dataset.ppBound!=='1'){lang.dataset.ppBound='1';lang.addEventListener('change',()=>{pref.language=lang.value;save();translatePage();applyUnits();currency();});}}
 if(units){units.value=pref.units;if(units.dataset.ppBound!=='1'){units.dataset.ppBound='1';units.addEventListener('change',()=>{pref.units=units.value;save();applyUnits();});}}
 if(cur){cur.value=pref.currency;if(cur.dataset.ppBound!=='1'){cur.dataset.ppBound='1';cur.addEventListener('change',()=>{pref.currency=cur.value;pref.rate=currencies[pref.currency].rate;if(rate)rate.value=String(pref.rate);save();currency();});}}
 if(rate){rate.value=String(pref.rate);if(rate.dataset.ppBound!=='1'){rate.dataset.ppBound='1';rate.addEventListener('input',()=>{const v=Number(rate.value);if(v>0){pref.rate=v;save();currency();}});}}
}
function boot(){
 bind();
 setTheme();
 translatePage();
 applyUnits();
 currency();
 document.addEventListener('printprofit-settings-open',()=>{bind();translatePage();setTheme();applyUnits();currency();});
 document.addEventListener('click',event=>{
   const trigger=event.target&&event.target.closest?event.target.closest('#ppCleanTop [data-target="settings"]'):null;
   if(trigger)setTimeout(()=>{bind();translatePage();setTheme();},0);
 });
 setInterval(()=>{bind();applyUnits();currency();},1200);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();,locale:'en-CA',rate:1.8731},
 AUD:{symbol:'A
const moneyFields=['materialPackCost','labourRate','pack','other','electricityRate','fixedFee','delivery','deliveryCharge','sell'];
const unitFields=['materialPack','materialUsed'];
const tx={
'Settings':'Ustawienia','Manage the calculator display and preferences.':'Zarządzaj wyglądem kalkulatora i preferencjami.',
'Appearance':'Wygląd','Dark mode':'Tryb ciemny','Use the dark PrintProfit interface.':'Użyj ciemnego interfejsu PrintProfit.',
'Language':'Język','Choose the language used across the page.':'Wybierz język używany na całej stronie.',
'Units':'Jednostki','Choose metric or imperial measurements.':'Wybierz jednostki metryczne lub imperialne.',
'Currency':'Waluta','Choose the currency used for costs and prices.':'Wybierz walutę używaną dla kosztów i cen.',
'Exchange rate':'Kurs wymiany','Update the conversion used when displaying non-GBP currencies.':'Aktualizuj przelicznik używany do wyświetlania walut innych niż GBP.',
'Calculator reset':'Reset kalkulatora','Clear the current calculator inputs and return pricing to £0.':'Wyczyść dane kalkulatora i ustaw ceny z powrotem na 0.',
'Reset Calculator':'Resetuj kalkulator','Preferences are saved automatically on this device.':'Preferencje są zapisywane automatycznie na tym urządzeniu.',
'Calculate':'Kalkuluj','Price':'Cena','Profit':'Zysk','Settings':'Ustawienia',
'3D PRINTING PRICING, MADE SIMPLE':'CENY DRUKU 3D, PROSTO I PRZEJRZYŚCIE',
'Know what it costs.':'Wiesz, ile to kosztuje.','Know what to charge.':'Wiesz, ile naliczyć.',
'Start Calculating':'Rozpocznij kalkulację','Learn More':'Dowiedz się więcej',
'1. G-code File':'1. Plik G-code','Upload your sliced file to auto-fill print time and filament usage.':'Wgraj pocięty plik, aby automatycznie uzupełnić czas druku i zużycie materiału.',
'Choose File':'Wybierz plik','Clear':'Wyczyść','No G-code selected':'Nie wybrano pliku G-code',
'2. Printer Profile':'2. Profil drukarki','Select your printer or use a custom profile.':'Wybierz drukarkę lub użyj własnego profilu.',
'3. Filament / Resin Profile':'3. Profil filamentu / żywicy','Material type':'Rodzaj materiału','Material':'Materiał',
'Calculated material cost (£)':'Obliczony koszt materiału','Print time (hours)':'Czas druku',
'4. Operating Costs':'4. Koszty operacyjne','Additional Costs':'Dodatkowe koszty','Electricity':'Prąd',
'Electricity provider / tariff':'Dostawca prądu / taryfa','Estimated printer power':'Szacowana moc drukarki',
'Estimated electricity cost':'Szacowany koszt prądu','5. Selling & Fulfilment':'5. Sprzedaż i realizacja',
'Platform':'Platforma','Delivery':'Dostawa','6. Quantity / Batch Pricing':'6. Ilość / wycena zbiorcza',
'Quantity':'Ilość','Batch discount (%)':'Rabat ilościowy (%)','Selling price per item (£)':'Cena sprzedaży za sztukę (£)',
'Calculate Costs & Price':'Oblicz koszty i cenę','Results':'Wyniki','Single Print':'Pojedynczy wydruk','Batch Pricing':'Wycena zbiorcza',
'Total Cost to Make':'Łączny koszt wykonania','Selling Price':'Cena sprzedaży','Quick Price Buttons (target margin)':'Szybkie przyciski ceny (docelowa marża)',
'Custom target margin (%)':'Własna docelowa marża (%)','Batch Cost to Make':'Koszt partii','Batch Sales':'Sprzedaż partii','Batch Profit':'Zysk z partii'
};
const reverse={}; Object.keys(tx).forEach(k=>reverse[tx[k]]=k);
let pref=load();
const originalText=new WeakMap(), baseMoneyText=new WeakMap(), baseMoneyInput=new WeakMap(), baseLabel=new WeakMap();
function load(){try{return Object.assign({},defaults,JSON.parse(localStorage.getItem(KEY)||'{}'));}catch(e){return Object.assign({},defaults);}}
function save(){try{localStorage.setItem(KEY,JSON.stringify(pref));}catch(e){}}
function tr(v){if(pref.language==='pl')return tx[v]||v; return reverse[v]||v;}
function translatePage(){
 document.documentElement.lang=pref.language==='pl'?'pl':'en';
 const w=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT); let n;
 while(n=w.nextNode()){if(!n.parentElement||n.parentElement.closest('script,style'))continue; const raw=n.nodeValue.trim(); if(!raw)continue; if(!originalText.has(n))originalText.set(n,raw); const target=tr(originalText.get(n)); if(n.nodeValue!==target)n.nodeValue=n.nodeValue.replace(raw,target);}
}
function setTheme(){
 document.body.dataset.ppTheme=pref.dark?'dark':'light';
 let s=document.getElementById('ppPreferenceTheme'); if(!s){s=document.createElement('style');s.id='ppPreferenceTheme';document.head.appendChild(s);}
 s.textContent='body[data-pp-theme="light"]{background:#eef3f5!important;color:#17242c!important}'+
'body[data-pp-theme="light"] #ppCleanTop{background:#e9f0f3!important;color:#17242c!important}'+
'body[data-pp-theme="light"] #ppCleanTop .pp-top-nav{background:#f4f7f8!important;border-color:#c5d3da!important}'+
'body[data-pp-theme="light"] #ppCleanTop .pp-top-links button{color:#23333c!important}'+
'body[data-pp-theme="light"] .panel,body[data-pp-theme="light"] .pp-master-quickcards button{background:linear-gradient(180deg,#fff,#edf3f5)!important;color:#17242c!important}'+
'body[data-pp-theme="light"] input,body[data-pp-theme="light"] select,body[data-pp-theme="light"] textarea{background:#fff!important;color:#17242c!important;border-color:#c5d3da!important}';
}
function labelFor(id){return document.getElementById(id)?.parentElement?.querySelector('label')||document.querySelector('label[for="'+id+'"]');}
function applyUnits(){
 const type=document.getElementById('materialType')?.value==='resin'?'resin':'filament'; const imp=pref.units==='imperial';
 unitFields.forEach(id=>{const src=document.getElementById(id);if(!src)return; let p=document.getElementById('ppUnit_'+id);
  if(imp){if(!p){p=document.createElement('input');p.id='ppUnit_'+id;p.type='number';p.min='0';p.step=id==='materialPack'?'1':'0.01';p.className='ppPreferenceInput';src.insertAdjacentElement('afterend',p);src.style.display='none';p.addEventListener('input',()=>{const v=Number(p.value)||0;src.value=String(type==='resin'?v*29.5735295625:v*28.349523125);src.dispatchEvent(new Event('input',{bubbles:true}));});}
   p.value=(type==='resin'?Number(src.value||0)/29.5735295625:Number(src.value||0)/28.349523125).toFixed(id==='materialPack'?0:2);
  }else{if(p){p.remove();src.style.display='';}}
 });
 const l1=labelFor('materialPack'),l2=labelFor('materialUsed');
 if(l1)l1.textContent=imp?'Spool weight (oz)':type==='resin'?'Bottle volume (ml)':'Spool weight (g)';
 if(l2)l2.textContent=imp?(type==='resin'?'Used per print (fl oz)':'Used per print (oz)'):(type==='resin'?'Used per print (ml)':'Used per print (g)');
}
function currency(){
 const meta=currencies[pref.currency]||currencies.GBP,rate=Number(pref.rate)>0?Number(pref.rate):1;
 moneyFields.forEach(id=>{const src=document.getElementById(id);if(!src)return; let p=document.getElementById('ppCur_'+id);
  if(pref.currency==='GBP'){if(p){p.remove();src.style.display='';}}
  else{if(!p){p=document.createElement('input');p.id='ppCur_'+id;p.type='number';p.min='0';p.step=src.step||'0.01';p.className='ppPreferenceInput';src.insertAdjacentElement('afterend',p);src.style.display='none';p.addEventListener('input',()=>{src.value=String((Number(p.value)||0)/rate);src.dispatchEvent(new Event('input',{bubbles:true}));});} p.value=(Number(src.value||0)*rate).toFixed(2);}
 });
 const w=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT); let n;
 while(n=w.nextNode()){if(!n.parentElement||n.parentElement.closest('script,style,#ppSettingsPanel'))continue; let s=n.nodeValue; const m=s.match(/[£€$zł]\s*(-?[0-9][0-9,]*(?:\.[0-9]+)?)/); if(m&&m[0].startsWith('£'))baseMoneyText.set(n,Number(m[1].replace(/,/g,''))); const base=baseMoneyText.get(n); if(base===undefined)continue; if(/[£€$zł]/.test(s))n.nodeValue=s.replace(/[£€$zł]\s*-?[0-9][0-9,]*(?:\.[0-9]+)?/,new Intl.NumberFormat(meta.locale,{style:'currency',currency:pref.currency,minimumFractionDigits:2,maximumFractionDigits:2}).format(base*rate));}
 document.querySelectorAll('input[readonly]').forEach(el=>{const s=el.value||'',m=s.match(/£\s*(-?[0-9][0-9,]*(?:\.[0-9]+)?)/);if(m)baseMoneyInput.set(el,Number(m[1].replace(/,/g,'')));const b=baseMoneyInput.get(el);if(b!==undefined)el.value=new Intl.NumberFormat(meta.locale,{style:'currency',currency:pref.currency,minimumFractionDigits:2,maximumFractionDigits:2}).format(b*rate);});
 document.querySelectorAll('label').forEach(el=>{if(!baseLabel.has(el))baseLabel.set(el,el.textContent);const b=baseLabel.get(el);if(/[£€$zł]/.test(b))el.textContent=tr(b.replace(/[£€$zł]/g,'£')).replace(/£/g,meta.symbol);});
}
function bind(){
 const dark=document.getElementById('ppSettingsDark'),lang=document.getElementById('ppSettingsLanguage'),units=document.getElementById('ppSettingsUnits'),cur=document.getElementById('ppSettingsCurrency'),rate=document.getElementById('ppSettingsRate');
 if(dark){dark.checked=pref.dark;if(dark.dataset.ppBound!=='1'){dark.dataset.ppBound='1';dark.addEventListener('change',()=>{pref.dark=dark.checked;save();setTheme();});}}
 if(lang){lang.value=pref.language;if(lang.dataset.ppBound!=='1'){lang.dataset.ppBound='1';lang.addEventListener('change',()=>{pref.language=lang.value;save();translatePage();applyUnits();currency();});}}
 if(units){units.value=pref.units;if(units.dataset.ppBound!=='1'){units.dataset.ppBound='1';units.addEventListener('change',()=>{pref.units=units.value;save();applyUnits();});}}
 if(cur){cur.value=pref.currency;if(cur.dataset.ppBound!=='1'){cur.dataset.ppBound='1';cur.addEventListener('change',()=>{pref.currency=cur.value;pref.rate=currencies[pref.currency].rate;if(rate)rate.value=String(pref.rate);save();currency();});}}
 if(rate){rate.value=String(pref.rate);if(rate.dataset.ppBound!=='1'){rate.dataset.ppBound='1';rate.addEventListener('input',()=>{const v=Number(rate.value);if(v>0){pref.rate=v;save();currency();}});}}
}
function boot(){
 bind();
 setTheme();
 translatePage();
 applyUnits();
 currency();
 document.addEventListener('printprofit-settings-open',()=>{bind();translatePage();setTheme();applyUnits();currency();});
 document.addEventListener('click',event=>{
   const trigger=event.target&&event.target.closest?event.target.closest('#ppCleanTop [data-target="settings"]'):null;
   if(trigger)setTimeout(()=>{bind();translatePage();setTheme();},0);
 });
 setInterval(()=>{bind();applyUnits();currency();},1200);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();,locale:'en-AU',rate:1.8805},
 CHF:{symbol:'CHF',locale:'de-CH',rate:1.1021},
 SEK:{symbol:'SEK',locale:'sv-SE',rate:13.1876},
 NOK:{symbol:'NOK',locale:'nb-NO',rate:12.6040},
 DKK:{symbol:'DKK',locale:'da-DK',rate:8.7187},
 CZK:{symbol:'CZK',locale:'cs-CZ',rate:28.4299},
 JPY:{symbol:'¥',locale:'ja-JP',rate:209.8304},
 CNY:{symbol:'CN¥',locale:'zh-CN',rate:8.9649},
 INR:{symbol:'₹',locale:'en-IN',rate:128.3551},
 NZD:{symbol:'NZ
const moneyFields=['materialPackCost','labourRate','pack','other','electricityRate','fixedFee','delivery','deliveryCharge','sell'];
const unitFields=['materialPack','materialUsed'];
const tx={
'Settings':'Ustawienia','Manage the calculator display and preferences.':'Zarządzaj wyglądem kalkulatora i preferencjami.',
'Appearance':'Wygląd','Dark mode':'Tryb ciemny','Use the dark PrintProfit interface.':'Użyj ciemnego interfejsu PrintProfit.',
'Language':'Język','Choose the language used across the page.':'Wybierz język używany na całej stronie.',
'Units':'Jednostki','Choose metric or imperial measurements.':'Wybierz jednostki metryczne lub imperialne.',
'Currency':'Waluta','Choose the currency used for costs and prices.':'Wybierz walutę używaną dla kosztów i cen.',
'Exchange rate':'Kurs wymiany','Update the conversion used when displaying non-GBP currencies.':'Aktualizuj przelicznik używany do wyświetlania walut innych niż GBP.',
'Calculator reset':'Reset kalkulatora','Clear the current calculator inputs and return pricing to £0.':'Wyczyść dane kalkulatora i ustaw ceny z powrotem na 0.',
'Reset Calculator':'Resetuj kalkulator','Preferences are saved automatically on this device.':'Preferencje są zapisywane automatycznie na tym urządzeniu.',
'Calculate':'Kalkuluj','Price':'Cena','Profit':'Zysk','Settings':'Ustawienia',
'3D PRINTING PRICING, MADE SIMPLE':'CENY DRUKU 3D, PROSTO I PRZEJRZYŚCIE',
'Know what it costs.':'Wiesz, ile to kosztuje.','Know what to charge.':'Wiesz, ile naliczyć.',
'Start Calculating':'Rozpocznij kalkulację','Learn More':'Dowiedz się więcej',
'1. G-code File':'1. Plik G-code','Upload your sliced file to auto-fill print time and filament usage.':'Wgraj pocięty plik, aby automatycznie uzupełnić czas druku i zużycie materiału.',
'Choose File':'Wybierz plik','Clear':'Wyczyść','No G-code selected':'Nie wybrano pliku G-code',
'2. Printer Profile':'2. Profil drukarki','Select your printer or use a custom profile.':'Wybierz drukarkę lub użyj własnego profilu.',
'3. Filament / Resin Profile':'3. Profil filamentu / żywicy','Material type':'Rodzaj materiału','Material':'Materiał',
'Calculated material cost (£)':'Obliczony koszt materiału','Print time (hours)':'Czas druku',
'4. Operating Costs':'4. Koszty operacyjne','Additional Costs':'Dodatkowe koszty','Electricity':'Prąd',
'Electricity provider / tariff':'Dostawca prądu / taryfa','Estimated printer power':'Szacowana moc drukarki',
'Estimated electricity cost':'Szacowany koszt prądu','5. Selling & Fulfilment':'5. Sprzedaż i realizacja',
'Platform':'Platforma','Delivery':'Dostawa','6. Quantity / Batch Pricing':'6. Ilość / wycena zbiorcza',
'Quantity':'Ilość','Batch discount (%)':'Rabat ilościowy (%)','Selling price per item (£)':'Cena sprzedaży za sztukę (£)',
'Calculate Costs & Price':'Oblicz koszty i cenę','Results':'Wyniki','Single Print':'Pojedynczy wydruk','Batch Pricing':'Wycena zbiorcza',
'Total Cost to Make':'Łączny koszt wykonania','Selling Price':'Cena sprzedaży','Quick Price Buttons (target margin)':'Szybkie przyciski ceny (docelowa marża)',
'Custom target margin (%)':'Własna docelowa marża (%)','Batch Cost to Make':'Koszt partii','Batch Sales':'Sprzedaż partii','Batch Profit':'Zysk z partii'
};
const reverse={}; Object.keys(tx).forEach(k=>reverse[tx[k]]=k);
let pref=load();
const originalText=new WeakMap(), baseMoneyText=new WeakMap(), baseMoneyInput=new WeakMap(), baseLabel=new WeakMap();
function load(){try{return Object.assign({},defaults,JSON.parse(localStorage.getItem(KEY)||'{}'));}catch(e){return Object.assign({},defaults);}}
function save(){try{localStorage.setItem(KEY,JSON.stringify(pref));}catch(e){}}
function tr(v){if(pref.language==='pl')return tx[v]||v; return reverse[v]||v;}
function translatePage(){
 document.documentElement.lang=pref.language==='pl'?'pl':'en';
 const w=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT); let n;
 while(n=w.nextNode()){if(!n.parentElement||n.parentElement.closest('script,style'))continue; const raw=n.nodeValue.trim(); if(!raw)continue; if(!originalText.has(n))originalText.set(n,raw); const target=tr(originalText.get(n)); if(n.nodeValue!==target)n.nodeValue=n.nodeValue.replace(raw,target);}
}
function setTheme(){
 document.body.dataset.ppTheme=pref.dark?'dark':'light';
 let s=document.getElementById('ppPreferenceTheme'); if(!s){s=document.createElement('style');s.id='ppPreferenceTheme';document.head.appendChild(s);}
 s.textContent='body[data-pp-theme="light"]{background:#eef3f5!important;color:#17242c!important}'+
'body[data-pp-theme="light"] #ppCleanTop{background:#e9f0f3!important;color:#17242c!important}'+
'body[data-pp-theme="light"] #ppCleanTop .pp-top-nav{background:#f4f7f8!important;border-color:#c5d3da!important}'+
'body[data-pp-theme="light"] #ppCleanTop .pp-top-links button{color:#23333c!important}'+
'body[data-pp-theme="light"] .panel,body[data-pp-theme="light"] .pp-master-quickcards button{background:linear-gradient(180deg,#fff,#edf3f5)!important;color:#17242c!important}'+
'body[data-pp-theme="light"] input,body[data-pp-theme="light"] select,body[data-pp-theme="light"] textarea{background:#fff!important;color:#17242c!important;border-color:#c5d3da!important}';
}
function labelFor(id){return document.getElementById(id)?.parentElement?.querySelector('label')||document.querySelector('label[for="'+id+'"]');}
function applyUnits(){
 const type=document.getElementById('materialType')?.value==='resin'?'resin':'filament'; const imp=pref.units==='imperial';
 unitFields.forEach(id=>{const src=document.getElementById(id);if(!src)return; let p=document.getElementById('ppUnit_'+id);
  if(imp){if(!p){p=document.createElement('input');p.id='ppUnit_'+id;p.type='number';p.min='0';p.step=id==='materialPack'?'1':'0.01';p.className='ppPreferenceInput';src.insertAdjacentElement('afterend',p);src.style.display='none';p.addEventListener('input',()=>{const v=Number(p.value)||0;src.value=String(type==='resin'?v*29.5735295625:v*28.349523125);src.dispatchEvent(new Event('input',{bubbles:true}));});}
   p.value=(type==='resin'?Number(src.value||0)/29.5735295625:Number(src.value||0)/28.349523125).toFixed(id==='materialPack'?0:2);
  }else{if(p){p.remove();src.style.display='';}}
 });
 const l1=labelFor('materialPack'),l2=labelFor('materialUsed');
 if(l1)l1.textContent=imp?'Spool weight (oz)':type==='resin'?'Bottle volume (ml)':'Spool weight (g)';
 if(l2)l2.textContent=imp?(type==='resin'?'Used per print (fl oz)':'Used per print (oz)'):(type==='resin'?'Used per print (ml)':'Used per print (g)');
}
function currency(){
 const meta=currencies[pref.currency]||currencies.GBP,rate=Number(pref.rate)>0?Number(pref.rate):1;
 moneyFields.forEach(id=>{const src=document.getElementById(id);if(!src)return; let p=document.getElementById('ppCur_'+id);
  if(pref.currency==='GBP'){if(p){p.remove();src.style.display='';}}
  else{if(!p){p=document.createElement('input');p.id='ppCur_'+id;p.type='number';p.min='0';p.step=src.step||'0.01';p.className='ppPreferenceInput';src.insertAdjacentElement('afterend',p);src.style.display='none';p.addEventListener('input',()=>{src.value=String((Number(p.value)||0)/rate);src.dispatchEvent(new Event('input',{bubbles:true}));});} p.value=(Number(src.value||0)*rate).toFixed(2);}
 });
 const w=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT); let n;
 while(n=w.nextNode()){if(!n.parentElement||n.parentElement.closest('script,style,#ppSettingsPanel'))continue; let s=n.nodeValue; const m=s.match(/[£€$zł]\s*(-?[0-9][0-9,]*(?:\.[0-9]+)?)/); if(m&&m[0].startsWith('£'))baseMoneyText.set(n,Number(m[1].replace(/,/g,''))); const base=baseMoneyText.get(n); if(base===undefined)continue; if(/[£€$zł]/.test(s))n.nodeValue=s.replace(/[£€$zł]\s*-?[0-9][0-9,]*(?:\.[0-9]+)?/,new Intl.NumberFormat(meta.locale,{style:'currency',currency:pref.currency,minimumFractionDigits:2,maximumFractionDigits:2}).format(base*rate));}
 document.querySelectorAll('input[readonly]').forEach(el=>{const s=el.value||'',m=s.match(/£\s*(-?[0-9][0-9,]*(?:\.[0-9]+)?)/);if(m)baseMoneyInput.set(el,Number(m[1].replace(/,/g,'')));const b=baseMoneyInput.get(el);if(b!==undefined)el.value=new Intl.NumberFormat(meta.locale,{style:'currency',currency:pref.currency,minimumFractionDigits:2,maximumFractionDigits:2}).format(b*rate);});
 document.querySelectorAll('label').forEach(el=>{if(!baseLabel.has(el))baseLabel.set(el,el.textContent);const b=baseLabel.get(el);if(/[£€$zł]/.test(b))el.textContent=tr(b.replace(/[£€$zł]/g,'£')).replace(/£/g,meta.symbol);});
}
function bind(){
 const dark=document.getElementById('ppSettingsDark'),lang=document.getElementById('ppSettingsLanguage'),units=document.getElementById('ppSettingsUnits'),cur=document.getElementById('ppSettingsCurrency'),rate=document.getElementById('ppSettingsRate');
 if(dark){dark.checked=pref.dark;if(dark.dataset.ppBound!=='1'){dark.dataset.ppBound='1';dark.addEventListener('change',()=>{pref.dark=dark.checked;save();setTheme();});}}
 if(lang){lang.value=pref.language;if(lang.dataset.ppBound!=='1'){lang.dataset.ppBound='1';lang.addEventListener('change',()=>{pref.language=lang.value;save();translatePage();applyUnits();currency();});}}
 if(units){units.value=pref.units;if(units.dataset.ppBound!=='1'){units.dataset.ppBound='1';units.addEventListener('change',()=>{pref.units=units.value;save();applyUnits();});}}
 if(cur){cur.value=pref.currency;if(cur.dataset.ppBound!=='1'){cur.dataset.ppBound='1';cur.addEventListener('change',()=>{pref.currency=cur.value;pref.rate=currencies[pref.currency].rate;if(rate)rate.value=String(pref.rate);save();currency();});}}
 if(rate){rate.value=String(pref.rate);if(rate.dataset.ppBound!=='1'){rate.dataset.ppBound='1';rate.addEventListener('input',()=>{const v=Number(rate.value);if(v>0){pref.rate=v;save();currency();}});}}
}
function boot(){
 bind();
 setTheme();
 translatePage();
 applyUnits();
 currency();
 document.addEventListener('printprofit-settings-open',()=>{bind();translatePage();setTheme();applyUnits();currency();});
 document.addEventListener('click',event=>{
   const trigger=event.target&&event.target.closest?event.target.closest('#ppCleanTop [data-target="settings"]'):null;
   if(trigger)setTimeout(()=>{bind();translatePage();setTheme();},0);
 });
 setInterval(()=>{bind();applyUnits();currency();},1200);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();,locale:'en-NZ',rate:2.3419},
 SGD:{symbol:'S
const moneyFields=['materialPackCost','labourRate','pack','other','electricityRate','fixedFee','delivery','deliveryCharge','sell'];
const unitFields=['materialPack','materialUsed'];
const tx={
'Settings':'Ustawienia','Manage the calculator display and preferences.':'Zarządzaj wyglądem kalkulatora i preferencjami.',
'Appearance':'Wygląd','Dark mode':'Tryb ciemny','Use the dark PrintProfit interface.':'Użyj ciemnego interfejsu PrintProfit.',
'Language':'Język','Choose the language used across the page.':'Wybierz język używany na całej stronie.',
'Units':'Jednostki','Choose metric or imperial measurements.':'Wybierz jednostki metryczne lub imperialne.',
'Currency':'Waluta','Choose the currency used for costs and prices.':'Wybierz walutę używaną dla kosztów i cen.',
'Exchange rate':'Kurs wymiany','Update the conversion used when displaying non-GBP currencies.':'Aktualizuj przelicznik używany do wyświetlania walut innych niż GBP.',
'Calculator reset':'Reset kalkulatora','Clear the current calculator inputs and return pricing to £0.':'Wyczyść dane kalkulatora i ustaw ceny z powrotem na 0.',
'Reset Calculator':'Resetuj kalkulator','Preferences are saved automatically on this device.':'Preferencje są zapisywane automatycznie na tym urządzeniu.',
'Calculate':'Kalkuluj','Price':'Cena','Profit':'Zysk','Settings':'Ustawienia',
'3D PRINTING PRICING, MADE SIMPLE':'CENY DRUKU 3D, PROSTO I PRZEJRZYŚCIE',
'Know what it costs.':'Wiesz, ile to kosztuje.','Know what to charge.':'Wiesz, ile naliczyć.',
'Start Calculating':'Rozpocznij kalkulację','Learn More':'Dowiedz się więcej',
'1. G-code File':'1. Plik G-code','Upload your sliced file to auto-fill print time and filament usage.':'Wgraj pocięty plik, aby automatycznie uzupełnić czas druku i zużycie materiału.',
'Choose File':'Wybierz plik','Clear':'Wyczyść','No G-code selected':'Nie wybrano pliku G-code',
'2. Printer Profile':'2. Profil drukarki','Select your printer or use a custom profile.':'Wybierz drukarkę lub użyj własnego profilu.',
'3. Filament / Resin Profile':'3. Profil filamentu / żywicy','Material type':'Rodzaj materiału','Material':'Materiał',
'Calculated material cost (£)':'Obliczony koszt materiału','Print time (hours)':'Czas druku',
'4. Operating Costs':'4. Koszty operacyjne','Additional Costs':'Dodatkowe koszty','Electricity':'Prąd',
'Electricity provider / tariff':'Dostawca prądu / taryfa','Estimated printer power':'Szacowana moc drukarki',
'Estimated electricity cost':'Szacowany koszt prądu','5. Selling & Fulfilment':'5. Sprzedaż i realizacja',
'Platform':'Platforma','Delivery':'Dostawa','6. Quantity / Batch Pricing':'6. Ilość / wycena zbiorcza',
'Quantity':'Ilość','Batch discount (%)':'Rabat ilościowy (%)','Selling price per item (£)':'Cena sprzedaży za sztukę (£)',
'Calculate Costs & Price':'Oblicz koszty i cenę','Results':'Wyniki','Single Print':'Pojedynczy wydruk','Batch Pricing':'Wycena zbiorcza',
'Total Cost to Make':'Łączny koszt wykonania','Selling Price':'Cena sprzedaży','Quick Price Buttons (target margin)':'Szybkie przyciski ceny (docelowa marża)',
'Custom target margin (%)':'Własna docelowa marża (%)','Batch Cost to Make':'Koszt partii','Batch Sales':'Sprzedaż partii','Batch Profit':'Zysk z partii'
};
const reverse={}; Object.keys(tx).forEach(k=>reverse[tx[k]]=k);
let pref=load();
const originalText=new WeakMap(), baseMoneyText=new WeakMap(), baseMoneyInput=new WeakMap(), baseLabel=new WeakMap();
function load(){try{return Object.assign({},defaults,JSON.parse(localStorage.getItem(KEY)||'{}'));}catch(e){return Object.assign({},defaults);}}
function save(){try{localStorage.setItem(KEY,JSON.stringify(pref));}catch(e){}}
function tr(v){if(pref.language==='pl')return tx[v]||v; return reverse[v]||v;}
function translatePage(){
 document.documentElement.lang=pref.language==='pl'?'pl':'en';
 const w=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT); let n;
 while(n=w.nextNode()){if(!n.parentElement||n.parentElement.closest('script,style'))continue; const raw=n.nodeValue.trim(); if(!raw)continue; if(!originalText.has(n))originalText.set(n,raw); const target=tr(originalText.get(n)); if(n.nodeValue!==target)n.nodeValue=n.nodeValue.replace(raw,target);}
}
function setTheme(){
 document.body.dataset.ppTheme=pref.dark?'dark':'light';
 let s=document.getElementById('ppPreferenceTheme'); if(!s){s=document.createElement('style');s.id='ppPreferenceTheme';document.head.appendChild(s);}
 s.textContent='body[data-pp-theme="light"]{background:#eef3f5!important;color:#17242c!important}'+
'body[data-pp-theme="light"] #ppCleanTop{background:#e9f0f3!important;color:#17242c!important}'+
'body[data-pp-theme="light"] #ppCleanTop .pp-top-nav{background:#f4f7f8!important;border-color:#c5d3da!important}'+
'body[data-pp-theme="light"] #ppCleanTop .pp-top-links button{color:#23333c!important}'+
'body[data-pp-theme="light"] .panel,body[data-pp-theme="light"] .pp-master-quickcards button{background:linear-gradient(180deg,#fff,#edf3f5)!important;color:#17242c!important}'+
'body[data-pp-theme="light"] input,body[data-pp-theme="light"] select,body[data-pp-theme="light"] textarea{background:#fff!important;color:#17242c!important;border-color:#c5d3da!important}';
}
function labelFor(id){return document.getElementById(id)?.parentElement?.querySelector('label')||document.querySelector('label[for="'+id+'"]');}
function applyUnits(){
 const type=document.getElementById('materialType')?.value==='resin'?'resin':'filament'; const imp=pref.units==='imperial';
 unitFields.forEach(id=>{const src=document.getElementById(id);if(!src)return; let p=document.getElementById('ppUnit_'+id);
  if(imp){if(!p){p=document.createElement('input');p.id='ppUnit_'+id;p.type='number';p.min='0';p.step=id==='materialPack'?'1':'0.01';p.className='ppPreferenceInput';src.insertAdjacentElement('afterend',p);src.style.display='none';p.addEventListener('input',()=>{const v=Number(p.value)||0;src.value=String(type==='resin'?v*29.5735295625:v*28.349523125);src.dispatchEvent(new Event('input',{bubbles:true}));});}
   p.value=(type==='resin'?Number(src.value||0)/29.5735295625:Number(src.value||0)/28.349523125).toFixed(id==='materialPack'?0:2);
  }else{if(p){p.remove();src.style.display='';}}
 });
 const l1=labelFor('materialPack'),l2=labelFor('materialUsed');
 if(l1)l1.textContent=imp?'Spool weight (oz)':type==='resin'?'Bottle volume (ml)':'Spool weight (g)';
 if(l2)l2.textContent=imp?(type==='resin'?'Used per print (fl oz)':'Used per print (oz)'):(type==='resin'?'Used per print (ml)':'Used per print (g)');
}
function currency(){
 const meta=currencies[pref.currency]||currencies.GBP,rate=Number(pref.rate)>0?Number(pref.rate):1;
 moneyFields.forEach(id=>{const src=document.getElementById(id);if(!src)return; let p=document.getElementById('ppCur_'+id);
  if(pref.currency==='GBP'){if(p){p.remove();src.style.display='';}}
  else{if(!p){p=document.createElement('input');p.id='ppCur_'+id;p.type='number';p.min='0';p.step=src.step||'0.01';p.className='ppPreferenceInput';src.insertAdjacentElement('afterend',p);src.style.display='none';p.addEventListener('input',()=>{src.value=String((Number(p.value)||0)/rate);src.dispatchEvent(new Event('input',{bubbles:true}));});} p.value=(Number(src.value||0)*rate).toFixed(2);}
 });
 const w=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT); let n;
 while(n=w.nextNode()){if(!n.parentElement||n.parentElement.closest('script,style,#ppSettingsPanel'))continue; let s=n.nodeValue; const m=s.match(/[£€$zł]\s*(-?[0-9][0-9,]*(?:\.[0-9]+)?)/); if(m&&m[0].startsWith('£'))baseMoneyText.set(n,Number(m[1].replace(/,/g,''))); const base=baseMoneyText.get(n); if(base===undefined)continue; if(/[£€$zł]/.test(s))n.nodeValue=s.replace(/[£€$zł]\s*-?[0-9][0-9,]*(?:\.[0-9]+)?/,new Intl.NumberFormat(meta.locale,{style:'currency',currency:pref.currency,minimumFractionDigits:2,maximumFractionDigits:2}).format(base*rate));}
 document.querySelectorAll('input[readonly]').forEach(el=>{const s=el.value||'',m=s.match(/£\s*(-?[0-9][0-9,]*(?:\.[0-9]+)?)/);if(m)baseMoneyInput.set(el,Number(m[1].replace(/,/g,'')));const b=baseMoneyInput.get(el);if(b!==undefined)el.value=new Intl.NumberFormat(meta.locale,{style:'currency',currency:pref.currency,minimumFractionDigits:2,maximumFractionDigits:2}).format(b*rate);});
 document.querySelectorAll('label').forEach(el=>{if(!baseLabel.has(el))baseLabel.set(el,el.textContent);const b=baseLabel.get(el);if(/[£€$zł]/.test(b))el.textContent=tr(b.replace(/[£€$zł]/g,'£')).replace(/£/g,meta.symbol);});
}
function bind(){
 const dark=document.getElementById('ppSettingsDark'),lang=document.getElementById('ppSettingsLanguage'),units=document.getElementById('ppSettingsUnits'),cur=document.getElementById('ppSettingsCurrency'),rate=document.getElementById('ppSettingsRate');
 if(dark){dark.checked=pref.dark;if(dark.dataset.ppBound!=='1'){dark.dataset.ppBound='1';dark.addEventListener('change',()=>{pref.dark=dark.checked;save();setTheme();});}}
 if(lang){lang.value=pref.language;if(lang.dataset.ppBound!=='1'){lang.dataset.ppBound='1';lang.addEventListener('change',()=>{pref.language=lang.value;save();translatePage();applyUnits();currency();});}}
 if(units){units.value=pref.units;if(units.dataset.ppBound!=='1'){units.dataset.ppBound='1';units.addEventListener('change',()=>{pref.units=units.value;save();applyUnits();});}}
 if(cur){cur.value=pref.currency;if(cur.dataset.ppBound!=='1'){cur.dataset.ppBound='1';cur.addEventListener('change',()=>{pref.currency=cur.value;pref.rate=currencies[pref.currency].rate;if(rate)rate.value=String(pref.rate);save();currency();});}}
 if(rate){rate.value=String(pref.rate);if(rate.dataset.ppBound!=='1'){rate.dataset.ppBound='1';rate.addEventListener('input',()=>{const v=Number(rate.value);if(v>0){pref.rate=v;save();currency();}});}}
}
function boot(){
 bind();
 setTheme();
 translatePage();
 applyUnits();
 currency();
 document.addEventListener('printprofit-settings-open',()=>{bind();translatePage();setTheme();applyUnits();currency();});
 document.addEventListener('click',event=>{
   const trigger=event.target&&event.target.closest?event.target.closest('#ppCleanTop [data-target="settings"]'):null;
   if(trigger)setTimeout(()=>{bind();translatePage();setTheme();},0);
 });
 setInterval(()=>{bind();applyUnits();currency();},1200);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();,locale:'en-SG',rate:1.7082},
 BRL:{symbol:'R
const moneyFields=['materialPackCost','labourRate','pack','other','electricityRate','fixedFee','delivery','deliveryCharge','sell'];
const unitFields=['materialPack','materialUsed'];
const tx={
'Settings':'Ustawienia','Manage the calculator display and preferences.':'Zarządzaj wyglądem kalkulatora i preferencjami.',
'Appearance':'Wygląd','Dark mode':'Tryb ciemny','Use the dark PrintProfit interface.':'Użyj ciemnego interfejsu PrintProfit.',
'Language':'Język','Choose the language used across the page.':'Wybierz język używany na całej stronie.',
'Units':'Jednostki','Choose metric or imperial measurements.':'Wybierz jednostki metryczne lub imperialne.',
'Currency':'Waluta','Choose the currency used for costs and prices.':'Wybierz walutę używaną dla kosztów i cen.',
'Exchange rate':'Kurs wymiany','Update the conversion used when displaying non-GBP currencies.':'Aktualizuj przelicznik używany do wyświetlania walut innych niż GBP.',
'Calculator reset':'Reset kalkulatora','Clear the current calculator inputs and return pricing to £0.':'Wyczyść dane kalkulatora i ustaw ceny z powrotem na 0.',
'Reset Calculator':'Resetuj kalkulator','Preferences are saved automatically on this device.':'Preferencje są zapisywane automatycznie na tym urządzeniu.',
'Calculate':'Kalkuluj','Price':'Cena','Profit':'Zysk','Settings':'Ustawienia',
'3D PRINTING PRICING, MADE SIMPLE':'CENY DRUKU 3D, PROSTO I PRZEJRZYŚCIE',
'Know what it costs.':'Wiesz, ile to kosztuje.','Know what to charge.':'Wiesz, ile naliczyć.',
'Start Calculating':'Rozpocznij kalkulację','Learn More':'Dowiedz się więcej',
'1. G-code File':'1. Plik G-code','Upload your sliced file to auto-fill print time and filament usage.':'Wgraj pocięty plik, aby automatycznie uzupełnić czas druku i zużycie materiału.',
'Choose File':'Wybierz plik','Clear':'Wyczyść','No G-code selected':'Nie wybrano pliku G-code',
'2. Printer Profile':'2. Profil drukarki','Select your printer or use a custom profile.':'Wybierz drukarkę lub użyj własnego profilu.',
'3. Filament / Resin Profile':'3. Profil filamentu / żywicy','Material type':'Rodzaj materiału','Material':'Materiał',
'Calculated material cost (£)':'Obliczony koszt materiału','Print time (hours)':'Czas druku',
'4. Operating Costs':'4. Koszty operacyjne','Additional Costs':'Dodatkowe koszty','Electricity':'Prąd',
'Electricity provider / tariff':'Dostawca prądu / taryfa','Estimated printer power':'Szacowana moc drukarki',
'Estimated electricity cost':'Szacowany koszt prądu','5. Selling & Fulfilment':'5. Sprzedaż i realizacja',
'Platform':'Platforma','Delivery':'Dostawa','6. Quantity / Batch Pricing':'6. Ilość / wycena zbiorcza',
'Quantity':'Ilość','Batch discount (%)':'Rabat ilościowy (%)','Selling price per item (£)':'Cena sprzedaży za sztukę (£)',
'Calculate Costs & Price':'Oblicz koszty i cenę','Results':'Wyniki','Single Print':'Pojedynczy wydruk','Batch Pricing':'Wycena zbiorcza',
'Total Cost to Make':'Łączny koszt wykonania','Selling Price':'Cena sprzedaży','Quick Price Buttons (target margin)':'Szybkie przyciski ceny (docelowa marża)',
'Custom target margin (%)':'Własna docelowa marża (%)','Batch Cost to Make':'Koszt partii','Batch Sales':'Sprzedaż partii','Batch Profit':'Zysk z partii'
};
const reverse={}; Object.keys(tx).forEach(k=>reverse[tx[k]]=k);
let pref=load();
const originalText=new WeakMap(), baseMoneyText=new WeakMap(), baseMoneyInput=new WeakMap(), baseLabel=new WeakMap();
function load(){try{return Object.assign({},defaults,JSON.parse(localStorage.getItem(KEY)||'{}'));}catch(e){return Object.assign({},defaults);}}
function save(){try{localStorage.setItem(KEY,JSON.stringify(pref));}catch(e){}}
function tr(v){if(pref.language==='pl')return tx[v]||v; return reverse[v]||v;}
function translatePage(){
 document.documentElement.lang=pref.language==='pl'?'pl':'en';
 const w=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT); let n;
 while(n=w.nextNode()){if(!n.parentElement||n.parentElement.closest('script,style'))continue; const raw=n.nodeValue.trim(); if(!raw)continue; if(!originalText.has(n))originalText.set(n,raw); const target=tr(originalText.get(n)); if(n.nodeValue!==target)n.nodeValue=n.nodeValue.replace(raw,target);}
}
function setTheme(){
 document.body.dataset.ppTheme=pref.dark?'dark':'light';
 let s=document.getElementById('ppPreferenceTheme'); if(!s){s=document.createElement('style');s.id='ppPreferenceTheme';document.head.appendChild(s);}
 s.textContent='body[data-pp-theme="light"]{background:#eef3f5!important;color:#17242c!important}'+
'body[data-pp-theme="light"] #ppCleanTop{background:#e9f0f3!important;color:#17242c!important}'+
'body[data-pp-theme="light"] #ppCleanTop .pp-top-nav{background:#f4f7f8!important;border-color:#c5d3da!important}'+
'body[data-pp-theme="light"] #ppCleanTop .pp-top-links button{color:#23333c!important}'+
'body[data-pp-theme="light"] .panel,body[data-pp-theme="light"] .pp-master-quickcards button{background:linear-gradient(180deg,#fff,#edf3f5)!important;color:#17242c!important}'+
'body[data-pp-theme="light"] input,body[data-pp-theme="light"] select,body[data-pp-theme="light"] textarea{background:#fff!important;color:#17242c!important;border-color:#c5d3da!important}';
}
function labelFor(id){return document.getElementById(id)?.parentElement?.querySelector('label')||document.querySelector('label[for="'+id+'"]');}
function applyUnits(){
 const type=document.getElementById('materialType')?.value==='resin'?'resin':'filament'; const imp=pref.units==='imperial';
 unitFields.forEach(id=>{const src=document.getElementById(id);if(!src)return; let p=document.getElementById('ppUnit_'+id);
  if(imp){if(!p){p=document.createElement('input');p.id='ppUnit_'+id;p.type='number';p.min='0';p.step=id==='materialPack'?'1':'0.01';p.className='ppPreferenceInput';src.insertAdjacentElement('afterend',p);src.style.display='none';p.addEventListener('input',()=>{const v=Number(p.value)||0;src.value=String(type==='resin'?v*29.5735295625:v*28.349523125);src.dispatchEvent(new Event('input',{bubbles:true}));});}
   p.value=(type==='resin'?Number(src.value||0)/29.5735295625:Number(src.value||0)/28.349523125).toFixed(id==='materialPack'?0:2);
  }else{if(p){p.remove();src.style.display='';}}
 });
 const l1=labelFor('materialPack'),l2=labelFor('materialUsed');
 if(l1)l1.textContent=imp?'Spool weight (oz)':type==='resin'?'Bottle volume (ml)':'Spool weight (g)';
 if(l2)l2.textContent=imp?(type==='resin'?'Used per print (fl oz)':'Used per print (oz)'):(type==='resin'?'Used per print (ml)':'Used per print (g)');
}
function currency(){
 const meta=currencies[pref.currency]||currencies.GBP,rate=Number(pref.rate)>0?Number(pref.rate):1;
 moneyFields.forEach(id=>{const src=document.getElementById(id);if(!src)return; let p=document.getElementById('ppCur_'+id);
  if(pref.currency==='GBP'){if(p){p.remove();src.style.display='';}}
  else{if(!p){p=document.createElement('input');p.id='ppCur_'+id;p.type='number';p.min='0';p.step=src.step||'0.01';p.className='ppPreferenceInput';src.insertAdjacentElement('afterend',p);src.style.display='none';p.addEventListener('input',()=>{src.value=String((Number(p.value)||0)/rate);src.dispatchEvent(new Event('input',{bubbles:true}));});} p.value=(Number(src.value||0)*rate).toFixed(2);}
 });
 const w=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT); let n;
 while(n=w.nextNode()){if(!n.parentElement||n.parentElement.closest('script,style,#ppSettingsPanel'))continue; let s=n.nodeValue; const m=s.match(/[£€$zł]\s*(-?[0-9][0-9,]*(?:\.[0-9]+)?)/); if(m&&m[0].startsWith('£'))baseMoneyText.set(n,Number(m[1].replace(/,/g,''))); const base=baseMoneyText.get(n); if(base===undefined)continue; if(/[£€$zł]/.test(s))n.nodeValue=s.replace(/[£€$zł]\s*-?[0-9][0-9,]*(?:\.[0-9]+)?/,new Intl.NumberFormat(meta.locale,{style:'currency',currency:pref.currency,minimumFractionDigits:2,maximumFractionDigits:2}).format(base*rate));}
 document.querySelectorAll('input[readonly]').forEach(el=>{const s=el.value||'',m=s.match(/£\s*(-?[0-9][0-9,]*(?:\.[0-9]+)?)/);if(m)baseMoneyInput.set(el,Number(m[1].replace(/,/g,'')));const b=baseMoneyInput.get(el);if(b!==undefined)el.value=new Intl.NumberFormat(meta.locale,{style:'currency',currency:pref.currency,minimumFractionDigits:2,maximumFractionDigits:2}).format(b*rate);});
 document.querySelectorAll('label').forEach(el=>{if(!baseLabel.has(el))baseLabel.set(el,el.textContent);const b=baseLabel.get(el);if(/[£€$zł]/.test(b))el.textContent=tr(b.replace(/[£€$zł]/g,'£')).replace(/£/g,meta.symbol);});
}
function bind(){
 const dark=document.getElementById('ppSettingsDark'),lang=document.getElementById('ppSettingsLanguage'),units=document.getElementById('ppSettingsUnits'),cur=document.getElementById('ppSettingsCurrency'),rate=document.getElementById('ppSettingsRate');
 if(dark){dark.checked=pref.dark;if(dark.dataset.ppBound!=='1'){dark.dataset.ppBound='1';dark.addEventListener('change',()=>{pref.dark=dark.checked;save();setTheme();});}}
 if(lang){lang.value=pref.language;if(lang.dataset.ppBound!=='1'){lang.dataset.ppBound='1';lang.addEventListener('change',()=>{pref.language=lang.value;save();translatePage();applyUnits();currency();});}}
 if(units){units.value=pref.units;if(units.dataset.ppBound!=='1'){units.dataset.ppBound='1';units.addEventListener('change',()=>{pref.units=units.value;save();applyUnits();});}}
 if(cur){cur.value=pref.currency;if(cur.dataset.ppBound!=='1'){cur.dataset.ppBound='1';cur.addEventListener('change',()=>{pref.currency=cur.value;pref.rate=currencies[pref.currency].rate;if(rate)rate.value=String(pref.rate);save();currency();});}}
 if(rate){rate.value=String(pref.rate);if(rate.dataset.ppBound!=='1'){rate.dataset.ppBound='1';rate.addEventListener('input',()=>{const v=Number(rate.value);if(v>0){pref.rate=v;save();currency();}});}}
}
function boot(){
 bind();
 setTheme();
 translatePage();
 applyUnits();
 currency();
 document.addEventListener('printprofit-settings-open',()=>{bind();translatePage();setTheme();applyUnits();currency();});
 document.addEventListener('click',event=>{
   const trigger=event.target&&event.target.closest?event.target.closest('#ppCleanTop [data-target="settings"]'):null;
   if(trigger)setTimeout(()=>{bind();translatePage();setTheme();},0);
 });
 setInterval(()=>{bind();applyUnits();currency();},1200);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();,locale:'pt-BR',rate:6.9020},
 MXN:{symbol:'MX
const moneyFields=['materialPackCost','labourRate','pack','other','electricityRate','fixedFee','delivery','deliveryCharge','sell'];
const unitFields=['materialPack','materialUsed'];
const tx={
'Settings':'Ustawienia','Manage the calculator display and preferences.':'Zarządzaj wyglądem kalkulatora i preferencjami.',
'Appearance':'Wygląd','Dark mode':'Tryb ciemny','Use the dark PrintProfit interface.':'Użyj ciemnego interfejsu PrintProfit.',
'Language':'Język','Choose the language used across the page.':'Wybierz język używany na całej stronie.',
'Units':'Jednostki','Choose metric or imperial measurements.':'Wybierz jednostki metryczne lub imperialne.',
'Currency':'Waluta','Choose the currency used for costs and prices.':'Wybierz walutę używaną dla kosztów i cen.',
'Exchange rate':'Kurs wymiany','Update the conversion used when displaying non-GBP currencies.':'Aktualizuj przelicznik używany do wyświetlania walut innych niż GBP.',
'Calculator reset':'Reset kalkulatora','Clear the current calculator inputs and return pricing to £0.':'Wyczyść dane kalkulatora i ustaw ceny z powrotem na 0.',
'Reset Calculator':'Resetuj kalkulator','Preferences are saved automatically on this device.':'Preferencje są zapisywane automatycznie na tym urządzeniu.',
'Calculate':'Kalkuluj','Price':'Cena','Profit':'Zysk','Settings':'Ustawienia',
'3D PRINTING PRICING, MADE SIMPLE':'CENY DRUKU 3D, PROSTO I PRZEJRZYŚCIE',
'Know what it costs.':'Wiesz, ile to kosztuje.','Know what to charge.':'Wiesz, ile naliczyć.',
'Start Calculating':'Rozpocznij kalkulację','Learn More':'Dowiedz się więcej',
'1. G-code File':'1. Plik G-code','Upload your sliced file to auto-fill print time and filament usage.':'Wgraj pocięty plik, aby automatycznie uzupełnić czas druku i zużycie materiału.',
'Choose File':'Wybierz plik','Clear':'Wyczyść','No G-code selected':'Nie wybrano pliku G-code',
'2. Printer Profile':'2. Profil drukarki','Select your printer or use a custom profile.':'Wybierz drukarkę lub użyj własnego profilu.',
'3. Filament / Resin Profile':'3. Profil filamentu / żywicy','Material type':'Rodzaj materiału','Material':'Materiał',
'Calculated material cost (£)':'Obliczony koszt materiału','Print time (hours)':'Czas druku',
'4. Operating Costs':'4. Koszty operacyjne','Additional Costs':'Dodatkowe koszty','Electricity':'Prąd',
'Electricity provider / tariff':'Dostawca prądu / taryfa','Estimated printer power':'Szacowana moc drukarki',
'Estimated electricity cost':'Szacowany koszt prądu','5. Selling & Fulfilment':'5. Sprzedaż i realizacja',
'Platform':'Platforma','Delivery':'Dostawa','6. Quantity / Batch Pricing':'6. Ilość / wycena zbiorcza',
'Quantity':'Ilość','Batch discount (%)':'Rabat ilościowy (%)','Selling price per item (£)':'Cena sprzedaży za sztukę (£)',
'Calculate Costs & Price':'Oblicz koszty i cenę','Results':'Wyniki','Single Print':'Pojedynczy wydruk','Batch Pricing':'Wycena zbiorcza',
'Total Cost to Make':'Łączny koszt wykonania','Selling Price':'Cena sprzedaży','Quick Price Buttons (target margin)':'Szybkie przyciski ceny (docelowa marża)',
'Custom target margin (%)':'Własna docelowa marża (%)','Batch Cost to Make':'Koszt partii','Batch Sales':'Sprzedaż partii','Batch Profit':'Zysk z partii'
};
const reverse={}; Object.keys(tx).forEach(k=>reverse[tx[k]]=k);
let pref=load();
const originalText=new WeakMap(), baseMoneyText=new WeakMap(), baseMoneyInput=new WeakMap(), baseLabel=new WeakMap();
function load(){try{return Object.assign({},defaults,JSON.parse(localStorage.getItem(KEY)||'{}'));}catch(e){return Object.assign({},defaults);}}
function save(){try{localStorage.setItem(KEY,JSON.stringify(pref));}catch(e){}}
function tr(v){if(pref.language==='pl')return tx[v]||v; return reverse[v]||v;}
function translatePage(){
 document.documentElement.lang=pref.language==='pl'?'pl':'en';
 const w=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT); let n;
 while(n=w.nextNode()){if(!n.parentElement||n.parentElement.closest('script,style'))continue; const raw=n.nodeValue.trim(); if(!raw)continue; if(!originalText.has(n))originalText.set(n,raw); const target=tr(originalText.get(n)); if(n.nodeValue!==target)n.nodeValue=n.nodeValue.replace(raw,target);}
}
function setTheme(){
 document.body.dataset.ppTheme=pref.dark?'dark':'light';
 let s=document.getElementById('ppPreferenceTheme'); if(!s){s=document.createElement('style');s.id='ppPreferenceTheme';document.head.appendChild(s);}
 s.textContent='body[data-pp-theme="light"]{background:#eef3f5!important;color:#17242c!important}'+
'body[data-pp-theme="light"] #ppCleanTop{background:#e9f0f3!important;color:#17242c!important}'+
'body[data-pp-theme="light"] #ppCleanTop .pp-top-nav{background:#f4f7f8!important;border-color:#c5d3da!important}'+
'body[data-pp-theme="light"] #ppCleanTop .pp-top-links button{color:#23333c!important}'+
'body[data-pp-theme="light"] .panel,body[data-pp-theme="light"] .pp-master-quickcards button{background:linear-gradient(180deg,#fff,#edf3f5)!important;color:#17242c!important}'+
'body[data-pp-theme="light"] input,body[data-pp-theme="light"] select,body[data-pp-theme="light"] textarea{background:#fff!important;color:#17242c!important;border-color:#c5d3da!important}';
}
function labelFor(id){return document.getElementById(id)?.parentElement?.querySelector('label')||document.querySelector('label[for="'+id+'"]');}
function applyUnits(){
 const type=document.getElementById('materialType')?.value==='resin'?'resin':'filament'; const imp=pref.units==='imperial';
 unitFields.forEach(id=>{const src=document.getElementById(id);if(!src)return; let p=document.getElementById('ppUnit_'+id);
  if(imp){if(!p){p=document.createElement('input');p.id='ppUnit_'+id;p.type='number';p.min='0';p.step=id==='materialPack'?'1':'0.01';p.className='ppPreferenceInput';src.insertAdjacentElement('afterend',p);src.style.display='none';p.addEventListener('input',()=>{const v=Number(p.value)||0;src.value=String(type==='resin'?v*29.5735295625:v*28.349523125);src.dispatchEvent(new Event('input',{bubbles:true}));});}
   p.value=(type==='resin'?Number(src.value||0)/29.5735295625:Number(src.value||0)/28.349523125).toFixed(id==='materialPack'?0:2);
  }else{if(p){p.remove();src.style.display='';}}
 });
 const l1=labelFor('materialPack'),l2=labelFor('materialUsed');
 if(l1)l1.textContent=imp?'Spool weight (oz)':type==='resin'?'Bottle volume (ml)':'Spool weight (g)';
 if(l2)l2.textContent=imp?(type==='resin'?'Used per print (fl oz)':'Used per print (oz)'):(type==='resin'?'Used per print (ml)':'Used per print (g)');
}
function currency(){
 const meta=currencies[pref.currency]||currencies.GBP,rate=Number(pref.rate)>0?Number(pref.rate):1;
 moneyFields.forEach(id=>{const src=document.getElementById(id);if(!src)return; let p=document.getElementById('ppCur_'+id);
  if(pref.currency==='GBP'){if(p){p.remove();src.style.display='';}}
  else{if(!p){p=document.createElement('input');p.id='ppCur_'+id;p.type='number';p.min='0';p.step=src.step||'0.01';p.className='ppPreferenceInput';src.insertAdjacentElement('afterend',p);src.style.display='none';p.addEventListener('input',()=>{src.value=String((Number(p.value)||0)/rate);src.dispatchEvent(new Event('input',{bubbles:true}));});} p.value=(Number(src.value||0)*rate).toFixed(2);}
 });
 const w=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT); let n;
 while(n=w.nextNode()){if(!n.parentElement||n.parentElement.closest('script,style,#ppSettingsPanel'))continue; let s=n.nodeValue; const m=s.match(/[£€$zł]\s*(-?[0-9][0-9,]*(?:\.[0-9]+)?)/); if(m&&m[0].startsWith('£'))baseMoneyText.set(n,Number(m[1].replace(/,/g,''))); const base=baseMoneyText.get(n); if(base===undefined)continue; if(/[£€$zł]/.test(s))n.nodeValue=s.replace(/[£€$zł]\s*-?[0-9][0-9,]*(?:\.[0-9]+)?/,new Intl.NumberFormat(meta.locale,{style:'currency',currency:pref.currency,minimumFractionDigits:2,maximumFractionDigits:2}).format(base*rate));}
 document.querySelectorAll('input[readonly]').forEach(el=>{const s=el.value||'',m=s.match(/£\s*(-?[0-9][0-9,]*(?:\.[0-9]+)?)/);if(m)baseMoneyInput.set(el,Number(m[1].replace(/,/g,'')));const b=baseMoneyInput.get(el);if(b!==undefined)el.value=new Intl.NumberFormat(meta.locale,{style:'currency',currency:pref.currency,minimumFractionDigits:2,maximumFractionDigits:2}).format(b*rate);});
 document.querySelectorAll('label').forEach(el=>{if(!baseLabel.has(el))baseLabel.set(el,el.textContent);const b=baseLabel.get(el);if(/[£€$zł]/.test(b))el.textContent=tr(b.replace(/[£€$zł]/g,'£')).replace(/£/g,meta.symbol);});
}
function bind(){
 const dark=document.getElementById('ppSettingsDark'),lang=document.getElementById('ppSettingsLanguage'),units=document.getElementById('ppSettingsUnits'),cur=document.getElementById('ppSettingsCurrency'),rate=document.getElementById('ppSettingsRate');
 if(dark){dark.checked=pref.dark;if(dark.dataset.ppBound!=='1'){dark.dataset.ppBound='1';dark.addEventListener('change',()=>{pref.dark=dark.checked;save();setTheme();});}}
 if(lang){lang.value=pref.language;if(lang.dataset.ppBound!=='1'){lang.dataset.ppBound='1';lang.addEventListener('change',()=>{pref.language=lang.value;save();translatePage();applyUnits();currency();});}}
 if(units){units.value=pref.units;if(units.dataset.ppBound!=='1'){units.dataset.ppBound='1';units.addEventListener('change',()=>{pref.units=units.value;save();applyUnits();});}}
 if(cur){cur.value=pref.currency;if(cur.dataset.ppBound!=='1'){cur.dataset.ppBound='1';cur.addEventListener('change',()=>{pref.currency=cur.value;pref.rate=currencies[pref.currency].rate;if(rate)rate.value=String(pref.rate);save();currency();});}}
 if(rate){rate.value=String(pref.rate);if(rate.dataset.ppBound!=='1'){rate.dataset.ppBound='1';rate.addEventListener('input',()=>{const v=Number(rate.value);if(v>0){pref.rate=v;save();currency();}});}}
}
function boot(){
 bind();
 setTheme();
 translatePage();
 applyUnits();
 currency();
 document.addEventListener('printprofit-settings-open',()=>{bind();translatePage();setTheme();applyUnits();currency();});
 document.addEventListener('click',event=>{
   const trigger=event.target&&event.target.closest?event.target.closest('#ppCleanTop [data-target="settings"]'):null;
   if(trigger)setTimeout(()=>{bind();translatePage();setTheme();},0);
 });
 setInterval(()=>{bind();applyUnits();currency();},1200);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();,locale:'es-MX',rate:23.0696},
 ZAR:{symbol:'ZAR',locale:'en-ZA',rate:21.8000}
};
const moneyFields=['materialPackCost','labourRate','pack','other','electricityRate','fixedFee','delivery','deliveryCharge','sell'];
const unitFields=['materialPack','materialUsed'];
const tx={
'Settings':'Ustawienia','Manage the calculator display and preferences.':'Zarządzaj wyglądem kalkulatora i preferencjami.',
'Appearance':'Wygląd','Dark mode':'Tryb ciemny','Use the dark PrintProfit interface.':'Użyj ciemnego interfejsu PrintProfit.',
'Language':'Język','Choose the language used across the page.':'Wybierz język używany na całej stronie.',
'Units':'Jednostki','Choose metric or imperial measurements.':'Wybierz jednostki metryczne lub imperialne.',
'Currency':'Waluta','Choose the currency used for costs and prices.':'Wybierz walutę używaną dla kosztów i cen.',
'Exchange rate':'Kurs wymiany','Update the conversion used when displaying non-GBP currencies.':'Aktualizuj przelicznik używany do wyświetlania walut innych niż GBP.',
'Calculator reset':'Reset kalkulatora','Clear the current calculator inputs and return pricing to £0.':'Wyczyść dane kalkulatora i ustaw ceny z powrotem na 0.',
'Reset Calculator':'Resetuj kalkulator','Preferences are saved automatically on this device.':'Preferencje są zapisywane automatycznie na tym urządzeniu.',
'Calculate':'Kalkuluj','Price':'Cena','Profit':'Zysk','Settings':'Ustawienia',
'3D PRINTING PRICING, MADE SIMPLE':'CENY DRUKU 3D, PROSTO I PRZEJRZYŚCIE',
'Know what it costs.':'Wiesz, ile to kosztuje.','Know what to charge.':'Wiesz, ile naliczyć.',
'Start Calculating':'Rozpocznij kalkulację','Learn More':'Dowiedz się więcej',
'1. G-code File':'1. Plik G-code','Upload your sliced file to auto-fill print time and filament usage.':'Wgraj pocięty plik, aby automatycznie uzupełnić czas druku i zużycie materiału.',
'Choose File':'Wybierz plik','Clear':'Wyczyść','No G-code selected':'Nie wybrano pliku G-code',
'2. Printer Profile':'2. Profil drukarki','Select your printer or use a custom profile.':'Wybierz drukarkę lub użyj własnego profilu.',
'3. Filament / Resin Profile':'3. Profil filamentu / żywicy','Material type':'Rodzaj materiału','Material':'Materiał',
'Calculated material cost (£)':'Obliczony koszt materiału','Print time (hours)':'Czas druku',
'4. Operating Costs':'4. Koszty operacyjne','Additional Costs':'Dodatkowe koszty','Electricity':'Prąd',
'Electricity provider / tariff':'Dostawca prądu / taryfa','Estimated printer power':'Szacowana moc drukarki',
'Estimated electricity cost':'Szacowany koszt prądu','5. Selling & Fulfilment':'5. Sprzedaż i realizacja',
'Platform':'Platforma','Delivery':'Dostawa','6. Quantity / Batch Pricing':'6. Ilość / wycena zbiorcza',
'Quantity':'Ilość','Batch discount (%)':'Rabat ilościowy (%)','Selling price per item (£)':'Cena sprzedaży za sztukę (£)',
'Calculate Costs & Price':'Oblicz koszty i cenę','Results':'Wyniki','Single Print':'Pojedynczy wydruk','Batch Pricing':'Wycena zbiorcza',
'Total Cost to Make':'Łączny koszt wykonania','Selling Price':'Cena sprzedaży','Quick Price Buttons (target margin)':'Szybkie przyciski ceny (docelowa marża)',
'Custom target margin (%)':'Własna docelowa marża (%)','Batch Cost to Make':'Koszt partii','Batch Sales':'Sprzedaż partii','Batch Profit':'Zysk z partii'
};
const reverse={}; Object.keys(tx).forEach(k=>reverse[tx[k]]=k);
let pref=load();
const originalText=new WeakMap(), baseMoneyText=new WeakMap(), baseMoneyInput=new WeakMap(), baseLabel=new WeakMap();
function load(){try{return Object.assign({},defaults,JSON.parse(localStorage.getItem(KEY)||'{}'));}catch(e){return Object.assign({},defaults);}}
function save(){try{localStorage.setItem(KEY,JSON.stringify(pref));}catch(e){}}
function tr(v){if(pref.language==='pl')return tx[v]||v; return reverse[v]||v;}
function translatePage(){
 document.documentElement.lang=pref.language==='pl'?'pl':'en';
 const w=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT); let n;
 while(n=w.nextNode()){if(!n.parentElement||n.parentElement.closest('script,style'))continue; const raw=n.nodeValue.trim(); if(!raw)continue; if(!originalText.has(n))originalText.set(n,raw); const target=tr(originalText.get(n)); if(n.nodeValue!==target)n.nodeValue=n.nodeValue.replace(raw,target);}
}
function setTheme(){
 document.body.dataset.ppTheme=pref.dark?'dark':'light';
 let s=document.getElementById('ppPreferenceTheme'); if(!s){s=document.createElement('style');s.id='ppPreferenceTheme';document.head.appendChild(s);}
 s.textContent='body[data-pp-theme="light"]{background:#eef3f5!important;color:#17242c!important}'+
'body[data-pp-theme="light"] #ppCleanTop{background:#e9f0f3!important;color:#17242c!important}'+
'body[data-pp-theme="light"] #ppCleanTop .pp-top-nav{background:#f4f7f8!important;border-color:#c5d3da!important}'+
'body[data-pp-theme="light"] #ppCleanTop .pp-top-links button{color:#23333c!important}'+
'body[data-pp-theme="light"] .panel,body[data-pp-theme="light"] .pp-master-quickcards button{background:linear-gradient(180deg,#fff,#edf3f5)!important;color:#17242c!important}'+
'body[data-pp-theme="light"] input,body[data-pp-theme="light"] select,body[data-pp-theme="light"] textarea{background:#fff!important;color:#17242c!important;border-color:#c5d3da!important}';
}
function labelFor(id){return document.getElementById(id)?.parentElement?.querySelector('label')||document.querySelector('label[for="'+id+'"]');}
function applyUnits(){
 const type=document.getElementById('materialType')?.value==='resin'?'resin':'filament'; const imp=pref.units==='imperial';
 unitFields.forEach(id=>{const src=document.getElementById(id);if(!src)return; let p=document.getElementById('ppUnit_'+id);
  if(imp){if(!p){p=document.createElement('input');p.id='ppUnit_'+id;p.type='number';p.min='0';p.step=id==='materialPack'?'1':'0.01';p.className='ppPreferenceInput';src.insertAdjacentElement('afterend',p);src.style.display='none';p.addEventListener('input',()=>{const v=Number(p.value)||0;src.value=String(type==='resin'?v*29.5735295625:v*28.349523125);src.dispatchEvent(new Event('input',{bubbles:true}));});}
   p.value=(type==='resin'?Number(src.value||0)/29.5735295625:Number(src.value||0)/28.349523125).toFixed(id==='materialPack'?0:2);
  }else{if(p){p.remove();src.style.display='';}}
 });
 const l1=labelFor('materialPack'),l2=labelFor('materialUsed');
 if(l1)l1.textContent=imp?'Spool weight (oz)':type==='resin'?'Bottle volume (ml)':'Spool weight (g)';
 if(l2)l2.textContent=imp?(type==='resin'?'Used per print (fl oz)':'Used per print (oz)'):(type==='resin'?'Used per print (ml)':'Used per print (g)');
}
function currency(){
 const meta=currencies[pref.currency]||currencies.GBP,rate=Number(pref.rate)>0?Number(pref.rate):1;
 moneyFields.forEach(id=>{const src=document.getElementById(id);if(!src)return; let p=document.getElementById('ppCur_'+id);
  if(pref.currency==='GBP'){if(p){p.remove();src.style.display='';}}
  else{if(!p){p=document.createElement('input');p.id='ppCur_'+id;p.type='number';p.min='0';p.step=src.step||'0.01';p.className='ppPreferenceInput';src.insertAdjacentElement('afterend',p);src.style.display='none';p.addEventListener('input',()=>{src.value=String((Number(p.value)||0)/rate);src.dispatchEvent(new Event('input',{bubbles:true}));});} p.value=(Number(src.value||0)*rate).toFixed(2);}
 });
 const w=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT); let n;
 while(n=w.nextNode()){if(!n.parentElement||n.parentElement.closest('script,style,#ppSettingsPanel'))continue; let s=n.nodeValue; const m=s.match(/[£€$zł]\s*(-?[0-9][0-9,]*(?:\.[0-9]+)?)/); if(m&&m[0].startsWith('£'))baseMoneyText.set(n,Number(m[1].replace(/,/g,''))); const base=baseMoneyText.get(n); if(base===undefined)continue; if(/[£€$zł]/.test(s))n.nodeValue=s.replace(/[£€$zł]\s*-?[0-9][0-9,]*(?:\.[0-9]+)?/,new Intl.NumberFormat(meta.locale,{style:'currency',currency:pref.currency,minimumFractionDigits:2,maximumFractionDigits:2}).format(base*rate));}
 document.querySelectorAll('input[readonly]').forEach(el=>{const s=el.value||'',m=s.match(/£\s*(-?[0-9][0-9,]*(?:\.[0-9]+)?)/);if(m)baseMoneyInput.set(el,Number(m[1].replace(/,/g,'')));const b=baseMoneyInput.get(el);if(b!==undefined)el.value=new Intl.NumberFormat(meta.locale,{style:'currency',currency:pref.currency,minimumFractionDigits:2,maximumFractionDigits:2}).format(b*rate);});
 document.querySelectorAll('label').forEach(el=>{if(!baseLabel.has(el))baseLabel.set(el,el.textContent);const b=baseLabel.get(el);if(/[£€$zł]/.test(b))el.textContent=tr(b.replace(/[£€$zł]/g,'£')).replace(/£/g,meta.symbol);});
}
function bind(){
 const dark=document.getElementById('ppSettingsDark'),lang=document.getElementById('ppSettingsLanguage'),units=document.getElementById('ppSettingsUnits'),cur=document.getElementById('ppSettingsCurrency'),rate=document.getElementById('ppSettingsRate');
 if(dark){dark.checked=pref.dark;if(dark.dataset.ppBound!=='1'){dark.dataset.ppBound='1';dark.addEventListener('change',()=>{pref.dark=dark.checked;save();setTheme();});}}
 if(lang){lang.value=pref.language;if(lang.dataset.ppBound!=='1'){lang.dataset.ppBound='1';lang.addEventListener('change',()=>{pref.language=lang.value;save();translatePage();applyUnits();currency();});}}
 if(units){units.value=pref.units;if(units.dataset.ppBound!=='1'){units.dataset.ppBound='1';units.addEventListener('change',()=>{pref.units=units.value;save();applyUnits();});}}
 if(cur){cur.value=pref.currency;if(cur.dataset.ppBound!=='1'){cur.dataset.ppBound='1';cur.addEventListener('change',()=>{pref.currency=cur.value;pref.rate=currencies[pref.currency].rate;if(rate)rate.value=String(pref.rate);save();currency();});}}
 if(rate){rate.value=String(pref.rate);if(rate.dataset.ppBound!=='1'){rate.dataset.ppBound='1';rate.addEventListener('input',()=>{const v=Number(rate.value);if(v>0){pref.rate=v;save();currency();}});}}
}
function boot(){
 bind();
 setTheme();
 translatePage();
 applyUnits();
 currency();
 document.addEventListener('printprofit-settings-open',()=>{bind();translatePage();setTheme();applyUnits();currency();});
 document.addEventListener('click',event=>{
   const trigger=event.target&&event.target.closest?event.target.closest('#ppCleanTop [data-target="settings"]'):null;
   if(trigger)setTimeout(()=>{bind();translatePage();setTheme();},0);
 });
 setInterval(()=>{bind();applyUnits();currency();},1200);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();