# MIRA LINK DESIGN SYSTEM — COMPONENT LIBRARY

## 1. Principles

This library is the component layer in **Tokens → Components → Patterns → Screens**. It provides reusable interface anatomy only. It does not define venue, dish, order, payment, table, split, event, promotion, analytics or other product patterns, and it does not redesign any screen.

Every component consumes approved semantic tokens, supports `MIRA / Brand Dark` and `MIRA / Operational Light`, and uses the controlled Venue Theme layer only for approved Guest-context accent mapping. Modes are variables, never component variants. No component may introduce a colour, type size, spacing, radius, elevation, breakpoint, motion value or z-index outside Stage 3; an unmet need requires an explicit Foundation Decision.

## 2. Component Ownership

**MIRA Design System is the future public product API.** Vendor/shadcn/Radix/Vaul primitives remain a possible internal implementation layer. Future product code should consume `Mira/Button`, `Mira/Dialog` and equivalent MIRA contracts, not select between competing primitive libraries. This is an ownership target only: no migration occurs in Stage 4.

## 3. Actions

| Component | Contract |
|---|---|
| Button | An action control: submit, confirm, save, open a contextual action or trigger an operation. Variants: Primary, Secondary, Ghost, Destructive, Link-style. Link-style remains a Button semantically. Sizes S/M/L map to `control.height.s/m/l`; mobile interaction respects `control.hit-area.min`. |
| IconButton | Primary, Secondary, Ghost; Destructive only when justified. Uses icon S/M/L within a 44×44px mobile target. Requires accessible label and tooltip when explanation helps. |
| Link | A navigation control: route, resource, document or location transition. Inline, Standalone and Navigation types. Visual resemblance to a Button never changes semantic role. Gold is selective, not default. |

**Button anatomy:** Container → leading icon (optional) → label → trailing icon (optional) → loading indicator (optional). Loading preserves allocated label width and exposes busy state.

## 4. Forms

Field is separate from control anatomy. `Field` owns label, required marker, help, error, success and optional character count; a placeholder never substitutes for a label. Validation is inline and local: help, warning, error or success, rather than a large alert for each field.

| Component | Contract |
|---|---|
| Field | Composes one labelled control and messages. Error references the control with accessible description; required state is programmatic and visible. |
| TextInput | One default control size plus compact only where data-density requires it. Supports leading icon, trailing action, clear and password visibility when relevant. States: default, hover, focus, filled, disabled, error, success, read-only. |
| Textarea | Supports min/max height, validation and counter through Field. Vertical resize is allowed in operational desktop contexts; mobile uses controlled growth. |
| SearchField | Documented composition of TextInput: search icon, clear, loading and no-results relationship. It introduces no separate language. |
| Select | Desktop uses a keyboard-operable dropdown; mobile may use BottomSheet when long choice lists or touch selection improve the task. Select chooses a value; it is not DropdownMenu. |
| SearchFilterBar | Reusable composition of SearchField, optional filters, result count and clear filters. It supplies no product query, filter logic or content. |

**Field anatomy:** Field container → label + required marker → control slot → help/error/success slot → character counter (optional).  
**Select anatomy:** Trigger → selected value/placeholder → indicator → overlay list → option → selection indicator.

## 5. Selection

| Component | Contract |
|---|---|
| Checkbox | Unchecked, checked, indeterminate, hover, focus, disabled and error. Associated label is part of the clickable target. |
| Radio | Unselected, selected, hover, focus, disabled and error. Used for mutually exclusive choices only. |
| Switch | Off/on, hover, focus and disabled. Represents an immediate change; never a pending choice that separately requires Save. |
| SegmentedControl | 2–5 short mutually exclusive options. Selected, hover, focus and disabled states. It does not replace Tabs when a whole content section changes. |
| Chip | Filter, choice and removable roles; default, selected, hover, focus, disabled. Chip is not a StatusBadge. |

## 6. Navigation

`NavigationItem` is shared anatomy: leading icon (optional) → label → badge/count (optional) → trailing affordance (optional). It supports default, active, hover, focus and meaningful disabled state.

| Component | Contract |
|---|---|
| TopNavigation | Website navigation container; slots are brand, items and actions. |
| BottomNavigation | Mobile Guest/Waiter navigation container. It does not define final product destinations at this stage. |
| SidebarNavigation | Desktop Admin navigation; transforms to Drawer at tablet/mobile when navigation must remain available. |
| AppBar / Header | Leading, title, optional subtitle and actions slots. Density composition may vary by context while anatomy remains shared. |
| Tabs | Standard and compact variants; active/inactive, hover, focus and justified disabled. Overflow scrolls or exposes an explicit overflow action. |
| Breadcrumbs | Website deep hierarchy and Admin; avoided on Guest mobile unless needed. |
| Pagination | Previous, next, current, total and compact mode for data contexts. |
| Accordion | Collapsed/expanded, hover, focus and justified disabled; never hides a critical operation. |

## 7. Data Display

| Component | Contract |
|---|---|
| Card | Builds on Surface and adds reusable card semantics: Default, Interactive, Selected and Raised. Interactive cards gain hover/focus; no product-specific anatomy. |
| List / ListItem | Leading, primary, secondary, metadata and trailing slots. Interactive state is optional; list rows do not become cards by default. |
| DataTable | Semantic table where appropriate: header, rows, sortable column, selection, hover, loading, empty, action column and pagination relationship. Horizontal overflow remains available when row comparison matters. |
| Badge | Compact categorical information such as role, count or category. Never an action. |
| StatusBadge | Success, Warning, Error, Info, Neutral and Pending. Always combines label, optional icon, semantic foreground and a subtle surface/border; colour alone never communicates state. |
| Avatar | Image, initials, fallback and optional status indicator. Sizes S/M/L; no role-specific variants. |
| Divider | Horizontal or vertical semantic boundary. |

**Surface → Card → Product Pattern.** Surface is the low-level structural primitive for semantic background, explicitly requested border/elevation, radius and container structure. Card builds on Surface; future Venue Card, Dish Card or Order Card are Product Patterns and are not created here.  
**ListItem anatomy:** Container → leading slot → text block (primary, secondary, metadata) → trailing slot.  
**StatusBadge anatomy:** subtle surface → optional icon → visible label. Status surface values need a foundation extension before implementation.

**Tabs anatomy:** tab list → tab trigger (label, optional icon/count) → indicator → associated tab panel.  
**NavigationItem anatomy:** container → leading icon (optional) → label → badge/count (optional) → trailing affordance (optional).

## 8. Feedback

| Component | Contract |
|---|---|
| Alert | Persistent Info, Success, Warning, Error or Neutral message: icon → title → message → optional action → optional dismiss. Status treatment matches StatusBadge. |
| Toast | Transient Success, Error, Info or Warning: title, supporting text, optional action and close. Uses `z.toast`; never the sole communication of a critical form error. |
| InlineValidation | Field-local help/warning/error/success pattern with programmatic relation to its control. |

**Alert anatomy:** container → icon → content (title + message) → action (optional) → dismiss (optional).  
**Toast anatomy:** container → status icon → content → action (optional) → close.

## 9. Overlays

| Component | Contract |
|---|---|
| Tooltip | Supplemental explanation for icon-only controls or compact operational UI. Opens for focus as well as hover; never holds critical information. |
| Popover | Brief contextual content with trigger, placement, collision handling, focus policy and outside/Escape dismissal. |
| DropdownMenu | Contextual actions with label/icon/divider/destructive/disabled actions and keyboard navigation. It is not Select. |
| Dialog | S/M/L constrained sizes; title, optional description, body, actions and close. Includes accessible title, focus trap/restoration, Escape, overlay and scroll policy. |
| ConfirmationDialog | Dialog composition for standard/destructive confirmation. Explains action, consequence, primary action and cancel; not used for every ordinary action. |
| BottomSheet | First-class mobile overlay: closed/entering/open/dismissing, drag where appropriate, backdrop, dismiss, scroll, safe-area, keyboard and max-height policy. Short contextual mobile Dialog tasks may become BottomSheet. |
| Drawer | Separate from BottomSheet; supports Admin navigation at smaller widths and contextual filters/details. |

**Dialog anatomy:** overlay → dialog surface → title/description → body → actions → close.  
**BottomSheet anatomy:** backdrop → sheet → drag handle (optional) → title/description → scroll body → actions.

## 10. Loading & System States

| Component | Contract |
|---|---|
| Spinner | Brief indeterminate local loading only; not unexplained full-screen waiting. |
| Progress | Determinate processes with value and accessible progress semantics. |
| Skeleton | Geometry variants: text, avatar, media, block and card shell. Resembles future layout and avoids aggressive flashing. |
| EmptyState | Optional icon/illustration slot, title, explanation, optional primary/secondary action. No product-specific copy in the library. |
| ErrorState | Local or page-level failure; supports retry, back and support where appropriate. |
| OfflineBanner / OfflineState | Communicates actual unavailable connectivity for maps, integrations or apps; never simulates offline when local data works. |
| UnavailableState | Standard reasoned unavailability: integration unavailable, rule disabled, demo limitation or temporary outage. `Coming / Future` is separate and only used for an approved planned capability. |

## 11. Structural Primitives

`PageContainer`, `Section`, `Stack`, `Inline`, `Cluster`, `Surface` and `StickyActionArea` use the approved layout, spacing, radius, elevation and z-index tokens. They are small composition aids, not a custom layout framework. StickyActionArea reserves safe-area space and uses the documented layer scale.

## 12. Responsive Behaviour

Dialog may transform to BottomSheet only for short contextual mobile tasks. SidebarNavigation transforms to Drawer at tablet/mobile. Select may use BottomSheet for long touch-oriented choice lists. DataTable retains horizontal scrolling when comparison matters; it may use a compact list only when comparison is not the task. BottomNavigation is mobile-specific; TopNavigation and SidebarNavigation remain contextual patterns, not interchangeable automatic transformations.

## 13. Density

Comfortable Guest, Compact Operational Waiter and Efficient Data Admin are composition densities. They adjust approved spacing and information grouping, not component names, anatomy, essential type minimums or 44px touch targets. There are no `GuestButton`, `WaiterButton` or `AdminButton` components.

## 14. Accessibility

Every interactive component documents native semantic role where possible, keyboard support, visible `color.border.focus` treatment, accessible name, disabled behaviour and error communication. Controls expose a 44×44px recommended mobile target. Dialog and BottomSheet trap and restore focus; Select, DropdownMenu, Tabs, Switch, Checkbox, Radio and Tooltip support keyboard/focus interactions. Status has an icon and label alongside colour. Components must handle short/long Russian text, ₽ amounts, long venue/employee names, errors and dynamic counts without truncating critical meaning.

## 15. Figma Architecture

Use `Actions/Button`, `Actions/Icon Button`, `Forms/Input`, `Forms/Textarea`, `Forms/Select`, `Selection/Checkbox`, `Selection/Radio`, `Selection/Switch`, `Navigation/Tabs`, `Navigation/Bottom Nav`, `Navigation/Sidebar`, `Feedback/Alert`, `Feedback/Toast`, `Overlay/Dialog` and `Overlay/Bottom Sheet`. Use Components, Variants, Component Properties, Boolean properties, Instance swap properties and Auto Layout. Keep `variant`, `size`, `state`, `iconLeading`, `iconTrailing` and `fullWidth` as separate properties; theme/mode arrives through semantic variables, preventing variant explosion.

## 16. Frontend Architecture

**IMPLEMENTATION READY; DEFERRED TO THE NEXT ISOLATED VISUAL BUILD.** No `components/design-system/` implementation is created in this corrective pass. Future MIRA public components may wrap vendor primitives internally and must consume Stage 3 semantic tokens only.

## 17. Existing Component Mapping

| Future Component | Current source | Current quality | Future action |
|---|---|---|---|
| Button / IconButton | `MiraButton`, `MiraIconButton`, `ui/button` | overlapping product and vendor contracts | EVOLVE MIRA wrapper; PRESERVE vendor internally; CONSOLIDATE public APIs later |
| Field / TextInput / Textarea | `MiraInput`, `MiraSelect`, `MiraSearch`, `ui/field`, `ui/input`, `ui/textarea`, `ui/select` | partial anatomy; duplicate sources | EVOLVE MIRA wrapper; PRESERVE vendor internally; CONSOLIDATE public APIs later |
| Switch | `MiraToggle`, `ui/switch` | useful base, domain-labelled wrapper | EVOLVE MIRA wrapper; PRESERVE vendor internally |
| Card / Surface | `MiraCard`, `ui/card` | reusable but competing APIs | EVOLVE MIRA wrapper; PRESERVE vendor internally; CONSOLIDATE public APIs later |
| StatusBadge / EmptyState / Skeleton | `MiraStatusBadge`, `MiraEmptyState`, `MiraSkeleton`, `ui/badge`, `ui/empty`, `ui/skeleton` | domain-aware wrappers mixed with primitives | EVOLVE MIRA wrapper; PRESERVE vendor internally |
| Dialog / BottomSheet | `MiraModal`, `MiraBottomSheet`, `ui/dialog`, `ui/sheet`, `ui/drawer` | usable Radix/Vaul base with duplicate presentation | EVOLVE MIRA wrapper; PRESERVE vendor internally; CONSOLIDATE public APIs later |
| Toast / Alert | `MiraToast`, `ui/alert`, `ui/sonner` | partial and split ownership | EVOLVE MIRA wrapper; PRESERVE vendor internally; CONSOLIDATE public APIs later |
| Navigation | `MiraBottomNavigation`, `MiraTopBar`, `ui/sidebar`, `ui/navigation-menu` | product destinations mixed with generic structures | EVOLVE |
| Tabs / Table / Avatar / Checkbox / Radio / Tooltip / Menu | corresponding `ui/*` files | vendor primitives available | PRESERVE as internal primitives, expose MIRA API later |
| Link / SearchField / Chip / Badge / Popover / Drawer / structural primitives | no unified MIRA API | missing public contract | CREATE |

## 18. Foundation Extensions Approved

Approved extensions are defined in Stage 3 Tokens: mode-aware status `foreground/surface/border` aliases, `color.overlay.backdrop`, and `control.height.s/m/l` with `control.hit-area.min`. No local arbitrary backdrop or control-height value is permitted.

## 19. Governance

1. Screens use a library component where an equivalent exists and do not clone it locally.
2. Components consume semantic tokens; modes are variables, not variants.
3. Venue accent remains controlled and cannot alter safety/status/focus semantics.
4. Product patterns compose components rather than replacing them.
5. Accessibility is part of every component definition.
6. Component changes are reviewed across Guest, Waiter and Admin.
7. A new component needs a distinct reusable UX role; decoration alone is insufficient.
8. Component QA covers both modes; widths 360, 390, 480, 768 and 1024+ where relevant; short/long/empty/numeric content; and keyboard, pointer and touch interactions.
