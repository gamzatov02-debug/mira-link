# MIRA LINK DESIGN SYSTEM — COMPONENT DECISIONS

| ID | Question | Decision | Reason |
|---|---|---|---|
| CD-001 | Who owns the public component API? | MIRA Design System owns the future public API; shadcn/Radix/Vaul remain possible internal implementation primitives. | Product code needs one stable MIRA contract rather than several competing imports. |
| CD-002 | Which Button variants are needed? | Primary, Secondary, Ghost, Destructive and Link-style; S/M/L only. | They cover action hierarchy without variant explosion. |
| CD-003 | How are component sizes governed? | S/M/L is the default where sizes are needed; some components have only Default/Compact. | Size exists only when it changes task ergonomics, never to create decorative permutations. |
| CD-004 | How is StatusBadge made accessible? | It combines status foreground, proposed subtle surface/border, icon and visible label. | Status cannot be communicated by one `color.status.*` value alone. |
| CD-005 | What distinguishes Dialog and BottomSheet? | Dialog is a constrained desktop/large-context overlay; short contextual mobile tasks may use BottomSheet. Drawer is separate for navigation and contextual panels. | Presentation follows task and viewport while preserving overlay semantics. |
| CD-006 | How do densities work? | Comfortable, Compact Operational and Efficient Data change composition and approved spacing only. | Density must not create duplicate Button, Field or navigation libraries or reduce accessibility. |
| CD-007 | Are theme/mode component variants? | No. Brand Dark and Operational Light resolve semantic variables; Venue Accent is a controlled Guest-context mapping. | Modes must not multiply Figma/component variants or change anatomy. |
| CD-008 | How is navigation owned? | One NavigationItem anatomy supports Top, Bottom and Sidebar containers; final destinations remain Product Pattern/Screen work. | Shared interaction anatomy avoids three unrelated navigation libraries while avoiding premature IA implementation. |
| CD-009 | How are fields assembled? | Field owns label, required marker, help/error/success and counter; controls own input anatomy. | Labels and validation remain consistent across TextInput, Textarea, Select and selection controls. |
| CD-010 | Should Stage 4 implement isolated components now? | **IMPLEMENTATION DEFERRED TO ISOLATED VISUAL BUILD.** | Status surface, overlay backdrop and control-height foundation extensions are needed before a safe isolated API can avoid local values. |
| CD-011 | How are current MIRA and shadcn duplicates handled? | Preserve vendor primitives internally; evolve MIRA wrappers; consolidate overlapping public APIs later. | Existing screens keep working while a single product API is introduced deliberately. |
| CD-012 | How is Russian/dynamic content handled? | Every component must support long Russian labels, ₽ values, names, errors and dynamic counts without hiding critical meaning. | Component contracts must fit MIRA’s actual content, not short English demo labels. |
| CD-013 | How are Button and Link semantics separated? | Link-style Button styling could blur action and navigation semantics. | Button triggers an action even when link-styled; Link changes route, resource, document or location. | Visual treatment never changes native semantic role, keyboard behaviour or accessible expectation. |
| CD-014 | Is `CardSurface` distinct from `Surface`? | Registry used one name for both low-level structure and reusable card semantics. | `Surface` is structural; `Card` builds on Surface and adds Default/Interactive/Selected/Raised card semantics. | The chain is Surface → Card → Product Pattern, without introducing a product pattern now. |
| CD-015 | Are status types interaction states? | Matrix had treated success/error as states for feedback components. | Status is a semantic variant/type; interaction states remain focus, hover, entering, visible, dismissing or disabled where applicable. | This keeps status meaning separate from interaction lifecycle and shares one architecture across StatusBadge, Alert, Toast and InlineValidation. |

## Foundation Extensions Approved

1. **APPROVED: Status presentation tokens** — mode-aware foreground, surface and border aliases for each global status.
2. **APPROVED: Overlay backdrop token** — `color.overlay.backdrop` with two mode values at `z.overlay`.
3. **APPROVED: Control dimensions** — `control.height.s/m/l` and `control.hit-area.min`.

These extensions are approved and recorded in Stage 3 Foundations and Tokens. This document creates no implementation code.
