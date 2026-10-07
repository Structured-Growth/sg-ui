# Batch 13: control-timefield

Bounded K-07/K-08 slice; neither gate is complete.

## Baseline, ownership and review

- Exact verified baseline: `b139a0d06fb06ba4a5a5aa6adc69c5cb3b206818`.
- One managed, attached isolated worktree:
  `/Users/thomashall/.codex/worktrees/batch13-control-timefield/sg-ui`.
- Branch: `codex/batch13-control-timefield`.
- Draft PR: [#67](https://github.com/Structured-Growth/sg-ui/pull/67), base `codex/dev`.
- Implementation/spec/story commit: `ff3dab5a5f1d871a42659d538f4bec8d811f586f`.
- Final report commit is supplied in the completion message; a commit cannot
  contain its own hash.
- Exclusive write allowlist: `src/experimental/TimeField/`,
  `tests/browser/batch13-control-timefield.spec.ts`, and this report.
  Other source, shared guides/barrels/config/workflows remain untouched.

Read the repository agent instructions, development validation policy, owned
calendar and architecture contracts, existing TimeField tests, and batch-01
forms/calendar plus batch-05 native-reset reports. Existing complete edit,
serialization/reset, rejected controlled request, disabled omission and malformed
external string tests were retained rather than duplicated.

Review decision: fix the demonstrated invalid-default feedback lifecycle defect.
An invalid partial default such as `23:59` initially displays the translated parse
error. Completing the clock clears the error. Native reset returns to empty
segments but previously left the owned parse error cleared. The existing shared
reset helper now restores that feedback after accepted reset. It defers the
feedback decision until delegated reset prevention has run. React Aria still owns
segments and form values; controlled host authority and the public API are unchanged.
The internal stable native-ref bridge also forwards the consumer ref.

The changed-state story demonstrates correction/reset. A separate host story and
regressions exercise incomplete controlled typing replaced with midnight, local
segment wrapping and live read-only/disabled transitions. German read-only unit
coverage verifies focus, native ref and serialization. Individual segment wrapping
has no carry into adjacent segments and introduces no date/timezone semantics.
Story labels are host example strings; the product reuses the existing translated
`common.ui.invalidTime` lookup and English defaultMessage.

## Targeted local validation

Runtime: Node `24.21.0` via `/tmp/sgui-run24.mjs`, pnpm `10.29.3`, locked
React `19.2.3`, React Aria Components `1.21.1`, Vitest `4.1.11`.
No React 18 packed-consumer or full-suite claim is made.

- `pnpm install --frozen-lockfile`: passed under an atomically acquired install
  slot. No manifest/lockfile changes. A temporary link to existing dependencies
  was removed before the frozen installation; no install ran in another checkout.
- Baseline regression: the exact baseline `TimeField.tsx` was temporarily restored
  within the allowlist while retaining the new test. `pnpm exec vitest run
  src/experimental/TimeField/TimeField.test.tsx --maxWorkers=1 -t
  'restores invalid default feedback'`: exit 1, one failing regression/six skipped;
  missing error after reset. Fixed source was restored in `finally`.
- `pnpm exec vitest run src/experimental/TimeField/TimeField.test.tsx
  --maxWorkers=1`: 1 file / 7 tests passed. Every unit run acquired one of four
  atomic global light-validation slots. Occupied slots were reported as queued,
  not passes. Initial experimental Backspace assertions were corrected: a
  controlled host rejecting complete edits does not become a partial draft merely
  by pressing Backspace. The final regression begins with a host-owned null clock,
  enters incomplete segments, then replaces it with midnight.
- `pnpm typecheck`: passed.
- `pnpm exec tsc --noEmit -p tests/browser/tsconfig.json`: passed.
- `pnpm foundations:check`: passed.
- `pnpm tokens:check`: passed.
- `git diff --check`: passed.

Native validation at `ff3dab5a5f1d871a42659d538f4bec8d811f586f`:

- `pnpm build-storybook`: passed from fresh worktree source, before execution.
  Existing bundle/client-directive warnings remain; no source changes were made
  after this build or during the suite.
- `pnpm test:browser tests/browser/batch13-control-timefield.spec.ts
  --project=chromium --project=webkit`: exit 0, 6 tests passed (3 per engine).
  Native pointer/keyboard correction and reset restore feedback and empty form
  data. English/German partial controlled edits are replaced with midnight;
  seconds wrap locally; read-only keyboard attempts preserve the host value and
  native focus/form submission; disabled values are omitted. Runtime error/warning
  assertions also passed. Harness NO_COLOR/FORCE_COLOR terminal notices are not
  browser runtime failures. This is focused native evidence, not a full matrix.
- Firefox was not launched: its unchanged documented local profile failure is
  reserved for the browser pool repair. No independent pool migration, profile
  workaround or repeated unchanged Firefox launch was attempted.

Local logs: `/tmp/sgui-batch13-timefield-red.log`,
`/tmp/sgui-batch13-timefield-green.log`,
`/tmp/sgui-batch13-timefield-storybook.log`, and
`/tmp/sgui-batch13-timefield-browser.log`. Native JSON/HTML reports are in this
worktree's ignored `artifacts/`; these are local evidence, not Actions artifacts.
Slot owner token: `batch13-control-timefield-01a116b0`; only owned slots were
released in `finally`. Fresh build and focused browser execution used
`01a116b0-caec-72b0-91f8-c4cee4ee0df7:batch13-control-timefield` at
`/tmp/sgui-parallel-batch-01-validation.lock`. Bounded waits are at most 55 seconds.
No other owner's lock/process was removed/stopped, and the priority queue was not
modified. Both phases held one lock continuously, released after the suite in
owner-checked `finally`. An extra task-owned waiting process was stopped before
it acquired a lock; the active build/suite and all other owners were untouched.
Browser pool migration is outside this assignment.

## Limits and reserved next tasks

No per-task full check/whole browser matrix/consumer matrix, Actions dispatch,
CI/title rerun, merge, publication, permission, secret or license change occurred.
DOM/jsdom tests are not native evidence or spoken assistive-technology acceptance.
Physical devices, actual IME, paste/autofill and the broader locale/AT matrix
remain unverified. Firefox retains the documented unchanged local launch
limitation; do not repeat that failure or bypass the browser pool repair.

Reserved follow-up scopes:

1. Separately owned standalone DateField/TimeField native reset prevention,
   callback silence, changed defaultValue and form reassociation acceptance;
   this fix restores owned parse feedback, not the whole upstream reset contract.
2. TimeField min/max inclusivity, 12-hour day-period boundaries and native
   partial submission/paste behavior, with explicit host authority and locale
   cases. Clock fields do not represent an instant or a cross-midnight range.
3. Shared calendar guidance/backlog reconciliation belongs to the coordinator;
   reference this report as partial K-07/K-08 evidence without closing those gates.

Broader changes need reserved ownership before implementation. Broad K/U/X/R/Z,
manual/device and assistive-technology gates remain open.
