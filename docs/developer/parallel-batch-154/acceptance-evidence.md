# Batch 154: held W-01/W-05 guidance reconciliation

Reviewed source baseline: `e53b6e20f4a6dd56e27ab0402923f3b5f9024fc3` (requested exact `codex/dev` commit).
Review date: 2026-10-07. Isolated managed worktree:
`/Users/thomashall/.codex/worktrees/batch154-guidance/sg-ui`.
Only `AGENTS.md` and this evidence file are edited. No master acceptance/state
is updated; the coordinator owns validation, integration and acceptance decisions.

## Bounded changes

The [batch129 report](../parallel-batch-129/acceptance-evidence.md) held two active
text conflicts. Current baseline source inspection confirms both remain applicable.

| Held criterion | Reconciliation | Retained source support / limits |
| --- | --- | --- |
| W-01 | Replace incremental catalog/new-module exceptions with current owned boundaries. Replace the legacy renderer/types/helpers/persistence/shell/reorder pending paragraphs with the internal owned grid building blocks under the strict whole-directory boundary. Clarify that broad grid acceptance remains open. | AppDataGrid uses OwnedGridInteraction, owned controllers, processing and persistence; AppDataGridShell shares those controllers and ComposedAppDataGrid; learner composition uses the owned grid; reorder handle uses owned props and React Aria internally. Source/dependency and declaration guards register the full grid/shell/learner/reorder directories. This is source and guidance evidence, not a new guard execution or runtime pass. |
| W-05 | General scopes default comfortable; generic Menu inherits scope unless density is explicit. Preserve explicit compact catalog menu choices and scope the compact filter rule to DataToolbar. Require both densities/enlarged text with visible focus and meaningful targets. | ThemeScope context defaults comfortable and nested scopes inherit; Menu Popover uses `density ?? scope["data-sgui-density"]`; DataToolbarSelectionMenu explicitly sets compact, and filter controls/content use explicit compact density. Architecture documents agree. Physical-device, coarse-pointer, enlarged-text matrix and AT acceptance remain open. |

W-02–W-04 conventions, commercial licensing/notices, public names, host ownership,
translations and validation/release policy are preserved. Existing broad G/U/X/R/Z
and device/AT limitations remain. Historical migration reports stay intact.
No production/API/style/story/test source changes are necessary for these text conflicts.

## Static checks and validation boundary

- Confirmed the new managed worktree started clean at the requested exact baseline.
- Read repository AGENTS, README, migration, component architecture, owned architecture,
  development-validation policy and batch129 report; inspected current actual sources
  and guard registrations listed below.
- Reviewed the AGENTS diff against the density and whole-directory contracts;
  searched for the held obsolete incremental grid and blanket compact statements.
- Checked Markdown relative file targets in the two changed files for existence
  (`AGENTS.md`: 45 targets; this report: 16 targets; zero missing). This does not
  validate anchors, external URLs or
  semantic freshness of every linked document.
- `git diff --check` passed. Final changed-path review is limited to the two-file allowlist.
- No install, executable tests, guard runs, build, pack, browser or CI execution was
  performed. Static source inspection is not executable validation. The coordinator
  owns any subsequent executable checks and integration; no new runtime tested head
  or whole-criterion acceptance is claimed.

Reconciled `AGENTS.md` Git blob: `b60fc85b9580d50b52f5a299241c4c236ef0ce86`. Final commit and both changed-file
Git blobs are supplied in the completion handoff, avoiding a self-referential report hash.

## Pinned source evidence

These blobs refer to the reviewed baseline above. Recover them using
`git show <baseline>:<path>`; the table does not represent test artifacts.

| Source artifact | Baseline Git blob |
| --- | --- |
| [docs/developer/parallel-batch-129/acceptance-evidence.md](../../../docs/developer/parallel-batch-129/acceptance-evidence.md) | `ecf031215eb3a540843ad65ef19e3c562ede7780` |
| [docs/developer/react-aria-architecture.md](../../../docs/developer/react-aria-architecture.md) | `66280bea05b7f70b0e1bcc9e4b2388add91de97a` |
| [docs/developer/component-architecture.md](../../../docs/developer/component-architecture.md) | `802b8086c11e2c28460596214775653f75ac886d` |
| [docs/developer/react-aria-development-validation.md](../../../docs/developer/react-aria-development-validation.md) | `93e7f6612b6b315f452636277d7140f318177a6d` |
| [src/foundation/ThemeScope.tsx](../../../src/foundation/ThemeScope.tsx) | `ec330a71f6ee1f32ad10b717efe5a285094ca953` |
| [src/experimental/Menu/Menu.tsx](../../../src/experimental/Menu/Menu.tsx) | `60ebffe51e492d220465271c2b783c422ccc716a` |
| [src/components/DataToolbar/components/DataToolbarSelectionMenu.tsx](../../../src/components/DataToolbar/components/DataToolbarSelectionMenu.tsx) | `85c830bf49fda74f5316ca4a8bd70d6243e557c7` |
| [src/components/DataToolbar/components/DataToolbarFilterMenu.tsx](../../../src/components/DataToolbar/components/DataToolbarFilterMenu.tsx) | `6756905e82bfb9aac06d2bcd7c2b5f379b7fd187` |
| [src/components/AppDataGrid/AppDataGrid.tsx](../../../src/components/AppDataGrid/AppDataGrid.tsx) | `a0eee627e275734ad8e7eac95caf7913bf6dc94e` |
| [src/components/AppDataGridShell/AppDataGridShell.tsx](../../../src/components/AppDataGridShell/AppDataGridShell.tsx) | `32310c5053ef335e38709f1650a7909be214722f` |
| [src/components/LearnerClassesDataGrid/LearnerClassesDataGrid.tsx](../../../src/components/LearnerClassesDataGrid/LearnerClassesDataGrid.tsx) | `6ba451df32c7b971f63342f2c68b70d459dfc5b3` |
| [src/components/AppDataGridRowDnd/DataGridDragHandle.tsx](../../../src/components/AppDataGridRowDnd/DataGridDragHandle.tsx) | `95a093f39c766d6b0c7aefc179ae999cb9a05b81` |
| [scripts/check-foundations.mjs](../../../scripts/check-foundations.mjs) | `ecc96a852355231cc7845642c589980825a6356d` |
| [scripts/check-package.mjs](../../../scripts/check-package.mjs) | `744f86595899989d90edc6cf590a757534c58f17` |
| [docs/developer/react-aria-catalog-grid.md](../../../docs/developer/react-aria-catalog-grid.md) | `58c59e7e56139e470d13c5f759e23d918dc913e1` |
