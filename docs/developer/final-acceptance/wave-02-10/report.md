# Wave 02 / parallel 10 acceptance reconciliation

Reviewed 2026-10-16T22:44:40.152691+00:00 on modified `dev` at `540f47d4059a9cea8890b80927f34f51ef2fbc3e`. These are coordinator closure recommendations against the full original leaves. Only `docs/developer/final-acceptance/wave-02-10/` was written.

**Outcome: 15 partial, 9 complete, 1 blocked across 25 assigned obligations.** No shared counts/checklists changed. No new runtime/native/AT/consumer execution, build, install, server, release or Git mutation. Twenty editor V leaves and production validation remain open.

## Input and evidence boundaries

The [scoped receipt](input-reconciliation.json) reuses FA-01–04 rather than regenerating source/dependency inventories or repeating passed suites. It hashes130 scoped inputs:123 equal FA-02,4 changed documentation files,3 uncaptured acceptance reports. Every reviewed grid source/test input is unchanged from FA-02. All38 selected built grid declarations equal FA-01 and have no forbidden upstream engine/foundation type matches. No retired MUI/Emotion dependency remains in the inspected manifest groups. These are static checks, not a new typecheck, package build or native run.

Retained FA-04 reconciles the original failed full command with only its corrected calendar scopes; it is not relabeled a green original command. Passing unchanged grid/lifecycle tests are reused. Prior parallel01 API inventory supplies public-route/declaration traversal. Concurrent BUG0008/0009 fixes may invalidate whole-package source/output equivalence even while these grid declarations stay identical. Do not use the old package to certify changed PeriodPicker/DateTimeRangePicker/DateRangeComparisonPicker/TextArea behavior.

Historical native evidence retains its original source/head/host and engine limits. The earlier parallel10 report confirmed its named foundation/control artifact directories absent locally. Grid batch reports below are retained documentary receipts; raw artifacts were not recovered or newly executed here. A test source shows intended coverage, not execution. No new remote CI, screen-reader, physical-device or legal approval claim is made.

Conditional feature leaves G19/G23 are assessed against the explicit chosen matrix: virtualization, true pinning, grouped headers, expansion and inline editing remain deferred. Completing their boundary/decision obligations adds no feature or performance guarantee.

## Leaf results

| Leaf | Status | Required successor |
| --- | --- | --- |
| A-G-15 | partial | W02-10-G15 |
| A-G-16 | partial | W02-10-G16 |
| A-G-17 | partial | W02-10-G17 |
| A-G-18 | complete | None for this bounded original obligation |
| A-G-19 | complete | None for this bounded original obligation |
| A-G-20 | partial | W02-10-G20 |
| A-G-21 | partial | W02-10-G21 |
| A-G-22 | complete | None for this bounded original obligation |
| A-G-23 | complete | None for this bounded original obligation |
| A-G-25 | complete | None for this bounded original obligation |
| A-G-26 | complete | None for this bounded original obligation |
| A-G-27 | complete | None for this bounded original obligation |
| A-G-28 | partial | W02-10-G28 |
| A-G-29 | partial | W02-10-G29 |
| A-X-11 | blocked | W02-10-X11 |
| A-X-12 | complete | None for this bounded original obligation |
| A-X-13 | partial | W02-10-X13 |
| A-X-14 | partial | W02-10-X14 |
| A-X-15 | partial | W02-10-X15 |
| A-X-16 | partial | W02-10-X16 |
| A-X-17 | partial | W02-10-X17 |
| A-X-18 | partial | W02-10-X18 |
| A-X-19 | partial | W02-10-X19 |
| A-X-20 | partial | W02-10-X20 |
| A-X-21 | complete | None for this bounded original obligation |

## A-G-15 — partial

**Original:** Reconcile original `G-15`: Support empty, no-results, loading, refresh, error, and row-subheader states with appropriate announcements and preserved context. Historical status: open.

- OwnedGridStatus distinguishes loading/refreshing/empty/noResults/error, polite pending and assertive errors, named progress and host Retry. Refresh status sits beside retained rows; busy bridge writes aria-busy only when changed.
- OwnedGridRowSubHeader has controlled expansion, translated toggle/edit names and independent trailing actions; it is a host presentation part, not an expandable-row model.
- Retained busy receipt explicitly leaves spoken announcement timing open, especially statuses inside an empty busy grid. Native markup does not prove appropriate speech.

**Current source:** `packages/ui/src/components/AppDataGrid/ownedGridParts.tsx`; `packages/ui/src/components/AppDataGrid/ownedGridInteraction.tsx`.

**Tests/assertions:** `packages/ui/src/components/AppDataGrid/ownedGridParts.test.tsx`; `packages/ui/src/components/AppDataGrid/ownedGridInteraction.test.tsx`; `packages/ui/tests/browser/batch05-grid-busy.spec.ts`; `packages/ui/tests/browser/batch08-grid-retry-focus.spec.ts`.

**Retained evidence and limits:** docs/developer/parallel-batch-05/grid-busy.md: Node24, implementation 3219f168429cbadcc6d8300aa3a3a72490a1bda1; 68 unit cases/8 files, Chromium2 and WebKit2; Firefox launch failed before tests. docs/developer/react-aria-grid-cell-acceptance.md; FA-04 retains unchanged corresponding unit inputs.

**Checks performed:** Read the complete requirement, current cited code/assertions and retained receipts; compared scoped input hashes. No newly executed behavior result. All global input/head/host limits above apply.

**W02-10-G15 (Named AT operator and coordinator immutable fixture window):** Review empty initial loading, retained refresh success/error, no-results, Retry disappearance and row-subheader actions; record spoken statuses and focus together.

**Required evidence:** AT/browser/OS versions, exact source/host hashes, expected-versus-observed speech, duplicate/delayed/missing announcement findings and bounded fixes. This successor is unrun.

## A-G-16 — partial

**Original:** Reconcile original `G-16`: Define keyboard navigation, tab stops, focus retention after updates, row actions, and table versus interactive-grid semantics based on actual behavior. Historical status: open.

- Interactive React Aria Table exposes role grid, roving cell entry, arrows among nested actions, Tab exit and stable row/field/control focus ownership. Plain Table remains a separate presentation primitive.
- Current native spec explicitly covers refresh both scroll axes, hidden/deleted/empty cells, page/size entry, sibling/host focus and row-action independence. Its enterReview helper seeds a cell with focus(), so it cannot establish every native first-entry path.
- Retained G16 receipt is a bounded slice and identifies native busy follow-up; that bridge is now implemented and covered by G15 evidence, so do not reschedule the old missing-aria-busy implementation.

**Current source:** `packages/ui/src/components/AppDataGrid/ownedGridInteraction.tsx`; `docs/developer/react-aria-grid-contracts.md`.

**Tests/assertions:** `packages/ui/src/components/AppDataGrid/ownedGridInteraction.test.tsx`; `packages/ui/tests/browser/batch01-grid-focus.spec.ts`; `packages/ui/tests/browser/acceptance.spec.ts`.

**Retained evidence and limits:** docs/developer/parallel-batch-01/grid-focus.md: implementation60450cbe/final spec39151928; Chromium/WebKit10/10, Firefox pretest launch failure; Node26.5 historical host. docs/developer/parallel-batch-05/grid-busy.md resolves previous native busy implementation gap.

**Checks performed:** Read the complete requirement, current cited code/assertions and retained receipts; compared scoped input hashes. No newly executed behavior result. All global input/head/host limits above apply.

**W02-10-G16 (Coordinator + manual keyboard/AT operator):** Use existing focus fixture; add only missing native Tab/Shift+Tab entry and table/grid spoken-navigation observations. Recover existing engine focus receipts before rerunning unchanged cases.

**Required evidence:** Record actual tab sequence, roles, nested action activation and focus after update with source/host identity; retain programmatic cell-entry distinction. This successor is unrun.

## A-G-17 — partial

**Original:** Reconcile original `G-17`: Define row reordering for pointer, touch, keyboard and non-drag actions; announce changes, support cancel, and define behavior when sorting/filtering/pagination is active. Historical status: open.

- Reorder is intentionally bounded to complete client page0 fitting one page, no search/filter/sort, <=1 selected ID and no loading/refresh/error. Non-drag Move and keyboard Escape complement React Aria drag.
- Request params contain original generic source/target rows, stable IDs and before/after; host alone commits/rolls back. Invalid/self/adjacent/outside drops do not request moves.
- Existing trusted pointer and touchscreen Move evidence does not verify physical touch long-press drag or spoken drag announcements.

**Current source:** `packages/ui/src/components/AppDataGrid/ownedGridInteraction.tsx`; `docs/developer/react-aria-grid-reorder.md`.

**Tests/assertions:** `packages/ui/src/components/AppDataGrid/AppDataGrid.reorder.test.tsx`; `packages/ui/src/components/AppDataGrid/AppDataGrid.pointer-invalidation.test.tsx`; `packages/ui/tests/browser/reorder.spec.ts`; `packages/ui/tests/browser/batch01-grid-reorder.spec.ts`.

**Retained evidence and limits:** docs/developer/react-aria-browser-acceptance.md: native pointer before/after, outside cancel and emulated touchscreen Move subset. docs/developer/react-aria-grid-reorder.md: Strict Mode cancellation/rollback slice explicitly preserves physical touch, cross-grid and AT gaps.

**Checks performed:** Read the complete requirement, current cited code/assertions and retained receipts; compared scoped input hashes. No newly executed behavior result. All global input/head/host limits above apply.

**W02-10-G17 (Physical touch device and named AT operator; coordinator source/host snapshot):** Exercise long-press start/move/cancel/drop, spoken source/drop-position/commit-request versus saved order, and cross-grid cancellation with colliding IDs. Reuse existing pointer/Move checks.

**Required evidence:** Device/browser/AT versions, actual gesture/event trace, no host request on cancellation and unchanged sibling state; retain explicit sorting/filter/page boundary evidence. This successor is unrun.

## A-G-18 — complete

**Original:** Reconcile original `G-18`: Replace native DOM-class queries and ad hoc drag ghosts with owned references/parts and theme-aware previews; clean up listeners and overlays. Historical status: open.

- Native helper resolves owned data-sgui-part/grid-row and dataset.gridRow, optionally constrained by rootRef; no retired renderer class is needed.
- Preview text uses textContent, compiled theme-token CSS and nearest scope insertion. A ref owns the preview and dragend listener; replacement, explicit cleanup, native cancel/end, setDragImage failure and unmount release both.
- Unit coverage explicitly includes theme scope, replacement, error cleanup and Strict Mode unmount. This closes the owned helper/cleanup migration, not physical dragging or all-device previews.

**Current source:** `packages/ui/src/components/AppDataGridRowDnd/useDataGridRowDnd.ts`; `packages/ui/src/components/AppDataGridRowDnd/DataGridDragHandle.module.css`.

**Tests/assertions:** `packages/ui/src/components/AppDataGridRowDnd/useDataGridRowDnd.test.tsx`; `packages/ui/src/components/AppDataGrid/ownedGridInteraction.drop-focus.test.tsx`.

**Retained evidence and limits:** FA-04 unchanged unit inputs; docs/developer/react-aria-grid-reorder.md documents removed class/ghost coupling and cleanup cases.

**Checks performed:** Read the complete requirement, current cited code/assertions and retained receipts; compared scoped input hashes. No newly executed behavior result. All global input/head/host limits above apply.

## A-G-19 — complete

**Original:** Reconcile original `G-19`: Define virtualization responsibilities and row/column overscan only where needed; test variable content, dynamic measurements, focus, screen-reader position metadata, and pinned columns. Historical status: open.

- Chosen matrix does not enable virtualization. Ordinary paginated React Aria tables render the processed page; there is no overscan or pinned-column virtualizer contract to silently certify.
- True pinned columns are explicitly deferred. Workload evidence, variable content/measurement, focus and AT position metadata are mandatory gates before enabling virtualization.
- Conditional requirement is satisfied by explicit disabled ownership and activation gates. G20/X19 remain open for measurement; this is no large-grid performance or virtualizer acceptance claim.

**Current source:** `docs/developer/react-aria-grid-contracts.md`; `docs/developer/react-aria-grid-decision.md`; `packages/ui/src/components/AppDataGrid/ownedGridInteraction.tsx`.

**Tests/assertions:** `packages/ui/src/components/AppDataGrid/ownedGridModel.test.ts`; `packages/ui/tests/browser/acceptance.spec.ts: performance smoke`.

**Retained evidence and limits:** Current chosen capability matrix and inspected renderer; unchanged source and FA-04 test inputs.

**Checks performed:** Read the complete requirement, current cited code/assertions and retained receipts; compared scoped input hashes. No newly executed behavior result. All global input/head/host limits above apply.

## A-G-20 — partial

**Original:** Reconcile original `G-20`: Benchmark large row/column counts and frequent updates, including selection and text input; compare production builds against the baseline. Historical status: open.

- Production browser smoke has 1000 input rows/250 rendered, sort operation and 15s total hang guard with timing attachment. It does not measure column scale, frequent updates, typing or selection latency.
- Historical server reference is Apple M4/macOS arm64 Node26.5, three warmups/nine samples and grid1000/page50 median16.12ms. Server budget34ms and composed bundle budgets are investigation references, not a current comparative browser baseline.

**Current source:** `docs/developer/react-aria-performance.md`; `docs/developer/migration-baseline/proof-measurements.json`.

**Tests/assertions:** `packages/ui/tests/browser/acceptance.spec.ts:140`; `packages/ui/scripts/measure-migration-proofs.mjs`.

**Retained evidence and limits:** Original measurement JSON is retained and read; no new timing sampled. Browser smoke historical scope in react-aria-browser-acceptance.md.

**Checks performed:** Read the complete requirement, current cited code/assertions and retained receipts; compared scoped input hashes. No newly executed behavior result. All global input/head/host limits above apply.

**W02-10-G20 (Coordinator production profiling window and representative hardware/workload owner):** Define small workload set varying row/column counts and update frequency; profile render/sort/filter/selection and typing input on current production package versus comparable stored baseline.

**Required evidence:** Machine/runtime/build/source IDs, warmup/sample method, median/tail input/update latency, memory and accepted budget; avoid comparing Node26 SSR numbers directly to browser latency. This successor is unrun.

## A-G-21 — partial

**Original:** Reconcile original `G-21`: Preserve link adapter semantics, visible focus, copy success/error feedback, escaped JSON/text, date localization, and image fallback behavior in cells. Historical status: open.

- All nine owned cells preserve row-based callbacks, text/JSON React escaping, cyclic/BigInt fallback, literal-date UTC day with locale and optional host instant zone, image error/source-retry fallback and shared Link adapter.
- Copy feedback owns three-second timer, ignores stale writes after value/availability change, and does not move focus or selection. Pending menu actions stay disabled.
- Native clipboard subset retained Chromium4/WebKit3 with Chromium-specific permission denial and Firefox launch failure; deterministic rejection differs from actual OS denial. Newer retained link reconciliation also leaves native current-host semantics open.

**Current source:** `packages/ui/src/components/AppDataGrid/ownedGridCells.tsx`; `packages/ui/src/components/AppDataGrid/components/table-cell/OwnedTableCell.tsx`; `docs/developer/react-aria-grid-cell-acceptance.md`.

**Tests/assertions:** `packages/ui/src/components/AppDataGrid/ownedGridCells.test.tsx`; `packages/ui/src/components/AppDataGrid/AppDataGrid.cells.test.tsx`; `packages/ui/tests/browser/batch05-grid-clipboard.spec.ts`.

**Retained evidence and limits:** docs/developer/parallel-batch-05/grid-clipboard.md: final07e514ec86fb4d6bb7025a9ae1cd1f349b3fc82f, 7 native passes/1 skip/4 launch failures; 19 unit cases. docs/developer/final-acceptance/parallel-13/report.md: current link bytes differ from earlier broad native run; narrow adapter slices retained.

**Checks performed:** Read the complete requirement, current cited code/assertions and retained receipts; compared scoped input hashes. No newly executed behavior result. All global input/head/host limits above apply.

**W02-10-G21 (Coordinator immutable host and AT/clipboard operator):** Recover applicable later clipboard/link receipts; fill only missing Firefox/current-host native copy, keyboard focus and cell adapter cases plus spoken independent feedback.

**Required evidence:** Exact copied text/JSON bytes, escaping, safe rel/modified navigation, image fallback and localized dates; distinguish native permission policy from mocked rejection. This successor is unrun.

## A-G-22 — complete

**Original:** Reconcile original `G-22`: Test view-state persistence and schema migration for retired grid models; restore defensively and offer reset-to-defaults. Public live reset with controlled callbacks, stale snapshot suppression, remount and native focus evidence; [contract](react-aria-catalog-grid.md). Historical status: checked.

- Version1 envelope validates rows-independent criteria/layout/page sizes. Legacy list/cards pagination and visibility/view keys are validated; list precedence is explicit. Retired sort/filter models are deliberately rejected, not silently interpreted.
- Readiness gate defers storage until effect, controlled values win, malformed/version-incompatible JSON/storage failure safely falls back. Per-view key required; remount owns key changes.
- Reset applies declared defaults, page0, clears selection and old keys, requests controlled callbacks and one full snapshot; suppresses unchanged rejected pre-reset snapshot until resolved signature changes. Existing tests cover independent grids/remount/reset/default persistence.

**Current source:** `packages/ui/src/components/AppDataGrid/ownedGridPersistence.ts`; `packages/ui/src/components/AppDataGrid/ownedGridReset.ts`; `docs/developer/react-aria-catalog-grid.md`.

**Tests/assertions:** `packages/ui/src/components/AppDataGrid/ownedGridPersistence.test.tsx`; `packages/ui/src/components/AppDataGrid/AppDataGrid.next100-regression.test.tsx`; `packages/ui/src/components/AppDataGrid/AppDataGrid.test.tsx`; `packages/ui/src/components/AppDataGridShell/AppDataGridShell.test.tsx`.

**Retained evidence and limits:** FA-04 unchanged unit evidence; react-aria-progress.md:1311–1381 retains public reset contract, controlled/remount regressions and bounded native IAB keyboard reset/persist-after-reload receipt. Historical checked status was not used as sole evidence; source and tests match full requested persistence/migration/reset policy. Native receipt is historical and does not certify arbitrary storage engines.

**Checks performed:** Read the complete requirement, current cited code/assertions and retained receipts; compared scoped input hashes. No newly executed behavior result. All global input/head/host limits above apply.

## A-G-23 — complete

**Original:** Reconcile original `G-23`: Add grouped headers, expandable rows, or inline editing only if part of the chosen requirement matrix; define edit/commit/cancel/validation contracts before adding them. Historical status: open.

- Chosen required matrix explicitly defers grouped headers, expandable grid rows and inline editing; no inert expansion/edit state is promised.
- RowSubHeader expanded/onToggle and title-edit callbacks are host-owned presentation controls and do not implement a hidden grid row expansion or inline commit model.
- No selected advanced edit feature therefore needs speculative edit/commit/validation APIs. Any future selection must establish these contracts before implementation.

**Current source:** `docs/developer/react-aria-grid-contracts.md`; `packages/ui/src/components/AppDataGrid/types.ts`; `packages/ui/src/components/AppDataGrid/ownedGridParts.tsx`.

**Tests/assertions:** `packages/ui/src/components/AppDataGrid/ownedGridParts.test.tsx`.

**Retained evidence and limits:** Read current requirement matrix, owned API and explicit host row-subheader behavior; conditional feature deferral only.

**Checks performed:** Read the complete requirement, current cited code/assertions and retained receipts; compared scoped input hashes. No newly executed behavior result. All global input/head/host limits above apply.

## A-G-25 — complete

**Original:** Reconcile original `G-25`: If combining TanStack and React Aria, prototype the integration and map row models/state/events deliberately; avoid two selection/sort models and unsupported virtualization assumptions. Historical status: open.

- TanStack createTable receives one owned sorting array and pagination snapshot; SGUI applies filters/search first. Server branch returns host rows in input order without a second processing pass.
- React Aria alone owns collection/focus/selection interaction; selected IDs remain owned state. No competing TanStack selection model is configured in the inspected processing path.
- Prototype is integrated in public grid; owned processing/controller tests exercise stable sort/ties, transaction callback order, server bypass and frozen input. Virtualization is explicitly not enabled.

**Current source:** `packages/ui/src/components/AppDataGrid/ownedGridModel.ts`; `packages/ui/src/components/AppDataGrid/ownedGridController.ts`; `packages/ui/src/components/AppDataGrid/ownedGridInteraction.tsx`; `docs/developer/react-aria-grid-decision.md`.

**Tests/assertions:** `packages/ui/src/components/AppDataGrid/ownedGridModel.test.ts`; `packages/ui/src/components/AppDataGrid/ownedGridController.test.ts`; `packages/ui/src/components/AppDataGrid/ownedGridProcessing.test.tsx`.

**Retained evidence and limits:** FA-04 passing unchanged scoped unit inputs; engine comparison and ownership matrix inspected. No new engine documentation lookup or behavioral benchmark asserted.

**Checks performed:** Read the complete requirement, current cited code/assertions and retained receipts; compared scoped input hashes. No newly executed behavior result. All global input/head/host limits above apply.

## A-G-26 — complete

**Original:** Reconcile original `G-26`: Document table engine limitations and an extension strategy; do not imply a UI library foundation supplies a complete enterprise grid. Historical status: open.

- Current capability matrix distinguishes required parity, selected enhancement and deferred/future features; explicitly says React Aria/TanStack are processing/interaction building blocks.
- True pinning, virtualizer, grouping/expansion/editing and enterprise spreadsheet/export/pivot/tree/formula features are not represented by inert public props.
- Extension strategy names G19/G20 workload/measurement/focus/metadata gates for virtualization and G23 edit/commit/validation design before advanced editing; host remains data/persistence owner.

**Current source:** `docs/developer/react-aria-grid-contracts.md`; `docs/developer/react-aria-grid-decision.md`; `docs/developer/react-aria-catalog-grid.md`.

**Tests/assertions:** `packages/ui/src/components/AppDataGrid/ownedGridModel.test.ts`; `packages/ui/src/components/AppDataGrid/createDataGridColumns.test.tsx`.

**Retained evidence and limits:** Current documentation/source policy reconciled. Definition/extension-boundary completion does not close runtime/performance/AT grid gates.

**Checks performed:** Read the complete requirement, current cited code/assertions and retained receipts; compared scoped input hashes. No newly executed behavior result. All global input/head/host limits above apply.

## A-G-27 — complete

**Original:** Reconcile original `G-27`: Complete grid migration before removing final dependencies; all public and generated grid types must be engine-independent or intentionally owned. Historical status: open.

- Public types alias deliberately owned generic columns/menu actions, Set<string> IDs, pagination records, row reorder payloads and native refs/styles. Model imports internal TanStack ColumnDef only in implementation.
- All38 current scoped generated grid declarations match FA-01 hashes and contain no react-aria/react-stately/@react-types/@mui/@emotion/@tanstack type references. Manifest has no retired foundation packages in any dependency group.
- FA-01/parallel01 public-route/declaration inventory and FA-04 package checks cover entry traversal and packed bytes; this audit does not rebuild the package or reassert equivalence for concurrent non-grid fixes. Grid migration/declaration boundary is complete, not broad final grid acceptance.

**Current source:** `packages/ui/src/components/AppDataGrid/types.ts`; `packages/ui/src/components/AppDataGrid/ownedGridColumns.ts`; `packages/ui/src/components/AppDataGrid/index.ts`; `packages/ui/package.json`; `packages/ui/scripts/check-package.mjs`; `docs/developer/final-acceptance/parallel-01/api-snapshot.json`.

**Tests/assertions:** `packages/ui/src/components/AppDataGrid/createDataGridColumns.test.tsx`; `packages/ui/src/components/AppDataGrid/createActionMenuColumn.test.ts`; `packages/ui/tests/types/app-data-grid-view-state.tsx`.

**Retained evidence and limits:** input-reconciliation.json records all38 current declaration hashes, zero leaks and zero retired manifest dependencies. FA-04 foundations/package receipts retained.

**Checks performed:** Read the complete requirement, current cited code/assertions and retained receipts; compared scoped input hashes. No newly executed behavior result. All global input/head/host limits above apply.

## A-G-28 — partial

**Original:** Reconcile original `G-28`: Define cancel/error/optimistic-update behavior for host-driven row actions and reorder requests; restore or reconcile visible state when persistence fails. Historical status: open.

- Reorder and row actions are requests with host-owned pending/error/persistence; SGUI never silently mutates supplied rows. Optimistic fixture snapshots/restores previous order on failed save and disables concurrent reorder.
- Native Strict Mode Move commit/rollback and outside/keyboard cancellation cases exist. Deferred server host fixtures guard latest request/availability and discard obsolete success/error without changing newer rows/pending/error/focus.
- Representative server races are not production transport abort/error proof, and do not establish every host row-action cancellation/reconciliation policy.

**Current source:** `docs/developer/react-aria-grid-reorder.md`; `docs/developer/react-aria-catalog-grid.md`; `packages/ui/src/components/AppDataGrid/ownedGridInteraction.tsx`.

**Tests/assertions:** `packages/ui/src/components/AppDataGrid/AppDataGrid.reorder.test.tsx`; `packages/ui/tests/browser/batch01-grid-reorder.spec.ts`; `packages/ui/tests/browser/grid-server-response-races.spec.ts`; `packages/ui/src/components/AppDataGridShell/AppDataGridShell.server-response-races.test.tsx`.

**Retained evidence and limits:** docs/developer/parallel-batch-82/grid-server-response-races.md: seven composed and seven Chromium-validated native deferred host cases; no real network. docs/developer/react-aria-grid-reorder.md retains cancellation/optimistic rollback scope.

**Checks performed:** Read the complete requirement, current cited code/assertions and retained receipts; compared scoped input hashes. No newly executed behavior result. All global input/head/host limits above apply.

**W02-10-G28 (Host integration owner and coordinator):** Provide one reusable source-backed row-action/reorder host adapter example with operation identity, cancel/unmount/replacement, explicit error/retry and optimistic rollback of latest failed operation. Reuse existing deferred-race fixture instead of duplicating it.

**Required evidence:** Exact stale-settlement/no-commit traces; canceled requests do not announce saved state; latest accepted order wins; caller-visible errors and controlled rejection documented. This successor is unrun.

## A-G-29 — partial

**Original:** Reconcile original `G-29`: Define focus and scroll preservation when data refreshes, pages change, columns hide, or a selected row disappears; test multiple independent grids. Historical status: open.

- Focus ownership is stable row/field/nested-control identity. Refresh preserves mounted element and scroll; hidden/deleted cell falls back inside owning grid; page/size entry resets both axes; host/sibling focus is not stolen.
- Five permanent focus cases plus retry-removal and server-race specs cover substantial full wording. Historical focus report explicitly excludes arbitrary host widgets/off-entry focus and shell/footer transitions; later shell/race evidence covers some of those scopes.
- No exact current immutable-host result is present in this task for the complete refresh/page/hide/disappearance/two-grid matrix; source presence is not native execution.

**Current source:** `packages/ui/src/components/AppDataGrid/ownedGridInteraction.tsx`; `docs/developer/react-aria-grid-contracts.md`.

**Tests/assertions:** `packages/ui/tests/browser/batch01-grid-focus.spec.ts`; `packages/ui/tests/browser/batch08-grid-retry-focus.spec.ts`; `packages/ui/tests/browser/batch05-grid-shell-state.spec.ts`; `packages/ui/tests/browser/grid-server-response-races.spec.ts`.

**Retained evidence and limits:** docs/developer/parallel-batch-01/grid-focus.md; parallel-batch-82/grid-server-response-races.md; retained historical engine/head limits above.

**Checks performed:** Read the complete requirement, current cited code/assertions and retained receipts; compared scoped input hashes. No newly executed behavior result. All global input/head/host limits above apply.

**W02-10-G29 (Coordinator evidence archive / immutable host window):** Reconcile existing focused grid-focus, retry-focus and shell/race receipts by complete host/input hashes. Fill only uncovered current transition/engine cases; add selected-row disappearance only if absent after reconciliation.

**Required evidence:** Native active element row/field/index and both scroll axes before/after each transition, sibling focus/state unchanged, documented page-entry rules; exact test/host hashes. This successor is unrun.

## A-X-11 — blocked

**Original:** Reconcile original `X-11`: Perform manual screen-reader reviews of representative dialogs, selectors, calendars, navigation, tables and editors; document platform/version and findings. Historical status: open.

- No named operator, platform/AT version, spoken-output transcript or manual review session is supplied by this assignment. Existing automation and axe scans expressly do not establish spoken AT conformance.
- Created manual-review-matrix.json mapping six required categories to existing deterministic scenarios, expected review observations and prerequisites. This advances the handoff without inventing a review.
- Blocked only on actual manual operator/device/session evidence; no library defect inferred and no new broad scan proposed.

**Current source:** `docs/developer/react-aria-browser-acceptance.md`; `docs/developer/react-aria-grid-reorder.md`.

**Tests/assertions:** `packages/ui/tests/browser/acceptance.spec.ts`; `packages/ui/tests/browser/batch01-grid-focus.spec.ts`; `packages/ui/tests/browser/token-tier-scope.spec.ts`.

**Retained evidence and limits:** Current browser acceptance guidance explicitly preserves manual screen-reader reviews; local source/DOM/axe evidence cannot substitute.

**Checks performed:** Read the complete requirement, current cited code/assertions and retained receipts; compared scoped input hashes. No newly executed behavior result. All global input/head/host limits above apply.

**W02-10-X11 (Human or authorized accessibility operator with chosen supported AT/browser/OS, plus immutable fixture build):** Execute the six-category worksheet and fill expected-versus-spoken output, keyboard/focus sequence, platform versions and finding severity.

**Required evidence:** Completed operator transcript/recording references tied to source+host hashes, signed review date and bounded defect tasks. No full conformance claim from one pairing. This successor is unrun.

## A-X-12 — complete

**Original:** Reconcile original `X-12`: Enable Storybook accessibility failures in CI for applicable checks, with scoped documented exceptions and remediation ownership. Twenty-four executed WCAG scans, no rule/node exceptions; [scope and remediation ownership](react-aria-browser-acceptance.md). Historical status: checked.

- Approved host migration replaces Storybook scans with mandatory Playwright axe gates on docs-owned native fixtures; does not restore removed Storybook.
- Eight scan configurations (four fixture states × two outer themes) per engine cover public grid/editable editor/read-only editor/open nested dialog. wcag2a/aa,21a/aa,22aa violations fail; full axe results attach and no disabled rules/node exclusions are authored in the inspected gate.
- Node24 CI runs required three-engine browser suite and uploads evidence14 days. Component maintainers own failures; host content/labels/overrides remain consumer-owned. New exceptions require scoped documented reason and owner. This is scoped automated-gate completion, not fresh CI or all-library accessibility.

**Current source:** `packages/ui/tests/browser/acceptance.spec.ts:116`; `.github/workflows/ci.yml`; `docs/developer/react-aria-browser-acceptance.md`; `packages/ui/playwright.config.ts`.

**Tests/assertions:** `packages/ui/tests/browser/acceptance.spec.ts:120`.

**Retained evidence and limits:** Retained historical24 executed scans in browser acceptance/runtime evidence; approved docs-fixture migration and FA-04 native fixture build retained. Current CI/gate source unchanged from FA-02; no remote CI queried.

**Checks performed:** Read the complete requirement, current cited code/assertions and retained receipts; compared scoped input hashes. No newly executed behavior result. All global input/head/host limits above apply.

## A-X-13 — partial

**Original:** Reconcile original `X-13`: Add browser interaction stories/tests for all changed behavior; keep deterministic local fixtures and no authentication/database/network dependency. Historical status: open.

- Docs-owned deterministic native host supplies local representative data and host callback simulations, without authentication/database or production API calls. Public docs fixture endpoints are separately isolated.
- Fixture migration preserves original102 specs/164 fixture IDs/75 scenario modules; current source adds targeted grid refresh/race/reorder/clipboard and calendar/native tests.
- All changed behavior is broader than preserved inventory or a built fixture. Concurrent four-component fixes and20 open editor V leaves prevent claiming complete current behavioral browser coverage.

**Current source:** `docs/developer/docs-fixture-migration.md`; `apps/docs/native-fixtures/generate-registry.mjs`; `docs/developer/docs-website.md`.

**Tests/assertions:** `packages/ui/tests/browser/batch05-grid-busy.spec.ts`; `packages/ui/tests/browser/grid-server-response-races.spec.ts`; `packages/ui/tests/browser/batch01-grid-reorder.spec.ts`.

**Retained evidence and limits:** Retained Storybook retirement receipt records initial three-engine replacement-host execution and14 bounded corrections, not a single all-green unchanged historical suite. FA-04 fixture build is not browser execution.

**Checks performed:** Read the complete requirement, current cited code/assertions and retained receipts; compared scoped input hashes. No newly executed behavior result. All global input/head/host limits above apply.

**W02-10-X13 (Coordinator frozen changed-behavior inventory after BUG0008/0009 changes settle):** Map each current changed contract to preserved/added native assertion and exact accepted receipt. Separate20 editor V owners and only schedule missing affected primary flows.

**Required evidence:** Delta coverage table containing source change, fixture/test/assertion, retained result identity or explicit unrun successor; no test-count-to-acceptance equivalence. This successor is unrun.

## A-X-14 — partial

**Original:** Reconcile original `X-14`: Add visual regression coverage for light/dark, density, narrow/wide containers, long/pseudo-localized labels, RTL, focus/error/loading/empty/selected states. Historical status: open.

- Presentation specs exercise light/dark, compact/comfortable, English/Arabic RTL, narrow360px, enlarged text and focused controls; backlog records reviewed screenshot attachments and precise geometry assertions.
- Playwright default screenshots are failure-only; dedicated specs attach review captures. Inspected grid/presentation evidence is not a complete stored pixel baseline/comparator for all listed states or wide/pseudo-localized combinations.
- 20 editor visual/RTL leaves explicitly remain open. Existing reviewed captures are preserved; no new screenshot or visual verdict was fabricated.

**Current source:** `docs/developer/backlog-execution-2026-10-15.md`; `packages/ui/playwright.config.ts`.

**Tests/assertions:** `packages/ui/tests/browser/hardening-grid-presentation.spec.ts`; `packages/ui/tests/browser/hardening-control-geometry.spec.ts`; `packages/ui/tests/browser/display-preferences.spec.ts`.

**Retained evidence and limits:** Backlog HB presentation/geometry reviews retain initial defects and reviewed successes; parallel09 and parallel10 evidence limits retain absent local artifact manifests.

**Checks performed:** Read the complete requirement, current cited code/assertions and retained receipts; compared scoped input hashes. No newly executed behavior result. All global input/head/host limits above apply.

**W02-10-X14 (Visual reviewer and coordinator immutable capture window):** Produce required-state matrix for representative controls/grid/editor/navigation/overlay; recover reviewed captures and mark each required theme/density/container/locale/focus/error/loading/empty/selected cell covered or missing.

**Required evidence:** Reviewed before/after image references, source/host hashes and tolerances or documented manual comparison method; complete20 editor V tasks separately. This successor is unrun.

## A-X-15 — partial

**Original:** Reconcile original `X-15`: Require deliberate review of screenshot changes; do not automatically accept new snapshots to silence regressions. Historical status: open.

- Backlog explicitly records deliberate screenshot inspection and actual presentation corrections (including grid reorder focus overlap) rather than blindly accepting assertion passes.
- No automatic --update-snapshots path was observed in inspected native config/workflow; this is evidence about those files, not a repository-wide prohibition.
- Full screenshot-change review governance is not established by historical reviewed captures alone: reviewer identity, explicit before/after baseline approvals and durable disposition are not consistently attached to all screenshot changes.

**Current source:** `docs/developer/backlog-execution-2026-10-15.md`; `.github/workflows/ci.yml`; `packages/ui/playwright.config.ts`.

**Tests/assertions:** `packages/ui/tests/browser/hardening-grid-presentation.spec.ts`.

**Retained evidence and limits:** Historical HB17 records Firefox/WebKit visual detection despite initially passing assertions and subsequent bounded fixes; review is real but current complete review log remains missing.

**Checks performed:** Read the complete requirement, current cited code/assertions and retained receipts; compared scoped input hashes. No newly executed behavior result. All global input/head/host limits above apply.

**W02-10-X15 (Maintainer designated visual reviewer):** Create durable change review receipt format and apply to acceptance screenshot deltas: original/replacement hashes, reason, reviewer/date, source/host IDs, defects/follow-ups. Keep unchanged accepted captures.

**Required evidence:** Explicit reviewed disposition for each changed baseline; no automatic approval merely because regenerated captures match current output. This successor is unrun.

## A-X-16 — partial

**Original:** Reconcile original `X-16`: Test multiple independent component instances, nested themes/portals, stable IDs, React Strict Mode cleanup, and controlled/uncontrolled transitions. Historical status: open.

- Grid independent-key persistence, colliding-ID reorder isolation, nested ThemeScope rerenders/sibling isolation, Strict Mode drag preview/drop-focus cleanup and controlled host rejection all have retained unit coverage.
- Packed hydration fixtures check duplicate IDs and reference resolution; scoped portal test checks detached dialog tokens and sibling isolation. Each test is bounded, not all components or every lifecycle transition.
- Controlled/uncontrolled ownership is intentionally fixed per instance in grid contracts. Acceptance must test supported remount/default/rejection paths and explicitly document unsupported ownership switching rather than silently introduce transitions.

**Current source:** `packages/ui/src/components/AppDataGrid/ownedGridController.ts`; `packages/ui/src/components/AppDataGrid/ownedGridPersistence.ts`; `packages/ui/src/foundation/ThemeScope.tsx`; `docs/developer/react-aria-grid-contracts.md`.

**Tests/assertions:** `packages/ui/src/components/AppDataGrid/AppDataGrid.pointer-invalidation.test.tsx`; `packages/ui/src/components/AppDataGrid/AppDataGrid.next100-regression.test.tsx`; `packages/ui/src/components/AppDataGrid/ownedGridInteraction.drop-focus.test.tsx`; `packages/ui/src/components/AppDataGridRowDnd/useDataGridRowDnd.test.tsx`; `packages/ui/src/foundation/ThemeScope.next100-regression.test.tsx`; `packages/ui/tests/browser/token-tier-scope.spec.ts`.

**Retained evidence and limits:** FA-04 unchanged scoped unit baseline; previous parallel10 D16 successor remains live. This wave identifies additional real two-instance/StrictMode paths, not a repeated generic portal finding.

**Checks performed:** Read the complete requirement, current cited code/assertions and retained receipts; compared scoped input hashes. No newly executed behavior result. All global input/head/host limits above apply.

**W02-10-X16 (Coordinator lifecycle/contract matrix owner):** Combine existing two-instance/IDs/portal/StrictMode/default/controlled tests into component-boundary matrix. Fill only missing supported transitions; mark ownership-switch-remount rules explicitly.

**Required evidence:** Each contract boundary linked to exact test assertion and retained result/host hash; one composed native case for uncovered nested live portal changes may also satisfy parallel10 P10-D16-01. This successor is unrun.

## A-X-17 — partial

**Original:** Reconcile original `X-17`: Verify React 18.3 and 19 behavior and declaration compatibility using actual consumer fixtures, not just the development React version. Historical status: open.

- Real tarball consumer scripts pin React18.3.1/19.2.3 with matching React type packages and TS5.9.3; fixture exercises generic rows/refs/callbacks, Vite production CSS and SSR, with optional native hydration. React19 additionally executes official Flight.
- CI config serializes both foundation/editor versions and Next consumer. Historical retirement/foundation receipts are actual consumer evidence, not development-React-only tests.
- No current packed runtime result for concurrent component fixes is established; build-only hydration entries cannot replace executed behavior. No broader TypeScript/React version support inferred.

**Current source:** `packages/ui/scripts/test-foundation-consumer.mjs`; `packages/ui/scripts/test-editor-consumer.mjs`; `.github/workflows/ci.yml`; `docs/developer/react-aria-package-acceptance.md`.

**Tests/assertions:** `packages/ui/scripts/package-consumer.tsx`; `packages/ui/tests/types/app-data-grid-view-state.tsx`.

**Retained evidence and limits:** docs/developer/docs-website.md: Storybook retirement receipt records fresh packed18.3.1/19.2.3 production/API/SSR builds. docs/developer/react-aria-browser-acceptance.md: packed browser hydration historical scope; no current remote result.

**Checks performed:** Read the complete requirement, current cited code/assertions and retained receipts; compared scoped input hashes. No newly executed behavior result. All global input/head/host limits above apply.

**W02-10-X17 (Coordinator frozen package window after changed inputs settle):** Reconcile current source/output against retained React18/19 consumer manifests; execute only affected consumer scopes with immutable tarball and serialized output ownership.

**Required evidence:** Actual installed tarball SHA, React/type/TS versions, API negative/positive results and affected runtime/SSR/native hydration result with exact source/output IDs. This successor is unrun.

## A-X-18 — partial

**Original:** Reconcile original `X-18`: Add SSR render and hydration tests with no window/document at import time, no mismatched IDs, and correct initial locale/theme/date values. Historical status: checked.

- No-browser SSR test exists for owned grid; ThemeScope server test preserves system markup. Real packed Vite/Next tests verify server root identity, duplicate IDs, hydrated IDREFs, locale/theme and fixed leap-day values, with recoverable/console/page errors failing.
- Packed proof is explicit dark/en-US; Next host covers fr-FR and dates/light-dark tokens. Date helper IDREFs inserted by client effects are known pre-JS limitations; historical receipts do not certify every export.
- Previous parallel10 D17 successor identifies missing first-styled-system/preference coverage. This wave additionally maps correct SSR/ID/locale/date assertions and concurrent package-output limit; no duplicate consumer run performed.

**Current source:** `packages/ui/src/components/AppDataGrid/ownedGridInteraction.tsx`; `packages/ui/src/foundation/ThemeScope.tsx`; `packages/ui/scripts/test-foundation-consumer.mjs`; `packages/ui/scripts/test-next-consumer.mjs`.

**Tests/assertions:** `packages/ui/src/components/AppDataGrid/ownedGridInteraction.ssr.test.tsx`; `packages/ui/src/foundation/ThemeScope.test.tsx`; `packages/ui/scripts/packed-browser.mjs`.

**Retained evidence and limits:** docs/developer/react-aria-server-components.md docs/developer/react-aria-browser-acceptance.md:78 docs/developer/final-acceptance/parallel-10/report.md: A-D-17

**Checks performed:** Read the complete requirement, current cited code/assertions and retained receipts; compared scoped input hashes. No newly executed behavior result. All global input/head/host limits above apply.

**W02-10-X18 (Coordinator immutable current package/SSR host window):** Reuse unchanged SSR and native hydration evidence; add system first-styled frame/preference case from P10-D17-01 and affected composed-control SSR/import cases after BUG0008/0009 fixes.

**Required evidence:** No browser globals during import/render, expected initial locale/theme/date wire values, preserved server root, unique IDs/resolved hydrated IDREFs and zero recoverable errors; record pre-JS limitations honestly. This successor is unrun.

## A-X-19 — partial

**Original:** Reconcile original `X-19`: Record performance and memory budgets, profile large grids/selectors, and test listener/observer/timer/object-URL cleanup during mount/unmount. Historical status: open.

- Documented SSR workload and composed bundle budgets exist, but browser input/update/touch and large-grid memory budgets remain explicitly open.
- Targeted tests cover observer/frame/listener/drag preview/timer cleanup, copy stale results/unmount, shared scrollbar observation and image object-URL lifetime. Unit callback-count assertions do not prove steady-state browser heap/listener plateaus.
- No current production memory profile, repeated mount/unmount retained-object report or representative slower-hardware budget was measured.

**Current source:** `docs/developer/react-aria-performance.md`; `packages/ui/src/components/AppDataGrid/ownedGridInteraction.tsx`; `packages/ui/src/components/AppDataGridRowDnd/useDataGridRowDnd.ts`.

**Tests/assertions:** `packages/ui/src/components/AppDataGrid/ownedGridCells.test.tsx`; `packages/ui/src/components/AppDataGrid/ownedGridInteraction.drop-focus.test.tsx`; `packages/ui/src/components/AppDataGridRowDnd/useDataGridRowDnd.test.tsx`; `packages/ui/src/foundation/scrollbar-activity.test.ts`; `packages/ui/src/components/ImageUploadModal/ImageUploadModal.test.tsx`.

**Retained evidence and limits:** FA-04 unchanged unit lifecycle cases and original measured baseline JSON retained; 15-second browser hang guard is not memory/interaction budget.

**Checks performed:** Read the complete requirement, current cited code/assertions and retained receipts; compared scoped input hashes. No newly executed behavior result. All global input/head/host limits above apply.

**W02-10-X19 (Performance/lifecycle operator and workload owner with coordinator production window):** Pair G20 workloads with repeated mount/unmount/open/close/refresh of grid/selectors/portals/uploads; inspect heap retained owners, listener/observer/timer/objectURL counts and input tails.

**Required evidence:** Recorded hardware/browser/build/runtime, warmup/samples, acceptable retention baseline and measured plateau after disposal; focused regression only for concrete leaks. This successor is unrun.

## A-X-20 — partial

**Original:** Reconcile original `X-20`: Test API typing and package consumers, including generics, refs, callback payloads, CSS imports, isolated subpaths, and declaration dependency leakage. Historical status: open.

- FA-04 package audit actually typechecks built imports, callbacks/ref/generic positive and expected-negative APIs; package-consumer.tsx is unchanged. Isolated packed Vite builds inspect module IDs for unwanted Lexical/grid traversal and emitted production CSS.
- 38 scoped grid declarations remain exact FA-01 bytes with zero forbidden upstream type patterns; parallel01 retains370 reachable declarations/469 resolved contracts and public-route mappings.
- Current whole-package actual consumer validity cannot follow from unchanged grid declarations while four component implementations change concurrently. skipLibCheck and representative subpaths remain explicit proof limits.

**Current source:** `packages/ui/scripts/check-package.mjs`; `packages/ui/scripts/test-foundation-consumer.mjs`; `docs/developer/react-aria-package-acceptance.md`.

**Tests/assertions:** `packages/ui/scripts/package-consumer.tsx`; `packages/ui/tests/types/app-data-grid-view-state.tsx`.

**Retained evidence and limits:** docs/developer/final-acceptance/fa04-package.txt docs/developer/final-acceptance/parallel-01/verification.json input-reconciliation.json:38 scoped declaration hashes/leak check.

**Checks performed:** Read the complete requirement, current cited code/assertions and retained receipts; compared scoped input hashes. No newly executed behavior result. All global input/head/host limits above apply.

**W02-10-X20 (Coordinator immutable new package snapshot only for changed inputs):** After fixes settle, reconcile source/declaration changes and regenerate only affected package/API evidence if required. Keep unchanged grid API fixture evidence; include any new public props/types in the actual tarball fixture.

**Required evidence:** Installed tarball hash, generic/ref/payload negative assertions, CSS emission, isolated module graphs and declaration leak result; no source-alias-only typecheck passed off as consumer proof. This successor is unrun.

## A-X-21 — complete

**Original:** Reconcile original `X-21`: Preserve and adapt the existing test/story inventory; add missing meaningful stories rather than assuming every existing test validates browser behavior. Historical status: open.

- Approved replacement-host ledger preserves102 original browser specs,164 fixture IDs and75 scenario modules, recording provenance separately from new host evidence.
- Existing tests retain scenario/assertion identities under /fixtures; ordinary docs-owned React fixtures replace removed Storybook runtime. New meaningful grid busy/clipboard/race/reorder cases and production docs playground/source compilation supplement rather than erase original inventory.
- Current FA-04 fixture build and preserved original plus corrected unit evidence support adapted inventory. Inventory preservation does not prove every test is native, all new behavior acceptance, AT or the20 open editor V leaves.

**Current source:** `docs/developer/docs-fixture-migration.md`; `docs/developer/docs-website.md`; `apps/docs/native-fixtures/generate-registry.mjs`.

**Tests/assertions:** `packages/ui/tests/browser/batch01-grid-focus.spec.ts`; `packages/ui/tests/browser/batch05-grid-clipboard.spec.ts`; `packages/ui/tests/browser/grid-server-response-races.spec.ts`.

**Retained evidence and limits:** Approved DOCS005 migration receipt and FA-04 build retained; original historical Storybook evidence is never relabeled as new native-host execution.

**Checks performed:** Read the complete requirement, current cited code/assertions and retained receipts; compared scoped input hashes. No newly executed behavior result. All global input/head/host limits above apply.

## Handoff and artifact validation

The [machine-readable results](results.json) contain exactly one record per assigned ID, complete wording, status, evidence/test/source refs, actual checks, limits and successor deliverables. The [manual review sheet](manual-review-matrix.json) makes X11’s six-category operator prerequisite concrete; every observation remains unrun. Recover existing results before scheduling replacement execution. Coordinate overlapping X16/X18 and prior P10-D16/P10-D17 successors once.

Validation performed: parsed JSON, asserted25 unique assigned IDs/status totals, checked referenced repository files exist, checked38 grid declaration comparisons/leak results and rehashed production source/test inputs at delivery. No conclusion changes shared acceptance counts.
