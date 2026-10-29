# PrintProfit mobile starter

This is an isolated Capacitor shell for Android and iPhone. It packages the same public files as GitHub Pages; it does not publish or alter the website.

From this directory, with Node.js 22+, Python 3, and the native platform tools installed:

1. Run `npm install`.
2. Run `npm run build:web` to package the tracked public website files into `www/`.
3. Run `npx cap add android` or `npx cap add ios` to create a local native project.
4. After source changes, run `npm run sync`.

The iOS project needs macOS and Xcode. Do not submit either platform to an app store yet. The existing Pro buttons lead to Stripe Checkout and the Stripe portal, and the app still needs Apple in-app purchases and Google Play Billing, server-side purchase verification, restore and cancellation paths, native account testing, and actual device testing. The store bundle must not offer the current web checkout for in-app Pro purchases.

The package ID is provisional until the owner registers store accounts. Native project directories will be added after an Android and an iPhone build have been created and tested. Never copy the `admin/`, `functions/`, or private Firebase files into `www/`.

