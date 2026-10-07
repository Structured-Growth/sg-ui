# Batch 48 — M-18 pointer reorder invalidation (F7)

## Scope and ownership

Managed, attached worktree:
`/Users/thomashall/.codex/worktrees/batch48-pointer-reorder-invalidation/sg-ui`.
Verified clean starting HEAD: `0186aff866d1b0b568817631f3d0da83ee0d49e3`.
Only the following reserved files change:

- [Host fixture](../../../src/components/AppDataGrid/AppDataGrid.reorder-invalidation.stories.tsx).
- [Composed tests](../../../src/components/AppDataGrid/AppDataGrid.pointer-invalidation.test.tsx).
- [Native spec](../../../tests/browser/inventory-pointer-reorder-invalidation.spec.ts).
- This report.

Production grid/RowDnd implementations, existing stories/tests and the integration
checkout remain read-only. This slice follows [reorder contracts](../react-aria-grid-reorder.md),
[targeted development validation](../react-aria-development-validation.md) and
[coordinator browser scheduling](../react-aria-parallel-browser-validation.md).
The requested abbreviated `parallel-browser-validation.md` path does not exist;
the last link is the actual repository policy.

## Added evidence and limits

The host arms a dataset or identity-function replacement before pointer dragging.
Entering the host strip applies it once, with equal row IDs and preserved source
controls. Dataset replacement uses a new array and new row objects. Identity
replacement uses a different function with the same returned IDs. A second grid
deliberately shares those IDs and supplies its own independent request counter.
No timer, programmatic focus or synthetic native drag driver exists in the story.

Three native cases require trusted pointer dragstart/dragend and, for replacement,
a trusted drop back onto a valid non-adjacent source-grid target. Cross-grid release
must actually enter the other collection. Each case requires zero requests from
both hosts, unchanged row order, cleared drop indicators/target/dragging attributes
and source-handle focus. The spec observes DOM drag affordance cleanup and native
dragend; it does not visually inspect an operating-system drag image.

Three composed tests validate one-shot host replacement and independent request
oracles after identity replacement. Their synthetic dragenter targets only the
host strip; they do not claim native drag proof. Existing first-gesture pointer,
keyboard dataset replacement, Strict Mode cleanup and Move rollback coverage is
read-only and is not reproduced here.

## Local validation — 2026-10-07

Node `v24.19.0` from the required bundled runtime. Commands run in this worktree.
Installation and lightweight commands use atomic token-owned slots from the
repository harness; owned leases were released after commands settled.

| Command | Outcome |
| --- | --- |
| Initial `acquireInstallSlot` | Refused: both slots occupied; installation did not execute. Environment/admission evidence, not a product failure. No foreign lease released. |
| `pnpm install --frozen-lockfile` after successful owned admission | Passed; 608 packages, lockfile unchanged. Reported ignored esbuild build scripts; no approval/configuration change made. |
| `pnpm exec vitest run src/components/AppDataGrid/AppDataGrid.pointer-invalidation.test.tsx src/components/AppDataGrid/AppDataGrid.reorder.test.tsx --maxWorkers=1` | Passed: 2 files, 24 tests (3 new composed, 21 existing reorder cases), 3.42 seconds. |
| `pnpm exec tsc --noEmit` | Passed. |
| `pnpm exec tsc --noEmit -p tests/browser/tsconfig.json` | Passed. |
| `pnpm foundations:check` | Passed owned import/layer/token guard. |
| `git diff --check` | Passed. |

## Frozen source attribution and native handoff

SHA-256 of the three executable files:

| File | SHA-256 |
| --- | --- |
| Story | `eab9f5ee84aeca4ab1616e46bac2b27875f10c5f90583bfb3f6e66c6570c6360` |
| Composed tests | `2f09c9affabc97d65a599dc17828015f76e00cf9a276ba258c783e73a428de79` |
| Native spec | `3dc360ed48aa059b00fbb606e203149691c214a52271358633101537150f1439` |

Ready focus arguments:
`tests/browser/inventory-pointer-reorder-invalidation.spec.ts --project=chromium`.
Fresh native validation is **pending** the coordinator's reviewed testing-only
candidate and immutable fresh Storybook pool. No independent build, server or
browser suite ran. The exact frozen commit is supplied in the coordinator handoff;
this report will receive a report-only follow-up after native evidence arrives.
No tested candidate or dev acceptance is claimed yet.

Firefox/WebKit await the batch checkpoint. Physical-device long-press drag,
spoken AT, host production network races and broad M-18/G/U/X/R/Z acceptance remain
unverified/open. No GitHub dispatch/rerun/wait, integration/push/main merge,
publication, workflow permission/secret/version change or broad acceptance closure.
Historical red evidence remains intact; any native failure must be classified as
product, fixture/driver/expectation, environment or unclassified, with retained
logs and a reserved successor for production defects.
