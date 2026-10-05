# MIRA LINK — Home Visual Proportions Correction

Status: **PASS**  
Date: 2026-10-02  
Scope: Guest Home visual proportions only

## Root cause

The Home Hero had a fixed height of `170px`, while each recommendation used the full shared ProductCard anatomy at up to `200px` wide: 4:3 media, two description lines, metadata and a 48px CTA. At 390px this produced a `370.31px` recommendation card against a `170px` Hero and only `1.78` visible cards. The recommendation therefore carried more visual mass than the restaurant image.

The correction is local to Guest Home:

- Hero height is `210px` while width, radius, content and carousel behaviour stay unchanged.
- Recommendation width uses `clamp(138px, calc((100% - 12px) * .416667), 180px)` against the actual carousel width.
- Home recommendation description is visually hidden; domain data, Product Detail and Menu ProductCard remain unchanged.
- Local recommendation body spacing is reduced from 8px to 6px with 10px top padding.

## 390px before / after

| Metric | Before | After |
|---|---:|---:|
| Guest content width | 390px | 390px |
| Hero width | 366px | 366px |
| Hero height | 170px | 210px |
| Hero aspect ratio W:H | 2.153 | 1.743 |
| Hero image height | 168px | 208px |
| Hero radius | 20px | 20px |
| Header → Hero | 0px | 0px |
| Hero → Action Grid | 12px | 12px |
| Action Grid card | 85.5 × 90px | 85.5 × 90px |
| Action Grid gaps H/V | 8 / 8px | 8 / 8px |
| Action Grid height | 188px | 188px |
| Promo | 366 × 76px | 366 × 76px |
| Popular heading height | 48px | 48px |
| Popular card | 197.63 × 370.31px | 147.5 × 273.72px |
| Popular image | 195.63 × 146.72px | 145.5 × 109.13px |
| Popular image aspect ratio W:H | 1.333 | 1.333 |
| Popular content height | 205.59px | 146.59px |
| Popular horizontal gap | 8px | 8px |
| Visible Popular cards | 1.780 | 2.354 |
| Visible next-card fraction | 0.812 | 0.373 |
| Favourite target | 44 × 44px | 44 × 44px |
| CTA height | 48px | 48px |
| Page horizontal overflow | No | No |

## 390px vertical composition

| Coordinate | Before | After |
|---|---:|---:|
| Hero top | 177px | 177px |
| Hero bottom | 347px | 387px |
| Action Grid bottom | 547px | 587px |
| Promo bottom | 635px | 675px |
| Popular heading top | 651px | 691px |
| Popular cards top | 707px | 747px |
| Fixed Bottom Navigation top | 832px | 832px |

## Responsive measurements

| Viewport | Hero W×H | Popular card W×H | Image H | Visible cards | Favourite | CTA H | Page overflow |
|---:|---:|---:|---:|---:|---:|---:|---:|
| 360px | 336 × 210px | 138 × 266.59px | 102px | 2.301 | 44 × 44px | 48px | No |
| 375px | 351 × 210px | 141.25 × 269.03px | 104.44px | 2.352 | 44 × 44px | 48px | No |
| 390px | 366 × 210px | 147.5 × 273.72px | 109.13px | 2.354 | 44 × 44px | 48px | No |
| 430px | 398 × 210px | 160.83 × 283.70px | 119.11px | 2.357 | 44 × 44px | 48px | No |
| 480px | 448 × 210px | 180 × 298.09px | 133.5px | 2.383 | 44 × 44px | 48px | No |
| 1440px demo | 446 × 210px | 180 × 298.09px | 133.5px | 2.372 | 44 × 44px | 48px | No |

All viewports retain two title lines maximum, one-line nowrap metadata, a hidden Home-only description and horizontal overflow contained inside the recommendation carousel.

## 390px reference ratios after correction

| Ratio | Value |
|---|---:|
| Hero height / Guest content width | 0.538 |
| Popular card width / Guest content width | 0.378 |
| Popular card height / Hero height | 1.303 |
| Popular image height / Popular card height | 0.399 |

The image represents approximately 61% of the non-CTA upper content stack when media, title and metadata are considered, while the 48px CTA remains intact.

## Verification

| Check | Result |
|---|---:|
| TypeScript | PASS |
| Unit/domain | 46/46 PASS |
| Guest Home + ProductCard responsive targeted | 7/7 PASS |
| Guest theme targeted | 6/6 PASS |
| Full Chromium | 39/39 PASS |
| Inherited Chromium baseline | 38/38 retained |
| Failures | 0 |
| Skipped | 0 |

The Guest-theme test previously asserted the old `170px` Hero height. Its geometry expectation was updated to the approved `210px`; theme invariance and domain-state assertions were retained unchanged.

## Evidence

- `docs/QA/home-visual-proportions/home-before-metrics.json`
- `docs/QA/home-visual-proportions/home-after-metrics.json`
- `docs/QA/home-visual-proportions/home-390-before.png`
- `docs/QA/home-visual-proportions/home-360-after.png`
- `docs/QA/home-visual-proportions/home-375-after.png`
- `docs/QA/home-visual-proportions/home-390-after.png`
- `docs/QA/home-visual-proportions/home-430-after.png`
- `docs/QA/home-visual-proportions/home-480-after.png`
- `docs/QA/home-visual-proportions/home-1440-after.png`

**MENU GRID UNCHANGED**  
**DOMAIN UNCHANGED**  
**BUSINESS LOGIC UNCHANGED**  
**STAGE 7 DOMAIN UNCHANGED**
