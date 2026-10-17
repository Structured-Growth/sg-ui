# Icon panel navigation

`IconPanelNavigation` is a separate owned composition for a persistent icon-only
rail and non-modal sliding tool panels. It composes IconButton, Tooltip and
Typography rather than coupling to SideNavigation's account header or menu tree.
Import it from the public root or `/components`; load `/styles.css` and provide
Provider or ThemeScope. The docs route is `/docs/components/icon-panel-navigation`.

Supply items with unique stable `id`, host-translated `label`, decorative `icon`,
and arbitrary `content`. Each label also names its panel and heading. `disabled`
prevents an item from opening. The host owns route changes, loading, permissions,
persistence and all state inside its content; this component fetches no data.
Panels remain mounted while hidden, retaining local drafts and effects. Hosts
should account for that lifetime when implementing expensive content.

Use `activeId` with `onActiveIdChange` for controlled state (`null` means closed),
or `defaultActiveId` for uncontrolled initialization. An active icon toggles its
panel closed; a different icon switches panels. Invalid or disabled active ids
show no panel. Controlled requests do not change the displayed selection until
the host updates `activeId`.

`side="start"` places the rail at the leading edge and opens the panel inward;
`side="end"` reverses the arrangement for a trailing tools rail. `panelWidth`
defaults to `20rem`, supports native width values and is capped by the host width.
Bound the height with a host container or AppShell slot; the rail and panel body
scroll independently with the shared scoped scrollbar treatment. The icon rail
uses the navigation sizing tokens: 32px compact or 36px comfortable items,
16px pointer icons and 4px outer padding. The resulting rail is 40px compact
or 44px comfortable. Touch policy raises targets to 44px and icons to 20px,
producing a 52px rail. Panel headers use 12px labels and stay above the scrolling
body. Host themes can override the component sizing aliases.

Supply it to AppShell's `navigation` slot for primary icon navigation, or to
`rightNavigation` beside an independent SideNavigation. It also works standalone.
The host can use menu components inside item content without giving the icon rail
any knowledge of their menu model. This preserves separate navigation concerns.

The rail is a named navigation landmark. Buttons use accessible labels,
`aria-expanded` and stable `aria-controls` references; tooltips supplement the
icons. Standard Tab traversal and Enter/Space activation apply. Opening does not
steal focus or trap it. Close and unhandled Escape inside the panel return focus
to the triggering icon. Nested widgets may consume Escape first. Outside clicks
leave the tool open. Multiple rails need distinct `aria-label` values. The panel
uses an h2 heading; consumers should place the composition under the workspace h1.
Reduced motion removes entrance animation and forced colors retain an active
outline. Shell content remains usable while panels are open.

Native ref/className/style apply to the outer div. Stable part hooks are
`icon-panel-navigation`, `icon-navigation-panel`, and `icon-navigation-content`.
Colors use generated `iconPanelNavigation*` component aliases. Width, spacing and
layout do not imply a separate visual identity or application theme.

## Optional resizing

`resizable` defaults to false. Set it to true to show a focusable vertical
separator at the panel's inward edge. Pointer/touch dragging changes width;
Left/Right arrows move that edge physically by 10px (Shift: 50px), including RTL.
Home requests `minPanelWidth` (240px default), End requests `maxPanelWidth`
(960px default). The viewport and host CSS can constrain the rendered width
further. Touch policy enlarges the handle's hit area; forced colors retain its
visible bar and focus indicator. Escape during a drag and pointer cancellation
restore the initial width; other Escape handling still closes the panel.

Each item retains its user width while this navigation instance is mounted,
including across close/reopen and panel switching. `panelWidth` remains the
base for panels not yet resized. Later base-width changes do not replace a
retained user width. Changing minimum/maximum clamps retained widths; disabling
resizing removes the separator and uses `panelWidth` again.
`onPanelWidthChange(width, id)` reports requested pixel widths after resize
input, including cancellation; it is a notification rather than controlled
width ownership. Consumers may persist those notifications themselves.

The stable handle hook is `icon-navigation-resize-handle`. It announces its
panel name, orientation, current pixel width and bounds with `aria-controls`
pointing at the panel. DocsShell opts in only for Page documentation, leaving
Demo settings fixed. Desktop docs preserve space for the main pane while the
shelf grows; narrow layouts continue to overlay and fit the viewport.
