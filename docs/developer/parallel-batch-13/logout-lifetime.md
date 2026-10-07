# Batch 13 — logout lifetime

H-04/H-05 bounded SideNavigation slice. Baseline:
`b139a0d06fb06ba4a5a5aa6adc69c5cb3b206818` (verified before isolation).
Managed, attached worktree:
`/Users/thomashall/.codex/worktrees/batch13-logout-lifetime/sg-ui`.
Branch: `codex/batch13-logout-lifetime`; draft [PR #79](https://github.com/Structured-Growth/sg-ui/pull/79) targets `codex/dev`.
Implementation/tested head: `52c1173cda035c51db22e3856d1c103b698500cf`.

Exclusive write allowlist: `src/components/SideNavigation/`,
`tests/browser/batch13-logout-lifetime.spec.ts`, and this report. Account adapter,
shared guides/checklists/configuration/barrels and other worktrees stayed read-only.

## Demonstration and fix

Existing SideNavigation tests covered ordinary failed logout/retry and concurrent
organization operations, but no logout result crossing a shell lifetime boundary.
The earlier adapter-only slice preserved promise identity and explicitly reserved
shell post-await handling (reviewed its existing completion/PR evidence).

Twelve deferred-result combinations cover per-account/all-account logout,
success/rejection and adapter replacement/removal/unmount. With the baseline
implementation and final regression harness: eight failed, four passed, seven
existing tests skipped. Success after removal/unmount still read old sessions and
navigated; replacement left the new host locked behind the old request.

SideNavigation now tracks the current logout request and invalidates it when the
adapter's enabled state, logout callbacks or session getters change, or when the
shell unmounts. Obsolete success cannot refresh sessions, close the menu or navigate;
obsolete rejection cannot show an error. Obsolete cleanup cannot unlock a newer
request. Replacement releases the old shell pending state so the new host can
start a request. Errors use the existing translated fallback. Public APIs, native
refs and host routing/logout ownership are preserved. No host request is aborted
or rolled back. Organization-switch lifetime remains a separate assignment.

The colocated `LogoutLifetime` story provides host replacement/removal/unmount and
oldest-request success/rejection controls. The browser regression has four cases
using native Enter activation and focus checks across replacement plus a newer
request; DOM clicks simulate the host updates while the menu is modal.

## Local validation

Runtime: Node `24.21.0`, pnpm `10.29.3`, React `19.2.3`, Vitest `4.1.11`.

- `pnpm install --frozen-lockfile`: passed; no tracked dependency changes.
- `pnpm exec vitest run src/components/SideNavigation/SideNavigation.test.tsx --maxWorkers=1 -t 'ignores late'` with baseline source temporarily restored: expected failure, 8 failed / 4 passed / 7 skipped. Fixed source restored in `finally`.
- `pnpm exec vitest run src/components/SideNavigation/SideNavigation.test.tsx --maxWorkers=1`: passed, 19 tests.
- `pnpm typecheck`: passed.
- `pnpm foundations:check`: passed.
- `pnpm exec tsc --noEmit -p tests/browser/tsconfig.json`: passed.
- `pnpm exec vitest run src/components/SideNavigation/SideNavigation.test.tsx src/adapters/accounts.test.tsx --maxWorkers=1`: passed, 2 files / 21 tests.
- `pnpm tokens:check`: passed.
- `git diff --check`: passed.

Install used an atomic owned slot under `/tmp/sgui-install-slots` (limit two).
Every targeted unit/type/guard command used an atomic owned light-validation slot
under `/tmp/sgui-light-validation-slots` (limit four); Vitest used one worker.
Slots release only after matching their unique owner token. Queuing is not a pass.

At the initial handoff, fresh Storybook/browser execution was pending: the shared
`/tmp/sgui-parallel-batch-01-validation.lock` is owned by another chat and
`/tmp/sgui-browser-validation-priority.json` reserves earlier focused native work.
The browser pool is under review; this task did not bypass it, steal a lock,
remove another owner, stop another worker or retry Firefox. The prepared browser
cases have type evidence only, not native acceptance. Full check/Storybook/matrix
runs and paused GitHub CI/title runs were not dispatched.

## Limits and follow-ups

No whole H/U/X/R/Z, physical-device or assistive-technology gate closes.
An adapter object replaced with exactly the same callbacks/getters is indistinguishable
through the existing hook; this slice covers changed callbacks/getters and provider
removal. Host network cancellation, session/asset cleanup and authority remain host-owned.

The initially reserved focused Chromium run is now complete as recorded below.
Remaining browser scope: Firefox/WebKit at the coordinator batch checkpoint. Any required
browser infrastructure change belongs outside this task. Adapter identity API or
organization-switch result lifetime needs a separate allowlist/task and demonstrated
regression. No broader source change is included here.

This subsequent commit records PR/head evidence only; final report head is supplied
in the coordinator handoff. No source changes followed the tested implementation.


## Recovery and first native pool diagnosis

The original managed worktree path became unavailable before the prerequisite
merge. The coordinator authorized one API-created/attached recovery at
`/Users/thomashall/.codex/worktrees/batch13-logout-lifetime-recovery/sg-ui`, from
retained `0790d106682e7ef907c51a460e024e7c7027dfc2`. A normal full-history merge
of reviewed `6b9da4423f1e6675c37571d5552474da25e90258` produced clean frozen
head `6b3ff72bfe87d6168625539f50b066b9ee05909b`. Task source/spec bytes were
unchanged. One frozen install passed under an owned atomic install slot on Node
24.21.0; no worker build/server/browser launched.

The coordinator's Chromium pool run at that exact head failed all four cases
at the same incorrect disabled-item focus assertion. This is one test expectation
issue, not four product bugs or a lifetime acceptance pass. The completion and
trigger restoration assertions following that point were not reached. Evidence:
`artifacts/browser-pool/5c85af33-6b31-4ebb-a0f3-719df89d74b8/` in the recovery
worktree. Initial/final head and clean status match; immutable build SHA-256 is
`9273b92b032039f9add7f02f8de2d5d5864b417be82da6ab346180e5debd21cf`.

Read-only inspection of browser.log, error context, trace snapshots, installed
React Aria 3.52.1 and reviewed Menu `d8b6c49cebc49185650dda3168db733073318e4f`
explains the failure. `useSelectableItem` removes tabIndex and clears the focused
key when that item becomes disabled; `useSelectableCollection` moves native focus
to the collection when the key becomes null. Trace snapshots show the disabled
logout losing focused/tabindex state and the menu changing to tabindex 0 before
the late-result focus assertion. The reviewed Menu reconciliation deliberately
excludes disabled items and requires an enabled committed focused key; its virtual
entry fix cannot restore a now-disabled logout action and is not needed here.

The corrected spec retains concrete native focus assertions: after starting the
replacement request it requires focus on the menu, uses real ArrowDown to reach
the enabled Manage Profile item, and requires that item's native focus to remain
after obsolete success/rejection. Pending-state, no-navigation/no-alert, menu
visibility, newer-request completion and trigger restoration assertions are retained.
Only the spec and this evidence record changed; no product/shared Menu source was
changed. The corrected native run subsequently passed as recorded below. Firefox
and WebKit are explicitly deferred to the batch checkpoint under the latest policy;
no broad native/device/AT gate closes.

Changed-spec `pnpm exec tsc --noEmit -p tests/browser/tsconfig.json` passed on
Node 24.21.0 under one atomic owned light-validation slot; `git diff --check`
passed. No unchanged unit suite or browser run was repeated by the worker.


## Final focused Chromium evidence

After the coordinator selected and froze corrected head
`089077fdabddab111f20ba9fda0119f8d1463d57`, its nineteenth pool completed
all **4 Chromium cases**, with zero skipped, flaky or unexpected cases and no
retries. The worker independently read evidence.json and results.json. Source
initial/final head match, final tracked status is empty, and the immutable build
initial/final SHA-256 matches:
`d4f03689dbc7c49c0a8b49819185c922de046712669091b3758a57e6313770c6`.

Evidence directory in the recovery worktree:
`artifacts/browser-pool/e5dbf5d2-62dd-48bc-9a4d-eb7e4b908410/`.
Runtime: Node 24.21.0, pnpm 10.29.3, Playwright 1.63.0 on macOS.
Commands recorded by the coordinator supervisor:

- `pnpm exec storybook build --output-dir <evidence-directory>/storybook`
- `pnpm exec tsc --noEmit -p tests/browser/tsconfig.json`
- `pnpm exec playwright test tests/browser/batch13-logout-lifetime.spec.ts --project=chromium`

Result duration: 3.16 seconds. The corrected assertions reached menu-container
focus recovery, real ArrowDown into enabled Manage Profile, preserved focus after
obsolete success/rejection, newer-request completion and restored trigger focus.
Per-account and all-account logout both passed. The earlier four failures remain
recorded above as the classified disabled-item expectation error.

The coordinator released the freeze for this report-only update. Task source and
spec remain byte-for-byte identical to the passed head; no redundant native,
light-validation or build command ran. Final report-only head is supplied in the
coordinator handoff and the same draft PR #79 evidence is updated. Coordinator
alone reviews/integrates. Firefox/WebKit remain pending the batch checkpoint;
broad H/U/X/R/Z, manual/device/assistive-technology acceptance stays open.
