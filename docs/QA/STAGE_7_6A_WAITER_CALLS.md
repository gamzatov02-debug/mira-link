# MIRA LINK — Stage 7.6A Waiter Calls Workspace

Status: **PASS**  
Date: **2026-10-03**  
Pre-stage Chromium baseline: **94/94 PASS, 0 failed, 0 skipped**  
Post-stage Chromium baseline: **108/108 PASS, 0 failed, 0 skipped**

## Scope and WTR coverage

| Screen | Result | Implemented behavior |
|---|---|---|
| WTR-007 Calls Inbox | PASS | Shared StaffCall list, assignment-aware actionable/read-only presentation, derived operational ordering, selected state, live counters and filters |
| WTR-008 Call Detail | PASS | Table, Zone, creation time, real status, Session context, responsible waiter, actor attribution and permitted actions |

The previous Calls placeholder was replaced inside the existing WaiterShell. No new route, store, domain entity, business rule or visual system was introduced.

## Domain audit

The existing StaffCall contract was sufficient and was not changed.

Real persisted statuses:

- `created` — presented as `Новый`;
- `accepted` — presented as `Принят` / filter `В работе`;
- `completed` — presented as `Завершён`.

Real transitions used by the UI:

- `created → accepted` through the existing `staffCallStatus` command, labelled `Принять вызов`;
- `accepted → completed` through the same command, labelled `Завершить вызов`.

Both mutations pass the existing `OperationalActorContext`. Existing `validateOperationalActor` and assignment validation remain authoritative. Read-only calls expose no mutation action. Handoff, transfer, reassignment, manager escalation and SLA states were not added.

Priority is presentation-derived. Actionable unresolved calls are ordered before read-only unresolved calls; completed calls are last. Calls within a priority group use their creation time. No persisted priority was added. Creation time remains authoritative; the mobile-first correction adds a client-only elapsed label derived from that existing timestamp. The label creates no persisted timer or parallel domain state.

## Assignment and visibility

- Calls for assigned Tables are actionable.
- Calls for other visible Venue Tables remain inspectable in read-only mode.
- The Inbox uses the existing Venue → Zone → Table and ShiftAssignment projection.
- Completed calls remain available in the `Завершённые` history filter.
- Changing a filter or moving an entity out of the selected filter clears stale selection safely.

## Cross-role synchronization

PASS. The tested sequence was:

1. Guest joined Table 12 and created one StaffCall.
2. An already-open Waiter tab received the same entity through the shared store synchronization.
3. Waiter opened WTR-008 and accepted the call.
4. Guest received the existing `Официант уже идёт` service notification.
5. Waiter completed the same call.
6. Guest received `Обращение выполнено`.
7. The StaffCall collection length remained unchanged across both mutations, proving that no duplicate or parallel Calls record was created.

Floor and Calls both continue to read the same StaffCall entity.

## Responsive QA

| Viewport | List | Detail presentation | Horizontal overflow | Touch targets |
|---:|---|---|---|---|
| 360 | PASS | BottomSheet | none | PASS |
| 375 | PASS | BottomSheet | none | PASS |
| 390 | PASS | BottomSheet | none | PASS |
| 430 | PASS | BottomSheet | none | PASS |
| 480 | PASS | BottomSheet | none | PASS |
| 768 | PASS | persistent split view | none | PASS |
| 1024 | PASS | persistent split view | none | PASS |
| 1280 | PASS | persistent split view | none | PASS |
| 1440 | PASS | persistent split view | none | PASS |

The split view uses the approved operational 40/60 pattern. The 390px list and BottomSheet, desktop selected, read-only, attention and compact empty states were manually inspected from the final screenshots.

## Verification

| Check | Result |
|---|---|
| TypeScript | PASS |
| Unit/domain | 46/46 PASS |
| Stage 7.6A targeted Calls E2E | 14/14 PASS |
| Guest/Waiter synchronization + Floor + Orders regression | 50/50 PASS |
| Guest regression | 39/39 PASS |
| Full Chromium | 108/108 PASS |
| Full Chromium failures / skipped | 0 / 0 |

Logs:

- `docs/QA/stage-7.6a/targeted-e2e.log`
- `docs/QA/stage-7.6a/regression-e2e.log`
- `docs/QA/stage-7.6a/guest-regression.log`
- `docs/QA/stage-7.6a/full-chromium.log`

The full logs contain pre-existing Vinext/Vite React hydration warnings in Guest demo paths. They produced no test failure and were not changed within this Calls-only slice.

## Screenshots

- `docs/QA/stage-7.6a/calls-list-390.png`
- `docs/QA/stage-7.6a/call-detail-390.png`
- `docs/QA/stage-7.6a/selected-768.png`
- `docs/QA/stage-7.6a/selected-1024.png`
- `docs/QA/stage-7.6a/selected-1440.png`
- `docs/QA/stage-7.6a/read-only-1440.png`
- `docs/QA/stage-7.6a/attention-1440.png`
- `docs/QA/stage-7.6a/empty-1440.png`

## Files changed

- `components/waiter/waiter-app.tsx`
- `app/waiter-design-system.css`
- `tests/e2e/waiter-calls.spec.ts`
- `docs/QA/STAGE_7_6A_WAITER_CALLS.md`
- files under `docs/QA/stage-7.6a/`

## Preserved boundaries and remaining gaps

- Domain schema and commands: unchanged.
- Financial calculations, Bill, Split, Payment and POS contracts: unchanged.
- Guest UI and business behavior: unchanged.
- Waiter Floor and Orders: unchanged and regression-verified.
- Handoff/transfer/reassignment: not implemented.
- DEC-WTR-018–035: remain open.
- Stage 7.7 Full-cycle synchronization: not started.

**STAGE 7.6A CALLS WORKSPACE — PASS**

**STAGE 7.6 ORDERS PRESERVED**

**STAGE 7.5 FLOOR PRESERVED**

**GUEST PRESERVED**

**DOMAIN BUSINESS RULES PRESERVED**

**FINANCIAL LOGIC PRESERVED**

**HANDOFF NOT IMPLEMENTED**

**DEC-WTR-018–035 REMAIN OPEN**

**STAGE 7.7 FULL-CYCLE SYNCHRONIZATION NOT STARTED**
