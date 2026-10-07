# Batch 13: TextArea reset and native field contract

Partial U-05/U-18 acceptance. Baseline verified before edits:
`b139a0d06fb06ba4a5a5aa6adc69c5cb3b206818`.
Managed worktree created and attached first:
`/Users/thomashall/.codex/worktrees/batch13-control-textarea/sg-ui`.
Branch: `codex/batch13-control-textarea`. Draft PR base: `codex/dev`.
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
- `pnpm foundations:check`: passed on implementation source.
- `pnpm typecheck`: initial source passed; exact committed-source repeat pending.
- Browser TypeScript and fresh focused native browser evidence: pending behind
  the shared priority queue and lock; not passed or substituted with jsdom.
- `git diff --check`: passed. All changed tracked paths match the allowlist.

No full `pnpm check`, broad browser/consumer suites, CI wait/rerun/dispatch,
main/merge/publish, workflow permission or secret changes. User-authorized targeted
validation supersedes blanket full-suite requirements for this dev task.

## Limits and next scopes

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
