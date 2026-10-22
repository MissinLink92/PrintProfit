// Temporary account-check preview during the production subscription canary.
// The normal public URL keeps billing hidden. Remove this switch after canary checks.
let printProfitBillingPreview = false;
try {
  printProfitBillingPreview =
    window.top.location.origin === window.location.origin &&
    new URLSearchParams(window.top.location.search).get('ppBillingPreview') === '1';
} catch (_) {
  printProfitBillingPreview = false;
}
window.PRINTPROFIT_BILLING_CONFIG = { enabled: printProfitBillingPreview };
