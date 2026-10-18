import json,pathlib,subprocess,hashlib,datetime
out=pathlib.Path('docs/developer/final-acceptance/wave-04/02/workflow-dependencies');pins=json.load(open('docs/developer/final-acceptance/wave-03-36/remote/action-pins.json'));rows=[]
for p in pins:
 repo,sha=p['repository'],p['sha'];endpoint=f'repos/{repo}/contents/package.json?ref={sha}';r=subprocess.run(['gh','api','--method','GET',endpoint],capture_output=True,text=True);name=repo.replace('/','-')+'-package.json';dest=out/name
 if r.returncode==0:
  d=json.loads(r.stdout);dest.write_text(json.dumps(d,indent=2)+'\n');rows.append({'repository':repo,'pinnedCommit':sha,'endpoint':endpoint,'method':'GET','status':'fetched','path':str(dest),'sha256':hashlib.sha256(dest.read_bytes()).hexdigest()})
 else:
  rows.append({'repository':repo,'pinnedCommit':sha,'endpoint':endpoint,'method':'GET','status':'unavailable','exit':r.returncode,'error':r.stderr.strip()[:350]})
(out/'remote-manifest.json').write_text(json.dumps({'capturedAt':datetime.datetime.now(datetime.timezone.utc).isoformat(),'requests':rows,'sourceWasNotExecuted':True},indent=2)+'\n');print('GET results',[(r['repository'],r['status'])for r in rows])
