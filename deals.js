(()=>{'use strict';
const host=document.getElementById('deals-list');if(!host)return;
const safeUrl=value=>{try{const url=new URL(value);return url.protocol==='https:'?url.href:null}catch{return null}};
const now=Date.now();
const records=Array.isArray(window.PRINTPROFIT_OFFERS)?window.PRINTPROFIT_OFFERS:[];
const valid=records.filter(o=>o.approved===true&&o.title&&o.terms&&o.retailer&&
 Array.isArray(o.productIds)&&o.productIds.length>0&&safeUrl(o.url)&&
 Number.isFinite(Date.parse(o.expiresAt))&&Date.parse(o.expiresAt)>now&&
 (!o.startsAt||(Number.isFinite(Date.parse(o.startsAt))&&Date.parse(o.startsAt)<=now))&&
 Number.isFinite(Date.parse(o.lastChecked))&&Date.parse(o.lastChecked)<=now&&now-Date.parse(o.lastChecked)<=7*86400000);
host.replaceChildren();
const make=(tag,value)=>{const el=document.createElement(tag);if(value)el.textContent=value;return el};
if(!valid.length){const empty=make('p');empty.className='empty-state';empty.append(make('strong','No verified offers right now.'),make('span','We only show offers with confirmed terms and a recent check. Browse the product comparison while we verify new ones.'));host.append(empty);return}
valid.sort((a,b)=>Date.parse(a.expiresAt)-Date.parse(b.expiresAt));
for(const offer of valid){
 const card=make('article');card.className='offer-card';
 if(offer.affiliate){const ad=make('strong','Ad');ad.className='ad-label';card.append(ad)}
 card.append(make('h3',offer.title),make('p',offer.terms));
 if(offer.code){const row=make('p');row.append(make('code',offer.code));const button=make('button','Copy code');button.type='button';button.addEventListener('click',async()=>{try{await navigator.clipboard.writeText(offer.code);button.textContent='Copied'}catch{button.textContent='Select the visible code to copy'}});row.append(button);card.append(row)}
 else card.append(make('p','No code needed.'));
 const dates=make('p','Last checked: '+new Date(offer.lastChecked).toLocaleDateString('en-GB')+' · Expires: '+new Date(offer.expiresAt).toLocaleString('en-GB'));dates.className='fine';card.append(dates);
 if(offer.affiliate){const disclosure=make('p','Affiliate ad: PrintProfit may earn a commission if you buy through this link, at no extra cost to you.');disclosure.className='fine';card.append(disclosure)}
 const link=make('a','Check offer at '+offer.retailer+' ↗');link.className='deals-link';link.href=safeUrl(offer.url);link.target='_blank';link.rel=offer.affiliate?'sponsored noopener':'noopener';card.append(link);host.append(card)
}
})();
