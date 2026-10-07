# Batch 145: page navigator native Tab diagnosis

Parent tasks: M-03 and U-07. This is a partial diagnostic deliverable; it does
not close either task or broad native/device/assistive-technology acceptance.

## Ownership and baseline

The coordinator reserved exactly these files for `wave43-successor-145`:

- `tests/browser/page-navigator-native-transactions.spec.ts`
- `docs/developer/parallel-batch-145/acceptance-evidence.md`

Worktree: `/Users/thomashall/.codex/worktrees/0c7c/sg-ui`.
Initial clean HEAD: `164421fd639608a4afcfc013adda1d80ebf80cc7`, the requested
pushed dev baseline. No runtime, fixture, shared acceptance/state, installation,
build, validation-slot, queue, CI or other worker files were changed.

Read the durable coordinator state and both wave43 failure reviews before edits.
The state entry has `scopeReserved: true`, batch 145, and the exact allowlist
above. Runtime changes require a new coordinator reservation after attribution.
The applicable validation documents are
[development validation](../react-aria-development-validation.md) and
[parallel browser validation](../react-aria-parallel-browser-validation.md).

## Frozen evidence and attribution

Actual failed checkpoint HEAD: `c7e4863c922e7b94fb9fef143307343850993bff`.
Root evidence inspected:
`/Users/thomashall/.codex/worktrees/reviewed-dev-fw-checkpoint-43/sg-ui/artifacts/browser-pool/74a00435-d263-40f8-bb40-57fac90a4818/evidence.json`.
Its inspected SHA-256 is
`1219120bd3640fad7013862fa4673f9bee5d528f3f325855cc05f8a5b043128a`.

Coordinator files under
`/Users/thomashall/.codex/visualizations/2026/10/07/01a1164f-41db-7f30-aaf9-f20133b6566f/`
were read without mutation. Inspected receipt hashes:

| File | SHA-256 |
| --- | --- |
| `parallel-migration-state.json` | `1d44e8fdc49323205c27abe763796cad06f363a95df7225575f8b959730ef9ff` |
| `wave43-early-failure-review.json` | `22fa904c99bbd381b37b59744091d31abb9d1fc2fbce96eee6c843da8f41ec40` |
| `wave43-additional-native-failure-review.json` | `8af36a0988e9b70ac9d141f5a10c69c95515db0bc743a3bb68cda01f0fafd490` |

The additional review classifies one unclassified native traversal/lifecycle issue
across four Firefox cases. Light/dark Move cases cannot reach `Reject next reorder`
after menu Escape; light/dark read-only cases cannot reach `Actions for Introduction`
after controls are enabled. Read-only raw `1-trace.trace` inspection independently
confirmed the final 24 `keyboardPress` calls are `Tab` in all four cases. Error
contexts retain the strict inactive-target failures. The review records the Summary
action trigger still visibly focused in the Move failure and 18 other Firefox/WebKit
cases passing. Those observations do not establish a universal Tab preference,
stale focus scope, focus theft, or a runtime fix.

| Failed case (Firefox) | Retained trace ZIP SHA-256 |
| --- | --- |
| Move, light | `0fea9462e0e5ba4edd1942f24334e07fdd3890487b21ef0222c95e942aa72eb5` |
| Read-only, light | `eccb04bcf1d856aa6f4bd61da6fde680d117518082ddd6ac6ae7aea559ccc57d` |
| Move, dark | `5de147bce7af602aebc8b6d129fb9a8036fab817e260f755696cef374e0cb484` |
| Read-only, dark | `ab814e5398f5026216efd6c38fb6d063df40c6577535b5312e784772555ed904` |

Read-only source attribution: the host owns read-only/reorder state and Alt+R
shortcuts; Menu uses React Aria MenuTrigger/Popover. The existing reach helper
observed only whether its target was active. It retained neither the actual active
element nor scope/overlay lifecycle, so no particular runtime file can yet be blamed.

## Prepared diagnostic regression

Each existing native `reach` now attaches `navigator-native-tab-reach` JSON on
success or assertion failure. It records the initial state, the active element
after every delivered native Tab, and a final observation after the strict focus
assertion. Records include target identity, connected/enabled state, tabindex,
hidden/inert/aria-hidden state, computed display/visibility, layout rect presence,
target/active ancestors, document focus/visibility and DOM focus-scope/overlay
markers with containment. Passive native key/focus/window events and observed
scope additions/removals and relevant attribute changes capture transient lifecycle
between those snapshots. Lifecycle history retains the latest 256 records with
monotonic sequence numbers; old records may be dropped. Capture-time default
prevention is explicitly named and does not claim final event cancellation state.

The existing 24-key limit, Firefox/Chromium Tab and WebKit Alt+Tab mapping, strict
focus assertion, controlled host transactions, rename/reorder/read-only assertions
and native drag checks remain intact. There is no focus injection, key synthesis
inside page evaluation, state injection, retry, skip, increased traversal bound,
or timing wait. No redundant behavioral test is added: the exact existing failed
regressions carry the missing diagnostic evidence.

DOM markers are observable scope lifetime evidence, not access to React Aria's
internal active scope. Additional observation calls can affect timing; an eventual
pass must not be called a runtime fix without reviewing native events and lifecycle.

## Validation and next step

`git diff --check` passed during preparation. Read-only review checked the exact
allowlist, unchanged behavioral assertions and retained native trace key counts.
Typecheck, unit tests, Storybook build and browser execution are **UNRUN** for this
patch. No installation, builds, browser runs or shared slot/queue mutations were
performed. The coordinator owns actual validation on the reviewed clean commit.

The first useful native selection is the existing light/dark Move and live read-only
cases in Firefox, with affected Chromium coverage and eventual WebKit confirmation.
Use the coordinator's authorized fresh immutable snapshot, preserving failures and
attachments. Review ordered active elements, document focus, key events, target
eligibility and scope removal before classifying driver versus product cause. If a
runtime fix is indicated, request exclusive ExperiencePageNavigator/Menu ownership
from the coordinator before editing source. Broad M-03/U-07 and U/X/R/Z gates remain
open; this report offers no green native evidence or acceptance closure.
