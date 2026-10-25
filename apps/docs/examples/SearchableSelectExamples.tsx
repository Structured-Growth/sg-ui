'use client';

import {useState} from 'react';
import {SearchableSelect, type SearchableSelectProps, type SearchableSelectOption} from '@structured-growth/sg-ui/primitives';
import {Stack, TextField, Select, Switch, Typography, Button} from '@structured-growth/sg-ui/primitives';
import {type Density} from '@structured-growth/sg-ui/theme';
import {SearchIcon} from '@structured-growth/sg-ui/icons';
import {Example} from '../components/Example';
import {exampleSource} from './source';

const states: SearchableSelectOption[] = [
  {id:'al',label:'Alabama',keywords:['AL'],description:'Southeast · Central time'},
  {id:'ca',label:'California',keywords:['CA','Golden State'],description:'West · Pacific time'},
  {id:'ny',label:'New York',keywords:['NY','Empire State'],description:'Northeast · Eastern time'},
  {id:'nm',label:'New Mexico',keywords:['NM'],description:'Southwest · Mountain time'},
  {id:'tx',label:'Texas',keywords:['TX','Lone Star State'],description:'South · Central and Mountain time'},
  {id:'wa',label:'Washington',keywords:['WA','Evergreen State'],description:'Northwest · Pacific time'},
  {id:'unavailable',label:'Unavailable region',disabled:true,description:'Not available for this address'},
];
const enumOptions = (values: readonly string[]) => values.map(value => ({id:value,label:value}));
const imports = ["import {SearchableSelect, type SearchableSelectOption} from '@structured-growth/sg-ui/primitives';"];

export function SearchableSelectExamples() {
  return <Stack gap={4}>
    <SearchableSelectPlayground/>
    {(['input','dropdown'] as const).flatMap(placement => (['compact','comfortable'] as const).map(density =>
      <SearchableSelectReference key={`${placement}-${density}`} title={`${placement === 'input' ? 'Type in the field' : 'Search above the options'} — ${density}`}
        density={density} placement={placement}/>))}
    <SearchableSelectReference title="Abbreviations and alternate names" description="Try TX, Lone Star, CA or Empire. Keywords are supplied by the host; record IDs are never guessed as aliases."/>
    <SearchableSelectReference title="Forgiving spelling" filter="fuzzy" description="Try Txeas or Californa. Exact labels and aliases rank first; typo correction applies only to query words of at least three characters."/>
    <SearchableSelectReference title="Prefix matching" filter="startsWith" description="Try New. Only the beginning of a label or keyword matches."/>
    <SearchableSelectReference title="Read-only selection" placement="dropdown" readOnly defaultValue="tx"/>
    <SearchableSelectReference title="Disabled selection" disabled defaultValue="ca"/>
    <SearchableSelectReference title="Validation and guidance" invalid errorMessage="Choose a delivery state." description="Your delivery address determines available services."/>
    <SearchableSelectReference title="Empty results" empty options={[]}/>
    <SearchableSelectReference title="Loading results" placement="dropdown" loading/>
    <SearchableSelectRetry/>
    <SearchableSelectHostFilter/>
    <SearchableSelectForm/>
  </Stack>;
}

function SearchableSelectPlayground() {
  const [value,setValue] = useState<string|null>(null);
  const [placement,setPlacement] = useState<'input'|'dropdown'>('input');
  const [filter,setFilter] = useState<'contains'|'startsWith'|'fuzzy'>('contains');
  const [density,setDensity] = useState<Density>('comfortable');
  const [label,setLabel] = useState('Delivery state');
  const [placeholder,setPlaceholder] = useState('Type a name or abbreviation');
  const [clearable,setClearable] = useState(true);
  const [disabled,setDisabled] = useState(false);
  const [readOnly,setReadOnly] = useState(false);
  const [required,setRequired] = useState(false);
  const [dataset,setDataset] = useState('ready');
  const loading=dataset==='loading', empty=dataset==='empty', error=dataset==='error';
  const options=empty?[]:states;
  const source=exampleSource({name:'SearchableState',imports:[...imports,"import {SearchIcon} from '@structured-growth/sg-ui/icons';"],
    state:`  const options:SearchableSelectOption[]=${JSON.stringify(options)};\n  const [value,setValue]=useState<string|null>(${JSON.stringify(value)});`,
    body:`<ThemeScope density="${density}">\n<SearchableSelect label={${JSON.stringify(label)}} placeholder={${JSON.stringify(placeholder)}} searchPlaceholder="Search states or abbreviations"\n  options={options} value={value} onValueChange={setValue} searchPlacement="${placement}" filter="${filter}"\n  clearable={${clearable}} disabled={${disabled}} readOnly={${readOnly}} required={${required}} loading={${loading}}\n  ${error?'searchErrorMessage="Unable to load states." ':''}startIcon={<SearchIcon size={16}/>}/>\n</ThemeScope>`});
  return <Example title="Prop playground" density={density} source={source} controls={<Stack gap={3}>
    <Stack direction="row" wrap gap={3}>
      <Select label="Search location" options={enumOptions(['input','dropdown'])} value={placement} onValueChange={next=>setPlacement(next as typeof placement)}/>
      <Select label="Matching" options={enumOptions(['contains','startsWith','fuzzy'])} value={filter} onValueChange={next=>setFilter(next as typeof filter)}/>
      <Select label="Density" options={enumOptions(['compact','comfortable'])} value={density} onValueChange={next=>setDensity(next as Density)}/>
      <Select label="Dataset state" options={enumOptions(['ready','empty','loading','error'])} value={dataset} onValueChange={next=>setDataset(next??'ready')}/>
    </Stack>
    <Stack direction="row" wrap gap={3}><TextField label="Label" value={label} onValueChange={setLabel}/><TextField label="Placeholder" value={placeholder} onValueChange={setPlaceholder}/></Stack>
    <Stack direction="row" wrap gap={3}>
      <Switch label="Clearable" checked={clearable} onCheckedChange={setClearable}/><Switch label="Disabled" checked={disabled} onCheckedChange={setDisabled}/>
      <Switch label="Read only" checked={readOnly} onCheckedChange={setReadOnly}/><Switch label="Required" checked={required} onCheckedChange={setRequired}/>
    </Stack>
  </Stack>}>
    <SearchableSelect label={label} placeholder={placeholder} searchPlaceholder="Search states or abbreviations"
      options={options} value={value} onValueChange={setValue} searchPlacement={placement} filter={filter}
      clearable={clearable} disabled={disabled} readOnly={readOnly} required={required} loading={loading}
      searchErrorMessage={error?'Unable to load states.':undefined} startIcon={<SearchIcon size={16}/>}/>
  </Example>;
}

function SearchableSelectReference({title,description,density='comfortable',placement='input',filter='contains',
  defaultValue=null,options=states,empty=false,...props}: Pick<SearchableSelectProps,'disabled'|'readOnly'|'invalid'|'errorMessage'|'loading'> & {
    title:string;description?:string;density?:Density;placement?:'input'|'dropdown';filter?:'contains'|'startsWith'|'fuzzy';
    defaultValue?:string|null;options?:SearchableSelectOption[];empty?:boolean;
}) {
  const [value,setValue]=useState<string|null>(defaultValue);
  const source=exampleSource({name:'StateSelection',imports,state:`  const options:SearchableSelectOption[]=${JSON.stringify(options)};\n  const [value,setValue]=useState<string|null>(${JSON.stringify(value)});`,
    body:`<ThemeScope density="${density}">\n<SearchableSelect label="State" options={options} value={value} onValueChange={setValue}\n  searchPlacement="${placement}" filter="${filter}" clearable placeholder="Choose a state" searchPlaceholder="Search states"${description?` description={${JSON.stringify(description)}}`:''}${empty?' emptyMessage="No states are available."':''}${Object.entries(props).map(([key,item])=>` ${key}={${JSON.stringify(item)}}`).join('')}/>\n</ThemeScope>`});
  return <Example title={title} density={density} description={description} source={source}>
    <SearchableSelect label="State" options={options} value={value} onValueChange={setValue} searchPlacement={placement}
      filter={filter} clearable placeholder="Choose a state" searchPlaceholder="Search states" description={description}
      emptyMessage={empty?'No states are available.':undefined} {...props}/>
  </Example>;
}

function SearchableSelectRetry() {
  const [failed,setFailed]=useState(true);
  const [value,setValue]=useState<string|null>(null);
  const source=exampleSource({name:'RetryStateOptions',imports,
    state:`  const options:SearchableSelectOption[]=${JSON.stringify(states)};\n  const [failed,setFailed]=useState(${failed});\n  const [value,setValue]=useState<string|null>(${JSON.stringify(value)});`,
    body:'<SearchableSelect label="Delivery state" searchPlacement="dropdown" options={options} value={value} onValueChange={setValue}\n  searchErrorMessage={failed ? "States could not be loaded." : undefined} onRetry={() => setFailed(false)}/>'});
  return <Example title="Search failure and retry" description="Open the dropdown and retry to reveal local sample options. In an application the host runs the request, owns cancellation and rejects stale responses." source={source}>
    <SearchableSelect label="Delivery state" searchPlacement="dropdown" options={states} value={value} onValueChange={setValue}
      searchErrorMessage={failed?'States could not be loaded.':undefined} onRetry={()=>setFailed(false)}/>
  </Example>;
}

function SearchableSelectHostFilter() {
  const [value,setValue]=useState<string|null>(null);
  const match: SearchableSelectProps['filter']=(option,query)=>
    [option.label,...option.keywords??[]].some(text=>text.toLowerCase().startsWith(query.toLowerCase().trim()));
  const source=exampleSource({name:'CustomStateMatcher',imports,
    state:`  const options:SearchableSelectOption[]=${JSON.stringify(states)};\n  const [value,setValue]=useState<string|null>(${JSON.stringify(value)});\n  const match=(option:{label:string;keywords?:readonly string[]},query:string)=>\n    [option.label,...option.keywords??[]].some(text=>text.toLowerCase().startsWith(query.toLowerCase().trim()));`,
    body:'<SearchableSelect label="State" options={options} value={value} onValueChange={setValue} filter={match}/>'});
  return <Example title="Host-defined matching" description={'Supply a predicate for a domain-specific rule. For remote search use filter="none" and onSearchChange; fetching and response ordering stay in the host.'} source={source}>
    <SearchableSelect label="State" options={states} value={value} onValueChange={setValue} filter={match}/>
  </Example>;
}

function SearchableSelectForm() {
  const [result,setResult]=useState('');
  const source=exampleSource({name:'DeliveryForm',imports:[...imports,"import {Button,Stack,Typography} from '@structured-growth/sg-ui/primitives';"],
    state:`  const options:SearchableSelectOption[]=${JSON.stringify(states)};\n  const [result,setResult]=useState(${JSON.stringify(result)});`,
    body:'<form onSubmit={event=>{event.preventDefault();const state=new FormData(event.currentTarget).get("state");setResult(`Address ready for ${state}.`);}} onReset={()=>setResult("")}>\n  <Stack gap={3}>\n    <SearchableSelect label="Delivery state" options={options} name="state" defaultValue="tx" required clearable searchPlacement="dropdown"/>\n    <Stack direction="row" gap={2}><Button type="submit">Use address</Button><Button type="reset" variant="outlined">Reset address</Button></Stack>\n    <Typography role="status">{result}</Typography>\n  </Stack>\n</form>'});
  return <Example title="Native address form" description="Submits a stable state ID and restores the uncontrolled default on reset. This example performs no persistence." source={source}>
    <form onSubmit={event=>{event.preventDefault();const state=new FormData(event.currentTarget).get('state');setResult(`Address ready for ${state}.`);}} onReset={()=>setResult('')}>
      <Stack gap={3}>
        <SearchableSelect label="Delivery state" options={states} name="state" defaultValue="tx" required clearable searchPlacement="dropdown"/>
        <Stack direction="row" gap={2}><Button type="submit">Use address</Button><Button type="reset" variant="outlined">Reset address</Button></Stack>
        <Typography role="status">{result}</Typography>
      </Stack>
    </form>
  </Example>;
}
