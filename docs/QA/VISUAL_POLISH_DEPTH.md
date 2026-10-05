# MIRA LINK Guest visual polish — depth, gradients and shadows

Date: 2026-10-02

## Scope

Presentation-only polish for the existing Guest UI. No structure, geometry, typography, spacing, navigation, domain state, authentication, financial logic or Stage 7 domain work was changed.

## Semantic visual tokens

The Guest theme defines and consumes these scoped semantic tokens:

- `--mira-gradient-gold-primary`
- `--mira-gradient-surface-raised`
- `--mira-gradient-surface-card`
- `--mira-gradient-glass`
- `--mira-shadow-card`
- `--mira-shadow-control`
- `--mira-shadow-control-hover`
- `--mira-shadow-control-active`
- `--mira-shadow-nav`
- `--mira-control-hover-filter`
- `--mira-control-active-filter`
- `--mira-control-active-transform`
- `--mira-card-hover-filter`

Design System rules use neutral fallbacks when these Guest-scoped variables are absent.

## Components and surfaces

- Primary gold CTA and round promo action: vertical gold gradient, top inset highlight, lower inset shade, restrained outer shadow; hover and pressed states preserve focus-visible behavior.
- Quick action cards: subtle raised green gradient, mixed semantic border and Level 2 shadow.
- Product cards: semantic green surface gradient, existing geometry and media priority preserved.
- Favourite overlay: translucent green gradient, semantic border, blur where supported, subtle shadow and gold icon; touch target remains 44 px.
- Promotion card: raised green gradient, subtle radial illumination, semantic border and card shadow.
- Bottom navigation: translucent green gradient, top highlight and upward shadow; active item receives a restrained gold glow.

## Responsive QA

Verified by the final ProductCard responsive suite at 360, 375, 390, 430, 480 and 1440 px.

| Viewport | Recommendation card | Visible cards | CTA | Favourite | Page overflow |
| --- | ---: | ---: | ---: | ---: | --- |
| 360 px | 181.44 px | 1.77 | 48 px | 44 px | none |
| 375 px | 189.53 px | 1.78 | 48 px | 44 px | none |
| 390 px | 197.63 px | 1.78 | 48 px | 44 px | none |
| 430 px | 200 px | 1.91 | 48 px | 44 px | none |
| 480 px | 200 px | 2.15 | 48 px | 44 px | none |
| 1440 px | 200 px | 2.14 | 48 px | 44 px | none |

At every viewport, Menu remained two columns; title and description remained capped at two lines; metadata remained one line; carousel overflow stayed inside its scroll container. Final screenshots show no visible gradient banding or clipped card/control shadows.

## Validation

- TypeScript: PASS (`npm run typecheck`)
- Unit/domain tests: 34/34 PASS (`npm test`)
- Guest theme + ProductCard targeted E2E: 12/12 PASS
- Full Chromium E2E: 38/38 PASS, 0 failed, 0 skipped

The full run emitted existing non-failing hydration diagnostics for the demo Switch/input serialization and Nearby geolocation floating-point value. No test failed and no related source was changed in this visual pass.

## Evidence

- `docs/QA/visual-polish/guest-depth-390.png`
- `docs/QA/visual-polish/guest-depth-desktop.png`
- `docs/QA/stage-6.2c/product-card-layout.json`
- `docs/QA/stage-6.2c/product-card-menu-{360,375,390,430,480,1440}.png`
- `docs/QA/stage-6.2c/product-card-popular-{360,375,390,430,480,1440}.png`

## Changed implementation files

- `app/guest-design-system.css`
- `components/design-system/styles.module.css`
- `components/patterns/patterns.module.css`

