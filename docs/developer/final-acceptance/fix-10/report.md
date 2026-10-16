# Fix 10 — BUG-0012 / GRID-R1

Implemented the reserved reorder utility field rejection in the shared modified `dev` checkout at HEAD `540f47d4059a9cea8890b80927f34f51ef2fbc3e`.

Both actual validators live in `packages/ui/src/components/AppDataGrid/ownedGridColumns.ts` (`createOwnedGridColumns`) and `packages/ui/src/components/AppDataGrid/ownedGridModel.ts` (`processOwnedGridRows`). They now use one internal reserved-field predicate defined in the model. It reserves the actual collection identifiers `__selection` and `__reorder`, and preserves legacy `__drag`, `__select__` and `__drag__`. Blank/duplicate-field checks, ordinary host fields and sizing behavior remain unchanged. No renderer or interaction implementation changed.

## Evidence

Read repository AGENTS.md, the final-acceptance resume ledger (`docs/developer/react-aria-final-acceptance.md`), and wave-02-02 report/behavior evidence. Added focused presentation cases for all five names, processing cases in client and server modes that prove rejection precedes row-ID traversal, and one new public AppDataGrid rowDrag composition regression using SSR. The public case asserts the exact library validation error and no host cell-value or reorder callback execution.

Failing-first: three suites, 66 tests; **4 failed, 62 passed**, exit 1. Presentation accepted `__reorder`; both processing modes reached the deliberately guarded row traversal. The public SSR composition threw `Cannot read properties of undefined (reading 'key')` instead of the expected validation error. This is new SSR evidence, not a claim that the historical helper-only report rendered a crash. See [failing-first.txt](failing-first.txt).

After the source fix: **7 suites, 123 tests passed**, exit 0. Existing AppDataGrid, public reorder, interaction and processing suites passed alongside the changed column/model and new collision suites. See [affected-unit-tests.txt](affected-unit-tests.txt).

Both runs used Node **v24.21.0**, Vitest **4.1.11**, with `/Users/thomashall/.npm/_npx/387698761821791d/node_modules/node/bin` first in PATH, from `packages/ui`:

```sh
PATH=/Users/thomashall/.npm/_npx/387698761821791d/node_modules/node/bin:$PATH pnpm exec vitest run src/components/AppDataGrid/ownedGridColumns.test.ts src/components/AppDataGrid/ownedGridModel.test.ts src/components/AppDataGrid/AppDataGrid.utility-collision.test.tsx
PATH=/Users/thomashall/.npm/_npx/387698761821791d/node_modules/node/bin:$PATH pnpm exec vitest run src/components/AppDataGrid/ownedGridColumns.test.ts src/components/AppDataGrid/ownedGridModel.test.ts src/components/AppDataGrid/AppDataGrid.utility-collision.test.tsx src/components/AppDataGrid/AppDataGrid.test.tsx src/components/AppDataGrid/AppDataGrid.reorder.test.tsx src/components/AppDataGrid/ownedGridInteraction.test.tsx src/components/AppDataGrid/ownedGridProcessing.test.tsx
```

Targeted `git diff --check` passed. Exact changed-file SHA-256 hashes and unchanged supporting test hashes are in [results.json](results.json). Logs are retained verbatim; their runner start times use host time and are not a user-facing local-date assertion.

## Acceptance limits

BUG-0012 / GRID-R1 source fix and focused unit regression are complete. **A-G-02 and A-M-16 remain partial**; this receipt does not close broader grid acceptance. Coordinator owns integration, fresh build and type validation. No typecheck, build, native/browser/device/AT, packed-consumer, full suite, generated-output or release validation was run. No shared ledger/checklist, runtime manifest, generated output or other worker implementation was edited. No install, staging, commit, push, reset, clean, worktree/thread/agent creation, version change, server or release action occurred.
