# MIRA LINK — Waiter Screen Implementation

Status: **STAGE 7.0B — P0 PRODUCT DECISIONS RECORDED**  
Implementation status: **NOT STARTED**  
Runtime, production/demo UI, domain, Guest, Admin, financial logic, authentication and POS contracts are unchanged by this document.

## 1. Stage 7 purpose and source of truth

Stage 7 is **Waiter Screen Implementation**. It turns the Stage 2 Waiter information architecture and WTR-001–WTR-016 registry into a future operational mobile interface. The Waiter surface is a separate employee product area. It uses the shared MIRA Design System in the `MIRA / Operational Light` semantic mode and must not copy Guest composition, navigation or account behaviour.

The implementation order remains **tokens → Tier 1 components → product patterns → screens**. Screens receive domain state, derive presentation view models and dispatch existing commands or adapters. They do not calculate money, invent transitions, mutate state directly or create a parallel store.

Primary sources:

- `docs/MASTER_SPEC.md`, sections 37–41, 61–65, 100–102;
- `docs/MIRA_LINK_PRODUCT_ARCHITECTURE.md`, Waiter IA, navigation, routing, system states, analytics and preserved domain contract;
- `docs/MIRA_LINK_SCREEN_REGISTRY.md`, WTR-001–WTR-016 and existing-to-proposed mapping;
- `docs/MIRA_LINK_USER_FLOWS.md`, WF-01–WF-04 and cross-role state rules;
- `docs/design-system/MIRA_LINK_FOUNDATIONS.md` and `MIRA_LINK_TOKENS.md`;
- `docs/design-system/MIRA_LINK_COMPONENT_LIBRARY.md` and `MIRA_LINK_COMPONENT_IMPLEMENTATION.md`;
- `docs/design-system/MIRA_LINK_PRODUCT_PATTERNS.md`;
- `docs/design-system/STAGE_7_WAITER_DECISION_PACKAGE.md` and `STAGE_7_P0_DOMAIN_CONTRACT.md`;
- `docs/design-system/MIRA_LINK_GUEST_SCREEN_IMPLEMENTATION.md` as a migration-boundary precedent, not as Waiter UI anatomy;
- `lib/domain/model.ts`, `engine.ts`, `selectors.ts`, `seed.ts`, `lib/store.ts`, `lib/adapters.ts`;
- current `Staff`, `Orders`, `Calls` and `StaffMenu` implementations in `components/demo-app.tsx` and `components/staff-menu.tsx`;
- domain and E2E coverage in `tests/domain.test.ts`, `tests/e2e/cycle.spec.ts`, `guest-service.spec.ts` and `design.spec.ts`.

Regression baseline inherited from completed Stage 6.2C:

- TypeScript: PASS;
- unit: 23/23 PASS;
- Full Chromium E2E: 38/38 PASS;
- failures: 0;
- skipped: 0;
- Guest responsive QA: PASS.

## 2. Preserved domain and product boundaries

The following remain immutable unless a later explicit Product / Domain decision authorises a contract change:

- `domain engine = source of truth`;
- one active Session per table;
- Order status and financial status are distinct;
- order price snapshots are immutable;
- POS controls accepted/error order transfer and confirms cash;
- a cash intent is not paid until POS confirmation;
- StaffCall transitions are `created → accepted → completed`;
- successful payments and their FinancialSplit are immutable;
- Split allocation, cashback, tips, additional tips and session close rules remain unchanged;
- browser demo synchronization and cross-role visibility remain shared;
- Waiter cannot acquire Admin-only close, force-close, refund, menu or configuration permissions;
- no real iiko, payment or production authentication integration is introduced in Stage 7.

Stage 7.0B resolves the P0 product boundary for personal Employee identity, independent authentication and Shift lifecycles, Organization/VenueAccess, required active Shift, Zone as a domain entity, Manager/Admin assignment authority, assigned/actionable versus unassigned/read-only scope and Table Detail actions. Production credential provider, cross-device auth, complex RBAC and handoff implementation remain outside the approved P0 runtime contract.

## 3. Current Waiter implementation audit

The current route `/demo/waiter` renders one legacy `Staff` surface and hardcodes employee `w1` (Александр). It currently contains:

- seeded employee name, shift string and assigned table IDs;
- ready-order and personal-tip summaries;
- a collapsible assigned-table grid;
- the `StaffMenu` presentation for menu lookup and waiter-created orders;
- active waiter calls with accept/complete actions;
- pending cash payments with Demo POS confirmation;
- an order list with All / Submitted / Ready / POS Error filters;
- Demo POS submission, retry and manual service-status actions.

The current implementation does **not** provide:

- employee authentication or a shift start/end command;
- a selected active waiter identity instead of hardcoded `w1`;
- separate major Waiter routes or the Stage 2 primary navigation;
- a Zone entity or assignment model;
- a dedicated Table Detail, Order Detail, Calls, Payments, Tips, Profile or Shift History screen;
- a personal waiter QR payload or scan route;
- profile mutation or shift-history persistence.

The existing Waiter surface uses legacy MIRA components and embedded compositions. Stage 7 must migrate it to approved Tier 1 and Stage 5 patterns incrementally while preserving each working command and E2E result.

## 4. Waiter IA and navigation contract

### Primary navigation

The documented mobile navigation is:

1. **Floor** — WTR-003 and entry to WTR-004;
2. **Orders** — WTR-005 and entry to WTR-006/WTR-013;
3. **Calls** — WTR-007 and WTR-008;
4. **More** — WTR-009–WTR-012 and WTR-015–WTR-016.

WTR-002 Shift Dashboard is the post-shift-start orientation screen. A persistent shift header surfaces new orders, ready items, cash pending and calls. It may link to primary destinations but must not absorb their detailed tasks.

### Secondary and contextual navigation

- More → Payments, Tips, Profile;
- Profile → Shift History;
- Tips → Personal QR;
- Floor → Table Detail;
- Table Detail → related orders, bill summary, call context and Staff-created Order;
- Orders → Order Detail or Staff-created Order;
- Order Detail → Table Detail or inline POS Issue;
- Calls → Call Detail; Call Detail may continue to the related Table Detail;
- Payments → Cash Confirmation;
- alert/header items open their corresponding major screen with the matching item in context.

### Routing and back behaviour

Stage 2 requires major Waiter screens to have URLs. The master specification lists `/demo/waiter`, `/demo/waiter/table/:tableId`, `/demo/waiter/orders/:orderId`, `/demo/waiter/calls` and `/demo/waiter/tips`. WTR-008 and WTR-010 remain Bottom Sheets over their parent pages; WTR-014 remains an inline state. WTR-013 remains a Fullscreen Flow.

Back behaviour follows the documented Parent / Exit fields: details return to the originating parent and preserve its filter and scroll state; a Bottom Sheet dismisses to its parent; a Fullscreen Flow returns to its source after cancel or successful submission. Direct URL entry returns to the canonical parent when the object is missing or inaccessible. A URL locates context but never grants Waiter access.

Final URL strings for WTR-001, WTR-002, WTR-003, WTR-007–WTR-013 and WTR-015–WTR-016 remain an implementation detail for the routing stage. Screen IDs, Parent relationships, access rules and major-screen URL requirement are stable; route naming does not reopen a product specification gap.

## 5. Screen inventory — identity, transitions and domain use

No additional WTR IDs are introduced.

| ID | Official screen | Purpose | Entry points | Exit / next | Domain entities/selectors | Main Waiter actions |
|---|---|---|---|---|---|---|
| WTR-001 | Login / shift start | Authenticate personal Employee, select permitted Venue and start/resume work | App launch | WTR-002 | EmployeeAuthContext, Employee, VenueAccess, Shift | Login, select Venue, start Shift; logout is independent and warns about open Shift — contracts specified, runtime absent |
| WTR-002 | Shift dashboard | Orient the active Employee and surface scoped priorities | WTR-001; app resume | WTR-003, 005, 007, 009 | Employee, Shift, ShiftAssignment, Zone, Table, Session, Order, StaffCall, Payment | Open assigned actionable work; show unassigned venue context read-only |
| WTR-003 | Zone / floor | View assigned actionable and unassigned read-only zones/tables | Floor tab; dashboard | WTR-004 | ShiftAssignment, Zone, Table, Session, Order, StaffCall, `calculateBill` | Open any visible table; mutations only in assigned scope; no self-assignment |
| WTR-004 | Table detail | Resolve assigned table work and inspect unassigned context read-only | WTR-003; WTR-006; WTR-008 | WTR-006, 009, 013; back to floor | Table, Session, Guest, Order, StaffCall, Bill/CommonOrder, workspace access | Existing bill breakdown; supported order/status/call/cash actions only when actionable |
| WTR-005 | Orders queue | Triage current/new orders | Orders tab; dashboard alert | WTR-006, 013 | Order, Session, Guest, Table | Filter and open; initiate new staff order |
| WTR-006 | Order detail | Inspect order and progress it through POS/service states | WTR-005; WTR-004 | WTR-004; WTR-014; back | Order/OrderItem, Session, Guest, Product snapshot | Submit/retry through POS; set supported service status |
| WTR-007 | Calls inbox | Triage active waiter calls | Calls tab; dashboard/header alert | WTR-008 | StaffCall, Session, Table, Guest | Select active call |
| WTR-008 | Call detail | Accept or complete a waiter call | WTR-007 call row | WTR-004 or WTR-007 | StaffCall | `staffCallStatus(accepted/completed)` |
| WTR-009 | Payments | View payment requests relevant to waiter operations | More; dashboard/header cash alert; table | WTR-010; WTR-004 | Payment, PaymentPart, Session, Table, Bill | Inspect pending cash; open confirmation |
| WTR-010 | Cash confirmation | Confirm cash through POS | WTR-009 pending cash item | Result and WTR-009 | Payment, PaymentPart, Session, FinancialSplit | `DemoPOSAdapter.confirmCashPayment` → `confirmPayment(source=pos)` |
| WTR-011 | Tips | View personal initial and additional tips | More; dashboard summary | WTR-012; back | Payment, FinancialSplit, AdditionalTip, Employee | Read totals/history; no financial mutation |
| WTR-012 | Personal QR | Present waiter-specific additional-tip QR | WTR-011 | WTR-011 | Employee/Waiter; AdditionalTip destination concept | Display QR — unsupported today |
| WTR-013 | Staff-created order | Create an order for an existing or offline table guest | WTR-004; WTR-005 | WTR-006/POS state | Employee, Table, Session, Guest, Product, CartItem, Order | `staffSubmitOrder` with existing validation and idempotency |
| WTR-014 | POS issue | Explain transfer error and retry safely | WTR-006 `error` state | Retry WTR-006; remain on error | Order, Session, POS simulator | `DemoPOSAdapter.submitOrder` retry; no duplicate Order |
| WTR-015 | Profile | Show employee identity and approved settings | More | WTR-016; back | Employee | Read identity; settings mutation unsupported |
| WTR-016 | Shift history | Review completed shift activity | WTR-015 | WTR-015 | No Shift/history entity; Events are global demo events | Read shift history — unsupported today |

## 6. Screen state, patterns and acceptance matrix

`Loading` below is presentation state driven by an actual async adapter/identity request. It is not a new domain status. `Attention required` is a derived presentation grouping and is never persisted as a new state.

| ID | Required states, empty/loading/error | Guest/Admin/POS relationship | Reuse: Tier 1 → Stage 5 | Waiter-specific requirement | Minimum acceptance | Gap status |
|---|---|---|---|---|---|---|
| WTR-001 | Authenticated/no Shift; Venue selection; starting; active Shift; loading; no access; blocking obligations; logout warning | Employee auth creates no Guest/User/Session; Shift is independent | Field, TextInput, Button, Alert, Skeleton, EmptyState → none | EmployeeAuth/ShiftStart composition using approved contracts | Personal Employee identity; permitted Venue only; operational entry requires active Shift; logout never silently closes Shift | **P0 SPECIFICATION RESOLVED; DOMAIN EXTENSION REQUIRED:** auth context and Shift runtime absent |
| WTR-002 | Idle; empty priorities; new/attention; ready; cash pending; loading/no access | Reflects Guest orders/calls/cash and POS updates | Card, Badge, StatusBadge, Alert, Button, EmptyState → MetricCard, OrderCard, TableCard, ServiceCallCard, PaymentSummaryCard, SectionHeader | WaiterShell/priority composition; no new financial pattern | Counts/actions derive from active Shift assignment; unassigned venue work is visible read-only | **P0 SPECIFICATION RESOLVED; DOMAIN EXTENSION REQUIRED:** Shift/Zone/workspace selectors absent |
| WTR-003 | No assignments; assigned/unassigned; free; active; call; ready; unpaid; error/no access | Guest session is shared; Manager/Admin owns assignment | Button, Chip, Badge, StatusBadge, Skeleton, EmptyState → TableCard, SectionHeader | Responsive FloorGrid screen composition | Several assigned Zones plus explicit Tables actionable; unassigned Zones/Tables read-only; no self-assignment | **P0 SPECIFICATION RESOLVED; DOMAIN EXTENSION REQUIRED:** Zone and ShiftAssignment runtime absent |
| WTR-004 | Free table; active visit; attention; completed/closed; read-only unassigned; missing/inaccessible table | Reads Guest orders/bill/calls; Admin alone closes/force-closes | Card, Badge, StatusBadge, Alert, Button, EmptyState → TableCard, OrderCard, BillSummary, ServiceCallCard, SectionHeader | TableDetail composition | Existing items, quantities, statuses, amounts, totals and payment state; assigned scope may use existing order/status/call/cash actions; unassigned scope read-only | **P0 SPECIFICATION RESOLVED; ACTOR VALIDATION EXTENSION REQUIRED** |
| WTR-005 | Empty queue; submitted/new; accepted; processing; ready; completed; issue/error; filters | Guest submit adds item; POS changes status | Chip, StatusBadge, Alert, Skeleton, EmptyState → OrderCard, SectionHeader | Queue/filter composition only | No phantom orders; filters do not mutate domain; cards link to correct details | Fully specified |
| WTR-006 | Submitted; accepted; in_progress; ready; served; completed; error; cancelled read-only; loading during adapter | Guest sees status; POS confirms/error; Admin sees same Order | Button, StatusBadge, Alert, Skeleton → OrderCard, ProductListItem, ResponsiveActionGroup | Detailed line-item composition | Shows table, guest, ID, items, modifiers, comments, snapshots and time; only valid transitions enabled | Fully specified; cancellation command is absent and must remain unavailable |
| WTR-007 | Empty inbox; created/new; accepted; attention; loading/no access | Guest creates call; Admin calls excluded | Badge, StatusBadge, Skeleton, EmptyState → ServiceCallCard, SectionHeader | Calls queue composition only | Only `type=waiter`, non-completed calls; new calls become visible through shared state | Fully specified |
| WTR-008 | Created; accepted; completed result; stale/already-completed; action loading/error | Guest receives accepted/completed notification | Button, Alert, StatusBadge, BottomSheet → ServiceCallCard, ResponsiveActionGroup | None | Accept once; complete once; wrong role rejected; close restores Calls context | Fully specified |
| WTR-009 | Empty; cash pending; succeeded/failed read-only history where available; loading | Guest creates cash intent; POS alone confirms | StatusBadge, Alert, Skeleton, EmptyState → PaymentSummaryCard, SectionHeader | Pending-cash queue composition | Shows table, amount and pending state; online confirmation is never exposed to Waiter | Fully specified |
| WTR-010 | Pending; confirming/loading; succeeded; stale/released/error | POS confirmation updates Guest/Admin/Bill | Button, Alert, StatusBadge, BottomSheet → PaymentSummaryCard | Confirmation composition only | Pending remains unpaid before POS; one confirmation; result shared; financial assertions unchanged | Fully specified |
| WTR-011 | Empty tips; initial tips; additional tips; totals; unavailable data | Guest payment/additional tip; Admin sees finance records | Card, StatusBadge, EmptyState → TipSummary, MetricCard, SectionHeader | Waiter tip-history composition if timestamps become available | Totals equal existing FinancialSplit + AdditionalTip waiter share; read-only | **SPECIFICATION GAP:** tip-detail anatomy/filtering; **DOMAIN CAPABILITY GAP:** AdditionalTip has no timestamp/shift association |
| WTR-012 | QR available; unavailable/error; loading only if a future provider exists | Guest scan would enter existing additional-tip flow | Card, Alert, Skeleton, EmptyState → TipSummary only after scan context | PersonalQRCode presentation, only after QR contract | QR identifies intended waiter without creating restaurant Session and cannot alter tip math | **SPECIFICATION GAP + DOMAIN CAPABILITY GAP:** payload, signing, route, expiry and scan continuation absent |
| WTR-013 | Target selection; product search; empty draft; validation error; submitting; success; stale session; stop-list | Order becomes visible to Guest/Admin; POS handled next | Field, TextInput, Textarea, Radio, Checkbox, Button, Dialog/BottomSheet, Alert, EmptyState → ProductCard, ProductListItem, OrderCard, ResponsiveActionGroup | **WaiterOrderEditor** (Stage 5 deferred) | Assigned table only; atomic command; preserved guest cart; snapshots/idempotency; invalid order leaves state unchanged | Fully specified |
| WTR-014 | POS error; retry loading; accepted result; repeated/late callback | Guest/Admin see same single order and status | Alert, Button, StatusBadge → OrderCard, ResponsiveActionGroup | **POSIssueWorkflow** (Stage 5 deferred) | Retry creates no duplicate; accepted order cannot regress to error; session must remain open | Fully specified |
| WTR-015 | Identity; no access; loading; settings unavailable/error; open-Shift logout warning | Admin employee source; no Guest relationship | Card, Field, Button, Alert, EmptyState → SectionHeader | EmployeeProfile composition after open profile-field decisions | Correct personal Employee/Venue/Shift identity; logout leaves Shift intact; no unsupported edit controls | **SPECIFICATION GAP:** DEC-WTR-032–033 OPEN; identity contract approved but runtime absent |
| WTR-016 | Empty history; completed activity; loading/error/no access | Reads cross-role events only if scoped to shift | Card, StatusBadge, Skeleton, EmptyState → OrderCard, ServiceCallCard, PaymentSummaryCard | ShiftHistory composition after model exists | Activities belong to selected completed shift and active waiter; totals not recomputed in UI | **SPECIFICATION GAP:** DEC-WTR-030–031 and 034–035 OPEN; Shift contract approved but history model absent |

### Specification coverage

- Fully specified at product/screen level: **12/16** — WTR-001, WTR-002, WTR-003, WTR-004, WTR-005, WTR-006, WTR-007, WTR-008, WTR-009, WTR-010, WTR-013, WTR-014.
- `SPECIFICATION GAP`: **4/16** — WTR-011, WTR-012, WTR-015, WTR-016. These remain dependent on OPEN DEC-WTR-023–035 as applicable.
- WTR-001–WTR-004 are not runtime-ready: their product gaps are closed, but the P0 domain/auth contracts in `STAGE_7_P0_DOMAIN_CONTRACT.md` are not implemented.
- Gap screens must not be presented as complete or implemented with guessed behaviour.

## 7. Documented Waiter flows

### WF-01 — Shift → new order → POS → ready → served

```text
WTR-001 Login / shift start
→ WTR-002 Shift dashboard
→ WTR-005 Orders queue
→ WTR-006 Order detail
→ DemoPOSAdapter.submitOrder(orderId)
→ posStatus(error | accepted)
→ [error] WTR-014 POS issue → retry same order
→ [accepted] posStatus(in_progress)
→ posStatus(ready)
→ posStatus(served)
→ WTR-004 Table detail
```

Existing domain actions: `submitOrder` or `staffSubmitOrder`, `DemoPOSAdapter.submitOrder`, `posStatus`. Order state cannot move backwards. `error` is ignored after the order has advanced beyond submitted/error.

Blocking gap: WTR-001 has no authentication/shift domain capability.

### WF-02 — Call → accept → table → resolve

```text
Guest createStaffCall(callType=waiter)
→ shared StaffCall(created)
→ WTR-007 Calls inbox
→ WTR-008 Call detail
→ staffCallStatus(accepted, role=waiter)
→ Guest service notification “Официант уже идёт”
→ WTR-004 Table detail
→ staffCallStatus(completed, role=waiter)
→ Guest service notification “Обращение выполнено”
```

Existing role validation prevents a waiter from accepting an Admin call. Duplicate active calls resolve to the existing call ID.

### WF-03 — Payment request → cash confirmation

```text
Guest createPaymentIntent(method=cash)
→ Payment(pending) + CASH_PAYMENT_REQUESTED
→ WTR-002 cash alert / WTR-009 Payments
→ WTR-010 Cash confirmation
→ DemoPOSAdapter.confirmCashPayment(paymentId)
→ confirmPayment(source=pos)
→ Payment(succeeded) + FinancialSplit + CASH_PAYMENT_CONFIRMED
→ Guest payment success / Admin payment record
```

The Waiter does not confirm online payments. A cash intent remains unpaid until the POS-sourced confirmation succeeds.

### WF-04 — Waiter-created order

```text
WTR-004 Table detail or WTR-005 Orders
→ WTR-013 Staff-created order
→ select assigned table
→ existing active Session OR atomically create Session
→ existing table Guest OR create offline Guest
→ products + modifiers + quantity + comment
→ staffSubmitOrder(waiterId, tableId, expectedSessionId, key)
→ Order(submitted, placedByWaiterId)
→ WTR-006 POS order flow
→ shared Guest/Admin visibility
```

The command reuses cart/order validation and price snapshots, restores any existing Guest cart and publishes only the final transaction. A stale Session, wrong waiter/table, invalid guest, empty items, invalid modifiers/quantity or stop-list item leaves state unchanged.

### Flow coverage

`WAITER FLOWS: 4/4 MAPPED`

WF-01 product behaviour is specified but remains implementation-blocked until the approved EmployeeAuthContext, Shift, Zone/assignment and actor-validation contracts exist. The other documented domain sequences already exist, although their final separated screens do not.

## 8. Waiter UI action → existing domain capability

| Waiter intent | Existing command/selector/adapter | Capability |
|---|---|---|
| Read employee identity/assigned tables | `State.employees`, `Employee.tables`, `State.tables` | PARTIAL legacy read model; approved target is Employee + VenueAccess + ShiftAssignment |
| Start/end shift | None; `Employee.shift` is only a string | **APPROVED DOMAIN CONTRACT; NOT IMPLEMENTED** |
| Authenticate/select active Waiter | None; current UI hardcodes `w1` | **APPROVED DOMAIN CONTRACT; NOT IMPLEMENTED** |
| Read active tables and visit state | Tables + active Sessions + `calculateBill` | SUPPORTED |
| Read zones | No Zone entity | **APPROVED DOMAIN CONTRACT; NOT IMPLEMENTED** |
| Assign Zones/Tables | `reassignWaiter` approximates direct Table assignment | Manager/Admin authority approved; ShiftAssignment extension not implemented; handoff remains a gap |
| Read orders and line snapshots | Orders/OrderItems; `calculateCommonOrder` | SUPPORTED |
| Submit order to POS | `DemoPOSAdapter.submitOrder` → `posStatus` | SUPPORTED |
| Progress accepted order | `posStatus(in_progress/ready/served/completed)` | SUPPORTED; UI must respect monotonic rules |
| Cancel order | Status type includes `cancelled`, but no command exists | **DOMAIN CAPABILITY GAP**; do not expose action |
| Accept/complete call | `staffCallStatus` | SUPPORTED |
| Read cash requests | pending cash Payments | SUPPORTED |
| Confirm cash | `DemoPOSAdapter.confirmCashPayment` | SUPPORTED |
| Create table order | `staffSubmitOrder` | SUPPORTED |
| Retry POS transfer | same `DemoPOSAdapter.submitOrder` on error Order | SUPPORTED |
| Read personal tips | Payments + FinancialSplits + AdditionalTips filtered by waiter | SUPPORTED as aggregate/read model |
| Show chronological tip history by shift | No AdditionalTip timestamp or Shift entity | **DOMAIN CAPABILITY GAP** |
| Generate/present personal QR | None | **DOMAIN CAPABILITY GAP** |
| Edit profile/settings | None | **DOMAIN CAPABILITY GAP** |
| Read completed shift history | No Shift entity/history | **DOMAIN CAPABILITY GAP** |

## 9. Guest ↔ Waiter synchronization model

The demo uses one serialized state in `localStorage` under `mira-link-demo-v1`. `dispatch` acquires a Web Lock, reads the latest state, runs `execute`, writes the new revision and broadcasts it. `BroadcastChannel` and the browser `storage` event refresh other tabs; React reads through `useSyncExternalStore`.

No screen may write local Waiter business state in parallel with this mechanism.

| Source event/action | Shared state/event | Waiter result | Guest/Admin result |
|---|---|---|---|
| Guest submits order | Order `submitted`; `ORDER_CREATED`, `ORDER_SUBMITTED` | Appears in WTR-002/005 | Admin sees same order; Guest sees confirmation |
| Waiter submits to POS | `posStatus accepted/error`; `POS_ORDER_CONFIRMED` or `POS_ORDER_STATUS` | Order card/detail updates | Guest receives service notification and status; Admin sees same state |
| POS/service advances order | Order `in_progress/ready/served/completed` | Queue/table summaries update | Guest/Admin see same status |
| Guest creates waiter call | StaffCall `created`; `STAFF_CALL_CREATED` | Appears in Calls/alerts | Admin can observe shared operation state |
| Waiter accepts/completes call | `STAFF_CALL_ACCEPTED/COMPLETED` | Call leaves/changes queue | Guest receives service notification |
| Guest creates cash intent | Payment `pending`; `CASH_PAYMENT_REQUESTED` | Appears in Payments/cash alert | Guest remains unpaid; Admin sees pending record |
| POS confirms cash | Payment `succeeded`; `CASH_PAYMENT_CONFIRMED` | Pending item resolves | Guest sees success; Admin and Bill update |
| Waiter creates order | Session/Guest if required, Order `submitted`, `STAFF_ORDER_CREATED` | WTR-006 receives order | Guest/Admin share the resulting session/order |
| Guest leaves additional tip | AdditionalTip + `ADDITIONAL_TIP_SUCCEEDED` | WTR-011 aggregate updates | Admin finance reflects same record |
| Admin/POS changes stop-list | Product + `POS_MENU_SYNC` | WTR-013 menu availability updates | Guest menu updates |

The mechanism is browser-profile/origin demo synchronization. It is not production multi-device synchronization, and Stage 7 must not describe it as such.

## 10. Waiter ↔ POS / iiko boundary

`POSAdapter` currently exposes:

- `syncMenu()`;
- `submitOrder(orderId)`;
- `getOrderStatus(orderId)`;
- `confirmCashPayment(paymentId)`.

`DemoPOSAdapter` waits for the configured simulator delay. Order submission resolves to `error` when `simulator.posError` is enabled and otherwise to `accepted`. Cash confirmation dispatches `confirmPayment` with `source='pos'`.

Source-of-truth rules:

- menu changes and stop-list mutations require `source='pos'`;
- Waiter initiates order transmission, but accepted/error is written through the POS adapter;
- cash becomes paid only through POS confirmation;
- online payment confirmation belongs to `PaymentAdapter`, never Waiter;
- price, payment, commission, cashback and FinancialSplit calculations remain in domain;
- current in-progress/ready/served controls dispatch existing `posStatus` simulation and must be labelled as demo/POS status simulation where shown;
- POS retry reuses the same Order and must not create a duplicate;
- real iiko networking, credentials, menu reconciliation, webhooks and production retry policy are outside Stage 7.

## 11. Design System and Product Pattern mapping

Waiter defaults to `MIRA / Operational Light` and compact operational density. Semantic modes are variables, not role-specific component variants.

| Waiter requirement | Tier 1 reuse | Stage 5 pattern reuse |
|---|---|---|
| Major actions and status transitions | Button, IconButton | ResponsiveActionGroup |
| Filters and active navigation state | Chip, Button | SectionHeader |
| Forms and comments | Field, TextInput, Textarea, Radio, Checkbox | ProductCard/ProductListItem in editor |
| Table/floor status | Card, Badge, StatusBadge, EmptyState, Skeleton | TableCard, MetricCard |
| Order queue/detail | StatusBadge, Alert, EmptyState, Skeleton | OrderCard, ProductListItem |
| Calls | StatusBadge, Button, BottomSheet, EmptyState | ServiceCallCard |
| Cash/payment | StatusBadge, Alert, BottomSheet, Button | PaymentSummaryCard |
| Tips | Card, StatusBadge, EmptyState | TipSummary, MetricCard |
| Validation/async feedback | Alert, Toast, Skeleton, EmptyState | Pattern action slots |

### REUSE

- all 18 implemented Tier 1 components where their contract matches;
- Stage 5 `OrderCard`, `TableCard`, `ServiceCallCard`, `PaymentSummaryCard`, `TipSummary`, `MetricCard`, `ProductCard`, `ProductListItem`, `SectionHeader`, `ResponsiveActionGroup`;
- existing domain status adapters only as a source for known labels/tones; Stage 7 should add a Waiter presentation adapter without duplicating domain state;
- existing `StaffMenu` behaviour and command sequence as migration evidence, not as the final public pattern API.

### WAITER-SPECIFIC REQUIRED

- `WaiterShell`: role-level layout, persistent shift header and documented Floor/Orders/Calls/More navigation. It is a screen composition, not a new Design System variant.
- `WaiterOrderEditor`: role-specific Product Pattern for WTR-013, already listed as deferred in Stage 5.
- `POSIssueWorkflow`: role-specific inline workflow for WTR-014, already listed as deferred in Stage 5.
- screen compositions for dashboard, floor, table detail, queue and history. They should remain screen-local until reuse is demonstrated.

### DEFERRED / BLOCKED PATTERNS

- implemented Tier 2 navigation primitives are absent; Stage 7.1 must decide whether to implement the already-specified shared NavigationItem/BottomNavigation contract or keep navigation inside WaiterShell without expanding the public DS prematurely;
- ShiftStart/Auth product behaviour is approved; implementation remains blocked until `STAGE_7_P0_DOMAIN_CONTRACT.md` is implemented and tested;
- PersonalQRCode remains blocked by WTR-012 contract and domain capability;
- ShiftHistory remains blocked by a Shift/history model;
- no Admin menu editor, analytics dashboard, role/permissions editor or QR/NFC management pattern is pulled into Stage 7.

## 12. Responsive and accessibility strategy

Required verification viewports:

- 360px;
- 375px;
- 390px;
- 430px;
- 480px;
- desktop 1440px with the actual demo/Waiter canvas measured separately.

Rules:

- mobile-first single-hand actions; the primary action is reachable without crossing unrelated content;
- minimum mobile touch target 44×44px; approved Tier 1 L is 48px where a full-width critical action is required;
- no document-level horizontal overflow;
- horizontal scrolling is allowed only in an intentional, labelled local filter/navigation container;
- persistent header/navigation and safe-area padding must not cover calls, order actions or Bottom Sheets;
- status always includes text and optional icon; colour is never the sole signal;
- long Russian dish names, guest labels, table numbers, ₽ values and comments wrap without hiding critical meaning;
- urgent calls, new orders, ready items and pending cash remain visible without relying on hover;
- actions remain disabled/loading during an active adapter command and cannot be double-submitted;
- focus-visible, keyboard order, sheet/dialog focus trap and restoration, reduced motion and screen-reader names follow Stage 3/4 rules;
- controls must not be reduced below Tier 1 geometry to fit dense layouts.

## 13. Waiter state matrix

Only existing domain values are persisted.

| Product state | Existing domain source | Waiter presentation meaning | Mutation source |
|---|---|---|---|
| idle | Empty derived collection or free Table | No active work / free table | None; presentation only |
| new | Order `submitted`; StaffCall `created` | New order or unaccepted call | Guest/staff order submit; Guest call |
| attention required | Derived from `submitted`, call `created`, cash `pending`, order `ready/error` | Priority presentation grouping | None; never persisted |
| accepted | Order `accepted`; StaffCall `accepted` | POS accepted order / waiter accepted call | POS adapter / `staffCallStatus` |
| processing | Order `in_progress` | Kitchen/service processing | Existing `posStatus` simulation |
| ready | Order `ready` | Ready for service | Existing `posStatus` simulation |
| completed | Order `served/completed`; StaffCall `completed`; Payment `succeeded`; closed Session | Task resolved | Existing commands/adapters |
| cancelled | Order type supports `cancelled`; Booking supports `cancelled` | Read-only label if present | No Order cancellation command; do not expose Waiter action |
| issue/error | Order `error`; Payment `failed`; thrown command/adapter error | Explain failure and allowed retry | POS/payment adapter or validation |
| empty | No rows after assignment/filter | Explicit EmptyState and next expected source | None |
| loading | No domain status | Async adapter/auth presentation only | Local request lifecycle |

Exact Waiter wording and semantic tone must use the existing status values. Unknown values fall back to a neutral “Статус уточняется” presentation and never trigger a transition.

## 14. Proposed Stage 7 implementation sequence

### Stage 7.0 — Specification and capability decisions

Stage 7.0A documented gaps. Stage 7.0B approves P0 Employee identity, Shift, Zone/assignment and Table Detail contracts. Personal QR, detailed tips, profile editing, cancellation and completed Shift History remain open. No screen implementation.

### Stage 7.1 — Waiter shell, identity boundary and navigation

Create the Operational Light WaiterShell, major routes, persistent shift header and Floor/Orders/Calls/More navigation only after the approved P0 domain foundation and actor validation are implemented and verified. Stage 7.0B does not start this work.

### Stage 7.2 — Dashboard, floor and table context

Implement WTR-002–WTR-004 with Stage 5 TableCard/MetricCard/OrderCard compositions after Zone, ShiftAssignment and workspace access selectors exist. Assigned Zones/Tables are actionable; unassigned venue context is read-only.

### Stage 7.3 — Orders, waiter order editor and POS issue

Implement WTR-005, WTR-006, WTR-013 and WTR-014. Preserve `staffSubmitOrder`, price snapshots, guest cart, idempotency, stop-list and monotonic POS state rules.

### Stage 7.4 — Calls workflow

Implement WTR-007 and WTR-008 using the existing StaffCall state machine and shared notifications.

### Stage 7.5 — Cash, tips and POS-related finance presentation

Implement WTR-009–WTR-011. WTR-012 remains blocked until personal QR product/domain requirements are approved. No financial calculation moves into UI.

### Stage 7.6 — Profile and shift history

Implement WTR-015/WTR-016 only after the employee settings and Shift/history contracts are approved. Read-only identity may ship separately if explicitly accepted.

### Stage 7.7 — Full-cycle synchronization

Verify Guest → Waiter → POS → Guest/Admin order state, calls, cash confirmation, staff-created order, stop-list propagation and tips using separate browser tabs and the existing shared store.

### Stage 7.8 — Responsive, accessibility and release acceptance

Run the full viewport matrix, keyboard/focus review, screen-reader labels, touch targets, no-overflow checks, targeted Waiter E2E, full Chromium regression and manual visual acceptance.

No later sub-stage may silently absorb a gap from Stage 7.0.

## 15. Stage 7 acceptance strategy

### Screen coverage

- WTR-001–WTR-016 each has a reachable approved presentation or an explicitly accepted deferred/blocker result;
- no new WTR ID without architecture update;
- major screens have URLs; Bottom Sheet/inline states retain their defined presentation type;
- primary and contextual navigation match Stage 2.

### Flow coverage

- WF-01–WF-04 pass through the specified screens and existing commands;
- order error retry produces one Order;
- waiter-created order preserves an existing Guest cart and joins/creates only the valid table Session;
- calls enforce waiter/admin role separation;
- cash remains unpaid until POS confirmation.

### Domain and synchronization

- UI never mutates serialized state directly;
- every mutation maps to a reviewed existing command/adapter;
- Guest, Waiter and Admin observe the same Order, StaffCall, Payment, Session and Product records;
- separate browser tabs receive updates through the existing store mechanism;
- price snapshots, money calculations, Split, tips and cashback remain domain-owned;
- no fake synchronization or test-only authentication.

### Responsive and visual

- 360, 375, 390, 430, 480 and desktop/demo canvas verified;
- no page-level horizontal overflow;
- no clipping by fixed/sticky elements or Bottom Sheets;
- all relevant touch targets meet at least 44×44px;
- status and priority remain readable in Operational Light, with long Russian copy and ₽ values;
- urgent call, order, cash and POS error actions remain reachable with one hand on mobile.

### Required verification

1. `npm run typecheck`;
2. `npm test`, preserving at least the existing 23/23 baseline and adding meaningful domain tests only for approved new domain capabilities;
3. targeted E2E per implemented WTR group;
4. four documented Waiter flow E2E scenarios;
5. cross-tab Guest ↔ Waiter synchronization E2E;
6. POS error/retry and cash confirmation E2E;
7. staff-created order domain and E2E regression;
8. responsive/touch/no-overflow E2E for all required viewports;
9. complete Chromium suite with the existing **38/38 Guest regression baseline** still passing;
10. manual browser review with current-code screenshots for key Waiter screens.

No stage is accepted on TypeScript alone or on a partial E2E run.

## 16. Concrete risks and blockers

| Risk | Impact | Required response |
|---|---|---|
| Current Waiter is hardcoded to `w1` | Wrong employee/table/tip scope in real navigation | Implement approved personal EmployeeAuthContext before WTR shell acceptance |
| Approved Shift contract is absent at runtime | Operational gate and normal close cannot be enforced | Implement unique Shift lifecycle and blocking-obligation selector before Waiter actions |
| Approved Zone/ShiftAssignment contract is absent at runtime | Actionable versus read-only scope cannot be enforced | Implement stable Zone and Manager/Admin-owned assignment model before Floor |
| Existing actions lack complete actor validation | Unassigned Employee could mutate Orders/Calls/Cash | Extend operational application/domain boundaries before Table Detail actions |
| Handoff workflow absent | Blocking work cannot be transferred at Shift close | Keep as `DOMAIN CAPABILITY GAP`; normal close remains blocked |
| Personal QR contract absent | Unsafe or fake tips entry | Define payload, expiry, routing, auth/session independence and abuse boundary before WTR-012 |
| AdditionalTip lacks time/shift association | Tip history cannot be grouped truthfully | Domain review before chronological/shift views |
| Current UI directly exposes `posStatus` simulation buttons | May imply Waiter is the kitchen/POS source of truth | Label demo simulation and preserve adapter boundary; do not claim real iiko workflow |
| One browser-local store | Cross-tab demo works, real devices do not | Keep demo disclosure; production persistence is outside Stage 7 |
| Legacy and new components may coexist during migration | Visual/API duplication and regression risk | Migrate one bounded WTR group at a time with targeted E2E |
| Stage 5 status wording requires screen mapping | Inconsistent operational labels | Add one Waiter presentation adapter; do not put transitions in patterns |

## 17. Explicit exclusions

Stage 7 does not include:

- Guest or Admin redesign;
- new financial, Split, payment, cashback, tip or commission rules;
- real iiko/POS/payment integration;
- production authentication provider/backend beyond the approved personal Employee contract;
- runtime Zone or Shift implementation during Stage 7.0B;
- order cancellation without a domain command;
- Admin role/permission editor;
- QR/NFC venue management;
- network/enterprise hierarchy;
- global Design System rewrite or role-specific component variants;
- changes to the approved Guest navigation or Stage 6 baseline.

Stage 7.1 must not begin without separate approval.
