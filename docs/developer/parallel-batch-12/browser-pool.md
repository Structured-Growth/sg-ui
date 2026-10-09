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

All other tracked files remain read only. No workflow, existing worker entry or
owner, component, package dependency or acceptance checklist was changed. After
the subsequently authorized live proof, only this chat's first priority queue
entry was removed, preserving the following worker.
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
- Gated Node test command under Node 24.21.0 at proof head
  `6b9da4423f1e6675c37571d5552474da25e90258`: all 14 passed, no skips; this
  includes the real configurable two-server fixture.
- `node --check` for both scripts and `git diff --check`: passed.
- `pnpm exec tsc --noEmit -p tests/browser/tsconfig.json`: passed.
- `pnpm exec playwright test --list`: 333 tests in 25 files, preserving
  Chromium/Firefox/WebKit. No browsers launched.
- The same list command with `SGUI_BROWSER_PORT=6274`, matching baseURL and
  distinct report/result/trace paths: same 333 tests in 25 files.
- Playwright 1.63.0; pnpm 10.29.3. Initial system Node checks used 26.5.0;
  supported Node 24 checks are separately identified in the completion report.

These are harness/unit/config checks, not full-suite or real-browser acceptance.
No `pnpm check`, full browser matrix, GitHub dispatch, CI/title rerun/wait or
unchanged Firefox retry was performed. The subsequently authorized pool proof
built two fresh static Storybooks and ran one focused Chromium case in each.

## Initial prerequisites and reviewed proof protocol

At inspection on 2026-10-07 the unchanged legacy lock
`/tmp/sgui-parallel-batch-01-validation.lock/owner` was
`01a116a4-fa98-7d20-a217-302eca6279e1`. The unchanged priority queue
`/tmp/sgui-browser-validation-priority.json` contained, in order:

1. `01a116a4-fa98-7d20-a217-302eca6279e1`
2. `01a116a4-fd4c-7ab3-acfa-d29891b53fef`
3. `01a116a4-f72f-7853-b068-47a3e2ebe9cb`

At the initial draft, configurable static server validation and two independent
small real-browser sessions were unrun: those existing workers must finish, the coordinator must
verify/drain their queue, and the current owner must release its own legacy lock.
No placeholder queue or substitute lock may bypass that prerequisite. The pool
must then be reviewed and present in each participating committed worktree.

The protocol document gives the gated two-static-server fixture and the focused
two-worktree real-browser plan. Confirm actual browser-command interval overlap,
separate ports/artifacts, exact heads, both results and unchanged build digests.
The original task authorizes one managed worktree here; coordinator adoption owns
selection/preparation of the second reviewed worktree. No automatic rollout is
implemented. Missing Firefox runtime/profile acceptance stays open without retries.

Next tasks outside this allowlist: coordinator review and opt-in rollout, with
sustained contention measurement; future reviewed migration of heavyweight-only
workers to the separate build lock; any global scheduling/cap increase, workflow
integration or manual/device/AT evidence. Broad G/U/X/R/Z gates remain open.


The coordinator subsequently authorized the live proof immediately after the
page-header worker, appending this chat as the next priority entry. Explicit
`--owner` support preserves default empty-queue behavior while permitting only
the existing first chat after preceding entries drain; regression coverage checks
preceding/following/unlisted callers. Live proof outcomes are recorded below. The second isolated source root is an owned ignored snapshot clone,
preserving the one-managed-worktree constraint.


## Live proof completed 2026-10-07

The preceding page-header worker completed and released its own queue entry and
legacy lock. This chat was then first, with auth-shell queued after it. Every
actual acquisition was atomic and owned; no prior owner or process was disturbed.
The proof ran before any general rollout.

Both isolated source roots were clean at exact commit
`6b9da4423f1e6675c37571d5552474da25e90258`: the managed root above and its own
ignored local Git snapshot at `artifacts/browser-proof/snapshot`. Dependencies
were reused through entries linked inside a normal ignored `node_modules`
directory. An initial root-level dependency symlink was correctly rejected as
untracked by the clean-head guard before any build or lease acquisition; the
fixture layout was corrected. No second managed worktree was created.

Runtime: Node 24.21.0, pnpm 10.29.3, Playwright 1.63.0, macOS Darwin 27.0.0. The
Node 24 executable was the installed pnpm Node package's `node/bin/node`; each
`evidence.json` records its full absolute path and OS/runtime details.

Commands, with that Node 24 directory prepended to `PATH`:

```sh
SGUI_POOL_SERVER_TESTS=1 \
SGUI_POOL_OWNER=01a116ad-fb4d-7891-9b4b-359e6ab91ea0 \
node --test scripts/browser-validation-pool.test.mjs

node scripts/browser-validation-pool.mjs \
  --plan /tmp/sgui-batch12-browser-live-plan.json \
  --owner 01a116ad-fb4d-7891-9b4b-359e6ab91ea0 \
  --max 2 --first-port 6273 --output artifacts/browser-pool
```

Both plan jobs selected
`tests/browser/batch01-forms.spec.ts --project=chromium --grep="controlled host authority survives editing and native reset"`.
Each passed one existing case, zero skipped/unexpected/flaky, using a separate
static server and Playwright worker (servers 6034/6035, workers 6036/6037). No test
or assertion was weakened for the trial.

| Source root | Port/slot | Browser command interval (UTC) | Result |
| --- | --- | --- | --- |
| Managed | 6274 / 1 | 14:18:29.131–14:18:30.926 | 1 passed |
| Snapshot | 6273 / 0 | 14:18:29.132–14:18:30.926 | 1 passed |

The command intervals overlap **1.794 seconds**. JSON reporter start/duration
also overlap: managed start 14:18:29.713, duration 1194.422 ms; snapshot start
14:18:29.733, duration 1174.258 ms. Each fresh build finished before browser
launch; both typechecks passed. Final heads equal the proof head and both working
trees remain clean.

Retained evidence paths relative to the managed root:

- `artifacts/browser-pool/bef2e49b-40e8-434b-ad37-533a1c8385b2/evidence.json`
- `artifacts/browser-proof/snapshot/artifacts/browser-pool/1846263b-4059-45e0-9d20-7c8624e8cbef/evidence.json`

Each directory also retains logs, JSON/HTML results and static build. Before/after
build digests are identical per job:

- Managed: `eb165ad5a8ed0e61e5c05c62f2d4e88bc2398c755f7c0fb7930c9de75719d423`
- Snapshot: `7da4d575a0bc15c4ba7366642502bccac18a920f8cf82e473f3b9c0480054e44`

The static fixture passed independent immutable bytes on ports 6473/6474 and
occupied-listener refusal. After the real pool completed, the legacy bridge,
heavy-build lease and both slot directories were absent; both ports could be
bound by an owned socket. Only this chat's first priority entry was removed with
an atomic file replacement preserving the following auth-shell entry
`01a116aa-4ad8-7a43-9bad-fbd7ab927463`. No other entry/owner/process was removed.

This establishes the bounded two-session Chromium scheduling/cleanup proof. It
does not establish full-engine, distinct product-scope, sustained contention,
physical-device or assistive-technology acceptance. Firefox remains unrun without
unchanged retries. General deployment, wider capacity and migration of other
heavyweight callers still require coordinator review. Evidence and the disposable
snapshot remain local review artifacts; remove the owned snapshot before eventual
managed-worktree archival, after preserving needed evidence.
