# Batch 53: M-25 WebKit offscreen selection scroll diagnosis

Isolated managed worktree:
`/Users/thomashall/.codex/worktrees/batch53-selection-webkit-scroll/sg-ui`.
Clean initial HEAD: `496658081b8b8efcde21ab4f9b151adfd3aa32fe`.
The supplied `codex/dev496658081b8b8efcde21ab4f9b151adfd3aa32fe`
reference did not exist; creation used the exact reviewed SHA instead.
Only the scoped browser spec and this unique report change at this stage.
No runtime fix is yet demonstrated or applied.

Read the root AGENTS, architecture/migration/component guidance, owned selection
contract, development and parallel-browser policy, and batch 37 completion report.
The [selection contract](../react-aria-editor-layout.md#floatingtextselectiontoolbar)
requires editor focus return without reversing host scrolling.

## Preserved red evidence

Frozen checkpoint root:
`/Users/thomashall/.codex/worktrees/dev-integration/sg-ui/artifacts/browser-pool/62606ae5-219b-4fc7-816f-fb51691ea5fd`.
Read root/shard evidence, selection results/browser log and failed WebKit trace.
Selection shard: seven passing Firefox/WebKit cases, one failing WebKit offscreen
case, no retries/skips/flaky acceptance. Chromium's prior four cases remain
historical passing evidence. Checkpoint source/head/build stayed immutable;
commands settled. Resource evidence (8 sessions, peak load 11.33, sampled aggregate
RSS 22.94 GiB, swap falling 16 MiB) does not establish a resource abort.
Build digest: `c7bdf78df57d7eec5f9514bb77c4b944cbadd20a50021207e27a8b9bef0f1084`.

The failed `1-trace.trace` shows native mouse selection at (62,299) through
(229.1640625,299), then Alt+F10 and a passing Bold focus assertion.
The test assigns scrollTop 300. Crucially, `call@163` before snapshot at
14831.081 ms records `__playwright_scroll_top_="300"` on selection-boundary.
The same call's after snapshot at 14857.574 ms has a hidden toolbar and no
nonzero scroll attribute. Editor focus passes at 14862.050 ms; the first poll
expects 300 and receives 0, which remains 0 through the failed polling window.
Thus this is not an assignment that failed to scroll, a wheel setup failure,
or a post-return reselection failure. The test uses no wheel at all.

The only direct owned offscreen focus path calls native root.focus with
preventScroll true. Lexical also handles native focus/selection reconciliation.
Original trace does not capture focus options/call stacks or native event order
inside that interval. Product focus/native scrolling is suspected, but underlying
cause remains **unclassified** until observed; no inference about preventScroll
support, Lexical scrolling or React Aria focus restoration is claimed as fact.

## Diagnostic candidate and coordinator proof

The existing offscreen test now passively records native focus calls (options,
stack, before/after), captured focus/blur/scroll/selectionchange events, native
selection and both host scroll positions. It attaches JSON in finally, including
on failure. Wrappers delegate to the original focus function; no synthetic
selection/focus, replacement event, scroll repair, delay, retry or weakened
assertion is introduced. Page disposal removes its diagnostic lifetime.
All original exact 300px scroll, editor focus, retained selection, dismissal,
fresh native reselection and collision assertions remain.

Frozen install passed on bundled Node v24.19.0 under UUID-owned atomic install
slot 0; only its exact owner lease was released. Browser TypeScript check under
UUID-owned atomic light slot 0 passed; git diff --check passed. Runtime/unit
checks are deferred until a runtime change is justified. No independent native,
server, Storybook build or heavy command was launched.

Coordinator diagnostic args (one affected case per engine; no unchanged green
case duplication):

```json
["tests/browser/inventory-selection-boundary.spec.ts", "--grep", "^offscreen selection hides actions and returns focused toolbar to editor without host scroll repair$", "--project=chromium", "--project=webkit"]
```

Coordinator builds/typechecks its immutable candidate once and attributes exact
owned bytes. This diagnostic run is intentionally expected to preserve the
WebKit red behavior while exposing its cause; it is not acceptance. Read the
`native-selection-scroll-sequence` JSON attachment and original trace together
before any bounded fix. Source/head/report remain frozen for that handoff.
Coordinator alone integrates/accepts. Broad M-25/native/device/AT gates stay open.


## Wave28 capture and bounded product correction

Coordinator tested the attributed diagnostic bytes on candidate
`24f9b4abb6ae39675b5bdf9abe8c9764a14a059e`, not the worker HEAD directly.
Evidence root is
`/Users/thomashall/.codex/worktrees/batch45-shared-native-candidate/sg-ui/artifacts/browser-pool/ccfdb3fe-1f4a-4199-9564-3a8b2dbf6fc3`.
Read the selection-webkit-scroll shard evidence/results and native JSON attachment.
Actual selector is the escaped anchored spec, projects Chromium/WebKit and
`--grep "offscreen selection"`: exactly one case per engine. Chromium passed;
WebKit failed the same strict 300px assertion. Build digest:
`de160daed84eb81439957ab5fe4a760f5405a517f60cdb66a0111167dda23248`.
Source/build stayed immutable/clean; all commands settled, no resource abort.
Preserve both original and diagnostic red artifacts.

WebKit attachment: at 739ms captured scroll has inner 300/outer 0 and Bold focused.
The only root focus call then has `{preventScroll:true}` and the owned offscreen
branch stack. Native editor focus event still reports 300; **focus-return at
740ms reports 0** with the editor focused and the same full selected text. The
751ms scroll event remains 0; no additional focus call or collapsed selection
occurs. This isolates the change to the synchronous native focus transaction
(including its synchronous event handlers), not setup/wheel, asynchronous retry,
selection replacement or a later host scroll. It does not separately prove an
engine-internal implementation bug. Classify the underlying library defect as
**product: offscreen focus return fails to preserve host scroll in WebKit**.

Bounded fix in FloatingTextSelectionToolbar snapshots root/ancestor scrollTop and
scrollLeft immediately before its offscreen focus, calls native focus once with
preventScroll, and synchronously restores only changed offsets before returning.
This is a local fallback for the demonstrated focus transaction; it does not clear,
recreate or synthesize selection/focus, retry focus, wait, repair later host scroll,
or alter shared editor/focus/Dialog modules. Existing dismissed selection prevents
subsequent scroll delivery from reopening actions. It changes only the offscreen
return branch; normal formatting/Escape paths retain their existing behavior.
The existing NestedHostBoundary story documents this changed behavior without
changing fixture layout. The diagnostic spec retains every original strict check.

New colocated regression simulates the observed synchronous native-focus scroll
change across nested vertical/horizontal offsets, including negative horizontal
scroll. It asserts one preventScroll focus call, exact offset preservation, editor
focus, retained Lexical selection and continued dismissal on later scroll.
This would fail the original implementation's exact offset assertions. The first
unit attempt included a native DOM text assertion that JSDOM focus does not preserve;
that environment-specific assertion was removed from the new unit test. The actual
native retained-text assertion in the browser case stays strict and unchanged.

Under bundled Node v24.19.0, UUID-owned atomic light slot 0 (exact lease released):

- `pnpm exec vitest run src/components/FloatingTextSelectionToolbar/FloatingTextSelectionToolbar.test.tsx src/components/PageRichTextEditorSection/PageRichTextEditorSection.floating.test.tsx --maxWorkers=1`: 9 passed in two files.
- `pnpm typecheck`: passed.
- `pnpm foundations:check`: passed.
- `pnpm exec tsc --noEmit -p tests/browser/tsconfig.json`: passed.
- `git diff --check`: passed.

Preserved unit diagnostic: Lexical emits JSDOM's unimplemented window.scrollBy;
all final tests pass. This is not native scroll evidence. No native/build/server
command ran locally. Fresh next coordinator proof must run the same single
**offscreen selection** case in Chromium and WebKit, with source-byte attribution
and fresh shared build/types. WebKit must pass exact 300px scroll, editor focus,
retained text, dismissal, native fresh selection and collision assertions before
bounded acceptance; previous diagnostic Chromium success does not validate changed
runtime bytes. Unchanged green cases need not be duplicated solely for load.
Broader browser, whole M-25, device and AT acceptance stay open.


## Wave29 verified native correction proof

Coordinator released the frozen source after the run settled. Read root manifest,
selection shard evidence/results and worker attribution at
`/tmp/sgui-batch45-candidate-wave29-attribution.json`. Verified all five frozen
worker file hashes against that attribution before this report-only update.
Actual tested shared candidate: `f87c8d336932ea70ad3ab9eaea5e4e6b77bc40ec`.
Attributed worker HEAD: `9b74d453cd83d50a1c5546a6ad8245bc8fed989a`, baseline
`496658081b8b8efcde21ab4f9b151adfd3aa32fe`. The worker checkout did not itself run
browsers. Candidate source bytes were identical for this scope:

| Scoped file | Tested SHA-256 |
| --- | --- |
| FloatingTextSelectionToolbar.tsx | `e38c12274a47f75c325a4cd3c0e8e2461f4032ca1173da961dbf8308d8716402` |
| FloatingTextSelectionToolbar.test.tsx | `e058ffd31c42edf7a7aaccb9015c4129ec504df91dc43a2730a8f9f75c8eb33a` |
| FloatingTextSelectionToolbar.stories.tsx | `e89c2c9b4e59a73da006b98be82c15373699dd98ef7296665122289117166a9b` |
| tests/browser/inventory-selection-boundary.spec.ts | `4a92fe7fb51d80400f85f8844901acc787f754ac61c4b69cc3eb40c10fca05b2` |
| This report before finalization | `848448f6b7e0febfdd1ed69d00249c597fe89b822664c4bfd594c6e525d055f0` |

Evidence root:
`/Users/thomashall/.codex/worktrees/batch45-shared-native-candidate/sg-ui/artifacts/browser-pool/693cd1a1-28f1-4986-b345-258b4621c480`.
Shard: `selection-webkit-scroll`, slot 0, port 6553, Node v24.19.0,
pnpm 10.29.3, Playwright 1.63.0. One fresh shared Storybook build and browser
source typecheck preceded the disjoint shards. Actual selected command:

```sh
pnpm exec playwright test '(?:^|/)tests/browser/inventory-selection-boundary\.spec\.ts$' --project=chromium --project=webkit --grep 'offscreen selection'
```

Exactly **two cases passed**: the offscreen-selection case once in Chromium and
once in WebKit, each retry 0. Results: expected 2, unexpected 0, skipped 0,
flaky 0. The strict 300px host scroll, editor return focus, retained full native
selection, continued dismissal, native ArrowLeft collapse/fresh mouse selection
and anchored collision assertions all passed. This is fresh native proof of the
changed runtime bytes, not reuse of diagnostic Chromium success. Other unchanged
selection cases were not duplicated in this run. Root run reports 54 passing
native cases across five shards; this report's behavioral claim remains the two
scoped cases, not broader component acceptance.

Root initial/final HEAD is the same candidate, final Git status empty. Initial/
final source digest is
`6464ca63b43a916374529d26fd88b7cdefcd4efb82b0bcd2014618c1d9bbfe38`;
initial/final build and shard digest is
`d6a2c0f07f33e5ca842a98dbf9fe0f0f86b9700add97fdda68c4bcb87c9859f8`.
Root status passed and cleanup confirms owned commands settled. Original checkpoint
and wave28 diagnostic failures remain red and retained at their recorded paths.

This finalization changes only the unique report. Source/spec/tests/story remain
the tested, attributed bytes; no tests, server or build were repeated. Coordinator
alone reviews and integrates the individual worker commits. The demonstrated
WebKit focus-scroll defect has bounded Chromium/WebKit correction evidence;
changed-byte Firefox proof, physical selection/touch/pen, assistive technology,
whole M-25 and broad U/X/R/Z acceptance remain open. No inventory/master row was
upgraded by this worker and no full shared-candidate merge is requested.
