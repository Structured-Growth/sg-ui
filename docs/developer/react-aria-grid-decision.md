# Grid integration decision and parity proof

Tasks: P-06/P-09, G-01/G-25, A-18, L-06. Status: engine decision recorded; catalog migration in progress.
The [catalog capability and state contracts](react-aria-grid-contracts.md) complete
the G-01–G-03 design review and distinguish required parity, selected integration
enhancements and deferred features. Runtime G acceptance remains open.

Use TanStack Table 8.21.3 for row processing and React Aria Components 1.21.1 for
interaction. SGUI owns the columns, state and callbacks. The implementation is
now used by the public catalog grid as well as the experimental proof. Version 8 is
deliberately pinned to the documented v8 row-model API; this is not a claim that
it is the latest major. Evaluate major upgrades separately against these tests.

## Candidate comparison

| Required capability | React Aria Table alone | TanStack alone | Combined proof |
| --- | --- | --- | --- |
| Filtering and search before sort/page | Host must provide row processing | Headless row-model support; filter semantics still owned | SGUI filtering before TanStack sorting/page |
| Multiple sorting rules | Standard interaction sort descriptor has one column | Ordered multi-sort row model | One SGUI sort array; tested priority order |
| Server rows/page/unknown total | Host supplied collections | Manual sorting/pagination | No client processing of server rows; owned next-page flag |
| Page selection and retained IDs | Collection selection interaction | Headless selection state | SGUI IDs mapped only to React Aria; no TanStack selection model |
| Keyboard focus/cell interaction | Interaction grid implementation | Consumer implementation required | React Aria alone owns focus and collection interaction |
| Column visibility/locking | Consumer collection composition | Headless visibility state | SGUI visibility; first data column locked; collection dependencies invalidate cached cells |
| Width and keyboard resize | Resizable container and column resizers | Width model; interaction must be implemented | React Aria resize events mapped to SGUI numeric widths |
| Actions and non-drag reordering | Consumer composition | Consumer composition | Owned render callback, before/after reorder request |
| Pointer/touch/keyboard drag | Collection drag hooks available | Separate interaction implementation required | Collection drag wired; keyboard drop/cancel verified, pointer/touch matrix open |
| Virtualization | Separate integration required | Separate renderer required | Not enabled by this prototype; no performance claim |

The existing catalog is the parity baseline: the old engine clamps its native sort
model to one rule, while toolbar rules can represent more. Row selection is an
explicit ID set; header selection operates on loaded rows. The prototype adds
explicit page semantics and preserves IDs across page changes. It does not claim
that an unknown server dataset can be selected by enumerating loaded IDs.

## Authoritative ownership

| Concern | Owner |
| --- | --- |
| Public state (search/filter/sort/page/IDs/visibility/width) | SGUI state or controlled host state |
| Client filter semantics | SGUI pure row-processing helper |
| Client stable sorting and pagination | TanStack row models, reading SGUI state |
| Server data processing, fetching and stale responses | Host |
| Focus, ARIA collection semantics, checkbox interaction, resizing gesture | React Aria |
| Committed column widths | SGUI numeric width record |
| Reorder persistence and optimistic reconciliation | Host |
| Virtualization | SGUI rendering layer; disabled until workload evidence establishes a need |

No upstream state/column/event types are exported. A controlled host receives
the entire next owned state; an uncontrolled instance commits it locally. Search
and sort reset page zero before emitting a request. Multiple independent instances
do not share state. Persistence will be optional and schema validated.

Reordering currently requires a complete unsorted/unfiltered dataset on one page,
with at most one selected row. Multiple-row batch moves are not part of this proof.
Buttons provide a keyboard and non-drag alternative. The host receives a request,
not a silently mutated array. Keyboard drag/drop and cancellation announcements
were verified in-browser; resizing required Enter activation before arrows changed
the width from 180px to 190px. Pointer/touch matrix verification,
full filter-menu parity, card switching, sort metadata announcements, disabled
rows, persistence and refresh focus retention remain required migration work.

Both TanStack packages use MIT licenses with no commercial feature tier in this
integration. SGUI's commercial license remains authoritative for SGUI-owned code;
third-party code retains its own license. No enterprise grid dependency is added.

Primary API evidence: [React Aria Table](https://react-aria.adobe.com/Table),
[React Aria drag and drop](https://react-aria.adobe.com/dnd),
[TanStack v8 sorting](https://tanstack.com/table/v8/docs/guide/sorting), and the
installed version's declarations and licenses. Behavioral evidence is colocated
in `src/experimental/DataGrid/DataGrid.test.tsx`; baseline performance budgets and
full browser/assistive-technology validation remain open.
