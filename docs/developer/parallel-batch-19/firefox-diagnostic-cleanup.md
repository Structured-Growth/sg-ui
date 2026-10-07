# Firefox diagnostic cleanup fix — batch 19

## Scope and evidence

This isolated worker starts at verified local commit
`68339aca75ba9a5472d52f3af5bd26d04e441154` in the attached managed worktree
`/Users/thomashall/.codex/worktrees/firefox-diagnostic-cleanup/sg-ui`.
The only changed files are the diagnostic script, its uniquely named mock
regression file, and this report. The coordinator alone integrates the commit.

The coordinator reported that its single post-restart probe could read Firefox
application-data metadata and produced a native screenshot, but the owned native
child's exit callback threw `EPERM` from `process.kill(-child.pid, 'SIGKILL')`.
That uncaught callback exception prevented report emission and normal `finally`
cleanup. Read-only directory metadata inspection of the retained diagnostic root
`/var/folders/vp/bckxx0097z9gb5q8_d1chsvh0000gn/T/sgui-firefox-diagnostic-EENac3`
confirmed `native.png` exists (5,763 bytes), alongside the two temporary profile
directories. No profile contents were read, and no retained artifacts were changed.
Screenshot existence does not certify a completed Firefox probe or browser gate.

## Resulting behavior

The native probe still signals only its own detached child's negative PID with
`SIGKILL`, uses the same 10-second timeout, and retains its exit code, signal,
output and screenshot-existence result. `ESRCH` remains benign. Other signal
errors become structured `cleanupErrors` with their phase, error code and message,
instead of escaping an event callback.

A completed zero-exit screenshot still reports `page-captured`, even when its exit
cleanup has an error. Such cleanup errors make the overall `resolved` field false
and set the script's exit code to 1: the capture evidence survives, while cleanup
is not certified. A timed-out probe always reports `failed`, even if a screenshot
and eventual zero exit code exist.

If the timeout signal itself fails, the promise settles without waiting forever
for `close`. It reports null exit code/signal, `childMayStillBeRunning: true`, and
`retainedTemporaryRoot`; it fails overall and preserves the temporary profile
rather than removing files potentially in use. This explicitly leaves inspection
and any further owned-process cleanup to the coordinator. The existing Python
lock cleanup continues to verify the exact owner before removing its own marker
and lock. No shared lock policy or helper configuration was changed.

## Validation

`node --test scripts/diagnose-firefox-profile.test.mjs` passed all 6 tests on
Node v26.5.0. The tests execute the actual script source in a VM with mocked
subprocess events, filesystem calls, timers and owner-check cleanup. They cover:

- Successful screenshot plus exit-time `EPERM`: report emitted, evidence preserved,
  cleanup failure visible, nonzero script result, temporary-root cleanup reached.
- Normal termination and `ESRCH`: successful capture remains successful.
- Live-child timeout `EPERM`: finite failed report and temporary-profile retention.
- Timeout followed by zero exit and screenshot: remains failed.
- Missing screenshot and nonzero native exit: remain failed.
- Unverified lock owner: nonzero script result without JavaScript lock removal.

The run acquired `/tmp/sgui-light-validation-slots/1` atomically, wrote its unique
owner marker, and removed only that slot after exact owner verification. It did
not acquire or alter the shared browser lock. No actual subprocess was spawned by
the mocked diagnostic; no browser, server, installation, build, CI, reinstall or
TMPDIR retry was run. Repository-wide `pnpm check` and `pnpm build-storybook` were
not run because this worker's explicit authorization prohibits builds and limits
validation to lightweight tests.

## Coordinator handoff

The fix and mock coverage are ready for review and the coordinator's one authorized
confirmation probe. Runtime Firefox behavior, report completion on the real host,
physical process cleanup and browser acceptance statuses remain uncertified by
this worker. No draft PR is required for this local handoff; the managed worktree
and conventional fix commit preserve the result for coordinator integration.
