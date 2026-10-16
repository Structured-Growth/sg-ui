# Wave 02-01: catalog acceptance reconciliation

**10 complete; 6 partial.** All sixteen original leaves reviewed. Completion is limited to the named component row; no release or whole-library conformance is claimed.

Captured 2026-10-16T22:45:34.929657+00:00 on modified `dev` HEAD `540f47d4059a9cea8890b80927f34f51ef2fbc3e`. Machine-readable leaf records are in [results.json](results.json); exact source/test/spec/fixture/output hashes, test-title line references and artifact availability are in [evidence.json](evidence.json).

## Method and retained evidence

Read full current A-M-01–15 and A-B-07 criteria, historical row holds, later checkpoint/HB receipts and the working implementations/assertions. F-C01–15 and T-C01–15 link to the accepted F/T baseline/regression completion records, unchanged relevant colocated tests and FA-04. V-C01–15 link to their specific saved native/presentation scopes below. Prefixes identify original component phases; no unit-case total is substituted for a leaf count.

Reused FA-01 export/output inventory, FA-02 import/source graph, FA-04 passing-unit reconciliation and prior parallel report. No repeated export/source inventory, build or behavioral suite. The source graph comparison verifies every reached local runtime dependency, including CSS, scope, tokens, icons and adapters; exact external package versions remain those in FA-01/02. Current relevant source/tests/native specs/fixtures match FA-02; associated existing outputs match FA-01. Concurrent coordinator changes in PeriodPicker, DateTimeRangePicker, DateRangeComparisonPicker and TextArea are outside these verified runtime closures. No assertion that their new source matches old dist is made.

Historical browser results retain their recorded host/head and desktop-engine limits. The 2026-10-15/16 receipts use the docs-owned /fixtures host. Older 2026-10-07 reports retain their Storybook provenance. The failed original FA-04 aggregate command remains failed; its unaffected passing tests plus corrected four calendar files supply the retained baseline. No fresh native, screen-reader, physical-device, remote CI or production artifact check occurred.

Verified 191 distinct relevant runtime inputs and inspected 28 expected historical local browser artifact roots; 0 exist. Missing raw artifacts do not erase accepted historical V results, but cannot be relabeled current-head screenshots/immutable-host execution. B-07 retains its capture-delivery gap. All cited unit files and native spec titles/lines are indexed for review rather than executed again.

## Per-leaf outcomes

### A-M-01 — complete

Original: Reconcile Button final acceptance: Owned button props, variants/tones, native form behavior, press/click mapping. Link its `F-C01`, `T-C01` and `V-C01` evidence and any unresolved defects.

Owned ButtonProps selects native button/ARIA attributes and exposes onPress() without upstream events; native button ref, filled/outlined/text, primary/neutral and density remain.

type defaults to button; submit/reset deliver one callback in capture before the native action. Pending reset becomes type=button, blocks reset, retains focus, and resumes with the latest callback. Disabled/pending paths and native form behavior have retained unit/native evidence.

**F/T/V links:** F-C01 / T-C01 retain the accepted baseline/regression records and unchanged unit files. V-C01: Second control batch and HB-04: three desktop engines; explicit pointer/touch presentation, theme/density geometry and native pointer/Enter/Space form transactions. AppButton historical name maps to current Button; FA-01/parallel-01 already resolve that alias removal.

**Concrete source/tests:** `packages/ui/src/components/Button/Button.module.css`, `packages/ui/src/components/Button/Button.tsx`, `packages/ui/src/components/Button/index.ts`.

**Native assertions:** `packages/ui/tests/browser/batch13-control-button.spec.ts`, `packages/ui/tests/browser/hardening-control-geometry.spec.ts`.

**Saved evidence:** [control-button.md](../../../developer/parallel-batch-13/control-button.md), [react-aria-button.md](../../../developer/react-aria-button.md), [backlog-execution-2026-10-15.md](../../../developer/backlog-execution-2026-10-15.md), [react-aria-hardening-execution.md](../../../developer/react-aria-hardening-execution.md).

**Successor:** none within this component row. Broader current-head production/browser/device/AT obligations remain independently open.

### A-M-02 — complete

Original: Reconcile AppInlineProgress final acceptance: Progress/status semantics, reduced motion, tokenized label/layout. Link its `F-C02`, `T-C02` and `V-C02` evidence and any unresolved defects.

Finite rounding/clamping yields 0–100 and nonfinite→0; visible percentage agrees with the named public Progress. Bar width is native numeric/CSS input.

Owned percentage typography/gap/width tokens are covered by unit tests and native computed-style assertions. Determinate progress is animation-free for both reduced-motion preferences; no unsupported indeterminate variant is implied.

**F/T/V links:** F-C02 / T-C02 retain the accepted baseline/regression records and unchanged unit files. V-C02: Saved three-engine control suite includes the five progress/status cases; HB-07 adds eight Chromium light/dark × density × English/Arabic presentation cases at 360px and 150% text. Earlier 320px/200% token/motion proof is retained.

**Concrete source/tests:** `packages/ui/src/components/AppInlineProgress/AppInlineProgress.module.css`, `packages/ui/src/components/AppInlineProgress/AppInlineProgress.tsx`, `packages/ui/src/components/AppInlineProgress/index.ts`.

**Native assertions:** `packages/ui/tests/browser/batch07-progress-status.spec.ts`, `packages/ui/tests/browser/hardening-progress-presentation.spec.ts`.

**Saved evidence:** [progress-status.md](../../../developer/parallel-batch-07/progress-status.md), [react-aria-progress-avatar.md](../../../developer/react-aria-progress-avatar.md), [backlog-execution-2026-10-15.md](../../../developer/backlog-execution-2026-10-15.md), [react-aria-hardening-execution.md](../../../developer/react-aria-hardening-execution.md).

**Successor:** none within this component row. Broader current-head production/browser/device/AT obligations remain independently open.

### A-M-03 — partial

Original: Reconcile AppOperationSteps final acceptance: State announcements, completed/error/active visuals, hide single-step numbering. Link its `F-C03`, `T-C03` and `V-C03` evidence and any unresolved defects.

All pending/in_progress/completed/error states have explicit accessible status text; decorative icons and owned tone aliases distinguish states. Active Progress respects reduced motion. Ordered list has no numeric markers or single-step count.

The implementation deliberately owns no live region. Mounted host Status announces milestones independently of quiet percentage updates; unit/native tests demonstrate region persistence and DOM text changes, not actual speech.

**F/T/V links:** F-C03 / T-C03 retain the accepted baseline/regression records and unchanged unit files. V-C03: Three-engine control/native-state receipts and HB-07 presentation supersede the old missing Firefox/presentation portion. The earlier explicit spoken-announcement hold has no operator receipt in the reviewed evidence.

**Concrete source/tests:** `packages/ui/src/components/AppOperationSteps/AppOperationSteps.module.css`, `packages/ui/src/components/AppOperationSteps/AppOperationSteps.tsx`, `packages/ui/src/components/AppOperationSteps/index.ts`.

**Native assertions:** `packages/ui/tests/browser/batch07-progress-status.spec.ts`, `packages/ui/tests/browser/hardening-progress-presentation.spec.ts`, `packages/ui/tests/browser/batch67-progress-steps-native-state.spec.ts`.

**Saved evidence:** [progress-status.md](../../../developer/parallel-batch-07/progress-status.md), [inventory-acceptance-02-12.md](../../../developer/parallel-batch-29/inventory-acceptance-02-12.md), [react-aria-progress-avatar.md](../../../developer/react-aria-progress-avatar.md), [backlog-execution-2026-10-15.md](../../../developer/backlog-execution-2026-10-15.md), [react-aria-hardening-execution.md](../../../developer/react-aria-hardening-execution.md).

**Unfinished:** The state-announcement clause still lacks a real screen-reader milestone result for the host-owned Status composition.

**W02-01-C03-AT:** Operator receipt naming OS/browser/AT versions, source/fixture hashes and observed pending→active→completed/error→retry speech. Confirm milestone once, quiet percentage ticks and retained keyboard focus. Reuse existing Transitions fixture; do not add an unsolicited component live region. Prerequisite: Human/operator session with actual supported screen reader; DOM assertions cannot substitute.

### A-M-04 — complete

Original: Reconcile AppPageHeader final acceptance: Breadcrumbs, actions, metadata, primary/subpage hierarchy, responsive wrapping. Link its `F-C04`, `T-C04` and `V-C04` evidence and any unresolved defects.

Breadcrumbs render semantic navigation/current page; deep paths collapse into a named keyboard Menu with host routing. Metadata IDs/icons, supplied actions versus menu precedence and disabled commands are covered.

hierarchy defaults to subpage and supports primary via owned surface tokens; headingLevel is independent of visual typography. Wrapping, focus return, translated long names and narrow/enlarged content have accepted native/presentation evidence.

**F/T/V links:** F-C04 / T-C04 retain the accepted baseline/regression records and unchanged unit files. V-C04: Accepted M-04 row plus retained original C/W and focused Firefox proof; full checkpoint covers primary native scopes. HB-08 adds eight cases per engine at 360px/150% text, English/Arabic and both densities; Chromium/Firefox screenshots reviewed.

**Concrete source/tests:** `packages/ui/src/components/AppPageHeader/AppPageHeader.module.css`, `packages/ui/src/components/AppPageHeader/AppPageHeader.tsx`, `packages/ui/src/components/AppPageHeader/index.ts`.

**Native assertions:** `packages/ui/tests/browser/batch10-page-header-reflow.spec.ts`, `packages/ui/tests/browser/hardening-header-tabs-presentation.spec.ts`.

**Saved evidence:** [page-navigation-evidence.md](../../../developer/parallel-batch-60/page-navigation-evidence.md), [react-aria-page-layout.md](../../../developer/react-aria-page-layout.md), [react-aria-migration-inventory-acceptance.md](../../../developer/react-aria-migration-inventory-acceptance.md), [backlog-execution-2026-10-15.md](../../../developer/backlog-execution-2026-10-15.md), [react-aria-hardening-execution.md](../../../developer/react-aria-hardening-execution.md).

**Successor:** none within this component row. Broader current-head production/browser/device/AT obligations remain independently open.

### A-M-05 — complete

Original: Reconcile AppPageTabs final acceptance: Tab/panel wiring, selected/disabled state, density, keyboard/overflow behavior. Link its `F-C05`, `T-C05` and `V-C05` evidence and any unresolved defects.

With onChange, public Tabs owns reciprocal tab/panel IDs, controlled selection, disabled skipping and automatic/manual activation. Without onChange, the wrapper renders native route links/current-page semantics; it does not disguise route navigation as tab panels.

default density inherits the scope; explicit compact/comfortable map locally. Focused route links scroll into view. Retained catalog/overflow tests cover keyboard wrapping, selected visibility, panel linkage and long RTL names.

**F/T/V links:** F-C05 / T-C05 retain the accepted baseline/regression records and unchanged unit files. V-C05: Accepted M-05 row retains C/W and focused Firefox proof. Three-engine overflow checkpoint plus HB-08 supplies native keyboard/disabled/panel/density/long-name geometry; no new orientation prop is inferred for this wrapper.

**Concrete source/tests:** `packages/ui/src/components/AppPageTabs/AppPageTabs.module.css`, `packages/ui/src/components/AppPageTabs/AppPageTabs.tsx`, `packages/ui/src/components/AppPageTabs/index.ts`.

**Native assertions:** `packages/ui/tests/browser/batch07-catalog-tabs.spec.ts`, `packages/ui/tests/browser/batch05-tabs-overflow.spec.ts`, `packages/ui/tests/browser/hardening-header-tabs-presentation.spec.ts`.

**Saved evidence:** [catalog-tabs.md](../../../developer/parallel-batch-07/catalog-tabs.md), [page-navigation-evidence.md](../../../developer/parallel-batch-60/page-navigation-evidence.md), [react-aria-page-layout.md](../../../developer/react-aria-page-layout.md), [backlog-execution-2026-10-15.md](../../../developer/backlog-execution-2026-10-15.md), [react-aria-hardening-execution.md](../../../developer/react-aria-hardening-execution.md).

**Successor:** none within this component row. Broader current-head production/browser/device/AT obligations remain independently open.

### A-M-06 — complete

Original: Reconcile AppShell final acceptance: Landmark/layout semantics, responsive navigation, main-content reflow. Link its `F-C06`, `T-C06` and `V-C06` evidence and any unresolved defects.

Native outer ref/main landmark and host-supplied navigation/content remain. Independent overflow panes and container-query stacking preserve main node/drafts through collapse and resize; AppShellMain reveals focused owned controls without changing focus.

rightNavigation is an optional trailing independently scrolling column; unit tests assert insertion preserves main/left nodes. Hosts provide width/names. This addition is not used to claim an unperformed three-column native matrix.

**F/T/V links:** F-C06 / T-C06 retain the accepted baseline/regression records and unchanged unit files. V-C06: Previously accepted M-06 row plus three-engine responsive shell checkpoint and HB-09: sixteen composed shell/auth cases per engine, desktop 1100px→360px at 150% text, RTL/LTR and independent pane geometry. HB-09 screenshots reviewed in each engine.

**Concrete source/tests:** `packages/ui/src/components/AppShell/AppShell.module.css`, `packages/ui/src/components/AppShell/AppShell.tsx`, `packages/ui/src/components/AppShell/AppShellMain.tsx`, `packages/ui/src/components/AppShell/index.ts`.

**Native assertions:** `packages/ui/tests/browser/inventory-shell-responsive.spec.ts`, `packages/ui/tests/browser/navigation-shell-container-boundary.spec.ts`, `packages/ui/tests/browser/hardening-shell-presentation.spec.ts`.

**Saved evidence:** [shell-responsive-native.md](../../../developer/parallel-batch-35/shell-responsive-native.md), [react-aria-modal-shells.md](../../../developer/react-aria-modal-shells.md), [react-aria-migration-inventory-acceptance.md](../../../developer/react-aria-migration-inventory-acceptance.md), [backlog-execution-2026-10-15.md](../../../developer/backlog-execution-2026-10-15.md), [react-aria-hardening-execution.md](../../../developer/react-aria-hardening-execution.md).

**Successor:** none within this component row. Broader current-head production/browser/device/AT obligations remain independently open.

### A-M-07 — complete

Original: Reconcile AuthShell final acceptance: Presentation-only shell, no login flow/session behavior, resilient content sizing. Link its `F-C07`, `T-C07` and `V-C07` evidence and any unresolved defects.

Presentation-only title/subtitle/content/footer and native ref/styles; no account/session or login implementation. Host owns forms, validation, submission and links.

Owned panel/gutter/content overflow and focus-reveal helper preserve entered fields as optional sections change. Unit tests include constrained/embedded host replacement; accepted native reflow covers narrow/enlarged content, footer access, submit once and stable focus.

**F/T/V links:** F-C07 / T-C07 retain the accepted baseline/regression records and unchanged unit files. V-C07: Three-engine primary checkpoint resolves earlier Firefox hold; HB-09 adds translated desktop/narrow forms and reviewed screenshots across all engines. Source-only absence of session code is distinguished from actual native layout assertions.

**Concrete source/tests:** `packages/ui/src/components/AuthShell/AuthShell.module.css`, `packages/ui/src/components/AuthShell/AuthShell.tsx`, `packages/ui/src/components/AuthShell/index.ts`, `packages/ui/src/components/AuthShell/revealFocusedControl.ts`.

**Native assertions:** `packages/ui/tests/browser/batch10-auth-shell-reflow.spec.ts`, `packages/ui/tests/browser/hardening-shell-presentation.spec.ts`.

**Saved evidence:** [auth-shell-reflow.md](../../../developer/parallel-batch-10/auth-shell-reflow.md), [react-aria-modal-shells.md](../../../developer/react-aria-modal-shells.md), [backlog-execution-2026-10-15.md](../../../developer/backlog-execution-2026-10-15.md), [react-aria-hardening-execution.md](../../../developer/react-aria-hardening-execution.md).

**Successor:** none within this component row. Broader current-head production/browser/device/AT obligations remain independently open.

### A-M-08 — partial

Original: Reconcile AppModal final acceptance: Owned close reasons/size/parts, focus, sticky tabs, scroll, actions and steps. Link its `F-C08`, `T-C08` and `V-C08` evidence and any unresolved defects.

Owned onClose(reason), native style/parts, controlled open, independent dismissal locks, form-safe pending actions and >=2-step labels are explicit. Dialog owns trap/return focus and nested overlay dismissal.

Retained removed-opener repair and later unit tests cover parent destination recovery without stealing accepted host focus. Sticky tabs/whole-dialog fallback and narrow local surface tests exist. HB-10 adds translated initial focus, bounded chrome/footer, Escape and return-focus checks.

**F/T/V links:** F-C08 / T-C08 retain the accepted baseline/regression records and unchanged unit files. V-C08: HB-10 preserves each original English pass plus seven corrected Arabic/unrun cases per engine against the same host. Removed-opener report has nine Chromium cases on candidate 4987a1fe046c37f2e612d6de159aa09e1e840043; later full-checkpoint summaries are retained only for their enumerated scopes, not upgraded to an unlisted all-size/modal AT result.

**Concrete source/tests:** `packages/ui/src/components/AppModal/AppModal.module.css`, `packages/ui/src/components/AppModal/AppModal.tsx`, `packages/ui/src/components/AppModal/index.ts`.

**Native assertions:** `packages/ui/tests/browser/batch01-dialogs.spec.ts`, `packages/ui/tests/browser/batch52-dialog-removed-opener.spec.ts`, `packages/ui/tests/browser/modal-container-boundary.spec.ts`, `packages/ui/tests/browser/hardening-modal-presentation.spec.ts`, `packages/ui/tests/browser/display-preferences.spec.ts`.

**Saved evidence:** [dialogs.md](../../../developer/parallel-batch-01/dialogs.md), [dialog-removed-opener.md](../../../developer/parallel-batch-52/dialog-removed-opener.md), [react-aria-modal-shells.md](../../../developer/react-aria-modal-shells.md), [backlog-execution-2026-10-15.md](../../../developer/backlog-execution-2026-10-15.md), [react-aria-hardening-execution.md](../../../developer/react-aria-hardening-execution.md).

**Unfinished:** Earlier explicit native size/height/custom-chrome scrolling matrix and spoken nested-dialog acceptance are not fully discharged by the reviewed receipts.

**W02-01-C08-sizes:** Clause matrix for xs/sm/md/lg/xl/full, heightMode and native overrides/custom chrome, linking retained tests first. Recover durable immutable-host receipts for already-passing cases; execute only missing focus/viewport/sticky-tab/whole-dialog combinations under coordinator browser admission. Prerequisite: Coordinator-approved immutable native host and missing-case execution, or recovery of exact existing reports.

**W02-01-C08-AT:** Operator result for nested modal/menu/popover announcements, top dismissal and return focus including removed opener; record platform/AT and fixture hashes. Prerequisite: Real AT operator; unit/native focus checks do not establish speech.

### A-M-09 — complete

Original: Reconcile SideNavigation final acceptance: Selection/expansion, router/account adapters, organization menu, keyboard and collapse. Link its `F-C09`, `T-C09` and `V-C09` evidence and any unresolved defects.

Host model, route/current-page selection, explicit ancestor collapse, expand/drilldown/Back focus and separate selection/action semantics remain owned. Collapsed state is local; ref/label/styles are native.

Organization/account operations use host adapters, qualified choices, pending suppression and retryable errors. Tests cover stale completion/provider replacement/unmount; navigation never owns login/session services. Retained native flow and shell geometry cover real keyboard and responsive collapse.

**F/T/V links:** F-C09 / T-C09 retain the accepted baseline/regression records and unchanged unit files. V-C09: Three-engine full checkpoint explicitly maps C09 hierarchy/route/action/collapse suites; HB-09 actual SideNavigation composed long localized rows supports C09-04/05 under HB-10 reconciliation. Operation-specific retained reports supply four corrected Chromium logout cases and six Chromium organization-switch lifetime cases at candidate 1976be5e3776fe5e44065b02f359a17751ef7284; they are not independently relabeled Firefox/WebKit operation runs. This advances older active-owner/native holds using later accepted receipts.

**Concrete source/tests:** `packages/ui/src/components/SideNavigation/SideNavigation.module.css`, `packages/ui/src/components/SideNavigation/SideNavigation.tsx`, `packages/ui/src/components/SideNavigation/index.ts`.

**Native assertions:** `packages/ui/tests/browser/batch65-side-navigation-native-flow.spec.ts`, `packages/ui/tests/browser/navigation-shell-container-boundary.spec.ts`, `packages/ui/tests/browser/hardening-shell-presentation.spec.ts`, `packages/ui/tests/browser/batch13-logout-lifetime.spec.ts`, `packages/ui/tests/browser/batch70-organization-switch-lifetime.spec.ts`.

**Saved evidence:** [side-navigation-native-flow.md](../../../developer/parallel-batch-65/side-navigation-native-flow.md), [logout-lifetime.md](../../../developer/parallel-batch-13/logout-lifetime.md), [organization-switch-lifetime.md](../../../developer/parallel-batch-70/organization-switch-lifetime.md), [react-aria-modal-shells.md](../../../developer/react-aria-modal-shells.md), [backlog-execution-2026-10-15.md](../../../developer/backlog-execution-2026-10-15.md), [react-aria-hardening-execution.md](../../../developer/react-aria-hardening-execution.md).

**Successor:** none within this component row. Broader current-head production/browser/device/AT obligations remain independently open.

### A-M-10 — partial

Original: Reconcile ExperiencePageNavigator final acceptance: Previous/next boundaries, labels, disabled states, link/action semantics. Link its `F-C10`, `T-C10` and `V-C10` evidence and any unresolved defects.

Actual API is an authoring-page list with selected page, add/rename/remove/reorder callbacks; readOnly blocks mutation while selection stays available. Rename trims, rejects blank/stale host rows, and removal focuses adjacent surviving selection.

Move up/down boundary guards and keyboard menus are native-tested, including accepted/rejected host changes. They are reorder actions, not previous/next navigation. There are no route/href/previous/next props.

**F/T/V links:** F-C10 / T-C10 retain the accepted baseline/regression records and unchanged unit files. V-C10: Three-engine checkpoint plus HB-14 resolves historical authoring-list native/presentation gaps: sixteen cases per engine, long localized page names, rename/focus and menu/action scenes. None supplies absent previous/next route semantics.

**Concrete source/tests:** `packages/ui/src/components/ExperiencePageNavigator/ExperiencePageNavigator.module.css`, `packages/ui/src/components/ExperiencePageNavigator/ExperiencePageNavigator.tsx`, `packages/ui/src/components/ExperiencePageNavigator/index.ts`.

**Native assertions:** `packages/ui/tests/browser/page-navigator-native-transactions.spec.ts`, `packages/ui/tests/browser/hardening-actions-presentation.spec.ts`.

**Saved evidence:** [react-aria-inventory-contract-reconciliation.md](../../../developer/react-aria-inventory-contract-reconciliation.md), [page-navigator.md](../../../developer/parallel-batch-13/page-navigator.md), [react-aria-page-navigation.md](../../../developer/react-aria-page-navigation.md), [backlog-execution-2026-10-15.md](../../../developer/backlog-execution-2026-10-15.md), [react-aria-hardening-execution.md](../../../developer/react-aria-hardening-execution.md).

**Unfinished:** Original previous/next boundaries and link semantics still differ from the shipped and extracted contract; no recorded owner disposition found in reviewed evidence.

**W02-01-C10-intent:** Product/API owner must record either authoring-list scope with explicit disposition of previous/next and link clauses, or a separate host-controlled adjacent/route navigation contract. Then reconcile that approved criterion; if behavior is added, provide corresponding API/example/native boundary evidence. Prerequisite: Specific owner requirement decision, not permission to perform read-only acceptance.

### A-M-11 — complete

Original: Reconcile CardCollectionWithFooter final acceptance: Responsive/container layout, keys, empty/loading states, pagination integration. Link its `F-C11`, `T-C11` and `V-C11` evidence and any unresolved defects.

One normalized page slices the complete host dataset and drives AppPaginationFooter. Stable row keys retain card state; loading/empty Status content and disabled footer are explicit. Host owns rows/rendering/persistence.

Native collection tests cover responsive/container thresholds, keyed draft/focus preservation, constrained scroll/footer, loading/empty replacement, controlled rejection/acceptance and page-zero-before-size. Existing corrected flow is retained instead of repeated.

**F/T/V links:** F-C11 / T-C11 retain the accepted baseline/regression records and unchanged unit files. V-C11: Original bounded Chromium proof subsequently gains all-engine primary checkpoint. HB-12 gives sixteen cases per engine for real instructor/learner collections, footer/reset/counts, narrow long text and reviewed screenshots; no independent server data-fetching behavior is inferred.

**Concrete source/tests:** `packages/ui/src/components/CardCollectionWithFooter/CardCollectionWithFooter.module.css`, `packages/ui/src/components/CardCollectionWithFooter/CardCollectionWithFooter.tsx`, `packages/ui/src/components/CardCollectionWithFooter/index.ts`.

**Native assertions:** `packages/ui/tests/browser/inventory-card-collection.spec.ts`, `packages/ui/tests/browser/hardening-card-presentation.spec.ts`.

**Saved evidence:** [card-collection-native.md](../../../developer/parallel-batch-36/card-collection-native.md), [react-aria-card-pagination.md](../../../developer/react-aria-card-pagination.md), [backlog-execution-2026-10-15.md](../../../developer/backlog-execution-2026-10-15.md), [react-aria-hardening-execution.md](../../../developer/react-aria-hardening-execution.md).

**Successor:** none within this component row. Broader current-head production/browser/device/AT obligations remain independently open.

### A-M-12 — complete

Original: Reconcile CardPaginationFooter final acceptance: Owned pagination, labels/counts, disabled boundaries, unknown totals. Link its `F-C12`, `T-C12` and `V-C12` evidence and any unresolved defects.

Public name is AppPaginationFooter from the preserved CardPaginationFooter directory. Zero-based page/size, count normalization, known/unknown/zero totals, translated ranges and disabled boundaries use owned Pagination.

Separate size callback requests page zero before size; optional atomic onPaginationModelChange supersedes both callbacks. Unknown count uses host hasNextPage and omits Last. No normalization callback fires during render; nested form actions remain safe.

**F/T/V links:** F-C12 / T-C12 retain the accepted baseline/regression records and unchanged unit files. V-C12: Preserved accepted M-12 row, FA-04 unit baseline, three-engine primary checkpoint, HB-12 actual footer/Pagination controls and viewport/translation screenshots. Do not import unrelated physical-device/AT gates into this already-evidenced row.

**Concrete source/tests:** `packages/ui/src/components/CardPaginationFooter/CardPaginationFooter.module.css`, `packages/ui/src/components/CardPaginationFooter/CardPaginationFooter.tsx`, `packages/ui/src/components/CardPaginationFooter/index.ts`, `packages/ui/src/components/CardPaginationFooter/pagination.ts`.

**Native assertions:** `packages/ui/tests/browser/inventory-grid-shell-responsive.spec.ts`, `packages/ui/tests/browser/inventory-card-collection.spec.ts`, `packages/ui/tests/browser/hardening-card-presentation.spec.ts`.

**Saved evidence:** [react-aria-card-pagination.md](../../../developer/react-aria-card-pagination.md), [react-aria-migration-inventory-acceptance.md](../../../developer/react-aria-migration-inventory-acceptance.md), [backlog-execution-2026-10-15.md](../../../developer/backlog-execution-2026-10-15.md), [react-aria-hardening-execution.md](../../../developer/react-aria-hardening-execution.md).

**Successor:** none within this component row. Broader current-head production/browser/device/AT obligations remain independently open.

### A-M-13 — complete

Original: Reconcile ClassCardFrame final acceptance: Owned surface/spacing, image/content slots, responsive width and constants. Link its `F-C13`, `T-C13` and `V-C13` evidence and any unresolved defects.

Owned Card surface with header/body/optional footer slots, native root/slot styles and part hooks. Constants remain width=420 and min=360; 360 is exported host guidance, not an imposed minimum on narrow containers.

Default maximum width shrinks with its parent; native style can override width. Existing tests retain arbitrary image/content attributes and falsy-footer behavior. Accepted frame width/parent/slot proof covers image ratio, resizing and surviving action focus.

**F/T/V links:** F-C13 / T-C13 retain the accepted baseline/regression records and unchanged unit files. V-C13: Preserved accepted M-13 row with original/focused Firefox and full-engine parent/slot native attribution; HB-12 supplies real card composition and all-engine screenshots. Generic slot support does not imply an image-fetching API.

**Concrete source/tests:** `packages/ui/src/components/ClassCardFrame/ClassCardFrame.module.css`, `packages/ui/src/components/ClassCardFrame/ClassCardFrame.tsx`, `packages/ui/src/components/ClassCardFrame/index.ts`.

**Native assertions:** `packages/ui/tests/browser/batch10-card-frame-reflow.spec.ts`, `packages/ui/tests/browser/inventory-card-frame-resize.spec.ts`, `packages/ui/tests/browser/hardening-card-presentation.spec.ts`.

**Saved evidence:** [frame-resize-native.md](../../../developer/parallel-batch-39/frame-resize-native.md), [react-aria-card-frames.md](../../../developer/react-aria-card-frames.md), [react-aria-migration-inventory-acceptance.md](../../../developer/react-aria-migration-inventory-acceptance.md), [backlog-execution-2026-10-15.md](../../../developer/backlog-execution-2026-10-15.md), [react-aria-hardening-execution.md](../../../developer/react-aria-hardening-execution.md).

**Successor:** none within this component row. Broader current-head production/browser/device/AT obligations remain independently open.

### A-M-14 — partial

Original: Reconcile InstructorClassCard final acceptance: Status/menu/actions, callbacks, long text, date and icon fallbacks. Link its `F-C14`, `T-C14` and `V-C14` evidence and any unresolved defects.

Four statuses, archived metadata omission, translated known/custom labels and one host-routed action Link are preserved. Fixed decorative icons and HE avatar are presentation; className is course text, not styling.

Batch66 and all-engine checkpoint add actual native focus, one route per Enter, stable link under status/model changes, long text, native host-formatted de-DE dates and host missing/invalid labels. HB-12 supplies later all-engine localized geometry/screenshots.

**F/T/V links:** F-C14 / T-C14 retain the accepted baseline/regression records and unchanged unit files. V-C14: Later native tests resolve the old unexecuted presentation/fallback-host evidence. They deliberately expose no library menu, persistence callback, date parser or configurable icon/image API and cannot resolve the original feature-attribution dispute.

**Concrete source/tests:** `packages/ui/src/components/InstructorClassCard/InstructorClassCard.module.css`, `packages/ui/src/components/InstructorClassCard/InstructorClassCard.tsx`, `packages/ui/src/components/InstructorClassCard/index.ts`.

**Native assertions:** `packages/ui/tests/browser/batch66-instructor-card-native-presentation.spec.ts`, `packages/ui/tests/browser/hardening-card-presentation.spec.ts`.

**Saved evidence:** [instructor-card-native-presentation.md](../../../developer/parallel-batch-66/instructor-card-native-presentation.md), [react-aria-inventory-contract-reconciliation.md](../../../developer/react-aria-inventory-contract-reconciliation.md), [react-aria-card-frames.md](../../../developer/react-aria-card-frames.md), [backlog-execution-2026-10-15.md](../../../developer/backlog-execution-2026-10-15.md), [react-aria-hardening-execution.md](../../../developer/react-aria-hardening-execution.md).

**Unfinished:** The menu/callback/date/icon clauses require explicit owner attribution or approved additional behavior. Fixed decorative assets and literal required strings are not substitutes for undeclared APIs.

**W02-01-C14-intent:** Owner disposition table for menu, callbacks, date fallback and icon fallback: identify the existing actionHref/router and host-formatted/fallback text/fixed assets, or specify a separately approved extension. Link later batch66/HB-12 results to supported presentation clauses; implement/test only approved additions. Prerequisite: Specific product/API scope decision. No source change authorized by a checklist wording mismatch alone.

### A-M-15 — partial

Original: Reconcile LearnerClassCard final acceptance: Progress/due labels/status/actions, translation, accessible interactive regions. Link its `F-C15`, `T-C15` and `V-C15` evidence and any unresolved defects.

Named clamped progress and due formatter, host locale/clock, translated metadata and isolated Details/Continue regions are preserved. Destinations retain native links/new-tab rel; no destination uses Button/onPress. Details falls back to continueHref.

Unit due composition covers live locale/translator and invalid fallback with coordinated SSR clock/timezone. Later all-engine checkpoint and the corrected 12-case parity shard resolve German browser ICU and native destination/activation mismatches; HB-12 adds localized narrow geometry/screenshots.

**F/T/V links:** F-C15 / T-C15 retain the accepted baseline/regression records and unchanged unit files. V-C15: Wave28 shard on candidate 24f9b4a has four corrected titles × three engines, 12 passed without retries; it does not relabel earlier red or unselected cases. Later checkpoint maps full inventory-learner-card primary engines. No separate status prop exists.

**Concrete source/tests:** `packages/ui/src/components/LearnerClassCard/LearnerClassCard.module.css`, `packages/ui/src/components/LearnerClassCard/LearnerClassCard.tsx`, `packages/ui/src/components/LearnerClassCard/formatDueDateLabel.ts`, `packages/ui/src/components/LearnerClassCard/index.ts`.

**Native assertions:** `packages/ui/tests/browser/inventory-learner-card.spec.ts`, `packages/ui/tests/browser/hardening-card-presentation.spec.ts`.

**Saved evidence:** [learner-card-native.md](../../../developer/parallel-batch-41/learner-card-native.md), [learner-card-engine-parity.md](../../../developer/parallel-batch-54/learner-card-engine-parity.md), [inventory-acceptance-13-24.md](../../../developer/parallel-batch-30/inventory-acceptance-13-24.md), [react-aria-card-frames.md](../../../developer/react-aria-card-frames.md), [backlog-execution-2026-10-15.md](../../../developer/backlog-execution-2026-10-15.md), [react-aria-hardening-execution.md](../../../developer/react-aria-hardening-execution.md).

**Unfinished:** The historical explicit status-clause attribution is still awaiting coordinator/owner disposition; progress/due text cannot silently be declared a separate lifecycle status feature.

**W02-01-C15-status:** Record whether status means the existing progress/due presentation, with exact semantic/due/action test references, or an additional lifecycle status contract. If the latter, specify host-owned status API and acceptance criteria before implementation; retain the completed native ICU/destination proof. Prerequisite: Coordinator/product scope attribution, not another unit/browser rerun of already-passing native flows.

### A-B-07 — partial

Original: Reconcile original `B-07`: Capture representative screenshots and browser interactions for light/dark UI, compact/comfortable controls, editors, navigation, modals, and grids. Historical status: open.

Dated accepted HB receipts explicitly describe captured/reviewed controls, progress, page navigation, shells, modals and course cards across light/dark and both densities. Editor/grid interaction checkpoint records actual desktop engine execution, not speech.

The 28 enumerated historical local artifact roots are checked for availability in evidence.json; missing roots cannot supply directly reviewable screenshots or exact host manifests in this checkout.

The available editor-focus/results.json records four Chromium cases, 0 unexpected/skipped/flaky, starting 2026-10-16T15:13:18.515Z; exact command/stats/hash are retained in evidence.json. There are zero local PNGs in the three checked editor capture roots. This result does not reconstruct the missing representative controls/navigation/modal/grid screenshot set or establish source-host identity.

**Saved evidence:** [backlog-execution-2026-10-15.md](../../../developer/backlog-execution-2026-10-15.md), [docs-fixture-migration.md](../../../developer/docs-fixture-migration.md), [fa04-retained-docs-build.txt](../../../developer/final-acceptance/fa04-retained-docs-build.txt), `packages/ui/artifacts/editor-focus/results.json`.

**Unfinished:** Recover durable representative screenshot + interaction receipts for each required family with explicit theme, density, viewport, source/spec/host hash and engine. Existing narrative acceptance remains dated evidence, not current-head rendered review.

**W02-01-B07-captures:** Recover already-created HB/checkpoint screenshot/results/manifest files from their recorded artifact locations into a durable reviewed evidence bundle. Index controls, editors, navigation, modals and grids by theme/density/viewport/engine and exact source/host hashes. Retain corrected red/pass lineage. If artifacts are irrecoverable, coordinator authorizes only missing representative captures on an immutable host; do not rerun passed whole suites. Prerequisite: Access to original artifacts or coordinator native-capture admission. Source inspection and a docs build cannot create screenshots.

## Checks actually performed

Ran `python3 docs/developer/final-acceptance/wave-02-01/reconcile.py` from the repository root. It reuses saved import edges, verifies exact relevant inputs/targeted existing outputs, indexes unit/native case lines and fixture paths, checks historical artifact availability and hashes available editor PNGs. Generated only this owned directory. No unit/native/browser/consumer suite, dependency install, source/output rebuild, server change, staging/commit/push or release action.

The two absent-API disputes and learner status attribution need explicit scope decisions. The announcement/modal speech requirements need a real AT operator. Missing screenshot manifests need artifact recovery or coordinator native admission. Those prerequisites are recorded precisely; none is reported as a new implementation defect or silently waived. Twenty editor V leaves remain open and unaffected. Shared checklist/count reconciliation belongs to the coordinator.
