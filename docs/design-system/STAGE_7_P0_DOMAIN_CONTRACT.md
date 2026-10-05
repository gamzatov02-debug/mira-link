# MIRA LINK — Stage 7 P0 Domain Contract

Status: **STAGE 7.1 DOMAIN FOUNDATION IMPLEMENTED**  
Decision source: `STAGE_7_WAITER_DECISION_PACKAGE.md`, DEC-WTR-001–017  
Runtime status: **P0 foundation implemented; operational actor integration and Waiter UI not started**

## 1. Purpose and boundaries

This document defines the minimum domain and application contracts required before Waiter implementation starts. Stage 7.1 has now implemented the schema-safe foundation, authentication context, Shift/assignment commands, derived selectors and reusable actor validation. Orders, Calls, POS and cash operations still use their existing entry points until the separately approved operational integration sub-stage.

The approved conceptual chain is:

```text
Organization
→ Employee
→ VenueAccess[]
→ Authenticated Employee Identity
→ active Venue context
→ Shift
→ ZoneAssignment[] / TableAssignment[]
→ Table
→ Order / StaffCall / cash Payment / POS
```

Preserved boundaries:

- `User` remains the global Guest/account identity.
- `Employee` is an Organization worker identity and is not a `User` subtype.
- `Waiter` is an Employee role/operational context, not a separate global person type.
- Employee authentication never creates Guest, User or Restaurant Session.
- Authentication and Shift have separate lifecycles.
- Guest actions never require Employee identity.
- operational UI does not calculate money or mutate serialized state directly.
- POS remains the source of truth for order transfer/status and cash confirmation.
- Session, Order, Bill, Split, Payment, FinancialSplit, tips and cashback invariants remain unchanged.
- DEC-WTR-018–035 remain open and introduce no speculative fields here.

## 2. Compatibility audit

### Compatible foundations

- The existing shared domain `State`, command engine, selectors and adapters provide one source of truth for Guest, Waiter and Admin.
- Table, Session, Order, StaffCall, Payment and Employee already provide the operational records needed by the approved Waiter screens.
- `staffSubmitOrder` already validates a waiter/table relationship and records `placedByWaiterId`.
- `calculateBill` and `calculateCommonOrder` already provide financial/order read models without UI arithmetic.
- `POSAdapter` already isolates submit/status/cash confirmation from UI.
- `useSyncExternalStore`, Web Locks, BroadcastChannel and storage events already propagate serialized domain changes between demo tabs.

### Required extensions

1. Organization and explicit Employee VenueAccess do not exist.
2. Employee auth context and active Venue context do not exist.
3. Shift does not exist; `Employee.shift` is only display text.
4. Zone does not exist.
5. Current table ownership (`Table.waiterId` plus `Employee.tables`) cannot represent several Zones, per-Shift scope or additional Table assignment without duplication.
6. Operational mutations do not consistently validate employeeId, venueId, shiftId and assignment.
7. StaffCall and POS/cash operations do not record the acting Employee.
8. Normal Shift close cannot validate obligations until a Shift and assignment-aware workspace selector exist.
9. Handoff/transfer workflow is absent and remains `DOMAIN CAPABILITY GAP`.

### ARCHITECTURE CONFLICT — singular Role

Current runtime:

```ts
type Employee = {
  role: 'waiter' | 'admin'
}

type Waiter = Employee
type Role = Employee['role']
```

Approved target:

- Employee may eventually hold several roles such as waiter, manager and admin.
- Waiter is a role/operational context, not a second Employee entity.

This is compatible with the Stage 2 product architecture but conflicts with the current singular runtime field and `Waiter = Employee` alias. Migration must introduce canonical `roles: EmployeeRole[]`, retain the legacy singular field only as a temporary read-compatibility bridge, migrate callers, then remove it. Two authoritative role sources are prohibited.

### Single-venue demo constraint

Current `State` owns one `venue`. Approved Employee access supports several venue IDs. P0 does not require conversion of every record into a multi-venue database. The demo may load one active venue state at a time, while the auth/access contract supports multiple permitted venue IDs and selects one `activeVenueId`. This is a required extension, not a reason to invent cross-venue data in Stage 7.

## 3. Entity model audit

| Concept | Status | Existing analogue/location | Source of truth now | P0 contract |
|---|---|---|---|---|
| Organization | **NEW** | None | None | Stable organization ID containing Employee membership and Venue ownership/access boundary |
| Venue | **EXTEND** | `State.venue` in `lib/domain/model.ts` | shared domain State | Add organization relationship in the model boundary; current venue remains active demo Venue |
| User | **EXISTING** | `State.users` | shared domain State | Unchanged; never used as Employee auth identity |
| Employee | **EXTEND** | `State.employees` | shared domain State | Add organization membership, VenueAccess, canonical roles and active/inactive status; remove display-only assignment authority over time |
| EmployeeRole | **EXTEND** | singular `Employee.role` | Employee | Canonical role list; minimum known roles preserve waiter/admin, manager only when separately modelled |
| VenueAccess | **NEW** | None | Organization/employee directory contract | Employee-to-Venue access grant; not operational table assignment |
| EmployeeAuthContext | **NEW** | None; `app/chatgpt-auth.ts` is unrelated | authentication/session boundary | Authenticated employeeId, activeVenueId and auth-session state; independent from Shift and restaurant Session |
| Shift | **NEW** | `Employee.shift` display string only | shared operational domain State | Unique shiftId, employeeId, venueId, start/end timestamps and open/closed status |
| Zone | **NEW** | None | shared operational domain State | Stable zoneId under Venue plus display name and lifecycle status only if needed to prevent assignment to inactive Zone |
| Table | **EXTEND** | `State.tables`; `Table.waiterId` | shared domain State | Add stable Zone relationship; keep table business/session behaviour unchanged |
| ShiftAssignment | **NEW** | `Table.waiterId` + `Employee.tables` approximate direct assignment | shared operational domain State | Per-Shift sets of assigned Zone IDs and specifically assigned Table IDs |
| Session | **EXISTING** | `State.sessions` | shared domain State | Unchanged; not Employee Shift |
| Order | **EXTEND** | `State.orders`; optional `placedByWaiterId` | shared domain State/POS status | Existing data unchanged; actor validation added at operational boundary, actor attribution extended only where needed |
| StaffCall | **EXTEND** | `State.calls` | shared domain State | Existing Guest creation unchanged; staff handling gains acting employee/shift attribution if mutation is approved |
| Payment/cash request | **EXTEND at action boundary** | `State.payments` | shared domain State + POS confirmation | Financial record/calculation unchanged; Waiter request to confirm cash validates actor before unchanged POS confirmation |
| POSAdapter | **EXISTING** | `lib/adapters.ts` | POS adapter | Interface and financial authority remain; authenticated operational orchestration occurs before adapter call |

## 4. Minimum proposed fields

Every entry is a contract proposal based on approved P0 behaviour. Naming may follow repository conventions during implementation, but semantics must remain.

### Organization — NEW

```ts
type Organization = {
  id: string
  name: string
}
```

Only identity and ownership are required. Billing, hierarchy and enterprise metadata are outside Stage 7 P0.

### Venue — EXTEND

```ts
type Venue = ExistingVenue & {
  organizationId: string
}
```

No change to cashback or bonus fields.

### Employee — EXTEND

```ts
type EmployeeRole = 'waiter' | 'admin' // manager is added only with an approved role contract

type Employee = {
  id: string                         // EXISTING
  name: string                       // EXISTING
  organizationId: string             // NEW FIELD
  venueAccess: VenueAccess[]          // NEW FIELD
  roles: EmployeeRole[]               // REPLACES singular role after migration
  status: 'active' | 'inactive'       // NEW FIELD; minimum access revocation state
}

type VenueAccess = {
  venueId: string
}
```

No phone, PIN, password, avatar, profile preferences or permission matrix is added. Credential material belongs to the auth provider/session boundary, not serialized operational State.

### EmployeeAuthContext — NEW, session-scoped

```ts
type EmployeeAuthContext = {
  id: string
  employeeId: string
  activeVenueId: string
  status: 'authenticated'
  createdAt: string
}
```

Auth-provider token, expiry and secret fields are implementation/integration concerns. Auth context is device/session scoped. The demo persists keyed context records through the existing shared-state mechanism and callers select a specific context ID; it does not store one global `activeEmployeeId`. This allows separate contexts to represent different employees without overwriting one another.

### Shift — NEW

```ts
type Shift = {
  id: string
  employeeId: string
  venueId: string
  startedAt: string
  endedAt?: string
  status: 'open' | 'closed'
}
```

Rules:

- each opening creates a unique Shift ID, including multiple openings on one day;
- an Employee may have at most one open Shift per Venue unless later explicitly approved otherwise;
- authentication does not create or close Shift;
- normal close is rejected while blocking obligations exist;
- logout does not mutate Shift;
- manager override and handoff are absent until separate contracts are approved;
- cash reconciliation fields are excluded.

### Zone — NEW

```ts
type Zone = {
  id: string
  venueId: string
  name: string
}
```

Stable ID is authoritative; name is display data. No capacity, geometry, ordering, schedule or analytics metadata is required for P0.

### Table — EXTEND

```ts
type Table = ExistingTable & {
  zoneId: string
}
```

P0 approved Venue → Zone → Table. Current numeric table ID and Session invariants remain unchanged.

### ShiftAssignment — NEW

```ts
type ShiftAssignment = {
  shiftId: string
  zoneIds: string[]
  tableIds: number[]
}
```

Rules:

- one assignment record per Shift;
- several Zones are allowed;
- explicit Table IDs add actionable Tables independently of Zone assignment;
- Manager/Admin controls assignment mutation;
- assigned scope is actionable;
- unassigned venue scope is visible read-only by default;
- `Table.waiterId` and `Employee.tables` become migration inputs/derived compatibility views, not parallel authority.

## 5. Identity distinctions

| Concept | Meaning | Lifecycle | May create Restaurant Session? |
|---|---|---|---:|
| User | Global Guest/account identity | Independent of visit | No, except through explicit Guest table-entry flow |
| Guest | Participant in a Restaurant Session | Visit-scoped | Belongs to Session |
| Employee | Organization worker identity | Employment/access lifecycle | No |
| Role | Capability category of Employee | Administrative assignment | No |
| Waiter context | Employee acting with waiter role at active Venue and Shift | Auth + Shift scoped | Only through approved waiter-created-order command |
| EmployeeAuthContext | Device/session proof of Employee identity and active Venue | Login/logout/session expiry | No |
| Shift | Operational working period | Explicit start/end | No |

## 6. P0 action and query contracts

Counts for this specification:

- **REUSE: 5**
- **EXTEND: 5**
- **NEW: 8**

### Reuse unchanged — 5

| Contract | Current implementation | P0 use |
|---|---|---|
| `createStaffCall` Guest command | `engine.ts` | Guest creates call without Employee identity; unchanged |
| `calculateBill` | selectors | Table Detail operational bill breakdown |
| `calculateCommonOrder` | selectors | Table/order item breakdown |
| POSAdapter transfer/status/cash methods | `lib/adapters.ts` | Called only after actor validation; POS remains authority |
| `confirmPayment(source='pos')` | `engine.ts` | Final cash state transition remains unchanged and POS-only |

### Extend existing operational contracts — 5

| Existing contract | Required extension |
|---|---|
| `staffSubmitOrder` | Resolve authenticated actor; validate employeeId, active Venue, open Shift, waiter role and actionable Table assignment before existing cart/order transaction |
| `staffCallStatus` | Validate actor/Shift/actionable Table; record accepting/completing Employee where approved; retain waiter/admin call-type separation |
| Waiter POS submit/retry path | Validate actor/Shift/actionable Order Table before calling unchanged POSAdapter; never let UI dispatch unrestricted status |
| Waiter cash confirmation path | Validate actor/Shift/actionable Payment Table before calling unchanged POSAdapter confirmation; retain POS-only success |
| `reassignWaiter` | Migrate to Manager/Admin-controlled ShiftAssignment mutation; preserve temporary direct-table compatibility during migration |

### New P0 contracts — 8

| Proposed semantic contract | Type | Purpose |
|---|---|---|
| authenticate Employee | auth action | Establish personal EmployeeAuthContext without Shift/Guest/Session mutation |
| logout Employee | auth action | Clear auth context only; return open-Shift warning information before confirmation |
| select active Venue | auth/context action | Select one Venue from Employee VenueAccess |
| start Shift | domain command | Create unique open Shift for authenticated Employee and active Venue |
| end Shift | domain command | Close own Shift only when obligation selector returns none |
| assign Shift Zones/Tables | domain command | Manager/Admin-controlled assignment mutation; Waiter self-assignment prohibited |
| get active Shift | selector/query | Resolve open Shift for employeeId + venueId |
| get Waiter workspace | selector/query | Derive assigned/actionable and unassigned/read-only Tables plus scoped Orders, Calls and pending cash |

`validateWaiterAction` is an internal policy/service used by extended commands, not a ninth public command. It must centralize the checks below instead of duplicating them in components.

## 7. Action flow contracts

### Authentication

```text
UI intent: sign in as Employee
→ auth action: authenticate employee credential
→ validation: personal Employee exists, status active, has at least one VenueAccess
→ mutation: create/update session-scoped EmployeeAuthContext only
→ synchronization: auth-session mechanism; no Guest/domain operational event
```

### Active Venue selection

```text
UI intent: choose Venue
→ context action: select active Venue
→ validation: Venue is included in Employee.venueAccess
→ mutation: activeVenueId in EmployeeAuthContext
→ synchronization: device/session auth context; operational venue State remains shared
```

### Start Shift

```text
UI intent: start work
→ domain command: start Shift(actor, venue)
→ validation: authenticated active Employee, waiter role, VenueAccess, no existing open Shift for that Employee/Venue
→ mutation: append Shift(open) and empty ShiftAssignment
→ synchronization: shared domain dispatch → storage revision → BroadcastChannel/storage event
```

### End Shift

```text
UI intent: finish work
→ domain command: end own Shift
→ validation: actor owns open Shift; no blocking obligations
→ mutation: status closed + endedAt
→ synchronization: shared domain mechanism
```

If obligations exist, state is unchanged and the result identifies categories to resolve. Handoff is not simulated.

### Assign Zones/Tables

```text
UI intent: Manager/Admin assigns work
→ assignment command
→ validation: administrative actor; same Venue; open target Shift; known Zone/Table IDs
→ mutation: replace/update ShiftAssignment through one authoritative command
→ synchronization: shared domain mechanism; Waiter workspace updates live
```

Waiter request-transfer/accept-handoff is a `DOMAIN CAPABILITY GAP` and has no P0 command.

### Waiter-created order

```text
UI intent: create/dosubmit order from assigned Table
→ extended staffSubmitOrder
→ validation: employeeId + activeVenueId + open shiftId + waiter role + actionable Table assignment
→ existing validation: table/session freshness, guest, products, modifiers, quantity, stop-list, idempotency
→ mutation: existing atomic Session/Guest/Order transaction; actor attribution
→ synchronization: existing shared dispatch
```

### Order send/retry and service status

```text
UI intent: submit/retry/update supported status
→ actor-validated operational application action
→ validation: Employee/venue/open Shift/actionable Table; Order and Session state
→ mutation: unchanged POSAdapter / reviewed domain status transition
→ synchronization: existing shared dispatch and notifications
```

Cancellation is excluded while DEC-WTR-018–022 remain open.

### Service call handling

```text
UI intent: accept/complete waiter call
→ extended staffCallStatus
→ validation: Employee/venue/open Shift/waiter role/actionable Table; call type waiter; valid transition
→ mutation: existing call status plus actor attribution
→ synchronization: existing shared store and Guest notification
```

### Cash confirmation

```text
UI intent: confirm pending cash at assigned Table
→ actor-validated Waiter cash action
→ validation: Employee/venue/open Shift/actionable Table; Payment pending and cash
→ adapter: existing POSAdapter.confirmCashPayment
→ mutation: existing confirmPayment(source='pos') only
→ synchronization: existing Payment/Bill/Guest/Admin updates
```

## 8. Actor validation matrix

| Operational mutation | employeeId | venueId | shiftId | waiter role | actionable assignment | Existing gap |
|---|---:|---:|---:|---:|---:|---|
| Create waiter order | Required | Required | Required | Required | Required | Current command trusts caller-supplied waiterId |
| Submit order to POS | Required | Required | Required | Required | Required | Adapter accepts only orderId |
| Retry POS transfer | Required | Required | Required | Required | Required | Adapter accepts only orderId |
| Advance supported service status | Required | Required | Required | Required | Required | `posStatus` has no actor |
| Accept waiter call | Required | Required | Required | Required | Required | command validates only role string |
| Complete waiter call | Required | Required | Required | Required | Required | no employee attribution |
| Confirm cash request | Required | Required | Required | Required | Required | adapter accepts only paymentId |
| Start Shift | Required | Required | New Shift | Required | Not yet | command absent |
| End Shift | Required | Required | Required | Required | Own Shift | command/obligation selector absent |
| Assign Zone/Table | Required admin actor | Required | Target Shift | Admin/manager | Administrative authority | handoff/admin workflow absent |

Guest `submitOrder`, `createStaffCall`, Split, Payment, tips and all Guest account actions remain unchanged and never request Employee actor context.

## 9. Blocking obligation contract

Normal Shift close must query current shared state for obligations attached to actionable assignment and/or actor attribution. Minimum P0 categories:

- Orders in non-terminal operational states relevant to the Shift assignment;
- waiter StaffCalls in `created` or `accepted` state within actionable assignment;
- cash Payments in `pending` state within actionable assignment.

Terminal Order classification must reuse the existing status model and must not create cancellation rules. The selector returns categories/IDs for explanation; it does not mutate them. Ambiguous ownership after reassignment must block close until a future handoff contract resolves it.

## 10. Workspace read model

`getWaiterWorkspace(employeeId, venueId, shiftId)` is a selector/query, not a second store. It derives:

- active Employee and Shift;
- assigned Zones;
- specifically assigned Tables;
- all venue Zones/Tables with `actionable | read_only` access;
- Orders joined through Session→Table;
- waiter StaffCalls joined by table;
- pending cash Payments joined through Session→Table;
- existing Bill/CommonOrder values;
- blocking obligations.

The read model does not persist `attention`, counts, filters or cards as domain state.

## 11. Synchronization contract

Audit confirms the demo shared domain mechanism:

- serialized domain State in localStorage;
- `dispatch` under Web Locks;
- revisioned writes;
- BroadcastChannel updates;
- browser storage events;
- React subscription through `useSyncExternalStore`.

### Shared and synchronized

- Organization/Venue/Employee access records used by demo data;
- Shift open/close state;
- Zone records and Table zone membership;
- ShiftAssignment changes;
- actor attribution added to operational records/events;
- existing Orders, Calls, Payments and POS state.

### Keyed auth/session context, not one shared venue value

- EmployeeAuthContext;
- current activeVenueId selection;
- credential/token/session-expiry material.

In the local demo these records use the existing persisted/synchronized State as keyed contexts. They are not a second source for Orders, Shifts or assignments. A single global `activeEmployeeId` remains forbidden because it would make separate Waiter tabs impersonate one another.

## 12. Migration strategy

### Stage 7.1 implementation clarification

- persisted demo state is now `State.version = 2`;
- `normalizeState` is the single read-time normalization path for both legacy v1 and current v2 state;
- legacy `Employee.role`, `Employee.shift`, `Employee.tables` and `Table.waiterId` remain compatibility inputs for existing demo paths, while `roles`, `Shift` and `ShiftAssignment` are canonical for the new Waiter foundation;
- each newly started Shift receives a deterministic compatibility assignment derived from the legacy table ownership of that Employee; subsequent assignment changes use `ShiftAssignment` only;
- Employee auth contexts are keyed records in the same persisted/synchronized state rather than one global `activeEmployeeId`, so contexts do not overwrite each other;
- `validateWaiterActor` centralizes auth context, Employee status, Waiter role, Venue access, active Shift and actionable Table checks. Connecting that validator to Orders, Calls, POS and cash mutations remains explicitly deferred.

These details do not alter the approved P0 business semantics.

### Phase A — schema-safe domain foundation

1. Add Organization/Venue relation and Employee VenueAccess/roles/status with deterministic seed migration.
2. Add Zone and Table.zoneId.
3. Add Shift and ShiftAssignment collections.
4. Introduce selectors for active Shift, workspace, access mode and obligations.
5. Preserve old seed meaning: current `w1`, tables and venue map deterministically into the new records.

### Phase B — compatibility transition

1. Derive initial Zone/Table assignments from existing `Table.waiterId`/`Employee.tables` for the seeded Shift only.
2. Treat ShiftAssignment as canonical after migration.
3. Migrate role checks from singular `role` to canonical `roles`.
4. Keep compatibility reads only while existing tests/components are migrated; do not write both models independently.

### Phase C — operational actor integration

1. Introduce personal Employee auth context and active Venue selection.
2. Add Shift start/end commands and obligation selector.
3. Extend staffSubmitOrder, call handling, POS send/retry/status and cash-confirmation entry with centralized actor validation.
4. Preserve underlying Guest commands, POSAdapter and financial transitions.

### Phase D — UI readiness

Only after A–C domain tests pass may a separately authorized stage implement WaiterShell and routes. Screen implementation is outside Stage 7.1.

## 13. Backward compatibility and required future tests

Inherited baseline before Stage 7.1:

- TypeScript: PASS;
- unit: 23/23 PASS;
- Full Chromium E2E: 38/38 PASS;
- failures/skipped: 0/0.

Stage 7.1 verified result:

- TypeScript: PASS;
- unit/domain: 34/34 PASS, including all inherited 23 tests and 11 new Stage 7.1 tests;
- Stage 7.1 targeted domain: 11/11 PASS;
- targeted Guest E2E: 21/21 PASS;
- Full Chromium E2E: 38/38 PASS;
- failures/skipped: 0/0.

Operational integration requirements that remain:

- existing tests remain and continue to pass;
- new domain tests are added for access, Shift invariants, Zone/Table assignment, obligation blocking and actor validation;
- Guest flows run without Employee auth;
- staff-created order keeps idempotency, stale-session, cart preservation, stop-list and price-snapshot behaviour;
- call role separation and Guest notifications remain;
- POS retry creates no duplicate Order;
- cash remains unpaid until POS confirmation;
- shared-store and cross-tab updates include Shift/assignment changes;
- no test-only auth bypass or hardcoded active employee survives final implementation.

## 14. Implementation order

### Domain Foundation

1. Organization/VenueAccess and canonical Employee roles.
2. EmployeeAuthContext boundary and active Venue selection.
3. Zone and Table relationship.
4. Shift and ShiftAssignment.
5. workspace/access/obligation selectors.

### Operational Integration

6. centralized actor-validation policy;
7. waiter-created order integration;
8. call handling integration;
9. POS submit/retry/status integration;
10. cash confirmation integration;
11. cross-tab synchronization and domain tests.

### Waiter Shell

Only after Domain Foundation and Operational Integration are verified: auth/Shift gate, active Venue, navigation context and read-only/actionable access presentation.

### Waiter Screens

Implement bounded screen groups after Shell. P1/P2 screens remain blocked by DEC-WTR-018–035 as documented.

## 15. Deferred capabilities

- transfer request / handoff acceptance: `DOMAIN CAPABILITY GAP`;
- manager Shift override: future capability;
- cash reconciliation: outside Waiter MVP;
- cancellation: DEC-WTR-018–022 OPEN;
- Personal QR: DEC-WTR-023–028 OPEN;
- detailed tips attribution/history: DEC-WTR-029–031 OPEN;
- profile editing: DEC-WTR-032–033 OPEN;
- completed Shift History: DEC-WTR-034–035 OPEN;
- complex RBAC/permission engine: outside P0;
- production auth provider/backend and real multi-device synchronization: separate integration scope.

## 16. Stage boundary

Stage 7.1 stops at the domain foundation boundary.

**DOMAIN FOUNDATION IMPLEMENTED**  
**WAITER UI NOT STARTED**  
**OPERATIONAL ACTOR INTEGRATION DEFERRED**  
**DEC-WTR-018–035 REMAIN OPEN**
