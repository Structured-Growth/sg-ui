# Owned page tabs and headers

Task references: M-04, M-05. `AppPageHeader` and `AppPageTabs` retain their names
and compose the owned interaction/presentation controls. Load
`@structured-growth/sg-ui/styles.css` and wrap them with `Provider` or `ThemeScope`.
Their granular component subpaths avoid the legacy catalog.

## AppPageTabs

`value`, `items`, `onChange`, `density`, item `id`, `label`, `href`, `icon` and
`replace` remain available. Arrays accept readonly data. `href` is now optional
for local tabs. Items add `disabled` and `content`; pass panel content for local
sections. The `onChange` branch renders real tabs with connected panels and keeps
selection under host control. Arrow navigation skips disabled tabs. `activation`
defaults to automatic; manual activation moves focus with arrows and requests
selection only on activation. `label` names each tab list or navigation region;
its translated fallback is “Page sections”.

Without `onChange`, items are route links in a navigation region. The selected
route has `aria-current="page"`; disabled/missing-href items are text and cannot
navigate. Internal links preserve the host custom Link/navigation adapter and
replacement behavior; modified clicks retain native anchor behavior. Route links
use normal link keyboard navigation rather than claiming tab/panel semantics.

`density="default"` remains an alias for the surrounding scope density. Compact
and comfortable explicitly override it. This replaces MUI-specific heights with
the owned density tokens. Horizontal overflow scrolls the section strip. Keyboard focus reveals a clipped
route link or controlled tab by adjusting only that strip’s horizontal scroll
position, preserving the surrounding page and panel scroll positions.

The former MUI DOM/classes and incidental styling are removed. Use the native
div ref, `className`, `style`, `data-sgui-part="page-tabs"` and token overrides.
Controlled consumers should supply the formerly external section content through
`items[].content` to provide meaningful accessible panels.

## AppPageHeader

Existing title, description, breadcrumbs, metadata, menu items and action slots
remain available. Menu callbacks remain owned zero-argument `onClick` callbacks.
Supplied `actionButtons` retain precedence over the more menu. Menus skip disabled
items, dismiss after activation or Escape, restore trigger focus, and inherit
visual scope in their portals. Link menuitems are native anchors; unmodified
internal activation routes through the host `navigate` adapter. Modified and
external activations retain native behavior. The header owns no persistence.

Breadcrumb paths longer than three items retain the first ancestor, the
penultimate ancestor and the current page. The hidden ancestors appear in the
translated “Show path” menu. The current breadcrumb is plain text with
`aria-current="page"`, including when it supplied an href. The breadcrumb region
and “More actions” trigger use translated library defaults.

`hierarchy="subpage"` preserves the existing header's secondary surface.
`hierarchy="primary"` uses the main surface (white in light mode). Both use shared
tokens and adapt to dark mode. `headingLevel` selects native h1–h6 independently of
the h1 visual role. Long headings wrap, and metadata/actions wrap below the title
when available width cannot hold the row. Icons in metadata remain decorative.

The former MUI DOM/classes and fixed pixel title/grid dimensions are removed.
Use the native header ref, `className`, `style`, `data-sgui-part="page-header"`,
`page-header-metadata`, `page-header-actions`, and shared CSS variables. Visual
sizes now follow the shared typography tokens. This foundation/style change is
part of the breaking migration release.

Colocated tests cover connected panels, disabled/manual/controlled tab behavior,
host route links, breadcrumb collapse, native header semantics, menu activation,
dismissal, portal scope and focus restoration. Native browser layout/scroll/focus
checks and package checks are recorded in the migration execution record.
