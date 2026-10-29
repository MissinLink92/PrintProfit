import {initializeApp} from 'https://www.gstatic.com/firebasejs/12.19.0/firebase-app.js';
import {getAuth,signInWithEmailAndPassword,getMultiFactorResolver,TotpMultiFactorGenerator,multiFactor,signOut,setPersistence,inMemoryPersistence} from 'https://www.gstatic.com/firebasejs/12.19.0/firebase-auth.js';
import {getFunctions,httpsCallable} from 'https://www.gstatic.com/firebasejs/12.19.0/firebase-functions.js';

const config=window.PRINTPROFIT_FIREBASE_CONFIG;
const app=initializeApp(config);
const auth=getAuth(app);
const functions=getFunctions(app,'europe-west2');
const $=id=>document.getElementById(id);
let email='',resolver=null,secret=null,busy=false;
const steps=['email-step','password-step','code-step','setup-step'];
function show(id){for(const step of steps)$(step).hidden=step!==id;$('login').hidden=false;$('dashboard').hidden=true;$('message').textContent='';$(id).querySelector('input')?.focus();}
function message(value){$('message').textContent=value;}
function health(id,label,state){const node=$(id);if(!node)return;node.textContent=label;node.className='health-state '+state;}
function errorMessage(error){
 if(error?.code==='auth/invalid-credential')return 'Email or password was not recognised.';
 if(error?.code==='auth/invalid-verification-code')return 'That code is invalid or has expired. Try the current code.';
 if(error?.code==='functions/permission-denied')return 'This account cannot open the owner dashboard. A fresh authenticator sign-in is required.';
 return 'Could not complete sign-in. Check your details and try again.';
}
async function run(task){if(busy)return;busy=true;document.querySelectorAll('button').forEach(b=>b.disabled=true);message('');try{await task();}catch(error){console.error('Owner dashboard action failed',error?.code||'unknown');message(errorMessage(error));}finally{busy=false;document.querySelectorAll('button').forEach(b=>b.disabled=false);}}
async function loadDashboard(){
 const days=Number($('traffic-days')?.value||7);
 const result=(await httpsCallable(functions,'getOwnerDashboard')({days})).data;
 $('login').hidden=true;$('dashboard').hidden=false;
 $('as-of').textContent='Updated '+new Date(result.asOf).toLocaleString('en-GB',{dateStyle:'medium',timeStyle:'short'});
 const b=result.billing;
 $('active').textContent=b.active.toLocaleString('en-GB');$('trialing').textContent=b.trialing.toLocaleString('en-GB');$('attention').textContent=b.pastDue.toLocaleString('en-GB');
 $('mrr').textContent=new Intl.NumberFormat('en-GB',{style:'currency',currency:'GBP',maximumFractionDigits:0}).format(b.projectedMrrPence/100);
 $('billing-note').textContent=(b.cancelling?`${b.cancelling} scheduled to cancel at period end. `:'')+(b.incomplete?'Subscription scan reached its safety limit; counts are incomplete.':'');
 const trialList=$('trial-list');
 trialList.replaceChildren();
 const trials=Array.isArray(b.trials)?b.trials:null;
 if(!trials||!trials.length){
  const row=document.createElement('tr'),cell=document.createElement('td');
  cell.colSpan=2;cell.textContent=trials?'No Pro accounts are currently in a free trial.':'Trial email list is temporarily unavailable.';
  row.append(cell);trialList.append(row);
 }else for(const trial of trials){
  const row=document.createElement('tr'),emailCell=document.createElement('td'),endCell=document.createElement('td');
  emailCell.textContent=trial.email||'Email unavailable';
  endCell.textContent=Number.isFinite(trial.trialEnd)?new Date(trial.trialEnd*1000).toLocaleDateString('en-GB',{dateStyle:'medium'}):'Date unavailable';
  row.append(emailCell,endCell);trialList.append(row);
 }
 health('health-stripe','Connected','ok');
 const t=result.traffic,period=t.period||`Last ${t.days||days} complete days`;
 $('visitors').textContent=t.available?t.visitors.toLocaleString('en-GB'):'—';$('sessions').textContent=t.available?t.sessions.toLocaleString('en-GB'):'—';$('views').textContent=t.available?t.pageViews.toLocaleString('en-GB'):'—';
 for(const id of ['visitors-period','sessions-period','views-period'])$(id).textContent=period;
 $('traffic-note').textContent=t.available?'Consent-based GA4 reporting; excludes visitors who declined analytics.':t.reason;
 health('health-ga4',t.available?'Connected':'Needs setup',t.available?'ok':'warn');
 health('health-affiliate','Not connected','unavailable');
 $('dashboard-message').textContent='Affiliate earnings will appear after a trustworthy partner report is connected.';
 window.dispatchEvent(new Event('pp-owner-dashboard-loaded'));
}
$('email-step').addEventListener('submit',event=>{event.preventDefault();email=$('email').value.trim();$('chosen-email').textContent=email;show('password-step');});
$('password-step').addEventListener('submit',event=>{event.preventDefault();run(async()=>{
 try{
  const result=await signInWithEmailAndPassword(auth,email,$('password').value);
  $('password').value='';
  if(!result.user.emailVerified){await signOut(auth);throw {code:'auth/email-not-verified'};}
  await httpsCallable(functions,'prepareOwnerEnrollment')();
  const session=await multiFactor(result.user).getSession();
  secret=await TotpMultiFactorGenerator.generateSecret(session);
  $('setup-key').textContent=secret.secretKey;
  show('setup-step');
 }catch(error){
  if(error.code!=='auth/multi-factor-auth-required')throw error;
  resolver=getMultiFactorResolver(auth,error);
  if(!resolver.hints.some(h=>h.factorId===TotpMultiFactorGenerator.FACTOR_ID))throw {code:'auth/unsupported-second-factor'};
  $('password').value='';show('code-step');
 }
});});
$('code-step').addEventListener('submit',event=>{event.preventDefault();run(async()=>{
 const hint=resolver.hints.find(h=>h.factorId===TotpMultiFactorGenerator.FACTOR_ID);
 await resolver.resolveSignIn(TotpMultiFactorGenerator.assertionForSignIn(hint.uid,$('code').value));
 resolver=null;$('code').value='';await loadDashboard();
});});
$('setup-step').addEventListener('submit',event=>{event.preventDefault();run(async()=>{
 await multiFactor(auth.currentUser).enroll(TotpMultiFactorGenerator.assertionForEnrollment(secret,$('setup-code').value),'Owner authenticator');
 secret=null;$('setup-key').textContent='';$('setup-code').value='';await signOut(auth);show('email-step');message('Authenticator enabled. Sign in again using all three steps.');
});});
document.querySelector('[data-back]').addEventListener('click',()=>show('email-step'));
$('restart').addEventListener('click',()=>run(async()=>{resolver=null;await signOut(auth);show('email-step');}));
$('refresh').addEventListener('click',()=>run(async()=>{try{await loadDashboard();}catch(error){health('health-stripe','Unavailable','bad');$('dashboard-message').textContent='Refresh failed. Sign out and sign in again if your session has expired.';}}));
$('traffic-days').addEventListener('change',()=>run(async()=>{try{await loadDashboard();}catch{health('health-ga4','Unavailable','bad');$('traffic-note').textContent='Traffic could not be refreshed.';}}));
$('signout').addEventListener('click',()=>run(async()=>{await signOut(auth);show('email-step');}));
await setPersistence(auth,inMemoryPersistence);
await signOut(auth);
show('email-step');
