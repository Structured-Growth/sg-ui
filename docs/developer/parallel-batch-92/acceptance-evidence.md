# Batch 92: parent acceptance evidence review

Review date: 2026-10-07. Exclusive criteria: B-09, B-11, B-12, B-13.
Reviewed/pushed dev base: `e43bf604be74e0daf731bc990e6c3097f05ed89b`.
Isolated managed checkout: `/Users/thomashall/.codex/worktrees/batch92-acceptance-evidence/sg-ui`.
Only this report changes. Production, fixtures, master acceptance and ledgers remain read-only.
No installation, test execution, build, packaging, browser, performance or CI command ran.
This is a fresh parent-criterion inspection, not another M-row inventory review.

## Per-ID disposition for coordinator review

| Criterion | Disposition | Concrete evidence and remaining requirement |
| --- | --- | --- |
| B-09 | Partial: findings documented; no conformance claim | Six concern classes inspected below. Existing native cases and retained JSON support bounded focus/reflow behavior at their actual candidate heads. Current-head native results, manual focus/label/contrast/sticky review, physical devices and spoken AT evidence are not supplied here. Root retains acceptance ownership. |
| B-11 | Partial: promises separated; browser/TypeScript policy remains underspecified | React/Node and representative bundler/SSR/RSC contracts agree with source and fixture scripts. No browser minimum-version policy or supported consumer TypeScript range is stated. Owner must approve explicit boundaries; TypeScript 5.9.3 fixture and Playwright engine selection alone do not establish those policies. |
| B-12 | Fully supported for the requested current-file manifest review | All 201 entries checked: 195 present and 6 absent match actual tracked files; all 16 replacement references exist. 52 original test entries and 33 original story entries remain accounted for. Original-source behavioral equivalence is outside this existence/provenance review. No parent checkbox is edited. |
| B-13 | Fully supported for a bounded source/contract inventory | Keys, schema envelopes, locale/date semantics and externally observable error families recorded below, including SideNavigation's default organization key. Host-specific keys, supported locales, timezone coordination and actual application recovery policies require consumer ownership. This inventory supplies no new execution claim. |

## B-09: source findings by concern

| Concern | Inspection result | Evidence/remaining gate |
| --- | --- | --- |
| Focus removal and outline suppression | Menu items replace `outline: none` with token outline on `data-focused`; editor editable replaces it on `:focus-visible`. Dialog implements removed-opener recovery; grid repairs removed row/control focus only within its ownership. | `src/experimental/Menu/Menu.module.css`, editor section CSS, `src/experimental/Dialog/Dialog.tsx`, `ownedGridInteraction.tsx`; retained dialog shard below. Native timing must use existing removed-opener/grid-focus specs against a frozen current build. |
| Focus fallback requiring follow-up inspection | Shell `.content` has `outline: none`, `tabIndex=-1`, and is the fallback focus destination when no card/cell remains. `.card:focus-visible` has an outline; `.content` has no corresponding rule. | `AppDataGridShell.tsx` removal/page-entry effects and `AppDataGridShell.module.css`. This is a source-visible indication risk, not an observed native regression. Existing responsive-shell fixture does not by itself prove the zero-surviving-card state. See bounded handoff below. |
| Hover-only triggers | Navigator actions use opacity zero only on hover-capable devices; row `:hover` and `:focus-within` reveal them. Floating selection toolbar has Alt+F10 keyboard entry and Escape return to editor. | Navigator CSS and `FloatingTextSelectionToolbar.tsx`; existing `page-navigator-native-transactions.spec.ts` and `inventory-selection-boundary.spec.ts` are coverage routes, UNRUN by this worker. Verify focus reveal and discoverability manually. |
| Drag-only interactions | Public grid uses a named native drag button plus translated Move action requests, with host commit/rollback and complete-page boundary. | `DataGridDragHandle.tsx`, `ownedGridInteraction.tsx`, [reorder contract](../react-aria-grid-reorder.md), existing `reorder.spec.ts` and `batch01-grid-reorder.spec.ts`. Physical touch long-press and spoken reorder output remain prerequisites. |
| Labels | Drag handle requires row-specific host label; floating toolbar supplies translated group/button names; grid status, calendar descriptions and dialogs use owned accessible naming. Decorative drag icon is hidden. | Source is evidence of label wiring, not evidence that every consumer label/content is appropriate. Existing axe coverage scans selected fixtures; manual accessible-name and screen-reader review of supported compositions remains necessary. |
| Contrast | Focus, text, muted text, danger, backgrounds and borders resolve through generated light/dark tokens; Menu supplies forced-color focused/disabled rules. | `src/foundation/tokens.json`, `tokens.css`, Menu CSS. No contrast ratio was calculated here; token usage alone does not establish contrast under every state, host override or enlarged-text setting. Existing axe scans are bounded fixture coverage, not a conformance audit. |
| Sticky content | Tabs list is sticky with a separate overflow panel. AppModal permits whole-dialog scroll when fixed chrome cannot fit; tab body has a minimum usable block size. | Tabs/AppModal CSS; retained header-reflow shard below and existing `batch05-tabs-overflow.spec.ts` / `batch50-dialog-header-reflow.spec.ts`. Supported viewport, zoom/text enlargement, focus visibility, keyboard scrolling and manual AT review remain necessary. |

No new spec was added: the report identifies no newly reproduced native regression,
and adding assertions before a deterministic zero-card fixture/ownership decision
would duplicate existing acceptance coverage or invent evidence. For the shell
fallback risk, root should first inspect existing fixture controls and current
assignments. If uncovered, minimal exclusive implementation allowlist would be
`src/components/AppDataGridShell/AppDataGridShell.module.css` (visible fallback
outline), its colocated behavior test, and a separately owned deterministic
zero-surviving-card fixture/native assertion. A native check must first keyboard-focus
a card, remove all cards through the host, assert actual fallback focus, and inspect
its computed indicator/viewport visibility without stealing an outside host focus.
Fixture work is a prerequisite if existing controls cannot reach that state; this
worker does not authorize or create that assignment.

Manual prerequisites for B-09: a reviewer and declared supported browser/OS/AT
matrix; keyboard traversal including removed targets and nested overlays;
light/dark contrast measurement including disabled/error/selected states;
200%/400% text/zoom and sticky chrome reflow; physical touch drag versus Move;
recorded spoken labels/status/focus recovery. Legal or conformance sign-off, if
requested by an owner, must come from that owner/reviewer, not source inspection.

## Retained execution evidence: actual paths and attribution

The following files were opened read-only during this review. Their JSON, rather
than a test name, establishes the historical focused result. Both overall pool
records are `failed` for other shards. Neither is a current-head full matrix.
Local gitignored pool files have no declared retention guarantee; preserve/export
them before worktree cleanup. Git report blobs remain durable in history.

Pool base: `/Users/thomashall/.codex/worktrees/batch45-shared-native-candidate/sg-ui/artifacts/browser-pool/`.

| Exact tested head | Relative pool/shard | Observed JSON |
| --- | --- | --- |
| `4987a1fe046c37f2e612d6de159aa09e1e840043` | `afadf38b-8476-4c9b-a10e-2a78d786822d/dialog-removed-opener/` | Chromium shard `passed`, count 9; results expected 9, unexpected/skipped/flaky 0. Root initial/final head/source/build match and final source status is clean. |
| `c64c4377eb42c936f3cf8f1e3f5de2a5b33bdc05` | `16f6feff-4479-4f37-8c96-451b694ba457/dialog-header-reflow/` | Chromium shard `passed`, count 8; results expected 8, unexpected/skipped/flaky 0. Root initial/final head/source/build match and final source status is clean. |

SHA256 of the reviewed retained files (not Git blobs):

| File relative to pool base | SHA256 |
| --- | --- |
| `afadf38b-8476-4c9b-a10e-2a78d786822d/evidence.json` | `d4983f86bd31fbc9c747f80e537ca36f57ffce3d9fc22ca44d51efb5c0308eb8` |
| `afadf38b-8476-4c9b-a10e-2a78d786822d/dialog-removed-opener/evidence.json` | `a5ffe31d73210709cad22c2cda4cda0ee9e3db017a7c7d490f5b6480af5a865e` |
| `afadf38b-8476-4c9b-a10e-2a78d786822d/dialog-removed-opener/results.json` | `5aa37457a93bad6cf6573727041ab5629f9ca4e8ac32ae7a356ab43fa09b1c94` |
| `16f6feff-4479-4f37-8c96-451b694ba457/evidence.json` | `899f54e10ba6826b18759976debfc45b7fce1d13493c2121cc6eefd4a99a518f` |
| `16f6feff-4479-4f37-8c96-451b694ba457/dialog-header-reflow/evidence.json` | `d3a357e6b52feffcb29dc8d3377d6a4dcd25e45a16c45e5734d35b11b67841dd` |
| `16f6feff-4479-4f37-8c96-451b694ba457/dialog-header-reflow/results.json` | `cc1d4fc7a9425ebba315388d9942dc75d7c6cff23c75edc7c1aa9d42cdd9ee4b` |

[Runtime CI record](../react-aria-runtime-ci.md) cites historical Actions runs,
including `b63ec58becedd246052c3a1e81acf590a97940d1` run 37562921075
and `d59653ec848d22a97104441ac068c77530610537` run 37563448002,
and also later failed clipboard/image-lifetime runs. These report claims were
read, not independently fetched or revalidated. CI upload configuration retains
artifacts for 14 days; older record explicitly lists artifact 11456977272 expiry
2026-10-21 02:18:34 UTC. Do not infer availability of other artifacts from that
expiry. `/tmp/sgui-ci-b63-browser` and `/tmp/sgui-ci-calendar-browser` are cited
local downloads with no guaranteed retention, not newly inspected results.

## B-11: distinct compatibility promises

| Dimension | Promise/configuration at reviewed head | Evidence boundary / required decision |
| --- | --- | --- |
| Browser | Playwright config selects Chromium, Firefox, WebKit desktop engines; CI requires all three on Node 24. | No minimum end-user browser version/OS policy is published. Playwright-selected binaries and emulation are not physical Chrome/Safari/mobile support certification. Owner must state supported versions/OS and update README/browser contract. |
| React | React and React DOM peers `^18.3.1 || ^19.0.0`; README maintains 18.3/19. | Packed scripts select 18.3.1 and 19.2.3. Representative versions do not prove every later minor; no range change justified here. |
| TypeScript | Development dependency `^5`; packed foundation fixture uses exact 5.9.3 with matching React typings and compiles an API contract. | No supported minimum/maximum consumer compiler range is promised. Owner must choose an explicit minimum or clearly document the tested compiler only; validate that choice against the packed declaration fixture. |
| Node | Package engine `>=22.12.0`; CI matrix 22.12.0 and 24; development/release Node 24. | Consumer minimum differs from semantic-release tooling requirements. Node 26 local checks cannot substitute for those targets. |
| Bundler/package | Explicit ESM/declaration exports plus separately imported styles; Vite fixture 7.3.1; Storybook React/Vite; Next fixture 16.4.0. | These are representative integrations, not a universal bundler guarantee. No new CommonJS/runtime Next promise. |
| SSR/hydration | Guarded browser APIs, stable first snapshots, source client directives; packed ordinary SSR and browser hydration scripts. | Script presence is not execution. Historical runs retain their own heads; current-head packed checks require root's isolated serial window. Host timezone/reference time must agree. |
| RSC | Eligible presentation/tokens/models remain server-importable; providers/interactions are client boundaries; official React 19 Flight proof and Next App Router fixture. | React 18 fixture does not run React 19 Flight. No blanket every-framework/every-control RSC claim. Host client components own functions/events. |

Documentation-policy follow-up only after owner review: minimal exclusive paths
`README.md`, `docs/developer/react-aria-runtime-ci.md` and
`docs/developer/react-aria-browser-acceptance.md` for separate browser/TypeScript
boundaries. No source or peer change is requested. Root can schedule existing
packed foundation React 18/19 checks after freezing the exact package candidate;
choose further compiler/browser cases only after an explicit policy decision.

## B-12: manifest against actual tracked files

Parsed `docs/extraction-manifest.json` at the reviewed Git head and compared each
`destination` to actual file presence and tracked paths. Original provenance stays
`Structured-Growth/learning-platform`, `8e63f1e16fc3d43d851908b312603a1099ca13d9`,
`apps/web/src/ui`. There are zero presence mismatches, duplicate destinations,
untracked claimed-present destinations or missing replacement files.

The six absent destinations are explicitly accounted for: grid `baseGridSx.ts`
and its old test are replaced by owned grid CSS/behavior tests; row-DnD `.test.ts`
is renamed to `.test.tsx`; theme typography augmentation, old theme test and old
theme implementation map to generated tokens/scopes/Provider tests. The manifest
contains 16 replacement references (including repeated replacement paths), all
present. Historical names are provenance; their mention is not a runtime import.

Specialist paths checked: Admin/InstructorDataGridOptions, DataToolbar
`buildColumnOptions` and its test, LearnerClassCard formatter and test, SideNavigation
helper test, Lexical ExperienceEditorPlugins, HorizontalRuleSelectionPlugin,
ImageInsertPlugin/ImageNode and their tests, both persistence hooks and tests.
The card formatter delegates to `src/utils/formatDueDateLabel.ts`; translated
Course factories/canonical status constants coexist with preserved Class exports.
Current `src/models.ts` is host-independent presentation data, not original API contracts.
Original stories retain 33 manifest entries and tests retain 52; newer fixtures
and browser specs are tracked additions outside the original extraction manifest.
No separately named fixture destination is in this manifest. Representative data
is embedded in stories/tests; presence does not prove original data/behavior parity.

The upstream repository was not fetched. This review therefore supports destination
accounting and explicit replacements, not byte identity with the original platform,
semantic parity of every old test or completeness of an upstream source inventory.
It does not repeat batches 29/30/31 whole-component acceptance or waive legal
notice/provenance reconciliation from [removal audit](../react-aria-removal-audit.md).

## B-13: consumer state, date and error inventory

| Owner / key | Persisted shape and fallback behavior |
| --- | --- |
| Generic hook; host supplies exact key | Memory-only default; explicit local/session opt-in requires nonempty key. Raw JSON without version; with version `{__sguiPersistent:true, version, value}`. Host `validate`/`migrate` govern schema; malformed/missing JSON uses initial value; migration receives undefined previous version for legacy raw JSON. Blocked/quota storage keeps browser memory; local/session isolate. Storage events synchronize; SSR initial snapshot does not read browser storage. |
| Pagination hook; host supplies exact key | Owned `{page,pageSize}` inside generic raw/enveloped value. Nonnegative safe page, positive safe size normalized; explicit host choices may bound size, default suggestion 25/50/100 is not a cap. Host/footer requests page zero with new size; generic setter does not infer reset. |
| Grid/shell aggregate; `sgui:grid:${key}:v1` | `{version:1,state}`: optional paginationModel, sortRules `{field,direction}`, filterRules `{field,operator,value}`, searchValue, columnVisibilityModel, columnOrder, columnWidths, viewMode list/cards. No rows, selection, pending/error state. Normalizers reject invalid/unknown fields and honor layout locks. Custom structural storage or default localStorage. First post-hydration restoration seeds once; controlled host values win; remount to change persistence identity. |
| Grid legacy reads / reset | `datagrid:${key}:paginationModel`, `page:${key}:viewMode`, `page:${key}:columnVisibilityModel`, `page:${key}:cardsPaginationModel`. List pagination preferred over cards. Incompatible present v1 envelope returns defaults without resurrecting legacy state; malformed/unreadable saved JSON may permit legacy fallback. Retired sort/filter models not translated. Reset removes each owned/legacy key independently, may save normalized host defaults, and protects pending controlled-host acceptance. Storage failures never block interaction. |
| SideNavigation organization | Default `sgui:active-organization`, overridable `organizationStorageKey`; raw JSON organization ID string via local persistence hook. Host active stored session ID can replace it; missing dataset match falls back to first supplied organization. Account sessions/credentials stay host-adapter-owned. Default shared key can couple multiple shells; hosts should supply distinct keys where isolation is required. No new validation/security claim for stored IDs. |

No other production browser-storage access was found by the scoped source search
for localStorage/sessionStorage/storageKey. Story fixture keys are examples, not
consumer production promises. No storage schema or key was changed.

| Locale/date behavior | Observable contract |
| --- | --- |
| Interaction/visual locale | Provider bridges host translation locale; ThemeScope direction only changes visuals. Portal visual direction is preserved while interaction locale governs keyboard/placement. Host owns supported locale list/catalog fallback and loading. |
| Calendar civil values | Serializable Gregorian date/range/local datetime/time contracts; instant conversion requires explicit host timezone and DST disambiguation. Date-only is not an implicit UTC instant. Invalid/unavailable/incomplete values expose field descriptions/errors; unfinished range blocks Apply. |
| Due labels | Native Date parsing accepts Date/string/epoch helper inputs; calendar comparisons/display use runtime timezone, locale controls formatting only. Canonical supported locale or explicit en-US fallback. Invalid due gives translated unavailable; absent/invalid reference clock uses current time. Host must align reference clock and timezone for SSR/hydration. |
| Translation fallback | Library keys include defaultMessage; no-provider English fallback. Owned ICU supports documented syntax; malformed/unsupported formatting falls back to full source text. Host adapter lookup/loading errors remain host errors. No hard-coded host supported locale policy. |

| Error/state family | Consumer responsibility and visible outcome |
| --- | --- |
| Grid data | Host supplies loading/refreshing/empty/noResults/error and optional description/retry; owned status uses polite or assertive error announcements and Retry when supplied. Criteria distinguish empty dataset from no matches; rows/errors are not persisted. |
| Accounts/organization/logout | Async host callbacks own persistence/abort; library presents translated error/retry states and invalidates stale UI results. Retained session data is host-owned. |
| URL/link | Owned allowed-destination policy; invalid dialog value displays translated correction message. Rejected saved links remain rich host JSON but activate inertly; accepted new-tab activation isolates opener. |
| Image/file/upload | Nonempty MIME/extension presentation checks; invalid selection or host failure shows alert and preserves correction/retry flow. Saved rejected image source yields translated placeholder; host JSON/alt/asset metadata retained. Host owns bytes/size/authorization/network abort/asset cleanup and durable URLs. |
| Calendar/forms | Descriptions and validation messages expose incomplete, invalid, out-of-range/unavailable input. Native reset restores full draft; host controlled values remain authoritative. Actual spoken validation output remains a manual gate. |
| Persistence/formatting | Bad JSON/schema/version defaults, migration/validation paths and memory fallback above; due unavailable and ICU source-text fallback do not constitute application error reporting. Host owns logging/telemetry and recovery policy. |

## Provenance: exact reviewed source/report Git blobs

Every path below is read at base `e43bf604be74e0daf731bc990e6c3097f05ed89b`.
Hashes identify immutable source/report text; they do not mean that file's test passed.

| Repository path | Git blob |
| --- | --- |
| `README.md` | `0af615ed0dc6984d08b57aed8eea8ecb8ddce9a4` |
| `docs/migration.md` | `c16a7ab44e0533329f80d69c3c0c43db766e877f` |
| `docs/developer/component-architecture.md` | `802b8086c11e2c28460596214775653f75ac886d` |
| `docs/developer/react-aria-master-task-list.md` | `930c3c94d0d8b4a9c18e7528e860eabdb55ec5a1` |
| `docs/extraction-manifest.json` | `430d1211d1c2e0d5047da41eb2ced2ed745bbcf1` |
| `docs/developer/react-aria-removal-audit.md` | `0fcffdabebd08a1531bb8a16510a967157921482` |
| `package.json` | `f83bab2065c9ae79b31aa6b0aa143b7ae0b2a3f0` |
| `playwright.config.ts` | `ef2fb5556b35d18e74c7c02cdc512e92f2964223` |
| `.github/workflows/ci.yml` | `d1d9f200e46767226b6022925c40358680cd40c5` |
| `scripts/test-foundation-consumer.mjs` | `ff994cb7c9eaae3fbab58461c98ab0269a276c9c` |
| `scripts/test-next-consumer.mjs` | `5f45613658f5d40d8f5da4d76fb3de6babe529e3` |
| `docs/developer/react-aria-runtime-ci.md` | `9319d05492e47bcd15f751d3db7e042aa604fe0e` |
| `docs/developer/react-aria-server-components.md` | `52750245160e7a0618483639eaefce58973e900c` |
| `docs/developer/react-aria-browser-acceptance.md` | `41db9ad1186ddccbb84fabcd2a23237e05300c56` |
| `docs/developer/parallel-batch-50/dialog-header-reflow.md` | `44f297e634d974691b6c0afc443692943ddbb216` |
| `docs/developer/parallel-batch-52/dialog-removed-opener.md` | `2a215d217acc6811cba1fc29bedcf1a53b47bab8` |
| `src/experimental/Dialog/Dialog.tsx` | `b0bd1ef6109dba186bc881854339da68ec896284` |
| `src/experimental/Menu/Menu.module.css` | `2f5371f35a24b6d6104864d9385f2d94c927752a` |
| `src/experimental/Tabs/Tabs.module.css` | `2339422bd3c8450ccde92972dd3c3cfcc3b1c33c` |
| `src/components/ExperiencePageNavigator/ExperiencePageNavigator.module.css` | `f160c389615cffa9a11328a64908cf1628ea1bdc` |
| `src/components/FloatingTextSelectionToolbar/FloatingTextSelectionToolbar.tsx` | `349e5a394cb7005433c8e9c7a54f60dcc6254cf6` |
| `src/components/AppModal/AppModal.module.css` | `909d8ace2a84f6d1fca71274d2e9fa773dd5d411` |
| `src/components/AppDataGrid/ownedGridInteraction.tsx` | `c44cfd77b60afb1ad970351e6aaa9c34feb15473` |
| `src/components/AppDataGrid/ownedGridPersistence.ts` | `81fdc3a2da57986fdb3e04c71a45a608bc12796e` |
| `src/components/AppDataGrid/ownedGridParts.tsx` | `ccdbb11cc12e1a15b8406be1317320d74e2eb3f3` |
| `src/components/AppDataGridShell/AppDataGridShell.tsx` | `32310c5053ef335e38709f1650a7909be214722f` |
| `src/components/AppDataGridShell/AppDataGridShell.module.css` | `8279f3a644862ae9bfde8d2c46cee48887ccbe1e` |
| `src/components/AppDataGridRowDnd/DataGridDragHandle.tsx` | `95a093f39c766d6b0c7aefc179ae999cb9a05b81` |
| `src/components/PageRichTextEditorSection/PageRichTextEditorSection.module.css` | `eb123f89aeb360eb8394ab88be8d3b68774fe889` |
| `src/hooks/usePersistentState.ts` | `af48e9db8a583efbbe08fd290ef5a9d7eb8b8335` |
| `src/hooks/usePersistentPaginationModel.ts` | `bedcdea5d9b8ac2cc8ff35b310570057a9a1bb16` |
| `src/components/SideNavigation/SideNavigation.tsx` | `87a78ab622b7ab31eed623af8a4ab529a1b2fb4b` |
| `src/experimental/DateRangeSelector/date-contract.ts` | `28fe61014fb64dbfa5e2c79dd433926548a75855` |
| `src/utils/formatDueDateLabel.ts` | `dfce16aa6abbed4fa0ea74f0257805b8a1b53431` |
| `src/i18n/index.tsx` | `3995019deab2fe0b5c1082320c06c73802a47ffb` |
| `src/i18n/icu.ts` | `7a93dd490eb641b91bbfdcee6e6d9784b452cb49` |
| `docs/developer/react-aria-calendar-contracts.md` | `3a3c1a7efbad904f16155e9977768c375f4d2c94` |
| `docs/developer/react-aria-due-date-acceptance.md` | `aeb82c9f96fcd433c50b75c7d06a84afbf17d068` |
| `docs/developer/react-aria-pagination-state.md` | `6a080cca3504917f0c474da50449696da0631a6e` |
| `docs/developer/react-aria-i18n-acceptance.md` | `bd3cbf71040160b8c27a53f4df44f558c9f85c52` |
| `src/components/AdminDataGridOptions.ts` | `2149e949bb429adb23281748490efa29979a76da` |
| `src/components/InstructorDataGridOptions.ts` | `6289bbe308424625e079db723ffd440176736691` |
| `src/models.ts` | `08b008fb77535eaba532cdc1a0502267e5f3edcb` |
| `src/components/ImageUploadModal/ImageUploadModal.tsx` | `024fe4325fcd436eab20c4db847034665012814f` |
| `src/components/LinkUrlModal/LinkUrlModal.tsx` | `7fd54bfbfeab8c153f76ce3d8affa4861d1c905b` |

## Validation and handoff

Read-only Git/file checks: manifest existence/tracking/replacement counts, cited
source/report blob resolution, report relative-link/path existence and
`git diff --check`. No runtime checks are claimed. Root alone decides parent
closure, source follow-up ownership and current-head validation scheduling.
Report is ready for individual review/integration; commit/status supplied in the
coordinator message. Broad G/K/E/U/X/R/Z, device/AT, owner and legal gates remain open.
