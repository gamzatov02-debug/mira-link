# Stage 7.5 — Waiter Floor Split View

## Status

`PASS`

Stage 7.5 extends the accepted Stage 7.4 Floor presentation at tablet and
desktop widths. The mobile Floor, two-column Table grid and Table Detail
BottomSheet remain unchanged. From 768 px the same Floor state is presented as
a persistent master-detail workspace: Floor on the left and the selected Table
detail on the right.

This is a presentation change. It does not add or alter a domain entity,
command, status transition, financial calculation, Guest flow or API.

## Responsive presentation

| Viewport | Floor presentation | Table columns | Detail presentation | Horizontal overflow |
| ---: | --- | ---: | --- | --- |
| 360 | Stage 7.4 mobile | 2 | BottomSheet | none |
| 375 | Stage 7.4 mobile | 2 | BottomSheet | none |
| 390 | Stage 7.4 mobile | 2 | BottomSheet | none |
| 430 | Stage 7.4 mobile | 2 | BottomSheet | none |
| 480 | Stage 7.4 mobile | 2 | BottomSheet | none |
| 768 | 43/57 split workspace | 2 | persistent panel | none |
| 1024 | 43/57 split workspace | 2 | persistent panel | none |
| 1280 | 43/57 split workspace | 3 | persistent panel | none |
| 1440 | max 1280 px workspace, 43/57 split | 3 | persistent panel | none |

The detail panel has its own vertical scroll boundary and ends above the fixed
Waiter navigation. Its content and actions are not obscured by the navigation.

## Selection and access semantics

- A selected Table uses `aria-pressed=true` and an explicit selected border and
  surface treatment.
- Selecting another Table updates the right panel without changing route or
  hiding the Floor.
- Changing Zone clears the selection when the selected Table is no longer in
  the filtered result.
- Unassigned Tables remain inspectable and visibly read-only.
- Read-only detail exposes no mutation action.
- Before the responsive mode is known, a Table click does not incorrectly open
  a desktop BottomSheet.

## Persistent Table Detail

The right panel reads only existing shared state and existing selectors:

- Table and Zone;
- assigned/read-only access;
- current operational Table status;
- active Session, Guest count, opened time and responsible waiter;
- Bill total, paid amount, remaining amount and existing financial status from
  `calculateBill`;
- Orders with creation time, amount, items and execution status;
- unresolved StaffCall with its timestamp;
- pending cash attention.

Existing operational actions retain their existing commands and actor
validation. StaffCall handling still uses `staffCallStatus`. Free assigned
Tables retain the existing order-creation entry. No financial or Order state is
recomputed or duplicated in the component.

## Verified scenarios

1. Empty desktop selection renders an explanatory persistent placeholder.
2. Assigned Table selection renders detail and no modal at 768 px.
3. Zone filtering resets a selection that is no longer visible.
4. Mobile Table selection opens the accepted Stage 7.4 BottomSheet.
5. Unassigned Table is inspectable without mutation controls.
6. Occupied Table preserves the Floor and renders active Session context.
7. Ready Order and pending cash render from existing shared state.
8. StaffCall attention remains visible and actionable.
9. Neutral 1440 px Floor produces no page console error in its dedicated
   assertion.
10. All nine responsive widths have no document horizontal overflow.

## Verification

| Check | Result |
| --- | --- |
| TypeScript | PASS |
| Unit tests | 46/46 PASS |
| Stage 7.5 targeted E2E | 16/16 PASS |
| Guest / Design / ProductCard regression | 34/34 PASS |
| Full Chromium E2E | 69/69 PASS |
| Full Chromium exit code | 0 |
| Failed / skipped | 0 / 0 |

The full run still prints pre-existing non-failing Vite/React hydration
diagnostics involving Radix Switch inline style serialization, Nearby distance
floating-point serialization and an input caret style. They do not originate
from the Waiter split view and did not fail an assertion.

## Screenshots

Seven screenshots were regenerated from the final code:

- `docs/QA/stage-7.5/mobile-floor-390.png`
- `docs/QA/stage-7.5/mobile-table-sheet-390.png`
- `docs/QA/stage-7.5/split-768.png`
- `docs/QA/stage-7.5/occupied-1024.png`
- `docs/QA/stage-7.5/split-1440.png`
- `docs/QA/stage-7.5/read-only-1440.png`
- `docs/QA/stage-7.5/attention-1440.png`

## Changed files

- `components/waiter/waiter-app.tsx`
- `app/waiter-design-system.css`
- `tests/e2e/waiter-split-view.spec.ts`
- `tests/e2e/waiter-floor.spec.ts`
- `tests/e2e/waiter-foundation.spec.ts`
- `docs/QA/STAGE_7_5_WAITER_SPLIT_VIEW.md`
- seven screenshot files under `docs/QA/stage-7.5/`

## Boundaries

- Stage 7.4 foundation preserved.
- Guest unchanged.
- Domain business logic unchanged.
- Mobile BottomSheet preserved.
- Handoff not implemented.
- DEC-WTR-018–035 remain open.
- No Orders, Calls, tips, Personal QR, profile or Shift History migration was
  started by this correction.
