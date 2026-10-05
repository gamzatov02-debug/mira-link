# MIRA LINK DESIGN SYSTEM — COMPONENT IMPLEMENTATION

## Scope

Stage 4.1 creates an isolated visual implementation at `components/design-system/`. It is not imported by existing screens, routes, `components/mira.tsx`, `components/mira-domain-ui.tsx` or `components/ui/*`. No product pattern, screen or domain behaviour is included.

## Files

| File | Purpose |
|---|---|
| `components/design-system/tokens.ts` | Typed bridge for approved control, motion, elevation and layer tokens |
| `components/design-system/styles.module.css` | Module-scoped implementation of approved semantic modes and component presentation |
| `components/design-system/index.tsx` | Public MIRA Component API with 18 Tier 1 components |

## Public API — 18 / 18 Tier 1 components

| Category | Components |
|---|---|
| Actions | `Button`, `IconButton` |
| Forms | `Field`, `TextInput`, `Textarea` |
| Selection | `Checkbox`, `Radio`, `Switch`, `Chip` |
| Data display | `Card`, `Badge`, `StatusBadge` |
| Feedback | `Alert`, `Toast` |
| Overlays | `Dialog`, `BottomSheet` |
| Loading/system | `Skeleton`, `EmptyState` |

All components accept `mode?: "brand-dark" | "operational-light"` where they render semantic presentation. Modes resolve values through the same component anatomy; no Guest, Waiter or Admin variants exist.

## API and behaviour

- `Button`: primary, secondary, ghost, destructive and link-style action variants; S/M/L; icons, loading, full width and disabled state. Link-style remains a native button.
- `IconButton`: action control with required `aria-label` and a 44px minimum hit area.
- `Field`: label, required marker, help/error/success message and counter around a supplied control.
- `TextInput` and `Textarea`: standard native controls with mode-aware visual anatomy; TextInput exposes leading/trailing slots.
- `Checkbox`, `Radio`, `Switch` and `Chip`: native/control semantics with labelled, selected and disabled behaviours.
- `Card`: universal default, interactive, selected and raised card semantics built above the private structural surface treatment.
- `StatusBadge`, `Alert` and `Toast`: use the same global status variants and mode-aware status presentation values.
- `Dialog` and `BottomSheet`: wrap existing internal Radix Dialog and Sheet primitives for focus trap, focus restoration and Escape handling.
- `Skeleton`: text, avatar, media, block and card-shell geometry variants.
- `EmptyState`: generic icon, title, explanation and action slots only.

## Status architecture

Status type is a semantic variant, never an interaction state. Success, Warning, Error, Info, Neutral and Pending use approved `base`, `foreground`, `surface` and `border` architecture. The implementation retains text labels and optional icons; colour is never the only signal. The Stage 3 contrast table validates all twelve mode/status foreground-to-surface combinations at 4.5:1 or above.

## Accessibility and responsive checks

The implementation uses native buttons, inputs, textareas, checkbox/radio controls and `role="switch"`; interactive controls provide visible focus styles and disabled semantics. Field propagates `required` and `aria-required` to a compatible child control, while retaining the visible marker. Field connects validation text with its control and resolves Error/Success text through the shared mode-aware status foreground architecture. IconButton requires an accessible label.

Checkbox provides an `indeterminate?: boolean` API and synchronizes the native DOM `indeterminate` property through a forwarded ref and effect. Chip has a separate public API: Button-only icon, loading, sizing and width props are not forwarded. A removable Chip renders its remove action only when an actual callback is supplied and accepts a contextual `removeLabel`.

Persistent Alert is ordinary page content and owns no live region. Toast is the sole live-region owner: Error/Warning use assertive `alert`; Success/Info use polite `status`. This prevents nested competing announcements.

Dialog and BottomSheet delegate focus trap, focus restoration and Escape/dismiss behaviour to existing internal Radix-based primitives. Both apply approved `color.overlay.backdrop`. BottomSheet has safe-area bottom padding, bounded height and internal scrolling. It presents a vendor sheet handle only where supplied by the internal primitive; drag-to-dismiss is deferred to a separate Vaul-based implementation decision and is not imitated.

Visual sizing uses 32/40/48px control heights with a 44px icon-button/mobile hit-area rule. Button variants now include explicit hover and pressed treatment. Skeleton intentionally has no animation; the spinner uses approved motion timing and is disabled under `prefers-reduced-motion`.

Component contracts support long Russian labels, ₽ values, long names, dynamic counts and empty content. Module styles include narrow-width action wrapping. A dedicated preview route was intentionally not created because the brief prohibits route changes.

## Validation

- `npm run typecheck` — PASS
- Existing screens do not import `components/design-system/` — PASS
- Existing vendor primitives are unchanged — PASS
- No production route, screen, domain or product pattern was created — PASS

**VISUAL QA: LIMITED — isolated preview unavailable.** No preview route or Storybook was created because that would require project integration or route changes prohibited by Stage 4.1. Automated checks validate types and import isolation; visual review remains a future isolated-preview task.

## Deferred Tier 2

Link, SearchField, Select, SegmentedControl, navigation components, List/ListItem, DataTable, Tooltip, Popover, DropdownMenu, ConfirmationDialog, Drawer, Spinner, Progress, ErrorState, OfflineState, UnavailableState and structural primitives remain specification-only.

## Known limitations

The library is intentionally disconnected until a later approved migration. CSS is module-scoped and uses approved isolated token values; the token bridge documents the shared control, backdrop, motion, elevation and layer values. No isolated route/Storybook preview or visual test runner was added because neither is available without changing project integration or dependencies.
