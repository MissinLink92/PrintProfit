(()=>{
'use strict';
if(window.__printProfitHeroFeatureIcons)return;window.__printProfitHeroFeatureIcons=true;

const iconSvg=[
`<svg viewBox="0 0 48 48" aria-hidden="true"><rect x="12" y="5" width="24" height="38" rx="3"/><rect x="17" y="10" width="14" height="7" rx="1"/><circle cx="18" cy="24" r="2"/><circle cx="24" cy="24" r="2"/><circle cx="30" cy="24" r="2"/><circle cx="18" cy="31" r="2"/><circle cx="24" cy="31" r="2"/><circle cx="30" cy="31" r="2"/><path d="M18 38h12"/></svg>`,
`<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M24 5 42 15v18L24 43 6 33V15Z"/><path d="m6 15 18 10 18-10M24 25v18"/></svg>`,
`<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M7 41V9M7 41h34"/><rect x="12" y="28" width="6" height="9" rx="1"/><rect x="21" y="21" width="6" height="16" rx="1"/><rect x="30" y="12" width="6" height="25" rx="1"/></svg>`,
`<svg viewBox="0 0 48 48" aria-hidden="true"><path d="m24 7 3 4 5-1 2 5 5 2-2 5 2 5-5 2-2 5-5-1-3 4-3-4-5 1-2-5-5-2 2-5-2-5 5-2 2-5 5 1Z"/><circle cx="24" cy="24" r="6"/></svg>`,
`<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M5 13h25v23H5z"/><path d="M30 20h8l5 7v9h-13zM12 36a4 4 0 1 0 8 0M34 36a4 4 0 1 0 8 0"/></svg>`,
`<svg viewBox="0 0 48 48" aria-hidden="true"><ellipse cx="24" cy="11" rx="13" ry="5"/><path d="M11 11v22c0 3 6 5 13 5s13-2 13-5V11M11 22c0 3 6 5 13 5s13-2 13-5M11 33c0 3 6 5 13 5s13-2 13-5"/></svg>`
];

function install(){
  const ticker=document.querySelector('.hero .pp-chosen-ticker');
  if(!ticker)return false;
  const spans=[...ticker.querySelectorAll('span')];
  if(!spans.length)return false;
  spans.forEach((span,i)=>{
    if(span.querySelector('svg'))return;
    const wrap=document.createElement('span');
    wrap.className='pp-feature-item';
    wrap.innerHTML=iconSvg[i%iconSvg.length]+'<b>'+span.textContent+'</b>';
    span.replaceWith(wrap);
  });
  document.getElementById('ppHeroFeatureIconStyles')?.remove();
  const style=document.createElement('style');
  style.id='ppHeroFeatureIconStyles';
  style.textContent=`
.hero .pp-chosen-ticker{grid-template-columns:repeat(5,1fr)!important;align-items:center!important;padding-top:10px!important}
.hero .pp-chosen-ticker .pp-feature-item{display:flex!important;align-items:center!important;justify-content:center!important;gap:12px!important;text-align:left!important;color:#a6b8c1!important;font-size:9px!important;font-weight:750!important;letter-spacing:.04em!important;line-height:1.2!important}
.hero .pp-chosen-ticker .pp-feature-item svg{width:32px!important;height:32px!important;min-width:32px!important;fill:none!important;stroke:#ff8a24!important;stroke-width:1.8!important;stroke-linecap:round!important;stroke-linejoin:round!important;filter:drop-shadow(0 0 7px rgba(255,120,0,.32))!important}
.hero .pp-chosen-ticker .pp-feature-item b{font-weight:750!important;color:#c1cdd3!important}
.hero .pp-chosen-ticker .pp-feature-item+ .pp-feature-item{border-left:1px solid #24424f!important;padding-left:10px!important}
@media(max-width:1050px){.hero .pp-chosen-ticker .pp-feature-item{gap:8px!important;font-size:8px!important}.hero .pp-chosen-ticker .pp-feature-item svg{width:28px!important;height:28px!important;min-width:28px!important}}
@media(max-width:820px){.hero .pp-chosen-ticker{grid-template-columns:repeat(3,1fr)!important}.hero .pp-chosen-ticker .pp-feature-item:nth-child(n+4){display:none!important}}
@media(max-width:560px){.hero .pp-chosen-ticker .pp-feature-item{gap:6px!important;font-size:7px!important}.hero .pp-chosen-ticker .pp-feature-item svg{width:24px!important;height:24px!important;min-width:24px!important}}
@media(prefers-reduced-motion:reduce){.hero .pp-chosen-ticker .pp-feature-item svg{filter:none!important}}
`;
  document.head.appendChild(style);
  return true;
}
function wait(){if(install())return;const started=Date.now();const t=setInterval(()=>{if(install()||Date.now()-started>15000)clearInterval(t)},50)}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',wait,{once:true});else wait();
})();