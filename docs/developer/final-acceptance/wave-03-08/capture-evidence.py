from pathlib import Path
import json,hashlib,datetime,subprocess
root=Path(__file__).resolve().parents[4];out=Path(__file__).resolve().parent
def read(p):return json.loads((root/p).read_text())
def sha(p):
 q=root/p
 return hashlib.sha256(q.read_bytes()).hexdigest() if q.exists() else None
assignment=read('docs/developer/final-acceptance/wave-03-08/assignment.json')
prior=read('docs/developer/final-acceptance/wave-02-06/evidence.json')
integration=read('docs/developer/final-acceptance/coordinator-integration/evidence.json')
fixes=read('docs/developer/final-acceptance/coordinator-fixes/evidence.json')
matrix=json.loads((out/'state-matrix.json').read_text())
paths={'AGENTS.md','docs/developer/react-aria-final-acceptance.md','docs/developer/final-acceptance/wave-03-08/assignment.json','docs/developer/final-acceptance/wave-02-06/report.md','docs/developer/final-acceptance/wave-02-06/results.json','docs/developer/final-acceptance/wave-02-06/evidence.json','docs/developer/final-acceptance/wave-02-06/successor-deliverables.md','docs/developer/final-acceptance/coordinator-integration/evidence.json','docs/developer/final-acceptance/coordinator-fixes/evidence.json','packages/ui/src/foundation/tokens.json','packages/ui/scripts/tokens.test.mjs','apps/docs/content/component-api.json','apps/docs/content/component-composition.json','apps/docs/content/catalog.json','apps/docs/content/component-usage/presentation.json','docs/developer/react-aria-layout-actions.md','docs/developer/react-aria-theme.md','apps/docs/examples/ButtonDocumentation.tsx','apps/docs/components/DemoSettings.tsx','apps/docs/components/Example.tsx','packages/ui/dist/styles.css','packages/ui/dist/components/Button/Button.js','packages/ui/dist/experimental/TextArea/TextArea.js'}
for r in matrix['rows']:
 paths.update(r['source']);paths.update(r['referenceTests'])
 for p in r['source']:
  paths.update(str(x.relative_to(root)) for x in (root/p).parent.glob('*.module.css'))
inputs={p:sha(p) for p in sorted(paths)}
prior_comparison={p:{'priorSha256':v['sha256'],'currentSha256':inputs[p],'matches':v['sha256']==inputs[p]} for p,v in prior['inputs'].items() if p in inputs}
integration_comparison={p:{'savedSha256':h,'currentSha256':inputs[p],'matches':h==inputs[p]} for p,h in integration['inputHashes'].items() if p in inputs}
fix_comparison={p:{'savedSha256':h,'currentSha256':inputs[p],'matches':h==inputs[p]} for p,h in fixes['inputHashes'].items() if p in inputs}
built={p:{'savedSha256':integration['builtLibraryHashes'].get(p),'currentSha256':inputs[p],'matches':integration['builtLibraryHashes'].get(p)==inputs[p]} for p in inputs if '/dist/' in p}
expected={}
for leaf,v in assignment['priorEvidence'].items():
 for kind in ['report','results']:expected[v[kind]]={'expectedSha256':v[kind+'Sha256'],'currentSha256':sha(v[kind]),'matches':sha(v[kind])==v[kind+'Sha256']}
evidence={'schemaVersion':1,'capturedAt':datetime.datetime.now(datetime.timezone.utc).isoformat(),'baseHead':subprocess.check_output(['git','rev-parse','HEAD'],cwd=root,text=True).strip(),'branch':subprocess.check_output(['git','branch','--show-current'],cwd=root,text=True).strip(),'scope':'Only wave-03-08 artifacts written. No source/output mutation, installs, builds, native execution or git writes.','runtime':subprocess.check_output(['node','--version'],text=True).strip(),'inputHashes':inputs,'assignmentPriorReportVerification':expected,'priorInputComparison':prior_comparison,'integrationInputComparison':integration_comparison,'bug0008And0009InputComparison':fix_comparison,'selectedBuiltOutputComparison':built,'validation':{'sourceSelectorMatrix':'pass; scoped-validation.txt; authored-selector cascade only, excludes media/pseudo/native cascade','matrix':'214 catalogued export names; all eleven state decisions; exact source/test locations exist','docs':'proposed links/usage JSON pass','typescript':'native spec/config syntax transpiles only','patch':'git apply --check implementation.patch passes against captured dirty dev; patch-check.txt has empty stdout/stderr on success','notRun':['supported Node22/24 units','library/docs builds','catalog:check','native/packed consumers','physical device or spoken AT']},'preservedFailures':[{'file':'scoped-validation-first-failure.txt','cause':'Report-owned link checker resolved candidate paths as absolute paths, ignoring proposed-files mirror. Corrected checker to retain root-relative links; candidate docs unchanged.'},{'file':'preparation-first-failure.txt','cause':'Report-owned matrix generator alias setup put local name assignment after an early return on the same Python line. Corrected generator; no production change.'}],'limits':['Source/definition evidence does not close unapplied runtime acceptance.','Matrix enumerates catalogued parts and helpers, not every arbitrary host-supplied child or nonvisual hook.','Referenced existing tests are not newly executed passes; broad state/native/AT coverage remains partial.','No token source/generated output changes; documented local constants remain local exceptions.']}
(out/'evidence.json').write_text(json.dumps(evidence,indent=2)+'\n')
for key in ['priorInputComparison','integrationInputComparison','bug0008And0009InputComparison','selectedBuiltOutputComparison']:
 vals=evidence[key];print(key,len(vals),'compared',sum(v['matches'] for v in vals.values()),'match; changed:',[p for p,v in vals.items() if not v['matches']])
assert all(v['matches'] for v in expected.values())
