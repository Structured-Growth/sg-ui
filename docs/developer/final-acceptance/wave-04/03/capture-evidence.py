from pathlib import Path
import json,hashlib,subprocess
root=Path(__file__).resolve().parents[5];out=Path(__file__).resolve().parent
hash=lambda b:hashlib.sha256(b).hexdigest()
def save(n,d):(out/n).write_text(json.dumps(d,indent=2)+'\n')
receipts=['wave-03-integration/final-build-inputs.json','wave-03-followup/validated-source-inputs.json','year-scroll-independent-navigation/results.json','centered-month-choices/results.json','default-nearest-range/results.json','editor-chrome-presentation/results.json','rich-editor-presentation/results.json']
comparisons={}
for f in receipts:
 p=root/'docs/developer/final-acceptance'/f;d=json.loads(p.read_text());m=d.get('sourceSha256',d if all(isinstance(v,str) for v in d.values()) else {})
 entries={}
 for path,h in m.items():
  if not any(k in path for k in ['/experimental/Calendar/','/experimental/Date','/experimental/TimeField/','/experimental/MonthPicker/','/experimental/YearPicker/','calendar','date-entry','forms.json']):continue
  current=root/path
  if current.is_file():entries[path]={'recordedSha256':h,'currentSha256':hash(current.read_bytes()),'matches':hash(current.read_bytes())==h}
 comparisons[str(p.relative_to(root))]={'receiptSha256':hash(p.read_bytes()),'inputs':entries}
save('input-reconciliation.json',{'head':subprocess.check_output(['git','rev-parse','HEAD'],cwd=root,text=True).strip(),'comparisons':comparisons,'limit':'Scoped input comparison only. Mismatched files do not gain current runtime acceptance from old receipts.'})
# The old checkpoint commit stores the sources underlying the accepted native run.
base='bd169b54';parts=[]
for path,start,end in [
 ('packages/ui/src/experimental/DateField/TextDateField.tsx','  const validateCandidate','  return <div'),
 ('packages/ui/src/experimental/TimeField/TextTimeField.tsx',' const {t}=',' const numbers='),
 ('packages/ui/src/experimental/DateRangePicker/DateRangePicker.tsx','  const { t }','  return <div'),
]:
 old=subprocess.check_output(['git','show',base+':'+path],cwd=root,text=True);new=(root/path).read_text()
 def fragment(s):
  s=s[s.index(start):s.index(end)]
  # Isolate behavior from the newly inserted message-layout object.
  if '  const messages=' in s:s=s[:s.index('  const messages=')]
  if ' const messages=' in s:s=s[:s.index(' const messages=')]
  return s
 a,b=fragment(old),fragment(new)
 parts.append({'path':path,'oldFileSha256':hash(old.encode()),'currentFileSha256':hash(new.encode()),'startMarker':start,'endMarker':end,'oldFragmentSha256':hash(a.encode()),'currentFragmentSha256':hash(b.encode()),'identical':a==b})
save('entry-core-reconciliation.json',{'baseline':base,'parts':parts,'limits':'Only the exact state/validity/commit/reset fragments above are compared. FieldMessages markup, styling, portals, engines, host builds and the wider import graph are not certified by fragment matching.'})
p=root/'packages/ui/artifacts/wave03-integration/followup-final-results.json';d=json.loads(p.read_text());cases=[]
def walk(suites):
 for suite in suites:
  f=suite.get('file','')
  if any(k in f for k in ['date-entry-clipboard','calendar-navigation-reflow']):
   for spec in suite.get('specs',[]):
    for t in spec.get('tests',[]):cases.append({'file':f,'title':spec['title'],'project':t.get('projectName'),'status':t.get('status'),'results':[x.get('status') for x in t.get('results',[])]})
  walk(suite.get('suites',[]))
walk(d['suites'])
save('retained-native-cases.json',{'receipt':str(p.relative_to(root)),'sha256':hash(p.read_bytes()),'cases':cases,'limit':'24 historical executions: four clipboard/preset + four navigation cases per engine. No rerun here; nine clipboard cases are trusted date/time/range paste, three are DOM/keyboard preset descriptions.'})
paths=['docs/developer/react-aria-calendar-contracts.md','docs/developer/react-aria-final-acceptance.md','docs/developer/react-aria-hardening-execution.md','docs/developer/final-acceptance/wave-03-27/report.md','docs/developer/final-acceptance/wave-03-28/report.md','docs/developer/final-acceptance/wave-03-integration/reconciliation.json','docs/developer/final-acceptance/wave-03-followup/validation-results.json','docs/developer/final-acceptance/default-nearest-range/units.log','docs/developer/final-acceptance/apple-simulator/repeat-receipt.json','docs/developer/final-acceptance/apple-simulator/voiceover-utterances.txt']
for folder in ['Calendar','DateField','DatePicker','DateRangeSelector','DateRangePicker','TimeField']:
 paths.extend(str(p.relative_to(root)) for p in (root/'packages/ui/src/experimental'/folder).glob('*') if p.is_file())
paths.extend(['packages/ui/tests/browser/date-entry-clipboard.spec.ts','packages/ui/tests/browser/calendar-navigation-reflow.spec.ts','apps/docs/native-fixtures/scenarios/experimental/DatePicker/DatePicker.native-transactions.fixture.tsx','apps/docs/native-fixtures/scenarios/experimental/DateRangeSelector/DateRangeSelector.fixture.tsx','apps/docs/native-fixtures/scenarios/experimental/Calendar/Calendar.fixture.tsx','packages/ui/tests/apple/run-simulator.mjs','packages/ui/tests/apple/SimulatorAcceptance.swift'])
save('evidence-hashes.json',{p:hash((root/p).read_bytes()) for p in sorted(set(paths)) if (root/p).is_file()})
print(json.dumps({'matchedEntryFragments':sum(x['identical'] for x in parts),'entryFragments':len(parts),'nativeCases':len(cases),'receiptFiles':len(paths)}))
