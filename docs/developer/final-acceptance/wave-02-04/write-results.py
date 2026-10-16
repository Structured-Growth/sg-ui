import json,re,datetime,hashlib
from pathlib import Path
own=Path('docs/developer/final-acceptance/wave-02-04')
hard=Path('docs/developer/react-aria-hardening-tasks.md').read_text()
base='packages/ui/src/'
docs='docs/developer/'
leaves=[]
def add(id,status,outcome,source,tests,evidence,findings,successors,limits=''):
 line=next(line for line in hard.splitlines() if re.match(r'^- \[ \] '+re.escape(id)+r'\b',line))
 leaves.append({'id':id,'status':status,'originalRequirement':line.split(id+' ',1)[1],
 'outcome':outcome,'sourceReferences':source,'testReferences':tests,'retainedEvidence':evidence,
 'checksActuallyPerformed':['Read full requirement and named source/tests/contracts','Compared selected relevant hashes with FA-02 plus FA-04 corrections; see input-evidence.json','Reused accepted evidence; no test/build/browser/consumer execution'],
 'findings':findings,'successorDeliverables':successors,
 'inputHeadHostLimits':{'head':'540f47d4059a9cea8890b80927f34f51ef2fbc3e','source':'Uncommitted dev; input-evidence.json hashes bound conclusions; four concurrent controls excluded.',
 'host':'Unit evidence is jsdom/Node. Old Storybook and newer docs-owned native receipts remain separately attributed; no fresh browser/device/AT, remote CI or release approval.',
 'specific':limits}})
fa=[docs+'final-acceptance/fa04-original-check.txt',docs+'final-acceptance/fa04-calendar-rerun.txt',docs+'final-acceptance/fa04-package.txt']
receipt=docs+'backlog-execution-2026-10-15.md'
add('A-M-35','complete','Typefaces is a foundation catalogue, not a missing runtime component. Its fifteen visual roles, independent native semantic tags, token font family and dark scope are preserved in both fixture hosts.',
 [base+'components/Typefaces/Typefaces.native-fixture.tsx',base+'experimental/Typography/Typography.tsx',base+'experimental/Typography/Typography.module.css','apps/docs/native-fixtures/scenarios/components/Typefaces/Typefaces.fixture.tsx'],
 [base+'components/Typefaces/Typefaces.next100-regression.test.tsx',base+'experimental/Typography/Typography.test.tsx','packages/ui/tests/browser/hardening-typography-table-presentation.spec.ts'],
 [docs+'react-aria-baseline-tasks.md (F-C35 group)',docs+'react-aria-regression-tasks.md (T-C35 group)',receipt+' HB-03–05 and HB-16 (V-C35)',*fa],
 ['F/T individual entries were removed after accepted completion; link the group receipts rather than inventing original child counts. HB-16 records fifteen roles, 360px, 150% text, light/dark, both densities, English/Arabic RTL and eight cases per engine.'],[],
 'HB-16 raw artifact directory is absent locally; accepted documentary receipt is retained, not independently replayed. Complete only for the catalogue migration row, not actual spoken AT.')
add('A-M-36','complete','All 95 original direct symbols are mapped; current public/experimental entries share owned vectors and activity helper. Current gallery has 96 wrappers; module-path counts include helpers and are not glyph counts.',
 [base+'components/icons/index.ts',base+'components/icons/activityTypeIcon.tsx',base+'experimental/icons/icon-map.json',base+'experimental/icons/activityTypeIcon.tsx'],
 [base+'components/icons/icons.test.tsx',base+'components/icons/icons.next100-regression.test.tsx',base+'experimental/icons/icons.test.tsx'],
 [docs+'final-acceptance/parallel-12/report.md (95/95 mapping, activity/default/override proofs)',docs+'react-aria-icons.md',docs+'react-aria-baseline-tasks.md (F-C36)',docs+'react-aria-regression-tasks.md (T-C36)',receipt+' HB-03–05 (V-C36)',*fa],
 ['Known unrelated A-I-08 successor: BrushIcon added beyond original 95 lacks metadata/documentation parity. A-I-04/05/08 remain separate; mapping/activity migration is not bundle-pruning or full optical/contrast acceptance.'],[],
 'Retain parallel-12 limits. Icon native gallery receipt is documentary and scoped; no fresh browser rendering.')
add('A-M-37','complete','Every historical primitive maps to an owned implementation/type or an explicit breaking removal. Autocomplete aliases ComboBox; progress adapters fix presentation; no independent alias state owner.',
 [base+'components/primitives/index.ts',base+'components/primitives/Progress.tsx',base+'primitives/index.ts',docs+'react-aria-primitives.md'],
 [base+'components/primitives/primitives.test.tsx',base+'components/primitives/Progress.test.tsx'],
 [docs+'final-acceptance/parallel-03/report.md (owned public declarations)',docs+'final-acceptance/parallel-06/report.md (removed MuiLink mapping)',docs+'react-aria-baseline-tasks.md (F-C37)',docs+'react-aria-regression-tasks.md (T-C37)',receipt+' Public primitives presentation reconciliation (V-C37); HB-03/04/07/11/13/14/16',*fa],
 ['FormControlLabel removed in favor of owned labels; MenuItem is a record; SelectChangeEvent removed; MuiLink maps Link. BUG-0009 TextArea is outside this primitive barrel and under concurrent coordinator repair; no closure of its behavior/API leaf.'],[],
 'Complete replacement/ownership row, not full semantics of every aliased control. Readonly Select focus exception remains under A-A-06.')
add('A-M-38','partial','Produced migration-index.json: all 37 original rows, F/T/V prefixes, current source/test paths, historical PR attribution and explicit open editor V leaves. Retired transitive implementation evidence is reused, not inferred from directory names.',
 [docs+'react-aria-scope-ledger.md',docs+'react-aria-migration-inventory-acceptance.md','docs/developer/final-acceptance/wave-02-04/migration-index.json','packages/ui/scripts/check-foundations.mjs'],
 [],[docs+'final-acceptance/fa02-foundations.txt',docs+'final-acceptance/parallel-02/report.md',receipt,docs+'react-aria-progress.md'],
 ['Historical draft PR #1 is an initial attribution, not proof of each row current PR review/merge. Old row acceptance table retains held criteria and obsolete paths (AppButton/Storybook); 20 editor V leaves remain open.'],
 [{'id':'W04-M38-TRACE','deliverable':'Coordinator annotate the 37-row index with actual reviewed PR/commit and exact row-specific validation receipts where missing; reconcile each held original criterion with later F/T/V reports, retaining all 20 editor V and broad G/E/device/AT holds. Link current Button/docs paths while preserving historical names.','prerequisites':'Maintainer/coordinator access to review/PR attribution and retained native artifacts; no new source scan required.'}],
 'No remote PR or CI query; tracking is concrete but not complete review provenance or universal migration acceptance.')
add('A-M-39','complete','Admin/instructor presets use owned immutable static statuses, translated factory labels, empty sort/filter defaults, first/action locks and fresh per-view arrays; compatibility names remain.',
 [base+'components/AdminDataGridOptions.ts',base+'components/InstructorDataGridOptions.ts',docs+'react-aria-grid-presets.md'],
 [base+'components/AdminDataGridOptions.test.tsx'],
 [docs+'final-acceptance/parallel-06/report.md',receipt+' HB-03–05 S10/S11 factory isolation/locks/reset',*fa],
 ['All is absence of a rule; admin-people status vocabulary stays host-owned. Presets configure toolbar options; host grid definitions must preserve matching locks.'],[])
add('A-M-40','complete','All nine cell types plus fallback route through owned renderers. Existing tests establish text/JSON escaping, native-link routing, clipboard result/failure, image fallback, original-row actions/custom values and truncation forwarding.',
 [base+'components/AppDataGrid/ownedGridCells.tsx',base+'components/AppDataGrid/components/table-cell/TextTableCell.tsx',docs+'react-aria-grid-cell-acceptance.md'],
 [base+'components/AppDataGrid/ownedGridCells.test.tsx',base+'components/AppDataGrid/AppDataGrid.cells.test.tsx',base+'components/AppDataGrid/components/table-cell/tableCellPrimitives.test.tsx',base+'components/AppDataGrid/components/table-cell/TableCellMenu.test.tsx'],
 [docs+'react-aria-grid-cell-acceptance.md M-40; historical 10 files/33 cases and desktop wrapping receipt',*fa],
 ['truncate=false gap was fixed and retained; raw accessor values still sort independently of display formatting.'],[],
 'Unit clipboard boundary is not OS permission proof. Historical measured wrapping receipt is one desktop browser, not full native grid/AT matrix.')
add('A-M-41','complete','Subheaders, loading/empty/refresh/error overlays, column/action/toolbar builders and header sorting are owned and exercised through named source helpers and supported public compositions.',
 [base+'components/AppDataGrid/ownedGridParts.tsx',base+'components/AppDataGrid/createDataGridColumns.tsx',base+'components/AppDataGrid/createActionMenuColumn.ts',base+'components/DataToolbar/buildColumnOptions.ts'],
 [base+'components/AppDataGrid/components/RowSubHeader.test.tsx',base+'components/AppDataGrid/ownedGridParts.test.tsx',base+'components/AppDataGrid/createDataGridColumns.test.tsx',base+'components/AppDataGrid/createActionMenuColumn.test.ts',base+'components/DataToolbar/buildColumnOptions.test.ts',base+'components/AppDataGrid/components/header/TableHeaderSortMenu.test.tsx'],
 [docs+'react-aria-grid-cell-acceptance.md M-41',*fa],
 ['Helpers have owned types; standalone private cell/header modules are not invented public package subpaths. Sorting/request/focus/disabled assertions remain active.'],[])
add('A-M-42','complete','Root/subpaths, model/helper/hook contracts are owned and package checked. LearnerClassesDataGridProps is public; pagination policy and persistence breaking defaults are documented and real-hook tested.',
 [base+'index.ts',base+'models.ts',base+'components/index.ts',base+'hooks/index.ts',docs+'react-aria-pagination-state.md'],
 [base+'hooks/usePersistentState.behavior.test.tsx',base+'hooks/usePersistentState.ssr.test.tsx',base+'hooks/usePersistentPaginationModel.test.ts',base+'hooks/usePersistentPaginationModel.ssr.test.tsx'],
 [docs+'final-acceptance/parallel-01/report.md (signature inventory limits)',docs+'final-acceptance/parallel-03/report.md (all emitted declarations and public closure)',docs+'react-aria-progress.md Public hook reconciliation',*fa],
 ['Memory-only by default; local/session/version/migration/validation explicitly host-owned. This reconciliation does not close A-B-05 default/historical signature normalization.'],[],
 'FA-04 built/package evidence applies to saved output. Concurrent four-control changes do not make their old declarations current; no new build claimed.')
add('A-M-43','complete','Retired third-party layout/story imports and retired-module mocks are removed. Current docs/native fixtures use owned public imports; meaningful behavior tests mount real controls, real hooks and real Lexical nodes/commands.',
 [docs+'docs-website.md',docs+'react-aria-progress.md',base+'components/LearnerClassesDataGrid/LearnerClassesDataGrid.test.tsx'],
 [base+'components/PageRichTextEditorSection/PageRichTextEditorSection.dialogs.test.tsx',base+'components/PageRichTextEditorSection/lexical/ImageNode.test.tsx',base+'components/LearnerClassesDataGrid/LearnerClassesDataGrid.test.tsx'],
 [docs+'final-acceptance/2026-10-16-source-inventory.json (retired candidates classified)',docs+'react-aria-progress.md Real owned behavior tests, grid cells and runtime CI',*fa],
 ['Some current tests retain pass-through real LexicalComposer wrappers, omit unrelated plugins/floating UI or mock test harness exports; this is not a claim of zero mocks. Original requirement is retired-module replacement and real behavior where practical.'],[],
 'No Storybook runtime reinstated; source-context fixture tests and docs-native hosts are distinct. Does not close all editor integration/AT leaves.')
add('A-M-44','complete','Created ux-parity-register.json separating required parity, intentional UX/API improvements, deferred scope and bug corrections. Each entry names retained fixtures/tests and release impact rather than calling all differences parity.',
 ['docs/developer/final-acceptance/wave-02-04/ux-parity-register.json',docs+'react-aria-grid-contracts.md',docs+'react-aria-calendar-contracts.md',docs+'react-aria-button.md',docs+'react-aria-pagination-state.md'],
 [base+'components/AppDataGrid/AppDataGrid.cells.test.tsx',base+'components/Button/Button.test.tsx',base+'experimental/DateRangeSelector/DateRangeSelector.test.tsx'],
 [docs+'react-aria-migration-inventory-acceptance.md',receipt,*fa],
 ['The register explicitly records remaining defects and deferred grid/business-calendar features; improvements are not silently claimed to preserve old APIs.'],[],
 'Documentation/register completion only. Release impact requires A-Z-13 and human release approval; no backend behavior or migration completion claimed.')
add('A-P-01','complete','Representative Button/TextField proof exists with owned narrow props, generated token styles, compiled component layer, public exports and real focus/action/label/form assertions.',
 [base+'components/Button/Button.tsx',base+'experimental/TextField/TextField.tsx',base+'components/Button/Button.module.css',base+'foundation/tokens.json'],
 [base+'components/Button/Button.test.tsx',base+'experimental/TextField/TextField.test.tsx'],
 [docs+'react-aria-progress.md First implementation milestone',receipt+' HB-04 control geometry',docs+'final-acceptance/fa02-foundations.txt',*fa],
 ['Proof implementation and targeted behavior are fulfilled; this is not complete form/device acceptance.'],[])
add('A-P-02','complete','The transferred NestedForm proof contains validation, Tabs, ComboBox and nested Popover. Retained real-control tests exercise focus/containment/restoration, nested Escape and dismissal; recorded native proof tests scrolling separately from jsdom.',
 ['apps/docs/native-fixtures/scenarios/experimental/Dialog/Dialog.fixture.tsx',base+'experimental/Dialog/Dialog.tsx',docs+'react-aria-proof-controls.md'],
 [base+'experimental/Dialog/Dialog.test.tsx',base+'experimental/Popover/Popover.test.tsx',base+'experimental/Tabs/Tabs.test.tsx',base+'experimental/ComboBox/ComboBox.test.tsx','packages/ui/tests/browser/batch01-dialogs.spec.ts','packages/ui/tests/browser/batch50-dialog-header-reflow.spec.ts'],
 [docs+'react-aria-progress.md Dialog and form proof continuation',docs+'parallel-batch-01/dialogs.md',receipt+' HB-14 actions/overlays; modal regression',*fa],
 ['Historical recorded 291px panel/880px content verifies scrolling; current fixtures retain the composed host.'],[],
 'Complete representative prototype obligation, not fresh current-head native full matrix, actual touch or AT. Old raw prototype artifacts were not independently recovered.')
add('A-P-03','complete','Host-supplied query/loading/results proof covers superseded abort/late success/failure rejection, empty/error/retry, selection outside current results, 200-row long lists, keyboard selection and focus restoration.',
 [base+'experimental/AsyncMultiSelect/AsyncMultiSelect.tsx','apps/docs/examples/AsyncSearchExample.tsx'],
 [base+'experimental/AsyncMultiSelect/AsyncMultiSelect.test.tsx','packages/ui/tests/browser/batch14-async-busy.spec.ts'],
 [docs+'react-aria-progress.md Async, calendar and grid proof continuation',receipt+' Website scenario DOCS-005-b02 and HB-13',*fa],
 ['Request cancellation lives in the host example/test adapter, not hidden fetching in the UI component.'],[])
add('A-P-04','complete','Advanced selector proof includes multi-month ranges, presets/unavailable dates, draft Apply/Cancel, host locales/directions and explicit-timezone conversion examples.',
 [base+'experimental/DateRangeSelector/DateRangeSelector.tsx','apps/docs/examples/LocalizedRangeExample.tsx','apps/docs/examples/FormIntegrationExamples.tsx',docs+'react-aria-calendar-contracts.md'],
 [base+'experimental/DateRangeSelector/DateRangeSelector.test.tsx',base+'experimental/DateField/DateField.test.tsx',base+'experimental/DateRangeSelector/DateContracts.next100-regression.test.tsx','packages/ui/tests/browser/calendar-native-locales.spec.ts'],
 [receipt+' DOCS-005-b03/b04 and HB-15',docs+'react-aria-progress.md Async, calendar and grid proof continuation',*fa],
 ['Date-only stays civil; local datetime requires host timeZone and explicit DST disambiguation. Concurrent BUG-0008 affects three later compositions, not this representative selector leaf.'],[],
 'Full calendar acceptance remains A-K leaves; host-specific fiscal/booking rules are not implemented by timezone examples.')
add('A-P-05','complete','Version-specific requirement review proves standard installed Calendar multiple selection rather than assuming it needs custom state. Segmented field state/custom range gestures are lower-level owned compositions where needed; fiscal/business calendars remain host presets.',
 [base+'experimental/Calendar/Calendar.tsx',base+'experimental/DateField/DateField.tsx',base+'experimental/DateRangeSelector/RangeGestures.tsx',docs+'react-aria-calendar-contracts.md'],
 [base+'experimental/Calendar/Calendar.test.tsx',base+'experimental/DateRangeSelector/RangeGestures.test.tsx',base+'experimental/DateRangeSelector/DateContracts.next100-regression.test.tsx'],
 [docs+'react-aria-calendar-contracts.md Selection and drafts; fiscal policy; expansion',docs+'final-acceptance/parallel-03/report.md (registered lower-level hook boundary)',*fa],
 ['Calendar.test.tsx explicitly selects/removes noncontiguous dates with installed 1.21.1. No unsupported fiscal algorithm is claimed. The lower-level composition clause is conditional on an actual unmet requirement, not a requirement to duplicate supported selection.'],[])
add('A-P-06','complete','Concrete candidate checklist compares React Aria alone, TanStack alone and combined proof for all named selection/server/multi-sort/filter/visibility/resize/actions/reorder concerns.',
 [docs+'react-aria-grid-decision.md',base+'experimental/DataGrid/DataGrid.tsx',base+'experimental/DataGrid/row-processing.ts'],
 [base+'experimental/DataGrid/DataGrid.test.tsx',base+'experimental/DataGrid/DataGrid.next100-regression.test.tsx'],
 [docs+'react-aria-progress.md Async, calendar and grid proof continuation',docs+'react-aria-grid-contracts.md',*fa],
 ['Proof tests assert ordered multi-sort, multiple filters, server passthrough/unknown totals, cross-page IDs, locks, numeric resize, non-drag reorder and keyboard cancel. No universal engine ranking or full pointer/touch grid parity inferred.'],[])
add('A-P-07','partial','Created prototype-findings.json with explicit available/missing evidence for keyboard, screen reader, zoom, touch, dark, reduced motion, SSR/hydration and production assets.',
 [docs+'react-aria-proof-controls.md',docs+'react-aria-performance.md','docs/developer/final-acceptance/wave-02-04/prototype-findings.json'],
 [],[receipt,docs+'react-aria-browser-acceptance.md',docs+'react-aria-server-components.md',docs+'final-acceptance/parallel-10/report.md',docs+'final-acceptance/fa04-package.txt'],
 ['Accepted engine/text-enlargement/touch-emulation and historical packed results exist. No named current prototype spoken-AT or physical-device operator receipt was found. SSR and built hydration entry are not the same as executed browser hydration.'],
 [{'id':'W04-P07-MATRIX','deliverable':'Attach source/host-hashed prototype findings for each missing matrix cell, naming engine/OS/device/browser/AT/version, focus/announcements/scroll result and actual warnings; reuse existing equivalent engine results. Record actual zoom separately from CSS text enlargement and physical touch separately from Playwright context.','prerequisites':'Operator with required device/AT and coordinator-controlled immutable fresh fixture/consumer window for changed sources. Human interaction/evidence collection required; no source-only substitute.'}],
 'Report creation advances findings, but cannot manufacture missing checks. Desktop screenshots/DOM roles do not certify AT or device behavior.')
add('A-P-08','partial','Reconciled local Apple M4/Node26 reference workloads, warmups/samples, median/maximum and transfer budgets into prototype findings. Established exact replay constraints and representative hardware gaps without running stale assets.',
 [docs+'react-aria-performance.md',docs+'migration-baseline/proof-measurements.json','packages/ui/scripts/measure-migration-proofs.mjs'],
 [],[docs+'migration-baseline/proof-measurements.json (2026-10-06 reference)',docs+'react-aria-performance.md'],
 ['Recorded local investigation budgets are 8/6/18/34/10ms and 215KiB JS/8KiB CSS gzip, not universal gates. Record lacks source/asset hashes and slower representative consumer hardware; modern workload/defaults differ. Script uses workspace dist imports but relative docs output paths; invocation cwd must be explicit.'],
 [{'id':'W04-P08-REPRO','deliverable':'Record exact commit/dirty input hashes, built asset hashes, invocation cwd, runtime/React/dependencies, warmups/repetitions and workload definition with reference. Make output destination explicit before using --record; do not overwrite historical reference.','prerequisites':'Coordinator-built immutable fresh outputs after concurrent fixes; authorized performance window.'},
 {'id':'W04-P08-HARDWARE','deliverable':'Choose representative supported slower consumer hardware/OS/browser with maintainer; measure production initial/update latency, memory and transfer alongside local SSR; document noise and investigation thresholds per workload, then define enforceable CI policy.','prerequisites':'Maintainer hardware/workload selection and device/operator access; no universal rankings or automatic budget inflation.'}],
 'Not blocked: useful reference reconciliation completed. No benchmark, device performance, current bundle or pass/fail budget claim made.')
add('A-P-09','complete','The engine/state ownership decision explicitly assigns TanStack row processing, React Aria focus/collection/resize/drag, SGUI public state/rendering/widths, host server data and reorder persistence; virtualization disabled until workload evidence.',
 [docs+'react-aria-grid-decision.md',docs+'react-aria-grid-contracts.md',base+'experimental/DataGrid/DataGrid.tsx',base+'components/AppDataGrid/ownedGridModel.ts'],
 [base+'experimental/DataGrid/DataGrid.test.tsx',base+'components/AppDataGrid/ownedGridProcessing.test.tsx'],
 [docs+'react-aria-grid-decision.md Authoritative ownership',docs+'final-acceptance/parallel-03/report.md',*fa],
 ['No TanStack selection state competes with SGUI/React Aria. This closes the decision, not virtualization implementation or broad G acceptance.'],[])
add('A-P-10','complete','Architecture and guarded implementation retain React Aria as the one general interaction foundation. TanStack, Lexical and Lucide are scoped specialist dependencies, not speculative alternative primitive systems.',
 [docs+'react-aria-architecture.md','packages/ui/package.json','packages/ui/scripts/check-foundations.mjs'],
 ['packages/ui/scripts/react-stately-boundaries.test.mjs'],
 [docs+'final-acceptance/2026-10-16-source-inventory.json',docs+'final-acceptance/parallel-03/report.md',docs+'final-acceptance/fa02-foundations.txt',*fa],
 ['No demonstrated blocker or second general primitive exception found. Retain recorded lower-level state hooks inside registered controls.'],[])
add('A-P-11','partial','Produced prototype-findings.json separating each implemented proof, API deltas, outstanding accessibility/device/performance evidence and release limits; identified precise contradictory older guidance requiring correction.',
 [docs+'react-aria-progress.md',docs+'react-aria-proof-controls.md',docs+'react-aria-calendar-contracts.md','docs/developer/final-acceptance/wave-02-04/prototype-findings.json'],
 [],[docs+'react-aria-calendar-contracts.md:134-138 versus expansion at 575 onward',docs+'final-acceptance/parallel-04/report.md (stale Button/editor callback paragraph)',docs+'final-acceptance/parallel-reconciliation-2026-10-16.json'],
 ['Older calendar paragraph says comparison periods/month-year selectors are unshipped/deferred; later shipped DateRangeComparisonPicker/PeriodPicker and month-year navigation contradict it. Historical headings also retain Storybook paths; preserve dated evidence but update current guidance.'],
 [{'id':'W04-P11-DOCS','deliverable':'Update current calendar limits paragraph to distinguish implemented Gregorian period/comparison/month-year navigation from still host-owned fiscal/business/recurrence policy; replace current stale Button ContentEditorChrome MouseEvent mapping (parallel-04 P04-S4). Link prototype-findings and retain historical host/head receipts as history.','prerequisites':'Coordinator edit authority outside this report-only directory; verify public declarations rebuilt after concurrent fixes before publishing API claims.'}],
 'Report is delivered now; leaf remains partial while consumer guidance contradicts implemented outcomes. No legal signoff, release, production completion or waiver of 20 V leaves.')
for leaf in leaves:
 if leaf['id']=='A-M-42':
  leaf['sourceReferences'] += [base+'utils/formatDueDateLabel.ts',base+'utils/relative-dates.ts','packages/ui/tests/fixtures/types.ts',base+'components/PageRichTextEditorSection/PageRichTextEditorSection.native-fixtures.ts']
  leaf['testReferences'] += [base+'utils/formatDueDateLabel.test.ts',base+'utils/relative-dates.test.ts']
  leaf['findings'].append('Old src/fixtures is absent after host migration; scenarios live in docs-owned/native source-context fixtures and tests/fixtures types. formatDueDateLabel owns serializable due presentation without application contracts.')
assert len(leaves)==21
# Fail on invented source/test paths; own deliverables are written by the next stage.
missing=[]
for l in leaves:
 for p in l['sourceReferences']+l['testReferences']:
  if 'wave-02-04/' not in p and not Path(p).exists():missing.append(p)
out={'schemaVersion':1,'wave':'02','owner':'wave-02-04','capturedAt':datetime.datetime.now(datetime.timezone.utc).isoformat(),
 'leaves':leaves,'summary':{s:sum(l['status']==s for l in leaves) for s in ['complete','partial','blocked']},
 'missingReferencesToResolve':sorted(set(missing)),
 'scope':'Report recommendations only; no source/shared-ledger/Git/release/server/build/install/browser/test mutations.',
 'commonEvidenceLimits':'FA-04 original command failed nine calendar cases; corrected affected rerun reconciles saved 1738-case/279-suite unit evidence. No passed suite rerun. 290 selected hashes unchanged. Four coordinator-mutated controls excluded; stale outputs not claimed current. Historical native documentary receipts are not fresh/raw-artifact review.'}
(own/'results.json').write_text(json.dumps(out,indent=2)+'\n')
print(json.dumps({'summary':out['summary'],'missingReferences':out['missingReferencesToResolve']},indent=2))
