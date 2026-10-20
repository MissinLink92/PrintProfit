(()=>{
'use strict';
if(window.__ppMaterialScanner)return;window.__ppMaterialScanner=true;
let stream=null,timer=null,token=0,video,stopButton,status,codeInput;
const el=(tag,text)=>{const n=document.createElement(tag);if(tag==='button')n.className='pp-material-new';if(text!==undefined)n.textContent=text;return n;};
function stop(){token++;if(timer)clearTimeout(timer);timer=null;if(stream)stream.getTracks().forEach(t=>t.stop());stream=null;if(video){video.pause();video.srcObject=null;video.hidden=true;}if(stopButton)stopButton.hidden=true;}
function review(raw){
 const code=window.PrintProfitBusinessMath?.barcode(raw);if(!code){status.textContent='That is not a valid EAN/UPC product barcode. Check the digits or enter the material manually.';return;}
 stop();codeInput.value=code;
 try{const found=window.__ppPrepareMaterialScan(code);status.textContent=found?'Known material found. Review the package amount, remaining stock and purchase price, then save to add this new package.':'New barcode: enter the material details and save. Future scans can reuse those details. No stock has been added yet.';}catch(e){status.textContent=e.message;}
}
async function start(){
 stop();const generation=token;
 if(!window.BarcodeDetector||!navigator.mediaDevices?.getUserMedia){status.textContent='This browser cannot scan barcodes with the camera. Type the barcode below or use manual material entry.';return;}
 try{
  const supported=await BarcodeDetector.getSupportedFormats();const formats=['ean_13','ean_8','upc_a','itf'].filter(f=>supported.includes(f));if(!formats.length)throw new Error('No supported product-barcode format is available. Type the code instead.');
  if(generation!==token)return;
  const detector=new BarcodeDetector({formats});
  const acquired=await navigator.mediaDevices.getUserMedia({video:{facingMode:{ideal:'environment'}},audio:false});
  if(generation!==token){acquired.getTracks().forEach(t=>t.stop());return;}
  stream=acquired;video.srcObject=stream;video.hidden=false;stopButton.hidden=false;await video.play();status.textContent='Point the camera at the EAN/UPC barcode. Nothing is uploaded. Scan one package at a time.';
  const tick=async()=>{
   if(generation!==token)return;
   try{const codes=await detector.detect(video);if(generation!==token)return;
    const valid=[...new Set(codes.map(c=>window.PrintProfitBusinessMath.barcode(c.rawValue)).filter(Boolean))];
    if(valid.length===1){review(valid[0]);return;}if(valid.length>1)status.textContent='Several barcodes are visible. Show only the barcode on the package you want to add.';
   }catch(e){status.textContent='Keep the barcode steady and well lit, or type its digits below.';}
   timer=setTimeout(tick,350);
  };tick();
 }catch(e){if(generation===token){stop();status.textContent='Camera scanning unavailable: '+e.message+' You can still type the barcode or enter details manually.';}}
}
function install(){
 const panel=document.getElementById('ppMaterialsPanel'),toolbar=panel?.querySelector('#ppWorkshopMaterialsView .pp-materials-toolbar');if(!toolbar||document.getElementById('ppMaterialScan'))return;
 const toggle=el('button','Scan material — preview');toggle.type='button';toggle.dataset.ppMaterialScannerToggle='';toolbar.append(toggle);
 const box=el('section');box.id='ppMaterialScan';box.hidden=true;box.style.cssText='padding:14px;margin:12px 0;border:1px solid var(--line,#355363);border-radius:10px;color:inherit';
 box.append(el('h3','Scan a material barcode'),el('p','Recognises product barcodes, not full label text or RFID tags. Matches details you previously saved with the barcode in this workspace. Unknown codes need manual details. Always review before saving.'));
 video=el('video');video.muted=true;video.playsInline=true;video.hidden=true;video.style.cssText='width:100%;max-height:250px;object-fit:contain;background:#000';box.append(video);
 const startButton=el('button','Start camera');startButton.type='button';startButton.addEventListener('click',start);stopButton=el('button','Stop camera');stopButton.type='button';stopButton.hidden=true;stopButton.addEventListener('click',()=>{stop();status.textContent='Camera stopped.';});
 box.append(startButton,stopButton);const label=el('label','EAN / UPC barcode');codeInput=el('input');codeInput.type='text';codeInput.inputMode='numeric';codeInput.maxLength=25;codeInput.style.cssText='display:block;width:100%;box-sizing:border-box;padding:10px;margin:6px 0';label.append(codeInput);box.append(label);
 const use=el('button','Find / prepare material');use.type='button';use.addEventListener('click',()=>review(codeInput.value));const close=el('button','Close scanner');close.type='button';close.addEventListener('click',()=>{stop();box.hidden=true;});box.append(use,close);
 status=el('p');status.setAttribute('role','status');box.append(status);toolbar.after(box);
 toggle.addEventListener('click',()=>{box.hidden=!box.hidden;if(box.hidden)stop();});
 const observer=new MutationObserver(()=>{if(!panel.classList.contains('open'))stop();});observer.observe(panel,{attributes:true,attributeFilter:['class']});
}
install();const mountObserver=new MutationObserver(install);mountObserver.observe(document.body,{childList:true,subtree:true});
document.addEventListener('visibilitychange',()=>{if(document.hidden)stop();});window.addEventListener('pagehide',stop);document.addEventListener('keydown',e=>{if(e.key==='Escape')stop();});
document.addEventListener('click',e=>{if(e.target.closest('[data-workshop-tab],[data-workspace-section],[data-material-close]'))stop();},true);
})();

