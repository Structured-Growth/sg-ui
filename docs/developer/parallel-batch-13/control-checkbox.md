# Batch 13: control-checkbox

Task slices: U-04/U-18 (and checkbox association U-05). Focused automated
acceptance evidence; no whole-task or manual/device/AT gate completion.

## Isolation, commits and review

Verified baseline: `b139a0d06fb06ba4a5a5aa6adc69c5cb3b206818`.
Managed worktree created/attached before edits:
`/Users/thomashall/.codex/worktrees/batch13-control-checkbox/sg-ui`.
Branch: `codex/batch13-control-checkbox`.
Draft PR: [#83](https://github.com/Structured-Growth/sg-ui/pull/83), base `codex/dev`.

Exclusive write allowlist:

- `src/experimental/Checkbox/`
- `tests/browser/batch13-control-checkbox.spec.ts`
- `docs/developer/parallel-batch-13/control-checkbox.md`

Initial coverage commit: `797a1fa5ecd27f259915d9f5479e3e6d562fe44a`.
Initial report commits: `dabc649`, `a45777562967f2aaea6ac581beba7b41b8e38575`.
Reset fix: `776f11025d72f4944c6f2754f43ae4b9bdea1c7d`.
Collection-authority correction and tested source head:
`968e0687dcac7502a162fea824dcf07a918ad212`.
Final report head is supplied in the coordinator message; it cannot contain its
own hash.

The coordinator explicitly authorized a common browser-pool prerequisite outside
this task's source allowlist: normal full-ancestry merge of reviewed
`6b9da4423f1e6675c37571d5552474da25e90258` into this same worktree.
Merge commit: `861ca6f448bdb90e803092f714bf2b03790b1c5f` (ort, no conflicts).
This imports the reviewed harness/configuration/guidance as ancestry, not task
implementation edits. No copied harness/config, graft, new worktree or special
merge strategy. `git merge-base --is-ancestor` confirms the reviewed prerequisite;
the Checkbox directory, assigned browser spec and report are identical to premerge
`778fc0c` before this report-only update. No resolution changed behavior, so no
redundant affected-light rerun was required. The merged head was frozen for coordinator pool selection, then explicitly
released for the bounded browser-spec correction described below.
 Task implementation contains no shared guide, barrel, configuration, dependency,
workflow or other module edits; the authorized common prerequisite merge is
tracked separately above. The existing `useFormReset` helper was read and reused, not changed.

## Contract, demonstrated defect and final behavior

[Batch 01 forms](../parallel-batch-01/forms.md) already records mixed serialization,
required blocking, checked/unchecked values, resets and controlled host rejection.
Existing checkbox tests covered Space, mixed host authority, disabled/read-only,
description/error association, reset and mixed serialization. These are prior
evidence, not new batch 13 achievements.

The initial batch 13 fieldset/ref tests passed without a runtime defect. The new
combination covers disabled fieldset inheritance, enabling the fieldset and
required mixed checked/unchecked validation, submission, controlled mixed rejection,
native reset and disabling the fieldset again. `FieldsetAcceptance` is its story.
The forwarded `ref` remains `HTMLLabelElement`; its native `control` is the nested
input owning focus/validation. JSDoc and a test document this existing boundary.

The coordinator subsequently supplied concrete native reset evidence from the
Textarea worker's pool run and explicitly unfroze this task for investigation.
New regressions independently reproduced a defect at `a457775`: after an edit,
prevented uncontrolled reset emits `onCheckedChange(false)`, and a controlled
accepting host records `change:false` **before** delegated `onReset`. The host
loses its edited value before it can cancel reset. This contradicts controlled
host authority in the [architecture](../react-aria-architecture.md) and the prior
forms contract that hosts restore their draft through `onReset`.

The final standalone Checkbox keeps local uncontrolled checked state and passes
an authoritative selected value to the interaction implementation. Existing owned
`useFormReset` captures reset before upstream toggle listeners and defers restoration
to a task, after delegated cancellation is known. Upstream reset-generated value
requests are suppressed. Prevented reset preserves edited values; accepted reset
silently restores latest uncontrolled defaults. Controlled values remain with the
host, whose `onReset` may explicitly restore its draft. Ordinary pointer/Space
edits still emit the checked callback once. Mixed/required/disabled/read-only,
names/values, translated host labels, owned styling and label ref remain intact.

Table `slot="selection"` checkboxes retain inherited collection state and request
ownership; standalone state must not override table selection. The first bridge
implementation did override that context. Existing grid consumer tests caught
three failures; the correction restores the previous collection mapping, and all
46 affected tests now pass. No grid module changed. Collection reset policy is not
newly claimed by this standalone form slice.

`ResetAuthority` places the controlled prevent-reset policy Checkbox **inside** the
same form. The new native case checks callback order, edited FormData, repeated
prevented reset and accepted reset with explicit host draft restoration. This
fixture does not move policy outside the form to hide reset behavior.

## Local validation and pending native evidence

Runtime: bundled Node `24.19.0`, pnpm `10.29.3`, React `19.2.3`.

- `pnpm install --frozen-lockfile`: passed, 608 packages, no lockfile edits.
  Atomic global install slot with recorded owner was released only by its owner.
- Initial `pnpm exec vitest run src/experimental/Checkbox/Checkbox.test.tsx --maxWorkers=1`:
  1 file / 7 tests passed, including new fieldset/ref cases and mixed rejection
  assertion. These results justified no initial runtime fix.
- Regression-first reset run at prior source: 1 file / 9 tests, 7 passed / 2 failed.
  Failures are unexpected reset `false` callback and `change:false, reset` order.
  An earlier exploratory version had 8 passed / 1 failed because its controlled
  value still matched its initial reset default; editing first reproduced both.
- After reset fix: 1 file / 9 passed, then 1 file / 11 passed with accepted
  controlled/latest uncontrolled default cases. No reset edit callbacks.
- Public primitive/AppDataGrid/Checkbox subset: 3 files / 20 tests passed.
- First additional grid-consumer subset: 2 files / 26 tests, 23 passed / 3 failed
  from local selection overriding table context. Corrected before readiness.
- Final affected command at source `968e068`:
  `pnpm exec vitest run src/experimental/Checkbox/Checkbox.test.tsx src/components/primitives/primitives.test.tsx src/components/AppDataGrid/AppDataGrid.test.tsx src/experimental/DataGrid/DataGrid.test.tsx src/components/AppDataGrid/ownedGridInteraction.test.tsx --maxWorkers=1`:
  **5 files / 46 tests passed**. Log: `/tmp/sgui-checkbox-affected.log`.
  Every Vitest run acquired one of four global light slots, recorded owner token,
  and released only its own slot in finally; occupied slots were queued, not passed.
- `pnpm typecheck`: passed after final source correction.
- `pnpm foundations:check`: passed after final source correction.
- `pnpm exec tsc --noEmit -p tests/browser/tsconfig.json`: passed after correction.
- `git diff --check`: passed.
- Coordinator eleventh pool at exact frozen `3f820c96ce6749c3b64942b4523d41736cf63903`:
  **2 passed / 2 failed**, Chromium/WebKit. Both reset-authority cases passed;
  both fieldset cases timed out at their first disabled-label `locator.click`,
  before fieldset-transition/validation assertions ran. This is incomplete native
  acceptance, not a 4-case pass. Results, browser log, both trace archives and
  snapshots were inspected. The trace confirms actionability waited for enabled
  state and no click was dispatched. Correction uses visible label bounding boxes
  and physical `page.mouse.click`, retaining zero host requests, unchanged checked
  value and the full original behavior assertions. Browser TypeScript and
  `git diff --check` pass after this spec/report-only correction; no runtime
  source changed, so no redundant unit rerun. No force click, synthetic input,
  product change, timeout increase or assertion relaxation.
  Pool output: `artifacts/browser-pool/0738f900-1719-4117-8102-75ef06aac921/`.
  Runtime: Node `24.21.0`, pnpm `10.29.3`, Playwright `1.63.0`, macOS `27.0.0`.
  Final head was unchanged and working tree clean. Immutable build SHA-256 before
  and after was `0cf3c4c7ca1410a9971cf8bffc10d925d6649815fb97850d1ec61aed53a1b012`.
- Mandatory complete fresh native evidence after driver correction: **queued**.
  Spec: `tests/browser/batch13-control-checkbox.spec.ts`, two cases; requested
  Chromium/WebKit args `--project=chromium --project=webkit` (four expected cases).
  Fresh pool build/suite above was coordinator-owned; no standalone build/server
  was launched by this task. The initial standalone acquisition
  attempts returned occupied/priority-queued without acquiring or launching.

Browser/build ownership honors `/tmp/sgui-parallel-batch-01-validation.lock` and
`/tmp/sgui-browser-validation-priority.json`. On pool approval, standalone attempts
stopped; coordinator pairing owns native dispatch and explicit ancestry bootstrap.
No active standalone waiter/build/server exists. No other owner is stopped/removed.
No unchanged Firefox retries, full `pnpm check`, full browser/consumer suite or
GitHub CI/title run. Native results cannot be inferred from jsdom tests.

## Reserved follow-ups and limits

The shared [primitive guide](../react-aria-primitives.md) says native input ref for
Checkbox, but implementation and the prior forms report use label ref. Reserve a
coordinator documentation-only correction to that row and document `label.control`
for native focus/validation. This shared guide is outside the write allowlist.

Inspect other standalone toggle reset behavior as separately owned follow-ups;
this change does not fix Switch or collection reset behavior. Broader validation
state cancellation, externally associated forms, autofill, physical-device and
assistive-technology acceptance remain open. This report claims checked state,
callback ordering and host policy only, pending native verification. No broad
U-04/U-18/U/X/R/Z gate is closed.
