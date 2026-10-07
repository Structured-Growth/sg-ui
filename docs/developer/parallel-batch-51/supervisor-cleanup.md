# Batch 51: bounded supervisor cleanup failures

## Scope and provenance

Human-authorized scheduler-only defect repair, based exactly on reviewed dev
commit `1c4f82a3184119c6c6adacde4ecf34adb1a745d0`, resolved read-only from
`/Users/thomashall/.codex/worktrees/dev-integration/sg-ui` before creating and
attaching managed worktree
`/Users/thomashall/.codex/worktrees/batch51-supervisor-cleanup/sg-ui`.
Only the pool implementation, its fixtures, the parallel-browser guide and this
record change. The final committed SHA and clean status accompany the coordinator
handoff; implementation identities below bind the tested bytes independently of
this report's commit.

Coordinator-supplied incident: supervisor PID 98595 received its own SIGTERM to
correct missing Node 24 child PATH before browser launch. Its child exit listener
called `stop`, whose negative-group SIGTERM threw EPERM uncaught from EventEmitter,
exiting the root supervisor with code 1 and leaving its bridge/heavy leases.
Retained incident token: `5c1b7168-631f-4151-a83f-5ea64abd4dde`; owner:
`browser-snapshot:98595:441e8a09-a202-4f87-89fc-186fb4b0963f`; child PIDs
98795/98819. The coordinator independently verified those processes gone and
recovered only exact owned empty leases. This worker did not read or mutate the
running batch45 candidate `c64c4377`, its processes, locks or incident artifacts.
EPERM's underlying OS cause is not established by that report; EPERM never proves
that a group is absent. The aborted attempt supplies no product acceptance.

## Repair and limits

`runOwnedCommand` catches signal errors at the exit, abort, timer and final cleanup
sites, records operation/code/message in `<log>.resources.json`, and fails its
promise. Spawn/resource sampling failures also stay controlled. A successful
signal operation alone does not prove descendant settlement: only ESRCH from the
exact owned negative-group existence probe does. Normal leader exit still cleans
descendants. SIGTERM has a bounded SIGKILL fallback; a separate completion deadline
prevents inaccessible leaders or inherited pipes from hanging cancellation.
Settlement probing is bounded too. With default delays, these stages take at most
roughly 9.1 seconds plus resource sampling and evidence I/O after stop begins.

Unverifiable/live groups remain registered for owned resource evidence. The bounded
failed command return carries `ownedCommandUnsettled`; snapshot and legacy pool
paths stop later admission/abort siblings and retain acquired bridge, heavy,
light, port and session leases still held by that run. Evidence explicitly records
retention, rather than claiming cancellation completed. Coordinator cleanup needs
independent disappearance verification and exact owner tokens. Even when settlement
later succeeds, recorded permission failures remain red. Evidence-write failures
preserve the unsettled marker. Signal authority stays confined to the freshly
spawned child's negative process-group ID; no PID discovery or foreign cleanup is
introduced. Existing queue, integrity, port, zero-retry and ownership guards stay
in place. No CLI substitution or retry was added.

## Validation

Bundled Node executable directory:
`/Users/thomashall/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin`;
version `v24.19.0`. Both runs atomically acquired one canonical light slot (0–3)
before spawning `node --test scripts/browser-validation-pool.test.mjs`, then
released only their exact token. No install was needed. No heavyweight lease,
browser, server, full check, Storybook build, CI dispatch or deployment ran.
This follows the expressly bounded authorization, which overrides repository-wide
check/build requirements for this scheduler fixture task.

- Initial run `/tmp/sgui-batch51-fixtures-01.log`: 32 passed, 1 failed, 1 skipped.
  A signal seam accidentally propagated ESRCH before injecting EPERM when the group
  had already disappeared. Corrected the fixture to inject the intended error even
  in that case; production behavior was not weakened.
- Final run `/tmp/sgui-batch51-fixtures-02.log`: 35 total, 34 passed, 0 failed,
  1 skipped, exit 0, duration 10.759 seconds. The skipped native server fixture
  remains explicitly gated off.
- Meaningful additions: exit/timer/final-cleanup EPERM stays failed after verified
  settlement; normal leader exit kills its owned descendant; real live-group signal
  denial returns bounded failed snapshot evidence and retains bridge/heavy claims
  while a foreign process and lease survive; SIGINT/SIGTERM subprocess handlers
  settle owned commands with failed exit; legacy unsettled-command evidence retains
  admitted session/port/bridge/heavy claims. The live fixture cleans only its own
  child group and tokens after separately verifying actual ESRCH.
- Existing ownership, source/build integrity, queue/port, admission and command
  failure fixtures all pass. `git diff --check` passes.

SHA-256 identities of final tested files:

```text
e84612f932cd5463adc78b6605ea6e3b14df62d314db3064a85a0cd22706ded8  scripts/browser-validation-pool.mjs
3e9339ca3d9a26c033a73416c3de226b54498465e5c31a4171a87cb64becac20  scripts/browser-validation-pool.test.mjs
fd373443a99a894987573a78b274651ae634f3a9f740f3ad6cc7ec617bc56e46  /tmp/sgui-batch51-fixtures-02.log
```

These are Node orchestration fixtures, not source-runtime browser proof, a live
scheduler trial or product acceptance. Coordinator independently reviews the
scheduler before deployment and alone integrates. No main merge, publish or
candidate restart is authorized here. See the [pool contract](../react-aria-parallel-browser-validation.md).
