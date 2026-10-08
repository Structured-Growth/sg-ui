# Owned data toolbar

Task M-20. DataToolbar and its columns, sort, filter and selection menus use the
owned foundation. Import `/styles.css` once and wrap them with `Provider` or
`ThemeScope`. The toolbar exposes a native div ref, className, style and
aria-label. `/components/DataToolbar` includes the public models and helpers.

Existing view, search, refresh, column, sort and filter callbacks retain their
names and owned string/array payloads. `mode` remains host integration metadata;
the toolbar never processes or fetches rows. The host resets pagination before
requesting rows when search, filter or sort changes. A controlled searchValue
remains authoritative. Without searchValue, local text updates and the optional
callback observes it. Opening search focuses its named input; Clear and close or
Escape requests empty text, closes the field and returns trigger focus. Search
stays open while interacting with toolbar controls. Missing action callbacks
disable the corresponding action. View actions request cards/list and the host
owns the selected mode.

Column labels, filter options, sort options and selection choices are host-owned
translated content. They render literally; the library does not invent translation
keys for runtime labels. Columns change immediately, locked options are disabled,
Reset shows all columns and dismissed column-search text resets. The builder uses
owned record visibility and generic object rows, with actions last and non-hideable;
visibility locks do not imply sticky columns.

Sort/filter menus reload their drafts on each open. Escape, outside dismissal
and Cancel discard edits. Reset clears the draft; Apply requests valid rules and
closes. Sort maintains priority order, excludes duplicate field choices, and offers
Move up/down buttons alongside pointer drag handles. These buttons also provide a
touch/non-drag alternative. Drag uses pointer capture and owned row references;
only pointer release commits a move. Pointer cancellation/dismissal discards it. Enum filters allow multiple values with the existing
serialized representation. All clears values and applies no active enum rule.
No-value string operators clear stale values. Number/date values use labeled native
inputs. Nested value pickers preserve the parent draft and scope. Active counts
remain visible. Selection uses a named mixed checkbox and menu; callbacks express
the host's explicit page/all/none options rather than claiming unloaded rows exist.

Optional selectedCount announces `{count} selected`; existing
leftContentWhenSelected continues to override leftContent when supplied. The host
controls when to supply selected actions. Use the owned SplitAction for neutral
outlined header actions. The toolbar wraps at narrow widths and uses theme tokens
for text, surfaces, borders and focus, including portaled menus.

## Allocated width and container ownership (C-08)

The root owns `container: sgui-data-toolbar / inline-size`. Its search descendant
uses a 10rem field at a toolbar **content-box** width of at most 24rem and 15rem
above that boundary. Viewport width does not select the compact field. Action and
search groups continue to wrap within the allocated width; the query styles the
search-field descendant, never the container root itself. Host actions remain in
their existing group and retain their callbacks and focus behavior.

Allocate toolbar width externally: a normal block in a sized parent stretches to
that parent; in flex/grid hosts provide an appropriate track or flex basis and
allow shrinking (`min-inline-size: 0`) where needed. Inline-size containment
excludes children from the root's intrinsic inline-size contribution. An
auto-sized inline/shrink-to-fit host cannot rely on toolbar contents to choose its
width; give it an explicit width, track or basis. The root's block size remains
content-driven so wrapped controls can increase its height. Hosts must not clip
that height or keyboard focus outlines.

Each nested toolbar establishes its own same-name boundary, so its descendants
query the nearest toolbar rather than a wider ancestor. A host-created same-name
container inserted **inside** the toolbar can intercept descendant queries; avoid
reusing the reserved `sgui-data-toolbar` name in custom toolbar content. Portaled
menus are outside the layout container and retain the owned overlay scope and
placement contract. Enlarged text and longer host labels may wrap actions; keep
the allocated width sufficient for the host's controls and test visible focus,
keyboard menu activation/dismissal and search focus through host resizing.

The ContainerBoundary and ContainerBoundaryEnlarged stories provide independent
320px/800px hosts in a fixed wider ancestor and a host resize action. Prepared
native geometry/focus/menu cases are recorded in
[batch-165 evidence](parallel-batch-165/toolbar-container-boundary.md); browser
execution and broader device/assistive-technology acceptance remain pending.

M-16–M-19 and G integration/acceptance remain open: toolbar migration does not
complete grid state processing, page resets, persistence, row focus/reorder,
virtualization, performance or the full browser/assistive technology matrix.
