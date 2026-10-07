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
- Initial clean task/report head: `ec91c4e71ba0c243b57d7e041a45ed930d647ff1`.
- Native grouping/current-name correction and final tested source/spec/report head:
  `d2b1ccf045f7e1fe62902b6cf1cf60f49fb4d93f`.
- Separately authorized common browser-pool prerequisite: normal full-ancestry
  merge of reviewed `6b9da4423f1e6675c37571d5552474da25e90258`, producing
  `e78dab93f4b4bc04a0d65bdad9c3dbe177338a8a`. No conflicts; task paths were
  unchanged. Its six harness/config/doc files are common prerequisite changes,
  not independent task edits or copied infrastructure.
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

The first native pool run then demonstrated a WebKit-specific remaining failure:
Tab focused **After delivery**, skipping Live even with Live at `tabindex=0`.
Trace snapshots confirm the actual focused button. The checked disabled radio
still shared the native `delivery` name. It also satisfied the native required
group despite its value being unavailable to FormData (a subsequent regression
failed with `checkValidity() === true`).

The bridge now temporarily detaches the native name only from a checked disabled
input, retaining its checked/disabled presentation and the host selection. This
isolates that unavailable input from enabled native radio grouping and required
validity. It restores the current name when the input is enabled or unchecked,
including host name changes while disabled. No value callback is emitted. The
existing dynamic story exposes this same required/disabled combination. Browser
assertions still require real Tab focus, unselected Live and zero host requests;
they now attach native focus/input/FormData diagnostics and check unavailable
selection validity plus restored form naming. No engine/assertion was skipped.

The dynamic-options story composes two independently named groups, host-owned
selection, removal/disable/restore actions, native submission and host reset to
an explicit empty controlled value. Regression tests cover both transitions,
uncontrolled restoration, independent names and native required validity after
the host clears selection. Native browser cases cover focus, keyboard recovery,
required submission after removal and actual host reset in the composed form.

## Local validation

Lightweight runtime: bundled Node `24.19.0`, pnpm `10.29.3`, Vitest `4.1.11`,
React `19.2.3`. Coordinator native pool runtime: Node `24.21.0`, pnpm `10.29.3`,
Playwright `1.63.0`, Darwin `27.0.0`.

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
- Disabled selection regression before the native-name correction: 1 failure /
  6 passes, proving required native validity incorrectly accepted the unavailable
  checked option. The initial correction then exposed retained old naming after
  host rename (1 failure / 12 passes); the owned current name and stable generated
  fallback correct this too. The final corrected affected results follow.
- Corrected combined explicit RadioGroup, RadioGroup SSR and ColumnsLayoutModal
  command above: 3 files / 14 tests passed, with generated-name independence,
  required unavailable selection and host rename/restoration regressions included.
  `pnpm typecheck`, `pnpm foundations:check` and browser `tsc` passed again.
- `git diff --check`: passed before the source commit.

Vitest held one of the four atomic `/tmp/sgui-light-validation-slots/slotN`
directories, recorded its owner and released only its own slot in cleanup.
Occupied slots were reported as queued, never as a pass. No full `pnpm check`,
consumer matrix, CI dispatch/rerun or title automation was run.

At the coordinator's explicit browser-pool hold,
this task stopped only its own idle standalone waiter (PID 2832, interrupt exit
130 while sleeping). It had never acquired the lock, built Storybook or started a
browser. The active other-owner process/lock and priority queue were untouched.
No pool infrastructure/config was copied or independently merged; the prerequisite
merge above followed explicit authorization. The first coordinator pool run at
immutable head `e78dab93f4b4bc04a0d65bdad9c3dbe177338a8a` built fresh Storybook
and passed browser types, then produced 5 passes / 1 WebKit Disable-case failure.
Chromium passed all 3 cases; WebKit passed removal and required/reset, but skipped
the disabled-selected group on Tab. This partial result is not accepted completion.
Evidence/results/build/types/browser logs and trace are under
`artifacts/browser-pool/10281224-fc11-4d1a-b12e-88e755dc760b/` in this worktree.
The corrected coordinator pool run at immutable head
`d2b1ccf045f7e1fe62902b6cf1cf60f49fb4d93f` passed all 6 focused native cases:
3 Chromium and 3 WebKit, with no skipped/flaky/unexpected tests or browser runtime
errors. Fresh Storybook and browser types passed. Commands recorded by the pool:

- `pnpm exec storybook build --output-dir artifacts/browser-pool/185a7f37-358d-40ab-9bd1-db78691921de/storybook`
  (the pool passed the equivalent absolute output path).
- `pnpm exec tsc --noEmit -p tests/browser/tsconfig.json`.
- `pnpm exec playwright test tests/browser/batch13-control-radiogroup.spec.ts --project=chromium --project=webkit`.

The source head remained unchanged and clean throughout the build/suite. Initial
and final Storybook digests both equal
`7bf4f8d7d8b2c007f8a24b2af18d87f9a162b743f7b4873fd12db33ae61b98d1`;
no rebuild occurred during testing. Pool slot 0 used loopback port 6273 and owner
`browser-pool:37171:a88272c9-4a3a-4698-8032-baa3dd33977f` under coordinator queue
owner `01a1164f-41db-7f30-aaf9-f20133b6566f`. The worker started no own build or
server and stayed frozen until the coordinator explicitly released the worktree.
Evidence, results, build/types/browser logs, native diagnostic attachments and
reports are under `artifacts/browser-pool/185a7f37-358d-40ab-9bd1-db78691921de/`.
These local pool results establish only this bounded Chromium/WebKit slice.

Local evidence logs: `/tmp/sgui-batch13-radiogroup-install.log`,
`/tmp/sgui-batch13-radiogroup-red.log`, `/tmp/sgui-batch13-radiogroup-green.log`,
`/tmp/sgui-batch13-radiogroup-consumer.log`, and
`/tmp/sgui-batch13-radiogroup-typecheck.log`, plus
`/tmp/sgui-batch13-radiogroup-final-unit.log`,
`/tmp/sgui-batch13-radiogroup-disabled-red.log` and
`/tmp/sgui-batch13-radiogroup-disabled-green.log`.

## Review decisions and remaining scopes

Accept the native Tab-entry repair without changing host value policy. A selected
disabled option remains host-owned and disabled native inputs are omitted from
submission; its detached native name cannot satisfy an enabled required group.
Restoring availability restores the current form name and original host selection.
No replacement selection is invented. An empty option collection still has no
usable radio; hosts own the empty state and the decision to restore options or
clear a value.

Reserved next tasks: broader empty/all-disabled required-group and assistive
technology acceptance; separately audit delegated reset prevention for standalone
RadioGroup and other fields under exclusive ownership. The batch 05 composite
helper does not establish that acceptance for these standalone controls. Exclusive
task edits do not modify shared helpers or guidance; the separately authorized
common prerequisite includes its reviewed pool documentation.

Firefox local launch remains the known runtime limitation; no repeated unchanged
launch failures or independent browser-pool migration are authorized here. Manual
screen-reader/device/autofill/zoom evidence and broader U/X/R/Z gates remain open.
No PR merge, publication, version/license, workflow permission or secret changes.
