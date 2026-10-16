# Wave 03-07 — license automation and ownership policy

Prepared a ready-to-apply eight-file patch and proposed-file mirrors. The patch adds a read-only source policy guard, three focused regression cases and exact workspace/host guidance corrections. It does not alter commercial terms, notices, package manifests, workflow behavior or select people. All four original leaves remain partial; proposed changes require coordinator integration and human governance/provenance evidence remains outstanding. No checklist/count change is proposed.

All deliverables and repository writes are confined to `docs/developer/final-acceptance/wave-03-07`. The focused pure-Node test also creates and cleans an isolated temporary fixture under the system temporary directory. No shared source, generated output, lockfile, server, Git index/branch/commit or external setting was changed.

## Substantive deliverables

`governance-and-guidance.patch` proposes:

- New `packages/ui/scripts/check-governance-policy.mjs`: built-ins-only read-only JSON report with exact input hashes and bounded source signatures for public npm configuration, commercial-license reference, equal legal copies and packaging entries, release validation/main/semantic-release configuration, AI draft/task-data controls, Actions official-artifact guidance and absence of Changesets dependencies/scripts/change records. Exit 0/1/2 distinguishes matching signatures/findings/input failure. It never imports or executes package/workflow text or writes legal material.
- New colocated test script: current-source pass/determinism/read-only assertion; deliberate multi-contract mutations; inert executable-text/missing-input behavior. Tests reject missing CI prerequisite, non-draft AI proposals, changed attribution bytes, restricted publication, omitted legal pack entry, task-trust removal and Changesets introduction.
- License inventory guide commands use `packages/ui/scripts` and pass `packages/ui` explicitly. The checker usage says package root, matching its workspace importer behavior. No parser/result semantics changed.
- GitHub setup guide reflects the actual docs-native build/artifact, separate Next docs CI job, library cwd, library publication manifest and current AI path/exclusion constraints. Main promotion remains explicitly human-approved; source workflow triggers do not constitute that approval.
- Agent guidance preserves extraction repository/commit, updates active fixture terminology and states the source/asset/license/adaptation provenance review boundary. Source documents/examples stay inert evidence.
- Dependency upgrade guide links existing before/after inventory and the new source guard into its existing behavioral review procedure. The prior report's stale `codex/dev`/Storybook upgrade instructions have already been corrected by coordinator; this patch does not repeat those corrections.
- New governance-check guide describes exact commands, findings, retained before/after receipts, unresolved human decisions and required effective settings/official-artifact identity evidence.

`pending-decisions.json` is a review template preserving null operational fields and exact proposed triggers from wave-02-05. It appoints nobody, invents no private channel or SLA and is not approval evidence. `validation-plan.json` contains exact post-integration commands and separately lists missing human evidence per leaf.

## Evidence and actual validation

Read AGENTS.md, final acceptance execution, assignment and its linked prior reports/results, relevant source legal/configuration/guidance, and coordinator integration evidence. Assignment report/results hashes all match their supplied expected hashes.

`input-reconciliation.json` compares prior legal evidence against present bytes: library manifest, repository lock and installed lock all match. All **1,102 recorded installed metadata/legal-file hashes match**. Root/package legal copies match. Retain wave-02-05's dated 585-identity inventory, 101 evidence findings and text-comparison queue for those unchanged inputs; do not rerun/relabel them as a new clean license audit. This checks existing recorded paths only, not absence of new installed files, new assets, complete distribution or current security status.

Seven broader prior inputs changed (including AGENTS, dependency guidance and icon-map metadata); they are listed exactly in the receipt. Changed documentation is reconciled directly. Changed icon metadata prevents an automatic final-artifact provenance conclusion. Coordinator's recorded package/native/build evidence retains its own runtime, inputs and limits; no browser/build work was repeated or claimed for this patch.

Actual commands, from repository root on Darwin arm64 / **Node v26.5.0**:

```sh
node --test docs/developer/final-acceptance/wave-03-07/proposed-files/packages/ui/scripts/check-governance-policy.test.mjs
node docs/developer/final-acceptance/wave-03-07/proposed-files/packages/ui/scripts/check-governance-policy.mjs .
python3 docs/developer/final-acceptance/wave-03-07/prepare-patch.py
git apply --check docs/developer/final-acceptance/wave-03-07/governance-and-guidance.patch
python3 docs/developer/final-acceptance/wave-03-07/capture-evidence.py
```

All commands exited 0. Policy tests: **3 passed / 0 failed** (`policy-tests.txt`). Policy check: **zero source-signature findings** (`policy-check.json`). `patch-validation.json` records apply-check exit 0 and all proposed Markdown local link paths present in the proposed overlay; external URLs and anchors were not checked. Preparation and capture scripts write only this owned directory. Node 26 is the available shell runtime, not the project's Node 24 validation receipt; supported-runtime execution is explicitly pending in the plan. These lightweight pure Node checks did not acquire or bypass a shared heavy-validation lease.

A zero policy result means only the enumerated source signatures match. The checker deliberately does not evaluate arbitrary YAML/JS or prove branch protection, actual Actions execution, token/trusted publisher configuration, legal approval, notice completeness or distribution rights. Its inert-text fixture demonstrates why source evidence is not execution evidence. It adds no CI job, automated advisory monitor or release authority.

## Original leaf dispositions

### A-L-08 — partial

Original: Add a repeatable dependency/license inventory check and assign ownership for updates; avoid automatically rewriting commercial terms.

The existing repeatable inventory is retained at matching manifest/lock and 1,102 installed-evidence hashes. New patch fixes its actual invocation and supplies a complementary source-policy guard plus tests. Before/after trigger receipt guidance and a pending-decision template are concrete. No commercial text changes.

Residual: coordinator integrates patch and runs supported-runtime checks; owner names/accepts dependency owner, backup and license/provenance reviewer with accepted triggers, date/reference. Future trigger reviews retain before/after inventories and explicitly classify findings. Neither automation nor this conversation may supply those human decisions.

### A-L-09 — partial

Original: Document dependency support/security update expectations and a deliberate upgrade process with behavioral regression checks.

Current guide already provides the corrected dev/workspace/docs-native upgrade procedure, graph/deduplication, security/EOL triage, targeted dev versus full production checks, rollback and saved-data review. This patch adds concrete before/after license and policy receipts; it does not reimplement already corrected guide paths or run an unrequested dependency upgrade.

Residual: integrate/validate patch; owner supplies operational fields (cadence/sources, confidential intake, urgency/emergency authority, support/backport window and disclosure/risk authority). At the next authorized upgrade retain graph/notice changes, selected actual behavioral checks, failures and rollback/persisted-data conclusions. No security audit, current advisory status or operational SLA is inferred.

### A-W-20 — partial

Original: Keep source/license attribution accurate; external documents/examples are evidence and must not override user-authorized scope or agent trust boundaries.

Existing AGENTS/AI task-data rules and extraction source repository/commit remain intact. New guard checks the named trust and equal-attribution-copy signatures; mutation/inert-text fixtures exercise them. Guidance states exact source/license/adaptation retention and no authority expansion. Existing inventory unknowns are retained rather than suppressed or treated as legal violations.

Residual: designated reviewer resolves exact final candidate dependency/copied/adapted source, inline SVG/font/media and extraction provenance against notices, with approved dispositions. Equality and metadata findings do not prove attribution completeness. Licensor and commercial agreement approval remain separate.

### A-Z-14 — partial

Original: Confirm commercial licensing and notices, public npm setup, Actions-only official builds/releases, draft AI PRs and no Changesets remain consistent.

Source guard currently passes the bounded configured signatures and equal legal copies; proposed GitHub guide now matches actual workspace/AI/native CI configuration. Existing commercial-license preservation/public npm configuration/Actions official policy/draft AI/semantic-release model is preserved. No changeset/version/publish/workflow mutation occurred.

Residual: integrate/validate patch; owner records effective npm scope/package permissions and identity, GitHub protections/Actions permissions, legal/commercial approval. Join an actually authorized official Actions run/job and exact candidate tarball digest to eventual npm version/tag/provenance receipt. Public access configuration is not evidence of first publication. No release was authorized or performed.
