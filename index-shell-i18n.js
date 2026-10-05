(()=>{'use strict';
const languages=['pl','de','fr','es','it','nl','pt','cs','sv','da'];
const rows=[
["PrintProfit — 3D Printing Cost & Pricing Calculator",["PrintProfit — Kalkulator kosztów i cen druku 3D","PrintProfit — Rechner für 3D-Druckkosten und Preise","PrintProfit — Calculateur de coûts et de prix d’impression 3D","PrintProfit — Calculadora de costes y precios de impresión 3D","PrintProfit — Calcolatore di costi e prezzi per la stampa 3D","PrintProfit — Calculator voor 3D-printkosten en prijzen","PrintProfit — Calculadora de custos e preços de impressão 3D","PrintProfit — Kalkulačka nákladů a cen 3D tisku","PrintProfit — Kalkylator för kostnader och priser för 3D-utskrift","PrintProfit — Beregner til omkostninger og priser på 3D-print"]],
["Loading your calculator…",["Wczytywanie kalkulatora…","Rechner wird geladen …","Chargement du calculateur…","Cargando la calculadora…","Caricamento del calcolatore…","Calculator laden…","A carregar a calculadora…","Načítání kalkulačky…","Kalkylatorn läses in…","Indlæser beregneren…"]],
["The calculator could not finish loading. Please try again.",["Nie udało się wczytać kalkulatora. Spróbuj ponownie.","Der Rechner konnte nicht vollständig geladen werden. Bitte versuche es erneut.","Le calculateur n’a pas pu terminer son chargement. Réessayez.","No se pudo terminar de cargar la calculadora. Inténtalo de nuevo.","Il caricamento del calcolatore non è riuscito. Riprova.","De calculator kon niet volledig worden geladen. Probeer het opnieuw.","Não foi possível concluir o carregamento da calculadora. Tente novamente.","Kalkulačku se nepodařilo načíst. Zkuste to znovu.","Kalkylatorn kunde inte läsas in helt. Försök igen.","Beregneren kunne ikke indlæses. Prøv igen."]],
["Try again",["Spróbuj ponownie","Erneut versuchen","Réessayer","Intentar de nuevo","Riprova","Opnieuw proberen","Tentar novamente","Zkusit znovu","Försök igen","Prøv igen"]],
["Please enable JavaScript to use the PrintProfit calculator.",["Włącz JavaScript, aby korzystać z kalkulatora PrintProfit.","Aktiviere JavaScript, um den PrintProfit-Rechner zu verwenden.","Activez JavaScript pour utiliser le calculateur PrintProfit.","Activa JavaScript para usar la calculadora PrintProfit.","Abilita JavaScript per usare il calcolatore PrintProfit.","Schakel JavaScript in om de PrintProfit-calculator te gebruiken.","Ative o JavaScript para usar a calculadora PrintProfit.","Pro používání kalkulačky PrintProfit povolte JavaScript.","Aktivera JavaScript för att använda PrintProfit-kalkylatorn.","Aktivér JavaScript for at bruge PrintProfit-beregneren."]],
["SAVE",["ZAPISZ","SPEICHERN","ENREGISTRER","GUARDAR","SALVA","OPSLAAN","GUARDAR","ULOŽIT","SPARA","GEM"]],
["PROJECT",["PROJEKT","PROJEKT","PROJET","PROYECTO","PROGETTO","PROJECT","PROJETO","PROJEKT","PROJEKT","PROJEKT"]],
["RESET",["RESETUJ","ZURÜCKSETZEN","RÉINITIALISER","RESTABLECER","RIPRISTINA","RESETTEN","REPOR","RESET","ÅTERSTÄLL","NULSTIL"]],
["CALCULATOR",["KALKULATOR","RECHNER","CALCULATEUR","CALCULADORA","CALCOLATORE","REKENMACHINE","CALCULADORA","KALKULAČKA","KALKYLATOR","BEREGNER"]],
["Save project",["Zapisz projekt","Projekt speichern","Enregistrer le projet","Guardar proyecto","Salva progetto","Project opslaan","Guardar projeto","Uložit projekt","Spara projekt","Gem projekt"]],
["Reset calculator",["Resetuj kalkulator","Rechner zurücksetzen","Réinitialiser le calculateur","Restablecer calculadora","Ripristina calcolatore","Calculator resetten","Repor calculadora","Resetovat kalkulačku","Återställ kalkylatorn","Nulstil beregneren"]],
["PrintProfit 3D Printing Cost & Pricing Calculator",["PrintProfit — Kalkulator kosztów i cen druku 3D","PrintProfit — Rechner für 3D-Druckkosten und Preise","PrintProfit — Calculateur de coûts et de prix d’impression 3D","PrintProfit — Calculadora de costes y precios de impresión 3D","PrintProfit — Calcolatore di costi e prezzi per la stampa 3D","PrintProfit — Calculator voor 3D-printkosten en prijzen","PrintProfit — Calculadora de custos e preços de impressão 3D","PrintProfit — Kalkulačka nákladů a cen 3D tisku","PrintProfit — Kalkylator för kostnader och priser för 3D-utskrift","PrintProfit — Beregner til omkostninger og priser på 3D-print"]]
];
const extra=window.__ppExtraI18n;
if(extra)rows.forEach(([source,values])=>languages.forEach((lang,index)=>{(extra[lang]||(extra[lang]={}))[source]=values[index];}));
const originals=new WeakMap(),attributes=new WeakMap();
function textFor(source,lang){return window.__ppTranslateText?window.__ppTranslateText(source,lang):source;}
function apply(){
 if(!document.body)return;
 const lang=String((()=>{try{return JSON.parse(localStorage.getItem('printprofit.preferences.v3')||'{}').language||'en';}catch(e){return 'en';}})());
 document.documentElement.lang=lang;
 const walker=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);let node;
 while(node=walker.nextNode()){
  if(!node.parentElement||node.parentElement.closest('script,style,noscript'))continue;
  const raw=node.nodeValue||'';if(!raw.trim())continue;
  let state=originals.get(node);
  if(!state){state={source:raw.trim(),rendered:raw.trim()};originals.set(node,state);}
  else if(raw.trim()!==state.rendered&&raw.trim()!==state.source)state.source=raw.trim();
  const next=lang==='en'?state.source:textFor(state.source,lang);
  if(raw.trim()!==next)node.nodeValue=raw.replace(raw.trim(),next);
  state.rendered=next;
 }
 document.querySelectorAll('[aria-label],[title],[alt],[placeholder]').forEach(el=>{
  ['aria-label','title','alt','placeholder'].forEach(attr=>{
   const raw=el.getAttribute(attr);if(raw===null)return;
   let state=attributes.get(el);if(!state){state={};attributes.set(el,state);}
   if(!state[attr])state[attr]={source:raw,rendered:raw};
   else if(raw!==state[attr].rendered&&raw!==state[attr].source)state[attr].source=raw;
   const next=lang==='en'?state[attr].source:textFor(state[attr].source,lang);
   if(raw!==next)el.setAttribute(attr,next);
   state[attr].rendered=next;
  });
 });
}
window.__ppTranslateShellText=(value)=>textFor(value,String((()=>{try{return JSON.parse(localStorage.getItem('printprofit.preferences.v3')||'{}').language||'en';}catch(e){return 'en';}})()));
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',apply,{once:true});else apply();
window.addEventListener('storage',event=>{if(event.key==='printprofit.preferences.v3')apply();});
window.addEventListener('pageshow',apply);
if(window.MutationObserver&&document.body){let timer;new MutationObserver(()=>{clearTimeout(timer);timer=setTimeout(apply,30);}).observe(document.body,{childList:true,subtree:true,characterData:true,attributes:true,attributeFilter:['aria-label','title','alt','placeholder']});}
})();

