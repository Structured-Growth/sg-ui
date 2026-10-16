import json,re
from pathlib import Path
own=Path('docs/developer/final-acceptance/wave-02-04')
data=json.loads((own/'results.json').read_text())
lines=['# Wave 02-04 acceptance reconciliation','',
'**17 complete, four partial, zero blocked**, recommended for coordinator reconciliation. Each decision is against the full original assigned leaf, including historically checked leaves. No shared checkbox/count was edited.','',
'## Evidence boundaries','',
'- Source: existing uncommitted dev at HEAD 540f47d4059a9cea8890b80927f34f51ef2fbc3e. Captured hashes, not HEAD alone, identify inputs.',
'- [input-evidence.json](input-evidence.json) records 290 scoped source/test/config comparisons with FA-02 plus FA-04 corrections: all equal. This is a selected-input comparison, not a repeated inventory or scan of all package output.',
'- Reused FA-01–04 and coordinator-reviewed first-wave reconciliation, especially parallel-03 declarations, parallel-06 naming and parallel-12 icon mapping. FA-04 original command failed nine calendar cases; the corrected affected rerun reconciles retained 1,738-case/279-suite unit evidence. No passing suite was rerun.',
'- No test, build, browser, packed consumer, benchmark, install, network CI, server, release or Git mutation ran. New checks were read-only source/test/receipt reconciliation, selected hashes, migration/UX/prototype registers, and JSON/reference validation.',
'- Coordinator-owned PeriodPicker, DateTimeRangePicker, DateRangeComparisonPicker and TextArea may change concurrently. Their capture is explicitly excluded from old-output reuse. No conclusion accepts BUG-0008/0009 fixes or equates old dist with new source.',
'- Native receipts retain old Storybook versus replacement docs-owned fixture attribution. The documented packages/ui/artifacts/hb16-2026-10-16 and backlog raw artifact directories are absent locally; accepted checked-in documentary receipts remain evidence, but raw results/screenshots were not independently reopened.',
'- Deleted completed F/T child entries cannot be reconstructed from aggregate counts. F-C35/36/37 and T-C35/36/37 are linked as accepted groups with concrete current implementation/tests and named V receipts. No invented child counts or new V closure.',
'- Actual device/AT, complete native matrices, representative-hardware performance, all 20 editor V leaves, legal approval and human-approved release remain independent.','',
'## Delivered artifacts','',
'- [37-row migration index](migration-index.json): M-01–37 focus, current directory, F/T/V groups, source/test paths, historical PR attribution and current open V leaves.',
'- [Parity and UX register](ux-parity-register.json): sixteen classifications separating required parity, breaking APIs/defaults, improvements, host transition, corrections and deferred scope.',
'- [Prototype findings](prototype-findings.json): six proof outcomes, eight accessibility/runtime domains, baseline budgets/replay constraints and exact stale-guidance corrections.',
'- [Leaf decisions](results.json): all 21 IDs, verbatim original requirements, references, performed checks, limits, findings and successors.',
'- Reproduction scripts in this directory: reconcile.py, write-results.py, write-registers.py and write-report.py. Run with full paths from repository root; writes stay in this directory. They do not run product tests/builds.','',
'## Outcomes','',
'| Leaf | Status | Concrete result |','| --- | --- | --- |']
for leaf in data['leaves']:lines.append('| '+leaf['id']+' | '+leaf['status']+' | '+leaf['outcome'].replace('|','/')+' |')
def link(p):
 target=p.split('/')[-1] if 'wave-02-04/' in p else '../../../../'+p
 return '['+p.split('/')[-1]+']('+target+')'
for leaf in data['leaves']:
 requirement=re.sub(r'\]\((?!https?://)([^)]+)\)',lambda m:'](../../'+m.group(1)+')',leaf['originalRequirement'])
 lines+=['','## '+leaf['id']+' — '+leaf['status'],'','**Original:** '+requirement,'',leaf['outcome'],'',
 '**Source/contracts:** '+ '; '.join(link(p) for p in leaf['sourceReferences'])+'.']
 if leaf['testReferences']:lines+=['','**Existing tests/scenarios:** '+ '; '.join(link(p) for p in leaf['testReferences'])+'.']
 lines+=['','**Retained evidence:** '+ '; '.join(leaf['retainedEvidence'])+'.']
 lines+=['','**Checks performed:** read requirement and named source/tests/receipts; scoped input comparison; retained evidence reuse. No new runtime execution.']
 lines+=['','**Findings:** '+' '.join(leaf['findings'])]
 if leaf['inputHeadHostLimits']['specific']:lines+=['','**Limit:** '+leaf['inputHeadHostLimits']['specific']]
 if leaf['successorDeliverables']:
  for succ in leaf['successorDeliverables']:lines+=['','**'+succ['id']+':** '+succ['deliverable']+' Prerequisite: '+succ['prerequisites']]
 else:lines+=['','No required successor for this original leaf; linked broader acceptance gates retain their own scope.']
lines+=['','## Closure boundary','',
'Complete means this named migration, decision, proof or documentation obligation is supported by cited source and retained evidence. It does not mean the entire component or migration is production accepted. Partial leaves have concrete artifacts and exact successors above. None is blocked merely because operator or maintainer evidence is still required. The coordinator owns shared acceptance reconciliation.','']
(own/'report.md').write_text('\n'.join(lines))
print('Assembled report for 21 original obligations.')
