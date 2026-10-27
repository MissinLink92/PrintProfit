(()=>{'use strict';
const mount=document.getElementById('ppSiteHeader');
if(!mount)return;
const icon=name=>'<svg viewBox="0 0 48 48" aria-hidden="true" focusable="false"><use href="./assets/printprofit-icon-master.svg#pp-'+name+'"></use></svg>';
const signInIcon='<svg viewBox="0 0 48 48" aria-hidden="true" focusable="false"><circle cx="24" cy="15" r="8"/><path d="M7 42c1-10 7-15 17-15s16 5 17 15"/></svg>';
const links=[
 {key:'home',label:'Home',href:'./index.html',icon:'home'},
 {key:'workspace',label:'My Workspace',href:'./index.html?open=workspace',icon:'folder'},
 {key:'compare',label:'Compare Products',href:'./price-finder.html',icon:'compare'},
 {key:'guide',label:'Guide & Help',href:'./guide.html',icon:'book'},
 {key:'settings',label:'Settings',href:'./index.html?open=settings',icon:'settings'},
 {key:'account',label:'Sign in',href:'./index.html?open=account',icon:'account'}
];
const page=location.pathname.toLowerCase();
const active=page.endsWith('/price-finder.html')?'compare':(page.endsWith('/guide.html')||page.endsWith('/privacy.html')||page.endsWith('/terms.html'))?'guide':(page==='/'||page.endsWith('/index.html'))?'home':'';
const navArt={home:0,workspace:1,compare:2,guide:3,settings:4};
const nav=links.map(item=>{
 const current=item.key===active;
 const graphic=item.icon==='account'?signInIcon:'';
 const artIndex=navArt[item.key];
 const artStyle=Number.isInteger(artIndex)?' style="background-image:url(\'./assets/printprofit-nav-icons.webp?v=1\');background-position:'+((artIndex/4)*100)+'% center"':'';
 return '<a href="'+item.href+'" '+(current?'aria-current="page"':'')+(item.key==='account'?' class="pvm-sign-in"':'')+'><span class="pvm-icon"'+artStyle+'>'+graphic+'</span><span>'+item.label+'</span></a>';
}).join('');
mount.innerHTML='<header class="pvm-header">'+
 '<a class="pvm-brand" href="./index.html" aria-label="PrintProfit home"><img src="./assets/printprofit-logo-orange.svg?v=5" alt="PrintProfit"><span class="pvm-brand-fallback">PrintProfit</span></a>'+
 '<nav class="pvm-nav" aria-label="PrintProfit navigation">'+nav+'</nav>'+
 '<div class="pvm-prefs"><label class="pvm-dark" title="Toggle dark mode"><span aria-hidden="true">◐</span><b id="themeLabel">Dark mode</b><input id="darkModeToggle" type="checkbox" role="switch" aria-label="Dark mode"><i aria-hidden="true"></i></label>'+
 '<label class="pvm-language" aria-label="Language"><span class="pvm-flag" aria-hidden="true"></span><select id="pvmLanguage" aria-label="Language"><option value="en" lang="en" translate="no">English</option><option value="pl" lang="pl" translate="no">Polski</option><option value="de" lang="de" translate="no">Deutsch</option><option value="fr" lang="fr" translate="no">Français</option><option value="es" lang="es" translate="no">Español</option><option value="it" lang="it" translate="no">Italiano</option></select><em aria-hidden="true">⌄</em></label></div></header>';
const prefs=()=>{try{return JSON.parse(localStorage.getItem('printprofit.preferences.v3')||'{}')||{}}catch(e){return {}}};
const save=patch=>{try{localStorage.setItem('printprofit.preferences.v3',JSON.stringify(Object.assign({dark:true,language:'en',units:'metric',currency:'GBP',rate:1},prefs(),patch)))}catch(e){}};
const flags={
 en:'<svg viewBox="0 0 24 16"><rect width="24" height="16" fill="#123b78"/><path d="M0 0 24 16M24 0 0 16" stroke="#fff" stroke-width="5"/><path d="M0 0 24 16M24 0 0 16" stroke="#c8102e" stroke-width="2"/><path d="M12 0v16M0 8h24" stroke="#fff" stroke-width="6"/><path d="M12 0v16M0 8h24" stroke="#c8102e" stroke-width="3"/></svg>',
 pl:'<svg viewBox="0 0 24 16"><path fill="#fff" d="M0 0h24v8H0z"/><path fill="#dc143c" d="M0 8h24v8H0z"/></svg>',
 de:'<svg viewBox="0 0 24 16"><path fill="#111" d="M0 0h24v5.33H0z"/><path fill="#d00" d="M0 5.33h24v5.34H0z"/><path fill="#ffce00" d="M0 10.67h24V16H0z"/></svg>',
 fr:'<svg viewBox="0 0 24 16"><path fill="#0055a4" d="M0 0h8v16H0z"/><path fill="#fff" d="M8 0h8v16H8z"/><path fill="#ef4135" d="M16 0h8v16h-8z"/></svg>',
 es:'<svg viewBox="0 0 24 16"><path fill="#aa151b" d="M0 0h24v4H0z"/><path fill="#f1bf00" d="M0 4h24v8H0z"/><path fill="#aa151b" d="M0 12h24v4H0z"/></svg>',
 it:'<svg viewBox="0 0 24 16"><path fill="#009246" d="M0 0h8v16H0z"/><path fill="#fff" d="M8 0h8v16H8z"/><path fill="#ce2b37" d="M16 0h8v16h-8z"/></svg>'
};
const lang=document.getElementById('pvmLanguage'),flag=document.querySelector('#ppSiteHeader .pvm-flag'),dark=document.getElementById('darkModeToggle');
const initial=prefs();
if(lang)lang.value=['en','pl','de','fr','es','it'].includes(initial.language)?initial.language:'en';
const updateFlag=()=>{if(!flag)return;const code=String(lang?.value||'en').toLowerCase();flag.innerHTML=flags[code]||flags.en;flag.dataset.language=code};
if(dark)dark.checked=initial.dark!==false;
const applyTheme=()=>{document.body.classList.toggle('pp-light',!dark?.checked);document.body.dataset.ppTheme=dark?.checked?'dark':'light';const label=document.getElementById('themeLabel');if(label)label.textContent=dark?.checked?'Dark mode':'Light mode'};
applyTheme();updateFlag();
const brandImage=mount.querySelector('.pvm-brand img');if(brandImage)brandImage.addEventListener('error',()=>{brandImage.style.display='none';const fallback=mount.querySelector('.pvm-brand-fallback');if(fallback)fallback.style.display='block'});
dark?.addEventListener('change',()=>{if(window.__setPrintProfitDarkMode)window.__setPrintProfitDarkMode(dark.checked);else save({dark:dark.checked});applyTheme()});
lang?.addEventListener('change',()=>{const code=String(lang.value||'en');if(window.__setPrintProfitLanguage)window.__setPrintProfitLanguage(code);else save({language:code});updateFlag();window.__ppApplyStandaloneI18n?.()});
document.addEventListener('printprofit-settings-changed',()=>{const latest=prefs();if(dark)dark.checked=latest.dark!==false;if(lang)lang.value=latest.language||'en';applyTheme();updateFlag();window.__ppApplyStandaloneI18n?.()});
window.addEventListener('storage',()=>{const latest=prefs();if(dark)dark.checked=latest.dark!==false;if(lang)lang.value=latest.language||'en';applyTheme();updateFlag();window.__ppApplyStandaloneI18n?.()});

// Share the calculator's dialogs without navigating away from the current page.
let panelAssets;
const loadPanelScript=src=>new Promise((resolve,reject)=>{const script=document.createElement('script');script.src=src;script.onload=resolve;script.onerror=()=>{script.remove();reject(new Error('Unable to load '+src))};document.body.appendChild(script)});
function ensurePanels(){
 if(!panelAssets)panelAssets=(async()=>{
  if(!window.PRINTPROFIT_REFERENCE_DATA)await loadPanelScript('./data/reference-data.js');
  if(!window.__printProfitUIModals)await loadPanelScript('./ui-modals.js?v=20261027-panels1');
  if(!window.__printProfitPreferencesV3)await loadPanelScript('./settings-preferences.js?v=20261027-panels1');
 })().catch(error=>{panelAssets=null;throw error});
 return panelAssets;
}
mount.querySelectorAll('a').forEach(link=>{
 const url=new URL(link.href,location.href);
 const kind=url.pathname.endsWith('/guide.html')?'guide':url.searchParams.get('open')==='settings'?'settings':null;
 if(!kind)return;
 link.setAttribute('aria-haspopup','dialog');
 link.addEventListener('click',async event=>{
  if(event.button!==0||event.ctrlKey||event.metaKey||event.shiftKey||event.altKey)return;
  event.preventDefault();
  if(link.getAttribute('aria-busy')==='true')return;
  link.setAttribute('aria-busy','true');
  try{await ensurePanels();link.focus({preventScroll:true});if(kind==='guide')window.__openPrintProfitGuide();else window.__openPrintProfitSettings();}
  catch(error){console.error('PrintProfit panel could not load',error);let note=mount.querySelector('[data-panel-error]');if(!note){note=document.createElement('p');note.dataset.panelError='';note.setAttribute('role','alert');mount.appendChild(note)}note.textContent='This panel could not load. Please try again.';}
  finally{link.removeAttribute('aria-busy');}
 });
});
})();

