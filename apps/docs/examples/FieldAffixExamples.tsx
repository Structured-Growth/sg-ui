'use client';
import {useState} from 'react';
import {TextField,Stack,Button,Typography} from '@structured-growth/sg-ui/primitives';
import {SchoolIcon,SearchIcon} from '@structured-growth/sg-ui/icons';
import {ThemeScope,type Density} from '@structured-growth/sg-ui/theme';
import {Example} from '../components/Example';
import {exampleSource,literal} from './source';
type Appearance='inline'|'subtle';
type Kind='currency'|'unit'|'domain'|'icon'|'combined';
const configurations={
 currency:{label:'Amount in whole US dollars',prefix:'$',suffix:'.00',description:'Enter whole dollars. The fixed symbols are not part of the editable value.',initial:'25'},
 unit:{label:'Weight in kilograms',prefix:undefined,suffix:'kg',description:'Enter the measurement without the unit.',initial:'12.5'},
 domain:{label:'Workspace subdomain on example.com',prefix:'https://',suffix:'.example.com',description:'Enter only the workspace name. The host builds and validates the complete URL.',initial:'courses'},
 icon:{label:'Course code',prefix:<SchoolIcon size={16}/>,suffix:'catalog',description:'A non-interactive icon can occupy the prefix slot, beside fixed text at the end.',initial:'SG101'},
 combined:{label:'Course code in the public catalog',prefix:'SG-',suffix:'public',description:'Icon slots and text affixes can coexist. Keep units and meaning in the label or guidance.',initial:'101'},
};
export function FieldAffixExamples(){
 return <Stack gap={4}>
  {(['inline','subtle'] as const).flatMap(appearance=>(['compact','comfortable'] as const).map(density=><AffixReference key={`${appearance}-${density}`} kind="currency" title={`Whole dollars · ${appearance} · ${density}`} appearance={appearance} density={density}/>))}
  <AffixReference kind="unit" title="Measurement suffix"/>
  <AffixReference kind="domain" title="Fixed URL parts" appearance="subtle"/>
  <AffixReference kind="icon" title="Icon prefix and text suffix"/>
  <AffixReference kind="combined" title="Icons with text affixes" appearance="subtle"/>
  <AffixReference kind="currency" title="Read-only amount" readOnly appearance="subtle"/>
  <AffixReference kind="currency" title="Disabled amount" disabled appearance="subtle"/>
  <AffixReference kind="currency" title="Amount validation" invalid/>
  <AffixRtlExample/>
  <WholeDollarForm/>
 </Stack>;
}
function AffixReference({kind,title,appearance='inline',density='comfortable',disabled=false,readOnly=false,invalid=false}:{kind:Kind;title:string;appearance?:Appearance;density?:Density;disabled?:boolean;readOnly?:boolean;invalid?:boolean}){
 const config=configurations[kind];
 const [value,setValue]=useState(config.initial);
 const prefixCode=kind==='icon'?'<SchoolIcon size={16}/>':literal(typeof config.prefix==='string'?config.prefix:'');
 const iconImports=kind==='icon'||kind==='combined'?[`import {${kind==='icon'?'SchoolIcon':'SearchIcon,SchoolIcon'}} from '@structured-growth/sg-ui/icons';`]:[];
 const numeric=kind==='currency'||kind==='unit';
 const iconCode=kind==='combined'?' startIcon={<SearchIcon size={16}/>} endIcon={<SchoolIcon size={16}/>}':'';
 const props=`label={${literal(config.label)}} description={${literal(config.description)}} prefix={${prefixCode}} suffix={${literal(config.suffix)}} affixAppearance="${appearance}" density="${density}" value={value} onValueChange={setValue}${numeric?` inputMode="${kind==='currency'?'numeric':'decimal'}"`:''}${kind==='currency'?' pattern="[0-9]+"':''} disabled={${disabled}} readOnly={${readOnly}} invalid={${invalid}}${invalid?' errorMessage="Review the amount before continuing."':''}${iconCode}`;
 return <Example title={title} density={density} source={exampleSource({name:'AffixedField',imports:["import {TextField} from '@structured-growth/sg-ui/primitives';",...iconImports],state:`  const [value,setValue]=useState(${literal(value)});`,body:`<TextField ${props}/>`})}>
  <TextField label={config.label} description={config.description} prefix={config.prefix} suffix={config.suffix} affixAppearance={appearance} density={density} value={value} onValueChange={setValue} inputMode={numeric?kind==='currency'?'numeric':'decimal':undefined} pattern={kind==='currency'?'[0-9]+':undefined} disabled={disabled} readOnly={readOnly} invalid={invalid} errorMessage={invalid?'Review the amount before continuing.':undefined} startIcon={kind==='combined'?<SearchIcon size={16}/>:undefined} endIcon={kind==='combined'?<SchoolIcon size={16}/>:undefined}/>
 </Example>;
}
function AffixRtlExample(){
 const [value,setValue]=useState('25');
 const body='<ThemeScope dir="rtl"><TextField label="المبلغ بالدولار الأمريكي" description="أدخل مبلغًا بالدولارات الكاملة" prefix="$" suffix=".00" affixAppearance="subtle" inputMode="numeric" value={value} onValueChange={setValue}/></ThemeScope>';
 return <Example title="Affixes in right-to-left layout" description="Prefix and suffix follow the logical start and end. The host supplies localized labels and currency conventions." source={exampleSource({name:'RtlAffixes',imports:["import {TextField} from '@structured-growth/sg-ui/primitives';"],state:`  const [value,setValue]=useState(${literal(value)});`,body})}>
  <ThemeScope dir="rtl"><TextField label="المبلغ بالدولار الأمريكي" description="أدخل مبلغًا بالدولارات الكاملة" prefix="$" suffix=".00" affixAppearance="subtle" inputMode="numeric" value={value} onValueChange={setValue}/></ThemeScope>
 </Example>;
}
function WholeDollarForm(){
 const [result,setResult]=useState('');
 const body='<form onSubmit={event=>{event.preventDefault();const data=new FormData(event.currentTarget);setResult(`Draft amount: USD ${data.get("amount")}.00`);}} onReset={()=>setResult("")}><Stack gap={3}><TextField label="Amount in whole US dollars" description="Enter whole dollars using digits only. Cents are fixed at zero." name="amount" prefix="$" suffix=".00" affixAppearance="subtle" inputMode="numeric" pattern="[0-9]+" required defaultValue="25" errorMessage="Enter a whole-dollar amount using digits only."/><Stack direction="row" gap={2}><Button type="submit">Review amount</Button><Button type="reset" variant="outlined">Reset amount</Button></Stack>{result&&<Typography role="status">{result}</Typography>}</Stack></form>';
 return <Example title="Whole-dollar native form" description="The native pattern validates whole-dollar digits. Input mode suggests a numeric keyboard; it does not enforce validation. Reviewing creates a local draft, without persistence." source={exampleSource({name:'WholeDollarForm',imports:["import {TextField,Stack,Button,Typography} from '@structured-growth/sg-ui/primitives';"],state:`  const [result,setResult]=useState(${literal(result)});`,body})}>
  <form onSubmit={event=>{event.preventDefault();const data=new FormData(event.currentTarget);setResult(`Draft amount: USD ${data.get('amount')}.00`);}} onReset={()=>setResult('')}><Stack gap={3}>
   <TextField label="Amount in whole US dollars" description="Enter whole dollars using digits only. Cents are fixed at zero." name="amount" prefix="$" suffix=".00" affixAppearance="subtle" inputMode="numeric" pattern="[0-9]+" required defaultValue="25" errorMessage="Enter a whole-dollar amount using digits only."/>
   <Stack direction="row" gap={2}><Button type="submit">Review amount</Button><Button type="reset" variant="outlined">Reset amount</Button></Stack>{result&&<Typography role="status">{result}</Typography>}
  </Stack></form>
 </Example>;
}
