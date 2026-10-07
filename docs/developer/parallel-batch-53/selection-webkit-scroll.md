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
