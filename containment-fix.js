(()=>{
'use strict';
if(window.__printProfitContainmentFix)return;window.__printProfitContainmentFix=true;
function install(){
 const hero=document.querySelector('.hero');
 const stage=document.querySelector('.pp-chosen-stage');
 const card=document.querySelector('.pp-hero-brand-card');
 if(!hero||!stage||!card)return false;
 document.getElementById('ppContainmentStyles')?.remove();
 const style=document.createElement('style');
 style.id='ppContainmentStyles';
 style.textContent=`
/* PrintProfit contained hero V1 */
.hero.pp-signature-hero,.hero.pp-chosen-hero,.hero{
  box-sizing:border-box!important;
  overflow:hidden!important;
}
.pp-chosen-stage{box-sizing:border-box!important;min-width:0!important;min-height:0!important;overflow:hidden!important}
.pp-hero-brand-card,.pp-hero-brand-card.pp-contained-brand-card{
  box-sizing:border-box!important;min-width:0!important;min-height:0!important;overflow:hidden!important;
}
.pp-hero-brand-card img{max-width:100%!important;max-height:100%!important;object-fit:contain!important}
.pp-card-sweep,.pp-card-glow{pointer-events:none!important}

@media(max-width:820px){
  .hero.pp-signature-hero,.hero.pp-chosen-hero,.hero{
    height:500px!important;min-height:500px!important;padding:0!important;
  }
  .pp-chosen-stage{
    position:absolute!important;inset:0!important;
    display:grid!important;grid-template-columns:1fr!important;grid-template-rows:minmax(0,1fr)!important;
    gap:0!important;padding:20px 18px 74px!important;
    align-items:center!important;overflow:hidden!important;
  }
  .pp-hero-copy2{
    position:absolute!important;left:22px!important;top:24px!important;max-width:55%!important;z-index:5!important;
  }
  .pp-hero-copy2 h1{font-size:clamp(30px,8vw,44px)!important;line-height:.96!important}
  .pp-hero-copy2 p{font-size:12px!important;line-height:1.4!important;max-width:92%!important;margin-top:12px!important}
  .pp-hero-buttons{margin-top:12px!important;flex-wrap:wrap!important}
  .pp-main-cta,.pp-ghost-cta{padding:9px 11px!important;font-size:11px!important}
  .pp-hero-brand-card.pp-contained-brand-card{
    position:absolute!important;left:18px!important;right:18px!important;top:16px!important;bottom:72px!important;
    width:auto!important;height:auto!important;max-width:none!important;aspect-ratio:auto!important;
    border-radius:20px!important;transform:none!important;
    display:flex!important;align-items:center!important;justify-content:center!important;
  }
  .pp-hero-brand-card.pp-contained-brand-card img{
    width:min(76%,390px)!important;height:auto!important;max-height:58%!important;
    margin-top:26px!important;
  }
  .pp-card-caption{bottom:12px!important;font-size:7px!important;gap:8px!important;letter-spacing:.14em!important}
  .pp-brand-slogan{
    position:absolute!important;right:28px!important;top:24px!important;z-index:8!important;
    max-width:72%!important;font-size:clamp(16px,4.2vw,23px)!important;line-height:.95!important;
    letter-spacing:.16em!important;text-align:right!important;
  }
  .pp-chosen-ticker{
    left:18px!important;right:18px!important;bottom:12px!important;top:auto!important;
    width:auto!important;box-sizing:border-box!important;
    grid-template-columns:repeat(3,minmax(0,1fr))!important;
    padding-top:8px!important;gap:0!important;
  }
  .pp-chosen-ticker span{font-size:7px!important;line-height:1.15!important;white-space:normal!important}
  .pp-chosen-ticker span:nth-child(n+4){display:none!important}
}
@media(max-width:560px){
  .hero.pp-signature-hero,.hero.pp-chosen-hero,.hero{height:430px!important;min-height:430px!important}
  .pp-chosen-stage{padding:14px 10px 62px!important}
  .pp-hero-copy2{left:18px!important;top:20px!important;max-width:48%!important}
  .pp-hero-copy2 .pp-kicker{font-size:7px!important;letter-spacing:.14em!important}
  .pp-hero-copy2 h1{font-size:29px!important;line-height:.98!important}
  .pp-hero-copy2 p{font-size:10px!important;max-width:100%!important}
  .pp-hero-buttons{display:none!important}
  .pp-hero-brand-card.pp-contained-brand-card{left:9px!important;right:9px!important;top:8px!important;bottom:60px!important;border-radius:18px!important}
  .pp-hero-brand-card.pp-contained-brand-card img{width:min(68%,310px)!important;max-height:52%!important;margin-top:18px!important}
  .pp-brand-slogan{right:18px!important;top:15px!important;font-size:16px!important;max-width:60%!important;letter-spacing:.13em!important}
  .pp-card-caption{display:none!important}
  .pp-chosen-ticker{left:9px!important;right:9px!important;bottom:8px!important;padding-top:7px!important}
  .pp-chosen-ticker span{font-size:6.5px!important}
}
`;
 document.head.appendChild(style);
 return true;
}
function wait(){if(install())return;const start=Date.now();const t=setInterval(()=>{if(install()||Date.now()-start>15000)clearInterval(t)},50)}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',wait,{once:true});else wait();
})();
