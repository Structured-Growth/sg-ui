from pathlib import Path
import json,hashlib,subprocess,datetime
out=Path('docs/developer/final-acceptance/wave-03-30')
a=json.loads((out/'assignment.json').read_text()); inputs=json.loads((out/'input-evidence.json').read_text())
check=subprocess.run(['git','apply','--check',str(out/'foundation-and-visual.patch')],capture_output=True,text=True)
(out/'patch-check.txt').write_text(f'command: git apply --check {out}/foundation-and-visual.patch\nexit: {check.returncode}\n'+check.stdout+check.stderr)
assert check.returncode==0
originals=a['originalChecklistStatements']
common={'commandsActuallyRun':['node docs/developer/final-acceptance/wave-03-30/check-proposals.mjs (in-memory TypeScript authoring check)','git apply --check docs/developer/final-acceptance/wave-03-30/foundation-and-visual.patch','python3 docs/developer/final-acceptance/wave-03-30/assemble.py (selected hashes, matrix and patch assembly)'],
'runtime':'Local authoring Node v26.5.0; existing TypeScript; pure-node/no emit. Retained coordinator runtime Node24.21.0 is separate. No supported Node22/24 execution of new code claimed.',
'inputHashes':'input-evidence.json','logs':['proposal-check-initial-failure.txt','proposal-check.txt','patch-check.txt'],
'newRuntimeAcceptance':False,'host':'No new host/build/browser/device/AT execution. Docs-owned proposed native fixture distinct from historical Storybook.'}
rows=[
{'id':'A-D-20','status':'partial','originalRequirement':originals['A-D-20'],
'outcome':'Implemented ready-to-apply public /theming spacing, keyboard focus and production motion/preference examples using separate shared Example owners and exact public-import snippets. Links existing palette/typography/density/surface demonstrations. No live state echoes or theme boilerplate in copied code.',
'evidence':['foundation-and-visual.patch','proposed-files/apps/docs/components/FoundationExamples.tsx','proposed-files/apps/docs/app/theming/page.tsx','proposed-files/apps/docs/tests/foundation-examples.spec.ts','proposal-check.txt'],
'checks':common,'integrationRequired':True,'successors':[{'id':'W03-30-D20-INTEGRATE','deliverable':'Apply/rebase patch, build library and docs under coordinator lease; run two focused public foundation browser cases, check source/copy and links; retain resulting source/host hashes. Publication criterion is not closed while examples exist only as patch.'}],
'reusedEvidence':'Original FoundationCatalogue/Typefaces fixture and theme inspector retained, not restored Storybook. All prior report/result hashes match assignment.'},
{'id':'A-X-14','status':'partial','originalRequirement':originals['A-X-14'],
'outcome':'Implemented production-component native review fixture plus 8-configuration/48-capture Playwright screenshot comparator, no-server config, explicit missing-state matrix and manual baseline-review method. Light/dark, both densities,360/1280 widths, pseudo-expanded labels, Arabic/RTL and representative focus/error/loading/empty/selected states are concretely authored. All48 capture cells are unrun/missing, none called covered.',
'evidence':['visual-matrix.json','review-method.md','proposed-files/apps/docs/native-fixtures/scenarios/foundation/VisualAcceptance.fixture.tsx','proposed-files/packages/ui/tests/browser/visual-acceptance.spec.ts','proposed-files/packages/ui/playwright.visual-acceptance.config.ts'],
'checks':common,'integrationRequired':True,'successors':[{'id':'W03-30-X14-CAPTURE','deliverable':'Coordinator registers fixture, builds fresh native host; immutable capture window produces48 candidate images. Reviewer records exact image/source/host/runtime/font hashes and disposition, then run comparison without snapshot update. Save before/after/diff refs for later changes; recover historical manifests where possible.'}],
'limits':['Representative matrix, not all exports or Cartesian combinations.','Editor heading pseudo-expanded, not every toolbar label. No editor selected-text or full20 V acceptance claim.','Navigation has no error/loading API; no invented props.','Reduced-motion emulation freezes capture; does not replace OS/AT testing.','Historical HB16 manifest absent; old dated narratives do not become fresh baseline approval.']},
{'id':'A-P-07','status':'partial','originalRequirement':originals['A-P-07'],
'outcome':'Retained proof findings and supplied eight-concern operator sheet with exact missing observation fields. Existing engine/package evidence kept within original source/host bounds. Proposed docs/native tests add concrete keyboard/dark/reduced-motion/visual capture paths; no fabricated spoken AT, real zoom, physical touch or current packed hydration result.',
'evidence':['operator-findings.json','../wave-02-04/prototype-findings.json','validation-plan.json','input-evidence.json'],
'checks':common,'integrationRequired':True,'successors':[{'id':'W03-30-P07-OPERATOR','deliverable':'Complete external operator matrix for actual browser200/400% zoom, physical touch and spoken AT with OS/device/browser/AT versions, expected/observed focus/speech/scroll and warnings. Coordinator supplies immutable packed/source/host hashes and reuses only equivalent unchanged engine/hydration/bundle receipts.'}],
'limits':['DOM/axe/source assertions cannot substitute for speech or device findings.','CSS enlargement is not actual zoom; Playwright touch context is not physical touch.','Fresh package build alone is not executed hydration.']},
{'id':'A-P-11','status':'complete','originalRequirement':originals['A-P-11'],
'outcome':'The named documentation contradictions are already resolved in current working source: calendar scope distinguishes Gregorian period/comparison and month/year navigation from host fiscal/business/holiday/booking policy; Button guide documents onPress(anchor:HTMLButtonElement) for ContentEditorChrome and no-argument Button.onPress. Existing prototype-findings.json records six proof outcomes, API/ownership references and eight accessibility/environment limitations, with explicit no-release boundary. This report links the existing findings without rewriting historical receipts.',
'evidence':['../wave-02-04/prototype-findings.json','../../react-aria-calendar-contracts.md#current-scope-and-accessibility-limits','../../react-aria-button.md','../../react-aria-proof-controls.md','../coordinator-integration/evidence.json','input-evidence.json'],
'checks':{'performed':['Read corrected current calendar/Button/proof guidance and retained six-proof findings.','Verified ContentEditorChrome built declaration uses onPress?: (anchor:HTMLButtonElement)=>void and experimental built declarations export PeriodPicker/DateRangeComparisonPicker.','Compared selected current built declarations with coordinator integration hashes; see input receipt.','All four prior report/result hashes match assignment.'],
'runtime':'Read-only reconciliation; retained coordinator Node24 library/declarations/package receipts, no new runtime execution required for documentation obligation.'},
'integrationRequired':False,'successors':[],
'limits':['Complete only the original prototype outcome/API/limitations documentation obligation. No production feature release, device/AT acceptance or all-prototype completion inferred.','A-P-07, A-D-20, A-X-14,20 editor V leaves and production approval remain separate.']}
]
result={'schemaVersion':1,'capturedAt':datetime.datetime.now(datetime.timezone.utc).isoformat(),'directory':str(out),
'head':inputs['head'],'sharedCheckoutSafety':'Only this assigned evidence directory written; no shared source/manifest/generated output, Git state, server or settings mutation.',
'results':rows,'summary':{'complete':1,'partial':3,'blocked':0},'centralChecklistChanges':False,
'validationPlan':'validation-plan.json','patch':'foundation-and-visual.patch','proposedFiles':[p.relative_to(out).as_posix() for p in sorted((out/'proposed-files').rglob('*')) if p.is_file()],
'authoringCheck':{'initial':'4 Node type-resolution diagnostics in custom harness, failure log retained.','corrected':'Explicit installed Node type root;9 virtual files including3 extracted copyable snippets,0 diagnostics. No emit.','patch':'git apply --check exit0; no patch applied.'}}
result['artifactHashes']={p.relative_to(out).as_posix():hashlib.sha256(p.read_bytes()).hexdigest() for p in sorted(out.rglob('*')) if p.is_file() and p.name not in ['results.json','report.md','verification.json']}
(out/'results.json').write_text(json.dumps(result,indent=2)+'\n')
