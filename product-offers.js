(()=>{
'use strict';
const offers=()=>Array.isArray(window.PRINTPROFIT_OFFERS)?window.PRINTPROFIT_OFFERS:[];
const safeUrl=value=>{try{const u=new URL(value);return u.protocol==='https:'?u.href:null;}catch{return null;}};
function matching(product,now=Date.now()){
 return offers().filter(o=>o.approved===true&&o.retailer===product.retailer&&
  Array.isArray(o.productIds)&&o.productIds.includes(String(product.id))&&
  Number.isFinite(Date.parse(o.expiresAt))&&Date.parse(o.expiresAt)>now&&
  (!o.startsAt||(Number.isFinite(Date.parse(o.startsAt))&&Date.parse(o.startsAt)<=now))&&
  o.title&&o.terms&&o.lastChecked&&safeUrl(o.url));
}
function start(){
 const dialog=document.createElement('dialog');dialog.className='pp-offers-dialog';dialog.setAttribute('aria-labelledby','ppOffersTitle');
 dialog.innerHTML='<div class="pp-offers-heading"><h2 id="ppOffersTitle">Available offers</h2><button type="button" aria-label="Close offers">Close ×</button></div><p class="pp-offers-product"></p><div class="pp-offers-list"></div><p>Eligibility can vary. Check the retailer’s terms and final checkout price.</p><p role="status" class="pp-offers-status"></p>';
 document.body.append(dialog);dialog.querySelector('button').onclick=()=>dialog.close();
 dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}});
 let activeProduct=null;
 const make=(tag,text)=>{const e=document.createElement(tag);if(text)e.textContent=text;return e;};
 function fill(){
  if(!activeProduct)return;const list=dialog.querySelector('.pp-offers-list');list.replaceChildren();dialog.querySelector('.pp-offers-status').textContent='';
  const available=matching(activeProduct);
  if(!available.length)list.append(make('p','There are no current approved offers for this product.'));
  available.forEach(o=>{
   const card=make('article');card.append(make('h3',o.title),make('p',o.terms));
   if(o.code){const row=make('p');row.append(make('code',o.code));const copy=make('button','Copy code');copy.type='button';copy.onclick=async()=>{
    try{await navigator.clipboard.writeText(o.code);dialog.querySelector('.pp-offers-status').textContent='Code copied.';}
    catch{dialog.querySelector('.pp-offers-status').textContent='Copy unavailable. Select and copy the visible code manually.';}
   };row.append(copy);card.append(row);}else card.append(make('p','No code needed.'));
   card.append(make('p','Expires: '+new Date(o.expiresAt).toLocaleString('en-GB')+' • Last checked: '+o.lastChecked));
   if(o.affiliate)card.append(make('p','Affiliate link: we may earn commission if you buy, at no extra cost to you.'));
   const link=make('a','Visit retailer ↗'+(o.affiliate?' · 🔗 Affiliate':''));link.href=safeUrl(o.url);link.target='_blank';link.rel=o.affiliate?'sponsored noopener':'noopener';card.append(link);list.append(card);
  });
 }
 function refresh(){
  document.querySelectorAll('#rows [data-details-id],#cardGrid [data-details-id]').forEach(details=>{
   const parent=details.parentElement;const product=(window.PRINTPROFIT_PRICE_DATA?.products||[]).find(p=>String(p.id)===details.dataset.detailsId);if(!product)return;
   const existing=parent.querySelector('.pp-offers-button');const count=matching(product).length;
   if(!count){existing?.remove();return;}if(existing)return;
   const button=make('button','🏷 Coupons & deals ('+count+')');button.type='button';button.className='link pp-offers-button';button.setAttribute('aria-haspopup','dialog');button.setAttribute('aria-label','Coupons and deals for '+product.name);button.onclick=()=>{activeProduct=product;dialog.querySelector('.pp-offers-product').textContent=product.name;fill();dialog.showModal();};parent.append(button);
  });
 }
 const observer=new MutationObserver(refresh);for(const id of ['rows','cardGrid']){const root=document.getElementById(id);if(root)observer.observe(root,{childList:true,subtree:true});}
 refresh();setInterval(()=>{refresh();if(dialog.open)fill();},60000);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start);else start();
})();
