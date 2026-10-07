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

M-16–M-19 and G integration/acceptance remain open: toolbar migration does not
complete grid state processing, page resets, persistence, row focus/reorder,
virtualization, performance or the full browser/assistive technology matrix.
