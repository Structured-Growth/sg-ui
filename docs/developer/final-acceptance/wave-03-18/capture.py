from pathlib import Path
import hashlib,json,subprocess,datetime
r=Path.cwd();o=r/'docs/developer/final-acceptance/wave-03-18'
sha=lambda p:hashlib.sha256(p.read_bytes()).hexdigest() if p.exists() else None
prior=json.loads((r/'docs/developer/final-acceptance/wave-02-08/input-evidence.json').read_text());baseline={f['path']:f['sha256'] for f in prior['files']}
c=json.loads((r/'docs/developer/final-acceptance/coordinator-integration/evidence.json').read_text())
files=set()
for name in ['Box','Stack','Surface','Card','Divider','TextField','TextArea','Checkbox','Switch','RadioGroup','Tabs']:
 files.update(p for p in (r/'packages/ui/src/experimental'/name).glob('*') if p.is_file())
 files.update(p for p in (r/'packages/ui/dist/experimental'/name).glob('*') if p.is_file())
files.update(r/p for p in ['AGENTS.md','docs/developer/react-aria-final-acceptance.md','packages/ui/src/experimental/useFormReset.ts','packages/ui/dist/styles.css','apps/docs/examples/catalog/forms-dates.tsx','apps/docs/content/component-usage/forms.json','packages/ui/tests/browser/batch01-forms.spec.ts','packages/ui/tests/browser/batch05-native-reset.spec.ts','packages/ui/tests/browser/batch11-standalone-reset.spec.ts','packages/ui/tests/browser/tabs-vertical-orientation.spec.ts','packages/ui/tests/browser/batch05-tabs-overflow.spec.ts','apps/docs/native-fixtures/scenarios/experimental/Tabs/Tabs.fixture.tsx','docs/developer/parallel-batch-170/tabs-orientation.md','docs/developer/parallel-batch-179/manual-tabs-host-scroll.md','docs/developer/final-acceptance/wave-02-08/report.md','docs/developer/final-acceptance/wave-02-08/results.json','docs/developer/final-acceptance/wave-02-09/report.md','docs/developer/final-acceptance/wave-02-09/results.json','docs/developer/final-acceptance/coordinator-integration/evidence.json','docs/developer/final-acceptance/coordinator-integration/browsers-full.txt'])
records=[]
for p in sorted(files):
 key=str(p.relative_to(r));digest=sha(p);old=baseline.get(key);coordinator=c['inputHashes'].get(key,c['builtLibraryHashes'].get(key))
 records.append(dict(path=key,sha256=digest,priorWave02Sha256=old,matchesWave02=None if old is None else old==digest,coordinatorSha256=coordinator,matchesCoordinator=None if coordinator is None else coordinator==digest))
data=dict(capturedAt=datetime.datetime.now(datetime.timezone.utc).isoformat(),head=subprocess.check_output(['git','rev-parse','HEAD'],text=True).strip(),branch=subprocess.check_output(['git','branch','--show-current'],text=True).strip(),executionRuntime='Node v24.19.0 / Vitest v4.1.11 / jsdom (see raw logs)',files=records,method='Sequential SHA-256 capture of scoped inputs/output; read-only comparison. No atomic shared-checkout guarantee. Output equality preserves only named unchanged prior receipt scope; no new native validation.')
(o/'input-evidence.json').write_text(json.dumps(data,indent=2)+'\n')
print(json.dumps({'records':len(records),'wave02Matches':sum(x['matchesWave02'] is True for x in records),'wave02Changed':[x['path'] for x in records if x['matchesWave02'] is False],'coordinatorChanged':[x['path'] for x in records if x['matchesCoordinator'] is False]},indent=2))
