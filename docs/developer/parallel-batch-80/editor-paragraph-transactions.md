# Paragraph command history evidence preparation

Parent criteria: E-03/E-04. Baseline: `007617d53600b258e001d69530fb74d672362222`.
This is one bounded paragraph-command slice, not completion of either parent or
broad editor acceptance. Production source remains unchanged.

## Prepared coverage

The real `PageRichTextEditorSection` fixture contains a left-aligned bold target
paragraph and a right-aligned italic adjacent paragraph with indent 2 and a
separate inline style. Host callback JSON is visible; reload replaces `editorKey`
using that saved value.

The composed unit uses supported Lexical selection setup, the real toolbar/menu,
real command handlers and real history. Center, indent and outdent must change
only target format/indent. Full JSON equality protects adjacent content, format,
indent and inline styling. Each command has an Undo/Redo round trip; replacement
loads saved JSON and has independent empty history. Command selection retains
exact text, offsets and target paragraph ownership. Only absent jsdom geometry
and the floating selection overlay are replaced; command success is never mocked.

The browser spec uses trusted paragraph click, Home/arrows and Shift/arrows to
select `rget p`. Owned menu commands activate by native keys. Assertions cover
menu focus, focus restoration, native selection endpoints, exact host JSON,
rendered alignment/inline markup, each history round trip and saved reload in
light/dark themes. Browser selection APIs are observation-only.

## Local evidence and pending native proof

- `pnpm install --frozen-lockfile`: passed under task-acquired install slot 0.
  Log: `/tmp/batch80-editor-paragraph-install.log`.
- `pnpm exec vitest run src/components/PageRichTextEditorSection/PageRichTextEditorSection.paragraph-transactions.test.tsx`:
  passed (1 composed case), including the strengthened selection assertions.
  Log: `/tmp/batch80-editor-paragraph-unit-final.log`.
- `pnpm exec tsc --noEmit`: passed.
  Log: `/tmp/batch80-editor-paragraph-types.log`.
- `pnpm exec tsc --noEmit -p tests/browser/tsconfig.json`: passed.
  Log: `/tmp/batch80-editor-paragraph-browser-types.log`.
- `pnpm foundations:check`: passed.
  Log: `/tmp/batch80-editor-paragraph-foundations.log`.

The initial unit attempt passed center history but failed a fixture role selector
for Indent: alignment is `menuitemradio`, indent/outdent are `menuitem`. The test
selector was corrected without changing production or expected behavior. Red log:
`/tmp/batch80-editor-paragraph-unit.log`.

Native/browser/build/packing commands were not run. The coordinator owns the
pooled fresh Storybook build and browser window. Focused arguments for that frozen
candidate are `tests/browser/editor-paragraph-transactions.spec.ts --project=chromium --workers=1 --retries=0`.
Firefox/WebKit remain pending the batch checkpoint. Browser focus/selection/history
assertions remain unverified until that run; any failure must retain its evidence
and be classified before corrective source scope is reserved. No force clicks,
retries, weaker assertions, main integration, publication or workflow changes.
