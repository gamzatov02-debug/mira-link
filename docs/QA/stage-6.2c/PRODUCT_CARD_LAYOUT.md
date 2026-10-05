# ProductCard recommendation carousel correction

Status: **PASS** on 2026-10-01. Stage 7 was not started.

## Scope and implementation

- The approved two-column Menu grid was preserved without changes.
- The more specific Guest stylesheet rule that forced recommendation cards to `116px` was corrected locally to `clamp(180px, 54%, 200px)`.
- Horizontal overflow remains contained by the recommendation carousel. Its scrollbar is hidden through the existing mobile carousel presentation.
- The compact `weight · price` line is kept on one line only inside `guest-popular`.
- ProductCard API, Product Detail, domain data, authentication, restaurant sessions, navigation, financial logic and global Design System tokens were not changed.

## Measured recommendation layout

| Viewport | Card width | Visible cards | Title | Description | Metadata | CTA | Favourite | Carousel overflow | Page overflow |
|---:|---:|---:|---:|---:|---:|---:|---:|:---:|:---:|
| 360px | 181.44px | 1.77 | 2 lines | 2 lines | 1 line, nowrap | 147.44 × 48px | 44 × 44px | Yes | No |
| 375px | 189.53px | 1.78 | 2 lines | 2 lines | 1 line, nowrap | 155.53 × 48px | 44 × 44px | Yes | No |
| 390px | 197.63px | 1.78 | 2 lines | 2 lines | 1 line, nowrap | 163.63 × 48px | 44 × 44px | Yes | No |
| 430px | 200px | 1.91 | 2 lines | 2 lines | 1 line, nowrap | 166 × 48px | 44 × 44px | Yes | No |
| 480px | 200px | 2.15 | 2 lines | 2 lines | 1 line, nowrap | 166 × 48px | 44 × 44px | Yes | No |
| 1440px | 200px | 2.14 inside Guest canvas | 2 lines | 2 lines | 1 line, nowrap | 166 × 48px | 44 × 44px | Yes | No |

All six cards remain in one horizontal row and have equal measured height within 1px. Raw measurements are stored in `product-card-layout.json`.

## Current screenshots

The screenshots below were regenerated from the final code during the successful targeted and full E2E runs:

- `product-card-popular-360.png`
- `product-card-popular-375.png`
- `product-card-popular-390.png`
- `product-card-popular-430.png`
- `product-card-popular-480.png`
- `product-card-popular-1440.png`

Menu regression screenshots were also regenerated at the same six viewports as `product-card-menu-<viewport>.png`.

## Verification

- TypeScript: **PASS**, exit 0.
- Unit tests: **23/23 PASS**, exit 0; skipped 0.
- Targeted ProductCard responsive E2E: **6/6 PASS**, exit 0. Evidence: `recommendation-targeted-e2e.json`.
- Guest-theme E2E: **6/6 PASS**, exit 0. Evidence: `recommendation-guest-theme-e2e.json`.
- Full Chromium Stage 6 E2E: **38/38 PASS**, exit 0; failures 0; skipped 0. Evidence: `recommendation-full-e2e.json`.

The Playwright server emitted pre-existing React hydration warnings. They did not fail any scenario and were outside this visual correction.

## Files changed in this correction

- `app/guest-design-system.css`
- `tests/e2e/product-card-layout.spec.ts`
- `docs/QA/STAGE_6_E2E_PROGRESS.md`
- `docs/QA/stage-6.2c/PRODUCT_CARD_LAYOUT.md`
- Current JSON and PNG evidence under `docs/QA/stage-6.2c/`.
