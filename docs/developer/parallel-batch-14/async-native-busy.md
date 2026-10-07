# Batch 14: AsyncMultiSelect native busy forwarding

Bounded H-06/X-03 follow-up to reviewed [PR #40](https://github.com/Structured-Growth/sg-ui/pull/40),
exact reviewed head `71d6ecdb733cea4131964132f10cbabf8912e53b`, accepted for the
bounded direction audit in [batch 13 review 2](../parallel-batch-13/review-2.md).
The canonical master IDs remain open; DOM state does not establish actual speech.

## Isolation and ownership

Exact verified dev baseline: `f1e5e457ce6240022ca07d6336ea06c5b67c917c`.
Managed worktree: `/Users/thomashall/.codex/worktrees/batch14-async-native-busy/sg-ui`.
Branch: `codex/batch14-async-native-busy`. Created and attached before edits.

Exclusive write allowlist:

- `src/experimental/AsyncMultiSelect/`
- `tests/browser/batch14-async-busy.spec.ts`
- `docs/developer/parallel-batch-14/async-native-busy.md`

Other sources, direction/reset evidence, central guidance/checklists, configuration,
workflows and licensing are read-only. No new public props, host-ref API or fetching
ownership is introduced. Existing internal input ref/reset machinery is preserved.

## Reproduction and change

The added regression failed before implementation changes: native ListBox
`aria-busy` was `null` instead of `true`; 12 existing tests passed, 1 new failed.
The pinned React Aria Components 1.21.1 ListBox still filters the supplied attribute.
A stable private native element ref applies/removes only the owned busy attribute
when host loading changes. List/input identity and interaction refs remain intact.

The new Strict Mode regression covers loading, failure with retained stale results,
host retry request, host loading and success, then unmount. An independent selector
never becomes busy. Stale options stay blocked during loading/error; retry itself
requests the host and does not manufacture loading. Host query, description links,
controlled selection and selected records outside current results remain authoritative.
Search focus survives prop transitions. Existing direction/reset and request-race
coverage was read and retained; no duplicate tests or AT claim was added.

`NativeBusyLifecycle` demonstrates deterministic host transitions with an independent
selector. The focused browser case checks native busy transitions, stale-result
blocking, unchanged DOM handles/query, independent state and success selection.

## Validation evidence and remaining work

Runtime: Node `v24.19.0`, pnpm `10.29.3`, Vitest `4.1.11` (host default Node
`v26.5.0` was not used for validation). Commands use bundled Node prepended to PATH.

- `pnpm install --frozen-lockfile`: passed; dependencies were absent. Atomic
  `/tmp/sgui-install-slots/0`, unique owner token, finally cleanup; limit 2.
  Lockfile unchanged. No approval/build-script permission changes.
- Baseline plus added regression: `pnpm exec vitest run src/experimental/AsyncMultiSelect/AsyncMultiSelect.test.tsx --maxWorkers=1`:
  expected failure, 12 passed/1 failed, native busy missing.
- After bridge: same command passed, 13/13; final focused rerun also passed 13/13 after adding focus preservation assertions.
- `pnpm typecheck`: passed.
- `pnpm foundations:check`: passed.
- `pnpm tokens:check`: passed.
- `pnpm exec tsc --noEmit -p tests/browser/tsconfig.json`: passed.
- `git diff --check`: passed.

Light commands acquired atomic `/tmp/sgui-light-validation-slots/0`, unique owner
and finally cleanup, limit 4; no full per-task suites. This follows the user override
and [development validation policy](../react-aria-development-validation.md).

Fresh Storybook build and focused browser run are **pending** existing priority
workers and pool proof/review. The worker requested coordinator queue access without
changing `/tmp/sgui-browser-validation-priority.json` or taking the current global
`/tmp/sgui-parallel-batch-01-validation.lock`. Do not treat this as completion.
No unchanged Firefox retry, full check/consumer matrix, paused CI/title run,
merge/main/publication or physical-device/manual/AT gate closure.

Implementation head: `0c463a6428806a7dd4a0c9905aa5c388a8434e1b`. Targeted commands ran on the identical implementation tree before commit. Final report head is the draft PR head; later report-only commits do not change tested implementation.
Draft [PR #86](https://github.com/Structured-Growth/sg-ui/pull/86) targets `codex/dev`.
Evidence report head before this PR-link-only commit: `5f52bfd79346a882298b16332fea8c949d146ab3`.
Independent exact-head review remains pending. Reserve central documentation/master
checklist changes for the coordinator; broader H-06/X-03 and production acceptance
remain open. Browser evidence must be completed before integration acceptance.


## Managed recovery and first native attempt

The original managed directory was absent. Coordinator authorized one managed
recovery from saved exact head `526d7dbd9179e49220ab43b1638308376cd8ebce` into
`/Users/thomashall/.codex/worktrees/batch14-async-native-busy-recovery/sg-ui`.
Creation/attachment succeeded. A normal history merge of reviewed harness
`6b9da4423f1e6675c37571d5552474da25e90258` produced clean frozen head
`426828bfe0d12e75b180a4fe9d5bec426f3b8aba`. Own component/spec/report bytes were
unchanged before/after the merge. Frozen install used Node 24.19.0, canonical
install slot 0 with unique owner/finally cleanup; lockfile unchanged.

Coordinator pool attempt `e661d689-6787-4915-bfa6-65807798042e` ran at that
exact frozen head using Node 24.21.0, pnpm 10.29.3, Playwright 1.63.0, slot 1,
port 6274. Fresh Storybook build and browser TypeScript passed. Selection:
`tests/browser/batch14-async-busy.spec.ts --project=chromium`, pool worker count 1,
no worker override. Build digest before/after was identical:
`51b2b17bc724b9901f0ba3208cd38d2b24f75162e23709171ea38c8c128f5001`.
Evidence/log/trace live under this recovery worktree's
`artifacts/browser-pool/e661d689-6787-4915-bfa6-65807798042e/`.

**Outcome: 1 failed, 0 passed.** Initial native pending busy and independent
nonbusy assertions passed. At original spec line 14, `locator.click()` resolved
the retained option with `aria-disabled="true"` and waited for enabled actionability
until the 30-second timeout. Trace and error context confirm no mouse gesture was
dispatched. Failure/retry/success assertions were not reached. This is a fixture
driver mistake, not an observed product or harness environment failure; no focus
or shared overlay regression is demonstrated by this run.

The scoped correction uses an actual `page.mouse.click` at the visible option's
bounds, after asserting disabled state and hit-testing that the coordinate belongs
to that option. It retains the selection-change assertions and explicitly verifies
busy state after each attempted disabled interaction. No forced locator click,
synthetic event or weakened assertion; runtime and story are unchanged. The same
physical pointer check is applied in loading and error states. Fresh coordinator
native evidence remains required on the corrected head. Firefox/WebKit checkpoint,
manual/device/AT and broad acceptance remain pending; no unchanged retry or own
heavy/browser run was launched. No shared Menu/Popover/ComboBox prerequisite is
needed for this demonstrated driver error.

Corrected spec `pnpm exec tsc --noEmit -p tests/browser/tsconfig.json`: passed
under Node 24.19.0 and canonical light slot 1, unique owner/finally cleanup.
`git diff --check`: passed; AsyncMultiSelect source/story/test bytes unchanged
from frozen native-attempt head. No runtime unit rerun was needed for this spec-only
driver correction.
