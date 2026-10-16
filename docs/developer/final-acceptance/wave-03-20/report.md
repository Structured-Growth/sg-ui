# Wave 03-20 — grid host mutations and focused acceptance successors

Prepared a **six-file, ready-to-apply patch** with a working public AppDataGrid
host-mutation fixture, reusable optimistic controller, focused browser tests and
consumer guidance. All writes are confined to this evidence directory. No patch
was applied to the shared checkout. All six assigned original leaves remain
**partial** pending their named integration/native/AT evidence; no central counts
or checkboxes changed.

## Concrete delivery

[grid-successors.patch](grid-successors.patch) contains:

- A host-owned generic controller with operation IDs, AbortSignal, latest-response
  guards, confirmed-state rollback, explicit error/retry, cancel and replacement.
  Idle cleanup is silent for Strict Mode effect replay. Late success or failure
  cannot publish saved/error state after supersession, cancel, replacement or
  unmount cleanup. Independent controllers do not share rows or pending state.
- `GridHostOperations.fixture.tsx`, using public package imports and the existing
  server-response-races deferred transport. Row-menu rename and reorder share the
  adapter. Resolve/reject controls deliberately allow aborted requests to settle;
  two hosts with colliding row IDs permit independent operation review. This stays
  in the private native host; the public processing-grid page remains unchanged.
- Three targeted browser cases: genuine Tab/Shift+Tab entry from an external host
  button; selected focused row removal with field focus and both scroll axes plus
  independent sibling selection/scroll; rendered reorder and row-menu optimistic
  failure/retry/cancel. These cases are **unrun**, not browser acceptance receipts.
- A guide explaining client versus server mutation ownership, whole-snapshot
  supersession, revision/idempotency requirements and ambiguous cancellation.
  A link is proposed in the existing grid contract guide.

The controller's pure promise/snapshot checks pass under **Node v24.19.0** (three
meaningful cases), including latest failure followed by obsolete success, latest
success followed by obsolete rejection, retry of the attempted order, synchronous
transport failure, cancellation/replacement/unmount and sibling ownership.
[host-operation-node24.txt](host-operation-node24.txt) preserves exact traces.
This is host logic execution, not a React/native/AT test. The helper initially
failed from a wrong module base; [bootstrap-failure.txt](bootstrap-failure.txt)
records the diagnostic summary and correction. Its earlier Node26 run is retained
separately and is not the final supported-runtime receipt.

[check-proposed-types.mjs](check-proposed-types.mjs) overlays proposed files in
memory at their intended paths. Three fixture/helper roots and the browser spec
have zero diagnostics against current built public types under Node24.19:
[receipt](proposed-types-node24.txt). The first browser type lookup failed because
the checker used repository cwd; the unchanged original diagnostic is retained in
[proposed-types-first-failure.txt](proposed-types-first-failure.txt). Setting the
owning workspace cwd/config path corrected the checker; no tsconfig or dependency
was changed. `git apply --check` passed; patch contents were not applied.

## Evidence reconciliation

[input-evidence.json](input-evidence.json) records exact source/target/output
hashes at modified `dev` HEAD `540f47d4059a9cea8890b80927f34f51ef2fbc3e`.
Of130 wave02-10 inputs,122 match and eight differ: four maintained acceptance
receipts and the two reserved-ID validators plus their two tests. The implementation
changes are the accepted BUG-0012/GRID-R1 fix, not a newly open defect. Reuse
[fix-10](../fix-10/results.json), its123 grid unit cases and the coordinator's
build/package validation. No reserved-ID regression was rerun.

All **1,778 library output files** and **292 private fixture output files** match
[coordinator integration](../coordinator-integration/evidence.json). This identifies
the current pre-patch built artifacts; it does not prove those artifacts execute
the proposed fixtures. Earlier source/fixture/native receipts retain their original
host/engine limits. Unchanged grid/cell unit inputs retain FA-04 evidence. Historical
Firefox pre-page failures remain failures, not implicit new Firefox passes.

## Per-original-leaf result

| Leaf | Result and delivered successor | Required evidence remaining |
| --- | --- | --- |
| A-M-16 | Partial. GRID-R1 is resolved; F-C16/T-C16 maps in `parallel-next100/next100-c16.md` and accepted V-C16 receipts at `backlog-execution-2026-10-15.md:720–765` / `react-aria-hardening-execution.md:133–144` are retained. | Reconcile all required G gates through their owners. This patch does not establish performance, physical touch or broad AT acceptance. |
| A-G-15 | Partial. Existing statuses, busy lifecycle, Retry and row-subheader working fixtures retained; concrete operator sequence supplied. | Actual speech and focus through initial empty loading, retained refresh success/error, no-results, Retry disappearance and section actions. Busy markup alone is insufficient. |
| A-G-16 | Partial. New native Tab/Shift+Tab test removes programmatic cell seeding from the entry assertion. Existing arrow and nested-action tests retained. | Integrate/build/execute new case; record table-versus-grid roles and navigation with an AT operator. |
| A-G-21 | Partial. Existing escaped text/JSON, dates, image fallback and clipboard fixtures/units retained; current gaps isolated. Parallel13 custom-router receipt is one Chromium slice, not a current composed cell matrix. | Recover or execute missing Firefox/current-host clipboard and adapter cases; actual independent copy speech. Native permission policy remains distinct from mocked API rejection. |
| A-G-28 | Partial. Concrete reusable host controller, working rename/reorder fixture and pure runtime regressions delivered. | Coordinator integration and rendered native test. A real server must enforce revision/idempotency/serialization and reconcile ambiguous cancellation; UI rollback cannot undo a write. Spoken requested/saved/canceled feedback remains unobserved. |
| A-G-29 | Partial. Selected-row disappearance test added; existing refresh/hidden column/page/size/Retry/sibling focus specs retained. | Execute added case and recover exact prior engine/host receipts; fill only uncovered transition/engine combinations. Verify both native axes and active row/field/control. |

[results.json](results.json) retains each full original requirement, per-leaf
outcome, successors, evidence and execution limits. [validation-plan.json](validation-plan.json)
provides exact build/native selections and coordinator prerequisites;
[operator-review.md](operator-review.md) supplies the remaining observed-speech
worksheet. No new install, build, server, browser suite, full matrix, Git mutation,
conversation, subagent or external message was initiated. Personal workspace state
and server3000 were untouched.
