import pathlib,json,collections
p=pathlib.Path(__file__).resolve().parent;d=p/'memory-02/measurement';out=[]
for name in ['processing-small','catalog-wide','processing-selector']:
 warm=json.loads((d/(name+'-warm.heapsnapshot')).read_text());s=len(warm['snapshot']['meta']['node_fields']);old=set(warm['nodes'][2::s]);h=json.loads((d/(name+'-final.heapsnapshot')).read_text());m=h['snapshot']['meta'];n=h['nodes'];e=h['edges'];strings=h['strings'];types=m['node_types'][0];ets=m['edge_types'][0];starts={};at=0;targets=[]
 for i in range(0,len(n),s):
  starts[i]=at;at+=n[i+4]*3
  if n[i+2] not in old and types[n[i]]=='code' and strings[n[i+1]]=='system / InstructionStream':targets.append(i)
 targets=sorted(targets,key=lambda i:n[i+3],reverse=True)[:5];wanted=set(targets);q=collections.deque([0]);parents={0:None};links={}
 while q and wanted:
  src=q.popleft();wanted.discard(src)
  for j in range(starts[src],starts[src]+n[src+4]*3,3):
   typ=ets[e[j]];dest=e[j+2]
   if typ=='weak' or dest in parents:continue
   label=str(e[j+1]) if typ in ['element','hidden'] else strings[e[j+1]][:100];parents[dest]=src;links[dest]=[typ,label];q.append(dest)
 paths=[]
 for dest in targets:
  chain=[];cur=dest
  while cur is not None and cur in parents and len(chain)<35:
   chain.append({'nodeId':n[cur+2],'type':types[n[cur]],'name':strings[n[cur+1]][:140],'selfBytes':n[cur+3],'via':links.get(cur)});cur=parents[cur]
  paths.append(list(reversed(chain)))
 out.append({'name':name,'method':'Largest5new final InstructionStream nodes by self size, IDs absent in warm; shortest strong roots excluding weak edges. Retainer paths are not allocation stacks.','paths':paths})
(p/'memory-02/code-retaining-paths.json').write_text(json.dumps(out,indent=2)+'\n');print(json.dumps([{'name':r['name'],'paths':[' → '.join(x['name'] for x in c) for c in r['paths']]} for r in out],indent=2))
