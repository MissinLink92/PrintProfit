(()=>{
  'use strict';
  if(window.__printProfitAlignmentPolishInstalled)return;
  window.__printProfitAlignmentPolishInstalled=true;

  const style=document.createElement('style');
  style.id='ppAlignmentPolishStyles';
  style.textContent=`
    @media(min-width:951px){
      /* Every two-column calculator row uses natural grid stretching so the
         cards in the same row always share the height of the tallest card. */
      .pp-tab-panel[data-panel="details"],
      .pp-tab-panel[data-panel="machine"],
      .pp-tab-panel[data-panel="costs"]{
        align-items:stretch!important;
      }

      .pp-tab-panel[data-panel="details"]>.pp-card,
      .pp-tab-panel[data-panel="machine"]>.pp-card,
      .pp-tab-panel[data-panel="costs"]>.pp-cost-block{
        align-self:stretch!important;
        min-height:0;
        height:auto!important;
        display:flex;
        flex-direction:column;
      }

      .pp-tab-panel[data-panel="details"]>.pp-card>.panel,
      .pp-tab-panel[data-panel="machine"]>.pp-card>.panel,
      .pp-tab-panel[data-panel="costs"]>.pp-cost-block>.panel{
        flex:1 1 auto;
        min-height:0;
        height:auto!important;
        width:100%;
        box-sizing:border-box;
      }
    }
  `;
  document.head.appendChild(style);
})();
