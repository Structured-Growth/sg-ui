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
candidate once, with no rebuild during a suite. Fresh Chromium execution of the corrected comparison is pending.
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

## Wave32 native outcome and bounded comparison correction

Coordinator candidate `1976be5e3776fe5e44065b02f359a17751ef7284` ran the original
six Chromium cases after its fresh shared build: light/dark Bold and Italic passed
(4/6); light/dark Underline failed (2/6) at the raw markup equality after Undo.
The preceding **whole JSON equality after Undo passed** in both failing cases.
Expected and received markup differ only by the plain span's absent class attribute
versus `class=""`. This is a DOM serialization equivalence issue in the evidence
assertion, not a demonstrated formatting defect.

The failed artifact is preserved at the coordinator's read-only location:
`/Users/thomashall/.codex/worktrees/batch45-shared-native-candidate/sg-ui/artifacts/browser-pool/6c2eaada-de28-4a40-aef8-2668b3847a47/editor-mixed-formatting/`.
Its `browser.log`, results, screenshots and traces were not edited or replaced.

The browser spec now exports a deterministic DOM comparison helper which clones
the editor subtree and removes **only** attributes matching `[class=""]` from
that detached clone. It returns the clone's otherwise exact innerHTML. Every
existing before/Undo/Redo/reload markup comparison uses this helper; native
selection input, per-character checks and whole JSON comparisons are unchanged.
No generic attribute stripping, production changes or synthetic selection was added.

A colocated regression imports that exact helper (with Playwright case registration
mocked for Vitest), verifies absent/empty class equivalence and verifies the source
DOM is untouched. It rejects nonempty class changes, tag changes, style changes,
text changes, metadata changes and whitespace-only classes. The targeted Vitest
run now passes 4/4, and `pnpm exec tsc --noEmit -p tests/browser/tsconfig.json`
passes under the same Node 24 PATH. Correction checks used atomically acquired
light slot0, released by this owner after completion. `git diff --check` passes.

No independent native rerun or Storybook build occurred. Corrected fresh Chromium
execution remains with the coordinator; the previous Underline failure is retained
as red evidence, and a corrected native green outcome has not yet been claimed.
Firefox/WebKit, manual and whole acceptance gates remain pending.

## Wave33 attribute-order correction

Coordinator candidate `2b9a4397791daa23afe7562049e45b85e626f0a0`, token
`f4cf964e-a2ef-4b80-bc1d-e189e8f4a67e`, again passed the four Bold/Italic cases.
Both Underline cases passed the original empty-class/Undo comparison and reached
line 71, where the reloaded markup's equivalent attribute ordering failed raw
serialization equality: the plain span had `class` before `data-lexical-text`
instead of after it. Whole saved JSON equality immediately before it passed.
This remained an expectation issue; production was not changed.

The wave33 failed evidence under the coordinator's candidate
`artifacts/browser-pool/f4cf964e-a2ef-4b80-bc1d-e189e8f4a67e/editor-mixed-formatting/`
was read only and remains retained. The comparison helper now sorts each cloned
element's attributes by exact name, reattaching the same Attr objects and retaining
every exact name/value. Empty `class=""` remains the sole omitted attribute.
Element order, tags, text, style strings, nonempty class strings and metadata remain
exact. The original editor DOM is unchanged; native selection and JSON checks are
unchanged. Class tokens and style declarations are not reordered or normalized.

The helper regression was extended **before** the helper change: targeted Vitest
was red (1 helper failure, 3 editor tests passed) on reversed equivalent attribute
order. After implementation it is green (4/4). Negative checks additionally reject
renamed/removed attributes, added metadata and nested structural changes, alongside
all previous format/style/text/value checks. Browser TypeScript checking and
`git diff --check` pass under Node 24. Light slot0 was atomically acquired and
owner-released after the checks. No independent build/native run occurred.
Fresh corrected Chromium proof remains pending with the coordinator, as do
Firefox/WebKit, manual and whole acceptance gates.
