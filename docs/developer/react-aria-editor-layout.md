# Owned editor layout and selection toolbar

Task references: M-21–M-23, M-25. These components keep their public names and
compose SGUI-owned controls, tokens and compiled CSS Modules. Load
`@structured-growth/sg-ui/styles.css` once and provide `Provider` or `ThemeScope`.
Each has a granular `/components/<name>` export and native div ref/className/style.
PageRichTextEditorSection (M-34), its full editor composition and broad editor
acceptance gates remain open. Lexical document models, commands and serialization
are unchanged by this batch.

## DocumentEditorLayout

`title`, `titleNode`, `headerRight`, `menuBar`, `toolbar` and `children` remain.
The fallback title retains paragraph semantics; use `titleNode` to supply the
host's heading level. Header/actions wrap and content has zero minimum dimensions.
The host content owns scrolling, for example a flex child with `minHeight: 0` and
`overflow: auto` inside a layout with a bounded height. Header/menu/toolbar remain
outside that scroll region. The layout does not add a second scroll container.
The owned parts are document-editor-layout/header/title/actions/menu/toolbar/content.

## DocumentEditorToolbar

`headingValue` remains normal/h1/h2/h3/h4/h5. Existing action `onClick: () => void`
callbacks, controlled active flags, zoom values/callbacks, optional groups and
right/status slots remain. Missing callbacks now disable their controls; read-only
editing disables heading and formatting while supplied zoom commands remain usable.
Alignment and custom-component actions remain unavailable placeholders.
Icon actions have translated accessible names and formatting exposes aria-pressed.
The wrapping group has an optional aria-label and defaults to Document editing.
Heading requests run after the select event completes, so a host callback can
refocus contenteditable without native Enter replacing its selection. Controlled
values stay authoritative. Pending heading requests are cancelled on unmount.

**Breaking styling mapping:** `statusColor` is a native CSS color, including an
owned token variable; replace upstream paths such as text.secondary with
`var(--sgui-text-muted)`. Omit it to use the default muted status token.

## ContentEditorChrome

Title/save and right/icon slots remain. `titleReadOnly` optionally prevents title
editing. Menu actions support disabled/loading and optional aria-haspopup,
aria-expanded and aria-controls for a host-owned menu/dialog. They use normalized
pointer/Enter/Space activation, type=button and native button anchors.

**Breaking callback mapping:** replace menuItems `onClick(event)` with
`onPress(anchor: HTMLButtonElement)`. Replace `event.currentTarget` with `anchor`
when positioning a host menu. There is no fabricated event or second activation
callback. Missing onPress disables an action; loading suppresses activation and
announces Pending. Runtime menu labels and status content remain host-translated.
The optional root aria-label and editor-icon/title/status/actions part hooks support
host composition. Empty action lists do not create an empty group.

## FloatingTextSelectionToolbar

The toolbar must be inside a LexicalComposer. Retained boundaryRef and link
callbacks remain host-owned. Library labels use the translation adapter. Bold,
Italic, Underline, Subscript and Superscript expose the Lexical active state;
Edit link disables without onRequestLink. Native style affects presentation;
left/top/maxWidth remain owned by selection positioning.

Select text in the editor, then use Alt+F10 to focus the first formatting action.
Tab traverses available actions; Enter/Space applies a command. Escape hides the
group and returns editor focus. Hidden controls use native hidden semantics and
cannot receive focus. The selection survives toolbar focus. Commands restore a
saved range selection and run after native activation handling before returning
focus to the editor. Link mouse-down preparation remains separate from link
activation; keyboard activation restores the selection before requesting the host
link flow. Callback timers are cancelled on unmount and commands are suppressed
if the editor becomes read-only or selected nodes disappear.

Position follows selection/update, captured ancestor scroll, resize and toolbar
measurement. Coordinates clamp to the viewport intersected with boundaryRef and
controls wrap within that width. Fully offscreen/zero-geometry/collapsed/outside
selections hide the toolbar; scroll still updates geometry while a control has
focus. Outside pointer and window blur dismiss it. Escape remains dismissed for
the same selection until a new editor interaction or selection change.
The overlay retains its existing fixed-position rendering within the visual scope;
hosts must avoid transformed fixed-position containing blocks around it. Full
cross-browser/touch/assistive-technology acceptance remains open.

See the [execution evidence](react-aria-progress.md#editor-layout-and-floating-selection)
and [formatting toolbar](react-aria-formatting-toolbar.md) for the surrounding
owned toolbar integration. `node scripts/test-editor-consumer.mjs` (or --react18)
validates a real packed editor-controls consumer separately from the basic fixture,
which continues to guard against pulling the editor into basic controls.
