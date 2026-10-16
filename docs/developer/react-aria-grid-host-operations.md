# Host-owned grid mutations

AppDataGrid's `rowDrag.onReorder` and row-menu `onPress(row)` request host work.
Neither callback promises persistence or handles rejection. Keep rows controlled by
the host; never interpret the grid's “Move requested” announcement as a saved result.
The host translates messages, handles permissions and requests, and decides whether
selection IDs for removed/off-page rows should remain selected. The grid preserves
ID-based selection; disappearance alone is not a delete confirmation.

The source-backed private native fixture
`apps/docs/native-fixtures/scenarios/components/AppDataGridShell/GridHostOperations.fixture.tsx`
shows the same host adapter for row-menu rename and row reorder, plus two independent
views with colliding IDs. `gridHostOperation.ts` is a consumer example, not a public
library export. It accepts an async save callback returning authoritative rows.
The deferred transport reuses the existing server-response-race fixture and deliberately
settles aborted work to exercise lifecycle guards.

Each requested snapshot has an operation ID and AbortSignal. A new request invalidates
the previous one before publishing its optimistic snapshot. Only the latest active
response can publish rows, saved status or errors. On current failure, restore the
last confirmed snapshot, show an explicit error, and keep the attempted snapshot for
Retry. Retry creates a fresh operation. Cancel aborts and restores confirmed rows;
replacement aborts and installs the new authoritative snapshot. Unmount cancels before
late settlement. A canceled or replaced response must never publish “Changes saved”.
Controllers and subscriptions belong to each mounted host; they do not share view state.

This sample submits whole snapshots. A superseding snapshot intentionally includes
any optimistic content the host chose to carry forward. For granular updates, rebase
pending operations by entity/revision rather than treating them as whole snapshots.
AbortSignal and client sequence guards protect client display only: they cannot undo
a server write. Real persistence must enforce revisions/idempotency or serialize
writes, and must refetch/reconcile after ambiguous cancellation, network failure or
server conflict. Never promise a server rollback merely because the UI restored rows.

The fixture's host toolbar exposes Cancel, Retry and Replace. Sorting/filtering and
pagination continue to follow the grid's existing complete-page reorder boundary.
It deliberately leaves the grid's own busy/error data-loading states separate from
mutation feedback, allowing a superseding mutation to exercise the race guard.
Production hosts may disable mutation controls while saving instead.

Validation boundaries: the pure controller checks verify promise settlement and
snapshot ownership; the browser successor spec verifies rendered row actions,
rollback/retry, reorder cancel and view independence. Neither establishes spoken
screen-reader timing. Record that separately alongside the status/loading/Retry
and native keyboard/focus fixtures. No two-grid scenario is added to the public
processing-grid component page.
