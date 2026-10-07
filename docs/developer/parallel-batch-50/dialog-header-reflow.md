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

The focused Chromium result is recorded below. Firefox/WebKit checkpoint,
manual/device/AT and broad M-08/U/X acceptance remain pending. Follow [development validation](../react-aria-development-validation.md)
and [parallel browser policy](../react-aria-parallel-browser-validation.md).


## Wave 23 verified Chromium evidence

Actual tested immutable candidate: `c64c4377eb42c936f3cf8f1e3f5de2a5b33bdc05`,
not worker implementation head `960040151e3f84ae787601370f97ee1227512b17`.
Coordinator built Storybook once and ran the focused Chromium shard with Node
`v24.19.0` and its supported child PATH. Independent read of root/shard evidence,
results and browser log confirms **8 passed, zero failed/skipped/flaky**.

Evidence root:
`/Users/thomashall/.codex/worktrees/batch45-shared-native-candidate/sg-ui/artifacts/browser-pool/16f6feff-4479-4f37-8c96-451b694ba457`.
Own shard: `dialog-header-reflow/evidence.json`, `results.json`, `browser.log`.
Root `evidence.json` records source digest
`b6047a36c2eb6749f427c775e1f0c716225a303dd276fd272da6608de5efcc56`
and build digest
`1afdb63861962fc7858ba9c42ec5a7e7e5dcc9b89d4f02fad7d6d9ddead899ca`;
each final digest matches its initial value. Root status remains failed because
six other shards failed; this is only the green focused header-reflow slice.

Attribution file: `/tmp/sgui-batch45-candidate-wave23-attribution.json`.
Independently computed SHA256 from local worker files and `git show` of the actual
candidate; all five pre-report file digests matched the attribution record:

| File | Tested SHA256 |
| --- | --- |
| Dialog.module.css | `b263eaaedd6437e45ed6db3430acb989d159750b98132ed32d9d6b31571f4c0b` |
| Dialog.stories.tsx | `d3e83466dc2ae185281371d5e7bb99669a1e68d2dd052a42bce6c1027b20ebb9` |
| Dialog.test.tsx | `d5a90654ac8c608f271d354facaa55d9d9e46ca8f1492c7b3b24bd0720a44dac` |
| batch50-dialog-header-reflow.spec.ts | `44ef0b0824c3b07a4d19637d4a5da66e0779aef5f1c07b626e86e61cb581eaed` |
| Pre-result report | `7bda5cd90c2a0ddb943d19054fe195d212e72a97c8ab122c146ec671bae8b210` |

Direct cross-proof: independently read `modal-native-boundaries/results.json`.
All six batch-40 custom-chrome Chromium cases pass, including both originally red
medium/large 320×320 enlarged cases. The six removed-opener cases still fail and
remain unrelated, held and unclassified by this worker. Original wave-22 red
screenshots/traces/results remain preserved at the earlier evidence root.

Only this report changes after native validation; implementation, stories, unit
and browser spec bytes remain frozen. No full-wave, Firefox/WebKit, manual/device/
AT or whole M-08 acceptance is claimed. Coordinator alone owns dev integration.
