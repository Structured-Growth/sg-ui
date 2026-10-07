# Batch 13 control-table inspection: U-17 / X-16

Outcome: evidence-only audit; no demonstrated in-scope product defect. U-17/X-16,
dynamic composition acceptance and manual/device/assistive-technology gates remain
open. No new behavior, story or test was manufactured.

## Isolation and scope

- Verified baseline: `b139a0d06fb06ba4a5a5aa6adc69c5cb3b206818`.
- Managed attached worktree: `/Users/thomashall/.codex/worktrees/batch13-control-table/sg-ui`.
- Branch: `codex/batch13-control-table`; draft PR [#43](https://github.com/Structured-Growth/sg-ui/pull/43) targets `codex/dev`.
- Exclusive write allowlist: `src/experimental/Table/`,
  `tests/browser/batch13-control-table.spec.ts`, this report.
- Actual change: this report only. Primary checkout and all other worktrees preserved.
- Inspected source/test head: exact baseline above. Initial report commit: `4fc123211dd2b5131c1af25c2cd8f7cb262c4767`. Final report commit SHA and
  attached PR URL are supplied to the coordinator at handoff; the final commit
  cannot include its own SHA.

Read the isolated root AGENTS.md and
[development validation policy](../react-aria-development-validation.md).
No nested AGENTS.md exists. No architecture change was needed.

## Evidence and scope mismatch

[Table](../../../src/experimental/Table/Table.tsx) is a set of native table element
wrappers. The [owned contract](../react-aria-remaining-controls.md#tables-and-pagination)
and [public mappings](../react-aria-primitives.md) explicitly describe a static
presentation table without another data-state engine. It accepts React children,
native refs, declared table associations, native styling and ARIA attributes.
It does not accept columns/rows collections, sort descriptors, selection state,
pending state or an empty-state renderer. Hosts can compose native structure and
owned controls; sorting/selection authority stays with the host.

Existing evidence inspected (not freshly executed):

| Evidence | Actual coverage | Limit |
| --- | --- | --- |
| [Colocated test](../../../src/experimental/Table/Table.test.tsx) | 1 test: table/cell refs, caption name, native table rather than grid, column/row scope, explicit headers and footer colspan | Static fixture; no dynamic or controlled composition |
| [Public primitive tests](../../../src/components/primitives/primitives.test.tsx) | 3 tests total, 1 includes public Table native ref and column scope in a Provider composition | Its rerenders exercise Collapse; they do not prove changing Table columns/rows |
| [Stories](../../../src/experimental/Table/Table.stories.tsx) | 2 exports: Default and ThemesAndDensity | No interactive or empty/pending composition |
| [Previous U-15 record](../react-aria-progress.md#owned-controls-and-first-catalog-migrations) | Records native table semantics alongside pagination checks | Pagination browser evidence is not dynamic Table browser evidence |

Source inspection found no caching, derived collection/state ownership or native
attribute filtering in these wrappers that demonstrated the assigned defect.
The CSS uses owned tokens, logical alignment and native table layout. This audit
neither establishes full requested combination coverage nor proves absence of all
defects. Adding collection APIs or redirecting edits into a grid would exceed this
assignment's demonstrated-defect rule and exclusive write allowlist.

## Validation and runtime

Read-only commands included `git rev-parse HEAD`, `git status --short`,
`git switch -c codex/batch13-control-table`, `rg --files -g AGENTS.md`,
`cat` of the implementation/tests/stories/contracts/development policy,
`rg -n 'U-17|X-16|Table|control-table'` across existing records,
`git log -5 --oneline -- src/experimental/Table`, and read-only inspection of
DataGrid collection/state implementation to identify the ownership boundary.
Report checks: local Markdown file/heading links and `git diff --check`.

Node queried: `v26.5.0`; pnpm executable: `/opt/homebrew/bin/pnpm`.
No dependency installation or runtime test was needed for this documentation-only
change. Newly executed unit/browser tests: 0. No full checks, Storybook/build,
consumer suite, browser launch or GitHub CI/title rerun/dispatch was performed.
No claim of Node 24, native browser or fresh current-head runtime validation.
No installation/light-validation slots or heavy/browser lock were acquired.
The existing browser priority queue was observed and left untouched.

## Exact follow-up scopes

1. If the intended collection control is DataGrid: assign
   `src/experimental/DataGrid/`, one dedicated browser spec and one unique report;
   inspect existing controlled sort/selection and collection tests before choosing
   one genuine uncovered defect. Catalog grid changes need their own explicit scope.
2. If Table host composition acceptance is intended: explicitly authorize a bounded
   composed fixture under `src/experimental/Table/` and a dedicated browser spec
   for changing columns/rows, host-controlled sort/selection, and native empty/pending
   row structure. This is missing acceptance evidence, not an established product
   bug. Preserve the static primitive contract and host state authority.

No shared guidance/checklist/barrel/config/workflow, license or notices changed.
No broad task IDs were closed; no merge, main change or publication occurred.
