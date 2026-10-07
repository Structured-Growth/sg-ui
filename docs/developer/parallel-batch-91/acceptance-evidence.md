# Batch 91: B-03/B-05/B-07/B-08 evidence review

Reviewed 2026-10-07 at exact supplied/pushed dev head
`e43bf604be74e0daf731bc990e6c3097f05ed89b`. Managed isolated checkout:
`/Users/thomashall/.codex/worktrees/batch91-evidence/sg-ui`;
branch `codex/batch91-evidence`. Only this report is edited. Root owns acceptance,
review and integration. No parent checkbox or acceptance count is changed.

This is a fresh source/report/link/ownership inspection, not a fresh runtime
matrix. No install, test, build, pack, browser, performance, CI or lease command
was run. The M-row reviews in batches 29/30/31 are retained as historical context
and are not repeated. No missing unique native regression was established;
`tests/browser/acceptance-pack-91.spec.ts` is therefore not created.

## Per-criterion disposition

| Parent criterion | Decision at reviewed head | Supported evidence | Precisely missing gate / owner handoff |
| --- | --- | --- | --- |
| B-03: imports, transitive dependencies, declarations, classes, DOM, augmentation, artifacts, hidden config | PARTIAL | Current manifest/lock/source import inventory, transitive guard implementation, class generator, native DOM dependencies and all tracked hidden configuration identified below; historical removal audit explicitly distinguishes legal/baseline/tool output | A complete exact-head transitive graph and DOM-assumption inventory, fresh emitted declaration/CSS/map/tarball inventory and any legal provenance decisions. Coordinator reserves build/pack window; owner/legal reviewer handles notice decisions. No runtime implementation gap established. |
| B-05: props, callbacks, models, defaults, subpaths, deprecations, genuine breaking changes | PARTIAL | Current public entry metadata and owned types/defaults, preservation/deprecation policy and explicit consumer breaking mappings inspected below | Exhaustive current emitted public API snapshot with before/after comparison to the original baseline, including all defaults and callbacks. Source examples are bounded samples; historical baseline declarations cannot serve as today's snapshot. Coordinator captures fresh artifact; public API/release owner reviews breaking classification. |
| B-07: representative screenshots/interactions across themes/densities and control/editor/navigation/modal/grid families | PARTIAL; actionable evidence-fixture gap | Production Storybook globals and existing deterministic interaction/axe fixtures are present. Retained reports record scoped earlier-head executions | No passing-state screenshot capture pack at this head. Existing harness screenshots only failures. Coordinator schedules native window, explicitly records family × light/dark × compact/comfortable captures and interactions, source/build digest, browser, paths and retention. No new production fixture is required for representative capture. |
| B-08: current grid selection/pages/sort/filter/visibility/drag/cards/server callbacks | PARTIAL for observed runtime; current source behavior record supplied | Seven concerns recorded below with shared state owner, current contracts and existing unit/native assertion paths; earlier server-race result bytes independently inspected | Fresh exact-head grid shard results, including visibility locks and all seven concerns, from coordinator window. Physical drag and spoken AT remain distinct prerequisites when claiming those input modes; host owns async/persistence/rollback. No new grid implementation or duplicate spec proposed. |

## B-03: current scope and hidden configuration

Read-only `git ls-files` finds 1,110 tracked files, including 760 under `src/`.
Tracked hidden configuration is exactly `.gitignore`, `.nvmrc`,
`.storybook/main.ts`, `.storybook/preview.tsx`, `.github/ISSUE_TEMPLATE/ui-change.yml`,
`.github/pull_request_template.md`, and workflows `ai-code.yml`, `ci.yml`,
`pr-title.yml`, `release.yml`. These files were inspected for build/story/export,
validation, dependency and artifact assumptions. This excludes `.git` administrative
state and untracked/ignored files; it is not a credential or global-home inventory.
`.gitignore` excludes dist, Storybook output, artifacts and tarballs; `.nvmrc` is 24.
Dev PR CI/title jobs exclude `codex/dev`; release/AI jobs are main-gated. Nothing
was dispatched or modified, and workflow configuration is not owner setup proof.

`package.json` has 16 runtime dependencies, React/React DOM as its two peers,
49 export keys (including two wildcard patterns), and Node >=22.12.0. Static
production import declarations (excluding tests/stories) identify React,
react-aria, react-aria-components, react-stately, @internationalized/date,
@tanstack/react-table, lucide-react, lexical and @lexical/{code,link,list,react,
rich-text,selection,table,utils}. This textual inventory is not an AST-complete
proof of dynamic imports or every transitive lock edge. `pnpm-lock.yaml` records
resolutions; installation was not performed. A search of source/manifest/lock,
Storybook/workflows/tsconfig found no @mui/@emotion/GridValidRowModel reference;
the only `declare module` match in source is the CSS Modules declaration.

`check-foundations.mjs` recursively traverses relative dependencies of registered
migrated modules and rejects retired types/imports; `check-package.mjs` inspects
owned public declarations and emitted JS/CSS/maps/assets and packed-byte equality.
Reading those guards does not mean they passed at this head. `css-modules.mjs`
produces `sgui_<local>_<8-char SHA256(relative source path)>` class names and CSS
module JS maps; `build.mjs` emits dist and preserves eligible client boundaries.
Generated token TS/CSS come from foundation tokens. These outputs must be inventoried
after a coordinator-owned build, including public declarations and maps.

Concrete DOM assumptions remain: grid interaction uses native table/row/cell
identity, focus refs and container measurement; shell focus repair queries tbody
`[data-grid-field]` and `[data-sgui-part=grid-card]`; reorder's exported helper
queries `[data-sgui-part=grid-row][data-grid-row]` and reads `dataset.gridRow`.
Theme portals use native ref direction bridging and owned scope data attributes.
These documented owned hooks differ from targeting private engine markup or
compiled class hashes. A complete component-by-component DOM/focus assumption
inventory is still needed; this bounded sample does not close it.

The [removal audit](../react-aria-removal-audit.md) records its initial 779-file
review at `c78a24e`, historical baseline at `21adebd61bedfc6a1ed395fe664ff4be83896821`,
and prior dist/tarball reviews. It explicitly leaves historical-reference/notice
and final exact-tarball reconciliation open. Storybook vendored DocsRenderer
references are development output, distinct from package runtime. LICENSE/notices
remain untouched. Notice removal requires source/asset provenance and a legal
owner decision; B-03 inspection does not itself authorize removal.

## B-05: current public snapshot anchors and breaking classification

Current root/component barrels and package subpaths preserve public App/Class
names; AppPaginationFooter's granular path is `/components/CardPaginationFooter`.
Root/theme scopes require `/styles.css`; `/experimental` remains proof API.
`src/models.ts` exports the host-independent LearnerClass presentation model:
id, courseName, instructorName, siteName, progressPercent, nextActivity, dueAt,
and optional nextActivityId/nextActivityLaunchPath. No platform API contract
is imported. No `@deprecated`/deprecation annotation was found in current source;
[migration guidance](../../migration.md) explicitly says preserved Class names
are not implicitly deprecated. Absence of an annotation is not a future guarantee.

Bounded default/callback checks at this head:

- AppButton delegates to owned Button: filled/primary, type button, loading false;
  onPress receives no upstream event. Submit/reset have special native callback handling.
- ThemeScope inherits parent settings, with light/comfortable context defaults;
  theme/density/dir/lang/SGUI variables propagate, local layout styles do not.
- Grid controller initializes page 0/25, empty sort/filter/search/selection unless
  defaults supplied. Controlled concerns remain host-owned; callback-only is writable.
- Shell initializes selection true, client mode, list view unless defaults/restoration
  override. Layout visibility/order/width concerns each have one independent owner.

The historical `migration-baseline/public-api.json` contains upstream grid types,
`onClick`, theme augmentation and old styling; it is retained historical material.
The current [consumer mappings](../../migration.md),
[catalog grid contract](../react-aria-catalog-grid.md) and
[reorder contract](../react-aria-grid-reorder.md) correctly call out actual breaking
removals: upstream inherited props/types/sx/apiRef/slots, theme objects/augmentation,
engine selection include/exclude model, sortModel/separate modes, nested identity,
engine cell params, action onClick, pin metadata and unrestricted reorder. Owned
onPress, explicit ID sets, ordered sortRules, native refs/styles and bounded
host requests are replacements. Preserved component names do not make those
removals compatible. Existing Class aliases plus new Course factories are not
alone breaking. Release owner must preserve a breaking Conventional Commit marker
for the breaking migration; this report-only docs commit changes no public API.

## B-08: current behavior and deterministic evidence map

These are source/contract observations and assertion coverage, **UNRUN at this head**.

| Concern | Current source behavior | Existing check paths (not results) |
| --- | --- | --- |
| Selection across pages | `selectOwnedGridPage` adds/removes only selectable page IDs and retains off-page IDs; None clears retained IDs. Host reconciles deletion; controlled sets win | `src/components/AppDataGrid/ownedGridState.test.ts`, `src/components/AppDataGrid/AppDataGrid.test.tsx`; `tests/browser/batch05-grid-shell-state.spec.ts` |
| Sorting | Ordered rules normalized to declared sortable fields; ties stable; client TanStack processing; criteria request page zero before callback and one combined state | `ownedGridModel.test.ts`, `ownedGridState.test.ts` in AppDataGrid; `tests/browser/batch06-grid-sort.spec.ts` |
| Filtering/search | Shared client filtering precedes sort/page; rules validated against fields/operators; server rows pass through; criteria reset page zero | `ownedGridModel.test.ts`; `tests/browser/batch05-grid-shell-state.spec.ts` verifies draft Apply and page → filter → state |
| Column visibility/order | Owned layout normalization validates fields, enforces locks/order; each controlled layout concern wins; no true pinning promise | `ownedGridColumns.test.ts`, `ownedGridLayoutController.test.tsx` in AppDataGrid; native visibility-menu assertion coverage not established by this bounded review |
| Row drag | Complete single client page at page zero, no criteria, at most one selection, no pending/error; host gets source/target/position; invalidation cancels; host rollback/persistence | `tests/browser/reorder.spec.ts`, `batch01-grid-reorder.spec.ts`, `inventory-pointer-reorder-invalidation.spec.ts` |
| Card mode | Shell shares processing/page/selection with list; default list; view trigger keeps focus; no card reorder | `src/components/AppDataGridShell/AppDataGridShell.test.tsx`; `tests/browser/batch05-grid-shell-state.spec.ts` |
| Server callbacks | Pass-through rows; optional total/hasNextPage; one combined snapshot after slice callbacks; displayed controlled state waits for host; stale request guards are host responsibilities | `ownedGridState.test.ts`; `tests/browser/grid-server-response-races.spec.ts` and existing ServerResponseRaces story |

The [server-race report](../parallel-batch-82/grid-server-response-races.md) attributes
its frozen implementation/test bytes to `364242198e1224bd949386288dc821aaaa12ca52`.
I independently read its retained `batch82/results.json`: 7 expected, 0 unexpected,
0 skipped/flaky, errors []; SHA-256 agrees with the report:
`b9033c14c1e4795ff6ba68549b9cb398697c4d634c97462aeeb67426ecb20b9d`.
That is a historical Chromium shard result, not fresh e43bf604 execution. The pooled
root failed other shards; this pass neither accepts that pool nor establishes
Firefox/WebKit. A test name alone was not used as result evidence.

## B-07/artifact prerequisites and bounded handoff

`.storybook/preview.tsx` uses production scopes/tokens and exposes light/dark/system,
compact/comfortable, locale/direction. Existing stories/specs cover controls,
editor, navigation, modal and grids. `acceptance.spec.ts` attaches axe/timing JSON;
`playwright.config.ts` configures screenshots only-on-failure and traces retain-on-failure.
Thus a green browser JSON report does not establish representative visual captures.
The read-only editor story's own dark scope also means an outer light global does
not prove a light editor screenshot. Coordinator must inspect effective scopes in
captures rather than counting URL globals.

Artifact paths and retention:

- This isolated checkout has no `dist`, `storybook-static`, `artifacts/browser-results.json`,
  `artifacts/browser-report` or `artifacts/browser-traces`; no current generated artifact
  was available to inspect. Git report/source blobs are durable while commits are retained.
- The historical browser guide records CI head `83b8dae2148002e79d2df331fd105c274f97ca96`,
  run 37560065588, artifact 11456069764 expiring 2026-10-21 02:10:07 UTC.
  Its `/tmp/sgui-ci-83b8dae2-artifacts` download is absent locally. Remote availability
  was not queried; the guide's expiry is not an independently verified live artifact.
- Inspected historical batch82 JSON exists at
  `/Users/thomashall/.codex/worktrees/batch80-83-native-candidate/sg-ui/artifacts/browser-pool/df2bc745-5e76-4922-80ae-03c3ccaa0f51/batch82/results.json`.
  Sibling `evidence.json`, `build.log`, `batch82/browser.log` are report-cited paths,
  not newly authenticated build evidence here. Local pool and `/tmp` attribution
  paths have no guaranteed retention; preserve bytes before worktree/temp cleanup.
- CI workflow uploads package, Storybook, browser reports/traces/results/packed-browser
  and logs with 14-day retention. Fresh capture filenames and successful-state screenshots
  need explicit attachment/copy ownership; standard failure-only retention is insufficient.

Minimal follow-up ownership: coordinator-owned capture manifest/screenshots under a
reserved `artifacts/browser-pool/<session>/batch91/` window; rerun existing bounded
grid specs, not a new duplicate suite. If persistent success-capture automation is
chosen, the smallest prospective code allowlist is ONLY
`tests/browser/acceptance-pack-91.spec.ts`, using existing fixtures and `info.attach`
for screenshots; no shared config/story/production change is presently justified.
This assignment leaves that optional file absent and all native work unrun.
For B-03/B-05, coordinator captures fresh emitted/export/transitive artifacts in
its scheduled build/pack window and records exact head/hashes; do not overwrite
historical baseline snapshots. Manual screenshot assessment needs a reviewer,
physical touch drag needs actual device input, spoken announcements need named
browser/AT/device combinations and retained observations, and notice decisions
need provenance/legal owner approval. None are waived or claimed complete here.

## Exact blob anchors

Every blob below was resolved with `git rev-parse HEAD:<path>` at e43bf604.
Commit identity supplies all other linked paths; these anchors distinguish current
source/report bytes from historical tested heads. Blob IDs are Git content hashes,
not runtime artifact SHA-256 or proof that checks ran.

| Path | Git blob |
| --- | --- |
| `docs/developer/react-aria-master-task-list.md` | `930c3c94d0d8b4a9c18e7528e860eabdb55ec5a1` |
| `docs/developer/react-aria-progress.md` | `ba00dce42931499695a89c8ae67bf5129007892f` |
| `docs/developer/react-aria-removal-audit.md` | `0fcffdabebd08a1531bb8a16510a967157921482` |
| `docs/developer/react-aria-browser-acceptance.md` | `41db9ad1186ddccbb84fabcd2a23237e05300c56` |
| `docs/developer/react-aria-catalog-grid.md` | `58c59e7e56139e470d13c5f759e23d918dc913e1` |
| `docs/developer/react-aria-grid-reorder.md` | `3445832ddfab6baeb6022c5e94a05203dd1662db` |
| `docs/developer/parallel-batch-82/grid-server-response-races.md` | `e26ad493a1a3db1fb438454622c39bd7d239636e` |
| `docs/developer/migration-baseline/inventory.json` | `780460f2faf7513135b6eaa6efacb230b2f9c3ea` |
| `docs/developer/migration-baseline/public-api.json` | `26d82ff5765f1c667bc025e88ac107cc6f44ad99` |
| `docs/migration.md` | `c16a7ab44e0533329f80d69c3c0c43db766e877f` |
| `package.json` | `f83bab2065c9ae79b31aa6b0aa143b7ae0b2a3f0` |
| `pnpm-lock.yaml` | `d312a82ec958b0badc4633899ec4510cbb655648` |
| `scripts/check-foundations.mjs` | `ecc96a852355231cc7845642c589980825a6356d` |
| `scripts/check-package.mjs` | `744f86595899989d90edc6cf590a757534c58f17` |
| `scripts/build.mjs` | `c6e328b74748cda5090c2cf2ccbc582944a7df2d` |
| `scripts/css-modules.mjs` | `32dec71c69010e4208e835be364f726fac2d65fe` |
| `.storybook/preview.tsx` | `b84d33831293a155cc571eef6545d7deed67b683` |
| `.storybook/main.ts` | `0774f805dda513b2422a02692c5f4ccec8d6c131` |
| `.github/workflows/ci.yml` | `d1d9f200e46767226b6022925c40358680cd40c5` |
| `playwright.config.ts` | `ef2fb5556b35d18e74c7c02cdc512e92f2964223` |
| `src/models.ts` | `08b008fb77535eaba532cdc1a0502267e5f3edcb` |
| `src/foundation/ThemeScope.tsx` | `ec330a71f6ee1f32ad10b717efe5a285094ca953` |
| `src/experimental/Button/Button.tsx` | `4969d84ac106e7346c8e054974d7d6a38a5d0cfc` |
| `src/components/AppDataGrid/types.ts` | `aa61aad90e0d22b1f75addbf4b01c5fec63a5db7` |
| `src/components/AppDataGrid/ownedGridState.ts` | `9ef583ee584e484ef148952e6531a48635929073` |
| `src/components/AppDataGrid/ownedGridModel.ts` | `9aec70184dc15e297f247647a67b6667d6bb0051` |
| `src/components/AppDataGrid/ownedGridLayoutController.ts` | `51131f611191dd2216109229befb13fa01181381` |
| `src/components/AppDataGridShell/AppDataGridShell.tsx` | `32310c5053ef335e38709f1650a7909be214722f` |
| `tests/browser/acceptance.spec.ts` | `f11daf0511e310efbf365ade27ed482ddc6b5daa` |
| `tests/browser/batch05-grid-shell-state.spec.ts` | `63accb4f81f13f82c9de0a788ba59ff265495969` |
| `tests/browser/reorder.spec.ts` | `2449eb6339a6bf5eb9c1d193fe0ad3cc5d9acc91` |
| `tests/browser/grid-server-response-races.spec.ts` | `ed14dfaca40596eb27bec1aee10683131529a414` |
