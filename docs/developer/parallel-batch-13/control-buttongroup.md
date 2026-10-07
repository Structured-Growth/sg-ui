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

No shared implementation, barrels, configuration, workflows, licensing, dependencies
or acceptance checklists changed. Existing dependency files were reused through
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

Focused fresh Storybook/native validation is pending the shared priority queue
and reviewed harness path. No native pass or baseline native failure is claimed
from source inspection or jsdom. `/tmp/sgui-parallel-batch-01-validation.lock` and
`/tmp/sgui-browser-validation-priority.json` were read only; no other owner's lease
or queued task was removed. No unchanged Firefox launch was attempted.

No full `pnpm check`, whole Storybook/browser matrix, packed consumer matrix,
GitHub CI/title wait/rerun/dispatch, merge, main change or publishing was performed.
Targeted development validation follows
[the authorized policy](../react-aria-development-validation.md).

## Review and follow-up

Public group semantics/ref/disabled-child ownership were already satisfied; retain
the existing contract. Review the vertical corner correction and new composed
evidence as a bounded fix. Native validation remains required before calling this
slice verified. Shared browser-pool adoption/configuration is coordinator-owned
and outside this allowlist; do not import its harness patch into this task without
a reserved scope. Physical coarse-pointer and assistive-technology checks remain
separate open acceptance work.
