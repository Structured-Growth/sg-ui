# Grid page shrink: bounded G-05/H-16 evidence

Baseline: `d0fcc6298004ad23d1a75480b216b39142e6df96`.
Worktree: `/Users/thomashall/.codex/worktrees/batch11-grid-page-shrink/sg-ui`.
Branch: `codex/batch11-grid-page-shrink`; draft PR targets `codex/dev`.
This task adds regression evidence, without changing runtime behavior or closing
G-05/H-16 or broader acceptance gates.

## Contract and existing coverage

The [catalog integration](../react-aria-catalog-grid.md) gives each concern an
independent owner. Controlled values remain authoritative until the host accepts
requests. Pagination callbacks precede one combined snapshot. The
[grid contracts](../react-aria-grid-contracts.md) preserve server rows and leave
request cancellation, stale responses and data reconciliation with the host.
The [pagination contract](../react-aria-card-pagination.md) explicitly normalizes
footer display without emitting a callback. Its coherent client slicing guarantee
applies to CardCollectionWithFooter; it does not establish that guarantee for
AppDataGrid. H-16 still includes disappearing rows in the
[master task list](../react-aria-master-task-list.md).

Before this task, ownedGridState covered a static known total and unknown-total
forward/backward requests. ownedGridController covered independent control and
page-size option replacement, but no changing totals. ownedGridModel covered
server pass-through and counts. Footer tests covered a static out-of-range host
page and display-only normalization. None composed dataset replacement, retained
nonzero criteria, displayed clamping and host rejection/acceptance.

The added tests establish these distinctions:

- A changed total alone neither dispatches a transaction nor accepts a new page.
  This differs from existing page-size option normalization.
- An explicit page/atomic pagination request uses the latest valid nonnegative
  safe-integer total supplied to the controller, including zero and exact page
  boundaries. Invalid/omitted totals do not become inferred loaded-row counts.
- Callback-only pagination commits locally; controlled pagination emits a bounded
  requested snapshot while retaining the host value. A host rerender accepting
  that snapshot changes the processed page without another callback.
- Footer display can clamp independently of controller and processor pagination.
  Display clamping is neither a transaction nor host acceptance.
- Server rows pass through known-to-unknown total changes unchanged. Unknown-total
  navigation uses hasNextPage and never treats loaded-page length as a total.
- Retained selection IDs survive shrink, zero totals and page requests; a missing
  row is not a deletion reconciliation signal.

## Remaining integration gap and next bounded task

Client row processing retains the requested page even after its complete dataset
shrinks. The footer displays the last available page, so the two can diverge
until the host reconciles pagination. For example, page 3 / size 10 with 41 rows,
then replacement by 11 rows, retains processor page 3 while display uses page 1.
AppDataGrid does not supply its computed client count back to its controller;
without an explicit host rowCount, a page request is not bounded by that computed
count either. The controller intentionally owns neither rows nor processing output.

Reserve a follow-up allowing ownedGridModel, AppDataGrid, AppDataGridShell and
changed-state stories: define coherent client display slicing after shrink, while
preserving requested controlled criteria and host rejection, and reconcile footer
navigation with the computed client total. Distinguish display normalization from
an automatic correction request; do not invent automatic controlled acceptance or
infer a server total from loaded rows. Add public list/cards regressions and native
focus/scroll evidence only if that implementation changes page-entry behavior.
No processing, shell, interaction or persistence source was edited here.

## Validation

Node `24.21.0`, pnpm `10.29.3`, Vitest `4.1.11`, React `19.2.3`.
`/tmp/sgui-run24.mjs` prepends the installed Node 24 binary to PATH before pnpm.

- `node /tmp/sgui-run24.mjs install --frozen-lockfile`: passed; reused 608 packages,
  no manifest or lockfile changes. pnpm reported the existing ignored esbuild
  build script; no approval configuration was changed.
- `node /tmp/sgui-run24.mjs exec vitest run src/components/AppDataGrid/ownedGridController.test.ts src/components/AppDataGrid/ownedGridState.test.ts src/components/AppDataGrid/ownedGridPageShrink.test.tsx src/components/AppDataGrid/ownedGridModel.test.ts src/components/CardPaginationFooter/CardPaginationFooter.test.tsx`:
  passed, 5 files / 86 tests, including 13 new cases.
- `node /tmp/sgui-run24.mjs exec vitest run src/components/AppDataGrid/AppDataGrid.test.tsx src/components/AppDataGridShell/AppDataGridShell.test.tsx`:
  passed, 2 files / 23 existing public composition tests.
- `node /tmp/sgui-run24.mjs typecheck`: passed.
- `git diff --check`: passed.

Test-only and evidence changes do not alter stories, exports, styling, native
focus/timing or runtime source. No heavy build/browser process or shared lock was
needed. Full checkpoint, browser matrix, packed React 18/19 consumers, device and
assistive-technology acceptance remain unverified by this task. GitHub dev CI/title
runs remain user-paused; no dispatch, rerun or workflow change occurred. Follow the
central [development validation policy](../react-aria-development-validation.md)
for integration and later full acceptance.
