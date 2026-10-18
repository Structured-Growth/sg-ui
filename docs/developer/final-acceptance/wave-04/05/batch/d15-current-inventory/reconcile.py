from pathlib import Path
import json,re,hashlib,copy
root=Path('/Users/thomashall/Repositories/sg-ui');task=root/'docs/developer/final-acceptance/wave-04/05/batch/d15-current-inventory'
api=json.loads((root/'apps/docs/content/component-api.json').read_text());historic=json.loads((root/'docs/developer/final-acceptance/wave-03-08/state-matrix.json').read_text());previous={r['name']:r for r in historic['rows']};states=historic['states'];guide=root/'docs/developer/react-aria-state-applicability.md';text=guide.read_text()
short={'A':'applicable','C':'composed','H':'host-driven','—':'N/A'};back={v:k for k,v in short.items()};current={}
for line in text.splitlines():
 match=re.match(r'\| \[([^]]+)\]\([^)]*\) \| (.*) \|$',line)
 if match and len(match[2].split(' | '))==11:current[match[1]]=dict(zip(states,[short[c] for c in match[2].split(' | ')]))
changes={};notes={};basis={}
def override(name,**cells):
 changes.setdefault(name,{}).update(cells)
def explain(name,note):notes[name]=note
def props(name,**cells):basis.setdefault(name,{}).update(cells)
for name in ['Progress','CircularProgress','LinearProgress','AppInlineProgress','Avatar','AppOperationSteps']:
 override(name,hover='N/A',focus='N/A',pressed='N/A')
 explain(name,'Passive presentation: no owned action, hover or focus target. Progress value/indeterminate lifecycle, Avatar image fallback and operation-step status must not manufacture interactive props.')
override('Avatar',loading='applicable');props('Avatar',loading=['src'],empty=['src','fallback'],error=['src','fallback'])
override('AppOperationSteps',pending='host-driven',loading='composed',error='host-driven');props('AppOperationSteps',pending=['steps[].status'],loading=['steps[].status'],error=['steps[].status'])
override('Breadcrumbs',hover='composed',focus='composed',pressed='composed',selected='applicable');props('Breadcrumbs',selected=['items']);explain('Breadcrumbs','Owned ancestor Links supply interaction. The last item is current text by position and aria-current=page; it is not another selected action.')
override('Navigation',disabled='N/A');explain('Navigation','A named nav container accepts arbitrary host children; it has no root disabled contract. NavigationItem has its own current/link policy.')
override('NavigationItem',disabled='N/A');explain('NavigationItem','Native Link has current plus routing, without an owned disabled prop or disabled-item model; do not infer a disabled contract from arbitrary aria-* attributes.')
override('AppModal',disabled='composed',pending='composed');props('AppModal',disabled=['primaryAction','secondaryAction'],pending=['primaryAction','secondaryAction'])
for name in ['PeriodPicker','DateTimeRangePicker','DateRangeComparisonPicker']:
 override(name,invalid='composed',error='composed');props(name,invalid=['required','value'],error=['required','value']);explain(name,'Derived validation is supplied by the shipped date/time/range fields and FieldMessages, even without a top-level invalid prop. Empty field values do not imply an owned no-results/query state.')
override('DateRangeSelector',invalid='applicable',error='applicable');props('DateRangeSelector',invalid=['value','required','min','max','rangeLength'],error=['value','required','min','max','rangeLength'])
for name in ['RichTextFormattingToolbar','DocumentEditorToolbar','FloatingTextSelectionToolbar']:
 override(name,selected='composed');explain(name,'Owned formatting actions expose persistent aria-pressed values separately from transient Button press. Selected actions retain an inset structural marker; mixed rich formatting retains its distinct dashed border. Other composed selects retain selected labels.')
override('RichTextFormattingToolbar',disabled='composed');props('RichTextFormattingToolbar',selected=['boldActive','italicActive','underlineActive','codeActive'],disabled=['disabledControls','disabledControlSets'])
override('DocumentEditorToolbar',disabled='composed');props('DocumentEditorToolbar',selected=['actions','headingValue'],disabled=['canEdit','actions'])
props('FloatingTextSelectionToolbar',selected=['context: Lexical selection formatting'])
override('PageRichTextEditorSection',selected='composed');props('PageRichTextEditorSection',selected=['lexicalValue']);explain('PageRichTextEditorSection','Fixed owned formatting/table selection descendants supply selected state; the document itself is not a toggle. Read-only is the existing editor contract. No arbitrary host plugin or spoken-AT result is inferred.')
override('TextStyleMenuControl',selected='composed');props('TextStyleMenuControl',selected=['activeStyles'])
override('ColumnsLayoutModal',selected='composed');explain('ColumnsLayoutModal','Its fixed preset RadioGroup has a selected draft, native checked semantics and a structural radio indicator; selection is not host persistence.')
override('LinkUrlModal',invalid='composed',error='composed');explain('LinkUrlModal','The URL draft is validated with useful field feedback before submit. No new invalid/error prop is invented.')
override('ImageUploadModal',disabled='composed',pending='composed',loading='host-driven');props('ImageUploadModal',disabled=['uploading'],pending=['uploading'],loading=['uploading']);explain('ImageUploadModal','Host uploading supplies pending action/availability and operation state; named errors remain host-provided. This is not an internal upload/persistence service.')
override('CardCollectionWithFooter',hover='composed',focus='composed',pressed='composed',disabled='composed');props('CardCollectionWithFooter',disabled=['loading']);explain('CardCollectionWithFooter','The owned pagination footer supplies actions and is disabled during loading. Host-rendered cards remain host-owned; grid Status supplies named loading/empty content.')
for name in ['AppDataGrid','AppDataGridShell','LearnerClassesDataGrid','DataGrid']:
 override(name,disabled='composed');explain(name,'Busy/availability rules disable owned toolbar, pagination and row/column actions where specified. There is no invented whole-grid disabled/readOnly prop. Checkboxes and selection count supply non-color row selection; host error/retry and loading remain distinct.')
override('AppDataGridShell',hover='composed',focus='composed',pressed='composed')
override('RowSubHeader',hover='composed');explain('RowSubHeader','The optional owned expand/collapse button supplies interaction; arbitrary trailingContent remains host-owned. Expansion is indicated by its chevron/content contract, not a selected-value prop.')
override('Pagination',empty='applicable');props('Pagination',empty=['pageCount']);explain('Pagination','Page count zero has an explicit No pages message. Current page is position text, not a selected-page-button API. Optional native page-size select and owned navigation buttons retain their own interaction policies.')
override('AppPaginationFooter',empty='composed')
for name in ['TextField','TextArea','DateField','TimeField']:
 explain(name,'The input keeps its resting boundary on hover; labels/caret and explicit focus outline identify editing. There is no separate owned hover/pressed paint state or data-query empty/loading state. Native invalid/readOnly/disabled and useful field feedback remain applicable.')
override('AppPageHeader',selected='composed');props('AppPageHeader',selected=['breadcrumbs'])
override('SideNavigation',pending='composed',error='host-driven');props('SideNavigation',pending=['onOrganizationChange','context: account adapter promises'],error=['onOrganizationChange','context: account adapter promises']);explain('SideNavigation','Owned async account operations retain original menu labels/locked callbacks, show named Button pending progress and useful retryable errors. No root loading/error prop is invented; current native routes use a structural start bar.')
override('EditableTitleField',pending='applicable',invalid='composed',error='composed');props('EditableTitleField',pending=['onSave'],invalid=['onSave'],error=['onSave']);explain('EditableTitleField','Async onSave uses a readable Saving title description and blocks edits until settlement; rejection retains draft and meaningful invalid/error feedback. Empty or unchanged drafts retain the existing cancel/no-commit contract.')
override('ContentEditorChrome',disabled='composed',readOnly='composed',pending='composed',invalid='composed',error='composed');props('ContentEditorChrome',disabled=['menuItems','titleReadOnly'],readOnly=['titleReadOnly'],pending=['menuItems','onTitleSave'],invalid=['onTitleSave'],error=['onTitleSave']);explain('ContentEditorChrome','Fixed owned title field and action Buttons provide read-only, pending, disabled and save-failure feedback. Arbitrary rightSlot content is still host-owned.')
override('TextColorPickerControl',invalid='composed',error='composed');props('TextColorPickerControl',invalid=['value'],error=['value']);explain('TextColorPickerControl','The local hex draft validates before commit and supplies associated error text; selected preset border is distinct from outer focus and decorative color data.')
override('PageRichTextEditorSection',error='composed',pending='composed',loading='host-driven');props('PageRichTextEditorSection',error=['lexicalValue','onUploadImage'],pending=['onUploadImage'],loading=['onUploadImage']);explain('PageRichTextEditorSection','Fixed owned formatting/table selection, rejected-document/paste status and host-upload dialog supply the existing states. Uploads are host-owned; arbitrary consumer plugins and spoken output are outside this inventory.')
selected={
 'Tabs':'Selected tab has its indicator bar and corresponding panel; focus is separate.',
 'AppPageTabs':'Composed Tabs indicator/panel and current tab semantics; host owns value.',
 'Menu':'Check glyph and item checked/selection semantics are separate from active focus.',
 'ListItemButton':'Double start border and aria-pressed; focus outline remains independent.',
 'NavigationItem':'Double start border and aria-current=page; keyboard outline remains independent.',
 'AppPageHeader':'Fixed breadcrumb current text/position is composed when supplied; action menus retain their own contracts.',
 'Breadcrumbs':'Final item position and current text/aria-current distinguish it from ancestor Links.',
 'Select':'The selected option label remains in the field, independently from popup focus.',
 'ComboBox':'Selected field content remains visible independently from active option focus.',
 'Autocomplete':'Alias of ComboBox; retains the same selected field content and ownership.',
 'AsyncMultiSelect':'Selected labels are removable tokens and selected results have check glyphs.',
 'Checkbox':'Check or mixed dash is visible with native checked semantics.',
 'Switch':'Thumb position changes with checked state, independently from focus outline.',
 'RadioGroup':'Thick inner indicator ring marks checked option, independently from focus.',
 'ToggleButton':'Double border with compensated padding exposes selected geometry without changing outer box. Forced selected+hovered stays on system colors with automatic adjustment enabled.',
 'ToggleButtonGroup':'Same owned ToggleButton selected geometry, shared group selection policy.',
 'Calendar':'Single selected date retains an inset outline, independently from keyboard focus.',
 'DatePicker':'Chosen date text and composed Calendar selection; not another toggle root.',
 'DateRangePicker':'Accepted range text, selected range boundary shape and typed endpoints as configured.',
 'DateRangeSelector':'Range boundary shape/preset weight and draft/value content; active endpoint and inline adjustment operation buttons reuse the selected period-choice ring.',
 'PeriodPicker':'Selected period is represented by value text and composed choices. Inline quarter choices now expose aria-pressed and reuse the structural period-choice ring.',
 'DateTimeRangePicker':'Named start/end date-time content with composed date/range choices distinguishes persisted value from focus.',
 'DateRangeComparisonPicker':'Named primary/comparison range text and checked comparison controls expose selection without a color-only root.',
 'MonthPicker':'Inset selected-choice ring with aria-pressed, independently from Button focus.',
 'YearPicker':'Same selected-choice ring in scroll and paged branches; text-entry value is ordinary field content.',
 'HierarchicalMenu':'Persistent double start bar on current native link/button/item, independently from focus.',
 'IconPanelNavigation':'Expanded named panel content/position corresponds to the aria-expanded rail action; do not invent a second selected prop.',
 'ExperiencePageNavigator':'Existing visible Active caption and aria-current identify the current page. The apparent color-only gap was rejected after full source review; no redundant marker is added.',
 'SideNavigation':'Current native route retains a double start bar with current semantics; branch expansion uses content/chevrons separately.',
 'RichTextFormattingToolbar':'True formatting actions have inset selected rings; mixed uses its separate dashed border. Select values show selected text.',
 'DocumentEditorToolbar':'Active formatting actions have inset rings; heading select retains current text.',
 'FloatingTextSelectionToolbar':'Lexical-derived active formatting buttons have inset rings with aria-pressed.',
 'PageRichTextEditorSection':'Owned formatting buttons retain their selected markers; table-cell selection has its owned visible outline and Lexical selection model.',
 'TextAlignMenuControl':'Current alignment icon/content and Menu check glyph expose the selected alignment.',
 'TextColorPickerControl':'Selected preset retains a double border; outer outline belongs only to focus. Decorative color-data fill remains separate.',
 'TextStyleMenuControl':'activeStyles marks checked Menu items with the existing check glyph; absent activeStyles means commands.',
 'ColumnsLayoutModal':'The selected preset has a native checked radio indicator in the owned draft RadioGroup.',
 'DataToolbar':'Selection count is readable text; view-mode ToggleButtons retain double selected borders. Fixed Menu/Select descendants own their selected indicators.',
 'DataToolbarSelectionMenu':'All/some selection is a check/mixed indicator with labels and count ownership.',
 'AppDataGrid':'Selected rows have checkboxes and readable selected count; drag focus is separate.',
 'AppDataGridShell':'Composed grid checkbox/count indicators; wrapper does not invent another selected visual.',
 'LearnerClassesDataGrid':'Composed AppDataGrid checkbox/count indicators and host-owned selection.',
 'DataGrid':'Selected rows retain checkbox glyphs and readable count independently from grid focus.',
}
new_sources={'FormFieldScope':['packages/ui/src/experimental/FormFieldScope/FormFieldScope.tsx'],'MonthPicker':['packages/ui/src/experimental/MonthPicker/MonthPicker.tsx'],'YearPicker':['packages/ui/src/experimental/YearPicker/YearPicker.tsx'],'HierarchicalMenu':['packages/ui/src/experimental/HierarchicalMenu/HierarchicalMenu.tsx']}
rows=[];deltas=[];all_sources={}
for slug,contracts in api.items():
 for contract in contracts:
  for name in contract['names']:
   old=previous.get(name);status=copy.deepcopy(current.get(name,{s:'N/A' for s in states}));status.update(changes.get(name,{}))
   if contract['kind']!='component' or slug=='icons':status={s:'N/A' for s in states}
   sources=(old or {}).get('source') or new_sources.get(name,[])
   assert sources,('unresolved',name)
   source=list(sources)
   if slug!='icons':
    for path in sources:
     parent=(root/path).parent
     for p in parent.glob('*'):
      if p.suffix in ['.tsx','.ts','.css'] and '.test.' not in p.name and '.native-fixture' not in p.name:source.append(str(p.relative_to(root)))
   for path in list(source):
    if path.endswith(('.tsx','.ts','.css')):
     body=(root/path).read_text()
     for relative_path in re.findall(r'from\s+[\"\']([^\"\']+\.module\.css)[\"\']',body):
      target=(root/path).parent/relative_path
      if target.is_file():source.append(str(target.resolve().relative_to(root)))
   source=sorted(set(source));hashes={path:hashlib.sha256((root/path).read_bytes()).hexdigest() for path in source}
   all_sources.update(hashes)
   cells={}
   for state in states:
    applicability=status[state]
    if applicability=='N/A':design='No distinct owned '+state+' state on this public part; arbitrary host children/native attributes do not manufacture a new state API.'
    elif state=='selected':assert name in selected,('missing selected policy',name);design=selected[name]
    else:design=(old or {}).get('states',{}).get(state,{}).get('design') or {'hover':'Temporary child action feedback; labels and action discovery persist without hover.','focus':'Existing independent visible focus on the actual child target.','pressed':'Transient native activation, separate from persistent selected value.','disabled':'Owned availability blocks applicable child interactions while preserving labels.','readOnly':'Readable value remains; only supported edits are blocked.','invalid':'Useful associated validation feedback is supplied by the owned fields/derived draft validator.','pending':'Named in-flight operation/action content; no internal persistence is implied.','empty':'Named empty/no-results content where the shipped contract supplies it.','loading':'Named loading/progress lifecycle, distinct from empty/error.','error':'Useful error/fallback content; host retry only where supported.'}[state]
    if name in changes and state in changes[name] and state!='selected' and applicability!='N/A':design={'composed':'Fixed owned descendants supply this '+state+' contract; no new root prop is invented.','host-driven':'Existing host content/status contract supplies '+state+' meaning; no internal query/persistence or extra flag is implied.','applicable':'The current shipped source supplies this '+state+' contract, including derived validation/lifecycle where noted.'}[applicability]
    direct={'disabled':['disabled'],'readOnly':['readOnly','titleReadOnly'],'invalid':['invalid'],'pending':['loading','uploading'],'loading':['loading','uploading','src'],'empty':['emptyContent','emptyMessage','pageCount'],'error':['errorMessage','onRetry'],'selected':['selected','checked','value','activeId','activePageKey','current','activeStyles']}.get(state,[])
    direct=[key for key in direct if key in {p['name'] for p in contract['props']}]
    cells[state]={'applicability':applicability,'design':design,'basis':basis.get(name,{}).get(state,direct),'evidenceLevel':'source/design; referenced tests are not a new runtime pass'}
   row={'name':name,'slug':slug,'kind':contract['kind'],'publicImport':contract['from'],'publicProps':[{'name':p['name'],'type':p['type']} for p in contract['props']],'states':cells,'notes':notes.get(name,(old or {}).get('notes','Owned child state only; no public root action is invented.')),'source':source,'sourceHashes':hashes,'referenceTests':sorted(set((old or {}).get('referenceTests',[])+[str(test.relative_to(root)) for path in sources for test in (root/path).parent.glob('*.test.tsx')])),'composedPublicParts':(old or {}).get('composedPublicParts',[]),'example':'/docs/components/'+slug}
   if old:
    for state in states:
     before=old['states'][state]['applicability']
     if before!=status[state]:deltas.append({'name':name,'state':state,'historical':before,'current':status[state]})
   else:deltas.append({'name':name,'change':'new current public part'})
   rows.append(row)
assert len(rows)==218 and len({r['name'] for r in rows})==218
for r in rows:assert set(r['states'])==set(states)
output={'scope':'Current 218 public names; all eleven D15 design/applicability dispositions, not all-library runtime conformance.','states':states,'currentAPISha256':hashlib.sha256((root/'apps/docs/content/component-api.json').read_bytes()).hexdigest(),'historicalMatrix':'final-acceptance/wave-03-08/state-matrix.json','rows':rows,'runtimeBoundaries':['X06 interaction/accessibility conformance remains separate','X07 target geometry/physical touch remains separate','X11 actual/manual spoken output remains separate'],'changesFromHistorical':deltas}
(root/'docs/developer/react-aria-state-matrix.json').write_text(json.dumps(output,indent=2)+'\n')
start=text.index('| [AppModal]');end=text.index('\n## Concrete indicators',start);table='';icons_done=False
for row in rows:
 if row['slug']=='icons' and row['kind']=='component':
  if icons_done:continue
  icons_done=True;label='All named SVG icon exports (individual rows in current JSON)'
 else:label=row['name']
 table+='| ['+label+']('+row['example']+') | '+' | '.join(back[row['states'][state]['applicability']] for state in states)+' |\n'
text=text[:start]+table+text[end:]
text=text.replace('The catalogued API snapshot, complete per-state\nrationale and exact source/test paths are preserved in the wave-03-08\n[state-matrix.json](final-acceptance/wave-03-08/state-matrix.json); test references are existing case locations, not new passes.','The current API join, per-state rationale and exact source hashes are in the\n[current state matrix](react-aria-state-matrix.json). The wave-03-08\n[historical matrix](final-acceptance/wave-03-08/state-matrix.json) remains dated evidence;\nreference test paths identify cases, not fresh runtime passes.')
guide.write_text(text)
(task/'reconciliation.json').write_text(json.dumps({'names':len(rows),'stateCells':len(rows)*len(states),'historicalNames':len(previous),'newNames':sorted(set(r['name'] for r in rows)-set(previous)),'removedNames':sorted(set(previous)-set(r['name'] for r in rows)),'changedStateDispositions':deltas,'sourceHashes':all_sources,'publicAPISha256':output['currentAPISha256']},indent=2)+'\n')
print(json.dumps({'publicNames':len(rows),'stateCells':len(rows)*11,'sourceFiles':len(all_sources),'dispositionChanges':len(deltas)},indent=2))
