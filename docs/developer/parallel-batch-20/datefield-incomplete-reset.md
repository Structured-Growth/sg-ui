# Batch 20 DateField incomplete reset — blocked prerequisite

U-18/K-06 remains **HOLD**. This handoff retains a failing reproduction, two
changed-state stories and unexecuted native acceptance cases. It contains no
DateField implementation fix and is **not integration-ready**. No whole calendar,
standalone reset, device or assistive-technology completion is claimed.

## Scope and exact evidence

Managed attached worktree:
`/Users/thomashall/.codex/worktrees/datefield-incomplete-reset/sg-ui`.
Created and verified at baseline `7124a123a93f40d0ffdc1f382f902642489154c2` before
edits; branch `codex/batch20-datefield-incomplete-reset`.
Reproduction source/spec head: `15771e87189f65496297c86292ba5de83737425b`.
The final documentation commit will be supplied separately in the coordinator
handoff to avoid a self-referential commit identifier.

Only these reserved paths changed:

- `src/experimental/DateField/DateField.test.tsx`
- `src/experimental/DateField/DateField.stories.tsx`
- `tests/browser/batch20-datefield-incomplete-reset.spec.ts`
- This report.

The retained unit regression enters day `28` into an otherwise empty DateField,
keeps the current segment focus, and calls the real form's `reset()` beneath a
React delegated ancestor `onReset` that prevents the event. The expected draft
`aria-valuenow="28"` becomes absent. Current focus survives that reproduction;
focus preservation alone is insufficient. Empty FormData and callback silence
are asserted before reset, with their after-reset assertions retained for the
future corrected implementation (execution currently fails at the draft check).
The nine existing complete-value/default/reset tests pass; their acceptance is
not duplicated or expanded into a whole U/K claim.

The native spec targets uncontrolled empty and controlled-null fields. Prevention
starts enabled outside the form and remains unchanged through programmatic and
native reset checks. It checks current focus, populated/missing segments, native
required validity, empty submission and callback silence, then explicitly accepts
reset to test draft clearing. Validation uses the input's native `valueMissing`
state; it does not claim displayed-error or screen-reader acceptance. The fixture
uses real native submit/reset buttons and does not manufacture/reset events or
intercept submit. These cases have **not run** and must not be counted as passes.

## Architectural prerequisite and requested reservation

Read the [batch 18 review](../parallel-batch-18/standalone-reset-review.md),
[batch 11 record](../parallel-batch-11/standalone-form-reset.md),
[calendar contract](../react-aria-calendar-contracts.md) and current implementation.
Installed dependency source was inspected read-only. RAC 1.21.1's DateField
constructs `useDateFieldState`, its own native input ref, and `useDateField`
inside the parent. The hook registers native value-reset and validation-reset
listeners. The owned capture transaction suppresses the public complete-value
callback, but cannot prevent the private incomplete display from being cleared.

`DateFieldStateContext` exposes public state/segment commands to descendants; it
does not let a descendant replace the state passed to the parent's reset hook.
Replaying numeric segments after engine clearing would introduce a second editing
transaction and require careful preservation of partial/invalid values, validation
and concurrent host changes. Capturing a stale setter closure and relying on its
private display snapshot would depend on undocumented implementation behavior.
Neither is supplied as a workaround. DOM reconstruction, upstream private state
mutation and event-propagation suppression were not attempted.

The proposed next implementation uses supported lower-level hooks and an owned
interaction-state facade. During the capture transaction, the facade suppresses
engine reset calls to public `setValue` and `resetValidation` before they alter
segment/validation state. After delegated prevention settles, an accepted reset
can explicitly reset engine state and restore the current owned default without
calling the host. A prevented reset leaves the original state and native nodes
intact. This is a proposed design requiring implementation/regressions, not tested
behavior or a guarantee that all remaining reset cases are solved.

Dependency worker reservation requested through the coordinator: **package.json
and pnpm-lock.yaml only**, adding direct versions aligned with installed RAC:
`react-aria` **3.52.1** and `react-stately` **3.50.0**. These are transitive-only
currently; RAC does not reexport the required hook functions. Importing through
its private dist paths or transitive node_modules would violate package boundaries.
The coordinator confirmed a separate dependency prerequisite on 2026-10-07 and
instructed this worker to freeze red evidence until an authorized prerequisite
commit/merge is supplied. No package, lockfile, shared helper or composite edits
were made here.

Expected supported internal imports for the next implementation:

- `useDateField` and `useDateSegment` from `react-aria/useDateField`.
- `useDateFieldState` (and internal state types if needed) from
  `react-stately/useDateFieldState`.
- `useLocale` from `react-aria/useLocale` (the RAC I18nProvider public locale bridge
  is also available, so this does not add a separate dependency).
- `useFocusRing` from `react-aria/useFocusRing` and `mergeProps` from
  `react-aria/mergeProps`, if needed to retain native segment focus flags/styles.
- Existing `@internationalized/date` parsing/conversion and `createCalendar`.

The same facade must be supplied to field and segment interaction hooks. Native
submission/required/custom validation remains connected to the real input via
`useDateField`'s `inputRef` and returned `inputProps`; do not detach form association
to avoid reset. Retain the forwarded outer `HTMLDivElement` ref and stable native
input/segment nodes, a separate segment-group ref for focus management, locale
segment order, labels/description/error IDs, keyboard commands, read-only/disabled
behavior, current-default restoration and host-controlled null/complete values.
Accepted reset must explicitly clear incomplete display even when the complete
owned value/default remains null. Guard browser globals/SSR and use the existing
owned classes/tokens; expose no upstream public prop/type additions.

## Validation actually run

All install/unit/type/guard commands acquired task-owned atomic slots via
`/tmp/sgui-batch20-datefield-slotted.py` and `/tmp/sgui-run24.mjs`:
two install slots at `/tmp/sgui-install-slots`, four lightweight slots at
`/tmp/sgui-light-validation-slots`. The wrapper cleans only its matching owner.

- `pnpm install --frozen-lockfile`: passed; no lockfile changes.
- `pnpm exec vitest run src/experimental/DateField/DateField.test.tsx`:
  **1 failure / 9 passes**. Exact failure: expected day `aria-valuenow` to be `28`,
  received null. Log `/tmp/sgui-batch20-datefield-regression.log`.
- `pnpm typecheck`: passed. Log `/tmp/sgui-batch20-datefield-types.log`.
- `pnpm exec tsc --noEmit -p tests/browser/tsconfig.json`: passed, including the
  final native-required-validity spec correction. Log
  `/tmp/sgui-batch20-datefield-browser-types.log`.
- `pnpm foundations:check` and `pnpm tokens:check`: passed. Logs
  `/tmp/sgui-batch20-datefield-foundations.log` and
  `/tmp/sgui-batch20-datefield-tokens.log`.
- `git diff --check`: passed before reproduction commits and report completion.

The unit/source type/guard runs preceded the reproduction commit; their tested
files are unchanged in the source head above. The browser typecheck was repeated
only after its spec changed. No unchanged regression retry, source fix, full
suite, build, Storybook server, browser/native launch, CI/title dispatch or PR was
created. Coordinator owns future heavy/native validation and integration after
a safe fix. Chromium/WebKit/Firefox, physical devices and assistive technology
remain unverified for this case. Follow
[development validation](../react-aria-development-validation.md).
