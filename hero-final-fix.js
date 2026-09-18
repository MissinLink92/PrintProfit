(()=>{"use strict";
function boot(){
 const hero=document.querySelector(".hero"), header=document.querySelector(".header"), brand=document.querySelector(".brand"), nav=document.querySelector(".nav");
 if(!hero)return;
 if(header)header.classList.add("pp-final-header");
 if(brand)brand.classList.add("pp-final-brand");
 if(nav)nav.classList.add("pp-final-nav");
 hero.innerHTML='<div class="pp-final-hero"><div class="pp-final-copy"><div class="pp-final-kicker">3D PRINTING COST & PRICING</div><h1>Know what it <em>costs.</em><br>Know what to <em>charge.</em></h1><p>Upload your sliced print file and let PrintProfit turn real printer data into a clear cost, selling price and profit.</p><div class="pp-final-actions"><a href="#calculator" class="pp-final-primary">Calculate a print <b>→</b></a><a href="#guides" class="pp-final-secondary">How it works</a></div></div><div class="pp-final-art"><img src="./assets/hero-art-orange.webp?v=final1" alt="3D printing models"></div><div class="pp-final-card"><div class="pp-final-slogan">Print Smarter.<br>Price Better.<br>Profit More.</div><img src="./assets/printprofit-header-logo.webp?v=final1" alt="PrintProfit"><div class="pp-final-card-meta">CALCULATE &nbsp; • &nbsp; PRICE &nbsp; • &nbsp; PROFIT</div></div><div class="pp-final-features"><div><b>▣</b><span>ACCURATE COSTS</span></div><div><b>◇</b><span>ANY SLICER</span></div><div><b>▥</b><span>REAL MATERIAL USAGE</span></div><div><b>⚙</b><span>PRINTER PROFILES</span></div><div><b>▰</b><span>DELIVERY & FEES</span></div></div></div>';
 const style=document.createElement("style");
 style.textContent=\`
.pp-final-header{min-height:66px;height:66px;padding:7px 14px;background:#071018;border-bottom:1px solid #243d49;gap:18px}
.pp-final-brand{min-width:220px}.pp-final-brand img{width:205px!important;height:51px!important;object-fit:contain}
.pp-final-nav{gap:5px}.pp-final-nav a{padding:9px 12px!important;font-weight:700}.pp-final-nav a.active{color:#fff;background:#14232d}
.pp-final-hero{position:relative;min-height:388px;overflow:hidden;background:linear-gradient(120deg,#071018,#0a1821 62%,#071018);border-bottom:1px solid #263f4a}
.pp-final-hero:before{content:"";position:absolute;inset:0;background-image:linear-gradient(#ffffff08 1px,transparent 1px),linear-gradient(90deg,#ffffff08 1px,transparent 1px);background-size:42px 42px}
.pp-final-copy{position:absolute;z-index:2;left:4%;top:31px;width:43%}
.pp-final-kicker{font-size:11px;font-weight:800;letter-spacing:2px;color:#ff7800;margin-bottom:14px}.pp-final-kicker:before{content:"";display:inline-block;width:32px;height:2px;background:#ff7800;vertical-align:middle;margin-right:11px}
.pp-final-copy h1{margin:0;font-size:clamp(42px,4.1vw,66px);line-height:.98;letter-spacing:-2.5px;font-weight:900;color:#f7f9fa}.pp-final-copy h1 em{font-style:normal;color:#ff7800}
.pp-final-copy p{max-width:600px;margin:17px 0 20px;color:#b5c1c9;font-size:14px;line-height:1.45}
.pp-final-actions{display:flex;gap:9px}.pp-final-actions a{display:inline-flex;align-items:center;text-decoration:none;border-radius:9px;padding:11px 16px;font-size:13px;font-weight:800}.pp-final-primary{background:#ff7800;color:#fff;box-shadow:0 8px 20px #0004}.pp-final-primary b{margin-left:12px}.pp-final-secondary{color:#e8eef1;border:1px solid #39515d;background:#0c1a23}
.pp-final-art{position:absolute;z-index:1;left:38%;top:22px;width:35%;height:300px;display:flex;align-items:center;justify-content:center}.pp-final-art img{width:100%;height:100%;object-fit:contain;filter:drop-shadow(0 14px 22px #0008)}
.pp-final-card{position:absolute;z-index:3;right:4%;top:36px;width:22%;height:265px;border:1px solid #334b56;border-radius:19px;background:linear-gradient(145deg,#14252e,#0a151d);box-shadow:0 16px 35px #0005;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:15px}
.pp-final-slogan{color:#ff7800;font-size:21px;line-height:1.08;font-weight:800;font-style:italic;margin-bottom:15px;text-shadow:0 2px 5px #000}
.pp-final-card img{width:88%;max-width:250px;height:auto;max-height:105px;object-fit:contain}.pp-final-card-meta{position:absolute;bottom:13px;font-size:7px;letter-spacing:2px;color:#aebbc2;font-weight:800}
.pp-final-features{position:absolute;z-index:4;left:4%;right:4%;bottom:0;height:58px;border-top:1px solid #29414c;display:grid;grid-template-columns:repeat(5,1fr);align-items:center}
.pp-final-features>div{height:32px;display:flex;align-items:center;justify-content:center;gap:9px;border-right:1px solid #29414c;color:#c2cbd0;font-size:9px;font-weight:800}.pp-final-features>div:last-child{border:0}.pp-final-features b{font-size:20px;color:#ff7800;font-weight:400}
@media(max-width:1050px){.pp-final-copy{width:52%}.pp-final-art{left:44%;width:31%}.pp-final-card{right:2%;width:25%}}
@media(max-width:750px){.pp-final-header{height:auto;min-height:66px;flex-wrap:wrap}.pp-final-brand{min-width:0}.pp-final-brand img{width:175px!important;height:auto}.pp-final-nav{order:3;width:100%;overflow:auto;justify-content:flex-start}.pp-final-hero{min-height:720px}.pp-final-copy{position:relative;left:auto;top:auto;width:auto;padding:35px 20px 0}.pp-final-copy h1{font-size:43px}.pp-final-art{left:10%;top:270px;width:80%;height:220px}.pp-final-card{right:20px;top:475px;width:230px;height:190px}.pp-final-features{left:15px;right:15px;height:100px;grid-template-columns:repeat(2,1fr)}.pp-final-features>div{border:0}}
\`;
 document.head.appendChild(style);
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",boot,{once:true});else boot();
})();