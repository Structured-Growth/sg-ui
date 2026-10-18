from pathlib import Path
import json,hashlib,subprocess
root=Path.cwd();out=root/'docs/developer/final-acceptance/wave-04/04';sha=lambda p:hashlib.sha256(p.read_bytes()).hexdigest()
a=json.loads((out/'assignment.json').read_text());r=json.loads((out/'results.json').read_text());inputs=json.loads((out/'input-evidence.json').read_text())
assert [x['id'] for x in r['results']]==a['ids'];assert [x['originalObligation'] for x in r['results']]==a['obligations']
assert r['summary']=={status:sum(x['status']==status for x in r['results']) for status in ['complete','partial','blocked']}
retained=json.loads((out/'retained-grid-native.json').read_text());assert sha(root/retained['receipt'])==retained['sha256']==retained['expectedHashFromValidatedReceipt'];assert retained['count']==9
assert all(c['status']=='expected' and len(c['attempts'])==1 for c in retained['cases'])
node='/Users/thomashall/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node'
current={}
for rel in ['packages/ui/tests/performance/fixture.tsx','packages/ui/tests/performance/measure-browser.mjs','packages/ui/tests/performance/compare-performance.mjs','packages/ui/tests/performance/measure-memory.mjs','packages/ui/tests/performance/vite.config.mjs','packages/ui/tests/consumers/performance-proof-policy.mjs','packages/ui/tests/consumers/performance-proof-policy.test.mjs','apps/docs/scripts/grid-host-operation.test.mjs']:
 current[rel]=sha(root/rel)
 if rel.endswith('.mjs'):subprocess.run([node,'--check',str(root/rel)],check=True,capture_output=True)
assert sha(root/'apps/docs/scripts/grid-host-operation.test.mjs')=='c048174be863f5170ae9d78522626432621bb3f20a932ea161ff50e506b9f01a'
drift={path:{'original':h,'current':sha(root/path)} for path,h in inputs['sha256'].items() if (root/path).is_file() and sha(root/path)!=h}
result={'status':'pass','scopeIds':a['ids'],'currentIntegratedSha256':current,'retainedNativeExecutions':9,'allRetainedAttemptsSinglePassing':True,'mjsSyntax':'pass','runtime':subprocess.check_output([node,'--version'],text=True).strip(),'originalSnapshotDriftFromCoordinatorIntegration':drift,'activePatch':None,'historicalPatches':'Already integrated or superseded; do not reapply','limits':'Read-only source review/hashes/syntax. Retain existing host/comparator executions. No browser, performance measurement, build, install, simulator or heavy suite.'}
(out/'handoff-validation.json').write_text(json.dumps(result,indent=2)+'\n');print(json.dumps({'status':'pass','integratedInputs':len(current),'coordinatorChangedInputs':len(drift),'activePatch':None}))
