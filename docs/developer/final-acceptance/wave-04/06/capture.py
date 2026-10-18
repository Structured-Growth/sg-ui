import json,hashlib,subprocess
from pathlib import Path
R=Path(__file__).resolve().parents[5]; O=Path(__file__).resolve().parent
assert R.name=='sg-ui',str(R)
def sha(p): return hashlib.sha256(p.read_bytes()).hexdigest()
def load(p): return json.loads((R/p).read_text())
old=load('docs/developer/final-acceptance/wave-03-integration/final-build-inputs.json')
new=load('docs/developer/final-acceptance/wave-03-followup/validated-source-inputs.json')
animated=load('docs/developer/final-acceptance/animated-tab-indicators/results.json')['sourceSha256']
hb=load('docs/developer/final-acceptance/rich-editor-presentation/results.json')['sourceSha256']
raw='packages/ui/artifacts/wave03-integration/followup-final-results.json'
specs=['action-notifications.spec.ts','navigation-composed.spec.ts','wave03-overlay-successors.spec.ts','wave03-selector-contracts.spec.ts','wave03-18-primitives.spec.ts']
cases=[]
def walk(ss):
 for s in ss:
  for sp in s.get('specs',[]):
   if sp.get('file') in specs:
    for t in sp['tests']:
     cases.append({'file':sp['file'],'title':sp['title'],'project':t['projectName'],'status':t['status'],'results':[{'status':v['status'],'errors':v.get('errors',[])} for v in t['results']]})
  walk(s.get('suites',[]))
walk(load(raw)['suites'])
assert len(cases)==63,len(cases)
assert all(c['status']=='expected' and all(r['status']=='passed' for r in c['results']) for c in cases)
inputs={}
dirs=['experimental/'+x for x in ['Tabs','Dialog','Menu','Popover','Tooltip','Link','Button','ToggleButton']]+['components/'+x for x in ['AppModal','ExperiencePageNavigator','Button','IconButton','AppPageTabs','SideNavigation','DataGridDragHandle']]+['adapters','foundation']
for d in dirs:
 for p in (R/'packages/ui/src'/d).rglob('*'):
  if p.is_file():
   name=str(p.relative_to(R)); current=sha(p)
   saved=hb.get(name,animated.get(name,new.get(name,old.get(name))))
   inputs[name]={'sha256':current,'savedSha256':saved,'match':current==saved if saved else None,'savedReceipt':'HB20' if name in hb else 'animated-tab-indicators (later HB20 rerun)' if name in animated else 'wave03-followup' if name in new else 'wave03-integration' if name in old else None}
receipts=['docs/developer/final-acceptance/animated-tab-indicators/results.json',raw,'docs/developer/final-acceptance/wave-03-integration/final-build-inputs.json','docs/developer/final-acceptance/wave-03-followup/validated-source-inputs.json','docs/developer/final-acceptance/wave-03-followup/validation-results.json','docs/developer/final-acceptance/rich-editor-presentation/results.json','docs/developer/final-acceptance/rich-editor-presentation/tabs-regressions.log','docs/developer/final-acceptance/editor-chrome-presentation/results.json','docs/developer/react-aria-final-acceptance.md','docs/developer/react-aria-hardening-execution.md','docs/developer/backlog-execution-2026-10-15.md','docs/developer/react-aria-button.md','docs/developer/react-aria-modal-shells.md','docs/developer/react-aria-page-navigation.md','docs/developer/hierarchical-menu-scope.md','docs/developer/react-aria-host-adapter-acceptance.md']
for n in ['04','14','16','18','19']:
 receipts += [f'docs/developer/final-acceptance/wave-03-{n}/report.md',f'docs/developer/final-acceptance/wave-03-{n}/results.json']
for s in specs: receipts.append('packages/ui/tests/browser/'+s)
receipts+=['apps/docs/tests/tabs-overflow.spec.ts','apps/docs/tests/tab-indicator.spec.ts','packages/ui/tests/apple/SimulatorAcceptance.swift','packages/ui/tests/apple/run-simulator.mjs','docs/developer/final-acceptance/wave-02-01/report.md','docs/developer/final-acceptance/wave-02-08/report.md','docs/developer/final-acceptance/wave-02-09/report.md']
result={'head':subprocess.check_output(['git','rev-parse','HEAD'],cwd=R,text=True).strip(),'assignedBaseline':'6c485ed79d0d6a521d188e5bde8315722296f518','method':'Read-only SHA256 and JSON extraction. No new runtime/browser evidence. Scoped input inventory is not a complete transitive dependency or built-output equality claim.','receiptHashes':{p:sha(R/p) for p in receipts},'nativeCases':cases,'inputComparison':inputs,'comparisonSummary':{'match':sum(v['match'] is True for v in inputs.values()),'changed':sum(v['match'] is False for v in inputs.values()),'notInSavedMap':sum(v['match'] is None for v in inputs.values())}}
(O/'evidence.json').write_text(json.dumps(result,indent=2)+'\n')
print(json.dumps({'cases':len(cases),'comparison':result['comparisonSummary'],'head':result['head']}))
