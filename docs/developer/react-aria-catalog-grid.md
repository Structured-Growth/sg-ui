# Owned catalog grid integration

The public grid renderer/helpers/parts and AppDataGridShell use owned contracts.
Course collections are host compositions of the shell, with host-owned columns,
localized formatting and destinations. Load `@structured-growth/sg-ui/styles.css` and wrap grids in
`Provider` or `ThemeScope`. Granular component entry points bound consumer imports
to the requested controls. Broad G/U/X/R/Z acceptance remains
open; this integration does not certify the complete migration.

```tsx
import "@structured-growth/sg-ui/styles.css";
import { Provider } from "@structured-growth/sg-ui/experimental";
import { AppDataGridShell } from "@structured-growth/sg-ui/components/AppDataGridShell";

const columns = [{ field: "name", headerName: "Course", flex: 1, minWidth: 180 }];
export function Courses({ rows }) {
  return <Provider><AppDataGridShell label="Courses" rows={rows} columns={columns}
    getRowId={row => row.id} getRowLabel={row => row.name}
    view={{ cards: { renderCard: row => <article>{row.name}</article> } }} />
  </Provider>;
}
```

Column resize handles sit on each column’s leading edge; no trailing handle is
rendered after the last column. The first data boundary, including the boundary
next to fixed selection/reorder columns, is a static separator. Boundaries next
to fixed-width data columns (`minWidth === maxWidth`) are also non-interactive
and have no slider or keyboard resize action. In left-to-right layouts, dragging a leading
divider left increases its column width and dragging right decreases it; the
pointer direction mirrors in right-to-left layouts. Pointer gestures use their
starting width snapshot, respect bounds, and restore the snapshot on cancellation.
Native range/keyboard width adjustment remains available. Width changes preserve the full measured snapshot
and retain one eligible fill column rather than reallocating every sibling.

`label` names the table; `getRowLabel` names each row independently of identity.
Rows have no upstream constraint. Default identity reads string/number `id`;
numeric IDs normalize to strings. Missing/duplicate IDs are configuration errors.
Checkbox selection is enabled by default; `selection=false` disables it. An
object accepts selected/default ID sets, a change callback and `isRowSelectable`.
The original extracted wrapper omitted convenience selection when `selection` was
absent. Pass `selection={false}` to retain that presentation. Existing
`selection.selectedRowIds` already used `Set<string>` and its callback still returns
a Set; do not convert those callers to an engine include/exclude object. Move
custom selection/drag `getRowId` to the top-level prop and return stable strings.

```tsx
import { AppDataGrid } from "@structured-growth/sg-ui";

export function CoursesWithoutSelection({ rows }: { rows: { id: string; name: string }[] }) {
  return <AppDataGrid<{ id: string; name: string }>
    label="Courses" rows={rows} getRowLabel={row => row.name}
    columns={[{ field: 'name', headerName: 'Course', flex: 1 }]}
    selection={false} />;
}
```

Page selection retains off-page and previously disabled IDs; the selection menu's
None action clears all retained IDs. Host deletion reconciliation remains explicit.

Each criteria/layout concern has its own controlled value, default and callback.
Callback-only concerns remain writable. Sorting/filter/search reset page zero
before the criterion callback and emit one combined `onStateChange` snapshot.
Use that snapshot for a server request. `mode="server"` passes host rows unchanged;
`rowCount` is optional and `hasNextPage` controls unknown-total forward navigation.
The host owns cancellation, stale responses, refresh, errors and persistence of data.

The shell owns criteria/layout/selection for toolbar, list, cards and footer.
The view switch requires a card renderer and, for controlled `view.mode`, an
`onModeChange` callback. Set `toolbar.showViewModeToggle` to `false` for fixed-view
examples; hiding the switch preserves the configured list or card rendering.
Cards use the same processing result and page as the list. Per-card pagination and
identity overrides are removed. Footer navigation enters the accepted page;
view switching preserves the trigger's focus. Selection count includes retained IDs.

Breaking mappings:

| Retired surface | Owned replacement |
| --- | --- |
| engine props, slots, `sx`, `apiRef`, inherited event params | explicit props, native `className`/`style`, container ref and `tableRef` |
| `sortModel`, `AppGridSortModel`, separate processing modes | ordered `sortRules`, one `mode` |
| upstream row-selection model alias and engine event params | owned `Set<string>` alias and owned callbacks; existing selection config Set values remain |
| nested selection/drag identity | top-level `getRowId` |
| `valueGetter`/`valueFormatter`/engine cell params | `getCellValue(row)`/`formatValue(value,row)`/`renderCustomCell(row)` |
| action `onClick(row)` | `onPress(row)` |
| inferred hidden fields and pinned metadata | declare all columns; visibility locks/order; actions last |
| `createDataGridColumns` engine-oriented arguments | one readonly owned column array, returns validated owned definitions |
| learner `paginationMode`/`sortModel` | shared owned grid props and `mode` |

`RowSubHeader` retains title/toggle/edit behavior using native styling and owned
text roles. Existing public cell/header/status paths also use owned parts.
Widths remain bounded; pointer/keyboard resizing commits a numeric override only
for the resized field, preserving other flex columns. Custom page sizes such as
10 and 250 are supported. Default page sizes remain 25/50/100.

Persistence is opt-in through `persistence={{key, storage?}}`.
Use a distinct key per view and remount when changing identity. The version-one
`sgui:grid:<key>:v1` envelope validates declared fields, rules, widths, layout and
page sizes. It excludes selection, rows, errors and pending work. Controlled
values win over restored defaults. A persistent grid initially renders a loading
status on server and first client render, then mounts with restored defaults.
Storage failure falls back safely. Only the current versioned key is read. Pass `showResetView` to offer a translated Reset view button on either the grid or
shell. Reset applies the currently declared `default*` props, not the saved state:
page zero with the default page size (25 when omitted), default sort/filter/search,
default visibility/order/widths, and the shell's `view.defaultMode` (list when
omitted). Selection clears, including retained off-page IDs. Column locks and
validation still apply. One action updates locally owned concerns together and
requests controlled concerns through their existing callbacks. Pagination is
requested first among criteria callbacks, followed by sort, filter, search and
selection, then one `onStateChange` criteria snapshot. Layout/view callbacks also
receive defaults, and `onResetView` receives one complete `AppDataGridViewState`
including layout and optional shell view mode. Host-controlled values stay visible
until accepted; use the complete reset snapshot when coordinating all concerns.
The reset button retains focus. Reset remains available when the toolbar is hidden.

Reset removes the current versioned key and saves the validated requested defaults
under the version-one envelope, so old restored values cannot revive on remount.
Automatic persistence suppresses the unchanged pre-reset snapshot so a rejected
controlled request cannot immediately overwrite the saved defaults. It resumes
when the resolved persisted snapshot changes, including a host-accepted alternative
or a subsequent user action. Accept `onResetView` as one complete snapshot for
atomic controlled updates; hosts that accept individual concerns asynchronously
own any intermediate partial snapshots.
Storage errors never block the live reset. Reset does not mutate rows, clear host
errors or cancel host work; server consumers handle their one combined request.

M-18 integrates bounded pointer/touch/keyboard/Move requests and cancellation.
See [reorder contracts](react-aria-grid-reorder.md) for the public rowDrag mapping.
True pinning, expansion, editing and spreadsheet features remain deferred per
[catalog contracts](react-aria-grid-contracts.md).

## Row reorder

The M-18 [reorder contracts](react-aria-grid-reorder.md) cover the public rowDrag
configuration and owned handle/helper. List mode uses the same state/identity
owner as selection and processing; cards mode has no reorder control.

Cell columns support `truncate: false` for multiline wrapping; the default remains
ellipsis with complete accessible text. See cell and helper acceptance
for M-40/M-41 behavior evidence and the supported public helper surface.

Action menu columns use a fixed width: 110px by default, or the host-supplied `width` clamped to its bounds. They do not expose a resize handle or absorb flexible space; saved width overrides cannot change that allocation.

## Refresh progress without moving retained rows

`DataToolbar.refreshing` replaces the refresh icon with pending progress in the
same fixed-size button and suppresses repeat refresh requests. The host owns the
request and resets the prop after success or failure. The button remains absent
when `showRefreshButton` is false.

`AppDataGridShell` derives this toolbar state from its `loading`/`refreshing` props
for both list and card views. Retained-row refresh messages are polite,
announcement-only status rather than an in-flow banner. Existing rows/cards,
headers and the footer keep their layout positions. Initial loading without rows
shows its spinner only in the body and disables the toolbar refresh action without a second spinner; shell errors place their message and retry action in DataToolbar, while standalone grids and shells with a hidden toolbar retain their inline message/retry
flow. A standalone `AppDataGrid` host can compose `DataToolbar` for the same
visible progress, and supplies any alternative when the toolbar is hidden.
