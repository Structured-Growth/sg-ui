# Batch 117: current G-25–G-29 acceptance evidence

Reviewed baseline: `e43bf604be74e0daf731bc990e6c3097f05ed89b` (`codex/dev`),
2026-10-07. Isolated managed worktree:
`/Users/thomashall/.codex/worktrees/batch-117-evidence/sg-ui`;
branch `codex/batch-117-acceptance-evidence`.
Only this report and the optional new native spec are edited. Source, shared
configuration, master acceptance and ledgers remain read-only. The coordinator
alone accepts criteria and integrates. This is a fresh review of the five parent
criteria, not a repeat of M-row inventory acceptance or a new full source audit.

## Per-ID matrix

| ID | Disposition at reviewed head | Concrete evidence and remaining gate |
| --- | --- | --- |
| G-25 | Fully supported for the stated prototype/ownership criterion by current source and contracts; no new runtime certification | [Engine decision](../react-aria-grid-decision.md) maps each state/event owner. [Model](../../../src/components/AppDataGrid/ownedGridModel.ts) filters before TanStack sorting/page processing, maps owned field/direction to internal id/desc and page/pageSize to pageIndex/pageSize, returns original rows/stable IDs, bypasses client processing in server mode. [Interaction](../../../src/components/AppDataGrid/ownedGridInteraction.tsx) passes controlled selectedKeys from owned IDs; React Aria sort requests dispatch through the owned sort transaction. TanStack is created with sorting/pagination only, with no second selection model. [State](../../../src/components/AppDataGrid/ownedGridState.ts) is the transaction authority; React Aria's single descriptor reflects primary sort, not a competing sort store. The combined prototype and public renderer exist. Virtualization is explicitly disabled/deferred. Colocated proof tests exist but were not run here; broad runtime/AT/performance gates are separate. |
| G-26 | Fully supported as a documentation/extension-strategy criterion | [Capability matrix](../react-aria-grid-contracts.md#required-capability-matrix) distinguishes required parity from deferred true pinning, virtualization, grouped headers, expansion/editing and future spreadsheet capabilities. [Architecture](../react-aria-architecture.md) places specialist grid/editor/learning extensions above shared controls, permits owned slots/render callbacks only for demonstrated needs, and requires observable-test preservation for engine swaps. [Current integration](../react-aria-catalog-grid.md) exposes explicit columns/custom cells/native slots rather than catch-all enterprise-engine props. Strategy: preserve owned contracts, add deliberate specialist capabilities, establish workload/measurement/focus/position semantics before virtualization, and separately approve larger package/engine changes. Neither the decision nor guide promises a complete enterprise grid. Implementing deferred features is not a condition for this documentation criterion. |
| G-27 | Partial: current source and migration/removal ordering supported; generated exact-head gate outstanding | Public types alias owned presentation/model records; helpers and parts use owned callbacks. [Package guard](../../../scripts/check-package.mjs) recursively audits grid declarations and root/barrel/granular exports and rejects upstream types plus retired emitted implementation; [foundation guard](../../../scripts/check-foundations.mjs) audits migrated directories/transitive dependencies. Git ancestry confirms public grid integration `fa73abd805e9a020113801f9821c8376ec376d68` and reorder `d5f16eebc31920a05dce860598119b002bce7469` precede final theme/dependency removal `57abb6df848c424a39c7f4942ad25484926eee0e`; all are baseline ancestors. This proves implementation ordering, not completion of runtime acceptance before removal. No `dist` or tarball exists in this fresh worktree; generated declarations at this head are UNVERIFIED. Historical packaging/removal reports are not current tarball proof. Coordinator must retain an exact-candidate fresh build/package/declaration result and packed consumer API evidence; broad G/Z acceptance and legal references are not waived. |
| G-28 | Partial: reorder cancellation/optimistic rollback defined and represented; wider host row-action failure acceptance outstanding | [Reorder contract](../react-aria-grid-reorder.md) assigns snapshot/optimistic update/pending lock/error/rollback/stale-response handling to host. Interaction emits an immutable source/target request only for a valid complete-page boundary; cancellation emits no request. [Strict Mode story](../../../src/components/AppDataGridRowDnd/DataGridDragHandle.stories.tsx) snapshots previous rows, applies optimistic order, disables while pending, restores snapshot and reports failure. Existing keyboard/native-pointer/Move specs assert cancel, commit and rollback; historical native results have artifact limitations below. [Menu actions](../../../src/components/AppDataGrid/ownedGridColumns.ts) expose host pending/disabled/onPress, and cells suppress unavailable callbacks. Arbitrary host row action persistence/cancel/error reconciliation is not implemented by this presentation library. No current native fixture proves failing asynchronous menu/delete action reconciliation; production-network races and physical/AT cancellation remain outside retained proof. Batch82 establishes only host response identity/lifetime behavior, not reorder/menu persistence. |
| G-29 | Partial: policy and representative focus/scroll behavior supported; selected-disappearance native gap prepared UNRUN | [Focus contract](../react-aria-grid-contracts.md#persistence-focus-and-implementation-sequence) defines stable row/field retention, equivalent control/grid-entry fallback, page entry, refresh scroll retention and outside-focus ownership. Current interaction resets both scroll axes on accepted page/page-size change, repairs removed/hidden controls with preventScroll, and clears stale ownership on host blur. [Unit source](../../../src/components/AppDataGrid/ownedGridInteraction.test.tsx) covers disappearing selected row without pruning IDs, hidden-field scroll, page-size reset and independent focus. [Existing native spec](../../../tests/browser/batch01-grid-focus.spec.ts) covers refresh, hidden column, focused-row deletion, page changes, empty results and two grids, but does not combine selected-row deletion with independent selected state. New [batch117 spec](../../../tests/browser/acceptance-pack-117.spec.ts) adds precisely that combination using the existing deterministic FocusRetention story; UNRUN, including TypeScript. Host permanent-deletion selection reconciliation remains explicit, rather than silently pruning temporarily absent IDs. Exact-head three-engine evidence, broader custom widgets/host transitions, device and AT behavior remain open. |

“Fully supported” above is a narrow source/document conclusion for the literal
G-25/G-26 criterion, not authorization to mark the whole grid or broad G/U/X/R/Z
acceptance complete. Historical preparatory sections of grid contracts retain
phrases such as “not yet exported”; current public source/integration and Git
history establish today's ownership. No central guidance rewrite is attempted.

## Exact source identity

All blobs below are resolved with `git rev-parse <baseline>:<path>` at the reviewed
head. They permit independent byte-level retrieval without relying on test names
or old migration checkbox status.

| Path | Git blob |
| --- | --- |
| `docs/developer/react-aria-grid-decision.md` | `cf388695dc6ef491bbf64145ceb89bc570a4dd1f` |
| `docs/developer/react-aria-grid-contracts.md` | `a5bf300a3b1e31f8afdd208583d8d6f652f70fc9` |
| `docs/developer/react-aria-architecture.md` | `66280bea05b7f70b0e1bcc9e4b2388add91de97a` |
| `docs/developer/react-aria-catalog-grid.md` | `58c59e7e56139e470d13c5f759e23d918dc913e1` |
| `docs/developer/react-aria-grid-reorder.md` | `3445832ddfab6baeb6022c5e94a05203dd1662db` |
| `src/components/AppDataGrid/ownedGridModel.ts` | `9aec70184dc15e297f247647a67b6667d6bb0051` |
| `src/components/AppDataGrid/ownedGridState.ts` | `9ef583ee584e484ef148952e6531a48635929073` |
| `src/components/AppDataGrid/ownedGridInteraction.tsx` | `c44cfd77b60afb1ad970351e6aaa9c34feb15473` |
| `src/components/AppDataGrid/types.ts` | `aa61aad90e0d22b1f75addbf4b01c5fec63a5db7` |
| `src/components/AppDataGrid/ownedGridColumns.ts` | `5c5ae8541622c9689db5ed74d5eaf1c1c5f8f18d` |
| `src/components/AppDataGrid/ownedGridInteraction.test.tsx` | `be176a8904128022e0d962dff6def28c1596522d` |
| `src/components/AppDataGrid/ownedGridInteraction.stories.tsx` | `67d692fca66699078cafd4a352d898b393a0acc2` |
| `tests/browser/batch01-grid-focus.spec.ts` | `ce2134a4dac2c6f1049c41982a14c2eaa1d490ff` |
| `src/components/AppDataGridRowDnd/DataGridDragHandle.stories.tsx` | `8dc7d48e36d0cdd550ffb564c24f4a340b7412a8` |
| `tests/browser/batch01-grid-reorder.spec.ts` | `eeca05b54067ec5526fd5fce44c0de7ed3cef68e` |
| `tests/browser/reorder.spec.ts` | `2449eb6339a6bf5eb9c1d193fe0ad3cc5d9acc91` |
| `src/components/AppDataGridShell/AppDataGridShell.server-response-races.stories.tsx` | `e2ba12cdf482d1e845e89147173cc1752ea1ece0` |
| `src/components/AppDataGridShell/AppDataGridShell.server-response-races.test.tsx` | `3924a9a12500e757e76914cc9d2e1a6ce72993d2` |
| `tests/browser/grid-server-response-races.spec.ts` | `ed14dfaca40596eb27bec1aee10683131529a414` |
| `scripts/check-package.mjs` | `744f86595899989d90edc6cf590a757534c58f17` |
| `scripts/check-foundations.mjs` | `ecc96a852355231cc7845642c589980825a6356d` |
| `scripts/test-foundation-consumer.mjs` | `ff994cb7c9eaae3fbab58461c98ab0269a276c9c` |
| `package.json` | `f83bab2065c9ae79b31aa6b0aa143b7ae0b2a3f0` |

## Retained runtime evidence inspected, with attribution limits

[Batch01 focus report](../parallel-batch-01/grid-focus.md) records source commit
`60450cbe120111804d45c9004a1358bcebffccab`, final native spec commit
`39151928713a83f86785e15068b1df6a96cdb71b`, 10 Chromium/WebKit cases on Node
26.5.0/React 19.2.3, and Firefox launch failure before execution. Its recorded
`/Users/thomashall/.codex/worktrees/batch01-grid-focus/sg-ui/artifacts/browser-results.json`
is **absent** at inspection. The report survives in Git; raw current-head
focus/scroll evidence does not follow from it.

[Batch01 reorder report](../parallel-batch-01/grid-reorder.md) records
`4fbab81aa4b992e6dff475b98ec0f3a4d06b9a5d`, 16 Chromium/WebKit cases on Node
26.5.0/React 19.2.3, Firefox launch blockage, and limitations for physical
long-press, spoken AT, cross-grid cancellation, dataset invalidation and production
network races. Its recorded worktree's `artifacts/browser-results.json` is also
**absent**. The worker's final spec/report head is not fully identified by that
implementation SHA, so no exact native head is inferred beyond the report.

[Batch82 report](../parallel-batch-82/grid-server-response-races.md) has retained
raw evidence. This review read both JSON files, recomputed their SHA-256 hashes,
and compared the story, composed test and native spec bytes against the candidate
worktree and recorded frozen hashes. All three match current baseline bytes:

| File | SHA-256 |
| --- | --- |
| Server-response story | `0a96afb5d03369b77eb05ce5bb01ace549f4dcd3f997f17244c5fd76586bafc4` |
| Composed test | `343a2475f2bbb457f0508b5ced3103170641c8f20af5736ca741af4917d32fbb` |
| Native spec | `d7ac446ee4c9944d9588642326062b70218fac101fc3accb3989ca124fd8c098` |

Retained root:
`/Users/thomashall/.codex/worktrees/batch80-83-native-candidate/sg-ui/artifacts/browser-pool/df2bc745-5e76-4922-80ae-03c3ccaa0f51`.

- `evidence.json`: SHA-256 `0736e26daa7dd399c3234b5bbb3be7ea7b41e05ec4deb1b04d6ad55ba6ddbb38`.
  Tested candidate `7248a80d79eb50a59a2e18b7bf461f8e9d26897c`, Node `v24.21.0`,
  fresh Storybook build and browser TypeScript commands recorded. Source digest
  `74870b26ee17638871a0f7dd0d020d6521d5f1554c6feab8ea2204eeebe28680`, build digest
  `1fcc9f4a6330e7ac18bedc92715525e8d05de622679281919306bc48b7178b61`.
- `batch82/results.json`: SHA-256
  `b9033c14c1e4795ff6ba68549b9cb398697c4d634c97462aeeb67426ecb20b9d`;
  seven expected, zero skipped/unexpected/flaky, no report errors; Chromium only.
  Root lifecycle identifies batch82 passed, slot 2, port 6275. Other shards failed:
  the overall snapshot status is **failed** and is not accepted as a whole.
- `/tmp/sgui-wave41-native-attribution.json` exists, SHA-256
  `a454cdd08a44750a56bc0c473579b929685c7a039923ab30f5fb10b1a2b60516`;
  report attributes fixture/test head `364242198e1224bd949386288dc821aaaa12ca52`.

Matching fixture bytes does not make the complete current implementation identical
to the tested candidate. This is retained, precisely attributed historical
Chromium host-response evidence, not an all-engine run at `e43bf604`.
No physical device, browser chrome zoom or spoken assistive-technology result was
inspected or established. Host transport cancellation, persistence, permanent
selection reconciliation and asset/network policy remain host-owned.

Generated package evidence is historical only: [packaging report](../parallel-batch-01/packaging.md)
identifies short implementation head `6ec39e6`, Node 24.21/TypeScript 5.9.3,
React 18/19 consumers and `skipLibCheck`; [removal audit](../react-aria-removal-audit.md)
explicitly labels its tarball prior-artifact evidence. This assignment neither
locates a final baseline tarball nor executes declaration checks. Legal/historical
references remain preserved and separate from implementation removal.

## Actual checks performed and coordinator handoff

Read README, migration/component architecture, assigned criteria and relevant
owned grid source/contracts/specs. Read Git status/head/ref, histories and ancestry;
resolved the source blobs above. A focused literal search found no upstream or
retired engine strings in public grid types/column contracts/four component barrels;
it is not a transitive or generated-code audit. Read raw retained JSON and
recomputed hashes using Python standard-library file reads only. Verified report
relative links and `git diff --check`. No install, unit test, typecheck, build,
pack, browser, performance, pool/global lease or CI command was run in this assignment.

The optional new spec is **UNRUN** and requests the coordinator's native window.
It selects Course 8 in the first grid and Course 2 in the second, deletes the
focused selected first-grid row using the story's host keyboard shortcut, and
checks surviving same-field body entry plus unchanged independent selected data.
Initial collection-cell focus follows the existing fixture setup; no repair is
injected after deletion, no timing sleeps, forced clicks or production/new story
changes are introduced. It attaches native state and checks runtime diagnostics.
It does not prove retention/reconciliation of an absent first-grid ID through
restoration; that policy is represented by existing unit source, not this fixture.

Coordinator-only focused window: browser-spec TypeScript check, fresh frozen
Storybook, then `acceptance-pack-117.spec.ts` in Chromium/Firefox/WebKit with exact
candidate/head/build/result attribution. Reuse existing batch01 focus/reorder and
server-response specs when refreshing lost or stale evidence; do not invent
new duplicates. G-27 needs a fresh candidate build/package/declaration guard and
packed React 18/19 API result. Wider host menu/delete persistence requires a
separate host-fixture assignment; minimal potential fixture allowlist is a new
`src/components/AppDataGrid/AppDataGrid.row-action-lifetime.stories.tsx`, matching
colocated composed test and one native spec, with production files excluded until
a reproducible defect exists. No actual missing production behavior was found;
there is no exclusive production-source fix allowlist to reserve.

All five parent checkboxes and broad acceptance remain coordinator-owned and
unchanged. Report readiness is not validation readiness for the unrun spec.
