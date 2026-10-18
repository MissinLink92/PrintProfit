'use strict';
const API_VERSION='2026-09-30.endive';
function environmentForProject(projectId){
 if(projectId==='printprofit-test')return {livemode:false,site:'https://printprofit-test.web.app/'};
 if(projectId==='printprofit-fd30f')return {livemode:true,site:'https://printprofit.co.uk/'};
 throw Error('Billing is not configured for this Firebase project');
}
function validateKey(key,environment){
 if(typeof key!=='string'||!new RegExp('^(sk|rk)_'+(environment.livemode?'live':'test')+'_').test(key))throw Error('Stripe key mode does not match this Firebase project');
}
function assertMode(object,environment){
 if(object?.livemode!==environment.livemode)throw Error('Stripe object mode does not match this Firebase project');
}
module.exports={API_VERSION,environmentForProject,validateKey,assertMode};
