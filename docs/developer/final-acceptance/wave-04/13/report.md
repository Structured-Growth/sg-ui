# Wave 04/13 — licenses, dependencies and attribution

Recommend **one documentary obligation complete (A-L-09), eight partial**. The coordinator decides acceptance; no shared checklist/count changed. All files written are inside this assignment directory. No install, build, pack, browser/simulator, release, account mutation, branch change, commit or push occurred.

The concrete deliverables are a four-file wording/documentation patch, proposed mirrors, a standard-library archive/license evidence checker with four passing focused cases, and a current-to-retained-archive join that exposes the remaining artifact and provenance gaps. Existing license inventories are reused by exact input identity rather than claimed as a newly resolved dependency graph.

## Implementation follow-up — executable tools completed

Following the human request for more implementation, `implementation.patch` now
contains **all eight integration files**, including two executable checkers and
their colocated tests. It includes the original four-document patch, so apply the
combined patch once; do not apply both patches. `git apply --check` passes.
`implementation-preconditions.json` records pre-integration input hashes and new-file hashes.

Ready paths:

- `packages/ui/scripts/check-packed-license-evidence.py`
- `packages/ui/scripts/check-packed-license-evidence.test.py`
- `packages/ui/scripts/check-lock-provenance.py`
- `packages/ui/scripts/check-lock-provenance.test.py`
- `THIRD_PARTY_NOTICES.md`
- `packages/ui/THIRD_PARTY_NOTICES.md`
- `docs/developer/react-aria-architecture.md`
- `docs/developer/react-aria-license-inventory.md`

**Nine focused tests pass**: four packed-license cases and five lock-orchestration/
receipt cases. Logs: `packed-tool-tests.txt`, `lock-tool-tests.txt`. The colocated
tests run directly from their proposed paths now and unchanged after integration.
No new runtime/development dependency or package manifest change is needed.

The lock tool's explicit `capture` mode verifies a clean isolated checkout, exact
HEAD/initial lock digest, Node24 and repository-declared pnpm version. It runs real
package-manager generation, stops for review if any inputs change, then runs a
normal frozen installation and captures the actual physical graph. Every command
has retained arguments, exit/log hashes and checkpoints; timeouts/failures stop
later execution. `check` mode validates receipt/input/log/lock identity and ordering
without executing commands. Changed graphs, tampered logs, dirty inputs and failed
installs are covered by synthetic orchestration tests. They are **not** a real
SGUI installation receipt. Local log evidence is not independently authenticated
execution attestation. Supported-platform selections and full locked topology
still require bounded review. No shared install was run in this conversation.

## Coordinator integration observed during finalization

All eight proposed targets now exist in the shared checkout and match the proposed
mirrors byte-for-byte (`integration-observation.json`). The coordinator integrated
them while this worker was finalizing; this worker still wrote only its own folder.
Do not reapply the combined patch. The initial applicability check passed; the later
check correctly fails for already-present files/changed prose. The assembly helper
also stops on existing targets rather than overwriting integrated work.

The first notice mirrors used `read_text`, which normalized line endings in the
embedded tslib license; the patch itself never changed that legal block. The
coordinator's raw mixed-line-ending bytes were retained, and the mirrors/check were
corrected to use raw bytes. Final notice copies and legal blocks are exact. No legal
words or shared source were changed by this correction. The first observation is
retained separately rather than hidden.

## Evidence retained and bounded new checks

Baseline HEAD is `6c485ed79d0d6a521d188e5bde8315722296f518`. Read AGENTS, final-acceptance/hardening execution, wave03 integration reconciliation, original wave03-06/07/35/38 successors, and the newer editor presentation receipts. Latest overall baseline remains 300/300 V complete and139 A pending; V completion supplies no legal/owner approval.

`evidence.json` records exact SHA-256s of all selected sources and historical reports. **58/58** previously reviewed manifest/lock/installed-license inputs match wave03-06, including all55 license files. All five lock-review inputs also match wave03-38 (`lock-reconciliation.json`), retaining its585 package records,589 snapshots,86 platform records,109 optional snapshots and absence of overrides/patched dependencies. None of that proves package-manager regeneration or a clean physical optional installation. No such later receipt was found in reviewed integration/follow-up evidence.

The retained archive exists at `packages/ui/artifacts/wave03-frozen-package/structured-growth-sg-ui-0.0.0-development.tgz`, SHA-256 `54e1cb04c3d0e1b37f68a9b3603078ac97d2a6d3ff6890bac34efff8b9310fd0`. Reusing the existing wave03-35 read-only scanner produces `retained-archive-reference-audit.json`: **1,802 regular members, zero technical reference errors**. JS, declarations, CSS, source maps, README, notices and binary ASCII references remain in its all-member hash receipt. Existing legal/historical strings retain their classifications; no notice is removed.

The new `retained-archive-license-join.json` independently ties that archive to the reviewed installed inventory: **56 runtime/peer identities,55 available whole normalized license texts, all55 present in packed notices**. Packed LICENSE and notices equal the current root/package copies. It returns **exit1**, correctly retaining `client-only@0.0.1` missing legal-file evidence, packed package.json drift, **128 changed packed dist members** and **38 current dist files absent from that archive**. This historic artifact cannot certify current source/output or a final release. A matching current dist alone would still need its fresh build/source receipt.

## Concrete proposals

`provenance-wording.patch` updates the two equal notices, architecture guidance and license-inventory guide. The notices currently assert categorically that upstream implementation/example styles were never copied; architecture guidance similarly claims no examples, code or icon assets were copied. Prior reports explicitly leave that provenance unverified. The proposal replaces those claims with the actual pending review boundary. **Every existing fenced legal block remains byte-identical, both notice copies remain equal, zero notices removed, LICENSE/commercial terms untouched.** `proposal-check.json` records this check. Current96 concrete icon wrappers import `lucide-react`; their source hashes are retained, without interpreting imports as proof about historical copying.

`proposed-files/packages/ui/scripts/check-packed-license-evidence.py` joins an existing archive to manifest/lock/installed legal evidence, hashes all members, checks exact packed/root/package legal equality, checks whole normalized legal text presence and reports current dist differences. It never extracts archives, installs, builds or writes legal material. Invalid archive/evidence paths, links, duplicate members and oversized members fail. Exit0/1/2 means defined byte pass/findings/invalid inputs; never legal approval. Its conservative supplemental text coverage does not decide actual bundling or legal obligations. Copied source/inline attribution, Apache modified-file statements, fonts/icons and docs bundles still require reviewer disposition.

`test-packed-license-evidence.py`: **4/4 pass** under Python3.9.6. Cases cover a read-only clean join, stale lock/truncated copyright text, missing runtime legal evidence/output drift, and unsafe/duplicate/escaping inputs. `tool-tests.txt` retains the actual run. No UI tests were added for a text/audit-helper proposal. `git apply --check` passes; the patch has not been applied. The helper is supplied as a repository-relative proposed file for coordinator copying.

## Per-leaf recommendations

### A-L-01 — partial

- [ ] A-L-01 Reconcile original `L-01`: Verify the selected versions' actual licenses, including React Aria Components, hooks/state/date utilities, icon assets, grid engine, editor packages, and transitive distributed code. Historical status: open.

58 prior manifest/lock/license input hashes match; retained archive joins all55 whole available legal texts across56 runtime/peer identities. client-only remains without legal-file evidence; no license compatibility or copied-code conclusion inferred.

Remaining: PROVENANCE-OWNER; CANDIDATE; JOIN. Exact runnable steps are in `validation-plan.json`.

### A-L-02 — partial

- [ ] A-L-02 Reconcile original `L-02`: Preserve Apache 2.0 licenses and applicable notices; record modifications where required if upstream code is copied or changed rather than merely depended on. Historical status: open.

Exact retained Adobe and SWC license text evidence is preserved; every existing proposed legal fence remains byte-identical. Removed unsupported blanket no-copy assertion in proposed prose; no upstream code modification is asserted.

Remaining: REVIEW-INTEGRATE; PROVENANCE-OWNER; CANDIDATE; JOIN. Exact runnable steps are in `validation-plan.json`.

### A-L-04 — partial

- [ ] A-L-04 Reconcile original `L-04`: Refresh `THIRD_PARTY_NOTICES.md` from the final shipped dependency and asset inventory; remove a retired notice only after its code/assets are no longer distributed. Historical status: open.

Integrated supplemental notice texts are present in the retained archive. Equal current copies and complete available-text joins are evidenced; a ready-to-review clarification and durable archive/inventory joining helper are supplied.

Remaining: REVIEW-INTEGRATE; PROVENANCE-OWNER; CANDIDATE; JOIN. Exact runnable steps are in `validation-plan.json`.

### A-L-08 — partial

- [ ] A-L-08 Reconcile original `L-08`: Add a repeatable dependency/license inventory check and assign ownership for updates; avoid automatically rewriting commercial terms. Historical status: open.

Repeatable inventory/governance tools are already integrated; new companion joins installed legal evidence to a concrete archive. Ownership cannot be appointed by this agent and remains the literal unsatisfied clause.

Remaining: REVIEW-INTEGRATE; PROVENANCE-OWNER. Exact runnable steps are in `validation-plan.json`.

### A-L-09 — complete

- [ ] A-L-09 Reconcile original `L-09`: Document dependency support/security update expectations and a deliberate upgrade process with behavioral regression checks. Historical status: open.

The shipped dependency-upgrade guide documents supported input expectations, review triggers/EOL exceptions, security triage, deliberate graph/notice/behavioral validation and rollback. Recommend complete for this documentary criterion only. Prior report additionally held future operational appointments and the next actual upgrade; those are not claimed and remain under L08/R07 and the explicit decision table.

Remaining: Operational owner/security-intake/cadence decisions remain visibly pending; this recommendation approves no SLA, current advisory status or executed upgrade.. Exact runnable steps are in `validation-plan.json`.

### A-R-07 — partial

- [ ] A-R-07 Reconcile original `R-07`: Regenerate the lockfile through the package manager and inspect resolved transitive dependencies, overrides, patched dependencies and optional packages. Historical status: open.

All five manifest/workspace/lock inputs match the prior full YAML audit:585 packages,589 snapshots,86 platform records,109 optional snapshots; no overrides or patches. No later actual package-manager regeneration/fresh-install receipt was found in reviewed successor reports; source lock equality cannot replace it.

Remaining: R-LOCK-GENERATE. Exact runnable steps are in `validation-plan.json`.

### A-W-20 — partial

- [ ] A-W-20 Reconcile original `W-20`: Keep source/license attribution accurate; external documents/examples are evidence and must not override user-authorized scope or agent trust boundaries. Historical status: open.

Task-data boundaries remain in AGENTS and agent guidance;96 concrete current icon wrappers import Lucide. Proposed corrections replace unsupported no-copy categorical statements while preserving every license fence and commercial terms. Historical extraction provenance remains unverified upstream.

Remaining: REVIEW-INTEGRATE; PROVENANCE-OWNER; CANDIDATE; JOIN. Exact runnable steps are in `validation-plan.json`.

### A-Z-06 — partial

- [ ] A-Z-06 Reconcile original `Z-06`: Remove obsolete notices only after confirming no associated source/assets remain in package or catalog; final third-party notices match shipped work. Historical status: open.

No historical notice removed. Current and proposed legal fences are preserved; available runtime license text matches the retained archive. Final source/asset/provenance and current-candidate joins remain explicit.

Remaining: REVIEW-INTEGRATE; PROVENANCE-OWNER; CANDIDATE; JOIN. Exact runnable steps are in `validation-plan.json`.

### A-Z-08 — partial

- [ ] A-Z-08 Reconcile original `Z-08`: Audit packed JavaScript, declarations, CSS, source maps, assets, README and notices for retired references and transitive code; ensure the release tarball has no old requirement. Historical status: open.

Retained archive54e1cb04 has1802 regular files and zero classified retired-reference errors. License join exposes128 changed packed dist files,38 new current dist files,packed manifest drift and missing client-only evidence. It is not a current release candidate. All-member audit plus exact legal/input join is executable, without rebuilding here.

Remaining: CANDIDATE; JOIN; PROVENANCE-OWNER. Exact runnable steps are in `validation-plan.json`.

## Acceptance boundary and next execution

A-L-09 is a recommendation limited to its exact **documentation** obligation. The integrated guide already documents supported versions/expectations (line9), graph/deduplication (52), security triage (88), deliberate upgrades/rollback (125), behavioral/consumer checks (171) and explicit pending human decisions (221). Its earlier partial report also held appointments and the next future upgrade. This recommendation does not assert either happened: L08 still holds owner appointment, R07 still holds actual lock generation, and the guide's decision table remains pending. No approval or operational SLA is inferred. Coordinator may retain the prior hold if an explicit additional human policy decision is part of their acceptance interpretation.

The immediate next work is coordinator review/integration of the four-file patch/helper and an exact fresh candidate/inventory join under the existing leases. A separate isolated package-manager regeneration/frozen installation must retain its real logs/diff/platform optional selections. The designated reviewer then records client-only rights/text and source/asset/inline/modified-file notice dispositions against that candidate digest, including the private docs distribution. Repository owner appoints dependency/license owner and backup. Existing pending-decision templates are retained at wave03-07/pending-decisions.json; no duplicate fictional appointments are created here.

`validation-plan.json` provides bounded commands, cwd/runtime, expected findings and human deliverables. Reuse accepted behavior evidence; these proposed prose/tool changes introduce no new native/browser/AT requirement. Independent runtime changes and eventual explicitly authorized production acceptance keep their own validation gates.

`artifact-manifest.json` hashes this handoff; `evidence.json` hashes source and prior reports. No legal compatibility, copied-code absence, spoken-AT result or human release/legal approval follows from a text or archive check.

## Larger-batch readiness follow-up

Batch lead14 owns the frozen pack/lock/evidence window. The registry's19 coordinator
closures remain untouched. No duplicate candidate, install, source/fixture build or
Apple execution was started here.

`cli-e2e.test.py` adds three process-level checks against the **integrated shipped
CLI files**: packed evidence pass/findings exit codes; isolated lock capture/check
and tampered-log rejection; actual child exit7 retained as failed-install evidence,
CLI exit2 and no later graph command. All3 pass in `cli-e2e-results.txt`. It uses
synthetic pnpm/node/git fixtures, writes only inside this assignment directory and
does not claim a real dependency installation or supported toolchain execution.
The original9 colocated checks remain accepted and were not repeated.

`batch-readiness.json` records exact integrated implementation hashes and the
registry identity. Both helpers are ready for lead14's actual end-to-end candidate
window; no further shared production patch was required by these process tests.
Root should relay this readiness to lead14 and retain its eventual actual pack,
lock-generation/install and provenance results. Counts and owner/legal decisions
remain coordinator-owned.
