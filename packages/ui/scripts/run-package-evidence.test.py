import hashlib
import importlib.util
import json
import os
from pathlib import Path
import sys
import tempfile
import unittest
sys.dont_write_bytecode = True
spec = importlib.util.spec_from_file_location('batch', Path(__file__).with_name('run-package-evidence.py'))
m = importlib.util.module_from_spec(spec)
spec.loader.exec_module(m)


class BatchTests(unittest.TestCase):
    def setUp(self):
        temp = tempfile.TemporaryDirectory(dir=os.environ.get('SGUI_CI_EVIDENCE_SCRATCH'))
        self.addCleanup(temp.cleanup)
        self.root = Path(temp.name).resolve()
        self.repo, self.candidate, self.out = [self.root / name for name in ['repo', 'candidate', 'out']]
        self.repo.mkdir()
        self.candidate.mkdir()
        (self.candidate / 'package.tgz').write_bytes(b'synthetic archive')
        self.digest = m.sha(b'synthetic archive')
        (self.candidate / 'packed-audit.json').write_text(json.dumps({'technicalPackageAudit': 'passed', 'runtime': 'v24.21.0', 'archive': 'package.tgz', 'archiveSha256': self.digest}))
        self.calls = []
        self.findings = []
        self.fail = False
        self.drift = False
        self.snapshots = 0

    def fake(self, command, cwd, env):
        self.calls.append(command)
        self.assertEqual(cwd, self.repo)
        if command[-1] == '--version':
            return 0, b'v24.21.0\n', b''
        if command[1].endswith('check-license-inventory.mjs'):
            return 1, b'{"issues":["retained optional finding"]}', b''
        if command[1].endswith('check-packed-license-evidence.py'):
            if self.fail:
                return 2, b'{"inputError":"bad evidence"}', b''
            return int(bool(self.findings)), json.dumps({'findings': self.findings, 'archiveSha256': self.digest, 'byteChecksPass': not self.findings, 'runtimePeerClosure': [{}]}).encode(), b''
        if command[1].endswith('check-packed-retired-references.py'):
            return 0, json.dumps({'archiveSha256': self.digest, 'technicalReferenceAuditPass': True, 'errors': [], 'files': [{}]}).encode(), b''
        raise AssertionError(command)

    def snapshot(self, repository):
        self.snapshots += 1
        return {'source': 'changed' if self.drift and self.snapshots > 1 else 'stable'}

    def execute(self):
        return m.run_batch(self.repo, self.candidate, self.out, '/fake/node', self.fake, self.snapshot)

    def test_full_read_only_join_records_all_commands_and_archive_identity(self):
        result = self.execute()
        self.assertTrue(result['automatedChecksPass'])
        self.assertEqual(len(result['stages']), 4)
        self.assertFalse(result['legalApproval'])
        self.assertFalse(result['releaseApproval'])
        self.assertEqual(result['summary']['inventoryFindings'], 1)
        self.assertTrue(result['summary']['archiveIdentityMatches'])

    def test_license_findings_remain_findings_without_hiding_reference_results(self):
        self.findings = [{'code': 'runtime-legal-evidence-missing', 'subject': 'fixture'}]
        result = self.execute()
        self.assertFalse(result['automatedChecksPass'])
        self.assertEqual(result['summary']['licenseFindings'], self.findings)
        self.assertTrue(result['summary']['technicalReferenceAuditPass'])

    def test_bad_candidate_never_runs_child_commands(self):
        (self.candidate / 'package.tgz').write_bytes(b'changed')
        with self.assertRaisesRegex(ValueError, 'digest'):
            self.execute()
        self.assertEqual(self.calls, [])
        self.assertFalse(self.out.exists())

    def test_invalid_stage_and_source_drift_retain_failure_checkpoint(self):
        self.fail = True
        with self.assertRaisesRegex(ValueError, 'Execution/input'):
            self.execute()
        self.assertTrue((self.out / 'receipt.json').exists())
        self.assertEqual(len(self.calls), 3)

    def test_source_drift_is_not_accepted_as_current_candidate(self):
        self.drift = True
        with self.assertRaisesRegex(ValueError, 'inputs changed'):
            self.execute()
        self.assertFalse(json.loads((self.out / 'receipt.json').read_text())['sourcesStable'])


if __name__ == '__main__':
    unittest.main()
