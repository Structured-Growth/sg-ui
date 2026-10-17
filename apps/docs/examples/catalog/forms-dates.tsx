'use client';

import {AdvancedCalendarExamples,AdvancedRangeExample} from '../AdvancedCalendarExamples';
import {SearchFieldExamples} from '../SearchFieldExamples';
import {FieldIconExamples} from '../FieldIconExamples';
import {FieldMessageExamples} from '../FieldMessageExamples';
import {SearchIcon,SchoolIcon} from '@structured-growth/sg-ui/icons';
import {RelativeDateExample,RangeTextExample} from "../RelativeDateExamples";
import {TimeTextExample} from '../TimeFieldExamples';
import {AvailabilityParityExample,RangeBehaviorExample,BirthdayExample,DateTimePickerExample,CalendarMonthsExample,CalendarFootprintExample,CalendarDropdownExample,RangeDropdownExample,RangePresetExample} from '../CalendarCompositionExamples';
import { useState, type ReactNode } from 'react';
import { ThemeScope, type Density } from '@structured-growth/sg-ui/theme';
import {
  TextField, TextArea, Select, ComboBox, AsyncMultiSelect, Checkbox, Switch, RadioGroup,
  ToggleButton, ToggleButtonGroup, TagGroup, DateField, TimeField, Calendar, DatePicker,
  DateRangePicker, DateRangeSelector, Button, type MultiSelectOption, type DateRange,
} from '@structured-growth/sg-ui/experimental';
import { Autocomplete, Stack, Typography } from '@structured-growth/sg-ui/primitives';
import { Example } from '../../components/Example';
import type { CatalogEntry } from '../../content/catalog-types';
import { useExampleSource } from '../useExampleSource';
import { literal } from '../source';
import {LocalizedRangeExample} from '../LocalizedRangeExample';
import {AsyncSearchExample} from '../AsyncSearchExample';
import {GroupedContactExample} from '../GroupedContactExample';
import {NativeResetFormExample,TimezoneInstantExample} from '../FormIntegrationExamples';

const choices = [
  {id:'design', label:'Design systems'}, {id:'engineering', label:'Engineering'},
  {id:'research', label:'Research'}, {id:'archived', label:'Archived course', disabled:true},
];
const radioChoices = choices.map(({id, ...option}) => ({value:id, ...option}));
const expImport = (names: string) => `import { ${names} } from '@structured-growth/sg-ui/experimental';`;
const primitivesImport = "import { Stack, Typography } from '@structured-growth/sg-ui/primitives';";
const json = (value: unknown) => JSON.stringify(value);
type Kind = 'TextField' | 'TextArea' | 'Select' | 'ComboBox' | 'AsyncMultiSelect' | 'Checkbox' | 'Switch' | 'RadioGroup' | 'ToggleButton' | 'ToggleButtonGroup' | 'TagGroup';
type Scenario = 'playground' | 'compact' | 'comfortable' | 'form';
const titles: Record<Scenario, string> = {playground:'Prop playground', compact:'Compact density', comfortable:'Comfortable density', form:'Controlled host flow'};
function ControlRow({children}: {children:ReactNode}) { return <Stack direction="row" wrap gap={3}>{children}</Stack>; }
function DensityControl({value, onChange}: {value:Density; onChange:(value:Density)=>void}) {
  return <Select label="Example density" value={value} options={[{id:'compact',label:'Compact'},{id:'comfortable',label:'Comfortable'}]} onValueChange={value => {if (value === 'compact' || value === 'comfortable') onChange(value);}} />;
}
function FormScenario({kind, scenario, messagePlacement}: {kind:Kind; scenario:Scenario;messagePlacement?:"above"|"below"}) {
  const source = useExampleSource();
  const [density, setDensity] = useState<Density>(scenario === 'compact' ? 'compact' : 'comfortable');
  const [label, setLabel] = useState(kind === 'ToggleButton' ? 'Bold' : kind === 'Checkbox' ? 'Accept course terms' : kind === 'Switch' ? 'Email reminders' : kind === 'TagGroup' ? 'Course topics' : 'Course subject');
  const [description, setDescription] = useState('Host-supplied course information.');
  const [descriptionPlacement,setDescriptionPlacement]=useState<'above'|'below'>(messagePlacement??'above');
  const [errorPlacement,setErrorPlacement]=useState<'above'|'below'>(messagePlacement??'below');
  const [placeholder, setPlaceholder] = useState(kind==='Select'?'Choose a subject':'Search course subjects');
  const [iconLayout, setIconLayout] = useState<'none'|'start'|'end'|'both'>('none');
  const [disabled, setDisabled] = useState(false); const [readOnly, setReadOnly] = useState(false);
  const [required, setRequired] = useState(scenario === 'form'); const [invalid, setInvalid] = useState(Boolean(messagePlacement&&!['Switch','AsyncMultiSelect'].includes(kind)));
  const [value, setValue] = useState(kind === 'TextField' || kind === 'TextArea' ? 'Design systems' : 'design');
  const [checked, setChecked] = useState(false); const [mixed, setMixed] = useState(false);
  const [type, setType] = useState<'text'|'email'|'password'|'search'|'tel'|'url'>('text');
  const [rows, setRows] = useState(3); const [orientation, setOrientation] = useState<'horizontal'|'vertical'>('vertical');
  const [buttonWidth, setButtonWidth] = useState<'equal'|'content'>('equal');
  const [multiple, setMultiple] = useState(true); const [allowEmpty, setAllowEmpty] = useState(true);
  const [ids, setIds] = useState<string[]>(['design']);
  const [tags, setTags] = useState(choices.slice(0,3)); const [tone, setTone] = useState<'neutral'|'primary'>('primary');
  const [removable, setRemovable] = useState(true);
  const [query, setQuery] = useState(''); const [selected, setSelected] = useState<MultiSelectOption[]>([]);
  const [loading, setLoading] = useState(false); const [error, setError] = useState(false);
  const [submits, setSubmits] = useState(0);
  const hasIcons=['TextField','TextArea','Select','ComboBox','AsyncMultiSelect'].includes(kind);
  const start=hasIcons&&(iconLayout==='start'||iconLayout==='both'),end=hasIcons&&(iconLayout==='end'||iconLayout==='both');
  const icons={startIcon:start?<SearchIcon size={16}/>:undefined,endIcon:end?<SchoolIcon size={16}/>:undefined};
  const iconCode=`${start?' startIcon={<SearchIcon size={16}/>}':''}${end?' endIcon={<SchoolIcon size={16}/>}':''}`;
  const iconImports=start||end?[`import {${[start?'SearchIcon':'',end?'SchoolIcon':''].filter(Boolean).join(',')}} from '@structured-growth/sg-ui/icons';`]:[];
  const hasDescription=!['ToggleButton','ToggleButtonGroup','TagGroup'].includes(kind);
  const hasErrorPlacement=hasDescription&&!['Switch','AsyncMultiSelect'].includes(kind);
  const common = {label, disabled, readOnly, description,...(hasDescription?{descriptionPlacement}:{}),...(hasErrorPlacement?{errorPlacement}:{})};
  const validation = {required, invalid, errorMessage:'Please review this value.'};
  const isText = kind === 'TextField' || kind === 'TextArea';
  const validates = !['Switch','ToggleButton','ToggleButtonGroup','TagGroup','AsyncMultiSelect'].includes(kind);
  const bool = ` disabled={${disabled}}${['ToggleButton','ToggleButtonGroup','TagGroup'].includes(kind) ? '' : ` readOnly={${readOnly}}`}`;
  const commonCode = `label={${literal(label)}}${bool}${['ToggleButton','ToggleButtonGroup','TagGroup'].includes(kind) ? '' : ` description={${literal(description)}}`}${hasDescription?` descriptionPlacement=${literal(descriptionPlacement)}`:""}${hasErrorPlacement?` errorPlacement=${literal(errorPlacement)}`:""}`;
  const validationCode = validates ? ` required={${required}} invalid={${invalid}} errorMessage="Please review this value."` : '';
  let preview: ReactNode; let body = ''; let state = ''; let imports = kind;
  switch (kind) {
    case 'TextField': case 'TextArea': {
      preview = kind === 'TextField' ? <TextField {...common} {...validation} type={type} {...icons} value={value} onValueChange={setValue} placeholder={placeholder} name="subject" /> : <TextArea {...common} {...validation} {...icons} rows={rows} value={value} onValueChange={setValue} placeholder={placeholder} name="subject" />;
      body = `<${kind} ${commonCode}${validationCode} ${kind === 'TextField' ? `type=${literal(type)}` : `rows={${rows}}`} value={value} onValueChange={setValue} placeholder=${literal(placeholder)}${iconCode} name="subject" />`;
      state = `  const [value, setValue] = useState(${literal(value)});`; break;
    }
    case 'Select': case 'ComboBox': {
      const Component = kind === 'Select' ? Select : ComboBox;
      preview = <Component {...common} {...validation} {...icons} value={value || null} onValueChange={next => setValue(next ?? '')} options={choices} placeholder={placeholder} name="subject" />;
      body = `<${kind} ${commonCode}${validationCode} value={value} onValueChange={setValue} options={${json(choices)}} placeholder=${literal(placeholder)}${iconCode} name="subject" />`;
      state = `  const [value, setValue] = useState<string | null>(${value ? literal(value) : 'null'});`; break;
    }
    case 'Checkbox': case 'Switch': {
      preview = kind === 'Checkbox' ? <Checkbox {...common} {...validation} checked={checked} onCheckedChange={setChecked} mixed={mixed} name="accepted" value="yes" /> : <Switch {...common} checked={checked} onCheckedChange={setChecked} name="reminders" value="yes" />;
      body = `<${kind} ${commonCode}${validationCode} checked={checked} onCheckedChange={setChecked}${kind === 'Checkbox' ? ` mixed={${mixed}}` : ''} name=${literal(kind === 'Checkbox' ? 'accepted' : 'reminders')} value="yes" />`;
      state = `  const [checked, setChecked] = useState(${checked});`; break;
    }
    case 'RadioGroup':
      preview = <RadioGroup {...common} {...validation} value={value} onValueChange={setValue} options={radioChoices} orientation={orientation} name="subject" />;
      body = `<RadioGroup ${commonCode}${validationCode} value={value} onValueChange={setValue} options={${json(radioChoices)}} orientation=${literal(orientation)} name="subject" />`;
      state = `  const [value, setValue] = useState(${literal(value)});`; break;
    case 'ToggleButton':
      preview = <ToggleButton selected={checked} onSelectedChange={setChecked} density={density} disabled={disabled}>{label}</ToggleButton>;
      body = `<ToggleButton selected={selected} onSelectedChange={setSelected} density=${literal(density)} disabled={${disabled}}>{${literal(label)}}</ToggleButton>`;
      state = `  const [selected, setSelected] = useState(${checked});`; break;
    case 'ToggleButtonGroup':
      preview = <ToggleButtonGroup label={label} options={choices} selectedIds={ids} onSelectionChange={setIds} selectionMode={multiple ? 'multiple' : 'single'} allowEmpty={allowEmpty} orientation={orientation} buttonWidth={buttonWidth} density={density} disabled={disabled} />;
      body = `<ToggleButtonGroup ${commonCode} options={${json(choices)}} selectedIds={ids} onSelectionChange={setIds} selectionMode=${literal(multiple ? 'multiple' : 'single')} allowEmpty={${allowEmpty}} orientation=${literal(orientation)} buttonWidth=${literal(buttonWidth)} density=${literal(density)} />`;
      state = `  const [ids, setIds] = useState<string[]>(${json(ids)});`; break;
    case 'TagGroup':
      preview = <TagGroup label={label} items={tags} onRemove={removable ? removed => setTags(current => current.filter(tag => !removed.includes(tag.id))) : undefined} tone={tone} disabled={disabled} density={density} emptyContent="No topics selected" />;
      body = `<TagGroup ${commonCode} items={items}${removable ? ' onRemove={removed => setItems(current => current.filter(item => !removed.includes(item.id)))}' : ''} tone=${literal(tone)} density=${literal(density)} emptyContent="No topics selected" />`;
      state = `  const [items, setItems] = useState(${json(tags)});`; break;
    case 'AsyncMultiSelect': {
      const results = choices.filter(option => option.label.toLowerCase().includes(query.toLowerCase()));
      preview = <AsyncMultiSelect {...common} {...icons} placeholder={placeholder} query={query} onQueryChange={setQuery} options={results} value={selected} onValueChange={setSelected} loading={loading} errorMessage={error ? 'Sample request failed. Retry to restore local results.' : undefined} onRetry={() => {setError(false); setLoading(false);}} name="topics" />;
      body = `<AsyncMultiSelect ${commonCode} placeholder=${literal(placeholder)}${iconCode} query={query} onQueryChange={setQuery} options={options.filter(option => option.label.toLowerCase().includes(query.toLowerCase()))} value={selected} onValueChange={setSelected} loading={loading} errorMessage={error ? "Sample request failed. Retry to restore local results." : undefined} onRetry={() => { setError(false); setLoading(false); }} name="topics" />`;
      state = `  // Local mock results. The host owns fetching, cancellation and stale-response rejection.\n  const options = ${json(choices)};\n  const [query, setQuery] = useState(${literal(query)});\n  const [selected, setSelected] = useState<MultiSelectOption[]>(${json(selected)});\n  const [loading, setLoading] = useState(${loading});\n  const [error, setError] = useState(${error});`;
      imports += ', type MultiSelectOption'; break;
    }
  }
  const summary = isText || ['Select','ComboBox','RadioGroup'].includes(kind) ? value : kind === 'TagGroup' ? tags.map(tag => tag.label).join(', ') : kind === 'AsyncMultiSelect' ? selected.map(tag => tag.label).join(', ') : kind === 'ToggleButtonGroup' ? ids.join(', ') : String(checked);
  const controls = scenario === 'playground' ? <Stack gap={3}>
    <ControlRow><TextField label="Example label" value={label} onValueChange={setLabel} /><DensityControl value={density} onChange={setDensity} />
      {!['ToggleButton','ToggleButtonGroup','TagGroup'].includes(kind) && <TextField label="Description" value={description} onValueChange={setDescription} />}
      {hasDescription&&<><Select label="Description placement" value={descriptionPlacement} options={[{id:'above',label:'Above input'},{id:'below',label:'Below input'}]} onValueChange={v=>setDescriptionPlacement(v==='below'?'below':'above')}/>{hasErrorPlacement&&<Select label="Error placement" value={errorPlacement} options={[{id:'above',label:'Above input'},{id:'below',label:'Below input'}]} onValueChange={v=>setErrorPlacement(v==='above'?'above':'below')}/>}</>}
      {hasIcons && <><TextField label="Placeholder text" value={placeholder} onValueChange={setPlaceholder}/><Select label="Field icons" value={iconLayout} options={[{id:'none',label:'None'},{id:'start',label:'Start only'},{id:'end',label:'End only'},{id:'both',label:'Both ends'}]} onValueChange={value=>setIconLayout(value as typeof iconLayout)}/><Button variant="outlined" onPress={()=>{setValue('');setQuery('');setSelected([]);}}>Empty example field</Button></>}
      {kind === 'TextField' && <Select label="Input type" value={type} onValueChange={v => setType(v as typeof type)} options={['text','email','password','search','tel','url'].map(id => ({id,label:id}))} />}
      {kind === 'TextArea' && <Select label="Rows" value={String(rows)} onValueChange={v => setRows(Number(v))} options={[2,3,6].map(n => ({id:String(n),label:String(n)}))} />}
      {['RadioGroup','ToggleButtonGroup'].includes(kind) && <Select label="Orientation" value={orientation} onValueChange={v => setOrientation(v as typeof orientation)} options={['horizontal','vertical'].map(id => ({id,label:id}))} />}
      {kind === 'ToggleButtonGroup' && <Select label="Button width" value={buttonWidth} onValueChange={value => setButtonWidth(value as typeof buttonWidth)} options={[{id:'equal',label:'Equal widths'},{id:'content',label:'Fit content'}]} />}
      {kind === 'TagGroup' && <Select label="Tag tone" value={tone} onValueChange={v => setTone(v as typeof tone)} options={['neutral','primary'].map(id => ({id,label:id}))} />}
    </ControlRow>
    <ControlRow><Checkbox label="Disabled" checked={disabled} onCheckedChange={setDisabled} />
      {!['ToggleButton','ToggleButtonGroup','TagGroup'].includes(kind) && <Checkbox label="Read only" checked={readOnly} onCheckedChange={setReadOnly} />}
      {validates && <><Checkbox label="Required" checked={required} onCheckedChange={setRequired} /><Checkbox label="Invalid" checked={invalid} onCheckedChange={setInvalid} /></>}
      {kind === 'Checkbox' && <Checkbox label="Mixed state" checked={mixed} onCheckedChange={setMixed} />}
      {kind === 'ToggleButtonGroup' && <><Checkbox label="Multiple selection" checked={multiple} onCheckedChange={next => {setMultiple(next); if (!next) setIds(current => current.slice(0,1));}} /><Checkbox label="Allow empty selection" checked={allowEmpty} onCheckedChange={setAllowEmpty} /></>}
      {kind === 'TagGroup' && <><Checkbox label="Removable" checked={removable} onCheckedChange={setRemovable} /><Button onPress={() => setTags(choices.slice(0,3))}>Restore topics</Button></>}
      {kind === 'AsyncMultiSelect' && <><Checkbox label="Mock loading" checked={loading} onCheckedChange={setLoading} /><Checkbox label="Mock request failure" checked={error} onCheckedChange={setError} /></>}
    </ControlRow>
  </Stack> : undefined;
  const output = <Stack gap={3}>{preview}</Stack>;
  const summaryCode = isText || ['Select','ComboBox','RadioGroup'].includes(kind) ? "value || 'None'" : kind === 'TagGroup' ? "items.map(item => item.label).join(', ') || 'None'" : kind === 'AsyncMultiSelect' ? "selected.map(item => item.label).join(', ') || 'None'" : kind === 'ToggleButtonGroup' ? "ids.join(', ') || 'None'" : kind === 'ToggleButton' ? 'String(selected)' : 'String(checked)';
  let content = `<Stack gap={3}>\n  ${body}\n  \n</Stack>`;
  let rendered:ReactNode = output;
  if (scenario === 'form') {
    const fieldIsNative = !['ToggleButton','ToggleButtonGroup','TagGroup'].includes(kind);
    content = fieldIsNative ? `<form onSubmit={event => { event.preventDefault(); setSubmits(count => count + 1); }}>\n<Stack gap={3}>\n${content}\n  <Button type="submit">Save locally</Button>\n  <Typography role="status">Submitted {submits} times. Connect persistence in your host.</Typography>\n</Stack>\n</form>` : `<Stack gap={3}>\n${content}\n  <Button onPress={() => setSubmits(count => count + 1)}>Apply local preferences</Button>\n  <Typography role="status">Applied {submits} times. Connect persistence in your host.</Typography>\n</Stack>`;
    state += `\n  const [submits, setSubmits] = useState(${submits});`; imports += ', Button';
    const action = <><Button type={fieldIsNative ? 'submit' : 'button'} onPress={fieldIsNative ? undefined : () => setSubmits(count => count + 1)}>{fieldIsNative ? 'Save locally' : 'Apply local preferences'}</Button><Typography role="status">{fieldIsNative ? 'Submitted' : 'Applied'} {submits} times. Connect persistence in your host.</Typography></>;
    rendered = fieldIsNative ? <form onSubmit={event => {event.preventDefault(); setSubmits(count => count + 1);}}><Stack gap={3}>{output}{action}</Stack></form> : <Stack gap={3}>{output}{action}</Stack>;
  }
  return <Example title={messagePlacement?`Messages ${messagePlacement} input — ${density}`:titles[scenario]} density={density} description={scenario === 'playground' ? 'Adjust the public props, then interact with the preview. Source follows the current state.' : scenario === 'form' ? 'Callbacks update local host state. No backend persistence is implied.' : 'An independent scope demonstrates the inherited spacing and interaction targets.'} controls={controls} source={source({name:kind + scenario[0].toUpperCase() + scenario.slice(1), imports:[expImport(imports),primitivesImport,...iconImports], state, body:`<ThemeScope density=${literal(density)}>\n${content}\n</ThemeScope>`})}>{rendered}</Example>;
}
function AutocompleteAliasExample() {
  const source = useExampleSource();
  const [label, setLabel] = useState('Find a course subject');
  const [value, setValue] = useState<string | null>('research');
  const [density, setDensity] = useState<Density>('comfortable');
  const [disabled, setDisabled] = useState(false);
  const [readOnly, setReadOnly] = useState(false);
  return <Example title="Autocomplete public alias playground" description="Autocomplete is the public primitives alias of ComboBox; it uses the same stable option IDs and controlled selection contract."
    density={density} controls={<ControlRow><TextField label="Autocomplete label" value={label} onValueChange={setLabel} /><DensityControl value={density} onChange={setDensity} /><Checkbox label="Alias disabled" checked={disabled} onCheckedChange={setDisabled} /><Checkbox label="Alias read only" checked={readOnly} onCheckedChange={setReadOnly} /></ControlRow>}
    source={source({name:'AutocompleteAlias', imports:["import { Autocomplete, Stack, Typography } from '@structured-growth/sg-ui/primitives';", expImport('Button')], state:`  const [value, setValue] = useState<string | null>(${json(value)});`, body:`<ThemeScope density=${literal(density)}>\n  <Stack gap={3}>\n    <Autocomplete label={${literal(label)}} options={${json(choices)}} value={value} onValueChange={setValue} disabled={${disabled}} readOnly={${readOnly}} placeholder="Search course subjects" />\n    <Button variant="outlined" onPress={() => setValue(null)}>Clear host selection</Button>\n    \n  </Stack>\n</ThemeScope>`})}>
    <Stack gap={3}><Autocomplete label={label} options={choices} value={value} onValueChange={setValue} disabled={disabled} readOnly={readOnly} placeholder="Search course subjects" /><Button variant="outlined" onPress={() => setValue(null)}>Clear host selection</Button></Stack>
  </Example>;
}
type OrientationKind = 'RadioGroup' | 'ToggleButtonGroup';
function OrientationExample({kind, orientation, density, buttonWidth = 'equal'}: {kind:OrientationKind; orientation:'horizontal'|'vertical'; density:Density; buttonWidth?:'equal'|'content'}) {
  const source = useExampleSource();
  const title = `${orientation === 'horizontal' ? 'Horizontal' : 'Vertical'} · ${density}${buttonWidth === 'content' ? ' · fit content' : ''}`;
  const label = `Course topics: ${orientation} ${density}`;
  const vertical = orientation === 'vertical';
  const comfortable = density === 'comfortable';
  // Each fixed panel owns its host state. Playground edits and sibling actions
  // cannot rewrite this panel's props, selected values or source snapshot.
  const [value, setValue] = useState<string | null>(vertical ? (comfortable ? 'research' : null) : (comfortable ? 'engineering' : 'design'));
  const [ids, setIds] = useState<string[]>(vertical ? (comfortable ? ['engineering'] : ['design','research']) : (comfortable ? [] : ['design']));
  const readOnly = vertical && comfortable;
  const selectionMode = vertical ? 'multiple' : 'single';
  const allowEmpty = !comfortable || vertical;
  const disabled = vertical && comfortable;
  let preview:ReactNode; let state:string; let body:string; let description:string;
  if (kind === 'RadioGroup') {
    description = readOnly ? 'A read-only selected choice, with an individually unavailable option.' : vertical ? 'An initially empty group with an individually unavailable option; choose one topic.' : 'An independently controlled selected choice with an individually unavailable option.';
    preview = <Stack gap={3}><RadioGroup label={label} options={radioChoices} orientation={orientation} value={value} onValueChange={setValue} readOnly={readOnly} /></Stack>;
    state = `  const [value, setValue] = useState<string | null>(${json(value)});`;
    body = `<Stack gap={3}>\n  <RadioGroup label={${literal(label)}} options={${json(radioChoices)}} orientation=${literal(orientation)} value={value} onValueChange={setValue} readOnly={${readOnly}} />\n  \n</Stack>`;
  } else {
    description = disabled ? 'Multiple selected-action state while the group is unavailable.' : vertical ? 'Multiple actions can remain selected; an individually disabled action is unavailable.' : comfortable ? 'Single selection that keeps a chosen action; initially no action is selected.' : 'Single selection can be toggled off; each option retains a stable ID.';
    preview = <Stack gap={3}><ToggleButtonGroup label={label} options={choices} orientation={orientation} buttonWidth={buttonWidth} selectionMode={selectionMode} selectedIds={ids} onSelectionChange={setIds} allowEmpty={allowEmpty} disabled={disabled} density={density} /></Stack>;
    state = `  const [ids, setIds] = useState<string[]>(${json(ids)});`;
    body = `<Stack gap={3}>\n  <ToggleButtonGroup label={${literal(label)}} options={${json(choices)}} orientation=${literal(orientation)} buttonWidth=${literal(buttonWidth)} selectionMode=${literal(selectionMode)} selectedIds={ids} onSelectionChange={setIds} allowEmpty={${allowEmpty}} disabled={${disabled}} density=${literal(density)} />\n  \n</Stack>`;
  }
  return <Example title={title} description={description} density={density} source={source({name:kind + orientation + density + buttonWidth, imports:[expImport(kind),primitivesImport], state, body:`<ThemeScope density=${literal(density)}>\n${body}\n</ThemeScope>`})}>{preview}</Example>;
}
function OrientationMatrix({kind}: {kind:OrientationKind}) {
  return <Stack gap={3}><Typography as="h2" variant="h5">Orientation and density comparisons</Typography><Typography tone="muted">The orientation and density comparisons stay visible and independent of the prop playground.</Typography><Stack direction="row" wrap align="start" gap={4}>{(['horizontal','vertical'] as const).flatMap(orientation => (['compact','comfortable'] as const).map(density => <Stack key={`${orientation}-${density}`} style={{flex:'1 1 22rem',minWidth:0}}><OrientationExample kind={kind} orientation={orientation} density={density} />{kind === 'ToggleButtonGroup' && <OrientationExample kind={kind} orientation={orientation} density={density} buttonWidth="content" />}</Stack>))}</Stack></Stack>;
}
function formPage(kind:Kind) {
  return function FormPage() {
    // Scenario components own their state at each mount: prop controls remain
    // local to the playground; density and form examples never consume it.
    const oriented = kind === 'RadioGroup' || kind === 'ToggleButtonGroup';
    return <Stack gap={4}><FormScenario kind={kind} scenario="playground" />{oriented ? <OrientationMatrix kind={kind} /> : <><FormScenario kind={kind} scenario="compact" /><FormScenario kind={kind} scenario="comfortable" /></>}<FormScenario kind={kind} scenario="form" />{kind === 'ComboBox' && <AutocompleteAliasExample />}{(['TextField','TextArea','Select','ComboBox','AsyncMultiSelect'] as const).map(field=>kind===field?<FieldIconExamples key={field} kind={field}/>:null)}{(kind==='TextField'||kind==='TextArea')&&<FieldMessageExamples kind={kind}/>}{(['Select','ComboBox','Checkbox','Switch','RadioGroup','AsyncMultiSelect'] as Kind[]).includes(kind)&&(['compact','comfortable'] as const).flatMap(density=>(['above','below'] as const).map(placement=><FormScenario key={`${density}-${placement}`} kind={kind} scenario={density} messagePlacement={placement}/>))} {kind === 'TextField' && <><NativeResetFormExample /><GroupedContactExample /></>}{kind === 'AsyncMultiSelect' && <AsyncSearchExample />}</Stack>;
  };
}

type DateKind = 'DateField' | 'TimeField' | 'Calendar' | 'DatePicker' | 'DateRangePicker' | 'DateRangeSelector';
const unavailableDates = [{date:'2026-10-18', reason:'Host reports no course availability.'}, {date:'2026-10-25', reason:'Maintenance day.'}];
// Resolved against the example's fixed October 16, 2026 reference (Monday-start weeks).
const rangePresets = [
  {id:'this-week', label:'This week', value:{start:'2026-10-12',end:'2026-10-18'}},
  {id:'last-week', label:'Last week', value:{start:'2026-10-05',end:'2026-10-11'}},
  {id:'this-month', label:'This month', value:{start:'2026-10-01',end:'2026-10-31'}},
  {id:'last-month', label:'Last month', value:{start:'2026-09-01',end:'2026-09-30'}},
];
function DateScenario({kind, scenario}: {kind:DateKind; scenario:Scenario}) {
  const source = useExampleSource();
  const [density, setDensity] = useState<Density>(scenario === 'compact' ? 'compact' : 'comfortable');
  const [label, setLabel] = useState(kind === 'TimeField' ? 'Course start time' : 'Course schedule');
  const [description, setDescription] = useState('Local value supplied by your host.');
  const [referenceDate,setReferenceDate]=useState("2026-10-16");
  const [disabled, setDisabled] = useState(false); const [readOnly, setReadOnly] = useState(false);
  const [required, setRequired] = useState(scenario === 'form'); const [invalid, setInvalid] = useState(false);
  const [bounds, setBounds] = useState(false); const [unavailable, setUnavailable] = useState(false);
  const [showTitle, setShowTitle] = useState(false);
  const [descriptionPlacement,setDescriptionPlacement]=useState<"above"|"below">("above");
  const [errorPlacement,setErrorPlacement]=useState<"above"|"below">("below");
  const [navigation, setNavigation] = useState<"arrows"|"month-year">("arrows");
  const [visibleYears, setVisibleYears] = useState(120);
  const [rangeClickBehavior,setRangeSelectionBehavior]=useState<'restart'|'adjust-end'|'adjust-start'|'adjust-boundaries'|'active-endpoint'>('adjust-end');
  const [dragBehavior,setDragBehavior]=useState<'none'|'move'|'resize'|'move-and-resize'>('move-and-resize');
  const [lengthMode,setLengthMode]=useState<'flexible'|'fixed'|'bounded'>('flexible');
  const [lengthUnit,setLengthUnit]=useState<'days'|'nights'>('days');
  const [lengthValue,setLengthValue]=useState('2'),[maxLength,setMaxLength]=useState('14');
  const [calendarNavigation,setCalendarNavigation]=useState<'linked'|'independent'>('linked');
  const [assignEndpoints,setAssignEndpoints]=useState(false);
  const calendarEndpoints=assignEndpoints?['start','end'] as const:undefined;
  const [calendarLayout,setCalendarLayout]=useState<'paged'|'scroll'>('paged');
  const [commitBehavior,setCommitBehavior]=useState<'apply'|'immediate'>('apply');
  const [activeEndpoint,setActiveEndpoint]=useState<'start'|'end'>('end');
  const [presentation,setPresentation]=useState<'popover'|'dialog'|'drawer'|'auto'>('popover');
  const [availabilityRule,setAvailabilityRule]=useState(false),[markers,setMarkers]=useState(false);
  const [scrollMonths,setScrollMonths]=useState('12');
  const [showFields,setShowFields]=useState(false),[showActions,setShowActions]=useState(true),[groupedPresets,setGroupedPresets]=useState(false);
  const presetGroups=groupedPresets?[{id:'periods',label:'Date periods',presets:rangePresets,children:[{id:'archive',label:'Archived periods',presets:[{id:'year',label:'Last year',value:{start:'2025-01-01',end:'2025-12-31'}}]}]}]:undefined;
  const [minuteStep,setMinuteStep]=useState('1');
  const rangeLength=lengthMode==='fixed'?{mode:'fixed' as const,value:Number(lengthValue),unit:lengthUnit}:lengthMode==='bounded'?{mode:'bounded' as const,min:Number(lengthValue),max:Number(maxLength),unit:lengthUnit}:undefined;
  const getDateUnavailableReason=availabilityRule?(date:string,context:{endpoint:'start'|'end'|null})=>date.endsWith('-13')&&context.endpoint==='start'?'No arrivals on the 13th.':undefined:undefined;
  const renderDayContent=markers?(date:string)=>date.endsWith('-15')?'•':null:undefined;
  const [presetPlacement,setPresetPlacement]=useState<'above'|'side'|'end'>('side');
  const [presets, setPresets] = useState(false); const [months, setMonths] = useState<1|2|3>(1);
  const [firstDay, setFirstDay] = useState<'sun'|'mon'>('mon');
  const [fieldMode, setFieldMode] = useState<'text'|'button'>('text');
  const [entryMode, setEntryMode] = useState<'segments'|'text'>(kind==='TimeField'||kind==='DatePicker'||kind==='DateRangePicker'||kind==='DateRangeSelector'?'text':'segments');
  const [dateTime, setDateTime] = useState(false); const [hourCycle, setHourCycle] = useState<12|24>(kind==='TimeField'?12:24);
  const [multiple, setMultiple] = useState(false);
  const [value, setValue] = useState<string|null>(kind === 'TimeField' ? '09:30:00' : '2026-10-14');
  const [dates, setDates] = useState<string[]>(['2026-10-14','2026-10-16']);
  const [range, setRange] = useState<DateRange|null>({start:'2026-10-12',end:'2026-10-16'});
  const [submits, setSubmits] = useState(0); const [cancels, setCancels] = useState(0);
  const isRange = kind === 'DateRangePicker' || kind === 'DateRangeSelector';
  const hasAvailability = isRange || kind === 'Calendar' || kind === 'DatePicker';
  const hasValidation = kind === 'DateRangePicker' || (!isRange && kind !== 'Calendar');
  const min = bounds ? kind === 'TimeField' ? '08:00:00' : dateTime ? '2026-10-01T00:00:00' : '2026-10-01' : undefined;
  const max = bounds ? kind === 'TimeField' ? '18:00:00' : dateTime ? '2026-10-31T23:59:59' : '2026-10-31' : undefined;
  const common = {label, disabled, readOnly, min, max};
  const validation = {description, descriptionPlacement,errorPlacement, required, invalid, errorMessage:'Please review this schedule.'};
  const availability = unavailable ? unavailableDates : [];
  const boundCode = bounds ? ` min=${literal(min!)} max=${literal(max!)}` : '';
  const commonCode = `label={${literal(label)}} disabled={${disabled}} readOnly={${readOnly}}${boundCode}`;
  const validationCode = `${kind!=="TimeField"?` referenceDate=${literal(referenceDate)}`:""} description={${literal(description)}} descriptionPlacement=${literal(descriptionPlacement)} errorPlacement=${literal(errorPlacement)} required={${required}} invalid={${invalid}} errorMessage="Please review this schedule."`;
  const availableCode = ` unavailable={${json(availability)}}`;
  let preview:ReactNode; let body = ''; let state = ''; let imports = kind;
  if (kind === 'DateField') {
    preview = <DateField {...common} {...validation} referenceDate={referenceDate} kind={dateTime ? 'datetime' : 'date'} hourCycle={hourCycle} entryMode={entryMode} value={value} onValueChange={setValue} name="schedule" />;
    body = `<DateField ${commonCode}${validationCode} kind=${literal(dateTime ? 'datetime' : 'date')} entryMode=${literal(entryMode)} hourCycle={${hourCycle}} value={value} onValueChange={setValue} name="schedule" />`;
    state = `  const [value, setValue] = useState<string | null>(${json(value)});`;
  } else if (kind === 'TimeField') {
    preview = <TimeField {...common} {...validation} minuteStep={Number(minuteStep)} entryMode={entryMode} hourCycle={hourCycle} value={value} onValueChange={setValue} name="schedule" />;
    body = `<TimeField minuteStep={${Number(minuteStep)}} ${commonCode}${validationCode} entryMode=${literal(entryMode)} hourCycle={${hourCycle}} value={value} onValueChange={setValue} name="schedule" />`;
    state = `  // Local clock time is not an instant; hosts own timezone conversion.\n  const [value, setValue] = useState<string | null>(${json(value)});`;
  } else if (kind === 'DatePicker') {
    preview = <DatePicker {...common} {...validation} presentation={presentation} referenceDate={referenceDate} navigation={navigation} visibleYears={visibleYears} kind={dateTime ? "datetime" : "date"} hourCycle={hourCycle} showTitle={showTitle} entryMode={entryMode} value={value} onValueChange={setValue} unavailable={availability} defaultFocusedDate="2026-10-14" name="schedule" />;
    body = `<DatePicker presentation=${literal(presentation)} ${commonCode}${validationCode}${availableCode} navigation=${literal(navigation)} visibleYears={${visibleYears}} kind=${literal(dateTime ? "datetime" : "date")} hourCycle={${hourCycle}} showTitle={${showTitle}} entryMode=${literal(entryMode)} value={value} onValueChange={setValue} defaultFocusedDate="2026-10-14" name="schedule" />`;
    state = `  const [value, setValue] = useState<string | null>(${json(value)});`;
  } else if (kind === 'Calendar') {
    const calendarOptions = {...common, showTitle, navigation, visibleYears, unavailable:availability, months, firstDayOfWeek:firstDay, defaultFocusedDate:'2026-10-14'};
    preview = multiple ? <Calendar {...calendarOptions} selection="multiple" value={dates} onValueChange={setDates} /> : <Calendar {...calendarOptions} value={value} onValueChange={setValue} />;
    body = `<Calendar ${commonCode}${availableCode} navigation=${literal(navigation)} visibleYears={${visibleYears}} showTitle={${showTitle}} selection=${literal(multiple ? 'multiple' : 'single')} value={value} onValueChange={setValue} months={${months}} firstDayOfWeek=${literal(firstDay)} defaultFocusedDate="2026-10-14" />`;
    state = `  const [value, setValue] = useState<${multiple ? 'string[]' : 'string | null'}>(${json(multiple ? dates : value)});`;
  } else {
    const Component = kind === 'DateRangePicker' ? DateRangePicker : DateRangeSelector;
    const rangeOptions = {...common, descriptionPlacement,errorPlacement, rangeClickBehavior, rangeDragBehavior:dragBehavior, rangeLength,calendarNavigation,calendarEndpoints,calendarLayout,scrollMonths:Number(scrollMonths),showFields,showActions,presetGroups,commitBehavior,activeEndpoint,onActiveEndpointChange:setActiveEndpoint,getDateUnavailableReason,renderDayContent, referenceDate, showTitle, navigation, visibleYears, entryMode, presetPlacement, unavailable:availability, required, presets:presets ? rangePresets : [], months, firstDayOfWeek:firstDay, defaultFocusedDate:'2026-10-14', name:'schedule'};
    preview = <Component {...rangeOptions} {...(kind === 'DateRangePicker' ? {fieldMode, description, invalid, presentation, errorMessage:'Please review this schedule.'} : {})} value={range} onValueChange={setRange} {...(kind === 'DateRangeSelector' ? {onCancel:() => setCancels(count => count + 1)} : {})} />;
    body = `<${kind} ${commonCode}${kind === "DateRangePicker" ? ` fieldMode=${literal(fieldMode)} presentation=${literal(presentation)} description={${literal(description)}} invalid={${invalid}} errorMessage="Please review this schedule."` : ""}${availableCode} descriptionPlacement=${literal(descriptionPlacement)} errorPlacement=${literal(errorPlacement)} rangeClickBehavior=${literal(rangeClickBehavior)} rangeDragBehavior=${literal(dragBehavior)}${rangeLength?` rangeLength={${json(rangeLength)}}`:''} calendarNavigation=${literal(calendarNavigation)}${calendarEndpoints?` calendarEndpoints={${json(calendarEndpoints)}}`:""} calendarLayout=${literal(calendarLayout)} scrollMonths={${Number(scrollMonths)}} showFields={${showFields}} showActions={${showActions}}${presetGroups?` presetGroups={${json(presetGroups)}}`:""} commitBehavior=${literal(commitBehavior)} activeEndpoint={activeEndpoint} onActiveEndpointChange={setActiveEndpoint}${availabilityRule?' getDateUnavailableReason={(date,context)=>date.endsWith("-13") && context.endpoint === "start" ? "No arrivals on the 13th." : undefined}':''}${markers?' renderDayContent={date=>date.endsWith("-15") ? "•" : null}':''} navigation=${literal(navigation)} visibleYears={${visibleYears}} showTitle={${showTitle}} entryMode=${literal(entryMode)} referenceDate=${literal(referenceDate)} presetPlacement=${literal(presetPlacement)} required={${required}} presets={${json(presets ? rangePresets : [])}} months={${months}} firstDayOfWeek=${literal(firstDay)} defaultFocusedDate="2026-10-14" name="schedule" value={range} onValueChange={setRange}${kind === 'DateRangeSelector' ? ' onCancel={() => setCancels(count => count + 1)}' : ''} />`;
    imports += ', type DateRange'; state = `  const [range, setRange] = useState<DateRange | null>(${json(range)});\n  const [activeEndpoint,setActiveEndpoint]=useState<"start"|"end">(${literal(activeEndpoint)});`;
    if (kind === 'DateRangeSelector') {state += `\n  const [cancels, setCancels] = useState(${cancels});`; body += '\n';}
  }
  const selected = isRange ? range : kind === 'Calendar' && multiple ? dates : value;
  const summary = JSON.stringify(selected);
  let content = `<Stack align="start" gap={3}>\n${body}\n\n</Stack>`;
  let rendered:ReactNode = <Stack align="start" gap={3}>{preview}</Stack>;
  if (scenario === 'form') {
    imports += ', Button'; state += `\n  const [submits, setSubmits] = useState(${submits});`;
    // Calendar is a selection widget rather than a native named field; the host supplies serialization.
    const hidden = kind === 'Calendar' ? '<input type="hidden" name="schedule" value={JSON.stringify(value)} />\n' : '';
    content = `<form onSubmit={event => { event.preventDefault(); setSubmits(count => count + 1); }}>\n<Stack align="start" gap={3}>\n${content}\n${hidden}<Button type="submit">Submit schedule locally</Button>\n<Typography role="status">Submitted {submits} times. Host owns persistence.</Typography>\n</Stack>\n</form>`;
    rendered = <form onSubmit={event => {event.preventDefault(); setSubmits(count => count + 1);}}><Stack align="start" gap={3}>{rendered}{kind === 'Calendar' && <input type="hidden" name="schedule" value={summary} />}<Button type="submit">Submit schedule locally</Button><Typography role="status">Submitted {submits} times. Host owns persistence.</Typography></Stack></form>;
  }
  const controls = scenario === 'playground' ? <Stack align="start" gap={3}>
    <ControlRow><TextField label="Example label" value={label} onValueChange={setLabel} /><DensityControl value={density} onChange={setDensity} />
      {kind!=='Calendar' && kind!=='TimeField' && !dateTime && <Select label="Date entry" value={entryMode} options={[{id:'segments',label:'Date segments'},{id:'text',label:'Flexible text'}]} onValueChange={value=>setEntryMode(value==='text'?'text':'segments')}/>}
      {kind==='DateRangePicker' && <Select label="Range field" value={fieldMode} options={[{id:'text',label:'Textbox and dropdown'},{id:'button',label:'Selection button'}]} onValueChange={value=>setFieldMode(value==='button'?'button':'text')}/>}
      {kind==='TimeField'&&<Select label="Minute increment" value={minuteStep} options={[1,5,15,30].map(n=>({id:String(n),label:String(n)}))} onValueChange={v=>setMinuteStep(v??'1')}/>}{kind==='TimeField' && <Select label="Time entry" value={entryMode} options={[{id:'text',label:'Textbox and dropdown'},{id:'segments',label:'Time segments'}]} onValueChange={value=>setEntryMode(value==='segments'?'segments':'text')}/>}
      {kind!=="TimeField" && kind!=="Calendar" && !dateTime && (entryMode==="text" || kind==="DateRangePicker") && <TextField label="Relative reference date" value={referenceDate} onValueChange={setReferenceDate} description="ISO civil date supplied by the host. This demo uses a fixed date."/>}
      {hasValidation && <TextField label="Description" value={description} onValueChange={setDescription} />}
      {kind!=='Calendar'&&<><Select label="Description placement" value={descriptionPlacement} options={[{id:"above",label:"Above input"},{id:"below",label:"Below input"}]} onValueChange={v=>setDescriptionPlacement(v==='below'?'below':'above')}/><Select label="Error placement" value={errorPlacement} options={[{id:"above",label:"Above input"},{id:"below",label:"Below input"}]} onValueChange={v=>setErrorPlacement(v==='above'?'above':'below')}/></>}
      {(kind === 'TimeField' || kind === 'DateField' || (kind === 'DatePicker' && dateTime)) && <Select label="Hour cycle" value={String(hourCycle)} options={[{id:'12',label:'12-hour'},{id:'24',label:'24-hour'}]} onValueChange={v => setHourCycle(v === '12' ? 12 : 24)} />}
      {(kind === 'Calendar' || isRange) && <><Select label="Visible months" value={String(months)} options={[{id:'1',label:'One month'},{id:'2',label:'Two months'},{id:'3',label:'Three months'}]} onValueChange={v => setMonths(v === '3' ? 3 : v === '2' ? 2 : 1)} /><Select label="First weekday" value={firstDay} options={[{id:'mon',label:'Monday'},{id:'sun',label:'Sunday'}]} onValueChange={v => setFirstDay(v === 'sun' ? 'sun' : 'mon')} /></>}
      {hasAvailability && <><Select label="Calendar navigation" value={navigation} options={[{id:"arrows",label:"Month arrows"},{id:"month-year",label:"Month and year dropdowns"}]} onValueChange={value=>setNavigation(value==="month-year"?"month-year":"arrows")}/><Select label="Year choices" value={String(visibleYears)} options={[{id:"20",label:"20 years"},{id:"120",label:"120 years"},{id:"200",label:"200 years"}]} onValueChange={value=>setVisibleYears(Number(value))}/></>}
    </ControlRow>
    <ControlRow><Checkbox label="Disabled" checked={disabled} onCheckedChange={setDisabled} /><Checkbox label="Read only" checked={readOnly} onCheckedChange={setReadOnly} />
      {kind !== 'Calendar' && <Checkbox label="Required" checked={required} onCheckedChange={setRequired} />}
      {hasValidation && <Checkbox label="Invalid" checked={invalid} onCheckedChange={setInvalid} />}
      <Checkbox label={kind === 'TimeField' ? 'Limit to business hours' : 'Limit to October 2026'} checked={bounds} onCheckedChange={setBounds} />
      {hasAvailability && <Checkbox label="Show title" checked={showTitle} onCheckedChange={setShowTitle} />}
      {hasAvailability && <Checkbox label="Unavailable dates" checked={unavailable} onCheckedChange={setUnavailable} />}
      {isRange && <Select label="Range selection behavior" value={rangeClickBehavior} description="After a complete range: restart, adjust one endpoint, or preserve a complete range. Initial selection works in either direction." options={[{id:'restart',label:'Restart'},{id:'adjust-end',label:'Adjust end (default)'},{id:'adjust-start',label:'Adjust start'},{id:'adjust-boundaries',label:'Adjust boundaries'},{id:'active-endpoint',label:'Active endpoint'}]} onValueChange={v=>setRangeSelectionBehavior(v as typeof rangeClickBehavior)}/>}
      {isRange&&<><Select label="Drag behavior" value={dragBehavior} options={['none','move','resize','move-and-resize'].map(id=>({id,label:id}))} onValueChange={v=>setDragBehavior(v as typeof dragBehavior)}/><Select label="Range length" value={lengthMode} options={['flexible','fixed','bounded'].map(id=>({id,label:id}))} onValueChange={v=>setLengthMode(v as typeof lengthMode)}/>{lengthMode!=='flexible'&&<><TextField label={lengthMode==='fixed'?'Fixed length':'Minimum length'} value={lengthValue} onValueChange={setLengthValue}/><Select label="Length unit" value={lengthUnit} options={[{id:'days',label:'Inclusive days'},{id:'nights',label:'Nights'}]} onValueChange={v=>setLengthUnit(v==='nights'?'nights':'days')}/>{lengthMode==='bounded'&&<TextField label="Maximum length" value={maxLength} onValueChange={setMaxLength}/>}</>}<Select label="Month navigation" value={calendarNavigation} options={['linked','independent'].map(id=>({id,label:id}))} onValueChange={v=>setCalendarNavigation(v==='independent'?'independent':'linked')}/><Select label="Calendar layout" value={calendarLayout} options={['paged','scroll'].map(id=>({id,label:id}))} onValueChange={v=>setCalendarLayout(v==='scroll'?'scroll':'paged')}/><Select label="Commit behavior" value={commitBehavior} options={['apply','immediate'].map(id=>({id,label:id}))} onValueChange={v=>setCommitBehavior(v==='immediate'?'immediate':'apply')}/><Checkbox label="Endpoint availability rule" checked={availabilityRule} onCheckedChange={setAvailabilityRule}/><Checkbox label="Show endpoint fields" checked={showFields} onCheckedChange={setShowFields}/><Checkbox label="Show range actions" checked={showActions} onCheckedChange={setShowActions}/><Checkbox label="Grouped presets" checked={groupedPresets} onCheckedChange={setGroupedPresets}/>{calendarLayout==='scroll'&&<TextField label="Scrollable months" value={scrollMonths} onValueChange={setScrollMonths}/>}<Checkbox label="Day markers" checked={markers} onCheckedChange={setMarkers}/></>}
      {(kind==='DatePicker'||kind==='DateRangePicker')&&<Select label="Popup presentation" value={presentation} options={['popover','dialog','drawer','auto'].map(id=>({id,label:id}))} onValueChange={v=>setPresentation(v as typeof presentation)}/>}
      {isRange && <Select label="Preset placement" value={presetPlacement} options={[{id:'above',label:'Above calendars'},{id:'side',label:'Before calendars'},{id:'end',label:'After calendars'}]} onValueChange={value=>setPresetPlacement(value==='end'?'end':value==='side'?'side':'above')}/>}
      {isRange&&calendarNavigation==='independent'&&calendarLayout==='paged'&&<Checkbox label="Assign From/To calendars" checked={assignEndpoints} onCheckedChange={setAssignEndpoints}/>}
      {isRange && <Checkbox label="Show presets" checked={presets} onCheckedChange={setPresets} />}
      {kind === 'Calendar' && <Checkbox label="Multiple selection" checked={multiple} onCheckedChange={setMultiple} />}
      {(kind === 'DateField' || kind === 'DatePicker') && <Checkbox label="Include time segments" checked={dateTime} onCheckedChange={next => {setDateTime(next); setValue(next ? '2026-10-14T09:30:00' : '2026-10-14');}} />}
      <Button variant="outlined" onPress={() => {setValue(null); setRange(null); setDates([]);}}>Clear committed value</Button>
    </ControlRow>
  </Stack> : undefined;
  return <Example title={titles[scenario]} density={density} controls={controls} description={scenario === 'playground' ? 'Explore ISO values, field states and host-owned availability. The selected example theme also applies to picker portals.' : scenario === 'form' ? 'Native fields serialize local values. Hosts own persistence, timezone and availability policy.' : 'Compare segment, calendar and action target spacing in an independent scope.'} source={source({name:kind + scenario[0].toUpperCase() + scenario.slice(1), imports:[expImport(imports),primitivesImport], state, body:`<ThemeScope density=${literal(density)}>\n${content}\n</ThemeScope>`})}>{rendered}</Example>;
}
function datePage(kind:DateKind) {
  return function DatePage() {return <Stack gap={4}>{(['playground','compact','comfortable','form'] as const).map(scenario => <DateScenario key={scenario} kind={kind} scenario={scenario} />)}{kind === 'Calendar' && <><CalendarFootprintExample density="compact"/><CalendarFootprintExample density="comfortable"/><CalendarDropdownExample/><RangeDropdownExample months={1}/><RangeDropdownExample months={2}/><RangePresetExample months={1}/><RangePresetExample months={2}/></>}{kind === 'TimeField' && <><TimeTextExample cycle={12}/><TimeTextExample cycle={24}/></>}{kind === 'DatePicker' && <><AvailabilityParityExample mode="text"/><AvailabilityParityExample mode="segments"/><AvailabilityParityExample mode="datetime"/><CalendarDropdownExample/><BirthdayExample calendar/><BirthdayExample/><DateTimePickerExample hourCycle={24}/><DateTimePickerExample hourCycle={12}/></>}{kind === 'Calendar' && <><BirthdayExample calendar/><DateTimePickerExample hourCycle={24}/></>}{kind === 'DateField' && <BirthdayExample/>}{kind === 'DateRangePicker' && <><RangeTextExample/><RangeDropdownExample months={1}/><RangeDropdownExample months={2}/><RangePresetExample months={1}/><RangePresetExample months={2}/></>}{(kind === 'Calendar' || kind === 'DateRangeSelector' || kind === 'DateRangePicker') && <CalendarMonthsExample kind={kind}/>}{(kind === 'DateRangeSelector' || kind === 'DateRangePicker') && <RangePresetExample placement="end" inline={kind==='DateRangeSelector'}/>}{(kind==='DateRangeSelector'||kind==='DateRangePicker')&&(['restart','adjust-end','adjust-start','adjust-boundaries'] as const).map(behavior=><RangeBehaviorExample key={behavior} kind={kind} behavior={behavior}/>)}{(kind==='DateRangePicker'||kind==='DateRangeSelector')&&(['travel','fixed','independent','scroll','endpoint','immediate','availability'] as const).map(scenario=><AdvancedRangeExample key={scenario} kind={kind} scenario={scenario}/>)}{kind === 'DateField' && <TimezoneInstantExample />}{(kind==='DateField'||kind==='DatePicker'||kind==='DateRangeSelector'||kind==='DateRangePicker')&&<RelativeDateExample kind={kind}/>}{kind === 'DateRangeSelector' && <><RangePresetExample inline/><LocalizedRangeExample locale="de-DE"/><LocalizedRangeExample locale="ar-EG"/></>}</Stack>;};
}

function PeriodPage(){return <AdvancedCalendarExamples kind="PeriodPicker"/>;}
function DateTimeRangePage(){return <AdvancedCalendarExamples kind="DateTimeRangePicker"/>;}
function ComparisonPage(){return <AdvancedCalendarExamples kind="DateRangeComparisonPicker"/>;}
export const formsDateEntries: CatalogEntry[] = [
  {slug:'period-picker',title:'PeriodPicker',description:'Select a whole week, month, quarter or year.',exports:['PeriodPicker'],Playground:PeriodPage},
  {slug:'date-time-range-picker',title:'DateTimeRangePicker',description:'Local start/end datetime drafting with minute increments and atomic Apply.',exports:['DateTimeRangePicker'],Playground:DateTimeRangePage},
  {slug:'date-range-comparison-picker',title:'DateRangeComparisonPicker',description:'Compare a primary interval with a previous period, previous year or custom range.',exports:['DateRangeComparisonPicker'],Playground:ComparisonPage},
  {slug:'search-field',title:'SearchField',description:'Reusable search with clear action, alias matching, portaled results and keyboard navigation.',exports:['SearchField'],Playground:SearchFieldExamples},
  {slug:'text-field', title:'TextField', description:'Single-line inputs with controlled values, native validation and input-type variations.', exports:['TextField'], Playground:formPage('TextField')},
  {slug:'text-area', title:'TextArea', description:'Multiline content, configurable rows, descriptions and native form participation.', exports:['TextArea'], Playground:formPage('TextArea')},
  {slug:'select', title:'Select', description:'Choose stable host option IDs using an accessible popup selector.', exports:['Select'], Playground:formPage('Select')},
  {slug:'combo-box', title:'ComboBox', description:'Search locally supplied options with keyboard selection and controlled host state.', exports:['ComboBox','Autocomplete'], Playground:formPage('ComboBox')},
  {slug:'async-multi-select', title:'AsyncMultiSelect', description:'Search and select multiple records with loading, error, retry and retained selections.', exports:['AsyncMultiSelect'], Playground:formPage('AsyncMultiSelect')},
  {slug:'checkbox', title:'Checkbox', description:'Binary and mixed choices with validation, descriptions and named form values.', exports:['Checkbox'], Playground:formPage('Checkbox')},
  {slug:'switch', title:'Switch', description:'A controlled binary preference with descriptive and read-only states.', exports:['Switch'], Playground:formPage('Switch')},
  {slug:'radio-group', title:'RadioGroup', description:'Mutually exclusive choices with orientation, disabled options and validation.', exports:['RadioGroup'], Playground:formPage('RadioGroup')},
  {slug:'toggle-button', title:'ToggleButton', description:'Pressed-state actions with host-controlled selection and local density.', exports:['ToggleButton'], Playground:formPage('ToggleButton')},
  {slug:'toggle-button-group', title:'ToggleButtonGroup', description:'Single or multiple pressed actions with empty-selection and orientation controls.', exports:['ToggleButtonGroup'], Playground:formPage('ToggleButtonGroup')},
  {slug:'tag-group', title:'TagGroup', description:'Host-owned removable tags with neutral and primary tones and empty content.', exports:['TagGroup'], Playground:formPage('TagGroup')},
  {slug:'date-field', title:'DateField', description:'Segmented ISO date and local datetime inputs with bounds and hour-cycle controls.', exports:['DateField'], Playground:datePage('DateField')},
  {slug:'time-field', title:'TimeField', description:'Flexible time text entry with a selection dropdown, business-hour limits and 12/24-hour presentation.', exports:['TimeField'], Playground:datePage('TimeField')},
  {slug:'calendar', title:'Calendar', description:'One to three months with single/multiple selection and host availability explanations.', exports:['Calendar'], Playground:datePage('Calendar')},
  {slug:'date-picker', title:'DatePicker', description:'Flexible date text entry and a scoped calendar popup with clear and availability handling.', exports:['DatePicker'], Playground:datePage('DatePicker')},
  {slug:'date-range-picker', title:'DateRangePicker', description:'Type a date range or a relative period, or open the calendar to choose dates.', exports:['DateRangePicker'], Playground:datePage('DateRangePicker')},
  {slug:'date-range-selector', title:'DateRangeSelector', description:'Inline range drafting, named preset descriptions, Apply and Cancel transactions.', exports:['DateRangeSelector','getRelativeDateRange','getDateRangeLength'], Playground:datePage('DateRangeSelector')},
];
