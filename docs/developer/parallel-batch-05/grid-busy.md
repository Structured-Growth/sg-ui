# Batch 05: grid-busy completion record

## Task slice and ownership

G-15/G-16: repair the dropped native `aria-busy` state, with retained-row
pending/error/retry DOM announcements, duplicate-mutation checks, native focus
and scroll retention, and independent-grid isolation. This is a bounded slice;
broad grid and assistive-technology acceptance remains open.

- Baseline verified before edits: `cca9452f384d5ffaa34ad5bd4ddd015b43a2870b`.
- Managed worktree: `/Users/thomashall/.codex/worktrees/batch05-grid-busy/sg-ui`.
- Branch: `codex/batch05-grid-busy`.
- Implementation and final code/test commit: `3219f168429cbadcc6d8300aa3a3a72490a1bda1`.
- Completion record is a separate documentation commit; the coordinator delivery
  records the resulting final branch head.
- Draft PR against `codex/dev`: [PR 19](https://github.com/Structured-Growth/sg-ui/pull/19).

Changed files (exclusive allowlist):

- `src/components/AppDataGrid/ownedGridInteraction.tsx`
- `src/components/AppDataGrid/ownedGridInteraction.test.tsx`
- `src/components/AppDataGrid/ownedGridInteraction.stories.tsx`
- `tests/browser/batch05-grid-busy.spec.ts`
- `docs/developer/parallel-batch-05/grid-busy.md`

No primary checkout or other worker checkout edits. No API changes, acceptance
checkbox closures, licensing/workflow changes, merges or publication.

## Implementation and evidence

A new regression failed on the baseline implementation: the native table had no
`aria-busy` attribute while `loading` was true, despite the JSX prop. React Aria
Table filters this attribute. The owned bridge initializes the actual table
before exposing its host ref and synchronizes after commits. It sets `true` for
loading/refreshing and removes the attribute after those host flags clear. It
avoids writing an unchanged value and supports React Aria table replacement when
reorder is toggled. It preserves the existing precedence and host-owned retry
contract, including busy state being independent of an error message.

Unit/composed coverage verifies retained rows, a single nonempty status message,
polite/atomic pending and assertive error semantics, no pending content mutations
on unrelated renders, a single retry callback, host authority over the subsequent
pending state, another grid's focus, Strict Mode/ref initialization, empty pending
tables and no redundant busy mutations. Browser coverage exercises native focus,
positive scrolling on both axes, stable cell identity, retained rows through
success, error/retry transitions and independent grids. Existing empty/no-results
and focus repair cases remain covered by affected tests. The new BusyLifecycle
story provides host state shortcuts without simulated network work.

## Validation

Runtime: Node **24.21.0**, pnpm **10.29.3**, React **19.2.3**,
React Aria Components **1.21.1**, Playwright **1.63.0**, macOS arm64.
Node 24 is available at
`/Users/thomashall/.npm/_npx/387698761821791d/node_modules/node/bin/node`.
For every command below after installation, prepend
`PATH=/Users/thomashall/.npm/_npx/387698761821791d/node_modules/node/bin:$PATH`.
The frozen dependency installation and initial failing reproduction used the
host's Node 26.5.0; all passing validation below used Node 24.

Commands and outcomes:

- `pnpm install --frozen-lockfile`: passed, unchanged lockfile. pnpm reported
  ignored esbuild build scripts; the subsequent actual Storybook build passed.
- `pnpm exec vitest run src/components/AppDataGrid/ownedGridInteraction.test.tsx -t 'native busy|one retained-row'`:
  baseline reproduction, 1 failed/1 passed/16 skipped. Failure was the absent
  native busy attribute.
- `pnpm exec vitest run src/components/AppDataGrid/ownedGridInteraction.test.tsx src/components/AppDataGrid/ownedGridParts.test.tsx`:
  24 passed before the additional Strict Mode/mutation regression.
- `pnpm exec vitest related --run src/components/AppDataGrid/ownedGridInteraction.tsx`:
  **68 passed across 8 affected files**, including the final additional regression.
- `pnpm typecheck`: passed after the final source/story/test edits.
- `pnpm exec tsc --noEmit -p tests/browser/tsconfig.json`: passed.
- `pnpm foundations:check`: passed; repeated on the committed implementation.
- `pnpm tokens:check`: passed; repeated on the committed implementation.
- `git diff --check`: passed.
- `pnpm build-storybook`: passed, fresh static Storybook from the final code;
  log `/tmp/sgui-batch05-grid-busy-storybook.log`.
- `pnpm exec playwright test tests/browser/batch05-grid-busy.spec.ts`:
  **Chromium 2/2 and WebKit 2/2 passed** at code head
  `3219f168429cbadcc6d8300aa3a3a72490a1bda1`.
  **Firefox 0/2 executed**: both launch attempts exited before a test body,
  `Could not find profile folder`. Overall command exit **1**, 4 passed and
  2 engine-launch failures. Log `/tmp/sgui-batch05-grid-busy-browser.log`;
  traces/results under the worktree's ignored `artifacts/` directory.

Fresh Storybook build and the entire focused browser run held the atomic directory
lock `/tmp/sgui-parallel-batch-01-validation.lock`, owner
`01a11673-c572-7720-9c5e-2f67d7094741`. Another owner's first lock was respected;
this worker acquired it only after release, then released its own lock with a
Python owner comparison after Playwright exited. Storybook was not rebuilt during
the suite. No full check, full browser suite or packed-consumer suite was run.

## Limits and proposed follow-up

DOM and mutation observations are evidence of native accessibility attributes
and announcement sources, not evidence of spoken AT output or duplicate speech.
Screen-reader announcement timing, manual keyboard/AT acceptance, physical devices,
React 18 and the full browser/consumer matrix were not validated by this slice.
Firefox remains an environment launch limitation and needs the coordinator's
existing bounded browser-runtime repair work; no product failure was inferred.

Next bounded product task: verify pending/error/success speech with a named
screen-reader/browser pairing, including retained versus empty collections and
host Retry focus after its trigger disappears. Empty-table announcements sit
inside the busy table; whether that delays speech remains an AT acceptance question.
Do not close G-15/G-16 from these automated results.

Central guidance updates reserved for coordinator (outside this allowlist):
record this native table busy bridge and focused G-15/G-16 evidence in catalog grid
and browser acceptance guidance, retain open manual/AT gates, and preserve the
separate Firefox engine launch limitation in the batch validation ledger.
