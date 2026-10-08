# Batch 150: Native backwards grid toolbar return

Parent tasks: M-17, U-07, partial only. Classification: **test-driver traversal
assumption**. This prepares a bounded native driver correction; it establishes no
product fix, native pass or acceptance closure.

## Exact ownership and retained evidence

Managed checkout: `/Users/thomashall/.codex/worktrees/8d22/sg-ui`.
Exact requested predecessor: `f22cd1da76cb448a86b73c44e2943310e00636c4`.
The checkout was clean at that detached head before editing. The successor150
dispatch exclusively authorizes this report and
`tests/browser/inventory-grid-shell-responsive.spec.ts`.

Read the coordinator's durable `parallel-migration-state.json`, including its
reservation entries. At inspection it still lists predecessor144 as active with
that spec, its shell story and predecessor report; no successor150 entry was
present. This successor follows the explicit exclusive dispatch, without editing
that ledger, extending ownership or modifying predecessor artifacts. Runtime,
story fixtures, other worker worktrees and the primary image-upload worktree are
untouched. The [development validation policy](../react-aria-development-validation.md)
and [parallel browser policy](../react-aria-parallel-browser-validation.md) were read.

Wave45 actual tested frozen head: `48bf2ee90eeaa45e71ea443aef7b83e6e145cb72`.
Evidence root:
`/Users/thomashall/.codex/worktrees/wave45-reviewed-corrections/sg-ui/artifacts/browser-pool/3e5633e9-aeff-46b0-a27d-2ee355195caf`.
Review root:
`/Users/thomashall/.codex/visualizations/2026/10/07/01a1164f-41db-7f30-aaf9-f20133b6566f`.
Read-only SHA-256 receipts, independently recomputed:

| Artifact | SHA-256 |
| --- | --- |
| Review `wave45-grid-navigator-failure-review.json` | `5b489b0496b2516bc041a05a89ad3c3b5cc2e653b4fdf1a986c39126b822bea8` |
| Evidence `evidence.json` | `145625752ad8959b9d9df41e77108e4dac3ebd4c0c817e3b6132d54747156111` |
| Evidence `grid-retry-diagnostics/results.json` | `314fee81bbd1137e5c1b26c6fb8c8d7db6bd5a8075e6e8fac3429f76908b2097` |

The retained shard reports four unexpected Firefox cases, zero expected, skipped
or flaky. Decoding all four inline `native-focus-lifecycle` attachments confirms
BODY at `retry:removed-pending-visible`, the initial/current List identity 2,
Last page at the end, and zero dropped diagnostic records. The review records
enabled tabindex-0 List, no blocked ancestry or overlays, document focus and
bubbling Tab keydown defaultPrevented false. The old forward-only loop runs past
the removed Retry position and relies on wrapping to the earlier toolbar. These
facts support driver correction, not a Firefox/React Aria runtime defect.
Predecessor reports and raw red results remain retained and unchanged.

## Meaningful changed behavior

`tabTo` chooses backwards traversal when its connected target precedes the active
element in DOM order, otherwise forward traversal. Initial BODY/document focus
uses forward traversal. The Retry-removal return explicitly chooses backwards
when BODY obscures the browser's retained sequential starting point. It sends
real `Shift+Tab`, or `Alt+Shift+Tab` for WebKit's existing native modifier convention.
Each invocation keeps one direction and the original total bound of 50 presses;
there is no added retry, second sweep or forward-wrap assumption.

The observer still captures trusted native events, focus lifecycle, identities,
connection, prevention, ancestry, geometry, status, overlays and scope markers.
Traversal start/post-key labels now also carry direction and the exact key chord.
No focus/scroll injection, DOM/tabindex mutation or fixture/runtime changes occur.
Every actual target-focus, full-bounds/clipping/hit/indicator, selected state,
status/busy, accepted page/view/request, runtime-error and shell coherence assertion
is preserved. Native keyboard focus must reveal the earlier toolbar on enlarged
text; this correction does not pre-clear a geometry or product defect that a fresh
run could expose. Subsequent assertions remain unverified until executed.

## Validation and frozen handoff

`git diff --check` passed for the prepared change. Changed-file ownership and the
complete diff were reviewed against the two-path dispatch.

All installs, unit/composed tests, source/browser typechecks, guards, builds,
Storybook and Chromium/Firefox/WebKit runs are **UNRUN** by dispatch instruction.
No slots, queue, state, CI, merge, push or publish operations were performed.
The coordinator owns meaningful changed-byte supported checks and fresh native
proof on a reviewed clean frozen candidate. Prioritize all four Firefox cases
and retain supported companion-engine evidence. Any resulting focus visibility,
status or state failure requires separate classification and bounded ownership;
no parent M-17/U-07 or broad G/U/X/R/Z gate is closed here.

Exact Conventional Commit history, final head and both changed-file hashes are
provided in the completion handoff to avoid self-referential report receipts.
