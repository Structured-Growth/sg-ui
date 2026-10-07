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
Initial report commit: `f5f824e99edd6e7a17b6ac031b0adcc337b6f4c3`.
The final native-evidence report commit is the subsequent docs commit on this PR;
its exact hash is also sent to the coordinator on completion.

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
- Final source and browser `node_modules/typescript/bin/tsc --noEmit` checks
  (browser check with `-p tests/browser/tsconfig.json`) also passed under Node 24.19.0.
- `git diff --check`: passed.

Each Vitest run acquired one atomic slot beneath
`/tmp/sgui-light-validation-slots`, recorded a unique batch13 owner token and
released only its own slot in finally. Existing Menu native-link tests emit jsdom's
known navigation-not-implemented diagnostic; tests pass, and native routing is not
inferred from that run.

Fresh focused native evidence on exact head
`f5f824e99edd6e7a17b6ac031b0adcc337b6f4c3`, using Node 24.19.0:

- `pnpm build-storybook`: passed, with existing Vite directive/sourcemap/chunk-size
  warnings; the generated build was not rebuilt during tests.
- `pnpm exec playwright test tests/browser/batch13-control-splitaction.spec.ts --project=chromium --project=webkit`:
  **8 passed**, four cases in each engine. Native keyboard opening, focus before
  blocking, secondary dismissal, suppression, recovery, callback replacement,
  anchor identity, activation return focus and unmount/portal lifetime verified.

After bounded waits, the priority queue drained and this chat acquired the atomic
`/tmp/sgui-parallel-batch-01-validation.lock`, recording owner
`01a116b0-d56e-7cb3-bb2b-03c9aff27c42`. Own-owner-checked finally cleanup released
only this chat's lock after the build and suite. Other owners/servers were untouched.
The baseline serial harness was used after the reserved browser-pool trial; no
pool/config rollout was independently performed. Firefox was deliberately not
relaunched because its unchanged local profile prerequisite has separate ownership;
**Firefox assertions remain unverified**, not passed or a product failure.

Logs: `/tmp/sgui-batch13-control-splitaction-storybook.log` and
`/tmp/sgui-batch13-control-splitaction-browser.log`. Ignored HTML/JSON/traces are
under this worktree's `artifacts/`; the fresh static build is `storybook-static/`.
The local dependency symlink was removed after validation, leaving a clean tracked
checkout. This is focused evidence, not whole-gate acceptance.

No per-task full check, full browser/consumer matrix or GitHub CI/title run is
claimed. No manual/device/assistive-technology gate is closed.

## Review and reserved follow-ups

Review decision: the demonstrated blocking fix is bounded and API-compatible;
affected unit/guard and Chromium/WebKit native checks pass. Suitable for coordinator
review/integration, with Firefox and broader gates explicitly open. Reserve a separate task
for host focus fallback when the entire focused SplitAction is removed: the new
removal case checks portal lifetime and subsequent usable keyboard access, not a
prescribed fallback-focus policy. Physical touch, spoken pending announcements,
AT focus reporting and broader collision/zoom/nested-menu acceptance remain open.
Central task-ID/guidance reconciliation belongs to the coordinator; all shared
files stayed read-only.
