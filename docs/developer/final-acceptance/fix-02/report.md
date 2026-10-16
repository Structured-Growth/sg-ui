# A-A-07 documentation successor P04-S4

**P04-S4 complete; A-A-07 remains partial.** Assigned concrete fix implemented on
2026-10-16 in the shared modified `dev` checkout, HEAD
`540f47d4059a9cea8890b80927f34f51ef2fbc3e`. Coordinator owns acceptance counts;
no shared checklist, ledger or historical evidence was edited.

## Changes

- `docs/developer/react-aria-button.md`: replaced the stale paragraph claiming
  ContentEditorChrome uses a legacy button/MouseEvent and remains unmigrated.
  Documents shipped owned Button, menu-item `onPress(anchor: HTMLButtonElement)`,
  internal native button ref, migration from `event.currentTarget`, suppressed
  unavailable/disabled/loading actions, and the separate outer div ref. Clarifies
  that Button's own `onPress()` takes no argument; links to toggle guidance.
- `docs/developer/react-aria-remaining-controls.md`: documents ToggleButton's
  `onPress()` alongside `onSelectedChange(boolean)` and native button ref. A
  standalone activation supplies one notification to each callback for their
  distinct purposes. Controlled selection remains host-owned; disabled activation
  sends neither. Avoid duplicate host side effects and reliance on callback order.
- Added this report, machine-readable results, before hashes and bounded
  documentation/source validation under `final-acceptance/fix-02/` only.

## Validation and retained evidence

Read root AGENTS.md, final-acceptance execution guidance and
[parallel-04's exact successor](../parallel-04/report.md#confirmed-documentation-defect-p04-f3).
Compared current Button, ContentEditorChrome and ToggleButton implementations and
colocated tests. `python3 docs/developer/final-acceptance/fix-02/validate.py`
passes seven bounded assertions: stale paragraph removal, source/public-ref
mapping, both callback mappings, relative documentation link/anchor, and retained
source/test hashes. [Validation](validation.json) records all six relevant library
source/test files unchanged from parallel-04's input snapshot. This comparison
covers those files only, not the concurrently edited library as a whole.

Reused evidence, without rerunning unit or broad suites:

- [Parallel-04](../parallel-04/report.md#a-a-07--partial),
  [test source](../parallel-04/acceptance.test.tsx) and
  [transcript](../parallel-04/reproduction.log): standalone toggle click/Enter/Space
  yields three action notifications and three selection requests, true/false/true;
  ordinary/submit/reset programmatic clicks each notify once. Node 26/jsdom is
  outside the supported Node 22/24 matrix and supplies no native-device proof.
- ContentEditorChrome's retained colocated test asserts one native button anchor
  per pointer/Enter/Space activation and no surrounding form submission; current
  source/test hashes match the previously reconciled FA-04 inputs. FA-04 retains
  local unit evidence; this documentation change creates no new test execution.
- [Historical Button native evidence](../../parallel-batch-13/control-button.md#final-focused-native-evidence):
  two Chromium/WebKit cases at frozen head
  `0c6fc7664e1faffee0071ac55e48390603bfd748`, removed Storybook host. Preserved as dated
  evidence, not fresh current-head/docs-host execution. No historical record changed.

`git diff --check` for the two assigned guides and this directory passed. All
local Markdown links added/used by this report resolve. JSON parses and touched
file hashes are recorded in results.json; that file excludes its own hash to avoid
a recursive digest. No architecture, implementation, dependency or generated
output changed, so no build, install, UI test or browser rerun was warranted.

## Remaining acceptance

P04-S5 and full A-A-07 remain open: finish composed/public native-event surface
reconciliation and scoped current docs-host pointer/keyboard/browser evidence,
including supported-runtime tests where required. Historical Chromium/WebKit or
jsdom results do not establish Firefox, physical touch/device or spoken AT
conformance. Hydration, broader cross-browser/device/AT gates and all separate
presentation/RTL leaves retain their own requirements. No full production
validation, remote CI, legal review/approval, release or main promotion is claimed.
No additional conversations/agents, staging, commits, pushes, cleanup, worktrees,
server changes or version actions were performed.
