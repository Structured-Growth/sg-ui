"""Read-only independent receipt-byte review. Writes only this assignment report."""
from pathlib import Path
import hashlib
import json
import tarfile

ROOT = Path.cwd()
OWN = ROOT / 'docs/developer/final-acceptance/wave-04/13'
LEAD = ROOT / 'docs/developer/final-acceptance/wave-04/14/batch-execution'

def sha(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()

def read(path):
    return json.loads(path.read_bytes())

findings = []
def require(value, subject):
    if not value:
        findings.append(subject)

manifest = read(LEAD / 'manifest.json')
manifest_rows = []
for name, expected in manifest.items():
    path = ROOT / name
    observed = sha(path) if path.is_file() else None
    manifest_rows.append({'file': name, 'expectedSha256': expected, 'observedSha256': observed, 'equal': observed == expected})
# Record current source drift separately; it cannot rewrite the historical receipt.
# Artifact/report mismatch is material for this retained exact-byte review.
for row in manifest_rows:
    if not row['equal'] and (row['file'].startswith('packages/ui/artifacts/') or row['file'].startswith('docs/developer/final-acceptance/wave-04/14/batch-execution/')):
        require(False, 'retained-evidence-manifest-drift:' + row['file'])

candidate = ROOT / 'packages/ui/artifacts/wave04-package-candidate'
audit = read(candidate / 'packed-audit.json')
archive = candidate / audit['archive']
require(sha(archive) == audit['archiveSha256'], 'archive-digest')
expected = {'package/' + row['path']: row for row in audit['files']}
archive_rows = []
with tarfile.open(archive, 'r:gz') as tar:
    for member in tar:
        if not member.isfile():
            require(member.isdir(), 'nonregular-archive-member:' + member.name)
            continue
        data = tar.extractfile(member).read()
        digest = hashlib.sha256(data).hexdigest()
        row = expected.get(member.name)
        require(row is not None and row['sha256'] == digest and row['bytes'] == len(data), 'archive-member:' + member.name)
        archive_rows.append({'member': member.name, 'sha256': digest})
require(len(archive_rows) == len(expected) == 1857, 'archive-member-count')
require(len({row['member'] for row in archive_rows}) == len(archive_rows), 'duplicate-archive-member')

joined = LEAD / 'candidate-join-corrected'
receipt = read(joined / 'receipt.json')
require(receipt['archiveSha256'] == audit['archiveSha256'], 'join-archive-digest')
require(receipt['candidateAuditSha256'] == sha(candidate / 'packed-audit.json'), 'join-packed-audit-digest')
require(receipt['sourcesStable'] and receipt['sourcesBefore'] == receipt['sourcesAfter'], 'join-source-stability')
for command in receipt['stages']:
    for stream in ['stdout', 'stderr']:
        require(sha(joined / (command['label'] + '.' + stream)) == command[stream + 'Sha256'], 'join-log:' + command['label'] + ':' + stream)
license_join = read(joined / 'license-join.stdout')
references = read(joined / 'references.stdout')
require(license_join['archiveSha256'] == audit['archiveSha256'], 'license-archive-identity')
require(license_join['findings'] == [{'code': 'runtime-legal-evidence-missing', 'subject': 'client-only@0.0.1'}], 'unexpected-license-finding')
require(references['technicalReferenceAuditPass'] and not references['errors'], 'technical-retired-reference-audit')
require(license_join['manifestComparison']['consumerMetadataEqual'], 'consumer-manifest-comparison')
require(all(e['wholeNormalizedTextInPackedNotices'] for p in license_join['runtimePeerClosure'] for e in p['legalEvidence']), 'available-legal-text-preservation')

snapshot = ROOT / 'packages/ui/artifacts/wave04-lock-snapshot'
lock = read(snapshot / 'receipt.json')
expected_lock = '47a2996196952e921331ad6ba8acafdb5bf57ca8dff52554b05ac07c87392086'
require(lock['captureComplete'] and lock['sourceInputsStable'] and lock['generationUnchanged'], 'lock-execution-completeness')
require([c['label'] for c in lock['commands']] == ['node-version', 'pnpm-version', 'generate', 'frozen-install', 'physical-graph'], 'lock-command-order')
for command in lock['commands']:
    require(command['exitCode'] == 0, 'lock-command-exit:' + command['label'])
    for stream in ['stdout', 'stderr']:
        require(sha(snapshot / (command['label'] + '.' + stream)) == command[stream + 'Sha256'], 'lock-log:' + command['label'] + ':' + stream)
for path in [ROOT / 'pnpm-lock.yaml', snapshot / 'generated-lock.yaml', snapshot / 'installed-lock.yaml']:
    require(sha(path) == expected_lock, 'source-generated-installed-lock:' + path.name)
for name, expected_sha in lock['inputs'].items():
    require(sha(snapshot / 'workspace' / name) == expected_sha, 'snapshot-input:' + name)
review = read(LEAD / 'actual-lock-review.json')
require(review['technicalLockReviewPass'], 'full-lock-review')
client = read(LEAD / 'client-only-exact-version-evidence.json')
require(not client['legalFileShipped'] and not client['legalApproval'], 'client-only-hold-preserved')

refs = ['report.md', 'results.json', 'actual-lock-review.json', 'actual-lock-summary.json', 'client-only-exact-version-evidence.json', 'candidate-join-corrected/receipt.json', 'candidate-join-corrected/license-join.stdout', 'candidate-join-corrected/references.stdout', 'manifest.json']
report = {'technicalReceiptReviewPass': not findings, 'findings': findings, 'archiveSha256': audit['archiveSha256'], 'archiveMembersVerified': len(archive_rows), 'runtimePeerIdentities': len(license_join['runtimePeerClosure']), 'wholeLegalTextsVerified': sum(len(p['legalEvidence']) for p in license_join['runtimePeerClosure']), 'licenseFindings': license_join['findings'], 'sourceGeneratedInstalledLockSha256': expected_lock, 'manifestComparison': manifest_rows, 'leadReceiptHashes': {name: sha(LEAD / name) for name in refs}, 'recommendCompleteOriginalAssignedIDs': ['A-L-08', 'A-R-07', 'A-Z-08'], 'retainPartialOriginalAssignedIDs': ['A-L-01', 'A-L-02', 'A-L-04', 'A-W-20', 'A-Z-06'], 'priorDocumentaryRecommendationPreserved': 'A-L-09', 'limits': ['Independent byte review of retained local operator receipts, not remote attestation or a new build/install.', 'Client-only legal evidence gap is preserved separately from passing technical criteria.', 'No legal/commercial/release/human approval and no shared acceptance-count edits.']}
(OWN / 'fresh-receipt-review.json').write_text(json.dumps(report, indent=2) + '\n')
print(json.dumps({key: report[key] for key in ['technicalReceiptReviewPass', 'findings', 'archiveSha256', 'archiveMembersVerified', 'wholeLegalTextsVerified', 'recommendCompleteOriginalAssignedIDs']}))
raise SystemExit(bool(findings))
