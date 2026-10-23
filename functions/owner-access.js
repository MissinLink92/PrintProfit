'use strict';

function grantActive(grant, now=Math.floor(Date.now()/1000)) {
  return Boolean(grant?.active === true && (grant.until === null || (Number.isSafeInteger(grant.until) && grant.until > now)));
}

function validateGrant(data, now=Math.floor(Date.now()/1000)) {
  if (typeof data?.uid !== 'string' || !data.uid || data.uid.length > 128 || data.uid.includes('/')) throw Error('Invalid account.');
  if (!['grant','revoke'].includes(data.action)) throw Error('Choose grant or revoke.');
  const note=String(data.note||'').trim();
  if (note.length < 3 || note.length > 500) throw Error('Add a private reason between 3 and 500 characters.');
  let until=null;
  if (data.action === 'grant' && data.until !== null) {
    if (!Number.isSafeInteger(data.until) || data.until <= now || data.until > now + 10*366*86400) throw Error('Choose a future expiry within ten years, or lifetime.');
    until=data.until;
  }
  return {active:data.action==='grant',until:data.action==='grant'?until:null,note};
}

function createOwnerAccessHandlers({db,auth,HttpsError,ownerGuard,FieldValue}) {
  const invalid=fn=>{try{return fn();}catch(error){throw new HttpsError('invalid-argument',error.message);}};
  const millis=value=>value?.toMillis?.()||null;
  return {
    async getComplimentaryOverview(request) {
      await ownerGuard(request);
      const [grants,audit]=await Promise.all([
        db.collection('adminGrants').limit(1000).get(),
        db.collection('adminAudit').orderBy('at','desc').limit(20).get()
      ]);
      const active=[];
      for (const doc of grants.docs) {
        const value=doc.data();
        if (!grantActive(value)) continue;
        active.push({uid:doc.id,email:value.email||'',until:value.until??null,note:value.note||'',updatedAt:millis(value.updatedAt)});
      }
      return {activeCount:active.length,active:active.sort((a,b)=>(a.email||'').localeCompare(b.email||'')),audit:audit.docs.map(doc=>{const value=doc.data();return{action:value.action||'',target:value.targetEmail||value.target||'',at:millis(value.at)};})};
    },
    async findComplimentaryUser(request) {
      await ownerGuard(request);
      const email=String(request.data?.email||'').trim();
      if (!email || email.length>254 || !email.includes('@')) throw new HttpsError('invalid-argument','Enter the account email.');
      let record;
      try { record=await auth.getUserByEmail(email); }
      catch(error) { if(error.code==='auth/user-not-found') throw new HttpsError('not-found','No PrintProfit account uses that email.'); throw error; }
      const grant=(await db.collection('adminGrants').doc(record.uid).get()).data();
      return {uid:record.uid,email:record.email||email,verified:record.emailVerified===true,disabled:record.disabled===true,grant:grant?{active:grantActive(grant),until:grant.until??null,note:grant.note||''}:null};
    },
    async setComplimentaryAccess(request) {
      const actor=await ownerGuard(request),data=request.data||{},value=invalid(()=>validateGrant(data));
      const record=await auth.getUser(data.uid);
      if (record.uid===actor.uid) throw new HttpsError('failed-precondition','Your owner account already has Pro.');
      if (record.disabled || !record.emailVerified) throw new HttpsError('failed-precondition','The recipient must have a verified, enabled account.');
      const grant=db.collection('adminGrants').doc(record.uid),audit=db.collection('adminAudit').doc();
      await db.runTransaction(async tx=>{
        const before=await tx.get(grant);
        const after={...value,email:record.email||'',updatedAt:FieldValue.serverTimestamp(),updatedBy:actor.uid};
        tx.set(grant,after);
        tx.create(audit,{action:value.active?'Grant complimentary Pro':'Revoke complimentary Pro',target:record.uid,targetEmail:record.email||'',actor:actor.uid,at:FieldValue.serverTimestamp(),before:before.data()||null,after});
      });
      return {ok:true,email:record.email||'',active:value.active,until:value.until};
    }
  };
}

module.exports={grantActive,validateGrant,createOwnerAccessHandlers};
