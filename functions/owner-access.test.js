'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const {grantActive,validateGrant}=require('./owner-access');

const now=1770000000;
test('complimentary grants expire cleanly and support no-expiry access',()=>{
 assert.equal(grantActive({active:true,until:null},now),true);
 assert.equal(grantActive({active:true,until:now+1},now),true);
 assert.equal(grantActive({active:true,until:now},now),false);
 assert.equal(grantActive({active:false,until:null},now),false);
});

test('grant input requires a safe account, action, reason and future expiry',()=>{
 assert.deepEqual(validateGrant({uid:'member',action:'grant',until:null,note:'Family access'},now),{active:true,until:null,note:'Family access'});
 assert.deepEqual(validateGrant({uid:'member',action:'revoke',until:null,note:'Access ended'},now),{active:false,until:null,note:'Access ended'});
 for(const value of [
  {uid:'a/b',action:'grant',until:null,note:'Family'},
  {uid:'member',action:'grant',until:now,note:'Family'},
  {uid:'member',action:'other',until:null,note:'Family'},
  {uid:'member',action:'grant',until:null,note:'x'}
 ]) assert.throws(()=>validateGrant(value,now));
});
