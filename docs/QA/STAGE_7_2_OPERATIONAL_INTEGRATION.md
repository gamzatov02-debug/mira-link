# MIRA LINK — Stage 7.2 Operational Integration QA

Status: **PASS**  
Scope: Waiter operational actor integration only  
Date: 2026-10-02

## Audited mutations

Eight existing operational boundaries were audited before integration.

| # | Boundary | Initiator | Table scoped | Actor requirement | Source of truth | Result |
|---:|---|---|---:|---|---|---|
| 1 | `submitOrder` | Guest | Yes | None | shared domain State | Preserved unchanged; Guest orders carry no Employee identity |
| 2 | `staffSubmitOrder` | Waiter | Yes | authenticated Waiter, Venue, open Shift, actionable Table | shared Order entity | Integrated and attributed |
| 3 | `posStatus` / POS submit and retry | POS system or Waiter operation | Yes | Waiter actor is validated when supplied; system callback remains actor-independent | `POSAdapter` / POS status | Integrated without new retry rules |
| 4 | `createStaffCall` | Guest | Yes | None | shared StaffCall entity | Preserved unchanged |
| 5 | `staffCallStatus` | Waiter/Admin | Yes | Waiter path requires operational actor; existing Admin path is unchanged | shared StaffCall entity | Integrated for accept/complete equivalents |
| 6 | `createPaymentIntent` | Guest | Yes | None | shared Payment entity | Preserved unchanged |
| 7 | `confirmPayment(source='pos')` for cash | POS system or Waiter operation | Yes | Waiter actor is validated when supplied; existing POS callback remains supported | POS confirmation boundary | Integrated without financial changes |
| 8 | shared `dispatch` and persistence/synchronization path | Guest/Waiter/Admin/POS | Depends on mutation | Domain command validation | shared store | Preserved; no parallel store or event bus |

**Operational mutations audited: 8/8.**

The old pre-Stage 7 demo waiter controls use explicit `legacyDemoStaffSubmitOrder` and `legacyDemoStaffCallStatus` compatibility commands. These commands are limited to `config.demoMode` with `source: 'legacy-demo'`. They keep the existing demo and its regression coverage operational without presenting themselves as the canonical Stage 7 Waiter boundary. Canonical Waiter mutations reject a missing operational actor.

## Actor requirements

`validateOperationalActor` builds on the existing `validateWaiterActor`; it does not introduce a second authorization system. For a Table-scoped Waiter mutation it validates:

- supplied `authContextId`, `employeeId`, `venueId` and `shiftId`;
- authenticated active Employee;
- Waiter role;
- Employee Venue access;
- active Venue context matching the supplied Venue;
- open Shift belonging to the Employee and Venue;
- supplied Shift matching that open Shift;
- actionable Table assignment for the Shift.

Missing authentication, missing or mismatched Shift, wrong Venue, missing Waiter role and unassigned/read-only Table are rejected in the domain command before mutation. Existing structured domain errors remain in use; there is no UI-only permission enforcement or silent failure.

## Attribution

Only stable IDs were added. Employee objects are not duplicated and no general audit subsystem was introduced.

- `Order`: existing `placedByWaiterId` plus optional `placedByShiftId` and `placedByVenueId` for a Waiter-created order; optional `posEmployeeId` and `posShiftId` for actor-initiated POS operations.
- `StaffCall`: optional `acceptedByEmployeeId`, `acceptedByShiftId`, `completedByEmployeeId` and `completedByShiftId`.
- `Payment`: optional `cashConfirmedByEmployeeId` and `cashConfirmedByShiftId`.

Guest-created Orders and StaffCalls do not receive Employee attribution. Guest commands do not require `OperationalActorContext`.

## Orders integration

`staffSubmitOrder` now requires and validates `OperationalActorContext`, confirms actionable assignment for the selected Table, and records Employee/Shift/Venue IDs on the existing Order. Existing idempotency, Session creation/join behaviour, Order items, execution status and shared entity identity are unchanged.

`submitOrder` remains the Guest command with its existing contract. It neither creates nor requires Employee authentication or Shift state.

No cancellation, item cancellation, approval or new Order status was added.

## StaffCalls integration

Guest `createStaffCall` remains Employee-independent. The Waiter branch of `staffCallStatus` validates the operational actor against the Call's Table and records Employee/Shift IDs when accepting and completing the existing shared Call. Existing Admin handling remains unchanged.

No ownership queue, handoff or task-management model was added.

## POS integration

The existing `POSAdapter` methods accept an optional `OperationalActorContext` for an authenticated Waiter operation. The actor is passed to the existing `posStatus` command, which validates the Order's Session-to-Table relationship and actionable assignment before applying the existing supported status transition.

Submit, error and retry continue to update the same Order. Actor attribution is retained on that Order. The existing POS/system callback path remains available without an Employee actor because POS remains the status authority. No real iiko integration or new retry rule was added.

## Cash integration

An actor-aware `confirmPayment(source='pos')` validates the Payment's Session-to-Table relationship and actionable assignment, then records the confirming Employee/Shift IDs. Actor use is limited to cash confirmation through the POS source.

The existing values and transition remain unchanged: amount, base, promotion, promo code, bonuses, tips, commission, total, cashback, Payment status, Split part status and FinancialSplit calculation are not recalculated by the new actor integration. Tests compare the financial fields before and after confirmation.

The existing system/POS confirmation path remains supported without an Employee actor.

## Synchronization

All mutations continue through the existing shared domain `dispatch` path and shared State. `lib/store.ts` remains the only synchronization and persistence implementation:

- localStorage serialization;
- Web Locks around writes;
- revisioned state;
- BroadcastChannel updates;
- storage events;
- `useSyncExternalStore` subscriptions.

The Stage 7.2 cross-role test confirms that a Guest-created Order and StaffCall are updated as the same shared entities by Waiter mutations and that no duplicate entity is created. Full Guest and Chromium regression suites confirm the supported Guest-visible status flows through the same store path. No Waiter-specific store or event bus exists.

## Migration and backward compatibility

The State version remains `2`. New attribution fields are optional, so persisted Orders, StaffCalls and Payments created before Stage 7.2 remain readable. The existing `normalizeState` path remains the single normalization mechanism; no parallel migration architecture was created.

Domain invariants validate attribution pairs when present while accepting legacy entities where all Stage 7.2 attribution fields are absent. A dedicated test deletes the new optional fields from serialized operational entities, normalizes the State and confirms the invariants.

## Verification results

| Check | Result |
|---|---:|
| TypeScript | PASS |
| Unit/domain suite | 46/46 PASS |
| Stage 7.1 targeted | 11/11 PASS |
| Stage 7.2 targeted | 12/12 PASS |
| Targeted Guest E2E | 21/21 PASS |
| Full Chromium E2E | 38/38 PASS |
| Full Chromium exit code | 0 |
| Failures | 0 |
| Skipped | 0 |

The final full Chromium run completed in approximately 2.9 minutes. The prior 38/38 E2E baseline is preserved. Existing non-failing development warnings about hydration serialization, multiple renderers and icon optimization did not produce test failures and are outside this stage.

## Stage 7.2 domain coverage

The 12 targeted tests cover:

1. valid actor creating a Waiter order with Employee, Shift and Venue attribution;
2. missing Shift, wrong Venue and unassigned Table rejection;
3. Guest Order independence from Employee identity;
4. Guest StaffCall independence from Employee identity;
5. valid Waiter accept/complete flow with attribution;
6. invalid actor rejection without partial mutation;
7. POS submit/error/retry on the same Order with retained attribution;
8. POS action rejection for a non-actionable Table;
9. valid cash confirmation with unchanged financial fields;
10. cash rejection for missing Shift and unassigned Table;
11. cross-role updates to the same shared Order and StaffCall entities;
12. legacy entities without Stage 7.2 attribution.

## Remaining gaps

- WaiterShell, Waiter routes, login/Shift screens and all WTR screens are not started.
- The old demo waiter controls remain behind explicit demo-only compatibility commands until an approved Waiter UI can supply `OperationalActorContext`.
- A production Employee authentication provider/backend is not part of this repository stage.
- Real iiko/POS integration is not implemented.
- `DOMAIN CAPABILITY GAP — HANDOFF` remains unresolved; existing Shift-close blocking behaviour is preserved.
- Order cancellation, item cancellation and manager approval remain outside the approved scope.
- Personal QR, Personal QR payment/commission, detailed tip attribution/history, Profile editing and completed Shift history remain unimplemented.
- DEC-WTR-018–035 remain OPEN.

No Guest business rule, financial calculation, Split, Payment semantics, cashback, POS authority, navigation, Design System or approved product pattern was changed.

**WAITER UI NOT STARTED**  
**HANDOFF NOT IMPLEMENTED**  
**DEC-WTR-018–035 REMAIN OPEN**
