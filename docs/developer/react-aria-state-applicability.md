# Public state applicability and design contract

A-D-15: this is a source-backed design matrix, not an all-library conformance
receipt. Each public part below has all eleven states accounted for. Aliases keep
the implementation's policy; compound children have separate rows. Arbitrary
host-supplied children do not become fixed implementation children.

A = applicable owned state; C = composed child/item state; H = host-driven message
or operation state; — = no owned contract (N/A). N/A means no supported state on
that part: do not invent props. Layout, typography, scopes, pure helpers and
standalone decorative SVGs have no built-in action state. They may contain
host-owned interactive content. The current API join, per-state rationale and exact source hashes are in the
[current state matrix](react-aria-state-matrix.json). The wave-03-08
[historical matrix](final-acceptance/wave-03-08/state-matrix.json) remains dated evidence;
reference test paths identify cases, not fresh runtime passes.

Current source correction (2026-10-17): Progress, CircularProgress, LinearProgress and AppInlineProgress are passive progress indicators. They have no owned hover/focus/press contract; their loading/value semantics remain. The historical machine matrix is preserved as dated evidence and does not override these current rows. The current API name join adds HierarchicalMenu, FormFieldScope, MonthPicker and YearPicker below; every one of the 218 catalogued public names is represented, including the historical per-icon rows. This is an inventory join, not a new runtime pass for all rows.

Avatar is also passive: its public span/image contract supplies no owned hover,
focus or press action. It keeps a stable fallback while its private image loads
and on image failure. Loading here describes that image lifecycle, not a host
query or a new busy/interactive prop. Button, IconButton, SplitAction and
ListItemButton expose loading as the existing pending-action behavior; the Pend
column covers that alias rather than inventing a second operation state.

## Required indicators

| State | Design and non-color requirement |
| --- | --- |
| Hover | Temporary interaction feedback, never the only way to discover an action; names and native target remain available without hover. |
| Focus | Visible outline independent of selection; actual interactive target retains focus, with decorated input outline on its enclosing boundary. Portals inherit scope and scrollports must reveal the ring. |
| Pressed | Temporary activation; Button's data-pressed is not a persisted toggle value. Neutral filled press and hover intentionally share subtle background; primary fill shares its hover/press background. |
| Selected | Persisted native checked/aria-selected/aria-pressed/aria-current state plus a visible shape, position, glyph, weight or content indicator. ARIA alone does not meet the visual non-color criterion. |
| Disabled | Native/Aria disabled interaction and blocked callbacks, retaining labels. Disabled is availability, not a validation error. Opacity/GrayText supplement semantics. |
| Read-only | Host value remains readable and edits are blocked; submission and trigger/navigation policies depend on the actual field/composite contract. Do not assume disabled Tab-order behavior. |
| Invalid | Associated useful error text and invalid/native validation semantics; color border alone is insufficient. Host supplies errorMessage where required. Date/time text feedback preserves commit/blur timing. |
| Pending | Named in-flight action indicator, original action label and blocked activation; pending Button remains focusable unless explicitly disabled. |
| Empty | Meaningful empty/no-results message distinct from loading/error. Empty Select does not open an empty popup; query controls retain their own editable-query policy. |
| Loading | Named busy/progress/status content; host owns query, data, page and persistence. Previous-data rendering follows the component contract. |
| Error | Field error text or named operation failure with host retry where supported; never just a danger tone. |

## Applicability per public part

Columns use the state order hover, focus, pressed, selected, disabled, read-only,
invalid, pending, empty, loading, error. Links point to the source-backed public
examples; source owners and exact reference tests are in the machine matrix.

| Public part | Hov | Foc | Press | Sel | Dis | RO | Inv | Pend | Empty | Load | Error |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| [AppModal](/docs/components/dialog) | C | C | C | — | C | — | — | C | — | — | — |
| [HierarchicalMenu](/docs/components/hierarchical-menu) | C | C | C | C | C | — | — | — | — | — | — |
| [All named SVG icon exports (individual rows in current JSON)](/docs/components/icons) | — | — | — | — | — | — | — | — | — | — | — |
| [getActivityTypeIcon](/docs/components/icons) | — | — | — | — | — | — | — | — | — | — | — |
| [Button](/docs/components/button) | A | A | A | — | A | — | — | A | — | — | — |
| [Dialog](/docs/components/owned-dialog) | C | C | C | — | — | — | — | — | — | — | — |
| [Popover](/docs/components/popover) | C | C | C | — | — | — | — | — | — | — | — |
| [Tabs](/docs/components/tabs) | C | A | C | A | C | — | — | — | — | — | — |
| [Typography](/docs/components/typography) | — | — | — | — | — | — | — | — | — | — | — |
| [Box](/docs/components/box) | — | — | — | — | — | — | — | — | — | — | — |
| [Stack](/docs/components/stack) | — | — | — | — | — | — | — | — | — | — | — |
| [Surface](/docs/components/surface) | — | — | — | — | — | — | — | — | — | — | — |
| [Card](/docs/components/card) | — | — | — | — | — | — | — | — | — | — | — |
| [CardContent](/docs/components/card) | — | — | — | — | — | — | — | — | — | — | — |
| [Divider](/docs/components/divider) | — | — | — | — | — | — | — | — | — | — | — |
| [IconButton](/docs/components/icon-button) | A | A | A | — | A | — | — | A | — | — | — |
| [ButtonGroup](/docs/components/button-group) | — | — | — | — | — | — | — | — | — | — | — |
| [Menu](/docs/components/menu) | C | A | C | A | C | — | — | — | — | — | H |
| [SplitAction](/docs/components/split-action) | A | A | A | — | A | — | — | A | — | — | — |
| [Link](/docs/components/link) | A | A | A | — | — | — | — | — | — | — | — |
| [Breadcrumbs](/docs/components/breadcrumbs) | C | C | C | A | — | — | — | — | — | — | — |
| [Tooltip](/docs/components/tooltip) | C | C | — | — | A | — | — | — | — | — | — |
| [List](/docs/components/list) | — | — | — | — | — | — | — | — | — | — | — |
| [ListItem](/docs/components/list) | — | — | — | — | — | — | — | — | — | — | — |
| [ListItemButton](/docs/components/list) | A | A | A | A | A | — | — | A | — | — | — |
| [ListItemText](/docs/components/list) | — | — | — | — | — | — | — | — | — | — | — |
| [ListItemIcon](/docs/components/list) | — | — | — | — | — | — | — | — | — | — | — |
| [Navigation](/docs/components/navigation) | — | — | — | — | — | — | — | — | — | — | — |
| [NavigationItem](/docs/components/navigation) | A | A | A | A | — | — | — | — | — | — | — |
| [Disclosure](/docs/components/disclosure) | A | A | A | — | A | — | — | — | — | — | — |
| [Collapse](/docs/components/collapse) | — | — | — | — | — | — | — | — | — | — | — |
| [Chip](/docs/components/chip) | — | — | — | — | — | — | — | — | — | — | — |
| [Badge](/docs/components/badge) | — | — | — | — | — | — | — | — | — | — | — |
| [Progress](/docs/components/progress) | — | — | — | — | — | — | — | — | — | A | — |
| [CircularProgress](/docs/components/progress) | — | — | — | — | — | — | — | — | — | A | — |
| [LinearProgress](/docs/components/progress) | — | — | — | — | — | — | — | — | — | A | — |
| [Status](/docs/components/status) | — | — | — | — | — | — | — | H | H | H | H |
| [Avatar](/docs/components/avatar) | — | — | — | — | — | — | — | — | A | A | A |
| [Table](/docs/components/table) | — | — | — | — | — | — | — | — | — | — | — |
| [TableCaption](/docs/components/table) | — | — | — | — | — | — | — | — | — | — | — |
| [TableHead](/docs/components/table) | — | — | — | — | — | — | — | — | — | — | — |
| [TableBody](/docs/components/table) | — | — | — | — | — | — | — | — | — | — | — |
| [TableFoot](/docs/components/table) | — | — | — | — | — | — | — | — | — | — | — |
| [TableRow](/docs/components/table) | — | — | — | — | — | — | — | — | — | — | — |
| [TableCell](/docs/components/table) | — | — | — | — | — | — | — | — | — | — | — |
| [TableHeaderCell](/docs/components/table) | — | — | — | — | — | — | — | — | — | — | — |
| [Pagination](/docs/components/pagination) | C | A | C | — | A | — | — | — | A | — | — |
| [Provider](/docs/components/provider) | — | — | — | — | — | — | — | — | — | — | — |
| [AppThemeProvider](/docs/components/provider) | — | — | — | — | — | — | — | — | — | — | — |
| [ThemeScope](/docs/components/theme-scope) | — | — | — | — | — | — | — | — | — | — | — |
| [FormFieldScope](/docs/components/form-field-scope) | — | — | — | — | — | — | — | — | — | — | — |
| [MonthPicker](/docs/components/month-picker) | C | C | C | A | C | C | — | — | — | — | — |
| [YearPicker](/docs/components/year-picker) | C | C | C | A | C | C | C | — | — | — | C |
| [PeriodPicker](/docs/components/period-picker) | A | A | A | A | A | A | C | — | — | — | C |
| [DateTimeRangePicker](/docs/components/date-time-range-picker) | A | A | A | A | A | A | C | — | — | — | C |
| [DateRangeComparisonPicker](/docs/components/date-range-comparison-picker) | A | A | A | A | A | A | C | — | — | — | C |
| [SearchField](/docs/components/search-field) | A | A | A | — | A | A | — | — | A | A | H |
| [TextField](/docs/components/text-field) | — | A | — | — | A | A | A | — | — | — | A |
| [TextArea](/docs/components/text-area) | — | A | — | — | A | A | A | — | — | — | A |
| [Select](/docs/components/select) | A | A | A | A | A | A | A | — | A | — | A |
| [ComboBox](/docs/components/combo-box) | A | A | A | A | A | A | A | — | A | — | A |
| [Autocomplete](/docs/components/combo-box) | A | A | A | A | A | A | A | — | A | — | A |
| [AsyncMultiSelect](/docs/components/async-multi-select) | A | A | A | A | A | A | — | — | A | A | H |
| [Checkbox](/docs/components/checkbox) | A | A | A | A | A | A | A | — | — | — | A |
| [Switch](/docs/components/switch) | A | A | A | A | A | A | — | — | — | — | — |
| [RadioGroup](/docs/components/radio-group) | A | A | A | A | A | A | A | — | — | — | A |
| [ToggleButton](/docs/components/toggle-button) | A | A | A | A | A | — | — | — | — | — | — |
| [ToggleButtonGroup](/docs/components/toggle-button-group) | A | A | A | A | A | — | — | — | — | — | — |
| [TagGroup](/docs/components/tag-group) | A | A | A | — | A | — | — | — | A | — | — |
| [DateField](/docs/components/date-field) | — | A | — | — | A | A | A | — | — | — | A |
| [TimeField](/docs/components/time-field) | — | A | — | — | A | A | A | — | — | — | A |
| [Calendar](/docs/components/calendar) | A | A | A | A | A | A | — | — | — | — | — |
| [DatePicker](/docs/components/date-picker) | A | A | A | A | A | A | A | — | — | — | A |
| [DateRangePicker](/docs/components/date-range-picker) | A | A | A | A | A | A | A | — | — | — | A |
| [DateRangeSelector](/docs/components/date-range-selector) | A | A | A | A | A | A | A | — | — | — | A |
| [getRelativeDateRange](/docs/components/date-range-selector) | — | — | — | — | — | — | — | — | — | — | — |
| [getDateRangeLength](/docs/components/date-range-selector) | — | — | — | — | — | — | — | — | — | — | — |
| [IconPanelNavigation](/docs/components/icon-panel-navigation) | C | A | C | A | — | — | — | — | — | — | — |
| [AuthShell](/docs/components/auth-shell) | — | — | — | — | — | — | — | — | — | — | — |
| [AppShell](/docs/components/app-shell) | — | — | — | — | — | — | — | — | — | — | — |
| [AppPageHeader](/docs/components/page-header) | C | C | C | C | — | — | — | — | — | — | — |
| [AppPageTabs](/docs/components/page-tabs) | C | A | C | A | C | — | — | — | — | — | — |
| [ExperiencePageNavigator](/docs/components/experience-page-navigator) | C | C | C | A | — | A | — | — | — | — | — |
| [SideNavigation](/docs/components/side-navigation) | C | A | C | A | C | — | — | C | — | — | H |
| [EditableTitleField](/docs/components/editable-title-field) | A | A | A | — | — | A | C | A | — | — | C |
| [DocumentEditorLayout](/docs/components/document-editor-layout) | — | — | — | — | — | — | — | — | — | — | — |
| [DocumentEditorToolbar](/docs/components/document-editor-toolbar) | C | C | C | C | C | — | — | — | — | — | — |
| [ContentEditorChrome](/docs/components/content-editor-chrome) | C | C | C | — | C | C | C | C | — | — | C |
| [FloatingTextSelectionToolbar](/docs/components/floating-text-selection-toolbar) | C | C | C | C | — | — | — | — | — | — | — |
| [RichTextFormattingToolbar](/docs/components/rich-text-formatting-toolbar) | C | C | C | C | C | — | — | — | — | — | — |
| [InsertContentMenuControl](/docs/components/insert-content-menu-control) | A | A | A | — | A | — | — | — | — | — | — |
| [TextAlignMenuControl](/docs/components/text-align-menu-control) | A | A | A | A | A | — | — | — | — | — | — |
| [TextColorPickerControl](/docs/components/text-color-picker-control) | A | A | A | A | A | — | C | — | — | — | C |
| [TextStyleMenuControl](/docs/components/text-style-menu-control) | A | A | A | C | A | — | — | — | — | — | — |
| [ColumnsLayoutModal](/docs/components/columns-layout-modal) | C | C | C | C | — | — | — | — | — | — | — |
| [LinkUrlModal](/docs/components/link-url-modal) | C | C | C | — | — | — | C | — | — | — | C |
| [ImageUploadModal](/docs/components/image-upload-modal) | C | C | C | — | C | — | — | C | — | H | H |
| [PageRichTextEditorSection](/docs/components/page-rich-text-editor-section) | A | A | A | C | — | A | — | C | — | H | C |
| [SGNavigationProvider](/docs/components/navigation-provider) | — | — | — | — | — | — | — | — | — | — | — |
| [SGLink](/docs/components/sg-link) | A | A | A | — | — | — | — | — | — | — | — |
| [SGAccountProvider](/docs/components/account-provider) | — | — | — | — | — | — | — | — | — | — | — |
| [SGTranslationProvider](/docs/components/translation-provider) | — | — | — | — | — | — | — | — | — | — | — |
| [AppInlineProgress](/docs/components/inline-progress) | — | — | — | — | — | — | — | — | — | A | — |
| [AppOperationSteps](/docs/components/operation-steps) | — | — | — | — | — | — | — | H | — | C | H |
| [AppPaginationFooter](/docs/components/pagination-footer) | A | A | A | — | A | — | — | — | C | — | — |
| [ClassCardFrame](/docs/components/card-frame) | — | — | — | — | — | — | — | — | — | — | — |
| [InstructorClassCard](/docs/components/instructor-card) | C | C | C | — | — | — | — | — | — | — | — |
| [LearnerClassCard](/docs/components/learner-card) | C | C | C | — | — | — | — | — | — | — | — |
| [CardCollectionWithFooter](/docs/components/card-collection) | C | C | C | — | C | — | — | — | A | A | — |
| [AppDataGrid](/docs/components/app-data-grid) | A | A | A | A | C | — | — | — | A | A | H |
| [createDataGridColumns](/docs/components/app-data-grid) | — | — | — | — | — | — | — | — | — | — | — |
| [createActionMenuColumn](/docs/components/app-data-grid) | — | — | — | — | — | — | — | — | — | — | — |
| [AppDataGridShell](/docs/components/data-grid-shell) | C | C | C | A | C | — | — | — | A | A | H |
| [DataToolbar](/docs/components/data-toolbar) | C | C | C | A | C | — | — | — | — | — | — |
| [DataToolbarSelectionMenu](/docs/components/selection-menu) | A | A | A | A | C | — | — | — | — | — | — |
| [DataGridDragHandle](/docs/components/row-reorder) | A | A | A | — | A | — | — | — | — | — | — |
| [LearnerClassesDataGrid](/docs/components/learner-grid) | A | A | A | A | C | — | — | — | A | A | H |
| [DataGrid](/docs/components/processing-grid) | A | A | A | A | C | — | — | — | A | A | H |
| [RowSubHeader](/docs/components/row-subheader) | C | C | C | — | — | — | — | — | — | — | — |
| [createAdminCourseGridOptions](/docs/components/grid-presets) | — | — | — | — | — | — | — | — | — | — | — |
| [createAdminPeopleGridOptions](/docs/components/grid-presets) | — | — | — | — | — | — | — | — | — | — | — |
| [createInstructorCourseGridOptions](/docs/components/grid-presets) | — | — | — | — | — | — | — | — | — | — | — |
| [createInstructorCourseLearnersGridOptions](/docs/components/grid-presets) | — | — | — | — | — | — | — | — | — | — | — |

## Concrete indicators and retained evidence

- Button/IconButton/SplitAction: native activation and disabled semantics; named
  pending progress. `Button.public-contract.test.tsx` covers activation, ref,
  pending focus and native submit. `SplitAction.test.tsx` covers independent
  callbacks, blocked menu opening and dismissal on host disabling/loading.
- Checkbox has a check/mixed dash; RadioGroup changes the indicator to a thick
  inner ring; Switch moves its thumb. Labels and checked semantics accompany them.
  Their colocated tests cover the field contract; this is not spoken-AT output.
- Menu and AsyncMultiSelect show selected check glyphs; the latter keeps selected
  labels as removable tokens, named loading/error/no-results status and host retry.
  Select/ComboBox preserve selected text in the field, separate from popup focus.
- Tabs/AppPageTabs expose a selected panel and current tab semantics. Date range
  presets use selected weight; endpoints have range shape and draft/value text.
  Calendar selection has a separate inset outline, verified in the bounded native check below.
- TextField/TextArea attach descriptions/errors and invalid state to native fields.
  The integrated BUG-0009 TextArea puts decorated focus on the outer boundary.
  `coordinator-fixes/evidence.json` records 31 affected unit cases and four native
  cases per desktop engine for BUG-0008/0009; `coordinator-integration/evidence.json`
  records the subsequent seven-case-per-engine scope including picker policies.
  Retain only receipts with matching implementation/test hashes; do not sum these
  overlapping runs or claim every state was exercised.
- PeriodPicker/DateTimeRangePicker/DateRangeComparisonPicker now propagate disabled
  to interactive descendants (BUG-0008). Their named trigger/value and draft
  transaction remain separate from pending/loading. Current hashes must match
  the integration receipt before retaining those cases.
- DataGrid/AppDataGrid/shell/learner grids use busy/status, empty and operation-error
  content with optional host retry; selected rows also expose checkboxes. Collection
  loading/empty content and pagination remain host data/page decisions.
- Status requires meaningful message content: polite status/assertive alert are
  opt-in, not a substitute for a label. Progress exposes named value/indeterminate
  semantics and keeps a static indicator under reduced motion. Avatar uses
  initials/placeholder fallback for missing/failed imagery.

## Design status and bounded retained evidence

A-D-15 is a design criterion: complete applicability/meaning decisions and
structural indicators do not require a Cartesian browser-state conformance run.
The current 218-name, 2,398-cell matrix reconciles explicit props, derived state,
fixed child ownership and N/A exclusions. Runtime accessibility, target/device
and spoken-AT criteria remain separately owned by X06/X07/X11. Coordinator review
owns design closure; referenced tests are not an all-library runtime receipt.
ToggleButton now
has a double selected border with compensated padding. Navigation/List selected
start borders and Calendar's inset selected-date outline now pass six focused
Chromium cases across light/compact/LTR and dark/comfortable/RTL, each with normal
and actual forced colors. Selection persists separately from keyboard focus and
retains its dimensions. The [bounded receipt](final-acceptance/wave-04/coordinator/state-indicator-fixes/receipt.json)
preserves initial locator failures, the corrected direction fixtures and reviewed
images. This does not certify the complete state matrix.

The subsequent public-part source correction gives HierarchicalMenu's current
page a persistent double start bar, and MonthPicker/YearPicker selected choices
an inset ring. These structural indicators do not replace the existing independent
focus outlines or change selection/availability contracts. Existing meaningful
unit cases verify selection survives focus movement. A subsequent six-case
Chromium check passed for these three controls in measured light/compact/LTR and
dark/comfortable/RTL contexts, in standard and actual forced colors; YearPicker
covered both scrolling and paged choices within its existing case. Element
geometry remained stable, selection and focus retained separate indicators, and
forced-color indicator contrast against the selected surface measured at least
15.13:1 in these observed contexts. Twelve screenshots were reviewed. The
[bounded receipt](final-acceptance/wave-04/05/batch/d15-remaining-indicators/completion-receipt.json)
preserves the initial rem-token measurement setup failure and corrected run.
This does not close all D15, certify other engines or extend this result to the
complete state matrix.

FormFieldScope creates no DOM or action state; it supplies inherited description
and error placement. MonthPicker/YearPicker compose Button availability and focus;
read-only prevents choice activation. YearPicker's text-entry mode additionally
composes TextField validation on Enter or blur. HierarchicalMenu composes native
links/buttons or command items, exposes host-provided current-item and disabled
state, and owns drilldown focus rather than an editable value. These rows are
source-backed applicability only. References: the respective experimental source
directories and colocated tests; no new broad state matrix was executed.

The neutral filled Button source explicitly handles keyboard data-pressed for
neutral filled, outlined and text configurations. The original held-Space native
regression remains a bounded reference; source review does not invent execution
of that historical prepared case or require all engines to close a design row.

## Current source reconciliation and finite follow-up

The current machine matrix corrects the heuristic historical rows without editing
that dated artifact. AppOperationSteps is passive; Breadcrumbs composes owned
ancestor links/current text; fixed composite validation, save/upload pending/error,
formatting selection and disabled child contracts are represented even when no
new root prop exists. Presentation wrappers, arbitrary slots and helper/icon
exports do not acquire invented interaction states. EditableTitleField save
failure and SideNavigation account errors are existing owned states, not new API.

The source audit identified seven remaining marker owners: SideNavigation,
DocumentEditorToolbar, RichTextFormattingToolbar, FloatingTextSelectionToolbar,
TextColorPickerControl presets, PeriodPicker inline quarters and DateRangeSelector
endpoint/adjustment operation choices. Source corrections use owned double bars,
inset rings or double borders while preserving focus and box allocation; the
mixed formatting dashed marker remains separate. SideNavigation now exposes its
existing async operation as named pending progress as well as locked actions.
ExperiencePageNavigator already has visible Active text and retains that existing
non-color design; its proposed extra marker was withdrawn.

A further ToggleButton source correction prevents its higher-specificity selected
hover rule from retaining a brand background under a forced-color opt-out. It
uses system ButtonText/ButtonFace with a Highlight double selection border and
automatic adjustment. Screenshot review caught the initial HighlightText text
backplate mismatch; the corrected raster retains readable selected labels. Decorative color
swatch data and passive system-colored progress remain distinct exceptions; they
do not justify opting interactive branding out of system colors.

These eight owners have 15 effective Chromium cases in the bounded
[current-inventory evidence](final-acceptance/wave-04/05/batch/d15-current-inventory/native-review.json):
normal/forced marker pairs and one forced selected-hover toggle case, each measuring
light/compact/LTR and dark/comfortable/RTL. Twelve initial passes were retained;
two floating selection-driver failures and a toggle role timeout were corrected
without changing library semantics. The toggle screenshot correction then passed
its one affected case against a focused rebuild. All 34 final images were reviewed.
445 declaration files remain byte-identical. No all-state/all-engine conformance,
physical touch finding or spoken output is inferred; X06/X07/X11 remain separate.
Prior accepted six+six marker cases retain their original named scope.
