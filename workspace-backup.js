(()=>{
'use strict';
const LIMIT=10*1024*1024;
const object=value=>value!==null&&typeof value==='object'&&!Array.isArray(value);
function validate(value){
 if(!object(value)||value.format!=='printprofit-workspace'||value.version!==1)throw Error('Choose a PrintProfit workspace backup (version 1).');
 const clean=JSON.parse(JSON.stringify(value),(key,item)=>{
  if(['__proto__','prototype','constructor'].includes(key))throw Error('This backup contains an unsafe field.');
  return item;
 });
 for(const kind of ['projects','materials','printers']){
  const list=clean[kind],ids=new Set();
  if(!Array.isArray(list)||list.length>(kind==='printers'?100:1000))throw Error('Invalid '+kind+' list in backup.');
  for(const item of list){
   if(!object(item)||typeof item.id!=='string'||!item.id||item.id.length>256||typeof item.name!=='string'||item.name.length>1000||ids.has(item.id))throw Error('Invalid or duplicate '+kind+' entry.');
   ids.add(item.id);
   if(kind==='projects'&&!object(item.data))throw Error('A project is missing its saved settings.');
   for(const field of kind==='materials'?['amount','remaining','cost','lowStock']:kind==='printers'?['watts','price','lifetime']:['updated','hours','used']){
    if(item[field]!==undefined&&(!Number.isFinite(Number(item[field]))||Number(item[field])<0))throw Error('Invalid '+field+' in '+kind+'.');
   }
  }
 }
 return clean;
}
function download(data){
 const backup={format:'printprofit-workspace',version:1,exportedAt:new Date().toISOString(),...data};
 const url=URL.createObjectURL(new Blob([JSON.stringify(backup,null,2)],{type:'application/json'}));
 const link=document.createElement('a');link.href=url;link.download='printprofit-backup-'+new Date().toISOString().slice(0,10)+'.json';
 document.body.append(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);
}
const scope=()=>[localStorage.getItem('printprofit.projects.owner.v1')||'guest',localStorage.getItem('printprofit.workshop.owner.v1')||'guest'].join('|');
function chooseBackup(){
 const input=document.createElement('input');input.type='file';input.accept='.json,application/json';
 const owner=scope();
 input.addEventListener('change',async()=>{
  const file=input.files?.[0];if(!file)return;
  try{
   if(file.size>LIMIT)throw Error('This backup is larger than 10 MB.');
   const data=validate(JSON.parse(await file.text()));
   if(scope()!==owner)throw Error('Your account changed. Select the backup again.');
   if(!confirm('Import '+data.projects.length+' projects, '+data.materials.length+' materials and '+data.printers.length+' printers? Existing items with matching IDs will be kept. Model files are not included.'))return;
   const projects=window.__ppImportProjectBackup(data.projects);
   const inventory=window.__ppImportInventoryBackup(data);
   alert('Imported '+projects+' projects and '+inventory+' inventory items. Existing matching items were kept.');
  }catch(error){alert('Import could not finish: '+error.message+' Any items already saved remain available.');}
 });
 input.click();
}
document.addEventListener('click',async event=>{
 const button=event.target.closest('[data-pp-backup]');if(!button)return;
 event.preventDefault();
 if(button.dataset.ppBackup==='import'){chooseBackup();return;}
 button.disabled=true;
 try{
  const data=button.dataset.ppBackup==='cloud'?await window.__ppDownloadCloudBackup():{projects:window.__ppGetProjectWorkspace(),...window.__ppGetInventoryBackup()};
  download(data);
 }catch(error){alert('Backup could not be downloaded: '+error.message);}
 finally{button.disabled=false;}
});
// Exposed for deterministic malformed-file tests without browser or network access.
if(typeof module==='object'&&module.exports)module.exports={validate};
})();
