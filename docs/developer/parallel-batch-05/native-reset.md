# Parallel batch 05: native-reset

Assignment: native-reset. Task IDs: U-18/K-06, bounded composite native-reset slice.
Baseline verified before edits: `cca9452f384d5ffaa34ad5bd4ddd015b43a2870b`.
Worktree: `/Users/thomashall/.codex/worktrees/batch05-native-reset/sg-ui`.
Branch: `codex/batch05-native-reset`.
Implementation commit: `8c92626e93108cf4fca423fb7f7a7bb6dea1de18`.
Draft PR: [#21](https://github.com/Structured-Growth/sg-ui/pull/21), base `codex/dev`.
Browser-test correction commit: `95a1f5c62480916a9976f80c589f10471ada5207`.
Final report commit/head: supplied in the coordinator completion message (a commit
cannot contain its own hash).

## Implementation and files

The shared `useFormReset` now captures native reset activity before nested fields
and defers its decision to a task. Native dispatch can checkpoint microtasks
between listeners; the prior microtask could act before delegated React `onReset`
prevented the reset. Pending tasks are canceled on cleanup/unmount; rerenders
retain the listener and pending work while providing the latest reset callback.

DatePicker suppresses nested segmented field reset callbacks, restores latest
uncontrolled defaults, preserves controlled values and closes its popup only on
accepted reset. AsyncMultiSelect suppresses nested search reset callbacks,
restores latest uncontrolled selection defaults, preserves controlled selection,
and leaves the controlled host query and search request lifetime with the host.
Prevented reset changes neither composite. Reset emits no host value/query callback.

Changed files (exclusive allowlist):

- `src/experimental/useFormReset.ts`
- `src/experimental/DatePicker/DatePicker.tsx`
- `src/experimental/DatePicker/DatePicker.test.tsx`
- `src/experimental/DatePicker/DatePicker.stories.tsx`
- `src/experimental/AsyncMultiSelect/AsyncMultiSelect.tsx`
- `src/experimental/AsyncMultiSelect/AsyncMultiSelect.test.tsx`
- `src/experimental/AsyncMultiSelect/AsyncMultiSelect.stories.tsx`
- `tests/browser/batch05-native-reset.spec.ts`
- This unique completion report.

The calendar report/helper were read as evidence; range controls and their helper
were not edited. The primary checkout and other workers' checkouts are untouched.

## Validation

Runtime: Node `24.19.0` from the bundled dependency runtime, pnpm `10.29.3`.
Dependency bootstrap alone used system Node `26.5.0` before the Node 24 path was
located. `pnpm install --frozen-lockfile` passed; no manifest/lockfile changes.
The following commands used the Node 24 binary directory prepended to PATH:

- `pnpm exec vitest run src/experimental/DatePicker/DatePicker.test.tsx src/experimental/AsyncMultiSelect/AsyncMultiSelect.test.tsx`: 2 files / 16 tests passed.
- `pnpm exec vitest related --run src/experimental/useFormReset.ts src/experimental/DatePicker/DatePicker.tsx src/experimental/AsyncMultiSelect/AsyncMultiSelect.tsx`: 3 files / 18 tests passed. Covers prevented/accepted reset, controlled/uncontrolled latest defaults, callback silence, pending callback rerender, unmount/StrictMode cleanup and host request races through reset.
- `pnpm typecheck`: passed.
- `pnpm foundations:check`: passed owned import/layer/token guard.
- `pnpm exec tsc --noEmit -p tests/browser/tsconfig.json`: passed.
- `git diff --check`: passed.

- `pnpm build-storybook`: passed, fresh static output; source bundle corresponds
  to implementation commit `8c92626e93108cf4fca423fb7f7a7bb6dea1de18` (the next
  commit changes only the browser spec).
- `TMPDIR=/tmp pnpm test:browser tests/browser/batch05-native-reset.spec.ts`:
  tested head `95a1f5c62480916a9976f80c589f10471ada5207`; all 6 Chromium/WebKit
  cases passed. All 3 Firefox cases failed to launch with `Could not find profile
  folder`; the all-project command exits 1. Local Firefox behavior is unverified.
  No Firefox reinstall/repeated runtime repair was attempted; the calendar report
  records this same environment limitation after a successful forced reinstall.
- Initial Linux CI on implementation head: source/guard/unit checks passed; all
  6 reset cases passed across Chromium/Firefox/WebKit, but the 3 request-race
  cases failed because the test assumed StrictMode effect replay in production
  Storybook. Correction `95a1f5c` uses the actual request IDs and leaves a stale
  query unresolved, then verifies its rejection and the current response after
  reset. The browser TypeScript check passed again after that correction. The
  corrected CI outcome is supplied in the coordinator completion message.

An initial build command mistakenly continued after atomic lock acquisition
failed; that worker-owned process was interrupted (exit 130), is not validation
evidence, and no other worker or lock was stopped/removed. Corrected commands use
fail-fast lock acquisition. The completed build and entire focused browser run
owned `/tmp/sgui-parallel-batch-01-validation.lock` with chat ID
`01a11673-bf82-7d02-b0fb-dec3fd38ece5`. Python cleanup verified that exact owner
and released it after browser completion. Storybook was never rebuilt during the
suite. No full check/browser/consumer suite was run.

## Remaining acceptance and coordinator guidance

This slice does not close broad U-18/K-06 or U/X/R/Z gates. Physical devices,
assistive technology, autofill/paste and the broader native form participation
matrix remain unverified. K-06 is retained as the assigned calendar interaction
association; this change does not alter presets, range drafts, Apply/Cancel or
fiscal/time-zone assumptions. No central guidance files were written.

Proposed central guidance update: document that DatePicker/AsyncMultiSelect native
resets honor delegated prevention, are silent to host callbacks, restore latest
uncontrolled defaults and leave controlled values/query/request ownership with
the host; record the focused evidence as partial U-18/K-06 only.

Proposed next bounded task: audit standalone DateField/TextField native reset
callback contracts and delegated prevention with their own exclusive ownership;
they use upstream field reset internals, while this change guards only the two
assigned composite callers. Broader native form/autofill and manual AT acceptance
should remain distinct follow-up work.
