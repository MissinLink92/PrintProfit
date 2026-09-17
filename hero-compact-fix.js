(()=>{
'use strict';
if(window.__printProfitHeroCompactFix)return;window.__printProfitHeroCompactFix=true;
function install(){
 const hero=document.querySelector('.hero');
 const stage=document.querySelector('.pp-chosen-stage');
 const card=document.querySelector('.pp-hero-brand-card');
 const ticker=document.querySelector('.pp-chosen-ticker');
 if(!hero||!stage||!card||!ticker)return false;
 document.getElementById('ppHeroCompactFixStyles')?.remove();
 const style=document.createElement('style');
 style.id='ppHeroCompactFixStyles';
 style.textContent=`
/* Keep the hero composition compact: branding stays above the ticker and nothing overlaps. */
.pp-chosen-hero,.pp-signature-hero{overflow:hidden!important;}
@media(min-width:1051px){
 .hero.pp-chosen-hero,.hero.pp-signature-hero,.hero{height:390px!important;min-height:390px!important;overflow:hidden!important;}
 .pp-chosen-stage{position:absolute!important;inset:0!important;display:grid!important;grid-template-columns:minmax(0,1fr) 420px!important;align-items:center!important;gap:32px!important;padding:26px clamp(28px,6.8vw,108px) 76px!important;box-sizing:border-box!important;overflow:hidden!important;}
 .pp-hero-copy2{max-width:700px!important;align-self:center!important;}
 .pp-hero-copy2 h1{font-size:clamp(42px,4.55vw,68px)!important;line-height:.94!important;margin-top:13px!important;}
 .pp-hero-copy2 p{max-width:610px!important;margin-top:17px!important;font-size:15px!important;line-height:1.48!important;}
 .pp-hero-buttons{margin-top:21px!important;}
 .pp-hero-brand-card.pp-contained-brand-card{justify-self:end!important;align-self:center!important;width:420px!important;height:270px!important;aspect-ratio:auto!important;max-width:none!important;overflow:hidden!important;border-radius:20px!important;transform:perspective(1000px) rotateY(-3deg) rotateX(1deg)!important;}
 .pp-hero-brand-card.pp-contained-brand-card:hover{transform:perspective(1000px) rotateY(-1deg) rotateX(0deg) translateY(-3px)!important;}
 .pp-hero-brand-card img{width:74%!important;max-width:320px!important;height:auto!important;object-fit:contain!important;}
 .pp-card-caption{bottom:12px!important;font-size:7px!important;gap:9px!important;}
 .pp-chosen-ticker{left:clamp(28px,6.8vw,108px)!important;right:clamp(28px,6.8vw,108px)!important;bottom:13px!important;top:auto!important;padding-top:9px!important;min-height:34px!important;box-sizing:border-box!important;}
 .pp-chosen-ticker span{font-size:8px!important;line-height:1.1!important;white-space:nowrap!important;}
}
@media(min-width:821px) and (max-width:1050px){
 .hero.pp-chosen-hero,.hero.pp-signature-hero,.hero{height:430px!important;min-height:430px!important;overflow:hidden!important;}
 .pp-chosen-stage{position:absolute!important;inset:0!important;display:grid!important;grid-template-columns:minmax(0,1fr) 330px!important;align-items:center!important;gap:22px!important;padding:24px 34px 72px!important;box-sizing:border-box!important;overflow:hidden!important;}
 .pp-hero-copy2 h1{font-size:48px!important;line-height:.94!important;}
 .pp-hero-copy2 p{font-size:14px!important;max-width:520px!important;}
 .pp-hero-brand-card.pp-contained-brand-card{width:330px!important;height:230px!important;aspect-ratio:auto!important;max-width:none!important;overflow:hidden!important;}
 .pp-hero-brand-card img{width:72%!important;max-width:245px!important;}
 .pp-card-caption{bottom:10px!important;font-size:6.5px!important;gap:8px!important;}
 .pp-chosen-ticker{left:34px!important;right:34px!important;bottom:11px!important;padding-top:8px!important;min-height:31px!important;}
 .pp-chosen-ticker span{font-size:7px!important;white-space:nowrap!important;}
}
@media(max-width:820px){
 .hero.pp-chosen-hero,.hero.pp-signature-hero,.hero{height:430px!important;min-height:430px!important;overflow:hidden!important;}
 .pp-chosen-stage{position:absolute!important;inset:0!important;display:block!important;padding:0!important;overflow:hidden!important;}
 .pp-hero-copy2{display:none!important;}
 .pp-hero-brand-card.pp-contained-brand-card{position:absolute!important;left:50%!important;top:48px!important;bottom:auto!important;width:min(340px,78vw)!important;height:228px!important;aspect-ratio:auto!important;max-width:none!important;transform:translateX(-50%)!important;border-radius:18px!important;}
 .pp-hero-brand-card.pp-contained-brand-card:hover{transform:translateX(-50%)!important;}
 .pp-hero-brand-card img{width:72%!important;max-width:none!important;}
 .pp-card-caption{bottom:11px!important;font-size:7px!important;gap:8px!important;}
 .pp-chosen-ticker{left:14px!important;right:14px!important;bottom:10px!important;top:auto!important;padding-top:8px!important;min-height:30px!important;box-sizing:border-box!important;}
 .pp-chosen-ticker span{font-size:7px!important;line-height:1.1!important;white-space:nowrap!important;}
}
@media(max-width:560px){
 .hero.pp-chosen-hero,.hero.pp-signature-hero,.hero{height:390px!important;min-height:390px!important;}
 .pp-hero-brand-card.pp-contained-brand-card{top:42px!important;width:min(310px,76vw)!important;height:200px!important;}
 .pp-hero-brand-card img{width:70%!important;}
 .pp-card-caption{bottom:9px!important;font-size:6.5px!important;gap:7px!important;}
 .pp-chosen-ticker{left:8px!important;right:8px!important;bottom:7px!important;padding-top:7px!important;min-height:28px!important;}
 .pp-chosen-ticker span{font-size:6.5px!important;letter-spacing:.08em!important;}
}
`;
 document.head.appendChild(style);
 return true;
}
function wait(){if(install())return;const start=Date.now();const timer=setInterval(()=>{if(install()||Date.now()-start>15000)clearInterval(timer)},50);}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',wait,{once:true});else wait();
})();
