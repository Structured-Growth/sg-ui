from pathlib import Path
import hashlib,json,subprocess
out=Path(__file__).resolve().parent;root=out.parents[3]
def load(f):return json.loads((out/f).read_text())
a=load('assignment.json');r=load('results.json');symbols=load('public-symbol-dispositions.json');tracked=load('tracked-text-audit.json');inputs=load('input-evidence.json')
assert {x['id'] for x in r['leaves']}==set(a['ids'])
assert all(x['originalRequirement']==a['originalChecklistStatements'][x['id']] for x in r['leaves'])
assert len(symbols['baselineNames'])==266 and len(symbols['currentContracts'])==469
assert sum(len(x['baselineIdentities']) for x in symbols['baselineNames'])==638
assert all(x['replacement'] and (root/x['guide']).is_file() for x in symbols['baselineNames'])
assert all(x['sourceFiles'] and all((root/f['path']).is_file() for f in x['sourceFiles']) for x in symbols['currentContracts'])
assert len(load('migration-trace.json'))==37 and all(x['priorLeafReceipt'] for x in load('migration-trace.json'))
assert all(inputs['priorReportHashMatchesAssignment'].values())
assert not inputs['coordinatorInputDeltas'] and not inputs['coordinatorLibraryOutputDeltas']
assert load('current-export-delta.json')['entries']==238 and not load('current-export-delta.json')['routeNameDeltas']
assert len(tracked['files'])==1657 and not any(h['disposition']=='needs-inspection' for f in tracked['files'] for h in f.get('hits',[]))
assert not any(f.get('hits') for f in tracked['files'] if f['file'].startswith('.obsidian/'))
for f,h in load('patch-preconditions.json').items():assert hashlib.sha256((root/f).read_bytes()).hexdigest()==h
subprocess.run(['git','apply','--check',str(out/'retain-packed-and-audit-docs.patch')],cwd=root,check=True)
subprocess.run(['node','--check',str(out/'proposed-files/packages/ui/scripts/check-package.mjs')],cwd=root,check=True)
for p in out.rglob('*.json'):json.loads(p.read_text())
(out/'verification.json').write_text(json.dumps({'result':'pass','checks':['Verbatim original leaf identity','638/266/469 complete join and alias references','Every guide/source target exists','37 row-specific prior receipts','All prior assignment hashes match','Coordinator inputs/outputs unchanged','238 current declaration route names unchanged','All tracked matches classified; personal matches absent','Patch preconditions and applicability','Proposed package script syntax','All JSON parseable'],'productRuntimeExecution':False},indent=2)+'\n')
manifest={str(p.relative_to(out)):hashlib.sha256(p.read_bytes()).hexdigest() for p in sorted(out.rglob('*')) if p.is_file() and p.name!='artifact-manifest.json' and '__pycache__' not in str(p)}
(out/'artifact-manifest.json').write_text(json.dumps(manifest,indent=2)+'\n');print('PASS: scoped artifacts, symbol/reference joins, patch applicability and syntax')
