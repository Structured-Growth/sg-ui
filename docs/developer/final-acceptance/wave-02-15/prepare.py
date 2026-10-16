"""Read saved inventories; emit bounded successor payloads only under this directory."""
import collections, datetime, difflib, hashlib, json, pathlib, re, subprocess
root=pathlib.Path(__file__).resolve().parents[4]; out=pathlib.Path(__file__).resolve().parent; base=root/'docs/developer/final-acceptance'
def read(p):return (root/p).read_text()
def load(p):return json.loads(read(p))
def digest(p):return hashlib.sha256((root/p).read_bytes()).hexdigest()
def save(name,value):(out/name).write_text(json.dumps(value,indent=2)+'\n')
api=load('docs/developer/final-acceptance/parallel-01/api-snapshot.json')
prior=load('docs/developer/final-acceptance/2026-10-16-source-inventory.json')
original=load('docs/developer/final-acceptance/parallel-15/manifest-audit.json')
graph=load('docs/developer/final-acceptance/parallel-02/graph-evidence.json')
# Reuse exact exported declarations; project owned properties without re-resolving routes.
areas={
 'visual':['variant','tone','size','density','placement','onDismiss','onClose','invalid','errorMessage','required'],
 'naming':['label','title','aria-label','aria-labelledby','aria-describedby','description','getRowLabel','getItemLabel'],
 'composition':['className','style','inputClassName','bodyClassName','bodyStyle','surfaceStyle','header','headerContent','footer','footerContent','children','startIcon','endIcon','renderCell','renderCard','renderActions','renderDayContent','ref'],
 'state':['value','defaultValue','onValueChange','checked','defaultChecked','onCheckedChange','selected','defaultSelected','onSelectedChange','open','defaultOpen','onOpenChange','disabled','readOnly','loading']}
rows=[]
for key,c in api['contracts'].items():
 declarations=c.get('declarations',[])
 candidates=[]
 for d in declarations:
  p=d['file'].replace('/dist/','/src/').replace('.d.ts','.tsx');p=p if (root/p).is_file() else p[:-1]
  if (root/p).is_file():candidates.append(p)
 source_unchanged=all(api['sources'].get(p,{}).get('sha256')==digest(p) for p in candidates) if candidates else None
 rows.append({'contractId':key,'name':c['name'],'routes':[route for route,items in api['routes'].items() if any(i['contract']==key for i in items)],'declarationReferences':[{k:v for k,v in d.items() if k!='text'} for d in declarations],'exactDeclarationTextRetainedIn':'../parallel-01/api-snapshot.json','propertyProjection':{area:[p for p in c['ownedProperties'] if p['name'] in names] for area,names in areas.items()},'sourceCandidates':candidates,'candidateSourceBytesUnchanged':source_unchanged,'notes':'Owned-property projection is an index, not resolution of inherited native DOM props or callback content. Empty projection means no captured owned property, not no contract.'})
save('public-contract-index.json',{'provenance':'FA-01 and parallel-01 frozen declaration snapshot; not rebuilt against coordinator source fixes','contracts':rows,'defaultCandidateClassification':dict(collections.Counter(c['kind'] for c in api['defaultCandidates'])),'unresolvedPublicDefaults':'Context/CSS/composed and helper-function fallback paths still need manual public-symbol normalization.'})
# Stage a reviewable manifest proposal, keeping source provenance and historical paths.
manifest=load('docs/extraction-manifest.json'); manifest['presenceScope']='Current destinations interpret src/ relative to packages/ui; original source paths retain extraction provenance. Fixture mappings describe replacement hosts, not automatic assertion equivalence.'
for entry,row in zip(manifest['files'],original['manifestRows']):
 if row['declaredPresent'] and not row['exists']:
  entry['present']=False
  replacements=[row['fixture']] if row['fixture'] else [row['renameCandidate'].replace('packages/ui/','')] if row['renameCandidate'] else ['apps/docs/native-fixtures/scenarios/experimental/Button/Button.fixture.tsx']
  entry['migration']={'status':'renamed' if row['renameCandidate'] else 'removed','replacements':replacements}
  if 'AppButton.stories' in row['declaredDestination']:entry['migration']['evidenceLimit']='Proposed Button host mapping; original assertion equivalence requires retained reference evidence.'
# Superseded by concurrent fix-05: preserve its reviewed maintained metadata.
# Produce exact patch for all 36 stale rows plus workspace presence interpretation.
# Exact, unapplied source-cycle type extraction patch. No maintained source writes.
virtual={}; replacements={}
for component in ['DateField','TimeField']:
 p=f'packages/ui/src/experimental/{component}/{component}.tsx'; text=read(p)
 match=re.search(r'export interface '+component+r'Props \{.*?\n\}',text,re.S); assert match
 contract=f'packages/ui/src/experimental/{component}/{component}.types.ts'
 virtual[contract]=match[0]+'\n'
 virtual[p]=text[:match.start()]+f'import type {{ {component}Props }} from "./{component}.types";\nexport type {{ {component}Props }} from "./{component}.types";'+text[match.end():]
 child=f'packages/ui/src/experimental/{component}/Text{component}.tsx'
 virtual[child]=read(child).replace(f'from "./{component}"',f'from "./{component}.types"')
p='packages/ui/src/adapters/navigation.tsx';text=read(p)
start=text.index('export type SGLinkProps');end=text.index('const defaultAdapter')
virtual['packages/ui/src/adapters/navigation.types.ts']='import type { AnchorHTMLAttributes, ComponentType, RefAttributes } from "react";\n'+text[start:end]
virtual[p]=text[:start]+'import type { SGNavigationAdapter } from "./navigation.types";\nexport type { SGLinkProps, SGNavigationAdapter } from "./navigation.types";\n'+text[end:]
virtual['packages/ui/src/adapters/navigationContext.ts']=read('packages/ui/src/adapters/navigationContext.ts').replace('from "./navigation"','from "./navigation.types"')
(out/'source-cycle-extraction.patch').write_text(''.join(''.join(difflib.unified_diff((read(p) if (root/p).exists() else '').splitlines(True),text.splitlines(True),fromfile='a/'+p if (root/p).exists() else '/dev/null',tofile='b/'+p)) for p,text in virtual.items()))
save('cycle-proposal.json',{'retainedGraph':'../parallel-02/graph-evidence.json','remainingRequirement':'Patch is unapplied and unexecuted; maintained resolved-root and SCC guard plus fixtures remain necessary.','newContracts':{p:v for p,v in virtual.items() if not (root/p).exists()},'originalCycleEdges':graph['allSourceCycles'],'sourceHashes':{p:digest(p) for p in virtual if (root/p).exists()}})
# Read a small local original-extraction contract closure; no original platform checkout.
ref='21adebd61bedfc6a1ed395fe664ff4be83896821'
paths=['src/hooks/usePersistentState.ts','src/hooks/usePersistentPaginationModel.ts','src/components/AdminDataGridOptions.ts','src/components/InstructorDataGridOptions.ts','src/components/PageRichTextEditorSection/lexical/ImageNode.tsx','src/components/PageRichTextEditorSection/lexical/editorConfig.ts']
history={}
for p in paths:
 r=subprocess.run(['git','show',f'{ref}:{p}'],cwd=root,text=True,capture_output=True)
 history[p]={'localCommit':ref,'exists':r.returncode==0,'text':r.stdout if r.returncode==0 else None,'sha256':hashlib.sha256(r.stdout.encode()).hexdigest() if r.returncode==0 else None,'error':r.stderr.strip() if r.returncode else None}
save('local-extraction-reference.json',{'scope':'Read-only sg-ui Git objects, not independent source-repository or native behavior validation','recordedOriginalProvenance':original['sourceProvenance'],'localExtractionCommit':ref,'files':history,'reusedHistoricalContracts':'../parallel-01/api-snapshot.json#historical'})
# Reconcile inputs using saved paths rather than another repository/export scan.
paths=set(api['sources']) | set(graph['supportingInputs']) if isinstance(graph['supportingInputs'],dict) else set(api['sources'])
paths.update(p for p in prior['inputHashes'] if p.startswith('packages/ui/src/') or p.startswith('packages/ui/scripts/tokens') or p.startswith('docs/developer/react-aria-') or p in ['docs/extraction-manifest.json','apps/docs/native-fixtures/migration-manifest.json','packages/ui/package.json','pnpm-lock.yaml'])
paths.update('docs/developer/final-acceptance/'+p for p in ['parallel-01/api-snapshot.json','parallel-02/graph-evidence.json','parallel-15/manifest-audit.json','parallel-reconciliation-2026-10-16.json'])
paths.update('docs/developer/final-acceptance/parallel-%02d/report.md'%i for i in range(1,16))
paths.add('docs/developer/react-aria-css-composition.md')
for fix in range(1,8):
 for name in ['report.md','results.json','validation.json','doc-validation.json','parity.json','button-lineage.json']:
  p=f'docs/developer/final-acceptance/fix-{fix:02}/{name}'
  if (root/p).is_file():paths.add(p)
hashes={p:digest(p) for p in sorted(paths) if (root/p).is_file()}
save('input-receipt.json',{'capturedAt':datetime.datetime.now(datetime.timezone.utc).isoformat(),'head':subprocess.check_output(['git','rev-parse','HEAD'],cwd=root,text=True).strip(),'host':'Local Node 26.5.0 for new type assertions; no browser/consumer/AT host','inputHashes':hashes,'productionSourceDeltaFromParallel01':[{'path':p,'previous':v['sha256'],'current':hashes.get(p)} for p,v in api['sources'].items() if hashes.get(p)!=v['sha256']],'limits':'Hash reads are sequential working-tree observations; BUG-0008/0009 changes invalidate current-output equivalence. Additional concurrent calendar/date-field source changes are listed explicitly; no preserved snapshot claim covers those deltas. Source fixes need coordinator own behavioral receipts. No repeated full scan, build or tests.'})
print(json.dumps({'contractsIndexed':len(rows),'manifestRowsProposed':sum(not r['presenceMatches'] for r in original['manifestRows']),'localHistoryFiles':len(history),'productionSourceDelta':[p for p,v in api['sources'].items() if hashes.get(p)!=v['sha256']],'hashedInputs':len(hashes)}))
# New parity guard uses the previously reconciled implementation inventory.
icons=load('docs/developer/final-acceptance/parallel-12/evidence.json')['implementations']
map_path='packages/ui/src/experimental/icons/icon-map.json'; mapping=load(map_path); proposed={**mapping,'Brush':'Paintbrush'}
map_before={name:detail['vector'] for name,detail in icons.items() if mapping.get(name.removesuffix('Icon'))!=detail['vector']}
map_after={name:detail['vector'] for name,detail in icons.items() if proposed.get(name.removesuffix('Icon'))!=detail['vector']}
assert not map_after
save('icon-map.proposed.json',dict(sorted(proposed.items())))
icondoc='docs/developer/react-aria-icons.md'; old_doc=read(icondoc)
new_doc=old_doc if '| BrushIcon | Paintbrush |' in old_doc else old_doc.replace('| BuildIcon | Wrench |','| BrushIcon | Paintbrush |\n| BuildIcon | Wrench |')
(out/'icon-mapping.patch').write_text(''.join(difflib.unified_diff(read(map_path).splitlines(True),(json.dumps(dict(sorted(proposed.items())),indent=2)+'\n').splitlines(True),fromfile='a/'+map_path,tofile='b/'+map_path))+''.join(difflib.unified_diff(old_doc.splitlines(True),new_doc.splitlines(True),fromfile='a/'+icondoc,tofile='b/'+icondoc)))
save('icon-parity.json',{'source':'../parallel-12/evidence.json#implementations','implementationCount':len(icons),'currentMappingMismatches':map_before,'proposedMappingMismatches':map_after,'scope':'New static parity assertion for proposed metadata; no catalog/browser/bundle or legal approval.'})
# Exact documentation-only upgrade patch, preserving security governance prose.
p='docs/developer/react-aria-dependency-upgrades.md'; before=read(p)
after=before.replace('[package.json](../../package.json)','[packages/ui/package.json](../../packages/ui/package.json)').replace('Vite, Storybook, Playwright/axe','Vite, the Next.js docs/native fixture host, Playwright/axe').replace('Update affected stories and','Update affected docs examples and source-context/native fixtures and').replace('affected stories in production scopes','affected docs examples/native fixtures in production scopes').replace('against fresh static Storybook','against the fresh docs-owned static native fixture host').replace('Build Storybook before browser execution and never rebuild it during\na suite.','Build the docs-owned static native fixture host (`pnpm build:browser-docs` from\nthe repository root) before browser execution and never rebuild it during a suite.\nRun direct library scripts from `packages/ui`; root commands forward checks there.').replace('`codex/dev`','`dev`').replace('Storybook and the CI packed/runtime/browser matrix','docs-owned native fixture host and the CI packed/runtime/browser matrix')
save('concurrent-documentation.json', {'dependencyUpgradeGuideBytes':digest(p),'dependencyPatchNeeded':after!=before,'BrushMappingNowPresent':not map_before,'BrushDocumentationNowPresent':'| BrushIcon | Paintbrush |' in old_doc,'limit':'Concurrent changes observed read-only; no attribution to this agent and no runtime test result inferred.'})
(out/'dependency-upgrades.patch').write_text(''.join(difflib.unified_diff(before.splitlines(True),after.splitlines(True),fromfile='a/'+p,tofile='b/'+p)))

receipt=load(str((out/'input-receipt.json').relative_to(root)))
receipt['otherScopedDeltasAgainstFA02']=[dict(path=p,previous=prior['inputHashes'].get(p),current=h) for p,h in receipt['inputHashes'].items() if p in prior['inputHashes'] and prior['inputHashes'][p]!=h and p not in api['sources']]
save('input-receipt.json',receipt)

for name in ['icon-mapping.patch','dependency-upgrades.patch']:
 p=out/name
 if p.exists() and p.stat().st_size==0:p.unlink()
