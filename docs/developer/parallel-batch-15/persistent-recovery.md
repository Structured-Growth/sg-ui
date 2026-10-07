# Batch 15 persistent-state changed-state story and native evidence

Reserved follow-up to [PR80](https://github.com/Structured-Growth/sg-ui/pull/80)
and the [exact-head review](../parallel-batch-14/review-runtime.md). This is a
bounded H-16/X-16 evidence slice; it does not close broad acceptance tasks.

## Isolation and ownership

Exact reviewed dev baseline: `acaa213cc50b9a06b57090b9313479a90627498d`.
Managed worktree created and attached before any edit:
`/Users/thomashall/.codex/worktrees/batch15-persistent-recovery/sg-ui`.
Branch: `codex/batch15-persistent-recovery`.

Exclusive changes: `src/hooks/usePersistentState.stories.tsx`,
`tests/browser/batch15-persistent-recovery.spec.ts`, and this report.
Hook implementation, existing hook tests, pagination, shared guides, browser
config/pool, workflows and other checkouts remain read-only. Read the PR80
[worker report](../parallel-batch-13/persistent-state.md), exact-head review,
[development validation](../react-aria-development-validation.md) and
[pool protocol](../react-aria-parallel-browser-validation.md).
The baseline already contains the reviewed implementation and approved harness.
No independent prerequisite merge or harness edits are necessary.

## Changed-state story and proposed native cases

`Hooks/Persistent state/Quota recovery` renders local and session groups
simultaneously. Each group has two opt-in same-key consumers, a distinct-key
consumer and two independent memory-only consumers using the same key.
Host buttons seed saved 3, inject quota failure, set fallback 5, recover writes,
then request already-saved 3. Visible saved bytes, successful write counts and
failed write counts expose whether recovery updates both consumers without a
redundant write. Peer functional increments and unmount/remount are interactive.

The story intercepts `Storage.prototype.setItem` for the exact demo key and
selected native storage object, throws an injected `QuotaExceededError`, and
restores the original descriptor on story unmount. It does not fill real browser
capacity or change production storage policy. Other keys use the native method.
Story labels are host demonstration data, not new library-owned messages.

Two focused browser cases are prepared:

1. Native clicks exercise saved 3 → injected failed 5 → recovery to 3 for both
   local/session groups, asserting both consumers, unchanged successful writes,
   peer functional update to persisted 4, peer remount, distinct-key isolation,
   cross-storage isolation and independent memory-only updates.
2. A genuine second page in the same browser context writes local storage through
   the story. The first page's fallback 5 is retired by the browser's native
   storage event and both first-page views display saved 4. The second page's
   session write remains isolated from the first page's session views.

Same-document notification in case 1 is distinct from native cross-page local
storage in case 2. No synthetic StorageEvent is dispatched. No cross-tab session
synchronization, actual capacity exhaustion, durable fallback across reload,
physical device or assistive-technology behavior is claimed.

## Targeted preparation validation

Runtime: Node 24.21.0 via existing `/tmp/sgui-run24.mjs`, pnpm 10.29.3,
TypeScript 5.9.3, Storybook 10.6.1, Playwright 1.63.0, React 19.2.3.

Passed:

- `pnpm install --frozen-lockfile` (lockfile unchanged; reused 608 packages,
  downloaded zero).
- `pnpm typecheck` on final story content.
- `pnpm exec tsc --noEmit -p tests/browser/tsconfig.json`.
- `pnpm foundations:check`.
- `pnpm exec playwright test tests/browser/batch15-persistent-recovery.spec.ts --project=chromium --list`
  (two discovered cases; discovery is not execution).
- `git diff --check`.

Logs: `/tmp/batch15-persistent-{install,types,browser-types,foundations,list}.log`.
Installation used one atomic owned slot beneath `/tmp/sgui-install-slots`
(limit 2); lightweight jobs used at most two simultaneous owned slots beneath
`/tmp/sgui-light-validation-slots` (limit 4). Each subprocess released only its
matching owner token in a finally block. The first jobs used `slot-<n>` names;
read-only inspection showed both slot roots empty after completion, and discovery
used the existing `slot<n>` convention. No occupied foreign slot was removed.
No global browser/heavy lock or queue entry was claimed or modified.
No source change or redundant rerun of the previously reviewed hook tests.

## Frozen coordinator handoff and native outcome

Committed head, draft PR and clean status are supplied in the coordinator handoff
because the report cannot embed its own commit hash. Pool plan arguments:

```json
["tests/browser/batch15-persistent-recovery.spec.ts", "--project=chromium"]
```

Status: prepared, committed and frozen for a coordinator-supervised fresh build,
browser typecheck and focused native run using the approved maximum-two pool.
Required native validation remains queued; no browser execution/pass is claimed
by this preparation report. The existing queue and other workers are preserved.
Do not mutate this worktree while its pool run is active. After the coordinator
supplies evidence, record exact tested head, engine, case results and immutable
build hash before treating native evidence as complete.

No full suites, full checkpoint, packed-consumer runs, GitHub CI/title dispatch,
unchanged Firefox retry, merge/main push, publication, permissions/secrets change,
or manual/device/assistive-technology closure.
