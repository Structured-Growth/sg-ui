"""Bounded read-only evidence delta for packaging/workflow acceptance."""
from pathlib import Path
import hashlib, json, re, subprocess
from datetime import datetime, timezone

root = Path(__file__).resolve().parents[4]
out = Path(__file__).resolve().parent
def sha(p):
    f = root / p
    return hashlib.sha256(f.read_bytes()).hexdigest() if f.exists() else None
def load(p):
    return json.loads((root/p).read_text())
fa1 = load('docs/developer/final-acceptance/2026-10-16-inventory.json')
fa2 = load('docs/developer/final-acceptance/2026-10-16-source-inventory.json')
paths = ['AGENTS.md','README.md','docs/migration.md','docs/github-setup.md',
 'docs/troubleshooting/validation.md','docs/developer/react-aria-runtime-ci.md',
 'docs/developer/react-aria-package-acceptance.md','docs/developer/react-aria-server-components.md',
 'docs/developer/react-aria-development-validation.md','docs/developer/react-aria-dependency-upgrades.md',
 'docs/developer/parallel-batch-01/packaging.md','package.json','packages/ui/package.json',
 'pnpm-lock.yaml','pnpm-workspace.yaml','.nvmrc','commitlint.config.mjs',
 '.github/ISSUE_TEMPLATE/ui-change.yml','.github/pull_request_template.md',
 'packages/ui/release.config.mjs','packages/ui/scripts/release-policy.test.mjs',
 'packages/ui/scripts/ai-component-scope.test.mjs','packages/ui/scripts/build.mjs',
 'packages/ui/scripts/css-modules.mjs','packages/ui/scripts/check-package.mjs',
 'packages/ui/scripts/package-consumer.tsx','packages/ui/scripts/test-foundation-consumer.mjs',
 'packages/ui/scripts/test-editor-consumer.mjs','packages/ui/scripts/test-next-consumer.mjs',
 'packages/ui/tsconfig.build.json','packages/ui/playwright.config.ts',
 'packages/ui/src/index.ts','packages/ui/src/primitives/index.ts','packages/ui/src/theme/index.ts',
 'packages/ui/src/experimental/PeriodPicker/PeriodPicker.tsx',
 'packages/ui/src/experimental/DateTimeRangePicker/DateTimeRangePicker.tsx',
 'packages/ui/src/experimental/DateRangeComparisonPicker/DateRangeComparisonPicker.tsx',
 'packages/ui/src/experimental/TextArea/TextArea.tsx',
 'packages/ui/tests/browser/acceptance.spec.ts']
paths += [str(p.relative_to(root)) for p in (root/'.github/workflows').glob('*.yml')]
receipt = {}
for p in paths:
    h = sha(p)
    saved = fa2['inputHashes'].get(p,fa1['sourceHashes'].get(p))
    receipt[p] = {'sha256':h,'savedSha256':saved,
       'delta':'unchanged' if saved == h and h else 'changed' if saved else 'not-in-saved-inventory'}
built_paths = ['dist/index.js','dist/index.d.ts','dist/styles.css',
 'dist/foundation/tokens.generated.js','dist/foundation/ThemeScope.js',
 'dist/experimental/Box/Box.js','dist/experimental/Typography/Typography.js',
 'dist/components/ClassCardFrame/ClassCardFrame.js',
 'dist/components/AppShell/AppShell.js','dist/components/Button/Button.js',
 'dist/experimental/PeriodPicker/PeriodPicker.js',
 'dist/experimental/DateTimeRangePicker/DateTimeRangePicker.js',
 'dist/experimental/DateRangeComparisonPicker/DateRangeComparisonPicker.js',
 'dist/experimental/TextArea/TextArea.js']
outputs={p:{'sha256':sha('packages/ui/'+p),'FA01':fa1['builtHashes'].get(p)} for p in built_paths}
retained = ['fa04-library.txt','fa04-package.txt','fa04-release.txt','fa04-original-check.txt',
 'fa04-fixtures.txt','parallel-01/verification.json','parallel-03/audit-evidence.json',
 'parallel-06/button-breaking-commit.txt','parallel-07/input-receipt.json',
 'parallel-12/evidence.json','parallel-reconciliation-2026-10-16.json']
actions=[]
for p in sorted((root/'.github/workflows').glob('*.yml')):
    for i,line in enumerate(p.read_text().splitlines(),1):
        m=re.search(r'uses:\s*(\S+)',line)
        if m: actions.append({'file':str(p.relative_to(root)),'line':i,'uses':m[1],
                              'commitPinned':bool(re.search(r'@[0-9a-f]{40}$',m[1]))})
pkg=load('packages/ui/package.json')
lock=(root/'pnpm-lock.yaml').read_text()
data={'capturedAt':datetime.now(timezone.utc).isoformat(),
 'head':subprocess.check_output(['git','rev-parse','HEAD'],cwd=root,text=True).strip(),
 'branch':subprocess.check_output(['git','branch','--show-current'],cwd=root,text=True).strip(),
 'host':{'node':subprocess.check_output(['node','--version'],text=True).strip(),
         'scope':'Local read-only analysis and inert VM tests only; Node 26 is not the supported Node 22/24 validation matrix.'},
 'inputs':receipt,'selectedOutputs':outputs,
 'retainedEvidenceHashes':{p:sha('docs/developer/final-acceptance/'+p) for p in retained},
 'newTestReceipt':{'command':'node --test packages/ui/scripts/ai-component-scope.test.mjs',
                  'log':'ai-scope-tests.txt','sha256':sha(str((out/'ai-scope-tests.txt').relative_to(root))),
                  'result':'5 passed, 0 failed; mock file/Git IO and VM execution, no live Actions or credentials.'},
 'workflowActions':actions,
 'lockfileObservations':{'lockfileVersion':lock.splitlines()[0],
    'overridesHeader':bool(re.search(r'^overrides:',lock,re.M)),
    'patchedDependenciesHeader':bool(re.search(r'^patchedDependencies:',lock,re.M)),
    'optionalTrueOccurrences':len(re.findall(r'^\s+optional: true$',lock,re.M)),
    'limits':'Textual corroboration only. Reuses FA-02 installed 586-node/985-edge graph; does not regenerate or certify package-manager provenance.'},
 'publicManifest':{'exports':pkg['exports'],'files':pkg['files'],'sideEffects':pkg['sideEffects'],
    'peers':pkg['peerDependencies'],'publishConfig':pkg['publishConfig']},
 'limits':['No build/install/full test/native/browser/consumer/remote CI/registry/owner setting action.',
           'Selected output equality is not source-output freshness for changed picker/TextArea implementations.',
           'No current artifact availability or publishing identity claim.',
           'No legal review, actual credential isolation or AT result.']}
(out/'evidence.json').write_text(json.dumps(data,indent=2)+'\n')
print(json.dumps({'inputs':len(receipt),'changed':[p for p,v in receipt.items() if v['delta']=='changed'],
 'unsnapshotted':[p for p,v in receipt.items() if v['delta']=='not-in-saved-inventory'],
 'selectedOutputs':len(outputs),'outputDeltas':[p for p,v in outputs.items() if v['sha256']!=v['FA01']],
 'actions':len(actions),'node':data['host']['node']},indent=2))
