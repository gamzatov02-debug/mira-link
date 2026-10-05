# MIRA LINK USER FLOWS

This document describes UX flow architecture only. It does not alter the current domain contract, implementation or integration boundaries. There are 18 flows: 7 Guest, 4 Waiter, 3 Admin and 4 cross-role flows. Promotions remain contextual (Home, Venue Detail, Nearby or explicit CTA) and open GST-038 Promotion Detail as a mobile bottom sheet; Account is a parent area with separate Profile, Loyalty, History, Favourites, Notifications and Communication Settings screens.

## Guest Flows

### GF-01 — QR/NFC → table join → order status

```mermaid
flowchart TD
    A[GST-001 QR/NFC entry] --> B{Table session active?}
    B -- No --> C[Create current table session and temporary guest]
    B -- Yes --> D[GST-003 Explicit join confirmation]
    D -->|Confirm| E[Join existing session]
    D -->|Need help| F[GST-019 Call staff]
    C --> G[GST-004 Visit Home]
    E --> G
    G --> H[GST-005 Menu]
    H --> I[GST-006 Product bottom sheet]
    I --> J[GST-007 Cart]
    J --> K[GST-008 Order confirmation]
    K --> L[GST-009 Order status]
```

Entry error, expired session, invalid table and unavailable network enter GST-002, where retry and support are available. QR/NFC finds a context; it never bypasses the existing active-session join rule.

### GF-02 — Bill → Split → online payment → tips → success

```mermaid
flowchart TD
    A[GST-010 Bill] --> B[GST-011 Split selection]
    B --> C{Allocation method}
    C -->|Own items| D[Reserve own unpaid items]
    C -->|Selected items| E[GST-012 Item split]
    C -->|Equal/custom/all| F[GST-013 Amount split]
    D --> G[GST-014 Payment method]
    E --> G
    F --> G
    G --> H[GST-015 Online payment]
    H -->|Succeeded| I[GST-017 Payment result]
    H -->|Failed| J[Failure and retry]
    I --> K[GST-018 Tips]
    K --> L[GST-004 Home / updated Bill]
```

Split remains a pre-payment reservation. The financial split is created only after successful payment; neither is redesigned as a single UX/data concept.

### GF-03 — Cash request → waiter/POS confirmation → success

```mermaid
flowchart LR
    A[GST-010 Bill] --> B[GST-011–013 Reserve share]
    B --> C[GST-014 Cash method]
    C --> D[GST-016 Cash pending]
    D --> E[WTR-010 Confirm via POS]
    E --> F{POS result}
    F -->|Confirmed| G[GST-017 Payment result]
    F -->|Not confirmed| D
```

Guest cannot mark cash as paid. Existing POS confirmation remains the authority for that state transition.

### GF-04 — Call waiter → accepted → resolved

```mermaid
flowchart LR
    A[GST-019 Call staff] --> B{Role}
    B -->|Waiter| C[Create waiter call]
    B -->|Administrator| D[Create admin call]
    C --> E[GST-020 Call status: created]
    D --> E
    E --> F[WTR-007 or ADM-006 Calls inbox]
    F --> G[Accept]
    G --> H[GST-020 Accepted]
    H --> I[Resolve]
    I --> J[GST-020 Resolved]
```

### GF-05 — Nearby → venue → menu preview → delivery

```mermaid
flowchart TD
    A[GST-021 Nearby] --> B{Location available?}
    B -->|Yes| C[Map/list sorted by location]
    B -->|No / denied| D[Demo/fallback location with explanation]
    C --> E[GST-022 Venue detail]
    D --> E
    E --> F[GST-023 Venue menu preview]
    F --> G{Delivery enabled?}
    G -->|Yes| H[GST-024 Delivery]
    G -->|No| I[Return to venue]
    H --> J[Independent delivery result]
```

This never creates a table Session. Venue detail is public/discovery context, not a substitute for QR table entry.

### GF-06 — Event → detail → venue or booking

```mermaid
flowchart LR
    A[GST-025 Events] --> B[GST-026 Event detail]
    B --> C{Intent}
    C -->|Open venue| D[GST-022 Venue detail]
    C -->|Book| E[GST-028 Booking]
    E --> F[Booking confirmation]
```

### GF-07 — Anonymous → authorised account

```mermaid
flowchart TD
    A[Anonymous visit or discovery] --> B{Personal feature selected?}
    B -->|No| C[Continue as anonymous]
    B -->|Yes: loyalty/history/favourites/review| D[Explain account requirement]
    D --> E[Authorisation — production contract required]
    E --> F[GST-030 Account]
    F --> G[Loyalty, persistent history, favourites or review]
```

The current demo account toggle is a demonstration mechanism. Production authorisation is **PRODUCT DECISION REQUIRED** and must not interrupt order, payment or service access.

## Waiter Flows

### WF-01 — Shift → new order → POS → ready → served

```mermaid
flowchart TD
    A[WTR-001 Login / start shift] --> B[WTR-002 Dashboard]
    B --> C[WTR-005 Orders queue]
    C --> D[WTR-006 Order detail]
    D --> E[Confirm / submit to POS]
    E --> F{POS state}
    F -->|Error| G[WTR-014 Retry / issue]
    G --> E
    F -->|Accepted| H[Preparing]
    H --> I[Ready alert]
    I --> J[Mark served]
    J --> K[WTR-004 Table detail]
```

### WF-02 — Call → accept → table → resolve

```mermaid
flowchart LR
    A[WTR-007 Calls inbox] --> B[WTR-008 Call detail]
    B --> C[Accept call]
    C --> D[WTR-004 Table detail]
    D --> E[Resolve call]
    E --> F[Guest sees resolved state]
```

### WF-03 — Payment request → cash confirmation

```mermaid
flowchart LR
    A[Priority alert / WTR-009 Payments] --> B[Pending cash payment]
    B --> C[WTR-010 POS cash confirmation]
    C --> D{Confirmed?}
    D -->|Yes| E[Guest payment success + Admin payment record]
    D -->|No| F[Remain pending / explain next action]
```

### WF-04 — Waiter-created order

```mermaid
flowchart TD
    A[WTR-004 Table detail or WTR-005 Orders] --> B[WTR-013 Staff-created order]
    B --> C{Existing table session?}
    C -->|Yes| D[Choose existing guest or add offline guest]
    C -->|No| E[Create session through existing domain command]
    D --> F[Select products, modifiers, quantity, comment]
    E --> F
    F --> G[Submit order]
    G --> H[WTR-006 POS order flow]
    H --> I[Guest/Admin shared visibility]
```

## Admin Flows

### AF-01 — Overview → orders → order detail

```mermaid
flowchart LR
    A[ADM-001 Overview] --> B[ADM-002 Orders]
    B --> C[ADM-003 Order detail]
    C --> D[Operational state / linked table]
```

### AF-02 — Menu → product → price / availability / stop-list

```mermaid
flowchart TD
    A[ADM-009 Products] --> B[ADM-010 Product detail]
    B --> C{Change type}
    C -->|Price/content| D[Validated menu update]
    C -->|Availability| E[ADM-012 Stop-list]
    D --> F[Guest menu reflects current data]
    E --> F
```

### AF-03 — Staff → employee → role

```mermaid
flowchart LR
    A[ADM-019 Employees] --> B[Employee detail]
    B --> C[ADM-020 Roles]
    C --> D[ADM-021 Permissions]
    D --> E[PRODUCT DECISION REQUIRED before implementation]
```

## Cross-role Flows

### XF-01 — Guest → Waiter → POS → Guest

```mermaid
flowchart LR
    A[Guest submits order] --> B[Shared domain: submitted]
    B --> C[Waiter sees new order]
    C --> D[POS accepts / updates state]
    D --> E[Guest sees accepted, preparing, ready or served]
    D --> F[Admin sees operational state]
```

### XF-02 — Guest payment → Waiter / Admin

```mermaid
flowchart LR
    A[Guest reserves Split share] --> B[Payment intent]
    B --> C{Method}
    C -->|Online| D[Payment callback]
    C -->|Cash| E[Waiter POS confirmation]
    D --> F[Shared successful payment]
    E --> F
    F --> G[Guest result / cashback when eligible]
    F --> H[Waiter cash/tip visibility]
    F --> I[Admin payment and analytics]
```

### XF-03 — Admin stop-list → Guest menu

```mermaid
flowchart LR
    A[ADM-012 Stop-list change] --> B[Shared menu state]
    B --> C[Guest product marked unavailable]
    C --> D[Add-to-cart disabled]
    B --> E[Waiter order menu reflects availability]
```

### XF-04 — Admin menu → Guest menu

```mermaid
flowchart LR
    A[ADM-010 Product price/content update] --> B[POS/source-of-truth domain update]
    B --> C[Guest menu future selection uses current price]
    B --> D[Existing OrderItem price snapshots stay unchanged]
    B --> E[Waiter product catalogue reflects current data]
```

## Flow State Rules

- A Session is one visit and has at most one active instance per table.
- Order status and financial status stay distinct.
- A successful payment is immutable; a later order is a new order in the same Session.
- Split reservations prevent over-allocation and must show an understandable unavailable state.
- Service calls move through created, accepted and completed; visual state is not colour-only.
- Partner services and discovery browsing remain separate from restaurant Session state.
