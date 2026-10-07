# Batch 60: M-04/M-05 retained evidence reconciliation

Evidence-only review on 2026-10-07. Exact reviewed baseline and initial clean
worktree HEAD: `98ff10c1e475c4bffb3a1857ea6e9e3757c9de6c`.
Managed worktree: `/Users/thomashall/.codex/worktrees/batch60-page-navigation-evidence/sg-ui`.
Exclusive writable file: this report. No implementation, tests, stories, canonical
acceptance record, master, ledger or unrelated worktree was changed.

**Recommendation: retain HOLD for M-04 and M-05, with narrower reasons.** The
canonical record's missing native slices have existing Chromium/WebKit execution
evidence; commissioning another implementation or equivalent C/W matrix would
duplicate completed work. The remaining row evidence is Firefox execution of the
existing focused specs on a frozen reviewed build. No runtime defect was established.
Coordinator alone decides acceptance and edits canonical records/checklists.

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

| Exact row criterion | Inspected source/test and existing execution | Residual row gap |
| --- | --- | --- |
| M-04 breadcrumbs | AppPageHeader preserves visible ancestors/current plain text, collapses hidden ancestors into Show path; unit case activates a host route, dismisses, restores focus. Batch10 native cases enter the collapsed menu, verify focused item and Escape restoration. | Firefox native menu/focus result absent. |
| M-04 actions | Supplied action slots precede More actions; owned Menu maps callbacks/disabled/danger items. Unit cases verify once-only enabled activation, disabled skip, portal scope, Escape and precedence. Native action/menu variants check visible unobscured tab stops, disabled skip, activation and trigger restoration. | Same missing Firefox matrix, not a new action API. |
| M-04 metadata | Optional keyed metadata/icon slots; decorative icons and body2 typography. Unit semantics; native fits assertion bounds the metadata and long heading/description/breadcrumb/button descendants. | Firefox computed native wrapping absent. |
| M-04 primary/subpage hierarchy | Native header ref/headingLevel and token surfaces; unit/SSR coverage. Batch10 measures distinct resolved surfaces, white primary in light theme and >=4.5 inherited text contrast for both surfaces/themes. | Firefox computed surface/layout result absent. |
| M-04 responsive wrapping | CSS flex-wrap, min-inline-size and overflow-wrap; ReflowActions/ReflowMenu stories. Twelve cases per engine: two themes × 1280/320/640px (640 uses 200% root text) × action/menu. Header/descendant bounds and focused action hit testing pass in C/W. | Twelve existing Firefox cases remain unexecuted in located evidence. |
| M-05 tab/panel wiring | Wrapper composes owned Tabs; reciprocal controls/labelledby IDs. Unit tests check controlled acceptance and duplicate IDs across independent instances. Native spec verifies reciprocal selected-panel wiring and Tab/Shift+Tab panel access across both instances. | Firefox native result absent. |
| M-05 selected/disabled state | Host-controlled onChange, disabled keys, automatic/manual activation. Units verify withheld request then host acceptance; route current/disabled/replacement/modified-click behavior remains distinct from tab mode. Native matrix checks disabled skip, selection isolation and manual focus before Space/Enter. | Firefox keyboard result absent. |
| M-05 density | Default inherits scope; compact/comfortable override through owned density tokens. Native cases measure 32/44px min height scaled with root text, inherited both densities and explicit opposite-scope overrides. | Firefox computed density result absent. |
| M-05 keyboard/overflow | Existing Tabs/scrollTabIntoView move only the strip; route unit geometry checks avoid window scrolling. Catalog native matrix covers automatic/manual, en-US/ar-EG direction, 100/200% text, Home/End/reverse wrap, panel stops, complete focused-tab bounds and visible outline. | Thirty-two existing Firefox catalog cases remain unexecuted in located evidence. |

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
history. No additional M-04/M-05 Firefox execution artifact was located. This is
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
or relabel old passes as current-baseline execution. The menu change makes a fresh
frozen snapshot particularly relevant for the missing Firefox entry/focus slice.
No new runtime pass or exact original build digest is asserted.

## Bounded follow-up and separate global gates

Under the [validation policy](../react-aria-development-validation.md), request
the coordinator's existing browser/checkpoint owner to run the **existing**
`batch10-page-header-reflow.spec.ts` (12 cases) and
`batch07-catalog-tabs.spec.ts` (32 cases) in Firefox on one freshly built immutable
reviewed candidate. Retain actual candidate HEAD, source/build digests, spec hashes,
engine versions and case-level results; classify any failure before assigning
implementation work. Do not recreate stories/specs or rerun the completed old
C/W slices merely to refresh wording. Future shared-dependency regression checks
belong to the coordinator's scheduled checkpoint, not this evidence-only worker.

Browser-chrome zoom, physical devices/touch, spoken AT tab/panel/menu behavior and
manual visual review remain global U/X/R/Z/production gates. The exact M-04/M-05
rows do not name spoken announcements or physical-device behavior; do not use
those broader gates alone as a perpetual row hold after row criteria are evidenced.
Root text enlargement is not browser zoom. This recommendation retains both holds
specifically for the supported-engine native row gap and does not close global gates.

## Report validation

Read-only source/contracts/specs/history/artifact inspection and SHA256 computation.
Local Markdown paths and `git diff --check` verified; only this report is committed.
No install, tests/build/Storybook/browser/server/CI/PR action, source modification,
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
