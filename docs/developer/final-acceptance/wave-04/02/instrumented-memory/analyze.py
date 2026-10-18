import pathlib,json,collections,hashlib,statistics,sys
base=pathlib.Path(__file__).resolve().parent/('memory-02' if len(sys.argv)<2 else sys.argv[1]);measurement=base/'measurement';m=json.loads((measurement/'memory.json').read_text());assert m['status']=='pass';rows=[]
def heap(path):
 o=json.loads(path.read_text());meta=o['snapshot']['meta'];n=o['nodes'];stride=len(meta['node_fields']);types=meta['node_types'][0];strings=o['strings'];groups=collections.Counter();size=collections.Counter();flags=collections.Counter();targets=[]
 for i in range(0,len(n),stride):
  t=types[n[i]];name=strings[n[i+1]];flag=n[i+meta['node_fields'].index('detachedness')];flags[flag]+=1
  if t in ['native','object','closure'] and len(name)<180:groups[t+' / '+name]+=1;size[t+' / '+name]+=n[i+3]
  if flag==2:targets.append(i)
 for targetName in ['blink::MediaQuerySet','PerformanceLongTaskTiming','LayoutShiftAttribution','system / SharedFunctionInfoWrapper']:
  matches=[i for i in range(0,len(n),stride) if types[n[i]]=='native' and strings[n[i+1]]==targetName]
  if matches:targets.append(matches[-1])
 e=o['edges'];ets=meta['edge_types'][0];edgeAt=0;shapes={'fibers':[],'fiberRoots':[],'fixtureRowsWithValues':[]};queryClosureEdges=[]
 for i in range(0,len(n),stride):
  end=edgeAt+n[i+meta['node_fields'].index('edge_count')]*3
  if types[n[i]]=='object':
   props={strings[e[j+1]]:e[j+2] for j in range(edgeAt,end,3) if ets[e[j]]=='property'}
   for label,required in [('fibers',{'return','child','sibling','memoizedProps','memoizedState'}),('fiberRoots',{'current','containerInfo','pendingLanes'}),('fixtureRowsWithValues',{'id','name','count'})]:
    if required<=props.keys() and (label!='fixtureRowsWithValues' or any(strings[n[v+1]]!='system / Hole' for k,v in props.items() if k in required)):
     brief={k:{'id':n[v+2],'type':types[n[v]],'name':strings[n[v+1]][:120]} for k,v in props.items() if k in required|{'stateNode','type'}}
     shapes[label].append({'nodeId':n[i+2],'nodeIndex':i//stride,'className':strings[n[i+1]][:120],'properties':brief})
     if label!='fixtureRowsWithValues':targets.append(i)
  if types[n[i]]=='native' and strings[n[i+1]]=='blink::MediaQuerySet':
   for j in range(edgeAt,end,3):
    dest=e[j+2]
    if ets[e[j]]!='weak' and types[n[dest]]=='closure':queryClosureEdges.append({'queryId':n[i+2],'closureId':n[dest+2],'closureName':strings[n[dest+1]][:120]})
  edgeAt=end
 paths=[]
 if targets:
  # Strong snapshot graph paths only; a path is evidence to inspect, not a leak verdict.
  e=o['edges'];efs=len(meta['edge_fields']);ets=meta['edge_types'][0];starts=[];at=0
  for i in range(0,len(n),stride):starts.append(at);at+=n[i+meta['node_fields'].index('edge_count')]*efs
  wanted=set(targets);seen={0:None};q=collections.deque([0]);links={}
  while q and wanted:
   src=q.popleft()
   if src in wanted:wanted.remove(src)
   start=starts[src//stride];end=start+n[src+meta['node_fields'].index('edge_count')]*efs
   for j in range(start,end,efs):
    typ=ets[e[j]];dest=e[j+2]
    if typ=='weak' or dest in seen:continue
    label=str(e[j+1]) if typ in ['element','hidden'] else strings[e[j+1]][:120]
    seen[dest]=src;links[dest]=(typ,label);q.append(dest)
  for dest in targets[:12]:
   chain=[];cur=dest
   while cur is not None and cur in seen and len(chain)<30:
    chain.append({'nodeId':n[cur+2],'nodeIndex':cur//stride,'type':types[n[cur]],'name':strings[n[cur+1]][:120],'via':links.get(cur)});cur=seen[cur]
   paths.append(list(reversed(chain)))
 return {'sha256':hashlib.sha256(path.read_bytes()).hexdigest(),'bytes':path.stat().st_size,'nodeCount':len(n)//stride,'rawDetachednessCounts':dict(flags),'sampleStrongPathsForReview':paths,'reactOwnerShapeReview':shapes,'directStrongMediaQuerySetClosureEdges':queryClosureEdges,'totalClosureNodes':sum(count for group,count in groups.items() if group.startswith('closure / ')),'trackedObjectCounts':{key:groups[key] for key in ['object / MediaQueryList','native / blink::MediaQuerySet','native / EventListener','native / V8EventListener','native / blink::RegisteredEventListener']}},groups,size
for w in m['workloads']:
 assert len(w['cycles'])==30 and sum(not c['warmup'] for c in w['cycles'])==25
 name=w['renderer']+'-'+w['workload'];warm,gw,sw=heap(measurement/(name+'-warm.heapsnapshot'));final,gf,sf=heap(measurement/(name+'-final.heapsnapshot'))
 stats={}
 for key in ['documents','nodes','jsEventListeners','JSHeapUsedSize','JSHeapTotalSize']:
  a=[c['afterGC'][key] for c in w['cycles'] if not c['warmup']];xs=list(range(len(a)));mean=statistics.mean(a);slope=sum((x-statistics.mean(xs))*(v-mean) for x,v in zip(xs,a))/sum((x-statistics.mean(xs))**2 for x in xs)
  stats[key]={'coldDisposed':w['coldDisposed'][key],'firstRecorded':a[0],'final':a[-1],'min':min(a),'max':max(a),'lastMinusFirst':a[-1]-a[0],'linearSlopePerRecordedCycle':slope}
 oldFiberIds={x['nodeId'] for x in warm['reactOwnerShapeReview']['fibers']+warm['reactOwnerShapeReview']['fiberRoots']};newFiberIds={x['nodeId'] for x in final['reactOwnerShapeReview']['fibers']+final['reactOwnerShapeReview']['fiberRoots']};persistedFiberIds=sorted(oldFiberIds&newFiberIds)
 growth=sorted([(gf[k]-gw[k],k,sf[k]-sw[k]) for k in gf if gf[k]>gw[k]],reverse=True)[:15]
 rows.append({'name':name,'warmup':5,'recorded':25,'portalCovered':w['portalCovered'],'allActiveDisposeAndLaterAssertionsPassed':True,'metrics':stats,'warmSnapshot':warm,'finalSnapshot':final,'warmReactOwnerIdsStillPresentInFinalCandidateShapes':persistedFiberIds,'topPositiveSnapshotGroupDeltas':[{'group':k,'countDelta':count,'selfBytesDelta':size} for count,k,size in growth]})
out={'status':'Measured evidence; no universal threshold or leak/plateau approval','source':'measurement/memory.json','measurementStatus':m['status'],'environment':m['environment'],'workloads':rows,'limits':['Whole-page post-GC counters, not attributed SGUI retained size or process RSS.','Snapshot grouped self-size is not transitive retained size. Positive group deltas need context.','Raw detachedness flags preserved. Strong graph paths sample raw flag2 nodes and media-query/timing records for review, not automatic library blame.','Instrumented Chromium execution cannot establish latency budget, cross-engine plateau or all four parent closures.']};(base/'analysis.json').write_text(json.dumps(out,indent=2)+'\n')
print(json.dumps([{'name':r['name'],'heapDelta':r['metrics']['JSHeapUsedSize']['lastMinusFirst'],'heapSlope':round(r['metrics']['JSHeapUsedSize']['linearSlopePerRecordedCycle'],2),'nodesRange':[r['metrics']['nodes']['min'],r['metrics']['nodes']['max']],'listenersRange':[r['metrics']['jsEventListeners']['min'],r['metrics']['jsEventListeners']['max']],'finalRawDetachedness':r['finalSnapshot']['rawDetachednessCounts']} for r in rows],indent=2))
