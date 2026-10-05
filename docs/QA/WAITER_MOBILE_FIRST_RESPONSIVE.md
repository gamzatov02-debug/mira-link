# MIRA LINK — Waiter Mobile-First Responsive QA

Status: **PASS**  
Date: **2026-10-03**  
Breakpoint contract: **mobile `< 768px`; tablet/desktop `>= 768px`**  
Pre-correction Chromium baseline: **108/108 PASS, 0 failed, 0 skipped**  
Post-correction Chromium baseline: **111/111 PASS, 0 failed, 0 skipped**

## Scope and root cause

The Waiter application already used the physical viewport and already switched Floor, Orders and Calls details to BottomSheet below `768px`. Two shared presentation problems made the mobile result look like a reduced desktop workspace:

1. the Waiter demo header occupied `108–137px` and its desktop navigation overflowed locally by `30–138px` at `360–480px`;
2. compact Waiter shell rules stopped at `560px`, while all workspace detail behavior used the approved `768px` boundary.

The correction keeps one Waiter application and one domain. At `<768px`, the demo controls collapse into a Waiter-only `Демо режимы` disclosure, the Waiter header is compact, the application spans the physical viewport, and the existing fixed Bottom Navigation spans the application width. At `>=768px`, the existing Floor `43/57` and Orders/Calls `40/60` persistent split views remain active.

## Implemented corrections

- Added a Waiter-only compact demo header at `<768px`; Guest, Admin and Full Cycle wrappers were not changed.
- Extended the existing compact Waiter shell contract from `560px` to the approved `<768px` boundary.
- Kept the mobile header to MIRA LINK, employee name and shift status; Venue and shift time remain in state and reappear at `>=768px`.
- Kept Floor at two fluid columns on mobile.
- Kept Orders and Calls as full-width lists with local horizontal filter scrolling and BottomSheet details.
- Increased Orders and Calls filter Chip touch targets to the existing `44px` minimum without changing the Tier 1 component globally.
- Added the required Calls elapsed-time label as a client-only value derived from the existing `StaffCall.createdAt`; no persisted timer or domain field was added.
- Made navigation to the already active Waiter route a no-op. This removes a redundant router transition and prevents a transient zero-layout frame without changing routes or business behavior.

## Final viewport measurements

All values below come from the final browser-rendered targeted suite. `Columns` is shown as `Floor / Orders / Calls`.

| Viewport | App width | Columns | Detail mode | Navigation mode | Horizontal overflow | Clipping | Bottom nav | Minimum touch target |
|---:|---:|---:|---|---|---:|---:|---:|---:|
| 360 × 800 | 360 | 2 / 1 / 1 | BottomSheet | mobile full width | 0 | 0 | 73 | 44 |
| 375 × 812 | 375 | 2 / 1 / 1 | BottomSheet | mobile full width | 0 | 0 | 73 | 44 |
| 390 × 844 | 390 | 2 / 1 / 1 | BottomSheet | mobile full width | 0 | 0 | 73 | 44 |
| 393 × 852 | 393 | 2 / 1 / 1 | BottomSheet | mobile full width | 0 | 0 | 73 | 44 |
| 430 × 932 | 430 | 2 / 1 / 1 | BottomSheet | mobile full width | 0 | 0 | 73 | 44 |
| 480 × 900 | 480 | 2 / 1 / 1 | BottomSheet | mobile full width | 0 | 0 | 73 | 44 |
| 768 × 900 | 736 | 2 / 1 / 1 | persistent split | desktop compact | 0 | 0 | 58 | 44 |
| 1024 × 900 | 992 | 2 / 1 / 1 | persistent split | desktop compact | 0 | 0 | 58 | 44 |
| 1280 × 900 | 1248 | 3 / 1 / 1 | persistent split | desktop compact | 0 | 0 | 58 | 44 |
| 1440 × 900 | 1280 | 3 / 1 / 1 | persistent split | desktop compact | 0 | 0 | 58 | 44 |

Mobile content bottom clearance is `88px`, greater than the rendered `73px` navigation. Tablet/desktop clearance is `82px`, greater than the rendered `58px` navigation. The mobile demo header is `61px` at every tested mobile viewport and has `0px` local navigation overflow.

## Workspace behavior

### Floor

- `360–480px`: two `minmax(0, 1fr)` columns; selected Table opens in BottomSheet.
- `768px+`: the approved `43/57` persistent split remains.
- Assigned, read-only, attention, status, order count and total presentations remain based on the existing workspace projection.

### Orders

- `360–480px`: full-width list; filters scroll only inside the filter container; selected Order opens in BottomSheet.
- `768px+`: the approved `40/60` persistent split remains.
- Order, POS and financial values continue to use the existing Order and Bill entities.

### Calls

- `360–480px`: full-width Inbox; selected Call opens in BottomSheet.
- `768px+`: the approved `40/60` persistent split remains.
- Table, status, attention, time and derived elapsed time are visible. Accept/complete mutations still use the existing `staffCallStatus` command and actor validation.

### More

The existing content uses the same full-width mobile shell and fixed Bottom Navigation. No future Tips, Personal QR, Profile or Shift business logic was introduced.

## Verification

| Check | Result |
|---|---|
| TypeScript | PASS |
| Unit/domain | 46/46 PASS |
| Waiter mobile responsive targeted | 3/3 PASS |
| Active-route stability targeted | 2/2 PASS |
| Existing Waiter Floor/Orders/Calls regression | 60/60 PASS |
| Guest regression | 40/40 PASS |
| Full Chromium final | 111/111 PASS |
| Full Chromium failures / skipped | 0 / 0 |

The first two full runs each ended `110/111` because an existing Floor helper clicked the already active `Зал` route and occasionally sampled the router unmount frame, where every button reported `height: 0`. The same tests passed in isolation. The runtime navigation was corrected to ignore an exact active-route request; both affected tests then passed together, followed by the clean `111/111` full run. Tests and assertions were not weakened.

Logs:

- `docs/QA/waiter-mobile-first/pre-change-floor.log`
- `docs/QA/waiter-mobile-first/targeted-responsive.log`
- `docs/QA/waiter-mobile-first/active-nav-targeted.log`
- `docs/QA/waiter-mobile-first/waiter-regression.log`
- `docs/QA/waiter-mobile-first/guest-regression.log`
- `docs/QA/waiter-mobile-first/full-chromium.log`
- `docs/QA/waiter-mobile-first/full-chromium-final.log`
- `docs/QA/waiter-mobile-first/full-chromium-pass.log`

## Screenshots

Fifteen final full-viewport screenshots were regenerated from the final code:

- Floor: `floor-360.png`, `floor-390.png`, `floor-430.png`, `floor-768.png`, `floor-1440.png`;
- Orders: `orders-360.png`, `orders-390.png`, `order-detail-390.png`, `orders-768.png`, `orders-1440.png`;
- Calls: `calls-360.png`, `calls-390.png`, `call-detail-390.png`, `calls-768.png`, `calls-1440.png`.

Location: `docs/QA/waiter-mobile-first/`.

## Files changed

- `app/globals.css`
- `app/waiter-design-system.css`
- `components/demo-app.tsx`
- `components/waiter/waiter-app.tsx`
- `tests/e2e/waiter-mobile-responsive.spec.ts`
- `docs/QA/STAGE_7_6A_WAITER_CALLS.md`
- `docs/QA/WAITER_MOBILE_FIRST_RESPONSIVE.md`
- `docs/QA/waiter-mobile-first/*` QA evidence

No domain model, command, financial calculation, Guest runtime, POS contract, Order contract or StaffCall contract was changed.

## Final status

`WAITER MOBILE MODE — PASS`

`WAITER TABLET MODE — PASS`

`WAITER DESKTOP MODE — PASS`

`FLOOR PRESERVED`

`ORDERS PRESERVED`

`CALLS PRESERVED`

`GUEST UNCHANGED`

`DOMAIN UNCHANGED`

`FINANCIAL LOGIC UNCHANGED`
