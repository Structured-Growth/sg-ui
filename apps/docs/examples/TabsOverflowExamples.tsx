'use client';
import {useState} from 'react';
import {Tabs,Typography,Stack} from '@structured-growth/sg-ui/experimental';
import type {TabItem} from '@structured-growth/sg-ui/experimental';
import type {Density} from '@structured-growth/sg-ui/theme';
import {Example} from '../components/Example';
import {useExampleSource} from './useExampleSource';
import {literal} from './source';

const sections=['Overview','Lessons','Learners','Assignments','Discussions','Resources','Calendar','Grades','Settings','Analytics','Certificates','Integrations','Accessibility and accommodations with a deliberately very long section name','Activity log','Legacy reports'];
function OverflowExample({secondary,density,overflow='menu'}:{secondary:boolean;density:Density;overflow?:'scroll'|'menu'}) {
  const [selected,setSelected]=useState('section-0');
  const source=useExampleSource();
  const names=secondary?['Overview','Lessons','Activity log','Advanced settings']:sections;
  const items:TabItem[]=names.map((label,index)=>({id:`section-${index}`,label,content:<Typography>{`${label}: content supplied by the host.`}</Typography>,...(secondary&&index>=2?{priority:'secondary' as const}:{}),...(!secondary&&index===14?{disabled:true}:{})}));
  const title=`${secondary?'Secondary tabs in the menu':overflow==='scroll'?'Fifteen scrolling tabs':'Fifteen tabs with overflow'} · ${density}`;
  const body='<Tabs label="Course sections" overflow="'+overflow+'" value={selected} onValueChange={setSelected} items={[\n'+items.map(item=>'{ id: '+literal(item.id)+', label: '+literal(item.label)+(item.priority?', priority: '+literal(item.priority):'')+(item.disabled?', disabled: true':'')+', content: <Typography>{'+literal(item.label+': content supplied by the host.')+'}</Typography> }').join(',\n')+'\n]}/>';
  return <Example title={title} density={density} description={overflow==='scroll'?'Scroll horizontally through all 15 sections. Keyboard navigation reveals the focused tab without moving the surrounding page.':secondary?'Secondary sections stay in the menu even with spare room. Selecting one promotes it into the final visible position.':'Choose a hidden section to place it last in the visible row. Long titles truncate in the row and remain complete in the menu; unavailable sections cannot be selected.'} source={source({name:secondary?'SecondaryTabs':overflow==='scroll'?'ScrollingTabs':'OverflowTabs',imports:["import { Tabs, Typography } from '@structured-growth/sg-ui/experimental';"],state:`  const [selected,setSelected]=useState(${literal(selected)});`,body})}>
    <Tabs label="Course sections" overflow={overflow} items={items} value={selected} onValueChange={setSelected}/>
  </Example>;
}
export function TabsOverflowExamples() {
  return <Stack gap={4}>{([false,true] as const).flatMap(secondary=>(['compact','comfortable'] as const).map(density=><OverflowExample key={`${secondary}-${density}`} secondary={secondary} density={density}/>))}{(['compact','comfortable'] as const).map(density=><OverflowExample key={`scroll-${density}`} secondary={false} density={density} overflow="scroll"/>)}</Stack>;
}
