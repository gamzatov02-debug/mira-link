# MIRA LINK DESIGN SYSTEM — COMPONENT MATRIX

The registry contains **55 universal components**: 3 Actions, 6 Forms, 5 Selection, 9 Navigation, 8 Data Display, 3 Feedback, 7 Overlays, 7 Loading/System and 7 Structural. All support `MIRA / Brand Dark` and `MIRA / Operational Light` through semantic variables. `Venue Accent` is limited to validated Guest-context accent use; it is never a component variant.

| ID | Component | Category | Variants | Sizes | States | Responsive behaviour | Priority |
|---|---|---|---|---|---|---|---|
| CMP-ACT-001 | Button | Actions | primary/secondary/ghost/destructive/link | S/M/L | default, hover, pressed, focus, disabled, loading | full-width permitted mobile | Tier 1 |
| CMP-ACT-002 | IconButton | Actions | primary/secondary/ghost/destructive* | S/M/L | default, hover, pressed, focus, disabled, loading | 44px mobile target | Tier 1 |
| CMP-ACT-003 | Link | Actions | inline/standalone/navigation | default | default, hover, focus, visited*, disabled* | wraps long text | Tier 2 |
| CMP-FRM-001 | Field | Forms | default/required | default | default, error, success, help | label remains above control | Tier 1 |
| CMP-FRM-002 | TextInput | Forms | text/password/searchable composition | default/compact* | default, hover, focus, filled, disabled, error, success, read-only | full width mobile | Tier 1 |
| CMP-FRM-003 | Textarea | Forms | vertical-resize/controlled-growth | default | default, hover, focus, filled, disabled, error, success, read-only | controlled mobile growth | Tier 1 |
| CMP-FRM-004 | SearchField | Forms | default/loading | default | default, focus, filled, disabled, loading, empty | full width mobile | Tier 2 |
| CMP-FRM-005 | Select | Forms | dropdown/bottom-sheet presentation | default/compact* | default, hover, focus, open, selected, disabled, error | sheet for long mobile choice | Tier 2 |
| CMP-FRM-006 | SearchFilterBar | Forms | with-filters/with-count | default | default, loading, empty | filters wrap/stack mobile | Tier 2 |
| CMP-SEL-001 | Checkbox | Selection | checkbox | default | unchecked, checked, indeterminate, hover, focus, disabled, error | label remains target | Tier 1 |
| CMP-SEL-002 | Radio | Selection | radio | default | unselected, selected, hover, focus, disabled, error | grouped vertical mobile | Tier 1 |
| CMP-SEL-003 | Switch | Selection | switch | default | off, on, hover, focus, disabled | retains touch target | Tier 1 |
| CMP-SEL-004 | SegmentedControl | Selection | 2–5 options | default/compact | default, selected, hover, focus, disabled | horizontal scroll only if necessary | Tier 2 |
| CMP-SEL-005 | Chip | Selection | filter/choice/removable | default/compact | default, selected, hover, focus, disabled | wraps/scrolls by context | Tier 1 |
| CMP-NAV-001 | NavigationItem | Navigation | standard/with-count | default/compact | default, active, hover, focus, disabled* | shared anatomy | Tier 2 |
| CMP-NAV-002 | TopNavigation | Navigation | standard/compact | default | default, active, focus | transforms by page context | Tier 2 |
| CMP-NAV-003 | BottomNavigation | Navigation | standard | default | default, active, focus | mobile only | Tier 2 |
| CMP-NAV-004 | SidebarNavigation | Navigation | expanded/collapsed | default | default, active, hover, focus | Drawer tablet/mobile | Tier 2 |
| CMP-NAV-005 | AppBarHeader | Navigation | standard/compact | default | default, focus | responsive slot overflow | Tier 2 |
| CMP-NAV-006 | Tabs | Navigation | standard/compact | default | active, inactive, hover, focus, disabled* | horizontal overflow strategy | Tier 2 |
| CMP-NAV-007 | Breadcrumbs | Navigation | standard | default/compact | default, hover, focus | omitted where unnecessary | Tier 2 |
| CMP-NAV-008 | Pagination | Navigation | standard/compact | default | default, hover, focus, disabled | compact controls mobile | Tier 2 |
| CMP-NAV-009 | Accordion | Navigation | standard | default | collapsed, expanded, hover, focus, disabled* | retains accessible disclosure | Tier 2 |
| CMP-DSP-001 | Card | Data Display | default/interactive/selected/raised | default | default, hover*, focus*, selected, disabled* | builds on Surface; padding follows density | Tier 1 |
| CMP-DSP-002 | List | Data Display | standard/divided | default | default, loading, empty | no forced card conversion | Tier 2 |
| CMP-DSP-003 | ListItem | Data Display | static/interactive | default/compact | default, hover*, focus*, selected*, disabled* | long text wraps before metadata | Tier 2 |
| CMP-DSP-004 | DataTable | Data Display | standard/compact | default | default, hover, selected, loading, empty | horizontal overflow when comparison matters | Tier 2 |
| CMP-DSP-005 | Badge | Data Display | category/role/count | default/compact | default | wraps long labels | Tier 1 |
| CMP-DSP-006 | StatusBadge | Data Display | success/warning/error/info/neutral/pending | default/compact | default | shared status presentation; label never replaced by colour | Tier 1 |
| CMP-DSP-007 | Avatar | Data Display | image/initials/fallback/status | S/M/L | default, fallback | fixed visual size | Tier 2 |
| CMP-DSP-008 | Divider | Data Display | horizontal/vertical | default | default | vertical only where layout permits | Tier 2 |
| CMP-FBK-001 | Alert | Feedback | info/success/warning/error/neutral | default | default, dismissible | action wraps below content mobile | Tier 1 |
| CMP-FBK-002 | Toast | Feedback | success/error/info/warning | default | entering, visible, dismissing | stack within `z.toast` | Tier 1 |
| CMP-FBK-003 | InlineValidation | Feedback | help/warning/error/success | default | default | follows Field layout | Tier 2 |
| CMP-OVR-001 | Tooltip | Overlays | standard | default | closed/open | suppressed on touch unless triggered accessibly | Tier 2 |
| CMP-OVR-002 | Popover | Overlays | standard | default | closed/open | collision-aware placement | Tier 2 |
| CMP-OVR-003 | DropdownMenu | Overlays | standard/destructive-item | default | closed/open, focus, disabled item | collision-aware placement | Tier 2 |
| CMP-OVR-004 | Dialog | Overlays | S/M/L | S/M/L | closed, entering, open, dismissing | short contextual task → sheet mobile | Tier 1 |
| CMP-OVR-005 | ConfirmationDialog | Overlays | standard/destructive | S/M | closed, open, loading | may use sheet mobile | Tier 2 |
| CMP-OVR-006 | BottomSheet | Overlays | standard/with-actions | default | closed, entering, open, dismissing | mobile first; Dialog desktop rule | Tier 1 |
| CMP-OVR-007 | Drawer | Overlays | navigation/contextual | default | closed, entering, open, dismissing | sidebar transformation | Tier 2 |
| CMP-SYS-001 | Spinner | Loading/System | default | S/M/L | default | local to loading region | Tier 2 |
| CMP-SYS-002 | Progress | Loading/System | determinate | default | default, complete | width follows container | Tier 2 |
| CMP-SYS-003 | Skeleton | Loading/System | text/avatar/media/block/card-shell | geometry | loading | matches target layout | Tier 1 |
| CMP-SYS-004 | EmptyState | Loading/System | with-icon/with-actions | default | empty | actions stack mobile | Tier 1 |
| CMP-SYS-005 | ErrorState | Loading/System | local/page | default | error | page composition contextual | Tier 2 |
| CMP-SYS-006 | OfflineBannerState | Loading/System | banner/state | default | offline/reconnected | banner prioritises active task | Tier 2 |
| CMP-SYS-007 | UnavailableState | Loading/System | unavailable/coming-future | default | unavailable | contextual action wraps | Tier 2 |
| CMP-LYT-001 | PageContainer | Structural | standard/wide/reading | token-driven | default | cap changes by breakpoint | Tier 2 |
| CMP-LYT-002 | Section | Structural | default | token-driven | default | section rhythm by breakpoint | Tier 2 |
| CMP-LYT-003 | Stack | Structural | default | token-gap | default | axis remains vertical | Tier 2 |
| CMP-LYT-004 | Inline | Structural | wrap/no-wrap | token-gap | default | wraps at narrow widths | Tier 2 |
| CMP-LYT-005 | Cluster | Structural | default | token-gap | default | wraps controls/chips | Tier 2 |
| CMP-LYT-006 | Surface | Structural | default/raised | token-driven | default | semantic surface only | Tier 2 |
| CMP-LYT-007 | StickyActionArea | Structural | default | default | default | safe-area and documented layer | Tier 2 |

`*` means the state/variant is supplied only when semantically justified, not by default.

## Component state matrix

| Component group | Default | Hover | Pressed | Focus | Disabled | Loading | Selected | Error | Success |
|---|---|---|---|---|---|---|---|---|---|
| Button | YES | YES | YES | YES | YES | YES | N/A | N/A | N/A |
| IconButton | YES | YES | YES | YES | YES | YES | N/A | N/A | N/A |
| Link | YES | YES | N/A | YES | YES* | N/A | N/A | N/A | N/A |
| Field | YES | N/A | N/A | N/A | N/A | N/A | N/A | YES | YES |
| TextInput / Textarea / Select | YES | YES | N/A | YES | YES | N/A | YES* | YES | YES |
| SearchField | YES | YES | N/A | YES | YES | YES | N/A | N/A | N/A |
| Checkbox / Radio / Switch | YES | YES | N/A | YES | YES | N/A | YES | YES* | N/A |
| SegmentedControl / Chip | YES | YES | N/A | YES | YES | N/A | YES | N/A | N/A |
| Navigation / Tabs / Pagination / Accordion | YES | YES | N/A | YES | YES* | N/A | YES* | N/A | N/A |
| Card / ListItem / DataTable | YES | YES* | N/A | YES* | YES* | YES* | YES* | N/A | N/A |
| Badge / Avatar / Divider | YES | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A |
| StatusBadge | YES | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A |
| Alert | YES | N/A | N/A | YES* | N/A | N/A | N/A | N/A | N/A |
| Toast | N/A | N/A | N/A | YES* | N/A | N/A | N/A | N/A | N/A |
| InlineValidation | YES | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A |
| Tooltip / Popover / Dropdown | YES | YES* | N/A | YES | YES* | N/A | N/A | N/A | N/A |
| Dialog / BottomSheet / Drawer | YES | N/A | N/A | YES | N/A | YES* | N/A | N/A | N/A |
| Spinner / Progress / Skeleton | YES | N/A | N/A | N/A | N/A | YES | N/A | N/A | N/A |
| Empty / Error / Offline / Unavailable | YES | N/A | N/A | YES* | N/A | YES* | N/A | YES* | N/A |
| Structural primitives | YES | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A |
