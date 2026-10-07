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
