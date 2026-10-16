from pathlib import Path
import json, hashlib, subprocess, datetime, difflib
own=Path(__file__).resolve().parent
root=own.parents[3]
def digest(p):
 return hashlib.sha256(p.read_bytes()).hexdigest() if p.is_file() else None
prior=json.loads((root/'docs/developer/final-acceptance/wave-02-01/evidence.json').read_text())
coordinator=json.loads((root/'docs/developer/final-acceptance/coordinator-integration/evidence.json').read_text())
modal=prior['components']['AppModal']
paths=set(modal['runtimeClosure']+modal['unitTests']+modal['nativeSpecs']+modal['fixtures'])
for folder in ['packages/ui/src/experimental/Popover','packages/ui/src/experimental/Menu','packages/ui/src/experimental/Tooltip']:
 paths.update(str(p.relative_to(root)) for p in (root/folder).iterdir() if p.is_file())
paths.update(['AGENTS.md','README.md','docs/migration.md','docs/developer/component-architecture.md','docs/developer/react-aria-final-acceptance.md','docs/developer/react-aria-proof-controls.md','docs/developer/react-aria-modal-shells.md','packages/ui/tests/browser/popover-native-collision.spec.ts','packages/ui/tests/browser/inventory-modal-boundaries.spec.ts','apps/docs/tests/scrollbar-layout.spec.ts','apps/docs/examples/DialogPlayground.tsx','apps/docs/native-fixtures/generate-registry.mjs','packages/ui/src/foundation/Scrollbars.module.css','packages/ui/src/foundation/tokens.json','packages/ui/dist/styles.css','packages/ui/src/components/PageRichTextEditorSection/PageRichTextEditorSection.impl.tsx','/tmp/sgui-calendar-validate.mjs'])
paths.update(modal['targetedBuiltOutputs'])
paths.update('docs/developer/final-acceptance/'+wave+'/'+filename for wave in ['wave-02-01','wave-02-07','wave-02-08','wave-02-09'] for filename in ['report.md','results.json'])
rows=[]
for name in sorted(paths):
 sha=digest(root/name)
 old=prior['files'].get(name,{}).get('sha256') or modal['targetedBuiltOutputs'].get(name,{}).get('sha256')
 integrated=coordinator['inputHashes'].get(name) or coordinator['builtLibraryHashes'].get(name)
 rows.append({'path':name,'sha256':sha,'wave02Sha256':old,'matchesWave02':sha==old if old else None,'coordinatorSha256':integrated,'matchesCoordinator':sha==integrated if integrated else None})
changes=[]
patch=[]
for candidate in sorted((own/'proposed-files').rglob('*')):
 if not candidate.is_file():continue
 name=str(candidate.relative_to(own/'proposed-files'))
 original=root/name
 before=original.read_text() if original.exists() else ''
 after=candidate.read_text()
 patch.extend(difflib.unified_diff(before.splitlines(True),after.splitlines(True),fromfile='a/'+name if original.exists() else '/dev/null',tofile='b/'+name))
 changes.append({'path':name,'baseSha256':digest(original),'candidateSha256':digest(candidate)})
(own/'overlay-successors.patch').write_text(''.join(patch))
unchanged=[r for r in rows if r['path'] in modal['runtimeClosure']+modal['unitTests']+modal['nativeSpecs']+modal['fixtures']]
data={'capturedAt':datetime.datetime.now(datetime.timezone.utc).isoformat(),'head':subprocess.check_output(['git','rev-parse','HEAD'],cwd=root,text=True).strip(),'branch':subprocess.check_output(['git','branch','--show-current'],cwd=root,text=True).strip(),'method':'Read-only scoped SHA-256 comparison; historical receipts retained only for named unchanged inputs, no new runtime acceptance','inputs':rows,'AppModalPriorInputComparison':{'total':len(unchanged),'matched':sum(r['matchesWave02'] is True for r in unchanged),'changed':[r for r in unchanged if r['matchesWave02'] is False]},'patchFiles':changes,'patchSha256':digest(own/'overlay-successors.patch'),'runtime':'Candidate public-type check Node v26.5.0; no supported runtime/browser suite executed'}
(own/'evidence.json').write_text(json.dumps(data,indent=2)+'\n')
print(json.dumps({'AppModalPriorInputComparison':data['AppModalPriorInputComparison'],'patchFiles':changes,'selectedInputs':len(rows)},indent=2))
