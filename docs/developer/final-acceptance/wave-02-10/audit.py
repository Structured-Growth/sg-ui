import pathlib,json,hashlib,datetime,subprocess,re
root=pathlib.Path.cwd(); out=root/'docs/developer/final-acceptance/wave-02-10'
fa=json.loads((root/'docs/developer/final-acceptance/2026-10-16-source-inventory.json').read_text())
pkg=json.loads((root/'docs/developer/final-acceptance/2026-10-16-inventory.json').read_text())
# Scoped input delta only: reuse original inventories and do not regenerate graphs or build output.
scopes=['packages/ui/src/components/AppDataGrid','packages/ui/src/components/AppDataGridRowDnd','packages/ui/src/experimental/DataGrid']
files=set()
for scope in scopes:
 files.update(str(p.relative_to(root)) for p in (root/scope).rglob('*') if p.is_file())
extra=['docs/developer/react-aria-hardening-tasks.md','docs/developer/react-aria-final-acceptance.md','docs/developer/final-acceptance/parallel-reconciliation-2026-10-16.json','docs/developer/final-acceptance/parallel-10/results.json','docs/developer/final-acceptance/parallel-01/verification.json','docs/developer/react-aria-grid-contracts.md','docs/developer/react-aria-grid-decision.md','docs/developer/react-aria-grid-reorder.md','docs/developer/react-aria-grid-cell-acceptance.md','docs/developer/react-aria-catalog-grid.md','docs/developer/react-aria-performance.md','docs/developer/migration-baseline/proof-measurements.json','docs/developer/react-aria-browser-acceptance.md','docs/developer/react-aria-package-acceptance.md','docs/developer/react-aria-server-components.md','docs/developer/docs-fixture-migration.md','docs/developer/docs-website.md','docs/developer/react-aria-progress.md','docs/developer/backlog-execution-2026-10-15.md','.github/workflows/ci.yml','packages/ui/playwright.config.ts','packages/ui/scripts/check-package.mjs','packages/ui/scripts/package-consumer.tsx','packages/ui/scripts/test-foundation-consumer.mjs','packages/ui/scripts/test-editor-consumer.mjs','packages/ui/scripts/test-next-consumer.mjs','packages/ui/scripts/packed-browser.mjs','packages/ui/package.json','packages/ui/tests/types/app-data-grid-view-state.tsx','apps/docs/native-fixtures/generate-registry.mjs','packages/ui/src/foundation/ThemeScope.tsx','packages/ui/src/foundation/ThemeScope.test.tsx','packages/ui/src/foundation/ThemeScope.next100-regression.test.tsx','packages/ui/src/foundation/scrollbar-activity.test.ts','packages/ui/src/components/ImageUploadModal/ImageUploadModal.test.tsx','packages/ui/src/components/AppDataGridShell/AppDataGridShell.server-response-races.test.tsx','packages/ui/src/components/AppDataGridShell/AppDataGridShell.test.tsx']
for name in ['acceptance','reorder','batch01-grid-focus','batch01-grid-reorder','batch05-grid-busy','batch05-grid-clipboard','batch08-grid-retry-focus','grid-server-response-races','hardening-grid-presentation','token-tier-scope']:
 extra.append('packages/ui/tests/browser/'+name+'.spec.ts')
for name in ['parallel-batch-01/grid-focus.md','parallel-batch-05/grid-busy.md','parallel-batch-05/grid-clipboard.md','parallel-batch-82/grid-server-response-races.md','parallel-batch-26/grid-reset-type-route.md']:
 extra.append('docs/developer/'+name)
files.update(extra)
def sha(p):return hashlib.sha256(p.read_bytes()).hexdigest()
inputs=[]
for name in sorted(files):
 p=root/name; h=sha(p); old=fa['inputHashes'].get(name)
 inputs.append({'path':name,'sha256':h,'fa02Sha256':old,'comparison':'unchanged' if old==h else 'changed' if old else 'not_captured'})
built=[]
for name,old in pkg['builtHashes'].items():
 if name.startswith(('dist/components/AppDataGrid/','dist/components/AppDataGridRowDnd/','dist/experimental/DataGrid/')) and name.endswith('.d.ts'):
  p=root/'packages/ui'/name; h=sha(p) if p.exists() else None
  built.append({'path':'packages/ui/'+name,'sha256':h,'fa01Sha256':old,'matchesFA01':h==old})
leak=re.compile(r'react-aria|react-stately|@react-types|@react-stately|@mui|@emotion|@tanstack')
leaks=[x['path'] for x in built if x['sha256'] and leak.search((root/x['path']).read_text())]
manifest=json.loads((root/'packages/ui/package.json').read_text())
retired={k:[n for n in manifest.get(k,{}) if n.startswith(('@mui/','@emotion/'))] for k in ['dependencies','peerDependencies','devDependencies','optionalDependencies']}
record={'capturedAt':datetime.datetime.now(datetime.timezone.utc).isoformat(),'head':subprocess.check_output(['git','rev-parse','HEAD'],text=True).strip(),'branch':subprocess.check_output(['git','branch','--show-current'],text=True).strip(),'inputs':inputs,'builtGridDeclarations':built,'upstreamDeclarationMatches':leaks,'retiredManifestDependencies':retired,'limits':['Read-only scoped delta/declaration audit, no runtime import/typecheck/build/browser execution.','Built grid declarations match only their individual saved hashes; concurrent four-component fixes may invalidate whole-package build/consumer equivalence.','FA-04 unit baseline retained only where relevant input bytes remain equal; dependencies/complete browser host are not reconstructed.']}
(out/'input-reconciliation.json').write_text(json.dumps(record,indent=2)+'\n')
print(json.dumps({'scopedInputs':len(inputs),'unchanged':sum(x['comparison']=='unchanged' for x in inputs),'changed':[x['path'] for x in inputs if x['comparison']=='changed'],'gridDeclarations':len(built),'declarationChanges':[x['path'] for x in built if not x['matchesFA01']],'upstreamDeclarationMatches':leaks,'retiredManifestDependencies':retired},indent=2))
