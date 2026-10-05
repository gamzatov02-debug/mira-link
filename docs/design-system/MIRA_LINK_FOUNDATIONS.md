# MIRA LINK DESIGN SYSTEM — FOUNDATIONS

## 1. Design Principles

MIRA LINK expresses **Hospitality + Technology + Premium Simplicity**. The system is calm, readable and precise: warm enough for hospitality, structured enough for real-time restaurant operations. It avoids decorative excess, marketplace conventions, neon technology cues, pervasive gold, heavy black-and-gold luxury, cartoon geometry and unrelated visual languages.

Foundations are the shared layer for Website, Guest, Waiter and Venue Admin. They do not alter business rules, existing UI or implementation. The order of future work is **tokens → components → patterns → screens**.

## 2. Brand Expression

The official MIRA brand identity primitives are `color.brand.green` **`#0A1D08`** and `color.brand.gold` **`#C89B3C`**. These are brand colours, not a replacement for the supporting UI palette. The existing raster monogram is the only approved logo source in the repository. It is preserved without reconstruction.

Gold is an identity marker, not a universal interface colour. Use it for selected premium emphasis, concise highlights, focused brand details and a single primary action in a local decision set. Do not use it for large surfaces, paragraphs, every icon, all borders or every concurrent CTA.

**ASSET REQUIRED:** original vector or transparent high-resolution MIRA LINK logo before production-grade brand scaling.

## 3. Color System

The token system flows from **Brand Identity → UI Primitive Tokens → Semantic Tokens → Semantic Modes → Components → Patterns → Screens**. Components use only semantic aliases; brand identity and UI primitives are reserved for definitions and controlled theme computation.

The default MIRA brand environment uses deep green surfaces and warm text. Operational content must remain readable before it feels premium. Status tokens are global and cannot be remapped by a venue.

| Group | Rules |
|---|---|
| Brand | Official MIRA green `#0A1D08` gives continuity; official MIRA gold `#C89B3C` is selective emphasis |
| Background / surface | Distinguish page plane, raised surface and selected/interactive surface without relying on shadows alone |
| Text | Primary and secondary text meet AA on their mapped backgrounds; muted text also meets 4.5:1 for normal-size text |
| Actions | Primary action is an accessible high-contrast semantic action, not necessarily gold |
| Status | Global status meaning uses base identity plus mode-aware foreground, surface and border; labels/icons are mandatory |

Canonical values and contrast notes are in [MIRA_LINK_TOKENS.md](MIRA_LINK_TOKENS.md).

## 4. Venue Theme Layer

MIRA LINK has one Design System plus a controlled Venue Theme Layer. A venue may supply only:

- `venue.accent`
- `venue.accent.hover`
- `venue.accent.contrast`
- `venue.brand.logo`
- `venue.brand.hero`

Optional `venue.surface.selected` is derived from `venue.accent`; it is not an arbitrary colour input. Venue values must pass at least 4.5:1 contrast for text on accent controls and 3:1 contrast against the adjacent default surface. If validation fails, MIRA defaults apply.

Venue themes cannot change typography, spacing, component anatomy, navigation, status semantics, destructive action colour, focus treatment, motion, accessibility rules or interaction patterns. Venue accent may influence Guest-context accent mapping only after contrast validation. A venue accent never changes destructive, success, warning, error, info or focus semantics.

MIRA has two semantic modes within one Design System. **Mode A — Brand / Dark** serves Guest, brand-oriented Website sections and restaurant experience where appropriate. **Mode B — Operational / Light** serves Admin, high-density operational workspace and Waiter screens where light context improves speed and clarity. Website may use Brand/Dark and controlled light sections; Guest defaults to Brand/Dark or an approved Venue Theme mapping; Waiter selects the operational mode according to readability and task speed; Admin uses Operational/Light as its default working context unless a later visual stage establishes an objective reason to change it. This is not a user-selectable setting: **GLOBAL USER DARK MODE — NOT REQUIRED FOR MVP**.

## 5. Typography

**Typography strategy: Manrope is the sole primary family** for Website and all product surfaces. It is locally available, already serves the main product shell and supports the intended calm, technical-but-warm tone. Inter is a legacy Guest implementation source and is not a future foundation role; it remains untouched until a separately approved migration.

Use normal-to-semibold weights (400, 500, 600). Avoid artificial 700–900 emphasis. Use tabular figures for money, metrics, table numbers and order identifiers where the loaded font supports them. Long reading text uses a maximum line length of 65–75 characters.

Responsive rule: Display sizes are fluid only on Website between 768px and 1440px. Product headings step down at mobile. **Essential UI text and interactive labels must not be smaller than 14px.** The 12px caption and 11px overline are only non-critical supporting metadata or decorative/category text; neither may carry critical information or serve as an interactive/form-control label. See the canonical scale in Tokens.

Control dimensions use `control.height.s` 32px, `control.height.m` 40px and `control.height.l` 48px. `control.hit-area.min` is 44px. A compact visual control below 44px is allowed only in an approved desktop operational context or when its actual interactive hit area remains at least 44×44px; modes and roles do not create separate control-height scales.

## 6. Spacing

The system uses a 4px micro-step and an 8px primary rhythm. The official scale is `0, 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96, 128px`.

Use 4/8/12 for intra-control alignment; 16/20/24 for cards, forms and lists; 32/40/48 for screen sections; 64/80/96/128 only for layout/marketing separation. A screen may not introduce near-identical literal values.

## 7. Grid

| Surface | Grid rule |
|---|---|
| Website | 12 columns at desktop, 8 at tablet, 4 at mobile; 1280px standard content cap and 1440px wide-media cap |
| Guest | 4-column mobile canvas; 16px edge padding at 390px+, 12px at 360–389px; max app width 480px |
| Waiter | 4-column mobile operational canvas; 16px edge padding; denser internal spacing than Guest |
| Admin | 12-column fluid desktop workspace, 264px sidebar, 24px desktop gutters; 8-column tablet before navigation collapses |

## 8. Layout

| Context | Foundation rule |
|---|---|
| Website page | 24px mobile / 40px tablet / 64px desktop page padding; section rhythm 64px mobile and 96px desktop |
| Marketing text | 640px max paragraph width; 760px max long-form text width |
| Guest screen | 12–16px horizontal padding; 16px card padding; bottom fixed layers include safe-area inset |
| Waiter screen | 16px horizontal padding; 12–16px operational card padding; priority content remains above fold |
| Admin | 24px desktop workspace padding; 16px tablet; table/detail views use 24px panels |
| Form | 16px field-to-field gap, 8px label/help gap, 24px group gap |
| Overlay | 24px modal/sheet padding; use 16px only in compact operational sheets |

## 9. Breakpoints

Six official breakpoints replace screen-specific breakpoints. Base styles are mobile-first.

| Token | Value | Intended use |
|---|---:|---|
| `breakpoint.sm` | 360px | Small mobile safeguards |
| `breakpoint.md` | 480px | Large mobile / embedded Guest cap |
| `breakpoint.lg` | 768px | Tablet layouts and navigation transformations |
| `breakpoint.xl` | 1024px | Laptop / Admin sidebar workspace |
| `breakpoint.2xl` | 1280px | Desktop content expansion |
| `breakpoint.3xl` | 1440px | Wide marketing media and full-cycle layout |

## 10. Radius

Use a limited radius scale: none 0px, xs 8px, control 12px, card 16px, panel 24px and pill 999px. Controls use 12px; cards and compact images use 16px; sheets/modals and major panels use 24px; only chips, tags and compact segmented options use pill. Circular actions use 50% as geometry, not a design token.

## 11. Borders

Default borders are 1px. Use `border.subtle` for grouping/dividers, `border.default` for surface definition, `border.strong` for selected or persistent objects and `border.focus` for keyboard focus. Use elevation instead of adding borders repeatedly; a surface should normally use one primary separation mechanism.

## 12. Elevation

MIRA uses restrained elevation. `elevation.none` is default; `elevation.subtle` supports floating image/media edges; `elevation.card` supports distinct interactive cards; `elevation.overlay` separates dropdown/sheet context; `elevation.modal` separates a blocking dialog. `color.overlay.backdrop` is the only semantic backdrop value for Dialog and BottomSheet and resolves by mode at `z.overlay`. CSS may implement an elevation value with `box-shadow`, but the design-token category remains `elevation.*`. Elevation assumes an opaque semantic surface and never replaces focus or selected state.

## 13. Iconography

Lucide is the primary icon system. Use outline icons with 1.75px standard stroke; use 2px only for compact status clarity. Sizes: XS 14px, S 16px, M 20px, L 24px, XL 32px. Navigation uses M, icon-only actions use M inside a 44px hit area, and status icons use S/M next to text labels. Do not mix icon libraries without an explicit foundation decision. Decorative icons are hidden from assistive technology.

## 14. Motion

Motion explains state and hierarchy, never adds ornament. Official durations: instant 0ms, fast 120ms, normal 180ms, slow 240ms and overlay 320ms. The canonical easing set is: `easing.standard` `cubic-bezier(.2,0,0,1)`; `easing.enter` `cubic-bezier(0,0,.2,1)`; `easing.exit` `cubic-bezier(.4,0,1,1)`.

Fast applies to hover/press; normal to chips, selected state and compact feedback; slow to panels and toast; overlay to modal/bottom sheet. Skeletons communicate loading without rapid flashing. `prefers-reduced-motion` disables non-essential movement and replaces movement with opacity or immediate state.

## 15. Layering / Z-index

Use semantic layers only: base 0; sticky 10; header 20; floating action/cart 30; map controls 40; dropdown 50; overlay 60; sheet/modal 70; toast 80. Leaflet internal panes remain inside the map-control band and must not exceed overlays. No arbitrary high z-index values.

## 16. Responsive Rules

Guest and Waiter are mobile-first; Website and Admin progressively enhance from mobile/tablet to desktop. Content prioritises task completion over preserving a desktop composition. No document-level horizontal overflow. Cards may change structure, but not shrink text below readable bounds. Fixed controls respect safe areas. Tables become compact cards only when row comparison is not the primary job. Desktop modals become bottom sheets on mobile when the task is short/contextual; payment remains fullscreen.

## 17. Accessibility

Target WCAG AA: 4.5:1 normal text, including muted text; 3:1 large text and meaningful UI icons. A visible Status label must meet 4.5:1 against its status surface; a meaningful status icon must meet 3:1; status surface and border must remain distinct from the surrounding surface. Use visible focus, keyboard reachability, semantic labels, focus trapping/restoration for overlays, readable inline errors, 44×44px recommended touch targets and labels/icons/colour for status. Placeholder text never replaces a label. Maps must offer a list alternative. Accessibility overrides brand preference, including invalid venue accent choices.

## 18. Data Density

One system supports three composition densities:

| Surface | Density | Rule |
|---|---|---|
| Guest | Comfortable | 16–24px groups, imagery and decision clarity |
| Waiter | Compact operational | 12–16px internal groups, persistent priority signals, no reduced touch areas |
| Admin | Efficient data-oriented | 16–24px panels, tables/filters for comparison, concise labels |

Density changes composition, never core identity, token names or accessibility minimums.

## 19. Imagery

Restaurant hero: 16:9 or 3:2; venue/event cover: 16:9; product: 4:3; compact product thumbnail: 1:1. Use `object-fit: cover` with meaningful focal point, 16px radius for card media and 24px only for standalone hero/panel media. Use an explicit neutral fallback and loading placeholder; never use a missing image as a visual state. Dark overlays serve text legibility only and must preserve image recognition.

## 20. Numeric Data

Use `font-variant-numeric: tabular-nums` for amounts, percentages, table/order identifiers and metrics. Align monetary values to the end of comparable rows. Preserve existing domain money formatting and kopeck calculations; tokens control only hierarchy and alignment. Amount is primary, currency follows the locale formatter, and status/label is adjacent rather than embedded in a colour cue.

## 21. Website vs Product UI

Website may use display type, wider white space, hero imagery and reserved brand compositions. Product UI is more restrained: task hierarchy, durable labels, compact feedback and operational clarity. Both share the same semantic colour, type, spacing, icon and motion foundations.

## 22. Figma Mapping

| Figma object | Source |
|---|---|
| Variables | Brand identity and UI primitives; semantic colour variables with `MIRA / Brand Dark` and `MIRA / Operational Light` modes; spacing, radius, breakpoint and z-index numeric tokens |
| Text styles | Display, heading, body, label, button, caption, overline and metric tokens |
| Effects | Elevation tokens |
| Grid styles | Website, Guest, Waiter and Admin grid specifications |

No Figma export is performed in this stage.

## 23. Frontend Mapping

Future code may expose aliases such as `--color-bg-primary`, `--color-text-primary`, `--space-4`, `--radius-card`, `--elevation-overlay`, `--motion-duration-fast`, `--breakpoint-lg` and `--z-modal`. The semantic colour aliases resolve by selected product-surface mode; the controlled Venue Theme layer overrides only approved Guest-context accent mapping. These names are specification targets only; no production CSS was changed.

## 24. Governance Rules

1. Screens do not introduce arbitrary foundation values.
2. Components consume semantic tokens, not raw primitives.
3. Venue themes cannot modify accessibility-critical semantics.
4. Status tokens are global.
5. New tokens require a documented reason and a non-duplicative value.
6. Product surfaces may vary in density, not core identity.
7. Existing domain logic is never changed by visual tokens.
8. Foundation changes require contrast, responsive and cross-surface review before adoption.
