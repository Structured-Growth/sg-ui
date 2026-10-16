import {useId, useState} from 'react';
import {Box, Button, Card, CardContent, Checkbox, Divider, RadioGroup, Stack, Surface, Tabs, TextArea, TextField} from '@structured-growth/sg-ui/experimental';
import {Typography} from '@structured-growth/sg-ui/primitives';
import {Provider, ThemeScope, type Density} from '@structured-growth/sg-ui/theme';
import type {Meta, StoryObj} from '../../../types';
const meta = {title:'Migration proofs/Primitive acceptance', decorators:[(Story)=><Provider><Story/></Provider>]} satisfies Meta;
export default meta;
type Story=StoryObj;
export const Layout:Story={render:()=> <Box container padding={3} data-testid="container">
  <Stack data-testid="responsive" direction="row" responsive wrap gap={3}>
    {(['light','dark'] as const).map(theme=><ThemeScope key={theme} theme={theme} style={{flex:'1 1 16rem',minInlineSize:0}}>
      <Surface data-testid={theme+'-surface'} tone="subtle" padding={2} variant="raised">
        <Card variant="outlined"><CardContent><Typography>{theme==='light'?'Light':'Dark'} contact</Typography>
          <Divider/><Button>{theme==='light'?'First':'Second'} action</Button><Divider decorative/>
        </CardContent></Card>
      </Surface>
    </ThemeScope>)}
  </Stack>
  <Stack data-testid="wrapping" direction="row" wrap gap={2} style={{inlineSize:'min(100%,15rem)'}}>
    {[1,2,3].map(n=><Box key={n} data-testid="wrap-item" style={{inlineSize:'7rem',blockSize:'2rem'}}><Typography>{n}</Typography></Box>)}
  </Stack>
</Box>};
function Fields(){
  const id=useId(); const [prevent,setPrevent]=useState(true); const [generation,setGeneration]=useState(0); const [requests,setRequests]=useState<string[]>([]);
  return <div onReset={event=>{if(prevent)event.preventDefault();}}>
    <Checkbox label="Cancel reset" checked={prevent} onCheckedChange={setPrevent}/>
    <Button onPress={()=>setGeneration(n=>n+1)}>Replace form</Button>
    <form key={generation} id={id+'-form'} aria-label="Grouped contact" onSubmit={event=>event.preventDefault()}>
      <fieldset aria-describedby={id+'-help'}><legend>Contact details</legend><Typography id={id+'-help'}>Both names are required.</Typography>
        <TextField label="Given name" name="given" required defaultValue="Alex" aria-describedby={id+'-help'} errorMessage="Enter given name."/>
        <TextField label="Family name" name="family" required defaultValue="Learner" aria-describedby={id+'-help'} errorMessage="Enter family name."/>
      </fieldset>
      <Button type="submit">Validate contact</Button><Button type="reset">Reset contact</Button>
    </form>
    <TextArea form={id+'-form'} label="Contact summary" name="summary" required defaultValue={generation?'Latest summary':'Initial summary'} onValueChange={next=>setRequests(items=>[...items,next])}/>
    <TextArea form={id+'-form'} label="Host summary" name="host" value="Host summary" onValueChange={next=>setRequests(items=>[...items,next])}/>
    <output aria-label="Field requests">{JSON.stringify(requests)}</output>
  </div>;
}
export const GroupedFields:Story={render:()=> <Fields/>};
function Radios(){
  const [mode,setMode]=useState<'empty'|'disabled'|'enabled'>('empty'); const [prevent,setPrevent]=useState(true); const [latest,setLatest]=useState<string|undefined>(undefined); const [requests,setRequests]=useState<string[]>([]);
  return <div onReset={event=>{if(prevent)event.preventDefault();}}>
    <Checkbox label="Cancel radio reset" checked={prevent} onCheckedChange={setPrevent}/>
    <Button onPress={()=>setMode('disabled')}>Disable all choices</Button><Button onPress={()=>setMode('enabled')}>Enable choices</Button><Button onPress={()=>setLatest('review')}>Replace radio default</Button>
    <form aria-label="Required choices" onSubmit={event=>event.preventDefault()}>
      <Button>Before choices</Button>
      <RadioGroup label="Delivery" name="delivery" required defaultValue={latest} options={mode==='empty'?[]:[{value:'self',label:'Self',disabled:mode==='disabled'},{value:'live',label:'Live',disabled:mode==='disabled'},{value:'review',label:'Review',disabled:mode==='disabled'}]} onValueChange={next=>setRequests(items=>[...items,next])}/>
      <Button>After choices</Button><Button type="reset">Reset choices</Button><Button type="submit">Submit choices</Button>
    </form><output aria-label="Radio requests">{JSON.stringify(requests)}</output>
  </div>;
}
export const RequiredChoices:Story={render:()=> <Radios/>};
function ControlledTabsCase({density,orientation,activation}:{density:Density;orientation:'horizontal'|'vertical';activation:'automatic'|'manual'}){
  const [accept,setAccept]=useState(false); const [value,setValue]=useState('first'); const [requests,setRequests]=useState<string[]>([]);
  return <ThemeScope density={density}><section aria-label={`${density} ${orientation} ${activation}`}>
    <Checkbox label="Accept tab requests" checked={accept} onCheckedChange={setAccept}/>
    <Tabs label="Controlled settings" value={value} onValueChange={next=>{setRequests(items=>[...items,next]);if(accept)setValue(next);}} orientation={orientation} activation={activation}
      style={orientation==='vertical'?{blockSize:'6rem',inlineSize:'min(100%, 22rem)'}:{inlineSize:'min(100%, 14rem)'}} items={[
        {id:'first',label:'First',content:'First content'},{id:'locked',label:'Unavailable',disabled:true,content:'Unavailable content'},
        {id:'last',label:'Last',content:'Last content'}]}/>
    <output aria-label="Tab requests">{JSON.stringify(requests)}</output>
  </section></ThemeScope>;
}
export const ControlledTabs:Story={render:()=> <>{(['compact','comfortable'] as const).flatMap(density=>(['horizontal','vertical'] as const).flatMap(orientation=>(['automatic','manual'] as const).map(activation=><ControlledTabsCase key={`${density}-${orientation}-${activation}`} {...{density,orientation,activation}}/>)))}</>};
function AutofillCase({policy}:{policy:'uncontrolled'|'accepting'|'rejecting'}){
  const id=useId(); const [email,setEmail]=useState(''); const [address,setAddress]=useState(''); const [owner,setOwner]=useState('a'); const [prevent,setPrevent]=useState(false);
  const [requests,setRequests]=useState<string[]>([]); const [submitted,setSubmitted]=useState('No submission');
  const controlled=policy!=='uncontrolled';
  const request=(field:'email'|'address',next:string)=>{setRequests(items=>[...items,field+':'+next]);if(policy==='accepting'){if(field==='email')setEmail(next);else setAddress(next);}};
  return <section aria-label={policy+' autofill'}>
    <Checkbox label="Cancel autofill reset" checked={prevent} onCheckedChange={setPrevent}/>
    <Button onPress={()=>setOwner(current=>current==='a'?'b':'a')}>Move autofill form</Button>
    {(['a','b'] as const).map(side=><form key={side} id={id+'-'+side} aria-label={'Autofill form '+side} onReset={event=>{if(prevent)event.preventDefault();}} onSubmit={event=>{event.preventDefault();setSubmitted(JSON.stringify(Object.fromEntries(new FormData(event.currentTarget))));}}>
      <Button type="submit">Submit autofill {side}</Button><Button type="reset">Reset autofill {side}</Button>
    </form>)}
    <TextField label="Contact email" name="email" form={id+'-'+owner} type="email" autoComplete="email" {...(controlled?{value:email,onValueChange:(next:string)=>request('email',next)}:{defaultValue:'',onValueChange:(next:string)=>request('email',next)})}/>
    <TextArea label="Postal address" name="address" form={id+'-'+owner} autoComplete="street-address" {...(controlled?{value:address,onValueChange:(next:string)=>request('address',next)}:{defaultValue:'',onValueChange:(next:string)=>request('address',next)})}/>
    <TextField label="Read only contact" name="readOnly" form={id+'-'+owner} autoComplete="email" readOnly value="readonly@example.test"/>
    <TextField label="Disabled contact" name="disabled" form={id+'-'+owner} autoComplete="email" disabled defaultValue="disabled@example.test"/>
    <output aria-label="Autofill requests">{JSON.stringify(requests)}</output><output aria-label="Autofill submission">{submitted}</output>
  </section>;
}
/** Operator must select actual browser autofill UI; scripted filling is not evidence. */
export const ProfileAutofill:Story={render:()=> <>{(['uncontrolled','accepting','rejecting'] as const).map(policy=><AutofillCase key={policy} policy={policy}/>)}</>};
