from pathlib import Path
import hashlib,json,difflib,shutil
root=Path.cwd();out=root/'docs/developer/final-acceptance/wave-04/04';prop=out/'proposed-files';history=out/'historical-proposed-files'
if not history.exists():shutil.copytree(prop,history)
current={}
for name in ['fixture.tsx','measure-browser.mjs','vite.config.mjs','compare-performance.mjs','measure-memory.mjs']:
 rel=Path('packages/ui/tests/performance')/name
 s=(root/rel).read_text();current[str(rel)]=hashlib.sha256(s.encode()).hexdigest()
 (prop/rel).parent.mkdir(parents=True,exist_ok=True);(prop/rel).write_text(s)
rel=Path('packages/ui/tests/performance/measure-memory.mjs');s=(root/rel).read_text()
s=s.replace('// node tests/performance/measure-memory.mjs /absolute/NEW-directory [--snapshots]', '// node tests/performance/measure-memory.mjs /absolute/NEW-directory [--snapshots] [--renderer=both|catalog|processing]')
s=s.replace("assert(process.argv.slice(3).every(arg=>arg==='--snapshots'),'Unknown option');", "assert(process.argv.slice(3).every(arg=>arg==='--snapshots'||/^--renderer=(both|catalog|processing)$/.test(arg)),'Unknown option');\nconst rendererFlags=process.argv.slice(3).filter(arg=>arg.startsWith('--renderer='));assert(rendererFlags.length<=1,'Specify renderer once');\nconst rendererChoice=rendererFlags[0]?.split('=')[1]??'both';\nconst renderers=rendererChoice==='both'?['processing','catalog']:[rendererChoice];")
s=s.replace("const receipt={startedAt:", "const receipt={schemaVersion:2,rendererChoice,startedAt:")
s=s.replace("for(const workload of ['small','wide','largePage','selector']){", "for(const renderer of renderers)for(const workload of (renderer==='catalog'?['small','wide','largePage']:['small','wide','largePage','selector'])){")
s=s.replace("4179/?workload='+workload", "4179/?renderer='+renderer+'&workload='+workload")
s=s.replace("const record={workload,", "const record={renderer,workload,")
s=s.replace("await page.getByRole('checkbox',{name:'Select Course 0',exact:true}).check();", "const checkbox=page.getByRole('checkbox',{name:'Select Course 0',exact:true});\n        await checkbox.locator('xpath=ancestor::label[1]').click();\n        assert.equal(await checkbox.isChecked(),true,'Native label must select the intended row');")
s=s.replace("await page.getByRole('button',{name:'Sort Name',exact:true}).click();", "await page.getByRole('button',{name:'Sort Name',exact:true}).click();\n        if(renderer==='catalog')await page.getByRole('menuitemradio',{name:'Sort Ascending',exact:true}).click();")
s=s.replace("updating:window.sguiPerf.updating,samples:", "updating:window.sguiPerf.updating,lifecycle:{...window.sguiPerf.lifecycle},samples:")
s=s.replace("assert.equal(disposed.children,0);", "assert.deepEqual(disposed.lifecycle,{mounted:false,pendingFrames:0,activeTimers:0});\n      assert.equal(disposed.children,0);")
s=s.replace("snapshot(workload+'-warm')", "snapshot(renderer+'-'+workload+'-warm')").replace("snapshot(workload+'-final')", "snapshot(renderer+'-'+workload+'-final')")
(prop/rel).write_text(s)
doc=Path('docs/developer/react-aria-performance.md');current[str(doc)]=hashlib.sha256((root/doc).read_bytes()).hexdigest();text=(root/doc).read_text()+'''\n\nMemory runs now accept `--renderer=both|catalog|processing` (default both).\nCatalog mode exercises public AppDataGrid at page50/page200, using its native\nselection label and sort menu; processing retains the selector/portal workload.\nEach renderer/workload has its own receipt and heap snapshot names. Native label\nactivation is followed by an exact checked-state assertion; visually hidden\ncheckbox inputs are not used as pointer targets. The disposal checks include the\nfixture's zero owned intervals/animation frames and unmounted state, alongside\nexisting root/scope/portal and delayed-publication assertions. These counters\nremain bounded ownership evidence, not a global listener census or heap guarantee.\n\nThe deterministic private-host controller tests need no browser or build:\n`node --test --test-concurrency=1 apps/docs/scripts/grid-host-operation.test.mjs`\nfrom the repository root on supported Node24. Latency and GC-instrumented memory\nruns remain separate coordinator jobs against an immutable production preview.\n''';(prop/doc).write_text(text)
patch=[];changes=[]
for p in sorted(prop.rglob('*')):
 if not p.is_file():continue
 rel=p.relative_to(prop);before=(root/rel).read_text() if (root/rel).exists() else '';after=p.read_text()
 if before==after:continue
 changes.append(str(rel));current[str(rel)]=hashlib.sha256(before.encode()).hexdigest() if before else None
 patch.extend(difflib.unified_diff(before.splitlines(True),after.splitlines(True),fromfile='a/'+str(rel) if before else '/dev/null',tofile='b/'+str(rel)))
(out/'continuation.patch').write_text(''.join(patch));(out/'continuation-inputs.json').write_text(json.dumps({'head':'6c485ed79d0d6a521d188e5bde8315722296f518','base':'Coordinator-owned current integrated working files, not original clean HEAD','sha256':current,'changedFiles':changes,'noRuntimeFixtureDeltaNeeded':True},indent=2)+'\n')
print(json.dumps({'changes':changes,'fixture':'Merged mount/unmount, renderer/queued marks and lifecycle inspected; no correction needed'}))
