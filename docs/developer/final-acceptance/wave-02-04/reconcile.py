import json,re,hashlib,subprocess,datetime
from pathlib import Path
root=Path.cwd(); own=root/'docs/developer/final-acceptance/wave-02-04'
snapshot=json.loads((root/'docs/developer/final-acceptance/2026-10-16-source-inventory.json').read_text())
expected=snapshot['inputHashes'].copy()
for d in json.loads((root/'docs/developer/final-acceptance/fa04-library-input-delta.json').read_text())['changes']: expected[d['file']]=d['after']
hard=(root/'docs/developer/react-aria-hardening-tasks.md').read_text()
ledger=(root/'docs/developer/react-aria-scope-ledger.md').read_text()
rows=[]
for m in re.finditer(r'^\| M-(\d\d) \| ([^|]+) \| ([^|]+) \|$',ledger,re.M):
 n,name,requirement=m.groups(); name=name.strip(); current='Button' if name=='AppButton' else name
 prefix='packages/ui/src/components/'+current+'/'
 candidates=[p for p in expected if p.startswith(prefix)]
 tests=[p for p in candidates if '.test.' in p]
 impl=[p for p in candidates if p.endswith(('.tsx','.ts')) and '.test.' not in p and 'native-fixture' not in p]
 open_v=re.findall(r'^- \[ \] (V-C'+n+r'-\d+) (.+)$',hard,re.M)
 rows.append({'originalId':'M-'+n,'functionalityGroup':'F-C'+n,'regressionGroup':'T-C'+n,'hardeningGroup':'V-C'+n,
  'historicalDirectory':name,'currentDirectory':current,'originalFocus':requirement.strip(),
  'implementationFiles':impl,'testFiles':tests,
  'initialPRAttribution':{'url':'https://github.com/Structured-Growth/sg-ui/pull/1','evidence':'docs/developer/react-aria-scope-ledger.md and react-aria-progress.md','limit':'Historical documentary attribution, not a fresh remote PR review or per-row merge-SHA receipt.'},
  'baselineReceipt':'docs/developer/react-aria-baseline-tasks.md (all 570 accepted; deleted individual F entries are not reconstructed)',
  'regressionReceipt':'docs/developer/react-aria-regression-tasks.md (all 570 accepted; deleted individual T entries are not reconstructed)',
  'validationReceipt':'docs/developer/final-acceptance/fa04-original-check.txt plus fa04-calendar-rerun.txt; docs/developer/backlog-execution-2026-10-15.md for named native batches',
  'openHardeningLeaves':[{'id':i,'requirement':v} for i,v in open_v],
  'acceptanceDisposition':'Held for the separate assigned A-M row review; directory/source presence never closes whole-row acceptance.',
  'trackingSuccessor':'Attach attributable row-specific reviewed PR/head and validation receipt where not already present in migration-inventory-acceptance.md; preserve named outstanding V/G/E/device/AT conditions.'})
assert len(rows)==37
(own/'migration-index.json').write_text(json.dumps(rows,indent=2)+'\n')
# Compare selected leaf inputs and tracking source roots against saved evidence; no inventory rerun.
prefixes=['packages/ui/src/components/Typefaces/','packages/ui/src/components/icons/','packages/ui/src/icons/','packages/ui/src/components/primitives/',
 'packages/ui/src/components/AppDataGrid/','packages/ui/src/components/DataToolbar/','packages/ui/src/hooks/',
 'packages/ui/src/experimental/Dialog/','packages/ui/src/experimental/AsyncMultiSelect/','packages/ui/src/experimental/DataGrid/',
 'packages/ui/src/experimental/DateRangeSelector/','packages/ui/src/experimental/DateField/','packages/ui/src/experimental/Calendar/',
 'packages/ui/src/experimental/Typography/','packages/ui/src/experimental/TextField/','packages/ui/src/components/Button/']
explicit=['packages/ui/src/components/AdminDataGridOptions.ts','packages/ui/src/components/InstructorDataGridOptions.ts',
'packages/ui/src/components/AdminDataGridOptions.test.tsx','packages/ui/src/models.ts','packages/ui/src/index.ts','packages/ui/src/components/index.ts',
'packages/ui/src/experimental/index.ts','packages/ui/scripts/check-foundations.mjs','packages/ui/scripts/check-package.mjs','packages/ui/scripts/measure-migration-proofs.mjs',
'packages/ui/package.json','pnpm-lock.yaml','docs/developer/react-aria-performance.md','docs/developer/migration-baseline/proof-measurements.json',
'apps/docs/native-fixtures/scenarios/experimental/Dialog/Dialog.fixture.tsx','apps/docs/native-fixtures/scenarios/components/Typefaces/Typefaces.fixture.tsx',
'apps/docs/examples/AsyncSearchExample.tsx','apps/docs/examples/LocalizedRangeExample.tsx','apps/docs/examples/FormIntegrationExamples.tsx']
selected=sorted(set(explicit+[p for p in expected if any(p.startswith(pre) for pre in prefixes)]))
records=[]
for p in selected:
 current=hashlib.sha256((root/p).read_bytes()).hexdigest() if (root/p).is_file() else None
 records.append({'path':p,'sha256':current,'baselineSha256':expected.get(p),'comparison':'same' if current==expected.get(p) else 'changed' if p in expected else 'not-in-snapshot'})
# Four concurrently edited controls are explicitly excluded from reuse, even if capture catches old bytes.
concurrent=[]
for component in ['PeriodPicker','DateTimeRangePicker','DateRangeComparisonPicker','TextArea']:
 for p in expected:
  if p.startswith('packages/ui/src/experimental/'+component+'/'):
   concurrent.append({'path':p,'sha256':hashlib.sha256((root/p).read_bytes()).hexdigest() if (root/p).is_file() else None,'reuse':'Excluded: coordinator-owned concurrent BUG-0008/0009 changes; old output is not proof of new source.'})
out={'capturedAt':datetime.datetime.now(datetime.timezone.utc).isoformat(),'head':subprocess.check_output(['git','rev-parse','HEAD'],text=True).strip(),
'branch':subprocess.check_output(['git','branch','--show-current'],text=True).strip(),'sourceState':'Existing modified working tree; hashes are authority, not HEAD alone.',
'comparisonBasis':'FA-02 inputHashes overlaid with FA-04 four corrections','selectedInputs':records,'concurrentControlsExcluded':concurrent,
'summary':{k:sum(r['comparison']==k for r in records) for k in ['same','changed','not-in-snapshot']},
'checksActuallyRun':['Read original 21 leaf statements and source/test/contract/accepted receipts','Selected SHA-256 input comparisons only; no repeated source/dependency/export inventory','37-row migration tracking index constructed from existing scope ledger and snapshot','Referenced historical raw artifact directories checked for availability; hb16/backlog artifacts absent at documented paths'],
'noNewTestExecution':True}
(own/'input-evidence.json').write_text(json.dumps(out,indent=2)+'\n')
print(json.dumps({'migrationRows':len(rows),'selectedInputComparisons':out['summary'],'head':out['head']},indent=2))
