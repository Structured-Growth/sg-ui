'use client';
import {useState} from 'react';
import {TextField,TextArea,Select,ComboBox,AsyncMultiSelect,type MultiSelectOption} from '@structured-growth/sg-ui/experimental';
import {Box,Stack} from '@structured-growth/sg-ui/primitives';
import {SearchIcon,SchoolIcon} from '@structured-growth/sg-ui/icons';
import type {Density} from '@structured-growth/sg-ui/theme';
import {Example} from '../components/Example';
import {exampleSource} from './source';

type Kind='TextField'|'TextArea'|'Select'|'ComboBox'|'AsyncMultiSelect';
type Position='none'|'start'|'end'|'both';
const options=[{id:'design',label:'Design systems'},{id:'research',label:'User research'},{id:'engineering',label:'Engineering'}];
const names:Record<Position,string>={none:'Placeholder only',start:'Icon at the start',end:'Icon at the end',both:'Icons at both ends'};
export function FieldIconExamples({kind}:{kind:Kind}){
 return <Stack gap={4}>{(['compact','comfortable'] as const).flatMap(density=>(['none','start','end','both'] as const).map(position=><FieldIconExample key={`${density}-${position}`} kind={kind} density={density} position={position}/>))}</Stack>;
}
function FieldIconExample({kind,density,position}:{kind:Kind;density:Density;position:Position}){
 const [text,setText]=useState('');
 const [value,setValue]=useState<string|null>(null);
 const [selected,setSelected]=useState<MultiSelectOption[]>([]);
 const start=position==='start'||position==='both',end=position==='end'||position==='both';
 const label=kind==='TextField'?'Search courses':'Course subject';
 const placeholder=kind==='Select'?'Choose a course subject':'Search course subjects';
 const icons={startIcon:start?<SearchIcon size={16}/>:undefined,endIcon:end?<SchoolIcon size={16}/>:undefined};
 const iconCode=`${start?' startIcon={<SearchIcon size={16}/>}':''}${end?' endIcon={<SchoolIcon size={16}/>}':''}`;
 const props=`label=${JSON.stringify(label)} placeholder=${JSON.stringify(placeholder)}${iconCode}`;
 let body='',state='';
 if(kind==='TextField'||kind==='TextArea'){
  body=`<${kind} ${props}${kind==='TextField'?' type="search"':' rows={3}'} value={text} onValueChange={setText}/>`;
  state=`  const [text,setText]=useState(${JSON.stringify(text)});`;
 }else if(kind==='AsyncMultiSelect'){
  body=`<AsyncMultiSelect ${props} query={query} onQueryChange={setQuery} options={options.filter(option=>option.label.toLowerCase().includes(query.toLowerCase()))} value={selected} onValueChange={setSelected}/>`;
  state=`  const options=${JSON.stringify(options)};\n  const [query,setQuery]=useState(${JSON.stringify(text)});\n  const [selected,setSelected]=useState<MultiSelectOption[]>(${JSON.stringify(selected)});`;
 }else{
  body=`<${kind} ${props} options={options} value={value} onValueChange={setValue}/>`;
  state=`  const options=${JSON.stringify(options)};\n  const [value,setValue]=useState<string|null>(${JSON.stringify(value)});`;
 }
 return <Example title={`${names[position]} — ${density}`} density={density} description="This field starts empty so its placeholder is visible. The icons are decorative and follow the text direction; they add no tab stops. The visible label remains the accessible name. Selection controls keep their dropdown action; fetching and search results belong to the host." source={exampleSource({name:`${kind}${density}${position}`,imports:[`import {${kind}${kind==='AsyncMultiSelect'?',type MultiSelectOption':''}} from '@structured-growth/sg-ui/experimental';`,"import {Box} from '@structured-growth/sg-ui/primitives';",...(start||end?[`import {${[start?'SearchIcon':'',end?'SchoolIcon':''].filter(Boolean).join(',')}} from '@structured-growth/sg-ui/icons';`]:[])],state,body:`<ThemeScope density="${density}">\n<Box style={{inlineSize:'22rem',maxInlineSize:'100%'}}>\n${body}\n</Box>\n</ThemeScope>`})}>
 <Box style={{inlineSize:'22rem',maxInlineSize:'100%'}}>{kind==='TextField'?<TextField label={label} placeholder={placeholder} type="search" {...icons} value={text} onValueChange={setText}/>:kind==='TextArea'?<TextArea label={label} placeholder={placeholder} rows={3} {...icons} value={text} onValueChange={setText}/>:kind==='AsyncMultiSelect'?<AsyncMultiSelect label={label} placeholder={placeholder} {...icons} query={text} onQueryChange={setText} options={options.filter(option=>option.label.toLowerCase().includes(text.toLowerCase()))} value={selected} onValueChange={setSelected}/>:kind==='Select'?<Select label={label} placeholder={placeholder} {...icons} options={options} value={value} onValueChange={setValue}/>:<ComboBox label={label} placeholder={placeholder} {...icons} options={options} value={value} onValueChange={setValue}/>}</Box>
 </Example>;
}
