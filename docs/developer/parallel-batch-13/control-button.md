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

At the initial report head, required fresh Storybook/focused browser execution was **queued, not passed**.
The completed coordinator runs and correction are recorded below.
No build/browser lock acquired and no pool bypass attempted. Existing
`/tmp/sgui-parallel-batch-01-validation.lock` owner and
`/tmp/sgui-browser-validation-priority.json` are respected; the new pool remains
subject to coordinator review/rollout. Same chat/worktree/scope is reserved for
native continuation. No unchanged Firefox launch retries will be made. No full
check, full browser/consumer matrix, GitHub dispatch/wait or merges performed.

## Remaining exact scope

Original required continuation (now completed below): build fresh Storybook and execute only
`tests/browser/batch13-control-button.spec.ts` under the approved shared
lock/pool protocol, then record actual native results and update this report.
No integration/native acceptance claim until that evidence is reviewed.

Potential shared documentation follow-up (outside this allowlist): add pending
reset native-type suppression to `docs/developer/react-aria-button.md`, with the
focused report link after native verification. Broader autofill, implicit submit,
mid-gesture host replacement, physical touch and assistive-technology behavior
remain separate acceptance work; this slice does not infer their results.

## Approved prerequisite and first native pool outcome

The coordinator explicitly authorized normally merging full reviewed dev ancestry
`6b9da4423f1e6675c37571d5552474da25e90258` into this same worktree.
Conflict-free ort merge `d6e77073be8797bdbac131fa55b2518a450fb179` has task parent
`6b92046dbb2737e0e3bd5821496526bdd75f4c20` and that reviewed prerequisite parent.
Inherited harness/config/docs changes are separate from the exclusive task edits;
no copied harness, selective graft or worker configuration edits were made.

The coordinator built fresh Storybook and passed browser types at frozen
`d6e77073be8797bdbac131fa55b2518a450fb179`, then ran the focused spec in the
approved pool. Both Chromium/WebKit cases failed (0 passed / 2 failed): pending
reset/draft/focus/disabled assertions passed, but resumed Space produced
`reset press 2 | reset press 2 | reset`. No assertion was relaxed. Pool evidence:
`artifacts/browser-pool/1bbc817e-2e9e-463e-84b3-1edb12b6f9df/browser.log` and
its engine traces/error contexts. Frozen source and immutable digest remained
intact; coordinator explicitly unfroze the worktree for repair.

React Aria's keyup press and the native form button keyboard click both call the
host for Space. Enter also calls the host after the native form action, verified
by two failing colocated reset/submit ordering cases before repair. Native
submit/reset buttons now deliver their owned host callback from the single
native click capture, before the browser form default. Their React Aria press
handler is omitted; ordinary buttons retain normalized React Aria onPress.
Native pointer, keyboard and programmatic/AT click paths share the same callback;
loading/disabled guards remain explicit and APIs/refs are unchanged. This DOM
path is not a manual AT acceptance claim.

Repair validation (same Node 24/pnpm runtime):

- Before repair: `pnpm exec vitest run src/experimental/Button/Button.test.tsx --maxWorkers=1`:
  4 passed / 2 failed, native Enter action before host callback for reset/submit.
- After repair: `pnpm exec vitest run src/experimental/Button/Button.test.tsx src/components/AppButton/AppButton.test.tsx --maxWorkers=1`:
  2 files / 10 tests passed, including pointer/Enter/Space single callback/order.
- `pnpm typecheck`, `pnpm foundations:check`, and
  `pnpm exec tsc --noEmit -p tests/browser/tsconfig.json`: passed.
- `git diff --check`: passed.

Vitest used atomic owner-matching light-slot acquisition/release with maxWorkers1;
no standalone build/server/browser run or unchanged Firefox retry was started.
Repair logs: `/tmp/batch13-control-button-native-before.log` and
`/tmp/batch13-control-button-native-after.log`. At the repair report head, the required coordinator focused
Chromium/WebKit rerun remained queued and native acceptance incomplete. The
completed rerun is recorded below.

## Final focused native evidence

Coordinator-authorized corrected pool run passed at exact clean frozen source
head `0c6fc7664e1faffee0071ac55e48390603bfd748`. The final report-only commit does
not change that tested source/spec/story. Coordinator released the worktree after
completion; no unchanged test reruns were performed.

Evidence directory in this worktree:
`artifacts/browser-pool/eff31a65-03c7-4663-877e-9bca8a541041/`.
`evidence.json` records exact commands, head, runtime, immutable digests and clean
final source; `results.json` records 2 expected passes, 0 unexpected failures,
0 skips, 0 flakes and no runtime errors.

- `pnpm exec storybook build --output-dir <evidence-directory>/storybook`: passed,
  freshly built before the suite.
- `pnpm exec tsc --noEmit -p tests/browser/tsconfig.json`: passed.
- `pnpm exec playwright test tests/browser/batch13-control-button.spec.ts --project=chromium --project=webkit`:
  2 passed (one per engine). Pending reset preserves the native form draft and
  focused button, pending submit does not activate, disabled native controls block
  activation, and re-enabled Space reset/Enter submit each deliver the replacement
  host callback once before the native form event.

Runtime: Node `24.21.0`, pnpm `10.29.3`, Playwright `1.63.0`, Darwin `27.0.0`.
Coordinator queue owner: `01a1164f-41db-7f30-aaf9-f20133b6566f`.
Pool owner: `browser-pool:24380:0f8a800c-a77c-4fa2-a176-fe5a5179aa37`.
Pool slot1, isolated port6274. Builds followed the existing heavy-validation lock;
coordinator owned the pool, and this worker started no independent build/server.
Static digest before/after suite:
`d79bd94c3c93c0dbcf60cd5d84f5599e6881d595f25295f494c5009282b095ec`.
Source/head/static digest remained unchanged throughout the browser run.

Firefox was not selected because its documented local runtime prerequisite
remains blocked; no unchanged launch retries occurred. This is focused local
Chromium/WebKit evidence, not the complete engine matrix, production acceptance,
physical-device, screen-reader or broad U-18/U/X/R/Z completion.

The bounded task's mandatory focused native continuation is complete. Shared
button documentation remains a separately reserved follow-up outside the exclusive
allowlist. No merges into dev/main, publication or GitHub CI actions were performed
by this worker; the normal reviewed prerequisite merge is the only inherited
shared change.
