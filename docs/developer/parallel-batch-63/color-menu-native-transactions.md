# M-29 color-menu transactions: batch 63

Base: `fc4f9fca9be4aaace869f0944baccaeed921e5b8`. This bounded batch adds
coverage to the [owned color-menu contract](../react-aria-editor-menus.md#textcolorpickercontrol-m-29)
without changing the callback API, picker implementation or editor implementation.

## Scope and coverage

Existing colocated units already cover hex normalization/invalid errors, swatches,
native color change, clear/reset, external value replacement, reopen, host form
isolation and composing Enter. Existing browser specs assert saved rich-document
colors, but do not exercise color-menu transactions or selection/focus handoff.

`TextColorPickerControl.stories.tsx` adds `NativeTransactions`, a representative
owned-scope host with independent foreground/background values and request logs.
The host captures a textarea selection when it loses focus; callbacks record that
saved selection. The picker keeps focus in its popover and returns to its trigger
on Escape. A separate host action restores the saved selection. The host controls
live read-only state and value reload through Alt+R/Alt+L, including React events
bubbling from the owned portal. No picker-owned editor selection is introduced.

`tests/browser/batch63-color-menu-native-transactions.spec.ts` adds eight cases:
both modes in light/dark, each with transaction and host-lifetime coverage.
Native keyboard entry, invalid error IDREF/correction, Enter then blur deduplication,
Tab through swatches to the real `input[type=color]`, clear/reset deduplication,
mode isolation, Escape/trigger return and explicit host selection restore are
asserted. Host reload replaces an invalid focused draft; live read-only discards
a valid uncommitted draft, closes/disables the picker, and resumes with a clean
host value on keyboard reopen. Browser errors and console warnings/errors fail.

The custom color case sets the real native input through its DOM value setter
and dispatches synthetic input/change events. It checks the React/host transaction
boundary and focus traversal. It **does not** open or verify an OS color chooser,
produce trusted chooser events, or establish physical-device/manual acceptance.

Two additional colocated regression cases cover a valid pending draft when the
host disables the control or removes its callback, followed by clean reopen.
No production defect was found by those units; no implementation fix was made.

## Local preparation evidence

Node 24 runtime path:
`/Users/thomashall/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin`.
Atomic install slot 1 and light-validation slot 0 were acquired before commands
and released after their respective work. Frozen-lockfile installation passed.

- `pnpm typecheck`: passed (source/stories), `/tmp/sgui-batch63-color-types.log`.
- `pnpm exec vitest run src/components/TextColorPickerControl/TextColorPickerControl.test.tsx`:
  1 file / 7 tests passed, `/tmp/sgui-batch63-color-unit.log`.
- `pnpm exec tsc --noEmit -p tests/browser/tsconfig.json`: passed after correcting
  a test variable shadow, `/tmp/sgui-batch63-color-browser-types.log`.
- `pnpm foundations:check`: passed, `/tmp/sgui-batch63-color-guards.log`.
- `git diff --check`: passed.

Per the authorized shared-validation plan, this chat does not run full `pnpm check`,
Storybook build, a browser suite/server, or CI. The coordinator builds the attributed
shared candidate once and runs this focused selection:

```sh
pnpm exec playwright test tests/browser/batch63-color-menu-native-transactions.spec.ts --project=chromium
```

## Shared Chromium execution evidence

The coordinator's wave 30 freshly built shared candidate
`5cc976dc1b9af6ced3980ec0e93fe930a9a8237b` tested the frozen worker source head
`d8d6181787e2ee205052c181c01b20884e942893`. These are distinct commits: the
candidate contains other attributed scopes; the worker contains this batch alone.
`/tmp/sgui-batch45-candidate-wave30-attribution.json` records the worker/base and
SHA-256 digests for its four files. Before this report-only update, all four local
files matched those attributed digests. Story, spec and unit bytes remain frozen.

Root evidence is at
`/Users/thomashall/.codex/worktrees/batch45-shared-native-candidate/sg-ui/artifacts/browser-pool/80b00fee-f55f-45e8-88dc-4666223d88cc/evidence.json`.
The sibling `color-menu-native-transactions/` shard contains `evidence.json`,
`results.json` and `browser.log`. Its immutable build digest is
`6978ebf422790330db7d1a041dfa973e0d3f01c06362a9afbefb43719c5a6ee0`.

The color shard passed **8/8 Chromium cases**, with zero skipped, unexpected or
flaky tests, on Node `v24.19.0`/macOS. Playwright recorded 7.285 seconds; the shard
command took 8.423 seconds. Execution ran on 2026-10-07 from
18:11:55.427–18:12:03.850 UTC. The exact selected spec ran with
`--project=chromium`, no grep filter and all light/dark foreground/background
transaction/lifetime cases. Mandatory browser diagnostic assertions passed.

The root wave has a failed aggregate status because the separate pointer-drop-focus
scope failed. This color shard is green; it does not certify the whole candidate.
The coordinator reports all owned commands settled and locks released. No worker
rerun, build, browser server or source/test change was made for finalization.

Firefox/WebKit remain at the deferred checkpoint. Physical OS chooser, manual
device and assistive-technology gates remain unverified; the color DOM/change case
still uses explicitly synthetic events and never launches an OS chooser. This
bounded Chromium evidence does not close M-29's broader acceptance or E/X gates.
Current-head reviewed integration/CI evidence belongs to the coordinator's
[validation workflow](../react-aria-browser-acceptance.md); integrate the individual
worker history, not the whole shared candidate.
