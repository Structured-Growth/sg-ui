# Wave 03-21 — grid reorder acceptance

Both assigned leaves remain **partial**. Seven focused new DOM regression cases pass against current production source on Node 24.21.0. The ready-to-apply patch adds the regression file and precise processing-policy documentation; it does not change runtime behavior. Physical long-press dragging and actual spoken AT output require an external operator and remain unrun. No central acceptance counts or checklists changed.

## Concrete deliverables

`reorder-policy.patch` and matching `proposed-files/` contain:

- `packages/ui/src/components/AppDataGrid/AppDataGrid.reorder-policy.test.tsx`: seven cases covering sorting, filtering and pagination guards becoming active during keyboard drag; removal of those guards restoring exactly one Move request; exact source/target payloads, unchanged host rows, request announcement; keyboard cancellation preserving a sibling grid's selection/order with colliding IDs, then one independent sibling Move request.
- `docs/developer/react-aria-grid-reorder.md`: clarifies that criteria disable reorder even when visible ordering happens to be unchanged, multipage reduction disables it, and the library does not clear criteria or reinterpret a move as page-local. Corrects the broad cross-grid gap wording by distinguishing existing pointer tests from outstanding physical touch.

`physical-touch-and-at.md` provides exact physical before/after, cancel, rollback, invalidation, cross-grid and AT cases on the existing fixtures. `physical-input-recorder.js` is a runnable passive device-console observer for trusted input, coordinates, focus, order, request counts, status and cleanup. It never dispatches input or invokes callbacks. The protocol requires independent physical device identity and spoken-output recording; trusted events alone are not physical-device evidence. It explicitly calls out that the invalidation strip uses native dragenter and may need a coordinator fixture adaptation on a device using another touch interaction.

`validation-plan.json` gives exact integration/unit/native commands and expected assertions. There is no requested shared install, build, catalog generation or packed run because no runtime/API/fixture source changes are proposed. No production fix was invented: the current implementation passes these seven cases.

## Input reconciliation and retained evidence

Read AGENTS.md, the final acceptance ledger, assignment and both prior reports/results before work. Assignment report/result hashes authenticate against the current prior files (see results.json). `input-reconciliation.json` compares 212 scoped dependency/test/document inputs against wave-02-02. 210 are unchanged. Only `ownedGridColumns.ts` and `ownedGridModel.ts` changed; both match the coordinator's integrated reserved-column fix snapshot. The interaction, helper, handle, reorder tests and fixtures are unchanged. All 145 selected built library and private fixture output files match `coordinator-integration/evidence.json`; no output was rebuilt. Delivery recheck found no input changes since capture.

Retain the exact limits of earlier evidence rather than relabeling it current device execution:

- **F-C18:** shipped public `rowDrag`, owned handle/helper, production-scope preview and host-owned reorder composition; reconciled by wave-02-02 A-M-18 and `react-aria-grid-reorder.md`.
- **T-C18:** `docs/developer/parallel-next100/next100-c18.md` maps 01–05/90/91 to exact unit/native cases and historical hashes/runtime. FA-04's accepted unchanged unit evidence remains historical; this work runs only the seven new cases.
- **V-C18:** `docs/developer/backlog-execution-2026-10-15.md:720` retains HB17 three-engine checks, density/text/RTL bounds and source focus/host reorder. Raw HB17 artifacts absent locally were not reinspected. `react-aria-browser-acceptance.md:109` retains trusted pointer before/after/outside/rollback and emulated touchscreen Move; neither certifies physical touch or spoken AT.
- `inventory-pointer-reorder-invalidation.spec.ts` already has actual-pointer specs for dataset and identity replacement and release over another grid with colliding IDs. This is existing executable coverage, not a new run here. It remains distinct from the unrun physical-touch equivalent.

The coordinator integration receipt's 21 native executions concern its named fix scope, not a new reorder run. No unrelated editor/calendar evidence is borrowed.

## A-M-18 — partial

Original requirement: “Reconcile AppDataGridRowDnd final acceptance: Replace DOM selectors/ghost styling; keyboard/touch/reorder/cancel behavior. Link its F-C18, T-C18 and V-C18 evidence and any unresolved defects.”

Owned selector/preview cleanup and existing pointer/keyboard/Move/rollback evidence remain valid within their dated scope. New seven-case DOM evidence confirms criteria transitions and sibling keyboard cancellation. No stale callback or source mutation was observed. This does not satisfy the remaining physical long-press before/after/cancel/invalidation/rollback requirement. The patch still needs coordinator integration; its successful execution is on the mirrored test with production relative imports remapped by the owned config, not a claim of integration.

Residual **M18-native-touch**: execute the named physical-device cases in `physical-touch-and-at.md`, preserve real event/video trace, exactly zero requests on cancellation or invalidation, exactly one on commit, expected order, rollback and source focus. If the device never starts drag or the strip cannot trigger invalidation, preserve the failure/unrun evidence and prepare a concrete platform fix. No acceptance waiver is inferred.

## A-G-17 — partial

Original requirement: “Define row reordering for pointer, touch, keyboard and non-drag actions; announce changes, support cancel, and define behavior when sorting/filtering/pagination is active. Historical status: open.”

The current model requires complete client page zero fitting one page, no criteria or pending/error state and at most one selected ID. The proposal preserves it. Tests prove static guards can be removed without mutating rows, active criteria suppress the captured keyboard request, a subsequent Move requests once, the request announcement does not claim persistence, and keyboard cancellation leaves the sibling owner unchanged. Existing pointer/cross-grid and emulated Move evidence remains separately scoped.

Residual **W02-10-G17**: named physical-touch and AT operator must execute actual drag/cancel/drop and spoken source/target/cancel/request versus saved/failure output, including colliding-ID sibling isolation. Retain the passing processing-policy cases as DOM evidence, not speech or device evidence. Exact device/browser/OS/AT versions and source/host hashes are mandatory evidence fields in the protocol.

## Commands and results

Actual successful command from repository root, using the inspected existing lease wrapper:

```sh
/Users/thomashall/.npm/_npx/387698761821791d/node_modules/node/bin/node /tmp/sgui-calendar-validate.mjs /Users/thomashall/.npm/_npx/387698761821791d/node_modules/node/bin/node packages/ui/node_modules/vitest/vitest.mjs run --config docs/developer/final-acceptance/wave-03-21/vitest.proposal.config.mjs
```

`unit-attempt-4.txt`: **1 suite, 7 tests pass, 2.28s**, Node v24.21.0, Vitest 4.1.11, React/React DOM 19.2.3, jsdom 26.1.0. Config redirects only proposal imports to the real production grid and Provider and resolves bare packages from the library; no production modules are mocked. This is DOM emulation. Node 22, native browsers, physical devices, real zoom and AT were not executed.

Attempts 1 and 2 retain config/dependency resolution startup failures with zero tests. Attempt 3 encountered an occupied lease and started no validation; no bypass, reclaim or spinning occurred. Independent protocol/hash work continued before the later admitted successful run. All logs remain preserved. `execution.json` records exact commands/runtime and limitations.

`git apply --check docs/developer/final-acceptance/wave-03-21/reorder-policy.patch` passed; no patch was applied. Node 24 `--check physical-input-recorder.js` passed syntax only. No new conversations, agents, server startup, broad suites, shared builds, Git mutations, generated-output edits or user workspace changes occurred. Final artifact hashes are in `artifact-hashes.json`.
