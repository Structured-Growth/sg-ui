# Batch 14 exact-head runtime review

Reviewed 2026-10-07. Assignment X-01/H-16/U-13; bounded source, regression and
runtime-evidence review of Badge #69, List #73 and persistent-state #80.

## Isolation and canonical scope

Verified review baseline: `f1e5e457ce6240022ca07d6336ea06c5b67c917c`.
Managed worktree created and attached before edits:
`/Users/thomashall/.codex/worktrees/batch14-review-runtime/sg-ui`.
Branch: `codex/batch14-review-runtime`. Exclusive write allowlist:
`docs/developer/parallel-batch-14/review-runtime.md` only. Draft report PR targets
`codex/dev`; its final commit/URL are supplied in the coordinator handoff.

Read AGENTS.md and [development validation](../react-aria-development-validation.md),
[master IDs](../react-aria-master-task-list.md),
[remaining controls](../react-aria-remaining-controls.md),
[primitive contracts](../react-aria-primitives.md),
[hook contracts](../react-aria-pagination-state.md) and all three existing batch-13
review reports before writing. Those reports cover other PRs, not these three heads.
No duplicate unit/build execution was needed for this documentation review.

Canonical IDs: X-01 remains open for behavior-test quality; H-16 remains open for
pagination/filter reconciliation. U-13 is already checked for progress/status
implementation, and these diffs do not change progress. Badge maps more directly to
already-checked U-12 and open X-03; List to U-03/X-03, although both workers label
their assignment U-02/X-03. U-02 is the layout-primitive task, not the precise List
or Badge contract. PR80 claims an H-16/X-16 slice, but does not itself establish
page-size/filter clamp/reset behavior. No canonical checkbox changes follow.

## Exact heads and decisions

All workers start at `b139a0d06fb06ba4a5a5aa6adc69c5cb3b206818`. Full diffs
were inspected against that exact worker baseline, rather than the review checkout.
The relevant Badge/List/Button directories and usePersistentState implementation
are unchanged between that worker baseline and the review baseline.

| PR | Exact reviewed head | Decision |
| --- | --- | --- |
| [69](https://github.com/Structured-Growth/sg-ui/pull/69) | `931d14caa878f9ab69cda8569f7476bf436eca2d` | Accept bounded source/regression fix; fresh native semantic acceptance pending. |
| [73](https://github.com/Structured-Growth/sg-ui/pull/73) | `d3e9844d72bf7f323cec40b1e6ce372740dca02c` | Accept bounded source/regression fix; fresh native semantic acceptance pending. |
| [80](https://github.com/Structured-Growth/sg-ui/pull/80) | `7ab44f779cea4d2eae89f44fbeef678ba57bb8d4` | Accept source/test correctness; changed-state story acceptance incomplete and native storage evidence pending. |

No blocking source defect found. These decisions authorize no merge and do not
upgrade broad H/U/X/R/Z, device, manual or spoken assistive-technology acceptance.
GitHub confirms all three are open draft PRs targeting `codex/dev`; titles use
`fix:` and the changes introduce no new breaking public contract.

Exact file sets, independently asserted against Git:

- #69: Badge.tsx, Badge.test.tsx, Badge.stories.tsx under
  `src/experimental/Badge/`, plus `docs/developer/parallel-batch-13/control-badge.md`.
- #73: List.tsx, List.test.tsx, List.stories.tsx under
  `src/experimental/List/`, plus `docs/developer/parallel-batch-13/control-list.md`.
- #80: `src/hooks/usePersistentState.ts`,
  `src/hooks/usePersistentState.behavior.test.tsx`, plus
  `docs/developer/parallel-batch-13/persistent-state.md`.

Each matches the worker's allowlist. File sets are disjoint. No dependencies,
exports, workflows, licenses, token definitions or shared documentation changed.
Owned APIs, native refs, client boundaries and host state authority remain intact.
No new library string requires translation; new story labels are host example data.

## Source and regression assessment

### Badge

The span previously accepted host aria-label/aria-labelledby without a nameable
role. The fix conditionally supplies group semantics for a nonempty host label,
leaving unlabeled text without a role. It preserves the native span ref, count
content, styling and independent child action names. aria-hidden still hides the
entire wrapper and descendants: a hidden badge belongs inside an independently
named action, as the new story demonstrates. No live region, implicit activation,
overflow cap or generated count label is introduced.

Two added cases assert named overflow with a separately named button, referenced
labels, hidden groups and label removal back to plain content. Existing zero,
formatted content and ref checks remain. These are observable accessibility-query
assertions, not a copy of the conditional implementation. The new story covers
zero/overflow/full host label and decorative content. Automated jsdom role/name
queries do not establish actual browser accessibility trees or spoken grouping.
No pointer/focus implementation changes; this review nonetheless reserves fresh
native semantic checks under the assignment's stricter evidence requirement.

### List

`selected ?? props["aria-pressed"]` fixes the lost native mixed state. Explicit
false/true selected values win; omission preserves the host native attribute;
omitting both removes pressed state. Button receives the state through its existing
owned/React Aria implementation. Native ul/li/button refs and separate sibling
buttons remain; no collection state or focus manager is added.

The single added composed case asserts mixed/false/true/removal precedence,
description references, native roles/refs, sibling containment outside the action
and stable keyed DOM identity after host reorder. Existing Space activation and
disabled checks remain. Keyed identity is jsdom evidence, not native focus repair
on deletion. The interactive mixed-state story uses host-controlled state and a
separate restore action. Existing CSS selects aria-pressed=true, so host true now
also receives selected styling; mixed does not. This follows the existing state
selector and introduces no separate style policy.

### Persistent-state recovery and lifetime

Saved 3 remains readable after a failed write of 5. The browser-scoped fallback
correctly takes precedence, and same-key mounted peers display 5. Previously,
setting 3 after recovery deleted that fallback, primed only the initiating cache
and returned without the shared notification because stored bytes matched.
`Map.delete` now records whether a fallback was removed; same-byte early return
is allowed only when no fallback was retired. The existing scoped change event
then makes both initiating and peer snapshots observe saved 3. It retains
redundant-write suppression and the existing local/session/key boundary.

The two parameterized cases assert both consumers at 5 and then 3, no redundant
setItem, unchanged other-key/memory-only views and a subsequent peer functional
update to 4 persisted to the selected store. Storage is mocked only to trigger the
quota error; React hooks, subscriptions and recovery use the real implementation.
Baseline red cases fail at the stale displayed value rather than a private event.

Existing tests additionally cover blocked reads/writes, versioned fallback migration,
key switches, default-memory isolation, SSR/hydration and an unmounted session
fallback surviving an unrelated local clear before retirement on a session event.
The fallback WeakMap is window-scoped, persists across component unmount, and is
retired on successful setter recovery or a matching native storage event. This
fix does not change that lifetime or make it durable across document reloads;
host network/security/data authority is unchanged. Synthetic StorageEvent tests
are not genuine cross-tab evidence. No source correction is requested here.

## Evidence counts, runtime and tested-content identity

| PR | Tested implementation commit | Worker targeted evidence |
| --- | --- | --- |
| #69 | `c4159fccc1988991abf495a3a3cf495b4a217478` | Red: 1 file, 1 failed/3 passed. Green: 1 file/4 passed, worker report and PR attribution. |
| #73 | `a430ec12d76fe0dc4d9b9552d908c7da28cc6f5b` | Red: 1 file, 1 failed/2 passed. Final related: 7 files/17 passed. |
| #80 | `74c17d1eafdd0584f25b5bd187536072b29a7c06` | Red: 1 file, 2 failed/14 skipped. Related: 9 files/47 passed. |

Git assertions independently confirm every tested commit has the exact worker
baseline as parent, and each tested-to-final diff contains only its new report.
Thus stated tested source/tests/stories equal reviewed final content. This does
not independently prove which uncommitted bytes were executed: that execution
attribution comes from worker reports, and logs contain checkout paths, not commit
fingerprints. No aggregate 68-test reviewer or integrated-head run is claimed.

Read retained logs: `/tmp/sgui-batch13-control-badge-before.log`,
`/tmp/sgui-batch13-control-list-{baseline,related,final,typecheck}.log`,
`/tmp/batch13-persistent-state-{red,green,typecheck}.log`. Counts above for List
and persistence are independently visible in those logs. No Badge green log was
found among `/tmp/sgui-batch13-control-badge*`; its green pass remains attributed
report/PR evidence. List/persistence typecheck logs show tsc invocation without
errors; worker reports supply successful exit attribution. Foundation/token and
Badge typecheck passes are likewise worker-reported, not fresh reviewer passes.

Worker runtime: Badge/persistence Node 24.21.0 via `/tmp/sgui-run24.mjs`;
List bundled Node 24.19.0. All report pnpm 10.29.3, React 19.2.3 and Vitest 4.1.11;
Badge additionally records jsdom 26.1.0/TypeScript 5.9.3. Reported commands:

- Badge: `node /tmp/sgui-run24.mjs exec vitest run src/experimental/Badge/Badge.test.tsx --maxWorkers=1`.
- List: `pnpm exec vitest related --run src/experimental/List/List.tsx --maxWorkers=1`, after explicit baseline List.test.tsx run.
- Persistence red: `pnpm exec vitest run src/hooks/usePersistentState.behavior.test.tsx --maxWorkers=1 -t "fallback recovery"`.
- Persistence green: `pnpm exec vitest related --run src/hooks/usePersistentState.ts --maxWorkers=1`, via Node 24 helper.
- All workers report frozen install, `typecheck`, `foundations:check`, `tokens:check` and `git diff --check` passes; no full check/build/browser claim.

Workers report atomic install slots (limit 2), atomic light slots (limit 4), own
owner tokens/finally cleanup and maxWorkers=1. This reviewer neither installs nor
runs UI suites: zero reviewer unit/browser executions, no slot acquisition.
Reviewer tooling identified Node 26.5.0 and gh 2.95.0; Node ran no validation.

## Reviewer commands, limits and reserved follow-ups

Read-only commands: `git rev-parse HEAD`, `git status --short`, `git cat-file -t`
for the baseline; `list_artifacts` then `create_worktree` at the exact commit;
`git switch -c codex/batch14-review-runtime`; `gh pr view 69/73/80` for
head/title/base/draft/body/state; fetch three PR heads; `git diff`, `git show`,
`git log` at exact hashes; `rg` canonical IDs/contracts/reports; read listed logs.
Temporary remote review aliases disappeared during shared-ref activity, so all
subsequent comparisons use immutable hashes, never a moving remote alias.
Python assertions independently checked all three exact file sets, tested parents,
report-only deltas and diff whitespace. This report receives relative-link,
sole-file ownership and whitespace checks before commit.

No Storybook build/full suite/packed consumer/React 18 validation was run. No
configuration/harness copies, lock stealing, queue alteration, unchanged Firefox
retry, CI/title wait/rerun/dispatch, merges/main/publication or credentials/permission
changes occurred. The heavy lock owner read was
`01a116a4-f72f-7853-b068-47a3e2ebe9cb`; priority JSON contained that chat followed
by `01a116ad-fb4d-7891-9b4b-359e6ab91ea0` and
`01a116aa-4ad8-7a43-9bad-fbd7ab927463`. Both remain untouched.

Required evidence is requested for coordinator scheduling through the existing
queue after pool proof/review approval. These are pending reservations, not fresh
passes or a claim of queue insertion; an occupied lock does not complete them:

1. Badge: reserve its story/browser scope for focused fresh checks of named group,
   child action name, referenced label, host label changes/removal and decorative
   badge inside a named action. Build a fresh frozen story head, record runtime,
   exact tested hash and per-engine results. Spoken grouping remains a separate AT task.
2. List: reserve its story/browser scope for mixed/true/false/omitted native state,
   Enter/Space single activation, sibling actions and focus/identity through host
   keyed reorder. Do not infer dynamic removal focus from keyed-node assertions.
3. PR80 changed-state story is explicitly outside its prior allowlist. Reserve
   `src/hooks/usePersistentState.stories.tsx` plus a unique report: two simultaneous
   opt-in consumers, controlled quota/recovery, reset to already-saved state,
   distinct-key and memory-only views. Source/test acceptance above is independent;
   changed-state story acceptance remains incomplete until this scope lands.
4. Pair that fixture with an exclusively owned focused persistence browser spec:
   local/session saved 3, failed 5, recovery to 3 without redundant write, peer
   functional update, unmount/remount fallback lifetime and isolated storage scopes.
   Distinguish injected quota from a genuine quota limit and real cross-tab events
   from synthetic events. Queue via the approved pool; do not bypass shared ownership.

All outside-allowlist edits and checklist decisions remain reserved to their owners.
Conflicts or subsequent source changes invalidate exact-head decisions and require
renewed affected review. No broad acceptance gate is closed by this report.
