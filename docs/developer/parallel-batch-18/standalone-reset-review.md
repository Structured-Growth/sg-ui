# PR42 corrected standalone reset independent review

Reviewed 2026-10-07. **ACCEPT bounded development integration** of the corrected
complete-value/reset/reassociation implementation; **HOLD standalone reset
acceptance (U-18/K-06)**. No concrete new source regression was found that blocks
partial integration. Prevented incomplete DateField segment loss remains a known
defect and must remain explicitly open. Coordinator alone decides/integrates.

## Exact scope and provenance

Review worktree: `/Users/thomashall/.codex/worktrees/pr42-standalone-reset-review/sg-ui`,
created and attached at exact final `9c735eb74dd07e276bc2fa05efa018ba467ed4a0`
before writing. This document is the only working-tree write. No implementation,
other worker directory, dependency, workflow or central guidance was changed.

Original baseline is `d0fcc6298004ad23d1a75480b216b39142e6df96`.
Reviewed baseline-to-final source, tests and stories for TextField, DateField,
`useStandaloneFormReset`, and `tests/browser/batch11-standalone-reset.spec.ts`.
Reviewed correction `c1182394de2322215bc4cfb08b00525fcefd9633` separately:
TextField native edit delivery, current-form binding, three unit regressions and
live-association story/native case. DateField implementation did not change in
that correction. The merged browser-pool prerequisite adds harness ancestry;
`c118239..e1c922c` has no delta in these fields/helper/spec. Final
`e1c922c..9c735eb` changes only the batch11 report. The full baseline delta is
15 files, including prerequisite harness/docs; it is not solely field ownership.

Prior independent report was recovered at
`/Users/thomashall/.codex/worktrees/runtime-review-b16/sg-ui/docs/developer/parallel-batch-16/runtime-review.md`.
It reviewed original `9e430312b0fc8f662dcf51800be1a8982b081cec`, held partial
DateField reset acceptance, and identified stable-ref form reassociation as a
separate source gap. This review supersedes that reassociation finding at the
corrected exact head, without releasing its DateField hold.

## Source assessment

- TextField owns its uncontrolled string initialized from `defaultValue`, supplies
  an engine-controlled string, and restores the current committed default only
  after an accepted reset. Controlled `value` remains host-authoritative. Native
  `Input.onChange` reads the current input value and delivers the host edit once;
  engine reset callbacks no longer enter the owned edit path, including stale
  callbacks from form A. Name/form remain native input properties. The wrapper
  retains the native input and forwards it through `useImperativeHandle`; the
  A-to-B test explicitly checks identical ref/input identity. Current-default,
  controlled rejection, read-only/disabled and FormData tests remain meaningful.
- The helper updates reset/preservation callbacks in a layout effect, then reads
  association after each field commit. Input association uses `input.form`, so
  external form IDs are supported; DateField uses its nearest form. Identical
  form identity retains pending work across unrelated field commits. Changed
  identity removes the old listener, clears its timers and binds the new form.
  Unmount cleanup disposes the current binding. The timer reads current committed
  reset/default/controlled state, rather than an abandoned render callback.
- Capture-phase transaction state precedes engine bubble reset callbacks. A task
  waits for delegated prevention; an accepted task restores defaults without edit
  delivery, while prevented text reset restores captured native validation.
  Multiple pending timers retain suppression until the last timer completes.
  Old-A pending cancellation is covered by a retained targeted unit regression.
  No new unmount or multiple-reset runtime test was independently run here.
- DateField owns only complete ISO/null values. Accepted uncontrolled reset
  restores the current default and recomputes invalid-default feedback; complete
  controlled values remain authoritative and reset callbacks are suppressed.
  Invalid strings parse to null with translated feedback and empty submission.
  Existing invalid-default correction/reset and complete visible-segment/FormData
  assertions support that bounded contract. Private incomplete display remains
  inside the engine and cannot be recovered from the owned complete value.

Installed dependency source in the tested worker directory was inspected read-only:
React Aria TextField's native onChange also reads the input value; its reset hook
binds using a stable ref dependency and invokes the setter from a form listener.
React Aria Components Input merges context/native handlers. This supports the
correction's stale-callback rationale and shows no removed composition-specific
branch in this text edit path. It does not certify actual IME behavior.

## Remaining hazards and integration limits

**Known blocker for full acceptance:** an empty DateField with day draft `28`
loses that draft after a host-prevented reset. Worker reproduction and the prior
independent report document this; this review did not independently execute it.
The retained passing incomplete-draft test asserts *accepted clearing*, not
prevented preservation. No passing claim for this case is justified. Reserve owned
segment/reset work with prevented/accepted resets, controlled null, focus and
validation evidence; avoid DOM reconstruction or upstream state mutation.

Source inspection of DatePicker, DateRangeSelector and AsyncMultiSelect found
controlled child use and separate composite state ownership. DatePicker restores
its own selected state and AsyncMultiSelect retains host-owned query; neither
requires an engine reset callback as a host edit. Their sources were unchanged.
Partial DateField drafts in these compositions inherit the open hold. Related
unit counts do not establish every composed/native transaction case.

Binding is checked after a field React commit, not through a DOM mutation observer.
Imperative form replacement/reparenting without such a commit, cross-document
realm handling, reset before layout binding, and same-task edits before reset
settlement are not certified. These are bounded coverage limitations, not newly
reproduced regressions. Normal form-prop A-to-B reassociation is covered. Callback
refs receive native elements, but this change does not prove all ref replacement
or physical IME/device interactions. No public API/name/ref type removal was found.

## Evidence actually inspected

Worker artifact root:
`/Users/thomashall/.codex/worktrees/batch11-standalone-form-reset-review/sg-ui/artifacts/browser-pool/efd7fe1f-9c81-4198-943c-ae903c651f2c/`.

Read `evidence.json`, `build.log`, `types.log`, `browser.log` and `results.json`.
Evidence records initial/final tested HEAD
`e1c922c94b87ec3232d328c97861eae0f2b904a2`, clean final status and Git tree
`7ad366caec15273a16992d808b79795d9693962b` (verified against Git).
Initial/final build digest matches
`4a48c6cef56daabe0bee43adbcce636dbeab7eb595ad6d3f02dab431ea17ca5f`.
Runtime is Node v24.21.0, pnpm 10.29.3, Playwright 1.63.0, slot 1/port 6274.
Build log ends with successful Storybook completion; browser typecheck log is
empty and the completed pool evidence records success. Browser log and JSON
agree: eight expected Chromium/WebKit passes, zero skipped/unexpected/flaky cases,
empty run errors. Four retained titles per engine exercise native/programmatic
text and complete-date prevention/silence, text validation and live reassociation.
They match the exact final spec; visible complete dates and FormData are asserted.
No incomplete-prevention, Firefox, IME/device or AT case is in this run.

The worker report and retained `/tmp/sgui-batch11-standalone-review-pr.md` state
33 related files/231 tests, source/browser types and foundation/token guards passed.
The slot wrapper `/tmp/sgui-batch11-review-slotted.py` was inspected. Complete
targeted unit/source-type/guard logs were not recovered from the searched retained
paths; those results remain worker-reported, not independently verified outputs.
The fresh coordinator browser-type/build/native outputs above are directly
inspected evidence. Local pool records are provenance evidence, not independent
re-execution or cryptographically signed CI attestation.

This documentation-only review launched no installs, builds, tests, browsers, CI,
Firefox probes or diagnostics. Link/path/source consistency and whitespace were
checked. No full check/consumer/runtime matrix was run; development CI remains
paused. Broad U/K/X/R/Z, Firefox, physical-device/IME and AT gates remain open.
The recommendation permits bounded dev integration with those explicit holds;
it does not approve release or whole-task completion.
