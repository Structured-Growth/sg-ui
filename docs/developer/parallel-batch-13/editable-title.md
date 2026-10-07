# Editable title host read-only transition

Status: product fix and targeted checks complete; required native validation queued.
Draft PR: https://github.com/Structured-Growth/sg-ui/pull/75 (base `codex/dev`).

## Isolation and scope

- Verified baseline: `b139a0d06fb06ba4a5a5aa6adc69c5cb3b206818`.
- Managed attached worktree: `/Users/thomashall/.codex/worktrees/batch13-editable-title/sg-ui`.
- Branch: `codex/batch13-editable-title`.
- Product/test head: `9cb0cedcceb480c11aea49c30d6c30c9418f8681`.
- Exclusive write allowlist: `src/components/EditableTitleField/`,
  `tests/browser/batch13-editable-title.spec.ts`, this report.
- Assignment labels M-11/U-05; canonical repository inventory labels this component
  M-24 (M-11 is CardCollectionWithFooter, U-05 checkbox/switch/radio composition).
  No shared task statuses changed.

## Demonstrated defect and fix

Baseline tests already cover trim/Enter, blur, async focus, Escape, empty/unchanged
values, duplicate pending saves, rejection/retry, initial read-only and IME Enter.
Previous M-24 completion records in `react-aria-progress.md` include native
successful/rejected save and cancellation evidence. Those cases were not reenacted
as new regressions.

The new combination is rejected persistence followed by live host read-only
revocation. Baseline retained a writable input and permitted subsequent Enter/blur
retry despite the host flag. Active inputs now receive `readOnly` and `save` stops
while the host flag is true. Draft/error context remains visible, Escape still
cancels, and the host title remains authoritative. Already-started host persistence
is not cancelled. The public API has no separate disabled prop; pending loading and
read-only retain existing APIs.

One added unit regression checks live revocation after rejection, blocked typing
and Enter/blur saves, Escape cancellation, and latest host title. One changed-state
story exposes host revocation. Two browser cases (light/dark) check actual keyboard,
focus retention, blur suppression, Escape, disabled edit trigger and reopening.

## Validation

Runtime: Node 24.21.0, pnpm 10.29.3. Install used atomic owned slot0 under
`/tmp/sgui-install-slots` (global limit 2), with matching-owner release.
Vitest used atomic owned slot0 under `/tmp/sgui-light-validation-slots` (limit 4),
`--maxWorkers=1`, with matching-owner release. Busy slots were queued, never stolen.

- `pnpm install --frozen-lockfile`: pass; existing esbuild ignored-build-script warning.
- `pnpm exec vitest run src/components/EditableTitleField/EditableTitleField.test.tsx --maxWorkers=1`:
  baseline with new test: 1 failed / 9 passed; fixed: 10 passed / 1 file.
- `pnpm typecheck`: pass.
- `pnpm foundations:check`: pass.
- `git diff --check`: pass.
- Fresh Storybook and `batch13-editable-title.spec.ts`: queued, not passed.
  Respect `/tmp/sgui-parallel-batch-01-validation.lock` and priority queue; new
  browser pool remains under review. No conflicting build/server launched.

Logs: `/tmp/batch13-editable-title-{install,baseline,fixed,typecheck,foundations}.log`.
Tests ran on the exact product/test content subsequently committed as `9cb0ced`.
No API/style/token/build/export/dependency changes. Full suites and broad acceptance
were not rerun under the user-authorized targeted policy. GitHub dev CI/title is
paused; no wait, rerun, dispatch or re-enablement.

## Remaining limits and follow-ups

Required focused native evidence remains in this same chat/worktree/scope until
validation is complete. No manual/device/assistive-technology or broad task IDs
are closed. Callback replacement does not cancel already-started host work;
existing operation captures its original callback, later retry uses latest props.
This patch does not add host network cancellation or a disabled prop. No broader
source changes are needed for the demonstrated defect. Shared contract/checklist
reconciliation is coordinator-owned outside this allowlist.
