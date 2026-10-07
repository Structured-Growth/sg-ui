# Batch 05: grid processing

## Task slice and ownership

G-04/G-08 processing audit only: null/date/number/text filters before ordered
sorting and pagination, full multi-sort tie stability, invalid values and immutable
host input. No interaction/controller/shell edits or broad acceptance closure.

- Baseline verified clean before edits: `cca9452f384d5ffaa34ad5bd4ddd015b43a2870b`.
- Managed, attached worktree: `/Users/thomashall/.codex/worktrees/batch05-grid-processing/sg-ui`.
- Branch: `codex/batch05-grid-processing`.
- Changed files: `src/components/AppDataGrid/ownedGridModel.test.ts` and this report.
- Implementation/test commit: `e77f604d44e38041b67aab5d9d37d6a1a0d85cd1`
  (`test: cover grid processing boundary and stability cases`).
- Final reporting commit: `docs: record batch05 grid processing evidence`; resolve
  its exact SHA with `git log -1 --format=%H -- docs/developer/parallel-batch-05/grid-processing.md`.
- Draft PR: [#15](https://github.com/Structured-Growth/sg-ui/pull/15), targeting `codex/dev`.

## Audit and result

Existing coverage already exercises every toolbar operator, search plus filters
before stable sorting/page slicing, null/invalid numeric exclusion for equality,
invalid date operands, UTC Date values, declared accessors/types and host server
order. No reproducible runtime processing defect was found.

Thirteen additional regressions cover demonstrably missing combinations:

- All six number comparisons exclude null, undefined, blanks, booleans, nonfinite
  numbers, malformed numeric strings, objects and arrays before descending sort
  and pagination. In particular, invalid values do not match `neq`.
- All five date comparisons cover leap-day boundaries, both directions of timezone
  offset day rollover, Date objects, invalid dates and timezone-less timestamps,
  then verify instant ordering, counts and a later page.
- Blank/null text differs from literal `null`; case-insensitive, trimmed criteria
  compose before natural descending text sorting, stable ties and page slicing.
- Frozen rows, column objects, criteria and pagination remain usable with numeric
  string ties, descending invalid-value ordering and a secondary text sort.
  Complete ties retain source order and returned rows retain host object identity.
  Date instants remain unchanged; server mode preserves the supplied order without
  applying search, filtering, sorting or a second page slice.

Runtime/API/operator semantics are unchanged. Existing stories and composed tests
remain applicable; no new interactive behavior or story change was required.

## Validation

Read repository `AGENTS.md`, [development validation](../react-aria-development-validation.md)
and [processing semantics](../react-aria-grid-contracts.md#state-authority-and-transactions)
before edits. All checks ran in the isolated worktree. No other checkout was edited.

- `pnpm install --frozen-lockfile`: passed, lockfile unchanged. Installation used
  host Node 26.5.0 and pnpm 10.29.3; pnpm reported its existing ignored esbuild build
  script warning. No dependency or script-policy changes were made.
- Test/guard runtime: Node **24.21.0**, pnpm **10.29.3** using the existing
  `/tmp/sgui-run24.mjs` launcher, which prepends the installed Node 24 binary to PATH.
- `node /tmp/sgui-run24.mjs exec vitest run src/components/AppDataGrid/ownedGridModel.test.ts src/components/AppDataGrid/ownedGridProcessing.test.tsx`:
  passed, **2 files / 51 tests**, 1.63 seconds (Vitest 4.1.11).
- `node /tmp/sgui-run24.mjs typecheck`: passed.
- `node /tmp/sgui-run24.mjs foundations:check`: passed.
- `git diff --check`: passed.
- Tested source tree is exactly implementation commit
  `e77f604d44e38041b67aab5d9d37d6a1a0d85cd1`; checks preceded its commit with
  the same test content. Only this report was added afterward.

No heavy build, fixed-port server, browser or packed-consumer process was needed,
so the shared heavy-validation lock was not acquired. Full check/Storybook/browser
and consumer matrices were intentionally not run under the targeted development
policy. Native/manual/device/assistive-technology behavior and Firefox were not
verified; this slice makes no new claims about them. G-08 menu/direction/clear-sort
and keyboard/touch affordances remain outside this processing-only assignment.
Broad G acceptance remains open.

## Next bounded task and central guidance

Next bounded slice: verify public header/toolbar multi-sort promotion, direction
indicators and clear-sort interactions with an applied secondary rule in a composed
public grid regression, owned by the coordinator's interaction assignment.

No central guidance change is required because no runtime contract changed. The
coordinator may link this evidence from the G-04/G-08 acceptance record, preserving
open interaction, native/device and assistive-technology work. No out-of-scope
processing fix is reserved.
