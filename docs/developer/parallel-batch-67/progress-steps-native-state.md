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

**Native execution is pending coordinator validation.** The strict geometry/focus
assertions may identify a real owned defect; this worker did not speculate or
change runtime styles without native evidence. Any confirmed repair must stay
within the exclusive component paths and retain a meaningful regression.

Firefox/WebKit are deferred coordinator checkpoints; known launcher/engine issues
remain owned elsewhere. Physical devices, actual browser chrome zoom, manual
visual review and spoken assistive-technology announcements remain held. DOM
live-region updates never prove actual screen-reader speech. This report closes
no broad U/X/R/Z or whole-row acceptance gate. GitHub dev CI/title workflows remain
paused; no dispatch, publication, main merge or credentials/permissions work.
