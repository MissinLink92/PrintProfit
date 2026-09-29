(()=>{
'use strict';
const id='ppHeroFinalPolish';
if(document.getElementById(id))return;
const s=document.createElement('style');
s.id=id;
s.textContent=`#ppCleanTop .pp-top-body{min-height:360px!important;padding:12px 3.1% 10px!important}
#ppCleanTop .pp-hero-background{inset:0!important;width:100%!important;height:100%!important;object-fit:cover!important;object-position:center bottom!important;opacity:1!important;filter:contrast(1.08) saturate(1.08) brightness(1.04)!important}
#ppCleanTop .pp-top-body:after{background:linear-gradient(90deg,rgba(4,12,18,.97) 0%,rgba(4,12,18,.82) 27%,rgba(4,12,18,.42) 53%,rgba(4,12,18,.17) 100%),linear-gradient(180deg,rgba(4,12,18,.12),rgba(4,12,18,.18))!important}
#ppCleanTop .pp-top-card{width:min(330px,31vw)!important;height:248px!important;margin-top:2px!important;border-radius:22px!important;background:rgba(5,18,27,.68)!important}
#ppCleanTop .pp-card-tagline{font-size:25px!important;line-height:1.02!important;letter-spacing:-.01em!important}
@media(max-width:900px){#ppCleanTop .pp-top-body{min-height:340px!important}#ppCleanTop .pp-top-card{width:min(350px,42vw)!important}}`;
document.head.appendChild(s);
})();