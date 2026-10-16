"""Read-only scoped reconciliation; writes only parallel-15/manifest-audit.json."""
import datetime
import hashlib
import json
import pathlib
import subprocess

root = pathlib.Path(__file__).resolve().parents[4]
out = root / 'docs/developer/final-acceptance/parallel-15'
manifest = json.loads((root / 'docs/extraction-manifest.json').read_text())
prior = json.loads((root / 'docs/developer/final-acceptance/2026-10-16-source-inventory.json').read_text())
fixtures = {r['original']: r['fixture'] for r in json.loads((root / 'apps/docs/native-fixtures/migration-manifest.json').read_text())['modules']}
def moved(path):
    return 'packages/ui/' + path if path.startswith('src/') else path
rows = []
for entry in manifest['files']:
    path = moved(entry['destination'])
    exists = (root / path).is_file()
    fixture = fixtures.get(path)
    renamed = path.replace('/AppButton/', '/Button/').replace('/AppButton.', '/Button.') if '/AppButton/' in path else None
    rows.append(dict(source=entry['source'], declaredDestination=entry['destination'], workspaceDestination=path,
                     declaredPresent=entry['present'], exists=exists, presenceMatches=entry['present'] == exists,
                     migration=entry.get('migration'), replacements=[{'path': moved(p), 'exists': (root / moved(p)).is_file()} for p in entry.get('migration', {}).get('replacements', [])],
                     fixture=fixture, fixtureExists=(root / fixture).is_file() if fixture else None,
                     renameCandidate=renamed if renamed and (root / renamed).is_file() else None))
current = sorted(str(p.relative_to(root)) for p in (root / 'packages/ui/src').rglob('*') if p.is_file())
interesting = [p for p in current if any(s in p for s in ['/hooks/', '/utils/', '/lexical/']) or p.endswith('/models.ts') or 'DataGridOptions' in p]
initial = set(interesting + ['docs/extraction-manifest.json', 'apps/docs/native-fixtures/migration-manifest.json', 'docs/migration.md', 'docs/developer/react-aria-hardening-tasks.md', 'docs/developer/react-aria-final-acceptance.md'])
initial.update(p for p in current if any(s in p for s in ['/i18n/', '/DateField/', '/TimeField/', '/DateRangeSelector/']) or 'ownedGridPersistence' in p or 'SideNavigation.tsx' in p or 'PageRichTextEditorSection.impl' in p)
additional = {'README.md', 'AGENTS.md', 'docs/agent-guidance-migration.md', 'docs/developer/docs-fixture-migration.md', 'docs/developer/component-architecture.md', 'docs/developer/react-aria-pagination-state.md', 'docs/developer/react-aria-editor-section.md'}
additional.update(p for p in current if any(s in p for s in ['/Provider/', '/SearchField/', '/AsyncMultiSelect/', '/ImageUploadModal/', '/LinkUrlModal/', '/AppDataGrid/', '/AppDataGridShell/', '/SideNavigation/', '/DateRangePicker/', '/DateRangeComparisonPicker/', '/LearnerClassCard/']) or 'GridPresets' in p or p.endswith('adapters/accounts.tsx') or 'models.remaining-T-boundary' in p)
additional.update(r['fixture'] for r in rows if r['fixture'])
additional.update(r['renameCandidate'] for r in rows if r['renameCandidate'])
paths = initial | additional
hashes = {p: hashlib.sha256((root / p).read_bytes()).hexdigest() for p in sorted(paths)}
data = dict(capturedAt=datetime.datetime.now(datetime.timezone.utc).isoformat(), head=subprocess.check_output(['git', 'rev-parse', 'HEAD'], cwd=root, text=True).strip(), branch=subprocess.check_output(['git', 'branch', '--show-current'], cwd=root, text=True).strip(),
            sourceProvenance={k: manifest[k] for k in ['sourceRepository', 'sourceCommit', 'sourceRoot']}, method='Read-only local existence/SHA256 checks; no tests/builds rerun; no other checkout accessed',
            manifestRows=rows, currentHelperPresetModelEditorInventory=interesting, inputHashes=hashes,
            initialScopeDeltaAgainstFA02=[dict(path=p, previous=prior['inputHashes'].get(p), current=hashes[p]) for p in sorted(initial) if prior['inputHashes'].get(p) != hashes[p]],
            additionalReferenceDeltaAgainstFA02=[dict(path=p, previous=prior['inputHashes'].get(p), current=hashes[p]) for p in sorted(additional - initial) if prior['inputHashes'].get(p) != hashes[p]],
            summary=dict(manifestEntries=len(rows), existingDestinations=sum(r['exists'] for r in rows), presenceMismatches=sum(not r['presenceMatches'] for r in rows), missingDeclaredPresent=sum(r['declaredPresent'] and not r['exists'] for r in rows), nativeMappings=sum(bool(r['fixture']) for r in rows), renameCandidates=sum(bool(r['renameCandidate']) for r in rows), missingNativeFixtures=[r['fixture'] for r in rows if r['fixture'] and not r['fixtureExists']], missingExplicitReplacements=[v for r in rows for v in r['replacements'] if not v['exists']]))
(out / 'manifest-audit.json').write_text(json.dumps(data, indent=2) + '\n')
print(json.dumps(data['summary'], indent=2))
