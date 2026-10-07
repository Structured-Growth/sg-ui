# M-28 alignment direction native regression

Base: reviewed `codex/dev` commit `4c9f859bad204a7d7fd2e3787aa6f293db268525`.
Branch: `codex/batch38-align-direction-native`.
Worktree: `/Users/thomashall/.codex/worktrees/batch38-align-direction/sg-ui`.

## Evidence and scope

The [batch31 inventory](../parallel-batch-31/inventory-acceptance-25-37.md)
identifies missing native LTR/RTL logical start/end versus physical left/right
command evidence. Existing Center and
[portal-direction cases](../../../tests/browser/batch05-portal-direction.spec.ts)
are prerequisites and are not duplicated here. The
[menu contract](../react-aria-editor-menus.md) leaves alignment and indentation
state with the host.

The [DirectionCommands story](../../../src/components/TextAlignMenuControl/TextAlignMenuControl.stories.tsx)
records requests without accepting their alignment. F2 represents an external
host selection replacement while the menu is open. Outdent has a callback but
is host-restricted; Indent has no callback. The
[focused spec](../../../tests/browser/inventory-align-direction.spec.ts) has four
cases, two in each explicit visual direction with the same English locale:

- Compare visible logical icon paths with physical left/right icon paths in the
  actual browser CSS cascade; verify physical icons have no mirroring transform,
  logical trigger icons and unchanged physical labels.
- Activate physical left/right and logical start/end using native keyboard input;
  assert exact ordered host requests, unchanged controlled alignment, closure and
  trigger focus after each command.
- Replace the host value while open; assert exactly one checked radio item and
  updated trigger label/icon, without delivering a command.
- Navigate End and wrapping arrows past both unavailable indentation commands;
  Escape closes and restores focus to the updated trigger without any request.

Two new colocated unit cases exercise live replacement and unavailable-command
navigation in LTR/RTL. No demonstrated product defect required implementation,
CSS, public API, shared Menu, editor, or toolbar changes. All writes are inside
this task's exclusive allowlist.

## Executed targeted validation

On 2026-10-07, in the isolated worktree, using atomic token-owned installation
and light-validation slots (released only after matching ownership):

- `pnpm install --frozen-lockfile`: pass; lockfile unchanged. pnpm reported its
  existing ignored esbuild build-script warning; no approval/config change made.
- `pnpm exec vitest run src/components/TextAlignMenuControl/TextAlignMenuControl.test.tsx --maxWorkers=1`:
  pass, one file/eight tests, 1.35 seconds.
- `pnpm typecheck`: pass.
- `pnpm exec tsc --noEmit -p tests/browser/tsconfig.json`: pass.
- `pnpm foundations:check`: pass.
- `pnpm tokens:check`: pass.
- `git diff --check`: pass.

No failed behavior run occurred in this worker. An initial read in the primary
checkout could not find the development-validation document; it was available
and read at the required reviewed worktree base. That path lookup is not product
or test failure evidence.

## Coordinated immutable Chromium evidence

Coordinator wave21 ran at exact source/spec head
`0228f521c302ea8ead9200f7722f0bd611116551`, source tree
`8eaf432f8ff5f05e5bed1d0c32cf7c5dd5deef33`, on 2026-10-07.
Actual `evidence.json`, `results.json`, `browser.log`, `types.log` and the
successful build-log ending were inspected after coordinator release.

Artifact root (local ignored output, preserved):
`/Users/thomashall/.codex/worktrees/batch38-align-direction/sg-ui/artifacts/browser-pool/c36d8b90-b18e-4418-964d-75058806e9f1/`.
Runtime: Node `v24.19.0`, pnpm `10.29.3`, Playwright `1.63.0`, Darwin
OS release `27.0.0`; isolated slot 6, loopback port 6309. Pool bounds were eight
slots and four simultaneous builds. The coordinator ran:

- `pnpm exec storybook build --output-dir <artifact root>/storybook`: pass.
- `pnpm exec tsc --noEmit -p tests/browser/tsconfig.json`: pass.
- `pnpm exec playwright test tests/browser/inventory-align-direction.spec.ts --project=chromium`:
  **four passed**, zero failed/skipped/flaky; one worker, no retries, 3.640 seconds.

All four named LTR/RTL cases passed on attempt zero. Results contain no global
errors. Browser execution ran 11:34:47–11:34:52 America/Chicago
(`16:34:47.886Z`–`16:34:52.439Z`). Initial/final heads match the tested head and
final Git status is clean. Build digest before and after browser execution was
`ef2d8f8247fc4a4c0f9b077397cc09b0c5b2e2200c1b6804aae965d187ae24d9`.
No rebuild or worker rerun occurred. Logs retain non-failing color-environment
and bundle-size warnings; these are tooling/build advisories, not failed native
behavior. No failed browser cases require product/driver/environment triage.

Coordinator released the freeze for this report-only finalization. Source,
story and spec remain unchanged from the tested head; the report-only delivery
commit is supplied separately. No independent heavy/native run was started.

## Remaining limits

Firefox/WebKit remain **pending** the coordinated batch checkpoint. Future
failures must retain their original evidence and product, driver/expectation,
environment or unclassified attribution. This Chromium pass establishes only
the four focused native cases, not completion of M-28 or broad G/U/X/R/Z
acceptance. Physical devices, assistive technology, translated label review and
real host-editor selection semantics remain outside these automated checks.

No full per-task check, worker Storybook build, CI/title dispatch, main merge,
publish, secrets/permissions change or master-checkbox upgrade occurred.
Coordinator alone reviews and integrates. This finalization changes only this
unique report; source/spec reservations may be released by the coordinator on
review of the recorded proof.
