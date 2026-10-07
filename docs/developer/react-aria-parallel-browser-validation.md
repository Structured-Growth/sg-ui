# Opt-in hardware-scaled browser validation

This harness implements a bounded R-11/X-12 scheduling slice. Follow the
[development validation policy](react-aria-development-validation.md) and
[browser acceptance requirements](react-aria-browser-acceptance.md). The
[batch-23 implementation evidence](parallel-batch-23/hardware-scaled-browser-validation.md)
distinguishes fixtures from an authorized live trial. Coordinator review and an
exact-head queue window precede adoption. Existing workers keep their two-session
scheduling until that review. This does not close broad native/device/AT gates.

## Compatibility and admission

`pnpm test:browser` and its config retain one Playwright worker, zero retries,
`reuseExistingServer: false`, default port 6173 and all three projects. The pool
still defaults to two sessions and one Storybook build at a time. `--max N` is an
explicit session upper bound, including 30 and higher; it must fit the integer
loopback port range 1024–65535 starting at `--first-port` (default 6273). Actual
concurrency cannot exceed distinct ready jobs/shards. No retries, duplicate tests,
automatic cap increases or stale-lock reclamation inflate throughput.

Each slot uses atomic `mkdir` under `os.tmpdir()/sgui-browser-validation-pool-v1`.
Ports have separate atomic `ports/<port>` leases and a native loopback bind check.
An occupied port fails without adopting or stopping its listener. Each run has a
fresh UUID directory and owner file; snapshot sessions have unique shard directories
and owner files. Outputs must be gitignored inside the exact source worktree.
Symlinked ancestors, escaped paths, dirty tracked/untracked source and incorrect
40-character heads fail closed. Normal ignored installation/generated artifacts
are allowed; they do not substitute for a fresh Storybook build.

The supervisor reads `/tmp/sgui-browser-validation-priority.json` without writing
it, then atomically claims `/tmp/sgui-parallel-batch-01-validation.lock` for its
entire run. Recognized empty queues are an empty file, `[]`, or `{ "queue": [] }`.
An authorized `--owner <exact chat ID>` must be the first existing queue entry;
following entries stay queued. Eligibility is rechecked after bridge acquisition
and before waves/jobs; snapshot monitoring also checks it during execution. Missing,
invalid, substituted or ineligible queues fail. The caller removes only its own
first entry after the run under the coordinator protocol.

Each build phase additionally claims `os.tmpdir()/sgui-heavyweight-build.lock`.
Cleanup checks exact owner tokens and removes only owned owner files/directories.
SIGINT/SIGTERM abort owned process groups with bounded SIGKILL fallback; all sibling
commands settle before resource release. Signal errors from exit listeners, timeout
callbacks and final cleanup are recorded in command resource evidence and fail the
run even if the group subsequently disappears. Only `ESRCH` from an owned negative
process-group probe confirms disappearance; `EPERM` does not. Termination and
settlement checks are bounded. If an owned group remains live or cannot be verified,
command evidence records `settled: false`, admission stops and acquired leases are
retained for coordinator verification. A bounded failed return is not completed
cancellation. Only verified settled commands permit normal owner-token cleanup.
No foreign processes, worktrees, locks or artifacts are cleaned. Uncatchable termination may leave claims for verified owner
cleanup. Read-only retained build directories need owner-restored write permissions
before later removal. Permissions and periodic hashes are guards against local
mutation, not a hostile administrator or guaranteed detection between samples.

## One clean frozen snapshot

Snapshot mode builds Storybook and typechecks browser sources **once** from the
reviewed committed head. Every session serves the same read-only tree with
`SGUI_BROWSER_IMMUTABLE=1`, which snapshots static bytes before listening. It is
an opt-in alternative to repeated multi-worktree setup, not reuse of old artifacts.

Create an external plan such as `/tmp/sgui-browser-snapshot.json`:

```json
{
  "mode": "snapshot",
  "worktree": "/absolute/reviewed/worktree",
  "head": "<exact 40-character reviewed committed HEAD>",
  "shards": [
    { "id": "forms", "specs": ["tests/browser/batch01-forms.spec.ts"], "project": "chromium" },
    { "id": "dialogs", "specs": ["tests/browser/batch01-dialogs.spec.ts"], "project": "chromium" }
  ]
}
```

A shard ID is unique lowercase alphanumeric/hyphen text. Each spec must be an
exact regular tracked top-level `tests/browser/<name>.spec.ts` path. Each file can
appear in only one shard, including across projects. Patterns, line filters,
extra fields and arbitrary Playwright arguments are rejected. Positional selectors
are escaped and anchored because Playwright interprets them as regular expressions.
A shard may use `"project": ["chromium", "firefox", "webkit"]` for an authorized
checkpoint without assigning that spec to multiple sessions. Projects must be
explicit, supported and unique. Separate files can contain similar scenarios;
coordinator review remains responsible for behavioral duplication and useful scope.

After exact-head review and queue authorization:

```sh
node scripts/browser-validation-pool.mjs \
  --plan /tmp/sgui-browser-snapshot.json \
  --queue-file /tmp/sgui-browser-validation-priority.json \
  --max 4 --first-port 6273 --output artifacts/browser-pool
```

All slot/port/output claims for a wave precede browser launch. If any resource is
occupied, none of that wave launches. Source HEAD/status/bytes and build digest
are checked around setup/waves, periodically during execution, and at completion.
Observed mutation aborts owned commands and remains failed even if source is later
restored. Empty/missing JSON results, skipped/flaky/unexpected cases and command
failures remain red. Evidence retains partial successes and failure reasons.
Never rebuild the shared directory or edit its source during a run.

## Distinct worktree path and stage limits

The existing JSON array plan remains supported:

```json
[
  { "worktree": "/absolute/first/worktree", "head": "<exact committed HEAD>", "args": ["tests/browser/batch01-forms.spec.ts", "--project=chromium"] },
  { "worktree": "/absolute/second/worktree", "head": "<exact committed HEAD>", "args": ["tests/browser/batch01-dialogs.spec.ts", "--project=chromium"] }
]
```

Only one job per worktree is allowed here. Each gets a fresh independent build.
`args: []` requests the full matrix; existing focused `--grep` and `--project`
selections remain available. Configuration/output/worker/retry overrides,
repeat/shard/timeout/early-exit controls and weakened modes are rejected.

`--build-max N` independently tunes simultaneous **distinct worktree builds**;
default 1 preserves serialized setup. One supervisor owns the heavy lock for the
whole wave, so it can admit several internal builders without racing unchanged
external heavy callers. It retains the compatibility bridge throughout. Types
stage through four internal admissions and atomic `/tmp/sgui-light-validation-slots`
leases. Browser commands wait for all builds/types to settle, avoiding competition
with builds within a wave. Holding the heavy lock through the browser wave is
conservative; external callers already remain excluded by the bridge.
Snapshot mode rejects `--build-max` other than 1 because it has exactly one build.

Exported `acquireLightSlot(owner)` and `acquireInstallSlot(owner)` helpers use the
existing four `/tmp/sgui-light-validation-slots` and two `/tmp/sgui-install-slots`
claims. The harness never installs dependencies. Use `pnpm install --frozen-lockfile`
under an owned installation slot when needed. These helper exports do not migrate
other callers or expand their limits; resource occupancy fails instead of stealing
claims. Expansion of light/install stages needs measured benefit and coordinated
caller rollout in a separately owned scheduler task.

## Hardware evidence and resource budgets

Every real command writes `<log>.resources.json` with elapsed time, one-second
samples plus start/end samples: CPU times, logical CPU count, load, free/total
physical memory, supervisor RSS, owned process-group RSS/CPU and system aggregate
RSS. macOS records `memory_pressure -Q`, `vm_stat` swap counters and
`sysctl vm.swapusage`; Linux records memory pressure and meminfo. Unsupported or
failed probes retain explicit unavailable values. macOS swap-used bytes and
swap-in/out counters permit before/after deltas. Historical swap usage alone is
not evidence of current swapping. Process `%cpu` is the OS-reported value; CPU-time
deltas supply interval machine utilization. Aggregate RSS includes shared pages
multiple times and must not be interpreted as physical memory consumption.

Snapshot evidence also records periodic aggregate owned-group/system samples,
source/build/lockfile/harness attestations, runtime/tool versions, stage commands,
session intervals/counts and cases per browser-window second. That throughput
includes startup and wave gaps; it is not assertion-only timing. Retain all red
logs/results/traces. A resource failure is infrastructure evidence, not a product pass.

Snapshot mode accepts optional positive finite budget arguments:

- `--min-free-mib N`: minimum OS-reported **unused physical** memory, not macOS's reclaimability percentage.
- `--max-load N`: maximum one-minute load average; it is lagging evidence, not instantaneous CPU utilization.
- `--max-system-rss-mib N`: maximum aggregate process RSS; unavailable RSS fails closed if this budget is required.

Budgets are checked before setup and waves and during periodic monitoring. A breach
halts admission/aborts owned work and leaves failed evidence. They are opt-in
operational bounds, not calibrated defaults. These budget flags are rejected for
the legacy array path rather than silently ignored. Choose budgets from active
measurements and reserve capacity for user applications; never terminate them.

Coordinator ramp: start with useful disjoint Chromium work at 2, then 4/8/16/30
and higher only while ready work exists and aggregate throughput improves. Measure
setup separately, peak owned RSS, CPU/load, pressure and **swap deltas**, plus focus/
actionability failures. Stop expansion when useful work is exhausted or throughput
stalls/pressure rises; ten CPUs and 24 GiB do not certify any session count. Test
independent necessary builds at 1/2/3 after review. Do not repeat unchanged passing
selections merely to create load. Local native loops are Chromium-first; Firefox/
WebKit stay pending until ten newly integrated native slices or the daily checkpoint,
unless a specific engine defect calls for earlier testing. Dev GitHub CI remains
paused per the development policy.

## Fixture validation and adoption limits

```sh
node --test scripts/browser-validation-pool.test.mjs
```

Under Node 24 this uses temporary Git/source/output/lease fixtures and fake
Storybook/type/browser commands. It covers default two-slot admission, explicit
30/32 capacity, disjoint 32-shard concurrency, build admission 1/2/3, source/build
mutation, selectors, budgets, queue/port/owner rejection and owned process-group
termination. It launches no browsers or Storybook builds and does not claim the
real heavy/browser bridge. Run it under one light slot. The
[batch-51 supervisor cleanup record](parallel-batch-51/supervisor-cleanup.md)
covers exit/timer/final-cleanup signal errors, descendant settlement, bounded
SIGINT/SIGTERM handling and retained leases for unverifiable live groups.

The existing native two-static-server fixture stays disabled unless
`SGUI_POOL_SERVER_TESTS=1` and the actual queue/bridge window is authorized;
`SGUI_POOL_OWNER` supports a first-entry authorized caller. Its ports are 6473/6474.
Prior two-session proof is historical evidence in
[batch 12](parallel-batch-12/browser-pool.md). Higher-cap fixtures are not live
capacity proof. A reviewed committed implementation and authorized fresh snapshot
trial are still required before rollout; preserve old scheduling until then.
