# Batch 08: grid Retry focus (G-15/G-16)

## Ownership and implementation

- Exact baseline verified before edits: `d77132097bbe495b11c9fd9e2a4f047a1f03140d`.
- Managed attached worktree: `/Users/thomashall/.codex/worktrees/batch08-grid-retry-focus/sg-ui`.
- Branch: `codex/batch08-grid-retry-focus`.
- Implementation/code/test head: `a887cc06237bf3e677efff0b0529aa0759b1a5a7`.
- Draft PR against `codex/dev`: [#25](https://github.com/Structured-Growth/sg-ui/pull/25).
- Final report head is recorded in the coordinator completion message after this report commit.

Exclusive changed files:

- `src/components/AppDataGrid/ownedGridInteraction.tsx`
- `src/components/AppDataGrid/ownedGridInteraction.test.tsx`
- `src/components/AppDataGrid/ownedGridInteraction.stories.tsx`
- `tests/browser/batch08-grid-retry-focus.spec.ts`
- `docs/developer/parallel-batch-08/grid-retry-focus.md`

Read the repository instructions, development validation policy, integrated
[batch05 busy record](../parallel-batch-05/grid-busy.md),
[batch01 focus record](../parallel-batch-01/grid-focus.md) and batch05 processing
validation/limits before implementation. Batch05's native Retry case explicitly
refocused the grid after activation, leaving disappearing-trigger focus uncovered.
The new unit regression failed for both retained and empty rows: active focus was
the document body after host pending state removed Retry.

The interaction tracks status focus within its whole owned root, including retained
status outside the scroll container. If a focused status control disappears, it
enters the first body text cell, or the first text header’s enabled control (header fallback) for an empty collection,
with `preventScroll`. Empty-state collection commits are rechecked in a cancellable
animation frame; deliberate host/other-grid focus ends ownership before repair.
The initial native run found React Aria keyboard focus scrolls after the native
`preventScroll` call, and empty headers route focus to their sort control. The
interaction enters that enabled control directly and preserves container scroll
through the passive-effect keyboard scroll frame, keeping its snapshot across
collection commits. Every deferred write checks that the repaired entry still
owns focus; frames cancel on subsequent commits/unmount and outside focus clears
the snapshot. Ordinary cell/row focus repair stays in its existing owner. No public API, status
semantics, retry/state authority, row identity or selection changes. No other
checkout or out-of-allowlist file was edited.

`RetryFocus` is a host-state story, with two grids and keyboard shortcuts for empty
rows, failure, pending, success and callback removal. Native browser cases cover
keyboard Retry, host transitions, disappearing callbacks, entry identity,
container scroll, selected row retention and deliberate host/independent focus.

## Validation

All validation uses Node **24.21.0**, pnpm **10.29.3**, React **19.2.3**,
React Aria Components **1.21.1**, Vitest **4.1.11**, Playwright **1.63.0**, macOS arm64.
Commands below prepend
`PATH=/Users/thomashall/.npm/_npx/387698761821791d/node_modules/node/bin:$PATH`.

- `pnpm install --frozen-lockfile`: passed; unchanged lockfile/dependencies. Existing ignored esbuild build-script warning; actual build outcome recorded below.
- `pnpm exec vitest run src/components/AppDataGrid/ownedGridInteraction.test.tsx -t 'Retry focus ownership|disappearing Retry'`: baseline 2 failed/2 passed/19 skipped; final 4 passed/19 skipped.
- `pnpm exec vitest related --run src/components/AppDataGrid/ownedGridInteraction.tsx`: **72 passed in 8 files**, source tree identical to implementation head above.
- `pnpm typecheck`: passed.
- `pnpm exec tsc --noEmit -p tests/browser/tsconfig.json`: passed.
- `pnpm foundations:check`: passed.
- `pnpm tokens:check`: passed.
- `git diff --check`: passed.

- `pnpm build-storybook`: passed from final implementation head above; log
  `/tmp/sgui-batch08-grid-retry-focus-storybook.log`. Fresh rebuilds followed each
  demonstrated native defect and ran only after the preceding suite exited.
- `pnpm exec playwright test tests/browser/batch08-grid-retry-focus.spec.ts --project chromium --project webkit`:
  final **8/8 passed** (Chromium 4/4, WebKit 4/4), **8.2 seconds**, on
  `a887cc06237bf3e677efff0b0529aa0759b1a5a7`. Final log
  `/tmp/sgui-batch08-grid-retry-focus-browser.log`; ignored native artifacts under
  `artifacts/`. Initial run at `760b602` was 4 failed/4 passed (scroll and empty
  entry); refinements at `b3b3455` and `f80ae82` were 2 failed/6 passed (retained
  keyboard scroll), before the final passing frame repair. These failures were
  fixed, not waived. Initial/refinement logs are preserved in `/tmp/sgui-batch08-grid-retry-focus-browser-{initial,refinement,pre-frame}.log`.
- Browser TypeScript passed after the final browser-spec edit at `b3b3455`; that
  spec is unchanged at final implementation head. Related unit tests, source
  typechecking and foundation/token guards passed again for the final source.

All heavy builds, diagnostics and native runs held the atomic directory lock
`/tmp/sgui-parallel-batch-01-validation.lock`, owner
`01a1167a-e25f-7c62-a2b4-126127c725ab`. Existing owners were respected. The worker
released only its own lock using Python owner comparison after the final suite
exited. No suite-time rebuild, other-worker termination, Firefox reinstall/TMPDIR
experiment, full check, full suite or packed-consumer run. Firefox was not rerun
locally because its unchanged macOS profile-launch diagnosis is separately
assigned; required Firefox/production matrix remains incomplete and unchanged.
GitHub dev checks were neither awaited nor dispatched under the coordinator's
human-authorized pause. No workflow files were changed.

## Limits and next bounded task

This is automated focus/scroll and DOM-state evidence, not spoken assistive-
technology evidence. Named screen-reader/browser verification for pending/error/
success with retained and empty collections remains manual and open, as do physical
devices, React 18 packed consumers and broad G/U/X/R/Z acceptance. Firefox macOS
profile-launch diagnosis is assigned separately; no repeated installation/TMPDIR
experiments or reduced engine requirement belongs to this slice.

Next bounded task: actual named screen-reader/browser Retry and announcement
verification for retained and empty grids, including whether empty status inside
an `aria-busy` table delays speech. Do not close G-15/G-16 from this automated slice.

Coordinator central-guidance suggestions (outside this allowlist): link this
record from grid/browser acceptance evidence, document status Retry disappearance
entry and `preventScroll` ownership, retain manual/device/AT gates and separate
browser-runtime failures from product failures. No outside product fix is reserved.
