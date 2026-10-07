# Batch 76: controlled authoring page-list transactions

Task reference: M-10, preserved authoring-list scope only. Date: 2026-10-07.
Reviewed baseline: `036473472ffeee4e5d504d5ca76bc1431d187693`, locally resolved
from `0364734` and verified as contained by `codex/dev` before work.
Managed isolated worktree created before edits:
`/Users/thomashall/.codex/worktrees/batch76-navigator-evidence/sg-ui`.
Branch: `codex/batch76-navigator-native-transactions`.
The final exact frozen commit is provided in the authorized coordinator message;
a commit cannot embed its own hash in this report.

This batch adds evidence fixtures and tests, without changing production source,
existing stories/tests, contracts, master rows or acceptance. The disputed
previous/next/link intent remains HOLD under the
[batch75 review](../parallel-batch-75/inventory-contract-intent.md).
No new navigation API or whole-M-10 closure is proposed. The
[preserved contract](../react-aria-page-navigation.md) remains authoritative for
these bounded authoring-list transactions, without disposing of disputed intent.

## Exclusive changed-path allowlist

- `src/components/ExperiencePageNavigator/ExperiencePageNavigator.native-transactions.stories.tsx`
- `src/components/ExperiencePageNavigator/ExperiencePageNavigator.native-transactions.test.tsx`
- `tests/browser/page-navigator-native-transactions.spec.ts`
- `docs/developer/parallel-batch-76/page-navigator-native-transactions.md`

The [new story](../../../src/components/ExperiencePageNavigator/ExperiencePageNavigator.native-transactions.stories.tsx)
uses SGUI controls inside the production Storybook scope, with canonical theme
globals for representative light/dark runs. Host page order and requests are
visible JSON snapshots. Requests change supplied props only when the host accepts;
reject-next leaves the supplied order unchanged. Selection and mutations have
separate callback records. The deterministic three-page fixture does not persist
or fetch data. Host-only Alt+R toggles read-only and Alt+X removes Introduction,
including while the React portal is open. The native source-removal arm responds
only to a trusted dragstart and removes that source through host state.

## Added unit and authored browser coverage

The [three composed units](../../../src/components/ExperiencePageNavigator/ExperiencePageNavigator.native-transactions.test.tsx)
verify rejected/accepted adjacent reorder snapshots, live read-only changes during
an edit followed by permitted selection, and accepted removal focus to the next
survivor with no selection callback. They are jsdom/user-event composition tests,
not native-browser or assistive-technology evidence. Existing individual-command
and SSR tests remain untouched.

The [browser spec](../../../tests/browser/page-navigator-native-transactions.spec.ts)
authors eleven cases per engine (eight keyboard cases over light/dark and three
first-drag cases in light):

- Real Tab/Arrow/Enter rename through the Save button, trimmed single callback,
  retained active selection, portal theme, then Escape discard and opener focus.
- Keyboard removal with accepted host props focuses next then previous surviving
  selection. The final page exposes disabled Remove/Move commands. Removing a
  non-active page emits no selection request.
- First/last Move boundaries, rejected controlled order, accepted down/up order,
  exact callback sequence, and action-trigger focus after each request.
- Live read-only changes in the rename dialog and open menu suppress mutations;
  read-only rows remain selectable and not draggable. Host removal during rename
  prevents a stale save. The host shortcuts use native keyboard input.
- A fresh native mouse drag from the li's decorative handle to a different row
  requests one reorder with the exact host order; a self drop requests none.
  A separately armed first drag removes its source at trusted dragstart and must
  leave only survivors with no reorder request.

The mouse driver follows the repository's existing native reorder driver: pointer
movement crosses the native drag threshold and supplies a second movement before
mouseup. It constructs no synthetic DragEvent/DataTransfer, invokes no component
callbacks, and uses no arbitrary sleep. Captured dragstart/drop/dragend records
include isTrusted; successful/self drops require a trusted native drop carrying
`text/page-key = intro`. Source removal may cancel the platform drag before drop,
so that scenario requires a trusted first dragstart and the surviving host
order/no request, without asserting that a cancelled drag must deliver a drop.
Each native case attaches its actual event log when executed. No physical-device
long-press, spoken AT, zoom, exhaustive host rejection or global U/X/R/Z claim is
made. Source removal is a cancellation/race scenario, not synthetic stale-data
injection.

## Local validation and frozen handoff

Node 24 runtime PATH:
`/Users/thomashall/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin`.
`pnpm install --frozen-lockfile` passed using atomically acquired install slot0,
then that owned slot was released. It reported ignored esbuild lifecycle scripts;
no approval or package-policy change was made. Lightweight commands used atomically
acquired light slot0 and released only that slot after completion.

| Check | Result | Local log |
| --- | --- | --- |
| Frozen install | Pass | `/tmp/batch76-install.log` |
| Navigator existing units + SSR + new composed units | 3 files, 13 tests pass | `/tmp/batch76-units.log` |
| `pnpm exec tsc --noEmit` (source/stories) | Pass | `/tmp/batch76-source-types.log` |
| `pnpm exec tsc --noEmit -p tests/browser/tsconfig.json` (after final spec edit) | Pass | `/tmp/batch76-browser-types.log` |
| `pnpm foundations:check` | Pass | `/tmp/batch76-foundations.log` |
| Playwright focused `--list` | 33 cases, 3 engine projects discovered; no browser launched | `/tmp/batch76-browser-list.log` |
| Diff whitespace, exact allowlist and report links | Pass | checked before commit |

**Native execution is pending.** Coordinator alone reviews the frozen exact head,
builds static Storybook in the shared pool and executes focused Chromium first:
`pnpm exec playwright test tests/browser/page-navigator-native-transactions.spec.ts --project=chromium`.
Firefox/WebKit are deferred checkpoints, not passes. This chat ran no browser,
Storybook build, full `pnpm check`, package build or native server. Targeted green
checks do not replace coordinator full validation/integration/acceptance.

No proven production defect was found in local checks. If the exact-head native
run demonstrates a production defect, preserve this production read-only boundary
and report a bounded successor instead of changing implementation or weakening
assertions. Source/report are frozen at handoff. No CI dispatch/rerun/wait,
re-enable, GitHub publication, main integration, force/delete, credential read,
workflow-permission change, or foreign worktree/slot cleanup occurred.
