from pathlib import Path
import hashlib,json,subprocess,datetime,shutil
root=Path.cwd();own=root/'docs/developer/final-acceptance/wave-03-26'
def sha(p):return hashlib.sha256(p.read_bytes()).hexdigest()
prior=json.loads((root/'docs/developer/final-acceptance/wave-02-03/evidence.json').read_text())
coordinator=json.loads((root/'docs/developer/final-acceptance/coordinator-integration/evidence.json').read_text())
paths=set()
for directory in ['packages/ui/src/components/PageRichTextEditorSection','packages/ui/src/components/ImageUploadModal','packages/ui/src/components/LinkUrlModal']:
 paths.update(p for p in (root/directory).rglob('*') if p.is_file())
for file in ['AGENTS.md','docs/developer/react-aria-final-acceptance.md','docs/developer/react-aria-editor-section.md','docs/developer/react-aria-editor-dialogs.md','packages/ui/tests/browser/editor-image-sources.spec.ts','packages/ui/tests/browser/editor-upload-lifecycle.spec.ts','packages/ui/tests/browser/editor-image-lifecycle.spec.ts','packages/ui/tests/browser/image-upload-validation.spec.ts','packages/ui/scripts/browser-validation-pool.mjs','docs/developer/final-acceptance/wave-02-03/report.md','docs/developer/final-acceptance/wave-02-03/results.json','docs/developer/final-acceptance/wave-02-03/command-and-trust-matrix.md','docs/developer/final-acceptance/coordinator-integration/evidence.json']:
 paths.add(root/file)
inputs={str(p.relative_to(root)):sha(p) for p in sorted(paths)}
comparison={}
for name,data in [('wave02',prior),('coordinator',coordinator)]:
 old=data.get('inputHashes',{})
 comparison[name]={p:{'saved':old[p],'current':h,'unchanged':old[p]==h} for p,h in inputs.items() if p in old}
artifacts={str(p.relative_to(own)):sha(p) for p in sorted(own.rglob('*')) if p.is_file() and '.vite-cache' not in p.parts and p.name != 'evidence.json'}
evidence={'capturedAt':datetime.datetime.now(datetime.timezone.utc).isoformat(),'head':subprocess.check_output(['git','rev-parse','HEAD'],text=True).strip(),'branch':subprocess.check_output(['git','branch','--show-current'],text=True).strip(),'runtime':'Node 24.19.0, Vitest 4.1.11, jsdom; read-only source overlay','inputHashes':inputs,'retainedEvidenceComparisons':comparison,'artifactHashes':artifacts,'patchApplyCheck':'git apply --check docs/developer/final-acceptance/wave-03-26/image-runtime-shapes.patch (exit 0)','execution':{'patchedOverlay':{'files':2,'passed':27,'failed':0,'log':'unit-overlay.txt'},'newTestsAgainstCurrentSource':{'files':2,'passed':25,'failed':2,'expectedFailure':True,'log':'unit-baseline.txt'},'initialHarnessFailure':'unit-overlay-first-failure.txt: resolver omitted ./lexical/ path; corrected only overlay config'},'limits':['No production file changed; proposed patch has not been integrated.','No browser/build/install/typecheck/native/AT/service execution.','Existing accepted receipts retain their original source/host limits.','No host policy or owner approval fabricated.']}
(own/'evidence.json').write_text(json.dumps(evidence,indent=2)+'\n')
print({k:{'compared':len(v),'unchanged':sum(x['unchanged'] for x in v.values()),'changed':[p for p,x in v.items() if not x['unchanged']]} for k,v in comparison.items()})
