import json,hashlib,subprocess,datetime,collections,difflib
from pathlib import Path
root=Path(__file__).resolve().parents[4];out=Path(__file__).resolve().parent
base='docs/developer/final-acceptance/'
def read(f):return json.loads((root/f).read_text())
def digest(f):
 p=root/f;return hashlib.sha256(p.read_bytes()).hexdigest() if p.is_file() else None
def save(f,v):(out/f).write_text(json.dumps(v,indent=2)+'\n')
work=read(base+'wave-03-35/export-join-work.json');api=read(base+'parallel-01/api-snapshot.json');ci=read(base+'coordinator-integration/evidence.json')
guides={
'Button':'react-aria-button.md','ExperiencePageNavigator':'react-aria-page-navigation.md','AppPageHeader':'react-aria-page-layout.md','AppPageTabs':'react-aria-page-layout.md',
'AppShell':'react-aria-modal-shells.md','AuthShell':'react-aria-modal-shells.md','AppModal':'react-aria-modal-shells.md','SideNavigation':'react-aria-modal-shells.md',
'CardCollectionWithFooter':'react-aria-card-pagination.md','CardPaginationFooter':'react-aria-card-pagination.md','ClassCardFrame':'react-aria-card-frames.md','InstructorClassCard':'react-aria-card-frames.md','LearnerClassCard':'react-aria-card-frames.md',
'AppDataGrid':'react-aria-catalog-grid.md','AppDataGridShell':'react-aria-catalog-grid.md','LearnerClassesDataGrid':'react-aria-catalog-grid.md','AppDataGridRowDnd':'react-aria-grid-reorder.md','DataToolbar':'react-aria-data-toolbar.md',
'DocumentEditorLayout':'react-aria-editor-layout.md','DocumentEditorToolbar':'react-aria-editor-layout.md','ContentEditorChrome':'react-aria-editor-layout.md','FloatingTextSelectionToolbar':'react-aria-editor-layout.md',
'RichTextFormattingToolbar':'react-aria-formatting-toolbar.md','PageRichTextEditorSection':'react-aria-editor-section.md','ColumnsLayoutModal':'react-aria-editor-dialogs.md','ImageUploadModal':'react-aria-editor-dialogs.md','LinkUrlModal':'react-aria-editor-dialogs.md','InsertContentMenuControl':'react-aria-editor-menus.md','TextAlignMenuControl':'react-aria-editor-menus.md','TextColorPickerControl':'react-aria-editor-menus.md','TextStyleMenuControl':'react-aria-editor-menus.md',
'AppInlineProgress':'react-aria-progress-avatar.md','AppOperationSteps':'react-aria-progress-avatar.md','EditableTitleField':'react-aria-remaining-controls.md',
'AdminDataGridOptions.d.ts':'react-aria-grid-presets.md','InstructorDataGridOptions.d.ts':'react-aria-grid-presets.md','primitives':'react-aria-primitives.md','IconPanelNavigation':'component-architecture.md'}
def guidance(decl):
 path=decl.split('/dist/')[1];parts=path.split('/')
 if 'icons' in parts:return 'react-aria-icons.md','Owned SVG/icon props; vectors and helper behavior replace upstream icon modules. No upstream SVG prop compatibility promise.'
 if parts[0]=='components':return guides[parts[1]],'Owned component/record contract in captured declaration; existing name does not preserve upstream props/events/style defaults. Use the linked component mapping.'
 if parts[0]=='adapters':return 'react-aria-host-adapter-acceptance.md','Host routing/account operations remain supplied through adapters; no Next.js/session/API runtime dependency.'
 if parts[0]=='hooks':return 'react-aria-pagination-state.md','Persistence is explicit opt-in; page-size changes request page zero first; preserve host-controlled state and SSR-safe storage.'
 if parts[0]=='i18n':return 'react-aria-i18n-acceptance.md','Host translation/namespace adapter with defaultMessage English fallback; no application catalog dependency.'
 if parts[0]=='foundation' or 'Provider' in parts:return 'react-aria-theme.md','Owned scope/generated token contract; styles.css and Provider/ThemeScope replace upstream theme objects and typography augmentation.'
 if parts[0]=='experimental':
  if any('Date' in p or p in ['Calendar','PeriodPicker','TimeField'] for p in parts):return 'react-aria-calendar-contracts.md','Experimental owned date/value/preset/gesture contract; host timezone, persistence and business presets remain external; no inherited date-engine types promised.'
  if parts[1] in ['DataGrid']:return 'react-aria-grid-contracts.md','Owned proof grid contracts replace engine contexts, column and selection models; host owns server data and reorder persistence.'
  if parts[1] in ['Dialog','Popover']:return 'react-aria-proof-controls.md','Owned overlay callbacks/slots and focus/dismissal contracts; host owns state/persistence. Experimental route remains a proof contract.'
  return 'react-aria-primitives.md','Owned primitive/experimental declaration; inherited upstream prop surface removed. Aliases share implementation; experimental exports retain proof scope.'
 if path=='models.d.ts':return 'react-aria-catalog-grid.md','Local presentation model retained independently of learner-platform HTTP/database contracts.'
 if parts[0]=='utils':return ('react-aria-calendar-contracts.md' if 'relative' in path else 'react-aria-catalog-grid.md'),'Host-supplied date/locale/timezone presentation helper; no application data fetching or upstream grid types.'
 raise ValueError(path)
replacement={
 'AppButton':('Button','react-aria-button.md','Removed pre-first-release AppButton name; update imports and onClick to onPress; owned variant/tone/density and native class/style.'),
 'AppButtonProps':('ButtonProps','react-aria-button.md','Rename type and migrate inherited upstream action/style prop surface to owned ButtonProps.'),
 'FormControlLabel':('Checkbox / Switch label; RadioGroup option labels','react-aria-primitives.md','Wrapper removed; put labels directly on the owned control, preserving its accessible name.'),
 'FormControlLabelProps':('CheckboxProps / SwitchProps / RadioGroupProps','react-aria-primitives.md','Removed upstream wrapper props; use declared control label/options contracts.'),
 'MuiLink':('Link','react-aria-primitives.md','Removed branded export; use owned Link and host navigation adapter with native anchor ref.'),
 'MuiLinkProps':('LinkProps','react-aria-primitives.md','Replace upstream props with owned LinkProps/native anchor contract.'),
 'MenuItemProps':('MenuItem','react-aria-primitives.md','MenuItem runtime component removed; current MenuItem is an item-record type passed to Menu.items, not JSX.'),
 'SelectChangeEvent':('SelectProps.onValueChange','react-aria-primitives.md','Removed synthetic upstream event; callback receives string or null.'),
 'AppGridSortModel':('AppDataGridSortRule[]','react-aria-catalog-grid.md','Replace engine sort model with owned ordered field/direction rules; no upstream grid model type.'),
 'darkTheme':('Provider / ThemeScope theme="dark"','react-aria-theme.md','Remove upstream theme object; load styles.css and use owned scope/tokens.'),
 'lightTheme':('Provider / ThemeScope theme="light"','react-aria-theme.md','Remove upstream theme object; load styles.css and use owned scope/tokens.'),
 'theme':('Provider / ThemeScope','react-aria-theme.md','Remove upstream default theme object; use explicit owned scope and token overrides.')}
rows=[];currentByName=collections.defaultdict(list)
for c in work['current']:
 for i in c['publicIdentities']:currentByName[i['name']].append((c,i['route']))
for name,ids in work['baselineNames'].items():
 current=currentByName[name];oldroutes=sorted(set(i['route'] for i in ids));newroutes=sorted(set(r for c,r in current))
 if current:
  c=current[0][0];guide,impact=guidance(c['declarations'][0]['file']);target=name
  disposition='retained-public-name-owned-contract'
  if name=='MenuItem':impact='Breaking value-to-type change: JSX MenuItem removed; MenuItem now describes records passed to Menu.items.'
  if name in ['AppThemeProvider','AppThemeProviderProps','Autocomplete','AutocompleteProps','SGLink','RowSubHeader','RowSubHeaderProps','TableHeadProps','TableBodyProps','TableRowProps']:
   impact+=' Alias target: '+', '.join(sorted(set(c['name'] for c,r in current)))+'.'
 else:
  target,guide,impact=replacement[name];disposition='removed-with-owned-replacement'
 rows.append({'name':name,'baselineIdentities':ids,'disposition':disposition,'replacement':target,'currentContractIds':sorted(set(c['id'] for c,r in current)),'currentRoutes':newroutes,'removedRoutes':sorted(set(oldroutes)-set(newroutes)),'addedRoutes':sorted(set(newroutes)-set(oldroutes)),'guide':'docs/developer/'+guide,'releaseImpact':impact,'inheritedPropCompatibilityCertified':False})
contracts=[]
for c in work['current']:
 decl=c['declarations'][0]['file'];guide,impact=guidance(decl);oldnames=sorted(set(i['name'] for i in c['publicIdentities'])&set(work['baselineNames']))
 contracts.append({'contractId':c['id'],'declarationName':c['name'],'publicIdentities':c['publicIdentities'],'baselineNames':oldnames,'disposition':'owned-replacement-of-retained-names' if oldnames else 'additive-to-frozen-baseline','guide':'docs/developer/'+guide,'releaseImpact':impact if oldnames else 'Additive public contract relative to extraction baseline. '+impact,'declarations':[{'file':x['file'],'line':x['line'],'snapshotSha256':api['declarations'][x['file']]['sha256'],'currentSha256':digest(x['file'])} for x in c['declarations']],'exactSignatureEvidence':base+'parallel-01/api-snapshot.json','sourceCandidate':'packages/ui/src/'+decl.split('/dist/')[1].replace('.d.ts','.tsx')})
for c in contracts:
 stem=c['declarations'][0]['file'].replace('/dist/','/src/').removesuffix('.d.ts')
 c.pop('sourceCandidate',None)
 c['sourceFiles']=[{'path':f,'currentSha256':digest(f),'snapshotSha256':api['sources'][f]['sha256']} for f in [stem+'.ts',stem+'.tsx'] if f in api['sources'] and (root/f).is_file()]
for r in rows+contracts:
 if not (root/r['guide']).is_file():raise ValueError('missing guide '+r['guide'])
save('public-symbol-dispositions.json',{'scope':'All 638 baseline route/name identities (266 names) joined to all 469 captured contracts, including exported aliases, type-only names, helpers, hooks, presets, adapters and experimental routes. Frozen baseline has no wildcard icon subpaths; current wildcard routes are captured by FA-01/parallel-01.','limits':['Name/route completeness is distinct from inherited-prop/default/behavior compatibility; exact signatures remain in snapshot.','Every removed baseline name has an explicit owned replacement and release impact. No automatic release-version or review approval.','Current source/declaration deltas are recorded separately; captured contracts are not relabeled fresh runtime evidence.'],'baselineNames':rows,'currentContracts':contracts,'summary':{'baselineNames':len(rows),'baselineIdentities':sum(len(r['baselineIdentities']) for r in rows),'currentContracts':len(contracts),'removedNames':list(replacement),'additiveContracts':sum(r['disposition']=='additive-to-frozen-baseline' for r in contracts)}})
# Trace every M row to concrete local commit and retained acceptance evidence, without inventing PR review.
index=read(base+'wave-02-04/migration-index.json');reports=[]
for n in [1,2,3,4]:
 p=f'{base}wave-02-{n:02}/results.json'
 if (root/p).exists():
  for r in read(p).get('leaves',[]):
   if r['id'].startswith('A-M-'):reports.append((r['id'],p,r.get('status')))
for row in index:
 files=row['implementationFiles'];row['currentInputHashes']={f:digest(f) for f in files}
 row['latestLocalCommit']=subprocess.check_output(['git','log','-1','--format=%H%n%s','--',*files],cwd=root).decode().strip().splitlines()
 row['localCommitLimit']='Latest path-touching local commit, not evidence of row-specific human review or complete integration of dirty bytes.'
 row['priorLeafReceipt']=[{'path':p,'status':s,'sha256':digest(p)} for i,p,s in reports if i=='A-'+row['originalId']]
 row['reviewedPRAttributionVerified']=False
 row['trackingSuccessor']='Coordinator attach row-specific reviewed PR/commit receipt; retain original criterion and separate V/G/E/device/AT holds. Do not infer review from latest path commit or initial draft PR #1.'
save('migration-trace.json',index)
inputs=[base+'wave-02-04/report.md',base+'wave-02-04/results.json',base+'wave-02-04/migration-index.json',base+'wave-02-14/report.md',base+'wave-02-14/results.json',base+'parallel-01/api-snapshot.json','docs/developer/migration-baseline/public-api.json','docs/developer/migration-baseline/package.json',base+'coordinator-integration/evidence.json','docs/extraction-manifest.json','packages/ui/package.json','pnpm-lock.yaml','packages/ui/scripts/check-package.mjs','LICENSE','THIRD_PARTY_NOTICES.md','packages/ui/LICENSE','packages/ui/THIRD_PARTY_NOTICES.md']
def deltas(mapping):return [{'file':f,'receiptSha256':h,'currentSha256':digest(f)} for f,h in mapping.items() if digest(f)!=h]
save('input-evidence.json',{'capturedAt':datetime.datetime.now(datetime.timezone.utc).isoformat(),'head':subprocess.check_output(['git','rev-parse','HEAD'],cwd=root).decode().strip(),'runtime':{'node':subprocess.check_output(['node','--version']).decode().strip(),'python':subprocess.check_output(['python3','--version']).decode().strip()},'inputs':{f:digest(f) for f in inputs},'coordinatorInputDeltas':deltas(ci['inputHashes']),'coordinatorLibraryOutputDeltas':deltas(ci['builtLibraryHashes']),'apiDeclarationDeltas':deltas({f:v['sha256'] for f,v in api['declarations'].items()}),'apiSourceDeltas':deltas({f:v['sha256'] for f,v in api['sources'].items()}),'reusedCoordinatorValidation':ci['validation'],'priorReportHashMatchesAssignment':{k:all(digest(v[f])==v[f+'Sha256'] for f in ['report','results']) for k,v in read(base+'wave-03-35/assignment.json')['priorEvidence'].items()},'noBuildInstallPackOrBrowserExecuted':True})
print('symbol dispositions',len(rows),len(contracts),'M rows',len(index))
