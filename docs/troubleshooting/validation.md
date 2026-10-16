# Validation troubleshooting

Use this when a configured check is absent or local validation is reading stale
output. [GitHub setup](../github-setup.md) distinguishes the actual workflow gates
from the [runtime evidence](../developer/react-aria-runtime-ci.md) recorded for
specific commits. Documentation-only work verifies guidance without unrelated
local UI runs. Automatic dev PR CI/title runs are paused; production-bound CI retains the full matrix.
See the [development validation policy](../developer/react-aria-development-validation.md).

## Missing AI draft-PR checks

The manual AI flow validates its patch/title/package/native-fixture preflight in
a fresh read-only **validate-proposal** job before draft creation. The write-only
proposal phase executes trusted inline data handling and actions, with no install
or generated-code validation. After draft creation the explicit **validate-draft**
reusable CI call validates the resulting immutable draft head, including the full
browser/packed-consumer matrix and Next.js docs. Inspect that caller's actual
head, jobs and conclusions even if no default-token PR event runs. Missing, failed,
queued or approval-pending validation never means success. A changed PR head or
title needs corresponding new validation; the earlier receipt cannot certify it.

Direct CI names are **Validate Node 22.12.0**, **Validate Node 24**, **Next.js docs**
and the title job **conventional-title**. Confirm actual reusable caller prefixes
and effective ruleset contexts from real runs. Production-bound maintainer
infrastructure PRs retain these checks. Dev PR automatic CI/title runs remain paused
under the authorized exception, while the explicit AI reusable call still runs.
Report missing/failed required contexts to an owner with head/run/settings evidence;
do not change secrets, protection or permissions to obtain a pass. Live repository
permissions and default-token behavior require operator receipts.

## Browser server missing output or port in use

From `packages/ui`, `pnpm test:browser` typechecks the suite and starts the static docs-native fixture server on
`127.0.0.1:6173`; it does not build native fixtures. Build current output with
`pnpm build:browser-docs` before starting the suite, and install its engines with
`pnpm exec playwright install --with-deps chromium firefox webkit` when needed.
The harness has `reuseExistingServer: false`. Coordinate with the owner of an
existing process rather than stopping another worker's server or reusing stale
output. Never rebuild native fixtures during a suite run. Retain failure reports/traces;
do not skip an engine merely to obtain a pass. See [browser acceptance and local
Firefox limits](../developer/react-aria-browser-acceptance.md).

## Packed-consumer failures or stale package contents

Run direct consumer scripts from `packages/ui`. The CI consumer scripts pack already built `dist`. Run `pnpm check` first and then
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
`sgui-browser-node-24`. Package and native-fixture artifacts upload after success.
The separate docs job uploads `sgui-docs-validation-node-24`, including logs, JSON and failure traces even on failure.
Artifacts retain for 14 days, so expired or absent files need evidence from the
producing run rather than an assumption that validation passed. Record exact
commit, job/step, command and first actionable error. Do not log credentials or
publish a package to diagnose validation. For publication failure, use the independent observation table and owner-reviewed
recovery procedure in [release recovery](release.md) before considering a retry.
