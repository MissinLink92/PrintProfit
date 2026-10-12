# PrintProfit account and workshop sync setup

This feature keeps the existing browser-only workshop available to everyone. A user can create an account to sync printer and material profiles between devices.

## Firebase project

1. Sign in to the Firebase Console with the Google account that owns PrintProfit.
2. Create a Firebase project and stay on the no-cost Spark plan to begin. Firebase currently lists no payment method as required for Spark. Cloud Firestore's standard free quota includes 1 GiB stored data, 50,000 reads/day, 20,000 writes/day and 20,000 deletes/day. Review Firebase's current [pricing page](https://firebase.google.com/pricing) before enabling paid services.
3. Add a **Web app** to the Firebase project and copy its web configuration.
4. In **Authentication → Sign-in method**, enable **Email/Password**.
5. In **Authentication → Settings → Authorized domains**, ensure `printprofit.co.uk` is listed.
6. Create the default **Cloud Firestore** database in **London (`europe-west2`)**. Choose the location carefully: Firebase says the database location cannot be changed after provisioning.
7. In **Firestore → Rules**, publish the contents of `firestore.rules`.

## Add the public web configuration

The public web app configuration for project `printprofit-fd30f` is already set in `config/firebase-config.js`. These values are meant to appear in the browser. If you replace the Firebase project, update the `apiKey`, `authDomain`, `projectId`, and `appId` fields. Never put a service-account JSON file or Admin SDK private key in the website.

The website loads Firebase's modular JavaScript SDK only when someone opens **My Workshop** and the Firebase configuration is present.

## Data behavior

- Printer and material profiles are stored locally while signed out.
- Before any profile sync, the user must accept the current Terms and choose profile sync. Existing local profiles trigger a separate choice on each browser and account: **Import profiles** or **Keep them on this device**. Profiles are never merged into an account automatically.
- A different account on the same browser gets its own local profile cache; one account's workshop is not merged into another account. Signing out hides that account's profiles from the workshop until the same user signs back in. Local profiles stay separate unless the user chooses to import them.
- Changes made while signed in sync automatically. If a save fails, the profiles remain in browser storage and can be retried with **Sync now**. Profile deletions are recorded in the cloud so another device does not restore a deleted profile.
- Signed-in users can delete their account and cloud workshop profile from **My Workshop**; deletion requires confirming their password.
- My Projects and uploaded print files are not synced in this first version.
- Firebase sends verification and password reset emails. The default sender is controlled by Firebase; custom sender branding can be configured separately.
- The public Privacy Notice and Terms of Use explain the account data, Firebase processing, optional analytics, local-profile import choice and deletion limits.

## Maintainer checks before release

- In Firebase Console → Firestore → Rules, publish the current `firestore.rules` from this branch and confirm the console reports a successful publish. A local file or PR alone does not change the live Firebase rules.
- In Google Analytics, set event and user-data retention to two months, turn off “Reset user data on new activity”, and confirm that no BigQuery export is enabled. The Privacy Notice describes these as release requirements; check the actual property before enabling analytics for general use.
- Complete the ICO fee checker for the actual business setup and keep the result. Do not assume that a small site or sole trader is exempt.
- Protect the Google/Firebase and GitHub owner accounts with two-step verification, unique passwords and recovery options. Give access only to people who need it.
- Use a separate test email you control to verify sign-up, email verification, password reset, policy acceptance, import/keep choice, sync, a second account on the same browser, and account deletion. Check both local data separation and the Firestore records. Do not use customer data for testing.
- Keep an incident note with the contact steps. If a personal-data breach occurs, assess it promptly; where UK law requires a report, notify the ICO within 72 hours of becoming aware, and notify affected people if the risk is high.
- When policy wording changes, increment the Terms/Privacy version and acceptance-document ID in `workshop-account-sync.js` and `firestore.rules` together, then retest re-acceptance and deletion.
