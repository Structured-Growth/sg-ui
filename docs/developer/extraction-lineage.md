# Extraction and example lineage

This reconciliation distinguishes the recorded upstream source, local extracted
files, later owned contracts and the docs-native replacement host. The upstream
identity remains `Structured-Growth/learning-platform`, commit
`8e63f1e16fc3d43d851908b312603a1099ca13d9`, root `apps/web/src/ui`.
That commit object is unavailable in this SGUI repository. No learner-platform
checkout or remote was accessed. Local extraction history is evidence of local
contents; it does not independently authenticate upstream bytes or behavior.

The [extraction manifest](../extraction-manifest.json) retains all 201 source and
destination pairs in original order. Historical `src/` destinations resolve under
`packages/ui`. The 2026-10-16 audit finds 159 present and 42 absent destinations,
zero presence mismatches and no missing replacement paths. These are a dated
working-tree inventory, not permanent thresholds or runtime acceptance.

## AppButton replacement

Initial local extraction `21adebd61bedfc6a1ed395fe664ff4be83896821` stores
`src/components/AppButton/AppButton.stories.tsx` as blob
`55e160e15e974ffa4e9814724aa1223b84aed6d8`. It exports Default and Variants.
Owned migration `8f41479c6f2ea5822ff0c149e359e2c6e0893f13` stores blob
`81d785a261d4b1a61b17939a682ce9a23e783039`, adding PendingAndDisabled and
NativeForm. That exact story blob remains at the parent of docs-workspace
migration `530bbc00465d9dbf1e9948f8a2c01b2e51b1a479`.

| Local story export | Deliberate successor | Disposition |
| --- | --- | --- |
| Default | [ButtonOverview](../../apps/docs/examples/ButtonDocumentation.tsx) | Continue label retained. Initial contained/color maps to owned filled/tone. |
| Variants | ButtonReference in the same public module | Filled primary, outlined secondary and text action panels replace contained/outlined/text. Labels change; the old foundation prop contract is retired. |
| PendingAndDisabled | [ThemesAndDensity](../../apps/docs/native-fixtures/scenarios/experimental/Button/Button.fixture.tsx) | Dark pending, disabled and compact outlined combinations remain, with additional light and comfortable combinations. |
| NativeForm | ButtonForm in the public module; NativeFormTransitions in the private fixture | Explicit submit and default non-submit behavior have retained unit assertions. Public form adds reset; submitted label deliberately replaces the historical Saved-count diagnostic. Event probes stay private. |

None of these inspected local story versions contains a play property or
expect/assert call. There is no story assertion to invent or mark as executed.
The pre-docs `AppButton.test.tsx` blob
`8cb45f5dc1932702ca7a2fba6a4e3718173856dd` is byte-identical to
[Button.public-contract.test.tsx](../../packages/ui/src/components/Button/Button.public-contract.test.tsx)
after substituting AppButton with Button. Its four cases retain pointer/Enter/Space
callback count and native ref/default type, disabled/pending suppression with
pending focus, explicit native submit, and server attributes/decorative slots.
This is source assertion continuity, not a fresh runtime test result.

The [native migration manifest](../../apps/docs/native-fixtures/migration-manifest.json)
continues to map the experimental Button story to its fixture. AppButton's
many-to-one deliberate replacement is recorded in the extraction manifest rather
than registered as a second copy of that fixture. Existing fixture IDs and registry
generation stay unchanged. Commit `540f47d4059a9cea8890b80927f34f51ef2fbc3e`
explicitly records the breaking removal of AppButton/AppButtonProps. Use
Button/ButtonProps; do not restore the removed aliases or Storybook.

## Original story modules

All 33 story paths in the extraction manifest exist in the initial local
extraction and the pre-docs-migration Git tree. The latter has 32 exact module
destinations in the docs-native migration manifest, plus AppButton's deliberate
replacement above. All exported scenario names in those 32 pre-docs modules
remain in their fixtures. Both inspected generations of the 33 local story
modules contain zero play properties and zero expect/assert calls. This does
not cover imported helper assertions, browser specs, deleted intermediate Git
versions or upstream repository contents.

| Extracted story path relative to src/ | Docs-native replacement |
| --- | --- |
| `components/AppButton/AppButton.stories.tsx` | [AppButton disposition above](#appbutton-replacement) |
| `components/AppDataGrid/AppDataGrid.stories.tsx` | [AppDataGrid.fixture.tsx](../../apps/docs/native-fixtures/scenarios/components/AppDataGrid/AppDataGrid.fixture.tsx) |
| `components/AppDataGridRowDnd/DataGridDragHandle.stories.tsx` | [DataGridDragHandle.fixture.tsx](../../apps/docs/native-fixtures/scenarios/components/AppDataGridRowDnd/DataGridDragHandle.fixture.tsx) |
| `components/AppDataGridShell/AppDataGridShell.stories.tsx` | [AppDataGridShell.fixture.tsx](../../apps/docs/native-fixtures/scenarios/components/AppDataGridShell/AppDataGridShell.fixture.tsx) |
| `components/AppInlineProgress/AppInlineProgress.stories.tsx` | [AppInlineProgress.fixture.tsx](../../apps/docs/native-fixtures/scenarios/components/AppInlineProgress/AppInlineProgress.fixture.tsx) |
| `components/AppModal/AppModal.stories.tsx` | [AppModal.fixture.tsx](../../apps/docs/native-fixtures/scenarios/components/AppModal/AppModal.fixture.tsx) |
| `components/AppOperationSteps/AppOperationSteps.stories.tsx` | [AppOperationSteps.fixture.tsx](../../apps/docs/native-fixtures/scenarios/components/AppOperationSteps/AppOperationSteps.fixture.tsx) |
| `components/AppPageHeader/AppPageHeader.stories.tsx` | [AppPageHeader.fixture.tsx](../../apps/docs/native-fixtures/scenarios/components/AppPageHeader/AppPageHeader.fixture.tsx) |
| `components/AppPageTabs/AppPageTabs.stories.tsx` | [AppPageTabs.fixture.tsx](../../apps/docs/native-fixtures/scenarios/components/AppPageTabs/AppPageTabs.fixture.tsx) |
| `components/AppShell/AppShell.stories.tsx` | [AppShell.fixture.tsx](../../apps/docs/native-fixtures/scenarios/components/AppShell/AppShell.fixture.tsx) |
| `components/AuthShell/AuthShell.stories.tsx` | [AuthShell.fixture.tsx](../../apps/docs/native-fixtures/scenarios/components/AuthShell/AuthShell.fixture.tsx) |
| `components/CardPaginationFooter/CardPaginationFooter.stories.tsx` | [CardPaginationFooter.fixture.tsx](../../apps/docs/native-fixtures/scenarios/components/CardPaginationFooter/CardPaginationFooter.fixture.tsx) |
| `components/ClassCardFrame/ClassCardFrame.stories.tsx` | [ClassCardFrame.fixture.tsx](../../apps/docs/native-fixtures/scenarios/components/ClassCardFrame/ClassCardFrame.fixture.tsx) |
| `components/ColumnsLayoutModal/ColumnsLayoutModal.stories.tsx` | [ColumnsLayoutModal.fixture.tsx](../../apps/docs/native-fixtures/scenarios/components/ColumnsLayoutModal/ColumnsLayoutModal.fixture.tsx) |
| `components/ContentEditorChrome/ContentEditorChrome.stories.tsx` | [ContentEditorChrome.fixture.tsx](../../apps/docs/native-fixtures/scenarios/components/ContentEditorChrome/ContentEditorChrome.fixture.tsx) |
| `components/DataToolbar/DataToolbar.stories.tsx` | [DataToolbar.fixture.tsx](../../apps/docs/native-fixtures/scenarios/components/DataToolbar/DataToolbar.fixture.tsx) |
| `components/DocumentEditorLayout/DocumentEditorLayout.stories.tsx` | [DocumentEditorLayout.fixture.tsx](../../apps/docs/native-fixtures/scenarios/components/DocumentEditorLayout/DocumentEditorLayout.fixture.tsx) |
| `components/DocumentEditorToolbar/DocumentEditorToolbar.stories.tsx` | [DocumentEditorToolbar.fixture.tsx](../../apps/docs/native-fixtures/scenarios/components/DocumentEditorToolbar/DocumentEditorToolbar.fixture.tsx) |
| `components/EditableTitleField/EditableTitleField.stories.tsx` | [EditableTitleField.fixture.tsx](../../apps/docs/native-fixtures/scenarios/components/EditableTitleField/EditableTitleField.fixture.tsx) |
| `components/FloatingTextSelectionToolbar/FloatingTextSelectionToolbar.stories.tsx` | [FloatingTextSelectionToolbar.fixture.tsx](../../apps/docs/native-fixtures/scenarios/components/FloatingTextSelectionToolbar/FloatingTextSelectionToolbar.fixture.tsx) |
| `components/ImageUploadModal/ImageUploadModal.stories.tsx` | [ImageUploadModal.fixture.tsx](../../apps/docs/native-fixtures/scenarios/components/ImageUploadModal/ImageUploadModal.fixture.tsx) |
| `components/InsertContentMenuControl/InsertContentMenuControl.stories.tsx` | [InsertContentMenuControl.fixture.tsx](../../apps/docs/native-fixtures/scenarios/components/InsertContentMenuControl/InsertContentMenuControl.fixture.tsx) |
| `components/InstructorClassCard/InstructorClassCard.stories.tsx` | [InstructorClassCard.fixture.tsx](../../apps/docs/native-fixtures/scenarios/components/InstructorClassCard/InstructorClassCard.fixture.tsx) |
| `components/LearnerClassCard/LearnerClassCard.stories.tsx` | [LearnerClassCard.fixture.tsx](../../apps/docs/native-fixtures/scenarios/components/LearnerClassCard/LearnerClassCard.fixture.tsx) |
| `components/LearnerClassesDataGrid/LearnerClassesDataGrid.stories.tsx` | [LearnerClassesDataGrid.fixture.tsx](../../apps/docs/native-fixtures/scenarios/components/LearnerClassesDataGrid/LearnerClassesDataGrid.fixture.tsx) |
| `components/LinkUrlModal/LinkUrlModal.stories.tsx` | [LinkUrlModal.fixture.tsx](../../apps/docs/native-fixtures/scenarios/components/LinkUrlModal/LinkUrlModal.fixture.tsx) |
| `components/PageRichTextEditorSection/PageRichTextEditorSection.stories.tsx` | [PageRichTextEditorSection.fixture.tsx](../../apps/docs/native-fixtures/scenarios/components/PageRichTextEditorSection/PageRichTextEditorSection.fixture.tsx) |
| `components/RichTextFormattingToolbar/RichTextFormattingToolbar.stories.tsx` | [RichTextFormattingToolbar.fixture.tsx](../../apps/docs/native-fixtures/scenarios/components/RichTextFormattingToolbar/RichTextFormattingToolbar.fixture.tsx) |
| `components/SideNavigation/SideNavigation.stories.tsx` | [SideNavigation.fixture.tsx](../../apps/docs/native-fixtures/scenarios/components/SideNavigation/SideNavigation.fixture.tsx) |
| `components/TextAlignMenuControl/TextAlignMenuControl.stories.tsx` | [TextAlignMenuControl.fixture.tsx](../../apps/docs/native-fixtures/scenarios/components/TextAlignMenuControl/TextAlignMenuControl.fixture.tsx) |
| `components/TextColorPickerControl/TextColorPickerControl.stories.tsx` | [TextColorPickerControl.fixture.tsx](../../apps/docs/native-fixtures/scenarios/components/TextColorPickerControl/TextColorPickerControl.fixture.tsx) |
| `components/TextStyleMenuControl/TextStyleMenuControl.stories.tsx` | [TextStyleMenuControl.fixture.tsx](../../apps/docs/native-fixtures/scenarios/components/TextStyleMenuControl/TextStyleMenuControl.fixture.tsx) |
| `components/Typefaces/Typefaces.stories.tsx` | [Typefaces.fixture.tsx](../../apps/docs/native-fixtures/scenarios/components/Typefaces/Typefaces.fixture.tsx) |

## Earlier grid scenario semantic dispositions

The original extraction commit `21adebd61bedfc6a1ed395fe664ff4be83896821`
contains nine AppDataGrid and seven AppDataGridShell render scenarios that were
removed before docs migration. Their source blobs remain
`c48a4fe9c44d053b2c1a6f94ec42cb9e39885d17` and
`97a4167ffe228c17d60ae9382f82e2f8ad7a380b`; no original module is restored.
Neither original module has a play function or executable scenario assertions.
The following dispositions compare actual source behavior with current host code
and assertion bodies, rather than equating export names.

[Machine-readable records](../../apps/docs/native-fixtures/scenario-dispositions.json)
retain each original file SHA-256, Git source/export location, behavioral changes,
remaining gaps, and current fixture/example/test claims with checked source anchors.
The provenance guard rejects unknown/duplicate rows, original hash drift, missing
hosts, stale anchors, and missing assertion evidence. An explicit gap remains
unresolved under `--strict-history`; structural resolution is not browser parity
or acceptance of B12/W10. Those decisions remain with the coordinator.

| Original scenario | Original behavior | Current source and assertions | Explicit disposition / gaps |
| --- | --- | --- | --- |
| Grid: `AllColumnTypes` | Nine columns: text, custom status/name chip, image, copyable email, native profile link, date, dateTime, JSON and action menu. | [ownedGridCells.fixture.tsx](../../apps/docs/native-fixtures/scenarios/components/AppDataGrid/ownedGridCells.fixture.tsx): All nine cell implementations are composed with representative valid/invalid/fallback data. [AppDataGrid.cells.test.tsx](../../packages/ui/src/components/AppDataGrid/AppDataGrid.cells.test.tsx): Actual AppDataGrid renders dates/JSON/image fallback, routes once, copies, and invokes custom/menu callbacks without selecting the row. | Represented by current owned contracts with representative data. No remaining implementation gap identified. |
| Grid: `BuiltInCheckboxAndRowDragHandle` | Host maintains both selected ID Set and row order so selection follows identity after accepted reorder. | [AppDataGrid.fixture.tsx](../../apps/docs/native-fixtures/scenarios/components/AppDataGrid/AppDataGrid.fixture.tsx): Sectioned host supplies controlled selected IDs and accepted activity order. [AppDataGrid.sectioned-lineage.test.tsx](../../packages/ui/src/components/AppDataGrid/AppDataGrid.sectioned-lineage.test.tsx): Selected hidden children remain selected after reopen/reorder; section drag sources are disabled and accepted order is asserted. | Representative data is sectioned; selected-ID/order behavior remains. Owned reorder is available only on a complete, unprocessed client page with at most one selected row; module sources are non-draggable. No remaining implementation gap identified. |
| Grid: `BuiltInCheckboxSelection` | Host Set seeded with first row ID drives built-in checkboxes and accepts onSelectedRowIdsChange. | [AppDataGrid.fixture.tsx](../../apps/docs/native-fixtures/scenarios/components/AppDataGrid/AppDataGrid.fixture.tsx): Host supplies selected IDs and callback, including retained off-page and disabled rows. [AppDataGrid.test.tsx](../../packages/ui/src/components/AppDataGrid/AppDataGrid.test.tsx): Select-page updates preserve retained IDs and exclude unavailable rows. | Represented by current owned contracts with representative data. No remaining implementation gap identified. |
| Grid: `BuiltInRowDragHandle` | Drag-only host accepts before/after reorder requests into its local row array; source row label supplies accessible name. | [AppDataGrid.fixture.tsx](../../apps/docs/native-fixtures/scenarios/components/AppDataGrid/AppDataGrid.fixture.tsx): Host owns accepted row order and optional persistence/rollback; selection is explicitly absent in drag-only successor. [AppDataGrid.reorder.test.tsx](../../packages/ui/src/components/AppDataGrid/AppDataGrid.reorder.test.tsx): Unselected grid emits exact before/after requests and leaves order unchanged until host accepts. | Pointer drag now has explicit keyboard/Move alternatives and owned processing safety policy; the drag-only private successor passes selection=false. No remaining implementation gap identified. |
| Grid: `HeaderSortHookedUp` | Host sortRules and legacy sortModel track one ordered string criterion and recompute displayed rows on header sort. | [ownedGridSortAcceptance.fixture.tsx](../../apps/docs/native-fixtures/scenarios/components/AppDataGrid/ownedGridSortAcceptance.fixture.tsx): Current controlled sort state requests host acceptance; accepted rows use shared processing. [AppDataGrid.test.tsx](../../packages/ui/src/components/AppDataGrid/AppDataGrid.test.tsx): Header activation resets pagination before requesting owned sort rules; resulting first page is asserted. | Legacy sortModel duplication is removed; owned sortRules are canonical. Current shared processing and controlled acceptance cover header and toolbar sorting, page reset and rejected requests. No remaining implementation gap identified. |
| Grid: `ListOnly` | Default rows and ID/name/status/action columns render in a bounded standalone list; no explicit selection or reorder configuration. | [AppDataGrid.fixture.tsx](../../apps/docs/native-fixtures/scenarios/components/AppDataGrid/AppDataGrid.fixture.tsx): Native default grid renders representative text/status/action columns with owned paging. [AppDataGrid.test.tsx](../../packages/ui/src/components/AppDataGrid/AppDataGrid.test.tsx): Native table/ref and real page transition assertions replace a render-only baseline. | The owned grid defaults to selection enabled under current documented UX. The unselected composition remains explicit in the new plain-section fixture/tests; MUI chip styling is replaced with owned text/custom-cell contracts. No remaining implementation gap identified. |
| Grid: `SectionedDropdownRows` | Module rows render RowSubHeader toggles; host hides/reveals only matching activities; description/status/random fields and per-kind destinations remain. | [AppDataGrid.fixture.tsx](../../apps/docs/native-fixtures/scenarios/components/AppDataGrid/AppDataGrid.fixture.tsx): Plain sectioned grid has host-filtered child visibility without selection or drag utilities. [AppDataGrid.sectioned-lineage.test.tsx](../../packages/ui/src/components/AppDataGrid/AppDataGrid.sectioned-lineage.test.tsx): Both plain grid and shell hide only the collapsed section and restore children; no utility columns are present. | Removed MUI sx/getRowClassName decorations are not reintroduced. Owned RowSubHeader and columns supply the section presentation; unfiltered visible order uses client mode, while host criteria use server pass-through to keep section-header filter exceptions. No remaining implementation gap identified. |
| Grid: `SectionedDropdownRowsWithCheckboxAndDrag` | Host combines collapsed module Set, complete row order and selected IDs; only activities can start reorder; hidden children retain identity. | [AppDataGrid.fixture.tsx](../../apps/docs/native-fixtures/scenarios/components/AppDataGrid/AppDataGrid.fixture.tsx): Sectioned host supplies controlled selected IDs and accepted activity order. [AppDataGrid.sectioned-lineage.test.tsx](../../packages/ui/src/components/AppDataGrid/AppDataGrid.sectioned-lineage.test.tsx): Selected hidden children remain selected after reopen/reorder; section drag sources are disabled and accepted order is asserted. | Owned reorder requires a complete unprocessed client page and at most one selected row. Module styling uses owned RowSubHeader rather than legacy class selectors. No remaining implementation gap identified. |
| Grid: `StructuredCellTypes` | Structured image fallback, labelled/abbreviated profile link, copyable email, date/dateTime, JSON and row action menu. | [ownedGridCells.fixture.tsx](../../apps/docs/native-fixtures/scenarios/components/AppDataGrid/ownedGridCells.fixture.tsx): All nine cell implementations are composed with representative valid/invalid/fallback data. [AppDataGrid.cells.test.tsx](../../packages/ui/src/components/AppDataGrid/AppDataGrid.cells.test.tsx): Actual AppDataGrid renders dates/JSON/image fallback, routes once, copies, and invokes custom/menu callbacks without selecting the row. | Represented by current owned contracts with representative data. No remaining implementation gap identified. |
| Shell: `CardsAndListModes` | Host provides card body/name/email/status/Open action and starts in cards mode while retaining list availability. | [AppDataGridShell.fixture.tsx](../../apps/docs/native-fixtures/scenarios/components/AppDataGridShell/AppDataGridShell.fixture.tsx): Host card rendering and initial card view coexist with list mode on shared criteria/footer. [AppDataGridShell.test.tsx](../../packages/ui/src/components/AppDataGridShell/AppDataGridShell.test.tsx): Switching list/cards retains current page and selection with exactly one footer. | Native current representative card content/routes replace historical sample learner data and MUI surfaces; view/criteria/selection/footer ownership remains shared. No remaining implementation gap identified. |
| Shell: `CollapsableSubheaders` | Shell combines section collapse, selection/clear/count, activity reorder, host name/description search, status enum filters, columns and refresh resetting all local host state. | [AppDataGridShell.fixture.tsx](../../apps/docs/native-fixtures/scenarios/components/AppDataGridShell/AppDataGridShell.fixture.tsx): Complete host-owned section operations are a private shell successor. [AppDataGrid.sectioned-lineage.test.tsx](../../packages/ui/src/components/AppDataGrid/AppDataGrid.sectioned-lineage.test.tsx): Host clear selection/search/refresh act on real row presentation, clear criteria and restore data; no debug-state parity assertion. | Owned controls replace MUI sx decorations and legacy callbacks. Active search/filter, partial pages or multiple selected rows disable reorder under the shipped safety policy; the host owns the complete unfiltered order. No remaining implementation gap identified. |
| Shell: `ListOnlyNoCheckboxes` | Server-mode shell renders list without selection; toolbar columns are supplied while search/filter/sort controls are disabled. | [AppDataGrid.fixture.tsx](../../apps/docs/native-fixtures/scenarios/components/AppDataGrid/AppDataGrid.fixture.tsx): Plain sectioned grid has host-filtered child visibility without selection or drag utilities. [AppDataGrid.sectioned-lineage.test.tsx](../../packages/ui/src/components/AppDataGrid/AppDataGrid.sectioned-lineage.test.tsx): Both plain grid and shell hide only the collapsed section and restore children; no utility columns are present. [ownedGridSortAcceptance.fixture.tsx](../../apps/docs/native-fixtures/scenarios/components/AppDataGrid/ownedGridSortAcceptance.fixture.tsx): An existing plain controlled-sort shell also explicitly disables selection. | Tool visibility is host-configurable instead of a separately named static story; no-checkbox behavior is tested for both public grid and shell in the new private host. No remaining implementation gap identified. |
| Shell: `ListWithCheckboxes` | Host selected ID Set drives shell checkboxes; selected toolbar count and Clear reset local selection without mutating rows. | [AppDataGridShell.fixture.tsx](../../apps/docs/native-fixtures/scenarios/components/AppDataGridShell/AppDataGridShell.fixture.tsx): Complete host-owned section operations are a private shell successor. [AppDataGrid.sectioned-lineage.test.tsx](../../packages/ui/src/components/AppDataGrid/AppDataGrid.sectioned-lineage.test.tsx): Host clear selection/search/refresh act on real row presentation, clear criteria and restore data; no debug-state parity assertion. [AppDataGridShell.test.tsx](../../packages/ui/src/components/AppDataGridShell/AppDataGridShell.test.tsx): Switching list/cards retains current page and selection with exactly one footer. | Built-in selected count replaces a duplicated custom count; a host Clear selection action is retained in the private successor. No remaining implementation gap identified. |
| Shell: `ListWithRowDragDrop` | Shell drag requests are accepted into local row order, retaining all toolbar/list composition. | [AppDataGrid.fixture.tsx](../../apps/docs/native-fixtures/scenarios/components/AppDataGrid/AppDataGrid.fixture.tsx): Sectioned host supplies controlled selected IDs and accepted activity order. [AppDataGrid.sectioned-lineage.test.tsx](../../packages/ui/src/components/AppDataGrid/AppDataGrid.sectioned-lineage.test.tsx): Selected hidden children remain selected after reopen/reorder; section drag sources are disabled and accepted order is asserted. [AppDataGridShell.fixture.tsx](../../apps/docs/native-fixtures/scenarios/components/AppDataGridShell/AppDataGridShell.fixture.tsx): Complete host-owned section operations are a private shell successor. [AppDataGrid.sectioned-lineage.test.tsx](../../packages/ui/src/components/AppDataGrid/AppDataGrid.sectioned-lineage.test.tsx): Host clear selection/search/refresh act on real row presentation, clear criteria and restore data; no debug-state parity assertion. [AppDataGridShell.fixture.tsx](../../apps/docs/native-fixtures/scenarios/components/AppDataGridShell/AppDataGridShell.fixture.tsx): Public shell forwards the same activity reorder host. | Representative successor includes selection/sections. The source drag-only configuration remains supported and separately tested in AppDataGrid; owned keyboard alternatives and processing restrictions apply. No remaining implementation gap identified. |
| Shell: `ServerSearchAndDatabaseLoading` | Host debounces search250ms, simulates async450ms database sorting/filtering/paging, cancels stale completion, reports total/loading and resets page before search/sort. | [AppDataGridShell.fixture.tsx](../../apps/docs/native-fixtures/scenarios/components/AppDataGridShell/AppDataGridShell.fixture.tsx): Private successor restores250ms host debounce, name/email search, accepted server sorting, total and paging. [AppDataGrid.sectioned-lineage.test.tsx](../../packages/ui/src/components/AppDataGrid/AppDataGrid.sectioned-lineage.test.tsx): New search preserves old rows during debounce, then commits host results, descending order and email search. [AppDataGridShell.fixture.tsx](../../apps/docs/native-fixtures/scenarios/components/AppDataGridShell/AppDataGridShell.fixture.tsx): Current private server host discards obsolete loads and exposes pending search/page state. [GridHostExamples.tsx](../../apps/docs/examples/GridHostExamples.tsx): Source-backed host query sorts, filters, debounces by request identity, pages and retains error/retry handling; no backend persistence claim. [AppDataGridShell.server-response-races.test.tsx](../../packages/ui/src/components/AppDataGridShell/AppDataGridShell.server-response-races.test.tsx): Existing composed host tests assert stale-success/error/pending ownership; original delay values are representative timing rather than API. | Example-specific delays are not an API contract. A new private successor retains250ms debounce, name/email matching, host sorting and total; simulated query latency remains representative. Existing freshness guards additionally protect errors/pending/retry. No actual database is fetched. No remaining implementation gap identified. |
| Shell: `SortHookedUp` | Shell header/toolbar share host sortRules and legacy sortModel, with host-sorted name/status rows. | [ownedGridSortAcceptance.fixture.tsx](../../apps/docs/native-fixtures/scenarios/components/AppDataGrid/ownedGridSortAcceptance.fixture.tsx): Current controlled sort state requests host acceptance; accepted rows use shared processing. [AppDataGrid.test.tsx](../../packages/ui/src/components/AppDataGrid/AppDataGrid.test.tsx): Header activation resets pagination before requesting owned sort rules; resulting first page is asserted. [AppDataGridShell.test.tsx](../../packages/ui/src/components/AppDataGridShell/AppDataGridShell.test.tsx): Shell emits one state transaction before displaying the accepted sorted page. | sortModel is retired in favour of owned sortRules; current multi-sort promotion and clear use one controlled state transaction. No remaining implementation gap identified. |

The missing sectioned composition is now a private `SectionedRows` host used by
`HostSectionedRows`, `HostSectionedSelectionAndReorder`, and shell
`HostSectionedOperations`. Its focused tests exercise actual current-source grids:
collapse/reopen, no-checkbox compositions, retained hidden selection, activity-only
accepted reorder, enum filtering, search, clear selection and refresh. Drag-only
selection suppression is also explicit in `HostOwnedReorderWithoutSelection` and
the existing public reorder test. The existing card view now uses a real owned Link destination in place of its
no-op Open callback, and its existing view-switch test asserts the native href.
These are private diagnostic successors; the
user's processing-grid single-public-example exception is unchanged. No public
example controls, extra public grids, or Storybook runtime/dependencies are added.

Current unit/static evidence resolves the source/association blocker. A fresh
private-host build and native verification of the new scenario exports remain a
coordinator-granted validation step; no new native/browser result is claimed here.
Existing cell/sort/view/server tests are referenced assertions, not rerun results.
The independent [public example backlog](docs-fixture-migration.md#public-example-parity-audit--docs-005-b)
retains its own customer-facing scope.

## Historical-reference policy and evidence limits

Keep source repository/commit/path identifiers, Git objects, dated baseline
captures, original acceptance IDs and execution receipts unchanged. They describe
their original source/host and must not be presented as current runtime imports
or fresh validation. Current guides point to owned public contracts and docs-native
fixtures. Precise removed API names are necessary to explain consumer migration;
negative guards retain the names they reject. This policy is a proposed
documentation disposition, not a waiver of a literal zero-reference requirement.
If literal zero matches is required, a separate provenance-preserving decision is
still needed. Legal notices remain subject to their separate owner review.

[Audit evidence](final-acceptance/wave-03-33/evidence.json) records exact local Git
blobs, source SHA-256 hashes, scenario export comparisons, unit assertion texts,
the unavailable-upstream diagnostic and prior-receipt input comparisons. No
learner-platform mutation, runtime/browser/AT/device execution, legal approval,
publication or historical-evidence rewrite is implied.
