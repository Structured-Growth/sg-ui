'use client';
import {useId, useState} from 'react';
import {Button, Stack, TextField, Typography} from '@structured-growth/sg-ui/primitives';
import {Example} from '../components/Example';
import {literal} from './source';

/** One state owner per Example. IDs are unique even when two panels are mounted. */
export function GroupedContactExample() {
  const id = useId();
  const [given, setGiven] = useState('Alex');
  const [result, setResult] = useState('');
  const source = `import {useId, useState} from 'react';
import {Button, Stack, TextField, Typography} from '@structured-growth/sg-ui/primitives';

export function ContactForm() {
  const id = useId();
  const [given, setGiven] = useState(${literal(given)});
  const [result, setResult] = useState(${literal(result)});
  return <form onReset={() => {setGiven('Alex'); setResult('');}} onSubmit={event => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setResult('Contact prepared for ' + data.get('given') + ' ' + data.get('family') + '. Host owns persistence.');
  }}>
    <fieldset aria-describedby={id + '-help'}>
      <legend>Course contact</legend>
      <Typography id={id + '-help'}>Supply both names for the course contact.</Typography>
      <Stack gap={3}>
        <TextField label="Given name" name="given" autoComplete="given-name" required value={given} onValueChange={setGiven}
          aria-describedby={id + '-help'} errorMessage="Enter a given name." />
        <TextField label="Family name" name="family" autoComplete="family-name" required defaultValue="Learner"
          aria-describedby={id + '-help'} errorMessage="Enter a family name." />
        <Stack direction="row" gap={2} wrap><Button type="submit">Prepare contact</Button><Button type="reset" variant="outlined">Reset contact</Button></Stack>
        <Typography role="status">{result}</Typography>
      </Stack>
    </fieldset>
  </form>;
}`;
  return <Example title="Grouped contact fields" source={source} description="Native fieldset and legend name the group. Each field has its own label and native validation error, plus shared guidance. Reset restores the uncontrolled family name and the host explicitly restores the controlled given name. Submission prepares a local result; the host owns persistence.">
    <form onReset={() => {setGiven('Alex');setResult('');}} onSubmit={event=>{event.preventDefault(); const data=new FormData(event.currentTarget);setResult('Contact prepared for '+data.get('given')+' '+data.get('family')+'. Host owns persistence.');}}>
      <fieldset aria-describedby={id+'-help'}><legend>Course contact</legend>
        <Typography id={id+'-help'}>Supply both names for the course contact.</Typography>
        <Stack gap={3}>
          <TextField label="Given name" name="given" autoComplete="given-name" required value={given} onValueChange={setGiven} aria-describedby={id+'-help'} errorMessage="Enter a given name."/>
          <TextField label="Family name" name="family" autoComplete="family-name" required defaultValue="Learner" aria-describedby={id+'-help'} errorMessage="Enter a family name."/>
          <Stack direction="row" gap={2} wrap><Button type="submit">Prepare contact</Button><Button type="reset" variant="outlined">Reset contact</Button></Stack>
          <Typography role="status">{result}</Typography>
        </Stack>
      </fieldset>
    </form>
  </Example>;
}
