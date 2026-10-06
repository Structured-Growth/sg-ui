# Navigation, tokens, tables and toggle controls

Task references: U-03, U-11–U-16, partial U-07, M-24, M-35.
These owned controls are available through `/experimental`; their upstream state,
event and collection types are internal. Import `/styles.css` once and use
`Provider` or `ThemeScope`. All styles use production tokens and compiled CSS
Modules in `sgui.components`.

## Lists, navigation and disclosure

`List`, `ListItem`, `ListItemText` and `ListItemIcon` provide native list structure,
primary/secondary text and decorative icons. `ListItemButton` is a separate action;
its optional `selected` prop expresses pressed state. Keep sibling actions outside
its button rather than nesting interactive elements inside it.

`Navigation` requires a host-translated landmark `label`. Compose list items with
`NavigationItem`, which uses the existing router adapter and native anchor refs.
The host supplies `current`; it becomes `aria-current="page"`. Navigation uses
link/list semantics rather than menu commands. Modified clicks and external links
keep the existing owned Link behavior.

`Disclosure` has a required `label`, controlled `expanded` or `defaultExpanded`,
and `onExpandedChange(boolean)`. Enter/Space activate its trigger. The trigger
references a named panel with stable IDs. Collapsing focused panel content restores
trigger focus; ordinary focus movement to another host control is preserved.
`disabled` blocks expansion requests. Collapsed content is retained and hidden by
default; `unmountOnCollapse` discards it. `Collapse` supplies the same native hidden
or unmount behavior for compositions that own their trigger. There is no animated
height transition or render-time layout measurement.

## Chips, badges and removable tags

`Chip` is a presentation label with neutral/primary tone, filled/outlined variant
and density. `Badge` adds accessible text content beside an optional anchor. Neither
adds a live region or an implicit action. Name icon-only anchors independently.

`TagGroup` takes host-owned `items` with string IDs and labels. Supplying
`onRemove(ids)` enables removal; the host updates the items. The library supplies a
translated `Remove {label}` action name unless the host gives `removeLabel`.
Keyboard arrows move among enabled tags, and Delete/Backspace removes the focused
tag. Focus moves to the next enabled tag, the previous tag, or the list when no
enabled tag remains. Pointer removal follows the same policy. Disabled groups/tags
cannot be removed. Empty content has an English fallback and can be overridden.

## Tables and pagination

`Table`, `TableCaption`, `TableHead`, `TableBody`, `TableFoot`, `TableRow`,
`TableCell` and `TableHeaderCell` retain native table elements and refs. Use a
caption or accessible name. Header cells default to `scope="col"`; row headers,
spans and explicit `headers` associations are supported. Alignment is logical
start/center/end, and body cells align vertically in the middle. Static tables do
not add grid keyboard interactions or a second data-state engine.

`Pagination` is host-controlled with a zero-based `page` and `onPageChange`.
Displayed pages are one-based. A known `pageCount` enables first/last boundaries;
zero means no pages. Omit the count for server totals that are unknown and supply
`hasNextPage`; no last page is invented. The host must keep page/count values
valid and reconcile them after dataset changes. `disabled` blocks all actions.

Supply `pageSize` and `onPageSizeChange` for a native size selector. It requests
page zero before the new size callback. Positive integer options are deduplicated
and include the current size. Library navigation labels use translation keys with
English defaults; `label` names independent pagination landmarks. Buttons use
`type="button"` so pagination does not submit surrounding forms.

## Toggle actions and tooltip descriptions

`ToggleButton` exposes `selected`, `defaultSelected`, `onSelectedChange(boolean)`
and a native button ref. It is an editor/action control, not a serialized form
field, and never submits its containing form. Standalone toggles expose
`aria-pressed` and activate once by pointer, Enter or Space.

`ToggleButtonGroup` takes string-ID `options`, controlled `selectedIds` or
`defaultSelectedIds`, and `onSelectionChange(string[])`. Single selection uses
radio-group semantics and multiple selection uses pressed buttons. Arrow navigation
skips disabled choices, respects horizontal RTL direction and supports vertical
orientation. `allowEmpty` defaults to true; false prevents toggling off the last
selected choice. Host selection remains authoritative. Icon slots are decorative.

`Tooltip` takes an owned button/icon-button trigger and plain supplementary
`content`. Keyboard focus opens immediately; pointer hover uses `delay` (700ms by
default), with `closeDelay` (100ms). Escape dismisses while keeping trigger focus.
Controlled `open`, `defaultOpen`, `onOpenChange`, disabled state, logical placement,
native overlay ref and narrow-viewport collision handling are supported. Portals
inherit the scope's theme, density, locale and explicit token overrides. Interactive
help belongs in Popover. Tooltips do not provide the trigger's required action name.
Nested command submenus remain an open part of U-07.

## Existing title editor and typography catalog

`EditableTitleField` retains its public props, title pointer editing, Enter/blur
commit, Escape cancel and read-only mode. It now uses owned controls and icons,
translated accessible edit/input names and associated validation errors. Enter
commits restore edit-button focus; blur commits preserve the next control's focus.
Pending saves block duplicate commits and input changes. Rejected host saves retain
the draft for retry. Escape during pending work exits the UI; it cannot cancel
persistence already started by the host. IME composition does not commit on Enter.

Import it through `/components/EditableTitleField` for a granular foundation-only
path. Its parent editor compositions still require migration. Its styles now require
the foundation stylesheet and scope, a migration integration change despite preserved
prop names. `Typefaces` retains its catalog story, adds missing shared roles and a
dark example, and separates semantic sample headings from visual typography roles.

Browser checks cover representative native focus, removal, image events and sizing,
page-size reset, tooltip behavior and title editing. Full touch, zoom, screen-reader
and cross-browser verification remains under X; these primitive task completions do
not mark the entire accessibility or catalog migration complete.
