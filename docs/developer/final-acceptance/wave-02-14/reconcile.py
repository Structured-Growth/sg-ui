import json, hashlib, re, subprocess, datetime
from pathlib import Path
root=Path.cwd(); out=root/'docs/developer/final-acceptance/wave-02-14'
def read(f): return json.loads((root/f).read_text())
def digest(p): return hashlib.sha256(p.read_bytes()).hexdigest() if p.is_file() else None
def save(name,value): (out/name).write_text(json.dumps(value,indent=2,ensure_ascii=False)+'\n')
snap=read('docs/developer/final-acceptance/2026-10-16-source-inventory.json'); inv=read('docs/developer/final-acceptance/2026-10-16-inventory.json')
base='docs/developer/final-acceptance/'
manifest=read(base+'parallel-15/manifest-audit.json'); api=read(base+'parallel-01/api-snapshot.json')
# Reuse saved inventory; hash its input set for change attribution, without rebuilding its AST/dependency scan.
changes=[]
for f,h in snap['inputHashes'].items():
 current=digest(root/f)
 if current!=h: changes.append({'file':f,'fa02':h,'current':current})
# Supplement only broad/case-insensitive/extensionless cases the old regex could miss.
old=re.compile(r'@mui\b|@emotion\b|\bMui[A-Z]\w*|\bmaterial-ui\b|mui-typography|baseGridSx')
broad=re.compile(r'mui|emotion|material-ui|material design|basegridsx',re.I)
tracked=subprocess.check_output(['git','ls-files','-z']).decode().split('\0'); supplements=[]; excluded=[]; binary=[]
for f in filter(None,tracked):
 if f.startswith('.obsidian/') or re.search(r'(^|/)\.env(?:\.|$)',f): excluded.append({'file':f,'reason':'personal state/credential boundary; not read'});continue
 if f.startswith('docs/developer/final-acceptance/'): excluded.append({'file':f,'reason':'audit-generated evidence; classified by receipt provenance, not active requirements'});continue
 p=root/f
 if not p.is_file(): continue
 data=p.read_bytes()
 if b'\0' in data: binary.append(f);continue
 try: text=data.decode('utf8')
 except UnicodeDecodeError:binary.append(f);continue
 # Existing narrow hits already classified in FA02; collect new-pattern or previously unindexed file hits.
 hits=[{'line':i,'text':s} for i,s in enumerate(text.splitlines(),1) if broad.search(s) and (f not in snap['inputHashes'] or not old.search(s))]
 if hits:
  classification='historical-or-migration-guidance' if f.startswith('docs/') else 'legal-preserve' if 'LICENSE' in f or 'NOTICES' in f else 'guard-or-negative-test' if '/scripts/' in f or '.test.' in f else 'agent-policy-prohibition' if f=='AGENTS.md' else 'source-review' if '/src/' in f else 'opaque-integrity-or-config-review'
  supplements.append({'file':f,'sha256':digest(p),'classification':classification,'hits':hits})
refs={'savedClassifications':snap['retiredReferences'],'supplementalPattern':broad.pattern,'supplementalMatches':supplements,'excludedExplicitly':excluded,'nonUtf8OrBinary':binary,'limits':'Reuses prior narrow-match classifications. Supplemental rows only contain cases omitted by the old case-sensitive pattern or extension filter. No credential/personal state was read.'}
save('reference-dispositions.json',refs)
# Produce reviewable amendments; preserve original sourceRepository/sourceCommit/sourceRoot and all source fields.
proposal=[]
for row in manifest['manifestRows']:
 if not row['presenceMatches']:
  candidates=[row.get('fixture'),row.get('renameCandidate')]
  candidates=[c for c in candidates if c]
  if row['source']=='components/AppButton/AppButton.stories.tsx': candidates=['apps/docs/native-fixtures/scenarios/experimental/Button/Button.fixture.tsx']
  normalized=[]
  for c in candidates:
   if isinstance(c,dict): normalized.append(c);continue
   normalized.append({'path':c,'exists':(root/c).is_file(),'sha256':digest(root/c),'assertionParityVerified':False})
  proposal.append({'source':row['source'],'destination':row['declaredDestination'],'currentPresent':row['declaredPresent'],'proposedPresent':False,'proposedMigrationStatus':'replaced-in-docs-native-host' if row.get('fixture') or row['source'].endswith('.stories.tsx') else 'renamed','replacementCandidates':normalized,'requiredReview':'Verify retained original assertions/contract and record exact replacement before applying. Preserve original source provenance; normalize current paths only.'})
save('manifest-amendments.json',{'sourceProvenance':manifest['sourceProvenance'],'amendments':proposal,'originalManifestSha256':digest(root/'docs/extraction-manifest.json'),'applied':False})
# Capture relevant roots, not another build/output inventory.
inputs=list(dict.fromkeys(['AGENTS.md','README.md','LICENSE','THIRD_PARTY_NOTICES.md','packages/ui/LICENSE','packages/ui/THIRD_PARTY_NOTICES.md','package.json','packages/ui/package.json','apps/docs/package.json','pnpm-lock.yaml','docs/extraction-manifest.json','docs/commercial-licensing.md','docs/developer/react-aria-removal-audit.md','docs/developer/react-aria-license-inventory.md','docs/developer/react-aria-package-acceptance.md','docs/developer/react-aria-runtime-ci.md','docs/developer/react-aria-release-gate-audit.md','docs/developer/react-aria-public-api-reconciliation.md','docs/migration.md','.github/workflows/ci.yml','.github/workflows/release.yml','.github/workflows/ai-code.yml','packages/ui/release.config.mjs','packages/ui/scripts/check-package.mjs','packages/ui/scripts/check-foundations.mjs','packages/ui/scripts/release-policy.test.mjs','packages/ui/scripts/test-foundation-consumer.mjs','packages/ui/scripts/test-editor-consumer.mjs','packages/ui/scripts/test-next-consumer.mjs']+[base+x for x in ['fa04-package.txt','fa04-release.txt','fa04-original-check.txt','fa04-calendar-rerun.txt','fa04-library-input-delta.json','fa04-library.txt','fa04-fixtures.txt','parallel-01/report.md','parallel-01/api-snapshot.json','parallel-15/report.md','parallel-15/manifest-audit.json','parallel-reconciliation-2026-10-16.json']] ))
receipt={'capturedAt':datetime.datetime.now(datetime.timezone.utc).isoformat(),'head':subprocess.check_output(['git','rev-parse','HEAD']).decode().strip(),'branch':subprocess.check_output(['git','branch','--show-current']).decode().strip(),'inputs':[{'file':f,'sha256':digest(root/f),'fa02':snap['inputHashes'].get(f)} for f in inputs],'fa02InputDeltas':changes,'trackedFileCount':len(list(filter(None,tracked))),'savedDependencyNodes':len(snap['installedDependencies']['nodes']),'savedDependencyEdges':len(snap['installedDependencies']['edges']),'retiredDependencyNodes':[x for x in snap['installedDependencies']['nodes'] if re.search(r'^@mui/|^@emotion/|^@material-ui/|^emotion$|^material-ui$',x['name'])],'apiSnapshotSourcesChanged':[{'file':f,'snapshot':v['sha256'],'current':digest(root/f)} for f,v in api['sources'].items() if digest(root/f)!=v['sha256']],'apiSnapshotDeclarationsChanged':[{'file':f,'snapshot':v['sha256'],'current':digest(root/f)} for f,v in api['declarations'].items() if digest(root/f)!=v['sha256']],'legalRootAndPackageCopiesEqual':{'LICENSE':digest(root/'LICENSE')==digest(root/'packages/ui/LICENSE'),'THIRD_PARTY_NOTICES.md':digest(root/'THIRD_PARTY_NOTICES.md')==digest(root/'packages/ui/THIRD_PARTY_NOTICES.md')},'noBuildOrTestRerun':True,'supplementalFiles':len(supplements),'manifestAmendments':len(proposal)}
save('evidence.json',receipt)
print(json.dumps({k:receipt[k] for k in ['head','trackedFileCount','savedDependencyNodes','savedDependencyEdges','retiredDependencyNodes','apiSnapshotSourcesChanged','apiSnapshotDeclarationsChanged','legalRootAndPackageCopiesEqual','supplementalFiles','manifestAmendments']},indent=2))
print('Supplement file classifications:',[(x['file'],x['classification'],len(x['hits'])) for x in supplements])
print('Changed source inputs:',[x['file'] for x in changes if x['file'].startswith('packages/ui/src/')])
# Reviewer decisions after inspecting every supplemental row, including incidental substrings.
for row in refs['supplementalMatches']:
 f=row['file']
 if f in ['packages/ui/src/foundation/tokens.json','apps/docs/native-fixtures/token-source.json']:
  row['reviewDisposition']='false-positive: scaleMotionDuration contains emotion across the word boundary; owned motion token, no retired code'
 elif f=='pnpm-lock.yaml': row['reviewDisposition']='four opaque integrity-string substrings; not package keys or dependency requirements'
 elif f=='apps/docs/components/demo-theme.ts' or '/tests/' in f and f.startswith('apps/docs/'):
  row['reviewDisposition']='Material Design is an intentional independent docs demo identity/test label, not retired implementation use'
 elif row['classification']=='legal-preserve': row['reviewDisposition']='retain pending associated-source/asset provenance and legal-owner review; stale current-use descriptions are separately identified'
 elif row['classification']=='guard-or-negative-test': row['reviewDisposition']='executable rejection assertion/guard, not a retired runtime requirement'
 elif f=='AGENTS.md':row['reviewDisposition']='prohibitions on retired foundation; no positive import/styling instruction'
 else: row['reviewDisposition']='historical receipt, removed-API migration mapping, source of design-reference inspiration, or explicit removal requirement; retain dated evidence, rewrite inaccurate current-use assertions only'
save('reference-dispositions.json',refs)
legal=read(base+'wave-02-05/license-inventory.json'); textcomp=read(base+'wave-02-05/license-text-comparison.json')
notice={'reusedInventory':{'path':base+'wave-02-05/license-inventory.json','sha256':digest(root/(base+'wave-02-05/license-inventory.json')),'inputs':legal['inputs'],'manifestMatchesCurrent':legal['inputs']['manifestSha256']==digest(root/'packages/ui/package.json'),'lockMatchesCurrent':legal['inputs']['lockSha256']==digest(root/'pnpm-lock.yaml')},'reusedTextComparison':{'path':base+'wave-02-05/license-text-comparison.json','sha256':digest(root/(base+'wave-02-05/license-text-comparison.json')),'entries':len(textcomp),'normalizedTextNotContained':[x for x in textcomp if not x['normalizedTextContainedInNotices']],'limits':'String containment failure is not a legal conclusion; generic/multi-package notices, NOTICE obligations, bundled/derived assets and actual shipping reachability need review.'},'retiredHeadings':[n for n in legal['notices'] if re.search(r'^@(mui|emotion)/',n.get('id',''))],'legalCopiesEqual':receipt['legalRootAndPackageCopiesEqual'],'reviewDecisions':[],'applied':False}
for n in notice['retiredHeadings']:
 notice['reviewDecisions'].append({'package':n['id'],'noticeLine':n['line'],'currentLocked':n['locked'],'disposition':'preserve-until-provenance-review','requiredEvidence':'Map all original extracted files/assets derived from this package to their final owned replacements, identify retained fragments and LICENSE/NOTICE obligations, then join exact packed file hashes and owner-approved disposition. Dependency/reference absence alone does not authorize deleting this section.'})
notice['proposedFactualCorrections']=[{'files':['LICENSE','packages/ui/LICENSE'],'section':'7, current-use package list','proposal':'Replace the current-use list with a verified final dependency-family list after provenance review; preserve separate third-party rights and all commercial terms.','ownerRequired':True},{'files':['THIRD_PARTY_NOTICES.md','packages/ui/THIRD_PARTY_NOTICES.md'],'section':'Introduction / five retired sections / React Aria proof heading','proposal':'Describe retained historical/derived notices distinctly from current direct packages; relabel React Aria proof dependencies as current implementation dependencies once final coverage is verified.','ownerRequired':True},{'file':'docs/commercial-licensing.md','section':'third-party paragraph','proposal':'Align current-use list and complete-notices claim to the reviewed final artifact; do not claim legal approval or publication from public package configuration.','ownerRequired':True}]
save('notice-review.json',notice)
# Concrete updates for active prose; no rewrite of baseline captures or Git history.
save('reference-rewrite-proposals.json',{'applied':False,'preserveUnchanged':['Git history','original host application repository/commit/source paths','dated baseline snapshots','dated acceptance receipts','negative regression guards','precise removed public API names needed by migration guides'],'proposals':[{'file':'docs/extraction-manifest.json','deliverable':'Apply reviewed manifest-amendments.json rows; keep sourceRepository/sourceCommit/sourceRoot and source fields exactly unchanged. Do not rename historical source paths merely to erase a branded word.'},{'file':'docs/developer/react-aria-removal-audit.md','deliverable':'Add a current dated host/scope paragraph: Storybook output discussion is historical; current native host is apps/docs/native-fixtures and package guards are under packages/ui/scripts. Keep original dated counts separately.'},{'file':'docs/developer/react-aria-i18n-acceptance.md','deliverable':'Replace current fixture path/runtime references with migrated docs-native IDs while retaining 2026-10-07 Storybook execution as historical evidence (prior parallel-14 successor).'},*notice['proposedFactualCorrections']],'decisionStillRequired':'Accept explicit historical/legal-reference exceptions or define a provenance-preserving representation if literal zero retired-name text is demanded. Current reports do not silently waive the original Z-05 obligation.'})
print('Notice handoff reuses wave-02-05:',notice['reusedInventory']['manifestMatchesCurrent'],notice['reusedInventory']['lockMatchesCurrent'],len(notice['retiredHeadings']))
