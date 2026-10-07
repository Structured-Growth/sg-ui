# Batch 13 card collection evidence

Assignment: card-collection, bounded M-12/U-17 composition audit. No demonstrated
in-scope defect was found; this change records existing evidence without adding
product code, tests or stories. Broad/manual/device/assistive-technology gates remain open.

## Isolation and scope

- Verified baseline and inspected source head: `b139a0d06fb06ba4a5a5aa6adc69c5cb3b206818`.
- One managed, attached isolated worktree:
  `/Users/thomashall/.codex/worktrees/batch13-card-collection/sg-ui`.
- Branch: `codex/batch13-card-collection`; draft PR base: `codex/dev`.
- Exclusive write allowlist: `src/components/CardCollectionWithFooter/`,
  `tests/browser/batch13-card-collection.spec.ts`, and this report.
- Actual changed file: only this report. Primary/all other worktrees preserved.
- Evidence report commit: `913a3cc` (full SHA available in Git history).
- Draft PR: [#52](https://github.com/Structured-Growth/sg-ui/pull/52), attached to this chat.
- Final report head is sent to the coordinator at handoff; a report cannot embed
  its own resulting commit hash.

Root AGENTS.md and [development validation](../react-aria-development-validation.md)
were read before edits; the only AGENTS.md found in this checkout is the root.
No architectural change was made. Shared footer, primitives, exports, configuration,
checklists and central guides remained read-only.

## Existing evidence and disposition

The [card contract](../react-aria-card-pagination.md) distinguishes the complete
client dataset collection from the footer's optional unknown server total. The
collection always supplies `rows.length`; unknown totals cannot be expressed in
its current API. Introducing server paging or a total override would change that
contract without a demonstrated defect.

Inspected existing tests, not freshly executed:

| Source | Existing cases | Evidence relevant to this assignment |
| --- | --- | --- |
| [Collection tests](../../../src/components/CardCollectionWithFooter/CardCollectionWithFooter.test.tsx) | 6 | Shrinking data/clamping with no render callback; controlled navigation and size reset; stable card state; host/fallback empty and loading content; disabled loading navigation; nested course actions and parent form isolation; SSR invalid page normalization. |
| [Footer tests](../../../src/components/CardPaginationFooter/CardPaginationFooter.test.tsx) | 7 | Page-zero-before-size callback ordering; unknown Next/omitted Last; zero count and disabled boundaries; atomic page/size requests with rejected host updates retaining prior range; invalid/disabled state; translations; SSR. |
| [Pagination tests](../../../src/experimental/Pagination/Pagination.test.tsx) | 7 | Controlled page navigation; unknown-total rejection retains displayed page; size reset ordering; zero/disabled actions; rejected atomic size request retains select value and page; atomic-only selector; keyboard/form-safe action. |

The collection has no local pagination state: it normalizes host props, slices the
complete dataset and forwards callbacks directly to the shared footer. The footer
and Pagination rejection cases therefore provide relevant underlying evidence;
they are not a dedicated collection-level rejection regression or native browser
proof. No failing sequence was established that would justify a product fix.
Existing Interactive, Empty, Loading and CourseCards stories cover these shipped
states. They were left unchanged because behavior did not change.

The [previous inventory audit](../parallel-batch-05/inventory-evidence.md) and
[inventory rows](../react-aria-migration-inventory-acceptance.md) already recommend
M-12 row-only acceptance, while holding M-11 for full responsive/container evidence.
The [original execution record](../react-aria-progress.md) records the initial
card tests and native representative pagination/layout checks at its own historical
head. Those results are not a current-baseline runtime pass. No broad U-17 or
whole collection acceptance is claimed here.

## Commands, runtime and limits

Read-only inspection used `git rev-parse HEAD`, `git status --short`,
`git switch -c codex/batch13-card-collection`, `rg --files -g AGENTS.md`, `rg -n`,
`cat`, `sed`, `git log -1`, `git remote -v` and `gh pr list --head`.
One attempted search referenced absent `react-aria-execution-record.md`; the
actual original record `react-aria-progress.md` was subsequently inspected.
Node queried for provenance: `v26.5.0`; no Node runtime tests/builds ran.

Documentation verification: `git diff --check`, relative-link existence checks,
existing test-case counts (6 + 7 + 7 = 20), and exact changed-file allowlist audit.
No dependencies were needed/installed; no install or light-validation slots were
claimed. No Vitest, typecheck, full check, Storybook build, browser/consumer suite
or server ran. No heavy-validation lock was claimed or browser pool bypassed.
Queued browser work is not represented as passed. GitHub CI/title automation was
not waited on, rerun, dispatched or modified. No merge, publish, permission,
secret, license or notice change occurred.

## Reserved follow-ups

If the coordinator wants stronger composition evidence, authorize one bounded
collection test/story follow-up for a host that rejects both separate page/size
requests, then accepts them after loading ends, verifying cards/range/select remain
consistent throughout. This is a coverage refinement, not an established bug.
A separate native responsive/container acceptance task should own fresh Storybook
and browser-pool allocation, including focus/scroll and light/dark narrow layouts.
Keep manual/device/AT and broad M/U/X/R/Z closure with their existing owners.
