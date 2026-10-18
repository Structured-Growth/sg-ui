import pathlib,json,collections,hashlib
p=pathlib.Path(__file__).resolve().parent;d=p/'memory-02/measurement';results=[]
def read(phase):
 h=json.loads(phase.read_text());m=h['snapshot']['meta'];n=h['nodes'];e=h['edges'];s=len(m['node_fields']);ss=h['strings'];types=m['node_types'][0];ets=m['edge_types'][0];totals=collections.Counter();sizes=collections.Counter();groups=collections.Counter();groupSizes=collections.Counter();queries=[];starts={};at=0
 for i in range(0,len(n),s):
  starts[i]=at;at+=n[i+4]*3;t=types[n[i]];name=ss[n[i+1]];totals[t]+=1;sizes[t]+=n[i+3]
  if len(name)<180:groups[t+' / '+name]+=1;groupSizes[t+' / '+name]+=n[i+3]
  if t=='native' and name=='blink::MediaQuerySet':queries.append(i)
 queryStrings=collections.Counter();treeClosures=set();treeTypes=collections.Counter()
 for q in queries:
  seen=set();todo=[q]
  while todo:
   i=todo.pop()
   if i in seen:continue
   seen.add(i);t=types[n[i]];name=ss[n[i+1]];treeTypes[t+' / '+name[:160]]+=1
   if t=='string':queryStrings[name[:200]]+=1;continue
   if t=='closure':treeClosures.add(n[i+2]);continue
   for j in range(starts[i],starts[i]+n[i+4]*3,3):
    if ets[e[j]]!='weak':todo.append(e[j+2])
 return {'nodeTypeCounts':dict(totals),'nodeTypeSelfBytes':dict(sizes),'mediaQuerySets':len(queries),'mediaQuerySetIdsSample':[n[i+2] for i in queries[:3]+queries[-3:]],'queryTreeSerializedJSStrings':dict(queryStrings),'queryTreeReachableClosureIds':sorted(treeClosures),'queryTreeNodeCategories':dict(treeTypes),'pointerCoarseJSStringPresent':any(x=='(pointer: coarse)' for x in ss)},groups,groupSizes
m=json.loads((d/'memory.json').read_text())
for w in m['workloads']:
 name=w['renderer']+'-'+w['workload'];a,g1,s1=read(d/(name+'-warm.heapsnapshot'));b,g2,s2=read(d/(name+'-final.heapsnapshot'));results.append({'name':name,'warm':a,'final':b,'nodeTypeDeltas':{k:{'count':b['nodeTypeCounts'].get(k,0)-a['nodeTypeCounts'].get(k,0),'selfBytes':b['nodeTypeSelfBytes'].get(k,0)-a['nodeTypeSelfBytes'].get(k,0)} for k in set(a['nodeTypeCounts'])|set(b['nodeTypeCounts'])},'largestPositiveNamedSelfByteDeltas':[{'group':k,'countDelta':g2[k]-g1[k],'selfByteDelta':v-s1[k]} for k,v in sorted(s2.items(),key=lambda x:x[1]-s1[x[0]],reverse=True) if v>s1[k]][:18]})
o={'status':'Existing snapshot categorization; allocation stacks/query text not captured for native query entries','method':'Aggregate snapshot self bytes by serialized type/name; walk all strong outgoing edges from every native MediaQuerySet; no new browser execution.','limits':['Snapshot self-byte totals include native allocations and are not an exact reconciliation to CDP JSHeapUsedSize.','Query trees do not encode native C++ query text as JavaScript strings in these captures; presence of a bundle string is not an allocation trace.','Named group deltas and retaining paths cannot alone identify original allocation stacks or prove growth benign/leaking.'],'workloads':results};(p/'memory-02/causal-categories.json').write_text(json.dumps(o,indent=2)+'\n');print(json.dumps([{'name':r['name'],'typeDeltas':r['nodeTypeDeltas'],'queryStrings':r['final']['queryTreeSerializedJSStrings'],'queryTreeClosures':r['final']['queryTreeReachableClosureIds'],'topGroups':r['largestPositiveNamedSelfByteDeltas'][:6]} for r in results],indent=2))
