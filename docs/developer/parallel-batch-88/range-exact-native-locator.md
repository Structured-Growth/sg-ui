# Exact range request output locator — batch 88

Parent criteria: K-03, K-06, K-07. Bounded successor to
[batch 81](../parallel-batch-81/range-picker-controlled-transactions.md).
Preparation baseline: `40a2c6c48fb7b3753e70a4874dc72badd167dd4c`, isolated managed
worktree `/Users/thomashall/.codex/worktrees/batch88-range-locator/sg-ui`.

## Confirmed fixture failure

The retained fresh Chromium run failed all three controlled-transaction cases at
the shared `getByLabel('Range requests')` assertion. Substring label matching
resolved both the `Accept range requests` checkbox and the native
`<output aria-label="Range requests">`. The reported output already contained
the expected full JSON: the March request in the first case and `[]` in the
other two. This is one shared fixture locator issue; these failures do not
demonstrate three product defects or establish the remaining assertions passed.

Original red results and traces remain unchanged at:

- `/Users/thomashall/.codex/worktrees/batch80-83-native-candidate/sg-ui/artifacts/browser-pool/df2bc745-5e76-4922-80ae-03c3ccaa0f51/batch81/results.json`
- `/Users/thomashall/.codex/worktrees/batch80-83-native-candidate/sg-ui/artifacts/browser-pool/df2bc745-5e76-4922-80ae-03c3ccaa0f51/batch81/traces/`

## Bounded correction and audit

The request helper now uses `getByLabel('Range requests', { exact: true })`.
Exact label lookup targets the intended native output, including while the open
calendar dialog hides the host form from the accessibility tree. All full exact
JSON assertions, controlled endpoints, submitted values, draft/focus checks,
prevented reset ledger and actual `form.reset()` semantics remain unchanged.
No production source or story changes are included.

The remaining label selectors (`Accept range requests`, `Submitted range`,
`Prevent range reset`, `Reset prevention ledger`) have distinct fixture labels
without substring collisions. Named action buttons already use exact matching.
Calendar date regexes retain their outside-month exclusion for duplicate dates;
dialog/application queries and part/form selectors retain their original scope.
No positional selection or weaker text assertion was introduced.

## Validation handoff

Preparation is limited to source/fixture inspection, retained-results inspection
and Git diff/whitespace review. No test, install, native browser or build commands
were run for batch 88 before coordinator authorization. A fresh changed-byte
Chromium run and individual history integration are coordinator-owned; no browser
pass is claimed by this preparation record.

The coordinator should run all three cases from the frozen corrected spec against
the authorized fresh pooled Storybook snapshot, without rebuilding during a suite.
Firefox/WebKit, physical devices, assistive technology and broad K/G/U/X/R/Z
acceptance remain pending. This correction does not close K-03, K-06 or K-07.
