import importlib.util
import io
import json
from pathlib import Path
import tarfile
import tempfile
import unittest

OWN = Path(__file__).resolve().parent
spec = importlib.util.spec_from_file_location('audit', OWN / 'proposed-files/packages/ui/scripts/check-packed-license-evidence.py')
module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(module)


class EvidenceTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory(dir=OWN)
        self.addCleanup(self.temp.cleanup)
        self.root = Path(self.temp.name)
        self.package = self.root / 'packages/ui'
        self.package.mkdir(parents=True)
        self.files = {'LICENSE': b'Commercial terms unchanged', 'THIRD_PARTY_NOTICES.md': b'whole upstream license\ncopyright owner', 'README.md': b'consumer guide', 'package.json': b'{}', 'dist/index.js': b'export {};'}
        for name, data in self.files.items():
            path = self.package / name
            path.parent.mkdir(parents=True, exist_ok=True)
            path.write_bytes(data)
            if name in ['LICENSE', 'THIRD_PARTY_NOTICES.md']:
                (self.root / name).write_bytes(data)
        (self.root / 'node_modules/.pnpm').mkdir(parents=True)
        for path in ['pnpm-lock.yaml', 'node_modules/.pnpm/lock.yaml']:
            (self.root / path).write_bytes(b'lock')
        dep = self.root / 'node_modules/dep'
        dep.mkdir()
        (dep / 'package.json').write_bytes(b'{"license":"MIT"}')
        (dep / 'LICENSE').write_bytes(self.files['THIRD_PARTY_NOTICES.md'])
        self.inventory = {'inputs': {'manifestSha256': module.sha(b'{}'), 'lockSha256': module.sha(b'lock'), 'installedLockSha256': module.sha(b'lock')}, 'packages': [{'id': 'dep@1.0.0', 'scopes': ['runtime'], 'metadata': [{'path': '../../node_modules/dep/package.json', 'sha256': module.sha((dep / 'package.json').read_bytes()), 'evidence': [{'path': '../../node_modules/dep/LICENSE', 'sha256': module.sha((dep / 'LICENSE').read_bytes())}]}]}]}
        self.archive = self.root / 'candidate.tgz'
        self.inventory_path = self.root / 'inventory.json'

    def run_audit(self, extra=None):
        self.inventory_path.write_text(json.dumps(self.inventory))
        with tarfile.open(self.archive, 'w:gz') as tar:
            for name, data in list(self.files.items()) + (extra or []):
                entry = tarfile.TarInfo('package/' + name)
                entry.size = len(data)
                tar.addfile(entry, io.BytesIO(data))
        return module.audit(self.root, self.archive, self.inventory_path)

    def test_join_and_read_only(self):
        before = {p: p.read_bytes() for p in self.root.rglob('*') if p.is_file()}
        result = self.run_audit()
        self.assertTrue(result['byteChecksPass'])
        self.assertFalse(result['legalApproval'])
        for p, data in before.items():
            self.assertEqual(data, p.read_bytes())
        self.assertTrue(result['runtimePeerClosure'][0]['legalEvidence'][0]['wholeNormalizedTextInPackedNotices'])

    def test_stale_lock_and_truncated_legal_fail(self):
        self.inventory['inputs']['lockSha256'] = 'stale'
        self.files['THIRD_PARTY_NOTICES.md'] = b'whole upstream license'
        codes = {x['code'] for x in self.run_audit()['findings']}
        self.assertTrue({'stale-inventory-input', 'packed-source-mismatch', 'legal-text-not-in-packed-notices'} <= codes)

    def test_runtime_missing_and_dist_drift_fail(self):
        self.inventory['packages'][0]['metadata'][0]['evidence'] = []
        self.files['dist/index.js'] = b'old'
        codes = {x['code'] for x in self.run_audit()['findings']}
        self.assertTrue({'runtime-legal-evidence-missing', 'packed-dist-current-drift'} <= codes)

    def test_reject_unsafe_duplicate_and_evidence_escape(self):
        for extra in [[('../escape', b'x')], [('LICENSE', b'duplicate')]]:
            with self.assertRaises(ValueError):
                self.run_audit(extra)
        self.inventory['packages'][0]['metadata'][0]['path'] = '../../../../outside'
        with self.assertRaises(ValueError):
            self.run_audit()


if __name__ == '__main__':
    unittest.main()
