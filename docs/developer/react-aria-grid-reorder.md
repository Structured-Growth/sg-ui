# Catalog grid row reorder (M-18)

`AppDataGrid`, `AppDataGridShell` list mode accept
owned `rowDrag` configuration. Import `/styles.css` and provide `Provider` or
`ThemeScope`. The granular `/components/AppDataGridRowDnd` entry exports the owned
handle and optional native-event helper.

```tsx
<AppDataGrid rows={rows} columns={columns} label="Courses"
  getRowId={row => row.id} getRowLabel={row => row.name}
  rowDrag={{ onReorder: request => requestHostMove(request) }} />
```

The callback receives `sourceRow`, `sourceRowId`, `sourceRows`, `sourceRowIds`, `targetRow`, `targetRowId` and
`position` (`before` or `after`). Identity is the grid's `getRowId`, including the
stable string mapping for default numeric `id` values. `getRowLabel` in rowDrag
can override the handle name; `isRowDraggable` restricts sources, and
`handleColumnWidth` configures the fixed reorder column before the text columns.
By default only the drag handle is shown. Set `showMoveButtons: true` to add
Move up/down buttons; set `dragDisabled: true` to disable the handle independently
while those buttons can still request moves. The handle supports keyboard dragging
without requiring arrows.

Reordering requires a complete client dataset on page zero fitting in one page,
with no search, filters or sorting, and no loading,
refreshing or error state. Controls remain visible but disabled outside this
boundary. Sorting or filtering that happens to preserve the visible row order
still disables reordering. A page-size reduction that creates multiple pages
also disables it; the grid does not interpret a move as a page-local reorder,
clear criteria, or change the current page to make a drag possible. Clear the
criteria and show the complete dataset on page zero to re-enable controls.
A criteria change during a drag must not request a host move while that boundary
is active. Start a new interaction after restoring an eligible collection. Server pages cannot define a complete host order. Dragging a selected row moves all selected rows together in host order; dragging
an unselected row moves only that row. The singular source identifies the initiating
row; the ordered `sourceRows` and `sourceRowIds` identify the entire move. Hosts
remove that group and insert it before/after the target as a block. Selection remains
unchanged. Move up/down controls move the same group past its neighboring outside row.
A group containing a host-declared non-draggable row cannot move. Targets inside the
group and moves leaving the full order unchanged emit no callback. Replacing
rows or the identity function during a drag invalidates the captured order.

Pointer dragging shows a chiplet with the localized row count (for example, “2 rows”).

React Aria handles pointer, touch, keyboard and assistive-technology drag
interactions and their announcements. When `showMoveButtons` is enabled, touch users can also tap Move up/down
without dragging; this requests the same adjacent before/after move as keyboard
or pointer activation of those controls. Touch scrolling outside the handle
remains native; the drag handle reserves its own gesture with `touch-action: none`. Activate the handle to enter keyboard drag
mode, navigate drop positions, confirm to request a move, or Escape to cancel.
Optional Move up/down controls offer equivalent non-drag requests. A request announcement
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
The owned handle supplies native `pointerEvents: "auto"` for this slot so a first
pointer gesture reaches the draggable button. The upstream slot's pass-through
style otherwise targets the enclosing cell and can prevent drag initiation.
Host native style remains available. Browser tests start from the handle's
coordinates and require trusted native dragstart/drop/dragend events, host order
changes and source focus; they do not dispatch synthetic drag events.
For an independent native drag composition, the exported `useDataGridRowDnd`
helper resolves `[data-sgui-part='grid-row'][data-grid-row]`, uses `dataset.gridRow`
and optionally restricts targets with `rootRef`. Its preview stays inside the owned
scope and uses compiled token styles. Native `dragend` (drop or cancellation),
preview replacement, explicit cleanup and unmount release the preview and its
capture listener. A rejected `setDragImage` call also releases both before
propagating the browser error. `cleanupDragPreview` remains idempotent for hosts
that call it explicitly; the helper does not own reorder requests or persistence. No
retired renderer selector or hard-coded ghost styling remains.

Public request, bounded-state, host commit/rollback, keyboard cancellation and
helper isolation tests accompany this implementation. Representative browser
checks are recorded in the execution log. Native pointer before/after drops,
outside cancellation, host rollback and selection/sorting boundaries now have
executable checks. Trusted touchscreen taps verify the Move alternative at a
390px viewport, including host rollback; they do not certify physical long-press
dragging. Full touch-device, screen-reader,
zoom, browser and performance acceptance remains open under G/X/U/Z gates.

## Bounded cancellation and rollback acceptance (G-17/G-18/G-28/X-08)

`DataGridDragHandle/StrictModeReorder` is a complete five-row, one-page host
fixture rendered under React Strict Mode. The host counts requests, disables
reorder while saving, applies an optimistic order and restores its previous
snapshot when its simulated save fails. Its timer is cancelled on host unmount;
production hosts still own network abort and stale-result guards.

The dedicated `tests/browser/batch01-grid-reorder.spec.ts` checks keyboard Escape
cancellation with another row selected, source focus, removal of drop indicators,
remount and a subsequent single keyboard request. It also checks Enter/Space Move
alternatives through pending save, commit and rollback, and pointer Move focus
fallback when the destination disables that direction. Colocated helper tests
check native drag-end preview/listener cleanup, replacement, browser drag-image
errors and Strict Mode unmount. Existing `tests/browser/reorder.spec.ts` retains
trusted native pointer and emulated touchscreen Move coverage.

The existing `inventory-pointer-reorder-invalidation.spec.ts` separately covers
trusted pointer dataset/identity replacement and cancellation over a second grid
with colliding row IDs. These pointer checks do not establish touch cancellation.

The finite G-17/M-18 reconciliation
joins the behavior definition, owned helper/style contracts, accepted F/T/V-C18
records, retained native input evidence and current focused tests. It recommends
acceptance of those two obligations. This does not establish physical-device
long-press dragging or spoken screen-reader output; those observations remain
separate from the defined touch alternative and DOM announcement contract.
Production network abort, stale-response handling and persistence remain host
responsibilities. Other G/U/X/R/Z obligations retain their own acceptance scopes.
