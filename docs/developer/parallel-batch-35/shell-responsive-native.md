# M-06 AppShell responsive main-area native slice

2026-10-07. Reviewed baseline `4c9f859bad204a7d7fd2e3787aa6f293db268525`.
Managed attached worktree:
`/Users/thomashall/.codex/worktrees/batch35-shell-responsive/sg-ui`;
branch `codex/batch35-shell-responsive-native`. Verified exact baseline before edits.
Exclusive write scope: `src/components/AppShell/`,
`tests/browser/inventory-shell-responsive.spec.ts`, and this report.

## Existing evidence and bounded additions

Read [batch-29 inventory reconciliation](../parallel-batch-29/inventory-acceptance-02-12.md),
[shell contracts](../react-aria-modal-shells.md), existing AppShell DOM/SSR tests,
stories and CSS, and existing native browser specs including the AuthShell reflow
suite. M-06 remains held: landmarks, collapse and historical independent-scroll
measurements do not supply a focused responsive/main-content native matrix.

Added [a representative host story](../../../src/components/AppShell/AppShell.stories.tsx)
using production scopes, SideNavigation, TextField, Typography and AppButton.
Its fixed fullscreen host positioning excludes Storybook decorator gutters from
viewport measurements. Twelve content sections provide real host controls and
wrapping text; 35 navigation links provide a separate overflow region. No product
implementation or shared component changes were demonstrated or made.

Added a composed unit regression preserving the exact main/input nodes and unsaved
host value through navigation collapse/expansion. Existing landmark/ref/SSR cases
remain in place. The [six native cases](../../../tests/browser/inventory-shell-responsive.spec.ts)
cover light/dark themes, 641/640/639/320/900px width transitions, retained host value
and keyboard focus, collapsed navigation/main availability, positive main geometry,
320x360 short narrow viewports with normal/200% root text, no main/document horizontal
overflow, independent main wheel/nav scrolling, and sequential forward/reverse
host focus with visible outline and hit-tested geometry inside main.

## Targeted local evidence

Run against the implementation/spec bytes in the first commit containing this
report, Node `v26.5.0`, pnpm `10.29.3`. Dependencies installed with
`pnpm install --frozen-lockfile` after two busy-slot admission attempts; those
attempts did not run an installation. Install and light checks used atomic UUID
ownership under the canonical `/tmp/sgui-install-slots/slot0..slot1` and
`/tmp/sgui-light-validation-slots/slot0..slot3`, removing only this worker's token.

- `pnpm exec vitest run src/components/AppShell/AppShell.test.tsx src/components/AppShell/AppShell.ssr.test.tsx --maxWorkers=1`: **4 tests / 2 files pass**.
- `pnpm typecheck`: **pass**.
- `pnpm exec tsc --noEmit -p tests/browser/tsconfig.json`: **pass**.
- `pnpm foundations:check`: **pass**.
- `pnpm tokens:check`: **pass**.
- `git diff --check`: **pass**.

No worker heavy build or browser server was started. Per
[targeted development policy](../react-aria-development-validation.md), full
`pnpm check` and per-task Storybook build are intentionally not run.

## Native handoff and limits

Focused Chromium selector:
`pnpm exec playwright test tests/browser/inventory-shell-responsive.spec.ts --project=chromium --workers=1`.
Coordinator must run it against a fresh immutable Storybook from the exact
committed handoff head. **Chromium pending, not passed** at initial handoff.
Assigned source remains reserved pending actual native proof and any corrections.
Firefox/WebKit are **pending** coordinated checkpoints; no cross-engine pass is
inferred. Native failures must retain their original evidence and be classified
as product, fixture/driver/expectation, environment or unclassified.

Root text scaling is not browser chrome zoom. Actual device, manual display/zoom,
assistive-technology speech, the full navigation/account matrix, wider host-specific
layouts and broad U/X/R/Z remain unverified. This slice does not close M-06 or
upgrade any master/inventory checkbox. SideNavigation and AuthShell stay read-only;
an outside-source defect requires a separately reserved successor.
