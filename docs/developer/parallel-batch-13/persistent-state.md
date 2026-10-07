# Batch 13 persistent-state recovery

Task slice: H-16/X-16, bounded persistence and independent-consumer coverage.
Broad task IDs, manual/device/assistive-technology gates remain open.

## Isolation and ownership

- Exact verified baseline: `b139a0d06fb06ba4a5a5aa6adc69c5cb3b206818`.
- Managed worktree, created and attached before edits: `/Users/thomashall/.codex/worktrees/batch13-persistent-state/sg-ui`.
- Branch: `codex/batch13-persistent-state`.
- Tested implementation head: `74c17d1eafdd0584f25b5bd187536072b29a7c06`.
- Draft PR: [#80](https://github.com/Structured-Growth/sg-ui/pull/80), base `codex/dev`.
- Final report-only head is supplied in the coordinator completion message because a commit cannot embed its own hash.

Exclusive write allowlist: `src/hooks/usePersistentState.ts`,
`src/hooks/usePersistentState.test.ts`, `src/hooks/usePersistentState.behavior.test.tsx`,
`src/hooks/usePersistentState.ssr.test.tsx`,
`tests/browser/batch13-persistent-state.spec.ts`, and this report.
Actual changes are only the implementation, behavior test and report.
Pagination hook/model, stories, shared guides/checklists, config, workflows and
all other worktrees were read-only. Primary uncommitted work was preserved.

## Demonstrated defect and change

Existing evidence already covered malformed/missing JSON, key replacement,
blocked reads/writes, quota fallback retention, live validation/migration,
local/session isolation, multiple shared consumers, opt-in memory independence,
SSR and hydration through the related pagination tests. The previous
[batch 05 shell report](../parallel-batch-05/grid-shell-state.md) supplied composed
host-state and persistence-key evidence. These completed cases were not duplicated.

The unfinished combination was recovery after a quota failure when the host sets
the value that still exists in storage. Starting with saved `3`, a failed setter
to `5` gives all mounted peers fallback `5`. After writes recover, setting `3`
removed the fallback but returned early because saved JSON was already `3`.
Both initiating and peer views continued displaying `5`.

The hook now notifies its existing key/storage scope when a fallback is removed,
even if saved bytes are unchanged. Redundant storage writes and ordinary same-value
notification suppression remain intact. No public API or persistence schema changed.
Two parameterized regressions cover local/session recovery, no redundant write,
subsequent peer functional updates, other-key isolation and memory-only opt-out.

## Validation

Runtime: Node `24.21.0`, pnpm `10.29.3`, React `19.2.3`, Vitest `4.1.11`.
Commands used `node /tmp/sgui-run24.mjs <pnpm arguments>` to select the existing
Node 24 runtime. No runtime, manifest or lockfile changes.

- `pnpm install --frozen-lockfile`: passed, lockfile unchanged; no packages downloaded.
- Baseline regression: `pnpm exec vitest run src/hooks/usePersistentState.behavior.test.tsx --maxWorkers=1 -t "fallback recovery"`: 2 failed / 14 skipped. Both failed with displayed `5` instead of requested `3`; implementation was still the exact baseline.
- Final: `pnpm exec vitest related --run src/hooks/usePersistentState.ts --maxWorkers=1`: 9 files / 47 tests passed, including related pagination consumers. Tested source is identical to implementation head above.
- `pnpm typecheck`: passed.
- `pnpm foundations:check`: passed.
- `pnpm tokens:check`: passed.
- `git diff --check`: passed.

Logs: `/tmp/batch13-persistent-state-red.log`,
`/tmp/batch13-persistent-state-green.log`,
`/tmp/batch13-persistent-state-typecheck.log`.

Installation claimed one atomic slot under `/tmp/sgui-install-slots` (limit 2).
Vitest runs claimed one atomic slot under `/tmp/sgui-light-validation-slots`
(limit 4), maxWorkers 1. Occupied slots were treated as queued, not passed;
retries waited 30 seconds. Only own matching owner tokens were released in finally
blocks. No heavy validation lock, browser priority file or browser pool was used,
modified, stolen or bypassed. No other worker/server was stopped.

## Limits and exact follow-up

No native timing/layout/focus/scroll change was made: this fixes synchronous
application notification after storage fallback retirement. jsdom evidence does
not claim native cross-tab or browser acceptance. No full check, Storybook build,
packed React 18/19 fixture, browser suite, physical device or assistive-technology
run was performed, per the targeted task validation policy. No dev GitHub CI/title
wait, rerun, dispatch or re-enable; no merge, main push or publication.

The only existing hook story is the pagination story, explicitly read-only here.
Changed-state stories cannot be written inside this exclusive allowlist. Reserve
`src/hooks/usePersistentState.stories.tsx` for a separate authorized follow-up:
two simultaneous opt-in consumers, host-controlled storage failure/recovery,
reset to already-saved state, plus independent memory-only and distinct-key views.
Keep browser-pool scheduling with the coordinator if native storage evidence is
requested. Shared checklist/guidance updates also remain coordinator-owned.
