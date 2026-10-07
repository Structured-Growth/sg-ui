# Batch 13: TextArea reset and native field contract

Partial U-05/U-18 acceptance. Baseline verified before edits:
`b139a0d06fb06ba4a5a5aa6adc69c5cb3b206818`.
Managed worktree created and attached first:
`/Users/thomashall/.codex/worktrees/batch13-control-textarea/sg-ui`.
Branch: `codex/batch13-control-textarea`. Draft PR: [#74](https://github.com/Structured-Growth/sg-ui/pull/74), base `codex/dev`.
Implementation/spec commit: `a16a0588746586b1f1b5489910ebacb6fd9061d9`.
Final report commit is supplied in the coordinator completion message.

Exclusive write allowlist:

- `src/experimental/TextArea/`
- `tests/browser/batch13-control-textarea.spec.ts`
- This report.

No TextField, shared helpers, barrels, guides, checklists, configuration or workflow
edits. Commercial licensing/notices and dependencies are unchanged.

## Finding and change

Existing TextArea tests already covered multiline editing, a basic native reset,
controlled edits, description/error association, required validation, read-only
editing and disabled omission. Prior [forms evidence](../parallel-batch-01/forms.md)
and [native-reset evidence](../parallel-batch-05/native-reset.md) left textarea
and standalone field reset timing open; no completed native textarea evidence
was duplicated.

Regression-first validation added two reset cases to the existing three tests:
2 failed / 3 passed before implementation. Accepted reset invoked `onValueChange`
with the latest default; delegated host prevention still discarded the draft.
Latest-default restoration itself already worked and was retained.

TextArea now owns its uncontrolled draft while retaining React Aria field
interaction/validation. A form capture listener suppresses upstream reset value
callbacks and waits for the host's delegated prevention decision in a task.
Accepted reset silently restores the latest default; prevented reset retains the
draft; controlled values remain host-owned. Timers/listeners clean up on unmount
or form prop reassociation. Association uses the native textarea's `form`, covering
both ancestor and explicitly external forms. The native ref bridge preserves the
textarea target. No new public props or breaking API changes.

The story demonstrates externally associated forms, latest defaults, prevention,
controlled authority, native ref focus and validation descriptions. Added tests
also exercise native attributes and combined host/field/error descriptions.
Host labels and validation text remain host supplied.

## Validation

Frozen install passed under an owned atomic install slot, using system Node
`26.5.0`, pnpm `10.29.3`. A subsequent runtime selection used Node `24.21.0`,
pnpm `10.29.3`; resolved Vitest reports `4.1.11`, React is `19.2.3`.

- `pnpm exec vitest run src/experimental/TextArea/TextArea.test.tsx --maxWorkers=1`:
  1 file / 7 tests passed on implementation source. All Vitest runs used one of
  four atomic shared light slots with owner-checked cleanup in `finally`.
  An intermediate 6-pass/1-fail run found a test-fixture JSX literal `\n`;
  changing the controlled fixture to a JavaScript string corrected that test.
- `pnpm foundations:check`: passed on implementation source.
- `pnpm typecheck`: passed, including repeat on implementation commit (report-only changes do not affect source).
- `pnpm exec tsc --noEmit -p tests/browser/tsconfig.json`: passed.
- Fresh focused native browser evidence: queued for the coordinator browser pool;
  not passed or substituted with jsdom. The coordinator requested stopping this
  task’s idle standalone waiter when its pool priority entry was added. Only our
  idle Python waiter was terminated (exit 143); it had acquired no lock, started
  no build/server/suite, and generated no native validation evidence. The current
  owner and queue were untouched. No independent harness/config migration occurred.
  Ready focused args: `tests/browser/batch13-control-textarea.spec.ts` (2 cases per
  engine). The pool should use this exact source/spec head, a fresh build and its
  reviewed frozen dev ancestry bootstrap when explicitly authorized.
- `git diff --check`: passed. All changed tracked paths match the allowlist.

No full `pnpm check`, broad browser/consumer suites, CI wait/rerun/dispatch,
main/merge/publish, workflow permission or secret changes. User-authorized targeted
validation supersedes blanket full-suite requirements for this dev task.

## Review status, limits and next scopes

Status: incomplete pending mandatory fresh focused native evidence. The draft
PR remains reviewable; unit/type/guard passes are not native acceptance.

Ready source/spec commit remains `a16a0588746586b1f1b5489910ebacb6fd9061d9`;
subsequent commits affect only this report. Exact clean ready/report head is
supplied to the coordinator after committing the report.

Broad U-05/U-18/U/X/R/Z acceptance remains open. This slice does not establish
physical-device, assistive-technology, autofill/password-manager or IME behavior.
No manual/device/AT gate is closed. React 18 packed-consumer behavior is unverified
by this task. DOM accessible descriptions do not establish spoken announcements.

Reserved next task: independently audit standalone TextField reset timing and
callback semantics with its own exclusive ownership and native browser evidence.
Another bounded follow-up can cover live form-owner replacement and reset-time
native validation state; neither is claimed by these cases. Shared central
contracts may document silent accepted textarea resets/latest defaults and
prevented draft preservation only after native evidence is recorded.

## Separately authorized browser-pool prerequisite

On coordinator instruction, normal full-ancestry merge
`9c672298cc504b92c0d1435d3a12311a543b2cb9` merged reviewed prerequisite
`6b9da4423f1e6675c37571d5552474da25e90258` into the same reserved worktree.
Parents are the prior task head `2c2e927c696ab4f9fbc0a6c87ed947345e7350d2`
and that exact reviewed prerequisite. The merge completed without conflicts;
TextArea implementation, stories, unit tests and focused browser spec are
unchanged. No behavior-changing conflict resolution or additional checks were
needed. No build, browser run or server was started.

The prerequisite adds/updates six shared harness/guidance files through its
reviewed ancestry: `playwright.config.ts`, `scripts/browser-validation-pool.mjs`,
`scripts/browser-validation-pool.test.mjs`, `scripts/serve-browser-storybook.mjs`,
`docs/developer/parallel-batch-12/browser-pool.md` and
`docs/developer/react-aria-parallel-browser-validation.md`. These are separate
explicitly authorized shared prerequisite changes, not exclusive task edits.
No harness/config copying, history graft, ours merge, reversion or new worktree.

Frozen clean HEAD after this report-only commit is supplied in the coordinator
message. Ready focused args are
`tests/browser/batch13-control-textarea.spec.ts --project=chromium --project=webkit`.
The worktree stays frozen until coordinator pool release. Mandatory native evidence
remains queued; Firefox and manual/device/assistive-technology gates are unverified.

## First pool failures and bounded correction

The coordinator ran the frozen `a23f3b3a8052af282929c2b044bb6ad599c39612`
with Node `24.21.0`, pnpm `10.29.3`, Playwright `1.63.0`, slot 1 / port 6274.
Evidence directory (inside this same worktree):
`artifacts/browser-pool/5e8665a7-ca8d-4957-a73f-5dbf92d359fe`.
Commands were a fresh `pnpm exec storybook build --output-dir <evidence>/storybook`,
`pnpm exec tsc --noEmit -p tests/browser/tsconfig.json`, then
`pnpm exec playwright test tests/browser/batch13-control-textarea.spec.ts --project=chromium --project=webkit`.
Build/types passed; all 4 native cases failed. Initial and final build digest were
both `d4a691a83b1c9e2cb04f27a9e3a37eaaf42cd4ec9e605e38187306166d9a299f`;
HEAD/status stayed unchanged/clean. This is failed evidence, not native acceptance.

Diagnosis changed the initial attribution: the native trace shows the prevention
Checkbox checked after call@21, then unchecked immediately after reset call@23.
The story placed that host reset-policy control inside the reset form. Its upstream
`useToggle` form reset calls `state.setSelected(defaultSelected)`, potentially
changing the host's policy before delegated prevention. Therefore this fixture
failure does not establish that TextArea ignores an actually prevented event.
The scoped correction moves only that story policy outside the reset form, as
prior native-reset stories do; no additional TextArea implementation change.
Checkbox implementation remains read-only, with a separate native reset callback/
prevention task reserved. No behavior assertion is bypassed: the native spec still
requires the edited draft and callback count to remain unchanged, and now also
checks the policy's native form association is null and its checked state survives.

A meaningful new composed story regression first failed on the policy's native
form association: 1 failed / 7 passed. After the story correction, the slot-bound
`pnpm exec vitest run src/experimental/TextArea/TextArea.test.tsx --maxWorkers=1`
passed 1 file / 8 tests. `pnpm typecheck` and
`pnpm exec tsc --noEmit -p tests/browser/tsconfig.json` passed using the same
Node 24 runtime and owned light-slot cleanup. `git diff --check` passed.

The other two native failures were unsupported description-order expectations:
both engines produced `Multiline guidance Add a summary Host guidance` while the
spec expected host guidance first. The corrected spec checks every complete
accessible description, the exact three associated ID/text references, preserved
host/field references after validation clears, removed error description, and the
unchanged exact accessible name. It requires no particular concatenation order;
no content, association or naming assertion was removed.

The correction is confined to the allowed story, colocated test, browser spec and
this report. Its exact clean committed HEAD is sent to the coordinator for a fresh
focused rerun with the same 2 cases per engine. No own build, browser or server was
started. Native acceptance remains incomplete pending that rerun; Firefox and
manual/device/assistive-technology gates remain unverified.
