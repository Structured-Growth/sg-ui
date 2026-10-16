'use client';
import {useState} from 'react';
import {Button, DateField, Select, TextField, dateTimeToInstant} from '@structured-growth/sg-ui/experimental';
import {Stack, Typography} from '@structured-growth/sg-ui/primitives';
import {Example} from '../components/Example';
import {exampleSource, literal} from './source';

export function NativeResetFormExample() {
  const [name,setName]=useState('Alex Learner');
  const [result,setResult]=useState('');
  const state=`  const [name,setName]=useState(${literal(name)});\n  const [result,setResult]=useState(${literal(result)});`;
  const body=`<form aria-label="Course registration" onReset={() => { setName('Alex Learner'); setResult(''); }} onSubmit={event => {
  event.preventDefault();
  const data=new FormData(event.currentTarget);
  setResult('Registration prepared for '+data.get('name')+' ('+data.get('email')+'). Host owns persistence.');
}}>
  <Stack gap={3}>
    <TextField label="Learner name" name="name" required value={name} onValueChange={setName} />
    <TextField label="Contact email" name="email" type="email" required defaultValue="alex@example.com" />
    <Stack direction="row" wrap gap={2}><Button type="submit">Prepare registration</Button><Button type="reset" variant="outlined">Reset registration</Button></Stack>
    <Typography role="status">{result}</Typography>
  </Stack>
</form>`;
  return <Example title="Native form reset" description="Native reset restores the uncontrolled email default. The host explicitly restores the controlled name and clears its submission result. Required and email validation run before submission; no account or network request is made." source={exampleSource({name:'RegistrationForm',imports:["import { Button, TextField } from '@structured-growth/sg-ui/experimental';","import { Stack, Typography } from '@structured-growth/sg-ui/primitives';"],state,body})}>
    <form aria-label="Course registration" onReset={()=>{setName('Alex Learner');setResult('');}} onSubmit={event=>{event.preventDefault();const data=new FormData(event.currentTarget);setResult('Registration prepared for '+data.get('name')+' ('+data.get('email')+'). Host owns persistence.');}}>
      <Stack gap={3}><TextField label="Learner name" name="name" required value={name} onValueChange={setName}/><TextField label="Contact email" name="email" type="email" required defaultValue="alex@example.com"/>
        <Stack direction="row" wrap gap={2}><Button type="submit">Prepare registration</Button><Button type="reset" variant="outlined">Reset registration</Button></Stack><Typography role="status">{result}</Typography>
      </Stack>
    </form>
  </Example>;
}

export function TimezoneInstantExample() {
  const [value,setValue]=useState<string|null>('2026-11-01T01:30:00');
  const [zone,setZone]=useState('America/Chicago');
  const [resolution,setResolution]=useState<'reject'|'earlier'|'later'>('reject');
  const [result,setResult]=useState('');
  const zones=[{id:'America/Chicago',label:'America/Chicago'},{id:'Asia/Tokyo',label:'Asia/Tokyo'}];
  const resolutions=[{id:'reject',label:'Reject ambiguous or missing time'},{id:'earlier',label:'Earlier instant'},{id:'later',label:'Later instant'}];
  function resolve() {try {setResult(value?dateTimeToInstant(value,zone,resolution):'Choose a complete local datetime.');} catch {setResult('This local time is ambiguous or unavailable. Choose another time or an explicit resolution.');}}
  const state=`  const [value,setValue]=useState<string|null>(${value===null?'null':literal(value)});
  const [zone,setZone]=useState(${literal(zone)});
  const [resolution,setResolution]=useState<'reject'|'earlier'|'later'>(${literal(resolution)});
  const [result,setResult]=useState(${literal(result)});
  function resolve() {try {setResult(value?dateTimeToInstant(value,zone,resolution):'Choose a complete local datetime.');} catch {setResult('This local time is ambiguous or unavailable. Choose another time or an explicit resolution.');}}`;
  const body=`<Stack gap={3}>
  <DateField label="Local session start" kind="datetime" value={value} onValueChange={setValue} hourCycle={24} />
  <Select label="Host timezone" options={${JSON.stringify(zones)}} value={zone} onValueChange={next=>{if(next)setZone(next);}} />
  <Select label="Clock change policy" options={${JSON.stringify(resolutions)}} value={resolution} onValueChange={next=>{if(next==='reject'||next==='earlier'||next==='later')setResolution(next);}} />
  <Button onPress={resolve}>Resolve session instant</Button>
  <Typography role="status">{result}</Typography>
</Stack>`;
  return <Example title="Local datetime and host timezone" description="DateField produces a timezone-free local datetime. The host chooses the IANA timezone and rejects ambiguous or nonexistent clock-change times by default. Earlier/later are explicit host resolutions. Civil dates and date ranges stay YYYY-MM-DD values and are never converted merely for calendar display." source={exampleSource({name:'SessionInstant',imports:["import { Button, DateField, Select, dateTimeToInstant } from '@structured-growth/sg-ui/experimental';","import { Stack, Typography } from '@structured-growth/sg-ui/primitives';"],state,body})}>
    <Stack gap={3}><DateField label="Local session start" kind="datetime" value={value} onValueChange={setValue} hourCycle={24}/><Select label="Host timezone" options={zones} value={zone} onValueChange={next=>{if(next)setZone(next);}}/><Select label="Clock change policy" options={resolutions} value={resolution} onValueChange={next=>{if(next==='reject'||next==='earlier'||next==='later')setResolution(next);}}/><Button onPress={resolve}>Resolve session instant</Button><Typography role="status">{result}</Typography></Stack>
  </Example>;
}
