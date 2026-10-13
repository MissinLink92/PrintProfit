(()=>{'use strict';
const EXTRA={};
const supported=new Set(['en','pl','de','fr','es','it']);
window.__ppExtraI18n=EXTRA;
// Preserve English sources separately from the last rendered translation. Dynamic
// status updates become new sources; switching back to English restores them.
const normalise=value=>String(value||'').replace(/\s+/g,' ').trim();
const catalogues=new Map();
function catalogue(lang){
 if(catalogues.has(lang))return catalogues.get(lang);
 const map=Object.fromEntries(Object.entries(EXTRA[lang]||{}).map(([key,value])=>[normalise(key),value]));
 const phrases=Object.keys(map).filter(key=>key.length>=8&&!key.includes('{')).sort((a,b)=>b.length-a.length);
 const patterns=Object.keys(map).filter(key=>key.includes('{')).map(key=>{
  const names=[];
  const escaped=key.split(/(\{[a-z]+\})/g).map(part=>{
   if(/^\{/.test(part)){
    const name=part.slice(1,-1);names.push(name);
    return ['count','page','total','start','end','listings','sources','brands','verified'].includes(name)?'([0-9.,]+)':'(.+?)';
   }
   return part.replace(/[.*+?^$\{\}()|[\]\\]/g,'\\$&');
  }).join('');
  return {regex:new RegExp('^'+escaped+'$'),names,value:map[key]};
 });
 const result={map,phrases,patterns};catalogues.set(lang,result);return result;
}
window.__ppTranslateText=(value,lang)=>{
 const source=normalise(value);if(lang==='en'||!source)return value;
 const {map,phrases,patterns}=catalogue(lang);
 if(Object.hasOwn(map,source))return map[source];
 for(const pattern of patterns){
  const match=source.match(pattern.regex);
  if(match)return pattern.value.replace(/\{([a-z]+)\}/g,(_,key)=>match[pattern.names.indexOf(key)+1]);
 }
 let out=source;
 for(const key of phrases){if(out.includes(key))out=out.split(key).join(map[key]);}
 return out;
};
const sources=new WeakMap(),attributes=new WeakMap();
window.__ppSetI18nRenderedText=(node,value)=>{
 const record=sources.get(node);if(record)record.rendered=value;
 if(node.nodeValue!==value)node.nodeValue=value;
};
window.__ppIsI18nMutation=mutation=>{
 const record=sources.get(mutation.target);
 return mutation.type==='characterData'&&record&&record.source!==record.rendered&&mutation.target.nodeValue===record.rendered;
};
let observer=null,languageGetter=null,timer=null;
const skip='script,style,svg,code,pre,[translate="no"],[data-pp-no-translate]';
function sourceFor(records,node,value){
 let record=records.get(node);
 if(!record||value!==record.rendered){record={source:value,rendered:value};records.set(node,record);}
 return record;
}
function observe(){if(document.body)observer?.observe(document.body,{childList:true,subtree:true,characterData:true,attributes:true,attributeFilter:['placeholder','aria-label','title','label']});}
window.__ppApplyI18n=lang=>{
 if(!document.body)return;
 lang=supported.has(lang)?lang:'en';
 if(lang!=='en'&&!EXTRA[lang])loadLocale(lang);
 observer?.disconnect();
 try{
  // Options without an explicit value use their text as the submitted value.
  // Keep that English value stable while translating the visible label.
  document.querySelectorAll('option:not([value])').forEach(option=>option.setAttribute('value',option.value));
  const walker=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);let node;
  while(node=walker.nextNode()){
   if(!node.parentElement||node.parentElement.closest(skip)||!node.nodeValue.trim())continue;
   const record=sourceFor(sources,node,node.nodeValue);
   const content=record.source.trim();
   const next=record.source.replace(content,window.__ppTranslateText(content,lang));
   if(node.nodeValue!==next)node.nodeValue=next;record.rendered=next;
  }
  document.querySelectorAll('[placeholder],[aria-label],[title],optgroup[label]').forEach(el=>{
   if(el.closest(skip))return;
   let records=attributes.get(el);if(!records){records=new Map();attributes.set(el,records);}
   for(const attr of ['placeholder','aria-label','title','label']){
    if(!el.hasAttribute(attr))continue;
    const value=el.getAttribute(attr);let record=records.get(attr);
    if(!record||record.rendered!==value){record={source:value,rendered:value};records.set(attr,record);}
    const next=window.__ppTranslateText(record.source,lang);
    if(value!==next)el.setAttribute(attr,next);record.rendered=next;
   }
  });
  const title=sourceFor(sources,document,document.title);
  const translatedTitle=window.__ppTranslateText(title.source,lang);
  if(document.title!==translatedTitle)document.title=translatedTitle;
  title.rendered=translatedTitle;
  document.documentElement.lang=lang;
  window.__ppAfterI18n?.();
 }finally{observe();}
};
window.__ppWatchI18n=getter=>{
 languageGetter=getter;
 if(observer||!window.MutationObserver||!document.body)return;
 observer=new MutationObserver(()=>{clearTimeout(timer);timer=setTimeout(()=>window.__ppApplyI18n(languageGetter()),30);});observe();
};
const localeRequests=new Map();
function loadLocale(lang){
 if(lang==='en')return Promise.resolve();
 if(localeRequests.has(lang))return localeRequests.get(lang);
 const request=fetch('./locales/'+lang+'.json?v=20261013-feeds1').then(response=>{
  if(!response.ok)throw new Error('Translation download failed: '+response.status);
  return response.json();
 }).then(map=>{
  EXTRA[lang]=map;catalogues.delete(lang);
  const current=languageGetter?languageGetter():preferenceLanguage();
  if(current===lang)window.__ppApplyI18n(lang);
  document.dispatchEvent(new CustomEvent('printprofit-translations-ready',{detail:{language:lang}}));
 }).catch(error=>{localeRequests.delete(lang);console.warn('PrintProfit translations:',error);});
 localeRequests.set(lang,request);return request;
}
const preferenceLanguage=()=>{try{return JSON.parse(localStorage.getItem('printprofit.preferences.v3')||'{}').language||'en';}catch(e){return 'en';}};
// Native validation, confirmation and naming dialogs use the same catalogue.
for(const method of ['alert','confirm','prompt']){
 const original=window[method];if(typeof original!=='function')continue;
 window[method]=(message,...args)=>original.call(window,window.__ppTranslateText(String(message),preferenceLanguage()),...args);
}
window.__ppI18nReady=loadLocale(supported.has(preferenceLanguage())?preferenceLanguage():'en');
window.__ppApplyStandaloneI18n=()=>{window.__ppApplyI18n(preferenceLanguage());window.__ppWatchI18n(preferenceLanguage);};
if(document.body?.dataset?.ppStandaloneI18n==='1'){
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',window.__ppApplyStandaloneI18n,{once:true});
 else window.__ppApplyStandaloneI18n();
 window.addEventListener('storage',event=>{if(event.key==='printprofit.preferences.v3')window.__ppApplyStandaloneI18n();});
}
})();
