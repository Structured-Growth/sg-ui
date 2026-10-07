# Batch 01: grid focus and scroll retention

Assignment: `grid-focus`; tasks G-16 and G-29. Base: `9f153642e827a14033d646cf0160730c0793bdfc`.

## Acceptance slice

The owned interaction tracks stable row/field identity and nested control index.
Refresh retains mounted control focus and native scroll. Retained-row status
renders outside the scrolling content so its appearance cannot shift rows. Lost-focus repair uses
`preventScroll`; a disappearing row prefers a body cell in the same field over
its column header. React Aria may choose the next surviving row in that field.
Hidden fields retain entry within the surviving row. Empty results retain the
native grid entry. Focus in another grid or host action is never taken by an update. A deliberate
blur to an outside control clears stale focus ownership, including when that host
control later disappears.
Accepted page **or page-size** changes while focus is inside the grid reset both
scroll axes and enter the first data cell (or empty native table entry). Host
controls retain focus and own their explicit entry transitions. Temporary row
absence does not prune retained selection.

G-16 semantics remain an interactive `grid`, with body cell arrow navigation,
React Aria roving entry, Left/Right navigation among nested controls, and Tab
exit from the grid as one tab stop. Enter on a
nested action invokes that action without toggling row selection. The existing
nested menu test covers row-action isolation and return to its trigger. No public
prop, processing, persistence, reorder or shell contracts were changed.

## Files

- `src/components/AppDataGrid/ownedGridInteraction.tsx`
- `src/components/AppDataGrid/ownedGridInteraction.test.tsx`
- `src/components/AppDataGrid/ownedGridInteraction.stories.tsx`
- `tests/browser/batch01-grid-focus.spec.ts`
- This report.

Story: `migration-proofs-catalog-grid-interaction--focus-retention`. Host-owned
keyboard shortcuts exercise refresh, hiding, deletion, page/size and empty results
without moving focus to a fixture button first. Two grid instances exercise isolation.

## Review and validation

Worktree: `/Users/thomashall/.codex/worktrees/batch01-grid-focus/sg-ui`.
Branch: `codex/batch01-grid-focus`.
Implementation commit: `60450cbe120111804d45c9004a1358bcebffccab`.
Final native regression commit: `39151928713a83f86785e15068b1df6a96cdb71b`.
Draft PR: [#12](https://github.com/Structured-Growth/sg-ui/pull/12), targeting
`codex/dev`; never merged or published by this worker.

- `pnpm install --frozen-lockfile`: passed, no dependency or lockfile changes.
- Targeted `ownedGridInteraction.test.tsx`: 16/16 passed.
- Browser spec TypeScript check: passed.
- `git diff --check`: passed.
- Final `pnpm check`: passed (143 test files, 972 tests; foundation, token, type,
  release-policy, build and package-entry checks passed).
- Final `pnpm build-storybook`: passed.
- Firefox was attempted and failed before test execution: `Could not find profile
  folder` on macOS 27.0.1 (local launch limitation documented in
  `tests/browser/README.md`). No project or CI requirement was removed.
- `pnpm test:browser batch01-grid-focus.spec.ts --project chromium --project webkit`:
  passed, 10/10 cases (five per engine), including explicit hidden-column and
  empty-result assertions. Browser spec typechecking and runtime-console/page-error
  guards passed. Native focus/scroll JSON is attached to each case in
  `artifacts/browser-results.json`; Playwright reports live under `artifacts/`.
- The full-check and Storybook source is identical to the implementation commit;
  the native regression commit refines only the browser spec, verified by its final typecheck
  and native execution. Storybook was never rebuilt during a suite run.
- Every heavy check/build and Playwright server was serialized using the shared
  atomic lock, with this thread's owner record and a shell EXIT cleanup trap.
  Coordinator integration validation received both requested priority turns.

Validation runtime: Node 26.5.0, pnpm 10.29.3, React 19.2.3. Node 24 CI and packed
React 18/19 consumer gates remain coordinator/CI validation, not evidence from this
local run.

## Limits and coordinator integration

This is a bounded G-16/G-29 slice, not completion of broad G/U/X/R/Z acceptance.
Physical devices, real assistive technology, browser chrome zoom, arbitrary host
custom cell widgets/programmatic off-entry focus, server response races and shell/footer entry behavior remain
outside this slice. Reorder ownership remains in its separate batch.

Coordinator should add the linked evidence to the shared master/progress records
and contract guidance: accepted page-size changes use the same first data-cell entry
as page changes; both scroll axes reset when entry moves to the first column.
No shared guidance file was edited by this worker.

A separate observed accessibility follow-up remains: React Aria's table does not
forward the supplied `aria-busy` to native table markup. This slice validates the
owned translated live refresh status and focus/scroll retention, and does not
claim native busy semantics or assistive-technology acceptance. The pending
status remains outside scrolling content; empty-state status remains inside the
native grid entry.

Suggested next bounded assignment: G-16 native busy-state bridging and
pending/error announcements, with refresh focus/scroll retention regression
coverage and assistive-technology evidence. Shell/footer-driven asynchronous
page entry and view-switch focus remain a separate bounded composition gate.
