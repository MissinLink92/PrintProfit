# Owner dashboard deployment

The dashboard lives on a dedicated Firebase Hosting site. `admin.printprofit.co.uk` is the intended custom domain. The app and server function are on this branch; neither is live until this branch is reviewed and deployed.

## Before enabling owner MFA

1. In Firebase Authentication, upgrade `printprofit-fd30f` to **Authentication with Identity Platform** and enable the TOTP second factor. Keep Email/Password enabled and the owner email verified. Add `admin.printprofit.co.uk` and `printprofit-admin-fd30f.web.app` to Authorized domains.
2. Deploy the updated `workshop-account-sync.js` to the main website **before enrolling** the owner account. Its sign-in now handles an authenticator challenge for enrolled users.
3. Confirm `PRINTPROFIT_OWNER_EMAIL` in the deployed functions environment equals the existing verified owner account. Do not commit that email or any keys.
4. The first admin sign-in offers a one-time manual setup key. Enter it into an authenticator, confirm a code, then sign in again with email, password and code. Store the authenticator recovery method securely. The backend denies dashboard data unless the Firebase token records a recent TOTP sign-in.

## Deploying

From the reviewed branch in Cloud Shell, run `npm ci --prefix functions && npm test --prefix functions`. Then deploy `getOwnerDashboard` and `prepareOwnerEnrollment` using the existing `firebase.billing.json` codebase (`functions:printprofit-billing:getOwnerDashboard,functions:printprofit-billing:prepareOwnerEnrollment`). The Stripe key and existing owner email must already be configured. Functions deploys read the local `functions/.env.printprofit-fd30f`; verify it first.

Create the separate Hosting site once with `firebase hosting:sites:create printprofit-admin-fd30f --project printprofit-fd30f`, then deploy with `firebase deploy --config firebase.admin.json --project printprofit-fd30f --only hosting`. In Firebase Hosting add the custom domain `admin.printprofit.co.uk`, follow the displayed DNS verification and certificate instructions, and wait for HTTPS to become active. Hosting site IDs are globally unique; if this one is unavailable, replace the ID in `firebase.admin.json`, the callable CORS origins and this document before deploying.

The host sends `X-Robots-Tag: noindex, nofollow, noarchive` and serves a disallowing `robots.txt`; the HTML also includes a noindex meta tag. These reduce search indexing. The server-side owner and TOTP checks are the security boundary, since robots directives cannot make a page secret.

## Data connections

The subscription cards read Stripe live subscriptions on the server, filtered to the configured monthly/annual GBP prices. Run rate is an estimate from active recurring line items; it excludes trials, taxes, discounts and payment failures. The scan stops at 9,999 records and marks counts incomplete at that limit. No customer emails or payment details are sent to the browser.

For website traffic, set `PRINTPROFIT_GA4_PROPERTY_ID` to the numeric GA4 property ID (the `G-…` measurement ID is different). Enable the Google Analytics Data API in the project and grant the Cloud Function runtime service account Viewer access to that GA4 property, then redeploy `getOwnerDashboard`. The card covers the last seven complete days for visitors who granted analytics consent; it shows an unavailable state until the connection works.

Affiliate earnings remain explicitly unconnected. Add each partner's official reporting feed or verified export before displaying a total.

## Checks after deploy

- From a fresh private browser session: email, password, TOTP, dashboard; sign out, refresh, and verify the app asks for sign-in again.
- Confirm a nonowner account and an owner token without TOTP receive `permission-denied`; test with the callable endpoint and inspect function logs without exposing secrets.
- Confirm the main site's enrolled owner can still sign in and manage Pro. Confirm Stripe counts against Dashboard totals and the correct live account.
- Check `curl -I https://admin.printprofit.co.uk/` for HTTPS, `X-Robots-Tag`, CSP and no-store; check `robots.txt`.
- Confirm no admin app files appear in the public GitHub Pages `_site` artifact.

## Security review

The existing Firestore rules deny reads and writes to `billingEntitlements`, `billingCustomers` and other server-only collections and deny unmatched paths. The admin browser reads none of them directly. The new callable checks a server configured owner email, verified current Auth user, Firebase's TOTP second-factor token claim and a sign-in age under 12 hours before Stripe or Analytics is queried. Session state is memory only in the admin host; hosting sends no-store, CSP, no-referrer and noindex headers. The deployment still needs a real nonowner and non-MFA denial check, verified domain/certificate, and service account GA4 permissions.
