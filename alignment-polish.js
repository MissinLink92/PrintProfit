(()=>{
  'use strict';
  if(window.__printProfitAlignmentPolishInstalled)return;
  window.__printProfitAlignmentPolishInstalled=true;

  const style=document.createElement('style');
  style.id='ppAlignmentPolishStyles';
  style.textContent=`
    @media(min-width:951px){
      /* Keep Printer Profile and Quick Setup perfectly aligned in the machine tab. */
      .pp-tab-panel[data-panel="machine"]{align-items:stretch!important}
      .pp-tab-panel[data-panel="machine"]>.pp-card>.panel{height:100%}
    }
  `;
  document.head.appendChild(style);
})();
