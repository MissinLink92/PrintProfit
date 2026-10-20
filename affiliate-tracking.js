/* Awin publisher: PrintProfit (3128307).
 * Enable a retailer only after its Awin advertiser programme approves PrintProfit.
 * Use the advertiser ID from Awin Link Builder; do not guess it from a retailer URL.
 */
(()=>{
 'use strict';
 const publisherId='3128307';
 const programmes={
  '3DJake UK':{approved:false,advertiserId:null,hosts:['3djake.uk','www.3djake.uk']},
  'Bambu Lab UK':{approved:false,advertiserId:null,hosts:['bambu-lab-uk.myshopify.com','uk.store.bambulab.com']}
 };
 function link(destination,retailer){
  const programme=programmes[retailer];
  if(!programme?.approved||!/^\d+$/.test(String(programme.advertiserId||'')))return null;
  try{
   const page=new URL(destination);
   if(page.protocol!=='https:'||!programme.hosts.includes(page.hostname))return null;
   const tracking=new URL('https://www.awin1.com/cread.php');
   tracking.searchParams.set('awinmid',String(programme.advertiserId));
   tracking.searchParams.set('awinaffid',publisherId);
   tracking.searchParams.set('ued',page.href);
   return tracking.href;
  }catch{return null;}
 }
 window.PRINTPROFIT_AWIN={link};
 if(typeof module==='object'&&module.exports)module.exports={link,programmes};
})();
