"""Bounded acceptance evidence capture. Writes only beside this script."""
from pathlib import Path
import hashlib,json,re,subprocess,datetime
root=Path(__file__).resolve().parents[4]; out=Path(__file__).resolve().parent
snapshot=json.loads((root/'docs/developer/final-acceptance/2026-10-16-source-inventory.json').read_text())['inputHashes']
modules=['List','Navigation','Collapse','Disclosure','Chip','Badge','TagGroup','Progress','Status','Avatar','Table','Pagination','ToggleButton','Popover','Menu','TextField','TextArea','Checkbox','Switch','RadioGroup','Select','ComboBox','Tooltip','Dialog']
paths=set()
for name in modules:
 paths.update(p for p in (root/'packages/ui/src/experimental'/name).glob('*') if p.is_file() and p.suffix in ['.tsx','.css'])
extra=['packages/ui/src/foundation/ThemeScope.tsx','packages/ui/src/foundation/tokens.css','packages/ui/src/foundation/tokens.json','packages/ui/src/theme/AppThemeProvider.tsx','packages/ui/src/components/AppDataGrid/ownedGridPersistence.ts','packages/ui/src/components/AppDataGrid/ownedGridInteraction.tsx','packages/ui/src/components/AppDataGrid/ownedGridInteraction.drop-focus.test.tsx','packages/ui/src/experimental/DataGrid/DataGrid.tsx','packages/ui/src/components/DataToolbar/components/DataToolbarColumnsMenu.tsx','packages/ui/src/components/ExperiencePageNavigator/ExperiencePageNavigator.tsx','packages/ui/src/experimental/DateRangeSelector/RangeGestures.tsx','packages/ui/src/experimental/DateRangeSelector/DateRangeSelector.tsx','packages/ui/src/components/primitives/index.ts','packages/ui/scripts/check-foundations.mjs','packages/ui/package.json','pnpm-lock.yaml','packages/ui/playwright.config.ts','.github/workflows/ci.yml','docs/developer/react-aria-final-acceptance.md','docs/developer/react-aria-hardening-tasks.md']
specs=['batch13-control-taggroup','batch07-progress-status','hardening-progress-presentation','hardening-navigation-presentation','hardening-grid-presentation','hardening-typography-table-presentation','popover-native-collision','display-preferences','batch01-forms','batch05-native-reset','batch11-standalone-reset','batch01-dialogs','batch52-dialog-removed-opener','batch01-grid-reorder','reorder','acceptance-pack-121','acceptance','editor-clipboard','batch05-grid-clipboard','batch61-keyboard-range-preview']
extra += ['packages/ui/tests/browser/'+x+'.spec.ts' for x in specs]
paths.update(root/x for x in extra)
for name in ['PeriodPicker','DateTimeRangePicker','DateRangeComparisonPicker']:
 paths.update((root/'packages/ui/src/experimental'/name).glob('*.tsx'))
records=[]; titles={}
for p in sorted(paths):
 rel=str(p.relative_to(root))
 if not p.exists():records.append({'path':rel,'missing':True});continue
 text=p.read_text(); h=hashlib.sha256(p.read_bytes()).hexdigest(); old=snapshot.get(rel)
 records.append({'path':rel,'sha256':h,'fa02_sha256':old,'matches_fa02':h==old if old else None})
 if '.test.' in p.name or '.spec.' in p.name:
  titles[rel]=[{'line':n,'text':line.strip()} for n,line in enumerate(text.splitlines(),1) if re.search(r'\b(?:it|test)\s*(?:\.each[^\n]*)?\(',line)]
# Purpose-specific mock census: classify instrumentation instead of treating counts as behavior proof.
mocks=[]
for p in (root/'packages/ui/src').rglob('*.test.tsx'):
 for n,line in enumerate(p.read_text().splitlines(),1):
  if re.search(r'\b(?:vi|jest)\.mock\s*\(',line):mocks.append({'path':str(p.relative_to(root)),'line':n,'text':line.strip()})
receipts=['packages/ui/artifacts/hb11-2026-10-16/chromium/results.json','packages/ui/artifacts/hb16-2026-10-16/manifest.json','packages/ui/artifacts/hb17-fixed-2026-10-16/chromium/results.json','packages/ui/artifacts/backlog-2026-10-15-chromium-progress-presentation/results.json']
r={'captured_at':datetime.datetime.now(datetime.timezone.utc).isoformat(),'head':subprocess.check_output(['git','rev-parse','HEAD'],cwd=root,text=True).strip(),'branch':subprocess.check_output(['git','branch','--show-current'],cwd=root,text=True).strip(),'scope':'Selected primitive source/test/style/config inputs only; no complete transitive host/output equivalence claimed. Concurrent picker/TextArea fixes are dated inputs, not accepted built output.','inputs':records,'test_assertion_index':titles,'mock_census':mocks,'receipt_existence':{p:(root/p).exists() for p in receipts},'counts':{'inputs':len(records),'unchanged':sum(x.get('matches_fa02') is True for x in records),'changed':sum(x.get('matches_fa02') is False for x in records),'not_in_fa02':sum(x.get('matches_fa02') is None for x in records),'mock_calls':len(mocks)}}
if (out/'results.json').exists():
 extra=[]; seen={x['path'] for x in records}
 for leaf in json.loads((out/'results.json').read_text())['leaves']:
  for rel in leaf['source_references']+leaf['test_references']:
   if rel not in seen:
    p=root/rel; h=hashlib.sha256(p.read_bytes()).hexdigest(); old=snapshot.get(rel)
    extra.append({'path':rel,'sha256':h,'fa02_sha256':old,'matches_fa02':h==old if old else None});seen.add(rel)
 r['additional_leaf_references']=extra
(out/'input-evidence.json').write_text(json.dumps(r,indent=2)+'\n')
print(json.dumps(r['counts'])); print('changed:',[x['path'] for x in records if x.get('matches_fa02') is False]); print('missing:',[x['path'] for x in records if x.get('missing')])
