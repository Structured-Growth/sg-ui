# Validation troubleshooting

Use this when a configured check is absent or local validation is reading stale
output. [GitHub setup](../github-setup.md) distinguishes the actual workflow gates
from the [runtime evidence](../developer/react-aria-runtime-ci.md) recorded for
specific commits. Documentation-only work verifies guidance without unrelated
local UI runs. Automatic dev PR CI/title runs are paused; production-bound CI retains the full matrix.
See the [development validation policy](../developer/react-aria-development-validation.md).

## Missing AI draft-PR checks

The manual AI proposal job validates its patch allowlist, Conventional Commit title,
`pnpm check` and `pnpm build-storybook`. It does not run the full browser/packed
consumer gates. Inspect the PR's exact head and Actions checks before interpreting
a generated success summary. For default-token opened/synchronize/reopened events,
current [GitHub guidance](https://docs.github.com/en/actions/how-tos/write-workflows/choose-when-workflows-run/trigger-a-workflow)
describes approval-required runs. A user with write access can approve them where
that prompt is offered. If runs or required contexts remain absent, report the
head/event and missing check to an owner. Do not weaken protection or change tokens,
secrets or workflow permissions as a component fix. Repository-specific default-token
behavior remains unverified by this guidance.

Full CI display names are **Validate Node 22.12.0** and **Validate Node 24**;
`validate` is their source job ID. The title job is **conventional-title**. Confirm
contexts from a real run, particularly reusable release caller prefixes. Dev PRs
have no required automatic checks during the user-authorized pause; retain local
targeted evidence and do not interpret missing/cancelled runs as passes.

## Browser server missing output or port in use

`pnpm test:browser` typechecks the suite and starts the static Storybook server on
`127.0.0.1:6173`; it does not build Storybook. Build current output with
`pnpm build-storybook` before starting the suite, and install its engines with
`pnpm exec playwright install --with-deps chromium firefox webkit` when needed.
The harness has `reuseExistingServer: false`. Coordinate with the owner of an
existing process rather than stopping another worker's server or reusing stale
output. Never rebuild Storybook during a suite run. Retain failure reports/traces;
do not skip an engine merely to obtain a pass. See [browser acceptance and local
Firefox limits](../developer/react-aria-browser-acceptance.md).

## Packed-consumer failures or stale package contents

The CI consumer scripts pack already built `dist`. Run `pnpm check` first and then
execute the affected script with its CI arguments, serially, without an overlapping
library rebuild. The Node 24 foundation runs use `--browser` (and `--react18` for
React 18.3); editor runs use only the corresponding React selector. Next.js has its
own script. Preserve the first error and temporary fixture path; check CSS/export
and SSR/client boundaries against the [server contract](../developer/react-aria-server-components.md).
Do not change peers or package exports without a separately scoped infrastructure
change and consumer evidence.

## Finding evidence after CI failure

Runtime/check/build/consumer logs upload even after failure as
`sgui-validation-node-22.12.0` and `sgui-validation-node-24`; browser evidence is
`sgui-browser-node-24`. Package and Storybook artifacts upload after success.
Artifacts retain for 14 days, so expired or absent files need evidence from the
producing run rather than an assumption that validation passed. Record exact
commit, job/step, command and first actionable error. Do not log credentials or
publish a package to diagnose validation. Publication recovery and owner identity
are separate release tasks; this guide does not define a rollback procedure.
