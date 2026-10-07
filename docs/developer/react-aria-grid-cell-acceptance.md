# Grid cell and helper migration evidence

Task references: M-40 and M-41. These component migration requirements are
implemented with owned contracts. This record reconciles the source, public
composition and behavior tests; it does not close the broad grid, browser,
screen-reader, touch, zoom or performance gates.

The supported package surface is `AppDataGridColumn.cellType` through
`AppDataGrid`, `createDataGridColumns`, `createActionMenuColumn`, `RowSubHeader`,
and `buildDataToolbarColumnOptions`. Standalone named cell wrappers and the
header/status helper modules are source implementation modules, not separately
exported package subpaths. Consumers should use the supported grid columns rather
than import `dist` internals. All presentation passes through the owned cell
implementation, regardless of whether it is exercised through a named source
wrapper or the public grid.

## M-40 cell coverage

| Required cell | Concrete implementation and assertions |
| --- | --- |
| Text | `ownedGridCells.tsx` renders React text, preserves a full-value title and handles null/empty/false values. `tableCellPrimitives.test.tsx` verifies escaped markup, full multiline content, host title and the truncation opt-out. |
| Date | `ownedGridCells.test.tsx` rejects invalid calendar days and preserves date-only values in UTC even when a host zone differs; source-wrapper tests verify locale and formatter context. |
| Date-time | `AppDataGrid.cells.test.tsx` displays a valid UTC instant in the requested host zone. Source-wrapper tests verify the original instant and date-time context reach the host formatter. Invalid and timezone-less inputs fall back in `ownedGridCells.test.tsx`. |
| Link | `ownedGridCells.test.tsx` and `AppDataGrid.cells.test.tsx` verify the host navigation adapter receives one request. Source-wrapper tests verify target and safe `_blank` rel metadata. Full accessible labels and abbreviation titles survive display truncation; absent href renders a full-value text fallback. |
| Copyable | `ownedGridCells.test.tsx` covers clipboard success/failure announcements, empty-value disabling and stale asynchronous completion after a value change. Public-grid composition verifies the exact copied string and no incidental selection. |
| JSON | React text escaping is asserted for HTML-like payloads; cyclic values and BigInt use a safe fallback in `ownedGridCells.test.tsx`. Public-grid composition verifies JSON display without inserting its HTML-like content. |
| Image | Owned and source-wrapper tests fire a real image error event, check the fallback, and retry when source changes. Public-grid composition preserves the row's accessible image description. |
| Action menu | `TableCellMenu.test.tsx` and owned tests verify one callback with the original generic row, pending/unavailable disabling, native link metadata and focus restoration. Public-grid composition verifies the same callback/focus contract without selecting its row. |
| Custom | Owned tests verify the original row reaches `renderCustomCell`; public-grid composition renders an owned Button whose callback receives that row once without changing selection. |
| Fallback | Source-wrapper and public-grid tests cover declared fallback text. Owned tests cover null/empty/unsupported values and cyclic JSON without unescaped markup. |

The audit found and repaired an actual parity gap: `TextTableCell` accepted
`truncate` but discarded it. The shared cell now defaults to ellipsis and uses
`white-space: pre-wrap` plus `overflow-wrap: anywhere` for `truncate={false}`.
The owned column contract also exposes `truncate: false` so supported package
consumers can request multiline display. Text, date, date-time, JSON, copyable and
link display share that presentation choice. Full text remains in the DOM and
in its title in either mode; the flag does not change processing or callbacks.

`AppDataGrid.cells.test.tsx` composes all nine cell types plus fallback inside the
real public grid. It verifies nested link, clipboard, custom and menu actions
remain independent of row selection. Its second test proves raw numeric accessors
determine ordering even when formatted display reverses the apparent numbers, and
that both callbacks receive the original unconstrained rows.

## M-41 helper and part coverage

| Requirement | Concrete evidence |
| --- | --- |
| Grid subheaders | `components/RowSubHeader.test.tsx` imports the preserved public name and verifies controlled expand/collapse requests, keyboard title editing, double-click editing, independent trailing actions, native ref and translated labels. |
| Empty/loading overlays | `ownedGridParts.test.tsx` distinguishes loading, retained-row refresh, empty, no results and host error; it checks live/status roles, progressbar naming and keyboard retry. `tableCellPrimitives.test.tsx` exercises both named overlay wrappers. |
| Column builder | `createDataGridColumns.test.tsx` verifies cloned owned definitions, original-row accessors and rejection of duplicate/reserved fields or invalid sizing. `ownedGridColumns.test.ts` covers field locks, actions-last layout, numeric width bounds and flex allocation. |
| Action-menu builder | `createActionMenuColumn.test.ts` verifies owned action definitions, locked/visible/actions-last behavior, no retired pinned/header-class metadata, generic callback rows and validated host width bounds. |
| Toolbar option builder | `DataToolbar/buildColumnOptions.test.ts` verifies explicit-only fields by default, canonical actions locked/visible/last, declared visibility, host labels, generated-label fallback and explicitly requested inference. Its API does not expose the retired engine. |
| Header sort menu | `components/RowSubHeader.test.tsx` also imports the named header menu and tests keyboard asc/desc/clear requests, checked state, Escape cancellation, unavailable activation and trigger focus. `ownedGridColumns.test.ts` verifies promotion into canonical ordered rules. |

The existing foundation check registers the entire `AppDataGrid` and `DataToolbar`
directories and audits implementation dependencies transitively. The package
check audits their generated declarations. These checks guard owned boundaries;
they do not replace the behavior assertions above.

## Validation and remaining acceptance

The focused run passes 10 files and 33 tests:

```sh
pnpm exec vitest run src/components/AppDataGrid/AppDataGrid.cells.test.tsx src/components/AppDataGrid/components/table-cell src/components/AppDataGrid/ownedGridCells.test.tsx src/components/AppDataGrid/components/RowSubHeader.test.tsx src/components/AppDataGrid/components/header src/components/AppDataGrid/createActionMenuColumn.test.ts src/components/AppDataGrid/createDataGridColumns.test.tsx src/components/DataToolbar/buildColumnOptions.test.ts
```

`Migration proofs/Catalog grid cells` includes `PublicTextWrapping` for named
source wrappers and `ColumnTextWrapping` for supported public column integration.
Native computed-style/size checks are needed to verify wrapping and ellipsis:
jsdom tests establish content/prop forwarding but cannot prove pixel clipping.
These stories reuse production scopes, typography and tokens, including dark mode.
Clipboard unit tests exercise the browser API boundary, not OS permission dialogs.
Native downloads, complete browser support, pointer/touch reorder, screen-reader
announcements and performance remain separately tracked acceptance work.

See [catalog contracts](react-aria-grid-contracts.md) and
[public integration](react-aria-catalog-grid.md) for the complete grid contract.

Native IAB verification against the rebuilt static stories confirms default
ellipsis at 208px content width (scroll width 932px, one 25.59px line), and the
same complete content wrapping at 208px (scroll width 208px, 153.56px height).
The supported public column story wraps at 224px content width and 102.38px
height. Dark rendering preserves readable text and the same layout. No browser
warning/error logs were observed. Screenshot: `/tmp/sgui-cell-wrapping.png`.
This checks a representative desktop browser, not the full browser matrix.
