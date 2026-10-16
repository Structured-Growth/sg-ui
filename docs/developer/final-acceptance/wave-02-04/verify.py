from pathlib import Path
import hashlib,json,re,datetime
own=Path('docs/developer/final-acceptance/wave-02-04')
data=json.loads((own/'results.json').read_text())
expected={f'A-M-{n:02}' for n in range(35,45)}|{f'A-P-{n:02}' for n in range(1,12)}
assert {l['id'] for l in data['leaves']}==expected
assert len(data['leaves'])==21
assert not data['missingReferencesToResolve']
supplement={}
baseline=json.loads(Path('docs/developer/final-acceptance/2026-10-16-source-inventory.json').read_text())['inputHashes']
for l in data['leaves']:
 for key in ['sourceReferences','testReferences']:
  for p in l[key]:
   file=Path(p);assert file.is_file(),p
   if 'wave-02-04/' not in p:
    current=hashlib.sha256(file.read_bytes()).hexdigest()
    supplement[p]={'sha256':current,'baselineSha256':baseline.get(p),'comparison':'same' if current==baseline.get(p) else 'changed-or-new; narrative documentation/current bytes govern'}
for file in own.glob('*.json'):json.loads(file.read_text())
for label,target in re.findall(r'\[([^\]]+)\]\(([^)]+)\)',(own/'report.md').read_text()):
 assert (own/target.split('#')[0]).resolve().is_file(),target
for file in own.iterdir():
 if file.is_file():assert all(line.rstrip()==line for line in file.read_text().splitlines()),file
for l in data['leaves']:
 assert l['status'] in ['complete','partial','blocked']
 if l['status']!='complete':assert l['successorDeliverables']
rec=json.loads((own/'input-evidence.json').read_text())
changedSinceCapture=[]
for r in rec['selectedInputs']:
 if hashlib.sha256(Path(r['path']).read_bytes()).hexdigest()!=r['sha256']:changedSinceCapture.append(r['path'])
assert not changedSinceCapture,changedSinceCapture
v={'capturedAt':datetime.datetime.now(datetime.timezone.utc).isoformat(),'exactAssignedIds':True,'leafRecords':21,
'counts':data['summary'],'sourceAndTestReferencesExist':True,'reportLinksResolve':True,'allJsonParses':True,
'authoredWhitespaceClean':True,'selectedInputsUnchangedSinceCapture':True,
'supplementaryReferenceHashes':supplement,'runtimeTestsRun':False}
(own/'verification.json').write_text(json.dumps(v,indent=2)+'\n')
data['verification']='verification.json'
data['deliveredArtifacts']=['report.md','results.json','migration-index.json','prototype-findings.json','ux-parity-register.json','input-evidence.json','verification.json']
data['artifactHashes']={p.name:hashlib.sha256(p.read_bytes()).hexdigest() for p in own.iterdir() if p.is_file() and p.name!='results.json'}
(own/'results.json').write_text(json.dumps(data,indent=2)+'\n')
print(json.dumps({k:v for k,v in v.items() if k!='supplementaryReferenceHashes'},indent=2))
