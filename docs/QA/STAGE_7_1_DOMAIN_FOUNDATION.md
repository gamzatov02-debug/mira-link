# MIRA LINK — Stage 7.1 Domain Foundation QA

Status: **PASS**  
Scope: P0 Waiter domain foundation only  
Date: 2026-10-01

## Implemented entities

### New

- `Organization`
- `VenueAccess`
- `EmployeeAuthContext`
- `Shift`
- `Zone`
- `ShiftAssignment`
- `OperationalActorContext`

### Extended

- `Venue.organizationId`
- `Table.zoneId`
- `Employee.organizationId`
- `Employee.venueAccess`
- `Employee.roles`
- `Employee.status`
- shared `State` collections for Organizations, Zones, auth contexts, Shifts and Shift assignments

### Migrated and retained for compatibility

- persisted state version `1 → 2` through `normalizeState`
- singular `Employee.role → Employee.roles[]`
- `Employee.tables` and `Table.waiterId` remain legacy inputs for existing Guest/demo paths
- a new Shift receives a compatibility `ShiftAssignment` derived from the employee's legacy table ownership
- old saved states receive deterministic Organization, Zone, Table-zone and Employee-access data

The compatibility fields are not a second authority for the new Shift workflow. New assignment mutations update `ShiftAssignment`.

## Domain actions

- `authenticateEmployee`: validates an active Employee, Waiter role and Venue access, then creates or restores a keyed auth context.
- `logoutEmployee`: warns when an open Shift exists; confirmed logout removes only the auth context and leaves the Shift open.
- `selectEmployeeVenue`: validates Venue access before changing the active Venue in the auth context.
- `startShift`: validates auth, role, active Venue and the one-open-Shift rule, then creates a unique Shift and its initial assignment.
- `endShift`: validates the actor and rejects close while Orders, waiter Calls or pending cash Payments block it.
- `assignShiftScope`: permits an active Admin with Venue access to replace the open Shift's Zone/Table assignment; Waiter self-assignment is rejected.

## Selectors and validation

- `hasEmployeeRole`
- `hasVenueAccess`
- `getEmployeeAuthContext`
- `getActiveShift`
- `getShiftAssignment`
- `getActionableTableIds`
- `getShiftBlockingObligations`
- `getWaiterWorkspace`
- `validateWaiterActor`

`getWaiterWorkspace` is derived from the shared state. It returns the active identity, Venue, Shift, assignment, assigned Zones/Tables, actionable and read-only Tables, scoped Orders, unresolved waiter Calls, pending cash Payments and blocking obligations. It creates no Waiter-owned store.

`validateWaiterActor` now validates auth context, active Employee, Waiter role, Venue access, loaded Venue, active Shift, optional Shift identity and optional actionable Table. Applying this validator to waiter-created Orders, Call handling, POS send/retry/status and cash confirmation is deferred to the next operational integration sub-stage, as required by Stage 7.1.

## Synchronization and persistence

The existing `lib/store.ts` remains the only store and retains:

- serialized localStorage state;
- Web Locks around dispatch;
- revisioned writes;
- BroadcastChannel updates;
- storage events;
- `useSyncExternalStore` subscriptions.

Employee auth contexts, Shifts and Shift assignments are part of the same serialized State and therefore use this existing write/read/synchronization route. Auth contexts are keyed records rather than one global active employee value. The persistence test serializes the state, runs the production `normalizeState` read path and confirms exact preservation of all three collections plus domain invariants.

No Waiter-specific store or synchronization layer was created.

A dedicated browser-level two-tab Waiter test is not present because Stage 7.1 intentionally exposes no Waiter UI or test-only browser command bridge. Cross-tab plumbing was audited as the unchanged common store path; persisted round-trip coverage was added for the three new collections. End-to-end multi-tab interaction remains verifiable when the approved Waiter application entry points exist.

## Fixtures

The demo seed contains:

- one Organization;
- the existing MIRA Venue linked to it;
- two Waiter Employees and one Admin Employee;
- Venue access and canonical roles for every Employee;
- two stable Zones;
- twelve existing Tables mapped to those Zones.

Guest-facing fixture behaviour and financial data remain unchanged.

## Verification results

| Check | Result |
|---|---:|
| TypeScript | PASS |
| Unit/domain suite | 34/34 PASS |
| Inherited unit tests | 23/23 retained and passing |
| New Stage 7.1 unit tests | 11/11 PASS |
| Targeted Stage 7.1 domain run | 11/11 PASS |
| Targeted Guest E2E | 21/21 PASS |
| Full Chromium E2E | 38/38 PASS |
| Failures | 0 |
| Skipped | 0 |

The targeted Guest E2E covered Guest theme, ProductCard responsive layout, Nearby/session isolation and Guest service flows. The full existing Chromium suite completed in 2.8 minutes. Existing non-failing hydration warnings for floating geolocation distance and input caret styling were observed; they predate and are unrelated to the Stage 7.1 domain changes.

## New domain coverage

The 11 Stage 7.1 tests cover:

1. Organization, Venue access, canonical roles and Venue/Zone/Table relationships.
2. valid Employee authentication, missing Venue access and non-Waiter rejection.
3. independent login, Shift and logout lifecycles.
4. sequential same-day Shifts and concurrent-open-Shift rejection.
5. Order blocker and successful Shift close after terminal status.
6. unresolved waiter Call and pending cash blockers.
7. multiple Zones, specific Table assignment and Admin-only mutation.
8. derived Waiter workspace scope.
9. valid actor plus missing Shift, wrong role, wrong Venue and read-only Table rejection.
10. legacy v1 state migration.
11. auth context, Shift and assignment persistence normalization.

## Remaining gaps

- `DOMAIN CAPABILITY GAP — HANDOFF`: transfer request, acceptance and unresolved-ownership rules remain absent.
- Operational actor validation is not yet connected to Orders, Calls, POS or cash mutations.
- StaffCall and POS/cash operations do not yet record the acting Employee/Shift.
- No production Employee auth provider or backend was introduced.
- The demo still loads one active Venue state at a time, although Employee Venue access supports multiple Venue IDs.
- WaiterShell, Waiter routes and all Waiter screens are not started.
- DEC-WTR-018–035 remain OPEN.

No financial calculation, Split, Payment, cashback, POS authority, Guest Session rule or Guest authentication behaviour was changed.

## Evidence

- Unit log: `docs/QA/stage-7.1-unit.log`
- Targeted domain log: `docs/QA/stage-7.1-targeted.log`
- Successful Guest E2E result: `docs/QA/stage-7.1-guest-e2e-result.txt`
- Full Chromium result: `docs/QA/stage-7.1-full-e2e-result.txt`

The first sandboxed targeted Guest E2E attempt could not bind `127.0.0.1` (`EPERM`). The same unchanged tests were then run with the required local execution permission and completed 21/21 PASS. This was an environment restriction, not an application failure.

**WAITER UI NOT STARTED**  
**DEC-WTR-018–035 REMAIN OPEN**
