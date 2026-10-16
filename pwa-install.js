(()=>{
'use strict';
if(window.top!==window.self)return;
if('serviceWorker' in navigator)window.addEventListener('load',()=>navigator.serviceWorker.register('/sw.js',{updateViaCache:'none'}).catch(err=>console.warn('PrintProfit app registration failed:',err)));
let promptEvent=null;
function installed(){return window.matchMedia('(display-mode: standalone)').matches||navigator.standalone===true;}
function setup(){
 if(installed())return;
 const host=document.createElement('div');host.id='ppInstallApp';host.style.cssText='margin:18px auto;padding:14px 18px;max-width:700px;border:1px solid #52707f;border-radius:12px;background:#10232f;color:#fff;font:14px/1.5 system-ui;box-sizing:border-box';
 host.innerHTML='<strong>PrintProfit on your home screen</strong><p style="margin:6px 0">Open PrintProfit in its own app window. An internet connection is required.</p><button type="button" style="padding:9px 14px;border-radius:8px;border:1px solid #75d8f2;background:#10232f;color:#fff;font:inherit;cursor:pointer">How to install</button><p class="pp-install-help" hidden>Android: open your browser menu and choose Install app or Add to Home screen. iPhone/iPad: open in Safari, tap Share, then Add to Home Screen and enable Open as Web App if shown. Desktop: use your browser’s install option when available.</p><p class="pp-install-status" role="status"></p>';
 const footer=document.querySelector('footer,.footer');if(footer)footer.before(host);else document.body.append(host);
 const button=host.querySelector('button');button.textContent=promptEvent?'Install PrintProfit':'How to install';
 button.onclick=async()=>{
  if(!promptEvent){host.querySelector('.pp-install-help').hidden=false;return;}
  const event=promptEvent;promptEvent=null;try{await event.prompt();const result=await event.userChoice;host.querySelector('.pp-install-status').textContent=result.outcome==='accepted'?'Installation requested.':'You can install later from your browser menu.';}catch{host.querySelector('.pp-install-help').hidden=false;}button.textContent='How to install';
 };
 window.addEventListener('appinstalled',()=>host.remove(),{once:true});
}
window.addEventListener('beforeinstallprompt',event=>{event.preventDefault();promptEvent=event;const b=document.querySelector('#ppInstallApp button');if(b)b.textContent='Install PrintProfit';});
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',setup);else setup();
})();
