from pathlib import Path
import hashlib,json,datetime,difflib,subprocess
root=Path(__file__).resolve().parents[4]
out=root/'docs/developer/final-acceptance/wave-03-20'
def sha(p): return hashlib.sha256(p.read_bytes()).hexdigest() if p.is_file() else None
prior=json.loads((root/'docs/developer/final-acceptance/wave-02-10/input-reconciliation.json').read_text())
coordinator=json.loads((root/'docs/developer/final-acceptance/coordinator-integration/evidence.json').read_text())
inputs=[]
for item in prior['inputs']:
 p=item['path'];current=sha(root/p)
 inputs.append({'path':p,'sha256':current,'wave02Sha256':item['sha256'],'comparison':'equal' if current==item['sha256'] else 'changed' if current else 'missing'})
extra=['AGENTS.md','docs/developer/react-aria-final-acceptance.md','docs/developer/final-acceptance/wave-03-20/assignment.json','docs/developer/final-acceptance/wave-02-02/report.md','docs/developer/final-acceptance/wave-02-02/results.json','docs/developer/final-acceptance/wave-02-10/report.md','docs/developer/final-acceptance/wave-02-10/results.json','docs/developer/final-acceptance/coordinator-integration/evidence.json','packages/ui/tests/browser/batch01-grid-focus.spec.ts','packages/ui/tests/browser/batch08-grid-retry-focus.spec.ts','packages/ui/tests/browser/grid-server-response-races.spec.ts','apps/docs/native-fixtures/scenarios/components/AppDataGridShell/AppDataGridShell.server-response-races.fixture.tsx']
retained=[]
for key in ['builtLibraryHashes','privateFixtureOutputHashes']:
 records=[{'path':p,'sha256':sha(root/p),'coordinatorSha256':expected} for p,expected in coordinator[key].items()]
 retained.append({'scope':key,'compared':len(records),'equal':sum(x['sha256']==x['coordinatorSha256'] for x in records),'differences':[x for x in records if x['sha256']!=x['coordinatorSha256']]})
patch='';targets=[]
for p in sorted((out/'proposed-files').rglob('*')):
 if not p.is_file(): continue
 rel=p.relative_to(out/'proposed-files').as_posix();current=root/rel
 before=current.read_text() if current.exists() else ''
 patch+=''.join(difflib.unified_diff(before.splitlines(True),p.read_text().splitlines(True),fromfile='a/'+rel if current.exists() else '/dev/null',tofile='b/'+rel))
 targets.append({'path':rel,'originalSha256':sha(current),'proposedSha256':sha(p)})
(out/'grid-successors.patch').write_text(patch)
result={'capturedAt':datetime.datetime.now(datetime.timezone.utc).isoformat(),'head':subprocess.check_output(['git','rev-parse','HEAD'],cwd=root,text=True).strip(),'branch':subprocess.check_output(['git','branch','--show-current'],cwd=root,text=True).strip(),'inputs':inputs,'additionalInputs':[{'path':p,'sha256':sha(root/p)} for p in extra],'retainedOutputComparison':retained,'patchTargets':targets,'limits':['Scoped hash reconciliation; no new grid runtime/browser/AT execution','Unchanged outputs do not contain proposed patch','Historical browser receipts retain their original host/engine limits']}
(out/'input-evidence.json').write_text(json.dumps(result,indent=2)+'\n')
print(json.dumps({'inputs':len(inputs),'changed':[x['path'] for x in inputs if x['comparison']!='equal'],'outputs':[{k:v for k,v in x.items() if k!='differences'} for x in retained],'patchTargets':len(targets)},indent=2))
