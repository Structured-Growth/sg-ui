# Batch 113: current G-05–G-08 acceptance evidence

Inspection head: `e43bf604be74e0daf731bc990e6c3097f05ed89b` (reviewed `codex/dev` baseline).
Isolated managed worktree: `/Users/thomashall/.codex/worktrees/batch-113-evidence/sg-ui`.
Branch: `codex/batch-113-acceptance-evidence`.
Only this report and the new `tests/browser/acceptance-pack-113.spec.ts` are edited.
No inventory M-row review, source-audit rerun or parent checklist closure is claimed.
Source inspection is fresh at the inspection head; recorded execution is separately attributed below.

## Per-ID matrix

| Criterion | Status at inspection head | Concrete current support | Remaining gate / owner |
| --- | --- | --- | --- |
| G-05 | Partial acceptance; every named contract facet has implementation/example support | `ownedGridModel.ts:198–202` passes server rows through unchanged, validates known totals, uses `hasNextPage` for unknown totals. `ownedGridState.ts:71–88` emits pagination before the criterion and one complete host snapshot. `ownedGridParts.tsx:47–81` owns loading/refresh/error/retry presentation; interaction `:326–368` retains rows and exposes busy/selection state. Shell `:183–218` shares list/card state. Batch82's deferred host fixture rejects obsolete successes/errors after newer requests and disposal. | Retained seven-case Chromium shard is at candidate `7248a80…`, not the inspection head. Source fixture/spec byte identity is verified, but the whole implementation/dependency graph is not certified identical. Coordinator owns a fresh current-head checkpoint and pending Firefox/WebKit coverage. Host implementations own actual transport cancellation, stale rejection, error handling and data reconciliation. DOM status/focus assertions do not establish spoken AT acceptance. |
| G-06 | Partial acceptance; source fully supports documented page-only semantics | Interaction `:374–403` renders selection first, derives mixed header state only from selectable page IDs, and supplies Select page / None. None constructs an empty set including retained IDs. Shell `:183` displays `selectedRowIds.size`; catalog contract lines 25–40 explains retained IDs and count. Grid contracts lines 29 and 203–205 explicitly defer all-matching dataset selection; no loaded-row inference or all-matching token exists in this path. | Current-head native mixed/header/disabled-page/None coverage was missing in inspected specs. New uniquely named one-case spec is **UNRUN**, using existing RetainedSelection story only. Coordinator owns types/build/browser execution. Selected-count retained-row coverage exists in the historical shell spec; its local logs are lost. Physical devices and mixed checkbox/count announcements require separate human/AT evidence. Deferred all-matching functionality is not a defect or silently accepted capability. |
| G-07 | Partial acceptance; retention/deletion policy is explicit | `ownedGridState.ts:38–56` preserves the selected set for search/sort/filter/page changes; `:91–105` changes only selectable page IDs. Controller `:58–61` changes local selection only for selection/reset actions. Interaction `:86–87,362–368` excludes disabled IDs from new selection without pruning retained IDs. Missing server-page rows do not signal deletion. Catalog contract lines 28–36 makes host deletion reconciliation explicit; controlled selected IDs provide that authority. Existing tests assert retained disabled/off-page IDs, criterion/page retention and disappearing host rows. | Current source/unit assertions are read, not newly executed. No inspected public native fixture demonstrates a host explicitly removing only a confirmed deleted ID while preserving unloaded IDs through sort/filter/page. Reserve a bounded fixture/composed/native evidence task below; do not implement automatic pruning. New spec covers disabled page selection and clearing retained pages only, not that host deletion case. Current full engine/device/AT evidence remains open. |
| G-08 | Partial acceptance; source supports menus/directions/clear/ordered multi-sort and persistent affordance | `ownedGridParts.tsx:25–43` exposes an always-rendered named Button, checked ascending/descending items and conditional Clear Sort. Its CSS lines 2–6 has no hover visibility prerequisite; descending indicator rotates. Interaction `:359–360,385–392` uses primary `aria-sort` and shared ordered rules. Toolbar sort menu stages priority/direction/removal until Apply. Retained composition/native spec covers promotion, priority, disabled controls, Reset/Apply, clear and Enter/Alt+ArrowDown focus. | Sorting report records two Chromium passes at `816c9b9…`; raw result JSON/logs are absent at its cited artifact root now. Fixture/spec/header/toolbar bytes match that tested head, but this is historical report evidence, not a current run. Corrected composed Firefox/WebKit checkpoint, physical-touch sort activation and secondary priority/direction/clear announcements with representative AT remain open. An always-present button supports touch discoverability by source; it is not physical-touch execution proof. |

No reproducible missing production behavior was established by this read-only assignment.
None of these whole parent criteria is marked complete. Documentation/source support
can establish narrow API/ownership semantics; it cannot replace runtime or human acceptance.

## Retained executions and artifact audit

**Server races (G-05):** Read the actual JSON and logs under
`/Users/thomashall/.codex/worktrees/batch80-83-native-candidate/sg-ui/artifacts/browser-pool/df2bc745-5e76-4922-80ae-03c3ccaa0f51`.
`evidence.json` records exact candidate `7248a80d79eb50a59a2e18b7bf461f8e9d26897c`,
Node `v24.21.0`, and aggregate **failed** status (other shards failed).
`batch82/results.json` records seven Chromium results, each `passed` at retry zero;
stats: expected 7, skipped 0, unexpected 0, flaky 0. Only this shard is supported.
The configured presence of Firefox/WebKit projects is not their execution.

| Actual retained artifact | SHA-256 checked during this assignment |
| --- | --- |
| `evidence.json` | `0736e26daa7dd399c3234b5bbb3be7ea7b41e05ec4deb1b04d6ad55ba6ddbb38` |
| `batch82/results.json` | `b9033c14c1e4795ff6ba68549b9cb398697c4d634c97462aeeb67426ecb20b9d` |
| `build.log` | `755dfb6ecba7b18833bb66acb1c6931b1fc3941a8a44c16b47cb96a2614d5c5d` |
| `batch82/browser.log` | `071133e0e1be2a3d03c7af30f9a5a42ab6375e596cd0dbeca32f332edad19833` |

`/tmp/sgui-wave41-native-attribution.json` is present. Its batch82 attribution is
implementation/test head `364242198e1224bd949386288dc821aaaa12ca52`.
Inspection-head story/unit/spec SHA-256 values respectively match the retained report:
`0a96afb5d03369b77eb05ce5bb01ace549f4dcd3f997f17244c5fd76586bafc4`,
`343a2475f2bbb457f0508b5ced3103170641c8f20af5736ca741af4917d32fbb`,
`d7ac446ee4c9944d9588642326062b70218fac101fc3accb3989ca124fd8c098`.
`git diff 7248a80… HEAD -- <those three files>` was empty. This verifies the bounded
fixture/test relation, not execution of the inspection head or the entire pooled candidate.

**Sorting (G-08):** [Retained report](../parallel-batch-06/grid-sort.md) blob below
records final Chromium execution at `816c9b9b0eeb1936c979057dd19834fc93f5b441`,
2 passes, pool `c11a6b95-bd57-4ead-bdfe-7b5740fdd1ba`, and pending corrected composed
Firefox/WebKit plus device/AT. Reporting commit:
`64749a2fad89448c497760ac0c4320cbd0c1d91d`.
The cited worktree artifact root exists but contains only `storybook`; recursive
inspection found no `results.json`, `evidence.json`, `browser.log` or `build.log`.
Raw execution artifacts are therefore unavailable here. Git comparison to the tested
head is empty for sort story/unit/native spec, `ownedGridParts.tsx` and toolbar sort
implementation. No claim of a current dependency-complete matrix follows.

**Shell (G-05/G-06/G-07):** [Report](../parallel-batch-05/grid-shell-state.md)
records historical 8 Chromium/WebKit passes (four per engine) at
`556df283d8ecc5e664528a7a2a302abf0205d677`; Firefox failed before story execution.
Its cited `/tmp/batch05-grid-shell-browser.log` and `/tmp/batch05-grid-shell-unit.log`
are absent during this inspection. Keep this as report-only historical support.
The [processing report](../parallel-batch-05/grid-processing.md) supports stable
ordered sorting at `e77f604d44e38041b67aab5d9d37d6a1a0d85cd1`, not public interaction
or touch acceptance. No historical count is relabeled a current pass.

## Current-head source and Git blob anchors

All following paths were inspected at `e43bf604be74e0daf731bc990e6c3097f05ed89b`.
Blob IDs come from `git rev-parse <inspection-head>:<path>`; repository-relative
links are navigable from this report. A test blob establishes what is asserted,
not that execution passed.

| Source / contract / retained evidence | Inspection-head Git blob |
| --- | --- |
| [`docs/developer/react-aria-grid-contracts.md`](../../../docs/developer/react-aria-grid-contracts.md) | `a5bf300a3b1e31f8afdd208583d8d6f652f70fc9` |
| [`docs/developer/react-aria-catalog-grid.md`](../../../docs/developer/react-aria-catalog-grid.md) | `58c59e7e56139e470d13c5f759e23d918dc913e1` |
| [`src/components/AppDataGrid/ownedGridModel.ts`](../../../src/components/AppDataGrid/ownedGridModel.ts) | `9aec70184dc15e297f247647a67b6667d6bb0051` |
| [`src/components/AppDataGrid/ownedGridState.ts`](../../../src/components/AppDataGrid/ownedGridState.ts) | `9ef583ee584e484ef148952e6531a48635929073` |
| [`src/components/AppDataGrid/ownedGridController.ts`](../../../src/components/AppDataGrid/ownedGridController.ts) | `16617009233f81a71551c0e7f5eac7506423c776` |
| [`src/components/AppDataGrid/ownedGridInteraction.tsx`](../../../src/components/AppDataGrid/ownedGridInteraction.tsx) | `c44cfd77b60afb1ad970351e6aaa9c34feb15473` |
| [`src/components/AppDataGrid/ownedGridParts.tsx`](../../../src/components/AppDataGrid/ownedGridParts.tsx) | `ccdbb11cc12e1a15b8406be1317320d74e2eb3f3` |
| [`src/components/AppDataGrid/ownedGridParts.module.css`](../../../src/components/AppDataGrid/ownedGridParts.module.css) | `a3e038bfea25cd1e0044c5ee51f52117842cf202` |
| [`src/components/AppDataGrid/AppDataGrid.tsx`](../../../src/components/AppDataGrid/AppDataGrid.tsx) | `a0eee627e275734ad8e7eac95caf7913bf6dc94e` |
| [`src/components/AppDataGrid/AppDataGrid.test.tsx`](../../../src/components/AppDataGrid/AppDataGrid.test.tsx) | `4a644840cf2913ef0e29a25f0c75694af20d1aec` |
| [`src/components/AppDataGrid/ownedGridState.test.ts`](../../../src/components/AppDataGrid/ownedGridState.test.ts) | `e7814b961741e2d0aaf4ee98d52ee01d10fed31a` |
| [`src/components/AppDataGrid/ownedGridInteraction.test.tsx`](../../../src/components/AppDataGrid/ownedGridInteraction.test.tsx) | `be176a8904128022e0d962dff6def28c1596522d` |
| [`src/components/AppDataGrid/AppDataGrid.stories.tsx`](../../../src/components/AppDataGrid/AppDataGrid.stories.tsx) | `37e2735e11d6cbeed82277ce43f1fce36b4a05da` |
| [`src/components/AppDataGridShell/AppDataGridShell.tsx`](../../../src/components/AppDataGridShell/AppDataGridShell.tsx) | `32310c5053ef335e38709f1650a7909be214722f` |
| [`src/components/AppDataGridShell/AppDataGridShell.test.tsx`](../../../src/components/AppDataGridShell/AppDataGridShell.test.tsx) | `8021a0ae121cc0ea415e62bbb7d6e0070e8d3ed1` |
| [`src/components/AppDataGridShell/AppDataGridShell.server-response-races.stories.tsx`](../../../src/components/AppDataGridShell/AppDataGridShell.server-response-races.stories.tsx) | `e2ba12cdf482d1e845e89147173cc1752ea1ece0` |
| [`src/components/AppDataGridShell/AppDataGridShell.server-response-races.test.tsx`](../../../src/components/AppDataGridShell/AppDataGridShell.server-response-races.test.tsx) | `3924a9a12500e757e76914cc9d2e1a6ce72993d2` |
| [`tests/browser/grid-server-response-races.spec.ts`](../../../tests/browser/grid-server-response-races.spec.ts) | `ed14dfaca40596eb27bec1aee10683131529a414` |
| [`src/components/AppDataGrid/ownedGridSortAcceptance.test.tsx`](../../../src/components/AppDataGrid/ownedGridSortAcceptance.test.tsx) | `c0aa077bd87373f5f61aed09b8278a6f4fa64cb1` |
| [`src/components/AppDataGrid/ownedGridSortAcceptance.stories.tsx`](../../../src/components/AppDataGrid/ownedGridSortAcceptance.stories.tsx) | `a0474d2f094f8347cf3da3504624048f2bf66a92` |
| [`src/components/DataToolbar/components/DataToolbarSortMenu.tsx`](../../../src/components/DataToolbar/components/DataToolbarSortMenu.tsx) | `83b9fd4fb7d1235f6f36a085f5f723834ba6d093` |
| [`tests/browser/batch06-grid-sort.spec.ts`](../../../tests/browser/batch06-grid-sort.spec.ts) | `d2dbc74e4b2301d46abbd90a76fd9bac243d6901` |
| [`tests/browser/batch05-grid-shell-state.spec.ts`](../../../tests/browser/batch05-grid-shell-state.spec.ts) | `63accb4f81f13f82c9de0a788ba59ff265495969` |
| [`docs/developer/parallel-batch-82/grid-server-response-races.md`](../../../docs/developer/parallel-batch-82/grid-server-response-races.md) | `e26ad493a1a3db1fb438454622c39bd7d239636e` |
| [`docs/developer/parallel-batch-06/grid-sort.md`](../../../docs/developer/parallel-batch-06/grid-sort.md) | `64f5025975f458768c023f3860ba01f7b918fa81` |
| [`docs/developer/parallel-batch-05/grid-shell-state.md`](../../../docs/developer/parallel-batch-05/grid-shell-state.md) | `fc1fb8e8a5bac597dcf45133f1a2fb07d1b7f8a4` |

## Bounded follow-ups and optional spec

The new [native regression](../../../tests/browser/acceptance-pack-113.spec.ts)
uses `data-appdatagrid--retained-selection`, which already deterministically starts
with `course-55` selected and `course-2` disabled. Native Space selects Course 1,
asserting the mixed property; page selection excludes Course 2; navigating to the
last page shows retained Course 55 and unselected Course 51; keyboard None clears
both visible and prior-page selections. It checks first-column placement and runtime
errors. It is **UNRUN**, including browser TypeScript. It does not add count/filter/
confirmed-deletion/AT assertions unsupported by that fixture. No new story or runtime edits.

Coordinator window request: browser TypeScript, freshly built frozen Storybook,
and `pnpm exec playwright test tests/browser/acceptance-pack-113.spec.ts --project=chromium`
under the approved pool. Retain exact head, build digest, results JSON and engine;
broaden engines at the coordinator checkpoint. No worker lease or test run requested
outside that window.

For G-07's missing host-deletion evidence, proposed exclusive follow-up allowlist:
`src/components/AppDataGridShell/AppDataGridShell.selection-reconciliation.stories.tsx`
(new host-only fixture), `src/components/AppDataGridShell/AppDataGridShell.selection-reconciliation.test.tsx`
(new composed test), `tests/browser/grid-selection-reconciliation.spec.ts` (new native
spec), and its own dedicated report. Host explicitly removes a confirmed deleted ID
from controlled selection while retaining unknown/unloaded and disabled selected IDs;
exercise sort/filter/page and deferred acceptance with exact snapshots/counts.
Targeted check: that composed file plus public shell unit file, source/browser types,
then its frozen-story native spec. No production pruning fix is authorized or needed
from present evidence. Root alone assigns/integrates/accepts that follow-up.

Physical touch and AT tasks need human/device sessions and exact environment/results;
source edits are only warranted by an actual reproduced behavior gap. Do not substitute
emulated touch for physical touch or DOM status for spoken output.

## Checks performed / readiness

Read-only Git status/head, `rg` source/contract/spec searches, bounded `sed`/`cat`
reads, Git blob queries/comparisons and Python JSON/path/SHA-256 inspection were performed.
Search for `fetch(`, axios, application aliases, Next imports and URL references in the
three grid/toolbar directories found only example/test URL literals; current server
processing and fixture source establish host ownership. This is a bounded directory
inspection, not a whole-library dependency audit.
Only report/spec edits were made after managed-worktree creation. `git diff --check`
and local link/allowlist verification are recorded in the completion message.
No install, tests, typecheck, build, browser, pack, performance, CI, shared lease,
production edit, parent ledger change, merge, publication or unrelated cleanup ran.
The new spec and current-head native acceptance remain pending coordinator validation.
