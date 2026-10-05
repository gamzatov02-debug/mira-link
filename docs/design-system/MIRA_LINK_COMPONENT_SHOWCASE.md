# MIRA LINK DESIGN SYSTEM — COMPONENT SHOWCASE

## Files

- `components/design-system/preview/component-showcase.tsx`
- `components/design-system/preview/component-showcase.module.css`
- `app/demo/components/page.tsx`

## Access

Run `npm run dev -- --port 3000`, then open `http://localhost:3000/demo/components`. This is a dev-only visual review route with no production navigation entry and no domain-state connection. In a production build the route calls `notFound()` and is unavailable.

## Coverage

The showcase presents all **18 / 18 Tier 1 components** in `MIRA / Brand Dark` and `MIRA / Operational Light`; the review canvas changes with the selected semantic mode. Its local `Canvas width preview` control provides layout constraints at 360px, 390px, 480px, 768px and desktop width. It is not a substitute for true viewport/media-query testing: use browser Responsive/Device Mode or resize the window. It includes all six StatusBadge variants, five Alert variants, four interactive one-at-a-time Toast variants, long Russian copy, ₽/numeric examples, and scrollable Dialog/BottomSheet content.

## Manual QA checklist

- [ ] Brand Dark visually reviewed
- [ ] Operational Light visually reviewed
- [ ] 360px / 390px / 480px / 768px / Desktop
- [ ] keyboard Tab navigation and focus-visible
- [ ] disabled states, Button hover and Button pressed
- [ ] Field error and success, Checkbox indeterminate
- [ ] StatusBadge, Alert and Toast variants
- [ ] Dialog open/close, Escape and focus restoration
- [ ] BottomSheet open/close, scroll and safe area
- [ ] long Russian copy and ₽ / numeric content

## Visual QA Findings Resolved

- Showcase root-flex distortion removed and Field natural widths restored.
- Alerts are presented vertically; Skeleton geometry is preserved by showcase-only wrappers.
- Supporting copy uses muted rather than disabled text.
- Checkbox, Radio and Switch now receive MIRA visual treatment while retaining accessible primitives or native semantics.
- Selected Card is differentiated through semantic surface and border treatment.
- Button disabled and loading presentation is corrected; Secondary remains visible in Operational Light and the link-style action is visually restrained.
- Brand Dark and Operational Light were revalidated in the local showcase.

## Limitations

The route is demo-only and deliberately absent from product navigation. Manual browser inspection remains required; the checklist is intentionally unchecked. No screenshots or visual-test dependency were added.
