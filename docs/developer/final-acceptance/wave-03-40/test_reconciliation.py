import json, unittest
from pathlib import Path
from gates import migration_complete
D=Path(__file__).resolve().parent
class ReconciliationTests(unittest.TestCase):
 def test_exact_open_requirement_ownership(self):
  x=json.loads((D/'ownership-map.json').read_text())
  ids=[i for a in x['assignments'] for i in a['ids']]
  self.assertEqual(len(ids),153); self.assertEqual(len(set(ids)),153)
  self.assertEqual(set(ids),{r['id'] for r in x['requiredA']})
  self.assertEqual(len(x['requiredEditorV']),20); self.assertEqual(len(x['future']),6)
 def test_every_missing_gate_preserves_open_completion(self):
  ready=dict(required_a={'A-example':'complete'},required_editor_v={'V-example':'complete'},
   commitment_review_complete=True, dependency_feature_pr_record_complete=True,
   production_evidence_complete=True,legal_owner_gates_complete=True,human_release_approval=True)
  self.assertTrue(migration_complete(**ready))
  for gate in list(ready)[2:]:
   with self.subTest(gate=gate): self.assertFalse(migration_complete(**(ready|{gate:False})))
  for gate in ['required_a','required_editor_v']:
   for missing in [{},{'required':'partial'},{'required':'blocked'},{'required':'proposed-patch'}]:
    with self.subTest(gate=gate,missing=missing): self.assertFalse(migration_complete(**(ready|{gate:missing})))
 def test_current_evidence_cannot_mark_complete(self):
  x=json.loads((D/'ownership-map.json').read_text())
  self.assertFalse(migration_complete(required_a={r['id']:'open' for r in x['requiredA']},
   required_editor_v={r['id']:'open' for r in x['requiredEditorV']},commitment_review_complete=False,
   dependency_feature_pr_record_complete=False,production_evidence_complete=False,
   legal_owner_gates_complete=False,human_release_approval=False))
if __name__=='__main__': unittest.main()
