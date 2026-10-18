# Final candidate CI and publication evidence

This is a bounded collection procedure for A-R-12/17/21/23/24/25/27/28,
A-Z-07/14. It grants no release, repository-setting or account-setting authority.
Use the [workflow dependency policy](workflow-dependency-policy.md),
[runtime CI guide](react-aria-runtime-ci.md) and
[release recovery runbook](../troubleshooting/release.md) together.

## Resolve the observed production protection gap

On 2026-10-17, authenticated read-only inspection reported `main` as unprotected
(HTTP 404, `Branch not protected`), returned empty effective branch-rule and
repository/inherited-ruleset lists, and reported repository admin capability.
This is a dated API observation, not a claim that all organization policy is
observable. Evidence is retained in
`final-acceptance/wave-04/14/remote/{main-protection,main-rules,rulesets,repository}.json`.
No setting was changed. Do not approve A-R-27 from workflow configuration alone.

An authorized repository owner must review and adopt effective production rules:
require reviewed pull requests to `main`, the current full validation checks and
Conventional Commit title validation; review administrator/app bypasses and tag
creation authority. Observe actual blocking of a failed and a missing check using
an approved non-production fixture. Do not intentionally fail or merge production
code to obtain evidence. Preserve the approved automatic-CI pause for `dev`.
Owner adoption and any settings changes are separate from collecting read-only
metadata. Archive raw effective settings, owner/date and the blocking observations.

| Path | Configured execution | Required evidence |
| --- | --- | --- |
| PR to main, including infrastructure-only changes | CI Node 22.12.0/24, Next.js docs; PR title | Exact current PR head, actual check context names and successful conclusions; required-context settings match these observed names. No path bypass. |
| Main push | CI full matrix and Release's reusable validation | Existing authorized head/run and prerequisite ordering. Never push main or dispatch Release as a probe. |
| Default-token AI draft to dev | Separate read-only proposal validation, write-only draft creation, explicit `validate-draft` reusable CI at returned head | A separately authorized harmless draft's number/head, original patch hash, real job contexts, successful full results and proof that no PR event was needed. No AI runs were returned by the dated query. |
| Ordinary dev PR | Automatic CI/title intentionally excluded | Preserve the exception; it does not waive eventual production checks. |

Logical direct-CI names are `Validate Node 22.12.0`, `Validate Node 24`,
`Next.js docs`, and `conventional-title`. Reusable callers can prefix contexts;
map actual names from the API before proposing requirements. The prior offline
`final-acceptance/wave-03-37/verify-check-receipt.mjs` checks an owner-supplied
observation record; it does not query or prove platform enforcement.

## Retrieve and bind fresh validation outputs

Use one reviewed immutable candidate and the supported Node 22.12.0/24 and pnpm
10.29.3 environment. Coordinator schedules full CI/installed-consumer validation;
do not duplicate builds or mutate shared outputs from evidence workers. The generated-token regression now transpiles its actual TypeScript source with
the existing toolchain, preserving the assertions on Node22.12 and Node24. The
integrated token and CI guards pass on both runtimes; this is targeted local
evidence, not a successful current-head Actions run.

After the first successful direct CI run at that candidate, save raw run/jobs and
artifact API metadata. For each runtime download `sgui-package-node-*`,
`sgui-browser-docs-node-*`, `sgui-validation-node-*`; for Node24 also download
`sgui-browser-node-24`. All have configured14-day retention. Save actual IDs,
creation/expiry, run attempt, names and archive digests. Separately retain the
`sgui-docs-validation-node-24` artifact and successful `Next.js docs` result.
Historical Storybook artifacts retain their original identity; do not recreate
Storybook or relabel historical runs.

Download archives by their recorded artifact IDs, compute SHA256 and compare to
API `digest` before safe extraction into separate empty evidence directories.
Inspect archive entries before extraction: reject absolute paths, parent traversal
and symlinks. Bind extracted receipt/files to those verified archives. Extract the
package tarball into another empty directory; retain its original bytes.

`packages/ui/scripts/verify-ci-downloads.mjs` accepts a JSON descriptor with
`expectedHead`, matrix `runtime` (`22.12.0` or `24`), raw `run`, raw direct-CI `job`,
and an `artifacts` array of the raw artifact objects with added absolute
`archivePath` values. Supply absolute `receiptPath` (validation logs' build receipt),
`tarballPath`, `nativeDirectory` (native fixture artifact root) and
`packageDirectory` (extracted npm `package` directory). Run:

```sh
node packages/ui/scripts/verify-ci-downloads.mjs /absolute/path/downloads.json
```

The verifier reads only supplied metadata/files. It rejects failed/wrong-head or
wrong-attempt jobs, skipped mandatory steps, expired/missing/ambiguous artifacts,
archive or tarball digest mismatches, invalid receipt identity and extracted
output inventory drift. It reports consistency, not authenticated collection,
legal approval or behavior. Synthetic tests never count as live CI acceptance.
It deliberately targets direct CI job names; map reusable AI/release caller
contexts separately with the existing check-receipt verifier.

Inspect actual browser JSON, failures/skips, engines and trace contents rather
than concluding success from artifact presence. Measure full job durations and
browser-step headroom against60m/45m Node24,30m Node22 and30m docs budgets. Preserve
original failures. Verify Node22 reaches packed consumers after its test fix.
Use the receipt's input/output hashes to decide which earlier successful behavior
evidence is unchanged; do not rerun or invalidate all300 accepted V leaves.

## Complete owner-controlled publication evidence

Use `final-acceptance/wave-03-38/owner-release-record.template.json` and leave
unobserved fields null. Public npm404 and empty tag/release lists currently give
no basis to infer scope availability, private package history or publication
rights. The owner must supply redacted npm scope/package control and the selected
authentication route; exact trusted workflow binding/direct publish permission
or applicable token authority; effective CI-local npm/Node; GitHub tag/release
rules; provenance eligibility and reviewed commercial/notices disposition.
Never paste tokens, account recovery codes or authentication headers into receipts.

Record the final breaking-delta ledger, intended Conventional Commit merge marker,
authoritative publication history, approved candidate and explicit first-publication
or subsequent-major decision before any main promotion. Pure offline analyzer
checks are safe; invoking semantic-release dry-run with credentials can execute
verification hooks and is unnecessary for this evidence task. Do not edit versions.
Join any eventual authorized Actions publication, tarball digest, npm version,
tag, GitHub release and provenance in one identity record. Existing local builds
and all300 V completions cannot substitute for owner/legal approval or this chain.

## Executable routing and protection receipt guard

The new `packages/ui/scripts/check-ci-release-enforcement.mjs` accepts JSON with
`workflows` (`ci`, `ai`, `release`, `title` parsed YAML objects) and `protection`
(raw `branchProtection`, `effectiveRules`, query status codes, observed context
mapping, owner review and failed/missing-check observations). It has no YAML parser
runtime dependency and does not execute workflow text. Its fixture tests load the
current YAML with the existing frozen test dependency. The CI step runs
the routing/protection and artifact-verifier cases after output
cleanup, preserving their transcript in the existing validation-log artifact.

```sh
node --test packages/ui/scripts/check-ci-release-enforcement.test.mjs packages/ui/scripts/verify-ci-downloads.test.mjs
node packages/ui/scripts/check-ci-release-enforcement.mjs /absolute/path/enforcement-receipt.json
```

The dated collected descriptor is
`final-acceptance/wave-04/14/current-enforcement-receipt.json`; its expected result
is exit1/incomplete with eight specific missing observations. Do not fill those
fields from synthetic fixtures. Supported raw query status values do not by
themselves supply actual observed check names, reviewed PR requirements, bypass
review, tag authority review or proof that failed/missing checks block merging.
A green structural receipt is still not authenticated platform or owner approval.
