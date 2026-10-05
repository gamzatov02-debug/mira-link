# Stage 7.5A — Desktop Split View Visual Polish

## Status

`PASS`

Stage 7.5A is a controlled presentation correction of the accepted Stage 7.5
Waiter Floor. It changes no domain entity, command, route, financial
calculation, Guest flow or mobile interaction.

## Filled Detail assessment

The required 1440 px audit used Table 12 with two real Orders and a Bill total
of `2 760,00 ₽`. The existing 43/57 workspace gave the populated detail 699 px
and 661 px of internal content width. Session rows, Bill values, two Order cards,
statuses and actions remained readable without compressed text or altered
business data.

The Floor had sufficient horizontal room for three 170 px cards. Its problem
was vertical density, rather than the split ratio. Therefore the ratio was not
changed.

## Split ratio

| State | Ratio |
| --- | --- |
| Before | 43% Floor / 57% Detail |
| Tested | 43/57 with populated two-Order Table Detail |
| Final | 43% Floor / 57% Detail |

The optional 46/54 and 47/53 ratios were not applied. Compacting the Floor
cards solved the density problem while preserving the more valuable Order and
Bill reading width.

## Floor density

- Free desktop/tablet cards now show Table name and semantic status only.
- `Нет активного посещения` remains available in Table Detail and remains
  visible on mobile; it is hidden only in the compact split-view card.
- Active cards retain Order/Session context and the Bill total.
- Grid rows no longer stretch every free card to the height of an adjacent
  active card.
- Read-only cards use a small `Просмотр` chip on split view. Mobile preserves
  the existing `Только просмотр` wording.
- Selected state retains the subtle green surface, border and `aria-pressed`
  semantics.

## Empty Detail

The empty persistent detail keeps the existing icon, title and supporting text.
Its split-view minimum height and excess padding were removed. The resulting
placeholder is under 110 px in the 768 px automated assertion and no longer
resembles a dashboard card.

## Desktop navigation

The existing routes and labels remain unchanged. At 768 px and above the
horizontal navigation is a compact 560 px floating bar inside the shell instead
of a 1280 px full-width mobile-style bar. Buttons remain 48 px high. Mobile
retains the existing full-width fixed Bottom Navigation.

This avoids a navigation rail refactor and preserves the Stage 7.5 component
and routing architecture.

## 1440 px measurements

| Metric | Before | After |
| --- | ---: | ---: |
| Application shell width | 1280 px | 1280 px |
| Floor pane width | 527 px | 527 px |
| Detail pane width | 699 px | 699 px |
| Split ratio | 43/57 | 43/57 |
| Free Table card | 170×108 px | 170×73 px |
| Active Table card | 170×130 px | 170×120 px |
| Read-only Table card | 170×121 px | 170×95 px |
| Detail content width | 661 px | 661 px |
| Filled Detail internal padding | 18 px | 18 px |
| Desktop navigation | 1280×60 px | 560×58 px |
| Page horizontal overflow | none | none |
| Fully visible My Tables | 6 | 6 |

All six assigned Tables were visible before and after. After the correction the
Floor stack is 93 px shorter in the audited filled state, leaving more usable
space for subsequent operational content.

## Responsive matrix

| Viewport | Shell width | Floor columns | Detail mode | Navigation | Touch target | Overflow |
| ---: | ---: | ---: | --- | --- | --- | --- |
| 360 | 360 | 2 | BottomSheet | full-width bottom | ≥44 px | none |
| 375 | 375 | 2 | BottomSheet | full-width bottom | ≥44 px | none |
| 390 | 390 | 2 | BottomSheet | full-width bottom | ≥44 px | none |
| 430 | 430 | 2 | BottomSheet | full-width bottom | ≥44 px | none |
| 480 | 480 | 2 | BottomSheet | full-width bottom | ≥44 px | none |
| 768 | 736 | 2 | persistent | compact horizontal | ≥44 px | none |
| 1024 | 992 | 2 | persistent | compact horizontal | ≥44 px | none |
| 1280 | 1248 | 3 | persistent | compact horizontal | ≥44 px | none |
| 1440 | 1280 | 3 | persistent | compact horizontal | ≥44 px | none |

Mobile Table cards remain 148 px high and the existing BottomSheet interaction
is unchanged. Split-view free cards are 73 px high; active and read-only cards
expand only for their useful content.

## Verification

| Check | Result |
| --- | --- |
| TypeScript | PASS |
| Unit tests | 46/46 PASS |
| Stage 7.5A / split-view targeted E2E | 17/17 PASS |
| Waiter Floor + Foundation + split-view combined | 31 tests executed; one obsolete 108 px assertion corrected, affected rerun PASS |
| Guest / Design / ProductCard regression | 34/34 PASS |
| Full Chromium E2E | 70/70 PASS |
| Full Chromium exit code | 0 |
| Failed / skipped | 0 / 0 |

The Foundation assertion changed from `desktop card >=108 px` to the approved
Stage 7.5A free-card range of 68–90 px. The mobile minimum remains 148 px. No
domain, financial or workflow assertion was removed or weakened.

The full run still prints pre-existing non-failing Vite/React hydration
diagnostics for Radix Switch style serialization, Nearby floating distance and
an input caret style. They are outside this Waiter presentation correction.

## Screenshots

- `docs/QA/stage-7.5a/before-table-12-1440.png`
- `docs/QA/stage-7.5a/after-table-12-1440.png`
- `docs/QA/stage-7.5a/mobile-floor-390.png`
- `docs/QA/stage-7.5a/mobile-table-sheet-390.png`
- `docs/QA/stage-7.5a/split-768.png`
- `docs/QA/stage-7.5a/table-12-1024.png`
- `docs/QA/stage-7.5a/read-only-1440.png`
- `docs/QA/stage-7.5a/attention-1440.png`

## Changed files

- `components/waiter/waiter-app.tsx`
- `app/waiter-design-system.css`
- `tests/e2e/waiter-split-view.spec.ts`
- `tests/e2e/waiter-foundation.spec.ts`
- `docs/QA/STAGE_7_5A_WAITER_SPLIT_VIEW_POLISH.md`
- eight screenshot files under `docs/QA/stage-7.5a/`

## Boundaries

- Stage 7.4 foundation preserved.
- Stage 7.5 split view preserved.
- Mobile BottomSheet preserved.
- Guest unchanged.
- Domain business logic unchanged.
- Handoff not implemented.
- DEC-WTR-018–035 remain open.
- Stage 7.6 was not started.
