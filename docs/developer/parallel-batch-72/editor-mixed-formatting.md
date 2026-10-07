# Batch 72: mixed-run editor formatting evidence

Task references: M-26 / E-04, bounded evidence only. No whole E-04 acceptance claim.
Base verified before edits: `2d6f357d10b2a65bc988aba6280e69f92f3b1147` (dev).
Managed worktree: `/Users/thomashall/.codex/worktrees/batch72-editor-mixed-formatting/sg-ui`.

## Ownership and scope

Only these four new files are writable in this worker:

- `src/components/PageRichTextEditorSection/PageRichTextEditorSection.mixed-formatting.stories.tsx`
- `src/components/PageRichTextEditorSection/PageRichTextEditorSection.mixed-formatting.test.tsx`
- `tests/browser/editor-mixed-formatting-history.spec.ts`
- `docs/developer/parallel-batch-72/editor-mixed-formatting.md`

Production, shared stories/specs/config, primary/integration/other-worker checkouts,
workflow settings and release files remain read-only. No confirmed production bug
or outside-scope correction is reported. No dependency manifest/lockfile changes.

## Evidence design

The story loads a real editor with three differently formatted runs: `Bold` (bold,
owned action color), ` plain ` (plain), and `Italic` (italic, Georgia). The host
saves actual `onLexicalChange` JSON and supplies it under a new `editorKey` for reload.
Storybook's existing production Provider supplies the theme/density/locale/style scope;
the host fixture does not override shared tokens or inject editor commands/selection.

The unit tests exercise real Lexical plugins/history, the real toolbar, serialization
and document replacement. Supported Lexical selection APIs establish the unit range
only. They do **not** represent trusted native keyboard evidence. Each of Bold,
Italic and Underline acts on the interior cross-run range `ld plain Ita`. Assertions
compare every character's text, format, style and other serialized run fields,
including untouched boundary characters, and compare whole JSON across Undo/Redo/reload.
A fresh lifetime's Undo cannot restore the old document.

The browser spec contains six cases: those three actions in light and dark themes.
The keyboard path is editor click, `Home`, `ArrowRight` twice, then twelve
`Shift+ArrowRight` presses. Only observation uses `page.evaluate`; no synthetic
selection, DOM Range mutation, selection.modify, injected Lexical editor or
synthetic event stands in for keyboard input. Selection must equal `ld plain Ita`
before the real toolbar pointer action. Mixed-run checked state is initially false;
after the transaction the action's state matches the resulting uniform format.
The spec checks exact per-character callback serialization and text, native range
retention, entire rendered document markup and JSON across Undo/Redo/reload, plus
an actual new toolbar transaction and Undo in the replacement editor. Runtime
errors/warnings fail the case; final callback JSON is attached as evidence.

## Local red/green record

Runtime PATH prefix: `/Users/thomashall/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin`;
observed runtime `v24.19.0`. Install used `pnpm install --frozen-lockfile` in this
worktree under atomically acquired install slot1. Light checks used atomically
acquired light slot2; busy slots were not stolen. Both slots were released by
this task owner after their processes completed.

Initial targeted run: 3/3 red because the test incorrectly expected mixed-range
Bold checked state to be true. Lexical computes the intersection of selected run
formats, so all three controls are unchecked for this fixture. The next run reached
all formatting/history/reload assertions and was 3/3 red solely because the test
incorrectly expected Undo to be disabled after replacement; this toolbar exposes
the command without history-availability state. Assertions now check that Undo in
the new lifetime is inert. Neither red run established a production defect.

Green checks:

- `pnpm exec vitest run src/components/PageRichTextEditorSection/PageRichTextEditorSection.mixed-formatting.test.tsx`: 3/3.
- `pnpm exec vitest run src/components/PageRichTextEditorSection/PageRichTextEditorSection.mixed-formatting.test.tsx src/components/PageRichTextEditorSection/PageRichTextEditorSection.formatting.test.tsx src/components/PageRichTextEditorSection/PageRichTextEditorSection.table-history.test.tsx`: 13/13 across 3 files.
- `pnpm exec tsc --noEmit`: passed (source and stories).
- `pnpm exec tsc --noEmit -p tests/browser/tsconfig.json`: passed (including final browser assertions).
- `git diff --check`: passed.

## Coordinator admission and pending gates

No independent Storybook build, browser run, full `pnpm check`, GitHub CI, main
change or publication was performed. The coordinator builds and tests the admitted
candidate once, with no rebuild during a suite. Fresh Chromium execution is pending.
Intended native command after that build:

```sh
pnpm exec playwright test tests/browser/editor-mixed-formatting-history.spec.ts --project=chromium --workers=1
```

Retain the configured fresh static Storybook server, diagnostics, traces, screenshots
and JSON attachments. Firefox/WebKit checkpoints, manual device/assistive-technology
and broad E-04/E/U/X/R/Z gates remain pending. If native evidence exposes a real
production defect, reserve a separate correction scope; do not change production
under this batch's allowlist.

Related contracts: [editor section](../react-aria-editor-section.md),
[formatting toolbar](../react-aria-formatting-toolbar.md),
[browser acceptance](../react-aria-browser-acceptance.md).
