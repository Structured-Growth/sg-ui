"""Retain and verify data-only official CI artifacts; never execute downloaded files."""
import base64, hashlib, json, os, re, shutil, stat, subprocess, sys, tarfile, unicodedata, zipfile
from pathlib import Path, PurePosixPath
ROOT=Path(__file__).resolve().parents[4]
TASK=ROOT/'packages/ui/artifacts/owner-official-ci-2026-10-21'
TASK.mkdir(parents=True,exist_ok=True)
REPO='Structured-Growth/sg-ui'
run_id,head,name=sys.argv[1:]
assert run_id.isdigit() and re.fullmatch('[a-f0-9]{40}',head) and re.fullmatch('[a-z0-9-]+',name)
def api(endpoint):
 return json.loads(subprocess.check_output(['gh','api',f'repos/{REPO}/{endpoint}'],cwd=ROOT))
run=api(f'actions/runs/{run_id}')
assert run['head_sha']==head and run['status']=='completed' and run['conclusion']=='success','Current complete successful run required'
out=TASK/name;out.mkdir()
def save(path,value):path.write_text(json.dumps(value,indent=2)+'\n')
save(out/'run.json',run)
jobs=api(f'actions/runs/{run_id}/jobs?per_page=100');save(out/'jobs.json',jobs)
assert len(jobs['jobs'])==jobs['total_count'],'Incomplete job inventory'
artifacts=api(f'actions/runs/{run_id}/artifacts?per_page=100');save(out/'artifacts.json',artifacts)
assert len(artifacts['artifacts'])==artifacts['total_count'],'Incomplete artifact inventory'
required={f'sgui-{part}-node-{runtime}' for part in ['package','browser-docs','validation'] for runtime in ['22.12.0','24']}
required|={'sgui-browser-node-24','sgui-docs-validation-node-24'}|{f'sgui-native-{browser}-node-24' for browser in ['chromium','firefox','webkit']}
archives=out/'archives';archives.mkdir();extracted=out/'extracted';extracted.mkdir()
def digest(path):
 h=hashlib.sha256()
 with path.open('rb') as f:
  for block in iter(lambda:f.read(1024*1024),b''):h.update(block)
 return h.hexdigest()
def safe_name(raw):
 assert '\\' not in raw and ':' not in raw and '\x00' not in raw
 p=PurePosixPath(raw)
 assert not p.is_absolute() and '..' not in p.parts and p.parts,'Unsafe archive path'
 return p
collected=[]
for wanted in sorted(required):
 matches=[a for a in artifacts['artifacts'] if a['name']==wanted];assert len(matches)==1,wanted
 a=matches[0];assert not a['expired'] and a['workflow_run']['id']==int(run_id) and a['workflow_run']['head_sha']==head
 archive=archives/(wanted+'.zip')
 with archive.open('xb') as f:
  subprocess.run(['gh','api',f'repos/{REPO}/actions/artifacts/{a["id"]}/zip'],cwd=ROOT,stdout=f,check=True)
 assert a['digest']=='sha256:'+digest(archive),'Archive SHA-256 mismatch'
 dest=extracted/wanted;dest.mkdir();seen=set();total=0
 with zipfile.ZipFile(archive) as z:
  for info in z.infolist():
   p=safe_name(info.filename);key=unicodedata.normalize('NFC',str(p)).casefold()
   assert key not in seen,'Duplicate archive member';seen.add(key)
   assert not stat.S_ISLNK(info.external_attr>>16),'Archive symlink rejected'
   total+=info.file_size;assert total<2*1024**3,'Oversized archive'
   target=dest.joinpath(*p.parts);assert target.resolve().is_relative_to(dest.resolve())
   if info.is_dir():target.mkdir(parents=True,exist_ok=True)
   else:
    target.parent.mkdir(parents=True,exist_ok=True)
    with z.open(info) as source,target.open('xb') as sink:shutil.copyfileobj(source,sink)
 a={**a,'archivePath':str(archive)};collected.append(a)
 print('Verified '+wanted,flush=True)
for runtime in ['22.12.0','24']:
 packages=list((extracted/f'sgui-package-node-{runtime}').glob('*.tgz'));assert len(packages)==1
 dest=out/f'packaged-node-{runtime}';dest.mkdir();seen=set();total=0
 with tarfile.open(packages[0],'r:gz') as t:
  for info in t.getmembers():
   p=safe_name(info.name);assert p.parts[0]=='package' and (info.isfile() or info.isdir())
   key=unicodedata.normalize('NFC',str(p)).casefold();assert key not in seen;seen.add(key)
   total+=info.size;assert total<256*1024**2
   target=dest.joinpath(*p.parts);assert target.resolve().is_relative_to(dest.resolve())
   if info.isdir():target.mkdir(parents=True,exist_ok=True)
   else:
    target.parent.mkdir(parents=True,exist_ok=True)
    with t.extractfile(info) as source,target.open('xb') as sink:shutil.copyfileobj(source,sink)
 job=[j for j in jobs['jobs'] if j['name']==f'Validate Node {runtime}'];assert len(job)==1
 descriptor={'expectedHead':head,'runtime':runtime,'run':run,'job':job[0],'artifacts':collected,
  'receiptPath':str(extracted/f'sgui-validation-node-{runtime}'/'build-receipt.json'),
  'tarballPath':str(packages[0]),'nativeDirectory':str(extracted/f'sgui-browser-docs-node-{runtime}'),
  'packageDirectory':str(dest/'package'),'nativeProofRoot':str(extracted)}
 path=out/f'downloads-node-{runtime}.json';save(path,descriptor)
 with (out/f'verified-node-{runtime}.json').open('x') as sink:
  subprocess.run(['node',str(ROOT/'packages/ui/scripts/verify-ci-downloads.mjs'),str(path)],cwd=ROOT,stdout=sink,check=True)
summary={'head':head,'run':int(run_id),'artifacts':[{k:a[k] for k in ['id','name','digest','expires_at','archivePath']} for a in collected],
 'limits':['Archive consistency and required execution scope, not legal, manual AT, branch-protection or release approval.']}
save(out/'receipt.json',summary)
print('Both supported runtime packets verified against the exact head and native engine outputs.')
