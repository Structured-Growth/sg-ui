# Opt-in local browser validation pool

This harness implements the bounded browser scheduling slice of R-11/X-12. It
follows the [development validation policy](react-aria-development-validation.md)
and [browser acceptance requirements](react-aria-browser-acceptance.md). Adoption
requires coordinator review; existing workers continue their current queue and
lock protocol. This does not close native, device or assistive-technology gates.
The [batch evidence](parallel-batch-12/browser-pool.md) records tested scope and
unrun prerequisites.

## Existing commands and configurable paths

`pnpm test:browser` retains one worker, zero retries, Chromium/Firefox/WebKit and
`reuseExistingServer: false`. Defaults remain port 6173, `storybook-static`,
`artifacts/browser-report`, `artifacts/browser-results.json` and
`artifacts/browser-traces`. CI and full checkpoints still require every engine.
An explicit targeted `--project` selection is partial evidence, never a full gate.

| Environment variable | Meaning |
| --- | --- |
| `SGUI_BROWSER_PORT` | Loopback port, integer 1024–65535; default 6173 |
| `SGUI_BROWSER_BASE_URL` | Optional matching `http://127.0.0.1:<port>` origin |
| `SGUI_BROWSER_STORYBOOK_DIR` | Static server build directory |
| `SGUI_BROWSER_REPORT_DIR` | HTML report directory |
| `SGUI_BROWSER_RESULTS_FILE` | JSON results file |
| `SGUI_BROWSER_OUTPUT_DIR` | Trace/screenshot output directory |
| `SGUI_BROWSER_IMMUTABLE=1` | Snapshot all static bytes before listening |

Both config and server reject mismatched/non-loopback URLs. An occupied port
fails; neither Playwright nor the server reuses or stops an existing listener.
Changing a port requires changing the optional base URL to match, or omitting it.

## Reviewed local invocation

Commit each worktree's changes first and install its dependencies with
`pnpm install --frozen-lockfile`. Each participating worktree must contain this
reviewed configurable harness. Use the required Node runtime (Node 24 for a full
checkpoint); the harness records the actual runtime rather than choosing one.
No files or configuration are copied into other worktrees automatically.

Create a plan outside tracked source, for example `/tmp/sgui-browser-plan.json`:

```json
[
  {
    "worktree": "/absolute/first/worktree",
    "head": "<exact 40-character committed HEAD>",
    "args": ["tests/browser/batch01-forms.spec.ts", "--project=chromium"]
  },
  {
    "worktree": "/absolute/second/worktree",
    "head": "<exact 40-character committed HEAD>",
    "args": ["tests/browser/batch01-dialogs.spec.ts", "--project=webkit"]
  }
]
```

After coordinator review, and only once the existing priority queue is empty and
its owner releases the legacy lock:

```sh
node scripts/browser-validation-pool.mjs \
  --plan /tmp/sgui-browser-plan.json \
  --queue-file /tmp/sgui-browser-validation-priority.json \
  --max 2 --first-port 6273 --output artifacts/browser-pool
```

Use `args: []` for the complete browser matrix. Routing, reports, workers, retries,
interactive modes and list-only overrides are rejected in plans. The output parent
must be gitignored inside the exact worktree; symlinked output ancestors and
repeated worktree jobs are rejected. Slots select `first-port + slot` and create
exclusive UUID output directories. There is no waiting queue or automatic retry;
occupied resources fail with a prerequisite error.

## Locks, build lifetime and cleanup

The existing `/tmp/sgui-browser-validation-priority.json` is read only. Recognized
empty forms are an empty file, `[]` or an object with `queue: []`. Missing,
unrecognized or nonempty queues fail closed by default. A coordinator-authorized
priority worker can pass `--owner <exact chat ID>` only when that chat is the
existing first queue entry and preceding workers have drained. Following entries
remain queued. The harness never inserts, reorders or removes entries; after
validation the listed caller removes only its own first entry, preserving the
rest, as required by the coordinator's protocol. Substitute queues are rejected.

The supervisor atomically claims
`/tmp/sgui-parallel-batch-01-validation.lock` for its whole run, only after preceding queue
entries drain. This compatibility bridge excludes all unchanged legacy heavy and
browser workers, without migrating them or modifying an occupied lock. Queue
state is checked again after claiming the bridge and before every job. One
supervisor can run at a time; its jobs run concurrently. Existing queued owners
must finish and release their own lock before any trial/adoption.

Browser slots use atomic `mkdir` leases under
`os.tmpdir()/sgui-browser-validation-pool-v1/slot-0` and `slot-1`. The initial hard
cap is two; `--max 1` lowers it. Slot ownership covers the whole job including its
build. Heavy Storybook builds additionally claim
`os.tmpdir()/sgui-heavyweight-build.lock` and serialize within the supervisor. Each wave stages up to two builds and browser
typechecks before launching their browser commands together; the next wave starts
after both previous jobs settle. This prevents a short first session from finishing
before the second worktree's build is ready, and avoids heavyweight build/browser
CPU competition within the pool. Future
heavy-only callers must honor both the coordinator's legacy compatibility policy
and the separate heavy lock. This change does not deploy that protocol to them.

Every job builds fresh static Storybook directly into its own UUID directory,
records its SHA-256 tree digest and makes files/directories read only. The server
snapshots those bytes before listening. Never rebuild that directory while tests
run. A final digest and HEAD/working-tree check reject mutated evidence even if
tests pass. Permissions are a local guard, not protection against an owner who
explicitly changes them. Retained builds can be removed after review by their
owner; first restore write permission on their directories as needed.

Each lease has a unique owner token. Cleanup verifies that exact token, removes
only its own owner file and directory, and never reclaims a stale claim. SIGINT or
SIGTERM terminates only child process groups spawned by this supervisor, with
bounded SIGKILL fallback, before releasing leases. Uncatchable termination can
leave stale locks. Coordinator inspection and verified owner cleanup are required;
there is no PID-based automatic recovery or broad process termination.

## Evidence and targeted checks

Each job retains `evidence.json`, `build.log`, `types.log`, `browser.log`, JSON/HTML
results and traces in its own worktree. Evidence records exact committed HEAD and
source tree, final HEAD/status, selected tests/engines, configured engine matrix,
commands, Node executable/version, OS, pnpm/Playwright versions, lockfile/harness
hashes, job and browser-command timestamps, slot/port, output paths and before/after build digest. Failure
and interruption remain failures. An infrastructure failure is not a product pass;
no unchanged Firefox retries are scheduled. All promises settle before bridge
cleanup, including failures in sibling jobs.

```sh
node --test scripts/browser-validation-pool.test.mjs
pnpm exec tsc --noEmit -p tests/browser/tsconfig.json
pnpm exec playwright test --list
```

These checks launch only owned Node fixtures, with temporary leases outside the
real pool. They do not launch browsers, build Storybook or claim the legacy lock.
The configurable two-server integration fixture is skipped by default. After the
same queue/lock prerequisites and coordinator review, opt in with:

```sh
SGUI_POOL_SERVER_TESTS=1 node --test scripts/browser-validation-pool.test.mjs
```

That fixture claims the actual legacy bridge and binds only its own ports
6473/6474. A two-worktree focused real-browser trial is a separate required adoption
check using the plan above. Do not claim concurrent browser success from atomic
slot tests or from server fixtures. Keep occasional full checkpoints and manual
acceptance separate from this bounded harness validation.

For the two-session adoption proof, select one small existing case per worktree
using explicit `--grep` and `--project=chromium`, with fresh committed heads. Keep
the generated evidence for both jobs and verify their browser command intervals
overlap, both results pass, ports/UUID paths differ and final build hashes match.
Record exact commands, selected case counts and heads. That trial proves bounded
parallel Chromium scheduling only; it does not establish Firefox/WebKit or any
manual/device/AT acceptance. Do not create extra worktrees or deploy the patch to
existing workers as part of this task; the coordinator owns the reviewed trial.

For an authorized first-entry proof, the gated server fixture also accepts
`SGUI_POOL_OWNER=<exact chat ID>`. Both paths still acquire the legacy lock
atomically, never adopt an existing owner, and recheck queue eligibility. The
batch-12 proof uses one managed worktree plus an owned ignored local Git snapshot
clone for its second source root; it does not create another managed worktree or
modify another worker. Each source root has the same committed head and a separate
fresh build/output tree.
