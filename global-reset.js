(()=>{
'use strict';
if(window.__printProfitGlobalReset)return;window.__printProfitGlobalReset=true;

function install(){
  if(!document.body)return false;

  // Do not replace the styled reset created by global-actions.js.
  // If it already exists, just make sure it is wired to the real calculator reset.
  const existing=document.getElementById('ppGlobalReset');
  if(existing){
    const source=document.getElementById('reset');
    if(source&&!existing.dataset.ppResetWired){
      existing.addEventListener('click',()=>source.click());
      existing.dataset.ppResetWired='1';
    }
    return true;
  }

  const button=document.createElement('button');
  button.type='button';
  button.id='ppGlobalReset';
  button.innerHTML='<span class="pp-reset-icon">↻</span><span><b>Reset Calculator</b><small>Clear all settings</small></span>';
  button.title='Reset the entire calculator';
  button.setAttribute('aria-label','Reset the entire calculator');
  document.body.appendChild(button);

  const style=document.createElement('style');
  style.id='ppGlobalResetStyles';
  style.textContent=`
    #ppGlobalReset{
      position:fixed!important;right:20px!important;bottom:20px!important;z-index:9999!important;
      display:flex!important;align-items:center!important;gap:10px!important;
      min-width:168px!important;padding:10px 13px!important;
      border:1px solid rgba(255,120,0,.48)!important;border-radius:13px!important;
      background:linear-gradient(145deg,#17252dF2,#0b151cF5)!important;color:#fff!important;
      box-shadow:0 12px 30px rgba(0,0,0,.45),0 0 24px rgba(255,120,0,.10)!important;
      backdrop-filter:blur(12px)!important;-webkit-backdrop-filter:blur(12px)!important;
      cursor:pointer!important;text-align:left!important;font:inherit!important;
      transition:transform .2s ease,border-color .2s ease,box-shadow .2s ease,background .2s ease!important;
    }
    #ppGlobalReset:hover{transform:translateY(-2px)!important;border-color:rgba(255,120,0,.78)!important;box-shadow:0 16px 34px rgba(0,0,0,.52),0 0 28px rgba(255,120,0,.18)!important;background:linear-gradient(145deg,#1b2c35F5,#0d1820F8)!important}
    #ppGlobalReset:active{transform:translateY(0)!important}
    #ppGlobalReset .pp-reset-icon{
      display:grid!important;place-items:center!important;flex:0 0 32px!important;width:32px!important;height:32px!important;
      border-radius:10px!important;background:linear-gradient(145deg,#ff9a3d,#ff7800)!important;color:#fff!important;
      font-size:21px!important;font-weight:800!important;line-height:1!important;box-shadow:0 6px 14px rgba(255,120,0,.25)!important;
    }
    #ppGlobalReset span:last-child{display:flex!important;flex-direction:column!important;line-height:1.1!important}
    #ppGlobalReset b{font-size:12px!important;font-weight:850!important;letter-spacing:.01em!important}
    #ppGlobalReset small{margin-top:3px!important;color:#aebdc5!important;font-size:9px!important}
    @media(max-width:650px){#ppGlobalReset{right:12px!important;bottom:12px!important;min-width:0!important;padding:9px 11px!important}.pp-reset-icon{flex-basis:30px!important;width:30px!important;height:30px!important}#ppGlobalReset small{display:none!important}}
    @media(prefers-reduced-motion:reduce){#ppGlobalReset{transition:none!important}}
  `;
  document.head.appendChild(style);

  const source=document.getElementById('reset');
  if(source){
    button.addEventListener('click',()=>source.click());
    button.dataset.ppResetWired='1';
    source.hidden=true;
    source.setAttribute('aria-hidden','true');
  }
  return true;
}

if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install,{once:true});
else install();
})();
