# Stage 7.4 — Waiter Floor UX Correction

## Status

`PASS`

Stage 7.4 converts the Waiter landing view from a dashboard/demo hierarchy into
a compact operational Floor workspace. Stage 7.3 authentication, Shift,
navigation and domain foundation remain intact.

## Before and after hierarchy

### Stage 7.3

1. Shift/dashboard title.
2. Four large metric cards.
3. Large no-priority Alert.
4. Expanded compatibility/demo operations.
5. Collapsed legacy table disclosure.

### Stage 7.4

1. Compact employee, Venue and Shift header.
2. `Зал` page title.
3. Zone selector built from domain Zones.
4. Compact operational summary.
5. Compact calm/attention state.
6. Assigned Table grid.
7. Read-only Table grid.

Compatibility operations are preserved under `Ещё → Дополнительные операции
демо`. Orders, Calls and Cash no longer render as long duplicate sections on
Floor.

## Measurements at 390 px

All values are browser measurements in CSS pixels. Stage 7.3 was measured
before the implementation with its table disclosure opened so the first Table
could be located.

| Metric | Stage 7.3 | Stage 7.4 |
| --- | ---: | ---: |
| Header height | 105 | 64 |
| Title / Zone block | 52, no Zone selector | 108, including Zone selector |
| Summary height | 190 | 38 |
| Priority block height | 140 | 36 |
| First Table Y | 1155 | 461 |
| Table card W×H | 166×91 | 178×148 |
| Bottom navigation height | 73 | 73 |
| Page horizontal overflow | none | none |

The first Table begins 694 px earlier. The Table card is intentionally taller
than the collapsed legacy card because it now carries status, context and
attention while remaining two columns at mobile widths.

## Zones and Tables

- `Все`, `Основной зал` and `Терраса` are derived from `State.zones`.
- Assigned Zones receive a compact `моя` annotation.
- The current shift assignment determines actionable Tables.
- Unassigned Tables remain visible with dashed read-only presentation.
- Read-only Table Detail contains no mutation action.
- Mobile widths 360–480 px use two columns.
- The constrained 720 px desktop canvas uses three columns.

Table card anatomy:

1. Table number and affordance/read-only icon.
2. Semantic status badge.
3. Operational detail.
4. Bill total when an active Session exists.

## Domain to presentation mapping

This mapping is presentation-only and introduces no new domain status.

| Existing domain state | Floor presentation | Priority |
| --- | --- | ---: |
| unresolved waiter `StaffCall` | `Вызов гостя` / `Вызов принят` | 1 |
| Order `executionStatus=error` | `Ошибка POS` | 1 |
| pending cash Payment | `Ожидаются наличные` | 1 |
| Order `executionStatus=ready` | `Готово к подаче` | 2 |
| submitted/accepted/in_progress Order | order status | 3 |
| active Session without Order | `Занят` | 4 |
| no active Session | `Свободен` | 5 |

The compact attention summary is shown only when an existing Call, ready/error
Order or pending cash Payment is present. The zero state is `Всё спокойно`.

## Table Detail

The Operational Light BottomSheet reads only existing shared state:

- Table and Zone;
- actionable/read-only access;
- active Session and Guest count;
- Orders, items, quantities and execution statuses;
- bill total, paid amount and financial status through `calculateBill`;
- StaffCall and pending cash attention.

An actionable StaffCall uses the existing `staffCallStatus` command with the
current operational actor. Existing order creation and POS/cash controls remain
available through the compatibility operations until their dedicated screen
migrations. No bill or financial state is recalculated by the view.

## Responsive QA

| Viewport | Content width | Columns | Table card W×H | First Table Y | Min target | Overflow |
| ---: | ---: | ---: | ---: | ---: | ---: | --- |
| 360 | 360 | 2 | 163×148 | 461 | ≥44 | none |
| 375 | 375 | 2 | 171×148 | 461 | ≥44 | none |
| 390 | 390 | 2 | 178×148 | 461 | ≥44 | none |
| 430 | 430 | 2 | 198×148 | 432 | ≥44 | none |
| 480 | 480 | 2 | 223×148 | 432 | ≥44 | none |
| 1440 | 718 canvas | 3 | 223×148 | 422 | ≥44 | none |

The fixed bottom navigation remains 73 px on mobile and content retains bottom
padding so actions are not hidden underneath it.

## Verification

| Check | Result |
| --- | --- |
| TypeScript | PASS |
| Unit tests | 46/46 PASS |
| Stage 7.4 targeted E2E | 9/9 PASS |
| Waiter Foundation E2E | 5/5 PASS |
| Guest–Waiter integration | PASS in full suite |
| Design / responsive regression | PASS in full suite |
| Full Chromium E2E | 53/53 PASS |
| Full Chromium exit code | 0 |
| Failed / skipped | 0 / 0 |

The existing non-failing Vite/React hydration warnings and Nearby floating
distance warning remain outside Stage 7.4. They did not fail any assertion.

## Screenshots

- `docs/QA/stage-7.4/floor-390-normal.png`
- `docs/QA/stage-7.4/floor-390-attention.png`
- `docs/QA/stage-7.4/table-detail-390.png`
- `docs/QA/stage-7.4/floor-480.png`
- `docs/QA/stage-7.4/floor-1440.png`

## Changed files

- `components/waiter/waiter-app.tsx`
- `app/waiter-design-system.css`
- `tests/e2e/waiter-helper.ts`
- `tests/e2e/waiter-foundation.spec.ts`
- `tests/e2e/waiter-floor.spec.ts`
- `docs/QA/STAGE_7_4_WAITER_FLOOR.md`
- five screenshot files under `docs/QA/stage-7.4/`

## Boundaries

- Stage 7.3 foundation preserved.
- Guest unchanged.
- Domain business logic unchanged.
- Handoff not implemented.
- DEC-WTR-018–035 remain open.
- Orders detail migration not started.
- Calls detail migration not started.
