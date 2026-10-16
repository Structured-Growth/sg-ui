# Wave 03-36 — CI artifacts, fresh output and action dependencies

Prepared a ready-to-apply [workflow/tooling/documentation patch](ci-artifact-freshness.patch)
and [full proposed-file mirrors](proposed-files/). **All four leaves remain partial**:
implementation is reviewable, but integration and current remote runtime acceptance
are still required. No central count or checklist was changed. Original requirements,
per-leaf results, evidence and successors are preserved in [results.json](results.json).

Only this owned evidence directory was written. No shared build/install/server,
source edit, Git mutation, remote mutation, release or publication occurred.
Current HEAD is `540f47d4059a9cea8890b80927f34f51ef2fbc3e` on dirty `dev`;
[evidence.json](evidence.json) contains exact input/output/patch/receipt hashes.
The patch has not been applied.

## Concrete changes

- All seven external action dependencies in the four workflows use upstream-resolved
  full commit SHAs, retaining the release-line comment. Local reusable release
  validation, event paths, permissions, matrix names/engines, failure behavior,
  serial packed consumers, AI scope/sandbox and draft PR behavior are preserved.
  Root `pnpm-lock.yaml` is explicit in each pnpm-store cache configuration.
- Node 24 receives a bounded 60-minute job budget and 45-minute browser step
  budget based on an observed timeout; Node22 stays30m, docs20m, release15m and
  AI30m/15m. No test selection or failure threshold is relaxed.
- New `packages/ui/scripts/ci-artifacts.mjs` removes old dist, native host,
  tarballs and reports before validation, fingerprints build inputs, and after
  checks/packing verifies unchanged inputs, nonempty JS/types/CSS/native HTML/CSS
  and exactly one tarball. It records SHA256 file inventories, actual runtime,
  HEAD and run URL/attempt in the always-uploaded validation logs. The generated
  native registry/index is derived from hashed manifest/scenarios and excluded
  from source drift comparisons. Three focused tests cover success, cleanup and
  fail-closed paths. Existing real package-byte checks remain mandatory.
- The separate Next.js docs job cleans prior output and uploads check/build/browser
  logs, JSON and failure traces even on failure. Required package/native fixtures
  remain success-only uploads with missing-output errors and14-day retention.
- Maintained runtime/setup guidance uses docs-native host/artifact names; historical
  Storybook run tables retain their original names. New dependency-policy guidance
  defines review, cache, receipt and retrieval steps without asserting owner approval.
  Stale AI-template descriptions in the setup guide are brought into line with its
  existing scope and validation receipt.

## Evidence and what it proves

Read AGENTS, final acceptance, assignment and prior original-leaf reports/results
before preparing changes. Their four expected report/result hashes match assignment.
[Hash comparison](coordinator-hash-comparison.json) reuses the accepted coordinator
Node24 results: **112/112 recorded inputs,1,778/1,778 library outputs,292/292 native
host outputs and15/15 receipts match**. This is the coordinator's bounded source
and output scope, not a new all-source inventory or new React/browser consumer run.
The BUG0008–0012 results are reused, not reimplemented or relabeled.

Read-only authenticated GitHub inspection saved raw run/job/artifact responses and
upstream action metadata in [remote/](remote/). Latest full workflow run
[37873270629](https://github.com/Structured-Growth/sg-ui/actions/runs/37873270629),
head `ddb624fdad1289be71be62da06fe2908a2386a03`, ended with Node22 failure and
Node24 cancellation. Node24 ran browser checks from02:14:54Z to02:40:22Z
(**25m28s**) after approximately4m45s setup/check/build. Its log says **1,521 tests**,
and reaches execution1,132 before timeout; this is not a completed1132-test pass.
Packed consumers and success-only artifacts were skipped. Raising the budget is
supported by this evidence, but new timing sufficiency requires a current full run.

The Node22 archive preserves `ERR_UNKNOWN_FILE_EXTENSION` importing
`src/foundation/tokens.generated.ts` from next100 tests at Node22.12.0. This separate
historical failure is not repaired, suppressed or claimed current-pass by this patch.
A nearby successful targeted development run37626720671 has no artifacts and a
skipped full matrix; it is explicitly not a successful full-run substitute.

Downloaded archives were saved and their SHA256 matches the API's digest exactly:

| Run / artifact | Artifact ID | Archive SHA256 | Expiry UTC |
| --- | --- | --- | --- |
| Latest failure / validation Node24 | 11592107473 | `2fdf33c3e9d978d25b5a4fd3d8c156ebb54362ef28fe0095b92ec67990a34f87` | 2026-10-23T02:40:25Z |
| Latest failure / validation Node22 | 11591665449 | `355b8d003e9a0526383bf2d976bababff654bcebdba1eebd37d43ebd8ea93c3d` | 2026-10-23T02:10:31Z |
| Historical37559276148 / package Node24 | 11455963120 | `d2dac2fe654ea52f534c83c857966b9ad8d51af4b6f2b09d3ef7b9eb77fe754e` | 2026-10-21T01:56:27Z |

All six historical c78a24e artifacts are currently API-reported unexpired. Only
its Node24 package was downloaded here; do not infer all-six retrieval. Continued
availability is time-dependent. No current native-docs producing run was found in
the inspected latest12 CI runs. There is no claim of exhaustive remote history.

## Checks actually run

- `node --test docs/developer/final-acceptance/wave-03-36/proposed-files/packages/ui/scripts/ci-artifacts.test.mjs`: **3 passed**; scratch stayed inside owned mirror.
- `node --test docs/developer/final-acceptance/wave-03-36/verify-proposal.test.mjs`: **4 passed**. Existing js-yaml4 parses all YAML; tests compare events/permissions/required commands and AI safeguards, upstream pin identity/cache configuration, upload/freshness ordering and `bash -n` for every shell run block. This is source/tool evidence, not Actions execution or actionlint schema validation.
- `git apply --check docs/developer/final-acceptance/wave-03-36/ci-artifact-freshness.patch`: **passed** without applying it.
- `node --check` on proposed ci-artifacts.mjs: **passed**.
- `python3 docs/developer/final-acceptance/wave-03-36/capture.py`: saves exact current/prior/coordinator comparisons and downloaded archive digest verification.

Local tool tests use **Node26.5.0 / Python3.9.6**, not supported-runtime conformance.
Two initial verification-test harness failures (a reusable job has no steps; missing
versus undefined optional keys) are preserved as `workflow-tests-first-failure.txt`
and `workflow-tests-second-failure.txt`; the harness was corrected and4/4 now pass.
`actionlint` is unavailable; it was not installed or represented as passed.
The validation lease wrapper was inspected; no lease was acquired or bypassed
because no shared/heavy validation ran.

## Original-leaf dispositions

**A-R-12 — partial.** Original obligation is keeping build/tarball Actions artifacts
with recorded identity, retention and results. Historical retrieval is stronger;
active replacement naming/evidence handling is patched. A successful current
native-host run and downloaded validated artifacts are still missing.

**A-R-24 — partial.** Original obligation covers expanded timeout/artifact/cache
behavior and stale-output rejection. Concrete timeout evidence, guarded clean
output, cache-key and failure-upload patches exist with focused tests. Integrate,
run supported targets, measure new full timing and inspect actual failure contents.

**A-R-25 — partial.** Original obligation is pin/review/update validation without
weakening protections. All external action pins are resolved and proposed; preserved
protections have executable source checks. Maintainer adoption, upstream code/release/
downloaded-tool review, actionlint and actual representative workflow paths remain.
The unspecified Codex CLI, maintained Node24 line and hosted runner prevent claiming
a wholly immutable toolchain from action pins alone.

**A-Z-07 — partial.** Original obligation requires fresh rebuilt library/host/package
evidence instead of stale generated output. Current matching coordinator receipts
satisfy that bounded post-fix build/package portion; preserve those passes. The
proposed enforcement and final candidate installed React18/19/browser consumer
scope still need integration/execution. Historical eight packed consumers are not
relabeled as runs of this changed candidate, and Storybook is not recreated.

[validation-plan.json](validation-plan.json) gives exact review/integration commands,
expected assertions, supported runtimes, lease constraints and remote retrieval
requirements. Do not promote/push main, dispatch release or alter paused dev triggers
just to obtain CI evidence. Native/device/AT, legal/owner approval, publication and
whole-migration completion are not established by this delivery.
