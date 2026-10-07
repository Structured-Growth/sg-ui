# Batch 60: M-04/M-05 retained evidence reconciliation

Evidence-only review on 2026-10-07. Exact reviewed baseline and initial clean
worktree HEAD: `98ff10c1e475c4bffb3a1857ea6e9e3757c9de6c`.
Managed worktree: `/Users/thomashall/.codex/worktrees/batch60-page-navigation-evidence/sg-ui`.
Exclusive writable file: this report. No implementation, tests, stories, canonical
acceptance record, master, ledger or unrelated worktree was changed.

**Updated recommendation after wave 29: ACCEPT M-04 and M-05, row only.**
The independently verified 12 header and 32 catalog-tab Firefox cases below
supply the missing supported-engine row evidence. Every exact row criterion is
supported by inspected source/behavior coverage and historical C/W plus new
Firefox execution. No concrete remaining row gap or runtime defect was identified.
These results are from distinct heads/builds with the provenance limits below;
this is not a claim of a fresh current-head three-engine matrix or production
acceptance. Coordinator alone accepts rows and edits canonical records/checklists.
Initial HOLD at commit `9e037a88451dd006a32c358b71cda9a493e83fd9` is superseded
by this same-report follow-up; no source ownership or test scope expanded.

## Criteria and evidence

The [master inventory](../react-aria-master-task-list.md) requires all row
implementation/types/exports/styles/helpers/stories/behavior tests to migrate
together. The [canonical acceptance record](../react-aria-migration-inventory-acceptance.md)
still says M-04 native wrapping and M-05 complete tab-mode matrix are unproven.
The later [batch 29 review](../parallel-batch-29/inventory-acceptance-02-12.md)
already narrows these holds to Firefox. This report independently checks retained
original logs and Git bytes rather than repeating its claims as fresh execution.
The [page layout contract](../react-aria-page-layout.md) distinguishes controlled
tabs from route links; neither row requires an invented vertical tabs API.

| Exact row criterion | Inspected source/test and existing execution | Updated row disposition |
| --- | --- | --- |
| M-04 breadcrumbs | AppPageHeader preserves visible ancestors/current plain text, collapses hidden ancestors into Show path; unit case activates a host route, dismisses, restores focus. Batch10 native cases enter the collapsed menu, verify focused item and Escape restoration. | Supported: existing evidence plus verified wave29 Firefox matrix below; no remaining row gap identified. |
| M-04 actions | Supplied action slots precede More actions; owned Menu maps callbacks/disabled/danger items. Unit cases verify once-only enabled activation, disabled skip, portal scope, Escape and precedence. Native action/menu variants check visible unobscured tab stops, disabled skip, activation and trigger restoration. | Supported: existing evidence plus verified wave29 Firefox matrix below; no remaining row gap identified. |
| M-04 metadata | Optional keyed metadata/icon slots; decorative icons and body2 typography. Unit semantics; native fits assertion bounds the metadata and long heading/description/breadcrumb/button descendants. | Supported: existing evidence plus verified wave29 Firefox matrix below; no remaining row gap identified. |
| M-04 primary/subpage hierarchy | Native header ref/headingLevel and token surfaces; unit/SSR coverage. Batch10 measures distinct resolved surfaces, white primary in light theme and >=4.5 inherited text contrast for both surfaces/themes. | Supported: existing evidence plus verified wave29 Firefox matrix below; no remaining row gap identified. |
| M-04 responsive wrapping | CSS flex-wrap, min-inline-size and overflow-wrap; ReflowActions/ReflowMenu stories. Twelve cases per engine: two themes × 1280/320/640px (640 uses 200% root text) × action/menu. Header/descendant bounds and focused action hit testing pass in C/W. | Supported: existing evidence plus verified wave29 Firefox matrix below; no remaining row gap identified. |
| M-05 tab/panel wiring | Wrapper composes owned Tabs; reciprocal controls/labelledby IDs. Unit tests check controlled acceptance and duplicate IDs across independent instances. Native spec verifies reciprocal selected-panel wiring and Tab/Shift+Tab panel access across both instances. | Supported: existing evidence plus verified wave29 Firefox matrix below; no remaining row gap identified. |
| M-05 selected/disabled state | Host-controlled onChange, disabled keys, automatic/manual activation. Units verify withheld request then host acceptance; route current/disabled/replacement/modified-click behavior remains distinct from tab mode. Native matrix checks disabled skip, selection isolation and manual focus before Space/Enter. | Supported: existing evidence plus verified wave29 Firefox matrix below; no remaining row gap identified. |
| M-05 density | Default inherits scope; compact/comfortable override through owned density tokens. Native cases measure 32/44px min height scaled with root text, inherited both densities and explicit opposite-scope overrides. | Supported: existing evidence plus verified wave29 Firefox matrix below; no remaining row gap identified. |
| M-05 keyboard/overflow | Existing Tabs/scrollTabIntoView move only the strip; route unit geometry checks avoid window scrolling. Catalog native matrix covers automatic/manual, en-US/ar-EG direction, 100/200% text, Home/End/reverse wrap, panel stops, complete focused-tab bounds and visible outline. | Supported: existing evidence plus verified wave29 Firefox matrix below; no remaining row gap identified. |

Inspected files: `src/components/AppPageHeader/`, `src/components/AppPageTabs/`,
their public indexes/root/component barrels/package subpaths, owned Tabs/strip
helper, Link/Menu/Button dependencies, and the two focused specs below. The shared
AppPageHeader SSR test also covers route AppPageTabs without browser globals.
These are source observations, not new test/package execution results.

## Retained original artifacts and exact attribution limits

| Slice | Git identity from completed report/history | Independently retained original artifacts |
| --- | --- | --- |
| [Batch07 catalog tabs](../parallel-batch-07/catalog-tabs.md) | Coverage/tested head `13f3c5536ad2b0673839a617c6fafd16911fa0a3`; final report head `00bb2adf057046dc44d5b89973caafb81ae71a68`. Report attributes fresh build and run to coverage head. | `/tmp/sgui-batch07-catalog-tabs-storybook.log` ends with successful build and original output path; `/tmp/sgui-batch07-catalog-tabs-browser.log` lists **32 catalog + 8 prerequisite cases per engine**, Chromium/WebKit, **80 passed (36.7s)**. Catalog-only total is 64; prerequisite experimental Tabs total is 16. No Firefox entry. |
| [Batch10 page header](../parallel-batch-10/page-header-reflow.md) | Story/runtime build head `a6e704f434e152a2e7a0cab2b0938ad37f943986`; final tested spec head `f1ec49bbd9934d1ab975adf876ca12d9898c6aa2`; final report head `4e065ce19d7873db263b28f3a2bcf26448856ad2`. | `/tmp/sgui-batch10-header-storybook.log` ends with successful build/original output path. `/tmp/sgui-batch10-header-browser-final.log` enumerates **12 Chromium + 12 WebKit**, **24 passed (10.2s)**. No Firefox entry. |

The original `batch07-catalog-tabs/sg-ui` and `batch10-page-header-reflow/sg-ui`
directories no longer exist. Their ignored results/traces and original static
builds were not located. Neither surviving build log nor browser log embeds an
exact Git HEAD, immutable source digest or build digest. Thus tested/build HEAD
attribution is supported by committed contemporaneous reports and Git history;
the logs independently corroborate outcomes, case names/counts and engine scope,
but do **not** independently prove exact source or build identity. No original
build hash is available; hashes of logs below are artifact identities, not build
hashes. Present-day files/builds in other worktrees cannot substitute for them.

Also inspected `/tmp/sgui-batch10-header-browser.log` (initial 12 WebKit focus
expectation failures), `/tmp/sgui-batch10-header-diagnostic.log` and its retained
diagnostic script. The final Git patch permits only the known ancestor anchor as
an intermediate Tab stop, checks its visibility if visited and still requires
the actions. This matches the report's native WebKit anchor-stop explanation;
it is not evidence of an outstanding header runtime defect. Red logs are retained.

Read-only filesystem search traversed `/Users/thomashall/.codex/worktrees` and
`/private/tmp` for evidence/results JSON and browser logs (excluding dependency,
build asset and trace payload directories), plus targeted original paths and Git
history. At the initial review, no additional M-04/M-05 Firefox execution artifact was located. Wave29 evidence subsequently supplied by the coordinator is verified below. The original search is
a bounded local search result, not a claim that no evidence could exist elsewhere.

## Reviewed baseline bytes versus historical tested bytes

`git diff --name-only` found **no differences** between each historical tested
head and reviewed baseline for its complete component directory and focused spec.
Between the header build and tested heads, the sole changed path is
`tests/browser/batch10-page-header-reflow.spec.ts`; runtime/story bytes match.

A recursive relative-import source/CSS comparison found 12 files in the tabs
runtime closure and 23 in the header closure. Later changes exist in shared Link
for both closures, and Button/Menu for header: case-insensitive `_blank` isolation,
native submit/reset handling, and committed menu-item focus reconciliation.
These direct-path comparisons do not prove all dependency/package/token bytes
or relabel old passes as current-baseline execution. The menu change is explicit historical interaction-dependency drift; wave29 now
exercises its Firefox entry/focus behavior on an immutable candidate. Older C/W
passes are not reattributed to these changed dependencies. No exact original C/W
build digest is asserted.

## Wave29: independently verified missing Firefox proof

Actual immutable candidate: `f87c8d336932ea70ad3ab9eaea5e4e6b77bc40ec`.
Reviewed dev comparison: `30d44d560336e6c03adfd21792741f35b1478f41`
(resolved requested `30d44d5`). Evidence root:
`/Users/thomashall/.codex/worktrees/batch45-shared-native-candidate/sg-ui/artifacts/browser-pool/693cd1a1-28f1-4986-b345-258b4621c480`.
Attribution: `/tmp/sgui-batch45-candidate-wave29-attribution.json`.
Read root `evidence.json`, both shards' `evidence.json`, `results.json` and
`browser.log`, and the digest/cleanup implementation in the browser pool harness.

| Shard | Verified actual case/result scope |
| --- | --- |
| `page-header-firefox-gap` | 12 distinct expected Firefox cases, every result passed at retry 0; 0 skipped/unexpected/flaky, empty errors; log 12 passed (13.6s). Two themes × three widths/text states × action/menu variants; supplies all five M-04 criteria's missing native engine slice. |
| `catalog-tabs-firefox-gap` | 32 distinct expected Firefox cases, every result passed at retry 0; 0 skipped/unexpected/flaky, empty errors; log 32 passed (29.2s). Four density/scope combinations × automatic/manual × en-US/ar-EG × normal/enlarged text; supplies all four M-05 criteria's missing native engine slice. |

Root status is passed, five green shards totaling 54 cases (12 + 32 + 2 + 4 + 4).
Only the 44 Firefox cases belong to this report's rows. Root commands select the
exact two existing specs, `--project=firefox`, with no grep; shard case identities
and Playwright result traversal agree. Node `v24.19.0`, pnpm `10.29.3`, Playwright
`1.63.0`, macOS `darwin`/OS `27.0.0` are recorded. A separate Firefox binary version
is not present in these evidence records; the named project is not substituted
for a measured browser version.

Root initial/final HEAD are the candidate above, final Git status is empty and
source tree `614621b1a766db13e0c671d7f341806f0946c4d5` independently equals its
Git tree. Initial/final source digest:
`6464ca63b43a916374529d26fd88b7cdefcd4efb82b0bcd2014618c1d9bbfe38`.
Initial/final build digest (also both shards):
`d6a2c0f07f33e5ca842a98dbf9fe0f0f86b9700add97fdda68c4bcb87c9859f8`.
Independently recomputed source digest from exact candidate Git archive blobs in
tracked-file order (path, NUL, bytes), and retained static build digest using the
harness's sorted recursive relative-path/type/file-byte algorithm; both match.
Thus this new evidence has immutable identities unavailable for the original C/W
artifacts. It does not manufacture equivalent historical C/W provenance.

Full directory/spec Git comparisons show no differing path for AppPageHeader
(all six files), AppPageTabs (all five files), or either focused spec between the
candidate and reviewed dev, and between initial baseline and reviewed dev.
Independently recomputed both spec SHA256s match attribution and the earlier hash
table: header `0dab2e1a1d9472a8fa6b5194a7eab9dcb58f8ec6d7c8eb80511c905c029c841b`,
tabs `0425b96137e78aa3881afa3d29e77a98a81d88cc08fad47c1902afffc9e21fea`.
Recursive relative-import runtime/CSS closures (23 header, 12 tabs files) are
also byte-identical between candidate and reviewed dev. This strengthens current
Firefox attribution while preserving the explicitly changed historical Link,
Button and Menu callback/focus dependencies described above. Historical same
component/spec bytes alone do not establish current C/W dependency execution.

Cleanup evidence says `owned commands settled`, resourcesAfter has no owned
processes and zero owned RSS. Read-only inspection finds no wave29 owner claim in
pool/heavy/legacy lock roots; `lsof` finds no listeners on the two shard ports
6556/6557. Root finalization checks source/build equality and settles owned
commands before cleanup; no worker process or foreign lock was modified here.

## Remaining global gates and recommendation boundary

No further M-04/M-05 implementation or duplicate focused C/W slice is proposed.
The previously requested Firefox checkpoint has now actually run and passed.
Routine shared-dependency C/W validation remains governed by the coordinator's
[checkpoint policy](../react-aria-development-validation.md); it is not relabeled
as completed by this mixed historical/current evidence record.

Browser-chrome zoom, physical devices/touch, spoken AT tab/panel/menu behavior and
manual visual review remain global U/X/R/Z/production gates. The exact M-04/M-05
rows do not name spoken announcements or physical-device behavior; do not use
those broader gates alone as a perpetual row hold after row criteria are evidenced.
Root text enlargement is not browser zoom. The supported-engine row gap is now evidenced. Recommend accepting both rows
only; broad manual/device/AT/production gates remain open.

## Report validation

Read-only source/contracts/specs/history/artifact inspection and SHA256 computation.
Local Markdown paths and `git diff --check` verified; only this report is committed.
This worker ran no install, tests/build/Storybook/browser/server/CI/PR action or source modification,
heavy lock, main integration, publication or credential access occurred.
Completion HEAD and clean worktree are reported to the authorized coordinator
`01a1164f-41db-7f30-aaf9-f20133b6566f`; coordinator alone integrates and updates status.

## SHA256 identities

The table below hashes reviewed baseline files and retained logs; component/spec
bytes match their corresponding historical heads as described above.

| File/artifact | SHA256 |
| --- | --- |
| `src/components/AppPageTabs/AppPageTabs.tsx` | `15eeb772242aae11a8ed2ece0625c6423b5a43cc8789e5fc44542585a7099bbc` |
| `src/components/AppPageTabs/AppPageTabs.module.css` | `b906fa0446cc59f42b9efa1015cc41ed20c3d1ebf08df8e0ce081b92725d8794` |
| `src/components/AppPageTabs/AppPageTabs.stories.tsx` | `3140d1821f7a05fa11385c05e2764b4d388a0e39e0ab7b664cc8d6c7e37fc396` |
| `src/components/AppPageTabs/AppPageTabs.test.tsx` | `a7cff60793524ef62e57079c5e04ba9a2fa754c5c1e3ab423e5b3b2e59be66eb` |
| `tests/browser/batch07-catalog-tabs.spec.ts` | `0425b96137e78aa3881afa3d29e77a98a81d88cc08fad47c1902afffc9e21fea` |
| `src/components/AppPageHeader/AppPageHeader.tsx` | `acd5a39c2187d834f830d5a28633d89e9c891224ef6e68cdf48143488272969b` |
| `src/components/AppPageHeader/AppPageHeader.module.css` | `1618a14bbd4801ab6e42e71b76f8bcbb533145f5451cc4a8f31624dbf01001fe` |
| `src/components/AppPageHeader/AppPageHeader.stories.tsx` | `d6b5cbeae68c798a4e078f1cb1c27f97196fd7248dd6cb45c4c03a7d67d62c09` |
| `src/components/AppPageHeader/AppPageHeader.test.tsx` | `b55acb78ccbccee9593214513c0a238ea1d627431237738d1c6d225ad42f0e71` |
| `tests/browser/batch10-page-header-reflow.spec.ts` | `0dab2e1a1d9472a8fa6b5194a7eab9dcb58f8ec6d7c8eb80511c905c029c841b` |
| `/tmp/sgui-batch07-catalog-tabs-browser.log` | `441d25a520915623cfb5b5c14919aa4c35c772de4fb9f08c6d33f16651823ce4` |
| `/tmp/sgui-batch07-catalog-tabs-storybook.log` | `0d183a48dca968568f71d17bc074b6533b1bbebaee90e12937350c0bc3fda662` |
| `/tmp/sgui-batch10-header-browser-final.log` | `5e8eefe52510d770efe91c9d972e24c9b5ba0745bc302bf5e2e60053605a5549` |
| `/tmp/sgui-batch10-header-storybook.log` | `6a2570bae9796b9cc4c7cc767d703993eea7ae13151b06969019d777206fe1d1` |

Wave29 retained artifact SHA256 identities (paths relative to its evidence root, except attribution):

| Artifact | SHA256 |
| --- | --- |
| `evidence.json` | `7f6a4c09af4bde28aad03a98aa6fc6e774fb81beec8d40904b74dfe2679825b3` |
| `page-header-firefox-gap/evidence.json` | `582c10054c15b11adac4a20fa445ddb6cf6649fb91f694ca415b9173f1d04cd0` |
| `page-header-firefox-gap/results.json` | `a4a95bab0d296d18f8c5e8afcd25a9528de6a0ac24a3314761d549d80e9f8582` |
| `page-header-firefox-gap/browser.log` | `79d6fd4c8dc23394781e72aa8a2cffa9f7c05fd20a815a8422ce3548527c10f7` |
| `catalog-tabs-firefox-gap/evidence.json` | `3ef1e67d41125e6dbd472eb7f49eeb092c457e72e92260bced05095c7a25c3e4` |
| `catalog-tabs-firefox-gap/results.json` | `72b42db7338f796a45569d2853ba52be690404739a1e55fbe4d95aab0c4669f2` |
| `catalog-tabs-firefox-gap/browser.log` | `37c72c6883dac58433cc725cd1b6414f80c0a6e12d70b2c752e3eeea56e0ee56` |
| `/tmp/sgui-batch45-candidate-wave29-attribution.json` | `e8286a5dc9332e7f987b90e8f1ae49c6fbe104f4e4ec6b429e923b6aaf35d4c9` |
