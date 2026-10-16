from pathlib import Path
import hashlib,json,datetime,subprocess
out=Path(__file__).resolve().parent;root=out.parents[3]
hashfile=lambda p:hashlib.sha256(p.read_bytes()).hexdigest() if p.is_file() else None
integrated=json.loads((root/'docs/developer/final-acceptance/coordinator-integration/evidence.json').read_text())
prior=json.loads((root/'docs/developer/final-acceptance/wave-02-11/input-receipt.json').read_text())
expected={**integrated['inputHashes'],**integrated['builtLibraryHashes']};fix08=json.loads((root/'docs/developer/final-acceptance/fix-08/results.json').read_text())['input_sha256'];historical={x['path']:x['sha256'] for x in prior['inputs']}
paths=set(historical)
for family in ['Calendar','DateField','DatePicker','DateRangeSelector','DateRangePicker','TimeField']:
 paths.update(str(p.relative_to(root)) for p in (root/'packages/ui/src/experimental'/family).glob('*') if p.is_file())
 paths.update(str(p.relative_to(root)) for p in (root/'packages/ui/dist/experimental'/family).glob('*') if p.is_file())
paths.update(['apps/docs/content/component-usage/forms.json','apps/docs/native-fixtures/scenarios/experimental/DatePicker/DatePicker.native-transactions.fixture.tsx','apps/docs/native-fixtures/scenarios/experimental/DateRangeSelector/DateRangeSelector.fixture.tsx','packages/ui/tests/browser/datepicker-native-transactions.spec.ts','packages/ui/tests/browser/batch61-keyboard-range-preview.spec.ts','apps/docs/tests/date-picker-availability-parity.spec.ts','packages/ui/scripts/browser-validation-pool.mjs','/tmp/sgui-calendar-validate.mjs'])
inputs=[]
for path in sorted(paths):
 p=Path(path) if path.startswith('/') else root/path;current=hashfile(p)
 baseline=expected.get(path);old=historical.get(path)
 inputs.append({'path':path,'sha256':current,'integratedSha256':baseline,'matchesIntegrated':current==baseline if baseline else None,'fix08Sha256':fix08.get(path),'matchesFix08':current==fix08[path] if path in fix08 else None,'wave02Sha256':old,'matchesWave02':current==old if old else None})
receipts=['docs/developer/final-acceptance/coordinator-integration/evidence.json','docs/developer/final-acceptance/coordinator-integration/browsers-full.txt','docs/developer/final-acceptance/coordinator-integration/composed-units.txt','docs/developer/final-acceptance/fix-08/report.md','docs/developer/final-acceptance/fix-08/results.json','docs/developer/final-acceptance/fix-09/report.md','docs/developer/final-acceptance/fix-09/results.json','docs/developer/final-acceptance/wave-02-11/report.md','docs/developer/final-acceptance/wave-02-11/results.json','docs/developer/final-acceptance/fa04-calendar-rerun.txt']
artifacts={str(p.relative_to(root)):hashfile(p) for p in out.rglob('*') if p.is_file() and p.name not in ['input-receipt.json','results.json','report.md']}
result={'capturedAt':datetime.datetime.now(datetime.timezone.utc).isoformat(),'head':subprocess.check_output(['git','rev-parse','HEAD'],cwd=root,text=True).strip(),'branch':subprocess.check_output(['git','branch','--show-current'],cwd=root,text=True).strip(),'scope':'Read-only bounded hash reconciliation. Matching inspected inputs retain their dated evidence; no complete transitive freshness/native/AT assertion. Proposed files are not integrated.','inputs':inputs,'retainedEvidence':{p:hashfile(root/p) for p in receipts},'artifacts':artifacts,'summary':{'inputCount':len(inputs),'integratedMatches':sum(x['matchesIntegrated'] is True for x in inputs),'integratedDifferences':[x['path'] for x in inputs if x['matchesIntegrated'] is False],'fix08Matches':sum(x['matchesFix08'] is True for x in inputs),'fix08Differences':[x['path'] for x in inputs if x['matchesFix08'] is False],'wave02Matches':sum(x['matchesWave02'] is True for x in inputs),'wave02Differences':[x['path'] for x in inputs if x['matchesWave02'] is False]}}
(out/'input-receipt.json').write_text(json.dumps(result,indent=2)+'\n');print(json.dumps(result['summary'],indent=2))
