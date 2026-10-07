# Runtime and CI validation

Final removal-guard head `7f03a35108bbf861e9b123b646694f64b21bb369` is independently
verified by [run 37560788949](https://github.com/Structured-Growth/sg-ui/actions/runs/37560788949):
both runtime jobs, all eight packed consumers and the required three-engine
Storybook suite pass. Title validation run 37560788923 also passes. Downloaded
browser JSON/logs are in `/tmp/sgui-ci-7f03-browser` and `/tmp/sgui-ci-7f03.log`.
Seven artifacts remain unexpired; browser artifact `11456977272` expires
2026-10-21 02:18:34 UTC. This evidence precedes the packed browser hydration and
native handle fix batch; later heads require their own CI result.

R-10 distinguishes the published consumer requirement from the repository's
publishing tools. The package declares Node `>=22.12.0`; CI tests that exact
minimum and the Node 24 line. React support remains 18.3.1 and 19. The package's
browser output does not require Node in the browser.

Development, both AI implementation jobs and releases use Node 24 from `.nvmrc`
with pnpm 10.29.3 from `packageManager`. The release job resolves the current
Node 24 patch through `actions/setup-node`; installed semantic-release 25
requires Node `^22.14.0 || >=24.10.0`. Publishing is therefore intentionally
performed on Node 24 rather than the consumer's minimum Node 22.12.0. Minimum
runtime CI validates building and consuming the library without invoking a
release. Node 26 local results alone do not establish either supported target.

Each CI matrix job installs the frozen lockfile, runs `pnpm check` and
`pnpm build-storybook`, then executes these packed consumer scripts serially:

- `node scripts/test-foundation-consumer.mjs --react18`
- `node scripts/test-foundation-consumer.mjs`
- `node scripts/test-editor-consumer.mjs --react18`
- `node scripts/test-editor-consumer.mjs`

Each script creates a disposable fixture, packs the already built library,
installs that tarball with its specified React version and builds production
Vite output. Foundation assertions cover ordinary SSR, emitted CSS, icon
pruning and absence of retired dependencies. The React 19 foundation fixture
also runs the official Flight renderer with the `react-server` condition.
Editor assertions cover SSR and the production hydration entry, retained
Lexical code and absence of retired dependencies. A hydration entry build is
not an executed browser hydration test. See
[server boundaries](react-aria-server-components.md) for the Flight proof's scope.
The fixtures must not overlap a library rebuild or one another: their packs read
`dist`, and Vite SSR uses a shared port.

R-12 artifacts are emitted separately for each runtime, with an explicit
14-day retention period:

| Artifact | Contents | Upload condition |
| --- | --- | --- |
| `sgui-package-node-22.12.0`, `sgui-package-node-24` | Official CI-built package tarball | All validation steps pass |
| `sgui-storybook-node-22.12.0`, `sgui-storybook-node-24` | Static Storybook output | All validation steps pass |
| `sgui-validation-node-22.12.0`, `sgui-validation-node-24` | Node/pnpm versions and complete check, Storybook and consumer logs | Always, including failure |
| `sgui-browser-node-24` | Browser JSON/HTML results, axe results, smoke timings, failure traces/screenshots and saved downloads | Always after browser execution, including failure |
| `ai-proposal` | Proposed patch and summary from the manual AI workflow | Implementation job succeeds |

The validation job has a 30-minute limit. The job explicitly selects GitHub Actions' bash runner, which
uses `-e -o pipefail`, so piping output through `tee` retains logs and still
fails the step when validation fails. Upload steps reject absent package or
Storybook files. The matrix keeps running its other runtime after one fails.
Artifact URLs and exact commit/run conclusions are available from the Actions
run that produced them; local success is not a claim that a new CI run passed.
The AI workflow retains draft PR creation and its existing permissions.

R-12 remote evidence: [CI run 37559276148](https://github.com/Structured-Growth/sg-ui/actions/runs/37559276148)
completed successfully for exact commit `c78a24eb8d5b538833f3a0aca58e428f970b642c`.
Both Node 22.12.0 and Node 24 jobs passed check, Storybook, all four packed
consumers and uploads. API inspection confirmed all six artifacts unexpired;
validation logs and the Node 24 official package were also downloaded for review.
This proves that commit's workflow, not later browser changes.

| Artifact | Actions artifact ID | Expiration (UTC) |
| --- | --- | --- |
| `sgui-package-node-22.12.0` | 11456077801 | 2026-10-21 01:56:55 |
| `sgui-storybook-node-22.12.0` | 11455873405 | 2026-10-21 01:56:56 |
| `sgui-validation-node-22.12.0` | 11456117638 | 2026-10-21 01:56:58 |
| `sgui-package-node-24` | 11455963120 | 2026-10-21 01:56:27 |
| `sgui-storybook-node-24` | 11455987943 | 2026-10-21 01:56:28 |
| `sgui-validation-node-24` | 11456047789 | 2026-10-21 01:56:29 |

The subsequent [browser implementation run 37560065588](https://github.com/Structured-Growth/sg-ui/actions/runs/37560065588)
also succeeds for exact `83b8dae2148002e79d2df331fd105c274f97ca96`: both Node
jobs, eight packed consumers and all 45 Chromium/Firefox/WebKit tests. Seven
unexpired artifacts include browser report `11456069764` (14 days, expires
2026-10-21 02:10:07 UTC). Downloaded browser JSON has 45 expected, zero skipped,
zero unexpected and zero flaky tests; [browser evidence](react-aria-browser-acceptance.md)
records scope and smoke timings. This closes the executable R-11 gate, not the
remaining framework/device/assistive-technology acceptance.

R-11 now adds [executed browser gates](react-aria-browser-acceptance.md) after
Storybook builds on Node 24: all three browser engines, byte-level downloads,
keyboard/focus/editor/grid behavior, failing axe scans and a bounded performance
smoke workload. Runtime errors/warnings also fail. Browser execution is a separate
`pnpm test:browser` command because it reads built Storybook; `pnpm check` retains
source, behavior, boundary, token/CSS, build, API and package checks. Next.js and
the broad native/assistive-technology matrix remain separately tracked.

The server-fix head `b63ec58becedd246052c3a1e81acf590a97940d1` independently
passes [run 37562921075](https://github.com/Structured-Growth/sg-ui/actions/runs/37562921075).
Both runtimes pass check, Storybook and four packed consumers each. The downloaded
Storybook JSON records 81/81 across all three engines in 158.0 seconds, with zero
skipped, unexpected or flaky tests. Packed React 18/19 Vite and Next production
JSON independently records SSR, hydration and interactions passing in Chromium,
Firefox and WebKit with empty diagnostic arrays. Seven artifacts are unexpired;
browser artifact ID is `11458031025`. Evidence: `/tmp/sgui-ci-b63-browser`. This
validates the server fix and preceding display batch, not later calendar/clipboard heads.

The calendar head `d59653ec848d22a97104441ac068c77530610537` passes
[run 37563448002](https://github.com/Structured-Growth/sg-ui/actions/runs/37563448002):
both runtime jobs and all eight packed consumers. Downloaded browser JSON records
93/93 across Chromium, Firefox and WebKit in 159.9 seconds, with zero skipped,
unexpected or flaky tests. Packed React 18/19 Vite and Next production JSON records
SSR, hydration and interactions passing in each engine with empty diagnostics.
Seven artifacts are unexpired; browser artifact ID is `11457514859`. Evidence:
`/tmp/sgui-ci-calendar-browser`. This verifies the calendar batch, not later heads.

The clipboard head `5829608` [run 37564009791](https://github.com/Structured-Growth/sg-ui/actions/runs/37564009791)
completed with failure. Node 22.12.0 passed all checks and packed consumers.
Node 24 passed check/Storybook and 103/105 browser cases; both failures were
Linux WebKit rich-paste event assertions. Native rich formatting, JSON reload,
keyboard bold and typing had passed, but `clipboardData.types` enumerated an
empty array. The gate now reads actual `text/html` bytes from the trusted native
event and requires the copied bold content; it still records the enumerated
types and retains mandatory runtime diagnostics. A new CI run must verify this
change on Linux; local success does not repair that earlier run or establish
Node 24 packed-browser success for the failed clipboard head.
