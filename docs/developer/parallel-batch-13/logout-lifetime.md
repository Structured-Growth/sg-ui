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

Fresh Storybook/browser execution remains pending: the shared
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

Reserved next scope: run `tests/browser/batch13-logout-lifetime.spec.ts` against a
fresh build containing this story through the coordinator-approved browser route;
record exact tested head, engines, counts and native focus outcome. Any required
browser infrastructure change belongs outside this task. Adapter identity API or
organization-switch result lifetime needs a separate allowlist/task and demonstrated
regression. No broader source change is included here.

This subsequent commit records PR/head evidence only; final report head is supplied
in the coordinator handoff. No source changes followed the tested implementation.
