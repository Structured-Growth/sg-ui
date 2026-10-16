from pathlib import Path
import hashlib,json,subprocess,datetime,difflib
root=Path.cwd(); own=root/'docs/developer/final-acceptance/wave-03-32'
sha=lambda p: hashlib.sha256(p.read_bytes()).hexdigest()
assignment=json.loads((own/'assignment.json').read_text()); prior={}
for leaf,record in assignment['priorEvidence'].items():
 prior[leaf]={}
 for kind in ['report','results']:
  file=root/record[kind];actual=sha(file);expected=record[kind+'Sha256'];prior[leaf][kind]={'path':record[kind],'sha256':actual,'matchesAssignment':actual==expected}
coordinator=json.loads((root/'docs/developer/final-acceptance/coordinator-integration/evidence.json').read_text())
reconciliation={}
for group in ['inputHashes','builtLibraryHashes','privateFixtureOutputHashes','receiptHashes']:
 values=coordinator.get(group,{})
 if not isinstance(values,dict):continue
 same=0;changed=[];missing=[]
 for p,h in values.items():
  file=root/p if group!='receiptHashes' else root/'docs/developer/final-acceptance/coordinator-integration'/p
  if not file.is_file():missing.append(p)
  elif sha(file)==h:same+=1
  else:changed.append({'path':p,'recordedSha256':h,'currentSha256':sha(file)})
 reconciliation[group]={'compared':len(values),'unchanged':same,'changed':changed,'missing':missing}
paths=['packages/ui/package.json','packages/ui/scripts/test-foundation-consumer.mjs','packages/ui/scripts/test-editor-consumer.mjs','packages/ui/scripts/test-next-consumer.mjs','packages/ui/scripts/package-consumer.tsx','packages/ui/scripts/check-package.mjs','packages/ui/scripts/packed-browser.mjs','packages/ui/dist/styles.css','docs/developer/react-aria-final-acceptance.md','docs/developer/react-aria-runtime-ci.md','/tmp/sgui-calendar-validate.mjs']
inputs={p:sha(Path(p)) for p in paths if Path(p).is_file()}
priorConsumerInputs={}
for priorPath in ['docs/developer/final-acceptance/wave-02-12/evidence.json','docs/developer/final-acceptance/wave-02-10/input-reconciliation.json']:
 saved=json.loads((root/priorPath).read_text())['inputs']
 records=saved.items() if isinstance(saved,dict) else [(r['path'],r) for r in saved]
 for p,record in records:
  if p in paths:
   h=record.get('sha256') if isinstance(record,dict) else record
   priorConsumerInputs.setdefault(priorPath,{})[p]={'recordedSha256':h,'currentSha256':inputs.get(p),'unchanged':h==inputs.get(p)}
patch=[]
for mirror in sorted((own/'proposed-files').rglob('*.mjs')):
 relative=mirror.relative_to(own/'proposed-files');old=root/relative
 before=old.read_text() if old.exists() else ''
 patch.extend(difflib.unified_diff(before.splitlines(True),mirror.read_text().splitlines(True),fromfile='a/'+str(relative) if old.exists() else '/dev/null',tofile='b/'+str(relative)))
(own/'immutable-consumers.patch').write_text(''.join(patch))
result={'capturedAt':datetime.datetime.now(datetime.timezone.utc).isoformat(),'node':subprocess.check_output(['node','--version'],text=True).strip(),'priorEvidence':prior,'coordinatorComparison':reconciliation,'inspectedInputs':inputs,'priorConsumerInputs':priorConsumerInputs,'proposedFiles':{str(p.relative_to(own)):sha(p) for p in (own/'proposed-files').rglob('*') if p.is_file()}}
(own/'inspection.json').write_text(json.dumps(result,indent=2)+'\n')
print(json.dumps({'priorReportsMatch':all(v[k]['matchesAssignment'] for v in prior.values() for k in v),'coordinator':{k:{'compared':v['compared'],'unchanged':v['unchanged'],'changed':len(v['changed']),'missing':len(v['missing'])} for k,v in reconciliation.items()}},indent=2))
