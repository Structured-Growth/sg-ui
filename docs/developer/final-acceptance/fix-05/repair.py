"""Apply only the 36 saved stale rows; receipt/verification output stays here."""
import datetime, hashlib, json, pathlib, re, subprocess
root=pathlib.Path(__file__).resolve().parents[4]
out=pathlib.Path(__file__).resolve().parent
manifest_path=root/'docs/extraction-manifest.json'
def read(p): return (root/p).read_bytes()
def sha(b): return hashlib.sha256(b).hexdigest()
def save(p,v): (out/p).write_text(json.dumps(v,indent=2)+'\n')
def git(*args): return subprocess.run(['git',*args],cwd=root,capture_output=True)
def workspace(p): return 'packages/ui/'+p if p.startswith('src/') else p
old=git('show','HEAD:docs/extraction-manifest.json').stdout
allowed=[sha(old)]
if (out/'changes.json').exists(): allowed.append(json.loads((out/'changes.json').read_text())['manifestAfterSha256'])
assert sha(manifest_path.read_bytes()) in allowed, 'Manifest changed outside this repair; review before applying'
manifest=json.loads(old)
audit=json.loads(read('docs/developer/final-acceptance/parallel-15/manifest-audit.json'))
assert len(manifest['files'])==len(audit['manifestRows'])==201
assert {k:manifest[k] for k in audit['sourceProvenance']}==audit['sourceProvenance']
changed=[]
for entry,row in zip(manifest['files'],audit['manifestRows']):
 assert entry['source']==row['source'] and entry['destination']==row['declaredDestination']
 if row['presenceMatches']: continue
 before=json.loads(json.dumps(entry))
 entry['present']=False
 if row['fixture']:
  entry['migration']={'status':'removed','replacements':[row['fixture']]}
 elif row['renameCandidate']:
  replacement=row['renameCandidate'].removeprefix('packages/ui/')
  if entry['source']=='components/AppButton/AppButton.test.tsx': replacement='src/components/Button/Button.public-contract.test.tsx'
  entry['migration']={'status':'renamed','replacements':[replacement]}
 else:
  assert entry['source']=='components/AppButton/AppButton.stories.tsx'
  entry['migration']={'status':'removed','replacements':['apps/docs/native-fixtures/scenarios/experimental/Button/Button.fixture.tsx','apps/docs/examples/catalog/primitives-actions.tsx'], 'evidenceLimit':'Related current Button examples; no exact AppButton story mapping in the docs-native migration manifest. Local historical stories have no executable assertions. Original-platform assertion lineage remains unverified; see docs/developer/final-acceptance/fix-05/report.md.'}
 changed.append({'source':entry['source'],'before':before,'after':entry})
assert len(changed)==36
manifest['presenceScope']='Current destinations interpret src/ relative to packages/ui; original repository, commit and source paths retain extraction provenance. Removed stories use docs-native replacement hosts; replacement presence does not establish assertion or behavior equivalence.'
manifest_path.write_text(json.dumps(manifest,indent=2)+'\n')
save('changes.json',{'manifestBeforeSha256':sha(old),'manifestAfterSha256':sha(manifest_path.read_bytes()),'changedRows':changed,'topLevelChange':'presenceScope clarifies workspace relocation and replacement-host evidence limits'})
# Validate all rows and every replacement, including the six already recorded migrations.
checks=[]; replacements=[]
for entry in manifest['files']:
 p=workspace(entry['destination']); exists=(root/p).is_file()
 checks.append({'source':entry['source'],'destination':p,'present':entry['present'],'exists':exists})
 assert exists==entry['present'],p
 for replacement in entry.get('migration',{}).get('replacements',[]):
  p=workspace(replacement); assert (root/p).is_file(),p
  replacements.append({'source':entry['source'],'path':p,'sha256':sha(read(p))})
assert len(checks)==201
# Retain Git identity/hashes only; do not create copies of historical source.
story='src/components/AppButton/AppButton.stories.tsx'
history=[]
for revision in ['21adebd61bedfc6a1ed395fe664ff4be83896821','8f41479c6f2ea5822ff0c149e359e2c6e0893f13','530bbc00465d9dbf1e9948f8a2c01b2e51b1a479^']:
 result=git('show',revision+':'+story); assert result.returncode==0
 source=result.stdout.decode()
 history.append({'revision':revision,'path':story,'blob':git('rev-parse',revision+':'+story).stdout.decode().strip(),'sha256':sha(result.stdout),'exports':re.findall(r'export const (\w+)',source),'playOrAssertionCalls':re.findall(r'\b(?:play\s*:|expect\s*\(|assert\s*\()',source)})
prior='src/components/AppButton/AppButton.test.tsx'
result=git('show','530bbc00465d9dbf1e9948f8a2c01b2e51b1a479^:'+prior); assert result.returncode==0
current='packages/ui/src/components/Button/Button.public-contract.test.tsx'
assert result.stdout.decode().replace('AppButton','Button')==read(current).decode()
native=json.loads(read('apps/docs/native-fixtures/migration-manifest.json'))
button_module=[r for r in native['modules'] if r['original']=='packages/ui/src/experimental/Button/Button.stories.tsx']
assert len(button_module)==1
assert not any('/AppButton/' in r['original'] for r in native['modules'])
source_object=git('cat-file','-t',manifest['sourceCommit'])
lineage={'localStoryHistory':history,'unitAssertionContinuity':{'originalRevision':'530bbc00465d9dbf1e9948f8a2c01b2e51b1a479^','originalPath':prior,'originalBlob':git('rev-parse','530bbc00465d9dbf1e9948f8a2c01b2e51b1a479^:'+prior).stdout.decode().strip(),'currentPath':current,'matchesAfterAppButtonToButtonRename':True,'currentSha256':sha(read(current))},'exactNativeButtonMapping':button_module[0],'appButtonExactNativeMapping':None,'originalPlatformCommitObjectAvailable':source_object.returncode==0,'proposedStoryMappings':[{'originalExport':'Default','current':'apps/docs/examples/catalog/primitives-actions.tsx: Button overview / playground','basis':'Continue label and owned action props; content comparison only'},{'originalExport':'Variants','current':'apps/docs/native-fixtures/scenarios/experimental/Button/Button.fixture.tsx: ThemesAndDensity; catalog Button variant examples','basis':'filled/outlined/text successors; original contained contract intentionally migrated'},{'originalExport':'PendingAndDisabled','current':'apps/docs/native-fixtures/scenarios/experimental/Button/Button.fixture.tsx: ThemesAndDensity','basis':'loading, disabled, dark and compact present; content comparison only'},{'originalExport':'NativeForm','current':'packages/ui/src/components/Button/Button.public-contract.test.tsx: native form test; Button fixture NativeFormTransitions','basis':'unit assertions survive exact name substitution; fixture has different labels/event output'}],'successor':'A-B-12/story-lineage: attach source-commit-bound original-platform evidence or explicitly reconcile/accept the proposed AppButton story mappings in migration metadata. This receipt proves local unit assertion continuity, not original-platform or native execution equivalence.'}
save('button-lineage.json',lineage)
inputs=['AGENTS.md','docs/developer/react-aria-final-acceptance.md','docs/developer/final-acceptance/parallel-15/report.md','docs/developer/final-acceptance/parallel-15/manifest-audit.json','apps/docs/native-fixtures/migration-manifest.json','docs/developer/docs-fixture-migration.md','docs/developer/react-aria-button.md','apps/docs/examples/catalog/primitives-actions.tsx','packages/ui/tests/browser/batch13-control-button.spec.ts','apps/docs/tests/button-documentation.spec.ts']
save('validation.json',{'capturedAt':datetime.datetime.now(datetime.timezone.utc).isoformat(),'head':git('rev-parse','HEAD').stdout.decode().strip(),'summary':{'rows':201,'present':sum(r['exists'] for r in checks),'absent':sum(not r['exists'] for r in checks),'presenceMismatches':0,'repairedRows':36,'exactStoryFixtureMappings':32,'renamedButtonRows':3,'qualifiedStoryMappingRows':1,'replacementReferencesChecked':len(replacements),'uniqueReplacementPathsChecked':len(set(r['path'] for r in replacements))},'rows':checks,'replacementChecks':replacements,'inputHashes':{p:sha(read(p)) for p in inputs},'executed':'Python JSON/provenance/path/hash validation and bounded local git show/log/rev-parse/cat-file reads only','notExecuted':['unit tests','builds','browser or packed consumer suites','device or AT checks','remote CI','legal review']})
print('PASS: 201 presence flags, 36 repaired rows, all '+str(len(replacements))+' replacement references; original provenance unchanged; local unit assertion rename continuity verified.')
