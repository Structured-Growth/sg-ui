# Packed consumer browser provisioning repair — 2026-10-21

A-R-12-a | implemented and locally validated | `.github/workflows/ci.yml`,
`packages/ui/scripts/check-ci-release-enforcement.mjs` and its colocated tests |
working tree based on `98c678d6` | 25 CI policy/artifact verifier tests pass |
new Actions execution and official artifact acceptance pending | A-R-12,
DOCS-005-l.

## Observed checkpoint result

Read-only GitHub inspection on 2026-10-21 confirms
[run 39177563118](https://github.com/Structured-Growth/sg-ui/actions/runs/39177563118)
completed with failure at proposal source
`7eaafdd6ab7307ba029d33d09a5df402aa8a41ab`. Next.js docs, Native Chromium,
Native Firefox, Native WebKit and Validate Node 22.12.0 succeeded.
[Validate Node 24](https://github.com/Structured-Growth/sg-ui/actions/runs/39177563118/job/117828688323)
passed package/behavior checks and the native fixture build, then failed in
Packed React 18.3 foundation consumer at 2026-10-19 00:14:12 UTC:

```text
browserType.launch: Executable doesn't exist at /home/runner/.cache/ms-playwright/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell
```

The stack points to `packedBrowsers` in `packages/ui/scripts/packed-browser.mjs:31`.
This is a CI provisioning defect, before browser assertions; it is not evidence
of a component behavior regression. Later Node 24 consumers, package upload and
final artifact binding were skipped. Node 22 success does not cover the Node 24
browser consumers. The dated stop record remains historical.

Reproduce the inspection with `gh run view 39177563118 --json
status,conclusion,headSha,jobs,url` and `gh run view 39177563118 --job
117828688323 --log`. The workflow only installed browsers in the separate native
and docs jobs; the Node 24 runtime runner had no provisioning step.

## Repair and verification

The runtime job now runs `pnpm exec playwright install --with-deps chromium
firefox webkit` before its packed consumers, conditional on Node 24. The command
uses the UI workspace's frozen Playwright installation and retains the setup log
with validation artifacts. The runtime matrix, browser assertions, native engine
requirements, permissions and dev CI exception retain their existing contracts.

The parsed-workflow guard rejects absent, duplicated, wrongly conditioned,
misplaced or incomplete browser provisioning. Mutation tests cover omission,
the wrong runtime, missing engines/OS dependencies, wrong working directory and
execution before dependency installation or after consumers.

Validation command from the repository root:

```sh
node --test packages/ui/scripts/check-ci-release-enforcement.test.mjs packages/ui/scripts/verify-ci-downloads.test.mjs
```

Result: 25 tests passed locally using Node 26.5.0, including YAML parsing and
current routing/release checks. This is targeted workflow validation, not a
supported-runtime/browser execution or a green Actions checkpoint. A new run at
the corrected exact head must complete all mandatory jobs and artifact joins
before A-R-12 or DOCS-005-l can close. No workflow was dispatched or rerun here.

Documentation validation: all 14 link-checker fixture tests pass. A scoped audit
of the backlog, runtime guide and this receipt passes all 19 local links; diff
whitespace is clean. The whole maintained-documentation audit remains red with
nine existing missing-path findings (archived evidence, two old acceptance-ledger
links and unavailable local receipts/logs). Its finding in the execution history
is the existing conversation-reconciliation link, not the appended repair link.
Those findings are not certified by this workflow repair; retain them for the
A-Z-15 documentation/evidence reconciliation.

## Second checkpoint — CSS composition-order defect

Run [39646417347](https://github.com/Structured-Growth/sg-ui/actions/runs/39646417347)
at `2b611c2e689e598856f605ce03c429218cf2238e` passed docs, all three native engines,
Node22 and the Node24 packed consumers. Node24 then correctly failed the native
artifact join: only `dist/styles.css` differed. Native/Node22 SHA-256 was
`03fa0472abdedda04500df89274b61ae8d92be225ef6482361d6e81c5d19850f`;
the Node24/local alternative was
`1d6107313579ecab3375afaa9232e48b5b13807d61e0d3a4ddf6a981fcc070d8`.
No artifact mismatch was suppressed or accepted.

The byte comparison moves the shared Scrollbars rules before/after PeriodPicker
rules inside a diamond composition. The upstream CSS Modules loader omits a
trace edge on a dependency cache hit, so completion timing changes dependency
ordering. `deterministic-css-loader.mjs` records every edge before awaiting reads,
including cached imports. A focused test delays either the shared dependency or
its consumer and requires byte-identical CSS/classes with dependency-first order.
The three CSS compilation tests pass. A fresh exact-head CI/artifact checkpoint
is still required after the repair.
