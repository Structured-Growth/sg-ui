# Owned layout and action primitives

U-01–U-03 and U-05 have owned implementations; public primitive mappings and
package routes are recorded in [primitive mappings](react-aria-primitives.md) and
[API reconciliation](react-aria-public-api-reconciliation.md). Catalog components
also use the owned foundation; implementation availability does not close the
remaining broad acceptance gates. Import the package stylesheet once and use
`Provider` or `ThemeScope` to provide scoped tokens.

`Typography` separates the visual `variant` from the semantic `as` element. All
existing typography roles, including `bodyAlt2`, have shared token metrics. A
visual heading does not implicitly change the document outline. `code` uses the
shared monospace family. Native attributes, class names, styles and refs are
supported without requiring a runtime styling engine.

`Box` supplies semantic containers and padding steps 0–4. `Stack` adds direction,
alignment, justification, wrapping and token gaps. Its optional `responsive` mode
stacks vertically below 38rem. Layout styles may use native `style` for a
context-specific adjustment. `Surface` owns default/subtle surfaces and flat,
outlined or raised variants. `Card` defaults to an outlined article; `CardContent`
defaults to padding step 4. `Divider` is a native separator with horizontal or
vertical orientation; `decorative` removes separator semantics. These presentation
modules are server-renderable and do not import the interaction foundation.

`IconButton` requires a consumer-provided action label and hides its decorative
icon from assistive technology. It delegates normalized activation, disabled and
pending behavior to `Button`. Pending buttons retain the action name and append a
pending announcement. A native button ref is forwarded.

`Menu` represents commands, with string IDs, labels, optional icons and disabled
items. It supports controlled or uncontrolled opening. Arrow keys skip disabled
commands, activation closes the menu, Escape dismisses it, and focus returns to
the trigger. The menu's explicit name takes precedence over inherited trigger
naming. Arbitrary form content belongs in `Popover`, not a command menu. Nested
menus are not implemented by this initial command contract.

`ButtonGroup` is a named group of independently focusable actions. It deliberately
uses normal Tab order. `SplitAction` joins a neutral text primary action and a
secondary menu trigger in one outlined group with a shared divider. Primary and
secondary callbacks are independent. Loading or disabling the primary also blocks
the secondary trigger. Library-owned default menu labels use translation keys.

`Switch` and `RadioGroup` expose owned checked/value callbacks with native form
participation. Radio values are stable strings supplied by the host. Disabled
radios are skipped by arrow navigation; read-only controls keep their selection.
Uncontrolled controls reset to their defaults with the native form. Controlled
values remain host-owned, including when the host handles reset. Radio descriptions
and validation errors are associated with the group.

Each implementation has colocated stories and tests. The foundation guard requires
those tests and prevents interaction dependencies in presentation modules.

`Select` uses string option IDs and keeps disabled options in the same internal
selection state as the trigger. It serializes IDs through the native form and
supports reset and host-controlled values. Read-only blocks opening while retaining
submission. Empty collections show an associated message and do not open an empty
popup. `TextArea` preserves the labeled-field naming union, descriptions, errors,
multiline values, native validation/reset, and a native textarea ref.

`Link` uses the existing navigation adapter for internal URLs, preserving host
router components, replace, modified clicks and consumer cancellation. Absolute
and protocol-relative URLs default to native navigation; `external` explicitly
overrides that choice. New-tab links preserve supplied rel values and add
noopener/noreferrer. `Breadcrumbs` uses a named native navigation list, links
ancestors through the adapter, and marks the final text as the current page.

The [remaining control contracts](react-aria-remaining-controls.md) cover lists,
navigation, disclosure, chips/tags, tables/pagination, toggles and tooltips. See
[progress/status/avatar](react-aria-progress-avatar.md) for loading and image roles.
