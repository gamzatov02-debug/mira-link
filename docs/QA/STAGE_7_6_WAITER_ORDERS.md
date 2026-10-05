# Stage 7.6 — Waiter Orders Workspace

## Status

**PASS**

Final verification on 2026-10-03:

- TypeScript: PASS
- Unit/domain: 46/46 PASS
- Stage 7.6 targeted: 15/15 PASS
- Related regression: 64/64 PASS
- Full Chromium: 85/85 PASS
- Failures: 0
- Skipped: 0
- Horizontal page overflow: none at every required viewport

The full run log is `docs/QA/stage-7.6/full-chromium.log`. A previous full run produced one transient `boundingBox() === null` in the unchanged Stage 7.5 375px test after the navigation had already been observed as visible. The same test passed immediately without code or test changes and passed again in the final 85/85 full run.

## WTR mapping

| WTR ID | Documented screen | Stage 7.6 implementation |
|---|---|---|
| WTR-005 | Orders queue | `/demo/waiter/orders`, compact derived filters, priority ordering, selected card state and live shared Order list |
| WTR-006 | Order detail | Mobile BottomSheet and persistent tablet/desktop detail with session, items, snapshot amounts, Order subtotal, Session bill and supported service transitions |
| WTR-013 | Staff-created order | `Новый заказ` opens the existing waiter-created Order flow directly through `/demo/waiter/more?create=order`; existing employee/shift/venue/table validation and attribution are retained |
| WTR-014 | POS issue | Inline error block and retry through the existing `DemoPOSAdapter.submitOrder`; retry updates the same Order and does not duplicate it |

Sources: `docs/design-system/MIRA_LINK_WAITER_SCREEN_IMPLEMENTATION.md` §4 and §5; `docs/MIRA_LINK_SCREEN_REGISTRY.md` WTR-005, WTR-006, WTR-013 and WTR-014; `docs/MIRA_LINK_USER_FLOWS.md` WF-01 and WF-04.

## Audited Order capabilities

- `ExecutionStatus`: `created`, `submitted`, `accepted`, `in_progress`, `ready`, `served`, `completed`, `cancelled`, `error`.
- Guest submission creates one shared `Order` in `submitted` and uses snapshot name, quantity, base price, modifier price, modifiers and comment.
- Staff submission already exists and can attribute `placedByWaiterId`, `placedByShiftId` and `placedByVenueId`.
- POS has no separate persisted status entity. Its existing state is represented by the shared Order `executionStatus`.
- `DemoPOSAdapter.submitOrder` moves a submitted/error Order to `accepted` or `error` according to the existing simulator.
- Existing operational service progress supports accepted/in-progress → ready → served through `posStatus`.
- POS mutations accept `OperationalActorContext` and are rejected by the existing actor validator when the shift, venue or table assignment is invalid.
- Session, Table and Zone context are resolved through the Order's existing `sessionId`; financial values use `itemTotal` and `calculateBill`.
- Order items have no independent status/readiness field. Stage 7.6 does not display or create one.
- No cancellation command, cancellation reason, item deletion after submission, handoff or ownership acquisition command exists.
- Existing unit coverage verifies idempotency, waiter attribution, rejected unassigned actors, shared Guest/Waiter state, POS retry and unchanged financial calculations.

## Orders List

The Orders tab now opens the operational list as the primary page content. It uses the shared store directly and includes venue Orders from visible Tables. Orders on assigned Tables are actionable; Orders on unassigned Tables remain inspectable in read-only mode.

Presentation priority is `error` → `ready` → `submitted` → `accepted/in_progress` → other states. No domain status is modified for sorting.

Each compact card shows:

- Order number;
- Table and Zone;
- explicit status text and semantic badge;
- reliable source derived from `placedByWaiterId` (`Официант` or `Гость`);
- total item quantity;
- created time;
- Order subtotal from existing item snapshots;
- explicit `Только просмотр` when the Table is outside the assignment.

Items are intentionally absent from list cards and remain in Order Detail.

## Filters

| Presentation filter | Domain mapping |
|---|---|
| Все | all venue Orders visible through the current workspace context |
| Новые | `executionStatus === submitted` |
| Готовы | `executionStatus === ready` |
| Ошибка POS | `executionStatus === error` |

Counts are derived on render and filters do not create or mutate state. A status transition moves the Order between filters immediately. Selection clears when the selected Order no longer matches the current filter or visible scope, preventing stale detail.

## Mobile Detail

At 360–480px, Order Detail uses the existing Design System BottomSheet. This preserves the approved mobile list context and navigation model. The sheet body is scrollable for long item lists, while supported actions remain in the existing sheet action area. It shows compact status/source metadata without duplicating the full header.

All visible buttons in the mobile sheet meet the existing minimum 44px touch target.

## Tablet and desktop

At 768px and above, Orders use a persistent 40/60 split:

- 40% list, with a 300px minimum;
- 60% detail, with a 400px minimum.

The ratio was chosen because Order cards contain compact triage data, while detail requires wider item, quantity, price, session, finance and POS rows. Selecting an Order updates the sticky right detail without hiding the list or opening an overlay. Nothing is auto-selected, so opening the page or changing filters creates no side effects.

## Order Detail anatomy

- Order number, Table, Zone, created time, source and current status;
- Session guest count, opened time and responsible waiter when available;
- structured item rows with name, quantity, existing modifiers, existing comment and snapshot amount;
- clearly separated `Сумма заказа`, `Счёт посещения`, paid and remaining values;
- current POS/iiko state from the shared Order;
- one primary supported action when applicable.

No absent item status or inferred operational field is rendered.

## POS and supported actions

- `submitted`: `Отправить в iiko` through `DemoPOSAdapter.submitOrder` with the current operational actor;
- `error`: inline WTR-014 error explanation and `Повторить передачу` through the same adapter and same Order ID;
- `accepted` / `in_progress`: `Готово к подаче` through existing `posStatus`;
- `ready`: `Отметить поданным` through existing `posStatus`;
- terminal or unsupported states: no mutation action.

Cancellation and item deletion actions are not rendered. The adapter remains the POS source-of-truth boundary.

## Read-only behavior

Orders on visible unassigned Tables can be opened and read. Card and detail both display `Только просмотр`. POS/service mutations are absent. No `Взять заказ`, `Передать заказ` or `Назначить себе` action was introduced. Existing domain actor validation remains the final mutation guard.

## Cross-role synchronization

Verified in Chromium:

- Guest Order appears in Waiter Orders without refresh or a duplicate cache;
- Waiter Detail reads the same Order and OrderItem entities;
- POS submit, error, retry, ready and served transitions update shared state;
- presentation filters update immediately after shared state transitions;
- existing Floor continues to derive status from the same Orders;
- waiter-created Order appears with reliable `Официант` attribution;
- POS retry retains one Order record.

## Responsive matrix

| Viewport | List | Detail mode | Split | Navigation | Overflow |
|---:|---|---|---|---|---|
| 360 | 1 column, full content width | BottomSheet | — | full-width bottom | none |
| 375 | 1 column, full content width | BottomSheet | — | full-width bottom | none |
| 390 | 1 column, full content width | BottomSheet | — | full-width bottom | none |
| 430 | 1 column, full content width | BottomSheet | — | full-width bottom | none |
| 480 | 1 column, full content width | BottomSheet | — | full-width bottom | none |
| 768 | 1-column list pane | persistent right pane | 40/60 | compact bottom | none |
| 1024 | 1-column list pane | persistent right pane | 40/60 | compact bottom | none |
| 1280 | 1-column list pane | persistent right pane | 40/60 | compact bottom | none |
| 1440 | 1-column list pane | persistent right pane | 40/60 | compact bottom | none |

## Tests

- `npm run typecheck`: PASS
- `npm test`: 46/46 PASS
- `tests/e2e/waiter-orders.spec.ts`: 15/15 PASS
- related Waiter/Guest/Design/ProductCard regression: 64/64 PASS
- final `npm run test:e2e`: 85/85 PASS
- failures: 0
- skipped: 0

Stage 7.6 targeted coverage includes route/navigation, empty detail, Guest and waiter-created Orders, reliable source attribution, every filter, live filter movement, complete detail, POS error/retry and same-Order idempotency, read-only protection, forbidden-action absence and all required responsive widths.

## Screenshots and logs

Directory: `docs/QA/stage-7.6/`

- `orders-list-390.png`
- `order-detail-390.png`
- `ready-filter-390.png`
- `selected-768.png`
- `selected-1024.png`
- `selected-1440.png`
- `pos-error-1440.png`
- `read-only-1440.png`
- `empty-filter-1440.png`
- `ready-filter-1440.png` (additional evidence)
- `regression-targeted.log`
- `full-chromium.log`

## Remaining gaps

- DEC-WTR-018–022 remain open; no Order or item cancellation semantics were added.
- DEC-WTR-023–035 remain open as documented for later Waiter stages.
- OrderItem has no independent kitchen/readiness status.
- Handoff, take/transfer/assign-to-self and manager cancellation approval remain absent.
- The existing waiter Order editor is preserved as the implementation behind the direct WTR-013 entry. Stage 7.6 does not create a second editor or change its menu/pricing/modifier contracts.
- The full test log contains pre-existing vinext/React hydration diagnostics in unrelated Guest/Full Cycle surfaces; assertions still pass and Stage 7.6 did not modify those surfaces.

STAGE 7.4 FOUNDATION PRESERVED

STAGE 7.5/7.5A UX PRESERVED

FLOOR UNCHANGED

MOBILE NAVIGATION PRESERVED

DESKTOP NAVIGATION PRESERVED

GUEST UNCHANGED

DOMAIN BUSINESS LOGIC UNCHANGED

FINANCIAL LOGIC UNCHANGED

POS SOURCE OF TRUTH PRESERVED

HANDOFF NOT IMPLEMENTED

ORDER CANCELLATION NOT IMPLEMENTED

ITEM CANCELLATION NOT IMPLEMENTED

DEC-WTR-018–035 REMAIN OPEN
