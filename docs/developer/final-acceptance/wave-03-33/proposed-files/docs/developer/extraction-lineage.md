# Extraction and example lineage

This reconciliation distinguishes the recorded upstream source, local extracted
files, later owned contracts and the docs-native replacement host. The upstream
identity remains `owner-confirmed first-party code`, commit
`source-identity-omitted`, root `apps/web/src/ui`.
That commit object is unavailable in this SGUI repository. No host application
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

## Earlier grid scenario exports still need behavior disposition

Module transfer does not establish parity with the initial extraction. Two grid
modules changed their example exports before docs migration. The following 16
initial exports have no same-name successor in the pre-docs module or current
fixture. Their initial blobs/exports are retained in the audit receipt. Related
current examples are candidates, not accepted semantic replacements. W-10 remains
open for explicit behavior mapping, deliberate retirement or implementation and
focused validation of these scenarios; do not silently drop them from the count.

- `src/components/AppDataGrid/AppDataGrid.stories.tsx` (initial blob `c48a4fe9c44d053b2c1a6f94ec42cb9e39885d17`): `ListOnly`, `HeaderSortHookedUp`, `StructuredCellTypes`, `AllColumnTypes`, `BuiltInCheckboxSelection`, `BuiltInRowDragHandle`, `BuiltInCheckboxAndRowDragHandle`, `SectionedDropdownRows`, `SectionedDropdownRowsWithCheckboxAndDrag`.
- `src/components/AppDataGridShell/AppDataGridShell.stories.tsx` (initial blob `97a4167ffe228c17d60ae9382f82e2f8ad7a380b`): `ListOnlyNoCheckboxes`, `SortHookedUp`, `ListWithCheckboxes`, `ListWithRowDragDrop`, `CardsAndListModes`, `ServerSearchAndDatabaseLoading`, `CollapsableSubheaders`.

AppDataGrid Default, RetainedSelection and HostOwnedReorder provide related owned
list/selection/reorder examples. AppDataGridShell SharedListAndCards,
ControlledHostResponses and ServerLatestRequestWins provide related view and host
request examples. Structured cell-type matrices, combined checkbox/drag behavior
and sectioned/collapsible-row contracts require individual comparison; filename
presence and catalog membership cannot settle them. The existing
[public example backlog](docs-fixture-migration.md#public-example-parity-audit--docs-005-b)
also remains independent, including primitive/adapter/calendar/grid-helper flows.

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
host application mutation, runtime/browser/AT/device execution, legal approval,
publication or historical-evidence rewrite is implied.
