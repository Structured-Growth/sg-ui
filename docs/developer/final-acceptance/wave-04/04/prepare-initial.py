from pathlib import Path
import difflib
root=Path.cwd(); out=root/'docs/developer/final-acceptance/wave-04/04'; base=Path('packages/ui/tests/performance')
def write(name,text):
 p=out/'proposed-files'/base/name;p.parent.mkdir(parents=True,exist_ok=True);p.write_text(text)
f=(root/base/'fixture.tsx').read_text()
f=f.replace("import '@structured-growth/sg-ui/styles.css';", "import {AppDataGrid} from '@structured-growth/sg-ui';\nimport {TextField} from '@structured-growth/sg-ui/experimental';\nimport '@structured-growth/sg-ui/styles.css';")
f=f.replace("const started=performance.now();", "const renderer=params.get('renderer')??'processing';\nif(!['processing','catalog'].includes(renderer)||renderer==='catalog'&&workload==='selector')throw Error('Unsupported renderer/workload');\nconst started=performance.now();")
f=f.replace("const [running,setRunning]=useState(false);", "const [running,setRunning]=useState(false);\n  const [revision,setRevision]=useState(0);\n  const catalogColumns=useMemo(()=>columns.map(column=>({field:column.id,headerName:column.label,getCellValue:column.getValue,sortable:true})),[columns]);")
f=f.replace("const pending=useRef<{action:string;start:number}|null>({action:'initial',start:started});", "const pending=useRef<Array<{action:string;start:number;duringUpdates:boolean}>>([{action:'initial',start:started,duringUpdates:false}]);")
f=f.replace("type Sample={action:string;ms:number};", "type Sample={action:string;ms:number;duringUpdates:boolean};")
f=f.replace("pending.current={action,start:performance.now()};", "pending.current.push({action,start:performance.now(),duringUpdates:window.sguiPerf.updating});")
f=f.replace("const sample=pending.current;if(!sample)return;pending.current=null;", "const samples=pending.current.splice(0);if(!samples.length)return;")
f=f.replace("window.sguiPerf.samples.push({action:sample.action,ms:performance.now()-sample.start});", "for(const sample of samples)window.sguiPerf.samples.push({action:sample.action,ms:performance.now()-sample.start,duringUpdates:sample.duringUpdates});")
f=f.replace("[rows,state,query,selected]);", "[rows,state,query,selected,revision]);")
f=f.replace(":<DataGrid label=", ":renderer==='catalog'?<><TextField type=\"search\" label=\"Search\" value={query} onValueChange={setQuery}/><AppDataGrid label=\"Courses\" rows={rows} columns={catalogColumns} getRowId={row=>row.id} getRowLabel={row=>row.name} searchValue={query} defaultPaginationModel={{page:0,pageSize}} pageSizeOptions={[50,200]} onStateChange={()=>setRevision(value=>value+1)}/></>\n      :<DataGrid label=")
f=f.replace("updating:boolean;unmount:()=>void", "updating:boolean;lifecycle:{mounted:boolean;pendingFrames:number;activeTimers:number};unmount:()=>void")
f=f.replace("ready:false,updating:false,unmount:", "ready:false,updating:false,lifecycle:{mounted:false,pendingFrames:0,activeTimers:0},unmount:")
f=f.replace("const frames=useRef(new Set<number>());", "const frames=useRef(new Set<number>());\n  const timers=useRef(new Set<ReturnType<typeof setInterval>>());\n  const mounted=useRef(false);\n  useLayoutEffect(()=>{mounted.current=true;window.sguiPerf.lifecycle={get mounted(){return mounted.current;},get pendingFrames(){return frames.current.size;},get activeTimers(){return timers.current.size;}};return()=>{mounted.current=false;};},[]);")
f=f.replace("if(++tick===50){clearInterval(timer);", "if(++tick===50){clearInterval(timer);timers.current.delete(timer);")
f=f.replace("return()=>{clearInterval(timer);window.sguiPerf.updating=false;};", "timers.current.add(timer);\n    return()=>{clearInterval(timer);timers.current.delete(timer);window.sguiPerf.updating=false;};")
write('fixture.tsx',f)
v=(root/base/'vite.config.mjs').read_text().replace("{find:'@structured-growth/sg-ui/experimental',replacement:at('../../dist/experimental/index.js')},", "{find:'@structured-growth/sg-ui/experimental',replacement:at('../../dist/experimental/index.js')},\n  {find:'@structured-growth/sg-ui',replacement:at('../../dist/index.js')},")
write('vite.config.mjs',v)
s=(root/base/'measure-browser.mjs').read_text()
s=s.replace("const browser=await chromium.launch();const results=[];", "const renderer=process.argv[3]??'processing';assert.ok(['processing','catalog'].includes(renderer));\nconst sourceHead=process.env.SGUI_PERF_SOURCE_HEAD;assert.match(sourceHead??'',/^[a-f0-9]{40}$/,'Set SGUI_PERF_SOURCE_HEAD to the immutable measured source commit');\nconst fixtureHashes={};for(const name of ['fixture.tsx','measure-browser.mjs','vite.config.mjs','index.html'])fixtureHashes[name]=createHash('sha256').update(await readFile(here+'/'+name)).digest('hex');\nconst browser=await chromium.launch();const results=[];")
s=s.replace("['small','wide','largePage','selector']", "(renderer==='catalog'?['small','wide','largePage']:['small','wide','largePage','selector'])")
s=s.replace("'?workload='+workload", "'?workload='+workload") # URL replacement below
s=s.replace("4179/?workload='+workload", "4179/?renderer='+renderer+'&workload='+workload")
a=s.index("    // Sequential native key events")
b=s.index("    await page.waitForFunction(()=>!window.sguiPerf.updating",a)
s=s[:a]+'''    await page.getByRole('button',{name:'Run 50 updates'}).click();
    await page.waitForFunction(()=>window.sguiPerf.updating);
    // Input and selection deliberately overlap the 10Hz update workload.
    for(const character of ['C','o','u','r','s','e',' ','9']){await input.press(character===' '?'Space':character);await page.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))));}
    await input.clear();await page.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))));
    assert.ok(await page.evaluate(()=>window.sguiPerf.updating),'Updates ended before interactive sequence; preserve failure and investigate contention');
    if(workload==='selector') await page.getByRole('option',{name:'Course 0',exact:true}).click();
    else {
      const checkbox=page.getByRole('checkbox',{name:'Select Course 0',exact:true});
      await checkbox.locator('xpath=ancestor::label[1]').click();
      assert.ok(await checkbox.isChecked(),'selection must actually commit');
      await page.getByRole('button',{name:'Sort Name',exact:true}).click();
      if(renderer==='catalog')await page.getByRole('menuitemradio',{name:'Sort Ascending',exact:true}).click();
    }
''' + s[b:]
s=s.replace("assert.ok(samples.some(s=>s.action==='initial'));", "assert.ok(samples.some(s=>s.action==='initial'));\n    assert.ok(samples.some(s=>s.action==='input'&&s.duringUpdates),'No input sampled during updates');\n    assert.ok(samples.some(s=>s.action==='selection'&&s.duringUpdates),'No selection sampled during updates');")
s=s.replace("{summaries,measuredAt:", "{schemaVersion:2,renderer,sourceHead,fixtureHashes,viewport:{width:1440,height:900},summaries,measuredAt:")
s=s.replace("environment:{node:process.version", "environment:{react:JSON.parse(await readFile(resolve(here,'../../node_modules/react/package.json'),'utf8')).version,throttlePolicy:'none',node:process.version")
s=s.replace("const key=row.workload+':'+sample.action", "const key=row.workload+':'+sample.action+(sample.duringUpdates?':updating':':idle')")
s=s.replace("input/click capture or timer callback", "overlapping native input/selection during 50 updates; input/click capture or timer callback")
s=s.replace("await page.evaluate(()=>window.sguiPerf.unmount());", "await page.evaluate(()=>window.sguiPerf.unmount());\n    const cleanup=await page.evaluate(()=>({...window.sguiPerf.lifecycle,updating:window.sguiPerf.updating,sampleCount:window.sguiPerf.samples.length}));\n    assert.deepEqual({mounted:cleanup.mounted,pendingFrames:cleanup.pendingFrames,activeTimers:cleanup.activeTimers,updating:cleanup.updating},{mounted:false,pendingFrames:0,activeTimers:0,updating:false});\n    await page.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))));\n    assert.equal(await page.evaluate(()=>window.sguiPerf.samples.length),cleanup.sampleCount,'Samples changed after unmount');\n    results.at(-1).cleanup=cleanup;")
s=s.replace("const browser=await chromium.launch();const results=[];", "const browser=await chromium.launch();const results=[],cleanupProbes=[];")
s=s.replace("  assert.deepEqual(errors,[]);", """  for(const workload of (renderer==='catalog'?['small','wide','largePage']:['small','wide','largePage','selector'])) {
    await page.goto('http://127.0.0.1:4179/?renderer='+renderer+'&workload='+workload);
    await page.waitForFunction(()=>window.sguiPerf?.ready);
    await page.getByRole('button',{name:'Run 50 updates'}).click();
    await page.waitForFunction(()=>window.sguiPerf.samples.some(sample=>sample.action==='update'));
    const before=await page.evaluate(()=>({...window.sguiPerf.lifecycle,updating:window.sguiPerf.updating}));
    assert.equal(before.activeTimers,1);assert.equal(before.updating,true);
    const after=await page.evaluate(()=>{window.sguiPerf.unmount();return {...window.sguiPerf.lifecycle,updating:window.sguiPerf.updating,sampleCount:window.sguiPerf.samples.length};});
    assert.deepEqual({mounted:after.mounted,pendingFrames:after.pendingFrames,activeTimers:after.activeTimers,updating:after.updating},{mounted:false,pendingFrames:0,activeTimers:0,updating:false});
    await page.waitForTimeout(150); // Longer than one scheduled100ms tick: detect late publication.
    const later=await page.evaluate(()=>window.sguiPerf.samples.length);assert.equal(later,after.sampleCount);
    cleanupProbes.push({workload,before,after,laterSampleCount:later});
  }
  assert.deepEqual(errors,[]);""")
s=s.replace("fixtureHashes,viewport:", "fixtureHashes,cleanupProbes,viewport:")
write('measure-browser.mjs',s)
patch=[]
for p in sorted((out/'proposed-files').rglob('*')):
 if p.is_file():
  rel=p.relative_to(out/'proposed-files');orig=(root/rel).read_text() if (root/rel).exists() else ''
  patch.extend(difflib.unified_diff(orig.splitlines(True),p.read_text().splitlines(True),fromfile='a/'+str(rel) if orig else '/dev/null',tofile='b/'+str(rel)))
(out/'performance-successor.patch').write_text(''.join(patch))
