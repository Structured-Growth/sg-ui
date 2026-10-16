from pathlib import Path
import json,hashlib,datetime
own=Path(__file__).resolve().parent;root=own.parents[3]
def digest(p):return hashlib.sha256(p.read_bytes()).hexdigest() if p.exists() else None
prior={}
for w,file,key in [('wave-02-06','evidence.json','inputs'),('wave-02-07','inspection.json','inputs'),('wave-02-15','input-receipt.json','inputHashes'),('coordinator-integration','evidence.json','inputHashes')]:
 data=json.loads((own.parent/w/file).read_text());prior[w]=data.get(key,{})
 if isinstance(prior[w],list):prior[w]={entry['path']:entry for entry in prior[w]}
coordinator=json.loads((own.parent/'coordinator-integration/evidence.json').read_text())
def oldhash(value):return value.get('sha256') if isinstance(value,dict) else value
selected=set(str(p.relative_to(own/'proposed-files')) for p in (own/'proposed-files').rglob('*') if p.is_file() and (root/p.relative_to(own/'proposed-files')).exists())
selected.update(['packages/ui/src/experimental/Popover/Popover.tsx','packages/ui/src/components/AppDataGridShell/AppDataGridShell.tsx','packages/ui/src/experimental/TextField/TextField.tsx','packages/ui/scripts/css-modules.mjs','packages/ui/scripts/css-modules.test.mjs','packages/ui/package.json','packages/ui/src/components/AppModal/AppModal.tsx','packages/ui/node_modules/react-aria/dist/private/overlays/useOverlayPosition.mjs'])
inputs={}
for p in sorted(selected):
 now=digest(root/p);inputs[p]={'sha256':now,'retainedComparisons':{w:{'sha256':oldhash(v[p]),'matches':oldhash(v[p])==now} for w,v in prior.items() if p in v}}
outputs={}
for p in ['packages/ui/dist/styles.css','packages/ui/browser-docs-static/index.html']:
 now=digest(root/p);base=(coordinator.get('builtLibraryHashes',{})|coordinator.get('privateFixtureOutputHashes',{})).get(p)
 outputs[p]={'sha256':now,'coordinatorSha256':base,'matchesCoordinator':now==base if base else None,'meaning':'Inspected existing output only; candidate changes are unapplied and not built.'}
references={}
for w in ['wave-02-06','wave-02-07','wave-02-15']:
 for f in ['report.md','results.json']:
  p=own.parent/w/f;references[str(p.relative_to(root))]=digest(p)
for f in ['coordinator-integration/evidence.json','wave-02-06/styling-mappings.json','parallel-01/api-snapshot.json','wave-02-15/public-contract-index.json']:
 p=own.parent/f;references[str(p.relative_to(root))]=digest(p)
candidateInputs=json.loads((own/'candidate-input-hashes.json').read_text())
concurrency={p:{'preparedSha256':v['sourceSha256'],'currentSha256':digest(root/p),'unchangedSincePreparation':v['sourceSha256']==digest(root/p)} for p,v in candidateInputs.items()}
artifacts={str(p.relative_to(own)):digest(p) for p in sorted(own.rglob('*')) if p.is_file() and p.name!='integrity.json' and 'patch-check-work' not in p.parts}
data={'capturedAt':datetime.datetime.now(datetime.timezone.utc).isoformat(),'inputs':inputs,'outputs':outputs,'priorReferences':references,'candidateSourceStability':concurrency,'artifacts':artifacts,'limits':['Hashes describe dirty shared snapshot, not committed candidate.','No reuse of existing build as candidate CSS runtime evidence.','Node26 structural/type probes do not add supported Node22/24 matrix evidence.','Fixture declaration resolution exact hashes are in fixture-typecheck.json.']}
(own/'integrity.json').write_text(json.dumps(data,indent=2)+'\n');print(json.dumps({'selectedInputs':len(inputs),'candidateSourcesStable':all(v['unchangedSincePreparation'] for v in concurrency.values()),'retainedInputComparisons':{w:sum(w in v['retainedComparisons'] for v in inputs.values()) for w in prior},'existingOutputs':outputs},indent=2))
