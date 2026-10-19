# Migration inventory acceptance reconciliation

## Current M-01–M-37 tracking — 2026-10-18

The [37-row tracking map](migration-tracking.json) supersedes the historical Hold
recommendations below. It joins the earlier accepted wave-02 reconciliation with
later coordinator closures. Its frozen35-accepted snapshot is preserved; the
current disposition accepts all37 original rows after the separate A-M-18 closure
and [A-M-16 production measurement/phase join](backlog-to-ten/performance-grid-closure.json). All F/T/V baseline phases are shipped and accepted
in their recorded scopes. These are separate claims, and this tracking work does
not close any shared acceptance or release gate.

Each row records actual implementation/test paths and hashes, a commit verified
as an ancestor of `dev`, original acceptance and validation receipts, and a
recursive source-boundary audit. [Frozen HEAD source evidence](final-acceptance/wave-04/02/migration-tracking/head-boundary-row-audit.json)
found no retired/unresolved relative dependencies in the 37 integrated row graphs;
[working-source graphs](final-acceptance/wave-04/02/migration-tracking/boundary-row-audit.json)
are recorded separately. The
[maintained foundation guard](final-acceptance/wave-04/02/migration-tracking/validation.json)
also passed. Concurrent X08 working changes are listed separately with their
HEAD/working hashes; they are not represented as committed or behavior-validated.

[Historical PR #1](https://github.com/Structured-Growth/sg-ui/pull/1) is initial
combined attribution, not a required new review gate. Later human-authorized
direct `dev` integrations use actual commit links below. A latest implementation
commit alone does not establish acceptance; its row-specific reconciliation and
validation record supplies that evidence. Typefaces is now a docs/native catalog;
Button replaces the historical AppButton name. Storybook is removed.

| Row | Current implementation / catalog | Integrated implementation commit | Original row acceptance / validation | Transitive boundary |
| --- | --- | --- | --- | --- |
| M-01 | [Button (AppButton removed)](../../packages/ui/src/components/Button/Button.tsx) | [540f47d4](https://github.com/Structured-Growth/sg-ui/commit/540f47d4059a9cea8890b80927f34f51ef2fbc3e) | [Accepted row](final-acceptance/wave-02-reconciliation.json); F/T/V-C01 | 6 HEAD files, 0 retired/unresolved |
| M-02 | [AppInlineProgress](../../packages/ui/src/components/AppInlineProgress/AppInlineProgress.tsx) | [530bbc00](https://github.com/Structured-Growth/sg-ui/commit/530bbc00465d9dbf1e9948f8a2c01b2e51b1a479) | [Accepted row](final-acceptance/wave-02-reconciliation.json); F/T/V-C02 | 6 HEAD files, 0 retired/unresolved |
| M-03 | [AppOperationSteps](../../packages/ui/src/components/AppOperationSteps/AppOperationSteps.tsx) | [530bbc00](https://github.com/Structured-Growth/sg-ui/commit/530bbc00465d9dbf1e9948f8a2c01b2e51b1a479) | [Accepted row](final-acceptance/wave-04/coordinator/accepted-closures.json); F/T/V-C03 | 12 HEAD files, 0 retired/unresolved |
| M-04 | [AppPageHeader](../../packages/ui/src/components/AppPageHeader/AppPageHeader.tsx) | [530bbc00](https://github.com/Structured-Growth/sg-ui/commit/530bbc00465d9dbf1e9948f8a2c01b2e51b1a479) | [Accepted row](final-acceptance/wave-02-reconciliation.json); F/T/V-C04 | 18 HEAD files, 0 retired/unresolved |
| M-05 | [AppPageTabs](../../packages/ui/src/components/AppPageTabs/AppPageTabs.tsx) | [24b75801](https://github.com/Structured-Growth/sg-ui/commit/24b758011c2457fd0947c466b19e755ba3ee34d6) | [Accepted row](final-acceptance/wave-02-reconciliation.json); F/T/V-C05 | 21 HEAD files, 0 retired/unresolved |
| M-06 | [AppShell](../../packages/ui/src/components/AppShell/AppShell.tsx) | [d3201f0f](https://github.com/Structured-Growth/sg-ui/commit/d3201f0f0ca68aa006a880a2f63a9dd8d8c8845e) | [Accepted row](final-acceptance/wave-02-reconciliation.json); F/T/V-C06 | 4 HEAD files, 0 retired/unresolved |
| M-07 | [AuthShell](../../packages/ui/src/components/AuthShell/AuthShell.tsx) | [530bbc00](https://github.com/Structured-Growth/sg-ui/commit/530bbc00465d9dbf1e9948f8a2c01b2e51b1a479) | [Accepted row](final-acceptance/wave-02-reconciliation.json); F/T/V-C07 | 4 HEAD files, 0 retired/unresolved |
| M-08 | [AppModal](../../packages/ui/src/components/AppModal/AppModal.tsx) | [540f47d4](https://github.com/Structured-Growth/sg-ui/commit/540f47d4059a9cea8890b80927f34f51ef2fbc3e) | [Accepted row](final-acceptance/wave-04/coordinator/accepted-closures.json); F/T/V-C08 | 8 HEAD files, 0 retired/unresolved |
| M-09 | [SideNavigation](../../packages/ui/src/components/SideNavigation/SideNavigation.tsx) | [bd169b54](https://github.com/Structured-Growth/sg-ui/commit/bd169b54b0d245987289308d96eda39e059fccb9) | [Accepted row](final-acceptance/wave-02-reconciliation.json); F/T/V-C09 | 24 HEAD files, 0 retired/unresolved |
| M-10 | [ExperiencePageNavigator](../../packages/ui/src/components/ExperiencePageNavigator/ExperiencePageNavigator.tsx) | [9c9e2e83](https://github.com/Structured-Growth/sg-ui/commit/9c9e2e830d17d7c855f8af75f576aa950a4c6bea) | [Accepted row](final-acceptance/wave-04/coordinator/accepted-closures.json); F/T/V-C10 | 24 HEAD files, 0 retired/unresolved |
| M-11 | [CardCollectionWithFooter](../../packages/ui/src/components/CardCollectionWithFooter/CardCollectionWithFooter.tsx) | [530bbc00](https://github.com/Structured-Growth/sg-ui/commit/530bbc00465d9dbf1e9948f8a2c01b2e51b1a479) | [Accepted row](final-acceptance/wave-02-reconciliation.json); F/T/V-C11 | 11 HEAD files, 0 retired/unresolved |
| M-12 | [AppPaginationFooter (preserved CardPaginationFooter directory)](../../packages/ui/src/components/CardPaginationFooter/CardPaginationFooter.tsx) | [530bbc00](https://github.com/Structured-Growth/sg-ui/commit/530bbc00465d9dbf1e9948f8a2c01b2e51b1a479) | [Accepted row](final-acceptance/wave-02-reconciliation.json); F/T/V-C12 | 9 HEAD files, 0 retired/unresolved |
| M-13 | [ClassCardFrame](../../packages/ui/src/components/ClassCardFrame/ClassCardFrame.tsx) | [530bbc00](https://github.com/Structured-Growth/sg-ui/commit/530bbc00465d9dbf1e9948f8a2c01b2e51b1a479) | [Accepted row](final-acceptance/wave-02-reconciliation.json); F/T/V-C13 | 5 HEAD files, 0 retired/unresolved |
| M-14 | [InstructorClassCard](../../packages/ui/src/components/InstructorClassCard/InstructorClassCard.tsx) | [9c236b1a](https://github.com/Structured-Growth/sg-ui/commit/9c236b1a1185454b8b70ffc08e4c7ae1a8a19522) | [Accepted row](final-acceptance/wave-04/coordinator/accepted-closures.json); F/T/V-C14 | 19 HEAD files, 0 retired/unresolved |
| M-15 | [LearnerClassCard](../../packages/ui/src/components/LearnerClassCard/LearnerClassCard.tsx) | [540f47d4](https://github.com/Structured-Growth/sg-ui/commit/540f47d4059a9cea8890b80927f34f51ef2fbc3e) | [Accepted row](final-acceptance/wave-04/coordinator/accepted-closures.json); F/T/V-C15 | 26 HEAD files, 0 retired/unresolved |
| M-16 | [AppDataGrid](../../packages/ui/src/components/AppDataGrid/AppDataGrid.tsx) | [bd169b54](https://github.com/Structured-Growth/sg-ui/commit/bd169b54b0d245987289308d96eda39e059fccb9) | [Accepted current phase/G join](backlog-to-ten/performance-grid-closure.json); F/T/V-C16 | 89 HEAD files, 0 retired/unresolved |
| M-17 | [AppDataGridShell](../../packages/ui/src/components/AppDataGridShell/AppDataGridShell.tsx) | [540f47d4](https://github.com/Structured-Growth/sg-ui/commit/540f47d4059a9cea8890b80927f34f51ef2fbc3e) | [Accepted row](final-acceptance/wave-02-reconciliation.json); F/T/V-C17 | 74 HEAD files, 0 retired/unresolved |
| M-18 | [DataGridDragHandle/useDataGridRowDnd](../../packages/ui/src/components/AppDataGridRowDnd/DataGridDragHandle.tsx) | [bd169b54](https://github.com/Structured-Growth/sg-ui/commit/bd169b54b0d245987289308d96eda39e059fccb9) | [Accepted coordinator closure](final-acceptance/wave-04/coordinator/accepted-closures.json); F/T/V-C18 | 5 HEAD files, 0 retired/unresolved |
| M-19 | [LearnerClassesDataGrid](../../packages/ui/src/components/LearnerClassesDataGrid/LearnerClassesDataGrid.tsx) | [530bbc00](https://github.com/Structured-Growth/sg-ui/commit/530bbc00465d9dbf1e9948f8a2c01b2e51b1a479) | [Accepted row](final-acceptance/wave-02-reconciliation.json); F/T/V-C19 | 90 HEAD files, 0 retired/unresolved |
| M-20 | [DataToolbar](../../packages/ui/src/components/DataToolbar/DataToolbar.tsx) | [bd169b54](https://github.com/Structured-Growth/sg-ui/commit/bd169b54b0d245987289308d96eda39e059fccb9) | [Accepted row](final-acceptance/wave-02-reconciliation.json); F/T/V-C20 | 44 HEAD files, 0 retired/unresolved |
| M-21 | [DocumentEditorLayout](../../packages/ui/src/components/DocumentEditorLayout/DocumentEditorLayout.tsx) | [530bbc00](https://github.com/Structured-Growth/sg-ui/commit/530bbc00465d9dbf1e9948f8a2c01b2e51b1a479) | [Accepted row](final-acceptance/wave-04/coordinator/accepted-closures.json); F/T/V-C21 | 3 HEAD files, 0 retired/unresolved |
| M-22 | [DocumentEditorToolbar](../../packages/ui/src/components/DocumentEditorToolbar/DocumentEditorToolbar.tsx) | [540f47d4](https://github.com/Structured-Growth/sg-ui/commit/540f47d4059a9cea8890b80927f34f51ef2fbc3e) | [Accepted row](final-acceptance/wave-04/coordinator/accepted-closures.json); F/T/V-C22 | 24 HEAD files, 0 retired/unresolved |
| M-23 | [ContentEditorChrome](../../packages/ui/src/components/ContentEditorChrome/ContentEditorChrome.tsx) | [540f47d4](https://github.com/Structured-Growth/sg-ui/commit/540f47d4059a9cea8890b80927f34f51ef2fbc3e) | [Accepted row](final-acceptance/wave-04/coordinator/accepted-closures.json); F/T/V-C23 | 17 HEAD files, 0 retired/unresolved |
| M-24 | [EditableTitleField](../../packages/ui/src/components/EditableTitleField/EditableTitleField.tsx) | [72ae8cf0](https://github.com/Structured-Growth/sg-ui/commit/72ae8cf0e1d962b95ab32857653a9d339aafe3c6) | [Accepted row](final-acceptance/wave-02-reconciliation.json); F/T/V-C24 | 15 HEAD files, 0 retired/unresolved |
| M-25 | [FloatingTextSelectionToolbar](../../packages/ui/src/components/FloatingTextSelectionToolbar/FloatingTextSelectionToolbar.tsx) | [6c485ed7](https://github.com/Structured-Growth/sg-ui/commit/6c485ed79d0d6a521d188e5bde8315722296f518) | [Accepted row](final-acceptance/wave-04/coordinator/accepted-closures.json); F/T/V-C25 | 14 HEAD files, 0 retired/unresolved |
| M-26 | [RichTextFormattingToolbar](../../packages/ui/src/components/RichTextFormattingToolbar/RichTextFormattingToolbar.tsx) | [540f47d4](https://github.com/Structured-Growth/sg-ui/commit/540f47d4059a9cea8890b80927f34f51ef2fbc3e) | [Accepted row](final-acceptance/wave-04/coordinator/accepted-closures.json); F/T/V-C26 | 59 HEAD files, 0 retired/unresolved |
| M-27 | [InsertContentMenuControl](../../packages/ui/src/components/InsertContentMenuControl/InsertContentMenuControl.tsx) | [540f47d4](https://github.com/Structured-Growth/sg-ui/commit/540f47d4059a9cea8890b80927f34f51ef2fbc3e) | [Accepted row](final-acceptance/wave-04/coordinator/accepted-closures.json); F/T/V-C27 | 17 HEAD files, 0 retired/unresolved |
| M-28 | [TextAlignMenuControl](../../packages/ui/src/components/TextAlignMenuControl/TextAlignMenuControl.tsx) | [540f47d4](https://github.com/Structured-Growth/sg-ui/commit/540f47d4059a9cea8890b80927f34f51ef2fbc3e) | [Accepted row](final-acceptance/wave-04/coordinator/accepted-closures.json); F/T/V-C28 | 20 HEAD files, 0 retired/unresolved |
| M-29 | [TextColorPickerControl](../../packages/ui/src/components/TextColorPickerControl/TextColorPickerControl.tsx) | [72ae8cf0](https://github.com/Structured-Growth/sg-ui/commit/72ae8cf0e1d962b95ab32857653a9d339aafe3c6) | [Accepted row](final-acceptance/wave-04/coordinator/accepted-closures.json); F/T/V-C29 | 18 HEAD files, 0 retired/unresolved |
| M-30 | [TextStyleMenuControl](../../packages/ui/src/components/TextStyleMenuControl/TextStyleMenuControl.tsx) | [540f47d4](https://github.com/Structured-Growth/sg-ui/commit/540f47d4059a9cea8890b80927f34f51ef2fbc3e) | [Accepted row](final-acceptance/wave-04/coordinator/accepted-closures.json); F/T/V-C30 | 19 HEAD files, 0 retired/unresolved |
| M-31 | [ColumnsLayoutModal](../../packages/ui/src/components/ColumnsLayoutModal/ColumnsLayoutModal.tsx) | [530bbc00](https://github.com/Structured-Growth/sg-ui/commit/530bbc00465d9dbf1e9948f8a2c01b2e51b1a479) | [Accepted row](final-acceptance/wave-02-reconciliation.json); F/T/V-C31 | 14 HEAD files, 0 retired/unresolved |
| M-32 | [ImageUploadModal](../../packages/ui/src/components/ImageUploadModal/ImageUploadModal.tsx) | [540f47d4](https://github.com/Structured-Growth/sg-ui/commit/540f47d4059a9cea8890b80927f34f51ef2fbc3e) | [Accepted row](final-acceptance/wave-02-reconciliation.json); F/T/V-C32 | 18 HEAD files, 0 retired/unresolved |
| M-33 | [LinkUrlModal](../../packages/ui/src/components/LinkUrlModal/LinkUrlModal.tsx) | [530bbc00](https://github.com/Structured-Growth/sg-ui/commit/530bbc00465d9dbf1e9948f8a2c01b2e51b1a479) | [Accepted row](final-acceptance/wave-02-reconciliation.json); F/T/V-C33 | 15 HEAD files, 0 retired/unresolved |
| M-34 | [PageRichTextEditorSection](../../packages/ui/src/components/PageRichTextEditorSection/PageRichTextEditorSection.tsx) | [b861e86e](https://github.com/Structured-Growth/sg-ui/commit/b861e86ecae8cffce28d82c8534a079f70ce3c06) | [Accepted row](final-acceptance/wave-04/coordinator/accepted-closures.json); F/T/V-C34 | 91 HEAD files, 0 retired/unresolved; working X08 delta |
| M-35 | [Docs/native Typefaces catalog built from public Typography; no Typefaces runtime export](../../apps/docs/native-fixtures/scenarios/components/Typefaces/Typefaces.fixture.tsx) | [d3201f0f](https://github.com/Structured-Growth/sg-ui/commit/d3201f0f0ca68aa006a880a2f63a9dd8d8c8845e) | [Accepted row](final-acceptance/wave-02-reconciliation.json); F/T/V-C35 | 5 HEAD files, 0 retired/unresolved |
| M-36 | [Public/direct icons and activityTypeIcon](../../packages/ui/src/components/icons/activityTypeIcon.tsx) | [540f47d4](https://github.com/Structured-Growth/sg-ui/commit/540f47d4059a9cea8890b80927f34f51ef2fbc3e) | [Accepted row](final-acceptance/wave-02-reconciliation.json); F/T/V-C36 | 198 HEAD files, 0 retired/unresolved |
| M-37 | [Owned primitive aliases/barrels](../../packages/ui/src/components/primitives/Progress.tsx) | [9c9e2e83](https://github.com/Structured-Growth/sg-ui/commit/9c9e2e830d17d7c855f8af75f576aa950a4c6bea) | [Accepted row](final-acceptance/wave-02-reconciliation.json); F/T/V-C37 | 51 HEAD files, 0 retired/unresolved |

Exact per-row phase groups, source/test hashes, retained validation links and
remaining gaps are in the tracking map. No broad unit/browser regression matrix
was repeated for this reconciliation.

## Historical criterion review — 2026-10-07

Current-link maintenance (2026-10-17): links to removed story files now point to their docs-owned native fixture replacements. Historical execution claims below retain their original scope and dates.

Task slice: W-19/Z-10/Z-15, M-01–M-37 evidence reconciliation (2026-10-07).
Inspected exact source baseline `cca9452f384d5ffaa34ad5bd4ddd015b43a2870b`.
This is a bounded audit, not a production acceptance decision or a change to the
[master checklist](react-aria-execution-policy.md). No broad G/K/E/U/X/R/Z gate is closed.

“Shipped” below means implementation exists in this migration snapshot, not
merged, released or commercially licensed to a consumer. All 37 directories are
registered in the [owned source/transitive/token/layer guard](../../packages/ui/scripts/check-foundations.mjs).
The 34 runtime catalog directories have granular package exports, colocated tests
and stories. The [component barrel](../../packages/ui/src/components/index.ts) is reexported by
the [root](../../packages/ui/src/index.ts); [package exports](../../packages/ui/package.json) declare the
corresponding public subpaths. M-12 exports AppPaginationFooter from the preserved
CardPaginationFooter directory; M-18 exports DataGridDragHandle/useDataGridRowDnd.
M-35 is a Storybook catalog, not a missing Typefaces runtime export. M-36/M-37
use component barrels plus public /icons and /primitives barrels; direct icon
subpaths are preserved. The [package guard](../../packages/ui/scripts/check-package.mjs)
checks emitted APIs/declarations/removal; its presence is not a new execution result.

Recommendations assess the entire **individual inventory row**, with source,
behavior and existing recorded execution evidence. “Recommend (row only)” means
no uncovered criterion identified within that bounded row; it does not accept
all shared primitives or broad gates. “Hold” identifies insufficient evidence or
an unresolved inventory contract. Missing evidence is not a demonstrated defect.
Historical test passes belong to their reported head/runtime; none is relabeled
as a fresh pass at this baseline. Initial implementation PR attribution and tests
are recorded in the [execution record](archive/2026-10-18-task-lists/react-aria-progress.md) and
[draft PR #1](https://github.com/Structured-Growth/sg-ui/pull/1); targeted later
reports below record their distinct commits/PRs and limitations.

| ID / shipped implementation | Acceptance evidence (existing, not rerun) | Missing whole-row criteria / limits | Accepted-whole-task recommendation |
| --- | --- | --- | --- |
| M-01 AppButton (now exported as Button): shipped; [source](../../packages/ui/src/components/Button/Button.tsx), [tests](../../packages/ui/src/components/Button/Button.test.tsx) | [Contract](react-aria-button.md). Pointer/Enter/Space once, disabled/pending, native submit, ref, variants and SSR; named onPress breaking mapping. | None identified within this row; broad display/device/AT gates remain separate. | Recommend (row only) |
| M-02 AppInlineProgress: shipped; [source](../../packages/ui/src/components/AppInlineProgress/AppInlineProgress.tsx), [tests](../../packages/ui/src/components/AppInlineProgress/AppInlineProgress.test.tsx) | [Contract](react-aria-progress-avatar.md). Clamped/rounded percentage, translated progress name, widths and SSR; owned Progress and scoped CSS. | No row-specific recorded native reduced-motion and full label/layout state acceptance. | Hold |
| M-03 AppOperationSteps: shipped; [source](../../packages/ui/src/components/AppOperationSteps/AppOperationSteps.tsx), [tests](../../packages/ui/src/components/AppOperationSteps/AppOperationSteps.test.tsx) | [Contract](react-aria-progress-avatar.md). Ordered accessible status text, active progress, completed/error token styles, single/empty/SSR states. | Live state-transition announcement and full visual-state acceptance are not established by static semantics tests. | Hold |
| M-04 AppPageHeader: shipped; [source](../../packages/ui/src/components/AppPageHeader/AppPageHeader.tsx), [tests](../../packages/ui/src/components/AppPageHeader/AppPageHeader.test.tsx) | [Contract](react-aria-page-layout.md). Hierarchy, metadata/ref, collapsed breadcrumb menu, host routing, disabled actions and focus restoration. | No unresolved individual-row criterion identified after [criterion review](parallel-batch-60/page-navigation-evidence.md): retained C/W history plus exact fresh Firefox proof; current-head full-matrix/manual/device/AT gates remain separate. | Accepted (row only, coordinator review 2026-10-07) |
| M-05 AppPageTabs: shipped; [source](../../packages/ui/src/components/AppPageTabs/AppPageTabs.tsx), [tests](../../packages/ui/src/components/AppPageTabs/AppPageTabs.test.tsx) | [Contract](react-aria-page-layout.md). Tab/panel IDs, controlled/disabled/manual selection, route current state, focused overflowing route strip. | No unresolved individual-row criterion identified after [criterion review](parallel-batch-60/page-navigation-evidence.md): retained C/W history plus exact fresh Firefox proof; current-head full-matrix/manual/device/AT gates remain separate. | Accepted (row only, coordinator review 2026-10-07) |
| M-06 AppShell: shipped; [source](../../packages/ui/src/components/AppShell/AppShell.tsx), [tests](../../packages/ui/src/components/AppShell/AppShell.test.tsx) | [Contract](react-aria-modal-shells.md), [criterion reconciliation](#m-06-criterion-reconciliation-2026-10-07): native main landmark, host navigation, responsive collapse and independent main reflow. | No individual-row criterion remains uncovered. Historical Chromium raw results are no longer retained; reviewed execution record and source attribution remain. Composed navigation route handling has changed; broader account/manual/device/AT gates remain separate. | Accepted (row only, coordinator review 2026-10-07) |
| M-07 AuthShell: shipped; [source](../../packages/ui/src/components/AuthShell/AuthShell.tsx), [tests](../../packages/ui/src/components/AuthShell/AuthShell.test.tsx) | [Contract](react-aria-modal-shells.md). Host sections/headings/ref, content updates preserve field state, keyboard submit and host footer route. | Resilient native content sizing/reflow across narrow and enlarged-text states needs acceptance evidence. | Hold |
| M-08 AppModal: shipped; [source](../../packages/ui/src/components/AppModal/AppModal.tsx), [tests](../../packages/ui/src/components/AppModal/AppModal.test.tsx) | [Contract](react-aria-modal-shells.md). Nested dismissal/focus/portal tests, locks/reasons, actions/steps/sizes; [nested dialog report](parallel-batch-01/dialogs.md). | Removed-trigger focus recovery, actual AT, physical devices and complete native size/scroll matrix remain open. | Hold |
| M-09 SideNavigation: shipped; [source](../../packages/ui/src/components/SideNavigation/SideNavigation.tsx), [tests](../../packages/ui/src/components/SideNavigation/SideNavigation.test.tsx) | [Contract](react-aria-modal-shells.md). Selection/collapse/drilldown focus, account retry/concurrency; [adapter report](parallel-batch-01/adapters.md). | Full native expansion/collapse/navigation and AT/device matrix; adapter report excludes shell-wide acceptance. | Hold |
| M-10 ExperiencePageNavigator: shipped; [source](../../packages/ui/src/components/ExperiencePageNavigator/ExperiencePageNavigator.tsx), [tests](../../packages/ui/src/components/ExperiencePageNavigator/ExperiencePageNavigator.test.tsx) | [Contract](react-aria-page-navigation.md). Controlled authoring pages, add/rename/remove boundaries, keyboard Move and validated drag, read-only, stale-host changes. | Master previous/next/link wording mismatches the authoring list; coordinator must reconcile row intent. Complete native drag/focus/device acceptance remains open. | Hold |
| M-11 CardCollectionWithFooter: shipped; [source](../../packages/ui/src/components/CardCollectionWithFooter/CardCollectionWithFooter.tsx), [tests](../../packages/ui/src/components/CardCollectionWithFooter/CardCollectionWithFooter.test.tsx) | [Contract](react-aria-card-pagination.md). Stable keys, shrink/clamp, controlled footer, loading/empty and nested actions; recorded native one-column layout and scrolling. | Recorded container checks are representative; full responsive/container layout acceptance is not established. | Hold |
| M-12 CardPaginationFooter: shipped; [source](../../packages/ui/src/components/CardPaginationFooter/CardPaginationFooter.tsx), [tests](../../packages/ui/src/components/CardPaginationFooter/CardPaginationFooter.test.tsx) | [Contract](react-aria-card-pagination.md). Known/unknown/zero totals, disabled boundaries, translations, native form-safe actions and atomic size/page callbacks; recorded native pagination. | None identified within this row; broad device/AT gates remain separate. | Recommend (row only) |
| M-13 ClassCardFrame: shipped; [source](../../packages/ui/src/components/ClassCardFrame/ClassCardFrame.tsx), [tests](../../packages/ui/src/components/ClassCardFrame/ClassCardFrame.test.tsx) | [Contract](react-aria-card-frames.md), [F1 report](parallel-batch-39/frame-resize-native.md) and [criterion reconciliation](#m-13-criterion-reconciliation-2026-10-07): owned surface/slots, constants/style/SSR, original width matrix and full-engine live parent/slot reflow proof. | No unresolved individual-row criterion identified; physical device/zoom, spoken AT and broader U/X/R/Z gates remain separate. | Accepted (row only, coordinator review 2026-10-07) |
| M-14 InstructorClassCard: shipped; [source](../../packages/ui/src/components/InstructorClassCard/InstructorClassCard.tsx), [tests](../../packages/ui/src/components/InstructorClassCard/InstructorClassCard.test.tsx) | [Contract](react-aria-card-frames.md). Status/archive branches, translated/custom labels, host keyboard routes and SSR; recorded narrow long-name rendering. | No menu or persistence action exists in the preserved contract: reconcile master wording rather than invent APIs. Date/icon fallback matrix is not fully evidenced. | Hold |
| M-15 LearnerClassCard: shipped; [source](../../packages/ui/src/components/LearnerClassCard/LearnerClassCard.tsx), [tests](../../packages/ui/src/components/LearnerClassCard/LearnerClassCard.test.tsx) | [Contract](react-aria-card-frames.md). Normalized named progress, due formatter, translations, keyboard Continue once, safe links and Details fallback. | Complete due/status/action fallback and interactive-region native acceptance remains unproven. | Hold |
| M-16 AppDataGrid: shipped; [source](../../packages/ui/src/components/AppDataGrid/AppDataGrid.tsx), [tests](../../packages/ui/src/components/AppDataGrid/AppDataGrid.test.tsx) | [Contract](react-aria-catalog-grid.md). Public renderer/helpers/types, owned processing/state/cells, persistence/reset; [cell acceptance](react-aria-grid-cell-acceptance.md), [focus report](parallel-batch-01/grid-focus.md). | Row explicitly depends on complete G acceptance: busy semantics, AT/device, server races and broader processing/layout/performance gates remain open. | Hold |
| M-17 AppDataGridShell: shipped; [source](../../packages/ui/src/components/AppDataGridShell/AppDataGridShell.tsx), [tests](../../packages/ui/src/components/AppDataGridShell/AppDataGridShell.test.tsx) | [Contract](react-aria-catalog-grid.md). Shared list/cards criteria/selection/page owner, one footer, server pass-through, hydration-safe persistence and controlled reset. | Native view-switch/footer async focus and complete responsive shell acceptance remain open. | Hold |
| M-18 AppDataGridRowDnd: shipped; [source](../../packages/ui/src/components/AppDataGridRowDnd/DataGridDragHandle.tsx), [tests](../../packages/ui/src/components/AppDataGridRowDnd/DataGridDragHandle.test.tsx) | [Contract](react-aria-grid-reorder.md). Owned handle/preview/helper and bounded public reorder; [reorder report](parallel-batch-01/grid-reorder.md) records cancellation, Strict Mode, pending commit/rollback. | Physical touch long-press, spoken AT, cross-grid/dataset replacement boundaries and network race matrix remain open. | Hold |
| M-19 LearnerClassesDataGrid: shipped; [source](../../packages/ui/src/components/LearnerClassesDataGrid/LearnerClassesDataGrid.tsx), [tests](../../packages/ui/src/components/LearnerClassesDataGrid/LearnerClassesDataGrid.test.tsx) | [Contract](react-aria-catalog-grid.md), [criterion reconciliation](#m-19-criterion-reconciliation-2026-10-07): owned model/columns, localized due-date fallbacks, encoded links/actions and controlled host state. | No individual-row criterion remains uncovered; broad G/manual/device/AT and current-head full-matrix gates remain separate. | Accepted (row only, coordinator review 2026-10-07) |
| M-20 DataToolbar: shipped; [source](../../packages/ui/src/components/DataToolbar/DataToolbar.tsx), [tests](../../packages/ui/src/components/DataToolbar/DataToolbar.test.tsx) | [Contract](react-aria-data-toolbar.md). Search/clear/refresh/view, selection/columns/sort/filter drafts, locks, translated badge and composed processing tests. | Complete native menu placement, keyboard/AT and controlled-state interaction matrix remains open. | Hold |
| M-21 DocumentEditorLayout: shipped; [source](../../packages/ui/src/components/DocumentEditorLayout/DocumentEditorLayout.tsx), [tests](../../packages/ui/src/components/DocumentEditorLayout/DocumentEditorLayout.test.tsx) | [Editor layout contract](react-aria-editor-layout.md), [F6a report](parallel-batch-33/layout-replacement.md), and [criterion reconciliation](#m-21-criterion-reconciliation-2026-10-07): five unit/SSR/ref/region tests, four Chromium and eight Firefox/WebKit live chrome-replacement cases with exact retained host scroll/focus, immutable source attribution. | No unresolved individual-row criterion identified; arbitrary host chrome policy and broader E/U/X/R/Z/manual/device/AT gates remain separate. | Accepted (row only, coordinator review 2026-10-07) |
| M-22 DocumentEditorToolbar: shipped; [source](../../packages/ui/src/components/DocumentEditorToolbar/DocumentEditorToolbar.tsx), [tests](../../packages/ui/src/components/DocumentEditorToolbar/DocumentEditorToolbar.test.tsx) | [Contract](react-aria-editor-layout.md). Controlled heading/pressed actions, chooser commit before host focus, read-only zoom, missing callbacks and translated slots. | Full native responsive overflow and all toolbar menu/toggle states remain unproven. | Hold |
| M-23 ContentEditorChrome: shipped; [source](../../packages/ui/src/components/ContentEditorChrome/ContentEditorChrome.tsx), [tests](../../packages/ui/src/components/ContentEditorChrome/ContentEditorChrome.test.tsx) | [Contract](react-aria-editor-layout.md). Named action group, native anchor callback, pointer/Enter/Space once, pending/disabled, title save and read-only slots. | Complete editor/menu focus composition and responsive semantic layout acceptance remains unproven. | Hold |
| M-24 EditableTitleField: shipped; [source](../../packages/ui/src/components/EditableTitleField/EditableTitleField.tsx), [tests](../../packages/ui/src/components/EditableTitleField/EditableTitleField.test.tsx) | [Contract](react-aria-remaining-controls.md). Enter/blur/Escape, trim/empty/unchanged validation, pending/retry, host focus policy, composing Enter and SSR; recorded native save/rejection/focus. | None identified within this row; actual IME/device and broad AT acceptance are separate. | Recommend (row only) |
| M-25 FloatingTextSelectionToolbar: shipped; [source](../../packages/ui/src/components/FloatingTextSelectionToolbar/FloatingTextSelectionToolbar.tsx), [tests](../../packages/ui/src/components/FloatingTextSelectionToolbar/FloatingTextSelectionToolbar.test.tsx) | [Contract](react-aria-editor-layout.md). Alt+F10, pointer/keyboard selection preservation, queued cleanup, scroll/resize clamp, outside/Escape/blur and read-only. | Native anchoring/position/collision across hosts, browsers and physical devices remains open. | Hold |
| M-26 RichTextFormattingToolbar: shipped; [source](../../packages/ui/src/components/RichTextFormattingToolbar/RichTextFormattingToolbar.tsx), [tests](../../packages/ui/src/components/RichTextFormattingToolbar/RichTextFormattingToolbar.test.tsx) | [Contract](react-aria-formatting-toolbar.md). Named actions, controlled pressed/mixed styles, hidden/disabled callbacks, chooser focus sequencing, colors and link preparation. | Complete Lexical command/mixed selection matrix depends on open E-02/E-04 editor acceptance. | Hold |
| M-27 InsertContentMenuControl: shipped; [source](../../packages/ui/src/components/InsertContentMenuControl/InsertContentMenuControl.tsx), [tests](../../packages/ui/src/components/InsertContentMenuControl/InsertContentMenuControl.test.tsx) | [Contract](react-aria-editor-menus.md). Every insertion callback, disabled/unavailable commands, form-safe activation and host-dialog focus. | Complete native insertion-focus and live announcement acceptance remains unproven. | Hold |
| M-28 TextAlignMenuControl: shipped; [source](../../packages/ui/src/components/TextAlignMenuControl/TextAlignMenuControl.tsx), [tests](../../packages/ui/src/components/TextAlignMenuControl/TextAlignMenuControl.test.tsx) | [Contract](react-aria-editor-menus.md). All six alignments, indent/outdent restrictions, controlled checked state, Escape focus, translated RTL dark portal. | Complete native direction-aware command/presentation acceptance beyond unit portal attributes remains unproven. | Hold |
| M-29 TextColorPickerControl: shipped; [source](../../packages/ui/src/components/TextColorPickerControl/TextColorPickerControl.tsx), [tests](../../packages/ui/src/components/TextColorPickerControl/TextColorPickerControl.test.tsx) | [Contract](react-aria-editor-menus.md). Hex errors/normalize/no duplicate commit, swatches/native color, clear/background reset, host reopen/read-only and IME guard. | Native OS color chooser, complete foreground/background and AT interaction acceptance remain unproven. | Hold |
| M-30 TextStyleMenuControl: shipped; [source](../../packages/ui/src/components/TextStyleMenuControl/TextStyleMenuControl.tsx), [tests](../../packages/ui/src/components/TextStyleMenuControl/TextStyleMenuControl.test.tsx) | [Contract](react-aria-editor-menus.md). Eight style callbacks, checked host state, clear formatting, keyboard unavailable skipping/focus and translations. | Master typeface wording mismatches this control; typeface belongs to RichTextFormattingToolbar. Complete native style/selection focus matrix remains open. | Hold |
| M-31 ColumnsLayoutModal: shipped; [source](../../packages/ui/src/components/ColumnsLayoutModal/ColumnsLayoutModal.tsx), [tests](../../packages/ui/src/components/ColumnsLayoutModal/ColumnsLayoutModal.test.tsx) | [Contract](react-aria-editor-dialogs.md). Five owned radio presets, keyboard single commit/focus, Apply/Cancel/Escape, reopen/default reset, invalid runtime fallback and translations. | None identified within this row; broad modal/device/AT gates remain separate. | Recommend (row only) |
| M-32 ImageUploadModal: shipped; [source](../../packages/ui/src/components/ImageUploadModal/ImageUploadModal.tsx), [tests](../../packages/ui/src/components/ImageUploadModal/ImageUploadModal.test.tsx) | [Contract](react-aria-editor-dialogs.md). File/preview/errors, optional alt, duplicate prevention/cancel/retry; existing [upload lifetime](react-aria-editor-section.md#host-upload-lifetime-e-06-partial) and presentation-validation browser evidence. | Broader E-06 file/content/asset validation and upload matrix remain open; metadata checks do not establish byte/authorization acceptance. | Hold |
| M-33 LinkUrlModal: shipped; [source](../../packages/ui/src/components/LinkUrlModal/LinkUrlModal.tsx), [tests](../../packages/ui/src/components/LinkUrlModal/LinkUrlModal.test.tsx) | [Contract](react-aria-editor-dialogs.md). Shared URL policy, trim/Enter/unlink, host restrictions, cancellation/reopen/focus; [link destination evidence](react-aria-editor-section.md#link-destination-policy-e-06e-07-partial). | Full URL/protocol and native edit/remove/focus matrix beyond representative link fixtures remains open under E-06/E-07. | Hold |
| M-34 PageRichTextEditorSection: shipped; [source](../../packages/ui/src/components/PageRichTextEditorSection/PageRichTextEditorSection.tsx), [tests](../../packages/ui/src/components/PageRichTextEditorSection/PageRichTextEditorSection.test.tsx) | [Contract](react-aria-editor-section.md). Owned Lexical composition, nodes/plugins, host JSON/reload/read-only, links/images and native clipboard/upload/rich-document suites. | E-02/E-04 complete node/plugin/selection/history/table matrix, E-05 actual IME/device/AT and E-06/E-07 wider content/trust acceptance remain open. | Hold |
| M-35 Typefaces: shipped; [catalog](../../apps/docs/native-fixtures/scenarios/components/Typefaces/Typefaces.fixture.tsx) | [Contract](react-aria-remaining-controls.md). Production Provider/Tokens and native Typography roles including bodyAlt2/code; [Typography tests](../../packages/ui/src/experimental/Typography/Typography.test.tsx) and [SSR tests](../../packages/ui/src/experimental/Typography/Typography.ssr.test.tsx). | None identified within this story-only foundation catalog row; no Typefaces runtime export is expected. | Recommend (row only) |
| M-36 icons: shipped; [barrel](../../packages/ui/src/components/icons/index.ts), [tests](../../packages/ui/src/components/icons/icons.test.tsx) | [Contract](react-aria-icons.md). Complete documented symbol mapping, direct/public shared vectors, naming/ref/RTL and activity aliases/override/fallback tests; [catalog tests](../../packages/ui/src/experimental/icons/icons.test.tsx). | None identified within the icon mapping/activity row; full display/AT and legal/final tarball gates remain separate. | Recommend (row only) |
| M-37 primitives: shipped; [barrel](../../packages/ui/src/components/primitives/index.ts), [tests](../../packages/ui/src/components/primitives/primitives.test.tsx) | [Contract](react-aria-primitives.md). Owned public wrapper/barrel mappings and explicit removed types; public form/menu/table/ref tests plus interaction-level behavior tests. | Complete all-control native/AT/state acceptance remains open under U/X; documented removals do not prove that matrix. | Hold |

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


<a id="m-21-criterion-reconciliation-2026-10-07"></a>

## M-21 criterion reconciliation — 2026-10-07

Coordinator accepted the individual DocumentEditorLayout inventory row after independent criterion review at reviewed dev `496658081b8b8efcde21ab4f9b151adfd3aa32fe`. This upgrades the previously held row, not broad editor/scroll/AT acceptance.

- Tokenized regions: owned implementation/compiled component-layer CSS/generated tokens, public granular export and registered whole-directory boundaries; five existing unit tests cover ordered/optional regions, native style/ref/title, keyboard traversal, stable host focus/ref on replacement and SSR.
- Scroll boundaries: the layout introduces no scroll owner. Native focus/scroll/node/ref/geometry assertions confirm only the host content scrolls while root/wrapper/document and header remain stationary.
- Concrete missing live replacement: finalized F6a worker `f00ba53b1346202ef9e2152f0bec7f22936ef5c6` contributed source/spec bytes to clean testing candidate `e6270941ea8828d8868fef0798451a599a9db25f`; four Chromium cases passed across both themes at260px and normal/200%text. Exact file-byte attribution and root immutable source/build hashes are recorded in its report.
- Supported engines: reviewed dev4966580 wave26 `artifacts/browser-pool/62606ae5-219b-4fc7-816f-fb51691ea5fd/layout-replacement/{evidence.json,results.json}` has eight Firefox/WebKit passes, zero unexpected/skipped/flaky. Root evidence confirms clean identical initial/final head/source/build and owned commands settled. Other failed shards remain red and do not invalidate this passing shard. Source/spec are unchanged from finalized F6a.

No row-specific criterion remains uncovered. Physical browser zoom/device, assistive technology, arbitrary oversized host chrome and broad E/U/X/R/Z gates are not closed by this acceptance.


<a id="m-13-criterion-reconciliation-2026-10-07"></a>

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

<a id="m-06-criterion-reconciliation-2026-10-07"></a>

## M-06 criterion reconciliation — 2026-10-07

Coordinator accepted the individual AppShell row after independent criterion review against dev `2d6f357d10b2a65bc988aba6280e69f92f3b1147`. Source and CSS plus the native spec are byte-identical to reviewed engine proof.

- Landmark/layout: native main, label/ref, host navigation and SSR unit evidence; one main with positive usable dimensions in browser assertions.
- Responsive navigation: both themes at900→641→640→639→320→900px, stacking, navigation height cap, collapse/expand and retained input state.
- Main-content reflow:320×360 normal/200% text, no horizontal overflow, actual wheel scrolling, independent scrollports and forward/reverse focus through twelve controls with geometry/hit/focus checks.
- Native evidence: six previously reviewed Chromium cases at `2ee06dbabe4c0d889e53cf6fbe7843c9f668f23e`, finalized report-only history `3ee099c096ef9bfd33e2a409756cf32d4de74396`; original raw Chromium results are no longer present, and that retention limitation remains explicit. Twelve preserved Firefox/WebKit cases passed at `496658081b8b8efcde21ab4f9b151adfd3aa32fe`, zero skipped/flaky/unexpected/retries, integration artifact `artifacts/browser-pool/62606ae5-219b-4fc7-816f-fb51691ea5fd/shell-responsive-native/`. Root head/source/build immutable and owned commands settled; unrelated failed shards remain failed.
- AppShell source SHA256 `4038fed4e3c0826efbb721fcf0216cb7c40b29e9063b59e478aa21c63f12c731`; CSS `214d73c5ea62e9601aedfa4cd356e6ec5c42c93cad89302a6956d66a35fc7d32`; spec `95d3eb8a0d1a95f2a6026738c4e80f4d4e07ce44f7b655d1d2a8cb5b709beec1`. Direct runtime closure is React/CSS. Composed SideNavigation drilldown routing changed afterward; collapse/layout paths and CSS exercised here remain unchanged, not the entire composition.

Physical browser zoom/device, spoken AT, full SideNavigation/account and production current-head full-matrix gates remain open.

<a id="m-19-criterion-reconciliation-2026-10-07"></a>

## M-19 criterion reconciliation — 2026-10-07

Coordinator accepted the individual LearnerClassesDataGrid row after independent criterion review against dev `2d6f357d10b2a65bc988aba6280e69f92f3b1147`.

- Owned model/columns: host presentation model and owned columns/action builder, no application contracts; five unit tests cover namespace/header/options and state requests.
- Date/link/action: valid Intl dates across live en→de→en, missing/invalid fallbacks, encoded course-name/Details destinations and safe activity links with isolated opener; real keyboard requests occur once and return focus.
- Host callbacks/state: no application fetch; controlled server rows/rejected pages, processed client sorting/page-zero order; actual withheld/rejected/accepted row replacement and current destinations.
- Native evidence: eight Chromium passes at candidate `e6270941ea8828d8868fef0798451a599a9db25f`, managed batch45 token `400c7da0`; sixteen Firefox/WebKit passes at reviewed dev `496658081b8b8efcde21ab4f9b151adfd3aa32fe`, integration artifact `artifacts/browser-pool/62606ae5-219b-4fc7-816f-fb51691ea5fd/learner-grid-cells/`. Both shards have zero skipped/flaky/unexpected/retries, immutable root head/source/build; cross-browser owned commands settled. Other root failures remain separate. Final worker `b8e18ea` is integrated.
- Source SHA256 `825d8a1d9de34de220997e0afe1ccefc63e03f72366af7cf58c9b37489db1c99`; unit `f243555780278fa41b7536f0cc1c4b980669f34c7241ee70d583a84eb7ac2edd`; native story `498605566cf8b7f9a17373138e8fd0e7019d19b9022301fd32c90edcb47d5fb1`; spec `e96f5cae1ae3dbde14f06f4406ff0d34c0efe29182ea973f3605be40b7a3b935`. Relevant component/spec and grid/link/menu/date/adapter/i18n runtime paths are unchanged through reviewed dev.

Broad grid G/manual/device/AT and production current-head full-matrix acceptance remain open.
