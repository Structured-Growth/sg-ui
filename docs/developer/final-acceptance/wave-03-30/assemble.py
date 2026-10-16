from pathlib import Path
import hashlib,json,datetime,difflib,subprocess
root=Path.cwd(); out=root/'docs/developer/final-acceptance/wave-03-30'
def read(p): return json.loads((root/p).read_text())
def sha(p):
 p=root/p
 return hashlib.sha256(p.read_bytes()).hexdigest() if p.is_file() else None
def put(name,obj): (out/name).write_text(json.dumps(obj,indent=2)+'\n')
assignment=read('docs/developer/final-acceptance/wave-03-30/assignment.json')
coord=read('docs/developer/final-acceptance/coordinator-integration/evidence.json')
bases={}
for wave,field in [('wave-02-06','inputs'),('wave-02-10','inputs'),('wave-02-04','selectedInputs')]:
 name={'wave-02-06':'evidence.json','wave-02-10':'input-reconciliation.json','wave-02-04':'input-evidence.json'}[wave]
 data=read(f'docs/developer/final-acceptance/{wave}/{name}')[field]
 if isinstance(data,list): data={x['path']:x for x in data}
 bases[wave]={k:(v.get('sha256') if isinstance(v,dict) else v) for k,v in data.items()}
paths=['AGENTS.md','docs/developer/react-aria-final-acceptance.md',
'apps/docs/app/theming/page.tsx','apps/docs/components/Example.tsx','apps/docs/components/DemoSettings.tsx','apps/docs/components/demo-theme.ts',
'apps/docs/native-fixtures/host.tsx','apps/docs/native-fixtures/generate-registry.mjs','apps/docs/native-fixtures/migration-manifest.json',
'apps/docs/native-fixtures/scenarios/foundation/FoundationCatalogue.fixture.tsx','apps/docs/native-fixtures/scenarios/components/Typefaces/Typefaces.fixture.tsx',
'packages/ui/src/foundation/tokens.json','packages/ui/src/foundation/tokens.generated.ts','packages/ui/src/foundation/ThemeScope.tsx',
'packages/ui/src/components/Button/Button.tsx','packages/ui/src/experimental/TextField/TextField.tsx','packages/ui/src/experimental/Progress/Progress.tsx',
'packages/ui/src/experimental/DataGrid/types.ts','packages/ui/src/components/ContentEditorChrome/ContentEditorChrome.tsx',
'packages/ui/dist/components/ContentEditorChrome/ContentEditorChrome.d.ts','packages/ui/dist/experimental/index.d.ts',
'docs/developer/react-aria-calendar-contracts.md','docs/developer/react-aria-button.md','docs/developer/react-aria-proof-controls.md',
'docs/developer/react-aria-progress.md','packages/ui/tests/browser/foundation-catalogue.spec.ts',
'packages/ui/tests/browser/hardening-grid-presentation.spec.ts','packages/ui/tests/browser/hardening-control-geometry.spec.ts',
'docs/developer/final-acceptance/wave-02-04/prototype-findings.json','docs/developer/final-acceptance/coordinator-integration/evidence.json',
'docs/developer/final-acceptance/coordinator-integration/supplemental-reconciliation.json']
for entry in assignment['priorEvidence'].values(): paths += [entry['report'],entry['results']]
rows=[]
for p in sorted(set(paths)):
 h=sha(p); prior={name:values[p] for name,values in bases.items() if p in values}
 coordinator=coord['inputHashes'].get(p,coord['builtLibraryHashes'].get(p))
 rows.append({'path':p,'sha256':h,'priorHashes':prior,'matchesPrior':{k:h==v for k,v in prior.items()},'coordinatorHash':coordinator,'matchesCoordinator':h==coordinator if coordinator else None})
put('input-evidence.json',{'capturedAt':datetime.datetime.now(datetime.timezone.utc).isoformat(),'head':subprocess.check_output(['git','rev-parse','HEAD'],text=True).strip(),
 'scope':'Selected inspected inputs only. Shared mutable dev checkout; no whole-host attestation.','inputs':rows,
 'priorReportReceipts':[{'id':k,'reportMatchesAssignment':sha(v['report'])==v['reportSha256'],'resultsMatchesAssignment':sha(v['results'])==v['resultsSha256']} for k,v in assignment['priorEvidence'].items()],
 'retainedEvidence':'Coordinator Node24 library/declaration/package/docs/native build and 21+3 targeted engines remain scoped to its hashes; they do not execute this proposed visual suite.',
 'historicalArtifactRecovery':{'packages/ui/artifacts/hb16-2026-10-16/manifest.json':(root/'packages/ui/artifacts/hb16-2026-10-16/manifest.json').exists(),'claim':'Historical report retained; absent manifest cannot supply approved image baseline.'}})
# Ready-to-apply unified patch; no shared files changed.
patch=[]
for f in sorted((out/'proposed-files').rglob('*')):
 if not f.is_file():continue
 rel=f.relative_to(out/'proposed-files').as_posix(); target=root/rel
 old=target.read_text() if target.exists() else ''
 patch.extend(difflib.unified_diff(old.splitlines(True),f.read_text().splitlines(True),fromfile='a/'+rel if target.exists() else '/dev/null',tofile='b/'+rel))
(out/'foundation-and-visual.patch').write_text(''.join(patch))
configs=[('light','compact',360,'en-US','ltr',True),('light','compact',1280,'en-US','ltr',False),('light','comfortable',360,'ar','rtl',True),('light','comfortable',1280,'en-US','ltr',False),('dark','compact',360,'ar','rtl',True),('dark','compact',1280,'en-US','ltr',False),('dark','comfortable',360,'en-US','ltr',True),('dark','comfortable',1280,'ar','rtl',True)]
captures=[]
for theme,density,width,locale,direction,long in configs:
 key=f'{theme}-{density}-{width}-{locale}-{direction}-'+('long' if long else 'short')
 for family in ['controls','focused-action','grids','navigation','editor','overlay']:
  captures.append({'id':key+'-'+family,'theme':theme,'density':density,'viewportWidth':width,'locale':locale,'direction':direction,'pseudoExpanded':long,'family':family,
   'captureStatus':'missing-unrun','reviewStatus':'pending','baselineImage':None,'actualImage':None,'diffImage':None,'imageSha256':None,'reviewer':None,'sourceHostReceipt':None})
put('visual-matrix.json',{'status':'48 planned captures; zero executed or reviewed','host':'docs-owned native fixture; not historical Storybook',
 'configurations':8,'captures':captures,'states':{
 'controls':['default','keyboard focus','disabled','error','loading','selected'],
 'grids':['selected','loading','empty','error'], 'navigation':['current page'],
 'editor':['empty editable document','full toolbar; no selected text assertion'],
 'overlay':['open','autofocused field','error','loading','Escape return focus']},
 'notApplicable':'Navigation has no error/loading API; editor network loading/error are host responsibilities. Pseudo expansion affects editor heading only, not every toolbar translation.',
 'coverageLimit':'Representative state list; no all-component or every-state Cartesian claim. Width is viewport allocation; exact container bounds must be captured by operator.',
 'comparison':'review-method.md; same pinned runtime, zero pixel tolerance; approve candidates manually then execute comparison without updating snapshots.'})
put('operator-findings.json',{'status':'Required external observations pending; no fabricated observations', 'sourceReceipt':'input-evidence.json','retainedFindings':'../wave-02-04/prototype-findings.json',
 'matrix':[{'concern':concern,'available':available,'requiredSuccessor':successor,'observed':None,'operator':None,'OS':None,'device':None,'browserVersion':None,'ATVersion':None,'sourceHostHashes':None,'warningLog':None} for concern,available,successor in [
 ('keyboard','Existing named native receipts retain original heads/hosts; new representative suite prepared','Integrate and run scoped new fixture; reuse unchanged engine results only with matching inputs.'),
 ('screen-reader','Existing DOM roles and labels; no speech receipt','Named operator records spoken focus, nested Escape, async loading/empty/error and grid selection; include OS/browser/AT versions.'),
 ('zoom','Historical CSS text enlargement only','Use real browser 200%/400% zoom in prototypes; record chrome zoom, viewport, focus visibility and scrolling. Do not substitute CSS font-size.'),
 ('touch','Historical emulated context only','Physical hardware tap/scroll and grid long-press cancel/commit or Move alternative; device/OS/browser trace.'),
 ('dark','Named historical screenshots; no recovered complete visual baseline','Produce/review proposed dark configurations with immutable host and sources.'),
 ('reduced-motion','Production CSS and existing native spec; public docs proposal prepared','Run existing foundation preference case and public docs motion case; record browser-emulated versus OS setting separately.'),
 ('SSR/hydration','Coordinator package/declaration build; historical packed fixtures','Reuse attributable packed runs where inputs match; otherwise coordinator executes representative React18/19 packed hydration, zero recoverable errors, saved warnings.'),
 ('production bundle','Historical gzip reference; coordinator fresh build/package saved hashes','Use fresh packed-consumer asset/source hashes and record sizes. Do not call old reference a current bundle measurement.')]],
 'productionBoundary':'No feature release, broad prototype acceptance, device/AT certification or closure of 20 editor V leaves.'})
put('validation-plan.json',{'status':'Integration and runtime validation pending','safeScope':'Coordinator only in leased immutable window. No host startup/build/install performed by this owner.',
 'registration':{'action':'Coordinator adds one new scenarioModule entry to existing migration manifest; no generated or manifest patch is supplied.',
 'entry':{'original':'apps/docs/native-fixtures/scenarios/foundation/VisualAcceptance.fixture.tsx','fixture':'apps/docs/native-fixtures/scenarios/foundation/VisualAcceptance.fixture.tsx','scenarioModule':True},
 'expectedId':'foundations-visual-acceptance--matrix','provenance':'New docs-owned native scenario; original path intentionally self-referential, never label a removed Storybook source.'},
 'steps':[
 {'cwd':'repository root','command':'git apply --check docs/developer/final-acceptance/wave-03-30/foundation-and-visual.patch','assertions':['Patch has no conflict with concurrent docs changes. Rebase theming-page addition if needed.']},
 {'cwd':'repository root','command':'node docs/developer/final-acceptance/wave-03-30/check-proposals.mjs','assertions':['Three extracted snippets and six proposed TypeScript files have zero diagnostics. Use supported Node24 for coordinator validation; local authoring receipt used Node26.']},
 {'cwd':'repository root','command':'pnpm --filter @structured-growth/sg-ui build','assertions':['Fresh public declarations/styles precede docs and fixture build. Reuse coordinator matching fresh outputs when unchanged.']},
 {'cwd':'repository root','command':'pnpm --filter @structured-growth/docs build','assertions':['Public /theming includes 3 source-backed foundation examples; isolation/catalog checks pass. No generated outputs edited by hand.']},
 {'cwd':'repository root','command':'pnpm --filter @structured-growth/docs exec playwright test tests/foundation-examples.spec.ts','assertions':['Matching source sections, independent editable draft, disabled skipping, native local Tab traversal; actual production reduced-motion CSS while pending semantics persist. Existing docs config uses private port3100; coordinator reserves it.']},
 {'cwd':'packages/ui','command':'node scripts/build-browser-docs.mjs','assertions':['Coordinator first registers new native scenario, fixture typecheck/build succeeds, registry ID resolves.']},
 {'cwd':'packages/ui','command':'SGUI_VISUAL_BASE_URL=http://127.0.0.1:6173 SGUI_VISUAL_OUTPUT=/absolute/owned/evidence/candidate pnpm exec playwright test --config playwright.visual-acceptance.config.ts --update-snapshots','assertions':['Use coordinator-reserved immutable host, not user server3000. Eight tests produce48 candidate captures and warning attachments, no auto approval. Config starts no server. Record browser/font/runtime/source/host asset hashes.']},
 {'cwd':'packages/ui','command':'SGUI_VISUAL_BASE_URL=http://127.0.0.1:6173 SGUI_VISUAL_OUTPUT=/absolute/owned/evidence/candidate pnpm exec playwright test --config playwright.visual-acceptance.config.ts','assertions':['After manual review and baseline hashes recorded, all48 comparisons pass with maxDiffPixels0. Save actual/diff paths on failure; no automatic tolerance increase.']},
 {'cwd':'operator environment','command':'Follow operator-findings.json','assertions':['External spoken AT, physical touch, actual zoom and changed packed-consumer gates remain pending; automation/source assertions cannot replace them.']}
 ],'noNewUnitTests':'Documentation/visual work uses focused browser specs and existing component tests. No mirrored implementation unit tests added.'})
print('Wrote patch, input receipts,48-cell matrix, operator sheet and exact validation plan.')
