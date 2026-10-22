# Free and Pro split — 22 October 2026

The agreed direction is useful for hobbyists, makers and sellers: **Keep your prints, printers and materials organised.**

| Feature | Basic | Pro |
| --- | --- | --- |
| Core calculator, upload/file analysis, single/batch costs, Compare Products | Included | Included |
| Local projects, manual printer/material inventory | Included | Included |
| Workspace JSON backups and imports | Included | Included |
| Cloud project settings and inventory sync | Download existing cloud data | Sync across devices |
| Barcode-assisted material entry | Manual entry | Included |
| Stock after a confirmed print | Manual remaining-stock edits | Automatic deduction |
| Stock overview | Remaining stock and empty packages | Low-stock alerts too |
| Production planning | Single/batch calculation | Multi-printer runs and allowances |
| Comparisons, costing CSV, quotation PDF | Core calculation and backup export | Existing advanced tools |

Backups contain project settings and inventory, not uploaded model files. Import preserves existing IDs without overwriting matching records. Keep original model files separately. Existing cloud records have a dedicated read-only download path regardless of subscription. No data is deleted on downgrade.

## Implemented in this change

- Hobbyist-friendly positioning and an explicit Free/Pro comparison in My Workspace.
- Free local JSON backup/import for projects, printers and materials, with size/schema checks and account-change protection.
- An entitlement check before background cloud sync when billing is enabled; no background paywall popups.
- Confirmed-print deductions and low-stock notifications follow Pro access when billing is enabled. Manual editing stays free.
- Existing cloud data can be downloaded without a Pro entitlement, including after cancellation.
- Existing scanner, production, comparison and quote gates are retained.

## Source implemented; live activation blocked on Firebase rollout

The secure source is now prepared, but this is **not yet an activated subscription launch**. `config/billing-config.js` and the server checkout flag remain disabled.

Cloud writes now require a server-minted Pro entitlement in Firestore. The callable refreshes access from Stripe and writes a server-only entitlement with a 15-minute freshness window; Firestore rules require verified identity, current account consent, an unexpired Pro period and a fresh server check for profile and project writes. Basic accounts retain read and delete access to their own cloud records for export and recovery. Client apps cannot read or write entitlement documents. Source checks cover active, expired, owner and revoked access.

Production still needs the rollout recorded in [live-pro-rollout.md](live-pro-rollout.md): the live Firebase project has no billing functions or stored Stripe secrets, and its designated live webhook is disabled. The browser billing config must remain off until those services are deployed and verified. The live site currently returns 404 for `/config/billing-config.js`, so confirm the production static deployment before enabling the browser flag.

Before activation:

1. In Cloud Shell, verify the project and local status; inspect the Firestore database edition and current rules. Never overwrite unrelated local changes.
2. Store the restricted live Stripe key and signing secret for the designated webhook in Firebase Secret Manager through masked prompts. Keep the webhook disabled until the function is deployed.
3. Run `npm ci --prefix functions` and `npm test --prefix functions`. Deploy both the billing functions and Firestore rules with `npx -y firebase-tools@latest deploy --config firebase.billing.json --project printprofit-fd30f --only functions,firestore:rules`.
4. Exercise the deployed rules in the test project and verify Pro sync, Basic write denial, owner access, cancellation, expiry, read/export and account deletion. Then verify the live webhook signature and a test-mode/live-mode separation.
5. Only after those checks, enable the server checkout flag, enable the designated Stripe webhook, publish `config/billing-config.js` with the browser flag enabled, and confirm the file is served from `https://printprofit.co.uk/config/billing-config.js`.

Do not claim the subscription is live until those production checks pass.

## Planned, not advertised as available

Print history with spending/material/profit summaries, reusable print presets, shopping reminders, and custom quotation branding need implementation. The Pro page explicitly labels these as planned. Existing multi-printer planning is not a completed-job tracking system.

## Validation

The 28 existing billing tests, focused backup/access tests and existing calculator, production, business-tool and Workspace regression checks pass locally. Browser visual verification is still outstanding: Playwright had no installed Chromium and its browser download failed in this environment.
