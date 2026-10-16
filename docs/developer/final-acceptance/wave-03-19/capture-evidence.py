from pathlib import Path
import hashlib,json,subprocess,datetime
r=Path.cwd();o=r/'docs/developer/final-acceptance/wave-03-19'
h=lambda p:hashlib.sha256(p.read_bytes()).hexdigest() if p.is_file() else None
prior={}
for wave,key in [('wave-02-08','files'),('wave-02-09','inputs')]:
 d=json.loads((r/f'docs/developer/final-acceptance/{wave}/input-evidence.json').read_text())
 prior[wave]={row['path']:row.get('sha256') for row in d[key]}
components=['Select','ComboBox','AsyncMultiSelect','Menu','Popover','Tooltip']
paths=set()
for component in components:
 for p in (r/f'packages/ui/src/experimental/{component}').rglob('*'):
  if p.is_file(): paths.add(p.relative_to(r).as_posix())
 for p in (r/f'packages/ui/dist/experimental/{component}').rglob('*'):
  if p.is_file(): paths.add(p.relative_to(r).as_posix())
 for p in (r/f'apps/docs/native-fixtures/scenarios/experimental/{component}').rglob('*'):
  if p.is_file(): paths.add(p.relative_to(r).as_posix())
for p in ['packages/ui/src/components/Button/Button.tsx','packages/ui/src/foundation/ThemeScope.tsx','packages/ui/src/adapters/navigation.tsx','packages/ui/src/i18n/index.ts','packages/ui/src/experimental/TextField/TextField.module.css','packages/ui/playwright.config.ts','packages/ui/vitest.config.ts','docs/developer/hierarchical-menu-scope.md','apps/docs/native-fixtures/registry.json','packages/ui/browser-docs-static/index.json','packages/ui/browser-docs-static/index.html','docs/developer/final-acceptance/coordinator-integration/evidence.json','/tmp/sgui-calendar-validate.mjs']:
 if p.startswith('/tmp'):continue
 if (r/p).exists():paths.add(p)
for name in ['batch01-selectors.spec.ts','batch14-async-busy.spec.ts','batch17-menu-autofocus.spec.ts','batch13-control-tooltip.spec.ts','acceptance-pack-121.spec.ts']:
 paths.add('packages/ui/tests/browser/'+name)
for wave in ['wave-02-08','wave-02-09']:
 for name in ['report.md','results.json','input-evidence.json']:
  paths.add(f'docs/developer/final-acceptance/{wave}/{name}')
rows=[]
for p in sorted(paths):
 digest=h(r/p)
 rows.append({'path':p,'sha256':digest,'prior':{wave:{'sha256':items.get(p),'unchanged':items[p]==digest if p in items else None} for wave,items in prior.items()}})
coordinator=json.loads((r/'docs/developer/final-acceptance/coordinator-integration/evidence.json').read_text())
for row in rows:
 for field in ['inputHashes','builtLibraryHashes','privateFixtureOutputHashes']:
  if row['path'] in coordinator[field]:
   saved=coordinator[field][row['path']]
   row.setdefault('coordinatorComparison',{})[field]={'sha256':saved,'unchanged':saved==row['sha256']}
artifacts={str(p.relative_to(o)):h(p) for p in o.rglob('*') if p.is_file() and p.name not in ['input-evidence.json','results.json','report.md']}
d={'capturedAt':datetime.datetime.now(datetime.timezone.utc).isoformat(),'head':subprocess.check_output(['git','rev-parse','HEAD'],text=True).strip(),'branch':subprocess.check_output(['git','branch','--show-current'],text=True).strip(),'runtime':subprocess.check_output(['node','--version'],text=True).strip(),'scope':'Selected selector/menu source, built module and fixture hashes only; no full transitive host equivalence. Built output is inspected, not rebuilt. No native execution.','files':rows,'artifactHashes':artifacts}
(o/'input-evidence.json').write_text(json.dumps(d,indent=2)+'\n')
print('Captured',len(rows),'input rows;',len(artifacts),'artifact hashes')
for wave in prior:
 values=[row['prior'][wave]['unchanged'] for row in rows if row['prior'][wave]['unchanged'] is not None]
 print(wave,'matched',values.count(True),'changed',values.count(False),'not captured',len(rows)-len(values))
