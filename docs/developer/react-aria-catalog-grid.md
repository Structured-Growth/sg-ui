# Owned catalog grid integration

M-16 public renderer/helpers/parts, M-17 shell and M-19 learner composition now
use owned contracts. Load `@structured-growth/sg-ui/styles.css` and wrap grids in
`Provider` or `ThemeScope`. Import their granular component entry points to avoid
the remaining legacy catalog. Broad G/U/X/R/Z acceptance remains
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

`label` names the table; `getRowLabel` names each row independently of identity.
Rows have no upstream constraint. Default identity reads string/number `id`;
numeric IDs normalize to strings. Missing/duplicate IDs are configuration errors.
Checkbox selection is enabled by default; `selection=false` disables it. An
object accepts selected/default ID sets, a change callback and `isRowSelectable`.
Page selection retains off-page and previously disabled IDs; the selection menu's
None action clears all retained IDs. Host deletion reconciliation remains explicit.

Each criteria/layout concern has its own controlled value, default and callback.
Callback-only concerns remain writable. Sorting/filter/search reset page zero
before the criterion callback and emit one combined `onStateChange` snapshot.
Use that snapshot for a server request. `mode="server"` passes host rows unchanged;
`rowCount` is optional and `hasNextPage` controls unknown-total forward navigation.
The host owns cancellation, stale responses, refresh, errors and persistence of data.

The shell owns criteria/layout/selection for toolbar, list, cards and footer.
Cards use the same processing result and page as the list. Per-card pagination and
identity overrides are removed. Footer navigation enters the accepted page;
view switching preserves the trigger's focus. Selection count includes retained IDs.

Breaking mappings:

| Retired surface | Owned replacement |
| --- | --- |
| engine props, slots, `sx`, `apiRef`, inherited event params | explicit props, native `className`/`style`, container ref and `tableRef` |
| `sortModel`, `AppGridSortModel`, separate processing modes | ordered `sortRules`, one `mode` |
| engine selection include/exclude object | explicit string ID set in selection config |
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

Persistence is opt-in through `persistence={{key, storage?}}` or `storageKey`.
Use a distinct key per view and remount when changing identity. The version-one
`sgui:grid:<key>:v1` envelope validates declared fields, rules, widths, layout and
page sizes. It excludes selection, rows, errors and pending work. Controlled
values win over restored defaults. A persistent grid initially renders a loading
status on server and first client render, then mounts with restored defaults.
Storage failure falls back safely. Legacy list/cards page, visibility and view
keys are validated; list pagination takes precedence. Retired sort/filter models
are rejected. The internal persistence reset removes versioned and legacy keys;
a public reset-view control remains a follow-up acceptance item.

Row drag integration is temporarily absent from the migrated renderer while
M-18 now integrates bounded pointer/touch/keyboard/Move requests and cancellation.
See [reorder contracts](react-aria-grid-reorder.md) for the public rowDrag mapping.
True pinning, expansion, editing and spreadsheet features remain deferred per
[catalog contracts](react-aria-grid-contracts.md).

## Row reorder

The M-18 [reorder contracts](react-aria-grid-reorder.md) cover the public rowDrag
configuration and owned handle/helper. List mode uses the same state/identity
owner as selection and processing; cards mode has no reorder control.
