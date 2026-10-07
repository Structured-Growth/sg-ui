# Batch 58: focused snapshot case filters

## Scope and provenance

Human-authorized scheduler-only work from exact reviewed commit
`bc5e75fbac080011e349f6b7dde8486b4e5b95b5`. Created and attached managed worktree
`/Users/thomashall/.codex/worktrees/batch58-snapshot-case-filters/sg-ui` with that
SHA alone as the creation ref; verified exact HEAD and clean status before edits.
Only these four exclusive files change:

- `scripts/browser-validation-pool.mjs`
- `scripts/browser-validation-pool.test.mjs`
- `docs/developer/react-aria-parallel-browser-validation.md`
- `docs/developer/parallel-batch-58/snapshot-case-filters.md`

Primary, dev, testingcandidate and other workers were not edited. Scheduler51's
process-group settlement and owner-only cleanup implementation remains unchanged.
Final committed HEAD and clean freeze status accompany the authorized coordinator
handoff; the implementation hashes below identify the tested bytes independently
of this report's commit.

## Behavior and admission limits

Snapshot shards accept optional explicit `grep`. The filter is passed as two
separate spawn arguments (`--grep`, exact string); the shell never receives it.
Its bounded regex grammar permits literals, escaped punctuation, `.`, anchors
and at most eight alternatives, with a 512-character ceiling. Quantifiers,
groups, classes, alphanumeric escapes/backreferences, control characters, leading option text and
empty-matching expressions are rejected before setup. Omission retains whole-file
selection; extra/inverse/flags/args/source/environment fields remain forbidden.
Disjoint tracked spec ownership, supported explicit engines, source/head/lockfile/
build/harness attestations, resource budgets and queue/lease/port guards remain.
No retries or concurrency defaults change.

Snapshot success now requires full JSON suites with the reviewed browser report
root and no global errors. Unique case executions must reconcile exactly with
`stats.expected`, and every requested file/engine pair must have a case. Each
execution must report an expected outcome with exactly one passed retry-zero
result. Empty/missing selections, unselected files/engines/titles, duplicates,
aggregate count mismatches, skipped/flaky/unexpected outcomes fail closed.
Session and aggregate evidence retain the exact filter (null if absent), selector
arguments and successful case file/ID/project/title records. Failed sessions keep
results/logs and exact selection evidence. These counts cover reported selections,
not the complete file or broader engine matrix.

Playwright's JSON format omits leaf `suites` and reports file paths relative to
`config.rootDir`; fixtures model both. Untagged grep title reconstruction includes
the initial root separator, project, file suite, nonempty describe titles and case
title. Focused tagged cases fail closed: flattened JSON tags do not expose their
original suite/test placement. Whole-file tagged selection remains supported.
The version-pinned [JSON reporter](https://github.com/microsoft/playwright/blob/v1.63.0/packages/playwright/src/reporters/json.ts),
[test title implementation](https://github.com/microsoft/playwright/blob/v1.63.0/packages/playwright/src/common/test.ts)
and [configuration implementation](https://github.com/microsoft/playwright/blob/v1.63.0/packages/playwright/src/common/config.ts)
were read to verify these format assumptions; this is source inspection, not a
live browser execution.

## Validation and retained logs

Bundled runtime PATH begins with
`/Users/thomashall/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin`;
Node `v24.19.0`. Every run atomically acquired one canonical light slot before
spawning `node --test scripts/browser-validation-pool.test.mjs`, and released only
its exact token after completion. No installation was needed.

Retained logs and owner/runtime metadata are under this worktree's ignored
`artifacts/batch58/` directory:

| Run | Owner | Slot | Outcome |
| --- | --- | --- | --- |
| `fixtures-01.log` | `batch58-snapshot-case-filters:85080` | `slot-0` | 35 passed, 3 failed, 1 skipped; preserved red |
| `fixtures-02.log` | `batch58-snapshot-case-filters:91914` | `slot-0` | 38 passed, 0 failed, 1 skipped |
| `fixtures-03.log` | `batch58-snapshot-case-filters:99758` | `slot-0` | 39 passed, 0 failed, 1 skipped |
| `fixtures-04.log` | `batch58-snapshot-case-filters:8960` | `slot-0` | 39 passed, 0 failed, 1 skipped |

The first run exposed a fixture-only macOS `/var` versus canonical `/private/var`
report-root mismatch. The fixture now uses the actual command cwd; production root
validation was preserved. Run three adds shell-metacharacter argument propagation, nested title attestation
and tagged whole-file/default coverage. The final run also rejects leading CLI
option text at filter admission.
The skipped native static-server fixture is explicitly disabled via
`SGUI_POOL_SERVER_TESTS=0`. Fixture-internal intentionally failed sessions remain
expected regression assertions; temporary fixture trees follow existing teardown.
The outer red run log remains retained.

Final implementation SHA-256:

- Pool: `2a356b667f224018b0e51f1c698e5d7ae044857cbd6e1ddddae96aa786efb1d2`
- Fixtures: `5a4846b6694afa330b0d18628812d445ff9f50d396334b79f76779ea0b67dfe0`

`git diff --check` passed. Local documentation links and the exact four-file scope
were checked. Fixtures preserve defaults, 32-shard scheduling, queue/cap/budget,
foreign slot/port/owner rejection, source/build mutation and all Scheduler51
signal-error, descendant-settlement and retained-lease guards.

No browser, native static server, actual Storybook build, full check, CI dispatch,
PR/title change, integration, publish, workflow permissions or secrets work ran.
The explicit bounded authorization supersedes repository-wide check/build
requirements for this scheduler fixture task. Native port-bind rejection and
owned Node child-process fixtures remain part of the authorized scheduler suite.
This is orchestration evidence only, not component R-11/X-12 acceptance or live
capacity proof. Coordinator `01a1164f-41db-7f30-aaf9-f20133b6566f` independently
reviews the exact patch before deployment and integrates alone. The worktree is
frozen after the Conventional Commit and clean verification.
