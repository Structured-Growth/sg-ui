import json,pathlib,hashlib,subprocess,datetime
root=pathlib.Path.cwd();out=root/'docs/developer/final-acceptance/wave-04/02/grid-reorder'
sha=lambda b:hashlib.sha256(b).hexdigest()
def ref(p):
 p=pathlib.Path(p);b=p.read_bytes();return {'path':str(p.relative_to(root)) if p.is_relative_to(root) else str(p),'sha256':sha(b),'bytes':len(b)}
head=subprocess.check_output(['git','rev-parse','HEAD'],text=True).strip()
base=pathlib.Path('/Users/thomashall/.codex/visualizations/2026/10/07/01a1164f-41db-7f30-aaf9-f20133b6566f/native-evidence')
runs=[]
for name in ['daily-oct08/daily-browser-pool/730985b1-789c-4f02-ac23-d84f22cc244b/full-011','wave43/pointer-invalidation-pending-engines','wave43/reorder-pending-engines']:
 p=base/name;d=json.loads((p/'results.json').read_text());e=json.loads((p/'evidence.json').read_text());cases=[]
 def walk(n):
  if isinstance(n,dict):
   for t in n.get('tests',[]):cases.append({'title':n.get('title'),'file':n.get('file'),'project':t.get('projectName'),'expectedStatus':t.get('expectedStatus'),'status':t.get('status'),'results':[r.get('status') for r in t.get('results',[])]})
   for v in n.values():walk(v)
  elif isinstance(n,list):
   for v in n:walk(v)
 walk(d['suites']);assert all(c['status']=='expected' and c['results']==['passed'] for c in cases)
 runs.append({'id':name,'results':ref(p/'results.json'),'admission':ref(p/'evidence.json'),'buildDigest':e['buildDigest'],'stats':d['stats'],'cases':cases,'scope':'Historical native execution; no fresh current-head/browser or physical-device claim'})
(out/'retained-native.json').write_text(json.dumps(runs,indent=2)+'\n')
inputs=set()
for pattern in ['packages/ui/src/components/AppDataGridRowDnd/*','packages/ui/src/components/AppDataGrid/*reorder*','packages/ui/src/components/AppDataGrid/*pointer-invalidation*','apps/docs/native-fixtures/scenarios/components/AppDataGridRowDnd/*']:
 inputs.update(str(p) for p in root.glob(pattern) if p.is_file())
inputs.update(['packages/ui/src/components/AppDataGrid/ownedGridInteraction.tsx','packages/ui/tests/browser/reorder.spec.ts','packages/ui/tests/browser/batch01-grid-reorder.spec.ts','packages/ui/tests/browser/inventory-pointer-reorder-invalidation.spec.ts','apps/docs/native-fixtures/scenarios/components/AppDataGrid/AppDataGrid.reorder-invalidation.fixture.tsx'])
prior=json.loads((root/'docs/developer/final-acceptance/wave-04/04/input-evidence.json').read_text())
# Recover prior path->hash values without depending on the receipt's nesting.
priorHashes={}
def walk(n):
 if isinstance(n,dict):
  for k,v in n.items():
   if k.startswith('packages/') or k.startswith('apps/'):
    if isinstance(v,str) and len(v)==64:priorHashes[k]=v
   walk(v)
 elif isinstance(n,list):
  for v in n:walk(v)
walk(prior)
sources=[]
for p in sorted(inputs):
 r=ref(root/p);r['packet04Sha256']=priorHashes.get(p);r['matchesPacket04']=r['sha256']==priorHashes[p] if p in priorHashes else None;sources.append(r)
old=subprocess.check_output(['git','show','1948d0b54688cf61dfa6708fd94cbc8ca6e21990:src/components/AppDataGrid/ownedGridInteraction.tsx'],text=True)
new=(root/'packages/ui/src/components/AppDataGrid/ownedGridInteraction.tsx').read_text()
extract=lambda s:s[s.index('  const canReorder ='):s.index('  const noRows =')]
assert extract(old)==extract(new)
comparison={'head':head,'sources':sources,'reorderPolicyRequestDnDAndFocusBlock':{'testedHead':'1948d0b54688cf61dfa6708fd94cbc8ca6e21990','currentBlockSha256':sha(extract(new).encode()),'byteIdentical':True},'wholeFileLimit':'Other interaction-file changes include public Button/icon imports, width controls/flexible-column sizing and scroll-pane tabIndex. No whole-file or dependency identity claim against 1948d0b5. Current focused units supplement dated native evidence.'}
(out/'source-reconciliation.json').write_text(json.dumps(comparison,indent=2)+'\n')
print(json.dumps({'head':head,'nativeExecutions':sum(len(r['cases']) for r in runs),'sources':len(sources),'matchedPrior':sum(s['matchesPacket04'] is True for s in sources),'changedPrior':[s['path'] for s in sources if s['matchesPacket04'] is False]}))
