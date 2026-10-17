import importlib.util
import io
import os
from pathlib import Path
import sys
import tarfile
import tempfile
import unittest
sys.dont_write_bytecode = True
spec = importlib.util.spec_from_file_location('packed_refs', Path(__file__).with_name('check-packed-retired-references.py'))
m = importlib.util.module_from_spec(spec)
spec.loader.exec_module(m)


class PackedReferenceTests(unittest.TestCase):
    def archive(self, extra=(), link=False):
        temp = tempfile.TemporaryDirectory(dir=os.environ.get('SGUI_CI_EVIDENCE_SCRATCH'))
        self.addCleanup(temp.cleanup)
        path = Path(temp.name) / 'candidate.tgz'
        with tarfile.open(path, 'w:gz') as tar:
            files = {'package/package.json': b'{"dependencies":{"react-aria":"1"}}', 'package/LICENSE': b'Emotion attribution retained', 'package/THIRD_PARTY_NOTICES.md': b'@mui/material historic notice', 'package/README.md': b'Owned library', 'package/dist/index.js': b'export {};', 'package/dist/index.d.ts': b'export {};', 'package/dist/styles.css': b'.owned{}'}
            for name, data in list(files.items()) + list(extra):
                entry = tarfile.TarInfo(name)
                entry.size = len(data)
                tar.addfile(entry, io.BytesIO(data))
            if link:
                entry = tarfile.TarInfo('package/dist/link')
                entry.type = tarfile.SYMTYPE
                entry.linkname = '/tmp/outside'
                tar.addfile(entry)
        return path

    def test_all_member_hashes_and_preserved_legal_hits(self):
        archive = self.archive([('package/dist/tokens.json', b'{"scaleMotionDuration":1}')])
        before = archive.read_bytes()
        result = m.audit(archive)
        self.assertTrue(result['technicalReferenceAuditPass'])
        self.assertEqual(len(result['files']), 8)
        self.assertFalse(result['legalApproval'])
        self.assertEqual(archive.read_bytes(), before)
        self.assertTrue(all(len(row['sha256']) == 64 for row in result['files']))

    def test_maps_binary_and_readme_cannot_hide_retired_references(self):
        result = m.audit(self.archive([('package/dist/source.js.map', b'{"sourcesContent":["@mui/material"]}'), ('package/dist/picture.bin', b'\x00Emotion\x00')]))
        self.assertEqual(len(result['errors']), 2)
        self.assertTrue(all('unclassified-retired-text' in error for error in result['errors']))

    def test_duplicate_traversal_noncanonical_paths_and_links_fail_before_extraction(self):
        for extra in [[('../outside', b'x')], [('package/./dist/a', b'x')], [('package/dist/a\\b', b'x')], [('package/package.json', b'{}')]]:
            with self.assertRaises(ValueError):
                m.audit(self.archive(extra))
        with self.assertRaisesRegex(ValueError, 'Nonregular'):
            m.audit(self.archive(link=True))

    def test_retired_dependencies_and_unexpected_shipping_roots_are_findings(self):
        # Replace only the manifest bytes in a separate archive; duplicate rejection remains intact.
        archive = self.archive([('package/src/private.js', b'owned')])
        result = m.audit(archive)
        self.assertIn('unexpected-shipping-root:package/src/private.js', result['errors'])
        original = m.MAX_TOTAL_BYTES
        try:
            m.MAX_TOTAL_BYTES = 1
            with self.assertRaisesRegex(ValueError, 'size'):
                m.audit(archive)
        finally:
            m.MAX_TOTAL_BYTES = original


if __name__ == '__main__':
    unittest.main()
