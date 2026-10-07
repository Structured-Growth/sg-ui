# Batch 24 validation throughput audit

Read-only audit performed 2026-10-07 at approximately 10:54–11:00 America/Chicago.
Reviewed snapshot: `codex/dev` at `28d3931aee25413f3f147be7088c634dee53a664`.
The requested shorthand `codex/dev28d3931` is not a Git ref; the resolved exact commit above was used.
Managed, attached worktree: `/Users/thomashall/.codex/worktrees/batch24-throughput-audit/sg-ui`.
This report is the only authored file. No tests, builds, browser launches, dependency installs,
servers, state/lock changes, primary-checkout edits, integration or publication were performed.
Coordinator alone integrates. Batch 23 retains exclusive pool implementation/test/guide ownership.

## Finding

Current evidence supports a setup/coordination bottleneck, not demonstrated hardware saturation.
Increasing the limit to 30 sessions without changing repeated setup would mostly queue more builds.
The productive next step is one clean frozen dev build, disjoint focused Chromium spec shards,
and measured ramp-up under the batch-23 owner's reviewed implementation. The latest human instruction removes a fixed browser ceiling: expand until useful ready work is
exhausted or measured hardware throughput stops improving. Fifty chats is an authorized
coordination scale, not a requirement to invent work.
There are not 50 independently evidenced, dependency-ready new implementation defects here.
Do not manufacture assignments or rerun unchanged passing slices to fill slots.

## Hardware and process evidence

Read-only commands: `sysctl -n hw.model hw.ncpu hw.memsize`, `uptime`, `memory_pressure`,
`sysctl vm.swapusage`, `df -h /Users/thomashall`, and
`ps -Ao pid,ppid,%cpu,rss,etime,comm | sort -k3 -nr | head -25`.

| Observation | Sample |
| --- | --- |
| Machine / CPU / physical memory | Mac16,1 / 10 logical CPUs / 25,769,803,776 bytes (24 GiB) |
| Load averages | 2.25 / 2.52 / 2.85 |
| Free pages / compressed pages | 155,943 / 165,656, 16 KiB pages (about 2.38 / 2.53 GiB) |
| memory_pressure reported availability | 75% system-wide memory free percentage; reclaimability metric, not physical unused RAM |
| Swap | 3,874.94 MiB used of 5,120 MiB; cumulative swap-in/out counts are historical, not current rates |
| Disk | 926 GiB total / 303 GiB used / 593 GiB available |
| Largest sampled CPU consumers | GitKraken renderer 44.3%, WindowServer 25.9%, fseventsd 20.9% |
| Codex renderer / ChatGPT RSS | 794,912 / 695,200 KiB |

No validation workload appears among the top sampled CPU processes. This single sample was
between jobs: it does not establish peak per-browser RSS, swapping rate, CPU scaling, disk
throughput, or safe capacity for substantially more simultaneous sessions. Existing swap makes RAM monitoring
material even though the sampled pressure report is healthy. Preserve unrelated user apps.

## Measured setup versus native execution

Evidence files are ignored local artifacts, read directly from
`/Users/thomashall/.codex/worktrees/<worker>/sg-ui/artifacts/browser-pool/<token>/evidence.json`.
Each records exact head, source tree, selected specs, build digest, timestamps and final integrity.
Vite build times below are extracted from the sibling `build.log`.

| Worker / token / exact source head | Vite build | Start to browser start | Browser command | Total job |
| --- | ---: | ---: | ---: | ---: |
| batch06-grid-sort / c11a6b95-bd57-4ead-bdfe-7b5740fdd1ba / 816c9b9b0eeb1936c979057dd19834fc93f5b441 | 27.68 s | 59.511 s | 2.247 s | 61.848 s |
| batch13-control-checkbox / 77a9063e-5c98-4ad9-97d7-d76e45c513b0 / ee27dcf11aac93ef2063e13576772d09641278e4 | 26.94 s | 59.521 s | 2.373 s | 61.952 s |
| batch13-control-link-recovery / dd10086b-dd74-4279-ab72-13b99912f3f7 / b9e981ffea6ea6ab0d77125172d480242b2645c7 | 28.31 s | 61.543 s | 4.777 s | 66.384 s |
| batch17-menu-autofocus / 370477b2-b048-4f5b-af22-a83aa688941f / f567db7eaaaf3ec68b84b4f8b5377276aa25c3ab | 29.71 s | 62.999 s | 4.728 s | 67.778 s |
| batch13-control-tooltip-3440 / 2e7ab30a-7239-44bb-b228-546ecb3013b5 / eab46dce334ffaa58298f5cec8b4d1efcd127cef | 30.64 s | 71.289 s | 36.286 s | 107.911 s |

Grid/Checkbox are Chromium only; Link uses all three engines; Menu/Tooltip use Chromium/WebKit.
Start-to-browser includes build queue wait, build, typecheck, version/digest work and wave barrier;
it is not an isolated build measurement. Browser-command duration includes server startup and
runner overhead, not only individual assertions. Tooltip shows that test composition can materially
increase native duration. Failed jobs omit browserFinishedAt; do not treat missing durations as zero.

At this snapshot `scripts/browser-validation-pool.mjs` rejects max >2 and duplicate worktrees,
serializes Storybook builds via buildTail/HEAVY_LOCK, waits at a wave barrier, and holds the legacy
compatibility lock throughout. `playwright.config.ts` has one worker and zero retries. Thus setup is
explicitly serialized regardless of idle CPU. The fourteenth plan at `/tmp/sgui-fourteenth-pool-plan.json`
and wrapper `/tmp/sgui-fourteenth-pool-run.py` select two separate worktrees with `--max 2`.
Their browser intervals overlap for approximately 2.237 seconds. The earlier live-proof log
`/tmp/sgui-batch12-browser-pool-live-proof.log` proves two sessions, not a higher hardware-derived concurrency limit.

Suggested batch-23 measurement contract: retain one fresh build/hash/source/lock attestation, count
setup separately, admit disjoint shards with independent ports and artifact paths, and sample peak
CPU, process-group RSS, pressure/swap deltas and throughput during 2/4/8/etc. sessions. Increase only
when useful work exists and throughput improves without integrity or focus failures. This report
neither implements that policy nor changes the queue. Same frozen snapshot does not justify copying
old worker artifacts or substituting stale builds.

## Stage budgets and ramp recommendation

This audit did not measure concurrent peak RSS, typecheck duration, unit throughput or installation
network/disk usage. The following are experimental starting budgets, not validated capacities:

| Stage | Initial experiment | Expansion / stop evidence |
| --- | --- | --- |
| Build | One shared frozen build; independent changed snapshots start with two concurrent builds, owned by scheduler | Compare aggregate completed builds/minute against serialized baseline, peak RSS and swap delta. Test 1/2/3 rather than launch dozens; per-build Vite observed 27–36 s and CPU count is 10. Do not share mutable output. |
| Browser | Useful disjoint Chromium shards at 2, then 4, then 8; next count follows actual ready shard count | Expand while cases/minute rises with no additional focus/actionability errors, positive memory pressure or sustained new swap. No arbitrary 30 ceiling. Count processes/contexts, not only chat/session labels. |
| Browser types | One `tsc` for the clean snapshot before shared-build admission | Avoid identical tsc for every shard. Distinct source snapshots each require their own type evidence. Measure elapsed time/RSS before parallel expansion. |
| Targeted unit/guards | Existing four lightweight slots, then test eight genuinely different selections | Track wall time and process-group RSS. Keep package/build-producing checks separate; deduplicate identical source-tree/selection work. |
| Install | Existing two installation slots; reuse exact lock-compatible installed worktrees when valid | Expand only if disk/network throughput and available memory justify it. Frozen lockfile required; do not install identical dependencies per spec shard. |
| Review/integration | Exact-head diff, ownership and evidence reviews can proceed independently; coordinator commits central integration | Hardware cannot remove exclusive ownership or source-freeze dependencies. Review final source once, distinguish report-only deltas; don't spawn redundant audits of already accepted heads. |

Suggested ramp guardrails for batch23: collect one-second or similarly short samples during active
waves; retain maximum process-group RSS, CPU/load, pressure and swap-in/out deltas. Hold roughly
4 GiB reclaimable memory as an initial operational reserve, then refine from observed peaks. Pause
new admission on sustained memory pressure or rising swap accompanied by declining throughput,
rather than kill foreign processes or treat old cumulative swap as a current failure. Stop increasing
when a next distinct wave has no throughput gain beyond run-to-run variation; do not continue
unchanged experiments after useful ready work exhausts. Ten CPUs and 24 GiB constrain builds much
more plausibly than the current near-idle sample proves; this is a hypothesis to measure.

Browser focus diagnostics must check document activation and actual activeElement separately.
The ledger's isolated grid-sort run already ruled out pool contention for that historical failure;
don't reinterpret it as a reason to serialize all work or weaken assertions. New concurrency-specific
failures need distinct reproduction against the same frozen build before classifying their cause.

## Dependencies, duplicate work and owner gates

Read the durable coordination JSON at
`/Users/thomashall/.codex/visualizations/2026/10/07/01a1164f-41db-7f30-aaf9-f20133b6566f/parallel-migration-state.json`,
[ledger](../parallel-migration-batches.md), [master list](../react-aria-master-task-list.md),
and batch-14/16/18 review reports. The JSON heartbeat is 15:52:40 UTC; the ledger includes later
reviewed integrations through this snapshot. Reserved follow-up statuses can be stale: reconcile
source and integrated ancestry before dispatch, and refresh live ownership with the coordinator.

Already integrated: TextField form reassociation (9c735eb/cf11ac1), Switch disabled-label correction,
Textarea native reset, shared Menu modifier autofocus, Link activation, Checkbox disabled/reset fixes,
grid-sort coverage, hook dependency prerequisite 2b9ca35 and react-stately guards e32b665/7b6c98f.
The current TextField helper re-reads association after each commit. Do not dispatch the old
standalone-form-reassociation reservation. Firefox now executes actual stories; Link passed all
three engines. No further unchanged launch probes or environment-blocked claims are appropriate.

Still exclusively owned/pending: ButtonGroup, TagGroup, SideNavigation logout, client-page-shrink,
AsyncMultiSelect busy, DateField partial reset, and batch-23 pool. Do not add workers to their files.
Reviewed DateField implementation and its prerequisite/native evidence must be integrated by its
existing owner/coordinator before a composed dependent slice. No unintegrated worker specs are
eligible for a dev-snapshot shard.

Whole acceptance remains 67/326 (required 67/320), with 31 held inventory rows. Integration counts,
passing browser cases and active chat counts are separate metrics. Review and exact-head integration
remain serialized human/coordinator decisions even when machine validation becomes parallel.
Manual screen reader X-11, physical touch/drag X-07/X-08, actual IME E-05, browser zoom/native-device
checks, commercial/publication owner configuration L/R-17, and discretionary feature decisions
K-12/G-23/G-24 cannot be closed by more Chromium sessions.

## Bounded unowned candidates

All candidates start from exact `28d3931aee25413f3f147be7088c634dee53a664` (or a later coordinator-
reviewed descendant). They are proposals, not assignments or claims of reproduced new defects.
Existing reserved follow-ups must be explicitly reassigned, rather than duplicated.

| Priority / IDs | Precise prospective write allowlist | Prerequisites and acceptance |
| --- | --- | --- |
| 1 — TimeField reset audit, U-18/K-07/X-04 | src/experimental/TimeField/TimeField.tsx; TimeField.test.tsx; TimeField.stories.tsx in that same directory; tests/browser/batch25-timefield-reset.spec.ts; docs/developer/parallel-batch-25/timefield-reset.md | c90e4def00c3d4d1c2a5d17771a1313311636fde is integrated. Batch16 identifies retained prevention/callback/partial-draft gaps; source still passes engine onChange directly while owned helper restores only feedback. First retain a native RED reproduction for prevented complete/incomplete reset, accepted reset callback silence and changed defaults. Fix only a reproduced gap; visible segments, FormData, callback counts and focus must pass. Do not modify shared useFormReset or DateField; request separately owned dependency if needed. Not yet independently reproduced here. |
| 2 — Named grid reset type route, W-19/X-20 | src/components/index.ts; tests/types/app-data-grid-view-state.tsx; docs/developer/parallel-batch-25/grid-reset-type-route.md | 153b9817210b65e6fd13a5ae0b6fb08e258dc39d integrated. AppDataGridViewState is exported only from granular index; root inherits explicit component barrel. Retained source F-03 is confirmed at this snapshot. Owner must decide additive root/component reexport versus intentional granular-only contract. If additive, prove root/component/granular imports resolve the same owned shape and callback compatibility with type/package checks; do not alter grid implementation or central guide without separate ownership. No browser run needed. |
| 3 — WebKit portal return-focus reproduction, U-08/X-04 | tests/browser/batch25-portal-return-focus.spec.ts; docs/developer/parallel-batch-25/portal-return-focus.md | 52e9c37b8b236587788b6f4baca375568d237ece and current Menu d8b6c49 integrated. Existing native-reset report cites historical WebKit en-US failure at c4364df; this is a reproduction-only reservation, not a proven current product bug. Run one current-head en-US explicit-direction nested-overlay return-focus case in WebKit and Chromium. Preserve native Tab/close policy and classify any failure. No source changes until a current defect and exclusive owner are established. |
| 4 — Due-label browser ICU slice, H-12 | src/components/LearnerClassCard/LearnerClassCard.stories.tsx; tests/browser/batch25-due-label-icu.spec.ts; docs/developer/parallel-batch-25/due-label-icu.md | e372781c2b1ceca630cda6fc7a989af2d6c05c33/d104c4544a61777499e0cfb4faac3aad3019b9bf integrated. Reserved due-browser-icu remains unrun; unit/Node Intl evidence already exists. Add only missing fixed-clock, explicit timezone/locale browser cases for local-midnight boundaries, invalid/missing fallback and complete accessible label. Compare engine outcomes at the cross-engine checkpoint. No repeated utility unit inventory or card-frame work. |

TimeField audit outranks broad speculative acceptance expansion, but DateField's proven partial-draft
fix remains the higher product priority with its existing owner. API disposition is an owner decision,
not permission to silently pick an incompatible public contract. No new regression is claimed solely
from an unchecked master-list row.

## Disjoint Chromium shard proposal for one clean dev snapshot

Freeze the reviewed head, verify tracked/untracked cleanliness, freshly build once, and attest every
shard's spec selection and build hash. Batch-23 implementation must support this safely before use;
the current pool rejects repeated worktrees. Suggested eight shards below contain only files present
at `28d3931`, no batch14/20/23 unintegrated specs. Each filename appears once. This is focused
checkpoint work after meaningful integrations or an explicit checkpoint, not an instruction to repeat
all passing tests immediately. Expand to more shards only by partitioning these selections, never by
duplicating them; maximum useful concurrency here is bounded by the selected specs and hardware.

| Shard | tests/browser/ spec filenames |
| --- | --- |
| 1 — Native form/control | batch01-forms.spec.ts; batch05-native-reset.spec.ts; batch11-standalone-reset.spec.ts; batch13-control-checkbox.spec.ts; batch13-control-switch.spec.ts; batch13-control-radiogroup.spec.ts; batch13-control-textarea.spec.ts |
| 2 — Menu/actions/navigation | batch01-adapters.spec.ts; batch05-portal-direction.spec.ts; batch08-selector-direction.spec.ts; batch13-control-button.spec.ts; batch13-control-link.spec.ts; batch13-control-splitaction.spec.ts; batch17-menu-autofocus.spec.ts |
| 3 — Dialog/layout/focus | batch01-dialogs.spec.ts; batch05-tabs-overflow.spec.ts; batch07-catalog-tabs.spec.ts; batch10-auth-shell-reflow.spec.ts; batch10-card-frame-reflow.spec.ts; batch10-page-header-reflow.spec.ts; batch13-control-disclosure.spec.ts; batch13-control-tooltip.spec.ts; batch13-editable-title.spec.ts |
| 4 — Grid state/focus/sort | batch01-grid-focus.spec.ts; batch05-grid-busy.spec.ts; batch05-grid-shell-state.spec.ts; batch06-grid-sort.spec.ts; batch08-grid-retry-focus.spec.ts; batch15-persistent-recovery.spec.ts |
| 5 — Calendar/selectors/status | batch01-calendar.spec.ts; calendar.spec.ts; batch01-selectors.spec.ts; batch13-control-timefield.spec.ts; batch07-progress-status.spec.ts |
| 6 — Editor command/clipboard/link | batch13-formatting-toolbar.spec.ts; editor-clipboard.spec.ts; editor-links.spec.ts; editor-rich-document.spec.ts |
| 7 — Image/upload trust/lifetime | editor-image-lifecycle.spec.ts; editor-image-sources.spec.ts; editor-upload-lifecycle.spec.ts; image-upload-validation.spec.ts |
| 8 — Reorder/preferences | batch01-grid-reorder.spec.ts; reorder.spec.ts; display-preferences.spec.ts |

`acceptance.spec.ts` is deliberately outside this focused plan: it is a broad aggregate and can overlap
the same behaviors. Reserve it for the scheduled broad checkpoint rather than add redundant load.
Calendar/reorder legacy and batch specs have distinct scenarios; retain their file-level distinction,
then compare selected test titles before admission to remove exact duplicate scenarios if discovered.
Firefox/WebKit backlog for provisional Checkbox/grid-sort changes remains explicit; Chromium
sharding does not satisfy that checkpoint. Zero retries, preserved assertions and engine-policy-aware
native focus checks remain essential. Report underlying causes rather than multiplying one defect
by the number of engines.

## Report verification

Verified exact worktree HEAD and clean start; read source/contracts/ledger and local retained evidence.
Documentation-only validation: all proposed existing spec paths and local report links checked,
unique shard membership checked, and git diff whitespace checked. No runtime validation was run.
This report does not change acceptance statuses, dispatch tasks, alter pool code, or imply hardware
capacity has been benchmarked.
