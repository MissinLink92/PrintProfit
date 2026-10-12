(()=> {
'use strict';
if(window.__ppWorkshopAccountSync)return;
window.__ppWorkshopAccountSync=true;

const CONFIG=window.PRINTPROFIT_FIREBASE_CONFIG||{};
const MATERIAL_KEY='printprofit.materials.v1';
const PRINTER_KEY='printprofit.workshop-printers.v1';
const OWNER_KEY='printprofit.workshop.owner.v1';
const STATE_PREFIX='printprofit.workshop.sync-state.v1.';
const CACHE_PREFIX='printprofit.workshop.user-cache.v1.';
const FIREBASE_VERSION='12.19.0';
let auth=null,db=null,sdk=null,activeUser=null,initPromise=null,accountHostReady=false;
let handledUid='',syncTimer=null,syncRunning=false,syncAgain=false,signingOut=false,localChangeVersion=0;

const isConfigured=()=>Boolean(CONFIG.apiKey&&CONFIG.authDomain&&CONFIG.projectId&&CONFIG.appId);
const ownerId=()=>{try{return localStorage.getItem(OWNER_KEY)||'guest'}catch(e){return'guest'}};
const readJson=(key,fallback)=>{try{const value=JSON.parse(localStorage.getItem(key)||'null');return value===null?fallback:value}catch(e){return fallback}};
const readList=key=>{const value=readJson(key,[]);return Array.isArray(value)?value:[]};
const readWorkshop=()=>({materials:readList(MATERIAL_KEY),printers:readList(PRINTER_KEY)});
const writeWorkshop=value=>{
 try{
  localStorage.setItem(MATERIAL_KEY,JSON.stringify(Array.isArray(value.materials)?value.materials:[]));
  localStorage.setItem(PRINTER_KEY,JSON.stringify(Array.isArray(value.printers)?value.printers:[]));
  return true;
 }catch(e){console.warn('PrintProfit workshop restore failed:',e);return false}
};
const stateKey=scope=>STATE_PREFIX+scope;
const cacheKey=uid=>CACHE_PREFIX+uid;
const readSyncState=scope=>{const state=readJson(stateKey(scope),{});return{pending:Boolean(state&&state.pending),deleted:{materials:Array.isArray(state?.deleted?.materials)?state.deleted.materials:[],printers:Array.isArray(state?.deleted?.printers)?state.deleted.printers:[]}}};
const writeSyncState=(scope,state)=>{try{localStorage.setItem(stateKey(scope),JSON.stringify(state));return true}catch(e){return false}};
const readCache=uid=>readJson(cacheKey(uid),null);
const writeCache=(uid,value)=>{try{localStorage.setItem(cacheKey(uid),JSON.stringify(value));return true}catch(e){return false}};
const uuid=()=>{try{if(window.crypto&&typeof crypto.randomUUID==='function')return crypto.randomUUID()}catch(e){}return'pp-'+Date.now().toString(36)+'-'+Math.random().toString(36).slice(2)};
const normalizeList=value=>(Array.isArray(value)?value:[]).filter(item=>item&&typeof item==='object').map(item=>item.id?item:{...item,id:uuid()});
const mergeLists=(local,cloud,deleted)=>{
 const byId=new Map();
 normalizeList(cloud).forEach(item=>byId.set(String(item.id),item));
 normalizeList(local).forEach(item=>{
  const id=String(item.id),previous=byId.get(id);
  if(!previous||Number(item.updated||0)>Number(previous.updated||0))byId.set(id,item);
 });
 const removed=new Set((Array.isArray(deleted)?deleted:[]).map(String));
 return [...byId.values()].filter(item=>!removed.has(String(item.id)));
};
const mergeWorkshop=(local,cloud,deleted)=>({
 materials:mergeLists(local.materials,cloud.materials,deleted.materials),
 printers:mergeLists(local.printers,cloud.printers,deleted.printers)
});
const accountStatus=()=>document.getElementById('ppAccountStatus');
const accountMessage=()=>document.getElementById('ppAccountMessage');
function setStatus(title,description){
 const el=accountStatus();if(!el)return;
 el.innerHTML='<strong>'+escapeHtml(title)+'</strong><span>'+escapeHtml(description)+'</span>';
}
function setMessage(message,isError){
 const el=accountMessage();if(!el)return;
 el.textContent=message||'';
 el.classList.toggle('is-error',Boolean(isError));
}
function escapeHtml(value){
 return String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
}
function ensureAccountUI(){
 const host=document.getElementById('ppWorkshopAccount');if(!host)return false;
 if(accountHostReady&&host.dataset.ppAccountReady==='true')return true;
 host.innerHTML=
  '<section class="pp-account-card" aria-labelledby="ppAccountTitle">'+
   '<div class="pp-account-heading"><div><span class="pp-account-kicker">ACCOUNT SYNC</span><h3 id="ppAccountTitle">Take your workshop to any device</h3><div id="ppAccountStatus" class="pp-account-status"></div></div><span class="pp-account-badge" id="ppAccountBadge">LOCAL</span></div>'+
   '<div id="ppAccountNotConfigured" class="pp-account-not-configured" hidden>Cloud accounts are being connected. Your printer and material profiles will continue saving in this browser.</div>'+
   '<div id="ppAccountSignedOut" class="pp-account-fields">'+
    '<label>Email address<input id="ppAccountEmail" type="email" autocomplete="email" placeholder="you@example.com"></label>'+
    '<label>Password<input id="ppAccountPassword" type="password" autocomplete="current-password" minlength="8" placeholder="At least 8 characters"></label>'+
    '<div class="pp-account-actions"><button type="button" class="pp-account-primary" data-pp-account-action="sign-in">Sign in</button><button type="button" class="pp-account-secondary" data-pp-account-action="sign-up">Create account</button></div>'+
    '<div class="pp-account-links"><button type="button" data-pp-account-action="reset-password">Forgot password?</button></div>'+
   '</div>'+
   '<div id="ppAccountSignedIn" class="pp-account-signed-in" hidden><span id="ppAccountEmailLabel"></span><div class="pp-account-actions"><button type="button" class="pp-account-secondary" data-pp-account-action="sync">Sync now</button><button type="button" class="pp-account-secondary" data-pp-account-action="sign-out">Sign out</button></div><button type="button" class="pp-account-danger" data-pp-account-action="delete-account">Delete account and data</button></div>'+
   '<p id="ppAccountMessage" class="pp-account-message" role="status" aria-live="polite"></p>'+
   '<small class="pp-account-footnote">Your password is handled securely by Firebase. Printer and material profiles are private to your account.</small>'+
  '</section>';
 if(!document.getElementById('ppAccountStyles')){
  const style=document.createElement('style');style.id='ppAccountStyles';style.textContent=
   '.pp-account-card{margin:0 28px 16px;padding:17px 18px;border:1px solid #355363;border-radius:14px;background:linear-gradient(145deg,#0c202a,#0a1820);color:#edf3f6;font-family:Inter,Segoe UI,system-ui,sans-serif}'+
   '.pp-account-heading{display:flex;justify-content:space-between;align-items:flex-start;gap:14px}.pp-account-kicker{display:block;color:#ffae62;font-size:9px;font-weight:900;letter-spacing:.16em}.pp-account-heading h3{margin:4px 0 6px;font-size:16px}.pp-account-status{display:flex;flex-direction:column;gap:3px;color:#aebdc6;font-size:12px}.pp-account-status strong{color:#edf3f6;font-size:12px}.pp-account-badge{flex:0 0 auto;padding:5px 8px;border:1px solid #355363;border-radius:999px;color:#aebdc6;font-size:9px;font-weight:900;letter-spacing:.08em}.pp-account-badge.is-synced{border-color:#16865f;color:#70e0b5;background:#0a3028}.pp-account-fields{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:14px}.pp-account-fields label{color:#aebdc6;font-size:11px}.pp-account-fields input{display:block;width:100%;box-sizing:border-box;margin-top:5px;padding:10px 11px;border:1px solid #355363;border-radius:8px;background:#07141c;color:#f5f8fb;font:inherit;font-size:13px}.pp-account-actions{display:flex;gap:8px;align-items:center}.pp-account-primary,.pp-account-secondary{min-height:36px;padding:8px 12px;border:1px solid #ff7800;border-radius:8px;background:#ff7800;color:#fff;font-weight:800;cursor:pointer}.pp-account-secondary{border-color:#355363;background:#0d2029;color:#dce8ed}.pp-account-danger{padding:0;border:0;background:transparent;color:#ff9b9b;font:inherit;font-size:11px;text-decoration:underline;cursor:pointer}.pp-account-primary:disabled,.pp-account-secondary:disabled{opacity:.55;cursor:wait}.pp-account-fields>.pp-account-actions{grid-column:1/-1}.pp-account-links{grid-column:1/-1;display:flex;gap:12px}.pp-account-links button{padding:0;border:0;background:transparent;color:#75d8f2;font:inherit;font-size:11px;text-decoration:underline;cursor:pointer}.pp-account-signed-in{display:flex;flex-wrap:wrap;justify-content:flex-start;align-items:center;gap:12px;margin-top:14px;color:#dce8ed;font-size:12px}.pp-account-signed-in>.pp-account-actions{margin-left:auto}.pp-account-danger{flex-basis:100%;text-align:left}.pp-account-message{min-height:17px;margin:8px 0 0;color:#77e1b8;font-size:11px}.pp-account-message.is-error{color:#ff9b9b}.pp-account-not-configured{margin-top:12px;padding:10px 12px;border:1px solid #765021;border-radius:9px;background:#312411;color:#f8d8a8;font-size:12px;line-height:1.5}.pp-account-footnote{display:block;color:#81949f;font-size:10px;line-height:1.45}.pp-account-fields[hidden],.pp-account-signed-in[hidden],.pp-account-not-configured[hidden],.pp-account-links [hidden]{display:none!important}'+
   '@media(max-width:650px){.pp-account-card{margin-left:20px;margin-right:20px}.pp-account-fields{grid-template-columns:1fr}.pp-account-fields>.pp-account-actions,.pp-account-links{grid-column:auto}.pp-account-signed-in{align-items:flex-start;flex-direction:column}}';
  document.head.appendChild(style);
 }
 host.dataset.ppAccountReady='true';accountHostReady=true;
 return true;
}
function updateAccountUI(){
 if(!ensureAccountUI())return;
 const configured=isConfigured();
 document.getElementById('ppAccountNotConfigured').hidden=configured;
 document.getElementById('ppAccountSignedOut').hidden=!configured||Boolean(activeUser);
 document.getElementById('ppAccountSignedIn').hidden=!configured||!activeUser;
 document.getElementById('ppAccountBadge').textContent=activeUser?'ACCOUNT':'LOCAL';
 document.getElementById('ppAccountBadge').classList.toggle('is-synced',Boolean(activeUser));
 const emailLabel=document.getElementById('ppAccountEmailLabel');if(emailLabel)emailLabel.textContent=activeUser?activeUser.email||'Signed in':'';
 if(!configured)setStatus('Saved on this device','Add the Firebase project settings to enable secure account sync.');
 else if(activeUser)setStatus('Signed in as '+(activeUser.email||'your account'),'Your printer and material profiles sync with your account.');
 else setStatus('Saved in this browser','Create an account or sign in to sync your workshop between devices.');
}
function setBusy(value){
 document.querySelectorAll('#ppWorkshopAccount [data-pp-account-action]').forEach(button=>{button.disabled=Boolean(value)});
}
function errorText(error){
 const code=String(error?.code||'');
 if(code.includes('email-already-in-use'))return'That email already has an account. Try signing in instead.';
 if(code.includes('invalid-credential')||code.includes('user-not-found')||code.includes('wrong-password'))return'Email or password was not recognised.';
 if(code.includes('invalid-email'))return'Enter a valid email address.';
 if(code.includes('weak-password'))return'Choose a password with at least 8 characters.';
 if(code.includes('too-many-requests'))return'Too many attempts. Please wait a little and try again.';
 if(code.includes('requires-recent-login'))return'For security, sign out and sign back in before deleting this account.';
 if(code.includes('network-request-failed'))return'Network connection failed. Check your connection and try again.';
 if(code.includes('permission-denied')||code.includes('unauthorized'))return'Your account is signed in, but cloud sync is not allowed. Check the Firestore rules and verify your email.';
 return'We could not complete that step. Please try again.';
}
function configReady(){
 return isConfigured()&&Object.values(CONFIG).every(value=>typeof value==='string');
}
async function initializeFirebase(){
 if(initPromise)return initPromise;
 initPromise=(async()=>{
  if(!configReady())throw new Error('PrintProfit Firebase settings are missing.');
  const root='https://www.gstatic.com/firebasejs/'+FIREBASE_VERSION+'/';
  const modules=await Promise.all([
   import(root+'firebase-app.js'),
   import(root+'firebase-auth.js'),
   import(root+'firebase-firestore.js')
  ]);
  const appSdk=modules[0],authSdk=modules[1],firestoreSdk=modules[2];
  const app=appSdk.getApps().find(item=>item.name==='[DEFAULT]')||appSdk.initializeApp(CONFIG);
  auth=authSdk.getAuth(app);db=firestoreSdk.getFirestore(app);
  sdk={auth:authSdk,firestore:firestoreSdk};
  authSdk.onAuthStateChanged(auth,user=>{
   if(user&&!user.emailVerified){
    activeUser=null;handledUid='';
    updateAccountUI();
    setMessage('Please verify your email from the message we sent, then sign in again.',true);
    authSdk.signOut(auth).catch(()=>{});
    return;
   }
   activeUser=user||null;
   updateAccountUI();
   if(activeUser&&handledUid!==activeUser.uid){
    handledUid=activeUser.uid;
    setStatus('Syncing workshop','Loading your printer and material profiles.');
    syncWorkshop(activeUser).catch(error=>{
     console.warn('PrintProfit account sync failed:',error);
     setStatus('Sync needs attention','Your local profiles are still available on this device.');
     setMessage(errorText(error),true);
    });
   }else if(!activeUser){handledUid=''}
  });
  return{app,auth,db};
 })().catch(error=>{initPromise=null;throw error});
 return initPromise;
}
function rememberDeletion(state,kind,before,after){
 const afterIds=new Set(normalizeList(after).map(item=>String(item.id)));
 normalizeList(before).forEach(item=>{
  const id=String(item.id);
  if(!afterIds.has(id)&&!state.deleted[kind].includes(id))state.deleted[kind].push(id);
 });
}
function handleLocalChange(event){
 localChangeVersion++;
 const detail=event.detail||{},scope=ownerId(),state=readSyncState(scope);
 if((detail.kind==='materials'||detail.kind==='printers')&&Array.isArray(detail.before)&&Array.isArray(detail.after)){
  rememberDeletion(state,detail.kind,detail.before,detail.after);
 }
 state.pending=true;writeSyncState(scope,state);
 if(activeUser&&activeUser.emailVerified){
  setStatus('Saving workshop','Sending your latest changes to your account.');
  queueSync();
 }else{
  setStatus('Saved on this device','Sign in whenever you want to sync these profiles.');
 }
}
const emptyWorkshop=()=>({materials:[],printers:[]});
function readSyncCache(uid){return readCache(uid)||null}
function sameWorkshop(a,b){return JSON.stringify(a)===JSON.stringify(b)}
const emptyDeleted=()=>({materials:[],printers:[]});
const mergeDeleted=(...sets)=>({
 materials:[...new Set(sets.flatMap(set=>Array.isArray(set?.materials)?set.materials:[]).map(String))],
 printers:[...new Set(sets.flatMap(set=>Array.isArray(set?.printers)?set.printers:[]).map(String))]
});
const sameDeleted=(a,b)=>JSON.stringify([...a.materials].sort())===JSON.stringify([...b.materials].sort())&&JSON.stringify([...a.printers].sort())===JSON.stringify([...b.printers].sort());
function cloudWorkshop(data){
 return{materials:normalizeList(data?.materials),printers:normalizeList(data?.printers)};
}
function cloudDeleted(data){
 return{materials:Array.isArray(data?.deletedMaterials)?data.deletedMaterials.map(String):[],printers:Array.isArray(data?.deletedPrinters)?data.deletedPrinters.map(String):[]};
}
async function syncWorkshop(user){
 if(!user||!user.emailVerified)return;
 const syncVersion=localChangeVersion;
 const currentOwner=ownerId();
 let local=readWorkshop(),scope=(currentOwner==='guest'||!currentOwner)?'guest':currentOwner;
 let pendingState=readSyncState(scope);
 if(currentOwner!=='guest'&&currentOwner!==user.uid){
  writeCache(currentOwner,local);
  const ownCache=readSyncCache(user.uid);
  local=ownCache?{materials:normalizeList(ownCache.materials),printers:normalizeList(ownCache.printers)}:emptyWorkshop();
  writeWorkshop(local);
  scope=user.uid;pendingState=readSyncState(scope);
 }else if(currentOwner==='guest'){
  const ownCache=readSyncCache(user.uid),accountState=readSyncState(user.uid);
  pendingState={pending:pendingState.pending||accountState.pending,deleted:mergeDeleted(pendingState.deleted,accountState.deleted)};
  if(ownCache)local=mergeWorkshop(local,ownCache,pendingState.deleted);
  writeSyncState(user.uid,{pending:pendingState.pending,deleted:pendingState.deleted});
  writeSyncState('guest', {pending:false,deleted:emptyDeleted()});
 }
 try{localStorage.setItem(OWNER_KEY,user.uid)}catch(e){}
 const ref=sdk.firestore.doc(db,'users',user.uid,'workshop','profiles');
 let result;
 try{
  result=await sdk.firestore.runTransaction(db,async transaction=>{
   const snapshot=await transaction.get(ref);
   let next,deleted=mergeDeleted(pendingState.deleted);
   if(snapshot.exists()){
    const cloud=snapshot.data()||{};
    const cloudLists=cloudWorkshop(cloud);
    deleted=mergeDeleted(cloudDeleted(cloud),pendingState.deleted);
    next=currentOwner===user.uid&&!pendingState.pending
     ?mergeWorkshop(emptyWorkshop(),cloudLists,deleted)
     :mergeWorkshop(local,cloudLists,deleted);
    const cloudAlreadyCurrent=sameWorkshop(next,cloudLists)&&sameDeleted(deleted,cloudDeleted(cloud));
    if(!cloudAlreadyCurrent||pendingState.pending)transaction.set(ref,{materials:normalizeList(next.materials),printers:normalizeList(next.printers),deletedMaterials:deleted.materials,deletedPrinters:deleted.printers,schemaVersion:1,updatedAt:sdk.firestore.serverTimestamp()});
   }else{
    next=mergeWorkshop(local,emptyWorkshop(),deleted);
    transaction.set(ref,{materials:normalizeList(next.materials),printers:normalizeList(next.printers),deletedMaterials:deleted.materials,deletedPrinters:deleted.printers,schemaVersion:1,updatedAt:sdk.firestore.serverTimestamp()});
   }
   return{next,deleted};
  });
 }catch(error){throw error}
 const next=result.next,deleted=result.deleted;
 const changedDuringSync=localChangeVersion!==syncVersion;
 if(signingOut||auth.currentUser?.uid!==user.uid){
  if(!changedDuringSync){
   writeCache(user.uid,next);
   writeSyncState(user.uid,{pending:false,deleted:emptyDeleted()});
  }
  return;
 }
 if(changedDuringSync){
  const latestState=readSyncState(user.uid);
  writeCache(user.uid,readWorkshop());
  writeSyncState(user.uid,{pending:true,deleted:mergeDeleted(deleted,pendingState.deleted,latestState.deleted)});
  setStatus('Saving latest changes','Finishing your workshop sync.');
  queueSync();
  return;
 }
 writeCache(user.uid,next);
 writeSyncState(user.uid,{pending:false,deleted:emptyDeleted()});
 if(scope==='guest')writeSyncState('guest',{pending:false,deleted:emptyDeleted()});
 if(!writeWorkshop(next))throw new Error('Workshop data could not be stored in this browser.');
 setStatus('Workshop synced','Your printer and material profiles are saved to your account.');
 setMessage('Sync complete. Changes you make here will be saved automatically.',false);
}
function queueSync(){
 clearTimeout(syncTimer);
 syncTimer=setTimeout(async()=>{
  if(!activeUser||!activeUser.emailVerified)return;
  if(syncRunning){syncAgain=true;return}
  syncRunning=true;syncAgain=false;
  try{await syncWorkshop(activeUser)}
  catch(error){
   console.warn('PrintProfit workshop save failed:',error);
   setStatus('Not synced yet','Your changes remain saved in this browser.');
   setMessage(errorText(error),true);
  }finally{
   syncRunning=false;
   if(syncAgain){syncAgain=false;queueSync()}
  }
 },700);
}
function emailValue(){return String(document.getElementById('ppAccountEmail')?.value||'').trim()}
function passwordValue(){return String(document.getElementById('ppAccountPassword')?.value||'')}
function validEmail(value){return/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)}
async function handleAction(action){
 if(!isConfigured()){
  setMessage('Account sync is not connected yet. Your profiles are still saved in this browser.',true);return;
 }
 setBusy(true);setMessage('',false);
 try{
  await initializeFirebase();
  const email=emailValue(),password=passwordValue();
  if(action==='sign-up'){
   if(!validEmail(email))throw Object.assign(new Error('Invalid email'),{code:'auth/invalid-email'});
   if(password.length<8)throw Object.assign(new Error('Weak password'),{code:'auth/weak-password'});
   const credential=await sdk.auth.createUserWithEmailAndPassword(auth,email,password);
   await sdk.auth.sendEmailVerification(credential.user,{url:window.location.origin});
   await sdk.auth.signOut(auth);
   setMessage('Account created. Check your email and verify it before signing in.',false);

  }else if(action==='sign-in'){
   if(!validEmail(email))throw Object.assign(new Error('Invalid email'),{code:'auth/invalid-email'});
   const credential=await sdk.auth.signInWithEmailAndPassword(auth,email,password);
   await sdk.auth.reload(credential.user);
   if(!credential.user.emailVerified){
    await sdk.auth.sendEmailVerification(credential.user,{url:window.location.origin}).catch(()=>{});
    await sdk.auth.signOut(auth);
    setMessage('That address is not verified yet. We sent a fresh verification email; verify it and sign in again.',true);return;
   }
   setMessage('Signed in. Syncing your workshop…',false);
  }else if(action==='reset-password'){
   if(!validEmail(email))throw Object.assign(new Error('Invalid email'),{code:'auth/invalid-email'});
   await sdk.auth.sendPasswordResetEmail(auth,email,{url:window.location.origin});
   setMessage('If an account uses that email, Firebase will send password-reset instructions.',false);
  }else if(action==='delete-account'){
   const user=auth.currentUser;
   if(!user)throw new Error('No account is signed in.');
   if(!window.confirm('Permanently delete this account and its cloud printer and material profiles? This cannot be undone.'))return;
   const password=window.prompt('Enter your password to confirm account deletion.');
   if(password===null)return;
   const credential=sdk.auth.EmailAuthProvider.credential(user.email,password);
   await sdk.auth.reauthenticateWithCredential(user,credential);
   await sdk.firestore.deleteDoc(sdk.firestore.doc(db,'users',user.uid,'workshop','profiles'));
   await sdk.auth.deleteUser(user);
   try{localStorage.removeItem(cacheKey(user.uid));localStorage.removeItem(stateKey(user.uid));localStorage.removeItem(OWNER_KEY)}catch(e){}
   writeWorkshop(emptyWorkshop());activeUser=null;handledUid='';
   updateAccountUI();setStatus('Account deleted','Your account and cloud workshop profiles have been deleted.');
   setMessage('Account deleted. Your printer and material profiles were removed.',false);
  }else if(action==='sign-out'){
   const user=auth.currentUser;
   if(user){
    signingOut=true;
    writeCache(user.uid,readWorkshop());
    try{localStorage.setItem(OWNER_KEY,'guest')}catch(e){}
    writeWorkshop(readCache('guest')||emptyWorkshop());
   }
   try{await sdk.auth.signOut(auth)}finally{signingOut=false}
   activeUser=null;handledUid='';
   updateAccountUI();setStatus('Signed out','Your account profiles are saved privately and return when you sign in again.');setMessage('Signed out.','');
  }else if(action==='sync'){
   const user=auth.currentUser;
   if(!user||!user.emailVerified){setMessage('Sign in with a verified email to sync your workshop.',true);return}
   await syncWorkshop(user);
  }
 }catch(error){
  console.warn('PrintProfit account action failed:',error);
  setMessage(errorText(error),true);
 }finally{setBusy(false);updateAccountUI()}
}
document.addEventListener('pp-workshop-open',()=>{
 ensureAccountUI();updateAccountUI();
 if(!isConfigured()){
  setStatus('Saved on this device','Add the Firebase project settings to enable secure account sync.');
  return;
 }
 setStatus('Checking account','Connecting securely to your workshop account.');
 initializeFirebase().then(()=>{
  if(!activeUser)setStatus('Saved in this browser','Create an account or sign in to sync your workshop between devices.');
 }).catch(error=>{
  console.warn('PrintProfit Firebase initialization failed:',error);
  setStatus('Account service unavailable','Your local profiles remain available.');
  setMessage('We could not load the account service. Please try again later.',true);
 });
});
document.addEventListener('pp-workshop-data-changed',handleLocalChange);
document.addEventListener('click',event=>{
 const button=event.target.closest('#ppWorkshopAccount [data-pp-account-action]');
 if(!button)return;
 event.preventDefault();handleAction(button.dataset.ppAccountAction);
},true);
window.addEventListener('online',()=>{if(activeUser)queueSync()});
})();