import {useEffect, useId, useRef, useState} from 'react';
import {Button, Checkbox, TextArea, TextField} from '@structured-growth/sg-ui/experimental';
import {Provider} from '@structured-growth/sg-ui/theme';
import type {Meta, StoryObj} from '../../../types';
const meta = {title: 'Migration proofs/Form participation', decorators: [(Story) => <Provider><Story/></Provider>]} satisfies Meta;
export default meta;
type Story = StoryObj;
type Policy = 'uncontrolled' | 'accepting' | 'rejecting';
const contactFields = [
  {name: 'fullName', label: 'Full name', autoComplete: 'name'},
  {name: 'email', label: 'Email address', autoComplete: 'email', type: 'email' as const},
  {name: 'city', label: 'City', autoComplete: 'address-level2'},
  {name: 'postcode', label: 'Postal code', autoComplete: 'postal-code'},
];
function AutofillForm({policy,native = false}: {policy: Policy;native?:boolean}) {
  const id = useId();
  const [owner, setOwner] = useState<'a' | 'b'>('a');
  const [cancel, setCancel] = useState(false);
  const [values, setValues] = useState<Record<string, string>>({});
  const [requests, setRequests] = useState<{name: string; value: string}[]>([]);
  const [events, setEvents] = useState<{type: string; trusted: boolean; name: string; value:string}[]>([]);
  const observedEvents=useRef<typeof events>([]);
  const eventTask=useRef<ReturnType<typeof setTimeout>|null>(null);
  useEffect(()=>()=>{if(eventTask.current!==null)clearTimeout(eventTask.current);},[]);
  const [submissions, setSubmissions] = useState<{owner: string; values: Record<string, FormDataEntryValue>}[]>([]);
  const request = (name: string, value: string) => {
    setRequests(previous => [...previous, {name, value}]);
    if (policy === 'accepting') setValues(previous => ({...previous, [name]: value}));
  };
  const control = (name: string) => policy === 'uncontrolled'
    ? {defaultValue: '', onValueChange: (value: string) => request(name, value)}
    : {value: values[name] ?? '', onValueChange: (value: string) => request(name, value)};
  const form = `${id}-${owner}`;
  return <section aria-label={`${policy} native autofill${native?' baseline':''}`} onInputCapture={event => {
    const input = event.target as HTMLInputElement | HTMLTextAreaElement;
    observedEvents.current.push({type:event.type,trusted:event.isTrusted,name:input.name,value:input.value});
    // Capture must not rerender controlled fields before React's bubble onChange.
    // Keep trusted-event telemetry observational until the native event completes.
    if(eventTask.current===null)eventTask.current=setTimeout(()=>{eventTask.current=null;setEvents([...observedEvents.current]);},0);
  }}>
    <Checkbox label="Cancel native autofill reset" checked={cancel} onCheckedChange={setCancel}/>
    <Button onPress={() => setOwner(previous => previous === 'a' ? 'b' : 'a')}>Move native autofill owner</Button>
    {(['a', 'b'] as const).map(side => <form key={side} id={`${id}-${side}`} aria-label={`Native autofill form ${side}`}
      onReset={event => {if (cancel) event.preventDefault();}}
      onSubmit={event => {event.preventDefault(); const data = Object.fromEntries(new FormData(event.currentTarget));
        setSubmissions(previous => [...previous, {owner: side, values: data}]);}}>
      <Button type="submit">Submit native autofill {side}</Button>
      <Button type="reset">Reset native autofill {side}</Button>
    </form>)}
    {contactFields.map(field => native ? <label key={field.name} htmlFor={`${id}-${field.name}`}>{field.label}<input id={`${id}-${field.name}`} name={field.name} type={field.type??'text'} form={form} autoComplete={`section-${policy} ${field.autoComplete}`} defaultValue="" onChange={event=>request(field.name,event.currentTarget.value)}/></label> : <TextField key={field.name} {...field} form={form} autoComplete={`section-${policy} ${field.autoComplete}`} {...control(field.name)}/>)}
    <>{native?<label htmlFor={`${id}-address`}>Street address<textarea id={`${id}-address`} name="address" form={form} autoComplete={`section-${policy} street-address`} defaultValue="" onChange={event=>request('address',event.currentTarget.value)}/></label>:<TextArea label="Street address" name="address" form={form} autoComplete={`section-${policy} street-address`} {...control('address')}/>}</>
    <TextField label="Read only reference" name="readOnly" form={form} autoComplete="off" readOnly value="REFERENCE-42"/>
    <TextField label="Disabled reference" name="disabled" form={form} autoComplete="off" disabled defaultValue="OMIT-ME"/>
    <output aria-label="Native autofill requests">{JSON.stringify(requests)}</output>
    <output aria-label="Native autofill events">{JSON.stringify(events)}</output>
    <output aria-label="Native autofill submissions">{JSON.stringify(submissions)}</output>
  </section>;
}
/** Browser instrumentation only; CDP sets a synthetic address, never application data. */
export const NativeAutofill: Story = {render: () => <>{(['uncontrolled', 'accepting', 'rejecting'] as const).map(policy => <AutofillForm key={policy} policy={policy}/>)}</>};
export const NativeBaseline: Story = {render: () => <AutofillForm policy="uncontrolled" native/>};
function GroupedForm({name}: {name: string}) {
  const id = useId(); const formId = `${id}-form`; const helpId = `${id}-help`;
  const [cancel, setCancel] = useState(true);
  const [latestDefault, setLatestDefault] = useState('Original summary');
  const [requests, setRequests] = useState<string[]>([]);
  return <section aria-label={`${name} grouped instance`}>
    <Checkbox label="Prevent grouped reset" checked={cancel} onCheckedChange={setCancel}/>
    <Button onPress={() => setLatestDefault('Revised summary')}>Replace grouped default</Button>
    <form id={formId} aria-label={`${name} grouped form`} onSubmit={event => event.preventDefault()} onReset={event => {if (cancel) event.preventDefault();}}>
      <fieldset aria-describedby={helpId}><legend>{name} contact details</legend>
        <p id={helpId}>{name} contact fields are required.</p>
        <TextField label="Given name" name="given" required defaultValue="Alex" aria-describedby={helpId} errorMessage="Enter given name."/>
        <TextField label="Family name" name="family" required defaultValue="Example" aria-describedby={helpId} errorMessage="Enter family name."/>
      </fieldset>
      <Button type="submit">Validate grouped fields</Button><Button type="reset">Reset grouped fields</Button>
    </form>
    <TextArea label="External summary" name="summary" form={formId} required defaultValue={latestDefault} errorMessage="Enter summary."
      onValueChange={value => setRequests(previous => [...previous, value])}/>
    <output aria-label="Grouped field requests">{JSON.stringify(requests)}</output>
  </section>;
}
export const GroupedIsolation: Story = {render: () => <><GroupedForm name="First"/><GroupedForm name="Second"/></>};
