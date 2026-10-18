"""Fixed read-only endpoints; never prints auth state, tokens, or request headers."""
import json, subprocess, pathlib, datetime, urllib.request, urllib.error
base=pathlib.Path(__file__).resolve().parent
out=base/'remote';out.mkdir(exist_ok=True)
repo='repos/Structured-Growth/sg-ui'
endpoints={
 'repository':repo,
 'main-protection':repo+'/branches/main/protection',
 'main-rules':repo+'/rules/branches/main',
 'rulesets':repo+'/rulesets?includes_parents=true&per_page=100',
 'actions-permissions':repo+'/actions/permissions',
 'workflow-permissions':repo+'/actions/permissions/workflow',
 'tags':repo+'/tags?per_page=100',
 'releases':repo+'/releases?per_page=100',
 'ci-runs':repo+'/actions/workflows/ci.yml/runs?per_page=10',
 'ai-runs':repo+'/actions/workflows/ai-code.yml/runs?per_page=5',
 'release-runs':repo+'/actions/workflows/release.yml/runs?per_page=5',
}
observations=[]
def github(name,endpoint):
 r=subprocess.run(['gh','api','--method','GET',endpoint],capture_output=True,text=True,timeout=45)
 try: data=json.loads(r.stdout)
 except ValueError: data={'message':'No JSON response; authentication/transport status unavailable'}
 path=out/(name+'.json');path.write_text(json.dumps(data,indent=2)+'\n')
 observations.append({'name':name,'endpoint':'https://api.github.com/'+endpoint,'observedAt':datetime.datetime.now(datetime.timezone.utc).isoformat(),'exitCode':r.returncode,'file':str(path.relative_to(base)), 'limit':'GET only; errors/404 do not establish absent protection or authority'})
 return data if r.returncode==0 else {}
for name,endpoint in endpoints.items(): github(name,endpoint)
runs=json.loads((out/'ci-runs.json').read_text()).get('workflow_runs',[])
# Bounded inspection of newest full/partial CI executions; no dispatch/download/build.
for run in runs[:2]:
 for suffix in ['jobs?per_page=100','artifacts?per_page=100']:
  github(str(run['id'])+'-'+suffix.split('?')[0],repo+'/actions/runs/'+str(run['id'])+'/'+suffix)
url='https://registry.npmjs.org/@structured-growth%2fsg-ui'
try:
 with urllib.request.urlopen(url,timeout=30) as r: status=r.status; data=json.load(r)
except urllib.error.HTTPError as e:
 status=e.code
 try: data=json.loads(e.read())
 except ValueError: data={'message':'Non-JSON HTTP error'}
except Exception:
 status=None; data={'message':'Transport failure'}
(out/'npm-package.json').write_text(json.dumps({'httpStatus':status,'body':data},indent=2)+'\n')
observations.append({'name':'npm-package','endpoint':url,'observedAt':datetime.datetime.now(datetime.timezone.utc).isoformat(),'httpStatus':status,'file':'remote/npm-package.json','limit':'Unauthenticated public metadata only; 404 does not prove private package absence or scope availability'})
(out/'index.json').write_text(json.dumps(observations,indent=2)+'\n')
print(json.dumps({'requests':len(observations),'githubErrors':[o['name'] for o in observations if o.get('exitCode',0)],'npmHTTP':status}))
