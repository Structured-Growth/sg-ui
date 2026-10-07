# TagGroup live removal availability (U-06/X-04 partial)

Status: implementation, targeted local checks and focused Chromium native evidence
complete; ready for coordinator review. Firefox/WebKit remain pending the explicit
batch checkpoint under the latest Chromium-first task policy.
Broad IDs, manual/device and assistive-technology acceptance remain open.

## Isolation and scope

- Exact verified baseline: `b139a0d06fb06ba4a5a5aa6adc69c5cb3b206818`.
- Original managed worktree: `/Users/thomashall/.codex/worktrees/batch13-control-taggroup/sg-ui`.
  Later confirmed missing; no primary copy, manual checkout or metadata repair attempted.
- One coordinator-authorized managed replacement, created through the worktree API
  at retained head `1c9ef098da33214136e3397d4767e21853253f5a` and explicitly attached:
  `/Users/thomashall/.codex/worktrees/batch13-control-taggroup-recovery/sg-ui`.
- Branch: `codex/batch13-control-taggroup`; draft base: `codex/dev`.
- Draft PR: [#70](https://github.com/Structured-Growth/sg-ui/pull/70).
- Tested implementation head: `f0c2bad393ddc0cfa76824a60cda9fa60f54c4f3`.
- Native frozen head: `04b8a1510dc930e9e5cf095225813493d4f45911`, following the
  explicitly authorized normal full-history merge of reviewed common prerequisite
  `6b9da4423f1e6675c37571d5552474da25e90258`. No conflicts or task edits occurred.
  TagGroup tree `95388bc606072fedf3ad72941ec578a44d12516c` and browser spec blob
  `befaf650de9118b2fee7a7d8434eb9c0945f179a` remained byte-for-byte unchanged.
  The final evidence commit changes only this report; its exact head is supplied
  to the coordinator.
- Exclusive write allowlist: `src/experimental/TagGroup/`,
  `tests/browser/batch13-control-taggroup.spec.ts`, this report.
- No task edits outside the allowlist. The authorized prerequisite history merge
  supplies the reviewed browser harness/config/guidance without copying files.
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
No full `pnpm check` or full suites were requested per task under the targeted
development-validation policy. The coordinator performed the fresh Storybook build
recorded below. No GitHub CI/title runs were waited on,
rerun, dispatched or re-enabled.

## Focused native evidence and limits

Prepared native case: `tests/browser/batch13-control-taggroup.spec.ts`, one test
against `migration-proofs-taggroup--host-controlled-removal`. It checks live action
appearance/disappearance, rejection retaining focused Design, accepted Backspace
moving focus to React while skipping disabled Required topic, independent
Reference topics, and read-only Delete not requesting removal.

After the freeze, coordinator pool fifteen ran job
`e0fb9dbb-3d7d-43db-b16f-6647742661d8` against exact native head
`04b8a1510dc930e9e5cf095225813493d4f45911`. Retained evidence is under
`artifacts/browser-pool/e0fb9dbb-3d7d-43db-b16f-6647742661d8/` in the recovery worktree:
`evidence.json`, `build.log`, `types.log`, `browser.log`, `results.json`, HTML report
and immutable Storybook. Evidence and browser log were inspected after release.

Node `24.21.0`, pnpm `10.29.3`, Playwright `1.63.0`, Darwin `27.0.0`; slot 0,
loopback port 6273. Coordinator-owned commands all passed:

- `pnpm exec storybook build --output-dir <job-directory>/storybook` (fresh build).
- `pnpm exec tsc --noEmit -p tests/browser/tsconfig.json`.
- `pnpm exec playwright test tests/browser/batch13-control-taggroup.spec.ts --project=chromium`:
  **1 passed, 0 skipped, 0 unexpected, 0 flaky**, one worker, zero retries.

Browser command interval: `2026-10-07T15:55:52.786Z`–`2026-10-07T15:55:54.389Z`.
Before/after immutable build SHA-256:
`e3eefbd026a4321b2a405ae8c0b424cbea6e4353254cedd0f748b966006b654d`.
Final head equals frozen head; final tracked status is clean. The coordinator
reported the pool finished and released before authorizing this report update.
The worker started no independent build/server/native suite and did not change any
queue or lock. Recovery dependencies were installed once with frozen lockfile on
Node 24 using an atomic owned install slot and matching-owner release.

Firefox and WebKit are explicitly deferred to the batch checkpoint; neither is
claimed as passed for this task. No redundant local run was performed after native
release. No broader source changes are reserved. This is partial U-06/X-04 evidence,
not broad acceptance. Manual/device/assistive-technology gates remain open.
