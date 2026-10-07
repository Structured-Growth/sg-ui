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

## Coordinator native proof and final handoff

Coordinator `01a1164f-41db-7f30-aaf9-f20133b6566f` reviewed the prepared patch and
ran fresh actual Chromium against a nondefault pooled port in wave 31.
The reviewed worker head was `f66d8bdac4ae83a07bf37baefdfe4b367e238b92`;
the actual testing-only candidate was
`1a378accd909a471e653fe4e27fe9457c9531049`, not the worker head.
`/tmp/sgui-batch45-candidate-wave31-attribution.json` records batch 71's reviewed
head, baseline and file digests. Direct byte comparison confirmed the candidate
and worker spec both retain the tested SHA-256 above.

Whole-file selection:
`tests/browser/batch05-grid-clipboard.spec.ts --project=chromium`, with no grep,
retries or duplicated suite. Actual selector arguments were
`(?:^|/)tests/browser/batch05-grid-clipboard\.spec\.ts$` and
`--project=chromium`. The coordinator's shard was:

```json
{
  "id": "clipboard-pooled-origin",
  "specs": ["tests/browser/batch05-grid-clipboard.spec.ts"],
  "project": "chromium"
}
```

All four cases passed on actual `http://127.0.0.1:6674`, slot 1: native text/JSON
copy and paste in light/dark themes, native CDP denied write with focus retention,
and controlled rejection/cleanup. The native denial result is distinct from the
mocked rejection case. Playwright reported four passed in 22.3 seconds; the command
duration was 23.079 seconds. Runtime: Node `v24.19.0`, pnpm `10.29.3`, Playwright
`1.63.0`, Chromium. This bounded proof confirms the pooled-origin driver correction.

Retained coordinator evidence root:
`/Users/thomashall/.codex/worktrees/batch45-shared-native-candidate/sg-ui/artifacts/browser-pool/7c82140b-3a18-4b19-aca5-9a5f0720af5f/`.
Its `evidence.json` records a fresh shared Storybook build (33.077 seconds), one
browser-source typecheck (1.201 seconds), four disjoint Chromium sessions and 21
total passing cases. Batch 71 accounts for four of those cases. The clipboard
session's `browser.log`, `results.json`, `browser.log.resources.json`, and
`evidence.json` are under `clipboard-pooled-origin/`. Command resources record
exit code 0, no signal errors and `settled: true`. Aggregate evidence records
`cleanup: "owned commands settled"`; coordinator reported owned leases released.

Provenance SHA-256:

- Aggregate `evidence.json`:
  `5cb3d884baa20acc27afbaef230469ebabddf30d48f6c10a0dc32c69f5c1b59c`
- Clipboard `browser.log`:
  `fbfdd6062ce9860d607120c069eac23c6e53463f7ee1b524127ee4975380210a`
- Clipboard `results.json`:
  `ee06a0868f42aa2e5f76325ea54430f714f4758ba956b63b14065df071c18593`
- Shared build digest (initial and final):
  `ec6eca4336c63f839bde0508a026992dd9110b342f6072e714a5eaf6f14cde75`
- Candidate source digest (initial and final):
  `d693faa54cb1419030282fe955d89f92f44f941cea24db640f3c519c60ae73ce`

Candidate final HEAD remained the tested SHA and final status was empty. Only this
unique report changed after the coordinator command settled; source/story/unit/spec
bytes were preserved. No redundant validation ran. Final report-only commit and
clean status accompany the completion handoff; coordinator integrates reviewed
individual history, never the whole testing candidate.

Firefox/WebKit, manual/device/assistive-technology work and whole G-21/R-11
acceptance remain pending. No independent worker browser, build, server, full check,
GitHub CI, main integration, publication, secrets or workflow changes ran.
The bounded authorization supersedes full check/build requirements for this
driver-only slice. Primary checkout and other workers, including batch 68's
`reorder.spec.ts`, were preserved. Final clean commit SHA accompanies the authorized
coordinator completion report; this worktree is frozen pending final delta review.
