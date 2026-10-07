# Batch 07 progress/status acceptance

Scope: M-02 AppInlineProgress and M-03 AppOperationSteps. This report does not
close broad U/X/R/Z gates or edit central acceptance decisions.

## Ownership and provenance

- Attached managed worktree: `/Users/thomashall/.codex/worktrees/batch07-progress-status/sg-ui`.
- Branch: `codex/batch07-progress-status`; PR targets `codex/dev` and remains draft.
- Verified clean pinned baseline: `fbaba5b424816be7f386b919113d0b664546bff7`.
- Implementation commit: `6ecea99`; focused acceptance-test head: `777364f519410a9ba85959f53c1ab331a86589ce`.
- Final report commit and PR are recorded in the PR/coordinator completion report.
- Original task changes are confined to the two owned component directories,
  the batch browser spec and this report. Primary and other worktrees remain untouched.

The [inventory reconciliation](../react-aria-migration-inventory-acceptance.md)
held both rows. The original implementation and
[progress contract](../react-aria-progress-avatar.md) were inspected together with
existing unit cases and `display-preferences.spec.ts`. The latter already verifies
primitive loading reduced motion; this batch adds catalog/composed cases rather
than duplicating the primitive suite. The inventory's existing M-03 evidence
mentioned error visuals, but the actual pinned source/contract only supported
pending, in_progress and completed. Error support was a demonstrated missing state.

## Reviewed infrastructure prerequisite

Before native execution, the coordinator explicitly authorized adopting the full
already-reviewed codex/dev ancestry contained in exact
`6b9da4423f1e6675c37571d5552474da25e90258`, rather than only its six harness/doc
files. Normal history-preserving merge `521d87eecec17fdb617ebf21e0a321d14b2ced2d`
completed without conflicts. Inherited dev/harness files were not independently
edited. Original source ownership remains unchanged; compare this task to the
reviewed prerequisite to distinguish its seven-file contribution from inherited
ancestry. No main merge/publication occurred.

The coordinator runs the first approved two-worker pool session: fresh sequential
build/type staging followed by isolated immutable browser ports/outputs, maximum
two sessions. This worker stopped only its own idle standalone waiter, starts no
build/browser/server, and freezes the clean supplied head until pool evidence
arrives. The pool's exact head/runtime/commands/results belong to the subsequent
execution record, not the earlier unit-test head.

## Implementation and consumer contract

`AppOperationStepStatus` additionally accepts `error`. Existing statuses, component
names and props remain. Errors display a decorative CloseIcon and danger-token
label/icon plus translated `common.ui.operation.error` with English `Error`
fallback. Completed keeps the action-token check (no success token exists), pending
keeps the muted circle and active work keeps the owned circular progress indicator.
The host owns step state, retries, persistence and milestone messages.

`AppInlineProgress` needed no runtime fix. It retains finite normalization,
rounding/clamping, 0% nonfinite fallback, translated Progress name, body2 percentage,
spacing-token gap/height/default width and numeric/CSS widths. Determinate progress
has no animation. Active operation loading inherits the primitive's reduced-motion
rule. Load `/styles.css` and use Provider or ThemeScope as before.

Steps deliberately create no live region or count labels. A mounted host-owned
`Status announcement="polite"` can announce completion/failure; percentage updates
remain quiet. The Transitions story demonstrates this composition and keeps
milestones independent of percentage ticks. This preserves the existing quiet
contract; it does not add unsolicited announcements. Native DOM/live-region
updates are not evidence of spoken assistive-technology behavior.

## Full-row evidence map

| Row criterion | Evidence in this batch and retained tests | Residual limit |
| --- | --- | --- |
| M-02 progress/status semantics | Existing clamp/round/NaN/width/translation/SSR unit cases rerun; native 0/25/100/0 values and names; composed host milestones | Actual spoken AT output is not tested |
| M-02 reduced motion | Native catalog determinate subtree remains animation-free with both motion preferences; operation active spinner stops in reduced motion | Determinate API intentionally has no indeterminate variant |
| M-02 tokenized label/layout | Native default 60px width, 12px track, 120px width and relative 50% width; owned body2 font/line-height/gap token overrides; light/dark 320px and 200% text layout | Actual browser chrome zoom and physical-device matrix remain open |
| M-03 state transitions/announcements | Stable keyed item and mounted host Status through pending → active → completed → error → pending; keyboard Start retains focus; loading disappears on completion/error; host milestones update separately | DOM assertions do not certify spoken announcements |
| M-03 completed/error/active visuals | Check/circle/Close icons, production action/muted/danger token inheritance and override response in light/dark; active indeterminate native SVG animation/reduced motion | Wider forced-colors/manual visual review remains under broad display acceptance |
| M-03 hide single-step numbering | Existing single/empty/SSR unit coverage; native single-step list-style none, no Step 1 of 1, complete label/status text | No new count API is introduced |

## Validation

Runtime: local macOS, Node `24.21.0`, pnpm `10.29.3`, React `19.2.3`,
Vitest `4.1.11`. Node 24 is the existing local pnpm-store runtime, explicitly
selected through PATH; system Node 26 is not the test/build runtime.

Dependency prerequisite at the pinned baseline: `pnpm install --frozen-lockfile`
passed; no manifest/lockfile changes.

At `777364f519410a9ba85959f53c1ab331a86589ce`:
- `pnpm exec vitest run src/components/AppInlineProgress/AppInlineProgress.test.tsx src/components/AppOperationSteps/AppOperationSteps.test.tsx`: passed, 2 files / 7 cases.
- `pnpm typecheck`: passed after fixing the new story's required args.
- `pnpm exec tsc --noEmit -p tests/browser/tsconfig.json`: passed.
- `pnpm foundations:check`: passed, owned source/transitive/layer/token guards.
- `pnpm tokens:check`: passed.
- `git diff --check`: passed.

Focused native validation is recorded below after execution. Build/browser processes
serialize through atomic `/tmp/sgui-parallel-batch-01-validation.lock` and an owner
file containing chat `01a11678-be5b-7b90-99d0-67b025fe8c10`; cleanup checks the owner
before releasing. The first ten-minute lock wait expired without a build/test; the second waiter
was stopped after verifying its own process/worktree and that it owned no lock,
to honor the coordinator priority queue. The resumed waiter checks that queue
before acquisition and never mutates it. These are scheduling outcomes, not
browser test failures.
No other worker is interrupted, no suite sees a concurrent
Storybook rebuild, and no browser engine/assertion is weakened. Firefox launch
diagnosis belongs to the assigned separate chat; no reinstall/TMPDIR experiments
are repeated here. No full check/browser/consumer suite is claimed. Automatic codex/dev CI/title
runs are user-paused; this report relies on targeted local checks and does not
request or wait for GitHub dev checks.

## Remaining acceptance and coordinator suggestions

Keep whole-row decisions held until the missing engine/manual evidence is assessed
against the intended row criteria. Broad display/device/AT acceptance remains open;
DOM milestone tests cannot close a spoken announcement requirement. Suggested next
bounded task: run this exact focused spec under repaired Firefox and record a
manual screen-reader milestone session with the mounted host Status composition.

Central guidance owners should update the progress contract's three-status wording
to include the additive error state and danger-token/icon mapping; correct the
inventory's prior error-visual claim and link this batch's exact-head evidence.
Retain the explicit no-live-region contract and distinguish host milestone DOM
updates from spoken AT verification. No central file is changed by this worker.
