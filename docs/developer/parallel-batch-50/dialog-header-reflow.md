# Batch 50: shared Dialog header reflow (M-08 partial)

## Scope and classification

Base: `0186aff866d1b0b568817631f3d0da83ee0d49e3`.
Isolated managed worktree: `/Users/thomashall/.codex/worktrees/batch50-dialog-header-reflow/sg-ui`.
Initial HEAD matched the base and `git status --short` was empty before edits.

The two wave-22 Chromium custom-chrome failures are a confirmed product layout
defect. The nonwrapping shared header squeezed its custom-content heading wrapper
against Close, padding and gap. Its `min-inline-size: 0` allowed the Help button
label to wrap into approximately one character per line, taller than the dialog
scrollport. Focus scrolling cannot reveal that complete control.

Original candidate: `e6270941ea8828d8868fef0798451a599a9db25f`.
Preserved evidence root:
`/Users/thomashall/.codex/worktrees/batch45-shared-native-candidate/sg-ui/artifacts/browser-pool/400c7da0-2b1c-447c-8101-fbd7237b63c5/modal-native-boundaries`.
Read `results.json`, actual medium screenshot
`traces/inventory-modal-boundaries-efa48--and-keyboard-focus-visible-chromium/test-failed-1.png`
and its `trace.zip`. Results also identify the matching large case
`inventory-modal-boundaries-b4a68--and-keyboard-focus-visible-chromium`.
The screenshot shows vertically clipped blue Help text. Trace snapshots identify
Header help inside the custom heading wrapper at a 320×320 viewport, 200% root
text and increased spacing; Header help was focused and failed whole-control
visibility at spec line 75 after traversing body/footer controls. This is layout
attribution, not evidence of a missing focus event.

Six removed-opener focus failures remain unclassified and assigned elsewhere.
This change does not modify focus restoration, Dialog runtime, shared Button,
AppModal or the inventory-modal-boundaries spec.

## Change and coverage

The header can wrap. The heading wrapper has a 16rem flex basis, can grow to
available width and stays bounded by that width. When heading plus Close no
longer fit, Close gets a separate end-aligned row rather than compressing arbitrary
custom chrome. Close does not shrink. Existing owned colors, spacing, title roles,
DOM ownership, body/footer scrolling and focus callbacks are retained.

The two new shared Dialog stories include host custom headings/Help, twelve body
fields and wrapping host footer actions. Host body minimum space deliberately
forces outer scrolling when the chrome cannot fit, as in AppModal's tabbed layout.
The unit regression checks dialog naming, heading/Help/Close header ownership,
native keyboard ordering, Help activation and explicit Close dismissal.

`tests/browser/batch50-dialog-header-reflow.spec.ts` has eight cases: md/lg at
ordinary 1024×768, narrow 320×640, short enlarged 640×320 and combined 320×320
with 200% root text and increased line/letter/word spacing. It asserts Help fits
the outer scrollport, full bounds inside every clipping ancestor, native center
hit testing, body/footer/Help/Close Tab reachability, Help activation, backward
Tab, Close dismissal, dialog horizontal containment and preserved ordinary header
hierarchy. No browser/server/build was started by this worker.

## Targeted local validation

Node 24 runtime PATH prefix:
`/Users/thomashall/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin`.
Install acquired `/tmp/sgui-install-slots/slot0` with atomic mkdir and removed
only its own claim after completion. Light validation likewise acquired and
released `/tmp/sgui-light-validation-slots/slot0`. Occupied claims exit 75 before
running commands. No foreign cleanup occurred.

- `pnpm install --frozen-lockfile`: passed, lockfile unchanged.
- `pnpm exec vitest run src/experimental/Dialog/Dialog.test.tsx --maxWorkers=1`:
  passed, five tests.
- `pnpm typecheck`: passed.
- `pnpm exec tsc --noEmit -p tests/browser/tsconfig.json`: passed.
- `pnpm foundations:check`: passed.
- `pnpm tokens:check`: passed.

After final fixture-only edits, `pnpm typecheck` and
`pnpm exec tsc --noEmit -p tests/browser/tsconfig.json` passed again.
`git diff --check` passed. Runtime reported `v24.19.0`.
The coordinator must validate exact committed source/file hashes on a freshly
built immutable candidate. Focused Chromium args:
`tests/browser/batch50-dialog-header-reflow.spec.ts --project=chromium`.
Also retain/rerun the original two custom-chrome cases in the coordinator's
inventory spec, without conflating removed-opener results.

Native results are pending coordinator execution; unit tests do not establish CSS
layout acceptance. Firefox/WebKit checkpoint, manual/device/AT and broad M-08/U/X
acceptance remain pending. Follow [development validation](../react-aria-development-validation.md)
and [parallel browser policy](../react-aria-parallel-browser-validation.md).
