"""Read-only repository reconciliation; writes only this owner's evidence directory."""
from pathlib import Path
import hashlib,json,re,datetime,subprocess,difflib
ROOT=Path(__file__).resolve().parents[4]
OUT=Path(__file__).resolve().parent
BASE='docs/developer/final-acceptance/'
def sha(p):
 p=ROOT/p
 return hashlib.sha256(p.read_bytes()).hexdigest() if p.is_file() else None
def read(p): return (ROOT/p).read_text()
def save(name,x): (OUT/name).write_text(json.dumps(x,indent=2)+'\n')
assignment=json.loads(read(BASE+'wave-03-40/assignment.json'))
prior=json.loads(read(BASE+'wave-02-14/results.json'))
integration=json.loads(read(BASE+'coordinator-integration/evidence.json'))
ledger=read('docs/developer/react-aria-hardening-tasks.md')
open_a=re.findall(r'^- \[ \] (A-\S+) (.*)$',ledger,re.M)
open_v=re.findall(r'^- \[ \] (V-\S+) (.*)$',ledger,re.M)
future=re.findall(r'^- \[ \] (FUT-\S+) (.*)$',ledger,re.M)
owners=[]
for p in sorted((ROOT/BASE).glob('wave-03-*/assignment.json')):
 x=json.loads(p.read_text()); d=p.parent.relative_to(ROOT).as_posix()
 owners.append({'number':x['number'],'title':x['title'],'ids':x['ids'],'assignment':str(p.relative_to(ROOT)),'assignmentSha256':sha(str(p.relative_to(ROOT))),'report':d+'/report.md','results':d+'/results.json','authority':'Assigned successor scope only; no completion inferred from dispatch.'})
allids=[i for x in owners for i in x['ids']]
assert len(owners)==40 and len(allids)==len(set(allids))==153
assert set(allids)=={i for i,_ in open_a}
assert len(open_v)==20 and len(future)==6
save('ownership-map.json',{'assignments':owners,'requiredA':[{'id':i,'requirement':s,'owner':next(x['number'] for x in owners if i in x['ids'])} for i,s in open_a],'requiredEditorV':[{'id':i,'requirement':s,'acceptanceOwner':23 if i.startswith(('V-C21','V-C22','V-C23')) else 25 if i.startswith(('V-C25','V-C34')) else 24,'status':'open; separate V evidence required'} for i,s in open_v],'future':[{'id':i,'requirement':s} for i,s in future]})
comparisons={}
for key in ['inputHashes','builtLibraryHashes','privateFixtureOutputHashes']:
 rows=[{'path':p,'recorded':h,'current':sha(p),'unchanged':sha(p)==h} for p,h in integration[key].items()]
 comparisons[key]={'total':len(rows),'unchanged':sum(r['unchanged'] for r in rows),'changedOrMissing':[r for r in rows if not r['unchanged']]}
comparisons['receiptHashes']=[{'path':BASE+'coordinator-integration/'+p,'recorded':h,'current':sha(BASE+'coordinator-integration/'+p),'unchanged':sha(BASE+'coordinator-integration/'+p)==h} for p,h in integration['receiptHashes'].items()]
priorhash=[{'path':v[k],'expected':v[k+'Sha256'],'current':sha(v[k]),'unchanged':sha(v[k])==v[k+'Sha256']} for v in assignment['priorEvidence'].values() for k in ['report','results']]
# These are an explicit bounded source selection, not an all-library build-input inventory.
paths=['AGENTS.md','docs/developer/react-aria-final-acceptance.md','docs/developer/react-aria-hardening-tasks.md','docs/developer/react-aria-master-task-list.md','docs/developer/backlog-execution-2026-10-15.md','docs/developer/react-aria-calendar-contracts.md','docs/developer/react-aria-editor-section.md','docs/developer/react-aria-inventory-contract-reconciliation.md',BASE+'coordinator-integration/evidence.json',BASE+'wave-02-14/report.md',BASE+'wave-02-14/results.json','packages/ui/src/experimental/SearchField/SearchField.tsx','packages/ui/src/components/PageRichTextEditorSection/PageRichTextEditorSection.impl.tsx','apps/docs/components/CatalogNavigation.tsx','apps/docs/components/CatalogIndex.tsx','apps/docs/examples/SearchFieldExamples.tsx','apps/docs/tests/search-field.spec.ts','.github/workflows/ci.yml','.github/workflows/release.yml','packages/ui/package.json','packages/ui/release.config.mjs']
for d in ['Calendar','DateField','DatePicker','DateRangePicker','DateRangeSelector','PeriodPicker','DateRangeComparisonPicker','TimeField']:
 paths.extend(str(p.relative_to(ROOT)) for p in (ROOT/'packages/ui/src/experimental'/d).glob('*.tsx'))
paths.extend(str(p.relative_to(ROOT)) for p in (ROOT/'packages/ui/dist/experimental').glob('*/**/*.d.ts') if any('/'+d+'/' in str(p) for d in ['Calendar','DatePicker','DateRangeSelector','PeriodPicker','DateRangeComparisonPicker','SearchField']))
evidence={'capturedAt':datetime.datetime.now(datetime.timezone.utc).isoformat(),'runtime':subprocess.check_output(['python3','--version'],text=True).strip(),'head':subprocess.check_output(['git','rev-parse','HEAD'],cwd=ROOT,text=True).strip(),'branch':subprocess.check_output(['git','branch','--show-current'],cwd=ROOT,text=True).strip(),'integrationComparison':comparisons,'priorEvidenceHashComparison':priorhash,'inspectedHashes':{p:sha(p) for p in sorted(set(paths))},'limits':['Hash equality retains only the original bounded evidence; no runtime check executed here.','Integration inputHashes are selected scope, not the full dependency closure; equal outputs alone do not prove complete source/output synchronization.','No external human conversation transcript, completed PR list, legal approval or release authorization was available to this assignment.']}
save('evidence.json',evidence)
backlog=read('docs/developer/backlog-execution-2026-10-15.md')
sections=[]
for m in re.finditer(r'^#{2,3} (.*)$',backlog,re.M):
 title=m.group(1)
 if title.startswith(('CAL-','SEARCH-')):
  end=re.search(r'^#{2,3} ',backlog[m.end():],re.M); text=backlog[m.start():m.end()+end.start()] if end else backlog[m.start():]
  sections.append({'title':title,'line':backlog[:m.start()].count('\n')+1,'text':text.strip(),'sha256':hashlib.sha256(text.encode()).hexdigest(),'kind':'Repository execution record; not original human transcript or new execution.'})
save('recorded-calendar-search-commitments.json',sections)
rows=[
('calendar-value-authority','Civil ISO dates/ranges, local datetime/time; explicit host timezone/DST, draft/Apply/Cancel/reset and controlled host authority.','packages/ui/src/experimental/DateRangeSelector/DateRangeSelector.tsx',[27,28,32],'A-K-04,A-K-07,A-K-08,A-K-12,A-K-17','Retain integrated typed/segmented/datetime availability and host-policy checks; complete remaining range/reset/navigation/locale/consumer cases at their exact inputs. No recurrence/persistence engine implied.'),
('calendar-entry-layout','CAL-UX through CAL-RANGE-PRESENTATION: flexible text, explicit referenceDate, fixed relative rules, range policy/presets, optional endpoints, months/density and responsive layouts.','docs/developer/react-aria-calendar-contracts.md',[27,28,9,10,17,30],'A-K-04,A-K-07,A-K-05,A-K-08,A-K-12,A-K-17','Recorded implementations and targeted receipts exist; trusted paste/autofill, enlarged-text/real zoom, physical touch and locale/calendar matrix require their own evidence. Do not generalize date-only grammar to datetime/segments.'),
('calendar-gestures','CAL-ENDPOINT-DAY-DRAG, CAL-GESTURE-CONTINUATION and CAL-GESTURE-ADDITIONAL-CASES preserve full targets, host updates, duration limits, cancellation/isolation and cross-month drops.','docs/developer/backlog-execution-2026-10-15.md',[10,27,28,29],'A-U-17,A-X-07,A-X-08,A-K-08,A-K-17','Reuse named recorded browser scopes only after input comparison; physical touch/device and AT remain distinct from simulated pointer/touch.'),
('calendar-reasons','BUG-0010 and BUG-0011 availability parity and callback/static reason disclosure.','docs/developer/final-acceptance/coordinator-integration/evidence.json',[27,29],'A-K-04,A-K-07,A-K-17','Defects fixed; no duplicate fix proposed. Exact integrated 21 executions are bounded, not 24 independent cases or full K acceptance.'),
('search-component','SEARCH-STANDARD public SearchField with query/default/reset, label/keyword filter, host-filtered/standalone mode, status/retry, keyboard and native links.','packages/ui/src/experimental/SearchField/SearchField.tsx',[18,19,29,32,34],'A-U-04,A-U-06,A-U-07,A-X-02,A-X-03,A-X-09,A-W-06','Three baseline units and fourteen recorded Chromium cases are historical scoped evidence; join their actual source/output receipt before current runtime credit. Host owns network freshness/routing; DataToolbar remains its separate TextField contract, not evidence of universal SearchField adoption.'),
('search-site','Sidebar/index consume public SearchField; aliases, direct routing, group reveal/Back and fixed website identity; isolated source-backed examples.','apps/docs/components/CatalogNavigation.tsx',[16,19,29,34],'A-H-02,A-H-03,A-W-06,A-W-17,A-X-09','CatalogNavigation and CatalogIndex imports confirm reuse. Integration docs build proves captured compilation/catalog checks, not every navigation/browser/AT outcome. Preserve no-visible-title accessible sidebar name.'),
('editor-document','PageRichTextEditorSection owns Lexical composition/serialization/selection, configurable toolbar and readOnly; host supplies lexicalValue/onLexicalChange/editorKey/onUploadImage.','packages/ui/src/components/PageRichTextEditorSection/PageRichTextEditorSection.impl.tsx',[23,24,25,26,32],'A-M-21,A-M-22,A-M-23,A-M-25,A-M-26,A-M-27,A-M-28,A-M-29,A-M-30,A-M-34,A-E-02,A-E-03,A-E-04,A-E-05,A-E-06,A-E-07','Complete assigned formatting/history/selection/node/upload trust successors and twenty explicit editor V visual/RTL leaves. Upload cancellation is local invalidation; host owns transport/assets/persistence. Source contract is not native/spoken proof.'),
('imported-principles','Owned APIs/tokens/CSS Modules, React Aria internal, TanStack processing, host adapters/i18n, Button/onPress, styles/scope and no MUI/Emotion runtime.','AGENTS.md',list(range(1,40)),'A-Z-12,A-Z-15','Architecture contradiction was already corrected; do not repeat it. Resolve original M10 navigation/M14 card/M30 typeface intent with owner evidence (owners 16/22/24); do not silently delete original requirements or duplicate font state.'),
('future-boundary','Only FUT-A-20/FUT-D-21/FUT-G-24/FUT-K-13/FUT-K-14/FUT-K-15 are the six explicitly deferred leaves.','docs/developer/react-aria-hardening-tasks.md',[28,30,40],'A-Z-12,A-Z-15,A-Z-16','Current experimental periods/comparisons do not select recurrence, scheduler or booking engine. Every required A/editor V remains required; no retroactive optional classification.'),
('release-authority','dev integration; human-approved major/minor promotion to main; Conventional Commits/semantic-release and required production checks.','AGENTS.md',[6,7,36,37,38,40],'A-Z-11,A-Z-14,A-Z-15,A-Z-16','Missing human approval/effective owner settings/legal closure and final exact artifact/run must remain open. No completed PR or publication can be inferred from uncommitted dirty dev HEAD.')]
save('commitment-gate-map.json',{'scope':'Repository-recorded commitments and current supplied instructions; exhaustive human conversation reconciliation remains unavailable.','rows':[{'id':i,'commitment':c,'source':s,'sourceSha256':sha(s),'owners':o,'requiredLeaves':a.split(','),'unmetGateOrLimit':g} for i,c,s,o,a,g in rows]})
print(json.dumps({'assignments':len(owners),'requiredA':len(open_a),'editorV':len(open_v),'future':len(future),'commitmentSections':len(sections),'integrationDeltas':{k:len(v['changedOrMissing']) for k,v in comparisons.items() if isinstance(v,dict)},'priorHashesMatch':all(x['unchanged'] for x in priorhash)},indent=2))
