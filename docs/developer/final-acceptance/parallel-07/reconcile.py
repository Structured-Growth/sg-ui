"""Read-only reconciliation against retained FA inventories; writes only this directory."""
from pathlib import Path
import hashlib, json, posixpath, subprocess
from datetime import datetime, timezone
ROOT = Path(__file__).resolve().parents[4]
OUT = Path(__file__).resolve().parent
old = json.loads((ROOT/'docs/developer/final-acceptance/2026-10-16-source-inventory.json').read_text())
built = json.loads((ROOT/'docs/developer/final-acceptance/2026-10-16-inventory.json').read_text())
changes = json.loads((ROOT/'docs/developer/final-acceptance/fa04-library-input-delta.json').read_text())
expected = dict(old['inputHashes'])
for change in changes['changes']: expected[change['file']] = change['after']
seeds = '''packages/ui/src/components/Button/Button.public-contract.test.tsx
packages/ui/src/components/AppDataGrid/AppDataGrid.test.tsx
packages/ui/src/experimental/DataGrid/DataGrid.test.tsx
packages/ui/src/experimental/DateRangeSelector/DateRangeSelector.behavior.test.tsx
packages/ui/src/components/ImageUploadModal/ImageUploadModal.test.tsx
packages/ui/src/adapters/accounts.test.tsx
packages/ui/src/components/PageRichTextEditorSection/EditorUploadLifetime.next100-regression.test.tsx
packages/ui/src/components/PageRichTextEditorSection/PageRichTextEditorSection.impl.tsx
packages/ui/src/experimental/SearchField/SearchField.tsx'''.splitlines()
imports = {}
for record in old['imports']: imports.setdefault(record['file'], []).append(record)
visited = set()
unresolved = []
def visit(path):
    if path in visited: return
    visited.add(path)
    for record in imports.get(path, []):
        spec = record['specifier']
        if not spec.startswith('.'): continue
        base = posixpath.normpath(posixpath.join(posixpath.dirname(path), spec))
        candidates = [base] + [base+ext for ext in ['.ts','.tsx','.json','.css','/index.ts','/index.tsx']]
        resolved = next((p for p in candidates if p in expected), None)
        if resolved: visit(resolved)
        else: unresolved.append(record)
for path in seeds: visit(path)
extra = '''AGENTS.md
README.md
docs/migration.md
docs/developer/component-architecture.md
docs/developer/react-aria-hardening-tasks.md
docs/developer/react-aria-final-acceptance.md
docs/developer/react-aria-architecture.md
docs/developer/react-aria-dependency-upgrades.md
docs/developer/react-aria-calendar-contracts.md
docs/developer/react-aria-catalog-grid.md
docs/developer/react-aria-grid-contracts.md
docs/developer/react-aria-editor-section.md
packages/ui/src/adapters/accounts.tsx
packages/ui/src/components/AppDataGrid/types.ts
packages/ui/src/components/AppDataGrid/ownedGridColumns.ts
packages/ui/scripts/check-foundations.mjs
packages/ui/scripts/check-package.mjs
packages/ui/scripts/vitest.setup.ts
packages/ui/vitest.config.ts
packages/ui/tsconfig.json
packages/ui/package.json
package.json
pnpm-lock.yaml'''.splitlines()
def digest(path):
    p=ROOT/path
    return hashlib.sha256(p.read_bytes()).hexdigest() if p.is_file() else None
def receipt(path):
    current=digest(path); previous=expected.get(path)
    return {'file':path,'sha256':current,'expectedAfterFA04':previous,'comparison': 'same' if current==previous and current else 'changed' if previous else 'not-in-FA02'}
inputs = [receipt(p) for p in sorted(visited | set(extra))]
# Only the two implementation roots selected above, not a new output inventory.
outputs=[]
for seed in seeds:
    if '.test.' in seed: continue
    for suffix in ['.js','.d.ts']:
        path=seed.replace('packages/ui/src/','dist/').removesuffix('.tsx')+suffix
        current=digest('packages/ui/'+path)
        outputs.append({'file':'packages/ui/'+path,'sha256':current,'fa01':built['builtHashes'].get(path),'comparison':'same' if current==built['builtHashes'].get(path) else 'changed'})
names={'react','react-dom','react-aria','react-aria-components','react-stately','@internationalized/date'}
graph=old['installedDependencies']
result={
 'capturedAt':datetime.now(timezone.utc).isoformat(),
 'head':subprocess.check_output(['git','rev-parse','HEAD'],cwd=ROOT,text=True).strip(),
 'branch':subprocess.check_output(['git','branch','--show-current'],cwd=ROOT,text=True).strip(),
 'method':'Selected test/implementation relative-import closures from retained FA-02 graph; hashes compared to FA-02 with FA-04 deltas applied. No inventory, build, browser, consumer or test suite rerun.',
 'seeds':seeds,'closureCount':len(visited),'unresolvedRelativeImports':unresolved,
 'inputs':inputs,'selectedOutputs':outputs,
 'retainedDependencyGraph':{'source':'../2026-10-16-source-inventory.json','capturedAt':old['capturedAt'],'nodes':[n for n in graph['nodes'] if n['name'] in names],'dateEdges':[e for e in graph['edges'] if e['to'].startswith('@internationalized/date@')]},
 'retainedEvidence':[{'file':p,'sha256':digest(p)} for p in ['docs/developer/final-acceptance/2026-10-16-source-inventory.json','docs/developer/final-acceptance/2026-10-16-inventory.json','docs/developer/final-acceptance/fa04-original-check.txt','docs/developer/final-acceptance/fa04-calendar-rerun.txt','docs/developer/final-acceptance/fa04-package.txt','docs/developer/final-acceptance/fa02-foundations.txt']],
 'limits':['Graph observations deduplicate name/version, not physical package instances or peer-context singletons.','No current installed graph recapture, installation, registry/advisory review or upgrade performed.','Unit evidence is DOM emulation; it does not establish native/device/AT conformance.','Source-only architecture acceptance does not close other component or editor V leaves.']}
(OUT/'input-receipt.json').write_text(json.dumps(result,indent=2)+'\n')
print(json.dumps({'head':result['head'],'closureCount':len(visited),'inputs':len(inputs),'changed':[r['file'] for r in inputs if r['comparison']=='changed'],'notInFA02':[r['file'] for r in inputs if r['comparison']=='not-in-FA02'],'unresolvedRelativeImports':len(unresolved),'selectedOutputs':outputs},indent=2))
