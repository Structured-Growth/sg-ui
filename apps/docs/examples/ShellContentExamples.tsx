'use client';
import {useState} from 'react';
import {AuthShell,AppPageHeader} from '@structured-growth/sg-ui/components';
import {Button,Checkbox,Link,TextField,SplitAction} from '@structured-growth/sg-ui/experimental';
import {Stack,Typography} from '@structured-growth/sg-ui/primitives';
import {Example} from '../components/Example';
import {exampleSource,literal} from './source';
const fields=['Full name','Work email','Organization','Role','Team','City','Country'];
export function LongAuthFormExample() {
  const [result,setResult]=useState('');
  const body=`<div role="region" aria-label="Scrollable account form" tabIndex={0} style={{height:420,overflow:'auto'}}>
  <AuthShell title="Join your learning workspace" subtitle="Review the host-owned registration details." style={{minHeight:'100%'}} footerContent={<Stack gap={2}><Typography variant="caption">Your host manages account creation, consent, privacy and data retention. This local example creates no account.</Typography><Link href="#account-help">Account help and privacy information</Link></Stack>}>
    <form onSubmit={event=>{event.preventDefault();setResult('Registration details validated locally. Host owns account creation.');}}>
      <Stack gap={3}>
        {${JSON.stringify(fields)}.map(label=><TextField key={label} label={label} name={label} type={label==='Work email'?'email':'text'} required />)}
        <Checkbox label="I have reviewed the workspace terms" required />
        <Button type="submit">Review account details</Button>
        <Typography role="status">{result}</Typography>
      </Stack>
    </form>
  </AuthShell>
</div>`;
  return <Example title="Long host registration form" description="The host bounds this embedded form to 420px and owns its scrolling. Tab through the fields to reveal the submit action and longer footer. Native validation and a local result illustrate host integration without authentication APIs." source={exampleSource({name:'LongAccountForm',imports:["import {AuthShell} from '@structured-growth/sg-ui/components';","import {Button,Checkbox,Link,TextField} from '@structured-growth/sg-ui/experimental';","import {Stack,Typography} from '@structured-growth/sg-ui/primitives';"],state:`  const [result,setResult]=useState(${literal(result)});`,body})}>
    <div role="region" aria-label="Scrollable account form" tabIndex={0} style={{height:420,overflow:'auto'}}><AuthShell title="Join your learning workspace" subtitle="Review the host-owned registration details." style={{minHeight:'100%'}} footerContent={<Stack gap={2}><Typography variant="caption">Your host manages account creation, consent, privacy and data retention. This local example creates no account.</Typography><Link href="#account-help">Account help and privacy information</Link></Stack>}><form onSubmit={event=>{event.preventDefault();setResult('Registration details validated locally. Host owns account creation.');}}><Stack gap={3}>{fields.map(label=><TextField key={label} label={label} name={label} type={label==='Work email'?'email':'text'} required/>)}<Checkbox label="I have reviewed the workspace terms" required/><Button type="submit">Review account details</Button><Typography role="status">{result}</Typography></Stack></form></AuthShell></div>
  </Example>;
}
const breadcrumbs=[{label:'Workspace',href:'#workspace'},{label:'Professional development',href:'#development'},{label:'Instructor learning paths',href:'#paths'},{label:'Long course collection for teaching and assessment',href:'#collection'},{label:'Course details'}];
export function HeaderActionsExample() {
  const [result,setResult]=useState('');
  const actions='<SplitAction label="Publish course" items={[{id:"preview",label:"Preview course"},{id:"schedule",label:"Schedule publication"}]} onPress={()=>setResult("Publication requested. Host owns approval and persistence.")} onAction={id=>setResult(id==="preview"?"Preview requested.":"Publication scheduling requested.")} />';
  const body=`<Stack gap={3}>
  <AppPageHeader title="Teaching with clear goals and meaningful assessment" headingLevel={2} hierarchy="primary" breadcrumbs={${JSON.stringify(breadcrumbs)}} description="A deep course hierarchy with a host-owned primary action." actionButtons={${actions}} />
  <Typography role="status">{result}</Typography>
</Stack>`;
  return <Example title="Primary actions and deep breadcrumbs" description="The neutral split action occupies the public actionButtons slot. A five-level hierarchy condenses middle ancestors into Show path while preserving the current page; long labels wrap in narrow hosts. The host owns navigation, publication and approvals." source={exampleSource({name:'CourseHeaderActions',imports:["import {AppPageHeader} from '@structured-growth/sg-ui/components';","import {SplitAction} from '@structured-growth/sg-ui/experimental';","import {Stack,Typography} from '@structured-growth/sg-ui/primitives';"],state:`  const [result,setResult]=useState(${literal(result)});`,body})}>
    <Stack gap={3}><AppPageHeader title="Teaching with clear goals and meaningful assessment" headingLevel={2} hierarchy="primary" breadcrumbs={breadcrumbs} description="A deep course hierarchy with a host-owned primary action." actionButtons={<SplitAction label="Publish course" items={[{id:'preview',label:'Preview course'},{id:'schedule',label:'Schedule publication'}]} onPress={()=>setResult('Publication requested. Host owns approval and persistence.')} onAction={id=>setResult(id==='preview'?'Preview requested.':'Publication scheduling requested.')}/>}/><Typography role="status">{result}</Typography></Stack>
  </Example>;
}
