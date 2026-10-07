# Batch 140: DatePicker first corrected submission

Parent links: K-03, K-06. This is a bounded recovery slice, not whole calendar,
native/device, assistive-technology or broad acceptance closure.

## Ownership and starting state

Managed isolated worktree: `/Users/thomashall/.codex/worktrees/b995/sg-ui`.
Baseline: `164421fd639608a4afcfc013adda1d80ebf80cc7` (requested pushed `codex/dev`).
The coordinator's durable state reserves batch140's five-file allowlist exclusively;
older batch73 ownership is integrated/released. No shared state or reservation was
changed. Only the four implementation/test files below and this report are owned.
The final clean commit identity is supplied in the completion receipt to avoid
embedding a self-referential Git hash in this file.

## Retained red evidence and attribution

The actual frozen checkpoint head is
`c7e4863c922e7b94fb9fef143307343850993bff`.
Root receipt:
`/Users/thomashall/.codex/worktrees/reviewed-dev-fw-checkpoint-43/sg-ui/artifacts/browser-pool/74a00435-d263-40f8-bb40-57fac90a4818/evidence.json`.
The DatePicker shard reports 10 expected cases and two failures: the first corrected
required-empty submit in Firefox and WebKit. The original assertion expects
`2024-02-29`, but the host output stays `Not submitted`. These failures remain red.

Read-only review inputs under the coordinator's visualization directory:

- `wave43-early-failure-review.json`, SHA-256
  `22fa904c99bbd381b37b59744091d31abb9d1fc2fbce96eee6c843da8f41ec40`.
- `wave43-additional-native-failure-review.json`, SHA-256
  `8af36a0988e9b70ac9d141f5a10c69c95515db0bc743a3bb68cda01f0fafd490`.

The Firefox trace before the corrected submit contains complete segment values
2/29/2024, native input value `2024-02-29`, and exactly
`["0020-02-29","2024-02-29"]` in the callback ledger. Its failure screenshot shows
the error row has disappeared while the host remains unsubmitted. This supports
error removal on blur as a possible layout shift during the pointer gesture;
it does **not** establish the precise native invalid/click sequence. The retained
trace does not expose custom-validity details or an event ledger.

The unchanged checkpoint DateField/DatePicker source and installed
`react-aria@3.52.1` / `react-stately@3.50.0` engine implementations were inspected.
`useDateField` passes the facade's `setValue` to `useFormReset`;
`useFormValidation` invokes the facade's `resetValidation` in its reset listener.
`useDateSegment` does not call `resetValidation`. Edits/blur use `commitValidation`,
and native custom validity follows realtime validation. Therefore the blanket
reset bridge is not demonstrated as the cause and is preserved.

## Bounded change

When an edit requests a new complete civil value and validation is already
shown as invalid, DateField queues `commitValidation`. The engine commits after
the next render using the accepted value. This lets a corrected displayed error
recover during typing, before a submit pointerdown can blur the segment and
remove an error row. Initial errors still follow normal blur/native validation;
partial civil requests, bounds checks and native submission remain intact.

A rejecting controlled host is still authoritative: the commit validates the
retained host value, not the requested date. Reset callbacks return before this
edit path, so accepted/prevented reset and silent restoration keep their owner.
No resetValidation change, native validity override, synthesized submit, additional
submit click, focus injection, event prevention or host button/layout change was
introduced.

The composed regression requires the corrected error to disappear while the year
segment still has focus, complete FormData and the unchanged callback ledger, then
one successful submit. The standalone regression keeps a rejected correction
invalid and blocks submission. Existing incomplete/reset/controlled unit coverage
and out-of-window native cases remain in scope for the coordinator's check.

The existing failing browser case keeps its real typing and strict first-submit
assertion. It additionally requires valid native state/error recovery **before**
the submit gesture, one trusted native submit, both pointer events on the submit
button, and stable button bounds during that gesture. Read-only native event/
validity/geometry observations are attached even when the case fails. This can
separate stale validity from a lost gesture if recovery still fails.

## Execution status and pending checks

No install, unit test, typecheck, foundation guard, build, browser run, slot/queue
mutation, CI operation, merge, push or publication was performed. All executable
checks are **UNRUN**. Read-only evidence/source review and `git diff --check` are
not behavioral verification. Coordinator validation must establish actual recovery
and attribution before acceptance; this report makes no current green claim.

Pending coordinator checks on the exact final head:

- `pnpm exec vitest run src/experimental/DateField/DateField.test.tsx src/experimental/DatePicker/DatePicker.native-transactions.test.tsx`
  plus affected existing DatePicker/reset composed tests.
- Typecheck and relevant owned-foundation source guards.
- Fresh static Storybook build and focused
  `tests/browser/datepicker-native-transactions.spec.ts` in Chromium, Firefox and
  WebKit. Inspect `first-corrected-submit-native-events` attachments. Retain failures;
  do not add retries or relax the strict first gesture/invalid/controlled checks.

The existing partial-required story already covers the changed interaction, so no
story file outside the allowlist was edited. Physical devices, IME and spoken AT
remain unverified.

## Implementation and fixture byte receipt

| Owned file | SHA-256 |
| --- | --- |
| `src/experimental/DateField/DateField.tsx` | `ff8553a500f370b7528795b2eb2c1a6d81f47df3fd42829a29a419d9d269a38b` |
| `src/experimental/DateField/DateField.test.tsx` | `085a51de13288c1cbdf529691820a8c55bb2a1cb34ce9b9632d42054af191583` |
| `src/experimental/DatePicker/DatePicker.native-transactions.test.tsx` | `0357a5f59b85002407c542b994a9dae6ee16a1dedfe9ad7af83eb34b059857ba` |
| `tests/browser/datepicker-native-transactions.spec.ts` | `df409381f98d998a3cf092d88d9fca98769dc746da9e3bf1ec1eab9f5aa4269d` |
