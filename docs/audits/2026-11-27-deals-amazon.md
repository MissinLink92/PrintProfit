# PrintProfit deals and Amazon verification — 27 November 2026

Verified in the user's open Edge browser and the current MissinLink92/PrintProfit main branch (004d9c5). Public retailer pages checked during approximately 16:40–16:50 GMT. This is a check against published retailer offers, not a checkout redemption test.

## Amazon

The live Compare Products page already contained four individually tagged Amazon UK product links, outside the priced comparison table. Browser visits confirmed each product identity and selected variant:

| ASIN | Product | Selected variant |
|---|---|---|
| B0CR13FP1X | SUNLU Rapid PLA | White, 1.75 mm, 1 kg |
| B0F4424FL9 | ELEGOO PLA+ | Space Grey, 1.75 mm, 1 kg |
| B0FPC8GZJW | ELEGOO PETG | Transparent Amber, 1.75 mm, 1 kg |
| B0B5TB11YY | ANYCUBIC ABS-Like Resin Pro 2 | Beige, 1 kg |

All four live links contain tag=printprofit-21, sponsored/noopener attributes, affiliate labels and the Amazon Associate disclosure. No Amazon prices, availability, images, ratings or reviews were imported or republished. Their ordinary product links remain separate from the comparison filters.

The signed-in Creators API page at https://affiliate-program.amazon.co.uk/creatorsapi explicitly shows an unmet approved-Associates-account requirement and no application creation control. Its FAQ and https://affiliate-program.amazon.co.uk/creatorsapi/docs/en-us/introduction also require at least 10 qualifying sales in the trailing 30 days for PA API access. The account's actual qualifying-sales total was not checked. No API credentials were created, retrieved or stored. API-backed product/price integration cannot be enabled from the access currently available. No code-level Amazon integration failure was found: the current page deliberately uses price-free links.

Amazon policy reference: https://affiliate-program.amazon.co.uk/help/operating/policies

## Offers added

| Retailer | Published offer | Redemption | Published cutoff / recheck |
|---|---|---|---|
| ELEGOO UK | Centauri Carbon 2 Combo £329 | AZBFCC2C | 1 Dec 2026, 08:00 GMT |
| ELEGOO UK | Saturn 4 Ultra 16K £359 | BFS4U16 | 1 Dec 2026, 08:00 GMT |
| ELEGOO UK | Centauri 2 Combo £219 | AZBFC2C | 1 Dec 2026, 08:00 GMT |
| Bambu Lab UK | A1 mini printer £139 | Sale price | 1 Dec 2026, 07:00 GMT |
| Bambu Lab UK | Eligible Basic/Aesthetic filament: 15% for 2–3, 25% for 4–5, 35% for 6–9, 40% for 10+ | Sale prices, counted by type in one order | 1 Dec 2026, 07:00 GMT |
| Polymaker UK | Selected filament sale, advertised up to 50% | No public code claimed | Campaign says 6 Nov–2 Dec; exact time unspecified. Hide pending recheck on 28 Nov, 16:45 GMT. |
| Anycubic UK | Kobra X printer £259 | Sale price | No exact expiry published. Hide pending recheck on 28 Nov, 16:45 GMT. |

Primary sources:
- ELEGOO UK campaign, codes and non-stacking terms: https://uk.elegoo.com/pages/elegoo-black-friday
- Bambu Lab UK sale: https://uk.store.bambulab.com/pages/black-friday-sale
- Bambu Lab UK dates, price table, quantity tiers and exclusions: https://uk.store.bambulab.com/policy/pages/black-friday-sale
- Polymaker GBP campaign: https://shop.polymaker.com/en-gb/pages/bfcm-sale-2026
- Anycubic UK sale: https://uk.anycubic3d.com/pages/black-friday-deals

Bambu's Gradient and Silk Dual Color exclusions and account/sign-in condition are stated in the cards. ELEGOO codes are not represented as stackable with other promotions or £1 material deals. No coupons from third-party coupon aggregators were used. The Anycubic partner dashboard displays CONNORJONES as a £15 coupon, but minimum spend and full exclusions were not established, so that coupon was not published. Polymaker's mystery-spool promotion was not published because the UK qualifying-spend threshold was not established.

An ELEGOO campaign link was generated through the already approved Impact partner account: https://elegoo.sjv.io/MKMnbo . A browser visit verified its redirect to the UK Black Friday campaign and PrintProfit attribution. ELEGOO and Anycubic affiliate offers are disclosed as ads. Bambu and Polymaker links are direct, non-affiliate links.

## Implementation

- Replaced two expired Halloween offers with seven current offers, keeping the existing automatic stale-offer hiding.
- Added official source/terms links and an explicit retailer-published/checkout-untested explanation.
- Added reviewBy as a separate deadline where exact retailer expiry is unknown; the UI labels this Recheck by, not Expires.
- Added explicit retailer scope for general campaigns. Those campaigns do not produce product coupon badges. Five specific offers remain mapped to exact catalogue IDs and retailers.
- Updated cache versions on Deals and Compare.
- Added Deals files and offer data to the public deployment trigger, with coupon and catalogue ownership validation before packaging.
- Removed offer-only/validation/workflow changes from the expensive retailer refresh push trigger. Scheduled refreshes and manual dispatch remain available; changes to nightly adapters and retailer source configuration still trigger refreshes.
- Added regression coverage for recheck deadlines and actual catalogue ownership.

## Verification

- Coupon approval, terms, HTTPS, freshness, start dates, live expiry and recheck hiding: passed.
- Product ownership and retailer identity for configured offers: passed.
- Comparison search, colour, stock, prices, summaries and sorting: passed.
- Combination suite: 538,176 product subset checks; 33,922 feasible facet combinations; 9,667 pair combinations; 27,722 facet-option checks; 33,636 price-boundary checks; 25,227 search-identity checks; 800 sort/view/stock/price/selection combinations. Passed.
- Data-health validation: seven active approved offers; 27 existing source-health warnings remain. These include retailer coverage/freshness gaps, not new coupon failures.
- Browser preview: seven cards rendered, copying BFS4U16 succeeded, narrow layout showed no horizontal overflow, and the Saturn coupon appeared only on the exact standalone product, not similarly named bundles. Its dialog showed the correct code, source link, cutoff and disclosure.

Deployment status and final public verification are recorded in the completion report.
