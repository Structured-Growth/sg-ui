from pathlib import Path
import json,hashlib,subprocess,datetime,difflib
root=Path.cwd(); own=root/'docs/developer/final-acceptance/wave-04/12'
def digest(p):return hashlib.sha256(p.read_bytes()).hexdigest()
assignment=json.loads((own/'assignment.json').read_text());ids=assignment['ids']
reconpath=Path('docs/developer/final-acceptance/wave-03-integration/reconciliation.json');recon=json.loads(reconpath.read_text())
entries=[e for e in recon['entries'] if e['id'] in ids]
evidence={'capturedAt':datetime.datetime.now(datetime.timezone.utc).isoformat(),'head':subprocess.check_output(['git','rev-parse','HEAD'],text=True).strip(),'baselineMatches':subprocess.check_output(['git','rev-parse','HEAD'],text=True).strip()=='6c485ed79d0d6a521d188e5bde8315722296f518','priorLeaves':entries,'priorReportHashChecks':[],'references':{},'sourceComparison':{},'rawNativeCases':[],'rawReceiptChecks':[]}
refs=['AGENTS.md','docs/developer/react-aria-hardening-execution.md','docs/developer/react-aria-final-acceptance.md','docs/developer/react-aria-hardening-tasks.md',str(reconpath),'docs/developer/final-acceptance/wave-03-followup/validation-results.json','docs/developer/final-acceptance/wave-03-followup/validated-source-inputs.json','docs/developer/final-acceptance/editor-chrome-presentation/results.json','docs/developer/final-acceptance/rich-editor-presentation/results.json','docs/developer/final-acceptance/apple-simulator/results.json','docs/developer/final-acceptance/wave-03-11/lifecycle-matrix.json','docs/developer/final-acceptance/wave-03-19/matrix-delta.md','docs/developer/final-acceptance/wave-03-29/changed-behavior-coverage.md','docs/developer/final-acceptance/wave-03-30/visual-matrix.json','docs/developer/final-acceptance/wave-03-32/README.md','docs/developer/final-acceptance/wave-03-32/run-matrix.mjs']
for e in entries:
 for kind in ['report','results']:
  p=Path(e[kind]);actual=digest(p);expected=e[kind+'Sha256'];evidence['priorReportHashChecks'].append({'path':str(p),'actual':actual,'expected':expected,'match':actual==expected});refs.append(str(p))
for n in sorted(set(e['owner'] for e in entries)):
 p=Path(f'docs/developer/final-acceptance/wave-03-{n:02}/validation-plan.json')
 if p.exists():refs.append(str(p))
follow=json.loads(Path(refs[5]).read_text()); prior=json.loads(Path(refs[6]).read_text())
for p,h in prior.items():
 current=Path(p)
 evidence['sourceComparison'][p]={'prior':h,'current':digest(current) if current.exists() else None,'match':current.exists() and digest(current)==h}
for p,record in follow['browserRuns'].items():
 q=Path(p);actual=digest(q) if q.exists() else None
 evidence['rawReceiptChecks'].append({'path':p,'expected':record['sha256'],'actual':actual,'match':actual==record['sha256']})
 if not q.exists():continue
 refs.append(p);x=json.loads(q.read_text())
 def visit(s):
  for spec in s.get('specs',[]):
   if any(v in spec.get('file','') for v in ['wave03-selector-contracts','wave03-overlay-successors','wave03-system-indications','grid-native-entry','wave03-grid-successors','wave03-18-primitives','visual-acceptance','batch52']):
    for t in spec['tests']:evidence['rawNativeCases'].append({'receipt':p,'file':spec['file'],'title':spec['title'],'project':t.get('projectName'),'status':t.get('status'),'results':[{'status':r.get('status'),'retry':r.get('retry')} for r in t.get('results',[])]})
  for child in s.get('suites',[]):visit(child)
 visit(x)
patch=[];targets=[]
for p in sorted((own/'proposed-files').rglob('*')):
 if not p.is_file():continue
 rel=p.relative_to(own/'proposed-files');current=root/rel;old=current.read_text() if current.exists() else ''
 targets.append({'path':str(rel),'baseSha256':digest(current) if current.exists() else None,'proposedSha256':digest(p)})
 patch.extend(difflib.unified_diff(old.splitlines(keepends=True),p.read_text().splitlines(keepends=True),fromfile='a/'+str(rel) if current.exists() else '/dev/null',tofile='b/'+str(rel)))
 for target in [str(rel)]:
  if current.exists():refs.append(target)
# Relevant assertions are linked even when not in the patch.
refs+=['apps/docs/native-fixtures/scenarios/components/AppShell/AppShell.fixture.tsx','apps/docs/native-fixtures/scenarios/components/AppModal/AppModal.fixture.tsx','packages/ui/tests/browser/wave03-grid-successors.spec.ts','packages/ui/tests/browser/wave03-18-primitives.spec.ts','packages/ui/tests/browser/wave03-selector-contracts.spec.ts','packages/ui/tests/browser/wave03-overlay-successors.spec.ts','packages/ui/tests/browser/wave03-system-indications.spec.ts','packages/ui/tests/browser/batch52-dialog-removed-opener.spec.ts','packages/ui/tests/browser/inventory-selection-boundary.spec.ts','packages/ui/tests/browser/batch01-grid-reorder.spec.ts','packages/ui/src/components/FloatingTextSelectionToolbar/FloatingTextSelectionToolbar.test.tsx','packages/ui/src/experimental/Provider/Provider.live-portal.test.tsx','packages/ui/src/experimental/Provider/Provider.composed-ssr.test.tsx','packages/ui/src/foundation/ThemeScope.strict-cleanup.test.tsx','packages/ui/scripts/scope-hydration-proof.jsx','apps/docs/native-fixtures/scenarios/foundation/VisualAcceptance.fixture.tsx','packages/ui/tests/browser/visual-acceptance.spec.ts']
for p in sorted(set(refs)):
 q=Path(p);evidence['references'][p]={'sha256':digest(q) if q.exists() else None,'exists':q.exists()}
(own/'review-and-hydration.patch').write_text(''.join(patch));(own/'patch-inputs.json').write_text(json.dumps(targets,indent=2)+'\n');(own/'evidence.json').write_text(json.dumps(evidence,indent=2)+'\n')
print(json.dumps({'baselineMatches':evidence['baselineMatches'],'priorReportHashChecks':len(evidence['priorReportHashChecks']),'priorMatches':sum(e['match'] for e in evidence['priorReportHashChecks']),'priorSourceMatching':sum(e['match'] for e in evidence['sourceComparison'].values()),'priorSourceCompared':len(prior),'rawReceiptChecks':evidence['rawReceiptChecks'],'patchTargets':len(targets)},indent=2))
