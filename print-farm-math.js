/* Production-run arithmetic. No DOM, network or account dependencies. */
(function(root){
'use strict';
function plan(quantity, groups){
 const integer=(v,min,max)=>Number.isInteger(Number(v))&&Number(v)>=min&&Number(v)<=max;
 if(!integer(quantity,1,10000000))throw new Error('Enter a whole-number production quantity between 1 and 10,000,000.');
 if(!Array.isArray(groups)||!groups.length||groups.length>10)throw new Error('Add between one and ten printer groups.');
 const rows=groups.map(g=>{
  if(!integer(g.machines,1,10000)||!integer(g.perBuild,1,10000))throw new Error('Printer counts and products per cycle must be whole numbers from 1 to 10,000.');
  if(!Number.isFinite(Number(g.hours))||Number(g.hours)<=0||Number(g.hours)>10000)throw new Error('Enter a positive time per cycle for every printer group.');
  if(!Number.isFinite(Number(g.watts))||Number(g.watts)<=0||Number(g.watts)>100000)throw new Error('Choose a printer or enter its average power draw for every group.');
  if(!Number.isFinite(Number(g.price))||Number(g.price)<0||Number(g.price)>100000000||!Number.isFinite(Number(g.lifetime))||Number(g.lifetime)<0||Number(g.lifetime)>100000000||(Number(g.price)>0&&Number(g.lifetime)<1))throw new Error('Enter a printer lifetime when including its purchase cost.');
  return {...g,machines:Number(g.machines),perBuild:Number(g.perBuild),hours:Number(g.hours),watts:Number(g.watts),price:Number(g.price),lifetime:Number(g.lifetime)};
 });
 const capacity=rows.reduce((sum,g)=>sum+g.machines*g.perBuild,0);
 const rounds=Math.floor(Number(quantity)/capacity);let remainder=Number(quantity)%capacity;
 let kWh=0,depreciation=0,printerHours=0,elapsedHours=0,builds=0;
 const allocations=rows.map(g=>{
  const extra=Math.min(remainder,g.machines*g.perBuild);remainder-=extra;
  const products=rounds*g.machines*g.perBuild+extra;
  const jobs=rounds*g.machines+Math.ceil(extra/g.perBuild);
  const occupiedHours=jobs*g.hours;
  const elapsed=(rounds+(extra>0?1:0))*g.hours;
  const energy=occupiedHours*g.watts/1000;
  const wear=g.lifetime>0?occupiedHours*g.price/g.lifetime:0;
  kWh+=energy;depreciation+=wear;printerHours+=occupiedHours;elapsedHours=Math.max(elapsedHours,elapsed);builds+=jobs;
  return {...g,products,builds:jobs,printerHours:occupiedHours,elapsedHours:elapsed,kWh:energy,depreciation:wear};
 });
 return {quantity:Number(quantity),capacity,builds,kWh,depreciation,printerHours,elapsedHours,allocations,powerPerItem:kWh/quantity,depreciationPerItem:depreciation/quantity};
}
const api={plan};if(typeof module==='object'&&module.exports)module.exports=api;else root.PrintProfitFarmMath=api;
})(typeof window==='object'?window:globalThis);
