# Batch 151: native page navigator traversal correction

Parent tasks: **M-10 and U-07, partial only**. This prepares a bounded test-driver
correction; it establishes no new native pass or acceptance closure.

## Reservation and frozen baseline

The human-authorized successor and durable `wave45-successor-151` entry reserve
exactly:

- `tests/browser/page-navigator-native-transactions.spec.ts`
- `docs/developer/parallel-batch-151/acceptance-evidence.md`

The entry records `scopeReserved: true`, batch/execution identity 151, parents
M-10/U-07 and baseline `03f1f4dd2c52b2b6b32a8677aaa2d4b3d51879a7`.
The managed isolated worktree is `/Users/thomashall/.codex/worktrees/c49f/sg-ui`,
initially clean at that exact predecessor. Branch: `codex/wave45-successor-151`.
The predecessor's batch-145 report and diagnostics remain unchanged; its historical
parent attribution is not promoted by this successor.

The coordinator owns execution and review under
[development validation](../react-aria-development-validation.md) and
[parallel browser validation](../react-aria-parallel-browser-validation.md).
No runtime/fixture, shared queue/state/slots, CI, primary image-upload or other
worker worktree was changed. No installation, test/type/build/Storybook/browser
execution, merge, push or publication was performed.

## Retained Wave45 failures

Actual tested frozen head: `48bf2ee90eeaa45e71ea443aef7b83e6e145cb72`.
Root receipt:
`/Users/thomashall/.codex/worktrees/wave45-reviewed-corrections/sg-ui/artifacts/browser-pool/3e5633e9-aeff-46b0-a27d-2ee355195caf/evidence.json`.
The navigator shard's `navigator-lifecycle-diagnostics/results.json` under that
same pool root contains four failed Firefox cases, zero passed/skipped/flaky cases:

- `keyboard Move boundaries respect accepted and rejected host order (light)`
- `keyboard Move boundaries respect accepted and rejected host order (dark)`
- `live read-only and removed-page changes during rename suppress stale writes (light)`
- `live read-only and removed-page changes during rename suppress stale writes (dark)`

Read-only review and raw results inspection preserve the strict inactive-target
errors for `Reject next reorder` and `Actions for Introduction`. Earlier reaches
succeed. The former starts at Summary actions; the latter starts at the Lesson
page button and advances to Summary actions. Both failed targets are earlier in
the fixture DOM, connected, enabled and have no hidden/inert ancestors. Final
scope/overlay observations are empty and document focus is true. The old helper
issues only forward Tab and cannot depend on Firefox wrapping through document
or browser chrome to revisit these targets.

Classification: **test-driver traversal assumption**, matching the coordinator's
`native-forward-only-return-traversal` review. This is not evidence of a product
focus trap, React Aria internal scope defect or Firefox launch failure. Passive
capture diagnostics still cannot exclude later event cancellation. Subsequent
reorder/read-only/removal behavior remains unproved until execution.

Files below the coordinator artifact directory
`/Users/thomashall/.codex/visualizations/2026/10/07/01a1164f-41db-7f30-aaf9-f20133b6566f/`
were read without mutation. Inspected SHA-256 receipts:

| Receipt | SHA-256 |
| --- | --- |
| `parallel-migration-state.json` (reservation read) | `b3794480b9033e6afb043d70dbe4e7524d6708ac157d06ea5e345cb746cb2dc1` |
| `wave45-grid-navigator-failure-review.json` | `5b489b0496b2516bc041a05a89ad3c3b5cc2e653b4fdf1a986c39126b822bea8` |
| Wave45 root `evidence.json` | `145625752ad8959b9d9df41e77108e4dac3ebd4c0c817e3b6132d54747156111` |
| Navigator shard `results.json` | `1494d89514562858543e523f2721428d72f3a3376c8736a6628e40f32d09a1f7` |

These are historical red evidence, not corrected-run results.

## Meaningful changed bytes

Implementation commit:
`1f00820cc1f9687d319e23404bfc3fadc9d347f8`
(`test: navigate page transactions in native DOM order`).
Spec SHA-256: `e74cb4effa8fc1dd723383956245cfc985815fb0892236c6ad28523557d211c4`.
Spec Git blob: `c6f2bd0510c2e7c3d4390be06d102364a0749b91`.
The predecessor and tested Wave45 spec have identical blob
`cb0a86fd26b43f0d55fc5fc24a35e33c0d6e4e4a` / SHA-256
`5e4108600d9d255bd400d39204e585e460401d2a49b227f92e433a3ce8f9d54f`.

`focusSnapshot` reads `active.compareDocumentPosition(target)`. A connected
earlier target requests backward native traversal; other positions request
forward traversal. BODY/HTML are document entry rather than known sequential
anchors: one forward key obtains an observable control, then the next snapshot
can choose backward traversal. Direction is recomputed from each actual native
result, without querying a replacement focus destination or injecting focus.
These fixtures use ordinary DOM-ordered tab stops; this is not a general solver
for positive tabindex, shadow DOM or browser-chrome navigation.

`reach` delivers `Shift+Tab` or `Tab` (`Alt+Shift+Tab` / `Alt+Tab` for the existing
WebKit keyboard convention). The single loop remains bounded to **24 total native
key presses**, with the original target-focus failure assertion. It does not add
retries, skips, clicks, `locator.focus`, tabindex edits or DOM state changes.
All rename, removal, host request/order, read-only, rejection, disabled-boundary,
return-focus, console and native drag assertions remain byte-for-byte unchanged.

The existing `navigator-native-tab-reach` attachment, final snapshot and passive
focus/scope lifecycle remain. Snapshots add target/active DOM position and direction;
each post-key observation records the actual key. The attachment keeps the legacy
forward `key` field and adds `backwardKey`, so ordered observations disambiguate
the issued direction. Diagnostics attach on success or focus assertion failure.

## Validation and remaining gates

Local work was limited to read-only source/evidence inspection, diff review,
file hashes and `git diff --check` (clean). These do not establish behavioral or
type correctness. The coordinator must run meaningful supported changed-byte
checks and fresh focused native proof from a reviewed frozen candidate.

**UNRUN:** changed-byte type/import checks; affected unit/composed checks;
Storybook/build checks; all corrected native Firefox cases and subsequent behavior
assertions; corrected Chromium/WebKit regression checks; packed consumers;
full-suite/CI/production acceptance. No shared execution resources were acquired.

Fresh Firefox proof must retain ordered diagnostics, establish actual backward
keys/reaches within the unchanged bound, and execute every remaining transaction
assertion in the four selected cases. Any subsequent native focus, state or
geometry failure needs separate classification and a new ownership reservation
if runtime edits are needed. Broad M-10/U-07 and device/assistive-technology gates
remain open; this report does not update acceptance or authorize broader edits.
