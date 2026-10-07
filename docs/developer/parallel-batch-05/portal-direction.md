# Batch 05 portal direction completion report

Assignment: portal-direction. H-06/U-19, bounded visual portal scope acceptance.

## Scope and implementation

Reproduced English `Provider dir="rtl"` rendering the native Popover portal as
`dir="ltr"`; the initial new composed regression failed before entering its nested
Menu. React Aria 1.21.1 Popover replaces the passed direction with `useLocale()`
direction. Added an internal owned native-ref bridge and applied it to Menu and
Popover. The bridge uses the current owned visual direction, falling back to the
unchanged interaction locale direction if the override disappears. Its callback
is stable until those direction inputs change, preserving nested overlay focus
when children update. No locale policy, public prop, placement algorithm or Dialog
implementation changed.

Coverage checks nested ThemeScope inheritance, independent React mounts,
English/RTL and Arabic/LTR, Strict Mode, reopening/removing one mount, live direction
updates and override removal, theme/density/language/custom token attributes, and
non-propagation of local layout styles. Native cases check computed direction,
narrow-width item visibility, keyboard action, top-only Escape and focus return.
The Provider story demonstrates both independently scoped locale/direction pairs.

## Changed files

- `src/foundation/ThemeScope.tsx`
- `src/experimental/Menu/Menu.tsx`
- `src/experimental/Popover/Popover.tsx`
- `src/experimental/Popover/Popover.test.tsx`
- `src/experimental/Provider/Provider.portal.test.tsx`
- `src/experimental/Provider/Provider.stories.tsx`
- `tests/browser/batch05-portal-direction.spec.ts`
- `docs/developer/parallel-batch-05/portal-direction.md`

All writes stayed within the exclusive allowlist. Primary and other checkouts were
preserved. No dependencies, licensing, workflow configuration or broad acceptance
checkboxes changed.

## Checkout and review

Exact starting HEAD: `cca9452f384d5ffaa34ad5bd4ddd015b43a2870b`.
Managed worktree: `/Users/thomashall/.codex/worktrees/batch05-portal-direction/sg-ui`.
Branch: `codex/batch05-portal-direction`.
Draft PR against `codex/dev`: [#22](https://github.com/Structured-Growth/sg-ui/pull/22).

Implementation commits:

- `0bb8c848f138e0ad89067ce812839778a8a8fdc1`: preserve explicit direction.
- `7f9e5124c99a50352c38cfa02a2d74d0edbb5644`: stabilize native refs after composed
  consumer regression evidence.
- `2d20123e4d3ce1688237fd45cef64943a3c901bf`: synchronize browser Escape with
  completion of the child dismissal before dismissing the parent.

The completion-report commit follows these implementation/test commits; the final
branch HEAD is recorded in the coordinator handoff and PR history.

## Validation

Frozen install: `pnpm install --frozen-lockfile` passed using host Node 26.5.0 and
pnpm 10.29.3, with no tracked dependency changes. All subsequent checks used bundled
Node **24.19.0** by prefixing commands with
`PATH=/Users/thomashall/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH`.

- Initial `pnpm exec vitest run src/experimental/Popover/Popover.test.tsx` reproduced
  the baseline defect: 1 failed/3 passed; expected RTL, received LTR.
- `pnpm exec vitest run src/foundation/ThemeScope.test.tsx src/experimental/Provider
  src/experimental/Menu/Menu.test.tsx src/experimental/Popover/Popover.test.tsx`:
  5 files/15 tests passed after initial implementation.
- `pnpm exec vitest related --run src/foundation/ThemeScope.tsx
  src/experimental/Menu/Menu.tsx src/experimental/Popover/Popover.tsx` selected
  68 files/366 tests. Its first run found one DataToolbarFilterMenu regression.
  A focused rerun also failed. Temporarily restoring only the three owned runtime
  files to the exact baseline made that same unchanged test pass (5/5), then the
  committed implementation was restored. Stable callbacks fixed the regression.
- Final focused command: `pnpm exec vitest run
  src/components/DataToolbar/components/DataToolbarFilterMenu.test.tsx
  src/foundation/ThemeScope.test.tsx src/experimental/Provider
  src/experimental/Menu/Menu.test.tsx src/experimental/Popover/Popover.test.tsx`:
  **6 files/20 tests passed**. Existing nested filter coverage was reused.
- Final dependency-related command above: **68 files/366 tests passed** on
  `7f9e5124c99a50352c38cfa02a2d74d0edbb5644`.
- `pnpm typecheck`, `pnpm foundations:check`, `pnpm tokens:check`, and
  `pnpm exec tsc --noEmit -p tests/browser/tsconfig.json` passed, including after
  the ref stabilization. Browser typecheck passed again after the final spec edit.
- `pnpm build-storybook` passed on `7f9e5124c99a50352c38cfa02a2d74d0edbb5644`.
  Known Vite directive/sourcemap/chunk warnings remain. No rebuild occurred during
  either suite; the only subsequent change was test synchronization.
- `TMPDIR=/tmp pnpm exec playwright test tests/browser/batch05-portal-direction.spec.ts`:
  first run had 1 pass, 3 native focus failures caused by consecutive Escape presses
  before child exit completed, and 2 Firefox launch failures. Added assertions for
  menu removal and action focus before the second Escape, retaining all checks.
- Final same all-engine command, final spec at
  `2d20123e4d3ce1688237fd45cef64943a3c901bf`: **4 passed** (both cases in Chromium
  and WebKit), **2 Firefox launch failures** (`Could not find profile folder`,
  before assertions). Exit 1; no engine was excluded or skipped.
- `git diff cca9452f384d5ffaa34ad5bd4ddd015b43a2870b --check` passed.

The atomic `/tmp/sgui-parallel-batch-01-validation.lock` was acquired before the
Storybook build and held through native browser runs. Owner:
`01a11673-c27a-71c1-87c6-ceff07fc40e6`. A prior bounded 60-second attempt found
another worker's lock and left it untouched. Python owner-checked cleanup released
only this chat's lock after browser completion. No other worker process was stopped.

Local logs: `/tmp/sgui-batch05-portal-direction-related.log`,
`/tmp/sgui-batch05-portal-direction-storybook.log`,
`/tmp/sgui-batch05-portal-direction-browser.log`, and
`/tmp/sgui-batch05-portal-direction-browser-final.log`. Browser traces/results are
in this worktree's ignored `artifacts/` directory.

## Limits and next bounded task

Firefox assertions remain unverified due to the existing local launch prerequisite.
No full `pnpm check`, full browser suite, packed consumer or React 18 runtime was
run. Native physical devices, browser chrome zoom, screen readers, all collision
placements and broad H-06/U-19/U/X/R/Z acceptance remain open. DOM/browser attribute
and focus evidence does not establish spoken assistive-technology behavior.

The existing contract keeps interaction locale authoritative and allows an
independent visual direction override. This fix follows that contract; it does not
change locale-based placement/keyboard semantics. Other overlay implementations
were outside ownership. Proposed next bounded task: audit/reproduce explicit visual
direction in ComboBox and Select's upstream Popover roots, reuse the stable native
bridge where necessary, and add focused composed/native cases without editing Dialog.

Coordinator guidance updates: link this report from theme/progress acceptance,
document the stable native direction bridge for Menu/Popover and the ref-stability
consumer regression, and preserve the visual-direction versus interaction-locale
contract. Reserve all central AGENTS/master/progress edits for coordinator integration;
do not close broad gates from this slice.
