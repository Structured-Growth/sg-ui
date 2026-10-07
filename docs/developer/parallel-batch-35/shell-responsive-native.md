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

Run against the implementation/spec bytes committed as
`2ee06dbabe4c0d889e53cf6fbe7843c9f668f23e`, Node `v26.5.0`, pnpm `10.29.3`. Dependencies installed with
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
Initial handoff recorded Chromium as pending. Coordinator wave21 subsequently
built a fresh immutable Storybook and ran that focused spec at exact head
`2ee06dbabe4c0d889e53cf6fbe7843c9f668f23e`: **6 passed, 0 failed, 0 skipped,
0 flaky**, one worker, no retries, 7.5 seconds. This worker read actual
`evidence.json`, `results.json` and `browser.log`; every named case has a passed
result with retry zero and no errors. No product/test-driver failure occurred in
this run; harmless NO_COLOR/FORCE_COLOR log warnings did not affect execution.

Evidence directory (retained ignored artifacts):
`/Users/thomashall/.codex/worktrees/batch35-shell-responsive/sg-ui/artifacts/browser-pool/f38ab73f-dc1d-404d-a719-4cea113f97df/`.
It contains evidence/results JSON, build/type/browser logs, HTML report and trace
output location. Trace retention is failure-only; no failure trace is claimed.
Runtime: Node `v24.19.0`, pnpm `10.29.3`, Playwright `1.63.0`, darwin OS release
`27.0.0`, pool slot3 / loopback port6306. Fresh Storybook build, browser TypeScript
check and focused Chromium command all completed. Browser execution occurred
2026-10-07 11:34:47–11:34:56 America/Chicago (16:34:47–16:34:56 UTC).
Initial/final HEAD match and final source status is clean. Initial/final build
digest both equal
`47e402ffd329fd4b8edcdbba1ebfceb0cc9435b5d7393f0f5b00af4429ab842b`.

Coordinator released the freeze for this report-only finalization after locks
were released. Source, story, unit tests and native spec remain unchanged from
the tested head; no rerun was started. This bounded Chromium slice is ready for
coordinator review/integration and release of its source reservation. Firefox/WebKit
are **pending** coordinated checkpoints; no cross-engine pass is inferred.

Root text scaling is not browser chrome zoom. Actual device, manual display/zoom,
assistive-technology speech, the full navigation/account matrix, wider host-specific
layouts and broad U/X/R/Z remain unverified. This slice does not close M-06 or
upgrade any master/inventory checkbox. SideNavigation and AuthShell stay read-only;
an outside-source defect requires a separately reserved successor.
