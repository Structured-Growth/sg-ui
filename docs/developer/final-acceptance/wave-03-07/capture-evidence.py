from pathlib import Path
import hashlib,json,subprocess,datetime
root=Path.cwd();own=root/'docs/developer/final-acceptance/wave-03-07'
def sha(p):
 p=Path(p)
 return hashlib.sha256(p.read_bytes()).hexdigest() if p.is_file() else None
assignment=json.loads((own/'assignment.json').read_text()); prior=root/'docs/developer/final-acceptance/wave-02-05'
old=json.loads((prior/'results.json').read_text()); inventory=json.loads((prior/'license-inventory.json').read_text())
rows=[dict(path=r['path'],priorSha256=r['sha256'],currentSha256=sha(root/r['path']),unchanged=sha(root/r['path'])==r['sha256']) for r in old['inputHashes']]
installed=[]
for pkg in inventory['packages']:
 for m in pkg['metadata']:
  for r in [m,*m['evidence']]:
   p=root/'packages/ui'/r['path'];h=sha(p)
   installed.append(dict(path=r['path'],priorSha256=r['sha256'],currentSha256=h,unchanged=h==r['sha256']))
refs={}
for ident,v in assignment['priorEvidence'].items():
 refs[ident]={k:{'path':v[k],'expectedSha256':v[k+'Sha256'],'actualSha256':sha(root/v[k]),'matches':sha(root/v[k])==v[k+'Sha256']} for k in ['report','results']}
coordinator=json.loads((root/'docs/developer/final-acceptance/coordinator-integration/evidence.json').read_text())
evidence=dict(capturedAt=datetime.datetime.now(datetime.timezone.utc).isoformat(),head=subprocess.check_output(['git','rev-parse','HEAD'],text=True).strip(),runtime=subprocess.check_output(['node','--version'],text=True).strip(),platform=subprocess.check_output(['uname','-sm'],text=True).strip(),priorReferences=refs,priorInputComparison=rows,installedEvidenceComparison=installed,installedEvidenceCounts={'compared':len(installed),'unchanged':sum(r['unchanged'] for r in installed)},legalInventoryInputs={p:{'currentSha256':sha(root/p),'priorSha256':h,'unchanged':sha(root/p)==h} for p,h in {'packages/ui/package.json':inventory['inputs']['manifestSha256'],'pnpm-lock.yaml':inventory['inputs']['lockSha256'],'node_modules/.pnpm/lock.yaml':inventory['inputs']['installedLockSha256']}.items()},coordinatorEvidence={'path':'docs/developer/final-acceptance/coordinator-integration/evidence.json','sha256':sha(root/'docs/developer/final-acceptance/coordinator-integration/evidence.json'),'runtime':coordinator['runtime'],'limits':coordinator['limits']},artifactHashes={str(p.relative_to(own)):sha(p) for p in own.rglob('*') if p.is_file() and p.name not in ['input-reconciliation.json','results.json','report.md']})
(own/'input-reconciliation.json').write_text(json.dumps(evidence,indent=2)+'\n')
print(json.dumps({'installedEvidenceCounts':evidence['installedEvidenceCounts'],'priorChangedInputs':[r['path'] for r in rows if not r['unchanged']],'priorReferencesMatch':all(w['matches'] for v in refs.values() for w in v.values()),'legalInputs':evidence['legalInventoryInputs']},indent=2))
