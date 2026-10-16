"""Bounded documentation checks; writes only this fix's validation receipt."""
import hashlib
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[4]
OUT = Path(__file__).resolve().parent
GUIDE = ROOT / 'docs/developer/react-aria-dependency-upgrades.md'
text = GUIDE.read_text()
checks = []
def check(name, condition):
    assert condition, name
    checks.append({'name': name, 'result': 'pass'})
def load(path):
    return json.loads((ROOT / path).read_text())
def digest(path):
    return hashlib.sha256((ROOT / path).read_bytes()).hexdigest()

ui = load('packages/ui/package.json')
root = load('package.json')
docs = load('apps/docs/package.json')
lock = (ROOT / 'pnpm-lock.yaml').read_text()
ui_lock = lock.split('\n  packages/ui:\n', 1)[1].split('\npackages:', 1)[0]
versions = {'react-aria-components': '1.21.1', 'react-aria': '3.52.1',
            'react-stately': '3.50.0', '@internationalized/date': '3.12.4'}
for name, version in versions.items():
    check(f'{name}: exact runtime placement/version', ui['dependencies'][name] == version
          and name not in ui['peerDependencies'] and name not in ui['devDependencies']
          and f'{name} {version}' in text)
    check(f'{name}: importer lock resolution', bool(re.search(
        r"(?m)^      '?" + re.escape(name) + r"'?:\n        specifier: "
        + re.escape(version) + r'\n        version: ' + re.escape(version) + r'(?:\(|\n)', ui_lock)))
check('only React peers and matching development inputs',
      ui['peerDependencies'] == {'react': '^18.3.1 || ^19.0.0', 'react-dom': '^18.3.1 || ^19.0.0'}
      and all(ui['devDependencies'][name] == '19.2.3' for name in ['react','react-dom']))
check('development-only CSS compilation', all(name in ui['devDependencies'] and name not in ui['dependencies']
      for name in ['postcss','postcss-modules']))
check('private docs Next placement', docs['private'] and docs['dependencies']['next'] == '16.4.0'
      and 'next' not in ui['dependencies'] and 'next' not in ui['peerDependencies'])
for script in ['build:browser-docs','test:browser','build:docs']:
    check(f'root {script} exists', script in root['scripts'])
check('root native commands forward to library', all('@structured-growth/sg-ui' in root['scripts'][name]
      for name in ['build:browser-docs','test:browser']))
check('fresh build before native fixture generation', ui['scripts']['build:browser-docs'] == 'pnpm build && node scripts/build-browser-docs.mjs')
check('browser selection forwards to Playwright', ui['scripts']['test:browser'].endswith('&& playwright test'))
for path in ['packages/ui/scripts/build-browser-docs.mjs','packages/ui/scripts/serve-browser-docs.mjs',
             'packages/ui/scripts/test-foundation-consumer.mjs','packages/ui/scripts/test-editor-consumer.mjs',
             'packages/ui/scripts/test-next-consumer.mjs','packages/ui/tests/browser/reorder.spec.ts',
             'apps/docs/native-fixtures/tsconfig.json','apps/docs/native-fixtures/vite.config.ts']:
    check(f'workflow path: {path}', (ROOT/path).is_file())
config = (ROOT/'packages/ui/playwright.config.ts').read_text()
check('configured static host and engines', 'scripts/serve-browser-docs.mjs' in config
      and all(f"name: '{engine}'" in config for engine in ['chromium','firefox','webkit']))
ci = (ROOT/'.github/workflows/ci.yml').read_text()
check('CI native host/runtime/cwd commands', all(value in ci for value in
      ['working-directory: packages/ui', "node: ['22.12.0', '24']", 'pnpm build:browser-docs', 'pnpm test:browser',
       'pnpm check:docs', 'pnpm build:docs', 'test:e2e']))
check('no retired branch or active Storybook instructions', 'codex/dev' not in text
      and 'stories' not in text and text.count('Storybook') == 1
      and 'Storybook runtime, dependencies and original story files have been removed.' in text)
links = re.findall(r'\[[^\]]+\]\(([^)]+)\)',text)
for link in links:
    path, _, anchor = link.partition('#')
    target = (GUIDE.parent / path).resolve()
    check(f'local link: {link}', target.exists())
    if anchor:
        headings = re.findall(r'^#+ (.+)$', target.read_text(), re.M)
        slugs = [re.sub(r'[^\w\- ]','',h.lower()).replace(' ','-') for h in headings]
        check(f'heading anchor: {anchor}', anchor in slugs)
prior = load('docs/developer/final-acceptance/parallel-07/input-receipt.json')
prior_hashes = load('docs/developer/final-acceptance/2026-10-16-source-inventory.json')['inputHashes']
prior_hashes.update({row['file']:row['sha256'] for row in prior['inputs']})
reused = ['package.json','packages/ui/package.json','apps/docs/package.json','pnpm-lock.yaml']
for path in reused:
    check(f'manifest/lock unchanged from retained FA-02/parallel-07: {path}', digest(path) == prior_hashes[path])
inputs = reused + ['AGENTS.md','.github/workflows/ci.yml','packages/ui/playwright.config.ts',
         'packages/ui/scripts/build-browser-docs.mjs','docs/developer/react-aria-development-validation.md',
         'docs/developer/final-acceptance/parallel-07/report.md',
         'docs/developer/final-acceptance/parallel-07/input-receipt.json',
         'docs/developer/final-acceptance/2026-10-16-source-inventory.json']
receipt = {'checks': checks, 'passed':len(checks),'linksChecked':len(links),
           'inputHashes':{path:digest(path) for path in inputs},
           'guideHash': digest(str(GUIDE.relative_to(ROOT))),
           'limits':['Text/configuration checks only; no installs, live topology, upgrades, registry, runtime/browser/consumer or remote CI execution.']}
(OUT/'validation.json').write_text(json.dumps(receipt,indent=2)+'\n')
print(f'PASS: {len(checks)} bounded documentation/configuration checks; {len(links)} local links.')
