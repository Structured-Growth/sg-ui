# Batch 13 control-disclosure: bounded focus and composition evidence

## Ownership and baseline

- Baseline: `b139a0d06fb06ba4a5a5aa6adc69c5cb3b206818` (verified immediately after managed worktree creation, before edits).
- Attached managed worktree: `/Users/thomashall/.codex/worktrees/batch13-control-disclosure/sg-ui`.
- Branch: `codex/batch13-control-disclosure`; draft [PR #64](https://github.com/Structured-Growth/sg-ui/pull/64) targets `codex/dev`.
- Exclusive source allowlist: `src/experimental/Disclosure/`, `tests/browser/batch13-control-disclosure.spec.ts`, this report. Shared guides, contracts, checklists, barrels, configuration and workflows remain unchanged.
- Implementation commit: `2170e9c3c3951666c78cf49761b0ebd27ad71707`. Initial report commit: `6d0e8da`. This PR-link update is listed in branch/PR history.
- Assignment mentions U-09/X-16. The master list assigns U-09 to Tabs; the existing disclosure contract is U-11. This change supplies bounded U-11/X-16 composition/focus evidence without editing or closing either checklist.

## Existing evidence and demonstrated defect

The existing [Disclosure tests](../../../src/experimental/Disclosure/Disclosure.test.tsx) already cover rejected controlled collapse, disabled requests, sibling independence, retained drafts and host-collapse focus restoration. [SSR tests](../../../src/experimental/Disclosure/Disclosure.ssr.test.tsx) cover deterministic retained/unmounted content and linked IDs. [Remaining control contracts](../react-aria-remaining-controls.md) specify that ordinary host focus movement is preserved. The prior [progress record](../react-aria-progress.md) includes representative native collapse evidence, but not the removal-then-outside-focus sequence here. No duplicate feature implementation or heading API was added.

A new regression first failed: focus the draft, remove it while the panel remains expanded, focus an outside host action, then collapse from host state. The capture flag can remain stale because removing a focused child skips blur. The effect incorrectly focused the disclosure trigger despite the host action owning focus.

The fix checks the panel document's current active element before focus restoration. Restoration still occurs when focus remains inside the panel or falls to the document body after removal; a later outside focus owner is preserved. Public props, controlled authority, native root refs, translations and CSS are unchanged. No licensing changes.

Expanded local assertions cover controlled rejection/ref retention, accepted unmount/ref release and fresh child ref on reopen, nested independent requests, retained inner state, host-supplied h2/h3 semantics and root/child ref cleanup. They establish DOM semantics, not spoken assistive-technology behavior.

The `RemovedFocusedDraft` story removes its focused input on Escape and lets the outside host button collapse/reopen the panel. The dedicated browser case asserts native outside focus survives collapse and reopen.

## Local validation

Runtime: Node `24.21.0`, pnpm `10.29.3`, React/React DOM `19.2.3`, Vitest `4.1.11`, TypeScript `5.9.3`, Storybook `10.6.1`, Playwright `1.63.0`. Existing workspace dependencies were temporarily reused via a local symlink; no install or lockfile change. Initial red regression ran with host Node `26.5.0`; final affected tests and guards ran with Node 24.

- Red: `pnpm exec vitest run src/experimental/Disclosure/Disclosure.test.tsx --maxWorkers=1`: 1 failed, 3 passed; the new outside-focus assertion failed before the fix.
- Green: `pnpm exec vitest run src/experimental/Disclosure/Disclosure.test.tsx src/experimental/Disclosure/Disclosure.ssr.test.tsx --maxWorkers=1`: 7 passed across 2 files (5 behavior, 2 SSR), Node 24.21.0. The tested product logic matches implementation commit `2170e9c`; the only subsequent source adjustments were an explanatory comment and the story's native event handler placement.
- `pnpm typecheck`: pass after correcting an unsupported TextField story prop by using the Disclosure native root handler.
- `pnpm foundations:check`: pass.
- `pnpm tokens:check`: pass.
- `pnpm exec tsc --noEmit -p tests/browser/tsconfig.json`: pass.
- `git diff --check`: pass.

Each Vitest execution acquired one atomic slot under `/tmp/sgui-light-validation-slots/slotN`, recorded owner token `batch13-control-disclosure`, and released only its own slot in `finally`. No installs, full check, full browser matrix, packed consumers or full Storybook build were run.

## Pending native acceptance and reserved next work

Native browser/build validation is **queued, not passed**. The shared `/tmp/sgui-parallel-batch-01-validation.lock` was owned by chat `01a116a4-fa98-7d20-a217-302eca6279e1`; priority queue contained that chat plus `01a116a4-fd4c-7ab3-acfa-d29891b53fef` and `01a116a4-f72f-7853-b068-47a3e2ebe9cb`. No owner was interrupted, lock/queue removed, browser pool bypassed, or unchanged Firefox failure retried.

Required follow-up: after those priorities and browser pool readiness, reserve the shared lock, build fresh static Storybook from this implementation, and run `pnpm test:browser tests/browser/batch13-control-disclosure.spec.ts` through the supported pool/browser setup. Record exact tested commit, engines and counts here. Do not integrate this focus change as natively validated before that evidence exists. If native results differ, reserve this same allowlist for the correction rather than changing shared infrastructure in this task.

Broad X/U acceptance, React 18 native coverage, manual/device/AT acceptance and production/full-checkpoint acceptance remain open. GitHub dev CI/title jobs remain paused; no waits, reruns, dispatches, merges, publication or permission changes.
