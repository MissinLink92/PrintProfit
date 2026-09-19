(()=>{
'use strict';
if(window.__printProfitBoxIcons)return;window.__printProfitBoxIcons=true;

const icons={
  '1':`<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M9 6h20l10 10v26H9z"/><path d="M29 6v11h10"/><path d="M24 30V19m0 0-5 5m5-5 5 5"/><path d="M16 37h16"/></svg>`,
  '2':`<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M13 18V8h22v10"/><path d="M12 34H8V20h32v14h-4"/><path d="M13 28h22v12H13z"/><path d="M31 24h4"/></svg>`,
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
    /* PrintProfit unified icon system V2 */
    .head>.pp-pretty-icon,
    .merge-block .head>.pp-pretty-icon{
      position:relative!important;
      width:50px!important;height:50px!important;min-width:50px!important;
      flex:0 0 50px!important;
      border-radius:50%!important;
      display:grid!important;place-items:center!important;
      background:radial-gradient(circle at 34% 28%,rgba(255,255,255,.06),rgba(255,120,0,.035) 42%,rgba(255,120,0,.012) 72%)!important;
      border:2px solid rgba(255,120,0,.72)!important;
      box-shadow:inset 0 0 0 1px rgba(255,120,0,.10),inset 0 1px 0 rgba(255,255,255,.08),0 7px 18px rgba(0,0,0,.34),0 0 20px rgba(255,120,0,.10)!important;
      overflow:hidden!important;
      transform:translateZ(0)!important;
    }
    .head>.pp-pretty-icon::before,
    .merge-block .head>.pp-pretty-icon::before{
      content:""!important;position:absolute!important;inset:5px!important;border-radius:50%!important;
      border:1px solid rgba(255,120,0,.12)!important;pointer-events:none!important;
    }
    .head>.pp-pretty-icon::after,
    .merge-block .head>.pp-pretty-icon::after{
      content:""!important;position:absolute!important;inset:-35%!important;
      background:linear-gradient(115deg,transparent 45%,rgba(255,255,255,.13) 50%,transparent 55%)!important;
      transform:translateX(-70%) rotate(12deg)!important;transition:transform .72s ease!important;pointer-events:none!important;
    }
    /* Keep hover visually stable — no sweeping highlight or colour flash. */
    section.panel:hover>.head>.pp-pretty-icon::after,
    section.panel:hover .merge-block .head>.pp-pretty-icon::after{transform:translateX(-70%) rotate(12deg)!important}
    section.panel:hover>.head>.pp-pretty-icon,
    section.panel:hover .merge-block .head>.pp-pretty-icon{
      border-color:rgba(255,120,0,.92)!important;
      box-shadow:inset 0 0 0 1px rgba(255,120,0,.14),inset 0 1px 0 rgba(255,255,255,.10),0 10px 24px rgba(0,0,0,.40),0 0 28px rgba(255,120,0,.18)!important;
    }
    .head>.pp-pretty-icon svg,
    .merge-block .head>.pp-pretty-icon svg{
      position:relative!important;z-index:2!important;
      width:34px!important;height:34px!important;display:block!important;
      fill:none!important;stroke:#ff8a24!important;stroke-width:2.65!important;
      stroke-linecap:round!important;stroke-linejoin:round!important;
      filter:drop-shadow(0 0 7px rgba(255,120,0,.34))!important;
    }
    /* Optical sizing: the artwork itself has different natural footprints, so these tiny corrections make the symbols read at the same visual size. */
    .head>.pp-pretty-icon[data-icon-number="1"] svg{transform:scale(.92)!important}
    .head>.pp-pretty-icon[data-icon-number="2"] svg{transform:scale(.92)!important}
    .head>.pp-pretty-icon[data-icon-number="3"] svg{transform:scale(.86)!important}
    .head>.pp-pretty-icon[data-icon-number="4"] svg{transform:scale(.88)!important}
    .head>.pp-pretty-icon[data-icon-number="5"] svg{transform:scale(.91)!important}
    .head>.pp-pretty-icon[data-icon-number="6"] svg{transform:scale(.86)!important}
    .head>.pp-pretty-icon[data-icon-number="3"] svg,
    .head>.pp-pretty-icon[data-icon-number="6"] svg{stroke-width:1.7!important}
    .merge-block .head>.pp-pretty-icon svg{width:34px!important;height:34px!important}
    @media(max-width:650px){
      .head>.pp-pretty-icon,.merge-block .head>.pp-pretty-icon{width:46px!important;height:46px!important;min-width:46px!important;flex-basis:46px!important}
      .head>.pp-pretty-icon svg,.merge-block .head>.pp-pretty-icon svg{width:32px!important;height:32px!important}
    }
    @media(prefers-reduced-motion:reduce){.head>.pp-pretty-icon::after,.merge-block .head>.pp-pretty-icon::after{display:none!important}}
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