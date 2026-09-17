(()=>{
'use strict';
if(window.__printProfitCleanLogoTheme)return;window.__printProfitCleanLogoTheme=true;
function install(){
 const hero=document.querySelector('.hero');
 const card=document.querySelector('.pp-hero-brand-card');
 const brand=document.querySelector('.header .brand');
 if(!hero||!card||!brand)return false;
 document.getElementById('ppCleanLogoThemeStyles')?.remove();

 // Header: clean icon + orange wordmark, no busy multi-colour image.
 brand.innerHTML='';
 brand.classList.add('pp-clean-brand');
 const hIcon=document.createElement('img');
 hIcon.src='./assets/printprofit-clean-icon.svg?v=1';
 hIcon.alt='PrintProfit';
 hIcon.className='pp-clean-brand-icon';
 const hText=document.createElement('div');
 hText.className='pp-clean-brand-text';
 hText.innerHTML='<div>Print<span>Profit</span></div><small>3D PRINTING COST &amp; PRICING CALCULATOR</small>';
 brand.append(hIcon,hText);

 // Hero card: icon-only like the supplied cleaner reference.
 const cardImg=card.querySelector('img');
 if(cardImg){
   cardImg.src='./assets/printprofit-clean-icon.svg?v=1';
   cardImg.alt='PrintProfit clean icon';
   cardImg.classList.add('pp-clean-hero-icon');
 }
 card.classList.add('pp-clean-logo-card');

 let sweep=card.querySelector('.pp-clean-logo-sweep');
 if(!sweep){sweep=document.createElement('div');sweep.className='pp-clean-logo-sweep';card.appendChild(sweep);}

 const style=document.createElement('style');
 style.id='ppCleanLogoThemeStyles';
 style.textContent=`
:root{--pp-orange:#ff7800;}
.header .brand.pp-clean-brand{display:flex!important;align-items:center!important;gap:11px!important;width:min(370px,32vw)!important;height:58px!important;}
.header .pp-clean-brand-icon{width:55px!important;height:55px!important;display:block!important;object-fit:contain!important;filter:drop-shadow(0 5px 14px #ff78002e)!important;animation:ppCleanIconFloat 6s ease-in-out infinite!important;}
.header .pp-clean-brand-text{min-width:0!important;line-height:1!important;color:#ff7800!important;text-align:left!important;}
.header .pp-clean-brand-text>div{font-size:30px!important;font-weight:900!important;letter-spacing:-.055em!important;white-space:nowrap!important;}
.header .pp-clean-brand-text>div span{font-weight:900!important;color:#ff7800!important;}
.header .pp-clean-brand-text small{display:block!important;margin-top:5px!important;font-size:7px!important;font-weight:800!important;letter-spacing:.18em!important;color:#b5c0c6!important;white-space:nowrap!important;}
.pp-hero-brand-card.pp-clean-logo-card{display:flex!important;align-items:center!important;justify-content:center!important;overflow:hidden!important;}
.pp-hero-brand-card.pp-clean-logo-card img.pp-clean-hero-icon{width:53%!important;max-width:250px!important;height:auto!important;object-fit:contain!important;display:block!important;filter:drop-shadow(0 14px 26px #000c)!important;animation:ppCleanHeroFloat 6s ease-in-out infinite!important;}
.pp-clean-logo-sweep{position:absolute!important;inset:-35%!important;pointer-events:none!important;z-index:4!important;background:linear-gradient(115deg,transparent 42%,#fff06 49%,#fff10 50%,#fff06 51%,transparent 58%)!important;transform:translateX(-65%) rotate(8deg)!important;animation:ppCleanSweep 9s ease-in-out infinite!important;}
.pp-hero-brand-card.pp-clean-logo-card .pp-card-caption{z-index:5!important;}
@keyframes ppCleanIconFloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-3px)}}
@keyframes ppCleanHeroFloat{0%,100%{transform:translateY(0) rotate(0deg)}50%{transform:translateY(-6px) rotate(-.25deg)}}
@keyframes ppCleanSweep{0%,13%{transform:translateX(-65%) rotate(8deg);opacity:0}30%{opacity:.8}53%{transform:translateX(58%) rotate(8deg);opacity:.08}100%{transform:translateX(92%) rotate(8deg);opacity:0}}
@media(max-width:1050px){.header .brand.pp-clean-brand{width:300px!important}.header .pp-clean-brand-text>div{font-size:25px!important}.header .pp-clean-brand-icon{width:48px!important;height:48px!important}}
@media(max-width:820px){.header .brand.pp-clean-brand{width:255px!important}.header .pp-clean-brand-text>div{font-size:23px!important}.header .pp-clean-brand-text small{font-size:5.6px!important;letter-spacing:.14em!important}.header .pp-clean-brand-icon{width:44px!important;height:44px!important}.pp-hero-brand-card.pp-clean-logo-card img.pp-clean-hero-icon{width:58%!important;max-width:210px!important}}
@media(max-width:560px){.header .brand.pp-clean-brand{width:215px!important;gap:8px!important}.header .pp-clean-brand-text>div{font-size:20px!important}.header .pp-clean-brand-text small{display:none!important}.header .pp-clean-brand-icon{width:39px!important;height:39px!important}.pp-hero-brand-card.pp-clean-logo-card img.pp-clean-hero-icon{width:60%!important;max-width:185px!important}}
@media(prefers-reduced-motion:reduce){.header .pp-clean-brand-icon,.pp-hero-brand-card.pp-clean-logo-card img.pp-clean-hero-icon,.pp-clean-logo-sweep{animation:none!important}}
`;
 document.head.appendChild(style);
 return true;
}
function wait(){if(install())return;const started=Date.now();const t=setInterval(()=>{if(install()||Date.now()-started>15000)clearInterval(t)},50);}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',wait,{once:true});else wait();
})();
