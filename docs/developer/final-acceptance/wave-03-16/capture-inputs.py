from pathlib import Path
import hashlib, json, subprocess, datetime
root = Path(__file__).resolve().parent
repo = root.parents[3]
def digest(path):
    return hashlib.sha256(path.read_bytes()).hexdigest() if path.is_file() else None
prior = json.loads((repo / 'docs/developer/final-acceptance/parallel-13/input-evidence.json').read_text())
coordinator = json.loads((repo / 'docs/developer/final-acceptance/coordinator-integration/evidence.json').read_text())
paths = {entry['path']: entry['sha256'] for entry in prior['inputs']}
# Add only navigator and exact original native transfer/ordering inputs; no new inventory.
for directory in ['packages/ui/src/components/ExperiencePageNavigator', 'apps/docs/native-fixtures/scenarios/components/ExperiencePageNavigator']:
    for path in (repo / directory).iterdir():
        if path.is_file(): paths.setdefault(str(path.relative_to(repo)), None)
for path in ['packages/ui/tests/browser/acceptance.spec.ts', 'packages/ui/tests/browser/page-navigator-native-transactions.spec.ts', 'packages/ui/tests/browser/hardening-actions-presentation.spec.ts', 'docs/developer/react-aria-host-adapter-acceptance.md', 'docs/developer/react-aria-page-navigation.md']:
    paths.setdefault(path, None)
inputs = []
for path, old in sorted(paths.items()):
    now = digest(repo / path)
    inputs.append({'path': path, 'sha256': now, 'parallel13Sha256': old, 'matchesParallel13': now == old if old else None, 'coordinatorSha256': coordinator['inputHashes'].get(path)})
# Compare only direct outputs for this scope, not a whole-library freshness assertion.
built = []
for prefix in ['packages/ui/dist/adapters', 'packages/ui/dist/experimental/Link', 'packages/ui/dist/experimental/Menu', 'packages/ui/dist/experimental/Breadcrumbs', 'packages/ui/dist/components/SideNavigation', 'packages/ui/dist/components/ExperiencePageNavigator']:
    for path in sorted((repo / prefix).rglob('*')):
        if path.is_file():
            name = str(path.relative_to(repo)); current = digest(path); old = coordinator['builtLibraryHashes'].get(name)
            built.append({'path': name, 'sha256': current, 'coordinatorSha256': old, 'matchesCoordinator': current == old if old else None})
navigator_prior = json.loads((repo / 'docs/developer/final-acceptance/wave-02-01/evidence.json').read_text())
navigator = []
for path in navigator_prior['components']['ExperiencePageNavigator']['runtimeClosure']:
    old = navigator_prior['files'][path]['sha256']; current = digest(repo / path)
    navigator.append({'path': path, 'sha256': current, 'wave0201Sha256': old, 'matchesWave0201': current == old})
navigator_evidence = []
for key in ['unitTests', 'nativeSpecs', 'fixtures']:
    for path in navigator_prior['components']['ExperiencePageNavigator'][key]:
        old = navigator_prior['files'][path]['sha256']; current = digest(repo / path)
        navigator_evidence.append({'path': path, 'sha256': current, 'wave0201Sha256': old, 'matchesWave0201': current == old})
receipts = {p: digest(repo / p) for p in ['docs/developer/final-acceptance/wave-02-15/report.md', 'docs/developer/final-acceptance/wave-02-15/results.json', 'docs/developer/final-acceptance/wave-02-01/report.md', 'docs/developer/final-acceptance/wave-02-01/results.json', 'docs/developer/final-acceptance/parallel-13/report.md', 'docs/developer/final-acceptance/coordinator-integration/evidence.json', 'docs/developer/react-aria-browser-acceptance.md']}
lease = Path('/tmp/sgui-parallel-batch-01-validation.lock/owner')
receipt = {'capturedAt': datetime.datetime.now(datetime.timezone.utc).isoformat(), 'head': subprocess.check_output(['git', 'rev-parse', 'HEAD'], cwd=repo, text=True).strip(), 'branch': subprocess.check_output(['git', 'branch', '--show-current'], cwd=repo, text=True).strip(), 'command': 'python3 docs/developer/final-acceptance/wave-03-16/capture-inputs.py', 'runtime': subprocess.check_output(['node', '--version'], text=True).strip(), 'legacyLeaseOwnerAtCapture': lease.read_text() if lease.is_file() else None, 'inputs': inputs, 'directBuiltOutputs': built, 'navigatorRuntimeClosure': navigator, 'navigatorEvidenceInputs': navigator_evidence, 'retainedReceipts': receipts, 'limits': ['No transitive source/build equivalence assertion.', 'Saved historical browser outcomes remain at their original host/head; unchanged sources alone do not establish current native execution.', 'No shared output or server mutation; no lease acquisition attempted.']}
(root / 'input-receipt.json').write_text(json.dumps(receipt, indent=2) + '\n')
print(json.dumps({'inputs': len(inputs), 'priorCompared': sum(x['matchesParallel13'] is not None for x in inputs), 'priorChanged': [x['path'] for x in inputs if x['matchesParallel13'] is False], 'built': len(built), 'builtChanged': [x['path'] for x in built if x['matchesCoordinator'] is False], 'legacyLeaseOwner': receipt['legacyLeaseOwnerAtCapture'], 'navigatorEvidenceChanged': [x['path'] for x in navigator_evidence if not x['matchesWave0201']], 'navigatorClosureCompared': len(navigator), 'navigatorClosureChanged': [x['path'] for x in navigator if not x['matchesWave0201']]}, indent=2))
