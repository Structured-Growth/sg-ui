# Batch 138: page-selection pointer target correction

Tasks: G-06/G-07. Exact parent: `7f5dfac2218fd2b07f33488bc9cc7a8b001d4e49`.
Scope: `tests/browser/acceptance-pack-113.spec.ts` and this evidence record.

## Retained actual failure

The coordinator's Chromium run started on 2026-10-07 at
21:52:36.769 UTC and timed out after 30,082 ms. Its result is one unexpected
test, zero expected passes, zero skipped tests and zero flaky tests.

- [Results JSON](/Users/thomashall/.codex/worktrees/shared-native-reviewed-87-121/sg-ui/artifacts/browser-pool/cc560449-dab9-4153-8aeb-09a71f87e3f6/page-selection/results.json)
- [Report directory](/Users/thomashall/.codex/worktrees/shared-native-reviewed-87-121/sg-ui/artifacts/browser-pool/cc560449-dab9-4153-8aeb-09a71f87e3f6/page-selection/report)
- [Trace ZIP](/Users/thomashall/.codex/worktrees/shared-native-reviewed-87-121/sg-ui/artifacts/browser-pool/cc560449-dab9-4153-8aeb-09a71f87e3f6/page-selection/traces/acceptance-pack-113-batch1-7104a--None-clears-retained-pages-chromium/trace.zip)
- [Failure context](/Users/thomashall/.codex/worktrees/shared-native-reviewed-87-121/sg-ui/artifacts/browser-pool/cc560449-dab9-4153-8aeb-09a71f87e3f6/page-selection/traces/acceptance-pack-113-batch1-7104a--None-clears-retained-pages-chromium/error-context.md)

The failed action was `header.click()` at original test line 21. Playwright
resolved the accessible checkbox to a native input, then repeatedly reported
the mixed-state indicator intercepting pointer events; some retries reported
the selection column header. Assertions before that action completed, including
Course 1 checked and the page checkbox indeterminate. Later assertions were
not reached and are not evidence of passing behavior.

## Production target and correction

The retained trace's `1-trace.trace` DOM snapshot contains a `LABEL` with
`data-react-aria-pressable`, a clipped native input in its first span, an
`aria-hidden` indicator span and the `Select page` text span. The native input
wrapper has `clip: rect(0px, 0px, 0px, 0px)`, `clip-path: inset(50%)`, absolute
positioning and 1px dimensions. This is the actual production structure, not
a replacement fixture.

[Checkbox](../../../src/experimental/Checkbox/Checkbox.tsx) renders the React
Aria checkbox with its label root, indicator and text. Its
[stylesheet](../../../src/experimental/Checkbox/Checkbox.module.css) gives the
root inline-flex layout and the indicator a 1.25rem hit area. The
[grid stylesheet](../../../src/components/AppDataGrid/ownedGridInteraction.module.css)
clips the selection label text, leaving the indicator as the visible target.
[Grid interaction](../../../src/components/AppDataGrid/ownedGridInteraction.tsx)
owns the page-selection callback and disabled-row exclusion; the retained
selection story starts with Course 55 selected and Course 2 disabled.

The test now locates the nearest owning label from each exact accessible
checkbox locator and clicks it using ordinary Playwright actionability checks.
Course 1 also uses this pointer path, replacing the previous programmatic focus
and Space setup. Checkbox role locators still own every state assertion.
There are no forced clicks, synthetic event dispatches, CSS changes, application
state injection or production edits.

All mixed, disabled-row, page-selection, retained-page and None-clearing
assertions remain intact, as does the console/page-error assertion. Selection
contracts remain those in the
[catalog grid capability contract](../react-aria-grid-contracts.md) and
[catalog integration guide](../react-aria-catalog-grid.md).

## Validation boundary

Read-only inspection of retained results, failure context, trace DOM and source
supports the label target correction. Diff and scope review confirm only the
two owned paths changed. No install, build, typecheck, test, browser,
performance, CI or lease commands were run in this successor.

The corrected label click has not been executed here. Native operability and
all later assertions remain coordinator-owned proof; this record does not
claim a passing browser gate or close G-06/G-07. If a normal owning-label click
fails in the coordinator's fresh run, investigate the bounded production
dependency in `ownedGridInteraction.tsx`, its selection layout CSS and the
owned Checkbox interaction before changing assertions.
