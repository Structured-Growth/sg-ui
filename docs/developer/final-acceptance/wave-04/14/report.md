# Wave04/14 — CI release safety and external readiness

Delivered concrete proposed fixes/tooling and fresh read-only platform observations.
**All10 original leaves remain partial.** No central checklist/count changed. Baseline
is `6c485ed79d0d6a521d188e5bde8315722296f518`; initially only the assigned directory was written. Subsequent coordinator steering
authorized direct creation of NEW policy scripts/tests. Four new script/test files
are now present in packages/ui/scripts; existing source/workflows/checklists remain
unchanged. No build edit, install, browser/simulator, commit/push/switch, draft PR,
workflow dispatch, account setting, tag or publication occurred.

## Reviewable deliverables

- [Combined patch](ci-release-readiness.patch), with four remaining proposed edits and full repository-relative
  [proposed files](proposed-files/). Apply-check passes; remaining patch is **unapplied**. Four NEW scripts/tests were
  directly created under the later explicit coordinator authorization.
- Assertion-preserving Node22 token-test fix: compile the actual generated TS module
  using existing TypeScript rather than Node's newer default type stripping.
  Original current-source Node22.12 error is reproduced in [failure log](node22-original.txt).
  Same one existing smoke passes in owned mirror on [Node22.12](node22-proposed.txt)
  and [Node24.21](node24-proposed.txt). All former assertions remain, plus diagnostic
  validation. No generated file/dependency/support-floor/CI selection changes.
- Read-only downloaded CI archive/receipt verifier plus four synthetic tests,
  passing on [Node22](download-verifier-node22.txt) and [Node24](download-verifier-node24.txt).
  Rejects wrong SHA/attempt, missing/skipped/expired evidence, changed archive,
  tarball/output/input receipt and mismatched packaged legal files. It checks
  operator-supplied data consistency, not API authenticity or legal approval.
- [Collection guide](proposed-files/docs/developer/ci-release-readiness.md), linked
  by the proposed workflow-policy update: effective main rules, actual event/check
  mapping, safe retrieval/extraction, receipt identity, timeout headroom and exact
  owner-controlled npm/auth/provenance/release evidence. Reuses existing owner
  template/check verifier; no fabricated owners or approval fields.
- [GET-only collector](collect-metadata.py) and timestamped [raw metadata](remote/index.json).
  Only fixed read endpoints are queried; credential/auth headers are never printed.

## Material findings and retained evidence

Authenticated repository API reports admin capability. Main protection returns404
with `Branch not protected`; effective main rules and repository/inherited rulesets
return empty lists. Owner needs to resolve this production protection gap before
A-R-27 can close. Current default workflow permission is read; PR review approval
is false. Actions are allowed generally and platform SHA pinning is not required;
repository source pins remain intact. These dated responses do not establish every
possible organization policy or authorize a setting change.

The latest10 CI runs returned contain no current baseline run. Latest full run
`37873270629` at `ddb624fdad1289be71be62da06fe2908a2386a03` remains failed:
Node22 failed and Node24 cancelled. Its prior historical logs already documented
Node22's `.ts` loader error; this pass demonstrates it still exists in current source
and supplies the bounded fix. The second inspected run was cancelled with a skipped
full job. No AI runs returned; latest release runs failed. These queries are bounded,
not an exhaustive history search or proof that an unseen workflow never ran.

Unauthenticated npm package GET remains404; public tags/releases lists are empty.
This cannot establish private history, npm scope availability/control or first-release
approval. Existing release workflow/config public-access/provenance intent is source
evidence only. No semantic-release lifecycle or credentialed dry-run was invoked.

Read prior wave03 reconciliation and all relevant07/36/37/38 leaf reports/results,
then newer follow-up/HB19/HB20 evidence. All linked prior report/result hashes match
reconciliation ([exact hashes](evidence.json)). Retain all300 accepted V leaves and
139 open A leaves. Those local library/docs/native/package/UI receipts retain their
original heads and scopes; none is relabeled as current remote CI, npm or legal evidence.

Current integrated workflow YAML/bash/pin configuration and AI inert VM checks pass
**10/10 on Node24.21** ([log](integrated-workflow-node24.txt)). They test configuration,
mocked inline IO and patch substitution guards, not actual token containment or a
live default-token draft. `actionlint` is absent; no installation attempted.

Only lightweight pure tests and own-mirror writes were used. The token mirror copies
current token JSON/generated TS/compiler and changes only TypeScript module resolution
to the already-installed workspace package. [Harness](verify-token-fix.mjs) preserves
that exact substitution. It is not production integration or a full Node22 check.

## Additional authorized implementation — direct scripts ready

Coordinator relayed the user's request for more implementation and explicitly
allowed NEW uniquely named policy-test/scripts files while preserving existing
workflow proposal-only boundaries. Created directly, with no existing file edits:

- `packages/ui/scripts/check-ci-release-enforcement.mjs`
- `packages/ui/scripts/check-ci-release-enforcement.test.mjs`
- `packages/ui/scripts/verify-ci-downloads.mjs`
- `packages/ui/scripts/verify-ci-downloads.test.mjs`

Six enforcement fixture tests pass on [Node22.12](enforcement-node22.txt) and
[Node24.21](enforcement-node24.txt). They load current YAML and exercise production
and infrastructure routing, main/reusable gates, required Node matrix, exact-head
checks, forbidden skip/failure bypasses, AI draft/default-token/credential boundaries,
legacy protection and effective rulesets. Negative fixtures reject missing/denied
settings, missing/stale check contexts, absent owner review and missing actual
failed/missing-check blocking observations. Fixtures are synthetic and prove only
these source/receipt checks. The guard accepts parsed JSON with no new runtime
dependency; tests reuse the frozen installed js-yaml package.

Four downloaded-artifact verifier cases also pass directly from new production
script paths on [Node22](direct-download-verifier-node22.txt) and
[Node24](direct-download-verifier-node24.txt); scratch stays in this owned directory.
The real collected settings produce the expected **exit1/incomplete** result with
[eight specific missing protections/observations](current-enforcement-result.json).
No synthetic green result replaces that finding. [Input descriptor](current-enforcement-receipt.json)
contains current parsed workflows/raw GET bodies with owner/context/blocking fields
null; the [driver](check-current-enforcement.mjs) only writes this owned receipt.

The remaining combined patch contains the existing token test fix, two guidance
files and one CI step running all10 new policy/verifier fixtures while preserving
all mandatory checks, event routing, permissions and artifact handling.
The [proposal validation](workflow-proposal-node24.json) (also
[Node22](workflow-proposal-node22.json)) parses YAML/shell, asserts the entire old
workflow object is unchanged after removing exactly that one added step, and runs
the workflow policy guard against the proposed CI. It does not replace actionlint
or real Actions execution. New script mirrors are retained for review; they already exist
in the checkout and are not re-added by that patch. Source hashes for all four new
files are in evidence.json; these files are ready for coordinator integration now.

## Per-leaf recommendations

### A-R-12 — partial

Original: A-R-12 Reconcile original `R-12`: Keep Storybook builds and official tarballs as Actions artifacts; record artifact names, retention, and validation results. Both runtime jobs and six unexpired artifacts verified at `c78a24e`, run 37559276148; [artifact evidence](react-aria-runtime-ci.md). Historical status: checked.

Pinned success-only package/native uploads and 14-day retention are integrated. New digest/inventory verifier and retrieval guide prepared. Newest inspected full CI run remains failed at ddb624f; no current native replacement artifact success exists in returned runs.

Source/evidence: `.github/workflows/ci.yml`, `packages/ui/scripts/ci-artifacts.mjs`, `docs/developer/react-aria-runtime-ci.md`. Remote: `remote/ci-runs.json`, `remote/37873270629-jobs.json`, `remote/37873270629-artifacts.json`. Exact SHA256 values are per-ID in [results.json](results.json).

Remaining successors:

- CI-REMOTE-CANDIDATE: successful full direct CI at reviewed final head on both runtimes, plus Next.js docs.
- CI-ARTIFACT-RETRIEVAL: download identified unexpired package/native/log/browser archives, bind API/archive/receipt/tarball/output bytes and inspect actual results.

### A-R-17 — partial

Original: A-R-17 Reconcile original `R-17`: Verify npm scope ownership, public access, trusted-publishing/token setup, GitHub release/tag permissions, provenance requirements, and commercial notices before publication. Historical status: open.

Public manifest/access, release permissions, provenance switch and unchanged legal copies remain source evidence. Fresh public npm GET is404; tags/releases empty. Repository read capability includes admin, which does not establish npm or workflow-token tag authority.

Source/evidence: `packages/ui/package.json`, `.github/workflows/release.yml`, `packages/ui/release.config.mjs`, `docs/commercial-licensing.md`, `packages/ui/LICENSE`, `packages/ui/THIRD_PARTY_NOTICES.md`. Remote: `remote/npm-package.json`, `remote/tags.json`, `remote/releases.json`, `remote/repository.json`, `remote/main-protection.json`, `remote/main-rules.json`. Exact SHA256 values are per-ID in [results.json](results.json).

Remaining successors:

- OWNER-NPM: redacted scope/package authority and chosen auth route, exact binding/direct-publish permission or token/2FA route, effective plugin-local CLI/runtime.
- OWNER-RELEASE-LEGAL: effective GitHub tag/release authority/provenance eligibility and commercial/notices approval for exact candidate.

### A-R-21 — partial

Original: A-R-21 Reconcile original `R-21`: Preserve minimal workflow permissions, trusted/untrusted input separation, credential isolation, separate validation, and draft-PR review; never auto-merge AI proposals. Historical status: open.

Integrated fresh read-only generated-code validation, separate write job, original patch identity check, draft-only proposal and no inherited CI secrets pass existing10 workflow/config tests on Node24. Read-only API reports default read permission and no PR approval capability; allowed actions all and no platform SHA-pinning requirement. No AI runs returned.

Source/evidence: `.github/workflows/ai-code.yml`, `packages/ui/scripts/ai-component-scope.test.mjs`. Remote: `remote/ai-runs.json`, `remote/workflow-permissions.json`, `remote/actions-permissions.json`. Exact SHA256 values are per-ID in [results.json](results.json).

Remaining successors:

- AI-TRUST-REVIEW: maintainer reviews exact pinned action source, downloaded CLI/API-key sandbox and effective per-job credentials without exposing secrets.
- AI-HARMLESS-FIXTURE: separately authorized live draft establishes isolation, unchanged original patch, draft/no-auto-merge behavior and independent full validation.

### A-R-23 — partial

Original: A-R-23 Reconcile original `R-23`: Verify AI-created draft PR validation even when default-token PR creation does not trigger another workflow; do not rely on absent CI events. Historical status: open.

Explicit reusable full CI at returned draft SHA and checked-head assertions are integrated; inert VM tests pass. Empty AI run list means there is no live default-token draft evidence to reuse.

Source/evidence: `.github/workflows/ai-code.yml`, `.github/workflows/ci.yml`. Remote: `remote/ai-runs.json`. Exact SHA256 values are per-ID in [results.json](results.json).

Remaining successors:

- AI-DEFAULT-TOKEN-RECEIPT: separately authorized harmless draft; save resulting PR/head/action output, explicit reusable run, actual checkout/job/check contexts and conclusions without relying on PR event.

### A-R-24 — partial

Original: A-R-24 Reconcile original `R-24`: Update workflow timeouts/artifact handling as browser checks expand; cache by lockfile and avoid stale build outputs masking missing CSS or dependencies. Historical status: open.

Freshness/cache/timeout source guards integrated;10 configuration/AI tests pass. Reproduced current Node22.12 failure and prepared assertion-preserving transpilation fix, passing same token smoke on22.12/24. New verifier rejects corrupt/stale artifacts. Full timing sufficiency remains unmeasured.

Source/evidence: `.github/workflows/ci.yml`, `packages/ui/scripts/ci-artifacts.mjs`, `packages/ui/src/foundation/Tokens.next100-regression.test.mjs`. Remote: `remote/37873270629-jobs.json`, `remote/ci-runs.json`. Exact SHA256 values are per-ID in [results.json](results.json).

Remaining successors:

- INTEGRATE-NODE22-FIX: apply reviewed proposed token test and run1 affected case under Node22.12 and24.
- CI-BUDGET-FAILURE-EVIDENCE: reviewed full candidate run measures60m/45m Node24,30m Node22,20m docs headroom; inspect retained failure logs/traces and cache/freshness receipts.

### A-R-25 — partial

Original: A-R-25 Reconcile original `R-25`: Pin/review workflow dependencies according to repository policy and validate proposed workflow changes without weakening protections to make checks pass. Historical status: open.

All seven action SHA pins/cache policy and unchanged safeguards pass integrated configuration tests; prior upstream identities/metadata retained. New concrete Node22 repair does not change workflows, protections, assertions or selection. actionlint is unavailable.

Source/evidence: `docs/developer/workflow-dependency-policy.md`, `docs/developer/final-acceptance/wave-03-36/remote/action-pins.json`, `.github/workflows/ci.yml`, `.github/workflows/ai-code.yml`, `.github/workflows/release.yml`, `.github/workflows/pr-title.yml`. Remote: `remote/actions-permissions.json`. Exact SHA256 values are per-ID in [results.json](results.json).

Remaining successors:

- ACTION-DEPENDENCY-REVIEW: designated maintainer reviews all7 resolved action implementations/release notes/bundled dependencies and Codex downloaded CLI; records approved policy/version decisions.
- ACTIONLINT-EVENT-VALIDATION: run available approved actionlint without installing in shared checkout, then actual representative PR/main/reusable paths without dispatching Release as a probe.

### A-R-27 — partial

Original: A-R-27 Reconcile original `R-27`: Ensure release-blocking checks actually run on the PR and main paths, including AI proposals and maintainer infrastructure PRs; check branch-protection names against the final workflow jobs. Historical status: open.

Direct production PR/main triggers and explicit AI full validation are configured. Current admin-readable API reports main Branch not protected, empty effective rules and rulesets. Old failure jobs have observed direct names Validate Node22.12/24 but no current successful Next docs/AI context receipt.

Source/evidence: `.github/workflows/ci.yml`, `.github/workflows/pr-title.yml`, `.github/workflows/ai-code.yml`, `.github/workflows/release.yml`, `docs/developer/final-acceptance/wave-03-37/verify-check-receipt.mjs`. Remote: `remote/main-protection.json`, `remote/main-rules.json`, `remote/rulesets.json`, `remote/repository.json`, `remote/37873270629-jobs.json`, `remote/ai-runs.json`. Exact SHA256 values are per-ID in [results.json](results.json).

Remaining successors:

- OWNER-PROTECTION: authorized owner adopts/reviews effective main PR/review/current required-context and bypass rules, preserves dev pause and supplies exact raw settings. No settings mutation authorized here.
- CHECK-PATHS: save actual production PR, infrastructure PR, existing-authorized main, and default-token AI exact-head context mappings with successful conclusions; owner-approved failed/missing-check blocking observations.

### A-R-28 — partial

Original: A-R-28 Reconcile original `R-28`: Validate release configuration safely without publishing while implementing it; explicitly control whether final migration merges will trigger the first public release or a subsequent major release. Historical status: open.

Main-only semantic-release policy and release prerequisite preserved. Prior offline analyzer proves first1.0.0 versus existing1.4.2 to2.0.0; public current tags/releases remain empty and npm404. No lifecycle or dry-run invoked; no release authority inferred.

Source/evidence: `packages/ui/release.config.mjs`, `packages/ui/scripts/release-policy.test.mjs`, `.github/workflows/release.yml`, `docs/troubleshooting/release.md`. Remote: `remote/npm-package.json`, `remote/tags.json`, `remote/releases.json`, `remote/release-runs.json`. Exact SHA256 values are per-ID in [results.json](results.json).

Remaining successors:

- OWNER-RELEASE-DECISION: authoritative private/public history plus final breaking-delta ledger and analyzed merge marker; explicit exact-candidate first-publication or subsequent-major decision and human main-promotion approval.
- FINAL-PRODUCTION-VALIDATION: required full checks and official evidence before any separately approved release.

### A-Z-14 — partial

Original: A-Z-14 Reconcile original `Z-14`: Confirm commercial licensing and notices, public npm setup, Actions-only official builds/releases, draft AI PRs and no Changesets remain consistent. Historical status: open.

Commercial/license/public access/Actions/draft/no-Changesets source model retained. Current effective platform metadata exposes the production protection gap; no publication or owner/legal receipt exists. New guide joins owner and artifact evidence rather than inferring readiness from source.

Source/evidence: `packages/ui/package.json`, `packages/ui/scripts/check-governance-policy.mjs`, `.github/workflows/release.yml`, `.github/workflows/ai-code.yml`, `docs/commercial-licensing.md`. Remote: `remote/npm-package.json`, `remote/tags.json`, `remote/releases.json`, `remote/main-protection.json`, `remote/rulesets.json`. Exact SHA256 values are per-ID in [results.json](results.json).

Remaining successors:

- OWNER-NPM and OWNER-RELEASE-LEGAL; OWNER-PROTECTION; AI-DEFAULT-TOKEN-RECEIPT.
- AUTHORIZED-OFFICIAL-CHAIN: when separately authorized, join successful Actions job/candidate tarball SHA to npm version/tag/GitHub release/provenance. Do not publish to obtain acceptance evidence.

### A-Z-07 — partial

Original: A-Z-07 Reconcile original `Z-07`: Delete/rebuild generated dist, Storybook and package output during verification; no stale artifact may pass as migrated source. Fresh build, executed static stories and eight new packed consumers in the [browser batch record](react-aria-progress.md#executable-browser-gates-and-removal-audit). Historical status: checked.

Accepted coordinator fresh library/native/package receipts and HB19/20 retained under their recorded scopes; no new builds. Integrated ci-artifacts begin/complete reject stale outputs. New offline verifier binds downloaded native/packed dist hashes and rejects extra files. Final candidate remote/installed consumer matrix remains outstanding.

Source/evidence: `packages/ui/scripts/ci-artifacts.mjs`, `docs/developer/final-acceptance/wave-03-followup/validation-results.json`, `docs/developer/final-acceptance/editor-chrome-presentation/results.json`, `docs/developer/final-acceptance/rich-editor-presentation/results.json`. Remote: `remote/ci-runs.json`, `remote/37873270629-jobs.json`. Exact SHA256 values are per-ID in [results.json](results.json).

Remaining successors:

- CI-REMOTE-CANDIDATE and CI-ARTIFACT-RETRIEVAL at reviewed final head; serial React18/19 foundation/editor, Node22/24 and Node24 Next/browser consumers per existing CI.
- Retain unrelated accepted V evidence; run only changed token test before coordinator full checkpoint. No Storybook restoration.

## Coordinator boundary

[Validation plan](validation-plan.json) gives exact bounded integration checks and
separately identifies serialized full CI, artifact retrieval and owner successors.
Review hashes and apply the patch before running the one affected token test on22/24
and four verifier cases. No UI build is needed for the docs/tooling patch itself;
required final production matrix remains mandatory and coordinator-owned.
Do not dispatch Release/push main merely to obtain a receipt. Owner adoption,
legal approval, actual default-token AI behavior and effective merge blocking
cannot be manufactured by offline fixtures or by this report.
