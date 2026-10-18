from pathlib import Path
import subprocess,json,hashlib,datetime
r=Path.cwd();o=r/'docs/developer/final-acceptance/wave-04/09'
h=lambda p:hashlib.sha256(p.read_bytes()).hexdigest()
commands=[['node','--test','packages/ui/scripts/consumer-matrix-options.test.mjs','packages/ui/tests/consumers/performance-proof-policy.test.mjs'],['node','--check','packages/ui/scripts/run-acceptance-consumers.mjs'],['node','--check','packages/ui/tests/performance/measure-memory.mjs'],['node',str(o/'check-merged-fixture-types.mjs')],['git','apply','--check',str(o/'fixture-diagnostic-retention.patch')],['git','apply','--check',str(o/'guide-memory-correction.patch')]]
checks=[]
for command in commands:
 c=subprocess.run(command,text=True,capture_output=True,cwd=r);checks.append({'command':command,'cwd':str(r),'exitCode':c.returncode,'stdout':c.stdout,'stderr':c.stderr})
assert all(c['exitCode']==0 for c in checks)
paths=['packages/ui/scripts/run-acceptance-consumers.mjs','packages/ui/scripts/consumer-matrix-options.mjs','packages/ui/scripts/consumer-matrix-options.test.mjs','packages/ui/tests/performance/measure-memory.mjs','packages/ui/tests/consumers/performance-proof-policy.mjs','packages/ui/tests/consumers/performance-proof-policy.test.mjs','packages/ui/tests/performance/fixture.tsx','docs/developer/react-aria-performance.md']
receipt={'date':datetime.datetime.now(datetime.timezone.utc).isoformat(),'node':subprocess.check_output(['node','--version'],text=True).strip(),'head':subprocess.check_output(['git','rev-parse','HEAD'],text=True).strip(),'actualWorkerChanges':paths[:6],'coordinatorOwnedReadOnlyInputs':paths[6:],'sourceHashes':{p:h(r/p) for p in paths},'checks':checks,'notRun':['Build/install/package suite','Browser or memory execution','Xcode/simulator','Git mutations'],'integrationRequired':['fixture-diagnostic-retention.patch','guide-memory-correction.patch'],'limits':'Nine Node-only assertion/parser tests are preparation/harness evidence, not observed browser cleanup, supported runtime matrix, or memory budgets.'}
(o/'implementation-followup.json').write_text(json.dumps(receipt,indent=2)+'\n')
report='''# Implementation follow-up after coordinator integration

The coordinator applied the initial patch and merged the shared performance
fixture with conversation04. Per the user's request for implementation, this
follow-up now changes actual source in six exclusive tooling/test paths:

- `packages/ui/scripts/run-acceptance-consumers.mjs`
- `packages/ui/scripts/consumer-matrix-options.mjs` (new)
- `packages/ui/scripts/consumer-matrix-options.test.mjs` (new)
- `packages/ui/tests/performance/measure-memory.mjs`
- `packages/ui/tests/consumers/performance-proof-policy.mjs` (new)
- `packages/ui/tests/consumers/performance-proof-policy.test.mjs` (new)

The earlier report's assignment-directory-only claim describes the initial
handoff, before the explicit follow-up authorization. These six actual code
changes are intentional and unstaged; no commit, push, release or branch action.

The consumer launcher validates all arguments before creating directories or
starting jobs. Missing/misspelled/empty/duplicate --only scopes cannot widen a
continuation to a full matrix. Reviewed SHA and absolute paths remain mandatory.
The receipt now hashes launcher and parser as well as staged child assertions.
Existing clean tarball installs, SSR, Flight, positive/negative typings, CSS,
pruning, hydration assertions, failure logs and retained fixtures are preserved.

The memory runner now covers processing/catalog small, wide and largePage plus
processing selector: seven configurations,30 cycles each (5 warmup/25 recorded).
It uses native label activation and asserts checkbox state. Catalog sorting uses
its real Ascending menu choice, then reopens the sort-menu portal while updates
are active and disposes the owner. AsyncMultiSelect is correctly recorded as an
inline ListBox; it does not establish portal coverage. Every disposal checks
mount/update state, root children, scopes, options, menus, host RAFs/timers, and
later sample counts. Missing/non-finite/impossible CDP counters fail. Failures
remain receipts even if browser close itself fails. These are instrumentation
checks, not invented memory thresholds or automatic leak attribution.

## Small coordinator-owned deltas still to apply

`fixture-diagnostic-retention.patch` applies cleanly to the current merged fixture.
It snapshots lifecycle getter values after unmount so the global diagnostic API
releases getter closures retaining fixture refs. Keeping live getter closures is
an avoidable profiling retention root; its presence does not prove a library leak.
The patch also imports AppDataGrid through its existing granular public subpath,
avoiding an unnecessary root/editor traversal in the profiling fixture.
No shared fixture was edited by this worker. The proposed delta typechecks against
the current built public declarations. `guide-memory-correction.patch` corrects
portal claims and documents the seven configurations; it also applies cleanly.
Do not reapply stale full-file copies from the initial proposal.

## Exact executed checks and next validation

`implementation-followup.json` records source SHA256s and exact commands/logs.
Nine lightweight Node assertion/parser tests pass. Both runners pass node --check;
the proposed merged fixture passes strict noEmit declaration checking; both small
patch applicability checks pass. Runtime Node26.5.0 is analysis only, not supported
Node22/24 consumer evidence. Xcode currently owns the coordinator heavy lease;
no install, build, package/browser suite, preview, simulator or memory run started.

After the coordinator applies the two small patches and obtains the lease:

1. Run the existing installed matrix on the reviewed tarball, saving its SHA,
   missing/affected scopes and failures. Do not duplicate accepted scopes.
2. Build the single immutable production profiling fixture and start its owned
   preview4179. Reuse attributable compiled library output or rebuild only changed
   dependencies as required by the coordinator snapshot.
3. Run `node tests/performance/measure-memory.mjs /absolute/new-memory --snapshots`
   from packages/ui. Expect210 same-document cycles and14 valid optional snapshots,
   split by renderer/workload. Inspect retaining paths and repeated-session trends.
   Preserve invalid/partial captures as failures; do not approve a budget from
   harness completion alone. Keep GC results separate from latency profiling.

All ten original acceptance statuses remain partial pending their original
runtime/owner successors. Shared module package split decisions, representative
hardware, upload/editor allocation review and supported-runtime production
consumer validation remain explicit. This follow-up does not change acceptance
counts or weaken any existing assertion.
'''
(o/'implementation-followup.md').write_text(report)
p=o/'results.json';results=json.loads(p.read_text());results['implementationFollowup']={'report':'implementation-followup.md','receipt':'implementation-followup.json','actualSourcePaths':paths[:6],'coordinatorPatches':['fixture-diagnostic-retention.patch','guide-memory-correction.patch'],'executedTests':9,'runtimeAcceptanceClosed':False};p.write_text(json.dumps(results,indent=2)+'\n')
p=o/'report.md';s=p.read_text();s+='\n## Authorized implementation continuation\n\nThe coordinator integrated the first proposal. The later user-authorized source\nchanges and nine passing harness tests are documented in\n[implementation-followup.md](implementation-followup.md), with exact hashes and\nchecks in [implementation-followup.json](implementation-followup.json). This\nsupersedes the original handoff-only scope for that subsequent turn. Two small\nshared fixture/guide deltas remain coordinator-owned patches.\n';p.write_text(s)
(o/'artifact-hashes.json').write_text(json.dumps({str(p.relative_to(o)):h(p) for p in sorted(o.rglob('*')) if p.is_file() and p.name!='artifact-hashes.json'},indent=2)+'\n')
