# Batch 37: M-25 nested selection boundary native evidence

Reviewed baseline: `4c9f859bad204a7d7fd2e3787aa6f293db268525`, 2026-10-07.
Managed isolated worktree:
`/Users/thomashall/.codex/worktrees/batch37-selection-boundary/sg-ui`.
Branch: `codex/batch37-selection-boundary`.

Write scope is the FloatingTextSelectionToolbar directory, the unique
`tests/browser/inventory-selection-boundary.spec.ts` and this report only.
The primary checkout/image-upload work and other worktrees were untouched.

## Evidence gap and change

Read [batch 31 inventory](../parallel-batch-31/inventory-acceptance-25-37.md),
[development validation](../react-aria-development-validation.md),
[selection contract](../react-aria-editor-layout.md#floatingtextselectiontoolbar),
the six colocated tests, two real-editor composition tests and ordinary native
selection/Bold coverage in `tests/browser/acceptance.spec.ts`.
Existing mocked geometry tests are useful but do not establish native ancestor
scroll, wrapping after resize or document replacement. No runtime defect has been
demonstrated; production source/CSS is unchanged.

Added `NestedHostBoundary` story with a real Lexical composer, independently
scrolling outer host and inner boundary, and host-owned document replacement.
The host explicitly clears its native selection before replacing the composer;
this is not a claim that the overlay owns document replacement or host selection.
No transformed fixed-position containing block is introduced.

Four new focused browser cases:

- Native mouse selection, captured outer scroll and inner scroll forcing the
  above/below collision; assert actual range geometry and full boundary containment.
- Resize to 280px while Bold has keyboard focus; assert clamping/wrapping,
  retained focus and formatting of the saved selected text only.
- Scroll the focused selection fully offscreen; assert hidden actions, editor
  focus without reversing host scroll, dismissal on return and fresh selection access.
- Host document replacement disconnects the prior root, clears native selection
  and hides the old overlay; a fresh native selection formats only new nodes.

Geometry evaluation measures native ranges; it does not inject selection or
Lexical commands. Host scroll changes set native `scrollTop` and exercise captured
scroll delivery. The tests do not certify physical touch/pen or AT operation.

## Targeted local validation

Node `v26.5.0`, pnpm `10.29.3`. Installation was needed in the new checkout:
`pnpm install --frozen-lockfile` passed under atomically claimed canonical install
`slot1`; only its UUID-owned token was released. The installer reported ignored
esbuild build scripts; no approval or dependency/source changes were made.

Under atomically claimed canonical light `slot1`, released only by its UUID owner:

- `pnpm exec vitest run src/components/FloatingTextSelectionToolbar/FloatingTextSelectionToolbar.test.tsx src/components/PageRichTextEditorSection/PageRichTextEditorSection.floating.test.tsx --maxWorkers=1`:
  **8 tests passed**, two files.
- `pnpm typecheck`: passed.
- `pnpm exec tsc --noEmit -p tests/browser/tsconfig.json`: passed.
- `pnpm foundations:check`: passed.
- `git diff --check`: passed.

Preserved diagnostic: Vitest emitted JSDOM's `Not implemented: window.scrollBy`
from Lexical DOM selection scrolling. Both files passed; classify this as a unit
environment limitation, not evidence that native scrolling passes. No browser
case has yet executed, and there is no observed browser product/driver failure
to classify at this preparation stage.

## Exact-head native handoff and limits

Commit SHA is supplied in the coordinator handoff rather than embedding a
self-referential SHA here. Source stays reserved pending actual native proof.
Coordinator args:

```json
["tests/browser/inventory-selection-boundary.spec.ts", "--project=chromium"]
```

Chromium: **pending fresh immutable pool validation**. Firefox/WebKit: **pending
coordinated checkpoint**. No heavy build/browser server or suite was started by
this worker; no full per-task check/Storybook, CI/title dispatch, main integration,
publication, credentials/permissions or master-checkbox changes occurred.

M-25 remains HOLD for whole-row acceptance. These four cases are bounded evidence
only after actual execution. Fixed-position host restrictions, host document/
selection ownership, manual physical selection/device and spoken AT review,
and broader U/X/R/Z acceptance remain unchanged/open. Any fix outside the assigned
source requires a separately reserved successor; no outside write is authorized.
