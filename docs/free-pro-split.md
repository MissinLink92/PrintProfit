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

## Release status and remaining blocker

**Prepared source, not an activated subscription launch.** `config/billing-config.js` remains disabled. Previews and current cloud access continue until the rollout is complete.

On 22 October, `firebase firestore:databases:list --project printprofit-fd30f` failed authentication in the editing session. Database edition and deployed rules could not be verified. This change does NOT modify or deploy Firestore rules. Current repository rules still permit verified consenting Basic users to write cloud records directly. Browser checks alone are not a secure cloud paywall.

Before enabling the paid split:

1. Authenticate to the existing Firebase project and identify its database edition; inspect deployed rules.
2. Implement and test server-enforced cloud-write entitlements, including the verified owner, paid/trial expiry, cancellation and revocation. Preserve owner reads and deletion for recovery. The current webhook entitlement mirror alone needs review for freshness and owner grants before it can be used for rule enforcement.
3. Test Free local save/export/import; Pro cross-device sync and explicit local import; cancellation with cloud download and continued local edits; expiry during sync; offline behavior; and switching accounts.
4. Complete the existing live checkout/webhook rollout. Update the public terms and account consent if required for the new cloud entitlement.
5. Enable the frontend only after backend enforcement and end-to-end checks pass. Do not charge for a claimed secure cloud paywall before this is complete.

## Planned, not advertised as available

Print history with spending/material/profit summaries, reusable print presets, shopping reminders, and custom quotation branding need implementation. The Pro page explicitly labels these as planned. Existing multi-printer planning is not a completed-job tracking system.

## Validation

The 28 existing billing tests, focused backup/access tests and existing calculator, production, business-tool and Workspace regression checks pass locally. Browser visual verification is still outstanding: Playwright had no installed Chromium and its browser download failed in this environment.
