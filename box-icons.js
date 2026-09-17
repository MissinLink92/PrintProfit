(()=>{
'use strict';
if(window.__printProfitBoxIconsV2)return;window.__printProfitBoxIconsV2=true;

const svg={
  gcode:`<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M10 5h20l8 8v30H10z"/><path d="M30 5v9h8"/><path d="m17 24 4 3-4 3m10-6-4 3 4 3M17 36h14"/>` ,
  printer:`<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M14 18V7h20v11"/><path d="M11 19h26a5 5 0 0 1 5 5v10H35"/><path d="M13 34H6V24a5 5 0 0 1 5-5"/><path d="M14 30h20v11H14z"/><path d="M31 24h4"/>` ,
  filament:`<svg viewBox="0 0 48 48" aria-hidden="true"><ellipse cx="24" cy="11" rx="13" ry="5"/><path d="M11 11v25c0 3 6 6 13 6s13-3 13-6V11"/><path d="M11 23c0 3 6 6 13 6s13-3 13-6"/><path d="M11 35c0 3 6 6 13 6s13-3 13-6"/><path d="M17 11c2 2 12 2 14 0"/>` ,
  costs:`<svg viewBox="0 0 48 48" aria-hidden="true"><circle cx="24" cy="24" r="15"/><path d="M24 15v18m6-13h-9a4 4 0 1 0 0 8h6a4 4 0 1 1 0 8h-9"/><path d="M15 7 18 4m18 3-3-3M7 18l-3-1m37 1 3-1"/>` ,
  electricity:`<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M27 4 12 26h12l-3 18 15-23H24z"/>` ,
  fees:`<svg viewBox="0 0 48 48" aria-hidden="true"><circle cx="16" cy="16" r="5"/><circle cx="32" cy="32" r="5"/><path d="m14 34 20-20"/><path d="M10 10h.01M38 38h.01"/>` ,
  delivery:`<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M5 12h24v24H5z"/><path d="M29 21h8l6 7v8H29z"/><circle cx="14" cy="39" r="4"/><circle cx="35" cy="39" r="4"/><path d="M10 20h12m-8-5h8"/>` ,
  quantity:`<svg viewBox="0 0 48 48" aria-hidden="true"><rect x="7" y="9" width="25" height="11" rx="3"/><rect x="16" y="19" width="25" height="11" rx="3"/><rect x="7" y="29" width="25" height="11" rx="3"/></svg>` ,
  results:`<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M9 39V8m0 31h31"/><path d="m13 31 7-7 6 5 11-14"/><circle cx="37" cy="15" r="3"/>` ,
  additional:`<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M24 7v34M7 24h34"/><circle cx="24" cy="24" r="16"/>` ,
  platform:`<svg viewBox="0 0 48 48" aria-hidden="true"><rect x="8" y="11" width="32" height="26" rx="5"/><path d="M14 18h20M14 26h8m4 0h8M14 33h6"/>` ,
  support:`<svg viewBox="0 0 48 48" aria-hidden="true"><circle cx="24" cy="24" r="17"/><path d="M18 20a6 6 0 1 1 10 4c-4 2-4 4-4 7"/><path d="M24 35h.01"/>` ,
  default:`<svg viewBox="0 0 48 48" aria-hidden="true"><circle cx="24" cy="24" r="16"/><path d="M24 14v20M17 21h10a4 4 0 1 1 0 8H17"/>`
};

function kindFor(section,holder){
  const h=holder?.parentElement?.querySelector?.('h2');
  const txt=(h?.textContent||'').replace(/\s+/g,' ').trim().toLowerCase();
  const num=(txt.match(/^(\d+)\./)||[])[1]||'';
  if(num==='1')return'gcode';
  if(num==='2')return'printer';
  if(num==='3')return'filament';
  if(num==='4')return'costs';
  if(num==='5')return'fees';
  if(num==='6')return'quantity';
  if(/^additional costs/.test(txt))return'additional';
  if(/^electricity/.test(txt))return'electricity';
  if(/^platform fees/.test(txt))return'platform';
  if(/^delivery/.test(txt))return'delivery';
  if(/^results/.test(txt))return'results';
  if(/support/.test(txt))return'support';
  return 'default';
}

function install(){
  const sections=[...document.querySelectorAll('section.panel')];
  if(!sections.length)return false;
  sections.forEach(section=>{
    const holder=section.querySelector(':scope > .head > .icon');
    if(!holder)return;
    const kind=kindFor(section,holder);
    holder.classList.add('pp-pretty-icon');
    holder.innerHTML=svg[kind]||svg.default;
    holder.setAttribute('aria-hidden','true');
    holder.dataset.iconKind=kind;
  });

  document.querySelectorAll('.merge-block .head > .icon').forEach(holder=>{
    const kind=kindFor(holder.closest('.merge-block')||holder.closest('section.panel'),holder);
    holder.classList.add('pp-pretty-icon');
    holder.innerHTML=svg[kind]||svg.default;
    holder.setAttribute('aria-hidden','true');
    holder.dataset.iconKind=kind;
  });

  document.getElementById('ppBoxIconsStyles')?.remove();
  const style=document.createElement('style');
  style.id='ppBoxIconsStyles';
  style.textContent=`
    .head>.pp-pretty-icon,
    .merge-block .head>.pp-pretty-icon{
      position:relative!important;width:44px!important;height:44px!important;min-width:44px!important;
      border-radius:13px!important;display:grid!important;place-items:center!important;
      background:linear-gradient(145deg,rgba(255,120,0,.20),rgba(255,120,0,.035))!important;
      border:1px solid rgba(255,120,0,.48)!important;
      box-shadow:inset 0 1px 0 rgba(255,255,255,.07),0 9px 24px rgba(0,0,0,.34),0 0 24px rgba(255,120,0,.11)!important;
      overflow:hidden!important;transform:translateZ(0)!important;
      transition:transform .24s ease,box-shadow .24s ease,border-color .24s ease,background .24s ease!important;
    }
    .head>.pp-pretty-icon::before,.merge-block .head>.pp-pretty-icon::before{
      content:""!important;position:absolute!important;inset:1px!important;border-radius:12px!important;
      background:linear-gradient(135deg,rgba(255,255,255,.10),transparent 44%)!important;pointer-events:none!important;
    }
    .head>.pp-pretty-icon::after,.merge-block .head>.pp-pretty-icon::after{
      content:""!important;position:absolute!important;top:-22px!important;left:-85%!important;width:46%!important;height:110px!important;
      background:linear-gradient(100deg,transparent,rgba(255,255,255,.22),transparent)!important;
      transform:rotate(18deg) translateX(0)!important;transition:transform .7s ease!important;pointer-events:none!important;
    }
    section.panel:hover > .head > .pp-pretty-icon::after,
    .merge-block:hover .head > .pp-pretty-icon::after{transform:rotate(18deg) translateX(390%)!important}
    section.panel:hover > .head > .pp-pretty-icon,
    .merge-block:hover .head > .pp-pretty-icon{
      transform:translateY(-2px) scale(1.04)!important;border-color:rgba(255,120,0,.76)!important;
      background:linear-gradient(145deg,rgba(255,120,0,.25),rgba(255,120,0,.05))!important;
      box-shadow:inset 0 1px 0 rgba(255,255,255,.10),0 12px 30px rgba(0,0,0,.42),0 0 32px rgba(255,120,0,.18)!important;
    }
    .head>.pp-pretty-icon svg,.merge-block .head>.pp-pretty-icon svg{
      position:relative!important;z-index:2!important;width:27px!important;height:27px!important;
      fill:none!important;stroke:#ff922f!important;stroke-width:1.85!important;stroke-linecap:round!important;stroke-linejoin:round!important;
      filter:drop-shadow(0 0 8px rgba(255,120,0,.34))!important;
    }
    .head>.pp-pretty-icon[data-icon-kind="costs"] svg{stroke-width:1.7!important}
    .head>.pp-pretty-icon[data-icon-kind="quantity"] svg{stroke-width:1.7!important}
    .merge-block .head>.pp-pretty-icon{width:38px!important;height:38px!important;min-width:38px!important;border-radius:11px!important}
    .merge-block .head>.pp-pretty-icon svg{width:23px!important;height:23px!important;stroke-width:1.75!important}
    @media(max-width:650px){
      .head>.pp-pretty-icon{width:39px!important;height:39px!important;min-width:39px!important;border-radius:11px!important}
      .head>.pp-pretty-icon svg{width:24px!important;height:24px!important}
      .merge-block .head>.pp-pretty-icon{width:36px!important;height:36px!important;min-width:36px!important}
      .merge-block .head>.pp-pretty-icon svg{width:22px!important;height:22px!important}
    }
    @media(prefers-reduced-motion:reduce){
      .head>.pp-pretty-icon,.merge-block .head>.pp-pretty-icon{transition:none!important}
      .head>.pp-pretty-icon::after,.merge-block .head>.pp-pretty-icon::after{display:none!important}
    }
  `;
  document.head.appendChild(style);
  return true;
}
function wait(){if(install())return;const started=Date.now();const t=setInterval(()=>{if(install()||Date.now()-started>15000)clearInterval(t)},50)}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',wait,{once:true});else wait();
})();
