# Owner dashboard deployment

The dashboard lives on a dedicated Firebase Hosting site. `admin.printprofit.co.uk` is the intended custom domain. The app and server functions are on this branch; nothing on this branch is live until it is reviewed and deployed.

## Before enabling owner MFA

1. In Firebase Authentication, upgrade `printprofit-fd30f` to **Authentication with Identity Platform** and enable the TOTP second factor. Keep Email/Password enabled and the owner email verified. Add `admin.printprofit.co.uk` and `printprofit-admin-fd30f.web.app` to Authorized domains.
2. Deploy the updated `workshop-account-sync.js` to the main website **before enrolling** the owner account. Its sign-in now handles an authenticator challenge for enrolled users.
3. Confirm `PRINTPROFIT_OWNER_EMAIL` in the deployed functions environment equals the existing verified owner account. Do not commit that email or any keys.
4. The first admin sign-in offers a one-time manual setup key. Enter it into an authenticator, confirm a code, then sign in again with email, password and code. Store the authenticator recovery method securely. The backend denies dashboard data unless the Firebase token records a recent TOTP sign-in.

## Deploying

From the reviewed branch in Cloud Shell, run `npm ci --prefix functions && npm test --prefix functions`.

Deploy the owner-dashboard callables with the existing `firebase.billing.json` codebase:

`firebase deploy --config firebase.billing.json --project printprofit-fd30f --only functions:printprofit-billing:getOwnerDashboard,functions:printprofit-billing:prepareOwnerEnrollment,functions:printprofit-billing:getComplimentaryOverview,functions:printprofit-billing:findComplimentaryUser,functions:printprofit-billing:setComplimentaryAccess`

Because complimentary Pro is also recognised by the public site's access check, deploy the updated `getProAccess`, `createProCheckout` and deleted-user reconciliation function at the same time as the public-site code that displays Complimentary Pro status. The Stripe key and existing owner email must already be configured. Functions deploys read the local `functions/.env.printprofit-fd30f`; verify it first and never commit secrets.

Deploy the Firestore rules with the branch so `adminGrants`, `adminAudit` and `billingEntitlements` remain explicitly client-denied. These records are read or written only by trusted Cloud Functions through the Admin SDK.

Create the separate Hosting site once with `firebase hosting:sites:create printprofit-admin-fd30f --project printprofit-fd30f`, then deploy with `firebase deploy --config firebase.admin.json --project printprofit-fd30f --only hosting`. In Firebase Hosting add the custom domain `admin.printprofit.co.uk`, follow the displayed DNS verification and certificate instructions, and wait for HTTPS to become active. Hosting site IDs are globally unique; if this one is unavailable, replace the ID in `firebase.admin.json`, the callable CORS origins and this document before deploying.

The host sends `X-Robots-Tag: noindex, nofollow, noarchive` and serves a disallowing `robots.txt`; the HTML also includes a noindex meta tag. These reduce search indexing. The server-side owner and TOTP checks are the security boundary, since robots directives cannot make a page secret.

## Dashboard data

The subscription cards read Stripe live subscriptions on the server, filtered to the configured monthly/annual GBP prices. Run rate is an estimate from active recurring line items; it excludes trials, taxes, discounts and payment failures. The scan stops at 9,999 records and marks counts incomplete at that limit. Complimentary Pro users are deliberately counted separately and never inflate paid-subscriber or MRR figures. No customer emails or payment details from Stripe are sent to the browser.

For website traffic, set `PRINTPROFIT_GA4_PROPERTY_ID` to the numeric GA4 property ID (the `G-…` measurement ID is different). Enable the Google Analytics Data API in the project and grant the Cloud Function runtime service account Viewer access to that GA4 property, then redeploy `getOwnerDashboard`. The dashboard can request the last 7, 30 or 90 complete days for visitors who granted analytics consent; it shows an unavailable state until the connection works.

Complimentary Pro is managed by exact existing-account email lookup. The target must be an enabled, email-verified Firebase Auth account. The owner can grant 30-day, 90-day, 365-day or no-expiry access, attach a private note, view active grants and revoke access. Every grant/revoke action creates a server-side audit entry. Granting or revoking complimentary access does **not** cancel, pause or alter an existing Stripe subscription.

Affiliate earnings remain explicitly unconnected. Add each partner's official reporting feed or verified export before displaying a total.

## Checks after deploy

- From a fresh private browser session: email, password, TOTP, dashboard; sign out, refresh, and verify the app asks for sign-in again.
- Confirm a nonowner account and an owner token without TOTP receive `permission-denied` on every owner-dashboard callable.
- Search for a verified test account, grant a short complimentary period, sign in as that user and confirm the public site reports Complimentary Pro and enables Pro tools without Checkout.
- Revoke that grant and confirm the next fresh Pro access check falls back to the user's real Stripe/basic state.
- Confirm a paid test account's Stripe subscription is unchanged by grant/revoke actions.
- Confirm the main site's enrolled owner can still sign in and manage Pro. Confirm Stripe counts against dashboard totals and the correct live account.
- Check `curl -I https://admin.printprofit.co.uk/` for HTTPS, `X-Robots-Tag`, CSP and no-store; check `robots.txt`.
- Confirm no admin app files appear in the public GitHub Pages `_site` artifact.

## Security review

The Firestore rules explicitly deny client reads and writes to `billingEntitlements`, `adminGrants` and `adminAudit`, and deny unmatched paths. The admin browser reads none of these collections directly. Every admin callable checks the server-configured owner email, verified current Auth user, Firebase's TOTP second-factor token claim and a sign-in age under 12 hours before returning or changing data. Complimentary access accepts only an existing verified, enabled account and validates expiry/note inputs on the server. Session state is memory only in the admin host; hosting sends no-store, CSP, no-referrer and noindex headers.

Before production sign-off, still verify a real nonowner denial, a real non-MFA denial, the custom-domain certificate, GA4 service-account permission and one full complimentary-access grant/revoke round trip.
