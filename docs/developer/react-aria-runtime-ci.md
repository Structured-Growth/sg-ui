# Runtime and CI validation

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

Each CI matrix job installs the frozen lockfile, fingerprints source inputs after
removing generated output, runs `pnpm check` and `pnpm build:browser-docs`, then executes these packed consumer scripts serially:

- `node scripts/test-foundation-consumer.mjs --react18`
- `node scripts/test-foundation-consumer.mjs`
- `node scripts/test-editor-consumer.mjs --react18`
- `node scripts/test-editor-consumer.mjs`

Before those consumers, the Node 24 job installs Chromium, Firefox and WebKit
with their OS dependencies on its own runner. Its foundation consumers add
`--browser` to execute packed SSR/hydration checks in all three engines; the
Next.js consumer also executes there. Native matrix installs belong to separate
runners and cannot provision the runtime job. The setup log is retained as
`artifacts/logs/consumer-browsers.txt`. See the
2026-10-21 checkpoint repair
for the observed missing-browser failure and validation limits.

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
| `sgui-browser-docs-node-22.12.0`, `sgui-browser-docs-node-24` | Static docs-owned native fixture output | All validation steps pass |
| `sgui-validation-node-22.12.0`, `sgui-validation-node-24` | Node/pnpm versions, input/output/tarball SHA-256 receipt and complete check, native fixture and consumer logs | Always, including failure |
| `sgui-browser-node-24` | Browser JSON/HTML results, axe results, smoke timings, failure traces/screenshots and saved downloads | Always after browser execution, including failure |
| `sgui-docs-validation-node-24` | Next.js docs check/build/browser logs, JSON and failure traces | Always, including failure |
| `ai-proposal` | Proposed patch and summary from the manual AI workflow | Implementation job succeeds |

The minimum-runtime validation job has a 30-minute limit; Node 24 has a 60-minute
limit. Three independent native jobs each retain one worker, zero retries and a
45-minute browser step within a 60-minute job. The runtime jobs depend on all
three; an explicit dependency-result check fails their stable required contexts
when an engine fails or is skipped. Before packing validation is completed, Node24
joins all three collected/executed test inventories and build receipts to its own
head, run, source-input hash and exact compiled distribution.
`sgui-native-{chromium,firefox,webkit}-node-24` artifacts retain engine receipts,
complete collection/execution JSON and failure traces for fourteen days.
`verify-native-ci.mjs` reads downloaded JSON as data with root-containment and
regular-file checks; it never executes downloaded artifact content.
This split follows run39140558308 reaching1645/2499 cases in the prior serial
45-minute step. It changes execution placement, not collection, retries, workers
or the ordinary-dev automatic-CI exception. A new successful full run remains
required. The latest inspected full run
[37873270629](https://github.com/Structured-Growth/sg-ui/actions/runs/37873270629)
exhausted its former 30-minute job limit during browser execution (25m28s in that
step, 1,132 of 1,521 executions started). This supports increasing the budget, not
claiming the expanded suite passes; the new budget still needs a current full run.
Run [39098705687](https://github.com/Structured-Growth/sg-ui/actions/runs/39098705687)
reached 233 of 245 docs browser cases before the 20-minute job limit. The docs job
now has 30 minutes, including build/setup and failure-artifact retention; the new
budget still requires a successful current-candidate run. Its three original
docs assertion failures and clean-output unit resolution failure remain retained
in `backlog-to-ten/ci-01`; extending time does not repair those failures.

The pnpm store cache is keyed explicitly by root `pnpm-lock.yaml`; neither dist,
native fixture output nor Next output is restored from cache.
`ci-artifacts.mjs begin` removes matrix output before checks; `complete` rejects
changed source inputs, missing JS/types/CSS/fixture HTML/CSS and absent or extra
tarballs, and hashes current outputs. The receipt travels in validation logs.
Package and fixture artifacts require success.
See [workflow dependency policy](workflow-dependency-policy.md) for immutable action
references, update review and the fresh-run verification procedure.

The job explicitly selects GitHub Actions’ bash runner, which
uses `-e -o pipefail`, so piping output through `tee` retains logs and still
fails the step when validation fails. Upload steps reject absent package or
native fixture files. The matrix keeps running its other runtime after one fails.
Artifact URLs and exact commit/run conclusions are available from the Actions
run that produced them; local success is not a claim that a new CI run passed.
The AI workflow retains draft PR creation and its existing permissions.

| Artifact | Actions artifact ID | Expiration (UTC) |
| --- | --- | --- |
| `sgui-package-node-22.12.0` | 11456077801 | 2026-10-21 01:56:55 |
| `sgui-storybook-node-22.12.0` | 11455873405 | 2026-10-21 01:56:56 |
| `sgui-validation-node-22.12.0` | 11456117638 | 2026-10-21 01:56:58 |
| `sgui-package-node-24` | 11455963120 | 2026-10-21 01:56:27 |
| `sgui-storybook-node-24` | 11455987943 | 2026-10-21 01:56:28 |
| `sgui-validation-node-24` | 11456047789 | 2026-10-21 01:56:29 |

The historical Storybook-era R-11 batch added [executed browser gates](react-aria-browser-acceptance.md) after
Storybook builds on Node 24: all three browser engines, byte-level downloads,
keyboard/focus/editor/grid behavior, failing axe scans and a bounded performance
smoke workload. Runtime errors/warnings also fail. Browser execution is a separate
`pnpm test:browser` command; the current host reads built docs-native fixtures; `pnpm check` retains
source, behavior, boundary, token/CSS, build, API and package checks. Next.js and
the broad native/assistive-technology matrix remain separately tracked.

The image-lifetime head `3f9b1ed` [run 37564400501](https://github.com/Structured-Growth/sg-ui/actions/runs/37564400501)
also failed: Node 22.12.0/all packed consumers passed; Node 24 browser results
were 107/111. Two Linux WebKit failures repeated the clipboard enumeration issue.
Two Firefox failures correctly rejected the PNG fixture as corrupt, with native
image width zero and mandatory image errors. A byte audit found an invalid IDAT
CRC in that fixture and the initial SavedRichDocument fixture. Both now use a
generated 1×1 RGBA PNG with valid chunk CRCs and a verified decompressed scanline.
Native image-load/error gates remain unchanged; fresh Linux CI must verify them.

The maintained forced-color proofs record two separate capabilities: whether the
media query is active, and whether the engine implements `forced-color-adjust`.
WebKit's media emulation alone does not establish UA forced painting. The checks
retain its native keyboard/selection, structural geometry and authored system-color
assertions, annotate the unsupported adjustment/paint branch, and leave its
computed contrast in the observation rather than treating it as an accepted
forced-paint result. Chromium and Firefox keep the actual contrast assertions.

Direct PR jobs now explicitly select `pull_request.head.sha`, after an explicit
reusable `inputs.ref` and before the push-event `github.sha` fallback. All three
job types assert that exact value after checkout. On PR97 the inspected proposal
SHA and GitHub synthetic merge SHA differ; validating one while labelling the
artifact as the other breaks the download verifier's immutable-head binding.
Main pushes and exact-ref reusable callers retain their existing source choice.
The guard tests reject returning a PR job to the ambiguous merge-ref fallback.

## Firefox native clipboard execution

The next checkpoint runs the complete Firefox collection under a real X display
with `xvfb-run --auto-servernum` and `--headed`. Run39171299366 failed the native
custom-MIME clipboard scenario on Linux while its macOS counterpart passed. The
new delivery attachment records trusted copy/paste events and exposed MIME types;
no unsafe-content rejection, callback, selection or safe-content assertion is
removed. This display change is a candidate correction, not a successful Linux
clipboard claim until the complete current-head run passes. The workflow guard
requires the exact unfiltered commands for both execution branches.
