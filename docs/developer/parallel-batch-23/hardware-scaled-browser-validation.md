# Batch 23 hardware-scaled validation implementation

Implemented 2026-10-07 from the exact reviewed baseline
`28d3931aee25413f3f147be7088c634dee53a664` (`28d3931`, reviewed `codex/dev`
documentation checkpoint). Resolved with `git rev-parse 28d3931^{commit}` and
verified the managed worktree's HEAD before any edit. Attached managed worktree:
`/Users/thomashall/.codex/worktrees/hardware-browser-pool/sg-ui`, branch
`codex/hardware-browser-pool`. Primary and other worktrees were preserved.

Exclusive authored scope: `scripts/browser-validation-pool.mjs`, its colocated
`.test.mjs`, [the pool guide](../react-aria-parallel-browser-validation.md), and
this report. No config/spec/package/shared-guard/workflow edits, publication,
automatic integration, or broad acceptance closure. Latest explicit steering
supersedes a fixed 30-session ceiling: configure stage admission beyond 30 while
genuinely ready disjoint work and measured throughput justify it.

## Result

The pool keeps two sessions and one build as defaults. Explicit `--max` supports
30 and higher within the loopback port namespace. New snapshot plans build fresh
Storybook once and run browser `tsc` once at a clean reviewed exact head, then
stage disjoint tracked spec files into isolated sessions serving those immutable
bytes. There is no reuse of old builds or repetition of identical tests to fill
slots. A spec belongs to one shard; an explicit engine array allows that shard's
checkpoint matrix without duplicate assignment. Regex selectors are escaped and
anchored; patterns/line selectors/arbitrary flags and extra plan fields fail.

The original distinct-worktree array path remains. Optional `--build-max` tunes
necessary independent builds, with internal admission controlled by a single
supervisor's heavy lease held throughout its wave. Default 1 is serialized;
explicit 2/3 and higher are opt-in experiments, not certified hardware capacities.
External legacy builders remain excluded by the compatibility bridge and heavy
lease. Browser commands wait for all wave builds/types. Snapshot plans reject a
build-max other than 1. No shared scheduler caller was silently migrated.

Atomic slot, explicit port, UUID/shard output ownership and native occupied-port
checks prevent reuse. Lease roots/owner files cannot be symlinks. Cleanup verifies
owners, retains foreign/stale claims, terminates only owned process groups and
settles siblings before release. The legacy queue remains read-only and its
first-entry ownership/bridge protocol remains required. Snapshot setup/waves,
periodic monitoring and finalization verify head/cleanliness/source bytes and
static build digest. Observed mutation stays red even after restoration. Failures,
missing/empty/skipped/flaky/unexpected results and budget breaches retain evidence.

Optional snapshot resource budgets cover unused physical-memory floor, one-minute
load and aggregate system RSS ceiling. Invalid/nonfinite budgets fail. Breaches
stop admission/abort owned work; legacy plans reject these options rather than
silently ignoring them. Budgets are not calibrated defaults. macOS reclaimable
percentage is distinct from unused physical memory; aggregate RSS counts shared
pages repeatedly. No budget terminates unrelated user applications.

Resource sidecars retain command durations, CPU times/load, logical CPUs, owned
process-group RSS/CPU, system aggregate RSS, free/total memory, memory-pressure
output, macOS swap-used bytes and swap-in/out counters (raw platform probes retained).
Snapshot root evidence retains active-wave aggregate samples and stage/session
intervals/case throughput, build/source/lockfile/harness hashes and Node/pnpm/
Playwright versions. Samples do not backlog when a probe or integrity read is slow.
Use interval deltas for CPU/swapping; historical swap is not a present failure.

Light/install exports preserve the existing atomic four
`/tmp/sgui-light-validation-slots` and two `/tmp/sgui-install-slots` limits.
Browser types use a light lease. No installation was needed for dependency-free
Node fixtures. Expansion of these shared caller policies requires measured benefit
and a separately coordinated scheduler scope; this implementation does not steal
claims or broaden those limits.

## Focused evidence

Runtime: Node **24.21.0** at
`/Users/thomashall/Library/pnpm/store/v11/links/@/node/24.21.0/8e3363dcf6f5ccdfdbb0a5b55fe716a72499ddb103e848ba9405f4e34d178319/node_modules/node/bin/node`.
The repository's default shell Node is 26, so the explicit Node 24 executable was
used for every recorded fixture suite. Final invocation ran `node --test
scripts/browser-validation-pool.test.mjs` through `runOwnedCommand`, with one
owned atomic light slot and finally owner-verified release. Log:
`/tmp/sgui-batch23-node24-fixtures.log`; resource sidecar:
`/tmp/sgui-batch23-node24-fixtures.log.resources.json`.

Final suite: **30 tests, 29 passed, zero failed, one intentionally skipped**
(the existing real two-static-server integration fixture). Node test duration was
9.506 seconds; the owned command sidecar sampled 11 times over 9.552 seconds and
recorded 153,075,712 bytes peak owned fixture-process-group RSS. These are lightweight
fixture measurements, not estimates of real browser/build capacity. Fixtures cover:

- Default atomic two-slot process admission; explicit 30/32 unique slots and port-namespace bounds.
- 32 distinct concurrently ready fake shard commands, one fresh fake build/typecheck, unique ports/output paths and unchanged hashes.
- Nonoverlapping focused waves, supported multi-engine selection, exact regex paths and rejection of ambiguous/duplicate/dirty/wrong-head plans.
- Foreign slot/port/heavy/bridge ownership, occupied native listeners, symlinked output/lease roots/owner files and owner mismatch cleanup.
- Browser/build/source mutation and missing/empty result failures, sibling settlement, and periodic detection that survives source restoration.
- Resource sample schema, positive finite budget checks and failed admission before browser launch.
- Independent build admission at 1/2/3; legacy distinct-worktree orchestration at default 1 versus explicit 2 builds, default two browsers, heavy ownership throughout, and failed-build sibling progress.
- Owned command failure logs and interrupt/SIGKILL process-group isolation, preserving an unrelated fixture process.

Temporary Git repositories and fake build/type/browser commands make these
scheduler/integrity tests; they are not native browser tests. No actual Storybook
build, Playwright browser, real heavy/browser bridge, or load benchmark ran.
Native occupied-port tests bind only owned ephemeral listeners. Script syntax,
`git diff --check`, scope and relative documentation links were checked.

Full `pnpm check`/`pnpm build-storybook` and live adoption are **unrun** under the
explicit request to return focused implementation evidence before coordinator
review of an exact head and queue window. No install or duplicated heavy work was
introduced. Intermediate test corrections addressed fixture assumptions about
ignored symlinks and nondeterministic job admission; the final suite is green.

## Coordinator review and next measurement

Keep existing two-session scheduling until this harness is reviewed. Review a
committed clean implementation and an exact source head, authorize a queue window,
then choose useful accumulated Chromium shards. Start 2/4/8 and expand to 16/30/
higher only if distinct ready work remains and cases/second improve without
pressure/new swap or focus/actionability failures. Compare setup separately from
browser intervals. Necessary distinct source builds can be measured at 1/2/3
using build-max; do not build once per shared-snapshot shard.

The audit supplied by batch 24 reports ten logical CPUs/24 GiB, load around 2.5,
and historical swap usage, with approximately 60 seconds setup preceding brief
2–5 second browser commands. These motivate eliminating repeated setup; they do
not establish a safe session or build count. This implementation has not measured
live browser peak RSS, swap rates or scaling. Light/install expansion remains a
proposal for a coordinated follow-up, not a changed worker policy.

Local native loops remain Chromium-first. Firefox/WebKit are pending until ten
newly integrated native slices or the daily checkpoint, unless a specific engine
failure warrants earlier work. GitHub dev CI remains paused. Fixture success does
not close R-11/X-12, any cross-browser/native/device/AT gate, or the broad backlog.
