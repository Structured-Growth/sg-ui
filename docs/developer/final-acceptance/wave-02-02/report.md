# Wave 02-02 — grid and toolbar final acceptance

**17 complete, 3 partial, zero blocked** proposed dispositions across all 20 assigned leaves. The coordinator retains ownership of shared closure counts. Source defect **GRID-R1** keeps A-G-02/A-M-16 open; physical touch dragging remains an A-M-18 obligation. No implementation changed.

## Evidence and limits

Read the full current original requirements rather than inheriting historical checkmarks. Reused FA-01–04 and the parallel reconciliation. New input evidence is based on modified dev HEAD 540f47d4059a9cea8890b80927f34f51ef2fbc3e, with per-file SHA-256: 200 dependency files, 42 selected unit test files and supporting fixtures/docs (315 inputs total). Every dependency and selected unit test matches FA-02; only the current shared hardening checklist and execution receipt differ in this selected inventory. Final source stability comparison: 0 changed source inputs.

FA-04 originally passed 275 suites and failed four calendar suites, which were separately corrected; the retained complete accepted unit reconciliation is preserved. None of the assigned grid suites was in the failed set. No existing suite was rerun. All new execution is the small pure-helper characterization in capture.cjs, running Node v26.5.0 with in-memory TypeScript transpilation; this is not new Node 24/22 validation. See [checks.txt](checks.txt) and [input-evidence.json](input-evidence.json).

The accepted F-C16–C20 source/examples, T family cases in parallel-next100/next100-c16.md through next100-c20.md, and canonical V execution receipts are explicitly linked per component below. The active baseline/regression files contain no individual completed rows by user request. Historical notes that a grid batch was internal-only or public reset was pending are superseded by shipped source and later accepted evidence, not repeated as current defects. The current host is the docs-owned native fixture host; earlier Storybook receipt provenance remains historical.

Accepted HB17 native/visual results: Chromium 32 new + 14 existing grid cases; Firefox/WebKit 46 each; light/dark × compact/comfortable × English/Arabic RTL at 360px/150% text, screenshots reviewed as recorded in backlog-execution-2026-10-15.md:720–765. HB18 retains/follows Arabic proof labels. Raw packages/ui/artifacts/hb17-fixed-2026-10-16 is absent locally; the canonical accepted receipt is reused, without claiming raw screenshot reinspection or an exact current docs-host output manifest. Root artifacts/browser-results.json targets pre-workspace paths and was deliberately not borrowed as current evidence. Complete future production/native/consumer gates and 20 editor V leaves remain open independently.

## Current behavior and new defect

[behavior.md](behavior.md) is the new A-B-08 policy snapshot covering selection, processing, server races, columns, reorder, cards, callbacks and alignment. It includes exact reproduction and expected remediation for GRID-R1: createOwnedGridColumns and processOwnedGridRows accept field __reorder even though ownedGridInteraction allocates that same Column ID for rowDrag. New helper checks establish validator acceptance; no rendered crash or native failure was invented. Implementation successor reserves actual utility IDs in both validators, adds focused regressions, and checks affected units/types.

## Leaf dispositions

### A-M-16 — partial

Original: A-M-16 Reconcile AppDataGrid final acceptance: Complete owned grid implementation, types and helpers; follow G tasks. Link its `F-C16`, `T-C16` and `V-C16` evidence and any unresolved defects.

Owned public renderer, generic contracts, cell/helper mappings and phase evidence exist. Full G acceptance is broader than those mappings; new GRID-R1 allows an internal reorder field ID. F-C16/T-C16 evidence is linked below and accepted V-C16 evidence retained; neither removes the defect or remaining G gates.

Sources: `packages/ui/src/components/AppDataGrid/AppDataGrid.tsx`, `packages/ui/src/components/AppDataGrid/types.ts`, `packages/ui/src/components/AppDataGrid/ownedGridInteraction.tsx`, `packages/ui/src/components/AppDataGrid/ownedGridColumns.ts`, `packages/ui/src/components/AppDataGrid/ownedGridModel.ts`.

Tests/evidence: `packages/ui/src/components/AppDataGrid/AppDataGrid.test.tsx`, `packages/ui/src/components/AppDataGrid/AppDataGrid.cells.test.tsx`, `packages/ui/src/components/AppDataGrid/ownedGridModel.test.ts`, `docs/developer/parallel-next100/next100-c16.md`. Accepted V receipt: `docs/developer/backlog-execution-2026-10-15.md:720–765`; `docs/developer/react-aria-hardening-execution.md:133–144`. Current scoped input hashes and retained FA04 limits apply; no fresh suite/native run.

Required successors: **GRID-R1**: Reject __reorder consistently in presentation and processing field validation using actual utility IDs; retain legacy reserved names. Add failing-first model/column checks and one public rowDrag composition proving rejection before duplicate collection IDs. Run affected existing units and type validation. Reproduction: capture.cjs / checks.txt; no rendered failure claimed. **M16-G-gates**: Coordinator must reconcile remaining G-15–G-29 original obligations independently, especially full focus/scroll, workload/performance, physical touch/AT and exact-artifact gates; retain required deferrals only where explicitly approved. Attach resulting evidence to M16 rather than closing it from the baseline.

### A-M-17 — complete

Original: A-M-17 Reconcile AppDataGridShell final acceptance: Grid/card modes, shared state, toolbar/footer, responsive shell. Link its `F-C17`, `T-C17` and `V-C17` evidence and any unresolved defects.

Shell shares one processed page and owner across toolbar/list/cards/footer, supports independently controlled/default concerns, responsive wrapping/local scrolling, accepted-page focus and persisted/reset state. F-C17 maps to shipped ReadyShell and its usable docs example; T-C17 named tests plus accepted V-C17 native/responsive receipt substantiate this named shell obligation.

Sources: `packages/ui/src/components/AppDataGridShell/AppDataGridShell.tsx`, `packages/ui/src/components/AppDataGridShell/AppDataGridShell.module.css`, `apps/docs/examples/GridHostExamples.tsx`.

Tests/evidence: `packages/ui/src/components/AppDataGridShell/AppDataGridShell.test.tsx:16`, `packages/ui/src/components/AppDataGridShell/AppDataGridShell.test.tsx:200`, `packages/ui/src/components/AppDataGridShell/AppDataGridShell.test.tsx:403`, `packages/ui/src/components/AppDataGridShell/AppDataGridShell.test.tsx:489`, `docs/developer/parallel-next100/next100-c17.md`. Accepted V receipt: `docs/developer/backlog-execution-2026-10-15.md:720–765`; `docs/developer/react-aria-hardening-execution.md:133–144`. Current scoped input hashes and retained FA04 limits apply; no fresh suite/native run.

No additional deliverable remains for this named leaf. Separate cross-library/production gates are not closed by this disposition.

### A-M-18 — partial

Original: A-M-18 Reconcile AppDataGridRowDnd final acceptance: Replace DOM selectors/ghost styling; keyboard/touch/reorder/cancel behavior. Link its `F-C18`, `T-C18` and `V-C18` evidence and any unresolved defects.

Owned row selectors, token-scoped preview and cleanup, exact host requests, bounded keyboard/pointer drag, Escape and Move alternatives are implemented and covered. F/T-C18 and accepted V-C18 receipts retained. Trusted emulated touch Move taps do not establish physical long-press touch drag/cancel, and broad touch/AT claims in the original scope are not waived.

Sources: `packages/ui/src/components/AppDataGridRowDnd/useDataGridRowDnd.ts`, `packages/ui/src/components/AppDataGridRowDnd/DataGridDragHandle.tsx`, `packages/ui/src/components/AppDataGridRowDnd/DataGridDragHandle.module.css`, `packages/ui/src/components/AppDataGrid/ownedGridInteraction.tsx`, `docs/developer/react-aria-grid-reorder.md`.

Tests/evidence: `packages/ui/src/components/AppDataGrid/AppDataGrid.reorder.test.tsx`, `packages/ui/src/components/AppDataGrid/AppDataGrid.pointer-invalidation.test.tsx`, `packages/ui/src/components/AppDataGridRowDnd/useDataGridRowDnd.test.tsx`, `packages/ui/tests/browser/reorder.spec.ts`, `docs/developer/parallel-next100/next100-c18.md`. Accepted V receipt: `docs/developer/backlog-execution-2026-10-15.md:720–765`; `docs/developer/react-aria-hardening-execution.md:133–144`. Current scoped input hashes and retained FA04 limits apply; no fresh suite/native run.

Required successors: **M18-native-touch**: On a named physical touch device/browser, exercise long-press drag before/after, outside/Escape-equivalent cancellation, invalidated rows and host failure rollback; record no callback on cancel, exact single callback on commit, order and focus. Preserve existing Move alternative. Retain spoken drag announcements under the separate AT acceptance gate; do not substitute source or emulated taps.

### A-M-19 — complete

Original: A-M-19 Reconcile LearnerClassesDataGrid final acceptance: Owned model/columns, date/link/action cells, host callbacks and state. Link its `F-C19`, `T-C19` and `V-C19` evidence and any unresolved defects.

Learner composition owns translated model-derived columns, raw due-date formatting, encoded Details/Continue URLs with safe target/rel and forwards owned state/host callbacks. F-C19 source and usable fixture, T-C19 current named assertions and accepted V-C19 native/RTL receipt cover the named obligation. Earlier T-C19 wording requesting a nonexistent status/date-link column is superseded by the shipped course-name link/due-date/Details/Continue mapping.

Sources: `packages/ui/src/components/LearnerClassesDataGrid/LearnerClassesDataGrid.tsx`, `packages/ui/src/models.ts`, `apps/docs/native-fixtures/scenarios/components/LearnerClassesDataGrid/LearnerClassesDataGrid.native.fixture.tsx`.

Tests/evidence: `packages/ui/src/components/LearnerClassesDataGrid/LearnerClassesDataGrid.test.tsx:20`, `packages/ui/src/components/LearnerClassesDataGrid/LearnerClassesDataGrid.test.tsx:36`, `packages/ui/src/components/LearnerClassesDataGrid/LearnerClassesDataGrid.next100-regression.test.tsx:18`, `packages/ui/src/components/LearnerClassesDataGrid/LearnerClassesDataGrid.next100-regression.test.tsx:57`, `docs/developer/parallel-next100/next100-c19.md`. Accepted V receipt: `docs/developer/backlog-execution-2026-10-15.md:720–765`; `docs/developer/react-aria-hardening-execution.md:133–144`. Current scoped input hashes and retained FA04 limits apply; no fresh suite/native run.

No additional deliverable remains for this named leaf. Separate cross-library/production gates are not closed by this disposition.

### A-M-20 — complete

Original: A-M-20 Reconcile DataToolbar final acceptance: Search, refresh, selection/sort/filter/columns menus, badge, view switching. Link its `F-C20`, `T-C20` and `V-C20` evidence and any unresolved defects.

Search/clear/Escape, refresh, selected content/count, selection/sort/filter/columns menus, active badges, column moves and controlled list/cards requests are shipped. F-C20 maps to current source/fixtures; T-C20 report is reconciled with current tests and accepted V-C20 native/container/RTL receipt. Selected actions and left split action are host slots; unsupported callbacks disable their actions.

Sources: `packages/ui/src/components/DataToolbar/DataToolbar.tsx`, `packages/ui/src/components/DataToolbar/components/DataToolbarFilterMenu.tsx`, `packages/ui/src/components/DataToolbar/components/DataToolbarSortMenu.tsx`, `packages/ui/src/components/DataToolbar/components/DataToolbarColumnsMenu.tsx`, `apps/docs/native-fixtures/scenarios/components/DataToolbar/DataToolbar.fixture.tsx`.

Tests/evidence: `packages/ui/src/components/DataToolbar/DataToolbar.test.tsx`, `packages/ui/src/components/DataToolbar/DataToolbar.next100-regression.test.tsx`, `packages/ui/src/components/DataToolbar/DataToolbar.native-composition.test.tsx`, `docs/developer/parallel-next100/next100-c20.md`. Accepted V receipt: `docs/developer/backlog-execution-2026-10-15.md:720–765`; `docs/developer/react-aria-hardening-execution.md:133–144`. Current scoped input hashes and retained FA04 limits apply; no fresh suite/native run.

No additional deliverable remains for this named leaf. Separate cross-library/production gates are not closed by this disposition.

### A-B-08 — complete

Original: A-B-08 Reconcile original `B-08`: Record current grid behavior, including selection across pages, sorting, filtering, column visibility, row drag, card mode, and server callbacks. Historical status: open.

Created behavior.md: explicit current policy for cross-page selection, client processing, controlled/server callbacks and stale responses, visibility/width/order, bounded drag and shared cards. Includes known GRID-R1 and exact evidence/limits rather than assuming historical checkbox closure.

Sources: `packages/ui/src/components/AppDataGrid/ownedGridModel.ts`, `packages/ui/src/components/AppDataGrid/ownedGridState.ts`, `packages/ui/src/components/AppDataGrid/ownedGridInteraction.tsx`, `packages/ui/src/components/AppDataGridShell/AppDataGridShell.tsx`, `apps/docs/examples/GridHostExamples.tsx`.

Tests/evidence: `packages/ui/src/components/AppDataGrid/ownedGridModel.test.ts`, `packages/ui/src/components/AppDataGrid/ownedGridState.test.ts`, `packages/ui/src/components/AppDataGridShell/AppDataGridShell.test.tsx`, `packages/ui/src/components/AppDataGridShell/AppDataGridShell.server-response-races.test.tsx`. Current scoped input hashes and retained FA04 limits apply; no fresh suite/native run.

No additional deliverable remains for this named leaf. Separate cross-library/production gates are not closed by this disposition.

### A-G-01 — complete

Original: A-G-01 Reconcile original `G-01`: Create a capability matrix with required parity, agreed enhancements, and explicitly deferred spreadsheet/analytics features. [Design review](react-aria-grid-contracts.md); runtime parity remains open. Historical status: checked.

Reconciled the existing complete capability matrix against shipped owners: nine cell types, ordered processing, host server requests, page selection, shared cards, locks/actions/order/resizing/reorder/persistence. Explicitly deferred true pinning, expansion/grouping/editing and spreadsheet/analytics features remain in the matrix. Runtime conformance remains separate; GRID-R1 is retained under G02/M16.

Sources: `docs/developer/react-aria-grid-contracts.md:22-47`, `docs/developer/react-aria-grid-decision.md`, `docs/developer/react-aria-catalog-grid.md`.

Tests/evidence: `packages/ui/src/components/AppDataGrid/AppDataGrid.cells.test.tsx`, `packages/ui/src/components/AppDataGrid/ownedGridModel.test.ts`, `packages/ui/src/components/AppDataGridShell/AppDataGridShell.test.tsx`. Current scoped input hashes and retained FA04 limits apply; no fresh suite/native run.

No additional deliverable remains for this named leaf. Separate cross-library/production gates are not closed by this disposition.

### A-G-02 — partial

Original: A-G-02 Reconcile original `G-02`: Define owned row IDs, column IDs, accessors, cell renderers, value formatting, action callbacks, row models, and generic typing. [Target contracts](react-aria-grid-contracts.md); M-16 implementation/declaration validation remains open. Historical status: checked.

Owned generic IDs/accessors/formatters/renderers/action callbacks and public helpers are established and typed; original-row payload tests pass in retained evidence. Reserved-field contract is incomplete: __reorder is accepted by both validators while the renderer allocates the same ID. New isolated characterization confirms this gap.

Sources: `packages/ui/src/components/AppDataGrid/types.ts`, `packages/ui/src/components/AppDataGrid/ownedGridColumns.ts:40`, `packages/ui/src/components/AppDataGrid/ownedGridModel.ts`, `packages/ui/src/components/AppDataGrid/ownedGridInteraction.tsx:386`, `packages/ui/src/components/AppDataGrid/createDataGridColumns.tsx`, `packages/ui/src/components/AppDataGrid/createActionMenuColumn.ts`.

Tests/evidence: `packages/ui/src/components/AppDataGrid/ownedGridColumns.test.ts`, `packages/ui/src/components/AppDataGrid/ownedGridModel.test.ts`, `packages/ui/src/components/AppDataGrid/AppDataGrid.cells.test.tsx`. Current scoped input hashes and retained FA04 limits apply; no fresh suite/native run.

Required successors: **GRID-R1**: Reject __reorder consistently in presentation and processing field validation using actual utility IDs; retain legacy reserved names. Add failing-first model/column checks and one public rowDrag composition proving rejection before duplicate collection IDs. Run affected existing units and type validation. Reproduction: capture.cjs / checks.txt; no rendered failure claimed.

### A-G-03 — complete

Original: A-G-03 Reconcile original `G-03`: Define controlled/default selection, sort, filters, pagination, visibility, order, width, and expansion; one state owner per concern. [State authority](react-aria-grid-contracts.md#state-authority-and-transactions); expansion explicitly deferred, runtime integration remains open. Historical status: checked.

Explicit controlled/default records exist for selection, sort/filter/search/page, visibility/order/width and shell view. Callback-only concerns stay writable; defaults seed once, controlled values remain authoritative, snapshots are copied, one criteria transaction and shell processing owner. Expansion intentionally has no inert state/prop under approved deferral.

Sources: `packages/ui/src/components/AppDataGrid/ownedGridController.ts`, `packages/ui/src/components/AppDataGrid/ownedGridLayoutController.ts`, `packages/ui/src/components/AppDataGrid/ownedGridState.ts`, `packages/ui/src/components/AppDataGridShell/AppDataGridShell.tsx`, `docs/developer/react-aria-grid-contracts.md#state-authority-and-transactions`.

Tests/evidence: `packages/ui/src/components/AppDataGrid/ownedGridController.test.ts`, `packages/ui/src/components/AppDataGrid/ownedGridLayoutController.test.tsx`, `packages/ui/src/components/AppDataGrid/ownedGridState.test.ts`, `packages/ui/src/components/AppDataGridShell/AppDataGridShell.test.tsx:200`. Current scoped input hashes and retained FA04 limits apply; no fresh suite/native run.

No additional deliverable remains for this named leaf. Separate cross-library/production gates are not closed by this disposition.

### A-G-04 — complete

Original: A-G-04 Reconcile original `G-04`: Support client filtering before sorting and pagination; implement stable null/date/number/text semantics with tests. Historical status: open.

Client filter/search happens before TanStack stable ordered sorting and page slicing. Declared type drives numeric strings/invalid/null semantics, UTC date-day matching, natural/base text comparison and stable tie retention. Current tests cover every operator, combined processing, invalid operands, frozen rows and later pages; retained FA04 evidence covers unchanged tests.

Sources: `packages/ui/src/components/AppDataGrid/ownedGridModel.ts:85`, `packages/ui/src/components/AppDataGrid/ownedGridModel.ts:203`.

Tests/evidence: `packages/ui/src/components/AppDataGrid/ownedGridModel.test.ts:30`, `packages/ui/src/components/AppDataGrid/ownedGridModel.test.ts:163`, `packages/ui/src/components/AppDataGrid/ownedGridProcessing.test.tsx`. Current scoped input hashes and retained FA04 limits apply; no fresh suite/native run.

No additional deliverable remains for this named leaf. Separate cross-library/production gates are not closed by this disposition.

### A-G-05 — complete

Original: A-G-05 Reconcile original `G-05`: Support server mode through host callbacks, known/unknown totals, pending/error/refresh states, and stale-request handling examples; the grid does not fetch platform APIs. Historical status: open.

Server input is not filtered/sorted/sliced locally; rowCount or hasNextPage controls totals. Public pending/error/retry/refresh props retain rows. Host fake-transport fixture and docs source explicitly discard stale success/error and settlement after disposal before all state writes. Grid does not fetch application APIs. This fulfills the requested host pattern, not production-network certification.

Sources: `packages/ui/src/components/AppDataGrid/ownedGridModel.ts`, `packages/ui/src/components/AppDataGrid/ownedGridParts.tsx`, `packages/ui/src/components/AppDataGridShell/AppDataGridShell.server-response-races.native-fixture.tsx`, `apps/docs/examples/GridHostExamples.tsx`.

Tests/evidence: `packages/ui/src/components/AppDataGrid/AppDataGrid.test.tsx:44`, `packages/ui/src/components/AppDataGridShell/AppDataGridShell.test.tsx:235`, `packages/ui/src/components/AppDataGridShell/AppDataGridShell.server-response-races.test.tsx:21`, `packages/ui/src/components/AppDataGridShell/AppDataGridShell.server-response-races.test.tsx:92`. Current scoped input hashes and retained FA04 limits apply; no fresh suite/native run.

No additional deliverable remains for this named leaf. Separate cross-library/production gates are not closed by this disposition.

### A-G-06 — complete

Original: A-G-06 Reconcile original `G-06`: Preserve first-column checkboxes, mixed header state, selected count, select-none, and explicit current-page versus all-matching selection semantics. Historical status: open.

First utility selection column is checkbox-based, header mixed state counts unique selectable page IDs, page action operates current page only and None clears retained set. Selected count comes from shell retained ID set. All-matching selection is explicitly deferred; unloaded IDs are not advertised as loaded rows.

Sources: `packages/ui/src/components/AppDataGrid/ownedGridInteraction.tsx:364`, `packages/ui/src/components/AppDataGrid/ownedGridState.ts:100`, `packages/ui/src/components/AppDataGridShell/AppDataGridShell.tsx`, `docs/developer/react-aria-catalog-grid.md`.

Tests/evidence: `packages/ui/src/components/AppDataGrid/ownedGridState.test.ts:76`, `packages/ui/src/components/AppDataGrid/ownedGridState.test.ts:82`, `packages/ui/src/components/AppDataGrid/AppDataGrid.test.tsx:36`, `packages/ui/src/components/AppDataGridShell/AppDataGridShell.test.tsx:16`. Current scoped input hashes and retained FA04 limits apply; no fresh suite/native run.

No additional deliverable remains for this named leaf. Separate cross-library/production gates are not closed by this disposition.

### A-G-07 — complete

Original: A-G-07 Reconcile original `G-07`: Preserve selection through sort/filter/page changes according to documented policy; handle disabled/deleted rows and avoid treating unloaded rows as known. Historical status: open.

Sort/filter/search/page/view transitions preserve selected IDs. Page updates merge only selectable loaded IDs, preserving previously disabled/off-page IDs. Host-controlled selection is the explicit deletion reconciliation signal; disappearing server page rows never silently prune. Tests retain IDs through disabled/disappearing rows, unknown totals and controlled rejection.

Sources: `packages/ui/src/components/AppDataGrid/ownedGridState.ts`, `packages/ui/src/components/AppDataGrid/ownedGridInteraction.tsx:364`, `packages/ui/src/components/AppDataGrid/ownedGridController.ts`, `docs/developer/react-aria-grid-contracts.md`, `docs/developer/react-aria-catalog-grid.md`.

Tests/evidence: `packages/ui/src/components/AppDataGrid/ownedGridState.test.ts:76`, `packages/ui/src/components/AppDataGrid/AppDataGrid.test.tsx:36`, `packages/ui/src/components/AppDataGridShell/AppDataGridShell.test.tsx:235`, `packages/ui/src/components/AppDataGridShell/AppDataGridShell.test.tsx:365`. Current scoped input hashes and retained FA04 limits apply; no fresh suite/native run.

No additional deliverable remains for this named leaf. Separate cross-library/production gates are not closed by this disposition.

### A-G-08 — complete

Original: A-G-08 Reconcile original `G-08`: Preserve sort menus, direction indicators, clear sort, priority order, and multi-sort where promised; expose sortable affordances to keyboard/touch as well as hover. Historical status: open.

Header menus remain visible and focusable independently of hover, direction/aria-sort reflects accepted rules, chosen field promotes priority, individual clear preserves remaining rules and toolbar Reset/Apply clears all. Keyboard and non-drag priority controls retain canonical rules; native keyboard spec and accepted receipts supplement unchanged unit assertions. Presence of touch-sized owned buttons is not a physical-device result.

Sources: `packages/ui/src/components/AppDataGrid/ownedGridParts.tsx:26`, `packages/ui/src/components/AppDataGrid/ownedGridParts.module.css`, `packages/ui/src/components/AppDataGrid/ownedGridColumns.ts:66`, `packages/ui/src/components/DataToolbar/components/DataToolbarSortMenu.tsx`.

Tests/evidence: `packages/ui/src/components/AppDataGrid/ownedGridSortAcceptance.test.tsx:22`, `packages/ui/src/components/AppDataGrid/ownedGridSortAcceptance.test.tsx:67`, `packages/ui/src/components/AppDataGrid/ownedGridSortAcceptance.test.tsx:93`, `packages/ui/src/components/DataToolbar/components/DataToolbarSortMenu.test.tsx:59`, `packages/ui/tests/browser/batch06-grid-sort.spec.ts`. Accepted V receipt: `docs/developer/backlog-execution-2026-10-15.md:720–765`; `docs/developer/react-aria-hardening-execution.md:133–144`. Current scoped input hashes and retained FA04 limits apply; no fresh suite/native run.

No additional deliverable remains for this named leaf. Separate cross-library/production gates are not closed by this disposition.

### A-G-09 — complete

Original: A-G-09 Reconcile original `G-09`: Preserve shared filterFields/filterRules/onFilterRulesChange wiring, supported operators, canonical options, no-rule All semantics, active badge and page reset. Historical status: open.

Shell co-wires fields/rules/change; active filter count sanitizes against current schema. Menu supports string/number/date/enum operators and host canonical enum IDs, no-rule All (including negated enum), Apply/Cancel drafts; state transition resets page before filter callback and emits one combined snapshot. Host dynamic metadata owns option availability.

Sources: `packages/ui/src/components/AppDataGridShell/AppDataGridShell.tsx`, `packages/ui/src/components/DataToolbar/components/DataToolbarFilterMenu.tsx`, `packages/ui/src/components/DataToolbar/filterRuleValue.ts`, `packages/ui/src/components/AppDataGrid/ownedGridState.ts`.

Tests/evidence: `packages/ui/src/components/DataToolbar/components/DataToolbarFilterMenu.test.tsx:36`, `packages/ui/src/components/DataToolbar/components/DataToolbarFilterMenu.test.tsx:143`, `packages/ui/src/components/DataToolbar/components/DataToolbarFilterMenu.test.tsx:177`, `packages/ui/src/components/AppDataGridShell/AppDataGridShell.test.tsx:200`. Current scoped input hashes and retained FA04 limits apply; no fresh suite/native run.

No additional deliverable remains for this named leaf. Separate cross-library/production gates are not closed by this disposition.

### A-G-10 — complete

Original: A-G-10 Reconcile original `G-10`: Preserve search, refresh, selected-actions menu, column menu, card/grid switching, and toolbar split-action visual conventions. Historical status: open.

Toolbar/shell expose search/clear/refresh, selected-content slot/count, selected actions component, columns and controlled list/cards switching. Neutral outlined SplitAction is the documented host-composed left action, backed by actual native fixture and owned joined-group tokens; arbitrary host nodes are not restyled. Functional and bounded presentation evidence retained.

Sources: `packages/ui/src/components/DataToolbar/DataToolbar.tsx`, `packages/ui/src/components/DataToolbar/components/DataToolbarSelectionMenu.tsx`, `packages/ui/src/experimental/SplitAction/SplitAction.tsx`, `packages/ui/src/experimental/ButtonGroup/ButtonGroup.module.css`, `apps/docs/native-fixtures/scenarios/components/DataToolbar/DataToolbar.fixture.tsx:62`.

Tests/evidence: `packages/ui/src/components/DataToolbar/DataToolbar.test.tsx`, `packages/ui/src/components/DataToolbar/components/DataToolbarSelectionMenu.test.tsx`, `packages/ui/src/components/AppDataGridShell/AppDataGridShell.test.tsx:16`, `packages/ui/src/experimental/SplitAction/SplitAction.test.tsx`. Accepted V receipt: `docs/developer/backlog-execution-2026-10-15.md:720–765`; `docs/developer/react-aria-hardening-execution.md:133–144`. Current scoped input hashes and retained FA04 limits apply; no fresh suite/native run.

No additional deliverable remains for this named leaf. Separate cross-library/production gates are not closed by this disposition.

### A-G-11 — complete

Original: A-G-11 Reconcile original `G-11`: Preserve visibility locks for first text/actions columns; distinguish non-hideable columns from actual sticky/pinned columns in API/docs. Historical status: open.

Layout locks first declared text/link/copyable, explicit locked and menu fields visible and normalizes menus last. Columns menu disables locked visibility toggles while allowing order moves. API has locked/visibility/order and no inert pinned prop; docs explicitly distinguish visibility/order from deferred sticky pinning.

Sources: `packages/ui/src/components/AppDataGrid/ownedGridColumns.ts:73`, `packages/ui/src/components/DataToolbar/components/DataToolbarColumnsMenu.tsx`, `docs/developer/react-aria-catalog-grid.md`, `docs/developer/react-aria-grid-contracts.md`.

Tests/evidence: `packages/ui/src/components/AppDataGrid/ownedGridColumns.test.ts:12`, `packages/ui/src/components/AppDataGrid/ownedGridInteraction.test.tsx:63`, `packages/ui/src/components/DataToolbar/components/DataToolbarColumnsMenu.test.tsx:18`, `packages/ui/src/components/AppDataGridShell/AppDataGridShell.test.tsx:489`. Current scoped input hashes and retained FA04 limits apply; no fresh suite/native run.

No additional deliverable remains for this named leaf. Separate cross-library/production gates are not closed by this disposition.

### A-G-12 — complete

Original: A-G-12 Reconcile original `G-12`: Implement width/resizing/order and any agreed pinning behavior with keyboard equivalents; record feature limits instead of exposing inert props. Historical status: open.

Finite positive bounded widths/flex share the sizing core, measured container and accessible native ColumnResizer; complete resize snapshots preserve newest width and release another override to retain fill. Controlled order uses full-array Move buttons usable by keyboard; shell acceptance/rejection preserves locks/actions last. True pinning is explicitly deferred and absent from props, fixed/capped limits recorded.

Sources: `packages/ui/src/components/AppDataGrid/ownedGridColumns.ts`, `packages/ui/src/components/AppDataGrid/ownedGridInteraction.tsx:348`, `packages/ui/src/experimental/DataGrid/column-sizing.ts`, `packages/ui/src/components/DataToolbar/components/DataToolbarColumnsMenu.tsx`, `packages/ui/src/components/AppDataGrid/ownedGridLayoutController.ts`.

Tests/evidence: `packages/ui/src/components/AppDataGrid/ownedGridInteraction.test.tsx:46`, `packages/ui/src/components/AppDataGrid/ownedGridColumns.test.ts`, `packages/ui/src/components/DataToolbar/components/DataToolbarColumnsMenu.test.tsx:67`, `packages/ui/src/components/AppDataGridShell/AppDataGridShell.test.tsx:489`, `packages/ui/tests/browser/acceptance-pack-114.spec.ts`. Accepted V receipt: `docs/developer/backlog-execution-2026-10-15.md:720–765`; `docs/developer/react-aria-hardening-execution.md:133–144`. Current scoped input hashes and retained FA04 limits apply; no fresh suite/native run.

No additional deliverable remains for this named leaf. Separate cross-library/production gates are not closed by this disposition.

### A-G-13 — complete

Original: A-G-13 Reconcile original `G-13`: Keep action menus last; maintain row/cell/link activation without interfering with checkbox, copy, drag, or nested controls. Historical status: open.

Menu columns normalize last; row action resolves original row. Owned cells preserve native links/target/rel, copy and menus without changing row checkbox selection; learner Enter row action and Details navigation are independently asserted. Reorder utility controls have their own actions and source identity. No claim about arbitrary host custom content beyond host responsibility.

Sources: `packages/ui/src/components/AppDataGrid/ownedGridColumns.ts`, `packages/ui/src/components/AppDataGrid/ownedGridInteraction.tsx:372`, `packages/ui/src/components/AppDataGrid/ownedGridCells.tsx`, `packages/ui/src/components/LearnerClassesDataGrid/LearnerClassesDataGrid.tsx`.

Tests/evidence: `packages/ui/src/components/AppDataGrid/AppDataGrid.cells.test.tsx:14`, `packages/ui/src/components/LearnerClassesDataGrid/LearnerClassesDataGrid.next100-regression.test.tsx:57`, `packages/ui/src/components/AppDataGrid/AppDataGrid.reorder.test.tsx`. Accepted V receipt: `docs/developer/backlog-execution-2026-10-15.md:720–765`; `docs/developer/react-aria-hardening-execution.md:133–144`. Current scoped input hashes and retained FA04 limits apply; no fresh suite/native run.

No additional deliverable remains for this named leaf. Separate cross-library/production gates are not closed by this disposition.

### A-G-14 — complete

Original: A-G-14 Reconcile original `G-14`: Keep body text, icons, drag handles and actions vertically aligned through shared styles. Historical status: open.

Shared owned cell-content root uses flex/align-items center; table cells use vertical-align middle. Selection/reorder groups and drag handle center their content; utility controls wrap within the column after HB17 overlap fix. Retained accepted visual receipt covers light/dark, both densities, English/Arabic RTL, 360px/150% text; source confirmation does not add new screenshot/device evidence.

Sources: `packages/ui/src/components/AppDataGrid/ownedGridCells.module.css:2`, `packages/ui/src/components/AppDataGrid/ownedGridInteraction.module.css:5`, `packages/ui/src/components/AppDataGrid/ownedGridInteraction.module.css:17`, `packages/ui/src/components/AppDataGridRowDnd/DataGridDragHandle.module.css`.

Tests/evidence: `packages/ui/tests/browser/hardening-grid-presentation.spec.ts`, `packages/ui/tests/browser/reorder.spec.ts`, `packages/ui/src/components/AppDataGridRowDnd/DataGridDragHandle.test.tsx`. Accepted V receipt: `docs/developer/backlog-execution-2026-10-15.md:720–765`; `docs/developer/react-aria-hardening-execution.md:133–144`. Current scoped input hashes and retained FA04 limits apply; no fresh suite/native run.

No additional deliverable remains for this named leaf. Separate cross-library/production gates are not closed by this disposition.

## Review integrity

results.json contains one record per assigned ID with full original requirement, status, concrete sources/tests, checks actually performed, head/input/host limits and successor deliverables. No shared source, ledger, checklist, manifest, output, earlier report, server or release state was modified; no agents/conversations, installs, commits or suites were launched.
