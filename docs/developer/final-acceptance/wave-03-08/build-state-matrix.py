from pathlib import Path
import json,re,hashlib
root=Path(__file__).resolve().parents[4]; out=Path(__file__).resolve().parent
api=json.loads((root/'apps/docs/content/component-api.json').read_text()); composition=json.loads((root/'apps/docs/content/component-composition.json').read_text())
sourcefiles=[p for p in (root/'packages/ui/src').rglob('*') if p.suffix in ['.ts','.tsx'] and not any(x in p.name for x in ['test','fixture','generated'])]
texts={p:p.read_text() for p in sourcefiles}
def sources(name):
 alias={'AppThemeProvider':'Provider','Autocomplete':'ComboBox','RowSubHeader':'OwnedGridRowSubHeader'}
 if name=='SGLink': return ['packages/ui/src/adapters/Link.tsx']
 n=alias.get(name,name)
 found=[p for p,t in texts.items() if re.search(r'export\s+(?:async\s+)?(?:const|function|class)\s+'+re.escape(n)+r'\b',t)]
 return [str(p.relative_to(root)) for p in found]
states=['hover','focus','pressed','selected','disabled','readOnly','invalid','pending','empty','loading','error']
def cell(status,detail):return {'applicability':status,'design':detail}
def make(slug,name,e,src):
 props={p['name'] for p in e['props']}
 d={s:cell('N/A',f'No owned {s} contract on this part; do not invent a prop or visual state.') for s in states}
 presentation={'typography','box','stack','surface','card','divider','chip','badge','table','provider','theme-scope','navigation-provider','account-provider','translation-provider','auth-shell','app-shell','document-editor-layout','card-frame','row-subheader','collapse','data-grid-shell'}
 present_names={'List','ListItem','ListItemText','ListItemIcon','Navigation','CardContent','Table','TableCaption','TableHead','TableBody','TableFoot','TableRow','TableCell','TableHeaderCell','ButtonGroup','Breadcrumbs'}
 utilities=e['kind']!='component'
 ispresent=slug in presentation or name in present_names or slug=='icons'
 if utilities:return d,'Pure helper/function; no rendered state. The consuming component owns indicators.'
 if not ispresent:
  for s in ['hover','pressed']:d[s]=cell('composed' if slug in {'tabs','page-tabs','menu','pagination','side-navigation','icon-panel-navigation'} else 'applicable','Transient interaction on owned action/option, distinct from persistent selection; preserve native activation and callback boundaries.')
  d['focus']=cell('applicable','Keyboard-visible outline on the actual interactive descendant; restore focus for overlay dismissal and preserve it inside scrollports.')
 if any(p in props for p in ['selected','selectedIds','checked','current','selectionMode','activePageKey','activeId','selection','selectionState','selectedCount','viewMode']) or slug in {'tabs','page-tabs','select','combo-box','async-multi-select','radio-group','calendar','date-picker','date-range-picker','date-range-selector','period-picker','date-time-range-picker','date-range-comparison-picker','side-navigation','icon-panel-navigation','processing-grid','app-data-grid','learner-grid','text-align-menu-control','text-color-picker-control'}:
  d['selected']=cell('applicable','Persisted value/current item comes from the owned callback contract; distinct from focus. See indicators and visual successors below.')
 if 'disabled' in props:
  d['disabled']=cell('applicable','Native/Aria disabled state blocks owned edits/actions; disable relevant descendants, preserve labels. Forced colors retain system disabled text; opacity is supplementary.')
 elif slug in {'tabs','page-tabs','menu','navigation','side-navigation','data-toolbar','selection-menu'}:
  d['disabled']=cell('composed','Availability is per item/child contract, not an invented root disabled prop; skip unavailable actions as specified by the child.')
 if 'readOnly' in props:
  d['readOnly']=cell('applicable','Retain host value and prevent edits using this component’s specific contract; not interchangeable with disabled. Form fields preserve submission; composite trigger/navigation policy needs its own reference.')
 if 'invalid' in props:
  d['invalid']=cell('applicable','Explicit invalid/native validation plus associated errorMessage; a red border alone is insufficient. Host supplies a useful error message; preserve native validation timing.')
 if 'loading' in props:
  if slug in {'button','icon-button','split-action'} or name=='ListItemButton':d['pending']=cell('applicable','Named Pending progress indicator while activation is suppressed; retain action name. Button stays focusable unless disabled; SplitAction also blocks/dismisses its secondary menu.')
  else:d['loading']=cell('applicable','Host-owned loading flag renders busy/status content; retain page/filter/query ownership and do not imply persistence or fetching inside the component.')
 if slug in {'progress','inline-progress','operation-steps'}:
  d['loading']=cell('applicable','Named progress/value or operation-step text communicates work independently of color. Indeterminate progress retains its name when reduced motion stops animation.')
 if any(p in props for p in ['emptyMessage','emptyContent','emptyState']) or slug in {'select','combo-box','async-multi-select','search-field','tag-group','app-data-grid','processing-grid','learner-grid','data-grid-shell','card-collection'}:
  d['empty']=cell('applicable','Use meaningful empty/no-results content. Empty is distinct from loading/error; do not fabricate rows/options. Select does not open an empty popup; editable query controls retain their query policy.')
 if 'errorMessage' in props:
  d['error']=cell('applicable' if 'invalid' in props else 'host-driven','Associated validation text or host operation error text, according to the public contract; retry is available only when the API supplies onRetry. Do not encode failure in color alone.')
 if slug in {'owned-dialog','dialog','popover','columns-layout-modal','image-upload-modal','link-url-modal','page-header','data-toolbar','document-editor-toolbar','content-editor-chrome','rich-text-formatting-toolbar','floating-text-selection-toolbar','instructor-card','learner-card','experience-page-navigator'}:
  for s in ['hover','focus','pressed']:d[s]=cell('composed','Owned Button/Menu/field/navigation descendants supply this state; container itself is not an extra focus target. Host-provided slots retain host ownership.')
 if ispresent:
  for s in ['hover','focus','pressed']:
   d[s]=cell('N/A','Presentation/scope/container part has no built-in activation; actual interactive children own this state. Native focusability added by a host does not create a library action API.')
 # Specific field policies: field editing is not a pressed or hover command state.
 if slug in {'text-field','text-area','date-field','time-field'}:
  d['hover']=cell('N/A','Editable field retains its ordinary boundary on pointer hover; editing/focus and validation carry meaning, with no separate hover decoration required.')
  d['pressed']=cell('N/A','Native editing/segment selection rather than an action press; do not add action pressed styling.')
  d['focus']=cell('applicable','Undecorated input uses its focus outline; decorated TextField/TextArea moves the outline to the enclosing control. Descriptions/errors remain associated with the native input.')
 if slug=='tooltip':
  d['hover']=cell('composed','Hovering the named trigger opens supplementary text after delay; trigger semantics and label stay intact.')
  d['focus']=cell('composed','Keyboard focus remains on the trigger with its normal focus ring; tooltip text supplies a description, never an interactive focus target.')
  d['pressed']=cell('N/A','Tooltip itself has no press action; the supplied trigger owns its command.')
  d['disabled']=cell('applicable','Disables tooltip presentation, not the trigger action. Host disables the actual trigger independently when needed.')
 if slug=='operation-steps':
  d['pending']=cell('applicable','A pending step is waiting, distinct from an action Button pending state; translated status suffix describes it.')
  d['error']=cell('applicable','Error step uses Close glyph and translated Error suffix; completed uses Check, in-progress named Progress. Color supplements these indicators.')
 if slug=='experience-page-navigator':
  d['readOnly']=cell('applicable','Blocks add/remove/rename/reorder edits while retaining page selection and readable host titles; not a blanket disabled navigator.')
 if slug in {'period-picker','date-time-range-picker','date-range-comparison-picker'}:
  d['readOnly']=cell('applicable','Preserve applied host values; block edits throughout trigger/preset/draft controls according to the wrapper contract. No asynchronous loading flag is implied.')
 if slug=='status':
  d={s:cell('N/A','Presentational message has no editable/action/selection state.') for s in states}
  for s in ['pending','empty','loading','error']:d[s]=cell('host-driven','Host supplies meaningful text. announcement=polite adds status; assertive adds alert; off avoids redundant announcements. Tone alone does not name the condition.')
 if slug=='avatar':
  d['error']=cell('applicable','Failed/missing image falls back to initials or placeholder while preserving supplied alt semantics; no interactive retry contract.')
  d['empty']=cell('applicable','Fallback initials/placeholder, not an empty unlabeled image; decorative images may have empty alt intentionally.')
 if slug=='row-subheader':
  d['focus']=cell('composed','Optional collapse action is a Button; header text remains presentation.')
  d['pressed']=cell('composed','Optional collapse Button owns transient press; expanded is disclosed with aria-expanded, not color alone.')
 if slug=='icons':
  for s in states:d[s]=cell('N/A','SVG content is not an action/state machine. Label meaningful standalone graphics; decorative icons are aria-hidden; name the containing action.')
 notes='State definitions are source-contract applicability, not native/AT results. Unsupported states are N/A on this part, not on arbitrary host children.'
 return d,notes
rows=[]
for slug,entries in api.items():
 for e in entries:
  for name in e['names']:
   src=sources(name); state,notes=make(slug,name,e,src)
   tests=[]
   for s in src:
    p=root/s
    tests += [str(t.relative_to(root)) for t in p.parent.glob('*.test.ts*') if not 'native-fixture' in t.name]
   children=next((x['children'] for x in composition.get(slug,[]) if x['name']==name),[])
   rows.append({'name':name,'slug':slug,'kind':e['kind'],'publicImport':e['from'],'states':state,'notes':notes,'source':src,'referenceTests':sorted(set(tests)),'example':'/docs/components/'+slug,'composedPublicParts':[x['name'] for x in children]})
(out/'state-matrix.json').write_text(json.dumps({'scope':'Catalogued public components, aliases, compound parts and helpers. Per-state source design applicability, not passing runtime evidence.','states':states,'rows':rows},indent=2)+'\n')
print('Matrix:',len(rows),'named public rows;',len(api),'routes; missing source:',[r['name'] for r in rows if not r['source']])
# Each row includes its own full state mapping in JSON; compact human table groups only identical aliases/icons.
md='''# Public state applicability and design contract

A-D-15: this is a source-backed design matrix, not an all-library conformance
receipt. Each public part below has all eleven states accounted for. Aliases keep
the implementation's policy; compound children have separate rows. Arbitrary
host-supplied children do not become fixed implementation children.

A = applicable owned state; C = composed child/item state; H = host-driven message
or operation state; — = no owned contract (N/A). N/A means no supported state on
that part: do not invent props. Layout, typography, scopes, pure helpers and
standalone decorative SVGs have no built-in action state. They may contain
host-owned interactive content. The catalogued API snapshot, complete per-state
rationale and exact source/test paths are preserved in the wave-03-08
[state-matrix.json](final-acceptance/wave-03-08/state-matrix.json); test references are existing case locations, not new passes.

## Required indicators

| State | Design and non-color requirement |
| --- | --- |
| Hover | Temporary interaction feedback, never the only way to discover an action; names and native target remain available without hover. |
| Focus | Visible outline independent of selection; actual interactive target retains focus, with decorated input outline on its enclosing boundary. Portals inherit scope and scrollports must reveal the ring. |
| Pressed | Temporary activation; Button's data-pressed is not a persisted toggle value. Neutral filled press and hover intentionally share subtle background; primary fill shares its hover/press background. |
| Selected | Persisted native checked/aria-selected/aria-pressed/aria-current state plus a visible shape, position, glyph, weight or content indicator. ARIA alone does not meet the visual non-color criterion. |
| Disabled | Native/Aria disabled interaction and blocked callbacks, retaining labels. Disabled is availability, not a validation error. Opacity/GrayText supplement semantics. |
| Read-only | Host value remains readable and edits are blocked; submission and trigger/navigation policies depend on the actual field/composite contract. Do not assume disabled Tab-order behavior. |
| Invalid | Associated useful error text and invalid/native validation semantics; color border alone is insufficient. Host supplies errorMessage where required. Date/time text feedback preserves commit/blur timing. |
| Pending | Named in-flight action indicator, original action label and blocked activation; pending Button remains focusable unless explicitly disabled. |
| Empty | Meaningful empty/no-results message distinct from loading/error. Empty Select does not open an empty popup; query controls retain their own editable-query policy. |
| Loading | Named busy/progress/status content; host owns query, data, page and persistence. Previous-data rendering follows the component contract. |
| Error | Field error text or named operation failure with host retry where supported; never just a danger tone. |

## Applicability per public part

Columns use the state order hover, focus, pressed, selected, disabled, read-only,
invalid, pending, empty, loading, error. Links point to the source-backed public
examples; source owners and exact reference tests are in the machine matrix.

| Public part | Hov | Foc | Press | Sel | Dis | RO | Inv | Pend | Empty | Load | Error |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
'''
icons_done=False
for r in rows:
 if r['slug']=='icons' and r['kind']=='component':
  if icons_done:continue
  icons_done=True; label='All named SVG icon exports (individual rows in JSON)'
 else: label=r['name']
 chars={'applicable':'A','composed':'C','host-driven':'H','N/A':'—'}
 md+='| ['+label+'](/docs/components/'+r['slug']+') | '+' | '.join(chars[r['states'][s]['applicability']] for s in states)+' |\n'
md+='''
## Concrete indicators and retained evidence

- Button/IconButton/SplitAction: native activation and disabled semantics; named
  pending progress. `Button.public-contract.test.tsx` covers activation, ref,
  pending focus and native submit. `SplitAction.test.tsx` covers independent
  callbacks, blocked menu opening and dismissal on host disabling/loading.
- Checkbox has a check/mixed dash; RadioGroup changes the indicator to a thick
  inner ring; Switch moves its thumb. Labels and checked semantics accompany them.
  Their colocated tests cover the field contract; this is not spoken-AT output.
- Menu and AsyncMultiSelect show selected check glyphs; the latter keeps selected
  labels as removable tokens, named loading/error/no-results status and host retry.
  Select/ComboBox preserve selected text in the field, separate from popup focus.
- Tabs/AppPageTabs expose a selected panel and current tab semantics. Date range
  presets use selected weight; endpoints have range shape and draft/value text.
  Calendar selection additionally needs the visual check identified below.
- TextField/TextArea attach descriptions/errors and invalid state to native fields.
  The integrated BUG-0009 TextArea puts decorated focus on the outer boundary.
  `coordinator-fixes/evidence.json` records 31 affected unit cases and four native
  cases per desktop engine for BUG-0008/0009; `coordinator-integration/evidence.json`
  records the subsequent seven-case-per-engine scope including picker policies.
  Retain only receipts with matching implementation/test hashes; do not sum these
  overlapping runs or claim every state was exercised.
- PeriodPicker/DateTimeRangePicker/DateRangeComparisonPicker now propagate disabled
  to interactive descendants (BUG-0008). Their named trigger/value and draft
  transaction remain separate from pending/loading. Current hashes must match
  the integration receipt before retaining those cases.
- DataGrid/AppDataGrid/shell/learner grids use busy/status, empty and operation-error
  content with optional host retry; selected rows also expose checkboxes. Collection
  loading/empty content and pagination remain host data/page decisions.
- Status requires meaningful message content: polite status/assertive alert are
  opt-in, not a substitute for a label. Progress exposes named value/indeterminate
  semantics and keeps a static indicator under reduced motion. Avatar uses
  initials/placeholder fallback for missing/failed imagery.

## Explicit remaining visual successors

A-D-15 remains open. The matrix establishes applicability and preserves existing
assertions; it does not certify every native state combination. In particular,
`ToggleButton.module.css` selected styling, `List.module.css` selected action and
`Navigation.module.css` current-item styling use background/text/border colors
without a standard-mode structural indicator. Their aria-pressed/aria-current
semantics are useful but do not close the visible non-color requirement. Add a
consistent token-backed structural selected/current indicator without conflating
it with the outer keyboard focus ring, preserve layout/accessible names, then
validate each affected owner and its compound children. Calendar single-day
selection also needs a reviewed non-color standard-mode indicator; range end
shape and forced-color-specific outlines cannot prove the single-day case.

The neutral filled Button keyboard-press background is separately corrected by
the scoped CSS patch and prepared native regression. A patch that has not been
integrated and executed is not runtime acceptance. The native regression checks
actual Space-held data-pressed with the pointer away: a hovered pointer would
hide the missing pressed selector. Reference fixtures, broad AT/device claims,
and unrelated pending components must not be inferred from that result.
'''
p=out/'proposed-files/docs/developer/react-aria-state-applicability.md'; p.write_text(md)
