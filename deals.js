(()=>{'use strict';
const host=document.getElementById('deals-list');if(!host)return;
const safeUrl=value=>{try{const url=new URL(value);return url.protocol==='https:'?url.href:null}catch{return null}};
let previous='';
function render(){
const now=Date.now();
const records=Array.isArray(window.PRINTPROFIT_OFFERS)?window.PRINTPROFIT_OFFERS:[];
const valid=records.filter(o=>o.approved===true&&o.title&&o.terms&&o.retailer&&
 Array.isArray(o.productIds)&&(o.productIds.length>0||o.scope==='retailer')&&safeUrl(o.url)&&
 Number.isFinite(Date.parse(o.expiresAt||o.reviewBy))&&Date.parse(o.expiresAt||o.reviewBy)>now&&
 (!o.startsAt||(Number.isFinite(Date.parse(o.startsAt))&&Date.parse(o.startsAt)<=now))&&
 Number.isFinite(Date.parse(o.lastChecked))&&Date.parse(o.lastChecked)<=now&&now-Date.parse(o.lastChecked)<=7*86400000);
valid.sort((a,b)=>Date.parse(a.expiresAt||a.reviewBy)-Date.parse(b.expiresAt||b.reviewBy));
const signature=JSON.stringify(valid);if(signature===previous)return;previous=signature;
host.replaceChildren();
const make=(tag,value)=>{const el=document.createElement(tag);if(value)el.textContent=value;return el};
if(!valid.length){const empty=make('p');empty.className='empty-state';empty.append(make('strong','No verified offers right now.'),make('span','We only show offers with confirmed terms and a recent check. Browse the product comparison while we verify new ones.'));host.append(empty);return}
for(const offer of valid){
 const card=make('article');card.className='offer-card';
 if(offer.affiliate){const ad=make('strong','Ad');ad.className='ad-label';card.append(ad)}
 card.append(make('h3',offer.title),make('p',offer.terms));
 if(offer.code){const row=make('p');row.append(make('code',offer.code));const button=make('button','Copy code');button.type='button';button.addEventListener('click',async()=>{try{await navigator.clipboard.writeText(offer.code);button.textContent='Copied'}catch{button.textContent='Select the visible code to copy'}});row.append(button);card.append(row)}
 else card.append(make('p',offer.redemption||'No code needed.'));
 const dateOptions={timeZone:'Europe/London',day:'2-digit',month:'short',year:'numeric',hour:'2-digit',minute:'2-digit',timeZoneName:'short'};
 const dates=make('p','Last checked: '+new Date(offer.lastChecked).toLocaleDateString('en-GB')+' · '+(offer.expiresAt?'Expires: ':'Recheck by: ')+new Date(offer.expiresAt||offer.reviewBy).toLocaleString('en-GB',dateOptions));dates.className='fine';card.append(dates);
 if(offer.affiliate){const disclosure=make('p','Affiliate ad: PrintProfit may earn a commission if you buy through this link, at no extra cost to you.');disclosure.className='fine';card.append(disclosure)}
 const link=make('a','Check offer at '+offer.retailer+' ↗');link.className='deals-link';link.href=safeUrl(offer.url);link.target='_blank';link.rel=offer.affiliate?'sponsored noopener':'noopener';card.append(link);
 if(safeUrl(offer.sourceUrl)){const source=make('a','Retailer offer & terms');source.href=safeUrl(offer.sourceUrl);source.target='_blank';source.rel='noopener';source.className='offer-source';card.append(source)}
 host.append(card)
}
}
render();setInterval(render,60000);
document.addEventListener('visibilitychange',()=>{if(!document.hidden)render();});
})();
