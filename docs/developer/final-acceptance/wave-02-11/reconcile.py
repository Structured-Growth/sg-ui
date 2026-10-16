"""Bounded input receipt. Reads relevant sources; writes only this directory."""
import hashlib,json,subprocess
from datetime import datetime,timezone
from pathlib import Path
root=Path.cwd()
out=Path(__file__).resolve().parent
base=root/'docs/developer/final-acceptance'
fa1=json.loads((base/'2026-10-16-inventory.json').read_text())
fa2=json.loads((base/'2026-10-16-source-inventory.json').read_text())
delta={x['file']:x['after'] for x in json.loads((base/'fa04-library-input-delta.json').read_text())['changes']}
dirs=['Calendar','DateField','DatePicker','DateRangeSelector','DateRangePicker','TimeField','PeriodPicker','DateTimeRangePicker','DateRangeComparisonPicker','Popover','Provider']
paths=[]
for name in dirs:
 paths.extend(p for p in (root/'packages/ui/src/experimental'/name).rglob('*') if p.is_file())
paths.extend(p for p in (root/'packages/ui/src/utils').glob('relative-dates*') if p.is_file())
names=['AGENTS.md','packages/ui/package.json','pnpm-lock.yaml','packages/ui/src/experimental/index.ts',
 'packages/ui/src/experimental/useFormReset.ts','packages/ui/src/experimental/TextField/useStandaloneFormReset.ts',
 'packages/ui/src/foundation/ThemeScope.tsx','packages/ui/src/i18n/index.tsx',
 'docs/developer/react-aria-calendar-contracts.md','docs/developer/parallel-batch-61/keyboard-range-preview.md',
 'apps/docs/examples/catalog/forms-dates.tsx','apps/docs/examples/AdvancedCalendarExamples.tsx',
 'apps/docs/examples/CalendarCompositionExamples.tsx','apps/docs/examples/LocalizedRangeExample.tsx','apps/docs/examples/FormIntegrationExamples.tsx',
 'apps/docs/native-fixtures/scenarios/experimental/Box/Box.fixture.tsx',
 'packages/ui/tests/browser/calendar-native-locales.spec.ts','packages/ui/tests/browser/batch01-calendar.spec.ts',
 'packages/ui/tests/browser/calendar.spec.ts','packages/ui/tests/browser/batch61-keyboard-range-preview.spec.ts',
 'packages/ui/tests/browser/datepicker-native-transactions.spec.ts','packages/ui/tests/browser/hardening-date-presentation.spec.ts']
paths.extend(root/name for name in names)
entries=[]
for p in sorted(set(paths)):
 name=p.relative_to(root).as_posix()
 if not p.exists():
  entries.append({'path':name,'missing':True});continue
 current=hashlib.sha256(p.read_bytes()).hexdigest()
 before=fa2['inputHashes'].get(name,fa1['sourceHashes'].get(name))
 expected=delta.get(name,before)
 entries.append({'path':name,'sha256':current,'fa04Expected':expected,'matchesFA04':current==expected,'baseline':'FA04 delta' if name in delta else 'FA02/FA01'})
logs=[]
for name in ['fa04-original-check.txt','fa04-calendar-rerun.txt','fa04-library-input-delta.json','fa04-library.txt','fa04-package.txt','fa04-fixtures.txt','fa04-retained-docs-build.txt','parallel-04/report.md','parallel-11/report.md','parallel-reconciliation-2026-10-16.json']:
 p=base/name
 logs.append({'path':p.relative_to(root).as_posix(),'sha256':hashlib.sha256(p.read_bytes()).hexdigest()})
own=[]
for name in ['acceptance.test.tsx','vitest.config.mjs','probe.log']:
 p=out/name;own.append({'path':p.relative_to(root).as_posix(),'sha256':hashlib.sha256(p.read_bytes()).hexdigest()})
receipt={'capturedAt':datetime.now(timezone.utc).isoformat(),'head':subprocess.check_output(['git','rev-parse','HEAD'],text=True).strip(),
 'branch':subprocess.check_output(['git','branch','--show-current'],text=True).strip(),'node':subprocess.check_output(['node','--version'],text=True).strip(),
 'scope':'Bounded source/input comparison only. No built-output freshness assertion; concurrent BUG-0008/9 fixes are coordinator-owned.',
 'inputs':entries,'differences':[x for x in entries if not x.get('matchesFA04')],
 'retainedEvidence':logs,'newProbe':own}
(out/'input-receipt.json').write_text(json.dumps(receipt,indent=2)+'\n')
print(json.dumps({'files':len(entries),'matching':sum(x.get('matchesFA04',False) for x in entries),'differences':receipt['differences'],'node':receipt['node']},indent=2))
