(function(root){
'use strict';
function barcode(raw){
 const code=String(raw??'').trim().replace(/[ -]/g,'');
 if(/^0+$/.test(code)||!/^(?:\d{8}|\d{12}|\d{13}|\d{14})$/.test(code))return null;
 let sum=0;for(let i=code.length-2,weight=3;i>=0;i--,weight=4-weight)sum+=Number(code[i])*weight;
 return (10-sum%10)%10===Number(code.at(-1))?code:null;
}
function matchMaterial(materials,code){
 const matches=materials.filter(m=>m.barcode===code);if(!matches.length)return null;
 const identity=m=>JSON.stringify([m.name,m.type,m.brand,m.colour,Number(m.amount)]);
 if(new Set(matches.map(identity)).size!==1)return null;
 return [...matches].sort((a,b)=>Number(b.updated||0)-Number(a.updated||0))[0];
}
function csv(rows){
 const cell=value=>{let text=String(value??'');if(typeof value!=='number'&&/^[\s\u0000-\u001f]*[=+\-@]/.test(text))text="'"+text;return '"'+text.replace(/"/g,'""')+'"';};
 return '\uFEFF'+rows.map(row=>row.map(cell).join(',')).join('\r\n')+'\r\n';
}
function quotation(state,digits=2){
 if(!Number.isInteger(digits)||digits<0||digits>4)throw new Error('Invalid currency precision.');
 for(const k of ['qty','sell','disc','deliveryCharge'])if(!Number.isFinite(Number(state[k])))throw new Error('Complete the calculator before creating a quotation.');
 if(state.qty<1||state.sell<0||state.deliveryCharge<0||state.disc<0||state.disc>1)throw new Error('Quotation quantity and prices must not be negative.');
 const scale=10**digits,round=n=>Math.round((n+Number.EPSILON)*scale)/scale;
 const subtotal=round(state.sell*state.qty*(1-state.disc)),delivery=round(state.deliveryCharge);
 return{quantity:state.qty,unitPrice:state.sell*(1-state.disc),subtotal,delivery,total:round(subtotal+delivery)};
}
const api={barcode,matchMaterial,csv,quotation};if(typeof module==='object'&&module.exports)module.exports=api;else root.PrintProfitBusinessMath=api;
})(typeof window==='object'?window:globalThis);
