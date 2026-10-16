"""Read-only reconciliation using FA-02's saved import graph, no builds/tests."""
import hashlib
import json
import re
import subprocess
from collections import Counter, defaultdict
from datetime import datetime, timezone
from pathlib import Path

OUT = Path(__file__).resolve().parent
ROOT = OUT.parents[3]
PREFIX = 'docs/developer/final-acceptance/'
def read(p): return (ROOT / p).read_text()
def sha(p): return hashlib.sha256((ROOT / p).read_bytes()).hexdigest()
def load(p): return json.loads(read(p))
def write(name, value): (OUT / name).write_text(json.dumps(value, indent=2) + '\n')
fa01 = load(PREFIX + '2026-10-16-inventory.json')
fa02 = load(PREFIX + '2026-10-16-source-inventory.json')
graph = defaultdict(list)
for edge in fa02['imports']:
    if edge['specifier'].startswith('.') and not edge.get('typeOnly'):
        graph[edge['file']].append(edge)
known = set(fa02['inputHashes'])
def resolve_edge(edge):
    base = (ROOT / edge['file']).parent / edge['specifier']
    for p in [base, Path(str(base)+'.ts'), Path(str(base)+'.tsx'), base/'index.ts', base/'index.tsx']:
        key = str(p.resolve().relative_to(ROOT))
        if key in known: return key
    return None
def closure(seeds):
    visited, stack, unresolved = set(), list(seeds), []
    while stack:
        p = stack.pop()
        if p in visited: continue
        visited.add(p)
        for edge in graph.get(p, []):
            target = resolve_edge(edge)
            if target: stack.append(target)
            else: unresolved.append(edge)
    return sorted(visited), unresolved
def receipt(p):
    if not (ROOT / p).is_file(): return {'exists': False}
    h = sha(p)
    return {'exists': True, 'sha256': h, 'fa02Sha256': fa02['inputHashes'].get(p),
            'matchesFA02': h == fa02['inputHashes'].get(p),
            'lines': len(read(p).splitlines()) if not p.endswith(('.png','.zip')) else None}

# Clause-level conclusions, written after inspecting the source, tests and saved receipts.
ROWS = [
('01','Button','complete',
 ['Owned ButtonProps selects native button/ARIA attributes and exposes onPress() without upstream events; native button ref, filled/outlined/text, primary/neutral and density remain.',
  'type defaults to button; submit/reset deliver one callback in capture before the native action. Pending reset becomes type=button, blocks reset, retains focus, and resumes with the latest callback. Disabled/pending paths and native form behavior have retained unit/native evidence.'],
 ['batch13-control-button','hardening-control-geometry'],
 ['parallel-batch-13/control-button.md','react-aria-button.md'],
 'Second control batch and HB-04: three desktop engines; explicit pointer/touch presentation, theme/density geometry and native pointer/Enter/Space form transactions. AppButton historical name maps to current Button; FA-01/parallel-01 already resolve that alias removal.', [], []),
('02','AppInlineProgress','complete',
 ['Finite rounding/clamping yields 0–100 and nonfinite→0; visible percentage agrees with the named public Progress. Bar width is native numeric/CSS input.',
  'Owned percentage typography/gap/width tokens are covered by unit tests and native computed-style assertions. Determinate progress is animation-free for both reduced-motion preferences; no unsupported indeterminate variant is implied.'],
 ['batch07-progress-status','hardening-progress-presentation'],
 ['parallel-batch-07/progress-status.md','react-aria-progress-avatar.md'],
 'Saved three-engine control suite includes the five progress/status cases; HB-07 adds eight Chromium light/dark × density × English/Arabic presentation cases at 360px and 150% text. Earlier 320px/200% token/motion proof is retained.', [], []),
('03','AppOperationSteps','partial',
 ['All pending/in_progress/completed/error states have explicit accessible status text; decorative icons and owned tone aliases distinguish states. Active Progress respects reduced motion. Ordered list has no numeric markers or single-step count.',
  'The implementation deliberately owns no live region. Mounted host Status announces milestones independently of quiet percentage updates; unit/native tests demonstrate region persistence and DOM text changes, not actual speech.'],
 ['batch07-progress-status','hardening-progress-presentation','batch67-progress-steps-native-state'],
 ['parallel-batch-07/progress-status.md','parallel-batch-29/inventory-acceptance-02-12.md','react-aria-progress-avatar.md'],
 'Three-engine control/native-state receipts and HB-07 presentation supersede the old missing Firefox/presentation portion. The earlier explicit spoken-announcement hold has no operator receipt in the reviewed evidence.',
 ['The state-announcement clause still lacks a real screen-reader milestone result for the host-owned Status composition.'],
 [{'id':'W02-01-C03-AT','deliverable':'Operator receipt naming OS/browser/AT versions, source/fixture hashes and observed pending→active→completed/error→retry speech. Confirm milestone once, quiet percentage ticks and retained keyboard focus. Reuse existing Transitions fixture; do not add an unsolicited component live region.','prerequisite':'Human/operator session with actual supported screen reader; DOM assertions cannot substitute.'}]),
('04','AppPageHeader','complete',
 ['Breadcrumbs render semantic navigation/current page; deep paths collapse into a named keyboard Menu with host routing. Metadata IDs/icons, supplied actions versus menu precedence and disabled commands are covered.',
  'hierarchy defaults to subpage and supports primary via owned surface tokens; headingLevel is independent of visual typography. Wrapping, focus return, translated long names and narrow/enlarged content have accepted native/presentation evidence.'],
 ['batch10-page-header-reflow','hardening-header-tabs-presentation'],
 ['parallel-batch-60/page-navigation-evidence.md','react-aria-page-layout.md','react-aria-migration-inventory-acceptance.md'],
 'Accepted M-04 row plus retained original C/W and focused Firefox proof; full checkpoint covers primary native scopes. HB-08 adds eight cases per engine at 360px/150% text, English/Arabic and both densities; Chromium/Firefox screenshots reviewed.', [], []),
('05','AppPageTabs','complete',
 ['With onChange, public Tabs owns reciprocal tab/panel IDs, controlled selection, disabled skipping and automatic/manual activation. Without onChange, the wrapper renders native route links/current-page semantics; it does not disguise route navigation as tab panels.',
  'default density inherits the scope; explicit compact/comfortable map locally. Focused route links scroll into view. Retained catalog/overflow tests cover keyboard wrapping, selected visibility, panel linkage and long RTL names.'],
 ['batch07-catalog-tabs','batch05-tabs-overflow','hardening-header-tabs-presentation'],
 ['parallel-batch-07/catalog-tabs.md','parallel-batch-60/page-navigation-evidence.md','react-aria-page-layout.md'],
 'Accepted M-05 row retains C/W and focused Firefox proof. Three-engine overflow checkpoint plus HB-08 supplies native keyboard/disabled/panel/density/long-name geometry; no new orientation prop is inferred for this wrapper.', [], []),
('06','AppShell','complete',
 ['Native outer ref/main landmark and host-supplied navigation/content remain. Independent overflow panes and container-query stacking preserve main node/drafts through collapse and resize; AppShellMain reveals focused owned controls without changing focus.',
  'rightNavigation is an optional trailing independently scrolling column; unit tests assert insertion preserves main/left nodes. Hosts provide width/names. This addition is not used to claim an unperformed three-column native matrix.'],
 ['inventory-shell-responsive','navigation-shell-container-boundary','hardening-shell-presentation'],
 ['parallel-batch-35/shell-responsive-native.md','react-aria-modal-shells.md','react-aria-migration-inventory-acceptance.md'],
 'Previously accepted M-06 row plus three-engine responsive shell checkpoint and HB-09: sixteen composed shell/auth cases per engine, desktop 1100px→360px at 150% text, RTL/LTR and independent pane geometry. HB-09 screenshots reviewed in each engine.', [], []),
('07','AuthShell','complete',
 ['Presentation-only title/subtitle/content/footer and native ref/styles; no account/session or login implementation. Host owns forms, validation, submission and links.',
  'Owned panel/gutter/content overflow and focus-reveal helper preserve entered fields as optional sections change. Unit tests include constrained/embedded host replacement; accepted native reflow covers narrow/enlarged content, footer access, submit once and stable focus.'],
 ['batch10-auth-shell-reflow','hardening-shell-presentation'],
 ['parallel-batch-10/auth-shell-reflow.md','react-aria-modal-shells.md'],
 'Three-engine primary checkpoint resolves earlier Firefox hold; HB-09 adds translated desktop/narrow forms and reviewed screenshots across all engines. Source-only absence of session code is distinguished from actual native layout assertions.', [], []),
('08','AppModal','partial',
 ['Owned onClose(reason), native style/parts, controlled open, independent dismissal locks, form-safe pending actions and >=2-step labels are explicit. Dialog owns trap/return focus and nested overlay dismissal.',
  'Retained removed-opener repair and later unit tests cover parent destination recovery without stealing accepted host focus. Sticky tabs/whole-dialog fallback and narrow local surface tests exist. HB-10 adds translated initial focus, bounded chrome/footer, Escape and return-focus checks.'],
 ['batch01-dialogs','batch52-dialog-removed-opener','modal-container-boundary','hardening-modal-presentation','display-preferences'],
 ['parallel-batch-01/dialogs.md','parallel-batch-52/dialog-removed-opener.md','react-aria-modal-shells.md'],
 'HB-10 preserves each original English pass plus seven corrected Arabic/unrun cases per engine against the same host. Removed-opener report has nine Chromium cases on candidate 4987a1fe046c37f2e612d6de159aa09e1e840043; later full-checkpoint summaries are retained only for their enumerated scopes, not upgraded to an unlisted all-size/modal AT result.',
 ['Earlier explicit native size/height/custom-chrome scrolling matrix and spoken nested-dialog acceptance are not fully discharged by the reviewed receipts.'],
 [{'id':'W02-01-C08-sizes','deliverable':'Clause matrix for xs/sm/md/lg/xl/full, heightMode and native overrides/custom chrome, linking retained tests first. Recover durable immutable-host receipts for already-passing cases; execute only missing focus/viewport/sticky-tab/whole-dialog combinations under coordinator browser admission.','prerequisite':'Coordinator-approved immutable native host and missing-case execution, or recovery of exact existing reports.'},
  {'id':'W02-01-C08-AT','deliverable':'Operator result for nested modal/menu/popover announcements, top dismissal and return focus including removed opener; record platform/AT and fixture hashes.','prerequisite':'Real AT operator; unit/native focus checks do not establish speech.'}]),
('09','SideNavigation','complete',
 ['Host model, route/current-page selection, explicit ancestor collapse, expand/drilldown/Back focus and separate selection/action semantics remain owned. Collapsed state is local; ref/label/styles are native.',
  'Organization/account operations use host adapters, qualified choices, pending suppression and retryable errors. Tests cover stale completion/provider replacement/unmount; navigation never owns login/session services. Retained native flow and shell geometry cover real keyboard and responsive collapse.'],
 ['batch65-side-navigation-native-flow','navigation-shell-container-boundary','hardening-shell-presentation','batch13-logout-lifetime','batch70-organization-switch-lifetime'],
 ['parallel-batch-65/side-navigation-native-flow.md','parallel-batch-13/logout-lifetime.md','parallel-batch-70/organization-switch-lifetime.md','react-aria-modal-shells.md'],
 'Three-engine full checkpoint explicitly maps C09 hierarchy/route/action/collapse suites; HB-09 actual SideNavigation composed long localized rows supports C09-04/05 under HB-10 reconciliation. Operation-specific retained reports supply four corrected Chromium logout cases and six Chromium organization-switch lifetime cases at candidate 1976be5e3776fe5e44065b02f359a17751ef7284; they are not independently relabeled Firefox/WebKit operation runs. This advances older active-owner/native holds using later accepted receipts.', [], []),
('10','ExperiencePageNavigator','partial',
 ['Actual API is an authoring-page list with selected page, add/rename/remove/reorder callbacks; readOnly blocks mutation while selection stays available. Rename trims, rejects blank/stale host rows, and removal focuses adjacent surviving selection.',
  'Move up/down boundary guards and keyboard menus are native-tested, including accepted/rejected host changes. They are reorder actions, not previous/next navigation. There are no route/href/previous/next props.'],
 ['page-navigator-native-transactions','hardening-actions-presentation'],
 ['react-aria-inventory-contract-reconciliation.md','parallel-batch-13/page-navigator.md','react-aria-page-navigation.md'],
 'Three-engine checkpoint plus HB-14 resolves historical authoring-list native/presentation gaps: sixteen cases per engine, long localized page names, rename/focus and menu/action scenes. None supplies absent previous/next route semantics.',
 ['Original previous/next boundaries and link semantics still differ from the shipped and extracted contract; no recorded owner disposition found in reviewed evidence.'],
 [{'id':'W02-01-C10-intent','deliverable':'Product/API owner must record either authoring-list scope with explicit disposition of previous/next and link clauses, or a separate host-controlled adjacent/route navigation contract. Then reconcile that approved criterion; if behavior is added, provide corresponding API/example/native boundary evidence.','prerequisite':'Specific owner requirement decision, not permission to perform read-only acceptance.'}]),
('11','CardCollectionWithFooter','complete',
 ['One normalized page slices the complete host dataset and drives AppPaginationFooter. Stable row keys retain card state; loading/empty Status content and disabled footer are explicit. Host owns rows/rendering/persistence.',
  'Native collection tests cover responsive/container thresholds, keyed draft/focus preservation, constrained scroll/footer, loading/empty replacement, controlled rejection/acceptance and page-zero-before-size. Existing corrected flow is retained instead of repeated.'],
 ['inventory-card-collection','hardening-card-presentation'],
 ['parallel-batch-36/card-collection-native.md','react-aria-card-pagination.md'],
 'Original bounded Chromium proof subsequently gains all-engine primary checkpoint. HB-12 gives sixteen cases per engine for real instructor/learner collections, footer/reset/counts, narrow long text and reviewed screenshots; no independent server data-fetching behavior is inferred.', [], []),
('12','CardPaginationFooter','complete',
 ['Public name is AppPaginationFooter from the preserved CardPaginationFooter directory. Zero-based page/size, count normalization, known/unknown/zero totals, translated ranges and disabled boundaries use owned Pagination.',
  'Separate size callback requests page zero before size; optional atomic onPaginationModelChange supersedes both callbacks. Unknown count uses host hasNextPage and omits Last. No normalization callback fires during render; nested form actions remain safe.'],
 ['inventory-grid-shell-responsive','inventory-card-collection','hardening-card-presentation'],
 ['react-aria-card-pagination.md','react-aria-migration-inventory-acceptance.md'],
 'Preserved accepted M-12 row, FA-04 unit baseline, three-engine primary checkpoint, HB-12 actual footer/Pagination controls and viewport/translation screenshots. Do not import unrelated physical-device/AT gates into this already-evidenced row.', [], []),
('13','ClassCardFrame','complete',
 ['Owned Card surface with header/body/optional footer slots, native root/slot styles and part hooks. Constants remain width=420 and min=360; 360 is exported host guidance, not an imposed minimum on narrow containers.',
  'Default maximum width shrinks with its parent; native style can override width. Existing tests retain arbitrary image/content attributes and falsy-footer behavior. Accepted frame width/parent/slot proof covers image ratio, resizing and surviving action focus.'],
 ['batch10-card-frame-reflow','inventory-card-frame-resize','hardening-card-presentation'],
 ['parallel-batch-39/frame-resize-native.md','react-aria-card-frames.md','react-aria-migration-inventory-acceptance.md'],
 'Preserved accepted M-13 row with original/focused Firefox and full-engine parent/slot native attribution; HB-12 supplies real card composition and all-engine screenshots. Generic slot support does not imply an image-fetching API.', [], []),
('14','InstructorClassCard','partial',
 ['Four statuses, archived metadata omission, translated known/custom labels and one host-routed action Link are preserved. Fixed decorative icons and HE avatar are presentation; className is course text, not styling.',
  'Batch66 and all-engine checkpoint add actual native focus, one route per Enter, stable link under status/model changes, long text, native host-formatted de-DE dates and host missing/invalid labels. HB-12 supplies later all-engine localized geometry/screenshots.'],
 ['batch66-instructor-card-native-presentation','hardening-card-presentation'],
 ['parallel-batch-66/instructor-card-native-presentation.md','react-aria-inventory-contract-reconciliation.md','react-aria-card-frames.md'],
 'Later native tests resolve the old unexecuted presentation/fallback-host evidence. They deliberately expose no library menu, persistence callback, date parser or configurable icon/image API and cannot resolve the original feature-attribution dispute.',
 ['The menu/callback/date/icon clauses require explicit owner attribution or approved additional behavior. Fixed decorative assets and literal required strings are not substitutes for undeclared APIs.'],
 [{'id':'W02-01-C14-intent','deliverable':'Owner disposition table for menu, callbacks, date fallback and icon fallback: identify the existing actionHref/router and host-formatted/fallback text/fixed assets, or specify a separately approved extension. Link later batch66/HB-12 results to supported presentation clauses; implement/test only approved additions.','prerequisite':'Specific product/API scope decision. No source change authorized by a checklist wording mismatch alone.'}]),
('15','LearnerClassCard','partial',
 ['Named clamped progress and due formatter, host locale/clock, translated metadata and isolated Details/Continue regions are preserved. Destinations retain native links/new-tab rel; no destination uses Button/onPress. Details falls back to continueHref.',
  'Unit due composition covers live locale/translator and invalid fallback with coordinated SSR clock/timezone. Later all-engine checkpoint and the corrected 12-case parity shard resolve German browser ICU and native destination/activation mismatches; HB-12 adds localized narrow geometry/screenshots.'],
 ['inventory-learner-card','hardening-card-presentation'],
 ['parallel-batch-41/learner-card-native.md','parallel-batch-54/learner-card-engine-parity.md','parallel-batch-30/inventory-acceptance-13-24.md','react-aria-card-frames.md'],
 'Wave28 shard on candidate 24f9b4a has four corrected titles × three engines, 12 passed without retries; it does not relabel earlier red or unselected cases. Later checkpoint maps full inventory-learner-card primary engines. No separate status prop exists.',
 ['The historical explicit status-clause attribution is still awaiting coordinator/owner disposition; progress/due text cannot silently be declared a separate lifecycle status feature.'],
 [{'id':'W02-01-C15-status','deliverable':'Record whether status means the existing progress/due presentation, with exact semantic/due/action test references, or an additional lifecycle status contract. If the latter, specify host-owned status API and acceptance criteria before implementation; retain the completed native ICU/destination proof.','prerequisite':'Coordinator/product scope attribution, not another unit/browser rerun of already-passing native flows.'}]),
]

hardening = read('docs/developer/react-aria-hardening-tasks.md')
requirements = {m.group(1):m.group(2) for m in re.finditer(r'^- \[ \] (A-(?:M-\d+|B-07)) (.+)$', hardening, re.M)}
evidence = {'capturedAt': datetime.now(timezone.utc).isoformat(),
 'head': subprocess.check_output(['git','rev-parse','HEAD'],cwd=ROOT,text=True).strip(),
 'branch': subprocess.check_output(['git','branch','--show-current'],cwd=ROOT,text=True).strip(),
 'basis': {p:receipt(p) for p in [PREFIX+'2026-10-16-inventory.json', PREFIX+'2026-10-16-source-inventory.json',
 PREFIX+'parallel-reconciliation-2026-10-16.json', PREFIX+'parallel-01/results.json',
 PREFIX+'fa04-original-check.txt', PREFIX+'fa04-calendar-rerun.txt', PREFIX+'fa04-library-input-delta.json', PREFIX+'fa04-package.txt',
 'docs/developer/react-aria-baseline-tasks.md','docs/developer/react-aria-regression-tasks.md','docs/developer/react-aria-hardening-tasks.md',
 'docs/developer/backlog-execution-2026-10-15.md','docs/developer/react-aria-hardening-execution.md']},
 'files':{}, 'components':{}, 'artifactAvailability':{}}
results=[]
baseline_names=set(fa02['inputHashes'])
for number,name,status,findings,specs,docs,history,gaps,successors in ROWS:
    id='A-M-'+number
    directory='packages/ui/src/components/'+name+'/'
    component_files=sorted(p for p in baseline_names if p.startswith(directory))
    seeds=[p for p in component_files if not re.search(r'\.test\.|\.native-fixture|\.ssr\.',p)]
    production,unresolved=closure(seeds)
    assert not any('/'+component+'/' in p for p in production for component in ['PeriodPicker','DateTimeRangePicker','DateRangeComparisonPicker','TextArea'])
    tests=[p for p in component_files if '.test.' in p]
    native_specs=['packages/ui/tests/browser/'+s+'.spec.ts' for s in specs]
    fixture_dir='apps/docs/native-fixtures/scenarios/'+('experimental/Button/' if name=='Button' else 'components/'+name+'/')
    fixtures=sorted(p for p in baseline_names if p.startswith(fixture_dir))
    guides=['docs/developer/'+p for p in docs]
    tracked=sorted(set(production+tests+native_specs+fixtures+guides))
    for p in tracked: evidence['files'][p]=receipt(p)
    input_changed=[p for p in production+tests+native_specs+fixtures if not evidence['files'][p].get('matchesFA02')]
    # Compare only outputs associated with this component runtime closure, never recertify all dist.
    output_matches={}
    for p in production:
        q=p.removeprefix('packages/ui/src/')
        names=['dist/'+re.sub(r'\.tsx?$','.js',q),'dist/'+re.sub(r'\.tsx?$','.d.ts',q)] if re.search(r'\.tsx?$',q) else ['dist/'+q]
        for output in names:
            if output in fa01['builtHashes']:
                path='packages/ui/'+output
                actual=sha(path) if (ROOT/path).is_file() else None
                output_matches[path]={'sha256':actual,'fa01Sha256':fa01['builtHashes'][output],'matchesFA01':actual==fa01['builtHashes'][output]}
    titles={p:[{'line':i+1,'text':s.strip()} for i,s in enumerate(read(p).splitlines()) if re.search(r'\b(?:test|it)\s*\(',s)] for p in tests+native_specs if (ROOT/p).is_file()}
    evidence['components'][name]={'sourceSeeds':seeds,'runtimeClosure':production,'unresolvedRelativeEdges':unresolved,
     'unitTests':tests,'nativeSpecs':native_specs,'fixtures':fixtures,'changedRelevantInputsSinceFA02':input_changed,
     'targetedBuiltOutputs':output_matches,'testTitleReferences':titles}
    if input_changed: raise RuntimeError(f'Relevant inputs changed; reassess {id}: {input_changed}')
    if unresolved: raise RuntimeError(f'Incomplete import closure {id}: {unresolved}')
    if any(not x['matchesFA01'] for x in output_matches.values()): raise RuntimeError(f'Changed relevant outputs {id}')
    results.append({'id':id,'status':status,'originalRequirement':requirements[id],
      'phaseEvidence':{'F':{'prefix':'F-C'+number,'basis':'All 570 F complete in baseline checklist and execution receipt; current implementation clauses inspected.'},
                       'T':{'prefix':'T-C'+number,'basis':'All 570 T complete in regression checklist; unchanged relevant unit inputs retain FA-04 passing reconciliation.'},
                       'V':{'prefix':'V-C'+number,'basis':history,'nativeSpecs':native_specs,'host':'Docs-owned /fixtures replacement host in 2026-10-15/16 checkpoint/HB receipts; earlier reports retain historical Storybook hosts.'}},
      'sourceReferences':seeds,'testReferences':tests,'evidenceReferences':guides+['docs/developer/backlog-execution-2026-10-15.md','docs/developer/react-aria-hardening-execution.md'],
      'fixtureReferences':fixtures,'findings':findings,'remainingObligations':gaps,'successors':successors,
      'unresolvedDefects':'No new scoped runtime defect demonstrated; partial outcomes describe unmet evidence or scope attribution. Concurrent BUG-0008/BUG-0009 fixes are outside the verified runtime closure.',
      'checksActuallyPerformed':['Read full original A leaf and linked historical holds/later receipts.','Inspect implementation clauses and unit/native assertions.','Compare named runtime transitive closure, tests/specs/fixtures with saved FA-02 input hashes.','Compare associated existing output hashes with FA-01; no build or runtime suite run.'],
      'inputHeadHostLimits':{'head':evidence['head'],'branch':evidence['branch'],'workingTree':True,'inputHashes':'evidence.json#/files',
        'runtimeClosure':'evidence.json#/components/'+name,
        'historicalResults':'Retained dated receipts only; old raw browser artifact presence recorded separately. No fresh native/AT or remote CI execution.',
        'concurrentBugs':'PeriodPicker/DateTimeRangePicker/DateRangeComparisonPicker/TextArea coordinator edits are not assumed to match dist; verified relevant closures exclude those four modules.'}})

engines=['chromium','firefox','webkit']
artifact_roots=[f'packages/ui/artifacts/hb{n:02}-2026-10-16/{engine}' for n in [8,9,10,12,14] for engine in engines]
artifact_roots += [f'packages/ui/artifacts/backlog-2026-10-15-{e}-{scope}' for e in engines for scope in ['controls','foundation','hardening','control-bounds']]
artifact_roots += ['packages/ui/artifacts/backlog-2026-10-15-chromium-progress-presentation']
for p in artifact_roots:
    path=ROOT/p
    evidence['artifactAvailability'][p]={'exists':path.exists(),'resultsExists':(path/'results.json').is_file(),
       'pngCount':sum(1 for _ in path.rglob('*.png')) if path.is_dir() else 0}

# B-07 is a representative capture obligation, not all-component conformance.
b07specs=['hardening-control-geometry','hardening-progress-presentation','hardening-header-tabs-presentation','hardening-shell-presentation',
 'hardening-modal-presentation','hardening-card-presentation','hardening-actions-presentation','inventory-editor-chrome','inventory-layout-replacement',
 'inventory-editor-table-history','inventory-shell-responsive','inventory-grid-shell-responsive']
for spec in b07specs:
    p='packages/ui/tests/browser/'+spec+'.spec.ts'
    evidence['files'][p]=receipt(p)
editor_artifacts={}
for root in ['packages/ui/artifacts/editor-focus','apps/docs/artifacts/editor-focus','apps/docs/artifacts/editor-sample-content']:
    folder=ROOT/root
    pngs=sorted(str(p.relative_to(ROOT)) for p in folder.rglob('*.png')) if folder.is_dir() else []
    editor_artifacts[root]={'exists':folder.exists(),'pngs':{p:sha(p) for p in pngs},
      'limit':'Available later editor-only capture; no all-family theme/density/source-host attestation inferred.'}
evidence['editorArtifactAvailability']=editor_artifacts
editor_result='packages/ui/artifacts/editor-focus/results.json'
if (ROOT/editor_result).is_file():
    raw=load(editor_result)
    evidence['retainedEditorResult']={'file':editor_result,'sha256':sha(editor_result),'stats':raw.get('stats'),
      'command':raw.get('config',{}).get('argv'),
      'limit':'Four Chromium cases from 2026-10-16T15:13:18.515Z; retained native result, not fresh execution or source/build-hash attestation. No PNG files accompany this local result.'}
results.append({'id':'A-B-07','status':'partial','originalRequirement':requirements['A-B-07'],
 'sourceReferences':['docs/developer/backlog-execution-2026-10-15.md','docs/developer/react-aria-hardening-execution.md'],
 'testReferences':['packages/ui/tests/browser/'+p+'.spec.ts' for p in b07specs],
 'evidenceReferences':['docs/developer/backlog-execution-2026-10-15.md','docs/developer/docs-fixture-migration.md',PREFIX+'fa04-retained-docs-build.txt',editor_result],
 'findings':['Dated accepted HB receipts explicitly describe captured/reviewed controls, progress, page navigation, shells, modals and course cards across light/dark and both densities. Editor/grid interaction checkpoint records actual desktop engine execution, not speech.',
 'The 28 enumerated historical local artifact roots are checked for availability in evidence.json; missing roots cannot supply directly reviewable screenshots or exact host manifests in this checkout.',
 'The available editor-focus/results.json records four Chromium cases, 0 unexpected/skipped/flaky, starting 2026-10-16T15:13:18.515Z; exact command/stats/hash are retained in evidence.json. There are zero local PNGs in the three checked editor capture roots. This result does not reconstruct the missing representative controls/navigation/modal/grid screenshot set or establish source-host identity.'],
 'remainingObligations':['Recover durable representative screenshot + interaction receipts for each required family with explicit theme, density, viewport, source/spec/host hash and engine. Existing narrative acceptance remains dated evidence, not current-head rendered review.'],
 'successors':[{'id':'W02-01-B07-captures','deliverable':'Recover already-created HB/checkpoint screenshot/results/manifest files from their recorded artifact locations into a durable reviewed evidence bundle. Index controls, editors, navigation, modals and grids by theme/density/viewport/engine and exact source/host hashes. Retain corrected red/pass lineage. If artifacts are irrecoverable, coordinator authorizes only missing representative captures on an immutable host; do not rerun passed whole suites.','prerequisite':'Access to original artifacts or coordinator native-capture admission. Source inspection and a docs build cannot create screenshots.'}],
 'checksActuallyPerformed':['Read full B-07 scope and map required family to existing dated interaction/presentation receipts.','Check explicit artifact root existence; hash available editor PNGs.','Hash relevant existing native specs; no rendering, browser, build or AT run.'],
 'inputHeadHostLimits':{'head':evidence['head'],'workingTree':True,'artifactAvailability':'evidence.json#/artifactAvailability',
   'limits':'B-07 representative capture is separate from 20 still-open editor V leaves, physical-device/AT, exact-artifact production checks and remote CI. None waived.'}})

unique_closure=set(p for c in evidence['components'].values() for p in c['runtimeClosure'])
evidence['summary']={'components':15,'leafRecords':16,'distinctRelevantRuntimeInputs':len(unique_closure),
 'distinctComparedBuiltFiles':len({p for c in evidence['components'].values() for p in c['targetedBuiltOutputs']}),
 'allRelevantInputsMatchFA02':all(not c['changedRelevantInputsSinceFA02'] for c in evidence['components'].values()),
 'comparedOutputEntriesAcrossComponents':sum(len(c['targetedBuiltOutputs']) for c in evidence['components'].values()),
 'historicalArtifactRoots':len(artifact_roots),'presentHistoricalArtifactRoots':sum(v['exists'] for v in evidence['artifactAvailability'].values()),
 'statuses':dict(Counter(r['status'] for r in results)),
 'noTestsOrBuildsRun':True,'graphMethod':'Reuse saved FA-02 relative runtime import edges, verify every reached source hash; external package resolution not re-inventoried.'}
write('evidence.json',evidence)
write('results.json',{'schemaVersion':1,'owner':'wave-02-01','capturedAt':evidence['capturedAt'],'head':evidence['head'],
 'summary':evidence['summary'],'evidence':'docs/developer/final-acceptance/wave-02-01/evidence.json','leaves':results,
 'constraints':{'writesOnlyOwnedDirectory':True,'noSourceOrSharedChecklistEdits':True,'noGitMutation':True,'noNewAgentsOrThreads':True,
 'noInstallBuildNativeConsumerOrHeavySuites':True,'noServerChanges':True,'noRelease':True,'editorVLeavesWaived':False}})

lines=['# Wave 02-01: catalog acceptance reconciliation','',
 '**10 complete; 6 partial.** All sixteen original leaves reviewed. Completion is limited to the named component row; no release or whole-library conformance is claimed.', '',
 f"Captured {evidence['capturedAt']} on modified `{evidence['branch']}` HEAD `{evidence['head']}`. Machine-readable leaf records are in [results.json](results.json); exact source/test/spec/fixture/output hashes, test-title line references and artifact availability are in [evidence.json](evidence.json).",'',
 '## Method and retained evidence','',
 'Read full current A-M-01–15 and A-B-07 criteria, historical row holds, later checkpoint/HB receipts and the working implementations/assertions. F-C01–15 and T-C01–15 link to the accepted F/T baseline/regression completion records, unchanged relevant colocated tests and FA-04. V-C01–15 link to their specific saved native/presentation scopes below. Prefixes identify original component phases; no unit-case total is substituted for a leaf count.', '',
 'Reused FA-01 export/output inventory, FA-02 import/source graph, FA-04 passing-unit reconciliation and prior parallel report. No repeated export/source inventory, build or behavioral suite. The source graph comparison verifies every reached local runtime dependency, including CSS, scope, tokens, icons and adapters; exact external package versions remain those in FA-01/02. Current relevant source/tests/native specs/fixtures match FA-02; associated existing outputs match FA-01. Concurrent coordinator changes in PeriodPicker, DateTimeRangePicker, DateRangeComparisonPicker and TextArea are outside these verified runtime closures. No assertion that their new source matches old dist is made.', '',
 'Historical browser results retain their recorded host/head and desktop-engine limits. The 2026-10-15/16 receipts use the docs-owned /fixtures host. Older 2026-10-07 reports retain their Storybook provenance. The failed original FA-04 aggregate command remains failed; its unaffected passing tests plus corrected four calendar files supply the retained baseline. No fresh native, screen-reader, physical-device, remote CI or production artifact check occurred.', '',
 f"Verified {len(unique_closure)} distinct relevant runtime inputs and inspected 28 expected historical local browser artifact roots; {evidence['summary']['presentHistoricalArtifactRoots']} exist. Missing raw artifacts do not erase accepted historical V results, but cannot be relabeled current-head screenshots/immutable-host execution. B-07 retains its capture-delivery gap. All cited unit files and native spec titles/lines are indexed for review rather than executed again.", '',
 '## Per-leaf outcomes','']
for r in results:
    lines += [f"### {r['id']} — {r['status']}",'',f"Original: {r['originalRequirement']}",'']
    lines += [x+'\n' for x in r['findings']]
    if r['id'].startswith('A-M'):
        phase=r['phaseEvidence']
        lines += [f"**F/T/V links:** {phase['F']['prefix']} / {phase['T']['prefix']} retain the accepted baseline/regression records and unchanged unit files. {phase['V']['prefix']}: {phase['V']['basis']}",'',
                  '**Concrete source/tests:** '+', '.join(f'`{p}`' for p in r['sourceReferences'] if p.endswith(('.tsx','.ts','.css')))+'.', '',
                  '**Native assertions:** '+', '.join(f'`{p}`' for p in phase['V']['nativeSpecs'])+'.','']
    lines += ['**Saved evidence:** '+', '.join(f'[{Path(p).name}](../../../{p.removeprefix("docs/")})' if p.startswith('docs/') else f'`{p}`' for p in r['evidenceReferences'])+'.','']
    if r['remainingObligations']:
        lines += ['**Unfinished:** '+' '.join(r['remainingObligations']),'']
        for s in r['successors']: lines += [f"**{s['id']}:** {s['deliverable']} Prerequisite: {s['prerequisite']}",'']
    else: lines += ['**Successor:** none within this component row. Broader current-head production/browser/device/AT obligations remain independently open.','']
lines += ['## Checks actually performed','',
 'Ran `python3 docs/developer/final-acceptance/wave-02-01/reconcile.py` from the repository root. It reuses saved import edges, verifies exact relevant inputs/targeted existing outputs, indexes unit/native case lines and fixture paths, checks historical artifact availability and hashes available editor PNGs. Generated only this owned directory. No unit/native/browser/consumer suite, dependency install, source/output rebuild, server change, staging/commit/push or release action.', '',
 'The two absent-API disputes and learner status attribution need explicit scope decisions. The announcement/modal speech requirements need a real AT operator. Missing screenshot manifests need artifact recovery or coordinator native admission. Those prerequisites are recorded precisely; none is reported as a new implementation defect or silently waived. Twenty editor V leaves remain open and unaffected. Shared checklist/count reconciliation belongs to the coordinator.','']
(OUT/'report.md').write_text('\n'.join(lines))
print(json.dumps(evidence['summary'],indent=2))
