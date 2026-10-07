# Batch 12 browser pool evidence

Scope: opt-in local bounded parallel browser scheduling for migration velocity,
R-11/X-12 infrastructure only. See the
[pool protocol](../react-aria-parallel-browser-validation.md) and
[development validation policy](../react-aria-development-validation.md).

Isolation began before edits: one managed worktree named `batch12-browser-pool`,
root `/Users/thomashall/.codex/worktrees/batch12-browser-pool/sg-ui`, verified exact
baseline `d0fcc6298004ad23d1a75480b216b39142e6df96`, branch
`codex/batch12-browser-pool`. The exact final tested commit is recorded in the
completion report and draft PR, rather than a self-referential commit hash here.

## Exclusive files

- `playwright.config.ts`
- `scripts/serve-browser-storybook.mjs`
- `scripts/browser-validation-pool.mjs`
- `scripts/browser-validation-pool.test.mjs`
- `docs/developer/react-aria-parallel-browser-validation.md`
- `docs/developer/parallel-batch-12/browser-pool.md`

All other tracked files remain read only. No workflow, shared queue, running
worker, owner, component, package dependency or acceptance checklist was changed.
No deployment to existing workers occurs before coordinator review.

## Implemented behavior

Defaults and the three-engine matrix remain intact. Environment settings provide
matching loopback port/baseURL and separate static/report/result/trace paths.
The pool validates committed clean heads and worktree-local ignored outputs,
checks the actual legacy queue, atomically acquires the compatibility bridge,
allocates at most two owned slots and serializes fresh heavyweight builds.
Each pair stages builds/types before browser commands start. Read-only build
files, immutable in-memory serving and final digest/head checks preserve evidence.
Owned child process groups have signal cleanup and bounded kill fallback; other
processes and stale owners are never automatically stopped/reclaimed.

## Targeted validation

- `pnpm install --frozen-lockfile`: passed, no manifest/lockfile change.
- `node --test scripts/browser-validation-pool.test.mjs`: 13 passed, one explicitly
  skipped configurable-server integration test; no browser or Storybook launched.
  Tests cover eight competing independent Node processes admitting exactly two
  slots, owner mismatch, failed-job cleanup, stale claims, heavy-lock exclusion,
  queue schemas, path isolation, defaults/invalid URLs, occupied listener
  preservation, static digest/symlink/read-only guards, failed/aborted owned
  processes preserving an unrelated process, two-worktree staging and selection overrides.
- Same Node test command under Node 24.21.0: recorded at final head in the report.
- `node --check` for both scripts and `git diff --check`: passed.
- `pnpm exec tsc --noEmit -p tests/browser/tsconfig.json`: passed.
- `pnpm exec playwright test --list`: 333 tests in 25 files, preserving
  Chromium/Firefox/WebKit. No browsers launched.
- The same list command with `SGUI_BROWSER_PORT=6274`, matching baseURL and
  distinct report/result/trace paths: same 333 tests in 25 files.
- Playwright 1.63.0; pnpm 10.29.3. Initial system Node checks used 26.5.0;
  supported Node 24 checks are separately identified in the completion report.

These are harness/unit/config checks, not full-suite or real-browser acceptance.
No `pnpm check`, full Storybook build, full browser matrix, GitHub dispatch,
CI/title rerun/wait or unchanged Firefox retry was performed.

## Precise unrun prerequisites and rollout

At inspection on 2026-10-07 the unchanged legacy lock
`/tmp/sgui-parallel-batch-01-validation.lock/owner` was
`01a116a4-fa98-7d20-a217-302eca6279e1`. The unchanged priority queue
`/tmp/sgui-browser-validation-priority.json` contained, in order:

1. `01a116a4-fa98-7d20-a217-302eca6279e1`
2. `01a116a4-fd4c-7ab3-acfa-d29891b53fef`
3. `01a116a4-f72f-7853-b068-47a3e2ebe9cb`

Configurable static server validation and two independent small real-browser
sessions remain unrun: those existing workers must finish, the coordinator must
verify/drain their queue, and the current owner must release its own legacy lock.
No placeholder queue or substitute lock may bypass that prerequisite. The pool
must then be reviewed and present in each participating committed worktree.

The protocol document gives the gated two-static-server fixture and the focused
two-worktree real-browser plan. Confirm actual browser-command interval overlap,
separate ports/artifacts, exact heads, both results and unchanged build digests.
The original task authorizes one managed worktree here; coordinator adoption owns
selection/preparation of the second reviewed worktree. No automatic rollout is
implemented. Missing Firefox runtime/profile acceptance stays open without retries.

Next tasks outside this allowlist: coordinator review and opt-in real-browser
trial after the legacy queue drains; future reviewed migration of heavyweight-only
workers to the separate build lock; any global scheduling/cap increase, workflow
integration or manual/device/AT evidence. Broad G/U/X/R/Z gates remain open.


The coordinator subsequently authorized the live proof immediately after the
page-header worker, appending this chat as the next priority entry. Explicit
`--owner` support preserves default empty-queue behavior while permitting only
the existing first chat after preceding entries drain; regression coverage checks
preceding/following/unlisted callers. Live proof outcomes are recorded below after
execution. The second isolated source root is an owned ignored snapshot clone,
preserving the one-managed-worktree constraint.
