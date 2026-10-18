from pathlib import Path
import hashlib,json,difflib,subprocess
ROOT=Path(__file__).resolve().parents[5]
OUT=ROOT/'docs/developer/final-acceptance/wave-04/05'
def sha(p):return hashlib.sha256(p.read_bytes()).hexdigest()
def write(name,value): (OUT/name).write_text(json.dumps(value,indent=2)+'\n')
assignment=json.loads((OUT/'assignment.json').read_text())
# Latest receipts override older receipts only for their explicitly captured inputs.
receipts=['wave-03-integration/push-source-inputs.json','wave-03-followup/validated-source-inputs.json','form-field-message-placement/results.json','form-field-scope/results.json','field-focus-boundary/results.json']
prior={}
for rel in receipts:
 p=ROOT/'docs/developer/final-acceptance'/rel; d=json.loads(p.read_text()); rows=d.get('sourceSha256',d)
 for k,v in rows.items():
  if isinstance(v,str) and len(v)==64:prior[k]={'sha256':v,'receipt':str(p.relative_to(ROOT))}
families=['TextField','TextArea','Checkbox','Switch','RadioGroup','Select','ComboBox','AsyncMultiSelect','FormFieldScope']
paths=set()
for family in families:
 paths.update(p for p in (ROOT/'packages/ui/src/experimental'/family).glob('*') if p.is_file())
for rel in ['packages/ui/src/experimental/useFormReset.ts','packages/ui/src/experimental/public-contracts.acceptance.test.tsx','packages/ui/src/foundation/tokens.json','packages/ui/src/foundation/ThemeScope.tsx','apps/docs/content/component-usage/forms.json','apps/docs/examples/catalog/forms-dates.tsx','docs/developer/react-aria-public-composition-contracts.md','docs/developer/react-aria-final-acceptance.md','docs/developer/react-aria-hardening-execution.md','docs/developer/backlog-execution-2026-10-15.md']:
 p=ROOT/rel
 if p.exists():paths.add(p)
for family in families:
 paths.update(p for p in (ROOT/'apps/docs/native-fixtures/scenarios/experimental'/family).glob('*') if p.is_file())
for rel in ['wave-03-03/report.md','wave-03-03/results.json','wave-03-10/report.md','wave-03-10/results.json','wave-03-18/report.md','wave-03-18/results.json','wave-03-19/report.md','wave-03-19/results.json','wave-03-followup/status.md','wave-03-followup/validation-results.json','wave-03-followup/native-final.log','wave-03-followup/units-final.log','wave-03-integration/reconciliation.json','editor-chrome-presentation/results.json','rich-editor-presentation/results.json']+receipts:
 paths.add(ROOT/'docs/developer/final-acceptance'/rel)
rows=[]
for p in sorted(paths):
 rel=str(p.relative_to(ROOT)); h=sha(p); old=prior.get(rel)
 rows.append({'path':rel,'sha256':h,'latestComparedReceipt':old,'matchesComparedReceipt':h==old['sha256'] if old else None})
write('evidence.json',{'baseline':'6c485ed79d0d6a521d188e5bde8315722296f518','head':subprocess.check_output(['git','rev-parse','HEAD'],cwd=ROOT,text=True).strip(),'scope':'Sequential scoped source/receipt capture; not an atomic build or full transitive equivalence attestation. Older semantic flows retain their accepted scope; newer message-placement/focus receipts supersede changed field wrappers/styles.','files':rows})
# Extract actual native results; source hashes are separate from past runtime execution.
raw=ROOT/'packages/ui/artifacts/wave03-integration/followup-final-results.json'
native=[]
def visit(suites):
 for s in suites:
  for spec in s.get('specs',[]):
   if any(k in s.get('file','') for k in ['wave03-selector-contracts','wave03-18-primitives','acceptance-touch-targets','wave03-system-indications']):
    native.append({'file':s.get('file'),'title':spec['title'],'line':spec.get('line'),'tests':[{'engine':t.get('projectName'),'expectedStatus':t.get('expectedStatus'),'results':[{'status':x['status'],'retry':x.get('retry'),'duration':x.get('duration')} for x in t['results']]} for t in spec['tests']]})
  visit(s.get('suites',[]))
visit(json.loads(raw.read_text())['suites'])
write('retained-native-cases.json',{'path':str(raw.relative_to(ROOT)),'sha256':sha(raw),'cases':native,'limits':'Historical actual results, not new execution and not universal current source equivalence. The one system-indications WebKit failure is superseded only by its focused color rerun in validation-results.json.'})
# Regenerate exact patch after any review correction.
patch=''
for p in sorted((OUT/'proposed-files').rglob('*')):
 if p.is_file():
  rel=p.relative_to(OUT/'proposed-files'); before=(ROOT/rel).read_text() if (ROOT/rel).exists() else ''
  patch+=''.join(difflib.unified_diff(before.splitlines(True),p.read_text().splitlines(True),fromfile='a/'+str(rel) if before else '/dev/null',tofile='b/'+str(rel)))
(OUT/'checkbox-idrefs.patch').write_text(patch)
write('patch-preconditions.json',[{'path':str(p.relative_to(OUT/'proposed-files')),'currentSha256':sha(ROOT/p.relative_to(OUT/'proposed-files')) if (ROOT/p.relative_to(OUT/'proposed-files')).exists() else None,'proposedSha256':sha(p)} for p in sorted((OUT/'proposed-files').rglob('*')) if p.is_file()])
print(json.dumps({'captured':len(rows),'matchingCompared':sum(x['matchesComparedReceipt'] is True for x in rows),'differentCompared':sum(x['matchesComparedReceipt'] is False for x in rows),'nativeSpecs':len(native)},indent=2))
