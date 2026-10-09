# Batch114 — G-09–G-13 acceptance evidence

Reviewed baseline: `e43bf604be74e0daf731bc990e6c3097f05ed89b` (supplied codex/dev).
Managed isolated worktree created before edits:
`/Users/thomashall/.codex/worktrees/batch-114-evidence/sg-ui`.
This reviews the five unchecked parent criteria, not another M-row inventory or
removal audit. Only this report and optional new browser spec change. No test,
install, build, pack, performance, global lease or CI command ran. This baseline
is not a tested head in this assignment. Root alone owns acceptance/integration.

## Per-ID evidence matrix

| ID | Status | Evidence at baseline and precise remaining gate |
| --- | --- | --- |
| G-09 | Partial | Shell lines 53–80 and 193–194 resolve filterFields/filterRules/callback ownership and dispatch one transaction. Model normalizes string/number/date/enum operators before search/filter/sort/page processing. State transitions reset page zero and notify pagination before filter and combined state. Filter menu lines 144–166 sanitize committed rules and count valid active rules; enum All applies no rule, including is_not. Static status options derive from canonical exported admin/instructor constants; arbitrary host enums remain host supplied. Existing model/filter-menu assertions cover invalid operands, All, live relabel/reorder and controlled rejection, but were not run here. Older native shell proof asserts page → filter → state and deferred page-zero acceptance; implementation has changed and original logs are absent. Need fresh baseline native operator/All/badge/controlled-reset proof and host metadata review. No product failure established. |
| G-10 | Partial | Toolbar lines 79–110 implement refresh, selected slot/count, search and view requests; shell lines 183–197 shares them with list/cards and visibility. Missing callbacks disable actions. SplitAction uses joined neutral text primary, token border/divider and token text colors. Retained A/B below prove narrower search/columns/selection/rejected-view behavior; C proves responsive list/cards, retained selection and Retry with matching checked shell/story/spec blobs. Need baseline full composition in agreed engines plus split-action light/dark visual states. Matching selected blobs does not certify the full transitive graph. Host owns fetching, actions and controlled view acceptance. |
| G-11 | Partial overall; narrow API distinction fully supported by source | normalizeOwnedGridLayout lines 72–83 locks the first declared text/link/copyable column and every menu/explicit locked field, forces visibility and places menu fields last. Column menu disables locked checkboxes. Public AppDataGridColumn aliases the owned presentation type with locked/width and no pinned prop. Catalog docs map legacy pinned metadata to visibility/order and explicitly defer true pinning. B retains Chromium/Firefox locked-course/actions/reset proof with matching checked source/story/spec blobs. Need baseline native hide/order/persistence reconciliation across agreed engines. Visibility protection is not sticky positioning; a custom-only first column is outside the declared first-text algorithm. |
| G-12 | Partial; native proof gap and contract decision | Owned validation/flex allocation and layout controller enforce finite bounded sizing, numeric overrides and controlled/default order. Interaction lines 351–357 and 385–395 commit the active ColumnResizer field. Colocated assertions cover keyboard sizing, repeated native slider changes and responsive flex measurement. No column-resize browser assertions were found in retained specs. Existing Client story has a keyboard host Put score first button, so columnOrder is not inert. Contract says order has non-drag controls, but production column menu offers visibility/search/reset, without built-in order actions. Root must resolve whether host controls satisfy that promise. Optional G-12 native case is UNRUN. Pointer resize, bounds/reflow/RTL and spoken AT remain unverified here. True pinning remains explicitly deferred without an inert prop. |
| G-13 | Partial | Normalization moves menu fields last even after host order requests; action builder makes menus locked/non-sortable/non-filterable. Interaction delegates row activation once to original row. ownedGridInteraction.test explicitly asserts nested menu invokes no row action/selection and restores trigger focus; AppDataGrid.cells.test exercises link/copy/custom/menu without selection. Historical clipboard report records Chromium 4 pass, WebKit 3 pass/1 intentional denial skip and Firefox pre-page launch failures at an older head. Current copy source matches, spec differs, original logs are absent. Need fresh baseline integrated row action + links/modifiers + checkbox/copy + drag/Move + nested-control matrix with exact callbacks/clipboard bytes. Physical drag/clipboard, OS prompts and spoken AT remain open. |

All five whole parent criteria remain unchecked. Source support, source test
assertions and retained bounded native results are different kinds of evidence.

## Retained artifacts inspected directly

Artifact roots share prefix:
`/Users/thomashall/.codex/worktrees/batch45-shared-native-candidate/sg-ui/artifacts/browser-pool/`.
Actual root/shard evidence.json and shard results.json were read. Each selected
result records expected 4, unexpected 0, skipped 0, flaky 0, errors []. Roots
record Node v24.19.0/macOS. A/B pools have other failures: their green shards
do not convert the pool or current baseline into a passing snapshot.

| Ref | Exact tested head | Retained run / shard | Bounded result |
| --- | --- | --- | --- |
| A | `c64c4377eb42c936f3cf8f1e3f5de2a5b33bdc05` | `16f6feff-4479-4f37-8c96-451b694ba457/toolbar-native-composition/` | 4 Chromium cases, selection/rejected view and columns/search at LTR/explicit visual RTL; [report](../parallel-batch-47/toolbar-native-composition.md). |
| B | `24f9b4abb6ae39675b5bdf9abe8c9764a14a059e` | `ccfdb3fe-1f4a-4199-9564-3a8b2dbf6fc3/toolbar-firefox-search-focus/` | Chromium/Firefox only, grep column locks and reset, 4 cases; selection/view and WebKit excluded. [report](../parallel-batch-56/toolbar-firefox-search-focus.md). |
| C | `f87c8d336932ea70ad3ab9eaea5e4e6b77bc40ec` | `693cd1a1-28f1-4986-b345-258b4621c480/grid-shell-responsive/` | 4 Chromium light/dark normal/200% text cases; [report](../parallel-batch-46/grid-shell-responsive.md). Earlier wave23 0/4, wave27 2/4 and wave28 0/2 reds remain preserved. |

Each root has evidence.json; each shard has evidence.json, results.json and
browser.log. Retention checked locally 2026-10-07; no future durability promised.
The former /tmp wave28/wave29 attribution JSON files are absent, so their
worker-attribution claims cannot be rechecked from those files. Direct Git blob
comparisons below remain possible; they do not prove all transitive dependencies.

Direct git rev-parse head:path comparisons against baseline:

- B equals baseline: toolbar implementation `18157c396ad513d698b3cb7e3a56ae220294dffc`,
  columns menu `ea43e309ab624827f494f6d5044ffcdd179f0276`, toolbar story
  `b134c9177e06c42cfdca5c4e8ecbd009d85e9aa1`, toolbar spec
  `41174b932b0a1f92ba1215f2a6a316c55b583e4e`.
- C equals baseline: shell implementation `32310c5053ef335e38709f1650a7909be214722f`,
  shell CSS `8279f3a644862ae9bfde8d2c46cee48887ccbe1e`, shell story
  `dc10ba9dbdaafb561cb9620c8075e1e8ec25d639`, responsive spec
  `d79ac477c997311130fe3743eb19641916a9a8a3`.
- Historical shell head `556df283d8ecc5e664528a7a2a302abf0205d677` has matching spec
  `63accb4f81f13f82c9de0a788ba59ff265495969` but different shell implementation
  `a9129f85b081d43afbbd9dadc94191146c1d0ac4`. Original
  /tmp/batch05-grid-shell-browser.log and /tmp/batch05-grid-shell-firefox.log are absent.
  [Retained report](../parallel-batch-05/grid-shell-state.md) is historical prose.
- Historical clipboard head `07e514ec86fb4d6bb7025a9ae1cd1f349b3fc82f` matches
  inspected copy source `f1c3deb30e843e74b3b065d7e847374593acdd8d`; spec changed
  from `e0e35c8906083b3c92e0d7648f417dbb56210892` to
  `bcc2517d1a5a41b30f7253d4a97c1812a00c4590`.
  /tmp/sgui-batch05-grid-clipboard-browser-final.log is absent.
  Preserve [permission/engine/device limits](../parallel-batch-05/grid-clipboard.md).

## Optional native handoff and contract ambiguity

New [acceptance-pack-114.spec.ts](../../../tests/browser/acceptance-pack-114.spec.ts)
is **UNRUN**, including browser typing. One distinct G-12 case uses existing
Client story: native Tab/Enter/ArrowRight/Enter resizes Score, asserts only Score
receives a width override, then native Tab/Enter activates host order, asserts
exact actions-last order, button focus and unchanged selection. Browser warnings
and errors fail. No new story/source/config or synthetic focus was added.

Request coordinator fresh-build/browser-typecheck/native window for
`tests/browser/acceptance-pack-114.spec.ts --project=chromium`; Firefox/WebKit
belong to the coordinator checkpoint. Record exact tested candidate, raw results,
immutable build and any red trace before claiming a pass. Internal renderer
fixture does not establish public shell, pointer, min/max/reflow/RTL or AT acceptance.

If root requires built-in non-drag column-order UI, proposed separately assigned
exclusive source scope: DataToolbar/components/DataToolbarColumnsMenu.tsx, its
existing CSS/test, the existing toolbar story and a uniquely owned browser spec.
Use the existing shell onColumnOptionsChange order transaction; test actions-last,
controlled rejection and keyboard focus. This is a contract decision, not an
established runtime failure. No fix chat or production edit was created. If host
ordering satisfies the agreed behavior, separately document that public limit.

## Actual checks and ownership

Performed read-only status/HEAD/blob inspection; source/tests/stories/contracts
reads; actual retained JSON/stat/error checks; missing artifact checks; direct
baseline-versus-tested-head blob comparison. Read README, migration and component
architecture before edits. Exploratory nonexistent grid/catalog specs, standalone
filterOperators/SplitAction CSS/preset directories were corrected through rg and
actual implementation reads; these searches are not failing product tests.

Only report/spec paths change; primary image-upload and other worktrees preserved.
Documentation links/paths and git diff --check are checked before commit.
No install/test/typecheck/build/pack/browser/perf/global lease/CI ran. No source,
shared configuration, master acceptance, ledger or other report was edited.
Manual browser zoom, real touch/drag, clipboard OS policy, spoken AT, wider engines,
runtime/React/consumer matrix and host responsibilities remain separate. Root
receives clean Conventional Commit head/readiness; that commit is not a tested head.

## Baseline source Git blobs

Test files pin reviewed assertions, not executed results.

| Source | Git blob |
| --- | --- |
| [src/components/DataToolbar/components/DataToolbarFilterMenu.tsx](../../../src/components/DataToolbar/components/DataToolbarFilterMenu.tsx) | `6756905e82bfb9aac06d2bcd7c2b5f379b7fd187` |
| [src/components/DataToolbar/components/DataToolbarFilterMenu.test.tsx](../../../src/components/DataToolbar/components/DataToolbarFilterMenu.test.tsx) | `d0d05ebf8de7f5bf9b385b5628882ea88d1f0050` |
| [src/components/AppDataGrid/ownedGridModel.ts](../../../src/components/AppDataGrid/ownedGridModel.ts) | `9aec70184dc15e297f247647a67b6667d6bb0051` |
| [src/components/AppDataGrid/ownedGridModel.test.ts](../../../src/components/AppDataGrid/ownedGridModel.test.ts) | `c3671f338d127e01a0fb96632526fa34a4aa3837` |
| [src/components/AppDataGrid/ownedGridState.ts](../../../src/components/AppDataGrid/ownedGridState.ts) | `9ef583ee584e484ef148952e6531a48635929073` |
| [src/components/AdminDataGridOptions.ts](../../../src/components/AdminDataGridOptions.ts) | `2149e949bb429adb23281748490efa29979a76da` |
| [src/components/InstructorDataGridOptions.ts](../../../src/components/InstructorDataGridOptions.ts) | `6289bbe308424625e079db723ffd440176736691` |
| [src/components/AppDataGrid/ownedGridColumns.ts](../../../src/components/AppDataGrid/ownedGridColumns.ts) | `5c5ae8541622c9689db5ed74d5eaf1c1c5f8f18d` |
| [src/components/AppDataGrid/ownedGridColumns.test.ts](../../../src/components/AppDataGrid/ownedGridColumns.test.ts) | `d91d6ab292b6d761d72d9dec06af1916cd64303e` |
| [src/components/AppDataGrid/ownedGridInteraction.tsx](../../../src/components/AppDataGrid/ownedGridInteraction.tsx) | `c44cfd77b60afb1ad970351e6aaa9c34feb15473` |
| [src/components/AppDataGrid/ownedGridInteraction.test.tsx](../../../src/components/AppDataGrid/ownedGridInteraction.test.tsx) | `be176a8904128022e0d962dff6def28c1596522d` |
| [src/components/AppDataGrid/ownedGridLayoutController.ts](../../../src/components/AppDataGrid/ownedGridLayoutController.ts) | `51131f611191dd2216109229befb13fa01181381` |
| [src/components/AppDataGrid/ownedGridInteraction.stories.tsx](../../../src/components/AppDataGrid/ownedGridInteraction.stories.tsx) | `67d692fca66699078cafd4a352d898b393a0acc2` |
| [src/components/AppDataGrid/AppDataGrid.cells.test.tsx](../../../src/components/AppDataGrid/AppDataGrid.cells.test.tsx) | `f8e96a3fb538c63539ddc9c3eaf6cb7015287c3a` |
| [src/components/AppDataGrid/types.ts](../../../src/components/AppDataGrid/types.ts) | `aa61aad90e0d22b1f75addbf4b01c5fec63a5db7` |
| [src/experimental/SplitAction/SplitAction.tsx](../../../src/experimental/SplitAction/SplitAction.tsx) | `50f18c4dd2f083f8a8428b08120283d1b306a23c` |
| [src/experimental/ButtonGroup/ButtonGroup.module.css](../../../src/experimental/ButtonGroup/ButtonGroup.module.css) | `7a4872422c0163033cf612747dbb0c9cffb20be7` |
| [src/experimental/Button/Button.module.css](../../../src/experimental/Button/Button.module.css) | `cccf005e0bdee43ac22d8f8830523938ce5167f6` |

## Retained raw-result fingerprints

| Run/shard results.json | SHA-256 |
| --- | --- |
| 16f6feff-4479-4f37-8c96-451b694ba457/toolbar-native-composition/results.json | `d54f796c557d1d0b73969b9e61554c05e1d9d061744960933116178112e409d8` |
| ccfdb3fe-1f4a-4199-9564-3a8b2dbf6fc3/toolbar-firefox-search-focus/results.json | `63ec8bf9bf4e2aefb19d755a61a6550adb89e328b641f8cf07e7e437003410eb` |
| 693cd1a1-28f1-4986-b345-258b4621c480/grid-shell-responsive/results.json | `321f644067508737ae5ab40a5e176004a96b99f8375406f3fa09df7375ce305a` |
