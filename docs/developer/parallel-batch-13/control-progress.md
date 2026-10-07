# Batch 13 control-progress evidence

Assigned U-11/X-03 slice: determinate/indeterminate transitions, invalid ranges,
accessible values and status updates. The current master list attributes Progress
and Status to U-13, and U-11 to list/navigation/disclosure. This report preserves
that distinction; no master row or broad acceptance ID is closed.

## Isolation and ownership

Baseline verified before edits: `b139a0d06fb06ba4a5a5aa6adc69c5cb3b206818`.
One managed worktree was created and attached at that exact commit:
`/Users/thomashall/.codex/worktrees/batch13-control-progress/sg-ui`.
Branch: `codex/batch13-control-progress`. Draft PR base: `codex/dev`.
Implementation/test head: `c3a4087b794666a7c658cc2a2926c58bf1a69dcd`.
The final report commit follows; the final pushed SHA is delivered to the
coordinator to avoid a self-referential hash.

Exclusive write allowlist:

- `src/experimental/Progress/`
- `tests/browser/batch13-control-progress.spec.ts`
- This report.

Actual source changes are only `Progress.tsx`, `Progress.test.tsx` and
`Progress.stories.tsx` in that directory. No browser spec was added. All other
source, barrels, configuration, shared guides/checklists/workflows, licensing,
primary checkout and other worktrees were preserved.

## Reproduction and fix

The existing tests already cover bounded values, ordinary invalid bounds,
loading/finite/NaN transitions, accessible names/value text, native refs and SSR.
[Status tests](../../../src/experimental/Status/Status.test.tsx) already cover
quiet/off, polite/atomic, assertive/danger and SSR behavior. Existing
[display preference browser cases](../../../tests/browser/display-preferences.spec.ts)
cover reduced-motion progress. These are existing evidence, not fresh native or
spoken-AT acceptance. Previous batch reports and the
[owned contract](../react-aria-progress-avatar.md) were inspected before editing.

The genuine unfinished combination is loading followed by determinate progress
with equal extreme finite bounds. `minimum + 100` rounds back to `minimum` at
positive and negative `Number.MAX_VALUE`. The fallback therefore failed to
produce the documented finite increasing range, allowing undefined percentages.
Both new parameterized regressions failed on unchanged source (4 existing tests
passed, 2 new cases failed).

Progress now falls back to 0–100 when its usual derived maximum is non-finite or
cannot exceed the minimum. Representable ordinary fallback ranges are preserved.
Linear and circular regressions assert 0/100 bounds, current value 50,
host-supplied value text, 50%/50-of-100 visual markup, and transition back to loading.
The colocated `UnrepresentableInvalidRange` story demonstrates the changed case.
No public API, styling, host status authority or announcement policy changed.

## Local validation

Runtime: bundled Node **24.19.0**, pnpm **10.29.3**, Vitest **4.1.11**,
React **19.2.3**, jsdom. Commands use
`PATH=/Users/thomashall/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH`.

- `pnpm install --frozen-lockfile`: passed; no tracked dependency changes.
- Baseline `pnpm exec vitest run src/experimental/Progress/Progress.test.tsx --maxWorkers=1`:
  **1 file, 4 passed / 2 failed**, reproducing the defect on assigned source.
- Final `pnpm exec vitest run src/experimental/Progress/Progress.test.tsx src/experimental/Status/Status.test.tsx --maxWorkers=1`:
  **2 files / 8 tests passed**.
- `pnpm typecheck`: passed, including the new story.
- `pnpm foundations:check`: passed (owned import/layer/token checks).
- `git diff --check`: passed; exact allowlist verified.

Final source validation ran on the baseline plus the source/test/story diff now
committed as the implementation head above. Report-only changes follow it.
Local logs: `/tmp/sgui-batch13-control-progress-{install,baseline,unit,types,foundations}.log`.

Installation atomically claimed `/tmp/sgui-install-slots/slot1`, after queueing
behind other owners; Vitest atomically claimed
`/tmp/sgui-light-validation-slots/slot3`, with `--maxWorkers=1`. Both owner files
contained `01a116b1-580a-7722-8683-e9a092fc879d-control-progress`; only matching
owned slots were released. No other lock/process was removed or stopped.
Queueing was never recorded as a pass.

This numeric normalization change adds no native timing/layout/focus behavior.
No fresh browser build/run or browser pool bypass was needed; the heavy lock and
priority queue were untouched. No full pnpm check, Storybook build, full suites,
packed consumers, React 18, physical-device, manual or assistive-technology
acceptance is claimed. Dev GitHub CI/title runs remain paused; none were waited
on, rerun, dispatched or re-enabled. No merges/main/publication or permissions/
secrets changes.

## Follow-ups and limits

Broad U/X/R/Z and manual/device/AT gates remain open. DOM semantics do not prove
spoken status announcements. A separate bounded task can audit finite ranges
whose subtraction overflows (for example negative to positive Number.MAX_VALUE),
with scope `src/experimental/Progress/`, its focused tests/stories and a unique
report; this task addressed only invalid fallback bounds. A native composed
progress/completion-status announcement check belongs in its own browser/AT slice
once the reviewed browser pool is available. No broader source change is needed
for this fix.

Coordinator-only guidance follow-up: link this report from progress acceptance
and retain the U-13 versus assigned U-11 distinction. Shared guides/checklists
were read-only here. One completion handoff to the coordinator is authorized.
