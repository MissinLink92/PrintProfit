# PrintProfit Pro subscription and trial

## Current source status — 20 October 2026

The £2.50 monthly and £24 annual prices and Customer Portal were configured previously. Source now prepares an authenticated Pro panel, a seven day trial for a customer with no subscription history, server-verified trial access, signed webhook refreshes, explicit purchase acknowledgement and a normal-flow account-deletion check. **Both the backend checkout switch and the browser panel remain disabled.** No Firebase billing deployment, signed webhook registration or end-to-end sandbox payment/trial test is evidenced. Existing Pro previews remain available; do not advertise them as paid-only yet.

### Feature decision

| Feature | Basic | Pro |
|---|---|---|
| Full calculator, print-file analysis, single/batch costs, fees, margins and pricing | Included | Included |
| Compare Products, saved projects and account sync | Included | Included |
| Manual printer/material profiles, remaining-weight entry and stock updates | Included | Included |
| Printer groups, production runs, downtime and failure allowances | Preview available until launch | Included at launch |
| What-if scenario comparison and customer quotations | Preview available until launch | Included at launch |
| Internal costing CSV/PDF exports and barcode-assisted material entry | Preview available until launch | Included at launch |

Later candidates: photo/label-assisted entry for materials without a barcode, job/sales records, useful low-stock alerts and business reports. Implement and validate each before advertising it. Preserve viewing and exporting existing data when a subscription ends. Existing tools must stay available during this preparation; only apply feature gates after the full Pro experience and downgrade path are reviewed.

### Trial and launch path

- First Stripe subscription for the mapped customer: seven day trial with a payment method collected in Checkout; then £2.50/month or £24/year paid upfront unless cancelled before the trial ends. A returning subscriber starts the chosen paid plan without another trial. The annual plan saves £6 against twelve monthly payments.
- Access comes only from current Stripe subscriptions: `trialing` through the verified `trial_end`, or `active` through the paid period, using configured prices and one seat. Failed, expired and paused subscriptions lose Pro. A scheduled cancellation retains access through the current trial or paid period.
- Stripe Checkout trial completion can be `no_payment_required`. Signed `checkout.session.completed`, `customer.subscription.*` and invoice webhooks refresh the subscription instead of trusting a browser return URL.
- Configure a trial-ending reminder in Stripe and test `customer.subscription.trial_will_end` (typically three days before the end), first charge, payment failure and cancellation messages. The handler currently mirrors status but does not send an email itself.
- The browser panel is behind `config/billing-config.js` (`enabled:false`). The Firebase callable checkout is behind `PRINTPROFIT_BILLING_ENABLED=false`. Both remain off until a separate test frontend, secrets, signed webhook, tax review, legal copy, account deletion reconciliation, premium gates and payment/renewal/cancellation tests are complete.
- The normal account deletion flow checks for an open subscription before removing cloud data. Direct deletion of Firebase Auth outside that flow still needs a reconciliation plan before live payments. `billingPurchaseConsents` is a server-only Firestore collection alongside the existing billing collections.

### Historical setup and work still required

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
2. Enable Firebase's supported billing plan for Cloud Functions, confirm project costs and set budget alerts. Use a separate Firebase test project for sandbox deployment. Reserve `printprofit-fd30f` for the reviewed live integration. No backend has been deployed by this change.
3. Install dependencies in `functions/`, generate and review a package lock, run dependency/security checks, then run `npm test`. The policy tests and mocked handler tests currently run without external dependencies; Firebase/Stripe integration and emulator tests are still required.
4. Create TEST-mode GBP recurring prices: 250 pence every month and 2400 pence every year, quantity one, licensed, tax behavior inclusive. Confirm the actual tax/business setup before live billing. Set `STRIPE_PRO_MONTHLY_PRICE` and `STRIPE_PRO_ANNUAL_PRICE` to those price IDs. Do not accept arbitrary prices from the browser.
5. Put `STRIPE_SECRET_KEY` and `STRIPE_WEBHOOK_SECRET` in Firebase Secret Manager. Leave `PRINTPROFIT_BILLING_ENABLED=false` until integration tests are finished.
6. For sandbox testing, deploy using the explicit config and the verified separate test project ID: `firebase deploy --config firebase.billing.json --project <TEST_PROJECT_ID> --only functions:printprofit-billing`. Do not run sandbox billing against `printprofit-fd30f`. This command does not deploy Firestore rules; the test project's rules and authentication must also be configured and verified.
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
- Live and sandbox Stripe accounts are now connected. Sandbox configuration is listed below; do not reuse live prices for test mode.
- No Firebase CLI/cloud deployment authentication was available in this session. Firebase project billing, deployment, secure secrets, frontend billing flow, purchase terms, deletion protection and end-to-end tests remain outstanding.
- These IDs are configuration references, not credentials. No secret keys belong in this document or in public browser code.

## Sandbox setup — 17 October 2026, evening

- Account: `acct_1URIYGV054u1E901` (Printprofit sandbox), confirmed livemode false.
- Product: `prod_VSDdmCCDaSuCdT` (existing PrintProfit Pro).
- Monthly price: `price_1URJCAV054u1E901uBTn2U1J`, GBP 250 pence/month, licensed. Existing amount retained; tax behaviour aligned to inclusive.
- Annual price: `price_1URcRuV054u1E901FcHEWMqw`, GBP 2400 pence/year upfront, licensed, inclusive.
- Default portal: `bpc_1URcS7V054u1E901ezQ5Kzql`. Invoice history, payment method updates and period-end cancellation enabled. Plan switching and public login disabled. Return URL https://printprofit.co.uk/ must be changed to the verified test frontend before end-to-end sandbox testing.
- No automatic tax setting was enabled. Inclusive price behaviour is not a claim of tax registration or tax collection.
- This is catalogue/portal configuration only: no completed Checkout, renewal, cancellation or entitlement integration tests yet.

### Environment isolation

The billing collections are server-only and separated by Firebase project. The backend now permits only `printprofit-test` with sandbox credentials and `printprofit-fd30f` with live credentials; unknown projects, wrong-mode keys, prices, subscriptions and webhook events fail closed. Do not deploy sandbox billing into production. Keep live checkout disabled.

Before testing: configure test-only secrets securely, complete webhook event handling and mode validation, deploy the handler, register its actual endpoint, and point the test frontend and portal return URL at the test environment. Never use a key previously pasted into chat; rotate it in Stripe first. No credentials should be added to this document.

Dependency update `1369600f26afe06474b7e7b090bba82dfb846d61` retains the supplied npm lockfile. The earlier Cloud Shell run showed nine passing policy/mocked-handler tests and zero npm audit vulnerabilities; these are not end-to-end Stripe test results.

## Test preparation — 18 October 2026

Screenshot-confirmed: `printprofit-test` exists, Email/Password Auth was enabled, its default Firestore database is in `europe-west2`, Blaze billing is enabled, and Cloud Functions/Cloud Run/Cloud Build/Artifact Registry APIs are enabled. A secret version named `STRIPE_SECRET_KEY` was created in the test project; its value and rotation status have not been inspected by this code review. No backend functions were deployed at the last successful list check. The selected budget alert amount was not independently verified.

Prepared changes (not a deployment): test Checkout and Portal return to `https://printprofit-test.web.app/`; production returns remain `https://printprofit.co.uk/`. Auth tokens and billing records remain in their own Firebase project. Test origins are allowed by CORS, which does not grant Auth or Firestore access. Copy `functions/.env.printprofit-test.example` to `functions/.env.printprofit-test` for the public test price IDs and disabled checkout flag. Secrets stay exclusively in Secret Manager.

Stripe SDK is pinned to 23.0.0 with API `2026-09-30.endive`, verified against the npm package and Stripe API versioning documentation on 18 October. The existing integration had no explicit API override and used SDK 18.x. This changes the backend client only; no Stripe account default API version or existing webhook endpoint was changed. Register the new sandbox endpoint with matching API version. Sources: https://docs.stripe.com/api-versions and https://github.com/stripe/stripe-node/blob/v23.0.0/CHANGELOG.md.

The webhook now refreshes current subscription state for paid Checkout completion and asynchronous success, `invoice.paid`, `invoice.payment_failed`, and existing subscription lifecycle events. Unpaid Checkout completions are acknowledged without entitlement writes. This remains a mirror of fresh server-side Stripe reads; no return page grants access.

Validation: 19 policy/mocked-handler tests pass, syntax and real dependency module loading pass, npm audit reports zero vulnerabilities. These are not real Checkout, renewal, cancellation or Firebase emulator tests. Test frontend hosting, authorized Auth domains, subscription purchase consent, account deletion protection, webhook endpoint/signing secret, customer portal return settings and end-to-end testing remain blockers. The test host is a fixed intended destination, not a claim that Hosting is already deployed. Checkout remains false.

Before live launch, confirm tax registrations and customer jurisdictions; automatic tax is still disabled. Prefer a restricted key scoped to the required customer, price, subscription, Checkout and portal calls once permissions have been exercised in the sandbox.
