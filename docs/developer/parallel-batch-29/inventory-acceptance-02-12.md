# M-02–M-12 whole-inventory acceptance reconciliation

Evidence-only review, 2026-10-07. Exact reviewed source baseline:
`3e910311acee5b5c83184eeb191441acb793147a` (resolved `codex/dev` at the requested
`3e91031`; no literal `codex/dev3e91031` ref exists). Created/attached managed
worktree `/Users/thomashall/.codex/worktrees/batch29-inventory-02-12/sg-ui`,
verified its clean exact HEAD before writing, branch `codex/batch29-inventory-02-12`.
Exclusive write: this report. Source, guides, master, inventory record, ledger,
other reports and durable state remain read-only.

**Recommendation: retain M-12 ACCEPT; HOLD M-02–M-11. No newly accepted row.**
The six existing accepted rows (M-01/M-12/M-24/M-31/M-35/M-36) remain accepted;
no concrete regression was identified that warrants downgrading one. This review
only evaluates M-02–M-12. It neither re-audits the other five accepted rows nor
changes the coordinator's 67/326 (20.6%), required 67/320 (20.9%), or 31-held-row
record. These are documented acceptance counts, not engineering-hours estimates.

## Decision and provenance

Use the exact [master inventory criteria](../react-aria-master-task-list.md),
[original row audit](../react-aria-migration-inventory-acceptance.md),
[execution record](../react-aria-progress.md), [integration ledger](../parallel-migration-batches.md)
and [validation policy](../react-aria-development-validation.md).
Implementation migration, review acceptance of a bounded patch, or queued native
work does not prove whole-row acceptance. Broad U/X/R/Z and manual/device/AT
requirements are not silently attached to already-accepted M-12, nor silently
removed from rows whose own evidence explicitly leaves native/announcement gaps.

All eleven named component indexes, [public component barrel](../../../src/components/index.ts),
[root barrel](../../../src/index.ts) and [package subpaths](../../../package.json)
are present. M-12's public name is AppPaginationFooter in CardPaginationFooter.
These are source/API observations, not a new emitted-package or consumer run.

Later focused evidence is materially stronger than the original audit:

| Evidence | Exact native/tested head and recorded outcome | Integrated identity / limit |
| --- | --- | --- |
| [Progress/status](../parallel-batch-07/progress-status.md), [spec](../../../tests/browser/batch07-progress-status.spec.ts) | `27c68b2d335743057c0e33741e3941828a8eb0d2`: 7 affected unit cases; 10 Chromium/WebKit native cases | Final report `25eec14f882ce907d72ac50924c64bbf69fb4719` reviewed/integrated; direct two component directories/spec unchanged at this baseline. Firefox/spoken AT unverified. |
| [Catalog tabs](../parallel-batch-07/catalog-tabs.md), [spec](../../../tests/browser/batch07-catalog-tabs.spec.ts) | `13f3c5536ad2b0673839a617c6fafd16911fa0a3`: 80 Chromium/WebKit cases including experimental prerequisite; 32 catalog cases per engine | Final `00bb2adf057046dc44d5b89973caafb81ae71a68` reviewed/integrated; direct component/spec unchanged. Firefox/manual zoom/AT missing. |
| [Header reflow](../parallel-batch-10/page-header-reflow.md), [spec](../../../tests/browser/batch10-page-header-reflow.spec.ts) | `f1ec49bbd9934d1ab975adf876ca12d9898c6aa2`: 24 Chromium/WebKit cases; runtime story build at `a6e704f434e152a2e7a0cab2b0938ad37f943986` unchanged by subsequent spec-only patch | Final `4e065ce19d7873db263b28f3a2bcf26448856ad2` reviewed/integrated; direct component/spec unchanged. Firefox/manual limits retained. |
| [AuthShell reflow](../parallel-batch-10/auth-shell-reflow.md), [spec](../../../tests/browser/batch10-auth-shell-reflow.spec.ts) | `be1b0b583f4377a6aaf3478b3573009cc2fec176`: 6 unit cases and 10 Chromium/WebKit native cases after real gutter/focus corrections | Final `2b53424a32502669aec0052b54f9a947ba2c1210` reviewed/integrated; direct component/spec unchanged. Firefox and broader constrained-host sizing missing. |

Direct-path equality was checked with `git diff --name-only <tested-head> HEAD --
<component-directories> <spec>`. Shared dependencies have later changes: equality
does not relabel historical passes as fresh integrated-head evidence. Source/test
inspection and these existing reports, not chat totals, support the decisions below.

## Per-row criteria, evidence and remaining dependency

Source and tests below are inspected at the exact baseline; recorded execution
belongs to the report heads above or the historical execution record.

| Row / every master criterion | Reviewable shipped evidence | Whole-row decision / concrete unmet criterion and owner |
| --- | --- | --- |
| **M-02 AppInlineProgress** — progress/status semantics; reduced motion; tokenized label/layout | [Source](../../../src/components/AppInlineProgress/AppInlineProgress.tsx), [tests](../../../src/components/AppInlineProgress/AppInlineProgress.test.tsx), [contract](../react-aria-progress-avatar.md). Finite clamp/round/0 fallback, translated name and percentage; native 0/25/100/0, both motion preferences, animation-free determinate subtree, production body2/gap/track/width tokens, relative width, light/dark narrow/200% text in progress/status report. | **HOLD.** The original missing native slice is now supplied in C/W; required Firefox reduced-motion/computed layout behavior has no recorded result. Ready existing-spec checkpoint, coordinator browser owner; actual zoom/display/AT remain separately recorded manual limits. No invented indeterminate API or repeat C/W-only audit. |
| **M-03 AppOperationSteps** — state announcements; completed/error/active visuals; hide single-step numbering | [Source](../../../src/components/AppOperationSteps/AppOperationSteps.tsx), [tests](../../../src/components/AppOperationSteps/AppOperationSteps.test.tsx), same progress contract/report. Additive error is shipped and documented; pending/active/completed/error/retry keyed transitions, action/muted/danger icons/tokens, active motion, single/empty/SSR and no Step 1 of 1. Mounted host-owned Status updates milestones; steps remain quiet. | **HOLD.** DOM/live-region changes do not prove the master state-announcement criterion's spoken outcome. AT owner must record milestone behavior for the mounted host Status composition; Firefox state/motion run also missing. Do not add an unsolicited component live region or reopen the completed error implementation. |
| **M-04 AppPageHeader** — breadcrumbs; actions; metadata; primary/subpage hierarchy; responsive wrapping | [Source](../../../src/components/AppPageHeader/AppPageHeader.tsx), [tests](../../../src/components/AppPageHeader/AppPageHeader.test.tsx), [page contract](../react-aria-page-layout.md). Collapsed host-route path, disabled commands, supplied-action precedence, headings/ref/metadata; header reflow report measures both hierarchy surfaces, text contrast, long text, 1280/320/640px, 200% text, themes and action/menu focus. | **HOLD.** Native responsive wrapping/action-focus matrix still lacks Firefox execution. Existing focused spec is ready; no new runtime fix established. Browser chrome zoom/manual display remain separate unresolved evidence, not a new header feature. |
| **M-05 AppPageTabs** — tab/panel wiring; selected/disabled state; density; keyboard/overflow | [Source](../../../src/components/AppPageTabs/AppPageTabs.tsx), [tests](../../../src/components/AppPageTabs/AppPageTabs.test.tsx), page contract and catalog report. Reciprocal/unique IDs, host-withheld/manual requests, duplicate-key independent instances, route links distinct from tabs; native activation/disabled skip/Home/End/Space/Enter/reverse wrap, panel Tab access, explicit/inherited densities, en/ar overflow/focus geometry and themes/text scaling. | **HOLD.** The matrix is C/W only: Firefox keyboard/overflow/density evidence remains missing; manual browser zoom and AT tab/panel behavior are explicitly unverified. Reuse existing spec; do not invent vertical orientation. |
| **M-06 AppShell** — landmark/layout semantics; responsive navigation; main-content reflow | [Source/CSS](../../../src/components/AppShell/AppShell.tsx), [tests](../../../src/components/AppShell/AppShell.test.tsx), [shell contract](../react-aria-modal-shells.md). Native main/ref/label, host navigation, <=40rem stack/45dvh cap, collapse retaining content; original execution record measures 260px/desktop independent nav/main scrolling and collapse focus. | **HOLD.** No focused supported-engine matrix proves breakpoint transition, enlarged-text/short-host main reflow and independent scroll/focus continuity. Historical representative measurements are insufficient. Bounded native fixture/spec is ready; shell owns layout, SideNavigation owns navigation actions. Keep logout source out of the new scope. |
| **M-07 AuthShell** — presentation only; no login/session behavior; resilient content sizing | [Source](../../../src/components/AuthShell/AuthShell.tsx), [tests](../../../src/components/AuthShell/AuthShell.test.tsx), shell contract and AuthShell report. Host forms/routes remain independent, fields/ref/heading persist; token-capped gutters and deferred clipped-control reveal; 320x640/768x480, normal/200% text/spacing, themes, complete input/footer focus, submit-once, wide-body scroll. | **HOLD.** Firefox sizing/focus behavior remains unexecuted. Report separately reserves short embedded scrolling-host sizing/focus; helper ancestor-clipping branches have unit evidence, not complete native host evidence. Browser owner runs existing Firefox spec; bounded host fixture can cover this remaining sizing dependency. Actual zoom/device/AT limits stay explicit. |
| **M-08 AppModal** — owned close reasons/size/parts; focus; sticky tabs; scroll; actions/steps | [Source](../../../src/components/AppModal/AppModal.tsx), [tests](../../../src/components/AppModal/AppModal.test.tsx), shell contract; [nested dialog report](../parallel-batch-01/dialogs.md)/[spec](../../../tests/browser/batch01-dialogs.spec.ts) and display-preferences suite. Reasons/locks/ref/custom sections/form-safe actions/pending/single-step and full size unit evidence; nested surviving-trigger return, top dismissal and twenty fields/footer stops, short enlarged-text sticky/whole-dialog scroll in C/W. | **HOLD.** Removed-trigger recovery, complete native size/height/custom-chrome scroll combinations and Firefox nested/focus matrix remain unproven; nested spoken AT is explicitly missing. Removed-trigger/size fixture is ready in AppModal/Dialog scope. Explicit portal direction was separately fixed by batch05; do not repeat that completed fix or treat locale-only batch01 proof as the fix. |
| **M-09 SideNavigation** — selection/expansion; router/account adapters; organization menu; keyboard/collapse | [Source](../../../src/components/SideNavigation/SideNavigation.tsx), [tests](../../../src/components/SideNavigation/SideNavigation.test.tsx), shell contract. Current links, explicit ancestor collapse, drilldown/back focus; qualified organizations, retry/concurrency tests; [adapter report](../parallel-batch-01/adapters.md), [account lifetime report](../parallel-batch-11/account-action-lifetime.md) distinguish adapter promise pass-through from shell post-await ownership. | **HOLD.** Full native navigation expansion/collapse/organization matrix and shell completion lifetime not accepted. **Existing logout-lifetime worker owns the entire SideNavigation directory**; late success/rejection/provider replacement/unmount work is active, not ready for a duplicate chat. Wait for its reviewed integration and native results before assigning residual navigation evidence. |
| **M-10 ExperiencePageNavigator** — previous/next boundaries; labels; disabled states; link/action semantics | [Source](../../../src/components/ExperiencePageNavigator/ExperiencePageNavigator.tsx), [tests](../../../src/components/ExperiencePageNavigator/ExperiencePageNavigator.test.tsx), [navigation contract](../react-aria-page-navigation.md), [intent reconciliation](../react-aria-inventory-contract-reconciliation.md), [already-reviewed navigator report](../parallel-batch-13/page-navigator.md). Actual API is controlled authoring selection/add/rename/remove/reorder, read-only/last-page/Move guards, translated labels and separated buttons. Nine DOM cases plus SSR; representative historical rename/reorder/removal focus. | **HOLD — owner decision required.** Adjacent route navigation/href semantics are absent; Move up/down cannot count as previous/next navigation. Coordinator/product/API owner must dispose of every disputed clause using existing batch09 alternatives. Then confirm evidence scope, including native drag/focus and live labels/overlapping instances. Do not commission another wording/source audit or fabricate new navigation APIs. |
| **M-11 CardCollectionWithFooter** — responsive/container layout; keys; empty/loading; pagination integration | [Source](../../../src/components/CardCollectionWithFooter/CardCollectionWithFooter.tsx), [tests](../../../src/components/CardCollectionWithFooter/CardCollectionWithFooter.test.tsx), [card contract](../react-aria-card-pagination.md), [reviewed collection report](../parallel-batch-13/card-collection.md), [independent review](../parallel-batch-14/review-evidence.md). Complete client rows, normalized shared slice/footer, stable keys, translated/custom status, busy/disabled loading and nested action/form safety; historical one-column/grid scroll. Footer rejection tests are underlying evidence, not collection-level acceptance. | **HOLD.** Full container-column/footer reflow and focus/scroll matrix is missing. Ready bounded collection fixture/spec for constrained height and widths around its 22.5rem card minimum, themes/text/density; host reject-then-accept pagination can be covered in that composition. No demonstrated collection runtime defect. Active grid client-page-shrink owns a different model/shell: neither duplicate it nor count it as collection proof. |
| **M-12 CardPaginationFooter / AppPaginationFooter** — owned pagination; labels/counts; disabled boundaries; unknown totals | [Source](../../../src/components/CardPaginationFooter/CardPaginationFooter.tsx), [tests](../../../src/components/CardPaginationFooter/CardPaginationFooter.test.tsx), card contract; original audit/explicit master acceptance. Known/unknown/zero/invalid totals, truthful ranges/page count, unknown Last omission/host hasNextPage, translated labels/namespace, page-zero-before-size, atomic controlled request and form safety. Existing underlying [Pagination tests](../../../src/experimental/Pagination/Pagination.test.tsx) include host rejection. | **ACCEPT — retain existing row acceptance.** No uncovered row criterion or concrete regression identified. Do not downgrade because M-11 layout or broad U/X/R/Z/device/AT gates remain open, and do not count this same stable ID again. |

## Dependency-ready next scopes (proposals, not dispatched or newly accepted)

Prioritize missing native evidence over more source inventories. Coordinator
reserves these scopes exclusively before creating NEW chats; existing completed
reviews need no replacement reviewer.

| Priority / scope | Exact prospective ownership | Prerequisite / completion evidence |
| --- | --- | --- |
| 1. Existing-spec Firefox checkpoint for M-02/03/04/05/07; no new feature | Read-only existing batch07-progress-status, batch07-catalog-tabs, batch10-page-header-reflow, batch10-auth-shell-reflow specs; only a unique next-batch checkpoint report | Normal browser allocation on one fresh frozen reviewed snapshot. Record engines/head/build identity and failures. Launch access has recovered; do not repeat unchanged diagnostic probes or claim full rows from launch success. Preserve any existing coordinator cross-browser reservation. |
| 2. M-06 main reflow/scroll continuity | AppShell stories/test/new unique shell browser spec/report; **no SideNavigation edits** | Desktop/mobile breakpoint, short host, text scaling, collapse while a main control is focused, independent nav/main scrolling and no document overflow. Reuse production scope/host nav; only modify AppShell runtime/CSS if a demonstrated failure warrants it. |
| 3. M-11 container/pagination composition | CardCollectionWithFooter stories/test/new unique collection browser spec/report; footer/experimental Pagination read-only | Width/height transitions, keyed cards, footer visibility/focus and loading/empty transitions; host rejection then acceptance. Separate from active AppDataGrid shrink scope; don't claim unknown totals for a complete-client collection. |
| 4. M-08 removed-trigger and size/scroll remainder | AppModal and, if required by reproduced defect, experimental Dialog test/story/spec/report scope reserved together | Host removes opener during nested dismissal; explicit surviving fallback policy, usable panel/control focus with owned sizes/heights/custom chrome. Run meaningful native timing/geometry; unit assertions alone are insufficient. |
| Conditional. M-07 short embedded host | AuthShell story/test/new unique spec/report, no new login/session owner | After checkpoint assessment, exercise clipping ancestors/short scroll host and host content replacement without losing field/focus. Existing source checks do not establish a defect. |
| Owner/manual. M-03 announcements and M-10 intent | AT evidence report for mounted host Status; coordinator/product decision record for M-10 | Actual milestone speech evidence; explicit criterion disposition. These are required decisions/evidence, not dependency-ready API implementation tasks. |

Read durable coordinator state at
`/Users/thomashall/.codex/visualizations/2026/10/07/01a1164f-41db-7f30-aaf9-f20133b6566f/parallel-migration-state.json`
(snapshot heartbeat `2026-10-07T16:12:47.560557+00:00`) and ledger at this baseline.
State confirms completed/integrated progress, tabs, header, AuthShell, navigator and
collection reviews; active logout, TimeField reset, client-page-shrink and async-native-busy
retain their exclusive scopes. Some reservedFollowUps entries are historical;
worker/integration records and later ledger supersede their old prerequisite text.
Firefox state records actual page capture and focused native behavior after access
recovery, including a genuine layout assertion failure in a separate control;
that is neither blanket Firefox acceptance nor a present human-access blocker.
No active scope or native queue/lock was altered here.

## Report validation

Read-only Git/source/contracts/tests/specs/report/state inspection; verified public
source exports, native tested hashes and direct-path equality above. Markdown
local targets/anchors, `git diff --check` and sole-file scope validated before
commit. No source edits, new tests, install, unit/type/build/Storybook/browser/server,
CI dispatch/wait, heavy locks, main merge or publication. No fresh runtime pass is
claimed. Coordinator alone independently reviews this report and reconciles
master/status/scoring; the worker reports its unique Conventional Commit directly
to authorized chat `01a1164f-41db-7f30-aaf9-f20133b6566f`.
