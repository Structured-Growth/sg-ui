# Batch 124: X-14 / X-15 / X-16 / X-21 acceptance evidence

Reviewed on 2026-10-07 against assigned pushed baseline
`e43bf604be74e0daf731bc990e6c3097f05ed89b` (all source identities below refer
to that head). Managed worktree created and attached before edits:
`/Users/thomashall/.codex/worktrees/batch-124-evidence/sg-ui`.
Branch: `codex/batch-124-acceptance-evidence`.
Only this report changes. Root owns acceptance decisions, shared guidance and
integration. No parent criterion is recommended for whole-parent closure.

## Per-ID matrix

| Criterion | Finding at reviewed head | Exact support and remaining gate |
| --- | --- | --- |
| X-14 visual regression matrix | **Missing visual comparison coverage; partial presentation/interaction evidence.** | [Playwright config](../../../playwright.config.ts) records failure screenshots only. Searches found no `toHaveScreenshot`, `toMatchSnapshot`, Chromatic or Percy integration in tracked implementation/test/config files. [Storybook globals](../../../.storybook/preview.tsx) provide light/dark, compact/comfortable, locale/direction; they are fixture capability, not executed pixel comparison. Existing [display preferences](../../../tests/browser/display-preferences.spec.ts), [portal direction](../../../tests/browser/batch05-portal-direction.spec.ts), [tabs](../../../tests/browser/batch07-catalog-tabs.spec.ts) and [editor chrome](../../../tests/browser/inventory-editor-chrome.spec.ts) assert bounded geometry, focus, scope and state. The tabs Firefox shard below is retained execution evidence, with no visual baseline/diff. Add reviewed deterministic visual comparisons covering the stated dimensions, long/pseudo-localized labels and focus/error/loading/empty/selected states; retain baseline/actual/diff plus engine/build/head attribution. No full catalog Cartesian matrix is implied by existing globals. |
| X-15 deliberate screenshot review | **Partial safeguard; explicit review requirement missing from inspected harness/workflow.** | [Browser pool](../../../scripts/browser-validation-pool.mjs) rejects `--update-snapshots` and `--ignore-snapshots`; its [tests](../../../scripts/browser-validation-pool.test.mjs) contain corresponding rejected-input assertions (not run here). CI contains no automatic snapshot update step. However failure images and attached representative screenshots are diagnostics; there are no comparison baselines to review and no inspected requirement recording deliberate baseline-change approval. Establish named review ownership, old/new/diff inspection and a recorded reason for accepted changes when X-14 lands. Absence of auto-updating does not itself satisfy deliberate review. |
| X-16 instance/theme/ID/cleanup/state transitions | **Partial, with precise control-mode gate.** | Independent selector form values and unique IDs are asserted in [selector native tests](../../../tests/browser/batch01-selectors.spec.ts). [Provider portal unit test](../../../src/experimental/Provider/Provider.portal.test.tsx) mounts separate StrictMode scopes and checks independent direction/theme/density through reopen/removal. [AsyncMultiSelect unit tests](../../../src/experimental/AsyncMultiSelect/AsyncMultiSelect.test.tsx) check aborted StrictMode replay, late failures, retry and unmount, native reset in each fixed mode and controlled clear. [Portal native tests](../../../tests/browser/batch05-portal-direction.spec.ts) check nested scope changes, geometry and focus. Retained Firefox tabs below demonstrate independent controlled instances and distinct reciprocal IDs. [Packed consumer script](../../../scripts/test-foundation-consumer.mjs) asserts unique IDs before/after hydration and resolved hydrated IDREFs; source is not a run. Same-mount controlled→uncontrolled/uncontrolled→controlled coverage is unresolved: Select/ComboBox explicitly require stable mode. Fixed-mode host changes/reset are not mode-transition tests. A coordinator must define supported transition/remount expectations and gather bounded tests for them, plus remaining cross-control identity/cleanup coverage. |
| X-21 preserve/adapt test/story inventory | **Preservation subcriterion supported by fresh Git inspection; adaptation partial.** | Comparing historical migration baseline `21adebd61bedfc6a1ed395fe664ff4be83896821` with assigned head finds every original `.stories.tsx` (33/33) and `.test.tsx` (42/42) path retained. Current counts are 106 stories, 149 unit test files and 86 browser specs; counts are not passing behavior. [Baseline inventory](../migration-baseline/inventory.json) records that historical head. Current AppPageTabs `NativeKeyboard` supplies meaningful independent controlled fixtures; its retained shard below actually executes native input/IDs/focus. [Editor chrome native composition](../../../tests/browser/inventory-editor-chrome.spec.ts) adds live host states and screenshot attachment rather than assuming unit tests establish native layout. [Foundation guard](../../../scripts/check-foundations.mjs) requires colocated test files for registered controls; existence is not passing execution. Complete criterion requires explicit remaining behavior-to-story/native-test coverage, especially X-14 visual states and X-16 mode policy. This report does not repeat M-row acceptance reviews or infer whole-catalog native coverage from retained filenames. |

## Fresh inspection versus executed evidence

This worker ran **no install, unit/browser test, build, pack, performance job,
server, CI command or global lease operation**. Source/spec descriptions above
mean inspected assertions, not newly passing tests. No actual product regression
was reproduced. The demonstrated missing capability is visual comparison/review;
it requires harness/review changes outside this assignment's write boundary.
No optional `acceptance-pack-124.spec.ts` was added: duplicating existing native
tests would not supply pixel comparisons, a review process, or a defined supported
mode-switch contract.

The following existing execution artifact was actually opened and parsed read-only,
not merely copied from a report:

`/Users/thomashall/.codex/worktrees/batch45-shared-native-candidate/sg-ui/artifacts/browser-pool/693cd1a1-28f1-4986-b345-258b4621c480/`

- Root `evidence.json`: tested and final head
  `f87c8d336932ea70ad3ab9eaea5e4e6b77bc40ec`; Node `v24.19.0`, macOS
  `27.0.0`; initial/final source digest
  `6464ca63b43a916374529d26fd88b7cdefcd4efb82b0bcd2014618c1d9bbfe38`;
  initial/final build digest
  `d6a2c0f07f33e5ca842a98dbf9fe0f0f86b9700add97fdda68c4bcb87c9859f8`.
- `catalog-tabs-firefox-gap/evidence.json`: selects exactly
  `tests/browser/batch07-catalog-tabs.spec.ts`, `--project=firefox`, no grep;
  32 cases. `results.json`: expected 32, unexpected/skipped/flaky zero.
  Results config lists three available projects, but the shard's actual execution
  is Firefox only. It is not a three-engine pass.
- The source test loops density/default scope, manual/automatic activation,
  English/Arabic and 100%/200% root text at 380px. It asserts independent selected
  panels, distinct IDs/IDREFs, native Tab/arrow/Space and visible focus/scroll.
  These are bounded X-16 and X-21 evidence, not X-14 screenshot comparisons.
- Direct Git blob comparison found the entire five-file AppPageTabs directory
  (implementation, CSS, story, unit and index) and native spec unchanged between
  that tested head and assigned head. This attributes those bytes; the complete
  transitive runtime/build at the assigned head was not rerun or certified here.
  See the prior [page navigation attribution](../parallel-batch-60/page-navigation-evidence.md)
  for its own broader closure inspection. That report's manual/device/AT limits
  remain applicable.

| Retained artifact, relative to root above | SHA256 freshly calculated |
| --- | --- |
| `evidence.json` | `7f6a4c09af4bde28aad03a98aa6fc6e774fb81beec8d40904b74dfe2679825b3` |
| `catalog-tabs-firefox-gap/evidence.json` | `3ef1e67d41125e6dbd472eb7f49eeb092c457e72e92260bced05095c7a25c3e4` |
| `catalog-tabs-firefox-gap/results.json` | `72b42db7338f796a45569d2853ba52be690404739a1e55fbe4d95aab0c4669f2` |

Historical [selector report](../parallel-batch-01/selectors.md) identifies tested
implementation `b1119a0504004200bfdb8f0938cf78c4e47ca4dc` and records 10
Chromium/WebKit passes plus five Firefox launch failures. [Portal report](../parallel-batch-05/portal-direction.md)
identifies final native spec `2d20123e4d3ce1688237fd45cef64943a3c901bf`,
four Chromium/WebKit passes and two Firefox launch failures, exit 1. Their original
worktree `artifacts/browser-results.json` files and stated final logs
`/tmp/batch01-selectors-browser.log` and
`/tmp/sgui-batch05-portal-direction-browser-final.log` were checked and are absent
at those exact paths now. Those are retained documentary claims with lost original
artifacts, not fresh execution proof. No assertion that all later artifacts are
absent is made. The retained tabs Firefox result does not repair selector/portal
Firefox gaps by association.

## Immutable source anchors

Git object IDs below are obtained with `git rev-parse HEAD:<path>` at assigned
head. They allow exact source reconstruction even if a working copy changes.

| Path | Git blob |
| --- | --- |
| `playwright.config.ts` | `ef2fb5556b35d18e74c7c02cdc512e92f2964223` |
| `.storybook/preview.tsx` | `b84d33831293a155cc571eef6545d7deed67b683` |
| `.github/workflows/ci.yml` | `d1d9f200e46767226b6022925c40358680cd40c5` |
| `scripts/browser-validation-pool.mjs` | `56747d1ff109d02a87afa6a3d40c39dc6a3d8c20` |
| `tests/browser/batch01-selectors.spec.ts` | `c2565a4f08f2f979ce637377412d318ce9ff27de` |
| `tests/browser/batch05-portal-direction.spec.ts` | `f38e7e7293e5bf5a652b11321a98acbe02291d29` |
| `src/experimental/Provider/Provider.portal.test.tsx` | `872c535dd000b2f07152457213fcd08be5e7545f` |
| `src/experimental/AsyncMultiSelect/AsyncMultiSelect.test.tsx` | `0d55b878d020ebc2923d45df8e38f7cc70bf04a5` |
| `src/experimental/Select/Select.tsx` | `e4d05fbdef870aec23f46fbe34deef6bc723f62e` |
| `src/experimental/ComboBox/ComboBox.tsx` | `2beb5253e85aeafd87b291325a9e69d761b30074` |
| `scripts/test-foundation-consumer.mjs` | `ff994cb7c9eaae3fbab58461c98ab0269a276c9c` |
| `scripts/check-foundations.mjs` | `ecc96a852355231cc7845642c589980825a6356d` |
| `docs/developer/migration-baseline/inventory.json` | `780460f2faf7513135b6eaa6efacb230b2f9c3ea` |
| `tests/browser/inventory-editor-chrome.spec.ts` | `fbc9fe4a8d694249ba6af62d8f64c560c2157faf` |
| `tests/browser/batch07-catalog-tabs.spec.ts` | `441d3650fd8041965888c92a719e742c63f13d35` |
| `src/components/AppPageTabs/AppPageTabs.tsx` | `7ea331f606eb38e563dafea5f246cdf4fd44e084` |
| `src/components/AppPageTabs/AppPageTabs.module.css` | `fef066bc73e46b997fc64c1aef02f1777d404741` |
| `src/components/AppPageTabs/AppPageTabs.stories.tsx` | `80d126e92b332677e5411e993ce2b187d3122225` |
| `src/components/AppPageTabs/AppPageTabs.test.tsx` | `26647c16cd94df76c22aa4c5df61bb9ab9057138` |

## Minimal bounded coordinator handoffs

These are proposals for root scheduling, not permissions to modify files here or
create a fix chat. No production source change is justified by this audit.

1. **X-14/X-15 visual harness and review:** exclusive proposed write set
   `tests/browser/acceptance-visual-124.spec.ts`, its new generated
   `tests/browser/acceptance-visual-124.spec.ts-snapshots/`, and a new
   `docs/developer/react-aria-visual-review.md`. Reuse deterministic existing
   stories (e.g. AppPageTabs NativeKeyboard, Provider ExplicitPortalDirections and
   existing selector empty/invalid/request-race states); define the dimension/state
   mapping before baseline generation. Existing fixtures do not establish a
   pseudo-localized label matrix: reserve a separate exact story-file allowance
   only after identifying that fixture gap, with host-supplied labels and shared
   production scopes. Run browser typecheck and this spec in root's fresh immutable
   coordinated build, retain all selected engines and baseline/actual/diff files,
   and require deliberate reviewer acceptance. Baseline generation must be explicit;
   an initial approved baseline is not prior regression proof. Do not enable auto
   updates in CI or bypass the pool's override rejection.
2. **X-16 control-mode decision:** exclusive proposed documentation set
   `docs/developer/react-aria-selector-mode-transitions.md`; after root defines
   behavior, targeted Select/ComboBox unit tests may be separately assigned under
   those two component directories. Stable-mode contracts currently prohibit
   silently treating a mode switch as supported. Test accepted/rejected host
   changes, clear/reset, deliberate keyed remount and distinct instance ID/focus
   ownership as appropriate; only add native coverage where event timing requires
   it. No source defect or need for a new story was demonstrated here.
3. **X-21 remaining coverage reconciliation:** root can use the fresh path comparison
   as preservation evidence. Assign only demonstrated missing behavior fixtures,
   with an exact story/spec pair, rather than another M-row inventory review.
   Counts, foundation registration and unit assertions cannot substitute for native
   execution or the missing visual/mode-policy slices above.

All future tests above are **UNRUN / require root validation window**. The current
CI workflow excludes ordinary `codex/dev` PRs; required configured engines do not
imply a fresh dev-head CI execution. CI artifacts are configured for 14-day retention,
so a historical remote run or pathname alone does not prove present availability.
Current-head production full matrix, manual screenshot review, actual browser zoom,
physical devices, assistive technology and host ownership limits remain open.

## Checks performed for this report

Read-only `rg` searches for the four master IDs, snapshot APIs/update paths,
StrictMode/IDs/control modes and inventory guards; direct source/spec/story/report
reads; `git ls-tree -r --name-only` comparison at the exact historical/assigned heads;
`git rev-parse` blob comparisons; Python file-existence checks, JSON parsing and
SHA256 of the three retained artifacts. Markdown relative file links and
`git diff --check` are checked before commit. These are documentation/Git/artifact
checks only. No shared acceptance/ledger/generator/config or other report is edited.
Completion commit and clean readiness are sent to the explicitly authorized
coordinator `01a1164f-41db-7f30-aaf9-f20133b6566f` separately.
