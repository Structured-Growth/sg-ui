import pathlib,json,subprocess,hashlib
out=pathlib.Path('docs/developer/final-acceptance/wave-04/02/workflow-dependencies');pins=json.load(open('docs/developer/final-acceptance/wave-03-36/remote/action-pins.json'));rows=[]
def get(endpoint,file):
 r=subprocess.run(['gh','api','--method','GET',endpoint],capture_output=True,text=True);entry={'endpoint':endpoint,'method':'GET','exit':r.returncode}
 if r.returncode:entry['error']=r.stderr.strip()[:300];return entry,None
 p=out/file;d=json.loads(r.stdout);p.write_text(json.dumps(d,indent=2)+'\n');entry.update(path=str(p),sha256=hashlib.sha256(p.read_bytes()).hexdigest());return entry,d
for name in ['pnpm/action-setup','openai/codex-action']:
 pin=next(p for p in pins if p['repository']==name);prefix=name.replace('/','-');refs=json.load(open(out/(prefix+'-tag-refs.json')));matches=[];objects=[]
 for ref in refs:
  if ref['object']['type']!='tag'or ref['ref']=='refs/tags/'+pin['tag']:continue
  tag=ref['ref'].removeprefix('refs/tags/');entry,obj=get(f'repos/{name}/git/tags/{ref["object"]["sha"]}',prefix+'-'+tag+'-tag-object.json');objects.append(entry)
  if obj and obj['object']['type']=='commit'and obj['object']['sha']==pin['sha']:matches.append(tag)
 release=None
 if matches:release,_=get(f'repos/{name}/releases/tags/{matches[-1]}',prefix+'-release.json')
 rows.append({'repository':name,'pinnedCommit':pin['sha'],'annotatedTagsResolvingToPinnedCommit':matches,'tagObjectReceipts':objects,'release':release})
# Composite action's nested setup-node dependency is independently pinned too.
sha='53b83947a5a98c8d113130e565377fae1a50d02f';commit,_=get('repos/actions/setup-node/git/commits/'+sha,'codex-nested-setup-node-commit.json');meta,_=get('repos/actions/setup-node/contents/action.yml?ref='+sha,'codex-nested-setup-node-action.json');rows.append({'context':'openai/codex-action nested dependency','repository':'actions/setup-node','pinnedCommit':sha,'commitReceipt':commit,'metadataReceipt':meta})
(out/'annotated-and-nested-review.json').write_text(json.dumps(rows,indent=2)+'\n');print([(r.get('repository'),r.get('annotatedTagsResolvingToPinnedCommit'))for r in rows])
