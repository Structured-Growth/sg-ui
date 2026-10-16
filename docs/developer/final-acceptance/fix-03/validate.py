"""Bounded documentation/source reconciliation; writes only this directory."""
from pathlib import Path
import hashlib, json, re, datetime
root = Path(__file__).resolve().parents[4]
owned = Path(__file__).resolve().parent
hash_file = lambda p: hashlib.sha256(p.read_bytes()).hexdigest()
composition = root / 'docs/developer/react-aria-css-composition.md'
lint = root / 'docs/developer/react-aria-css-lint.md'
css_path = 'packages/ui/src/experimental/Popover/Popover.module.css'
css = (root / css_path).read_text()
important = re.findall(r'([\w-]+)\s*:\s*([^;{}!]+)\s*!important', css)
assert len(important) == 13, important
text = composition.read_text()
for prop, value in important:
    assert f'{prop}: {value.strip()}' in text, (prop, value)
assert text.count('| narrow auto |') == 4
assert 'C07-doc-composition' in text and 'A-C-07 leaf remain partial' in text
assert 'not yet listed' not in lint.read_text()
assert 'open pending independent review' not in lint.read_text()
links = []
for doc in [composition, lint]:
    for target in re.findall(r'\]\(([^)]+)\)', doc.read_text()):
        if '://' in target or target.startswith('#'): continue
        resolved = doc.parent / target.split('#')[0]
        assert resolved.is_file(), (doc, target)
        links.append({'document': str(doc.relative_to(root)), 'target': target, 'exists': True})
registry = json.loads((root / 'docs/developer/final-acceptance/parallel-11/inspection.json').read_text())
prior = {e['path']: e['sha256'] for e in registry['sourceComparison']['entries']}
paths = [css_path, 'packages/ui/src/experimental/Popover/Popover.tsx',
    'packages/ui/scripts/check-component-css.mjs', 'packages/ui/scripts/check-component-css.test.mjs', 'packages/ui/package.json']
comparisons = []
for path in paths:
    current = hash_file(root / path)
    comparisons.append({'path': path, 'sha256': current, 'parallel11Sha256': prior.get(path), 'unchanged': current == prior[path] if path in prior else None})
# Retain evidence only for the unchanged lint implementation, fixtures and registration.
assert all(e['unchanged'] for e in comparisons if 'Popover/' not in e['path']), comparisons
package = json.loads((root / 'packages/ui/package.json').read_text())
assert 'scripts/check-component-css.test.mjs' in package['scripts']['test:foundations']
transcript = (root / 'docs/developer/final-acceptance/fa04-original-check.txt').read_text()
assert 'ℹ pass 32' in transcript and 'only exact shared rich-document semantic declarations' in transcript
receipt = {'capturedAt': datetime.datetime.now(datetime.timezone.utc).isoformat(),
    'checks': ['13 important declarations individually documented', 'local Markdown file links resolve (fragments not validated)',
        'lint pending wording removed; fixture registration confirmed', 'unchanged lint inputs match parallel-11 retained evidence'],
    'important': [{'property': p, 'value': v.strip()} for p,v in important],
    'links': links, 'inputComparisons': comparisons,
    'limits': 'Static documentation checks only; no test/build/browser/consumer rerun or computed cascade proof.'}
(owned / 'validation.json').write_text(json.dumps(receipt, indent=2) + '\n')
print(json.dumps({'checks': len(receipt['checks']), 'importantDeclarations': len(important), 'links': len(links), 'inputComparisons': comparisons}, indent=2))
