# Catalog grid capability and state contracts

Tasks: G-01–G-03 design review; implementation dependencies M-16–M-19,
G-04–G-23 and G-25–G-29. Recorded 2026-10-06 for
[draft PR #1](https://github.com/Structured-Growth/sg-ui/pull/1).
These are implementation requirements, not shipped catalog APIs. AppDataGrid
still uses MUI X. The [engine decision](react-aria-grid-decision.md) selects
TanStack Table 8.21.3 for row processing and React Aria Components 1.21.1 for
interaction. The [migration backlog](react-aria-master-task-list.md) remains
authoritative for implementation and acceptance status.

## Required capability matrix

| Capability | Migration disposition | Implementation / acceptance owner |
| --- | --- | --- |
| All nine existing cell types; column/action builders; RowSubHeader | Required parity: text, date, dateTime, link, copyable, json, image, menu, custom | M-16, G-02/G-15/G-21 |
| Client search and all toolbar filter operators before stable multi-sort and page slicing | Required integration; ordered multi-sort is an enhancement over the retired engine's single-rule clamp | M-16/M-17, G-04/G-08/G-09 |
| Server rows, known/unknown totals, pending/error/refresh and stale responses | Required host contract; no client processing or fetching of server rows | M-16/M-17, G-05 |
| Checkbox first, mixed page header, retained IDs, selected count and select-none | Required parity with explicit current-page semantics; all-matching dataset selection is deferred | M-16/M-17, G-06/G-07 |
| Shared search/refresh/filter/sort/columns/selected actions; list/cards | Required parity with one state owner; shared processing/page state across views is an integration correction | M-17/M-19, G-09/G-10 |
| First text/actions visibility locks; actions last | Required parity; ordering/locking replaces misleading legacy pinned metadata | M-16/M-17, G-11/G-13 |
| Numeric column widths, min/max, pointer and keyboard resizing; controlled column order | Required owned contract; order has non-drag controls | M-16/M-17, G-12 |
| True sticky/pinned columns | Deferred; old community engine metadata only changes order/visibility. No inert pinning prop in the owned API | G-11/G-12/G-26 |
| Nested actions/links/copy and row activation; aligned body content | Required parity with independent focus and activation | M-16/M-19, G-13/G-14/G-21 |
| Empty/no-results/loading/refresh/error, row subheaders | Required with preserved context and announcements | M-16, G-15 |
| Grid arrow navigation, checkbox/action tab stops, focus/scroll after updates | Required interaction contract and native browser evidence | M-16/M-17, G-16/G-29 |
| Row reorder via pointer/touch/keyboard and Move controls; cancel and host failure | Required, bounded to a complete unsorted/unfiltered single-page dataset | M-18, G-17/G-18/G-28 |
| Optional validated persistence, retired-model migration, reset | Required; no shared temporary persistence key for independent instances | M-16/M-17/M-19, G-22 |
| Virtualization | Conditional rendering optimization, not enabled by the proof. G-19/G-20 must establish workload need, measurements, focus and position semantics before claiming it | G-19/G-20/G-26 |
| Grouped headers, row expansion, inline editing | Deferred; no inert expansion state or edit props | G-23 |
| Export/import, aggregation/pivot, tree data, range selection, paste, formulas, undo, spreadsheet navigation | Future features; excluded from migration parity | G-24 |

Deferral of product features does not defer baseline accessibility, performance
measurements, strict dependency removal or public declaration checks. M-16 cannot
be marked complete merely because the experimental grid renders catalog rows.

## Rows, columns and callbacks

Retain AppDataGrid, AppDataGridShell, LearnerClassesDataGrid, RowSubHeader,
createDataGridColumns, createActionMenuColumn and useful existing App-prefixed
type names. Replace upstream aliases and broad prop inheritance with explicit
owned declarations. New domain models use Course naming; existing Class exports
remain. Generic rows are host-owned objects, with no GridValidRowModel constraint.

| Retired surface | Owned migration mapping |
| --- | --- |
| AppGridRowId | Canonical string ID; normalize host numeric IDs at the boundary |
| AppGridRowSelectionModel include/exclude object | Explicit selectedRowIds set; no implicit exclude/all-server-dataset model |
| AppGridPaginationModel | Owned page/pageSize record |
| AppGridColumnVisibilityModel | Owned boolean record validated against current columns |
| AppGridSortModel / sortModel / onSortModelChange | Canonical field/direction sortRules and onSortRulesChange; no second sort model |
| paginationMode/sortingMode/filterMode | One client/server mode controls all processing |
| GridColDef renderCell/renderHeader/valueGetter/valueFormatter | Owned row/value/field callbacks, with explicit consumer mappings |
| sx, upstream slots/slotProps/apiRef/initialState | Native className/style/ref and documented owned slots/defaults; no catch-all upstream passthrough |
| pinned | Visibility lock plus columnOrder migration, without sticky behavior |
| RowSubHeader.titleVariant | Owned text role; retain title/action behavior |

Removed inherited surfaces and changed helper/type shapes require the breaking
release marker and consumer examples. Merely retaining an App-prefixed alias
name does not justify leaking upstream declarations or incompatible semantics.

One top-level getRowId returns a stable, nonempty string for every row. A default
may read a string/number id, converting numbers to strings. Missing/duplicate IDs
are configuration errors; never silently merge two rows or infer IDs from position.
Existing selection/drag getRowId conveniences must resolve to that same identity
or receive a documented breaking mapping. getRowLabel supplies accessible row
names separately from identity. Rows remain immutable host input.

An owned column declares field, headerName, cellType, getCellValue,
renderCustomCell, getLink, getImageSrc, getMenuActions, fallbackText, sortable,
filterable, locked, width, minWidth, maxWidth and flex as appropriate. Field IDs are
unique, nonempty strings; internal selection/drag IDs are reserved and rejected
in host columns. Accessors receive the original generic row. renderCustomCell
receives that same row and returns ReactNode. Additional rendering/formatting
hooks must use owned contexts such as row/value/field, never engine params.

Retain flex as an owned positive grow weight: divide available space among flexible
columns within min/max bounds; widths below their minimum produce horizontal
scrolling. A user-committed numeric columnWidths entry overrides flex for that
column until reset. Numeric fixed widths remain fixed. Resizing and container
measurement stay internal, with SSR-safe initial sizing and native verification.
Do not silently turn existing responsive columns into fixed-width columns.

Remove automatic enumeration of arbitrary row keys into inferred hidden columns
as a documented breaking mapping. Hosts declare every available column explicitly,
including initially hidden columns. Persisted visibility entries for undeclared
fields are discarded; hosts wishing to restore an old inferred field must declare
it first. The toolbar must not offer fields the grid cannot actually render.

Separate raw accessor values used in filtering/sorting from displayed formatting.
getCellValue wins over a field lookup. Date/dateTime formatting uses host locale
and optional host formatter/time zone; serialized date-only values must not move
calendar day through an implicit time-zone conversion. Invalid dates and nulls
use fallback text. JSON/text remain escaped React content, image errors show
fallback, and clipboard success/failure uses translated feedback. Link cells use
the owned Link/router adapter. Host labels remain literal.

Action descriptors retain id/label/href/target/rel and a row callback; activation
uses one normalized callback, with unavailable/pending actions disabled. Mapping
existing onClick(row) to owned onPress(row) is a breaking consumer change if the
name changes. Reorder requests retain sourceRow/sourceRowId/targetRow/targetRowId
and before/after position. Actions and reorder request host work; neither mutates
the input nor persists data. onReorder is never invoked on cancel or an invalid
target. The host owns optimistic rows, rollback/error reporting and reconciliation.

createDataGridColumns must return owned column definitions, not GridColDef.
createActionMenuColumn must produce a locked, nonsortable/nonfilterable last
action column without pinned or retired CSS-class metadata. The implementation
must audit all exported helpers, cell/header parts and transitive declarations,
including the root/components entry points, before G-27 can pass.

## State authority and transactions

The state model uses engine-independent records: paginationModel is
{ page: number; pageSize: number }, sortRules is an ordered array of
{ field: string; direction: "asc" | "desc" }, filterRules uses the existing owned
DataToolbarFilterRule schema, search is a string, selectedRowIds is an explicit
ID set, columnVisibilityModel is Record<string, boolean>, columnOrder is a field
ID array, and columnWidths is Record<string, number>. View mode is list/cards at
the shell. Expansion is absent until G-23 selects an actual expansion feature.

For each concern, a provided controlled value is authoritative. Its callback
requests a next value without committing a competing local value. Without a
controlled value, a default seeds local state once; the callback observes committed
changes. A callback alone must not accidentally make a concern read-only. Select
one owner for each concern at construction and avoid changing ownership during
the instance lifetime. Controlled values are never overwritten by persistence.

The shell owns uncontrolled view/grid concerns and passes controlled values to
the grid, toolbar, cards and footer. A standalone grid owns its uncontrolled
concerns. React Aria receives selection IDs/focus interaction and TanStack receives
sorting/pagination snapshots; neither supplies a second public state store.
Use a single transition function for toolbar/header/footer actions. An optional
combined state-change notification must observe that transaction, not establish
an additional owner alongside controlled slices.

| Concern | Controlled value / default / request |
| --- | --- |
| Page | paginationModel / defaultPaginationModel / onPaginationModelChange |
| Sort | sortRules / defaultSortRules / onSortRulesChange |
| Filter | filterRules / defaultFilterRules / onFilterRulesChange |
| Search | searchValue / defaultSearchValue / onSearchChange |
| Selection | selection.selectedRowIds / selection.defaultSelectedRowIds / selection.onSelectedRowIdsChange |
| Visibility | columnVisibilityModel / defaultColumnVisibilityModel / onColumnVisibilityModelChange |
| Order | columnOrder / defaultColumnOrder / onColumnOrderChange |
| Width | columnWidths / defaultColumnWidths / onColumnWidthsChange |
| Shell view | view.mode / view.defaultMode / view.onModeChange |

These names specify the target contract for M-16/M-17, including newly required
defaults. selection=true enables locally owned selection, selection=false disables
it, and an object config uses the same controller with optional controlled IDs.
Shell selected count reads that controller even for boolean selection. Existing
toolbar callbacks observe the shared transaction; they must not own separate
criteria while the grid uses another representation. Hosts that fetch on changes
should consume the combined transaction snapshot once, rather than fetching once
for each slice notification.

Default pageSizeOptions remains 25/50/100. Explicit numeric options (or existing
value/label options) permit any positive safe integer, deduplicated in host order;
do not round a valid custom size such as 10 up to 25 or impose the retired
community-engine limit of 100. Reject invalid options; if none remain, use the
defaults. Initial/restored pageSize must match a current option or use the first
valid option. A changed options list normalizes an obsolete local size with page
zero; controlled owners receive a request, retaining authority over their value.

| Transition | Required next state / notification order |
| --- | --- |
| Search, applied filters or sort changes | Page zero and the new criteria belong to one transaction. Notify pagination reset before the criterion callback; any combined request snapshot already contains page zero |
| Page-size change | Page zero with the new valid page size, one pagination request |
| Page change | Nonnegative integer page; honor known total or host hasNextPage; never infer unknown server total from loaded rows |
| Header sort | Use the same ordered rules as toolbar/processing; selecting a direction moves that field to priority one, clear removes it; omit empty/invalid/duplicate rules |
| Selection toggle / header page select | Change only selectable visible page IDs, retain other IDs; None explicitly clears all retained IDs |
| Column visibility/order/width | Apply locks, actions-last, current-field validation and numeric bounds before emitting the owned result |
| View switch | Preserve selection/search/filter/sort and shared page state; do not process or slice server data a second time |
| Reset view | Restore documented defaults for locally owned persisted concerns; request controlled changes through their callbacks |

Client processing is search + all valid filters, then stable ordered sorting,
then pagination. Use the full DataToolbar operator set, including no-value empty
operators, enum is/is_not with the existing delimiter, and All as no active enum
rule. Null/invalid values, numeric comparisons, calendar-date comparison and
case handling need explicit shared tests (G-04/G-09); the prototype's four
operators do not satisfy parity. Equal sort values retain input order.
Selection survives sort/filter/page/view changes. Disabled rows cannot be newly
selected; retained IDs remain until a host deletion/reconciliation signal or
explicit clearing. A missing row in a server page is not proof of deletion.
Do not advertise selected IDs as loaded row objects or all-matching selection.

Server mode renders host rows in host order without client search/filter/sort/page
processing. rowCount is a known nonnegative total or absent for unknown total;
hasNextPage governs unknown-total forward navigation. Refresh retains rows,
selection and focused interaction context while announcing pending state. The
host uses request identity/cancellation to reject stale responses. Include a
story proving out-of-order responses cannot replace the latest requested rows.

## Persistence, focus and implementation sequence

Persistence is optional and keyed per view. Validate a versioned envelope before
restoring values: current field IDs/operators/directions, finite bounded widths,
valid order/visibility, valid page sizes and nonnegative pages. Never persist
selection, pending/errors or host rows by default. Safely migrate existing
datagrid:<key>:paginationModel, page:<key>:viewMode,
page:<key>:columnVisibilityModel and page:<key>:cardsPaginationModel where valid;
prefer the former list pagination when combining old list/cards states. Retired
sort/filter models need explicit conversion or documented rejection. Storage
failure and malformed/schema-incompatible JSON fall back without crashing SSR.

Retain focused row/cell by stable IDs across sorting and refresh; if hidden or
deleted, move to a surviving equivalent control or grid entry, never the body.
Page changes focus a documented page entry; view switches return focus to the
view trigger. Preserve scroll when refresh does not invalidate its anchor;
reset/clamp for a new page. Reorder restores the source control after a host
update or cancellation. Native tests must cover nested controls, independent
instances, disappearance and horizontal/vertical scrolling.

Implement M-16 in linked batches if needed: owned types/row processing, migrated
cells/header/status parts, registered experimental interaction with native
refs/token CSS, then catalog integration and strict transitive/package checks.
M-17 wires the shared shell transaction; M-18 completes reorder; M-19 migrates
the learning composition. Each implementation batch requires colocated behavior
tests/stories, pnpm check, build-storybook and relevant packed/native evidence.
Do not weaken registered interaction guards or claim broad G/U/X/R/Z acceptance
from the existing representative proofs. No legacy foundation removal before
G-27 and the remaining catalog consumers pass.
