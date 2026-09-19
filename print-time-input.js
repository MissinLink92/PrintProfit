(()=>{
'use strict';
if(window.__printProfitTimeInput)return;
window.__printProfitTimeInput=true;

function parseHours(value){
  const n=Number.parseFloat(value);
  return Number.isFinite(n)&&n>0?n:0;
}

function splitDecimalHours(value){
  const totalMinutes=Math.max(0,Math.round(parseHours(value)*60));
  return {hours:Math.floor(totalMinutes/60),minutes:totalMinutes%60};
}

function combinedHours(hoursEl,minutesEl){
  const h=Math.max(0,Math.floor(Number(hoursEl.value)||0));
  const m=Math.max(0,Math.min(59,Math.floor(Number(minutesEl.value)||0)));
  return h+(m/60);
}

function install(){
  const source=document.getElementById('printHours');
  if(!source)return false;
  if(document.getElementById('ppPrintTimeHours'))return true;

  const row=source.closest('.two');
  if(!row)return false;

  const status=document.getElementById('materialStatus');
  const sourceWrap=source.parentElement;

  source.type='hidden';
  source.setAttribute('aria-hidden','true');

  if(status && status.parentElement===row)status.remove();
  if(sourceWrap)sourceWrap.style.display='none';

  row.classList.add('pp-print-time-row');
  row.innerHTML='';

  const makeField=(id,label,aria)=>{
    const wrap=document.createElement('div');
    wrap.className='pp-time-field';
    const lab=document.createElement('label');
    lab.htmlFor=id;
    lab.textContent=label;
    const input=document.createElement('input');
    input.id=id;
    input.type='number';
    input.inputMode='numeric';
    input.min='0';
    input.step='1';
    input.value='0';
    input.setAttribute('aria-label',aria);
    wrap.appendChild(lab);
    wrap.appendChild(input);
    return {wrap,input};
  };

  const hours=makeField('ppPrintTimeHours','Hours','Print time hours');
  const minutes=makeField('ppPrintTimeMinutes','Minutes','Print time minutes');
  row.append(hours.wrap,minutes.wrap);

  const statusWrap=document.createElement('div');
  statusWrap.className='pp-print-time-status';
  if(status){
    statusWrap.appendChild(status);
  }else{
    const fresh=document.createElement('div');
    fresh.id='materialStatus';
    fresh.className='small';
    fresh.textContent='Waiting for a print file, or enter usage manually.';
    statusWrap.appendChild(fresh);
  }
  row.parentElement?.appendChild(statusWrap);

  function updateSourceFromFields(){
    const value=combinedHours(hours.input,minutes.input);
    source.value=value.toFixed(6).replace(/0+$/,'').replace(/\.$/,'')||'0';
    source.dispatchEvent(new Event('input',{bubbles:true}));
  }

  function syncDisplayFromSource(){
    const value=parseHours(source.value);
    const parts=splitDecimalHours(value);
    const nextH=String(parts.hours),nextM=String(parts.minutes);
    if(document.activeElement!==hours.input)hours.input.value=nextH;
    if(document.activeElement!==minutes.input)minutes.input.value=nextM;
  }

  [hours.input,minutes.input].forEach(input=>{
    input.addEventListener('input',()=>{
      if(input===minutes.input){
        const n=Math.max(0,Math.min(59,Math.floor(Number(input.value)||0)));
        input.value=String(n);
      }
      updateSourceFromFields();
    });
    input.addEventListener('change',()=>{
      if(input===minutes.input){
        const n=Math.max(0,Math.min(59,Math.floor(Number(input.value)||0)));
        input.value=String(n);
      }
      updateSourceFromFields();
    });
  });

  syncDisplayFromSource();

  let lastSource='';
  setInterval(()=>{
    if(!source.isConnected)return;
    const current=source.value;
    if(current!==lastSource){
      lastSource=current;
      syncDisplayFromSource();
    }
    if((source.value===''||source.value==null) && document.activeElement!==hours.input && document.activeElement!==minutes.input){
      if(hours.input.value!=='0'||minutes.input.value!=='0'){
        hours.input.value='0';
        minutes.input.value='0';
      }
    }
  },200);

  const style=document.createElement('style');
  style.id='ppPrintTimeInputStyles';
  style.textContent=`
.pp-print-time-row{display:grid!important;grid-template-columns:1fr 1fr!important;gap:9px!important;margin-top:9px!important}
.pp-print-time-row .pp-time-field{min-width:0}
.pp-print-time-row .pp-time-field label{display:block;color:var(--muted);font-size:11px;margin-bottom:4px}
.pp-print-time-row .pp-time-field input{width:100%;box-sizing:border-box;background:var(--panel2);color:var(--text);border:1px solid var(--line);border-radius:7px;padding:8px 9px;font-size:13px;outline:0}
.pp-print-time-row .pp-time-field input:focus{border-color:var(--accent)}
.pp-print-time-status{grid-column:1 / -1;margin-top:-2px;min-width:0}
.pp-print-time-status .small{display:block!important;line-height:1.35}
@media(max-width:650px){
  .pp-print-time-row{gap:7px!important}
  .pp-print-time-row .pp-time-field input{padding:8px}
}
`;
  document.head.appendChild(style);

  return true;
}

function boot(){
  if(install())return;
  const started=Date.now();
  const timer=setInterval(()=>{
    if(install()||Date.now()-started>15000)clearInterval(timer);
  },50);
}

if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});
else boot();
})();