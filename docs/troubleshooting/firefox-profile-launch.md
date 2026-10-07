# Firefox profile launch on macOS 27

This R-11/X-12 environment diagnostic runs before SGUI browser tests. A launch
failure provides no evidence about component behavior. Firefox remains required
in the unchanged three-engine CI matrix. See the
[browser acceptance record](../developer/react-aria-browser-acceptance.md) and
[development validation policy](../developer/react-aria-development-validation.md).

## Bounded reproduction

Use the repository's installed, locked Playwright package with Node 24. The
diagnostic does not need Storybook, a server, or a full test suite:

```sh
node scripts/diagnose-firefox-profile.mjs --owner YOUR-CHAT-ID
```

It acquires `/tmp/sgui-parallel-batch-01-validation.lock` atomically and refuses
to launch when another worker owns it (exit 2). It releases only its exact owner
using Python; Python 3 must be available. Never delete another worker's lock.
For an isolated worktree without dependencies, `--playwright-module` accepts an
absolute path to an already installed `@playwright/test` package. This reuses
only the package; it does not edit that checkout. Record its version in the
output. `--metadata-only` lists runtime/path/readability evidence without
acquiring the browser lock or starting Firefox.

The launch diagnostic creates two disposable profiles, then removes them:

1. Playwright `launchPersistentContext` with an existing, verified writable,
   canonical profile path and a ten-second launch timeout; success requires
   opening `about:blank`.
2. The same bundled executable with Mozilla's supported `--no-remote`,
   `--headless`, `--profile`, and `--screenshot` arguments; success requires
   exit zero and a screenshot of `about:blank`. Its owned process group is
   killed after ten seconds or when the parent exits, without targeting other
   workers or personal browsers.

Both probes must succeed for exit zero; any failed probe returns exit 1. These
are environment probes, not product acceptance tests. Output includes native
arguments, errors, exit status and profile entry counts, but no personal profile
contents. Profile output paths are removed before the diagnostic completes.

Supported API/argument references:
[Playwright BrowserType](https://playwright.dev/docs/api/class-browsertype),
[Mozilla command-line parameters](https://firefox-source-docs.mozilla.org/browser/CommandLineParameters.html).

## Environment prerequisite

Changing `TMPDIR` and reinstalling the same Firefox build already failed in
earlier batches. Do not repeat these unchanged. An explicit `--profile` controls
the temporary profile, but Firefox also resolves its shared app-data directory.
[Upstream Playwright issue 42768](https://github.com/microsoft/playwright/issues/42768)
reports macOS 27 protection of `~/Library/Application Support/Firefox` affecting
command-line launches. Treat that diagnosis as a hypothesis until local evidence
supports it; a generic graphics/sandbox log line alone does not establish it.

When the app-data listing returns `EPERM` and both writable-profile probes fail
before opening a page, stop local browser acceptance work. The prerequisite is a
host/runtime that can launch bundled Firefox and access its required app-data
root, or the required Linux CI environment. The machine owner can investigate
OS-managed access separately; this diagnostic does not grant permissions, change
browser branding, redirect personal state, disable sandboxes, reinstall browsers,
or edit shared Playwright configuration. Re-run just this diagnostic after an
environment change, then run the affected focused Firefox cases if it succeeds.

## Historical CI evidence

[CI run 37623617280](https://github.com/Structured-Growth/sg-ui/actions/runs/37623617280/job/112799737093)
passed on head `4fbab81aa4b992e6dff475b98ec0f3a4d06b9a5d` with Linux,
Node 24.21.0 and Firefox 155.0 / Playwright build 1543. Read-only logs show
174/174 browser cases across all three engines, plus explicit Firefox React 18/19
and Next.js hydrated-interaction passes. This establishes historical working
Linux evidence; it does not validate the batch-05 head, macOS launch behavior,
physical devices, or assistive technologies. The
[batch-05 completion report](../developer/parallel-batch-05/firefox-runtime.md)
records the current local diagnostic and its limits.

## Batch-05 local result (2026-10-07)

On macOS 27.0.1 (build 26A434, Darwin 27.0.0), Node 24.21.0,
Playwright 1.63.0 and bundled Firefox build 1543, both probes failed immediately
with `Could not find profile folder`. The existing canonical profile passed a
Node write/read-path check, but both Firefox profile directories stayed empty.
The native process exited 1 without a signal or timeout and created no screenshot.
Listing the shared Firefox app-data directory returned `EPERM`.

This reproduces the failure without SGUI, Storybook, a test runner, or Playwright's
automation protocol in the native probe. Together with the access denial it
supports the upstream app-data restriction hypothesis; it does not prove the sole
OS-level cause. The environment prerequisite above remains unresolved. No
permissions or browser settings were changed, and no product suite ran. Both
temporary profiles and this diagnostic's lock were removed after the launch.
