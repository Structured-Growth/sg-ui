# Batch 05: grid shell host-state acceptance

Task slice: G-05/H-16/H-17. This is bounded composition acceptance, not completion
of the broad migration or manual accessibility gates.

- Chat: `01a11673-cd99-7ae2-aa71-66c193c16169`.
- Baseline, verified before edits: `cca9452f384d5ffaa34ad5bd4ddd015b43a2870b`.
- Managed worktree: `/Users/thomashall/.codex/worktrees/batch05-grid-shell-state/sg-ui`.
- Branch: `codex/batch05-grid-shell-state`.
- Implementation: `5a05ce486722106ac4b1f0b2e28a3b6e307b82de`.
- Final implementation/browser fixture: `556df283d8ecc5e664528a7a2a302abf0205d677`.
- Draft PR: [#26](https://github.com/Structured-Growth/sg-ui/pull/26), targeting `codex/dev`.
- A subsequent report-only commit records final validation; its exact ID is supplied
  in the coordinator completion message because a commit cannot embed its own hash.

## Coverage added

No production defect was found in this slice. Production shell/grid processing,
controllers, public APIs and fetching behavior are unchanged.

Five new composed cases cover controlled list/card filter drafts and request
ordering (`page`, criterion, one complete state snapshot), atomic page-size reset,
rejected/deferred host acceptance, and replacement rows without duplicate requests.
They cover unknown forward navigation, terminal empty pages, host-accepted known
counts/page zero after disappearing rows, retained valid and off-page selection,
pending/error/retry updates, and isolation of grid/card sort/filter/selection state.
Distinct persistence keys survive remount while selection is intentionally omitted.

Two stories demonstrate controlled host acceptance/response transitions and
independent persisted grid/card views. The existing latest-request-wins host story
remains the cancellation/stale-response example. Host applications still own
network requests, cancellation, stale-response filtering, response-page reconciliation
and deletion reconciliation for retained selection IDs.

Four focused browser cases cover list/card deferred requests and native host focus,
filter/size acceptance, and repair of a disappearing card's nested action focus.
The host-response fixture accepts with Alt+A and deletes the focused row with
Alt+D so native focus can be tested without moving it to another host button first.

Changed files are exclusively:

- `src/components/AppDataGridShell/AppDataGridShell.test.tsx`
- `src/components/AppDataGridShell/AppDataGridShell.stories.tsx`
- `tests/browser/batch05-grid-shell-state.spec.ts`
- This completion report.

## Validation

Runtime: Node `24.21.0`, pnpm `10.29.3`, React `19.2.3`.
Commands use `node /tmp/sgui-run24.mjs <pnpm arguments>` to put the already installed
Node 24 runtime first on PATH; no runtime was installed or package files changed.

- `pnpm install --frozen-lockfile`: passed, unchanged lockfile.
- `pnpm exec vitest run src/components/AppDataGridShell/AppDataGridShell.test.tsx`:
  17 tests passed (five added). An initial isolation assertion incorrectly read a
  raw checkbox label; corrected it to assert ordered text cells rather than bypass
  the accessible naming composition. No product assertion was weakened.
- `pnpm exec vitest run src/components/AppDataGridShell/AppDataGridShell.test.tsx src/components/DataToolbar/DataToolbar.test.tsx src/components/CardPaginationFooter/CardPaginationFooter.test.tsx`:
  3 files / 28 tests passed. Tested source is identical to final implementation.
- `pnpm typecheck`: passed, including the new story fixtures.
- `pnpm foundations:check`: passed.
- `pnpm tokens:check`: passed.
- `pnpm exec tsc --noEmit -p tests/browser/tsconfig.json`: passed.
- `git diff --check`: passed.

Native runs used final implementation `556df283d8ecc5e664528a7a2a302abf0205d677`
(with only this report uncommitted), under the atomic shared directory lock
`/tmp/sgui-parallel-batch-01-validation.lock`, owner set to this chat ID. All servers
and browser processes finished before own-owner Python cleanup released the lock.
Storybook was built once; it was not rebuilt during either suite.

- `pnpm build-storybook`: passed, fresh static output.
- `pnpm exec playwright test tests/browser/batch05-grid-shell-state.spec.ts --project=chromium --project=webkit`:
  8 tests passed (four in each engine), with no browser runtime errors.
- `pnpm exec playwright test tests/browser/batch05-grid-shell-state.spec.ts --project=firefox -g "filter and page-size"`:
  failed before story execution; the bundled Firefox process exited with code 1,
  reporting `Could not find profile folder`. No Firefox behavior assertions ran;
  remaining Firefox cases were not redundantly attempted against the same failed
  launch. Firefox acceptance remains unverified, separately from product coverage.

Logs: `/tmp/batch05-grid-shell-unit.log`, `/tmp/batch05-grid-shell-composed.log`,
`/tmp/batch05-grid-shell-type.log`, `/tmp/batch05-grid-shell-storybook.log`,
`/tmp/batch05-grid-shell-browser.log`, `/tmp/batch05-grid-shell-firefox.log`.

Per the human's later coordinator policy update, automatic GitHub dev CI/title
checks are paused. This task did not wait for, rerun or dispatch those checks and
did not modify workflows. Main/production validation remains unchanged.

## Limits and next bounded work

No full check, browser/consumer matrix, packed React 18 consumer, physical device
or assistive-technology validation is claimed. This slice does not claim automatic
client-page reconciliation after arbitrary dataset shrink, general host request
correctness, host deletion policy or broad G/H acceptance.

Proposed next task: separately review client dataset shrink on a nonzero page,
including known-total changes and controlled host rejection, with an explicit
contract for requested versus displayed page clamping before changing controllers.

Central guidance updates are reserved for the coordinator: link this report from
migration progress/task evidence for G-05/H-16/H-17 as partial acceptance. No public
contract or AGENTS.md update is required by this test-only slice; keep broad gates open.
