# Wave 03-38 — release configuration and recovery

Delivered a ready-to-apply documentation patch, proposed-file mirrors, executable
offline release checks, full structural lock audit, redacted owner receipt template
and exact coordinator validation plan. **All five original leaves remain partial**:
the patch is unapplied, fresh package-manager generation/install evidence is absent,
and human/admin release decisions are unavailable. No central counts/checklists changed.

Only `docs/developer/final-acceptance/wave-03-38` was written. No shared source,
lockfile, workflow, manifest, output, personal workspace or server was changed.
No Git mutation, install/build/catalog generation, live publishing simulation,
credential inspection, permission change, release or message to another chat occurred.

## Reviewable change

[release-guidance.patch](release-guidance.patch) adds
`docs/troubleshooting/release.md`, links it from setup/troubleshooting, and corrects
the claim that the GitHub plugin creates the tag. Installed semantic-release25.0.9
pushes the tag/Git notes before invoking npm13.2.0, followed by GitHub12.0.10.
This makes tag-only failure a concrete state: an ordinary rerun may see the tag as
the last release and skip the missing publication. The runbook avoids automatic
retry, moving public tags, overwriting versions and using a source revert as a
registry rollback. It covers npm-only history, missing GitHub assets, mismatched
identities, unknown observations, bad releases, deprecation and dist-tag effects.

`proposed-files/` mirrors all three target files. `git apply --check` passed at the
captured input hashes. Coordinator review/integration is still required, especially
if another conversation changes these guidance files. No UI/build test is necessary
for this documentation-only change. The owner template intentionally has null
approvals rather than fabricated identities or permission evidence.

## Original leaf results

| Original leaf and requirement | Result and concrete evidence | Remaining successor |
| --- | --- | --- |
| A-R-07: Regenerate lock through package manager; inspect transitive, overrides, patches and optional dependencies. | Partial. Full parsed lock audit records 585 package records/585 integrities,589 snapshots,86 platform records,109 optional snapshots,53 peer-context keys and49 peer-declaring packages. All three importers match manifests; no overrides, patches or retired MUI/Emotion records. Installed/source lock bytes match. | Authorized isolated package-manager generation and fresh frozen install; preserve no-delta/delta reasoning and actual platform optional selections. No regeneration was permitted in this checkout. |
| A-R-15: Mark breaking removals; distinguish initial publication from subsequent major. | Partial. Actual analyzer and version inference tested both breaking markers: first1.0.0 and existing1.4.2→2.0.0. Existing migration map retained; runbook adds proposed marker and exact release-decision requirements. | Exhaustive historical API/default/removal ledger, final analyzed merge marker, authoritative history and owner release decision. AppButton removal before first release is not silently treated as a published break. |
| A-R-17: Verify npm ownership/public access/auth, GitHub permissions, provenance and notices. | Partial. Configured public access and contents/id-token permissions reviewed. Installed npm plugin calls direct npm publish with preferLocal; lock resolves npm11.21.0. Public unauthenticated GETs returned npm404, GitHub tags200 empty and releases200 empty. Runbook/template enumerate effective auth/binding/CLI/rules/notices checks. | Owner verifies scope/package control, token/2FA or trusted binding/direct-publish permission, CI-local CLI, GitHub rules, provenance and commercial notice approval.404 does not prove private-package absence or scope availability. |
| A-R-26: Define partial-publication, mismatch and bad-release recovery without overwriting. | Partial. Concrete runbook reconciled to installed lifecycle and linked in proposed policy. Offline model passes eight failure-state decisions. | Integrate/adopt policy, assign release/incident owners, record an operator offline drill. Automated model is not human adoption or an exercised live recovery. |
| A-R-28: Safely validate config and control first vs subsequent major trigger. | Partial. Three pure offline tests pass without invoking lifecycle/credentials; runbook requires explicit decision before approved main promotion. Existing main-only workflow/config hashes unchanged. | Owner history/ledger/release approval and required final validation. No main promotion, first publication or subsequent release authorized. |

Original full checklist text, per-leaf commands/runtime/hash links and residuals
are preserved in [results.json](results.json). Historical accepted unaffected
release-policy evidence is retained because manifests, lock, release workflow,
release config and existing release-policy test inputs match wave02-12 hashes.
AGENTS and setup guidance changed; those are read as current input rather than
represented by the old receipt. Coordinator-integration evidence was read and
hashed; its tests are not relabeled as release-owner evidence.

## Checks and exact limits

From repository root:

- `node docs/developer/final-acceptance/wave-03-38/capture.mjs` passed. Full structured
  package/peer/optional/dependency lists are in `lock-audit.json`; input/prior hashes
  are in `evidence.json`. This is structural inspection, not installation,
  vulnerability/license audit or physical optional-package topology proof.
- `python3 docs/developer/final-acceptance/wave-03-38/remote-status.py` performed only
  three public unauthenticated GETs on2026-10-16; statuses/URLs/time are retained in
  `remote-status.json`. No registry bytes downloaded and no token read. Empty
  GitHub remote lists are dated observations, not permission or future-state claims.
- `node --test docs/developer/final-acceptance/wave-03-38/offline-release.test.mjs`
  passed **3/3**; [transcript](offline-release.txt). Actual installed analyzer/version
  functions execute; the recovery table is an explicit offline model. No
  semantic-release lifecycle or publish/verify plugin was invoked. Host Node26.5.0
  is lightweight offline evidence, **not supported Node22/24 conformance**.
- `git apply --check docs/developer/final-acceptance/wave-03-38/release-guidance.patch`
  passed; the patch was not applied. Initial Python YAML probe failed because
  PyYAML is unavailable; capture instead uses installed js-yaml4.3.2 without install.

[validation-plan.json](validation-plan.json) gives exact Node24 rerun, safe isolated
lock-generation/frozen-install commands, expected assertions and missing external
receipts. No native/browser/packed/build run is requested for the docs patch;
required final production validation remains independent and mandatory.

Sources checked for current external requirements: [npm trusted publishers](https://docs.npmjs.com/trusted-publishers/)
requires the matching workflow binding, supported runner/CLI and appropriate direct
publish permission; [npm deprecation](https://docs.npmjs.com/deprecating-and-undeprecating-packages-or-package-versions/)
describes consumer warnings; [semantic-release troubleshooting](https://semantic-release.gitbook.io/semantic-release/support/troubleshooting)
is linked for maintainer recovery review. Installed plugin/core code and hashes,
rather than assumed generic plugin behavior, establish this project's lifecycle.
