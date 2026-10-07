# Batch 05: grid clipboard (G-21 bounded slice)

## Ownership and delivery

- Chat: `01a11673-d03b-7653-8c82-6d3dec436862`.
- Verified baseline: `cca9452f384d5ffaa34ad5bd4ddd015b43a2870b`, clean before edits.
- Managed worktree: `/Users/thomashall/.codex/worktrees/batch05-grid-clipboard/sg-ui`.
- Branch: `codex/batch05-grid-clipboard`.
- Draft PR: [#18](https://github.com/Structured-Growth/sg-ui/pull/18), against `codex/dev`.
- Implementation commit: `47a62f18f7c72c8198b5cf4298d30a3e25320392`.
- Additional test commits: `b860536` (distinct instance expirations), `e39e694`
  (context-specific native denial), and final implementation/test head
  `07e514ec86fb4d6bb7025a9ae1cd1f349b3fc82f` (public row IDs and explicit
  Chromium clipboard grants). The final report-only commit follows that head.
- Primary checkout and other workers' checkouts were preserved. No merge or
  publication occurred. Only allowlisted repository files changed.

Changed files:

- `src/components/AppDataGrid/ownedGridCells.tsx`
- `src/components/AppDataGrid/ownedGridCells.test.tsx`
- `src/components/AppDataGrid/ownedGridCells.stories.tsx`
- `src/components/AppDataGrid/components/table-cell/CopyableTableCell.test.tsx`
- `tests/browser/batch05-grid-clipboard.spec.ts`
- `docs/developer/parallel-batch-05/grid-clipboard.md`

## Behavior and evidence

The baseline retained success/error messages indefinitely. A second defect allowed
late success after changing a copyable em dash to an unavailable value with the
same displayed fallback. New regressions fail against the exact baseline for both
behaviors; the final implementation passes them.

Each copy cell now owns a three-second feedback timer. A new attempt restarts its
lifetime; value/availability replacement and unmount clear its timer and invalidate
pending results. Existing owned translated messages, polite atomic status regions,
compact buttons and token-based focus styling remain in use. The implementation
never moves focus. Unrelated cells retain independent pending and feedback state.

Unit/composed tests cover Enter/Space, exact HTML-like text and formatted JSON,
translation fallback/overrides, distinct feedback expirations, repeated attempts,
value replacement, settled/pending unmount cleanup, late rejection, unchanged
fallback availability transitions, and completion after focus moves to a host action.
The existing public-grid composed test also verifies copy does not select its row.

`ClipboardFeedback` adds a public grid with escaped text, formatted JSON and an
unavailable value, plus an independent public wrapper, replacement/unmount controls
and an owned textarea for native paste verification. Browser tests use real keyboard
activation, native clipboard writes and native paste; they check complete bytes,
visible token-based focus, retained focus, unchanged selection, bounded feedback,
and absence of injected image/script elements. Chromium success explicitly grants
clipboard permissions; native rejection explicitly denies clipboard-write in that
test's browser context. Deterministic API rejection is separately identified.

## Validation (2026-10-07)

Runtime: bundled Node `v24.19.0`, pnpm `10.29.3`, React `19.2.3`, Playwright
`1.63.0`, macOS. Prefix Node 24 commands below with
`PATH=/Users/thomashall/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH`.
Frozen dependency installation used the host Node `v26.5.0`; later validation used
Node 24. Installation changed no tracked dependency files.

| Command | Outcome / tested state |
| --- | --- |
| `pnpm install --frozen-lockfile` | Pass; dependencies needed in the new worktree. |
| `pnpm exec vitest run src/components/AppDataGrid/ownedGridCells.test.tsx -t 'bounds translated\|empty value keeps'` with only implementation restored temporarily to baseline | Expected failure: both targeted regressions fail; implementation restored in Python `finally`. Log `/tmp/sgui-batch05-grid-clipboard-baseline.log`. |
| `pnpm exec vitest run src/components/AppDataGrid/ownedGridCells.test.tsx src/components/AppDataGrid/components/table-cell/CopyableTableCell.test.tsx src/components/AppDataGrid/AppDataGrid.cells.test.tsx` | Pass: 3 files, 19 tests; final unit state committed in `b860536`; runtime 1.16s. |
| `pnpm typecheck` | Pass, including final code/test head `07e514e`. |
| `pnpm foundations:check` | Pass: owned import/layer/token boundaries. |
| `pnpm tokens:check` | Pass. |
| `pnpm exec tsc --noEmit -p tests/browser/tsconfig.json` | Pass; also repeated by every focused browser command. |
| `pnpm build-storybook` | Pass: fresh source at `e39e694`, Vite 30.23s. Existing directive/sourcemap/chunk-size warnings. Log `/tmp/sgui-batch05-grid-clipboard-storybook.log`. |
| `pnpm test:browser tests/browser/batch05-grid-clipboard.spec.ts` (initial spec) | Stopped own run after wrong numeric row locators failed; public row IDs corrected. No rebuild during suite. |
| `pnpm test:browser tests/browser/batch05-grid-clipboard.spec.ts --project=chromium --project=webkit` | 5 passed, 1 intentionally skipped, 2 Chromium success failures from absent permission grants; corrected success context permissions. 39.4s. Log `/tmp/sgui-batch05-grid-clipboard-browser-fixed.log`. |
| `pnpm test:browser tests/browser/batch05-grid-clipboard.spec.ts` at `07e514e` | Chromium 4/4 pass; WebKit 3 pass and Chromium-only denial intentionally skipped. Firefox 4 launch failures before any page opened. Total 7 pass, 1 skip, 4 environment failures; 42.0s. Log `/tmp/sgui-batch05-grid-clipboard-browser-final.log`. |
| `TMPDIR=/tmp pnpm test:browser tests/browser/batch05-grid-clipboard.spec.ts --project=firefox` at `07e514e` | Same 4 pre-page launch failures: `Could not find profile folder`. No product behavior verified. Log `/tmp/sgui-batch05-grid-clipboard-firefox-tmp.log`. |
| `git diff --check` | Pass. |

Heavy build and browser processes held the atomic directory lock
`/tmp/sgui-parallel-batch-01-validation.lock` with this chat ID in `owner`. Cleanup
used Python and removed only the matching owner lock after all own processes ended.
No full check, consumer suite or unrelated browser suite was run.

## Limits and next work

G-21 remains open as a broad gate. Firefox remains required in Linux CI; local
launch failure matches the existing [browser acceptance limitation](../react-aria-browser-acceptance.md).
Chromium permission denial is native; WebKit/Firefox permission-denial feedback
has deterministic API coverage in the spec rather than native permission control.
Actual screen-reader announcement quality, OS permission dialogs, physical touch
and device clipboard behavior remain unverified. Native paste here is into a host
textarea; grid clipboard paste remains a separate deferred feature.

Proposed next bounded task: validate this focused spec on Linux Firefox, then
perform screen-reader review of multiple independent copy status regions and
repeated success/error announcements. Do not close the broad G/U/X/R/Z gates.

Coordinator guidance updates (out of this worker's allowlist): add the three-second
feedback/availability invalidation contract and evidence to the copyable row in
`react-aria-grid-cell-acceptance.md`, link the new story/spec from browser acceptance,
and record this partial G-21 evidence without checking off the whole task. No new
public API or breaking mapping requires an AGENTS.md contract change.
