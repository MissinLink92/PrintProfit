# PrintProfit account and workshop sync setup

This feature keeps the existing browser-only workshop available to everyone. A user can create an account to sync printer and material profiles between devices.

## Firebase project

1. Sign in to the Firebase Console with the Google account that owns PrintProfit.
2. Create a Firebase project and stay on the no-cost Spark plan to begin. Firebase currently lists no payment method as required for Spark. Cloud Firestore's standard free quota includes 1 GiB stored data, 50,000 reads/day, 20,000 writes/day and 20,000 deletes/day. Review Firebase's current [pricing page](https://firebase.google.com/pricing) before enabling paid services.
3. Add a **Web app** to the Firebase project and copy its web configuration.
4. In **Authentication → Sign-in method**, enable **Email/Password**.
5. In **Authentication → Settings → Authorized domains**, ensure \`printprofit.co.uk\` is listed.
6. Create the default **Cloud Firestore** database in **London (\`europe-west2\`)**. Choose the location carefully: Firebase says the database location cannot be changed after provisioning.
7. In **Firestore → Rules**, publish the contents of \`firestore.rules\`.

## Add the public web configuration

Copy the Firebase web app's \`apiKey\`, \`authDomain\`, \`projectId\`, and \`appId\` into \`config/firebase-config.js\`. These values are intended to be used in a browser. Do not use or copy a service-account JSON file or Admin SDK private key into the website.

The website loads Firebase's modular JavaScript SDK only when someone opens **My Workshop** and the Firebase configuration is present.

## Data behavior

- Printer and material profiles are stored locally while signed out.
- On the first verified sign-in, existing local profiles are copied into the account.
- A different account on the same browser gets its own local profile cache; one account's workshop is not merged into another account. Signing out hides that account's profiles from the workshop until the same user signs back in.
- Changes made while signed in sync automatically. If a save fails, the profiles remain in browser storage and can be retried with **Sync now**. Profile deletions are recorded in the cloud so another device does not restore a deleted profile.
- Signed-in users can delete their account and cloud workshop profile from **My Workshop**; deletion requires confirming their password.
- My Projects and uploaded print files are not synced in this first version.
- Firebase sends verification and password reset emails. The default sender is controlled by Firebase; custom sender branding can be configured separately.
- Before enabling public account creation, update PrintProfit's privacy information to explain account data, Firebase processing, and the process for deleting an account and its cloud data.
