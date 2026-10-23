const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const backup={format:'printprofit-workspace',version:1,projects:[{id:'p',name:'Model',data:{qty:3}}],materials:[{id:'m',name:'PLA',remaining:500}],printers:[]};
const context={module:{exports:{}},document:{addEventListener(){}}};vm.runInNewContext(fs.readFileSync('workspace-backup.js','utf8'),context);
const {validate}=context.module.exports;
assert.equal(validate(backup).projects[0].data.qty,3);
for(const bad of [{...backup,version:2},{...backup,projects:[{id:'p',name:'Missing settings'}]},{...backup,materials:[...backup.materials,...backup.materials]},{...backup,materials:[{id:'m',name:'PLA',remaining:-1}]},JSON.parse(JSON.stringify(backup).replace('"qty":3','"__proto__":{"polluted":true}'))])assert.throws(()=>validate(bad));
const syncSource=fs.readFileSync('workshop-account-sync.js','utf8');
const wrapper=syncSource.slice(syncSource.indexOf('async function syncWorkshop(user)'),syncSource.indexOf('async function syncWorkshopImpl(user)'));
async function attempt(enabled,check,uid='user',projectId='printprofit-test'){
 let writes=0;
 const user={uid:'user',emailVerified:true};
 const ctx={CONFIG:{projectId},window:{PRINTPROFIT_BILLING_CONFIG:{enabled},__ppCheckCloudAccess:check},auth:{currentUser:{uid}},activeUser:user,legalAccepted:true,localImportPending:false,deletingAccount:false,activeSyncCount:0,setStatus(){},setMessage(){},syncWorkshopImpl:async()=>writes++};
 vm.createContext(ctx);vm.runInContext(wrapper,ctx);await ctx.syncWorkshop(user);return writes;
}
(async()=>{
 assert.equal(await attempt(true,async()=>false),0,'Basic must not sync');
 assert.equal(await attempt(true,async()=>{throw Error('offline')}),0,'Offline must fail closed');
 assert.equal(await attempt(true,undefined),0,'Missing checker must fail closed');
 assert.equal(await attempt(true,async()=>true,'other'),0,'Account change must abort sync');
 assert.equal(await attempt(true,async()=>true),1,'Pro must sync');
 assert.equal(await attempt(false,undefined),1,'Preview remains available until launch');
 assert.equal(await attempt(false,async()=>false,'user','printprofit-fd30f'),0,'Live Basic must not sync while the public billing panel is hidden');
 assert.equal(await attempt(false,async()=>true,'user','printprofit-fd30f'),1,'Live owner or Pro may sync while the public billing panel is hidden');
 console.log('PASS: backup validation, Basic/Pro sync, offline failure and account-switch protection.');
})().catch(error=>{console.error(error);process.exitCode=1});
