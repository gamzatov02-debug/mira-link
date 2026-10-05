# MIRA LINK — Stage 7.7 Pre-Implementation Audit

**Status:** PRE-IMPLEMENTATION AUDIT ONLY  
**Runtime:** unchanged  
**Implementation:** not started  
**Immutable regression baseline:** Full Chromium 94/94 PASS; failures 0; skipped 0

## 1. Evidence labels

- **DOCUMENTED** — stated directly in the current project documentation.
- **INFERRED** — conclusion from documented sequence plus current repository state; it is not an approved replacement specification.
- **NOT SPECIFIED** — no explicit project rule was found.

This audit separates the original Stage 7 roadmap from the sub-stage numbering used by the completed implementation work. It does not silently reconcile the two.

## 2. Executive finding

### DOCUMENTED original Stage 7.7

The original Stage 7 plan defines **Stage 7.7 — Full-cycle synchronization**. Its only direct scope statement is to verify, in separate browser tabs and through the existing shared store:

- Guest → Waiter → POS → Guest/Admin Order state;
- Calls;
- cash confirmation;
- Staff-created Order;
- stop-list propagation;
- tips.

Source: `docs/design-system/MIRA_LINK_WAITER_SCREEN_IMPLEMENTATION.md`, §14, lines 425–427.

Original Stage 7.7 is therefore an integration and synchronization verification stage. It is not documented as a new Calls, Finance, More, Profile or History screen implementation stage.

### DOCUMENTED original prerequisites

The original sequence places the following work before Stage 7.7:

1. Stage 7.1 — Shell, identity boundary and navigation.
2. Stage 7.2 — WTR-002–004 Dashboard, Floor and Table context.
3. Stage 7.3 — WTR-005, WTR-006, WTR-013 and WTR-014 Orders/POS.
4. Stage 7.4 — WTR-007 and WTR-008 Calls.
5. Stage 7.5 — WTR-009–011 cash/tips presentation; WTR-012 blocked.
6. Stage 7.6 — WTR-015/WTR-016 only after their decisions, with read-only identity allowed separately if accepted.
7. Stage 7.7 — Full-cycle synchronization.
8. Stage 7.8 — Responsive, accessibility and release acceptance.

Source: `docs/design-system/MIRA_LINK_WAITER_SCREEN_IMPLEMENTATION.md`, §14, lines 395–433.

### DOCUMENTED / CURRENT IMPLEMENTATION conflict

The completed implementation used different sub-stage labels:

- Stage 7.1 delivered the Domain Foundation.
- Stage 7.3 delivered Waiter UI Foundation and WTR-001.
- Stage 7.4 delivered Floor.
- Stage 7.5/7.5A delivered responsive Floor/Table split view and polish.
- Stage 7.6 delivered Orders Workspace.

Sources: `docs/QA/STAGE_7_1_DOMAIN_FOUNDATION.md`; `docs/QA/STAGE_7_3_WAITER_UI_FOUNDATION.md`; `docs/QA/STAGE_7_4_WAITER_FLOOR.md`; `docs/QA/STAGE_7_5_WAITER_SPLIT_VIEW.md`; `docs/QA/STAGE_7_5A_WAITER_SPLIT_VIEW_POLISH.md`; `docs/QA/STAGE_7_6_WAITER_ORDERS.md`.

There is no later approved roadmap document that reassigns the original Stage 7.7 number to a screen group. Calls and Finance that originally preceded 7.7 remain incomplete. Consequently, executing original Full-cycle synchronization now would skip documented screen prerequisites.

## 3. Stage 7.7 original / documented scope

| Topic | Classification | Audit result |
|---|---|---|
| Goal | DOCUMENTED | Verify the complete cross-role operational cycle across separate browser tabs and the existing shared store. |
| New WTR screens | NOT SPECIFIED | No new WTR screen is assigned to original Stage 7.7. Screen implementation belongs to original Stages 7.1–7.6. |
| WTR coverage involved in verification | INFERRED | WTR-001–010 and WTR-013–014 are exercised by WF-01–WF-04; WTR-011 is relevant to the documented tips verification. WTR-012, WTR-015 and WTR-016 are not explicitly named in the Stage 7.7 sentence. |
| Flows | DOCUMENTED | WF-01 Shift → Order → POS → ready → served; WF-02 Call → accept → Table → resolve; WF-03 pending cash → POS confirmation; WF-04 Staff-created Order. |
| Domain dependencies | DOCUMENTED | Shared State; EmployeeAuthContext; Shift/ShiftAssignment; Session; Order; StaffCall; Payment/FinancialSplit; AdditionalTip; Product/stop-list; operational actor validation; POS adapter. |
| UI components/patterns | NOT SPECIFIED for 7.7 | Stage 7.7 names no new UI. The screen matrix separately maps OrderCard, ServiceCallCard, PaymentSummaryCard, TableCard, BottomSheet, Alert, StatusBadge and ResponsiveActionGroup to the screens being verified. |
| Synchronization | DOCUMENTED | A single serialized state, Web Lock guarded dispatch, revisioned localStorage writes, BroadcastChannel, storage events and `useSyncExternalStore`; no parallel Waiter business state. |
| Acceptance | DOCUMENTED | Same Order/StaffCall/Payment/Session/Product records in Guest, Waiter and Admin; separate tabs update without reload; reviewed commands/adapters only; financial calculations remain domain-owned; no fake sync or test-only authentication. |
| QA | DOCUMENTED | Four Waiter flow E2Es, cross-tab Guest ↔ Waiter E2E, POS retry, cash confirmation, Staff-created Order regression and full Chromium. Responsive/accessibility is explicitly Stage 7.8, although the overall acceptance strategy also lists viewport and touch checks. |
| Stage 7.7 route/UI deliverables | NOT SPECIFIED | No route, component or visual deliverable is assigned directly to Stage 7.7. |
| Production backend/multi-device sync | DOCUMENTED exclusion | Real backend authentication and production multi-device synchronization remain separate integration scope. |

### Source details

- Original sequence and Stage 7.7 goal: `docs/design-system/MIRA_LINK_WAITER_SCREEN_IMPLEMENTATION.md`, §14, lines 395–433.
- Flow definitions: same file, §7, lines 168–242; `docs/MIRA_LINK_USER_FLOWS.md`, Waiter Flows, lines 122–175.
- Shared synchronization mechanism: `docs/design-system/MIRA_LINK_WAITER_SCREEN_IMPLEMENTATION.md`, §9, lines 269–288; `docs/MASTER_SPEC.md`, §25, lines 774–788.
- Acceptance and verification: Waiter implementation document, §15, lines 435–483.
- Full-cycle reference scenario: `docs/MASTER_SPEC.md`, §104, lines 2623–2659.
- Deferred production/backend scope: `docs/design-system/STAGE_7_P0_DOMAIN_CONTRACT.md`, §15, lines 553–564.

## 4. Current repository coverage — WTR-001–WTR-016

The status below reflects current runtime, not the older Stage 2 `EXISTS/MISSING` snapshot.

| WTR | Screen | Current status | Implemented in stage | Domain ready? | UI ready? | Remaining work | Blocking DEC-WTR |
|---|---|---|---|---:|---:|---|---|
| WTR-001 | Login / shift start | COMPLETE | 7.1 domain; 7.3 UI | Yes | Yes | Production credential provider remains excluded; current demo identity is deliberate. | None in 018–035 |
| WTR-002 | Shift dashboard | PARTIAL | 7.3/7.4 summaries | Yes | Partial | No dedicated Dashboard route/screen; current `dashboard` resolves to Floor while header/Floor surface priorities. | None |
| WTR-003 | Zone / floor | COMPLETE | 7.4, 7.5, 7.5A | Yes | Yes | No Stage 7.7 work required. | None |
| WTR-004 | Table detail | PARTIAL | 7.4, 7.5, 7.5A | Yes | Yes for contextual detail | Accepted mobile BottomSheet and desktop pane exist, but canonical major-screen URL/direct-entry restoration from the original routing contract is absent. | None |
| WTR-005 | Orders queue | COMPLETE | 7.6 | Yes | Yes | Cancellation stays explicitly omitted. | DEC-WTR-018–022 only if cancellation is later added |
| WTR-006 | Order detail | COMPLETE | 7.6 | Yes | Yes | No cancellation/item lifecycle is exposed. | DEC-WTR-018–022 only for that deferred scope |
| WTR-007 | Calls inbox | NOT STARTED | Route placeholder from 7.3 | Yes | No | Replace placeholder with scoped active waiter-call queue, empty/attention states and selection. | None |
| WTR-008 | Call detail | PARTIAL | Table-level call actions in 7.4/7.5 | Yes | Partial | Domain action works from Table Detail; dedicated Call Detail BottomSheet, Calls context return and stale/completed state are absent. | None |
| WTR-009 | Payments | NOT STARTED | Summary/legacy compatibility only | Yes for pending cash | No | Dedicated pending-cash list/history presentation and contextual entry are absent. | None for pending cash scope |
| WTR-010 | Cash confirmation | PARTIAL | Existing legacy operation; domain 7.2 | Yes | Partial | POS confirmation exists, but approved Payments → Cash Confirmation BottomSheet has not been migrated. | None |
| WTR-011 | Tips | SPECIFICATION GAP | Legacy aggregate only | Partial | Partial/legacy | Final detail level and shift attribution are unresolved; chronological data lacks required timestamp/shift contract. Totals-only remains a possible decision, not an approved assumption. | DEC-WTR-029; 030–031 if shift grouping is required |
| WTR-012 | Personal QR | DOMAIN CAPABILITY GAP | Not implemented | No | No | Audience, recipient scope, token lifetime, continuation and commission policy are unresolved. | DEC-WTR-023–028 |
| WTR-013 | Staff-created order | COMPLETE | Existing editor preserved; operational integration; 7.6 entry | Yes | Yes within approved compatibility boundary | A second editor must not be created. | None |
| WTR-014 | POS issue | COMPLETE | Operational integration; 7.6 | Yes | Yes | Cancellation remains outside this flow. | DEC-WTR-019/021/022 only if cancellation is added |
| WTR-015 | Profile | PARTIAL | Identity/Shift summary in More | Yes for read-only identity | Partial | No dedicated Profile route; editable fields and ownership are unresolved. A read-only profile could be implemented only as an explicitly accepted slice. | DEC-WTR-032–033 for editing; none for read-only identity |
| WTR-016 | Shift history | SPECIFICATION GAP | Not implemented | No complete read model | No | Content, retention, access and any tip/shift attribution need decisions and possibly structured actor history. | DEC-WTR-030–031, 034–035 |

### Repository evidence

- Current Waiter routes are limited to `dashboard`, `floor`, `orders`, `calls`, `more`; `dashboard` is currently normalized to Floor: `components/waiter/waiter-app.tsx`, lines 15–38.
- Calls renders `FoundationPlaceholder`; More contains only identity/obligations and the compatibility workspace: same file, line 59.
- The Calls badge already reads `workspace.calls`: same file, lines 54–59.
- `getWaiterWorkspace` returns scoped unresolved waiter Calls and pending cash Payments from the shared state: `lib/domain/waiter.ts`, lines 48–84.
- `staffCallStatus` already validates the operational actor, role and actionable Table, records employee/shift attribution and notifies the Guest: `lib/domain/engine.ts`, `staffCallStatus` case.
- Stage 7.6 explicitly leaves DEC-WTR-018–035 open and preserves the existing order editor: `docs/QA/STAGE_7_6_WAITER_ORDERS.md`, lines 170–203.

## 5. Stage 7.7 candidate scope

### Proposed minimal coherent slice: Calls Workspace — WTR-007 and WTR-008

**Classification: INFERRED / PROPOSED, NOT ORIGINAL STAGE 7.7.**

This is the smallest coherent implementation slice after the currently completed Floor and Orders work because:

1. Calls is the next permanent primary-navigation destination after Floor and Orders.
2. The route and live badge already exist, but the screen is still a placeholder.
3. WTR-007 and WTR-008 are fully specified.
4. `StaffCall`, the scoped workspace selector, operational actor validation, accepted/completed transitions and Guest notifications already exist.
5. It completes documented WF-02 without new business rules, finance changes or domain contracts.
6. None of DEC-WTR-018–035 blocks this slice.

### Proposed scope boundary

- WTR-007 Calls inbox at `/demo/waiter/calls`.
- Only `type=waiter`, non-completed Calls in the Waiter's actionable assignment scope.
- Empty, created/new, accepted/attention, action-loading and action-error presentations.
- WTR-008 Call Detail as the registered BottomSheet.
- Accept `created → accepted` and complete `accepted → completed` through existing `staffCallStatus` with current `OperationalActorContext`.
- Preserve Calls page/filter/scroll context after closing the BottomSheet.
- Contextual continuation to existing Table Detail only where current route/context restoration can do so without inventing a new routing contract.
- Guest receives the existing “Официант уже идёт” and “Обращение выполнено” notifications from shared state.
- Calls badge and Shift blocking obligations update from the same record.
- Admin calls remain excluded from the Waiter inbox.

### Explicitly outside the candidate slice

- Order or item cancellation.
- Payments/Cash workspace migration.
- Tips and Personal QR.
- Profile editing and Shift History.
- Shift handoff/self-assignment.
- New StaffCall statuses, priorities, SLA timers or escalation rules.
- Domain, POS, Split, Bill, Payment or financial model changes.
- Changes to Floor, Orders, Guest or Admin screens.
- Original Stage 7.7 full-cycle acceptance, which remains a later integration stage after its prerequisites are complete or explicitly deferred.

## 6. Open product decisions — DEC-WTR-018–035

Classification is relative to the proposed WTR-007/008 Calls slice.

### BLOCKS STAGE 7.7 candidate

**None.** Calls uses an already approved domain state machine and actor contract.

### DOES NOT BLOCK STAGE 7.7 candidate

| Decisions | Reason |
|---|---|
| DEC-WTR-018–022 | These govern Order cancellation. Stage 7.6 explicitly omits cancellation, and Calls does not touch Order cancellation. |
| DEC-WTR-032–033 | These govern editable Employee profile ownership. Profile is outside Calls; the candidate performs no Employee mutation. |

### CAN BE DEFERRED from Stage 7.7 candidate

| Decisions | Deferred target | Consequence |
|---|---|---|
| DEC-WTR-023–028 | WTR-012 Personal QR | These still block functional Personal QR and any new personal-tip finance policy. |
| DEC-WTR-029 | Final WTR-011 Tips scope | Blocks final Tips UI scope, not Calls. |
| DEC-WTR-030–031 | Shift-based Tips / WTR-016 | Required only if tips/history are grouped by Shift. |
| DEC-WTR-034–035 | WTR-016 Shift History | WTR-016 remains FUTURE and cannot be implemented without these decisions. |

This classification does not close or answer any decision. For complete Stage 7, the original decision package still treats WTR-011 detail, WTR-012, WTR-015 scope and possibly WTR-016 as outstanding work. Source: `docs/design-system/STAGE_7_WAITER_DECISION_PACKAGE.md`, §13, lines 377–423 and DEC-WTR-018–035, lines 650–882.

### Decisions required before the Calls candidate

**None.** No user product decision is required to implement the bounded WTR-007/008 slice.

## 7. Regression boundary

The following baseline is immutable unless a later approved implementation directly requires a bounded change:

- Full Chromium: **94/94 PASS**.
- Failures: **0**.
- Skipped: **0**.
- Guest Home unchanged.
- Guest Menu unchanged.
- ProductCard and Popular carousel unchanged.
- Product Detail `responsive-dialog` unchanged.
- Guest authentication / restaurant-session separation unchanged.
- Favourites unchanged.
- Floor Stage 7.5/7.5A unchanged.
- Orders Stage 7.6 unchanged.
- Existing POS contracts unchanged.
- Split, Bill, Payment and financial logic unchanged.
- Shared-store and cross-tab synchronization architecture unchanged.

No test was rerun for this audit because only documentation changed.

## 8. Proposed implementation plan — not executed

This plan applies only if the user explicitly approves redefining the next implemented sub-stage as Calls Workspace.

1. **Freeze contracts.** Reconfirm WTR-007/008 states and WF-02 against current `StaffCall` fields and `staffCallStatus`; add no status or field.
2. **Add Calls presentation.** Replace the Calls placeholder with a scoped list derived from `workspace.calls`; use existing Operational Light Tier 1 and `ServiceCallCard`/status patterns.
3. **Add WTR-008 detail.** Open the existing Tier 1 BottomSheet from a selected call; show Table/context/status/time and only the valid current action.
4. **Use the existing actor.** Build the same `OperationalActorContext` already used by Floor/Orders and dispatch the existing `staffCallStatus` command.
5. **Preserve shared effects.** Verify Guest notifications, Calls badge, Floor attention and Shift blocking obligations all update from the same StaffCall.
6. **Handle stale state.** If another tab completes a selected Call, close or show the documented completed result without recreating it.
7. **Responsive QA.** Verify 360, 375, 390, 430, 480, 768, 1024, 1280 and 1440 with no overflow, ≥44px actions, accessible labels and BottomSheet focus restoration.
8. **Regression.** Run TypeScript, 46/46 domain baseline, targeted Calls E2E, Guest ↔ Waiter cross-tab Calls E2E, Floor and Orders regression, then full Chromium with at least the immutable 94-test baseline retained.
9. **Evidence.** Add current-code screenshots and a Stage-specific QA report. Do not claim original Full-cycle Stage 7.7 complete from Calls alone.

## 9. Proposed acceptance criteria for the Calls candidate

- Calls tab shows only unresolved waiter Calls in the current actionable assignment scope.
- Admin Calls never appear.
- Empty and populated states are reachable.
- Created Call can be accepted once; accepted Call can be completed once.
- Wrong role, missing Shift, wrong Venue and read-only Table remain rejected by existing domain validation.
- Guest sees existing accepted/completed notifications without reload in a separate tab.
- Completed Call leaves the active inbox and no duplicate is created.
- Calls badge, Floor attention and Shift blocker use the same shared record.
- Closing detail restores Calls context.
- No page overflow and all actions remain accessible at required viewports.
- Floor, Orders, Guest, POS and finance regression remain green.

## 10. Domain and UI changes required if approved

### DOMAIN CHANGES REQUIRED

**None expected.** Existing `StaffCall`, `getWaiterWorkspace`, `validateOperationalActor` and `staffCallStatus` cover the documented WTR-007/008 flow. Any discovered need for a new status, SLA/escalation, reassignment or priority persistence must stop implementation and return to product/domain review.

### UI CHANGES REQUIRED

- Replace Calls placeholder with Calls list/empty state.
- Add selected-call state and WTR-008 BottomSheet.
- Reuse existing ServiceCall/Status/Alert/Button/BottomSheet patterns.
- Add local Waiter Calls layout styles only as needed.
- Preserve the current four-item Waiter navigation.

## 11. Test plan if approved

- TypeScript.
- Unit/domain: preserve current 46/46; add domain tests only if a real defect is found in existing approved behavior.
- WTR-007 empty/populated/scoped inbox.
- WTR-008 accept/complete/idempotent/stale detail.
- Admin-call exclusion and read-only/unassigned access rejection.
- Cross-tab Guest creates Call → Waiter sees it → accepts → Guest notification → completes → Guest notification.
- Floor attention and Shift obligation regression.
- Orders Stage 7.6 regression.
- Responsive matrix: 360/375/390/430/480/768/1024/1280/1440.
- Full Chromium: existing 94 tests plus new approved Calls tests; failures 0; skipped 0.

## 12. Files expected to change if approved

Expected, not modified by this audit:

- `components/waiter/waiter-app.tsx`
- `app/waiter-design-system.css`
- `tests/e2e/waiter-calls.spec.ts` — new targeted coverage
- `docs/QA/STAGE_7_7_WAITER_CALLS.md` — only if the proposed slice is explicitly approved as Stage 7.7
- `docs/QA/stage-7.7/` — screenshots/logs

Not expected to change:

- `lib/domain/model.ts`
- `lib/domain/engine.ts`
- `lib/domain/waiter.ts`
- POS/payment/financial modules
- Guest components and CSS
- Floor and Orders implementation files except a narrowly necessary shared Waiter component correction discovered by tests

## 13. Final audit outcome

### STAGE 7.7 PROPOSED SCOPE

WTR-007 Calls Inbox + WTR-008 Call Detail is the minimal next coherent implementation slice, but this is an inferred proposal caused by the evolved sub-stage numbering. The original documented Stage 7.7 remains Full-cycle synchronization.

### WTR COVERAGE BEFORE 7.7

- COMPLETE: WTR-001, WTR-003, WTR-005, WTR-006, WTR-013, WTR-014.
- PARTIAL: WTR-002, WTR-004, WTR-008, WTR-010, WTR-015.
- NOT STARTED: WTR-007, WTR-009.
- SPECIFICATION GAP: WTR-011, WTR-016.
- DOMAIN CAPABILITY GAP: WTR-012.

### OPEN BLOCKERS

No DEC-WTR-018–035 blocker exists for the proposed Calls slice. Original Full-cycle Stage 7.7 is sequencing-blocked by incomplete Calls and Finance presentations and by unapproved/deferred treatment of Tips/Profile/History prerequisites.

### DECISIONS REQUIRED

None for Calls. Explicit user approval is still required to assign the Stage 7.7 label to Calls Workspace rather than preserve the original Full-cycle synchronization meaning.

### DOMAIN CHANGES REQUIRED

None expected for Calls.

### UI CHANGES REQUIRED

Calls queue and Call Detail BottomSheet only, within the existing Waiter shell.

### TEST PLAN

Targeted WTR-007/008, cross-tab WF-02, Floor/Orders regression, full responsive matrix and complete Chromium with the 94/94 baseline preserved.

### FILES EXPECTED TO CHANGE

Waiter app presentation, local Waiter CSS, new Calls E2E and Stage-specific QA evidence only.

**STAGE 7.7 IMPLEMENTATION NOT STARTED**  
**RUNTIME UNCHANGED**  
**BASELINE 94/94 PRESERVED**
