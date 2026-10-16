# A-M-03 real screen-reader receipt — awaiting operator

Status: NOT EXECUTED. No speech, AT version or device result is inferred from DOM tests.

Reuse `components-appoperationsteps--native-state-transitions` on the coordinator's immutable docs-owned fixture host. Existing source: packages/ui/src/components/AppOperationSteps/AppOperationStepsNativeState.native-fixture.tsx; browser mapping: apps/docs/native-fixtures/scenarios/components/AppOperationSteps/AppOperationSteps.fixture.tsx. Record their hashes and the immutable served asset hashes from evidence.json / host receipt before running. Do not add a component live region: the host Status owns completion/error announcements; pending/active remain available as list text and Progress semantics.

Record OS/version, browser/version, AT/version, locale, operator, date, host URL and immutable build digest. Record verbatim observed speech including duplicates and unexpected interruptions, rather than expected text alone.

1. Enter by keyboard and inspect the three pending list items. Confirm the steps themselves have no focus targets. Record list/status speech and focused host button.
2. Activate Start operation with Enter. Record active first step and pending siblings; no completion/error announcement is expected yet. Confirm focus stays on Start operation.
3. Activate Advance progress twice (Space then Enter). Record 25/50 semantics when queried and any unsolicited speech. Percentage ticks must not produce host milestone speech.
4. Activate Complete operation. Record “Course operation completed” once, completed item text and retained button focus.
5. Activate Fail operation. Record “Course operation failed; review the materials and retry” once and error item text. Confirm keyboard focus remains on Fail operation.
6. Activate Reset operation, then Start operation and Complete operation. Record cleared host status, pending/active states and a fresh completion announcement once after retry. Record any stale/duplicate speech.
7. Activate Show single and inspect one noninteractive item; confirm no “Step 1 of 1” numbering. This presentation clause already has native evidence, so record only an observed AT discrepancy if any.

Actual observations: pending operator session.
Disposition: pending operator evidence; automated roles/text/aria-live persistence cannot close the spoken-announcement successor W02-01-C03-AT.
