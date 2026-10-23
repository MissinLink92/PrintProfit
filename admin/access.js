import {getApp} from 'https://www.gstatic.com/firebasejs/12.19.0/firebase-app.js';
import {getFunctions,httpsCallable} from 'https://www.gstatic.com/firebasejs/12.19.0/firebase-functions.js';

const $=id=>document.getElementById(id);
let selected=null,busy=false,functions=null;
const call=async(name,data={})=>{if(!functions)functions=getFunctions(getApp(),'europe-west2');return(await httpsCallable(functions,name)(data)).data;};
const when=seconds=>seconds?new Date(seconds*1000).toLocaleDateString('en-GB',{day:'numeric',month:'short',year:'numeric'}):'No expiry';
const at=millis=>millis?new Date(millis).toLocaleString('en-GB',{dateStyle:'medium',timeStyle:'short'}):'—';
function status(value,error=false){const node=$('access-status');if(!node)return;node.textContent=value;node.dataset.error=error?'1':'0';}
function health(label,state){const node=$('health-access');if(!node)return;node.textContent=label;node.className='health-state '+state;}
function esc(value){return String(value??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));}
async function refreshAccess(){
 try{
  const data=await call('getComplimentaryOverview');
  $('complimentary-count').textContent=data.activeCount.toLocaleString('en-GB');
  $('grant-list').innerHTML=data.active.length?data.active.map(item=>`<tr><td>${esc(item.email||'Account')}</td><td>${item.until?esc(when(item.until)):'Lifetime'}</td><td>${esc(item.note||'—')}</td></tr>`).join(''):'<tr><td colspan="3">No complimentary Pro users yet.</td></tr>';
  $('audit-list').innerHTML=data.audit.length?data.audit.map(item=>`<li><strong>${esc(item.action)}</strong><span>${esc(item.target||'')}</span><small>${esc(at(item.at))}</small></li>`).join(''):'<li>No admin access changes recorded yet.</li>';
  health('Connected','ok');
 }catch(error){health('Unavailable','bad');status('Complimentary access data could not be loaded. Sign in again if your session has expired.',true);}
}
window.addEventListener('pp-owner-dashboard-loaded',refreshAccess);
$('find-access')?.addEventListener('submit',async event=>{
 event.preventDefault();if(busy)return;busy=true;status('Finding account…');$('access-person').hidden=true;
 try{
  selected=await call('findComplimentaryUser',{email:$('access-email').value.trim()});
  $('access-person-email').textContent=selected.email;
  $('access-person-state').textContent=(selected.verified?'Verified':'Not verified')+(selected.disabled?' · disabled':'')+(selected.grant?.active?' · complimentary Pro active'+(selected.grant.until?' until '+when(selected.grant.until):' with no expiry'):' · no active complimentary access');
  $('access-note').value=selected.grant?.note||'';
  $('access-person').hidden=false;status('Account found. Review it before changing access.');
 }catch(error){selected=null;status(error?.message||'Account could not be found.',true);}
 finally{busy=false;}
});
$('grant-access')?.addEventListener('submit',async event=>{
 event.preventDefault();if(busy||!selected)return;const action=event.submitter?.value;if(!['grant','revoke'].includes(action))return;
 const label=action==='grant'?'Grant complimentary Pro to ':'Revoke complimentary Pro for ';
 if(!confirm(label+selected.email+'? Paid Stripe subscriptions are not changed.'))return;
 busy=true;status(action==='grant'?'Granting access…':'Revoking access…');
 try{
  let until=null;
  if(action==='grant'&&$('access-duration').value!=='lifetime')until=Math.floor(Date.now()/1000)+Number($('access-duration').value)*86400;
  await call('setComplimentaryAccess',{uid:selected.uid,action,until,note:$('access-note').value});
  $('access-person').hidden=true;selected=null;await refreshAccess();status(action==='grant'?'Complimentary Pro granted.':'Complimentary Pro revoked.');
 }catch(error){status(error?.message||'Access could not be updated.',true);}
 finally{busy=false;}
});
