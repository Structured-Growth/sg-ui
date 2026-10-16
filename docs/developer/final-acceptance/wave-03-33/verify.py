"""Focused metadata/provenance checks. No builds, registry writes or runtime claims."""
import hashlib, json, re, subprocess
from pathlib import Path
OUT=Path(__file__).resolve().parent
ROOT=OUT.parents[3]
def load(p): return json.loads(p.read_text())
def sha(p): return hashlib.sha256(p.read_bytes()).hexdigest() if p.exists() else None
e=load(OUT/'evidence.json')
assert e['manifestSummary']=={'rows':201,'present':159,'mismatches':0,'missingReplacements':0}
assert len(e['stories'])==33
assert sum(bool(s['fixture']) for s in e['stories'])==32
assert all(not s['assertions'] and not s['plays'] for s in e['stories'])
assert all(not s['initialExtraction']['assertions'] and not s['initialExtraction']['plays'] for s in e['stories'])
assert all(not s.get('missingExports') for s in e['stories'])
assert sum(len(s['missingInitialExportsBeforeRetirement']) for s in e['stories'])==16
assert e['unitContinuity']['equalAfterNameSubstitution']
assert not e['upstreamObject']['available']
base=load(ROOT/'docs/extraction-manifest.json')
new=load(OUT/'proposed-files/docs/extraction-manifest.json')
assert all(base[k]==new[k] for k in ['sourceRepository','sourceCommit','sourceRoot','presenceScope'])
assert [(r['source'],r['destination'],r['present']) for r in base['files']]==[(r['source'],r['destination'],r['present']) for r in new['files']]
for a,b in zip(base['files'],new['files']):
    if a['source']!='components/AppButton/AppButton.stories.tsx': assert a==b
row=next(r for r in new['files'] if r['source']=='components/AppButton/AppButton.stories.tsx')
assert [r['originalExport'] for r in row['migration']['localReconciliation']['exports']]==['Default','Variants','PendingAndDisabled','NativeForm']
for p in row['migration']['replacements']: assert (ROOT/p).exists()
inputs=load(OUT/'patch-inputs.json')
states=[]
for item in inputs:
    p=item['path']; h=sha(ROOT/p)
    assert h in [item['baseSha256'],item['proposedSha256']], 'Patch context changed: '+p
    assert sha(OUT/'proposed-files'/p)==item['proposedSha256']
    states.append('integrated' if h==item['proposedSha256'] else 'unapplied')
assert len(set(states))==1, 'Partial application; review before continuing'
# Verify every local file link in the new lineage doc against proposed targets or disk.
doc='docs/developer/extraction-lineage.md'
links=[]
for target in re.findall(r'\]\(([^)]+)\)',(OUT/'proposed-files'/doc).read_text()):
    if target.startswith('#'): continue
    target=target.split('#')[0]
    p=(ROOT/doc).parent/target
    assert p.exists() or (OUT/'proposed-files'/p.relative_to(ROOT)).exists(), 'Missing link: '+target
    links.append(target)
if states[0]=='unapplied':
    check=subprocess.run(['git','apply','--check',str(OUT/'provenance.patch')],cwd=ROOT,text=True,capture_output=True)
    assert check.returncode==0, check.stderr
print(json.dumps({'result':'pass','patchState':states[0],'targets':len(inputs),'sourceRowsPreserved':201,'storyModules':33,'directFixtureMappings':32,'initialGridExportsRetainedAsOpenSuccessors':16,'localFileLinksChecked':len(links),'runtime':'Python '+__import__('sys').version.split()[0],'limits':'Metadata/Git source validation only; no runtime acceptance.'},indent=2))
