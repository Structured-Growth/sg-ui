# Batch 148: strict native style selection endpoint correction

Parent tasks: M-30/U-07, partial. This successor retains the complete reviewed
batch146 history, including its E-03/E-04 mixed-formatting evidence, without
closing any parent or broad editor/browser/device/assistive-technology gate.

## Baseline and ownership

The managed isolated worktree is
`/Users/thomashall/.codex/worktrees/batch148-style-endpoint/sg-ui`, created from
exact reviewed batch146 head `98b4514908062e8ecfed4107de8464c9066454d9` before edits.
Only these files are changed:

- `tests/browser/batch64-style-menu-native-selection.spec.ts`
- `docs/developer/parallel-batch-148/acceptance-evidence.md`

The coordinator's durable `parallel-migration-state.json` and
`wave45-editor-failure-review.json` were read from
`/Users/thomashall/.codex/visualizations/2026/10/07/01a1164f-41db-7f30-aaf9-f20133b6566f/`.
At read time their SHA-256 values were respectively
`79cb034d001397d15fe4d3a831372c4adc62f9066634a5908a7dc62a3735e640` and
`38dde11170b270f5f728638cf74310a019327b8ac49b0303a34ec7fbfb1f9d5c`.
The durable state still records batch146; this successor's exclusive scope comes
from the current dispatch. No shared state, queue or acceptance ledger is edited.
The primary image-upload work and all existing worktrees are preserved.

## Actual Wave45 evidence

Actual tested candidate: `48bf2ee90eeaa45e71ea443aef7b83e6e145cb72`.
Evidence root:
`/Users/thomashall/.codex/worktrees/wave45-reviewed-corrections/sg-ui/artifacts/browser-pool/3e5633e9-aeff-46b0-a27d-2ee355195caf/`.

| Retained file | SHA-256 |
| --- | --- |
| `evidence.json` | `145625752ad8959b9d9df41e77108e4dac3ebd4c0c817e3b6132d54747156111` |
| `style-selection-correction/results.json` | `9e2c47135c77f3a21162b493f5f02a07f01c58d44df0fe1da32bfe54431b3b80` |
| `mixed-selection-correction/results.json` | `20f3fc3700e3aa10b4fa1934815f4ee9ec04a9c0f13841983871525a8c05e209` |

Read-only decoding of all nine style selection attachments (three each in
Chromium, Firefox and WebKit, retry zero) yields the same native state:

```json
{"platform":"darwin","focused":true,"documentFocused":true,"editable":true,"text":"MiXeD text","collapsed":false,"anchor":0,"focus":10}
```

The exact sample has ten UTF-16 code units: five in `MiXeD`, one space, four in
`text`. The native driver selected the complete forward range. The strict
expectation mistakenly required focus 9, so all nine cases stopped before their
menu/formatting/callback assertions. The coordinator review attributes the tested
style bytes to batch146 (SHA-256
`90dc995476e56da913720c4a86bdf657d5f46cfebbef0a4a3a46e8006cb943a3`).

## Bounded correction and retained history

The sole spec change replaces literal `focus: 9` with `focus: 10`. Exact text,
forward anchor zero, noncollapsed selection, focused/document-focused/editable
preconditions, native click/key driver and observational diagnostics remain.
All format, menu, checked-state, callback replacement, rejection, availability
and focus-return assertions remain byte-for-byte unchanged. No artificial
focus/selection, retry, skip or relaxed endpoint bound is introduced.

`tests/browser/editor-mixed-formatting-history.spec.ts` remains byte-identical to
batch146, SHA-256
`22f05375d2262a66235e37b544e8cffad56fbda49760b553426d71ca2a8008e1`.
Its retained Wave45 result reports 18 expected cases, zero unexpected, skipped or
flaky cases across Chromium/Firefox/WebKit. These are prior candidate results;
the mixed spec is not rerun here. The original
[batch146 evidence](../parallel-batch-146/acceptance-evidence.md) is retained
unchanged; its historical style endpoint claim of 0 to 9 is corrected by this
successor, while its mixed driver and E-03/E-04 history remain available.

## Validation and handoff

Static `git diff --check` and changed-byte review pass. Executable validation is
**UNRUN** under the dispatch restriction: no install, source types, unit tests,
Storybook build or browser execution. No shared slots/queues, CI, merge, push or
publication operations were performed.

The coordinator owns independent changed-byte review, source types and a fresh
focused style proof for the three cases in each Chromium/Firefox/WebKit engine.
Passing full-range preconditions alone does not prove subsequent style behavior.
Do not rerun the unchanged mixed spec or infer whole-parent acceptance. Other OS
branches and broad M-30/U-07/E-03/E-04 acceptance remain open. The completion
receipt supplies the frozen clean commit and final hashes separately.
