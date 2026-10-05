# Stage 6.2C — completed verification checkpoint

Status: **PASS**. Stage 7 was not started.

## Recommendation carousel visual correction — final verification

- The approved Menu two-column grid remains unchanged.
- The conflicting `116px` Guest override was replaced locally by `clamp(180px, 54%, 200px)` for `.guest-theme .popular-grid`.
- Measured recommendation-card widths are 181.44px at 360, 189.53px at 375, 197.63px at 390, and 200px at 430, 480 and desktop 1440 viewports.
- The measured visible-card count is 1.77–2.15. Horizontal overflow is confined to the carousel; page overflow is absent at all six viewports.
- Title and description remain at no more than two lines. Metadata is one line with `nowrap`; CTA is 48px high and Favourite is 44 × 44px.
- Current screenshots exist for 360, 375, 390, 430, 480 and 1440px. Measurements and inventory: `stage-6.2c/PRODUCT_CARD_LAYOUT.md` and `stage-6.2c/product-card-layout.json`.
- Targeted ProductCard responsive E2E: **6/6 PASS** (`stage-6.2c/recommendation-targeted-e2e.json`).
- Guest-theme regression: **6/6 PASS** (`stage-6.2c/recommendation-guest-theme-e2e.json`).
- Full Chromium Stage 6 E2E: **38/38 PASS**, exit 0; failures 0; skipped 0 (`stage-6.2c/recommendation-full-e2e.json`).
- TypeScript: **PASS**. Unit tests: **23/23 PASS**.

## Final verification

- TypeScript: **PASS**, exit 0.
- Unit tests: **23/23 PASS**, exit 0; skipped 0.
- Targeted GST-034: **1/1 PASS**, exit 0. Evidence: `stage-6.2c/favourites-targeted.json`.
- Targeted cashback regression: **1/1 PASS**, exit 0. Evidence: `stage-6.2c/cashback-targeted.json`.
- Authentication / restaurant-session E2E: **14/14 PASS**, exit 0. Evidence: `stage-6.2c/auth-session-related-final.json`.
- ProductCard responsive E2E: **6/6 PASS**, exit 0. Evidence: `stage-6.2c/product-card-targeted-e2e.json`.
- Guest-theme regression E2E: **6/6 PASS**, exit 0. Evidence: `stage-6.2c/product-card-guest-theme-e2e.json`.
- Full Chromium Stage 6 E2E: **38/38 PASS**, exit 0; failures 0; skipped 0; retries 0. This includes the original **32/32 Stage 6 baseline** plus six new ProductCard layout tests. Evidence: `stage-6.2c/product-card-full-e2e.json`.
- The full run included the responsive design scenarios at 360, 375, 390 and 430px, the fixed-navigation scenarios at 320 and 480px, and desktop coverage.
- The earlier final-code responsive matrix remains **60/60 PASS** across 360, 375, 390, 430, 480 and 1440px. Evidence: `stage-6.2c/responsive.json` and 121 PNG screenshots. Those screenshots predate only the GST-037 authentication-content update and are not used as evidence for that updated sign-in content.

## ProductCard layout correction

- The main Menu uses a two-column `minmax(0, 1fr)` grid at 360, 375, 390, 430, 480 and inside the existing desktop Guest canvas at 1440px.
- Recommendation cards remain in an independent horizontal carousel with horizontal overflow contained inside the carousel.
- ProductCard titles and descriptions are presentation-clamped to two lines; source domain strings remain unchanged and Product Detail still exposes the full content.
- Weight and price are presented together, for example `220 г · 890 ₽`.
- The Favourite action is positioned over media while retaining the existing 44px Tier 1 target. CTA remains the existing Tier 1 `size="l"` at 48px.
- Cards in a Menu row and all cards in one recommendation carousel have matching measured heights. Page horizontal overflow is absent at every measured viewport.
- Detailed measurements and screenshot inventory: `stage-6.2c/PRODUCT_CARD_LAYOUT.md` and `stage-6.2c/product-card-layout.json`.

## GST-034 resolution

The accepted product decision was implemented locally in demo/frontend state using the existing domain `User` abstraction:

- global MIRA LINK authentication is stored independently from the restaurant guest/session;
- sign-in does not create a restaurant session;
- anonymous favourite actions open GST-037 and do not mutate favourites;
- successful sign-in resumes the pending favourite/account action;
- dish favourites are scoped to the authenticated user;
- restaurant sessions, orders, Split, payment and financial commands are unchanged.

The architecture audit and implementation details are recorded in `stage-6.2c/FAVOURITES_DECISION.md`.

## Test expectation changes in this decision

- `tests/e2e/guest-theme.spec.ts`: changed from anonymous save/view/remove to the accepted GST-034 contract: anonymous GST-037 with no mutation, existing-user sign-in, resumed save, zero restaurant sessions/guests, view and removal. The save/view/remove business result remains asserted.
- `tests/e2e/cycle.spec.ts`: scoped the final cashback `accrual` visibility locator to the first matching entry because global authentication correctly produces multiple entries across tabs in the same browser context. Equal Split, successful payments and cashback remain asserted; no financial expectation changed.

## Files changed for the GST-034 decision

- `components/demo-app.tsx`
- `tests/e2e/guest-theme.spec.ts`
- `tests/e2e/cycle.spec.ts`
- `docs/QA/STAGE_6_E2E_PROGRESS.md`
- `docs/QA/stage-6.2c/FAVOURITES_DECISION.md`
- `docs/QA/stage-6.2c/favourites-targeted.json`
- `docs/QA/stage-6.2c/cashback-targeted.json`
- `docs/QA/stage-6.2c/auth-session-related.json`
- `docs/QA/stage-6.2c/auth-session-related-final.json`
- `docs/QA/stage-6.2c/full-auth-final.json`

No backend/API contract, domain engine, financial logic, Split logic, payment logic, order logic, approved navigation, Foundation token or Design System geometry was changed.

## Non-failing observations

The dev server still logs pre-existing React hydration warnings for browser-dependent Nearby distance precision and Radix-generated inline style serialization. They did not fail any of the 38 E2E tests and were outside these scoped corrections.

---

# Previous Stage 6.2C checkpoint — superseded

# Stage 6.2C — final verified checkpoint

Status: **PARTIAL**. Stage 7 was not started.

## Verification summary

- TypeScript: **PASS**, exit 0.
- Unit tests: **23/23 PASS**, exit 0; skipped 0.
- Targeted responsive E2E (`design: 360/375/390/430px`): **4/4 PASS**, exit 0.
- Full Chromium E2E: **31/32 PASS**, 1 FAIL, exit 1; skipped 0; retries 0; flaky 0. Evidence: `stage-6.2c/full-final.json`.
- All nine financial/cross-role cycle scenarios passed. No financial assertion or domain outcome was weakened.

## ProductCard and touch targets

- ProductCard remains on the accepted Tier 1 `Button size="l"` (48px); no further ProductCard change was made in this continuation.
- Direct ProductCard measurements pass at 360, 375, 390, 430, 480 and 1440px: actions are 48px high, contained by the card, and content fits. Evidence: `stage-6.2c/card-dimensions.json`.
- GST-037 failed because the Base UI Sheet close element only contained a 16px icon. The Design System BottomSheet now applies the existing `miraTokens.control.hitAreaMin` (44px) locally through `data-slot="sheet-close"`; generic Sheet/modal geometry is unchanged.
- The strict responsive suite exposed additional existing Guest touch-targets after each earlier blocker cleared. Order submit, VenueCard, EventCard, PromotionCard, Split/Payment actions and Tips controls now use existing 44/48px targets. Their business callbacks and component APIs are unchanged.

## Responsive QA

- Final-code browser QA covered Home, Menu, Product Detail, Order, Bill, Split, Nearby, Events, Promotions and More at 360, 375, 390, 430, 480 and desktop 1440px (Guest canvas 478px).
- Result: **60/60 screen/viewport combinations PASS**.
- Horizontal overflow failures: 0. Clipping failures outside intentional horizontal scroll containers: 0. Touch-target failures: 0. Bottom navigation stayed inside the Guest canvas at every viewport. Fixed/sticky geometry is recorded.
- `stage-6.2c/responsive.json` contains the measurements. The final screenshot set contains **121 current PNG files**: full-page and viewport screenshots for all 60 combinations plus GST-037.
- Manual inspection sampled final 360px Home, 390px Product Detail, 480px Order and desktop More screenshots. No additional blocker was found.

## Remaining failure

- Test ID: `tests/e2e/guest-theme.spec.ts:17:1` — `dish favorites can be saved, viewed and removed without a table session`.
- Screen: Guest Favourites / GST-034, entered through GST-037.
- Classification: **PRODUCT DECISION REQUIRED**; relates to Stage 6.2C and remains intentionally unresolved.
- Cause: current supported authentication is created only by `enterTableByToken`, which creates or joins a restaurant session before assigning `userId`. The product currently has no independent account-authentication entry for an authenticated user without a restaurant session.
- The test remains enabled and unchanged; it was not skipped, weakened or supplied fake authentication. Anonymous Menu → More → Favourites displays GST-037 and leaves serialized domain state unchanged.
- Evidence: `stage-6.2c/FAVOURITES_DECISION.md`, `stage-6.2c/anonymous-gst037.png`, and `stage-6.2c/full-final-artifacts/`.

## Files changed in Stage 6.2C

- `components/patterns/index.tsx`
- `components/ui/sheet.tsx`
- `components/design-system/index.tsx`
- `components/design-system/styles.module.css`
- `components/guest/screens/guest-cart-screen.tsx`
- `components/guest/screens/guest-split-screen.tsx`
- `components/guest/screens/guest-payment-screen.tsx`
- `components/guest/screens/guest-tips-screen.tsx`
- `app/guest-design-system.css`
- `docs/QA/STAGE_6_E2E_PROGRESS.md`
- `docs/QA/stage-6.2c/FAVOURITES_DECISION.md`
- `docs/QA/stage-6.2c/responsive.mjs`
- Generated QA artifacts under `docs/QA/stage-6.2c/`: `full-final.json`, `responsive.json`, `card-dimensions.json`, failure trace/context and 121 PNG screenshots.

No E2E test, financial logic, domain logic, approved navigation, Design System token value or global Design System control geometry changed in Stage 6.2C.

## Non-failing observation

The dev server logged React hydration warnings for browser-dependent Nearby distance precision and Radix-generated style serialization. They did not fail E2E and were not changed during this scoped correction.

---

# Previous completed checkpoint — controlled technical corrections

FULL E2E: 27/32 PASS; 5 FAIL. EXIT CODE: 1. Skipped: 0; retries: 0; flaky: 0.
TYPECHECK: PASS, exit 0. UNIT TESTS: 23/23 PASS, exit 0.
All 32 tests completed; no process is being left to finish after this report.
Stage 6 is not complete. Stage 7 not started.

Evidence: controlled-full.log, controlled-full.json, controlled-typecheck.log, controlled-unit.log.
Failure traces and snapshots: controlled-full-artifacts/.
Per-test change justification and exact diffs: CONTROLLED_TEST_EXPECTATION_CHANGES.md.

## Remaining failures

- `design.spec.ts:3` — **design: 360px, existing screens and touch targets**: ProductCard action Button uses approved medium size 40px; strict mobile touch target requires >=43.5px. Six Select dish actions fail on /demo/full-cycle. Design System lookup is repaired; changing the approved Pattern or lowering the assertion was not authorized.
- `design.spec.ts:3` — **design: 375px, existing screens and touch targets**: ProductCard action Button uses approved medium size 40px; strict mobile touch target requires >=43.5px. Six Select dish actions fail on /demo/full-cycle. Design System lookup is repaired; changing the approved Pattern or lowering the assertion was not authorized.
- `design.spec.ts:3` — **design: 390px, existing screens and touch targets**: ProductCard action Button uses approved medium size 40px; strict mobile touch target requires >=43.5px. Six Select dish actions fail on /demo/full-cycle. Design System lookup is repaired; changing the approved Pattern or lowering the assertion was not authorized.
- `design.spec.ts:3` — **design: 430px, existing screens and touch targets**: ProductCard action Button uses approved medium size 40px; strict mobile touch target requires >=43.5px. Six Select dish actions fail on /demo/full-cycle. Design System lookup is repaired; changing the approved Pattern or lowering the assertion was not authorized.
- `guest-theme.spec.ts:17` — **dish favorites can be saved, viewed and removed without a table session**: Favorites is included in guestAccountPages; anonymous navigation opens AccountEntrySheet, so the saved dish heading is not visible. Test still requires save/view/remove without a table session. Changing authentication rules or deleting this business requirement would exceed the approved correction.

## Changes in this controlled pass

- components/design-system/index.tsx: one size-class mapping expression, verified against existing sizeS/sizeM/sizeL exports.
- components/demo-app.tsx: delay initial account-route guard until demo-device restoration completes; no account rule or domain command changed.
- components/guest/screens/guest-payment-screen.tsx: restore anonymous bonus eligibility explanation.
- tests/e2e/cycle.spec.ts, design.spec.ts, guest-service.spec.ts, guest-theme.spec.ts, nearby.spec.ts: documented current-architecture bindings; all 32 scenarios retained, financial assertions preserved.
- No CSS, tokens, Foundations, Patterns, domain logic or Playwright configuration changed in this pass.

Earlier local corrections (already present when controlled pass started): local product images, enum-to-label payment boundary, payment result preservation, Bill financial status.

## Verification sequence

1. Targeted original failures: 11/21 PASS, exit 1 (controlled-targeted.log).
2. Targeted followup after local fixes: 5/5 PASS, exit 0 (controlled-targeted-followup.log).
3. Full suite: 27/32 PASS, 5 failures, exit 1; exact JSON stats available.
4. TypeScript and unit tests executed after full suite: PASS.

All 9 cycle.spec business scenarios passed, including Split, cash/POS, failed payment retry, partial payment, equal split/cashback, all-rest payment, session protection, forced close, reset and tips. Nearby session-isolation tests passed. This does not make the 5 remaining scenarios successful.

Responsive: existing strict touch checks fail at 360/375/390/430; existing 480px viewport and desktop tests pass. This is not a full manual responsive QA matrix. No claim of complete visual readiness. Previous instruction schedules further responsive QA after a successful full E2E, so it was not started here.

## Exact next command

No test run is currently needed before deciding the two remaining contracts. Read the recorded errors:

```sh
cd '/Users/arturgamzatov/Documents/ChatGPT/MIRA LINK/mira-link'
cat docs/QA/STAGE_6_E2E_PROGRESS.md
```

After an authorized fix for the remaining ProductCard touch-target / anonymous Favorites requirements, run only:

```sh
npm run test:e2e -- --grep 'design: (360|375|390|430)px|dish favorites' --max-failures=0 > docs/QA/remaining-targeted.log 2>&1
```

Then rerun full suite only if changes warrant it; preserve logs outside test-results.

---

# Historical checkpoints (superseded by the completed results above)

# Stage 6 E2E progress

## Baseline evidence

21 error-context artifacts and .last-run.json copied to docs/QA/stage-6-e2e-baseline/. Previous full stdout/JSON and process exit code are unavailable: output was redirected inside test-results, which Playwright clears. Previously stated 11/32 was inferred by subtraction, not verified from a final reporter.

## Original 21 failures

| Test | Exact error | Cause / category | Component | Proposed correction |
|---|---|---|---|---|
| cycle.spec.ts >> Guest → Waiter → Admin, callbacks, close and additional tips | <br>Test timeout of 45000ms exceeded.<br><br><br><br>Error: locator.click: Test timeout of 45000ms exceeded.<br>Call log:<br>  - waiting for locator('.split-disclosure>summary')<br><br> | Stale expectation: Split is now an always-visible section | GuestSplitScreen / Bill | Use visible heading and mode controls, preserve allocation assertions |
| cycle.spec.ts >> POS failure and retry; anonymous limitations | <br>Test timeout of 45000ms exceeded.<br><br><br><br>Error: locator.click: Test timeout of 45000ms exceeded.<br>Call log:<br>  - waiting for locator('.split-disclosure>summary')<br><br> | Stale expectation: Split is now an always-visible section | GuestSplitScreen / Bill | Use visible heading and mode controls, preserve allocation assertions |
| cycle.spec.ts >> active session protection and cross-tab stop list | <br>Error: locator.click: Error: strict mode violation: getByRole('button', { name: 'Меню', exact: true }) resolved to 2 elements:<br>    1) <button type="button" class="button outline small">…</button> aka getByRole('button', { name: 'Меню' }).first()<br>    2) <button>…</button> aka getByRole('navigation', { name: 'Основная навигация гостя' }).getByRole('button', { name: 'Меню' })<br><br>Call log:<br>  - waiting for getByRole('button', { name: 'Меню', exact: true })<br><br> | Stale unscoped locator: two Menu navigation controls | GuestContent | Scope to primary Guest navigation |
| cycle.spec.ts >> cash remains unpaid until POS confirmation | <br>Test timeout of 45000ms exceeded.<br><br><br><br>Error: locator.click: Test timeout of 45000ms exceeded.<br>Call log:<br>  - waiting for locator('.split-disclosure>summary')<br><br> | Stale expectation: Split is now an always-visible section | GuestSplitScreen / Bill | Use visible heading and mode controls, preserve allocation assertions |
| cycle.spec.ts >> failed payment and reorder after payment | <br>Test timeout of 45000ms exceeded.<br><br><br><br>Error: locator.click: Test timeout of 45000ms exceeded.<br>Call log:<br>  - waiting for locator('.split-disclosure>summary')<br><br> | Stale expectation: Split is now an always-visible section | GuestSplitScreen / Bill | Use visible heading and mode controls, preserve allocation assertions |
| cycle.spec.ts >> marketing off, service on and one guest pays all | <br>Test timeout of 45000ms exceeded.<br><br><br><br>Error: locator.click: Test timeout of 45000ms exceeded.<br>Call log:<br>  - waiting for getByRole('switch', { name: 'Маркетинговые уведомления', exact: true })<br><br> | Stale route: consent moved to Communication Settings | GuestProfileScreen / Services | Navigate via Notifications; retain marketing/service assertions |
| cycle.spec.ts >> three guests, partial cashback and equal split | <br>Test timeout of 45000ms exceeded.<br><br><br><br>Error: locator.click: Test timeout of 45000ms exceeded.<br>Call log:<br>  - waiting for locator('.split-disclosure>summary')<br><br> | Stale expectation: Split is now an always-visible section | GuestSplitScreen / Bill | Use visible heading and mode controls, preserve allocation assertions |
| design.spec.ts >> audit: local media, menu empty state and guest navigation | <br>Error: expect(locator).toHaveJSProperty(expected) failed<br><br>Locator: locator('.dish-image').first()<br>Expected: true<br>Timeout: 5000ms<br>Error: element(s) not found<br><br>Call log:<br>  - Expect "toHaveJSProperty" locator('.dish-image').first() with timeout 5000ms<br>  - waiting for locator('.dish-image').first()<br><br> | Stale CSS selector AND missing local image prop | GuestHome / GuestContent Menu | Pass menuPresentation(product).image; assert real image and filtering |
| design.spec.ts >> audit: venue details and nested navigation stay in the existing Guest | <br>Error: expect(locator).toHaveAttribute(expected) failed<br><br>Locator:  getByRole('navigation', { name: 'Основная навигация гостя' }).getByRole('button', { name: 'Главная', exact: true })<br>Expected: "page"<br>Received: ""<br>Timeout:  5000ms<br><br>Call log:<br>  - Expect "toHaveAttribute" getByRole('navigation', { name: 'Основная навигация гостя' }).getByRole('button', { name: 'Главная', exact: true }) with timeout 5000ms<br>  - waiting for getByRole('navigation', { name: 'Основная навигация гостя' }).getByRole('button', { name: 'Главная', exact: true })<br>    14 × locator resolved to <button>…</button><br>       - unexpected value "null"<br><br> | Stale architecture: Menu is now a primary nav item | guestPrimaryNavigation | Assert Menu active, retain Venue to Booking flow |
| design.spec.ts >> design: 360px, existing screens and touch targets | <br>Error: /demo/full-cycle<br><br>expect(received).toEqual(expected) // deep equality<br><br>- Expected  -  1<br>+ Received  + 11<br><br>- Array []<br>+ Array [<br>+   "Открыть меню ",<br>+   "Смотреть всё →",<br>+   "Выбрать блюдо",<br>+   "Выбрать блюдо",<br>+   "Выбрать блюдо",<br>+   "Выбрать блюдо",<br>+   "Выбрать блюдо",<br>+   "Выбрать блюдо",<br>+   "Оформить →",<br>+ ]<br> | Application / DS defect: size class lookup is lowercase (sizem/sizel), CSS exports sizeM/sizeL | GuestHome / Guest pattern integration | Correct Button size-to-class mapping only with explicit DS exception; then evaluate touch contract |
| design.spec.ts >> design: 375px, existing screens and touch targets | <br>Error: /demo/full-cycle<br><br>expect(received).toEqual(expected) // deep equality<br><br>- Expected  -  1<br>+ Received  + 11<br><br>- Array []<br>+ Array [<br>+   "Открыть меню ",<br>+   "Смотреть всё →",<br>+   "Выбрать блюдо",<br>+   "Выбрать блюдо",<br>+   "Выбрать блюдо",<br>+   "Выбрать блюдо",<br>+   "Выбрать блюдо",<br>+   "Выбрать блюдо",<br>+   "Оформить →",<br>+ ]<br> | Application / DS defect: size class lookup is lowercase (sizem/sizel), CSS exports sizeM/sizeL | GuestHome / Guest pattern integration | Correct Button size-to-class mapping only with explicit DS exception; then evaluate touch contract |
| design.spec.ts >> design: 390px, existing screens and touch targets | <br>Error: /demo/full-cycle<br><br>expect(received).toEqual(expected) // deep equality<br><br>- Expected  -  1<br>+ Received  + 11<br><br>- Array []<br>+ Array [<br>+   "Открыть меню ",<br>+   "Смотреть всё →",<br>+   "Выбрать блюдо",<br>+   "Выбрать блюдо",<br>+   "Выбрать блюдо",<br>+   "Выбрать блюдо",<br>+   "Выбрать блюдо",<br>+   "Выбрать блюдо",<br>+   "Оформить →",<br>+ ]<br> | Application / DS defect: size class lookup is lowercase (sizem/sizel), CSS exports sizeM/sizeL | GuestHome / Guest pattern integration | Correct Button size-to-class mapping only with explicit DS exception; then evaluate touch contract |
| design.spec.ts >> design: 430px, existing screens and touch targets | <br>Error: /demo/full-cycle<br><br>expect(received).toEqual(expected) // deep equality<br><br>- Expected  -  1<br>+ Received  + 11<br><br>- Array []<br>+ Array [<br>+   "Открыть меню ",<br>+   "Смотреть всё →",<br>+   "Выбрать блюдо",<br>+   "Выбрать блюдо",<br>+   "Выбрать блюдо",<br>+   "Выбрать блюдо",<br>+   "Выбрать блюдо",<br>+   "Выбрать блюдо",<br>+   "Оформить →",<br>+ ]<br> | Application / DS defect: size class lookup is lowercase (sizem/sizel), CSS exports sizeM/sizeL | GuestHome / Guest pattern integration | Correct Button size-to-class mapping only with explicit DS exception; then evaluate touch contract |
| guest-service.spec.ts >> all sixteen dishes have local photos and recipes in Guest, Waiter and Admin | <br>Error: expect(locator).toHaveCount(expected) failed<br><br>Locator:  locator('.product-card img')<br>Expected: 16<br>Received: 0<br>Timeout:  5000ms<br><br>Call log:<br>  - Expect "toHaveCount" locator('.product-card img') with timeout 5000ms<br>  - waiting for locator('.product-card img')<br>    14 × locator resolved to 0 elements<br>       - unexpected value "0"<br><br> | Stale CSS selector AND missing local image prop | GuestHome / GuestContent Menu | Pass menuPresentation(product).image; assert real image and filtering |
| guest-service.spec.ts >> waiter order joins the current session and leaves the guest cart intact | <br>Error: expect(locator).toBeVisible() failed<br><br>Locator: getByText('Буррата с томатами × 1', { exact: true })<br>Expected: visible<br>Timeout: 5000ms<br>Error: element(s) not found<br><br>Call log:<br>  - Expect "toBeVisible" getByText('Буррата с томатами × 1', { exact: true }) with timeout 5000ms<br>  - waiting for getByText('Буррата с томатами × 1', { exact: true })<br><br> | Stale combined text: title and quantity are separate nodes | GuestCartScreen | Assert title and quantity in the same row, preserve cart-state assertion |
| guest-theme.spec.ts >> admin theme picker previews and applies to Guest, including portals | <br>Error: expect(locator).toHaveAttribute(expected) failed<br><br>Locator:  getByRole('dialog')<br>Expected: "ivory_gold"<br>Received: ""<br>Timeout:  5000ms<br><br>Call log:<br>  - Expect "toHaveAttribute" getByRole('dialog') with timeout 5000ms<br>  - waiting for getByRole('dialog')<br>    14 × locator resolved to <div role="dialog" tabindex="-1" data-state="open" id="radix-_R_thi_" data-slot="sheet-content" aria-labelledby="radix-_R_thiH1_" aria-describedby="radix-_R_thiH2_" class="fixed z-50 flex flex-col gap-4 bg-background shadow-lg transition ease-in-out data-[state=closed]:animate-out data-[state=closed]:duration-300 data-[state=open]:animate-in data-[state=open]:duration-500 inset-x-0 bottom-0 h-auto border-t data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom _sheet_sqpyu_6…>…</div><br>       - unexpected value "null"<br><br> | Contract conflict: legacy ivory_gold vs approved MiraMode | GuestBottomSheet / GuestTheme | Verify approved semantic mode; do not change DS tokens |
| guest-theme.spec.ts >> all themes preserve guest geometry and domain state at 390px | <br>Test timeout of 45000ms exceeded.<br><br><br><br>Error: locator.evaluate: Test timeout of 45000ms exceeded.<br>Call log:<br>  - waiting for locator('.popular-dish img').first()<br><br> | Stale CSS selector AND missing local image prop | GuestHome / GuestContent Menu | Pass menuPresentation(product).image; assert real image and filtering |
| guest-theme.spec.ts >> dish favorites can be saved, viewed and removed without a table session | <br>Test timeout of 45000ms exceeded.<br><br><br><br>Error: locator.click: Test timeout of 45000ms exceeded.<br>Call log:<br>  - waiting for getByRole('button', { name: 'Избранное: Буррата с томатами', exact: true })<br><br> | Stale accessible name and account-gated Favorites | GuestHome / guestAccountPages | Use current name; verify approved auth gate separately |
| nearby.spec.ts >> Nearby fallback, search and map selection share six venues | <br>Error: expect(locator).toHaveCount(expected) failed<br><br>Locator:  locator('.nearby-list article')<br>Expected: 6<br>Received: 0<br>Timeout:  5000ms<br><br>Call log:<br>  - Expect "toHaveCount" locator('.nearby-list article') with timeout 5000ms<br>  - waiting for locator('.nearby-list article')<br>    14 × locator resolved to 0 elements<br>       - unexpected value "0"<br><br> | Stale element selector: wrapper is div[data-venue-id] | Nearby | Use data-venue-id/data-distance; preserve sorting and location assertions |
| nearby.spec.ts >> Nearby uses granted geolocation to recalculate distances | <br>Error: expect(locator).toHaveAttribute(expected) failed<br><br>Locator: locator('.nearby-list article').first()<br>Expected: "ember"<br>Timeout: 5000ms<br>Error: element(s) not found<br><br>Call log:<br>  - Expect "toHaveAttribute" locator('.nearby-list article').first() with timeout 5000ms<br>  - waiting for locator('.nearby-list article').first()<br><br> | Stale element selector: wrapper is div[data-venue-id] | Nearby | Use data-venue-id/data-distance; preserve sorting and location assertions |
| nearby.spec.ts >> menu categories use two rows and preserve filtering at 390px | <br>Error: expect(locator).toHaveCount(expected) failed<br><br>Locator:  locator('.product-card')<br>Expected: 16<br>Received: 0<br>Timeout:  5000ms<br><br>Call log:<br>  - Expect "toHaveCount" locator('.product-card') with timeout 5000ms<br>  - waiting for locator('.product-card')<br>    14 × locator resolved to 0 elements<br>       - unexpected value "0"<br><br> | Stale CSS selector AND missing local image prop | GuestHome / GuestContent Menu | Pass menuPresentation(product).image; assert real image and filtering |

## Shared causes

- 5 removed Split-disclosure selectors; Payment is not reached.
- 4 touch target failures.
- 4 legacy product/image selectors plus missing image prop.
- 2 Nearby article selectors.
- 6 separate navigation, consent, cart anatomy, theme and Favorites contracts.
- No environment-caused assertion established among the 21. Separate environment issue: report path inside cleaned output directory; dev 3000 conflicts with configured server 5173.

## Current state

No tests/config edited. No full run started in this corrective pass. Awaiting user decision on updating obsolete expectations without removing domain assertions.

## Next command

```sh
cd '/Users/arturgamzatov/Documents/ChatGPT/MIRA LINK/mira-link'
cat docs/QA/STAGE_6_E2E_PROGRESS.md
```

Next work: restore local image props and diagnose Payment method mapping before targeted checks.

## Corrections made in this pass

- `components/guest-home.tsx`: supply local `menuPresentation(p).image` to existing ProductCard; use existing `size="l"` for direct Guest Home / FloatingCart Button usages.
- `components/demo-app.tsx`: supply local image to Menu ProductCard; preserve `pending.method` as the domain enum at the presentation boundary instead of translating it prematurely.
- `components/guest/screens/guest-payment-screen.tsx`: type pending method as `'online' | 'cash'`; translate only the displayed summary. This restores the online confirmation controls previously hidden by comparing Russian text with `'online'`.
- Typecheck after these changes: PASS, exit 0.
- No domain engine, Design System, Patterns, test files or Playwright config modified.

## Targeted verification

Only 10 directly affected existing tests selected. Command:

```sh
npm run test:e2e -- --grep 'design: (360|375|390|430)px|all sixteen dishes|local media|all themes preserve|menu categories|cash remains|failed payment' --max-failures=0
```

Persistent journal: `docs/QA/targeted-integration.log` (outside Playwright's cleaned output directory).
The old Split selectors block the payment scenarios before they reach the corrected screen; a failure at that selector cannot validate or invalidate the method-mapping fix.

## Pending contract decision

Question sent to user: permit narrowly justified selector/expectation updates for the approved architecture while preserving all business assertions, or leave tests unchanged and report blockers. No answer assumed.

## Additional verified Payment defect

Browser execution reached the real online payment through the current Split and Radio controls. Confirmation buttons are now visible and the callback pays the bill. However, when the reservation becomes paid, `part` disappears and the host unmounted all payment result UI. Corrected in `components/demo-app.tsx`: display current financial status from calculateBill for every status, and retain existing payment result cards when no reserved part remains. No parallel state or financial calculations added.

Browser recheck after reload: `Оплачен`, `890,00 ₽ · Онлайн`, `Оплата подтверждена`, remaining `0,00 ₽` all present.
Home local image check: all 6 img elements have complete=true and naturalWidth>0, with /images/... URLs.

## Targeted result 1 (completed)

10 selected, 0 passed, 10 failed; exit code 1. Full log: docs/QA/targeted-integration.log.
Payment tests still stop at removed .split-disclosure before reaching the corrected logic. Image tests still stop at legacy CSS selectors. Touch-target failures remain for all 9 listed actions. Setting size=l at the host did not affect geometry: DS mapping is defective (see correction below).

ProductCard control size is internal to the approved Pattern API (no size prop). Changing that implementation or overriding its geometry would conflict with the instruction not to change approved Patterns. Needs an explicit contract decision; do not disguise as a passing test by lowering its threshold.

## Targeted result 2

Running only force-close and failed-payment/reorder after restoring financial result presentation. Journal: docs/QA/targeted-payment-result.log. Read the final EXIT_CODE marker before claiming completion.

## Exact next command

```sh
cd '/Users/arturgamzatov/Documents/ChatGPT/MIRA LINK/mira-link'
tail -80 docs/QA/targeted-payment-result.log
```

After this finishes, await the user's decision on outdated test expectations. Do not run full E2E until known blockers are addressed. Responsive QA of this corrective pass has not started, as user requested it only after successful E2E.

## Final checkpoint of this pass

- Targeted 1: 0/10 passed, 10 failed, exit 1; full log saved.
- Targeted 2: 1/2 passed (force close), 1 failed (failed payment and reorder, stale Split locator), exit 1; full log saved.
- Typecheck: PASS after latest source changes. Unit tests: 23/23 PASS, docs/QA/unit-after-local-fixes.log.
- Full 32-test run NOT started in this pass: known contract blockers remain.
- Responsive QA NOT performed in this pass: prerequisite successful E2E not met.
- Source changed: components/guest-home.tsx, components/demo-app.tsx, components/guest/screens/guest-payment-screen.tsx.
- Business logic, architecture, Design System, Patterns, tests and config unchanged.

### Corrected diagnosis for the 4 touch failures

`components/design-system/index.tsx:21` uses `styles[`size${size}`]`, where size is s/m/l. CSS exports `.sizeS`, `.sizeM`, `.sizeL`. All lookups therefore resolve to undefined. Passing size=l does not fix it. This is a real DS implementation bug, not proof that the approved 40px token should be changed. Earlier default-size diagnosis was incomplete.

Prepared minimal proposed fix (NOT applied due explicit prohibition): replace the lookup with `{s:styles.sizeS,m:styles.sizeM,l:styles.sizeL}[size]`. No token values or API changes. Afterwards the separate 40px Pattern button vs 44px Guest touch-target contract still needs verification; do not lower test threshold silently.

### Required decisions before further dependent work

1. Permit semantic selector/expectation updates for obsolete tests while preserving domain assertions (question already sent).
2. Permit the one-line DS class mapping bugfix above. Current user instruction explicitly forbids DS modifications.

### Exact resume command

```sh
cd '/Users/arturgamzatov/Documents/ChatGPT/MIRA LINK/mira-link'
cat docs/QA/STAGE_6_E2E_PROGRESS.md
```

After explicit permission for the DS mapping fix, apply only that mapping then run the directly affected checks (after stopping a confirmed project dev 3000 process if present):

```sh
npm run test:e2e -- --grep 'design: (360|375|390|430)px' --max-failures=0 > docs/QA/targeted-button-sizing.log 2>&1
```

Do not run a full suite or claim readiness until the stale-contract decisions and remaining known defects are resolved.

## Controlled corrections — user authorization received

User explicitly authorized the size-class mapping fix and semantically justified E2E updates. No test is deleted/skipped, financial outcomes remain unchanged.

- Confirmed CSS exports sizeS/sizeM/sizeL, while Button used lowercase dynamic lookup. Applied only explicit size mapping in components/design-system/index.tsx. No CSS/tokens/Foundations changed.
- Updated legacy Split selectors to existing visible Split headings and controls; online/cash buttons to current Radio controls; success label to the current StatusBadge text. Paid/unpaid, partial payment, POS confirmation, cash pending, cashback, close/reset, tips assertions retained.
- Scoped Guest Menu navigation; updated local image and Nearby wrapper selectors; primary navigation expectation now Menu.
- Targeted baseline 21: 11 passed, 10 failed, exit 1. Complete journal: docs/QA/controlled-targeted.log.
- Found real direct-route account hydration bug: account gate ran before sessionStorage guest restoration. Added presentation readiness guard (deviceReady), without parallel account/domain state or auth-rule changes.
- Restored anonymous bonus eligibility explanation in GuestPaymentScreen.
- Updated stale stop-list button label (disabled/reenabled assertions retained), consent navigation, authenticated audit prerequisite, empty-history punctuation, and Review auth-gate presentation (form absence asserted).
- Legacy shell theme still must apply in Admin/Guest; migrated product portal is asserted against approved Brand Dark semantic surface (#0D3022), not legacy ivory_gold. No application theme changes.
- Second targeted set covers only the 5 followup scenarios; log: docs/QA/controlled-targeted-followup.log.

Known unresolved restrictions: ProductCard internally uses approved 40px Button while existing Guest touch check requires >=43.5px; threshold remains unchanged, Pattern untouched. Anonymous Favorites scenario conflicts with current account gate; no successful anonymous access is fabricated, scenario retained.

### Targeted followup completed

5/5 PASS, exit 0 (51.1s), docs/QA/controlled-targeted-followup.log.

Per-test original/new expectation, reason and preserved business result plus exact diffs: docs/QA/CONTROLLED_TEST_EXPECTATION_CHANGES.md.

Full 32-test command started (no early stop):

```sh
PLAYWRIGHT_JSON_OUTPUT_FILE=docs/QA/controlled-full.json npm run test:e2e -- --max-failures=0 --reporter=list,json > docs/QA/controlled-full.log 2>&1
```

Both reporter files are outside cleaned test-results. Await final JSON stats and EXIT_CODE marker, then TypeScript and unit tests. Known strict touch and anonymous Favorites checks are retained, not skipped or relaxed.
