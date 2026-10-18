# Workflow dependencies and validation artifacts

External `uses:` actions use a full 40-character commit SHA with the reviewed
release line in a comment. Local reusable workflows remain relative references
so release validation uses the same candidate. Change pins through a reviewed
infrastructure patch: resolve the upstream tag to a commit, inspect action metadata,
release notes and bundled/runtime dependencies, validate the YAML and affected
jobs, and record the resolved identities and results. Do not auto-merge updates,
change event paths, expand token permissions, remove browser engines, disable
failures, or bypass the release validation dependency to make an update pass.

A SHA pins the action code, not every downloaded tool. pnpm is selected from
`packageManager`; repository dependencies install from the frozen lockfile.
Node 24 and the hosted Ubuntu image intentionally follow maintained patch lines;
record actual runtime versions. The Codex action's optional CLI version is still
unspecified: an approved exact CLI version and its validation are a separate
maintainer decision. Do not claim the whole toolchain is immutable from action
pins alone. Review that CLI and other action-downloaded tools with pin updates.

The dependency cache explicitly follows root `pnpm-lock.yaml`. Cache only the
pnpm store; never restore `dist`, `browser-docs-static`, tarballs, `.next` or
validation reports as build inputs. The matrix runs `ci-artifacts.mjs begin`
after frozen install: it removes generated library/native-host/package/report
outputs and hashes source/configuration inputs. Existing library and native
fixture builders also empty their output directories. After mandatory checks,
serial packed consumers and packing succeed, `ci-artifacts.mjs complete` requires
unchanged inputs, JS/types/CSS, native fixture HTML/CSS and exactly one tarball.
It writes `artifacts/logs/build-receipt.json` with file hashes, HEAD, actual runtime
and producing run URL/attempt. Generated native registry/index files are derived
from hashed scenario/manifest inputs, not independently trusted source inputs.

The Node 24 job budget is 60 minutes, with 45 minutes for browser execution; the
minimum-runtime job remains 30 minutes. This budget responds to full run
37873270629, which used 25m28s in browser checks before the former 30-minute job
limit interrupted 1,521 executions after 1,132 started. No test selection,
engine, retry, diagnostic or packed-consumer gate is relaxed. Recheck measured
durations after the first expanded successful run; timeout headroom is provisional.
Next.js docs retain a 20-minute budget and gain always-uploaded check/build/browser
logs, browser JSON and failure traces. Abrupt runner termination can still prevent
uploads; `always()` does not guarantee survival of job cancellation.

All validation artifacts retain the existing 14-day retention. Package and native
fixture artifacts upload only on successful validation and reject missing files.
Logs and browser evidence upload on failure where available. Historical Storybook
artifacts keep their dated names; the replacement is `sgui-browser-docs-node-*`.
A native fixture artifact is a private validation host, not the public Next.js site.

For each final candidate, inspect the Actions run and each job's steps for the
exact tested SHA; download package, native fixtures, logs and browser artifacts.
Record name, ID, digest, size, expiry and retrieval time; compute the downloaded
archive SHA-256 and compare it with the API digest. Extract the receipt and
compare its input/output/tarball hashes with the retrieved files. Inspect browser
JSON totals, failures/skips, engine scope and retained traces; an artifact's
presence is not a passing conclusion. Record missing/expired artifacts honestly.
A current native-host run must succeed on both runtimes before claiming it
replaces a historical Storybook run. Local source checks do not establish that.

Run `node --test packages/ui/scripts/ci-artifacts.test.mjs` and actionlint on all
four workflows before integration. Inspect PR-to-dev exclusion, production PR/main
and reusable-call paths; verify release still needs validation and AI still uses
the original sandbox, scope restrictions, separate proposal job and draft PRs.
Execute representative runtime/event jobs through normal reviewed validation;
never dispatch releases or change repository settings merely to test a patch.

For final-candidate retrieval, offline archive/receipt verification and the
remaining production protection/owner evidence, use
[CI release readiness](ci-release-readiness.md).


## Maintained pin validation and reviewed identities

The source-only [workflow policy guard](../../packages/ui/scripts/check-ci-release-enforcement.mjs)
checks external action and reusable-workflow references for full 40-character
commit SHAs, while allowing candidate-local references. Mutable tags, branches,
short SHAs, expressions and container tags do not satisfy that rule. Run its
focused fixtures from the repository root:

```sh
node --test packages/ui/scripts/check-ci-release-enforcement.test.mjs
```

The [R-25 reconciliation](final-acceptance/wave-04/02/workflow-dependencies/receipt.json)
records the seven current pinned commits, official action/package metadata,
release-note and annotated-tag review, downloaded-tool boundaries and actual
checksum-verified actionlint output for all four workflows. Action package.version
is not an action tag identity; annotated tag objects must be dereferenced to their
commit. Moving major-tag observations are dated evidence, not workflow inputs.
The generic pin guard validates reference form, not upstream safety or approval of
a replacement SHA; maintain the review procedure above for any update.

This review does not change workflow events, permissions, runtime/browser gates,
release prerequisites, AI sandbox or draft-only behavior. Source policy and
schema checks do not establish representative Actions execution, effective branch
protection or a successful AI proposal run; R-27 and R-21 retain those live scopes.
The separately documented floating runner/Node and optional Codex CLI version
choices are not made immutable by action pins or by running actionlint.
