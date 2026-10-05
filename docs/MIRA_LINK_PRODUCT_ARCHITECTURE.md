# MIRA LINK PRODUCT & UX ARCHITECTURE

## 1. Architecture Principles

MIRA LINK is one product ecosystem with four independent product areas and one non-production Demo Layer. Screen architecture serves the existing domain contract: one active table session, orders inside sessions, POS-driven operational state, Split before Payment, financial split after successful payment, cash confirmation by POS, and cross-role visibility.

Every significant UX task receives a stable Screen ID. A Screen ID is a product concept, not a URL or React component. UI changes that require a different money calculation, status transition, session rule or access rule must be marked **REQUIRES PRODUCT / DOMAIN REVIEW**.

## 2. Product Areas

| Area | Primary user | Core job | Boundary |
|---|---|---|---|
| Website | Prospect / partner | Understand MIRA LINK and request a demo | Public product marketing; no table-session state |
| Guest App | Restaurant guest / ecosystem user | Manage a visit and discover venues | Mobile-first; table context and ecosystem context stay distinct |
| Waiter App | Waiter | Resolve live floor operations quickly | Operational mobile workspace, not an extension of Guest |
| Venue Admin | Administrator / manager / owner | Control venue operations and configuration | Desktop-first operational control plane |
| Demo Layer | Prospect / internal demonstrator | Show linked roles safely | Demo-only chrome, seeded state and simulators; excluded from production UX |

## 3. Website IA

```text
Website
├── Home
│   ├── Positioning and product explanation
│   ├── Guest, waiter and venue value
│   ├── Ecosystem, integrations, analytics and loyalty
│   ├── Demo CTA
│   └── Tariff teaser — PRODUCT DECISION REQUIRED
├── Capabilities
│   ├── Guest experience: menu, orders, Split, payment, tips, services
│   ├── Restaurant operations: Waiter App, Venue Admin, analytics
│   └── Integrations and AI / smart-services framing
├── For business
│   ├── Restaurants and cafés
│   ├── Chains / enterprise — PRODUCT DECISION REQUIRED
│   └── Hospitality applicability only where validated
├── Integrations
├── Tariffs — PRODUCT DECISION REQUIRED
├── Demo
├── Contact / demo request
└── Legal
```

Home should retain a comprehensive narrative. Capabilities should be a small number of task-oriented landing pages, not one page per feature. Integrations, tariffs, contacts and legal must have stable public URLs. Website claims must call iiko, payments, taxi and powerbank **demo adapters** until production contracts are confirmed.

## 4. Guest IA

```text
Guest
├── Visit context
│   ├── Entry / table join
│   ├── Home
│   ├── Menu → Product → Cart → Order status
│   ├── Bill → Split → Payment → Tips
│   └── Call staff
├── Discover
│   ├── Nearby map/list → Venue detail → Menu preview / delivery
│   ├── Events → Event detail
│   └── Promotions → Promotion detail
├── Account
│   ├── Profile
│   ├── Loyalty / bonuses
│   ├── Order / visit history
│   ├── Favourites
│   ├── Notifications
│   └── Communication settings
└── Services
    ├── Booking
    ├── Wi-Fi, powerbank and taxi
    ├── Delivery
    ├── Support
    └── Legal
```

**Visit context** is tied to the current Venue/Table Session. **Discover** is not: browsing Nearby must never accidentally create, join or expose a table session. Delivery from a discovered venue is a separate order domain, as current implementation already models.

Product details should use a **BOTTOM SHEET** on phones: it keeps menu context, supports short selection work and avoids a full route for one menu item. Use a PAGE only for rich, shareable public venue/menu content outside a table session. Payment and confirmation require a **FULLSCREEN FLOW** because they are high-attention state transitions.

## 5. Guest Navigation

Current five-item navigation is mature enough to retain structurally, with one change in naming: bonuses should move under Account rather than occupy a permanent destination.

| Bottom navigation | Why / user expectation | Includes |
|---|---|---|
| Home | Return to the current visit | Venue, table, active order, bill, quick actions |
| Menu | Start the restaurant's primary ordering task in one tap | Categories, search, product detail and cart handoff |
| Nearby | Discover places independently of the visit | Map, list, venue detail, public menu, delivery |
| Events | Browse time-based venue activity | Events, event detail, booking handoff |
| More | Account and secondary utilities | Profile, loyalty, history, bookings, favourites, notifications, services, settings, support, legal |

Promotions are contextual: they appear on Home, in Venue Detail, in Nearby/discovery and through explicit promotion CTAs. They remain available as a dedicated Promotions screen without becoming a permanent tab. There is no central action: Order, Bill and Call staff are contextual actions on Home and in the visit shortcut bar.

## 6. Anonymous vs Authorized Access

| Feature | Anonymous | Authorized | Notes |
|---|---|---|---|
| Browse venue/menu/nearby/events | Yes | Yes | No session required for discovery |
| Join table, cart, order, order status | Yes | Yes | Temporary guest session is sufficient |
| Bill, Split, online/cash payment, normal tips | Yes | Yes | No forced registration |
| Call waiter/admin and allowed services | Yes | Yes | Service context can be tied to table guest ID |
| Additional tips after visit | Yes | Yes | Existing domain allows it for session guest |
| Loyalty balance, cashback history, bonus spend | No | Yes | Existing registered-user rule |
| Persistent history, favourites, profile, personal offers | No | Yes | Persisted account scope only |
| Reviews | No | Yes | One review per session under current domain contract |
| Communications preferences | No | Yes | Service notifications remain separate from marketing consent |

## 7. Waiter IA

```text
Waiter
├── Login / shift start
├── Dashboard
│   ├── Priority alerts
│   ├── New orders, calls, ready items and cash pending
│   └── Assigned-zone summary
├── Zones → Tables → Table detail
├── Orders → Order detail
├── Calls inbox
├── Payments / cash confirmation
├── Tips / personal QR
├── Staff-created order
└── Profile / shift history
```

The dashboard is an alert-and-orientation screen, not the permanent home for detailed order, call, payment and tips work. Zones are a required future information concept; current domain has assigned tables but no zone model, so its data semantics are **REQUIRES PRODUCT / DOMAIN REVIEW**.

## 8. Waiter Navigation

Recommended mobile bottom navigation: **Floor**, **Orders**, **Calls**, **More**. A persistent shift header carries alerts for new orders, ready items, cash pending and calls. Table Detail is reached from Floor and Order Detail from Orders. “Create order” is a contextual action available from a table and the orders area. Payment and tips are in More until live volume justifies a separate tab.

## 9. Admin IA

```text
Venue Admin
├── Overview
├── Operations
│   ├── Orders, tables/zones, calls, bookings
├── Menu
│   ├── Categories, products, modifiers, stop-list
├── Guests / CRM
│   ├── Guests, loyalty, reviews
├── Marketing
│   ├── Promotions, promo codes, communications
├── Staff
│   ├── Employees, roles and permissions
├── Finance
│   ├── Payments, tips, refunds, billing and tariff
├── Analytics
├── Integrations
└── Settings
    ├── Venue, table setup, QR/NFC, notifications
    └── Network / enterprise — PRODUCT DECISION REQUIRED
```

## 10. Admin Navigation

Use a desktop sidebar with the **ten** top-level groups above. A group opens a local secondary navigation only when it contains several tasks; table and product pages use contextual tabs; breadcrumbs appear for objects that can be entered from multiple places. Keep Overview, Operations, Menu, Guests/CRM, Marketing, Staff, Finance, Analytics, Integrations and Settings as the only sidebar groups. Network / Enterprise remains a contextual Settings destination for eligible network accounts, with its own Screen ID.

## 11. Role Model

| Role | Product areas visible | Boundary |
|---|---|---|
| Guest anonymous | Guest visit, discovery and allowed services | No personal account data |
| Guest authorized | Guest plus account/personalisation | No venue administration |
| Waiter | Waiter operational surface | Assigned operational scope; detailed access rules require decision |
| Administrator | Venue Admin operations and configured management scope | No cross-venue personal history |
| Manager | Admin operational and reporting scope | Permission granularity: PRODUCT DECISION REQUIRED |
| Venue Owner | Venue configuration, finance and reporting scope | Permission granularity: PRODUCT DECISION REQUIRED |
| Network Manager | Network / enterprise surface | PRODUCT DECISION REQUIRED |
| Platform Admin | Not required by current demo | FUTURE / PRODUCT DECISION REQUIRED |

## 12. Presentation Rules

| Type | Use | Examples |
|---|---|---|
| PAGE | Navigable, multi-step or shareable task | Nearby, table detail, orders, admin sections |
| MODAL | Brief contextual detail that does not need history | Venue preview on desktop, confirmation |
| BOTTOM SHEET | Short mobile selection or service action | Product detail, staff call, payment-method choice |
| FULLSCREEN FLOW | High-attention or sensitive progression | Payment, QR entry recovery, shift start |
| DRAWER | Supporting navigation or filters on larger screens | Admin filters, detail inspector |
| POPOVER | Small anchored choice | Sort, compact status explanation |
| INLINE STATE | Local status/change in the same task | Empty results, order progress, stop-list badge |
| TAB / EMBEDDED PANEL | Closely related object views | Venue detail, table details, Admin object pages |

## 13. Routing Strategy

Public Website pages, Nearby, public venue detail and public event detail should have shareable URLs. Guest Home, Menu and non-sensitive Discovery tabs should produce browser-history state. Product detail may be a URL-backed bottom sheet for shareability outside a session.

Table Session, join confirmation, Split reservation and payment state must be session-authorised application state; a URL can locate a context but must not grant access. Waiter/Admin major screens should have URLs. Dialogs, toggles, filter chips and status displays remain internal state unless their state is useful to share or restore.

## 14. Venue Theme Strategy

MIRA LINK requires one Design System and one controlled Venue Theme / Brand Accent layer. The theme layer may set validated accent colour, accent contrast, selected surface accents and optional venue branding. Layout, spacing, typography scale, anatomy, interaction, navigation and accessibility rules remain fixed. No venue receives its own independent design system.

## 15. System States

| Area | Required states |
|---|---|
| Website | Loading, unavailable form, legal unavailable, demo request success/error |
| Guest entry | Loading, invalid/expired table, active-session join, permission denied, retry, no access |
| Guest discovery | Loading, no location permission, offline map, no results, venue unavailable, retry |
| Guest visit | Empty cart/order, POS pending/error/retry, stop-list unavailable, payment pending/success/failure, Split reserved by another guest |
| Waiter | No shift, empty queue, priority alert, POS error/retry, no assigned tables, no access |
| Admin | Empty operations, loading, integration unavailable, validation error, no access, maintenance |

## 16. Accessibility Rules

Later UI must meet: readable base text of at least 14px; WCAG AA 4.5:1 for normal text and 3:1 for large text/icons; 44x44px recommended touch targets; visible focus; keyboard-complete controls and dialogs; labels and inline error text; no colour-only states; semantic headings/landmarks; focus trapping/restoration in dialogs; reduced-motion support; and a non-map list alternative for venue discovery.

## 17. Analytics Event Architecture

Event names are neutral, lower snake case and record a user intent or completed state, not implementation details.

| Area | Events |
|---|---|
| Website / Demo | `demo_open`, `demo_request`, `demo_role_select` |
| Guest | `guest_entry`, `venue_open`, `nearby_open`, `menu_open`, `product_open`, `add_to_cart`, `order_submit`, `split_start`, `payment_start`, `payment_success`, `tips_submit`, `call_staff`, `booking_start`, `booking_success`, `delivery_start` |
| Waiter | `waiter_order_accept`, `waiter_call_accept`, `waiter_cash_confirm`, `waiter_order_create` |
| Admin | `admin_section_open`, `admin_stop_list_change`, `admin_menu_change` |

## 18. Design System Boundaries

Stage 3/4 needs foundations (colour, typography, spacing, radius, elevation, grid, breakpoints, motion, z-index, iconography); components (controls, feedback, navigation, overlay, data display); patterns (entry, discovery, ordering, payment, operations, management); and product components (dish, cart, order, bill, split, table, call, venue, event, metric). This is a boundary definition only, not a Design System implementation.

## 19. Domain Contract to Preserve

Future UX work must not silently change monetary calculations, price snapshots, Split allocation/reservation algorithm, cashback, payment state machine, cash/POS confirmation, order state machine, call state machine, session closure/force closure, stop-list behaviour, additional tips, browser-demo synchronization or shared cross-role visibility. UI needs that alter any of these require **REQUIRES PRODUCT / DOMAIN REVIEW**.

## 20. Product Decisions Required

1. **PRODUCT DECISION REQUIRED:** tariff prices, billing terms and subscription mechanics.
2. **PRODUCT DECISION REQUIRED:** promo-code economics and compatibility with promotions.
3. **PRODUCT DECISION REQUIRED:** production payment-provider behaviour, receipts and failure/retry policy.
4. **PRODUCT DECISION REQUIRED:** production identity/authentication and cross-device session model.
5. **PRODUCT DECISION REQUIRED:** network hierarchy, enterprise capabilities and data access boundaries.
6. **PRODUCT DECISION REQUIRED:** role/permission granularity for manager, owner and network manager.
7. **PRODUCT DECISION REQUIRED:** zone data model and table reassignment operational rules.
8. **PRODUCT DECISION REQUIRED:** refund policy and its production UI exposure.
