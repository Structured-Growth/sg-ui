# Batch 13: Switch reset authority (U-04/U-18 partial)

## Identity and exclusive scope

- Verified baseline: `b139a0d06fb06ba4a5a5aa6adc69c5cb3b206818`.
- Managed worktree created and attached before edits:
  `/Users/thomashall/.codex/worktrees/batch13-control-switch/sg-ui`.
- Branch: `codex/batch13-control-switch`; draft PR base: `codex/dev`.
- Implementation/test/story commit: `f561607b78b81e983ed2c5e713ddff3479e4aa2d`.
- Exclusive allowlist: `src/experimental/Switch/`,
  `tests/browser/batch13-control-switch.spec.ts`, this report.
- Draft PR and native evidence: pending focused browser queue completion.

## Evidence selection and correction

[Batch 01 forms](../parallel-batch-01/forms.md) and
`tests/browser/batch01-forms.spec.ts` already cover ordinary native reset,
controlled editing rejection, explicitly disabled omission and read-only values.
Those cases do not establish reset prevention by a delegated host `onReset`,
or native fieldset disable/re-enable with independent Switch names.

The new prevented-reset regression failed before the fix: 3 passed / 1 failed.
After editing an uncontrolled default-checked Email switch to unchecked and
rejecting an SMS editing request in the controlled host, preventing reset still
restored Email and added `emailUpdates` back to FormData. The first state-only
fix also failed because the interaction engine made an early reset callback.

Switch now owns uncontrolled checked state and supplies controlled selection to
the internal interaction implementation. A form-scoped capture listener suppresses
early reset callbacks; a cancellable task waits for all native/delegated host
handlers before restoring uncontrolled defaults. Prevented reset preserves edits;
accepted reset restores defaults without requesting host edits. Controlled values
remain host-owned. Pending reset tasks and listeners clean up on effect replacement
or unmount. No upstream types, new props, strings, dependencies or styling changes.
The existing native label ref and label/description association remain intact.

`NativeResetAuthority` demonstrates prevented/accepted reset, controlled rejection,
native disabled fieldset transitions and distinct form names. Its focused browser
case checks actual Space/label activation, request counts and native FormData.
The fieldset unit case passed at baseline and required no product change.

## Local validation

Runtime: Node `v26.5.0`, pnpm `10.29.3`, React `19.2.3`, Vitest `4.1.11`.
No Node 22/24, packed React 18, device or assistive-technology acceptance is claimed.

- `pnpm install --frozen-lockfile`: passed, own atomic install slot1;
  `/tmp/sgui-batch13-switch-install.log`. Initial slot attempts queued (exit75).
- `pnpm exec vitest run src/experimental/Switch/Switch.test.tsx --maxWorkers=1`:
  final 1 file / 5 tests passed. Used an available atomic global light slot with
  owner `batch13-control-switch-01a116b0` and owner-checked cleanup. Occupied
  attempts were queued, never reported as successful runs.
- `pnpm typecheck`: passed after final implementation.
- `pnpm exec tsc --noEmit -p tests/browser/tsconfig.json`: passed.
- `pnpm foundations:check`: passed; no style/token changes.
- `git diff --check`: passed.
- Fresh Storybook and focused native browser run: pending; existing shared lock
  and priority queue honored. No browser-pool migration or Firefox launch retry.

Per [development validation policy](../react-aria-development-validation.md),
no full `pnpm check`, full browser suite or consumer matrix runs per task.
Dev GitHub CI/title automation remains paused; no dispatch/rerun/wait or changes
to workflow permissions, secrets, main, publishing, versions or licensing.

## Review boundaries and follow-ups

This is a compatible correction to native reset cancellation, not a completed
U-04/U-18 gate. Browser evidence must finish before integration approval.
Broad native/autofill, physical device and AT acceptance remain open.

Reserved next-task scopes requiring broader ownership:

- Audit the same prevented-reset ordering in Checkbox/RadioGroup/public primitive
  wrappers separately; their source is read-only for this assignment.
- Reconcile shared form guidance after review, including experimental native label
  refs versus public primitive native input refs. No shared contracts edited here.
- External form association, disabled-fieldset legend exceptions and host-driven
  controlled replacement during reset are separate compositions, not evidence
  established by this bounded case.

Coordinator alone reviews/integrates exact completed heads; no auto-merge.
