# Batch 67: live catalog progress and operation collection proof

Scope: M-02/M-03. Coordinator alone owns integration and acceptance decisions.

## Baseline and bounded delta

Managed worktree: `/Users/thomashall/.codex/worktrees/batch67-progress-steps-native-state/sg-ui`.
Exact baseline: `fc4f9fca9be4aaace869f0944baccaeed921e5b8` (SHA-only worktree creation).
Primary image-upload work is untouched. Only AppOperationSteps stories/fixture/tests,
the assigned browser spec and this report changed. No runtime component or public
prop/export changes were justified by the targeted evidence.

[Batch 07](../parallel-batch-07/progress-status.md) already proves single-step
pending/loading/completed/error transitions, stable mounted host Status, keyboard
Start focus, static light/dark token mapping, motion preference and text scaling.
Its ten native cases passed Chromium/WebKit at its recorded head. That existing
proof is retained rather than repeated. Primitive Progress and busy ListBox proofs
do not establish this catalog composition's remaining dynamic collection behavior.

The new `NativeStateTransitions` story changes empty/single/multiple collections,
quiet percentage ticks, loading and complete/error/reset work through stable host
buttons. Long course labels exercise wrapping. Steps stay native ordered list
items with translated status suffixes and a named indeterminate active indicator;
steps are presentation, with no button/tab/navigation affordance or live region.
The host keeps one atomic polite Status mounted for completion/failure messages;
progress ticks and collection changes leave its message empty. The fixture file's
`.stories.fixture.tsx` name keeps it outside package build emission and Storybook's
story-file glob while source typechecking still covers it.

## Targeted local proof

Node `v24.19.0`, pnpm `10.29.3`, Vitest `4.1.11`, React `19.2.3`.
All commands select `/Users/thomashall/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin`
through PATH. Frozen installation passed (608 packages, no lockfile changes).
The first install inspection found both canonical slots occupied; work queued
before launching. Installation later atomically acquired slot1. Validation used
canonical light slot2/slot3. Unique owner tokens were checked before finally
releasing only this worker's slot. No foreign directory/process/queue was removed.

- `pnpm exec vitest run src/components/AppInlineProgress/AppInlineProgress.test.tsx src/components/AppOperationSteps/AppOperationSteps.test.tsx src/components/AppOperationSteps/AppOperationStepsNativeStateFixture.test.tsx --maxWorkers=1`: **8/8**, three files. Includes actual host pointer/keyboard callbacks and collection replacement, retained keyed first item, progress ticks and stable live region.
- `pnpm exec tsc --noEmit`: pass, production/story source types.
- `pnpm exec tsc --noEmit -p tests/browser/tsconfig.json`: pass.
- `pnpm foundations:check`: pass, source/transitive/layer/token guards.
- `git diff --check`: pass.

Logs: `/tmp/sgui-batch67-progress-{install,units,source-types,browser-types,guards}.log`.
These are local checks, not CI or native browser results. No worker Storybook build,
full check, server, browser or packed-consumer execution occurred.

## Coordinator native execution handoff

Focused arguments after the coordinator's single attributed candidate build:

```sh
pnpm exec playwright test tests/browser/batch67-progress-steps-native-state.spec.ts --project=chromium
```

Four cases cover light/dark × compact/comfortable, at 320 CSS pixels and 200%
root text. Each drives multiple → single → empty → multiple while progress
continues, then completion → error → reset. Assertions require native ordered
labels/status order, loading name/value absence, reduced-motion computed SVG
animation, 25/50/100/0 values, persistent atomic polite region, complete/error
icons and production danger/surface token colors, actual enlarged typography and
density heights, no horizontal overflow, surviving visible host focus, and exactly
one callback per keyboard action. Axe violations and runtime errors/warnings fail;
no sleeps, timing delays, skipped rules or engine exceptions are used.

## Settled wave 29 native evidence

The coordinator's wave 29 passed all **four assigned Chromium cases**, with zero
skips, unexpected failures or flaky cases, no retries, and an empty top-level
Playwright errors array. Actual tested candidate:
`f87c8d336932ea70ad3ab9eaea5e4e6b77bc40ec`, not the standalone worker head.
The worker's source/test/story/report bytes at
`53ab1a69f7a10a073e483ec7fc5ac704a265e6f0` were attributed to that candidate in
`/tmp/sgui-batch45-candidate-wave29-attribution.json`. All five original file
SHA-256 values were independently rechecked against the frozen worker before this
report-only update; all matched. No source/spec/test/story changed after execution.

Cases: `mutable progress/ordered steps survive native reflow: light/compact`,
`light/comfortable`, `dark/compact`, and `dark/comfortable`. Each case includes
the entire transition and computed-state sequence described above. Strict
geometry/focus assertions passed, so no runtime repair was warranted.

Retained run root:
`/Users/thomashall/.codex/worktrees/batch45-shared-native-candidate/sg-ui/artifacts/browser-pool/693cd1a1-28f1-4986-b345-258b4621c480`.
The `progress-steps-native-state/` shard retains `evidence.json`, `results.json`,
`browser.log`, report and traces directory. Its Chromium slot was 2, port 6555;
results duration was 5.715 seconds, October 7, 2026 at 1:02 p.m. America/Chicago.
Runtime: Node `24.19.0`, pnpm `10.29.3`, Playwright `1.63.0`, Darwin `27.0.0`.

The root manifest records one fresh Storybook build and browser typecheck before
five distinct shards. Root totals are 54 passed cases, including other workers'
separately attributed slices; those are not this worker's acceptance evidence.
Original/final candidate HEAD match, final git status is clean, and original/final
source and build digests match:

- Source: `6464ca63b43a916374529d26fd88b7cdefcd4efb82b0bcd2014618c1d9bbfe38`.
- Static build: `d6a2c0f07f33e5ca842a98dbf9fe0f0f86b9700add97fdda68c4bcb87c9859f8`.

Owned commands settled before the coordinator authorized this report-only edit.
No worker independent native build/server/test was launched. This batch has no
retained red native attempt: its first attributed focused run passed. Historical
failures, launcher limitations and earlier batch evidence remain in their own
reports; this result does not erase or claim to rerun them. Candidate composition
and a green wave do not imply codex/dev integration or whole-row acceptance;
coordinator alone integrates the worker commits individually.

Firefox/WebKit execution of this new spec remains a deferred coordinator checkpoint.
Passing Firefox cases for other specs in this wave do not establish progress/steps
coverage in that engine. Physical devices, actual browser chrome zoom, manual
visual review and spoken assistive-technology announcements remain held. DOM
live-region updates never prove actual screen-reader speech. This report closes
no broad U/X/R/Z or whole-row acceptance gate. GitHub dev CI/title workflows remain
paused; no dispatch, publication, main merge or credentials/permissions work.
