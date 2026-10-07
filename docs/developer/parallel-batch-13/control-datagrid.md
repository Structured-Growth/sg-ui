# Experimental independent grid controls: U-17 / X-16

## Scope and result

Baseline: `b139a0d06fb06ba4a5a5aa6adc69c5cb3b206818` (verified before edits).
Managed attached worktree: `/Users/thomashall/.codex/worktrees/batch13-control-datagrid/sg-ui`.
Branch: `codex/batch13-control-datagrid`; PR base: `codex/dev`.
Tested implementation/test head: `f20a9d511437af478b715dd37f0268c25e671d96`.
The report commit follows that head and changes documentation only.

Exclusive write allowlist:
- `src/experimental/DataGrid/`
- `tests/browser/batch13-control-datagrid.spec.ts`
- `docs/developer/parallel-batch-13/control-datagrid.md`

Only the colocated test and this report changed. Product implementation, public
contracts and stories remain unchanged because the inspected combination works.
No catalog grid changes, broader checklist closure or manual/device/AT claim.

## Evidence

Existing seven colocated cases cover processing, resize, drag cancellation,
multisort/search, retained cross-page selection, controlled server authority,
visibility locks and host-owned Move requests. Existing browser grid checks in
`tests/browser/acceptance.spec.ts` and batch01/batch05 suites target the catalog
grid; they do not establish experimental independent-grid native acceptance.
Prior reports inspected: batch01 grid-focus/grid-reorder and batch05 grid-busy,
grid-shell-state/grid-processing. Those cover catalog behavior, so they were not
copied or treated as experimental evidence.

The one added composed case mounts two experimental grids with identical rows,
row IDs and column IDs. Selecting `a` in the first instance leaves the second
unchanged. Owned buttons rendered in cells invoke each host action exactly once
without issuing selection requests. Selecting `b` in the second leaves the
first selected at `a`. The unchanged implementation passes; no demonstrated
product defect was found in this bounded combination.

## Local validation

Runtime: Node **24.21.0**, pnpm **10.29.3**, Vitest **4.1.11**, jsdom **26.1.0**,
React **19.2.3**. Commands used the existing `/tmp/sgui-run24.mjs` Node 24 wrapper.

- `pnpm install --frozen-lockfile`: passed, 608 packages; atomic install slot,
  unique owner token, matching-owner release in finally. No dependency edits.
- `pnpm exec vitest run src/experimental/DataGrid/DataGrid.test.tsx --maxWorkers=1`:
  **7 passed / 1 failed**, 26.02s. The older 26-row cross-page test hit its existing
  5s timeout (5.283s) under concurrent work. New composed case passed. Existing
  drag-slot warnings appeared in that older paging case.
- `pnpm exec vitest run src/experimental/DataGrid/DataGrid.test.tsx --maxWorkers=1
  -t 'isolates overlapping|retains cross-page'`: **2 passed / 6 skipped**, 10.56s;
  both the new combination and timed-out existing case pass unchanged. This is a
  targeted recheck, not a clean full-file pass.
- Both Vitest runs claimed atomic light-validation slots (limit four) and
  released only their matching owner token in finally.
- `git diff --check`: passed. Changed paths checked against the allowlist.

Targeted task validation follows `react-aria-development-validation.md` and the
user's override of per-task full checks. No full suite, full pnpm check or
Storybook rebuild was run. No behavior/story/API/style/build changes require a
new native assertion for this test-only result. No browser suite was executed:
the shared lock was owned by another chat and the priority queue was nonempty;
the new browser pool remains under review. No locks were stolen, no worker was
stopped, no Firefox retry occurred. GitHub CI/title workflows remain paused;
no waits, dispatches, merges, publication or permission changes.

## Reserved follow-ups

1. Experimental native two-grid keyboard entry and nested button activation with
   overlapping keys, focus and selection isolation: exact scope
   `src/experimental/DataGrid/DataGrid.stories.tsx`,
   `tests/browser/batch13-control-datagrid.spec.ts`, and a dedicated report.
   Use the approved browser pool and fresh static Storybook when available.
2. Investigate unconditional experimental drag hooks on ordinary/non-reorderable
   grids, which emit missing `Button slot="drag"` warnings during paging. Exact
   scope `src/experimental/DataGrid/DataGrid.tsx`, colocated tests/stories and a
   dedicated focused browser spec/report. Reproduce focus/collection consequences
   before changing hook attachment; do not assume catalog focus evidence applies.

U-17/X-16 and broad native/device/assistive-technology gates remain open.
