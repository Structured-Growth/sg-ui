from pathlib import Path
import json,hashlib,math,subprocess
out=Path(__file__).resolve().parent;root=out.parents[3]
policy=json.loads((out/'budget-policy.json').read_text());packets=[];baseline=[];latency={};assets=None;environment=None;fixture=None;viewport=None
for session in [1,2]:
 for renderer in ['processing','catalog']:
  p=out/f'session-{session}-{renderer}.json';x=json.loads(p.read_text());assert x['iterations']==12 and x['sourceHead']=='7cf2db63f492ebcb143d2347c5c599d0f05bab27'
  env={k:x['environment'][k] for k in ['cpu','totalMemoryBytes','browser','throttlePolicy','cpuThrottleRate','react','os','release','arch']}
  if environment is None:environment,fixture,viewport,assets=env,x['fixtureHashes'],x['viewport'],x['assets']
  else:assert (environment,fixture,viewport,assets)==(env,x['fixtureHashes'],x['viewport'],x['assets'])
  baseline.append({'file':p.name,'sha256':hashlib.sha256(p.read_bytes()).hexdigest(),'head':x['sourceHead']})
  for workload in x['selectedWorkloads']:
   target=latency.setdefault(renderer+':'+workload,{})
   for key,value in x['summaries'].items():
    if key.startswith(workload+':'):
     limits=target.setdefault(key,{'medianMs':0,'p95Ms':0})
     for metric in limits:limits[metric]=max(limits[metric],math.ceil(value[metric]*1.25/10)*10)
assert len(latency)==7
memory=json.loads((out/'memory.json').read_text());assert memory['status']=='pass'
for name,asset in assets.items():assert memory['assets']['assets/'+name]==asset['sha256'],'Memory/latency fixture asset mismatch'
bundle={ext:math.ceil(sum(value['gzipLevel9Bytes'] for name,value in assets.items() if name.endswith('.'+ext))*1.1/1024)*1024 for ext in ['js','css']}
budget={'schemaVersion':1,'sourceHead':'7cf2db63f492ebcb143d2347c5c599d0f05bab27','authority':'Owner-delegated profile and budget selection on 2026-10-21','environment':environment,'viewport':viewport,'fixtureHashes':fixture,'memoryInputs':memory['inputs'],'memoryReference':{'file':'memory.json','sha256':hashlib.sha256((out/'memory.json').read_bytes()).hexdigest(),'assetJoin':'Every latency asset SHA-256 matches the frozen memory fixture inventory','libraryOutput':memory['libraryOutput']},'latency':latency,'bundleGzipBytes':bundle,'memory':{key:policy['memory'][key] for key in ['heapGrowthBytes','listenerGrowth','nodeGrowth']},'baselines':baseline,'policy':policy,'limits':['Regression ceilings for this explicitly recorded reference profile; not universal UX/INP/physical-paint or hardware-percentile claims.','25-cycle whole-page post-GC growth limit is not a zero-growth/perpetual plateau claim.']}
p=out/'reference-budgets.json';assert not p.exists();p.write_text(json.dumps(budget,indent=2)+'\n')
for session in [1,2]:
 with (out/f'verification-session-{session}.json').open('x') as sink:
  subprocess.run(['node',str(root/'packages/ui/tests/performance/check-reference-budgets.mjs'),str(p),str(out/'memory.json'),str(out/f'session-{session}-processing.json'),str(out/f'session-{session}-catalog.json')],cwd=root,stdout=sink,check=True)
print('Both full reference sessions pass the frozen budgets and lifecycle requirements.')
