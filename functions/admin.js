'use strict';
const policy=require('./admin-core');
// All reads and writes use Admin SDK after the same owner + MFA check.
module.exports=function createAdmin({db,auth,HttpsError,ownerUid,ownerEmail,gaProperty,FieldValue}) {
 async function guard(request) {
  try{policy.requireAdminClaims(request.auth,ownerUid());}catch(error){throw new HttpsError(error.message,'Sign in with the owner password and authenticator code. Sessions last one hour.');}
  const record=await auth.getUser(request.auth.uid);
  const validSince=Date.parse(record.tokensValidAfterTime||'1970-01-01')/1000;
  if(record.disabled||!record.emailVerified||!ownerEmail()||record.email?.toLowerCase()!==ownerEmail().trim().toLowerCase()||request.auth.token.auth_time<validSince||!record.multiFactor?.enrolledFactors?.some(f=>f.factorId==='totp'))throw new HttpsError('permission-denied','Owner access is not available.');
  return request.auth.uid;
 }
 const invalid=fn=>{try{return fn()}catch(error){throw new HttpsError('invalid-argument',error.message)}};
 const rows=snapshot=>snapshot.docs.map(doc=>({id:doc.id,...doc.data()}));
 async function bounded(collection){const snapshot=await db.collection(collection).limit(5001).get();if(snapshot.size>5000)throw new HttpsError('resource-exhausted','This report needs a larger-data reporting job. No partial total is shown.');return rows(snapshot);}
 return {
  async adminOverview(request){
   await guard(request);
   const [entitlements,grants,affiliates,audit]=await Promise.all([bounded('billingEntitlements'),bounded('adminGrants'),bounded('adminAffiliates'),db.collection('adminAudit').orderBy('at','desc').limit(25).get()]);
   return {checkedAt:Date.now(),billing:policy.summarizeEntitlements(entitlements),complimentary:grants.filter(g=>policy.grantActive(g)).length,affiliates,audit:rows(audit).map(x=>({action:x.action,target:x.target,at:x.at?.toMillis?.()||null})),gaConfigured:/^\d+$/.test(gaProperty())};
  },
  async adminFindUser(request){
   await guard(request);
   const email=request.data?.email;
   if(typeof email!=='string'||email.length>254||!email.includes('@'))throw new HttpsError('invalid-argument','Enter the account email.');
   let record;try{record=await auth.getUserByEmail(email.trim())}catch(error){if(error.code==='auth/user-not-found')throw new HttpsError('not-found','No account with that email.');throw error;}
   const [grant,billing]=await Promise.all([db.collection('adminGrants').doc(record.uid).get(),db.collection('billingEntitlements').doc(record.uid).get()]);
   const g=grant.data();
   return {uid:record.uid,email:record.email,verified:record.emailVerified,disabled:record.disabled,grant:g?{active:policy.grantActive(g),until:g.until,note:g.note}:null,billing:billing.data()||null};
  },
  async adminSetGrant(request){
   const actor=await guard(request),data=request.data;
   const value=invalid(()=>policy.validateGrant(data));
   const record=await auth.getUser(data.uid);
   if(record.disabled||!record.emailVerified)throw new HttpsError('failed-precondition','The recipient must have a verified, enabled account.');
   if(record.uid===actor)throw new HttpsError('failed-precondition','The owner already has Pro.');
   const grant=db.collection('adminGrants').doc(record.uid),audit=db.collection('adminAudit').doc();
   await db.runTransaction(async tx=>{
    const before=await tx.get(grant);
    tx.set(grant,{...value,updatedAt:FieldValue.serverTimestamp(),updatedBy:actor});
    tx.create(audit,{action:data.action==='grant'?'Grant complimentary Pro':'Revoke complimentary Pro',target:record.uid,actor,at:FieldValue.serverTimestamp(),before:before.data()||null,after:value});
   });
   return {ok:true};
  },
  async adminSaveAffiliate(request){
   const actor=await guard(request),data=request.data,value=invalid(()=>policy.validateAffiliate(data));
   const ref=db.collection('adminAffiliates').doc(data.id),audit=db.collection('adminAudit').doc();
   await db.runTransaction(async tx=>{const before=await tx.get(ref);tx.set(ref,{...value,updatedAt:FieldValue.serverTimestamp()});tx.create(audit,{action:'Update affiliate snapshot',target:data.id,actor,at:FieldValue.serverTimestamp(),before:before.data()||null,after:value});});
   return {ok:true};
  },
  async adminTraffic(request){
   await guard(request);
   const property=gaProperty();if(!/^\d+$/.test(property))return {status:'not-configured'};
   const days=request.data?.days??30;if(![7,30,90].includes(days))throw new HttpsError('invalid-argument','Choose 7, 30 or 90 days.');
   const {GoogleAuth}=require('google-auth-library');
   try{
    const client=await new GoogleAuth({scopes:['https://www.googleapis.com/auth/analytics.readonly']}).getClient();
    const base={dateRanges:[{startDate:days+'daysAgo',endDate:'yesterday'}]};
    const report=async data=>(await client.request({url:'https://analyticsdata.googleapis.com/v1beta/properties/'+property+':runReport',method:'POST',data:{...base,...data},timeout:20000})).data;
    const [totals,daily,pages]=await Promise.all([
     report({metrics:[{name:'totalUsers'},{name:'sessions'},{name:'screenPageViews'}]}),
     report({dimensions:[{name:'date'}],metrics:[{name:'sessions'}],orderBys:[{dimension:{dimensionName:'date'}}]}),
     report({dimensions:[{name:'pagePath'}],metrics:[{name:'screenPageViews'}],orderBys:[{metric:{metricName:'screenPageViews'},desc:true}],limit:'10'})
    ]);
    return {status:'connected',days,checkedAt:Date.now(),totals:totals.rows?.[0]?.metricValues.map(x=>Number(x.value))||[0,0,0],daily:(daily.rows||[]).map(x=>({date:x.dimensionValues[0].value,sessions:Number(x.metricValues[0].value)})),pages:(pages.rows||[]).map(x=>({path:x.dimensionValues[0].value,views:Number(x.metricValues[0].value)}))};
   }catch{throw new HttpsError('unavailable','Traffic could not be loaded. Check the GA property, Data API and service-account Viewer permission.');}
  }
 };
};
