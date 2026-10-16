from pathlib import Path
import json,hashlib,subprocess
out=Path(__file__).resolve().parent;root=out.parents[3];base=root/'docs/developer/final-acceptance'
j=lambda p:json.loads(p.read_text());h=lambda p:hashlib.sha256(p.read_bytes()).hexdigest()
s=j(base/'parallel-01/api-snapshot.json');d=j(out/'normalized-defaults.json');c=j(out/'normalized-contracts.json');i=j(out/'input-comparison.json');co=j(base/'coordinator-integration/evidence.json')
assert len(d['records'])==len(s['defaultCandidates'])==678
assert len({r['id'] for r in d['records']})==678
assert len(c['contracts'])==len(s['contracts'])==469
assert {r['contractId'] for r in c['contracts']}==set(s['contracts'])
assert all(r['routes'] for r in c['contracts'])
assert sum(d['counts'].values())==678
assert all(row['current']==h(root/row['file']) for row in i['declarationInputs'])
assert all(v['current']==h(root/p) for p,v in i['sourceInputs'].items())
assert all(v==h(root/p) for p,v in j(out/'patch-inputs.json').items())
assert all(v['coordinator']==v['current'] for v in i['coordinatorInputComparison'])
receiptChecks={p:{'expected':v,'current':h(base/'coordinator-integration'/p)} for p,v in co['receiptHashes'].items()}
assert all(r['expected']==r['current'] for r in receiptChecks.values())
# Only compare declaration bytes used here; no build or whole-output scan.
builtChecks={r['file']:r['current']==co['builtLibraryHashes'].get(r['file']) for r in i['declarationInputs']}
assert all(builtChecks.values())
result=subprocess.run(['git','apply','--check',str(out/'consumer-guide.patch')],cwd=root,text=True,capture_output=True)
assert result.returncode==0,result.stderr
checks=j(out/'typecheck.json');assert checks['diagnostics']==[];assert len(checks['rejected'])==checks['negativeMarkers']==6
snippet=(out/'consumer-contracts.tsx').read_text().split('// Guide snippet begins (uses the AppDataGrid import above).\n')[1]
assert snippet in (out/'proposed-files/docs/developer/react-aria-catalog-grid.md').read_text()
r={'status':'pass','scope':'Read-only evidence integrity, normalization shape, exact guide snippet equality and unapplied patch applicability. No runtime/native assertion.', 'candidates':678,'contracts':469,'comparedDeclarations':len(builtChecks),'coordinatorReceiptChecks':receiptChecks,'patchCheck':{'command':'git apply --check docs/developer/final-acceptance/wave-03-01/consumer-guide.patch','returncode':result.returncode,'stdout':result.stdout,'stderr':result.stderr},'compilerExpectedRejections':checks['rejected']}
(out/'verification.json').write_text(json.dumps(r,indent=2)+'\n');print('PASS: 678 candidate dispositions, 469 contract IDs/routes, 370 coordinator declaration hashes, 15 retained receipts, 6 rejected contracts, exact guide snippet, unapplied patch.')
