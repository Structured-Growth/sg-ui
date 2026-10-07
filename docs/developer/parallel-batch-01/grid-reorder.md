# Batch 01: grid-reorder

Assignment: G-17, G-18, G-28, X-08. This is a bounded acceptance slice, not completion of those broad gates.

## Slice

- The optional native helper automatically removes its token-scoped preview and capture listener on native drag end (including cancellation). Explicit cleanup, replacement and unmount remain safe. Browser rejection of drag imagery releases both before rethrowing.
- Colocated behavior tests cover native cancellation, replacement, listener balance, drag-image errors and Strict Mode unmount.
- A Strict Mode host story demonstrates counted single requests, pending disabled controls, optimistic commit and host-owned failure rollback, with host timer cleanup.
- Dedicated browser coverage verifies keyboard cancellation with another selected row, source focus, drop-indicator removal, remount and subsequent single keyboard commit; keyboard Enter/Space Move commit/rollback; pointer Move endpoint focus fallback.
- Existing trusted native pointer and emulated touch Move tests are retained unchanged and included in validation.

## Files and isolation

Only `src/components/AppDataGridRowDnd/useDataGridRowDnd.ts`, its colocated test, `DataGridDragHandle.stories.tsx`, `docs/developer/react-aria-grid-reorder.md`, `tests/browser/batch01-grid-reorder.spec.ts`, and this report are changed.

Worktree: `/Users/thomashall/.codex/worktrees/batch01-grid-reorder/sg-ui`

Branch: `codex/batch01-grid-reorder`, based on `9f153642e827a14033d646cf0160730c0793bdfc`. Primary checkout untouched.

## Validation

- `pnpm install --frozen-lockfile`: passed; no dependency/lockfile changes.
- Targeted native-helper Vitest: 6 tests passed.
- Browser/source TypeScript check: passed.
- `pnpm check`: passed (143 Vitest files, 970 tests, plus foundation/token/type/release/build/package checks).
- `pnpm build-storybook`: passed; output is reused for browser retries and never rebuilt during a suite.
- Final clean browser command: `TMPDIR=/tmp pnpm test:browser tests/browser/batch01-grid-reorder.spec.ts tests/browser/reorder.spec.ts --project=chromium --project=webkit`: **16 passed** in 24.9 seconds. Six new acceptance cases and ten existing native pointer/emulated touch cases passed. Initial new-test fixture assumptions about initial collection entry and between-row drop labels were corrected before this final run.
- Firefox was attempted in the three-engine run and with `/tmp` profiles; all eight cases were blocked at browser launch by `Could not find profile folder`. No Firefox acceptance is claimed. Shared configuration/checks were not weakened.
- An earlier aggregate retry was interrupted on its final existing WebKit case while yielding coordinator validation priority (15 passed); the clean 16-case run supersedes that interruption.
- Heavy checks, Storybook and browser servers used the shared atomic validation lock with owner records and trap cleanup. Coordinator integration priority was honored. Builds were not run during a browser suite.
- `git diff --check`: passed. All report/contract source paths and the PR link were verified.
- Runtime used: Node 26.5.0, pnpm 10.29.3, React 19.2.3. The Node 22.12/24 and packed React 18/19 support matrix is unchanged and not rerun by this slice.

## Remaining acceptance and integration

Physical-device touch long-press, actual spoken AT announcements, cross-grid cancellation, all dataset-change boundaries, and production network races remain unverified. Complete one-page dataset constraints and host persistence ownership remain intact. Broad G/U/X/R/Z gates remain open.

Coordinator guidance update: add the bounded helper cleanup/Strict Mode evidence link to shared progress/AGENTS/master records if desired; do not mark the broad task IDs complete.

Suggested next bounded assignment: physical touch and screen-reader review of drag cancellation versus Move alternatives, with named device/OS/AT versions and spoken announcement evidence.

Implementation commit: `4fbab81aa4b992e6dff475b98ec0f3a4d06b9a5d`.

Draft PR: [#13](https://github.com/Structured-Growth/sg-ui/pull/13), based on `feat/react-aria-owned-foundation-cards` (the assigned baseline). No merge/publish. Coordinator consolidation destination is `codex/dev`, not `main`.

This report is committed separately after the implementation; the draft PR head and coordinator completion message identify its final commit.
