import pathlib,json,hashlib,re,subprocess,datetime,platform
R=pathlib.Path.cwd(); O=R/'docs/developer/final-acceptance/wave-02-03'; B=R/'docs/developer/final-acceptance'
names=['DocumentEditorLayout','DocumentEditorToolbar','ContentEditorChrome','EditableTitleField','FloatingTextSelectionToolbar','RichTextFormattingToolbar','InsertContentMenuControl','TextAlignMenuControl','TextColorPickerControl','TextStyleMenuControl','ColumnsLayoutModal','ImageUploadModal','LinkUrlModal','PageRichTextEditorSection']
old=json.loads((B/'2026-10-16-source-inventory.json').read_text()); graph=json.loads((B/'parallel-02/graph-evidence.json').read_text())
paths=set(); cases=[]
for n in names:
 for directory in [R/'packages/ui/src/components'/n,R/'apps/docs/native-fixtures/scenarios/components'/n]:
  if directory.exists():
   for p in directory.rglob('*'):
    if p.is_file(): paths.add(p)
for n in ['react-aria-hardening-tasks.md','react-aria-editor-layout.md','react-aria-editor-menus.md','react-aria-editor-dialogs.md','react-aria-editor-section.md','react-aria-formatting-toolbar.md','react-aria-remaining-controls.md','react-aria-package-acceptance.md','react-aria-migration-inventory-acceptance.md','react-aria-browser-acceptance.md','backlog-execution-2026-10-15.md','react-aria-card-frames.md','react-aria-grid-presets.md','component-architecture.md','react-aria-architecture.md','react-aria-hardening-execution.md']:
 paths.add(R/'docs/developer'/n)
for n in range(21,35):paths.add(R/f'docs/developer/parallel-next100/next100-c{n}.md')
for n in ['experimental/PeriodPicker/PeriodPicker.tsx','experimental/DateTimeRangePicker/DateTimeRangePicker.tsx','experimental/DateRangeComparisonPicker/DateRangeComparisonPicker.tsx','experimental/TextArea/TextArea.tsx','models.ts','index.ts','components/index.ts','components/AdminDataGridOptions.ts','components/InstructorDataGridOptions.ts','icons/activityTypeIcon.tsx']:
 p=R/'packages/ui/src'/n
 if p.exists():paths.add(p)
for n in ['CardCollectionWithFooter','ClassCardFrame','InstructorClassCard','LearnerClassCard','LearnerClassesDataGrid']:
 for p in (R/'packages/ui/src/components'/n).glob('*'):
  if p.is_file():paths.add(p)
for p in (R/'packages/ui/tests/browser').glob('*.spec.ts'):
 if re.search(r'editor|title|color-menu|align-direction|style-menu|insert-menu|image-upload|link-modal|layout-replacement|formatting-toolbar|selection-boundary|hardening-actions',p.name):paths.add(p)
for n in ['AGENTS.md','README.md','docs/migration.md','packages/ui/package.json','pnpm-lock.yaml','packages/ui/scripts/test-editor-consumer.mjs','packages/ui/scripts/test-foundation-consumer.mjs','packages/ui/scripts/check-package.mjs','packages/ui/scripts/check-foundations.mjs']:
 paths.add(R/n)
for n in ['2026-10-16-inventory.json','2026-10-16-source-inventory.json','parallel-06/results.json','fa04-original-check.txt','fa04-calendar-rerun.txt','fa04-package.txt','fa02-foundations.txt','parallel-03/audit-evidence.json','parallel-02/graph-evidence.json','parallel-reconciliation-2026-10-16.json']:
 paths.add(B/n)
h=lambda p:hashlib.sha256(p.read_bytes()).hexdigest()
hashes={str(p.relative_to(R)):h(p) for p in sorted(paths) if p.is_file()}
for p in sorted(paths):
 if p.is_file() and ('.test.' in p.name or p.name.endswith('.spec.ts')):
  for i,line in enumerate(p.read_text().splitlines(),1):
   if re.search(r'\b(?:it|test)(?:\.each|\.describe)?\s*\(',line):cases.append({'file':str(p.relative_to(R)),'line':i,'declaration':line.strip()})
def compare(saved,subset=None):
 out=[]
 for f,prev in saved.items():
  if subset and not subset(f):continue
  p=R/f
  now=h(p) if p.is_file() else None
  if now!=prev:out.append({'file':f,'saved':prev,'current':now})
 return out
graphDelta=compare(graph['inputHashes'])
componentDelta=compare(old['inputHashes'],lambda f:any(f.startswith('packages/ui/src/components/'+n+'/') for n in names))
lower=lambda f:not bool(re.search(r'\.(?:test|native-fixture[^.]*)\.',f)) and bool(re.match(r'packages/ui/src/(foundation|experimental|theme|primitives|hooks|adapters|utils)/',f)) and not f.startswith('packages/ui/src/experimental/DataGrid/')
# Reuse the saved module-reference inventory; this is not a fresh parser/graph capture.
refs=[r for r in old['imports'] if lower(r['file']) and re.search(r'models|Learner|Instructor|AdminDataGrid|Course|ClassCard',r['specifier'])]
artifactDirs=['packages/ui/artifacts/hb14-2026-10-16','packages/ui/artifacts/hb18-fixed-2026-10-16','packages/ui/artifacts/backlog-2026-10-15-regression-recheck']
out={'capturedAt':datetime.datetime.now(datetime.timezone.utc).isoformat(),'head':subprocess.check_output(['git','rev-parse','HEAD'],text=True).strip(),'branch':subprocess.check_output(['git','branch','--show-current'],text=True).strip(),'host':{'platform':platform.platform(),'python':platform.python_version(),'node':subprocess.check_output(['node','--version'],text=True).strip(),'execution':'read-only evidence reconciliation; no tests/build/browser launched'},'inputHashes':hashes,'assignedComponentDeltaFromFA02':componentDelta,'productionGraphDeltaFromParallel02':graphDelta,'lowerLayerCourseImportCandidatesFromSavedFA02':refs,'lowerLayerSavedHashDelta':compare(graph['inputHashes'],lower),'testDeclarations':cases,'retainedNativeArtifactAvailability':{d:(R/d).exists() for d in artifactDirs},'limits':['FA-04 Node24 results are reused only for unchanged affected inputs; analysis host is not a supported-runtime execution','Native receipts establish historical scope only; absence of raw artifacts does not manufacture present screenshots or current browser results','No inference that current shared dist includes concurrently changing picker/TextArea fixes','Graph reused without re-running parser/SCC suite; changed scoped inputs require follow-up']}
(O/'evidence.json').write_text(json.dumps(out,indent=2)+'\n')
print(json.dumps({k:v for k,v in out.items() if k in ['head','host','assignedComponentDeltaFromFA02','productionGraphDeltaFromParallel02','lowerLayerCourseImportCandidatesFromSavedFA02','retainedNativeArtifactAvailability']},indent=2))
print('Hashed',len(hashes),'focused inputs; captured',len(cases),'test declarations')
