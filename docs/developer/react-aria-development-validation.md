# Pre-production development validation

The user authorized targeted task validation and occasional full checkpoints on
2026-10-07 while the migration is consolidated into `codex/dev`.

## Task and dev integration checks

Run meaningful tests for the changed behavior and affected consumers, including
colocated/composed regressions. Use `pnpm exec vitest related --run <source paths>`
for related unit tests and `pnpm exec vitest run <test paths>` for explicit cases.
Run typechecking and relevant foundation/token guards for source/API/style changes.
Changes to build, exports or dependencies need the affected build/packed-consumer
checks; workflow changes need syntax/event/selection checks. Update changed-state
stories. Native timing, focus, scrolling or positioning needs focused browser cases
against a freshly built Storybook, without rebuilding during the suite.

Do not rerun the entire suite for every task or dev integration. Review ownership,
commits and targeted evidence before integration; rerun affected checks only where
conflict resolution or interactions introduce a concrete concern. Keep the shared
heavy-validation/browser lock and record commands, tested head and limitations.
A targeted pass is not a full-suite pass or a whole acceptance-gate completion.

## Occasional full checkpoint

Initially run at most one scheduled checkpoint each 24 hours while new code lands,
starting from the last completed broad validation. Do not rerun an unchanged head.
The coordinator freezes a snapshot, serializes heavy validation, and records every
command/outcome. Workers can continue in their isolated worktrees. A checkpoint
includes `pnpm check`, a fresh `pnpm build-storybook`, the complete browser matrix
and the foundation/editor React 18/19 and Next.js consumer checks from CI. Keep
runtime/engine failures distinct from product regressions; incomplete checkpoints
remain incomplete. Track partial attempts, so a persistent environment failure
creates a repair task rather than endless immediate reruns.

Create bounded, exclusively owned follow-up tasks for actionable failures. Widen
checks sooner when a concrete regression warrants it. Keep the ten-minute progress
reports separate from the full-checkpoint cadence.

## GitHub and production acceptance

PRs targeting `codex/dev` run a targeted Node 24 job: source type/foundation/token
guards, related unit tests, explicitly changed tests and changed browser specs.
Documentation-only dev PRs run whitespace checks. Browser specs use a fresh
Storybook and all three engines. Relevant additional worker evidence remains
required for behavior/build/consumer changes beyond automatic selection.
Production-bound PRs, main pushes and reusable release CI retain the full matrix.
Workflow permissions, secrets and publication behavior are unchanged. The separate
manual AI proposal workflow retains its existing built-in validation; it is not the
parallel migration dispatch path. Full acceptance is required before production,
including outstanding manual, device and assistive-technology gates.
