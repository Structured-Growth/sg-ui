# Batch 13: Switch reset authority (U-04/U-18 partial)

## Identity and exclusive scope

- Verified baseline: `b139a0d06fb06ba4a5a5aa6adc69c5cb3b206818`.
- Managed worktree created and attached before edits:
  `/Users/thomashall/.codex/worktrees/batch13-control-switch/sg-ui`.
- Branch: `codex/batch13-control-switch`; draft PR base: `codex/dev`.
- Implementation/test/story commit: `f561607b78b81e983ed2c5e713ddff3479e4aa2d`.
- Initial evidence commit: `dc013e549bb69eef0cee38edcc4ba12bd0dfbf86`.
- Physical native-driver correction: `ea68126868498a410af90202a9328c177b7d9ff2`.
- Fieldset correction/unit composition and final native-tested source:
  `fdcb9b7faa90520bd925be0ffa1be109e8a60861`.
  Final report-only commit is recorded in PR history and the completion message.
- Exclusive allowlist: `src/experimental/Switch/`,
  `tests/browser/batch13-control-switch.spec.ts`, this report.
- Draft PR: [#84](https://github.com/Structured-Growth/sg-ui/pull/84).
- Explicitly authorized common prerequisite: normal full-ancestry merge of
  reviewed `6b9da4423f1e6675c37571d5552474da25e90258`, producing
  `4c9e7190e51a98194d6f2f6248984449a5255d1a` with no conflicts. Its six shared
  harness/config/docs files are prerequisite ancestry, not exclusive task edits.
  No harness copies, history rewriting or independent pool migration.
- Native evidence: final fresh focused pool passed both engines after preserving
  the first actionability failure and meaningful red fieldset regression below.

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
The original fieldset unit simulation passed at baseline, but the corrected
native driver exposed a real label-activation leak: a physical label click in a
disabled fieldset reported one host change request. Switch now checks the actual
input's `:disabled` state before accepting interaction callbacks. This honors
inherited disabling, live re-enabling and the first-legend exception. An additional
unit composition checks that the legend exception and re-enabled labels still
activate; its jsdom result is not claimed as native pointer evidence.

## Local validation

Runtime: initial Node `v26.5.0`; canonical targeted checks also passed on existing
Node `v24.21.0`, pnpm `10.29.3`, React `19.2.3`, Vitest `4.1.11`.
Native pool: Darwin `27.0.0`, Playwright `1.63.0`. Its exact Node executable is
recorded in the retained `evidence.json`; no new runtime was installed.
No Node 22, packed React 18, device or assistive-technology acceptance is claimed.

- `pnpm install --frozen-lockfile`: passed, own atomic install slot1;
  `/tmp/sgui-batch13-switch-install.log`. Initial slot attempts queued (exit75).
- `pnpm exec vitest run src/experimental/Switch/Switch.test.tsx --maxWorkers=1`:
  final 1 file / 6 tests passed after both product corrections. Used an available
  atomic global light slot with
  owner `batch13-control-switch-01a116b0` and owner-checked cleanup. Occupied
  attempts were queued, never reported as successful runs.
- `pnpm typecheck`: passed after final implementation.
- `pnpm exec tsc --noEmit -p tests/browser/tsconfig.json`: passed.
- `pnpm foundations:check`: passed; no style/token changes.
- `git diff --check`: passed.
- Coordinator's first fresh Storybook build/browser TypeScript: passed on Node24,
  frozen exact head `4c9e7190e51a98194d6f2f6248984449a5255d1a`.
  Focused Chromium/WebKit: 0 passed / 2 timed out at the attempted disabled-label
  `locator.click`, before any reset assertions. Playwright's enabled-action check
  refused that disabled descendant. This establishes no native reset pass.
  After coordinator unfroze the worktree, the spec changed only the input driver:
  real `page.mouse.click` at the visible label's bounding-box center. Disabled,
  zero-request and omitted-FormData assertions remain. No forced or synthetic
  click, test skip or assertion weakening.
  Evidence: `artifacts/browser-pool/408ab40a-5e45-497c-a0f8-72cb7ab05639/`
  (`evidence.json`, `build.log`, `types.log`, `browser.log`, results and traces).
  First/final static digest matched
  `8931f13887f973997135e1100d8ebd670e2fbe33ec45dea539906e29661a2e36`;
  final source head/status remained clean. No own standalone build/server/browser
  session, shared lock removal, queue modification or Firefox launch retry.
- Corrected-driver second pool: fresh build/types passed; Chromium/WebKit
  0 passed / 2 failed, each at the retained zero-host-request assertion
  (received `1`). Exact `ea68126868498a410af90202a9328c177b7d9ff2` remained clean;
  digest remained
  `664241ea41154434a1423e71798f680b578d61970ff0199043ac961228389813`.
  Evidence: `artifacts/browser-pool/82d4e086-f5e8-4a27-9006-11dd2d666fb1/`.
  This is a product regression, not a successful native pass. After coordinator
  release, the owned native `:disabled` callback guard and unit exception case
  were added; affected unit/type/foundation checks passed.
- Final third pool: fresh Storybook/types passed; **2 passed**, 0 failed/skipped/
  flaky (one focused case each in Chromium/WebKit). Exact frozen source head
  `fdcb9b7faa90520bd925be0ffa1be109e8a60861`, tree
  `b369de300ef8e87a55d45df3d8d1822ac7d3cd0c`; final head/status stayed clean.
  First/final digest matched
  `479bfcd6df3a7c1ebfafc6f1c810a87219b29a6844accb275ac40b301c57a431`.
  Evidence: `artifacts/browser-pool/badca55a-4638-4860-b514-d2dbc19f60e7/`
  (`evidence.json`, `results.json`, build/type/browser logs and HTML report).
  All physical disabled-label, disabled omission, independent name, controlled
  rejection, prevented reset, re-enable and accepted-reset assertions were reached.
  The coordinator independently verified source/digest/count invariants and released
  the frozen worktree after the supervisor finished. Only this report changed after
  that tested head; no additional native/build rerun was required.

Exact final native commands (executed by the coordinator's reviewed pool):

```sh
pnpm exec storybook build --output-dir /Users/thomashall/.codex/worktrees/batch13-control-switch/sg-ui/artifacts/browser-pool/badca55a-4638-4860-b514-d2dbc19f60e7/storybook
pnpm exec tsc --noEmit -p tests/browser/tsconfig.json
pnpm exec playwright test tests/browser/batch13-control-switch.spec.ts --project=chromium --project=webkit
```

The final session used slot 1 / loopback port 6274 and immutable UUID build/report
paths. No rebuild during a suite, shared queue edits or other-owner cleanup.
An exploratory jsdom `fireEvent.click` driver could not activate even its enabled
legend target; it was replaced with `userEvent` for the exception unit composition.
That driver failure is not treated as product or native evidence.

Per [development validation policy](../react-aria-development-validation.md),
no full `pnpm check`, full browser suite or consumer matrix runs per task.
Dev GitHub CI/title automation remains paused; no dispatch/rerun/wait or changes
to workflow permissions, secrets, main, publishing, versions or licensing.

## Review boundaries and follow-ups

Review decision: this bounded compatible reset/fieldset correction is ready for
coordinator review and integration into `codex/dev`; it does not complete U-04/U-18.
Firefox was not retried or verified by this slice. Native fieldset legend pointer
behavior, physical touch/device and actual AT remain unverified.
Broad native/autofill, physical device and AT acceptance remain open.

Reserved next-task scopes requiring broader ownership:

- Coordinate the same prevented-reset/fieldset callback concerns with the existing
  Checkbox/RadioGroup assignments; their source is read-only here. Avoid duplicate
  successor tasks until those reports establish what remains unfinished.
- Reconcile shared form guidance after review: public Switch directly reexports
  the preserved native label ref, while the primitive mapping says native input.
  No shared contract edits or ref-contract change here.
- External form association, native pointer behavior in legend exceptions and
  host-driven controlled replacement during reset remain separate compositions.
  Legend-exception unit coverage is narrower than browser/device evidence.

Coordinator alone reviews/integrates exact completed heads; no auto-merge.
