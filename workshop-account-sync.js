(()=> {
'use strict';
if(window.__ppWorkshopAccountSync)return;
window.__ppWorkshopAccountSync=true;

const CONFIG=window.PRINTPROFIT_FIREBASE_CONFIG||{};
const MATERIAL_KEY='printprofit.materials.v1';
const PRINTER_KEY='printprofit.workshop-printers.v1';
const PROJECT_KEY='printprofit.projects.v1';
const PROJECT_OWNER_KEY='printprofit.projects.owner.v1';
const PROJECT_CACHE_PREFIX='printprofit.projects.user-cache.v1.';
const OWNER_KEY='printprofit.workshop.owner.v1';
const STATE_PREFIX='printprofit.workshop.sync-state.v1.';
const CACHE_PREFIX='printprofit.workshop.user-cache.v1.';
const IMPORT_CHOICE_PREFIX='printprofit.workshop.import-choice.v2.';
const FIREBASE_VERSION='12.19.0';
const TERMS_VERSION='2026-10-12-v2';
const PRIVACY_VERSION='2026-10-12-v2';
const ACCEPTANCE_DOCUMENT_ID='acceptance-2026-10-12-v2';
let auth=null,db=null,sdk=null,activeUser=null,initPromise=null,accountHostReady=false,legalAccepted=false,creatingAccount=false,legalCheckGeneration=0,localImportPending=false;
let handledUid='',syncTimer=null,syncRunning=false,syncAgain=false,signingOut=false,deletingAccount=false,activeSyncCount=0,localChangeVersion=0;

const isConfigured=()=>Boolean(CONFIG.apiKey&&CONFIG.authDomain&&CONFIG.projectId&&CONFIG.appId);
const ownerId=()=>{try{return localStorage.getItem(OWNER_KEY)||'guest'}catch(e){return'guest'}};
const projectOwnerId=()=>{try{return localStorage.getItem(PROJECT_OWNER_KEY)||'guest'}catch(e){return'guest'}};
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
const readSyncState=scope=>{const state=readJson(stateKey(scope),{});return{pending:Boolean(state&&state.pending),deleted:{materials:Array.isArray(state?.deleted?.materials)?state.deleted.materials:[],printers:Array.isArray(state?.deleted?.printers)?state.deleted.printers:[],projects:Array.isArray(state?.deleted?.projects)?state.deleted.projects:[]}}};
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
   '<div id="ppAccountNotConfigured" class="pp-account-not-configured" hidden>Cloud accounts are being connected. Your printer, material and project data will continue saving in this browser.</div>'+
   '<div id="ppAccountSignedOut" class="pp-account-fields">'+
    '<div class="pp-account-signup-help">To create an account, enter a valid email and a password of at least 8 characters, then select both boxes below. Verify your email before signing in.</div>'+
    '<label>Email address<input id="ppAccountEmail" type="email" autocomplete="email" placeholder="you@example.com"></label>'+
    '<label>Password<input id="ppAccountPassword" type="password" autocomplete="current-password" minlength="8" placeholder="At least 8 characters"></label>'+
    '<div class="pp-account-consents"><span>For new accounts:</span><label><input id="ppAccountTerms" type="checkbox"><span>I agree to the <a href="./terms.html" target="_top">Terms of Use</a>.</span></label><label><input id="ppAccountSyncConsent" type="checkbox"><span>I choose to sync printer and material profiles and saved project settings and analysis details using Firebase. Uploaded 3D model files stay on this device. See the <a href="./privacy.html" target="_top">Privacy Notice</a>.</span></label></div>'+
    '<div class="pp-account-actions"><button type="button" class="pp-account-primary" data-pp-account-action="sign-in">Sign in</button><button type="button" class="pp-account-secondary" data-pp-account-action="sign-up">Create account</button></div>'+
    '<div class="pp-account-links"><button type="button" data-pp-account-action="reset-password">Forgot password?</button></div>'+
   '</div>'+
   '<div id="ppAccountSignedIn" class="pp-account-signed-in" hidden><span id="ppAccountEmailLabel"></span><div id="ppAccountLegalPending" class="pp-account-legal-pending" hidden><strong>One-time policy check</strong><p>Review the current terms and choose whether to sync your profiles and saved projects. You can delete your account without accepting.</p><label><input id="ppAccountExistingTerms" type="checkbox"><span>I agree to the <a href="./terms.html" target="_top">Terms of Use</a>.</span></label><label><input id="ppAccountExistingSync" type="checkbox"><span>I choose to sync printer and material profiles and saved project settings and analysis details using Firebase. Uploaded 3D model files stay on this device. See the <a href="./privacy.html" target="_top">Privacy Notice</a>.</span></label><button type="button" class="pp-account-primary" data-pp-account-action="accept-current-terms">Agree &amp; enable sync</button></div><div id="ppAccountLocalImportPending" class="pp-account-legal-pending" hidden><strong>Profiles and projects saved on this device</strong><p>This browser has local profiles and projects. Choose whether to copy them into your account. Only import them if they belong to you.</p><div class="pp-account-actions"><button type="button" class="pp-account-primary" data-pp-account-action="import-local-profiles">Import profiles &amp; projects</button><button type="button" class="pp-account-secondary" data-pp-account-action="skip-local-import">Keep them on this device</button></div></div><div class="pp-account-actions"><button type="button" class="pp-account-secondary" data-pp-account-action="sync">Sync now</button><button type="button" class="pp-account-secondary" data-pp-account-action="sign-out">Sign out</button></div><button type="button" class="pp-account-danger" data-pp-account-action="delete-account">Delete account…</button><div id="ppAccountDeleteConfirm" class="pp-account-delete-confirm" hidden><p>This removes your Firebase account and cloud profiles and projects. It cannot erase local copies or uploaded model files on other devices. Enter your password to continue.</p><label for="ppAccountDeletePassword">Password</label><input id="ppAccountDeletePassword" type="password" autocomplete="current-password" placeholder="Your account password"><div class="pp-account-actions"><button type="button" class="pp-account-delete-final" data-pp-account-action="confirm-delete-account">Permanently delete</button><button type="button" class="pp-account-secondary" data-pp-account-action="cancel-delete-account">Cancel</button></div></div></div>'+
   '<p id="ppAccountMessage" class="pp-account-message" role="status" aria-live="polite"></p>'+
   '<small class="pp-account-footnote">Your password is handled securely by Firebase. Synced profiles and project settings are private to your account. Uploaded 3D model files stay on this device.</small>'+
   '<a class="pp-account-privacy-link" href="./privacy.html" target="_top">Privacy Notice</a><a class="pp-account-privacy-link" href="./terms.html" target="_top">Terms of Use</a>'+
  '</section>';
 if(!document.getElementById('ppAccountStyles')){
  const style=document.createElement('style');style.id='ppAccountStyles';style.textContent=
   '.pp-account-card{margin:0 28px 16px;padding:17px 18px;border:1px solid #355363;border-radius:14px;background:linear-gradient(145deg,#0c202a,#0a1820);color:#edf3f6;font-family:Inter,Segoe UI,system-ui,sans-serif}'+
   '.pp-account-heading{display:flex;justify-content:space-between;align-items:flex-start;gap:14px}.pp-account-kicker{display:block;color:#ffae62;font-size:9px;font-weight:900;letter-spacing:.16em}.pp-account-heading h3{margin:4px 0 6px;font-size:16px}.pp-account-status{display:flex;flex-direction:column;gap:3px;color:#aebdc6;font-size:12px}.pp-account-status strong{color:#edf3f6;font-size:12px}.pp-account-badge{flex:0 0 auto;padding:5px 8px;border:1px solid #355363;border-radius:999px;color:#aebdc6;font-size:9px;font-weight:900;letter-spacing:.08em}.pp-account-badge.is-synced{border-color:#16865f;color:#70e0b5;background:#0a3028}.pp-account-fields{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px;margin-top:14px;min-width:0}.pp-account-fields label{color:#aebdc6;font-size:11px}.pp-account-fields input:not([type=checkbox]){display:block;width:100%;min-width:0;box-sizing:border-box;margin-top:5px;padding:10px 11px;border:1px solid #355363;border-radius:8px;background:#07141c;color:#f5f8fb;font:inherit;font-size:13px}.pp-account-actions{display:flex;gap:8px;align-items:center;flex-wrap:wrap}.pp-account-primary,.pp-account-secondary{min-height:36px;padding:8px 12px;border:1px solid #ff7800;border-radius:8px;background:#ff7800;color:#fff;font-weight:800;cursor:pointer}.pp-account-secondary{border-color:#355363;background:#0d2029;color:#dce8ed}.pp-account-danger{padding:0;border:0;background:transparent;color:#ff9b9b;font:inherit;font-size:11px;text-decoration:underline;cursor:pointer}.pp-account-primary:disabled,.pp-account-secondary:disabled{opacity:.55;cursor:wait}.pp-account-fields>.pp-account-actions{grid-column:1/-1}.pp-account-consents{grid-column:1/-1;display:grid;gap:10px;min-width:0;padding:10px 11px;border:1px solid #355363;border-radius:8px;background:#091820;color:#aebdc6;font-size:11px;line-height:1.45}.pp-account-consents>span{font-size:10px;font-weight:800;color:#dce8ed}.pp-account-consents label,.pp-account-legal-pending label{display:flex;flex-direction:column;align-items:flex-start;gap:6px;min-width:0;width:100%;color:#c5d5de;font-size:11px}.pp-account-consents input[type=checkbox],.pp-account-legal-pending input[type=checkbox]{display:block!important;width:18px!important;height:18px!important;min-width:18px!important;min-height:18px!important;max-width:18px!important;max-height:18px!important;flex:0 0 18px!important;margin:0!important;padding:0!important;box-sizing:border-box!important;appearance:auto!important;accent-color:#ff7800;cursor:pointer}.pp-account-consents label>span,.pp-account-legal-pending label>span{display:block;width:100%;min-width:0}.pp-account-consents a,.pp-account-legal-pending a{color:#75d8f2}.pp-account-legal-pending{display:grid;gap:9px;flex-basis:100%;padding:13px;border:1px solid #765021;border-radius:10px;background:#241c0e}.pp-account-legal-pending strong{color:#ffe2b8;font-size:13px}.pp-account-legal-pending p{margin:0;color:#dbc8a9;font-size:11px;line-height:1.5}.pp-account-legal-pending[hidden]{display:none!important}.pp-account-links{grid-column:1/-1;display:flex;gap:12px}.pp-account-links button{padding:0;border:0;background:transparent;color:#75d8f2;font:inherit;font-size:11px;text-decoration:underline;cursor:pointer}.pp-account-signed-in{display:flex;flex-wrap:wrap;justify-content:flex-start;align-items:center;gap:12px;margin-top:14px;color:#dce8ed;font-size:12px}.pp-account-signed-in>.pp-account-actions{margin-left:auto}.pp-account-danger{flex-basis:100%;text-align:left}.pp-account-delete-confirm{display:flex;flex-wrap:wrap;align-items:center;gap:8px;flex-basis:100%;padding:12px;border:1px solid #6c3439;border-radius:9px;background:#241417}.pp-account-delete-confirm p{flex-basis:100%;margin:0;color:#e7c3c6;font-size:11px;line-height:1.45}.pp-account-delete-confirm label{color:#e7c3c6;font-size:11px}.pp-account-delete-confirm input{min-width:180px;padding:8px 10px;border:1px solid #704249;border-radius:7px;background:#110d10;color:#fff;font:inherit}.pp-account-delete-final{min-height:36px;padding:8px 12px;border:1px solid #a4434d;border-radius:8px;background:#8d2633;color:#fff;font-weight:800;cursor:pointer}.pp-account-delete-confirm[hidden]{display:none!important}.pp-account-message{min-height:17px;margin:8px 0 0;color:#77e1b8;font-size:11px}.pp-account-message.is-error{color:#ff9b9b}.pp-account-not-configured{margin-top:12px;padding:10px 12px;border:1px solid #765021;border-radius:9px;background:#312411;color:#f8d8a8;font-size:12px;line-height:1.5}.pp-account-footnote{display:block;color:#81949f;font-size:10px;line-height:1.45}.pp-account-privacy-link{display:inline-block;margin-top:5px;color:#75d8f2;font-size:10px;text-decoration:underline}.pp-account-fields[hidden],.pp-account-signed-in[hidden],.pp-account-not-configured[hidden],.pp-account-links [hidden]{display:none!important}'+
   '@media(max-width:760px){.pp-account-card{margin-left:12px;margin-right:12px;padding:15px 14px}.pp-account-fields{grid-template-columns:1fr}.pp-account-fields>.pp-account-actions,.pp-account-links{grid-column:auto}.pp-account-signed-in{align-items:flex-start;flex-direction:column}.pp-account-delete-confirm{align-items:stretch;flex-direction:column}.pp-account-delete-confirm input{width:100%;box-sizing:border-box}}';
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
 const deleteConfirm=document.getElementById('ppAccountDeleteConfirm');if(deleteConfirm&&!activeUser)deleteConfirm.hidden=true;
 document.getElementById('ppAccountBadge').textContent=activeUser?(legalAccepted?'ACCOUNT':'REVIEW'):'LOCAL';
 document.getElementById('ppAccountBadge').classList.toggle('is-synced',Boolean(activeUser&&legalAccepted));
 const pending=document.getElementById('ppAccountLegalPending');if(pending)pending.hidden=!activeUser||legalAccepted;
 const importPending=document.getElementById('ppAccountLocalImportPending');if(importPending)importPending.hidden=!activeUser||!legalAccepted||!localImportPending;
 const syncButton=document.querySelector('#ppWorkshopAccount [data-pp-account-action="sync"]');if(syncButton)syncButton.disabled=!legalAccepted||localImportPending;
 const emailLabel=document.getElementById('ppAccountEmailLabel');if(emailLabel)emailLabel.textContent=activeUser?activeUser.email||'Signed in':'';
 if(!configured)setStatus('Saved on this device','Add the Firebase project settings to enable secure account sync.');
 else if(activeUser&&!legalAccepted)setStatus('Review the current terms','Accept the Terms and choose whether to sync profiles and projects before cloud sync is enabled.');
 else if(activeUser&&localImportPending)setStatus('Choose what to sync','Decide whether to copy this browser’s profiles and projects into your account.');
 else if(activeUser)setStatus('Signed in as '+(activeUser.email||'your account'),'Your printer and material profiles and saved projects sync with your account. Uploaded 3D model files stay on this device.');
 else setStatus('Saved in this browser','Create an account or sign in to sync your profiles and projects between devices.');
}
function setBusy(value){
 document.querySelectorAll('#ppWorkshopAccount [data-pp-account-action]').forEach(button=>{button.disabled=Boolean(value)});
}
function errorText(error){
 const code=String(error?.code||'');
 if(String(error?.message||'').startsWith('Project “'))return error.message;
 if(code.includes('email-already-in-use'))return'That email already has an account. Sign in to request another verification email if needed.';
 if(code.includes('invalid-credential')||code.includes('user-not-found')||code.includes('wrong-password'))return'Email or password was not recognised.';
 if(code.includes('invalid-email'))return'Enter a valid email address.';
 if(code.includes('weak-password'))return'Choose a password with at least 8 characters.';
 if(code.includes('operation-not-allowed'))return'Email and password sign-up is disabled in Firebase Authentication. Enable the Email/Password provider for PrintProfit.';
 if(code.includes('unauthorized-domain'))return'Firebase sign-in is not enabled for printprofit.co.uk. Add this domain to Firebase Authentication’s authorised domains.';
 if(code.includes('invalid-api-key')||code.includes('api-key-not-valid')||code.includes('app-not-authorized')||code.includes('configuration-not-found'))return'Firebase rejected the PrintProfit web API key. Check that the key is active, allows the Identity Toolkit API in Google Cloud, and matches the Firebase web app settings.';
 if(code.includes('email-send-quota-exceeded')||code.includes('quota-exceeded'))return'Firebase could not send an email right now. Wait a little, then try again.';
 if(code.includes('too-many-requests'))return'Too many attempts. Please wait a little and try again.';
 if(code.includes('requires-recent-login'))return'For security, sign out and sign back in before deleting this account.';
 if(code.includes('network-request-failed'))return'Network connection failed. Check your connection and try again.';
 if(code.includes('permission-denied')||code.includes('unauthorized'))return'Your account is signed in, but cloud sync is not allowed. Check the Firestore rules and verify your email.';
 return'We could not complete that step. Please try again.';
 }
function configReady(){
 return isConfigured()&&Object.values(CONFIG).every(value=>typeof value==='string');
}
function legalDocument(user){return sdk.firestore.doc(db,'users',user.uid,'legal',ACCEPTANCE_DOCUMENT_ID)}
async function hasCurrentLegalAcceptance(user){
 const snapshot=await sdk.firestore.getDoc(legalDocument(user));
 const data=snapshot.exists()?(snapshot.data()||{}):{};
 return data.termsVersion===TERMS_VERSION&&data.privacyVersion===PRIVACY_VERSION&&data.syncConsent===true&&data.projectSyncConsent===true;
}
async function writeCurrentLegalAcceptance(user){
 await sdk.firestore.setDoc(legalDocument(user),{
  termsVersion:TERMS_VERSION,
  privacyVersion:PRIVACY_VERSION,
  syncConsent:true,
  projectSyncConsent:true,
  acceptedAt:sdk.firestore.serverTimestamp()
 });
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
  authSdk.onAuthStateChanged(auth,async user=>{
   const generation=++legalCheckGeneration;
   if(user&&!user.emailVerified){
    activeUser=null;legalAccepted=false;localImportPending=false;handledUid='';
    updateAccountUI();
    if(!creatingAccount){
     setMessage('Please verify your email from the message we sent, then sign in again.',true);
     authSdk.signOut(auth).catch(()=>{});
    }
    return;
   }
   if(user){
    let projectsSeparated=true;
    try{if(typeof window.__ppSetProjectWorkspaceOwner==='function')projectsSeparated=await window.__ppSetProjectWorkspaceOwner(user.uid)}catch(error){projectsSeparated=false;console.warn('PrintProfit project workspace switch failed:',error)}
    if(generation!==legalCheckGeneration||auth.currentUser?.uid!==user.uid)return;
    if(!projectsSeparated){
     activeUser=null;legalAccepted=false;localImportPending=false;handledUid='';updateAccountUI();
     setMessage('We could not safely separate this browser’s saved projects. Keep the projects on this device and try again after freeing browser storage.',true);
     authSdk.signOut(auth).catch(()=>{});return;
    }
    if(!switchLocalWorkspaceToUser(user)){
     activeUser=null;legalAccepted=false;localImportPending=false;handledUid='';updateAccountUI();
     setMessage('We could not safely separate this browser’s profiles. Sign out, keep the profiles on this device and try again after freeing browser storage.',true);
     authSdk.signOut(auth).catch(()=>{});return;
   }
   activeUser=user||null;legalAccepted=false;localImportPending=false;
   updateAccountUI();
   if(!activeUser){handledUid='';return}
   hasCurrentLegalAcceptance(activeUser).then(accepted=>{
    if(generation!==legalCheckGeneration||auth.currentUser?.uid!==user.uid)return;
    legalAccepted=accepted;updateAccountUI();
    if(!accepted){handledUid='';setMessage('Review the current Terms and Privacy Notice and choose whether to enable profile and project sync.',false);return}
    if(needsLocalImportDecision(user)){
     localImportPending=true;handledUid='';updateAccountUI();
     setStatus('Choose what to sync','This browser has profiles and projects saved locally. Import only if they belong to you.');
     setMessage('Choose whether to copy local profiles and projects into this account, or keep them on this device.',false);return;
    }
    localImportPending=false;
    if(handledUid!==user.uid){
     handledUid=user.uid;
     setStatus('Syncing workshop','Loading your profiles and saved projects.');
     syncWorkshop(user).catch(error=>{
      console.warn('PrintProfit account sync failed:',error);
      setStatus('Sync needs attention','Your local profiles and projects are still available on this device.');
      setMessage(errorText(error),true);
     });
    }
   }).catch(error=>{
    if(generation!==legalCheckGeneration||auth.currentUser?.uid!==user.uid)return;
    console.warn('PrintProfit legal acceptance check failed:',error);
    legalAccepted=false;handledUid='';updateAccountUI();
    setMessage('We could not verify your current account terms. Your profiles and projects remain on this device; try again later.',true);
   });
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
 if((detail.kind==='materials'||detail.kind==='printers'||detail.kind==='projects')&&Array.isArray(detail.before)&&Array.isArray(detail.after)){
  rememberDeletion(state,detail.kind,detail.before,detail.after);
 }
 state.pending=true;writeSyncState(scope,state);
 if(scope==='guest')invalidateLocalImportChoices();
 if(activeUser&&activeUser.emailVerified&&legalAccepted&&!localImportPending){
  setStatus('Saving workshop','Sending your latest changes to your account.');
  queueSync();
 }else{
  setStatus('Saved on this device','Sign in whenever you want to sync your profiles and projects.');
 }
}
const emptyWorkshop=()=>({materials:[],printers:[]});
const importChoiceKey=uid=>IMPORT_CHOICE_PREFIX+uid;
const readLocalImportChoice=uid=>{try{return localStorage.getItem(importChoiceKey(uid))||''}catch(e){return''}};
function saveLocalImportChoice(uid,choice){try{localStorage.setItem(importChoiceKey(uid),choice);return true}catch(e){return false}}
function invalidateLocalImportChoices(){try{for(let i=localStorage.length-1;i>=0;i--){const key=localStorage.key(i);if(key&&key.startsWith(IMPORT_CHOICE_PREFIX))localStorage.removeItem(key)}}catch(e){}}
function hasProfiles(value){return normalizeList(value?.materials).length>0||normalizeList(value?.printers).length>0}
const readProjectsForOwner=owner=>{
 try{
  if(typeof window.__ppGetProjectWorkspaceForOwner==='function')return window.__ppGetProjectWorkspaceForOwner(owner)||[];
  const value=readJson(PROJECT_CACHE_PREFIX+(owner||'guest'),null);
  return Array.isArray(value)?value:[];
 }catch(e){return[]}
};
const currentProjects=()=>{
 try{const value=typeof window.__ppGetProjectWorkspace==='function'?window.__ppGetProjectWorkspace():readList(PROJECT_KEY);return Array.isArray(value)?value:[]}
 catch(e){return readList(PROJECT_KEY)}
};
const hasProjects=value=>Array.isArray(value)&&value.length>0;
const writeProjectsFromSync=async projects=>{
 if(typeof window.__ppSetProjectsFromSync==='function')return window.__ppSetProjectsFromSync(projects);
 try{localStorage.setItem(PROJECT_KEY,JSON.stringify(projects));return true}catch(e){return false}
};
function switchLocalWorkspaceToUser(user){
 const currentOwner=ownerId();
 if(currentOwner===user.uid)return true;
 const current=readWorkshop();
 if(currentOwner==='guest'){
  if(!writeCache('guest',current))return false;
 }else if(!writeCache(currentOwner,current))return false;
 const ownCache=readCache(user.uid);
 const next=ownCache?{materials:normalizeList(ownCache.materials),printers:normalizeList(ownCache.printers)}:emptyWorkshop();
 if(!writeWorkshop(next))return false;
 try{localStorage.setItem(OWNER_KEY,user.uid)}catch(e){writeWorkshop(emptyWorkshop());return false}
 return true;
}
function needsLocalImportDecision(user){
 if(readLocalImportChoice(user.uid))return false;
 const guest=readCache('guest'),guestProjects=readProjectsForOwner('guest');
 if(!hasProfiles(guest)&&!hasProjects(guestProjects)){
  saveLocalImportChoice(user.uid,'skip');
  return false;
 }
 return true;
}
 function readSyncCache(uid){return readCache(uid)||null}
function sameWorkshop(a,b){return JSON.stringify(a)===JSON.stringify(b)}
const emptyDeleted=()=>({materials:[],printers:[],projects:[]});
const mergeDeleted=(...sets)=>({
 materials:[...new Set(sets.flatMap(set=>Array.isArray(set?.materials)?set.materials:[]).map(String))],
 printers:[...new Set(sets.flatMap(set=>Array.isArray(set?.printers)?set.printers:[]).map(String))],
 projects:[...new Set(sets.flatMap(set=>Array.isArray(set?.projects)?set.projects:[]).map(String))]
});
const sameDeleted=(a,b)=>JSON.stringify([...a.materials].sort())===JSON.stringify([...b.materials].sort())&&JSON.stringify([...a.printers].sort())===JSON.stringify([...b.printers].sort())&&JSON.stringify([...(a.projects||[])].sort())===JSON.stringify([...(b.projects||[])].sort());
function cloudWorkshop(data){
 return{materials:normalizeList(data?.materials),printers:normalizeList(data?.printers)};
}
function cloudDeleted(data){
 return{materials:Array.isArray(data?.deletedMaterials)?data.deletedMaterials.map(String):[],printers:Array.isArray(data?.deletedPrinters)?data.deletedPrinters.map(String):[]};
}
const MAX_SYNCED_PROJECT_BYTES=700*1024;
function sanitizeProject(project){
 if(!project||typeof project!=='object'||!project.id)return null;
 const clean={
  id:String(project.id),name:String(project.name||'My project'),updated:Number(project.updated)||Date.now(),
  material:String(project.material||''),hours:String(project.hours||''),used:String(project.used||''),currency:String(project.currency||''),
  data:project.data&&typeof project.data==='object'?JSON.parse(JSON.stringify(project.data)): {},
  file:project.file&&typeof project.file==='object'?{name:String(project.file.name||''),type:String(project.file.type||''),lastModified:Number(project.file.lastModified)||0}:null,
  fileData:project.fileData&&typeof project.fileData==='object'?JSON.parse(JSON.stringify(project.fileData)):{},
  fileStatus:String(project.fileStatus||'')
 };
 const bytes=value=>{const json=JSON.stringify(value);try{return new TextEncoder().encode(json).length}catch(e){return json.length*3}};
 if(bytes(clean)>MAX_SYNCED_PROJECT_BYTES){
  delete clean.fileData;
  clean.fileStatus='Project settings synced. Detailed slicer data was too large to sync; the original model file remains on its device.';
 }
 if(bytes(clean)>MAX_SYNCED_PROJECT_BYTES)throw new Error('Project “'+clean.name+'” is too large to sync. Remove extra model analysis data and try again.');
 return clean;
}
async function syncProjects(user,deletedIds,importGuest){
 const projectSyncVersion=localChangeVersion;
 const localRaw=currentProjects();
 const guestRaw=importGuest?readProjectsForOwner('guest'):[];
 const local=localRaw.map(sanitizeProject).filter(Boolean);
 const guest=guestRaw.map(sanitizeProject).filter(Boolean);
 const localRawById=new Map();
 [...guestRaw,...localRaw].forEach(project=>{if(!project||!project.id)return;const old=localRawById.get(String(project.id));if(!old||Number(project.updated||0)>=Number(old.updated||0))localRawById.set(String(project.id),project)});
 const byId=new Map();
 [...guest,...local].forEach(project=>{const old=byId.get(project.id);if(!old||project.updated>=old.updated)byId.set(project.id,project)});
 const projectCollection=sdk.firestore.collection(db,'users',user.uid,'projects');
 const snapshot=await sdk.firestore.getDocs(projectCollection);
 const cloud=new Map();
 snapshot.forEach(doc=>{
  const data=doc.data()||{};
  cloud.set(doc.id,{id:doc.id,deleted:data.deleted===true,updated:Number(data.updated)||0,project:data.project&&typeof data.project==='object'?sanitizeProject(data.project):null});
 });
 const next=new Map(cloud),now=Date.now();
 const locallyDeleted=new Set((deletedIds||[]).map(String));
 locallyDeleted.forEach(id=>next.set(id,{id,deleted:true,updated:now,project:null}));
 byId.forEach(project=>{
  if(locallyDeleted.has(project.id))return;
  const remote=cloud.get(project.id);
  if(!remote||project.updated>remote.updated||(!remote.deleted&&project.updated===remote.updated&&JSON.stringify(project)!==JSON.stringify(remote.project)))next.set(project.id,{id:project.id,deleted:false,updated:project.updated,project});
 });
 if(deletingAccount||signingOut||auth.currentUser?.uid!==user.uid||projectOwnerId()!==user.uid)return;
 const writes=[];
 next.forEach((entry,id)=>{
  const remote=cloud.get(id);
  if(remote&&remote.deleted===entry.deleted&&remote.updated===entry.updated&&JSON.stringify(remote.project||null)===JSON.stringify(entry.project||null))return;
  const ref=sdk.firestore.doc(projectCollection,id);
  writes.push({ref,data:{schemaVersion:1,updated:entry.updated,deleted:entry.deleted,...(entry.deleted?{}:{project:entry.project})}});
 });
 for(let offset=0;offset<writes.length;offset+=400){
  const batch=sdk.firestore.writeBatch(db);
  writes.slice(offset,offset+400).forEach(write=>batch.set(write.ref,write.data));
  await batch.commit();
 }
 const merged=[...next.values()].filter(entry=>!entry.deleted&&entry.project).map(entry=>{
  const localProject=localRawById.get(entry.id);
  if(localProject?.fileData&&String(entry.project.fileStatus||'').includes('Detailed slicer data was too large to sync')){
   return{...entry.project,fileData:localProject.fileData,fileStatus:localProject.fileStatus||entry.project.fileStatus};
  }
  return entry.project;
 });
 if(deletingAccount||signingOut||auth.currentUser?.uid!==user.uid||projectOwnerId()!==user.uid)return;
 if(localChangeVersion===projectSyncVersion){
  const stored=await writeProjectsFromSync(merged);
  if(!stored)throw new Error('The synced projects could not be saved on this device.');
 }
}
async function syncWorkshop(user){
 if(!user||!user.emailVerified||!legalAccepted||localImportPending||deletingAccount)return;
 activeSyncCount++;
 try{return await syncWorkshopImpl(user)}finally{activeSyncCount--}
}
async function syncWorkshopImpl(user){
 if(!user||!user.emailVerified||!legalAccepted||localImportPending||deletingAccount)return;
 const syncVersion=localChangeVersion;
 const currentOwner=ownerId();
 let local=readWorkshop(),scope=(currentOwner==='guest'||!currentOwner)?'guest':currentOwner;
 let pendingState=readSyncState(scope);
 if(currentOwner===user.uid&&readLocalImportChoice(user.uid)==='import'){
  const guestCache=readCache('guest');
  if(guestCache){
   const guestState=readSyncState('guest');
   pendingState={pending:pendingState.pending||guestState.pending,deleted:mergeDeleted(pendingState.deleted,guestState.deleted)};
   local=mergeWorkshop(guestCache,local,pendingState.deleted);
   writeSyncState(user.uid,pendingState);
  }
 }
 if(currentOwner!=='guest'&&currentOwner!==user.uid){
  writeCache(currentOwner,local);
  const ownCache=readSyncCache(user.uid);
  local=ownCache?{materials:normalizeList(ownCache.materials),printers:normalizeList(ownCache.printers)}:emptyWorkshop();
  writeWorkshop(local);
  scope=user.uid;pendingState=readSyncState(scope);
 }else if(currentOwner==='guest'){
  const guestCache=readCache('guest')||local,ownCache=readSyncCache(user.uid),accountState=readSyncState(user.uid);
  pendingState={pending:pendingState.pending||accountState.pending,deleted:mergeDeleted(pendingState.deleted,accountState.deleted)};
  if(readLocalImportChoice(user.uid)==='import'){
   const guestState=readSyncState('guest');
   pendingState={pending:pendingState.pending||guestState.pending,deleted:mergeDeleted(pendingState.deleted,guestState.deleted)};
   local=mergeWorkshop(guestCache,ownCache||emptyWorkshop(),pendingState.deleted);
   writeSyncState('guest',{pending:false,deleted:emptyDeleted()});
  }else local=ownCache?{materials:normalizeList(ownCache.materials),printers:normalizeList(ownCache.printers)}:emptyWorkshop();
  writeSyncState(user.uid,{pending:pendingState.pending,deleted:pendingState.deleted});
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
 await syncProjects(user,pendingState.deleted.projects,readLocalImportChoice(user.uid)==='import');
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
 if(readLocalImportChoice(user.uid)==='import'){
  writeCache('guest',emptyWorkshop());
  writeSyncState('guest',{pending:false,deleted:emptyDeleted()});
 }
 setStatus('Workshop synced','Your printer and material profiles and saved projects are in your account.');
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
  setMessage('Account sync is not connected yet. Your profiles and projects are still saved in this browser.',true);return;
 }
 setBusy(true);setMessage('',false);
 try{
  await initializeFirebase();
  const email=emailValue(),password=passwordValue();
  if(action==='sign-up'){
    if(!validEmail(email))throw Object.assign(new Error('Invalid email'),{code:'auth/invalid-email'});
    if(password.length<8)throw Object.assign(new Error('Weak password'),{code:'auth/weak-password'});
    if(!document.getElementById('ppAccountTerms')?.checked)throw new Error('Please agree to the Terms of Use before creating an account.');
    if(!document.getElementById('ppAccountSyncConsent')?.checked)throw new Error('Please choose whether to sync your profiles and saved project settings before creating an account.');
    creatingAccount=true;
    try{
     const credential=await sdk.auth.createUserWithEmailAndPassword(auth,email,password);
     let acceptanceSaved=false;
     try{await writeCurrentLegalAcceptance(credential.user);acceptanceSaved=true}catch(error){console.warn('PrintProfit account acceptance could not be saved yet:',error)}
     let verificationSent=false;
     try{await sdk.auth.sendEmailVerification(credential.user,{url:window.location.origin});verificationSent=true}
     catch(error){console.warn('PrintProfit verification email could not be sent:',error)}
     await sdk.auth.signOut(auth).catch(error=>console.warn('PrintProfit could not sign out the unverified account:',error));
     if(verificationSent)setMessage(acceptanceSaved?'Account created. Check your inbox and spam folder, then verify your email before signing in.':'Account created and verification sent. After verifying, sign in and complete the one-time Terms and profile-and-project sync check.',false);
     else setMessage('Your account was created, but Firebase could not send the verification email. Check your inbox and spam folder; you can try signing in to request another email.',true);
    }finally{
     creatingAccount=false;
     if(auth.currentUser&&!auth.currentUser.emailVerified)await sdk.auth.signOut(auth).catch(()=>{});
    }
   }else if(action==='accept-current-terms'){
   const user=auth.currentUser;
   if(!user||!user.emailVerified)throw new Error('Sign in with a verified email before accepting the current terms.');
   if(!document.getElementById('ppAccountExistingTerms')?.checked)throw new Error('Please agree to the Terms of Use to continue.');
   if(!document.getElementById('ppAccountExistingSync')?.checked)throw new Error('Please choose profile and project sync to use cloud sync.');
   await writeCurrentLegalAcceptance(user);
   legalAccepted=true;
   if(needsLocalImportDecision(user)){
    localImportPending=true;updateAccountUI();
    setStatus('Choose what to sync','This browser has profiles and projects saved locally. Import only if they belong to you.');
    setMessage('Choose whether to copy local profiles and projects into this account, or keep them on this device.',false);return;
   }
   localImportPending=false;updateAccountUI();
   setMessage('Terms accepted. Syncing your workshop…',false);
   if(handledUid!==user.uid){handledUid=user.uid;await syncWorkshop(user)}
  }else if(action==='import-local-profiles'||action==='skip-local-import'){
   const user=auth.currentUser;
   if(!user||!user.emailVerified||!legalAccepted)throw new Error('Sign in and accept the current terms before choosing what to sync.');
   const choice=action==='import-local-profiles'?'import':'skip';
   if(!saveLocalImportChoice(user.uid,choice))throw new Error('This browser could not save your choice. Please allow site storage and try again.');
   localImportPending=false;updateAccountUI();
   setMessage(choice==='import'?'Copying local profiles and projects into this account…':'Keeping these profiles and projects on this device. Syncing your account data…',false);
   if(handledUid!==user.uid)handledUid=user.uid;
   await syncWorkshop(user);
  }else if(action==='sign-in'){
   if(!validEmail(email))throw Object.assign(new Error('Invalid email'),{code:'auth/invalid-email'});
   const credential=await sdk.auth.signInWithEmailAndPassword(auth,email,password);
   await sdk.auth.reload(credential.user);
   if(!credential.user.emailVerified){
    let verificationSent=false;
    try{await sdk.auth.sendEmailVerification(credential.user,{url:window.location.origin});verificationSent=true}
    catch(error){console.warn('PrintProfit verification email could not be resent:',error)}
    await sdk.auth.signOut(auth);
    setMessage(verificationSent?'That address is not verified yet. We sent another verification email; check your inbox and spam folder, then sign in again.':'That address is not verified, and Firebase could not send a verification email. Wait a little and try signing in again.',true);return;
   }
   setMessage('Signed in. Syncing your profiles and projects…',false);
  }else if(action==='reset-password'){
   if(!validEmail(email))throw Object.assign(new Error('Invalid email'),{code:'auth/invalid-email'});
   await sdk.auth.sendPasswordResetEmail(auth,email,{url:window.location.origin});
   setMessage('If an account uses that email, Firebase will send password-reset instructions.',false);
  }else if(action==='delete-account'){
   if(!auth.currentUser)throw new Error('No account is signed in.');
   const confirmation=document.getElementById('ppAccountDeleteConfirm');
   if(confirmation){confirmation.hidden=false;document.getElementById('ppAccountDeletePassword')?.focus();}
   setMessage('Enter your password to confirm account deletion.',false);return;
  }else if(action==='cancel-delete-account'){
   const confirmation=document.getElementById('ppAccountDeleteConfirm');if(confirmation)confirmation.hidden=true;
   const input=document.getElementById('ppAccountDeletePassword');if(input)input.value='';
   setMessage('',false);
  }else if(action==='confirm-delete-account'){
   const user=auth.currentUser;
   if(!user)throw new Error('No account is signed in.');
   const password=String(document.getElementById('ppAccountDeletePassword')?.value||'');
   if(!password){setMessage('Enter your password to continue.',true);return}
   const credential=sdk.auth.EmailAuthProvider.credential(user.email,password);
   await sdk.auth.reauthenticateWithCredential(user,credential);
   deletingAccount=true;
   while(activeSyncCount>0)await new Promise(resolve=>setTimeout(resolve,40));
   const cloudProjects=await sdk.firestore.getDocs(sdk.firestore.collection(db,'users',user.uid,'projects'));
   for(const projectDoc of cloudProjects.docs)await sdk.firestore.deleteDoc(projectDoc.ref);
   await sdk.firestore.deleteDoc(sdk.firestore.doc(db,'users',user.uid,'workshop','profiles'));
   await sdk.firestore.deleteDoc(legalDocument(user));
   await sdk.firestore.deleteDoc(sdk.firestore.doc(db,'users',user.uid,'legal','acceptance-2026-10-12-v1'));
   legalAccepted=false;updateAccountUI();
   if(typeof window.__ppSetProjectWorkspaceOwner==='function'){
    const preserved=await window.__ppSetProjectWorkspaceOwner('guest',{keepCurrentLocal:true});
    if(!preserved)throw new Error('Cloud data was removed, but local projects could not be safely preserved. Keep this page open and retry.');
   }
   await sdk.auth.deleteUser(user);
   deletingAccount=false;
   try{localStorage.removeItem(cacheKey(user.uid));localStorage.removeItem(stateKey(user.uid));localStorage.removeItem(importChoiceKey(user.uid));localStorage.removeItem(PROJECT_CACHE_PREFIX+user.uid);localStorage.removeItem(OWNER_KEY)}catch(e){}
   writeWorkshop(emptyWorkshop());activeUser=null;handledUid='';
   updateAccountUI();setStatus('Account deleted','Your account and cloud profiles and projects have been deleted.');
   setMessage('Account deleted. Your cloud profiles and projects were removed. Local projects remain on this device.',false);
  }else if(action==='sign-out'){
   const user=auth.currentUser;
   if(user){
    if(typeof window.__ppSetProjectWorkspaceOwner==='function'){
     const switched=await window.__ppSetProjectWorkspaceOwner('guest');
     if(!switched)throw new Error('Saved projects could not be safely separated from this account.');
    }
    signingOut=true;
    writeCache(user.uid,readWorkshop());
    try{localStorage.setItem(OWNER_KEY,'guest')}catch(e){}
    writeWorkshop(readCache('guest')||emptyWorkshop());
   }
   try{await sdk.auth.signOut(auth)}finally{signingOut=false}
   activeUser=null;handledUid='';
   updateAccountUI();setStatus('Signed out','Your account profiles and projects are saved privately and return when you sign in again.');setMessage('Signed out.','');
  }else if(action==='sync'){
   const user=auth.currentUser;
   if(!user||!user.emailVerified){setMessage('Sign in with a verified email to sync your profiles and projects.',true);return}
   if(!legalAccepted){setMessage('Accept the current Terms and profile-and-project sync notice before syncing.',true);return}
   if(localImportPending){setMessage('Choose whether to import this browser’s profiles and projects before syncing.',true);return}
   await syncWorkshop(user);
  }
 }catch(error){
  console.warn('PrintProfit account action failed:',error);
  if(action==='confirm-delete-account')deletingAccount=false;
  if(action==='confirm-delete-account'&&!legalAccepted&&auth.currentUser){setMessage('Your cloud data was removed, but Firebase could not finish deleting the login. Sign in again and retry, or contact Printprofit26@outlook.com.',true)}
  else setMessage(errorText(error),true);
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
  if(!activeUser)setStatus('Saved in this browser','Create an account or sign in to sync your profiles and projects between devices.');
 }).catch(error=>{
  console.warn('PrintProfit Firebase initialization failed:',error);
  setStatus('Account service unavailable','Your local profiles and projects remain available.');
  setMessage(errorText(error),true);
 });
});
document.addEventListener('pp-workshop-data-changed',handleLocalChange);
 document.addEventListener('pp-projects-data-changed',handleLocalChange);
document.addEventListener('click',event=>{
 const button=event.target.closest('#ppWorkshopAccount [data-pp-account-action]');
 if(!button)return;
 const action=button.dataset.ppAccountAction;
 if(action==='sign-up'||action==='sign-in'){
  const password=document.getElementById('ppAccountPassword');
  if(password)password.autocomplete=action==='sign-up'?'new-password':'current-password';
 }
 event.preventDefault();handleAction(action);
},true);
window.addEventListener('online',()=>{if(activeUser&&legalAccepted&&!localImportPending)queueSync()});
})();