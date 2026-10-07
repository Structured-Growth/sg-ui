# Batch 13: control-button

Assigned IDs: U-03/U-18. This is a bounded loading/native-form slice; U-03 is
Typography in the current master list, so this button fix supplies U-18 evidence
without changing or closing U-03 or broad U/X/R/Z/manual/device/AT acceptance.

## Isolation and scope

Verified baseline: `b139a0d06fb06ba4a5a5aa6adc69c5cb3b206818`.
Managed attached worktree: `/Users/thomashall/.codex/worktrees/batch13-control-button/sg-ui`.
Branch: `codex/batch13-control-button`.
Implementation/tested source head: `eada660291b4787577e5417cc731fffbfc58fcbc`.
Draft PR: [#71](https://github.com/Structured-Growth/sg-ui/pull/71), base `codex/dev`.
Final report commit/head is provided in the coordinator message (a commit cannot
contain its own hash).

Exclusive write allowlist:

- `src/experimental/Button/`
- `tests/browser/batch13-control-button.spec.ts`
- `docs/developer/parallel-batch-13/control-button.md`

Primary and other worktrees, shared guides/checklists, configuration, barrels,
workflows, licensing and dependency manifests remain untouched.

## Demonstrated defect and change

Existing Button tests cover one pointer/Enter/Space activation, native refs,
disabled/pending callback blocking and explicit native submission. Prior batch-01
forms and batch-05 native-reset reports cover composed field resets, not pending
reset-button defaults.

A loading `type="reset"` button suppressed `onPress` but retained the native reset
default. The new regression failed before the fix: pointer, Enter and Space fired
three resets and discarded the edited native input value. React Aria already
changes pending submit buttons' native type; the owned wrapper now temporarily
maps pending reset buttons to `type="button"` too. Loading still retains focus,
native ref identity and translated progress. When loading ends, declared reset
behavior and the latest host callback resume. No owned API changes.

The colocated NativeFormTransitions story retains host-owned loading, disabled
and callback state. The focused browser case checks real pointer/keyboard pending
reset suppression, draft/focus retention, disabled blocking, latest callback and
press-before-reset/submit ordering after resumption.

## Targeted local evidence

Runtime: Node `24.21.0`, pnpm `10.29.3`, React `19.2.3`, Vitest `4.1.11`.
Commands run in the worktree with the Node 24 binary directory prepended to PATH:

- `pnpm install --frozen-lockfile`: passed; atomic install slot1, matching unique
  owner token `batch13-control-button-01a116b1`, released only after install.
- Before fix: `pnpm exec vitest run src/experimental/Button/Button.test.tsx --maxWorkers=1`:
  1 file, 3 passed / 1 failed at the pending reset assertion (three reset events).
- After fix: `pnpm exec vitest related --run src/experimental/Button/Button.tsx --maxWorkers=1`:
  82 related files / 468 tests passed. Includes the new regression and affected
  consumers. Existing jsdom scrollBy/navigation limitations appeared as stderr;
  they are not native browser evidence. Each Vitest command used an atomically
  claimed light-validation slot under `/tmp/sgui-light-validation-slots`, max one
  worker, and owner-matching cleanup. Global limit remains four slots.
- `pnpm typecheck`: passed.
- `pnpm foundations:check`: passed owned import/layer/token boundaries.
- `pnpm exec tsc --noEmit -p tests/browser/tsconfig.json`: passed.
- `git diff --check`: passed.

Local logs: `/tmp/batch13-control-button-install.log`,
`/tmp/batch13-control-button-before.log`, `/tmp/batch13-control-button-after.log`.
These are local evidence, not GitHub Actions artifacts.

Required fresh Storybook/focused browser execution remains **queued, not passed**.
No build/browser lock acquired and no pool bypass attempted. Existing
`/tmp/sgui-parallel-batch-01-validation.lock` owner and
`/tmp/sgui-browser-validation-priority.json` are respected; the new pool remains
subject to coordinator review/rollout. Same chat/worktree/scope is reserved for
native continuation. No unchanged Firefox launch retries will be made. No full
check, full browser/consumer matrix, GitHub dispatch/wait or merges performed.

## Remaining exact scope

Required continuation: build fresh Storybook and execute only
`tests/browser/batch13-control-button.spec.ts` under the approved shared
lock/pool protocol, then record actual native results and update this report.
No integration/native acceptance claim until that evidence is reviewed.

Potential shared documentation follow-up (outside this allowlist): add pending
reset native-type suppression to `docs/developer/react-aria-button.md`, with the
focused report link after native verification. Broader autofill, implicit submit,
mid-gesture host replacement, physical touch and assistive-technology behavior
remain separate acceptance work; this slice does not infer their results.
