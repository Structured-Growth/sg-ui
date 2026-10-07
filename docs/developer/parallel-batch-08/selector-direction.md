# Batch 08 selector direction evidence

Assignment: selector-direction, bounded H-06/U-19. Broad acceptance stays open.

## Defect and implementation

At the exact baseline, all four composed direction cases failed: Select and
ComboBox's upstream Popover roots replaced English/RTL with LTR and Arabic/LTR
with RTL. Both roots now reuse the integrated stable `useOverlayDirectionRef` with
`useLocale().direction` as fallback. No public API, placement algorithm,
interaction locale, shared ThemeScope/Menu/Popover or AsyncMultiSelect changed.

Strict Mode regressions cover inherited visual scopes, independent React mounts,
live reversal/removal, dark/compact and language/custom-token propagation without
layout-style leakage, controlled selection requests declined by the host, popup
DOM identity, forwarded native refs, focus across host/direction updates,
Escape/reopening and independent mount removal. These controls do not expose a
controlled open prop; the tests preserve their internal open state across
controlled-value host rerenders rather than introducing an unrequested API.
Turkish dotless-I filtering verifies locale-sensitive matching under RTL visual
layout. Existing identity, disabled-option, keyboard and native-reset tests were
reused. No native-reset implementation was changed.

Both stories demonstrate independently scoped English/RTL and Arabic/LTR controls
with controlled host selection. Host fixture shortcuts F2/F3/F4 reverse visual
direction, rerender the description and restore locale direction while open.
The focused browser spec checks native scope/computed direction, unchanged focused
node and list identity, live direction updates, 320px visibility, keyboard
commit/escape/focus return and repeat opening across mixed scopes.

## Ownership and review

Managed attached worktree:
`/Users/thomashall/.codex/worktrees/batch08-selector-direction/sg-ui`.
Branch: `codex/batch08-selector-direction`.
Baseline: `d77132097bbe495b11c9fd9e2a4f047a1f03140d` (verified before editing).
Implementation commit: `3b754b4`.
Final implementation/test head: `c1da35b040ebbd812358a056335a26b5b96360dc`.
The final report commit follows; final branch head is provided in the coordinator
handoff and PR history.

Changed files, all inside the exclusive allowlist:

- `src/experimental/Select/Select.tsx`
- `src/experimental/Select/Select.direction.test.tsx`
- `src/experimental/Select/Select.stories.tsx`
- `src/experimental/Select/SelectorDirectionStory.tsx`
- `src/experimental/ComboBox/ComboBox.tsx`
- `src/experimental/ComboBox/ComboBox.test.tsx`
- `src/experimental/ComboBox/ComboBox.stories.tsx`
- `tests/browser/batch08-selector-direction.spec.ts`
- `docs/developer/parallel-batch-08/selector-direction.md`

Primary/other worktrees, shared runtime files, dependencies, licensing, workflow
permissions and central acceptance records were preserved.

## Validation

Commands used bundled Node **24.19.0**, pnpm **10.29.3**, with
`PATH=/Users/thomashall/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH`.

- `pnpm install --frozen-lockfile`: passed, no tracked dependency changes.
- Baseline `pnpm exec vitest run src/experimental/Select/Select.direction.test.tsx`:
  **4 failed**, reproducing both locale/visual-direction combinations for both controls.
- `pnpm exec vitest related --run src/experimental/Select/Select.tsx
  src/experimental/ComboBox/ComboBox.tsx`: **19 files / 111 tests passed** on the
  initial implementation, before the additional Turkish and isolation assertions.
- `pnpm exec vitest run src/experimental/Select src/experimental/ComboBox`:
  **3 files / 15 tests passed**, including Turkish and independent mount coverage,
  content committed as `3b754b4`.
- After adding native/composed live-direction focus assertions,
  `pnpm exec vitest run src/experimental/Select/Select.direction.test.tsx`:
  **4 tests passed**, content committed as `c1da35b`.
- `pnpm typecheck`, `pnpm foundations:check`, `pnpm tokens:check`: passed after
  implementation. Source typecheck passed again including the added story/locale test.
- `pnpm exec tsc --noEmit -p tests/browser/tsconfig.json`: passed, including on
  `c1da35b` after the final browser assertions.
- `git diff d77132097bbe495b11c9fd9e2a4f047a1f03140d --check`: passed.

- `pnpm build-storybook`: passed on `c1da35b`; known Vite directive,
  sourcemap and chunk-size warnings. Fresh output was not rebuilt during tests.
- `pnpm exec playwright test tests/browser/batch08-selector-direction.spec.ts`:
  **4 passed** (both cases in Chromium/WebKit), **2 Firefox launch failures**
  (`Could not find profile folder`, before assertions); exit 1. All engines
  remained required; no reinstall/TMPDIR retry or engine exclusion was attempted.

Heavy build/browser validation held the atomic
`/tmp/sgui-parallel-batch-01-validation.lock` with owner
`01a1167a-e019-7250-8363-4aa1f9ea9237`. Two bounded acquisition attempts left other
owners untouched; the subsequent acquisition succeeded. Python owner-checked
cleanup released only this chat's lock after completion. No other process was stopped.

Local logs are `/tmp/sgui-batch08-selector-{install,baseline,unit,unit-final,
unit-direction,related,guards,storybook,browser}.log`; browser artifacts live in
this worktree's ignored `artifacts/` directory.

Draft PR against `codex/dev`: pending creation.

## Limits and next bounded task

Firefox assertions remain unverified due to the separately assigned local launch
prerequisite. No full suite, packed consumers, React 18 runtime, physical devices, browser chrome
zoom or assistive-technology checks are claimed. Broad H-06/U-19/U/X/R/Z remain
open. DOM/native focus and locale matching do not establish spoken AT behavior.
Next bounded task: once the separate AsyncMultiSelect native-reset work integrates,
audit its explicit visual direction with the same bridge and native focus cases;
reserve that component for its current owner until then. Broader collision/zoom
coverage should be its own acceptance slice.

Coordinator central-guidance suggestions: link this report from theme/progress,
record Select/ComboBox among the stable native direction-bridge users, and retain
visual direction versus interaction locale separation. Central AGENTS/master/
progress edits remain reserved to the coordinator; do not close broad gates.
