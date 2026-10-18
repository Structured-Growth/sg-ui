"""Reconcile assigned leaves; never writes outside wave-04/15 or changes approval state."""
from pathlib import Path
import json, hashlib, re, subprocess, datetime, difflib
ROOT=Path(__file__).resolve().parents[5]; OUT=Path(__file__).resolve().parent
BASE='docs/developer/final-acceptance/'
def read(p):return (ROOT/p).read_text()
def load(p):return json.loads(read(p))
def sha(p):return hashlib.sha256((ROOT/p).read_bytes()).hexdigest() if (ROOT/p).is_file() else None
def save(p,v): (OUT/p).write_text(json.dumps(v,indent=2)+'\n')
assignment=load(str(OUT.relative_to(ROOT)/'assignment.json'))
prior=load(BASE+'wave-03-integration/reconciliation.json')
selected=[e for e in prior['entries'] if e['id'] in assignment['ids']]
assert {e['id'] for e in selected}==set(assignment['ids'])
priorComparisons=[]
for e in selected:
    priorComparisons.append({'id':e['id'],'owner':e['owner'],'statusAtReview':e['status'],
      'report':e['report'],'reportSha256':sha(e['report']),'reportMatchesReviewed':sha(e['report'])==e['reportSha256'],
      'results':e['results'],'resultsSha256':sha(e['results']),'resultsMatchReviewed':sha(e['results'])==e['resultsSha256']})
assert all(x['reportMatchesReviewed'] and x['resultsMatchReviewed'] for x in priorComparisons)
# Integrated proposal preconditions, without treating changed subsequent docs as missing integration.
proposal=[]
for owner in ['33','34']:
    rows=load(BASE+f'wave-03-{owner}/patch-inputs.json'); rows=rows.get('files',[]) if isinstance(rows,dict) else rows
    for r in rows:proposal.append({'owner':owner,'path':r['path'],'currentSha256':sha(r['path']),
      'reviewedProposalSha256':r['proposedSha256'],'matchesIntegratedProposal':sha(r['path'])==r['proposedSha256']})
# Preserve original manifest identities, verify current existence including removed-row replacements.
m=load('docs/extraction-manifest.json'); old=load(BASE+'wave-03-33/evidence.json')
manifest=[]
for r in m['files']:
    p='packages/ui/'+r['destination'] if r['destination'].startswith('src/') else r['destination']
    reps=['packages/ui/'+q if q.startswith('src/') else q for q in r.get('migration',{}).get('replacements',[])]
    manifest.append({'source':r['source'],'destination':r['destination'],'resolvedDestination':p,
     'recordedPresent':r['present'],'actualPresent':(ROOT/p).exists(),
     'replacements':[{'path':q,'exists':(ROOT/q).exists(),'sha256':sha(q)} for q in reps]})
assert all(x['actualPresent']==x['recordedPresent'] and all(y['exists'] for y in x['replacements']) for x in manifest)
assert {k:m[k] for k in ['sourceRepository','sourceCommit','sourceRoot']}==old['originalProvenance']
# Fresh, bounded source comparisons: retained receipts are not new runtime executions.
sourceComparisons=[]
for receipt in ['wave-03-followup/validated-source-inputs.json','editor-chrome-presentation/results.json','rich-editor-presentation/results.json']:
    d=load(BASE+receipt)
    hashes=d if receipt.startswith('wave-03-followup') else d.get('sourceSha256',{})
    if isinstance(hashes,dict):
      for p,h in hashes.items():
        if isinstance(h,str) and re.fullmatch('[a-f0-9]{64}',h):sourceComparisons.append({'receipt':BASE+receipt,'path':p,'recordedSha256':h,'currentSha256':sha(p),'matches':sha(p)==h})
# Include exact named result/log hashes independently of whether ignored raw browser files survived.
refs=['AGENTS.md','docs/migration.md','docs/extraction-manifest.json','docs/developer/extraction-lineage.md',
 'docs/developer/react-aria-hardening-tasks.md','docs/developer/react-aria-hardening-execution.md','docs/developer/react-aria-final-acceptance.md',
 'docs/developer/docs-fixture-migration.md','docs/developer/react-aria-dependency-upgrades.md','docs/developer/react-aria-public-contracts.md',
 'docs/developer/final-acceptance/wave-03-followup/validation-results.json',
 'docs/developer/final-acceptance/wave-03-followup/docs-first.log','docs/developer/final-acceptance/wave-03-followup/docs-corrected.log',
 'docs/developer/final-acceptance/wave-03-followup/native-final.log','docs/developer/final-acceptance/wave-03-followup/validated-source-inputs.json',
 'apps/docs/components/FoundationExamples.tsx','apps/docs/components/ThemePipelineExplorer.tsx','apps/docs/app/theming/page.tsx',
 'apps/docs/tests/foundation-examples.spec.ts','apps/docs/tests/icons-acceptance.spec.ts','apps/docs/tests/catalog.spec.ts',
 'packages/ui/tests/browser/translations-locale-acceptance.spec.ts','packages/ui/tests/browser/navigation-locale-motion.spec.ts',
 'docs/developer/final-acceptance/wave-03-35/public-symbol-dispositions.json','docs/developer/final-acceptance/wave-03-35/migration-trace.json',
 'docs/developer/final-acceptance/editor-chrome-presentation/results.json','docs/developer/final-acceptance/rich-editor-presentation/results.json',
 'docs/developer/final-acceptance/apple-simulator/results.json','docs/developer/final-acceptance/wave-03-40/commitment-gate-map.json',
 'docs/developer/final-acceptance/wave-03-40/recorded-calendar-search-commitments.json',
 'LICENSE','THIRD_PARTY_NOTICES.md','packages/ui/THIRD_PARTY_NOTICES.md']
refs=[p for p in refs if (ROOT/p).is_file()]
for e in selected:refs.extend([e['report'],e['results']])
for p in ['packages/ui/artifacts/wave03-integration/followup-final-results.json','apps/docs/test-results/wave03-followup-results.json','apps/docs/test-results/wave03-followup-corrected-results.json']:
    refs.append(p)
# Concrete consumer doc completion: complete known absent baseline-name table from reviewed exhaustive join.
symbols=load(BASE+'wave-03-35/public-symbol-dispositions.json')
removed=[r for r in symbols['baselineNames'] if r['disposition']=='removed-with-owned-replacement'];assert len(removed)==12
section='''## Removed baseline exports

The following table accounts for all twelve absent baseline export names in the
[reviewed public-symbol join](developer/final-acceptance/wave-03-35/public-symbol-dispositions.json).
It describes migration from the extraction baseline. It does not promise inherited
prop compatibility or establish a released version/deprecation deadline.

| Removed export | Consumer replacement | Required change |
| --- | --- | --- |
'''
for r in removed:
    section+=f"| `{r['name']}` | {r['replacement']} | {r['releaseImpact']} |\n"
section+='''
`MenuItem` is now an item-record type for `Menu.items`; do not render it as a JSX
component merely because its type name remains. `SGLink` and `Autocomplete` are
retained aliases for owned Link and ComboBox; preserved names still use the owned
contracts. No deprecated-name removal schedule is implied. See the
[public contracts](developer/react-aria-public-contracts.md) for callback and
empty-value ownership, and the existing component mappings above for styling,
typography, pagination, selection, icons and changed defaults.

Breaking removals require a breaking Conventional Commit marker and reviewed
release notes. Release numbering stays with semantic-release; this table neither
changes versions nor authorizes promotion from dev to main.

'''
original=read('docs/migration.md'); marker='## Adoption and remaining limits\n'; assert marker in original
# Coordinator may already have integrated the exact proposal while this worker runs.
if '## Removed baseline exports\n' in original:
    original=original[:original.index('## Removed baseline exports\n')]+original[original.index(marker):]
proposed=original.replace(marker,section+marker)
p=OUT/'proposed-files/docs/migration.md';p.parent.mkdir(parents=True,exist_ok=True);p.write_text(proposed)
(OUT/'consumer-removed-exports.patch').write_text(''.join(difflib.unified_diff(original.splitlines(True),proposed.splitlines(True),fromfile='a/docs/migration.md',tofile='b/docs/migration.md')))
save('patch-preconditions.json',{'path':'docs/migration.md','baseSha256':hashlib.sha256(original.encode()).hexdigest(),'proposedSha256':hashlib.sha256(proposed.encode()).hexdigest(),'applied':False})
# All 37 rows get current inputs and latest V disposition without pretending PR review happened.
trace=load(BASE+'wave-03-35/migration-trace.json'); assert len(trace)==37
for r in trace:
    r['priorTraceSha256']=sha(BASE+'wave-03-35/migration-trace.json')
    r['currentInputHashes']={p:sha(p) for p in r['implementationFiles']+r['testFiles']}
    r['priorOpenHardeningLeaves']=r.get('openHardeningLeaves',[]);r['openHardeningLeaves']=[]
    r['hardeningDisposition']='All 300 V accepted in canonical hardening execution; no remaining editor V. Historical scope and original A row criteria remain separate.'
    r['hardeningReceipt']='docs/developer/react-aria-hardening-execution.md'
    r['hardeningReceiptSha256']=sha(r['hardeningReceipt'])
    r['reviewedPRAttributionVerified']=False
    r['trackingSuccessor']='Attach actual row-specific reviewed PR/commit and accepted validation receipts; reconcile outstanding original A-M clauses. Do not rerun passed V work merely to manufacture review attribution.'
    if r['originalId'] in ['M-21','M-22','M-23']: r['newEditorPresentationReceipt']=BASE+'editor-chrome-presentation/results.json'
    if r['originalId'] in ['M-25','M-26','M-27','M-28','M-29','M-30','M-34']:r['newEditorPresentationReceipt']=BASE+'rich-editor-presentation/results.json'
save('migration-trace.json',trace)
active=read('docs/developer/react-aria-hardening-tasks.md')
a=re.findall(r'^- \[ \] (A-[A-Z]-\d+)',active,re.M);v=re.findall(r'^- \[ \] (V-[A-Z]\d+-\d+)',active,re.M)
assert len(a)==139 and len(v)==0,(len(a),len(v))
save('completion-state.json',{'baseCommit':subprocess.check_output(['git','rev-parse','HEAD'],cwd=ROOT,text=True).strip(),
 'requiredAOpen':a,'requiredVOpen':v,'acceptedVCount':300,'requiredATotal':320,'acceptedACount':181,'futureCount':6,
 'migrationComplete':False,'publicationAuthorized':False,
 'reason':'139 original required A leaves still open. This owner recommends two bounded documentation closures only; canonical counts unchanged. No human release, legal or owner approval is supplied.',
 'decisionBoundaries':{'migrationCompletion':'All original required A and V, exact-candidate validation, commitments and required owner/legal decisions satisfied, with attributable review evidence.',
 'publication':'Separate explicit human-approved major/minor release, required production validation and configured release workflow. A development reconciliation cannot authorize it.'}})
save('evidence.json',{'capturedAt':datetime.datetime.now(datetime.timezone.utc).isoformat(),'head':subprocess.check_output(['git','rev-parse','HEAD'],cwd=ROOT,text=True).strip(),
 'runtime':subprocess.check_output(['python3','--version'],text=True).strip(),'priorReviewedComparisons':priorComparisons,
 'integratedProposalComparisons':proposal,'manifest':manifest,'manifestSummary':{'rows':len(manifest),'present':sum(r['actualPresent'] for r in manifest),'absent':sum(not r['actualPresent'] for r in manifest),'mismatches':0,'provenancePreserved':True},
 'sourceComparisons':sourceComparisons,'references':[{'path':p,'sha256':sha(p),'exists':(ROOT/p).is_file()} for p in sorted(set(refs))],
 'limits':['Sequential read-only capture, not atomic checkout attestation.','Missing ignored raw browser files are recorded as absent; retained logs/receipts are not recreated.','No new product/browser/build/install/consumer/AT/device validation or external provenance authentication.']})
print(json.dumps({'priorReviewedReportsMatch':len(priorComparisons),'manifestRows':len(manifest),'traceRows':len(trace),'sourceComparisons':len(sourceComparisons),'sourceMatches':sum(x['matches'] for x in sourceComparisons),'sourceDeltas':[x['path'] for x in sourceComparisons if not x['matches']],'proposedMigrationPatch':True},indent=2))
# Specific matched foundation/catalog inputs from the integrated build inventory.
push=load(BASE+'wave-03-integration/push-source-inputs.json')
foundationPaths=['apps/docs/components/FoundationExamples.tsx','apps/docs/components/ThemePipelineExplorer.tsx','apps/docs/app/theming/page.tsx','apps/docs/tests/foundation-examples.spec.ts','apps/docs/tests/icons-acceptance.spec.ts','apps/docs/tests/catalog.spec.ts']
foundationComparisons=[{'path':p,'recordedSha256':push.get(p),'currentSha256':sha(p),'matches':push.get(p)==sha(p)} for p in foundationPaths]
save('foundation-input-comparisons.json',foundationComparisons)
# Update the existing commitment map with explicit ownership for this new wave and completed V evidence.
ownership={}
for f in sorted((ROOT/(BASE+'wave-04')).glob('*/assignment.json')):
    d=json.loads(f.read_text())
    for id in d.get('ids',[]):
        assert id not in ownership,id
        ownership[id]={'owner':d.get('number'),'assignment':str(f.relative_to(ROOT)),'assignmentSha256':sha(str(f.relative_to(ROOT)))}
commitments=load(BASE+'wave-03-40/commitment-gate-map.json')
for r in commitments['rows']:
    r['priorSourceSha256']=r.pop('sourceSha256',None);r['currentSourceSha256']=sha(r['source'])
    r['previousWaveOwners']=r.pop('owners',[])
    r['wave04Owners']={id:ownership.get(id,{'status':'not in supplied current assignments; retain prior owner/result'}) for id in r['requiredLeaves']}
    r['priorUnmetGateOrLimit']=r['unmetGateOrLimit']
    r['currentEvidenceSupplement']='HB-19/20 complete the final 20 V leaves; accepted total is 300/300. This does not close a broader A requirement. All139 original remaining A and6 future remain separately tracked.'
    if 'editor' in r['id']:r['currentEvidenceSupplement']+=' Actual chrome/rich editor native and rendered evidence is in editor-chrome-presentation/results.json and rich-editor-presentation/results.json, hashed in evidence.json.'
commitments['scope']='Successor to repository-recorded commitment map, preserving original text and prior limits. Current source hashes and wave04 ownership added. Full actual human conversation/approval corpus is still required for exhaustive Z12 closure.'
save('commitment-gate-map.json',commitments)

# Per-leaf recommendation data; canonical checkboxes/counters remain untouched.
data={
'A-B-07':('partial','HB-19/20 now supply editor light/dark, both densities, English/Arabic native interactions and actual rendered reviews. Retain accepted prior family V work.','B07-RAW: join recoverable controls/navigation/modal/grid raw captures to original theme/density interaction receipts. Wave03-29 reported historical HB roots absent; do not relabel unrelated calendar images. Capture only proven missing slices on an admitted immutable host; review each candidate.', ['wave-03-29/report.md','editor-chrome-presentation/results.json','rich-editor-presentation/results.json']),
'A-B-12':('partial','All201 manifest rows resolve correctly with159 present/42 absent, every replacement exists, original repository/commit/root retained. The integrated33-story and4Button scenario dispositions are present.','B12-UPSTREAM: obtain an authorized original-commit archive/reference behavior; B12-GRID16: compare the16early grid scenarios listed in extraction-lineage.md against owned behavior or record a human decision. Manifest presence cannot establish semantic parity.', ['wave-03-33/report.md','wave-03-33/evidence.json']),
'A-B-14':('partial','This pass uses local read-only SGUI evidence; no learner-platform access or modification. Original upstream identity is unchanged, and prior unavailable-object diagnostic is retained.','B14-AUTHENTICATE: owner supplies read-only commit-bound upstream source/behavior evidence and unchanged status against a known upstream baseline. Local extraction commits cannot authenticate unavailable upstream bytes.', ['wave-03-33/report.md','wave-03-33/evidence.json']),
'A-D-20':('complete','Approved docs host supplies production palette/semantic exploration, public typography, density and surface pages, plus integrated source-backed spacing/focus/motion Example owners on /theming. Retained production docs build and two foundation cases pass after the corrected source locator; no missing integration/runtime successor from wave03-30 remains.','None for this publication/examples obligation. Remote hosting rollout, optical/device/AT certification and final A gates are separate; this recommendation does not imply them.', ['wave-03-30/report.md','wave-03-followup/validation-results.json','wave-03-followup/docs-first.log','wave-03-followup/docs-corrected.log']),
'A-I-08':('partial','Icon docs policy/spec are integrated; retained production icon catalog search/naming/source/copy/isolation case passes. Prior four bounded esbuild probes and notices remain retained with explicit Node26 limitation.','I08-NATIVE: execute prepared I-S2 geometry/naming/direction/contrast cases on matching compiled output and inspect optical captures; I08-PACKED: retain supported-runtime exact-candidate pruning/notice attribution. Do not rerun the already passing docs case solely for credit.', ['wave-03-15/report.md','wave-03-15/bundle-results.json','wave-03-followup/docs-first.log']),
'A-H-08':('partial','Locale/navigation patches integrated. Retained native logs show English/pseudo/Arabic fixed formatting,0/1/2/3/11/100count/clear,reflow and mirrored motion cases passing in each desktop engine. Earlier ICU/SSR checks remain bounded.','H08-SPEECH: obtain actual English/Arabic count/clear speech and long-label observations using the prior operator record or expanded simulator scenarios. Current simulator selector speech is a different scope. DOM live-region checks cannot stand in for the outstanding speech successor.', ['wave-03-17/report.md','wave-03-followup/native-final.log','apple-simulator/results.json']),
'A-M-38':('partial','Updated all37row trace records with current implementation/test hashes and canonical completed V attribution. HB19/20 are attached to the10affected editor rows; no stale20V successors retained as current work.','M38-REVIEW: attach actual per-row reviewed PR/commit and exact validation receipt, then reconcile original A-M criterion holds. Initial draft PR1 and latest touched commit do not prove review; transitive guard evidence remains required for relevant changed candidate inputs.', ['wave-03-35/report.md','wave-03-35/migration-trace.json','editor-chrome-presentation/results.json','rich-editor-presentation/results.json']),
'A-W-10':('partial','Integrated33-module/native replacement table and exact4Button dispositions reviewed. Production94-route/1138snippet evidence supersedes the unexecuted catalog successor for its bounded inputs.','W10-GRID16: disposition16initial grid export behaviors individually; W10-PUBLIC12: finish DOCS-005-b01 throughb12 public examples, including adapters/calendar/grid helpers; retain current public/native source and focused evidence. No Storybook restoration.', ['wave-03-33/report.md','wave-03-followup/validation-results.json']),
'A-W-13':('partial','Consumer guide already maps owned imports/styles/theme/typography/grid/pagination/selection/icons/defaults. Delivered a new reviewable12-removed-export table from the accepted exhaustive symbol join, including MenuItem type-versus-runtime and retained alias boundaries.','W13-INTEGRATE12: review/apply consumer-removed-exports.patch after checking base hash. W13-API: join exhaustive historical inherited-prop/default/release-marker dispositions with the A-B-05/A-Z-13 owner; removed-name coverage alone is insufficient.', ['wave-03-34/report.md','wave-03-35/public-symbol-dispositions.json']),
'A-W-16':('complete','Current docs/migration.md and manifest distinguish extraction provenance from owned runtime, resolve workspace moves/removals, and link the integrated exact33-module lineage and local Button replacement. All201 row identities/presence/replacements checked. The wave03 successor was review/application/metadata verification, now satisfied.','None for this documentation/manifest obligation. Original upstream authentication and16grid behaviors remain explicitly open in B12/B14/W10; retaining those limits satisfies truthful provenance rather than asserting parity.', ['wave-03-33/report.md','wave-03-33/patch-inputs.json','wave-03-integration/reconciliation.json']),
'A-W-18':('partial','Existing published guide states grid/calendar/experimental limits, aliases without an invented removal schedule, release impact and the focus/keyboard/collection/overlay/locale/date/testing/license costs of replacing React Aria.','W18-OWNER: record supported-release/backport window, cadence/accountable maintainer and confidential intake/disclosure authority in the existing dependency decision record. W18-API: join final default/breaking/public-experimental decisions. No support SLA or policy can be invented here.', ['wave-03-34/report.md']),
'A-W-19':('partial','Integrated current-guide fixes and typed guide example retained. Catalog runtime/source compiler now has94routes/1138snapshots. New tracked646-Markdown audit expands explicit reference/HTML/heading checks and records5156local links without excluding evidence mirrors.','W19-REVIEW: review619missing-file records:611are in evidence/batch/mirror paths,8are historical non-evidence-guide links; do not call them current defects automatically.257absolute routes are unchecked. Broad inline-code path/command validity and MDX/TSX literals remain outside this bounded parser. Reuse existing typed/snippet receipts only for matching inputs.', ['wave-03-34/report.md','wave-03-followup/validation-results.json']),
'A-Z-05':('partial','Integrated lineage and current-host prose preserve upstream identifiers/local blob history and explain removed API names. All manifest source identity fields retained. No Git history, frozen receipt or legal notice rewritten.','Z05-POLICY: human decision on literal-zero historical names versus provenance-preserving migration explanations, with explicit scope. Current lineage calls its reference policy proposed; cannot silently accept an exception or delete legal/history evidence.', ['wave-03-33/report.md','wave-03-35/report.md']),
'A-Z-11':('partial','Retain supported-runtime build/type/package/docs and corrected native receipts plus HB19/20. All300V complete; no stale20editorV rerun request. Original failures/skips and present/missing raw artifact paths remain visible.','Z11-CANDIDATE: coordinator joins exact final candidate/package,input closure,supported Node22/24 React18/19 SSR/hydration/RSC/Next,performance,required engine/device/spokenAT/visual/support and production CI receipts. Run only changed or genuinely missing scopes; configured jobs and this source audit are not executions.', ['wave-03-40/report.md','wave-03-followup/validation-results.json','editor-chrome-presentation/results.json','rich-editor-presentation/results.json']),
'A-Z-12':('partial','Updated repository commitment map retains original text/source and prior gate descriptions, adds current hashes/wave04ownership and recognizes all300Vcomplete. Original calendar/search/editor/host/release principles remain mapped.','Z12-HUMAN: coordinator supplies complete actual conversation commitment/approval coverage. Resolve M10navigation/M14card/M30typeface criterion decisions without deleting original clauses or silently duplicating APIs. Peer proposals require review; dispatch is not acceptance.', ['wave-03-40/report.md','wave-03-40/commitment-gate-map.json']),
'A-Z-15':('partial','Concrete37row trace,commitment ownership update,prior17report hash joins,accepted newer bounded receipts and fail-closed completion snapshot delivered. Original139A and6explicitfuture leaves retained separately.','Z15-FINAL: reconcile all15wave04reports/integrated patches,exact reviewed PR/commit/run identities and final dependency/feature/owner/legal decisions. Preserve FUT-A-20/FUT-D-21/FUT-G-24/FUT-K-13/14/15 only; required unfinished work cannot become optional.', ['wave-03-40/report.md','wave-03-integration/reconciliation.json']),
'A-Z-16':('partial','Completion remains false with139requiredA open and0V open. Two narrowly recommended documentation closures are not applied to shared counts. Publication authorization remains separately false.','Z16-CLOSE: satisfy every remaining required acceptance/decision/evidence gate before marking migration complete. Publishing requires explicit human release approval,production validation and configured workflow; no promotion,tag,version edit or publish here.', ['wave-03-40/report.md','wave-03-followup/validation-results.json'])}
entries=[]
for id,text in zip(assignment['ids'],assignment['obligations']):
    status,decision,remaining,paths=data[id]
    entries.append({'id':id,'originalChecklistText':text,'recommendation':status,'status':status,'decision':decision,'remainingSuccessors':remaining,
      'evidence':[{'path':BASE+p,'sha256':sha(BASE+p)} for p in paths],
      'newEvidence':['evidence.json','foundation-input-comparisons.json','completion-state.json'],
      'validationPlan':'validation-plan.json','limits':'Recommendation only; no shared checklist/count edit, new product execution or human/legal/release approval.'})
save('results.json',{'schemaVersion':1,'assignment':str((OUT/'assignment.json').relative_to(ROOT)),'baseCommit':'6c485ed79d0d6a521d188e5bde8315722296f518',
 'counts':{'complete':2,'partial':15,'blocked':0},'canonicalCountsUnchanged':{'acceptedA':181,'openA':139,'acceptedV':300,'openV':0,'future':6},'entries':entries})
print('Per-leaf recommendations written: 2complete /15partial; canonical counts unchanged.')
