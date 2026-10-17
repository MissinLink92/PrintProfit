# PrintProfit subscription integration — Stripe catalogue configured, checkout not launched

Status (17 October 2026): live Stripe catalogue and customer portal configured via the connected Printprofit account. The server foundation remains undeployed by this setup; checkout is not enabled and all existing Pro previews remain available. The browser UI does not enforce subscriptions yet. This is not an end-to-end payment launch.

## Proposed plans

| Feature | Basic | Pro (£2.50/month or £24/year) |
|---|---|---|
| Core cost and profit calculator | Included | Included |
| Compare Products and retailer links | Included | Included |
| Manual printer/material inventory, remaining stock and alerts | Included | Included |
| Existing saved projects and account sync | Included | Included |
| Barcode-assisted material entry | Manual entry | Scanning |
| Farm groups and production allowances | Existing preview retained for now | Planned |
| Scenario comparison and business exports | Existing preview retained for now | Planned |

Annual billing is £24 upfront, equivalent to £2/month; saving £6 against twelve monthly payments. Do not remove or hide existing user projects, inventory or exports on downgrade. Existing data must remain readable/exportable. Product details for the final paid tiers still need to be agreed before gating.

## Architecture and implemented files

Existing Firebase Authentication identifies customers. `functions/index.js` adds authenticated callable endpoints `createProCheckout`, `createBillingPortal`, and `getProAccess`, plus a signed `stripeBillingWebhook` HTTP endpoint. Region: europe-west2. `functions/billing-core.js` validates the two server-configured Stripe prices and paid access periods.

Prices and customer IDs are selected on the server. Checkout return parameters never grant access. The portal uses the authenticated user's customer mapping, never a client-supplied customer ID. Concurrent checkout preparation is locked in Firestore. Webhooks verify the raw Stripe signature, ignore duplicate events and do not overwrite a newer event record with an older one. Access checks query Stripe afresh, independently of the webhook mirror.

Access policy: only an active subscription with the configured price, one seat, an unexpired period and no paused collection grants Pro. Scheduled cancellation retains access until the paid period ends. Past-due, unpaid, incomplete, trialing, paused and canceled subscriptions do not grant Pro. There is no free trial or promotion-code field configured.

`billingCustomers`, `billingCheckoutLocks`, `billingEntitlements` and `billingWebhookEvents` are server-only Firestore collections. The existing rules' final default deny must remain in force; do not add browser write access. Admin SDK writes bypass rules. No secret belongs in the public repository or browser config. Server source is excluded from the Pages package.

## Required setup before launch

1. Connor creates/finishes a Stripe business account and payout/identity setup directly with Stripe. Never paste secret keys into chat or GitHub.
2. Enable Firebase's supported billing plan for Cloud Functions, confirm project costs and set budget alerts. Deploy to the existing `printprofit-fd30f` project only after reviewing the configuration. No backend has been deployed by this change.
3. Install dependencies in `functions/`, generate and review a package lock, run dependency/security checks, then run `npm test`. The policy tests and mocked handler tests currently run without external dependencies; Firebase/Stripe integration and emulator tests are still required.
4. Create TEST-mode GBP recurring prices: 250 pence every month and 2400 pence every year, quantity one, licensed, tax behavior inclusive. Confirm the actual tax/business setup before live billing. Set `STRIPE_PRO_MONTHLY_PRICE` and `STRIPE_PRO_ANNUAL_PRICE` to those price IDs. Do not accept arbitrary prices from the browser.
5. Put `STRIPE_SECRET_KEY` and `STRIPE_WEBHOOK_SECRET` in Firebase Secret Manager. Leave `PRINTPROFIT_BILLING_ENABLED=false` until integration tests are finished.
6. Deploy using the explicit config: `firebase deploy --config firebase.billing.json --project printprofit-fd30f --only functions:printprofit-billing`. This does not deploy Firestore rules or replace other codebases.
7. Register the HTTPS webhook URL from deployment in Stripe. Select customer.subscription.created, updated, deleted, paused and resumed. The signing secret is unique to this endpoint/mode.
8. Enable the Stripe customer portal for invoices, payment method changes, cancellation, and the two allowed plan prices. Review proration policy before allowing plan switching.
9. Add the authenticated browser subscription panel. Use the Firebase Functions SDK with the existing app and europe-west2 region. Query `getProAccess` after sign-in and returning from Stripe. Handle unavailable/offline access without deleting data. Only show checkout after deployment/configuration tests pass.
10. Integrate account deletion: an account with a billable subscription must be directed through cancellation/confirmation before deletion. Do not leave a Stripe subscription charging after Firebase account deletion. Current account deletion is unchanged; this is a launch blocker.
11. Add subscription-specific purchase terms, renewal frequency, total upfront annual price, cancellation and refund information. Record explicit acceptance for purchase; the existing account terms acceptance alone is not a complete paid-purchase consent flow.
12. Test successful/failed/3DS payments; duplicate clicks and simultaneous devices; replayed/invalid/delayed webhooks; renewal failure and recovery; immediate and end-of-period cancellation; monthly/annual switching; account switching; deletion; and restored access on another device. Test mode must not unlock live accounts.
13. Add server checks to any future premium server operations. Client-only calculator tools can be bypassed by modifying downloaded code; hiding controls alone is not a secure entitlement boundary. No existing feature is claimed to be securely paywalled by this change.
14. Once all tests pass, configure separate LIVE price IDs and secrets, enable checkout, then apply the agreed feature gates. Check receipt and portal links before announcing availability.

## Validation performed

`node --test functions/billing-core.test.js functions/billing-handlers.test.js`: configured plan/currency/amount checks, scheduled cancellation, expired and non-paying statuses, fixed server return destinations, unauthenticated/unverified access rejection, disabled checkout, portal customer isolation and invalid webhook signature rejection. `node --check functions/index.js`: syntax only. No claim of emulator or real payment testing.

## Primary references

- Firebase callable functions: https://firebase.google.com/docs/functions/callable
- Firebase secret parameters: https://firebase.google.com/docs/functions/config-env
- Stripe subscription states: https://docs.stripe.com/api/subscriptions/object
- Stripe customer portal: https://docs.stripe.com/customer-management
- Stripe webhook signatures: https://docs.stripe.com/webhooks/signature

## Verified Stripe setup — 17 October 2026

- Live account: `acct_1URIY1V05QYif292` (Printprofit). Payments and payouts enabled; no currently due or past-due requirements at inspection. An eventually-due company tax/registration requirement remains; do not interpret enabled payments as a tax-status determination.
- Product: `printprofit_pro`, PrintProfit Pro.
- Monthly price: `price_1URXC0V05QYif292e4PfFIMc`, GBP 250 pence per month.
- Annual price: `price_1URXCEV05QYif292TF3wmWyX`, GBP 2400 pence per year upfront.
- Prices use inclusive tax behaviour to preserve the advertised total; automatic tax collection has NOT been configured or enabled.
- Default live portal configuration: `bpc_1URXCUV05QYif2923U6pDfnG`. Invoice history and payment-method changes enabled; cancellation at period end. Plan switching and public portal login are disabled pending integration testing. Return URL: https://printprofit.co.uk/.
- No live webhook endpoints existed at inspection. None created: first deploy the actual handler and securely configure its signing secret.
- Only the live Stripe account is currently connected to the assistant. A sandbox/test context must be connected before real integration testing. Do not reuse these live prices for test mode.
- No Firebase CLI/cloud deployment authentication was available in this session. Firebase project billing, deployment, secure secrets, frontend billing flow, purchase terms, deletion protection and end-to-end tests remain outstanding.
- These IDs are configuration references, not credentials. No secret keys belong in this document or in public browser code.
