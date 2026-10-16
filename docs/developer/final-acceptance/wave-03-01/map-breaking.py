from pathlib import Path
import json,hashlib,subprocess,difflib
out=Path(__file__).resolve().parent;root=out.parents[3];base=root/'docs/developer/final-acceptance'
read=lambda p: (root/p).read_text()
hash=lambda s: hashlib.sha256(s.encode()).hexdigest()
s=json.loads((base/'parallel-01/api-snapshot.json').read_text());old=json.loads((base/'wave-02-14/breaking-change-review.json').read_text())
rows=[]
for c in old['candidateMappings']:
 rows.append(dict(id=c['id'],classification='incompatible-relative-to-initial-extraction',beforeAfter=c['contractDelta'],source=c['source'],guide=c['guide']))
extra=[
('typography-polymorphism','incompatible-relative-to-initial-extraction','Upstream component/color props -> declared as/tone; bodyAlt2 and primary spelling preserved.','packages/ui/src/experimental/Typography/Typography.tsx','docs/developer/react-aria-primitives.md'),
('stack-spacing','incompatible-relative-to-initial-extraction','Stack spacing / upstream system props -> gap and owned native style/class props.','packages/ui/src/experimental/Stack/Stack.tsx','docs/developer/react-aria-primitives.md'),
('frame-style-slots','incompatible-relative-to-initial-extraction','headerSx/bodySx/footerSx -> headerClassName/headerStyle, bodyClassName/bodyStyle, footerClassName/footerStyle.','packages/ui/src/components/ClassCardFrame/ClassCardFrame.tsx','docs/developer/react-aria-card-frames.md'),
('icon-props','incompatible-relative-to-initial-extraction','fontSize/titleAccess/upstream icon props -> size/label and owned SVG ref. Unnamed icons are decorative.','packages/ui/src/experimental/icons/createVector.tsx','docs/developer/react-aria-icons.md'),
('grid-sort-mode','incompatible-relative-to-initial-extraction','AppGridSortModel/sortModel and separate processing modes -> ordered sortRules and one client/server mode; callbacks have owned records.','packages/ui/src/components/AppDataGrid/types.ts','docs/developer/react-aria-catalog-grid.md'),
('primitive-removals','incompatible-relative-to-initial-extraction','MuiLink/MuiLinkProps -> Link/LinkProps (host routing through SGLink); replace FormControlLabel with a label-bearing owned Checkbox/RadioGroup control; SelectChangeEvent is removed, use owned value callbacks.','packages/ui/src/components/primitives/index.ts','docs/developer/react-aria-primitives.md'),
('provider-alias','preserved','AppThemeProvider is the owned Provider alias; no deprecation tag. Alias name survives, theme implementation/global reset do not.','packages/ui/src/theme/AppThemeProvider.tsx','docs/developer/react-aria-theme.md'),
('class-names','preserved','Class-prefixed public names remain. New translated Course factories do not require renaming existing imports.','packages/ui/src/components/AdminDataGridOptions.ts','docs/developer/react-aria-grid-presets.md'),
('image-schema','preserved-with-behavior-policy-change','ImageNode version 1 src/altText/width/height/assetId/assetVersionId fields survive; unsafe address display policy is stricter. Hosts must review document behavior; no field-schema removal inferred.','packages/ui/src/components/PageRichTextEditorSection/lexical/ImageNode.tsx','docs/developer/react-aria-editor-section.md'),
('new-footer-model','additive','Optional atomic onPaginationModelChange supersedes legacy calls; legacy callback props remain required by declarations. Unknown totals/hasNextPage are additions.','packages/ui/src/components/CardPaginationFooter/CardPaginationFooter.tsx','docs/developer/react-aria-card-pagination.md'),
('availability-composition','behavior-fix-current-delta','DatePicker availability reaches DateField text/segment validity; BUG-0008 disabled/readOnly transactions and BUG-0012 composed availability use coordinator exact-input receipts, not old API snapshot runtime evidence.','packages/ui/src/experimental/DatePicker/DatePicker.tsx','docs/developer/react-aria-calendar-contracts.md')]
for id,kind,delta,source,guide in extra:rows.append(dict(id=id,classification=kind,beforeAfter=delta,source=source,guide=guide))
for r in rows:
 r['sourceSha256']=hash(read(r['source']));r['guideSha256']=hash(read(r['guide']));r['guidePatch']='consumer-guide.patch' if r['guide'] in json.loads((out/'patch-inputs.json').read_text()) else None
 r['observedHistory']=subprocess.check_output(['git','log','-3','--format=%H%x09%s','--',r['source']],cwd=root,text=True).splitlines()
 try:r['sourceMatchesHEAD']=hash(subprocess.check_output(['git','show','HEAD:'+r['source']],cwd=root,text=True))==r['sourceSha256']
 except subprocess.CalledProcessError:r['sourceMatchesHEAD']=False
 r['releaseDecision']='No incompatible-change marker needed for this preserved/additive row alone; evaluate any accompanying behavior change.' if r['classification'] in ['preserved','additive'] else 'Use ! or BREAKING CHANGE footer for intentional incompatibility in a released contract. Extraction comparison alone does not prove a published version boundary.'
 if r['id']=='action-name':r['releaseDecision']='Pre-first-release consolidation per AGENTS.md; supply AppButton/AppButtonProps -> Button/ButtonProps and /components/AppButton -> /components/Button migration, without asserting that a published major boundary existed.'
 r['actualCommitCoverageVerified']=False
 r['proposedIntegrationTitle']='feat!: replace extracted foundation with owned public contracts' if r['classification']=='incompatible-relative-to-initial-extraction' else None
 r['proposedBreakingFooter']=('BREAKING CHANGE: '+r['beforeAfter']+' See '+r['guide']+'.') if r['proposedIntegrationTitle'] else None
 r['residual']='Coordinator joins final integrated changes to actual release-range commits/squash title; this report does not rewrite history or authorize release.'
(out/'breaking-change-map.json').write_text(json.dumps({'baseline':s['receipt']['historicalCommit'],'baselineMeaning':'Initial local extraction, not established published version.','reusedSnapshotSha256':hash((base/'parallel-01/api-snapshot.json').read_text()),'observedHeadTitle':old['observedHeadTitle'],'exhaustive':False,'approved':False,'records':rows,'unresolved':['Historical upstream inherited declarations at locked versions are not available in the retained snapshot; original API bags are not exhaustively reconstructed.','Actual final integration/squash commits and release range do not exist for these unapplied guide changes.','Some symbols are additive relative to extraction, rather than descendants of a historical contract. Do not force one-to-one matching.']},indent=2)+'\n')
deltas=[]
for p,entry in s['declarations'].items():
 current=read(p)
 if hash(current)!=entry['sha256']:
  diff=''.join(difflib.unified_diff(entry['text'].splitlines(True),current.splitlines(True),fromfile='snapshot/'+p,tofile='current/'+p))
  verdict='private helper export is additive inside an internal declaration file; saved public route closure is unchanged' if p.endswith('ownedGridModel.d.ts') else 'documentation-only JSDoc correction; property signature unchanged' if p.endswith('DateField.d.ts') else 'equivalent type-only import syntax; no owned prop/signature change'
  deltas.append(dict(file=p,snapshot=entry['sha256'],current=hash(current),verdict=verdict,diff=diff))
(out/'declaration-deltas.json').write_text(json.dumps(deltas,indent=2)+'\n')
print(f'{len(rows)} concrete migration/release dispositions; {len(deltas)} declaration deltas')
