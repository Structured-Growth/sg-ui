"""Read every tracked current file; never emit file contents or personal match text."""
from pathlib import Path
import subprocess,json,re,hashlib,datetime,collections
root=Path(__file__).resolve().parents[4]; out=Path(__file__).resolve().parent
pattern=re.compile(r'mui|emotion|material[ -]?ui|material design|basegridsx',re.I)
def sha(data): return hashlib.sha256(data).hexdigest()
def category(f,line):
 if f.startswith('.obsidian/'):return 'personal-state-non-runtime-preserve'
 if f.startswith('docs/developer/final-acceptance/') or f.startswith('docs/developer/migration-baseline/'):return 'immutable-evidence-or-baseline-preserve'
 if 'LICENSE' in f or 'NOTICES' in f:return 'legal-reference-preserve-owner-review'
 if f=='pnpm-lock.yaml':return 'opaque-integrity-substring'
 if f=='AGENTS.md':return 'retired-foundation-prohibition'
 if 'scaleMotionDuration' in line:return 'owned-motion-token-substring'
 if f.startswith('apps/docs/') and re.search('material',line,re.I):return 'intentional-demo-identity-or-design-reference'
 if '/scripts/' in f or '.test.' in f or '/tests/' in f:return 'negative-test-or-rejection-guard'
 if f.startswith('docs/') or f.endswith('README.md'):return 'historical-migration-mapping-or-removal-guidance'
 return 'needs-inspection'
files=[]
for f in filter(None,subprocess.check_output(['git','ls-files','-z'],cwd=root).decode().split('\0')):
 p=root/f
 if not p.is_file():files.append({'file':f,'state':'absent-in-working-tree'});continue
 data=p.read_bytes(); row={'file':f,'sha256':sha(data),'bytes':len(data)}
 try:
  if b'\0' in data:raise UnicodeError()
  s=data.decode('utf8');row['state']='text';hits=[]
  for i,line in enumerate(s.splitlines(),1):
   tokens=pattern.findall(line)
   if tokens:hits.append({'line':i,'tokens':sorted(set(t.lower() for t in tokens)),'disposition':category(f,line)})
  row['hits']=hits
 except UnicodeError:row['state']='binary-or-non-utf8'
 files.append(row)
d={'capturedAt':datetime.datetime.now(datetime.timezone.utc).isoformat(),'head':subprocess.check_output(['git','rev-parse','HEAD'],cwd=root).decode().strip(),'pattern':pattern.pattern,'scope':'Every git ls-files path, current bytes; no text/config/evidence/personal exclusions. Untracked files not part of literal tracked criterion. Personal matches report token/line only, no content. Deleted files recorded absent.','files':files,'summary':{'states':dict(collections.Counter(x['state'] for x in files)),'matchingFiles':sum(bool(x.get('hits')) for x in files),'hitLines':sum(len(x.get('hits',[])) for x in files),'dispositions':dict(collections.Counter(h['disposition'] for x in files for h in x.get('hits',[])))}}
(out/'tracked-text-audit.json').write_text(json.dumps(d,indent=2)+'\n');print(json.dumps(d['summary'],indent=2))
print('Needs inspection:',[x['file'] for x in files if any(h['disposition']=='needs-inspection' for h in x.get('hits',[]))])
