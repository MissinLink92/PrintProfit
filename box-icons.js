(()=>{
'use strict';
if(window.__printProfitBoxIcons)return;window.__printProfitBoxIcons=true;

const icons={
  '1':`<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M9 6h20l10 10v26H9z"/><path d="M29 6v11h10"/><path d="M24 30V19m0 0-5 5m5-5 5 5"/><path d="M16 37h16"/>` ,
  '2':`<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M13 18V8h22v10"/><path d="M12 34H8V20h32v14h-4"/><path d="M13 28h22v12H13z"/><path d="M31 24h4"/>` ,
  '3':`<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M10 14c0-4 6-7 14-7s14 3 14 7-6 7-14 7-14-3-14-7Z"/><path d="M10 14v20c0 4 6 7 14 7s14-3 14-7V14"/><path d="M10 34c0 4 6 7 14 7s14-3 14-7"/><ellipse cx="24" cy="14" rx="8" ry="3.5"/></svg>`,
  '4':`<svg viewBox="0 0 48 48" aria-hidden="true"><circle cx="18" cy="18" r="8"/><circle cx="31" cy="28" r="8"/><path d="M12 18h12m-6-6v12m9 4h8m-4-4v8"/></svg>`,
  '5':`<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M8 39V8"/><path d="M8 39h32"/><path d="m12 31 8-9 7 5 10-14"/><path d="M31 13h6v6"/></svg>`,
  '6':`<svg viewBox="0 0 48 48" aria-hidden="true"><path d="m24 7 3.2 3.8 5-.3 1.9 4.7 4.4 2.4-1.7 4.7 1.7 4.7-4.4 2.4-1.9 4.7-5-.3L24 37l-3.2-3.8-5 .3-1.9-4.7-4.4-2.4 1.7-4.7-1.7-4.7 4.4-2.4 1.9-4.7 5 .3Z"/><circle cx="24" cy="24" r="6"/><path d="M24 18v-3m0 21v-3m6-9h3m-21 0h3m13.2-4.2 2.2-2.2m-15.6 0 2.2 2.2m11.2 11.2 2.2 2.2m-15.6 0 2.2-2.2"/></svg>`
};

function iconFor(section){
  const h=section?.querySelector('.head h2');
  const txt=(h?.textContent||'').trim();
  const m=txt.match(/^(\d+)\s*\./);
  return m?.[1]||'';
}

function install(){
  const sections=[...document.querySelectorAll('section.panel')];
  if(!sections.length)return false;
  sections.forEach(section=>{
    const holder=section.querySelector(':scope > .head > .icon');
    if(!holder)return;
    const n=iconFor(section);
    if(!icons[n])return;
    holder.classList.add('pp-pretty-icon');
    holder.innerHTML=icons[n];
    holder.setAttribute('aria-hidden','true');
    holder.dataset.iconNumber=n;
  });

  document.getElementById('ppBoxIconsStyles')?.remove();
  const style=document.createElement('style');
  style.id='ppBoxIconsStyles';
  style.textContent=`
    .head>.pp-pretty-icon,
    .merge-block .head>.pp-pretty-icon{
      position:relative!important;
      width:42px!important;height:42px!important;min-width:42px!important;
      border-radius:12px!important;
      display:grid!important;place-items:center!important;
      background:linear-gradient(145deg,rgba(255,120,0,.17),rgba(255,120,0,.045))!important;
      border:1px solid rgba(255,120,0,.42)!important;
      box-shadow:inset 0 1px 0 rgba(255,255,255,.06),0 8px 22px rgba(0,0,0,.35),0 0 22px rgba(255,120,0,.10)!important;
      overflow:hidden!important;
      transform:translateZ(0)!important;
      transition:transform .22s ease,box-shadow .22s ease,border-color .22s ease!important;
    }
    .head>.pp-pretty-icon::before,
    .merge-block .head>.pp-pretty-icon::before{
      content:""!important;position:absolute!important;inset:1px!important;border-radius:11px!important;
      background:linear-gradient(135deg,rgba(255,255,255,.08),transparent 42%)!important;
      pointer-events:none!important;
    }
    .head>.pp-pretty-icon::after,
    .merge-block .head>.pp-pretty-icon::after{
      content:""!important;position:absolute!important;top:-18px!important;left:-65%!important;width:42%!important;height:95px!important;
      background:linear-gradient(100deg,transparent,rgba(255,255,255,.16),transparent)!important;
      transform:rotate(18deg) translateX(0)!important;transition:transform .65s ease!important;
      pointer-events:none!important;
    }
    section.panel:hover > .head > .pp-pretty-icon::after,
    section.panel:hover .merge-block .head > .pp-pretty-icon::after{transform:rotate(18deg) translateX(340%)!important}
    section.panel:hover > .head > .pp-pretty-icon,
    section.panel:hover .merge-block .head > .pp-pretty-icon{
      transform:translateY(-2px) scale(1.035)!important;
      border-color:rgba(255,120,0,.68)!important;
      box-shadow:inset 0 1px 0 rgba(255,255,255,.08),0 10px 26px rgba(0,0,0,.42),0 0 28px rgba(255,120,0,.16)!important;
    }
    .head>.pp-pretty-icon svg,
    .merge-block .head>.pp-pretty-icon svg{
      position:relative!important;z-index:2!important;width:26px!important;height:26px!important;
      fill:none!important;stroke:#ff8a24!important;stroke-width:1.85!important;stroke-linecap:round!important;stroke-linejoin:round!important;
      filter:drop-shadow(0 0 7px rgba(255,120,0,.35))!important;
    }
    .head>.pp-pretty-icon[data-icon-number="3"] svg{stroke-width:1.65!important}
    .head>.pp-pretty-icon[data-icon-number="4"] svg{stroke-width:1.7!important}
    .head>.pp-pretty-icon[data-icon-number="6"] svg{stroke-width:1.55!important}
    @media(max-width:650px){
      .head>.pp-pretty-icon,.merge-block .head>.pp-pretty-icon{width:38px!important;height:38px!important;min-width:38px!important;border-radius:11px!important}
      .head>.pp-pretty-icon svg,.merge-block .head>.pp-pretty-icon svg{width:23px!important;height:23px!important}
    }
    @media(prefers-reduced-motion:reduce){.head>.pp-pretty-icon,.merge-block .head>.pp-pretty-icon{transition:none!important}.head>.pp-pretty-icon::after,.merge-block .head>.pp-pretty-icon::after{display:none!important}}
  `;
  document.head.appendChild(style);
  return true;
}

function wait(){
  if(install())return;
  const started=Date.now();
  const timer=setInterval(()=>{if(install()||Date.now()-started>15000)clearInterval(timer)},50);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',wait,{once:true});else wait();
})();
