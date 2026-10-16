import json,hashlib,pathlib,subprocess,re,datetime
root=pathlib.Path(subprocess.check_output(['git','rev-parse','--show-toplevel'],text=True).strip()); out=root/'docs/developer/final-acceptance/wave-02-06'
old=json.loads((root/'docs/developer/final-acceptance/2026-10-16-source-inventory.json').read_text()); built=json.loads((root/'docs/developer/final-acceptance/2026-10-16-inventory.json').read_text())
refs='''docs/developer/react-aria-hardening-tasks.md
docs/developer/react-aria-final-acceptance.md
docs/developer/final-acceptance/parallel-06/report.md
docs/developer/final-acceptance/parallel-08/report.md
docs/developer/final-acceptance/parallel-08/input-reconciliation.json
docs/developer/final-acceptance/parallel-10/report.md
docs/developer/final-acceptance/parallel-reconciliation-2026-10-16.json
docs/developer/final-acceptance/fa04-original-check.txt
docs/developer/final-acceptance/fa04-package.txt
docs/developer/final-acceptance/fa04-retained-docs-build.txt
docs/developer/final-acceptance/fa04-library-input-delta.json
docs/developer/migration-baseline/public-api.json
docs/migration.md
docs/developer/react-aria-theme.md
docs/developer/react-aria-architecture.md
docs/developer/component-architecture.md
docs/developer/react-aria-css-lint.md
docs/developer/react-aria-primitives.md
docs/developer/react-aria-card-frames.md
docs/developer/react-aria-modal-shells.md
docs/developer/react-aria-catalog-grid.md
docs/developer/react-aria-grid-contracts.md
docs/developer/react-aria-button.md
docs/developer/react-aria-layout-actions.md
docs/developer/react-aria-navigation-container.md
docs/developer/react-aria-modal-container.md
docs/developer/react-aria-data-toolbar.md
docs/developer/react-aria-card-pagination.md
docs/developer/docs-fixture-migration.md
docs/developer/parallel-batch-104/acceptance-evidence.md
docs/developer/parallel-batch-165/toolbar-container-boundary.md
docs/developer/parallel-batch-167/navigation-shell-container-boundary.md
docs/developer/parallel-batch-168/modal-container-boundary.md
packages/ui/src/foundation/tokens.json
packages/ui/src/foundation/ThemeScope.tsx
packages/ui/src/foundation/ThemeScope.test.tsx
packages/ui/scripts/tokens.test.mjs
packages/ui/scripts/css-modules.mjs
packages/ui/scripts/css-modules.test.mjs
packages/ui/scripts/check-component-css.mjs
packages/ui/scripts/check-package.mjs
packages/ui/src/components/Button/Button.tsx
packages/ui/src/components/Button/Button.public-contract.test.tsx
packages/ui/src/experimental/SplitAction/SplitAction.tsx
packages/ui/src/experimental/SplitAction/SplitAction.test.tsx
packages/ui/src/experimental/Card/Card.tsx
packages/ui/src/experimental/Surface/Surface.tsx
packages/ui/src/components/ClassCardFrame/ClassCardFrame.tsx
packages/ui/src/components/ClassCardFrame/ClassCardFrame.test.tsx
packages/ui/src/components/AppModal/AppModal.tsx
packages/ui/src/components/AppModal/AppModal.test.tsx
packages/ui/src/experimental/TextField/TextField.tsx
packages/ui/src/experimental/TextField/TextField.test.tsx
packages/ui/src/experimental/Progress/Progress.tsx
packages/ui/src/components/SideNavigation/SideNavigation.tsx
packages/ui/src/components/SideNavigation/SideNavigation.test.tsx
packages/ui/src/experimental/DateRangeSelector/DateRangeSelector.tsx
packages/ui/src/experimental/Tabs/useTabOverflow.ts
packages/ui/src/components/AppShell/AppShellMain.tsx
apps/docs/app/theming/page.tsx
apps/docs/components/ThemePipelineExplorer.tsx
apps/docs/content/catalog.json
apps/docs/native-fixtures/scenarios/foundation/FoundationCatalogue.fixture.tsx
apps/docs/native-fixtures/scenarios/components/Typefaces/Typefaces.fixture.tsx
apps/docs/theme/theme-graph.ts
apps/docs/theme/theme-graph.test.mjs
packages/ui/tests/browser/foundation-catalogue.spec.ts
packages/ui/tests/browser/display-preferences.spec.ts
packages/ui/tests/browser/token-tier-scope.spec.ts
packages/ui/tests/browser/toolbar-container-boundary.spec.ts
packages/ui/tests/browser/navigation-shell-container-boundary.spec.ts
packages/ui/tests/browser/modal-container-boundary.spec.ts'''.splitlines()
# Reuse FA-02's file list for bounded CSS policy analysis, not a fresh source walk.
cssfiles=sorted({x['file'] for x in old['cssSelectors'] if x['file'].startswith('packages/ui/src/') and x['file'].endswith('.module.css')})
measurements=[x for x in old['domCandidates'] if x['file'].startswith('packages/ui/src/') and not any(k in x['file'] for k in ['.test.','fixture']) and any(k in x['identifiers'] for k in ['ResizeObserver','getBoundingClientRect','getClientRects'])]
refs+=cssfiles+[x['file'] for x in measurements]
receipts={}; missing=[]
for f in sorted(set(refs)):
 p=root/f
 if not p.exists(): missing.append(f);continue
 h=hashlib.sha256(p.read_bytes()).hexdigest(); before=old['inputHashes'].get(f,built['sourceHashes'].get(f))
 receipts[f]={'sha256':h,'savedInputSha256':before,'matchesSavedInput':h==before if before else None}
cssfacts={'nativeNestedRules':[],'containerQueries':[],'fixedMotion':[],'forcedColorAdjustmentNone':[],'fluidClamp':[]}
for f in cssfiles:
 for line,text in enumerate((root/f).read_text().splitlines(),1):
  row={'file':f,'line':line,'source':text.strip()}
  if re.search(r'(^|[{}])\s*&',text):cssfacts['nativeNestedRules'].append(row)
  if '@container' in text:cssfacts['containerQueries'].append(row)
  if re.search(r'(animation|transition)[^;{}]*\b\d+(?:\.\d+)?(?:ms|s)\b',text):cssfacts['fixedMotion'].append(row)
  if 'forced-color-adjust: none' in text or 'forced-color-adjust:none' in text:cssfacts['forcedColorAdjustmentNone'].append(row)
  if 'clamp(' in text:cssfacts['fluidClamp'].append(row)
baseline=json.loads((root/'docs/developer/migration-baseline/public-api.json').read_text()); styleFields=[]
for f,s in baseline.items():
 astfields=re.findall(r'^\s+(\w+)\??:\s*([^\n]*SxProps[^\n]*);',s,re.M)
 for field,type_ in astfields:styleFields.append({'historicalDeclaration':f,'field':field,'type':type_})
report={'capturedAt':datetime.datetime.now(datetime.timezone.utc).isoformat(),'head':subprocess.check_output(['git','rev-parse','HEAD'],text=True).strip(),'branch':subprocess.check_output(['git','branch','--show-current'],text=True).strip(),'method':'Selected input hash receipts; CSS fact extraction on FA-02 saved stylesheet file list; historical explicit SxProps fields, not inherited upstream prop inventory. No source traversal, suite, browser or build executed.','inputs':receipts,'missingInputs':missing,'cssFacts':cssfacts,'measurementCandidatesFromFA02':measurements,'explicitHistoricalStylingFields':styleFields,'limits':['CSS facts are source candidates, not runtime visual conformance.','Selected source hashes do not transfer historical browser receipts to current host.','No distributable parity claim for concurrent BUG-0008/0009 changes.','Fixed motion and physical directions are design review candidates, not automatically bugs.']}
(out/'evidence.json').write_text(json.dumps(report,indent=2)+'\n');print(json.dumps({'inputs':len(receipts),'missing':missing,'changed':[(f,x['sha256']) for f,x in receipts.items() if x['matchesSavedInput'] is False],'cssFacts':{k:len(v) for k,v in cssfacts.items()},'explicitHistoricalStylingFields':styleFields},indent=2))
