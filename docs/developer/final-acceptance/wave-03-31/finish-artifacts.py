from pathlib import Path
import json,hashlib,difflib,datetime
root=Path.cwd(); out=root/'docs/developer/final-acceptance/wave-03-31'
p='docs/developer/react-aria-performance.md';old=(root/p).read_text()
new=old+'''

## Production profiling successor (A-B-10, A-P-08, A-G-20, A-X-19)

The `packages/ui/tests/performance` fixture is a separate production Vite host
using compiled public exports. Build the library once at an immutable reviewed
snapshot, then build the fixture with `pnpm --filter @structured-growth/sg-ui exec
vite build --config tests/performance/vite.config.mjs`. Start its preview using
`pnpm --filter @structured-growth/sg-ui exec vite preview --config
tests/performance/vite.config.mjs` in the coordinator's allocated profiling window.
It uses port 4179 and must not replace the user's docs server. Run
`pnpm --filter @structured-growth/sg-ui exec node
tests/performance/measure-browser.mjs /absolute/new-result.json`.
The output path must be new; preserve the original reference.

The small workload preserves the original 1,000 rows/two columns/page 50 shape;
wide uses 10,000 rows/20 columns/page 50; largePage uses the same data/page 200;
selector renders 2,000 host-provided options. Each workload uses three warmup
navigations and nine recorded navigations, sequential search input, selection,
grid sorting, and 50 updates at 100ms intervals affecting ten rows. Measurements
run from event capture or the timer callback to two post-commit animation frames;
they estimate presentation opportunities, not actual paint or standardized INP.
Initial measurements start at fixture module evaluation, excluding network startup.
Asset records include all emitted chunks, raw/gzip bytes and content hashes;
they are conservative output totals rather than per-route transfer sizes.

Compare only matching fixture hashes, workload, React/runtime/browser version,
hardware, viewport, throttling and measurement method. Store candidate and baseline
package/source hashes, load average, raw samples and exact commands. Use medians
and nearest-rank p95 across recorded samples, with separate initial, input, click
and update distributions. Do not compare historical SSR timings to browser latency.
Do not turn shared-checkout measurements into CI budgets. Select representative
slower consumer hardware and obtain two stable repeated sessions before proposing
browser timing/memory thresholds. Budget approval remains an owner decision;
regressions require investigation, not automatic reference inflation.

Lifecycle regression budgets are ownership counts: after final scope disposal,
zero owned pending scrollbar timers and document listeners; repeated disposal must
not release a live sibling. Existing ImageUploadModal tests verify preview URL
revocation on replacement, cancel and unmount, including late upload settlement.
These bounded regressions do not establish heap plateau. A browser allocation
profile must separately inspect retained grid/selector/portal/upload owners after
repeated mount/unmount and explicit GC where the profiling tool supports it;
record that instrumented method separately from responsiveness runs.

The historical 8KiB CSS budget belongs to its old composed consumer fixture.
The 2026-10-16 local distribution stylesheet measures 262,185 raw / 21,871 level-9
gzip bytes. This is a different artifact and must not be represented as a passing
old consumer budget or a minimal-import size. Editor-only, grid-only and composed
packed-consumer build graphs still require separate current-artifact receipts.
'''
(out/'proposed-files/docs/developer').mkdir(parents=True,exist_ok=True)
(out/'proposed-files'/p).write_text(new)
patch=''.join(difflib.unified_diff(old.splitlines(True),new.splitlines(True),fromfile='a/'+p,tofile='b/'+p))
for path in sorted((out/'proposed-files/packages/ui/tests/performance').iterdir()):
 rel=path.relative_to(out/'proposed-files').as_posix()
 patch+=''.join(difflib.unified_diff([],path.read_text().splitlines(True),fromfile='/dev/null',tofile='b/'+rel))
(out/'production-profiling.patch').write_text(patch)
a=json.loads((out/'assignment.json').read_text()); receipt=json.loads((out/'local-measurement-receipt.json').read_text())
inputs={}
for path in ['AGENTS.md','docs/developer/react-aria-final-acceptance.md','docs/developer/react-aria-performance.md','packages/ui/src/foundation/scrollbar-activity.ts','packages/ui/src/foundation/scrollbar-activity.test.ts','packages/ui/src/components/ImageUploadModal/ImageUploadModal.tsx','packages/ui/src/components/ImageUploadModal/ImageUploadModal.test.tsx','packages/ui/src/components/FloatingTextSelectionToolbar/FloatingTextSelectionToolbar.tsx','packages/ui/src/experimental/DataGrid/DataGrid.tsx','packages/ui/src/experimental/DataGrid/types.ts','packages/ui/src/experimental/AsyncMultiSelect/AsyncMultiSelect.tsx','docs/developer/final-acceptance/coordinator-integration/evidence.json']:
 inputs[path]=hashlib.sha256((root/path).read_bytes()).hexdigest()
prior={}
for id,v in a['priorEvidence'].items():
 prior[id]={}
 for kind in ['report','results']:
  actual=hashlib.sha256((root/v[kind]).read_bytes()).hexdigest()
  prior[id][kind]={'path':v[kind],'actual':actual,'expected':v[kind+'Sha256'],'matches':actual==v[kind+'Sha256']}
(out/'input-evidence.json').write_text(json.dumps({'inputs':inputs,'priorEvidenceVerification':prior,'priorSSRDelta':receipt['changedSincePriorSSR'],'coordinatorBuiltDelta':receipt['changedSinceCoordinator']},indent=2)+'\n')
plan={'schemaVersion':1,'patchIntegrationRequired':True,'noBuildInstallOrBrowserStarted':True,'commands':[{'cwd':'repository root','command':'git apply --check docs/developer/final-acceptance/wave-03-31/scrollbar-disposal.patch','expected':'Clean applicability only; coordinator reviews then applies; no application performed here.'},{'cwd':'repository root','command':'node /tmp/sgui-calendar-validate.mjs pnpm --filter @structured-growth/sg-ui exec vitest run src/foundation/scrollbar-activity.test.ts src/components/ImageUploadModal/ImageUploadModal.test.tsx','runtime':'Node24.21.0 or supported Node22.12+','expected':'Existing cases plus sibling/double-dispose and 100-lifetime regressions pass; URL replacement/cancel/unmount/late settlement stay green. Lease helper must fail rather than reclaim/spin if occupied.'},{'cwd':'repository root','command':'git apply --check docs/developer/final-acceptance/wave-03-31/production-profiling.patch','expected':'Review new host and additive performance guidance before applying.'},{'cwd':'packages/ui','command':'pnpm build && pnpm exec vite build --config tests/performance/vite.config.mjs','expected':'Coordinator-only immutable fresh library and production fixture build. Hash source/dist/fixture assets. New fixture TS should receive noEmit check against built public declarations before browser execution.'},{'cwd':'packages/ui','command':'pnpm exec vite preview --config tests/performance/vite.config.mjs','expected':'Allocated coordinator host4179, preserve user server3000.'},{'cwd':'packages/ui','command':'node tests/performance/measure-browser.mjs /absolute/new-performance-result.json','expected':'4 workloads x 12 navigations, 3 warmups/9 retained per workload, 50 updates each; raw initial/input/click/update samples, zero page errors and explicit runtime/hardware/asset hashes. Unrun here.'}], 'residualEvidence':['Run same fixture against a separately built immutable comparable baseline; no historical Node26 SSR-to-browser comparison.','Choose representative slower consumer device with owner; approve workload-specific initial/input/update and retention budgets after two stable sessions.','Record per-workload memory allocation/retainer traces after 100 mount/unmount, overlay open/close and upload replace/revoke cycles; a fake ownership counter is not heap memory evidence.','Reuse existing packed foundation/editor consumer scripts serially with explicit kept output fixtures; include minimal grid/editor/root paths and CSS side effects, record exact emitted chunks. No blanket rerun requested.']}
(out/'validation-plan.json').write_text(json.dumps(plan,indent=2)+'\n')
budgets={'scope':'Local investigation references only; no new owner-approved browser/CI gate','historicalSSRMedianMs':{'ownedButtons100':8,'ownedFields40':6,'asyncOptions200':18,'gridRows1000Page50':34,'rangeTwoMonths':10},'historicalEnvironment':'Apple M4 arm64 macOS, Node26.5.0, NODE_ENV unrecorded, 2026-10-06 record; workload HTML changed','newLocalReference':'local-ssr.json and local-measurement-receipt.json; production React; no comparison pass inferred','lifecycleCounts':{'finalOwnedDocumentListeners':0,'finalOwnedScrollbarTimers':0,'cycles':100,'idempotentDisposal':'must preserve live sibling'},'browserTimingMemoryBudget':{'status':'pending representative hardware and repeatable baseline','rule':'Use matching raw samples; choose threshold with maintainer after stable repeats. Never inflate threshold automatically.'}}
(out/'budgets.json').write_text(json.dumps(budgets,indent=2)+'\n')
