"""Verify local raw snapshot bytes and reuse the retained strong-graph review."""
from pathlib import Path
import hashlib,json,sys
output=Path(__file__).resolve().parent
root=output.parents[3]
heaps=Path(sys.argv[1]).resolve()
measurement=json.loads((heaps/'memory.json').read_text())
assert measurement['status']=='pass' and len(measurement['snapshots'])==14
for item in measurement['snapshots']:
 p=heaps/(item['name']+'.heapsnapshot')
 assert p.stat().st_size==item['bytes'] and hashlib.sha256(p.read_bytes()).hexdigest()==item['sha256']
algorithm=root/'docs/developer/final-acceptance/wave-04/02/instrumented-memory/analyze.py'
assert hashlib.sha256(algorithm.read_bytes()).hexdigest()=='b147392f5543704b0921c7f345ac02bff802558e2a8ea2c51e2303082ba1b436'
source=algorithm.read_text().splitlines()
source[1]=f"base=pathlib.Path({str(output)!r});measurement=pathlib.Path({str(heaps)!r});m=json.loads((measurement/'memory.json').read_text());assert m['status']=='pass';rows=[]"
source='\n'.join(source).replace("(base/'analysis.json').write_text", "(base/'heap-review.json').write_text").replace("'source':'measurement/memory.json'", "'source':str(measurement/'memory.json')")
exec(compile(source,str(algorithm), 'exec'),{'__file__':str(algorithm)})
(output/'snapshot-retention.json').write_text(json.dumps({'rawSnapshotDirectory':str(heaps),'snapshots':measurement['snapshots'],'verified':True,'method':'Size and SHA-256 of all14 local raw snapshots verified before graph analysis. Raw heaps are retained locally, not committed.','limits':['Strong graph paths and grouped self-size are observations, not allocation stacks or transitive retained bytes.']},indent=2)+'\n')
