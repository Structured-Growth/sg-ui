# Catalog grid row reorder (M-18)

`AppDataGrid`, `AppDataGridShell` list mode and `LearnerClassesDataGrid` accept
owned `rowDrag` configuration. Import `/styles.css` and provide `Provider` or
`ThemeScope`. The granular `/components/AppDataGridRowDnd` entry exports the owned
handle and optional native-event helper.

```tsx
<AppDataGrid rows={rows} columns={columns} label="Courses"
  getRowId={row => row.id} getRowLabel={row => row.name}
  rowDrag={{ onReorder: request => requestHostMove(request) }} />
```

The callback receives `sourceRow`, `sourceRowId`, `targetRow`, `targetRowId` and
`position` (`before` or `after`). Identity is the grid's `getRowId`, including the
stable string mapping for default numeric `id` values. `getRowLabel` in rowDrag
can override the handle name; `isRowDraggable` restricts sources, and
`handleColumnWidth` configures the fixed reorder column before the text columns.

Reordering requires a complete client dataset on page zero fitting in one page,
with no search, filters or sorting, at most one selected ID, and no loading,
refreshing or error state. Controls remain visible but disabled outside this
boundary. Server pages cannot define a complete host order. Only one source row
is moved; invalid/missing/self/adjacent no-op targets emit no callback. Replacing
rows or the identity function during a drag invalidates the captured order.

React Aria handles pointer, touch, keyboard and assistive-technology drag
interactions and their announcements. Activate the handle to enter keyboard drag
mode, navigate drop positions, confirm to request a move, or Escape to cancel.
Move up/down controls offer equivalent non-drag requests. A request announcement
does not claim the host has saved the order. Focus stays with the source control
when the host commits row order; when a boundary disables that control, focus
falls back to the source row's enabled control or cell.

SGUI never mutates host rows or persists the move. Hosts own async cancellation,
latest-response guards, pending feedback and errors. An optimistic host retains
its previous rows, replaces rows immediately, marks the grid refreshing while
saving, and restores its snapshot on failure. Avoid letting a stale response
replace a newer accepted order. `HostOwnedReorder` demonstrates one pending
request and rollback. Cards mode has no reorder controls; the list emits requests
against the shell's shared processed state.

## Breaking handle/helper mappings

`DataGridDragHandle` is an accessible button with required `label`, owned
`onPress`, `disabled`, `dragging`, `slot`, native style/class and button ref.
Legacy unnamed div `onClick` and native draggable callbacks are removed. A
`slot="drag"` handle participates in React Aria collection drag interactions.
For an independent native drag composition, the exported `useDataGridRowDnd`
helper resolves `[data-sgui-part='grid-row'][data-grid-row]`, uses `dataset.gridRow`
and optionally restricts targets with `rootRef`. Its preview stays inside the owned
scope and uses compiled token styles, with replacement/unmount cleanup. No
retired renderer selector or hard-coded ghost styling remains.

Public request, bounded-state, host commit/rollback, keyboard cancellation and
helper isolation tests accompany this implementation. Representative browser
checks are recorded in the execution log. Full touch-device, screen-reader,
zoom, browser and performance acceptance remains open under G/X/U/Z gates.
