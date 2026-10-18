"""Integrity-bound historical type recovery. No package manager, extraction or execution.

Writes only a new output directory. Supply --archives for cached immutable .tgz files,
or opt into registry archive downloads with --fetch. Neither mode installs packages.
"""
import argparse,base64,datetime,hashlib,io,json,re,subprocess,tarfile,urllib.request
from pathlib import Path,PurePosixPath
p=argparse.ArgumentParser();p.add_argument('--output',required=True);p.add_argument('--archives');p.add_argument('--fetch',action='store_true');p.add_argument('--packages',nargs='*');args=p.parse_args()
assert args.archives or args.fetch,'Supply --archives directory or explicitly choose --fetch'
here=Path(__file__).resolve().parent;repo=here.parents[4]
commit='21adebd61bedfc6a1ed395fe664ff4be83896821'
lock=subprocess.check_output(['git','show',commit+':pnpm-lock.yaml'],cwd=repo,text=True)
# Intentionally parse only integrity-bearing package headers, never dependency snapshots.
section=lock.split('\npackages:\n',1)[1].split('\nsnapshots:\n',1)[0]
entries={}
for m in re.finditer(r"^  (?:'([^']+)'|([^\s][^:]+)):\n(.*?)(?=^  [^ ]|\Z)",section,re.M|re.S):
 key=m.group(1) or m.group(2);integrity=re.search(r'resolution: \{integrity: (sha512-[A-Za-z0-9+/=]+)',m.group(3))
 if integrity:entries[key]=integrity.group(1)
selected=args.packages or ['@mui/material@7.3.11','@mui/icons-material@7.3.11','@mui/x-data-grid@8.29.3','@emotion/react@11.14.0','@emotion/styled@11.14.1']
output=Path(args.output).resolve();output.mkdir() # Existing evidence cannot be overwritten.
receipt={'capturedAt':datetime.datetime.now(datetime.timezone.utc).isoformat(),'baselineCommit':commit,'historicalLockSha256':hashlib.sha256(lock.encode()).hexdigest(),'packages':[],'limits':['Recovered exact integrity-bound package bytes and declaration text; no installation or upstream code execution.','Primary packages alone do not establish transitive inherited type closure. Recover referenced package versions and compare declarations before full acceptance.','No publication history, current-version recommendation, package consumer or release approval claim.']}
def save(): (output/'recovery.json').write_text(json.dumps(receipt,indent=2)+'\n')
for key in selected:
 row={'key':key,'passed':False};receipt['packages'].append(row);save()
 try:
  assert key in entries,'No exact integrity-bound historical package entry: '+key
  name,version=key.rsplit('@',1);short=name.split('/')[-1];filename=short+'-'+version+'.tgz'
  row['expectedIntegrity']=entries[key]
  if args.archives:
   row['source']=str(Path(args.archives)/filename);data=Path(row['source']).read_bytes()
  else:
   row['source']='https://registry.npmjs.org/'+name+'/-/'+filename
   with urllib.request.urlopen(row['source'],timeout=45) as response:data=response.read(64*1024*1024+1)
  assert len(data)<=64*1024*1024,'Archive exceeds bounded64MiB limit'
  actual='sha512-'+base64.b64encode(hashlib.sha512(data).digest()).decode();row['actualIntegrity']=actual
  assert actual==entries[key],'Historical lock integrity mismatch'
  row['archiveSha256']=hashlib.sha256(data).hexdigest();row['bytes']=len(data)
  declarations={};package=None;total=0
  with tarfile.open(fileobj=io.BytesIO(data),mode='r:gz') as archive:
   for member in archive:
    path=PurePosixPath(member.name)
    if not member.isfile():continue # Never follow links or extract any archive path.
    assert not path.is_absolute() and '..' not in path.parts,'Unsafe archive member'
    if len(path.parts)<2:continue
    local=PurePosixPath(*path.parts[1:]) # npm @types archives use react/ etc., not package/.
    if not (str(local).endswith(('.d.ts','.d.mts','.d.cts')) or str(local)=='package.json'):continue
    total+=member.size;assert total<=128*1024*1024,'Declaration payload exceeds bound'
    payload=archive.extractfile(member).read();text=payload.decode('utf8')
    if str(local)=='package.json':package=json.loads(text)
    else:declarations[str(local)]={'sha256':hashlib.sha256(payload).hexdigest(),'text':text}
  assert package and package['name']==name and package['version']==version,'Archive package identity mismatch'
  assert declarations,'No declarations found'
  artifact=filename.removesuffix('.tgz')+'-declarations.json'
  content=json.dumps({'name':name,'version':version,'archiveSha256':row['archiveSha256'],'packageJson':package,'declarations':declarations},separators=(',',':'))+'\n'
  (output/artifact).write_text(content);row.update({'passed':True,'declarations':len(declarations),'declarationArtifact':artifact,'declarationArtifactSha256':hashlib.sha256(content.encode()).hexdigest()})
 except Exception as exc:row['error']=str(exc)
 save()
receipt['passed']=all(row['passed'] for row in receipt['packages']);save()
print(json.dumps({'passed':receipt['passed'],'packages':[{'key':r['key'],'passed':r['passed'],'declarations':r.get('declarations'),'error':r.get('error')} for r in receipt['packages']]}))
raise SystemExit(0 if receipt['passed'] else 1)
