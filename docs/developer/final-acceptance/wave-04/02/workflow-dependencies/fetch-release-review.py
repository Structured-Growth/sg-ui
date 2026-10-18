import json,pathlib,subprocess,hashlib
out=pathlib.Path('docs/developer/final-acceptance/wave-04/02/workflow-dependencies');pins=json.load(open('docs/developer/final-acceptance/wave-03-36/remote/action-pins.json'));result=[]
def get(endpoint,name):
 r=subprocess.run(['gh','api','--method','GET',endpoint],capture_output=True,text=True);p=out/name
 if r.returncode: return {'endpoint':endpoint,'method':'GET','error':r.stderr.strip()[:300],'exit':r.returncode},None
 d=json.loads(r.stdout);p.write_text(json.dumps(d,indent=2)+'\n');return {'endpoint':endpoint,'method':'GET','path':str(p),'sha256':hashlib.sha256(p.read_bytes()).hexdigest()},d
for pin in pins:
 repo=pin['repository'];name=repo.replace('/','-');r,refs=get(f'repos/{repo}/git/matching-refs/tags/{pin["tag"]}',name+'-tag-refs.json');matching=[]
 for ref in refs or []:
  obj=ref['object'];sha=obj['sha']
  if obj['type']=='tag'and ref['ref']=='refs/tags/'+pin['tag']:
   _,tag=get(f'repos/{repo}/git/tags/{sha}',name+'-major-tag-object.json');sha=tag['object']['sha']if tag else sha
  if sha==pin['sha']:matching.append(ref['ref'].removeprefix('refs/tags/'))
 # Exact stable tags from same commit only; never infer identity from package.version.
 exact=[t for t in matching if t!=pin['tag']];release=None
 if exact:
  release,_=get(f'repos/{repo}/releases/tags/{exact[-1]}',name+'-release.json')
 result.append({'repository':repo,'pinnedCommit':pin['sha'],'retainedMajorLabel':pin['tag'],'tagRefs':r,'observedTagsDirectlyResolvingToPinnedCommit':matching,'release':release,'distinction':'Tag observations are current read-only metadata, separate from immutable workflow commit; package.version does not establish action release tag identity'})
(out/'release-review-manifest.json').write_text(json.dumps(result,indent=2)+'\n');print([(x['repository'],x['observedTagsDirectlyResolvingToPinnedCommit'])for x in result])
