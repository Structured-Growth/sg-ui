# Batch 13: control pagination

Task slice: U-17/G-05, partial evidence only. Broad task IDs remain open.

- Chat: `01a116b1-4545-7dd1-a57f-437edba7de83`.
- Verified baseline before edits: `b139a0d06fb06ba4a5a5aa6adc69c5cb3b206818`.
- One managed, attached worktree: `/Users/thomashall/.codex/worktrees/batch13-control-pagination/sg-ui`.
- Branch: `codex/batch13-control-pagination`.
- Tested implementation head: `444566badda0ce02401dbcfcd42a1da9014a2b93`.
- Draft PR: [#57](https://github.com/Structured-Growth/sg-ui/pull/57), base `codex/dev`.
- A subsequent report-only commit records this evidence; final delivery supplies
  its exact head since this report cannot embed its own commit hash.

## Inspection and demonstrated defect

Read AGENTS.md, [targeted validation policy](../react-aria-development-validation.md),
[card pagination contracts](../react-aria-card-pagination.md),
[pagination state contracts](../react-aria-pagination-state.md), master task IDs,
existing Pagination and card-consumer tests/stories, and the previous
[grid shell state report](../parallel-batch-05/grid-shell-state.md).

Existing tests already cover unknown and zero totals, first/previous/next/last
boundaries, disabled controls, controlled host rejection, page-zero-before-size
requests, atomic size callbacks, translation forwarding and consumer SSR.
Those behaviors were not reimplemented or duplicated.

One unfinished combination was demonstrated: an unknown-total controlled view
with rejected size requests and unsafe suggested size values. Pagination used
Number.isInteger, which offered 9007199254740992 even though the pagination model
contract supports positive safe integers. The new regression failed before the
fix: expected three valid options, received a fourth unsafe option. Seven existing
Pagination tests passed in that red run.

The filter now uses Number.isSafeInteger. Positive custom current sizes and
Number.MAX_SAFE_INTEGER remain selectable; duplicates, fractional, zero, negative,
nonfinite and unsafe options are excluded. The regression requests size 250,
asserts ordered callbacks page:0 then size:250, and confirms rejected requests
retain page 3 and size 10 with no invented Last page. The changed-state story
SafeSizesWithHostRejection exposes the same controlled configuration.
No public names, callback shapes, native refs, translation strings or host
ownership changed; this corrects invalid numeric choices without a breaking API.

## Allowlist and actual writes

Exclusive authorized write paths:

- `src/experimental/Pagination/`
- `tests/browser/batch13-control-pagination.spec.ts`
- `docs/developer/parallel-batch-13/control-pagination.md`

Actual writes are Pagination.tsx, Pagination.test.tsx, Pagination.stories.tsx
inside that directory, and this report. No browser file was needed. All source,
barrels, configuration, guides, checklists and workflows outside the allowlist
remained read-only. No licensing changes or dependency/lockfile changes.

## Local validation

Runtime: Node 24.21.0, pnpm 10.29.3, React 19.2.3, Vitest 4.1.11.
Commands below used `node /tmp/sgui-run24.mjs` before the pnpm arguments to select
the existing Node 24 runtime. Targeted checks follow the user replacement policy;
no full pnpm check or Storybook build was run.

- `pnpm install --frozen-lockfile`: passed; lockfile unchanged. Atomic install
  slot0 under `/tmp/sgui-install-slots` was claimed with owner
  `control-pagination-01a116b1` and released only after matching the owner.
- Before fix: `pnpm exec vitest run src/experimental/Pagination/Pagination.test.tsx --maxWorkers=1`:
  1 failed / 7 passed, expected unsafe-option regression.
- After fix: `pnpm exec vitest run src/experimental/Pagination/Pagination.test.tsx src/components/CardPaginationFooter/CardPaginationFooter.test.tsx src/components/CardCollectionWithFooter/CardCollectionWithFooter.test.tsx --maxWorkers=1`:
  3 files / 21 tests passed, including the new regression.
- `pnpm typecheck`: passed, including the changed-state story.
- `pnpm foundations:check`: passed.
- `pnpm tokens:check`: passed.
- `git diff --check`: passed.

Light checks used atomic slot1 under `/tmp/sgui-light-validation-slots`, with the
same unique owner token and owner-matched release. Initially queued until a slot
was available; queued work was not reported as passed. No shared heavy lock or
browser pool was acquired, no worker was interrupted, and no Firefox retry ran.

Logs: `/tmp/batch13-control-pagination-red.log`,
`/tmp/batch13-control-pagination-green.log`,
`/tmp/batch13-control-pagination-types.log`,
`/tmp/batch13-control-pagination-foundations.log`,
`/tmp/batch13-control-pagination-tokens.log`.
The green run exercised exactly the source committed at the tested implementation
head. Only this report was added afterward.

## Limits and exact follow-ups

The change is numeric option filtering, with no native timing, layout, focus,
positioning or scrolling change. No fresh browser, physical-device, AT, full
suite, build, React 18 packed consumer or broad U-17/G-05 acceptance is claimed.
Existing native boundary evidence is not a new browser pass for this revision.
GitHub dev CI/title checks remain paused; none were awaited, rerun or dispatched.
No merge, publication, permission or secrets changes.

Optional next bounded task: review controlled direct Pagination with page > 0
when pageCount becomes zero, in `src/experimental/Pagination/` and a dedicated
browser file, after defining stale host-page display/navigation authority.
This slice did not change page clamping or claim dataset-shrink completion.
Any central U-17/G-05 progress links belong to the coordinator; no outside-scope
guide or checklist write is needed for this correction.
