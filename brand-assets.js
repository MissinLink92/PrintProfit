(()=>{'use strict';
if(window.__printProfitBrandAssets)return;window.__printProfitBrandAssets=true;
function install(){
 const brand=document.querySelector('.header .brand img');
 const hero=document.querySelector('.hero img');
 if(!brand&&!hero)return false;
 document.getElementById('ppBrandAssetStyles')?.remove();
 const style=document.createElement('style');style.id='ppBrandAssetStyles';
 style.textContent=`
/* Official PrintProfit artwork supplied for the site header and hero. */
.header .brand{
 min-width:260px!important;
 display:flex!important;
 align-items:center!important;
}
.header .brand img{
 content:url('./assets/printprofit-header-logo.webp')!important;
 width:260px!important;
 height:auto!important;
 max-height:68px!important;
 object-fit:contain!important;
 display:block!important;
}
.hero{
 display:flex!important;
 align-items:center!important;
 justify-content:center!important;
 min-height:300px!important;
 padding:20px 18px 24px!important;
 overflow:hidden!important;
 background:#06111a!important;
}
.hero img{
 content:url('./assets/printprofit-logo.webp')!important;
 width:min(430px,72vw)!important;
 height:auto!important;
 max-height:340px!important;
 object-fit:contain!important;
 margin:0 auto!important;
 filter:drop-shadow(0 18px 30px rgba(0,0,0,.28))!important;
}
@media(max-width:900px){
 .header .brand{min-width:220px!important}
 .header .brand img{width:220px!important;max-height:58px!important}
 .hero{min-height:260px!important;padding:16px 12px 20px!important}
 .hero img{width:min(390px,82vw)!important;max-height:300px!important}
}
@media(max-width:650px){
 .header{gap:10px!important;padding:8px 12px!important}
 .header .brand{min-width:0!important;flex:1!important}
 .header .brand img{width:min(210px,54vw)!important;max-height:52px!important}
 .hero{min-height:230px!important}
 .hero img{width:min(340px,88vw)!important;max-height:270px!important}
}
`;
 document.head.appendChild(style);
 if(brand)brand.src='./assets/printprofit-header-logo.webp';
 if(hero)hero.src='./assets/printprofit-logo.webp';
 return true;
}
function boot(){if(install())return;const t=setInterval(()=>{if(install())clearInterval(t)},50);setTimeout(()=>clearInterval(t),15000)}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();