# Batch 20 DateField incomplete reset — owned interaction fix

Tasks U-18/K-06: targeted unit evidence now covers prevented incomplete draft
preservation. Native browser cases are prepared but **not executed** here. Whole
U/K acceptance, browser/device/assistive-technology gates and coordinator
integration remain open. No passing browser or full-suite claim is made.

## Exact scope and provenance

Managed attached worktree:
`/Users/thomashall/.codex/worktrees/datefield-incomplete-reset/sg-ui`.
Created and verified at baseline `7124a123a93f40d0ffdc1f382f902642489154c2` before
edits; branch `codex/batch20-datefield-incomplete-reset`.

- Frozen red reproduction/report: `64f3d26c22b8854068816ad9de75ec26f5878511`.
- Coordinator-authorized dependency prerequisite:
  `2b9ca35f097bcc6f99af31c5a95f8682ef2b890e`.
- Normal full-history prerequisite merge:
  `2ae2b69563ee0140478237fcbdb36cb5e07c581d`, parents the frozen red head and the
  exact prerequisite above. It merged without conflicts; no ancestry was copied
  or rewritten.
- Implementation/source/spec head:
  `17390103b5939bb8a69fb084731af0a167167258`.
- Final report-only head is supplied separately in the coordinator handoff.

Exclusive task writes: `src/experimental/DateField/` implementation, tests and
stories; `tests/browser/batch20-datefield-incomplete-reset.spec.ts`; this report.
The prerequisite's package/lockfile and guidance changes are a separate reviewed
common dependency, not task-owned edits. Shared TextField/reset helper, composite
DatePicker/range controls, source/declaration guards and all central guidance
remain unchanged by the exclusive implementation. Coordinator owns the separately
reserved react-stately boundary-guard follow-up before facade acceptance.

## Red-first evidence and resulting behavior

Read the [batch 18 review](../parallel-batch-18/standalone-reset-review.md),
[batch 11 record](../parallel-batch-11/standalone-form-reset.md),
[calendar contract](../react-aria-calendar-contracts.md) and current implementation.
The retained regression enters day `28` into an empty DateField and calls the
real form's `reset()` beneath delegated host prevention. Before implementation,
`aria-valuenow` became absent: **one failure / nine existing passes**. Current
focus survived, proving focus alone did not preserve the draft. Original red log:
`/tmp/sgui-batch20-datefield-regression.log`.

RAC previously constructed state and reset handlers inside its parent. The owned
complete-value callback could be silenced, but incomplete display was already
cleared. Public lower-level hooks now receive an owned interaction-state facade.
The pinned field hook's `setValue` and `resetValidation` requests are form-reset
requests; the facade does not independently execute them. The existing owned
form transaction is the sole reset owner. This also prevents stale upstream
listeners from a former form from independently resetting the state. Both field
and segment hooks receive the same facade; ordinary public segment editing and
validation commands remain connected to the engine.

Host prevention leaves the original incomplete state, validation and native
nodes intact. Accepted reset explicitly calls the public engine value and
validation reset methods, silently restoring the current uncontrolled default
or controlled host value. It clears an empty draft even when the complete owned
value/default remains null. No segment replay, fabricated ISO completion, DOM
reconstruction, upstream private state mutation or propagation suppression is
used. No host edit callback is emitted by either reset path.

Native root/input/segment refs remain stable. The field retains native form
association, hidden text input/native required validation, locale segment order,
keyboard interactions, accessible label/description/error IDs, owned styles and
read-only/disabled contracts. Parsed complete values are memoized: lower-level
state rendering requires stable date object identity. No public prop/type/name
was added or removed. An absent owned error passes `isInvalid: undefined`, leaving
native required validation authoritative rather than overriding it with false.
Accepted reset clears displayed errors while an empty required input remains
natively invalid for a later submission.

Supported imports are `useDateField`/`useDateSegment` from
`react-aria/useDateField`, `useLocale` from `react-aria/I18nProvider`,
`useFocusRing`/`mergeProps` from their public subpaths, and `useDateFieldState`
from `react-stately/useDateFieldState`. Date classes/state types remain internal.
The [dependency prerequisite](../parallel-batch-21/datefield-public-hook-dependencies.md)
adds direct `react-aria@3.52.1` and `react-stately@3.50.0` aligned with RAC 1.21.1;
resolution versions are unchanged. Frozen-lock install followed the merge.

## Coverage and native handoff

The DateField file now has 13 behavior tests. New coverage preserves day `28`
and current focus after delegated prevented programmatic reset; preserves a
controlled-null day/year draft without filling the missing month; silently
clears that draft on accepted reset while retaining host null; verifies ordinary
complete edit requests remain host-owned; preserves native required errors and
associated description/error text after prevented reset; and restores a changed
current default without replacing root/input/segment refs or current focus.
Existing complete-date/default/invalid/read-only/submission cases remain passing.

Two stories demonstrate uncontrolled empty and controlled-null transactions.
The native spec keeps actual host prevention outside the form, uses real native
submit/reset buttons, preserves prevention policy until explicitly accepting the
last reset, and checks programmatic/native focus, incomplete segments, native
required validity, displayed error retention, empty submission and callback
silence. It includes accepted draft/error clearing in the same transaction.
It does not intercept submit, manufacture reset events or simulate prevention in
an engine handler. **Both native cases are unexecuted**; the coordinator must
build fresh Storybook and run the focused spec at the frozen final head. No
Storybook build may occur during a suite run.

## Validation actually run

Task-owned atomic slots: `/tmp/sgui-install-slots` (two),
`/tmp/sgui-light-validation-slots` (four). Commands used
`/tmp/sgui-batch20-datefield-slotted.py` and `/tmp/sgui-run24.mjs`; only matching
owner leases were released. All results below preceded the source commit; tested
source/spec files are identical to `1739010` and the final docs-only head.

- `pnpm install --frozen-lockfile`: passed initially and after the authorized
  dependency merge; no worker lockfile edits. Final install log:
  `/tmp/sgui-batch20-datefield-prerequisite-install.log`.
- Red-first `pnpm exec vitest run src/experimental/DateField/DateField.test.tsx`:
  **1 failure / 9 passes**, log above.
- `pnpm exec vitest related --run src/experimental/DateField/DateField.tsx`:
  **5 files / 36 tests passed**, including DatePicker, DateRangePicker,
  DateRangeSelector and the experimental SSR test. Log
  `/tmp/sgui-batch20-datefield-related-final.log`.
- `pnpm typecheck`: passed, log
  `/tmp/sgui-batch20-datefield-final-source-types.log`.
- `pnpm exec tsc --noEmit -p tests/browser/tsconfig.json`: passed, log
  `/tmp/sgui-batch20-datefield-final-browser-types.log`.
- `pnpm foundations:check` and `pnpm tokens:check`: passed, logs
  `/tmp/sgui-batch20-datefield-final-source-foundations.log` and
  `/tmp/sgui-batch20-datefield-final-tokens.log`.
- `git diff --check`: passed.

Intermediate failures were corrected: direct-hook parsing initially needed
memoization to avoid repeated engine state renders; a rejecting controlled host
emits at the first valid digit of a completing segment, so its complete-edit
assertion uses a single-digit final day. The final regression still asserts the
original multi-digit `28` draft and exact controlled-null preservation/clearing;
checks were not weakened. No unchanged test retry or check changes were made.

No full check/build/packed consumer suite, Storybook build/server, browser/native
launch, CI/title dispatch or publication ran here. The separate dependency/import/dedup proof belongs to the prerequisite worker;
the related experimental SSR unit test passed here. No packed SSR/hydration
consumer run is claimed. Coordinator review, guard
follow-up and fresh native evidence are required before bounded integration.
Native timing, Firefox, physical devices/IME and assistive technology remain
unverified. Follow [development validation](../react-aria-development-validation.md).
