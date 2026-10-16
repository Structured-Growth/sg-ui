"""Read-only icon reconciliation; writes evidence only beside this script."""
import hashlib
import json
import re
import subprocess
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parents[4]
OUT = Path(__file__).resolve().parent
def read(path):
    return (ROOT / path).read_text()
def digest(path):
    p = ROOT / path
    return hashlib.sha256(p.read_bytes()).hexdigest() if p.exists() else None

fa = json.loads(read('docs/developer/final-acceptance/2026-10-16-inventory.json'))
source = json.loads(read('docs/developer/final-acceptance/2026-10-16-source-inventory.json'))
baseline = json.loads(read('docs/developer/migration-baseline/inventory.json'))
mapping = json.loads(read('packages/ui/src/experimental/icons/icon-map.json'))
old = set()
for file in baseline['oldFoundationReferences']:
    if file['file'].startswith('src/'):
        for match in file['matches']:
            old.update(re.findall(r'@mui/icons-material/([A-Za-z0-9]+)', match['text']))

icon_paths = [p for p in fa['sourceHashes'] if any(part in p for part in
              ['/src/icons/', '/src/experimental/icons/', '/src/components/icons/'])]
support = ['packages/ui/package.json', 'pnpm-lock.yaml', 'packages/ui/vitest.config.ts',
           'packages/ui/scripts/test-foundation-consumer.mjs', 'packages/ui/scripts/check-package.mjs',
           'THIRD_PARTY_NOTICES.md', 'packages/ui/THIRD_PARTY_NOTICES.md',
           'docs/developer/react-aria-icons.md', 'apps/docs/examples/catalog/primitives-actions.tsx',
           'apps/docs/content/component-usage/presentation.json', 'packages/ui/src/experimental/IconButton/IconButton.tsx']
inputs = sorted(set(icon_paths + [p for p in support if (ROOT/p).exists()]))
hashes = {p: digest(p) for p in inputs}
comparison = {}
for p in inputs:
    previous = fa['sourceHashes'].get(p, source['inputHashes'].get(p))
    comparison[p] = {'sha256': hashes[p], 'savedSha256': previous,
                     'status': 'unchanged' if previous == hashes[p] else 'not-snapshotted' if previous is None else 'changed'}
built = {p: {'sha256': digest('packages/ui/'+p), 'savedSha256': h}
         for p,h in fa['builtHashes'].items() if any(part in p for part in
         ['dist/icons/', 'dist/experimental/icons/', 'dist/components/icons/']) or p == 'dist/styles.css'}
built_delta = [p for p,v in built.items() if v['sha256'] != v['savedSha256']]
implementations = {}
for p in (ROOT/'packages/ui/src/experimental/icons').glob('*Icon.tsx'):
    text = p.read_text()
    match = re.search(r'createIcon\((\w+),\s*"(\w+)"(, true)?\)', text)
    if match:
        implementations[match[2]] = {'vector': match[1], 'mirrorsInRtl': bool(match[3]),
                                    'file': str(p.relative_to(ROOT))}
map_mismatches = [name for name,vector in mapping.items()
                  if implementations.get(name+'Icon',{}).get('vector') != vector]
doc = read('docs/developer/react-aria-icons.md')
doc_names = set(re.findall(r'^\| (\w+Icon) \|', doc, re.M))
gallery = read('apps/docs/examples/catalog/primitives-actions.tsx')
gallery_names = set(re.findall(r'"(\w+Icon)"', re.search(r'const iconNames = \[(.*?)\] as const',gallery,re.S)[1]))
production_imports = [row for row in source['imports'] if row['file'].startswith('packages/ui/src/')
                      and '.test.' not in row['file'] and '.native-fixture' not in row['file']]
barrels = [row for row in production_imports if row['kind']=='import'
           and row['specifier'].endswith(('/icons','/icons/index'))]
barrel_source_deltas = [row['file'] for row in barrels if digest(row['file']) != source['inputHashes'].get(row['file'])]
unresolved_old = sorted(old-set(mapping))
license_path = 'packages/ui/node_modules/lucide-react/LICENSE'
license_text = read(license_path).strip()
notices = {p: license_text in read(p) for p in ['THIRD_PARTY_NOTICES.md','packages/ui/THIRD_PARTY_NOTICES.md']}
result = {
    'capturedAt': datetime.now(timezone.utc).isoformat(),
    'head': subprocess.check_output(['git','rev-parse','HEAD'],cwd=ROOT,text=True).strip(),
    'branch': subprocess.check_output(['git','branch','--show-current'],cwd=ROOT,text=True).strip(),
    'method': 'Bounded read-only delta and mapping checks. No test/build/browser/consumer rerun.',
    'savedInventoryCapturedAt': fa['capturedAt'], 'savedSourceCapturedAt': source['capturedAt'],
    'historicalBaselineHead': baseline['commit'],
    'inputComparisons': comparison, 'builtComparisons': built, 'builtDeltas': built_delta,
    'historicalDirectNames': sorted(old), 'missingHistoricalMappings': unresolved_old,
    'mapImplementationMismatches': map_mismatches,
    'implementations': implementations,
    'implementedButNotInMappingJson': sorted(set(implementations)-{n+'Icon' for n in mapping}),
    'implementedButNotInMappingDocumentation': sorted(set(implementations)-doc_names),
    'implementedButNotInGallery': sorted(set(implementations)-gallery_names),
    'galleryWithoutImplementation': sorted(gallery_names-set(implementations)),
    'productionBarrelImportsFromFA02': barrels, 'productionBarrelSourceDeltas': barrel_source_deltas,
    'installedLicenseSha256': digest(license_path), 'fullInstalledLicenseRetainedInNotices': notices,
    'noticeCopiesEqual': read('THIRD_PARTY_NOTICES.md') == read('packages/ui/THIRD_PARTY_NOTICES.md'),
    'limitations': ['Saved imports are FA-02 observations, not a regenerated complete import inventory.',
                    'Hashes compare bytes, not runtime behavior.',
                    'Notice text comparison establishes retention, not legal approval.',
                    'FA-04 aggregate unit receipt suppresses individual passing-suite output; absence of icon failures supports reuse, not a fresh icon run.']
}
(OUT/'evidence.json').write_text(json.dumps(result,indent=2)+'\n')
print(json.dumps({'inputs':len(inputs),'inputChanges':[p for p,v in comparison.items() if v['status']=='changed'],
 'builtFiles':len(built),'builtDeltas':built_delta,'historicalNames':len(old),'implementations':len(implementations),
 'missingHistoricalMappings':unresolved_old,'mapImplementationMismatches':map_mismatches,
 'missingMapDocs':result['implementedButNotInMappingDocumentation'],'missingGallery':result['implementedButNotInGallery'],
 'notices':notices,'barrelImports':len(barrels)},indent=2))
