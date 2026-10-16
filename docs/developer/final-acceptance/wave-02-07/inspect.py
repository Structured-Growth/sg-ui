from pathlib import Path
import json,hashlib,re,subprocess,gzip,posixpath
from datetime import datetime,timezone
ROOT=Path(__file__).resolve().parents[4]; OUT=Path(__file__).resolve().parent
fa02=json.loads((ROOT/'docs/developer/final-acceptance/2026-10-16-source-inventory.json').read_text())
fa01=json.loads((ROOT/'docs/developer/final-acceptance/2026-10-16-inventory.json').read_text())
p11=json.loads((ROOT/'docs/developer/final-acceptance/parallel-11/inspection.json').read_text())
expected=dict(fa02['inputHashes'])
for row in json.loads((ROOT/'docs/developer/final-acceptance/fa04-library-input-delta.json').read_text())['changes']:expected[row['file']]=row['after']
def sha(p):
 p=ROOT/p
 return hashlib.sha256(p.read_bytes()).hexdigest() if p.is_file() else None
def record(p):
 h=sha(p);prev=expected.get(p)
 return {'path':p,'sha256':h,'fa02AfterFA04':prev,'same':h==prev if prev else None}
csspaths=[e['path'] for e in p11['sourceComparison']['entries'] if e['path'].endswith('.css')]
# Reuse the dated module path inventory; analyze only the new feature/risk questions.
features={key:[] for key in ['colorFunctions','supports','limitedFeatures','focusSuppression','focusIndicators','motion','layers','sticky','hasSelectors','hoverOnlyCandidates']}
patterns={'colorFunctions':r'color-mix\(|oklch\(|oklab\(','supports':r'@supports','limitedFeatures':r'anchor-name|position-anchor|anchor\(|@container\s+style\(|view-transition|transition-behavior|@starting-style','focusSuppression':r'outline:\s*(?:none|0)(?:;|\s*})','focusIndicators':r':focus-visible|\[data-focus-visible\]|\[data-focused\]','motion':r'\b(?:transition|animation)(?:-[\w-]+)?\s*:|prefers-reduced-motion','layers':r'z-index:','sticky':r'position:\s*sticky','hasSelectors':r':has\(','hoverOnlyCandidates':r':hover|\[data-hovered\]|opacity:\s*0(?:;|\s*})|visibility:\s*hidden|display:\s*none'}
for p in csspaths:
 text=(ROOT/p).read_text()
 for i,line in enumerate(text.splitlines(),1):
  for feature,pattern in patterns.items():
   if re.search(pattern,line,re.I):features[feature].append({'path':p,'line':i,'text':line.strip()})
extra='''AGENTS.md
README.md
docs/developer/react-aria-hardening-tasks.md
docs/developer/react-aria-final-acceptance.md
docs/developer/react-aria-architecture.md
docs/developer/react-aria-performance.md
docs/developer/react-aria-proof-controls.md
docs/developer/react-aria-package-acceptance.md
docs/developer/react-aria-browser-acceptance.md
docs/developer/migration-baseline/proof-measurements.json
docs/developer/parallel-batch-105/acceptance-evidence.md
packages/ui/src/foundation/tokens.json
packages/ui/src/foundation/ThemeScope.tsx
packages/ui/scripts/tokens.mjs
packages/ui/scripts/tokens.test.mjs
packages/ui/scripts/build.mjs
packages/ui/scripts/css-modules.mjs
packages/ui/scripts/check-package.mjs
packages/ui/scripts/test-foundation-consumer.mjs
packages/ui/scripts/test-editor-consumer.mjs
packages/ui/scripts/measure-migration-proofs.mjs
packages/ui/src/experimental/Dialog/Dialog.tsx
packages/ui/src/experimental/Dialog/Dialog.test.tsx
packages/ui/src/experimental/Popover/Popover.tsx
packages/ui/src/experimental/Tooltip/Tooltip.tsx
packages/ui/src/experimental/Tooltip/Tooltip.test.tsx
packages/ui/src/experimental/Collapse/Collapse.tsx
packages/ui/src/components/IconPanelNavigation/IconPanelNavigation.tsx
packages/ui/src/components/IconPanelNavigation/IconPanelNavigation.test.tsx
packages/ui/src/components/SideNavigation/SideNavigation.tsx
packages/ui/src/components/AppDataGridShell/AppDataGridShell.tsx
packages/ui/src/components/PageRichTextEditorSection/DocumentContentEditable.tsx
packages/ui/src/components/PageRichTextEditorSection/DocumentContentEditable.test.tsx
packages/ui/src/components/FloatingTextSelectionToolbar/FloatingTextSelectionToolbar.tsx
packages/ui/src/experimental/DateRangeSelector/RangeGestures.tsx
packages/ui/src/experimental/DateRangeSelector/RangeGestures.test.tsx
packages/ui/tests/browser/acceptance.spec.ts
packages/ui/tests/browser/display-preferences.spec.ts
packages/ui/tests/browser/inventory-modal-boundaries.spec.ts
packages/ui/tests/browser/batch05-portal-direction.spec.ts
packages/ui/tests/browser/editor-focus-presentation.spec.ts
packages/ui/tests/browser/reorder.spec.ts
packages/ui/tests/browser/token-tier-scope.spec.ts
packages/ui/package.json
package.json
pnpm-lock.yaml'''.splitlines()
# SSR benchmark source closure, resolved through saved graph, no re-inventory.
imports={}
for r in fa02['imports']:imports.setdefault(r['file'],[]).append(r['specifier'])
roots=['packages/ui/src/components/Button/Button.tsx']+[f'packages/ui/src/experimental/{n}/{n}.tsx' for n in ['Provider','TextField','AsyncMultiSelect','DataGrid','DateRangeSelector']]
closure=set();unresolved=[]
def visit(p):
 if p in closure:return
 closure.add(p)
 for spec in imports.get(p,[]):
  if not spec.startswith('.'):continue
  b=posixpath.normpath(posixpath.join(posixpath.dirname(p),spec))
  options=[b]+[b+e for e in ['.tsx','.ts','.css','.json','/index.tsx','/index.ts']]
  target=next((x for x in options if x in expected),None)
  if target:visit(target)
  else:unresolved.append({'file':p,'specifier':spec})
for p in roots:visit(p)
outputpaths=[]
for p in sorted(closure):
 if p.endswith(('.ts','.tsx')):
  b=re.sub(r'\.tsx?$','',p.replace('packages/ui/src/','dist/'))
  outputpaths.extend([b+'.js',b+'.d.ts'])
 elif p.endswith('.module.css'):outputpaths.append(p.replace('packages/ui/src/','dist/')+'.js')
outputpaths.append('dist/styles.css')
outputs=[{'path':'packages/ui/'+p,'sha256':sha('packages/ui/'+p),'fa01':fa01['builtHashes'].get(p),'same':sha('packages/ui/'+p)==fa01['builtHashes'].get(p)} for p in outputpaths]
asset=(ROOT/'packages/ui/dist/styles.css').read_bytes()
concurrent=[record('packages/ui/src/experimental/'+p+'/'+p+'.tsx') for p in ['PeriodPicker','DateTimeRangePicker','DateRangeComparisonPicker','TextArea']]
tokens=json.loads((ROOT/'packages/ui/src/foundation/tokens.json').read_text())
def resolve(group,key):
 value=tokens[group][key]['$value'];alias=re.fullmatch(r'\{([^}]+)\}',str(value))
 return resolve(*alias[1].split('.')) if alias else value
result={'capturedAt':datetime.now(timezone.utc).isoformat(),'head':subprocess.check_output(['git','rev-parse','HEAD'],cwd=ROOT,text=True).strip(),'branch':subprocess.check_output(['git','branch','--show-current'],cwd=ROOT,text=True).strip(),'method':'Scoped feature analysis over prior parallel-11 CSS paths and source hash reconciliation against retained FA-02/04; SSR closure uses saved imports. No full inventory, build, native or consumer suite.','inputs':[record(p) for p in sorted(set(csspaths+extra)|closure)],'cssFeatures':features,'cssPathCount':len(csspaths),'ssrClosure':{'roots':roots,'count':len(closure),'unresolved':unresolved,'paths':sorted(closure),'outputs':outputs},'stylesheetArtifact':{'path':'packages/ui/dist/styles.css','sha256':sha('packages/ui/dist/styles.css'),'bytes':len(asset),'gzipDefaultBytes':len(gzip.compress(asset,mtime=0)),'gzipMethod':'Python gzip.compress default level 9, mtime=0; not equivalent to historical Node gzip default level. Not consumer transfer measurement.'},'resolvedTokens':{key:resolve('shared',key) for key in ['motionDuration','overlayLayer','popoverLayer']},'concurrentComponents':concurrent,'concurrentComponentsInSSRClosure':[p['path'] for p in concurrent if p['path'] in closure],'limits':['Feature matches are textual candidates, not grammar conformance or computed style evidence.','Prior native/consumer reports retain their recorded heads; no current native/AT/device/CSP/consumer execution is inferred.','Current dist is not assumed to represent the four concurrently repaired components.','No registry, remote CI, security or legal approval queried.']}
(OUT/'inspection.json').write_text(json.dumps(result,indent=2)+'\n')
print(json.dumps({'inputs':len(result['inputs']),'differences':[x['path'] for x in result['inputs'] if x['same'] is False],'cssFeatureCounts':{k:len(v) for k,v in features.items()},'ssrSourceClosure':len(closure),'ssrChangedSources':[p for p in closure if sha(p)!=expected[p]],'ssrChangedOutputs':[x['path'] for x in outputs if not x['same']],'concurrentInSSR':result['concurrentComponentsInSSRClosure'],'stylesheet':result['stylesheetArtifact'],'tokens':result['resolvedTokens']},indent=2))
