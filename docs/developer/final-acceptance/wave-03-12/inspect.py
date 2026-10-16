from pathlib import Path
import json,hashlib,datetime,subprocess
root=Path.cwd();out=root/'docs/developer/final-acceptance/wave-03-12'
def sha(p): return hashlib.sha256(p.read_bytes()).hexdigest() if p.is_file() else None
paths=list(json.loads((out/'patch-inputs.json').read_text()))+[
'AGENTS.md','README.md','docs/migration.md','docs/developer/component-architecture.md',
'packages/ui/src/components/Button/Button.module.css','packages/ui/src/components/IconPanelNavigation/IconPanelNavigation.tsx','packages/ui/src/components/IconPanelNavigation/IconPanelNavigation.module.css','packages/ui/src/components/SideNavigation/SideNavigation.tsx','packages/ui/src/components/SideNavigation/SideNavigation.module.css','packages/ui/src/experimental/Progress/Progress.module.css','packages/ui/src/experimental/Progress/Progress.tsx','packages/ui/src/experimental/ToggleButton/ToggleButton.module.css','packages/ui/src/experimental/Dialog/Dialog.tsx','packages/ui/src/experimental/Tooltip/Tooltip.tsx','packages/ui/src/foundation/tokens.json','packages/ui/scripts/tokens.test.mjs','apps/docs/theme/theme-graph.test.mjs','packages/ui/tests/browser/display-preferences.spec.ts','packages/ui/tests/browser/inventory-modal-boundaries.spec.ts','apps/docs/native-fixtures/generate-registry.mjs','packages/ui/dist/styles.css','packages/ui/dist/components/TextColorPickerControl/TextColorPickerControl.impl.js','packages/ui/dist/components/IconPanelNavigation/IconPanelNavigation.js']
epath='docs/developer/final-acceptance/coordinator-integration/evidence.json';e=json.loads((root/epath).read_text())
a=json.loads((out/'assignment.json').read_text()); prior=[]
for leaf,p in a['priorEvidence'].items():
 for name in ['report','results']:
  actual=sha(root/p[name]); expected=p[name+'Sha256'];prior.append({'leaf':leaf,'path':p[name],'expected':expected,'actual':actual,'unchanged':actual==expected})
previous=json.loads((root/'docs/developer/final-acceptance/wave-02-07/inspection.json').read_text())
previousHashes={row['path']:row['sha256'] for row in previous['inputs']}
rows=[]
for p in paths:
 h=sha(root/p); retained=None
 for key in ['inputHashes','builtLibraryHashes','privateFixtureOutputHashes']:
  if p in e.get(key,{}): retained=e[key][p];break
 rows.append({'path':p,'sha256':h,'wave0207Hash':previousHashes.get(p),'matchesWave0207':h==previousHashes[p] if p in previousHashes else None,'coordinatorIntegrationHash':retained,'matchesCoordinatorIntegration':h==retained if retained else None})
lease=Path('/tmp/sgui-parallel-batch-01-validation.lock/owner')
result={'capturedAt':datetime.datetime.now(datetime.timezone.utc).isoformat(),'head':subprocess.check_output(['git','rev-parse','HEAD'],text=True).strip(),'coordinatorEvidence':{'path':epath,'sha256':sha(root/epath),'scope':e['scope']},'priorReceipts':prior,'inputs':rows,'validationLease':{'legacyOccupied':lease.is_file(),'ownerFileSha256':sha(lease)},'limits':['No browser/OS/AT/device execution.','No source, output or registry modified outside assigned evidence directory.','Source snapshots do not establish transitive current-host/build equivalence.']}
(out/'input-reconciliation.json').write_text(json.dumps(result,indent=2)+'\n')
print(json.dumps({'priorReceiptsUnchanged':all(p['unchanged'] for p in prior),'inputs':len(rows),'coordinatorMatched':sum(r['matchesCoordinatorIntegration'] is True for r in rows),'coordinatorChanged':sum(r['matchesCoordinatorIntegration'] is False for r in rows),'notInCoordinatorSnapshot':sum(r['matchesCoordinatorIntegration'] is None for r in rows),'leaseOccupied':lease.is_file()}))
