from pathlib import Path
import json,subprocess,hashlib,datetime
r=Path.cwd(); o=r/'docs/developer/final-acceptance/wave-04/09'
def save(name,obj):(o/name).write_text(json.dumps(obj,indent=2)+'\n')
def sha(p):return hashlib.sha256(p.read_bytes()).hexdigest()
checks=[]
for args in [
 ['node','--check',str(o/'proposed-files/packages/ui/scripts/run-acceptance-consumers.mjs')],
 ['node','--check',str(o/'proposed-files/packages/ui/tests/performance/measure-memory.mjs')],
 ['node',str(o/'check-fixture-types.mjs')],
 ['node','packages/ui/scripts/check-icon-import-boundaries.mjs','packages/ui/src'],
 ['git','apply','--check',str(o/'package-performance-successors.patch')]]:
 result=subprocess.run(args,text=True,capture_output=True)
 checks.append({'command':args,'cwd':str(r),'exitCode':result.returncode,'stdout':result.stdout,'stderr':result.stderr})
save('checks.json',{'runtime':subprocess.check_output(['node','--version'],text=True).strip(),'at':datetime.datetime.now(datetime.timezone.utc).isoformat(),'checks':checks,'limitations':'Static/syntax/type preparation checks only. No production build, consumer install, package/browser suite, simulator, or memory run.'})
assert all(row['exitCode']==0 for row in checks)
successors={
'A-B-10':'Run existing uninstrumented production profiling fixture twice on an immutable comparable baseline/candidate; retain current packed grid/editor/root/basic module and raw/gzip asset receipts. SSR and total stylesheet references remain historical, not browser results.',
'A-A-18':'Review concrete existing-package/subpath versus optional core/editor split proposal in react-aria-import-boundaries.md; execute packed auditor on matching candidate. Record maintainer decision explicitly; do not infer it from integration.',
'A-E-08':'Record maintainer decision on mandatory Lexical install cost versus separate optional editor/core packages. Granular module isolation is implemented; single-package manifest still installs ten direct Lexical roots. Validate chosen packed import recipe.',
'A-I-04':'Retain current source guard pass and individual export routes; execute installed packed AddIcon pruning/positive control and five-wrapper traversal assertions using current candidate. Historical checked state alone does not establish current bundle pruning.',
'A-P-08':'Owner selects representative slower consumer hardware; record two stable repeated baseline/candidate sessions, exact workload/browser/runtime/hash and approved workload-specific latency/memory investigation thresholds. Do not promote old M4 SSR budgets to browser timing gates.',
'A-R-03':'Adopt/reject documented compatibility-preserving existing subpath design with explicit maintainer reference; execute clean installed recipes across core/theme/tokens/styles/primitives/icons/hooks/adapters/i18n/grid/editor/learning paths.',
'A-R-04':'Execute current packed module auditor plus installed SSR/React19 Flight controls; retain intentional root/components convenience traversal separately from granular presentation boundaries. No source client-directive or static-graph substitution for server execution.',
'A-R-08':'Use proposed integrated-script launcher on a reviewed immutable tarball for clean Vite foundation/editor React18/19 and Next19 production/SSR scopes. Reuse unchanged accepted scope receipts; run missing/affected scopes only, preserving failures. Browser mode supplies extra existing hydration assertions.',
'A-X-19':'Execute new separately instrumented 5+25 same-document disposal cycles for all four workloads; inspect warm/final heap retaining paths and repeat sessions before selecting memory budgets. Reuse integrated scrollbar/URL/toolbar cleanup cases at attributable inputs; grid/selector profile does not replace editor/upload allocation review.',
'A-Z-09':'Run same clean installed matrix as A-R-08, retain actual installed graphs without retired @mui/@emotion packages and executed core/grid/date/editor assertions. No duplicate matrix per leaf; package import/equality passes do not establish clean installs.'}
assignment=json.loads((o/'assignment.json').read_text())
leaves=[]
for id,original in zip(assignment['ids'],assignment['obligations']):
 wave='31' if id in ['A-B-10','A-P-08','A-X-19'] else '32' if id in ['A-R-08','A-Z-09'] else '05'
 evidence=['input-hashes.json','prior-reconciliation.json','retained-decisions.json','checks.json',f'docs/developer/final-acceptance/wave-03-{wave}/report.md',f'docs/developer/final-acceptance/wave-03-{wave}/results.json']
 leaves.append({'id':id,'originalObligation':original,'recommendation':'partial','evidence':evidence,'successor':successors[id],'proposedChanges':['package-performance-successors.patch'] if id in ['A-B-10','A-P-08','A-X-19','A-R-08','A-Z-09'] else [],'limits':'No fresh installed/production/native/browser/memory/owner approval result. Relevant SHA256 identities are in input-hashes.json and artifact-hashes.json.'})
save('results.json',{'schemaVersion':1,'assignment':'Package boundaries and performance','baselineHead':subprocess.check_output(['git','rev-parse','HEAD'],text=True).strip(),'scope':'Writes only docs/developer/final-acceptance/wave-04/09; proposals unapplied; no Git/index/branch mutation.','leaves':leaves,'summary':{'complete':0,'partial':10,'blocked':0},'validationPlan':'validation-plan.json','laterReceipts':'HB19/HB20 supersede old editor presentation gaps, not these performance/installed-consumer obligations.','countsChanged':False})
plans=[
{'name':'review/apply proposals','cwd':'repository root','command':'git apply --check docs/developer/final-acceptance/wave-04/09/package-performance-successors.patch','expected':'Applicability passes; coordinator reviews exact five replacement/new files before applying. Do not reapply earlier wave03 patches.'},
{'name':'installed-consumer matrix','cwd':'repository root','command':'node packages/ui/scripts/run-acceptance-consumers.mjs --tarball /absolute/frozen-reviewed.tgz --expected-sha256 REVIEWED_SHA256 --output /absolute/new-node24-matrix --browser','expected':'Five independent production/SSR scopes and existing browser assertions pass on the same reviewed artifact. Capture actual graph/version/fixture/browser receipts. Use --only for missing/affected continuation scopes; repeat Node22.12 only for missing required support evidence.'},
{'name':'packed boundaries','cwd':'repository root','command':'node packages/ui/scripts/audit-packed-import-boundaries.mjs /absolute/installed-foundation-fixture /absolute/new-boundary-receipt.json','expected':'14 entries; no Lexical from core; grid/editor positive controls; icon selected retained/unrelated pruned; CSS retained. This auditor writes receipt and performs in-memory production builds, so lease required.'},
{'name':'production profiling fixture','cwd':'packages/ui','command':'pnpm exec vite build --config tests/performance/vite.config.mjs','expected':'One fresh immutable fixture build after proposal integration and source/output reconciliation. Reuse matching existing library build; only rebuild library when relevant inputs differ. Record identity.'},
{'name':'allocated preview','cwd':'packages/ui','command':'pnpm exec vite preview --config tests/performance/vite.config.mjs','expected':'Serve immutable build at 127.0.0.1:4179 with strictPort. Preserve user3000 and close own host in final cleanup.'},
{'name':'latency','cwd':'packages/ui','command':'node tests/performance/measure-browser.mjs /absolute/new-latency.json','expected':'Existing 3+9 samples, four workloads, exactly50 updates per run, zero page errors; preserve raw samples and environment. Repeat matching baseline/candidate sessions; no GC instrumentation here.'},
{'name':'memory','cwd':'packages/ui','command':'node tests/performance/measure-memory.mjs /absolute/new-memory --snapshots','expected':'Four workloads x30 same-document disposal cycles, 5 warmup/25 recorded; active update disposal, portal removal, GC counters, optional valid warm/final snapshots. Review retaining paths and repeat sessions; pass is harness completion, not approved byte/plateau budget.'}]
save('validation-plan.json',{'status':'prepared-not-executed','serialization':'Coordinator owns validation lease; use existing /tmp/sgui-calendar-validate.mjs if still canonical/available. Acquire before install/build/server/browser. Never reclaim occupied lease. Do not run commands concurrently. No commands in this plan executed by this worker except applicability.','prerequisites':['Node24 or supported Node22.12+, pnpm10.29.3; reviewed candidate and frozen source/build snapshot','Explicit reviewed tarball SHA required before install; new output paths','Browser binaries available; owner-selected representative hardware for budget decisions','After commands, verify hashes of immutable source, dist, candidate and fixture outputs; preserve failed receipts'], 'commands':plans,'failurePolicy':'Keep original failed logs/partial snapshots. Correct concrete issue and rerun only affected scopes, preserving previous passes. Stop on lease contention. Never claim snapshot truncation as valid memory evidence.','ownerDecision':{'required':True,'proposal':'Existing compatibility package and granular paths with mandatory Lexical installation, or explicit optional core/editor split with compatibility umbrella. No decision inferred.','independentWork':'Concrete installed and profiling fixture checks can run while package decision/hardware-budget review remains pending.'}})
report='''# Package boundaries and performance — wave 04/09

All ten assigned leaves remain **partial**. No central checklist/count change is
recommended. This handoff supplies a five-file reviewable patch and executable
bounded validation plan; it does not claim unperformed consumer or profiling runs.

Only this assignment directory was written. HEAD remained
`6c485ed79d0d6a521d188e5bde8315722296f518` on `dev`. No build, install,
consumer/package/browser suite, simulator, server, Git index/branch mutation,
commit, push or publication was performed.

## Reconciliation and retained evidence

Read AGENTS.md, README, migration/component architecture, current final acceptance
and hardening execution, wave03-05/31/32 reports/results/successors, their integration
reconciliation/push receipt, later follow-up and HB19/HB20 receipts. Exact SHA256
identities are in `input-hashes.json`; `retained-decisions.json` verifies all ten
prior report/result references against coordinator reconciliation. Every referenced
prior report/result hash matches. HB19/HB20 close the old editor V presentation
work; this report carries none of those old gaps forward.

`prior-reconciliation.json` compares integrated files with prior proposal mirrors:
wave03-05 has7/9 identical, wave03-31 has7/8, wave03-32 has6/6. The changed grid
interaction/drag-handle and floating-toolbar test files contain later work; do not
restore old full-file replacements. Earlier direct icon fixes, cleanup fixes,
profiling host, consumer artifact/CSS/type helpers and import recipes are already
integrated. Old report wording saying “integrate patch” is superseded for these
files. The complete source icon guard now passes438 production files.

Retain prior local SSR/size and cleanup results within their dated source/runtime
limits. The later package/build/unit receipts are evidence of their recorded
checks; neither package-byte equality nor HB20 native presentation proves a clean
installed Vite/Next matrix, current icon bundle pruning, performance timing or heap
retainer plateau. No such missing runtime result was discovered or invented here.
The existing manifest still requires ten direct Lexical packages, so granular
import isolation does not remove mandatory editor installation weight. The
compatibility-package versus optional core/editor decision remains documented and
pending an attributable maintainer decision.

## Concrete deliverables

`package-performance-successors.patch` and matching `proposed-files` contain:

- `packages/ui/scripts/run-acceptance-consumers.mjs`: durable launcher derived from
  wave03-32, staging current integrated scripts/assertions rather than historical
  proposal mirrors. All six helper mirrors match today. It requires the reviewed
  external tarball SHA before installation, retains independent fixtures/graphs/logs
  and preserves `--only`, five serial scopes and existing browser assertions.
- `packages/ui/tests/performance/fixture.tsx`: same workload/latency semantics with
  explicit same-document remount and idempotent fixture-root disposal. Existing
  interval/RAF cleanup is retained. No library implementation changes.
- `packages/ui/tests/performance/measure-memory.mjs`: separate Chromium CDP runner
  for5 warmup+25 recorded cycles of each existing workload. It exercises query,
  selection, sort, open selector portal and disposal during updates; verifies empty
  root/scopes/options and stopped samples; records raw post-GC whole-page counters.
  Optional warm/final snapshots support retaining-path review, with bounded size/time.
  It verifies preview assets and before/after compiled outputs and saves failures.
- Exact additive replacement guides for performance and package acceptance, describing
  methods, commands and limits without claiming execution or approving budgets.

The memory runner covers grid/selector/Provider and selector-portal ownership.
Upload/editor allocation profiling remains a separate successor. Existing upload
URL replacement/cancel/unmount/late-settlement and toolbar observer/queued-command
regressions stay intact. Browser counters include runtime caches and are not
SGUI-attributed leak counts, process RSS, or an approved byte/plateau budget.
Instrumentation/GC results must stay separate from uninstrumented latency.

## Checks actually performed

`checks.json` records exact commands, cwd, stdout/stderr, runtime and exit codes.
Both new runners pass syntax checks; proposed fixture passes strict noEmit
TypeScript checking against current built public declarations; the current source
icon guard passes438 files; `git apply --check` passes the complete patch without
applying it. Runtime was local Node26.5.0, preparation only. This does not replace
supported Node22/24 consumer/runtime validation. No fresh library/output identity
is inferred merely from reading existing declarations.

## Per-ID original obligation and concrete successor

'''
for leaf in leaves:
 report+=f"### {leaf['id']} — partial\n\n{leaf['originalObligation']}\n\n{leaf['successor']}\n\n"
report+='''`results.json` preserves every original statement verbatim, with exact evidence
references and proposed changes per ID. `validation-plan.json` provides serialized
commands and acceptance assertions. One installed matrix serves A-R-08/A-Z-09;
one packed auditor serves A-A-18/A-E-08/A-I-04/A-R-03/A-R-04. Run missing/affected
scopes only. Do not rerun unrelated accepted work or infer external owner approval,
physical device/AT, CI or production release acceptance from these preparations.
'''
(o/'report.md').write_text(report)
save('artifact-hashes.json',{str(f.relative_to(o)):sha(f) for f in sorted(o.rglob('*')) if f.is_file() and f.name!='artifact-hashes.json'})
