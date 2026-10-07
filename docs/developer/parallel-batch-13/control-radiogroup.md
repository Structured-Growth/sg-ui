# Batch 13: control-radiogroup

Assignment: U-04/U-18, with the U-05 RadioGroup interaction contract. This is a
bounded dynamic-option/native-form slice, not whole-gate acceptance.

## Ownership and baseline

- Verified baseline: `b139a0d06fb06ba4a5a5aa6adc69c5cb3b206818`.
- Managed isolated worktree created and attached before edits:
  `/Users/thomashall/.codex/worktrees/batch13-control-radiogroup/sg-ui`.
- Branch: `codex/batch13-control-radiogroup`.
- Owner chat: `01a116b0-c37a-7932-a49f-f357c539b09a`.
- Source/story/spec commit: `9a01b4a98cbbe0199fe0acf5ab87f535198d03ed`.
- SSR layout-effect guard commit: `f174c8c57b3079ba0b7002abfef9bc403eaa12bb`.
- Draft PR: [#78](https://github.com/Structured-Growth/sg-ui/pull/78), base `codex/dev`.
- Exclusive repository write allowlist: `src/experimental/RadioGroup/`,
  `tests/browser/batch13-control-radiogroup.spec.ts`, and this report.
- Final report commit is supplied in the coordinator message; a report cannot
  contain its own commit hash.

## Existing evidence and demonstrated defect

The [owned layout/action contract](../react-aria-layout-actions.md), existing
RadioGroup tests, [batch 01 forms report](../parallel-batch-01/forms.md) and
[batch 05 reset report](../parallel-batch-05/native-reset.md) already cover basic
arrow selection, disabled skipping, native names/values, reset and controlled
authority. Those behaviors were not reimplemented or claimed as new completion.

Two new regressions failed against the baseline: removing or disabling a
controlled selected option left every enabled radio at `tabindex=-1`. Tab moved
from the preceding button directly to the following button, making the group
unreachable through normal keyboard entry.

The private options renderer now observes the internal interaction state and
repairs only native Tab entry when no enabled radio is checked. It prefers the
last focused enabled option, then the first enabled option. It does not select a
replacement, move focus during collection updates or request a host value change.
Restoring an option preserves the original controlled/uncontrolled selection.
React Aria still owns selected state, arrow interactions, native validation/reset
and labels. Public props, group refs and CSS are unchanged; no upstream types
escape the implementation. Story strings/labels are host example data.
The layout effect uses a guarded server fallback to an ordinary effect, preserving
browser commit timing without introducing the React 18 server layout-effect warning.

The dynamic-options story composes two independently named groups, host-owned
selection, removal/disable/restore actions, native submission and host reset to
an explicit empty controlled value. Regression tests cover both transitions,
uncontrolled restoration, independent names and native required validity after
the host clears selection. Native browser cases cover focus, keyboard recovery,
required submission after removal and actual host reset in the composed form.

## Local validation

Runtime: bundled Node `24.19.0`, pnpm `10.29.3`, Vitest `4.1.11`, React `19.2.3`.

- `pnpm install --frozen-lockfile`: passed; manifest/lockfile unchanged. One
  atomic install slot was held and released by this task. The install token was
  `batch13-control-radiogroup`; subsequent validation tokens use the owner chat ID.
- Baseline regression command:
  `pnpm exec vitest run src/experimental/RadioGroup/RadioGroup.test.tsx --maxWorkers=1`:
  2 new failures / 2 existing passes before the fix.
- Same command after the fix and added state/form cases: 1 file / 6 tests passed.
- `pnpm exec vitest run src/components/ColumnsLayoutModal/ColumnsLayoutModal.test.tsx --maxWorkers=1`:
  1 file / 5 existing consumer tests passed, including SSR, modal selection and
  cancellation/reopening behavior.
- `pnpm typecheck`: passed production/story checking.
- `pnpm foundations:check`: passed owned imports, layers and token guards.
- `pnpm exec tsc --noEmit -p tests/browser/tsconfig.json`: passed.
- After the SSR guard:
  `pnpm exec vitest run src/experimental/RadioGroup/RadioGroup.test.tsx src/experimental/RadioGroup/RadioGroup.ssr.test.tsx src/components/ColumnsLayoutModal/ColumnsLayoutModal.test.tsx --maxWorkers=1`:
  3 files / 12 tests passed. Production/story typechecking, the foundation guard
  and browser TypeScript passed again. The standalone SSR case runs in Node
  without browser globals on React 19; this is not a packed React 18 consumer run.
- `git diff --check`: passed before the source commit.

Vitest held one of the four atomic `/tmp/sgui-light-validation-slots/slotN`
directories, recorded its owner and released only its own slot in cleanup.
Occupied slots were reported as queued, never as a pass. No full `pnpm check`,
consumer matrix, CI dispatch/rerun or title automation was run.

Native validation is currently queued behind the coordinator's shared priority
queue. No native pass is claimed by this interim report. The shared browser/build
lock owner was left untouched. At the coordinator's explicit browser-pool hold,
this task stopped only its own idle standalone waiter (PID 2832, interrupt exit
130 while sleeping). It had never acquired the lock, built Storybook or started a
browser. The active other-owner process/lock and priority queue were untouched.
This section will be finalized with fresh build and focused pool engine results
before completion. No pool infrastructure/config was copied or independently
merged into the exclusively scoped branch.

Local evidence logs: `/tmp/sgui-batch13-radiogroup-install.log`,
`/tmp/sgui-batch13-radiogroup-red.log`, `/tmp/sgui-batch13-radiogroup-green.log`,
`/tmp/sgui-batch13-radiogroup-consumer.log`, and
`/tmp/sgui-batch13-radiogroup-typecheck.log`, plus
`/tmp/sgui-batch13-radiogroup-final-unit.log`.

## Review decisions and remaining scopes

Accept the native Tab-entry repair without changing host value policy. A selected
disabled option remains host-owned and disabled native inputs are omitted from
submission; this change does not invent a replacement selection or a new required
validation policy. An empty option collection still has no usable radio; hosts
own the empty state and the decision to restore options or clear a value.

Reserved next tasks: evaluate required validity when a checked option is disabled
against the native HTML contract and document explicit host clearing policy;
separately audit delegated reset prevention for standalone RadioGroup and other
fields under exclusive ownership. The batch 05 composite helper does not establish
that acceptance for these standalone controls. No shared helper or guidance was
edited here.

Firefox local launch remains the known runtime limitation; no repeated unchanged
launch failures or independent browser-pool migration are authorized here. Manual
screen-reader/device/autofill/zoom evidence and broader U/X/R/Z gates remain open.
No merge, publication, version/license, workflow permission or secret changes.
