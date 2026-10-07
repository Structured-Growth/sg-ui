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
| `ai-proposal` | Proposed patch and summary from the manual AI workflow | Implementation job succeeds |

The validation job has a 30-minute limit. The job explicitly selects GitHub Actions' bash runner, which
uses `-e -o pipefail`, so piping output through `tee` retains logs and still
fails the step when validation fails. Upload steps reject absent package or
Storybook files. The matrix keeps running its other runtime after one fails.
Artifact URLs and exact commit/run conclusions are available from the Actions
run that produced them; local success is not a claim that a new CI run passed.
The AI workflow retains draft PR creation and its existing permissions.

This extends the package consumer portion of R-11. Browser interactions,
automated accessibility failure policy, performance smoke checks and the
Next.js integration matrix remain separate open acceptance work. These workflows
do not claim that those checks run merely because Storybook builds successfully.
