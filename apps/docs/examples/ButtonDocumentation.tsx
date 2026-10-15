'use client';
import {useState} from 'react';
import {Button, ButtonGroup, Checkbox, Select, TextField, Box, Stack, Typography, Surface, Link, Table, TableHead, TableBody, TableRow, TableCell, TableHeaderCell} from '@structured-growth/sg-ui/experimental';
import type {ButtonProps} from '@structured-growth/sg-ui/experimental';
import {type Density} from '@structured-growth/sg-ui/theme';
import {AddIcon, ChevronRightIcon} from '@structured-growth/sg-ui/icons';
import {Example} from '../components/Example';
import {useExampleSource} from './useExampleSource';
import {literal} from './source';
import composition from '../content/component-composition.json';
import styles from '../components/docs.module.css';

const buttonImport="import { Button } from '@structured-growth/sg-ui/experimental';";
const iconImport="import { AddIcon, ChevronRightIcon } from '@structured-growth/sg-ui/icons';";

export function ButtonOverview() {
  const source=useExampleSource();
  return <Example title="Button at a glance" previewOnly source={source({name:'BasicButton',imports:[buttonImport],body:'<Button>Continue</Button>'})}><Button>Continue</Button></Example>;
}

function UsedIn() {
  const parents=Object.entries(composition).flatMap(([slug,groups])=>groups.filter(group=>group.children.some(child=>child.slug==='owned-button' && child.name==='Button')).map(group=>({slug,name:group.name}))).sort((a,b)=>a.name.localeCompare(b.name));
  return <Surface as="section" aria-label="Used In" variant="outlined" padding={4}><Stack gap={3}>
    <Typography as="h2" variant="h5">Used In</Typography>
    <Stack direction="row" wrap gap={3}>{parents.map(parent=><Link key={`${parent.slug}-${parent.name}`} href={`/docs/components/${parent.slug}#composition-${parent.name}`}>{parent.name}</Link>)}</Stack>
  </Stack></Surface>;
}

const props=[
  ['children','ReactNode','—','Visible label or content. Prefer a clear action verb.'],
  ['variant','filled | outlined | text','filled','Visual treatment; pair with tone to choose emphasis.'],
  ['tone','primary | neutral','primary','Action color role. Does not change native behavior.'],
  ['startIcon','ReactNode','—','Optional leading icon; hidden from assistive technology. Loading replaces it with a progress indicator.'],
  ['endIcon','ReactNode','—','Optional trailing icon; hidden from assistive technology. Remains visible during loading.'],
  ['density','compact | comfortable','Inherited','Override scope density for this button. General scopes default to comfortable.'],
  ['disabled','boolean','false','Prevents activation and removes the button from normal tab order.'],
  ['loading','boolean','false','Shows pending progress and suppresses activation while preserving the label.'],
  ['onPress','() => void','—','One host callback for pointer, keyboard and touch activation; no event argument.'],
  ['type','button | submit | reset','button','Use submit/reset within a native form. The host handles validation and persistence.'],
  ['name / value','string','—','Native form submission name/value.'],
  ['form','string','—','Associate the button with a form by ID.'],
  ['formAction / formEncType / formMethod / formNoValidate / formTarget','Native button attributes','—','Native submit overrides; used with type="submit".'],
  ['aria-*','Accessibility attributes (React.AriaAttributes)','—','Accessible names, descriptions and relationships. Visible text normally supplies the name.'],
  ['id / title / autoFocus / tabIndex / slot','Native button attributes','—','Native identification, focus and composition attributes.'],
  ['className / style','string / CSSProperties','—','Native styling hooks; prefer the owned variants and theme tokens.'],
  ['ref','Ref<HTMLButtonElement>','—','Forwarded native button reference.'],
];
const buttonSetup = `'use client';

import '@structured-growth/sg-ui/styles.css';
import { Provider } from '@structured-growth/sg-ui/theme';
import { Button } from '@structured-growth/sg-ui/experimental';

export default function ButtonSetup() {
  return <Provider theme="light"><Button>Continue</Button></Provider>;
}`;
export function ButtonDocumentation() {
  return <Surface as="section" aria-label="Button documentation" variant="outlined" padding={4}><Stack gap={4}>
    <Typography as="h2" variant="h5">Documentation</Typography>
    <Stack as="section" aria-label="Button setup" gap={2}>
      <Typography as="h3" variant="h6">Setup</Typography>
      <Typography>Load the stylesheet once in your application and place Button within Provider or an existing ThemeScope. A shared application-level Provider can wrap all your components; you do not need a new provider for each button.</Typography>
      <Typography as="code" variant="code" tabIndex={0} aria-label="Button setup code" className={styles.code}>{buttonSetup}</Typography>
      <Typography>See <Link href="/installation">Installation</Link> for application setup and <Link href="/theming">Theming</Link> for theme configuration. The playground’s Demo settings affect previews only; copied component examples assume this setup already exists.</Typography>
    </Stack>
    <Stack as="section" aria-label="Button prop reference" gap={2}>
      <Typography as="h3" variant="h6">Props</Typography>
      <Typography tone="muted">The public props below control appearance, state and native button behavior.</Typography>
      <Box style={{overflowX:'auto'}}><Table aria-label="Button props" style={{minWidth:'48rem'}}><TableHead><TableRow>{['Prop','Type','Default','Purpose'].map(name=><TableHeaderCell key={name}>{name}</TableHeaderCell>)}</TableRow></TableHead><TableBody>{props.map(([name,type,value,description])=><TableRow key={name}><TableHeaderCell scope="row">{name}</TableHeaderCell><TableCell>{type}</TableCell><TableCell>{value}</TableCell><TableCell>{description}</TableCell></TableRow>)}</TableBody></Table></Box>
    </Stack>
    <Stack as="section" aria-label="Button behavior and accessibility" gap={2}>
      <Typography as="h3" variant="h6">Behavior and accessibility</Typography>
      <Typography>Tab moves focus to an enabled button. Enter, Space, pointer and touch activation call onPress once per activation, without an event argument. The default type is button, so it does not submit a form.</Typography>
      <Typography>disabled blocks activation and removes the button from normal tab order. loading blocks activation but, when disabled is false, keeps the button focusable. It preserves the label, replaces startIcon with a progress indicator labelled “Pending”, and leaves endIcon visible.</Typography>
      <Typography>Use clear visible text as the accessible name. startIcon and endIcon are decorative and hidden from assistive technology; do not rely on them to communicate the action. For an icon-only action, use <Link href="/docs/components/icon-button">IconButton</Link> with its required accessible label.</Typography>
      <Typography>aria-* are standard accessibility attributes, not an extra component. aria-label supplies an accessible name when needed; keep it consistent with the visible label. aria-describedby points to the ID of supporting text elsewhere. The component preserves keyboard focus indicators, respects reduced motion and supports system forced colors.</Typography>
      <Typography>type="submit" and type="reset" use native form behavior. A supplied onPress runs before that native action; pending or disabled buttons suppress activation. Native submit participates in browser validation. Reset restores uncontrolled fields; controlled field state must be reset by the application.</Typography>
    </Stack>
    <Stack as="section" aria-label="Button host responsibilities" gap={2}>
      <Typography as="h3" variant="h6">Host responsibilities</Typography>
      <Typography>Implement the action through onPress, or handle submission through the form’s onSubmit. Choose one place to perform the save so the same request does not run from both callbacks. Button does not fetch data, persist changes or determine permissions.</Typography>
      <Typography>The application owns pending, success and error state. Set loading while asynchronous work runs and clear it when the operation finishes; Button does not automatically await the callback or manage loading. Provide validation messages, retry actions and accessible outcome feedback in the surrounding interface.</Typography>
      <Typography>For forms, own field state, submission, validation and any preventDefault behavior required by your application. For navigation, use <Link href="/docs/components/link">Link</Link> and your routing integration. Supply translated labels and manage the destination or focus transition when an action changes the surrounding interface.</Typography>
    </Stack>
  </Stack></Surface>;
}

function ButtonContains() {
  return <Surface as="section" aria-label="Contains" variant="outlined" padding={4}><Stack gap={3}>
    <Typography as="h2" variant="h5">Contains</Typography>
    <Stack direction="row" wrap gap={3}><Link href="/docs/components/icons">Icons (optional startIcon / endIcon)</Link></Stack>
  </Stack></Surface>;
}
export function ButtonDocumentationIntro() {
  return <ButtonOverview/>;
}

function ButtonPropPlayground() {
  const source=useExampleSource();
  const [label,setLabel]=useState('Publish course');
  const [variant,setVariant]=useState<NonNullable<ButtonProps['variant']>>('filled');
  const [tone,setTone]=useState<NonNullable<ButtonProps['tone']>>('primary');
  const [density,setDensity]=useState<Density>('comfortable');
  const [disabled,setDisabled]=useState(false);
  const [loading,setLoading]=useState(false);
  const [startIcon,setStartIcon]=useState('none');
  const [endIcon,setEndIcon]=useState('none');
  const icons=`${startIcon==='add'?' startIcon={<AddIcon />}':''}${endIcon==='chevron'?' endIcon={<ChevronRightIcon />}':''}`;
  return <Example title="Prop playground" density={density} description="Start with text alone. Add either icon, then compare variant, tone, density and interaction states." controls={<Stack direction="row" wrap gap={3}>
    <TextField label="children (label)" value={label} onValueChange={setLabel}/>
    <Select label="variant" value={variant} options={['filled','outlined','text'].map(id=>({id,label:id}))} onValueChange={value=>setVariant(value as typeof variant)}/>
    <Select label="tone" value={tone} options={['primary','neutral'].map(id=>({id,label:id}))} onValueChange={value=>setTone(value as typeof tone)}/>
    <Select label="startIcon" value={startIcon} options={[{id:'none',label:'None'},{id:'add',label:'Add icon'}]} onValueChange={value=>setStartIcon(value ?? 'none')}/>
    <Select label="endIcon" value={endIcon} options={[{id:'none',label:'None'},{id:'chevron',label:'Chevron right icon'}]} onValueChange={value=>setEndIcon(value ?? 'none')}/>
    <Checkbox label="disabled" checked={disabled} onCheckedChange={setDisabled}/><Checkbox label="loading" checked={loading} onCheckedChange={setLoading}/>
    <Select label="Preview density" value={density} options={[{id:'comfortable',label:'Comfortable'},{id:'compact',label:'Compact'}]} onValueChange={value=>setDensity(value as Density)}/>
  </Stack>} source={source({name:'ButtonPlayground',imports:[buttonImport,...(icons?[iconImport]:[])],body:`<Button variant=${literal(variant)} tone=${literal(tone)} density=${literal(density)} disabled={${disabled}} loading={${loading}}${icons}>{${literal(label)}}</Button>`})}>
    <Button variant={variant} tone={tone} density={density} disabled={disabled} loading={loading} startIcon={startIcon==='add'?<AddIcon/>:undefined} endIcon={endIcon==='chevron'?<ChevronRightIcon/>:undefined}>{label}</Button>
  </Example>;
}

const references=[
  {id:'filled',title:'Filled primary action',props:{},code:'',label:'Save changes'},
  {id:'outlined',title:'Outlined secondary action',props:{variant:'outlined'},code:' variant="outlined"',label:'Save draft'},
  {id:'text',title:'Text action',props:{variant:'text',tone:'neutral'},code:' variant="text" tone="neutral"',label:'Cancel'},
  {id:'start-icon',title:'Leading icon',props:{startIcon:<AddIcon/>},code:' startIcon={<AddIcon />}',label:'Add course'},
  {id:'end-icon',title:'Trailing icon',props:{endIcon:<ChevronRightIcon/>},code:' endIcon={<ChevronRightIcon />}',label:'Continue'},
  {id:'both-icons',title:'Leading and trailing icons',props:{startIcon:<AddIcon/>,endIcon:<ChevronRightIcon/>},code:' startIcon={<AddIcon />} endIcon={<ChevronRightIcon />}',label:'Create course'},
  {id:'disabled',title:'Disabled action',props:{disabled:true},code:' disabled',label:'Publish course'},
  {id:'loading',title:'Loading with icons',props:{loading:true,startIcon:<AddIcon/>,endIcon:<ChevronRightIcon/>},code:' loading startIcon={<AddIcon />} endIcon={<ChevronRightIcon />}',label:'Publishing course'},
  {id:'neutral',title:'Neutral filled action',props:{tone:'neutral'},code:' tone="neutral"',label:'View details'},
] satisfies {id:string;title:string;props:ButtonProps;code:string;label:string}[];
function ButtonReference({index,example}:{index:number;example:typeof references[number]}) {
  const source=useExampleSource();
  return <Example id={`example-${index}-${example.id}`} title={`Button: ${example.title}`} description={example.id==='loading'?'Loading replaces the leading icon with progress; the trailing icon remains.':undefined} source={source({name:`ButtonExample${index}`,imports:[buttonImport,...(example.code.includes('Icon')?[iconImport]:[])],body:`<Button${example.code}>{${literal(example.label)}}</Button>`})}><Button {...example.props}>{example.label}</Button></Example>;
}
function ButtonDensities() {
  const source=useExampleSource();
  return <Example id="example-10-density" title="Button: Compact and comfortable comparison" source={source({name:'ButtonDensities',imports:[buttonImport,"import { Stack } from '@structured-growth/sg-ui/experimental';"],body:'<Stack direction="row" wrap gap={3}><Button density="compact">Save changes</Button><Button density="comfortable">Save changes</Button></Stack>'})}><Stack direction="row" wrap gap={3}><Button density="compact">Save changes</Button><Button density="comfortable">Save changes</Button></Stack></Example>;
}
function ButtonComposition() {
  const source=useExampleSource();
  return <Example id="example-11-group" title="Button: Grouped document actions" source={source({name:'GroupedButtons',imports:["import { Button, ButtonGroup } from '@structured-growth/sg-ui/experimental';"],body:'<ButtonGroup label="Document actions" joined><Button>Save</Button><Button variant="outlined" tone="neutral">Save draft</Button></ButtonGroup>'})}><ButtonGroup label="Document actions" joined><Button>Save</Button><Button variant="outlined" tone="neutral">Save draft</Button></ButtonGroup></Example>;
}
function ButtonPressAction() {
  const [saved,setSaved]=useState(false);
  const source=useExampleSource();
  return <Example id="example-12-press" title="Button: Host-owned press action" description="The host updates the label after activation. Connect persistence in your application." source={source({name:'SaveButton',imports:[buttonImport],state:`  const [saved,setSaved]=useState(${saved});`,body:'<Button onPress={() => setSaved(true)}>{saved ? "Saved" : "Save changes"}</Button>'})}><Button onPress={()=>setSaved(true)}>{saved?'Saved':'Save changes'}</Button></Example>;
}
function ButtonForm() {
  const [submitted,setSubmitted]=useState(false);
  const source=useExampleSource();
  return <Example id="example-13-form" title="Button: Native submit and reset" description="Submit uses browser validation. Reset restores the native field; the host handles persistence." source={source({name:'ButtonForm',imports:["import { Button, Stack, TextField } from '@structured-growth/sg-ui/experimental';"],state:`  const [submitted,setSubmitted]=useState(${submitted});`,body:'<form onSubmit={event => { event.preventDefault(); setSubmitted(true); }} onReset={() => setSubmitted(false)}><Stack gap={3}><TextField label="Course name" name="course" defaultValue="Learning foundations" required/><Stack direction="row" gap={3}><Button type="submit">{submitted ? "Submitted" : "Submit course"}</Button><Button type="reset" variant="text" tone="neutral">Reset</Button></Stack></Stack></form>'})}><form onSubmit={event=>{event.preventDefault();setSubmitted(true);}} onReset={()=>setSubmitted(false)}><Stack gap={3}><TextField label="Course name" name="course" defaultValue="Learning foundations" required/><Stack direction="row" gap={3}><Button type="submit">{submitted?'Submitted':'Submit course'}</Button><Button type="reset" variant="text" tone="neutral">Reset</Button></Stack></Stack></form></Example>;
}
export function ButtonExamples() {
  return <Stack gap={4}><ButtonPropPlayground/><Typography as="h2" variant="h4">Examples</Typography>
    {references.map((example,index)=><ButtonReference key={example.id} index={index+1} example={example}/>)}<ButtonDensities/><ButtonComposition/><ButtonPressAction/><ButtonForm/><ButtonContains/><UsedIn/>
  </Stack>;
}
