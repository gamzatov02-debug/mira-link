# MIRA LINK DESIGN SYSTEM — TOKENS

## Scope, source of truth and counts

This is the canonical future token catalogue for one MIRA LINK Design System; it does not apply variables to the current product. Source of truth: **Brand Identity → UI Primitive Tokens → Semantic Tokens → Semantic Modes → Components → Patterns → Screens**. The controlled Venue Theme layer acts only at permitted Guest-context accent mappings after validation; it is not a third mode or design system.

| Catalogue group | Count |
|---|---:|
| Brand identity colour tokens | 2 |
| UI primitive colour tokens | 24 |
| Semantic colour token names | 48 |
| Semantic colour assignments | 96 (all mode-dependent) |
| Status presentation token names | 18 (6 statuses × foreground/surface/border) |
| Status presentation assignments | 36 (18 × 2 modes) |
| Total named colour tokens | 74 |
| Total concrete colour assignments | 122 |
| Typography / spacing / breakpoint / radius tokens | 19 / 14 / 6 / 6 |
| Elevation / motion duration / control dimension tokens | 5 / 5 / 4 |

## Brand Identity Tokens

These official MIRA values must not change without a separate Customer decision.

| Token | HEX | RGB | Role |
|---|---|---|---|
| `color.brand.green` | `#0A1D08` | `10, 29, 8` | official MIRA green |
| `color.brand.gold` | `#C89B3C` | `200, 155, 60` | official MIRA gold |

## UI Primitive Tokens

Supporting UI palette values provide surface separation, accessible text/action states and state feedback. They do not replace Brand Identity Tokens.

| Token | HEX / RGBA | RGB | Role |
|---|---|---|---|
| `color.green.950` | `#031B13` | `3, 27, 19` | deepest dark surface |
| `color.green.900` | `#041E15` | `4, 30, 21` | dark surface |
| `color.green.800` | `#0D3022` | `13, 48, 34` | deep raised surface |
| `color.green.700` | `#123927` | `18, 57, 39` | raised surface |
| `color.green.600` | `#173D2B` | `23, 61, 43` | interactive green |
| `color.gold.700` | `#87611B` | `135, 97, 27` | dark gold text/accent |
| `color.gold.600` | `#B88438` | `184, 132, 56` | pressed gold |
| `color.gold.500` | `#D9AC5D` | `217, 172, 93` | gold hover |
| `color.gold.400` | `#E7C27B` | `231, 194, 123` | warm gold support |
| `color.neutral.0` | `#FFFFFF` | `255, 255, 255` | absolute light |
| `color.neutral.50` | `#F7F6F2` | `247, 246, 242` | warm light surface |
| `color.neutral.100` | `#F0EFE9` | `240, 239, 233` | warm text/light surface |
| `color.neutral.200` | `#D8D9D2` | `216, 217, 210` | quiet light surface |
| `color.neutral.400` | `#95A99E` | `149, 169, 158` | disabled neutral |
| `color.neutral.600` | `#687A70` | `104, 122, 112` | dark neutral |
| `color.neutral.700` | `#52655B` | `82, 101, 91` | muted light-context ink |
| `color.neutral.900` | `#26372F` | `38, 55, 47` | dark neutral surface/ink |
| `color.neutral.950` | `#111B16` | `17, 27, 22` | inverse ink |
| `color.status.success.base` | `#2F7D4B` | `47, 125, 75` | success identity |
| `color.status.warning.base` | `#A86508` | `168, 101, 8` | warning identity |
| `color.status.error.base` | `#B42318` | `180, 35, 24` | error identity |
| `color.status.info.base` | `#1769AA` | `23, 105, 170` | info identity |
| `color.status.neutral.base` | `#687A70` | `104, 122, 112` | neutral identity |
| `color.status.pending.base` | `#A86508` | `168, 101, 8` | pending identity |

## Semantic Tokens and Modes

Semantic names stay stable across modes. All mapped text/background, action and boundary pairs require accessibility validation before implementation. Status semantics are global: their values and meanings do not change by mode or venue.

**Mode A — MIRA / Brand Dark:** Guest default, brand-oriented Website sections and appropriate restaurant contexts.

**Mode B — MIRA / Operational Light:** Admin default, high-density operational workspaces and Waiter screens where it improves readability and task speed. Website may use controlled light sections. This is product-surface selection, not a global user preference.

| Semantic token | Brand / Dark | Operational / Light | Role |
|---|---|---|---|
| `color.bg.primary` | `#041E15` | `#F7F6F2` | page plane |
| `color.bg.secondary` | `#031B13` | `#F0EFE9` | recessed plane |
| `color.bg.elevated` | `#0D3022` | `#FFFFFF` | elevated plane |
| `color.bg.subtle` | `#123927` | `#D8D9D2` | subtle plane |
| `color.bg.inverse` | `#F7F6F2` | `#041E15` | inverse plane |
| `color.surface.default` | `#0D3022` | `#FFFFFF` | default surface |
| `color.surface.raised` | `#123927` | `#F7F6F2` | raised surface |
| `color.surface.interactive` | `#173D2B` | `#F0EFE9` | interactive surface |
| `color.surface.selected` | `#203F2D` | `#E6E8DE` | selected surface |
| `color.surface.disabled` | `#26372F` | `#D8D9D2` | disabled surface |
| `color.text.primary` | `#F0EFE9` | `#111B16` | primary text |
| `color.text.secondary` | `#D8D9D2` | `#26372F` | secondary text |
| `color.text.muted` | `#B8C1BA` | `#52655B` | supporting normal-size text |
| `color.text.disabled` | `#95A99E` | `#687A70` | disabled text; requires non-colour cue |
| `color.text.inverse` | `#111B16` | `#F0EFE9` | inverse text |
| `color.text.accent` | `#E7C27B` | `#87611B` | restrained accent text |
| `color.border.subtle` | `rgba(240,239,233,0.12)` | `rgba(17,27,22,0.12)` | quiet division |
| `color.border.default` | `rgba(240,239,233,0.20)` | `rgba(17,27,22,0.20)` | standard boundary |
| `color.border.strong` | `rgba(200,155,60,0.64)` | `rgba(10,29,8,0.48)` | selected/persistent boundary |
| `color.border.focus` | `#C89B3C` | `#0A1D08` | 2px keyboard focus ring plus offset |
| `color.action.primary` | `#C89B3C` | `#0A1D08` | primary action fill |
| `color.action.primary.hover` | `#D9AC5D` | `#041E15` | primary hover |
| `color.action.primary.active` | `#B88438` | `#031B13` | primary pressed |
| `color.action.secondary` | `#173D2B` | `#F0EFE9` | secondary action fill |
| `color.action.secondary.hover` | `#203F2D` | `#D8D9D2` | secondary hover |
| `color.action.ghost` | `transparent` | `transparent` | tertiary base |
| `color.action.ghost.hover` | `rgba(240,239,233,0.10)` | `rgba(17,27,22,0.08)` | tertiary hover |
| `color.action.destructive` | `#B42318` | `#B42318` | destructive action |
| `color.action.destructive.hover` | `#8E1C13` | `#8E1C13` | destructive hover |
| `color.overlay.backdrop` | `rgba(3,27,19,0.72)` | `rgba(17,27,22,0.44)` | overlay backdrop at `z.overlay` |

## Status Presentation Tokens

Status base tokens preserve global identity. Status presentation resolves by mode and is shared by StatusBadge, Alert, Toast and InlineValidation. A status always has explicit text and optional icon; it is never communicated through colour alone.

| Status | Mode | Foreground | Surface | Border | Text Contrast | Result |
|---|---|---|---|---|---:|---|
| Success | Brand Dark | `#A8E6B8` | `#123927` | `#2F7D4B` | 8.95:1 | PASS |
| Warning | Brand Dark | `#FFD38A` | `#3D2C0C` | `#A86508` | 9.55:1 | PASS |
| Error | Brand Dark | `#FFB4AB` | `#3A1613` | `#B42318` | 9.48:1 | PASS |
| Info | Brand Dark | `#A9D4FF` | `#102E47` | `#1769AA` | 9.01:1 | PASS |
| Neutral | Brand Dark | `#D8E0DA` | `#26372F` | `#687A70` | 9.34:1 | PASS |
| Pending | Brand Dark | `#FFD38A` | `#3D2C0C` | `#A86508` | 9.55:1 | PASS |
| Success | Operational Light | `#1E5A35` | `#E4F3E7` | `#2F7D4B` | 7.11:1 | PASS |
| Warning | Operational Light | `#6E4100` | `#FFF1D6` | `#A86508` | 7.77:1 | PASS |
| Error | Operational Light | `#7A1C14` | `#FDE8E7` | `#B42318` | 8.92:1 | PASS |
| Info | Operational Light | `#0B4F82` | `#E4F1FB` | `#1769AA` | 7.44:1 | PASS |
| Neutral | Operational Light | `#37483F` | `#EDF0ED` | `#687A70` | 8.46:1 | PASS |
| Pending | Operational Light | `#6E4100` | `#FFF1D6` | `#A86508` | 7.77:1 | PASS |

The aliases are `color.status.{status}.foreground`, `color.status.{status}.surface` and `color.status.{status}.border`. Every listed foreground exceeds 4.5:1 against its surface; meaningful icons use that foreground and exceed 3:1. Borders remain distinct from the listed surfaces in both modes.

`venue.accent`, `venue.accent.hover`, `venue.accent.contrast`, `venue.brand.logo` and `venue.brand.hero` are controlled inputs, excluded from global counts. They can override only validated Guest-context accent mapping and never destructive, success, warning, error, info or focus semantics.

## Typography tokens

All typography uses **Manrope** at weights 400, 500 and 600. Essential UI text and interactive labels are 14px minimum. `type.caption` and `type.overline` are non-critical metadata/decorative-category text only; `type.metadata.s` is never a form/control label.

| Token | Size / line height | Weight | Usage | Mobile |
|---|---:|---:|---|---|
| `type.display.l` | 64 / 72px | 600 | Website hero | 40 / 48px |
| `type.display.m` | 48 / 56px | 600 | Website feature | 36 / 44px |
| `type.display.s` | 40 / 48px | 600 | page lead | 32 / 40px |
| `type.heading.1` | 36 / 44px | 600 | primary page title | 30 / 38px |
| `type.heading.2` | 30 / 38px | 600 | section title | 26 / 34px |
| `type.heading.3` | 24 / 32px | 600 | screen/card group title | 22 / 30px |
| `type.heading.4` | 20 / 28px | 600 | card/detail title | same |
| `type.heading.5` | 18 / 24px | 600 | compact group title | same |
| `type.heading.6` | 16 / 22px | 600 | dense group title | same |
| `type.body.l` | 18 / 28px | 400 | lead copy | same |
| `type.body.m` | 16 / 24px | 400 | default body | same |
| `type.body.s` | 14 / 20px | 400 | compact body | same |
| `type.label.l` | 16 / 22px | 500 | form/field label | same |
| `type.label.m` | 14 / 20px | 500 | UI/interactive label | same |
| `type.metadata.s` | 12 / 16px | 500 | compact non-critical metadata | same |
| `type.button` | 14 / 20px | 600 | button/action text | same |
| `type.caption` | 12 / 16px | 400 | non-critical helper/meta text | same |
| `type.overline` | 11 / 16px | 600 | decorative/category text | same |
| `type.metric` | 32 / 40px | 600 | money, KPI, count | 28 / 36px |

## Spacing tokens

| Token | Value | Role |
|---|---:|---|
| `space.0` | 0px | reset |
| `space.1` | 4px | micro-gap |
| `space.2` | 8px | inline controls |
| `space.3` | 12px | compact gap |
| `space.4` | 16px | default gap |
| `space.5` | 20px | group gap |
| `space.6` | 24px | card/form padding |
| `space.8` | 32px | subsection |
| `space.10` | 40px | major subsection |
| `space.12` | 48px | page group |
| `space.16` | 64px | mobile section |
| `space.20` | 80px | large separation |
| `space.24` | 96px | desktop section |
| `space.32` | 128px | hero/layout separation |

## Layout, shape and elevation tokens

| Token | Value | Role |
|---|---:|---|
| `layout.content.standard` | 1280px | Website standard cap |
| `layout.content.wide` | 1440px | Website media cap |
| `layout.content.reading` | 760px | reading cap |
| `layout.sidebar.admin` | 264px | Admin rail |
| `layout.app.guest.max` | 480px | Guest cap |
| `breakpoint.sm/md/lg/xl/2xl/3xl` | 360/480/768/1024/1280/1440px | responsive scale |
| `radius.none/xs/control/card/panel/pill` | 0/8/12/16/24/999px | shape scale |
| `border.none/hairline/default/focus` | 0/1/1/2px | boundary scale |
| `control.height.s` | 32px | compact desktop/operational visual control |
| `control.height.m` | 40px | default visual control |
| `control.height.l` | 48px | prominent or touch-heavy control |
| `control.hit-area.min` | 44px | minimum mobile interactive hit area |
| `elevation.none` | none | flat plane |
| `elevation.subtle` | `0 1px 2px rgba(0,0,0,.12)` | restrained lift |
| `elevation.card` | `0 8px 24px rgba(0,0,0,.18)` | floating card |
| `elevation.overlay` | `0 16px 40px rgba(0,0,0,.24)` | dropdown/popover |
| `elevation.modal` | `0 24px 64px rgba(0,0,0,.32)` | modal/sheet |

## Icon, motion and layering tokens

| Token | Value | Role |
|---|---:|---|
| `icon.xs/s/m/l/xl` | 14/16/20/24/32px | icon scale |
| `motion.instant/fast/normal/slow/overlay` | 0/120/180/240/320ms | duration scale |
| `easing.standard` | `cubic-bezier(.2,0,0,1)` | default transition |
| `easing.enter` | `cubic-bezier(0,0,.2,1)` | entering layer |
| `easing.exit` | `cubic-bezier(.4,0,1,1)` | leaving layer |
| `z.base/sticky/header/floating/map/dropdown/overlay/sheet-modal/toast` | 0/10/20/30/40/50/60/70/80 | layer scale |

Lucide uses 1.75px standard stroke; 2px is reserved for compact operational status clarity. Motion defaults to `easing.standard` and respects `prefers-reduced-motion`.

## Figma and frontend mapping

Figma Color Variables use two modes in one collection: `MIRA / Brand Dark` and `MIRA / Operational Light`. Brand identity and UI primitives are shared sources. Status presentation and overlay backdrop use the same two modes. The Venue Theme layer is a validated Guest-context override, not another collection. Typography, spacing, radius, motion, control dimensions and layout are shared and not duplicated between modes.

Future frontend aliases mirror semantic names and mode selection, for example `--color-bg-primary`, `--color-text-primary`, `--elevation-overlay`, `--motion-duration-fast` and `--breakpoint-lg`. CSS may use `box-shadow` to implement `--elevation-overlay`; `--shadow-overlay` is not a parallel token category. No Figma library or frontend token file is created by this document.
