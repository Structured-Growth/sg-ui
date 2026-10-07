# TagGroup live removal availability (U-06/X-04 partial)

Status: implementation and targeted local checks complete; required native evidence
pending the approved browser pool. Do not integrate until native evidence is reviewed.
Broad IDs, manual/device and assistive-technology acceptance remain open.

## Isolation and scope

- Exact verified baseline: `b139a0d06fb06ba4a5a5aa6adc69c5cb3b206818`.
- Managed attached worktree: `/Users/thomashall/.codex/worktrees/batch13-control-taggroup/sg-ui`.
- Branch: `codex/batch13-control-taggroup`; draft base: `codex/dev`.
- Draft PR: [#70](https://github.com/Structured-Growth/sg-ui/pull/70).
- Tested implementation head: `f0c2bad393ddc0cfa76824a60cda9fa60f54c4f3`.
  The report commit adds only this file; exact final report head is supplied to the coordinator.
- Exclusive write allowlist: `src/experimental/TagGroup/`,
  `tests/browser/batch13-control-taggroup.spec.ts`, this report.
- No source/barrel/config/shared-guide/checklist/workflow edits outside the allowlist.
  Primary and all other worktrees preserved.

## Inspection and demonstrated defect

Read AGENTS.md, development validation, architecture/component guidance,
README/migration, remaining-control and proof-control contracts, existing colocated
tests/stories and the U-12 completion evidence in react-aria-progress.md.
Existing six tests already covered next/previous/empty removal focus, pointer
removal, host item authority, disabling, translation and native refs.

The unfinished combination is a host changing a retained collection from read-only
to removable and back. The item objects remain identical. React Aria enabled
keyboard removal after `onRemove` appeared, but its cached rendered children omitted
the remove actions. Before the fix, the new regression failed to find `Remove Beta`
(1 failed, 6 passed). The fix declares the render dependency on the presence of
`onRemove`, without changing item identity, APIs or host ownership.

The regression also checks reverse removal availability and rejected host removal.
A second targeted case checks repeated rejected Delete/Backspace requests retain
focus and do not affect a second collection with identical IDs. The new
HostControlledRemoval story composes these host states. TagGroup has no public
selection API; this task does not add one or change AsyncMultiSelect.

## Local evidence

Runtime: Node `24.21.0`, pnpm `10.29.3`, React `19.2.3`, React Aria Components
`1.21.1`, Vitest `4.1.11`. Node was invoked using the existing cached Node 24 binary.

Commands and results:

- `pnpm install --frozen-lockfile`: passed, 608 packages; install used an atomically
  claimed `/tmp/sgui-install-slots/slot0..slot1`, unique worker owner token, and
  owner-matched release. Initial attempts were queued (exit 75), not passes.
- `pnpm exec vitest run src/experimental/TagGroup/TagGroup.test.tsx --maxWorkers=1`:
  pre-fix 1 failed/6 passed; post-fix 7/7; final 8/8 passed. Each run used an atomic
  slot from `/tmp/sgui-light-validation-slots/slot0..slot3`, unique worker token and
  owner-matched release. One initial final-run attempt queued before acquiring.
- `pnpm typecheck`: passed (production source and stories).
- `pnpm foundations:check`: passed (owned import/layer/token boundaries).
- `pnpm tokens:check`: passed.
- `pnpm exec tsc --noEmit -p tests/browser/tsconfig.json`: passed.
- `git diff --check`: passed.

The final head adds only the independent-collection unit case after the source/story
checks; production source/story/browser test bytes are those checked earlier.
No full `pnpm check`, full suites or Storybook build was requested per task under the
targeted development-validation policy. No GitHub CI/title runs were waited on,
rerun, dispatched or re-enabled.

## Required native continuation and limits

Prepared native case: `tests/browser/batch13-control-taggroup.spec.ts`, one test
against `migration-proofs-taggroup--host-controlled-removal`. It checks live action
appearance/disappearance, rejection retaining focused Design, accepted Backspace
moving focus to React while skipping disabled Required topic, independent
Reference topics, and read-only Delete not requesting removal.

Native execution and fresh Storybook are **pending**, not passed. No browser, server
or build was started. The shared heavy lock
`/tmp/sgui-parallel-batch-01-validation.lock` and
`/tmp/sgui-browser-validation-priority.json` remain untouched. Earlier workers
retain priority; the pool protocol is under coordinator review. The coordinator
authorized the draft/report with pending evidence and requires continuation in this
same chat/worktree after protocol approval, with no integration before review.

Exact next scope: build fresh Storybook and run this single browser file using the
approved pool/runtime/engine protocol, record tested head/command/counts/limitations
here and update PR evidence. Do not retry unchanged Firefox runtime failures. No
broader source changes are reserved. This is partial U-06/X-04 evidence, not broad
acceptance; jsdom focus assertions do not establish native focus behavior.
