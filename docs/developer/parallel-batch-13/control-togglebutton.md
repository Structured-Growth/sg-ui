# Batch 13: ToggleButton review and bounded evidence

## Decision and scope

The assigned controlled pressed state, disabled parent fieldset, native button type
and independent groups expose no demonstrated defect at the exact baseline below.
Keep the product implementation and API. This PR adds three meaningful colocated
regressions; it does not invent a product fix or duplicate the existing five tests.
No behavior change requires a changed-state story. The existing Default, Pressed,
Disabled, SingleSelection and MultipleSelection stories remain accurate.

Assignment references: U-03/X-16. The repository's specific toggle implementation
record is U-16 in [migration progress](../react-aria-progress.md), and its owned
contract is [toggle actions](../react-aria-remaining-controls.md#toggle-actions-and-tooltip-descriptions).
U-03 records Typography in the master task list; this report does not reclassify it.
No broad U/X gate is closed.

Existing baseline evidence in
[src/experimental/ToggleButton/ToggleButton.test.tsx](../../../src/experimental/ToggleButton/ToggleButton.test.tsx):

- Controlled standalone selection requests `true` while `aria-pressed` stays false
  until the host accepts it; explicit disabled prevents further activation.
- Space/Enter activation toggles exactly once and never submits the containing form;
  the forwarded ref identifies the native button.
- Single/multiple group selection, controlled IDs, required selection, disabled
  skipping and RTL/vertical arrow behavior already have tests.

New evidence verifies:

- Disabling the parent fieldset between Space down/up emits neither selection nor
  press callbacks and preserves controlled false state.
- A disabled fieldset suppresses standalone and group requests while preserving
  the native first-legend enabled exception.
- Two groups reuse the same option IDs without sharing selection/callbacks. The
  controlled group preserves the host value before acceptance and reflects a host
  rerender; the other group remains independent. Every rendered option has native
  `type="button"`.

These are jsdom behavioral/DOM observations, not native timing/focus or AT evidence.

## Ownership and commits

- Verified baseline before any edits: `b139a0d06fb06ba4a5a5aa6adc69c5cb3b206818`.
- One managed worktree created and attached before edits:
  `/Users/thomashall/.codex/worktrees/batch13-control-togglebutton/sg-ui`.
- Branch: `codex/batch13-control-togglebutton`.
- Test implementation and final tested head:
  `ea4e38d48c4620757195cdb8c4c212e86903bdc9`.
- The subsequent report-only commit's exact hash is in the coordinator handoff and
  draft PR history (a document cannot include its own commit hash).
- Draft [PR #66](https://github.com/Structured-Growth/sg-ui/pull/66), base `codex/dev`.

Exclusive allowlist: `src/experimental/ToggleButton/`,
`tests/browser/batch13-control-togglebutton.spec.ts`, and this report.
Actual changes: only `ToggleButton.test.tsx` and this report. No browser spec,
product implementation, style, story, public export, shared guidance/config,
workflow, license or dependency file changed.

## Local validation and limits

- `pnpm install --frozen-lockfile`: passed, pnpm 10.29.3, host Node 26.5.0;
  608 locked packages installed, no tracked dependency changes. Build-script
  approval warning for esbuild was retained; no approval settings were changed.
- Tests used bundled Node **24.19.0**, React **19.2.3**, Vitest **4.1.11**, jsdom
  **26.1.0**, React Aria Components **1.21.1**:
  `PATH=/Users/thomashall/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH`.
- `pnpm exec vitest run src/experimental/ToggleButton/ToggleButton.test.tsx --maxWorkers=1`:
  initial held-Space probe **1 file / 6 passed**, expanded probe **1 file / 8 passed**,
  final semantic group-query refinement **1 file / 8 passed**, content committed
  as `ea4e38d48c4620757195cdb8c4c212e86903bdc9`.
- `git diff --check`: passed. Relative Markdown targets verified locally.

Install acquisition used atomic `mkdir` slot0/slot1 under `/tmp/sgui-install-slots`;
Vitest used one atomic slot among slot0–slot3 under
`/tmp/sgui-light-validation-slots`. Owner token:
`01a116b0-ce26-7e71-b2e7-700346f058db`. Occupied slots were queued, not reported as
passes. Bounded acquisition intervals were at most 60 seconds. Shell EXIT cleanup
compared the token and released only this worker's slot.

The shared `/tmp/sgui-parallel-batch-01-validation.lock` and nonempty
`/tmp/sgui-browser-validation-priority.json` remained respected. No Storybook build,
browser launch, Firefox retry, process stop or lock removal was attempted. The
browser pool was not changed or bypassed. No native evidence is claimed. Targeted
validation follows [the development policy](../react-aria-development-validation.md):
no full check/Storybook/browser/consumer suite, GitHub CI/title wait/rerun/dispatch,
merge, main, publication or manual/device/AT acceptance was performed.

## Reserved follow-up

If native acceptance is scheduled, reserve a fresh pool-native task for only
`src/experimental/ToggleButton/` story fixtures,
`tests/browser/batch13-control-togglebutton.spec.ts` and a new unique report. Use a
host-controlled disabled-fieldset fixture, held Space/live disable, first-legend
exception, native form-submit counter and duplicate-ID independent group keyboard
navigation. Obtain fresh focused browser evidence through the coordinated pool,
respecting its queue and lock. Do not treat these jsdom results as those passes or
retry the unchanged Firefox prerequisite. No broader product changes are justified
by this review; broad device and spoken assistive-technology acceptance stay open.
