# Concrete remaining handoff

## FORM-IDREF-01 — prepared correction (A-U-05 / A-U-17 / A-A-06)

Checkbox currently includes `${labelId}-error` in aria-describedby whenever errorMessage is nonempty, but mounts that node only while invalid. The valid initial state and accepted reset therefore reference an absent node. Existing tests resolve descriptions with optional chaining, so they pass while missing this association fault.

The proposed Checkbox keeps that owned node mounted, hidden and empty while valid; only invalid state supplies the error text. This preserves the label, native input/ref, errors-above/below, scope inheritance, callback/form/reset ownership, styles and public declarations. Empty hidden nodes occupy no layout and do not add error content to the accessible description. Two new unit cases require every IDREF to resolve through initial/invalid/reset and repeated-instance/host-message transitions. One native case uses the existing FieldsetAcceptance fixture; no new fixture export or playground is needed for this association-only change.

No behavioral test or browser was run in this handoff. Static branch analysis establishes the absent-node condition; coordinator must reproduce the new unit failure against original source and verify the candidate. Do not call prepared tests passing.

## FORM-GROUP-OWNER-01 — retained explicit U-04 decision

Wave-02-08 and wave-03-18 require API/documentation owner acceptance of internal Input base plus native fieldset/legend. The maintained guidance and grouped source-backed example are integrated; the grouped native case now passes all three desktop engines. Accept that exact shipped composition or name the missing public primitive contract. This is a narrow owner decision, not a reason to rebuild or rerun existing accepted grouped/reset tests. No explicit owner decision was located in the inspected records.

## FORM-AUTOFILL-01 — actual browser profile (A-U-18)

Use the existing `migration-proofs-primitive-acceptance--profile-autofill` fixture and wave-03-18/operator-protocol.md. Do not implement another fixture. The template in this handoff requires uncontrolled, accepting and rejecting policies. Select offered synthetic contact data through the browser UI; record displayed values/callback sequence, explicit-button/Enter submission, accepted/canceled reset, disabled/read-only values and actual form-A/form-B reassociation. Record source/output/host provenance and unsupported behavior separately. `validate-operator-receipt.py` checks record completeness only; it cannot verify truthful observations or infer a pass. The supplied pending template intentionally fails validation.

## STATE-MATRIX-01 — remaining A-A-06 and A-U-17 scope

The scoped `forms-contract-matrix.json` resolves forms policy and tracks existing evidence; it is not an all-library state audit. Remaining named boundaries: SearchField controlled query/default/reset and results ownership; ToggleButtonGroup empty selection/multiple/required defaults; DateField/TimeField incomplete draft versus committed null and latest default reset; DatePicker/range/PeriodPicker/DateTimeRangePicker/DateRangeComparisonPicker open-panel host replacement/disabled/readOnly commit boundaries; Tabs controlled rejection; grid independent criteria/selection normalization/reset; editorKey replacement and readOnly lifetime. Reuse each family's accepted receipts first. Require stable repeated-instance IDs after host rerender/hydration and React 18/19 packed-consumer evidence only for unproven boundaries. Do not repeat accepted HB-19/20 editor presentation work or treat it as a new editor-lifetime proof.

For U-17, retain accepted target/focus/forced-color and field-focus receipts. Remaining cross-primitive status transitions and actual speech require the existing AT owner; DOM roles/IDREFs/aria-busy and axe are only structural evidence. Record the named OS/browser/reader and observed words separately. Physical device comfort and actual browser zoom remain their own acceptance owners, not new implementation scope here.

## SELECTOR-01 — recommendation for U-06

The original implementation/definition obligation is satisfied by the three shipped owned controls, maintained consumer contracts, accepted primary native ledger, wave-03 selector identity/filter/reset/host-authority results, current message-scope source hashes and HB-13 presentation evidence. Recommend coordinator close U-06 after reviewing this evidence join. Do not rerun Select/ComboBox or async race/busy simply to relabel old acceptance; actual option/busy speech belongs to spoken-AT acceptance, and physical mobile entry to device acceptance. Recover original raw primary receipts when needed for provenance; an unavailable archived file is not a fresh product failure.
