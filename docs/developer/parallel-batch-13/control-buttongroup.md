# Batch 13 ButtonGroup evidence

Assignment: control-buttongroup, bounded U-03/X-07 evidence. This report does not
reopen or close the master list's completed U-03 typography task; ButtonGroup's
contract is recorded in [owned layout and actions](../react-aria-layout-actions.md).
Broad target-size, device and assistive-technology acceptance remains open.

## Checkout and scope

Created and attached one managed isolated worktree before edits:
`/Users/thomashall/.codex/worktrees/batch13-control-buttongroup/sg-ui`.
Verified baseline: `b139a0d06fb06ba4a5a5aa6adc69c5cb3b206818`.
Branch: `codex/batch13-control-buttongroup`.
Draft PR against `codex/dev`: [#81](https://github.com/Structured-Growth/sg-ui/pull/81).
Implementation/test commit: `51a9ebbc6abae70558de9c54420fd22fc466b2ac`.
The report commit follows; final HEAD is recorded in the coordinator handoff.

Exclusive tracked write allowlist:

- `src/experimental/ButtonGroup/`
- `tests/browser/batch13-control-buttongroup.spec.ts`
- `docs/developer/parallel-batch-13/control-buttongroup.md`

No task-authored shared implementation, barrels, configuration, workflows, licensing,
dependencies or acceptance checklists changed. The separately authorized common
prerequisite is recorded below. Existing dependency files were reused through
ignored worktree-local links; no install was required or run.

## Existing evidence and bounded change

Existing `ButtonGroup.test.tsx` already checks the forwarded native div ref, named
group, vertical/joined attributes, absence of a group Tab stop and provider-free
SSR. No replacement API or toolbar navigation was warranted.

The baseline stylesheet applied horizontal first/last-child corner rules to
vertical joined groups too. That rounds the first child's lower inline-start
corner and last child's upper inline-end corner inside the vertical outline.
The new browser regression was authored before the three-line CSS fix. Vertical
children now reset those radii and round the first child's block-start end and
last child's block-end end. Logical corners retain LTR/RTL behavior; horizontal
rules, refs, child authority and API remain unchanged.

Stories demonstrate both orientations, LTR/RTL, compact/comfortable inherited
density, disabled middle actions and nested independent actions. The new composed
unit case checks forward/reverse Tab order through nested children while skipping
the child-owned disabled action. The two focused browser cases check actual
computed corners/heights and native Tab/Shift+Tab/ArrowRight behavior. Browser
runtime warnings/errors remain failures. Density measurements are desktop token
inheritance evidence, not physical touch or WCAG conformance certification.

## Local validation

Tested source: implementation commit above (unit/type/guard checks ran against the
same source before commit). macOS; pnpm 10.29.3; React 19.2.3; TypeScript 5.9.3;
Vitest 4.1.11; Playwright 1.63.0 from the existing dependency directory.

- Node 24.21.0: `node node_modules/vitest/vitest.mjs run
  src/experimental/ButtonGroup/ButtonGroup.test.tsx --maxWorkers=1`: **1 file,
  3 tests passed**, zero skipped. Acquired one of four global light-validation
  slots atomically, recorded owner `batch13-control-buttongroup` and released only
  that slot in the shell's exit trap. Initial occupied slot was queued, not passed.
- System Node 26.5.0: `node node_modules/typescript/bin/tsc --noEmit`: passed.
- `node node_modules/typescript/bin/tsc --noEmit -p tests/browser/tsconfig.json`:
  passed, including after adding runtime error collection.
- `node scripts/check-foundations.mjs`: passed.
- `node scripts/tokens.mjs --check`: passed.
- `git diff --check`: passed.

The original task head had native validation pending the shared priority queue
and reviewed harness path. No baseline native failure is claimed from source
inspection or jsdom. `/tmp/sgui-parallel-batch-01-validation.lock` and
`/tmp/sgui-browser-validation-priority.json` were read only; no other owner's lease
or queued task was removed. No unchanged Firefox launch retry was attempted.

The worker ran no full `pnpm check`, Storybook build, browser suite or packed consumer
matrix. No GitHub CI/title wait/rerun/dispatch, integration merge, main change or
publishing was performed.
Targeted development validation follows
[the authorized policy](../react-aria-development-validation.md).

## Review and follow-up

Public group semantics/ref/disabled-child ownership were already satisfied; retain
the existing contract. Review the vertical corner correction and new composed
evidence as a bounded fix. Native correction validation remains required before
calling this slice verified. Shared browser-pool adoption/configuration is
coordinator-owned; only the explicit ancestry bootstrap below was authorized here.
Physical coarse-pointer and assistive-technology checks remain
separate open acceptance work.

## Authorized common prerequisite and failed native run

The coordinator explicitly authorized a normal full-ancestry merge of reviewed
`6b9da4423f1e6675c37571d5552474da25e90258` in the same original managed worktree.
Conflict-free merge/frozen head: `92cd135d1233f3cac4a82d7fa7dac48ec23fb262`.
Its other parent is task/report head `144d2b960d62d8fe5faf30cf99b4da4a7b45cf07`.
`git diff --exit-code` confirmed source, spec and report were byte-for-byte retained.
This common prerequisite brought six harness/guidance files through the reviewed
ancestry; it is separate from the task-authored allowlist. No copied harness,
special merge, additional worktree, install or repeated light checks were used.
Two push attempts were rejected with GitHub internal server errors; read-only
remote verification still returned the previous PR head. The local frozen head
was used for native validation.

Coordinator pool run `d54fae3e-7c3b-49a1-b65e-63315aa4dd5e` built fresh immutable
Storybook, typechecked browser tests and ran:

`pnpm exec playwright test tests/browser/batch13-control-buttongroup.spec.ts
--project=chromium --project=firefox --project=webkit`

Exact tested head: `92cd135d1233f3cac4a82d7fa7dac48ec23fb262`; Node 24.21.0,
pnpm 10.29.3, Playwright 1.63.0, macOS 27.0.0, isolated port 6273.
Build digest before/after:
`6b8bd105b659107d54c3499e9937a5386bb64c75de63f0e9a40ff9065e2ef34d`.
Final head matched and source was clean. Result: **2 passed, 4 failed**, no accepted
full slice. Chromium/Firefox nested native Tab passed; layout failed in all three
engines and WebKit's nested native Tab case failed.
Evidence remains under `artifacts/browser-pool/d54fae3e-7c3b-49a1-b65e-63315aa4dd5e/`
(`evidence.json`, `browser.log`, `results.json`, failure screenshots and traces).
Firefox launch was restored by the user's permission/restart before this run;
its actual nested-focus pass is recorded rather than inferring behavior from launch.

The coordinator released the source freeze for bounded corrections, with no
worker-owned native/build run. Trace inspection found:

- Chromium's RTL-labeled group had ancestor directions `ltr, ltr, rtl, ltr`:
  the nested density `Provider` explicitly reintroduced its locale's LTR direction.
  The fixture now uses density-only `ThemeScope`, preserving the outer Provider's
  explicit direction; browser assertions also require computed direction.
- Firefox/WebKit sampled the button collection before Storybook's asynchronous
  render (zero buttons). The spec now waits for exactly three buttons and the last
  button to be visible before the same geometry assertions.
- WebKit's screenshot showed native focus on "After group" after ordinary Tab
  from "Archive", while the native link remained present. This matches macOS
  Safari's documented default Tab/Option-Tab distinction. The spec preserves and
  checks that ordinary control traversal, then requires the link in both forward
  and reverse native Option-Tab traversal. Chromium/Firefox and non-macOS WebKit
  still require the original ordinary Tab link order. No control is removed,
  forced focused into the asserted sequence or omitted by an arbitrary skip.
  See [Apple's native shortcut contract](https://support.apple.com/en-gb/guide/safari/cpsh003/mac).

These are fixture/spec corrections; the vertical-corner product CSS is unchanged.
Correction checks: Node 24.21.0 source/story typecheck and browser-spec typecheck
passed, as did the foundation import/layer/token guard and whitespace check. Fresh
three-engine native correction evidence remains required and queued.
