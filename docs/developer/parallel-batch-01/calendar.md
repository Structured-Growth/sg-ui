# Parallel batch 01: calendar

Assignment: calendar. Task IDs: K-03–K-10, K-17 (bounded partial acceptance).
Base: `9f153642e827a14033d646cf0160730c0793bdfc`.
Worktree: `/Users/thomashall/.codex/worktrees/batch01-calendar/sg-ui`.
Branch: `codex/batch01-calendar`.

## Slice

DateRangeSelector now shows a translated visible range preview from its private
interaction state. Keyboard activation establishes an anchor and moves focus to
the nearest available endpoint; arrows preview forward/reverse ranges across
leap day/month boundaries. Apply cannot commit the previous draft while an
endpoint is pending. Cancel, Clear, presets and typed edits clear the anchor.
Changed host committed values clear it without remounting the calendar. Leaving
the calendar cancels the unfinished preview rather than synthesizing an endpoint. Complete
localized date-cell labels and owned serializable callback contracts remain intact.

Standalone native form reset now restores uncontrolled committed defaults and
drafts; controlled hosts retain their committed value. A prevented reset retains
the draft; host `form.reset()` with calendar focus also retains the anchor. Moving
focus outside cancels the anchor independently of reset. Segmented reset callbacks cannot reset individual endpoints
outside that whole-draft transaction. Reset emits no host commit callback. The calendar-local reset helper defers the
transaction to a new task; native browser dispatch can checkpoint microtasks
before delegated React reset prevention. DateRangePicker uses that helper too.

Added stories and targeted regressions for those behaviors, century leap-year and
month/year validity, inclusive unavailable interior dates, reversed segmented
edits, picker Escape/Cancel/focus return/reset and date-only browser timezone
independence (Chicago/Tokyo). This adds no scheduling/recurrence behavior.

## Files

- `src/experimental/DateRangeSelector/DateRangeSelector.tsx`
- `src/experimental/DateRangeSelector/DateRangeSelector.test.tsx`
- `src/experimental/DateRangeSelector/DateRangeSelector.stories.tsx`
- `src/experimental/DateRangeSelector/useCalendarFormReset.ts`
- `src/experimental/DateRangePicker/DateRangePicker.tsx`
- `src/experimental/DateRangePicker/DateRangePicker.stories.tsx`
- `tests/browser/batch01-calendar.spec.ts`
- `docs/developer/react-aria-calendar-contracts.md`
- This exclusive report.

## Validation

- `pnpm install --frozen-lockfile`: passed, no package/lockfile edits.
- Latest selector/picker targeted Vitest suite: 16 tests passed; calendar/date/time
  regressions also run in the full check.
- `pnpm check`: passed, 143 test files / 975 tests, owned boundaries, token/CSS,
  source/story types, release policy, package build/import/type smoke included.
- `pnpm build-storybook`: passed, fresh static output before browser execution.
- Browser TypeScript compilation and `git diff --check`: passed.
- `TMPDIR=/tmp pnpm test:browser tests/browser/batch01-calendar.spec.ts tests/browser/calendar.spec.ts`:
  all 18 Chromium/WebKit cases passed (10 new, 8 existing); nine Firefox cases
  could not launch. The all-project command exits 1, not a fully passing suite.
  Firefox reports `Could not find profile folder` both with its default temporary
  path and `/tmp`, including after `playwright install --force firefox` succeeded.
  Firefox calendar behavior is unverified and needs a working runtime/CI run.
- Browser-discovered reset timing and implicit blur-selection defects are fixed;
  unavailable-range focus assertions now verify native contiguous-range clamping.
- Heavy checks/builds and every browser server serialized with the shared atomic
  lock and own-owner trap cleanup. The coordinator received both requested priority
  turns before this worker reacquired. Storybook was never rebuilt during a suite.

## Review and remaining work

Implementation commit: `50d241b05307110b730e43b3c9df599368d0abb9`.
Draft PR: [#14](https://github.com/Structured-Growth/sg-ui/pull/14), base `codex/dev`.
The report is committed separately after this implementation commit. The final
report commit/head is supplied to the coordinator with the completion message.
No merge or publication was performed.

Broad K-03–K-10/K-17 and U/X/R/Z acceptance remains open. Live assistive-technology
announcements, physical-device touch, zoom, paste/autofill and the complete locale,
calendar-system, datetime/timezone matrix are not established by this slice.
No primary checkout or shared guidance/configuration was edited.

Coordinator guidance update: record the selector's visible keyboard range preview,
Apply blocking during a pending anchor and whole-draft native reset contract in
AGENTS/progress records as partial K-03/K-06/K-07/K-08/K-17 evidence. Do not mark
these broad task IDs complete.

Out-of-scope finding: shared `src/experimental/useFormReset.ts` uses a microtask
and can act before delegated host reset prevention in native browser dispatch.
The range controls now use an owned calendar-local helper. Coordinator integration
should audit its remaining DatePicker and AsyncMultiSelect callers without
changing that shared hook in this worker.

Suggested next bounded assignment: native prevented-reset/form ownership matrix
for DatePicker and AsyncMultiSelect, with a coordinated shared reset-helper fix
and the native browser timing evidence here.
Translated RTL/non-Gregorian preview and live screen-reader acceptance remain
subsequent work; assistive-technology evidence must be explicit manual evidence.
