# MIRA LINK — Guest Screen Implementation

## Stage 6 Scope

Stage 6 evolves the existing Guest implementation in `components/demo-app.tsx`, `components/guest-home.tsx`, `components/nearby.tsx` and `components/guest-events.tsx`. It keeps the browser-local domain engine and its commands as the source of truth. The screen layer uses the Stage 5 pattern API for event and promotion discovery and consumes presentation-only status adapters.

## Guest Navigation

The permanent navigation is **Home / Menu / Nearby / Events / More**. Cart, Bill, Split, payment, staff calls and Profile are contextual destinations. Promotions are reached from Home, discovery and contextual CTAs; they are not a bottom-navigation item.

## Contexts

| Context | Screens | Boundary |
| --- | --- | --- |
| Visit | GST-001–020 | Current table/session, orders, bill, Split, payment, tips and calls use existing commands. |
| Discover | GST-021–027, GST-038 | Nearby does not create a session. Venue menu and delivery retain separate discovery/delivery state. |
| Account | GST-030–037 | Persistent features require the existing registered Guest state. Anonymous Visit actions remain available. |

## Screen Implementation Matrix

| Screen ID | Screen | Priority | Presentation | Previous State | Stage 6 State | Route / Host | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- |
| GST-001 | Entry / table join | CORE | Fullscreen | Exists | PRESERVED | `/demo/guest/welcome` | Existing table token command. |
| GST-002 | Entry error | HIGH | Fullscreen | Missing | PRESENTATION SHELL | Entry host | Existing command error toast; dedicated error copy remains deferred. |
| GST-003 | Active-session join | CORE | Bottom sheet | Exists | PRESERVED | Entry host | Existing explicit confirmation. |
| GST-004 | Visit Home | CORE | Page | Exists | EVOLVED | `/demo/guest/home` | Visit-oriented home and promotion CTA retained. |
| GST-005 | Menu | CORE | Page | Exists | PRESERVED | `/demo/guest/menu` | Categories, search, stop-list and cart contract retained. |
| GST-006 | Product Detail | CORE | Bottom sheet | Exists | PRESERVED | Menu host | Existing modifier/cart composition. |
| GST-007 | Cart | CORE | Page | Exists | PRESERVED | `/demo/guest/order` | Existing cart command remains source of truth. |
| GST-008 | Order confirmation | HIGH | Inline state | Partial | PRESERVED | Order host | Existing success feedback. |
| GST-009 | Order status | CORE | Page | Exists | EVOLVED | Home/order host | Uses explicit order presentation adapter for current order. |
| GST-010 | Bill | CORE | Page | Exists | PRESERVED | `/demo/guest/bill` | Domain bill selector remains authoritative. |
| GST-011 | Split selection | CORE | Embedded panel | Exists | PRESERVED | Bill host | Existing Split command. |
| GST-012 | Item split | CORE | Embedded panel | Exists | PRESERVED | Split host | Existing allocation contract. |
| GST-013 | Equal/custom/all split | CORE | Embedded panel | Exists | PRESERVED | Split host | Existing allocation contract. |
| GST-014 | Payment method | CORE | Bottom sheet | Partial | PRESERVED | Bill host | Existing payment flow. |
| GST-015 | Online payment | CORE | Fullscreen flow | Partial | PRESERVED | Bill host | Existing payment adapter. |
| GST-016 | Cash payment pending | CORE | Page | Exists | PRESERVED | Bill host | Existing POS confirmation state. |
| GST-017 | Payment result / receipt | HIGH | Fullscreen flow | Partial | PRESERVED | Bill host | Existing payment result feedback. |
| GST-018 | Tips | CORE | Bottom sheet | Exists | PRESERVED | `/demo/guest/tips` | No calculation moved to UI. |
| GST-019 | Staff call | CORE | Bottom sheet | Exists | PRESERVED | `/demo/guest/waiter` | Existing command/deduplication. |
| GST-020 | Call status | HIGH | Inline state | Exists | EVOLVED | Staff-call host | Uses explicit call presentation adapter. |
| GST-021 | Nearby | CORE | Page | Exists | PRESERVED | `/demo/guest/nearby` | Map and list alternative retained; no session creation. |
| GST-022 | Venue Detail | HIGH | Page | Partial | PRESERVED | Nearby host | Existing venue detail modal preserves discovery isolation. |
| GST-023 | Venue Menu Preview | HIGH | Tab | Exists | PRESERVED | Venue detail host | Separate from table order/cart. |
| GST-024 | Delivery | HIGH | Fullscreen flow | Exists | PRESERVED | Venue/detail host | Existing independent delivery command. |
| GST-025 | Events | MEDIUM | Page | Exists | EVOLVED | `/demo/guest/events` | Stage 5 `EventCard` composition. |
| GST-026 | Event Detail | MEDIUM | Modal | Exists | PRESERVED | Events host | Existing booking/venue CTA only. |
| GST-027 | Promotions | MEDIUM | Page | Partial | EVOLVED | `/demo/guest/promotions` | Stage 5 `PromotionCard` composition. |
| GST-028 | Booking | HIGH | Page | Exists | PRESERVED | `/demo/guest/booking` | Existing booking contract. |
| GST-029 | Review | MEDIUM | Page | Exists | PRESERVED | `/demo/guest/review` | Existing registered-guest check. |
| GST-030 | Account / Profile | HIGH | Page | Partial | EVOLVED | `/demo/guest/profile` | Auth gate protects account route entry. |
| GST-031 | Services | MEDIUM | Page | Partial | PRESERVED | More host | Existing partner/service surfaces. |
| GST-032 | Loyalty / Bonuses | HIGH | Page | Partial | PRESERVED | `/demo/guest/bonuses` | Existing balance and transactions. |
| GST-033 | Order / Visit History | HIGH | Page | Partial | PRESERVED | `/demo/guest/history` | Existing account payment history. |
| GST-034 | Favourites | MEDIUM | Page | Partial | PRESERVED | `/demo/guest/favorites` | Existing persistence contract. |
| GST-035 | Notifications | MEDIUM | Page | Partial | PRESERVED | `/demo/guest/notifications` | Existing service/marketing notifications. |
| GST-036 | Communication Settings | MEDIUM | Page | Partial | PRESERVED | `/demo/guest/communications` | Service and marketing remain separate. |
| GST-037 | Account Entry Requirement | HIGH | Bottom sheet | Missing | IMPLEMENTED | Account navigation | Explains requirement without blocking Visit actions. |
| GST-038 | Promotion Detail | MEDIUM | Bottom sheet | Missing | IMPLEMENTED | Promotions host | Shows supplied description; eligibility remains domain-owned. |

## Screen → Product Pattern Mapping

| Guest screen | Stage 5 pattern |
| --- | --- |
| Events / Event Detail | `EventCard` |
| Promotions / Promotion Detail | `PromotionCard` |
| Menu | `ProductCard`, `ProductListItem` available for compact composition |
| Nearby / Venue | `VenueCard`, `ProductListItem`, `PromotionCard` available where presentation fits |
| Order status / History | `OrderCard` available to screen composition |
| Bill / Split / Payment / Tips / Loyalty | `BillSummary`, `SplitParticipantRow`, `PaymentSummaryCard`, `TipSummary`, `BonusSummary` available; current domain presentation remains preserved pending incremental migration. |

## Anonymous and Account Access

Anonymous Guests retain entry, menu, product configuration, cart, order, bill, Split, payment, tips, calls and discovery. Profile, bonuses, history, favourites, notifications, communications and review now route through GST-037 if no existing registered Guest is present. The existing demo only creates registered identity at table entry, so a universal sign-in flow is **PRODUCT DECISION REQUIRED**.

## Domain Boundaries

No screen calculates money, Split allocation, cashback, commission or payment state. Guest screens call existing commands and selectors only. Nearby and delivery retain their independent state; opening discovery does not create a restaurant Visit session.

## Status Adapters

`components/guest/adapters/status.ts` maps existing domain status values to `tone` and Russian labels without mutation:

| Entity | Existing values | Stage 6 mapping state |
| --- | --- | --- |
| Order | created, submitted, accepted, in_progress, ready, served, completed, error, cancelled | IMPLEMENTED |
| Staff Call | created, accepted, completed | IMPLEMENTED |
| Payment | pending, succeeded, failed | IMPLEMENTED |

These adapters are presentation-only and never send commands or change source data.

## Screen States, Responsive and Accessibility

Existing loading, empty, unavailable, disabled and error treatment is preserved. Menu includes empty search and stop-list states; nearby has location fallback and a list alternative to the map; account-only actions use the GST-037 bottom sheet. Guest stays constrained to a 480px app canvas, uses safe-area bottom padding and keeps the bottom navigation fixed. Existing dialog/sheet primitives retain focus trapping and Escape dismissal.

## Product Decisions Required

- Universal sign-in outside table entry.
- Delivery pricing and non-demo fulfilment.
- Promotion eligibility and exact offer terms.
- Notification retention policy.
- Booking policy beyond the existing demo contract.

## Known Limitations and Deferred Work

Core domain flows are preserved, while some previously existing screens retain legacy composition pending a separate, narrowly scoped visual migration: Cart/order detail, Bill/Split/payment, tips, booking and account subpages. This Stage does not add financial logic, a new auth system, a new route tree, or a new reusable pattern.

## Stage 6.1 Legacy Migration

| Screen ID | Legacy Before | Tier 1 After | Pattern After | Remaining Legacy |
| --- | --- | --- | --- | --- |
| GST-004 | Guest header, hero, cards and buttons | `Button`, `IconButton`, `Card` | `ProductCard`, `OrderCard` | Quick-action layout and navigation shell |
| GST-005 | Legacy menu cards | Existing search/filter controls | `ProductCard` | Product detail and category controls preserve legacy behavior |
| GST-006 | `MiraModal`, legacy inputs | Account gate already uses `BottomSheet` | PATTERN FIT NOT APPLICABLE | `MiraModal` retained for modifier and cart domain safety |
| GST-007–008 | Legacy cart/order composition | — | `ProductListItem` planned for item editor | Cart quantity editing remains legacy for domain safety |
| GST-009 | Legacy order summary | `StatusBadge` | `OrderCard` | None in current-order summary |
| GST-010 | Legacy bill card | — | `BillSummary` | Split/payment action panels remain legacy for domain safety |
| GST-011–013 | Legacy split rows | — | `SplitParticipantRow` extension required for item-level selection | Existing allocation controls preserved |
| GST-014–017 | Legacy payment panels | `StatusBadge` | `PaymentSummaryCard` extension required for payment actions | Existing payment adapter and commands preserved |
| GST-018 | Legacy tips card | — | `TipSummary` extension required for editable preset flow | Existing tip selector preserved |
| GST-019–020 | Legacy call sheet/cards | `BottomSheet`, `StatusBadge` | `ServiceCallCard` extension required for call actions | Existing call command controls preserved |
| GST-021–024 | Legacy Nearby list/cards | — | `VenueCard`, `ProductListItem` | Map, filters, delivery checkout and venue sheet preserve behavior safety |
| GST-028 | Legacy booking form | — | PATTERN FIT NOT APPLICABLE | Existing booking form preserved; policy remains unresolved |
| GST-030 | Legacy profile host | `BottomSheet` auth gate | PATTERN FIT NOT APPLICABLE | Profile navigation composition preserved |
| GST-032 | Legacy bonus presentation | — | `BonusSummary` extension required for transaction list | Existing balance/transactions preserved |
| GST-033 | Legacy payment history | — | `OrderCard` extension required for payment history | Existing payment breakdown preserved |
| GST-037 | New account requirement | `BottomSheet` | PATTERN FIT NOT APPLICABLE | None |

Guest CSS now controls only Guest layout and responsive composition for the newly introduced pattern sections. The former `.guest-pattern-stack` pattern-root `max-width` override was removed.

## Stage 6.1B Critical Flow Migration

| Screen ID | Previous Visual Layer | New Visual Layer | Domain Logic Reused | Remaining Legacy |
| --- | --- | --- | --- | --- |
| GST-006 | `MiraModal` product shell | Tier 1 `BottomSheet` | Modifier, quantity and `setCart` callbacks | Legacy buttons, input and selection rows |
| GST-007 | Legacy cart rows/cards | — | Existing cart selectors and commands | `MiraCard` / `MiraButton`; `ProductListItem` is not yet the cart editor shell |
| GST-008 | Legacy confirmation feedback | — | Existing submit result | Legacy feedback surface |
| GST-011–013 | Legacy split disclosure and selection | — | Existing Split selectors and commands | Legacy selection controls; no allocation calculation added |
| GST-014–017 | Legacy payment cards | `PaymentSummaryCard` | Existing payment-intent and POS adapter callbacks | Editable payment action panel remains legacy |
| GST-018 | Legacy tips summary | `TipSummary` | Existing tip amount and commission values | Editable preset/form controls remain legacy |
| GST-019–020 | `MiraBottomSheet` and call cards | Tier 1 `BottomSheet`, `ServiceCallCard`, `StatusBadge` | Existing create-call command and status adapter | Call action buttons retain legacy styling |
| GST-030 | Legacy profile | — | Existing auth navigation | Profile list remains legacy |
| GST-032 | Legacy bonus view | — | Existing bonus balance and transactions | `BonusSummary` not adopted because transaction details remain primary content |
| GST-033 | Legacy payment history cards | `OrderCard` summary | Existing persisted payment source | Legacy `PaymentBreakdown` detail remains visible |

No new store, payment method, split calculation, callback, or domain command was introduced. Pattern extensions are not required: the remaining interactive portions can be migrated with Tier 1 composition in a subsequent focused pass.

## Stage 6.1C Final Core Migration

| Screen ID | Host Logic Location | Presentation Component | Tier 1 Used | Pattern Used | Remaining Legacy |
| --- | --- | --- | --- | --- | --- |
| GST-007 | `demo-app.tsx` cart callbacks | `guest-cart-screen.tsx` | `Button`, `IconButton`, `Alert`, `EmptyState` | `ProductListItem` | None in primary cart UI |
| GST-008 | `demo-app.tsx` submit callback/result | `guest-cart-screen.tsx` | `Alert`, `Button` | — | None in primary confirmation UI |
| GST-011 | `Bill` host | — | — | — | Legacy split disclosure and controls |
| GST-012 | `Bill` host | — | — | — | Legacy item-selection rows |
| GST-013 | `Bill` host | — | — | — | Legacy allocation action controls |
| GST-014–017 | `Bill` host | Existing host composition | `BottomSheet`, `StatusBadge` | `PaymentSummaryCard` | Editable payment controls remain legacy |
| GST-018 | `Services` host | Existing host composition | — | `TipSummary` | Editable tip controls remain legacy |
| GST-030 | `Services` host | — | `BottomSheet` gate | — | Profile list remains legacy |
| GST-032 | `Services` host | — | — | — | Bonus account surface remains legacy |
| GST-033 | `Services` host | Existing host composition | — | `OrderCard` | Payment detail rows remain legacy |

`guest-cart-screen.tsx` contains no store, engine, selector, adapter, router or financial-allocation import. The host supplies all derived values and existing callbacks.

## Stage 6.1D Split UI Migration

| Screen ID | Host Logic Location | Presentation Component | Tier 1 / Pattern | Remaining Legacy |
| --- | --- | --- | --- | --- |
| GST-011 | `Bill` in `demo-app.tsx` | `guest-split-screen.tsx` | `Card`, `Button`, `Checkbox`, `Field`, `TextInput` | None in primary Split UI |
| GST-012 | `Bill` in `demo-app.tsx` | `guest-split-screen.tsx` | `Checkbox`, `Card` | None in primary item selection UI |
| GST-013 | `Bill` in `demo-app.tsx` | `guest-split-screen.tsx` | `Button`, `Field`, `TextInput`; `SplitParticipantRow` when a reserved part exists | None in primary mode/custom UI |

The host retains `selected`, `amount`, `createSplit`, `Q.calculateCommonOrder`, and `Q.remainingItem`. `guest-split-screen.tsx` contains no financial arithmetic, domain imports, selectors, store access or adapters.

## Stage 6.1F Payment Host Cutover

| Screen ID | Host logic location | Presentation component | Tier 1 / Pattern | Remaining legacy |
| --- | --- | --- | --- | --- |
| GST-014 | `Bill` in `demo-app.tsx`: reserved part and `createPaymentIntent` | `GuestPaymentScreen` | `Radio`, `Card`, `Button`, `Field`, `TextInput`; `PaymentSummaryCard` | None in primary payment UI |
| GST-015 | `Bill` host: existing online adapter confirmation callback | `GuestPaymentScreen` | `Alert`, `StatusBadge`, `Button`; `PaymentSummaryCard` | None in primary payment UI |
| GST-016 | `Bill` host: existing pending cash state | `GuestPaymentScreen` | `Alert`, `StatusBadge`; `PaymentSummaryCard` | None in primary payment UI |
| GST-017 | `Bill` host: persisted payment status/result data | `GuestPaymentScreen` | `Card`, `StatusBadge`; `PaymentSummaryCard` | None in primary payment UI |

The host supplies formatted totals, mapped status tone/label, the existing creation/release/confirmation callbacks, and bonus input state. No payment domain rule moved to the presentation component.

## Stage 6.1G Account Migration

| Screen ID | Host Logic Location | Presentation Component | Tier 1 Used | Pattern Used | Remaining Legacy |
| --- | --- | --- | --- | --- | --- |
| GST-030 | `Services` in `demo-app.tsx`: authenticated user and navigation callback | `GuestProfileScreen` | `Card`, `Button` | — | None in primary profile UI |
| GST-032 | `Services` host: persisted user and bonus transactions | `GuestBonusesScreen` | `Card`, `EmptyState` | `BonusSummary` | None in primary bonus UI |
| GST-033 | `Services` host: persisted payments for current account | `GuestHistoryScreen` | `EmptyState` | `OrderCard`, `PaymentSummaryCard` | None in primary history UI |

Auth gating remains in `GuestContent` before `Services` is reached. Screen components receive formatted values and view models only; no auth, loyalty, cashback or payment computation is performed in presentation.
