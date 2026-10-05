# Guest Mini App — Design System v1.0

This implementation updates the existing Guest routes. Inter, the nine approved palettes and the Bonuses navigation item supersede the earlier Guest specification. Waiter, Admin and Landing keep their existing visual shell.

## Source map

- `lib/guest-theme.ts`: typed ThemeConfig/BrandConfig, nine preset palettes, semantic token conversion, WCAG contrast checks. No arbitrary color inputs are exposed.
- `components/guest-theme.tsx`: scoped Theme Service provider, persisted venue-theme selection, cross-tab updates, Admin preview and apply action. The setting is demo-local browser storage, separate from the restaurant domain store.
- `app/guest-design-system.css`: fixed shared geometry, Inter, controls, cards, safe areas, motion, map appearance and responsive layouts.
- `components/guest-home.tsx`: original brand mark, Guest Header, swipable restaurant hero, 4×2 quick actions, promo, horizontal dishes and floating cart.
- `components/guest-events.tsx`: event list, filters and existing booking action.
- `components/demo-app.tsx`: existing Guest integration, cart steppers, employee sheet, grouped More/Profile links, bonus card, communication preferences and local booking references; Admin Settings theme picker.
- `components/mira.tsx`: reusable controls, loading overlay preserving button dimensions and theme-aware portals.
- `components/mira-domain-ui.tsx`, `components/nearby.tsx`, `components/venue-map.tsx`: existing components reused for menu, nearby and theme-aware maps.
- `public/fonts/inter-variable.ttf`, `OFL-Inter.txt`: locally hosted Inter and license.

## Invariants

The nine themes change tokens only. Header, hero, quick-action, image and navigation geometry stays identical. Images are never theme-filtered. The restaurant mark remains the supplied original, cropped without redrawing. Page padding is 12px below 430px and 16px from 430px, max width 480px. Accessibility requires 44px hit areas even where the reference shows smaller visible controls. The previous two-row menu categories are preserved, with new gold underlines.

Menu browsing does not create a session. Delivery carts remain separate by venue. Session, Order, Split, Payment, Tips, Bonuses, POS adapters and shared domain store are unchanged. Guest browsing, cart controls and new presentation components call existing commands.

## Demo data limitations

- The current notification model has no timestamps, so notifications cannot truthfully be grouped into Today/Yesterday.
- Existing booking records contain no owner. “My bookings” uses references saved on this device when it creates a booking, without exposing unrelated demo bookings.
- Real payment methods, promotions, contact details, rental availability/tariffs and production identity flows are not invented by the visual layer.
- The existing staff-call model supports waiter/admin calls, not typed reasons such as cutlery or clearing a table.
- Pickup, restaurant phone contacts and live routing are not part of the existing partner-service flow.

These are explicit functional/data follow-ups, not completed production integrations. Theme persistence is local demo configuration, not a multi-tenant backend.

## Verification — 28 September 2026

- `npm run typecheck`: passed.
- `npm run build`: passed.
- Existing domain suite: 23 passed; domain/store/adapter checksums unchanged.
- Full final browser suite: 32 passed (2.5 minutes), including existing Guest → Waiter → Admin/POS/payment cycles, responsive checks at 320/360/375/390/430/480, nine-theme geometry/state invariance, contrast, themed portals, light maps, anonymous browsing, favorite dishes and delivery/table-cart isolation.
- Fixed a stale navigation label in the UI audit and made delivery isolation wait for restaurant cart completion before taking its baseline snapshot.
- Existing hosted chatgpt.site version has not been updated by this local design task.
