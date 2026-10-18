from pathlib import Path
import json,hashlib,subprocess,datetime,difflib
r=Path.cwd(); o=r/'docs/developer/final-acceptance/wave-04/09'; p=o/'proposed-files'
def sha(path):return hashlib.sha256(path.read_bytes()).hexdigest()
def save(path,obj):path.write_text(json.dumps(obj,indent=2)+'\n')
# Full exact replacement guide; no changes to shared source.
s=(r/'docs/developer/react-aria-performance.md').read_text()+'''

## Instrumented same-document disposal successor

`tests/performance/measure-memory.mjs` adds a separate Chromium/CDP profiling run.
After the coordinator builds the reviewed fixture once and serves its immutable
production output on loopback4179, run from `packages/ui`:

```sh
node tests/performance/measure-memory.mjs /absolute/new-memory-evidence --snapshots
```

Do this in a serialized validation window under the existing coordinator lease.
The destination must be new. The runner checks every served fixture asset against
local build hashes, saves the compiled library output inventory before and after,
and records browser/runtime/hardware/load metadata. Each of the four existing
workloads gets five warmup and 25 recorded same-document mount/unmount cycles.
Grid cycles select/sort; selector cycles query/select and reopen the results
portal. Each cycle starts periodic updates and disposes while updates are active.
The fixture cancels its own interval/RAFs; the runner checks empty root/scopes/options,
stopped updates, and no new samples during a later observation window. These
assertions supplement the existing resource-owner unit checks.

After explicit GC, raw whole-page DOM-node/listener/document and JS-heap counters
are retained for every cycle. Optional warm/final heap snapshots (maximum256MiB,
60s each) support manual retaining-path review. Snapshots may contain fixture data;
use this synthetic workload. Failed/partial captures remain evidence, not valid
heap snapshots. Counters include React/browser/runtime caches; a flat counter or
absence of growth does not establish that every SGUI owner was released. Review
retaining paths and repeated sessions before proposing a plateau/byte threshold.
No new numeric memory budget is invented or automatically approved here.

GC-instrumented runs are separate from uninstrumented latency runs and are not
RSS, INP, Firefox/WebKit, physical-device or upload/editor allocation evidence.
Existing ImageUploadModal URL and FloatingTextSelectionToolbar observer/queued
command regressions remain independently attributable. Extend actual allocation
profiling to those owners only if their broader A-X-19 successor requires it.
'''
(p/'docs/developer/react-aria-performance.md').write_text(s)
# This durable launcher does not stage historical proposal files.
s=(r/'docs/developer/react-aria-package-acceptance.md').read_text()+'''

## Reviewed immutable-consumer execution

After the coordinator has frozen a reviewed tarball, the integrated-script launcher
runs the existing five scopes serially and retains their independent installed
fixtures, commands, stdout/stderr, installed graphs, browser artifacts and hashes:

```sh
node packages/ui/scripts/run-acceptance-consumers.mjs \\
  --tarball /absolute/reviewed-candidate.tgz \\
  --expected-sha256 REVIEWED_64_CHARACTER_SHA256 \\
  --output /absolute/new-consumer-evidence --browser
```

Use the existing validation lease and supported Node22.12/24 window. The launcher
checks the reviewed hash before any consumer install, copies the current integrated
scripts and existing assertions, and does not build/pack shared library output.
The driver-only tool symlink does not replace independent tarball installations.
Existing output paths are rejected. `--only foundation18,foundation19` (or editor18,
editor19,next19) supports bounded continuations; keep original failed receipts.
Next always executes browsers; Vite hydration requires `--browser`. This command
is a prepared path until its actual matrix receipt is reviewed. It does not
supply owner package-split decisions, CI/release approval, or new support promises.
'''
(p/'docs/developer/react-aria-package-acceptance.md').write_text(s)
# Reproducible exact applicability patch; new files carry /dev/null old label.
patch=''
for file in sorted(p.rglob('*')):
 if file.is_file():
  rel=file.relative_to(p); old=r/rel
  patch+=''.join(difflib.unified_diff(old.read_text().splitlines(True) if old.is_file() else [],file.read_text().splitlines(True),fromfile='a/'+str(rel) if old.is_file() else '/dev/null',tofile='b/'+str(rel)))
(o/'package-performance-successors.patch').write_text(patch)
# Hash every source/config/receipt this report relies upon. No generated output scan/rebuild.
paths=['AGENTS.md','README.md','docs/migration.md','docs/developer/component-architecture.md','docs/developer/react-aria-final-acceptance.md','docs/developer/react-aria-hardening-execution.md','docs/developer/react-aria-import-boundaries.md','docs/developer/react-aria-performance.md','docs/developer/react-aria-package-acceptance.md','packages/ui/package.json','pnpm-lock.yaml','docs/developer/final-acceptance/wave-03-integration/reconciliation.json','docs/developer/final-acceptance/wave-03-integration/push-evidence.json','docs/developer/final-acceptance/wave-03-followup/validation-results.json','docs/developer/final-acceptance/editor-chrome-presentation/results.json','docs/developer/final-acceptance/rich-editor-presentation/results.json','packages/ui/src/foundation/scrollbar-activity.ts','packages/ui/src/foundation/scrollbar-activity.test.ts','packages/ui/src/components/ImageUploadModal/ImageUploadModal.test.tsx','packages/ui/src/components/FloatingTextSelectionToolbar/FloatingTextSelectionToolbar.test.tsx']
paths += [str(x.relative_to(r)) for x in (r/'packages/ui/tests/performance').iterdir() if x.is_file()]
paths += ['packages/ui/scripts/'+name for name in ['test-foundation-consumer.mjs','test-editor-consumer.mjs','test-next-consumer.mjs','consumer-artifact.mjs','consumer-css-proof.mjs','consumer-types-proof.mjs','audit-packed-import-boundaries.mjs','check-icon-import-boundaries.mjs']]
for n in ['05','31','32']:paths += [f'docs/developer/final-acceptance/wave-03-{n}/'+name for name in ['report.md','results.json','validation-plan.json']]
identity={path:sha(r/path) for path in sorted(set(paths))}
save(o/'input-hashes.json',{'capturedAt':datetime.datetime.now(datetime.timezone.utc).isoformat(),'head':subprocess.check_output(['git','rev-parse','HEAD'],text=True).strip(),'hashAlgorithm':'sha256','files':identity})
# Preserve coordinator decisions, independently checking the prior report identities.
recon=json.loads((r/'docs/developer/final-acceptance/wave-03-integration/reconciliation.json').read_text())
def rows(obj):
 if isinstance(obj,dict):
  if 'id'in obj:yield obj
  for v in obj.values():yield from rows(v)
 elif isinstance(obj,list):
  for v in obj:yield from rows(v)
assigned=json.loads((o/'assignment.json').read_text())
selected=[]
for row in rows(recon):
 if row.get('id') in assigned['ids']:
  rec=dict(row)
  rec['priorReportHashMatches']=identity.get(row.get('report'))==row.get('reportSha256')
  rec['priorResultsHashMatches']=identity.get(row.get('results'))==row.get('resultsSha256')
  selected.append(rec)
save(o/'retained-decisions.json',selected)
