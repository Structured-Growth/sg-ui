from pathlib import Path
import json,hashlib,difflib,subprocess
root=Path.cwd(); own=root/'docs/developer/final-acceptance/wave-03-37'; mirror=own/'proposed-files'
hashfile=lambda p:hashlib.sha256(p.read_bytes()).hexdigest()
patch=[]; inputs={}; proposals={}
for p in sorted(mirror.rglob('*')):
 if not p.is_file():continue
 name=p.relative_to(mirror).as_posix(); old=root/name
 inputs[name]=hashfile(old) if old.exists() else None; proposals[name]=hashfile(p)
 patch.extend(difflib.unified_diff(old.read_text().splitlines(True) if old.exists() else [],p.read_text().splitlines(True),fromfile='a/'+name if old.exists() else '/dev/null',tofile='b/'+name))
(own/'workflow-trust-and-templates.patch').write_text(''.join(patch))
prior=json.loads((root/'docs/developer/final-acceptance/wave-02-12/evidence.json').read_text())['inputs']
receipt=json.loads((own/'input-receipt.json').read_text());receipt['proposalInputSha256']=inputs;receipt['proposalSha256']=proposals;receipt['priorInputComparison']={name:{'priorSha256':prior.get(name,{}).get('sha256'),'currentSha256':value,'equal':prior.get(name,{}).get('sha256')==value} for name,value in inputs.items()}
assignment=json.loads((own/'assignment.json').read_text())
receipt['priorReportIntegrity']={key:{'expected':assignment['priorEvidence']['A-R-20'][key+'Sha256'],'actual':hashfile(root/assignment['priorEvidence']['A-R-20'][key])} for key in ['report','results']}
(own/'input-receipt.json').write_text(json.dumps(receipt,indent=2)+'\n')
check=subprocess.run(['git','apply','--check',str(own/'workflow-trust-and-templates.patch')],capture_output=True,text=True)
(own/'patch-check.txt').write_text(f'git apply --check workflow-trust-and-templates.patch\nexit={check.returncode}\n'+check.stdout+check.stderr)
if check.returncode:raise SystemExit(check.returncode)
