# Batch 13 SplitAction host blocking

## Assignment and ownership

Assignment: control-splitaction, dispatched as U-03/X-04. The master backlog
actually places SplitAction under U-01; U-03 is completed Typography. This bounded
slice supplies U-01/X-04 evidence without changing or closing those broad gates.

Exact verified baseline: `b139a0d06fb06ba4a5a5aa6adc69c5cb3b206818`.
Managed worktree created and attached before edits:
`/Users/thomashall/.codex/worktrees/batch13-control-splitaction/sg-ui`.
Branch: `codex/batch13-control-splitaction`; draft PR base: `codex/dev`.
Draft PR: [#63](https://github.com/Structured-Growth/sg-ui/pull/63).
Implementation/test/story commit: `ed5bb11ca8a76c55597202c9cce1706fe16004fc`.
The report is committed separately; use branch history for its final report commit.

Exclusive write allowlist:

- `src/experimental/SplitAction/`
- `tests/browser/batch13-control-splitaction.spec.ts`
- `docs/developer/parallel-batch-13/control-splitaction.md`

No shared modules, barrels, contracts, guidance, checklists, dependencies,
configuration, workflows or licenses changed. Read AGENTS, the development
validation policy, owned architecture/layout-action contracts, existing Menu and
SplitAction tests, batch-01 dialog/grid focus reports, and existing nested checks.

## Demonstrated defect and change

Baseline SplitAction covered independent primary/menu callbacks and loading before
opening. Menu tests already cover disabled commands, Escape/return focus, current
host authority and link behavior. Existing `acceptance.spec.ts` and
`batch01-dialogs.spec.ts` cover nested overlay/grid menus; they remain read-only.
Those existing checks were inspected, not rerun or credited as new native evidence.

The new regression opened the menu, then rerendered the host with loading or
disabled. Both cases failed: the menu remained mounted and its command reachable.
The initial 5-test run had 2 existing passes and 3 failures: the two genuine
blocking regressions plus a test-query error in the replacement test (the overlay
hides the background trigger from accessible-role queries). The latter was
corrected to inspect the retained DOM reference; it is not a product defect.

SplitAction now controls its internal menu opening, renders it closed whenever
blocked and clears remembered opening on blocking. Secondary callbacks are also
guarded. Recovery requires a new opening gesture. The existing native trigger is
retained; host items/callbacks remain authoritative. No public props, translations,
pending semantics, CSS, ref contracts or host asynchronous authority changed.

The HostUpdates story demonstrates loading, disabled, item/callback replacement
and removal while open. Four new native cases cover the two blocking transitions,
replacement/anchor identity/activation return focus, and unmount/portal cleanup.

## Local validation

Dependencies reused through an untracked local `node_modules` symlink to the main
checkout's existing locked dependencies; no installs or install slots consumed.
Vitest 4.1.11, React 19.2.3 and TypeScript 5.9.3 match baseline pnpm-lock versions.
Initial tools ran on Node 26.5.0; final affected unit tests ran on bundled Node
24.19.0 at
`/Users/thomashall/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node`.

- Baseline `pnpm exec vitest run src/experimental/SplitAction/SplitAction.test.tsx --maxWorkers=1`:
  5 tests, 2 passed / 3 failed, as distinguished above.
- After fixing blocking and the test query, `pnpm exec vitest run src/experimental/SplitAction/SplitAction.test.tsx src/experimental/Menu/Menu.test.tsx --maxWorkers=1`:
  12 tests passed across 2 files.
- Final bundled Node 24 invocation of `node_modules/vitest/vitest.mjs run src/experimental/SplitAction/SplitAction.test.tsx src/experimental/Menu/Menu.test.tsx --maxWorkers=1`:
  15 tests passed across 2 files (8 SplitAction, 7 Menu).
- `pnpm typecheck`, `pnpm foundations:check`, `pnpm tokens:check`, and
  `pnpm exec tsc --noEmit -p tests/browser/tsconfig.json`: passed.
- `git diff --check`: passed.

Each Vitest run acquired one atomic slot beneath
`/tmp/sgui-light-validation-slots`, recorded a unique batch13 owner token and
released only its own slot in finally. Existing Menu native-link tests emit jsdom's
known navigation-not-implemented diagnostic; tests pass, and native routing is not
inferred from that run.

Fresh focused browser validation is **queued, not passed**. The existing global
lock and nonempty priority queue remain authoritative. No other owner's lock or
server was removed/stopped; no independent browser-pool migration or Firefox
launch retries occurred. This draft must not integrate until fresh focused native
evidence is recorded here.

No per-task full check, full browser/consumer matrix or GitHub CI/title run is
claimed. No manual/device/assistive-technology gate is closed.

## Review and reserved follow-ups

Review decision: the demonstrated blocking fix is bounded and API-compatible;
native validation remains an integration prerequisite. Reserve a separate task
for host focus fallback when the entire focused SplitAction is removed: the new
removal case checks portal lifetime and subsequent usable keyboard access, not a
prescribed fallback-focus policy. Physical touch, spoken pending announcements,
AT focus reporting and broader collision/zoom/nested-menu acceptance remain open.
Central task-ID/guidance reconciliation belongs to the coordinator; all shared
files stayed read-only.
