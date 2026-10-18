from pathlib import Path
import hashlib, json, difflib, subprocess, importlib.util, sys
sys.dont_write_bytecode = True
root=Path.cwd(); own=root/'docs/developer/final-acceptance/wave-04/13'
def digest(p): return hashlib.sha256(p.read_bytes()).hexdigest()
def save(name,d): (own/name).write_text(json.dumps(d,indent=2)+'\n')
patch=[]; bases={}
changes={
 'THIRD_PARTY_NOTICES.md': [('on these packages; no upstream implementation or example stylesheet was copied\nor modified.', 'on these packages. Copied or adapted upstream code, example stylesheets, inline\nattribution and any required modified-file notices remain subject to the final\nsource-provenance review; dependency declarations alone do not establish their absence.')],
 'packages/ui/THIRD_PARTY_NOTICES.md': [('on these packages; no upstream implementation or example stylesheet was copied\nor modified.', 'on these packages. Copied or adapted upstream code, example stylesheets, inline\nattribution and any required modified-file notices remain subject to the final\nsource-provenance review; dependency declarations alone do not establish their absence.')],
 'docs/developer/react-aria-architecture.md': [('behavior checks, docs/native-fixture and packed-consumer validation. No upstream examples,\nimplementation code or icon assets were copied. Adobe dependencies retain Apache\n2.0 licensing; existing commercial terms and notices remain in place.', 'behavior checks, docs/native-fixture and packed-consumer validation. Current icon\nwrappers import Lucide components; that observation does not establish historical\nsource or asset provenance. Final review must resolve copied/adapted implementation,\nexample and asset attribution, including any required modified-file notices. Adobe\ndependencies retain Apache 2.0 licensing; existing commercial terms and notices\nremain in place.')]
}
name='docs/developer/react-aria-license-inventory.md'
before=(root/name).read_bytes().decode()
changes[name]=[(before,before+(own/'license-addendum.md').read_text())]
for name,replacements in changes.items():
 before=(root/name).read_bytes().decode(); after=before
 for old,new in replacements:
  assert after.count(old)==1,name
  after=after.replace(old,new)
 target=own/'proposed-files'/name; target.parent.mkdir(parents=True,exist_ok=True);target.write_text(after)
 bases[name]=digest(root/name)
 patch.extend(difflib.unified_diff(before.splitlines(True),after.splitlines(True),fromfile='a/'+name,tofile='b/'+name))
(own/'provenance-wording.patch').write_text(''.join(patch));save('patch-preconditions.json',bases)
prior=json.loads((root/'docs/developer/final-acceptance/wave-03-06/evidence.json').read_text())
comparison=[]
for name,old in prior['inputHashes'].items():
 if name.startswith('node_modules/') or name in ['packages/ui/package.json','pnpm-lock.yaml','node_modules/.pnpm/lock.yaml']:
  p=root/name; new=digest(p) if p.is_file() else None
  comparison.append({'file':name,'priorSha256':old,'currentSha256':new,'equal':old==new})
refs=['AGENTS.md','docs/developer/react-aria-final-acceptance.md','docs/developer/react-aria-hardening-execution.md','docs/developer/react-aria-license-inventory.md','docs/developer/react-aria-dependency-upgrades.md','docs/developer/extraction-lineage.md','docs/agent-guidance-migration.md','package.json','packages/ui/package.json','apps/docs/package.json','pnpm-workspace.yaml','pnpm-lock.yaml','node_modules/.pnpm/lock.yaml','LICENSE','packages/ui/LICENSE','THIRD_PARTY_NOTICES.md','packages/ui/THIRD_PARTY_NOTICES.md','packages/ui/scripts/check-license-inventory.mjs','packages/ui/scripts/check-package.mjs']
for directory in ['wave-03-06','wave-03-07','wave-03-35','wave-03-38']:
 refs.extend('docs/developer/final-acceptance/'+directory+'/'+name for name in ['report.md','results.json','validation-plan.json'])
refs += ['docs/developer/final-acceptance/wave-03-integration/'+name for name in ['reconciliation.json','tooling-report.md','tooling-final-license-inventory.json','packed-reference-audit.json','push-evidence.json']]
refs += ['docs/developer/final-acceptance/'+name+'/results.json' for name in ['editor-chrome-presentation','rich-editor-presentation']]
inputs={name:digest(root/name) for name in refs}
inv=json.loads((root/'docs/developer/final-acceptance/wave-03-integration/tooling-final-license-inventory.json').read_text())
closure=[p for p in inv['packages'] if set(p['scopes'])&{'runtime','runtime-optional','peer-realization'}]
icons=list((root/'packages/ui/src/experimental/icons').glob('*.tsx'))
source_refs={str(p.relative_to(root)):digest(p) for p in icons if 'from "lucide-react"' in p.read_text()}
# Reuse reviewed archive reference scanner without overwriting its historical receipt.
spec=importlib.util.spec_from_file_location('packed', root/'docs/developer/final-acceptance/wave-03-35/audit-packed.py'); module=importlib.util.module_from_spec(spec);spec.loader.exec_module(module)
archive=root/'packages/ui/artifacts/wave03-frozen-package/structured-growth-sg-ui-0.0.0-development.tgz'
audit=module.audit(archive);save('retained-archive-reference-audit.json',audit)
save('evidence.json',{'head':subprocess.check_output(['git','rev-parse','HEAD'],text=True).strip(),'python':subprocess.check_output(['python3','--version'],text=True).strip(),'inputHashes':inputs,'unchangedPriorLicenseInputs':comparison,'closureCount':len(closure),'legalEvidenceRecords':sum(len(m['evidence']) for p in closure for m in p['metadata']),'iconImportEvidence':source_refs,'retainedArchive':{'path':str(archive.relative_to(root)),'sha256':digest(archive)},'limits':['No install, generation, build, pack or source execution. Existing archive is historical; current dist drift is separately recorded.','No ownership, legal, external upstream provenance or release approval inferred.']})
print(json.dumps({'compared':len(comparison),'changed':sum(not p['equal'] for p in comparison),'closure':len(closure),'iconsImportingLucide':len(source_refs),'archiveReferenceFindings':len(audit['errors'])}))
