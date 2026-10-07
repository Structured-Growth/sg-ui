# Batch 71: clipboard permissions follow the pooled origin

## Scope and defect

G-21/R-11 browser-driver correction from reviewed baseline
`2d6f357d10b2a65bc988aba6280e69f92f3b1147`. Created and attached the isolated managed
worktree `/Users/thomashall/.codex/worktrees/batch71-clipboard-pooled-origin/sg-ui`
at that exact SHA, verifying clean status before editing. Exclusive changes:

- `tests/browser/batch05-grid-clipboard.spec.ts`
- `docs/developer/parallel-batch-71/clipboard-pooled-origin.md`

The clipboard spec granted Chromium clipboard permissions and denied native writes
through CDP against hard-coded port 6173. The pool serves individual sessions on
different ports, so those permissions targeted a different origin from the story.
Both paths now open the story first and derive the permission origin from
`page.url()`. A shared local guard requires HTTP, host `127.0.0.1`, no credentials,
and an integer port from 1024 through 65535, matching the harness's loopback
contract. Permissions are configured before any clipboard action. CDP still uses
the page's actual browser context ID and native `clipboard-write` denial.

The existing cases and all assertion tails are preserved: real keyboard activation
and native paste, exact text/JSON bytes, focus-visible and focus retention,
unchanged checkbox selection, inert escaped content, empty-cell disabling,
feedback expiry, and replacement/unmount cleanup. The separate controlled API
rejection remains unchanged and is not evidence of native permission denial.
There is no new browser suite or clipboard fallback.

## Targeted validation

Followed [development validation](../react-aria-development-validation.md) and
[parallel browser guidance](../react-aria-parallel-browser-validation.md).
Bundled Node PATH:
`/Users/thomashall/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin`;
Node `v24.19.0`, pnpm `10.29.3`.

- `pnpm install --frozen-lockfile` passed under atomic install slot 0, owner
  `batch71-clipboard-pooled-origin-install:64435`; no dependency/lockfile changes.
- `pnpm exec tsc --noEmit -p tests/browser/tsconfig.json` passed under one atomic
  light slot. Log and owner metadata: `artifacts/batch71/browser-types.{log,json}`.
- `node artifacts/batch71/driver-origin-check.cjs` passed under atomic light slot 1,
  owner `batch71-clipboard-pooled-origin-light:65938`. This ignored fixture
  transpiles and executes the actual spec callbacks with captured permission APIs;
  it does not launch a browser. All three native callbacks configured the exact
  origin at ports 6173 and 6617 (six checks). All three rejected seven invalid
  page addresses before permission calls (21 checks): blank, HTTPS, non-loopback,
  implicit port 80, port 1023, credentials, and malformed URL. It also compares
  copy/denial assertion tails and the controlled-rejection case against baseline
  bytes. Log: `artifacts/batch71/driver-origin-02.log`.
- The first driver fixture failed because its mock locator lacked `getByRole`.
  Only the ignored fixture was corrected; no spec assertion changed. Retained red
  log/metadata: `artifacts/batch71/driver-origin-01.{log,json}`.
- `git diff --check` passed; scope and local documentation links were reviewed.
  Owned install/light leases were released after command settlement.

Tested spec SHA-256:
`91e108dcb3bd96c1963bc153bd0ffec8a1a586e2b9a31ffb2f273f708e932cdd`.

## Frozen handoff and acceptance limits

Coordinator `01a1164f-41db-7f30-aaf9-f20133b6566f` must independently review the
committed patch and run fresh actual Chromium against a nondefault pooled port.
Required selection arguments:
`tests/browser/batch05-grid-clipboard.spec.ts --project=chromium`, with no grep,
retries or duplicated suite. The complete file has four Chromium cases: light and
dark native copy/paste, native CDP denied write, and controlled rejection/cleanup.
An appropriate snapshot shard is:

```json
{
  "id": "batch71-clipboard-pooled-origin",
  "specs": ["tests/browser/batch05-grid-clipboard.spec.ts"],
  "project": "chromium"
}
```

Native results are **pending**, not inferred from the driver fixture or typecheck.
Firefox/WebKit, manual/device/assistive-technology work and whole G-21/R-11
acceptance remain pending. No independent browser, build, server, full check,
GitHub CI, main integration, publication, secrets or workflow changes ran.
The bounded authorization supersedes full check/build requirements for this
driver-only slice. Primary checkout and other workers, including batch 68's
`reorder.spec.ts`, were preserved. Final clean commit SHA accompanies the authorized
coordinator completion report; this worktree is frozen pending coordinator review.
