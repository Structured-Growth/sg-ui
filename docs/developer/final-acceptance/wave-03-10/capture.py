from pathlib import Path
import json,hashlib,datetime,subprocess,difflib
r=Path.cwd();o=r/'docs/developer/final-acceptance/wave-03-10'
sha=lambda p:hashlib.sha256(p.read_bytes()).hexdigest()
a=json.loads((o/'assignment.json').read_text());co=r/'docs/developer/final-acceptance/coordinator-integration/evidence.json';c=json.loads(co.read_text());old=json.loads((r/'docs/developer/final-acceptance/wave-02-09/input-evidence.json').read_text());prior={x['path']:x['sha256'] for x in old['inputs']}
files=set()
for folder in ['experimental/TagGroup','experimental/Checkbox','experimental/Switch','experimental/RadioGroup','experimental/IconButton','experimental/DataGrid','experimental/DateRangeSelector','components/Button','components/AppDataGrid','components/ExperiencePageNavigator']:
 files.update(p for p in (r/'packages/ui/src'/folder).glob('*') if p.is_file() and p.suffix in ['.tsx','.ts','.css'])
files.update([r/'packages/ui/src/foundation/ThemeScope.tsx',r/'packages/ui/src/foundation/tokens.css',r/'packages/ui/tests/browser/reorder.spec.ts',r/'packages/ui/tests/browser/hardening-control-geometry.spec.ts'])
inputs=[]
for p in sorted(files):
 key=str(p.relative_to(r));h=sha(p);inputs.append({'path':key,'sha256':h,'wave0209':prior.get(key),'matchesWave0209':h==prior[key] if key in prior else None,'coordinator':c['inputHashes'].get(key),'matchesCoordinator':h==c['inputHashes'][key] if key in c['inputHashes'] else None})
prior_receipts=[]
for leaf,rec in a['priorEvidence'].items():
 for kind in ['report','results']:
  p=r/rec[kind];prior_receipts.append({'leaf':leaf,'path':rec[kind],'sha256':sha(p),'matchesAssignment':sha(p)==rec[kind+'Sha256']})
base=json.loads((o/'patch-base-hashes.json').read_text());patch=''
for p in sorted((o/'proposed-files').rglob('*')):
 if not p.is_file():continue
 key=str(p.relative_to(o/'proposed-files'));original=r/key
 if key not in base:base[key]=sha(original) if original.exists() else None
 text=original.read_text() if original.exists() else ''
 patch+=''.join(difflib.unified_diff(text.splitlines(True),p.read_text().splitlines(True),fromfile='a/'+key if original.exists() else '/dev/null',tofile='b/'+key))
(o/'implementation.patch').write_text(patch);(o/'patch-base-hashes.json').write_text(json.dumps(base,indent=2)+'\n')
(o/'input-evidence.json').write_text(json.dumps({'capturedAt':datetime.datetime.now(datetime.timezone.utc).isoformat(),'head':subprocess.check_output(['git','rev-parse','HEAD'],text=True).strip(),'branch':subprocess.check_output(['git','branch','--show-current'],text=True).strip(),'runtime':'Node 24.19.0 bundled runtime; Python 3 capture; no shared build/browser execution','coordinatorEvidenceSha256':sha(co),'priorReceipts':prior_receipts,'inputs':inputs,'summary':{'inspectedInputs':len(inputs),'equalPrior':sum(x['matchesWave0209'] is True for x in inputs),'changedPrior':sum(x['matchesWave0209'] is False for x in inputs),'equalCoordinator':sum(x['matchesCoordinator'] is True for x in inputs),'changedCoordinator':sum(x['matchesCoordinator'] is False for x in inputs)}},indent=2)+'\n')
print(json.loads((o/'input-evidence.json').read_text())['summary'])
