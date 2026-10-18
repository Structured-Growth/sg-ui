import json,pathlib,subprocess,datetime,urllib.request,urllib.error,hashlib
out=pathlib.Path('docs/developer/final-acceptance/wave-04/02/release-marking-safety');rows=[]
for kind,endpoint in [('tags','repos/Structured-Growth/sg-ui/tags?per_page=100'),('releases','repos/Structured-Growth/sg-ui/releases?per_page=100')]:
 r=subprocess.run(['gh','api','--method','GET',endpoint],capture_output=True,text=True);p=out/(kind+'.json')
 if r.returncode==0:p.write_text(json.dumps(json.loads(r.stdout),indent=2)+'\n');rows.append({'kind':kind,'endpoint':endpoint,'method':'GET','status':200,'count':len(json.loads(r.stdout)),'path':str(p),'sha256':hashlib.sha256(p.read_bytes()).hexdigest()})
 else:rows.append({'kind':kind,'endpoint':endpoint,'method':'GET','status':'failed','exit':r.returncode,'error':r.stderr.strip()[:300]})
url='https://registry.npmjs.org/%40structured-growth%2Fsg-ui'
try:
 with urllib.request.urlopen(url,timeout=30)as response:status=response.status;body=response.read()
except urllib.error.HTTPError as e:status=e.code;body=e.read()
p=out/'public-npm.json';p.write_bytes(body);rows.append({'kind':'public npm registry','url':url,'method':'GET','status':status,'path':str(p),'sha256':hashlib.sha256(body).hexdigest(),'scope':'Unauthenticated public observation only; cannot establish private/deleted/disagreeing publication history or release authority'})
(out/'history-receipt.json').write_text(json.dumps({'capturedAt':datetime.datetime.now(datetime.timezone.utc).isoformat(),'observations':rows,'writes':False,'publicationDecision':'No promotion/publication authorized; subsequent release decision remains conditional on authoritative history and exact approved candidate'},indent=2)+'\n');print([(r['kind'],r['status'],r.get('count'))for r in rows])
