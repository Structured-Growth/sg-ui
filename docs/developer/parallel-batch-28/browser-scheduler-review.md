# Batch 28 browser scheduler review

Decision: **ACCEPT bounded trial**, not general rollout or certified capacity.
Reviewed exact implementation `8b060aabcd99e9372761155875d41e812b93b6df`
against `28d3931aee25413f3f147be7088c634dee53a664`. Both were resolved with
`git rev-parse <ref>^{commit}`. The attached isolated managed worktree
`/Users/thomashall/.codex/worktrees/batch28-browser-scheduler-review/sg-ui`
was created at and verified against the implementation SHA before writing.
Only this report was authored. Implementation, config and tests remained read-only;
primary and other worktrees were preserved. Review date: 2026-10-07.

No blocking finding for a coordinated, clean exact-head Chromium snapshot trial.
Use genuinely distinct ready spec files at four sessions, then eight or higher
when useful work remains and measured throughput improves. Ten logical CPUs and
24 GiB motivate measurement; they do not establish a numerical capacity. This
review imposes no arbitrary two-session ceiling. Defaults remain two sessions and
one build until callers explicitly opt in. The existing first-entry queue protocol
and exclusive bridge remain prerequisites for the subsequent live window.

## Reviewed behavior

Line references below are to `scripts/browser-validation-pool.mjs` at the reviewed
SHA, not the later report commit.

- Snapshot validation (251–287) restricts plan/shard fields, IDs, engines and exact
  tracked top-level spec paths, rejects duplicate file assignment across all
  shards, and resolves spec/output paths against the exact worktree. Line 279
  escapes regex metacharacters and anchors the full path suffix. It avoids the
  legacy positional-selector overlap problem. I also evaluated the exact source
  expression under Node 24: `slice-0.spec.ts` matched its exact absolute path and
  did not match `slice-0-spec.spec.ts`. The existing fixture checks only a positive
  path and a suffix rejection (test lines 238–239); it is not a Playwright discovery
  integration test. Actual current config has one worker, zero retries, no server
  reuse, and explicit Chromium/Firefox/WebKit projects.
- Snapshot setup builds once under an actual external heavy lease, freezes/hashes
  that fresh output, and typechecks once under the canonical four-slot light
  allocator (353–363). This differs materially from repeated baseline builds.
  Tracked source byte hashes, exact HEAD/status, lockfile/harness hashes and
  start/final build hashes are retained (237–246, 308–310, 326–352, 415–425).
  The unchanged static server snapshots bytes before listening when immutable
  mode is enabled. Permission freezing and polling are local guards; they do not
  guarantee detection of a write restored between observations, attest ignored
  dependency bytes/environment, or defend against an owner deliberately changing
  permissions. The guide already describes the between-sample limitation.
- All snapshot wave slot/port leases and fresh shard output owners are acquired
  before any browser command (368–380). Ports are distinct within a wave and can
  be reused only after owned release in later waves. Native bind probes do not
  reserve the socket until the server starts; an unrelated listener winning that
  race makes launch fail rather than authorizing adoption/termination. UUID run
  directories and shard-specific results/report/traces prevent artifact reuse.
- Queue eligibility is read-only and checked before/after the compatibility
  bridge, during snapshot monitoring, and before waves. Empty recognized queues
  or the authorized first exact chat ID are accepted; following entries remain
  queued. Lease release checks regular lease/owner files and the exact owner;
  foreign/stale claims fail closed (27–49, 52–63, 221–230). Spec symlinks,
  symlinked output ancestors, direct slot/port-root symlinks and symlinked owner
  files are rejected. Checks are preflight checks, not atomic protection against
  concurrent path replacement. The bounded trial assumes no external mutation of
  its source/output/lease directories.
- Limits accept positive integers through 64,512, with the configured first port
  further bounding sessions (15–19, 296). Thus default port 6273 permits at most
  59,263 sessions; 30/32 and higher are valid configurations, not proven capacity.
  Active work is additionally bounded by distinct available shards/jobs. No
  identical-test repetition is introduced to fill slots.
- Snapshot budgets validate positive finite optional values and check before the
  build and each browser wave, then abort owned work on an observed periodic
  breach (211–218, 335–366). They do not reserve resources or adapt concurrency.
  Wave admission can proceed between samples; collection may take longer than
  one second, particularly while hashing a large build. System RSS is aggregate
  process RSS including shared-page duplication; free memory is unused physical
  memory, not reclaimable memory. Missing system RSS fails a configured RSS
  budget. CPU, pressure and swap are evidence rather than implicit thresholds.
- Distinct-worktree `buildMax` uses real admission tickets (518–522) beneath one
  external heavy owner held through the entire wave (565–571), so explicit
  parallel builds exclude cooperative external builders. Default buildMax=1 is
  serialized; snapshot rejects any other value. Browser staging waits for all
  successful/failed setup arrivals; failed jobs still arrive in finally. This is
  a real orchestration guard, not merely an unused semaphore export.
- Owned commands kill only their detached process groups; SIGINT/SIGTERM abort
  with bounded SIGKILL fallback and logs/resource sidecars (130–173). Snapshot
  commands settle with `Promise.allSettled` before owner-only cleanup (381–403).
  A normal failed shard marks the run failed but does not abort healthy siblings
  or suppress subsequent waves; integrity/budget/signal failure aborts admission.
  Uncatchable termination can leave leases requiring verified owner cleanup.
  Snapshot JSON requires positive expected cases and zero unexpected/flaky/skipped
  cases (391–392), retaining a failed aggregate even after source restoration.

## Compatibility limits

The legacy array mode is retained for independently reviewed distinct worktrees;
it is not equivalent to snapshot attestation. Its arbitrary focused regex/grep
arguments remain permitted, source checks use Git status/HEAD without periodic
byte digests, and success follows command exit rather than parsing positive,
unskipped JSON results (458–465, 523, 533–535, 549–551). These limitations are not
new snapshot regressions and do not block the proposed frozen trial. Do not use
that path as proof of disjoint shared-snapshot test selection. Resource budgets
are explicitly rejected there rather than silently ignored. Config text checks
are guards, not semantic parsing: trial source/config must still be reviewed.

## Independent focused evidence

Ran the existing dependency-free owned fixture suite under explicit Node
**24.21.0**, using atomic `acquireLightSlot` in canonical
`/tmp/sgui-light-validation-slots` (slot 0) and owner-verified finally release.
Invocation used `runOwnedCommand` with `SGUI_POOL_SERVER_TESTS=0`:
`node --test scripts/browser-validation-pool.test.mjs`.
Result reproduced the claim: **30 tests, 29 passed, zero failed, one skipped**;
Node test duration **8.673 seconds**. Log: `/tmp/sgui-batch28-node24-fixtures.log`;
resource sidecar: `/tmp/sgui-batch28-node24-fixtures.log.resources.json`.
A separate light-slot-owned Node evaluation checked the exact selector expression.
No installation, actual heavy lease, Storybook build/static server, Playwright
browser, native UI loop or capacity benchmark ran. The fixtures use transient
loopback bind probes/ephemeral net listeners only; the two-static-server fixture
remained skipped. Temporary fixture repositories/leases were cleaned by the suite.

The slot 30/32 tests prove atomic allocator uniqueness; the 32-shard test proves
concurrent fake promises with one fake build/typecheck. The independent build
admission 1/2/3 test exercises synthetic tasks, while legacy orchestration tests
exercise fake builds at 1/2. Neither proves actual build/browser RSS, actionability,
focus, throughput scaling, absence of new swapping, or capacity at 4/8/30+. Failure
fixtures prove retained red evidence, sibling settlement and owner cleanup, not
all native descendants or device interruption behavior. The owned process-group
fixture does exercise a real harmless Node child and unrelated-process isolation.

## Bounded next trial

After the current coordinator pool finishes and the first-entry bridge window is
available, select a reviewed clean committed source and distinct Chromium files.
Build once; compare useful browser cases/second at 4 and 8+ while retaining setup
and browser intervals separately, RSS/CPU/pressure and swap counter deltas, actual
result counts and native failures. Expand only while additional ready work and
measured benefit justify it. Avoid parallel heavy builds for a shared snapshot;
measure distinct-build 1/2/3 separately if needed. Keep light/install admission at
4/2 and retain owner cleanup. No live run was authorized or started by this review.

GitHub dev CI stays paused; local loops remain Chromium-first. Firefox/WebKit and
broad G/U/X/R/Z, native/device/assistive-technology acceptance remain open. Full
`pnpm check` and `pnpm build-storybook` were not run under the explicit focused,
no-heavy review constraint. Reviewed links: [pool guide](../react-aria-parallel-browser-validation.md)
and [implementation evidence](../parallel-batch-23/hardware-scaled-browser-validation.md).
