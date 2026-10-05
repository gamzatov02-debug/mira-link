# MIRA LINK — Stage 7 Waiter Decision Package

Status: **STAGE 7.0B — P0 DECISIONS RECORDED**  
Implementation status: **NOT STARTED**  
Purpose: record approved P0 decisions and preserve open P1/P2 decisions before Stage 7.1. This document changes no runtime, domain, financial logic, POS contracts or tests.

## 1. Decision index

| ID | Status | Decision | Why needed | Options | Blocks |
|---|---|---|---|---|---|
| DEC-WTR-001 | **APPROVED** | Waiter account scope | Determines venue access and identity boundary | Organization employee with explicit VenueAccess[] | WTR-001, 015 |
| DEC-WTR-002 | **APPROVED** | Waiter sign-in method | WTR-001 requires a concrete employee identity | Personal employee identity; simplified demo auth allowed | WTR-001 |
| DEC-WTR-003 | **APPROVED** | Active identity persistence | Separates authentication from Shift | Until explicit logout or auth-session expiry | WTR-001–016 |
| DEC-WTR-004 | **APPROVED** | Logout effect | Prevents logout from mutating Shift | Warn; allow return, authorised close, or logout with Shift open | WTR-001, 002, 015 |
| DEC-WTR-005 | **APPROVED** | Open shift requirement | Gates operational actions | Active Shift required; profile/history allowed without Shift | WTR-001–016 |
| DEC-WTR-006 | **APPROVED** | Shift opening authority | Defines who can create a Shift | Waiter self-start; future Admin capability allowed | WTR-001, 002 |
| DEC-WTR-007 | **APPROVED** | Shift closing authority | Defines normal end-of-work control | Waiter self-close only without blocking obligations | WTR-001, 016 |
| DEC-WTR-008 | **APPROVED** | Multiple shifts per day | Defines Shift identity | Multiple distinct Shift entities with unique shiftId | WTR-001, 016 |
| DEC-WTR-009 | **APPROVED** | Active work on shift close | Prevents orphaned work | Block normal close until complete or supported handoff | WTR-001, 002, 016 |
| DEC-WTR-010 | **APPROVED** | Cash reconciliation | Preserves POS boundary | Not part of Waiter MVP; current cash confirmation retained | WTR-001, 009, 010, 016 |
| DEC-WTR-011 | **APPROVED** | Shift assignment basis | Defines working context | Zone assignments plus specific Table assignments | WTR-002–005, 007–013 |
| DEC-WTR-012 | **APPROVED** | Assignment changes during shift | Defines assignment authority | Manager/Admin controlled; handoff workflow remains a gap | WTR-002–004 |
| DEC-WTR-013 | **APPROVED** | Zone hierarchy | Makes Zone a domain concept | Stable Venue → Zone → Table entity relationship | WTR-002, 003 |
| DEC-WTR-014 | **APPROVED** | Zone assignment cardinality | Supports real operational coverage | One or more Zones per Employee within Shift | WTR-002, 003 |
| DEC-WTR-015 | **APPROVED** | Other-zone visibility | Defines collaboration boundary | Assigned actionable; unassigned visible read-only | WTR-002–008 |
| DEC-WTR-016 | **APPROVED** | Table Detail bill visibility | Defines operational bill scope | Existing item/quantity/status/amount/totals/payment breakdown | WTR-004 |
| DEC-WTR-017 | **APPROVED** | Table Detail operational actions | Defines supported contextual work | Existing order, status, call, cash and linked-screen actions | WTR-004, 008–010, 013 |
| DEC-WTR-018 | **OPEN** | Pre-POS order cancellation | `cancelled` exists as a value but no cancellation command exists | Waiter allowed / manager only / unavailable | WTR-006 |
| DEC-WTR-019 | **OPEN** | Post-POS order cancellation | POS source-of-truth boundary must be explicit | POS request flow / manager only / unavailable | WTR-006, 014 |
| DEC-WTR-020 | **OPEN** | Individual item cancellation | Current Order is immutable after submit except status | Supported through POS / whole order only / unavailable | WTR-006 |
| DEC-WTR-021 | **OPEN** | Cancellation reason | Auditability is unspecified | Required reason / optional reason / no waiter cancellation | WTR-006 |
| DEC-WTR-022 | **OPEN** | Cancellation approval | Defines permission escalation | Always manager / threshold-based / waiter within pre-POS scope | WTR-006, Admin permissions |
| DEC-WTR-023 | **OPEN** | Personal QR entry audience | Determines who may start personal-tip flow | Any payer / authorised MIRA user / recent venue guest | WTR-012 |
| DEC-WTR-024 | **OPEN** | Personal QR waiter/venue scope | Prevents misrouting tips | Waiter+venue / waiter global / active shift+venue | WTR-012 |
| DEC-WTR-025 | **OPEN** | Personal QR lifetime | Determines screenshot/reuse behaviour | Static / rotating / shift-bound | WTR-012 |
| DEC-WTR-026 | **OPEN** | Personal QR sharing | Defines whether QR may leave the waiter screen | On-screen only / native share / link + QR | WTR-012 |
| DEC-WTR-027 | **OPEN** | Personal QR payment continuation | Existing AdditionalTip needs a payer and current tip rules | Reuse approved AdditionalTip checkout / separate personal-tip checkout / display only until finance decision | WTR-012 |
| DEC-WTR-028 | **OPEN** | Personal-tip commission policy | New entry must not silently invent a financial rule | Existing AdditionalTip rule / fixed payer choice / separate policy | WTR-011, 012 |
| DEC-WTR-029 | **OPEN** | Tips screen detail | Defines WTR-011 content beyond aggregate totals | Totals + transactions / totals only / transactions grouped by shift | WTR-011 |
| DEC-WTR-030 | **OPEN** | Tip-to-shift attribution | Payments and AdditionalTips have no `shiftId` | Receipt time / originating visit shift / no shift grouping | WTR-011, 016 |
| DEC-WTR-031 | **OPEN** | Tips outside an open shift | Additional tips may occur after Session close | Attribute to last shift / unassigned tips / current receiving shift | WTR-011, 016 |
| DEC-WTR-032 | **OPEN** | Waiter self-editable profile fields | Employee settings are unspecified | None / limited contact-preference fields / approved personal fields | WTR-015 |
| DEC-WTR-033 | **OPEN** | Admin-controlled employee fields | Protects role, venue and assignment authority | Role+venue+assignments / include name/contact / configurable permission matrix | WTR-015, Admin staff |
| DEC-WTR-034 | **OPEN** | Shift history content | Prevents mixing four different histories | Shift summary / operational timeline / summary + timeline | WTR-016 |
| DEC-WTR-035 | **OPEN** | Shift history retention and access | Defines date range and employee access | Own retained history / recent own shifts / manager-only archive | WTR-016 |

Decision status: **17 APPROVED / 18 OPEN**. The approved resolution in this index is authoritative. Options retained in the detailed Stage 7.0A records are historical alternatives and do not override the approved P0 resolution.

### Approved P0 outcome

- Employee belongs to an Organization and receives explicit access to one or more Venues.
- Waiter uses a personal Employee identity. Authentication and Shift are separate lifecycles.
- Logout clears auth context only, warns about an open Shift and does not silently close it.
- Operational actions require an active Shift; profile and available history do not.
- Waiter may start and normally close a Shift. Close is blocked by active orders, unresolved calls and pending cash obligations until completed or handed off through a future approved workflow.
- Several unique Shifts per day are allowed. Cash reconciliation is outside Waiter MVP.
- Zone is a stable domain entity under Venue. Shift scope supports several Zones and specific Table assignments.
- Manager/Admin owns assignments. Assigned scope is actionable; unassigned scope is visible read-only.
- Table Detail may show existing operational bill breakdown and dispatch existing supported order, call, cash and POS-related actions without calculating or mutating state in UI.

## 2. Evidence model and sources

### DOCUMENTED

- Waiter IA contains Login / shift start, Dashboard, Zones → Tables → Table detail, Orders, Calls, Payments, Tips / personal QR, Staff-created order and Profile / shift history. Zones require product/domain review. Source: `docs/MIRA_LINK_PRODUCT_ARCHITECTURE.md`, sections 7–8.
- Waiter navigation is Floor / Orders / Calls / More with a persistent shift header. Source: `docs/MIRA_LINK_PRODUCT_ARCHITECTURE.md`, section 8.
- WTR-001–WTR-016 names, presentation types, parent relationships, auth and priorities are registered. Source: `docs/MIRA_LINK_SCREEN_REGISTRY.md`, Waiter rows.
- Four Waiter flows are documented: shift/order/POS, call handling, cash confirmation and waiter-created order. Source: `docs/MIRA_LINK_USER_FLOWS.md`, WF-01–WF-04.
- AdditionalTip is separate from Restaurant Session and may occur during Session, after Payment or after Session close. It must not create/reopen Session or affect visit count/average check. Source: `docs/MASTER_SPEC.md`, sections 9 and 57.
- Cash intent is not paid until POS confirmation. Source: `docs/MASTER_SPEC.md`, section 63.
- Initial tips belong to a payer's Payment flow. Additional-tip commission has two already-defined payer modes. Source: `docs/MASTER_SPEC.md`, sections 56 and 58.
- Waiter major screens require URLs; a URL does not grant access. Source: `docs/MIRA_LINK_PRODUCT_ARCHITECTURE.md`, routing section.
- Current Stage 7 specification marks eight screens and ten named capabilities as gaps. Source: `docs/design-system/MIRA_LINK_WAITER_SCREEN_IMPLEMENTATION.md`, sections 6, 8 and 16.

### CURRENT IMPLEMENTATION

- `Employee` has `id`, `name`, `role`, display-only `shift` string and assigned table IDs. `Table` has a `waiterId`. There is no Waiter auth session, active identity, Shift or Zone entity. Source: `lib/domain/model.ts`.
- The legacy Waiter UI hardcodes employee `w1`; `StaffMenu` also passes `waiterId: 'w1'`. Source: `components/demo-app.tsx`, `components/staff-menu.tsx`.
- `staffSubmitOrder` requires `waiterId`, validates the employee's assigned table and records `placedByWaiterId`. Source: `lib/domain/engine.ts`.
- `staffCallStatus` validates only role (`waiter`/`admin`), not a specific employee, and does not record the accepting/completing employee. Source: `lib/domain/engine.ts`.
- Cash confirmation takes a Payment ID through `DemoPOSAdapter`; it does not carry employee identity. Source: `lib/adapters.ts`, `lib/domain/engine.ts`.
- `Payment` and `AdditionalTip` carry `waiterId`; `Payment` has `createdAt`, while `AdditionalTip` has no timestamp, venue or shift reference. Source: `lib/domain/model.ts`.
- `ExecutionStatus` includes `cancelled`, but `posStatus` does not accept it and there is no cancellation command. Source: `lib/domain/model.ts`, `lib/domain/engine.ts`.
- Event records have timestamps but are global and generally do not provide structured waiter/shift ownership. Source: `lib/domain/model.ts`, `lib/domain/engine.ts`.
- Current tests cover staff-created orders, call role validation, cash/POS confirmation, tips and POS retry, but not Waiter auth, Shift, Zone, cancellation, personal QR, profile mutation or shift history. Source: `tests/domain.test.ts`, `tests/e2e/*.spec.ts`.

### INFERRED

- Identity must be known before any UI can safely scope tables, orders, calls, cash requests or tips to the active employee.
- If Shift is required, its state must be separate from authentication because login identity and working-period lifecycle answer different questions.
- A truthful shift history cannot be derived solely from the global Event list because shift boundaries and consistent waiter ownership are absent.
- Personal QR cannot safely reuse the table QR contract: table QR locates a table/session entry, while Personal QR is intended to locate a waiter for additional tips without creating a restaurant Session.
- Existing browser synchronization can carry approved new domain records in demo, but it is not evidence of production multi-device authentication or persistence.

### DECISION STATUS

- `DEC-WTR-001–017`: **APPROVED** in Stage 7.0B.
- `DEC-WTR-018–035`: **OPEN** and require separate product approval.
- Any future option that changes financial routing or POS cancellation still requires the corresponding domain/integration review before implementation.

## 3. WTR specification gaps

### WTR-001 — Login / shift start

**Existing specification — DOCUMENTED:** authenticated fullscreen entry identifies an employee, begins shift and proceeds to WTR-002. No Guest/User/Session may be created.

**Existing implementation — CURRENT IMPLEMENTATION:** seeded Employees exist, but the UI selects `w1` implicitly. There is no credential flow, active employee session or shift command.

**Missing specification:** account scope, credential method, identity lifetime, logout semantics, whether login and shift start are separate, shift opening/closing authority and failure/access states.

**Dependencies:** active waiter identity; authentication boundary; approved Shift lifecycle; venue access.

**Approved decisions:** DEC-WTR-001–010. The P0 screen specification is resolved; authentication, Shift and actor-validation runtime capabilities are still absent.

### WTR-002 — Shift dashboard

**Existing specification — DOCUMENTED:** post-shift orientation screen with alerts for new orders, ready items, cash pending and calls, plus assigned-zone summary.

**Existing implementation — CURRENT IMPLEMENTATION:** the legacy Staff page derives broad counts from shared state for hardcoded `w1`; no active identity/shift/zone filter exists.

**Missing specification:** whether a Shift is required, exact assignment source, Zone semantics, visibility outside assigned scope and handling of work remaining at shift close.

**Dependencies:** DEC-WTR-003, 005, 009, 011–015.

**Approved decisions:** assigned Zones/Tables are actionable; unassigned areas are visible read-only. Handoff remains a `DOMAIN CAPABILITY GAP` and no handoff action may be shown.

### WTR-003 — Zone / floor

**Existing specification — DOCUMENTED:** Floor is a primary tab showing assigned zones and tables. Waiter cannot silently gain Admin reassignment rights.

**Existing implementation — CURRENT IMPLEMENTATION:** assigned tables exist through `Table.waiterId` and `Employee.tables`; no Zone exists. Admin command `reassignWaiter` changes tables.

**Missing specification:** Zone hierarchy, optionality, assignment cardinality, assignment authority, mid-shift changes, other-zone visibility and whether assigned-table-only is accepted for MVP.

**Dependencies:** active identity; Shift assignment rules; Zone/domain contract.

**Approved decisions:** DEC-WTR-011–015. Zone is a stable domain entity; one Shift may cover several Zones plus specific Tables; Manager/Admin owns assignment.

### WTR-004 — Table detail

**Existing specification — DOCUMENTED:** opens from Floor and shows table/session/order/bill/call context; Admin alone closes or force-closes a Session.

**Existing implementation — CURRENT IMPLEMENTATION:** Table, active Session, Guest, Orders, StaffCalls and bill selectors exist. Staff-created order is table-scoped. No dedicated page or waiter permission matrix exists.

**Missing specification:** bill detail depth, allowed call actions, access to cash-payment context, allowed navigation/actions for unassigned tables and configured role restrictions.

**Dependencies:** active identity; assignment visibility; role permission decision; existing bill/call/payment selectors.

**Approved decisions:** DEC-WTR-015–017. Existing operational bill detail and supported order/call/cash actions are available for assigned Tables; unassigned Tables are read-only. Session close/force-close remains Admin-only.

### WTR-011 — Tips

**Existing specification — DOCUMENTED:** page under More for tips and additional tips; read-only totals must follow existing financial records.

**Existing implementation — CURRENT IMPLEMENTATION:** initial tip share is in FinancialSplit/Payment; AdditionalTip has waiterId and waiterShare. Aggregates are possible. Chronology by shift is not.

**Missing specification:** totals-only versus transaction list, filter/grouping rules, shift attribution and treatment of tips received outside an open shift.

**Dependencies:** Shift boundaries; AdditionalTip timestamp; approved attribution rule; no UI arithmetic beyond selectors.

**Product decisions required:** DEC-WTR-029–031. Any altered commission or distribution rule is `FINANCIAL PRODUCT DECISION REQUIRED`.

### WTR-012 — Personal QR

**Existing specification — DOCUMENTED:** high-priority page under Tips for personal additional tips. It is distinct from table/order payment QR.

**Existing implementation — CURRENT IMPLEMENTATION:** no QR payload, route, generator or scan continuation exists. `addAdditionalTip` requires an existing Guest ID and a waiter ID; it can run after Session close but does not establish a new payer identity.

**Missing specification:** audience, waiter/venue/shift scope, lifetime, shareability, payer identification, checkout continuation, payment method/integration boundary, commission presentation and misuse/revocation behaviour.

**Dependencies:** active waiter identity; approved personal-tip entry contract; existing AdditionalTip math or a separately approved financial contract.

**Product decisions required:** DEC-WTR-023–028. Commission changes are `FINANCIAL PRODUCT DECISION REQUIRED`.

### WTR-015 — Profile

**Existing specification — DOCUMENTED:** employee settings and shift identity, under More, with entry to Shift History.

**Existing implementation — CURRENT IMPLEMENTATION:** Employee exposes ID, name, role, shift label and tables. No avatar/contact/preferences/profile mutation exists. Role and assignment are Admin concerns.

**Missing specification:** exact read-only fields, any self-editable fields, which fields remain admin-controlled and whether logout/shift controls live here.

**Dependencies:** active identity; authentication/logout; employee administration ownership.

**Approved/open decisions:** DEC-WTR-004 is APPROVED; DEC-WTR-032–033 remain OPEN.

### WTR-016 — Shift history

**Existing specification — DOCUMENTED:** future-priority page reached from Profile to review completed shift activity.

**Existing implementation — CURRENT IMPLEMENTATION:** no Shift entity or shift history. Global Events cannot reliably scope all actions to a waiter or shift.

**Missing specification:** summary versus timeline, included metrics/actions, retention period, access to own history, relation to tips history and whether operational details remain visible after reassignment.

**Dependencies:** approved Shift contract; structured waiter attribution; history retention policy; tips attribution.

**Product decisions required:** DEC-WTR-030–031, 034–035.

## 4. Global Waiter Authentication

### DOCUMENTED

- WTR-001 requires authentication; Waiter access is an operational surface with assigned scope.
- Personal Employee identity, VenueAccess scope and auth/Shift separation are APPROVED. The production credential provider and detailed permission matrix remain outside P0.
- Guest authentication is global MIRA LINK user identity and is independent of Restaurant Session. This does not define staff authentication.

### CURRENT IMPLEMENTATION

- Employee/staff identity exists only as seeded records.
- Waiter is an alias of Employee; roles are only `waiter | admin`.
- No active employee identity is stored. The Waiter UI and StaffMenu hardcode `w1`.
- `app/chatgpt-auth.ts` is not a Waiter employee authentication contract.
- Current State represents one seeded venue. It does not model employee memberships across venues.

### INFERRED

- Waiter authentication should identify an Employee and authorised venue scope without creating Guest, User or Restaurant Session.
- Logout should clear active staff identity/UI access while leaving venue Orders, Sessions, Payments and Calls intact.
- Whether a single employee can access several venues cannot be derived from current data.

### DECISION REQUIRED

- Approve account scope (DEC-WTR-001), sign-in method (002), persistence/shared-device behaviour (003) and logout/Shift relation (004).
- PIN, password, phone or external identity must not be implemented until one is selected; none is documented today.

## 5. Active Waiter Identity action mapping

| Action | Waiter identity required? | Current support | Gap / minimum future contract |
|---|---:|---|---|
| Open assigned Floor/tables | Yes | Data has `waiterId`; UI hardcodes `w1` | Active Employee ID and authorised venue |
| Read assigned Orders | Yes | Orders can be joined through Session→Table; no scoped selector | Active Employee ID; assignment visibility rule |
| Read/accept/complete calls | Yes for accountability and scope | Command checks role only | Actor Employee ID and call ownership/visibility decision |
| Open Table Detail | Yes | Entities exist; no access boundary | Active Employee ID plus table access rule |
| Create staff order | Yes | **Supported:** command accepts/validates `waiterId` | Replace hardcoded ID with active identity |
| Submit/retry order to POS | Yes for authorisation/audit | Adapter accepts only Order ID | Actor identity at application boundary; POS remains status authority |
| Advance demo service status | Yes for audit | Command accepts Order ID/status only | Actor attribution if retained in final Waiter flow |
| Read pending cash requests | Yes | Can derive by table waiter; no scoped selector | Active Employee ID and assignment visibility |
| Confirm cash via POS | Yes for authorisation/audit | Adapter accepts Payment ID only | Actor identity at application boundary; POS remains confirmation authority |
| Read personal tips | Yes | Payment/AdditionalTip already carry waiterId | Active Employee ID; selectors |
| Display Personal QR | Yes | Unsupported | Active Employee ID plus approved venue/shift QR scope |
| View/edit profile | Yes | Seeded Employee read only | Active Employee ID; approved editable fields |
| View shift history | Yes | Unsupported | Active Employee ID plus Shift/history contract |

### PROPOSED DOMAIN CONTRACT — REQUIRES APPROVAL

The minimum concept after product approval is an authenticated staff context containing an Employee ID and authorised venue ID(s), separate from Restaurant Session and Guest/User. Implementation location, storage and hooks are technical choices for Stage 7.1 and are not product questions. Mutating commands that require staff authority must receive or resolve the authenticated actor and validate scope; the UI must not pass an arbitrary trusted waiter ID.

## 6. Shift

### DOCUMENTED

WTR-001 starts a shift, WTR-002 is a Shift Dashboard, WTR-015 shows shift identity and WTR-016 shows completed shifts. The documentation does not define the lifecycle.

### CURRENT IMPLEMENTATION

`Employee.shift` is a display string. There is no Shift record, ID, timestamps, status, assignments, opening/closing commands or history.

### PROPOSED DOMAIN CONTRACT — REQUIRES APPROVAL

Minimum candidate only if DEC-WTR-005 approves a Shift gate:

```ts
type Shift = {
  id: string
  venueId: string
  waiterId: string
  status: 'open' | 'closed'
  openedAt: string
  closedAt?: string
  zoneIds?: string[]       // only if Zone is approved
  tableIds?: number[]      // only if table assignment is snapshotted
}
```

The approved minimum contracts are start Shift, end own Shift when obligations are clear and read active Shift. Cash reconciliation is outside Waiter MVP. Manager override, handoff, detailed history and tip attribution remain absent until separately approved.

### DECISION REQUIRED

DEC-WTR-005–012 and DEC-WTR-030–031, 034–035 answer: mandatory gate; open/close authority; several shifts per day; active-work handling; assignments; tip relation; cash reconciliation; history.

## 7. Zone

### DOCUMENTED

Zone/floor and assigned-zone summary are part of Waiter IA. Stage 2 explicitly says current domain has assigned tables but no zone model and requires product/domain review. Admin also has Tables and zones.

### CURRENT IMPLEMENTATION

Venue has Tables. Each Table has one `waiterId`. Employee duplicates assigned table IDs. No Zone or assignment history exists. `reassignWaiter` is an Admin/domain action.

### PROPOSED DOMAIN CONTRACT — REQUIRES APPROVAL

If Zone is approved as a real entity, the minimum candidate is a venue-owned named grouping with stable ID and table membership. Waiter assignment should be represented once, either on Shift or in a dedicated assignment record, rather than inferred from duplicated arrays. Exact normalization is an implementation choice after DEC-WTR-011–015.

### DECISION REQUIRED

- Can a Table exist without Zone?
- Is a Waiter assigned to one Zone, several Zones, direct Tables, or a combination?
- Who changes assignments and can they change during Shift?
- Are other zones hidden, read-only or actionable?

## 8. Order cancellation

### DOCUMENTED

`cancelled` is a recognised execution-status example. No Waiter flow, permission, reason, approval or POS cancellation boundary is documented.

### CURRENT IMPLEMENTATION

The type includes `cancelled`, but `posStatus` permits submitted/accepted/in_progress/ready/served/completed/error only. There is no whole-order or line cancellation command. OrderItem price snapshots and successful financial records are preserved.

### DECISION REQUIRED

- DEC-WTR-018: may a Waiter cancel before POS acceptance?
- DEC-WTR-019: after POS submission/acceptance, is cancellation a POS request, manager-only action or unavailable?
- DEC-WTR-020: are individual items cancellable?
- DEC-WTR-021–022: is a reason required and when is manager approval required?

POS remains source of truth after transfer. Do not expose cancellation until an approved command and adapter result exist.

## 9. Personal Waiter QR

### DOCUMENTED

WTR-012 is a high-priority Personal QR for waiter-specific additional tips. AdditionalTip is independent of Restaurant Session. Table QR/NFC is a separate entry contract and must not be reused conceptually.

### CURRENT IMPLEMENTATION

There is no QR entity/payload/route. AdditionalTip accepts an existing `guestId`, `waiterId`, amount, commission choice and idempotency key. It does not create a Session, but it cannot identify a new external payer. No real payment provider is involved.

### DECISION REQUIRED

DEC-WTR-023–028 cover audience, waiter/venue/shift scope, lifetime, sharing, checkout continuation and commission policy. Any new commission, payout, chargeback, limit or payment rule is `FINANCIAL PRODUCT DECISION REQUIRED`.

## 10. Tips

| Tip category | Existing record | Time available | Waiter link | Shift link | Current capability |
|---|---|---:|---:|---:|---|
| Initial tips inside bill Payment | Payment + FinancialSplit | Yes (`Payment.createdAt`) | Yes (`Payment.waiterId`) | No | Aggregate and chronological read possible, not by Shift |
| Additional tips | AdditionalTip | No | Yes | No | Aggregate read possible only |
| Personal waiter QR tips | None beyond possible AdditionalTip continuation | No guaranteed payer entry | Intended | No | Unsupported |
| Aggregated tips | Derived selector/UI calculation | Derived | Filterable | No | Supported by waiter total, not history |
| Tips history by Shift | None | Incomplete | Incomplete for event audit | No | Unsupported |

`AdditionalTip.createdAt` and approved attribution are required for chronological history. A `shiftId` or deterministic approved attribution rule is required for shift grouping. No financial formula is changed by this package.

## 11. Profile settings

### Read-only — CURRENT IMPLEMENTATION

- employee name;
- role;
- display shift label;
- assigned table IDs.

The active identity and real Shift must replace the display-only shift label before it is presented as authoritative.

### Editable — DECISION REQUIRED

No editable Employee field exists. DEC-WTR-032 asks whether Stage 7 Profile is read-only or permits a closed list of personal/contact preference fields. Arbitrary settings must not be invented.

### Admin-controlled — DOCUMENTED / DECISION REQUIRED

Role and permissions belong to Admin Staff architecture; table reassignment is currently an Admin action. DEC-WTR-033 must confirm ownership of name/contact, venue membership and assignments. The concrete permission matrix remains a separate product decision.

## 12. Completed Shift History

| History kind | Existing data | Missing data |
|---|---|---|
| Order history | Orders have createdAt; waiter-created orders have placedByWaiterId | POS/service actor, Shift link, consistent waiter ownership |
| Shift history | None | Shift entity, boundaries, status, assignments, close result |
| Tips history | Payments partly support chronology; AdditionalTips do not | AdditionalTip timestamp, Shift attribution |
| Activity log | Global Events have timestamp/type/detail | Structured waiterId, Shift ID, venue scope, retention/access rule |

WTR-016 must not combine these into an invented audit trail. DEC-WTR-034 selects summary, timeline or both; DEC-WTR-035 sets retention/access. WTR-016 is `FUTURE` in the Screen Registry and may be deferred without blocking the first working Waiter MVP if explicitly approved.

## 13. Priority and critical path

Priorities follow registered screen priority and actual flow dependencies; they are not implementation estimates.

### P0 — required for functional Waiter MVP

- Active waiter identity and venue scope — every scoped action depends on it.
- Authentication entry and logout boundary — WTR screens require auth.
- Decision whether Shift is a mandatory gate; if yes, minimal Shift open/close lifecycle.
- Assignment basis and visibility — tables, orders, calls and cash requests need a safe working scope.
- WTR-004 Table Detail bill/action permissions — core floor workflow cannot be safely exposed without them.
- Existing order/call/POS/cash actions must resolve the authenticated actor and retain existing POS/domain authority.

### P1 — required for complete Stage 7

- Full Zone model and mid-shift assignment rules if Zone is approved for Stage 7.
- WTR-011 tip detail and attribution sufficient for approved history.
- WTR-012 Personal QR contract and finance review; it is HIGH priority but not needed for WF-01–WF-04.
- WTR-015 approved read-only/editable profile scope.
- Cancellation only if product requires it in Stage 7; otherwise WTR-006 explicitly omits it.
- Cash reconciliation if selected as part of shift closure.

### P2 — can be deferred

- WTR-016 completed Shift History, registered as FUTURE.
- Long-term retention/activity audit beyond the current working shift.
- Multi-venue employee access if MVP is explicitly venue-bound.
- QR sharing/rotation features beyond an approved safe minimum.
- Individual-item cancellation if whole-order/POS workflow is sufficient.

### Critical path

```text
Venue/employee access scope
→ Waiter authentication
→ Active waiter identity
→ Shift gate decision
→ Shift lifecycle (only if required)
→ Zone/table assignment and visibility
→ Table/Order/Call/Cash permissions
→ Core WTR-002–010 and WTR-013–014 flows
→ Tips detail and Personal QR financial contract
→ Profile
→ Completed Shift History
```

Order cancellation can be decided in parallel with core UI but cannot be implemented until the POS/domain authority is approved. Personal QR requires identity first and its financial decisions before implementation.

## 14. Detailed decision records

Each record is a product/business question. Technical implementation choices remain with engineering after approval.

### DEC-WTR-001 — Waiter account scope

**Current state:** one seeded venue and Employee records; no membership model.  
**Question:** Is a Waiter identity restricted to one venue, selected venues, or the whole organisation?  
**Option A:** one venue per employee identity; simplest scope, separate identity/membership needed for another venue.  
**Option B:** one identity with explicitly assigned venues; venue selection is required when more than one is available.  
**Option C:** organisation-wide access; requires stronger role/permission controls.  
**Technical consequences:** authorised venue membership and active venue context; no Guest Session impact.  
**Screens affected:** WTR-001, 002, 015.  
**Domain affected:** Employee/access context.  
**Priority:** P0.  
**Blocks implementation:** yes.

### DEC-WTR-002 — Waiter sign-in method

**Current state:** no waiter credential contract is documented or implemented.  
**Question:** Which business sign-in journey is approved for Waiter MVP?  
**Option A:** venue-issued employee PIN on a trusted venue device.  
**Option B:** individual employee credential such as phone/email plus secret.  
**Option C:** external staff identity/SSO supplied by venue infrastructure.  
**Technical consequences:** identity provider/verification boundary and loading/error/recovery states; no method is to be simulated as production auth.  
**Screens affected:** WTR-001.  
**Domain affected:** authentication boundary, not Restaurant Session.  
**Priority:** P0.  
**Blocks implementation:** yes.

### DEC-WTR-003 — Active identity persistence

**Current state:** `w1` is hardcoded.  
**Question:** How long does an authenticated Waiter remain active on a device?  
**Option A:** until explicit logout.  
**Option B:** only while an approved Shift is open.  
**Option C:** short device session requiring re-entry after inactivity.  
**Technical consequences:** resume/lock/switch-employee states and actor resolution.  
**Screens affected:** all WTR screens.  
**Domain affected:** auth context.  
**Priority:** P0.  
**Blocks implementation:** yes.

### DEC-WTR-004 — Logout effect

**Current state:** no logout or Shift exists.  
**Question:** Does logout end only device identity, require shift closure, or initiate a managed handoff?  
**Option A:** logout clears identity only; open Shift remains and must be resumed/closed separately.  
**Option B:** logout is blocked until Shift closes.  
**Option C:** logout requires manager-approved handoff when active work exists.  
**Technical consequences:** Orders/Sessions/Payments must never be deleted; only identity/Shift relation changes.  
**Screens affected:** WTR-001, 002, 015.  
**Domain affected:** auth and possibly Shift.  
**Priority:** P0.  
**Blocks implementation:** yes.

### DEC-WTR-005 — Open shift requirement

**Current state:** only a display string; WF-01 begins with shift start.  
**Question:** Must a Waiter have an open Shift before viewing or acting on operational work?  
**Option A:** required for every operational action.  
**Option B:** optional tracking; authenticated staff may work without Shift.  
**Option C:** no Shift gate in MVP; WTR-001 becomes login only and Shift screens remain deferred.  
**Technical consequences:** determines whether a Shift entity is P0.  
**Screens affected:** WTR-001–016.  
**Domain affected:** Shift/access policy.  
**Priority:** P0.  
**Blocks implementation:** yes.

### DEC-WTR-006 — Shift opening authority

**Current state:** no command.  
**Question:** Who may open a Waiter Shift?  
**Option A:** Waiter self-start.  
**Option B:** manager/admin only.  
**Option C:** either, with actor recorded.  
**Technical consequences:** permission check and audit actor.  
**Screens affected:** WTR-001, 002.  
**Domain affected:** Shift.  
**Priority:** P0 if DEC-WTR-005 A; otherwise P1/P2.  
**Blocks implementation:** conditional yes.

### DEC-WTR-007 — Shift closing authority

**Current state:** no command.  
**Question:** Who may close a Shift?  
**Option A:** Waiter self-close when all close conditions pass.  
**Option B:** manager/admin only.  
**Option C:** Waiter requests close and manager confirms.  
**Technical consequences:** permission, pending approval and history status.  
**Screens affected:** WTR-001, 015, 016.  
**Domain affected:** Shift.  
**Priority:** P0 if Shift required.  
**Blocks implementation:** conditional yes.

### DEC-WTR-008 — Multiple shifts per day

**Current state:** no Shift identity.  
**Question:** Can one Waiter have more than one completed Shift in the same day?  
**Option A:** yes, every open/close creates a distinct Shift.  
**Option B:** one Shift per venue per day.  
**Option C:** reopening resumes the same Shift within an approved window.  
**Technical consequences:** uniqueness, reopen rules and history grouping.  
**Screens affected:** WTR-001, 016.  
**Domain affected:** Shift.  
**Priority:** P1.  
**Blocks implementation:** no for shell; yes for final history.

### DEC-WTR-009 — Active work on shift close

**Current state:** work belongs to venue/table records, not a Shift.  
**Question:** What must happen when active orders, calls or pending cash remain at close?  
**Option A:** block close until resolved.  
**Option B:** require explicit handoff to another waiter/manager.  
**Option C:** allow close; work remains in venue queue for authorised staff.  
**Technical consequences:** close validation or handoff contract; no financial state may be altered.  
**Screens affected:** WTR-001, 002, 009, 016.  
**Domain affected:** Shift/assignments.  
**Priority:** P0 if Shift required.  
**Blocks implementation:** conditional yes.

### DEC-WTR-010 — Cash reconciliation

**Current state:** pending cash is confirmed via POS; no till or shift balance exists.  
**Question:** Is cash reconciliation part of Waiter Shift close?  
**Option A:** required reconciliation with approved expected/declared values.  
**Option B:** read-only summary of POS-confirmed cash.  
**Option C:** outside MIRA; no reconciliation UI.  
**Technical consequences:** Option A is a new financial capability and requires separate contract; B reuses confirmed payments.  
**Screens affected:** WTR-001, 009, 010, 016.  
**Domain affected:** Shift/finance.  
**Priority:** P1.  
**Blocks implementation:** no for core; yes for final Shift close if A.

### DEC-WTR-011 — Shift assignment basis

**Current state:** direct table assignment exists; Zone does not.  
**Question:** Is a Waiter's working scope assigned by Zones, Tables, or both?  
**Option A:** Zones are authoritative and imply their Tables.  
**Option B:** Tables are authoritative; Zone is presentation grouping.  
**Option C:** both are allowed with explicit conflict rules.  
**Technical consequences:** assignment source and selectors.  
**Screens affected:** WTR-002–005, 007–013.  
**Domain affected:** Zone/Table/Shift assignment.  
**Priority:** P0.  
**Blocks implementation:** yes.

### DEC-WTR-012 — Assignment changes during shift

**Current state:** Admin can reassign a table; Waiter cannot.  
**Question:** Who may change a Waiter's active assignment during Shift?  
**Option A:** manager/admin only.  
**Option B:** Waiter requests; manager approves.  
**Option C:** Waiter may self-change within allowed venue scope.  
**Technical consequences:** permissions, audit and live queue refresh.  
**Screens affected:** WTR-002–004.  
**Domain affected:** assignments.  
**Priority:** P1.  
**Blocks implementation:** no if current Admin-only rule is explicitly retained.

### DEC-WTR-013 — Zone hierarchy

**Current state:** no Zone entity.  
**Question:** Is Zone mandatory, optional, or deferred to assigned-table-only MVP?  
**Option A:** every Table belongs to exactly one Zone.  
**Option B:** Zone is optional; a Table may be unzoned.  
**Option C:** defer Zone; Floor shows assigned Tables only.  
**Technical consequences:** Zone model and Admin maintenance for A/B; documented scope reduction for C.  
**Screens affected:** WTR-002, 003.  
**Domain affected:** Venue/Zone/Table.  
**Priority:** P0 decision, P1 implementation if C selected.  
**Blocks implementation:** yes as a decision.

### DEC-WTR-014 — Zone assignment cardinality

**Current state:** no Zone assignment.  
**Question:** May one Waiter cover one Zone, several Zones, or no Zone assignment?  
**Option A:** exactly one active Zone.  
**Option B:** one or more active Zones.  
**Option C:** no Zone assignment; direct Tables only.  
**Technical consequences:** Shift/assignment cardinality and UI grouping.  
**Screens affected:** WTR-002, 003.  
**Domain affected:** Zone/Shift.  
**Priority:** P1.  
**Blocks implementation:** conditional on Zone approval.

### DEC-WTR-015 — Other-zone visibility

**Current state:** no defined cross-assignment scope.  
**Question:** What can a Waiter see and do outside assigned scope?  
**Option A:** nothing; hidden.  
**Option B:** venue-wide read-only, assigned scope actionable.  
**Option C:** venue-wide actionable work for all Waiters.  
**Technical consequences:** selector and command authorisation rules.  
**Screens affected:** WTR-002–010, 013–014.  
**Domain affected:** permissions/assignments.  
**Priority:** P0.  
**Blocks implementation:** yes.

### DEC-WTR-016 — Table Detail bill visibility

**Current state:** full bill selector exists; no Waiter visibility rule.  
**Question:** How much bill information may the assigned Waiter see?  
**Option A:** total/paid/remaining only.  
**Option B:** full item and payment breakdown without Admin actions.  
**Option C:** no bill details; only payment/cash status.  
**Technical consequences:** presentation selector and privacy boundary; financial calculations stay unchanged.  
**Screens affected:** WTR-004.  
**Domain affected:** read permissions only.  
**Priority:** P0.  
**Blocks implementation:** yes.

### DEC-WTR-017 — Table Detail operational actions

**Current state:** create order, call status and cash context exist separately; no WTR-004 contract.  
**Question:** Which actions are available from assigned Table Detail?  
**Option A:** create order, accept/complete waiter call and open pending-cash confirmation.  
**Option B:** create order only; calls/payments remain in primary queues.  
**Option C:** actions follow an approved role permission configuration.  
**Technical consequences:** contextual navigation and permission checks; no Session close/force-close.  
**Screens affected:** WTR-004, 008–010, 013.  
**Domain affected:** access orchestration only.  
**Priority:** P0.  
**Blocks implementation:** yes.

### DEC-WTR-018 — Pre-POS order cancellation

**Current state:** unsupported.  
**Question:** May a Waiter cancel a submitted Order before POS acceptance?  
**Option A:** yes through a reviewed command.  
**Option B:** manager/admin only.  
**Option C:** unavailable in Stage 7.  
**Technical consequences:** new command/status event if A/B; item/payment invariants require tests.  
**Screens affected:** WTR-006.  
**Domain affected:** Order.  
**Priority:** P1/P2.  
**Blocks implementation:** no if omitted explicitly.

### DEC-WTR-019 — Post-POS order cancellation

**Current state:** POS accepts/statuses an Order; no cancellation adapter.  
**Question:** What is the approved path after an Order reaches POS?  
**Option A:** Waiter sends a cancellation request and POS result is authoritative.  
**Option B:** manager handles it through a separate Admin/POS flow.  
**Option C:** no MIRA cancellation action.  
**Technical consequences:** Option A requires POSAdapter/domain contract changes; never set `cancelled` locally without POS result.  
**Screens affected:** WTR-006, 014.  
**Domain affected:** Order/POS.  
**Priority:** P1/P2.  
**Blocks implementation:** no if omitted explicitly.

### DEC-WTR-020 — Individual item cancellation

**Current state:** no item lifecycle after Order creation.  
**Question:** Must Stage 7 support cancelling individual submitted items?  
**Option A:** yes through POS-authoritative item state.  
**Option B:** only whole-order cancellation.  
**Option C:** no cancellation in Stage 7.  
**Technical consequences:** A requires a new item status/refund/bill contract and is not a UI-only change.  
**Screens affected:** WTR-006.  
**Domain affected:** OrderItem, Bill, POS, possibly finance.  
**Priority:** P2.  
**Blocks implementation:** no.

### DEC-WTR-021 — Cancellation reason

**Current state:** no reason model.  
**Question:** If cancellation is approved, is a reason mandatory?  
**Option A:** required from approved reason list plus optional comment.  
**Option B:** optional free comment.  
**Option C:** no waiter cancellation, so no reason UI.  
**Technical consequences:** audit field/event and validation.  
**Screens affected:** WTR-006.  
**Domain affected:** cancellation record.  
**Priority:** follows DEC-WTR-018/019.  
**Blocks implementation:** conditional yes.

### DEC-WTR-022 — Cancellation approval

**Current state:** no cancellation permission.  
**Question:** If Waiter cancellation exists, when is manager approval required?  
**Option A:** always.  
**Option B:** only after POS acceptance or above an approved threshold.  
**Option C:** not required within approved pre-POS scope.  
**Technical consequences:** approval state and Admin handoff; threshold is a separate configured business value if B.  
**Screens affected:** WTR-006, Admin operations.  
**Domain affected:** permissions/cancellation.  
**Priority:** follows cancellation decision.  
**Blocks implementation:** conditional yes.

### DEC-WTR-023 — Personal QR entry audience

**Current state:** AdditionalTip needs an existing Guest record.  
**Question:** Who may scan and pay through Personal QR?  
**Option A:** any payer without MIRA account or restaurant Session.  
**Option B:** authorised MIRA LINK user only.  
**Option C:** a Guest with a recent/current venue relationship only.  
**Technical consequences:** payer identity and receipt/history boundary; A needs an approved non-Guest payer contract.  
**Screens affected:** WTR-012 and Guest/public continuation.  
**Domain affected:** identity/AdditionalTip/payment.  
**Priority:** P1.  
**Blocks implementation:** yes.

### DEC-WTR-024 — Personal QR waiter/venue scope

**Current state:** AdditionalTip has waiterId but no venue/shift field.  
**Question:** What recipient context does QR identify?  
**Option A:** waiter + venue.  
**Option B:** waiter globally across venues.  
**Option C:** waiter + active Shift + venue.  
**Technical consequences:** payload lookup, revocation and attribution.  
**Screens affected:** WTR-012.  
**Domain affected:** employee/venue/Shift/tips.  
**Priority:** P1.  
**Blocks implementation:** yes.

### DEC-WTR-025 — Personal QR lifetime

**Current state:** no token contract.  
**Question:** Is Personal QR static, rotating or Shift-bound?  
**Option A:** static and reusable until revoked.  
**Option B:** rotating/short-lived.  
**Option C:** valid only for the active Shift.  
**Technical consequences:** token issuance/expiry and offline screenshot behaviour.  
**Screens affected:** WTR-012.  
**Domain affected:** QR token/Shift.  
**Priority:** P1.  
**Blocks implementation:** yes.

### DEC-WTR-026 — Personal QR sharing

**Current state:** only on-screen presentation is named.  
**Question:** May a Waiter share Personal QR outside the app?  
**Option A:** on-screen display only.  
**Option B:** native image share.  
**Option C:** shareable link plus QR.  
**Technical consequences:** abuse/revocation exposure and share UI.  
**Screens affected:** WTR-012.  
**Domain affected:** token access policy.  
**Priority:** P2.  
**Blocks implementation:** no if A is approved.

### DEC-WTR-027 — Personal QR payment continuation

**Current state:** existing demo AdditionalTip command is guest-based and no real charge occurs.  
**Question:** What approved flow follows a successful QR scan?  
**Option A:** reuse the existing AdditionalTip amount/commission/payment presentation with an approved payer identity.  
**Option B:** create a separate personal-tip checkout product flow.  
**Option C:** Stage 7 displays QR only; payment continuation waits for a separate finance/API decision.  
**Technical consequences:** A/B require payer/payment contracts; C permits only non-functional presentation clearly labelled.  
**Screens affected:** WTR-012 and payer continuation.  
**Domain affected:** AdditionalTip/payment adapter.  
**Priority:** P1.  
**Blocks implementation:** yes for functional QR.

### DEC-WTR-028 — Personal-tip commission policy

**Current state:** AdditionalTip already supports guest-pays or withheld-from-waiter commission.  
**Question:** Which commission choice applies to Personal QR tips?  
**Option A:** reuse the current AdditionalTip payer choice.  
**Option B:** use one product-configured default without payer choice.  
**Option C:** approve a separate Personal QR commission policy.  
**Technical consequences:** B/C require explicit financial configuration; C may change calculations and needs finance review.  
**Screens affected:** WTR-011, 012 and payer checkout.  
**Domain affected:** finance/AdditionalTip.  
**Priority:** P1.  
**Blocks implementation:** yes. **FINANCIAL PRODUCT DECISION REQUIRED.**

### DEC-WTR-029 — Tips screen detail

**Current state:** aggregate totals are possible; AdditionalTip chronology is not.  
**Question:** What must WTR-011 show in Stage 7?  
**Option A:** totals plus chronological transactions.  
**Option B:** totals only.  
**Option C:** transactions grouped by approved Shift.  
**Technical consequences:** A/C require timestamp completion; C also requires Shift attribution.  
**Screens affected:** WTR-011.  
**Domain affected:** tip read model.  
**Priority:** P1.  
**Blocks implementation:** yes for final WTR-011 scope.

### DEC-WTR-030 — Tip-to-shift attribution

**Current state:** no `shiftId` on Payment/AdditionalTip.  
**Question:** If tips are grouped by Shift, which rule owns a tip?  
**Option A:** Shift open when payment/tip is received.  
**Option B:** Shift associated with the originating visit/service.  
**Option C:** do not group tips by Shift.  
**Technical consequences:** A/B require durable attribution and edge-case rules; C keeps venue/waiter chronology only.  
**Screens affected:** WTR-011, 016.  
**Domain affected:** Payment/AdditionalTip/Shift.  
**Priority:** P1.  
**Blocks implementation:** yes for shift-based tips.

### DEC-WTR-031 — Tips outside an open shift

**Current state:** AdditionalTip is valid after Session close.  
**Question:** How is a tip received when the waiter has no open Shift represented?  
**Option A:** associate with the last Shift related to the visit.  
**Option B:** show as unassigned/out-of-shift personal tip.  
**Option C:** associate with the current receiving Shift if one exists.  
**Technical consequences:** affects history and payout reporting; no arithmetic change is implied.  
**Screens affected:** WTR-011, 016.  
**Domain affected:** AdditionalTip/Shift.  
**Priority:** P1.  
**Blocks implementation:** yes for shift grouping. **FINANCIAL PRODUCT DECISION REQUIRED.**

### DEC-WTR-032 — Waiter self-editable profile fields

**Current state:** no mutable profile fields.  
**Question:** Is WTR-015 read-only, or which closed category may the Waiter edit?  
**Option A:** fully read-only identity/assignment summary.  
**Option B:** only personal contact/notification preferences approved later as named fields.  
**Option C:** a separately approved set of personal fields, excluding role/venue/assignment.  
**Technical consequences:** B/C require explicit fields, validation and mutation ownership.  
**Screens affected:** WTR-015.  
**Domain affected:** Employee/profile.  
**Priority:** P1.  
**Blocks implementation:** no for read-only profile; yes for editing.

### DEC-WTR-033 — Admin-controlled employee fields

**Current state:** role/table assignment are administrative; exact permission matrix is unresolved.  
**Question:** Which field categories must remain Admin-controlled?  
**Option A:** role, venue membership and assignments only.  
**Option B:** Option A plus legal/display name and contact data.  
**Option C:** all Employee data until the permission matrix is approved.  
**Technical consequences:** determines which WTR-015 fields are read-only and prevents conflicting mutations.  
**Screens affected:** WTR-015 and Admin Staff.  
**Domain affected:** Employee/permissions.  
**Priority:** P1.  
**Blocks implementation:** yes for editable profile.

### DEC-WTR-034 — Shift history content

**Current state:** no Shift record; Events are insufficient.  
**Question:** What is the minimum WTR-016 product?  
**Option A:** completed Shift summaries (times, assignment and approved totals).  
**Option B:** chronological operational timeline.  
**Option C:** summary with drill-down timeline.  
**Technical consequences:** B/C require structured actor events; approved metrics must come from selectors.  
**Screens affected:** WTR-016.  
**Domain affected:** Shift/history/events.  
**Priority:** P2 (Screen Registry FUTURE).  
**Blocks implementation:** no for MVP; yes for WTR-016.

### DEC-WTR-035 — Shift history retention and access

**Current state:** no policy or employee-scoped archive.  
**Question:** How much own Shift history may a Waiter access?  
**Option A:** all retained own Shifts.  
**Option B:** a product-defined recent period/count.  
**Option C:** no Waiter archive; managers only.  
**Technical consequences:** retention, pagination and access checks; exact duration/count must be supplied if B.  
**Screens affected:** WTR-016.  
**Domain affected:** history/access policy.  
**Priority:** P2.  
**Blocks implementation:** no for MVP; yes for WTR-016.

## 15. Tests potentially affected after future approval

No tests are changed in Stage 7.0A. Future implementation must extend, not weaken, coverage for:

- employee identity cannot be spoofed and creates no Guest/User/Restaurant Session;
- Shift open/close authority, idempotency and active-work rule;
- Zone/table visibility and reassignment propagation;
- staff-created order uses authenticated actor while preserving existing cart/idempotency/price tests;
- call accept/complete records and validates the authorised actor without weakening role separation;
- cash confirmation preserves POS-only financial confirmation;
- cancellation, if approved, preserves price, bill, payment and POS invariants;
- Personal QR never creates a restaurant Session and retains approved AdditionalTip financial assertions;
- tip/history attribution is deterministic;
- existing 38/38 Guest Chromium baseline and 23/23 unit baseline remain regression requirements.

## 16. Stop condition

P0 decisions are approved, but Stage 7.1 must not begin during Stage 7.0B. The contracts in `STAGE_7_P0_DOMAIN_CONTRACT.md` require separate implementation approval and verification first. P1/P2 gaps must remain visibly open and must not be filled with fake auth, mock Shift, local cancellation, invented QR payload or UI-side financial logic.

**RUNTIME UNCHANGED**  
**DOMAIN UNCHANGED**  
**TESTS UNCHANGED**  
**STAGE 7.1 NOT STARTED**
