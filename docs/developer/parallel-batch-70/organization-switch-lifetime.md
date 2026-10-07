# Batch 70 organization-switch lifetime

Task references: M-09 / H-04 / H-05. Reviewed baseline:
`2d6f357d10b2a65bc988aba6280e69f92f3b1147`.
Isolated managed worktree: `batch70-organization-switch-lifetime/sg-ui`.

## Confirmed defect and bounded correction

`SideNavigation.handleOrganizationSelect` awaited the host callback without an
operation owner. After callback/account integration replacement or unmount, its
success still invoked captured session setters/markers/readers and persisted the
old organization. Failure still exposed an obsolete error; finally could release
the shared account lock belonging to a newer operation.

The switch now owns a private token. Effect cleanup invalidates that token on
unmount or changes to `onOrganizationChange`, account enablement, session readers,
the active-session setter, organization marker or organization storage key. Only
an owned pending switch releases its lock during invalidation. Success, error and
finally branches require the same current token. Replacement makes current actions
available immediately; an obsolete completion cannot close the current menu or
release a newer switch. Logout ownership remains separate.

The current accepted transaction remains callback → account activation (when
applicable) → organization persistence → marker → session refresh → menu close.
Current failures expose the existing translated retry message. Concurrent
switch/logout requests remain blocked. No public API, host policy, routing or
translation changes. Hosts should keep callback/adapter function identities stable
while they intend a request to remain current.

An already invoked host callback and its network/host effects continue independently.
SGUI cannot undo those effects or abort the host request. This correction suppresses
only later library-owned adapter invocations, persistence and UI results.

## Local evidence

Node 24 PATH:
`/Users/thomashall/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin`.
Frozen dependency installation completed using owned install slot 0; targeted
validation used owned lightweight slot 1. Slots were released after use.

- Initial baseline regression run: 13 failed, 2 passed (15 tests). Replacement
  remained disabled; unmounted late success still read the old adapter.
- Additional direct baseline result proof: `--maxWorkers=1 -t 'suppresses deferred'`
  produced 4 failures, 15 skipped. Both callback and adapter replacement allowed
  stale success to invoke the old marker/setter and stale rejection to show an alert.
- Corrected targeted suite: 47 passed across the new 19 organization tests and
  existing SideNavigation behavior/helper tests. Includes callback, adapter,
  session setter, marker, storage key, provider removal and unmount boundaries;
  both settlements; newer-operation ownership; valid rejection/retry/concurrency.
- `pnpm exec tsc --noEmit`: passed for production and stories.
- `pnpm exec tsc --noEmit -p tests/browser/tsconfig.json`: passed.

Temporary local logs: `/tmp/batch70-organization-red.log`,
`/tmp/batch70-organization-results-red.log`, `/tmp/batch70-organization-green.log`.

Frozen targeted unit arguments:

```sh
pnpm exec vitest run src/components/SideNavigation/SideNavigation.organization-lifetime.test.tsx src/components/SideNavigation/SideNavigation.test.tsx src/components/SideNavigation/SideNavigation.helpers.test.ts --maxWorkers=1
```

## Coordinator native proof handoff

Story ID: `navigation-sidenavigation-organization-lifetime--deferred-switch`.
Six browser tests cover callback/adapter replacement with success/failure plus
unmount with success/failure. Native keyboard and pointer menu actions initiate
requests; fixture controls simulate host lifecycle/settlement through DOM clicks
outside the menu. Tests check the current menu focus, disabled lock, adapter commit
log, persistence, trigger focus and no library navigation. The fixture separately
counts host settlements to show that obsolete host work still completes.

Frozen focused browser arguments (coordinator's fresh shared static Storybook only):

```sh
pnpm exec playwright test tests/browser/batch70-organization-switch-lifetime.spec.ts --project=chromium --workers=1
```

No independent Storybook build, browser execution, full check or GitHub CI was run,
per the bounded local policy. The coordinator owns the fresh shared snapshot build,
small Chromium proof and further FW checkpoint. Physical-device and assistive
technology acceptance remain unverified; this evidence does not close broad gates.

## Exclusive files

- `src/components/SideNavigation/SideNavigation.tsx`
- `src/components/SideNavigation/SideNavigation.organization-lifetime.test.tsx`
- `src/components/SideNavigation/SideNavigation.organization-lifetime.stories.tsx`
- `tests/browser/batch70-organization-switch-lifetime.spec.ts`
- `docs/developer/parallel-batch-70/organization-switch-lifetime.md`

Existing tests/stories, shared adapters, AGENTS, master list and shared documentation
were read only. No main checkout, other worktree, release or workflow changes.
