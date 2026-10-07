# Batch 13 review-2: bounded integration review

Task references: X-01/W-19/Z-13. Review date: 2026-10-07.

## Checkout and ownership

- Verified review baseline: `b139a0d06fb06ba4a5a5aa6adc69c5cb3b206818`.
- One managed, attached worktree: `/Users/thomashall/.codex/worktrees/batch13-review-2/sg-ui`.
- Branch: `codex/batch13-review-2`; draft PR base: `codex/dev`.
- Exclusive write allowlist: `docs/developer/parallel-batch-13/review-2.md`.
- Every worker comparison uses baseline `d0fcc6298004ad23d1a75480b216b39142e6df96` and the exact head below, rather than the review checkout's files or a moving branch.

No worker source, tests, stories, shared guidance, configuration or workflow was
edited. No worker was merged. The final report commit and draft PR URL are recorded
in the coordinator handoff and PR history, avoiding a self-referential commit ID.

## Per-head decisions

| Worker and exact head | Decision | Changed files versus worker baseline |
| --- | --- | --- |
| async-direction — `71d6ecdb733cea4131964132f10cbabf8912e53b`, [PR #40](https://github.com/Structured-Growth/sg-ui/pull/40) | **accept** for the bounded direction audit | `src/experimental/AsyncMultiSelect/AsyncMultiSelect.test.tsx`; `docs/developer/parallel-batch-11/async-direction.md` |
| account-action-lifetime — `01bd2e6c0ebc1e2a491d3982020d4ee3fba47c2c`, [PR #37](https://github.com/Structured-Growth/sg-ui/pull/37) | **accept** for adapter lifetime evidence | `src/adapters/accounts.test.tsx`; `docs/developer/parallel-batch-11/account-action-lifetime.md` |
| icu-parser-boundaries — `6e64a70da0eb71c93c6e23f52edd1ee231d77810`, [PR #36](https://github.com/Structured-Growth/sg-ui/pull/36) | **accept** for parser boundary evidence | `src/i18n/icu.test.ts`; `docs/developer/parallel-batch-11/icu-parser-boundaries.md` |

All six changed files match their respective exclusive allowlists. `gh pr view`
confirmed each supplied PR is a draft against `codex/dev`, with the exact listed
head. All three diffs pass whitespace checks. All changes are tests or reports;
runtime source, public APIs, translations, refs, styling, dependencies and licensing
are unchanged. Conventional `test:`/`docs:` titles need no breaking marker here.

### Async direction

The new case mounts English/RTL and Arabic/LTR independently, changes both scopes,
and asserts direction/language ancestry, stable input/listbox identity, preserved
controlled query, independent uncontrolled selection, focus in jsdom and blocked
stale options while loading. Callback assertions distinguish a scope update from
a host query/selection request. It adds a genuine composed case to the existing
11 tests; it is not browser geometry or locale-driven keyboard evidence.

Inspection of the unchanged inline implementation supports the absence of a
Popover/open state: the prior [portal review](../parallel-batch-05/portal-direction.md)
does not justify adding an overlay bridge here. Existing native reset cases in
`tests/browser/batch05-native-reset.spec.ts` were read, not executed. No changed
native implementation or story behavior requires a new browser build in this PR.

Worker report and exact-head PR body report Node 24.19.0, pnpm 10.29.3, Vitest
4.1.11; frozen install, `pnpm exec vitest run src/experimental/AsyncMultiSelect/AsyncMultiSelect.test.tsx`
(12/12), `pnpm typecheck` and `git diff --check` passed. The report explicitly
limits the evidence to DOM inheritance and jsdom focus. This review did not rerun
the tests or independently verify their native outcomes.

### Account action lifetime

Seven new expanded cases plus two existing cases exercise callback replacement,
provider removal, unmount/remount, nested/sibling providers, overlapping requests,
out-of-order rejection and explicit retry. Promise identity and exact Error/object
identity assertions protect host diagnostics; deferred promises make settlement
order intentional. Mutation/getter spies guard against implicit account work.
The tests correctly preserve the [adapter contract](../react-aria-host-adapter-acceptance.md#account-ownership):
new calls observe current providers while already returned promises remain caller-owned.
They do not prove SideNavigation's composed completion policy.

Worker report and exact-head PR body report Node 24.21.0, pnpm 10.29.3, Vitest
4.1.11. Commands: `node /tmp/sgui-run24.mjs install --frozen-lockfile`,
`node /tmp/sgui-run24.mjs exec vitest run src/adapters/accounts.test.tsx src/components/SideNavigation/SideNavigation.test.tsx`,
`node /tmp/sgui-run24.mjs typecheck`, and `git diff --check` passed.
Read-only inspection of `/tmp/sgui-batch11-account-unit.log` independently confirms
2 files/16 tests passed (9 account and 7 SideNavigation); the typecheck log was
also inspected. These logs do not independently bind a checkout hash; exact-head
attribution is supplied by the worker's PR completion record. No runtime/story
behavior changed, so new native evidence is unnecessary for this test-only PR.

### ICU boundaries

Ten expanded cases add offset restoration through nested select/plural and sibling
arguments, inactive-branch variable extraction, quoted delimiters, six malformed
message boundaries and success at exactly 50 levels. Whole-message fallback and
catalog SyntaxError assertions prevent misleading partial interpolation; the
50-level success complements the existing 51-level rejection. These are concrete
examples within the [owned subset](../react-aria-i18n-acceptance.md#owned-icu-subset),
not full MessageFormat support or exhaustive fuzzing.

The report and PR body identify tested implementation/test commit
`f601e995a3c2a0a420abe26f2ce4be81ecaeee5d`, Node 24.21.0, pnpm 10.29.3, Vitest
4.1.11; frozen install and
`node /tmp/sgui-run24.mjs exec vitest run src/i18n/icu.test.ts src/i18n/index.test.tsx`
passed 2 files/52 tests. `git diff --check` passed. The exact diff from that tested
commit to final head `6e64a70da0eb71c93c6e23f52edd1ee231d77810` contains only the
new report, so tested code is unchanged. This review did not rerun the suite.
No source/API/style change warrants typecheck or native browser validation here.

## Reviewer checks and limits

Read AGENTS.md, [development validation](../react-aria-development-validation.md),
the owned proof/host/i18n contracts, prior portal evidence, existing affected tests
and implementation, and the exact worker reports. Review commands:

- `git rev-parse HEAD`, `git switch -c codex/batch13-review-2`, `git status --short`.
- `git diff --name-status <worker-baseline> <exact-head>` and `git diff <worker-baseline> <exact-head>` for all three workers.
- `git log --format='%H %s' <worker-baseline>..<exact-head>` for all three workers.
- `git show <exact-head>:<affected-test-path>` and `git diff f601e995a3c2a0a420abe26f2ce4be81ecaeee5d 6e64a70da0eb71c93c6e23f52edd1ee231d77810 --name-only`.
- `gh pr view 40/37/36 --json url,headRefOid,baseRefName,isDraft,body` (separate invocations).
- `git diff <worker-baseline> <exact-head> --check` for each head; report links/path checks and `git diff --check` for this report.

Reviewer host runtime: Node 26.5.0; GitHub CLI 2.95.0. No reviewer unit/browser
tests were run (0 reviewer executions); the 12, 16 and 52 counts above are worker
targeted evidence, not an 80-test integration run. No installs, validation slots,
heavy lock, priority queue, browser pool, full check/Storybook/consumer matrix or
paused GitHub CI/title actions were needed or modified for this read-only review.

Integration prerequisites: preserve these exact heads and their disjoint file
ownership. Conflict resolution or subsequent runtime changes require renewed
affected review/validation. No new product changes are warranted by this review.
Broad H/U/X/R/Z, manual/device/assistive-technology and production acceptance stay
open; acceptance here authorizes no merge or publication.

## Bounded follow-ups

1. AsyncMultiSelect busy attribute: reserve `src/experimental/AsyncMultiSelect/`,
   `tests/browser/batch13-async-busy.spec.ts` and a unique report. Reproduce the
   worker-observed missing native `aria-busy` before any fix, cover loading/error
   and live transitions, update a changed-state story, and obtain fresh focused
   browser evidence via the existing pool/queue. Check later integrated work first
   to avoid duplicating a completed fix. DOM busy does not close spoken AT gates.
2. SideNavigation action lifetime: reserve `src/components/SideNavigation/` and
   a unique report (plus a focused browser spec only if demonstrated native
   navigation/focus timing changes). Reproduce pending logout/organization
   completion after callback replacement, provider removal and unmount; define
   composed completion applicability before fixing post-await getters/navigation
   or state updates. The current finding is source inspection, not a reproduced
   regression, and does not warrant changing adapter promise pass-through.
3. Translation visual acceptance remains a separate queued browser task using
   existing pseudo-localized/Arabic stories. ICU parser acceptance needs no source
   fix from this audit. Do not duplicate the ten completed boundary cases or close
   H-08 from parser-only evidence.
