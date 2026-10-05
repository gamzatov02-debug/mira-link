# Stage 7.3 — Waiter UI Foundation

## Status

`PASS`

Stage 7.3 establishes the Waiter presentation foundation on top of the approved
Stage 7.1 domain foundation and Stage 7.2 operational integration. It does not
start the detailed migration of the remaining Waiter screens.

The historical implementation plan used Stage 7.3 for Orders. The executed
sequence already assigned Stage 7.1 to the domain foundation and Stage 7.2 to
operational integration, so this delivery records Stage 7.3 as the UI
foundation required before individual operational screens can be migrated.

## Delivered scope

- WTR-001 employee login and shift start are separate UI steps.
- Employee authentication does not create a Guest or restaurant session.
- Shift start uses the existing `startShift` domain command.
- Operational Light `WaiterShell` with employee, venue and active-shift context.
- Persistent primary navigation: Floor, Orders, Calls and More.
- Waiter routes:
  - `/demo/waiter`
  - `/demo/waiter/shift`
  - `/demo/waiter/dashboard`
  - `/demo/waiter/floor`
  - `/demo/waiter/orders`
  - `/demo/waiter/calls`
  - `/demo/waiter/more`
- Dashboard counters are derived from the existing `getWaiterWorkspace` selector.
- Shift completion and logout use the existing domain commands.
- Logout with an open shift presents an explicit warning. It does not end the
  shift or transfer work implicitly.
- Existing order, call, POS and cash-payment demo operations remain available in
  the compatibility section until their individual screen migration.

## Architecture

The UI stores only the authenticated employee context identifier in
`sessionStorage`. The authentication context, shift, assignments, orders,
calls and payments remain in the shared domain state. No parallel operational
state was introduced.

Authentication, employee shift and restaurant session remain separate domain
concepts:

1. `authenticateEmployee` creates an employee authentication context.
2. `startShift` creates the operational shift.
3. Neither command creates a restaurant session.

The current demo entry uses the existing active waiter `w1` (Alexander) so the
legacy operational scenarios keep their established assignment context. A
production credential provider is outside this stage.

## Design System and responsive behavior

- Existing Tier 1 Button, Card, Alert, Dialog, EmptyState and StatusBadge
  components are reused in Operational Light mode.
- Waiter-specific CSS is local to the Waiter surface.
- The shell supports 360 px, 390 px, 480 px and 1440 px viewports without
  document horizontal overflow.
- Visible Waiter controls meet the existing minimum touch-target threshold.
- The bottom navigation remains accessible at mobile widths.

## Verification

| Check | Result |
| --- | --- |
| TypeScript | PASS |
| Unit tests | 46/46 PASS |
| Waiter foundation E2E | 5/5 PASS |
| Guest–Waiter integration E2E | 13/13 PASS |
| Design/responsive E2E | 8/8 PASS |
| Full Chromium E2E | 44/44 PASS |
| Full Chromium exit code | 0 |
| Failed / skipped | 0 / 0 |

Responsive evidence is stored in `docs/QA/stage-7.3/`:

- `waiter-shell-360.png`
- `waiter-shell-390.png`
- `waiter-shell-480.png`
- `waiter-shell-1440.png`

## Remaining scope

- Floor, Orders and Calls currently expose connected routes and live summary
  counts. Their detailed WTR screen implementations are not part of this stage.
- WTR-002 through WTR-016 remain subject to their planned screen-by-screen
  implementation and acceptance.
- Personal QR, waiter tips, profile and history screens remain unimplemented.
- DEC-WTR-018 through DEC-WTR-035 remain open unless resolved by an earlier
  approved decision record.
- Shift handoff is not implemented.
- Production employee credentials and backend authentication are not invented
  by the demo UI.

## Regression boundaries

- No Guest UI was migrated or redesigned.
- No Admin UI was changed.
- No financial, order, Split, payment, POS or call business logic was changed.
- No new domain model or duplicate state store was introduced.
- Stage 7.4 was not started.
