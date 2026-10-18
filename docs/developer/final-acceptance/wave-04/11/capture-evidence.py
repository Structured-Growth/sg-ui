import hashlib,json,subprocess,difflib
from pathlib import Path
from datetime import datetime, timezone
root=Path.cwd(); out=root/'docs/developer/final-acceptance/wave-04/11'
def sha(p):return hashlib.sha256(p.read_bytes()).hexdigest()
refs=['AGENTS.md','README.md','docs/migration.md','docs/developer/component-architecture.md','docs/developer/react-aria-final-acceptance.md','docs/developer/react-aria-hardening-execution.md','docs/developer/final-acceptance/wave-03-integration/reconciliation.json','docs/developer/final-acceptance/wave-03-followup/validation-results.json','docs/developer/final-acceptance/wave-03-10/report.md','docs/developer/final-acceptance/wave-03-10/results.json','docs/developer/final-acceptance/wave-03-29/report.md','docs/developer/final-acceptance/wave-03-29/results.json','docs/developer/final-acceptance/wave-03-29/screen-reader-operator.md','docs/developer/final-acceptance/wave-03-30/report.md','docs/developer/final-acceptance/wave-03-30/results.json','docs/developer/final-acceptance/wave-03-30/operator-findings.json','docs/developer/final-acceptance/apple-simulator/results.json','docs/developer/final-acceptance/apple-simulator/repeat-receipt.json','docs/developer/final-acceptance/apple-simulator/repeat-summary.json','docs/developer/final-acceptance/apple-simulator/voiceover-utterances.txt','packages/ui/tests/browser/acceptance-touch-targets.spec.ts','packages/ui/tests/browser/batch01-grid-reorder.spec.ts','apps/docs/native-fixtures/registry.json']
refs += [str(p.relative_to(root)) for p in (root/'packages/ui/tests/apple').rglob('*') if p.is_file()]
for family,name in [('experimental/Dialog','Dialog'),('experimental/Select','Select'),('experimental/Calendar','Calendar'),('experimental/Navigation','Navigation'),('experimental/Table','Table'),('components/PageRichTextEditorSection','PageRichTextEditorSection')]:
 refs += ['apps/docs/native-fixtures/scenarios/'+family+'/'+name+'.fixture.tsx','packages/ui/src/'+family+'/'+name+'.tsx']
refs += ['packages/ui/src/experimental/DataGrid/GridColumnWidthControl.tsx','packages/ui/src/experimental/TagGroup/TagGroup.module.css']
inputs={r:sha(root/r) for r in refs if (root/r).is_file()}
old=json.loads((root/'docs/developer/final-acceptance/apple-simulator/repeat-receipt.json').read_text())
comparison={}
for kind,directory in [('source','packages/ui/tests/apple'),('fixture','packages/ui/browser-docs-static')]:
 rows=[]
 for rel,expected in old[kind].items():
  p=root/directory/rel;actual=sha(p) if p.is_file() else None
  rows.append({'path':str(p.relative_to(root)),'acceptedSha256':expected,'currentSha256':actual,'same':actual==expected})
 comparison[kind]={'same':sum(r['same'] for r in rows),'total':len(rows),'files':rows}
sdk=Path('/Applications/Xcode.app/Contents/Developer/Platforms/iPhoneSimulator.platform/Developer/Library/Frameworks/XCUIAutomation.framework/Headers/XCUIVoiceOverService.h')
record={'capturedAt':datetime.now(timezone.utc).isoformat(),'head':subprocess.check_output(['git','rev-parse','HEAD'],text=True).strip(),'inputsSha256':inputs,'priorAppleComparison':comparison,'sdkHeader':{'path':str(sdk),'sha256':sha(sdk)},'limits':'Sequential selected hashes, not atomic/transitive runtime validation. Prior result remains dated; matching source/host bytes does not create a new simulator run.'}
(out/'input-evidence.json').write_text(json.dumps(record,indent=2)+'\n')
patch=''
for p in sorted((out/'proposed-files').rglob('*')):
 if not p.is_file():continue
 rel=str(p.relative_to(out/'proposed-files'));original=root/rel
 patch+=''.join(difflib.unified_diff(original.read_text().splitlines(True),p.read_text().splitlines(True),fromfile='a/'+rel,tofile='b/'+rel))
(out/'apple-voiceover.patch').write_text(patch)
checks=[]
for name,cmd in [('node-syntax',['node','--check',str(out/'proposed-files/packages/ui/tests/apple/run-simulator.mjs')]),('swift-parse',['swiftc','-frontend','-parse',str(out/'proposed-files/packages/ui/tests/apple/SimulatorAcceptance.swift')]),('patch-check',['git','apply','--check',str(out/'apple-voiceover.patch')])]:
 p=subprocess.run(cmd,text=True,capture_output=True)
 (out/(name+'.txt')).write_text(p.stdout+p.stderr)
 checks.append({'name':name,'command':cmd,'exitCode':p.returncode,'log':name+'.txt'})
(out/'authoring-validation.json').write_text(json.dumps({'checks':checks,'limits':'Swift parse only; no SDK typecheck, build, simulator, native browser or runtime assertions executed.'},indent=2)+'\n')
print(json.dumps({'checks':checks,'comparison':{k:{'same':v['same'],'total':v['total']} for k,v in comparison.items()}}))
