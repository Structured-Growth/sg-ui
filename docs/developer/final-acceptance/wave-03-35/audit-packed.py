"""Audit an existing exact archive without extracting or modifying it. No legal approval implied."""
import argparse,tarfile,json,re,hashlib,collections
from pathlib import Path,PurePosixPath
PATTERN=re.compile(rb'mui|emotion|material[ -]?ui|material design|basegridsx',re.I)
RETIRED=re.compile(r'^(@mui/|@emotion/|@material-ui/|emotion$|material-ui$)',re.I)
def audit(archive):
 rows=[]; errors=[]; names=set();package=None
 with tarfile.open(archive,'r:gz') as tar:
  for member in tar.getmembers():
   name=member.name;p=PurePosixPath(name)
   if not p.parts or p.is_absolute() or '..' in p.parts or p.parts[0]!='package':errors.append('unsafe-or-unexpected-path:'+name)
   if len(p.parts)>1 and p.parts[1] not in ['dist','LICENSE','THIRD_PARTY_NOTICES.md','README.md','package.json']:errors.append('unexpected-shipping-root:'+name)
   if name in names:errors.append('duplicate-member:'+name)
   names.add(name)
   if member.isdir():continue
   if not member.isfile():errors.append('nonregular-member:'+name);continue
   data=tar.extractfile(member).read();hits=[]
   for i,line in enumerate(data.splitlines(),1):
    matches=PATTERN.findall(line)
    if matches:hits.append({'line':i,'tokens':sorted(set(x.decode('ascii').lower() for x in matches))})
   legal=name in ['package/LICENSE','package/THIRD_PARTY_NOTICES.md']
   disposition='legal-preserve-owner-review' if legal and hits else 'needs-review' if hits else 'no-retired-text'
   # Broad substrings inside owned token identifiers are harmless only when every hit is that exact identifier.
   if hits and not legal and all(not PATTERN.search(line.replace(b'scaleMotionDuration',b'')) for line in data.splitlines()):disposition='owned-motion-token-substring'
   if PATTERN.search(name.encode()):errors.append('retired-filename:'+name)
   if disposition=='needs-review':errors.append('unclassified-retired-text:'+name)
   rows.append({'file':name,'bytes':len(data),'sha256':hashlib.sha256(data).hexdigest(),'matches':hits,'disposition':disposition})
   if name=='package/package.json':package=json.loads(data)
 if not package:errors.append('missing-package-json')
 else:
  for group in ['dependencies','peerDependencies','optionalDependencies','devDependencies']:
   for n in package.get(group,{}):
    if RETIRED.search(n):errors.append('retired-package:'+group+':'+n)
 for required in ['package/LICENSE','package/THIRD_PARTY_NOTICES.md','package/README.md']:
  if required not in names:errors.append('missing-required-file:'+required)
 return {'archive':str(Path(archive).resolve()),'archiveSha256':hashlib.sha256(Path(archive).read_bytes()).hexdigest(),'pattern':PATTERN.pattern.decode(),'files':rows,'errors':errors,'technicalReferenceAuditPass':not errors,'legalApproval':False,'limits':['All regular archive bytes scanned including maps and binary assets for ASCII branded text; no extraction.','A byte substring in binary is a review candidate, not proof of executable dependency.','Package declarations checked; frozen installed transitive closure must be joined separately.','No notice deletion or legal/derived-asset approval. No browser/runtime execution.']}
if __name__=='__main__':
 p=argparse.ArgumentParser();p.add_argument('archive',type=Path);p.add_argument('--output',type=Path,required=True);a=p.parse_args()
 own=Path(__file__).resolve().parent
 if not a.output.resolve().is_relative_to(own):p.error('Output must remain inside wave-03-35')
 result=audit(a.archive);a.output.write_text(json.dumps(result,indent=2)+'\n');print(json.dumps({'files':len(result['files']),'errors':result['errors'],'archiveSha256':result['archiveSha256']}));raise SystemExit(bool(result['errors']))
