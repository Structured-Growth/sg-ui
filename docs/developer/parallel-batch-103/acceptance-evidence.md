# Batch 103: current-head acceptance evidence for C-08–C-11

Reviewed source head: `e43bf604be74e0daf731bc990e6c3097f05ed89b` (`codex/dev` assigned baseline).
Inspection date: 2026-10-07, America/Chicago. Isolated managed checkout:
`/Users/thomashall/.codex/worktrees/batch103-evidence/sg-ui`.
This report is the only edited file. No source, stories, configuration, acceptance
checkboxes, ledgers or other reports changed. Coordinator alone accepts/integrates.

This is a fresh read-only assessment of the four unchecked parent criteria, not
another M-row inventory. **No current-head runtime test was run.** No install,
build, pack, browser, performance, CI or validation-pool command was issued.
The source head below identifies inspected code, not a tested head.

## Per-ID matrix

| Criterion | Disposition at reviewed head | Supported slice and exact remaining gate |
| --- | --- | --- |
| C-08 | **Actual missing implementation/documentation; partial layout support** | Only DateRangeSelector declares `container-type: inline-size` and `@container (max-width: 38rem)`. CardCollection uses intrinsic `auto-fill/minmax` Grid; DataToolbar wraps Flexbox and uses a viewport `24rem` media query; SideNavigation uses fixed/collapsed widths; AppShell uses a viewport `40rem` query; AppModal/Dialog use Flexbox, viewport sizing and wrapping. These are useful responsive layouts but do not fulfill container size queries for the four specified composition families. No containment-boundary contract for those families was found. Choose and document component/host boundaries, implement needed size queries, then verify independent narrow hosts inside a wide viewport. |
| C-09 | **Partial; narrow direction mechanisms supported, navigation motion gap** | Logical margins/borders/sizes/text alignment are present in inspected compositions. TextAlignMenuControl uses `:dir(rtl)` to swap logical start/end icons while physical commands remain distinct. Directional navigation icons really do mirror: ChevronRight/KeyboardArrowLeft pass `directional=true` to createIcon; icons CSS applies `scaleX(-1)` under RTL. Menu/Popover expose logical start/end placement; visual portal direction is separate from interaction locale. SideNavigation forward/back keyframes still use unconditional physical `translateX(1rem)`/`translateX(-1rem)`, so their forward/back motion does not reverse with direction. Native direction-aware motion and broad catalog placement/RTL runtime acceptance remain open; physical geometry used for hit-testing/clamping is not itself an RTL defect. |
| C-10 | **Partial; inspected source supports preference and cleanup** | Assigned composition styles use Grid/Flexbox. All four production ResizeObserver allocations found (grid one, shell two, floating selection one) return `disconnect()`. Measurement is tied to explicit grid width allocation/resizing, shell status/focus space, floating selection collision and focus/drag hit geometry, as detailed below. Source supports this bounded rationale; retained current-head native proof and catalog-wide acceptance of necessity/performance/lifetime are not established. No general layout defect was demonstrated and no speculative production rewrite is proposed. |
| C-11 | **Actual missing native nesting/support contract; partial ownership support** | 80 current CSS Modules inspected: no `&` and no nested block beneath a selector rule. `@layer`, `@media`, `@supports`, `@container` and keyframes grouping are not native selector nesting. Inspected selectors are component-owned and generally shallow. Production PostCSS uses only postcss-modules, with no explicit nesting transform or browser target; the existing compiler unit test verifies class naming/layer preservation, not nested selector behavior. Storybook config shares the class naming function, not a declared nesting/browser support policy. Native nesting adoption, documented supported tooling/browser behavior and emitted nested CSS/consumer verification remain missing. |

## C-10 measurement ownership and lifetime inspection

The production-source geometry search (excluding tests/stories/CSS) returned eight
files using ResizeObserver or `getBoundingClientRect`/`clientWidth` geometry:

| Owner | Demonstrated source purpose | Cleanup/limit |
| --- | --- | --- |
| AppDataGrid/ownedGridInteraction | Container `clientWidth` feeds `measureOwnedGridWidths`, committed overrides and interactive resizing. | Initial measurement, guarded observer, disconnect on effect cleanup. Existing allocation unit test is source coverage, not a pass in this assignment. |
| AppDataGridShell | Measures live card-status height to preserve usable card space; observes shell/entry to reveal owned keyboard focus during resize. | Both observers disconnect; outside focus is excluded. Colocated tests assert disconnect for shell/status observers; unrun here. |
| FloatingTextSelectionToolbar | Measures toolbar and DOM selection geometry to clamp fixed overlay to viewport intersected with host boundary. | Observer disconnect; pending callback timers cleared; root/selection/scroll/pointer/resize/blur listeners unregister through merged cleanup. The editor-layout contract explicitly documents this measurement and transformed-containing-block host limit. |
| AuthShell/revealFocusedControl | Reveals an already focused control within clipping ancestors after native focus/layout timing. | One animation-frame callback, guarded connection/active-element ownership; no persistent observer/listener. Callback is not explicitly cancelled, so this is a guarded one-shot, not a claim of frame cancellation. |
| experimental/Dialog | Same one-shot native focus visibility repair inside dialog/ancestors. | Guarded one-shot frame; no ResizeObserver. Do not call physical bounding-box comparisons nonlogical layout. |
| experimental/Tabs/scrollTabIntoView | Keeps focused tab visible inside strip without scrolling host. | Synchronous event-driven bounds/scroll; no observer to clean up. Cross-engine RTL scroll behavior is not certified by source reading. |
| DataToolbarSortMenu | Pointer reordering resolves a target rule by row bounds. | Event-driven hit testing; callback refs remove detached rows. Not a JS replacement for Flexbox. |
| AppDataGridRowDnd/useDataGridRowDnd | Bounds size the native drag-image preview. | Preview cleanup removes document dragend listener and DOM preview on cancellation/end/unmount; physical-device/AT dragging remains separate. |

This review does not inspect private upstream engine internals or prove observer
performance in a browser. No new regression was added: C-08/C-11 require scoped
implementation/contract decisions; C-09's motion gap is statically evident and
requires a source change outside this assignment. Existing focused fixtures/tests
already cover important C-09/C-10 slices. A new passing filename would add no proof.

## Retained evidence, exact heads and artifact loss

[Batch38 alignment report](../parallel-batch-38/align-direction-native.md) records
four Chromium cases at exact tested source/spec head
`0228f521c302ea8ead9200f7722f0bd611116551`, source tree
`8eaf432f8ff5f05e5bed1d0c32cf7c5dd5deef33`; reported Node 24.19.0,
pnpm 10.29.3, Playwright 1.63.0. A read-only Git diff against reviewed head found
**no changes** in TextAlignMenuControl implementation, CSS, story or
`tests/browser/inventory-align-direction.spec.ts`. That preserves test/source
identity for this narrow slice, not a current-head full-matrix pass.

Actual filesystem inspection of its recorded artifact root
`/Users/thomashall/.codex/worktrees/batch38-align-direction/sg-ui/artifacts/browser-pool/c36d8b90-b18e-4418-964d-75058806e9f1/`
found only `storybook/`; `evidence.json`, `results.json`, `browser.log` and
`types.log` are **missing**. The report's pass counts are historical assertions,
not independently retained raw-result proof available to this worker. Firefox and
WebKit were pending in that report. Current-head engine/browser acceptance requires
a coordinator-owned fresh window with immutable source/build/result provenance.

[Batch05 portal report](../parallel-batch-05/portal-direction.md) records source
`7f9e5124c99a50352c38cfa02a2d74d0edbb5644` and final spec
`2d20123e4d3ce1688237fd45cef64943a3c901bf`, four Chromium/WebKit passes and
two Firefox launch failures before assertions. It supports historical bounded
portal scope work, not all placement/RTL acceptance. No raw artifact availability
or present-day success is claimed for that report. Native focus/DOM/computed-style
checks do not certify spoken AT, physical devices, zoom or every host.

## Minimal coordinator handoffs (proposed ownership, not edits authorized here)

- **C-08:** first bounded toolbar slice: exclusive
  `src/components/DataToolbar/DataToolbar.module.css` plus
  `docs/developer/react-aria-data-toolbar.md`. Decide the actual containment owner
  and query descendant search/actions within it; avoid making a query target its
  own container. Follow with separately reserved card/navigation/modal CSS and
  their existing contracts. Existing NativeComposition and NativeCompositionRtl
  stories provide a deterministic toolbar fixture. Targeted coordinator checks:
  foundation/token guards, existing toolbar units, and native width changes of the
  toolbar host with the viewport held wide in Chromium/Firefox/WebKit. Preserve
  focus, menus and enlarged-text wrapping. No new test file proposed before the
  selected query behavior is concrete.
- **C-09:** exclusive `src/components/SideNavigation/SideNavigation.module.css`;
  only reverse forward/back animation offsets under RTL and preserve reduced
  motion. Use the existing NativeHierarchy story with direction globals. Targeted
  native check: computed animation transform/sign during forward/back in both
  directions, then completion/focus and reduced-motion behavior. Keep existing
  icon mirroring; no icon rewrite needed. Current code has no direction-specific
  keyframe rule. Actual native failure remains unrun.
- **C-10:** no missing runtime behavior identified. Coordinator can reuse existing
  grid allocation, shell status/focus and floating toolbar lifetime checks; retain
  exact head/engine/results. Escalate a source allowlist only after a concrete
  failure. Observer existence alone is not justification for removal.
- **C-11:** first bounded CSS/tooling slice: exclusive
  `src/components/AppModal/AppModal.module.css`, `scripts/css-modules.test.mjs`,
  `docs/developer/react-aria-architecture.md`. Adopt a shallow nested action/footer
  rule, document whether output preserves native nesting and the supported browser
  policy, and test actual nested class scoping. Inspect production emitted CSS and
  packed consumer behavior across required engines in coordinator windows. No
  build pipeline/config change is presumed necessary; production/Storybook parity
  must be demonstrated rather than inferred.

All proposed source paths need coordinator reservation against the other workers.
This report neither waives parent criteria nor marks any whole parent complete.

## Exact checks performed

Read README, migration, component architecture, criterion definitions, relevant
source/build/story/test/contracts and bounded historical reports. Used `rg` across
source for container declarations, direction rules, measurement APIs and nesting;
read the resulting implementations and cleanup. Used a read-only Python lexical
brace scan over all 80 CSS Modules to distinguish selector nesting from at-rule
blocks; it is not a CSS parser or runtime test. Read actual recorded artifact-root
children and tested named raw-file existence. Compared the four alignment files
with the historical tested head using Git diff. The checks establish only the
observations stated above. Initial broad reads had truncation/missing optional
paths; focused follow-up reads supplied the cited actual paths. No failed runtime
check was hidden; none was executed.

## Exact Git blobs at reviewed head

These are immutable content identities, not test-result identities. Links point to
repository files; resolve `e43bf604be74e0daf731bc990e6c3097f05ed89b:<path>`
for the recorded version if the branch later moves.

| Source/evidence | Git blob |
| --- | --- |
| [src/experimental/DateRangeSelector/DateRangeSelector.module.css](../../../src/experimental/DateRangeSelector/DateRangeSelector.module.css) | `b7052417e3fbdeef01f25540a3f1f11619404ca9` |
| [src/components/CardCollectionWithFooter/CardCollectionWithFooter.module.css](../../../src/components/CardCollectionWithFooter/CardCollectionWithFooter.module.css) | `0f3c36eab8adb4707231483e174ebc00a5c490f8` |
| [src/components/DataToolbar/DataToolbar.module.css](../../../src/components/DataToolbar/DataToolbar.module.css) | `6a71a9063969370980ed0c951e28d06125535760` |
| [src/components/AppShell/AppShell.module.css](../../../src/components/AppShell/AppShell.module.css) | `04a572c3bc4b8b271e44a609261f20323a6a00dd` |
| [src/components/SideNavigation/SideNavigation.module.css](../../../src/components/SideNavigation/SideNavigation.module.css) | `6114fac274317446f612a6fe2be5c8afceb7745f` |
| [src/components/SideNavigation/SideNavigation.tsx](../../../src/components/SideNavigation/SideNavigation.tsx) | `87a78ab622b7ab31eed623af8a4ab529a1b2fb4b` |
| [src/components/AppModal/AppModal.module.css](../../../src/components/AppModal/AppModal.module.css) | `909d8ace2a84f6d1fca71274d2e9fa773dd5d411` |
| [src/experimental/Dialog/Dialog.module.css](../../../src/experimental/Dialog/Dialog.module.css) | `2a303b80cad1fecea4558179fabe14e959f65bde` |
| [src/components/TextAlignMenuControl/TextAlignMenuControl.module.css](../../../src/components/TextAlignMenuControl/TextAlignMenuControl.module.css) | `eea073f3ae659c42545f93dbd2dcb31b4204c51f` |
| [src/experimental/icons/createVector.tsx](../../../src/experimental/icons/createVector.tsx) | `96de9b9204544bce519a2d32564d1e8a65355a93` |
| [src/experimental/icons/icons.module.css](../../../src/experimental/icons/icons.module.css) | `0c3b8b81fc6d1ffbad317bf54e7116b8ee99a195` |
| [src/experimental/icons/ChevronRightIcon.tsx](../../../src/experimental/icons/ChevronRightIcon.tsx) | `e5495a0976e24625fd9d850deb8bce2eec644182` |
| [src/experimental/icons/KeyboardArrowLeftIcon.tsx](../../../src/experimental/icons/KeyboardArrowLeftIcon.tsx) | `37970655ae2da87f48f59d07f2685ffab6ec0a76` |
| [src/experimental/Menu/Menu.tsx](../../../src/experimental/Menu/Menu.tsx) | `60ebffe51e492d220465271c2b783c422ccc716a` |
| [src/experimental/Popover/Popover.tsx](../../../src/experimental/Popover/Popover.tsx) | `a892ebeb2665f432c635619bc2be43ee5abcb174` |
| [src/components/AppDataGrid/ownedGridInteraction.tsx](../../../src/components/AppDataGrid/ownedGridInteraction.tsx) | `c44cfd77b60afb1ad970351e6aaa9c34feb15473` |
| [src/components/AppDataGridShell/AppDataGridShell.tsx](../../../src/components/AppDataGridShell/AppDataGridShell.tsx) | `32310c5053ef335e38709f1650a7909be214722f` |
| [src/components/FloatingTextSelectionToolbar/FloatingTextSelectionToolbar.tsx](../../../src/components/FloatingTextSelectionToolbar/FloatingTextSelectionToolbar.tsx) | `349e5a394cb7005433c8e9c7a54f60dcc6254cf6` |
| [src/components/AuthShell/revealFocusedControl.ts](../../../src/components/AuthShell/revealFocusedControl.ts) | `5f3a60ff53385c8a87464fc1ef9b135aa40878f9` |
| [src/experimental/Dialog/Dialog.tsx](../../../src/experimental/Dialog/Dialog.tsx) | `b0bd1ef6109dba186bc881854339da68ec896284` |
| [src/experimental/Tabs/scrollTabIntoView.ts](../../../src/experimental/Tabs/scrollTabIntoView.ts) | `4f2416cb1059b7d246653aee6a2ce60b717dad2f` |
| [src/components/DataToolbar/components/DataToolbarSortMenu.tsx](../../../src/components/DataToolbar/components/DataToolbarSortMenu.tsx) | `83b9fd4fb7d1235f6f36a085f5f723834ba6d093` |
| [src/components/AppDataGridRowDnd/useDataGridRowDnd.ts](../../../src/components/AppDataGridRowDnd/useDataGridRowDnd.ts) | `6c2c6d76954c7f1cd2351de9b1c0804c57e1f9f7` |
| [scripts/css-modules.mjs](../../../scripts/css-modules.mjs) | `32dec71c69010e4208e835be364f726fac2d65fe` |
| [scripts/css-modules.test.mjs](../../../scripts/css-modules.test.mjs) | `5a7305d07b9a70a10e648c31c4ef6b34978d10a0` |
| [.storybook/main.ts](../../../.storybook/main.ts) | `0774f805dda513b2422a02692c5f4ccec8d6c131` |
| [tests/browser/inventory-align-direction.spec.ts](../../../tests/browser/inventory-align-direction.spec.ts) | `5798f85f131f6c000e9094390d9f913be57543b2` |
| [docs/developer/parallel-batch-38/align-direction-native.md](../../../docs/developer/parallel-batch-38/align-direction-native.md) | `e2c5c49b8cbbc4ab7d35c3d3307cdb7c8c976a1d` |
| [docs/developer/parallel-batch-05/portal-direction.md](../../../docs/developer/parallel-batch-05/portal-direction.md) | `1e52f9cf7d6b67ad86b218ba3eaf6fe7a5c420e5` |
