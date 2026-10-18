from pathlib import Path
import json,hashlib,subprocess
OUT=Path(__file__).resolve().parent;ROOT=OUT.parents[4]
def load(p):return json.loads((OUT/p).read_text())
def write(p,d):(OUT/p).write_text(json.dumps(d,indent=2)+'\n')
def sha(p):return hashlib.sha256((ROOT/p).read_bytes()).hexdigest()
r=load('results.json')
precondition=load('patch-preconditions.json')
integrated=sha('docs/migration.md')==precondition['proposedSha256']
precondition['observedIntegrated']=integrated
write('patch-preconditions.json',precondition)
checks=['packages/ui/scripts/check-docs-provenance-wave04.mjs','packages/ui/scripts/check-docs-provenance-wave04.test.mjs']
for e in r['entries']:
 e['implementationFiles']=[{'path':p,'sha256':sha(p)} for p in checks] if e['id'] in ['A-B-12','A-W-10','A-W-19','A-W-16'] else []
 if e['id']=='A-W-19':
  e['decision']+=' New direct standalone guard checks27explicit pnpm command snippets in four current guides; five meaningful negative tests pass. Local Git/AST verifies all33original story modules,32direct transfers and the documented Button replacement; strict-history fails on16unresolved early grid scenarios.'
  e['newEvidence']+=['provenance-check.json','provenance-strict-history.json','provenance-tests.log','doc-links.json']
 if e['id'] in ['A-B-12','A-W-10']:e['newEvidence']+=['provenance-check.json','provenance-strict-history.json']

 if e['id']=='A-W-13' and integrated:
  e['decision']+=' Coordinator concurrently integrated the exact proposed table; observed shared guide hash equals reviewed proposedSha256. Do not reapply it.'
  e['remainingSuccessors']='W13-API: join complete historical inherited-prop/default/release-marker dispositions with the A-B-05/A-Z-13 owner. The12removed-export table is already integrated.'
write('results.json',r)
plan={'preconditions':['Coordinator serializes all shared validation and fixes a candidate head/input/output manifest. Preserve user server3000 and existing leases.','Use supported Node22.12+/24 and existing frozen dependencies; no installation or build is needed for metadata/tool tests.','The two new standalone scripts are direct working-tree changes authorized by later user steering; the consumer guide is an unapplied proposal. Do not reapply old wave03patches already integrated.'],
'checks':[
 {'ids':['A-B-12','A-W-10','A-W-19'],'cwd':'repository root','command':'node --test packages/ui/scripts/check-docs-provenance-wave04.test.mjs','expected':'Five tests pass; regressions reject missing replacements, changed provenance/identity, stale present flags, lost scenario aliases and stale package script/filter names.','executedHere':True,'runtime':'Node26.5.0 authoring/tool evidence; supported runtime confirmation remains coordinator-owned.'},
 {'ids':['A-B-12','A-W-10','A-W-16','A-W-19'],'cwd':'repository root','command':'node packages/ui/scripts/check-docs-provenance-wave04.mjs --json','expected':'structural-checks-pass;201rows,33original story modules,32direct pre-docs transfers,1deliberate Button replacement,27current-guide command snippets;16earlier grid semantic scenarios explicitly unresolved.','executedHere':True},
 {'ids':['A-B-12','A-W-10'],'cwd':'repository root','command':'node packages/ui/scripts/check-docs-provenance-wave04.mjs --strict-history --json','expected':'Currently exits1 with16specific unresolved scenario names. Obtain per-scenario accepted semantic mappings/required tests or explicit human dispositions before this can pass. Do not remove them, whitelist them silently or change the original extraction baseline.','executedHere':True,'result':'Expected failure; retained as failed, not a completed history acceptance check.'},
 {'ids':['A-W-13'],'cwd':'repository root','command':'git apply --check docs/developer/final-acceptance/wave-04/15/consumer-removed-exports.patch','expected':'Patch applies against reviewed docs/migration.md hash. After coordinator integration,all12removed names match the reviewed symbol table. Documentation-only table requires no UI suite.','executedHere':True},
 {'ids':['A-W-19'],'cwd':'repository root','command':'python3 docs/developer/final-acceptance/wave-04/15/audit-doc-links.py','expected':'Retain all tracked Markdown findings and parser limits. Review historical/evidence/mirror findings explicitly. No automatic history rewrite or blanket all-doc integrity pass.','executedHere':True},
 {'ids':['A-M-38','A-Z-12','A-Z-15','A-Z-16'],'cwd':'repository root','command':'python3 docs/developer/final-acceptance/wave-04/15/reconcile.py','expected':'Read-only inputs; writes only15.17prior reviewedreport/result pairs match,manifest identities survive,37rowtrace includes current source hashes,139A/0V canonical count preserved. Rerun only to capture a deliberate newer source snapshot; do not overwrite historical receipts as current runtime evidence.','executedHere':True},
 {'ids':['A-I-08'],'cwd':'repository root','command':'node docs/developer/final-acceptance/wave-03-15/bundle-probe.mjs','expected':'On supported Node,selected icon bundles prune unrelated glyphs and preserve required ones; preserve final package/input hashes. Existing Node26probes remain dated evidence.','executedHere':False},
 {'ids':['A-I-08'],'cwd':'repository root','command':'node docs/developer/final-acceptance/wave-03-15/prepare-native.mjs','expected':'Coordinator generates static public-export fixture from the admitted built package; then run the already prepared two-case/three-engine config in wave03-15 validation plan with owned private host. Inspect optical images separately.','executedHere':False},
 {'ids':['A-H-08'],'cwd':'repository root','command':'node packages/ui/tests/apple/run-simulator.mjs --output /absolute/new/evidence-directory','expected':'Existing driver currently proves only selector speech. Expand named English/Arabic count/clear scenarios first, then record actual utterances/operator findings; this command alone cannot close H08. No device download, physical gesture or six-family certification inferred.','executedHere':False},
 {'ids':['A-D-20','A-W-19'],'cwd':'repository root','command':'pnpm --filter @structured-growth/docs exec playwright test tests/foundation-examples.spec.ts tests/catalog.spec.ts','expected':'Reuse retained two foundation cases and94route/1138source snapshots for matching inputs. Run only relevant changed/missing cases after coordinated fresh production build,not solely for checklist credit. Config owns3100.','executedHere':False,'reason':'Existing accepted scope retained; no uncoordinated browser/build.'}],
 'nonExecutableDecisions':{'A-B-14':'Original commit-bound upstream archive/status reference and authorized behavior capture.','A-M-38':'Actual per-row reviewed PR/commit/validation attribution.','A-W-18':'Accountable support/backport/cadence/intake/disclosure owner decisions.','A-Z-05':'Explicit provenance/literal-zero historical reference policy.','A-Z-12':'Complete actual human commitments and original M10/M14/M30 decisions.','A-Z-15':'All wave04integrated accepted results,final dependency/feature and required owner/legal decisions,exact PR/run/artifact records.','A-Z-16':'Required A completion before migration-complete decision; publishing separately requires explicit human release approval and production validation.'}}
write('validation-plan.json',plan)
# Deliberately report real command exits; expected strict-history failure remains visible.
commands=[['node','--test',*[],'packages/ui/scripts/check-docs-provenance-wave04.test.mjs'],['node','packages/ui/scripts/check-docs-provenance-wave04.mjs'],['node','packages/ui/scripts/check-docs-provenance-wave04.mjs','--strict-history'],['git','apply',*(['--reverse'] if integrated else []),'--check','docs/developer/final-acceptance/wave-04/15/consumer-removed-exports.patch']]
receipts=[]
for index,cmd in enumerate(commands):
 result=subprocess.run(cmd,cwd=ROOT,text=True,capture_output=True)
 log=f'check-{index+1}.log';(OUT/log).write_text(result.stdout+result.stderr)
 receipts.append({'command':cmd,'cwd':str(ROOT),'exitCode':result.returncode,'log':log,'expectedExitCode':1 if '--strict-history' in cmd else 0})
 assert result.returncode==(1 if '--strict-history' in cmd else 0),(cmd,result.stderr)
write('validation-results.json',{'runtime':subprocess.check_output(['node','--version'],text=True).strip(),'commands':receipts,'limits':'Tooling/metadata only; no build/browser/consumer/AT/legal/release checks.'})
print('Five negative tests and structural audit pass; strict-history failure16 retained; patch check passes.')
statusLines=[]
for e in r['entries']:
 statusLines.append(f"| {e['id']} | {e['recommendation']} | {e['remainingSuccessors']} |")
report='''# Wave04/15 — docs provenance and final reconciliation

Recommend **A-D-20 and A-W-16 complete** for their original documentation obligations;
**15 assigned leaves remain partial**. No canonical checklist/count changed. The
starting/current canonical snapshot remains181acceptedA/139openA,300acceptedV/0openV,
and6future. All17original full criteria, individual decisions, exact evidence paths
and SHA-256 values are in [results.json](results.json).

## Concrete implementation

Later user steering authorized direct new standalone scripts. Implemented:

- `packages/ui/scripts/check-docs-provenance-wave04.mjs`: read-only immutable local-Git
  extraction identity/presence/replacement guard; TypeScript AST checks all33original
  story modules against32direct current fixtures and the documented Button replacement;
  checks27explicit pnpm command snippets in four current guides. Missing mappings,
  fixture exports, replacement files and package scripts fail. Upstream authentication
  is explicitly outside local Git evidence.
- `packages/ui/scripts/check-docs-provenance-wave04.test.mjs`: five meaningful regression
  tests for lost/changed provenance, replacement/presence errors, omitted scenario
  aliases and stale script/filter commands, including prose false-positive handling.
- [consumer-removed-exports.patch](consumer-removed-exports.patch), mirrored under
  [proposed-files/docs/migration.md](proposed-files/docs/migration.md): all12absent
  baseline names get explicit replacements and migration impact, including MenuItem's
  type-versus-JSX boundary and retained aliases. The coordinator concurrently
  integrated this exact table: the observed shared guide hash matches the reviewed
  proposed hash, and reverse patch applicability passes. **Do not reapply it.**
- [migration-trace.json](migration-trace.json): all37Mrows now have current source/test
  hashes and completed V attribution, with HB19/20linked to the10affected editor rows.
  Actual per-row reviewed PR attribution remains explicitly unverified.
- [commitment-gate-map.json](commitment-gate-map.json) updates the prior repository
  commitment map with current source hashes and wave04ownership, retaining original
  commitment text/prior evidence limits. [completion-state.json](completion-state.json)
  keeps migration completion and publication authorization false.

All other authored files stay under wave04/15. Shared docs/ledgers/source/build outputs
were read-only here; the concurrent shared guide integration was coordinator-owned.
No install, build, server, browser, simulator, Git mutation, release or account action.

## Executed validation

[validation-results.json](validation-results.json) and check-1through4logs retain
actual commands and exit codes. Node26.5.0 was used for these lightweight tooling
checks, not supported-runtime product acceptance:

1. `node --test packages/ui/scripts/check-docs-provenance-wave04.test.mjs`:5pass.
2. `node packages/ui/scripts/check-docs-provenance-wave04.mjs --json`: structural
   checks pass:201rows,33originalstory modules,32direct transfers,1documented Button
   replacement and27command snippets;16earlier grid scenarios explicitly unresolved.
3. The same command with `--strict-history`: **exit1**, exactly16early grid exports
   still require semantic comparison/accepted disposition. This remains a failed
   strict acceptance check, not green history parity.
4. `git apply --reverse --check .../consumer-removed-exports.patch`: passes after
   coordinator integration; initial forward success and later state-change failure
   are explained in [retained-tooling-findings.md](retained-tooling-findings.md).
5. `python3 .../audit-doc-links.py`:646trackedMarkdown documents,5156local references,
   4280present,619missing-file findings,257absolute routes explicitly unchecked,
   zero unresolved explicit reference labels.611missing-file findings occur in
   evidence/batch/proposed-mirror paths; the other8are dated historical references
   in inventory/progress/release reports. These are retained for source review,
   not automatically repaired or accepted as current links. Bounded parser does
   not certify full CommonMark, MDX/TSX, arbitrary inline-code paths or shell execution.
6. `python3 .../reconcile.py`: all17reviewed prior report/result pairs match;
   all201manifest presence/replacement checks pass,159present/42absent, original
   source repository/commit/root preserved. Sequential source comparisons record
   concurrent input changes explicitly; no whole-tree atomic attestation is claimed.

## Accepted evidence reused and newer reconciliation

The former unexecuted wave03successors are no longer all pending. Retained follow-up
logs show the icon catalog case, both foundation cases after the specific locator
correction,94catalogroutes/1138compiledsnippets, and English/pseudo/Arabic formatting,
count/clear/reflow plus navigation motion cases in all3desktopengines. HB19and20close
all20previous editorVleaves with named native and rendered receipts. The prior
300/300Vrecord is preserved; no unrelated browser matrix was repeated.

[evidence.json](evidence.json) records exact prior/current/source/receipt hashes,
including absent ignored raw report paths. [foundation-input-comparisons.json](foundation-input-comparisons.json)
records which selected production foundation inputs were actually captured by the
old build inventory; null means not captured, not an invented hash match. The
follow-up foundation-spec hash matches its dedicated validated input receipt.
The raw first docs failures and corrected continuations remain retained upstream.
Current simulator speech proves only its two-selector scenario; it cannot stand
in for English/Arabic count/clear or six-family spoken observations.

A-D-20 closes the shipped source-backed foundation examples/publication obligation
under the approved docs host. A-W-16 closes the integrated truthful migration/manifest
update obligation. Neither asserts original upstream-byte authentication, every
historical story's behavioral parity, all-library documentation completeness, legal
approval, remote deployment, product release or migration completion.

## Per-leaf remaining work

| Original leaf | Recommendation | Specific successor |
| --- | --- | --- |
'''+ '\n'.join(statusLines)+'''

[validation-plan.json](validation-plan.json) gives bounded runnable commands,
preconditions and expected assertions. Reuse passing scopes whose relevant inputs
match; coordinator serializes only changed/missing validation. Do not restore
Storybook, repeat completed V work, turn unfinished requirements into future scope,
substitute DOM/axe for speech or infer human legal/release/support decisions.
'''
(OUT/'report.md').write_text(report)
write('implementation-files.json',{'directStandaloneFiles':[{'path':p,'sha256':sha(p)} for p in checks],
 'coordinatorIntegratedGuide':{'path':'docs/migration.md','sha256':sha('docs/migration.md'),'matchesReviewedProposal':integrated},
 'report':str((OUT/'report.md').relative_to(ROOT)),'results':str((OUT/'results.json').relative_to(ROOT))})
