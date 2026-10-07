# Account action lifetime audit (H-04/H-05 partial)

Baseline: `d0fcc6298004ad23d1a75480b216b39142e6df96`.
Branch: `codex/batch11-account-action-lifetime`.
Worktree: `/Users/thomashall/.codex/worktrees/batch11-account-action-lifetime/sg-ui`.

## Contract and coverage gap

The [host adapter contract](../react-aria-host-adapter-acceptance.md#account-ownership)
intentionally passes callbacks, promises and rejection reasons through unchanged.
The adapter owns no pending state, cancellation, automatic retry, navigation,
credential storage or session refresh. Replacing a provider changes callbacks for
new renders; it does not cancel a host promise already returned to a caller.
The composed action owner must decide whether a completion remains applicable.

Existing account tests covered disabled defaults, presentation record identity,
lazy getters, arguments, one pending operation and one rejection. Existing
SideNavigation tests covered rejection/retry and concurrent organization-action
guards. The host-controlled async story already covers pending, rejection and
retry. These did not cover adapter provider lifetimes or overlapping independent
requests. This change adds those missing regressions without changing runtime
behavior, public APIs or stories.

Added account tests cover:

- Replacing host callbacks during an old request, then settling that request with
  success or its original Error object and cause.
- Removing a provider while a request is pending: new calls use disabled no-op
  defaults, while the original host promise remains caller-owned.
- Unmounting and remounting an independent provider before old success/rejection,
  preserving both the new host callbacks and a structured rejection reason.
- Nested provider replacement/removal and sibling/root provider isolation.
- Overlapping same-account and all-account calls, out-of-order rejection, explicit
  retry before the oldest request settles, and exact diagnostic identity.

No adapter defect was demonstrated. Tests confirm settlement does not itself
invoke presentation getters or organization/session mutation callbacks.

## Local validation

Node `v24.21.0`, pnpm `10.29.3`, Vitest `4.1.11` (resolved lockfile).
Commands run in the isolated worktree using the existing `/tmp/sgui-run24.mjs`
launcher, which prepends the installed Node 24 binary directory to PATH:

- `node /tmp/sgui-run24.mjs install --frozen-lockfile` — passed.
- `node /tmp/sgui-run24.mjs exec vitest run src/adapters/accounts.test.tsx src/components/SideNavigation/SideNavigation.test.tsx`
  — passed, 16 tests across two files (9 account, 7 SideNavigation).
- `node /tmp/sgui-run24.mjs typecheck` — passed.
- `git diff --check` — passed.

Logs: `/tmp/sgui-batch11-account-install.log`,
`/tmp/sgui-batch11-account-unit.log`, `/tmp/sgui-batch11-account-typecheck.log`.
Only the account tests and this evidence record change. No native interaction,
focus or timing implementation changes require new browser evidence. No heavy
build/browser process or shared validation lock was used. Full check, Storybook,
consumer/browser matrix and paused dev GitHub CI/title checks were not run.
See [development validation policy](../react-aria-development-validation.md).

## Reserved shell follow-up and limits

Read-only inspection of SideNavigation's `handleLogoutAccount` and
`handleLogoutAll` shows post-await getters/navigation and finally/catch state
updates without an explicit mounted/provider-generation guard. This is an
out-of-scope concern, not a newly reproduced shell regression or an adapter bug.
A next bounded task should own SideNavigation implementation/tests/stories and
reproduce late success/rejection after callback replacement, provider removal and
unmount; decide the composed action's completion policy before changing it.
Organization action lifetime should be audited by that shell owner too.

These tests establish React context and promise pass-through behavior, not native
shell navigation, production auth/network cancellation, device or spoken
assistive-technology acceptance. Broad H-04/H-05 and G/U/X/R/Z gates remain open.
Central guidance needs no runtime-contract change; a coordinator may link this
partial evidence record from the central host acceptance document.
