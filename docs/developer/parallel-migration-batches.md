# Parallel migration batches

Coordinator: Codex chat `01a1164f-41db-7f30-aaf9-f20133b6566f`.
Started: 2026-10-07. Batch 1 baseline: `9f153642e827a14033d646cf0160730c0793bdfc`.

The user authorized parallel chats, completion reporting and subsequent batches.
Each worker creates an isolated managed worktree at this baseline before editing.
Existing uncommitted image-upload work in the primary checkout is excluded.

| Assignment | Backlog coverage | Exclusive write ownership |
| --- | --- | --- |
| calendar | K-03–K-10, K-17 (bounded acceptance slice) | src/experimental/{DateField,Calendar,DatePicker,DateRangePicker,DateRangeSelector,TimeField}/; docs/developer/react-aria-calendar-contracts.md; tests/browser/batch01-calendar.spec.ts |
| grid-focus | G-16, G-29 (bounded acceptance slice) | src/components/AppDataGrid/ownedGridInteraction.tsx, ownedGridInteraction.module.css, ownedGridInteraction.test.tsx, ownedGridInteraction.stories.tsx, ownedGridLayoutController.ts, ownedGridLayoutController.test.tsx; tests/browser/batch01-grid-focus.spec.ts |
| grid-reorder | G-17, G-18, G-28, X-08 (bounded acceptance slice) | src/components/AppDataGridRowDnd/; docs/developer/react-aria-grid-reorder.md; tests/browser/batch01-grid-reorder.spec.ts |
| dialogs | U-08, U-19, X-04, X-05 (bounded acceptance slice) | src/experimental/Dialog/; src/components/AppModal/; docs/developer/react-aria-modal-shells.md; tests/browser/batch01-dialogs.spec.ts |
| selectors | U-06, X-16 (bounded acceptance slice) | src/experimental/{Select,ComboBox,AsyncMultiSelect}/; tests/browser/batch01-selectors.spec.ts |
| forms | U-04, U-05, U-18 (bounded acceptance slice) | src/experimental/{TextField,Checkbox,Switch,RadioGroup}/; tests/browser/batch01-forms.spec.ts |
| translations | H-07, H-08, H-09 (bounded acceptance slice) | src/i18n/; docs/developer/react-aria-i18n-acceptance.md |
| adapters | H-01, H-03, H-04, H-05, U-10 (bounded acceptance slice) | src/adapters/; docs/developer/react-aria-host-adapter-acceptance.md; tests/browser/batch01-adapters.spec.ts |
| packaging | A-18, E-08, R-03–R-05, R-09, X-20, Z-08 (bounded acceptance slice) | scripts/check-package.mjs; scripts/test-foundation-consumer.mjs; scripts/test-editor-consumer.mjs; scripts/package-consumer.tsx; docs/developer/react-aria-package-acceptance.md |
| docs | W-06, W-07, W-11–W-18 (bounded acceptance slice) | README.md; docs/migration.md; docs/agent-guidance-migration.md; docs/developer/component-architecture.md; docs/developer/react-aria-component-recipe.md; docs/developer/react-aria-adoption-checklist.md |

Each worker additionally owns `docs/developer/parallel-batch-01/<assignment>.md`.
Workers leave shared AGENTS.md, the master list and progress record to the coordinator.
Completion reports include branch/worktree, commit/PR, changed files, exact validation,
remaining gates and proposed next task. An unchecked broad gate is not closed by a
partial slice. Coordinator reviews evidence before reconciling central records.

Heavy checks and browser servers use one shared atomic directory lock:
`/tmp/sgui-parallel-batch-01-validation.lock`. Each worker releases only its own lock.
Build Storybook before browser execution; never rebuild during a suite run.

Later batches are selected from reviewed results and dependencies; maximum ten
workers at a time and disjoint file ownership. On 2026-10-07 the user authorized
consolidation merges into `codex/dev`; main merges and publication remain outside scope.

Coordinator heartbeat: `coordinate-sgui-parallel-migration`, every ten minutes.
All ten workers were observed active after dispatch.

| Assignment | Worker chat ID |
| --- | --- |
| calendar | `01a11651-f6c8-70d1-bb12-d8756b9016ab` |
| grid-focus | `01a11651-f976-7b52-8de1-02f8b7ca2b0f` |
| grid-reorder | `01a11651-fcb0-7ef2-a0f1-698157fa3383` |
| dialogs | `01a11651-ff79-7520-9bf2-73324e1bf372` |
| selectors | `01a11652-03c8-7da2-88ef-e43f354c1aa9` |
| forms | `01a11652-0b2b-7802-a0a5-70bd59a3798a` |
| translations | `01a11652-134a-7610-992e-9498b718417c` |
| adapters | `01a11652-1997-7a31-bfdd-c9c85c6f6cd4` |
| packaging | `01a11652-2110-7621-8552-18c7c7929030` |
| docs | `01a11652-258a-77f0-8294-06567c784d2f` |

## Rolling follow-up: documentation

Batch-01 docs completed its bounded slice at `9554f1e`; draft [PR #2](https://github.com/Structured-Growth/sg-ui/pull/2).
Initial ownership and consumer example review found no blocking issue. Worker reports
89 links/anchors and 12 imports checked; broad W/G/K/E/U/X/R/Z gates remain open.

The freed slot is assigned to `architecture-docs` in chat `01a11656-bbca-75a1-8f17-0e63fcad436b`.
It starts from the verified docs commit, with a stacked PR dependency on #2, and
owns only architecture/primitives/proof-control guides plus its batch-02 report.
Task: reconcile stale AppButton.onClick, menu density and theme-removal claims
against shipped source. Other workers keep their original exclusive ownership.

Architecture docs completed at `f61d288`, stacked draft [PR #3](https://github.com/Structured-Growth/sg-ui/pull/3).
Coordinator verified the four-file boundary and whitespace, reviewed contract corrections;
worker reports 50 links/anchors and source/type/default/export checks passed.
The freed slot now belongs to `setup-docs`, chat `01a11659-4536-7071-b330-906fec936382`, baseline `f61d288`.
It owns setup guidance, PR/issue guidance templates, optional validation troubleshooting
and its batch-03 report; workflows, permissions and secrets stay outside write scope.

Setup guidance completed at `d8342a1`, stacked draft [PR #4](https://github.com/Structured-Growth/sg-ui/pull/4).
Five-file scope/whitespace and template/setup changes reviewed. Coordinator independently
verified the official GitHub approval-required default-token PR event exception;
actual repository runtime events/settings remain unverified. Worker reports 26 local
links and YAML/source assertions passed.

The freed slot belongs to `release-audit`, chat `01a1165d-cfe7-77d0-b0d1-ffb3823b71aa`, baseline `d8342a1`.
It writes only release/AI validation evidence and its batch-04 report. Workflows,
permissions and secrets remain read-only; no workflow dispatch, approval or publication.

## Development integration

The user requested consolidation for continued development on `codex/dev`.
Integration worktree: `/Users/thomashall/.codex/worktrees/dev-integration/sg-ui`.
Completed PR heads #1–#14 are incorporated with full-history merge commits. Original
task branches remain available; worker validation and later report commits can continue.
The primary checkout's image-upload validation patch and its new browser test were
copied without editing the original checkout. Unrelated `.obsidian` metadata is excluded.
New assignments use the verified dev head; completed older-base assignments are
reviewed and integrated on dev. Main and publication remain unchanged.


## Validation policy update — 2026-10-07

User explicitly replaced per-task/per-integration full validation with targeted
checks and occasional full runs. Follow the [development validation policy](react-aria-development-validation.md).
Initial cadence: one checkpoint per 24 hours while new code lands; concrete
regressions may justify earlier broader checks. Checkpoint failures become bounded
repair tasks. Preserve full production/main acceptance and manual/device/AT gates.

Existing evidence before this policy change: combined head `ac8a864` passed Node 24
`pnpm check` (148 files/1031 tests), Storybook, React 18/19 packed foundation consumers
and 26 Chromium/WebKit form/dialog/adapter/image cases. Head `75b7c3f` including
selectors passed check (148 files/1038 tests), Storybook and 10 selector browser cases
in Chromium/WebKit. Firefox profile creation failed before behavior ran; those
passes do not establish the complete browser or consumer matrix. No additional
full run is required for this documentation/CI-selection change.


## Reviewed completions and batch 05

Calendar, grid focus and row reorder reports/ownership/implementation diffs reviewed;
conflict-free full-history merges pushed on `codex/dev` at `cca9452`. Targeted worker
evidence is accepted for these bounded slices (calendar 18, grid focus 10, reorder
16 Chromium/WebKit cases); Firefox launch remains blocked and no broad checkbox
was closed. Main and primary image-upload work remain untouched. Reports:
[calendar](parallel-batch-01/calendar.md), [grid focus](parallel-batch-01/grid-focus.md),
[row reorder](parallel-batch-01/grid-reorder.md).

Ten new batch-05 chats start from that reviewed dev commit. Each creates one
isolated managed worktree before editing and owns the report
`docs/developer/parallel-batch-05/<assignment>.md`. Targeted validation policy applies.

| Assignment | Task IDs | Chat | Exclusive scope |
| --- | --- | --- | --- |
| native-reset | U-18/K-06 | `01a11673-bf82-7d02-b0fb-dec3fd38ece5` | src/experimental/useFormReset.ts; src/experimental/DatePicker/; src/experimental/AsyncMultiSelect/; tests/browser/batch05-native-reset.spec.ts |
| portal-direction | H-06/U-19 | `01a11673-c27a-71c1-87c6-ceff07fc40e6` | src/foundation/ThemeScope.tsx; src/foundation/ThemeScope.test.tsx; src/foundation/ThemeScope.stories.tsx; src/experimental/Provider/; src/experimental/Menu/; src/experimental/Popover/; tests/browser/batch05-portal-direction.spec.ts |
| grid-busy | G-15/G-16 | `01a11673-c572-7720-9c5e-2f67d7094741` | src/components/AppDataGrid/ownedGridInteraction.tsx; src/components/AppDataGrid/ownedGridInteraction.test.tsx; src/components/AppDataGrid/ownedGridInteraction.stories.tsx; tests/browser/batch05-grid-busy.spec.ts |
| tabs-overflow | U-09 | `01a11673-c7d0-75a2-948c-0c07aece3334` | src/experimental/Tabs/; tests/browser/batch05-tabs-overflow.spec.ts |
| grid-processing | G-04/G-08 | `01a11673-cb15-77b2-b6f0-d61b86ab60d4` | src/components/AppDataGrid/ownedGridModel.ts; src/components/AppDataGrid/ownedGridModel.test.ts; src/components/AppDataGrid/ownedGridProcessing.test.tsx; src/components/AppDataGrid/ownedGridProcessing.stories.tsx |
| grid-shell-state | G-05/H-16/H-17 | `01a11673-cd99-7ae2-aa71-66c193c16169` | src/components/AppDataGridShell/; tests/browser/batch05-grid-shell-state.spec.ts |
| grid-clipboard | G-21 | `01a11673-d03b-7653-8c82-6d3dec436862` | src/components/AppDataGrid/components/table-cell/CopyableTableCell.tsx; src/components/AppDataGrid/components/table-cell/CopyableTableCell.test.tsx; src/components/AppDataGrid/ownedGridCells.tsx; src/components/AppDataGrid/ownedGridCells.test.tsx; src/components/AppDataGrid/ownedGridCells.stories.tsx; tests/browser/batch05-grid-clipboard.spec.ts |
| due-date | H-12 | `01a11673-d2b3-76a0-9fc3-3d33770c2276` | src/utils/formatDueDateLabel.ts; src/utils/formatDueDateLabel.test.ts; src/components/LearnerClassCard/formatDueDateLabel.ts; src/components/LearnerClassCard/formatDueDateLabel.test.ts; docs/developer/react-aria-due-date-acceptance.md |
| firefox-runtime | R-11/X-12 environment gate | `01a11673-d610-7a21-8f5c-7ee133ca6623` | docs/troubleshooting/firefox-profile-launch.md; scripts/diagnose-firefox-profile.mjs |
| inventory-evidence | W-19/Z-10/Z-15 M-01–M-37 reconciliation | `01a11673-d972-7d91-ae69-c05815612438` | docs/developer/react-aria-migration-inventory-acceptance.md |

Checkpoint: 61/326 (18.7%) all tasks; 61/320 (19.1%) required. 37 inventory rows need whole-task status reconciliation; batch-05 audit owns the evidence. Delta 0 accepted tasks; ETA not reliable.


## Batch 05 processing completion and batch 06 successor

[Processing report](parallel-batch-05/grid-processing.md) at `22d92ac` reviewed:
only the owned model test/report changed,13 meaningful boundary regressions added,
51 targeted tests/typecheck/foundation guards passed on Node24. No runtime defect.
PR15 integrated via full-history merge on dev `e80a269`; broadG04/G08 remain open.
Freed slot assigned to new chat `01a11676-7962-72f2-b412-d239071ca71f`, grid-sort
(G08/U17), baseline `e80a269`. Exclusive ownership: ownedGridParts implementation/test,
new ownedGridSortAcceptance story/test, header sort menu test, DataToolbarSortMenu
implementation/test/CSS, batch06-grid-sort browser spec and unique batch06 report.
Other grid interaction/cell/shell/model and experimental overlay files remain read-only.
Targeted validation applies; maximum ten active chats retained.


## Tabs and inventory completion review

PR16 tabs report/source ownership reviewed and merged: horizontal/RTL native
activation/overflow coverage,18 related tests and16 Chromium/WebKit cases passed;
Firefox/vertical/device/AT remain unverified. PR17 inventory audit/report reviewed:
37 rows,136 links and two-file scope verified; six recommendations accepted only
for their individual row criteria after source/test/contract review and unchanged
implementation comparison with the tested75b7c3 snapshot. Master adds six scoring
checkboxes for existing IDs, not new tasks. Remaining31 rows held; broad gates open.
The accepted-count delta is evidence reconciliation, not new-feature throughput.


## Batch07 successors

New chats use reviewed dev `fbaba5b` with exclusive scopes:

| Task | Chat | Ownership |
| --- | --- | --- |
| progress-status (M-02/M-03 bounded acceptance) | `01a11678-be5b-7b90-99d0-67b025fe8c10` | src/components/AppInlineProgress/; src/components/AppOperationSteps/; tests/browser/batch07-progress-status.spec.ts; docs/developer/parallel-batch-07/progress-status.md |
| catalog-tabs (M-05/U-09 bounded acceptance) | `01a11678-c0d7-7f33-9a88-25e2cfe54643` | src/components/AppPageTabs/; tests/browser/batch07-catalog-tabs.spec.ts; docs/developer/parallel-batch-07/catalog-tabs.md |

Acceptance checklist: 67/326 (20.6%), required 67/320 (20.9%). Six accepted-row delta is evidence reconciliation;31 inventoried rows held. ETA not reliable. Grid-busy PR19 report received, awaitingreview.


## Batch05 defect reviews and batch08 successors

Portal direction(PR22), nativegrid busy(PR19) anddue locale fallback(PR20)
file ownership/source/targeted evidence reviewed; conflict-free history-preserving
merges pusheddev `d771320`. Reports: [direction](parallel-batch-05/portal-direction.md),
[busy](parallel-batch-05/grid-busy.md), [due dates](parallel-batch-05/due-date.md).
366related direction tests,68busy tests and59due tests per4timezones passed;
direction/busy focused Chromium-WebKit cases passed,Firefox launch remainedblocked.
No whole-task acceptance increase or full integration rerun inferred.

Three new batch08 chats start from reviewed `d771320`; exclusive allowlists:

| Task | Chat | Ownership |
| --- | --- | --- |
| selector-direction (H-06/U-19) | `01a1167a-e019-7250-8363-4aa1f9ea9237` | src/experimental/Select/; src/experimental/ComboBox/; tests/browser/batch08-selector-direction.spec.ts; docs/developer/parallel-batch-08/selector-direction.md |
| grid-retry-focus (G-15/G-16) | `01a1167a-e25f-7c62-a2b4-126127c725ab` | src/components/AppDataGrid/ownedGridInteraction.tsx; src/components/AppDataGrid/ownedGridInteraction.test.tsx; src/components/AppDataGrid/ownedGridInteraction.stories.tsx; tests/browser/batch08-grid-retry-focus.spec.ts; docs/developer/parallel-batch-08/grid-retry-focus.md |
| due-label-composition (M-15/H-12) | `01a1167a-e64f-7ff2-83b9-8cd88b6f25de` | src/components/LearnerClassCard/; tests/browser/batch08-due-label.spec.ts; docs/developer/parallel-batch-08/due-label-composition.md |


## Due-label composition review and batch09

[PR24 report](parallel-batch-08/due-label-composition.md) reviewed: exact two-file
test/report scope,12 composition regressions,17cardtests across3timezones plus
type/foundation passes. No runtime defect. Full-history merge pusheddev `e372781`.
Browser ICU/React18 packed/cross-timezone or advancing-clock hydration remainopen;
reserve fixed-clock browser ICU slice for a later validation slot.
Freed slot assigned to new documentation-only chat `01a1167d-8163-7ab0-a8dc-60ec2e2ebe6a`,
baseline `e372781`, inventory-contract-wording (W19/M10/M14/M30). Exclusive files:
`docs/developer/react-aria-inventory-contract-reconciliation.md` and
`docs/developer/parallel-batch-09/inventory-contract-wording.md`. It proposes exact
criteria mappings/wording without silently dropping required behavior; central
checklists remain coordinator-owned. Maximumtenactiveworkers, targeted policy.


## Automatic development CI pause — 2026-10-07

User requested holding GitHub CI while consolidating development. CI andPR-title
workflows exclude codex/dev PR base at trigger;dev pushes already excluded.
Targeted local worker evidence and occasional local full checkpoints continue.
Production-bound/main/reusable release validation and permissions are preserved.
Cancel only queued/running CI/title pull-request runs verified to targetcodex/dev.
Historical failures/cancellations remain visible, not passed evidence.
Workers/coordinator must not wait for dev GitHub checks or attempt to re-enable
automation. Grid-clipboard PR18 completion received during this change, queued
for ownership/evidence review after the CI policy update.


## Connectivity recovery, defect review and batch10

Git remote andGitHub read-only API connectivity verified afterlocationchange.
DevCI/title pause pushed4758ca8; workers/coordinator retainLOCALtargeted checks and
localoccasional checkpoints, noGitHub devcheck waits/reruns. Cancellation requested
for activeverifieddevPR runs; historicalfailures remainvisible, notpassed.
PR18copy lifetime/stale availability andPR28selector direction ownership/evidence
reviewed, conflict-freehistorymerges pusheddev061a882. PR27standaloneFirefox
diagnostic reviewed/integrated: native/Playwrightfail beforeSGUI, app-dataEPERM,
stopunchangedretries untilenvironmentchanges. HistoricalLinuxevidence keptseparate.
Reports: [clipboard](parallel-batch-05/grid-clipboard.md),
[Firefox](parallel-batch-05/firefox-runtime.md),
[selectors](parallel-batch-08/selector-direction.md).
Native-resetPR21 andshell-statePR26reports received; reviewpending. Separate
WebKitportal-focus historicalfailure reservedfortargetedlocalreproduction.

Three newbatch10chats use revieweddev061a882 andexclusive scopes:

| Task | Chat | Ownership |
| --- | --- | --- |
| page-header-reflow (M-04/U-19) | `01a116a4-f72f-7853-b068-47a3e2ebe9cb` | src/components/AppPageHeader/; tests/browser/batch10-page-header-reflow.spec.ts; docs/developer/parallel-batch-10/page-header-reflow.md |
| auth-shell-reflow (M-07/U-02) | `01a116a4-fa98-7d20-a217-302eca6279e1` | src/components/AuthShell/; tests/browser/batch10-auth-shell-reflow.spec.ts; docs/developer/parallel-batch-10/auth-shell-reflow.md |
| card-frame-reflow (M-13/U-02) | `01a116a4-fd4c-7ab3-acfa-d29891b53fef` | src/components/ClassCardFrame/; tests/browser/batch10-card-frame-reflow.spec.ts; docs/developer/parallel-batch-10/card-frame-reflow.md |


## Concurrency expansion and batch11

User authorized increasing concurrency above10. Current cap16; browsers retain the existing lock/priority queue until a reviewed isolated-port slot pool is available. Targeted local checks and paused dev GitHub CI continue. Reviewed PR21 native reset, PR26 composed grid shell and PR29 contract wording merged and pushed at `d0fcc6298004ad23d1a75480b216b39142e6df96`. Runtime/native evidence accepted as bounded slices only; M10/M14/M30 owner criteria decisions remain open.

Nine new chats use that verified baseline and exclusive allowlists:

| Task | Chat | Ownership |
| --- | --- | --- |
| async-direction (H-06/U-19) | `01a116aa-47a8-7ac0-a7b1-031fc11b4a1b` | src/experimental/AsyncMultiSelect/; tests/browser/batch11-async-direction.spec.ts; docs/developer/parallel-batch-11/async-direction.md |
| standalone-form-reset (U-18/K-06) | `01a116aa-4ad8-7a43-9bad-fbd7ab927463` | src/experimental/TextField/; src/experimental/DateField/; tests/browser/batch11-standalone-reset.spec.ts; docs/developer/parallel-batch-11/standalone-form-reset.md |
| grid-page-shrink (G-05/H-16) | `01a116aa-4e1c-7150-8ef2-ca9dbef2a3a4` | src/components/AppDataGrid/ownedGridController.ts; src/components/AppDataGrid/ownedGridController.test.ts; src/components/AppDataGrid/ownedGridState.ts; src/components/AppDataGrid/ownedGridState.test.ts; src/components/AppDataGrid/ownedGridPageShrink.test.tsx; docs/developer/parallel-batch-11/grid-page-shrink.md |
| filter-draft-transactions (G-09/U-07) | `01a116aa-514d-7f53-89d8-93e3882da963` | src/components/DataToolbar/components/DataToolbarFilterMenu.tsx; src/components/DataToolbar/components/DataToolbarFilterMenu.test.tsx; src/components/DataToolbar/components/DataToolbarFilterMenu.module.css; src/components/DataToolbar/filterRuleValue.ts; src/components/DataToolbar/filterRuleValue.test.ts; docs/developer/parallel-batch-11/filter-draft-transactions.md |
| account-action-lifetime (H-04/H-05) | `01a116aa-5554-7eb1-8466-64cfa41a40e6` | src/adapters/accounts.tsx; src/adapters/accounts.test.tsx; src/adapters/accounts.stories.tsx; docs/developer/parallel-batch-11/account-action-lifetime.md |
| icu-parser-boundaries (H-08) | `01a116aa-587d-71d2-bc80-6d9009dfab9f` | src/i18n/icu.ts; src/i18n/icu.test.ts; docs/developer/parallel-batch-11/icu-parser-boundaries.md |
| editor-serialization (E-02/E-07) | `01a116aa-5bc3-7341-b095-6b2e95cba18b` | src/components/PageRichTextEditorSection/lexical/serializeEditorDocument.ts; src/components/PageRichTextEditorSection/lexical/serializeEditorDocument.test.ts; docs/developer/parallel-batch-11/editor-serialization.md |
| editor-link-activation (E-07) | `01a116aa-5f39-7342-92d7-a46180801075` | src/components/PageRichTextEditorSection/lexical/OwnedLinkActivationPlugin.tsx; src/components/PageRichTextEditorSection/lexical/OwnedLinkActivationPlugin.test.ts; src/components/PageRichTextEditorSection/lexical/OwnedLinkNode.ts; src/components/PageRichTextEditorSection/lexical/OwnedLinkNode.test.ts; docs/developer/parallel-batch-11/editor-link-activation.md |
| public-api-reconciliation (Z-13/W-13) | `01a116aa-6384-7da2-8008-98ff10422683` | docs/developer/react-aria-public-api-reconciliation.md; docs/developer/parallel-batch-11/public-api-reconciliation.md |

Completion reports received for grid-retry-focus and batch11 serialization, filters, ICU, account lifetime and page shrink; they await exact diff/evidence review. No broad checklist items closed. Acceptance remains67/326 (20.6%), required67/320 (20.9%), delta0;31 inventory rows held. ETA not reliable.

## Batch12 browser parallelism

New chat `01a116ad-fb4d-7891-9b4b-359e6ab91ea0` owns only playwright.config.ts, scripts/serve-browser-storybook.mjs, scripts/browser-validation-pool.mjs, scripts/browser-validation-pool.test.mjs, docs/developer/react-aria-parallel-browser-validation.md and its unique parallel-batch-12/browser-pool.md report. Baseline d0fcc6298004ad23d1a75480b216b39142e6df96. Goal: opt-in isolated ports/output, atomic two-browser slot pool and separate build exclusion, preserving defaults and current active queue. No rollout before targeted isolation/cleanup checks and coordinator review.

PR39 link activation, PR40 async direction and PR41 API audit reports also received, pending diff/evidence review. API/ref/export decisions and client page-shrink/async busy findings reserved; no broad task upgraded.
