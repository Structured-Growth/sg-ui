import importlib.util,unittest,tarfile,io,tempfile
from pathlib import Path
spec=importlib.util.spec_from_file_location('audit_packed',Path(__file__).with_name('audit-packed.py'));m=importlib.util.module_from_spec(spec);spec.loader.exec_module(m)
class PackedAuditTests(unittest.TestCase):
 def run_archive(self,extra):
  with tempfile.TemporaryDirectory(dir=Path(__file__).parent) as tmp:
   p=Path(tmp)/'synthetic.tgz'
   with tarfile.open(p,'w:gz') as t:
    files={'package/package.json':b'{"dependencies":{"react-aria":"1"}}','package/LICENSE':b'Emotion attribution retained','package/THIRD_PARTY_NOTICES.md':b'@mui/material attribution retained','package/README.md':b'owned library',**extra}
    for name,data in files.items():
     i=tarfile.TarInfo(name);i.size=len(data);t.addfile(i,io.BytesIO(data))
   return m.audit(p)
 def test_legal_preserved_and_all_asset_kinds_scanned(self):
  result=self.run_archive({'package/dist/a.js.map':b'{"sourcesContent":["@mui/material"]}','package/dist/picture.bin':b'\0Emotion\0'})
  self.assertEqual(len(result['errors']),2);self.assertTrue(all('legal' not in x for x in result['errors']));self.assertFalse(result['legalApproval'])
 def test_clean_archive_has_durable_hashes(self):
  r=self.run_archive({'package/dist/a.js':b'export const x=1','package/dist/tokens.json':b'{"scaleMotionDuration":1}'})
  self.assertTrue(r['technicalReferenceAuditPass']);self.assertEqual(len(r['archiveSha256']),64);self.assertEqual(len(r['files']),6)
 def test_path_traversal_and_old_package_rejected(self):
  r=self.run_archive({'../escape':b'x','package/package.json':b'{"dependencies":{"@mui/material":"7"}}'})
  self.assertTrue(any('unsafe' in e for e in r['errors']));self.assertTrue(any('retired-package' in e for e in r['errors']))
unittest.main()
