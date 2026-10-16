"""Read-only source/output comparison; writes receipts exclusively beside this script."""
import datetime, hashlib, json, pathlib, platform, subprocess, zipfile
HERE = pathlib.Path(__file__).resolve().parent
ROOT = HERE.parents[3]
def sha(path): return hashlib.sha256(path.read_bytes()).hexdigest()
def read(path): return json.loads(path.read_text())
prior = {}
for name in ['wave-02-12', 'wave-02-14']:
    data = read(HERE.parent / name / 'evidence.json')['inputs']
    values = data.items() if isinstance(data, dict) else ((v['file'], v) for v in data)
    prior[name] = [{ 'path': file, 'recorded': val['sha256'], 'current': sha(ROOT/file) if (ROOT/file).is_file() else None } for file, val in values]
coord_path = HERE.parent / 'coordinator-integration/evidence.json'
coord = read(coord_path)
comparison = {}
for key, values in coord.items():
    if 'hash' not in key.lower() or not isinstance(values, dict): continue
    comparison[key] = []
    for name, expected in values.items():
        file = ROOT/name if (ROOT/name).is_file() else coord_path.parent/name
        actual = sha(file) if file.is_file() else None
        comparison[key].append({'path':str(file.relative_to(ROOT)), 'recorded':expected, 'current':actual, 'matches':actual==expected})
(HERE/'coordinator-hash-comparison.json').write_text(json.dumps(comparison,indent=2)+'\n')
inputs = ['AGENTS.md', 'docs/developer/react-aria-final-acceptance.md', 'docs/developer/react-aria-runtime-ci.md', 'docs/github-setup.md', 'docs/developer/react-aria-development-validation.md', 'package.json', 'pnpm-lock.yaml', 'apps/docs/package.json', 'apps/docs/playwright.config.ts', 'apps/docs/native-fixtures/vite.config.ts', 'apps/docs/native-fixtures/generate-registry.mjs', 'packages/ui/package.json', 'packages/ui/playwright.config.ts', 'packages/ui/scripts/build.mjs', 'packages/ui/scripts/build-browser-docs.mjs', 'packages/ui/scripts/check-package.mjs', 'packages/ui/scripts/test-foundation-consumer.mjs', 'packages/ui/scripts/test-editor-consumer.mjs', 'packages/ui/scripts/test-next-consumer.mjs']
inputs += [str(p.relative_to(ROOT)) for p in (ROOT/'.github/workflows').glob('*.yml')]
retrievals=[]
for artifact in [11592107473,11591665449,11455963120]:
    archive=HERE/f'remote/artifact-{artifact}.zip'
    run=37873270629 if artifact!=11455963120 else 37559276148
    metadata=next(v for v in read(HERE/f'remote/{run}-artifacts.json')['artifacts'] if v['id']==artifact)
    if archive.exists(): retrievals.append({'id':artifact,'run':run,'name':metadata['name'],'archiveSha256':sha(archive),'apiDigest':metadata['digest'],'digestMatches':metadata['digest']=='sha256:'+sha(archive),'expiresAt':metadata['expires_at'],'apiExpired':metadata['expired'],'files':zipfile.ZipFile(archive).namelist()})
e={
 'schemaVersion':1,'capturedAt':datetime.datetime.now(datetime.timezone.utc).isoformat(),
 'head':subprocess.check_output(['git','rev-parse','HEAD'],cwd=ROOT,text=True).strip(),
 'branch':subprocess.check_output(['git','branch','--show-current'],cwd=ROOT,text=True).strip(),
 'runtime':{'node':subprocess.check_output(['node','--version'],text=True).strip(),'python':platform.python_version()},
 'inputHashes':{f:sha(ROOT/f) for f in inputs},
 'priorComparisons':prior,
 'priorReportHashChecks':[{ 'path':str((HERE.parent/name/file).relative_to(ROOT)), 'sha256':sha(HERE.parent/name/file)} for name in ['wave-02-12','wave-02-14'] for file in ['report.md','results.json']],
 'coordinatorEvidenceSha256':sha(coord_path),
 'coordinatorSummary':{key:{'compared':len(v),'matching':sum(x['matches'] for x in v),'changed':[x for x in v if not x['matches']]} for key,v in comparison.items()},
 'retrievals':retrievals,
 'artifactHashes':{str(f.relative_to(HERE)):sha(f) for f in HERE.rglob('*') if f.is_file() and f.name not in ['evidence.json','report.md','results.json','hash-summary.json','delivery-sha256.json']},
 'limits':['Only owned evidence directory written; proposed-files mirrors and patch are not integrated.', 'Local Node26 source/tool tests are not supported Node22/24 or Actions/native execution.', 'Coordinator Node24 receipts reused only at compared input/output hashes; no fresh packed React-version/browser matrix or new remote native-host run.', 'No owner policy approval, action-code security audit, release, publication or remote mutation.']}
(HERE/'evidence.json').write_text(json.dumps(e,indent=2)+'\n')
print(json.dumps({'runtime':e['runtime'],'coordinatorSummary':e['coordinatorSummary'],'archiveDigestsMatch':all(x['digestMatches'] for x in retrievals),'priorDeltaCounts':{k:sum(x['current']!=x['recorded'] for x in v) for k,v in prior.items()}},indent=2))
