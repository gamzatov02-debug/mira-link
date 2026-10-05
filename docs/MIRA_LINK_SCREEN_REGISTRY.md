# MIRA LINK SCREEN REGISTRY

Website screens: 10  
Guest screens: 38  
Waiter screens: 16  
Admin screens: 30  
Demo screens: 4  
Total: 98

Screen IDs are UX concepts and deliberately independent of current URLs.

| ID | Product Area | Screen | Purpose | User Role | Presentation Type | Parent | Entry Point | Exit / Next | Auth | Current Status | Future Priority |
|---|---|---|---|---|---|---|---|---|---|---|---|
| WEB-001 | Website | Home | Position product and route to demo | Public | PAGE | — | Direct | Capabilities, Demo | No | EXISTS | CORE |
| WEB-002 | Website | Capabilities | Explain guest and business capabilities | Public | PAGE | Website | Header | Detail pages, Demo | No | PARTIAL | HIGH |
| WEB-003 | Website | Guest experience | Explain visit flow | Public | PAGE | Capabilities | CTA | Demo Guest | No | MISSING | HIGH |
| WEB-004 | Website | Business solutions | Explain venue value | Public | PAGE | Capabilities | CTA | Demo / Contact | No | MISSING | HIGH |
| WEB-005 | Website | Integrations | Describe verified integration categories | Public | PAGE | Website | Header | Contact | No | PARTIAL | MEDIUM |
| WEB-006 | Website | Analytics / loyalty | Explain operational outcomes | Public | PAGE | Capabilities | CTA | Contact | No | MISSING | MEDIUM |
| WEB-007 | Website | Tariffs | Hold approved commercial information | Public | PAGE | Website | Header | Contact | No | PLACEHOLDER | HIGH |
| WEB-008 | Website | Demo | Explain/demo role selection | Public | PAGE | Website | CTA | Demo Hub | No | PARTIAL | CORE |
| WEB-009 | Website | Contact / demo request | Capture sales contact | Public | PAGE | Website | CTA | Success | No | MISSING | HIGH |
| WEB-010 | Website | Legal | Privacy, terms, consent/cookies | Public | PAGE | Footer | Footer | Back | No | MISSING | HIGH |
| GST-001 | Guest | Entry / table join | Resolve QR/NFC table context | Guest | FULLSCREEN FLOW | Visit | QR/NFC | Home or error | No | EXISTS | CORE |
| GST-002 | Guest | Entry error | Handle invalid, expired or unavailable table | Guest | FULLSCREEN FLOW | Entry | Entry failure | Retry / support | No | MISSING | HIGH |
| GST-003 | Guest | Active-session join | Confirm explicit table joining | Guest | BOTTOM SHEET | Entry | Active table | Join / call staff | No | EXISTS | CORE |
| GST-004 | Guest | Visit Home | Orient within current venue/table | Guest | PAGE | Visit | Entry / Home tab | Menu, order, bill | No | EXISTS | CORE |
| GST-005 | Guest | Menu | Browse/search/filter menu | Guest | PAGE | Visit | Home / shortcut | Product, cart | No | EXISTS | CORE |
| GST-006 | Guest | Product detail | Configure dish and modifiers | Guest | BOTTOM SHEET | Menu | Product card | Cart / menu | No | EXISTS | CORE |
| GST-007 | Guest | Cart | Review and submit current cart | Guest | PAGE | Visit | Floating cart / shortcut | Order | No | EXISTS | CORE |
| GST-008 | Guest | Order confirmation | Confirm accepted order | Guest | INLINE STATE | Cart | Submit success | Order status | No | PARTIAL | HIGH |
| GST-009 | Guest | Order status | Track POS/serving states | Guest | PAGE | Visit | Home / Cart | Bill, call staff | No | EXISTS | CORE |
| GST-010 | Guest | Bill | Inspect shared bill and balance | Guest | PAGE | Visit | Home shortcut | Split / payment | No | EXISTS | CORE |
| GST-011 | Guest | Split selection | Choose allocation method | Guest | EMBEDDED PANEL | Bill | Bill | Payment | No | EXISTS | CORE |
| GST-012 | Guest | Item split | Allocate selected unpaid items | Guest | EMBEDDED PANEL | Split | Split selection | Payment | No | EXISTS | CORE |
| GST-013 | Guest | Equal/custom/all split | Reserve equal, custom or remaining amount | Guest | EMBEDDED PANEL | Split | Split selection | Payment | No | EXISTS | CORE |
| GST-014 | Guest | Payment method | Select online or cash | Guest | BOTTOM SHEET | Bill | Reserved share | Payment flow | No | PARTIAL | CORE |
| GST-015 | Guest | Online payment | Complete online payment | Guest | FULLSCREEN FLOW | Payment | Method | Result / retry | No | PARTIAL | CORE |
| GST-016 | Guest | Cash payment pending | Await waiter/POS confirmation | Guest | PAGE | Payment | Cash request | Success / support | No | EXISTS | CORE |
| GST-017 | Guest | Payment result / receipt | Confirm outcome and show receipt | Guest | FULLSCREEN FLOW | Payment | Callback | Bill / Home | No | PARTIAL | HIGH |
| GST-018 | Guest | Tips | Add normal or post-visit tips | Guest | BOTTOM SHEET | Payment / Home | Payment result / shortcut | Result | No | EXISTS | CORE |
| GST-019 | Guest | Staff call | Call waiter or administrator | Guest | BOTTOM SHEET | Visit | Shortcut | Call status | No | EXISTS | CORE |
| GST-020 | Guest | Call status | Display created, accepted, resolved call | Guest | INLINE STATE | Visit | Call | Home | No | EXISTS | HIGH |
| GST-021 | Guest | Nearby | Browse map/list independent of visit | Guest | PAGE | Discover | Tab | Venue detail | No | EXISTS | CORE |
| GST-022 | Guest | Venue detail | Inspect discovered venue | Guest | PAGE | Nearby | Venue card/pin | Menu preview, booking | No | PARTIAL | HIGH |
| GST-023 | Guest | Venue menu preview | Browse outside table session | Guest | TAB | Venue detail | Venue detail | Delivery / back | No | EXISTS | HIGH |
| GST-024 | Guest | Delivery | Create independent delivery request | Guest | FULLSCREEN FLOW | Venue detail | Delivery CTA | Result | No | EXISTS | HIGH |
| GST-025 | Guest | Events | Browse current/nearby events | Guest | PAGE | Discover | Tab | Event detail | No | EXISTS | MEDIUM |
| GST-026 | Guest | Event detail | Read event and book/open venue | Guest | MODAL | Events | Event card | Booking / venue | No | EXISTS | MEDIUM |
| GST-027 | Guest | Promotions | Browse venue offers | Guest | PAGE | Discover | Tab | Offer detail | No | PARTIAL | MEDIUM |
| GST-038 | Guest | Promotion detail | Read offer terms and take contextual action | Guest | BOTTOM SHEET | Promotions / Venue detail | Promotion card or Home CTA | Venue, booking, back | No | MISSING | MEDIUM |
| GST-028 | Guest | Booking | Create/manage booking | Guest | PAGE | Services | Venue/Event/More | Confirmation | No | EXISTS | HIGH |
| GST-029 | Guest | Review | Submit permitted review | Guest authorized | PAGE | Account | More | Confirmation | Yes | EXISTS | MEDIUM |
| GST-030 | Guest | Account / Profile | Identity and account entry point | Guest authorized | PAGE | More | Tab | Account child screens | Yes | PARTIAL | HIGH |
| GST-031 | Guest | Services | Wi-Fi, powerbank, taxi, support/legal | Guest | PAGE | More | Tab | Result / back | No | PARTIAL | MEDIUM |
| GST-032 | Guest | Loyalty / Bonuses | Balance, cashback and approved bonus spend | Guest authorized | PAGE | Account | Account | Bill / back | Yes | PARTIAL | HIGH |
| GST-033 | Guest | Order / Visit History | Review persistent account visits and payments | Guest authorized | PAGE | Account | Account | Visit detail / back | Yes | PARTIAL | HIGH |
| GST-034 | Guest | Favourites | Manage saved venues and dishes | Guest authorized | PAGE | Account | Account | Venue / Menu / back | Yes | PARTIAL | MEDIUM |
| GST-035 | Guest | Notifications | Read service and marketing messages | Guest authorized | PAGE | Account | Account / header | Related task / back | Yes | PARTIAL | MEDIUM |
| GST-036 | Guest | Communication Settings | Control marketing communication preference | Guest authorized | PAGE | Account | Account | Back | Yes | PARTIAL | MEDIUM |
| GST-037 | Guest | Account entry requirement | Explain account-only capability without blocking visit tasks | Guest | BOTTOM SHEET | Account | Anonymous personal-feature attempt | Authorisation / back | No | MISSING | HIGH |
| WTR-001 | Waiter | Login / shift start | Identify employee and begin shift | Waiter | FULLSCREEN FLOW | — | App launch | Dashboard | Yes | MISSING | CORE |
| WTR-002 | Waiter | Shift dashboard | Orient and surface priorities | Waiter | PAGE | — | Shift start | Floor/orders/calls | Yes | EXISTS | CORE |
| WTR-003 | Waiter | Zone / floor | View assigned zones and tables | Waiter | PAGE | Operations | Bottom nav | Table detail | Yes | PARTIAL | CORE |
| WTR-004 | Waiter | Table detail | Resolve table session and actions | Waiter | PAGE | Floor | Table | Order/bill/call | Yes | MISSING | CORE |
| WTR-005 | Waiter | Orders queue | Triage new/current orders | Waiter | PAGE | Operations | Bottom nav/alert | Order detail | Yes | MISSING | CORE |
| WTR-006 | Waiter | Order detail | Move order through POS/service states | Waiter | PAGE | Orders | Order row | Table / back | Yes | MISSING | CORE |
| WTR-007 | Waiter | Calls inbox | Triage staff calls | Waiter | PAGE | Operations | Bottom nav/alert | Table / resolve | Yes | MISSING | CORE |
| WTR-008 | Waiter | Call detail | Accept/resolve one call | Waiter | BOTTOM SHEET | Calls | Call row | Table / calls | Yes | MISSING | HIGH |
| WTR-009 | Waiter | Payments | View payment requests | Waiter | PAGE | Operations | More/alert | Cash confirmation | Yes | MISSING | HIGH |
| WTR-010 | Waiter | Cash confirmation | Confirm cash via POS | Waiter | BOTTOM SHEET | Payments | Pending cash | Result | Yes | EXISTS | CORE |
| WTR-011 | Waiter | Tips | View tips and additional tips | Waiter | PAGE | More | More | Tip detail | Yes | PARTIAL | HIGH |
| WTR-012 | Waiter | Personal QR | Present waiter-specific tips QR | Waiter | PAGE | Tips | Tips | Back | Yes | MISSING | HIGH |
| WTR-013 | Waiter | Staff-created order | Create order for table guest | Waiter | FULLSCREEN FLOW | Table/Orders | Create order | POS status | Yes | EXISTS | CORE |
| WTR-014 | Waiter | POS issue | Retry/error handling | Waiter | INLINE STATE | Order | POS error | Retry/call | Yes | EXISTS | HIGH |
| WTR-015 | Waiter | Profile | Employee settings and shift identity | Waiter | PAGE | More | More | Back | Yes | MISSING | MEDIUM |
| WTR-016 | Waiter | Shift history | Review completed shift activity | Waiter | PAGE | More | Profile | Back | Yes | MISSING | FUTURE |
| ADM-001 | Admin | Overview | Venue metrics and active operations | Administrator | PAGE | — | App launch | Operations | Yes | EXISTS | CORE |
| ADM-002 | Admin | Orders | Find operational orders | Administrator | PAGE | Operations | Sidebar | Order detail | Yes | PARTIAL | CORE |
| ADM-003 | Admin | Order detail | Inspect order / POS state | Administrator | PAGE | Orders | Order row | Back | Yes | MISSING | HIGH |
| ADM-004 | Admin | Tables and zones | Manage floor operations | Administrator | PAGE | Operations | Sidebar | Table detail | Yes | PARTIAL | CORE |
| ADM-005 | Admin | Table detail | Inspect session and bill | Administrator | PAGE | Tables | Table row | Back | Yes | MISSING | HIGH |
| ADM-006 | Admin | Calls | Monitor calls | Administrator | PAGE | Operations | Sidebar | Call detail | Yes | PARTIAL | HIGH |
| ADM-007 | Admin | Bookings | View/manage venue bookings | Administrator | PAGE | Operations | Sidebar | Booking detail | Yes | EXISTS | HIGH |
| ADM-008 | Admin | Categories | Manage menu taxonomy | Administrator | PAGE | Menu | Sidebar | Products | Yes | MISSING | HIGH |
| ADM-009 | Admin | Products | Manage product catalogue | Administrator | PAGE | Menu | Sidebar | Product detail | Yes | PARTIAL | CORE |
| ADM-010 | Admin | Product detail | Price, description, image, availability | Administrator | PAGE | Products | Product row | Back | Yes | PARTIAL | CORE |
| ADM-011 | Admin | Modifiers | Manage modifier groups | Administrator | PAGE | Menu | Sidebar | Product detail | Yes | MISSING | HIGH |
| ADM-012 | Admin | Stop-list | Operate availability changes | Administrator | PAGE | Menu | Sidebar | Products | Yes | PARTIAL | CORE |
| ADM-013 | Admin | Guests | View venue-scoped guests | Administrator | PAGE | Guests/CRM | Sidebar | Guest detail | Yes | EXISTS | HIGH |
| ADM-014 | Admin | Loyalty | Configure approved loyalty rules | Administrator | PAGE | Guests/CRM | Sidebar | Back | Yes | EXISTS | HIGH |
| ADM-015 | Admin | Reviews | View guest reviews | Administrator | PAGE | Guests/CRM | Sidebar | Back | Yes | EXISTS | MEDIUM |
| ADM-016 | Admin | Promotions | Publish venue promotions | Administrator | PAGE | Marketing | Sidebar | Guest promotion | Yes | EXISTS | HIGH |
| ADM-017 | Admin | Promo codes | Manage approved codes | Administrator | PAGE | Marketing | Sidebar | Back | Yes | PLACEHOLDER | FUTURE |
| ADM-018 | Admin | Communications | Manage marketing communications | Administrator | PAGE | Marketing | Sidebar | Back | Yes | EXISTS | MEDIUM |
| ADM-019 | Admin | Employees | View/manage staff | Administrator | PAGE | Staff | Sidebar | Employee detail | Yes | PARTIAL | HIGH |
| ADM-020 | Admin | Roles | Configure roles | Administrator | PAGE | Staff | Sidebar | Permissions | Yes | MISSING | HIGH |
| ADM-021 | Admin | Permissions | Configure scope | Administrator | PAGE | Staff | Sidebar | Back | Yes | MISSING | HIGH |
| ADM-022 | Admin | Payments | Inspect payment records | Administrator | PAGE | Finance | Sidebar | Payment detail | Yes | EXISTS | HIGH |
| ADM-023 | Admin | Tips | Inspect tip distribution | Administrator | PAGE | Finance | Sidebar | Back | Yes | EXISTS | HIGH |
| ADM-024 | Admin | Refunds | Handle approved refunds | Administrator | PAGE | Finance | Sidebar | Refund detail | Yes | MISSING | FUTURE |
| ADM-025 | Admin | Tariff / billing | Show approved commercial account | Administrator | PAGE | Finance | Sidebar | Back | Yes | PLACEHOLDER | FUTURE |
| ADM-026 | Admin | Analytics | Analyse venue outcomes | Administrator | PAGE | Analytics | Sidebar | Metric detail | Yes | EXISTS | HIGH |
| ADM-027 | Admin | Integrations | Configure iiko, payment and partner integrations | Administrator | PAGE | Integrations | Sidebar | Integration detail | Yes | PARTIAL | HIGH |
| ADM-028 | Admin | Venue Settings | Manage primary venue configuration | Administrator | PAGE | Settings | Sidebar | Back | Yes | PARTIAL | HIGH |
| ADM-029 | Admin | QR / NFC Management | Create, inspect and manage venue/table QR/NFC objects | Administrator | PAGE | Settings | Sidebar | QR/NFC object detail | Yes | MISSING | HIGH |
| ADM-030 | Admin | Network / Enterprise | Manage a venue network for eligible accounts | Administrator | PAGE | Settings | Contextual access | Back | Yes | PLACEHOLDER | FUTURE |
| DEM-001 | Demo | Demo Hub | Choose demo role | Public | PAGE | — | Website CTA | Role/full cycle | No | EXISTS | CORE |
| DEM-002 | Demo | Device selector | Switch/create demo guest | Demonstrator | EMBEDDED PANEL | Demo | Guest chrome | Guest | No | EXISTS | HIGH |
| DEM-003 | Demo | Full Cycle | View linked role surfaces | Demonstrator | PAGE | Demo | Hub | Role surfaces | No | EXISTS | CORE |
| DEM-004 | Demo | Reset confirmation | Restore demo seed | Demonstrator | MODAL | Demo | Demo chrome | Reset/cancel | No | EXISTS | HIGH |

## Existing → Proposed Mapping

| Proposed Screen ID | Current Implementation | Action Later |
|---|---|---|
| GST-001–020 | Guest states inside `DemoApp` | PRESERVE / SPLIT only where listed |
| GST-021–026 | `Nearby`, `VenueMap`, `GuestEvents` with modals | PRESERVE; RESTYLE; venue detail may become PAGE |
| GST-027, GST-038 | Promotions are list-only cards in `Services` | EXPAND; CREATE promotion detail as bottom sheet |
| GST-030, GST-032–037 | Profile/account and local storage states in `Services` | SPLIT into Account parent and task pages; CREATE account-entry requirement |
| GST-031 | Services conditional rendering | EXPAND into semantic routes/states |
| WTR-002, WTR-010, WTR-013, WTR-014 | `Staff` and `StaffMenu` | PRESERVE then SPLIT |
| WTR-001, 004–009, 012, 015–016 | Not represented as separate tasks | CREATE |
| ADM-001–030 | Admin tabs inside `DemoApp` | SPLIT grouped tabs into navigable sections |
| DEM-001–004 | Demo root/hub/full-cycle/reset modal | PRESERVE |

## Screens to Preserve

GST-001, GST-003–020, GST-021, GST-023–026, GST-030, GST-032–036, WTR-002, WTR-010, WTR-013–014, ADM-001, ADM-007, ADM-014–018, ADM-022–023, ADM-026–028, DEM-001–004.

## Screens to Expand

WEB-001–002, WEB-005, GST-022, GST-027, GST-030–036, WTR-003 and WTR-011, ADM-002, ADM-004, ADM-006, ADM-009–010, ADM-012–013, ADM-019, ADM-027 and ADM-028.

## Screens to Split

Current Guest services/more/profile branches; current Waiter dashboard; current Admin one-route tabs; current Admin integrations/settings compound section.

## New Screens Required

WEB-003–004, WEB-006–010; GST-002, GST-037–038; WTR-001, WTR-004–009, WTR-012, WTR-015–016; ADM-003, ADM-005, ADM-008, ADM-011, ADM-020–021, ADM-024 and ADM-029–030.
