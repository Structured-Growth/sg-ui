from pathlib import Path
import hashlib
import json

root = Path.cwd()
own = root / 'docs/developer/final-acceptance/wave-04/13'
lead = root / 'docs/developer/final-acceptance/wave-04/14/batch-execution'
a = json.loads((own / 'assignment.json').read_text())
prior = json.loads((own / 'results.json').read_text())
review = json.loads((own / 'fresh-receipt-review.json').read_text())
source = json.loads((lead / 'results.json').read_text())
entries = source.get('entries', [])
by_id = {x['id']: x for x in entries}
# The supplemental reconciliation does not rewrite the original handoff.
changes = {
    'A-L-08': ('complete', 'Repeatable inventory capability and maintained role-based ownership are proved: actual repeated inventory, tested tools, change-author update responsibility and maintainer review in inventory/governance guidance. A named-person appointment was an additional hold in the original handoff, not part of the original criterion. Legal/provenance decisions stay separate.', []),
    'A-R-07': ('complete', 'Actual isolated pnpm10.29.3 lock generation, normal frozen installation and full lock/physical graph inspection are retained. Source/generated/installed lock bytes are equal. Review585packages/589snapshots, overrides/patches absent,86platform/109optional records and507physical instances/503identities. Darwinarm64 observations are not a cross-platform support certification.', []),
    'A-Z-08': ('complete', 'Fresh exact archive08c25637e641540c38fe0d42f3d143f8edaabf19716c1c5718a18fb155211f35 has1857verified regular members and no technical retired-reference errors.1853dist members matched the frozen fresh build; locked transitive graph reviewed. JS/declarations/CSS/maps/assets/README/notices included. No legal-attribution completeness claim follows.', []),
    'A-L-01': ('partial', 'All55 available runtime/peer license texts preserved across56identities. Published client-only0.0.1 has exact verified archive/installed identities but no legal/copyright text or authoritative source commit. Asset/copied-source distribution review remains independent.', ['Resolve authoritative client-only legal/copyright/source evidence; review actual copied/asset and docs-distribution obligations.']),
    'A-L-02': ('partial', 'Exact Apache licenses and existing notices are preserved in the fresh candidate. Remaining Apache copied/adapted/inline attribution and required modification-notice review is independent of client-only, whose metadata declares MIT.', ['Resolve copied/adapted Apache-file provenance and any applicable inline/NOTICE/modified-file statements against exact source/member hashes. Do not hold unrelated package tests on the MIT client-only gap.']),
    'A-L-04': ('partial', 'Fresh notices match root/package/packed bytes and all55 available texts. Final legal completeness remains unresolved by missing client-only text and actual copied-source/asset distribution dispositions.', ['Resolve missing legal text and final distribution/provenance notice decisions; update both copies deliberately and rejoin only affected legal/candidate bytes.']),
    'A-W-20': ('partial', 'Trust boundaries and attribution wording are implemented; external examples remain task data. Categorical no-copy claims were removed. Actual unavailable upstream extraction/derived-source attribution and asset provenance remain unproved.', ['Record verifiable upstream/copy/asset origin and required attribution; retain trust boundaries. No external document may approve scope or override user instructions.']),
    'A-Z-06': ('partial', 'No historical attribution was removed and all existing legal text is preserved in the fresh artifact. The final notice/provenance decision remains open; absence of a current package name alone never authorizes deletion.', ['Resolve final distributed-material obligations and missing legal text before any notice retirement; preserve current historical notices meanwhile.']),
    'A-L-09': ('complete', 'Previously recommended documentary closure retained; source support/security/upgrade guide remains shipped. Human operational decisions remain explicitly pending without becoming extra criteria for completed technical leaves.', [])
}
rows = []
prior_by_id = {x['id']: x for x in prior['leaves']}
for id, criterion in zip(a['ids'], a['obligations']):
    status, outcome, remaining = changes[id]
    rows.append({'id': id, 'originalCriterion': criterion, 'originalHandoffRecommendation': prior_by_id[id]['recommendation'], 'supplementalRecommendation': status, 'outcome': outcome, 'remainingSuccessors': remaining, 'leadEvidenceEntry': 'docs/developer/final-acceptance/wave-04/14/batch-execution/results.json#' + id if id in by_id else 'Prior documentary closure; preserve coordinator acceptance', 'evidence': ['fresh-receipt-review.json', 'cli-e2e-fresh-candidate-results.txt'], 'centralChecklistChanged': False})
result = {'schemaVersion': 1, 'purpose': 'Supplement to historical13 handoff using later actual accepted lead14 evidence; never relabel prior pending receipts as fresh.', 'coordinatorAcceptedTechnicalClosureNotification': ['A-L-08', 'A-R-07', 'A-Z-07', 'A-Z-08'], 'coordinatorAcceptedCountFromNotification': 26, 'countModifiedHere': False, 'newCompleteRecommendationsForOriginal13Scope': ['A-L-08', 'A-R-07', 'A-Z-08'], 'priorDocumentaryClosurePreserved': 'A-L-09', 'remainingOriginal13Partial': ['A-L-01', 'A-L-02', 'A-L-04', 'A-W-20', 'A-Z-06'], 'entries': rows, 'independentReviewPass': review['technicalReceiptReviewPass'], 'actualPackageManagerExecutionByThisWorker': False, 'newProcessChecks': {'passed': 4, 'scope': 'Real shipped CLI subprocesses on synthetic fixtures; normalized pnpm manifest accepted, modified dependencies/exports/unexpected metadata rejected; failed installs/log tamper remain rejected.', 'log': 'cli-e2e-fresh-candidate-results.txt'}, 'limits': ['Fresh archive/lock execution is lead14 evidence; our independent verification reads hashes and receipts only.', 'client-only MIT metadata is not a full legal text or permission approval. No legal/commercial/production approval inferred.', 'No install/build/pack/browser/Apple/release/settings/Git mutation or shared file edits in this follow-up.']}
(own / 'fresh-reconciliation.json').write_text(json.dumps(result, indent=2) + '\n')
text = '''# Supplemental fresh dependency/license reconciliation

This supplements the original wave04/13 report/results; those historical receipts
and their pending statements are preserved. Later actual evidence from lead14
supersedes the original CANDIDATE/JOIN, R07 execution and L08 named-owner holds.
Root/lead14 reported technical closures L08/R07/Z07/Z08 accepted into canonical26.
This worker edits no shared checklist or acceptance count.

For this original13 assignment, recommend **A-L-08, A-R-07 and A-Z-08 complete**,
retain the earlier A-L-09 documentary closure, and retain **five partial** license/
source-provenance leaves. A-Z-07 belongs to lead14 and is acknowledged separately.
The exact original criteria and individual dispositions are in
[fresh-reconciliation.json](fresh-reconciliation.json).

## Independently verified exact evidence

Candidate `packages/ui/artifacts/wave04-package-candidate/structured-growth-sg-ui-0.0.0-development.tgz`
has SHA256 `08c25637e641540c38fe0d42f3d143f8edaabf19716c1c5718a18fb155211f35`.
All1857regular member hashes/sizes match the retained packed audit;1853dist files
matched lead14's frozen fresh output. The corrected source/legal/log and archive
identity joins are stable. The all-member technical retired-reference audit has
zero errors. All55available whole legal texts are present, across56runtime/peer
identities. The one corrected license finding is precisely
`runtime-legal-evidence-missing: client-only@0.0.1`.

The isolated generation/frozen-install/physical-graph commands all exited0 on
Node24.21/pnpm10.29.3. Their exact logs/hashes were verified independently, along
with source/generated/installed lock SHA256
`47a2996196952e921331ad6ba8acafdb5bf57ca8dff52554b05ac07c87392086`.
Full lock review retains585packages/589snapshots,86platform/109optional records,
53peer contexts,507physical instances/503identities and zero override/patch,
importer/integrity/retired/physical-platform discrepancies. These are actual
Darwinarm64 observations; cross-platform runtime support remains a separate scope.

[fresh-receipt-review.json](fresh-receipt-review.json) records the independent byte
review and exact source/report identities. Lead14's executed report/results and
manifest remain authoritative for execution scope and window cleanup. No install,
build, pack or broad suite was repeated by this worker.

## Meaningful process check for the corrected checker

`cli-e2e.test.py` now verifies pnpm's observed packed-manifest normalization through
the actual integrated CLI process. Omitting the exact development packageManager
field and changing JSON key order passes; changed dependency versions, export
targets and unexpected consumer metadata still return findings/exit1. Raw source/
packed hashes and the permitted transformation remain visible. The entire4case
process harness passes, including retained child exit7/CLI exit2 and tampered-log
rejection. Fixtures are synthetic; they are not a real repository installation.
No further checker source fix was needed because lead14's fix already handles it.

## Remaining boundaries

L08 now has explicit author/maintainer role ownership and repeatable actual reports;
a personal named appointment was an unnecessary extra hold in the original13
interpretation. R07 now has real package-manager evidence. Z08 now has a fresh
all-member archive/transitive technical audit. Do not block those satisfied
criteria on missing client-only legal text or unrelated consumer/CI/device tests.

L01/L04/Z06 retain actual missing legal-text/final distribution obligations.
L02 retains copied/adapted Apache and modified-file notice provenance review,
which is independent of client-only's MIT metadata. W20 retains actual source/asset
attribution proof while its trust boundaries are implemented. No legal approval,
copy absence, rights transfer or human release decision is inferred.

Root should use this supplemental pointer when reconciling the original13 reports;
no already accepted19/26 closure is reopened or counted twice.
'''
(own / 'fresh-reconciliation.md').write_text(text)
names = ['assignment.json', 'report.md', 'results.json', 'fresh-reconciliation.json', 'fresh-reconciliation.md', 'fresh-receipt-review.json', 'review-fresh-receipts.py', 'write-fresh-reconciliation.py', 'cli-e2e.test.py', 'cli-e2e-fresh-candidate-results.txt']
manifest = {name: hashlib.sha256((own / name).read_bytes()).hexdigest() for name in names}
(own / 'fresh-reconciliation-manifest.json').write_text(json.dumps(manifest, indent=2) + '\n')
print(json.dumps({'newOriginal13CompleteRecommendations': result['newCompleteRecommendationsForOriginal13Scope'], 'remainingPartial': result['remainingOriginal13Partial'], 'sharedCountEdits': 0}))
