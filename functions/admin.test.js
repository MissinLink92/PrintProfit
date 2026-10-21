'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const policy=require('./admin-core'),createAdmin=require('./admin');
const NOW=Math.floor(Date.now()/1000);
const authClaims=()=>({uid:'owner',token:{email_verified:true,auth_time:NOW,email:'owner@example.com',firebase:{sign_in_second_factor:'totp',sign_in_provider:'password'}}});
function harness(recordOverride={}){
 const records=new Map(),writes=[],reads=[];
 const ref=(name,id)=>({name,id,get:async()=>{reads.push(name);return{data:()=>records.get(name+'/'+id)};}});
 const db={collection:name=>({doc:id=>ref(name,id||'audit-id')}),runTransaction:async fn=>fn({get:r=>r.get(),set:(r,v)=>{records.set(r.name+'/'+r.id,v);writes.push([r.name,v])},create:(r,v)=>writes.push([r.name,v])})};
 const auth={getUser:async uid=>uid==='owner'?{uid,email:'owner@example.com',emailVerified:true,disabled:false,tokensValidAfterTime:new Date(0).toISOString(),multiFactor:{enrolledFactors:[{factorId:'totp'}]},...recordOverride}:{uid,email:'member@example.com',emailVerified:true,disabled:false}};
 class HttpsError extends Error{constructor(code,message){super(message);this.code=code}}
 return {records,writes,reads,handlers:createAdmin({db,auth,HttpsError,ownerUid:()=> 'owner',ownerEmail:()=> 'owner@example.com',gaProperty:()=>'',FieldValue:{serverTimestamp:()=>NOW}})};
}
test('all admin endpoints deny anonymous, other accounts, missing MFA, other factors, stale sessions and wrong providers before data access',async()=>{
 const cases=[null,{...authClaims(),uid:'someone-else'},{...authClaims(),token:{...authClaims().token,email_verified:false}},{...authClaims(),token:{...authClaims().token,firebase:{sign_in_provider:'password'}}},{...authClaims(),token:{...authClaims().token,firebase:{sign_in_provider:'password',sign_in_second_factor:'phone'}}},{...authClaims(),token:{...authClaims().token,auth_time:NOW-3601}},{...authClaims(),token:{...authClaims().token,firebase:{sign_in_provider:'custom',sign_in_second_factor:'totp'}}}];
 for(const auth of cases){const h=harness();for(const handler of Object.values(h.handlers))await assert.rejects(handler({auth,data:{}}));assert.equal(h.reads.length,0);assert.equal(h.writes.length,0);}
});
test('disabled, revoked, changed-email and unenrolled owners are rejected',async()=>{
 for(const record of [{disabled:true},{email:'changed@example.com'},{multiFactor:{enrolledFactors:[]}},{tokensValidAfterTime:new Date((NOW+1)*1000).toISOString()}]){const h=harness(record);await assert.rejects(h.handlers.adminTraffic({auth:authClaims()}),e=>e.code==='permission-denied');}
});
test('owner with password and TOTP can access unconfigured traffic status',async()=>{assert.deepEqual(await harness().handlers.adminTraffic({auth:authClaims()}),{status:'not-configured'});});
test('grant and revoke are atomically audited and never alter paid billing',async()=>{
 const h=harness(),request={auth:authClaims(),data:{uid:'member',action:'grant',until:NOW+3600,note:'Product tester'}};
 await h.handlers.adminSetGrant(request);
 assert.equal(h.records.get('adminGrants/member').active,true);assert.equal(h.writes[1][0],'adminAudit');
 await h.handlers.adminSetGrant({...request,data:{...request.data,action:'revoke'}});
 assert.equal(h.records.get('adminGrants/member').active,false);
 assert.equal(h.writes.length,4);assert.ok(h.writes.every(([collection])=>['adminGrants','adminAudit'].includes(collection)));
});
test('cannot grant to oneself and invalid requests cannot write',async()=>{
 const h=harness();for(const data of [{uid:'owner',action:'grant',until:null,note:'Owner gift'},{uid:'member',action:'grant',until:NOW-1,note:'Expired'},{uid:'member',action:'grant',until:'forever',note:'Bad value'},{uid:'a/b',action:'revoke',note:'Bad UID'}])await assert.rejects(h.handlers.adminSetGrant({auth:authClaims(),data}));assert.equal(h.writes.length,0);
});
test('expiry is enforced at the boundary and revoked/lifetime grants behave correctly',()=>{
 assert.equal(policy.grantActive({active:true,until:NOW},NOW),false);assert.equal(policy.grantActive({active:true,until:NOW+1},NOW),true);assert.equal(policy.grantActive({active:true,until:null},NOW),true);assert.equal(policy.grantActive({active:false,until:null},NOW),false);assert.equal(policy.grantActive({active:true},NOW),false);
});
test('subscriber totals exclude trials, expired periods and complimentary access',()=>{
 const result=policy.summarizeEntitlements([{tier:'pro',plan:'monthly',status:'active',until:NOW+1},{tier:'pro',plan:'annual',status:'active',until:NOW+1,cancelAtPeriodEnd:true},{tier:'pro',plan:'monthly',status:'trialing',until:NOW+1},{tier:'pro',status:'complimentary',until:null},{tier:'pro',plan:'monthly',status:'active',until:NOW}],NOW);
 assert.equal(result.paid,2);assert.equal(result.trial,1);assert.equal(result.estimatedMrrPence,450);assert.equal(result.expired,1);assert.equal(result.cancelling,1);
});
test('affiliate input rejects malformed dates, currency and fractional minor units',()=>{
 const valid={id:'awin-elegoo',name:'ELEGOO',currency:'GBP',from:'2026-10-01',to:'2026-10-21',pending:100,approved:200,paid:300};
 assert.equal(policy.validateAffiliate(valid).source,'manual');for(const changes of [{from:'2026-02-30'},{to:'2026-09-01'},{currency:'ABC'},{paid:-1},{paid:1.5},{id:'../other'}])assert.throws(()=>policy.validateAffiliate({...valid,...changes}));
});
test('unconfigured admin UID fails closed',()=>{assert.throws(()=>policy.requireAdminClaims(authClaims(),''));});
