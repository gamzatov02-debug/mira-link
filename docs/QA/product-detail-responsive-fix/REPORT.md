# Guest Product Detail responsive regression fix

## Result

- Status: PASS
- Stage 7.7: not started
- Stage 7.6 Orders Workspace: unchanged and regression-verified
- Full Chromium: 94/94 passed, 0 failed, 0 skipped

## Root cause

Guest Product Detail used the universal Tier 1 `BottomSheet` with `side="bottom"`. The primitive applies `inset-x: 0` and had no desktop width or positioning override. The Design System `.sheet` rule limited only height (`max-height: 80vh`). At an observed 863px viewport, the computed Product Detail width was 862.69px with left edge 0px, and the image width was 840.30px.

The Product Detail now opts into a local `responsive-dialog` presentation. Mobile keeps the existing bottom-sheet position. From 768px it uses the existing 480px Guest overlay limit, centers with `top/left: 50%` and `translate: -50% -50%`, retains safe viewport margins, and scrolls only its content. A 16px inline safe margin prevents mobile content from touching or clipping at the viewport edge. Other BottomSheet consumers keep the default presentation.

## Responsive measurements

All values are CSS pixels. `right edge` is the free viewport space after the surface. Image rendering uses `object-fit: cover` at every viewport.

| Viewport | Surface width | Left edge | Right edge | Content width | Image (W×H) | Document overflow |
| ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| 360 | 360 | 0 | 0 | 328 | 328×190 | 0 |
| 375 | 375 | 0 | 0 | 343 | 343×190 | 0 |
| 390 | 390 | 0 | 0 | 358 | 358×190 | 0 |
| 430 | 430 | 0 | 0 | 398 | 398×190 | 0 |
| 480 | 480 | 0 | 0 | 448 | 448×190 | 0 |
| 768 | 480 | 144 | 144 | 430 | 430×190 | 0 |
| 1024 | 480 | 272 | 272 | 430 | 430×190 | 0 |
| 1280 | 480 | 400 | 400 | 430 | 430×190 | 0 |
| 1440 | 480 | 480 | 480 | 430 | 430×190 | 0 |

The targeted test also verifies the full title bounds, composition, allergens, price, modifier presence, close control geometry, CTA height, image containment, and page overflow.

## Validation

| Check | Result |
| --- | --- |
| TypeScript | PASS |
| Unit/domain | 46/46 PASS |
| Product Detail targeted E2E | 9/9 PASS |
| Guest regression E2E | 39/39 PASS |
| Waiter Stage 7.6 regression E2E | 15/15 PASS |
| Full Chromium E2E | 94/94 PASS |
| Full Chromium failures / skipped | 0 / 0 |

The former full baseline contained 85 tests. The full count is now 94 because the nine required Product Detail viewport cases were added.

## Evidence

- `metrics.json`
- `product-detail-390.png`
- `product-detail-768.png`
- `product-detail-1024.png`
- `product-detail-1440.png`

## Changed files

- `components/design-system/index.tsx`
- `components/design-system/styles.module.css`
- `components/demo-app.tsx`
- `tests/e2e/product-detail-layout.spec.ts`
- `docs/QA/product-detail-responsive-fix/REPORT.md`
- `docs/QA/product-detail-responsive-fix/metrics.json`
- four Product Detail screenshots listed above

No Guest Home, ProductCard, authentication, restaurant session, finance, Waiter Floor, Waiter Orders, POS, or domain behavior was changed.
