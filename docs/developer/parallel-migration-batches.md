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
Current PR heads #1–#7 are incorporated with full-history merge commits. Original
task branches remain available; worker validation and later report commits can continue.
The primary checkout's image-upload validation patch and its new browser test were
copied without editing the original checkout. Unrelated `.obsidian` metadata is excluded.
New assignments use the verified dev head; completed older-base assignments are
reviewed and integrated on dev. Main and publication remain unchanged.
