# PrintProfit regression testing plan

Status: **test design only — no test cases have been executed by this document**.

## Critical reported failure: Compare Products
Observed on 2026-11-19: brand SUNLU, colour #Black, category All products, retailer All retailers, sort Price low to high. Summary said 239 matching listings, four retailers, minimum £10, while the results heading and table said zero. Investigate whether summary and displayed rows use different filtering pipelines, stale state, or a view/selection filter. Do not assume a root cause before reproducing.

### Acceptance criteria
- Summary counts, results heading and rendered row/card count agree for the same filter state (account for pagination/virtualization explicitly).
- Every displayed product satisfies every active filter.
- Adding/removing any filter, clearing all filters, changing sort, and switching Table/Cards never leaves stale results.
- Zero results must be genuine and show a usable empty state.
- Saved comparisons and selected-only view do not silently change the active general-results count.

### Test dimensions
Search (empty, valid, no-match, special characters); category (all, filament, resin, printer, parts); brand (all, SUNLU, other); subcategory (all, valid, incompatible); retailer (all, each available); colour (all, #Black, others); minimum and maximum price (empty, zero, valid, invalid, inverted); availability (all, in stock, out of stock); sort (every option); view (Table/Cards); selected-only (on/off); quick-filter chips (each); saved comparisons (create/load/delete); navigation (away/back/reload); device (desktop/tablet/mobile).

### Test execution
1. Capture initial product dataset and filter-state snapshot; use a fixed fixture so counts do not change with live prices.
2. Reproduce SUNLU + #Black and record screenshots, console errors, counts, and displayed product IDs.
3. Run each dimension alone, then every pair (pairwise covering array), then high-risk 3–5 way combinations; exhaustively enumerate small finite subsets.
4. Repeat state transitions in both orders: A→B and B→A; toggle filters off; clear; reload; navigate away/back.
5. Run on desktop and mobile with Chromium; include Firefox/WebKit where supported.
6. Fail CI on mismatched counts, stale results, JS exceptions, incorrect sort, invalid links or accessibility-critical controls.
7. Keep failure screenshots/traces and publish machine-readable pass/fail counts with untested cases distinguished.

## Whole-site coverage
- Calculator: FDM/resin, G-code/3MF, file errors, quantities, costs, fees, currency, discounts, reset, estimates and result advice.
- Projects: create, edit, duplicate, delete, save/reload, import/export where supported.
- Workspace: materials, stock deductions, multiple printers, scanner/manual entry, failure/downtime, persistence.
- Accounts: signed-out, Free, Pro, trial, expired, payment failure and access restrictions; use sandbox/test accounts only.
- Settings: themes, language, unit changes, presets, persistence.
- Compare Products: full matrix above; verify retailer links, stale prices and stock notices separately from fixture tests.
- Responsive: 320px phone through large desktop, keyboard-only navigation, touch, overflow and modal usability.
- Safety: never run destructive tests against real user accounts or live payments.

## Evidence and release gates
For every test record: unique ID, scenario, dataset version, environment, expected result, actual result, timestamp, commit SHA, screenshot/trace if failed, and status PASS/FAIL/BLOCKED/NOT RUN.

Do not mark a feature complete merely because its code exists, an unrelated script passes, or a nightly feed commits. Block release on critical regressions; fix and rerun the relevant tests plus the full smoke suite.

## Next implementation tasks
- Identify the Compare Products source file and existing browser test runner/workflow.
- Extract a single shared filtered-results selector used by summary and display if code inspection confirms the mismatch.
- Implement executable Playwright regression cases with deterministic fixtures and CI artifacts.
- Verify PR CI and actual browser runs before merging or deploying.
