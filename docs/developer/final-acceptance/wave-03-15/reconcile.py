import hashlib,json,pathlib,datetime,subprocess
root=pathlib.Path(__file__).resolve().parents[4];out=pathlib.Path(__file__).resolve().parent
sha=lambda data:hashlib.sha256(data).hexdigest()
read=lambda path:json.loads((root/path).read_text())
prior=read('docs/developer/final-acceptance/parallel-12/evidence.json');integration=read('docs/developer/final-acceptance/coordinator-integration/evidence.json');assignment=json.loads((out/'assignment.json').read_text())
comparisons={}
for path,item in prior['inputComparisons'].items():
 file=root/path;current=sha(file.read_bytes()) if file.exists() else None
 comparisons[path]={'priorSha256':item['sha256'],'currentSha256':current,'equal':current==item['sha256']}
wrappers={name:{**item,'currentSha256':sha((root/item['file']).read_bytes()),'unchanged':comparisons[item['file']]['equal']}for name,item in prior['implementations'].items()}
map_now=read('packages/ui/src/experimental/icons/icon-map.json')
assert len(wrappers)==len(map_now)==96
assert all(item['unchanged'] and map_now[name[:-4]]==item['vector'] for name,item in wrappers.items())
notice=(root/'THIRD_PARTY_NOTICES.md').read_bytes();package_notice=(root/'packages/ui/THIRD_PARTY_NOTICES.md').read_bytes();license=(root/'packages/ui/node_modules/lucide-react/LICENSE').read_bytes()
assert notice==package_notice and license in notice
prior_reports={}
for item in assignment['priorEvidence'].values():
 for key in ['report','results']:
  p=item[key];current=sha((root/p).read_bytes());assert current==item[key+'Sha256'];prior_reports[p]=current
inputs=['AGENTS.md','docs/developer/react-aria-final-acceptance.md','docs/developer/final-acceptance/wave-03-15/assignment.json','docs/developer/final-acceptance/coordinator-integration/evidence.json','packages/ui/package.json','apps/docs/theme/resolve-theme.ts','apps/docs/theme/theme-graph.ts','apps/docs/theme/palettes.ts','apps/docs/examples/catalog/primitives-actions.tsx','apps/docs/components/Example.tsx','packages/ui/dist/styles.css','packages/ui/dist/icons/index.js','packages/ui/dist/theme/index.js','packages/ui/dist/components/Button/Button.js']
receipt={'schemaVersion':1,'capturedAt':datetime.datetime.now(datetime.timezone.utc).isoformat(),'head':subprocess.check_output(['git','rev-parse','HEAD'],cwd=root,text=True).strip(),'runtime':subprocess.check_output(['node','--version'],cwd=root,text=True).strip(),'source':'Modified shared dev working tree; authored only wave-03-15','priorReports':prior_reports,'priorInputComparisons':comparisons,'changedPriorInputs':{p:x for p,x in comparisons.items() if not x['equal']},'wrappers':wrappers,'inputHashes':{p:sha((root/p).read_bytes())for p in inputs},'notices':{'equal':notice==package_notice,'installedLicenseRetainedVerbatim':license in notice,'noticeSha256':sha(notice),'installedLicenseSha256':sha(license),'legalApproval':False},'integrationEvidenceSha256':sha((root/'docs/developer/final-acceptance/coordinator-integration/evidence.json').read_bytes())}
(out/'input-receipt.json').write_text(json.dumps(receipt,indent=2)+'\n')
print(json.dumps({'wrappersUnchanged':len(wrappers),'mappingParity':True,'changedPriorInputs':list(receipt['changedPriorInputs']),'notices':receipt['notices']},indent=2))
