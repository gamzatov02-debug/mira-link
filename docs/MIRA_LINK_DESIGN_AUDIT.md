# MIRA LINK DESIGN AUDIT

Audit date: 28 September 2026. Scope: current repository only. This report is based on source inspection, the current local development build, existing tests and a read-only browser check. No production code, styles, routes, dependencies or configuration were changed.

## 1. Executive Summary

MIRA LINK is a substantial interactive demo, not a collection of static mockups. The website, Guest, Waiter and Admin surfaces share a browser-local domain state. The strongest part is the domain flow: QR-style table entry, active-session protection, orders, POS simulation, split payments, cash confirmation, cashback, calls and session closure are implemented as commands with invariants and tests.

The main design risk is layering. Three global CSS files successively override the same primitives, while Guest has a second themed token system. The result is visually coherent in the main Guest experience, but hard to maintain and prone to build/runtime drift. The saved production bundle showed a mobile dialog positioning defect that the current development server did not reproduce.

## 2. Current Tech Stack

| Area | Actual implementation | Source |
|---|---|---|
| Framework / language | Next 16 App Router compatible app, React 19, TypeScript | `package.json`, `app/` |
| Build / runtime | Vinext, Vite 8, Cloudflare Workers / Wrangler | `vite.config.ts`, `scripts/run-framework.mjs` |
| Package manager | npm, lockfile committed | `package-lock.json`, `README.md` |
| Routing | App Router catch-all `/demo/[[...path]]`; Guest and Admin screen changes are local React state | `app/demo/[[...path]]/page.tsx`, `components/demo-app.tsx` |
| Styling | Tailwind v4 base import plus hand-authored global CSS and CSS variables | `app/globals.css`, `app/mira-theme.css`, `app/guest-design-system.css` |
| UI libraries | shadcn-generated primitives, Radix/Base UI, Vaul | `components/ui/`, `package.json` |
| Icons / maps | Lucide, Leaflet + OpenStreetMap tiles | `package.json`, `components/venue-map.tsx` |
| State / mock API | Custom domain engine, localStorage, BroadcastChannel, Web Locks; demo POS/payment/taxi/powerbank adapters | `lib/store.ts`, `lib/domain/`, `lib/adapters.ts` |
| Forms / validation | Native forms, React Hook Form/Zod available but not used by product forms; domain command validation | `components/demo-app.tsx`, `lib/domain/engine.ts` |
| Data | In-memory seed persisted in browser; D1/Drizzle and ChatGPT auth are present but not connected | `lib/domain/seed.ts`, `db/`, `app/chatgpt-auth.ts` |
| Tests | Node domain suite and Playwright E2E | `tests/`, `playwright.config.ts` |

## 3. Current Project Architecture

```text
Marketing page (/)
  -> Demo hub (/demo)
      -> Guest / Waiter / Admin / Full Cycle
             -> shared domain engine + selectors
             -> browser-local store
             -> demo adapters (POS, payments, partners)
```

`components/demo-app.tsx` is the main composition root and currently contains Guest, Waiter, Admin, billing, services and routing-state logic. Reusable presentation lives in `components/mira.tsx`, `components/mira-domain-ui.tsx`, `components/guest-home.tsx`, `components/nearby.tsx` and `components/staff-menu.tsx`. The domain layer is notably separate from UI and stores monetary values in kopecks.

## 4. Existing Product Areas

- **Website:** one marketing landing page with header, hero, guest/restaurant/ecosystem sections, integration/analytics/tariff messaging, CTAs and footer.
- **Guest:** 30 directly addressable demo entry states, including table entry, menu, order, bill, Split, staff calls, nearby venues, events, profile and services.
- **Waiter:** one route with a working shift dashboard, assigned tables, calls, POS state controls, cash confirmation and staff-created orders.
- **Admin:** one route with 20 client-side sections for operational, menu, financial and configuration demo functions.

## 5. Screen Inventory

| ID | Product Area | Screen | Route | Exists | Responsive | Interactive | Status |
|---|---|---|---|---|---|---|---|
| W-01 | Website | Marketing landing | `/` | Yes | Yes | Partial | PARTIAL |
| D-01 | Demo | Demo hub | `/demo` | Yes | Yes | Yes | READY |
| G-01 | Guest | Welcome / QR entry | `/demo/guest/welcome` | Yes | Yes | Yes | READY |
| G-02 | Guest | Home | `/demo/guest/home` | Yes | Yes | Yes | READY |
| G-03 | Guest | Menu / product sheet | `/demo/guest/menu` | Yes | Yes | Yes | READY |
| G-04 | Guest | Cart and order | `/demo/guest/order` | Yes | Yes | Yes | READY |
| G-05 | Guest | Bill / Split | `/demo/guest/bill`, `/split` | Yes | Yes | Yes | READY |
| G-06 | Guest | Staff call | `/demo/guest/waiter` | Yes | Yes | Yes | READY |
| G-07 | Guest | Nearby / venue detail / delivery | `/demo/guest/nearby` | Yes | Yes | Yes | READY |
| G-08 | Guest | Events | `/demo/guest/events` | Yes | Yes | Yes | PARTIAL |
| G-09 | Guest | Promotions | `/demo/guest/promotions` | Yes | Yes | Yes | PARTIAL |
| G-10 | Guest | Bonuses / profile / history / favourites | `/bonuses`, `/profile`, `/history`, `/favorites` | Yes | Yes | Yes | PARTIAL |
| G-11 | Guest | Booking / review | `/booking`, `/review`, `/bookings` | Yes | Yes | Yes | PARTIAL |
| G-12 | Guest | Taxi / Wi-Fi / powerbank / tips / delivery | respective Guest routes | Yes | Yes | Yes | PARTIAL |
| G-13 | Guest | Notifications / settings / support / legal | respective Guest routes | Yes | Yes | Partial | PARTIAL |
| WT-01 | Waiter | Shift dashboard | `/demo/waiter` | Yes | Yes | Yes | PARTIAL |
| WT-02 | Waiter | Table, order, calls and tips detail routes | `/demo/waiter/table/:id`, `/orders/:id`, `/calls`, `/tips` | No | N/A | N/A | MISSING |
| A-01 | Admin | Dashboard and analytics | `/demo/admin` section | Yes | Yes | Yes | READY |
| A-02 | Admin | Operations, orders, tables | `/demo/admin` sections | Yes | Yes | Yes | PARTIAL |
| A-03 | Admin | Menu, bookings, staff, guests | `/demo/admin` sections | Yes | Yes | Yes | PARTIAL |
| A-04 | Admin | Loyalty, promos, reviews, payments, tips | `/demo/admin` sections | Yes | Yes | Yes | PARTIAL |
| A-05 | Admin | Communications, integrations, tariff, settings, network | `/demo/admin` sections | Yes | Yes | Partial | PLACEHOLDER |
| A-06 | Admin | Dedicated admin subsection URLs | `/demo/admin/*` | No | N/A | N/A | MISSING |
| C-01 | Demo | Guided shared full cycle | `/demo/full-cycle` | Yes | Yes | Yes | READY |

The inventory represents 53 implemented screen/views: 1 website, 1 hub, 30 Guest states, 1 Waiter dashboard, 20 Admin sections and 1 full-cycle screen. Only 34 are direct URLs; Admin sections and most Guest transitions are client-side state rather than route changes.

## 6. Current User Flows

Working flows: anonymous or demo-account table entry; join confirmation for an active table; menu search/category/modifiers/cart; Guest -> Waiter -> POS status -> Admin shared visibility; all specified split choices; online and cash demo payments; cashback for registered users; calls; booking; stop-list; force close; reset across browser tabs; nearby-venue delivery isolated from table orders; additional tips after a closed visit.

The current anonymous check completed order -> Waiter POS confirmation -> online payment. It created no bonus transaction and the anonymous history stayed empty, matching the stated access model.

## 7. Existing Components

| Component group | Reusable implementation | Finding |
|---|---|---|
| Core primitives | `MiraButton`, IconButton, Card, Input, Select, Toggle, Chip, Modal, BottomSheet, Toast, StatusBadge, Empty, Skeleton, Money | Used repeatedly; strongest local product kit |
| Domain presentation | ProductImage/Card/Info, OrderItem, PaymentBreakdown, TipSelector, BonusControl, Venue/Event/Table/Call cards | Reused across Guest, Waiter and Admin |
| Guest patterns | Header, hero, quick actions, floating cart, bottom navigation, theme provider | Reused and mobile-focused |
| Operational patterns | StaffMenu, table cards, calls, metrics, Admin navigation | Present; most remain composed inside `demo-app.tsx` |
| Vendor UI kit | 61 shadcn-style primitives | Mostly unused by product surfaces; only Dialog, Sheet and Switch are imported directly by MIRA wrappers |

## 8. Component Duplication

- Generic shadcn Button/Input/Card/Select/Badge/Empty/Skeleton coexist with `Mira*` equivalents. Product UI uses the latter, creating two competing systems.
- `.button`, `.card`, `.guest-content`, `.demo-header`, `.mira-modal`, `.full-grid` and related selectors are redefined across three global stylesheets.
- Currency uses the shared `formatMoney` in most domain presentation, but `guest-home.tsx` contains a separate local formatter.
- Modal and sheet wrappers are centralized, but their base geometry is overridden by both theme and global layers.

## 9. Current Visual System

### Colors

Base tokens define deep green surfaces, gold accent and warm text. Guest adds nine runtime themes with semantic `--color-*` tokens. Hard-coded status, map and image-overlay values remain. The base success token differs between `globals.css` and `mira-theme.css`.

### Typography

Manrope is loaded locally as the application default; Inter is loaded locally and scoped to Guest. The marketing and operational layers use many fixed sizes (7px through 82px and clamps); Guest has a clearer type scale. The use of both families is intentional in code but undocumented as a product rule.

### Spacing

`--space-unit: 8px` exists, but margins, padding and gaps use many literal values. There is no complete spacing scale.

### Radius

Base control/card/panel tokens are 12/20/26px; Guest independently defines 8/12/16/18/20/24px and several special cases. Values are not consistently tokenized outside Guest.

### Shadows

Mostly restrained. Base cards use a light shadow; modals, phone shell and map pin use bespoke shadows. Guest theme exposes a card shadow token.

### Grid and breakpoints

Marketing uses 6% page gutters and 1600px max width. Guest is constrained to 480px. Breakpoints occur at 1200, 1150, 1000, 768, 760, 650, 430 and 359px; this is a maintenance risk. Guest uses fixed bottom navigation with safe-area support.

## 10. Responsive Audit

Read-only browser checks covered 34 direct URLs at 1440, 1280, 1024, 768, 390 and 375px. The current development server returned HTTP 200 and no document-level horizontal overflow at every tested width. The main current responsive behaviours are good: Guest becomes full-width on mobile, Admin navigation scrolls horizontally, and Full Cycle collapses from three columns.

The saved `dist` bundle is not equivalent to the current dev rendering: at 390/375px its product dialog was offset beyond the left and top viewport edges. Current dev output positioned the same dialog at x=0 within the viewport. Treat build-versus-dev visual parity as a release check requirement.

At mobile widths, several demo-header links are only 42px wide, and switches have 44px width but 26px height. They do not meet a strict 44x44 target as rendered controls. Leaflet attribution is necessarily visually small.

## 11. UI States Audit

| State | Coverage | Notes |
|---|---|---|
| Default / disabled / loading | Present | MiraButton has loading and disabled states |
| Hover / active / focus | Partial | Button/chip styles and focus-visible exist; card and form consistency varies |
| Success / error | Present | Toasts, order/POS/payment status badges, human-readable errors |
| Empty | Present | Orders, calls, searches, history, reviews, favourites, bookings and payments |
| Skeleton | Partial | Primitive exists but is not used as route/data loading state |
| Offline | Partial | Map tile error is represented; no general offline state |
| Form validation | Partial | Domain validation protects writes; field-level inline error summaries are largely absent |
| Pending / retry | Present | POS error/retry and payment pending/failure supported |

## 12. UX Audit

- Client-side Guest navigation does not update the URL; after selecting Menu, the URL remains `/demo/guest/home`. Deep links work only as initial state and browser back/forward cannot represent intra-app navigation.
- The visible demo chrome and device switcher are useful for a demo but compete with the Guest product hierarchy on a phone.
- The Admin “overview” does not expose enough order detail to make a new order easy to verify without switching sections.
- The waiter experience is functional but dense; all duties live in one long dashboard instead of operational detail screens.
- Unapproved tariff, network and promo-code areas responsibly avoid inventing rules, but need a stronger neutral “not available in this demo” pattern rather than presentation cards that resemble completed features.

## 13. MIRA LINK Business Logic Coverage

| Function | Product Area | Current Status | Existing Screen/Component | Notes |
|---|---|---|---|---|
| QR-style entry / active-session protection | Guest | Implemented | Welcome/Home | QR is simulated by table token; no device NFC/camera |
| Menu, modifiers, cart, order | Guest | Implemented | Menu, product modal, order | 16 seeded products |
| Common bill and Split | Guest | Implemented | Bill | Own/items/equal/custom/all remaining |
| Online/cash payment, tips, bonuses | Guest | Implemented demo | Bill, tips | No real payment provider |
| Calls to waiter/admin | Guest/Waiter/Admin | Implemented | Staff sheet, calls | Correct role states |
| Nearby, map, events, partner services | Guest | Implemented demo | Nearby, Events, Services | External services are simulated; OSM tiles are network-dependent |
| Profile/account history | Guest | Partial | Profile/history | Browser-local demo account only |
| Waiter login and multi-user shifts | Waiter | Missing | N/A | Seeded waiter only; no authentication |
| Zones and table/order detail screens | Waiter | Partial/Missing | Dashboard cards | 12 tables, but no zone model or detail routes |
| POS flow/readiness/cash | Waiter | Implemented demo | Dashboard | POS adapter simulation |
| Admin dashboard/analytics | Admin | Implemented | Overview/Analytics | Derived from shared state |
| Menu constructor/categories/modifiers | Admin | Partial | Menu | Price and stop-list work; no category/modifier CRUD |
| Staff/roles/permissions | Admin | Partial | Employees | Read-only employees; no roles/permissions management |
| iiko/integrations | Admin | Partial | Integrations | Simulator only |
| Tariff/network/promo codes | Admin | UI only | Respective sections | Explicitly unapproved / unavailable |

## 14. Accessibility Audit

Strengths: Russian `lang`, semantic buttons, labelled inputs, icon-button labels, visible focus outline, dialog Escape handling, live status feedback, reduced-motion support, status labels alongside colour, local image alt text and product-image fallback.

Gaps: the theme validator does not test muted text; `amber_gold`, `ivory_gold` and `porcelain_gold` have muted-text contrast below 4.5:1 against their backgrounds. Some touch targets are shorter than 44px. Required modifiers disable the CTA but do not state why. No comprehensive keyboard-only flow or screen-reader test exists. Map marker accessibility depends on Leaflet DOM and is not audited end-to-end.

## 15. Technical UI Debt

- `components/demo-app.tsx` is a 48KB monolith containing routing state, page rendering and feature logic.
- CSS cascade order, duplicate selectors and repeated literals make visual changes hard to isolate.
- `components/ui` has 61 primitives, while the product uses a separate MIRA kit; unused generated kit increases cognitive load.
- `dist` and dev dialog layouts differed at mobile width, indicating release artifact parity is not reliably tested.
- UI state is generally local React state while direct URLs only seed initial page; no URL state model exists.
- The database/auth scaffolding is disconnected from the demo state, as expected for a local demo but important before production claims.

## 16. PRESERVE

| Asset / implementation | Why preserve | Design-system value |
|---|---|---|
| `lib/domain/engine.ts` and selectors | Strong invariants, idempotency, monetary correctness and clear commands | Preserve as UI-agnostic contract |
| `lib/store.ts` | Cross-tab local demo synchronization is appropriate for the demo | Preserve abstraction; replace storage backend later if needed |
| `components/mira.tsx` | Practical product primitives and accessible modal/sheet wrappers | Core of future product kit |
| `components/mira-domain-ui.tsx` | Shared product, payment, order and table presentation | Domain component registry base |
| `components/guest-home.tsx` + Guest CSS | Clear mobile hierarchy, five-item navigation, safe areas and compact cart | Guest pattern baseline |
| `components/nearby.tsx` / `venue-map.tsx` | Shared venue catalogue and truthful demo/offline messaging | Reusable discovery pattern |
| `components/staff-menu.tsx` | Waiter-created order retains domain invariants | Operational pattern worth evolving |
| Original raster monogram viewport | Existing provided visual source is not redrawn | Preserve until original SVG/transparent asset is supplied |

## 17. REWORK LATER

- Consolidate global CSS into an ordered token and component ownership model.
- Split `demo-app.tsx` by product area after defining stable route/state boundaries.
- Define a single typography policy for Manrope and Inter.
- Make Guest URL navigation represent actual page state.
- Create a coherent operational information architecture for Waiter and Admin rather than expanding one dashboard.
- Add build-artifact visual checks, especially dialogs at mobile widths.
- Replace the local currency formatter in `guest-home.tsx` with the shared formatter.
- Clarify placeholder sections with a standardized unavailable state.

## 18. MISSING

### Missing Screens

Waiter login, zones, table detail, order detail, calls inbox and personal tips detail; route-level Admin sections; admin roles/permissions, QR/NFC management, modifier/category editors, stop-list workspace and billing/enterprise management. A separate restaurant-card route is not required: current modal is intentional.

### Missing Components

Field-error summary, consistent async route skeleton, offline banner, confirmation pattern, accessible data table, zone/floor-plan primitive, role/permission editor, QR/NFC asset manager, receipt/invoice presentation and reusable unavailable-state card.

### Missing States

General offline, retry for map/geolocation permission explanation, validation text for required modifiers, loading states for route transitions, empty/error states for each Admin placeholder and explicit no-access state.

### Missing User Flows

Real auth/identity, real multi-device/server state, real POS/payment/partner integrations, waiter reassignment UI, refunds UI, category/modifier management, tariff/billing, network administration and permission governance.

### Missing Responsive Rules

One documented breakpoint scale, explicit tablet layouts for Waiter/Admin, and release-bundle modal positioning regression coverage.

### Missing Documentation

Current product decisions for financial terms, tariff pricing, network access, promo-code eligibility, real integration contracts, analytics definitions, design-token governance and accessibility acceptance criteria.

### Missing Design Tokens

Complete spacing, typography, elevation, z-index, component-state and layout tokens for all product areas.

### Missing Accessibility Rules

Contrast requirements for every semantic text token, touch-target policy enforcement, error-message behaviour, keyboard test matrix and map alternative content requirements.

## 19. Design System Readiness

| Foundation | Assessment | Evidence |
|---|---|---|
| Color tokens | PARTIAL | Base and Guest theme variables exist; layered hardcoding remains |
| Typography tokens | PARTIAL | Guest scale exists; global typography is literal-driven |
| Spacing tokens | PARTIAL | 8px unit only; no complete scale |
| Radius / shadows | PARTIAL | Tokens exist but competing values remain |
| Grid / breakpoints | PARTIAL | Reusable patterns exist; breakpoints are inconsistent |
| Icon rules | PARTIAL | Lucide is consistent in product UI; no documented sizing rules |
| Components / variants | PARTIAL | Strong MIRA kit, but duplicated generic kit |
| Patterns | PARTIAL | Guest patterns mature; Waiter/Admin patterns are embedded |

## 20. Proposed Screen Registry for Next Stage

Website: Home, product detail, integration detail, pricing only after approved terms, contact/demo request. Guest: entry, home, menu, product, cart, order tracking, bill, Split, payment result, staff call, venue discovery, venue detail, event detail, booking, profile/history/loyalty, notifications, services. Waiter: login, shift overview, zone floor map, table detail, new-order queue, order detail, calls, payments/cash, personal QR/tips, profile/history. Admin: dashboard, operations, orders, floor/tables/zones, menu/categories/products/modifiers/stop-list, bookings, staff/roles, guests, loyalty, promos/promo codes, reviews, payments/refunds, tips, analytics, communications, integrations, tariffs/billing, settings, network, permissions and QR/NFC management.

## 21. Proposed Component Registry for Next Stage

Foundation tokens; AppShell; responsive navigation; Button/IconButton; Field/Input/Select/Checkbox/Radio/Switch with error and help text; Chip/Badge; Card; Modal/Sheet/Confirmation; Toast/Alert; Skeleton/Empty/Offline; Tabs/Segmented control; data table; date/time controls; Product/Modifier/Cart/Order/Bill/Split/Payment/Receipt cards; Table/Floor/Zone/StaffCall cards; Venue/Event/Promotion cards; analytics metrics/chart; permission matrix; QR asset card.

## 22. Open Questions

1. Which URLs must be shareable and browser-history aware: every Guest/Admin state, only major screens, or none in the demo?
2. What are the approved tariff, promo-code, network and refund rules that may replace existing explicit placeholders?
3. Is the existing raster reference an approved source for production branding, or will an original SVG/transparent logo be supplied?
4. Which of the nine Guest themes are product-supported venue configurations, and what contrast requirements apply to secondary and muted text?

## 23. Risks

The demo's browser-local state cannot represent different physical devices, access control or production persistence. OSM tiles and browser geolocation add network/permission variability. Current visual success in development may not catch issues in the shipped bundle. The mixed CSS systems raise regression risk. Demo recipes, venue addresses, images and partner results must not be presented as real venue data or integrations.

## 24. Recommended Sequence of Further Design Work

1. Confirm product decisions and route/shareability requirements.
2. Establish token governance and consolidate styling ownership without altering domain behaviour.
3. Stabilize primitive states, contrast and mobile dialog release tests.
4. Define Guest, Waiter and Admin information architectures and route registry.
5. Expand operational screen patterns and placeholder states using approved business rules.
6. Connect production authentication, persistence and integration contracts only after the demo UX contracts are stable.

## Audit Validation

- Current dev server: 34 direct URLs returned successfully at 1440, 1280, 1024, 768, 390 and 375px; no document-level horizontal overflow detected.
- Domain suite: 23/23 passed.
- TypeScript check: passed.
- Existing E2E suite contains 32 listed browser scenarios; it was inspected but not rerun because the audit must not create test output artifacts.
- Existing `dist` was visually inspected and differs from dev on mobile dialog placement; no rebuild was performed.
