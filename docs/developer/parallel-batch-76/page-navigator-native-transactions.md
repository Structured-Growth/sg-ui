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

The [composed units](../../../src/components/ExperiencePageNavigator/ExperiencePageNavigator.native-transactions.test.tsx)
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

**Initial handoff: native execution was pending.** Coordinator alone reviews the frozen exact head,
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


## Wave35 red evidence and bounded driver correction

Coordinator-owned wave35 at exact `15ba1656429a89ea1f51700995b704efd68982ed`
settled with **8 passed / 3 failed**, not an overall pass. Token:
`378b8e10-1604-4ad9-ab7b-cdcef9967e97`, port 6813. Artifacts are retained in this
worktree under `artifacts/browser-pool/<token>/page-navigator-native-transactions/`
(`browser.log`, `results.json`, `evidence.json`, and all three error contexts,
screenshots and trace ZIPs). Coordinator plan/attribution:
`/tmp/sgui-thirtyfifth-navigator-plan.json` and
`/tmp/sgui-wave35-navigator-attribution.json`. This chat read the artifacts only;
it did not execute a native run or rebuild. Coordinator lifted the freeze solely
for these owned fixture/spec/unit/report corrections after the commands settled.

The six light/dark rename, removal and Move cases passed. Accepted and self-drop
mouse cases passed, with actual attachments showing trusted dragstart/drop/dragend;
both native drops carried `intro`. Accepted order and exact request assertions
passed; self-drop left order and requests unchanged. These eight results remain
attributed to the original exact head, not re-labelled as a later-head run.

Both live-read-only failures occurred at the final attempt to reach Actions for
Introduction (original line 138), after the open menu had correctly changed all
four commands to disabled and Escape dismissed it. The trace records the next
Alt+r key but the action trigger stays disabled. The host shortcut is scoped to
its React wrapper, and the disabled opener cannot restore focus there after
menu dismissal. This is a fixture/input precondition error: the spec assumed the
next key would reach that wrapper. The corrected spec reaches the existing host
Toggle read-only button with native Tab, activates it with Enter, and asserts
both host read-only false and enabled action trigger before the removed-page edit.
It retains every live dialog/menu disabled assertion, no-request assertion and
removed-page save assertion. The new fourth composed unit covers disabling an
open menu, Escape, explicit host re-enable and reopening rename without mutation.
It does not claim that jsdom reproduces the browser's post-dismissal focus target.

The source-removal trace stopped in `page.mouse.move` at the drag threshold
(`call@136`, x=68/y=186.9296875), before the driver's event poll or drop. The final
snapshot already has `["lesson","summary"]`, host requests `[]`, removal arm
false and Lesson active. The fixture only removes on `event.isTrusted` dragstart,
so that observed host state supports trusted native start/removal; the timed-out
case produced no completed event-log attachment and is not a pass. Inspection of
the installed Playwright 1.63 Chromium DragManager explains the missing completion:
a dragstart sets `expectingDrag`, then the driver waits for `Input.dragIntercepted`
even though immediate source removal cancelled the platform drag before that
interception. This classifies the timeout as a driver cancellation path, without
claiming complete product acceptance from the snapshot.

Only the removed-source Chromium scenario now uses a fresh CDP session and real
`Input.dispatchMouseEvent` movement/press/release, bypassing that interception.
It still requires exactly one trusted dragstart, removal to the survivor order,
zero reorder requests and trusted captured events. No synthetic DragEvent or
DataTransfer is constructed or injected. Its actual event log must attach on a
successful corrected run. A native drop remains optional because removing the
source can cancel the platform drag. Firefox/WebKit retain the original native
mouse driver and remain unverified; no automatic pass or reliable-driver claim
is made for them.

The story fixture and production source are byte-identical to the original head.
All shared keyboard/native helpers and the six green keyboard bodies are also
byte-identical. Accepted/self scenarios execute the unchanged original driver
branch; the new CDP branch requires `scenario === "removed source"` and Chromium.
SHA-256 equality checks against the original head passed:

| Unchanged bytes | SHA-256 |
| --- | --- |
| keyboard reach/openActions/command/start helpers | `3888d6065b20d8f5b83b3c46a0fbc08e4bf28921ee6bad60449c79676e3197e1` |
| six green keyboard case bodies | `13aadb82e88904d624e15bd92989625871f008ba9eeeafdafb6a195e9d5b2ba5` |
| observeDrag/dragEvents/beginDrag/drop helpers | `481a9dbd11081c69cd9b45b0aeb734d5fc85bad387bf0b99856c138fdd12fcb9` |
| full story fixture | `a45a5726bf0da324fdf16f652a648bf0fe556f7c42476b11985b0f0f769ce3f1` |
| full ExperiencePageNavigator production source | `1a43e788c88dcb0bb9e7438bf30ac06f3b5d2a29c0770de78a9ddd05b647b37d` |

Correction validation: 3 navigator unit/SSR files, **14 tests pass**
(`/tmp/batch76-correction-units.log`); browser types pass
(`/tmp/batch76-correction-browser-types.log`); foundations guard passes
(`/tmp/batch76-correction-foundations.log`). The focused corrected Chromium list
contains exactly three cases (`/tmp/batch76-correction-browser-list.log`), with no
browser launched. Equality log: `/tmp/batch76-correction-unchanged-hashes.log`.
Owned light slot0 was released after the local checks. Whitespace/allowlist/link
checks passed before the correction commit. No production defect is established
by these failures; production remains read-only.

**Corrected three-case native execution is pending at the new frozen head.**
Coordinator selection, separate from the eight original greens:
`--project=chromium --grep 'live read-only and removed-page|first native mouse drag: removed source'`.
Coordinator alone chooses the fresh build and execution/acceptance disposition.
The original reds, cancellation scope, deferred Firefox/WebKit checkpoint and
M-10 intent HOLD remain visible. No unchanged native rerun occurred in this chat.


## Final coordinator result: corrected three pass, prior eight retained

Coordinator-owned wave36 executed only the three corrected navigator Chromium
cases, **3/3 passed**, at fresh shared testing candidate
`65e4c857a73ac0b0fcc86ff9f50d9fbbb1746421`. Worker attribution:
`2199b8186cb0826cbd55caaea24185831ea09003`, baseline
`036473472ffeee4e5d504d5ca76bc1431d187693`.
The attribution record is `/tmp/sgui-wave36-heading-navigator-attribution.json`;
the plan is `/tmp/sgui-thirtysixth-heading-navigator-plan.json`.
All four allowlisted worker/candidate file digests were independently verified
against that record before this report-only final edit. The final report commit
changes no executable bytes; its exact hash is sent to the coordinator.

Token: `e644960f-a690-4f5b-a6cd-6f1ed20e5a90`; navigator slot1/port6824.
Fresh build digest:
`20f093c3c5d3c4b7355b5f9e4b18429d2049a3c002445965c8ba69a1afa77952`.
Artifact root:
`/Users/thomashall/.codex/worktrees/batch45-shared-native-candidate/sg-ui/artifacts/browser-pool/e644960f-a690-4f5b-a6cd-6f1ed20e5a90/navigator-corrected-three/`.
Read and verified `evidence.json`, `results.json` and `browser.log`: exact spec,
Chromium project, corrected-case grep, three named cases and three passed results.
Coordinator verified settled commands, immutable head/source/build and released
owned leases. This chat ran no additional native/build/CI process.

| New wave36 evidence | Result |
| --- | --- |
| Live read-only dialog/menu, permitted selection, explicit host re-enable and removed-page rename guard (light) | Pass |
| Same bounded native keyboard transaction (dark) | Pass |
| First trusted native mouse start with host source removal/cancellation | Pass |

The actual removed-source attachment contains **only one trusted `dragstart`**:
`[{"type":"dragstart","trusted":true,"title":"IntroductionPage 1 • Active","source":null}]`.
The case passed survivor order and zero host request assertions. No drop/dragend
was captured; this proves the bounded host-removal cancellation path, **not stale
source data delivery to a surviving row's drop handler**. It does not establish
Firefox/WebKit driver reliability or physical-device dragging.

The eight earlier navigator passes remain historical evidence at wave35 worker
`15ba1656429a89ea1f51700995b704efd68982ed`, token
`378b8e10-1604-4ad9-ab7b-cdcef9967e97`: six light/dark rename/removal/Move cases
and two trusted accepted/self drag cases. Their unchanged story/source/helper
bytes above support retention; they were not rerun or counted again in wave36.
Thus the report records eight original passes plus three fresh corrected passes,
not an eleven-case run at the shared candidate. Original wave35 three-red artifacts
remain intact and the correction history remains visible.

The **whole wave36 root run failed** because four unrelated heading restoration
cases failed. The navigator partition pass is not a full shared-run/check pass,
dev acceptance, integration or whole-M-10 closure. Firefox/WebKit, AT/manual/device
checks, broad U/X/R/Z gates and the disputed M-10 previous/next/link intent remain
pending/HOLD. Coordinator alone owns integration and acceptance records. This
finalization modifies only this unique report; fixture, unit, spec, production,
contracts and master remain frozen and unchanged.
