# Client dataset shrink — G-05/H-16 partial

Baseline: `f1e5e457ce6240022ca07d6336ea06c5b67c917c` (verified before edits).
Managed worktree: `/Users/thomashall/.codex/worktrees/batch14-client-page-shrink/sg-ui`.
Branch: `codex/batch14-client-page-shrink`.
Code/test/story head: `3d4b9df15236bf30fbb3c6f0b2ec0e3d7384506c`.
Draft [PR 87](https://github.com/Structured-Growth/sg-ui/pull/87), base `codex/dev`.
The report commit follows the tested code head; exact final PR head must be recorded
by the reviewer/coordinator. No exact-head review decision has been received.

## Scope and contract

Read the [PR38 page-shrink record](../parallel-batch-11/grid-page-shrink.md),
[review decision](../parallel-batch-13/review-1.md),
[catalog integration](../react-aria-catalog-grid.md),
[grid contracts](../react-aria-grid-contracts.md) and
[canonical master IDs](../react-aria-master-task-list.md).
G-05 and H-16 remain open. This fixes the reproduced client mismatch; server async
and broader state/native/device/assistive-technology acceptance are not closed.

Exclusive write allowlist:

- `src/components/AppDataGrid/ownedGridModel.ts`
- `src/components/AppDataGrid/ownedGridModel.test.ts`
- `src/components/AppDataGrid/AppDataGrid.tsx`
- `src/components/AppDataGrid/AppDataGrid.test.tsx`
- `src/components/AppDataGrid/AppDataGrid.stories.tsx`
- `src/components/AppDataGridShell/`
- `tests/browser/batch14-client-page-shrink.spec.ts`
- `docs/developer/parallel-batch-14/client-page-shrink.md`

No controller/state/interaction/parts, sorting toolbar, persistence hook, config,
workflow, central checklist or licensing changes. No merges, main changes, publish,
credential access or CI/title dispatch/rerun. Source refs and owned APIs preserved.

Client processing now slices at the last available page after search/filtering,
then uses the same bound for next-page availability. The returned processor
`paginationModel` remains **requested criteria**; it is not automatic host acceptance.
The footer's existing display normalization uses that same complete client total.
Page 3 / size 10, replaced 41 → 11 rows, displays row 11 and `11-11 of 11` with
requested page 3 retained. Zero rows display an empty dataset without requesting a
correction; restoring 41 rows again displays requested page 3.

Explicit public grid and shell client pagination requests use the computed filtered
total through the existing transaction builder. Host `rowCount`/`hasNextPage` server
hints do not constrain a complete client dataset. Locally owned pagination accepts
requests; controlled pagination retains the host value on rejection. Pagination
callbacks still precede one combined snapshot. Selection retains absent IDs and
selection callbacks do not run on replacement. Criteria transactions retain their
existing reset behavior. Server rows and known/unknown totals remain unchanged;
loaded server rows are never treated as a complete total.

The ClientDatasetShrink stories expose shrink/empty/restore, requested-state status,
last request and host accept/reject controls; shell also supports list/cards.
Story labels are host-supplied demo strings, not new library-owned strings.

## Validation

Node `24.21.0` (commands via `/tmp/sgui-run24.mjs`, host shell Node `26.5.0`),
pnpm `10.29.3`, Vitest `4.1.11`, React `19.2.3`.
Install and light runs used atomic slot directories, unique owner tokens and finally
cleanup under `/tmp/sgui-install-slots` (2 capacity) and
`/tmp/sgui-light-validation-slots` (4 capacity), respectively.
All Vitest runs used `--maxWorkers=1`.

Commands below prefix `node /tmp/sgui-run24.mjs`; the light wrapper
`python3 /tmp/sgui-batch14-shrink-light.py` adds slot ownership around that command.

- `install --frozen-lockfile`: passed, no manifest/lockfile change.
- Regression-first `exec vitest run src/components/AppDataGrid/ownedGridModel.test.ts src/components/AppDataGrid/AppDataGrid.test.tsx src/components/AppDataGridShell/AppDataGridShell.test.tsx --maxWorkers=1`: **7 failed / 71 passed**, reproducing empty public slices and processor slicing. Log `/tmp/sgui-batch14-shrink-red.log`.
- First fix run additionally included `ownedGridPageShrink.test.tsx`: 79 passed / 2 failed. The two existing date cases expected an empty out-of-range page; updated the allowed model tests for the deliberate bounded display semantics, retaining full filtered-row assertions.
- Final `exec vitest run src/components/AppDataGrid/ownedGridModel.test.ts src/components/AppDataGrid/AppDataGrid.test.tsx src/components/AppDataGridShell/AppDataGridShell.test.tsx src/components/AppDataGrid/ownedGridPageShrink.test.tsx src/components/AppDataGrid/ownedGridController.test.ts src/components/AppDataGrid/ownedGridState.test.ts src/components/CardPaginationFooter/CardPaginationFooter.test.tsx --maxWorkers=1`: **120 passed / 7 files**, 11 added cases. Log `/tmp/sgui-batch14-shrink-final-unit.log`.
- `typecheck`: passed; log `/tmp/sgui-batch14-shrink-types.log`.
- `foundations:check`: passed; log `/tmp/sgui-batch14-shrink-foundations.log`.
- `tokens:check`: passed; log `/tmp/sgui-batch14-shrink-tokens.log`.
- `exec playwright test tests/browser/batch14-client-page-shrink.spec.ts --list`: passed discovery of 9 cases (3 surfaces × 3 engines). **Discovery is not browser execution**. Log `/tmp/sgui-batch14-shrink-browser-list.log`.
- `git diff --check`: passed.

## Required pending evidence and reserved work

Fresh focused native execution is **pending**. Test source covers grid/list/cards
coherent shrink display, no replacement callback or focus theft, rejected requests,
accepted footer page-entry focus and grid/list scroll reset. This task changed rows
rendered after replacement, so native evidence must run before runtime acceptance.
The shared heavy lock is retained, observed owner
`browser-pool:3811:71c380ac-cbe0-4eb4-9963-5aa552036028`; the existing priority queue
was not altered. Browser pool proof/review is pending. Required fresh Storybook
build and Chromium/WebKit focused execution were requested from coordinator chat
`01a1164f-41db-7f30-aaf9-f20133b6566f`; no config/harness copy, lock theft, queue
bypass or unchanged Firefox retry occurred. Busy resources do not establish completion.

Reserve focused native execution and exact-head review/integration for the
coordinator's authorized resource slot. Broader cards scroll behavior, physical-device
behavior, assistive-technology output, whole grid acceptance, full checkpoint and
packed React 18/19 matrices remain outside this slice. Consumer contract/checklist
updates outside the allowlist belong to the coordinator. No broad acceptance upgrade.

## Recovery and native failure diagnosis (2026-10-07)

The original directory was unavailable (coordinator verified ENOENT). One managed
recovery restored exact saved head `ad7a1f5f82b9faad1778dd6733d4cf3e0ed68e1b` at
`/Users/thomashall/.codex/worktrees/batch14-client-page-shrink-recovery/sg-ui`.
Coordinator-authorized full-history harness merge of
`6b9da4423f1e6675c37571d5552474da25e90258` produced clean frozen head
`08300af7074f5958d0583128c2860cf25497c798`. SHA-256 verification established all
10 task source/spec/report files unchanged. Node24 frozen install passed using
canonical atomic install slot ownership/finally cleanup. PR87/history retained.

Coordinator's seventeenth native wave ran the unchanged focused spec against a
fresh immutable build at exact `08300af7074f5958d0583128c2860cf25497c798`:
**2 Chromium passed / 1 failed**. Grid and cards passed; shell list failed at
spec line 30, expecting grid-container scrollTop 0 after accepted page entry,
receiving 35. This is an incomplete native result, not a passing suite.
Retained run `artifacts/browser-pool/e5c807a8-3714-4175-9fb7-ee2610bbe5f2/`
contains evidence.json, browser.log, results.json, failure screenshot and trace.
No original native assertion was weakened or removed.

Trace/test progression establishes accepted requested page 0, focused first cell
and correct `1-10 of 11` display before the scroll failure. The screenshot shows
the table header partially scrolled out of view while the focused first row remains
visible in the shorter shell content area. Owned grid/shell page-entry effects
reset scrollTop, then invoked native focus without preventScroll. Both now use
`focus({ preventScroll: true })` to avoid a focus-induced scroll after the explicit
reset. The shared interaction already uses scroll-preserving focus for its own
repair path; it was not edited.

Correction code/test head: `f75007971a74310cb2eb65a4a307a9ae0393fbf1`.
Targeted public tests still exercise accepted/rejected ownership and now verify
the owned entry call uses scroll-preserving focus. A diagnostic assertion over
*every* focus call failed because React Aria uses its own fallback in jsdom;
stack inspection identified focusWithoutScrolling/useGridCell, and the final
assertion covers the first owned footer-entry call. It does not certify native
scroll geometry or prohibit the engine's own focus repair.

- `/tmp/sgui-batch14-shrink-light.py exec vitest run src/components/AppDataGrid/AppDataGrid.test.tsx src/components/AppDataGridShell/AppDataGridShell.test.tsx --maxWorkers=1`: **30 passed / 2 files**, log `/tmp/sgui-batch14-shrink-scroll-final-unit.log`.
- Slot-owned `typecheck`: passed, log `/tmp/sgui-batch14-shrink-scroll-types.log`.
- `git diff --check`: passed.

No own heavy build/native run or unchanged native retry occurred. Fresh coordinator
Chromium execution is still required on the corrected frozen head, with the same
spec/assertions. This minimal correction is not yet native-proven; if a subsequent
engine-scheduled scroll defeats it, shared-interaction correction requires its
separate owner rather than an out-of-scope edit here. Firefox/WebKit checkpoint
and broad acceptance remain pending under the latest coordinator policy.
