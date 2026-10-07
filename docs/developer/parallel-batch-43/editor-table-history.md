# Batch 43: table selection, history and reload evidence

M-34 / E-02 / E-04 scope C, 2026-10-07. Baseline:
`3c31ee6daae917ad82fbd2bd882c203f381d75dd`.
Managed worktree exclusively reserved by coordinator:
`/Users/thomashall/.codex/worktrees/batch43-editor-table-history-managed/sg-ui`;
branch `codex/batch43-editor-table-history-managed`.

The worker app initially rejected managed creation with “Not a git repository”.
The coordinator created/registered this managed checkout; its attachment here
reported another-task ownership, which the coordinator explicitly anticipated and
resolved with exclusive reservation. The earlier `/tmp/sgui-batch43-editor-table-history`
checkout remains unedited. Primary image-upload changes are preserved.

Read [batch 31](../parallel-batch-31/inventory-acceptance-25-37.md),
registered-node tests, existing formatting/dialog tests and the rich-document
browser spec before adding coverage. Their saved-table restoration and list/rule
cases do not establish the insertion/cell-selection/history combination below.
No implementation, Lexical plugin, toolbar, dialog or fixture source was changed.

## Added evidence

- [TableHistory story](../../../src/components/PageRichTextEditorSection/PageRichTextEditorSection.stories.tsx):
  real editor, full toolbar, host callback JSON and reload with a new `editorKey`.
- [Composed test](../../../src/components/PageRichTextEditorSection/PageRichTextEditorSection.table-history.test.tsx):
  real columns dialog with default `twoEqual`, two cells, selected substring Bold
  through the real toolbar, Undo/Redo exact JSON restoration, key replacement,
  preserved cells and surrounding introduction. Actual plugins/history remain;
  test-only editor capture and omitted floating geometry separate jsdom limitations.
  Test edits use Lexical updates with explicit history boundaries, not native typing.
- [Native spec](../../../tests/browser/inventory-editor-table-history.spec.ts):
  light/dark cases for real dialog insertion/focus return, native cell typing and
  Tab navigation, native substring selection with toolbar pointer activation,
  Undo/Redo, exact saved JSON reload, post-reload edit/history, one row/two cells
  without unequal-width overrides, and retained introduction. Console/page errors
  fail the case. Final callback JSON is attached to the browser result.

## Observed validation

Node `24.19.0`, pnpm `10.29.3`; frozen-lock install succeeded under an atomically
owned install slot. Commands below ran serially under an owned light slot;
slots were released only after matching their owner tokens.

- `pnpm exec vitest run src/components/PageRichTextEditorSection/PageRichTextEditorSection.table-history.test.tsx --maxWorkers=1`: **1 passed** on final source.
- `pnpm typecheck`: passed.
- `pnpm exec tsc --noEmit -p tests/browser/tsconfig.json`: passed.
- `pnpm foundations:check`: passed.
- `pnpm tokens:check`: passed.
- `git diff --check`: passed before handoff.

Retained initial failure: composed test requested `Columns layout` instead of the
actual `Columns Layout` menu accessible name. Classification: **test expectation**;
corrected exact label and native radio checked-property assertion, then passed.
No confirmed product defect was observed by these checks.

## Frozen native handoff and limits

Coordinator should build this immutable clean commit and run:
`pnpm exec playwright test tests/browser/inventory-editor-table-history.spec.ts --project=chromium --workers=1`.
Fresh Storybook/build/type validation belongs to the coordinator pool; this worker
ran no independent heavy build/browser suite. Chromium is **pending**, not passed.
Freeze source/spec/report during that run. Preserve failure logs and classify actual
underlying cause before any bounded correction or successor assignment.

Firefox/WebKit remain pending the batch checkpoint. M-34/E-02/E-04 remain held;
this representative sequence does not establish all presets, table merging,
multi-cell/mixed selection, insertion Undo grouping, every command or host
composition. IME, physical devices, assistive technology and E-06/E-07 trust/upload
acceptance are unclaimed. No master checklist, release, workflow or acceptance
status was changed.

## Wave 22 retained failures and bounded correction

Coordinator built candidate `e6270941ea8828d8868fef0798451a599a9db25f` once
and verified byte identity of all worker-owned files to `586c9b65c3b22d45d89b773a979635a99e43ee53`.
Wave 22 session `400c7da0-2b1c-447c-8101-fbd7237b63c5` ran this spec in
Chromium: **0 passed / 2 failed**, zero skipped/flaky. Candidate source/build
hashes stayed unchanged. Retained evidence and browser log:
`/Users/thomashall/.codex/worktrees/batch45-shared-native-candidate/sg-ui/artifacts/browser-pool/400c7da0-2b1c-447c-8101-fbd7237b63c5/editor-table-history/`.

- Light: unscoped Bold locator matched both Text formatting and Selection formatting
  toolbars. **Confirmed test-driver defect**, no command was activated.
- Dark: cell-center pointer click followed by Home/Shift+ArrowRight selected `Co`
  from the introduction instead of `First`. **Selection driver failure**; no
  product correction is justified by this outcome. Cell content and twoEqual JSON
  had already passed. Exact physical pointer hit-test cause remains unclassified.

Bounded correction scopes Bold to the actual Text formatting group, checks editor
and toolbar readiness, returns from second to first cell through native Shift+Tab,
moves left by the known cell-text length from the previous-cell end, and asserts
the native caret belongs to cell one at offset zero before extending
selection. Post-reload cell activation targets its visible text and verifies cell
caret ownership. No selection is assigned through DOM/Lexical APIs in the browser
spec; the actual keyboard/plugin/toolbar behavior and full JSON history assertions
remain intact. No product source changed. Corrected Chromium proof remains pending
coordinator rerun; original red evidence remains preserved.

Corrected-spec `pnpm exec tsc --noEmit -p tests/browser/tsconfig.json` passed under
an owned light slot on Node 24.19.0; `git diff --check` passed. Unit/story/product
source is unchanged since its recorded pass.

## Wave 23 retained endpoint failure and correction

Actual tested candidate `c64c4377eb42c936f3cf8f1e3f5de2a5b33bdc05`, session
`16f6feff-4479-4f37-8c96-451b694ba457`: **0 passed / 2 failed**, zero skipped/flaky.
Source/build hashes unchanged; attribution is retained at
`/tmp/sgui-batch45-candidate-wave23-attribution.json`. Browser log/traces/results:
`/Users/thomashall/.codex/worktrees/batch45-shared-native-candidate/sg-ui/artifacts/browser-pool/16f6feff-4479-4f37-8c96-451b694ba457/editor-table-history/`.
Both cases passed insertion, cell typing/navigation, selected Bold, exact JSON
Undo/Redo and host reload, then inserted `!` at the clicked midpoint after `End`:
`Second! lesson` versus expected `Second lesson!`. Classification: **test-driver
endpoint assumption**, one underlying issue across two theme cases. No confirmed
product defect and no implementation correction.

Corrected post-reload navigation uses the actual table plugin's native Shift+Tab
then Tab to return to second-cell end; a read-only DOM assertion requires a
collapsed text caret in that cell at its complete text length before typing.
It replaces only the platform-dependent End assumption, retaining exact content,
JSON Undo/Redo and native selection guards. No browser-side selection mutation.
Corrected browser typecheck and diff check passed; native rerun remains pending.

The coordinator also reported an earlier **pre-browser environment failure**:
child PATH error, cleanup EPERM and verified recovery of owned dead leases. That
attempt is not native proof. The actual Wave 23 child used Node 24.19.0.
