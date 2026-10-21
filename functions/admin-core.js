'use strict';
function grantActive(grant, now=Math.floor(Date.now()/1000)) {
 return grant?.active===true&&(grant.until===null||(Number.isSafeInteger(grant.until)&&grant.until>now));
}
function requireAdminClaims(auth, uid, now=Math.floor(Date.now()/1000)) {
 if(!auth)throw Error('unauthenticated');
 if(!uid||auth.uid!==uid||auth.token?.email_verified!==true)throw Error('permission-denied');
 if(auth.token.firebase?.sign_in_second_factor!=='totp'||auth.token.firebase?.sign_in_provider!=='password')throw Error('permission-denied');
 if(!Number.isFinite(auth.token.auth_time)||auth.token.auth_time>now+60||now-auth.token.auth_time>3600)throw Error('unauthenticated');
}
function validateGrant(data, now=Math.floor(Date.now()/1000)) {
 if(typeof data?.uid!=='string'||!data.uid||data.uid.length>128||data.uid.includes('/'))throw Error('Invalid account');
 if(!['grant','revoke'].includes(data.action))throw Error('Choose grant or revoke');
 if(typeof data.note!=='string'||data.note.trim().length<3||data.note.length>500)throw Error('Add a note (3–500 characters)');
 if(data.action==='grant'&&data.until!==null&&(!Number.isSafeInteger(data.until)||data.until<=now||data.until>now+10*366*86400))throw Error('Choose a future expiry within ten years, or lifetime');
 return {active:data.action==='grant',until:data.action==='grant'?data.until:null,note:data.note.trim()};
}
function validateAffiliate(data) {
 const validDate=s=>typeof s==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(s)&&Number.isFinite(Date.parse(s))&&new Date(s).toISOString().slice(0,10)===s;
 if(!/^[a-z0-9-]{1,50}$/.test(data?.id||''))throw Error('Use a short partner ID with letters, digits and hyphens');
 if(typeof data.name!=='string'||!data.name.trim()||data.name.length>100)throw Error('Enter the partner name');
 if(!validDate(data.from)||!validDate(data.to)||data.from>data.to)throw Error('Choose a valid reporting period');
 if(!['GBP','EUR','USD'].includes(data.currency))throw Error('Choose GBP, EUR or USD');
 for(const key of ['pending','approved','paid'])if(!Number.isSafeInteger(data[key])||data[key]<0||data[key]>1e11)throw Error('Enter non-negative commission amounts');
 return {name:data.name.trim(),from:data.from,to:data.to,currency:data.currency,pending:data.pending,approved:data.approved,paid:data.paid,source:'manual'};
}
function summarizeEntitlements(rows, now=Math.floor(Date.now()/1000)) {
 const result={paid:0,trial:0,monthly:0,annual:0,cancelling:0,expired:0,estimatedMrrPence:0,lastWebhookAt:null};
 for(const row of rows){
  if(row.checkedAt?.toMillis)result.lastWebhookAt=Math.max(result.lastWebhookAt||0,row.checkedAt.toMillis());
  if(row.tier!=='pro'||!['monthly','annual'].includes(row.plan))continue;
  if(!(row.until>now)){result.expired++;continue;}
  if(row.status==='trialing'){result.trial++;continue;}
  if(row.status!=='active')continue;
  result.paid++;result[row.plan]++;if(row.cancelAtPeriodEnd)result.cancelling++;
  result.estimatedMrrPence+=row.plan==='annual'?200:250;
 }
 return result;
}
module.exports={grantActive,requireAdminClaims,validateGrant,validateAffiliate,summarizeEntitlements};
