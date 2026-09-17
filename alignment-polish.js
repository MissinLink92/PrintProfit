(()=>{
  'use strict';
  if(window.__printProfitAlignmentPolishInstalled)return;
  window.__printProfitAlignmentPolishInstalled=true;

  const style=document.createElement('style');
  style.id='ppAlignmentPolishStyles';
  style.textContent=`
    @media(min-width:951px){
      /* Stretch the paired outer cards without changing their internal layouts. */
      .pp-tab-panel[data-panel="details"],
      .pp-tab-panel[data-panel="machine"],
      .pp-tab-panel[data-panel="costs"]{
        align-items:stretch!important;
      }

      .pp-tab-panel[data-panel="details"]>.pp-card,
      .pp-tab-panel[data-panel="machine"]>.pp-card,
      .pp-tab-panel[data-panel="costs"]>.pp-cost-block{
        align-self:stretch!important;
        display:block!important;
      }

      .pp-tab-panel[data-panel="details"]>.pp-card>.panel,
      .pp-tab-panel[data-panel="machine"]>.pp-card>.panel,
      .pp-tab-panel[data-panel="costs"]>.pp-cost-block>.panel{
        height:100%;
        width:100%;
      }

      /* Quick Setup must retain its own compact vertical layout inside the stretched card. */
      .pp-tab-panel[data-panel="machine"]>.pp-card.pp-quick-setup-card{
        display:block!important;
      }
    }
  `;
  document.head.appendChild(style);
})();
