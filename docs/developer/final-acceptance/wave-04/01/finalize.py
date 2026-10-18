from pathlib import Path
import json,hashlib,difflib
O=Path(__file__).resolve().parent;R=O.parents[4]
def write(n,v): (O/n).write_text(json.dumps(v,indent=2)+'\n')
def sha(p):return hashlib.sha256(p.read_bytes()).hexdigest()
e=json.loads((O/'evidence.json').read_text());a=json.loads((O/'assignment.json').read_text())
components=['DocumentEditorLayout','DocumentEditorToolbar','ContentEditorChrome','FloatingTextSelectionToolbar']
rows=[]
for i,(id,c) in enumerate(zip(a['ids'],components)):
 n=[21,22,23,25][i];receipt='rich-editor-presentation' if n==25 else 'editor-chrome-presentation'
 paths=[f'packages/ui/src/components/{c}/{c}.tsx',f'packages/ui/src/components/{c}/{c}.module.css',f'packages/ui/src/components/{c}/{c}.test.tsx',f'docs/developer/parallel-next100/next100-c{n}.md',f'docs/developer/final-acceptance/{receipt}/results.json']
 rows.append({'id':id,'originalObligation':a['obligations'][i],'recommendation':'complete','result':'complete','component':c,'phaseEvidence':{'functionality':f'F-C{n}: retained complete; react-aria-progress.md editor-layout-and-floating-selection and wave-02-03/report.md','regression':f'T-C{n}: retained complete; parallel-next100/next100-c{n}.md exact case mapping and later accepted receipts','hardening':f'V-C{n}-04/05: accepted HB-'+('20' if n==25 else '19')+'; other V evidence retained from backlog execution'},'closedSuccessors':[f'W03-C{n}-V'],'sourceAndEvidence':[{'path':p,'sha256':e['inputSha256'][p]} for p in paths],'runtimeEvidence':f'docs/developer/final-acceptance/{receipt}/results.json','runtimeEvidenceReused':True,'newRuntimeExecution':False,'unresolvedDefects':[],'remainingConcreteSuccessors':[],'coordinatorAction':'Review this receipt and apply documentation patch; coordinator alone updates acceptance checklist/counters. No behavior rerun required for documentation-only integration.','proposedChanges':['docs/developer/react-aria-editor-layout.md','docs/developer/react-aria-editor-chrome-acceptance.md'],'limits':['Named component F/T/V reconciliation only; independent device/AT/editor/release gates remain.','All input/evidence hashes and bounded fixture drift disposition are in evidence.json.']})
write('results.json',{'schemaVersion':1,'owner':'wave-04/01','title':a['title'],'baseline':e['baseline'],'head':e['head'],'status':'reviewable-reconciliation-and-documentation-patch','summary':{'complete':4,'partial':0,'blocked':0,'newTests':0,'newRuntimeExecutions':0},'entries':rows,'evidence':'evidence.json','checks':'checks.json','validationPlan':'validation-plan.json','concurrentChange':'HB-20 full working fixture differs only in unrelated ImageSources; accepted localized scenario region and module imports unchanged. See evidence.json and concurrent-fixture.diff.','separateOpenScope':['Actual spoken AT and physical-device interaction','Configured OS IME and physical clipboard','Broader editor command/trust/serialization acceptance','Installed consumer/support matrices','Owner/legal/production authorization'],'futureScope':'Existing six deferred future items remain separate; none added or closed.','sharedChecklistEdited':False,'sharedImplementationEdited':False,'commitOrPushPerformed':False})
patch='';targets=[]
for p in sorted((O/'proposed-files').rglob('*')):
 if not p.is_file():continue
 rel=p.relative_to(O/'proposed-files');base=R/rel
 old=base.read_text() if base.exists() else ''
 patch+=''.join(difflib.unified_diff(old.splitlines(True),p.read_text().splitlines(True),fromfile='a/'+str(rel) if base.exists() else '/dev/null',tofile='b/'+str(rel)))
 targets.append({'path':str(rel),'baseSha256':sha(base) if base.exists() else None,'proposedSha256':sha(p),'kind':'replacement' if base.exists() else 'new'})
(O/'documentation.patch').write_text(patch);write('proposal-targets.json',targets)
