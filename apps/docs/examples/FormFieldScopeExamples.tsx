'use client';
import {useState} from 'react';
import {FormFieldScope,TextField,Select,Stack} from '@structured-growth/sg-ui';
import {TextArea} from '@structured-growth/sg-ui/experimental';
import {Example} from '../components/Example';
import {exampleSource,literal} from './source';

type Placement='above'|'below';
export function FormFieldScopeExamples(){return <Stack gap={4}><ScopeExample/>{(['compact','comfortable'] as const).map(density=><ScopeExample key={density} density={density}/>)}</Stack>;}
function ScopeExample({density}:{density?:'compact'|'comfortable'}){
 const [descriptionPlacement,setDescriptionPlacement]=useState<Placement>('below');
 const [errorPlacement,setErrorPlacement]=useState<Placement>('above');
 const [name,setName]=useState('Ada');const [country,setCountry]=useState('us');const [notes,setNotes]=useState('');
 const body=`<FormFieldScope descriptionPlacement="${descriptionPlacement}" errorPlacement="${errorPlacement}">
  <Stack gap={4} align="start">
    <TextField label="Name" description="As shown on your account." value={name} onValueChange={setName} invalid errorMessage="Confirm your name."/>
    <FormFieldScope errorPlacement="below">
      <Select label="Country" description="Where you live." options={[{id:'us',label:'United States'},{id:'ca',label:'Canada'}]} value={country} onValueChange={value=>setCountry(value??'')} invalid errorMessage="Confirm your country."/>
    </FormFieldScope>
    <TextArea label="Notes" description="Optional details." descriptionPlacement="above" errorPlacement="below" value={notes} onValueChange={setNotes}/>
  </Stack>
</FormFieldScope>`;
 const source=exampleSource({name:'ScopedFormFields',imports:["import {FormFieldScope,TextField,Select,Stack} from '@structured-growth/sg-ui';","import {TextArea} from '@structured-growth/sg-ui/experimental';"],state:`  const [name,setName]=useState(${literal(name)});\n  const [country,setCountry]=useState(${literal(country)});\n  const [notes,setNotes]=useState(${literal(notes)});`,body:density?`<ThemeScope density="${density}">\n${body}\n</ThemeScope>`:body});
 const options=[{id:'above',label:'Above control'},{id:'below',label:'Below control'}];
 return <Example title={density?`Nested defaults and field overrides — ${density}`:'Prop playground'} density={density} source={source} controls={!density?<Stack direction="row" wrap gap={3}><Select label="Scope description placement" options={options} value={descriptionPlacement} onValueChange={value=>setDescriptionPlacement(value as Placement)}/><Select label="Scope error placement" options={options} value={errorPlacement} onValueChange={value=>setErrorPlacement(value as Placement)}/></Stack>:undefined}>
 <FormFieldScope descriptionPlacement={descriptionPlacement} errorPlacement={errorPlacement}><Stack gap={4} align="start">
 <TextField label="Name" description="As shown on your account." value={name} onValueChange={setName} invalid errorMessage="Confirm your name."/>
 <FormFieldScope errorPlacement="below"><Select label="Country" description="Where you live." options={[{id:'us',label:'United States'},{id:'ca',label:'Canada'}]} value={country} onValueChange={value=>setCountry(value??'')} invalid errorMessage="Confirm your country."/></FormFieldScope>
 <TextArea label="Notes" description="Optional details." descriptionPlacement="above" errorPlacement="below" value={notes} onValueChange={setNotes}/>
 </Stack></FormFieldScope>
 </Example>;
}
