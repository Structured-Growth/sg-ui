# Migration inventory acceptance reconciliation

Task slice: W-19/Z-10/Z-15, M-01–M-37 evidence reconciliation (2026-10-07).
Inspected exact source baseline `cca9452f384d5ffaa34ad5bd4ddd015b43a2870b`.
This is a bounded audit, not a production acceptance decision or a change to the
[master checklist](react-aria-master-task-list.md). No broad G/K/E/U/X/R/Z gate is closed.

“Shipped” below means implementation exists in this migration snapshot, not
merged, released or commercially licensed to a consumer. All 37 directories are
registered in the [owned source/transitive/token/layer guard](../../scripts/check-foundations.mjs).
The 34 runtime catalog directories have granular package exports, colocated tests
and stories. The [component barrel](../../src/components/index.ts) is reexported by
the [root](../../src/index.ts); [package exports](../../package.json) declare the
corresponding public subpaths. M-12 exports AppPaginationFooter from the preserved
CardPaginationFooter directory; M-18 exports DataGridDragHandle/useDataGridRowDnd.
M-35 is a Storybook catalog, not a missing Typefaces runtime export. M-36/M-37
use component barrels plus public /icons and /primitives barrels; direct icon
subpaths are preserved. The [package guard](../../scripts/check-package.mjs)
checks emitted APIs/declarations/removal; its presence is not a new execution result.

Recommendations assess the entire **individual inventory row**, with source,
behavior and existing recorded execution evidence. “Recommend (row only)” means
no uncovered criterion identified within that bounded row; it does not accept
all shared primitives or broad gates. “Hold” identifies insufficient evidence or
an unresolved inventory contract. Missing evidence is not a demonstrated defect.
Historical test passes belong to their reported head/runtime; none is relabeled
as a fresh pass at this baseline. Initial implementation PR attribution and tests
are recorded in the [execution record](react-aria-progress.md) and
[draft PR #1](https://github.com/Structured-Growth/sg-ui/pull/1); targeted later
reports below record their distinct commits/PRs and limitations.

| ID / shipped implementation | Acceptance evidence (existing, not rerun) | Missing whole-row criteria / limits | Accepted-whole-task recommendation |
| --- | --- | --- | --- |
| M-01 AppButton: shipped; [source](../../src/components/AppButton/AppButton.tsx), [tests](../../src/components/AppButton/AppButton.test.tsx) | [Contract](react-aria-button.md). Pointer/Enter/Space once, disabled/pending, native submit, ref, variants and SSR; named onPress breaking mapping. | None identified within this row; broad display/device/AT gates remain separate. | Recommend (row only) |
| M-02 AppInlineProgress: shipped; [source](../../src/components/AppInlineProgress/AppInlineProgress.tsx), [tests](../../src/components/AppInlineProgress/AppInlineProgress.test.tsx) | [Contract](react-aria-progress-avatar.md). Clamped/rounded percentage, translated progress name, widths and SSR; owned Progress and scoped CSS. | No row-specific recorded native reduced-motion and full label/layout state acceptance. | Hold |
| M-03 AppOperationSteps: shipped; [source](../../src/components/AppOperationSteps/AppOperationSteps.tsx), [tests](../../src/components/AppOperationSteps/AppOperationSteps.test.tsx) | [Contract](react-aria-progress-avatar.md). Ordered accessible status text, active progress, completed/error token styles, single/empty/SSR states. | Live state-transition announcement and full visual-state acceptance are not established by static semantics tests. | Hold |
| M-04 AppPageHeader: shipped; [source](../../src/components/AppPageHeader/AppPageHeader.tsx), [tests](../../src/components/AppPageHeader/AppPageHeader.test.tsx) | [Contract](react-aria-page-layout.md). Hierarchy, metadata/ref, collapsed breadcrumb menu, host routing, disabled actions and focus restoration. | No unresolved individual-row criterion identified after [criterion review](parallel-batch-60/page-navigation-evidence.md): retained C/W history plus exact fresh Firefox proof; current-head full-matrix/manual/device/AT gates remain separate. | Accepted (row only, coordinator review 2026-10-07) |
| M-05 AppPageTabs: shipped; [source](../../src/components/AppPageTabs/AppPageTabs.tsx), [tests](../../src/components/AppPageTabs/AppPageTabs.test.tsx) | [Contract](react-aria-page-layout.md). Tab/panel IDs, controlled/disabled/manual selection, route current state, focused overflowing route strip. | No unresolved individual-row criterion identified after [criterion review](parallel-batch-60/page-navigation-evidence.md): retained C/W history plus exact fresh Firefox proof; current-head full-matrix/manual/device/AT gates remain separate. | Accepted (row only, coordinator review 2026-10-07) |
| M-06 AppShell: shipped; [source](../../src/components/AppShell/AppShell.tsx), [tests](../../src/components/AppShell/AppShell.test.tsx) | [Contract](react-aria-modal-shells.md). One main landmark, host navigation, collapsed navigation keeps content, SSR/ref. | Native main reflow and responsive navigation matrix are not proven by unit markup. | Hold |
| M-07 AuthShell: shipped; [source](../../src/components/AuthShell/AuthShell.tsx), [tests](../../src/components/AuthShell/AuthShell.test.tsx) | [Contract](react-aria-modal-shells.md). Host sections/headings/ref, content updates preserve field state, keyboard submit and host footer route. | Resilient native content sizing/reflow across narrow and enlarged-text states needs acceptance evidence. | Hold |
| M-08 AppModal: shipped; [source](../../src/components/AppModal/AppModal.tsx), [tests](../../src/components/AppModal/AppModal.test.tsx) | [Contract](react-aria-modal-shells.md). Nested dismissal/focus/portal tests, locks/reasons, actions/steps/sizes; [nested dialog report](parallel-batch-01/dialogs.md). | Removed-trigger focus recovery, actual AT, physical devices and complete native size/scroll matrix remain open. | Hold |
| M-09 SideNavigation: shipped; [source](../../src/components/SideNavigation/SideNavigation.tsx), [tests](../../src/components/SideNavigation/SideNavigation.test.tsx) | [Contract](react-aria-modal-shells.md). Selection/collapse/drilldown focus, account retry/concurrency; [adapter report](parallel-batch-01/adapters.md). | Full native expansion/collapse/navigation and AT/device matrix; adapter report excludes shell-wide acceptance. | Hold |
| M-10 ExperiencePageNavigator: shipped; [source](../../src/components/ExperiencePageNavigator/ExperiencePageNavigator.tsx), [tests](../../src/components/ExperiencePageNavigator/ExperiencePageNavigator.test.tsx) | [Contract](react-aria-page-navigation.md). Controlled authoring pages, add/rename/remove boundaries, keyboard Move and validated drag, read-only, stale-host changes. | Master previous/next/link wording mismatches the authoring list; coordinator must reconcile row intent. Complete native drag/focus/device acceptance remains open. | Hold |
| M-11 CardCollectionWithFooter: shipped; [source](../../src/components/CardCollectionWithFooter/CardCollectionWithFooter.tsx), [tests](../../src/components/CardCollectionWithFooter/CardCollectionWithFooter.test.tsx) | [Contract](react-aria-card-pagination.md). Stable keys, shrink/clamp, controlled footer, loading/empty and nested actions; recorded native one-column layout and scrolling. | Recorded container checks are representative; full responsive/container layout acceptance is not established. | Hold |
| M-12 CardPaginationFooter: shipped; [source](../../src/components/CardPaginationFooter/CardPaginationFooter.tsx), [tests](../../src/components/CardPaginationFooter/CardPaginationFooter.test.tsx) | [Contract](react-aria-card-pagination.md). Known/unknown/zero totals, disabled boundaries, translations, native form-safe actions and atomic size/page callbacks; recorded native pagination. | None identified within this row; broad device/AT gates remain separate. | Recommend (row only) |
| M-13 ClassCardFrame: shipped; [source](../../src/components/ClassCardFrame/ClassCardFrame.tsx), [tests](../../src/components/ClassCardFrame/ClassCardFrame.test.tsx) | [Contract](react-aria-card-frames.md), [F1 report](parallel-batch-39/frame-resize-native.md) and [criterion reconciliation](#m-13-criterion-reconciliation-2026-10-07): owned surface/slots, constants/style/SSR, original width matrix and full-engine live parent/slot reflow proof. | No unresolved individual-row criterion identified; physical device/zoom, spoken AT and broader U/X/R/Z gates remain separate. | Accepted (row only, coordinator review 2026-10-07) |
| M-14 InstructorClassCard: shipped; [source](../../src/components/InstructorClassCard/InstructorClassCard.tsx), [tests](../../src/components/InstructorClassCard/InstructorClassCard.test.tsx) | [Contract](react-aria-card-frames.md). Status/archive branches, translated/custom labels, host keyboard routes and SSR; recorded narrow long-name rendering. | No menu or persistence action exists in the preserved contract: reconcile master wording rather than invent APIs. Date/icon fallback matrix is not fully evidenced. | Hold |
| M-15 LearnerClassCard: shipped; [source](../../src/components/LearnerClassCard/LearnerClassCard.tsx), [tests](../../src/components/LearnerClassCard/LearnerClassCard.test.tsx) | [Contract](react-aria-card-frames.md). Normalized named progress, due formatter, translations, keyboard Continue once, safe links and Details fallback. | Complete due/status/action fallback and interactive-region native acceptance remains unproven. | Hold |
| M-16 AppDataGrid: shipped; [source](../../src/components/AppDataGrid/AppDataGrid.tsx), [tests](../../src/components/AppDataGrid/AppDataGrid.test.tsx) | [Contract](react-aria-catalog-grid.md). Public renderer/helpers/types, owned processing/state/cells, persistence/reset; [cell acceptance](react-aria-grid-cell-acceptance.md), [focus report](parallel-batch-01/grid-focus.md). | Row explicitly depends on complete G acceptance: busy semantics, AT/device, server races and broader processing/layout/performance gates remain open. | Hold |
| M-17 AppDataGridShell: shipped; [source](../../src/components/AppDataGridShell/AppDataGridShell.tsx), [tests](../../src/components/AppDataGridShell/AppDataGridShell.test.tsx) | [Contract](react-aria-catalog-grid.md). Shared list/cards criteria/selection/page owner, one footer, server pass-through, hydration-safe persistence and controlled reset. | Native view-switch/footer async focus and complete responsive shell acceptance remain open. | Hold |
| M-18 AppDataGridRowDnd: shipped; [source](../../src/components/AppDataGridRowDnd/DataGridDragHandle.tsx), [tests](../../src/components/AppDataGridRowDnd/DataGridDragHandle.test.tsx) | [Contract](react-aria-grid-reorder.md). Owned handle/preview/helper and bounded public reorder; [reorder report](parallel-batch-01/grid-reorder.md) records cancellation, Strict Mode, pending commit/rollback. | Physical touch long-press, spoken AT, cross-grid/dataset replacement boundaries and network race matrix remain open. | Hold |
| M-19 LearnerClassesDataGrid: shipped; [source](../../src/components/LearnerClassesDataGrid/LearnerClassesDataGrid.tsx), [tests](../../src/components/LearnerClassesDataGrid/LearnerClassesDataGrid.test.tsx) | [Contract](react-aria-catalog-grid.md). Translated learner columns, due dates/locale changes, safe launch/menu callbacks, controlled server and processed client pages. | Full native learner model/date/link/action and state composition acceptance beyond representative unit evidence remains open. | Hold |
| M-20 DataToolbar: shipped; [source](../../src/components/DataToolbar/DataToolbar.tsx), [tests](../../src/components/DataToolbar/DataToolbar.test.tsx) | [Contract](react-aria-data-toolbar.md). Search/clear/refresh/view, selection/columns/sort/filter drafts, locks, translated badge and composed processing tests. | Complete native menu placement, keyboard/AT and controlled-state interaction matrix remains open. | Hold |
| M-21 DocumentEditorLayout: shipped; [source](../../src/components/DocumentEditorLayout/DocumentEditorLayout.tsx), [tests](../../src/components/DocumentEditorLayout/DocumentEditorLayout.test.tsx) | [Editor layout contract](react-aria-editor-layout.md), [F6a report](parallel-batch-33/layout-replacement.md), and [criterion reconciliation](#m-21-criterion-reconciliation-2026-10-07): five unit/SSR/ref/region tests, four Chromium and eight Firefox/WebKit live chrome-replacement cases with exact retained host scroll/focus, immutable source attribution. | No unresolved individual-row criterion identified; arbitrary host chrome policy and broader E/U/X/R/Z/manual/device/AT gates remain separate. | Accepted (row only, coordinator review 2026-10-07) |
| M-22 DocumentEditorToolbar: shipped; [source](../../src/components/DocumentEditorToolbar/DocumentEditorToolbar.tsx), [tests](../../src/components/DocumentEditorToolbar/DocumentEditorToolbar.test.tsx) | [Contract](react-aria-editor-layout.md). Controlled heading/pressed actions, chooser commit before host focus, read-only zoom, missing callbacks and translated slots. | Full native responsive overflow and all toolbar menu/toggle states remain unproven. | Hold |
| M-23 ContentEditorChrome: shipped; [source](../../src/components/ContentEditorChrome/ContentEditorChrome.tsx), [tests](../../src/components/ContentEditorChrome/ContentEditorChrome.test.tsx) | [Contract](react-aria-editor-layout.md). Named action group, native anchor callback, pointer/Enter/Space once, pending/disabled, title save and read-only slots. | Complete editor/menu focus composition and responsive semantic layout acceptance remains unproven. | Hold |
| M-24 EditableTitleField: shipped; [source](../../src/components/EditableTitleField/EditableTitleField.tsx), [tests](../../src/components/EditableTitleField/EditableTitleField.test.tsx) | [Contract](react-aria-remaining-controls.md). Enter/blur/Escape, trim/empty/unchanged validation, pending/retry, host focus policy, composing Enter and SSR; recorded native save/rejection/focus. | None identified within this row; actual IME/device and broad AT acceptance are separate. | Recommend (row only) |
| M-25 FloatingTextSelectionToolbar: shipped; [source](../../src/components/FloatingTextSelectionToolbar/FloatingTextSelectionToolbar.tsx), [tests](../../src/components/FloatingTextSelectionToolbar/FloatingTextSelectionToolbar.test.tsx) | [Contract](react-aria-editor-layout.md). Alt+F10, pointer/keyboard selection preservation, queued cleanup, scroll/resize clamp, outside/Escape/blur and read-only. | Native anchoring/position/collision across hosts, browsers and physical devices remains open. | Hold |
| M-26 RichTextFormattingToolbar: shipped; [source](../../src/components/RichTextFormattingToolbar/RichTextFormattingToolbar.tsx), [tests](../../src/components/RichTextFormattingToolbar/RichTextFormattingToolbar.test.tsx) | [Contract](react-aria-formatting-toolbar.md). Named actions, controlled pressed/mixed styles, hidden/disabled callbacks, chooser focus sequencing, colors and link preparation. | Complete Lexical command/mixed selection matrix depends on open E-02/E-04 editor acceptance. | Hold |
| M-27 InsertContentMenuControl: shipped; [source](../../src/components/InsertContentMenuControl/InsertContentMenuControl.tsx), [tests](../../src/components/InsertContentMenuControl/InsertContentMenuControl.test.tsx) | [Contract](react-aria-editor-menus.md). Every insertion callback, disabled/unavailable commands, form-safe activation and host-dialog focus. | Complete native insertion-focus and live announcement acceptance remains unproven. | Hold |
| M-28 TextAlignMenuControl: shipped; [source](../../src/components/TextAlignMenuControl/TextAlignMenuControl.tsx), [tests](../../src/components/TextAlignMenuControl/TextAlignMenuControl.test.tsx) | [Contract](react-aria-editor-menus.md). All six alignments, indent/outdent restrictions, controlled checked state, Escape focus, translated RTL dark portal. | Complete native direction-aware command/presentation acceptance beyond unit portal attributes remains unproven. | Hold |
| M-29 TextColorPickerControl: shipped; [source](../../src/components/TextColorPickerControl/TextColorPickerControl.tsx), [tests](../../src/components/TextColorPickerControl/TextColorPickerControl.test.tsx) | [Contract](react-aria-editor-menus.md). Hex errors/normalize/no duplicate commit, swatches/native color, clear/background reset, host reopen/read-only and IME guard. | Native OS color chooser, complete foreground/background and AT interaction acceptance remain unproven. | Hold |
| M-30 TextStyleMenuControl: shipped; [source](../../src/components/TextStyleMenuControl/TextStyleMenuControl.tsx), [tests](../../src/components/TextStyleMenuControl/TextStyleMenuControl.test.tsx) | [Contract](react-aria-editor-menus.md). Eight style callbacks, checked host state, clear formatting, keyboard unavailable skipping/focus and translations. | Master typeface wording mismatches this control; typeface belongs to RichTextFormattingToolbar. Complete native style/selection focus matrix remains open. | Hold |
| M-31 ColumnsLayoutModal: shipped; [source](../../src/components/ColumnsLayoutModal/ColumnsLayoutModal.tsx), [tests](../../src/components/ColumnsLayoutModal/ColumnsLayoutModal.test.tsx) | [Contract](react-aria-editor-dialogs.md). Five owned radio presets, keyboard single commit/focus, Apply/Cancel/Escape, reopen/default reset, invalid runtime fallback and translations. | None identified within this row; broad modal/device/AT gates remain separate. | Recommend (row only) |
| M-32 ImageUploadModal: shipped; [source](../../src/components/ImageUploadModal/ImageUploadModal.tsx), [tests](../../src/components/ImageUploadModal/ImageUploadModal.test.tsx) | [Contract](react-aria-editor-dialogs.md). File/preview/errors, optional alt, duplicate prevention/cancel/retry; existing [upload lifetime](react-aria-editor-section.md#host-upload-lifetime-e-06-partial) and presentation-validation browser evidence. | Broader E-06 file/content/asset validation and upload matrix remain open; metadata checks do not establish byte/authorization acceptance. | Hold |
| M-33 LinkUrlModal: shipped; [source](../../src/components/LinkUrlModal/LinkUrlModal.tsx), [tests](../../src/components/LinkUrlModal/LinkUrlModal.test.tsx) | [Contract](react-aria-editor-dialogs.md). Shared URL policy, trim/Enter/unlink, host restrictions, cancellation/reopen/focus; [link destination evidence](react-aria-editor-section.md#link-destination-policy-e-06e-07-partial). | Full URL/protocol and native edit/remove/focus matrix beyond representative link fixtures remains open under E-06/E-07. | Hold |
| M-34 PageRichTextEditorSection: shipped; [source](../../src/components/PageRichTextEditorSection/PageRichTextEditorSection.tsx), [tests](../../src/components/PageRichTextEditorSection/PageRichTextEditorSection.test.tsx) | [Contract](react-aria-editor-section.md). Owned Lexical composition, nodes/plugins, host JSON/reload/read-only, links/images and native clipboard/upload/rich-document suites. | E-02/E-04 complete node/plugin/selection/history/table matrix, E-05 actual IME/device/AT and E-06/E-07 wider content/trust acceptance remain open. | Hold |
| M-35 Typefaces: shipped; [catalog](../../src/components/Typefaces/Typefaces.stories.tsx) | [Contract](react-aria-remaining-controls.md). Production Provider/Tokens and native Typography roles including bodyAlt2/code; [Typography tests](../../src/experimental/Typography/Typography.test.tsx) and [SSR tests](../../src/experimental/Typography/Typography.ssr.test.tsx). | None identified within this story-only foundation catalog row; no Typefaces runtime export is expected. | Recommend (row only) |
| M-36 icons: shipped; [barrel](../../src/components/icons/index.ts), [tests](../../src/components/icons/icons.test.tsx) | [Contract](react-aria-icons.md). Complete documented symbol mapping, direct/public shared vectors, naming/ref/RTL and activity aliases/override/fallback tests; [catalog tests](../../src/experimental/icons/icons.test.tsx). | None identified within the icon mapping/activity row; full display/AT and legal/final tarball gates remain separate. | Recommend (row only) |
| M-37 primitives: shipped; [barrel](../../src/components/primitives/index.ts), [tests](../../src/components/primitives/primitives.test.tsx) | [Contract](react-aria-primitives.md). Owned public wrapper/barrel mappings and explicit removed types; public form/menu/table/ref tests plus interaction-level behavior tests. | Complete all-control native/AT/state acceptance remains open under U/X; documented removals do not prove that matrix. | Hold |

## Evidence provenance and unresolved inventory intent

The execution record contains original scoped batches: owned controls, card
pagination/cards, page actions/navigation, modal/shells, editor dialogs/menus,
formatting toolbar, editor layout/selection, editor section, toolbar, public grid,
reorder and icons/primitives. These batches describe implementation completion;
their explicit remaining native/AT requirements still apply. Later targeted
[dialogs](parallel-batch-01/dialogs.md), [adapters](parallel-batch-01/adapters.md),
[grid focus](parallel-batch-01/grid-focus.md) and
[grid reorder](parallel-batch-01/grid-reorder.md) reports add evidence, each with
its exact commands, commits and PR. The grid focus report separately flags
native aria-busy forwarding; it does not certify spoken busy announcements.
The dialog report's Arabic-locale portal pass does not resolve explicit dir overrides.

Three descriptions require coordinator reconciliation before accepting their
whole rows: M-10's previous/next/link summary is not the preserved authoring page
list; M-14 has no menu/persistence action contract; M-30's typeface summary belongs
to the formatting toolbar. The existing contracts explicitly describe these
facts. No new APIs or scope reductions were introduced to satisfy a stale summary.

[Browser acceptance](react-aria-browser-acceptance.md),
[runtime CI](react-aria-runtime-ci.md), [package acceptance](react-aria-package-acceptance.md)
and [removal audit](react-aria-removal-audit.md) distinguish native/consumer runs,
local Firefox launch failures, older-head results, historical/legal references
and final-artifact requirements. Physical devices, actual browser chrome zoom,
IME and spoken assistive-technology acceptance remain unverified where recorded.
A source boundary registration or passing unit test cannot discharge those gates.

## Audit validation and integration

A read-only Python audit parsed the exact 37 master inventory rows and verified
each directory and guard registration; all 34 runtime catalog granular exports,
colocated behavior tests and stories were present. Typefaces story and public
icon/primitive barrels were reviewed separately. Source/barrel/contracts/tests,
browser specs and existing targeted reports were inspected; relative links and
anchors in this new record are validated before commit. `git diff --check` is the
only GitHub documentation-only dev validation expected for this slice.
No dependency install, source tests, build, browser process or heavy-validation
lock was needed. Python 3.9.6 / Node 26.5.0 are available locally; Node was queried
only for provenance and no Node test/build was executed. This is documentation
validation, not Node 24 support evidence.

W-19 is satisfied only for the links/paths/claims in these two new documents,
not every repository guide/example/command. Z-10 remains open for helpers,
presets/hooks/adapters outside M-01–M-37 and full acceptance of the held rows.
Z-15 remains open for final exact-head decisions, accepted matrix/manual evidence,
reviewed PRs and explicit deferred requirements. Coordinator owns any M-38,
master/progress/AGENTS integration; this worker changes none of those files.
Suggested next bounded evidence task: reconcile the three stale row descriptions
against the preserved public contracts, then record M-02/M-03 reduced-motion and
live-status transition acceptance without closing broad display/AT gates.


## M-21 criterion reconciliation — 2026-10-07

Coordinator accepted the individual DocumentEditorLayout inventory row after independent criterion review at reviewed dev `496658081b8b8efcde21ab4f9b151adfd3aa32fe`. This upgrades the previously held row, not broad editor/scroll/AT acceptance.

- Tokenized regions: owned implementation/compiled component-layer CSS/generated tokens, public granular export and registered whole-directory boundaries; five existing unit tests cover ordered/optional regions, native style/ref/title, keyboard traversal, stable host focus/ref on replacement and SSR.
- Scroll boundaries: the layout introduces no scroll owner. Native focus/scroll/node/ref/geometry assertions confirm only the host content scrolls while root/wrapper/document and header remain stationary.
- Concrete missing live replacement: finalized F6a worker `f00ba53b1346202ef9e2152f0bec7f22936ef5c6` contributed source/spec bytes to clean testing candidate `e6270941ea8828d8868fef0798451a599a9db25f`; four Chromium cases passed across both themes at260px and normal/200%text. Exact file-byte attribution and root immutable source/build hashes are recorded in its report.
- Supported engines: reviewed dev4966580 wave26 `artifacts/browser-pool/62606ae5-219b-4fc7-816f-fb51691ea5fd/layout-replacement/{evidence.json,results.json}` has eight Firefox/WebKit passes, zero unexpected/skipped/flaky. Root evidence confirms clean identical initial/final head/source/build and owned commands settled. Other failed shards remain red and do not invalidate this passing shard. Source/spec are unchanged from finalized F6a.

No row-specific criterion remains uncovered. Physical browser zoom/device, assistive technology, arbitrary oversized host chrome and broad E/U/X/R/Z gates are not closed by this acceptance.


## M-13 criterion reconciliation — 2026-10-07

Coordinator accepted the individual ClassCardFrame inventory row after independent criterion review at reviewed dev `352dc493f64520f544b489d656d30972ea63727b`. Source migration alone did not establish acceptance; the previously missing explicit-width Firefox proof now exists.

- Owned surface/spacing: owned Card, compiled component-layer CSS and generated surface/spacing tokens with documented native root/slot styling.
- Image/content slots: four unit tests cover optional/falsy regions, arbitrary content, image attributes and SSR. Native cases verify loaded media, intrinsic image ratios, wrapping and slot containment.
- Width/constants: preserved420/360 constants, explicit360/500 widths, native280 style precedence and stable frame identity through width changes. The original batch10 report records10 Chromium/WebKit passes. Wave27 `frame-original-width-firefox` adds5 Firefox passes, zero unexpected/skipped/flaky, at testing candidate `4987a1fe046c37f2e612d6de159aa09e1e840043`. Exact evidence lives in managed batch45 `artifacts/browser-pool/afadf38b-8476-4c9b-a10e-2a78d786822d/frame-original-width-firefox/{evidence.json,results.json}`. Root manifest verifies identical initial/final head/source/build, clean final status and settled owned commands. Full frame directory and original/F1 specs are byte-identical to reviewed dev352dc49. Separate grid/pointer failures remain red.
- Composed responsive slots: finalized F1 report records8 Chromium passes; wave26 `frame-resize-native` has16 Firefox/WebKit passes at reviewed dev4966580. Flex/grid, both themes, normal/enlarged text, parent shrink/restore, image/header/footer replacement, retained identity/callback/focus and host-scroll reachability are covered. Evidence is `artifacts/browser-pool/62606ae5-219b-4fc7-816f-fb51691ea5fd/frame-resize-native/` in the dev integration worktree.

No individual-row criterion remains uncovered. Physical-device/browser zoom, spoken assistive technology and broader U/X/R/Z acceptance remain held.


## M-04/M-05 criterion reconciliation — 2026-10-07

Coordinator accepted these two individual rows after the independent [batch60 criterion review](parallel-batch-60/page-navigation-evidence.md) mapped every requirement and verified the previously missing Firefox matrix. The report preserves historical Chromium/WebKit artifacts and their original immutable-build limitations; it does not relabel them as current-head full-matrix passes.

- M-04: breadcrumbs, actions, metadata, primary/subpage surfaces and responsive wrapping have source/unit/SSR plus retained12C/12W cases. Fresh12Firefox cases passed at candidate `f87c8d336932ea70ad3ab9eaea5e4e6b77bc40ec` in wave29 `page-header-firefox-gap`.
- M-05: controlled/manual/automatic tab semantics, reciprocal unique IDs, isolated instances, disabled skipping, panel entry/return, RTL overflow and default/explicit density have source/composed plus retained32C/32W cases. Fresh32Firefox cases passed at the same candidate in `catalog-tabs-firefox-gap`.
- Exact artifact root in managed batch45: `artifacts/browser-pool/693cd1a1-28f1-4986-b345-258b4621c480/`. All44 relevant Firefox cases have one passed retry-zero result and no skipped/unexpected/flaky/global errors. Root source/build/head remain immutable, final status clean and commands settled. Independent full component/spec and transitive closure byte attribution equals reviewed dev30d44d5; artifact and source digests are in the report.

No individual-row criterion remains uncovered. Physical-device/browser-chrome zoom, spoken AT, broader U/X/R/Z and production current-head full-matrix acceptance stay open. Historical shared Link/Button/Menu dependency changes and original artifact limitations remain explicitly documented.
