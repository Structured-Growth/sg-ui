'use client';
import {useState} from 'react';
import {TextField,TextArea} from '@structured-growth/sg-ui/experimental';
import {Box,Stack} from '@structured-growth/sg-ui/primitives';
import type {Density} from '@structured-growth/sg-ui/theme';
import {Example} from '../components/Example';
import {exampleSource,literal} from './source';

type Kind='TextField'|'TextArea';
const fields=[
 {label:'Display name',description:'Shown in the course list.'},
 {label:'Internal name',description:'Use a name people recognize when browsing courses and reports.'},
 {label:'Reference code',description:'A code for this course.'},
];
export function FieldMessageExamples({kind}:{kind:Kind}){
 return <Stack gap={4}>{(['compact','comfortable'] as const).flatMap(density=>(['above','below'] as const).map(placement=><FieldMessageExample key={`${density}-${placement}`} kind={kind} density={density} placement={placement}/>))}</Stack>;
}
function FieldMessageExample({kind,density,placement}:{kind:Kind;density:Density;placement:'above'|'below'}){
 const [values,setValues]=useState(['Design systems','Design systems curriculum','DS-101']);
 const Component=kind==='TextField'?TextField:TextArea;
 const align=placement==='above'?'end':'start';
 const body=`<Stack direction="row" wrap align=${literal(align)} gap={4}>\n${fields.map((field,index)=>`  <Box style={{inlineSize:'14rem',maxInlineSize:'100%'}}>\n    <${kind} label={${literal(field.label)}} description={${literal(field.description)}} descriptionPlacement=${literal(placement)} errorPlacement=${literal(placement)}${index===2?' invalid errorMessage="Use a unique reference code."':''} value={values[${index}]} onValueChange={value=>setValues(current=>current.map((item,index)=>index===${index}?value:item))}/>\n  </Box>`).join('\n')}\n</Stack>`;
 return <Example title={`Messages ${placement} input — ${density}`} density={density} description={placement==='above'?'Descriptions and validation messages precede the input. The row aligns fields at their lower edge so inputs line up despite different message heights.':'Descriptions and validation messages follow the input. The row aligns fields at their upper edge.'} source={exampleSource({name:'FieldMessages',imports:[`import {${kind}} from '@structured-growth/sg-ui/experimental';`,"import {Box,Stack} from '@structured-growth/sg-ui/primitives';"],state:`  const [values,setValues]=useState(${JSON.stringify(values)});`,body:`<ThemeScope density=${literal(density)}>\n${body}\n</ThemeScope>`})}>
  <Stack direction="row" wrap align={align} gap={4}>{fields.map((field,index)=><Box key={field.label} style={{inlineSize:'14rem',maxInlineSize:'100%'}}><Component {...field} descriptionPlacement={placement} errorPlacement={placement} invalid={index===2} errorMessage={index===2?'Use a unique reference code.':undefined} value={values[index]} onValueChange={value=>setValues(current=>current.map((item,itemIndex)=>itemIndex===index?value:item))}/></Box>)}</Stack>
 </Example>;
}
