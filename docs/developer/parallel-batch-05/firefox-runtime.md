# Batch 05: Firefox runtime (R-11/X-12 environment gate)

## Scope and result

The bounded diagnostic reproduced `Could not find profile folder` before page
execution in both Playwright and a direct native Firefox process. Node verified
the explicit canonical profile was writable, yet both profiles remained empty.
The native process exited 1 immediately, with no timeout, signal or screenshot.
The shared Firefox app-data listing returned `EPERM`.

This isolates the symptom from SGUI, Storybook, a test runner and (for the direct
launch) Playwright's automation protocol. The denial supports the macOS app-data
restriction hypothesis in [upstream issue 42768](https://github.com/microsoft/playwright/issues/42768),
without proving the sole cause. The prerequisite remains unresolved: a host/runtime
able to access Firefox's required app-data and launch the bundled executable,
or the required Linux CI environment. Stop local Firefox acceptance work until
that prerequisite changes. No product behavior defect or Firefox acceptance pass
is claimed. R-11/X-12 and broad acceptance gates remain open.

## Files and ownership

- `scripts/diagnose-firefox-profile.mjs`: two bounded standalone probes, runtime
  and read-only app-data evidence, atomic shared lock, owned temporary profiles,
  exact-owner Python lock cleanup; exits nonzero on failure or lock contention.
- [Troubleshooting guide](../../troubleshooting/firefox-profile-launch.md): supported
  arguments, usage, observed local result, environment prerequisite and historical CI.
- `docs/developer/parallel-batch-05/firefox-runtime.md`: this completion record.

Worktree: `/Users/thomashall/.codex/worktrees/batch05-firefox-runtime/sg-ui`.
Branch: `codex/batch05-firefox-runtime`.
Clean exact baseline verified before edits: `cca9452f384d5ffaa34ad5bd4ddd015b43a2870b`.
Implementation/tested launch head: `115a2dfb633a7a572a911f9b42807f5886170d18`.
Final commit is the report/result-only commit containing this record; its exact
hash is provided in the coordinator completion message and draft PR head.
Draft PR: [#27](https://github.com/Structured-Growth/sg-ui/pull/27), against `codex/dev`.
Only the three allowlisted files changed. Primary and other checkouts were preserved.

## Exact validation and runtime

Runtime: macOS 27.0.1 / build 26A434, Darwin 27.0.0, Apple Silicon;
Node `v24.21.0`, Playwright `1.63.0`, bundled Firefox build `1543`.
No dependency install was needed: the diagnostic reused the existing locked package
at `/Users/thomashall/Repositories/sg-ui/node_modules/@playwright/test` read-only.
Node 24 binary used for every script command:

```sh
task_node=/Users/thomashall/Library/pnpm/store/v11/links/@/node/24.21.0/8e3363dcf6f5ccdfdbb0a5b55fe716a72499ddb103e848ba9405f4e34d178319/node_modules/node/bin/node
```

- `"$task_node" --check scripts/diagnose-firefox-profile.mjs`: passed.
- `"$task_node" scripts/diagnose-firefox-profile.mjs --help`: passed, exit 0.
- Same command with `--invalid` or a missing value after `--owner`: rejected,
  exit 1, before importing/launching Firefox. Python subprocess assertions checked
  those exit codes.
- `"$task_node" scripts/diagnose-firefox-profile.mjs --metadata-only --playwright-module /Users/thomashall/Repositories/sg-ui/node_modules/@playwright/test`:
  passed, reported runtime/executable and app-data `EPERM`; no launch.
- `"$task_node" scripts/diagnose-firefox-profile.mjs --owner 01a11673-d610-7a21-8f5c-7ee133ca6623 --playwright-module /Users/thomashall/Repositories/sg-ui/node_modules/@playwright/test`:
  occupied-lock attempts correctly refused, exit 2, without launching or removing
  another worker's lock. Waits only observed lock presence. Once free, exactly one
  two-probe diagnostic ran at the implementation head above: **exit 1**, both probes
  failed before a page opened with `Could not find profile folder`. Each probe had
  a ten-second bound; neither required timeout termination.
- Launch output: `/tmp/sgui-batch05-firefox-diagnostic.json`. Profile writable:
  `true`; persistent/native directory entry counts: `0` / `0`; native exit code:
  `1`, signal: `null`, timedOut: `false`, screenshotCreated: `false`.
- Read-only `ls -ld` showed the existing app-data root with the current user's
  ownership and mode 700; Python directory listing also returned `PermissionError`
  (`Operation not permitted`). No write probe targeted personal app-data.
- `git diff --check` and local Markdown link/path verification: passed.

The launch acquired `/tmp/sgui-parallel-batch-01-validation.lock` atomically under
chat owner `01a11673-d610-7a21-8f5c-7ee133ca6623`. Cleanup removed its temporary
profile root and used Python to verify this exact owner before removing its lock.
No other browser process or worker was stopped. No reinstall or unchanged TMPDIR
retry, shared config edit, engine skip/reduction, system/browser setting or branding
mutation, Storybook build, full check, full browser or consumer suite ran.
The final commit changes only documentation; launch code remains the tested version.

## Read-only CI evidence

Commands: `gh run list --workflow ci.yml --status success --limit 3 --json databaseId,headSha,url`,
`gh run view 37623617280 --json jobs,headSha,conclusion`, and
`gh run view 37623617280 --job 112799737093 --log` with focused log filtering.
[Historical Node 24 Linux job](https://github.com/Structured-Growth/sg-ui/actions/runs/37623617280/job/112799737093)
on `4fbab81aa4b992e6dff475b98ec0f3a4d06b9a5d` passed 174/174 browser cases
across all three engines, using Node 24.21.0 and Firefox 155.0/build 1543.
Its logs also explicitly passed Firefox React 18/19 and Next.js hydration checks.
This earlier run is evidence of a working Linux runtime, not validation of this
batch's head or macOS environment. No new CI run was dispatched as a diagnostic.

## Limits, next task and central guidance

Local Firefox product behavior remains unverified. Actual physical devices,
assistive technologies, manual OS access review and broad acceptance remain open.
There is no browser configuration or library defect demonstrated in this slice.

Next bounded task: machine-owner/runtime investigation of the app-data access
denial, followed by this same standalone diagnostic once the environment changes.
If both probes pass, run only the affected focused Firefox specs; alternatively
record the required Linux CI results for their exact tested heads. Do not repeat
unchanged browser reinstalls or temporary-directory attempts.

Proposed coordinator guidance update: link the troubleshooting guide from the
browser acceptance/environment section, replace repeated local retry suggestions
with this prerequisite, and keep historical CI and current-head acceptance distinct.
Central guidance is outside this allowlist and was not edited.
