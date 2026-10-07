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

Chromium: **initial run RED; corrected candidate shard 4 passed** (see wave22 below). Firefox/WebKit: **pending
coordinated checkpoint**. No heavy build/browser server or suite was started by
this worker; no full per-task check/Storybook, CI/title dispatch, main integration,
publication, credentials/permissions or master-checkbox changes occurred.

M-25 remains HOLD for whole-row acceptance. These four cases are bounded evidence
only after actual execution. Fixed-position host restrictions, host document/
selection ownership, manual physical selection/device and spoken AT review,
and broader U/X/R/Z acceptance remain unchanged/open. Any fix outside the assigned
source requires a separately reserved successor; no outside write is authorized.

## Wave21 red evidence and bounded driver correction

Coordinator tested exact clean head `9a034ce867ca9497ff003f25127dc3590d8964b3`
under Node `v24.19.0`, Chromium, port 6305. Outcome: **3 passed / 1 failed**,
zero skipped/flaky. Initial/final source head/status and static build hash were
unchanged. Original evidence/artifacts remain intact:
`artifacts/browser-pool/801a4abb-6107-4138-b9fb-28c12794262d/evidence.json`,
adjacent `results.json`, `browser.log` and failed offscreen case `trace.zip`.
Build digest: `803ac6e82e9b9f3694f38892c36b0c98d6ab55cc61e30f38fdf143f37f978c6a`.

The nested scroll/collision, focused resize/formatting and document replacement
cases passed. The offscreen case passed hidden-toolbar, editor-focus and exact
300px host-scroll assertions, then failed `selectFirstLine` on its second drag
(expected complete selected line, received empty native selection). It did not
fail the offscreen hide/editor return assertions.

Inspected browser log, error snapshot and trace calls/screencast. Trace frame
at 3699.624ms (`...1791390892079.jpeg`) shows the original first-line selection
still highlighted after native editor focus return and scrolling back. The second
drag began at exactly the same selected-text start coordinates (62,299);
subsequent frames show a caret/empty selection. The overlay's offscreen branch
focuses the editor with `preventScroll` and saves dismissal; it does not clear
the native range or own host selection. Retrying a drag inside already selected
editable text is not a reliable fresh-selection driver (native selected-text
drag behavior). No shared editor or toolbar product defect is established.

Bounded **test-driver correction**, with native rerun still required: assert the
retained full native selection after scrolling back, press native ArrowLeft,
assert collapsed selection, editor focus and continued hidden toolbar, then
perform the existing native mouse selection and geometry assertions. This adds
observability and a real fresh-caret user interaction; it removes no assertion,
injects no range/focus/host state repair and changes no runtime/story behavior.
The exact initiating native event is not recorded in the original trace; this
driver classification is supported by retained-selection/caret frames, not a
claim that a recorded dragstart event proves it. The corrected run must validate
the added retained-selection/collapse/reselection assertions before acceptance.

Correction checks: browser source typecheck and `git diff --check` passed.
No new browser/build or redundant unit run; runtime and story are unchanged.

## Wave22 corrected candidate proof and final report-only handoff

Actual browser-tested head: **candidate
`e6270941ea8828d8868fef0798451a599a9db25f`**, managed worktree
`/Users/thomashall/.codex/worktrees/batch45-shared-native-candidate/sg-ui`.
The browser did **not** run worker head
`ed89b21e6c7fada9e86a1ec0a24258e1124f561d` directly.
Coordinator source-byte attribution in
`/tmp/sgui-batch45-candidate-source-attribution.json` identifies that worker head,
its baseline and all three allowed changed files as byte-identical in the
candidate. Attributed SHA-256 bytes:

| Worker file | SHA-256 in tested candidate |
| --- | --- |
| `src/components/FloatingTextSelectionToolbar/FloatingTextSelectionToolbar.stories.tsx` | `145337424cf0bcef31511610588630e6c1afc36d03b60136d89ed470fb8b1a6a` |
| `tests/browser/inventory-selection-boundary.spec.ts` | `ed35068d0264543d1b14b923ab6d409f4837877d2076f8926a06ebe8084dbe66` |
| This report before finalization | `e0a0d8940f188615ca12453a804967c3013b6cf3b785f7fa3c5649aaa97247b9` |

Read shard/root evidence and shard `results.json` after coordinator release.
Evidence root:
`/Users/thomashall/.codex/worktrees/batch45-shared-native-candidate/sg-ui/artifacts/browser-pool/400c7da0-2b1c-447c-8101-fbd7237b63c5`.
Shard: `selection-boundary-native/evidence.json`, adjacent results/browser log.
Node `v24.19.0`, Chromium, slot 3, port 6316. Fresh Storybook build and browser
typecheck ran once for the shared candidate, followed by isolated disjoint shards.
Executed command:

```sh
pnpm exec playwright test '(?:^|/)tests/browser/inventory-selection-boundary\.spec\.ts$' --project=chromium
```

**All four scoped Chromium cases passed**, each retry 0; results record
expected 4, unexpected 0, skipped 0, flaky 0. The added retained native selection,
ArrowLeft collapse, editor focus, hidden toolbar and fresh mouse reselection
assertions passed, supporting the bounded driver correction. No product fix
was needed. The original wave21 red run remains red and retained.

Candidate initial/final head is the same, final status empty, and source digest
unchanged:
`d4c78b7a57d00a53a63a75fe5090b4b24c8681b532a5ba51c663a60049a2d9f0`.
Initial/final build digest and shard digest are identical:
`2a06f15980b85cd3f8eb36bc2ad8ce05693dc11aaafe52edc2c21b7ca10dc9ca`.
The root supervisor status is **failed** due to other shards; this report claims
only the passing four-case selection shard, not whole-candidate acceptance.

Final change is this report only; source/spec remain the attributed tested bytes.
No repeated tests/builds after coordinator release. Coordinator alone reviews
and integrates history. Firefox/WebKit checkpoint, real device/physical selection,
AT and whole M-25 acceptance remain pending/open; no master row is upgraded.
