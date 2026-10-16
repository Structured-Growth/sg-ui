"""Read-only reconciliation; writes only this assignment's artifacts."""
import difflib, hashlib, json, re
from pathlib import Path
from datetime import datetime, timezone
ROOT=Path(__file__).resolve().parents[4]
OUT=Path(__file__).resolve().parent
sha=lambda b: hashlib.sha256(b).hexdigest()
read=lambda p:(ROOT/p).read_bytes()
load=lambda p:json.loads(read(p))
put=lambda p,d:(OUT/p).write_text(json.dumps(d,indent=2)+'\n')
prior='docs/developer/final-acceptance/wave-02-05/'
inv=load(prior+'license-inventory.json')
comparison=load(prior+'license-text-comparison.json')
coordinator=load('docs/developer/final-acceptance/coordinator-integration/evidence.json')
inputs={}
for p in ['AGENTS.md','docs/developer/react-aria-final-acceptance.md','packages/ui/package.json','pnpm-lock.yaml','node_modules/.pnpm/lock.yaml','LICENSE','packages/ui/LICENSE','THIRD_PARTY_NOTICES.md','packages/ui/THIRD_PARTY_NOTICES.md','docs/commercial-licensing.md','packages/ui/scripts/build.mjs','packages/ui/tsconfig.build.json','packages/ui/scripts/check-package.mjs',prior+'license-inventory.json',prior+'license-text-comparison.json',prior+'report.md',prior+'results.json','docs/developer/final-acceptance/wave-02-14/report.md','docs/developer/final-acceptance/wave-02-14/results.json','docs/developer/final-acceptance/coordinator-integration/evidence.json','docs/developer/final-acceptance/coordinator-integration/package.txt']:
 inputs[p]=sha(read(p))
assert inputs['packages/ui/package.json']==inv['inputs']['manifestSha256']
assert inputs['pnpm-lock.yaml']==inv['inputs']['lockSha256']==inputs['node_modules/.pnpm/lock.yaml']
original=read('THIRD_PARTY_NOTICES.md').decode()
assert read('THIRD_PARTY_NOTICES.md')==read('packages/ui/THIRD_PARTY_NOTICES.md')
assert read('LICENSE')==read('packages/ui/LICENSE')
proposed=original.replace("SGUI's commercial license covers its original materials. The following direct runtime and peer packages keep their separate licenses. Transitive dependencies distribute additional notices in their own packages.","SGUI's commercial license covers its original materials. Third-party materials retain their separate licenses. This file preserves current dependency notices, supplemental notices from the resolved runtime/peer dependency closure, and historical attributions retained pending source/asset provenance review. Retention of an attribution does not identify a current runtime dependency. Dependencies also distribute their own applicable licenses and notices.")
adobe=[('@internationalized/date','3.12.4'),('@internationalized/number','3.6.8'),('@internationalized/string','3.2.10'),('@react-types/shared','3.36.1'),('react-aria','3.52.1'),('react-stately','3.50.0')]
refs=''.join(f'## {n} {v} (Apache-2.0)\n\nThe full shared Adobe license text is reproduced below under `react-aria-components` 1.21.1.\n\n' for n,v in adobe)
proposed=proposed.replace('## React Aria migration proof dependencies (Apache-2.0)',refs+'## react-aria-components 1.21.1 (Apache-2.0)')
proposed=proposed.replace('@internationalized/string 3.2.10, and their Adobe interaction/state utilities','@internationalized/string 3.2.10, @internationalized/number 3.6.8, and their Adobe interaction/state utilities')
proposed=proposed.replace('These dependencies are retained while\nthe migration proofs are distributed.','These packages supply the owned implementation\'s interaction, state and internationalization behavior.')
proposed=proposed.replace('## TanStack Table','## @tanstack/table-core 8.21.3 (MIT)\n\nThe full shared TanStack license text is reproduced below under `@tanstack/react-table` 8.21.3.\n\n## @tanstack/react-table 8.21.3 (MIT)')
proposed=proposed.replace('used internally for the experimental grid row model','used internally for grid row processing')
proposed=proposed.replace('## Lucide vector icons','## lucide-react 1.52.0 (ISC)')
changes=[]
for row in comparison:
 b=read(row['path']); assert sha(b)==row['sha256'],row['id']
 inputs[row['path']]=sha(b)
 if not row['normalizedTextContainedInNotices']:
  name,version=row['id'].rsplit('@',1)
  proposed+=f'\n## {name} {version} ({row["license"]})\n\nSupplemental resolved dependency notice; upstream license text reproduced verbatim.\n\n```text\n'+b.decode()+('' if b.endswith(b'\n') else '\n')+'```\n'
  changes.append({'id':row['id'],'license':row['license'],'source':row['path'],'sha256':sha(b),'scopes':row['scopes'],'distributionDisposition':'resolved runtime closure; dependencies remain external in library output; inclusive supplemental retention, not proof every package is bundled'})
# Retained full legal blocks are never changed; only surrounding inventory prose is corrected.
blocks=lambda t:re.findall(r'```text\n(.*?)```',t,re.S)
for block in blocks(original): assert block in blocks(proposed)
for row in comparison: assert re.sub(r'\s+',' ',read(row['path']).decode()).strip() in re.sub(r'\s+',' ',proposed).strip(),row['id']
patch=''
for p in ['THIRD_PARTY_NOTICES.md','packages/ui/THIRD_PARTY_NOTICES.md']:
 target=OUT/'proposed-files'/p;target.parent.mkdir(parents=True,exist_ok=True);target.write_text(proposed)
 patch+=''.join(difflib.unified_diff(read(p).decode().splitlines(True),proposed.splitlines(True),fromfile='a/'+p,tofile='b/'+p))
(OUT/'notices.patch').write_text(patch)
# Separate factual-only proposal, so commercial text stays independently reviewable.
factual=''
for p in ['LICENSE','packages/ui/LICENSE','docs/commercial-licensing.md']:
 old=read(p).decode()
 new=old.replace('including React, MUI, Emotion and\nLexical.','including React, React Aria, TanStack Table,\nLucide and Lexical.')
 new=new.replace('notice does not relicense React, MUI, Emotion, or Lexical. Full notices for the\ncurrent direct runtime/peer packages are included in THIRD_PARTY_NOTICES.md;\ndependencies also distribute their own licenses.','notice does not relicense independently licensed materials, including React,\nReact Aria, TanStack Table, Lucide and Lexical. THIRD_PARTY_NOTICES.md retains\ncurrent dependency notices, supplemental resolved dependency notices and\nhistorical attributions pending provenance review; dependencies also distribute\ntheir own licenses. Final notice completeness remains a review obligation.')
 assert new!=old,p
 target=OUT/'proposed-files'/p;target.parent.mkdir(parents=True,exist_ok=True);target.write_text(new)
 factual+=''.join(difflib.unified_diff(old.splitlines(True),new.splitlines(True),fromfile='a/'+p,tofile='b/'+p))
(OUT/'factual-descriptions.patch').write_text(factual)
# Reconcile actual current build bytes with the coordinator's packed-equality input.
files={str(p.relative_to(ROOT)):sha(p.read_bytes()) for p in sorted((ROOT/'packages/ui/dist').rglob('*')) if p.is_file()}
previous=coordinator['builtLibraryHashes']
delta={p:{'coordinator':previous.get(p),'current':files.get(p)} for p in sorted(set(previous)|set(files)) if previous.get(p)!=files.get(p)}
# Map identities to observed external module specifiers; AST supplement is retained separately.
imports={}
for p in sorted((ROOT/'packages/ui/dist').rglob('*')):
 if not p.is_file() or not (p.name.endswith('.js') or p.name.endswith('.d.ts')): continue
 for spec in re.findall(r'(?:from\s*|import\s*\(\s*|import\s*)[\'"]([^\'"]+)[\'"]',p.read_text()):
  if spec.startswith('.'):continue
  name='/'.join(spec.split('/')[:2]) if spec.startswith('@') else spec.split('/')[0]
  imports.setdefault(name,[]).append({'file':str(p.relative_to(ROOT)),'specifier':spec})
mapSources=[]
for p in sorted((ROOT/'packages/ui/dist').rglob('*.map')):
 d=json.loads(p.read_text())
 mapSources.append({'file':str(p.relative_to(ROOT)),'sources':d.get('sources',[]),'hasSourcesContent':bool(d.get('sourcesContent'))})
rows=[]
for pkg in inv['packages']:
 if not any(s in pkg['scopes'] for s in ['runtime','runtime-optional','peer-realization']):continue
 rows.append({'id':pkg['id'],'scopes':pkg['scopes'],'direct':pkg['relationship']=='direct','observedExternalReferences':imports.get(pkg['name'],[]),'legalTextEvidence':[{'path':e['path'],'sha256':e['sha256']} for m in pkg['metadata'] for e in m['evidence']],'distribution':'external dependency or peer/type edge; lock reachability alone does not establish emitted third-party bytes','proposedSupplement':any(c['id']==pkg['id'] for c in changes)})
# Recursively retain legal-file path/hash evidence for all eight Apache packages, not merely their package roots.
apache=[]
for pkg in inv['packages']:
 if 'runtime' not in pkg['scopes'] or not any(m['license']=='Apache-2.0' for m in pkg['metadata']):continue
 for m in pkg['metadata']:
  base=(ROOT/'packages/ui'/m['path']).parent
  legal=[{'path':str(p.relative_to(ROOT)),'sha256':sha(p.read_bytes())} for p in sorted(base.rglob('*')) if p.is_file() and re.match(r'^(licen[sc]e|notice|copying)(?:[.-].*)?$',p.name,re.I)]
  apache.append({'id':pkg['id'],'legalFiles':legal,'limit':'Named legal files scanned recursively in installed package only; inline provenance and modifications still require review.'})
put('evidence.json',{'capturedAt':datetime.now(timezone.utc).isoformat(),'inputHashes':inputs,'reusedInputsMatch':True,'source':'Existing installed license bytes, current dist and coordinator actual-pack-equality receipt; no new pack/build/install','currentBuildHashes':files,'coordinatorBuildDelta':delta,'coordinatorPackedEqualityReceipt':'docs/developer/final-acceptance/coordinator-integration/package.txt','existingLegalBlocksPreserved':len(blocks(original)),'supplementalNotices':changes,'fullTextCoverage':{'inspected':len(comparison),'existingMissing':len(changes),'proposedMissing':0},'apacheLegalFiles':apache,'limits':['No final candidate tarball retained by prior checker; current dist is not a new tarball identity.','Notice drafts are not integrated or legally approved.','No legal approval, copied-code absence or NOTICE completeness inferred from text matching.']})
put('distribution-map.json',{'runtimeClosure':rows,'externalReferenceScan':'Bounded lexical import scan; independent TypeScript AST receipt supplies syntactic evidence. No runtime execution.','sourceMaps':mapSources,'distributionRoots':inv['distributionRoots'],'previousAssetCandidates':inv['assets'],'developmentOnlyComparisonRows':[],'limit':'All 18 compared missing texts are runtime-reachable (two also dev), not development-only. Type edges do not imply JS bundling; no transitive package is claimed present solely from dependency reachability.'})
print(json.dumps({'proposedFullTextAdditions':len(changes),'legalBlocksPreserved':len(blocks(original)),'currentBuildFiles':len(files),'coordinatorBuildDelta':len(delta),'runtimeClosure':len(rows),'apachePackages':len(apache)},indent=2))
