# Batch 13 review-1: bounded X-01/W-19/Z-13 review

Reviewed 2026-10-07. Accept the three exact heads below for their stated bounded
scope. No blocking regression was found in their diffs. This review neither merges
them nor closes product, native-engine, device or assistive-technology gates.

## Review ownership

- Verified starting commit: `b139a0d06fb06ba4a5a5aa6adc69c5cb3b206818`.
- One managed, attached worktree created before edits:
  `/Users/thomashall/.codex/worktrees/batch13-review-1/sg-ui`.
- Branch: `codex/batch13-review-1`; report draft PR base: `codex/dev`.
- Exclusive write allowlist: `docs/developer/parallel-batch-13/review-1.md`.
- All worker code, tests, shared guidance, configuration and workflows were read-only.
- Read AGENTS.md, the development validation policy, grid/toolbar contracts,
  batch01 focus and batch05 busy evidence, exact worker reports and existing tests.
  The explicit read-only assignment takes precedence over the generic implementation
  paragraph: no duplicate regressions or product changes were made.

## Exact heads and scope audit

| Worker | Baseline | Reviewed final head | PR | Decision |
| --- | --- | --- | --- | --- |
| grid-retry-focus | `d77132097bbe495b11c9fd9e2a4f047a1f03140d` | `15bfb533e9c49c00453cf4fc6f3af7dc810c404a` | [25](https://github.com/Structured-Growth/sg-ui/pull/25) | accept, bounded G-15/G-16 slice |
| grid-page-shrink | `d0fcc6298004ad23d1a75480b216b39142e6df96` | `8f79df3284a9786eb513b626ffe5daaee37e3a3e` | [38](https://github.com/Structured-Growth/sg-ui/pull/38) | accept evidence; G-05/H-16 completion remains incomplete |
| filter-draft-transactions | `d0fcc6298004ad23d1a75480b216b39142e6df96` | `194816039ab573938f32f25d826c7f93b65d3487` | [35](https://github.com/Structured-Growth/sg-ui/pull/35) | accept, bounded G-09/U-07 audit |

All PRs were open drafts targeting `codex/dev`, with exactly those head SHAs at
review time. All three worker worktrees were clean at the matching final heads.
Every changed path is within its supplied exclusive allowlist; fewer allowed
files changed in the two test-only tasks. No licensing, package, export, workflow,
translation or public API changes occur in these diffs.

Retry changed exactly its report, `ownedGridInteraction.tsx`, its colocated test
and story, and `tests/browser/batch08-grid-retry-focus.spec.ts` (5 files).
Page shrink changed exactly its report, `ownedGridController.test.ts`,
`ownedGridState.test.ts` and `ownedGridPageShrink.test.tsx` (4 files).
Filter changed exactly its report and `DataToolbarFilterMenu.test.tsx` (2 files).

## Regression and validation assessment

### Retry focus: accept

The implementation adds separate status focus ownership across the entire root,
which includes retained-row status outside the scrolling container. Removed Retry
focus enters a body cell or empty header control using `preventScroll`. Cancellable
frames compensate for collection and React Aria keyboard scrolling; deferred
writes check current focus ownership. Deliberate host/independent-grid focus clears
ownership. Existing cell/page repair, native host refs and host retry/state authority
remain intact. The host-state story covers the changed behavior.

The four added unit cases cover retained/empty rows, pending/success/callback removal,
stable entry, both scroll axes, selection/callback isolation and outside focus.
Four native cases per engine additionally activate Retry with Enter, assert
positive horizontal scrolling (and positive vertical scrolling for retained rows),
stable entry identity, busy isolation, retained selection and outside ownership.
The ArrowRight assertion only proves focus remains in the grid; it does not prove
a particular cell transition. This is adequate for the disappearing-trigger slice,
with existing grid navigation coverage preserved.

Worker evidence in [the exact report](../parallel-batch-08/grid-retry-focus.md):

- Runtime Node 24.21.0, pnpm 10.29.3, React 19.2.3, RAC 1.21.1,
  Vitest 4.1.11, Playwright 1.63.0, macOS arm64.
- Targeted baseline regression: 2 failed/2 passed/19 skipped; final 4 passed/19 skipped.
- `pnpm exec vitest related --run src/components/AppDataGrid/ownedGridInteraction.tsx`:
  72 tests / 8 files passed; source typecheck, browser TypeScript, foundation and
  token checks passed.
- Fresh `pnpm build-storybook` and
  `pnpm exec playwright test tests/browser/batch08-grid-retry-focus.spec.ts --project chromium --project webkit`:
  Chromium 4/4 and WebKit 4/4 passed in 8.2 seconds at
  `a887cc06237bf3e677efff0b0529aa0759b1a5a7`.

Git confirms that tested implementation head differs from reviewed final head only
by the report. The retained `/tmp/sgui-batch08-grid-retry-focus-browser.log` shows
8 passed (8.2s); the Storybook log records a successful Vite build. Those logs
corroborate outcomes, while tested-head attribution comes from the worker report
and source identity. No fresh execution was performed by this reviewer.
Earlier native failures were fixed and documented, not waived. Firefox remains
unverified here; no repeated unchanged launch attempt is warranted.

### Page shrink: accept evidence, product acceptance incomplete

Thirteen new cases (eight state, two controller, three composed) distinguish total
replacement from transactions, latest known/invalid/unknown totals, callback-only
local commits, controlled rejection/acceptance, callback ordering and retained IDs.
The composed fixture uses real controller, processor and footer normalization;
it explicitly supplies host totals and does not pretend to be the public shell.
Source inspection confirms the report's gap: client processing uses the requested
page, while footer normalization may display a smaller page after dataset shrink.
The task introduces no runtime defect and appropriately reserves the missing fix.

[Worker report](../parallel-batch-11/grid-page-shrink.md) records Node 24.21.0,
pnpm 10.29.3, Vitest 4.1.11, React 19.2.3; frozen install passed without manifest
changes. Commands via `node /tmp/sgui-run24.mjs`:

- `exec vitest run` on controller/state/page-shrink/model/footer tests:
  86 tests / 5 files passed, including all 13 new cases.
- `exec vitest run` on AppDataGrid/AppDataGridShell tests:
  23 tests / 2 files passed.
- `typecheck` and `git diff --check`: passed.

This final head is one commit containing tests and report; its clean worker tree
matches the reviewed head. Validation is reported against that committed tree,
not independently rerun here. No changed runtime/story/native behavior requires
a duplicate browser build for this evidence-only PR.

### Filter transactions: accept

Five added cases cover controlled criteria replacement while open, Cancel/reopen,
live field removal/type change, option relabel/reorder retaining canonical IDs,
single Enter/Space Apply requests without host form submission, host rejection,
and keyboard All for a negated enum. Assertions inspect real payloads and draft
input identity; they complement existing nested Escape, row identity/focus and
shell transaction tests. No runtime changes or new native timing claims occur.

[Worker report](../parallel-batch-11/filter-draft-transactions.md) records Node
24.21.0, pnpm 10.29.3, Vitest 4.1.11; frozen install and typecheck passed.
`pnpm exec vitest run src/components/DataToolbar/components/DataToolbarFilterMenu.test.tsx src/components/DataToolbar/filterRuleValue.test.ts src/components/DataToolbar/DataToolbar.test.tsx`
passed 18 tests / 3 files, including five additions. Git confirms full tested
commit `527c8f60f37ddfc4d4b1a26fb7057171d5c25acb` differs from the reviewed final
head only by its report. These are jsdom transaction assertions, not native or
spoken announcement acceptance. No implementation defect was demonstrated.

## Reviewer commands and limits

Reviewer runtime: Apple Git 2.54.0, Python 3.9.6, gh 2.95.0. No dependency
installation, Vitest, browser, Storybook, full suite or packed consumer run occurred;
the read-only/doc assignment needs source/evidence review, not duplicated checks.
No shared validation lock or install/light slot was acquired or changed.

- `git rev-parse HEAD`, `git status --short`, `git switch -c codex/batch13-review-1`:
  verified baseline/clean tree and established isolated branch before report edits.
- `git diff --stat`, `git diff`, `git diff --name-status` for each baseline/head:
  all changed-file lists and full patches inspected; scope audit passed.
- `git log --format='%H %s' <baseline>..<head>` and
  `git diff --name-only <tested-head> <final-head>`: validation tree identities
  checked as described above.
- `git show <exact-head>:<source-or-test-path>`: exact worker source/tests inspected.
- `git diff --check <baseline> <head>`: exit 0 for each worker.
- `gh pr view <25|38|35> --json number,url,headRefOid,baseRefName,isDraft,state`:
  exact open draft/base/head verified; no CI polling, rerun or dispatch.
- `git -C <worker-worktree> status --short` and `rev-parse HEAD`:
  all three clean final heads confirmed.
- `rg` over retained Retry browser/Storybook logs: outcomes corroborated.

This evaluates exact worker patches, not conflict resolution on a future combined
head. Coordinator must review any integration conflict and run affected checks if
resolution or interaction creates a concrete concern. No merge/main/publish,
permissions/secrets changes or broad gate closures are authorized by this record.

## Bounded follow-ups

1. Client page shrink integration: reserve ownedGridModel, AppDataGrid,
   AppDataGridShell, their tests and changed-state stories plus one report. Define
   coherent processed/footer display after shrink while preserving controlled
   requested criteria and host rejection; use computed client total for navigation
   without inferring server totals. Cover list/cards, zero rows and selection.
   Add focused native evidence if page-entry focus/scroll changes.
2. Enum ID policy: reserve filter menu, shared parser, grid filter processing,
   their tests/stories and one contract record. Decide removed-option behavior and
   supported ID domain before changing trimmed/unescaped `|||` serialization;
   preserve host payload authority. Existing behavior is a policy prerequisite,
   not an introduced blocker to this test-only PR.
3. Retry announcement acceptance: named screen-reader/browser verification of
   retained/empty pending/error/success and disappearing Retry, including speech
   under empty-table aria-busy. Automated DOM results cannot close this task.
4. Firefox/browser pool repair stays with its assigned owner. Required engine,
   physical-device, React 18 packed consumer and broad G/U/X/R/Z acceptance remain
   open; this review does not change their requirements.

The coordinator completion message supplies this report commit and draft PR URL.
