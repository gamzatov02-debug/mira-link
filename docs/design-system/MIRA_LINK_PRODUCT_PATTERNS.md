# MIRA LINK PRODUCT PATTERNS

## Pattern Layer Purpose

Stage 5 adds a presentation-only layer between product screens and the 18 Tier 1 MIRA components. Patterns receive view data and callbacks; they do not import stores, domain commands, routers, localStorage, payments or POS adapters.

## Component vs Pattern vs Screen

Tier 1 components provide controls and surfaces. Patterns compose those primitives around MIRA entities. Screens supply domain data and own actions. No production screen was migrated in this stage.

## Pattern Registry

ProductCard, ProductListItem, VenueCard, EventCard, PromotionCard, OrderCard, BillSummary, SplitParticipantRow, TableCard, ServiceCallCard, PaymentSummaryCard, TipSummary, BonusSummary and MetricCard are implemented. Supporting patterns: SectionHeader and ResponsiveActionGroup.

`PRODUCT PATTERNS: 14 / 14`  
`SUPPORTING PATTERNS: 2 / 2`

## Pattern APIs

Each exported component in `components/patterns/index.tsx` declares a presentation-only TypeScript API and supports `mode?: MiraMode`. Callbacks are emitted outward through explicit props such as `onAction`; no pattern performs an operation itself.

| Pattern | Actual public props |
| --- | --- |
| ProductCard | `image?`, `title`, `description`, `price`, `oldPrice?`, `badge?`, `availability?`, `quantity?`, `actionLabel?`, `onAction?`, `onFavourite?`, `mode?` |
| ProductListItem | `title`, `metadata`, `price`, `quantity?`, `availability?`, `trailingAction?`, `mode?` |
| VenueCard | `name`, `cuisine`, `rating?`, `distance?`, `meta?`, `badge?`, `open?`, `onAction?`, `mode?` |
| EventCard | `title`, `venue`, `dateTime`, `category`, `note?`, `onAction?`, `mode?` |
| PromotionCard | `title`, `description`, `venue?`, `validity`, `badge?`, `onAction?`, `mode?` |
| OrderCard | `identifier`, `context`, `itemCount`, `amount`, `status`, `timestamp?`, `primaryAction?`, `secondaryAction?`, `mode?` |
| BillSummary | `lines`, `subtotal`, `discounts?`, `bonuses?`, `total`, `paid?`, `remaining?`, `actions?`, `mode?` |
| SplitParticipantRow | `name`, `amount`, `paid`, `remaining`, `status`, `selected?`, `onAction?`, `mode?` |
| TableCard | `table`, `zone`, `guests`, `session`, `orderStatus`, `calls?`, `bill?`, `selected?`, `onAction?`, `mode?` |
| ServiceCallCard | `type`, `table`, `elapsed`, `status`, `assignee?`, `primaryAction?`, `secondaryAction?`, `mode?` |
| PaymentSummaryCard | `total`, `paid`, `remaining`, `method?`, `status`, `action?`, `mode?` |
| TipSummary | `base`, `selected?`, `tip`, `commission?`, `finalAmount`, `recipient?`, `mode?` |
| BonusSummary | `available`, `used`, `accrued`, `help?`, `action?`, `mode?` |
| MetricCard | `label`, `value`, `supporting?`, `status?`, `icon?`, `action?`, `mode?` |

`SectionHeader` accepts `title`, `description?`, `action?`, `mode?`. `ResponsiveActionGroup` accepts `children` only.

## Tier 1 Dependency Map

| Pattern | Tier 1 dependencies |
| --- | --- |
| ProductCard | Card, Button, Badge, IconButton |
| ProductListItem | none (presentation row) |
| VenueCard / EventCard / PromotionCard | Card, Badge, Button, StatusBadge |
| OrderCard | Card, StatusBadge, Button |
| BillSummary | Card |
| SplitParticipantRow | Card, StatusBadge, Button |
| TableCard | Card, Badge, Button |
| ServiceCallCard | Card, StatusBadge |
| PaymentSummaryCard | Card, StatusBadge |
| TipSummary / BonusSummary | Card, Button |
| MetricCard | Card, StatusBadge |
| SectionHeader / ResponsiveActionGroup | Button supplied by caller where needed |

All Tier 1 imports use `@/components/design-system`. No Pattern reproduces Tier 1 Button, Card, Badge, StatusBadge, Alert or EmptyState APIs.

## Domain Boundary

Existing domain data remains the source of truth. Pattern view models carry already-derived display fields. Order, call and payment status enter patterns as an explicit shared StatusBadge tone; patterns do not transition status.

`DOMAIN MUTATION DEPENDENCIES: NONE` — `components/patterns/` imports React, Lucide, public Design System exports and local CSS only.

## Status Mapping

Patterns accept the presentation tone `success | warning | error | info | neutral | pending`; screen/adapter code must map domain state before passing props.

| Domain entity | Existing values | Pattern boundary |
| --- | --- | --- |
| Order `executionStatus` | `created`, `submitted`, `accepted`, `in_progress`, `ready`, `served`, `completed`, `error`, `cancelled` | Map before `OrderCard`; no mapping is implemented in the Pattern layer. |
| StaffCall `status` | `created`, `accepted`, `completed` | Map before `ServiceCallCard`; no mapping is implemented in the Pattern layer. |
| Payment `status` | `pending`, `succeeded`, `failed` | Map before `PaymentSummaryCard`; no mapping is implemented in the Pattern layer. |

Exact product wording and any nontrivial domain-to-tone policy remain `DOMAIN MAPPING REVIEW REQUIRED` at screen integration time.

## Money / Financial Boundary

BillSummary, PaymentSummaryCard, TipSummary and BonusSummary receive preformatted monetary values. No arithmetic, commission, payment, bonus or Split allocation calculation is present in the pattern layer.

`FINANCIAL BUSINESS CALCULATIONS IN PATTERNS: NONE`

## Semantic Modes

Patterns pass `brand-dark` and `operational-light` mode to Tier 1 components. Pattern CSS uses semantic CSS variables only.

## Responsive Rules and Accessibility

Cards use approved 4:3 and 16:9 media ratios; compact rows use 1:1 thumbnails. Grids collapse to one column at narrow width. Images are decorative placeholders or carry supplied accessible labels. Nested actions are not combined with a clickable card root.

The showcase has an actual responsive grid that collapses below 480px. It does not provide a canvas-width selector; browser Responsive/Device Mode remains necessary for 360px, 390px, 480px, 768px and desktop verification.

## Accessibility

Patterns use Tier 1 focus and disabled behavior. Decorative media is exposed with a supplied accessible label in showcase placeholders. Card roots are not interactive, preventing nested-action conflicts. Status remains text-labelled through StatusBadge.

## Showcase

`/demo/patterns` is dev-only, guarded with `notFound()` in production, absent from product navigation and disconnected from domain state. It includes both semantic modes and showcase sample copy.

Coverage includes all 14 Product Patterns and both supporting compositions. Current sample coverage includes available and unavailable ProductCard, long VenueCard name, EventCard, PromotionCard, a multi-line BillSummary, selected SplitParticipantRow, TableCard, ServiceCallCard, payment/tip/bonus values and MetricCard. Additional domain status examples and unselected SplitParticipantRow remain manual showcase expansion work.

## Deferred Patterns

Modifier selection, Cart, Checkout, payment flow, Split allocation UI, booking flow, delivery form, waiter order editor, POS issue workflow, Admin menu editor, analytics dashboard composition, role/permissions editor and QR/NFC management remain deferred.

## Existing Production Mapping

| New Pattern | Existing source | Future action |
| --- | --- | --- |
| ProductCard / ProductListItem | `components/mira-domain-ui.tsx`, Guest menu | MIGRATE LATER |
| VenueCard / EventCard | `components/mira-domain-ui.tsx`, Nearby/Events | EVOLVE |
| OrderCard / BillSummary / SplitParticipantRow | `components/demo-app.tsx` | MIGRATE LATER |
| TableCard / ServiceCallCard / MetricCard | `components/demo-app.tsx` | REPLACE LATER |
| PaymentSummaryCard / TipSummary / BonusSummary | `components/mira-domain-ui.tsx`, demo app | MIGRATE LATER |

## Known Limitations

- Product Patterns are intentionally not connected to the domain model, so actual status-to-tone wording is deferred to screen adapters.
- The showcase uses local sample data and does not demonstrate every real domain status or every optional-metadata absence case.
- Responsive verification requires browser device mode; no production screen migration occurred.
- `TIER 1 EXTENSIONS REQUIRED: NONE`.

## Detailed Pattern API Audit

All required props below are required unless marked otherwise. Each product pattern also accepts optional `mode: MiraMode`.

### ProductCard
| Prop | Type | Required | Purpose |
| --- | --- | --- | --- |
| image | string | No | supplied media URL |
| title, description, price | string | Yes | display content |
| oldPrice, badge, quantity, actionLabel | string / string / number / string | No | optional presentation |
| availability | `available \| unavailable` | No | available presentation |
| onAction, onFavourite | `() => void` | No | caller-owned callbacks |

### ProductListItem
| Prop | Type | Required | Purpose |
| --- | --- | --- | --- |
| title, metadata, price | string | Yes | compact display |
| quantity | number | No | supplied quantity |
| availability | `available \| unavailable` | No | availability label |
| trailingAction | ReactNode | No | caller-supplied action |

### VenueCard / EventCard / PromotionCard
| Pattern | Prop | Type | Required | Purpose |
| --- | --- | --- | --- |
| VenueCard | name, cuisine | string | Yes | venue content |
| VenueCard | rating, distance, meta, badge, open, onAction | string / boolean / callback | No | supplied metadata and callback |
| EventCard | title, venue, dateTime, category | string | Yes | event content |
| EventCard | note, onAction | string / callback | No | supplied note and callback |
| PromotionCard | title, description, validity | string | Yes | promotion content |
| PromotionCard | venue, badge, onAction | string / string / callback | No | supplied metadata and callback |

### OrderCard / BillSummary / SplitParticipantRow
| Pattern | Prop | Type | Required | Purpose |
| --- | --- | --- | --- |
| OrderCard | identifier, context, itemCount, amount, status | string / Tone | Yes | preformatted order display |
| OrderCard | timestamp, primaryAction, secondaryAction | string / ReactNode | No | supplied content/actions |
| BillSummary | lines, subtotal, total | line array / string | Yes | precomputed bill presentation |
| BillSummary | discounts, bonuses, paid, remaining, actions | string / ReactNode | No | supplied financial display |
| SplitParticipantRow | name, amount, paid, remaining, status | string / Tone | Yes | precomputed participant display |
| SplitParticipantRow | selected, onAction | boolean / callback | No | presentation and callback |

### TableCard / ServiceCallCard
| Pattern | Prop | Type | Required | Purpose |
| --- | --- | --- | --- |
| TableCard | table, zone, guests, session, orderStatus | string | Yes | supplied operational display |
| TableCard | calls, bill, selected, onAction | string / boolean / callback | No | optional presentation/action |
| ServiceCallCard | type, table, elapsed, status | string / Tone | Yes | supplied call display |
| ServiceCallCard | assignee, primaryAction, secondaryAction | string / ReactNode | No | supplied content/actions |

### PaymentSummaryCard / TipSummary / BonusSummary / MetricCard
| Pattern | Prop | Type | Required | Purpose |
| --- | --- | --- | --- |
| PaymentSummaryCard | total, paid, remaining, status | string / Tone | Yes | precomputed payment display |
| PaymentSummaryCard | method, action | string / ReactNode | No | supplied metadata/action |
| TipSummary | base, tip, finalAmount | string | Yes | precomputed tip presentation |
| TipSummary | selected, commission, recipient | string | No | supplied details |
| BonusSummary | available, used, accrued | string | Yes | supplied balance display |
| BonusSummary | help, action | string / ReactNode | No | supplied content/action |
| MetricCard | label, value | string | Yes | metric display |
| MetricCard | supporting, status, icon, action | string / Tone / ReactNode | No | supplied enhancement |

### Supporting compositions
| Pattern | Prop | Type | Required | Purpose |
| --- | --- | --- | --- |
| SectionHeader | title | string | Yes | section title |
| SectionHeader | description, action, mode | string / ReactNode / MiraMode | No | optional content/mode |
| ResponsiveActionGroup | children | ReactNode | Yes | caller-owned action composition |


## Visual QA Findings Resolved

- Menu and discovery patterns now expose their existing 4:3, 1:1 and 16:9 media anatomy through local placeholder surfaces.
- ProductListItem is a compact thumbnail row.
- SplitParticipantRow uses an overflow-safe row grid that wraps internally at narrow widths.
- TableCard and ServiceCallCard use compact operational density; selected TableCard retains readable surface contrast.
- SectionHeader uses section-level typography and ResponsiveActionGroup composes direct Tier 1 Buttons.
- Pattern Showcase grid uses `align-items: start` and does not impose heights or flex growth on Pattern roots.
