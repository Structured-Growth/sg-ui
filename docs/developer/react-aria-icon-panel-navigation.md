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
