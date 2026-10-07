# Batch 144: Retry removal and native toolbar reentry attribution

Parent tasks: M-17, U-07. This is a bounded diagnostic deliverable; no broad
acceptance gate closes and no product fix or new native pass is claimed.

## Ownership and baseline

Managed isolated checkout: `/Users/thomashall/.codex/worktrees/ef78/sg-ui`.
Branch: `codex/batch144-retry-focus-attribution`.
Baseline: `164421fd639608a4afcfc013adda1d80ebf80cc7` (the requested pushed dev head).
The durable coordinator state was read before edits: batch144 has an exclusive
reservation for the browser spec, shell story and this report. Only the spec and
report changed. The story remains unchanged because it already exercises the
required Retry unmount. No runtime shell, grid resize/reorder, primary image-upload,
shared queue/lease/state, acceptance inventory or CI files were modified.

Policies read: [development validation](../react-aria-development-validation.md)
and [parallel browser validation](../react-aria-parallel-browser-validation.md).
The dispatch's `parallel-browser-validation.md` spelling resolves to the latter
existing repository document.

## Retained red evidence and ordered facts

Actual frozen checkpoint: `c7e4863c922e7b94fb9fef143307343850993bff`.
Evidence directory:
`/Users/thomashall/.codex/worktrees/reviewed-dev-fw-checkpoint-43/sg-ui/artifacts/browser-pool/74a00435-d263-40f8-bb40-57fac90a4818`.

Read-only receipts:

| File | SHA-256 |
| --- | --- |
| `evidence.json` | `1219120bd3640fad7013862fa4673f9bee5d528f3f325855cc05f8a5b043128a` |
| `grid-shell-responsive/results.json` | `1378c649bdf460af9c7d3296c68ac281d379ebfebcd2edeb7f2e1963e1bd12eb` |

The shard reports four expected and four unexpected cases, zero skipped/flaky,
not eight successful cases. Its Firefox failures span both themes and both text
sizes; the companion WebKit cases pass in that historical shard only. Both named
wave43 failure-review JSON files were read; the early review classifies this issue
as unclassified and makes production scope conditional.

Ordered retained facts from all four Firefox `1-trace.trace` entries:

1. Six real Tab presses (normal text) or seven (200% text) reach Cards; its focus
   and responsive visibility assertions pass.
2. Enter selects cards; Alt+p shows pending and Alt+e shows error while Cards
   remains focused.
3. Two real Tab presses reach Retry; the strict Retry focus/visibility assertions
   pass before Enter.
4. Enter on Retry invokes the fixture's `setResponse("pending")`. The retained
   action-after snapshot replaces error/Retry with Refreshing rows, and the pending
   visibility assertion passes.
5. Exactly 50 real Tab presses follow the Retry Enter in each trace. The List
   `toBeFocused` assertion fails; the review's snapshot records List enabled with
   tabindex 0 and the final screenshot records Last page focus.

| Variant | SHA-256 of retained `1-trace.trace` ZIP entry |
| --- | --- |
| light / normal | `4fb84e6766939b48048bd804cab0fbc9d8503d1315dc9d77bc8e84ca9ae26496` |
| light / 200% | `4ba0a273596bd72a7f300671ae261b1ab4e2c183aad4e5d730afa605db3ce4f7` |
| dark / normal | `6ef0bd311456cba16c6d38af57a1344f2eadcccd3d0ce8ef78b8a4e5372aa2b0` |
| dark / 200% | `bea1ce61ba0d44c504fd98a8d9a2de3e43dbadce3900ac715a80701b89f60558` |

Source attribution: shell card-removal repair saves focus only inside a grid card;
Retry belongs to a sibling status. That code therefore does not establish a saved
Retry focus target. No source observation proves Firefox's sequential starting
point, browser/document focus loss, a stale FocusScope, or competing application
focus. Historical trace snapshots are not a complete activeElement/event timeline.
Classification remains **unclassified native traversal/lifecycle failure**.

## Prepared regression diagnostics

The existing four responsive cases retain their original native navigation keys,
50-attempt bound, focus/indicator/full-bounds/hit assertions and subsequent
view/footer/status assertions. No click/focus injection substitutes for native reach.
Additional assertions explicitly require Retry removal and enabled tabindex-0 List
before reentry.

The `native-focus-lifecycle` JSON attachment is emitted from `finally` on passes or
assertion failures. A browser-side observer records monotonic sequence/time,
document.hasFocus, real focusin/focusout and keydown/keyup events, related targets,
default prevention, each post-Tab active element, owned toolbar/status/footer
membership, element identities, retained Retry and initial List connection,
hidden/inert/aria-hidden ancestry, geometry/shell scroll, overlays and focus-scope
markers. Mutation records expose Retry/status and boundary transitions. Storage is
bounded to 1000 records and reports droppedRecords explicitly. Observers/listeners
are disposed before reading/attaching the receipt. The observer never focuses,
prevents events, changes DOM attributes, or changes host state. DOM focus-scope
markers are diagnostic evidence only, not proof of the engine's internal scope stack.

Read this attachment in sequence at `retry:before-enter`, native Enter events,
`lifecycle:mutation`, `retry:removed-pending-visible`, and each
`traversal:after-tab:List:N`. Stable List identity/connection plus actual key targets,
document focus and boundary changes can distinguish driver/browser traversal from
an owned lifecycle defect. This instrumentation introduces observation overhead;
changed behavior on the instrumented run alone does not prove a timing fix.

## Validation and next owner action

- `git diff --check`: passed for the prepared patch.
- Browser source typecheck, source/unit checks, Storybook build, all native runs:
  **UNRUN** by explicit dispatch instruction; coordinator owns actual validation.
- No install, build, browser launch, queue/lease mutation, push/merge/publish or CI
  operation was performed.

Coordinator should typecheck the changed browser source and run the existing exact
spec on a freshly built reviewed clean snapshot, prioritizing Firefox for the
recorded failure and retaining affected Chromium/WebKit evidence. Inspect ordered
JSON before assigning product versus driver cause. If runtime repair is established,
reserve AppDataGridShell runtime/test files separately before implementation.
Do not infer acceptance from prepared assertions or historical companion passes.

## Frozen source receipt

Changed browser spec SHA-256: `00344a9fc7855e792ac139e86419aa3a5a6f0f9a9a07f13982aafa930e69bea6`.
Unchanged permitted story SHA-256: `bc05725c9d9a7a128876ea8cba3d5666412d7b90f0b34a34623d8a1492294454`.
The exact final commit and report hash are supplied in the completion handoff;
this avoids a self-referential report hash or commit identifier.
