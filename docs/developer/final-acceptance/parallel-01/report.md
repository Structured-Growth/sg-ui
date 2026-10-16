# Public API snapshot and migration reconciliation

Assigned leaves: **A-B-05 partial; A-A-15 complete (mapping obligation only)**.
No shared checklist/count was changed. No production promotion is implied.

## Evidence boundary

Captured 2026-10-16 at 22:35 UTC on modified `dev`, HEAD
`540f47d4059a9cea8890b80927f34f51ef2fbc3e`. This describes the shared working
tree, not a clean committed release. The original hardening leaves require a
snapshot of props/callbacks/models/defaults/subpaths/deprecations (B-05) and seven
old-to-new mapping areas (A-15). Both were checked against their original wording
in `react-aria-scope-ledger.md`; its historical checked A-15 was not used as proof.

The [API snapshot](api-snapshot.json) extends, and explicitly references the hash
of, [FA-01](../2026-10-16-inventory.json). It reuses the saved 238 concrete routes
and their export lists without runtime imports or a repeated export inventory.
It stores 469 unique resolved contracts, exact text and hashes for all 370
reachable library declaration files, owned property types, callback call
signatures, JSDoc tags, and the route-to-contract relationships. Models, aliases,
function parameters and compound component declarations remain in exact text;
external React native-attribute declarations are referenced rather than copied.

All 370 declaration inputs match FA-01. All 423 included production TypeScript
source inputs also match FA-01. The source pass records 678 default/fallback
candidates with source lines and expressions; those include private defaults and
are **not** an exhaustive normalized public-default table. There are zero
`@deprecated` source tags and zero deprecated tags on resolved exports/owned
properties. Compatibility aliases are therefore not automatically deprecations.
The snapshot includes exact historical source for 12 relevant files from initial
extraction commit `21adebd61bedfc6a1ed395fe664ff4be83896821`; this is a local Git
comparison, not a new learner-platform checkout or upstream API reconstruction.

## A-A-15: completed mappings

Each row maps observed original local source to the current declaration/source.
Existing consumer guidance remains the primary guide; this table corrects its
ambiguous selection shorthand and separates removals from preserved contracts.

| Area | Original → current; compatibility consequence | Current source and existing mapping |
| --- | --- | --- |
| Theme objects | `/theme` exported `theme`, `lightTheme`, `darkTheme`; AppThemeProvider installed ThemeProvider/CssBaseline. Those object exports are absent. Import `/styles.css`, use Provider/ThemeScope `theme="light|dark|system"`, scoped `style` variables and `/tokens`; host owns body styles/reset. AppThemeProvider is preserved as the identical Provider export, not a deprecated alias. Theme-object consumers and global-reset assumptions require changes. | `packages/ui/src/theme/{index.ts,AppThemeProvider.tsx}`, `src/foundation/ThemeScope.tsx`, `src/experimental/Provider/Provider.tsx`; [theme mapping](../react-aria-theme.md) |
| Typography | Old primitive was an upstream reexport with bodyAlt2 augmentation. Current Typography owns `variant` (including bodyAlt2), independent semantic `as`, `tone`, `noWrap`, native attributes/ref. Default visual body1 renders a p with default tone. Replace `component` with allowed `as`, old color props with an appropriate owned tone, and augmentation/theme-object overrides with tokens. `tone="primary"` remains a compatibility spelling of accent; it is not deprecated. Arbitrary upstream props are removed, so preserving the name does not preserve the old prop contract. | `packages/ui/src/experimental/Typography/Typography.tsx`, `src/components/primitives/index.ts`; [primitive mapping](../react-aria-primitives.md) |
| Styling props | Original primitives were broad upstream reexports; AppModal had `paperSx`, grid had `sx`, engine props/slots and styling callbacks. Current declarations expose component-specific `className`, native `style`, refs and supported parts/scoped variables. AppModal surface `style` and `bodyClassName`/`bodyStyle` replace paper/body overrides. Stack `spacing` becomes `gap`; polymorphic `component` is replaced only where an owned `as` exists. No blanket passthrough or mechanical conversion of theme callbacks. These are breaking removals. | Exact primitive/modal/grid declarations in snapshot; [migration](../../migration.md), [primitive mapping](../react-aria-primitives.md), [modal mapping](../react-aria-modal-shells.md) |
| Modal callbacks | `onClose(event, reason)` becomes optional `onClose(reason)` with `escape|outside|close-button|dismiss`. Old explicit close falsely reported escapeKeyDown; current close-button is distinct. Map old escapeKeyDown→escape and backdropClick→outside; hosts must handle explicit close/dismiss independently. Action `onClick(event)`→`onPress()`, contained→filled, color→supported tone; event-dependent code needs a ref/host redesign. `maxWidth`/`fullWidth` are removed in favor of `size` and explicit width. Controlled open remains host-owned. | `packages/ui/src/components/AppModal/AppModal.tsx`, `src/experimental/Dialog/Dialog.tsx`; [modal mapping](../react-aria-modal-shells.md), [button mapping](../react-aria-button.md) |
| Selection | Original `AppGridRowSelectionModel` was an upstream alias; current alias is `Set<string>` with no engine include/exclude state. **Original `selection.selectedRowIds` already used Set<string>** and its one-argument change callback is preserved; current accepts ReadonlySet input, adds defaults/isRowSelectable and returns Set. Move `selection.getRowId`/`rowDrag.getRowId` to top-level getRowId. AppGridRowId becomes string; default numeric row.id normalizes to string, custom getRowId must return string. Missing/duplicate IDs become errors. Omitted original selection resolved to no convenience selection; current `selection=true` enables it by default. Pass selection=false to preserve omission behavior. No all-matching server selection replacement is supplied. | Original types/AppDataGrid/index files saved in snapshot; current `packages/ui/src/components/AppDataGrid/{types.ts,AppDataGrid.tsx,ownedGridModel.ts}`; [catalog mapping](../react-aria-catalog-grid.md) |
| Columns | Original AppDataGridColumn inherited GridColDef and helper returned GridColDef[] with an optional second header-sort options argument. Current owned column array/helper uses row callbacks and validation, returns AppDataGridColumn[], and removes the second argument. Migrate engine renderCell/valueGetter/valueFormatter/renderHeader contexts to declared getCellValue(row), formatValue(value,row), renderCustomCell(row) and grid-owned header sorting. Existing row-based getCellValue/renderCustomCell/getLink/getImageSrc/getMenuActions are retained. Menu action onClick(row)→onPress(row). Declare hidden fields explicitly; replace pinned with visibility lock/order (no sticky pinning). Numeric bounded widths/flex stay supported, with complete width snapshots and one eligible fill column. | `packages/ui/src/components/AppDataGrid/{types.ts,ownedGridColumns.ts,createDataGridColumns.tsx,createActionMenuColumn.ts}`; [catalog mapping](../react-aria-catalog-grid.md), [detailed contracts](../react-aria-grid-contracts.md) |
| Pagination | `{page,pageSize}` remains zero-based. Footer onPageChange(number)/onPageSizeChange(number) remain; size changes now request page zero **before** size. Optional onPaginationModelChange({page,pageSize}) supersedes both callbacks; the two legacy callback props remain required by the type. Unknown total/hasNextPage are additions. Grid onPaginationModelChange now takes only the owned record, without engine details; separate processing modes/sortModel become one client/server mode and ordered sortRules. Criteria reset pagination before criterion callbacks; onStateChange supplies one combined snapshot. Shell/card views share processing/page state. Old inferred temporary storage is replaced by explicit per-view persistence with controlled values authoritative. Footer normalizes invalid input without emitting during render. | `packages/ui/src/components/CardPaginationFooter/{CardPaginationFooter.tsx,pagination.ts}`, `src/experimental/Pagination/Pagination.tsx`, `src/components/AppDataGrid/{ownedGridController.ts,ownedGridState.ts}`; [pagination mapping](../react-aria-card-pagination.md), [catalog mapping](../react-aria-catalog-grid.md) |

Historical source paths above begin at repository-root `src/`; current short
`src/` paths in the source column are relative to `packages/ui`. All exact old
and new declaration/source hashes are retained in the snapshot/verification.

## A-B-05: substantial snapshot, partial closure

Props, callback types, models, subpaths and explicit deprecation metadata are
captured. Breaking changes above are evidenced by exact old/new local contracts,
not inferred merely from changed implementations. AppButton/AppButtonProps,
MuiLink/MuiLinkProps, FormControlLabel, SelectChangeEvent, AppGridSortModel and
theme object removals are consumer changes; the documented pre-first-release
AppButton consolidation does not establish that a released consumer ever had
that API. Typography primary, AppThemeProvider, existing Class names and existing
row-valued grid accessors are preserved, not implicitly deprecated. New optional
props and expanded unknown-total handling are additions. Existing component names
alone do not guarantee source compatibility.

Selected runtime defaults were manually reconciled:

| Scope | Current default/authority |
| --- | --- |
| ThemeScope | Root light/comfortable/auto; nested unspecified settings inherit. Provider bridges host locale. |
| Typography | variant=body1, as=p, tone=default. |
| Button | filled/primary, loading=false, type=button; density inherits scope. |
| AppModal | sm, heightMode=auto; escape/backdrop locks=false; showCloseButton=false. Primary action filled/primary, secondary text/neutral; actions compact; steps require at least two. |
| AppDataGrid | selection=true, hideFooter=false; initial page=0/pageSize=25, empty criteria and selected set unless controlled/default/persisted values apply; page-size suggestions 25/50/100. |
| Pagination | hasNextPage=false, disabled=false, boundary buttons=true, suggestions 25/50/100. Footer invalid size→25, invalid page→0, known page clamps; invalid/null/omitted count→unknown. |

The full original B-05 obligation remains partial: the candidate list has not
been manually classified for **every** public component/hook/helper, including
defaults expressed via contexts, state initialization, CSS and composition. The
initial extraction's inherited upstream APIs have not been recursively resolved
at their historical dependency versions. Consequently this is not an exhaustive
historical-to-current breaking-change manifest across all 469 current contracts.
Closing the leaf now would overstate these two uncovered areas.

## Checks and retained test evidence

Ran only the owned-directory capture and verifier, both successful:

```sh
node docs/developer/final-acceptance/parallel-01/capture-api.mjs
node docs/developer/final-acceptance/parallel-01/verify-api.mjs
```

[Verification](verification.json) records hashes for source guidance, transcripts
and ten relevant retained unit files: AppThemeProvider, Typography, public
primitives, AppModal, AppDataGrid, ownedGridColumns, createDataGridColumns,
ownedGridController, ownedGridState and CardPaginationFooter. All ten match
FA-02's inputs. FA-04's preserved baseline and four-file corrected delta are
reused; none of these ten was among its failed/changed files. The full original
check remains a failed command (four other files failed), followed by its
documented corrected affected rerun. This report does not reinterpret it as an
all-in-one passing run or rerun those tests for checklist credit. FA-04 package
evidence remains retained for public declaration/consumer type guards.

No shared output build, dependency install, behavioral test, broad suite,
browser/device/AT check, server operation, staging/commit/push or release action
was performed. Static source/default inspection is not runtime conformance.
Twenty editor V leaves remain outside this mapping work and remain open.

## Specific successors

1. **A-B-05-defaults:** Use snapshot routes/contracts to produce a public-symbol
   default table, classify the 678 candidates, and follow omitted defaults through
   context/state/CSS/composed children. Review every public component/hook/helper,
   recording no-default/not-applicable explicitly. Keep source refs and hashes;
   do not rerun unchanged FA-01 export/package checks.
2. **A-B-05-breaking:** Build a bounded historical contract closure at initial
   extraction commit and locked dependency versions without mutating this shared
   checkout. Compare public props/callbacks/models/helpers/subpaths with this
   snapshot; classify preserved/additive/removal/changed semantics. Check all
   mapped consumers and link each intentional breaking change to migration
   guidance; release-marker validation remains a separate authorized gate.
3. **Mapping guidance maintenance:** Add the selection distinction and default
   change to `react-aria-catalog-grid.md`/adoption guidance: an old caller omitting
   selection should use selection=false to retain its presentation; existing
   selection.selectedRowIds Set callers need no include/exclude conversion.
   Also retire stale statements that root imports or ContentEditorChrome remain
   unmigrated in older button/modal/card guides; preserve those as explicitly
   dated historical notes if retained. This report makes the current mapping
   reviewable without editing shared guidance during concurrent work.

Reproduce the selection-default finding read-only with
`git show 21adebd:src/components/AppDataGrid/AppDataGrid.tsx` (resolvedSelection)
and current `packages/ui/src/components/AppDataGrid/AppDataGrid.tsx` (Grid's
selection=true binding). This is a documented compatibility difference, not a
claim of a newly introduced runtime defect.
