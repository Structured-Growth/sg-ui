# Daily owned static-server cleanup correction

Exclusive source scope: `scripts/browser-validation-pool.mjs`, its colocated Node
fixtures, `scripts/serve-browser-storybook.mjs`, and this record. Isolated managed
worktree: `/Users/thomashall/.codex/worktrees/daily-owned-server-cleanup-fix/sg-ui`.
Baseline: `1c8a4e4d2eb75479c5581c009eaacf5f3209aee4`.
Follow the [development policy](../react-aria-development-validation.md) and
[parallel validation contract](../react-aria-parallel-browser-validation.md).

## Reconciled failure and deployed launcher

The coordinator's `daily-checkpoint-dfe9d8a.json` records one load-budget abort,
90 accepted cases, seven cancelled shards and 86 unrun shards. Seven detached
static Storybook servers survived their Playwright command groups. Separate
owned cleanup eventually proved settlement and removed only the coordinator's
first queue entry. This correction does not change that incomplete outcome.

Read-only inspection of the checkpoint installation confirmed Playwright 1.63.0:
`playwright/lib/runner/index.js:869` launches the configured webServer with
`shell: true` and inherited environment; `playwright-core/lib/coreBundle.js:9320`
sets detached process groups on Unix. `playwright.config.ts` starts
`node scripts/serve-browser-storybook.mjs`, with one worker, zero retries and
`reuseExistingServer: false`. No copied configuration or installation was used.

## Owned lifetime and settlement

Every owned command creates a fresh local Unix registration socket and UUID
owner token, supplied through its child environment. The static server registers
before loading immutable assets or listening. The supervisor independently reads
PID/parent/group/start-time rows, verifies the token and live ancestry to its
spawned command, and records the server PID, group leader identity, port and
ancestry before acknowledging registration. The server retains the socket as a
lifetime guard: supervisor disconnection closes its HTTP connections/listener,
including startup races. Standalone servers without ownership environment retain
their existing behavior.

Normal command exit and cancellation terminate both the command group and
registered detached groups. Before signaling an additional live group, its
leader's group/start-time identity must still match. Settlement requires negative
group probes returning ESRCH and free owned listener ports. EPERM is preserved as
failed evidence; malformed registration, ambiguous identity or unresolved groups
retain leases through the existing `ownedCommandUnsettled` path. Foreign groups
are never inferred from names, adopted listeners or global process enumeration.
Process enumeration is read-only ancestry/identity evidence. Per-command resource
samples now include registered groups, and receipts are in resource JSON.

Pool typecheck admission now uses the existing canonical four-slot light helper,
including its held legacy transition claim. The two-slot install helper is
unchanged; built-in Node fixtures needed no install. Browser maximum eight, load
ceiling 24 and RSS ceiling 28000 MiB were not changed. Existing command termination
bounds, browser timeouts, retries and assertions were preserved.

## Bounded Node 24 evidence

Runtime: `/Users/thomashall/.npm/_npx/387698761821791d/node_modules/node/bin/node`,
version 24.21.0. Each invocation acquired only canonical light slot1 plus its
legacy slot-1 guard, ran via `runOwnedCommand`, proved its command group gone and
released both exact-owner claims. Foreign slot0 remained untouched. No install,
native browser, Storybook build, full matrix or full repository check ran.

- At `7f7d1c8` the first focused invocation passed seven of eight cases. The new
  foreign static fixture failed because a macOS temporary-path symlink was rejected
  by the existing server path guard. Its realpath was corrected; red evidence is
  retained as `fixtures.log` and `validation.json`.
- At `04fb6372deffc6d4ed0c3f44928bc7273dab18e1`,
  `SGUI_POOL_SERVER_TESTS=1 node --test scripts/browser-validation-pool.test.mjs`
  passed **47 tests, zero failures/skips**, in 14.01 seconds. This exercised the
  complete bounded Node harness fixture file, including canonical contention,
  snapshot orchestration, failed evidence and existing success/abort behavior.
- At `ffeb317166d5319f75b15f0f14fc5a6b0ea275cc`,
  `node --test --test-name-pattern='registered detached|ambiguous server|unresolved registered|owned command|exit, timeout|normal leader|unsettled permission|SIGINT and SIGTERM|legacy pool retains' scripts/browser-validation-pool.test.mjs`
  passed **nine tests, zero failures/skips**, in 4.54 seconds after matching the
  deployed detached shell topology and retaining ancestry receipts. New evidence
  covers normal/abort server death and free ports, foreign listener survival,
  ambiguous foreign registration without signals, and denied registered-server
  shutdown retaining leases and EPERM even after a later watchdog settlement.

Full fixture command group 4796 and final focused group 14762 both settled with
no outer signal/ownership errors. Peak loads were 6.2334 and 5.6592; peak system
RSS was 19662454784 and 19896860672 bytes, respectively. Resource JSON and exact
lease tokens are retained under the worktree's ignored
`artifacts/daily-owned-server-cleanup-fix/`. External report:
`/Users/thomashall/.codex/visualizations/2026/10/07/01a1164f-41db-7f30-aaf9-f20133b6566f/daily-owned-server-cleanup-fix.json`.
`git diff --check` passed. The final delivery commit only combines these reviewed
source changes and this evidence record; its source bytes match the final tested
head.

## Remaining uncertainty

Fixtures establish the owned Unix topology on macOS, not a new live checkpoint
or engine/device/AT/production acceptance. A parent dying before registration can
make ancestry unavailable: registration refuses, the server cannot listen, and
observed ambiguity retains leases for coordinator resolution. PID/start-time
checks and local tokens do not protect against a hostile machine administrator;
unverifiable process tables/identities fail closed. Unsupported/non-Unix platforms
have not been validated here. Uncatchable supervisor termination relies on the
socket lifetime guard for listeners and still requires independent lease/group
verification. The separate snapshot-continuation successor remains unimplemented.
Coordinator review and a newly authorized live run remain necessary.
