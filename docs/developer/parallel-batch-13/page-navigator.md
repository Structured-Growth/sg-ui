# Batch 13 page-navigator inspection report

Assignment: M-06/U-10 page-navigator, 2026-10-07. Inspection completed without
product changes; the assigned route semantics do not exist in the allowed control.
No whole task or broad native/device/assistive-technology acceptance is closed.

## Isolation and scope

Exact verified baseline: `b139a0d06fb06ba4a5a5aa6adc69c5cb3b206818`.
One managed worktree was created and attached before edits:
`/Users/thomashall/.codex/worktrees/batch13-page-navigator/sg-ui`.
Branch: `codex/batch13-page-navigator`; draft PR base: `codex/dev`.
Primary and all other worktrees were preserved.

Exclusive write allowlist:

- `src/components/ExperiencePageNavigator/`
- `tests/browser/batch13-page-navigator.spec.ts`
- This report, `docs/developer/parallel-batch-13/page-navigator.md`.

Only this report changed. Root AGENTS.md, the [development validation policy](../react-aria-development-validation.md),
[owned navigation contract](../react-aria-page-navigation.md), existing source,
unit/SSR tests, stories and previous completion/reconciliation reports were read.
`rg --files -g AGENTS.md` found only the root instructions.

## Findings and existing evidence

The [master inventory](../react-aria-master-task-list.md) assigns M-06 to AppShell
and M-10 to ExperiencePageNavigator. U-10 concerns owned Link/Breadcrumbs and host
navigation integration. The [public navigator source](../../../src/components/ExperiencePageNavigator/ExperiencePageNavigator.tsx)
and [index](../../../src/components/ExperiencePageNavigator/index.ts) expose
`{ key, title }` pages and controlled selection, add, remove, rename and reorder
callbacks. They do not expose href, target, rel, download, router adapters or
unavailable route destinations. Selection renders a Button; Move up/down requests
ordering changes, not route navigation. Read-only intentionally allows selection.

This mismatch was already inspected in [batch 09](../parallel-batch-09/inventory-contract-wording.md)
and its [M-10 reconciliation](../react-aria-inventory-contract-reconciliation.md#m-10-authoring-page-list).
That record preserves the unresolved product/API decision about adjacent/route
navigation. Repeating its audit or adding link props now would not establish a
small regression fix in the shipped contract.

Existing [colocated tests](../../../src/components/ExperiencePageNavigator/ExperiencePageNavigator.test.tsx)
contain nine cases: separated selection/add/actions; trimmed Enter rename and
focus restoration; cancellation/unchanged/blank names; keyboard reorder boundaries;
invalid/self/read-only drag; read-only selection and last-page removal;
host removal during editing; adjacent focus after removal; live read-only editing.
The [SSR test](../../../src/components/ExperiencePageNavigator/ExperiencePageNavigator.ssr.test.tsx)
adds one case for controlled authoring markup without browser globals. These are
static inventory counts, not newly executed passes.

The [stories](../../../src/components/ExperiencePageNavigator/ExperiencePageNavigator.stories.tsx)
provide interactive host state, read-only, last-page, dark and long scrollable
lists. Labels read current host title/page data during render; heading/form IDs
use React useId and edit/removal state is local to each component. Those source
observations do not prove a complete dynamic-label or simultaneous-instance
interaction matrix. No demonstrated defect was found, and no new tests or stories
were manufactured without a failing scenario.

Native/router attributes already have a separate owned implementation in
[SGLink](../../../src/adapters/Link.tsx), with
[adapter unit tests](../../../src/adapters/navigation.test.tsx) and
[browser cases](../../../tests/browser/batch01-adapters.spec.ts). The
[batch 01 report](../parallel-batch-01/adapters.md) records its executed commands,
heads and Firefox launch limits. The [page-navigation execution record](../react-aria-progress.md#page-actions-and-navigation)
records historical native rename/reorder/removal focus, list scrolling and packed
React 18/19 checks. Neither historical record is fresh acceptance of this baseline.

## Validation and delivery

Documentation-only validation: all relative report links/anchors, exact component
API and inventory IDs, source test counts, whitespace and exclusive changed-file
scope. Passed: 15 relative links/anchors and ten statically counted test cases.
Runtime queried for provenance: Node `v26.5.0`, Python `3.9.6`, gh `2.95.0`.
No dependencies were installed; no unit/typecheck/foundation/build/Storybook/browser
or consumer suite ran. No install/light/heavy slot, browser lock, server or browser
pool was claimed. Queued checks are not represented as passes; no Firefox retry.

Commands included `git rev-parse HEAD`, `git status --short`,
`git switch -c codex/batch13-page-navigator`, `rg --files -g AGENTS.md`, read-only
`rg`/`cat`/`sed` inspection, `node --version`, `python3 --version`, `gh --version`,
Python link/anchor/count validation, `git diff --check` and an exact allowlist audit.
Validation ran on the assigned baseline plus this report, then on the committed
report head. Delivery commit, final exact head and attached draft PR are sent to
the coordinator to avoid embedding a self-referential final commit hash.
No GitHub checks were dispatched, rerun, awaited or re-enabled; no merge,
publication, permissions, secrets, licensing or shared guidance change occurred.

## Reserved follow-ups

Coordinator/product/API owner: record the M-10 authoring versus adjacent/route
navigation disposition using the existing batch 09 alternatives. Assign route
attribute work to its confirmed owner, with an explicit allowlist for the selected
Link/Breadcrumbs/tab/navigation implementation and consumer fixture. AppShell
M-06 is outside this task's write scope.

A separately assigned M-10 evidence slice can exercise live host title/page
updates while menus/dialogs are open and two navigator instances with overlapping
page keys, verifying separate callbacks, region/form associations and native
focus. A failing case must establish the precise fix before changing product code.
Fresh native evidence must follow the approved browser pool and shared lock/
priority policy; jsdom cannot close native focus/drag acceptance. Dynamic-label,
simultaneous-instance, physical drag/touch, enlarged-text and spoken AT acceptance
remain open. No broad G/K/E/U/X/R/Z or manual gate was closed.
