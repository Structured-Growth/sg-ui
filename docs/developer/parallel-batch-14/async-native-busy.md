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
