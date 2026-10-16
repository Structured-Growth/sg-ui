# Fix 07 — P04-S2 read-only adoption guidance

**P04-S2 complete (documentation successor only); A-A-06 remains partial.**
Reviewed AGENTS.md, react-aria-final-acceptance.md and parallel-04/report.md on
2026-10-16 in the shared modified dev checkout at
540f47d4059a9cea8890b80927f34f51ef2fbc3e. No shared ledger/count was edited.

## Actual change

Updated [the adoption checklist](../../react-aria-adoption-checklist.md#read-only-focus-and-form-values)
to replace its blanket “Read-only permits focus/copy” guidance with the shipped
component policy. Native TextField/TextArea and date/range/time text inputs remain
inspectable/selectable when read-only. Select and calendar/time/selection button
triggers disable for readOnly; button-only modes have no native text-copy field.
Segmented modes explicitly receive no general native text-selection/copy promise.

The new table names Select, DatePicker, DateRangePicker, text TimeField,
PeriodPicker, DateTimeRangePicker and DateRangeComparisonPicker. It distinguishes
Select's submitted ID from its label, committed ISO values from display/drafts,
range endpoint field suffixes, comparison JSON, and empty-string serialization
for nullable hidden values. ReadOnly keeps named values eligible for submission;
disabled excludes affected form controls. Native form ownership/fieldset rules
and host validation still apply. The text does not redefine either prop, promise
controlled-mode switching, or change implementation. Open-panel commit/Clear
transitions remain a separate fix/validation responsibility (P04-S1).

## Validation and reused evidence

- `python3 docs/developer/final-acceptance/fix-07/validate.py` passed. See
  [validation.json](validation.json) for source-policy, documentation and local-link
  checks. This is a bounded static check, not a behavior test.
- `git diff --check -- docs/developer/react-aria-adoption-checklist.md docs/developer/final-acceptance/fix-07`
  passed; untracked report files also checked for trailing whitespace and JSON parsed.
- Reused parallel-04's corrected Select characterization and
  [transcript](../parallel-04/select-correction.log): one passed, ten filtered/skipped,
  confirming the disabled read-only trigger and retained FormData ID for its dated
  source inputs. Its Node 26/jsdom result is historical evidence, not a new supported
  Node 22/24 or browser result. Did not rerun its defect characterizations.
- Inspected current source for the documented trigger/form serialization behavior;
  input hashes in results.json bind those reads to this report. Current source may
  contain coordinator changes; this report does not validate their commit guards.
- No implementation edits, dependencies, builds, browsers, consumers, servers,
  staging, commits, pushes, worktrees, version changes or publication actions.

## Remaining requirements

A-A-06 is not closed: P04-S1 picker Clear/commit transition regression and focused
native evidence belong to the coordinator. P04-S3's remaining public-control
matrix, grid/editor state/default transitions, mode stability, reset/null/default
and ID/hydration evidence still require their own reconciliation. Target browser,
actual device/IME and assistive-technology checks remain explicit host/acceptance
gates where required. No full accessibility conformance, production/release,
remote CI or legal approval is claimed. This documentation change does not close
any of the 20 editor V leaves or legal/license requirements.

Only the adoption checklist and this fix-07 directory were written. results.json
records hashes of the changed document and report artifacts; its own hash is
excluded to avoid a self-reference. Coordinator alone integrates leaf counts.
