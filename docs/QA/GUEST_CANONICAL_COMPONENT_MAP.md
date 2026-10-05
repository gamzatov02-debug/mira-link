# Guest canonical component map

This document records the active Guest UI presentation ownership after the consistency pass. Business context, commands and state remain owned by each caller.

| UI entity | Canonical component | Used in |
| --- | --- | --- |
| Standard restaurant menu item | `components/guest/guest-menu-product-card.tsx` — `GuestMenuProductCard` | Guest Menu; Nearby → Venue → Menu; Nearby → Venue → Delivery; Favorite dishes |
| Product detail | `components/guest/guest-product-detail.tsx` — `GuestProductDetail` | Guest Menu; Nearby Venue Menu through the Guest host; Delivery Menu; Favorite dishes |
| Venue discovery result | `components/guest/guest-venue-card.tsx` — `GuestVenueCard` | Nearby venue results |
| Guest primary navigation | `components/mira.tsx` — `MiraBottomNavigation`, configured by `components/guest/navigation/guest-navigation.ts` | All primary Guest screens |
| QR entry | `components/demo-app.tsx` — canonical `page === "qr"` surface, reached through the shared Guest navigation entry | Table QR and powerbank terminal demo entry |
| Product image/data presentation | `lib/menu-presentation.ts` — `menuPresentation` | All canonical menu cards and product detail imagery |
| Inline base quantity | `components/guest/guest-menu-cart.ts` | Guest table cart and venue-scoped discovery/delivery carts |

## Context ownership

The shared components are presentation boundaries. They do not create visits, sessions, delivery orders or financial state.

- **Table visit:** the Guest host supplies the existing `setCart` commands and table/session guard.
- **Discovery:** Nearby supplies its existing venue-scoped demo cart. Selecting a venue or changing quantity does not create a table session.
- **Delivery:** Nearby supplies the same existing venue-scoped cart and its existing delivery checkout. Required modifiers open the canonical detail before an item can be added.
- **Favorites:** the Guest host supplies the existing global account favorite state and the existing table cart callbacks.

## Specialized presentations retained

These are intentionally separate because they do not represent a selectable full menu item card:

| Presentation | Location | Reason |
| --- | --- | --- |
| Home Popular recommendation | `components/guest-home.tsx` | Image-led teaser carousel with approved compact Home geometry |
| Cart/order line | `components/guest/screens/guest-cart-screen.tsx` | Represents an existing cart line with remove and quantity operations |
| Floating cart summary | `components/guest-home.tsx` | Persistent compact order summary, not a product selector |
| Selected map preview | `components/nearby.tsx` | Contextual map selection with discovery actions |
| Favorite venue management card | `components/demo-app.tsx` using `VenueCard` | Account-level saved-place management with removal action |
| Venue detail surface | `components/nearby.tsx` | Full discovery detail, map, services, booking and menu tabs |
| Waiter menu item/detail | `components/staff-menu.tsx` | Waiter role and waiter order command contract; outside Guest UI |
| Admin product showcase | `components/mira-domain-ui.tsx` | Admin/POS inspection; outside Guest UI |

## Audit result

### Product cards

- Active Guest product presentation implementations/usages found before migration: **6**.
- Canonical full-menu component: **1** (`GuestMenuProductCard`).
- Legacy full-menu duplicates found: **2** — Nearby Delivery used `ProductListItem`; Favorite dishes used the legacy `mira-domain-ui` `ProductCard`.
- Legacy duplicates migrated: **2**.
- Legacy full-menu duplicates remaining: **0**.
- Specialized presentations remaining: **3** — Home Popular, cart line and floating cart summary.

The old `mira-domain-ui` ProductCard and its Guest CSS were removed after the last active Guest usage migrated. The generic `ProductListItem` remains because it is the approved cart-line pattern.

### Product detail

- Active Guest implementations found before migration: **2** — Guest host responsive detail and inline Nearby Delivery detail.
- Canonical implementation after migration: **1** (`GuestProductDetail`), reused by both contexts.
- Duplicate Guest detail implementations remaining: **0**.

### Venue cards

- Guest venue card presentations found: **3** — Nearby discovery result, selected map preview and saved-place management.
- Canonical discovery result: **1** (`GuestVenueCard`).
- Specialized presentations remaining: **2**, because their actions and information hierarchy differ from the discovery result.

### Bottom navigation and QR

- Active Guest bottom navigation implementations: **1**.
- Active Guest QR entry surfaces: **1**.
- The navigation order remains `Главная / Рядом / QR / Афиша / Ещё`.

## Legacy string check

`Фото и состав` has **0 occurrences in active Guest ProductCard UI**. It remains in Waiter menu presentation and Waiter E2E coverage, where it opens the waiter-specific staff detail. `Показать фото и состав` remains in the Admin/POS showcase. Those role-specific surfaces are outside this Guest consistency pass.

## Targeted evidence

Viewport: `390 × 844`.

- `docs/QA/guest-canonical-components/guest-canonical-menu-390.png`
- `docs/QA/guest-canonical-components/nearby-canonical-menu-390.png`
- `docs/QA/guest-canonical-components/venue-detail-canonical-menu-390.png`
- `docs/QA/guest-canonical-components/delivery-canonical-menu-390.png`
- `docs/QA/guest-canonical-components/targeted-results.json`

The captured Buratta card uses the same `/images/burrata.png` asset, title, metadata, details action, favorite control and inline quantity in all three menu contexts. Discovery and Delivery checks kept sessions and guests at `0 → 0`. A required-modifier product opened the canonical detail and did not increment its card quantity. Document horizontal overflow was `0px`.
