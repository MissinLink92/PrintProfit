# Compare Products and site audit — 19 November 2026

Prepared on `fix/compare-search-colours` from main `9eecb3df9e7370d023918d6c3b5a34582d62dbb8`. This is a proposed source/data change for review. No production deployment, merge, customer transaction or account change was performed.

## Tester report and diagnosis

Searching “SUNLU black PLA” previously required the words in the same order as the listing. Collection titles could also match a sibling material rather than the selected variant. Colour filtering exposed individual retailer shade strings. SUNLU, SUNLU.UK and SUNLU UK Store were separate brand entries because those aliases were incomplete.

The original £12 result is **not established as an incorrect retailer price**. Lower saved prices include refills, different shades, bundles, out-of-stock offers and offers whose exact variant cannot currently be verified. The audit does not establish a cheaper equivalent, currently available standard black spool at checkout. The fix improves discovery and identifies which comparisons have recent evidence; it does not invent a cheaper price.

## Changes

| Area | Result |
|---|---|
| Search | All query terms match in any order, with punctuation/case/spacing and common material aliases normalized. Selected material takes precedence over collection-title siblings. PLA, PLA+ and HSPLA+2.0 cases are covered. Search caches follow metadata edits. |
| Colour | A short menu groups shades into 17 families and shows counts after the other filters. Exact original shades remain visible. A selected zero-result family remains selectable. |
| Brands | Canonical SUNLU aliases merge in listings, filters and coverage. Creality/Creality3D, Bedrock3D and EasyThreed variants also merge. Exact distinct products/packs remain separate. |
| Stock, prices and sorting | Explicit stock states replace substring matching. Invalid/missing prices are not treated as zero. Price/unit/recent/name/retailer sorts have stable fallbacks. Lowest-current-price summaries require recent verified in-stock offers. Empty card-view results remain visible. |
| Feed identity | New discoveries retain exact availability and verification dates. Non-finite prices are rejected. Selected material overrides misleading parent titles/vendor categories. Catalogue links preserve exact variant IDs, including configured locators. |
| Calculator material references | Match a verified, recent, in-stock material with a known pack amount. Apply pack amount before recalculating. Filament requires grams; resin requires explicit millilitres rather than assuming density. Manual costs remain authoritative. |
| Selling fees | Include applicable percentage fees on delivery charged to the customer in single/batch totals, target prices, scenarios, advisor and platform comparisons. Two controls let the user select fee bases. Folksy commission excludes delivery; payment fees include it. Saved projects retain overrides after channel defaults are applied. |
| Settings and reset | Imperial inputs use the current material type after switching to resin, show fractional ounces and fluid-ounce labels. Invalid stored settings/rates fall back safely; GBP is always rate 1. Reset preserves preference/account/library controls, avoids farm/display mirrors and restores quantity 1. |
| Inventory | Material cost/amount/threshold validation rejects invalid or negative values. The material form is a visible, scrollable dialog on desktop and small phones. The Pro approval replay deducts stock once; pending repeat clicks are blocked. |
| Deals and languages | Deals loads the shared translations. Offers revalidate each minute and when returning to the tab; expired/stale offers disappear without rebuilding unchanged lists. Added the new UI strings to all five non-English catalogues. |
| Maintenance | New regression checks are included in CI; all backend test files now run in UI CI. Windows data-health reads/writes use UTF-8. Related asset/locale cache keys changed. Public audit now includes Deals and supports a local browser channel. |

The delivery fee basis is supported by [Etsy transaction fee guidance](https://help.etsy.com/hc/en-us/articles/115014483627-What-are-the-Fees-and-Taxes-for-Selling-on-Etsy), [Etsy payment processing guidance](https://help.etsy.com/hc/en-us/articles/115015628847-What-are-Payment-Processing-Fees-for-Selling-on-Etsy), [eBay UK fee guidance](https://www.ebay.co.uk/help/selling/fees-credits-invoices/store-selling-fees?id=4809), and [Folksy commission guidance](https://folksy.uservoice.com/knowledgebase/articles/58077-how-much-does-it-cost-to-sell-on-folksy). These checks establish the calculation basis; they do not re-verify every reference tariff or every seller's taxes, advertising and optional charges.

## Catalogue audit

Rechecked all 8,576 initially active offers using the existing guarded public readers and exact product/variant/pack rules. Discovery and image refresh were disabled for this audit. One absent variant was archived, leaving:

| Measure | Result |
|---|---:|
| Active offers | 8,575 |
| Verified against public source | 6,956 |
| Retained, explicitly unverified | 1,619 |
| Total archived offers, including prior archives | 1,804 |
| Corrected prices | 130, all at NSE Imports |
| Corrected availability records | 2 |
| Newly archived missing variant | 1 |
| Generated history pages | 86 |
| Invalid active prices | 0 |

The final repeat found no further price or stock changes. Full and compact catalogues and history were regenerated. Verification dates/statuses reflect this audit, without claiming a discovery, image, courier or platform-reference refresh.

Unverified sources chiefly fail exact variant/title/pack identity or readable-source checks. SUNLU accounts for 1,391 and ELEGOO for 107 unverified offers. Guessed prices, masses and availability were not substituted. Reported retailer availability is a snapshot, not a physical stock quantity or a guarantee of fulfilment.

Seven of 25 tracked sources have no active listings: Amazon UK, Prusa Research, Ooznest, 3D FilaPrint, Polymaker UK, eSUN UK and 3DQF UK. The data-health check retains 29 warnings: these coverage gaps, failed/stale courier and selling-channel reference checks, and two stale coupon checks. No approved current coupons are displayed. These are unresolved data coverage/verification issues.

## Validation performed

| Check | Coverage and result |
|---|---|
| JavaScript regressions | All 22 check scripts pass, including search, filters, prices, stock, coupons, inventory, units, reset, file parsing, backups, Pro action ordering, farm, projects, quotations, currency and translations. |
| Compare combinations | 360 combined facet/price/stock checks span every real listed brand, retailer, category, colour family and stock state. Regression fixtures include missing/invalid prices, unknown stock, sibling variants, aliases, cards, recent prices, refills and bundles. |
| Calculator combinations | 5,760 combinations of quantity, discount, price, delivery, marketplace/payment rates and delivery-fee bases. Six single/batch target equations each: 34,560 target checks. Independent target implementations, Folksy and saved fee overrides also checked. |
| Backend | All 38 tests pass across billing, handlers, admin and owner access: entitlements, trial/expiry/cancellation, signature/mode/customer checks, owner/TOTP restrictions and deletion guards. |
| Python | 25 retailer-feed tests, 3 source-reliability tests, FX checks and catalogue-builder self-tests pass. Data-health finishes with the disclosed warnings. |
| Public pages | Calculator, Compare, Deals, Guide, Privacy and Terms at 1440px and 390px. All six language selections and both themes switched successfully; no functional/page errors. These are sequential feature checks, not a full page/language/theme Cartesian matrix. Sampled hero contrast passes. |
| Settings browser matrix | 912 combinations: 2 material modes × 19 currencies × 6 languages × 2 unit systems × 2 themes. Persistence after reload passes. |
| Calculator menus | Exercised all selectable options: 115 printer entries, 46 material selections, 25 brands, 94 electricity providers, 12 selling profiles, 10 couriers and 74 services. This establishes functional selection/calculation, not current external tariff accuracy. |
| Browser workflows | Actual G-code upload; project save/rename/duplicate/load/update; material and printer create/edit/use; backup download/import/duplicate handling; signed-out consent/access gates; one stock deduction; saved scenarios; CSV download; customer quotation preview; keyboard dialog close; reload and reset. |
| Small screens and offline | Material save buttons work at 320, 390, 768 and 1440px, including German wrapping and imperial/currency settings. 76 currency/unit/material reset combinations pass. Offline message, retained local storage and reconnect pass. Local admin/review source pages load without script errors; no privileged action performed. |
| Live Pro catalogue | Read-only dashboard inspection confirmed an active product at £2.50/month and £24/year, matching the public configuration example. No live checkout or billing change performed. |
| Packaging | Public package checked for the new runtime helpers and exclusion of protected admin/review/server files. Modified JavaScript syntax and whitespace checks pass. |

Pro workflow UI was exercised in an isolated local browser with billing disabled. This is not evidence of a successful real paid entitlement, signed-in cloud transport or production permission enforcement. Mocked backend tests and source review are likewise distinct from live account/billing verification.

## Remaining verification and risks

- The 1,619 unverified offers, seven retailer coverage gaps, stale/failed shipping and selling-channel references and stale coupon checks remain unresolved. Check an actual merchant/cart for quantities, price, UK variant, availability, shipping, VAT, discounts and minimum order requirements.
- No successful live signup/email verification, owner TOTP flow, cross-device sync, production Firestore-rules enforcement, live checkout/trial/cancellation/renewal/refund or account deletion was executed. Local/backend guard tests pass; deployment state and external transport remain unverified.
- Phone/tablet checks emulate viewport sizes in Edge. Physical camera barcode scanning, iOS/Android browsers, native installation, real print/PDF output and assistive-technology operation require device/manual checks. Translation switching passes; native-language editorial review is outstanding.
- Compare exceeds the existing 6 MB download budget on the uncompressed local server (about 9.8 MB desktop/7.9 MB mobile). Production compression and real network/device performance were not measured. Do not treat the local performance check as a production performance pass.
- This is a broad, recorded set of combinations and boundaries, not every theoretical combination of arbitrary files, free text, network failures, browser extensions and account states.
- The generated catalogue/history diff is large. Review source logic separately from audited snapshot changes. No changes are live until separately reviewed and released.

Compact source/coverage evidence is in `reports/compare-audit-2026-11-19.json`. Browser and external checks were performed against this branch on 19 November; GitHub PR checks provide independent CI validation after upload.
